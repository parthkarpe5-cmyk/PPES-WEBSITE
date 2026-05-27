"use client";

import { useState } from "react";
import { registerStudentAction, completeSetupAction } from "../../actions/setup";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP/Password, 3: Success
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(formData: FormData) {
    setLoading(true);
    setError("");
    setEmail(formData.get("email") as string);
    const result = await registerStudentAction(formData);
    setLoading(false);
    if (result && 'success' in result && result.success) setStep(2);
    else setError(result?.error || "Registration failed.");
  }

  async function handleActivate(formData: FormData) {
    setLoading(true);
    setError("");
    formData.append("email", email);
    const result = await completeSetupAction(formData);
    setLoading(false);
    if (result && 'success' in result && result.success) setStep(3);
    else setError(result?.error || "Activation failed.");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E8F6FA] dark:bg-[#050810] p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle Positioned Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sky/5 dark:bg-sky/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-saffron/5 dark:bg-saffron/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[500px] bg-white dark:bg-[#090d16]/80 backdrop-blur-xl border border-slate-100  rounded-[3rem] p-10 md:p-14 shadow-2xl border-t-8 border-t-[#2FA8CC] flex flex-col items-center transition-all duration-300">
        
        {/* Step-based Icons */}
        <div className="absolute -top-12 bg-[#C9A227] w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-[8px] border-[#E8F6FA] dark:border-[#050810] text-white transition-all duration-300">
          {step === 1 ? "📝" : step === 2 ? "🔑" : "🎉"}
        </div>

        {step === 1 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold text-foreground mt-6 mb-2">Student Registration</h1>
            <p className="text-sky dark:text-sky/80 text-sm italic mb-10">Start your journey at Prarambha Path</p>
            {error && <p className="text-red-500 bg-red-500/10 border border-red-500/20 w-full p-4 rounded-2xl text-xs font-bold mb-6 text-center">{error}</p>}
            <form action={handleRegister} className="w-full flex flex-col gap-6">
              <input name="name" required placeholder="Full Name" className="w-full h-16 bg-white/50  border-2 border-slate-200  rounded-2xl px-6 text-foreground outline-none focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] focus:ring-2 focus:ring-[#2FA8CC]/20" />
              <input name="email" required type="email" placeholder="Email Address" className="w-full h-16 bg-white/50  border-2 border-slate-200  rounded-2xl px-6 text-foreground outline-none focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] focus:ring-2 focus:ring-[#2FA8CC]/20" />
              <select name="class" required className="w-full h-16 bg-white/50  border-2 border-slate-200  rounded-2xl px-6 text-foreground font-bold outline-none focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] focus:ring-2 focus:ring-[#2FA8CC]/20">
                <option value="09" className="dark:bg-slate-900 text-foreground">Class 9th (Goa)</option>
                <option value="10" className="dark:bg-slate-900 text-foreground">Class 10th (Goa)</option>
              </select>
              <button disabled={loading} className="w-full h-20 bg-[#2FA8CC] hover:bg-[#1F4E79] dark:hover:bg-[#2FA8CC]/90 text-white font-black rounded-2xl mt-4 shadow-xl shadow-[#2FA8CC]/20 transition-all cursor-pointer">
                {loading ? "GENERATING USN..." : "REGISTER & GET OTP"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-foreground mt-6 mb-2">Verify Account</h1>
            <p className="text-sky dark:text-sky/80 text-sm italic mb-8">Check email for your PPG26S ID and OTP</p>
            <form action={handleActivate} className="w-full flex flex-col gap-6">
              <input name="otp" required placeholder="0 0 0 0 0 0" className="w-full h-16 bg-white/50  border-2 border-slate-200  rounded-2xl text-center text-3xl tracking-[0.5em] text-foreground outline-none focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] focus:ring-2 focus:ring-[#2FA8CC]/20" />
              <input name="password" required type="password" placeholder="Create Password" className="w-full h-16 bg-white/50  border-2 border-slate-200  rounded-2xl px-6 text-foreground outline-none focus:border-[#2FA8CC] dark:focus:border-[#2FA8CC] focus:ring-2 focus:ring-[#2FA8CC]/20" />
              <button disabled={loading} className="w-full h-20 bg-[#FF6B00] hover:bg-[#1F4E79] dark:hover:bg-[#FF6B00]/90 text-white font-black rounded-2xl shadow-xl transition-all cursor-pointer">
                {loading ? "ACTIVATING..." : "FINALIZE ACTIVATION"}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center text-center py-6">
            <h1 className="text-3xl font-bold text-foreground mb-4">Registration Complete!</h1>
            <p className="text-sky dark:text-sky/80 font-medium leading-relaxed mb-8">
              We have sent a final email to <span className="text-foreground font-bold">{email}</span> containing your <span className="font-bold">USN</span> and <span className="font-bold">Password</span>.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] w-full mb-8">
               <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Account Status</p>
               <p className="text-emerald-400 text-sm mt-1 font-medium italic">Verified & Active</p>
            </div>
            <button onClick={() => router.push("/login/student")} className="w-full h-16 bg-[#1F4E79] dark:bg-sky text-white font-bold rounded-2xl shadow-2xl cursor-pointer hover:bg-sky transition-all">
              GO TO LOGIN PORTAL
            </button>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-100  w-full text-center">
            <a href="/login/student" className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-[#2FA8CC] transition-colors">Back to Login</a>
        </div>
      </div>
    </div>
  );
}