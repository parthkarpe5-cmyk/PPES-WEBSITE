"use client";
import { useState } from "react";
import { acceptClassAction } from "../../app/actions/faculty";

export default function AcceptForm({ sessionId }: { sessionId: string }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    await acceptClassAction(sessionId, msg);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-4 bg-[#E8F6FA]/50 p-6 rounded-2xl border border-sky/10">
      <p className="text-[10px] font-black text-deepBlue/40 uppercase tracking-widest">Broadcast Message to Students</p>
      <textarea 
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="e.g. Please read Chapter 3 before joining..."
        className="w-full h-24 bg-white rounded-xl p-4 text-sm text-deepBlue outline-none focus:border-sky border-2 border-transparent transition-all"
      />
      <button 
        onClick={handleAccept}
        disabled={loading}
        className="w-full h-14 bg-saffron hover:bg-deepBlue text-white font-bold rounded-xl shadow-lg transition-all"
      >
        {loading ? "SAVING..." : "ACCEPT & NOTIFY CLASS"}
      </button>
    </div>
  );
}