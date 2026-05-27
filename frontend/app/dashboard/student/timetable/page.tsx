import { getStudentTimetable } from "../../../actions/timetable";
import { getMondayOfCurrentWeek } from "../../../../lib/utils";

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
    return { name: d.toLocaleDateString('en-US', { weekday: 'long' }), formatted: d.toLocaleDateString('en-GB'), iso: toLocalISO(d) };
  });

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-8">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-16">
        <h1 className="text-4xl font-black text-[#1F4E79]">Weekly Planner</h1>
        <div className="flex bg-white p-2 rounded-2xl border border-sky/10">
           <a href="?class=09" className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${selectedClass === '09' ? 'bg-[#2FA8CC] text-white' : 'text-[#1F4E79]'}`}>Std 9</a>
           <a href="?class=10" className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${selectedClass === '10' ? 'bg-[#2FA8CC] text-white' : 'text-[#1F4E79]'}`}>Std 10</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto space-y-12">
        {weekDays.map((day) => {
          const daily = classes.filter((c: any) => toLocalISO(c.date) === day.iso);
          return (
            <div key={day.iso} className="space-y-4">
              <h2 className="text-[#1F4E79] font-black uppercase text-[10px] tracking-[0.3em] ml-2 flex items-center gap-4">
                 <span>{day.name}</span>
                 <span className="h-px bg-[#1F4E79]/10 flex-1"></span>
                 <span className="text-[#2FA8CC] font-bold">{day.formatted}</span>
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {daily.map((item: any) => (
                  <div key={item._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-[15px] border-[#2FA8CC] flex justify-between items-center transition-all hover:scale-[1.01]">
                    <div className="flex gap-10 items-center">
                       <div className="bg-[#E8F6FA] px-6 py-4 rounded-2xl text-center border border-sky/5">
                          <p className="text-[9px] font-black text-sky uppercase">Starts</p>
                          <p className="text-2xl font-black text-[#1F4E79]">{item.startTime}</p>
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold text-[#1F4E79]">{item.subject}</h3>
                          <p className="text-sky font-semibold italic text-sm">{item.topic || 'General Lecture'}</p>
                          <p className="text-[10px] font-bold text-[#1F4E79]/40 mt-1 uppercase">Prof. {item.facultyName}</p>
                       </div>
                    </div>
                    {item.liveLink ? (
                      <a href={item.liveLink} target="_blank" className="bg-[#FF6B00] text-white px-8 py-4 rounded-2xl font-black text-xs animate-pulse">JOIN LIVE CLASS</a>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 uppercase italic">Awaiting Link</span>
                    )}
                  </div>
                ))}
                {daily.length === 0 && <div className="ml-4 py-2 border-l border-slate-100 pl-8 text-slate-300 text-xs italic">No classes.</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}