/**
 * string块的代码生成器
 * @date 2022-08-23
 * @param {*} Blockly
 */
function stringGenerate(Blockly) {
  Blockly.Python['string'] = function(block) {
    // Text value
    let code = Blockly.Python.quote_(block.getFieldValue('TEXT'));
    code = code.replace('\n', 'n');
    return [code, Blockly.Python.ORDER_ATOMIC];
  };

  Blockly.Python['multiline_string'] = function(block) {
    // Text value
    const code = Blockly.Python.multiline_quote_(block.getFieldValue('TEXT'));
    return [code, Blockly.Python.ORDER_ATOMIC];
  };

  Blockly.Python['doc_string'] = function(block) {
    // Text value.
    let code = block.getFieldValue('TEXT');
    if (code.charAt(0) !== '\n') {
      code = '\n' + code;
    }
    if (code.charAt(code.length-1) !== '\n') {
      code = code + '\n';
    }
    return Blockly.Python.multiline_quote_(code)+'\n';
  };
}
export default stringGenerate;
