/**
 * Assign块的代码生成器
 * @date 2022-08-23
 * @param {*} Blockly
 */
function assignGenerate(Blockly) {
  Blockly.Python['assign'] = function(block) {
  // Create a list with any number of elements of any type.
    const value = Blockly.Python.valueToCode(block, 'VALUE',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    const targets = new Array(block.targetCount_);
    if (block.targetCount_ === 1 && block.simpleTarget_) {
      targets[0] = Blockly.Python.nameDB_
          .getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    } else {
      for (let i = 0; i < block.targetCount_; i++) {
        targets[i] = (Blockly.Python.valueToCode(block, 'TARGET' + i,
            Blockly.Python.ORDER_NONE) || Blockly.Python.blank);
      }
    }
    return targets.join(' = ') + ' = ' + value + '\n';
  };

  Blockly.Python['annotation_assign_full'] = function(block) {
  // Create a list with any number of elements of any type.
    const target = Blockly.Python.valueToCode(block, 'TARGET',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    const annotation = Blockly.Python.valueToCode(block, 'ANNOTATION',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    let value = '';
    if (this.initialized_) {
      value = ' = ' + Blockly.Python.valueToCode(block, 'VALUE',
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    }
    return target + ': ' + annotation + value + '\n';
  };

  Blockly.Python['annotation_assign'] = function(block) {
  // Create a list with any number of elements of any type.
    const target = Blockly.Python.nameDB_
        .getName(block.getFieldValue('TARGET'),
            Blockly.Variables.NAME_TYPE);
    let annotation = block.getFieldValue('ANNOTATION');
    if (block.strAnnotations_) {
      annotation = Blockly.Python.quote_(annotation);
    }
    let value = '';
    if (this.initialized_) {
      value = ' = ' + Blockly.Python.valueToCode(block, 'VALUE',
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    }
    return target + ': ' + annotation + value + '\n';
  };

  Blockly.Python['aug_assign'] = function(block) {
  // Create a list with any number of elements of any type.
    let target;
    if (block.simpleTarget_) {
      target = Blockly.Python.nameDB_.getName(block.getFieldValue('VAR'),
          Blockly.Variables.NAME_TYPE);
    } else {
      target = Blockly.Python.valueToCode(block, 'TARGET',
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    }

    const operator =
    Blockly.BINOPS_BLOCKLY_GENERATE[block.getFieldValue('OP_NAME')][0];

    const value = Blockly.Python.valueToCode(block, 'VALUE',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    return target + operator + '= ' + value + '\n';
  };
}
export default assignGenerate;
