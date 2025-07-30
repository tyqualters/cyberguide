'use server';

import { logout } from '@/actions/auth';

export default async function Logout() {
    await logout();
}