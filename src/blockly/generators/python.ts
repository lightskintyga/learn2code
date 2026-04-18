import * as Blockly from 'blockly';
import { pythonGenerator, Order } from 'blockly/python';

// Движение
pythonGenerator.forBlock['motion_movesteps'] = function (block: Blockly.Block) {
    const steps = pythonGenerator.valueToCode(block, 'STEPS', Order.ATOMIC) || '10';
    return `move(${steps})\n`;
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
    return `@when_flag_clicked
async def on_flag():
${code}
`;
};

// Внешний вид (Looks)
pythonGenerator.forBlock['looks_say'] = function (block: Blockly.Block) {
    const message = pythonGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    return `sprite.say(${message})\n`;
};

pythonGenerator.forBlock['looks_sayforsecs'] = function (block: Blockly.Block) {
    const message = pythonGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    const secs = pythonGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '2';
    return `await sprite.say_for_secs(${message}, ${secs})\n`;
};

pythonGenerator.forBlock['looks_think'] = function (block: Blockly.Block) {
    const message = pythonGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    return `sprite.think(${message})\n`;
};

pythonGenerator.forBlock['looks_thinkforsecs'] = function (block: Blockly.Block) {
    const message = pythonGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    const secs = pythonGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '2';
    return `await sprite.think_for_secs(${message}, ${secs})\n`;
};

pythonGenerator.forBlock['looks_switchcostumeto'] = function (block: Blockly.Block) {
    const costume = block.getFieldValue('COSTUME') || 'costume1';
    return `sprite.switch_costume_to('${costume}')\n`;
};

pythonGenerator.forBlock['looks_nextcostume'] = function () {
    return `sprite.next_costume()\n`;
};

pythonGenerator.forBlock['looks_switchbackdropto'] = function (block: Blockly.Block) {
    const backdrop = block.getFieldValue('BACKDROP') || 'backdrop1';
    return `stage.switch_backdrop_to('${backdrop}')\n`;
};

pythonGenerator.forBlock['looks_nextbackdrop'] = function () {
    return `stage.next_backdrop()\n`;
};

pythonGenerator.forBlock['looks_changesizeby'] = function (block: Blockly.Block) {
    const change = pythonGenerator.valueToCode(block, 'CHANGE', Order.ATOMIC) || '10';
    return `sprite.change_size_by(${change})\n`;
};

pythonGenerator.forBlock['looks_setsizeto'] = function (block: Blockly.Block) {
    const size = pythonGenerator.valueToCode(block, 'SIZE', Order.ATOMIC) || '100';
    return `sprite.set_size_to(${size})\n`;
};

pythonGenerator.forBlock['looks_changeeffectby'] = function (block: Blockly.Block) {
    const effect = block.getFieldValue('EFFECT') || 'COLOR';
    const change = pythonGenerator.valueToCode(block, 'CHANGE', Order.ATOMIC) || '25';
    return `sprite.change_effect_by('${effect}', ${change})\n`;
};

pythonGenerator.forBlock['looks_seteffectto'] = function (block: Blockly.Block) {
    const effect = block.getFieldValue('EFFECT') || 'COLOR';
    const value = pythonGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
    return `sprite.set_effect_to('${effect}', ${value})\n`;
};

pythonGenerator.forBlock['looks_cleargraphiceffects'] = function () {
    return `sprite.clear_graphic_effects()\n`;
};

pythonGenerator.forBlock['looks_show'] = function () {
    return `sprite.show()\n`;
};

pythonGenerator.forBlock['looks_hide'] = function () {
    return `sprite.hide()\n`;
};

pythonGenerator.forBlock['looks_size'] = function () {
    return ['sprite.size', Order.ATOMIC];
};

// Звук (Sound)
pythonGenerator.forBlock['sound_play'] = function (block: Blockly.Block) {
    const sound = block.getFieldValue('SOUND_MENU') || 'sound1';
    return `sprite.start_sound('${sound}')\n`;
};

pythonGenerator.forBlock['sound_playuntildone'] = function (block: Blockly.Block) {
    const sound = block.getFieldValue('SOUND_MENU') || 'sound1';
    return `await sprite.play_sound_until_done('${sound}')\n`;
};

pythonGenerator.forBlock['sound_stopallsounds'] = function () {
    return `sprite.stop_all_sounds()\n`;
};

pythonGenerator.forBlock['sound_changeeffectby'] = function (block: Blockly.Block) {
    const effect = block.getFieldValue('EFFECT') || 'PITCH';
    const value = pythonGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '10';
    return `sprite.change_sound_effect_by('${effect}', ${value})\n`;
};

pythonGenerator.forBlock['sound_seteffectto'] = function (block: Blockly.Block) {
    const effect = block.getFieldValue('EFFECT') || 'PITCH';
    const value = pythonGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '100';
    return `sprite.set_sound_effect_to('${effect}', ${value})\n`;
};

pythonGenerator.forBlock['sound_cleareffects'] = function () {
    return `sprite.clear_sound_effects()\n`;
};

pythonGenerator.forBlock['sound_changevolumeby'] = function (block: Blockly.Block) {
    const volume = pythonGenerator.valueToCode(block, 'VOLUME', Order.ATOMIC) || '-10';
    return `sprite.change_volume_by(${volume})\n`;
};

pythonGenerator.forBlock['sound_setvolumeto'] = function (block: Blockly.Block) {
    const volume = pythonGenerator.valueToCode(block, 'VOLUME', Order.ATOMIC) || '100';
    return `sprite.set_volume_to(${volume})\n`;
};

pythonGenerator.forBlock['sound_volume'] = function () {
    return ['sprite.volume', Order.ATOMIC];
};

export { pythonGenerator };