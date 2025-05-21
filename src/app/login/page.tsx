"use client";

import AuthScreen from "@/app/components/AuthScreen";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home if already logged in
        const savedAuthStatus = sessionStorage.getItem('isAuthenticated');
        if (savedAuthStatus === 'true') {
            router.push('/');
        }
    }, [router]);

    // Dummy password handling for demonstration purposes
    const handleLogin = (password: string): boolean => {
        const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD_DEV;

        if (password === correctPassword) {
            sessionStorage.setItem('isAuthenticated', 'true');
            router.push('/');
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 w-full">
            <AuthScreen onLogin={handleLogin} />
        </div>
    )
}
