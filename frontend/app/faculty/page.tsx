import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  Video,
  Users,
  ArrowUpRight
} from "lucide-react"
import { getSession } from "@/lib/auth" 
import { getFacultyTimetableByName } from "@/app/actions/timetable" 
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function FacultyDashboard() {
  // 1. Session and Auth
  const session = await getSession();
  if (!session || session.role !== "faculty") {
    redirect("/login/faculty");
  }

  // 2. Fetch Weekly Schedule using Faculty Name
  const allSessions = await getFacultyTimetableByName(session.name);

  // 3. Date Helper for India/Local Standard Time
  const toLocalISO = (dateInput: any) => {
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayISO = toLocalISO(new Date());

  // 4. Filter for "Today's" Classes only
  const todaySessions = allSessions.filter((s: any) => {
    return toLocalISO(s.date) === todayISO;
  });

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header - No Search Bar, No Instant Class Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Welcome back, Prof. {session.name}
          </h1>
          <p className="text-muted-foreground mt-1">Here is your teaching schedule for today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 backdrop-blur-md hover:border-[#2FA8CC]/30 transition-all duration-300 w-full">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hours Taught</span>
              <div className="text-2xl font-bold text-foreground">420h</div>
            </div>
            <div className="p-2 rounded-lg bg-card group-hover:bg-[#2FA8CC]/10 transition-colors">
              <Clock className="h-5 w-5 text-[#2FA8CC]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <ArrowUpRight className="h-3 w-3" />
            +18h <span className="text-slate-500 ml-1 font-normal">this month</span>
          </div>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-[#2FA8CC]/5 blur-3xl rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Section: Today's Dynamic Schedule */}
        <div className="lg:col-span-8 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                Today's Classes
                {todaySessions.length > 0 && (
                  <Badge variant="outline" className="bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 animate-pulse text-[10px] uppercase font-bold px-2 py-0">Active</Badge>
                )}
              </h2>
              <Link href="/dashboard/faculty">
                <Button variant="link" className="text-[#2FA8CC] text-xs font-bold hover:no-underline px-0">View Full Schedule</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {todaySessions.length > 0 ? (
                todaySessions.map((cls: any, j: number) => (
                  <div key={j} className="group relative bg-card hover:bg-white/[0.05] border border-border rounded-2xl p-5 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#2FA8CC]/20 text-[#2FA8CC]">
                          <Video className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-[#2FA8CC] transition-colors">{cls.subject}</h3>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-muted-foreground text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {cls.startTime}
                            </span>
                            <span className="text-slate-500 text-xs flex items-center gap-1 border-l border-border pl-3 uppercase">
                              Std {cls.studentClass}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {cls.topic || "Regular Session"}
                        </span>
                        {cls.liveLink ? (
                           <Link href={cls.liveLink} target="_blank">
                              <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/80 shadow-[0_0_15px_rgba(255,107,0,0.3)] rounded-xl px-6 h-9 text-xs font-bold transition-all text-white border-none">
                                Join Class
                              </Button>
                           </Link>
                        ) : (
                          <Button disabled className="bg-card text-slate-500 rounded-xl px-6 h-9 text-xs font-bold border border-border">
                            Pending
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 border-2 border-dashed border-border rounded-[2rem] text-center">
                  <p className="text-slate-500 italic text-sm font-medium">No classes scheduled for today.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Doubts */}
        <div className="lg:col-span-4 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Pending Doubts</h2>
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] font-bold">NEW</Badge>
            </div>
            <Card className="bg-card border-border backdrop-blur-md rounded-2xl p-4 space-y-4">
              {[
                { user: "Aryan S.", text: "Can you explain the derivative of tan(x) again?", time: "2 min ago", course: "Math III" },
                { user: "Rahul M.", text: "Assignment extension request.", time: "1h ago", course: "Gen. Science" },
              ].map((doubt, l) => (
                <div key={l} className={`pb-4 ${l !== 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-foreground">{doubt.user}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{doubt.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{doubt.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-[#2FA8CC] font-bold">{doubt.course}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#2FA8CC] hover:bg-[#2FA8CC]/10 px-2 rounded-lg">Reply</Button>
                  </div>
                </div>
              ))}
              <Link href="/faculty/doubts" className="w-full">
                <Button variant="outline" className="w-full border-border hover:bg-white/5 text-muted-foreground text-xs font-bold rounded-xl h-9">
                  View All Doubts
                </Button>
              </Link>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}