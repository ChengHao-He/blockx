/**
 * compare块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function compareGenerate(Blockly) {
  Blockly.Python['Compare'] = function(block) {
    const tuple = Blockly.COMPARES_BLOCKLY_GENERATE[block.getFieldValue('OP')];
    const operator = ' ' + tuple + ' ';
    const order = Blockly.Python.ORDER_RELATIONAL;
    const argument0 =
    Blockly.Python.valueToCode(block, 'A', order) || Blockly.Python.blank;
    const argument1 =
    Blockly.Python.valueToCode(block, 'B', order) || Blockly.Python.blank;
    const code = argument0 + operator + argument1;
    return [code, order];
  };
}
export default compareGenerate;
