/**
 * 创建name块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function nameBlocks(Blockly) {
  const nameConfig = {
    'message0': '%1',
    'args0': [
      {
        'type': 'field_variable',
        'name': 'VAR',
        'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
      },
    ],
    'output': null,
    'colour': 270,
    'extensions': ['contextMenu_variableSetterGetter'],
  };

  Blockly.Blocks['name'] = {
    init: function() {
      this.jsonInit(nameConfig);
      // Assign 'this' to a variable for use in the tooltip closure below
      const thisBlock = this;
      this.setTooltip(function() {
        return 'Add a name "%1".'.replace('%1',
            thisBlock.getFieldValue('VAR'));
      });
    },
  };
}
export default nameBlocks;
