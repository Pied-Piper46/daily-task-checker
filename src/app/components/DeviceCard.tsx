"use client";

import React from 'react';
import { Device, Status } from '@/types'; // Device is now the standard
import { STATUS_DISPLAY } from '@/constants';
// DeviceData is no longer exported from apiService
import { CheckCircleIconSolid, XCircleIconSolid, CalendarDaysIconOutline, PencilSquareIconOutline, TrashIconOutline } from '@/app/components/icons/SolidAndOutlineIcons';
import { formatToJapanDateTime } from '@/lib/dateUtils';

interface DeviceCardProps {
    device: Device; // Changed to Device
    onViewHistory: (device: Device) => void; // Changed to Device
    onChangeTask: (device: Device) => void; // Changed to Device
    onDelete: (device: Device) => void; // Changed to Device
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onViewHistory, onChangeTask, onDelete }) => {
    // Ensure currentStatus is always a valid Status enum value for display
    const currentStatusEnum: Status = device.currentStatus === 'DONE' ? Status.DONE : Status.NOT_DONE;

    const isDone = currentStatusEnum === Status.DONE;
    const statusColor = isDone ? 'text-emerald-400' : 'text-amber-400';
    const statusIcon = isDone
        ? <CheckCircleIconSolid className={`w-7 h-7 ${statusColor}`} aria-label="Status Done" />
        : <XCircleIconSolid className={`w-7 h-7 ${statusColor}`} aria-label="Status Not Done" />;

    return (
        <article className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 hover:shadow-2xl hover:from-slate-750 hover:to-slate-850 transition-all duration-300 flex flex-col justify-between border border-slate-700/50 hover:border-slate-600/50 transform hover:scale-[1.02] group" aria-labelledby={`device-task-${device.deviceId}`}>
            <div>
                <div className="flex items-start justify-between mb-3">
                    <h3 id={`device-task-${device.deviceId}`} className="text-xl font-semibold text-slate-100 truncate flex-1 mr-2" title={device.taskName}>
                        {device.taskName}
                    </h3>
                    <div className="flex items-center">
                        {statusIcon}
                    </div>
                </div>
                <p className="text-xs text-slate-400 mb-4 font-mono bg-slate-900/50 px-2 py-1 rounded-md inline-block">
                    ID: {device.deviceId}
                </p>
                <div className="mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isDone ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' : 'bg-amber-900/50 text-amber-300 border border-amber-700/50'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${isDone ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></div>
                        {STATUS_DISPLAY[currentStatusEnum]}
                    </div>
                </div>
                <p className="text-sm text-slate-400 mb-3 flex items-center">
                    <span className="text-slate-500 mr-2">Last updated:</span>
                    <span className="font-medium">
                        {device.lastUpdatedAt ? formatToJapanDateTime(device.lastUpdatedAt) : 'None'}
                    </span>
                </p>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => onViewHistory(device)}
                    title="View History"
                    aria-label={`View history for ${device.taskName}`}
                    className="flex-1 p-2.5 text-sm text-sky-300 hover:bg-sky-700/30 hover:text-sky-100 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-sky-700/30 hover:border-sky-600/50 group-hover:shadow-md"
                >
                    <CalendarDaysIconOutline className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                    <span className="sm:hidden">View</span>
                </button>
                <button
                    onClick={() => onChangeTask(device)}
                    title="Change Task Name"
                    aria-label={`Edit task name for ${device.taskName}`}
                    className="flex-1 p-2.5 text-sm text-yellow-300 hover:bg-yellow-700/30 hover:text-yellow-100 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-yellow-700/30 hover:border-yellow-600/50 group-hover:shadow-md"
                >
                    <PencilSquareIconOutline className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">Edit</span>
                </button>
                <button
                    onClick={() => onDelete(device)}
                    title="Delete Device"
                    aria-label={`Delete device ${device.taskName}`}
                    className="flex-1 p-2.5 text-sm text-red-300 hover:bg-red-700/30 hover:text-red-100 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-red-700/30 hover:border-red-600/50 group-hover:shadow-md"
                >
                    <TrashIconOutline className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                </button>
            </div>
        </article>
    );
};

export default DeviceCard;
