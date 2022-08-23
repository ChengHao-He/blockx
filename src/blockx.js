// 全局变量
import {initBlockly, initTextEditor,
  getDependence, getBlockly, getTextEditor} from './dependence';
import globalConst from './globalConst';

// generate
import binOpGenerate from './CodeGenerators/binOp';
import returnGenerate from './CodeGenerators/return';
import attributeGenerate from './CodeGenerators/attribute';
import boolOpGenerate from './CodeGenerators/boolOp';
import callGenerate from './CodeGenerators/call';
import characterGenerate from './CodeGenerators/character';
import classdefGenerate from './CodeGenerators/classdef';
import commentGenerate from './CodeGenerators/comment';
import compareGenerate from './CodeGenerators/compare';

// import comprehensionGenerate from './CodeGenerators/comprehension';
// import controlGenerate from './CodeGenerators/control';
// import expressionGenerate from './CodeGenerators/expression';
// import functionGenerate from './CodeGenerators/function';
// import importGenerate from './CodeGenerators/import';
// import iteratorGenerate from './CodeGenerators/iterator';
// import keywordGenerate from './CodeGenerators/keyword';
// import lambdaGenerate from './CodeGenerators/lambda';
// import nameGenerate from './CodeGenerators/name';

// blocks
import binOpBlocks from './CustomBlocks/binOp';
import returnBlocks from './CustomBlocks/return';
import attributeBlocks from './CustomBlocks/attribute';
import boolOpBlocks from './CustomBlocks/boolOp';
import callBlocks from './CustomBlocks/call';
import characterBlocks from './CustomBlocks/character';
import classdefBlocks from './CustomBlocks/classdef';
import commentBlocks from './CustomBlocks/comment';
import compareBlocks from './CustomBlocks/compare';

// import comprehensionBlocks from './CustomBlocks/comprehension';
// import controlBlocks from './CustomBlocks/control';
// import expressionBlocks from './CustomBlocks/expression';
// import functionBlocks from './CustomBlocks/function';
// import importBlocks from './CustomBlocks/import';
// import iteratorBlocks from './CustomBlocks/iterator';
// import keywordBlocks from './CustomBlocks/keyword';
// import lambdaBlocks from './CustomBlocks/lambda';
// import nameBlocks from './CustomBlocks/name';
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
    // return
    returnBlocks(getBlockly());
    returnGenerate(getBlockly());
    // attribute
    attributeBlocks(getBlockly());
    attributeGenerate(getBlockly());
    // boolOp
    boolOpBlocks(getBlockly());
    boolOpGenerate(getBlockly());
    // call
    callBlocks(getBlockly());
    callGenerate(getBlockly());
    // character
    characterBlocks(getBlockly());
    characterGenerate(getBlockly());
    // classdef
    classdefBlocks(getBlockly());
    classdefGenerate(getBlockly());
    // comment
    commentBlocks(getBlockly());
    commentGenerate(getBlockly());
    // compare
    compareBlocks(getBlockly());
    compareGenerate(getBlockly());

    // // comprehension
    // comprehensionBlocks(getBlockly());
    // comprehensionGenerate(getBlockly());
    // // control
    // controlBlocks(getBlockly());
    // controlGenerate(getBlockly());
    // // expression
    // expressionBlocks(getBlockly());
    // expressionGenerate(getBlockly());
    // // function
    // functionBlocks(getBlockly());
    // functionGenerate(getBlockly());
    // // import
    // importBlocks(getBlockly());
    // importGenerate(getBlockly());
    // // iterator
    // iteratorBlocks(getBlockly());
    // iteratorGenerate(getBlockly());
    // // keyword
    // keywordBlocks(getBlockly());
    // keywordGenerate(getBlockly());
    // // lambda
    // lambdaBlocks(getBlockly());
    // lambdaGenerate(getBlockly());
    // // name
    // nameBlocks(getBlockly());
    // nameGenerate(getBlockly());
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

