
Blockly.Python['Subscript'] = function(block) {
  const value = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_MEMBER) || Blockly.Python.blank;
  const slices = new Array(block.sliceKinds_.length);
  for (let i = 0; i < block.sliceKinds_.length; i++) {
    const kind = block.sliceKinds_[i];
    if (kind.charAt(0) === 'I') {
      slices[i] = Blockly.Python.valueToCode(block, 'INDEX' + i,
          Blockly.Python.ORDER_MEMBER) || Blockly.Python.blank;
    } else {
      slices[i] = '';
      if (kind.charAt(1) === '1') {
        slices[i] += Blockly.Python.valueToCode(block, 'SLICELOWER' + i,
            Blockly.Python.ORDER_MEMBER) || Blockly.Python.blank;
      }
      slices[i] += ':';
      if (kind.charAt(2) === '1') {
        slices[i] += Blockly.Python.valueToCode(block, 'SLICEUPPER' + i,
            Blockly.Python.ORDER_MEMBER) || Blockly.Python.blank;
      }
      if (kind.charAt(3) === '1') {
        slices[i] += ':' + Blockly.Python.valueToCode(block, 'SLICESTEP' + i,
            Blockly.Python.ORDER_MEMBER) || Blockly.Python.blank;
      }
    }
  }
  const code = value + '[' + slices.join(', ') + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
};
