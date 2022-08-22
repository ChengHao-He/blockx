Blockly.Python['attribute'] = function(block) {
  // Text value.
  const value = Blockly.Python.variableDB_
      .getName(block.getFieldValue('VALUE'), Blockly.Variables.NAME_TYPE);
  const attr = block.getFieldValue('ATTR');
  const code = value + '.' + attr;
  return [code, Blockly.Python.ORDER_MEMBER];
};
Blockly.Python['attribute_full'] = function(block) {
  // Text value.
  const value = Blockly.Python
      .valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  const attr = block.getFieldValue('ATTR');
  const code = value + '.' + attr;
  return [code, Blockly.Python.ORDER_MEMBER];
};

