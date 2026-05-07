import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { getStudentTimetable } from "../../../actions/timetable";
import { Calendar, Clock, User, BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function StudentTimetable({ 
  searchParams 
}: { 
  searchParams: Promise<{ class?: string }> 
}) {
  const resolvedParams = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  let studentClass = resolvedParams.class;
  
  // If no class in URL, try to get it from the user token
  if (!studentClass && token) {
    try {
      const payload = decodeJwt(token);
      // In your system, students might have a class stored in their profile or usn
      // For now, default to "10" if not specified, but this is where you'd extract it
      studentClass = "10"; 
    } catch (e) {
      console.error("Failed to decode token for student timetable");
    }
  }

  const selectedClass = studentClass || "10";
  const sessions = await getStudentTimetable(selectedClass);

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 p-4 md:p-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-sky/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-saffron/5 rounded-full blur-[120px] pointer-events-none opacity-20" />
      
      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/20 text-sky text-[10px] font-bold uppercase tracking-widest mb-3">
              <GraduationCap size={12} />
              Student Schedule
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Weekly <span className="text-sky">Timetable</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">Viewing classes for <span className="text-white font-bold">Grade {selectedClass}th</span></p>
          </div>

          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl">
             <Link 
               href="?class=09"
               className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedClass === '09' ? 'bg-sky text-white shadow-lg shadow-sky/20' : 'text-slate-400 hover:text-white'}`}
             >
               Class 9
             </Link>
             <Link 
               href="?class=10"
               className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedClass === '10' ? 'bg-sky text-white shadow-lg shadow-sky/20' : 'text-slate-400 hover:text-white'}`}
             >
               Class 10
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {sessions.length > 0 ? (
            sessions.map((item: any) => (
              <div 
                key={item._id.toString()} 
                className="group relative overflow-hidden rounded-[2.5rem] p-px bg-gradient-to-br from-white/10 to-transparent hover:from-sky/40 transition-all duration-500"
              >
                <div className="relative bg-[#0D121F]/80 backdrop-blur-3xl rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl">
                  <div className="flex items-center gap-8">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center min-w-[120px] group-hover:bg-sky group-hover:scale-105 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(47,168,204,0.3)]">
                      <p className="text-[10px] font-black text-sky group-hover:text-white/80 uppercase tracking-widest mb-1">Starts</p>
                      <p className="text-2xl font-black text-white">{item.startTime}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-saffron/10 border border-saffron/20 text-[10px] font-bold text-saffron uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={10} />
                          {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long' })}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-white group-hover:text-sky transition-colors tracking-tight">{item.subject}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-sky/20 flex items-center justify-center text-sky">
                            <User size={12} />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prof. {item.facultyName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-saffron/20 flex items-center justify-center text-saffron">
                            <BookOpen size={12} />
                          </div>
                          <p className="text-xs font-medium text-slate-400">{item.topic}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">
                        Confirmed
                      </div>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-sky group-hover:bg-sky/10 group-hover:border-sky/20 transition-all">
                       <ChevronRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem] p-24 text-center backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-slate-600" size={40} />
              </div>
              <p className="text-slate-400 font-bold text-2xl tracking-tight">No classes scheduled for Grade {selectedClass}th.</p>
              <p className="text-slate-600 text-sm mt-3 max-w-xs mx-auto">Please check back later or contact your administrator for the updated schedule.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-10 flex flex-col items-center gap-4 opacity-20">
           <div className="flex items-center gap-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent to-white" />
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="h-px w-32 bg-gradient-to-l from-transparent to-white" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Prarambha Path • Digital Learning Systems</p>
        </div>
      </div>
    </div>
  );
}