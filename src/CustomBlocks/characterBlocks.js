/**
 * 创建character块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function characterBlocks(Blockly) {
  const charConfig = {
    'message0': '%1',
    'args0': [{
      'type': 'field_dropdown',
      'name': 'TEXT',
      'options': [
        ['\\n', 'new_line'],
        ['\\t', 'tab'],
        ['\\\'', 'single_quote'],
        ['\\', 'backslash'],
        ['\\r', 'carriage_return'],
        ['\\b', 'backspace'],
        ['\\f', 'form_feed'],
        ['\\ooo', 'octal_value'],
        ['\\xhh', 'hex_value'],
      ],
    }],
    'output': 'String',
    'colour': 120,
    'extensions': ['text_quotes'],
  };

  Blockly.Blocks['character'] = {
    init: function() {
      this.jsonInit(charConfig);
      this.setTooltip(function() {
        return 'Add a character.';
      });
    },
  };
}
export default characterBlocks;
