"use client";

export default function LoginForm({ role, idPlaceholder }: { role: string, idPlaceholder: string }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header with Badge */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-saffron/10 text-saffron px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-saffron/20">
          • System Online •
        </div>
        <h2 className="text-4xl font-bold text-deepBlue mb-2">Welcome Back</h2>
        <p className="text-sky font-medium italic">Scholar Portal Authentication</p>
      </div>

      {/* 2. The Inputs Section (Spaced Out) */}
      <form className="w-full flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-bold text-deepBlue/50 uppercase tracking-widest ml-2">
            {idPlaceholder} Identifier
          </label>
          <input 
            type="text" 
            placeholder={`Enter your ${idPlaceholder}`}
            className="w-full h-16 bg-white border-2 border-sky/20 rounded-[1.25rem] px-6 text-deepBlue focus:border-sky outline-none transition-all shadow-sm text-lg"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-bold text-deepBlue/50 uppercase tracking-widest ml-2">
            Security Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full h-16 bg-white border-2 border-sky/20 rounded-[1.25rem] px-6 text-deepBlue focus:border-sky outline-none transition-all shadow-sm text-lg"
          />
        </div>

        <button className="w-full h-20 bg-sky hover:bg-deepBlue text-white font-black rounded-[1.25rem] shadow-2xl shadow-sky/30 transition-all active:scale-[0.97] mt-4 text-xl uppercase tracking-wider">
          Join Learning Portal
        </button>
      </form>

      {/* 3. Footer Link (Saffron) */}
      {/* Inside LoginForm.tsx footer section:*/}
{role === 'student' && (
  <div className="text-center mt-6 flex flex-col gap-2">
    <a href="/register" className="text-sky font-bold text-xs uppercase tracking-widest hover:underline">
       No Account? Register Here →
    </a>
    <a href="/setup-password" className="text-saffron font-bold text-[10px] uppercase tracking-widest hover:underline">
       Already registered? Activate account
    </a>
  </div>
)}
    </div>
  );
}