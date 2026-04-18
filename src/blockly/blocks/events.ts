import * as Blockly from 'blockly';

// ========== СОБЫТИЯ ==========

Blockly.Blocks['event_whenflagclicked'] = {
    init: function () {
        this.jsonInit({
            type: 'event_whenflagclicked',
            message0: 'когда ⚑ нажат',
            args0: [],
            message1: '%1',
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            style: 'event_blocks',
            tooltip: 'Запустить при нажатии зелёного флага',
            hat: 'cap',
        });
    },
};

Blockly.Blocks['event_whenkeypressed'] = {
    init: function () {
        this.jsonInit({
            type: 'event_whenkeypressed',
            message0: 'когда клавиша %1 нажата',
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
            message1: '%1',
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            style: 'event_blocks',
            tooltip: 'Запустить при нажатии клавиши',
        });
    },
};

Blockly.Blocks['event_whenthisspriteclicked'] = {
    init: function () {
        this.jsonInit({
            type: 'event_whenthisspriteclicked',
            message0: 'когда спрайт нажат',
            message1: '%1',
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            style: 'event_blocks',
            tooltip: 'Запустить при нажатии на спрайт',
        });
    },
};

Blockly.Blocks['event_whenstageclicked'] = {
    init: function () {
        this.jsonInit({
            type: 'event_whenstageclicked',
            message0: 'когда сцена нажата',
            style: 'event_blocks',
            tooltip: 'Запустить при нажатии на сцену',
        });
    },
};

Blockly.Blocks['event_whenbackdropswitchesto'] = {
    init: function () {
        this.jsonInit({
            type: 'event_whenbackdropswitchesto',
            message0: 'когда фон сменится на %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BACKDROP',
                    options: [['backdrop1', 'backdrop1']],
                },
            ],
            message1: '%1',
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            style: 'event_blocks',
            tooltip: 'Запустить при смене фона',
        });
    },
};

Blockly.Blocks['event_whengreaterthan'] = {
    init: function () {
        this.jsonInit({
            type: 'event_whengreaterthan',
            message0: 'когда %1 > %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'WHENGREATERTHANMENU',
                    options: [
                        ['громкость', 'LOUDNESS'],
                        ['таймер', 'TIMER'],
                    ],
                },
                { type: 'input_value', name: 'VALUE', check: 'Number' },
            ],
            style: 'event_blocks',
            tooltip: 'Запустить когда значение превысит порог',
        });
    },
};

Blockly.Blocks['event_whenbroadcastreceived'] = {
    init: function () {
        this.jsonInit({
            type: 'event_whenbroadcastreceived',
            message0: 'когда я получу %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BROADCAST_OPTION',
                    options: [['сообщение1', 'message1']],
                },
            ],
            message1: '%1',
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            style: 'event_blocks',
            tooltip: 'Запустить при получении сообщения',
        });
    },
};

Blockly.Blocks['event_broadcast'] = {
    init: function () {
        this.jsonInit({
            type: 'event_broadcast',
            message0: 'передать %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BROADCAST_INPUT',
                    options: [['сообщение1', 'message1']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'event_blocks',
            tooltip: 'Отправить сообщение',
        });
    },
};

Blockly.Blocks['event_broadcastandwait'] = {
    init: function () {
        this.jsonInit({
            type: 'event_broadcastandwait',
            message0: 'передать %1 и ждать',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BROADCAST_INPUT',
                    options: [['сообщение1', 'message1']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'event_blocks',
            tooltip: 'Отправить сообщение и ждать',
        });
    },
};

export {};
