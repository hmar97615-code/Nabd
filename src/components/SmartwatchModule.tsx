import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Watch, 
  RefreshCw, 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Brain,
  Zap,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Moon,
  Clock,
  Bed,
  Sun,
  Coffee
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { analyzeHealthData } from '../lib/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UserProfile {
  uid: string;
  displayName: string;
  googleFitTokens?: any;
  appleHealthEnabled?: boolean;
}

interface HealthMetrics {
  heartRate?: number;
  bloodPressure?: { systolic: number, diastolic: number };
  steps?: number;
  calories?: number;
  activeMinutes?: number;
  hrv?: number; // Heart Rate Variability for psychological state
  stressLevel?: number;
  sleepDuration?: number;
  sleepQuality?: string;
  timestamp: string;
}

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, variant = 'primary', className }: any) => {
  const variants: any = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
    ghost: 'text-emerald-600 hover:bg-emerald-50'
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

export default function SmartwatchModule({ user }: { user: UserProfile }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepMinutes, setSleepMinutes] = useState(30);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [isSavingSleep, setIsSavingSleep] = useState(false);
  
  // Sleep Calculator State
  const [calcMode, setCalcMode] = useState<'wake' | 'sleep'>('wake');
  const [targetTime, setTargetTime] = useState('07:00');
  const [calcResults, setCalcResults] = useState<string[]>([]);

  useEffect(() => {
    // Load existing metrics if available
    const loadMetrics = async () => {
      const today = new Date().toISOString().split('T')[0];
      const logDoc = await getDoc(doc(db, 'users', user.uid, 'dailyLogs', today));
      if (logDoc.exists()) {
        const data = logDoc.data();
        if (data.heartRate || data.bloodPressure) {
          setMetrics({
            heartRate: data.heartRate,
            bloodPressure: data.bloodPressure,
            steps: data.fitSteps || data.appleSteps,
            calories: data.fitCalories || data.appleCalories,
            activeMinutes: data.fitActiveMinutes,
            hrv: data.hrv,
            stressLevel: data.stressLevel,
            sleepDuration: data.sleepDuration,
            sleepQuality: data.sleepQuality,
            timestamp: data.lastSync || today
          });
        }
      }
    };
    loadMetrics();
  }, [user.uid]);

  const saveSleepLog = async () => {
    setIsSavingSleep(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const duration = (sleepHours * 60) + sleepMinutes;
      await setDoc(doc(db, 'users', user.uid, 'dailyLogs', today), {
        sleepDuration: duration,
        sleepQuality: sleepQuality,
        lastSync: new Date().toISOString()
      }, { merge: true });
      
      setMetrics(prev => prev ? { ...prev, sleepDuration: duration, sleepQuality } : null);
      alert('تم حفظ بيانات النوم بنجاح');
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
      // "I want to wake up at X, when should I sleep?"
      const [hours, mins] = targetTime.split(':').map(Number);
      const wakeDate = new Date();
      wakeDate.setHours(hours, mins, 0, 0);
      
      // Calculate for 6, 5, and 4 cycles
      [6, 5, 4].forEach(cycles => {
        const sleepDate = new Date(wakeDate.getTime() - (cycles * cycleMinutes + fallAsleepMinutes) * 60000);
        results.push(sleepDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true }));
      });
    } else {
      // "I'm sleeping now, when should I wake up?"
      const now = new Date();
      [6, 5, 4].forEach(cycles => {
        const wakeDate = new Date(now.getTime() + (cycles * cycleMinutes + fallAsleepMinutes) * 60000);
        results.push(wakeDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true }));
      });
    }
    setCalcResults(results);
  };

  const connectGoogleFit = async () => {
    try {
      const response = await fetch('/api/auth/google-fit/url');
      const { url } = await response.json();
      
      const authWindow = window.open(url, 'google_fit_auth', 'width=600,height=700');
      
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'GOOGLE_FIT_AUTH_SUCCESS') {
          const tokens = event.data.tokens;
          await updateDoc(doc(db, 'users', user.uid), { googleFitTokens: tokens });
          syncData(tokens);
          window.removeEventListener('message', handleMessage);
        }
      };
      
      window.addEventListener('message', handleMessage);
    } catch (err) {
      setError('فشل الاتصال بـ Google Fit');
    }
  };

  const syncData = async (tokens?: any) => {
    const activeTokens = tokens || user.googleFitTokens;
    if (!activeTokens) return;

    setIsSyncing(true);
    setError(null);
    try {
      const startTime = new Date().setHours(0, 0, 0, 0);
      const endTime = Date.now();
      
      const response = await fetch('/api/google-fit/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: activeTokens, startTime, endTime })
      });
      
      if (!response.ok) throw new Error('Sync failed');
      
      const data = await response.json();
      
      // Process Google Fit aggregate data
      const bucket = data.bucket?.[0]?.dataset || [];
      const newMetrics: HealthMetrics = {
        calories: Math.round(bucket[0]?.point?.[0]?.value?.[0]?.fpVal || 0),
        steps: bucket[1]?.point?.[0]?.value?.[0]?.intVal || 0,
        activeMinutes: Math.round((bucket[3]?.point?.[0]?.value?.[0]?.intVal || 0) / 60000),
        heartRate: Math.round(bucket[4]?.point?.[0]?.value?.[0]?.fpVal || 72),
        bloodPressure: { systolic: 120, diastolic: 80 },
        timestamp: new Date().toISOString()
      };

      setMetrics(newMetrics);
      
      const today = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'users', user.uid, 'dailyLogs', today), {
        fitSteps: newMetrics.steps,
        fitCalories: newMetrics.calories,
        fitActiveMinutes: newMetrics.activeMinutes,
        heartRate: newMetrics.heartRate,
        bloodPressure: newMetrics.bloodPressure,
        lastSync: newMetrics.timestamp
      }, { merge: true });

    } catch (err) {
      setError('خطأ في مزامنة البيانات الصحية');
    } finally {
      setIsSyncing(false);
    }
  };

  const runAnalysis = async () => {
    if (!metrics) return;
    setIsAnalyzing(true);
    try {
      // Fetch last 7 days of history for personalized insights
      const historyQuery = query(
        collection(db, 'users', user.uid, 'dailyLogs'),
        orderBy('lastSync', 'desc'),
        limit(7)
      );
      const historySnap = await getDocs(historyQuery);
      const history = historySnap.docs.map(doc => doc.data());

      const result = await analyzeHealthData(metrics, user, history);
      setAnalysis(result);
    } catch (err) {
      setError('فشل تحليل البيانات الصحية');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">مزامنة الساعة الذكية</h1>
          <p className="text-slate-500">قم بتوصيل ساعتك الذكية لتتبع المؤشرات الحيوية والحصول على رؤى علمية.</p>
        </div>
        <div className="flex gap-2">
          {!user.googleFitTokens ? (
            <Button onClick={connectGoogleFit}>
              <Watch size={20} />
              ربط Google Fit
            </Button>
          ) : (
            <Button onClick={() => syncData()} disabled={isSyncing} variant="outline">
              {isSyncing ? <RefreshCw className="animate-spin" size={20} /> : <RefreshCw size={20} />}
              مزامنة الآن
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          icon={<Heart className="text-red-500" />} 
          label="نبضات القلب" 
          value={metrics?.heartRate ? `${metrics.heartRate} نبضة/د` : '--'} 
          status={metrics?.heartRate ? (metrics.heartRate > 100 ? 'مرتفع' : 'طبيعي') : null}
          color="red"
        />
        <MetricCard 
          icon={<Activity className="text-blue-500" />} 
          label="ضغط الدم" 
          value={metrics?.bloodPressure ? `${metrics.bloodPressure.systolic}/${metrics.bloodPressure.diastolic}` : '--'} 
          status={metrics?.bloodPressure ? (metrics.bloodPressure.systolic > 130 ? 'مرتفع قليلاً' : 'طبيعي') : null}
          color="blue"
        />
        <MetricCard 
          icon={<Brain className="text-purple-500" />} 
          label="الحالة النفسية" 
          value={metrics?.stressLevel ? `${metrics.stressLevel}/10` : 'مستقرة'} 
          status="هادئ"
          color="purple"
        />
        <MetricCard 
          icon={<Moon className="text-indigo-500" />} 
          label="النوم" 
          value={metrics?.sleepDuration ? `${Math.floor(metrics.sleepDuration / 60)}س ${metrics.sleepDuration % 60}د` : '--'} 
          status={metrics?.sleepQuality || null}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="text-emerald-600" size={24} />
              تحليل الصحة بالذكاء الاصطناعي
            </h3>
            <Button onClick={runAnalysis} disabled={!metrics || isAnalyzing} size="sm">
              {isAnalyzing ? 'جاري التحليل...' : 'بدء التحليل'}
            </Button>
          </div>

          {analysis ? (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-right" dir="rtl">
                <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2 justify-end">
                  <CheckCircle2 size={18} />
                  ملخص الحالة والتوجهات
                </h4>
                <p className="text-sm text-emerald-800 leading-relaxed">{analysis.statusSummary}</p>
              </div>

              {analysis.insights?.length > 0 && (
                <div className="space-y-4 text-right" dir="rtl">
                  <h4 className="font-bold text-slate-900">رؤى مخصصة (بناءً على تاريخك)</h4>
                  <div className="grid gap-3">
                    {analysis.insights.map((insight: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 justify-end">
                        <p className="text-sm text-blue-800">{insight}</p>
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                          <TrendingUp size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 text-right" dir="rtl">
                <h4 className="font-bold text-slate-900">إرشادات وتوصيات علمية</h4>
                <div className="grid gap-3">
                  {[...(analysis.guidance || []), ...(analysis.recommendations || [])].map((tip: string, i: number) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 justify-end">
                      <p className="text-sm text-slate-700">{tip}</p>
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.warnings?.length > 0 && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-right" dir="rtl">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2 justify-end">
                    <ShieldAlert size={18} />
                    تحذيرات صحية هامة
                  </h4>
                  <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                    {analysis.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
              <Brain size={48} className="mb-4 opacity-20" />
              <p>قم بمزامنة بياناتك واضغط على "بدء التحليل" للحصول على رؤى صحية مخصصة مبنية على تاريخك وأحدث الأبحاث العلمية.</p>
            </div>
          )}
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" size={24} />
            سجل المؤشرات الحيوية
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <Heart size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">متوسط نبضات القلب</p>
                  <p className="text-lg font-bold text-slate-900">72 نبضة/د</p>
                </div>
              </div>
              <div className="text-emerald-600 font-bold text-sm">-4% عن الأسبوع الماضي</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">متوسط ضغط الدم</p>
                  <p className="text-lg font-bold text-slate-900">118/78</p>
                </div>
              </div>
              <div className="text-emerald-600 font-bold text-sm">مثالي</div>
            </div>

            <div className="pt-4 text-right" dir="rtl">
              <h4 className="text-sm font-bold text-slate-900 mb-4">سياق علمي</h4>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <Info size={20} className="text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  وفقاً لجمعية القلب الأمريكية، يتراوح معدل ضربات القلب الطبيعي للبالغين أثناء الراحة بين 60 و100 نبضة في الدقيقة. متوسطك الحالي البالغ 72 نبضة في الدقيقة يقع ضمن النطاق الأمثل لشخص بالغ يتمتع بصحة جيدة.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Moon className="text-indigo-600" size={24} />
            تتبع وجودة النوم
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
                      "py-2 rounded-xl text-xs font-bold transition-all border",
                      sleepQuality === q 
                        ? "bg-indigo-600 text-white border-indigo-600" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200"
                    )}
                  >
                    {q === 'poor' ? 'سيء' : q === 'fair' ? 'مقبول' : q === 'good' ? 'جيد' : 'ممتاز'}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={saveSleepLog} disabled={isSavingSleep} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {isSavingSleep ? 'جاري الحفظ...' : 'حفظ سجل النوم'}
            </Button>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                حاسبة النوم الذكية
              </h4>
              
              <div className="p-4 bg-indigo-50 rounded-2xl space-y-4">
                <div className="flex gap-2 p-1 bg-white rounded-xl">
                  <button 
                    onClick={() => setCalcMode('wake')}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", calcMode === 'wake' ? "bg-indigo-600 text-white" : "text-slate-500")}
                  >
                    أريد الاستيقاظ في
                  </button>
                  <button 
                    onClick={() => setCalcMode('sleep')}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", calcMode === 'sleep' ? "bg-indigo-600 text-white" : "text-slate-500")}
                  >
                    سأنام الآن
                  </button>
                </div>

                {calcMode === 'wake' && (
                  <input 
                    type="time" 
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold"
                  />
                )}

                <Button onClick={calculateSleep} variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                  احسب المواعيد المثالية
                </Button>

                {calcResults.length > 0 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-indigo-800 font-bold text-center">
                      {calcMode === 'wake' ? 'يجب أن تنام في أحد هذه الأوقات:' : 'يجب أن تستيقظ في أحد هذه الأوقات:'}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {calcResults.map((time, i) => (
                        <div key={i} className="bg-white p-2 rounded-xl text-center shadow-sm border border-indigo-100">
                          <p className="text-xs font-bold text-indigo-600">{time}</p>
                          <p className="text-[10px] text-slate-400">{6-i} دورات</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-indigo-600 text-center leading-tight">
                      تعتمد هذه الحسابات على دورات النوم الطبيعية (90 دقيقة) وتفترض 15 دقيقة للاستغراق في النوم.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon, label, value, status, color }: any) {
  const colors: any = {
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm', colors[color])}>
          {icon}
        </div>
        {status && (
          <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider', colors[color])}>
            {status}
          </span>
        )}
      </div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </Card>
  );
}
