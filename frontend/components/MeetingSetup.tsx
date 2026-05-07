'use client';

import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from '@stream-io/video-react-sdk';
import { Button } from './ui/button';
import { Video, Mic, MessageSquare, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {

  const [activeMode, setActiveMode] = useState<'video' | 'voice' | 'chat'>('video');
  const call = useCall();

  if (!call) {
    throw new Error(
      'useCall must be used within a StreamCall component.',
    );
  }

  const handleModeChange = async (mode: 'video' | 'voice' | 'chat') => {
    setActiveMode(mode);
    try {
      if (mode === 'chat') {
        await call.camera.disable();
        await call.microphone.disable();
      } else if (mode === 'voice') {
        await call.camera.disable();
        await call.microphone.enable();
      } else {
        await call.camera.enable();
        await call.microphone.enable();
      }
    } catch (err) {
      console.error('Error switching media mode:', err);
    }
  };

  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await call.join();
      setIsSetupComplete(true);
    } catch (err) {
      console.error('Failed to join call:', err);
      setIsJoining(false);
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0A101F] text-white p-4 md:p-6 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-saffron/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-4xl"
      >
        <div className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/20 text-sky text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sky animate-pulse" />
            Live Session Lobby
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight mb-3">
            Ready to <span className="text-sky">Join?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto px-4 md:px-0">
            Configure your audio and video settings before entering the interactive classroom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Left Side: Video Preview */}
          <div className="relative group w-full order-2 lg:order-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky to-deep-blue rounded-[1.5rem] md:rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-card rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-900 border-white/5 aspect-video flex items-center justify-center shadow-2xl">
              {activeMode === 'video' ? (
                <div className="w-full h-full scale-105">
                  <VideoPreview />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-slate-500">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    {activeMode === 'voice' ? <Mic size={32} className="md:w-10 md:h-10" /> : <MessageSquare size={32} className="md:w-10 md:h-10" />}
                  </div>
                  <p className="font-medium text-sm md:text-base">{activeMode === 'voice' ? 'Camera is Off' : 'Audio & Video are Off'}</p>
                </div>
              )}
              
              {/* Overlay for hardware status */}
              <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex justify-between items-center px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 md:gap-4">
                   <div className={cn("h-1.5 w-1.5 md:h-2 md:w-2 rounded-full", activeMode === 'video' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                   <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/80">
                     {activeMode === 'video' ? 'Camera Active' : 'Camera Disabled'}
                   </span>
                </div>
                <div className="scale-75 md:scale-100 origin-right">
                  <DeviceSettings />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Options & Join */}
          <div className="flex flex-col justify-between gap-6 order-1 lg:order-2">
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-bold text-white ml-1">Choose your entry mode:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {[
                  { id: 'video', label: 'Video Call', icon: Video, desc: 'Full experience' },
                  { id: 'voice', label: 'Voice Call', icon: Mic, desc: 'Audio only' },
                  { id: 'chat', label: 'Chat Only', icon: MessageSquare, desc: 'Text only' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id as any)}
                    className={cn(
                      "flex items-center lg:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 text-left group",
                      activeMode === mode.id 
                        ? "bg-sky/10 border-sky/40 shadow-[0_0_20px_rgba(47,168,204,0.1)]" 
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all shrink-0",
                      activeMode === mode.id ? "bg-sky text-white shadow-lg shadow-sky/20" : "bg-white/5 text-slate-400 group-hover:text-white"
                    )}>
                      <mode.icon size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs md:text-sm text-white">{mode.label}</div>
                      <div className="text-[9px] md:text-[10px] text-slate-500 font-medium uppercase tracking-tight line-clamp-1">{mode.desc}</div>
                    </div>
                    {activeMode === mode.id && (
                      <motion.div layoutId="check" className="ml-auto text-sky hidden sm:block">
                        <ShieldCheck size={18} className="md:w-5 md:h-5" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 items-start">
                  <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-200/70 leading-relaxed font-medium">
                    By joining, you agree to follow the classroom decorum and maintain a respectful environment.
                  </p>
               </div>

                <Button
                  disabled={isJoining}
                  className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-sky hover:bg-sky/90 text-white font-bold text-base md:text-lg shadow-[0_0_30px_rgba(47,168,204,0.3)] transition-all active:scale-95 group overflow-hidden relative disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleJoin}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isJoining ? 'Joining...' : 'Enter Classroom'}
                    {!isJoining && (
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Decorative Circles */}
      <div className="absolute top-20 right-20 w-4 h-4 rounded-full border-2 border-sky/20 animate-float" />
      <div className="absolute bottom-20 left-20 w-6 h-6 rounded-full border-2 border-saffron/20 animate-float" style={{ animationDelay: "2s" }} />
    </div>
  );
};

const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default MeetingSetup;

