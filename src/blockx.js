// 全局变量
import {initBlockly, initTextEditor,
  getDependence, getBlockly, getTextEditor} from './dependence';
import globalConst from './globalConst';

// generate
import binOpGenerate from './CodeGenerators/binOp';

// blocks
import binOpBlocks from './CustomBlocks/binOp';
/**
 * 描述: Blockx初始化函数
 * @date 2022-08-22
 * @param {any} blockxId
 */
function Blockx(blockxId) {
  getDependence().blockxId = blockxId;
};

Blockx.initBlockly = function(blockly) {
  if (initBlockly(blockly)) {
    globalConst(getBlockly());
    // binOp
    binOpBlocks(getBlockly());
    binOpGenerate(getBlockly());
    return getBlockly();
  } else {
    throw new Error('Blockly is null.');
  }
};

Blockx.initTextEditor = function(textEditor) {
  if (initTextEditor(textEditor)) {
    // test
    getTextEditor();
    return true;
  } else {
    throw new Error('textEditor is null.');
  }
};

export default Blockx;

