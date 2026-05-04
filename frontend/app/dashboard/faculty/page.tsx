import { getFacultySessions } from "../../actions/faculty";
import AcceptForm from "../../../components/faculty/AcceptForm";

export default async function FacultyDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ name?: string }> 
}) {
  const resolvedParams = await searchParams;
  const facultyName = resolvedParams.name || "Dr.John"; // Default for testing
  const sessions = await getFacultySessions(facultyName);

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-8">
      <header className="max-w-5xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#1F4E79]">Faculty Dashboard</h1>
          <p className="text-[#2FA8CC] font-medium italic">Welcome, Prof. {facultyName}</p>
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-sky/10 text-[10px] font-black text-saffron uppercase tracking-widest animate-pulse">
           Live Console
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 gap-8">
        {sessions.length > 0 ? (
          sessions.map((session: any) => (
            <div key={session._id.toString()} className="bg-white rounded-[3rem] p-10 shadow-xl border-l-[12px] border-l-sky flex flex-col md:flex-row gap-10">
              
              {/* Left Side: Session Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#E8F6FA] text-[#2FA8CC] px-4 py-1 rounded-full text-[10px] font-black uppercase">Class {session.studentClass}th</span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${session.status === 'pending' ? 'bg-saffron/10 text-saffron' : 'bg-green-100 text-green-600'}`}>
                    {session.status}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-deepBlue mb-2">{session.subject}</h2>
                <p className="text-sky font-semibold">Topic: {session.topic}</p>
                
                <div className="mt-6 flex gap-6">
                   <div className="text-left">
                      <p className="text-[9px] font-bold text-deepBlue/30 uppercase">Date</p>
                      <p className="text-deepBlue font-bold">{new Date(session.date).toLocaleDateString()}</p>
                   </div>
                   <div className="text-left">
                      <p className="text-[9px] font-bold text-deepBlue/30 uppercase">Time</p>
                      <p className="text-deepBlue font-bold">{session.startTime}</p>
                   </div>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-sky/10 md:pl-10">
                {session.status === "pending" ? (
                  <AcceptForm sessionId={session._id.toString()} />
                ) : (
                  <div className="h-full flex flex-col justify-center gap-4">
                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                       <p className="text-green-700 font-bold text-sm">✓ Session Confirmed</p>
                       <p className="text-green-600/60 text-xs mt-2 italic">Students have been notified of your schedule.</p>
                    </div>
                    {session.scheduledMessage && (
                      <div className="p-4 border-2 border-dashed border-sky/20 rounded-2xl">
                         <p className="text-[9px] font-bold text-sky uppercase mb-1">Your Message:</p>
                         <p className="text-deepBlue text-sm italic">"{session.scheduledMessage}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-20 glass-card rounded-[4rem]">
            <p className="text-deepBlue/20 font-bold text-xl italic">No lecture invitations found for your name.</p>
          </div>
        )}
      </main>
    </div>
  );
}