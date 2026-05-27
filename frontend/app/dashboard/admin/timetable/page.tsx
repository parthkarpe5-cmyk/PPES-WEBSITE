"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFacultyList, getWeeklyTimetable, upsertSlotAction } from "../../../actions/timetable";
import { getMondayOfCurrentWeek } from "../../../../lib/utils";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Clock, GripVertical, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const TIME_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

export default function AdminTimetablePage() {
  const [faculty, setFaculty] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 🚀 HELPER: Formats date to YYYY-MM-DD ignoring timezone shift
  const toLocalISO = (dateInput: any) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const refreshGrid = async () => {
    const fData = await getFacultyList();
    const sData = await getWeeklyTimetable();
    setFaculty(fData);
    setSessions(sData);
  };

  useEffect(() => { refreshGrid(); }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg("Updating...");
    const result = await upsertSlotAction(new FormData(e.currentTarget));
    if (result.success) {
      await refreshGrid();
      setMsg("✅ Updated!");
      setTimeout(() => setMsg(""), 3000);
    }
    setLoading(false);
  };

  const monday = getMondayOfCurrentWeek();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'long' }),
      formatted: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`,
      iso: toLocalISO(d) 
    };
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background text-foreground transition-colors duration-300 overflow-hidden relative flex flex-col h-screen">
        {/* Top Header Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-sky h-8 w-8 hover:bg-slate-200/40 dark:hover:bg-slate-200/10" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-border/40" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin" className="text-sky/60 hover:text-sky transition-colors font-medium">
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block">
                   <ChevronRight className="size-3 text-slate-400/40 dark:text-slate-200/20" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-semibold">Master Timetable</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky/10 border border-sky/20 text-sky text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-sky animate-pulse" />
              System Live
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <div className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto pb-40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h2 className="text-4xl font-black text-foreground tracking-tighter">
                 Master Grid <span className="text-sky/60 font-medium">Timetable</span>
               </h2>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Weekly Administration Control Console</p>
            </div>
          </div>

          <main className="space-y-12 mt-4">
            {weekDays.map((day) => (
              <div key={day.iso} className="flex flex-col gap-4 bg-card border border-border/80 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                  <div className="bg-[#1F4E79] dark:bg-sky text-white px-6 py-1.5 rounded-full font-black text-[10px] uppercase shadow-md">{day.name}</div>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-sm font-bold tracking-widest">{day.formatted}</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="p-5 text-foreground font-black uppercase text-[10px] w-48 border-r border-border sticky left-0 bg-muted z-20">Faculty</th>
                        {TIME_SLOTS.map(t => <th key={t} className="p-4 text-center border-r border-border text-[10px] text-sky font-black bg-muted/20">{t}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.map((f: any) => (
                        <tr key={f._id} className="border-b border-border/50 hover:bg-muted/10 transition-colors group">
                          <td className="p-5 font-bold text-foreground border-r border-border bg-card sticky left-0 shadow-sm z-10">{f.name}</td>
                          {TIME_SLOTS.map((_, sIdx) => {
                            const session = sessions.find((s: any) => toLocalISO(s.date) === day.iso && s.facultyName === f.name && s.slotIndex === sIdx);
                            const merged = sessions.find((s: any) => toLocalISO(s.date) === day.iso && s.facultyName === f.name && s.slotIndex === sIdx - 1 && s.duration === 2);
                            if (merged) return null;
                            if (session) {
                              const isC10 = session.studentClass === '10';
                              return (
                                <td key={sIdx} colSpan={session.duration} className="p-2 border-r border-border">
                                  <div className={`h-full min-h-[70px] rounded-[1.2rem] p-3 flex flex-col justify-center text-center border transition-all hover:scale-98 ${
                                    isC10 
                                      ? 'bg-sky/10 dark:bg-sky/20 border-sky/20 text-sky' 
                                      : 'bg-saffron/10 dark:bg-saffron/20 border-saffron/20 text-saffron'
                                  }`}>
                                     <p className="text-[9px] font-black uppercase">STD {session.studentClass}</p>
                                     <p className="text-[11px] font-black truncate uppercase text-foreground mt-0.5">{session.subject}</p>
                                  </div>
                                </td>
                              );
                            }
                            return <td key={sIdx} className="p-4 border-r border-border text-center opacity-10 font-bold text-[10px] text-muted-foreground italic group-hover:opacity-30">--</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </main>
        </div>

        {/* Floating Slot Manager Panel */}
        <motion.div drag dragMomentum={false} className="fixed bottom-10 right-10 z-50 cursor-grab active:cursor-grabbing">
          <div className="bg-white dark:bg-[#090d16]/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none border border-slate-200  w-[340px]">
            <h3 className="text-sm font-black text-foreground tracking-widest uppercase mb-6 flex justify-between items-center border-b border-border/40 pb-3">
              <span className="flex items-center gap-2"><GripVertical className="size-4 text-sky" /> Slot Manager</span>
              <span className="text-[9px] bg-sky/10 text-sky px-2 py-0.5 rounded-full font-bold uppercase">DRAG</span>
            </h3>
            {msg && (
              <div className="mb-4 text-center text-[10px] font-black uppercase p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center gap-1">
                <CheckCircle2 className="size-3.5" /> {msg}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
               <select name="facultyName" required className="w-full h-12 bg-white/50  border border-slate-200  rounded-xl px-4 text-xs font-bold text-foreground outline-none focus:border-sky">
                  <option value="" className="text-slate-900 dark:text-slate-200 dark:bg-slate-950">Select Faculty</option>
                  {faculty.map((f:any) => <option key={f._id} value={f.name} className="text-slate-900 dark:text-slate-200 dark:bg-slate-950">{f.name}</option>)}
               </select>
               <div className="grid grid-cols-2 gap-2">
                 <input name="date" type="date" required className="h-12 bg-white/50  border border-slate-200  rounded-xl px-3 text-[10px] text-foreground outline-none focus:border-sky" />
                 <select name="slotIndex" className="h-12 bg-white/50  border border-slate-200  rounded-xl px-3 text-[10px] font-bold text-foreground outline-none focus:border-sky">
                    {TIME_SLOTS.map((t, i) => <option key={i} value={i} className="text-slate-900 dark:text-slate-200 dark:bg-slate-950">{t}</option>)}
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 <select name="studentClass" className="h-12 bg-white/50  border border-slate-200  rounded-xl px-3 text-[10px] font-black text-sky outline-none focus:border-sky"><option value="10" className="text-slate-900 dark:text-slate-200 dark:bg-slate-950">Std 10</option><option value="09" className="text-slate-900 dark:text-slate-200 dark:bg-slate-950">Std 09</option></select>
                 <select name="duration" className="h-12 bg-white/50  border border-slate-200  rounded-xl px-3 text-[10px] font-black text-saffron outline-none focus:border-sky"><option value="1" className="text-slate-900 dark:text-slate-200 dark:bg-slate-950">1 Hr</option><option value="2" className="text-slate-900 dark:text-slate-200 dark:bg-slate-950">2 Hr Merge</option></select>
               </div>
               <input name="subject" placeholder="Subject Name" required className="h-12 bg-white/50  border border-slate-200  rounded-xl px-4 text-xs font-bold text-foreground outline-none focus:border-sky" />
               <button type="submit" disabled={loading} className="w-full h-14 bg-sky hover:bg-[#1F4E79] dark:hover:bg-sky/90 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 text-xs tracking-widest uppercase cursor-pointer">
                  {loading ? "Saving..." : "Update Grid"}
               </button>
            </form>
          </div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}