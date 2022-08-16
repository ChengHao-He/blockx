// 块基本信息
const intNumberConfig = {
  'message0': 'int: %1',
  'args0': [
    {
      'type': 'field_number',
      'name': 'NUM',
      'value': 0,
      'precision': 1,
    },
  ],
  'output': 'Number',
  'colour': 190,
};
const floatNumberConfig = {
  'message0': 'float: %1',
  'args0': [
    {
      'type': 'field_number',
      'name': 'NUM',
      'value': 0.0,
    },
  ],
  'output': 'Number',
  'colour': 195,
};
const astFor = {
  'message0': 'for each item %1 in list %2 :',
  'args0': [
    {
      'type': 'input_value', 'name': 'DELTA', 'check': 'Number'},
    {'type': 'input_value', 'name': 'DELTA', 'check': 'Number'},
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};

// 块初始化及扩展信息
Blockly.Blocks['int_number'] = {
  init: function() {
    this.jsonInit(intNumberConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a int number "%1".'.replace('%1',
          thisBlock.getFieldValue('NUM'));
    });
  },
};

Blockly.Blocks['float_number'] = {
  init: function() {
    this.jsonInit(floatNumberConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a float number "%1".'.replace('%1',
          thisBlock.getFieldValue('NUM'));
    });
  },
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
