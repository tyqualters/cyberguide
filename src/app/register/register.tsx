'use client';

import { signup } from '@/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';


export default function SignupForm() {
    const [state, action, pending] = useActionState(signup, undefined)

    return (
        <div className="bg-container flex items-center justify-center min-h-[75vh]">
            <form action={action} className="formProperties bg-indigo-100 w-9/10 md:w-1/2 mx-auto mt-8 p-6 rounded-2xl space-y-6">
                <h2 className="text-4xl font-bold text-center">Create a new account</h2>

                <div>
                    <label htmlFor="username" className="block text-sm font-bold">Username</label>
                    <input
                        id="username"
                        name="username"
                        placeholder="Username"
                        className="mt-1 block w-full rounded-xl border border-blue-300 placeholder-blue-400 bg-transparent focus:border-blue-400 px-4 py-2"
                    />
                    {state?.errors?.username && <p className="text-sm text-red-500 mt-1">{state.errors.username}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-bold">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="mt-1 block w-full rounded-xl border border-blue-300 placeholder-blue-400 bg-transparent focus:border-blue-400 px-4 py-2"
                    />
                    {state?.errors?.password && (
                        <div className="text-sm text-red-500 mt-1">
                            <p>Password must:</p>
                            <ul className="list-disc pl-5">
                                {state.errors.password.map((error) => (
                                    <li key={error}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="cursor-pointer w-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 font-semibold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {pending ? 'Signing Up...' : 'Sign Up'}
                </button>
                <p className="font-bold">Already have an account? <Link href="/login" className="text-blue-300 hover:text-blue-400">Login</Link></p>
                <p className="font-bold">Return <Link href="/" className="text-blue-300 hover:text-blue-400">Home</Link></p>
            </form>
        </div>
    );
}