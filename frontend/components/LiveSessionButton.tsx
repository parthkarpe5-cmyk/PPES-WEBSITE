'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface LiveSessionButtonProps {
  className?: string;
  title?: string;
  facultyId: string;
}

export const LiveSessionButton = ({ className, title = 'Instant Class', facultyId }: LiveSessionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const meetingId = `session_${Math.random().toString(36).substring(2, 10)}`;
      
      // 1. Register the session in our backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/live/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          facultyId,
          meetingId,
          status: 'live'
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      // 2. Redirect to the live room
      router.push(`/live/${meetingId}`);
      toast.success('Live session started!');
    } catch (error) {
      console.error(error);
      toast.error('Could not start live session. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleStartSession}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
      {isLoading ? 'Starting...' : 'Start Instant Class'}
    </Button>
  );
};
