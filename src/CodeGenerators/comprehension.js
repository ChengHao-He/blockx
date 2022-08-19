['list_comp', 'set_comp',
  'generator_expr', 'dict_comp'].forEach(function(kind) {
  Blockly.Python[kind] = function(block) {
    // elt
    let elt;
    console.log(block);
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
      } else if (child.type === 'comprehension_if') {
        const test = Blockly.Python
            .valueToCode(child, 'TEST', Blockly.Python.ORDER_NONE) ||
                    Blockly.Python.blank;
        elements[i] = ('if ' + test);
      } else if (child.type === 'comprehension_for') {
        const target = Blockly.Python
            .valueToCode(child, 'TARGET', Blockly.Python.ORDER_NONE) ||
                    Blockly.Python.blank;
        const iterator = Blockly.Python
            .valueToCode(child, 'ITERATOR', Blockly.Python.ORDER_NONE) ||
                    Blockly.Python.blank;
        elements[i] = ('for ' + target + ' in ' + iterator);
      } else {
        elements[i] = BAD_DEFAULT;
      }
    }
    const code = Blockly.COMPREHENSION_SETTINGS[kind].start +
            elt + ' ' + elements.join(' ') +
            Blockly.COMPREHENSION_SETTINGS[kind].end;
    console.log(code);
    return [code, Blockly.Python.ORDER_ATOMIC];
  };
});
