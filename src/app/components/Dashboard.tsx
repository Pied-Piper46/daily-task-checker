"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { mockApi } from '@/app/services/mockService';
import { Device } from '@/types'; // Import Device from types
import { getAllDevices } from '@/app/services/apiService';
import DeviceCard from '@/app/components/DeviceCard';
// DeviceData is no longer exported from apiService, using Device from types
import RegisterDeviceModal from '@/app/components/modals/RegisterDeviceModal';
import DeviceHistoryModal from '@/app/components/modals/DeviceHistoryModal';
import ChangeTaskNameModal from '@/app/components/modals/ChangeTaskNameModal';
import ConfirmationModal from '@/app/components/modals/ConfirmationModal';
import { PlusIcon, LogoutIcon, DeviceTabletIcon } from '@/app/components/icons/SolidIcons';

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
                <p>Click &quot;Register Device&quot; to add your first IoT device.</p>
                </div>
            )}

            {!isLoading && !error && devices.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map(device => (
                    <DeviceCard
                    key={device.deviceId}
                    device={device}
                    onViewHistory={handleOpenHistoryModal}
                    onChangeTask={handleOpenChangeTaskModal}
                    onDelete={handleOpenDeleteModal}
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
                            await mockApi.deleteDevice(selectedDevice.deviceId);
                            handleDeviceDeleted();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
