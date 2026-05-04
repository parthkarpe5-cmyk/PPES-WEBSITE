"use client";

import React from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  PlusCircle, 
  CalendarPlus, 
  UserPlus,
  ArrowUpRight,
  TrendingUp,
  CircleCheck,
  Clock,
  ChevronRight
} from "lucide-react";

const StatCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
  <div className="relative group overflow-hidden rounded-[1.25rem] p-px bg-slate-200/5 border border-slate-200/10 hover:border-sky/30 transition-all duration-500 shadow-2xl">
    <div className="glass-card relative h-full rounded-[1.25rem] p-6 flex flex-col bg-slate-200/[0.03] backdrop-blur-3xl group-hover:bg-slate-200/[0.07] transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}/10 text-${color} shadow-lg shadow-${color}/5`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
          <TrendingUp size={12} />
          {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-200">{value}</h3>
          <span className="text-gold text-xs font-bold">{subValue}</span>
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  </div>
);

const QuickAction = ({ title, icon: Icon, color }: any) => (
  <button className="group relative flex items-center gap-4 bg-slate-200/[0.03] border border-slate-200/5 hover:border-sky/20 p-4 rounded-2xl transition-all hover:bg-slate-200/[0.08] active:scale-95 text-left w-full h-full overflow-hidden">
    <div className={`p-4 rounded-xl bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h4 className="text-slate-200 font-bold text-sm tracking-tight">{title}</h4>
      <p className="text-slate-400 text-[10px] font-medium uppercase tracking-[0.05em]">Quick Configuration</p>
    </div>
    <ArrowUpRight size={18} className="text-slate-500 group-hover:text-sky transition-colors" />
    
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
  </button>
);

export default function AdminDashboard() {
  const stats = [
    { title: "Total Students", value: "1,248", subValue: "+124", icon: Users, color: "sky", trend: "14.2%" },
    { title: "Active Courses", value: "42", subValue: "Live Now", icon: BookOpen, color: "saffron", trend: "8.1%" },
    { title: "Events Running", value: "05", subValue: "Today", icon: Calendar, color: "emerald-400", trend: "2 NEW" },
    { title: "Revenue", value: "$4.8k", subValue: "This month", icon: DollarSign, color: "gold", trend: "22.5%" },
  ];

  const activities = [
    { type: "registration", user: "Aryan Verma", content: "New student registration for 'Digital Arts'", time: "2m ago" },
    { type: "event", user: "Aditi S.", content: "Created event 'Annual Sports Day 2026'", time: "15m ago" },
    { type: "registration", user: "Rahul J.", content: "Joined 'Advanced Mathematics'", time: "1h ago" },
    { type: "update", user: "Admin", content: "Updated system security protocols", time: "3h ago" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-4xl font-black text-slate-200 tracking-tighter">
             Dashboard <span className="text-sky/60 font-medium">Overview</span>
           </h2>
           <p className="text-slate-400 text-sm font-medium mt-1">Status Report for Terminal PPES_PRIMARY_01</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 rounded-xl bg-slate-200/5 border border-slate-200/10 text-slate-200 text-xs font-bold uppercase tracking-widest hover:bg-slate-200/10 transition-all active:scale-95">
             Generate Report
           </button>
           <button className="px-5 py-2.5 rounded-xl bg-sky text-slate-200 text-xs font-black uppercase tracking-widest hover:bg-deep-blue shadow-lg shadow-sky/20 transition-all active:scale-95">
             System Scan
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 group relative overflow-hidden rounded-[2rem] p-px bg-slate-200/5 border border-slate-200/10">
          <div className="glass-card relative h-full rounded-[2rem] p-8 flex flex-col bg-slate-200/[0.03] backdrop-blur-3xl">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-lg bg-sky/20 text-sky">
                      <Clock size={20} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-200 tracking-tight">Recent Activity Log</h3>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-sky hover:text-slate-200 transition-colors">
                   View Full Log →
                </button>
             </div>
             
             <div className="space-y-6">
                {activities.map((act, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className="relative">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                         act.type === 'registration' ? 'bg-sky/10 text-sky' : 'bg-saffron/10 text-saffron'
                       }`}>
                          {act.type === 'registration' ? <UserPlus size={18} /> : <CalendarPlus size={18} />}
                       </div>
                       {i !== activities.length - 1 && (
                         <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-200/5" />
                       )}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-200 font-bold">{act.user}</p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{act.time}</span>
                       </div>
                       <p className="text-xs text-slate-400">{act.content}</p>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-sky" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="flex flex-col gap-6">
           <div className="relative overflow-hidden rounded-[2rem] p-px bg-slate-200/5 border border-slate-200/10 h-full">
              <div className="glass-card relative h-full rounded-[2rem] p-8 flex flex-col bg-slate-200/[0.03] backdrop-blur-3xl">
                 <h3 className="text-xl font-bold text-slate-200 mb-6 tracking-tight flex items-center gap-2">
                    <PlusCircle size={20} className="text-sky" />
                    Quick Actions
                 </h3>
                 <div className="grid grid-cols-1 gap-4">
                    <QuickAction title="Add Course" icon={BookOpen} color="sky" />
                    <QuickAction title="Create Event" icon={Calendar} color="saffron" />
                    <QuickAction title="Add Faculty" icon={UserPlus} color="emerald-400" />
                    
                    <div className="mt-4 p-5 rounded-2xl bg-gold/5 border border-gold/10 relative group overflow-hidden">
                       <h4 className="text-gold font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                          <TrendingUp size={14} /> Revenue Report
                       </h4>
                       <p className="text-slate-400 text-[10px] leading-relaxed">System has processed 14,204 transactions today with 0.2% failure rate.</p>
                       <div className="absolute -right-2 -bottom-2 text-gold/10 scale-150 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700">
                          <DollarSign size={48} />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
