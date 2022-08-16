const strChar = {
  'message0': '%1',
  'args0': [{
    'type': 'field_dropdown',
    'name': 'TEXT',
    'options': [['\\n', '\n'], ['\\t', '\t']],
  }],
  'output': 'String',
  'colour': 120,
  'extensions': ['text_quotes'],
};

Blockly.Blocks['str_char'] = {
  init: function() {
    this.jsonInit(strChar);
    // Assign 'this' to a variable for use in the tooltip closure below.
    // Text value
    const thisBlock = this;
    this.setTooltip(function() {
      const value = thisBlock.getFieldValue('TEXT');

      switch (value) {
        case '\n':
          return ['\'\\n\'', Blockly.Python.ORDER_ATOMIC];

        case '\t':
          return ['\'\\t\'', Blockly.Python.ORDER_ATOMIC];
      }
    });
  },
};
