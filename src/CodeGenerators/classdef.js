Blockly.Python['ClassDef'] = function(block) {
  // Name
  const name = Blockly.Python.variableDB_
      .getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  // Decorators
  const decorators = new Array(block.decorators_);
  for (let i = 0; i < block.decorators_; i++) {
    const decorator = (Blockly.Python.valueToCode(block, 'DECORATOR' + i,
        Blockly.Python.ORDER_NONE) ||Blockly.Python.blank);
    decorators[i] = '@' + decorator + '\n';
  }
  // Bases
  const bases = new Array(block.bases_);
  for (let i = 0; i < block.bases_; i++) {
    bases[i] = (Blockly.Python.valueToCode(block, 'BASE' + i,
        Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank);
  }
  // Keywords
  const keywords = new Array(block.keywords_);
  for (let i = 0; i < block.keywords_; i++) {
    const name = block.getFieldValue('KEYWORDNAME' + i);
    const value = (Blockly.Python.valueToCode(block, 'KEYWORDVALUE' + i,
        Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank);
    if (name == '**') {
      keywords[i] = '**' + value;
    } else {
      keywords[i] = name + '=' + value;
    }
  }
  // Body:
  const body = Blockly
      .Python.statementToCode(block, 'BODY') || Blockly.Python.PASS;
  // Put it together
  let args = (bases.concat(keywords));
  args = (args.length === 0) ? '' : '(' + args.join(', ') + ')';
  return decorators.join('') + 'class ' + name + args + ':\n' + body;
};
