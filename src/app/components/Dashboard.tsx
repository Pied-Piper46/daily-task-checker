"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Device } from '@/types'; // Import Device from types
import { getAllDevices, deleteDevice } from '@/app/services/apiService';
import DeviceCard from '@/app/components/DeviceCard';
// DeviceData is no longer exported from apiService, using Device from types
import RegisterDeviceModal from '@/app/components/modals/RegisterDeviceModal';
import DeviceHistoryModal from '@/app/components/modals/DeviceHistoryModal';
import ChangeTaskNameModal from '@/app/components/modals/ChangeTaskNameModal';
import ConfirmationModal from '@/app/components/modals/ConfirmationModal';
import { PlusIcon, LogoutIcon } from '@/app/components/icons/SolidIcons';
import TaskCheckerLogo from '@/app/components/icons/TaskCheckerLogo';

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {

    const [devices, setDevices] = useState<Device[]>([]); // Changed to Device[]
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
    const [isChangeTaskModalOpen, setIsChangeTaskModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null); // Changed to Device

    const fetchDevices = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            // const fetchedDevices = await mockApi.getDevices();
            const result = await getAllDevices();
            if (Array.isArray(result)) {
                setDevices(result);
            } else {
                setError(result.message || 'Failed to fetch devices.');
                console.error(result.message);
                setDevices([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch devices.');
            console.error(err);
            setDevices([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const handleOpenRegisterModal = () => setIsRegisterModalOpen(true);

    const handleOpenHistoryModal = (device: Device) => { // Changed to Device
        setSelectedDevice(device);
        setIsHistoryModalOpen(true);
    };

    const handleOpenChangeTaskModal = (device: Device) => { // Changed to Device
        setSelectedDevice(device);
        setIsChangeTaskModalOpen(true);
    };

    const handleOpenDeleteModal = (device: Device) => { // Changed to Device
        setSelectedDevice(device);
        setIsDeleteModalOpen(true);
    };

    const closeModalAndRefresh = () => {
        setIsRegisterModalOpen(false);
        setIsHistoryModalOpen(false);
        setIsChangeTaskModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedDevice(null);
        fetchDevices();
    };

    const handleDeviceDeleted = () => {
        if (selectedDevice) {
            setDevices(prev => prev.filter(d => d.deviceId !== selectedDevice.deviceId));
        }
        closeModalAndRefresh();
    };

    return (
        <div className="min-h-screen bg-slate-900 p-4 md:p-8 w-full flex flex-col">
            <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 -mx-4 md:-mx-8 px-4 md:px-8 py-4 mb-8">
                <div className="flex justify-between items-center min-h-[4rem] md:min-h-[5rem]">
                    {/* Logo and Title Section - Left */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="flex-shrink-0">
                            <TaskCheckerLogo 
                                checkColor="#3b82f6" 
                                plusColor="#10b981" 
                                circleColor="#3b82f6"
                                size="xl"
                            />
                        </div>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-100">
                            <span className="hidden sm:inline">Dashboard</span>
                            <span className="sm:hidden">IoT</span>
                        </h1>
                    </div>
                    
                    {/* Actions Section - Right */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button
                        onClick={handleOpenRegisterModal}
                        className="px-3 py-2 md:px-4 md:py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                        aria-label="Register New Device"
                        >
                            <PlusIcon className="w-5 h-5 md:mr-2" />
                            <span className="hidden md:inline">Register Device</span>
                            <span className="md:hidden sr-only">Register</span>
                        </button>
                        <button
                        onClick={onLogout}
                        className="px-3 py-2 md:px-4 md:py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                        aria-label="Logout"
                        >
                            <LogoutIcon className="w-5 h-5 md:mr-2" />
                            <span className="hidden md:inline">Logout</span>
                            <span className="md:hidden sr-only">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {isLoading && (
                <div className="flex-grow flex flex-col justify-center items-center h-64 space-y-4">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-sky-500 border-r-sky-500 absolute top-0 left-0"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-300 text-lg font-medium">Loading devices...</p>
                        <p className="text-slate-500 text-sm mt-1">Please wait while we fetch your IoT devices</p>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="max-w-md mx-auto bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-xl p-6 text-center" role="alert">
                    <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-red-300 font-semibold text-lg mb-2">Oops! Something went wrong</h3>
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                        onClick={fetchDevices}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            {!isLoading && !error && devices.length === 0 && (
                <div className="flex-grow flex flex-col justify-center items-center py-16 text-center max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center border-2 border-dashed border-slate-600">
                        <TaskCheckerLogo 
                            checkColor="#64748b" 
                            plusColor="#64748b" 
                            circleColor="#64748b"
                            size="xl"
                        />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-300 mb-3">No devices yet</h3>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        Get started by registering your first IoT device. 
                        Monitor tasks, track status, and manage your connected devices all in one place.
                    </p>
                    <button
                        onClick={handleOpenRegisterModal}
                        className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Register Your First Device</span>
                    </button>
                </div>
            )}

            {!isLoading && !error && devices.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device, index) => (
                    <div 
                        key={device.deviceId}
                        className="animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <DeviceCard
                            device={device}
                            onViewHistory={handleOpenHistoryModal}
                            onChangeTask={handleOpenChangeTaskModal}
                            onDelete={handleOpenDeleteModal}
                        />
                    </div>
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

            {selectedDevice && isHistoryModalOpen && (
                <DeviceHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={closeModalAndRefresh}
                    device={selectedDevice}
                />
            )}

            {selectedDevice && isChangeTaskModalOpen && (
                <ChangeTaskNameModal
                    isOpen={isChangeTaskModalOpen}
                    onClose={closeModalAndRefresh}
                    device={selectedDevice}
                    onTaskNameChanged={closeModalAndRefresh}
                />
            )}

            {selectedDevice && isDeleteModalOpen && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeModalAndRefresh}
                    title={`Delete device ${selectedDevice.taskName}?`}
                    message={`Are you sure you want to delete the device \"${selectedDevice.taskName}\" (ID: ${selectedDevice.deviceId})? This action cannot be undone.`}
                    confirmText="Delete"
                    onConfirm={async () => {
                        if (selectedDevice) {
                            await deleteDevice(selectedDevice.deviceId);
                            handleDeviceDeleted();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
