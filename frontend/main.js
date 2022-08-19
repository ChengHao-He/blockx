/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

// test for code
const workSpace = Blockly.inject('blockly-div', {
  toolbox: document.getElementById('toolbox'),
});

Blockly.Xml.domToWorkspace(document.getElementById('toolbox'), workSpace);
function updateFunction(event) {
  const code = Blockly.Python.workspaceToCode(workSpace);
  document.getElementById('python-code').value = code;
}
workSpace.addChangeListener(updateFunction);

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
