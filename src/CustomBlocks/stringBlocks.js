/**
 * 创建string块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function stringBlocks(Blockly) {
  const stringConfig = {
    'message0': 'String %1',
    'args0': [
      {
        'type': 'field_input',
        'name': 'TEXT',
        'value': '',
      },
    ],
    'output': 'String',
    'colour': 120,
    'extensions': ['text_quotes'],
  };

  const multilineStringConfig = {
    'message0': 'multiline string %1',
    'args0': [
      {
        'type': 'field_multilinetext',
        'name': 'TEXT',
        'value': '',
      },
    ],
    'output': 'String',
    'colour': 123,
    'extensions': ['text_quotes'],
  };

  const docStringConfig = {
    'message0': 'Docstring: %1 %2',
    'args0': [
      {'type': 'input_dummy'},
      {
        'type': 'field_multilinetext',
        'name': 'TEXT',
        'value': '',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 121,
  };

  Blockly.Blocks['string'] = {
    init: function() {
      this.jsonInit(stringConfig);
      this.setTooltip(function() {
        return 'Add a string.';
      });
    },
  };

  Blockly.Blocks['multiline_string'] = {
    init: function() {
      this.jsonInit(multilineStringConfig);
      this.setTooltip(function() {
        return 'Add multiline string.';
      });
    },
  };

  Blockly.Blocks['doc_string'] = {
    init: function() {
      this.jsonInit(docStringConfig);
      this.setTooltip(function() {
        return 'Add doc string.';
      });
    },
  };
}
export default stringBlocks;
