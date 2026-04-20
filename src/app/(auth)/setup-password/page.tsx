"use client";
import { useState } from "react";
import { sendOtpAction, completeSetupAction } from "../../actions/setup";
import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen w-full bg-surface flex items-center justify-center p-6 relative">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[450px] bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border-t-8 border-t-sky flex flex-col items-center">
        <h1 className="text-3xl font-bold text-deepBlue mb-2 text-center">Account Setup</h1>
        <p className="text-deepBlue/60 text-sm text-center mb-8 italic">Verification required for first-time login</p>

        {message.text && (
          <div className={`w-full mb-6 p-3 rounded-xl text-center text-xs font-bold ${
            message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-deepBlue/40 uppercase tracking-widest ml-1">
                Registered Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your college email" 
                className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-deepBlue focus:border-sky outline-none transition-all" 
              />
            </div>
            <button 
              onClick={handleSendOtp} 
              disabled={loading} 
              className="w-full h-16 bg-sky hover:bg-deepBlue text-white font-bold rounded-2xl shadow-lg shadow-sky/20 transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Receive OTP"}
            </button>
          </div>
        ) : (
          <form action={completeSetupAction} className="w-full flex flex-col gap-6">
             <input type="hidden" name="email" value={email} />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-deepBlue/40 uppercase tracking-widest ml-1">OTP Code</label>
              <input 
                name="otp" 
                required 
                type="text" 
                placeholder="6-digit code" 
                className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-deepBlue text-center text-2xl tracking-[0.5em] focus:border-sky outline-none" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-deepBlue/40 uppercase tracking-widest ml-1">Create Password</label>
              <input 
                name="password" 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full h-14 bg-surface/30 border-2 border-sky/10 rounded-2xl px-5 text-deepBlue focus:border-sky outline-none" 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full h-16 bg-saffron hover:bg-deepBlue text-white font-bold rounded-2xl shadow-lg shadow-saffron/20 transition-all"
            >
              {loading ? "Activating..." : "Set Password & Activate"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}