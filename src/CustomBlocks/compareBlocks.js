/**
 * 创建compare块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function compareBlocks(Blockly) {
  const compareConfig = {
    'message0': '%1 %2 %3',
    'args0': [
      {'type': 'input_value', 'name': 'A'},
      {'type': 'field_dropdown', 'name': 'OP',
        'options': Blockly.COMPARES_BLOCKLY_DISPLAY},
      {'type': 'input_value', 'name': 'B'},
    ],
    'inputsInline': true,
    'output': 'Boolean',
    'colour': 345,
  };
  Blockly.Blocks['Compare'] = {
    init: function() {
      this.jsonInit(compareConfig);
    },
  };
}

export default compareBlocks;
