Blockly.Blocks['with'] = {
  init: function() {
    this.init;
    this.appendValueInput('ITEM0')
        .appendField('with');
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.itemCount_ = 1;
    this.renames_ = [false];
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.updateShape_();
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    for (let i = 0; i < this.itemCount_; i++) {
      const parameter = document.createElement('as');
      parameter.setAttribute('name', this.renames_[i]);
      container.appendChild(parameter);
    }
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.renames_ = [];
    for (let i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() === 'as') {
        this.renames_.push('true' === childNode.getAttribute('name'));
      }
    }
    this.updateShape_();
  },

  updateShape_: function() {
    // With clauses
    let i = 1;
    for (; i < this.itemCount_; i++) {
      let input = this.getInput('ITEM' + i);
      if (!input) {
        input = this.appendValueInput('ITEM' + i);
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ITEM' + i)) {
      this.removeInput('ITEM' + i);
      i++;
    }
    // Reposition everything
    for (i = 0; i < this.itemCount_; i++) {
      this.moveInputBefore('ITEM' + i, 'BODY');
    }
  },
};


