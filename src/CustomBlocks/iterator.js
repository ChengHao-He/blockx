/**
 * 字典、集合、元组（列表使用Blockly内置）的写法大同小异，
 * 故利用forEach遍历减少代码冗余，本实现参考了blockly源码
 * 关于 iterators_create_with 的写法。
 * 注：向字典中插入元素时有类型检查：DictPair
 */

// 字典元素：键值对
const dictPairConfig = {
  message0: '%1 : %2',
  args0: [
    {
      type: 'input_value',
      name: 'KEY',
      check: null,
    },
    {
      type: 'input_value',
      name: 'VALUE',
      check: null,
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

// 统一变形器模板
Blockly.Blocks.iterators_create_with_container = {
  /**
   * Mutator block for iterator container.
   * @this Blockly.Block
   */
  init() {
    this.setColour('#464547');
    this.appendDummyInput()
        .appendField('container');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};
Blockly.Blocks.iterators_create_with_item = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init() {
    this.setColour('#464547');
    this.appendDummyInput()
        .appendField('item');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

// 创建可迭代对象块
['set', 'tuple', 'dict'].forEach(
    function(kind) {
      Blockly.Blocks[kind + 's_create_with'] = {
        /**
         * Block for creating a iterator with
         * any number of elements of any type.
         * @this {Block}
         */
        init: function() {
          this.setColour(Blockly.ITERATOR_SETTINGS[kind].color);
          this.itemCount_ = 3;
          this.updateShape_();
          this.setOutput(true, Blockly.ITERATOR_SETTINGS[kind].output);
          this.setMutator(new Blockly.Mutator(['iterators_create_with_item']));
        },
        /**
         * Create XML to represent iterator inputs.
         * Backwards compatible serialization implementation.
         * @return {!Element} XML storage element.
         * @this {Block}
         */
        mutationToDom: function() {
          const container = document.createElement('mutation');
          container.setAttribute('items', this.itemCount_);
          return container;
        },
        /**
         * Parse XML to restore the iterator inputs.
         * Backwards compatible serialization implementation.
         * @param {!Element} xmlElement XML storage element.
         * @this {Block}
         */
        domToMutation: function(xmlElement) {
          this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
          this.updateShape_();
        },
        /**
         * Returns the state of this block as a JSON serializable object.
         * @return {{itemCount: number}} The state of this block,
         * ie the item count.
         */
        saveExtraState: function() {
          return {
            'itemCount': this.itemCount_,
          };
        },
        /**
         * Applies the given state to this block.
         * @param {*} state The state to apply to this block, ie the item count.
         */
        loadExtraState: function(state) {
          this.itemCount_ = state['itemCount'];
          this.updateShape_();
        },
        /**
         * Populate the mutator's dialog with this block's components.
         * @param {!Workspace} workspace Mutator's workspace.
         * @return {!Block} Root block in mutator.
         * @this {Block}
         */
        decompose: function(workspace) {
          const containerBlock =
              workspace.newBlock('iterators_create_with_container');
          containerBlock.initSvg();
          let connection = containerBlock.getInput('STACK').connection;
          for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('iterators_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
          }
          return containerBlock;
        },
        /**
         * Reconfigure this block based on the mutator dialog's components.
         * @param {!Block} containerBlock Root block in mutator.
         * @this {Block}
         */
        compose: function(containerBlock) {
          let itemBlock = containerBlock.getInputTargetBlock('STACK');
          // Count number of inputs.
          const connections = [];
          while (itemBlock && !itemBlock.isInsertionMarker()) {
            connections.push(itemBlock.valueConnection_);
            itemBlock =
                itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
          };
          this.connectionHandler(connections);
        },
        /**
         * Store pointers to any connected child blocks.
         * @param {!Block} containerBlock Root block in mutator.
         * @this {Block}
         */
        saveConnections: function(containerBlock) {
          let itemBlock = containerBlock.getInputTargetBlock('STACK');
          let i = 0;
          while (itemBlock) {
            const input = this.getInput(`ADD${i}`);
            itemBlock.valueConnection_ =
                input && input.connection.targetConnection;
            itemBlock =
                itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
            i++;
          }
        },
        /**
         * Modify this block to have the correct number of inputs.
         * @private
         * @this {Block}
         */
        updateShape_: function() {
          if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
          } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY')
                .appendField(
                    Blockly.Msg[Blockly.ITERATOR_SETTINGS[kind].emptyMsg]);
          }
          // Add new inputs.
          let i = 0;
          for (; i < this.itemCount_; i++) {
            if (!this.getInput(`ADD${i}`)) {
              const input =
                  this.appendValueInput(`ADD${i}`)
                      .setAlign(Blockly.ALIGN_RIGHT);
              if (kind === 'dict') { // 字典需要检查类型
                input.setCheck('DictPair');
              }
              if (i === 0) {
                input.appendField(
                    Blockly.Msg[Blockly.ITERATOR_SETTINGS[kind].inputMsg]);
              }
            }
          }
          // Remove deleted inputs.
          while (this.getInput(`ADD${i}`)) {
            this.removeInput(`ADD${i}`);
            i++;
          }
        },
        /**
         * @param {Array} connections
         */
        connectionHandler: function(connections) {
          // Disconnect any children that don't belong.
          for (let i = 0; i < this.itemCount_; i++) {
            const connection =
                this.getInput(`ADD${i}`).connection.targetConnection;
            if (connection && connections.indexOf(connection) === -1) {
              if (kind === 'dict') {
                const key = connection.getSourceBlock().getInput('KEY');
                if (key.connection.targetConnection) {
                  key.connection
                      .targetConnection
                      .getSourceBlock()
                      .unplug(true);
                }
                const value = connection.getSourceBlock().getInput('VALUE');
                if (value.connection.targetConnection) {
                  value.connection
                      .targetConnection
                      .getSourceBlock()
                      .unplug(true);
                }
                connection.disconnect();
                connection.getSourceBlock().dispose();
              } else {
                connection.disconnect();
              }
            }
          }
          this.itemCount_ = connections.length;
          this.updateShape_();
          // Reconnect any child blocks.
          for (let i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(connections[i], this, `ADD${i}`);
            if (kind === 'dict' && !connections[i]) {
              const itemBlock = this.workspace.newBlock('dicts_pair');
              itemBlock.setDeletable(false);
              itemBlock.setMovable(false);
              itemBlock.initSvg();
              this.getInput(`ADD${i}`)
                  .connection
                  .connect(itemBlock.outputConnection);
              itemBlock.render();
            }
          }
        },
      };
    },
);
