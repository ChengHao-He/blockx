Blockly.Python['raw_block'] = function(block) {
  const code = block.getFieldValue('TEXT') + '\n';
  return code;
};

