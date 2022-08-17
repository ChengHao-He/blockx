const yieldFullConfig = {
  'message0': 'yield %1',
  'args0': [
    {'type': 'input_value', 'name': 'VALUE'},
  ],
  'inputsInline': false,
  'output': null,
  'colour': 210,
};
Blockly.Blocks['yield_full'] = {
  init: function() {
    this.jsonInit(yieldFullConfig);
  }};

const yieldConfig = {
  'message0': 'yield',
  'inputsInline': false,
  'output': null,
  'colour': 210,
};

Blockly.Blocks['yield'] = {
  init: function() {
    this.jsonInit(yieldConfig);
  }};

