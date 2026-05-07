import { getWeeklyTimetable, updateTopicAction } from "../../actions/timetable";

export default async function FacultyDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ name?: string }> 
}) {
  const resolvedParams = await searchParams;
  const facultyName = resolvedParams.name || "Dr.John";
  const allSessions = await getWeeklyTimetable();
  const mySessions = allSessions.filter((s: any) => s.facultyName === facultyName);

  // Helper for dd/mm/yyyy
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#1F4E79]">Weekly Teaching Schedule</h1>
          <p className="text-sky italic">Faculty: Prof. {facultyName}</p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-sky/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1F4E79] text-white text-[11px] uppercase tracking-widest">
                <th className="p-6">Date (DD/MM/YYYY)</th>
                <th className="p-6">Class</th>
                <th className="p-6">Subject</th>
                <th className="p-6">Topic Name</th>
                <th className="p-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky/5">
              {mySessions.map((session: any) => (
                <tr key={session._id.toString()} className="hover:bg-surface/50 transition-colors">
                  <td className="p-6 font-mono text-sm text-[#1F4E79]">{formatDate(session.date)}</td>
                  <td className="p-6">
                    <span className="bg-[#E8F6FA] text-[#2FA8CC] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      Std {session.studentClass}
                    </span>
                  </td>
                  <td className="p-6 font-bold text-[#1F4E79]">{session.subject}</td>
                  <td className="p-6">
                    {/* Inline Form to Edit Topic */}
                    <form action={updateTopicAction} className="flex gap-2">
                      <input type="hidden" name="sessionId" value={session._id} />
                      <input 
                        name="topic" 
                        defaultValue={session.topic} 
                        className="bg-transparent border-b border-sky/20 text-deepBlue py-1 outline-none focus:border-sky text-sm w-full italic" 
                        placeholder="Click to edit topic..."
                      />
                      <button type="submit" className="text-[10px] bg-sky/10 text-sky px-2 py-1 rounded hover:bg-sky hover:text-white transition-all">
                        Update
                      </button>
                    </form>
                  </td>
                  <td className="p-6 text-center">
                    {session.isProxy && <span className="text-[9px] font-bold text-red-500 uppercase">Proxy</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {mySessions.length === 0 && (
            <div className="p-20 text-center text-[#1F4E79]/20 font-bold italic">
              No classes assigned for this week.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}