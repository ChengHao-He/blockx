Blockly.Python['Comment'] = function(block) {
  const textBody = block.getFieldValue('BODY');
  return '# ' + textBody + '\n';
};
