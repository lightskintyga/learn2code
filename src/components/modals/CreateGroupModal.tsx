import React, { useState, useEffect } from 'react';
import { X, Loader2, Users, Search } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useToastStore } from '@/store/useToastStore';
import { UserDto } from '@/services/api';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string; courseId: string; studentIds: string[] }) => void;
    courses: { id: string; title: string }[];
    isLoading?: boolean;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    courses,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        courseId: '',
    });
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { addToast } = useToastStore();

    // Моковые данные студентов (в реальности будут приходить с API)
    const [availableStudents, setAvailableStudents] = useState<UserDto[]>([]);

    useEffect(() => {
        if (isOpen) {
            // TODO: Загружать студентов с API
            // Временно пустой список
            setAvailableStudents([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.courseId) {
            addToast('Заполните все обязательные поля', 'error');
            return;
        }
        onSubmit({
            name: formData.name,
            description: formData.description,
            courseId: formData.courseId,
            studentIds: selectedStudents,
        });
        handleClose();
    };

    const handleClose = () => {
        setFormData({ name: '', description: '', courseId: '' });
        setSelectedStudents([]);
        setSearchQuery('');
        onClose();
    };

    const toggleStudent = (studentId: string) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const filteredStudents = availableStudents.filter(student =>
        student.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-[20px] shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#EEF0F4]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[rgba(115,77,230,0.1)] rounded-[12px] flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#734DE6]" />
                        </div>
                        <h2 className="text-lg font-bold text-[#1A1D2D]">Создать группу</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-[#6B7280] hover:text-[#1A1D2D] hover:bg-gray-100 rounded-[10px] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Course Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                            Курс <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                            required
                        >
                            <option value="">Выберите курс</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Group Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                            Название группы <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Например: Группа А"
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                            Описание
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Описание группы (необязательно)"
                            rows={2}
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Students Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1D2D] mb-2">
                            Добавить учеников
                        </label>

                        {/* Search */}
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск учеников..."
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Selected Count */}
                        {selectedStudents.length > 0 && (
                            <div className="mb-2 text-sm text-[#734DE6]">
                                Выбрано: {selectedStudents.length} учеников
                            </div>
                        )}

                        {/* Students List */}
                        <div className="border border-[#E0E4EB] rounded-[10px] max-h-[200px] overflow-y-auto">
                            {filteredStudents.length === 0 ? (
                                <div className="p-4 text-center text-sm text-[#9CA3AF]">
                                    Нет доступных учеников
                                </div>
                            ) : (
                                filteredStudents.map(student => (
                                    <label
                                        key={student.id}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-[#EEF0F4] last:border-b-0"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => toggleStudent(student.id)}
                                            className="w-4 h-4 rounded border-[#E0E4EB] text-[#734DE6] focus:ring-[#734DE6]"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-[#1A1D2D]">
                                                {student.displayName}
                                            </div>
                                            <div className="text-xs text-[#6B7280]">
                                                {student.email}
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
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
                            disabled={isLoading || !formData.name.trim() || !formData.courseId}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-medium bg-[#734DE6] text-white hover:bg-[#5a3eb8] transition-colors disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Создать группу
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
