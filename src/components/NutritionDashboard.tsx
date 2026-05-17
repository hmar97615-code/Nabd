import React from 'react';
import { Plus, Trash2, Edit2, BarChart2, Zap, Scale, Target, Flame, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  weight: number;
  unit: string;
  timestamp: string;
  ingredients?: { name: string, weight: number }[];
}

interface NutritionDashboardProps {
  meals: Meal[];
  onAddMeal: () => void;
  onEditMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
  onGeneratePlan: () => void;
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export default function NutritionDashboard({ 
  meals, 
  onAddMeal, 
  onEditMeal, 
  onDeleteMeal, 
  onGeneratePlan,
  targets 
}: NutritionDashboardProps) {
  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fats: acc.fats + (meal.fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const safeTargets = {
    calories: targets.calories || 2000,
    protein: targets.protein || 150,
    carbs: targets.carbs || 250,
    fats: targets.fats || 70,
  };

  const progress = {
    calories: (totals.calories / safeTargets.calories) * 100,
    protein: (totals.protein / safeTargets.protein) * 100,
    carbs: (totals.carbs / safeTargets.carbs) * 100,
    fats: (totals.fats / safeTargets.fats) * 100,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Flame size={20} />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase">Calories</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{Math.round(totals.calories)}</span>
              <span className="text-sm text-slate-400">/ {safeTargets.calories} kcal</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress.calories, 100)}%` }}
                className={cn(
                  "h-full rounded-full",
                  progress.calories > 100 ? 'bg-red-500' : 'bg-orange-500'
                )}
              />
            </div>
          </div>
        </div>

        {[
          { label: 'Protein', value: totals.protein, target: safeTargets.protein, color: 'emerald' },
          { label: 'Carbs', value: totals.carbs, target: safeTargets.carbs, color: 'blue' },
          { label: 'Fats', value: totals.fats, target: safeTargets.fats, color: 'amber' },
        ].map((macro) => (
          <div key={macro.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500 uppercase">{macro.label}</span>
              <span className="text-xs font-bold text-slate-400">{Math.round(macro.value)}g / {macro.target}g</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((macro.value / macro.target) * 100, 100)}%` }}
                className={cn(
                  "h-full rounded-full",
                  macro.color === 'emerald' ? 'bg-emerald-500' :
                  macro.color === 'blue' ? 'bg-blue-500' :
                  'bg-amber-500'
                )}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Meals Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Today's Log / سجل اليوم</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onGeneratePlan}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 sm:px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-100 transition-all active:scale-95"
            >
              <Target size={18} className="shrink-0" /> 
              <span className="text-xs sm:text-sm">Generate AI Plan</span>
            </button>
            <button 
              onClick={onAddMeal}
              className="flex items-center gap-2 bg-emerald-600 text-white px-3 sm:px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Plus size={18} className="shrink-0" /> 
              <span className="text-xs sm:text-sm">Add Meal</span>
            </button>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No meals logged yet</h3>
            <p className="text-slate-500 text-sm mb-6">Start tracking your nutrition by adding your first meal.</p>
            <button 
              onClick={onAddMeal}
              className="text-emerald-600 font-bold hover:underline"
            >
              Log a meal now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meal</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portion</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calories</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">P / C / F</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{meal.name}</div>
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                          {meal.ingredients.map((ing, idx) => (
                            <span key={idx} className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {ing.name} ({ing.weight}g)
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{meal.weight} {meal.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-emerald-600">{Math.round(meal.calories)} kcal</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 text-[10px] font-bold">
                        <span className="text-emerald-600">P: {Math.round(meal.protein)}g</span>
                        <span className="text-blue-600">C: {Math.round(meal.carbs)}g</span>
                        <span className="text-amber-600">F: {Math.round(meal.fats)}g</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => onEditMeal(meal)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDeleteMeal(meal.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
