import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Plus,
  Activity,
  Target,
  MoreVertical,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

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

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200',
      secondary: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100/50',
      outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
      ghost: 'text-slate-600 hover:bg-slate-100'
    };
    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base'
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[20px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
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
    { label: 'Active Clients', value: '12', icon: Users, color: 'bg-blue-50 text-blue-600', trend: '+2 this week' },
    { label: 'Monthly Income', value: '$2,400', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', trend: '+15%' },
    { label: 'Pending Requests', value: '3', icon: Clock, color: 'bg-orange-50 text-orange-600' },
    { label: 'Average Rating', value: '4.9', icon: Star, color: 'bg-yellow-50 text-yellow-600' },
  ];

  const mockClients = [
    { id: '1', name: 'Ahmed Ali', goal: 'Weight Loss', status: 'Active', nextSession: 'Tomorrow, 10:00 AM' },
    { id: '2', name: 'Sara Samir', goal: 'Muscle Building', status: 'Active', nextSession: 'Today, 4:00 PM' },
    { id: '3', name: 'Omar Hassan', goal: 'General Fitness', status: 'Pending', nextSession: 'Not set' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100/50 shadow-sm">
            <Activity size={14} />
            <span>Coach Dashboard • Nabed System</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight font-display leading-tight">
            Welcome, Coach <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">{user.displayName?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium text-xl max-w-xl">Here is a quick summary of your clients' activity and your daily schedule.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" onClick={() => setActiveTab('schedule')}>
            <Calendar size={18} className="mr-2" />
            View Schedule
          </Button>
          <Button>
            <Plus size={18} className="mr-2" />
            Invite New Client
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <StatCard 
                    key={idx} 
                    icon={stat.icon} 
                    label={stat.label} 
                    value={stat.value} 
                    color={stat.color} 
                    trend={stat.trend} 
                  />
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                {/* Recent Clients */}
                <Card className="lg:col-span-2 p-0">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-2xl font-black text-slate-900 font-display">Latest Clients</h3>
                    <button 
                      onClick={() => setActiveTab('clients')} 
                      className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="p-8 space-y-4">
                    {mockClients.map(client => (
                      <div key={client.id} className="flex items-center justify-between p-6 rounded-[28px] border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group bg-white shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-[20px] bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xl border-2 border-white shadow-md group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-lg leading-none mb-1">{client.name}</h4>
                            <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                              <Target size={12} />
                              {client.goal}
                            </p>
                          </div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-black text-slate-900 mb-0.5">{client.nextSession}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Session</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            client.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-orange-50 text-orange-600 border-orange-100'
                          )}>
                            {client.status === 'Active' ? 'Active' : 'Pending'}
                          </span>
                          <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">
                            <ArrowLeft size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-8 bg-slate-900 text-white relative overflow-hidden group">
                  <h3 className="text-2xl font-black font-display mb-8 relative z-10">Quick Actions</h3>
                  <div className="space-y-4 relative z-10">
                    {[
                      { icon: Calendar, label: 'Schedule Session', color: 'text-emerald-400', tab: 'schedule' },
                      { icon: MessageSquare, label: 'Broadcast Message', color: 'text-blue-400', tab: 'messages' },
                      { icon: TrendingUp, label: 'Update Programs', color: 'text-purple-400', tab: 'clients' }
                    ].map((action, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveTab(action.tab)} 
                        className="w-full flex items-center justify-between p-5 rounded-[24px] bg-white/5 hover:bg-white/10 border border-white/5 transition-all group/btn"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", action.color)}>
                            <action.icon size={20} />
                          </div>
                          <span className="font-bold text-lg">{action.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-white/20 group-hover/btn:text-white group-hover/btn:translate-x-[-4px] transition-all rotate-180" />
                      </button>
                    ))}
                  </div>
                  <Activity className="absolute -bottom-10 -right-10 text-white/5 opacity-10 group-hover:scale-125 transition-transform duration-700" size={240} />
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <Card className="p-0">
              <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/30">
                <h3 className="text-3xl font-black text-slate-900 font-display">Client Directory</h3>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search for clients by name..." 
                    className="pl-12 pr-6 py-3 rounded-[24px] border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-full bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-slate-300 shadow-inner">
                  <Users size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 font-display">Manage your clients professionally</h4>
                <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                  Here you will be able to see all your active clients, track their daily progress, and assign custom workout or nutrition plans for each of them.
                </p>
                <Button size="lg">
                  Invite your first client
                </Button>
              </div>
            </Card>
          )}

          {(activeTab === 'schedule' || activeTab === 'messages' || activeTab === 'settings') && (
            <Card className="p-20 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner animate-pulse">
                <Clock size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 font-display">Coming Soon</h3>
              <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
                This feature is currently under development to provide the best possible experience. Soon you will be able to manage your {activeTab === 'schedule' ? 'schedule' : activeTab === 'messages' ? 'messages' : 'settings'} completely.
              </p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
