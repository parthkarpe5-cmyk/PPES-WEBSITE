import LoginForm from "../../../../components/auth/LoginForm";

export default function FacultyLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E8F6FA] p-6">
      
      {/* The Container Card */}
      <div className="w-full max-w-[480px] bg-white/90 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl border-t-8 border-t-[#2FA8CC] flex flex-col items-center">
        
        {/* Scholar Icon */}
        <div className="w-20 h-20 bg-[#1F4E79] rounded-2xl flex items-center justify-center text-4xl text-white mb-6 shadow-xl">
          👨‍🏫
        </div>

        {/* The Form Component - Wrapped in a w-full div */}
        <div className="w-full">
          <LoginForm role="faculty" idPlaceholder="Faculty ID" />
        </div>

        <p className="mt-8 text-[10px] font-black tracking-widest text-[#1F4E79]/30 uppercase">
          Faculty Portal Access Control
        </p>
      </div>
    </div>
  );
}