/**
 * 创建raw_block块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function rawBlockBlocks(Blockly) {
  const rawConfig = {
    'message0': 'Code Block: %1 %2',
    'args0': [{
      'type': 'input_dummy',
    }, {
      'type': 'field_multilinetext',
      'name': 'TEXT',
      'value': '',
    }],
    'colour': '#777777',
    'previousStatement': null,
    'nextStatement': null,
  };

  Blockly.Blocks['raw_block'] = {
    init: function() {
      this.jsonInit(rawConfig);
    },
  };
}
export default rawBlockBlocks;

