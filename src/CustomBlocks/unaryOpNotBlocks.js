/**
 * 创建unaryOPNot块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function unaryOpNotBlocks(Blockly) {
  Blockly.UNARYOPS.forEach(function(unaryop) {
    const fullName = 'UnaryOp' + unaryop[1];
    const initBlockConfig = {
      'message0': unaryop[3] + ' %1',
      'args0': [
        {
          'type': 'input_value',
          'name': 'VALUE',
        },
      ],
      'inputsInline': false,
      'output': null,
      'colour': (unaryop[1] === 'Not' ? 345 : 190),
    };
    Blockly.Blocks[fullName] = {
      init: function() {
        this.jsonInit(initBlockConfig);
      },
    };
  });
}
export default unaryOpNotBlocks;

