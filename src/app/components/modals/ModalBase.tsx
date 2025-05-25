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

  // Handle ESC key press
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm transition-all duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose} // Close on overlay click
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl"></div>
      </div>

      <div 
        className={`relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-700/50 w-full ${sizeClasses[size]} p-6 lg:p-8 m-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeIn`}
        style={{ animationName: 'modalFadeIn', animationDuration: '0.3s', animationFillMode: 'forwards' }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
        role="document"
      >
        <div className="flex justify-between items-center mb-3 lg:mb-6">
          <h2 id="modal-title" className="text-2xl lg:text-3xl font-bold text-slate-100 text-shadow-sm">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-all duration-200 p-2 rounded-xl hover:bg-slate-700/50 backdrop-blur-sm border border-transparent hover:border-slate-600/30 group"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 lg:w-6 lg:h-6 transform group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ModalBase;
