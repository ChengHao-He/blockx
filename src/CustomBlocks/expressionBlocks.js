/**
 * 创建expression块,定义了空表达式、if表达式块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function expressionBlocks(Blockly) {
  const exprConfig = {
    'message0': 'expression %1',
    'args0': [
      {'type': 'input_value', 'name': 'VALUE'},
    ],
    'inputsInline': false,
    'previousStatement': null,
    'nextStatement': null,
    'colour': 60,
    'output': null,
  };

  Blockly.Blocks['expression'] = {
    init: function() {
      this.jsonInit(exprConfig);
    },
  };

  const ifExpConnfig = {
    'message0': '%{BKY_IF_EXPRESSION_CREATE_TITLE}',
    'args0': [
      {
        'type': 'input_value',
        'name': 'BODY',
      },
      {
        'type': 'input_value',
        'name': 'TEST',
      },
      {
        'type': 'input_value',
        'name': 'ORELSE',
      },
    ],
    'inputsInline': true,
    'output': null,
    'colour': 345,
  };
  Blockly.Blocks['if_expr'] = {
    init: function() {
      this.jsonInit(ifExpConnfig);
    },
  };
}
export default expressionBlocks;
