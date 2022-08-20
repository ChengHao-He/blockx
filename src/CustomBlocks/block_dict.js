// 字典元素块
Blockly.Blocks['dict_item'] = {
  init: function() {
    this.appendValueInput('KEY')
        .setCheck(null);
    this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField(':');
    this.setInputsInline(true);
    this.setOutput(true, 'dict_pair');
    this.setColour(0);
  },
};

Blockly.Blocks['dict_create_with_container'] = {
  /**
   * 字典变形器顶级块
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField('Add new dict elements below');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};

Blockly.Blocks['dict_create_with_item'] = {
  /**
   * 字典变形器子块
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField('Element');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Blocks['dict'] = {
  /**
   * 字典对象实例（默认带有2个元素）
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(0);
    this.itemCount_ = 2;
    this.updateShape_();
    this.setOutput(true, 'dict');
    this.setMutator(new Blockly.Mutator(['dict_create_with_item']));
  },
  /**
   * 存储实例块的已有信息
   * @return {!Element} 返回一个XML对象。
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * 恢复实例块的已有信息
   * @param {!Element} xmlElement 传入mutationToDOM得到的XML对象。
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * 依照实例块结构生成变形器对话框中的“虚拟字典模板块”
   * @param {!Blockly.Workspace} workspace 传入变形器所在工作区
   * @return {!Blockly.Block} 返回变形器的顶级块
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    const containerBlock = workspace.newBlock('dict_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('dict_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * 依照变形器对话框中的块生成实例块的结构
   * @param {!Blockly.Block} containerBlock 变形器顶级块
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    const connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
              itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
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
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
      if (!connections[i]) {
        itemBlock = this.workspace.newBlock('dict_item');
        itemBlock.setDeletable(false);
        itemBlock.setMovable(false);
        itemBlock.initSvg();
        this.getInput('ADD'+i).connection.connect(itemBlock.outputConnection);
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
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;
    while (itemBlock) {
      const input = this.getInput('ADD' + i);
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
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField('empty dictionary');
    }
    // Add new inputs.
    let i = 0;
    for (; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        const input = this.appendValueInput('ADD' + i)
            .setCheck('dict_pair');
        if (i === 0) {
          input.appendField('create dict with').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  },
};
