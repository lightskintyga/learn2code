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
        rtl: false,
        scrollbars: true,
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
        workspace.addChangeListener((event) => {
            if (!event || event.isUiEvent) return;
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(xml);
            onChange(xmlText);
        });
    }

    // Следим за изменениями флайаута и скрываем/показываем скроллбар
    const flyout = workspace.getFlyout();
    if (flyout) {
        const flyoutEl = document.querySelector('.blocklyFlyout');
        const scrollbarEl = document.querySelector('.blocklyFlyoutScrollbar');
        
        if (flyoutEl && scrollbarEl) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const display = (flyoutEl as HTMLElement).style.display;
                        const width = (flyoutEl as HTMLElement).style.width;
                        const isHidden = display === 'none' || width === '0px' || !width;
                        
                        (scrollbarEl as HTMLElement).style.display = isHidden ? 'none' : '';
                        (scrollbarEl as HTMLElement).style.visibility = isHidden ? 'hidden' : 'visible';
                    }
                });
            });
            
            observer.observe(flyoutEl, { attributes: true, attributeFilter: ['style'] });
        }
    }

    // Закрытие категории по двойному клику
    const toolbox = workspace.getToolbox();
    const flyoutObj = workspace.getFlyout() as any;
    
    if (toolbox && flyoutObj) {
        const toolboxDiv = document.querySelector('.blocklyToolboxDiv');
        if (toolboxDiv) {
            toolboxDiv.addEventListener('dblclick', (e) => {
                const target = e.target as HTMLElement;
                const row = target.closest('.blocklyTreeRow') as HTMLElement | null;
                if (!row) return;
                
                const item = toolbox.getSelectedItem();
                if (item) {
                    flyoutObj?.hide();
                    toolbox.clearSelection();
                }
            });
        }
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