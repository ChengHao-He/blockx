const forConfig = {
  'message0': 'for each item %1 in list %2 :',
  'args0': [
    {
      'type': 'input_value', 'name': 'DELTA', 'check': 'Number',
    },
    {'type': 'input_value', 'name': 'DELTA', 'check': 'Number'},
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const whileConfig = {
  'message0': 'while %1',
  'args0': [
    {
      'type': 'input_value', 'name': 'DELTA', 'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const breakConfig = {
  'message0': 'Break',
  'args0': [],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
Blockly.Blocks['for'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(forConfig);
    this.appendStatementInput('DO');
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['while'] = {
  init: function() {
    this.jsonInit(whileConfig);
    this.appendStatementInput('DO');
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['break'] = {
  init: function() {
    this.jsonInit(breakConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};
