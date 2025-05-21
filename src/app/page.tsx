"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Dashboard from '@/app/components/Dashboard';


export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const savedAuthStatus = sessionStorage.getItem('isAuthenticated');

        if (savedAuthStatus === 'true') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.push('/login');
        }
        setIsLoading(false);
    }, [router]);

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        router.push('/login');
    }, [router]);

    const pageTitle = "Daily Task Checker Dashboard";
    const pageDescription = "A web application to register, monitor, and manage IoT devices, displaying their task status and history. Designed for ESP32-based devices with LED matrix displays.";

    if (isLoading) {
        return (
            <>
                <Head>
                    <title>Loading... - {pageTitle}</title>
                </Head>
                <div className="flex items-center justify-center min-h-screen bg-slate-900 w-full">
                    <div className="text-2xl text-slate-300">Loading...</div>
                </div>
            </>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <Head>
                    <title>Authentication - {pageTitle}</title>
                    <meta name="description" content={pageDescription} />
                </Head>
                <div className="flex items-center justify-center min-h-screen bg-slate-900 w-full">
                    <div className="text-2xl text-slate-300">Redirecting to login...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
            </Head>
            <Dashboard onLogout={handleLogout} />;
        </>
    );
}