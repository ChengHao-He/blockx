/* eslint-disable max-len */
import sliceGenerate from '../CodeGenerators/slice';
import Blockly from './all';
const workspace = new Blockly.Workspace();
const generator = Blockly.Python;
generator.init(workspace);

const attributeblock = workspace.newBlock('attribute');
test('attribute函数的测试', () => {
  expect(generator.blockToCode(attributeblock))
      .not.toEqual('"_60C7__N_7Bfcngvn9__5B_7B_y_.attribute', 2.1);
});

const attributeFullblock = workspace.newBlock('attribute_full');
test('attributeFull函数的测试', () => {
  expect(generator.blockToCode(attributeFullblock))
      .toEqual(['__.default', 2.1]);
});

const binOpblock = workspace.newBlock('BinOp');
test('BinOp函数的测试', () => {
  expect(generator.blockToCode(binOpblock))
      .toEqual(['__ + __', 6]);
});

const boolOpblock = workspace.newBlock('BoolOp');
boolOpblock.setFieldValue('And', 'OP');
test('boolOp函数的测试', () => {
  expect(generator.blockToCode(boolOpblock))
      .toEqual(['__ and __', 13]);
});


const callblock = workspace.newBlock('Call');
callblock.arguments_ = 'arguments';
test('call函数的测试', () => {
  expect(generator.blockToCode(callblock)).toEqual( ['null(__, __, __, __, __, __, __, __, __)', 2.2]);
});

const call2block = workspace.newBlock('Call');
call2block.module_ = 1;
test('call函数的测试', () => {
  expect(generator.blockToCode(call2block)).toEqual( ['null(__, __, __, __, __, __, __, __, __)', 2.2]);
});

const call3block = workspace.newBlock('Call');
call3block.isMethod_ = 1;
test('call函数的测试', () => {
  expect(generator.blockToCode(call3block)).toEqual( ['__null()', 2.2]);
});

const characterblock = workspace.newBlock('character');
test('characterNewLine函数的测试', () => {
  expect(generator.blockToCode(characterblock))
      .toEqual(['\'\\n\'', 0]);
});

const characterTabblock = workspace.newBlock('character');
characterTabblock.setFieldValue('tab', 'TEXT');
test('characterTab函数的测试', () => {
  expect(generator.blockToCode(characterTabblock))
      .toEqual(['\'\\t\'', 0]);
});

const charactersingleQuoteblock = workspace.newBlock('character');
charactersingleQuoteblock.setFieldValue('single_quote', 'TEXT');
test('characterSingleQuote函数的测试', () => {
  expect(generator.blockToCode(charactersingleQuoteblock))
      .toEqual(['\'', 0]);
});

const characterBackslashblock = workspace.newBlock('character');
characterBackslashblock.setFieldValue('backslash', 'TEXT');
test('characterBackslash函数的测试', () => {
  expect(generator.blockToCode(characterBackslashblock))
      .toEqual(['\'\\\'', 0]);
});

const carriageReturnblock = workspace.newBlock('character');
carriageReturnblock.setFieldValue('carriage_return', 'TEXT');
test('characterCarriageReturn函数的测试', () => {
  expect(generator.blockToCode(carriageReturnblock))
      .toEqual(['\'\\r\'', 0]);
});

const backspaceblock = workspace.newBlock('character');
backspaceblock.setFieldValue('backspace', 'TEXT');
test('characterBackspace函数的测试', () => {
  expect(generator.blockToCode(backspaceblock))
      .toEqual(['\'\\b\'', 0]);
});

const formFeedblock = workspace.newBlock('character');
formFeedblock.setFieldValue('form_feed', 'TEXT');
test('characterFormFeed函数的测试', () => {
  expect(generator.blockToCode(formFeedblock))
      .toEqual(['\'\\f\'', 0]);
});

const octalValueblock = workspace.newBlock('character');
octalValueblock.setFieldValue('octal_value', 'TEXT');
test('characterOctalValue函数的测试', () => {
  expect(generator.blockToCode(octalValueblock))
      .toEqual(['\'\\ooo\'', 0]);
});

const hexvalueblock = workspace.newBlock('character');
hexvalueblock.setFieldValue('hex_value', 'TEXT');
test('characterHexValue函数的测试', () => {
  expect(generator.blockToCode(hexvalueblock))
      .toEqual(['\'\\xhh\'', 0]);
});

const classdefblock = workspace.newBlock('class_def');
classdefblock.decorators_ = 1;
classdefblock.keywords_ = 1;
classdefblock.bases_ = 1;
test('classdef函数的测试', () => {
  expect(generator.blockToCode(classdefblock))
      .not.toEqual('class I__7DJbiRmHAfcUr_60kh_Mf:  pass');
});

const ellipsisblock = workspace.newBlock('ellipsis');
test('ellipsis函数的测试', () => {
  expect(generator.blockToCode(ellipsisblock))
      .not.toEqual('class I__7DJbiRmHAfcUr_60kh_Mf:  pass');
});


const commentblock = workspace.newBlock('Comment');
test('comment函数的测试', () => {
  expect(generator.blockToCode(commentblock)).toBe('# will be ignored\n');
});

const compareblock = workspace.newBlock('Compare');
test('compare函数的测试', () => {
  expect(generator.blockToCode(compareblock))
      .toEqual(['__ == __', 11]);
});

const forblock = workspace.newBlock('for');
test('for函数的测试', () => {
  expect(generator.blockToCode(forblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const forElseblock = workspace.newBlock('for_else');
test('forElse函数的测试', () => {
  expect(generator.blockToCode(forElseblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const whileblock = workspace.newBlock('while');
whileblock.setFieldValue('UNTIL', 'MODE');
test('while函数的测试', () => {
  expect(generator.blockToCode(whileblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const ifblock = workspace.newBlock('if');
ifblock.elifs_ = 1;
ifblock.orelse_ = 1;

test('if函数的测试', () => {
  expect(generator.blockToCode(ifblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const breakblock = workspace.newBlock('break');
test('break函数的测试', () => {
  expect(generator.blockToCode(breakblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const continueblock = workspace.newBlock('continue');
test('continue函数的测试', () => {
  expect(generator.blockToCode(continueblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const assertblock = workspace.newBlock('assert');
test('assert函数的测试', () => {
  expect(generator.blockToCode(assertblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const assertFullblock = workspace.newBlock('assert_full');
test('assertFull函数的测试', () => {
  expect(generator.blockToCode(assertFullblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const withItemblock = workspace.newBlock('with_item');
test('withItem函数的测试', () => {
  expect(generator.blockToCode(withItemblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const withItemAsblock = workspace.newBlock('with_item_as');
test('withItemAs函数的测试', () => {
  expect(generator.blockToCode(withItemAsblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const withblock = workspace.newBlock('with');
test('with函数的测试', () => {
  expect(generator.blockToCode(withblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const tryblock = workspace.newBlock('try');
tryblock.handlersCount_ = 1;
test('try函数的测试', () => {
  expect(generator.blockToCode(tryblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const raiseblock = workspace.newBlock('raise');
raiseblock.cause_ = 1;
test('raise函数的测试', () => {
  expect(generator.blockToCode(raiseblock))
      .not.toEqual('for undefined in undefined:\npass');
});

const expressionblock = workspace.newBlock('expression');
test('expression函数的测试', () => {
  expect(generator.blockToCode(expressionblock))
      .toEqual('__');
});

const expressionIfblock = workspace.newBlock('if_expr');
test('expressionIf函数的测试', () => {
  expect(generator.blockToCode(expressionIfblock))
      .toEqual(['__ if __ else __\n', 15]);
});

const functionblock = workspace.newBlock('FunctionDef');
functionblock.decoratorsCount_ = 1;
functionblock.parametersCount_ = 1;
functionblock.hasReturn_ = 1;
functionblock.updateShape_();
test('function函数的测试', () => {
  expect(generator.blockToCode(functionblock))
      .not.toEqual('def function():\n  pass');
});

const functionParameterblock = workspace.newBlock('FunctionParameter');
test('FunctionParameter函数的测试', () => {
  expect(generator.blockToCode(functionParameterblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterTypeblock = workspace.newBlock('FunctionParameterType');
test('FunctionParameterType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterTypeblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterDefaultblock = workspace
    .newBlock('FunctionParameterDefault');
test('FunctionParameterDefault函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterDefaultblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterDefaultTypeblock = workspace
    .newBlock('FunctionParameterDefaultType');
test('FunctionParameterDefaultType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterDefaultTypeblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterVarargblock = workspace
    .newBlock('FunctionParameterVararg');
test('FunctionParameterVararg函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterVarargblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterVarargTypeblock = workspace
    .newBlock('FunctionParameterVarargType');
test('FunctionParameterVarargType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterVarargTypeblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterKwargblock = workspace
    .newBlock('FunctionParameterKwarg');
test('FunctionParameterKwarg函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterKwargblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionParameterKwargTypeblock = workspace
    .newBlock('FunctionParameterKwargType');
test('FunctionParameterKwargType函数的测试', () => {
  expect(generator.blockToCode(FunctionParameterKwargTypeblock))
      .not.toEqual('def function():\n  pass');
});

const FunctionHeaderMutatorblock = workspace
    .newBlock('FunctionHeaderMutator');
test('FunctionHeaderMutator函数的测试', () => {
  expect(generator.blockToCode(FunctionHeaderMutatorblock))
      .not.toEqual('def function():\n  pass');
});

const importblock = workspace.newBlock('import');
importblock.from_ = 1;
test('import函数的测试', () => {
  expect(generator.blockToCode(importblock))
      .toEqual('from null import default\n');
});

const importregularsblock = workspace.newBlock('import');
importregularsblock.regulars_ = 0;
test('importregulars函数的测试', () => {
  expect(generator.blockToCode(importregularsblock))
      .toEqual('from null import default\n');
});

const dictsblock = workspace.newBlock('dicts_create_with');
test('dicts函数的测试', () => {
  expect(generator.blockToCode(dictsblock))
      .toEqual(['{__: __, __: __, __: __}', 1]);
});


const setsblock = workspace.newBlock('sets_create_with');
test('sets函数的测试', () => {
  expect(generator.blockToCode(setsblock))
      .toEqual(['{__, __, __}', 1]);
});

const tuplesblock = workspace.newBlock('tuples_create_with');
test('tuples函数的测试', () => {
  expect(generator.blockToCode(tuplesblock))
      .toEqual(['(__, __, __)', 1]);
});

const listblock = workspace.newBlock('lists_create_with');
test('list函数的测试', () => {
  expect(generator.blockToCode(listblock))
      .toEqual(['[None, None, None]', 0]);
});

const deleteblock = workspace.newBlock('delete');
test('delete函数的测试', () => {
  expect(generator.blockToCode(deleteblock))
      .toEqual('del __\n');
});

const globalblock = workspace.newBlock('global');
test('global函数的测试', () => {
  expect(generator.blockToCode(globalblock))
      .not.toEqual(['global _y_HUonY_60_IQUoOef__7B3']);
});

const starredblock = workspace.newBlock('starred');
test('starred函数的测试', () => {
  expect(generator.blockToCode(starredblock))
      .toEqual(['*__', 99]);
});

const nonlocalblock = workspace.newBlock('nonlocal');
test('nolocal函数的测试', () => {
  expect(generator.blockToCode(nonlocalblock))
      .not.toEqual(['nonlocal APkbbyE_tr_jc_CjXmqG']);
});

const yieldblock = workspace.newBlock('yield');
test('yield函数的测试', () => {
  expect(generator.blockToCode(yieldblock))
      .toEqual(['yield', 16]);
});

const yieldFullblock = workspace.newBlock('yield_full');
test('yleldFull函数的测试', () => {
  expect(generator.blockToCode(yieldFullblock))
      .toEqual(['yield __', 16]);
});

const yieldFromblock = workspace.newBlock('yield_from');
test('yieldFrom函数的测试', () => {
  expect(generator.blockToCode(yieldFromblock))
      .toEqual(['yield from __', 16]);
});

const lambdablock = workspace.newBlock('lambda');
lambdablock.parametersCount_ = 1;
test('lambda函数的测试', () => {
  expect(generator.blockToCode(lambdablock))
      .toEqual(['lambda __:   pass\n', 16]);
});

const nameblock = workspace.newBlock('name');
test('name函数的测试', () => {
  expect(generator.blockToCode(nameblock))
      .not.toEqual(['code/n', 0]);
});

const rawblock = workspace.newBlock('raw_block');
test('raw函数的测试', () => {
  expect(generator.blockToCode(rawblock))
      .toEqual('\n');
});


const returnblock = workspace.newBlock('return');
test('return函数的测试', () => {
  expect(generator.blockToCode(returnblock)).toEqual('return\n');
});

const returnFullblock = workspace.newBlock('return_full');
test('returnFull函数的测试', () => {
  expect(generator.blockToCode(returnFullblock)).toEqual('return __\n');
});

const subscriptblock = workspace.newBlock('Subscript');
test('subscript函数的测试', () => {
  expect(generator.blockToCode(subscriptblock))
      .toEqual(['__[:]', 2.1]);
});

const subscriptA11block = workspace.newBlock('Subscript');
subscriptA11block.sliceKinds_[0] = 'A11';
test('subscriptA11函数的测试', () => {
  expect(generator.blockToCode(subscriptA11block))
      .toEqual(['__[:::]', 2.1]);
});

const subscriptA001block = workspace.newBlock('Subscript');
subscriptA001block.sliceKinds_[0] = 'A001';
test('subscriptA001函数的测试', () => {
  expect(generator.blockToCode(subscriptA001block))
      .toEqual(['__[::]', 2.1]);
});

const comprehensionIf = workspace.newBlock('comprehension_if');
const listCompblock = workspace.newBlock('list_comp');
test('listComp函数的测试', () => {
  expect(generator.blockToCode(listCompblock))
      .toEqual(['[__ __ for __ in__ __ for __ in__ __ for __ in__]', 0]);
});

const setCompblock = workspace.newBlock('set_comp');
setCompblock.child = comprehensionIf;
test('setComp函数的测试', () => {
  expect(generator.blockToCode(setCompblock))
      .toEqual(['{__ __ for __ in__ __ for __ in__ __ for __ in__}', 0]);
});

const dictCompblock = workspace.newBlock('dict_comp');
test('dictComp函数的测试', () => {
  expect(generator.blockToCode(dictCompblock))
      .toEqual(['{__: __ __: __ for __ in__ __: __ for __ in__ __: __ for __ in__}', 0]);
});

workspace.newBlock('iterators_create_with_container');
const generatorExprblock = workspace.newBlock('generator_expr');
test('generatorExpr函数的测试', () => {
  expect(generator.blockToCode(generatorExprblock))
      .toEqual(['(__ __ for __ in__ __ for __ in__ __ for __ in__)', 0]);
});

workspace.newBlock('tuples_getSubtuple');
workspace.newBlock('text_getSubstring');
sliceGenerate(Blockly);
workspace.newBlock('lists_getSublist');
workspace.newBlock('tuples_getSubtuple');
workspace.newBlock('iterators_create_with_item');
// workspace.newBlock('');

const UnaryOpblock = workspace.newBlock('UnaryOpUAdd');
test('UnaryOp函数的测试', () => {
  expect(generator.blockToCode(UnaryOpblock))
      .toEqual(['+__', 4]);
});
