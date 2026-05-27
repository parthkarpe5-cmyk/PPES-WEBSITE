import { getFacultyTimetableByName, updateTopicAction } from "../../actions/timetable";
import { getSession } from "../../../lib/auth";
import { getMondayOfCurrentWeek } from "../../../lib/utils";
import { redirect } from "next/navigation";

const SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

export default async function FacultyDashboard() {
  const session = await getSession();
  if (!session || session.role !== "faculty") redirect("/login/faculty");

  const mySessions = await getFacultyTimetableByName(session.name);
  const monday = getMondayOfCurrentWeek();

  // 🚀 HELPER: Formats date to YYYY-MM-DD ignoring timezone shift
  const toLocalISO = (dateInput: any) => {
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-4 md:p-10 relative">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black text-[#1F4E79] tracking-tighter uppercase">My Schedule</h1>
          <p className="text-[#2FA8CC] font-bold italic mt-2">Professor: {session.name}</p>
        </div>
        <div className="bg-white px-8 py-3 rounded-2xl shadow-sm border border-sky/10 text-[10px] font-black text-[#FF6B00] uppercase tracking-widest animate-pulse">Sync Active</div>
      </header>

      <main className="max-w-7xl mx-auto bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-sky/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-[#1F4E79] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="p-7 w-48 sticky left-0 bg-[#1F4E79] z-20 border-r border-white/10">Day & Date</th>
                {SLOTS.map(t => <th key={t} className="p-4 text-center border-r border-white/10">{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...Array(7)].map((_, i) => {
                const dayDate = new Date(monday);
                dayDate.setDate(monday.getDate() + i);
                const dayISO = toLocalISO(dayDate);

                return (
                  <tr key={i} className="border-b border-sky/5 hover:bg-surface/30 transition-colors">
                    <td className="p-7 bg-[#F8FAFC] border-r border-sky/10 sticky left-0 z-10 shadow-sm text-[#1F4E79]">
                      <p className="font-black text-sm uppercase">{dayDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                      <p className="text-[10px] font-mono font-bold text-[#2FA8CC]">{dayDate.toLocaleDateString('en-GB')}</p>
                    </td>
                    {SLOTS.map((_, sIdx) => {
                      const classItem = mySessions.find((s: any) => toLocalISO(s.date) === dayISO && s.slotIndex === sIdx);
                      const isMerged = mySessions.find((s: any) => toLocalISO(s.date) === dayISO && s.slotIndex === sIdx - 1 && s.duration === 2);
                      if (isMerged) return null;
                      if (classItem) {
                        const isC10 = classItem.studentClass === '10';
                        return (
                          <td key={sIdx} colSpan={classItem.duration} className="p-2 border-r border-sky/10">
                            <div className={`rounded-3xl p-5 border-2 shadow-sm transition-all hover:scale-[0.98] ${isC10 ? 'border-sky/20 bg-sky/5' : 'border-orange-200 bg-orange-50'}`}>
                              <span className={`text-[9px] font-black uppercase ${isC10 ? 'text-sky' : 'text-orange-500'}`}>Std {classItem.studentClass}</span>
                              <p className="text-sm font-black text-[#1F4E79] mb-4 uppercase tracking-tight leading-tight">{classItem.subject}</p>
                              <form action={updateTopicAction} className="flex flex-col gap-2 border-t border-sky/5 pt-2">
                                <input type="hidden" name="sessionId" value={classItem._id.toString()} />
                                <input name="topic" defaultValue={classItem.topic} placeholder="Topic..." className="w-full text-[10px] border border-sky/10 rounded-xl px-2 py-1 outline-none text-deepBlue" />
                                <button type="submit" className="text-[8px] font-black text-sky uppercase hover:text-[#1F4E79] text-right">Save</button>
                              </form>
                            </div>
                          </td>
                        );
                      }
                      return <td key={sIdx} className="p-4 border-r border-sky/10 text-center opacity-5 font-black text-[10px]">--</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}