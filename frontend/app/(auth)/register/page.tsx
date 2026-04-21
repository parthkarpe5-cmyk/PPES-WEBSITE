"use client";

import { useState } from "react";
import { registerStudentAction, completeSetupAction } from "../../actions/setup";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP & Password
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // This function was missing, which caused your error
  async function handleRegister(formData: FormData) {
    setLoading(true);
    setError("");
    
    // Store email for the next step
    const emailInput = formData.get("email") as string;
    setEmail(emailInput);

    const result = await registerStudentAction(formData);
    setLoading(false);

    if (result?.success) {
      setStep(2); // Move to OTP step
    } else {
      setError(result?.error || "Registration failed. Please try again.");
    }
  }

  // Final step to set password
  async function handleCompleteSetup(formData: FormData) {
    setLoading(true);
    const result = await completeSetupAction(formData);
    setLoading(false);

    if (result?.success) {
      router.push("/login/student"); // Redirect to login on success
    } else {
      setError(result?.error || "Activation failed.");
    }
  }

  return (
    <div className="min-h-screen w-full bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border-t-8 border-t-sky flex flex-col items-center">
        
        {/* Scholar Icon */}
        <div className="absolute -top-10 bg-prestige w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-[6px] border-surface">
          {step === 1 ? "📝" : "🔑"}
        </div>

        <h1 className="text-3xl font-bold text-deepBlue mt-4 mb-2">
          {step === 1 ? "Student Registration" : "Verify Account"}
        </h1>
        <p className="text-sky text-sm mb-8 italic text-center">
          {step === 1 ? "Start your journey at Prarambha Path" : "Enter the code sent to your email"}
        </p>

        {error && (
          <div className="w-full bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form action={handleRegister} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-deepBlue/40 uppercase tracking-widest ml-2">Full Name</label>
              <input name="name" required type="text" placeholder="Enter full name" className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-deepBlue outline-none focus:border-sky transition-all" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-deepBlue/40 uppercase tracking-widest ml-2">Email Address</label>
              <input name="email" required type="email" placeholder="example@gmail.com" className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-deepBlue outline-none focus:border-sky transition-all" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-deepBlue/40 uppercase tracking-widest ml-2">Select Class</label>
              <select name="class" required className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-deepBlue outline-none focus:border-sky font-bold cursor-pointer">
                <option value="09">Class 9th (Goa)</option>
                <option value="10">Class 10th (Goa)</option>
              </select>
            </div>

            <button disabled={loading} className="w-full h-16 bg-sky text-white font-bold rounded-2xl mt-4 shadow-xl hover:bg-deepBlue transition-all active:scale-95 disabled:opacity-50">
              {loading ? "Generating USN..." : "Register & Get OTP"}
            </button>
          </form>
        ) : (
          <form action={handleCompleteSetup} className="w-full flex flex-col gap-5">
             <input type="hidden" name="email" value={email} />
             
             <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-[11px] font-bold text-center border border-green-100">
                USN generated! Check email for verification code.
             </div>

             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-deepBlue/40 uppercase tracking-widest ml-2">OTP Code</label>
                <input name="otp" required type="text" placeholder="6-digit code" className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-center text-2xl tracking-[0.5em] text-deepBlue outline-none focus:border-sky" />
             </div>

             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-deepBlue/40 uppercase tracking-widest ml-2">New Password</label>
                <input name="password" required type="password" placeholder="••••••••" className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-deepBlue outline-none focus:border-sky" />
             </div>

             <button disabled={loading} className="w-full h-16 bg-saffron text-white font-bold rounded-2xl mt-2 shadow-xl hover:bg-deepBlue transition-all active:scale-95 disabled:opacity-50">
                {loading ? "Activating..." : "Complete Setup"}
             </button>
          </form>
        )}

        <div className="mt-8 text-center">
            <a href="/login/student" className="text-deepBlue/40 text-[10px] font-bold uppercase tracking-widest hover:text-sky transition-colors">
                Back to Login
            </a>
        </div>
      </div>
    </div>
  );
}