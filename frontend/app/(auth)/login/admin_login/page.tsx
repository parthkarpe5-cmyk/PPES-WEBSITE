import LoginForm from "../../../../components/auth/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("token")?.value) {
    redirect("/admin");
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-[#050810] flex items-center justify-center p-4 overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle Positioned Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Reddish/Indigo Glow for Admin to signify high priority */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 dark:bg-indigo-900/30 rounded-full blur-[120px] animate-pulse-slow" />
      
      <div className="relative z-10 w-full max-w-[440px] bg-white dark:bg-[#090d16]/80 backdrop-blur-2xl border border-slate-200  p-10 rounded-[2.5rem] shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-slate-800 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-200 ">
             <span className="text-foreground font-bold text-2xl">A</span>
          </div>
        </div>

        <LoginForm role="admin" idPlaceholder="Admin ID" />
        
        <p className="mt-8 text-center text-xs text-red-500/60 uppercase tracking-widest font-bold">
          Restricted Area
        </p>
      </div>
    </div>
  );
}