import LoginForm from "../../../../components/auth/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function FacultyLoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("token")?.value) {
    redirect("/faculty");
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

      {/* The Container Card */}
      <div className="w-full max-w-[480px] bg-white dark:bg-[#090d16]/80 backdrop-blur-xl border border-slate-100  rounded-[3rem] p-12 shadow-2xl border-t-8 border-t-[#2FA8CC] dark:border-t-[#2FA8CC] flex flex-col items-center transition-all duration-300">
        
        {/* Scholar Icon */}
        <div className="w-20 h-20 bg-[#1F4E79] dark:bg-sky/20 rounded-2xl flex items-center justify-center text-4xl text-white mb-6 shadow-xl">
          👨‍🏫
        </div>

        {/* The Form Component - Wrapped in a w-full div */}
        <div className="w-full">
          <LoginForm role="faculty" idPlaceholder="Faculty ID" />
        </div>

        <p className="mt-8 text-[10px] font-black tracking-widest text-[#1F4E79]/30 dark:text-white/30 uppercase">
          Faculty Portal Access Control
        </p>
      </div>
    </div>
  );
}