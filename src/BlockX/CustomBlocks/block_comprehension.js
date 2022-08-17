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

