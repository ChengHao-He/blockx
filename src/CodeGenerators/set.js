Blockly.Python['Set'] = function(block) {
  if (block.itemCount_ === 0) {
    return ['set()', Blockly.Python.ORDER_FUNCTION_CALL];
  }
  const elements = new Array(block.itemCount_);
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.Python.valueToCode(block, 'ADD' + i,
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
  }
  const code = '{' + elements.join(', ') + '}';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
