// TODO: what if a user deletes a parameter through the context menu?

// The mutator container
const functionHeaderMutatorConfig = {
  'message0': 'Setup parameters below: %1 %2 returns %3',
  'args0': [
    {'type': 'input_dummy'},
    {'type': 'input_statement', 'name': 'STACK', 'align': 'RIGHT'},
    {'type': 'field_checkbox',
      'name': 'RETURNS', 'checked': true, 'align': 'RIGHT'},
  ],
  'colour': 210,
  'enableContextMenu': false,

};
Blockly.Blocks['function_headerMutator'] = {
  init: function() {
    this.jsonInit(functionHeaderMutatorConfig);
  }};

/**
 * FunctionMutant
 */
const functionMutantParameterConfig = {
  'message0': 'Parameter',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameter'] = {
  init: function() {
    this.jsonInit(functionMutantParameterConfig);
  }};

const functionMutantParameterTypeConfig = {
  'message0': 'Parameter with type',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameterType'] = {
  init: function() {
    this.jsonInit(functionMutantParameterTypeConfig);
  }};

const functionMutantParameterDefaultConfig = {
  'message0': 'Parameter with default value',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameterDefault'] = {
  init: function() {
    this.jsonInit(functionMutantParameterDefaultConfig);
  }};
const functionMutantParameterDefaultTypeConfig = {
  'message0': 'Parameter with type and default value',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameterDefaultType'] = {
  init: function() {
    this.jsonInit(functionMutantParameterDefaultTypeConfig);
  }};
const functionMutantParameterVarargConfig = {
  'message0': 'Variable length parameter',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameterVararg'] = {
  init: function() {
    this.jsonInit(functionMutantParameterVarargConfig);
  }};
const functionMutantParameterVarargTypeConfig = {
  'message0': 'Variable length parameter with type',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameterVarargType'] = {
  init: function() {
    this.jsonInit(functionMutantParameterVarargTypeConfig);
  }};
const functionMutantParameterKwargConfig = {
  'message0': 'Keyworded Variable length parameter',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameterKwarg'] = {
  init: function() {
    this.jsonInit(functionMutantParameterKwargConfig);
  }};
const functionMutantParameterKwargTypeConfig = {
  'message0': 'Keyworded Variable length parameter with type',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 210,
  'enableContextMenu': false,
};
Blockly.Blocks['functionMutant_parameterKwargType'] = {
  init: function() {
    this.jsonInit(functionMutantParameterKwargTypeConfig);
  }};

/**
 * Function--realParameterBlock
 */
const functionParameterConfig = {
  'output': 'Parameter',
  'message0': '%1',
  'args0': [{'type': 'field_variable', 'name': 'NAME', 'variable': 'param'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': (parameterTyped && parameterDefault),
};
Blockly.Blocks['function_parameter'] = {
  init: function() {
    this.jsonInit(functionParameterConfig);
  }};
const functionParameterTypeConfig = {
  'output': 'ParameterType',
  'message0': '%1 : %2',
  'args0': [
    {'type': 'field_variable', 'name': 'NAME', 'variable': 'param'},
    {'type': 'input_value', 'name': 'TYPE'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': false,
};
Blockly.Blocks['function_parameterType'] = {
  init: function() {
    this.jsonInit(functionParameterTypeConfig);
  }};

const functionParameterDefaultConfig = {
  'output': 'ParameterType',
  'message0': '%1 = %2',
  'args0': [
    {'type': 'field_variable', 'name': 'NAME', 'variable': 'param'},
    {'type': 'input_value', 'name': 'DEFAULT'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': false,
};
Blockly.Blocks['function_parameterDefault'] = {
  init: function() {
    this.jsonInit(functionParameterDefaultConfig);
  }};

const functionParameterDefaultTypeConfig = {
  'output': 'ParameterType',
  'message0': '%1 : %2 = %3',
  'args0': [
    {'type': 'field_variable', 'name': 'NAME', 'variable': 'param'},
    {'type': 'input_value', 'name': 'TYPE'},
    {'type': 'input_value', 'name': 'DEFAULT'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': true,
};
Blockly.Blocks['function_parameterDefaultType'] = {
  init: function() {
    this.jsonInit(functionParameterDefaultTypeConfig);
  }};

const functionParameterVarargConfig = {
  'output': 'ParameterType',
  'message0': '* %1',
  'args0': [{'type': 'field_variable', 'name': 'NAME', 'variable': 'param'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': false,
};
Blockly.Blocks['function_parameterVararg'] = {
  init: function() {
    this.jsonInit(functionParameterVarargConfig);
  }};


const functionParameterVarargTypeConfig = {
  'output': 'ParameterType',
  'message0': '* %1 : %2',
  'args0': [
    {'type': 'field_variable', 'name': 'NAME', 'variable': 'param'},
    {'type': 'input_value', 'name': 'TYPE'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': false,
};
Blockly.Blocks['function_parameterVarargType'] = {
  init: function() {
    this.jsonInit(functionParameterVarargTypeConfig);
  }};

const functionParameterKwargConfig = {
  'output': 'ParameterType',
  'message0': '** %1',
  'args0': [{'type': 'field_variable', 'name': 'NAME', 'variable': 'param'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': false,
};
Blockly.Blocks['function_parameterKwarg'] = {
  init: function() {
    this.jsonInit(functionParameterKwargConfig);
  }};
const functionParameterKwargTypeConfig = {
  'output': 'ParameterType',
  'message0': '** %1 : %2',
  'args0': [
    {'type': 'field_variable', 'name': 'NAME', 'variable': 'param'},
    {'type': 'input_value', 'name': 'TYPE'}],
  'colour': 210,
  'enableContextMenu': false,
  'inputsInline': false,
};
Blockly.Blocks['function_parameterKwargType'] = {
  init: function() {
    this.jsonInit(functionParameterKwargTypeConfig);
  }};


Blockly.Blocks['function_def'] = {
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
    this.setColour(BlockMirrorTextToBlocks.COLOR.FUNCTIONS);
    this.updateShape_();
    this.setMutator(new Blockly.Mutator(['functionMutant_parameter',
      'functionMutant_parameterType']));
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
      for (let i = 0; i < block[countVariable]; i++) {
        if (!block.getInput(childTypeName + i)) {
          const input =
          block.appendValueInput(childTypeName +
            i).setCheck(inputCheck).setAlign(Blockly.ALIGN_RIGHT);
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
    const containerBlock = workspace.newBlock('function_headerMutator');
    containerBlock.initSvg();

    // Check/uncheck the allow statement box.
    if (this.getInput('RETURNS')) {
      containerBlock.setFieldValue(
              this.hasReturn_ ? 'TRUE' : 'FALSE', 'RETURNS');
    } else {
    // TODO: set up 'canReturns' for lambda mode
    //  containerBlock.getField('RETURNS').setVisible(false);
    }

    // Set up parameters
    let connection = containerBlock.getInput('STACK').connection;
    const parameters = [];
    for (let i = 0; i < this.parametersCount_; i++) {
      const parameter = this.getInput('PARAMETER' + i).connection;
      const sourceType = parameter.targetConnection.getSourceBlock().type;
      const createName =
      'functionMutant' + sourceType.substring('function'.length);
      const itemBlock = workspace.newBlock(createName);
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
      parameters.push(itemBlock);
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
      if (connection && connections.indexOf(connection) === -1) {
        // Disconnect all children of this block
        const connectedBlock = connection.getSourceBlock();
        for (let j = 0; j < connectedBlock.inputList.length; j++) {
          const field = connectedBlock.inputList[j].connection;
          if (field && field.targetConnection) {
            field.targetConnection.getSourceBlock().unplug(true);
          }
        }
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
        const createName = 'function' +
        blockTypes[i].substring('functionMutant'.length);
        const itemBlock = this.workspace.newBlock(createName);
        itemBlock.setDeletable(false);
        itemBlock.setMovable(false);
        itemBlock.initSvg();
        this.getInput('PARAMETER' + i).
            connection.connect(itemBlock.outputConnection);
        itemBlock.render();
        // this.get(itemBlock, 'ADD'+i)
      }
    }
    // Show/hide the returns annotation
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

