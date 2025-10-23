import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

/**
 * Componente Dialog/Modal estilo Instagram
 */
export const Dialog = ({ isOpen, onClose, children, className = '' }) => {
  useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, onClose, className = '' }) => {
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
};

export const DialogContent = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)] ${className}`}>
      {children}
    </div>
  );
};

export const DialogFooter = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
