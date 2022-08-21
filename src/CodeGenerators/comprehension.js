['list_comp', 'set_comp',
  'generator_expr', 'dict_comp'].forEach(function(kind) {
  Blockly.Python[kind] = function(block) {
    // elt
    let elt;
    if (kind === 'dict_comp') {
      const child = block.getInputTargetBlock('ELT');
      if (child === null || child.type !== 'dict_item') {
        elt = (Blockly.Python.blank + ': ' + Blockly.Python.blank);
      } else {
        const key = Blockly.Python
            .valueToCode(child, 'KEY', Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank;
        const value = Blockly.Python
            .valueToCode(child, 'VALUE', Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank;
        elt = (key + ': ' + value);
      }
    } else {
      elt = Blockly.Python
          .valueToCode(block, 'ELT', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
    }
    // generators
    const elements = new Array(block.itemCount_);
    const BAD_DEFAULT = (elt + ' for ' + Blockly.Python.blank +
        ' in' + Blockly.Python.blank);
    for (let i = 0; i < block.itemCount_; i++) {
      const child = block.getInputTargetBlock('GENERATOR' + i);
      if (child === null) {
        elements[i] = BAD_DEFAULT;
      } else {
        elements[i] = getCodeByItemType(child, BAD_DEFAULT);
      }
    }
    const code = Blockly.COMPREHENSION_SETTINGS[kind].start +
        elt + ' ' + elements.join(' ') +
        Blockly.COMPREHENSION_SETTINGS[kind].end;
    return [code, Blockly.Python.ORDER_ATOMIC];
  };
});

const getCodeByItemType = function(child, BAD_DEFAULT) {
  switch (child.type) {
    case 'comprehension_if':
      const test = Blockly.Python
          .valueToCode(child, 'TEST', Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
      return ('if ' + test);
    case 'comprehension_for':
      const target = Blockly.Python
          .valueToCode(child, 'TARGET', Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
      const iterator = Blockly.Python
          .valueToCode(child, 'ITERATOR', Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
      return ('for ' + target + ' in ' + iterator);
    default:
      return BAD_DEFAULT;
  }
};
