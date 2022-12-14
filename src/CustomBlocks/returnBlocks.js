/**
 * 描述
 * @date 2022-08-23
 * @param {any} Blockly
 */
function returnBlocks(Blockly) {
  const returnFullConfig = {
    'message0': 'return %1',
    'args0': [
      {'type': 'input_value', 'name': 'VALUE'},
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
  };

  Blockly.Blocks['return_full'] = {
    init: function() {
      this.jsonInit(returnFullConfig);
    }};


  const returnConfig = {
    'message0': 'return',
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
  };
  Blockly.Blocks['return'] = {
    init: function() {
      this.jsonInit(returnConfig);
    }};
}
export default returnBlocks;
