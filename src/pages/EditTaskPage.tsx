import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { initBlocklyWorkspace, loadWorkspaceFromXml } from '@/blockly/setup';
import { toolboxConfig } from '@/blockly/toolbox';
import StageCanvas from '@/components/stage/StageCanvas';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { runtime } from '@/engine/Runtime';

// Категории блоков для выбора
const blockCategories = [
    { id: 'motion', name: 'Движение', color: '#3B82F6' },
    { id: 'looks', name: 'Внешность', color: '#8B5CF6' },
    { id: 'sound', name: 'Звук', color: '#EC4899' },
    { id: 'events', name: 'События', color: '#F59E0B' },
    { id: 'control', name: 'Управление', color: '#F97316' },
    { id: 'sensing', name: 'Сенсоры', color: '#06B6D4' },
    { id: 'operators', name: 'Операторы', color: '#10B981' },
    { id: 'variables', name: 'Переменные', color: '#F97316' },
];

// Фильтруем toolbox по выбранным категориям
const filterToolbox = (categories: string[]) => {
    const fullToolbox = JSON.parse(JSON.stringify(toolboxConfig));
    fullToolbox.contents = fullToolbox.contents.filter((cat: any) => 
        categories.includes(cat.name.toLowerCase().replace(/[^a-z]/g, '')) ||
        categories.some(c => cat.name.toLowerCase().includes(c.toLowerCase()))
    );
    return fullToolbox;
};

// Моковые данные задания
const mockTask = {
    id: 'task-1',
    title: 'Кот идет к яблоку',
    description: 'Собери программу, чтобы кот дошел до яблока. Используй блок «идти 10 шагов» из категории «Движение».',
    hint: 'Начни с блока «когда нажат» и добавь блок движения.',
};

const EditTaskPage: React.FC = () => {
    const { courseId, lessonId, taskId } = useParams();
    const navigate = useNavigate();
    const isNewTask = taskId === 'new';
    
    const [formData, setFormData] = useState({
        title: mockTask.title,
        description: mockTask.description,
        hint: mockTask.hint,
    });
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['motion', 'events']);
    const [isRecordingSolution, setIsRecordingSolution] = useState(false);
    
    // Blockly
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    
    // Stage & Runtime
    const { currentProject, createProject } = useProjectStore();
    const { isRunning, setRunning } = useEditorStore();

    // Инициализация Blockly
    useEffect(() => {
        if (!blocklyRef.current || workspaceRef.current) return;
        
        const filteredToolbox = filterToolbox(selectedCategories);
        
        workspaceRef.current = Blockly.inject(blocklyRef.current, {
            toolbox: filteredToolbox,
            theme: 'zelos',
            renderer: 'zelos',
            grid: {
                spacing: 40,
                length: 2,
                colour: '#DDD',
                snap: false,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.675,
                maxScale: 4,
                minScale: 0.25,
                scaleSpeed: 1.1,
            },
            trashcan: true,
            move: {
                scrollbars: true,
                drag: true,
                wheel: true,
            },
        });

        return () => {
            workspaceRef.current?.dispose();
            workspaceRef.current = null;
        };
    }, []);

    // Обновляем toolbox при изменении категорий
    useEffect(() => {
        if (!workspaceRef.current) return;
        
        const filteredToolbox = filterToolbox(selectedCategories);
        workspaceRef.current.updateToolbox(filteredToolbox);
    }, [selectedCategories]);

    // Инициализация проекта для сцены
    useEffect(() => {
        if (!currentProject) {
            createProject('Новый проект', 'teacher', 'Teacher');
        }
    }, []);

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleStart = async () => {
        if (!currentProject) return;
        runtime.loadProject(currentProject);
        setRunning(true);
        await runtime.start();
        setRunning(false);
    };

    const handleStop = () => {
        runtime.stop();
        setRunning(false);
        if (currentProject) runtime.loadProject(currentProject);
    };

    const handleSave = () => {
        const workspace = workspaceRef.current;
        if (workspace) {
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(xml);
            // TODO: Сохранить задание с xmlText (начальные блоки) и selectedCategories
            alert('Задание сохранено!\nКатегории: ' + selectedCategories.join(', '));
        }
        navigate(`/teacher/course/${courseId}/edit`);
    };

    const handleRecordSolution = () => {
        // Открываем полноценный редактор для записи решения
        navigate(`/editor/task-solution?courseId=${courseId}&lessonId=${lessonId}&taskId=${taskId}`);
    };

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFB]">
            {/* Header */}
            <header className="bg-white border-b border-[#EEF0F4]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(`/teacher/course/${courseId}/edit`)}
                        className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1D2D] transition-colors"
                    >
                        <span className="text-sm">← Редактор задания</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleRecordSolution}
                            className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-2 rounded-[10px] text-sm hover:bg-gray-50 transition-colors"
                        >
                            <span>+</span>
                            Записать решение
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-[#734DE6] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-[#5a3eb8] transition-colors"
                        >
                            💾 Сохранить
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - 3 columns */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Task Info */}
                <div className="w-72 bg-white border-r border-[#EEF0F4] flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Название задания</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Описание задания</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1A1D2D] mb-2">Подсказка (необязательно)</label>
                            <textarea
                                value={formData.hint}
                                onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                                rows={2}
                                placeholder="Подсказка для ученика..."
                                className="w-full bg-[#F8FAFB] border border-[#E0E4EB] rounded-[10px] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#734DE6] focus:border-transparent outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Center - Blockly Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFB]">
                    <div className="px-4 py-3 border-b border-[#EEF0F4] bg-white flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-[#1A1D2D]">Предпросмотр рабочей области</h2>
                            <p className="text-xs text-[#6B7280]">Ученик увидит только выбранные категории блоков</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleStart}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                                    isRunning ? 'bg-green-100 text-green-700' : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                            >
                                ▶ Запуск
                            </button>
                            <button
                                onClick={handleStop}
                                className="flex items-center gap-2 border border-[#E0E4EB] text-[#1A1D2D] px-3 py-1.5 rounded-[8px] text-sm hover:bg-gray-50 transition-colors"
                            >
                                ⏹ Тест проверки
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-4">
                        <div 
                            ref={blocklyRef}
                            className="w-full h-full bg-white rounded-[16px] shadow-sm border border-[#EEF0F4]"
                        />
                    </div>
                </div>

                {/* Right Panel - Categories & Stage */}
                <div className="w-72 bg-white border-l border-[#EEF0F4] flex flex-col shrink-0 overflow-y-auto">
                    {/* Block Categories */}
                    <div className="p-4 border-b border-[#EEF0F4]">
                        <h3 className="text-sm font-semibold text-[#1A1D2D] mb-1">Доступные блоки</h3>
                        <p className="text-xs text-[#6B7280] mb-3">Выберите категории блоков</p>
                        
                        <div className="space-y-2">
                            {blockCategories.map((cat) => (
                                <label 
                                    key={cat.id}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={() => handleCategoryToggle(cat.id)}
                                        className="w-4 h-4 rounded border-[#E0E4EB] text-[#734DE6] focus:ring-[#734DE6]"
                                    />
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="text-sm text-[#1A1D2D]">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Stage Preview */}
                    <div className="p-4">
                        <h3 className="text-xs font-semibold text-[#6B7280] uppercase mb-2">Начальная сцена</h3>
                        <div className="bg-gradient-to-br from-[#E0F2FE] to-[#F0FDF4] rounded-[16px] aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-[#EEF0F4] mb-2">
                            {/* Grid */}
                            <div className="absolute inset-0 opacity-10" 
                                style={{
                                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}
                            />
                            {/* Sprites */}
                            <div className="relative w-full h-full">
                                <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 text-3xl">🐱</div>
                                <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 text-3xl">🍎</div>
                            </div>
                        </div>
                        <p className="text-xs text-[#6B7280]">
                            Спрайты: 🐱 Кот 🍎 Яблоко
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTaskPage;
