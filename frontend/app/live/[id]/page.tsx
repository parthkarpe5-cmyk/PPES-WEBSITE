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
    <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white flex-col gap-4">
      <p className="text-2xl font-bold">Authentication Required</p>
      <p className="text-slate-400">Please login to join the live session.</p>
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
