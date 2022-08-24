/**
 * character块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function characterGenerate(Blockly) {
  Blockly.Python['character'] = function(block) {
  // Text value
    const value = block.getFieldValue('TEXT');
    switch (value) {
      case 'new_line': return ['\'\\n\'', Blockly.Python.ORDER_ATOMIC];
      case 'tab': return ['\'\\t\'', Blockly.Python.ORDER_ATOMIC];
      case 'single_quote': return ['\'', Blockly.Python.ORDER_ATOMIC];
      case 'backslash': return ['\'\\\'', Blockly.Python.ORDER_ATOMIC];
      case 'carriage_return': return ['\'\\r\'', Blockly.Python.ORDER_ATOMIC];
      case 'backspace': return ['\'\\b\'', Blockly.Python.ORDER_ATOMIC];
      case 'form_feed': return ['\'\\f\'', Blockly.Python.ORDER_ATOMIC];
      case 'octal_value': return ['\'\\ooo\'', Blockly.Python.ORDER_ATOMIC];
      case 'hex_value': return ['\'\\xhh\'', Blockly.Python.ORDER_ATOMIC];
    }
  };
}
export default characterGenerate;
