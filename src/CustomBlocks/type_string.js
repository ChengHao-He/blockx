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

Blockly.Blocks['type_string'] = {
  init: function() {
    this.jsonInit(stringConfig);
    this.setTooltip(function() {
      return 'Add a string.';
    });
  },
};

Blockly.Blocks['type_multiline_string'] = {
  init: function() {
    this.jsonInit(multilineStringConfig);
    this.setTooltip(function() {
      return 'Add multiline string.';
    });
  },
};

Blockly.Blocks['type_doc_string'] = {
  init: function() {
    this.jsonInit(docStringConfig);
    this.setTooltip(function() {
      return 'Add doc string.';
    });
  },
};


// 代码生成器
Blockly.Python['type_string'] = function(block) {
  // Text value
  let code = Blockly.Python.quote_(block.getFieldValue('TEXT'));
  code = code.replace('\n', 'n');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
