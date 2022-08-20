Blockly.Blocks['annotation_assign_full'] = {
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

  updateShape_: function(_block) {
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

Blockly.ANNOTATION_OPTIONS = [
  ['int', 'int'],
  ['float', 'float'],
  ['str', 'str'],
  ['bool', 'bool'],
  ['None', 'None'],
];

Blockly.ANNOTATION_GENERATE = {};
Blockly.ANNOTATION_OPTIONS.forEach(function(ann) {
  Blockly.ANNOTATION_GENERATE[ann[1]] = ann[0];
});

Blockly.Blocks['annotation_assign'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('set')
        .appendField(new Blockly.FieldVariable('item'), 'TARGET')
        .appendField(':')
        .appendField(new Blockly.FieldDropdown(Blockly.ANNOTATION_OPTIONS),
            'ANNOTATION');
    this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('=');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.strAnnotations_ = false;
    this.initialized_ = true;
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('str', this.strAnnotations_);
    container.setAttribute('initialized', this.initialized_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.strAnnotations_ = 'true' === xmlElement.getAttribute('str');
    this.initialized_ = 'true' === xmlElement.getAttribute('initialized');
    this.updateShape_();
  },

  updateShape_: function(_block) {
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
