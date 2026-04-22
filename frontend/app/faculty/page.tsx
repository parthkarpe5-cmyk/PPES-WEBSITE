import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  GraduationCap, 
  Video, 
  Clock, 
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Award,
  ArrowUpRight,
  HelpCircle
} from "lucide-react"

export default function FacultyDashboard() {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Welcome back, Dr. Karpe
          </h1>
          <p className="text-slate-400 mt-1">Here is what's happening with your courses today.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 rounded-xl text-white shadow-[0_0_15px_rgba(47,168,204,0.3)] transition-all">
            <Video className="mr-2 h-4 w-4" />
            Start Instant Class
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "1,280", icon: Users, color: "#2FA8CC", trend: "+12%" },
          { label: "Active Learners", value: "856", icon: GraduationCap, color: "#1F4E79", trend: "+5%" },
          { label: "Hours Taught", value: "420h", icon: Clock, color: "#2FA8CC", trend: "+18h" },
          { label: "Doubts Resolved", value: "92%", icon: MessageSquare, color: "#FF6B00", trend: "+2%" },
        ].map((stat, i) => (stat.label !== "Hours Taught" && stat.label !== "Doubts Resolved") ? (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-md hover:border-[#2FA8CC]/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#2FA8CC]/10 transition-colors">
                <stat.icon className="h-5 w-5 text-[#2FA8CC]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              {stat.trend} <span className="text-slate-500 ml-1 font-normal">this month</span>
            </div>
            {/* Glass glow effect */}
            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-[#2FA8CC]/5 blur-3xl rounded-full" />
          </div>
        ) : (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-md hover:border-[#2FA8CC]/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <stat.icon className={`h-5 w-5 ${stat.color === '#FF6B00' ? 'text-[#FF6B00]' : 'text-[#2FA8CC]'}`} />
              </div>
            </div>
             <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              {stat.trend} <span className="text-slate-500 ml-1 font-normal">than last week</span>
            </div>
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 ${stat.color === '#FF6B00' ? 'bg-[#FF6B00]/5' : 'bg-[#2FA8CC]/5'} blur-3xl rounded-full`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Section: Today's Classes */}
        <div className="lg:col-span-8 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Today's Classes
                <Badge variant="outline" className="bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 animate-pulse text-[10px] uppercase font-bold px-2 py-0">LIVE NOW</Badge>
              </h2>
              <Button variant="link" className="text-[#2FA8CC] text-xs font-bold hover:no-underline px-0">View Full Schedule</Button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: "Advanced Mathematics", time: "10:00 AM - 11:30 AM", students: "45 registered", status: "Starting in 5 min", type: "Live Class" },
                { title: "Quantum Physics Introduction", time: "02:00 PM - 03:30 PM", students: "128 registered", status: "Upcoming", type: "Webinar" },
                { title: "Faculty Meeting", time: "05:00 PM - 06:00 PM", students: "All faculty", status: "Upcoming", type: "Internal" },
              ].map((cls, j) => (
                <div key={j} className="group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-2xl p-5 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${j === 0 ? 'bg-[#FF6B00]/20 text-[#FF6B00]' : 'bg-[#2FA8CC]/20 text-[#2FA8CC]'}`}>
                        <Video className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-[#2FA8CC] transition-colors">{cls.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {cls.time}
                          </span>
                          <span className="text-slate-500 text-xs flex items-center gap-1 border-l border-white/10 pl-3">
                            <Users className="h-3 w-3" /> {cls.students}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`text-[10px] font-bold uppercase tracking-wider ${j === 0 ? 'text-[#FF6B00]' : 'text-slate-500'}`}>
                        {cls.status}
                      </span>
                      <Button className={`${j === 0 ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/80 shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'bg-white/10 hover:bg-white/20 text-white'} rounded-xl px-6 h-9 text-xs font-bold transition-all`}>
                        {j === 0 ? 'Start Class' : 'Prepare'}
                      </Button>
                    </div>
                  </div>
                  {/* Saffron pulse for current class */}
                  {j === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00]" />}
                </div>
              ))}
            </div>
          </section>

          {/* Performance Snapshot */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 px-1">Performance Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-2xl overflow-hidden group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#2FA8CC] uppercase tracking-wider">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-bold text-white">88%</span>
                    <span className="text-xs text-emerald-400 font-bold">+2.4% vs last week</span>
                  </div>
                  <Progress value={88} className="h-2 bg-white/5" indicatorClassName="bg-gradient-to-r from-[#2FA8CC] to-[#1F4E79]" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                     <div className="text-[10px] text-slate-500 font-bold uppercase">Target: 95%</div>
                     <div className="text-[10px] text-right text-slate-500 font-bold uppercase">Average: 82%</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#FF6B00] uppercase tracking-wider">Average Test Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-bold text-white">76.4</span>
                    <span className="text-xs text-amber-400 font-bold">Stable</span>
                  </div>
                   <div className="flex gap-1 h-12 items-end">
                    {[40, 65, 55, 80, 70, 90, 75].map((val, k) => (
                      <div key={k} className="flex-1 bg-[#FF6B00]/20 rounded-t-sm group-hover:bg-[#FF6B00]/40 transition-all cursor-pointer relative group-icon" style={{ height: `${val}%` }}>
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Week {k+1}: {val}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] text-center text-slate-500 font-bold uppercase">Last 7 Sessions Data</div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Sidebar Sections */}
        <div className="lg:col-span-4 space-y-6">
          {/* Doubts Panel */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Pending Doubts</h2>
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] font-bold">4 NEW</Badge>
            </div>
            <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-2xl p-4 space-y-4">
              {[
                { user: "Aryan S.", text: "Can you explain the derivative of tan(x) again?", time: "2 min ago", course: "Math III" },
                { user: "Kiara J.", text: "Is there a specific formula for quantum tunneling?", time: "15 min ago", course: "Physics" },
                { user: "Rahul M.", text: "Assignment deadline extension request.", time: "1h ago", course: "Gen. Science" },
              ].map((doubt, l) => (
                <div key={l} className={`pb-4 ${l !== 2 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-white">{doubt.user}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{doubt.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{doubt.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-[#2FA8CC] font-bold">{doubt.course}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#2FA8CC] hover:bg-[#2FA8CC]/10 hover:text-[#2FA8CC] px-2 rounded-lg">Reply</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold rounded-xl h-9">
                View All Doubts
              </Button>
            </Card>
          </section>

          {/* Quick Actions / Achievements */}
          <section>
             <h2 className="text-lg font-bold text-white mb-4">Teaching Goals</h2>
             <Card className="bg-gradient-to-br from-[#1F4E79]/40 to-[#2FA8CC]/10 border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="h-10 w-10 bg-[#2FA8CC]/20 rounded-xl flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-[#2FA8CC]" />
                  </div>
                  <h3 className="font-bold text-white mb-1">Rising Mentor</h3>
                  <p className="text-xs text-slate-400 mb-4">You're 12 classes away from your next achievement badge!</p>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-white/60">PROGRESS</span>
                      <span className="text-[#2FA8CC]">88/100</span>
                    </div>
                    <Progress value={88} className="h-1 bg-white/10" indicatorClassName="bg-[#2FA8CC]" />
                  </div>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold h-9">
                    Details
                  </Button>
                </div>
                <TrendingUp className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 -rotate-12 transition-transform group-hover:scale-110" />
             </Card>
          </section>
          
          {/* Support / Resources */}
          <section className="bg-[#2FA8CC]/5 rounded-2xl p-4 border border-[#2FA8CC]/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 bg-[#2FA8CC] rounded-xl flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white">Need help with tools?</h4>
                <p className="text-[10px] text-white/60">Checkout our faculty training videos and resources.</p>
              </div>
              <ExternalLink className="h-4 w-4 text-white/20" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

