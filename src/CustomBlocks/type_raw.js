const rawConfig = {
  'message0': 'Code Block: %1 %2',
  'args0': [
    {
      'type': 'input_dummy',
    },
    {
      'type': 'field_multilinetext',
      'name': 'TEXT',
      'value': '',
    },

  ],
  'colour': 60,
  'previousStatement': null,
  'nextStatement': null,
};

Blockly.Blocks['raw'] = {
  init: function() {
    this.jsonInit(rawConfig);
  },
};
