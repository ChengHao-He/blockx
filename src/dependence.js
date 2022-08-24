const dependence = {};
dependence.Blockly = null;
dependence.TextEditor = null;
dependence.Sk = null;
dependence.pythonToBlock = null;
module.exports = {
  initBlockly(blockly) {
    if (blockly === null || blockly === undefined) {
      return false;
    }
    dependence.Blockly = blockly;
    return true;
  },
  initTextEditor(textEditor) {
    if (textEditor === null || textEditor === undefined) {
      return false;
    }
    dependence.TextEditor = textEditor;
    return true;
  },
  initPythonToBlock(pythonToBlock) {
    if (pythonToBlock === null || pythonToBlock === undefined) {
      return false;
    }
    dependence.pythonToBlock = pythonToBlock;
    return true;
  },
  initSk(Sk) {
    if (Sk === null || Sk === undefined) {
      return false;
    }
    dependence.Sk = Sk;
    return true;
  },
  getDependence() {
    return dependence;
  },
  getBlockly() {
    return dependence.Blockly;
  },
  getTextEditor() {
    return dependence.TextEditor;
  },
  getPythonToBlock() {
    return dependence.pythonToBlock;
  },
  getSk() {
    return dependence.Sk;
  },
};

