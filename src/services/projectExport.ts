import * as Blockly from 'blockly';
import { javascriptGenerator } from '@/blockly/generators/javascript';
import { pythonGenerator } from '@/blockly/generators/python';
import { ExportedCode, Project } from '@/types';

export const exportProjectCode = (
    workspace: Blockly.WorkspaceSvg,
    project: Project
): ExportedCode => {
    // Получаем XML
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const blocklyXml = Blockly.Xml.domToText(xml);

    // Генерируем JavaScript
    let javascript = '';
    try {
        javascript = javascriptGenerator.workspaceToCode(workspace);
    } catch (e) {
        console.error('JS generation error:', e);
    }

    // Генерируем Python
    let python = '';
    try {
        python = pythonGenerator.workspaceToCode(workspace);
    } catch (e) {
        console.error('Python generation error:', e);
    }

    // JSON представление проекта
    const json = JSON.stringify(project, null, 2);

    return {
        json,
        javascript,
        python,
        blocklyXml,
    };
};

export const submitSolution = async (
    taskId: string,
    studentId: string,
    exportedCode: ExportedCode
): Promise<boolean> => {
    // TODO: Заменить на реальный API запрос
    // const response = await api.post('/submissions', {
    //   taskId,
    //   studentId,
    //   exportedCode,
    //   submittedAt: new Date().toISOString(),
    // });
    // return response.success;

    // Пока сохраняем в localStorage
    const submissions = JSON.parse(localStorage.getItem('scratch_submissions') || '[]');
    submissions.push({
        id: crypto.randomUUID(),
        taskId,
        studentId,
        exportedCode,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
    });
    localStorage.setItem('scratch_submissions', JSON.stringify(submissions));

    console.log('Solution submitted:', { taskId, studentId, exportedCode });
    return true;
};