import { getAllCourses } from "../../../actions/courseActions";

export default async function StudentCourses() {
  const courses = await getAllCourses();

  return (
    <div className="min-h-screen bg-[#E8F6FA] p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-black text-[#1F4E79] tracking-tight">Academic Catalog</h1>
        <p className="text-[#2FA8CC] font-medium italic mt-2">Explore courses designed for your academic excellence</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {courses.map((course: any) => (
          <div key={course._id} className="bg-white rounded-[3.5rem] p-10 shadow-2xl flex flex-col border-b-[12px] border-b-[#2FA8CC] relative group hover:-translate-y-2 transition-all duration-300">
            
            {/* Target Class Badge */}
            <div className="absolute top-8 right-8 bg-[#1F4E79] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              Std {course.targetClass}
            </div>

            <div className="text-4xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-[#1F4E79] mb-3 leading-tight">{course.title}</h2>
            <p className="text-[#2FA8CC] text-sm italic mb-8 line-clamp-2">{course.description || "Comprehensive curriculum designed for scholar growth."}</p>
            
            <div className="space-y-3 flex-grow">
               <p className="text-[10px] font-black text-[#1F4E79]/30 uppercase tracking-[0.2em] mb-4">Curriculum Path:</p>
               {course.subjects?.map((sub: any) => (
                 <div key={sub._id} className="flex items-center justify-between bg-[#E8F6FA]/50 p-4 rounded-2xl border border-[#2FA8CC]/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1F4E79]">{sub.title}</span>
                      <span className="text-[10px] text-[#2FA8CC] italic">{sub.courseName}</span>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-[#1F4E79]/40 uppercase tracking-widest">Faculty</p>
                       <p className="text-[10px] font-bold text-[#1F4E79]">{sub.facultyName || 'Awaiting Allocation'}</p>
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full mt-10 h-16 bg-[#E8F6FA] text-[#1F4E79] font-black rounded-2xl border-2 border-[#2FA8CC]/10 group-hover:bg-[#1F4E79] group-hover:text-white group-hover:border-transparent transition-all uppercase text-xs tracking-widest shadow-sm">
               View Course Modules
            </button>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="max-w-md mx-auto text-center p-20 glass-card rounded-[4rem]">
          <p className="text-[#1F4E79]/20 font-black text-xl italic uppercase">No Courses Available</p>
        </div>
      )}
    </div>
  );
}