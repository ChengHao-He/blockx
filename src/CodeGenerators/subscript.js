
const slicesAppendChild = function(block, STR) {
  const str = ':' + Blockly.Python
      .valueToCode(block, STR, Blockly.Python.ORDER_MEMBER) ||
   Blockly.Python.blank;
  return str;
};
Blockly.Python['Subscript'] = function(block) {
  const value = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_MEMBER) || Blockly.Python.blank;
  const slices = new Array(block.sliceKinds_.length);
  for (let i = 0; i < block.sliceKinds_.length; i++) {
    const kind = block.sliceKinds_[i];
    if (kind.charAt(0) === 'I') {
      slices[i] = slicesAppendChild(block, 'INDEX' + i);
    } else {
      slices[i] = '';
      if (kind.charAt(1) === '1') {
        slices[i] += slicesAppendChild(block, 'SLICELOWER' + i);
      }
      slices[i] += ':';
      if (kind.charAt(2) === '1') {
        slices[i] += slicesAppendChild(block, 'SLICELOWER' + i);
      }
      if (kind.charAt(3) === '1') {
        slices[i] += slicesAppendChild(block, 'SLICELOWER' + i);
      }
    }
  }
  const code = value + '[' + slices.join(', ') + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
};
