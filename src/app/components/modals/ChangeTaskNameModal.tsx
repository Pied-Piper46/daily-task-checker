import React, { useState, useCallback, useEffect } from 'react';
import { ModalProps, Device } from '@/types';
import { mockApi } from '@/app/services/mockService';
import ModalBase from '@/app/components/modals/ModalBase';

interface ChangeTaskNameModalProps extends ModalProps {
    device: Device;
    onTaskNameChanged: () => void;
}

const ChangeTaskNameModal: React.FC<ChangeTaskNameModalProps> = ({ isOpen, onClose, device, onTaskNameChanged }) => {
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [resetHistory, setResetHistory] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setNewTaskName(device.taskName);
            setResetHistory(false);
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen, device.taskName]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await mockApi.updateTaskName(device.deviceId, newTaskName, resetHistory);
            onTaskNameChanged();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task name.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [device.deviceId, newTaskName, resetHistory, onTaskNameChanged]);

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title="Change Task Name">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newTaskName" className="block text-sm font-medium text-slate-300 mb-1">
                        New Task Name for &quot;{device.taskName}&quot;
                    </label>
                    <input
                        type="text"
                        id="newTaskName"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        className="w-full px-3 py-2 text-slate-100 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none"
                        placeholder="Enter new task name"
                        aria-describedby={error ? "taskname-error" : undefined}
                        required
                    />
                </div>
                <div className="flex items-center">
                    <input
                        id="resetHistory"
                        type="checkbox"
                        checked={resetHistory}
                        onChange={(e) => setResetHistory(e.target.checked)}
                        className="h-4 w-4 text-sky-600 bg-slate-600 border-slate-500 rounded focus:ring-sky-500"
                    />
                    <label htmlFor="resetHistory" className="ml-2 block text-sm text-slate-300">
                        Reset task history (delete all past records for this device)
                    </label>
                </div>
                {error && <p id="taskname-error" className="text-sm text-red-400" role="alert">{error}</p>}
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
                        disabled={isLoading || newTaskName.trim() === '' || newTaskName === device.taskName}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:bg-sky-800 transition-colors flex items-center"
                    >
                        {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="status" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ) : null}
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </ModalBase>
    );
};

export default ChangeTaskNameModal;