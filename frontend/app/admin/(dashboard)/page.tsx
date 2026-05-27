"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Clock,
  Loader2
} from "lucide-react";
import { getAuthHeaders } from "@/lib/api";

const StatCard = ({ title, value, subValue, icon: Icon }: any) => (
  <div className="relative group overflow-hidden rounded-[1.25rem] p-px bg-card border border-border hover:border-sky/30 transition-all duration-500 shadow-2xl">
    <div className="glass-card relative h-full rounded-[1.25rem] p-6 flex flex-col bg-card backdrop-blur-3xl group-hover:bg-slate-200/[0.07] transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-sky/10 text-sky shadow-lg">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.1em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-foreground">{value}</h3>
          <span className="text-gold text-xs font-bold">{subValue}</span>
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-sky/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
);

const QuickAction = ({ title, icon: Icon, onClick }: any) => (
  <button onClick={onClick} className="group relative flex items-center gap-4 bg-card border border-border hover:border-sky/20 p-4 rounded-2xl transition-all hover:bg-slate-200/[0.08] active:scale-95 text-left w-full h-full overflow-hidden cursor-pointer">
    <div className="p-4 rounded-xl bg-sky/10 text-sky group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h4 className="text-foreground font-bold text-sm tracking-tight">{title}</h4>
      <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.05em]">Quick Configuration</p>
    </div>
    <ArrowUpRight size={18} className="text-slate-500 group-hover:text-sky transition-colors" />
    
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
  </button>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getTimeAgo = (dateStr: string) => {
    try {
      const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval}y ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval}mo ago`;
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval}d ago`;
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval}h ago`;
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval}m ago`;
      return "just now";
    } catch {
      return "some time ago";
    }
  };

  const fetchAdminData = async () => {
    try {
      const headers = getAuthHeaders();
      const [usersRes, coursesRes, eventsRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users', { headers: headers as any }),
        fetch('http://localhost:5000/api/courses', { headers: headers as any }),
        fetch('http://localhost:5000/api/events', { headers: headers as any }),
        fetch('http://localhost:5000/api/v1/payments', { headers: headers as any })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-sky h-10 w-10" />
        <p className="text-slate-500 text-sm font-medium animate-pulse uppercase tracking-widest">Compiling live metrics...</p>
      </div>
    );
  }

  // --- STATS CALCULATIONS ---
  const students = users.filter((u: any) => u.role === 'student' || u.role === 'STUDENT');
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newStudentsCount = students.filter((u: any) => new Date(u.createdAt) > oneWeekAgo).length;

  const totalRevenue = payments.reduce((acc, p) => p.status === 'success' ? acc + p.amount : acc, 0);
  const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRevenue);

  const stats = [
    { title: "Total Students", value: students.length.toString(), subValue: `+${newStudentsCount} this week`, icon: Users },
    { title: "Active Courses", value: courses.length.toString(), subValue: "Live Now", icon: BookOpen },
    { title: "Events Running", value: events.length.toString(), subValue: "Upcoming", icon: Calendar },
    { title: "Revenue", value: formattedRevenue, subValue: "All transactions", icon: DollarSign },
  ];

  // --- RECENT ACTIVITY LOG MIXER ---
  const getRecentActivities = () => {
    const list: any[] = [];
    
    // Add student registrations
    students.slice(0, 2).forEach((s: any) => {
      list.push({
        type: "registration",
        user: s.name,
        content: `Registered as a new student with USN: ${s.usn || s.userId}`,
        time: getTimeAgo(s.createdAt),
        rawDate: new Date(s.createdAt)
      });
    });

    // Add payment purchase logs
    payments.slice(0, 2).forEach((p: any) => {
      const courseName = p.courseId?.course_name || 'Premium Course';
      list.push({
        type: "payment",
        user: p.studentDetails?.name || 'Student',
        content: `Purchased '${courseName}' for INR ${p.amount}`,
        time: getTimeAgo(p.createdAt),
        rawDate: new Date(p.createdAt)
      });
    });

    // Sort by newest date
    return list.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  };

  const activities = getRecentActivities();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-4xl font-black text-foreground tracking-tighter">
             Dashboard <span className="text-sky/60 font-medium">Overview</span>
           </h2>
           <p className="text-muted-foreground text-sm font-medium mt-1">Status Report for Terminal PPES_PRIMARY_01</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={fetchAdminData} className="px-5 py-2.5 rounded-xl bg-card border border-border text-foreground text-xs font-bold uppercase tracking-widest hover:bg-slate-200/10 transition-all active:scale-95 cursor-pointer">
             Refresh Data
           </button>
           <button className="px-5 py-2.5 rounded-xl bg-sky text-slate-250 text-xs font-black uppercase tracking-widest hover:bg-[#1F4E79] shadow-lg shadow-sky/20 transition-all active:scale-95 cursor-pointer">
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
        <div className="lg:col-span-2 group relative overflow-hidden rounded-[2rem] p-px bg-card border border-border">
          <div className="glass-card relative h-full rounded-[2rem] p-8 flex flex-col bg-card backdrop-blur-3xl">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-lg bg-sky/20 text-sky">
                      <Clock size={20} />
                   </div>
                   <h3 className="text-xl font-bold text-foreground tracking-tight">Recent Activity Log</h3>
                </div>
             </div>
             
             <div className="space-y-6">
                {activities.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No recent activity detected.</p>
                ) : (
                  activities.map((act, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                      <div className="relative">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                           act.type === 'registration' ? 'bg-sky/10 text-sky' : 'bg-saffron/10 text-saffron'
                         }`}>
                            {act.type === 'registration' ? <UserPlus size={18} /> : <CalendarPlus size={18} />}
                         </div>
                         {i !== activities.length - 1 && (
                           <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-card" />
                         )}
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between">
                            <p className="text-sm text-foreground font-bold">{act.user}</p>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase">{act.time}</span>
                         </div>
                         <p className="text-xs text-muted-foreground">{act.content}</p>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[2rem] p-px bg-card border border-border h-full">
            <div className="glass-card relative h-full rounded-[2rem] p-8 flex flex-col bg-card backdrop-blur-3xl">
               <h3 className="text-xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-2">
                  <PlusCircle size={20} className="text-sky" />
                  Quick Actions
               </h3>
               <div className="grid grid-cols-1 gap-4">
                  <QuickAction title="Manage Courses" icon={BookOpen} onClick={() => router.push('/admin/courses')} />
                  <QuickAction title="Manage Events" icon={Calendar} onClick={() => router.push('/admin/events')} />
                  <QuickAction title="Manage Faculty" icon={UserPlus} onClick={() => router.push('/admin/faculty')} />
                  
                  <div className="mt-4 p-5 rounded-2xl bg-gold/5 border border-gold/10 relative group overflow-hidden">
                     <h4 className="text-gold font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                        <TrendingUp size={14} /> Revenue Report
                     </h4>
                     <p className="text-muted-foreground text-[10px] leading-relaxed">System has successfully processed all transactions today with 100% gateway integrity.</p>
                     <div className="absolute -right-2 -bottom-2 text-gold/10 scale-150 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
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
