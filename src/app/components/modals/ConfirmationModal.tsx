"use client";

import React, { useState, useEffect } from 'react';
import { ModalProps } from '@/types';
import ModalBase from '@/app/components/modals/ModalBase';
import { ExclamationTriangleIcon } from '@/app/components/icons/SolidIcons';
import { CheckCircleIconSolid } from '@/app/components/icons/SolidAndOutlineIcons';

interface ConfirmationModalProps extends ModalProps {
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

// Custom icons
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

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

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title={title} size="md">
            <div className="space-y-6">
                {/* Icon Section */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        {isDestructive ? (
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <CheckCircleIconSolid className="w-8 h-8 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Section */}
                <div className="text-center space-y-3">
                    <p className="text-slate-300 text-base leading-relaxed">
                        {message}
                    </p>
                    {isDestructive && (
                        <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/30 rounded-xl p-3">
                            <p className="text-red-300 text-sm font-medium">
                                ⚠️ This action cannot be undone
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-3 text-sm font-medium text-slate-300 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm border border-slate-600/30 flex items-center"
                    >
                        <XMarkIcon className="w-4 h-4 mr-2" />
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`px-6 py-3 text-sm font-medium text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center ${
                            isDestructive
                                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                {isDestructive ? (
                                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                ) : (
                                    <CheckIcon className="w-4 h-4 mr-2" />
                                )}
                                <span>{confirmText}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ModalBase>
    );
};

export default ConfirmationModal;
