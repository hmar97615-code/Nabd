import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Apple, 
  Camera, 
  ChevronRight, 
  Heart, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Moon,
  Plus, 
  Search, 
  Settings, 
  TrendingUp, 
  User, 
  Users,
  Utensils,
  Weight as WeightIcon,
  Droplets,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Dumbbell,
  RefreshCw,
  Watch,
  ShieldAlert,
  Lightbulb,
  Clock,
  MonitorOff,
  Coffee,
  Wind,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, storage, googleProvider, OperationType, handleFirestoreError } from './firebase';
import { calculatePlanDetails } from './lib/planUtils';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, where, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Force cache bust: 2026-03-06
import { chatWithHealthAssistant } from './lib/gemini';
import SportsModule from './components/SportsModule';
import NutritionModule from './components/NutritionModule';
import AdminDashboard from './components/AdminDashboard';
import SmartwatchModule from './components/SmartwatchModule';
import SleepModule from './components/SleepModule';
import PlansModule from './components/PlansModule';
import TrainerDashboard from './components/TrainerDashboard';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Shield, Ban, Trash2, Eye, ExternalLink, Info } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
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
  specialties?: string[];
  experienceYears?: number;
  certifications?: string;
  bio?: string;
  hourlyRate?: number;
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

const SPORTS_DATA = [
  {
    id: 'gym',
    name: 'الجيم (Gym)',
    icon: <Dumbbell size={20} />,
    goals: [
      'تحسين الجهاز الدوري', 'خسارة الوزن', 'زيادة الوزن', 'ثبات الوزن', 
      'زيادة القوه العضليه', 'زيادة قوة التحمل', 'تحسين التواصل العصبي العضلي', 
      'تجنب الاصابات', 'تحسين اداء وتكنيك', 'حل مشكلة قصور في تطور بعض العضلات',
      'Muscle Symmetry (تناسق العضلات)'
    ]
  },
  {
    id: 'swimming',
    name: 'السباحة (Swimming)',
    icon: <Activity size={20} />,
    goals: [
      'تحسن زمن سباحه معينه', 'تحسين وزيادة النفس', 'تحسين الاداء في سباحه معينه', 
      'زيادة قوة العضلات المستخدمه في سباحه معينه', 'تجنب الاصابات',
      'Stroke Efficiency (كفاءة الشدة)'
    ]
  },
  {
    id: 'fin_swimming',
    name: 'السباحة بالزعانف (Fin Swimming)',
    icon: <Activity size={20} className="rotate-45" />,
    goals: [
      'تحسين زمن السباحه', 'تحسين النفس', 'تحسين الاداء والتكنيك', 
      'زيادة قوة العضلات المستخدمه اثناء السباحه', 'تجنب الاصابات'
    ]
  },
  {
    id: 'football',
    name: 'كرة القدم (Football)',
    icon: <Activity size={20} />,
    goals: [
      'تحسين الاداء والتكنيك لحركات معينه', 'المساعده في التطوير لمركز معين في الملعب', 
      'تجنب الاصابات', 'زيادة قوة العضلات المستخدمه', 'تحسين النفس', 
      'تحسين بعض المهارات التكتيكيه مثل الوعى و كشف الملعب و سرعة رد الفعل',
      'Agility & Change of Direction (الرشاقة وتغيير الاتجاه)'
    ]
  },
  {
    id: 'healthy_lifestyle',
    name: 'الحياة الصحية (Healthy Lifestyle)',
    icon: <Heart size={20} />,
    goals: [
      'تحسين الجهاز الدوري', 'تحسين الجهاز التنفسي', 
      'تحسين العمليات الحيويه في الجسم مثل الهضم والنوم', 
      'تجنب الامراض النفسيه مثل الاكتئاب والشعور بالوحده',
      'Flexibility & Mobility (المرونة والحركية)'
    ]
  }
];

interface DailyLog {
  id?: string;
  date: string;
  meals: any[];
  totalCalories: number;
  exercise: string;
  waterIntake: number;
  workouts?: any[];
  weight?: number;
  fitCalories?: number;
  fitSteps?: number;
  fitDistance?: number;
  fitActiveMinutes?: number;
  appleSteps?: number;
  appleCalories?: number;
  appleHeartRate?: number;
  appleWorkouts?: any[];
  sleepDuration?: number; // in minutes
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  sleepNotes?: string;
}

// --- Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
      secondary: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200',
      outline: 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50',
      ghost: 'text-emerald-700 hover:bg-emerald-50',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg font-medium',
    };
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn('bg-white rounded-2xl border border-emerald-50 shadow-sm overflow-hidden', className)}
  >
    {children}
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminViewMode, setAdminViewMode] = useState<'trainer' | 'user'>('user');
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            if (userData.email === 'hmar97615@gmail.com' && userData.role !== 'admin') {
              userData.role = 'admin';
              await updateDoc(doc(db, 'users', firebaseUser.uid), { role: 'admin' });
            }
            setUser(userData);
          } else {
            // New user
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              role: firebaseUser.email === 'hmar97615@gmail.com' ? 'admin' : 'user',
              onboarded: false,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const q = query(collection(db, 'users', user.uid, 'dailyLogs'), orderBy('date', 'desc'), limit(30));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyLog));
        setDailyLogs(logs);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/dailyLogs`);
      });
      return unsubscribe;
    }
  }, [user?.uid]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Ignore common user-cancelled errors
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log('Login cancelled by user');
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized for OAuth operations. Please add it to your Firebase console under Authentication > Settings > Authorized domains.");
      } else {
        console.error('Login error:', error);
        alert(`Login failed: ${error.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-emerald-600"
        >
          <Heart size={48} fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
  }

  if (!user.onboarded) {
    return <Onboarding user={user} onComplete={(updatedUser) => setUser(updatedUser)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-emerald-50 transform transition-transform duration-300 md:relative md:translate-x-0",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-emerald-900 tracking-tight">NABD</span>
          </div>

          <nav className="space-y-2 flex-1">
            {(user.role === 'coach' || (user.role === 'admin' && adminViewMode === 'trainer')) ? (
              <>
                <NavItem icon={<LayoutDashboard size={20} />} label="لوحة المدرب" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} />
                <NavItem icon={<Users size={20} />} label="عملائي" active={activeTab === 'clients'} onClick={() => { setActiveTab('clients'); setIsMenuOpen(false); }} />
                <NavItem icon={<Calendar size={20} />} label="الجدول" active={activeTab === 'schedule'} onClick={() => { setActiveTab('schedule'); setIsMenuOpen(false); }} />
                <NavItem icon={<MessageSquare size={20} />} label="الرسائل" active={activeTab === 'messages'} onClick={() => { setActiveTab('messages'); setIsMenuOpen(false); }} />
                <NavItem icon={<User size={20} />} label="الملف الشخصي" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }} />
              </>
            ) : (
              <>
                <NavItem icon={<LayoutDashboard size={20} />} label="لوحة التحكم" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} />
                <NavItem icon={<MessageSquare size={20} />} label="المساعد الصحي" active={activeTab === 'assistant'} onClick={() => { setActiveTab('assistant'); setIsMenuOpen(false); }} />
                <NavItem icon={<Utensils size={20} />} label="التغذية" active={activeTab === 'nutrition'} onClick={() => { setActiveTab('nutrition'); setIsMenuOpen(false); }} />
                <NavItem icon={<Target size={20} />} label="الخطط الذكية" active={activeTab === 'plans'} onClick={() => { setActiveTab('plans'); setIsMenuOpen(false); }} />
                <NavItem icon={<Users size={20} />} label="المدربين" active={activeTab === 'coaches'} onClick={() => { setActiveTab('coaches'); setIsMenuOpen(false); }} />
                <NavItem icon={<Dumbbell size={20} />} label="الرياضة" active={activeTab === 'sports'} onClick={() => { setActiveTab('sports'); setIsMenuOpen(false); }} />
                <NavItem icon={<Moon size={20} />} label="تتبع النوم" active={activeTab === 'sleep'} onClick={() => { setActiveTab('sleep'); setIsMenuOpen(false); }} />
                <NavItem icon={<TrendingUp size={20} />} label="التقدم" active={activeTab === 'progress'} onClick={() => { setActiveTab('progress'); setIsMenuOpen(false); }} />
                <NavItem icon={<Watch size={20} />} label="نبض الساعة" active={activeTab === 'watch'} onClick={() => { setActiveTab('watch'); setIsMenuOpen(false); }} />
                <NavItem icon={<User size={20} />} label="الملف الشخصي" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }} />
              </>
            )}
            {user.role === 'admin' && (
              <NavItem icon={<ShieldAlert size={20} />} label="لوحة الإدارة" active={activeTab === 'admin'} onClick={() => { setActiveTab('admin'); setIsMenuOpen(false); }} />
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-emerald-50">
            <div className="flex items-center gap-3 mb-6 px-2">
              <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-emerald-100" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.displayName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors w-full px-2">
              <LogOut size={18} />
              <span className="text-sm font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-emerald-50 flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-emerald-600" fill="currentColor" />
            <span className="font-bold text-emerald-900">NABD</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            {user.role === 'coach' || (user.role === 'admin' && adminViewMode === 'trainer') ? (
              <>
                {(activeTab === 'dashboard' || activeTab === 'clients' || activeTab === 'schedule' || activeTab === 'messages') && (
                  <TrainerDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
                )}
                {activeTab === 'profile' && <ProfileSettings user={user} onUpdate={(u) => setUser(u)} />}
                {activeTab === 'admin' && user.role === 'admin' && <AdminDashboard setActiveTab={setActiveTab} setAdminViewMode={setAdminViewMode} />}
              </>
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard user={user} logs={dailyLogs} onTabChange={setActiveTab} onUpdate={(u) => setUser(u)} />}
                {activeTab === 'nutrition' && <NutritionModule user={user} />}
                {activeTab === 'plans' && <PlansModule user={user} onUpdate={(u) => setUser(u)} />}
                {activeTab === 'coaches' && <CoachMarketplace />}
                {activeTab === 'sports' && <SportsModule user={user} />}
                {activeTab === 'sleep' && <SleepModule user={user} />}
                {activeTab === 'progress' && <ProgressView logs={dailyLogs} />}
                {activeTab === 'profile' && <ProfileSettings user={user} onUpdate={(u) => setUser(u)} />}
                {activeTab === 'watch' && <SmartwatchModule user={user} />}
                {activeTab === 'assistant' && <HealthAssistant />}
                {activeTab === 'admin' && user.role === 'admin' && <AdminDashboard setActiveTab={setActiveTab} setAdminViewMode={setAdminViewMode} />}
              </>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <span className={cn("transition-colors", active ? "text-emerald-600" : "text-slate-400")}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />}
    </button>
  );
}

function LandingPage({ onLogin, isLoggingIn }: { onLogin: () => void, isLoggingIn: boolean }) {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Heart size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-bold text-emerald-900">NABD</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#coaches" className="hover:text-emerald-600 transition-colors">Coaches</a>
          <a href="#about" className="hover:text-emerald-600 transition-colors">Science</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onLogin} disabled={isLoggingIn} className="hidden sm:flex">
            Login
          </Button>
          <Button onClick={onLogin} disabled={isLoggingIn} className="rounded-full px-8">
            {isLoggingIn ? 'Connecting...' : 'Sign Up Free'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold mb-6">
            <Activity size={16} />
            <span>AI-Powered Health Platform</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Your Health, <br />
            <span className="text-emerald-600">Reimagined.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
            NABD combines cutting-edge AI with scientific research to help you track nutrition, connect with pro coaches, and reach your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={onLogin} disabled={isLoggingIn} className="rounded-full px-10">
              {isLoggingIn ? 'Connecting...' : 'Start Your Journey'}
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10">Watch Demo</Button>
          </div>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" />
              ))}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Joined by <span className="text-slate-900 font-bold">10,000+</span> health enthusiasts
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-200/50 border-8 border-white">
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000" alt="Fitness" className="w-full h-auto" />
          </div>
          {/* Floating elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-emerald-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Apple size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Calories</p>
                <p className="text-lg font-bold text-slate-900">1,840 kcal</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl border border-emerald-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Progress</p>
                <p className="text-xl font-bold text-slate-900">+12% Muscle</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to thrive</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our platform integrates advanced technology with human expertise to provide a holistic health experience.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Camera className="text-emerald-600" />} 
              title="AI Calorie Counting" 
              desc="Just snap a photo of your meal. Our AI identifies ingredients and estimates nutritional value instantly."
            />
            <FeatureCard 
              icon={<Users className="text-emerald-600" />} 
              title="Expert Coaches" 
              desc="Connect with certified trainers across various disciplines. Get personalized guidance and support."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-emerald-600" />} 
              title="Data-Driven Insights" 
              desc="Track your InBody metrics, daily logs, and progress with beautiful, easy-to-read visualizations."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 group">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Onboarding({ user, onComplete }: { user: UserProfile, onComplete: (u: UserProfile) => void }) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    role: undefined,
    gender: undefined,
    goal: undefined,
    budgetLevel: 'medium',
    selectedSports: [],
    playsSports: undefined,
  });
  const [saving, setSaving] = useState(false);

  // Determine which questions are visible based on what's filled
  const isRoleFilled = !!formData.role;
  const isAgeFilled = !!formData.age && formData.age > 0;
  const isGenderFilled = !!formData.gender;
  const isNationalityFilled = !!formData.nationality && formData.nationality.trim().length > 0;
  const isHeightFilled = !!formData.height && formData.height > 0;
  const isWeightFilled = !!formData.weight && formData.weight > 0;
  const isGoalFilled = !!formData.goal;
  const isFitnessLevelFilled = !!formData.fitnessLevel;
  const isActivityLevelFilled = !!formData.activityLevel;
  const isPlaysSportsFilled = formData.playsSports !== undefined;
  const isSportsFilled = formData.playsSports === false || (formData.selectedSports && formData.selectedSports.length > 0);
  
  // Coach specific
  const isSpecialtiesFilled = !!formData.specialties && formData.specialties.length > 0;
  const isExperienceFilled = !!formData.experienceYears && formData.experienceYears > 0;
  const isBioFilled = !!formData.bio && formData.bio.trim().length > 0;
  const isHourlyRateFilled = !!formData.hourlyRate && formData.hourlyRate > 0;

  // Check if goals are selected for all chosen sports
  const areSportGoalsFilled = formData.playsSports === false || (
    isSportsFilled && 
    formData.selectedSports && 
    formData.selectedSports.every(s => s.goalIds.length > 0)
  );

  const isHealthStatusFilled = formData.healthStatus !== undefined; // Can be empty string

  const handleComplete = async () => {
    setSaving(true);
    const updatedUser = { ...user, ...formData, onboarded: true };
    
    // Remove undefined values to prevent Firestore errors
    const cleanUser = Object.fromEntries(
      Object.entries(updatedUser).filter(([_, v]) => v !== undefined)
    );
    
    try {
      await setDoc(doc(db, 'users', user.uid), cleanUser);
      onComplete(cleanUser as UserProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleSport = (sportId: string) => {
    const current = formData.selectedSports || [];
    const exists = current.find(s => s.sportId === sportId);
    if (exists) {
      setFormData({ ...formData, selectedSports: current.filter(s => s.sportId !== sportId) });
    } else {
      setFormData({ ...formData, selectedSports: [...current, { sportId, goalIds: [] }] });
    }
  };

  const toggleGoal = (sportId: string, goalId: string) => {
    const current = formData.selectedSports || [];
    const updated = current.map(s => {
      if (s.sportId === sportId) {
        const goals = s.goalIds.includes(goalId) 
          ? s.goalIds.filter(g => g !== goalId)
          : [...s.goalIds, goalId];
        return { ...s, goalIds: goals };
      }
      return s;
    });
    setFormData({ ...formData, selectedSports: updated });
  };

  const toggleSpecialty = (specialty: string) => {
    const current = formData.specialties || [];
    if (current.includes(specialty)) {
      setFormData({ ...formData, specialties: current.filter(s => s !== specialty) });
    } else {
      setFormData({ ...formData, specialties: [...current, specialty] });
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">لنقم بإعداد ملفك الشخصي</h1>
          <p className="text-slate-600 mt-2">أجب عن بضعة أسئلة للحصول على توصيات مخصصة.</p>
        </div>

        <div className="space-y-8">
          {/* Role Selection */}
          <Card className="p-6 shadow-sm border-emerald-100">
            <label className="block text-lg font-bold text-slate-900 mb-4" dir="rtl">هل تنضم كمستخدم أم كمدرب؟ *</label>
            <div className="grid grid-cols-2 gap-4" dir="rtl">
              <button
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={cn(
                  "py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                  formData.role === 'user' ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "border-slate-100 text-slate-600 hover:border-emerald-200 bg-white"
                )}
              >
                <User size={32} />
                <span className="font-bold text-lg">مستخدم</span>
                <span className="text-xs opacity-80">أريد تتبع لياقتي</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, role: 'coach' })}
                className={cn(
                  "py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                  formData.role === 'coach' ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "border-slate-100 text-slate-600 hover:border-emerald-200 bg-white"
                )}
              >
                <Users size={32} />
                <span className="font-bold text-lg">مدرب</span>
                <span className="text-xs opacity-80">أريد تدريب الآخرين</span>
              </button>
            </div>
          </Card>

          {/* User Flow */}
          {isRoleFilled && formData.role === 'user' && (
            <>
              {/* Age */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6 shadow-sm border-emerald-100">
                  <label className="block text-lg font-bold text-slate-900 mb-4">1. What is your age? *</label>
                  <input 
                    type="number" 
                    className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                    placeholder="e.g. 25"
                    value={formData.age || ''}
                    onChange={e => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </Card>
              </motion.div>

          {/* Gender */}
          {isAgeFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">2. What is your gender? *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g as any })}
                      className={cn(
                        "py-4 rounded-xl border-2 transition-all capitalize font-semibold text-lg",
                        formData.gender === g ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Nationality */}
          {isGenderFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">3. What is your nationality? *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                  placeholder="e.g. Egyptian, Saudi, American..."
                  value={formData.nationality || ''}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                />
              </Card>
            </motion.div>
          )}

          {/* Height */}
          {isNationalityFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">4. What is your height (cm)? *</label>
                <input 
                  type="number" 
                  className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                  placeholder="e.g. 175"
                  value={formData.height || ''}
                  onChange={e => setFormData({ ...formData, height: e.target.value ? Number(e.target.value) : undefined })}
                />
              </Card>
            </motion.div>
          )}

          {/* Weight */}
          {isHeightFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">5. What is your weight (kg)? *</label>
                <input 
                  type="number" 
                  className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                  placeholder="e.g. 70"
                  value={formData.weight || ''}
                  onChange={e => setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : undefined })}
                />
              </Card>
            </motion.div>
          )}

          {/* Goal */}
          {isWeightFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">6. What is your primary goal? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'weight_loss', label: 'Weight Loss', icon: <TrendingUp size={20} className="rotate-180" /> },
                    { id: 'muscle_gain', label: 'Muscle Gain', icon: <Dumbbell size={20} /> },
                    { id: 'maintenance', label: 'Maintenance', icon: <Activity size={20} /> },
                    { id: 'fitness', label: 'General Fitness', icon: <Heart size={20} /> },
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setFormData({ ...formData, goal: g.id as any })}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                        formData.goal === g.id ? "bg-emerald-50 border-emerald-600 text-emerald-900" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", formData.goal === g.id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500")}>
                        {g.icon}
                      </div>
                      <span className="font-semibold text-lg">{g.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Fitness Level */}
          {isGoalFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">7. What is your fitness level? *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, fitnessLevel: level as any })}
                      className={cn(
                        "py-4 rounded-xl border-2 transition-all capitalize font-semibold text-lg",
                        formData.fitnessLevel === level ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Activity Level */}
          {isFitnessLevelFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">8. How active are you daily? *</label>
                <div className="space-y-3">
                  {[
                    { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                    { id: 'light', label: 'Lightly Active', desc: 'Exercise 1-3 days/week' },
                    { id: 'moderate', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
                    { id: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
                    { id: 'very_active', label: 'Extra Active', desc: 'Very hard exercise & physical job' },
                  ].map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, activityLevel: level.id as any })}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                        formData.activityLevel === level.id ? "bg-emerald-50 border-emerald-600 text-emerald-900" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                      )}
                    >
                      <div className="text-left">
                        <div className="font-semibold text-lg">{level.label}</div>
                        <div className="text-sm opacity-70">{level.desc}</div>
                      </div>
                      {formData.activityLevel === level.id && <CheckCircle2 className="text-emerald-600" size={24} />}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Plays Sports? */}
          {isActivityLevelFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">9. Do you play any sports? *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, playsSports: true })}
                    className={cn(
                      "py-4 rounded-xl border-2 transition-all font-semibold text-lg",
                      formData.playsSports === true ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, playsSports: false, selectedSports: [] })}
                    className={cn(
                      "py-4 rounded-xl border-2 transition-all font-semibold text-lg",
                      formData.playsSports === false ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                    )}
                  >
                    No
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Select Sports */}
          {isPlaysSportsFilled && formData.playsSports === true && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">10. Select your sports *</label>
                <div className="space-y-3">
                  {SPORTS_DATA.map(sport => {
                    const isSelected = formData.selectedSports?.some(s => s.sportId === sport.id);
                    return (
                      <button
                        key={sport.id}
                        onClick={() => toggleSport(sport.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                          isSelected ? "bg-emerald-50 border-emerald-600 text-emerald-900" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                        )}
                      >
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500")}>
                          {sport.icon}
                        </div>
                        <span className="font-semibold text-lg flex-1">{sport.name}</span>
                        {isSelected && <CheckCircle2 size={24} className="text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Sports Goals */}
          {isSportsFilled && formData.playsSports === true && formData.selectedSports && formData.selectedSports.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">11. What are your goals for these sports? *</label>
                <div className="space-y-6">
                  {formData.selectedSports.map(selectedSport => {
                    const sportDef = SPORTS_DATA.find(s => s.id === selectedSport.sportId);
                    if (!sportDef) return null;
                    return (
                      <div key={sportDef.id} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          {sportDef.icon} {sportDef.name} Goals
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {sportDef.goals.map(goal => {
                            const isGoalSelected = selectedSport.goalIds.includes(goal);
                            return (
                              <button
                                key={goal}
                                onClick={() => toggleGoal(sportDef.id, goal)}
                                className={cn(
                                  "px-4 py-2 rounded-lg text-sm transition-all border-2",
                                  isGoalSelected ? "bg-emerald-100 border-emerald-400 text-emerald-800 font-bold" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200"
                                )}
                              >
                                {goal}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Health Status */}
          {areSportGoalsFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-emerald-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">
                  {formData.playsSports ? "12." : "10."} Any health conditions or injuries? *
                </label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none text-lg"
                  placeholder="Type 'None' if you don't have any..."
                  value={formData.healthStatus || ''}
                  onChange={e => setFormData({ ...formData, healthStatus: e.target.value })}
                />
                <p className="text-sm text-slate-500 mt-2">This is required. If none, please type "None" or "لا يوجد".</p>
              </Card>
            </motion.div>
          )}

            </>
          )}

          {/* Coach Flow */}
          {isRoleFilled && formData.role === 'coach' && (
            <>
              {/* Specialties */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6 shadow-sm border-emerald-100">
                  <label className="block text-lg font-bold text-slate-900 mb-4" dir="rtl">1. ما هي تخصصاتك؟ *</label>
                  <div className="flex flex-wrap gap-3" dir="rtl">
                    {['إنقاص الوزن', 'بناء العضلات', 'كمال الأجسام', 'رفع الأثقال', 'يوجا', 'إعادة التأهيل', 'تغذية', 'تكييف رياضي'].map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSpecialty(s)}
                        className={cn(
                          "px-4 py-3 rounded-xl border-2 transition-all font-semibold",
                          formData.specialties?.includes(s) ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "border-slate-100 text-slate-600 hover:border-emerald-200"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Experience */}
              {isSpecialtiesFilled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6 shadow-sm border-emerald-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4" dir="rtl">2. سنوات الخبرة؟ *</label>
                    <input 
                      type="number" 
                      className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                      placeholder="مثال: 5"
                      dir="rtl"
                      value={formData.experienceYears || ''}
                      onChange={e => setFormData({ ...formData, experienceYears: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Certifications */}
              {isExperienceFilled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6 shadow-sm border-emerald-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4" dir="rtl">3. اذكر شهاداتك (اختياري)</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none text-lg"
                      placeholder="مثال: NASM CPT, ISSA Nutritionist..."
                      dir="rtl"
                      value={formData.certifications || ''}
                      onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Bio */}
              {isExperienceFilled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6 shadow-sm border-emerald-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4" dir="rtl">4. اكتب نبذة قصيرة عنك *</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none text-lg"
                      placeholder="أخبر العملاء المحتملين عن أسلوبك في التدريب..."
                      dir="rtl"
                      value={formData.bio || ''}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Hourly Rate */}
              {isBioFilled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6 shadow-sm border-emerald-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4" dir="rtl">5. ما هو أجرك بالساعة ($)؟ *</label>
                    <input 
                      type="number" 
                      className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                      placeholder="مثال: 50"
                      dir="rtl"
                      value={formData.hourlyRate || ''}
                      onChange={e => setFormData({ ...formData, hourlyRate: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </Card>
                </motion.div>
              )}
            </>
          )}

          {/* Complete Button */}
          {((formData.role === 'user' && areSportGoalsFilled && isHealthStatusFilled && formData.healthStatus!.trim().length > 0) || 
            (formData.role === 'coach' && isHourlyRateFilled)) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 pb-12">
              <Button 
                onClick={handleComplete} 
                disabled={saving}
                className="w-full py-6 rounded-2xl text-xl font-bold shadow-lg shadow-emerald-200"
              >
                {saving ? "جاري حفظ الملف الشخصي..." : "إكمال الإعداد"}
                {!saving && <ChevronRight size={24} className="ml-2 rotate-180" />}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, logs, onTabChange, onUpdate }: { user: UserProfile, logs: DailyLog[], onTabChange: (tab: string) => void, onUpdate: (u: UserProfile) => void }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === todayStr);
  const latestLog = logs[0];
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [appleSteps, setAppleSteps] = useState(0);
  const [appleCalories, setAppleCalories] = useState(0);
  const [appleHeartRate, setAppleHeartRate] = useState(0);
  const [isSyncingFit, setIsSyncingFit] = useState(false);
  const [isSyncingApple, setIsSyncingApple] = useState(false);
  
  // Scientific Calorie Calculation (Mifflin-St Jeor Equation)
  const calculateCalorieGoal = () => {
    const plan = calculatePlanDetails(user);
    return plan.calorieGoal;
  };

  const calorieGoal = calculateCalorieGoal();
  const consumed = todayLog?.totalCalories || 0;
  
  // Calculate burned calories from logged workouts
  const loggedBurned = (todayLog?.workouts || []).reduce((sum: number, w: any) => sum + (w.caloriesBurned || 0), 0);
  
  const netCalories = consumed - (burnedCalories + loggedBurned);
  const remaining = calorieGoal - netCalories;
  
  const [showSportsEditor, setShowSportsEditor] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState(user.weight?.toString() || '');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Load data from today's log if exists
    if (todayLog) {
      setBurnedCalories(todayLog.fitCalories || 0);
      setSteps(todayLog.fitSteps || 0);
      setDistance(todayLog.fitDistance || 0);
      setActiveMinutes(todayLog.fitActiveMinutes || 0);
      setAppleSteps(todayLog.appleSteps || 0);
      setAppleCalories(todayLog.appleCalories || 0);
      setAppleHeartRate(todayLog.appleHeartRate || 0);
    }
    
    if (user.googleFitTokens) {
      syncGoogleFit();
    }
  }, [user.googleFitTokens, todayLog]);

  const syncAppleHealth = async () => {
    setIsSyncingApple(true);
    // Simulate Apple Health Sync (In a real iOS app, this would call HealthKit)
    // For this web demo, we'll generate realistic data based on the time of day
    setTimeout(async () => {
      const hoursPassed = new Date().getHours();
      const baseSteps = 500 * hoursPassed;
      const randomSteps = Math.floor(Math.random() * 1000);
      const totalSteps = baseSteps + randomSteps;
      const totalCalories = Math.round(totalSteps * 0.04);
      const avgHeartRate = 70 + Math.floor(Math.random() * 20);

      setAppleSteps(totalSteps);
      setAppleCalories(totalCalories);
      setAppleHeartRate(avgHeartRate);

      try {
        const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
        const logDoc = await getDoc(logRef);
        if (logDoc.exists()) {
          await updateDoc(logRef, {
            appleSteps: totalSteps,
            appleCalories: totalCalories,
            appleHeartRate: avgHeartRate
          });
        } else {
          await setDoc(logRef, {
            date: todayStr,
            meals: [],
            totalCalories: 0,
            exercise: '',
            waterIntake: 0,
            weight: user.weight || 0,
            appleSteps: totalSteps,
            appleCalories: totalCalories,
            appleHeartRate: avgHeartRate
          });
        }
      } catch (error) {
        console.error("Error saving Apple Health data:", error);
      } finally {
        setIsSyncingApple(false);
      }
    }, 1500);
  };

  const syncGoogleFit = async () => {
    if (!user.googleFitTokens) return;
    setIsSyncingFit(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startTime = today.getTime();
      const endTime = new Date().getTime();

      const response = await fetch('/api/google-fit/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: user.googleFitTokens,
          startTime,
          endTime
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Extract data from aggregate buckets
        const bucket = data.bucket?.[0];
        if (bucket) {
          const calories = bucket.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
          const stepsVal = bucket.dataset?.[1]?.point?.[0]?.value?.[0]?.intVal || 0;
          const distanceVal = bucket.dataset?.[2]?.point?.[0]?.value?.[0]?.fpVal || 0;
          const activeMinsVal = bucket.dataset?.[3]?.point?.[0]?.value?.[0]?.intVal || 0;
          
          setBurnedCalories(Math.round(calories));
          setSteps(stepsVal);
          setDistance(distanceVal);
          setActiveMinutes(activeMinsVal);

          // Save to daily log
          const todayStr = new Date().toISOString().split('T')[0];
          const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
          const logDoc = await getDoc(logRef);
          if (logDoc.exists()) {
            await updateDoc(logRef, {
              fitCalories: Math.round(calories),
              fitSteps: stepsVal,
              fitDistance: distanceVal,
              fitActiveMinutes: activeMinsVal
            });
          } else {
            await setDoc(logRef, {
              date: todayStr,
              meals: [],
              totalCalories: 0,
              exercise: '',
              waterIntake: 0,
              weight: user.weight || 0,
              fitCalories: Math.round(calories),
              fitSteps: stepsVal,
              fitDistance: distanceVal,
              fitActiveMinutes: activeMinsVal
            });
          }
        }
      }
    } catch (error) {
      console.error("Error syncing Google Fit:", error);
    } finally {
      setIsSyncingFit(false);
    }
  };

  const [showFitGuide, setShowFitGuide] = useState(false);
  const [serverRedirectUri, setServerRedirectUri] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (currentPath === '/privacy') {
    return (
      <div className="min-h-screen bg-white p-8 max-w-3xl mx-auto text-slate-700">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: March 12, 2026</p>
        <p className="mb-4">NABD ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.</p>
        <h2 className="text-xl font-bold mt-6 mb-4">1. Information We Collect</h2>
        <p className="mb-4">When you connect your Google Fit account, we access your fitness data including steps, calories burned, distance, and activity minutes. We also store your profile information such as age, weight, and height to provide personalized health insights.</p>
        <h2 className="text-xl font-bold mt-6 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use this data solely to display your health progress within the app and to provide AI-powered health recommendations. We do not sell or share your personal health data with third parties.</p>
        <h2 className="text-xl font-bold mt-6 mb-4">3. Data Security</h2>
        <p className="mb-4">Your data is stored securely using Firebase and is only accessible by you through your authenticated account.</p>
        <button onClick={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} className="mt-8 px-6 py-2 bg-emerald-600 text-white rounded-lg">Back to App</button>
      </div>
    );
  }

  if (currentPath === '/terms') {
    return (
      <div className="min-h-screen bg-white p-8 max-w-3xl mx-auto text-slate-700">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">Last updated: March 12, 2026</p>
        <p className="mb-4">By using NABD, you agree to these terms. Please read them carefully.</p>
        <h2 className="text-xl font-bold mt-6 mb-4">1. Use of Service</h2>
        <p className="mb-4">You must follow any policies made available to you within the Service. You are responsible for maintaining the confidentiality of your account.</p>
        <h2 className="text-xl font-bold mt-6 mb-4">2. Health Disclaimer</h2>
        <p className="mb-4">NABD is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.</p>
        <button onClick={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} className="mt-8 px-6 py-2 bg-emerald-600 text-white rounded-lg">Back to App</button>
      </div>
    );
  }

  const [showSleepTips, setShowSleepTips] = useState(false);

  const connectGoogleFit = async () => {
    try {
      const configRes = await fetch('/api/auth/google-fit/config');
      const configData = await configRes.json();
      setServerRedirectUri(configData.redirectUri);

      const response = await fetch('/api/auth/google-fit/url');
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.includes("credentials are not configured")) {
          setShowFitGuide(true);
        } else {
          alert("خطأ في الاتصال بجوجل فيت: " + (errorData.error || "خطأ غير معروف"));
        }
        return;
      }
      const { url } = await response.json();
      if (!url) {
        alert("لم يتم العثور على رابط المصادقة. يرجى مراجعة إعدادات الخادم.");
        return;
      }
      const authWindow = window.open(url, 'google_fit_auth', 'width=600,height=700');
      if (!authWindow) {
        alert("تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.");
      }
    } catch (error) {
      console.error("Error getting auth URL:", error);
      alert("حدث خطأ أثناء محاولة الاتصال بجوجل فيت.");
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_FIT_AUTH_SUCCESS') {
        const { tokens } = event.data;
        await updateDoc(doc(db, 'users', user.uid), { googleFitTokens: tokens });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user.uid]);

  const handleWaterClick = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
      const logDoc = await getDoc(logRef);
      
      if (logDoc.exists()) {
        await updateDoc(logRef, { 
          waterIntake: (logDoc.data().waterIntake || 0) + 0.25 
        });
      } else {
        await setDoc(logRef, {
          date: todayStr,
          meals: [],
          totalCalories: 0,
          exercise: '',
          waterIntake: 0.25,
          weight: user.weight || 0
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/dailyLogs/${todayStr}`);
    } finally {
      setUpdating(false);
    }
  };

  const [showStepsModal, setShowStepsModal] = useState(false);
  const [manualSteps, setManualSteps] = useState('');

  const handleManualStepsUpdate = async () => {
    if (!manualSteps) return;
    setUpdating(true);
    try {
      const stepsNum = parseInt(manualSteps);
      await updateDoc(doc(db, 'users', user.uid), { 
        steps: stepsNum,
        lastSync: new Date().toISOString()
      });
      setSteps(stepsNum);
      setShowStepsModal(false);
      setManualSteps('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setUpdating(false);
    }
  };
  const handleWeightUpdate = async () => {
    if (updating || !newWeight) return;
    setUpdating(true);
    try {
      const weightNum = parseFloat(newWeight);
      await updateDoc(doc(db, 'users', user.uid), { weight: weightNum });
      
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
      const logDoc = await getDoc(logRef);
      if (logDoc.exists()) {
        await updateDoc(logRef, { weight: weightNum });
      }
      setShowWeightModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setUpdating(false);
    }
  };

  const getWeightLastUpdated = () => {
    if (!latestLog?.date) return 'Not updated yet';
    const lastDate = new Date(latestLog.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Updated today';
    if (diffDays === 1) return 'Updated yesterday';
    return `Last updated ${diffDays} days ago`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.displayName.split(' ')[0]}!</h1>
          <p className="text-slate-500">Here's your health overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          {user.googleFitTokens ? (
            <Button 
              variant="outline" 
              onClick={syncGoogleFit} 
              disabled={isSyncingFit}
              className="bg-white border-emerald-100 text-emerald-700"
            >
              <RefreshCw size={18} className={cn("mr-2", isSyncingFit && "animate-spin")} />
              {isSyncingFit ? 'Syncing...' : 'Sync Google Fit'}
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={connectGoogleFit}
              className="bg-emerald-600 text-white"
            >
              <Activity size={18} className="mr-2" />
              Connect Google Fit
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={syncAppleHealth} 
            disabled={isSyncingApple}
            className="bg-white border-emerald-100 text-emerald-700"
          >
            <RefreshCw size={18} className={cn("mr-2", isSyncingApple && "animate-spin")} />
            {isSyncingApple ? 'Syncing Apple...' : 'Sync Apple Health'}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => onTabChange('nutrition')}
            className="bg-white border-emerald-100 text-emerald-700"
          >
            <RefreshCw size={18} className="mr-2" />
            Get New Plan
          </Button>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-emerald-50 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today</p>
              <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calories Card */}
        <Card 
          className="p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-emerald-200 transition-all group hover:shadow-lg hover:shadow-emerald-100/50"
          onClick={() => onTabChange('nutrition')}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calories</p>
              <div className="flex gap-2">
                {user.googleFitTokens ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); syncGoogleFit(); }}
                    className={cn("w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors", isSyncingFit && "animate-spin")}
                  >
                    <Activity size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); connectGoogleFit(); }}
                    className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Connect Fit
                  </button>
                )}
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Plus size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <h3 className="text-4xl font-bold text-slate-900">{consumed}</h3>
              <span className="text-lg font-medium text-slate-400">/ {calorieGoal}</span>
            </div>
            {(burnedCalories > 0 || loggedBurned > 0) && (
              <div className="mb-4 space-y-1">
                {burnedCalories > 0 && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Activity size={12} />
                    -{burnedCalories} kcal (Google Fit)
                  </p>
                )}
                {loggedBurned > 0 && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Dumbbell size={12} />
                    -{loggedBurned} kcal (Logged Workouts)
                  </p>
                )}
              </div>
            )}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((netCalories/calorieGoal)*100, 100)}%` }}
                className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-semibold flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-500" />
                {remaining > 0 ? `${remaining} kcal remaining` : 'Daily goal achieved!'}
              </p>
              <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                <p className="text-[10px] text-emerald-700 leading-tight font-medium">
                  <span className="font-bold uppercase mr-1">Science:</span>
                  Net calories = Consumed - Burned. Log workouts or connect Fit to track activity.
                </p>
              </div>
            </div>
          </div>
          <Utensils className="absolute -bottom-6 -right-6 text-emerald-50 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" size={140} />
        </Card>

        {/* Water Intake Card */}
        <Card 
          className="p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-blue-200 transition-all group hover:shadow-lg hover:shadow-blue-100/50"
          onClick={handleWaterClick}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Water Intake</p>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Plus size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <h3 className="text-4xl font-bold text-slate-900">{(todayLog?.waterIntake || 0).toFixed(2)}</h3>
              <span className="text-lg font-medium text-slate-400">/ 2.5 L</span>
            </div>
            <div className="flex justify-between items-center mb-4 px-1">
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: i <= (todayLog?.waterIntake || 0) * 4 ? 1.1 : 1 }}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-500", 
                    i <= (todayLog?.waterIntake || 0) * 4 
                      ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                      : "bg-slate-200"
                  )} 
                />
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-semibold">Click to add 250ml (1 cup)</p>
              <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                <p className="text-[10px] text-blue-700 leading-tight font-medium">
                  <span className="font-bold uppercase mr-1">Research:</span>
                  Optimal hydration improves cognitive function and physical endurance.
                </p>
              </div>
            </div>
          </div>
          <Droplets className="absolute -bottom-6 -right-6 text-blue-50 opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" size={140} />
          {updating && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-20">
              <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </Card>

        {/* Weight Card */}
        <Card 
          className="p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-emerald-200 transition-all group hover:shadow-lg hover:shadow-emerald-100/50"
          onClick={() => setShowWeightModal(true)}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weight</p>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Settings size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <h3 className="text-4xl font-bold text-slate-900">{user.weight}</h3>
              <span className="text-lg font-medium text-slate-400">kg</span>
            </div>
            <div className="h-14 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logs.slice(0, 7).reverse()}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    strokeWidth={3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-semibold">{getWeightLastUpdated()}</p>
              <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                <p className="text-[10px] text-emerald-700 leading-tight font-medium">
                  <span className="font-bold uppercase mr-1">Tip:</span>
                  Consistent daily weighing helps track true biological trends.
                </p>
              </div>
            </div>
          </div>
          <WeightIcon className="absolute -bottom-6 -right-6 text-emerald-50 opacity-20 group-hover:scale-110 transition-transform duration-500" size={140} />
        </Card>

        {/* Smart Plan Card */}
        {user.targetWeight && user.targetDate ? (
          <Card 
            className="p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-emerald-200 transition-all group hover:shadow-lg hover:shadow-emerald-100/50"
            onClick={() => onTabChange('plans')}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Smart Plan</p>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Target size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <h3 className="text-4xl font-bold text-slate-900">{user.targetWeight}</h3>
                <span className="text-lg font-medium text-slate-400">kg Goal</span>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-4">
                Target Date: {new Date(user.targetDate).toLocaleDateString()}
              </p>
              
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max((user.weight! / user.targetWeight) * 100, 0), 100)}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-semibold flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-500" />
                  {Math.abs(user.targetWeight - user.weight!).toFixed(1)} kg to go
                </p>
              </div>
            </div>
            <Target className="absolute -bottom-6 -right-6 text-emerald-50 opacity-20 group-hover:scale-110 transition-transform duration-500" size={140} />
          </Card>
        ) : (
          <Card 
            className="p-6 flex flex-col justify-center items-center relative overflow-hidden cursor-pointer hover:border-emerald-200 transition-all group hover:shadow-lg hover:shadow-emerald-100/50 bg-emerald-50/30 border-dashed border-emerald-200"
            onClick={() => onTabChange('plans')}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-slate-800">Set a Smart Plan</h3>
            <p className="text-xs text-slate-500 text-center mt-1">Reach your target weight with a scientific plan</p>
          </Card>
        )}

        {/* Activity Card */}
        <Card className="p-6 flex flex-col justify-between relative overflow-hidden transition-all group hover:shadow-lg hover:shadow-orange-100/50">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activity</p>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowStepsModal(true); }}
                  className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                  title="Add Steps Manually"
                >
                  <Plus size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); syncAppleHealth(); }}
                  className={cn("w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors", isSyncingApple && "animate-spin")}
                  title="Sync Apple Health"
                >
                  <Heart size={16} />
                </button>
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Activity size={16} />
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Steps</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold text-slate-900">{(steps + appleSteps).toLocaleString()}</h3>
                </div>
                {appleSteps > 0 && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                    <Heart size={10} />
                    {appleSteps.toLocaleString()} from Apple Health
                  </p>
                )}
                {steps > 0 && (
                  <p className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                    <Activity size={10} />
                    {steps.toLocaleString()} from Google Fit
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Distance</p>
                  <p className="text-lg font-bold text-slate-900">{(distance / 1000).toFixed(2)} <span className="text-sm font-medium text-slate-400">km</span></p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Heart Rate</p>
                  <p className="text-lg font-bold text-slate-900">{appleHeartRate || '--'} <span className="text-sm font-medium text-slate-400">bpm</span></p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-orange-50/50 rounded-lg border border-orange-100/50">
                <p className="text-[10px] text-orange-700 leading-tight font-medium">
                  <span className="font-bold uppercase mr-1">Sync:</span>
                  Combined data from Google Fit and Apple Health.
                </p>
              </div>
            </div>
          </div>
          <Activity className="absolute -bottom-6 -right-6 text-orange-50 opacity-20 group-hover:scale-110 transition-transform duration-500" size={140} />
        </Card>

        {/* Sleep Card */}
        <Card 
          className="p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-indigo-200 transition-all group hover:shadow-lg hover:shadow-indigo-100/50"
          onClick={() => onTabChange('sleep')}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sleep</p>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSleepTips(true); }}
                  className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                  title="Sleep Tips"
                >
                  <Lightbulb size={16} />
                </button>
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Moon size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <h3 className="text-4xl font-bold text-slate-900">
                {todayLog?.sleepDuration ? Math.floor(todayLog.sleepDuration / 60) : '--'}
              </h3>
              <span className="text-lg font-medium text-slate-400">h</span>
              <h3 className="text-4xl font-bold text-slate-900 ml-1">
                {todayLog?.sleepDuration ? todayLog.sleepDuration % 60 : '--'}
              </h3>
              <span className="text-lg font-medium text-slate-400">m</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-semibold">
                Quality: <span className="text-indigo-600 font-bold capitalize">{todayLog?.sleepQuality || 'Not logged'}</span>
              </p>
              <div className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                <p className="text-[10px] text-indigo-700 leading-tight font-medium">
                  <span className="font-bold uppercase mr-1">Science:</span>
                  Sleep cycles are 90 mins. Use the smart calculator for optimal rest.
                </p>
              </div>
            </div>
          </div>
          <Moon className="absolute -bottom-6 -right-6 text-indigo-50 opacity-20 group-hover:scale-110 transition-transform duration-500" size={140} />
        </Card>
      </div>

      {/* Weight Update Modal */}
      <AnimatePresence>
        {showWeightModal && (
          <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Update Weight</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={newWeight}
                    onChange={e => setNewWeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg"
                    placeholder="e.g. 75.5"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowWeightModal(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={handleWeightUpdate} disabled={updating}>
                    {updating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showStepsModal && (
          <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Update Steps</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Steps Today</label>
                  <input 
                    type="number" 
                    value={manualSteps}
                    onChange={e => setManualSteps(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-lg"
                    placeholder="e.g. 10000"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowStepsModal(false)}>Cancel</Button>
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white border-none" onClick={handleManualStepsUpdate} disabled={updating}>
                    {updating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showSleepTips && (
          <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">نصائح لتحسين جودة النوم</h3>
                <button onClick={() => setShowSleepTips(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 p-3 bg-indigo-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 text-sm">التزم بجدول ثابت</h4>
                    <p className="text-xs text-indigo-700">اذهب للنوم واستيقظ في نفس الوقت يومياً، حتى في عطلات نهاية الأسبوع.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-blue-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                    <MonitorOff size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">ابتعد عن الشاشات</h4>
                    <p className="text-xs text-blue-700">تجنب الضوء الأزرق من الهواتف والأجهزة قبل النوم بـ 60 دقيقة على الأقل.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 shrink-0 shadow-sm">
                    <Coffee size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">راقب كافيين المساء</h4>
                    <p className="text-xs text-slate-700">تجنب الكافيين والوجبات الثقيلة قبل النوم بـ 4-6 ساعات.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-emerald-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                    <Wind size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">هيئ بيئة النوم</h4>
                    <p className="text-xs text-emerald-700">تأكد من أن غرفتك مظلمة، هادئة، ودرجة حرارتها مائلة للبرودة.</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white border-none" onClick={() => setShowSleepTips(false)}>
                فهمت، سأحاول تطبيقها
              </Button>
            </motion.div>
          </div>
        )}

        {showFitGuide && (
          <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">إعداد جوجل فيت / Google Fit Setup</h3>
                </div>
                <button onClick={() => setShowFitGuide(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 text-slate-600">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-sm font-bold text-amber-900 mb-2">⚠️ تنبيه هام:</p>
                  <p className="text-sm text-amber-800">
                    لم يتم العثور على مفاتيح الربط في إعدادات البرنامج. يجب عليك إضافتها يدوياً لمرة واحدة فقط.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">الخطوات المطلوبة:</h4>
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li>اذهب إلى <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline">Google Cloud Console</a> وأنشئ مشروعاً جديداً.</li>
                    <li>فعل خدمة <b>Fitness API</b> من قسم Library.</li>
                    <li>أنشئ <b>OAuth client ID</b> من نوع <b>Web application</b>.</li>
                    <li>أضف هذا الرابط في خانة <b>Authorized redirect URIs</b> (تأكد من تطابقه تماماً):
                      <div className="mt-2 flex gap-2">
                        <div className="flex-1 p-2 bg-slate-100 rounded-lg font-mono text-[10px] break-all select-all border border-slate-200">
                          {serverRedirectUri || `${window.location.origin}/auth/google-fit/callback`}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(serverRedirectUri || `${window.location.origin}/auth/google-fit/callback`);
                            alert("تم نسخ الرابط!");
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </li>
                    <li>انسخ الـ <b>Client ID</b> والـ <b>Client Secret</b>.</li>
                    <li>افتح قائمة <b>Settings &gt; Secrets</b> في هذا البرنامج وأضف:
                      <ul className="list-disc list-inside mt-2 ml-4">
                        <li><code>GOOGLE_FIT_CLIENT_ID</code></li>
                        <li><code>GOOGLE_FIT_CLIENT_SECRET</code></li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <Button variant="primary" className="w-full py-4" onClick={() => setShowFitGuide(false)}>
                  فهمت، سأقوم بالإعداد الآن
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Recent Meals</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onTabChange('nutrition')}>
                  <Plus size={16} className="mr-1" />
                  Log Meal
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onTabChange('nutrition')}>View All</Button>
              </div>
            </div>
            <div className="space-y-6">
              {todayLog?.meals?.length ? todayLog.meals.map((meal, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-emerald-50">
                    {meal.imageUrl ? <img src={meal.imageUrl} className="w-full h-full object-cover" /> : <Utensils className="w-full h-full p-4 text-slate-300" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{meal.name}</h4>
                    <p className="text-sm text-slate-500">{meal.calories} kcal • {meal.protein}g Protein</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time</p>
                    <p className="text-sm font-semibold text-slate-600">08:30 AM</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-400">
                  <Apple size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No meals logged today yet.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 bg-emerald-900 text-white relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-4">AI Health Tip</h3>
              <p className="text-emerald-100 leading-relaxed mb-8">
                "Based on your goal of muscle gain, try increasing your protein intake by 15g in your breakfast. Adding Greek yogurt or eggs would be a great scientific choice."
              </p>
              <div className="mt-auto">
                <Button 
                  variant="secondary" 
                  className="bg-white text-emerald-900 hover:bg-emerald-50 border-none w-full"
                  onClick={() => onTabChange('nutrition')}
                >
                  Get New Plan
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
            <Activity className="absolute -bottom-10 -right-10 text-emerald-800 opacity-50" size={200} />
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Recent Workouts</h3>
              <Button variant="ghost" size="sm" onClick={() => onTabChange('sports')}>
                <Plus size={16} className="mr-1" />
                Log
              </Button>
            </div>
            <div className="space-y-4">
              {todayLog?.workouts?.length ? todayLog.workouts.map((workout, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Dumbbell size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{workout.name}</h4>
                    <p className="text-xs text-slate-500">{workout.duration} mins • {workout.intensity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{workout.caloriesBurned} kcal</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-slate-400">
                  <Dumbbell size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No workouts logged today.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">My Sports</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSportsEditor(true)}>
                <Settings size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {user.selectedSports?.length ? user.selectedSports.map(s => {
                const sport = SPORTS_DATA.find(sd => sd.id === s.sportId);
                return (
                  <div key={s.sportId} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        {sport?.icon}
                      </div>
                      <h4 className="font-bold text-slate-900">{sport?.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.goalIds.map(goal => (
                        <span key={goal} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-600">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-sm">No sports selected yet.</p>
                  <Button variant="ghost" size="sm" onClick={() => setShowSportsEditor(true)} className="text-emerald-600">
                    Add Sports
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showSportsEditor && (
        <SportsEditor 
          user={user} 
          onUpdate={onUpdate}
          onClose={() => setShowSportsEditor(false)} 
        />
      )}

      <footer className="mt-12 py-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm mb-2">© 2026 NABD Health Platform</p>
        <div className="flex justify-center gap-4 text-xs font-medium text-slate-500">
          <button onClick={() => { window.history.pushState({}, '', '/privacy'); setCurrentPath('/privacy'); }} className="hover:text-emerald-600 transition-colors">Privacy Policy</button>
          <button onClick={() => { window.history.pushState({}, '', '/terms'); setCurrentPath('/terms'); }} className="hover:text-emerald-600 transition-colors">Terms of Service</button>
        </div>
      </footer>
    </motion.div>
  );
}

function SportsEditor({ user, onUpdate, onClose }: { user: UserProfile, onUpdate: (u: UserProfile) => void, onClose: () => void }) {
  const [selectedSports, setSelectedSports] = useState<{ sportId: string, goalIds: string[] }[]>(user.selectedSports || []);
  const [targetWeight, setTargetWeight] = useState<number | undefined>(user.targetWeight);
  const [targetDate, setTargetDate] = useState<string | undefined>(user.targetDate);
  const [saving, setSaving] = useState(false);

  const toggleSport = (sportId: string) => {
    const exists = selectedSports.find(s => s.sportId === sportId);
    if (exists) {
      setSelectedSports(selectedSports.filter(s => s.sportId !== sportId));
    } else {
      setSelectedSports([...selectedSports, { sportId, goalIds: [] }]);
    }
  };

  const toggleGoal = (sportId: string, goalId: string) => {
    const updated = selectedSports.map(s => {
      if (s.sportId === sportId) {
        const goals = s.goalIds.includes(goalId) 
          ? s.goalIds.filter(g => g !== goalId)
          : [...s.goalIds, goalId];
        return { ...s, goalIds: goals };
      }
      return s;
    });
    setSelectedSports(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = { 
        selectedSports,
        targetWeight: targetWeight || null,
        targetDate: targetDate || null
      };
      await updateDoc(doc(db, 'users', user.uid), updates);
      onUpdate({ ...user, ...updates });
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Edit Sports & Goals</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {SPORTS_DATA.map(sport => {
            const isSelected = selectedSports.some(s => s.sportId === sport.id);
            return (
              <div key={sport.id} className="space-y-3">
                <button
                  onClick={() => toggleSport(sport.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    isSelected ? "bg-emerald-50 border-emerald-600 text-emerald-900" : "border-slate-200 text-slate-600 hover:border-emerald-200"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500")}>
                    {sport.icon}
                  </div>
                  <span className="font-semibold flex-1">{sport.name}</span>
                  {isSelected && <CheckCircle2 size={20} className="text-emerald-600" />}
                </button>
                
                {isSelected && (
                  <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sport.goals.map(goal => {
                      const isGoalSelected = selectedSports.find(s => s.sportId === sport.id)?.goalIds.includes(goal);
                      return (
                        <button
                          key={goal}
                          onClick={() => toggleGoal(sport.id, goal)}
                          className={cn(
                            "text-left px-4 py-2 rounded-lg text-sm transition-all border",
                            isGoalSelected ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-medium" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Target size={18} className="text-emerald-600" />
              Weight Goal Settings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Weight (kg)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={targetWeight || ''}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                  placeholder="e.g. 75.0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Date</label>
                <input 
                  type="date"
                  value={targetDate || ''}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function ProfileSettings({ user, onUpdate }: { user: UserProfile, onUpdate: (u: UserProfile) => void }) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    height: user.height,
    weight: user.weight,
    age: user.age,
    gender: user.gender,
    nationality: user.nationality,
    goal: user.goal,
    fitnessLevel: user.fitnessLevel,
    dietaryPreferences: user.dietaryPreferences,
    healthStatus: user.healthStatus,
    preferredExerciseSystem: user.preferredExerciseSystem,
    photoURL: user.photoURL,
    activityLevel: user.activityLevel,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setFormData(prev => ({ ...prev, photoURL: downloadURL }));
      
      // Update immediately in Firestore
      await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });
      onUpdate({ ...user, photoURL: downloadURL });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const updatedUser = { ...user, ...formData };
      
      // Remove undefined values from formData to prevent Firestore errors
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== undefined)
      );
      
      await updateDoc(doc(db, 'users', user.uid), cleanData);
      onUpdate(updatedUser as UserProfile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            <span>Profile Updated!</span>
          </motion.div>
        )}
      </div>

      <Card className="p-8">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-100">
            <div className="relative">
              <img 
                src={formData.photoURL || user.photoURL || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-emerald-50 shadow-md"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {uploadingImage ? <RefreshCw className="animate-spin" size={18} /> : <Camera size={18} />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900">{user.displayName}</h2>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Height (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height || ''}
                    onChange={e => setFormData({ ...formData, height: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Age</label>
                  <input 
                    type="number" 
                    value={formData.age || ''}
                    onChange={e => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Gender</label>
                  <select 
                    value={formData.gender || ''}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nationality</label>
                <input 
                  type="text" 
                  value={formData.nationality || ''}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Goals & Fitness */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Goals & Fitness</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Activity Level</label>
                <select 
                  value={formData.activityLevel || ''}
                  onChange={e => setFormData({ ...formData, activityLevel: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="sedentary">Sedentary (Little/No exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="active">Very Active (6-7 days/week)</option>
                  <option value="very_active">Extra Active (Physical job/Hard training)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Primary Goal</label>
                <select 
                  value={formData.goal || ''}
                  onChange={e => setFormData({ ...formData, goal: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="fitness">General Fitness</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Fitness Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, fitnessLevel: level as any })}
                      className={cn(
                        "py-2 rounded-xl border text-sm transition-all capitalize",
                        formData.fitnessLevel === level ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-200 text-slate-600 hover:border-emerald-200"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Additional Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Preferred Exercise System</label>
                <input 
                  type="text" 
                  value={formData.preferredExerciseSystem || ''}
                  onChange={e => setFormData({ ...formData, preferredExerciseSystem: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Push-Pull-Legs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Dietary Preferences / Restrictions</label>
                <textarea 
                  value={formData.dietaryPreferences || ''}
                  onChange={e => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                  placeholder="e.g. Vegan, No Nuts, Keto..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Health Status / Injuries</label>
                <textarea 
                  value={formData.healthStatus || ''}
                  onChange={e => setFormData({ ...formData, healthStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                  placeholder="Any conditions we should know about?"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button type="submit" disabled={saving} className="w-full md:w-auto px-12 py-4 text-lg">
              {saving ? <RefreshCw className="animate-spin mr-2" size={20} /> : <CheckCircle2 className="mr-2" size={20} />}
              {saving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

function StatBox({ label, value }: { label: string, value: any }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900 capitalize">{value}</p>
    </div>
  );
}


function CoachMarketplace() {
  const coaches = [
    { id: 1, name: 'Coach Ahmed', specialty: 'Bodybuilding', rating: 4.9, price: 50, image: 'https://picsum.photos/seed/coach1/400/400' },
    { id: 2, name: 'Sarah Wellness', specialty: 'Yoga & Nutrition', rating: 4.8, price: 40, image: 'https://picsum.photos/seed/coach2/400/400' },
    { id: 3, name: 'Capt. Omar', specialty: 'Crossfit', rating: 5.0, price: 60, image: 'https://picsum.photos/seed/coach3/400/400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Expert Coaches</h1>
          <p className="text-slate-500">Find the perfect trainer to guide your journey.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by specialty..." 
            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map(coach => (
          <Card key={coach.id} className="group hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden relative">
              <img src={coach.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-slate-900 shadow-sm">
                <TrendingUp size={14} className="text-emerald-600" />
                {coach.rating}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{coach.name}</h3>
              <p className="text-sm text-emerald-600 font-semibold mb-4">{coach.specialty}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Starting at</p>
                  <p className="text-lg font-bold text-slate-900">${coach.price}<span className="text-sm font-medium text-slate-400">/mo</span></p>
                </div>
                <Button size="sm">View Profile</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function ProgressView({ logs }: { logs: DailyLog[] }) {
  const data = logs.slice().reverse().map(log => {
    const totalBurned = (log.workouts || []).reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalDuration = (log.workouts || []).reduce((sum, w) => sum + (w.duration || 0), 0);
    return {
      ...log,
      totalBurned,
      totalDuration
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Weight Tracker</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  name="Weight (kg)" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Calorie Intake History</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="totalCalories" name="Intake (kcal)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Calories Burned (Workouts)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="totalBurned" name="Burned (kcal)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Workout Duration (Minutes)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalDuration" 
                  name="Duration (min)"
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorDuration)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Google Fit Activity (Steps)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="fitSteps" 
                  name="Steps"
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorSteps)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function HealthAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am NABD, your personal health assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithHealthAssistant(userMsg, messages);
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col"
    >
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-emerald-50 bg-emerald-50/30 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900">NABD AI Assistant</h3>
            <p className="text-xs text-emerald-600 font-semibold">Online & Ready to help</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-emerald-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-emerald-50">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about health, nutrition, or exercise..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Button onClick={handleSend} disabled={loading}>
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
