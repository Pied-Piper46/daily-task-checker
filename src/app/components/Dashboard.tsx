"use client";

import React from 'react';
import DeviceCard from '@/app/components/DeviceCard';
import { Device, Status } from '@/types';
import { PlusIcon, LogoutIcon, DeviceTabletIcon } from '@/app/components/icons/SolidIcons';
import Link from 'next/link';

interface DashboardProps {
    onLogout: () => void;
}

// Mock data for devices
const mockDevices: Device[] = [
  { deviceId: 'device-001', taskName: 'メダカの餌やり', status: Status.DONE, lastUpdatedAt: '10:30 AM' },
  { deviceId: 'device-002', taskName: '観葉植物の水やり', status: Status.NOT_DONE, lastUpdatedAt: '昨日' },
  // ... other devices
];

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const handleHistory = (device: Device) => console.log(`History for ${device.deviceId}`);
  const handleEdit = (device: Device) => console.log(`Edit for ${device.deviceId}`);
  const handleDelete = (device: Device) => console.log(`Delete for ${device.deviceId}`);

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 w-full flex flex-col">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center">
                <DeviceTabletIcon className="w-10 h-10 mr-3 text-sky-400" />
                Daily Task Checker Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <button
                // onClick={handleOpenRegisterModal}
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

        {mockDevices.length === 0 ? (
            <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">まだデバイスが登録されていません。</p>
            <Link href="/devices/register">
                <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-lg">
                    最初のデバイスを登録する
                </a>
            </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDevices.map(device => (
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
        </div>
    );
};

export default Dashboard;