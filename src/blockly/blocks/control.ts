import * as Blockly from 'blockly';

// ========== УПРАВЛЕНИЕ ==========

Blockly.Blocks['control_wait'] = {
    init: function () {
        this.jsonInit({
            type: 'control_wait',
            message0: 'ждать %1 секунд',
            args0: [
                { type: 'input_value', name: 'DURATION', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Ждать указанное количество секунд',
        });
    },
};

Blockly.Blocks['control_repeat'] = {
    init: function () {
        this.jsonInit({
            type: 'control_repeat',
            message0: 'повторить %1 раз %2 %3',
            args0: [
                { type: 'input_value', name: 'TIMES', check: 'Number' },
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'SUBSTACK' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Повторить указанное количество раз',
        });
    },
};

Blockly.Blocks['control_forever'] = {
    init: function () {
        this.jsonInit({
            type: 'control_forever',
            message0: 'повторять всегда %1 %2',
            args0: [
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'SUBSTACK' },
            ],
            previousStatement: null,
            style: 'control_blocks',
            tooltip: 'Повторять бесконечно',
        });
    },
};

Blockly.Blocks['control_if'] = {
    init: function () {
        this.jsonInit({
            type: 'control_if',
            message0: 'если %1 то %2 %3',
            args0: [
                { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'SUBSTACK' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Если условие истинно, выполнить блоки внутри',
        });
    },
};

Blockly.Blocks['control_if_else'] = {
    init: function () {
        this.jsonInit({
            type: 'control_if_else',
            message0: 'если %1 то %2 %3 иначе %4 %5',
            args0: [
                { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'SUBSTACK' },
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'SUBSTACK2' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Если условие истинно, выполнить первые блоки, иначе — вторые',
        });
    },
};

Blockly.Blocks['control_wait_until'] = {
    init: function () {
        this.jsonInit({
            type: 'control_wait_until',
            message0: 'ждать до %1',
            args0: [
                { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Ждать пока условие не станет истинным',
        });
    },
};

Blockly.Blocks['control_repeat_until'] = {
    init: function () {
        this.jsonInit({
            type: 'control_repeat_until',
            message0: 'повторять пока не %1 %2 %3',
            args0: [
                { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
                { type: 'input_dummy' },
                { type: 'input_statement', name: 'SUBSTACK' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Повторять пока условие не станет истинным',
        });
    },
};

Blockly.Blocks['control_stop'] = {
    init: function () {
        this.jsonInit({
            type: 'control_stop',
            message0: 'стоп %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'STOP_OPTION',
                    options: [
                        ['все', 'all'],
                        ['этот скрипт', 'this script'],
                        ['другие скрипты спрайта', 'other scripts in sprite'],
                    ],
                },
            ],
            previousStatement: null,
            style: 'control_blocks',
            tooltip: 'Остановить выполнение',
        });
    },
};

Blockly.Blocks['control_start_as_clone'] = {
    init: function () {
        this.jsonInit({
            type: 'control_start_as_clone',
            message0: 'когда я начинаю как клон',
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Запустить при создании клона',
        });
    },
};

Blockly.Blocks['control_create_clone_of'] = {
    init: function () {
        this.jsonInit({
            type: 'control_create_clone_of',
            message0: 'создать клон %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CLONE_OPTION',
                    options: [
                        ['себя', '_myself_'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'control_blocks',
            tooltip: 'Создать клон спрайта',
        });
    },
};

Blockly.Blocks['control_delete_this_clone'] = {
    init: function () {
        this.jsonInit({
            type: 'control_delete_this_clone',
            message0: 'удалить клон',
            previousStatement: null,
            style: 'control_blocks',
            tooltip: 'Удалить этот клон',
        });
    },
};

export {};