/**
 * boolOP的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function boolOpGenerate(Blockly) {
  Blockly.Python['BoolOp'] = function(block) {
  // Operations 'and', 'or'.
    const operator = (block.getFieldValue('OP') === 'And') ? 'and' : 'or';
    const order = (operator === 'and') ? Blockly.Python.ORDER_LOGICAL_AND :
        Blockly.Python.ORDER_LOGICAL_OR;
    const argument0 = Blockly
        .Python.valueToCode(block, 'A', order) || Blockly.Python.blank;
    const argument1 = Blockly
        .Python.valueToCode(block, 'B', order) || Blockly.Python.blank;
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  };
};
export default boolOpGenerate;
