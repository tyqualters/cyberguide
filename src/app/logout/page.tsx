'use client';

import { redirect } from 'next/navigation';
import logout from './logout';
import { useEffect } from 'react';

export default function Logout() {
        useEffect(() => {
        const doLogout = async () => {
            await logout(); // this should be a client-safe function or wrapped server action
            redirect('/');
        };
        doLogout();
    }, []);
    return (<p>Logging out...</p>);
}