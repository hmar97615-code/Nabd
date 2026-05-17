import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Utensils,
  Dumbbell,
  Clock,
  Trash2,
  RefreshCw,
  Zap,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { doc, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { SubscriptionModule } from './SubscriptionModule';
import { generateWorkoutPlan, generateNutritionPlan } from '../lib/gemini';
import { calculatePlanDetails } from '../lib/planUtils';

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
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'fitness';
  budgetLevel?: 'low' | 'medium' | 'high';
  dietaryPreferences?: string;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredExerciseSystem?: string;
  role: 'user' | 'coach' | 'admin';
  banned?: boolean;
  playsSports?: boolean;
  selectedSports?: { sportId: string, goalIds: string[] }[];
  onboarded: boolean;
  googleFitTokens?: any;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  targetWeight?: number;
  targetDate?: string;
  targetCalories?: number;
  credits?: number;
  subscriptionType?: string;
  subscriptionExpiry?: string;
  subscriptionStartDate?: string;
  lastResetDate?: string;
  aiWorkoutPlan?: any;
  aiNutritionPlan?: any;
}

export default function PlansModule({ user, onUpdate, view }: { user: UserProfile, onUpdate: (u: UserProfile) => void, view: 'smart' | 'subscriptions' }) {
  const [targetWeight, setTargetWeight] = useState(user.targetWeight?.toString() || '');
  const [targetDate, setTargetDate] = useState(user.targetDate || '');
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleGenerateAIPlan = async () => {
    const cost = 100;
    if (!user.credits || user.credits < cost) {
      alert(`Insufficient credits. You need ${cost} points to generate an AI plan.`);
      return;
    }

    setGeneratingAI(true);
    try {
      const workoutPlan = await generateWorkoutPlan(user);
      
      // Use calculatePlanDetails to get the exact same targets as NutritionModule
      const planDetails = calculatePlanDetails(user);
      const targetCalories = planDetails.calorieGoal;
      const targetMacros = planDetails.macros;

      const nutritionPlanData = await generateNutritionPlan(user, targetCalories, targetMacros);

      // Calculate total macros for the nutrition plan to match NutritionModule structure
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
        createdAt: serverTimestamp(),
        isAI: true
      };

      const fullWorkoutPlan = {
        ...workoutPlan,
        createdAt: serverTimestamp(),
        isAI: true
      };

      const updates = {
        aiWorkoutPlan: fullWorkoutPlan,
        aiNutritionPlan: fullNutritionPlan,
        credits: user.credits - cost
      };

      // Save to user profile for quick access
      await updateDoc(doc(db, 'users', user.uid), updates);
      
      // Also save to the plans subcollection to make them the active plans in Nutrition/Sports modules
      await setDoc(doc(db, 'users', user.uid, 'plans', 'nutrition'), fullNutritionPlan);
      await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), fullWorkoutPlan);

      onUpdate({ ...user, ...updates });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleClearAIPlan = async () => {
    try {
      const updates = {
        aiWorkoutPlan: null,
        aiNutritionPlan: null
      };

      await updateDoc(doc(db, 'users', user.uid), updates);
      onUpdate({ ...user, ...updates });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const calculatePlan = () => {
    if (!user.weight || !targetWeight || !targetDate || !user.height || !user.age) return null;

    const currentWeight = user.weight;
    const goalWeight = parseFloat(targetWeight);
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { error: 'Target date must be in the future' };

    const weightDiff = goalWeight - currentWeight;
    const totalCalorieDiff = weightDiff * 7700; // 1kg ~ 7700 kcal
    const dailyDiff = totalCalorieDiff / diffDays;

    // BMR Calculation (Mifflin-St Jeor)
    let bmr = (10 * currentWeight) + (6.25 * user.height) - (5 * user.age);
    if (user.gender === 'male') bmr += 5;
    else if (user.gender === 'female') bmr -= 161;

    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const tdee = bmr * multipliers[user.activityLevel || 'light'];
    const recommendedCalories = Math.round(tdee + dailyDiff);

    // Safety checks
    const weeklyChange = (weightDiff / diffDays) * 7;
    const isSafe = Math.abs(weeklyChange) <= 1.0; // Max 1kg per week
    const minCalories = user.gender === 'female' ? 1200 : 1500;
    const isCalorieSafe = recommendedCalories >= minCalories;

    return {
      dailyDiff: Math.round(dailyDiff),
      tdee: Math.round(tdee),
      recommendedCalories,
      diffDays,
      weeklyChange: weeklyChange.toFixed(2),
      isSafe,
      isCalorieSafe,
      weightDiff: weightDiff.toFixed(1)
    };
  };

  const plan = calculatePlan();

  const handleSave = async () => {
    if (!targetWeight || !targetDate) return;
    setSaving(true);
    setShowSuccess(false);
    try {
      const updates = {
        targetWeight: parseFloat(targetWeight),
        targetDate: targetDate,
        targetCalories: plan.recommendedCalories
      };
      await updateDoc(doc(db, 'users', user.uid), updates);
      onUpdate({ ...user, ...updates });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!showConfirmCancel) {
      setShowConfirmCancel(true);
      setTimeout(() => setShowConfirmCancel(false), 3000);
      return;
    }

    setSaving(true);
    try {
      const updates = {
        targetWeight: null,
        targetDate: null,
        targetCalories: null
      } as any;
      await updateDoc(doc(db, 'users', user.uid), updates);
      onUpdate({ ...user, ...updates });
      setTargetWeight('');
      setTargetDate('');
      setShowConfirmCancel(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPlan = async (plan: any) => {
    setSaving(true);
    try {
      const expiryDate = new Date();
      if (plan.id === 'monthly') expiryDate.setMonth(expiryDate.getMonth() + 1);
      else if (plan.id === 'quarterly') expiryDate.setMonth(expiryDate.getMonth() + 3);
      else if (plan.id === 'annual') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      else if (plan.id === 'free') expiryDate.setFullYear(expiryDate.getFullYear() + 100); // 100 years for free

      const updates = {
        subscriptionType: plan.id,
        subscriptionExpiry: expiryDate.toISOString(),
        subscriptionStartDate: new Date().toISOString(),
        lastResetDate: new Date().toISOString(),
        credits: plan.credits // Set to plan amount, no carry over
      };
      await updateDoc(doc(db, 'users', user.uid), updates);
      onUpdate({ ...user, ...updates });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {view === 'smart' ? 'Smart Health Plans' : 'Subscription Packages'}
          </h1>
          <p className="text-slate-500">
            {view === 'smart' ? 'Your personalized health plan based on your goals' : 'Subscribe to advanced points packages'}
          </p>
        </div>
      </div>

      {view === 'subscriptions' && user.subscriptionType && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Your Current Subscription</p>
              <h3 className="text-xl font-black text-slate-900">
                {user.subscriptionType === 'monthly' ? 'Fitness Package (Monthly)' : 
                 user.subscriptionType === 'quarterly' ? 'Beast Package (3 Months)' : 
                 user.subscriptionType === 'annual' ? 'Champion Package (Yearly)' : 'Free Package (Basic)'}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Expires on</p>
            <p className="text-lg font-bold text-slate-900">
              {new Date(user.subscriptionExpiry!).toLocaleDateString('en-US')}
            </p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'smart' ? (
          <motion.div
            key="smart"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Target size={20} className="text-emerald-600" />
                  Goal Setting
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 block mb-1">Target Weight (kg)</label>
                    <input 
                      type="number"
                      value={targetWeight}
                      onChange={e => setTargetWeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Example: 75"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-slate-500 block mb-1">Target Date</label>
                    <input 
                      type="date"
                      value={targetDate}
                      onChange={e => setTargetDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving || !targetWeight || !targetDate}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? 'Saving...' : showSuccess ? (
                          <>
                            <CheckCircle2 size={20} />
                            Saved and Synced
                          </>
                        ) : 'Save and Activate Plan'}
                      </button>
                      <button
                        onClick={() => { setTargetWeight(''); setTargetDate(''); }}
                        className="px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                        title="Clear fields"
                      >
                        <RefreshCw size={20} />
                      </button>
                    </div>

                    {user.targetWeight && (
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className={cn(
                          "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2",
                          showConfirmCancel 
                            ? "bg-red-600 text-white border-red-600 hover:bg-red-700" 
                            : "bg-white text-red-600 border-red-100 hover:bg-red-50"
                        )}
                      >
                        <Trash2 size={18} />
                        {showConfirmCancel ? 'Confirm Cancellation?' : 'Cancel Current Plan'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {plan && !('error' in plan) && (
                <div className={cn(
                  "p-6 rounded-3xl border shadow-sm space-y-3",
                  plan.isSafe && plan.isCalorieSafe ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                )}>
                  <div className="flex items-center gap-2 font-bold">
                    {plan.isSafe && plan.isCalorieSafe ? (
                      <CheckCircle2 className="text-emerald-600" size={20} />
                    ) : (
                      <AlertCircle className="text-amber-600" size={20} />
                    )}
                    <span>Plan Analysis</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {plan.isSafe && plan.isCalorieSafe 
                      ? "This plan is safe and health-sustainable."
                      : "Warning: This plan might be too aggressive. Consider increasing the duration."}
                  </p>
                  <div className="text-xs space-y-1 opacity-70">
                    <div>• Weekly Change Rate: {plan.weeklyChange} kg</div>
                    <div>• Recommended Calories: {plan.recommendedCalories} kcal</div>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-6">
              {!plan || ('error' in plan) ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Info size={32} />
                  </div>
                  <div className="text-slate-500">
                    {plan && 'error' in plan ? plan.error : 'Enter target weight and date to view your personalized plan'}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                      <div className="text-slate-500 text-sm font-bold mb-1">Daily Calories</div>
                      <div className="text-3xl font-black text-emerald-600">{plan.recommendedCalories}</div>
                      <div className="text-xs text-slate-400 mt-1">kcal / day</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                      <div className="text-slate-500 text-sm font-bold mb-1">Remaining Duration</div>
                      <div className="text-3xl font-black text-slate-900">{plan.diffDays}</div>
                      <div className="text-xs text-slate-400 mt-1">days to reach goal</div>
                    </div>
                  </div>

                  {/* AI Generation Section */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-3xl text-white shadow-xl shadow-emerald-100 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap size={120} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold">AI Personalized Plan</h3>
                      </div>
                      <p className="text-emerald-50/80 text-sm max-w-md">
                        Get a comprehensive workout and nutrition plan tailored specifically to your sports, goals, and health status using clinical-grade AI.
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        <button
                          onClick={handleGenerateAIPlan}
                          disabled={generatingAI}
                          className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          {generatingAI ? (
                            <>
                              <RefreshCw size={20} className="animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Zap size={20} />
                              {user.aiWorkoutPlan ? 'Regenerate AI Plan' : 'Generate AI Plan'}
                            </>
                          )}
                        </button>
                        {user.aiWorkoutPlan && (
                          <button
                            onClick={handleClearAIPlan}
                            className="bg-red-500/20 text-red-100 px-6 py-4 rounded-2xl font-black hover:bg-red-500/30 transition-all flex items-center gap-2 border border-red-500/30"
                          >
                            <Trash2 size={20} />
                            Clear AI Plan
                          </button>
                        )}
                        <div className="text-xs font-bold text-emerald-100/60 uppercase tracking-widest">
                          Costs 1 Credit
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Plan */}
                  <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                          <Utensils size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {user.aiNutritionPlan ? 'AI Nutrition Plan' : 'Scientific Nutrition Plan'}
                        </h3>
                      </div>
                      {user.aiNutritionPlan && (
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                          AI Generated
                        </div>
                      )}
                    </div>

                    {user.aiNutritionPlan ? (
                      <div className="space-y-6">
                        {typeof user.aiNutritionPlan === 'string' ? (
                          <div className="whitespace-pre-wrap text-slate-600">{user.aiNutritionPlan}</div>
                        ) : (
                          <>
                            {user.aiNutritionPlan.healthAdvice && (
                              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-800 flex gap-3">
                                <AlertCircle size={20} className="shrink-0" />
                                <p><strong>Health Advice:</strong> {user.aiNutritionPlan.healthAdvice}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 gap-4">
                              {user.aiNutritionPlan.meals?.map((meal: any, idx: number) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{meal.mealType}</div>
                                    <h4 className="font-bold text-slate-800">{meal.name}</h4>
                                    <p className="text-xs text-slate-500 mb-2">{meal.description}</p>
                                    
                                    {meal.ingredients && meal.ingredients.length > 0 && (
                                      <div className="mb-2">
                                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Ingredients</p>
                                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                                          {meal.ingredients.map((ing: string, i: number) => <li key={i}>{ing}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {meal.preparation && (
                                      <div className="mb-2">
                                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Preparation</p>
                                        <p className="text-xs text-emerald-600 leading-relaxed">{meal.preparation}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                                    <button
                                      onClick={async () => {
                                        try {
                                          const today = new Date().toISOString().split('T')[0];
                                          const logDocRef = doc(db, 'users', user.uid, 'dailyLogs', today);
                                          const logSnap = await getDoc(logDocRef);
                                          const currentMeals = logSnap.exists() ? (logSnap.data().meals || []) : [];
                                          
                                          const mealToSave = {
                                            name: meal.name,
                                            calories: Number(meal.calories),
                                            protein: Number(meal.protein),
                                            carbs: Number(meal.carbs),
                                            fats: Number(meal.fats),
                                            id: Date.now().toString() + idx,
                                            timestamp: new Date().toISOString(),
                                            isFromPlan: true
                                          };
                                          
                                          const updatedMeals = [...currentMeals, mealToSave];
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
                                          
                                          alert(`Successfully logged ${meal.name}!`);
                                        } catch (error) {
                                          handleFirestoreError(error, OperationType.WRITE, 'dailyLogs');
                                        }
                                      }}
                                      className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                                      title="Log this meal"
                                    >
                                      <Utensils size={14} />
                                      Log
                                    </button>
                                    <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                                    <div className="text-right">
                                      <div className="text-lg font-black text-slate-900">{meal.calories}</div>
                                      <div className="text-[10px] text-slate-400 uppercase font-bold">kcal</div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200" />
                                    <div className="flex gap-3 text-[10px] font-bold">
                                      <div className="text-center">
                                        <div className="text-slate-400">P</div>
                                        <div className="text-slate-700">{meal.protein}g</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-slate-400">C</div>
                                        <div className="text-slate-700">{meal.carbs}g</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-slate-400">F</div>
                                        <div className="text-slate-700">{meal.fats}g</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Protein</div>
                            <div className="text-lg font-bold text-slate-800">{Math.round(user.weight! * 2)}g</div>
                            <div className="text-[10px] text-slate-500">For muscle building</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Fats</div>
                            <div className="text-lg font-bold text-slate-800">{Math.round(user.weight! * 0.8)}g</div>
                            <div className="text-[10px] text-slate-500">For hormonal balance</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Carbs</div>
                            <div className="text-lg font-bold text-slate-800">
                              {Math.round((plan.recommendedCalories - (user.weight! * 2 * 4) - (user.weight! * 0.8 * 9)) / 4)}g
                            </div>
                            <div className="text-[10px] text-slate-500">For energy and activity</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="mt-1 text-emerald-600"><CheckCircle2 size={16} /></div>
                            <p>Focus on lean protein sources (chicken breast, fish, legumes).</p>
                          </div>
                          <div className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="mt-1 text-emerald-600"><CheckCircle2 size={16} /></div>
                            <p>Replace simple sugars with complex carbohydrates (oats, brown rice, potatoes).</p>
                          </div>
                          <div className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="mt-1 text-emerald-600"><CheckCircle2 size={16} /></div>
                            <p>Drink at least 3 liters of water daily to improve metabolism.</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Training Plan */}
                  <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <Dumbbell size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {user.aiWorkoutPlan ? 'AI Workout Plan' : 'Suggested Training Plan'}
                        </h3>
                      </div>
                      {user.aiWorkoutPlan && (
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                          AI Generated
                        </div>
                      )}
                    </div>

                    {user.aiWorkoutPlan ? (
                      <div className="space-y-8">
                        {typeof user.aiWorkoutPlan === 'string' ? (
                          <div className="whitespace-pre-wrap text-slate-600">{user.aiWorkoutPlan}</div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 gap-6">
                              {user.aiWorkoutPlan.weeklySchedule?.map((day: any, idx: number) => (
                                <div key={idx} className="space-y-3">
                                  <h4 className="font-black text-slate-900 flex items-center gap-2">
                                    <Calendar size={18} className="text-blue-600" />
                                    {day.day}
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {day.exercises?.map((ex: any, exIdx: number) => (
                                      <div key={exIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                        <div className="flex justify-between items-start">
                                          <div className="font-bold text-slate-800">{ex.name}</div>
                                          {ex.videoUrl && (
                                            <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                              <ExternalLink size={14} />
                                            </a>
                                          )}
                                        </div>
                                        <div className="flex gap-4 text-xs font-bold text-slate-500">
                                          <div className="flex items-center gap-1">
                                            <RefreshCw size={12} />
                                            {ex.sets} Sets
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <TrendingUp size={12} />
                                            {ex.reps}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {ex.rest} Rest
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-3">
                                <h5 className="font-black text-blue-900 flex items-center gap-2">
                                  <ShieldCheck size={20} />
                                  Injury Prevention
                                </h5>
                                <ul className="space-y-2">
                                  {user.aiWorkoutPlan.injuryPreventionTips?.map((tip: string, idx: number) => (
                                    <li key={idx} className="text-xs text-blue-800 flex gap-2">
                                      <span className="shrink-0">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 space-y-3">
                                <h5 className="font-black text-purple-900 flex items-center gap-2">
                                  <Info size={20} />
                                  Scientific Basis
                                </h5>
                                <p className="text-xs text-purple-800 leading-relaxed">
                                  {user.aiWorkoutPlan.scientificBasis}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <Clock className="text-blue-600" size={20} />
                              <div>
                                <div className="font-bold text-slate-800">Resistance Training</div>
                                <div className="text-xs text-slate-500">3-5 times per week</div>
                              </div>
                            </div>
                            <div className="text-blue-700 font-bold">45-60 minutes</div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="text-purple-600" size={20} />
                              <div>
                                <div className="font-bold text-slate-800">Cardio Training</div>
                                <div className="text-xs text-slate-500">Based on goal (burn or fitness)</div>
                              </div>
                            </div>
                            <div className="text-purple-700 font-bold">20-30 minutes</div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600">
                          <div className="font-bold text-slate-800 mb-2">Expert Tip:</div>
                          {parseFloat(plan.weightDiff) < 0 
                            ? "For weight loss, focus on HIIT and cardio while maintaining resistance training to prevent muscle loss."
                            : "For weight gain, focus primarily on heavy resistance training (Hypertrophy) to ensure the gain is muscle, not fat."}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="subscriptions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SubscriptionModule language="en" user={user} onUpdate={onUpdate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { AnimatePresence } from 'motion/react';