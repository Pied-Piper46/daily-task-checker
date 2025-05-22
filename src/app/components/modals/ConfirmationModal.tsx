"use client";

import React, { useState, useEffect } from 'react';
import { ModalProps } from '@/types';
import ModalBase from '@/app/components/modals/ModalBase';
import { ExclamationTriangleIcon } from '@/app/components/icons/SolidIcons';

interface ConfirmationModalProps extends ModalProps {
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = true,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsLoading(false); // Reset loading state when modal is closed
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            // Parent should call onClose, which might involve state update that re-evaluates isLoading
            // If onConfirm itself doesn't lead to unmount/close, setIsLoading(false) might be needed here.
            // However, typical pattern is onConfirm -> parent closes modal -> this component unmounts or isOpen becomes false.
        } catch (error) {
            console.error("Confirmation action failed:", error);
            setIsLoading(false);
        }
    };

    const confirmButtonColor = isDestructive
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
        : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500';

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="text-slate-300">
                {isDestructive && (
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-200 mb-4" aria-hidden="true">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                )}
                <p className="text-sm text-slate-400 mb-6">{message}</p>
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 rounded-md hover:bg-slate-500 disabled:opacity-50 transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${confirmButtonColor} disabled:opacity-50 transition-colors flex items-center`}
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="status" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ) : null}
                    {isLoading ? 'Processing...' : confirmText}
                </button>
            </div>
        </ModalBase>
    );
};

export default ConfirmationModal;