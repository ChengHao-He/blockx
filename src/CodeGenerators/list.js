Blockly.Python['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.itemCount_);
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
          Blockly.Python
              .valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE) ||
          pythonBlank;
  }
  const code = '[' + elements.join(', ') + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
