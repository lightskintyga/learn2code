import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

// ========== Движение ==========
javascriptGenerator.forBlock['motion_movesteps'] = function (block: Blockly.Block) {
    const steps = javascriptGenerator.valueToCode(block, 'STEPS', Order.ATOMIC) || '10';
    return `sprite.move(${steps});\n`;
};

javascriptGenerator.forBlock['motion_turnright'] = function (block: Blockly.Block) {
    const degrees = javascriptGenerator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '15';
    return `sprite.turnRight(${degrees});\n`;
};

javascriptGenerator.forBlock['motion_turnleft'] = function (block: Blockly.Block) {
    const degrees = javascriptGenerator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '15';
    return `sprite.turnLeft(${degrees});\n`;
};

javascriptGenerator.forBlock['motion_goto'] = function (block: Blockly.Block) {
    const to = block.getFieldValue('TO');
    return `sprite.goTo('${to}');\n`;
};

javascriptGenerator.forBlock['motion_gotoxy'] = function (block: Blockly.Block) {
    const x = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
    const y = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
    return `sprite.goToXY(${x}, ${y});\n`;
};

javascriptGenerator.forBlock['motion_glideto'] = function (block: Blockly.Block) {
    const secs = javascriptGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '1';
    const to = block.getFieldValue('TO');
    return `await sprite.glideTo(${secs}, '${to}');\n`;
};

javascriptGenerator.forBlock['motion_glidesecstoxy'] = function (block: Blockly.Block) {
    const secs = javascriptGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '1';
    const x = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
    const y = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
    return `await sprite.glideToXY(${secs}, ${x}, ${y});\n`;
};

javascriptGenerator.forBlock['motion_pointindirection'] = function (block: Blockly.Block) {
    const dir = javascriptGenerator.valueToCode(block, 'DIRECTION', Order.ATOMIC) || '90';
    return `sprite.pointInDirection(${dir});\n`;
};

javascriptGenerator.forBlock['motion_pointtowards'] = function (block: Blockly.Block) {
    const towards = block.getFieldValue('TOWARDS');
    return `sprite.pointTowards('${towards}');\n`;
};

javascriptGenerator.forBlock['motion_changexby'] = function (block: Blockly.Block) {
    const dx = javascriptGenerator.valueToCode(block, 'DX', Order.ATOMIC) || '10';
    return `sprite.changeX(${dx});\n`;
};

javascriptGenerator.forBlock['motion_setx'] = function (block: Blockly.Block) {
    const x = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
    return `sprite.setX(${x});\n`;
};

javascriptGenerator.forBlock['motion_changeyby'] = function (block: Blockly.Block) {
    const dy = javascriptGenerator.valueToCode(block, 'DY', Order.ATOMIC) || '10';
    return `sprite.changeY(${dy});\n`;
};

javascriptGenerator.forBlock['motion_sety'] = function (block: Blockly.Block) {
    const y = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
    return `sprite.setY(${y});\n`;
};

javascriptGenerator.forBlock['motion_ifonedgebounce'] = function () {
    return `sprite.ifOnEdgeBounce();\n`;
};

javascriptGenerator.forBlock['motion_setrotationstyle'] = function (block: Blockly.Block) {
    const style = block.getFieldValue('STYLE');
    return `sprite.setRotationStyle('${style}');\n`;
};

javascriptGenerator.forBlock['motion_xposition'] = function () {
    return ['sprite.x', Order.ATOMIC];
};

javascriptGenerator.forBlock['motion_yposition'] = function () {
    return ['sprite.y', Order.ATOMIC];
};

javascriptGenerator.forBlock['motion_direction'] = function () {
    return ['sprite.direction', Order.ATOMIC];
};

// ========== Внешний вид ==========
javascriptGenerator.forBlock['looks_sayforsecs'] = function (block: Blockly.Block) {
    const msg = javascriptGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    const secs = javascriptGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '2';
    return `await sprite.sayForSecs(${msg}, ${secs});\n`;
};

javascriptGenerator.forBlock['looks_say'] = function (block: Blockly.Block) {
    const msg = javascriptGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    return `sprite.say(${msg});\n`;
};

javascriptGenerator.forBlock['looks_thinkforsecs'] = function (block: Blockly.Block) {
    const msg = javascriptGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    const secs = javascriptGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '2';
    return `await sprite.thinkForSecs(${msg}, ${secs});\n`;
};

javascriptGenerator.forBlock['looks_think'] = function (block: Blockly.Block) {
    const msg = javascriptGenerator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    return `sprite.think(${msg});\n`;
};

javascriptGenerator.forBlock['looks_switchcostumeto'] = function (block: Blockly.Block) {
    const costume = block.getFieldValue('COSTUME');
    return `sprite.switchCostumeTo('${costume}');\n`;
};

javascriptGenerator.forBlock['looks_nextcostume'] = function () {
    return `sprite.nextCostume();\n`;
};

javascriptGenerator.forBlock['looks_switchbackdropto'] = function (block: Blockly.Block) {
    const backdrop = block.getFieldValue('BACKDROP');
    return `stage.switchBackdropTo('${backdrop}');\n`;
};

javascriptGenerator.forBlock['looks_nextbackdrop'] = function () {
    return `stage.nextBackdrop();\n`;
};

javascriptGenerator.forBlock['looks_changesizeby'] = function (block: Blockly.Block) {
    const change = javascriptGenerator.valueToCode(block, 'CHANGE', Order.ATOMIC) || '10';
    return `sprite.changeSizeBy(${change});\n`;
};

javascriptGenerator.forBlock['looks_setsizeto'] = function (block: Blockly.Block) {
    const size = javascriptGenerator.valueToCode(block, 'SIZE', Order.ATOMIC) || '100';
    return `sprite.setSizeTo(${size});\n`;
};

javascriptGenerator.forBlock['looks_changeeffectby'] = function (block: Blockly.Block) {
    const effect = block.getFieldValue('EFFECT');
    const change = javascriptGenerator.valueToCode(block, 'CHANGE', Order.ATOMIC) || '25';
    return `sprite.changeEffectBy('${effect}', ${change});\n`;
};

javascriptGenerator.forBlock['looks_seteffectto'] = function (block: Blockly.Block) {
    const effect = block.getFieldValue('EFFECT');
    const value = javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
    return `sprite.setEffectTo('${effect}', ${value});\n`;
};

javascriptGenerator.forBlock['looks_cleargraphiceffects'] = function () {
    return `sprite.clearGraphicEffects();\n`;
};

javascriptGenerator.forBlock['looks_show'] = function () {
    return `sprite.show();\n`;
};

javascriptGenerator.forBlock['looks_hide'] = function () {
    return `sprite.hide();\n`;
};

javascriptGenerator.forBlock['looks_gotofrontback'] = function (block: Blockly.Block) {
    const fb = block.getFieldValue('FRONT_BACK');
    return `sprite.goToLayer('${fb}');\n`;
};

javascriptGenerator.forBlock['looks_goforwardbackwardlayers'] = function (block: Blockly.Block) {
    const fb = block.getFieldValue('FORWARD_BACKWARD');
    const num = javascriptGenerator.valueToCode(block, 'NUM', Order.ATOMIC) || '1';
    return `sprite.goForwardBackwardLayers('${fb}', ${num});\n`;
};

javascriptGenerator.forBlock['looks_costumenumbername'] = function (block: Blockly.Block) {
    const nn = block.getFieldValue('NUMBER_NAME');
    return [`sprite.costume.${nn}`, Order.ATOMIC];
};

javascriptGenerator.forBlock['looks_backdropnumbername'] = function (block: Blockly.Block) {
    const nn = block.getFieldValue('NUMBER_NAME');
    return [`stage.backdrop.${nn}`, Order.ATOMIC];
};

javascriptGenerator.forBlock['looks_size'] = function () {
    return ['sprite.size', Order.ATOMIC];
};

// ========== Звук ==========
javascriptGenerator.forBlock['sound_playuntildone'] = function (block: Blockly.Block) {
    const sound = block.getFieldValue('SOUND_MENU');
    return `await sprite.playSoundUntilDone('${sound}');\n`;
};

javascriptGenerator.forBlock['sound_play'] = function (block: Blockly.Block) {
    const sound = block.getFieldValue('SOUND_MENU');
    return `sprite.playSound('${sound}');\n`;
};

javascriptGenerator.forBlock['sound_stopallsounds'] = function () {
    return `runtime.stopAllSounds();\n`;
};

javascriptGenerator.forBlock['sound_changevolumeby'] = function (block: Blockly.Block) {
    const vol = javascriptGenerator.valueToCode(block, 'VOLUME', Order.ATOMIC) || '-10';
    return `sprite.changeVolumeBy(${vol});\n`;
};

javascriptGenerator.forBlock['sound_setvolumeto'] = function (block: Blockly.Block) {
    const vol = javascriptGenerator.valueToCode(block, 'VOLUME', Order.ATOMIC) || '100';
    return `sprite.setVolumeTo(${vol});\n`;
};

javascriptGenerator.forBlock['sound_volume'] = function () {
    return ['sprite.volume', Order.ATOMIC];
};

// ========== События ==========
javascriptGenerator.forBlock['event_whenflagclicked'] = function (block: Blockly.Block) {
    const code = javascriptGenerator.statementToCode(block, 'STACK') || '';
    return `runtime.onFlagClicked(async function() {
${code}});\n`;
};

javascriptGenerator.forBlock['event_whenkeypressed'] = function (block: Blockly.Block) {
    const key = block.getFieldValue('KEY_OPTION');
    const code = javascriptGenerator.statementToCode(block, 'STACK') || '';
    return `runtime.onKeyPressed('${key}', async function() {
${code}});\n`;
};

javascriptGenerator.forBlock['event_whenthisspriteclicked'] = function (block: Blockly.Block) {
    const code = javascriptGenerator.statementToCode(block, 'STACK') || '';
    return `runtime.onSpriteClicked(sprite, async function() {
${code}});\n`;
};

javascriptGenerator.forBlock['event_broadcast'] = function (block: Blockly.Block) {
    const msg = block.getFieldValue('BROADCAST_INPUT');
    return `runtime.broadcast('${msg}');\n`;
};

javascriptGenerator.forBlock['event_broadcastandwait'] = function (block: Blockly.Block) {
    const msg = block.getFieldValue('BROADCAST_INPUT');
    return `await runtime.broadcastAndWait('${msg}');\n`;
};

javascriptGenerator.forBlock['event_whenbroadcastreceived'] = function (block: Blockly.Block) {
    const msg = block.getFieldValue('BROADCAST_OPTION');
    const code = javascriptGenerator.statementToCode(block, 'STACK') || '';
    return `runtime.onBroadcastReceived('${msg}', async function() {
${code}});\n`;
};

// ========== Управление ==========
javascriptGenerator.forBlock['control_wait'] = function (block: Blockly.Block) {
    const secs = javascriptGenerator.valueToCode(block, 'DURATION', Order.ATOMIC) || '1';
    return `await runtime.wait(${secs});\n`;
};

javascriptGenerator.forBlock['control_repeat'] = function (block: Blockly.Block) {
    const times = javascriptGenerator.valueToCode(block, 'TIMES', Order.ATOMIC) || '10';
    const branch = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
    return `for (let __i = 0; __i < ${times}; __i++) {\n${branch}  await runtime.yield();\n}\n`;
};

javascriptGenerator.forBlock['control_forever'] = function (block: Blockly.Block) {
    const branch = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
    return `while (runtime.isRunning()) {\n${branch}  await runtime.yield();\n}\n`;
};

javascriptGenerator.forBlock['control_if'] = function (block: Blockly.Block) {
    const condition = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
    const branch = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
    return `if (${condition}) {\n${branch}}\n`;
};

javascriptGenerator.forBlock['control_if_else'] = function (block: Blockly.Block) {
    const condition = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
    const branch1 = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
    const branch2 = javascriptGenerator.statementToCode(block, 'SUBSTACK2') || '';
    return `if (${condition}) {\n${branch1}} else {\n${branch2}}\n`;
};

javascriptGenerator.forBlock['control_wait_until'] = function (block: Blockly.Block) {
    const condition = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
    return `while (!(${condition})) { await runtime.yield(); }\n`;
};

javascriptGenerator.forBlock['control_repeat_until'] = function (block: Blockly.Block) {
    const condition = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
    const branch = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
    return `while (!(${condition})) {\n${branch}  await runtime.yield();\n}\n`;
};

javascriptGenerator.forBlock['control_stop'] = function (block: Blockly.Block) {
    const option = block.getFieldValue('STOP_OPTION');
    return `runtime.stop('${option}');\n`;
};

javascriptGenerator.forBlock['control_create_clone_of'] = function (block: Blockly.Block) {
    const option = block.getFieldValue('CLONE_OPTION');
    return `runtime.createClone('${option}');\n`;
};

javascriptGenerator.forBlock['control_delete_this_clone'] = function () {
    return `runtime.deleteThisClone();\n`;
};

javascriptGenerator.forBlock['control_start_as_clone'] = function (block: Blockly.Block) {
    const code = javascriptGenerator.statementToCode(block, 'STACK') || '';
    return `runtime.onCloneStart(async function() {
${code}});\n`;
};

// ========== Сенсоры ==========
javascriptGenerator.forBlock['sensing_touchingobject'] = function (block: Blockly.Block) {
    const obj = block.getFieldValue('TOUCHINGOBJECTMENU');
    return [`sprite.isTouching('${obj}')`, Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_askandwait'] = function (block: Blockly.Block) {
    const q = javascriptGenerator.valueToCode(block, 'QUESTION', Order.ATOMIC) || "''";
    return `await runtime.askAndWait(${q});\n`;
};

javascriptGenerator.forBlock['sensing_answer'] = function () {
    return ['runtime.answer', Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_keypressed'] = function (block: Blockly.Block) {
    const key = block.getFieldValue('KEY_OPTION');
    return [`runtime.isKeyPressed('${key}')`, Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_mousedown'] = function () {
    return ['runtime.isMouseDown()', Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_mousex'] = function () {
    return ['runtime.mouseX', Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_mousey'] = function () {
    return ['runtime.mouseY', Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_timer'] = function () {
    return ['runtime.timer()', Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_resettimer'] = function () {
    return `runtime.resetTimer();\n`;
};

javascriptGenerator.forBlock['sensing_current'] = function (block: Blockly.Block) {
    const menu = block.getFieldValue('CURRENTMENU');
    return [`runtime.current('${menu}')`, Order.ATOMIC];
};

javascriptGenerator.forBlock['sensing_username'] = function () {
    return ['runtime.username', Order.ATOMIC];
};

// ========== Операторы ==========
javascriptGenerator.forBlock['operator_add'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'NUM1', Order.ADDITION) || '0';
    const b = javascriptGenerator.valueToCode(block, 'NUM2', Order.ADDITION) || '0';
    return [`(${a} + ${b})`, Order.ADDITION];
};

javascriptGenerator.forBlock['operator_subtract'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'NUM1', Order.SUBTRACTION) || '0';
    const b = javascriptGenerator.valueToCode(block, 'NUM2', Order.SUBTRACTION) || '0';
    return [`(${a} - ${b})`, Order.SUBTRACTION];
};

javascriptGenerator.forBlock['operator_multiply'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'NUM1', Order.MULTIPLICATION) || '0';
    const b = javascriptGenerator.valueToCode(block, 'NUM2', Order.MULTIPLICATION) || '0';
    return [`(${a} * ${b})`, Order.MULTIPLICATION];
};

javascriptGenerator.forBlock['operator_divide'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'NUM1', Order.DIVISION) || '0';
    const b = javascriptGenerator.valueToCode(block, 'NUM2', Order.DIVISION) || '1';
    return [`(${a} / ${b})`, Order.DIVISION];
};

javascriptGenerator.forBlock['operator_random'] = function (block: Blockly.Block) {
    const from = javascriptGenerator.valueToCode(block, 'FROM', Order.ATOMIC) || '1';
    const to = javascriptGenerator.valueToCode(block, 'TO', Order.ATOMIC) || '10';
    return [`runtime.random(${from}, ${to})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['operator_gt'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'OPERAND1', Order.RELATIONAL) || '0';
    const b = javascriptGenerator.valueToCode(block, 'OPERAND2', Order.RELATIONAL) || '0';
    return [`(${a} > ${b})`, Order.RELATIONAL];
};

javascriptGenerator.forBlock['operator_lt'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'OPERAND1', Order.RELATIONAL) || '0';
    const b = javascriptGenerator.valueToCode(block, 'OPERAND2', Order.RELATIONAL) || '0';
    return [`(${a} < ${b})`, Order.RELATIONAL];
};

javascriptGenerator.forBlock['operator_equals'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'OPERAND1', Order.EQUALITY) || '0';
    const b = javascriptGenerator.valueToCode(block, 'OPERAND2', Order.EQUALITY) || '0';
    return [`(${a} == ${b})`, Order.EQUALITY];
};

javascriptGenerator.forBlock['operator_and'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'OPERAND1', Order.LOGICAL_AND) || 'false';
    const b = javascriptGenerator.valueToCode(block, 'OPERAND2', Order.LOGICAL_AND) || 'false';
    return [`(${a} && ${b})`, Order.LOGICAL_AND];
};

javascriptGenerator.forBlock['operator_or'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'OPERAND1', Order.LOGICAL_OR) || 'false';
    const b = javascriptGenerator.valueToCode(block, 'OPERAND2', Order.LOGICAL_OR) || 'false';
    return [`(${a} || ${b})`, Order.LOGICAL_OR];
};

javascriptGenerator.forBlock['operator_not'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'OPERAND', Order.LOGICAL_NOT) || 'false';
    return [`!(${a})`, Order.LOGICAL_NOT];
};

javascriptGenerator.forBlock['operator_join'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'STRING1', Order.ATOMIC) || "''";
    const b = javascriptGenerator.valueToCode(block, 'STRING2', Order.ATOMIC) || "''";
    return [`String(${a}) + String(${b})`, Order.ADDITION];
};

javascriptGenerator.forBlock['operator_letter_of'] = function (block: Blockly.Block) {
    const idx = javascriptGenerator.valueToCode(block, 'LETTER', Order.ATOMIC) || '1';
    const str = javascriptGenerator.valueToCode(block, 'STRING', Order.ATOMIC) || "''";
    return [`String(${str}).charAt(${idx} - 1)`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['operator_length'] = function (block: Blockly.Block) {
    const str = javascriptGenerator.valueToCode(block, 'STRING', Order.ATOMIC) || "''";
    return [`String(${str}).length`, Order.MEMBER];
};

javascriptGenerator.forBlock['operator_contains'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'STRING1', Order.ATOMIC) || "''";
    const b = javascriptGenerator.valueToCode(block, 'STRING2', Order.ATOMIC) || "''";
    return [`String(${a}).toLowerCase().includes(String(${b}).toLowerCase())`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['operator_mod'] = function (block: Blockly.Block) {
    const a = javascriptGenerator.valueToCode(block, 'NUM1', Order.MODULUS) || '0';
    const b = javascriptGenerator.valueToCode(block, 'NUM2', Order.MODULUS) || '1';
    return [`(${a} % ${b})`, Order.MODULUS];
};

javascriptGenerator.forBlock['operator_round'] = function (block: Blockly.Block) {
    const num = javascriptGenerator.valueToCode(block, 'NUM', Order.ATOMIC) || '0';
    return [`Math.round(${num})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['operator_mathop'] = function (block: Blockly.Block) {
    const op = block.getFieldValue('OPERATOR');
    const num = javascriptGenerator.valueToCode(block, 'NUM', Order.ATOMIC) || '0';
    const mathOps: Record<string, string> = {
        'abs': `Math.abs(${num})`,
        'floor': `Math.floor(${num})`,
        'ceiling': `Math.ceil(${num})`,
        'sqrt': `Math.sqrt(${num})`,
        'sin': `Math.sin(${num} * Math.PI / 180)`,
        'cos': `Math.cos(${num} * Math.PI / 180)`,
        'tan': `Math.tan(${num} * Math.PI / 180)`,
        'asin': `Math.asin(${num}) * 180 / Math.PI`,
        'acos': `Math.acos(${num}) * 180 / Math.PI`,
        'atan': `Math.atan(${num}) * 180 / Math.PI`,
        'ln': `Math.log(${num})`,
        'log': `Math.log10(${num})`,
        'e ^': `Math.exp(${num})`,
        '10 ^': `Math.pow(10, ${num})`,
    };
    return [mathOps[op] || '0', Order.FUNCTION_CALL];
};

// ========== Переменные ==========
javascriptGenerator.forBlock['data_variable'] = function (block: Blockly.Block) {
    const varName = block.getFieldValue('VARIABLE');
    return [`runtime.getVariable('${varName}')`, Order.ATOMIC];
};

javascriptGenerator.forBlock['data_setvariableto'] = function (block: Blockly.Block) {
    const varName = block.getFieldValue('VARIABLE');
    const value = javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
    return `runtime.setVariable('${varName}', ${value});\n`;
};

javascriptGenerator.forBlock['data_changevariableby'] = function (block: Blockly.Block) {
    const varName = block.getFieldValue('VARIABLE');
    const value = javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '1';
    return `runtime.changeVariableBy('${varName}', ${value});\n`;
};

// ========== Вспомогательные ==========
javascriptGenerator.forBlock['math_number'] = function (block: Blockly.Block) {
    const num = block.getFieldValue('NUM');
    return [String(num), Order.ATOMIC];
};

javascriptGenerator.forBlock['text'] = function (block: Blockly.Block) {
    const text = block.getFieldValue('TEXT');
    return [`'${text}'`, Order.ATOMIC];
};

export { javascriptGenerator };