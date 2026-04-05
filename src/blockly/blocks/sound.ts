import * as Blockly from 'blockly';

// ========== ЗВУК ==========

Blockly.Blocks['sound_playuntildone'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_playuntildone',
            message0: 'играть звук %1 до конца',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'SOUND_MENU',
                    options: [['Мяу', 'Meow']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Воспроизвести звук до конца',
        });
    },
};

Blockly.Blocks['sound_play'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_play',
            message0: 'играть звук %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'SOUND_MENU',
                    options: [['Мяу', 'Meow']],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Начать воспроизведение звука',
        });
    },
};

Blockly.Blocks['sound_stopallsounds'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_stopallsounds',
            message0: 'остановить все звуки',
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Остановить все звуки',
        });
    },
};

Blockly.Blocks['sound_changeeffectby'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_changeeffectby',
            message0: 'изменить эффект %1 на %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'EFFECT',
                    options: [
                        ['высота', 'PITCH'],
                        ['сдвиг влево/вправо', 'PAN'],
                    ],
                },
                { type: 'input_value', name: 'VALUE', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Изменить звуковой эффект',
        });
    },
};

Blockly.Blocks['sound_seteffectto'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_seteffectto',
            message0: 'установить эффект %1 в %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'EFFECT',
                    options: [
                        ['высота', 'PITCH'],
                        ['сдвиг влево/вправо', 'PAN'],
                    ],
                },
                { type: 'input_value', name: 'VALUE', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Установить звуковой эффект',
        });
    },
};

Blockly.Blocks['sound_cleareffects'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_cleareffects',
            message0: 'убрать звуковые эффекты',
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Убрать все звуковые эффекты',
        });
    },
};

Blockly.Blocks['sound_changevolumeby'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_changevolumeby',
            message0: 'изменить громкость на %1',
            args0: [
                { type: 'input_value', name: 'VOLUME', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Изменить громкость',
        });
    },
};

Blockly.Blocks['sound_setvolumeto'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_setvolumeto',
            message0: 'установить громкость %1 %',
            args0: [
                { type: 'input_value', name: 'VOLUME', check: 'Number' },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'sound_blocks',
            tooltip: 'Установить громкость',
        });
    },
};

Blockly.Blocks['sound_volume'] = {
    init: function () {
        this.jsonInit({
            type: 'sound_volume',
            message0: 'громкость',
            output: 'Number',
            style: 'sound_blocks',
            tooltip: 'Текущая громкость',
        });
    },
};

export {};