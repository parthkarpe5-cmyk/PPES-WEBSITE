import { getStudentTimetable } from "../../../actions/timetable";
import { getMondayOfCurrentWeek } from "../../../../lib/utils";
import { Clock, Calendar, BookOpen, ArrowUpRight, User } from "lucide-react";

export default async function StudentTimetable({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const resolvedParams = await searchParams;
  const selectedClass = resolvedParams.class || "10";
  const classes = await getStudentTimetable(selectedClass);
  const monday = getMondayOfCurrentWeek();

  // Shift-Proof Formatter
  const toLocalISO = (d: any) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    return { 
      name: d.toLocaleDateString('en-US', { weekday: 'long' }), 
      formatted: d.toLocaleDateString('en-GB'), 
      iso: toLocalISO(d) 
    };
  });

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen px-6 py-10 animate-in fade-in duration-500">
      <div className="mx-auto max-w-5xl space-y-10">
        
        {/* 1. Page Header Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-white/5">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
                <Calendar className="h-3.5 w-3.5" />
                Active Class Scheduler
              </span>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 font-display">
                  Weekly <span className="text-[#2FA8CC]">Planner</span>
                </h1>
                <p className="max-w-md text-slate-300 text-sm leading-relaxed">
                  Stay updated with your daily academic class timetable, scheduled live lectures, and upcoming subject sessions.
                </p>
              </div>
            </div>

            {/* Class Segment Filter */}
            <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-sm shrink-0">
               <a 
                 href="?class=09" 
                 className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                   selectedClass === '09' 
                     ? 'bg-[#2FA8CC] text-white shadow-lg shadow-[#2FA8CC]/20' 
                     : 'text-slate-300 hover:text-white'
                 }`}
               >
                 Std 9
               </a>
               <a 
                 href="?class=10" 
                 className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                   selectedClass === '10' 
                     ? 'bg-[#2FA8CC] text-white shadow-lg shadow-[#2FA8CC]/20' 
                     : 'text-slate-300 hover:text-white'
                 }`}
               >
                 Std 10
               </a>
            </div>
          </div>

          {/* Decorative background glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2FA8CC]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B00]/5 blur-[100px] rounded-full translate-y-1/3" />
        </section>

        {/* 2. Timetable planner days list */}
        <div className="space-y-8">
          {weekDays.map((day) => {
            const daily = classes.filter((c: any) => toLocalISO(c.date) === day.iso);
            return (
              <div key={day.iso} className="bg-card border border-border/60 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6 hover:border-[#2FA8CC]/20 transition-all duration-300">
                
                {/* Day Header Bar */}
                <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                  <div className="bg-[#2FA8CC]/10 text-[#2FA8CC] border border-[#2FA8CC]/25 px-5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                    {day.name}
                  </div>
                  <span className="h-px bg-border/40 flex-1" />
                  <span className="text-muted-foreground font-mono text-xs font-bold tracking-widest">
                    {day.formatted}
                  </span>
                </div>

                {/* Daily slots grid */}
                <div className="grid grid-cols-1 gap-4">
                  {daily.map((item: any) => (
                    <div 
                      key={item._id} 
                      className="group relative overflow-hidden bg-muted/20 border border-border/50 rounded-2xl p-5 md:p-6 hover:bg-muted/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                         {/* Lecture Start Time Badge */}
                         <div className="bg-[#2FA8CC]/10 border border-[#2FA8CC]/20 px-5 py-3.5 rounded-xl text-center min-w-[100px] shrink-0">
                            <span className="text-[9px] font-black text-[#2FA8CC] uppercase tracking-wider block">Starts</span>
                            <span className="text-xl font-black text-foreground tracking-wide mt-0.5 block">{item.startTime}</span>
                         </div>

                         {/* Lecture Title & Details */}
                         <div>
                            <div className="flex items-center gap-2.5">
                              <BookOpen className="h-4 w-4 text-[#2FA8CC]/80" />
                              <h3 className="text-xl font-bold text-foreground group-hover:text-[#2FA8CC] transition-colors">
                                {item.subject}
                              </h3>
                            </div>
                            <span className="text-[#FF6B00] font-semibold italic text-xs mt-1 block">
                              {item.topic || 'General Lecture'}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-wider">
                              <User className="h-3 w-3" />
                              <span>Prof. {item.facultyName}</span>
                            </div>
                         </div>
                      </div>

                      {/* Live Lecture Link Action */}
                      <div className="shrink-0 flex items-center">
                        {item.liveLink ? (
                          <a 
                            href={item.liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#FF6B00]/80 text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-center shadow-lg shadow-[#FF6B00]/25 transition-all active:scale-95 animate-pulse"
                          >
                            Join Live Class
                          </a>
                        ) : (
                          <span className="text-[10px] font-black text-muted-foreground/40 uppercase italic tracking-widest py-2 select-none">
                            Awaiting Link
                          </span>
                        )}
                      </div>

                      {/* Accent highlight strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2FA8CC] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  
                  {/* Empty Lecture State */}
                  {daily.length === 0 && (
                    <div className="text-muted-foreground/60 text-xs italic py-4 pl-4 border-l-2 border-border/40">
                      No sessions scheduled for this day.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}