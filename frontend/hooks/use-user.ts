'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';

export interface User {
  id: string;
  name?: string;
  role: string;
  image?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const payload = decodeJwt(token);
        setUser({
          id: (payload.userId as string) || (payload.sub as string),
          name: (payload.name as string) || (payload.email as string),
          role: payload.role as string,
          image: payload.image as string,
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      // BYPASS: Provide a guest user for testing
      setUser({
        id: 'guest_test_user',
        name: 'Guest Tester',
        role: 'student',
        image: 'https://getstream.io/random_svg/?id=guest&name=Guest'
      });
    }
    setIsLoaded(true);
  }, []);

  return { user, isLoaded };
};
