import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  Clock, 
  Bed, 
  Sun, 
  Coffee,
  Info,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { calculatePlanDetails } from '../lib/planUtils';
import { doc, updateDoc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UserProfile {
  uid: string;
  displayName: string;
}

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, variant = 'primary', className }: any) => {
  const variants: any = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
    ghost: 'text-indigo-600 hover:bg-indigo-50'
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={cn('px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2', variants[variant], className)}
    >
      {children}
    </button>
  );
};

export default function SleepModule({ user }: { user: any }) {
  const [sleepHours, setSleepHours] = useState(7);
  const planDetails = calculatePlanDetails(user);
  const [sleepMinutes, setSleepMinutes] = useState(30);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [isSavingSleep, setIsSavingSleep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Sleep Calculator State
  const [calcMode, setCalcMode] = useState<'wake' | 'sleep'>('wake');
  const [targetTime, setTargetTime] = useState('07:00');
  const [calcResults, setCalcResults] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadSleepData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const logDoc = await getDoc(doc(db, 'users', user.uid, 'dailyLogs', today));
      if (logDoc.exists()) {
        const data = logDoc.data();
        if (data.sleepDuration) {
          setSleepHours(Math.floor(data.sleepDuration / 60));
          setSleepMinutes(data.sleepDuration % 60);
          setSleepQuality(data.sleepQuality || 'good');
        }
      }

      // Load history
      const historyQuery = query(
        collection(db, 'users', user.uid, 'dailyLogs'),
        orderBy('date', 'desc'),
        limit(7)
      );
      const historySnap = await getDocs(historyQuery);
      setHistory(historySnap.docs.map(doc => doc.data()).filter(d => d.sleepDuration));
    };
    loadSleepData();
  }, [user.uid]);

  const saveSleepLog = async () => {
    setIsSavingSleep(true);
    setError(null);
    setSuccess(false);
    try {
      const today = new Date().toISOString().split('T')[0];
      const duration = (sleepHours * 60) + sleepMinutes;
      await setDoc(doc(db, 'users', user.uid, 'dailyLogs', today), {
        sleepDuration: duration,
        sleepQuality: sleepQuality,
        lastSync: new Date().toISOString()
      }, { merge: true });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('فشل حفظ بيانات النوم');
    } finally {
      setIsSavingSleep(false);
    }
  };

  const calculateSleep = () => {
    const results = [];
    const cycleMinutes = 90;
    const fallAsleepMinutes = 15;

    if (calcMode === 'wake') {
      const [hours, mins] = targetTime.split(':').map(Number);
      const wakeDate = new Date();
      wakeDate.setHours(hours, mins, 0, 0);
      
      [6, 5, 4].forEach(cycles => {
        const sleepDate = new Date(wakeDate.getTime() - (cycles * cycleMinutes + fallAsleepMinutes) * 60000);
        results.push(sleepDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true }));
      });
    } else {
      const now = new Date();
      [6, 5, 4].forEach(cycles => {
        const wakeDate = new Date(now.getTime() + (cycles * cycleMinutes + fallAsleepMinutes) * 60000);
        results.push(wakeDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true }));
      });
    }
    setCalcResults(results);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">تتبع النوم</h1>
          <p className="text-slate-500">سجل جودة نومك واستخدم الحاسبة الذكية لتحسين دورتك البيولوجية.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">تم حفظ بيانات النوم بنجاح!</p>
        </div>
      )}

      <Card className="p-6 bg-indigo-900 text-white border-none shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Moon className="text-indigo-300" size={20} />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Recovery Protocol / بروتوكول الاستشفاء</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">Sleep Recommendation / توصيات النوم</h2>
              <p className="text-indigo-200 text-sm">{planDetails.recovery.notes}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[140px]">
              <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Target Duration / المدة المستهدفة</p>
              <p className="text-2xl font-bold">{planDetails.recovery.sleepHours} <span className="text-xs font-medium text-indigo-300">hours</span></p>
            </div>
          </div>
        </div>
        <Bed className="absolute -bottom-10 -right-10 text-white/5" size={200} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Moon className="text-indigo-600" size={24} />
            تسجيل النوم اليومي
          </h3>
          
          <div className="space-y-6 text-right" dir="rtl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">ساعات النوم</label>
                <input 
                  type="number" 
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  min="0" max="24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">الدقائق</label>
                <input 
                  type="number" 
                  value={sleepMinutes}
                  onChange={(e) => setSleepMinutes(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  min="0" max="59"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">جودة النوم</label>
              <div className="grid grid-cols-4 gap-2">
                {['poor', 'fair', 'good', 'excellent'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSleepQuality(q)}
                    className={cn(
                      "py-3 rounded-xl text-xs font-bold transition-all border",
                      sleepQuality === q 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200"
                    )}
                  >
                    {q === 'poor' ? 'سيء' : q === 'fair' ? 'مقبول' : q === 'good' ? 'جيد' : 'ممتاز'}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={saveSleepLog} disabled={isSavingSleep} className="w-full py-4 text-lg">
              {isSavingSleep ? 'جاري الحفظ...' : 'حفظ السجل'}
            </Button>
          </div>
        </Card>

        <Card className="p-8">
          <h4 className="font-bold text-xl text-slate-900 mb-8 flex items-center gap-2">
            <Clock size={24} className="text-indigo-600" />
            حاسبة النوم الذكية
          </h4>
          
          <div className="space-y-6 text-right" dir="rtl">
            <div className="p-6 bg-indigo-50 rounded-3xl space-y-6">
              <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm">
                <button 
                  onClick={() => setCalcMode('wake')}
                  className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all", calcMode === 'wake' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50")}
                >
                  أريد الاستيقاظ في
                </button>
                <button 
                  onClick={() => setCalcMode('sleep')}
                  className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all", calcMode === 'sleep' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50")}
                >
                  سأنام الآن
                </button>
              </div>

              {calcMode === 'wake' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">وقت الاستيقاظ المستهدف</label>
                  <input 
                    type="time" 
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none text-center text-2xl font-bold text-indigo-600"
                  />
                </div>
              )}

              <Button onClick={calculateSleep} variant="outline" className="w-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 py-4">
                احسب المواعيد المثالية
              </Button>

              <AnimatePresence>
                {calcResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4 border-t border-indigo-100"
                  >
                    <p className="text-sm text-indigo-800 font-bold text-center">
                      {calcMode === 'wake' ? 'للاستيقاظ نشيطاً، يجب أن تنام في:' : 'للاستيقاظ نشيطاً، يجب أن تستيقظ في:'}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {calcResults.map((time, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl text-center shadow-sm border border-indigo-100 group hover:border-indigo-400 transition-colors">
                          <p className="text-lg font-bold text-indigo-600">{time}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{6-i} دورات نوم</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-white/50 rounded-2xl flex gap-3 items-start">
                      <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-indigo-700 leading-relaxed">
                        تعتمد هذه الحسابات على دورات النوم الطبيعية (90 دقيقة) وتفترض 15 دقيقة للاستغراق في النوم. الاستيقاظ في نهاية الدورة يجعلك تشعر بنشاط أكبر.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={24} />
          سجل النوم الأخير
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {history.length > 0 ? history.map((log, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-2">{new Date(log.date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">{Math.floor(log.sleepDuration / 60)}</span>
                <span className="text-xs text-slate-500">ساعة</span>
                <span className="text-xl font-bold text-slate-900 ml-1">{log.sleepDuration % 60}</span>
                <span className="text-xs text-slate-500">دقيقة</span>
              </div>
              <div className="mt-2">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                  log.sleepQuality === 'excellent' ? "bg-emerald-100 text-emerald-700" :
                  log.sleepQuality === 'good' ? "bg-blue-100 text-blue-700" :
                  log.sleepQuality === 'fair' ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                )}>
                  {log.sleepQuality === 'poor' ? 'سيء' : log.sleepQuality === 'fair' ? 'مقبول' : log.sleepQuality === 'good' ? 'جيد' : 'ممتاز'}
                </span>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              <Bed size={48} className="mx-auto mb-4 opacity-20" />
              <p>لا يوجد سجلات نوم سابقة.</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
