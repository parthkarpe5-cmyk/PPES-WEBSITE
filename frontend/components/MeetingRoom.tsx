'use client';

import { useState, useEffect } from 'react';
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
  VolumeX
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
  const { id } = useParams();
  const [layout, setLayout] = useState<CallLayoutType>('classroom');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showPolls, setShowPolls] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [chatChannel, setChatChannel] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [reactions, setReactions] = useState<{ id: number, emoji: string, x: number }[]>([]);

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

  const screenShareParticipant = participants.find((p) => p.screenShareStream);
  const isSharingScreen = !!screenShareParticipant;

  const { client: chatClient } = useChatContext();

  useEffect(() => {
    if (!chatClient || !id || chatChannel) return;

    let isMounted = true;
    const initChannel = async () => {
      try {
        const channel = chatClient.channel('messaging', id as string, {
          name: `Classroom: ${id}`,
        } as any);

        await channel.watch();
        if (isMounted) setChatChannel(channel);
      } catch (err) {
        console.error('Failed to init chat channel:', err);
      }
    };

    initChannel();
    return () => { isMounted = false; };
  }, [chatClient, id, chatChannel]);

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
    await call?.leave();
    router.push('/student');
  };

  const toggleRecording = async () => {
    if (!call) return;
    try {
      if (isRecording) {
        await call.stopRecording();
      } else {
        await call.startRecording();
      }
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const copyMeetingLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const sendReaction = (emoji: string) => {
    if (!call) return;
    const reaction = { id: Date.now(), emoji, x: Math.random() * 80 + 10 };
    setReactions(prev => [...prev, reaction]);

    // Broadcast to others
    call.sendCustomEvent({
      type: 'reaction',
      payload: { emoji }
    });

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 4000);
  };

  useEffect(() => {
    if (!call) return;
    const unsubscribe = call.on('custom', (event: any) => {
      if (event.custom.type === 'reaction') {
        const { emoji } = event.custom.payload;
        const reaction = { id: Date.now(), emoji, x: Math.random() * 80 + 10 };
        setReactions(prev => [...prev, reaction]);
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== reaction.id));
        }, 4000);
      }
    });
    return () => unsubscribe();
  }, [call]);

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
                <div className="flex-1 h-full min-h-[400px] p-2 lg:p-4 overflow-hidden relative text-white">
                  {isSharingScreen ? (
                    <div className="w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-[#050810] border-2 border-sky/30 relative shadow-[0_0_50px_rgba(47,168,204,0.2)]">
                      {screenShareParticipant ? (
                        <ParticipantView
                          participant={screenShareParticipant}
                          trackType={"screenShare" as any}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center gap-4">
                          <Loader2 className="animate-spin text-sky" size={48} />
                          <p className="text-sky font-bold tracking-widest text-[10px] uppercase">Connecting Screen Stream...</p>
                        </div>
                      )}
                      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky text-[10px] font-bold uppercase tracking-widest text-white shadow-2xl z-20">
                        <MonitorUp size={14} className="animate-pulse" />
                        Live Classroom Presentation
                      </div>
                    </div>
                  ) : (
                    <Whiteboard call={call} />
                  )}
                </div>

                {/* Fixed Classroom Sidebar */}
                <div className="w-full lg:w-[300px] xl:w-[360px] flex flex-col bg-[#0D121F]/80 backdrop-blur-3xl border-l border-white/5 relative overflow-hidden">
                  {/* Teacher View (Pinned or First) */}
                  <div className="aspect-video w-full relative bg-slate-900 border-b border-white/10 group">
                    <ParticipantView
                      participant={participants.find(p => !!p.pin) || participants[0]}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <div className="px-2 py-1 rounded-lg bg-red-500 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl border border-white/10">
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        On Air
                      </div>
                      {isHandRaised && (
                        <div className="px-2 py-1 rounded-lg bg-sky text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl border border-white/10 animate-bounce">
                          <Hand size={10} className="fill-white" />
                          Asking Question
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      Prof. {(participants.find(p => !!p.pin) || participants[0])?.name}
                    </div>
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
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="absolute bottom-0 text-3xl"
                    style={{ left: `${r.x}%` }}
                  >
                    {r.emoji}
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
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                      <CallParticipantsList onClose={() => setShowParticipants(false)} />
                    </div>
                  </div>
                )}

                {showChat && chatChannel && (
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
                      <Channel channel={chatChannel}>
                        <Window>
                          <MessageList />
                          <MessageComposer />
                        </Window>
                        <Thread />
                      </Channel>
                    </div>
                  </div>
                )}

                {showPolls && (
                  <div className="h-full relative">
                    <button onClick={() => setShowPolls(false)} className="absolute top-6 right-6 z-10 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
                      <X size={18} />
                    </button>
                    <PollsPanel />
                  </div>
                )}

                {showResources && (
                  <div className="h-full relative">
                    <button onClick={() => setShowResources(false)} className="absolute top-6 right-6 z-10 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
                      <X size={18} />
                    </button>
                    <ResourcesPanel />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Floating Control Bar */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-1.5 md:gap-3 px-3 py-2 md:px-6 md:py-4 rounded-2xl md:rounded-[3rem] bg-[#0D121F]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
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
            <div className="hidden sm:block">
              <ControlButton
                active={isHandRaised}
                onClick={() => setIsHandRaised(!isHandRaised)}
                icon={Hand}
                label="Hand"
                variant={isHandRaised ? 'primary' : 'secondary'}
              />
            </div>
            <div className="hidden sm:block">
              <ControlButton
                active={isSharingScreen}
                onClick={toggleScreenShare}
                icon={MonitorUp}
                label="Share"
                variant={isSharingScreen ? 'primary' : 'secondary'}
              />
            </div>
            <div className="hidden lg:block">
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

          {/* Feature Controls */}
          <div className="flex items-center gap-1.5 md:gap-3">
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
    <span className="text-[8px] md:text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-tight line-clamp-1">{label}</span>
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
    <span className="text-[8px] font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-tight hidden sm:block">{label}</span>
  </div>
);

export default MeetingRoom;

