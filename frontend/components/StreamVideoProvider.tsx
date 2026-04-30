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
  const { user, isLoaded } = useUser(); // You'll need to adapt this to your auth system

  useEffect(() => {
    if (!isLoaded || !user || !apiKey) return;

    let isMounted = true;
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user.name || user.id,
        image: user.image,
      },
      tokenProvider,
      options: {
        timeout: 15000,
      },
    });

    const chat = StreamChat.getInstance(apiKey);
    const connectChat = async () => {
      try {
        if (chat.userID !== user.id) {
          await chat.connectUser({
            id: user.id,
            name: user.name || user.id,
            image: user.image,
          }, tokenProvider);
        }
        if (isMounted) {
          setVideoClient(client);
          setChatClient(chat);
        }
      } catch (err) {
        console.error('Failed to connect chat:', err);
      }
    };

    connectChat();

    return () => {
      isMounted = false;
      client.disconnectUser();
      chat.disconnectUser();
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
