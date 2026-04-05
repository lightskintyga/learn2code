import * as Blockly from 'blockly';

// ========== ОПЕРАТОРЫ ==========

Blockly.Blocks['operator_add'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_add',
            message0: '%1 + %2',
            args0: [
                { type: 'input_value', name: 'NUM1', check: 'Number' },
                { type: 'input_value', name: 'NUM2', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Сложение',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_subtract'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_subtract',
            message0: '%1 - %2',
            args0: [
                { type: 'input_value', name: 'NUM1', check: 'Number' },
                { type: 'input_value', name: 'NUM2', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Вычитание',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_multiply'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_multiply',
            message0: '%1 * %2',
            args0: [
                { type: 'input_value', name: 'NUM1', check: 'Number' },
                { type: 'input_value', name: 'NUM2', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Умножение',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_divide'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_divide',
            message0: '%1 / %2',
            args0: [
                { type: 'input_value', name: 'NUM1', check: 'Number' },
                { type: 'input_value', name: 'NUM2', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Деление',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_random'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_random',
            message0: 'выдать случайное от %1 до %2',
            args0: [
                { type: 'input_value', name: 'FROM', check: 'Number' },
                { type: 'input_value', name: 'TO', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Случайное число в диапазоне',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_gt'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_gt',
            message0: '%1 > %2',
            args0: [
                { type: 'input_value', name: 'OPERAND1' },
                { type: 'input_value', name: 'OPERAND2' },
            ],
            output: 'Boolean',
            style: 'operator_blocks',
            tooltip: 'Больше',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_lt'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_lt',
            message0: '%1 < %2',
            args0: [
                { type: 'input_value', name: 'OPERAND1' },
                { type: 'input_value', name: 'OPERAND2' },
            ],
            output: 'Boolean',
            style: 'operator_blocks',
            tooltip: 'Меньше',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_equals'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_equals',
            message0: '%1 = %2',
            args0: [
                { type: 'input_value', name: 'OPERAND1' },
                { type: 'input_value', name: 'OPERAND2' },
            ],
            output: 'Boolean',
            style: 'operator_blocks',
            tooltip: 'Равно',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_and'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_and',
            message0: '%1 и %2',
            args0: [
                { type: 'input_value', name: 'OPERAND1', check: 'Boolean' },
                { type: 'input_value', name: 'OPERAND2', check: 'Boolean' },
            ],
            output: 'Boolean',
            style: 'operator_blocks',
            tooltip: 'Логическое И',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_or'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_or',
            message0: '%1 или %2',
            args0: [
                { type: 'input_value', name: 'OPERAND1', check: 'Boolean' },
                { type: 'input_value', name: 'OPERAND2', check: 'Boolean' },
            ],
            output: 'Boolean',
            style: 'operator_blocks',
            tooltip: 'Логическое ИЛИ',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_not'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_not',
            message0: 'не %1',
            args0: [
                { type: 'input_value', name: 'OPERAND', check: 'Boolean' },
            ],
            output: 'Boolean',
            style: 'operator_blocks',
            tooltip: 'Логическое НЕ',
        });
    },
};

Blockly.Blocks['operator_join'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_join',
            message0: 'объединить %1 и %2',
            args0: [
                { type: 'input_value', name: 'STRING1' },
                { type: 'input_value', name: 'STRING2' },
            ],
            output: null,
            style: 'operator_blocks',
            tooltip: 'Объединить две строки',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_letter_of'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_letter_of',
            message0: 'буква %1 в %2',
            args0: [
                { type: 'input_value', name: 'LETTER', check: 'Number' },
                { type: 'input_value', name: 'STRING' },
            ],
            output: null,
            style: 'operator_blocks',
            tooltip: 'Получить букву по номеру',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_length'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_length',
            message0: 'длина %1',
            args0: [
                { type: 'input_value', name: 'STRING' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Длина строки',
        });
    },
};

Blockly.Blocks['operator_contains'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_contains',
            message0: '%1 содержит %2 ?',
            args0: [
                { type: 'input_value', name: 'STRING1' },
                { type: 'input_value', name: 'STRING2' },
            ],
            output: 'Boolean',
            style: 'operator_blocks',
            tooltip: 'Проверить содержит ли строка подстроку',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_mod'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_mod',
            message0: '%1 mod %2',
            args0: [
                { type: 'input_value', name: 'NUM1', check: 'Number' },
                { type: 'input_value', name: 'NUM2', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Остаток от деления',
            inputsInline: true,
        });
    },
};

Blockly.Blocks['operator_round'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_round',
            message0: 'округлить %1',
            args0: [
                { type: 'input_value', name: 'NUM', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Округлить число',
        });
    },
};

Blockly.Blocks['operator_mathop'] = {
    init: function () {
        this.jsonInit({
            type: 'operator_mathop',
            message0: '%1 %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OPERATOR',
                    options: [
                        ['abs', 'abs'],
                        ['floor', 'floor'],
                        ['ceiling', 'ceiling'],
                        ['sqrt', 'sqrt'],
                        ['sin', 'sin'],
                        ['cos', 'cos'],
                        ['tan', 'tan'],
                        ['asin', 'asin'],
                        ['acos', 'acos'],
                        ['atan', 'atan'],
                        ['ln', 'ln'],
                        ['log', 'log'],
                        ['e ^', 'e ^'],
                        ['10 ^', '10 ^'],
                    ],
                },
                { type: 'input_value', name: 'NUM', check: 'Number' },
            ],
            output: 'Number',
            style: 'operator_blocks',
            tooltip: 'Математическая операция',
        });
    },
};

export {};