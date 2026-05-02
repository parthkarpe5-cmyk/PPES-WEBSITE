import LoginForm from "../../../../components/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-obsidian flex items-center justify-center p-4 overflow-hidden">
      {/* Reddish/Indigo Glow for Admin to signify high priority */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[120px] animate-pulse-slow" />
      
      <div className="relative z-10 w-full max-w-[440px] bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/20">
             <span className="text-white font-bold text-2xl">A</span>
          </div>
        </div>

        <LoginForm role="admin" idPlaceholder="Admin ID" />
        
        <p className="mt-8 text-center text-xs text-red-500/60 uppercase tracking-widest font-bold">
          Restricted Area
        </p>
      </div>
    </div>
  );
}