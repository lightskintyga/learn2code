import * as Blockly from 'blockly';

// ========== ПЕРЕМЕННЫЕ ==========

Blockly.Blocks['data_setvariableto'] = {
    init: function () {
        this.jsonInit({
            type: 'data_setvariableto',
            message0: 'задать %1 значение %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'VARIABLE',
                    options: [['моя переменная', 'my_variable']],
                },
                { type: 'input_value', name: 'VALUE' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Установить значение переменной',
        });
    },
};

Blockly.Blocks['data_changevariableby'] = {
    init: function () {
        this.jsonInit({
            type: 'data_changevariableby',
            message0: 'изменить %1 на %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'VARIABLE',
                    options: [['моя переменная', 'my_variable']],
                },
                { type: 'input_value', name: 'VALUE', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Изменить переменную на значение',
        });
    },
};

Blockly.Blocks['data_showvariable'] = {
    init: function () {
        this.jsonInit({
            type: 'data_showvariable',
            message0: 'показать переменную %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'VARIABLE',
                    options: [['моя переменная', 'my_variable']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Показать переменную на сцене',
        });
    },
};

Blockly.Blocks['data_hidevariable'] = {
    init: function () {
        this.jsonInit({
            type: 'data_hidevariable',
            message0: 'скрыть переменную %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'VARIABLE',
                    options: [['моя переменная', 'my_variable']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Скрыть переменную на сцене',
        });
    },
};

Blockly.Blocks['data_variable'] = {
    init: function () {
        this.jsonInit({
            type: 'data_variable',
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'VARIABLE',
                    options: [['моя переменная', 'my_variable']],
                },
            ],
            output: null,
            style: 'variable_blocks',
            tooltip: 'Значение переменной',
        });
    },
};

// Списки
Blockly.Blocks['data_addtolist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_addtolist',
            message0: 'добавить %1 к %2',
            args0: [
                { type: 'input_value', name: 'ITEM' },
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Добавить элемент в список',
        });
    },
};

Blockly.Blocks['data_deleteoflist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_deleteoflist',
            message0: 'удалить %1 из %2',
            args0: [
                { type: 'input_value', name: 'INDEX', check: 'Number' },
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Удалить элемент из списка',
        });
    },
};

Blockly.Blocks['data_deletealloflist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_deletealloflist',
            message0: 'удалить все из %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Удалить все элементы списка',
        });
    },
};

Blockly.Blocks['data_insertatlist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_insertatlist',
            message0: 'вставить %1 в позицию %2 списка %3',
            args0: [
                { type: 'input_value', name: 'ITEM' },
                { type: 'input_value', name: 'INDEX', check: 'Number' },
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Вставить элемент в список',
        });
    },
};

Blockly.Blocks['data_replaceitemoflist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_replaceitemoflist',
            message0: 'заменить элемент %1 в %2 на %3',
            args0: [
                { type: 'input_value', name: 'INDEX', check: 'Number' },
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
                { type: 'input_value', name: 'ITEM' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Заменить элемент в списке',
        });
    },
};

Blockly.Blocks['data_itemoflist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_itemoflist',
            message0: 'элемент %1 из %2',
            args0: [
                { type: 'input_value', name: 'INDEX', check: 'Number' },
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            output: null,
            style: 'variable_blocks',
            tooltip: 'Получить элемент списка',
        });
    },
};

Blockly.Blocks['data_itemnumoflist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_itemnumoflist',
            message0: 'номер элемента %1 в %2',
            args0: [
                { type: 'input_value', name: 'ITEM' },
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            output: 'Number',
            style: 'variable_blocks',
            tooltip: 'Номер элемента в списке',
        });
    },
};

Blockly.Blocks['data_lengthoflist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_lengthoflist',
            message0: 'длина списка %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            output: 'Number',
            style: 'variable_blocks',
            tooltip: 'Длина списка',
        });
    },
};

Blockly.Blocks['data_listcontainsitem'] = {
    init: function () {
        this.jsonInit({
            type: 'data_listcontainsitem',
            message0: '%1 содержит %2 ?',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
                { type: 'input_value', name: 'ITEM' },
            ],
            output: 'Boolean',
            style: 'variable_blocks',
            tooltip: 'Проверить содержит ли список элемент',
        });
    },
};

Blockly.Blocks['data_showlist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_showlist',
            message0: 'показать список %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Показать список на сцене',
        });
    },
};

Blockly.Blocks['data_hidelist'] = {
    init: function () {
        this.jsonInit({
            type: 'data_hidelist',
            message0: 'скрыть список %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'LIST',
                    options: [['мой список', 'my_list']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'variable_blocks',
            tooltip: 'Скрыть список на сцене',
        });
    },
};

export {};