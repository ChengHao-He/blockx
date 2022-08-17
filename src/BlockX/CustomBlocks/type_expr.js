const exprConfig = {
  'message0': 'do nothing with %1',
  'args0': [
    {'type': 'input_value', 'name': 'VALUE'},
  ],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': 60,
};
Blockly.Blocks['expr'] = {
  init: function() {
    this.jsonInit(exprConfig);
  }};
