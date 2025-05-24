"use client";

import React, { useState, useCallback } from 'react';
import { ModalProps, DeviceRegistrationPayload } from '@/types'; // Import DeviceRegistrationPayload from types
import { registerDevice } from "@/app/services/apiService";
import ModalBase from '@/app/components/modals/ModalBase';

interface RegisterDeviceModalProps extends ModalProps {
    onDeviceRegistered: () => void;
}

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
        <ModalBase isOpen={isOpen} onClose={onClose} title="Register New IoT Device">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="deviceId" className="block text-sm font-medium text-slate-300 mb-1">
                        Device ID (from ESP32)
                    </label>
                    <input
                        type="text"
                        id="deviceId"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-slate-100 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none"
                        placeholder="e.g., ESP32_MAC_XYZ123"
                        aria-describedby={error ? "register-error" : undefined}
                    />
                </div>
                <div>
                    <label htmlFor="taskName" className="block text-sm font-medium text-slate-300 mb-1">
                        Initial Task Name
                    </label>
                    <input
                        type="text"
                        id="taskName"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-slate-100 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none"
                        placeholder="e.g., Morning Coffee Check"
                    />
                </div>
                {error && <p id="register-error" className="text-red-400 text-sm" role="alert">{error}</p>}
                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 rounded-md hover:bg-slate-500 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:bg-sky-800 transition-colors flex items-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="status" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isLoading ? 'Registering...' : 'Register Device'}
                    </button>
                </div>
            </form>
        </ModalBase>
    );
};

export default RegisterDeviceModal;
