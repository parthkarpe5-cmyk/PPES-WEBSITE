"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFacultyList, getWeeklyTimetable, upsertSlotAction } from "../../../actions/timetable";
import { getMondayOfCurrentWeek } from "../../../../lib/utils";

const TIME_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

export default function AdminTimetablePage() {
  const [faculty, setFaculty] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 🚀 HELPER: Formats date to YYYY-MM-DD ignoring timezone shift
  const toLocalISO = (dateInput: any) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const refreshGrid = async () => {
    const fData = await getFacultyList();
    const sData = await getWeeklyTimetable();
    setFaculty(fData);
    setSessions(sData);
  };

  useEffect(() => { refreshGrid(); }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg("Updating...");
    const result = await upsertSlotAction(new FormData(e.currentTarget));
    if (result.success) {
      await refreshGrid();
      setMsg("✅ Updated!");
      setTimeout(() => setMsg(""), 3000);
    }
    setLoading(false);
  };

  const monday = getMondayOfCurrentWeek();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'long' }),
      formatted: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`,
      iso: toLocalISO(d) 
    };
  });

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-4 md:p-10 pb-40 relative font-sans">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-black text-[#1F4E79] tracking-tighter uppercase italic">Master Grid</h1>
        <p className="text-[#2FA8CC] font-bold text-xs tracking-widest mt-2">ADMINISTRATION CONSOLE</p>
      </header>

      <main className="max-w-7xl mx-auto space-y-20">
        {weekDays.map((day) => (
          <div key={day.iso} className="flex flex-col gap-6">
            <div className="flex items-center gap-4 ml-6">
              <div className="bg-[#1F4E79] text-white px-8 py-2 rounded-full font-black text-[10px] uppercase shadow-lg">{day.name}</div>
              <span className="text-[#1F4E79]/30 font-mono font-bold tracking-widest">{day.formatted}</span>
            </div>

            <div className="overflow-x-auto bg-white rounded-[3.5rem] shadow-2xl border border-sky/10">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-sky/10">
                    <th className="p-7 text-[#1F4E79] font-black uppercase text-[10px] w-52 border-r border-sky/10 sticky left-0 bg-[#F8FAFC] z-20">Faculty Name</th>
                    {TIME_SLOTS.map(t => <th key={t} className="p-4 text-center border-r border-sky/10 text-[10px] text-[#2FA8CC] font-black">{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((f: any) => (
                    <tr key={f._id} className="border-b border-sky/5 hover:bg-surface/40 transition-colors group">
                      <td className="p-7 font-bold text-[#1F4E79] border-r border-sky/10 bg-white sticky left-0 shadow-sm z-10">{f.name}</td>
                      {TIME_SLOTS.map((_, sIdx) => {
                        const session = sessions.find((s: any) => toLocalISO(s.date) === day.iso && s.facultyName === f.name && s.slotIndex === sIdx);
                        const merged = sessions.find((s: any) => toLocalISO(s.date) === day.iso && s.facultyName === f.name && s.slotIndex === sIdx - 1 && s.duration === 2);
                        if (merged) return null;
                        if (session) {
                          const isC10 = session.studentClass === '10';
                          return (
                            <td key={sIdx} colSpan={session.duration} className={`p-2 border-r border-sky/10 ${isC10 ? 'bg-[#2FA8CC]/10' : 'bg-[#FF6B00]/10'}`}>
                              <div className="h-full min-h-[75px] rounded-[1.8rem] p-3 flex flex-col justify-center text-center border-2 border-white shadow-sm transition-all hover:scale-95">
                                 <p className={`text-[9px] font-black ${isC10 ? 'text-[#2FA8CC]' : 'text-[#FF6B00]'}`}>STD {session.studentClass}</p>
                                 <p className="text-[11px] font-black text-[#1F4E79] truncate uppercase">{session.subject}</p>
                              </div>
                            </td>
                          );
                        }
                        return <td key={sIdx} className="p-4 border-r border-sky/10 text-center opacity-10 font-black text-[10px] text-slate-300 italic group-hover:opacity-30">--</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </main>

      <motion.div drag dragMomentum={false} className="fixed bottom-10 right-10 z-50 cursor-grab active:cursor-grabbing">
        <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border-4 border-[#2FA8CC]/30 w-[340px]">
          <h3 className="text-xl font-black text-[#1F4E79] tracking-tighter uppercase mb-6 flex justify-between items-center">
            Slot Manager <span className="text-[10px] text-[#2FA8CC]">DRAG</span>
          </h3>
          {msg && <div className="mb-4 text-center text-[10px] font-black uppercase p-3 rounded-xl bg-[#E8F6FA] text-[#1F4E79] border border-sky/10">{msg}</div>}
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
             <select name="facultyName" required className="w-full h-12 bg-[#E8F6FA]/50 border border-sky/10 rounded-xl px-4 text-xs font-bold text-[#1F4E79]">
                <option value="">Select Faculty</option>
                {faculty.map((f:any) => <option key={f._id} value={f.name}>{f.name}</option>)}
             </select>
             <div className="grid grid-cols-2 gap-2">
               <input name="date" type="date" required className="h-12 bg-[#E8F6FA]/50 border border-sky/10 rounded-xl px-3 text-[10px]" />
               <select name="slotIndex" className="h-12 bg-[#E8F6FA]/50 border border-sky/10 rounded-xl px-3 text-[10px] font-bold">
                  {TIME_SLOTS.map((t, i) => <option key={i} value={i}>{t}</option>)}
               </select>
             </div>
             <div className="grid grid-cols-2 gap-2">
               <select name="studentClass" className="h-12 bg-[#E8F6FA]/50 border border-sky/10 rounded-xl px-3 text-[10px] font-black text-sky"><option value="10">Std 10</option><option value="09">Std 09</option></select>
               <select name="duration" className="h-12 bg-[#E8F6FA]/50 border border-sky/10 rounded-xl px-3 text-[10px] font-black text-[#FF6B00]"><option value="1">1 Hr</option><option value="2">2 Hr Merge</option></select>
             </div>
             <input name="subject" placeholder="Subject Name" required className="h-12 bg-[#E8F6FA]/50 border border-sky/10 rounded-xl px-4 text-xs font-bold" />
             <button type="submit" disabled={loading} className="w-full h-16 bg-[#2FA8CC] text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 text-xs tracking-widest uppercase">
                {loading ? "Saving..." : "Update Grid"}
             </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}