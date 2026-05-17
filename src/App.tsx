import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
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
  Target,
  Share2,
  Zap,
  ShieldCheck,
  Footprints,
  Flame,
  Timer,
  Globe,
  CreditCard,
  Star,
  Award,
  Check
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, storage, OperationType, handleFirestoreError } from './firebase';
import { calculatePlanDetails } from './lib/planUtils';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, where, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Force cache bust: 2026-03-06
import { chatWithHealthAssistant } from './lib/gemini';
import SportsModule from './components/SportsModule';
import NutritionModule from './components/NutritionModule';
import InBodyScanner from './components/InBodyScanner';
import AdminDashboard from './components/AdminDashboard';
import SmartwatchModule from './components/SmartwatchModule';
import SleepModule from './components/SleepModule';
import PlansModule from './components/PlansModule';
import TrainerDashboard from './components/TrainerDashboard';
import HabitModule from './components/HabitModule';
import { SubscriptionModule } from './components/SubscriptionModule';
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
import { cn } from './lib/utils';
import { Shield, Ban, Trash2, Eye, ExternalLink, Info, Bell } from 'lucide-react';
import { Toaster, toast } from 'sonner';

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
  credits?: number;
  subscriptionType?: string;
  subscriptionExpiry?: string;
  subscriptionStartDate?: string;
  lastResetDate?: string;
  lastDailyReward?: string;
  aiWorkoutPlan?: any;
  aiNutritionPlan?: any;
  notificationsEnabled?: boolean;
  waterReminderInterval?: number; // in minutes
  mealReminderEnabled?: boolean;
}

export const SPORTS_DATA = [
  {
    id: 'gym',
    name: 'Gym',
    icon: <Dumbbell size={20} />,
    goals: [
      'Cardiovascular improvement', 'Weight loss', 'Weight gain', 'Weight maintenance', 
      'Increase muscle strength', 'Increase endurance', 'Improve neuromuscular communication', 
      'Injury prevention', 'Improve performance and technique', 'Solve muscle development plateaus',
      'Muscle Symmetry'
    ]
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: <Activity size={20} />,
    goals: [
      'Improve specific swimming time', 'Improve and increase breath control', 'Improve performance in specific swimming styles', 
      'Increase strength of muscles used in swimming', 'Injury prevention',
      'Stroke Efficiency'
    ]
  },
  {
    id: 'fin_swimming',
    name: 'Fin Swimming',
    icon: <Activity size={20} className="rotate-45" />,
    goals: [
      'Improve swimming time', 'Improve breath control', 'Improve performance and technique', 
      'Increase strength of muscles used during swimming', 'Injury prevention'
    ]
  },
  {
    id: 'football',
    name: 'Football',
    icon: <Activity size={20} />,
    goals: [
      'Improve performance and technique for specific movements', 'Help in development for specific field positions', 
      'Injury prevention', 'Increase strength of muscles used', 'Improve breath control', 
      'Improve tactical skills like awareness, field vision, and reaction speed',
      'Agility & Change of Direction'
    ]
  },
  {
    id: 'healthy_lifestyle',
    name: 'Healthy Lifestyle',
    icon: <Heart size={20} />,
    goals: [
      'Cardiovascular improvement', 'Respiratory improvement', 
      'Improve vital body processes like digestion and sleep', 
      'Avoid psychological issues like depression and loneliness',
      'Flexibility & Mobility'
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
  sleepDuration?: number; // in minutes
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  sleepNotes?: string;
}

// --- Components ---

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
      secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200',
      outline: 'border border-primary-200 text-primary-700 hover:bg-primary-50',
      ghost: 'text-primary-700 hover:bg-primary-50',
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

const Card = ({ children, className, onClick, id }: { children: React.ReactNode, className?: string, onClick?: () => void, id?: string }) => (
  <div 
    id={id}
    onClick={onClick}
    className={cn('bg-white rounded-2xl border border-primary-50 shadow-sm overflow-hidden', className)}
  >
    {children}
  </div>
);

// --- Main App ---

const PLAN_CREDITS: Record<string, number> = {
  'free': 200,
  'monthly': 1200,
  'quarterly': 4000,
  'annual': 18000
};

function NotificationManager({ user }: { user: UserProfile }) {
  useEffect(() => {
    if (!user || !user.notificationsEnabled) return;

    // Request permission if not granted
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const showNotification = (title: string, options?: NotificationOptions) => {
      // Show in-app toast
      toast(title, { description: options?.body, duration: 5000 });
      
      // Show system notification if granted and app is in background
      if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
        new Notification(title, options);
      }
    };

    // Water Reminder
    let waterInterval: NodeJS.Timeout;
    if (user.waterReminderInterval && user.waterReminderInterval > 0) {
      waterInterval = setInterval(() => {
        showNotification('💧 Time to hydrate!', {
          body: 'Drink a glass of water to stay on track.'
        });
      }, user.waterReminderInterval * 60 * 1000);
    }

    // Meal Reminders (Simple logic: check time every minute, trigger around standard meal times)
    let mealInterval: NodeJS.Timeout;
    if (user.mealReminderEnabled) {
      mealInterval = setInterval(() => {
        const hour = new Date().getHours();
        const minute = new Date().getMinutes();
        
        // Trigger at exactly 9:00, 14:00, 19:00
        if (minute === 0) {
          if (hour === 9) {
            showNotification('🍳 Breakfast Time!', { body: 'Don\'t forget to log your breakfast.' });
          } else if (hour === 14) {
            showNotification('🥗 Lunch Time!', { body: 'Time for a healthy lunch. Log it in the app!' });
          } else if (hour === 19) {
            showNotification('🍽️ Dinner Time!', { body: 'Log your dinner to keep your macros accurate.' });
          }
        }
      }, 60 * 1000);
    }

    return () => {
      if (waterInterval) clearInterval(waterInterval);
      if (mealInterval) clearInterval(mealInterval);
    };
  }, [user]);

  return null;
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminViewMode, setAdminViewMode] = useState<'trainer' | 'user'>('user');
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(() => !localStorage.getItem('nabd_cookies_accepted'));

  const acceptCookies = () => {
    localStorage.setItem('nabd_cookies_accepted', 'true');
    setShowCookieBanner(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            
            // Migration: Ensure every user has a subscription type
            if (!userData.subscriptionType) {
              userData.subscriptionType = 'free';
              userData.credits = 200;
              userData.subscriptionExpiry = new Date(new Date().setFullYear(new Date().getFullYear() + 100)).toISOString();
              userData.subscriptionStartDate = new Date().toISOString();
              userData.lastResetDate = new Date().toISOString();
              await updateDoc(doc(db, 'users', firebaseUser.uid), {
                subscriptionType: userData.subscriptionType,
                credits: userData.credits,
                subscriptionExpiry: userData.subscriptionExpiry,
                subscriptionStartDate: userData.subscriptionStartDate,
                lastResetDate: userData.lastResetDate
              });
            }

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
              credits: 200,
              subscriptionType: 'free',
              subscriptionExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 100)).toISOString(), // 100 years for free
              subscriptionStartDate: new Date().toISOString(),
              lastResetDate: new Date().toISOString()
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
      // تسجيل دخول تلقائي ومباشر بالإيميل الثابت اللي عملناه في الفايربيز
      await signInWithEmailAndPassword(auth, 'emad@nabd.com', '123456');
      
      // التوجيه فوراً للشاشة الرئيسية
      setActiveTab('dashboard'); // وهذا يعادل router.push('/home') في هذا المشروع
      
    } catch (error: any) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    const checkSubscriptionReset = async () => {
      if (!user || !user.subscriptionType || !user.lastResetDate) return;

      const lastReset = new Date(user.lastResetDate);
      const now = new Date();
      const diffMonths = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth());

      if (diffMonths >= 1) {
        // Check if subscription is still active
        const expiry = new Date(user.subscriptionExpiry);
        if (now <= expiry) {
          const planCredits = PLAN_CREDITS[user.subscriptionType] || 0;
          const updates = {
            credits: planCredits, // Reset to plan amount
            lastResetDate: now.toISOString()
          };
          await updateDoc(doc(db, 'users', user.uid), updates);
          setUser({ ...user, ...updates });
        }
      }
    };

    checkSubscriptionReset();
  }, [user?.uid, user?.lastResetDate, user?.subscriptionType]);

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-primary-600"
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
      <Toaster position="top-center" richColors />
      <NotificationManager user={user} />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-primary-50 transform transition-transform duration-300 md:relative md:translate-x-0 overflow-y-auto",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col min-h-full">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-display font-bold text-primary-900 tracking-tight">NABD</span>
          </div>

          <nav className="space-y-2 flex-1">
            {(user.role === 'coach' || (user.role === 'admin' && adminViewMode === 'trainer')) ? (
              <>
                <NavItem icon={<LayoutDashboard size={20} />} label="Coach Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} />
                <NavItem icon={<Users size={20} />} label="My Clients" active={activeTab === 'clients'} onClick={() => { setActiveTab('clients'); setIsMenuOpen(false); }} />
                <NavItem icon={<Calendar size={20} />} label="Schedule" active={activeTab === 'schedule'} onClick={() => { setActiveTab('schedule'); setIsMenuOpen(false); }} />
                <NavItem icon={<MessageSquare size={20} />} label="Messages" active={activeTab === 'messages'} onClick={() => { setActiveTab('messages'); setIsMenuOpen(false); }} />
                <NavItem icon={<User size={20} />} label="Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }} />
              </>
            ) : (
              <>
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} />
                <NavItem icon={<MessageSquare size={20} />} label="Health Assistant" active={activeTab === 'assistant'} onClick={() => { setActiveTab('assistant'); setIsMenuOpen(false); }} />
                <NavItem icon={<Utensils size={20} />} label="Nutrition" active={activeTab === 'nutrition'} onClick={() => { setActiveTab('nutrition'); setIsMenuOpen(false); }} />
                <NavItem icon={<CreditCard size={20} />} label="Subscriptions & Payments" active={activeTab === 'plans'} onClick={() => { setActiveTab('plans'); setIsMenuOpen(false); }} />
                <NavItem icon={<Calendar size={20} />} label="Smart Plans" active={activeTab === 'smart-plans'} onClick={() => { setActiveTab('smart-plans'); setIsMenuOpen(false); }} />
                <NavItem icon={<Users size={20} />} label="Coaches" active={activeTab === 'coaches'} onClick={() => { setActiveTab('coaches'); setIsMenuOpen(false); }} />
                <NavItem icon={<Dumbbell size={20} />} label="Sports" active={activeTab === 'sports'} onClick={() => { setActiveTab('sports'); setIsMenuOpen(false); }} />
                <NavItem icon={<CheckCircle2 size={20} />} label="Habit Tracker" active={activeTab === 'habits'} onClick={() => { setActiveTab('habits'); setIsMenuOpen(false); }} />
                <NavItem icon={<Moon size={20} />} label="Sleep Tracking" active={activeTab === 'sleep'} onClick={() => { setActiveTab('sleep'); setIsMenuOpen(false); }} />
                <NavItem icon={<TrendingUp size={20} />} label="Progress" active={activeTab === 'progress'} onClick={() => { setActiveTab('progress'); setIsMenuOpen(false); }} />
                <NavItem icon={<Watch size={20} />} label="Google Fit & Watches" active={activeTab === 'watch'} onClick={() => { setActiveTab('watch'); setIsMenuOpen(false); }} />
                <NavItem icon={<User size={20} />} label="Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }} />
              </>
            )}
            {user.role === 'admin' && (
              <NavItem icon={<ShieldAlert size={20} />} label="Admin Panel" active={activeTab === 'admin'} onClick={() => { setActiveTab('admin'); setIsMenuOpen(false); }} />
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-primary-50 space-y-4">
            {/* Credits Display */}
            <div className="px-2">
              <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Remaining Balance</p>
                    <p className="text-xl font-black">{user.credits?.toLocaleString() || 0} <span className="text-xs font-bold text-primary-400">Credits</span></p>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                    <Zap size={20} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary-500/20 rounded-full blur-xl" />
                <button 
                  onClick={() => setActiveTab('plans')}
                  className="w-full mt-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp size={12} />
                  Top Up Balance
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 px-2">
              <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-primary-100" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.displayName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors w-full px-2 pb-2">
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-primary-50 flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-primary-600" fill="currentColor" />
            <span className="font-display font-bold text-primary-900">NABD</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-10">
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
                {activeTab === 'nutrition' && <NutritionModule user={user} onUpdate={setUser} />}
                {activeTab === 'plans' && <PlansModule user={user} onUpdate={(u) => setUser(u)} view="subscriptions" />}
                {activeTab === 'smart-plans' && <PlansModule user={user} onUpdate={(u) => setUser(u)} view="smart" />}
                {activeTab === 'coaches' && <CoachMarketplace />}
                {activeTab === 'sports' && <SportsModule user={user} onUpdate={setUser} />}
                {activeTab === 'habits' && <HabitModule user={user} />}
                {activeTab === 'sleep' && <SleepModule user={user} />}
                {activeTab === 'progress' && <ProgressView logs={dailyLogs} user={user} onUpdate={setUser} />}
                {activeTab === 'profile' && <ProfileSettings user={user} onUpdate={(u) => setUser(u)} />}
                {activeTab === 'watch' && <SmartwatchModule user={user} />}
                {activeTab === 'assistant' && <HealthAssistant user={user} onUpdate={setUser} />}
                {activeTab === 'admin' && user.role === 'admin' && <AdminDashboard setActiveTab={setActiveTab} setAdminViewMode={setAdminViewMode} />}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation for Mobile */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} role={user.role} />

        {/* Cookie & Privacy Banner */}
        <AnimatePresence>
          {showCookieBanner && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[100]"
            >
              <Card className="p-5 shadow-2xl border-primary-100 bg-white/95 backdrop-blur-md">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Privacy & Data Notice</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      We use cookies and the data you provide to improve your experience and deliver personalized health plans. 
                      By using the app, you agree to our Privacy Policy and our use of data for analysis and development purposes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={acceptCookies}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-primary-600 text-white"
                  >
                    I Understand & Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setShowCookieBanner(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400"
                  >
                    Later
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-components ---

function BottomNav({ activeTab, setActiveTab, role }: { activeTab: string, setActiveTab: (tab: string) => void, role: string }) {
  const navItems = role === 'coach' ? [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'clients', icon: <Users size={20} />, label: 'Clients' },
    { id: 'schedule', icon: <Calendar size={20} />, label: 'Schedule' },
    { id: 'messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ] : [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Home' },
    { id: 'plans', icon: <CreditCard size={20} />, label: 'Subscriptions' },
    { id: 'habits', icon: <CheckCircle2 size={20} />, label: 'Habits' },
    { id: 'sports', icon: <Dumbbell size={20} />, label: 'Sports' },
    { id: 'assistant', icon: <MessageSquare size={20} />, label: 'Assistant' },
    { id: 'nutrition', icon: <Utensils size={20} />, label: 'Nutrition' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary-50 px-1 py-2 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 p-1 flex-1 rounded-xl transition-all duration-200",
            activeTab === item.id ? "text-primary-600" : "text-slate-400"
          )}
        >
          <span className={cn("transition-colors", activeTab === item.id ? "text-primary-600" : "text-slate-400")}>
            {item.icon}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-center leading-none w-full truncate px-0.5">{item.label}</span>
          {activeTab === item.id && (
            <motion.div layoutId="bottom-nav-indicator" className="w-1 h-1 rounded-full bg-primary-600 absolute -bottom-1" />
          )}
        </button>
      ))}
    </nav>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-primary-50 text-primary-700 font-semibold shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <span className={cn("transition-colors", active ? "text-primary-600" : "text-slate-400")}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />}
    </button>
  );
}

function LandingPage({ onLogin, isLoggingIn }: { onLogin: () => void, isLoggingIn: boolean }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <Activity size={24} />
          </div>
          <span className="text-2xl font-display font-bold text-slate-900">NABD</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#coaches" className="hover:text-primary-600 transition-colors">Coaches</a>
          <a href="#about" className="hover:text-primary-600 transition-colors">Science</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onLogin} disabled={isLoggingIn} className="hidden sm:flex text-slate-600 hover:text-slate-900">
            Login
          </Button>
          <Button onClick={onLogin} disabled={isLoggingIn} className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-bold mb-8">
            <Zap size={16} className="text-accent-500" />
            <span>The Clarity Engine for Your Health</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.05] mb-8 tracking-tight">
            Master your health. <br />
            <span className="text-primary-600">Zero overwhelm.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
            NABD brings your nutrition, sleep, and movement into one clear dashboard. Stop guessing and start optimizing with clinical-grade tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={onLogin} disabled={isLoggingIn} className="rounded-full px-10 bg-accent-500 hover:bg-accent-600 text-white border-none shadow-lg shadow-accent-500/30">
              {isLoggingIn ? 'Connecting...' : 'Start Tracking Now'}
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 border-slate-200 hover:bg-slate-100 text-slate-700">See How It Works</Button>
          </div>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-12 h-12 rounded-full border-4 border-slate-50 shadow-sm" referrerPolicy="no-referrer" />
              ))}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Join <span className="text-slate-900 font-bold">50,000+</span> optimizers
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-primary-200/50 border-8 border-white">
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000" alt="Fitness" className="w-full h-auto" />
          </div>
          {/* Floating elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-primary-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-50 text-accent-600 rounded-lg flex items-center justify-center">
                <Flame size={20} />
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
            className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl border border-primary-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
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
      <section id="features" className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-display font-bold text-slate-900 mb-6">Everything you need to thrive</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Our platform integrates advanced technology with human expertise to provide a holistic health experience that feels intuitive, not overwhelming.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Camera className="text-primary-600" />} 
              title="AI Calorie Counting" 
              desc="Just snap a photo of your meal. Our AI identifies ingredients and estimates nutritional value instantly."
            />
            <FeatureCard 
              icon={<Users className="text-primary-600" />} 
              title="Expert Coaches" 
              desc="Connect with certified trainers across various disciplines. Get personalized guidance and support."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-primary-600" />} 
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
    <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300 group">
      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{title}</h3>
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
    <div className="min-h-screen bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-slate-900">Let's set up your profile</h1>
          <p className="text-slate-600 mt-2">Answer a few questions to get personalized recommendations.</p>
        </div>

        <div className="space-y-8">
          {/* Role Selection */}
          <Card className="p-6 shadow-sm border-primary-100">
            <label className="block text-lg font-bold text-slate-900 mb-4">Are you joining as a User or a Coach? *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={cn(
                  "py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                  formData.role === 'user' ? "bg-primary-50 border-primary-600 text-primary-700" : "border-slate-100 text-slate-600 hover:border-primary-200 bg-white"
                )}
              >
                <User size={32} />
                <span className="font-bold text-lg">User</span>
                <span className="text-xs opacity-80">I want to track my fitness</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, role: 'coach' })}
                className={cn(
                  "py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                  formData.role === 'coach' ? "bg-primary-50 border-primary-600 text-primary-700" : "border-slate-100 text-slate-600 hover:border-primary-200 bg-white"
                )}
              >
                <Users size={32} />
                <span className="font-bold text-lg">Coach</span>
                <span className="text-xs opacity-80">I want to train others</span>
              </button>
            </div>
          </Card>

          {/* User Flow */}
          {isRoleFilled && formData.role === 'user' && (
            <>
              {/* Age */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6 shadow-sm border-primary-100">
                  <label className="block text-lg font-bold text-slate-900 mb-4">1. What is your age? *</label>
                  <input 
                    type="number" 
                    className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-lg"
                    placeholder="e.g. 25"
                    value={formData.age || ''}
                    onChange={e => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </Card>
              </motion.div>

          {/* Gender */}
          {isAgeFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-primary-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">2. What is your gender? *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g as any })}
                      className={cn(
                        "py-4 rounded-xl border-2 transition-all capitalize font-semibold text-lg",
                        formData.gender === g ? "bg-primary-50 border-primary-600 text-primary-700" : "border-slate-100 text-slate-600 hover:border-primary-200"
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
              <Card className="p-6 shadow-sm border-primary-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">3. What is your nationality? *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-lg"
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
              <Card className="p-6 shadow-sm border-primary-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">4. What is your height (cm)? *</label>
                <input 
                  type="number" 
                  className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-lg"
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
              <Card className="p-6 shadow-sm border-primary-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">5. What is your weight (kg)? *</label>
                <input 
                  type="number" 
                  className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-lg"
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
              <Card className="p-6 shadow-sm border-primary-100">
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
                        formData.goal === g.id ? "bg-primary-50 border-primary-600 text-primary-900" : "border-slate-100 text-slate-600 hover:border-primary-200"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", formData.goal === g.id ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500")}>
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
              <Card className="p-6 shadow-sm border-primary-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">7. What is your fitness level? *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, fitnessLevel: level as any })}
                      className={cn(
                        "py-4 rounded-xl border-2 transition-all capitalize font-semibold text-lg",
                        formData.fitnessLevel === level ? "bg-primary-50 border-primary-600 text-primary-700" : "border-slate-100 text-slate-600 hover:border-primary-200"
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
              <Card className="p-6 shadow-sm border-primary-100">
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
                        formData.activityLevel === level.id ? "bg-primary-50 border-primary-600 text-primary-900" : "border-slate-100 text-slate-600 hover:border-primary-200"
                      )}
                    >
                      <div className="text-left">
                        <div className="font-semibold text-lg">{level.label}</div>
                        <div className="text-sm opacity-70">{level.desc}</div>
                      </div>
                      {formData.activityLevel === level.id && <CheckCircle2 className="text-primary-600" size={24} />}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Plays Sports? */}
          {isActivityLevelFilled && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 shadow-sm border-primary-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">9. Do you play any sports? *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, playsSports: true })}
                    className={cn(
                      "py-4 rounded-xl border-2 transition-all font-semibold text-lg",
                      formData.playsSports === true ? "bg-primary-50 border-primary-600 text-primary-700" : "border-slate-100 text-slate-600 hover:border-primary-200"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, playsSports: false, selectedSports: [] })}
                    className={cn(
                      "py-4 rounded-xl border-2 transition-all font-semibold text-lg",
                      formData.playsSports === false ? "bg-primary-50 border-primary-600 text-primary-700" : "border-slate-100 text-slate-600 hover:border-primary-200"
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
              <Card className="p-6 shadow-sm border-primary-100">
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
                          isSelected ? "bg-primary-50 border-primary-600 text-primary-900" : "border-slate-100 text-slate-600 hover:border-primary-200"
                        )}
                      >
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", isSelected ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500")}>
                          {sport.icon}
                        </div>
                        <span className="font-semibold text-lg flex-1">{sport.name}</span>
                        {isSelected && <CheckCircle2 size={24} className="text-primary-600" />}
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
              <Card className="p-6 shadow-sm border-primary-100">
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
                                  isGoalSelected ? "bg-primary-100 border-primary-400 text-primary-800 font-bold" : "bg-white border-slate-200 text-slate-600 hover:border-primary-200"
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
              <Card className="p-6 shadow-sm border-primary-100">
                <label className="block text-lg font-bold text-slate-900 mb-4">
                  {formData.playsSports ? "12." : "10."} Any health conditions or injuries? *
                </label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-32 resize-none text-lg"
                  placeholder="Type 'None' if you don't have any..."
                  value={formData.healthStatus || ''}
                  onChange={e => setFormData({ ...formData, healthStatus: e.target.value })}
                />
                <p className="text-sm text-slate-500 mt-2">This is required. If none, please type "None".</p>
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
                <Card className="p-6 shadow-sm border-primary-100">
                  <label className="block text-lg font-bold text-slate-900 mb-4">1. What are your specialties? *</label>
                  <div className="flex flex-wrap gap-3">
                    {['Weight Loss', 'Muscle Gain', 'Bodybuilding', 'Powerlifting', 'Yoga', 'Rehabilitation', 'Nutrition', 'Sports Conditioning'].map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSpecialty(s)}
                        className={cn(
                          "px-4 py-3 rounded-xl border-2 transition-all font-semibold",
                          formData.specialties?.includes(s) ? "bg-primary-50 border-primary-600 text-primary-700" : "border-slate-100 text-slate-600 hover:border-primary-200"
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
                  <Card className="p-6 shadow-sm border-primary-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4">2. Years of experience? *</label>
                    <input 
                      type="number" 
                      className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-lg"
                      placeholder="e.g. 5"
                      value={formData.experienceYears || ''}
                      onChange={e => setFormData({ ...formData, experienceYears: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Certifications */}
              {isExperienceFilled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6 shadow-sm border-primary-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4">3. List your certifications (optional)</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none text-lg"
                      placeholder="e.g. NASM CPT, ISSA Nutritionist..."
                      value={formData.certifications || ''}
                      onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Bio */}
              {isExperienceFilled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6 shadow-sm border-primary-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4">4. Write a short bio about yourself *</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-32 resize-none text-lg"
                      placeholder="Tell potential clients about your training style..."
                      value={formData.bio || ''}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Hourly Rate */}
              {isBioFilled && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6 shadow-sm border-primary-100">
                    <label className="block text-lg font-bold text-slate-900 mb-4">5. What is your hourly rate ($)? *</label>
                    <input 
                      type="number" 
                      className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-lg"
                      placeholder="e.g. 50"
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 pb-12 space-y-6">
              <Card className="p-6 border-primary-200 bg-white/50 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none">
                    I agree to the <span className="font-bold text-primary-700 underline">Terms of Service</span> and <span className="font-bold text-primary-700 underline">Privacy Policy</span>. 
                    I acknowledge that I assume full responsibility for using the app, and that the health and fitness data I enter will be used to improve services and provide personalized recommendations. 
                    I consent to the processing and use of this data by the platform in accordance with legal standards.
                  </label>
                </div>
              </Card>

              <Button 
                onClick={handleComplete} 
                disabled={saving || !acceptedTerms}
                className={cn(
                  "w-full py-6 rounded-2xl text-xl font-bold shadow-lg transition-all",
                  acceptedTerms ? "shadow-primary-200" : "opacity-50 grayscale cursor-not-allowed"
                )}
              >
                {saving ? "Saving profile..." : "Complete Setup"}
                {!saving && <ChevronRight size={24} className="ml-2" />}
              </Button>
              {!acceptedTerms && (
                <p className="text-center text-xs text-red-500 font-medium">You must accept the terms to continue.</p>
              )}
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
  const [isSyncingFit, setIsSyncingFit] = useState(false);

  const deleteMeal = async (index: number) => {
    if (!todayLog) return;
    const mealToDelete = todayLog.meals[index];
    const newMeals = todayLog.meals.filter((_, i) => i !== index);
    const newTotalCalories = (todayLog.totalCalories || 0) - mealToDelete.calories;

    try {
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
      await updateDoc(logRef, {
        meals: newMeals,
        totalCalories: Math.max(0, newTotalCalories)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/dailyLogs/${todayStr}`);
    }
  };

  const deleteWorkout = async (index: number) => {
    if (!todayLog) return;
    const newWorkouts = todayLog.workouts.filter((_, i) => i !== index);

    try {
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
      await updateDoc(logRef, {
        workouts: newWorkouts
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/dailyLogs/${todayStr}`);
    }
  };

  const handleShareCard = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      // Temporarily hide buttons for the screenshot
      const buttons = element.querySelectorAll('button');
      buttons.forEach(b => (b as HTMLElement).style.display = 'none');

      const dataUrl = await toPng(element, { 
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '24px',
        }
      });

      // Restore buttons
      buttons.forEach(b => (b as HTMLElement).style.display = '');

      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${filename}.png`, { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'My Health Progress',
          text: `Check out my ${filename} for today!`,
        });
      } else {
        // Fallback to download
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Error sharing card:', error);
    }
  };
  
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
  
  const [updating, setUpdating] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);

  useEffect(() => {
    const checkDailyReward = async () => {
      const today = new Date().toISOString().split('T')[0];
      if (user.lastDailyReward !== today) {
        setShowDailyReward(true);
        const newCredits = (user.credits || 0) + 10;
        const updates = {
          credits: newCredits,
          lastDailyReward: today
        };
        await updateDoc(doc(db, 'users', user.uid), updates);
        onUpdate({ ...user, ...updates });
      }
    };
    checkDailyReward();
  }, []);

  useEffect(() => {
    // Load data from today's log if exists
    if (todayLog) {
      setBurnedCalories(todayLog.fitCalories || 0);
      setSteps(todayLog.fitSteps || 0);
      setDistance(todayLog.fitDistance || 0);
      setActiveMinutes(todayLog.fitActiveMinutes || 0);
    }
    
    if (user.googleFitTokens) {
      syncGoogleFit();
    }
  }, [user.googleFitTokens, todayLog]);

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
        let totalCalories = 0;
        let totalSteps = 0;
        let totalActiveMins = 0;

        if (data.bucket && Array.isArray(data.bucket)) {
          data.bucket.forEach((b: any) => {
            // Calories (index 0)
            b.dataset?.[0]?.point?.forEach((p: any) => {
              totalCalories += p.value?.[0]?.fpVal || 0;
            });
            // Steps (index 1)
            b.dataset?.[1]?.point?.forEach((p: any) => {
              totalSteps += p.value?.[0]?.intVal || 0;
            });
            // Active Minutes (index 2)
            b.dataset?.[2]?.point?.forEach((p: any) => {
              totalActiveMins += p.value?.[0]?.intVal || 0;
            });
          });
        }

        // Estimate distance from steps (average 0.762 meters per step)
        const distanceVal = totalSteps * 0.762;
        
        setBurnedCalories(Math.round(totalCalories));
        setSteps(totalSteps);
        setDistance(distanceVal);
        setActiveMinutes(totalActiveMins);

        // Save to daily log
        const todayStr = new Date().toISOString().split('T')[0];
        const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
        const logDoc = await getDoc(logRef);
        if (logDoc.exists()) {
          await updateDoc(logRef, {
            fitCalories: Math.round(totalCalories),
            fitSteps: totalSteps,
            fitDistance: distanceVal,
            fitActiveMinutes: totalActiveMins
          });
        } else {
          await setDoc(logRef, {
            date: todayStr,
            meals: [],
            totalCalories: 0,
            exercise: '',
            waterIntake: 0,
            weight: user.weight || 0,
            fitCalories: Math.round(totalCalories),
            fitSteps: totalSteps,
            fitDistance: distanceVal,
            fitActiveMinutes: totalActiveMins
          });
        }
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        console.error("Google Fit Sync Error:", errorData);
        alert("Failed to sync Google Fit data. You may need to reconnect your account.");
        // If tokens are invalid, we might want to prompt the user to reconnect
        if (response.status === 401 || response.status === 403) {
           await updateDoc(doc(db, 'users', user.uid), { googleFitTokens: null });
        }
      }
    } catch (error) {
      console.error("Error syncing Google Fit:", error);
      alert("An error occurred while trying to sync Google Fit data.");
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

  const [showStepsModal, setShowStepsModal] = useState(false);
  const [manualSteps, setManualSteps] = useState('');

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
        <button onClick={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} className="mt-8 px-6 py-2 bg-primary-600 text-white rounded-lg">Back to App</button>
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
        <button onClick={() => { window.history.pushState({}, '', '/'); setCurrentPath('/'); }} className="mt-8 px-6 py-2 bg-primary-600 text-white rounded-lg">Back to App</button>
      </div>
    );
  }

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
          alert("Google Fit connection error: " + (errorData.error || "Unknown error"));
        }
        return;
      }
      const { url } = await response.json();
      if (!url) {
        alert("Authentication URL not found. Please check server settings.");
        return;
      }
      const authWindow = window.open(url, 'google_fit_auth', 'width=600,height=700');
      if (!authWindow) {
        alert("Popup blocked. Please allow popups for this site.");
      }
    } catch (error) {
      console.error("Error getting auth URL:", error);
      alert("An error occurred while trying to connect to Google Fit.");
    }
  };

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 md:space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-slate-900 leading-tight">Welcome back, {user.displayName.split(' ')[0]}!</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Here's your holistic health overview for today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {user.googleFitTokens ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={syncGoogleFit} 
              disabled={isSyncingFit}
              className="bg-white border-primary-100 text-primary-700 hover:bg-primary-50 text-xs md:text-sm"
            >
              <RefreshCw size={14} className={cn("mr-1 md:mr-2", isSyncingFit && "animate-spin")} />
              {isSyncingFit ? 'Syncing...' : 'Google Fit'}
            </Button>
          ) : (
            <Button 
              variant="primary" 
              size="sm"
              onClick={connectGoogleFit}
              className="bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 text-xs md:text-sm"
            >
              <Activity size={14} className="mr-1 md:mr-2" />
              Connect Google Fit
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onTabChange('nutrition')}
            className="bg-white border-primary-100 text-primary-700 text-xs md:text-sm"
          >
            <RefreshCw size={14} className="mr-1 md:mr-2" />
            New Plan
          </Button>

          <div className="flex items-center gap-2 bg-white p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-50 text-primary-600 rounded-lg md:rounded-xl flex items-center justify-center">
              <Calendar size={16} />
            </div>
            <div className="pr-2 md:pr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today</p>
              <p className="text-xs md:text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Calories Card */}
        <Card 
          id="calories-card"
          className="p-4 md:p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-accent-200 transition-all group hover:shadow-lg hover:shadow-accent-100/50"
          onClick={() => onTabChange('nutrition')}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Fuel & Energy</p>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleShareCard('calories-card', 'Daily-Calories'); }}
                  className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-accent-600 hover:bg-accent-600 hover:text-white transition-colors"
                  title="Share Progress"
                >
                  <Share2 size={16} />
                </button>
                {user.googleFitTokens ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); syncGoogleFit(); }}
                    className={cn("w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-accent-600 hover:bg-accent-600 hover:text-white transition-colors", isSyncingFit && "animate-spin")}
                  >
                    <Activity size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); connectGoogleFit(); }}
                    className="px-2 py-1 bg-accent-50 text-accent-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-accent-600 hover:text-white transition-colors"
                  >
                    Connect Google Fit
                  </button>
                )}
                <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-accent-600 group-hover:bg-accent-600 group-hover:text-white transition-colors">
                  <Plus size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <h3 className="text-4xl font-display font-bold text-slate-900">{consumed}</h3>
              <span className="text-lg font-medium text-slate-400">/ {calorieGoal}</span>
            </div>
            {(burnedCalories > 0 || loggedBurned > 0) && (
              <div className="mb-4 space-y-1">
                {burnedCalories > 0 && (
                  <p className="text-xs font-bold text-accent-600 flex items-center gap-1">
                    <Activity size={12} />
                    -{burnedCalories} kcal (Google Fit)
                  </p>
                )}
                {loggedBurned > 0 && (
                  <p className="text-xs font-bold text-accent-600 flex items-center gap-1">
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
                className="h-full bg-accent-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-semibold flex items-center gap-1.5">
                <TrendingUp size={14} className="text-accent-500" />
                {remaining > 0 ? `${remaining} kcal remaining` : 'Daily goal achieved!'}
              </p>
            </div>
          </div>
          <Utensils className="absolute -bottom-6 -right-6 text-accent-50 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" size={140} />
        </Card>

        {/* Water Intake Card */}
        <Card 
          className="p-4 md:p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-primary-200 transition-all group hover:shadow-lg hover:shadow-primary-100/50"
          onClick={handleWaterClick}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Hydration</p>
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <Plus size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <h3 className="text-4xl font-display font-bold text-slate-900">{(todayLog?.waterIntake || 0).toFixed(2)}</h3>
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
                      ? "bg-primary-500 shadow-[0_0_8px_rgba(37,99,235,0.5)]" 
                      : "bg-slate-200"
                  )} 
                />
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-semibold">Click to add 250ml (1 cup)</p>
            </div>
          </div>
          <Droplets className="absolute -bottom-6 -right-6 text-primary-50 opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" size={140} />
          {updating && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-20">
              <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </Card>

        {/* Steps Card */}
        <Card className="p-4 md:p-5 flex flex-col justify-between relative overflow-hidden transition-all group hover:shadow-lg hover:shadow-primary-100/50">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Activity</p>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowStepsModal(true); }}
                  className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                  title="Add Steps Manually"
                >
                  <Plus size={16} />
                </button>
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                  <Activity size={16} />
                </div>
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-4 mt-2">
              <h3 className="text-5xl font-display font-black text-slate-900 tracking-tighter">{steps.toLocaleString()}</h3>
              <span className="text-lg font-medium text-slate-400">steps</span>
            </div>

            <div className="space-y-2 mb-4">
              {steps > 0 && (
                <p className="text-xs font-bold text-primary-500 flex items-center gap-1">
                  <Activity size={12} />
                  {steps.toLocaleString()} from Google Fit
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4">
              <div className="bg-slate-50 p-2 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Distance</p>
                <p className="text-sm font-bold text-slate-900">{(distance / 1000).toFixed(2)} <span className="text-[10px] font-medium text-slate-400">km</span></p>
              </div>
            </div>
          </div>
          <Activity className="absolute -bottom-6 -right-6 text-primary-50 opacity-20 group-hover:scale-110 transition-transform duration-500" size={140} />
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Utensils size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recent Meals</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTabChange('nutrition')}
              className="text-xs font-bold"
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {todayLog?.meals && todayLog.meals.length > 0 ? (
              todayLog.meals.slice(-3).reverse().map((meal, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-500">
                      {meal.type === 'breakfast' ? <Zap size={20} /> : 
                       meal.type === 'lunch' ? <Utensils size={20} /> : 
                       meal.type === 'dinner' ? <Moon size={20} /> : <Activity size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{meal.name}</p>
                      <p className="text-xs text-slate-500 font-medium capitalize">{meal.type} • {meal.calories} kcal</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteMeal(todayLog.meals.length - 1 - idx)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Meal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm font-medium">No meals logged today</p>
                <Button 
                  variant="ghost" 
                  className="text-emerald-600 font-bold mt-2"
                  onClick={() => onTabChange('nutrition')}
                >
                  Log your first meal
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Workouts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                <Dumbbell size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recent Workouts</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onTabChange('sports')}
              className="text-xs font-bold"
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {todayLog?.workouts && todayLog.workouts.length > 0 ? (
              todayLog.workouts.slice(-3).reverse().map((workout, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-500">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{workout.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{workout.duration} min • {workout.caloriesBurned} kcal</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteWorkout(todayLog.workouts.length - 1 - idx)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Workout"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm font-medium">No workouts logged today</p>
                <Button 
                  variant="ghost" 
                  className="text-primary-600 font-bold mt-2"
                  onClick={() => onTabChange('sports')}
                >
                  Log your first workout
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <AnimatePresence>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none font-bold text-lg"
                    placeholder="e.g. 10000"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowStepsModal(false)}>Cancel</Button>
                  <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white border-none" onClick={handleManualStepsUpdate} disabled={updating}>
                    {updating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
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
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Google Fit Setup</h3>
                </div>
                <button onClick={() => setShowFitGuide(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 text-slate-600">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-sm font-bold text-amber-900 mb-2">⚠️ Important Note:</p>
                  <p className="text-sm text-amber-800">
                    Connection keys not found in settings. You must add them manually once.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">Required Steps:</h4>
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-primary-600 underline">Google Cloud Console</a> and create a new project.</li>
                    <li>Enable the <b>Fitness API</b> from the Library section.</li>
                    <li>Create an <b>OAuth client ID</b> of type <b>Web application</b>.</li>
                    <li>Add this URL to the <b>Authorized redirect URIs</b> (ensure it matches exactly):
                      <div className="mt-2 flex gap-2">
                        <div className="flex-1 p-2 bg-slate-100 rounded-lg font-mono text-[10px] break-all select-all border border-slate-200">
                          {serverRedirectUri || `${window.location.origin}/auth/google-fit/callback`}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(serverRedirectUri || `${window.location.origin}/auth/google-fit/callback`);
                            alert("URL copied!");
                          }}
                          className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </li>
                    <li>Copy the <b>Client ID</b> and <b>Client Secret</b>.</li>
                    <li>Open the <b>Settings &gt; Secrets</b> menu in this app and add:
                      <ul className="list-disc list-inside mt-2 ml-4">
                        <li><code>GOOGLE_FIT_CLIENT_ID</code></li>
                        <li><code>GOOGLE_FIT_CLIENT_SECRET</code></li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <Button variant="primary" className="w-full py-4" onClick={() => setShowFitGuide(false)}>
                  Got it, I'll set it up now
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Daily Reward Modal */}
      <AnimatePresence>
        {showDailyReward && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-accent-500" />
              <div className="w-24 h-24 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Zap size={48} fill="currentColor" />
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-2">Daily Reward!</h3>
              <p className="text-slate-500 mb-8">You've earned <span className="text-accent-600 font-bold">10 free points</span> to keep you motivated on your health journey.</p>
              <button
                onClick={() => setShowDailyReward(false)}
                className="w-full py-4 bg-accent-600 text-white rounded-2xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg shadow-accent-200"
              >
                Awesome, thanks!
              </button>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-50 rounded-full blur-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-12 py-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm mb-2">© 2026 NABD Health Platform</p>
        <div className="flex justify-center gap-4 text-xs font-medium text-slate-500">
          <button onClick={() => { window.history.pushState({}, '', '/privacy'); setCurrentPath('/privacy'); }} className="hover:text-primary-600 transition-colors">Privacy Policy</button>
          <button onClick={() => { window.history.pushState({}, '', '/terms'); setCurrentPath('/terms'); }} className="hover:text-primary-600 transition-colors">Terms of Service</button>
        </div>
      </footer>
    </motion.div>
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
    notificationsEnabled: user.notificationsEnabled ?? true,
    waterReminderInterval: user.waterReminderInterval ?? 60,
    mealReminderEnabled: user.mealReminderEnabled ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDeleteAccount = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      // Sign out after deletion
      auth.signOut();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-20"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Profile Settings</h1>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-100 text-primary-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            <span>Profile Updated!</span>
          </motion.div>
        )}
      </div>

      <Card className="p-4 md:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-100">
            <div className="relative">
              <img 
                src={formData.photoURL || user.photoURL || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-50 shadow-md"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
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
              <h2 className="text-xl font-display font-bold text-slate-900">{user.displayName}</h2>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Gender</label>
                  <select 
                    value={formData.gender || ''}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
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
                        formData.fitnessLevel === level ? "bg-primary-600 text-white border-primary-600" : "border-slate-200 text-slate-600 hover:border-primary-200"
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
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Bell className="text-emerald-500" size={20} />
              Notification Preferences
            </h3>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Enable Notifications</p>
                  <p className="text-sm text-slate-500">Receive in-app reminders for water and meals.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.notificationsEnabled}
                    onChange={(e) => setFormData({...formData, notificationsEnabled: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {formData.notificationsEnabled && (
                <div className="pt-4 border-t border-slate-200 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Meal Reminders</p>
                      <p className="text-sm text-slate-500">Get reminded to log your meals.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.mealReminderEnabled}
                        onChange={(e) => setFormData({...formData, mealReminderEnabled: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Water Reminder Interval</label>
                    <select
                      value={formData.waterReminderInterval}
                      onChange={(e) => setFormData({...formData, waterReminderInterval: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white"
                    >
                      <option value={30}>Every 30 minutes</option>
                      <option value={60}>Every 1 hour</option>
                      <option value={90}>Every 1.5 hours</option>
                      <option value={120}>Every 2 hours</option>
                      <option value={0}>Off</option>
                    </select>
                  </div>
                </div>
              )}
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Push-Pull-Legs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Dietary Preferences / Restrictions</label>
                <textarea 
                  value={formData.dietaryPreferences || ''}
                  onChange={e => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none"
                  placeholder="e.g. Vegan, No Nuts, Keto..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Health Status / Injuries</label>
                <textarea 
                  value={formData.healthStatus || ''}
                  onChange={e => setFormData({ ...formData, healthStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none"
                  placeholder="Any conditions we should know about?"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
            >
              <Trash2 size={20} />
              Delete Account
            </button>
            <Button type="submit" disabled={saving} className="w-full md:w-auto px-12 py-4 text-lg">
              {saving ? <RefreshCw className="animate-spin mr-2" size={20} /> : <CheckCircle2 className="mr-2" size={20} />}
              {saving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 text-center mb-2">Delete Account?</h3>
              <p className="text-slate-500 text-center mb-8">
                Are you sure you want to delete your account? This action is permanent and all your data, including plans and logs, will be lost forever.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 py-4"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white border-none"
                  onClick={handleDeleteAccount}
                >
                  Delete Forever
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);

  const coaches = [
    { 
      id: 1, 
      name: 'Ahmed Hassan', 
      specialty: 'Bodybuilding & Strength', 
      rating: 4.9, 
      reviews: 124,
      price: 50, 
      image: 'https://picsum.photos/seed/coach1/400/400',
      experience: '8 Years',
      activeClients: 45,
      about: 'Certified personal trainer specializing in muscle hypertrophy and strength conditioning. I help clients build sustainable habits for long-term muscle growth.',
      tags: ['Muscle Gain', 'Strength', 'Nutrition'],
      verified: true
    },
    { 
      id: 2, 
      name: 'Sarah Wellness', 
      specialty: 'Yoga & Mobility', 
      rating: 4.8, 
      reviews: 89,
      price: 40, 
      image: 'https://picsum.photos/seed/coach2/400/400',
      experience: '5 Years',
      activeClients: 30,
      about: 'Holistic wellness coach focusing on flexibility, core strength, and mental well-being through advanced yoga practices and mindful nutrition.',
      tags: ['Yoga', 'Flexibility', 'Mindfulness'],
      verified: true
    },
    { 
      id: 3, 
      name: 'Capt. Omar', 
      specialty: 'Crossfit & HIIT', 
      rating: 5.0, 
      reviews: 210,
      price: 60, 
      image: 'https://picsum.photos/seed/coach3/400/400',
      experience: '10 Years',
      activeClients: 60,
      about: 'Former competitive athlete turned coach. My programs are high-intensity, designed to push your limits and maximize cardiovascular endurance and power.',
      tags: ['Crossfit', 'HIIT', 'Endurance'],
      verified: true
    },
    { 
      id: 4, 
      name: 'Nour Dietitian', 
      specialty: 'Clinical Nutrition', 
      rating: 4.7, 
      reviews: 156,
      price: 45, 
      image: 'https://picsum.photos/seed/coach4/400/400',
      experience: '6 Years',
      activeClients: 80,
      about: 'Registered dietitian helping you achieve your weight goals without restrictive diets. I create personalized meal plans based on your metabolic needs.',
      tags: ['Weight Loss', 'Meal Planning', 'Clinical'],
      verified: false
    },
    { 
      id: 5, 
      name: 'Kareem Fit', 
      specialty: 'Calisthenics', 
      rating: 4.9, 
      reviews: 92,
      price: 55, 
      image: 'https://picsum.photos/seed/coach5/400/400',
      experience: '7 Years',
      activeClients: 25,
      about: 'Master your bodyweight. I teach progressive calisthenics from basic pushups to advanced skills like the planche and front lever.',
      tags: ['Bodyweight', 'Gymnastics', 'Core'],
      verified: true
    },
    { 
      id: 6, 
      name: 'Laila Run', 
      specialty: 'Marathon Prep', 
      rating: 4.8, 
      reviews: 64,
      price: 35, 
      image: 'https://picsum.photos/seed/coach6/400/400',
      experience: '4 Years',
      activeClients: 40,
      about: 'Marathon finisher and running coach. Whether you are aiming for your first 5K or a sub-3 hour marathon, I will get you to the finish line.',
      tags: ['Running', 'Cardio', 'Endurance'],
      verified: false
    },
  ];

  const categories = ['All', 'Bodybuilding', 'Yoga', 'Crossfit', 'Nutrition', 'Calisthenics', 'Running'];

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          coach.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || coach.tags.some(tag => tag.includes(selectedCategory)) || coach.specialty.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8 pb-20"
    >
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight mb-2">Expert Coaches</h1>
          <p className="text-slate-500 font-medium">Find the perfect trainer to guide your fitness journey.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coaches or specialties..." 
            className="pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none w-full transition-all font-medium"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-2 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
              selectedCategory === category 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "bg-white border-2 border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Coaches Grid */}
      {filteredCoaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCoaches.map(coach => (
            <Card key={coach.id} className="group hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500 border-2 border-transparent hover:border-primary-100 overflow-hidden flex flex-col p-0">
              <div className="h-56 overflow-hidden relative">
                <img src={coach.image} alt={coach.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-black text-slate-900 shadow-lg">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  {coach.rating}
                  <span className="text-slate-400 font-medium text-xs ml-1">({coach.reviews})</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-display font-black text-white">{coach.name}</h3>
                    {coach.verified && (
                      <div className="bg-blue-500 text-white p-1 rounded-full" title="Verified Coach">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <p className="text-primary-300 font-bold text-sm">{coach.specialty}</p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-6 text-sm font-medium text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-primary-500" />
                    <span>{coach.experience} Exp.</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    <span>{coach.activeClients} Clients</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Monthly Plan</p>
                    <p className="text-2xl font-black text-slate-900">${coach.price}</p>
                  </div>
                  <Button 
                    onClick={() => setSelectedCoach(coach)}
                    className="bg-slate-900 text-white hover:bg-primary-600 transition-colors px-6 rounded-xl font-bold"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Search size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No coaches found</h3>
          <p className="text-slate-500">Try adjusting your search or category filter.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Coach Profile Modal */}
      <AnimatePresence>
        {selectedCoach && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedCoach(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-64 sm:h-80 relative shrink-0">
                <img src={selectedCoach.image} alt={selectedCoach.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <button 
                  onClick={() => setSelectedCoach(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white">{selectedCoach.name}</h2>
                    {selectedCoach.verified && (
                      <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                        <Check size={16} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <p className="text-primary-400 font-bold text-lg">{selectedCoach.specialty}</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                      <Star size={24} className="fill-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Rating</p>
                      <p className="text-lg font-black text-slate-900">{selectedCoach.rating} <span className="text-sm font-medium text-slate-500">({selectedCoach.reviews})</span></p>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Active Clients</p>
                      <p className="text-lg font-black text-slate-900">{selectedCoach.activeClients}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Experience</p>
                      <p className="text-lg font-black text-slate-900">{selectedCoach.experience}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">About Me</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{selectedCoach.about}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCoach.tags.map((tag: string) => (
                      <span key={tag} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-1">Start Training Today</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black">${selectedCoach.price}</span>
                      <span className="text-slate-400 font-medium">/month</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                    onClick={() => {
                      alert(`Subscription request sent to ${selectedCoach.name}!`);
                      setSelectedCoach(null);
                    }}
                  >
                    Subscribe Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProgressView({ logs, user, onUpdate }: { logs: DailyLog[], user: UserProfile, onUpdate: (u: UserProfile) => void }) {
  const data = logs.slice().reverse().map(log => {
    const totalBurned = (log.workouts || []).reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) + (log.fitCalories || 0);
    const totalDuration = (log.workouts || []).reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalSteps = (log.fitSteps || 0);
    const totalActiveMinutes = (log.fitActiveMinutes || 0) + totalDuration;
    
    return {
      ...log,
      dateFormatted: new Date(log.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
      totalBurned,
      totalDuration,
      totalSteps,
      totalActiveMinutes,
      netCalories: (log.totalCalories || 0) - totalBurned
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 md:space-y-6 pb-20"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Progress Tracking</h1>
        <p className="text-slate-500">Comprehensive overview of your performance</p>
      </div>

      <InBodyScanner user={user} onUpdate={onUpdate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Weight Tracker */}
        <Card className="p-4 md:p-8 lg:col-span-2 shadow-sm border-primary-100">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-display font-bold text-slate-900">Weight Tracking</h3>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  name="Weight (kg)" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Calories: Intake vs Burned */}
        <Card className="p-4 md:p-8 shadow-sm border-primary-100">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-display font-bold text-slate-900">Calories</h3>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="totalCalories" name="Consumed (kcal)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalBurned" name="Burned (kcal)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Steps Tracker */}
        <Card className="p-4 md:p-8 shadow-sm border-primary-100">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Footprints size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-display font-bold text-slate-900">Daily Steps</h3>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalSteps" 
                  name="Steps"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorSteps)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Minutes */}
        <Card className="p-4 md:p-8 shadow-sm border-primary-100">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Timer size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-display font-bold text-slate-900">Activity Minutes</h3>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalActiveMinutes" 
                  name="Activity Minutes"
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorActive)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Water Intake */}
        <Card className="p-4 md:p-8 shadow-sm border-primary-100">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <Droplets size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-display font-bold text-slate-900">Water Intake</h3>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="waterIntake" name="Water (Cups)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function HealthAssistant({ user, onUpdate }: { user: UserProfile, onUpdate: (u: UserProfile) => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, timestamp?: any }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any>(null);

  useEffect(() => {
    // Load chat history
    const q = query(
      collection(db, 'users', user.uid, 'chatHistory'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        role: doc.data().role as 'user' | 'ai',
        text: doc.data().text,
        timestamp: doc.data().timestamp
      }));
      
      if (history.length === 0) {
        setMessages([{ role: 'ai', text: 'Welcome, champion! I am NABD, your personal health assistant~ I can speak with you in English or Arabic (including Egyptian dialect)~ How can I help you today? ⚡️💪' }]);
      } else {
        setMessages(history);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/chatHistory`);
    });

    // Load recent activity (last 3 days)
    const loadActivity = async () => {
      const today = new Date();
      const activity: any = {};
      
      for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        try {
          const logDoc = await getDoc(doc(db, 'users', user.uid, 'dailyLogs', dateStr));
          if (logDoc.exists()) {
            activity[dateStr] = logDoc.data();
          }
        } catch (err) {
          console.error("Error loading activity for", dateStr, err);
        }
      }
      setRecentActivity(activity);
    };

    loadActivity();
    return () => unsubscribe();
  }, [user.uid]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if ((user.credits || 0) < 1) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, your balance is insufficient~ Please recharge your balance from the plans and subscriptions page to continue the conversation~ 🙏" }]);
      return;
    }

    const userMsg = input;
    setInput('');
    
    try {
      // Save user message to Firestore
      await addDoc(collection(db, 'users', user.uid, 'chatHistory'), {
        role: 'user',
        text: userMsg,
        timestamp: serverTimestamp()
      });

      setLoading(true);

      const response = await chatWithHealthAssistant(userMsg, messages, user, recentActivity);
      const aiMsg = response || "I'm sorry buddy, something went wrong while I was trying to respond~ Try again? 😅";
      
      // Save AI response to Firestore
      await addDoc(collection(db, 'users', user.uid, 'chatHistory'), {
        role: 'ai',
        text: aiMsg,
        timestamp: serverTimestamp()
      });
      
      // Deduct credit
      const newCredits = (user.credits || 0) - 1;
      await updateDoc(doc(db, 'users', user.uid), { credits: newCredits });
      onUpdate({ ...user, credits: newCredits });
    } catch (error) {
      console.error('Chat error:', error);
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/chatHistory`);
    } finally {
      setLoading(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)] flex flex-col"
    >
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:p-6 border-b border-primary-50 bg-primary-50/30 flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-lg md:rounded-xl flex items-center justify-center text-white">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-display font-bold text-primary-900">NABD AI Assistant</h3>
            <p className="text-[10px] md:text-xs text-primary-600 font-semibold">Online & Ready to help</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === 'user' ? "bg-primary-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
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
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-primary-50">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about health, nutrition, or exercise..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
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
