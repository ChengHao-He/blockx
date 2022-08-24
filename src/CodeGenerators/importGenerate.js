/**
 * import块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function importGenerate(Blockly) {
  Blockly.Python.imported_ = Object.create(null);
  Blockly.Python['import'] = function(block) {
  // Optional from part
    let from = '';
    if (this.from_) {
      const moduleName = block.getFieldValue('MODULE');
      from = 'from ' + moduleName + ' ';
      Blockly.Python.imported_['import_' + moduleName] = moduleName;
    }
    // Create a list with any number of elements of any type.
    const elements = new Array(block.nameCount_);
    for (let i = 0; i < block.nameCount_; i++) {
      let name = block.getFieldValue('NAME' + i);
      elements[i] = name;
      if (!this.regulars_[i]) {
        name = Blockly.Python.variableDB_
            .getName(block.getFieldValue('ASNAME' + i),
                Blockly.Variables.NAME_TYPE);
        elements[i] += ' as ' + name;
      }
      if (!from) {
        Blockly.Python.imported_['import_' + name] = name;
      }
    }
    return from + 'import ' + elements.join(', ') + '\n';
  };
}
export default importGenerate;
