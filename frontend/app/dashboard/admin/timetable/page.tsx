import { assignClassAction } from "../../../actions/timetable";

export default function AdminTimetable() {
  return (
    <div className="min-h-screen bg-[#E8F6FA] p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-[#1F4E79] tracking-tight text-center">Master Timetable</h1>
      </header>

      <main className="max-w-7xl mx-auto space-y-16">
        {weekDates.map((day) => (
          <div key={day.iso} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 ml-4">
              <span className="bg-[#1F4E79] text-white px-6 py-2 rounded-full font-bold shadow-lg">{day.dayName}</span>
              <span className="text-[#1F4E79]/40 font-mono font-bold text-sm">{day.formatted}</span>
            </div>

        {/* The Form - Ensure action is linked correctly */}
        <form action={assignClassAction} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* Faculty Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1F4E79]/50 uppercase tracking-widest ml-2">Faculty Name</label>
            <input 
              name="facultyName" 
              required 
              type="text"
              placeholder="e.g. Dr. Aris" 
              className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#2FA8CC] transition-all" 
            />
          </div>

          {/* Student Class Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1F4E79]/50 uppercase tracking-widest ml-2">Target Class</label>
            <select 
              name="studentClass" 
              required 
              className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] font-bold outline-none focus:border-[#2FA8CC] cursor-pointer"
            >
              <option value="09">Class 9th (Goa)</option>
              <option value="10">Class 10th (Goa)</option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1F4E79]/50 uppercase tracking-widest ml-2">Subject</label>
            <input 
              name="subject" 
              required 
              type="text"
              placeholder="e.g. Mathematics" 
              className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#2FA8CC] transition-all" 
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1F4E79]/50 uppercase tracking-widest ml-2">Date</label>
            <input 
              name="date" 
              required 
              type="date" 
              className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#2FA8CC]" 
            />
          </div>

          {/* Topic - Spans full width */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1F4E79]/50 uppercase tracking-widest ml-2">Lecture Topic</label>
            <input 
              name="topic" 
              required 
              type="text"
              placeholder="e.g. Introduction to Trigonometry" 
              className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#2FA8CC] transition-all" 
            />
          </div>

          {/* Start Time */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1F4E79]/50 uppercase tracking-widest ml-2">Start Time</label>
            <input 
              name="startTime" 
              required 
              type="time" 
              className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#2FA8CC]" 
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full h-14 bg-[#2FA8CC] hover:bg-[#1F4E79] text-white font-black rounded-2xl shadow-xl shadow-[#2FA8CC]/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
              Initiate Allocation
            </button>
          </div>

        </form>

        <div className="mt-10 pt-6 border-t border-[#E8F6FA] w-full text-center">
          <p className="text-[#1F4E79]/30 text-[9px] font-black uppercase tracking-[0.5em]">Prarambha Path • Timetable Module</p>
        </div>
      </div>
    </div>
  );
}
