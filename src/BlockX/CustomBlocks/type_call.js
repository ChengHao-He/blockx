Blockly.Blocks['Call'] = {
  /**
   * Block for calling a procedure with no return value.
   * @this Blockly.Block
   */
  init: function() {
    this.givenColour_ = 210;
    this.setInputsInline(true);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.argumentCount_ = 0;
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.showParameterNames_ = false;
    this.returns_ = true;
    this.isMethod_ = false;
    this.name_ = null;
    this.message_ = 'function';
    this.premessage_ = '';
    this.module_ = '';
    this.updateShape_();
  },

  /**
   * Returns the name of the procedure this block calls.
   * @return {string} Procedure name.
   * @this Blockly.Block
   */
  getProcedureCall: function() {
    return this.name_;
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * Also rename if it was previously null.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this Blockly.Block
   */
  renameProcedure: function(oldName, newName) {
    if (this.name_ === null ||
              Blockly.Names.equals(oldName, this.name_)) {
      this.name_ = newName;
      this.updateShape_();
    }
  },
  setProcedureParameters_: function(paramNames, paramIds) {
    const defBlock = Blockly.Procedures.getDefinition(this.getProcedureCall(),
        this.workspace);
    const mutatorOpen = defBlock && defBlock.mutator &&
              defBlock.mutator.isVisible();
    if (!mutatorOpen) {
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
    }
    if (!paramIds) {
      return false;
    }
    if (paramNames.join('\n') == this.arguments_.join('\n')) {
      this.quarkIds_ = paramIds;
      return false;
    }
    if (paramIds.length !== paramNames.length) {
      throw new Error('paramNames and paramIds must be the same length.');
    }
    this.setCollapsed(false);
    if (!this.quarkIds_) {
      this.quarkConnections_ = {};
      this.quarkIds_ = [];
    }
    const savedRendered = this.rendered;
    this.rendered = false;
    for (let i = 0; i < this.arguments_.length; i++) {
      const input = this.getInput('ARG' + i);
      if (input) {
        const connection = input.connection.targetConnection;
        this.quarkConnections_[this.quarkIds_[i]] = connection;
        if (mutatorOpen && connection &&
                      paramIds.indexOf(this.quarkIds_[i]) === -1) {
          connection.disconnect();
          connection.getSourceBlock().bumpNeighbours_();
        }
      }
    }
    this.arguments_ = [].concat(paramNames);
    this.argumentCount_ = this.arguments_.length;
    this.argumentVarModels_ = [];
    this.updateShape_();
    this.quarkIds_ = paramIds;
    if (this.quarkIds_) {
      for (let i = 0; i < this.arguments_.length; i++) {
        const quarkId = this.quarkIds_[i];
        if (quarkId in this.quarkConnections_) {
          const connection = this.quarkConnections_[quarkId];
          if (!Blockly.Mutator.reconnect(connection, this, 'ARG' + i)) {
            delete this.quarkConnections_[quarkId];
          }
        }
      }
    }
    this.rendered = savedRendered;
    if (this.rendered) {
      this.render();
    }
    return true;
  },
  /**
   * Modify this block to have the correct number of arguments.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    if (this.isMethod_ && !this.getInput('FUNC')) {
      const func = this.appendValueInput('FUNC');
      if (this.premessage_ !== '') {
        func.appendField(this.premessage_);
      }
    } else if (!this.isMethod_ && this.getInput('FUNC')) {
      this.removeInput('FUNC');
    }

    const drawnArgumentCount = this.getDrawnArgumentCount_();
    let message = this.getInput('MESSAGE_AREA');
    if (drawnArgumentCount === 0) {
      if (message) {
        message.removeField('MESSAGE');
      } else {
        message = this.appendDummyInput('MESSAGE_AREA')
            .setAlign(Blockly.ALIGN_RIGHT);
      }
      message.appendField(new Blockly.FieldLabel(this.message_ + '\ ('),
          'MESSAGE');
    } else if (message) {
      this.removeInput('MESSAGE_AREA');
    }
    let i;
    for (i = 0; i < drawnArgumentCount; i++) {
      const argument = this.arguments_[i];
      let argumentName = this.parseArgument_(argument);
      if (i === 0) {
        argumentName = this.message_ + '\ (' + argumentName;
      }
      let field = this.getField('ARGNAME' + i);
      if (field) {
        Blockly.Events.disable();
        try {
          field.setValue(argumentName);
        } finally {
          Blockly.Events.enable();
        }
      } else {
        field = new Blockly.FieldLabel(argumentName);
        this.appendValueInput('ARG' + i)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(field, 'ARGNAME' + i)
            .init();
      }
      if (argumentName) {
        field.setVisible(true);
      } else {
        field.setVisible(false);
      }
    }
    if (!this.getInput('CLOSE_PAREN')) {
      this.appendDummyInput('CLOSE_PAREN')
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(new Blockly.FieldLabel(')'));
    }
    if (drawnArgumentCount === 0) {
      if (this.isMethod_) {
        this.moveInputBefore('FUNC', 'MESSAGE_AREA');
      }
      this.moveInputBefore('MESSAGE_AREA', 'CLOSE_PAREN');
    } else {
      if (this.isMethod_) {
        this.moveInputBefore('FUNC', 'CLOSE_PAREN');
      }
    }
    for (let j = 0; j < i; j++) {
      this.moveInputBefore('ARG' + j, 'CLOSE_PAREN');
    }
    this.setReturn_(this.returns_, false);
    while (this.getInput('ARG' + i)) {
      this.removeInput('ARG' + i);
      i++;
    }

    this.setColour(this.givenColour_);
  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    const name = this.getProcedureCall();
    container.setAttribute('name', name === null ? '*' : name);
    container.setAttribute('arguments', this.argumentCount_);
    container.setAttribute('returns', this.returns_);
    container.setAttribute('parameters', this.showParameterNames_);
    container.setAttribute('method', this.isMethod_);
    container.setAttribute('message', this.message_);
    container.setAttribute('premessage', this.premessage_);
    container.setAttribute('module', this.module_);
    container.setAttribute('colour', this.givenColour_);
    for (let i = 0; i < this.arguments_.length; i++) {
      const parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
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
    this.name_ = xmlElement.getAttribute('name');
    this.name_ = this.name_ === '*' ? null : this.name_;
    this.argumentCount_ = parseInt(xmlElement.getAttribute('arguments'), 10);
    this.showParameterNames_ = 'true' === xmlElement.getAttribute('parameters');
    this.returns_ = 'true' === xmlElement.getAttribute('returns');
    this.isMethod_ = 'true' === xmlElement.getAttribute('method');
    this.message_ = xmlElement.getAttribute('message');
    this.premessage_ = xmlElement.getAttribute('premessage');
    this.module_ = xmlElement.getAttribute('module');
    this.givenColour_ = parseInt(xmlElement.getAttribute('colour'), 10);

    const args = [];
    const paramIds = [];
    for (let i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() === 'arg') {
        args.push(childNode.getAttribute('name'));
        paramIds.push(childNode.getAttribute('paramId'));
      }
    }
    const result = this.setProcedureParameters_(args, paramIds);
    if (!result) {
      this.updateShape_();
    }
    if (this.name_ !== null) {
      this.renameProcedure(this.getProcedureCall(), this.name_);
    }
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<!Blockly.VariableModel>} List of variable models.
   * @this Blockly.Block
   */
  getVarModels: function() {
    return this.argumentVarModels_;
  },
  /**
   * Add menu option to find the definition block for this call.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    if (!this.workspace.isMovable()) {
      return;
    }

    const workspace = this.workspace;
    const block = this;
    const option = {enabled: true};
    option.text = Blockly.Msg['PROCEDURES_HIGHLIGHT_DEF'];
    const name = this.getProcedureCall();
    option.callback = function() {
      const def = Blockly.Procedures.getDefinition(name, workspace);
      if (def) {
        workspace.centerOnBlock(def.id);
        def.select();
      }
    };
    options.push(option);
    options.push({
      enabled: true,
      text: 'Show/Hide parameters',
      callback: function() {
        block.showParameterNames_ = !block.showParameterNames_;
        block.updateShape_();
        block.render();
      },
    });
    options.push({
      enabled: true,
      text: this.returns_ ? 'Make statement' : 'Make expression',
      callback: function() {
        block.returns_ = !block.returns_;
        block.setReturn_(block.returns_, true);
      },
    });
  },
  setReturn_: function(returnState, forceRerender) {
    this.unplug(true);
    if (returnState) {
      this.setPreviousStatement(false);
      this.setNextStatement(false);
      this.setOutput(true);
    } else {
      this.setOutput(false);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
    if (forceRerender) {
      if (this.rendered) {
        this.render();
      }
    }
  },
  parseArgument_: function(argument) {
    if (argument.startsWith('KWARGS:')) {
      return 'unpack';
    } else if (argument.startsWith('KEYWORD:')) {
      return argument.substring(8) + '=';
    } else {
      if (this.showParameterNames_) {
        if (argument.startsWith('KNOWN_ARG:')) {
          return argument.substring(10) + '=';
        }
      }
    }
    return '';
  },
  getDrawnArgumentCount_: function() {
    return Math.min(this.argumentCount_, this.arguments_.length);
  },
};

