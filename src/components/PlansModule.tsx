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
  RefreshCw
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';

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
}

export default function PlansModule({ user, onUpdate }: { user: UserProfile, onUpdate: (u: UserProfile) => void }) {
  const [targetWeight, setTargetWeight] = useState(user.targetWeight?.toString() || '');
  const [targetDate, setTargetDate] = useState(user.targetDate || '');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">الخطط الذكية (Smart Plans)</h1>
          <p className="text-slate-500">خطط مبنية على العلم للوصول لهدفك في وقت محدد</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl">
          <Target size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Target size={20} className="text-emerald-600" />
              إعداد الهدف
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1">الوزن المستهدف (kg)</label>
                <input 
                  type="number"
                  value={targetWeight}
                  onChange={e => setTargetWeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="مثال: 75"
                />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1">تاريخ الوصول للهدف</label>
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
                    {saving ? 'جاري الحفظ...' : showSuccess ? (
                      <>
                        <CheckCircle2 size={20} />
                        تم الحفظ والمزامنة
                      </>
                    ) : 'حفظ الخطة وتفعيلها'}
                  </button>
                  <button
                    onClick={() => { setTargetWeight(''); setTargetDate(''); }}
                    className="px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                    title="مسح الحقول"
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
                    {showConfirmCancel ? 'تأكيد إلغاء الخطة؟' : 'إلغاء الخطة الحالية'}
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
                <span>تحليل الخطة</span>
              </div>
              <p className="text-sm text-slate-600">
                {plan.isSafe && plan.isCalorieSafe 
                  ? "هذه الخطة آمنة ومستدامة صحياً."
                  : "تحذير: هذه الخطة قد تكون قاسية جداً. يفضل زيادة المدة الزمنية."}
              </p>
              <div className="text-xs space-y-1 opacity-70">
                <div>• معدل التغيير الأسبوعي: {plan.weeklyChange} كجم</div>
                <div>• السعرات الموصى بها: {plan.recommendedCalories} سعرة</div>
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
                {plan && 'error' in plan ? plan.error : 'أدخل الوزن المستهدف والتاريخ لعرض خطتك المخصصة'}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="text-slate-500 text-sm font-bold mb-1">السعرات اليومية</div>
                  <div className="text-3xl font-black text-emerald-600">{plan.recommendedCalories}</div>
                  <div className="text-xs text-slate-400 mt-1">سعرة حرارية / يوم</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="text-slate-500 text-sm font-bold mb-1">المدة المتبقية</div>
                  <div className="text-3xl font-black text-slate-900">{plan.diffDays}</div>
                  <div className="text-xs text-slate-400 mt-1">يوم للوصول للهدف</div>
                </div>
              </div>

              {/* Nutrition Plan */}
              <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Utensils size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">خطة التغذية العلمية</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">البروتين</div>
                    <div className="text-lg font-bold text-slate-800">{Math.round(user.weight! * 2)}g</div>
                    <div className="text-[10px] text-slate-500">لبناء العضلات</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">الدهون</div>
                    <div className="text-lg font-bold text-slate-800">{Math.round(user.weight! * 0.8)}g</div>
                    <div className="text-[10px] text-slate-500">للتوازن الهرموني</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">الكربوهيدرات</div>
                    <div className="text-lg font-bold text-slate-800">
                      {Math.round((plan.recommendedCalories - (user.weight! * 2 * 4) - (user.weight! * 0.8 * 9)) / 4)}g
                    </div>
                    <div className="text-[10px] text-slate-500">للطاقة والنشاط</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="mt-1 text-emerald-600"><CheckCircle2 size={16} /></div>
                    <p>ركز على مصادر البروتين الخالية من الدهون (صدر دجاج، سمك، بقوليات).</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="mt-1 text-emerald-600"><CheckCircle2 size={16} /></div>
                    <p>استبدل السكريات البسيطة بالكربوهيدرات المعقدة (شوفان، أرز بني، بطاطس).</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="mt-1 text-emerald-600"><CheckCircle2 size={16} /></div>
                    <p>اشرب ما لا يقل عن 3 لتر ماء يومياً لتحسين عملية الأيض.</p>
                  </div>
                </div>
              </div>

              {/* Training Plan */}
              <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Dumbbell size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">خطة التدريب المقترحة</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-600" size={20} />
                      <div>
                        <div className="font-bold text-slate-800">تمارين المقاومة</div>
                        <div className="text-xs text-slate-500">3-5 مرات أسبوعياً</div>
                      </div>
                    </div>
                    <div className="text-blue-700 font-bold">45-60 دقيقة</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-purple-600" size={20} />
                      <div>
                        <div className="font-bold text-slate-800">تمارين الكارديو</div>
                        <div className="text-xs text-slate-500">حسب الهدف (حرق أو لياقة)</div>
                      </div>
                    </div>
                    <div className="text-purple-700 font-bold">20-30 دقيقة</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600">
                  <div className="font-bold text-slate-800 mb-2">نصيحة الخبراء:</div>
                  {parseFloat(plan.weightDiff) < 0 
                    ? "لخسارة الوزن، ركز على تمارين الـ HIIT والكارديو مع الحفاظ على تمارين المقاومة لمنع خسارة العضلات."
                    : "لزيادة الوزن، ركز بشكل أساسي على تمارين المقاومة بأوزان ثقيلة (Hypertrophy) لضمان أن الزيادة تكون عضلات وليست دهون."}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
