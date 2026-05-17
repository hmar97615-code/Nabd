import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Utensils, RefreshCw, Edit3 } from 'lucide-react';
import NutritionDashboard from './NutritionDashboard';
import MealEditor from './MealEditor';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { calculatePlanDetails } from '../lib/planUtils';
import { replaceMeal, generateNutritionPlan } from '../lib/gemini';
import { toast } from 'sonner';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  height?: number;
  weight?: number;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  age?: number;
  healthStatus?: string;
  dietaryPreferences?: string;
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'fitness';
  budgetLevel?: 'low' | 'medium' | 'high';
  role: 'user' | 'coach' | 'admin';
  playsSports?: boolean;
  selectedSports?: { sportId: string, goalIds: string[] }[];
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  targetWeight?: number;
  targetDate?: string;
  targetCalories?: number;
  credits?: number;
  aiNutritionPlan?: string | any;
  onboarded: boolean;
}

export default function NutritionModule({ user, onUpdate }: { user: UserProfile, onUpdate: (u: UserProfile) => void }) {
  const [meals, setMeals] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'log' | 'plan'>('log');
  const [replacingMealIndex, setReplacingMealIndex] = useState<number | null>(null);
  const [replaceConstraints, setReplaceConstraints] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const logDocRef = doc(db, 'users', user.uid, 'dailyLogs', today);

  const targets = useMemo(() => {
    const plan = calculatePlanDetails(user as any);
    return {
      calories: plan.calorieGoal,
      protein: plan.macros.protein,
      carbs: plan.macros.carbs,
      fats: plan.macros.fats,
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(logDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setMeals(docSnap.data().meals || []);
      } else {
        setMeals([]);
      }
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error("Firestore error in NutritionModule:", err);
      setError("Failed to load nutrition data. Please check your connection.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid, today]);

  const handleAddMeal = () => {
    setEditingMeal(null);
    setShowEditor(true);
  };

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal);
    setShowEditor(true);
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const updatedMeals = meals.filter(m => m.id !== mealId);
      const newTotals = updatedMeals.reduce((acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fats: acc.fats + (m.fats || 0),
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

      await setDoc(logDocRef, { 
        meals: updatedMeals,
        totalCalories: newTotals.calories,
        totalProtein: newTotals.protein,
        totalCarbs: newTotals.carbs,
        totalFats: newTotals.fats,
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'dailyLogs');
    }
  };

  const handleSaveMeal = async (mealData: any) => {
    try {
      const mealToSave = {
        ...mealData,
        id: editingMeal?.id || Date.now().toString(),
        timestamp: new Date().toISOString()
      };

      let updatedMeals;
      if (editingMeal) {
        updatedMeals = meals.map(m => m.id === editingMeal.id ? mealToSave : m);
      } else {
        updatedMeals = [...meals, mealToSave];
      }

      const newTotals = updatedMeals.reduce((acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fats: acc.fats + (m.fats || 0),
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

      await setDoc(logDocRef, { 
        meals: updatedMeals,
        totalCalories: newTotals.calories,
        totalProtein: newTotals.protein,
        totalCarbs: newTotals.carbs,
        totalFats: newTotals.fats,
        userId: user.uid,
        date: today
      }, { merge: true });

      setShowEditor(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'dailyLogs');
    }
  };

  const handleReplaceMeal = async () => {
    if (replacingMealIndex === null || !user.aiNutritionPlan?.meals) return;
    
    const cost = 10;
    if ((user.credits || 0) < cost) {
      toast.error(`Insufficient balance. You need ${cost} points to replace a meal.`);
      return;
    }

    setIsReplacing(true);
    try {
      const currentMeal = user.aiNutritionPlan.meals[replacingMealIndex];
      const targetMacros = {
        protein: currentMeal.protein,
        carbs: currentMeal.carbs,
        fats: currentMeal.fats
      };
      
      const newMeal = await replaceMeal(currentMeal, currentMeal.calories, replaceConstraints, targetMacros);
      
      if (newMeal) {
        const updatedMeals = [...user.aiNutritionPlan.meals];
        updatedMeals[replacingMealIndex] = newMeal;
        
        const updatedPlan = {
          ...user.aiNutritionPlan,
          meals: updatedMeals
        };
        
        const newCredits = (user.credits || 0) - cost;
        await updateDoc(doc(db, 'users', user.uid), {
          aiNutritionPlan: updatedPlan,
          credits: newCredits
        });
        
        await setDoc(doc(db, 'users', user.uid, 'plans', 'nutrition'), updatedPlan);
        onUpdate({ ...user, credits: newCredits, aiNutritionPlan: updatedPlan });
      }
      
      setReplacingMealIndex(null);
      setReplaceConstraints('');
      toast.success("Meal replaced successfully!");
    } catch (error) {
      console.error("Error replacing meal:", error);
      toast.error("Failed to replace meal. Please try again.");
    } finally {
      setIsReplacing(false);
    }
  };

  const handleRegeneratePlan = async () => {
    const cost = 50;
    if ((user.credits || 0) < cost) {
      toast.error(`Insufficient balance. You need ${cost} points to regenerate the plan.`);
      return;
    }

    setIsRegenerating(true);
    try {
      const planDetails = calculatePlanDetails(user as any);
      const targetCalories = planDetails.calorieGoal;
      const targetMacros = planDetails.macros;

      const nutritionPlanData = await generateNutritionPlan(user, targetCalories, targetMacros);

      const totalMacros = nutritionPlanData.meals.reduce((acc: any, m: any) => ({
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fats: acc.fats + (m.fats || 0),
      }), { protein: 0, carbs: 0, fats: 0 });

      const fullNutritionPlan = {
        ...nutritionPlanData,
        planTitle: `AI Plan for ${user.displayName || 'User'}`,
        totalMacros,
        targetCalories,
        createdAt: new Date().toISOString(),
        isAI: true
      };

      const newCredits = (user.credits || 0) - cost;
      await updateDoc(doc(db, 'users', user.uid), {
        aiNutritionPlan: fullNutritionPlan,
        credits: newCredits
      });
      
      await setDoc(doc(db, 'users', user.uid, 'plans', 'nutrition'), fullNutritionPlan);
      onUpdate({ ...user, credits: newCredits, aiNutritionPlan: fullNutritionPlan });
      toast.success("Nutrition plan regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating plan:", error);
      toast.error("Failed to regenerate plan. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-4 md:space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-display">Nutrition Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your daily meals and follow your personalized plan.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveView('log')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeView === 'log' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Daily Log
          </button>
          <button 
            onClick={() => setActiveView('plan')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeView === 'plan' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Nutrition Plan
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100">
          <p className="font-bold mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm underline hover:no-underline"
          >
            Try reloading the page
          </button>
        </div>
      ) : activeView === 'plan' ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Target size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-display">Your AI Nutrition Plan</h2>
                  <p className="text-slate-500 font-medium">Personalized recommendations based on your goals.</p>
                </div>
              </div>
              {user.aiNutritionPlan && (
                <button
                  onClick={handleRegeneratePlan}
                  disabled={isRegenerating}
                  className="px-4 py-3 md:py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 w-full md:w-auto"
                >
                  <RefreshCw size={16} className={isRegenerating ? "animate-spin" : ""} />
                  {isRegenerating ? "Regenerating..." : "Regenerate Plan"}
                </button>
              )}
            </div>

            {user.aiNutritionPlan ? (
              <div className="prose prose-slate max-w-none">
                <div className="bg-slate-50/50 rounded-[32px] p-6 md:p-10 border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {typeof user.aiNutritionPlan === 'string' ? (
                    user.aiNutritionPlan
                  ) : (
                    <div className="space-y-6">
                      {user.aiNutritionPlan.planTitle && (
                        <h3 className="text-xl font-black text-slate-900">{user.aiNutritionPlan.planTitle}</h3>
                      )}
                      {user.aiNutritionPlan.healthAdvice && (
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-800 border border-blue-100">
                          <p className="font-bold mb-1">Health Advice:</p>
                          {user.aiNutritionPlan.healthAdvice}
                        </div>
                      )}
                      {user.aiNutritionPlan.meals && Array.isArray(user.aiNutritionPlan.meals) && (
                        <div className="space-y-4">
                          <p className="font-bold text-slate-900">Recommended Meals:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.aiNutritionPlan.meals.map((m: any, i: number) => (
                              <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                <div>
                                  <p className="font-bold text-emerald-600 text-xs uppercase tracking-widest mb-1">{m.mealType || m.type}</p>
                                  <p className="text-slate-900 font-black text-lg">{m.name}</p>
                                  <p className="text-xs text-slate-500 mb-4">{m.calories} kcal • {m.protein}g P • {m.carbs}g C • {m.fats}g F</p>
                                  
                                  {m.ingredients && m.ingredients.length > 0 && (
                                    <div className="mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                      <p className="text-[11px] font-bold text-slate-900 mb-1.5 uppercase tracking-wider">Ingredients</p>
                                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                        {m.ingredients.map((ing: string, idx: number) => <li key={idx}>{ing}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {m.preparation && (
                                    <div className="mb-4 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                      <p className="text-[11px] font-bold text-emerald-900 mb-1.5 uppercase tracking-wider">Preparation</p>
                                      <p className="text-xs text-emerald-700 leading-relaxed">{m.preparation}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={async () => {
                                      try {
                                        const mealToSave = {
                                          name: m.name,
                                          calories: Number(m.calories),
                                          protein: Number(m.protein),
                                          carbs: Number(m.carbs),
                                          fats: Number(m.fats),
                                          id: Date.now().toString() + i,
                                          timestamp: new Date().toISOString(),
                                          isFromPlan: true
                                        };
                                        
                                        const updatedMeals = [...meals, mealToSave];
                                        const newTotals = updatedMeals.reduce((acc, meal) => ({
                                          calories: acc.calories + (meal.calories || 0),
                                          protein: acc.protein + (meal.protein || 0),
                                          carbs: acc.carbs + (meal.carbs || 0),
                                          fats: acc.fats + (meal.fats || 0),
                                        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

                                        await setDoc(logDocRef, { 
                                          meals: updatedMeals,
                                          totalCalories: newTotals.calories,
                                          totalProtein: newTotals.protein,
                                          totalCarbs: newTotals.carbs,
                                          totalFats: newTotals.fats,
                                          userId: user.uid,
                                          date: today
                                        }, { merge: true });
                                        
                                        toast.success(`Successfully logged ${m.name}!`);
                                        setActiveView('log');
                                      } catch (error) {
                                        handleFirestoreError(error, OperationType.WRITE, 'dailyLogs');
                                      }
                                    }}
                                    className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                  >
                                    <Utensils size={14} />
                                    Log
                                  </button>
                                  <button
                                    onClick={() => setReplacingMealIndex(i)}
                                    className="px-3 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
                                    title="Replace Meal"
                                  >
                                    <Edit3 size={14} />
                                    <span className="hidden sm:inline">Replace</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {user.aiNutritionPlan.totalMacros && (
                        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-200">
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Calories</p>
                            <p className="font-bold text-slate-900">{user.aiNutritionPlan.targetCalories || user.aiNutritionPlan.totalMacros.calories}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Protein</p>
                            <p className="font-bold text-slate-900">{user.aiNutritionPlan.totalMacros.protein}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Carbs</p>
                            <p className="font-bold text-slate-900">{user.aiNutritionPlan.totalMacros.carbs}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Fats</p>
                            <p className="font-bold text-slate-900">{user.aiNutritionPlan.totalMacros.fats}g</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-lg mb-4">No nutrition plan generated yet.</p>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">Complete your profile or ask the AI assistant to generate a personalized plan for you.</p>
              </div>
            )}
          </div>
          <Utensils className="absolute -bottom-10 -right-10 text-emerald-50 opacity-20" size={300} />
        </motion.div>
      ) : (
        <NutritionDashboard 
          meals={meals} 
          targets={targets}
          onAddMeal={handleAddMeal}
          onEditMeal={handleEditMeal}
          onDeleteMeal={handleDeleteMeal}
          onGeneratePlan={handleRegeneratePlan}
        />
      )}

      <AnimatePresence>
        {showEditor && (
          <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                </h2>
                <button 
                  onClick={() => setShowEditor(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <MealEditor 
                meal={editingMeal} 
                user={user}
                onUpdate={onUpdate}
                onSave={handleSaveMeal} 
                onCancel={() => setShowEditor(false)} 
                onDelete={(id) => {
                  handleDeleteMeal(id);
                  setShowEditor(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Replace Meal Modal */}
      <AnimatePresence>
        {replacingMealIndex !== null && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Replace Meal</h3>
                <button 
                  onClick={() => setReplacingMealIndex(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  How would you like to change this meal? The new meal will have the exact same macros and calories.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Preferences</label>
                  <input
                    type="text"
                    value={replaceConstraints}
                    onChange={(e) => setReplaceConstraints(e.target.value)}
                    placeholder="e.g., cheap, fast to make, vegetarian..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleReplaceMeal}
                  disabled={isReplacing || !replaceConstraints.trim()}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isReplacing ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Replacing...
                    </>
                  ) : (
                    "Replace Meal"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
