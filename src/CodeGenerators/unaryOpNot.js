Blockly.UNARYOPS = [
  [
    '+', 'UAdd',
    'Do nothing to the number',
  ],
  [
    '-', 'USub',
    'Make the number negative',
  ],
  [
    'not', 'Not',
    'Return the logical opposite of the value.',
  ],
  [
    '~', 'Invert',
    'Take the bit inversion of the number',
  ],
];

Blockly.UNARYOPS.forEach(function(unaryop) {
  const fullName = 'UnaryOp' + unaryop[1];
  Blockly.Python[fullName] = function(block) {
    const order = (unaryop[1] === 'Not' ?
      Blockly.Python.ORDER_LOGICAL_NOT : Blockly.Python.ORDER_UNARY_SIGN);
    const argument1 =
      Blockly.Python.valueToCode(block, 'VALUE', order) || Blockly.Python.blank;
    const code = unaryop[0] + (unaryop[1] === 'Not' ? ' ' : '') + argument1;
    return [code, order];
  };
});