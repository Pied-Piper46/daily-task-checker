"use client";

import React, { useState, useCallback } from 'react';
import TaskCheckerLogo from '@/app/components/icons/TaskCheckerLogo';

interface AuthScreenProps {
    onLogin: (password: string) => Promise<boolean>;
}

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.243 4.243L9.88 9.88" />
    </svg>
);

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await onLogin(password);
            if (!success) {
                setError('Invalid password. Please try again.');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [password, onLogin]);

    return (
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 lg:w-96 lg:h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 lg:w-[32rem] lg:h-[32rem] bg-indigo-500/5 rounded-full blur-3xl"></div>
                <div className="hidden lg:block absolute top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="hidden lg:block absolute bottom-20 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl mx-4 lg:mx-8">
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-700/50 p-8 lg:p-12 space-y-8 lg:space-y-10 animate-fadeInUp">
                    {/* Header */}
                    <div className="text-center space-y-4 lg:space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg">
                                    <TaskCheckerLogo 
                                        checkColor="#294073" 
                                        plusColor="#10b981" 
                                        circleColor="#294073"
                                        size="custom"
                                        customSize="w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18"
                                    />
                                </div>
                                {/* <div className="absolute -top-1 -right-1 w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                                    <LockIcon className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-white" />
                                </div> */}
                            </div>
                        </div>
                        <div className="space-y-2 lg:space-y-3">
                            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-100 text-shadow-sm">
                                IoT Dashboard
                            </h1>
                            <p className="text-slate-400 text-lg lg:text-xl xl:text-2xl">Daily Task Checker</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                        <div className="space-y-2 lg:space-y-3">
                            {/* <label htmlFor="password" className="block text-sm lg:text-base font-medium text-slate-300">
                                Password
                            </label> */}
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 lg:px-6 lg:py-4 pr-12 lg:pr-14 text-slate-100 text-base lg:text-lg bg-slate-700/50 border border-slate-600/50 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 backdrop-blur-sm placeholder-slate-400"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-900/50 border border-red-700/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center animate-slideInRight">
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-300 text-sm lg:text-base font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 lg:px-8 lg:py-4 font-semibold text-white text-base lg:text-lg bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl lg:rounded-2xl hover:from-sky-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <LockIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                                    <span>Unlock Dashboard</span>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-4 lg:pt-6 border-t border-slate-700/50">
                        <p className="text-slate-500 text-xs lg:text-sm">
                            Secure authentication • IoT Device Management
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
