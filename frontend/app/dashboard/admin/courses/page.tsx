import { 
  createSubjectAction, 
  createCourseAction, 
  getFacultyForDropdown, 
  getSubjectsForDropdown 
} from "../../../actions/courseActions";

export default async function AdminCourseManager() {
  const faculty = await getFacultyForDropdown();
  const subjects = await getSubjectsForDropdown();

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-6 md:p-10 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#2FA8CC]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#FF6B00]/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-black text-[#1F4E79] tracking-tight">Course Architecture</h1>
        <p className="text-[#2FA8CC] text-lg font-medium italic mt-2">Manage subjects and academic templates</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* STEP 1: SUBJECT DEFINITION */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-2xl border-t-[12px] border-t-[#2FA8CC] relative">
          <div className="absolute -top-8 left-12 bg-[#2FA8CC] text-white w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-xl border-[6px] border-[#E8F6FA]">📚</div>
          <h2 className="text-2xl font-bold text-[#1F4E79] mb-8 mt-4 uppercase tracking-tighter">1. Add New Subject</h2>

          <form action={createSubjectAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1F4E79]/40 uppercase tracking-widest ml-2">Subject Title</label>
              <input name="title" required placeholder="e.g. Mathematics" className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#2FA8CC] transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1F4E79]/40 uppercase tracking-widest ml-2">Respective Course Name</label>
              <input name="courseName" required placeholder="e.g. Bridge Course" className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#2FA8CC] transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1F4E79]/40 uppercase tracking-widest ml-2">Assigned Faculty</label>
              <select name="facultyId" required className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#2FA8CC]/10 rounded-2xl px-5 text-[#1F4E79] font-bold outline-none focus:border-[#2FA8CC]">
                <option value="">Select Faculty...</option>
                {faculty.map((f: any) => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full h-16 bg-[#2FA8CC] hover:bg-[#1F4E79] text-white font-black rounded-2xl mt-4 shadow-xl transition-all uppercase text-xs tracking-widest">Create Subject</button>
          </form>
        </div>

        {/* STEP 2: COURSE DESIGN */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-2xl border-t-[12px] border-t-[#FF6B00] relative">
          <div className="absolute -top-8 left-12 bg-[#FF6B00] text-white w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-xl border-[6px] border-[#E8F6FA]">📋</div>
          <h2 className="text-2xl font-bold text-[#1F4E79] mb-8 mt-4 uppercase tracking-tighter">2. Design Template</h2>

          <form action={createCourseAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-bold text-[#1F4E79]/40 uppercase tracking-widest ml-2">Course Title</label>
               <input name="title" required placeholder="e.g. Academic Foundation" className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#FF6B00]/10 rounded-2xl px-5 text-[#1F4E79] outline-none focus:border-[#FF6B00] transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1F4E79]/40 uppercase tracking-widest ml-2">Target Academic Class</label>
              <select name="targetClass" required className="w-full h-14 bg-[#E8F6FA]/30 border-2 border-[#FF6B00]/10 rounded-2xl px-5 text-[#1F4E79] font-bold outline-none focus:border-[#FF6B00]">
                <option value="">Select Class...</option>
                <option value="09">Class 9th Only</option>
                <option value="10">Class 10th Only</option>
                <option value="Both">Both (General)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1F4E79]/40 uppercase tracking-widest ml-2">Select Included Subjects</label>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-4 bg-[#E8F6FA]/50 rounded-2xl border-2 border-[#FF6B00]/5 shadow-inner">
                {subjects.map((s: any) => (
                  <label key={s._id} className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:border-[#FF6B00]/20 border border-transparent transition-all">
                    <input type="checkbox" name="subjectIds" value={s._id} className="w-4 h-4 accent-[#FF6B00]" />
                    <span className="text-[11px] font-bold text-[#1F4E79]">{s.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full h-16 bg-[#FF6B00] hover:bg-[#1F4E79] text-white font-black rounded-2xl mt-4 shadow-xl transition-all uppercase text-xs tracking-widest">Publish Course</button>
          </form>
        </div>
      </main>
    </div>
  );
}