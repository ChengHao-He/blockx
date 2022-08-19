Blockly.COMPARES = [
  ['==', 'Eq', 'Return whether the two values are equal.'],
  ['!=', 'NotEq', 'Return whether the two values are not equal.'],
  ['<', 'Lt', 'Return whether the left value is less than the right value.'],
  ['<=', 'LtE', 'Return whether the left value is less than or equal to the' +
  'right value.'],
  ['>', 'Gt', 'Return whether the left value is greater than the right value.'],
  ['>=', 'GtE', 'Return whether the left value is greater than or equal to ' +
  'the right value.'],
  ['is', 'Is', 'Return whether the left value is identical to the right ' +
  'value.'],
  ['is not', 'IsNot', 'Return whether the left value is not identical to ' +
  'the right value.'],
  ['in', 'In', 'Return whether the left value is in the right value.'],
  ['not in', 'NotIn', 'Return whether the left value is not in the '+
  'right value.'],
];

const COMPARES_BLOCKLY_DISPLAY = Blockly.COMPARES.map(
    (boolop) => [boolop[0], boolop[1]],
);
const COMPARES_BLOCKLY_GENERATE = {};
Blockly.COMPARES.forEach(function(boolop) {
  COMPARES_BLOCKLY_GENERATE[boolop[1]] = boolop[0];
});
const compareConfig = {
  'message0': '%1 %2 %3',
  'args0': [
    {'type': 'input_value', 'name': 'A'},
    {'type': 'field_dropdown', 'name': 'OP',
      'options': COMPARES_BLOCKLY_DISPLAY},
    {'type': 'input_value', 'name': 'B'},
  ],
  'inputsInline': true,
  'output': 'Boolean',
  'colour': 345,
};
Blockly.Blocks['Compare'] = {
  init: function() {
    this.jsonInit(compareConfig);
  },
};
