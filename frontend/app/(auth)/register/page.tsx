"use client";

import { useState } from "react";
import { registerStudentAction, completeSetupAction } from "../../actions/setup";
import { useRouter } from "next/navigation";

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
    if (result?.success) setStep(2);
    else setError(result?.error || "Registration failed.");
  }

  async function handleActivate(formData: FormData) {
    setLoading(true);
    setError("");
    formData.append("email", email);
    const result = await completeSetupAction(formData);
    setLoading(false);
    if (result?.success) setStep(3);
    else setError(result?.error || "Activation failed.");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E8F6FA] p-6 relative">
      <div className="relative z-10 w-full max-w-[500px] bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl border-t-8 border-t-[#2FA8CC] flex flex-col items-center">
        
        {/* Step-based Icons */}
        <div className="absolute -top-12 bg-[#C9A227] w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-[8px] border-[#E8F6FA] text-white">
          {step === 1 ? "📝" : step === 2 ? "🔑" : "🎉"}
        </div>

        {step === 1 && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#1F4E79] mt-6 mb-2">Student Registration</h1>
            <p className="text-[#2FA8CC] text-sm italic mb-10">Start your journey at Prarambha Path</p>
            {error && <p className="text-red-500 bg-red-50 w-full p-4 rounded-2xl text-xs font-bold mb-6 text-center">{error}</p>}
            <form action={handleRegister} className="w-full flex flex-col gap-6">
              <input name="name" required placeholder="Full Name" className="w-full h-16 bg-[#E8F6FA]/40 border-2 border-[#2FA8CC]/10 rounded-2xl px-6 text-[#1F4E79] outline-none focus:border-[#2FA8CC]" />
              <input name="email" required type="email" placeholder="Email Address" className="w-full h-16 bg-[#E8F6FA]/40 border-2 border-[#2FA8CC]/10 rounded-2xl px-6 text-[#1F4E79] outline-none focus:border-[#2FA8CC]" />
              <select name="class" required className="w-full h-16 bg-[#E8F6FA]/40 border-2 border-[#2FA8CC]/10 rounded-2xl px-6 text-[#1F4E79] font-bold outline-none focus:border-[#2FA8CC]">
                <option value="09">Class 9th (Goa)</option>
                <option value="10">Class 10th (Goa)</option>
              </select>
              <button disabled={loading} className="w-full h-20 bg-[#2FA8CC] text-white font-black rounded-2xl mt-4 shadow-xl shadow-[#2FA8CC]/20 transition-all hover:bg-[#1F4E79]">
                {loading ? "GENERATING USN..." : "REGISTER & GET OTP"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-[#1F4E79] mt-6 mb-2">Verify Account</h1>
            <p className="text-[#2FA8CC] text-sm italic mb-8">Check email for your PPG26S ID and OTP</p>
            <form action={handleActivate} className="w-full flex flex-col gap-6">
              <input name="otp" required placeholder="0 0 0 0 0 0" className="w-full h-16 bg-[#E8F6FA]/40 border-2 border-[#2FA8CC]/10 rounded-2xl text-center text-3xl tracking-[0.5em] text-[#1F4E79] outline-none focus:border-[#2FA8CC]" />
              <input name="password" required type="password" placeholder="Create Password" className="w-full h-16 bg-[#E8F6FA]/40 border-2 border-[#2FA8CC]/10 rounded-2xl px-6 text-[#1F4E79] outline-none focus:border-[#2FA8CC]" />
              <button disabled={loading} className="w-full h-20 bg-[#FF6B00] text-white font-black rounded-2xl shadow-xl transition-all hover:bg-[#1F4E79]">
                {loading ? "ACTIVATING..." : "FINALIZE ACTIVATION"}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center text-center py-6">
            <h1 className="text-3xl font-bold text-[#1F4E79] mb-4">Registration Complete!</h1>
            <p className="text-[#2FA8CC] font-medium leading-relaxed mb-8">
              We have sent a final email to <span className="text-[#1F4E79] font-bold">{email}</span> containing your <span className="font-bold">USN</span> and <span className="font-bold">Password</span>.
            </p>
            <div className="bg-green-50 border border-green-100 p-6 rounded-[2rem] w-full mb-8">
               <p className="text-green-700 text-xs font-bold uppercase tracking-widest">Account Status</p>
               <p className="text-green-600 text-sm mt-1 font-medium italic">Verified & Active</p>
            </div>
            <button onClick={() => router.push("/login/student")} className="w-full h-16 bg-[#1F4E79] text-white font-bold rounded-2xl shadow-2xl">
              GO TO LOGIN PORTAL
            </button>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-[#E8F6FA] w-full text-center">
            <a href="/login/student" className="text-[#1F4E79]/40 text-[10px] font-bold uppercase tracking-widest hover:text-[#2FA8CC]">Back to Login</a>
        </div>
      </div>
    </div>
  );
}