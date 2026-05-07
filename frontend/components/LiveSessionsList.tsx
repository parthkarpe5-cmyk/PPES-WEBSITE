'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Loader2, VideoOff, ArrowRight, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Session {
  _id: string;
  title: string;
  meetingId: string;
  status: string;
}

export const LiveSessionsList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/live/sessions`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Only show live sessions
          setSessions(data.filter((s: Session) => s.status === 'live' || s.status === 'scheduled'));
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
    // Poll every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="animate-spin text-sky h-10 w-10" />
        <p className="text-slate-500 text-sm font-medium animate-pulse uppercase tracking-widest">Searching for active classes...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 bg-white/[0.03] rounded-[2.5rem] border border-white/5 backdrop-blur-sm"
      >
        <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6 border border-white/5">
          <VideoOff className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No active sessions</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">There are no live classes happening right now. Check your schedule for upcoming sessions.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <AnimatePresence mode="popLayout">
        {sessions.map((session, index) => (
          <motion.div 
            key={session._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-[2rem] p-[1px] transition-all duration-500"
          >
            {/* Border gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky/40 via-saffron/40 to-sky/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-[#121826] rounded-[2rem] p-6 md:p-8 backdrop-blur-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-start md:items-center gap-6">
                <div className="relative shrink-0">
                  <div className="h-16 w-16 rounded-2xl bg-sky flex items-center justify-center shadow-[0_0_25px_rgba(47,168,204,0.4)] group-hover:scale-110 transition-transform duration-500">
                    <Play className="h-8 w-8 text-white fill-current translate-x-0.5" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-[#FF6B00] rounded-full border-4 border-[#121826] animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    {session.status === 'live' ? (
                      <Badge className="bg-[#FF6B00] hover:bg-[#FF6B00] text-white border-none text-[9px] uppercase font-bold px-2 py-0.5 tracking-widest rounded-full flex items-center gap-1">
                        <Radio size={10} className="animate-pulse" />
                        Live Now
                      </Badge>
                    ) : (
                      <Badge className="bg-sky/20 hover:bg-sky/20 text-sky border-none text-[9px] uppercase font-bold px-2 py-0.5 tracking-widest rounded-full">
                        Scheduled
                      </Badge>
                    )}
                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Public Session</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-sky transition-colors tracking-tight font-display">
                    {session.title}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                    Join Dr. Karpe and your classmates for an engaging live lesson on advanced topics.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => router.push(`/live/${session.meetingId}`)}
                  className="bg-sky hover:bg-sky/90 text-white rounded-2xl px-10 h-14 font-bold text-base shadow-[0_0_25px_rgba(47,168,204,0.25)] hover:shadow-[0_0_35px_rgba(47,168,204,0.4)] transition-all active:scale-95 flex items-center gap-2 group/btn"
                >
                  Join Session
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Decorative glow */}
              <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-sky/5 blur-[80px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

