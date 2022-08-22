

const rawConfig = {
  'message0': 'Code Block: %1 %2',
  'args0': [{
    'type': 'input_dummy',
  }, {
    'type': 'field_multilinetext',
    'name': 'TEXT',
    'value': '',
  }],
  'colour': '#777777',
  'previousStatement': null,
  'nextStatement': null,
};

Blockly.Blocks['raw_block'] = {
  init: function() {
    this.jsonInit(rawConfig);
  },
};
