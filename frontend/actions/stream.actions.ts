'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const jwtSecret = process.env.JWT_SECRET;

export const tokenProvider = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!apiKey || !apiSecret) throw new Error('Stream config missing');
    if (!token || !jwtSecret) throw new Error('Unauthorized: No session token found');

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    
    const userId = payload.userId as string;
    const userRole = payload.role as string;
    const userName = payload.name as string;

    if (!userId) throw new Error('User ID not found');

    const { StreamClient } = await import('@stream-io/node-sdk');
    const client = new StreamClient(apiKey, apiSecret);

    // 3. Upsert user to ensure they have the correct role/permissions
    await client.upsertUsers([
      {
        id: userId,
        name: userName || userId,
        role: userRole === 'admin' || userRole === 'faculty' ? 'admin' : 'user',
      }
    ]);

    const validity = 60 * 60 * 24; 
    return client.generateUserToken({ user_id: userId, validity_in_seconds: validity });
  } catch (error) {
    console.error('Error in tokenProvider:', error);
    throw new Error('Failed to generate stream token');
  }
};
