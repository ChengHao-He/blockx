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
  'message0': 'break',
  'args0': [],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const continueConfig = {
  'message0': 'continue',
  'args0': [],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const tryConfig = {
  'message0': 'try %1',
  'args0': [
    {
      'type': 'input_value', 'name': 'DELTA', 'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const exceptConfig = {
  'message0': 'except %1',
  'args0': [
    {
      'type': 'input_value', 'name': 'DELTA', 'check': 'Number',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const elseConfig = {
  'message0': 'else',
  'args0': [],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const raiseConfig = {
  'message0': 'raise',
  'args0': [],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const assertConfig = {
  'message0': 'assert %1 , %2 ',
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
const withConfig = {
  'message0': 'with %1 as %2 ',
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
const deleteConfig = {
  'message0': 'delete %1',
  'args0': [
    {
      'type': 'input_value', 'name': 'DELTA', 'check': 'Number',
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
      'type': 'input_value', 'name': 'DELTA', 'check': 'Number',
    },
  ],
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

Blockly.Blocks['continue'] = {
  init: function() {
    this.jsonInit(continueConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['try'] = {
  init: function() {
    this.jsonInit(tryConfig);
    this.appendStatementInput('DO');
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
    this.jsonInit(exceptConfig);
    this.appendStatementInput('DO');
    this.jsonInit(elseConfig);
    this.appendStatementInput('DO');
  },
};

Blockly.Blocks['raise'] = {
  init: function() {
    this.jsonInit(raiseConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['assert'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(assertConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};

Blockly.Blocks['with'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(withConfig);
    this.appendStatementInput('DO');
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
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
