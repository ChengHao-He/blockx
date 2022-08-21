Blockly.Blocks['import'] = {
  init: function() {
    this.nameCount_ = 1;
    this.from_ = false;
    this.regulars_ = [true];
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.updateShape_();
  },
  possibleFromPart: function() {
    if (this.from_ && !this.getInput('FROM')) {
      this.appendDummyInput('FROM')
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField('from')
          .appendField(new Blockly.FieldTextInput('module'), 'MODULE');
    } else if (!this.from_ && this.getInput('FROM')) {
      this.removeInput('FROM');
    }
  },
  removeDeletedInputs: function(i) {
    while (this.getInput('CLAUSE' + i)) {
      this.removeInput('CLAUSE' + i);
      i++;
    }
  },
  repositionEverything: function(i) {
    if (this.from_ && this.nameCount_ > 0) {
      this.moveInputBefore('FROM', 'CLAUSE0');
    }
    for (i = 0; i + 1 < this.nameCount_; i++) {
      this.moveInputBefore('CLAUSE' + i, 'CLAUSE' + (i + 1));
    }
  },
  importClauses: function() {
    let i = 0;
    for ( ; i < this.nameCount_; i++) {
      let input = this.getInput('CLAUSE' + i);
      if (!input) {
        input = this.appendDummyInput('CLAUSE' + i)
            .setAlign(Blockly.ALIGN_RIGHT);
        if (i === 0) {
          input.appendField('import');
        }
        input.appendField(new Blockly.FieldTextInput('default'), 'NAME' + i);
      }
      if (this.regulars_[i] && this.getField('AS' + i)) {
        input.removeField('AS' + i);
        input.removeField('ASNAME' + i);
      } else if (!this.regulars_[i] && !this.getField('AS' + i)) {
        input.appendField('as', 'AS' + i)
            .appendField(new Blockly.FieldVariable('alias'), 'ASNAME' + i);
      }
    }
    // Remove deleted inputs
    this.removeDeletedInputs(i);

    // Reposition everything
    this.repositionEverything(i);
  },
  updateShape_: function() {
    // Possible FROM part
    this.possibleFromPart();

    // Import clauses
    this.importClauses();
  },

  /**
     * Create XML to represent the (non-editable) name and arguments.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('names', this.nameCount_);
    container.setAttribute('from', this.from_);
    for (let i = 0; i < this.nameCount_; i++) {
      const parameter = document.createElement('regular');
      parameter.setAttribute('name', this.regulars_[i]);
      container.appendChild(parameter);
    }
    return container;
  },

  /**
     * Parse XML to restore the (non-editable) name and parameters.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
  domToMutation: function(xmlElement) {
    this.nameCount_ = parseInt(xmlElement.getAttribute('names'), 10);
    this.from_ = 'true' === xmlElement.getAttribute('from');
    this.regulars_ = [];
    for (let i = 0; xmlElement.childNodes[i]; i++) {
      const childNode = xmlElement.childNodes[i];
      if (childNode.nodeName.toLowerCase() === 'regular') {
        this.regulars_.push('true' === childNode.getAttribute('name'));
      }
    }
    this.updateShape_();
  },
};
