'use client';

import { StreamVideoParticipant, ParticipantView, useCall } from '@stream-io/video-react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMemo, useRef, useEffect } from 'react';
import { Pin, Maximize2 } from 'lucide-react';

interface SpeakerViewProps {
  participants: StreamVideoParticipant[];
  layout: 'speaker-left' | 'speaker-right' | 'speaker-bottom';
}

export const SpeakerView = ({ participants, layout }: SpeakerViewProps) => {
  const call = useCall();
  // Find pinned participant or use the first one (usually local or dominant)
  const mainParticipant = useMemo(() => {
    return participants.find((p) => !!p.pin) || participants[0];
  }, [participants]);

  const otherParticipants = useMemo(() => {
    return participants.filter((p) => p.sessionId !== mainParticipant?.sessionId);
  }, [participants, mainParticipant]);

  if (!mainParticipant) return null;

  return (
    <div className={cn(
      "relative size-full flex p-2 md:p-4 gap-2 md:gap-4 overflow-hidden",
      layout === 'speaker-bottom' ? "flex-col" : "flex-col md:flex-row",
      layout === 'speaker-left' && "md:flex-row-reverse"
    )}>
      {/* Main Speaker View (70-80%) */}
      <div className={cn(
        "flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/5 group",
        "transition-all duration-500 ease-in-out"
      )}>
        <ParticipantView 
          participant={mainParticipant} 
          className="w-full h-full"
        />
        
        {/* Overlay for Main Speaker Info */}
        <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 z-10 flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
          <div className={cn(
            "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]",
            mainParticipant.isSpeaking ? "bg-green-500 animate-pulse" : "bg-slate-400"
          )} />
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-bold text-white tracking-wide">
              {mainParticipant.name || mainParticipant.userId}
              {mainParticipant.isLocalParticipant && " (You)"}
            </span>
            <span className="text-[8px] md:text-[10px] text-slate-400 font-medium uppercase tracking-widest">Active Speaker</span>
          </div>
          {!!mainParticipant.pin && (
            <Pin size={12} className="text-sky ml-1 md:ml-2 fill-sky md:w-[14px]" />
          )}
        </div>

        {/* Action buttons on hover */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10">
            <Maximize2 size={16} className="md:w-[18px]" />
          </button>
        </div>
      </div>

      {/* Participants Sidebar/Strip */}
      <div className={cn(
        "flex shrink-0 transition-all duration-500 ease-in-out custom-scrollbar overflow-auto",
        "w-full h-24 md:h-auto flex-row md:flex-col gap-2 md:gap-4", // Mobile: Bottom strip
        layout === 'speaker-bottom' 
          ? "md:h-32 lg:h-40 md:flex-row" 
          : "md:w-48 lg:w-64" // Desktop: Sidebar
      )}>
        <AnimatePresence mode="popLayout">
          {otherParticipants.map((participant) => (
            <motion.div
              key={participant.sessionId}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/5 group flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-sky/50 transition-all",
                layout === 'speaker-bottom' ? "h-full" : "w-full"
              )}
              onClick={async () => {
                if (!participant.pin) {
                  await call?.pin(participant.sessionId);
                } else {
                  await call?.unpin(participant.sessionId);
                }
              }}
            >
              <ParticipantView 
                participant={participant} 
                className="w-full h-full"
              />
              
              <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center gap-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  participant.isSpeaking ? "bg-green-500 animate-pulse" : "bg-slate-400"
                )} />
                <span className="text-[10px] font-medium text-white truncate">
                  {participant.name || participant.userId}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {otherParticipants.length === 0 && (
          <div className={cn(
            "flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-slate-500 text-xs",
            layout === 'speaker-bottom' ? "w-48 h-full" : "w-full h-32"
          )}>
            No others
          </div>
        )}
      </div>
    </div>
  );
};
