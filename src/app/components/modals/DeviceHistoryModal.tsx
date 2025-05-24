import React, { useState, useEffect, useCallback } from 'react';
import {ModalProps, Device, HistoryEntry, Status } from '@/types'; // Import Device from types
import { getDeviceHistory } from '@/app/services/apiService';
import ModalBase from '@/app/components/modals/ModalBase';
import { STATUS_DISPLAY } from '@/constants';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIconSolid, XCircleIconSolid } from '@/app/components/icons/SolidAndOutlineIcons';

interface DeviceHistoryModalProps extends ModalProps {
    device: Device; // Changed to Device
}

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

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

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title={`Task History for ${device.taskName}`} size="lg">
            {isLoading && <p className="text-slate-300 text-center py-4" role="status">Loading history...</p>}
            {error && <p className="text-red-400 text-center py-4" role="alert">{error}</p>}
            {!isLoading && !error && (
                <div>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-sky-400 transition-colors" aria-label="Previous month">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-semibold text-slate-100" aria-live="polite">{monthName} {year}</h3>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-sky-400 transition-colors" aria-label="Next month">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-400 mb-2" role="rowgroup">
                        {weekDays.map(day => <div key={day} role="columnheader">{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1" role="grid">
                        {dayCells.map((_, index) => {
                            const dayNumber = index - firstDay + 1;
                            if (index < firstDay) {
                                return <div key={`empty-${index}`} className="p-1" role="gridcell" aria-hidden="true"></div>;
                            }
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                            const historyEntry = history.find(h => h.date === dateStr);

                            let cellBgColor = 'bg-slate-700 hover:bg-slate-600';
                            let icon = null;
                            let statusLabel = "No record";

                            if (historyEntry) {
                                statusLabel = STATUS_DISPLAY[historyEntry.status];
                                if (historyEntry.status === Status.DONE) {
                                    cellBgColor = 'bg-emerald-700 hover:bg-emerald-600';
                                    icon = <CheckCircleIconSolid className="w-5 h-5 text-emerald-300" aria-hidden="true" />;
                                } else {
                                    cellBgColor = 'bg-amber-700 hover:bg-amber-600';
                                    icon = <XCircleIconSolid className="w-5 h-5 text-amber-300" aria-hidden="true" />;
                                }
                            }

                            const isToday = new Date().toISOString().split('T')[0] === dateStr;
                            const fullDateLabel = new Date(year, month, dayNumber).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                            return (
                                <div
                                    key={dayNumber}
                                    className={`h-16 p-1 border border-slate-600 rounded-md ${cellBgColor} transition-colors flex flex-col items-center justify-center ${isToday ? 'ring-2 ring-sky-400' : ''}`}
                                    title={`${fullDateLabel}: ${statusLabel}`}
                                    role="gridcell"
                                    aria-label={`${fullDateLabel}: ${statusLabel}${isToday ? ' (Today)' : ''}`}
                                >
                                    <span className={`font-medium ${isToday ? 'text-sky-300' : 'text-slate-200'}`}>{dayNumber}</span>
                                    {icon && <div className="mt-1">{icon}</div>}
                                </div>
                            );
                        })}
                    </div>
                    {history.length === 0 && !isLoading && <p className="text-slate-400 text-center mt-4">No history records for this month or device.</p>}
                </div>
            )}
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors"
                >
                    Close
                </button>
            </div>
        </ModalBase>
    );
};

export default DeviceHistoryModal;
