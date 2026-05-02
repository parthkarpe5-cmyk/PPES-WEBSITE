'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // MOCK LOGIN FOR DEMO
    // In a real app, this would be an API call to /api/auth/login
    setTimeout(() => {
      Cookies.set('token', 'mock_token_for_demo', { expires: 7 });
      router.push('/student');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050810] p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky/10 border border-sky/20 mb-6">
            <GraduationCap size={32} className="text-sky" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to your PPES Learning account</p>
        </div>

        <div className="glass-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/10 bg-white/5 group-hover:border-sky/50 transition-colors flex items-center justify-center">
                   <div className="w-2 h-2 rounded-sm bg-sky scale-0 group-hover:scale-100 transition-transform" />
                </div>
                <span className="text-xs text-slate-500">Remember me</span>
              </label>
              <button type="button" className="text-xs text-sky hover:text-white transition-colors">Forgot Password?</button>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-sky hover:bg-sky/90 text-white font-bold text-base shadow-lg shadow-sky/20 active:scale-95 transition-all group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <button className="text-sky font-bold hover:underline">Contact Faculty</button>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-10 flex items-center justify-center gap-6 opacity-40">
           <div className="flex items-center gap-2">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Secure AES-256</span>
           </div>
           <div className="w-px h-4 bg-white/20" />
           <div className="flex items-center gap-2">
             <GraduationCap size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest">PPES Education</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
