const functionHeaderMutatorCofig = {
  'message0': 'Setup parameters below: %1 %2 returns %3',
  'args0': [
    {'type': 'input_dummy'},
    {'type': 'input_statement', 'name': 'STACK', 'align': 'RIGHT'},
    {'type': 'field_checkbox', 'name':
    'RETURNS', 'checked': true, 'align': 'RIGHT'},
  ],
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['FunctionHeaderMutator'] = ({
  init: function() {
    this.jsonInit(functionHeaderMutatorCofig);
  },
});

// The elements you can put into the mutator
[
  ['Parameter', 'Parameter', '', false, false],
  ['ParameterType', 'Parameter with type', '', true, false],
  ['ParameterDefault', 'Parameter with default value', '', false, true],
  ['ParameterDefaultType',
    'Parameter with type and default value', '', true, true],
  ['ParameterVararg', 'Variable length parameter', '*', false, false],
  ['ParameterVarargType',
    'Variable length parameter with type', '*', true, false],
  ['ParameterKwarg', 'Keyworded Variable length parameter', '**', false],
  ['ParameterKwargType',
    'Keyworded Variable length parameter with type', '**', true, false],
].forEach(function(parameterTypeTuple) {
  const parameterType = parameterTypeTuple[0];
  const parameterDescription = parameterTypeTuple[1];
  const parameterPrefix = parameterTypeTuple[2];
  const parameterTyped = parameterTypeTuple[3];
  const parameterDefault = parameterTypeTuple[4];
  const functionMutantConfig = {
    'message0': parameterDescription,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
    'enableContextMenu': false,
  };
  Blockly.Blocks['FunctionMutant' + parameterType] = {
    'init': function() {
      this.jsonInit(functionMutantConfig);
    },
  };

  const realParameterBlock = {
    'output': 'Parameter',
    'message0': parameterPrefix + (parameterPrefix ? ' ' : '') + '%1',
    'args0': [{'type': 'field_variable', 'name': 'NAME', 'variable': 'param'}],
    'colour': 210,
    'enableContextMenu': false,
    'inputsInline': (parameterTyped && parameterDefault),
  };
  if (parameterTyped) {
    realParameterBlock['message0'] += ' : %2';
    realParameterBlock['args0'].push({'type': 'input_value', 'name': 'TYPE'});
  }
  if (parameterDefault) {
    realParameterBlock['message0'] += ' = %' + (parameterTyped ? 3 : 2);
    realParameterBlock['args0']
        .push({'type': 'input_value', 'name': 'DEFAULT'});
  }

  Blockly.Blocks['Function' + parameterType] = {
    'init': function() {
      this.jsonInit(realParameterBlock);
    },
  };// (realParameterBlock);
  Blockly.Python['Function' + parameterType] = function(block) {
    const name = Blockly.Python.variableDB_.getName(block.getFieldValue('NAME'),
        Blockly.Variables.NAME_TYPE);
    let typed = '';
    if (parameterTyped) {
      typed = ': ' + (Blockly.Python.valueToCode(block, 'TYPE',
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank);
    }
    let defaulted = '';
    if (parameterDefault) {
      defaulted = '=' + (Blockly.Python.valueToCode(block, 'DEFAULT',
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank);
    }
    return [parameterPrefix + name +
       typed + defaulted, Blockly.Python.ORDER_ATOMIC];
  };
});
const disconnect = function(connection, connections) {
  return connection && connections.indexOf(connection) === -1;
};
const runDisconnect = function(connectedBlock) {
  for (const coInputList of connectedBlock.inputList) {
    const field = coInputList.connection;
    if (field && field.targetConnection) {
      field.targetConnection.getSourceBlock().unplug(true);
    }
  }
};
Blockly.Blocks['FunctionDef'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('define')
        .appendField(new Blockly.FieldTextInput('function'), 'NAME');
    this.decoratorsCount_ = 0;
    this.parametersCount_ = 0;
    this.hasReturn_ = false;
    this.mutatorComplexity_ = 0;
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.updateShape_();
    this.setMutator(new Blockly.Mutator(['FunctionMutantParameter',
      'FunctionMutantParameterType']));
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('decorators', this.decoratorsCount_);
    container.setAttribute('parameters', this.parametersCount_);
    container.setAttribute('returns', this.hasReturn_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.decoratorsCount_ = parseInt(xmlElement.getAttribute('decorators'), 10);
    this.parametersCount_ = parseInt(xmlElement.getAttribute('parameters'), 10);
    this.hasReturn_ = 'true' === xmlElement.getAttribute('returns');
    this.updateShape_();
  },
  setReturnAnnotation_: function(status) {
    const currentReturn = this.getInput('RETURNS');
    if (status) {
      if (!currentReturn) {
        this.appendValueInput('RETURNS')
            .setCheck(null)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('returns');
      }
      this.moveInputBefore('RETURNS', 'BODY');
    } else if (!status && currentReturn) {
      this.removeInput('RETURNS');
    }
    this.hasReturn_ = status;
  },
  updateShape_: function() {
    // Set up decorators and parameters
    const block = this;
    [
      ['DECORATOR', 'decoratorsCount_', null, 'decorated by'],
      ['PARAMETER', 'parametersCount_', 'Parameter', 'parameters:'],
    ].forEach(function(childTypeTuple) {
      const childTypeName = childTypeTuple[0];
      const countVariable = childTypeTuple[1];
      const inputCheck = childTypeTuple[2];
      const childTypeMessage = childTypeTuple[3];
      let i = 0;
      for (; i < block[countVariable]; i++) {
        if (!block.getInput(childTypeName + i)) {
          const input = block.appendValueInput(childTypeName + i)
              .setCheck(inputCheck)
              .setAlign(Blockly.ALIGN_RIGHT);
          if (i === 0) {
            input.appendField(childTypeMessage);
          }
        }
        block.moveInputBefore(childTypeName + i, 'BODY');
      }
      // Remove deleted inputs.
      while (block.getInput(childTypeName + i)) {
        block.removeInput(childTypeName + i);
        i++;
      }
    });
    // Set up optional Returns annotation
    this.setReturnAnnotation_(this.hasReturn_);
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    const containerBlock = workspace.newBlock('FunctionHeaderMutator');
    containerBlock.initSvg();

    // Check/uncheck the allow statement box.
    if (this.getInput('RETURNS')) {
      containerBlock.setFieldValue(
              this.hasReturn_ ? 'TRUE' : 'FALSE', 'RETURNS');
    }
    // Set up parameters
    let connection = containerBlock.getInput('STACK').connection;
    for (let i = 0; i < this.parametersCount_; i++) {
      const parameter = this.getInput('PARAMETER' + i).connection;
      const sourceType = parameter.targetConnection.getSourceBlock().type;
      const createName =
      'FunctionMutant' + sourceType.substring('Function'.length);
      const itemBlock = workspace.newBlock(createName);
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * 描述
   * @date 2022-08-21
   * @param {any} containerBlock
   */
  showOrhideReturns: function(containerBlock) {
    let hasReturns = containerBlock.getFieldValue('RETURNS');
    if (hasReturns !== null) {
      hasReturns = hasReturns === 'TRUE';
      if (this.hasReturn_ != hasReturns) {
        if (hasReturns) {
          this.setReturnAnnotation_(true);
          Blockly.Mutator.reconnect(this.returnConnection_, this, 'RETURNS');
          this.returnConnection_ = null;
        } else {
          const returnConnection = this.getInput('RETURNS').connection;
          this.returnConnection_ = returnConnection.targetConnection;
          if (this.returnConnection_) {
            const returnBlock = returnConnection.targetBlock();
            returnBlock.unplug();
            returnBlock.bumpNeighbours_();
          }
          this.setReturnAnnotation_(false);
        }
      }
    }
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    const connections = [];
    const blockTypes = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      blockTypes.push(itemBlock.type);
      itemBlock = itemBlock.nextConnection &&
              itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.parametersCount_; i++) {
      const connection =
      this.getInput('PARAMETER' + i).connection.targetConnection;
      if (disconnect(connection, connections)) {
        // Disconnect all children of this block
        const connectedBlock = connection.getSourceBlock();
        runDisconnect(connectedBlock);
        connection.disconnect();
        connection.getSourceBlock().dispose();
      }
    }
    this.parametersCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (let i = 0; i < this.parametersCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'PARAMETER' + i);
      if (!connections[i]) {
        const createName =
        'Function' + blockTypes[i].substring('FunctionMutant'.length);
        itemBlock = this.workspace.newBlock(createName);
        itemBlock.setDeletable(false);
        itemBlock.setMovable(false);
        itemBlock.initSvg();
        this.getInput('PARAMETER' + i)
            .connection.connect(itemBlock.outputConnection);
        itemBlock.render();
        // this.get(itemBlock, 'ADD'+i)
      }
    }
    // Show/hide the returns annotation
    this.showOrhideReturns(containerBlock);
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
      const input = this.getInput('PARAMETER' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
              itemBlock.nextConnection.targetBlock();
    }
  },
};

