import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetOrCreateCall = (id: string) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const [error, setError] = useState<string>();

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client || !id) {
      setIsCallLoading(false);
      return;
    }
    
    const loadCall = async (retryCount = 0) => {
      try {
        const newCall = client.call('default', id);
        
        // This will create the call if it doesn't exist, or fetch it if it does
        await newCall.getOrCreate({
          data: {
            starts_at: new Date().toISOString(),
          }
        });

        setCall(newCall);
        setIsCallLoading(false);
        setError(undefined);
      } catch (err: any) {
        console.error(`Error getting/creating call (attempt ${retryCount + 1}):`, err);
        
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => loadCall(retryCount + 1), delay);
        } else {
          setError(err.message);
          setIsCallLoading(false);
        }
      }
    };

    loadCall();
  }, [client, id]);

  return { call, isCallLoading, error };
};
