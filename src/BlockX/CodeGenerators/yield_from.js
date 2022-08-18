Blockly.Python['yield_from'] = function(block) {
  const value = Blockly.Python.valueToCode(block,
      'VALUE', Blockly.Python.ORDER_LAMBDA) || Blockly.Python.blank;
  return ['yield from ' + value, Blockly.Python.ORDER_LAMBDA];
};
