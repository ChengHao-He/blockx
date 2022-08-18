const attributeConfig = {
  'message0': '%1 . %2',
  'args0': [
    {
      'type': 'field_variable',
      'name': 'VALUE',
      'variable': 'variable',
    },
    {
      'type': 'field_input',
      'name': 'ATTR',
      'text': 'attribute',
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 240,
};

Blockly.Blocks['attribute'] = {
  init: function() {
    this.jsonInit(attributeConfig);
    // Assign 'this' to a variable for use in the tooltip closure below
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VALUE'));
    });
  },
};
