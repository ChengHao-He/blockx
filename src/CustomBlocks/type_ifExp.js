const ifExpConnfig = {
  'type': 'IfExp',
  'message0': '%1 if %2 else %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'BODY',
    },
    {
      'type': 'input_value',
      'name': 'TEST',
    },
    {
      'type': 'input_value',
      'name': 'ORELSE',
    },
  ],
  'inputsInline': true,
  'output': null,
  'colour': 345,
};
Blockly.Blocks['IfExp'] = {
  init: function() {
    this.jsonInit(ifExpConnfig);
  },
};

