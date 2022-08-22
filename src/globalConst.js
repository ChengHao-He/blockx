Blockly.Python.blank = '__';

Blockly.COMPREHENSION_SETTINGS = {
  'list_comp': {
    start: '[',
    end: ']',
    color: 30,
  }, 'set_comp': {
    start: '{',
    end: '}',
    color: 30,
  }, 'dict_comp': {
    start: '{',
    end: '}',
    color: 0,
  }, 'generator_expr': {
    start: '(',
    end: ')',
    color: 15,
  },
};

Blockly.BINOPS = [
  [
    '+', 'Add',
    Blockly.Python.ORDER_ADDITIVE,
    'Return the sum of the two numbers.',
    'increase', 'by',
  ],
  [
    '-', 'Sub',
    Blockly.Python.ORDER_ADDITIVE,
    'Return the difference of the two numbers.',
    'decrease', 'by',
  ],
  [
    '*', 'Mult',
    Blockly.Python.ORDER_MULTIPLICATIVE,
    'Return the product of the two numbers.',
    'multiply', 'by',
  ],
  [
    '/', 'Div',
    Blockly.Python.ORDER_MULTIPLICATIVE,
    'Return the quotient of the two numbers.',
    'divide', 'by',
  ],
  [
    '%', 'Mod',
    Blockly.Python.ORDER_MULTIPLICATIVE,
    'Return the remainder of the first number divided by the second number.',
    'modulo', 'by'],
  [
    '**', 'Pow',
    Blockly.Python.ORDER_EXPONENTIATION,
    'Return the first number raised to the power of the second number.',
    'raise', 'to',
  ],
  ['//', 'FloorDiv',
    Blockly.Python.ORDER_MULTIPLICATIVE,
    'Return the truncated quotient of the two numbers.',
    'floor divide', 'by',
  ],
  ['<<', 'LShift',
    Blockly.Python.ORDER_BITWISE_SHIFT,
    'Return the left number left shifted by the right number.',
    'left shift', 'by',
  ],
  ['>>', 'RShift',
    Blockly.Python.ORDER_BITWISE_SHIFT,
    'Return the left number right shifted by the right number.',
    'right shift', 'by',
  ],
  [
    '|', 'BitOr',
    Blockly.Python.ORDER_BITWISE_OR,
    'Returns the bitwise OR of the two values.',
    'bitwise OR', 'using',
  ],
  [
    '^', 'BitXor',
    Blockly.Python.ORDER_BITWISE_XOR,
    'Returns the bitwise XOR of the two values.',
    'bitwise XOR', 'using',
  ],
  [
    '&', 'BitAnd',
    Blockly.Python.ORDER_BITWISE_AND,
    'Returns the bitwise AND of the two values.',
    'bitwise AND', 'using',
  ],
];

Blockly.BINOPS_BLOCKLY_DISPLAY_FULL = Blockly.BINOPS.map(
    (binop) => [binop[0], binop[1]],
);
Blockly.BINOPS_AUGASSIGN_DISPLAY_FULL = Blockly.BINOPS.map(
    (binop) => [binop[4], binop[1]],
);

Blockly.BINOPS_BLOCKLY_GENERATE = {};
Blockly.BINOPS_AUGASSIGN_PREPOSITION = {};
Blockly.BINOPS.forEach(function(binop) {
  Blockly.BINOPS_BLOCKLY_GENERATE[binop[1]] = [' ' + binop[0], binop[2]];
  Blockly.BINOPS_AUGASSIGN_PREPOSITION[binop[1]] = binop[5];
});
