/**
 * 创建classdef块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function classdefBlocks(Blockly) {
  const classDefConfig = {
    'message0': '%1 %2',
    'args0': [
      {
        'type': 'input_dummy',
      },
      {
        'type': 'input_statement',
        'name': 'BODY',
        'check': null,
      }],
    'colour': 240,
    'inputsInline': false,
    'nextStatement': null,
    'previousStatement': null,
  };

  Blockly.Blocks['class_def'] = {
    init: function() {
      this.decorators_ = 0;
      this.bases_ = 0;
      this.keywords_ = 0;
      this.appendDummyInput('HEADER')
          .appendField('Class')
          .appendField(new Blockly.FieldVariable('item'), 'NAME');
      this.jsonInit(classDefConfig);
      this.updateShape_();
    },
    updateShape_: function() {
      for (let i = 0; i < this.decorators_; i++) {
        const input = this.appendValueInput('DECORATOR' + i)
            .setCheck(null)
            .setAlign(Blockly.ALIGN_RIGHT);
        if (i === 0) {
          input.appendField('decorated by');
        }
        this.moveInputBefore('DECORATOR' + i, 'BODY');
      }
      for (let i = 0; i < this.bases_; i++) {
        const input = this.appendValueInput('BASE' + i)
            .setCheck(null)
            .setAlign(Blockly.ALIGN_RIGHT);
        if (i === 0) {
          input.appendField('inherits from');
        }
        this.moveInputBefore('BASE' + i, 'BODY');
      }

      for (let i = 0; i < this.keywords_; i++) {
        this.appendValueInput('KEYWORDVALUE' + i)
            .setCheck(null)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldTextInput('metaclass'),
                'KEYWORDNAME' + i)
            .appendField('=');
        this.moveInputBefore('KEYWORDVALUE' + i, 'BODY');
      }
    },
    /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
    mutationToDom: function() {
      const container = document.createElement('mutation');
      container.setAttribute('decorators', this.decorators_);
      container.setAttribute('bases', this.bases_);
      container.setAttribute('keywords', this.keywords_);
      return container;
    },
    /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
    domToMutation: function(xmlElement) {
      this.decorators_ = parseInt(xmlElement.getAttribute('decorators'), 10);
      this.bases_ = parseInt(xmlElement.getAttribute('bases'), 10);
      this.keywords_ = parseInt(xmlElement.getAttribute('keywords'), 10);
      this.updateShape_();
    },
  };

  const ellipsisConfig = {
    message0: '...',
    output: null,
    colour: '#777777',
  };
  Blockly.Blocks['ellipsis'] = {
    init: function() {
      this.jsonInit(ellipsisConfig);
    },
  };
}
export default classdefBlocks;
