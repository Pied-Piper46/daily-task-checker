import React, { useState, useEffect, useCallback } from 'react';
import {ModalProps, Device, HistoryEntry, Status } from '@/types'; // Import Device from types
import { getDeviceHistory } from '@/app/services/apiService';
import ModalBase from '@/app/components/modals/ModalBase';
import { STATUS_DISPLAY } from '@/constants';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIconSolid, XCircleIconSolid } from '@/app/components/icons/SolidAndOutlineIcons';
import { CalendarDaysIconOutline } from '@/app/components/icons/SolidAndOutlineIcons';
import { ExclamationTriangleIcon } from '@/app/components/icons/SolidIcons';

interface DeviceHistoryModalProps extends ModalProps {
    device: Device; // Changed to Device
}

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

// Custom icons
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DeviceHistoryModal: React.FC<DeviceHistoryModalProps> = ({ isOpen, onClose, device }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getDeviceHistory(device.deviceId);
            setHistory(response.history);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch device history.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [device.deviceId]);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
            setCurrentDate(new Date());
        } else {
            // Reset state when modal is closed
            setHistory([]);
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen, fetchHistory]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const numDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const dayCells = Array(numDays + firstDay).fill(null);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate statistics
    const currentMonthHistory = history.filter(h => {
        const entryDate = new Date(h.timestamp);
        return entryDate.getMonth() === month && entryDate.getFullYear() === year;
    });
    const completedDays = currentMonthHistory.filter(h => h.status === Status.DONE).length;
    const totalDays = currentMonthHistory.length;
    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title={`Task History`} size="xl">
            <div className="space-y-6">
                {/* Header with icon and device info */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <CalendarDaysIconOutline className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Device info card */}
                {/* <div className="bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-xl p-4 border border-slate-600/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                                <CalendarDaysIconOutline className="w-5 h-5 text-slate-300" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Task History for</p>
                                <p className="text-slate-200 font-medium">&quot;{device.taskName}&quot;</p>
                            </div>
                        </div>
                        {!isLoading && !error && (
                            <div className="text-right">
                                <p className="text-sm text-slate-400">This Month</p>
                                <p className="text-slate-200 font-medium">{completedDays}/{totalDays} days ({completionRate}%)</p>
                            </div>
                        )}
                    </div>
                </div> */}

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-slate-600 border-t-sky-500 rounded-full animate-spin"></div>
                            <p className="text-slate-300" role="status">Loading history...</p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-300 text-sm font-medium" role="alert">{error}</p>
                        </div>
                    </div>
                )}

                {/* Calendar */}
                {!isLoading && !error && (
                    <div>
                        {/* Month navigation */}
                        <div className="flex justify-between items-center px-2">
                            <button 
                                onClick={() => changeMonth(-1)} 
                                className="p-3 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-sky-400 transition-all duration-200 border border-transparent hover:border-slate-600/30" 
                                aria-label="Previous month"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <h3 className="text-2xl font-bold text-slate-100" aria-live="polite">
                                {monthName} {year}
                            </h3>
                            <button 
                                onClick={() => changeMonth(1)} 
                                className="p-3 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-sky-400 transition-all duration-200 border border-transparent hover:border-slate-600/30" 
                                aria-label="Next month"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Week days header */}
                        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-slate-400 mb-2" role="rowgroup">
                            {weekDays.map(day => (
                                <div key={day} className="py-2" role="columnheader">{day}</div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-2" role="grid">
                            {dayCells.map((_, index) => {
                                const dayNumber = index - firstDay + 1;
                                if (index < firstDay) {
                                    return <div key={`empty-${index}`} className="h-16" role="gridcell" aria-hidden="true"></div>;
                                }
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                                const historyEntry = history.find(h => new Date(h.timestamp).toISOString().split('T')[0] === dateStr);

                                let cellBgColor = 'bg-gradient-to-br from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50';
                                let icon = null;
                                let statusLabel = "No record";
                                let borderColor = 'border-slate-600/30';

                                if (historyEntry) {
                                    statusLabel = STATUS_DISPLAY[historyEntry.status];
                                    if (historyEntry.status === Status.DONE) {
                                        cellBgColor = 'bg-gradient-to-br from-emerald-600/80 to-emerald-700/80 hover:from-emerald-500/80 hover:to-emerald-600/80';
                                        borderColor = 'border-emerald-500/50';
                                        icon = <CheckCircleIconSolid className="w-4 h-4 text-emerald-200" aria-hidden="true" />;
                                    } else {
                                        cellBgColor = 'bg-gradient-to-br from-amber-600/80 to-amber-700/80 hover:from-amber-500/80 hover:to-amber-600/80';
                                        borderColor = 'border-amber-500/50';
                                        icon = <XCircleIconSolid className="w-4 h-4 text-amber-200" aria-hidden="true" />;
                                    }
                                }

                                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                                const fullDateLabel = new Date(year, month, dayNumber).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                                return (
                                    <div
                                        key={dayNumber}
                                        className={`h-16 p-2 border ${borderColor} rounded-xl ${cellBgColor} transition-all duration-200 flex flex-col items-center justify-center backdrop-blur-sm ${isToday ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-800' : ''}`}
                                        title={`${fullDateLabel}: ${statusLabel}`}
                                        role="gridcell"
                                        aria-label={`${fullDateLabel}: ${statusLabel}${isToday ? ' (Today)' : ''}`}
                                    >
                                        <span className={`text-sm font-semibold ${isToday ? 'text-sky-200' : 'text-slate-200'}`}>
                                            {dayNumber}
                                        </span>
                                        {icon && <div className="mt-1">{icon}</div>}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center space-x-6 pt-4 py-4 border-t border-slate-700/50">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded border border-emerald-500/50"></div>
                                <span className="text-sm text-slate-400">Done</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-gradient-to-br from-amber-600 to-amber-700 rounded border border-amber-500/50"></div>
                                <span className="text-sm text-slate-400">Missed</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-gradient-to-br from-slate-700 to-slate-600 rounded border border-slate-600/30"></div>
                                <span className="text-sm text-slate-400">None</span>
                            </div>
                        </div>

                        {history.length === 0 && (
                            <div className="text-center">
                                {/* <CalendarDaysIconOutline className="w-12 h-12 text-slate-500 mx-auto mb-3" /> */}
                                <p className="text-slate-400">No history records found for this device.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-medium text-slate-300 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 transition-all duration-200 backdrop-blur-sm border border-slate-600/30 flex items-center"
                    >
                        <CloseIcon className="w-4 h-4 mr-2" />
                        Close
                    </button>
                </div>
            </div>
        </ModalBase>
    );
};

export default DeviceHistoryModal;
