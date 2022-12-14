/**
 * lambda块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function lambdaGenerate(Blockly) {
  Blockly.Python['lambda'] = function(block) {
  // Parameters
    const parameters = new Array(block.parametersCount_);
    for (let i = 0; i < block.parametersCount_; i++) {
      parameters[i] = (Blockly.Python.valueToCode(block, 'PARAMETER' + i,
          Blockly.Python.ORDER_NONE) ||Blockly.Python.blank);
    }
    // Body
    const body = Blockly.Python.valueToCode(block,
        'BODY', Blockly.Python.ORDER_LAMBDA) || Blockly.Python.PASS;
    return ['lambda ' + parameters.join(', ') + ': ' +
     body, Blockly.Python.ORDER_LAMBDA];
  };
}
export default lambdaGenerate;
