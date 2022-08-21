const subscriptConfig = {
  'message0': '%1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'VALUE',
      'check': null,
    },
  ],
  'output': true,
  'inputsInline': true,
  'colour': 15,
};
Blockly.Blocks['Subscript'] = {
  init: function() {
    this.jsonInit(subscriptConfig);
    this.sliceKinds_ = ['I'];
    this.appendDummyInput('OPEN_BRACKET')
        .appendField('[');
    this.appendDummyInput('CLOSE_BRACKET')
        .appendField(']');
    this.updateShape_();
  },
  setExistence: function(label, exist, isDummy) {
    if (exist && !this.getInput(label)) {
      if (isDummy) {
        return this.appendDummyInput(label);
      } else {
        return this.appendValueInput(label);
      }
    } else if (!exist && this.getInput(label)) {
      this.removeInput(label);
    }
    return null;
  },
  createSlice_: function(i, kind) {
    // ,
    let input = this.setExistence('COMMA' + i, i !== 0, true);
    if (input) {
      input.appendField(',');
    }
    // Single index
    const isIndex = (kind.charAt(0) === 'I');
    this.setExistence('INDEX' + i, isIndex, false);
    // First index
    this.setExistence('SLICELOWER' + i, !isIndex &&
    '1' === kind.charAt(1), false);
    // First colon
    input = this.setExistence('SLICECOLON' + i, !isIndex, true);
    if (input) {
      input.appendField(':').setAlign(Blockly.ALIGN_RIGHT);
    }
    // Second index
    this.setExistence('SLICEUPPER' + i,
        !isIndex && '1' === kind.charAt(2), false);
    // Second colon and third index
    input = this.setExistence('SLICESTEP' + i,
        !isIndex && '1' === kind.charAt(3), false);
    if (input) {
      input.appendField(':').setAlign(Blockly.ALIGN_RIGHT);
    }
  },
  runMoveInputBefore: function(kind, j) {
    if (kind.charAt(0) === 'I') {
      this.moveInputBefore('INDEX' + j, 'CLOSE_BRACKET');
    } else {
      if (kind.charAt(1) === '1') {
        this.moveInputBefore('SLICELOWER' + j, 'CLOSE_BRACKET');
      }
      this.moveInputBefore('SLICECOLON' + j, 'CLOSE_BRACKET');
      if (kind.charAt(2) === '1') {
        this.moveInputBefore('SLICEUPPER' + j, 'CLOSE_BRACKET');
      }
      if (kind.charAt(3) === '1') {
        this.moveInputBefore('SLICESTEP' + j, 'CLOSE_BRACKET');
      }
    }
  },
  updateShape_: function() {
    // Add new inputs.
    let i = 0;
    for (; i < this.sliceKinds_.length; i++) {
      this.createSlice_(i, this.sliceKinds_[i]);
    }

    for (let j = 0; j < i; j++) {
      if (j !== 0) {
        this.moveInputBefore('COMMA' + j, 'CLOSE_BRACKET');
      }
      const kind = this.sliceKinds_[j];
      this.runMoveInputBefore(kind, j);
    }

    // Remove deleted inputs.
    while (this.getInput('TARGET' + i) || this.getInput('SLICECOLON')) {
      this.removeInput('COMMA'+i, true);
      if (this.getInput('INDEX' + i)) {
        this.removeInput('INDEX' + i);
      } else {
        this.removeInput('SLICELOWER' + i, true);
        this.removeInput('SLICECOLON' + i, true);
        this.removeInput('SLICEUPPER' + i, true);
        this.removeInput('SLICESTEP' + i, true);
      }
      i++;
    }
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    const container = document.createElement('mutation');
    for (const sliceKinds of this.sliceKinds_) {
      const parameter = document.createElement('arg');
      parameter.setAttribute('name', sliceKinds);
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
    this.sliceKinds_ = [];
    childNode = xmlElement.childNodes[0];
    for (let i = 0, childNode; childNode; i++) {
      childNode = xmlElement.childNodes[i];
      if (childNode.nodeName.toLowerCase() === 'arg') {
        this.sliceKinds_.push(childNode.getAttribute('name'));
      }
    }
    this.updateShape_();
  },
};

