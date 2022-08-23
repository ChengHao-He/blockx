/**
 * 创建binOP块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function binOpBlocks(Blockly) {
  const binOpConfig = {
    'message0': '%1 %2 %3',
    'args0': [
      {
        'type': 'input_value',
        'name': 'A',
      },
      {
        'type': 'field_dropdown',
        'name': 'OP',
        'options': Blockly.BINOPS_BLOCKLY_DISPLAY,
      },
      {
        'type': 'input_value',
        'name': 'B',
      },
    ],
    'inputsInline': true,
    'output': null,
    'colour': 190,
  };
  Blockly.Blocks['BinOp'] = {
    init: function() {
      this.jsonInit(binOpConfig);
    },
  };
};
export default binOpBlocks;
