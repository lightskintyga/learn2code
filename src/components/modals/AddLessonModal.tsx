import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AddLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; order: number }) => void;
    defaultOrder: number;
    isLoading?: boolean;
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    defaultOrder,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: defaultOrder,
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
        onSubmit(formData);
        setFormData({ title: '', description: '', order: defaultOrder });
    };

    const handleClose = () => {
        setFormData({ title: '', description: '', order: defaultOrder });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-[20px] shadow-xl w-full max-w-md animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#EEF0F4]">
                    <h2 className="text-lg font-bold text-[#1A1D2D]">Добавить урок</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-[#6B7280] hover:text-[#1A1D2D] hover:bg-gray-100 rounded-[10px] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                            Название урока <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Например: Знакомство со Скретчем"
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                            Описание <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Опишите, что ученики изучат в этом уроке"
                            rows={3}
                            required
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                            Порядковый номер
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            min={1}
                            className="w-24 bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2.5 rounded-[10px] text-sm font-medium text-[#6B7280] hover:text-[#1A1D2D] hover:bg-gray-100 transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-medium bg-[#734DE6] text-white hover:bg-[#5a3eb8] transition-colors disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Добавить урок
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLessonModal;
