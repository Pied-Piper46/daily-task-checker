"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Device } from '@/types';
import { mockApi } from '@/app/services/mockService';
import DeviceCard from '@/app/components/DeviceCard';
import RegisterDeviceModal from '@/app/components/modals/RegisterDeviceModal';
import { PlusIcon, LogoutIcon, DeviceTabletIcon } from '@/app/components/icons/SolidIcons';

interface DashboardProps {
    onLogout: () => void;
}


const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {

    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

    const fetchDevices = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedDevices = await mockApi.getDevices();
            setDevices(fetchedDevices);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch devices.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const handleOpenRegisterModal = () => setIsRegisterModalOpen(true);

    const closeModalAndRefresh = () => {
        setIsRegisterModalOpen(false);
        fetchDevices();
    };

    const handleHistory = (device: Device) => console.log(`History for ${device.deviceId}`);
    const handleEdit = (device: Device) => console.log(`Edit for ${device.deviceId}`);
    const handleDelete = (device: Device) => console.log(`Delete for ${device.deviceId}`);

    return (
        <div className="min-h-screen bg-slate-900 p-4 md:p-8 w-full flex flex-col">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center">
                    <DeviceTabletIcon className="w-10 h-10 mr-3 text-sky-400" />
                    Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                    <button
                    onClick={handleOpenRegisterModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-200 flex items-center"
                    aria-label="Register New Device"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Register Device
                    </button>
                    <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-200 flex items-center"
                    aria-label="Logout"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2" />
                        Logout
                    </button>
                </div>
            </header>

            {isLoading && (
                <div className="flex-grow flex justify-center items-center h-64"> {/* Added flex-grow */}
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500" role="status" aria-label="Loading devices"></div>
                </div>
            )}
            {error && <p className="text-center text-red-400 bg-red-900 p-3 rounded-md" role="alert">{error}</p>}
            
            {!isLoading && !error && devices.length === 0 && (
                <div className="flex-grow text-center text-slate-400 py-10"> {/* Added flex-grow */}
                <p className="text-xl mb-2">No devices registered yet.</p>
                <p>Click "Register Device" to add your first IoT device.</p>
                </div>
            )}

            {!isLoading && !error && devices.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map(device => (
                    <DeviceCard
                    key={device.deviceId}
                    device={device}
                    onViewHistory={handleHistory}
                    onChangeTask={handleEdit}
                    onDelete={handleDelete}
                    />
                ))}
                </div>
            )}

            {isRegisterModalOpen && (
                <RegisterDeviceModal
                    isOpen={isRegisterModalOpen}
                    onClose={closeModalAndRefresh}
                    onDeviceRegistered={closeModalAndRefresh}
                />
            )}
        </div>
    );
};

export default Dashboard;