import LoginForm from "../../../../components/auth/LoginForm";

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#E8F6FA] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sky/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-saffron/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[520px] bg-white rounded-[4rem] p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(31,78,121,0.25)] flex flex-col items-center">
        
        {/* Scholar Cap - Large and Gold */}
        <div className="absolute -top-12 bg-prestige w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl border-[8px] border-[#E8F6FA] text-white">
          🎓
        </div>

        <div className="w-full mt-6">
           <LoginForm role="student" idPlaceholder="USN" />
        </div>

      </div>
    </div>
  );
}