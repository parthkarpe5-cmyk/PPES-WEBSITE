"use client";

import { useState } from "react";
import { sendOtpAction, completeSetupAction } from "../../actions/setup";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SetupPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  const handleSendOtp = async () => {
    setLoading(true);
    const res = await sendOtpAction(email);
    setLoading(false);
    if (res.success) {
      setStep(2);
      setMessage({ type: "success", text: "OTP sent to your email!" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to send OTP" });
    }
  };
  const handleComplete = async (formData: FormData) => {
    setLoading(true);
    const res = await completeSetupAction(formData);
    setLoading(false);
    if (res && 'success' in res && res.success) {
      router.push('/login/student');
    } else {
      setMessage({ type: "error", text: res?.error || "Activation failed" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#E8F6FA] dark:bg-[#050810] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle Positioned Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sky/5 dark:bg-sky/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-saffron/5 dark:bg-saffron/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[450px] bg-white dark:bg-[#090d16]/80 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl border-t-8 border-t-sky flex flex-col items-center transition-all duration-300">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Account Setup</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8 italic">Verification required for first-time login</p>

        {message.text && (
          <div className={`w-full mb-6 p-3 rounded-xl text-center text-xs font-bold ${
            message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
          }`}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                Registered Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your college email" 
                className="w-full h-14 bg-white/50 dark:bg-white/[0.02] border-2 border-slate-200 dark:border-white/5 rounded-2xl px-5 text-slate-900 dark:text-white focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] outline-none transition-all focus:ring-2 focus:ring-[#2FA8CC]/20" 
              />
            </div>
            <button 
              onClick={handleSendOtp} 
              disabled={loading} 
              className="w-full h-16 bg-sky hover:bg-[#1F4E79] dark:hover:bg-sky/90 text-white font-bold rounded-2xl shadow-lg shadow-sky/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending..." : "Receive OTP"}
            </button>
          </div>
        ) : (
          <form action={handleComplete} className="w-full flex flex-col gap-6">
             <input type="hidden" name="email" value={email} />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">OTP Code</label>
              <input 
                name="otp" 
                required 
                type="text" 
                placeholder="6-digit code" 
                className="w-full h-14 bg-white/50 dark:bg-white/[0.02] border-2 border-slate-200 dark:border-white/5 rounded-2xl px-5 text-slate-900 dark:text-white text-center text-2xl tracking-[0.5em] focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] outline-none focus:ring-2 focus:ring-[#2FA8CC]/20" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Create Password</label>
              <input 
                name="password" 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full h-14 bg-white/50 dark:bg-white/[0.02] border-2 border-slate-200 dark:border-white/5 rounded-2xl px-5 text-slate-900 dark:text-white focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] outline-none focus:ring-2 focus:ring-[#2FA8CC]/20" 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full h-16 bg-saffron hover:bg-[#1F4E79] dark:hover:bg-saffron/90 text-white font-bold rounded-2xl shadow-lg shadow-saffron/20 transition-all cursor-pointer"
            >
              {loading ? "Activating..." : "Set Password & Activate"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}