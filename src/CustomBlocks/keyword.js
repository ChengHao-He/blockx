const deleteConfig = {
  'message0': 'delete %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'VALUE',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const globalConfig = {
  'message0': 'global %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'VALUE',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};
const starredConfig = {
  'message0': '* %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'VALUE',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 230,
};

const yieldConfig = {
  'message0': 'yield',
  'inputsInline': false,
  'output': null,
  'colour': 210,
};

const yieldFullConfig = {
  'message0': 'yield %1',
  'args0': [
    {'type': 'input_value', 'name': 'VALUE'},
  ],
  'inputsInline': false,
  'output': null,
  'colour': 210,
};

const yieldFromConfig = {
  'message0': 'yield from %1',
  'args0': [
    {'type': 'input_value', 'name': 'VALUE'},
  ],
  'inputsInline': false,
  'output': null,
  'colour': 210,
};

Blockly.Blocks['delete'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(deleteConfig);
    this.setTooltip(function() {
      return 'Add a number to variable "%1".';
    });
  },
};

Blockly.Blocks['global'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(globalConfig);
    this.setTooltip(function() {
      return 'Add a number to variable "%1".';
    });
  },
};

Blockly.Blocks['starred'] = {
  init: function() {
    this.setInputsInline(true);
    this.jsonInit(starredConfig);
    this.setTooltip(function() {
      return 'Add a number to variable "%1".';
    });
  },
};

Blockly.Blocks['nonlocal'] = {
  init: function() {
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockMirrorTextToBlocks.COLOR.VARIABLES);
    this.nameCount_ = 1;
    this.appendDummyInput('NONLOCAL')
        .appendField('make nonlocal', 'START_NONLOCALS');
    this.updateShape_();
  },
  updateShape_: function() {
    const input = this.getInput('NONLOCAL');
    // Update pluralization
    if (this.getField('START_NONLOCALS')) {
      this.setFieldValue(this.nameCount_ > 1 ?
        'make nonlocals' :
        'make nonlocal',
      'START_NONLOCALS',
      );
    }
    // Update fields
    let i = 0;
    for (; i < this.nameCount_; i++) {
      if (!this.getField('NAME' + i)) {
        if (i !== 0) {
          input.appendField(',').setAlign(Blockly.ALIGN_RIGHT);
        }
        input.appendField(new Blockly.FieldVariable('variable'), 'NAME' + i);
      }
    }
    // Remove deleted fields.
    while (this.getField('NAME' + i)) {
      input.removeField('NAME' + i);
      i++;
    }
    // Delete and re-add ending field
    if (this.getField('END_NONLOCALS')) {
      input.removeField('END_NONLOCALS');
    }
    input.appendField('available', 'END_NONLOCALS');
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('names', this.nameCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.nameCount_ = parseInt(xmlElement.getAttribute('names'), 10);
    this.updateShape_();
  },
};

Blockly.Blocks['yield'] = {
  init: function() {
    this.jsonInit(yieldConfig);
  }};

Blockly.Blocks['yield_full'] = {
  init: function() {
    this.jsonInit(yieldFullConfig);
  }};

Blockly.Blocks['yield_from'] = {
  init: function() {
    this.jsonInit(yieldFromConfig);
  },
};

