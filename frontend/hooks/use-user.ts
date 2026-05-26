'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';

export interface User {
  id: string;
  name?: string;
  role: string;
  image?: string;
  email?: string;
  usn?: string;
  grade?: string;
  status?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const readUser = () => {
      const token = Cookies.get('token');
      const userData = Cookies.get('user-data');

      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUser({
            id: parsed.id,
            name: parsed.name,
            role: parsed.role,
            image: parsed.image,
            email: parsed.email,
            usn: parsed.usn,
            grade: parsed.grade,
            status: parsed.status
          });
          return;
        } catch (e) {
          console.error('Failed to parse user-data cookie');
        }
      }

      if (token) {
        try {
          const payload = decodeJwt(token);
          setUser({
            id: (payload.userId as string) || (payload.sub as string),
            name: (payload.name as string) || (payload.email as string),
            role: payload.role as string,
            image: payload.image as string,
            email: payload.email as string,
            usn: payload.usn as string,
            grade: payload.grade as string,
            status: payload.status as string,
          });
          return;
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }

      setUser(null);
    };

    const syncFromCookie = () => readUser();
    readUser();
    setIsLoaded(true);

    window.addEventListener('user-data-updated', syncFromCookie);
    return () => {
      window.removeEventListener('user-data-updated', syncFromCookie);
    };
  }, []);

  return { user, isLoaded };
};
