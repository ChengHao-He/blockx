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
  [
    '@', 'MatMult',
    Blockly.Python.ORDER_MULTIPLICATIVE,
    'Return the matrix multiplication of the two numbers.',
    'matrix multiply', 'by',
  ],
];
const BINOPS_SIMPLE = ['Add', 'Sub', 'Mult', 'Div', 'Mod', 'Pow'];
const BINOPS_BLOCKLY_DISPLAY_FULL = Blockly.BINOPS.map(
    (binop) => [binop[0], binop[1]],
);
const BINOPS_BLOCKLY_DISPLAY = BINOPS_BLOCKLY_DISPLAY_FULL.filter(
    (binop) => BINOPS_SIMPLE.indexOf(binop[1]) >= 0,
);
Blockly.BINOPS_AUGASSIGN_DISPLAY_FULL =Blockly.BINOPS.map(
    (binop) => [binop[4], binop[1]],
);
Blockly.BINOPS_AUGASSIGN_DISPLAY = Blockly.BINOPS_AUGASSIGN_DISPLAY_FULL.filter(
    (binop) => BINOPS_SIMPLE.indexOf(binop[1]) >= 0,
);

const BINOPS_BLOCKLY_GENERATE = {};
Blockly.BINOPS_AUGASSIGN_PREPOSITION = {};
Blockly.BINOPS.forEach(function(binop) {
  BINOPS_BLOCKLY_GENERATE[binop[1]] = [' ' + binop[0], binop[2]];
  Blockly.BINOPS_AUGASSIGN_PREPOSITION[binop[1]] = binop[5];
});

const binOpConfig = {
  'message0': '%1 %2 %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'A',
    },
    {
      'type': 'field_dropdown',
      'name': 'OP',
      'options': BINOPS_BLOCKLY_DISPLAY,
    },
    {
      'type': 'input_value',
      'name': 'B',
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 190,
};

Blockly.Blocks['BinOp'] = {
  init: function() {
    this.jsonInit(binOpConfig);
  },
};

