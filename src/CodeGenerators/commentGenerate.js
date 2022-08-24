/**
 * comment块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function commentGenerate(Blockly) {
  Blockly.Python['Comment'] = function(block) {
    const textBody = block.getFieldValue('BODY');
    return '# ' + textBody + '\n';
  };
}
export default commentGenerate;
