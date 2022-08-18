const noneConfig = {
  'message0': 'None',
  'args0': [],
  'output': 'None',
  'colour': 345,
};

const boolConfig = {
  'message0': 'Boolean: %1',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'BOOL',
      'options': [
        ['True', 'TRUE'],
        ['False', 'FALSE'],
      ],
    },
  ],
  'output': 'Boolean',
  'colour': 350,
};

Blockly.Blocks['constant_none'] = {
  init: function() {
    this.jsonInit(noneConfig);
    this.setTooltip(function() {
      return 'Add doc string.';
    });
  },
};
Blockly.Blocks['constant_bool'] = {
  init: function() {
    this.jsonInit(boolConfig);
    this.setTooltip(function() {
      return 'Add doc string.';
    });
  },
};
