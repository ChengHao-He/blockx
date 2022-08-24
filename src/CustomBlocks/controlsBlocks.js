/**
 * 创建controls块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function controlsBlocks(Blockly) {
  const forConfig = {
    'type': 'for',
    'message0': 'for %1 in %2 : %3 %4',
    'args0': [
      {'type': 'input_value', 'name': 'TARGET'},
      {'type': 'input_value', 'name': 'ITERATOR'},
      {'type': 'input_dummy'},
      {'type': 'input_statement', 'name': 'BODY'},
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 270,
  };
  Blockly.Blocks['for'] = {
    init: function() {
      this.jsonInit(forConfig);
      this.appendStatementInput('DO');
      this.setTooltip(function() {
        return 'FOR loop.';
      });
    },
  };

  const forElseConfig = {
    'message0': 'for %1 in %2 : %3 %4 else: %5 %6',
    'args0': [
      {'type': 'input_value', 'name': 'TARGET'},
      {'type': 'input_value', 'name': 'ITERATOR'},
      {'type': 'input_dummy'},
      {'type': 'input_statement', 'name': 'BODY'},
      {'type': 'input_dummy'},
      {'type': 'input_statement', 'name': 'ELSE'},
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 270,
  };
  Blockly.Blocks['for_else'] = {
    init: function() {
      this.jsonInit(forElseConfig);
      this.setTooltip(function() {
        return 'FOR_ELSE loop.';
      });
    },
  };

  const whileConfig = {
    message0: '%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'MODE',
        options: [
          ['%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}', 'WHILE'],
          ['%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}', 'UNTIL'],
        ],
      },
      {
        type: 'input_value',
        name: 'BOOL',
        check: 'Boolean',
      },
    ],
    message1: 'do %1',
    args1: [{
      type: 'input_statement',
      name: 'DO',
    }],
    message2: 'else %1',
    args2: [{
      type: 'input_statement',
      name: 'ELSE',
    }],
    previousStatement: null,
    nextStatement: null,
    colour: '#FFAB1B',
  };
  Blockly.Blocks['while'] = {
    init: function() {
      this.jsonInit(whileConfig);
    },
  };

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
      this.setStyle('logic_blocks');
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
        } else if (i + 1 < this.elifs_) {
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

  const breakConfig = {
    'message0': 'break',
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
  };
  Blockly.Blocks['break'] = {
    init: function() {
      this.jsonInit(breakConfig);
    },
  };

  const continueConfig = {
    'message0': 'continue',
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
  };
  Blockly.Blocks['continue'] = {
    init: function() {
      this.jsonInit(continueConfig);
    },
  };

  const assertConfig = {
    'message0': 'assert %1',
    'args0': [
      {'type': 'input_value', 'name': 'TEST'},
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 345,
  };
  Blockly.Blocks['assert'] = {
    init: function() {
      this.jsonInit(assertConfig);
    },
  };

  const assertFullConfig = {
    'message0': 'assert %1 %2',
    'args0': [
      {'type': 'input_value', 'name': 'TEST'},
      {'type': 'input_value', 'name': 'MSG'},
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 345,
  };
  Blockly.Blocks['assert_full'] = {
    init: function() {
      this.jsonInit(assertFullConfig);
    },
  };

  const withItemConfig = {
    'output': 'WithItem',
    'message0': '%1',
    'args0': [{'type': 'input_value', 'name': 'CONTEXT'}],
    'enableContextMenu': false,
    'colour': 270,
    'inputsInline': false,
  };
  Blockly.Blocks['with_item'] = {
    init: function() {
      this.jsonInit(withItemConfig);
    },
  };

  const withItemAsConfig = {
    'output': 'WithItem',
    'message0': 'context %1 as %2',
    'args0': [
      {'type': 'input_value', 'name': 'CONTEXT'},
      {'type': 'input_value', 'name': 'AS'},
    ],
    'enableContextMenu': false,
    'colour': 270,
    'inputsInline': true,
  };
  Blockly.Blocks['with_item_as'] = {
    init: function() {
      this.jsonInit(withItemAsConfig);
    },
  };

  Blockly.Blocks['with'] = {
    init: function() {
      this.appendValueInput('ITEM0')
          .appendField('with');
      this.appendStatementInput('BODY')
          .setCheck(null);
      this.itemCount_ = 1;
      this.renames_ = [false];
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
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
      const that = this;
      xmlElement.childNodes.forEach(function(childNode) {
        if (childNode.nodeName.toLowerCase() === 'as') {
          that.renames_.push('true' === childNode.getAttribute('name'));
        }
      });
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

  Blockly.Blocks['try'] = {
    init: function() {
      this.handlersCount_ = 0;
      this.handlers_ = [];
      this.hasElse_ = false;
      this.hasFinally_ = true;
      this.appendDummyInput()
          .appendField('try:');
      this.appendStatementInput('BODY')
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(300);
      this.updateShape_();
    },
    updateShape_: function() {
      for (let i = 0; i < this.handlersCount_; i++) {
        if (this.handlers_[i] === Blockly.TRY_SETTINGS.HANDLERS_CATCH_ALL) {
          this.appendDummyInput()
              .appendField('except');
        } else {
          this.appendValueInput('TYPE' + i)
              .setCheck(null)
              .appendField('except');
          if (this.handlers_[i] === Blockly.TRY_SETTINGS.HANDLERS_COMPLETE) {
            this.appendDummyInput()
                .appendField('as')
                .appendField(new Blockly.FieldVariable('item'), 'NAME'+i);
          }
        }
        this.appendStatementInput('HANDLER'+i)
            .setCheck(null);
      }
      if (this.hasElse_) {
        this.appendDummyInput()
            .appendField('else:');
        this.appendStatementInput('ORELSE')
            .setCheck(null);
      }
      if (this.hasFinally_) {
        this.appendDummyInput()
            .appendField('finally:');
        this.appendStatementInput('FINALBODY')
            .setCheck(null);
      }
    },
    /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
    mutationToDom: function() {
      const container = document.createElement('mutation');
      container.setAttribute('orelse', this.hasElse_);
      container.setAttribute('finalbody', this.hasFinally_);
      container.setAttribute('handlers', this.handlersCount_);
      for (let i = 0; i < this.handlersCount_; i++) {
        const parameter = document.createElement('arg');
        parameter.setAttribute('name', this.handlers_[i]);
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
      this.hasElse_ = 'true' === xmlElement.getAttribute('orelse');
      this.hasFinally_ = 'true' === xmlElement.getAttribute('finalbody');
      this.handlersCount_ = parseInt(xmlElement.getAttribute('handlers'), 10);
      this.handlers_ = [];
      const that = this;
      xmlElement.childNodes.forEach(function(childNode) {
        if (childNode.nodeName.toLowerCase() === 'arg') {
          that.handlers_.push(parseInt(childNode.getAttribute('name'), 10));
        }
      });
      this.updateShape_();
    },
  };

  Blockly.Blocks['raise'] = {
    init: function() {
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(300);
      this.exc_ = true;
      this.cause_ = false;

      this.appendDummyInput()
          .appendField('raise');
      this.updateShape_();
    },
    updateShape_: function() {
      if (this.exc_ && !this.getInput('EXC')) {
        this.appendValueInput('EXC')
            .setCheck(null);
      } else if (!this.exc_ && this.getInput('EXC')) {
        this.removeInput('EXC');
      }
      if (this.cause_ && !this.getInput('CAUSE')) {
        this.appendValueInput('CAUSE')
            .setCheck(null)
            .appendField('from');
      } else if (!this.cause_ && this.getInput('CAUSE')) {
        this.removeInput('CAUSE');
      }
      if (this.cause_ && this.exc_) {
        this.moveInputBefore('EXC', 'CAUSE');
      }
    },
    /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
    mutationToDom: function() {
      const container = document.createElement('mutation');
      container.setAttribute('exc', this.exc_);
      container.setAttribute('cause', this.cause_);
      return container;
    },
    /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
    domToMutation: function(xmlElement) {
      this.exc_ = 'true' === xmlElement.getAttribute('exc');
      this.cause_ = 'true' === xmlElement.getAttribute('cause');
      this.updateShape_();
    },
  };
}
export default controlsBlocks;

