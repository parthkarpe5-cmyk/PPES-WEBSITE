"use client";

import { useState } from "react";
import { loginAction } from "../../app/actions/auth";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";

export default function LoginForm({ role, idPlaceholder }: { role: string, idPlaceholder: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData, role);

    if (result.success) {
      if (role === 'student') {
        setEmailSent(true);
        setTimeout(() => router.push("/student"), 3000);
      } else {
        router.push(role === 'admin' ? "/admin" : "/faculty");
      }
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500/20">
          <MailCheck size={48} className="text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-deepBlue mb-4 tracking-tight">Email Confirmed!</h2>
        <p className="text-sky font-medium max-w-[280px]">We have sent your <span className="font-bold text-deepBlue">USN Information</span> to your registered email address.</p>
        <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
           <Loader2 className="animate-spin" size={14} />
           Redirecting to Portal...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-saffron/10 text-saffron px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-saffron/20">
          • System Online •
        </div>
        <h2 className="text-4xl font-bold text-deepBlue mb-2">Welcome Back</h2>
        <p className="text-sky font-medium italic">Scholar Portal Authentication</p>
      </div>

      <form className="w-full flex flex-col gap-8" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-bold text-deepBlue/50 uppercase tracking-widest ml-2">
            {idPlaceholder} Identifier
          </label>
          <input 
            name="identifier"
            type="text" 
            required
            placeholder={`Enter your ${idPlaceholder}`}
            className="w-full h-16 bg-white border-2 border-sky/20 rounded-[1.25rem] px-6 text-deepBlue focus:border-sky outline-none transition-all shadow-sm text-lg"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-bold text-deepBlue/50 uppercase tracking-widest ml-2">
            Security Password
          </label>
          <input 
            name="password"
            type="password" 
            placeholder="••••••••"
            className="w-full h-16 bg-white border-2 border-sky/20 rounded-[1.25rem] px-6 text-deepBlue focus:border-sky outline-none transition-all shadow-sm text-lg"
          />
        </div>

        <button 
          disabled={loading}
          className="w-full h-20 bg-sky hover:bg-deepBlue text-white font-black rounded-[1.25rem] shadow-2xl shadow-sky/30 transition-all active:scale-[0.97] mt-4 text-xl uppercase tracking-wider flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            "Join Learning Portal"
          )}
        </button>
      </form>

      {role === 'student' && (
        <div className="text-center mt-8 flex flex-col gap-3">
          <a href="/register" className="text-sky font-bold text-[10px] uppercase tracking-widest hover:underline">
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