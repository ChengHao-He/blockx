Blockly.BOOLOPS = [
  ['and', 'And', Blockly.Python.ORDER_LOGICAL_AND,
    'Return whether the left and right both evaluate to True.'],
  ['or', 'Or', Blockly.Python.ORDER_LOGICAL_OR,
    'Return whether either the left or right evaluate to True.'],
];
const BOOLOPS_BLOCKLY_DISPLAY = Blockly.BOOLOPS.map(
    (boolop) => [boolop[0], boolop[1]],
);
const BOOLOPS_BLOCKLY_GENERATE = {};
Blockly.BOOLOPS.forEach(function(boolop) {
  BOOLOPS_BLOCKLY_GENERATE[boolop[1]] = [' ' + boolop[0] + ' ', boolop[2]];
});
const boolopConfig = {
  'message0': '%1 %2 %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'A',
    },
    {
      'type': 'field_dropdown',
      'name': 'OP',
      'options': BOOLOPS_BLOCKLY_DISPLAY,
    },
    {
      'type': 'input_value',
      'name': 'B',
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 345,
};
Blockly.Blocks['BoolOp'] = {
  init: function() {
    this.jsonInit(boolopConfig);
  },
};
