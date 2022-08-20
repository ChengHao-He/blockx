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
      'options': Blockly.BINOPS_BLOCKLY_DISPLAY,
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
const binOpFullConfig = {
  'message0': '%1 %2 %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'A',
    },
    {
      'type': 'field_dropdown',
      'name': 'OP',
      'options': Blockly.BINOPS_BLOCKLY_DISPLAY_FULL,
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

Blockly.Blocks['BinOpFull'] = {
  init: function() {
    this.jsonInit(binOpFullConfig);
  },
};
