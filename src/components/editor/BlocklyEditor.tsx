import React, { useEffect, useRef, useCallback } from 'react';
import * as Blockly from 'blockly';
import { initBlocklyWorkspace, loadWorkspaceFromXml, getWorkspaceXml } from '@/blockly/setup';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';

const BlocklyEditor: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const { currentProject, updateBlocks } = useProjectStore();
    const { selectedSpriteId, isStageSelected } = useEditorStore();

    const currentTargetId = isStageSelected
        ? currentProject?.stage.id
        : selectedSpriteId;

    const currentBlocks = isStageSelected
        ? currentProject?.stage.blocks
        : currentProject?.sprites.find(s => s.id === selectedSpriteId)?.blocks;

    const handleChange = useCallback((xml: string) => {
        if (currentTargetId) {
            updateBlocks(currentTargetId, xml);
        }
    }, [currentTargetId, updateBlocks]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Инициализируем workspace
        if (!workspaceRef.current) {
            workspaceRef.current = initBlocklyWorkspace(containerRef.current, handleChange);
        }

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };
    }, []);

    // Загружаем блоки при смене спрайта
    useEffect(() => {
        if (workspaceRef.current && currentBlocks !== undefined) {
            // Отключаем слушатель изменений временно
            workspaceRef.current.clearUndo();
            loadWorkspaceFromXml(workspaceRef.current, currentBlocks || '');
        }
    }, [currentTargetId]);

    // Обновляем обработчик при смене target
    useEffect(() => {
        if (!workspaceRef.current) return;

        // Удаляем старые слушатели и добавляем новый
        const listener = () => {
            if (workspaceRef.current && currentTargetId) {
                const xml = getWorkspaceXml(workspaceRef.current);
                updateBlocks(currentTargetId, xml);
            }
        };

        workspaceRef.current.addChangeListener(listener);

        return () => {
            workspaceRef.current?.removeChangeListener(listener);
        };
    }, [currentTargetId, updateBlocks]);

    // Resize при изменении размера контейнера
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (workspaceRef.current) {
                Blockly.svgResize(workspaceRef.current);
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{ minHeight: '400px' }}
        />
    );
};

export default BlocklyEditor;