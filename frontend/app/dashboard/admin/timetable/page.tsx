import { getFacultyList, getWeeklyTimetable } from "../../../actions/timetable";
import SlotManager from "@/components/admin/SlotManager";

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", 
  "06:00 PM", "07:00 PM"
];

export default async function AdminTimetablePage() {
  const faculty = await getFacultyList();
  const allSessions = await getWeeklyTimetable();

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
      formatted: `${day}/${month}/${d.getFullYear()}`,
      iso: d.toISOString().split('T')[0]
    };
  });

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-black text-[#1F4E79] tracking-tight">Master Timetable</h1>
      </header>

      <main className="max-w-7xl mx-auto space-y-16">
        {weekDates.map((day) => (
          <div key={day.iso} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 ml-4">
              <span className="bg-[#1F4E79] text-white px-6 py-2 rounded-full font-bold shadow-lg">{day.dayName}</span>
              <span className="text-[#1F4E79]/40 font-mono font-bold text-sm">{day.formatted}</span>
            </div>

            <div className="overflow-x-auto bg-white rounded-[2.5rem] shadow-2xl border border-sky/10">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-[#E8F6FA] border-b border-sky/10 text-[#1F4E79] font-black uppercase text-[10px]">
                    <th className="p-6 w-48 border-r border-sky/10">Faculty</th>
                    {TIME_SLOTS.map((time) => (
                      <th key={time} className="p-4 text-center border-r border-sky/10">{time}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((f: any) => (
                    <tr key={f._id} className="border-b border-sky/5 group hover:bg-surface/30">
                      <td className="p-6 font-bold text-[#1F4E79] border-r border-sky/10 bg-white sticky left-0 z-10">{f.name}</td>
                      
                      {TIME_SLOTS.map((_, sIdx) => {
                        const session = allSessions.find((s: any) => {
                          if (!s.date) return false;
                          const d = new Date(s.date);
                          return !isNaN(d.getTime()) && 
                                 s.facultyId === f._id.toString() && 
                                 d.toISOString().split('T')[0] === day.iso &&
                                 s.slotIndex === sIdx;
                        });

                        const prevSession = allSessions.find((s: any) => {
                          if (!s.date) return false;
                          const d = new Date(s.date);
                          return !isNaN(d.getTime()) && 
                                 s.facultyId === f._id.toString() && 
                                 d.toISOString().split('T')[0] === day.iso &&
                                 s.slotIndex === sIdx - 1 &&
                                 s.duration === 2;
                        });

                        if (prevSession) return null;

                        if (session) {
                          const isC10 = session.studentClass === '10';
                          return (
                            <td key={sIdx} colSpan={session.duration} className={`p-2 border-r border-sky/10 ${isC10 ? 'bg-sky/10' : 'bg-orange-100/50'}`}>
                              <div className="h-full min-h-[60px] rounded-2xl p-3 flex flex-col justify-center text-center border-2 border-white/50 shadow-sm">
                                <p className={`text-[9px] font-black ${isC10 ? 'text-[#2FA8CC]' : 'text-orange-600'}`}>STD {session.studentClass}</p>
                                <p className="text-xs font-bold text-[#1F4E79]">{session.subject}</p>
                                {session.isProxy && <span className="text-[7px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black mt-1 mx-auto">PROXY</span>}
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={sIdx} className="p-4 border-r border-sky/10 text-center opacity-10 font-bold italic text-slate-300 text-[10px]">--</td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </main>

      {/* SLOT MANAGER PANEL */}
      <SlotManager faculty={faculty} timeSlots={TIME_SLOTS} />
    </div>
  );
}
