Blockly.Blocks['lambda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('lambda')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.decoratorsCount_ = 0;
    this.parametersCount_ = 0;
    this.hasReturn_ = false;
    this.appendValueInput('BODY')
        .appendField('body')
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck(null);
    this.setInputsInline(false);
    this.setOutput(true);
    this.setColour(210);
    this.updateShape_();
  },
  mutationToDom: Blockly.Blocks['FunctionDef'].mutationToDom,
  domToMutation: Blockly.Blocks['FunctionDef'].domToMutation,
  updateShape_: Blockly.Blocks['FunctionDef'].updateShape_,
  setReturnAnnotation_: Blockly.Blocks['FunctionDef'].setReturnAnnotation_,
};
