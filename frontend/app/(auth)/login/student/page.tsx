import LoginForm from "@/components/auth/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function StudentLoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("token")?.value) {
    redirect("/student");
  }

  return (
    <div className="min-h-screen w-full bg-[#E8F6FA] dark:bg-[#050810] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle Positioned Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sky/5 dark:bg-sky/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-saffron/5 dark:bg-saffron/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[520px] bg-white dark:bg-[#090d16]/80 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-[3rem] p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(31,78,121,0.15)] dark:shadow-none flex flex-col items-center transition-all duration-300">
        
        {/* Scholar Cap - Large and Gold */}
        <div className="absolute -top-12 bg-prestige w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl border-[8px] border-[#E8F6FA] dark:border-[#050810] text-white transition-all duration-300">
          🎓
        </div>

        <div className="w-full mt-6">
           <LoginForm role="student" idPlaceholder="USN" />
        </div>

      </div>
    </div>
  );
}