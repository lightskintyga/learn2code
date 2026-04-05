import * as Blockly from 'blockly';

// ========== ВНЕШНИЙ ВИД ==========

Blockly.Blocks['looks_sayforsecs'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_sayforsecs',
            message0: 'говорить %1 %2 секунд',
            args0: [
                { type: 'input_value', name: 'MESSAGE' },
                { type: 'input_value', name: 'SECS', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Показать облачко с текстом на указанное время',
        });
    },
};

Blockly.Blocks['looks_say'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_say',
            message0: 'говорить %1',
            args0: [
                { type: 'input_value', name: 'MESSAGE' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Показать облачко с текстом',
        });
    },
};

Blockly.Blocks['looks_thinkforsecs'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_thinkforsecs',
            message0: 'думать %1 %2 секунд',
            args0: [
                { type: 'input_value', name: 'MESSAGE' },
                { type: 'input_value', name: 'SECS', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Показать облачко мысли на указанное время',
        });
    },
};

Blockly.Blocks['looks_think'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_think',
            message0: 'думать %1',
            args0: [
                { type: 'input_value', name: 'MESSAGE' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Показать облачко мысли',
        });
    },
};

Blockly.Blocks['looks_switchcostumeto'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_switchcostumeto',
            message0: 'изменить костюм на %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'COSTUME',
                    options: [['costume1', 'costume1']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Сменить костюм спрайта',
        });
    },
};

Blockly.Blocks['looks_nextcostume'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_nextcostume',
            message0: 'следующий костюм',
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Переключить на следующий костюм',
        });
    },
};

Blockly.Blocks['looks_switchbackdropto'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_switchbackdropto',
            message0: 'переключить фон на %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BACKDROP',
                    options: [['backdrop1', 'backdrop1']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Сменить фон сцены',
        });
    },
};

Blockly.Blocks['looks_nextbackdrop'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_nextbackdrop',
            message0: 'следующий фон',
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Переключить на следующий фон',
        });
    },
};

Blockly.Blocks['looks_changesizeby'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_changesizeby',
            message0: 'изменить размер на %1',
            args0: [
                { type: 'input_value', name: 'CHANGE', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Изменить размер спрайта',
        });
    },
};

Blockly.Blocks['looks_setsizeto'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_setsizeto',
            message0: 'установить размер %1 %',
            args0: [
                { type: 'input_value', name: 'SIZE', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Установить размер спрайта в процентах',
        });
    },
};

Blockly.Blocks['looks_changeeffectby'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_changeeffectby',
            message0: 'изменить эффект %1 на %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'EFFECT',
                    options: [
                        ['цвет', 'COLOR'],
                        ['рыбий глаз', 'FISHEYE'],
                        ['вихрь', 'WHIRL'],
                        ['пикселизация', 'PIXELATE'],
                        ['мозаика', 'MOSAIC'],
                        ['яркость', 'BRIGHTNESS'],
                        ['призрак', 'GHOST'],
                    ],
                },
                { type: 'input_value', name: 'CHANGE', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Изменить графический эффект',
        });
    },
};

Blockly.Blocks['looks_seteffectto'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_seteffectto',
            message0: 'установить эффект %1 в %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'EFFECT',
                    options: [
                        ['цвет', 'COLOR'],
                        ['рыбий глаз', 'FISHEYE'],
                        ['вихрь', 'WHIRL'],
                        ['пикселизация', 'PIXELATE'],
                        ['мозаика', 'MOSAIC'],
                        ['яркость', 'BRIGHTNESS'],
                        ['призрак', 'GHOST'],
                    ],
                },
                { type: 'input_value', name: 'VALUE', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Установить графический эффект',
        });
    },
};

Blockly.Blocks['looks_cleargraphiceffects'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_cleargraphiceffects',
            message0: 'убрать графические эффекты',
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Убрать все графические эффекты',
        });
    },
};

Blockly.Blocks['looks_show'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_show',
            message0: 'показаться',
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Показать спрайт',
        });
    },
};

Blockly.Blocks['looks_hide'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_hide',
            message0: 'спрятаться',
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Спрятать спрайт',
        });
    },
};

Blockly.Blocks['looks_gotofrontback'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_gotofrontback',
            message0: 'перейти на %1 слой',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'FRONT_BACK',
                    options: [
                        ['передний', 'front'],
                        ['задний', 'back'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Переместить спрайт на передний или задний слой',
        });
    },
};

Blockly.Blocks['looks_goforwardbackwardlayers'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_goforwardbackwardlayers',
            message0: 'перейти %1 на %2 слоёв',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'FORWARD_BACKWARD',
                    options: [
                        ['вперёд', 'forward'],
                        ['назад', 'backward'],
                    ],
                },
                { type: 'input_value', name: 'NUM', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'looks_blocks',
            tooltip: 'Переместить спрайт на указанное количество слоёв',
        });
    },
};

// Репортёры
Blockly.Blocks['looks_costumenumbername'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_costumenumbername',
            message0: '%1 костюма',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'NUMBER_NAME',
                    options: [
                        ['номер', 'number'],
                        ['имя', 'name'],
                    ],
                },
            ],
            output: null,
            style: 'looks_blocks',
            tooltip: 'Номер или имя текущего костюма',
        });
    },
};

Blockly.Blocks['looks_backdropnumbername'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_backdropnumbername',
            message0: '%1 фона',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'NUMBER_NAME',
                    options: [
                        ['номер', 'number'],
                        ['имя', 'name'],
                    ],
                },
            ],
            output: null,
            style: 'looks_blocks',
            tooltip: 'Номер или имя текущего фона',
        });
    },
};

Blockly.Blocks['looks_size'] = {
    init: function () {
        this.jsonInit({
            type: 'looks_size',
            message0: 'размер',
            output: 'Number',
            style: 'looks_blocks',
            tooltip: 'Текущий размер спрайта',
        });
    },
};

export {};