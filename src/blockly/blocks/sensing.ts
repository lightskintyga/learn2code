import * as Blockly from 'blockly';

// ========== СЕНСОРЫ ==========

Blockly.Blocks['sensing_touchingobject'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_touchingobject',
            message0: 'касается %1 ?',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'TOUCHINGOBJECTMENU',
                    options: [
                        ['указатель мыши', '_mouse_'],
                        ['край', '_edge_'],
                    ],
                },
            ],
            output: 'Boolean',
            style: 'sensing_blocks',
            tooltip: 'Проверить касание',
        });
    },
};

Blockly.Blocks['sensing_touchingcolor'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_touchingcolor',
            message0: 'касается цвета %1 ?',
            args0: [
                { type: 'input_value', name: 'COLOR' },
            ],
            output: 'Boolean',
            style: 'sensing_blocks',
            tooltip: 'Проверить касание цвета',
        });
    },
};

Blockly.Blocks['sensing_coloristouchingcolor'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_coloristouchingcolor',
            message0: 'цвет %1 касается %2 ?',
            args0: [
                { type: 'input_value', name: 'COLOR' },
                { type: 'input_value', name: 'COLOR2' },
            ],
            output: 'Boolean',
            style: 'sensing_blocks',
            tooltip: 'Проверить касание двух цветов',
        });
    },
};

Blockly.Blocks['sensing_distanceto'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_distanceto',
            message0: 'расстояние до %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'DISTANCETOMENU',
                    options: [
                        ['указатель мыши', '_mouse_'],
                    ],
                },
            ],
            output: 'Number',
            style: 'sensing_blocks',
            tooltip: 'Расстояние до объекта',
        });
    },
};

Blockly.Blocks['sensing_askandwait'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_askandwait',
            message0: 'спросить %1 и ждать',
            args0: [
                { type: 'input_value', name: 'QUESTION' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sensing_blocks',
            tooltip: 'Задать вопрос и ждать ответа',
        });
    },
};

Blockly.Blocks['sensing_answer'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_answer',
            message0: 'ответ',
            output: null,
            style: 'sensing_blocks',
            tooltip: 'Последний ответ пользователя',
        });
    },
};

Blockly.Blocks['sensing_keypressed'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_keypressed',
            message0: 'клавиша %1 нажата?',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'KEY_OPTION',
                    options: [
                        ['пробел', 'space'],
                        ['стрелка вверх', 'up arrow'],
                        ['стрелка вниз', 'down arrow'],
                        ['стрелка вправо', 'right arrow'],
                        ['стрелка влево', 'left arrow'],
                        ['любая', 'any'],
                        ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'],
                        ['e', 'e'], ['f', 'f'], ['g', 'g'], ['h', 'h'],
                        ['i', 'i'], ['j', 'j'], ['k', 'k'], ['l', 'l'],
                        ['m', 'm'], ['n', 'n'], ['o', 'o'], ['p', 'p'],
                        ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
                        ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'],
                        ['y', 'y'], ['z', 'z'],
                        ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'],
                        ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'],
                        ['8', '8'], ['9', '9'],
                    ],
                },
            ],
            output: 'Boolean',
            style: 'sensing_blocks',
            tooltip: 'Проверить нажатие клавиши',
        });
    },
};

Blockly.Blocks['sensing_mousedown'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_mousedown',
            message0: 'мышь нажата?',
            output: 'Boolean',
            style: 'sensing_blocks',
            tooltip: 'Проверить нажатие кнопки мыши',
        });
    },
};

Blockly.Blocks['sensing_mousex'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_mousex',
            message0: 'мышь x',
            output: 'Number',
            style: 'sensing_blocks',
            tooltip: 'Координата x указателя мыши',
        });
    },
};

Blockly.Blocks['sensing_mousey'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_mousey',
            message0: 'мышь y',
            output: 'Number',
            style: 'sensing_blocks',
            tooltip: 'Координата y указателя мыши',
        });
    },
};

Blockly.Blocks['sensing_setdragmode'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_setdragmode',
            message0: 'установить режим перетаскивания %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'DRAG_MODE',
                    options: [
                        ['перетаскиваемый', 'draggable'],
                        ['не перетаскиваемый', 'not draggable'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sensing_blocks',
            tooltip: 'Установить режим перетаскивания',
        });
    },
};

Blockly.Blocks['sensing_loudness'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_loudness',
            message0: 'громкость',
            output: 'Number',
            style: 'sensing_blocks',
            tooltip: 'Громкость микрофона',
        });
    },
};

Blockly.Blocks['sensing_timer'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_timer',
            message0: 'таймер',
            output: 'Number',
            style: 'sensing_blocks',
            tooltip: 'Значение таймера',
        });
    },
};

Blockly.Blocks['sensing_resettimer'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_resettimer',
            message0: 'сбросить таймер',
            previousStatement: null,
            nextStatement: null,
            style: 'sensing_blocks',
            tooltip: 'Сбросить таймер',
        });
    },
};

Blockly.Blocks['sensing_of'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_of',
            message0: '%1 %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PROPERTY',
                    options: [
                        ['положение x', 'x position'],
                        ['положение y', 'y position'],
                        ['направление', 'direction'],
                        ['номер костюма', 'costume #'],
                        ['имя костюма', 'costume name'],
                        ['размер', 'size'],
                        ['громкость', 'volume'],
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'OBJECT',
                    options: [['Сцена', '_stage_']],
                },
            ],
            output: null,
            style: 'sensing_blocks',
            tooltip: 'Получить свойство объекта',
        });
    },
};

Blockly.Blocks['sensing_current'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_current',
            message0: 'текущий %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CURRENTMENU',
                    options: [
                        ['год', 'YEAR'],
                        ['месяц', 'MONTH'],
                        ['дата', 'DATE'],
                        ['день недели', 'DAYOFWEEK'],
                        ['час', 'HOUR'],
                        ['минута', 'MINUTE'],
                        ['секунда', 'SECOND'],
                    ],
                },
            ],
            output: 'Number',
            style: 'sensing_blocks',
            tooltip: 'Текущая дата/время',
        });
    },
};

Blockly.Blocks['sensing_dayssince2000'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_dayssince2000',
            message0: 'дней с 2000 года',
            output: 'Number',
            style: 'sensing_blocks',
            tooltip: 'Количество дней с 1 января 2000',
        });
    },
};

Blockly.Blocks['sensing_username'] = {
    init: function () {
        this.jsonInit({
            type: 'sensing_username',
            message0: 'имя пользователя',
            output: null,
            style: 'sensing_blocks',
            tooltip: 'Имя пользователя',
        });
    },
};

export {};