const yieldFromConfig = {
  'message0': 'yield from %1',
  'args0': [
    {'type': 'input_value', 'name': 'VALUE'},
  ],
  'inputsInline': false,
  'output': null,
  'colour': 210,
};


Blockly.Blocks['yield_from'] = {
  init: function() {
    this.jsonInit(yieldFromConfig);
  },
};
