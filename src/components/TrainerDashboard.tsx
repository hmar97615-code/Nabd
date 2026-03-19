import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Star, 
  Clock, 
  DollarSign,
  ChevronRight,
  Search,
  CheckCircle2,
  Plus
} from 'lucide-react';

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-white rounded-3xl border border-slate-100 shadow-sm ${className || ''} ${onClick ? 'cursor-pointer' : ''}`}>
    {children}
  </div>
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
      secondary: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
      ghost: 'text-slate-600 hover:bg-slate-100'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className || ''}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

interface TrainerDashboardProps {
  user: any; // Using any for now, ideally UserProfile
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TrainerDashboard({ user, activeTab, setActiveTab }: TrainerDashboardProps) {
  // Mock data for the dashboard
  const stats = [
    { label: 'Active Clients', value: '12', icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Monthly Revenue', value: '$2,400', icon: <DollarSign size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pending Requests', value: '3', icon: <Clock size={20} />, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Average Rating', value: '4.9', icon: <Star size={20} />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  const mockClients = [
    { id: '1', name: 'Ahmed Ali', goal: 'Weight Loss', status: 'Active', nextSession: 'Tomorrow, 10:00 AM' },
    { id: '2', name: 'Sarah Smith', goal: 'Muscle Gain', status: 'Active', nextSession: 'Today, 4:00 PM' },
    { id: '3', name: 'Omar Hassan', goal: 'General Fitness', status: 'Pending', nextSession: 'Not scheduled' },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">مرحباً بعودتك، كابتن {user.displayName?.split(' ')[0]}!</h1>
          <p className="text-slate-600 mt-1">إليك ما يحدث مع عملائك اليوم.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="bg-white text-slate-700 border border-slate-200" onClick={() => setActiveTab('schedule')}>
            <Calendar size={18} className="ml-2" />
            عرض الجدول
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus size={18} className="ml-2" />
            دعوة عميل
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <Card key={idx} className="p-6 border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Clients */}
              <Card className="lg:col-span-2 p-6 border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">أحدث العملاء</h3>
                  <button onClick={() => setActiveTab('clients')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">عرض الكل</button>
                </div>
                <div className="space-y-4">
                  {mockClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors bg-slate-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{client.name}</h4>
                          <p className="text-xs text-slate-500">{client.goal}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">{client.nextSession}</p>
                        <p className="text-xs text-slate-500">الجلسة القادمة</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {client.status === 'Active' ? 'نشط' : 'قيد الانتظار'}
                        </span>
                        <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                          <ChevronRight size={16} className="rotate-180" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 border-slate-100 bg-slate-900 text-white">
                <h3 className="text-lg font-bold mb-6">إجراءات سريعة</h3>
                <div className="space-y-3">
                  <button onClick={() => setActiveTab('schedule')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-emerald-400" />
                      <span className="font-medium">جدولة جلسة</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 rotate-180" />
                  </button>
                  <button onClick={() => setActiveTab('messages')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <MessageSquare size={18} className="text-blue-400" />
                      <span className="font-medium">إرسال رسالة جماعية</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 rotate-180" />
                  </button>
                  <button onClick={() => setActiveTab('clients')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={18} className="text-purple-400" />
                      <span className="font-medium">تحديث البرامج</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 rotate-180" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <Card className="p-6 border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-900">دليل العملاء</h3>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="البحث عن عملاء..." 
                  className="pr-10 pl-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64"
                />
              </div>
            </div>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Users size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">إدارة عملائك</h4>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                هنا ستتمكن من رؤية جميع عملائك النشطين، وتقدمهم، وتعيين خطط تمارين أو تغذية محددة لهم.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                دعوة عميلك الأول
              </Button>
            </div>
          </Card>
        )}

        {(activeTab === 'schedule' || activeTab === 'messages' || activeTab === 'settings') && (
          <Card className="p-12 border-slate-100 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">قريباً</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              هذه الميزة قيد التطوير حالياً. قريباً ستتمكن من إدارة {activeTab === 'schedule' ? 'جدولك' : activeTab === 'messages' ? 'رسائلك' : 'إعداداتك'} بالكامل مباشرة من لوحة التحكم.
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
