"use client";

import React from 'react';
import { ModalProps } from '@/types';
import { XMarkIcon } from '@/app/components/icons/SolidIcons';

interface ModalBaseProps extends ModalProps {
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ModalBase: React.FC<ModalBaseProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className={`bg-slate-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} p-6 m-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeIn`}
        style={{ animationName: 'modalFadeIn', animationDuration: '0.3s', animationFillMode: 'forwards' }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
        role="document"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-700"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes modalFadeIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ModalBase;