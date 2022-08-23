const dependence = {};
dependence.Blockly = null;
dependence.TextEditor = null;
module.exports = {
  initBlockly(blockly) {
    if (blockly === null) {
      return false;
    }
    dependence.Blockly = blockly;
    return true;
  },
  initTextEditor(textEditor) {
    if (textEditor === null) {
      return false;
    }
    dependence.TextEditor = textEditor;
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
};
