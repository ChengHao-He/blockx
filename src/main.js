// 全局变量
import {dependence, initBlockly, initTextEditor} from './dependence';
/**
 * 描述: Blockx初始化函数
 * @date 2022-08-22
 * @param {any} blockxId
 */
function Blockx(blockxId) {
  dependence.blockxId = blockxId;
};

Blockx.initBlockly = function(blockly) {
  if (initBlockly(blockly)) {
    return true;
  } else {
    throw new Error('Blockly is null.');
  }
};

Blockx.initTextEditor = function(textEditor) {
  if (initTextEditor(textEditor)) {
    return true;
  } else {
    throw new Error('textEditor is null.');
  }
};

export default Blockx;

