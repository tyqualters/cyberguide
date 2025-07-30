// data access layer
// userId = session token field (represents authenticated user's ID)

import 'server-only'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { decrypt } from '@/lib/session';
import User from '@/models/user';
import connectDB from "@/lib/mongo";

export function isValid24ByteHex(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return { isAuth: false, userId: null };
  }

  return { isAuth: true, userId: session.userId };
})

// This just doesn't redirect
export const _verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return false;
  }

  return true;
})

export const getUserId = (async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  } else {
    return session.userId;
  }
});

export async function isAdmin(id: string) {
  if (!isValid24ByteHex(id)) {
    console.error(`Admin ID check error: not 24 byte hex string. ID: ${id}`);
    return false;
  }

  try {
    await connectDB();

    const data = await User.find({ _id: id }).lean();

    const user = data[0]

    return user.isAdmin

  } catch (error: unknown) {
    const message =
      typeof error === 'object' &&
        error !== null &&
        'message' in error
        ? String((error as { message: unknown }).message)
        : 'unknown error';

    console.log('Failed to fetch user: %s', message || 'unknown error')
    return false;
  }
}

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    await connectDB();
    const data = await User.find({ _id: session.userId }).lean();

    const user = data[0]

    return user
  } catch (error: unknown) {
    const message =
      typeof error === 'object' &&
        error !== null &&
        'message' in error
        ? String((error as { message: unknown }).message)
        : 'unknown error';

    console.log('Failed to fetch user: %s', message || 'unknown error')
    return null
  }
})