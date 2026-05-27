import { getFacultyTimetableByName, updateTopicAction } from "../../actions/timetable";
import { getSession } from "../../../lib/auth";
import { getMondayOfCurrentWeek } from "../../../lib/utils";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FacultySidebar } from "@/components/faculty/faculty-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

export default async function FacultyDashboard() {
  const session = await getSession();
  if (!session || session.role !== "faculty") redirect("/login/faculty");

  const mySessions = await getFacultyTimetableByName(session.name);
  const monday = getMondayOfCurrentWeek();

  // 🚀 HELPER: Formats date to YYYY-MM-DD ignoring timezone shift
  const toLocalISO = (dateInput: any) => {
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <SidebarProvider>
      <FacultySidebar />
      <SidebarInset className="bg-background text-foreground transition-colors duration-300 overflow-hidden flex flex-col h-screen">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/40 px-6 backdrop-blur-md bg-transparent sticky top-0 z-10">
          <SidebarTrigger className="-ml-1 text-slate-500 dark:text-white/60 hover:text-sky dark:hover:text-white" />
          <div className="h-6 w-px bg-border/40 hidden sm:block" />
          
          <div className="flex-1 max-w-md hidden md:block">
            <span className="text-xs font-bold text-sky uppercase tracking-widest">Faculty Management Terminal</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-white/60 hover:text-sky dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-white/60 hover:text-sky dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <div className="h-8 w-px bg-border/40 mx-2" />
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
              <span className="text-xs font-semibold text-foreground">{session.name}</span>
              <span className="text-[10px] text-sky font-bold">FACULTY</span>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 pb-20 custom-scrollbar">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-foreground tracking-tighter">
                My <span className="text-sky/60 font-medium">Schedule</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Professor: {session.name}</p>
            </div>
            <div className="self-start sm:self-auto bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sync Active
            </div>
          </header>

          <main className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden p-6">
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="p-5 text-foreground font-black uppercase text-[10px] w-48 border-r border-border sticky left-0 bg-muted z-20">Day & Date</th>
                    {SLOTS.map(t => <th key={t} className="p-4 text-center border-r border-border text-[10px] text-sky font-black bg-muted/20">{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(7)].map((_, i) => {
                    const dayDate = new Date(monday);
                    dayDate.setDate(monday.getDate() + i);
                    const dayISO = toLocalISO(dayDate);

                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors group">
                        <td className="p-5 bg-card border-r border-border sticky left-0 z-10 shadow-sm text-foreground">
                          <p className="font-black text-sm uppercase">{dayDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                          <p className="text-[10px] font-mono font-bold text-sky">{dayDate.toLocaleDateString('en-GB')}</p>
                        </td>
                        {SLOTS.map((_, sIdx) => {
                          const classItem = mySessions.find((s: any) => toLocalISO(s.date) === dayISO && s.slotIndex === sIdx);
                          const isMerged = mySessions.find((s: any) => toLocalISO(s.date) === dayISO && s.slotIndex === sIdx - 1 && s.duration === 2);
                          if (isMerged) return null;
                          if (classItem) {
                            const isC10 = classItem.studentClass === '10';
                            return (
                              <td key={sIdx} colSpan={classItem.duration} className="p-2 border-r border-border">
                                <div className={`rounded-2xl p-4 border transition-all hover:scale-98 ${
                                  isC10 
                                    ? 'bg-sky/10 dark:bg-sky/20 border-sky/20 text-sky' 
                                    : 'bg-saffron/10 dark:bg-saffron/20 border-saffron/20 text-saffron'
                                }`}>
                                  <span className="text-[9px] font-black uppercase">Std {classItem.studentClass}</span>
                                  <p className="text-sm font-black text-foreground mb-3 mt-0.5 uppercase tracking-tight leading-tight">{classItem.subject}</p>
                                  <form action={updateTopicAction} className="flex flex-col gap-2 border-t border-border/40 pt-2">
                                    <input type="hidden" name="sessionId" value={classItem._id.toString()} />
                                    <input name="topic" defaultValue={classItem.topic} placeholder="Topic..." className="w-full text-xs bg-white/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-lg px-2.5 py-1.5 text-foreground outline-none focus:border-sky" />
                                    <button type="submit" className="text-[9px] font-bold text-sky hover:text-sky/80 text-right cursor-pointer">Save</button>
                                  </form>
                                </div>
                              </td>
                            );
                          }
                          return <td key={sIdx} className="p-4 border-r border-border text-center opacity-10 font-bold text-[10px] text-slate-400 italic">--</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}