"use client";

import React from 'react';
import DeviceCard from './DeviceCard';
import { Device, Status } from '@/types';
import Link from 'next/link';

// Mock data for devices
const mockDevices: Device[] = [
  { deviceId: 'device-001', taskName: 'メダカの餌やり', status: Status.DONE, lastUpdatedAt: '10:30 AM' },
  { deviceId: 'device-002', taskName: '観葉植物の水やり', status: Status.NOT_DONE, lastUpdatedAt: '昨日' },
  // ... other devices
];

const Dashboard: React.FC = () => {
  const handleHistory = (device: Device) => console.log(`History for ${device.deviceId}`);
  const handleEdit = (device: Device) => console.log(`Edit for ${device.deviceId}`);
  const handleDelete = (device: Device) => console.log(`Delete for ${device.deviceId}`);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center py-4 mb-8 border-b">
        <h1 className="text-3xl font-bold text-gray-800">IoTタスク管理</h1>
        <div>
          <Link href="/devices/register" legacyBehavior>
            <a className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2">
              デバイス追加
            </a>
          </Link>
          {/* TODO: ログアウトボタン */}
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded">
            ログアウト
          </button>
        </div>
      </header>

      {mockDevices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">まだデバイスが登録されていません。</p>
          <Link href="/devices/register" legacyBehavior>
              <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-lg">
                最初のデバイスを登録する
              </a>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDevices.map(device => (
            <DeviceCard
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