/**
 * keyword块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function keywordGenerate(Blockly) {
  Blockly.Python['delete'] = function(block) {
  // Create a list with any number of elements of any type.
    const elements = new Array(block.targetCount_);
    for (let i = 0; i < block.targetCount_; i++) {
      elements[i] = Blockly.Python.valueToCode(block, 'TARGET' + i,
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    }
    return 'del ' + elements.join(', ') + '\n';
  };
  Blockly.Python['global'] = function(block) {
  // Create a list with any number of elements of any type.
    const elements = new Array(block.nameCount_);
    for (let i = 0; i < block.nameCount_; i++) {
      elements[i] = Blockly.Python.variableDB_
          .getName(block.getFieldValue('NAME' + i),
              Blockly.Variables.NAME_TYPE);
    }
    return 'global ' + elements.join(', ') + '\n';
  };
  Blockly.Python['starred'] = function(block) {
  // Basic arithmetic operators, and power.
    const order = Blockly.Python.ORDER_NONE;
    const argument1 = Blockly.Python
        .valueToCode(block, 'VALUE', order) || Blockly.Python.blank;
    const code = '*' + argument1;
    return [code, order];
  };
  Blockly.Python['nonlocal'] = function(block) {
  // Create a list with any number of elements of any type.
    const elements = new Array(block.nameCount_);
    for (let i = 0; i < block.nameCount_; i++) {
      elements[i] = Blockly.Python.variableDB_
          .getName(block.getFieldValue('NAME' + i),
              Blockly.Variables.NAME_TYPE);
    }
    return 'nonlocal ' + elements.join(', ') + '\n';
  };
  Blockly.Python['yield'] = function(_block) {
    return ['yield', Blockly.Python.ORDER_LAMBDA];
  };

  Blockly.Python['yield_full'] = function(block) {
    const value = Blockly.Python.valueToCode(block, 'VALUE',
        Blockly.Python.ORDER_LAMBDA) || Blockly.Python.blank;
    return ['yield ' + value, Blockly.Python.ORDER_LAMBDA];
  };
  Blockly.Python['yield_from'] = function(block) {
    const value = Blockly.Python.valueToCode(block,
        'VALUE', Blockly.Python.ORDER_LAMBDA) || Blockly.Python.blank;
    return ['yield from ' + value, Blockly.Python.ORDER_LAMBDA];
  };
};
export default keywordGenerate;
