"use client";

import React, { useState, useCallback } from 'react';
import { ModalProps, DeviceRegistrationPayload } from '@/types'; // Import DeviceRegistrationPayload from types
import { registerDevice } from "@/app/services/apiService";
import ModalBase from '@/app/components/modals/ModalBase';
import { DeviceTabletIcon, PlusIcon } from '@/app/components/icons/SolidIcons';
import { ExclamationTriangleIcon } from '@/app/components/icons/SolidIcons';

interface RegisterDeviceModalProps extends ModalProps {
    onDeviceRegistered: () => void;
}

// Custom icons for the form
const ChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-16.5 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a3 3 0 003-3V5.25a3 3 0 00-3-3H6.75a3 3 0 00-3 3v13.5a3 3 0 003 3z" />
    </svg>
);

const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);

const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({ isOpen, onClose, onDeviceRegistered }) => {
    const [deviceId, setDeviceId] = useState<string>('');
    const [taskName, setTaskName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // Validate inputs
            if (!deviceId || !taskName) {
                setError('Device ID and task name are required.');
                setIsLoading(false);
                return;
            }
            if (deviceId.trim() === '' || taskName.trim() === '') {
                setError('Invalid device ID or task name.');
                setIsLoading(false);
                return;
            }

            const payload: DeviceRegistrationPayload = {
                deviceId,
                taskName,
            };

            await registerDevice(payload);

            setDeviceId(''); // Clear fields on success
            setTaskName('');
            onDeviceRegistered();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register device.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [deviceId, taskName, onDeviceRegistered]);

    // Clear form and error when modal is closed/reopened
    React.useEffect(() => {
        if (!isOpen) {
            setDeviceId('');
            setTaskName('');
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title="Register New IoT Device" size="lg">
            <div className="space-y-6">
                {/* Header with icon */}
                {/* <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <DeviceTabletIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <PlusIcon className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div> */}

                <div className="text-center mb-6">
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Connect your ESP32 device to the IoT dashboard by providing the device ID and setting up an initial task.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Device ID Field */}
                    <div className="space-y-2">
                        <label htmlFor="deviceId" className="flex items-center text-sm font-medium text-slate-300 mb-2">
                            <ChipIcon className="w-4 h-4 mr-2 text-sky-400" />
                            Device ID (from ESP32)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="deviceId"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                required
                                className="w-full px-4 py-3 pl-12 text-slate-100 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 backdrop-blur-sm placeholder-slate-400"
                                placeholder="e.g., ESP32_MAC_XYZ123"
                                aria-describedby={error ? "register-error" : undefined}
                            />
                            <ChipIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            This unique identifier is generated by your ESP32 device
                        </p>
                    </div>

                    {/* Task Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="taskName" className="flex items-center text-sm font-medium text-slate-300 mb-2">
                            <TagIcon className="w-4 h-4 mr-2 text-emerald-400" />
                            Initial Task Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="taskName"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                                className="w-full px-4 py-3 pl-12 text-slate-100 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 backdrop-blur-sm placeholder-slate-400"
                                placeholder="e.g., Morning Coffee Check"
                            />
                            <TagIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            You can change your task name anytime from Edit buttton
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-xl p-4 animate-slideInRight">
                            <div className="flex items-center space-x-3">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <div>
                                    <p id="register-error" className="text-red-300 text-sm font-medium" role="alert">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-3 text-sm font-medium text-slate-300 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm border border-slate-600/30"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl hover:from-sky-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    <span>Registering...</span>
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    <span>Register Device</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalBase>
    );
};

export default RegisterDeviceModal;
