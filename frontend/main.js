/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
// 设置弹窗
document.querySelector('#setting-button').onclick = eventSettingClick;
const backGround = document.getElementById('back-ground');
function eventSettingClick() {
  backGround.style.display = 'block';
}
// 设置弹窗关闭按钮
document.querySelector('#close-button').onclick = eventCloseSetting;
const CloseButton = document.getElementById('close-button');
function eventCloseSetting() {
  backGround.style.display = 'none';
}
// 重置按钮实现
const resetButton = document.getElementById('reset-button');
document.querySelector('.reset-button').onclick = eventRestButton;
function eventRestButton() {
  alert('重置成功');
}
// 运行按钮实现
const runButton = document.getElementById('run-button');
document.querySelector('.run-button').onclick = eventRunButton;
function eventRunButton() {
  alert('运行成功');
}
// 积木区注入功能实现
function blocklyAdd() {
  alert('注入功能实现');
}
// 积木区列表选择实现
function blocklyChoose() {
  alert('列表选择实现');
}
// 积木区框架导入
function blocklyImport() {
  alert('框架导入实现');
}
const editor = new BlockX({
  'container': document.getElementById('blockly-area'),
}, document.getElementById('code-text'));
editor.setCode('print("hello word")');// 初始输入
Sk.configure({// 配置?
  __future__: Sk.python3,
  read: function(filename) {
    if (Sk.builtinFiles === undefined ||
            Sk.builtinFiles['files'][filename] === undefined) {
      throw new Error('File not found: \'' + filename + '\'');
    }
    return Sk.builtinFiles['files'][filename];
  },
});
const mathChangeJson = {
  'message0': 'for each item %1 in list %2',
  'args0': [
    {
      'type': 'input_variable',
      'name': 'DELTA', 'variable': 'item', 'variableTypes': ['']},
    {'type': 'input_value', 'name': 'DELTA', 'check': 'Number'},
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};

Blockly.Blocks['math_change'] = {
  init: function() {
    this.jsonInit(mathChangeJson);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a number to variable "%1".'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
};
