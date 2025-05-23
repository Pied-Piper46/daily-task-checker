"use client";

import AuthScreen from "@/app/components/AuthScreen";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authenticate } from "@/app/services/apiService";
import { AuthPayload } from "@/types"; // Import AuthPayload from types

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home if already logged in
        const savedAuthStatus = localStorage.getItem('isAuthenticated');
        if (savedAuthStatus === 'true') {
            router.push('/');
        }
    }, [router]);

    const handleLogin = async (password: string): Promise<boolean> => {
        if (!password) {
            return false;
        }

        const payload: AuthPayload = { password };

        const result = await authenticate(payload);

        if (result.success) {
            console.log('Login successful:', result.message);
            localStorage.setItem('isAuthenticated', 'true'); // simple auth flag
            router.push('/');
            return true;
        } else {
            console.error('Login failed:', result.message);
            return false;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 w-full">
            <AuthScreen onLogin={handleLogin} />
        </div>
    )
}
