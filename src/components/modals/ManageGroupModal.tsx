import React, { useState } from 'react';
import { X, Loader2, UserPlus, Trash2, Users, Search } from 'lucide-react';
import { GroupDto, UserDto } from '@/services/api';
import { useToastStore } from '@/store/useToastStore';

interface ManageGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: GroupDto | null;
    onAddStudent: (groupId: string, studentId: string) => Promise<boolean>;
    onRemoveStudent: (groupId: string, studentId: string) => Promise<boolean>;
    availableStudents: UserDto[];
    isLoading?: boolean;
}

const ManageGroupModal: React.FC<ManageGroupModalProps> = ({
    isOpen,
    onClose,
    group,
    onAddStudent,
    onRemoveStudent,
    availableStudents,
    isLoading = false,
}) => {
    const [activeTab, setActiveTab] = useState<'current' | 'add'>('current');
    const [searchQuery, setSearchQuery] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { addToast } = useToastStore();

    if (!isOpen || !group) return null;

    const handleAddStudent = async (studentId: string) => {
        setProcessingId(studentId);
        const success = await onAddStudent(group.id, studentId);
        if (success) {
            addToast('Ученик добавлен в группу', 'success');
        }
        setProcessingId(null);
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этого ученика из группы?')) return;
        setProcessingId(studentId);
        const success = await onRemoveStudent(group.id, studentId);
        if (success) {
            addToast('Ученик удален из группы', 'success');
        }
        setProcessingId(null);
    };

    const filteredAvailable = availableStudents.filter(student =>
        !group.students.find(s => s.id === student.id) &&
        (student.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         student.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredCurrent = group.students.filter(student =>
        student.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-[20px] shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#EEF0F4]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[rgba(115,77,230,0.1)] rounded-[12px] flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#734DE6]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1A1D2D]">{group.name}</h2>
                            <p className="text-xs text-[#6B7280]">{group.students.length} учеников</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#6B7280] hover:text-[#1A1D2D] hover:bg-gray-100 rounded-[10px] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#EEF0F4]">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'current'
                                ? 'text-[#734DE6] border-b-2 border-[#734DE6]'
                                : 'text-[#6B7280] hover:text-[#1A1D2D]'
                        }`}
                    >
                        Ученики группы
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'add'
                                ? 'text-[#734DE6] border-b-2 border-[#734DE6]'
                                : 'text-[#6B7280] hover:text-[#1A1D2D]'
                        }`}
                    >
                        Добавить учеников
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-[#EEF0F4]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск..."
                            className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[400px] overflow-y-auto">
                    {activeTab === 'current' ? (
                        <div className="divide-y divide-[#EEF0F4]">
                            {filteredCurrent.length === 0 ? (
                                <div className="p-8 text-center text-sm text-[#9CA3AF]">
                                    {searchQuery ? 'Ничего не найдено' : 'В группе пока нет учеников'}
                                </div>
                            ) : (
                                filteredCurrent.map(student => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[rgba(115,77,230,0.1)] rounded-full flex items-center justify-center text-[#734DE6] text-sm font-medium">
                                                {student.displayName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[#1A1D2D]">
                                                    {student.displayName}
                                                </div>
                                                <div className="text-xs text-[#6B7280]">
                                                    {student.email}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveStudent(student.id)}
                                            disabled={processingId === student.id}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-[8px] transition-colors"
                                        >
                                            {processingId === student.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-[#EEF0F4]">
                            {filteredAvailable.length === 0 ? (
                                <div className="p-8 text-center text-sm text-[#9CA3AF]">
                                    {searchQuery ? 'Ничего не найдено' : 'Нет доступных учеников для добавления'}
                                </div>
                            ) : (
                                filteredAvailable.map(student => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                                                {student.displayName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[#1A1D2D]">
                                                    {student.displayName}
                                                </div>
                                                <div className="text-xs text-[#6B7280]">
                                                    {student.email}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddStudent(student.id)}
                                            disabled={processingId === student.id}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-[#734DE6] text-white text-xs font-medium rounded-[8px] hover:bg-[#5a3eb8] transition-colors disabled:opacity-50"
                                        >
                                            {processingId === student.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <UserPlus className="w-3 h-3" />
                                            )}
                                            Добавить
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#EEF0F4] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-[10px] text-sm font-medium bg-[#F8FAFB] text-[#1A1D2D] hover:bg-gray-100 transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageGroupModal;
