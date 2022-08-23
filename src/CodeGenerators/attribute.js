/**
<<<<<<< HEAD
<<<<<<< HEAD
 * attribute块的代码生成器
 * @date 2022-08-23
 * @param {*} Blockly
=======
 * 创建attribute块
 * @date 2022-08-23
 * @param {any} Blockly
>>>>>>> a98308b (feature: Import attribute block. Closes #186)
=======
 * attribute块的代码生成器
 * @date 2022-08-23
 * @param {*} Blockly
>>>>>>> 0f76589 (refactor: Refactor BlockX--stage 1. Closes #187)
 */
function attributeGenerate(Blockly) {
  Blockly.Python['attribute'] = function(block) {
  // Text value.
    const value = Blockly.Python.variableDB_
        .getName(block.getFieldValue('VALUE'), Blockly.Variables.NAME_TYPE);
    const attr = block.getFieldValue('ATTR');
    const code = value + '.' + attr;
    return [code, Blockly.Python.ORDER_MEMBER];
  };
  Blockly.Python['attribute_full'] = function(block) {
  // Text value.
    const value = Blockly.Python
        .valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
    const attr = block.getFieldValue('ATTR');
    const code = value + '.' + attr;
    return [code, Blockly.Python.ORDER_MEMBER];
  };
};
export default attributeGenerate;
