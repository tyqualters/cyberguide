'use server';

// https://nextjs.org/docs/app/guides/authentication

import { LoginFormSchema, SignupFormSchema, FormState } from '@/lib/definitions';
import User from '@/models/user';
import connectDB from '@/lib/mongo';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { isAdmin, isValid24ByteHex } from '@/lib/dal';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {

  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();
    console.log('fml i hate coding sm');

    const { username, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    console.log('New user created.');

    // supports guest login
    await createSession(newUser._id.toString(), newUser.username);
    redirect('/');
  } catch (err: unknown) {
    console.error('User creation failed:', err);

    if (typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: number }).code === 11000) {
      return {
        message: 'Username is already in use.',
      };
    }

    return {
      message: 'Signup failed. Please try again.',
    };
  }

}

export async function authenticateUser(username: string, password: string) {
  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user; // Authentication successful
}

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();
    console.log('fml i hate coding sm');

    const { username, password } = validatedFields.data;
    const user = await authenticateUser(username, password);

    console.log('User logged in.');

    // supports guest login
    await createSession(user._id.toString(), user.username);
    redirect('/profile'); // This triggers an internal redirect
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      typeof (err as Record<string, unknown>).code === 'number' &&
      (err as Record<string, unknown>).code === 11000
    )

      console.error('User authentication failed:', err);

    const message =
      typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as Record<string, unknown>).message === 'string'
        ? (err as Record<string, unknown>).message
        : 'Login failed. Please check your credentials.';

    const safeMessage: string = typeof message === 'string' ? message : 'Login failed. Please check your credentials.';

    return { message: safeMessage };
  }
}

export async function admin_getAllUsers(id: string) {
  if(isValid24ByteHex(id) && !isAdmin(id)) {
    return 'Not authorized.';
  }

  try {
    await connectDB();
    const users = User.find().sort({ createdAt: -1 }).lean(); // newest first
    return users;
  } catch (err) {
    console.error('Failed to fetch docs:', err);
    return [];
  }
}

export async function logout() {
  await deleteSession();
}
