// 全局变量
import {initBlockly, initTextEditor,
  getDependence, getBlockly, getTextEditor} from './dependence';
import globalConst from './globalConst';

// generate
// import annotationAssignGenerate from './CodeGenerators/annotation_assign';
import attributeGenerate from './CodeGenerators/attributeGenerate';
// import augAssignGenerate from './CodeGenerators/augAssign';
import binOpGenerate from './CodeGenerators/binOpGenerate';
import boolOpGenerate from './CodeGenerators/boolOpGenerate';
import callGenerate from './CodeGenerators/callGenerate';
import characterGenerate from './CodeGenerators/characterGenerate';
import classdefGenerate from './CodeGenerators/classdefGenerate';
import commentGenerate from './CodeGenerators/commentGenerate';
import compareGenerate from './CodeGenerators/compareGenerate';
import comprehensionGenerate from './CodeGenerators/comprehensionGenerate';
import controlsGenerate from './CodeGenerators/controlsGenerate';
import expressionGenerate from './CodeGenerators/expressionGenerate';
import functionGenerate from './CodeGenerators/functionGenerate';
import importGenerate from './CodeGenerators/importGenerate';
import iteratorGenerate from './CodeGenerators/iteratorGenerate';
import keywordGenerate from './CodeGenerators/keywordGenerate';
import lambdaGenerate from './CodeGenerators/lambdaGenerate';
import nameGenerate from './CodeGenerators/nameGenerate';
// import numberGenerate from './CodeGenerators/number';
import rawBlockGenerate from './CodeGenerators/rawBlockGenerate';
import returnGenerate from './CodeGenerators/returnGenerate';
import sliceGenerate from './CodeGenerators/sliceGenerate';
import subscriptGenerate from './CodeGenerators/subscriptGenerate';
// import typeAssginGenerate from './CodeGenerators/type_assgin';
// import typeStringGenerate from './CodeGenerators/type_string';
import unaryOpNotGenerate from './CodeGenerators/unaryOpNotGenerate';

// blocks
// import annotationAssignBlocks from './CustomBlocks/annotation_assign';
import attributeBlocks from './CustomBlocks/attributeBlocks';
// import augAssignBlocks from './CustomBlocks/augAssign';
import binOpBlocks from './CustomBlocks/binOpBlocks';
import boolOpBlocks from './CustomBlocks/boolOpBlocks';
import callBlocks from './CustomBlocks/callBlocks';
import characterBlocks from './CustomBlocks/characterBlocks';
import classdefBlocks from './CustomBlocks/classdefBlocks';
import commentBlocks from './CustomBlocks/commentBlocks';
import compareBlocks from './CustomBlocks/compareBlocks';
import comprehensionBlocks from './CustomBlocks/comprehensionBlocks';
import controlsBlocks from './CustomBlocks/controlsBlocks';
import expressionBlocks from './CustomBlocks/expressionBlocks';
import functionBlocks from './CustomBlocks/functionBlocks';
import importBlocks from './CustomBlocks/importBlocks';
import iteratorBlocks from './CustomBlocks/iteratorBlocks';
import keywordBlocks from './CustomBlocks/keywordBlocks';
import lambdaBlocks from './CustomBlocks/lambdaBlocks';
import nameBlocks from './CustomBlocks/nameBlocks';
// import numberBlocks from './CustomBlocks/number';
import rawBlockBlocks from './CustomBlocks/rawBlockBlocks';
import returnBlocks from './CustomBlocks/returnBlocks';
import sliceBlocks from './CustomBlocks/sliceBlocks';
import subscriptBlocks from './CustomBlocks/subscriptBlocks';
// import typeAssginBlocks from './CustomBlocks/type_assign';
// import typeStringBlocks from './CustomBlocks/type_string';
import unaryOpNotBlocks from './CustomBlocks/unaryOPNotBlocks';
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

