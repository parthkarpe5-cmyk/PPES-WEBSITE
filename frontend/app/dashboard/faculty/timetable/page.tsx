import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { getFacultyTimetable } from "../../../actions/timetable";
import { Calendar, Clock, User, BookOpen, MapPin } from "lucide-react";

export default async function FacultyTimetable() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  let facultyName = "Faculty";
  
  if (token) {
    try {
      const payload = decodeJwt(token);
      facultyName = (payload.name as string) || "Faculty";
    } catch (e) {
      console.error("Failed to decode token for faculty timetable");
    }
  }

  const sessions = await getFacultyTimetable(facultyName);

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-sky/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/20 text-sky text-[10px] font-bold uppercase tracking-widest mb-3">
              <Calendar size={12} />
              Academic Schedule
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              My <span className="text-sky">Timetable</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2 italic">Welcome back, {facultyName}. Here is your teaching schedule.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {sessions.length > 0 ? (
            sessions.map((item: any, index: number) => (
              <div 
                key={item._id.toString()} 
                className="group relative overflow-hidden rounded-[2.5rem] p-px bg-gradient-to-br from-white/10 to-transparent hover:from-sky/40 transition-all duration-500"
              >
                <div className="relative bg-[#0D121F]/80 backdrop-blur-3xl rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-8">
                    <div className="bg-sky/10 border border-sky/20 p-6 rounded-3xl text-center min-w-[120px] group-hover:bg-sky group-hover:scale-105 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(47,168,204,0.3)]">
                      <Clock className="mx-auto mb-2 text-sky group-hover:text-white" size={20} />
                      <p className="text-[10px] font-black text-sky group-hover:text-white/80 uppercase tracking-widest">Start Time</p>
                      <p className="text-2xl font-black text-white">{item.startTime}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                          Class {item.studentClass}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-sky transition-colors">{item.subject}</h3>
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-slate-500" />
                        <p className="text-sm text-slate-400 font-medium">Topic: <span className="text-slate-200">{item.topic}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky animate-pulse" />
                        Confirmed
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-sky group-hover:bg-sky/10 transition-all">
                       <ChevronRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] p-20 text-center backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-slate-600" size={40} />
              </div>
              <p className="text-slate-400 font-bold text-xl">No teaching sessions scheduled.</p>
              <p className="text-slate-600 text-sm mt-2 max-w-xs mx-auto">Your timetable is currently clear. New allocations will appear here once assigned by the admin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ChevronRight = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
