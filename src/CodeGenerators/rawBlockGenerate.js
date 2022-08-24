/**
 * raw_block块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function rawBlockGenerate(Blockly) {
  Blockly.Python['raw_block'] = function(block) {
    return block.getFieldValue('TEXT') + '\n';
  };
}
export default rawBlockGenerate;
