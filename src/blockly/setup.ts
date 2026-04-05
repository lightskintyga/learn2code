import * as Blockly from 'blockly';
import './blocks/index';
import { ScratchTheme } from './theme';
import { toolboxConfig } from './toolbox';

export const initBlocklyWorkspace = (
    container: HTMLDivElement,
    onChange?: (xml: string) => void
): Blockly.WorkspaceSvg => {
    const workspace = Blockly.inject(container, {
        toolbox: toolboxConfig,
        theme: ScratchTheme,
        renderer: 'zelos', // Scratch-подобный рендерер
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
        sounds: true,
        media: 'https://unpkg.com/blockly/media/',
    });

    // Регистрация callback для кнопки "Создать переменную"
    workspace.registerButtonCallback('CREATE_VARIABLE', () => {
        const name = prompt('Имя переменной:');
        if (name) {
            workspace.createVariable(name);
        }
    });

    workspace.registerButtonCallback('CREATE_LIST', () => {
        const name = prompt('Имя списка:');
        if (name) {
            workspace.createVariable(name, 'list');
        }
    });

    workspace.registerButtonCallback('CREATE_PROCEDURE', () => {
        // TODO: Открыть диалог создания пользовательского блока
        alert('Создание пользовательских блоков будет доступно в следующей версии');
    });

    // Слушатель изменений
    if (onChange) {
        workspace.addChangeListener(() => {
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(xml);
            onChange(xmlText);
        });
    }

    return workspace;
};

export const loadWorkspaceFromXml = (workspace: Blockly.WorkspaceSvg, xmlText: string) => {
    if (!xmlText) return;
    try {
        workspace.clear();
        const xml = Blockly.utils.xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xml, workspace);
    } catch (e) {
        console.error('Failed to load workspace from XML:', e);
    }
};

export const getWorkspaceXml = (workspace: Blockly.WorkspaceSvg): string => {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToText(xml);
};