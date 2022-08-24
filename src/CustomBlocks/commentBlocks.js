/**
 * 创建comment块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function commentBlocks(Blockly) {
  const commentConfig = {
    'message0': '# Comment: %1',
    'args0': [
      {'type': 'field_input',
        'name': 'BODY',
        'text': 'will be ignored',
      },
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 195,
  };

  Blockly.Blocks['Comment'] = {
    init: function() {
      this.jsonInit(commentConfig);
      this.setTooltip(function() {
        return 'make a comment';
      });
    },
  };
}
export default commentBlocks;
