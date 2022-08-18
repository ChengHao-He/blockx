const workSpace = Blockly.inject('blockly-div', {
  toolbox: document.getElementById('toolbox'),
});
/**
 * 更新代码区内容
 * @param {*} event
 */
function updateFunction(event) {
  const code = Blockly.Python.workspaceToCode(workSpace);
  document.getElementById('python-code').value = code;
}
workSpace.addChangeListener(updateFunction);
