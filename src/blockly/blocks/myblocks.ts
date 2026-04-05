import * as Blockly from 'blockly';

// ========== ДРУГИЕ БЛОКИ (Процедуры) ==========
// Blockly имеет встроенную поддержку процедур, но мы добавим кастомные

Blockly.Blocks['procedures_definition'] = {
    init: function () {
        this.jsonInit({
            type: 'procedures_definition',
            message0: 'определить %1',
            args0: [
                { type: 'input_value', name: 'custom_block' },
            ],
            nextStatement: null,
            style: 'procedure_blocks',
            tooltip: 'Определить пользовательский блок',
        });
    },
};

Blockly.Blocks['procedures_call'] = {
    init: function () {
        this.jsonInit({
            type: 'procedures_call',
            message0: 'мой блок',
            previousStatement: null,
            nextStatement: null,
            style: 'procedure_blocks',
            tooltip: 'Вызвать пользовательский блок',
        });
    },
};

// Вспомогательные блоки для числовых значений (shadow blocks)
Blockly.Blocks['math_number'] = {
    init: function () {
        this.jsonInit({
            type: 'math_number',
            message0: '%1',
            args0: [
                {
                    type: 'field_number',
                    name: 'NUM',
                    value: 0,
                },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Число',
        });
    },
};

Blockly.Blocks['text'] = {
    init: function () {
        this.jsonInit({
            type: 'text',
            message0: '%1',
            args0: [
                {
                    type: 'field_input',
                    name: 'TEXT',
                    text: 'Привет!',
                },
            ],
            output: 'String',
            style: 'operator_blocks',
            tooltip: 'Текст',
        });
    },
};

export {};