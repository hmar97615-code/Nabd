import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Target, 
  TrendingUp,
  Settings,
  X,
  Info,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from 'recharts';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  updateDoc, 
  setDoc,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { cn } from '../lib/utils';
import { Button } from '../App';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  goal: number;
  frequency: 'daily' | 'weekly';
  createdAt: string;
}

interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  value: number;
}

interface HabitModuleProps {
  user: any;
}

const HABIT_ICONS = [
  '💧', '🏃', '🥗', '📚', '🧘', '🍎', '💪', '🛌', '💊', '🚶', '☕', '🚭'
];

const HABIT_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500', 'bg-indigo-500', 'bg-orange-500', 'bg-pink-500'
];

const COLOR_MAP: Record<string, string> = {
  'bg-blue-500': '#3b82f6',
  'bg-emerald-500': '#10b981',
  'bg-amber-500': '#f59e0b',
  'bg-rose-500': '#f43f5e',
  'bg-purple-500': '#a855f7',
  'bg-indigo-500': '#6366f1',
  'bg-orange-500': '#f97316',
  'bg-pink-500': '#ec4899'
};

export default function HabitModule({ user }: HabitModuleProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState<{
    name: string;
    icon: string;
    color: string;
    goal: number | string;
    frequency: 'daily' | 'weekly';
  }>({
    name: '',
    icon: '💧',
    color: 'bg-blue-500',
    goal: 1,
    frequency: 'daily'
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'daily' | 'stats'>('daily');
  const [statsTimeframe, setStatsTimeframe] = useState<'weekly' | 'monthly'>('monthly');
  const [selectedHabitForStats, setSelectedHabitForStats] = useState<string>('all');
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchWorkoutPlan = async () => {
      try {
        const planDoc = await getDoc(doc(db, 'users', user.uid, 'plans', 'workout'));
        if (planDoc.exists()) {
          setWorkoutPlan(planDoc.data());
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error);
      }
    };

    fetchWorkoutPlan();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;

    const habitsRef = collection(db, 'users', user.uid, 'habits');
    const unsubscribeHabits = onSnapshot(habitsRef, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
      setHabits(habitsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/habits`);
    });

    return () => unsubscribeHabits();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || habits.length === 0) return;

    // Fetch completions for the current week/month
    const fetchCompletions = async () => {
      const allCompletions: HabitCompletion[] = [];
      for (const habit of habits) {
        const completionsRef = collection(db, 'users', user.uid, 'habits', habit.id, 'completions');
        const q = query(completionsRef, orderBy('date', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(doc => {
          allCompletions.push({ id: doc.id, ...doc.data() } as HabitCompletion);
        });
      }
      setCompletions(allCompletions);
    };

    fetchCompletions();
  }, [user?.uid, habits]);

  const handleAddHabit = async () => {
    if (!newHabit.name || !user?.uid) return;

    try {
      const habitsRef = collection(db, 'users', user.uid, 'habits');
      await addDoc(habitsRef, {
        ...newHabit,
        goal: Number(newHabit.goal) || 1,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      setShowAddModal(false);
      setNewHabit({
        name: '',
        icon: '💧',
        color: 'bg-blue-500',
        goal: 1,
        frequency: 'daily'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/habits`);
    }
  };

  const toggleHabit = async (habitId: string, date: string) => {
    if (!user?.uid) return;

    const existing = completions.find(c => c.habitId === habitId && c.date === date);
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    try {
      const completionsRef = collection(db, 'users', user.uid, 'habits', habitId, 'completions');
      if (existing) {
        if (existing.value >= habit.goal) {
          // Reset
          await deleteDoc(doc(db, 'users', user.uid, 'habits', habitId, 'completions', existing.id));
          setCompletions(prev => prev.filter(c => c.id !== existing.id));
        } else {
          // Increment
          await updateDoc(doc(db, 'users', user.uid, 'habits', habitId, 'completions', existing.id), {
            value: existing.value + 1
          });
          setCompletions(prev => prev.map(c => c.id === existing.id ? { ...c, value: c.value + 1 } : c));
        }
      } else {
        // Create
        const newDoc = await addDoc(completionsRef, {
          habitId,
          date,
          value: 1
        });
        setCompletions(prev => [...prev, { id: newDoc.id, habitId, date, value: 1 }]);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/habits/${habitId}/completions`);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!user?.uid) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'habits', habitId));
      setHabits(prev => prev.filter(h => h.id !== habitId));
      setHabitToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/habits/${habitId}`);
    }
  };

  const getStreak = (habitId: string) => {
    const habitCompletions = completions
      .filter(c => c.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date));
    
    let streak = 0;
    let checkDate = new Date();
    
    // Simple streak logic: check consecutive days starting from today or yesterday
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const completion = habitCompletions.find(c => c.date === dateStr);
      const habit = habits.find(h => h.id === habitId);
      
      if (completion && habit && completion.value >= habit.goal) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If it's today and not completed, keep checking yesterday
        if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  };

  const getHabitHistoryData = (habitId: string) => {
    const data = [];
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const completion = completions.find(c => c.habitId === habitId && c.date === dateStr);
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: completion ? completion.value : 0,
        goal: habit.goal
      });
    }
    return data;
  };

  const getMonthlyData = () => {
    const data = [];
    const days = statsTimeframe === 'monthly' ? 30 : 7;
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      let completedCount = 0;
      let totalCount = 0;

      const habitsToCalculate = selectedHabitForStats === 'all' 
        ? habits 
        : habits.filter(h => h.id === selectedHabitForStats);

      habitsToCalculate.forEach(habit => {
        const completion = completions.find(c => c.habitId === habit.id && c.date === dateStr);
        if (completion && completion.value >= habit.goal) {
          completedCount++;
        }
        totalCount++;
      });
      
      const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rate: Math.round(completionRate),
        completed: completedCount,
        total: totalCount
      });
    }
    return data;
  };

  const getWeeklyData = () => {
    const data = [];
    const days = 7;
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      let completedCount = 0;
      habits.forEach(habit => {
        const completion = completions.find(c => c.habitId === habit.id && c.date === dateStr);
        if (completion && completion.value >= habit.goal) {
          completedCount++;
        }
      });
      
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
        total: habits.length
      });
    }
    return data;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary-50 text-primary-600 rounded-2xl">
            <BarChart2 size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900">Habit Tracker</h2>
            <p className="text-slate-500">Build consistency and reach your goals</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('daily')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                viewMode === 'daily' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Daily
            </button>
            <button 
              onClick={() => setViewMode('stats')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                viewMode === 'stats' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Progress
            </button>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus size={20} />
            New Habit
          </Button>
        </div>
      </div>

      {viewMode === 'daily' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Date Selector */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
              const d = new Date();
              d.setDate(d.getDate() + offset);
              const dateStr = d.toISOString().split('T')[0];
              const isToday = offset === 0;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={offset}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    "flex flex-col items-center min-w-[64px] p-3 rounded-2xl transition-all",
                    isSelected ? "bg-primary-600 text-white shadow-lg shadow-primary-200 scale-110" : "bg-white text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-black">{d.getDate()}</span>
                  {isToday && !isSelected && <div className="w-1 h-1 rounded-full bg-primary-600 mt-1" />}
                </button>
              );
            })}
          </div>

          {/* Habits Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {habits.map(habit => {
              const completion = completions.find(c => c.habitId === habit.id && c.date === selectedDate);
              const progress = completion ? (completion.value / habit.goal) * 100 : 0;
              const isCompleted = progress >= 100;
              const streak = getStreak(habit.id);

              return (
                <motion.div
                  layout
                  key={habit.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner", habit.color, "bg-opacity-10")}>
                        {habit.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{habit.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Target size={12} />
                          <span>{habit.goal} {habit.frequency === 'daily' ? 'times / day' : 'times / week'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {streak > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold">
                          <Flame size={12} fill="currentColor" />
                          {streak} DAY STREAK
                        </div>
                      )}
                      <button 
                        onClick={() => setHabitToDelete(habit.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        className={cn("h-full transition-all duration-500", habit.color)}
                      />
                    </div>
                    <span className="text-sm font-black text-slate-900">{completion?.value || 0}/{habit.goal}</span>
                  </div>

                  {/* History Graph */}
                  <div className="mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart2 size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last 7 Days</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Consistency
                      </div>
                    </div>
                    <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getHabitHistoryData(habit.id)}>
                          <defs>
                            <linearGradient id={`colorValue-${habit.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={COLOR_MAP[habit.color] || '#3b82f6'} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={COLOR_MAP[habit.color] || '#3b82f6'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="name" 
                            hide={false} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 8, fontWeight: 700, fill: '#94a3b8' }}
                            interval={0}
                          />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-xl text-[10px] font-bold">
                                    <p className="text-slate-500">{payload[0].payload.name}</p>
                                    <p className="text-slate-900">{payload[0].value} / {payload[0].payload.goal}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={COLOR_MAP[habit.color] || '#3b82f6'} 
                            fillOpacity={1} 
                            fill={`url(#colorValue-${habit.id})`} 
                            strokeWidth={2}
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id, selectedDate)}
                    className={cn(
                      "w-full mt-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                      isCompleted 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <Check size={18} />
                        Completed
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Log Progress
                      </>
                    )}
                  </button>

                  {/* Background Decoration */}
                  <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-10", habit.color)} />
                </motion.div>
              );
            })}

            {habits.length === 0 && (
              <div className="md:col-span-2 py-16 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100 px-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No habits yet</h3>
                <p className="text-slate-500 mb-8">Start your journey by adding your first habit or choose from suggestions.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
                  {['Drink Water', 'Morning Run', 'Meditation', 'Read 10 Pages', 'Exercise'].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={async () => {
                        if (!user?.uid) return;
                        const iconMap: Record<string, string> = {
                          'Drink Water': '💧',
                          'Morning Run': '🏃',
                          'Meditation': '🧘',
                          'Read 10 Pages': '📚',
                          'Exercise': '💪'
                        };
                        const colorMap: Record<string, string> = {
                          'Drink Water': 'bg-blue-500',
                          'Morning Run': 'bg-emerald-500',
                          'Meditation': 'bg-purple-500',
                          'Read 10 Pages': 'bg-amber-500',
                          'Exercise': 'bg-indigo-500'
                        };
                        try {
                          await addDoc(collection(db, 'users', user.uid, 'habits'), {
                            name: suggestion,
                            icon: iconMap[suggestion] || '✨',
                            color: colorMap[suggestion] || 'bg-primary-500',
                            goal: 1,
                            frequency: 'daily',
                            userId: user.uid,
                            createdAt: new Date().toISOString()
                          });
                        } catch (error) {
                          handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/habits`);
                        }
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 transition-all border border-slate-100"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>

                <Button onClick={() => setShowAddModal(true)}>Create Custom Habit</Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {viewMode === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <TrendingUp size={16} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Completion</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {(() => {
                  const data = getMonthlyData();
                  return Math.round(data.reduce((acc, d) => acc + d.rate, 0) / data.length);
                })()}%
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Last {statsTimeframe === 'monthly' ? '30' : '7'} Days</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Check size={16} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Completions</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {getMonthlyData().reduce((acc, d) => acc + d.completed, 0)}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Last {statsTimeframe === 'monthly' ? '30' : '7'} Days</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Flame size={16} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Best Habit</span>
              </div>
              <div className="text-2xl font-black text-slate-900 truncate">
                {habits.length > 0 ? habits.reduce((best, h) => {
                  const days = statsTimeframe === 'monthly' ? 30 : 7;
                  const efficiency = Math.round((completions.filter(c => c.habitId === h.id && c.value >= h.goal).length / days) * 100);
                  const bestEfficiency = Math.round((completions.filter(c => c.habitId === best.id && c.value >= best.goal).length / days) * 100);
                  return efficiency > bestEfficiency ? h : best;
                }, habits[0]).name : 'N/A'}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Highest Efficiency</div>
            </div>
          </div>

          {/* Performance Trend Chart */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Performance Trend</h3>
                <p className="text-sm text-slate-500">
                  {selectedHabitForStats === 'all' ? 'Overall completion rate' : `Completion rate for ${habits.find(h => h.id === selectedHabitForStats)?.name}`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedHabitForStats}
                  onChange={(e) => setSelectedHabitForStats(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="all">All Habits</option>
                  {habits.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setStatsTimeframe('weekly')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      statsTimeframe === 'weekly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setStatsTimeframe('monthly')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      statsTimeframe === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getMonthlyData()}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                    minTickGap={statsTimeframe === 'monthly' ? 30 : 0}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-slate-100 rounded-2xl shadow-xl">
                            <p className="text-xs font-bold text-slate-500 mb-1">{payload[0].payload.date}</p>
                            <p className="text-lg font-black text-slate-900">{payload[0].value}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {payload[0].payload.completed} of {payload[0].payload.total} habits
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                    strokeWidth={3}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Breakdown */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Breakdown</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getWeeklyData()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border border-slate-100 rounded-2xl shadow-xl">
                              <p className="text-xs font-bold text-slate-500 mb-1">{payload[0].payload.name}</p>
                              <p className="text-lg font-black text-slate-900">{payload[0].value} Habits</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="#10b981" 
                      radius={[6, 6, 0, 0]} 
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Habit Efficiency */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Habit Efficiency</h3>
              <div className="space-y-4">
                {habits.map(habit => {
                  const habitCompletions = completions.filter(c => c.habitId === habit.id);
                  const totalPossible = 30; // last 30 days
                  const completedDays = habitCompletions.filter(c => c.value >= habit.goal).length;
                  const efficiency = Math.round((completedDays / totalPossible) * 100);

                  return (
                    <div key={habit.id} className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl", habit.color, "bg-opacity-10")}>
                        {habit.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-bold text-slate-900">{habit.name}</span>
                          <span className="text-sm font-black text-slate-900">{efficiency}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-1000", habit.color)}
                            style={{ width: `${efficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-display font-bold text-slate-900">New Habit</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Habit Name</label>
                    <input 
                      type="text"
                      placeholder="e.g., Drink Water, Morning Run"
                      value={newHabit.name}
                      onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {HABIT_ICONS.map(icon => (
                        <button
                          key={icon}
                          onClick={() => setNewHabit({ ...newHabit, icon })}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
                            newHabit.icon === icon ? "bg-primary-600 text-white scale-110 shadow-lg" : "bg-slate-50 hover:bg-slate-100"
                          )}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Color</label>
                    <div className="flex gap-2">
                      {HABIT_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewHabit({ ...newHabit, color })}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all",
                            color,
                            newHabit.color === color ? "ring-4 ring-offset-2 ring-slate-200 scale-110" : "opacity-60 hover:opacity-100"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Daily Goal</label>
                      <input 
                        type="number"
                        min="1"
                        value={newHabit.goal}
                        onChange={e => setNewHabit({ ...newHabit, goal: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Frequency</label>
                      <select
                        value={newHabit.frequency}
                        onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value as 'daily' | 'weekly' })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>

                  {workoutPlan && workoutPlan.weeklySchedule && (
                    <div className="pt-4 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Suggested from Workout Plan</label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(workoutPlan.weeklySchedule.flatMap((day: any) => day.exercises.map((ex: any) => ex.name)))).slice(0, 5).map((exerciseName: any) => (
                          <button
                            key={exerciseName as string}
                            onClick={() => setNewHabit({ ...newHabit, name: exerciseName as string, icon: '💪', color: 'bg-indigo-500' })}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                          >
                            + {exerciseName as string}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={handleAddHabit} className="w-full py-4 rounded-2xl text-lg font-bold mt-4">
                    Create Habit
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {habitToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHabitToDelete(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Habit?</h3>
              <p className="text-slate-500 mb-8">This will permanently remove the habit and all its progress history.</p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setHabitToDelete(null)}
                  className="flex-1 py-3 rounded-2xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => deleteHabit(habitToDelete)}
                  className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 border-none"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
