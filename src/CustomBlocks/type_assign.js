Blockly.Blocks['assign'] = {
  init: function() {
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.targetCount_ = 1;
    this.simpleTarget_ = true;
    this.updateShape_();
    Blockly.Extensions.apply('contextMenu_variableSetterGetter', this, false);
  },

  updateShape_: function() {
    if (!this.getInput('VALUE')) {
      this.appendDummyInput()
          .appendField('set');
      this.appendValueInput('VALUE')
          .appendField('=');
    }
    let i = 0;
    if (this.targetCount_ === 1 && this.simpleTarget_) {
      this.setInputsInline(true);
      if (!this.getInput('VAR_ANCHOR')) {
        this.appendDummyInput('VAR_ANCHOR')
            .appendField(new Blockly.FieldVariable('variable'), 'VAR');
      }
      this.moveInputBefore('VAR_ANCHOR', 'VALUE');
    } else {
      i = this.getColumnsNumber();
    }
    // Remove deleted inputs.
    while (this.getInput('TARGET' + i)) {
      this.removeInput('TARGET' + i);
      i++;
    }
  },
  getColumnsNumber: function() {
    let i=0;
    this.setInputsInline(true);
    // Add new inputs.
    for (; i < this.targetCount_; i++) {
      if (!this.getInput('TARGET' + i)) {
        const input = this.appendValueInput('TARGET' + i);
        if (i !== 0) {
          input.appendField('and').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
      this.moveInputBefore('TARGET' + i, 'VALUE');
    }
    // Kill simple VAR
    if (this.getInput('VAR_ANCHOR')) {
      this.removeInput('VAR_ANCHOR');
    }
    return i;
  },
  /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('targets', this.targetCount_);
    container.setAttribute('simple', this.simpleTarget_);
    return container;
  },

  /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
  domToMutation: function(xmlElement) {
    this.targetCount_ = parseInt(xmlElement.getAttribute('targets'), 10);
    this.simpleTarget_ = 'true' === xmlElement.getAttribute('simple');
    this.updateShape_();
  },
};

Blockly.Blocks['annAssignFull'] = {
  init: function init() {
    this.appendValueInput('TARGET').setCheck(null).appendField('set');
    this.appendValueInput('ANNOTATION').setCheck(null).appendField(':');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.initialized_ = true;
  },
};
