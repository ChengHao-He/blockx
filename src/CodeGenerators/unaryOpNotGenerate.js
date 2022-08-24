/**
 * unaryOPNot块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function unaryOPNotGenerate(Blockly) {
  Blockly.UNARYOPS.forEach(function(unaryop) {
    const fullName = 'UnaryOp' + unaryop[1];
    Blockly.Python[fullName] = function(block) {
      const order = (unaryop[1] === 'Not' ?
      Blockly.Python.ORDER_LOGICAL_NOT : Blockly.Python.ORDER_UNARY_SIGN);
      const argument1 =
      Blockly.Python.valueToCode(block, 'VALUE', order) || Blockly.Python.blank;
      const code = unaryop[0] + (unaryop[1] === 'Not' ? ' ' : '') + argument1;
      return [code, order];
    };
  });
}
export default unaryOPNotGenerate;

