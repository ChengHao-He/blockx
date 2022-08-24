/**
 * 创建comment块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function commentBlocks(Blockly) {
  const commentConfig = {
    'message0': '%{BKY_ADD_COMMENT}',
    'args0': [
      {'type': 'field_input',
        'name': 'BODY',
        'text': '内容',
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
        return Blockly.Msg.ADD_COMMENT;
      });
    },
  };
}
export default commentBlocks;
