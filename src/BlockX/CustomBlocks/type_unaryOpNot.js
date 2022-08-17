Blockly.UNARYOPS = [
  [
    '+', 'UAdd',
    'Do nothing to the number'
  ],
  [
    '~', 'Invert',
    'Take the bit inversion of the number'
  ],
];

Blockly.UNARYOPS.forEach(function(unaryop) {
  const fullName = 'UnaryOp' + unaryop[1];
  console.log(fullName);
  const initBlockConfig = {
    'message0': unaryop[0] + ' %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'VALUE',
      },
    ],
    'inputsInline': false,
    'output': null,
    'colour': (unaryop[1] === 'Not' ? 345 : 190),
  };
  Blockly.Blocks[fullName] = {
    init: function() {
      this.jsonInit(initBlockConfig);
    },
  };
});

