const sliceFunctionFactory = function(type, defaultValue) {
  return function(block) {
    const linearStructure =
    Blockly.Python.valueToCode(block, type.toUpperCase(),
        Blockly.Python.ORDER_MEMBER) || defaultValue;
    const where1 = block.getFieldValue('WHERE1');
    const where2 = block.getFieldValue('WHERE2');
    let step =
        Blockly.Python.valueToCode(block, 'STEP', Blockly.Python.ORDER_NONE) ||
        null;
    let at1 = '';
    let at2 = '';
    if (step && step <= 1) {
      step = null;
    }
    switch (where1) {
      case 'FROM_START':
        at1 = Blockly.Python.getAdjustedInt(block, 'AT1');
        if (at1 === '0') {
          at1 = '';
        }
        break;
      case 'FROM_END':
        at1 = Blockly.Python.getAdjustedInt(block, 'AT1', 1, true);
        break;
      case 'FIRST':
        break;
      default:
        throw Error(`Unhandled option (${type}s_getSub${type})`);
    }
    switch (where2) {
      case 'FROM_START':
        at2 = Blockly.Python.getAdjustedInt(block, 'AT2', 1);
        break;
      case 'FROM_END':
        at2 = Blockly.Python.getAdjustedInt(block, 'AT2', 0, true);
        // Ensure that if the result calculated is 0 that sub-sequence will
        // include all elements as expected.
        if (!Blockly.isNumber(String(at2))) {
          Blockly.Python.definitions_.import_sys = 'import sys';
          at2 += ' or sys.maxsize';
        } else if (at2 === '0') {
          at2 = '';
        }
        break;
      case 'LAST':
        break;
      default:
        throw Error(`Unhandled option (${type}s_getSub${type})`);
    }
    let code = `${linearStructure}[${at1} : ${at2}]`;
    if (step) {
      code = `${linearStructure}[${at1} : ${at2} : ${step}]`;
    }
    return [code, Blockly.Python.ORDER_MEMBER];
  };
};

Blockly.Python.text_getSubstring = sliceFunctionFactory('string', '\'\'');
Blockly.Python.lists_getSublist = sliceFunctionFactory('list', '[]');
Blockly.Python.tuples_getSubtuple = sliceFunctionFactory('tuple', '()');
