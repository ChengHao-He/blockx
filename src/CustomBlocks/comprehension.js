// 推导式comprehensions
const comprehensionForConfig = {
  'message0': 'for %1 in %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'TARGET',
    },
    {
      'type': 'input_value',
      'name': 'ITERATOR',
    },
  ],
  'inputsInline': true,
  'output': 'comprehension_for',
  'colour': 15,
};
Blockly.Blocks['comprehension_for'] = {
  init: function() {
    this.jsonInit(comprehensionForConfig);
  },
};

const comprehensionIfConfig = {
  'message0': 'if %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'TEST',
    },
  ],
  'inputsInline': true,
  'output': 'comprehension_if',
  'colour': 15,
};
Blockly.Blocks['comprehension_if'] = {
  init: function() {
    this.jsonInit(comprehensionIfConfig);
  },
};

Blockly.Blocks['comp_create_with_container'] = {
  /**
   * 变形器容器
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(15);
    this.appendDummyInput()
        .appendField('Add new comprehensions below');
    this.appendDummyInput()
        .appendField('   For clause');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};

Blockly.Blocks['comp_create_with_for'] = {
  /**
   * 变形器零件for
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(15);
    this.appendDummyInput()
        .appendField('For clause');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Blocks['comp_create_with_if'] = {
  /**
   * 变形器零件if
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(15);
    this.appendDummyInput()
        .appendField('If clause');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

['list_comp', 'set_comp',
  'dict_comp', 'generator_expr'].forEach(function(kind) {
  Blockly.Blocks[kind] = {
    /**
     * 四个Python推导式块，其中生成器表达式较为特殊，
     * 它拥有自己的特性，并非元组推导式，但在句法上与
     * 列表、集合、字典推导式相同，因此归入同一类。
     * @this Blockly.Block
     */
    init: function() {
      this.setStyle('loop_blocks');
      this.setColour(Blockly.COMPREHENSION_SETTINGS[kind].color);
      this.itemCount_ = 3;
      const input = this.appendValueInput('ELT')
          .appendField(Blockly.COMPREHENSION_SETTINGS[kind].start);
      if (kind === 'dict_comp') {
        input.setCheck('dict_pair');
      }
      this.appendDummyInput('END_BRACKET')
          .appendField(Blockly.COMPREHENSION_SETTINGS[kind].end);
      this.updateShape_();
      this.setOutput(true);
      this.setMutator(new
      Blockly.Mutator(['comp_create_with_for', 'comp_create_with_if']));
    },
    /**
     * Create XML to represent dict inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      const container = document.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },
    /**
     * Parse XML to restore the dict inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
      const containerBlock = workspace.newBlock('comp_create_with_container');
      containerBlock.initSvg();
      let connection = containerBlock.getInput('STACK').connection;
      for (let i = 1; i < this.itemCount_; i++) {
        const generator = this.getInput('GENERATOR' + i).connection;
        let createName;
        if (generator.targetConnection.getSourceBlock().type ===
            'comprehension_if') {
          createName = 'comp_create_with_if';
        } else if (generator.targetConnection.getSourceBlock().type ===
            'comprehension_for') {
          createName = 'comp_create_with_for';
        } else {
          throw Error('Unknown block type: ' +
                generator.targetConnection.getSourceBlock().type);
        }
        const itemBlock = workspace.newBlock(createName);
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
      let itemBlock = containerBlock.getInputTargetBlock('STACK');
      // Count number of inputs.
      const connections = [containerBlock.valueConnection_];
      const blockTypes = ['comp_create_with_for'];
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        blockTypes.push(itemBlock.type);
        itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
      }
      // Disconnect any children that don't belong.
      for (let i = 1; i < this.itemCount_; i++) {
        const connection =
            this.getInput('GENERATOR' + i).connection.targetConnection;
        if (connection && connections.indexOf(connection) === -1) {
          const connectedBlock = connection.getSourceBlock();
          if (connectedBlock.type === 'comprehension_if') {
            const testField = connectedBlock.getInput('TEST');
            if (testField.connection.targetConnection) {
              testField.connection
                  .targetConnection
                  .getSourceBlock()
                  .unplug(true);
            }
          } else if (connectedBlock.type === 'comprehension_for') {
            const iterField = connectedBlock.getInput('ITERATOR');
            if (iterField.connection.targetConnection) {
              iterField.connection
                  .targetConnection
                  .getSourceBlock()
                  .unplug(true);
            }
            const targetField = connectedBlock.getInput('TARGET');
            if (targetField.connection.targetConnection) {
              targetField.connection
                  .targetConnection
                  .getSourceBlock()
                  .unplug(true);
            }
          } else {
            throw Error('Unknown block type: ' + connectedBlock.type);
          }
          connection.disconnect();
          connection.getSourceBlock().dispose();
        }
      }
      this.itemCount_ = connections.length;
      this.updateShape_();
      // Reconnect any child blocks.
      for (let i = 1; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'GENERATOR' + i);
        if (!connections[i]) {
          let createName;
          if (blockTypes[i] === 'comp_create_with_if') {
            createName = 'comprehension_if';
          } else if (blockTypes[i] === 'comp_create_with_for') {
            createName = 'comprehension_for';
          } else {
            throw Error('Unknown block type: ' + blockTypes[i]);
          }
          itemBlock = this.workspace.newBlock(createName);
          itemBlock.setDeletable(false);
          itemBlock.setMovable(false);
          itemBlock.initSvg();
          this.getInput('GENERATOR' + i)
              .connection
              .connect(itemBlock.outputConnection);
          itemBlock.render();
          // this.get(itemBlock, 'ADD'+i)
        }
      }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
      containerBlock.valueConnection_ =
            this.getInput('GENERATOR0').connection.targetConnection;
      let itemBlock = containerBlock.getInputTargetBlock('STACK');
      let i = 1;
      while (itemBlock) {
        const input = this.getInput('GENERATOR' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
      }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
      // Add new inputs.
      let i = 0;
      for (; i < this.itemCount_; i++) {
        if (!this.getInput('GENERATOR' + i)) {
          const input = this.appendValueInput('GENERATOR' + i);
          if (i === 0) {
            input.setCheck('comprehension_for');
          } else {
            input.setCheck(['comprehension_for', 'comprehension_if']);
          }
          this.moveInputBefore('GENERATOR' + i, 'END_BRACKET');
        }
      }
      // Remove deleted inputs.
      while (this.getInput('GENERATOR' + i)) {
        this.removeInput('GENERATOR' + i);
        i++;
      }
    },
  };
});
