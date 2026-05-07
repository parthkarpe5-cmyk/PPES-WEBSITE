'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  CallParticipantsList,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  ParticipantView,
  useCallStateHooks,
  VideoTrackType,
} from '@stream-io/video-react-sdk';
import { SfuModels } from '@stream-io/video-client';
import { MeetingGrid } from './MeetingGrid';
import { SpeakerView } from './SpeakerView';
import { Whiteboard } from './Whiteboard';
import { PollsPanel } from './PollsPanel';
import { ResourcesPanel } from './ResourcesPanel';

import { useRouter, useParams } from 'next/navigation';
import {
  Users,
  LayoutList,
  Loader2,
  MessageSquare,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
  Pin,
  Maximize2,
  Hand,
  Radio,
  FileText,
  BarChart2,
  Copy,
  Check,
  Smile,
  ShieldAlert,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import {
  Window,
  MessageList,
  MessageComposer,
  Thread,
  Channel,
  ChannelHeader,
  useChatContext
} from 'stream-chat-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../hooks/use-user';

import { useToast } from '../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right' | 'speaker-bottom' | 'classroom';

const MeetingRoom = () => {
  const router = useRouter();
  const call = useCall();
  const { user } = useUser();
  const { id } = useParams();
  const [layout, setLayout] = useState<CallLayoutType>('classroom');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showPolls, setShowPolls] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [chatChannel, setChatChannel] = useState<any>(null);
  const [chatError, setChatError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const [reactions, setReactions] = useState<{ id: number, emoji: string, x: number, senderName: string }[]>([]);

  const {
    useCallCallingState,
    useMicrophoneState,
    useCameraState,
    useParticipants,
    useCallSession,
    useIsCallRecordingInProgress
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const isRecording = useIsCallRecordingInProgress();
  const { isMute: isMicMuted } = useMicrophoneState();
  const { isMute: isCamMuted } = useCameraState();
  const participants = useParticipants();
  const session = useCallSession();

  const screenShareParticipant = participants.find((p) =>
    p.publishedTracks.includes(SfuModels.TrackType.SCREEN_SHARE)
  );
  const isSharingScreen = !!screenShareParticipant;
  const isLocalScreenSharing = screenShareParticipant?.isLocalParticipant;

  const { client: chatClient } = useChatContext();
  const recordingLock = useRef(false);

  const teacherParticipant = useMemo(() => {
    if (participants.length === 0) return null;
    return participants.find(p => !!p.pin) ||
      participants.find(p => p.roles?.includes('admin') || p.roles?.includes('host')) ||
      participants[0];
  }, [participants]);

  const initChatChannel = async () => {
    if (!user || !chatClient || !id) return;
    setChatError(false);
    try {
      const channel = chatClient.channel('messaging', id as string);
      await channel.watch();
      setChatChannel(channel);
    } catch (err) {
      console.error('Failed to init chat channel:', err);
      setChatError(true);
    }
  };

  useEffect(() => {
    if (!chatClient || !id || chatChannel) return;
    let isMounted = true;
    const run = async () => {
      if (!isMounted) return;
      await initChatChannel();
    };
    run();
    return () => { isMounted = false; };
  }, [chatClient, id]); // chatChannel intentionally excluded — initChatChannel handles it

  // --- Attendance Logging Logic (Entry & Exit) ---
  useEffect(() => {
    if (callingState === CallingState.JOINED && user && id) {
      const logEntry = async () => {
        try {
          await fetch('http://localhost:5000/api/attendance/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id || 'anonymous',
              userName: user.name || 'Anonymous',
              classId: id,
              role: user.role || 'student'
            })
          });
        } catch (error) {
          console.error('Failed to log entry:', error);
        }
      };

      logEntry();

      // Cleanup: Log Exit
      return () => {
        const exitBody = JSON.stringify({
          userId: user.id || 'anonymous',
          classId: id
        });

        // Use keepalive to ensure the request is sent even if the tab is closing
        fetch('http://localhost:5000/api/attendance/exit', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: exitBody,
          keepalive: true
        }).catch(err => console.error('Failed to log exit on unmount:', err));
      };
    }
  }, [callingState, user, id]);

  // --- Auto-Recording Logic ---
  useEffect(() => {
    const autoStartRecording = async () => {
      if (callingState === CallingState.JOINED && call && !isRecording && !recordingLock.current) {
        // Only Faculty/Admin should trigger the auto-recording
        const isAdmin = user?.role === 'admin' || user?.role === 'faculty';

        if (isAdmin) {
          try {
            recordingLock.current = true;
            await call.startRecording();
            toast({
              title: "Auto-Recording Started",
              description: "This session is being recorded automatically for your records."
            });
          } catch (err) {
            console.error('Failed to auto-start recording:', err);
            recordingLock.current = false;
          }
        }
      }
    };

    autoStartRecording();
  }, [callingState, call, isRecording, user?.role]);

  // --- Logic Functions ---

  const toggleMic = async () => {
    await call?.microphone.toggle();
  };

  const toggleCam = async () => {
    await call?.camera.toggle();
  };

  const toggleScreenShare = async () => {
    try {
      await call?.screenShare.toggle();
    } catch (err) {
      console.error('Error toggling screen share:', err);
    }
  };

  const endCall = async () => {
    try {
      // Mark session as ended in the backend
      if (id) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/live/sessions/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ended' }),
          keepalive: true,
        }).catch(() => { });
      }
    } finally {
      await call?.leave();
      const role = user?.role;
      if (role === 'admin' || role === 'faculty') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }
    }
  };

  const toggleRecording = async () => {
    if (!call) return;
    try {
      if (isRecording) {
        await call.stopRecording();
        toast({ title: "Recording Stopped", description: "The session recording has been saved." });
      } else {
        await call.startRecording();
        toast({ title: "Recording Started", description: "This session is now being recorded." });
      }
    } catch (err: any) {
      console.error('Recording error:', err);
      toast({
        variant: "destructive",
        title: "Recording Error",
        description: err.message || "Failed to toggle recording. Check your permissions."
      });
    }
  };

  const copyMeetingLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const sendReaction = (emoji: string) => {
    if (!call || !user) return;
    const reaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.random() * 80 + 10,
      senderName: user.name || 'You'
    };
    setReactions(prev => [...prev, reaction]);

    // Broadcast to others
    call.sendCustomEvent({
      type: 'reaction',
      payload: { emoji, senderName: user.name || 'Anonymous' }
    });

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 4000);
  };

  useEffect(() => {
    if (!call) return;
    const unsubscribe = call.on('custom', (event: any) => {
      // Ignore local events
      if (event.user_id === call.currentUserId) return;

      if (event.custom.type === 'reaction') {
        const { emoji, senderName } = event.custom.payload;
        const reaction = {
          id: Date.now() + Math.random(),
          emoji,
          x: Math.random() * 80 + 10,
          senderName
        };
        setReactions(prev => [...prev, reaction]);
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== reaction.id));
        }, 4000);
      }
    });
    return () => unsubscribe();
  }, [call]);

  // Loading State (Moved after all hooks to prevent React crash)
  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050810]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-sky" size={56} strokeWidth={1.5} />
            <div className="absolute inset-0 bg-sky/20 blur-xl rounded-full animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold tracking-[0.2em] uppercase text-[10px] mb-2">Establishing Connection</p>
            <p className="text-slate-500 text-xs font-medium">Securing your classroom link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050810] text-white font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex size-full items-center justify-center p-2 sm:p-4 lg:p-8">
        <div className={cn("flex size-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]", {
          'lg:mr-[340px] xl:mr-[400px]': showParticipants || showChat || showPolls || showResources,
          'mr-0': !showParticipants && !showChat && !showPolls && !showResources
        })}>
          <div className="relative size-full rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {layout === 'grid' ? (
              <MeetingGrid participants={participants} />
            ) : layout === 'classroom' ? (
              <div className="flex flex-col lg:flex-row h-full w-full">
                {/* Main Content Area: Screen Share or Whiteboard */}
                <div className="flex-1 h-full min-h-[300px] p-1.5 lg:p-4 overflow-hidden relative text-white">
                  {isSharingScreen ? (
                    <div className="w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-[#050810] border-2 border-sky/30 relative shadow-[0_0_50px_rgba(47,168,204,0.2)]">
                      {screenShareParticipant ? (
                        <ParticipantView
                          key={`${screenShareParticipant.sessionId}-screen`}
                          participant={screenShareParticipant}
                          trackType="screenShareTrack"
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center gap-4">
                          <Loader2 className="animate-spin text-sky" size={48} />
                          <p className="text-sky font-bold tracking-widest text-[10px] uppercase">Connecting Screen Stream...</p>
                        </div>
                      )}
                      {isLocalScreenSharing ? (
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl z-30"
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky"></span>
                            </div>
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">You are presenting</span>
                          </div>
                          <div className="h-4 w-px bg-white/20" />
                          <button
                            onClick={toggleScreenShare}
                            className="text-[10px] font-bold text-sky hover:text-white transition-colors uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-sky/20 border border-sky/30"
                          >
                            Stop Sharing
                          </button>
                        </motion.div>
                      ) : (
                        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky text-[10px] font-bold uppercase tracking-widest text-white shadow-2xl z-20">
                          <MonitorUp size={14} className="animate-pulse" />
                          Live Presentation
                        </div>
                      )}
                    </div>
                  ) : (
                    <Whiteboard call={call} />
                  )}

                  {/* Mobile Floating Teacher View */}
                  <div className="absolute bottom-24 right-4 w-32 aspect-video lg:hidden z-40 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                    {teacherParticipant && (
                      <ParticipantView
                        key={`pip-${teacherParticipant.sessionId}`}
                        participant={teacherParticipant}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                </div>

                {/* Fixed Classroom Sidebar (Hidden on Mobile, use Control Bar to open right sidebar instead) */}
                <div className="hidden lg:flex w-[300px] xl:w-[360px] flex-col bg-[#0D121F]/80 backdrop-blur-3xl border-l border-white/5 relative overflow-hidden">
                  {/* Teacher/Host View */}
                  <div className="aspect-video w-full relative bg-slate-900 border-b border-white/10 group">
                    {teacherParticipant ? (
                      <>
                        <ParticipantView
                          key={teacherParticipant.sessionId}
                          participant={teacherParticipant}
                          className="w-full h-full"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <div className="px-2 py-1 rounded-lg bg-red-500 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl border border-white/10">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            On Air
                          </div>
                        </div>

                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                          {teacherParticipant.name || 'User'}
                        </div>
                      </>
                    ) : (
                      <div className="size-full flex items-center justify-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                        Waiting for host...
                      </div>
                    )}
                  </div>

                  {/* Sidebar Chat Area */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-sky" />
                        Live Classroom Chat
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky">
                        <Users size={12} />
                        {participants.length}
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden stream-chat-custom bg-white">
                      {chatChannel ? (
                        <Channel channel={chatChannel}>
                          <Window>
                            <MessageList />
                            <MessageComposer />
                          </Window>
                        </Channel>
                      ) : chatError ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#0D121F] gap-3">
                          <p className="text-slate-400 text-xs">Chat failed to connect.</p>
                          <button
                            onClick={initChatChannel}
                            className="text-[10px] font-bold text-sky hover:text-white uppercase tracking-widest px-3 py-1.5 rounded-lg bg-sky/10 hover:bg-sky/20 border border-sky/20 transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center p-8 text-center bg-[#0D121F]">
                          <div className="text-slate-500 text-xs">
                            <Loader2 className="animate-spin mb-4 mx-auto text-sky/40" size={32} />
                            <p>Synchronizing chat...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <SpeakerView
                participants={participants}
                layout={layout as 'speaker-left' | 'speaker-right' | 'speaker-bottom'}
              />
            )}

            {/* Layout Indicator Overlay */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-3 z-20">
              <div className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/60">
                <LayoutList size={12} className="text-sky md:w-[14px]" />
                <span className="hidden xs:inline">{layout} View</span>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-[10px] font-bold uppercase tracking-widest text-red-500 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  REC
                </div>
              )}
            </div>

            {/* Floating Reactions Layer */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              <AnimatePresence>
                {reactions.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ y: '100%', opacity: 0, scale: 0.5 }}
                    animate={{ y: '-10%', opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 4, ease: "easeOut" }}
                    className="absolute bottom-20 flex flex-col items-center gap-1"
                    style={{ left: `${r.x}%` }}
                  >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-[8px] font-bold text-white/80 whitespace-nowrap">
                      {r.senderName}
                    </div>
                    <div className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                      {r.emoji}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <AnimatePresence>
          {(showParticipants || showChat || showPolls || showResources) && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                "absolute z-40 transition-all duration-300",
                "inset-0 p-2 md:p-0 md:inset-auto md:right-6 md:top-6 md:bottom-24 md:w-[320px] xl:w-[380px]"
              )}
            >
              <div className="h-full bg-[#0D121F]/95 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                {showParticipants && (
                  <div className="flex flex-col h-full">
                    <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-bold text-base md:text-lg flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-sky/10 text-sky">
                          <Users size={16} className="md:w-[18px]" />
                        </div>
                        Participants
                        <span className="text-[10px] md:text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full ml-1">
                          {participants.length}
                        </span>
                      </h3>
                      <button onClick={() => setShowParticipants(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
                        <X size={18} className="md:w-[20px]" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                      {participants.map((p) => (
                        <div key={p.sessionId} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-sky">
                                {p.name?.charAt(0) || 'U'}
                              </div>
                              {p.isSpeaking && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0D121F] rounded-full animate-pulse" />}
                            </div>
                            <div>
                              <div className="text-sm font-bold flex items-center gap-2">
                                {p.name}
                                {p.isLocalParticipant && <span className="text-[8px] bg-sky/20 text-sky px-1.5 py-0.5 rounded-full uppercase">You</span>}
                                {(p.roles?.includes('admin') || p.roles?.includes('host')) && (
                                  <div className="p-1 rounded bg-amber-500/20 text-amber-500" title="Host">
                                    <ShieldAlert size={10} />
                                  </div>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                                {p.roles?.includes('admin') ? 'Faculty' : 'Student'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                            <div className={cn("p-1.5 rounded-lg", !!p.audioStream ? "text-emerald-500" : "text-red-500/60")}>
                              {!!p.audioStream ? <Mic size={14} /> : <MicOff size={14} />}
                            </div>
                            <div className={cn("p-1.5 rounded-lg", !!p.videoStream ? "text-emerald-500" : "text-red-500/60")}>
                              {!!p.videoStream ? <Video size={14} /> : <VideoOff size={14} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showChat && (
                  <div className="flex flex-col h-full bg-white">
                    <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                      <h3 className="font-bold text-sm md:text-base text-slate-800 flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-sky/10 text-sky">
                          <MessageSquare size={16} className="md:w-[18px]" />
                        </div>
                        Class Chat
                      </h3>
                      <button onClick={() => setShowChat(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <X size={18} className="md:w-[20px]" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden stream-chat-custom">
                      {chatChannel ? (
                        <Channel channel={chatChannel}>
                          <Window>
                            <MessageList />
                            <MessageComposer />
                          </Window>
                          <Thread />
                        </Channel>
                      ) : chatError ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
                          <p className="text-slate-400 text-xs">Chat failed to connect.</p>
                          <button
                            onClick={initChatChannel}
                            className="text-[10px] font-bold text-sky hover:underline uppercase tracking-widest"
                          >Retry</button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center p-8">
                          <Loader2 className="animate-spin text-sky/40" size={28} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showPolls && (
                  <div className="h-full relative">
                    <PollsPanel onClose={() => setShowPolls(false)} />
                  </div>
                )}

                {showResources && (
                  <div className="h-full relative">
                    <ResourcesPanel onClose={() => setShowResources(false)} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Floating Control Bar */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-2 md:px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-1 md:gap-3 px-2 py-2 md:px-6 md:py-4 rounded-2xl md:rounded-[3rem] bg-[#0D121F]/90 backdrop-blur-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/5 overflow-x-auto no-scrollbar"
        >
          {/* Main Controls */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <ControlButton
              active={!isMicMuted}
              onClick={toggleMic}
              icon={isMicMuted ? MicOff : Mic}
              label={isMicMuted ? 'Unmute' : 'Mute'}
              variant={isMicMuted ? 'danger' : 'secondary'}
            />
            <ControlButton
              active={!isCamMuted}
              onClick={toggleCam}
              icon={isCamMuted ? VideoOff : Video}
              label={isCamMuted ? 'Start' : 'Stop'}
              variant={isCamMuted ? 'danger' : 'secondary'}
            />

            {/* Mobile More Actions Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95">
                    <Settings size={20} className="text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-white/10 bg-[#0D121F]/95 backdrop-blur-xl text-white rounded-2xl p-2 min-w-[200px] shadow-2xl mb-4 mr-4">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Classroom Tools</div>

                  <DropdownMenuItem className="focus:bg-white/5 rounded-xl py-3" onClick={() => setIsHandRaised(!isHandRaised)}>
                    <Hand size={18} className={cn("mr-3", isHandRaised ? "text-sky" : "text-slate-400")} />
                    <span className="text-sm">Raise Hand</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-white/5 rounded-xl py-3" onClick={toggleScreenShare}>
                    <MonitorUp size={18} className={cn("mr-3", isSharingScreen ? "text-sky" : "text-slate-400")} />
                    <span className="text-sm">Share Screen</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-white/5 rounded-xl py-3" onClick={() => setShowParticipants(true)}>
                    <Users size={18} className="mr-3 text-slate-400" />
                    <span className="text-sm">Participants</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-white/5 rounded-xl py-3" onClick={() => setShowChat(true)}>
                    <MessageSquare size={18} className="mr-3 text-slate-400" />
                    <span className="text-sm">Class Chat</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-white/5 rounded-xl py-3" onClick={() => setShowPolls(true)}>
                    <BarChart2 size={18} className="mr-3 text-slate-400" />
                    <span className="text-sm">Live Polls</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-white/5 rounded-xl py-3" onClick={() => setShowResources(true)}>
                    <FileText size={18} className="mr-3 text-slate-400" />
                    <span className="text-sm">Session Files</span>
                  </DropdownMenuItem>

                  <div className="h-px bg-white/5 my-2" />

                  <div className="grid grid-cols-4 gap-1 p-1">
                    {['👏', '❤️', '🎉', '🔥'].map((emoji) => (
                      <button key={emoji} onClick={() => sendReaction(emoji)} className="p-2 hover:bg-white/10 rounded-lg text-lg">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <ControlButton
                active={isHandRaised}
                onClick={() => setIsHandRaised(!isHandRaised)}
                icon={Hand}
                label="Hand"
                variant={isHandRaised ? 'primary' : 'secondary'}
              />
              <ControlButton
                active={isSharingScreen}
                onClick={toggleScreenShare}
                icon={MonitorUp}
                label="Share"
                variant={isSharingScreen ? 'primary' : 'secondary'}
              />
              <ControlButton
                active={isRecording}
                onClick={toggleRecording}
                icon={Radio}
                label="Record"
                variant={isRecording ? 'danger' : 'secondary'}
              />
            </div>
          </div>

          <div className="h-6 md:h-8 w-px bg-white/10 mx-1 md:mx-2" />

          {/* Feature Controls (Desktop Only) */}
          <div className="hidden md:flex items-center gap-1.5 md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 group relative">
                  <LayoutList size={18} className="text-slate-400 group-hover:text-white md:w-[20px]" />
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-sky rounded-full scale-0 group-hover:scale-100 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-white/10 bg-[#0D121F]/95 backdrop-blur-xl text-white rounded-xl md:rounded-[1.5rem] p-1.5 md:p-2 min-w-[160px] md:min-w-[180px] shadow-2xl mb-4">
                <div className="px-3 py-2 text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Layout</div>
                {['Classroom', 'Grid', 'Speaker-Left', 'Speaker-Right', 'Speaker-Bottom'].map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="rounded-lg md:rounded-xl focus:bg-sky/20 focus:text-white cursor-pointer py-2 px-3 md:py-3 md:px-4 mb-1 last:mb-0 transition-colors flex items-center justify-between group"
                    onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                  >
                    <span className="text-xs md:text-sm font-medium">{item}</span>
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-sky opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <FeatureButton
              active={showParticipants}
              onClick={() => {
                setShowParticipants(!showParticipants);
                setShowChat(false);
                setShowPolls(false);
                setShowResources(false);
              }}
              icon={Users}
              label="People"
            />

            <FeatureButton
              active={showChat}
              onClick={() => {
                setShowChat(!showChat);
                setShowParticipants(false);
                setShowPolls(false);
                setShowResources(false);
              }}
              icon={MessageSquare}
              label="Chat"
            />

            <FeatureButton
              active={showPolls}
              onClick={() => {
                setShowPolls(!showPolls);
                setShowChat(false);
                setShowParticipants(false);
                setShowResources(false);
              }}
              icon={BarChart2}
              label="Polls"
            />

            <FeatureButton
              active={showResources}
              onClick={() => {
                setShowResources(!showResources);
                setShowChat(false);
                setShowParticipants(false);
                setShowPolls(false);
              }}
              icon={FileText}
              label="Files"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 group relative">
                  <Smile size={18} className="text-slate-400 group-hover:text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-white/10 bg-[#0D121F]/95 backdrop-blur-xl text-white rounded-xl p-2 min-w-[120px] shadow-2xl mb-4 flex flex-wrap gap-1 justify-center max-w-[200px]">
                {['👏', '❤️', '🎉', '😂', '🔥', '👍', '🤔', '👋'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={copyMeetingLink}
              className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 group relative"
            >
              {isCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-slate-400 group-hover:text-white" />}
              {isCopied && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">Copied!</div>}
            </button>
          </div>

          <div className="h-6 md:h-8 w-px bg-white/10 mx-1 md:mx-2" />

          {/* End Call */}
          <button
            onClick={endCall}
            className="h-10 px-3 md:h-12 md:px-6 flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl bg-red-500 hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 group"
          >
            <PhoneOff size={16} className="text-white md:w-[18px]" />
            <span className="text-xs md:text-sm font-bold text-white hidden xs:inline">Leave</span>
          </button>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .stream-chat-custom .str-chat__main-panel { padding: 0; background: transparent; }
        .stream-chat-custom .str-chat__list { background: transparent; }
        .stream-chat-custom .str-chat__input-flat { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 12px; }
      `}} />
    </section>
  );
};

const ControlButton = ({ active, onClick, icon: Icon, label, variant }: any) => (
  <div className="flex flex-col items-center gap-1 group">
    <button
      onClick={onClick}
      className={cn(
        "h-10 w-12 md:h-12 md:w-14 flex items-center justify-center rounded-xl md:rounded-2xl transition-all active:scale-95 relative",
        variant === 'danger'
          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon size={18} strokeWidth={2} className="md:w-[20px]" />
      {active && variant !== 'danger' && (
        <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-sky rounded-full" />
      )}
    </button>
    <span className="hidden md:block text-[8px] md:text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-tight line-clamp-1">{label}</span>
  </div>
);

const FeatureButton = ({ active, onClick, icon: Icon, label }: any) => (
  <div className="flex flex-col items-center gap-1 group">
    <button
      onClick={onClick}
      className={cn("h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl transition-all active:scale-95 relative", {
        'bg-sky text-white shadow-lg shadow-sky/25': active,
        'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white': !active
      })}
    >
      <Icon size={18} className="md:w-[20px]" />
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
        />
      )}
    </button>
    <span className="hidden md:block text-[8px] font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-tight">{label}</span>
  </div>
);

export default MeetingRoom;

