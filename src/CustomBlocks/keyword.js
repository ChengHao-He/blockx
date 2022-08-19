const deleteConfig = {
  'message0': 'delete %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'DELTA',
      'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const globalConfig = {
  'message0': 'global %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'DELTA',
      'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const starredConfig = {
  'message0': '* %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'DELTA',
      'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};

Blockly.Blocks['delete'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(deleteConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['global'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(globalConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['starred'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(starredConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

