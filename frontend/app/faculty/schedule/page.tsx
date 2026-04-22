import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Users, 
  BookOpen, 
  Video,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical
} from "lucide-react"

export default function ClassSchedulingPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-2">Class Scheduling</h1>
          <p className="text-slate-400">Plan and manage your upcoming live sessions and lectures.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white rounded-xl h-11 hover:bg-white/10 transition-all">
            <Filter className="mr-2 h-4 w-4 text-[#2FA8CC]" />
            Filters
          </Button>
          <Button className="bg-[#2FA8CC] hover:bg-[#2FA8CC]/90 text-white rounded-xl h-11 shadow-[0_0_20px_rgba(47,168,204,0.3)] transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Schedule New Class
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Calendar View (Visual representation) */}
        <div className="xl:col-span-8 space-y-8">
          <Card className="bg-white/[0.03] border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white">October 2026</h2>
                <div className="flex items-center bg-white/5 rounded-lg p-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white rounded-md"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white rounded-md"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="hidden sm:flex gap-2 p-1 bg-white/5 rounded-xl">
                 <Button variant="ghost" size="sm" className="text-xs font-bold text-[#2FA8CC] bg-white/5 rounded-lg px-4">Week</Button>
                 <Button variant="ghost" size="sm" className="text-xs font-bold text-white/40 hover:text-white rounded-lg px-4">Month</Button>
                 <Button variant="ghost" size="sm" className="text-xs font-bold text-white/40 hover:text-white rounded-lg px-4">List</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               {/* Simplified Weekly Calendar Logic */}
               <div className="grid grid-cols-7 border-b border-white/5">
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                   <div key={day} className="py-4 text-center text-[10px] uppercase tracking-widest font-bold text-slate-500 border-r border-white/5 last:border-0">{day}</div>
                 ))}
               </div>
               
               <div className="grid grid-cols-7 h-[600px]">
                 {Array.from({ length: 7 }).map((_, i) => (
                   <div key={i} className="relative border-r border-white/5 last:border-0 group">
                      <div className={`p-4 text-sm font-bold ${i === 2 ? 'text-[#2FA8CC]' : 'text-slate-500 opacity-40'}`}>
                        {i + 19}
                        {i === 2 && <div className="h-1.5 w-1.5 bg-[#2FA8CC] rounded-full mt-1" />}
                      </div>
                      
                      {/* Placeholder for scheduled items */}
                      <div className="px-2 space-y-2">
                        {i === 1 && (
                          <div className="bg-[#2FA8CC]/20 border-l-2 border-[#2FA8CC] rounded-lg p-2 transition-transform hover:scale-105 cursor-pointer">
                            <div className="text-[10px] font-bold text-[#2FA8CC] uppercase mb-1">10:00 AM</div>
                            <div className="text-[10px] font-bold text-white truncate">Math: Calculus 1</div>
                          </div>
                        )}
                         {i === 2 && (
                          <>
                            <div className="bg-[#FF6B00]/20 border-l-2 border-[#FF6B00] rounded-lg p-2 transition-transform hover:scale-105 cursor-pointer">
                              <div className="text-[10px] font-bold text-[#FF6B00] uppercase mb-1">02:30 PM</div>
                              <div className="text-[10px] font-bold text-white truncate">Physics Lab</div>
                            </div>
                            <div className="bg-[#2FA8CC]/20 border-l-2 border-[#2FA8CC] rounded-lg p-2 transition-transform hover:scale-105 cursor-pointer mt-2">
                              <div className="text-[10px] font-bold text-[#2FA8CC] uppercase mb-1">05:00 PM</div>
                              <div className="text-[10px] font-bold text-white truncate">Q&A Session</div>
                            </div>
                          </>
                        )}
                        {i === 4 && (
                           <div className="bg-emerald-500/10 border-l-2 border-emerald-500 rounded-lg p-2 transition-transform hover:scale-105 cursor-pointer">
                            <div className="text-[10px] font-bold text-emerald-500 uppercase mb-1">09:00 AM</div>
                            <div className="text-[10px] font-bold text-white truncate">Seminar</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Add icon on hover */}
                      <div className="absolute inset-0 bg-[#2FA8CC]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                         <Plus className="h-6 w-6 text-[#2FA8CC]/40" />
                      </div>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Setup & Upcoming List */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Quick Schedule Form */}
          <Card className="bg-white/[0.03] border-white/5 rounded-[2rem] backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#2FA8CC]/10 to-transparent pb-4">
              <CardTitle className="text-lg font-bold text-white">Quick Entry</CardTitle>
              <CardDescription className="text-white/40 text-xs">Instantly add a class to your calendar.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#2FA8CC] uppercase tracking-widest ml-1">Select Course</label>
                <Select defaultValue="physics">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-[#2FA8CC]">
                    <SelectValue placeholder="Course Name" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="math">Advanced Mathematics</SelectItem>
                    <SelectItem value="physics">Quantum Physics</SelectItem>
                    <SelectItem value="chem">Organic Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#2FA8CC] uppercase tracking-widest ml-1">Date</label>
                  <Input type="date" className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-[#2FA8CC] [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-[#2FA8CC] uppercase tracking-widest ml-1">Time</label>
                   <Input type="time" className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-[#2FA8CC] [color-scheme:dark]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#2FA8CC] uppercase tracking-widest ml-1">Session Type</label>
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" className="bg-[#2FA8CC]/10 border-[#2FA8CC]/30 text-[#2FA8CC] rounded-xl h-9 text-xs font-bold">
                     <Video className="mr-2 h-3 w-3" /> Live
                   </Button>
                   <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-9 text-xs font-bold">
                     <BookOpen className="mr-2 h-3 w-3" /> Material
                   </Button>
                </div>
              </div>

              <Button className="w-full bg-[#2FA8CC] hover:bg-[#2FA8CC]/90 text-white rounded-xl h-12 font-bold shadow-lg transition-all mt-4 group">
                Add to Schedule
                <Plus className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Classes List */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 px-1">Upcoming Today</h2>
            <div className="space-y-4">
              {[
                { title: "Calculus I: Limits", time: "10:00 AM", type: "Live", students: 42, color: "#2FA8CC" },
                { title: "Lab: Gravity Test", time: "02:30 PM", type: "Workshop", students: 15, color: "#FF6B00" },
                { title: "Weekly Roundup", time: "05:00 PM", type: "Webinar", students: 120, color: "#1F4E79" },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group">
                   <div className="flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                     {item.time.split(' ')[0]}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-white text-sm group-hover:text-[#2FA8CC] transition-colors truncate">{item.title}</h4>
                     <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                          <Users className="h-3 w-3" /> {item.students} Students
                        </span>
                        <div className="h-1 w-1 bg-white/20 rounded-full" />
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>{item.type}</span>
                     </div>
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white rounded-lg">
                     <MoreVertical className="h-4 w-4" />
                   </Button>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-slate-500 text-xs font-bold mt-4 hover:text-[#2FA8CC] transition-colors">
              View Full Next Week Schedule
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
