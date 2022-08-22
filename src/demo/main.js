const workSpace = Blockly.inject('blockly-div', {
  toolbox: document.getElementById('toolbox'),
  media: '../../node_modules/blockly/media/',
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
  trashcan: true,
});

Blockly.Xml.domToWorkspace(document.getElementById('toolbox'), workSpace);

// 代码编辑editor
const editor = CodeMirror.fromTextArea(document.getElementById('python-code'), {
  lineNumbers: true, // 显示行号
  indentUnit: 4, // 缩进
  styleActiveLine: true,
  matchBrackets: true,
  mode: 'python', // 语言
  lineWrapping: true,
  theme: 'elegant', // 主题
});
editor.setOption('extraKeys', {
  // <Tab> to 4 <space>
  'Tab': function(cm) {
    const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
    cm.replaceSelection(spaces);
  },
  // F11键切换全屏
  'F11': function(cm) {
    cm.setOption('fullScreen', !cm.getOption('fullScreen'));
  },
  // Esc键退出全屏
  'Esc': function(cm) {
    if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
  },
});
/**
 *
 * @param {*} _event
 */
function updateFunction(_event) {
  const code = Blockly.Python.workspaceToCode(workSpace);
  document.getElementById('python-code').value = code;
  editor.setValue(code);
}
workSpace.addChangeListener(updateFunction);

