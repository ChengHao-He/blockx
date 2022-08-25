/**
 * 创建import块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function importBlocks(Blockly) {
  const importConfig = {
    'innputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'colour': '#4250D4',
  };
  Blockly.Blocks['import'] = {
    init: function() {
      this.nameCount_ = 1;
      this.from_ = false;
      this.regulars_ = [true];
      this.jsonInit(importConfig);
      this.updateShape_();
    },
    runImportClauses: function() {
    // Import clauses
      let i = 0;
      for ( ; i < this.nameCount_; i++) {
        let input = this.getInput('CLAUSE' + i);
        if (!input) {
          input = this.appendDummyInput('CLAUSE' + i)
              .setAlign(Blockly.ALIGN_RIGHT);
          if (i === 0) {
            input.appendField(Blockly.Msg.IMPORT_BLOCK_TITLE);
          }
          input.appendField(new Blockly.FieldTextInput('default'), 'NAME' + i);
        }
        if (this.regulars_[i] && this.getField('AS' + i)) {
          input.removeField('AS' + i);
          input.removeField('ASNAME' + i);
        } else if (!this.regulars_[i] && !this.getField('AS' + i)) {
          input.appendField(Blockly.Msg.IMPORT_AS_BLOCK_TITLE, 'AS' + i)
              .appendField(new Blockly.FieldTextInput('alias'), 'ASNAME' + i);
        }
      }
      // Remove deleted inputs.
      while (this.getInput('CLAUSE' + i)) {
        this.removeInput('CLAUSE' + i);
        i++;
      }
    },
    updateShape_: function() {
    // Possible FROM part
      if (this.from_ && !this.getInput('FROM')) {
        this.appendDummyInput('FROM')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(Blockly.Msg.IMPORT_FROM_BLOCK_TITLE)
            .appendField(new Blockly.FieldTextInput('module'), 'MODULE');
      } else if (!this.from_ && this.getInput('FROM')) {
        this.removeInput('FROM');
      }
      this.runImportClauses();
      // Reposition everything
      if (this.from_ && this.nameCount_ > 0) {
        this.moveInputBefore('FROM', 'CLAUSE0');
      }
      for (let i = 0; i + 1 < this.nameCount_; i++) {
        this.moveInputBefore('CLAUSE' + i, 'CLAUSE' + (i + 1));
      }
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
}
export default importBlocks;

