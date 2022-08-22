Blockly.Python['delete'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.targetCount_);
  for (let i = 0; i < block.targetCount_; i++) {
    elements[i] = Blockly.Python.valueToCode(block, 'TARGET' + i,
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
  }
  const code = 'del ' + elements.join(', ') + '\n';
  return code;
};
Blockly.Python['global'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.nameCount_);
  for (let i = 0; i < block.nameCount_; i++) {
    elements[i] = Blockly.Python.variableDB_
        .getName(block.getFieldValue('NAME' + i), Blockly.Variables.NAME_TYPE);
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
        .getName(block.getFieldValue('NAME' + i), Blockly.Variables.NAME_TYPE);
  }
  return 'nonlocal ' + elements.join(', ') + '\n';
};