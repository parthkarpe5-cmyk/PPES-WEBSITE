'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import { useUser } from '../hooks/use-user';
import { tokenProvider } from '../actions/stream.actions';
import { Loader2 } from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const [chatClient, setChatClient] = useState<StreamChat>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user || !apiKey) return;

    let isMounted = true;
    let videoClientInstance: StreamVideoClient | null = null;

    const initClients = async () => {
      try {
        // Initialize Video Client
        const vClient = new StreamVideoClient({
          apiKey,
          user: {
            id: user.id,
            name: user.name || user.id,
            image: user.image,
          },
          tokenProvider,
          options: { timeout: 15000 }
        });

        // Initialize Chat Client (Singleton to avoid sync issues)
        const cClient = StreamChat.getInstance(apiKey);
        if (cClient.userID !== user.id) {
          await cClient.connectUser({
            id: user.id,
            name: user.name || user.id,
            image: user.image,
          }, tokenProvider);
        }

        if (isMounted) {
          videoClientInstance = vClient;
          setVideoClient(vClient);
          setChatClient(cClient);
        } else {
          // Cleanup if unmounted during async connection
          vClient.disconnectUser().catch(() => { });
        }
      } catch (err) {
        console.error('Stream initialization failed:', err);
      }
    };

    initClients();

    return () => {
      isMounted = false;
      if (videoClientInstance) {
        videoClientInstance.disconnectUser().catch(() => { });
      }
      // Note: We don't disconnect the chat singleton immediately in dev mode 
      // to prevent the "Synchronizing chat..." hang caused by React Strict Mode.
      setVideoClient(undefined);
      setChatClient(undefined);
    };
  }, [user?.id, isLoaded]);


  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user || !videoClient || !chatClient) {
    return <>{children}</>;
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient}>{children}</Chat>
    </StreamVideo>
  );
};
