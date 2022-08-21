Blockly.Python['return'] = function(_block) {
  return 'return\n';
};

Blockly.Python['return_full'] = function(block) {
  const value = Blockly.Python.valueToCode(block,
      'VALUE', Blockly.Python.ORDER_ATOMIC) || Blockly.Python.blank;
  return 'return ' + value + '\n';
};
