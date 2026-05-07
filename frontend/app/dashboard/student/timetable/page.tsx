import { getStudentTimetable } from "../../../actions/timetable";

export default async function StudentTimetable({ 
  searchParams 
}: { 
  searchParams: Promise<{ class?: string }> 
}) {
  // 1. Next.js 15+ requirement: Await searchParams
  const resolvedParams = await searchParams;
  const selectedClass = resolvedParams.class || "10";

  // 2. Fetch the timetable data for this class
  const classes = await getStudentTimetable(selectedClass);

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-8 relative overflow-hidden">
      
      {/* Header Section */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-[#1F4E79]">Weekly Schedule</h1>
          <p className="text-[#2FA8CC] italic font-medium">Viewing classes for Standard {selectedClass}</p>
        </div>
        
        {/* Class Toggle for Testing */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-sky/10">
          <a href="?class=09" className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === '09' ? 'bg-[#2FA8CC] text-white' : 'text-[#1F4E79] hover:bg-surface'}`}>Class 9</a>
          <a href="?class=10" className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === '10' ? 'bg-[#2FA8CC] text-white' : 'text-[#1F4E79] hover:bg-surface'}`}>Class 10</a>
        </div>
      </div>

      {/* The List of Classes */}
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {classes.length > 0 ? (
          // THIS IS THE CRUCIAL PART: The loop that defines 'item'
          classes.map((item: any) => (
            <div key={item._id.toString()} className="bg-white rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between border-l-[14px] border-[#2FA8CC] shadow-[0_20px_50px_-10px_rgba(31,78,121,0.1)] hover:scale-[1.01] transition-all">
              
              <div className="flex gap-10 items-center w-full md:w-auto">
                {/* Time Display */}
                <div className="text-center bg-[#E8F6FA] px-6 py-4 rounded-2xl min-w-[120px]">
                   <p className="text-[10px] font-black text-[#2FA8CC] uppercase tracking-widest">Time Slot</p>
                   <p className="text-2xl font-black text-[#1F4E79]">{item.startTime || "TBA"}</p>
                </div>

                {/* Subject & Topic Display */}
                <div>
                   <h3 className="text-2xl font-bold text-[#1F4E79]">{item.subject}</h3>
                   <p className="text-[#2FA8CC] font-semibold text-sm">Topic: {item.topic || 'Class Session'}</p>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs">👨‍🏫</span>
                      <p className="text-[11px] font-bold text-[#1F4E79]/40 uppercase tracking-widest">
                        Prof. {item.facultyName} {item.isProxy && <span className="text-red-500 ml-1">(Proxy)</span>}
                      </p>
                   </div>
                </div>
              </div>
              
              {/* Dynamic Live Link Button */}
              <div className="mt-6 md:mt-0 w-full md:w-auto flex flex-col items-end gap-2">
                {item.liveLink ? (
                  <a 
                    href={item.liveLink} 
                    target="_blank" 
                    className="w-full md:w-auto bg-[#FF6B00] text-white px-8 py-4 rounded-2xl font-bold animate-pulse shadow-lg shadow-[#FF6B00]/20 text-center hover:bg-[#1F4E79] transition-colors"
                  >
                    JOIN LIVE CLASS →
                  </a>
                ) : (
                  <div className="bg-slate-100 text-slate-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    Link Not Shared Yet
                  </div>
                )}
                <p className="text-[9px] font-bold text-deepBlue/20 mr-2 uppercase">Scheduled: {new Date(item.date).toLocaleDateString()}</p>
              </div>

            </div>
          ))
        ) : (
          /* Empty State */
          <div className="bg-white/50 border-4 border-dashed border-sky/20 rounded-[4rem] p-24 text-center">
            <div className="text-5xl mb-6 opacity-20">📅</div>
            <p className="text-[#1F4E79]/40 font-bold italic text-xl">No classes have been scheduled for Class {selectedClass} this week.</p>
          </div>
        )}
      </div>

      {/* Decorative Bottom branding */}
      <footer className="max-w-5xl mx-auto mt-20 text-center opacity-20 pointer-events-none">
          <p className="text-[10px] font-black tracking-[1em] text-[#1F4E79] uppercase">Prarambha Path • Digital Learning</p>
      </footer>
    </div>
  );
}