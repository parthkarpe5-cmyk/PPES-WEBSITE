'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const jwtSecret = process.env.JWT_SECRET;

export const tokenProvider = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!apiKey || !apiSecret) throw new Error('Stream config missing');

  let userId: string;

  try {
    if (token && jwtSecret) {
      // 1. Normal Path: Verify our app's JWT token
      const secret = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId as string;
    } else {
      // 2. Bypass Path: Use a consistent guest ID for testing
      // We can use a simple hash or just 'guest_test_user' for now
      userId = 'guest_test_user';
      console.log('Bypassing auth for consistent user:', userId);
    }

    if (!userId) throw new Error('User ID not found');

    const { StreamClient } = await import('@stream-io/node-sdk');
    const client = new StreamClient(apiKey, apiSecret);

    const validity = 60 * 60; // 1 hour
    const streamToken = client.generateUserToken({ user_id: userId, validity_in_seconds: validity });

    return streamToken;
  } catch (error) {
    console.error('Error in tokenProvider:', error);
    throw new Error('Failed to generate stream token');
  }
};
