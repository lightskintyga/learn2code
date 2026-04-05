import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { useAuthStore } from '@/store/useAuthStore';
import Header from '@/components/layout/Header';
import TabBar from '@/components/editor/TabBar';
import BlocklyEditor from '@/components/editor/BlocklyEditor';
import CostumeEditor from '@/components/editor/CostumeEditor';
import SoundEditor from '@/components/editor/SoundEditor';
import StageCanvas from '@/components/stage/StageCanvas';
import StageControls from '@/components/stage/StageControls';
import SpriteList from '@/components/sprites/SpriteList';
import SpriteInfo from '@/components/sprites/SpriteInfo';
import BackdropSelector from '@/components/sprites/BackdropSelector';

const EditorPage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { currentProject, loadProject, createProject } = useProjectStore();
    const { activeTab, selectedSpriteId, selectSprite } = useEditorStore();

    // Загружаем или создаём проект
    useEffect(() => {
        if (projectId) {
            loadProject(projectId);
        } else if (!currentProject && user) {
            const project = createProject('Новый проект', user.id, user.displayName);
            navigate(`/editor/${project.id}`, { replace: true });
        }
    }, [projectId]);

    // Выбираем первый спрайт, если ничего не выбрано
    useEffect(() => {
        if (currentProject && !selectedSpriteId && currentProject.sprites.length > 0) {
            selectSprite(currentProject.sprites[0].id);
        }
    }, [currentProject?.id]);

    if (!currentProject) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-gray-400">Загрузка проекта...</div>
            </div>
        );
    }

    const renderEditorContent = () => {
        switch (activeTab) {
            case 'code':
                return <BlocklyEditor />;
            case 'costumes':
                return <CostumeEditor />;
            case 'sounds':
                return <SoundEditor />;
            default:
                return <BlocklyEditor />;
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Шапка */}
            <Header showProjectControls />

            {/* Основная область */}
            <div className="flex-1 flex overflow-hidden">
                {/* Левая панель — редактор */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Вкладки */}
                    <TabBar />

                    {/* Содержимое вкладки */}
                    <div className="flex-1 overflow-hidden">
                        {renderEditorContent()}
                    </div>
                </div>

                {/* Правая панель — сцена и спрайты */}
                <div className="w-[480px] flex flex-col border-l border-ui-border bg-gray-50 flex-shrink-0">
                    {/* Управление сценой */}
                    <StageControls />

                    {/* Сцена */}
                    <div className="px-2">
                        <StageCanvas />
                    </div>

                    {/* Информация о спрайте */}
                    <div className="px-2 py-2">
                        <SpriteInfo />
                    </div>

                    {/* Список спрайтов + фоны */}
                    <div className="flex-1 flex border-t border-ui-border overflow-hidden">
                        {/* Спрайты */}
                        <div className="flex-1 overflow-hidden">
                            <div className="px-2 py-1 text-xs font-bold text-gray-500 border-b border-ui-border">
                                Спрайты
                            </div>
                            <SpriteList />
                        </div>

                        {/* Фон */}
                        <div className="w-24 border-l border-ui-border p-2">
                            <div className="text-xs font-bold text-gray-500 mb-2 text-center">Сцена</div>
                            <BackdropSelector />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;