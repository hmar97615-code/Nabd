import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, getDocs, orderBy, limit } from 'firebase/firestore';
import { Shield, Ban, Trash2, User, Users, Search, CheckCircle2, XCircle, FileSpreadsheet, Download, Eye, X, Activity, TrendingUp, CreditCard, Filter, MoreVertical, Mail, Calendar, Weight as WeightIcon, Ruler, Heart, Utensils, Droplets, Moon, Info, Target, Zap, Dumbbell } from 'lucide-react';
import { cn } from '../lib/utils';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'coach' | 'admin';
  banned?: boolean;
  onboarded: boolean;
  weight?: number;
  height?: number;
  age?: number;
  goal?: string;
  gender?: string;
  nationality?: string;
  healthStatus?: string;
  budgetLevel?: string;
  dietaryPreferences?: string;
  fitnessLevel?: string;
  preferredExerciseSystem?: string;
  playsSports?: boolean;
  credits?: number;
  aiWorkoutPlan?: any;
  aiNutritionPlan?: any;
}

interface DailyLog {
  id: string;
  date: string;
  totalCalories: number;
  weight?: number;
  steps?: number;
  fitSteps?: number;
  appleSteps?: number;
  sleepDuration?: number;
  waterIntake?: number;
  exercise?: string;
  meals?: any[];
}

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <motion.div 
    whileHover={onClick ? { y: -4, scale: 1.01 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={cn(
      "bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden transition-all duration-500",
      onClick && "cursor-pointer hover:shadow-2xl hover:shadow-slate-200/60",
      className
    )}
  >
    {children}
  </motion.div>
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
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

const StatCard = ({ icon: Icon, label, value, color, trend }: { icon: any, label: string, value: string | number, color: string, trend?: string }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", color)}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-3xl font-black text-slate-900 font-display">{value}</h3>
  </Card>
);

export default function AdminDashboard({ setActiveTab, setAdminViewMode }: { setActiveTab: (tab: string) => void, setAdminViewMode: (mode: 'trainer' | 'user') => void }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userLogs, setUserLogs] = useState<DailyLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'coach' | 'admin'>('all');

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return unsubscribe;
  }, []);

  const handleRoleChange = async (uid: string, newRole: 'user' | 'coach' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleBanToggle = async (uid: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', uid), { banned: !currentStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    setUserToDelete(uid);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteDoc(doc(db, 'users', userToDelete));
      setUserToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userToDelete}`);
    }
  };

  const handleViewUser = async (user: UserProfile) => {
    setSelectedUser(user);
    setLoadingLogs(true);
    try {
      const q = query(collection(db, 'users', user.uid, 'dailyLogs'), orderBy('date', 'desc'), limit(30));
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyLog));
      setUserLogs(logs);
    } catch (error) {
      console.error("Error fetching user logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => !u.banned).length,
    coaches: users.filter(u => u.role === 'coach').length,
    banned: users.filter(u => u.banned).length
  };

  const exportToCSV = async () => {
    setLoading(true);
    try {
      const csvRows = [];
      const headers = ['Name', 'Email', 'Role', 'Credits', 'Status', 'Weight', 'Height', 'Age', 'Goal', 'Onboarded'];
      csvRows.push(headers.join(','));

      for (const u of users) {
        const row = [
          `"${u.displayName || 'Unnamed'}"`,
          `"${u.email}"`,
          `"${u.role}"`,
          u.credits || 0,
          `"${u.banned ? 'Banned' : 'Active'}"`,
          u.weight || '',
          u.height || '',
          u.age || '',
          `"${u.goal || ''}"`,
          u.onboarded ? 'Yes' : 'No'
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `nabdh_users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-10 pb-20"
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100/50 shadow-sm">
            <Shield size={14} />
            <span>Admin Dashboard • Nabed System</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight font-display leading-tight">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Platform</span>
          </h1>
          <p className="text-slate-500 font-medium text-xl max-w-xl">Control users, roles, and general platform data with ease.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => { setAdminViewMode('user'); setActiveTab('dashboard'); }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 hover:bg-slate-50 transition-all font-bold text-sm"
          >
            <Activity size={18} className="text-emerald-600" />
            User Interface
          </button>
          <button 
            onClick={() => { setAdminViewMode('trainer'); setActiveTab('dashboard'); }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 hover:bg-slate-50 transition-all font-bold text-sm"
          >
            <Users size={18} className="text-blue-600" />
            Coach Interface
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-[24px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 font-bold text-sm"
          >
            <FileSpreadsheet size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Users" value={stats.total} color="bg-blue-50 text-blue-600" trend="+5% this month" />
        <StatCard icon={CheckCircle2} label="Active Users" value={stats.active} color="bg-emerald-50 text-emerald-600" trend="92% activity" />
        <StatCard icon={Shield} label="Coaches" value={stats.coaches} color="bg-purple-50 text-purple-600" />
        <StatCard icon={Ban} label="Banned" value={stats.banned} color="bg-red-50 text-red-600" />
      </div>

      {/* Main Content Area */}
      <Card className="p-0">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search for user by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 rounded-[24px] border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-full bg-white transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            {(['all', 'user', 'coach', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                  filterRole === role 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                    : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                )}
              >
                {role === 'all' ? 'All' : role === 'user' ? 'User' : role === 'coach' ? 'Coach' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Role</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-500 font-bold">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Search size={48} className="text-slate-300" />
                      <p className="text-slate-500 font-bold text-xl">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.uid} className={cn("hover:bg-slate-50/50 transition-all group", u.banned && "bg-red-50/30")}>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt={u.displayName} className="w-12 h-12 rounded-[18px] border-2 border-white shadow-md object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-[18px] bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-md">
                              <User size={24} />
                            </div>
                          )}
                          {u.onboarded && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg leading-none mb-1">{u.displayName || 'Unknown User'}</p>
                          <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <select 
                        value={u.role || 'user'}
                        onChange={(e) => handleRoleChange(u.uid, e.target.value as any)}
                        className="bg-white border border-slate-100 text-sm font-bold rounded-xl px-4 py-2 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                      >
                        <option value="user">User</option>
                        <option value="coach">Coach</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-slate-300" />
                        <span className="font-black text-slate-700 text-lg">{(u.credits || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      {u.banned ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">
                          <XCircle size={14} /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewUser(u)}
                          className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleBanToggle(u.uid, !!u.banned)}
                          className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm",
                            u.banned 
                              ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white" 
                              : "text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white"
                          )}
                          title={u.banned ? "Unban" : "Ban User"}
                        >
                          <Ban size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.uid)}
                          className="w-10 h-10 flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
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
              <h3 className="text-2xl font-display font-bold text-slate-900 text-center mb-2">Delete User?</h3>
              <p className="text-slate-500 text-center mb-8">
                Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently removed.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 py-4"
                  onClick={() => setUserToDelete(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white border-none"
                  onClick={confirmDeleteUser}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[48px] w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {selectedUser.photoURL ? (
                      <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="w-20 h-20 rounded-[28px] border-4 border-white shadow-xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-[28px] bg-emerald-100 flex items-center justify-center text-emerald-600 border-4 border-white shadow-xl">
                        <User size={40} />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-md" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 font-display mb-1">{selectedUser.displayName || 'Unknown User'}</h2>
                    <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedUser.email}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="flex items-center gap-1.5"><Shield size={14} /> {selectedUser.role}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="w-12 h-12 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all shadow-sm border border-slate-100"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* User Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-emerald-50/50 rounded-[32px] p-6 border border-emerald-100/50 group hover:bg-emerald-50 transition-all">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                      <Target size={20} />
                    </div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Current Goal</p>
                    <p className="text-xl font-black text-slate-900 capitalize">{selectedUser.goal?.replace('_', ' ') || 'Not set'}</p>
                  </div>
                  <div className="bg-blue-50/50 rounded-[32px] p-6 border border-blue-100/50 group hover:bg-blue-50 transition-all">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-inner">
                      <WeightIcon size={20} />
                    </div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Weight</p>
                    <p className="text-xl font-black text-slate-900">{selectedUser.weight ? `${selectedUser.weight} kg` : 'Not set'}</p>
                  </div>
                  <div className="bg-orange-50/50 rounded-[32px] p-6 border border-orange-100/50 group hover:bg-orange-50 transition-all">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-inner">
                      <Ruler size={20} />
                    </div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Height</p>
                    <p className="text-xl font-black text-slate-900">{selectedUser.height ? `${selectedUser.height} cm` : 'Not set'}</p>
                  </div>
                  <div className="bg-purple-50/50 rounded-[32px] p-6 border border-purple-100/50 group hover:bg-purple-50 transition-all">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 shadow-inner">
                      <Calendar size={20} />
                    </div>
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Age</p>
                    <p className="text-xl font-black text-slate-900">{selectedUser.age ? `${selectedUser.age} years` : 'Not set'}</p>
                  </div>
                </div>

                {/* AI Generated Plans */}
                {(selectedUser.aiWorkoutPlan || selectedUser.aiNutritionPlan) && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black font-display flex items-center gap-3 text-slate-900">
                      <Zap className="text-amber-500" size={28} />
                      AI Personalized Plans
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedUser.aiNutritionPlan && (
                        <div className="bg-emerald-50/30 rounded-[32px] p-8 border border-emerald-100/50">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                              <Utensils size={24} />
                            </div>
                            <h4 className="text-xl font-black text-slate-900">AI Nutrition Plan</h4>
                          </div>
                          <div className="prose prose-slate max-w-none text-slate-600 font-medium">
                            {typeof selectedUser.aiNutritionPlan === 'string' ? (
                              <div className="whitespace-pre-wrap">{selectedUser.aiNutritionPlan}</div>
                            ) : (
                              <div className="space-y-4 text-sm">
                                {selectedUser.aiNutritionPlan.planTitle && <p className="font-black text-slate-900">{selectedUser.aiNutritionPlan.planTitle}</p>}
                                {selectedUser.aiNutritionPlan.healthAdvice && <p className="p-3 bg-blue-50 rounded-xl text-blue-700 border border-blue-100 italic">"{selectedUser.aiNutritionPlan.healthAdvice}"</p>}
                                {selectedUser.aiNutritionPlan.meals && (
                                  <div className="space-y-2">
                                    {selectedUser.aiNutritionPlan.meals.map((m: any, i: number) => (
                                      <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <p className="font-bold text-emerald-600 text-xs">{m.mealType || m.type}</p>
                                        <p className="font-bold text-slate-900">{m.name}</p>
                                        <p className="text-[10px] text-slate-400">{m.calories} kcal • {m.protein}g P • {m.carbs}g C • {m.fats}g F</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {selectedUser.aiWorkoutPlan && (
                        <div className="bg-blue-50/30 rounded-[32px] p-8 border border-blue-100/50">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                              <Dumbbell size={24} />
                            </div>
                            <h4 className="text-xl font-black text-slate-900">AI Workout Plan</h4>
                          </div>
                          <div className="prose prose-slate max-w-none text-slate-600 font-medium">
                            {typeof selectedUser.aiWorkoutPlan === 'string' ? (
                              <div className="whitespace-pre-wrap">{selectedUser.aiWorkoutPlan}</div>
                            ) : (
                              <div className="space-y-4 text-sm">
                                {selectedUser.aiWorkoutPlan.weeklySchedule && (
                                  <div className="space-y-3">
                                    {selectedUser.aiWorkoutPlan.weeklySchedule.map((day: any, i: number) => (
                                      <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <p className="font-bold text-blue-600 text-xs">{day.day}</p>
                                        <div className="mt-1 space-y-1">
                                          {day.exercises?.map((ex: any, j: number) => (
                                            <p key={j} className="text-[10px] text-slate-600">• {ex.name} ({ex.sets}x{ex.reps})</p>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Credits Management */}
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                      <h3 className="text-2xl font-black font-display mb-2 flex items-center gap-3">
                        <CreditCard className="text-emerald-400" size={28} />
                        Manage Balance and Points
                      </h3>
                      <p className="text-slate-400 font-bold">You can manually edit the user's balance here. It will be updated immediately.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 p-2 rounded-[24px] backdrop-blur-md border border-white/10">
                      <input 
                        type="number"
                        value={selectedUser.credits || 0}
                        onChange={(e) => setSelectedUser({...selectedUser, credits: parseInt(e.target.value)})}
                        className="bg-transparent px-6 py-3 text-2xl font-black text-white outline-none w-32 text-center"
                      />
                      <button 
                        onClick={async () => {
                          try {
                            await updateDoc(doc(db, 'users', selectedUser.uid), { credits: selectedUser.credits });
                            alert('Points updated successfully');
                          } catch (error) {
                            handleFirestoreError(error, OperationType.UPDATE, `users/${selectedUser.uid}`);
                          }
                        }}
                        className="px-8 py-4 bg-emerald-500 text-slate-900 rounded-[20px] hover:bg-emerald-400 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                      >
                        Update Balance
                      </button>
                    </div>
                  </div>
                  <CreditCard className="absolute -bottom-10 -right-10 text-white/5 opacity-10 group-hover:scale-125 transition-transform duration-700" size={240} />
                </div>

                {/* Additional Preferences Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Activity, label: 'Fitness Level', value: selectedUser.fitnessLevel, color: 'text-blue-500' },
                    { icon: Utensils, label: 'Dietary Preferences', value: selectedUser.dietaryPreferences, color: 'text-orange-500' },
                    { icon: Heart, label: 'Health Status', value: selectedUser.healthStatus || 'Healthy', color: 'text-red-500' },
                    { icon: Activity, label: 'Exercise System', value: selectedUser.preferredExerciseSystem, color: 'text-emerald-500' }
                  ].map((pref, i) => (
                    <div key={i} className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <pref.icon size={16} className={pref.color} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pref.label}</p>
                      </div>
                      <p className="text-base font-black text-slate-900 capitalize leading-tight">{pref.value || 'Not set'}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Logs Table */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 font-display flex items-center gap-3">
                      <Activity size={24} className="text-emerald-600" />
                      Progress and Activity Log
                    </h3>
                    <div className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Last 30 days
                    </div>
                  </div>
                  
                  {loadingLogs ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold">Loading logs...</p>
                    </div>
                  ) : userLogs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-slate-100 border-dashed">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Info size={48} className="text-slate-300" />
                        <p className="text-slate-500 font-bold text-xl">No daily logs for this user</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-right border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Steps</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Calories</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Water</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sleep</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Workout</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {userLogs.map(log => {
                            const totalSteps = Math.max(log.steps || 0, log.fitSteps || 0, log.appleSteps || 0);
                            const sleepHours = log.sleepDuration ? Math.floor(log.sleepDuration / 60) : 0;
                            const sleepMins = log.sleepDuration ? log.sleepDuration % 60 : 0;
                            
                            return (
                              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-5 font-black text-slate-900" dir="ltr">{log.date}</td>
                                <td className="p-5 text-slate-600 font-bold">{log.weight ? `${log.weight} kg` : '-'}</td>
                                <td className="p-5 text-slate-600 font-bold">{totalSteps > 0 ? totalSteps.toLocaleString() : '-'}</td>
                                <td className="p-5 text-slate-600 font-bold">{log.totalCalories > 0 ? `${log.totalCalories} kcal` : '-'}</td>
                                <td className="p-5 text-slate-600 font-bold">{log.waterIntake ? `${log.waterIntake} L` : '-'}</td>
                                <td className="p-5 text-slate-600 font-bold">{log.sleepDuration ? `${sleepHours}h ${sleepMins}m` : '-'}</td>
                                <td className="p-5 text-slate-600 truncate max-w-[150px] font-bold" title={log.exercise}>{log.exercise || '-'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
