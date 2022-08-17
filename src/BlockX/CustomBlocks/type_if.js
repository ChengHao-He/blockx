Blockly.Blocks['if'] = {
  init: function() {
    this.orelse_ = 0;
    this.elifs_ = 0;
    this.appendValueInput('TEST')
        .appendField('if');
    this.appendStatementInput('BODY')
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.updateShape_();
  },

  // TODO: Not mutable currently
  updateShape_: function() {
    let i = 0;
    for (; i < this.elifs_; i++) {
      if (!this.getInput('ELIF' + i)) {
        this.appendValueInput('ELIFTEST' + i)
            .appendField('elif');
        this.appendStatementInput('ELIFBODY' + i)
            .setCheck(null);
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ELIFTEST' + i)) {
      this.removeInput('ELIFTEST' + i);
      this.removeInput('ELIFBODY' + i);
      i++;
    }

    if (this.orelse_ && !this.getInput('ELSE')) {
      this.appendDummyInput('ORELSETEST')
          .appendField('else:');
      this.appendStatementInput('ORELSEBODY')
          .setCheck(null);
    } else if (!this.orelse_ && this.getInput('ELSE')) {
      block.removeInput('ORELSETEST');
      block.removeInput('ORELSEBODY');
    }

    for (i = 0; i < this.elifs_; i++) {
      if (this.orelse_) {
        this.moveInputBefore('ELIFTEST' + i, 'ORELSETEST');
        this.moveInputBefore('ELIFBODY' + i, 'ORELSETEST');
      } else if (i+1 < this.elifs_) {
        this.moveInputBefore('ELIFTEST' + i, 'ELIFTEST' + (i+1));
        this.moveInputBefore('ELIFBODY' + i, 'ELIFBODY' + (i+1));
      }
    }
  },

  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('orelse', this.orelse_);
    container.setAttribute('elifs', this.elifs_);
    return container;
  },

  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.orelse_ = 'true' === xmlElement.getAttribute('orelse');
    this.elifs_ = parseInt(xmlElement.getAttribute('elifs'), 10) || 0;
    this.updateShape_();
  },
};
