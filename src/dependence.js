const dependence = {};
dependence.blockly = null;
dependence.textEditor = null;
export default {
  dependence,
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
    dependence.textEditor = textEditor;
    return true;
  },
};
