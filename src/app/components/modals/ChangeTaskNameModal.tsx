import React, { useState, useCallback, useEffect } from 'react';
import { ModalProps, Device } from '@/types'; // Import Device from types
import { updateTaskName } from '@/app/services/apiService';
import ModalBase from '@/app/components/modals/ModalBase';
import { ExclamationTriangleIcon } from '@/app/components/icons/SolidIcons';

interface ChangeTaskNameModalProps extends ModalProps {
    device: Device; // Changed to Device
    onTaskNameChanged: () => void;
}

// Custom icons for the form
const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

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
            await updateTaskName(device.deviceId, newTaskName, resetHistory);
            onTaskNameChanged();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task name.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [device.deviceId, newTaskName, resetHistory, onTaskNameChanged]);

    const isFormValid = newTaskName.trim() !== '' && newTaskName !== device.taskName;

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title="Change Task Name" size="lg">
            <div className="space-y-6">
                {/* Header with icon */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <TagIcon className="w-8 h-8 text-white" />
                        </div>
                        {/* <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex items-center justify-center">
                            <PencilSquareIconOutline className="w-3 h-3 text-white" />
                        </div> */}
                    </div>
                </div>

                {/* Current task info */}
                {/* <div className="bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-xl p-4 border border-slate-600/30"> */}
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                        <TagIcon className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Current Task</p>
                        <p className="text-slate-200 font-medium">&quot;{device.taskName}&quot;</p>
                    </div>
                </div>
                {/* </div> */}

                <div className="text-center mb-6">
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Update the task name for this device. You can optionally reset the task history to start fresh.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Task Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="newTaskName" className="flex items-center text-sm font-medium text-slate-300 mb-2">
                            <TagIcon className="w-4 h-4 mr-2 text-emerald-400" />
                            New Task Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="newTaskName"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                className="w-full px-4 py-3 pl-12 text-slate-100 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 backdrop-blur-sm placeholder-slate-400"
                                placeholder="Enter new task name"
                                aria-describedby={error ? "taskname-error" : undefined}
                                required
                            />
                            <TagIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Choose a descriptive name for your task
                        </p>
                    </div>

                    {/* Reset History Option */}
                    <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700/30 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex items-center h-5">
                                {/* Custom Checkbox */}
                                <button
                                    type="button"
                                    onClick={() => setResetHistory(!resetHistory)}
                                    className={`relative w-5 h-5 rounded-md border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                                        resetHistory
                                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400 shadow-lg'
                                            : 'bg-slate-700 border-slate-500 hover:border-amber-400'
                                    }`}
                                    aria-checked={resetHistory}
                                    role="checkbox"
                                    aria-labelledby="resetHistory-label"
                                >
                                    {resetHistory && (
                                        <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white transform scale-110" />
                                    )}
                                </button>
                                {/* Hidden input for form submission */}
                                <input
                                    type="checkbox"
                                    checked={resetHistory}
                                    onChange={() => {}} // Controlled by button
                                    className="sr-only"
                                    tabIndex={-1}
                                />
                            </div>
                            <div className="flex-1">
                                <label id="resetHistory-label" className="flex items-center text-sm font-medium text-slate-300 mb-1 cursor-pointer" onClick={() => setResetHistory(!resetHistory)}>
                                    <ClockIcon className="w-4 h-4 mr-2 text-amber-400" />
                                    Reset Task History
                                </label>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    This will permanently delete all past completion records for this device. Use this option if you want to start tracking from scratch.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-xl p-4 animate-slideInRight">
                            <div className="flex items-center space-x-3">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <div>
                                    <p id="taskname-error" className="text-red-300 text-sm font-medium" role="alert">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-3 text-sm font-medium text-slate-300 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm border border-slate-600/30"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="w-4 h-4 mr-2" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalBase>
    );
};

export default ChangeTaskNameModal;
