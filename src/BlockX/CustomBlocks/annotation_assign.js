Blockly.Blocks['annotation_assign'] = {
  init: function() {
    this.appendValueInput('TARGET')
        .setCheck(null)
        .appendField('set');
    this.appendValueInput('ANNOTATION')
        .setCheck(null)
        .appendField(':');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.initialized_ = true;
    this.updateShape_();
  },

  /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('initialized', this.initialized_);
    return container;
  },

  /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
  domToMutation: function(xmlElement) {
    this.initialized_ = 'true' === xmlElement.getAttribute('initialized');
    this.updateShape_();
  },

  updateShape_: function(block) {
    // Add new inputs.
    if (this.initialized_ && !this.getInput('VALUE')) {
      this.appendValueInput('VALUE')
          .appendField('=')
          .setAlign(Blockly.ALIGN_RIGHT);
    }
    if (!this.initialized_ && this.getInput('VALUE')) {
      this.removeInput('VALUE');
    }
  },
};
