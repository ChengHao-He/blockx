/* eslint-disable max-len */
import Blockly from './all';
const workspace = new Blockly.Workspace();
const generator = Blockly.Python;
generator.init(workspace);

const assignBlock = workspace.newBlock('assign');
assignBlock.targetCount_ = 2;
test('assign函数的测试', () => {
  expect(generator.blockToCode(assignBlock))
      .not.toEqual('_ZC_y_25_b_p__5Bmg______5D = __', 2.1);
});

const assignelseBlock = workspace.newBlock('assign');
test('assign函数的测试', () => {
  expect(generator.blockToCode(assignelseBlock))
      .not.toEqual('_ZC_y_25_b_p__5Bmg______5D = __', 2.1);
});

const annotationAssignFullBlock = workspace.newBlock('annotation_assign_full');
test('annotation_assign_full函数的测试', () => {
  expect(generator.blockToCode(annotationAssignFullBlock))
      .toEqual('__: __ = \n', 2.1);
});

const annotationAssignBlock = workspace.newBlock('annotation_assign');
annotationAssignBlock.strAnnotations_ = true;
test('annotation_assign函数的测试', () => {
  expect(generator.blockToCode(annotationAssignBlock))
      .not.toEqual('my_4z7FI1y__Sa__l95____: int =', 2.1);
});

const augAssignBlock = workspace.newBlock('aug_assign');
augAssignBlock.simpleTarget_ = false;
test('aug_assign函数的测试', () => {
  expect(generator.blockToCode(augAssignBlock))
      .not.toEqual('"_u_5E_3OV7Zf_7_fx2_s_7C_5E += __', 2.1);
});

const augAssignElseBlock = workspace.newBlock('aug_assign');
test('aug_assign函数的测试', () => {
  expect(generator.blockToCode(augAssignElseBlock))
      .not.toEqual('"_u_5E_3OV7Zf_7_fx2_s_7C_5E += __', 2.1);
});

const attributeBlock = workspace.newBlock('attribute');
test('attribute函数的测试', () => {
  expect(generator.blockToCode(attributeBlock))
      .not.toEqual('"_60C7__N_7Bfcngvn9__5B_7B_y_.attribute', 2.1);
});

const attributeFullBlock = workspace.newBlock('attribute_full');
test('attributeFull函数的测试', () => {
  expect(generator.blockToCode(attributeFullBlock))
      .toEqual(['__.default', 2.1]);
});

const binOpBlock = workspace.newBlock('BinOp');
test('BinOp函数的测试', () => {
  expect(generator.blockToCode(binOpBlock))
      .toEqual(['__ + __', 6]);
});

const boolOpBlock = workspace.newBlock('BoolOp');
boolOpBlock.setFieldValue('And', 'OP');
test('boolOp函数的测试', () => {
  expect(generator.blockToCode(boolOpBlock))
      .toEqual(['__ and __', 13]);
});


const callBlock = workspace.newBlock('Call');
callBlock.arguments_ = 'arguments';
test('call函数的测试', () => {
  expect(generator.blockToCode(callBlock)).toEqual( ['null(__, __, __, __, __, __, __, __, __)', 2.2]);
});

const call2Block = workspace.newBlock('Call');
call2Block.module_ = 1;
test('call函数的测试', () => {
  expect(generator.blockToCode(call2Block)).toEqual( ['null(__, __, __, __, __, __, __, __, __)', 2.2]);
});

const call3Block = workspace.newBlock('Call');
call3Block.isMethod_ = 1;
test('call函数的测试', () => {
  expect(generator.blockToCode(call3Block)).toEqual( ['__null()', 2.2]);
});

const characterBlock = workspace.newBlock('character');
test('characterNewLine函数的测试', () => {
  expect(generator.blockToCode(characterBlock))
      .toEqual(['\'\\n\'', 0]);
});

const characterTabBlock = workspace.newBlock('character');
characterTabBlock.setFieldValue('tab', 'TEXT');
test('characterTab函数的测试', () => {
  expect(generator.blockToCode(characterTabBlock))
      .toEqual(['\'\\t\'', 0]);
});

const charactersingleQuoteBlock = workspace.newBlock('character');
charactersingleQuoteBlock.setFieldValue('single_quote', 'TEXT');
test('characterSingleQuote函数的测试', () => {
  expect(generator.blockToCode(charactersingleQuoteBlock))
      .toEqual(['\'', 0]);
});

const characterBackslashBlock = workspace.newBlock('character');
characterBackslashBlock.setFieldValue('backslash', 'TEXT');
test('characterBackslash函数的测试', () => {
  expect(generator.blockToCode(characterBackslashBlock))
      .toEqual(['\'\\\'', 0]);
});

const carriageReturnBlock = workspace.newBlock('character');
carriageReturnBlock.setFieldValue('carriage_return', 'TEXT');
test('characterCarriageReturn函数的测试', () => {
  expect(generator.blockToCode(carriageReturnBlock))
      .toEqual(['\'\\r\'', 0]);
});

const backspaceBlock = workspace.newBlock('character');
backspaceBlock.setFieldValue('backspace', 'TEXT');
test('characterBackspace函数的测试', () => {
  expect(generator.blockToCode(backspaceBlock))
      .toEqual(['\'\\b\'', 0]);
});

const formFeedBlock = workspace.newBlock('character');
formFeedBlock.setFieldValue('form_feed', 'TEXT');
test('characterFormFeed函数的测试', () => {
  expect(generator.blockToCode(formFeedBlock))
      .toEqual(['\'\\f\'', 0]);
});

const octalValueBlock = workspace.newBlock('character');
octalValueBlock.setFieldValue('octal_value', 'TEXT');
test('characterOctalValue函数的测试', () => {
  expect(generator.blockToCode(octalValueBlock))
      .toEqual(['\'\\ooo\'', 0]);
});

const hexvalueBlock = workspace.newBlock('character');
hexvalueBlock.setFieldValue('hex_value', 'TEXT');
test('characterHexValue函数的测试', () => {
  expect(generator.blockToCode(hexvalueBlock))
      .toEqual(['\'\\xhh\'', 0]);
});

const classdefBlock = workspace.newBlock('class_def');
classdefBlock.decorators_ = 1;
classdefBlock.keywords_ = 1;
classdefBlock.bases_ = 1;
test('classdef函数的测试', () => {
  expect(generator.blockToCode(classdefBlock))
      .not.toEqual('class I__7DJbiRmHAfcUr_60kh_Mf:  pass');
});

const ellipsisBlock = workspace.newBlock('ellipsis');
test('ellipsis函数的测试', () => {
  expect(generator.blockToCode(ellipsisBlock))
      .not.toEqual('class I__7DJbiRmHAfcUr_60kh_Mf:  pass');
});


const commentBlock = workspace.newBlock('Comment');
test('comment函数的测试', () => {
  expect(generator.blockToCode(commentBlock)).toBe('# 内容\n');
});

const compareBlock = workspace.newBlock('Compare');
test('compare函数的测试', () => {
  expect(generator.blockToCode(compareBlock))
      .toEqual(['__ == __', 11]);
});

const forBlock = workspace.newBlock('for');
test('for函数的测试', () => {
  expect(generator.blockToCode(forBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const forElseBlock = workspace.newBlock('for_else');
test('forElse函数的测试', () => {
  expect(generator.blockToCode(forElseBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const whileBlock = workspace.newBlock('while');
whileBlock.setFieldValue('UNTIL', 'MODE');
test('while函数的测试', () => {
  expect(generator.blockToCode(whileBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const ifBlock = workspace.newBlock('if');
ifBlock.elifs_ = 1;
ifBlock.orelse_ = 1;

test('if函数的测试', () => {
  expect(generator.blockToCode(ifBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const breakBlock = workspace.newBlock('break');
test('break函数的测试', () => {
  expect(generator.blockToCode(breakBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const continueBlock = workspace.newBlock('continue');
test('continue函数的测试', () => {
  expect(generator.blockToCode(continueBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const assertBlock = workspace.newBlock('assert');
test('assert函数的测试', () => {
  expect(generator.blockToCode(assertBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const assertFullBlock = workspace.newBlock('assert_full');
test('assertFull函数的测试', () => {
  expect(generator.blockToCode(assertFullBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const withItemBlock = workspace.newBlock('with_item');
test('withItem函数的测试', () => {
  expect(generator.blockToCode(withItemBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const withItemAsBlock = workspace.newBlock('with_item_as');
test('withItemAs函数的测试', () => {
  expect(generator.blockToCode(withItemAsBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const withBlock = workspace.newBlock('with');
test('with函数的测试', () => {
  expect(generator.blockToCode(withBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const tryBlock = workspace.newBlock('try');
tryBlock.handlersCount_ = 1;
test('try函数的测试', () => {
  expect(generator.blockToCode(tryBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const raiseBlock = workspace.newBlock('raise');
raiseBlock.cause_ = 1;
test('raise函数的测试', () => {
  expect(generator.blockToCode(raiseBlock))
      .not.toEqual('for undefined in undefined:\npass');
});

const expressionBlock = workspace.newBlock('expression');
test('expression函数的测试', () => {
  expect(generator.blockToCode(expressionBlock))
      .toEqual('__');
});

const expressionIfBlock = workspace.newBlock('if_expr');
test('expressionIf函数的测试', () => {
  expect(generator.blockToCode(expressionIfBlock))
      .toEqual(['__ if __ else __\n', 15]);
});

const functionBlock = workspace.newBlock('FunctionDef');
functionBlock.decoratorsCount_ = 1;
functionBlock.parametersCount_ = 1;
functionBlock.hasReturn_ = 1;
functionBlock.updateShape_();
test('function函数的测试', () => {
  expect(generator.blockToCode(functionBlock))
      .not.toEqual('def function():\n  pass');
});

const functionParameterBlock = workspace.newBlock('FunctionParameter');
test('FunctionParameter函数的测试', () => {
  expect(generator.blockToCode(functionParameterBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterTypeBlock = workspace.newBlock('FunctionParameterType');
test('FunctionParameterType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterTypeBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterDefaultBlock = workspace
    .newBlock('FunctionParameterDefault');
test('FunctionParameterDefault函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterDefaultBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterDefaultTypeBlock = workspace
    .newBlock('FunctionParameterDefaultType');
test('FunctionParameterDefaultType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterDefaultTypeBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterVarargBlock = workspace
    .newBlock('FunctionParameterVararg');
test('FunctionParameterVararg函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterVarargBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterVarargTypeBlock = workspace
    .newBlock('FunctionParameterVarargType');
test('FunctionParameterVarargType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterVarargTypeBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterKwargBlock = workspace
    .newBlock('FunctionParameterKwarg');
test('FunctionParameterKwarg函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterKwargBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterKwargTypeBlock = workspace
    .newBlock('FunctionParameterKwargType');
test('FunctionParameterKwargType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterKwargTypeBlock))
      .not.toEqual('def function():\n  pass');
});

const FunctionHeaderMutatorBlock = workspace
    .newBlock('FunctionHeaderMutator');
test('FunctionHeaderMutator函数的测试', () => {
  expect(generator.blockToCode(FunctionHeaderMutatorBlock))
      .not.toEqual('def function():\n  pass');
});

const importBlock = workspace.newBlock('import');
importBlock.from_ = 1;
test('import函数的测试', () => {
  expect(generator.blockToCode(importBlock))
      .toEqual('from null import default\n');
});

const importregularsBlock = workspace.newBlock('import');
importregularsBlock.regulars_ = 0;
test('importregulars函数的测试', () => {
  expect(generator.blockToCode(importregularsBlock))
      .toEqual('from null import default\n');
});

const dictsBlock = workspace.newBlock('dicts_create_with');
test('dicts函数的测试', () => {
  expect(generator.blockToCode(dictsBlock))
      .toEqual(['{__: __, __: __, __: __}', 1]);
});


const setsBlock = workspace.newBlock('sets_create_with');
test('sets函数的测试', () => {
  expect(generator.blockToCode(setsBlock))
      .toEqual(['{__, __, __}', 1]);
});

const tuplesBlock = workspace.newBlock('tuples_create_with');
test('tuples函数的测试', () => {
  expect(generator.blockToCode(tuplesBlock))
      .toEqual(['(__, __, __)', 1]);
});

const listBlock = workspace.newBlock('lists_create_with');
test('list函数的测试', () => {
  expect(generator.blockToCode(listBlock))
      .toEqual(['[None, None, None]', 0]);
});

const deleteBlock = workspace.newBlock('delete');
test('delete函数的测试', () => {
  expect(generator.blockToCode(deleteBlock))
      .toEqual('del __\n');
});

const globalBlock = workspace.newBlock('global');
test('global函数的测试', () => {
  expect(generator.blockToCode(globalBlock))
      .not.toEqual(['global _y_HUonY_60_IQUoOef__7B3']);
});

const starredBlock = workspace.newBlock('starred');
test('starred函数的测试', () => {
  expect(generator.blockToCode(starredBlock))
      .toEqual(['*__', 99]);
});

const nonlocalBlock = workspace.newBlock('nonlocal');
test('nolocal函数的测试', () => {
  expect(generator.blockToCode(nonlocalBlock))
      .not.toEqual(['nonlocal APkbbyE_tr_jc_CjXmqG']);
});

const yieldBlock = workspace.newBlock('yield');
test('yield函数的测试', () => {
  expect(generator.blockToCode(yieldBlock))
      .toEqual(['yield', 16]);
});

const yieldFullBlock = workspace.newBlock('yield_full');
test('yleldFull函数的测试', () => {
  expect(generator.blockToCode(yieldFullBlock))
      .toEqual(['yield __', 16]);
});

const yieldFromBlock = workspace.newBlock('yield_from');
test('yieldFrom函数的测试', () => {
  expect(generator.blockToCode(yieldFromBlock))
      .toEqual(['yield from __', 16]);
});

const lambdaBlock = workspace.newBlock('lambda');
lambdaBlock.parametersCount_ = 1;
test('lambda函数的测试', () => {
  expect(generator.blockToCode(lambdaBlock))
      .toEqual(['lambda __:   pass\n', 16]);
});

const nameBlock = workspace.newBlock('name');
test('name函数的测试', () => {
  expect(generator.blockToCode(nameBlock))
      .not.toEqual(['code/n', 0]);
});

const rawBlock = workspace.newBlock('raw_block');
test('raw函数的测试', () => {
  expect(generator.blockToCode(rawBlock))
      .toEqual('\n');
});


const returnBlock = workspace.newBlock('return');
test('return函数的测试', () => {
  expect(generator.blockToCode(returnBlock)).toEqual('return\n');
});

const returnFullBlock = workspace.newBlock('return_full');
test('returnFull函数的测试', () => {
  expect(generator.blockToCode(returnFullBlock)).toEqual('return __\n');
});

const stringBlock = workspace.newBlock('string');
test('string函数的测试', () => {
  expect(generator.blockToCode(stringBlock)).toEqual(["''", 0]);
});

const multilineStringBlock = workspace.newBlock('multiline_string');
test('multiline_string函数的测试', () => {
  expect(generator.blockToCode(multilineStringBlock)).toEqual(["''", 0]);
});

const docStringBlock = workspace.newBlock('doc_string');
test('doc_string函数的测试', () => {
  expect(generator.blockToCode(docStringBlock)).not.toEqual(['' + '\\n']);
});

const docStringElseBlock = workspace.newBlock('doc_string');
docStringElseBlock.setFieldValue('123', 'TEXT');
test('doc_string函数的测试', () => {
  expect(generator.blockToCode(docStringElseBlock)).not.toEqual(['' + '\\n']);
});

const subscriptBlock = workspace.newBlock('Subscript');
test('subscript函数的测试', () => {
  expect(generator.blockToCode(subscriptBlock))
      .toEqual(['__[__]', 2.1]);
});

const subscriptA11Block = workspace.newBlock('Subscript');
subscriptA11Block.sliceKinds_[0] = 'A11';
test('subscriptA11函数的测试', () => {
  expect(generator.blockToCode(subscriptA11Block))
      .toEqual(['__[__:__]', 2.1]);
});

const subscriptA001Block = workspace.newBlock('Subscript');
subscriptA001Block.sliceKinds_[0] = 'A001';
test('subscriptA001函数的测试', () => {
  expect(generator.blockToCode(subscriptA001Block))
      .toEqual(['__[::__]', 2.1]);
});

const comprehensionIf = workspace.newBlock('comprehension_if');
const listCompBlock = workspace.newBlock('list_comp');
test('listComp函数的测试', () => {
  expect(generator.blockToCode(listCompBlock))
      .toEqual(['[__ __ for __ in__ __ for __ in__ __ for __ in__]', 0]);
});

const setCompBlock = workspace.newBlock('set_comp');
setCompBlock.child = comprehensionIf;
test('setComp函数的测试', () => {
  expect(generator.blockToCode(setCompBlock))
      .toEqual(['{__ __ for __ in__ __ for __ in__ __ for __ in__}', 0]);
});

const dictCompBlock = workspace.newBlock('dict_comp');
test('dictComp函数的测试', () => {
  expect(generator.blockToCode(dictCompBlock))
      .toEqual(['{__: __ __: __ for __ in__ __: __ for __ in__ __: __ for __ in__}', 0]);
});

workspace.newBlock('iterators_create_with_container');
const generatorExprBlock = workspace.newBlock('generator_expr');
test('generatorExpr函数的测试', () => {
  expect(generator.blockToCode(generatorExprBlock))
      .toEqual(['(__ __ for __ in__ __ for __ in__ __ for __ in__)', 0]);
});

workspace.newBlock('tuples_getSubtuple');
workspace.newBlock('text_getSubstring');
workspace.newBlock('lists_getSublist');
workspace.newBlock('tuples_getSubtuple');
workspace.newBlock('iterators_create_with_item');

const UnaryOpBlock = workspace.newBlock('UnaryOpUAdd');
test('UnaryOp函数的测试', () => {
  expect(generator.blockToCode(UnaryOpBlock))
      .toEqual(['+__', 4]);
});
