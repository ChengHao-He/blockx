/**
 * name块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function nameGenerate(Blockly) {
  Blockly.Python['name'] = function(block) {
  // Variable getter.
    const code = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    return [code, Blockly.Python.ORDER_ATOMIC];
  };
}
export default nameGenerate;

