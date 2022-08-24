/**
 * 创建assign块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function assignBlocks(Blockly) {
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

  const updateShape = function(that, _block) {
    if (that.initialized_ && !that.getInput('VALUE')) {
      that.appendValueInput('VALUE')
          .appendField('=')
          .setAlign(Blockly.ALIGN_RIGHT);
    }
    if (!that.initialized_ && that.getInput('VALUE')) {
      that.removeInput('VALUE');
    }
  };
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
      updateShape(this, _block);
    },
  };

  Blockly.ANNOTATION_OPTIONS = [
    ['int', 'int'],
    ['float', 'float'],
    ['str', 'str'],
    ['bool', 'bool'],
    ['None', 'None'],
  ];
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
      updateShape(this, _block);
    },
  };

  Blockly.Blocks['aug_assign'] = {
    init: function() {
      this.simpleTarget_ = true;
      this.allOptions_ = false;
      this.appendDummyInput('OP')
          .appendField(new Blockly.FieldDropdown(function() {
            return Blockly.BINOPS_AUGASSIGN_DISPLAY;
          }), 'OP_NAME')
          .appendField(' ');
      this.appendDummyInput('PREPOSITION_ANCHOR')
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(Blockly.Msg.BINOPS_AUGASSIGN_PREPOSITION, 'PREPOSITION');
      this.appendValueInput('VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(225);
      this.updateShape_();
    },
    /**
       * Create XML to represent list inputs.
       * @return {!Element} XML storage element.
       * @this Blockly.Block
       */
    mutationToDom: function() {
      const container = document.createElement('mutation');
      container.setAttribute('simple', this.simpleTarget_);
      return container;
    },
    /**
       * Parse XML to restore the list inputs.
       * @param {!Element} xmlElement XML storage element.
       * @this Blockly.Block
       */
    domToMutation: function(xmlElement) {
      this.simpleTarget_ = 'true' === xmlElement.getAttribute('simple');
      this.updateShape_();
    },
    updateShape_: function(_block) {
    // Add new inputs.
      this.getField('OP_NAME').getOptions(false);
      if (this.simpleTarget_) {
        if (!this.getInput('VAR_ANCHOR')) {
          this.appendDummyInput('VAR_ANCHOR')
              .appendField(new Blockly.FieldVariable('variable'), 'VAR');
          this.moveInputBefore('VAR_ANCHOR', 'PREPOSITION_ANCHOR');
        }
        if (this.getInput('TARGET')) {
          this.removeInput('TARGET');
        }
      } else {
        if (this.getInput('VAR_ANCHOR')) {
          this.removeInput('VAR_ANCHOR');
        }
        if (!this.getInput('TARGET')) {
          this.appendValueInput('TARGET');
          this.moveInputBefore('TARGET', 'PREPOSITION_ANCHOR');
        }
      }
    },
  };
};
export default assignBlocks;
