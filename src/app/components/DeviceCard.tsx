"use client";

import React from 'react';
import { Device, Status } from '@/types';
import { STATUS_DISPLAY } from '@/constants';
import { CheckCircleIconSolid, XCircleIconSolid, CalendarDaysIconOutline, PencilSquareIconOutline, TrashIconOutline } from '@/app/components/icons/SolidAndOutlineIcons';

interface DeviceCardProps {
    device: Device;
    onViewHistory: (device: Device) => void;
    onChangeTask: (device: Device) => void;
    onDelete: (device: Device) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onViewHistory, onChangeTask, onDelete }) => {
    const isDone = device.status === Status.DONE;
    const statusColor = isDone ? 'text-emerald-400' : 'text-amber-400';
    const statusIcon = isDone
        ? <CheckCircleIconSolid className={`w-7 h-7 ${statusColor}`} aria-label="Status Done" />
        : <XCircleIconSolid className={`w-7 h-7 ${statusColor}`} aria-label="Status Not Done" />;

    return (
        <article className="bg-slate-800 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between" aria-labelledby={`device-task-${device.deviceId}`}>
            <div>
                <h3 id={`device-task-${device.deviceId}`} className="text-xl font-semibold text-slate-100 mb-1 truncate" title={device.taskName}>
                    {device.taskName}
                </h3>
                <p className="text-xs text-slate-400 mb-3">ID: {device.deviceId}</p>
                <div className="flex items-center mb-4">
                    {statusIcon}
                    <span className={`ml-2 text-lg font-medium ${statusColor}`}>
                        {STATUS_DISPLAY[device.status]}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                    Last updated: {device.lastUpdatedAt}
                </p>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-700 flex space-x-2">
                <button
                    onClick={() => onViewHistory(device)}
                    title="View History"
                    aria-label={`View history for ${device.taskName}`}
                    className="flex-1 p-2 text-sm text-sky-300 hover:bg-sky-700 hover:text-sky-100 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                    <CalendarDaysIconOutline className="w-5 h-5" />
                    <span>History</span>
                </button>
                <button
                    onClick={() => onChangeTask(device)}
                    title="Change Task Name"
                    aria-label={`Edit task name for ${device.taskName}`}
                    className="flex-1 p-2 text-sm text-yellow-300 hover:bg-yellow-700 hover:text-yellow-100 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                    <PencilSquareIconOutline className="w-5 h-5" />
                    <span>Edit</span>
                </button>
                <button
                    onClick={() => onDelete(device)}
                    title="Delete Device"
                    aria-label={`Delete device ${device.taskName}`}
                    className="flex-1 p-2 text-sm text-red-300 hover:bg-red-700 hover:text-red-200 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                    <TrashIconOutline className="w-5 h-5" />
                    <span>Delete</span>
                </button>
            </div>
        </article>
    );
};

export default DeviceCard;