"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, GraduationCap, User, ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const RoleCard = ({ 
  role, 
  icon: Icon, 
  title, 
  description, 
  href, 
  delay 
}: { 
  role: string, 
  icon: any, 
  title: string, 
  description: string, 
  href: string,
  delay: string
}) => {
  return (
    <Link href={href} className="group relative animate-fade-in-up" style={{ animationDelay: delay }}>
      {/* Dynamic border gradient */}
      <div className="relative overflow-hidden rounded-[1.25rem] p-px bg-gradient-to-b from-slate-200 to-transparent dark:from-white/20 dark:to-transparent shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95">
        {/* Theme Adaptive Card Background */}
        <div className="relative h-full rounded-[1.25rem] p-8 flex flex-col items-center text-center backdrop-blur-xl border border-sky/10  bg-white/85  hover:bg-white/95 dark:hover:bg-white/[0.05] dark:hover:border-sky/30 transition-all duration-500">
          
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-sky/20 dark:bg-sky/5 blur-2xl rounded-full scale-150 group-hover:bg-sky/30 transition-colors duration-500" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-sky to-[#1F4E79] flex items-center justify-center text-white shadow-lg shadow-sky/20 group-hover:rotate-6 transition-transform duration-500">
              <Icon size={36} strokeWidth={1.5} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 font-display tracking-tight group-hover:text-sky transition-colors">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
            {description}
          </p>

          <div className="flex items-center gap-2 text-sky font-semibold group-hover:gap-3 transition-all duration-300">
            <span>Enter Portal</span>
            <ArrowRight size={18} />
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky/5 rounded-bl-[100%] transition-all duration-500 group-hover:bg-sky/10" />
        </div>
      </div>
    </Link>
  );
};

export default function RoleSelectionPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 py-12 px-6">
      
      {/* Floating Theme Toggle in top-right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky/10 dark:bg-sky/5 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-saffron/10 dark:bg-saffron/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/40  blur-[100px] rounded-full" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.015] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        {/* Header Section */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60  border border-sky/10 text-sky text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sky animate-pulse" />
            Educational Gateway
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-display text-foreground mb-4 tracking-tighter">
            Prarambha <span className="text-sky underline decoration-sky/20 underline-offset-8">Path</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-lg mx-auto font-medium">
            Your journey to excellence starts here. Select your academic role to continue.
          </p>
        </header>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <RoleCard 
            role="admin"
            icon={ShieldCheck}
            title="Admin"
            description="System control, user management, and platform configuration."
            href="/admin"
            delay="100ms"
          />
          <RoleCard 
            role="faculty"
            icon={GraduationCap}
            title="Faculty"
            description="Manage courses, evaluate students, and educational tools."
            href="/faculty"
            delay="200ms"
          />
          <RoleCard 
            role="student"
            icon={User}
            title="Student"
            description="Access courses, track progress, and learn effectively."
            href="/student"
            delay="300ms"
          />
        </div>

        {/* Footer Info */}
        <footer className="mt-20 text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
          <div className="flex flex-col items-center gap-4">
             <div className="gold-divider mx-auto mb-2" />
             <p className="text-[#1F4E79] dark:text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
               Knowledge • Growth • Success
             </p>
          </div>
        </footer>
      </div>

      {/* Background Decorative Circles */}
      <div className="hidden lg:block absolute top-20 left-20 w-4 h-4 rounded-full border-2 border-sky/20 animate-float" />
      <div className="hidden lg:block absolute bottom-40 left-40 w-6 h-6 rounded-full border-2 border-saffron/20 animate-float" style={{ animationDelay: "2s" }} />
      <div className="hidden lg:block absolute top-40 right-40 w-8 h-8 rounded-full border-2 border-gold/20 animate-float" style={{ animationDelay: "1.5s" }} />
    </main>
  );
}