'use client';

import { StreamVideoParticipant, ParticipantView } from '@stream-io/video-react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface MeetingGridProps {
  participants: StreamVideoParticipant[];
}

export const MeetingGrid = ({ participants }: MeetingGridProps) => {
  const count = participants.length;

  const gridConfig = useMemo(() => {
    if (count === 1) return 'grid-cols-1 max-w-5xl mx-auto';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-7xl mx-auto';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2 max-w-7xl mx-auto';
    if (count <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    if (count <= 9) return 'grid-cols-2 sm:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  }, [count]);

  // Handle case where we have many participants - in a real app we'd paginate
  // For now, we'll limit to 12 for the grid and show a "more" indicator if needed
  const visibleParticipants = participants.slice(0, 12);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto custom-scrollbar">
      <div className={cn(
        "grid gap-2 sm:gap-4 w-full transition-all duration-500 ease-in-out",
        gridConfig
      )}>
        <AnimatePresence mode="popLayout">
          {visibleParticipants.map((participant) => (
            <motion.div
              key={participant.sessionId}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/5 group"
            >
              <ParticipantView 
                participant={participant} 
                className="w-full h-full"
                // The SDK ParticipantView handles the actual video stream
              />
              
              {/* Overlay for Name/Status */}
              <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-10 flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={cn(
                  "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full",
                  participant.isSpeaking ? "bg-green-500 animate-pulse" : "bg-slate-400"
                )} />
                <span className="text-[10px] md:text-xs font-medium text-white">
                  {participant.name || participant.userId}
                  {participant.isLocalParticipant && " (You)"}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {participants.length > 12 && (
        <div className="mt-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-white/60 text-sm font-medium">
          + {participants.length - 12} more participants
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
