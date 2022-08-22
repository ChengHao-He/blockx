// 字典、集合、元组（列表使用Blockly内置）
const dictPairConfig = {
  message0: '%1 : %2',
  args0: [
    {
      type: 'input_value',
      name: 'KEY',
    },
    {
      type: 'input_value',
      name: 'VALUE',
    },
  ],
  output: 'DictPair',
  colour: '#833471',
  inputsInline: true,
};

Blockly.Blocks.dicts_pair = {
  init: function() {
    this.jsonInit(dictPairConfig);
  },
};

Blockly.Blocks.dicts_create_with = {
  /**
   * Block for creating a dict with any number of elements of any type.
   * @this Blockly.Block
   */
  init() {
    this.setColour('#833471');
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Dict');
    this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
  },
  /**
   * Create XML to represent dict inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the dict inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose(workspace) {
    const containerBlock = workspace.newBlock('dicts_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('dicts_create_with_item');
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
  compose(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    const connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput(`ADD${i}`).connection.targetConnection;
      if (connection && connections.indexOf(connection) === -1) {
        const key = connection.getSourceBlock().getInput('KEY');
        if (key.connection.targetConnection) {
          key.connection.targetConnection.getSourceBlock().unplug(true);
        }
        const value = connection.getSourceBlock().getInput('VALUE');
        if (value.connection.targetConnection) {
          value.connection.targetConnection.getSourceBlock().unplug(true);
        }
        connection.disconnect();
        connection.getSourceBlock().dispose();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, `ADD${i}`);
      if (!connections[i]) {
        const itemBlock = this.workspace.newBlock('dicts_pair');
        itemBlock.setDeletable(false);
        itemBlock.setMovable(false);
        itemBlock.initSvg();
        this.getInput(`ADD${i}`).connection.connect(itemBlock.outputConnection);
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
  saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;
    while (itemBlock) {
      const input = this.getInput(`ADD${i}`);
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
  updateShape_() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.DICTS_CREATE_EMPTY_TITLE);
    }
    // Add new inputs.
    let i = 0;
    for (i = 0; i < this.itemCount_; i++) {
      if (!this.getInput(`ADD${i}`)) {
        const input = this.appendValueInput(`ADD${i}`)
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck('DictPair');
        if (i === 0) {
          input.appendField(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput(`ADD${i}`)) {
      this.removeInput(`ADD${i}`);
      i++;
    }
  },
};

Blockly.Blocks.dicts_create_with_container = {
  /**
   * Mutator block for dict container.
   * @this Blockly.Block
   */
  init() {
    this.setColour('#833471');
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};

Blockly.Blocks.dicts_create_with_item = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init() {
    this.setColour('#833471');
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Blocks.sets_create_with = {
  /**
     * Block for creating a set with any number of elements of any type.
     * @this Blockly.Block
     */
  init() {
    this.setColour('#B53471');
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Set');
    this.setMutator(new Blockly.Mutator(['sets_create_with_item']));
  },
  /**
     * Create XML to represent set inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
  mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
     * Parse XML to restore the set inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
  domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
  decompose(workspace) {
    const containerBlock = workspace.newBlock('sets_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('sets_create_with_item');
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
  compose(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    const connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput(`ADD${i}`).connection.targetConnection;
      if (connection && connections.indexOf(connection) === -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, `ADD${i}`);
    }
  },
  /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
  saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;
    while (itemBlock) {
      const input = this.getInput(`ADD${i}`);
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
  updateShape_() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.SETS_CREATE_EMPTY_TITLE);
    }
    // Add new inputs.
    let i = 0;
    for (i = 0; i < this.itemCount_; i++) {
      if (!this.getInput(`ADD${i}`)) {
        const input = this.appendValueInput(`ADD${i}`);
        if (i === 0) {
          input.appendField(Blockly.Msg.SETS_CREATE_WITH_INPUT_WITH)
              .setAlign(Blockly.ALIGN_RIGHT);
        } else {
          input.appendField('').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput(`ADD${i}`)) {
      this.removeInput(`ADD${i}`);
      i++;
    }
    // Add the trailing "]"
    if (this.getInput('TAIL')) {
      this.removeInput('TAIL');
    }
    if (this.itemCount_) {
      this.appendDummyInput('TAIL')
          .appendField('')
          .setAlign(Blockly.ALIGN_RIGHT);
    }
  },
};

Blockly.Blocks.sets_create_with_container = {
  /**
     * Mutator block for set container.
     * @this Blockly.Block
     */
  init() {
    this.setColour('#B53471');
    this.appendDummyInput()
        .appendField(Blockly.Msg.SETS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};

Blockly.Blocks.sets_create_with_item = {
  /**
     * Mutator block for adding items.
     * @this Blockly.Block
     */
  init() {
    this.setColour('#B53471');
    this.appendDummyInput()
        .appendField(Blockly.Msg.VARIABLES_DEFAULT_NAME);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Blocks.tuples_create_with = {
  /**
     * Block for creating a tuple with any number of elements of any type.
     * @this Blockly.Block
     */
  init() {
    this.setColour('#5758BB');
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Tuple');
    this.setMutator(new Blockly.Mutator(['tuples_create_with_item']));
  },
  /**
     * Create XML to represent tuple inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
  mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
     * Parse XML to restore the tuple inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
  domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
  decompose(workspace) {
    const containerBlock = workspace.newBlock('tuples_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('tuples_create_with_item');
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
  compose(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    const connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput(`ADD${i}`).connection.targetConnection;
      if (connection && connections.indexOf(connection) === -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, `ADD${i}`);
    }
  },
  /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
  saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;
    while (itemBlock) {
      const input = this.getInput(`ADD${i}`);
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
  updateShape_() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.TUPLES_CREATE_EMPTY_TITLE);
    }
    // Add new inputs.
    let i = 0;
    for (i = 0; i < this.itemCount_; i++) {
      if (!this.getInput(`ADD${i}`)) {
        const input = this.appendValueInput(`ADD${i}`);
        if (i === 0) {
          input.appendField(Blockly.Msg.TUPLES_CREATE_WITH_INPUT_WITH)
              .setAlign(Blockly.ALIGN_RIGHT);
        } else {
          input.appendField('').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput(`ADD${i}`)) {
      this.removeInput(`ADD${i}`);
      i++;
    }
    // Add the trailing "]"
    if (this.getInput('TAIL')) {
      this.removeInput('TAIL');
    }
    if (this.itemCount_) {
      const tail = this.appendDummyInput('TAIL');
      if (this.itemCount_ === 1) {
        tail.appendField('');
      } else {
        tail.appendField('');
      }
      tail.setAlign(Blockly.ALIGN_RIGHT);
    }
  },
};

Blockly.Blocks.tuples_create_with_container = {
  /**
     * Mutator block for tuple container.
     * @this Blockly.Block
     */
  init() {
    this.setColour('#5758BB');
    this.appendDummyInput()
        .appendField(Blockly.Msg.TUPLES_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};

Blockly.Blocks.tuples_create_with_item = {
  /**
     * Mutator block for adding items.
     * @this Blockly.Block
     */
  init() {
    this.setColour('#5758BB');
    this.appendDummyInput()
        .appendField(Blockly.Msg.VARIABLES_DEFAULT_NAME);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};
