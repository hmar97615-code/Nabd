import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, getDocs, orderBy, limit } from 'firebase/firestore';
import { Shield, Ban, Trash2, User, Users, Search, CheckCircle2, XCircle, FileSpreadsheet, Download, Eye, X, Activity } from 'lucide-react';

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

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function AdminDashboard({ setActiveTab, setAdminViewMode }: { setActiveTab: (tab: string) => void, setAdminViewMode: (mode: 'trainer' | 'user') => void }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userLogs, setUserLogs] = useState<DailyLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

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

  const handleBanToggle = async (uid: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', uid), { banned: !currentStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', uid));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
      }
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

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = async () => {
    setLoading(true);
    try {
      const csvRows = [];
      // Headers
      const headers = ['Name', 'Email', 'Role', 'Status', 'Weight', 'Height', 'Age', 'Goal', 'Onboarded'];
      csvRows.push(headers.join(','));

      for (const u of users) {
        const row = [
          `"${u.displayName || 'Unnamed'}"`,
          `"${u.email}"`,
          `"${u.role}"`,
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
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="text-emerald-600" size={32} />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Manage users, roles, and platform access.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setAdminViewMode('user'); setActiveTab('dashboard'); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm"
          >
            <Activity size={18} />
            واجهة المستخدم
          </button>
          <button 
            onClick={() => { setAdminViewMode('trainer'); setActiveTab('dashboard'); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-all font-semibold text-sm"
          >
            <Users size={18} />
            واجهة المدرب
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-semibold text-sm"
          >
            <FileSpreadsheet size={18} />
            تصدير لـ Google Sheets
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
            />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.uid} className={`hover:bg-slate-50 transition-colors ${u.banned ? 'bg-red-50/50' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <User size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{u.displayName || 'Unnamed User'}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={u.role || 'user'}
                        onChange={(e) => handleRoleChange(u.uid, e.target.value as any)}
                        className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="user">User</option>
                        <option value="coach">Coach</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {u.banned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle size={14} /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewUser(u)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="عرض تقدم المستخدم"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleBanToggle(u.uid, !!u.banned)}
                          className={`p-2 rounded-lg transition-colors ${u.banned ? 'text-emerald-600 hover:bg-emerald-50' : 'text-orange-600 hover:bg-orange-50'}`}
                          title={u.banned ? "Unban User" : "Ban User"}
                        >
                          <Ban size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.uid)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                {selectedUser.photoURL ? (
                  <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedUser.displayName || 'مستخدم غير معروف'}</h2>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* User Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">الهدف</p>
                  <p className="text-lg font-bold text-slate-900 capitalize">{selectedUser.goal?.replace('_', ' ') || 'غير محدد'}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100/50">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">الوزن الحالي</p>
                  <p className="text-lg font-bold text-slate-900">{selectedUser.weight ? `${selectedUser.weight} كجم` : 'غير محدد'}</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100/50">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">الطول</p>
                  <p className="text-lg font-bold text-slate-900">{selectedUser.height ? `${selectedUser.height} سم` : 'غير محدد'}</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100/50">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">العمر</p>
                  <p className="text-lg font-bold text-slate-900">{selectedUser.age ? `${selectedUser.age} سنة` : 'غير محدد'}</p>
                </div>
              </div>

              {/* Additional Preferences Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">مستوى اللياقة</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{selectedUser.fitnessLevel || 'غير محدد'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">النظام الغذائي</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{selectedUser.dietaryPreferences || 'غير محدد'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">الحالة الصحية</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{selectedUser.healthStatus || 'سليم'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">نظام التمرين</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{selectedUser.preferredExerciseSystem || 'غير محدد'}</p>
                </div>
              </div>

              {/* Recent Logs Table */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-emerald-600" />
                  سجل التقدم (آخر 30 يوم)
                </h3>
                
                {loadingLogs ? (
                  <div className="text-center py-8 text-slate-500">جاري تحميل البيانات...</div>
                ) : userLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">لا توجد سجلات يومية لهذا المستخدم حتى الآن.</div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">التاريخ</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الوزن</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الخطوات</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">السعرات</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الماء</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">النوم</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">التمرين</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {userLogs.map(log => {
                          const totalSteps = Math.max(log.steps || 0, log.fitSteps || 0, log.appleSteps || 0);
                          const sleepHours = log.sleepDuration ? Math.floor(log.sleepDuration / 60) : 0;
                          const sleepMins = log.sleepDuration ? log.sleepDuration % 60 : 0;
                          
                          return (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-medium text-slate-900" dir="ltr">{log.date}</td>
                              <td className="p-4 text-slate-600">{log.weight ? `${log.weight} كجم` : '-'}</td>
                              <td className="p-4 text-slate-600">{totalSteps > 0 ? totalSteps.toLocaleString() : '-'}</td>
                              <td className="p-4 text-slate-600">{log.totalCalories > 0 ? `${log.totalCalories} سعرة` : '-'}</td>
                              <td className="p-4 text-slate-600">{log.waterIntake ? `${log.waterIntake} لتر` : '-'}</td>
                              <td className="p-4 text-slate-600">{log.sleepDuration ? `${sleepHours}س ${sleepMins}د` : '-'}</td>
                              <td className="p-4 text-slate-600 truncate max-w-[120px]" title={log.exercise}>{log.exercise || '-'}</td>
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
    </motion.div>
  );
}
