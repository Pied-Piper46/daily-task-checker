"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/app/components/Dashboard';


// Dashboard Placeholder
const DashboardPlaceholder = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 w-full">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-slate-100">Dashboard</h1>
        <p className="text-center text-slate-400">Welcome to the dashboard!</p>
      </div>
    </div>
  );
};

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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 w-full">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // TODO: Handle unauthenticated state
  }

  return <Dashboard />;
}
