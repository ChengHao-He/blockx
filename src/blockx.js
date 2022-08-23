// 全局变量
import {initBlockly, initTextEditor,
  getDependence, getBlockly, getTextEditor} from './dependence';
import globalConst from './globalConst';

// generate
// import annotationAssignGenerate from './CodeGenerators/annotation_assign';
import attributeGenerate from './CodeGenerators/attribute';
// import augAssignGenerate from './CodeGenerators/augAssign';
import binOpGenerate from './CodeGenerators/binOp';
import boolOpGenerate from './CodeGenerators/boolOp';
import callGenerate from './CodeGenerators/call';
import characterGenerate from './CodeGenerators/character';
import classdefGenerate from './CodeGenerators/classdef';
import commentGenerate from './CodeGenerators/comment';
import compareGenerate from './CodeGenerators/compare';
import comprehensionGenerate from './CodeGenerators/comprehension';
import controlsGenerate from './CodeGenerators/controls';
import expressionGenerate from './CodeGenerators/expression';
import functionGenerate from './CodeGenerators/function';
import importGenerate from './CodeGenerators/import';
import iteratorGenerate from './CodeGenerators/iterator';
import keywordGenerate from './CodeGenerators/keyword';
import lambdaGenerate from './CodeGenerators/lambda';
import nameGenerate from './CodeGenerators/name';
// import numberGenerate from './CodeGenerators/number';
import rawBlockGenerate from './CodeGenerators/raw_block';
import returnGenerate from './CodeGenerators/return';
import sliceGenerate from './CodeGenerators/slice';
import subscriptGenerate from './CodeGenerators/subscript';
// import typeAssginGenerate from './CodeGenerators/type_assgin';
// import typeStringGenerate from './CodeGenerators/type_string';
import unaryOpNotGenerate from './CodeGenerators/unaryOpNot';

// blocks
// import annotationAssignBlocks from './CustomBlocks/annotation_assign';
import attributeBlocks from './CustomBlocks/attribute';
// import augAssignBlocks from './CustomBlocks/augAssign';
import binOpBlocks from './CustomBlocks/binOp';
import boolOpBlocks from './CustomBlocks/boolOp';
import callBlocks from './CustomBlocks/call';
import characterBlocks from './CustomBlocks/character';
import classdefBlocks from './CustomBlocks/classdef';
import commentBlocks from './CustomBlocks/comment';
import compareBlocks from './CustomBlocks/compare';
import comprehensionBlocks from './CustomBlocks/comprehension';
import controlsBlocks from './CustomBlocks/controls';
import expressionBlocks from './CustomBlocks/expression';
import functionBlocks from './CustomBlocks/function';
import importBlocks from './CustomBlocks/import';
import iteratorBlocks from './CustomBlocks/iterator';
import keywordBlocks from './CustomBlocks/keyword';
import lambdaBlocks from './CustomBlocks/lambda';
import nameBlocks from './CustomBlocks/name';
// import numberBlocks from './CustomBlocks/number';
import rawBlockBlocks from './CustomBlocks/raw_block';
import returnBlocks from './CustomBlocks/return';
import sliceBlocks from './CustomBlocks/slice';
import subscriptBlocks from './CustomBlocks/subscript';
// import typeAssginBlocks from './CustomBlocks/type_assign';
// import typeStringBlocks from './CustomBlocks/type_string';
import unaryOpNotBlocks from './CustomBlocks/unaryOpNot';
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
    // annotationAssign
    // annotationAssignBlocks(getBlockly());
    // annotationAssignGenerate(getBlockly());
    // attribute
    attributeBlocks(getBlockly());
    attributeGenerate(getBlockly());
    // augAssign
    // augAssignBlocks(getBlockly());
    // augAssignGenerate(getBlockly());
    // binOp
    binOpBlocks(getBlockly());
    binOpGenerate(getBlockly());
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
    // comprehension
    comprehensionBlocks(getBlockly());
    comprehensionGenerate(getBlockly());
    // control
    controlsBlocks(getBlockly());
    controlsGenerate(getBlockly());
    // expression
    expressionBlocks(getBlockly());
    expressionGenerate(getBlockly());
    // function
    functionBlocks(getBlockly());
    functionGenerate(getBlockly());
    // import
    importBlocks(getBlockly());
    importGenerate(getBlockly());
    // iterator
    iteratorBlocks(getBlockly());
    iteratorGenerate(getBlockly());
    // keyword
    keywordBlocks(getBlockly());
    keywordGenerate(getBlockly());
    // lambda
    lambdaBlocks(getBlockly());
    lambdaGenerate(getBlockly());
    // name
    nameBlocks(getBlockly());
    nameGenerate(getBlockly());
    // number
    // numberBlocks(getBlockly());
    // numberGenerate(getBlockly());
    // rawBlock
    rawBlockBlocks(getBlockly());
    rawBlockGenerate(getBlockly());
    // return
    returnBlocks(getBlockly());
    returnGenerate(getBlockly());
    // slice
    sliceBlocks(getBlockly());
    sliceGenerate(getBlockly());
    // subscript
    subscriptBlocks(getBlockly());
    subscriptGenerate(getBlockly());
    // typeAssgin
    // typeAssginBlockBlocks(getBlockly());
    // typeAssginBlockGenerate(getBlockly());
    // typeString
    // typeStringBlockBlocks(getBlockly());
    // typeStringBlockGenerate(getBlockly());
    // unaryOpNot
    unaryOpNotBlocks(getBlockly());
    unaryOpNotGenerate(getBlockly());
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

