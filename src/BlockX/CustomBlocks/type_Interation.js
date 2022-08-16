const astFor = {
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
const astWhile = {
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
Blockly.Blocks['ast_For'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(astFor);
    this.appendStatementInput('DO');
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['ast_While'] = {
  init: function() {
    this.jsonInit(astWhile);
    this.appendStatementInput('DO');
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

