import Link from "next/link";

export default function LandingPage() {
  const roles = [
    { name: 'Student', path: '/login/student', icon: '🎓', color: 'bg-sky' },
    { name: 'Faculty', path: '/login/faculty', icon: '👨‍🏫', color: 'bg-deepBlue' },
    { name: 'Admin', path: '/login/admin', icon: '🔐', color: 'bg-slate-700' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      {/* Header with Shimmer */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-space font-bold text-deepBlue mb-4">
          Prarambha <span className="text-sky font-light">Path</span>
        </h1>
        <p className="shimmer-text text-xl font-bold tracking-widest italic">THE SCHOLAR'S FOCUS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {roles.map((role) => (
          <Link key={role.name} href={role.path} className="group">
            <div className="bg-white/70 backdrop-blur-md border-2 border-sky/10 p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:border-sky transition-all duration-300 text-center relative overflow-hidden">
              <div className={`${role.color} w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {role.icon}
              </div>
              <h2 className="text-2xl font-space font-bold text-deepBlue mb-2">{role.name}</h2>
              <p className="text-sky/70 text-sm">Access your academic portal</p>
              
              {/* Subtle accent line */}
              <div className={`absolute bottom-0 left-0 h-2 w-full ${role.color} opacity-20`}></div>
            </div>
          </Link>
        ))}
      </div>
      
      <p className="mt-20 text-deepBlue/30 font-bold tracking-tighter uppercase">Knowledge • Growth • Success</p>
    </div>
  );
}