import * as Blockly from 'blockly';
import { pythonGenerator, Order } from 'blockly/python';

// Движение
pythonGenerator.forBlock['motion_movesteps'] = function (block: Blockly.Block) {
    const steps = pythonGenerator.valueToCode(block, 'STEPS', Order.ATOMIC) || '10';
    return `sprite.move(${steps})\n`;
};

pythonGenerator.forBlock['motion_turnright'] = function (block: Blockly.Block) {
    const degrees = pythonGenerator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '15';
    return `sprite.turn_right(${degrees})\n`;
};

pythonGenerator.forBlock['motion_turnleft'] = function (block: Blockly.Block) {
    const degrees = pythonGenerator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '15';
    return `sprite.turn_left(${degrees})\n`;
};

pythonGenerator.forBlock['motion_gotoxy'] = function (block: Blockly.Block) {
    const x = pythonGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
    const y = pythonGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
    return `sprite.go_to_xy(${x}, ${y})\n`;
};

pythonGenerator.forBlock['motion_xposition'] = function () {
    return ['sprite.x', Order.ATOMIC];
};

pythonGenerator.forBlock['motion_yposition'] = function () {
    return ['sprite.y', Order.ATOMIC];
};

// Управление
pythonGenerator.forBlock['control_wait'] = function (block: Blockly.Block) {
    const secs = pythonGenerator.valueToCode(block, 'DURATION', Order.ATOMIC) || '1';
    return `await runtime.wait(${secs})\n`;
};

pythonGenerator.forBlock['control_repeat'] = function (block: Blockly.Block) {
    const times = pythonGenerator.valueToCode(block, 'TIMES', Order.ATOMIC) || '10';
    const branch = pythonGenerator.statementToCode(block, 'SUBSTACK') || '  pass\n';
    return `for _ in range(int(${times})):\n${branch}`;
};

pythonGenerator.forBlock['control_forever'] = function (block: Blockly.Block) {
    const branch = pythonGenerator.statementToCode(block, 'SUBSTACK') || '  pass\n';
    return `while True:\n${branch}`;
};

pythonGenerator.forBlock['control_if'] = function (block: Blockly.Block) {
    const condition = pythonGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'False';
    const branch = pythonGenerator.statementToCode(block, 'SUBSTACK') || '  pass\n';
    return `if ${condition}:\n${branch}`;
};

pythonGenerator.forBlock['control_if_else'] = function (block: Blockly.Block) {
    const condition = pythonGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'False';
    const branch1 = pythonGenerator.statementToCode(block, 'SUBSTACK') || '  pass\n';
    const branch2 = pythonGenerator.statementToCode(block, 'SUBSTACK2') || '  pass\n';
    return `if ${condition}:\n${branch1}else:\n${branch2}`;
};

// Операторы
pythonGenerator.forBlock['operator_add'] = function (block: Blockly.Block) {
    const a = pythonGenerator.valueToCode(block, 'NUM1', Order.ADDITIVE) || '0';
    const b = pythonGenerator.valueToCode(block, 'NUM2', Order.ADDITIVE) || '0';
    return [`(${a} + ${b})`, Order.ADDITIVE];
};

pythonGenerator.forBlock['operator_subtract'] = function (block: Blockly.Block) {
    const a = pythonGenerator.valueToCode(block, 'NUM1', Order.ADDITIVE) || '0';
    const b = pythonGenerator.valueToCode(block, 'NUM2', Order.ADDITIVE) || '0';
    return [`(${a} - ${b})`, Order.ADDITIVE];
};

pythonGenerator.forBlock['operator_multiply'] = function (block: Blockly.Block) {
    const a = pythonGenerator.valueToCode(block, 'NUM1', Order.MULTIPLICATIVE) || '0';
    const b = pythonGenerator.valueToCode(block, 'NUM2', Order.MULTIPLICATIVE) || '0';
    return [`(${a} * ${b})`, Order.MULTIPLICATIVE];
};

pythonGenerator.forBlock['operator_divide'] = function (block: Blockly.Block) {
    const a = pythonGenerator.valueToCode(block, 'NUM1', Order.MULTIPLICATIVE) || '0';
    const b = pythonGenerator.valueToCode(block, 'NUM2', Order.MULTIPLICATIVE) || '1';
    return [`(${a} / ${b})`, Order.MULTIPLICATIVE];
};

pythonGenerator.forBlock['math_number'] = function (block: Blockly.Block) {
    const num = block.getFieldValue('NUM');
    return [String(num), Order.ATOMIC];
};

pythonGenerator.forBlock['text'] = function (block: Blockly.Block) {
    const text = block.getFieldValue('TEXT');
    return [`'${text}'`, Order.ATOMIC];
};

// События
pythonGenerator.forBlock['event_whenflagclicked'] = function (block: Blockly.Block) {
    const code = pythonGenerator.statementToCode(block, 'STACK') || '  pass\n';
    return `@when_flag_clicked\nasync def on_flag():\n${code}\n`;
};

export { pythonGenerator };