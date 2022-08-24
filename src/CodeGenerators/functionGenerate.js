/**
 * function块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function functionGenerate(Blockly) {
  Blockly.Python['FunctionDef'] = function(block) {
  // Name
    const name = Blockly.Python.variableDB_
        .getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
    // Decorators
    const decorators = new Array(block.decoratorsCount_);
    for (let i = 0; i < block.decoratorsCount_; i++) {
      const decorator = (Blockly.Python
          .valueToCode(block, 'DECORATOR' + i, Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank);
      decorators[i] = '@' + decorator + '\n';
    }
    // Parameters
    const parameters = new Array(block.parametersCount_);
    for (let i = 0; i < block.parametersCount_; i++) {
      parameters[i] = (Blockly.Python
          .valueToCode(block, 'PARAMETER' + i, Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank);
    }
    // Return annotation
    let returns = '';
    if (this.hasReturn_) {
      returns = ' -> ' + Blockly.Python
          .valueToCode(block, 'RETURNS', Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank;
    }
    // Body
    const body = Blockly.Python
        .statementToCode(block, 'BODY') || Blockly.Python.PASS;
    return decorators.join('') + 'def ' + name +
   '(' + parameters.join(', ') + ')' + returns + ':\n' + body;
  };
}
export default functionGenerate;

