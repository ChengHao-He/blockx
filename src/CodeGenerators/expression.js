const pythonBlank = '__';
Blockly.Python['expression'] = function(block) {
  // Numeric value.
  const value = Blockly.Python
      .valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) ||
      pythonBlank;
  // TODO: Assemble JavaScript into code variable.
  return value;
};

Blockly.Python['if_expr'] = function(block) {
  const test =
  Blockly.Python.valueToCode(block, 'TEST', Blockly.Python.ORDER_CONDITIONAL) ||
      pythonBlank;
  const body =
  Blockly.Python.valueToCode(block, 'BODY', Blockly.Python.ORDER_CONDITIONAL) ||
  pythonBlank;
  const orelse =
  // eslint-disable-next-line max-len
  Blockly.Python.valueToCode(block, 'ORELSE', Blockly.Python.ORDER_CONDITIONAL) ||
  pythonBlank;
  return [body + ' if ' + test + ' else ' + orelse + '\n',
    Blockly.Python.ORDER_CONDITIONAL];
};
