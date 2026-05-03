import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    isLoading = false,
    confirmText = 'Удалить',
    cancelText = 'Отмена',
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-[20px] shadow-xl w-full max-w-md animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#EEF0F4]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-[12px] flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-[#1A1D2D]">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#6B7280] hover:text-[#1A1D2D] hover:bg-gray-100 rounded-[10px] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="text-[#6B7280] text-sm mb-2">{message}</p>
                    {itemName && (
                        <p className="text-[#1A1D2D] font-medium text-sm bg-gray-100 rounded-[8px] px-3 py-2">
                            "{itemName}"
                        </p>
                    )}
                    <p className="text-red-500 text-xs mt-3">
                        Это действие нельзя отменить.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 p-5 pt-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-[10px] text-sm font-medium text-[#6B7280] hover:text-[#1A1D2D] hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
