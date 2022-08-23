/**
 * iterator块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function iteratorGenerate(Blockly) {
  Blockly.Python.dicts_create_with = function(block) {
    const elements = new Array(block.itemCount_);
    for (let i = 0; i < block.itemCount_; i++) {
      const child = block.getInputTargetBlock(`ADD${ i}`);
      if (child === null || child.type !== 'dicts_pair') {
        elements[i] = (`${Blockly.Python.blank }: ${ Blockly.Python.blank}`);
        continue;
      }
      const key = Blockly.Python
          .valueToCode(child, 'KEY', Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank;
      const value = Blockly.Python
          .valueToCode(child, 'VALUE', Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank;
      elements[i] = (`${key }: ${ value}`);
    }
    const code = `{${ elements.join(', ') }}`;
    return [code, Blockly.Python.ORDER_COLLECTION];
  };

  Blockly.Python.sets_create_with = function(block) {
  // Create a set with any number of elements of any type.
    if (block.itemCount_ === 0) {
      return ['set()', Blockly.Python.ORDER_FUNCTION_CALL];
    }
    const elements = new Array(block.itemCount_);
    for (let i = 0; i < block.itemCount_; i++) {
      elements[i] = Blockly.Python.valueToCode(block, `ADD${ i}`,
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    }
    const code = `{${elements.join(', ')}}`;
    return [code, Blockly.Python.ORDER_COLLECTION];
  };

  Blockly.Python.tuples_create_with = function(block) {
  // Create a tuple with any number of elements of any type.
    const elements = new Array(block.itemCount_);
    for (let i = 0; i < block.itemCount_; i++) {
      elements[i] = Blockly.Python
          .valueToCode(block, `ADD${ i}`, Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank;
    }
    let requiredComma = '';
    if (block.itemCount_ === 1) {
      requiredComma = ', ';
    }
    const code = `(${elements.join(', ')}${requiredComma})`;
    return [code, Blockly.Python.ORDER_COLLECTION];
  };
};
export default iteratorGenerate;

