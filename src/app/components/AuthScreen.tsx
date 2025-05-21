"use client";

import React, { useState, useCallback } from 'react';

interface AuthScreenProps {
    onLogin: (password: string) => boolean;
}

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous error message

        if (onLogin(password)) {
            console.log('Login successful');
        } else {
            setError('Invalid password. Please try again.');
        }
    }, [password, onLogin]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 w-full">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl">
                <div className="flex flex-col items-center space-y-2">
                    <LockIcon className="w-16 h-16 text-sky-500" />
                    <h1 className="text-3xl font-bold text-center text-slate-100">Daily Task Checker Dashboard</h1>
                    <p className="text-center text-slate-400">Enter password to access</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 text-slate-100 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-200"
                            placeholder="Password"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                        <button
                        type="submit"
                        className="w-full px-4 py-3 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition duration-200"
                        >
                        Unlock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default AuthScreen;
