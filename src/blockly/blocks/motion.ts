import * as Blockly from 'blockly';

// ========== ДВИЖЕНИЕ ==========

Blockly.Blocks['motion_movesteps'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_movesteps',
            message0: 'идти %1 шагов',
            args0: [
                {
                    type: 'input_value',
                    name: 'STEPS',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Переместить спрайт на указанное количество шагов',
        });
    },
};

Blockly.Blocks['motion_turnright'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_turnright',
            message0: 'повернуть ↻ на %1 градусов',
            args0: [
                {
                    type: 'input_value',
                    name: 'DEGREES',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Повернуть спрайт по часовой стрелке',
        });
    },
};

Blockly.Blocks['motion_turnleft'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_turnleft',
            message0: 'повернуть ↺ на %1 градусов',
            args0: [
                {
                    type: 'input_value',
                    name: 'DEGREES',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Повернуть спрайт против часовой стрелки',
        });
    },
};

Blockly.Blocks['motion_goto'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_goto',
            message0: 'перейти на %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'TO',
                    options: [
                        ['случайное положение', '_random_'],
                        ['указатель мыши', '_mouse_'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Переместить спрайт в указанную позицию',
        });
    },
};

Blockly.Blocks['motion_gotoxy'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_gotoxy',
            message0: 'перейти в x: %1 y: %2',
            args0: [
                {
                    type: 'input_value',
                    name: 'X',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'Y',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Переместить спрайт в указанные координаты',
        });
    },
};

Blockly.Blocks['motion_glideto'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_glideto',
            message0: 'плыть %1 секунд к %2',
            args0: [
                {
                    type: 'input_value',
                    name: 'SECS',
                    check: 'Number',
                },
                {
                    type: 'field_dropdown',
                    name: 'TO',
                    options: [
                        ['случайное положение', '_random_'],
                        ['указатель мыши', '_mouse_'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Плавно переместить спрайт',
        });
    },
};

Blockly.Blocks['motion_glidesecstoxy'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_glidesecstoxy',
            message0: 'плыть %1 секунд в точку x: %2 y: %3',
            args0: [
                {
                    type: 'input_value',
                    name: 'SECS',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'X',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'Y',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Плавно переместить спрайт в указанные координаты',
        });
    },
};

Blockly.Blocks['motion_pointindirection'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_pointindirection',
            message0: 'повернуться в направлении %1',
            args0: [
                {
                    type: 'input_value',
                    name: 'DIRECTION',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Повернуть спрайт в указанном направлении',
        });
    },
};

Blockly.Blocks['motion_pointtowards'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_pointtowards',
            message0: 'повернуться к %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'TOWARDS',
                    options: [
                        ['указатель мыши', '_mouse_'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Повернуть спрайт к указанному объекту',
        });
    },
};

Blockly.Blocks['motion_changexby'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_changexby',
            message0: 'изменить x на %1',
            args0: [
                {
                    type: 'input_value',
                    name: 'DX',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Изменить координату x спрайта',
        });
    },
};

Blockly.Blocks['motion_setx'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_setx',
            message0: 'установить x в %1',
            args0: [
                {
                    type: 'input_value',
                    name: 'X',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Установить координату x спрайта',
        });
    },
};

Blockly.Blocks['motion_changeyby'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_changeyby',
            message0: 'изменить y на %1',
            args0: [
                {
                    type: 'input_value',
                    name: 'DY',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Изменить координату y спрайта',
        });
    },
};

Blockly.Blocks['motion_sety'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_sety',
            message0: 'установить y в %1',
            args0: [
                {
                    type: 'input_value',
                    name: 'Y',
                    check: 'Number',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Установить координату y спрайта',
        });
    },
};

Blockly.Blocks['motion_ifonedgebounce'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_ifonedgebounce',
            message0: 'если касается края, оттолкнуться',
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Оттолкнуться от края сцены',
        });
    },
};

Blockly.Blocks['motion_setrotationstyle'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_setrotationstyle',
            message0: 'установить способ вращения %1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'STYLE',
                    options: [
                        ['влево-вправо', 'left-right'],
                        ['не вращать', "don't rotate"],
                        ['кругом', 'all around'],
                    ],
                },
            ],
            previousStatement: null,
            nextStatement: null,
            style: 'motion_blocks',
            tooltip: 'Установить способ вращения спрайта',
        });
    },
};

// Репортёры движения
Blockly.Blocks['motion_xposition'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_xposition',
            message0: 'положение x',
            output: 'Number',
            style: 'motion_blocks',
            tooltip: 'Текущая координата x спрайта',
        });
    },
};

Blockly.Blocks['motion_yposition'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_yposition',
            message0: 'положение y',
            output: 'Number',
            style: 'motion_blocks',
            tooltip: 'Текущая координата y спрайта',
        });
    },
};

Blockly.Blocks['motion_direction'] = {
    init: function () {
        this.jsonInit({
            type: 'motion_direction',
            message0: 'направление',
            output: 'Number',
            style: 'motion_blocks',
            tooltip: 'Текущее направление спрайта',
        });
    },
};

export {};