Blockly.Python['expression'] = function(block) {
  // Numeric value.
  return Blockly.Python
      .valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) ||
      Blockly.Python.blank;
};

Blockly.Python['if_expr'] = function(block) {
  const test =
  Blockly.Python.valueToCode(block, 'TEST', Blockly.Python.ORDER_CONDITIONAL) ||
      Blockly.Python.blank;
  const body =
  Blockly.Python.valueToCode(block, 'BODY', Blockly.Python.ORDER_CONDITIONAL) ||
  Blockly.Python.blank;
  const orelse =
  // eslint-disable-next-line max-len
  Blockly.Python.valueToCode(block, 'ORELSE', Blockly.Python.ORDER_CONDITIONAL) ||
  Blockly.Python.blank;
  return [body + ' if ' + test + ' else ' + orelse + '\n',
    Blockly.Python.ORDER_CONDITIONAL];
};
