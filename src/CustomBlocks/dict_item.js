const dictItem = {
  'message0': '%1 : %2',
  'args0': [{
    'type': 'input_value',
    'name': 'KEY',
  }, {
    'type': 'input_value',
    'name': 'VALUE',
  },
  ],
  'output': 'DictPair',
  'colour': 0,
  'inputsInline': true,
};

// from Dict

Blockly.Blocks['dict_item'] = {
  init: function() {
    this.jsonInit(dictItem);
  },
};

