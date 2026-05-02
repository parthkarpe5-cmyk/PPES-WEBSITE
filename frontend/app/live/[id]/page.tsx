'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useUser } from '../../../hooks/use-user';
import { Loader2 } from 'lucide-react';
import { useGetOrCreateCall } from '../../../hooks/use-get-or-create-call';

import MeetingRoom from '../../../components/MeetingRoom';
import MeetingSetup from '../../../components/MeetingSetup';

const LiveSessionPage = () => {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const { call, isCallLoading, error } = useGetOrCreateCall(id as string);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050810] text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky/20 rounded-full blur-[120px]" />
      
      <div className="relative z-10 text-center max-w-md w-full p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl">
        <div className="w-16 h-16 bg-sky/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-sky/20">
          <Loader2 className="text-sky" size={32} />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-4">Session Secure</h2>
        <p className="text-white/40 font-medium mb-8">
          You need to be logged in to access this classroom session.
        </p>
        <a 
          href="/login/student" 
          className="block w-full py-4 rounded-xl bg-sky text-white font-black uppercase tracking-widest text-sm hover:bg-sky-500 transition-all shadow-lg shadow-sky/20 active:scale-95"
        >
          Proceed to Login
        </a>
      </div>
    </div>
  );

  if (!call) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white flex-col gap-4">
       <p className="text-2xl font-bold">Classroom Not Found</p>
       <p className="text-slate-400">The session ID "{id}" is invalid or the meeting has ended.</p>
    </div>
  );

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default LiveSessionPage;
