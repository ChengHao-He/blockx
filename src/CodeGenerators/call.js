/**
 * call块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function callGenerate(Blockly) {
  Blockly.Python['Call'] = function(block) {
    if (block.module_) {
      Blockly.Python.definitions_['import_'+block.module_] =
    Blockly.prototype.MODULE_FUNCTION_IMPORTS[block.module_];
    }
    let funcName = '';
    if (block.isMethod_) {
      funcName = Blockly.Python.valueToCode(block,
          'FUNC', Blockly.Python.ORDER_FUNCTION_CALL) ||
            Blockly.Python.blank;
    }
    funcName += this.name_;
    const args = [];
    for (let i = 0; i < block.arguments_.length; i++) {
      const value = Blockly.Python.valueToCode(block, 'ARG' + i,
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
      const argument = block.arguments_[i];
      if (argument.startsWith('KWARGS:')) {
        args[i] = '**' + value;
      } else if (argument.startsWith('KEYWORD:')) {
        args[i] = argument.substring(8) + '=' + value;
      } else {
        args[i] = value;
      }
    }
    const code = funcName + '(' + args.join(', ') + ')';
    if (block.returns_) {
      return [code, Blockly.Python.ORDER_FUNCTION_CALL];
    } else {
      return [code + '\n'];
    }
  };
};
export default callGenerate;
