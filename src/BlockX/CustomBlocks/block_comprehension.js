// 推导式comprehensions
const ComprehensionForConfig = {
  'message0': 'for %1 in %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'TARGET',
    },
    {
      'type': 'input_value',
      'name': 'ITERATOR',
    },
  ],
  'inputsInline': true,
  'output': 'ComprehensionFor',
  'colour': 15,
};
Blockly.Blocks['ComprehensionFor'] = {
  init: function() {
    this.jsonInit(ComprehensionForConfig);
  },
};

const ComprehensionIfConfig = {
  'message0': 'if %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'TEST',
    },
  ],
  'inputsInline': true,
  'output': 'ComprehensionIf',
  'colour': 15,
};
Blockly.Blocks['ComprehensionIf'] = {
  init: function() {
    this.jsonInit(ComprehensionIfConfig);
  },
};

Blockly.Blocks['Comp_create_with_container'] = {
  /**
   * 变形器容器
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(15);
    this.appendDummyInput()
        .appendField('Add new comprehensions below');
    this.appendDummyInput()
        .appendField('   For clause');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};

Blockly.Blocks['Comp_create_with_for'] = {
  /**
   * 变形器零件for
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(15);
    this.appendDummyInput()
        .appendField('For clause');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Blocks['Comp_create_with_if'] = {
  /**
   * 变形器零件if
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(15);
    this.appendDummyInput()
        .appendField('If clause');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};
