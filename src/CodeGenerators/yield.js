Blockly.Python['yield'] = function(block) {
  return ['yield', Blockly.Python.ORDER_LAMBDA];
};

Blockly.Python['yield_full'] = function(block) {
  const value = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_LAMBDA) || Blockly.Python.blank;
  return ['yield ' + value, Blockly.Python.ORDER_LAMBDA];
};
