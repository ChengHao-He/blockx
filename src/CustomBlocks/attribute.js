/**
 * 创建attribute块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function attributeBlocks(Blockly) {
  const attributeConfig = {
    'message0': '%1 . %2',
    'args0': [
      {
        'type': 'field_variable',
        'name': 'VALUE',
        'variable': 'variable',
      },
      {
        'type': 'field_input',
        'name': 'ATTR',
        'text': 'attribute',
      },
    ],
    'inputsInline': true,
    'output': null,
    'colour': 240,
  };
  Blockly.Blocks['attribute'] = {
    init: function() {
      this.jsonInit(attributeConfig);
      // Assign 'this' to a variable for use in the tooltip closure below
      const that = this;
      this.setTooltip(function() {
        return `Get ${that.getFieldValue('VALUE')}'s attribute:
       ${that.getFieldValue('ATTR')}`;
      });
    },
  };

  const attributeFullConfig = {
    'lastDummyAlign0': 'RIGHT',
    'message0': '%1 . %2',
    'args0': [{
      'type': 'input_value',
      'name': 'VALUE',
    }, {
      'type': 'field_input',
      'name': 'ATTR',
      'text': 'default',
    }],
    'inputsInline': true,
    'output': null,
    'colour': 240,
  };
  Blockly.Blocks['attribute_full'] = {
    init: function() {
      this.jsonInit(attributeFullConfig);
      // Assign 'this' to a variable for use in the tooltip closure below
      const that = this;
      this.setTooltip(function() {
        return `Get ${that.getFieldValue('VALUE')}'s attribute:
       ${that.getFieldValue('ATTR')}`;
      });
    },
  };
};
export default attributeBlocks;

