/**
 * 描述
 * @date 2022-08-23
 * @param {any} Blockly
 */
function binOpGenerate(Blockly) {
  Blockly.Python['BinOp'] = function(block) {
  // Basic arithmetic operators, and power.
    const tuple = Blockly.BINOPS_BLOCKLY_GENERATE[block.getFieldValue('OP')];
    const operator = tuple[0]+' ';
    const order = tuple[1];
    const argument0 = Blockly.Python
        .valueToCode(block, 'A', order) || Blockly.Python.blank;
    const argument1 = Blockly.Python
        .valueToCode(block, 'B', order) || Blockly.Python.blank;
    const code = argument0 + operator + argument1;
    return [code, order];
  };
  Blockly.Python['BinOpFull'] = Blockly.Python['BinOp'];
};
export default binOpGenerate;
