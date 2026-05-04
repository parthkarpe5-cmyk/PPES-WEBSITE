import { getStudentTimetable } from "../../../actions/timetable";

// In Next.js 15+, searchParams is a Promise
export default async function StudentTimetable({ 
  searchParams 
}: { 
  searchParams: Promise<{ class?: string }> 
}) {
  // 1. Await the searchParams to unwrap the promise
  const resolvedParams = await searchParams;
  const selectedClass = resolvedParams.class || "10";

  // 2. Fetch the data from MongoDB
  const classes = await getStudentTimetable(selectedClass);

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-[#1F4E79]">Weekly Timetable</h1>
          <p className="text-[#2FA8CC] italic font-medium">Viewing Schedule for Class {selectedClass}th</p>
        </div>
        
        {/* Class Switcher */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-sky/10">
          <a href="?class=09" className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === '09' ? 'bg-[#2FA8CC] text-white' : 'text-[#1F4E79] hover:bg-surface'}`}>Class 9</a>
          <a href="?class=10" className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === '10' ? 'bg-[#2FA8CC] text-white' : 'text-[#1F4E79] hover:bg-surface'}`}>Class 10</a>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-5xl">
        {classes.length > 0 ? (
          classes.map((item: any) => (
            <div key={item._id.toString()} className="bg-white rounded-[2rem] p-8 shadow-xl flex justify-between items-center border-l-[12px] border-[#2FA8CC] hover:scale-[1.01] transition-transform">
              <div className="flex gap-8 items-center">
                <div className="bg-[#E8F6FA] p-5 rounded-2xl text-center min-w-[110px]">
                  <p className="text-[10px] font-black text-[#2FA8CC] uppercase tracking-tighter">Start Time</p>
                  <p className="text-2xl font-black text-[#1F4E79]">{item.startTime}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1F4E79]">{item.subject}</h3>
                  <p className="text-[#2FA8CC] font-semibold text-sm">Topic: {item.topic}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-6 h-6 bg-[#C9A227]/20 rounded-full flex items-center justify-center text-[10px]">👨‍🏫</div>
                    <p className="text-[11px] font-bold text-[#1F4E79]/50 uppercase tracking-widest">Prof. {item.facultyName}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-3">
                <div className="bg-[#FF6B00] text-white px-4 py-1.5 rounded-full text-[10px] font-black animate-pulse uppercase tracking-[0.2em]">
                  Confirmed
                </div>
                <p className="text-[10px] font-bold text-[#1F4E79]/30">Date: {new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/50 border-2 border-dashed border-sky/20 rounded-[3rem] p-20 text-center">
            <p className="text-[#1F4E79]/40 font-bold italic text-lg">No classes found in database for Class {selectedClass}.</p>
            <p className="text-[#2FA8CC] text-sm mt-2">Add a schedule via the Admin Timetable Manager.</p>
          </div>
        )}
      </div>
    </div>
  );
}