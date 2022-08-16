const stringConfig = {
  'message0': 'string: %1',
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

const charConfig = {
  'message0': 'char: %1',
  'args0': [
    {
      'type': 'field_dropdown',
      'name': 'TEXT',
      'options': [
        ['\\n', '\n'],
        ['\\t', '\t'],
      ],
    },
  ],
  'output': 'String',
  'colour': 125,
  'extensions': ['text_quotes'],
};

const multilineStringConfig = {
  'message0': 'multiline string: %1',
  'args0': [
    {'type': 'field_multilinetext',
      'name': 'TEXT',
      'value': ''},
  ],
  'output': 'String',
  'colour': 123,
  'extensions': ['text_quotes'],
};

const docStringConfig = {
  'message0': 'Doc string: %1 %2',
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
  'colour': 122,
};

Blockly.Blocks['type_string'] = {
  init: function() {
    this.jsonInit(stringConfig);
    this.setTooltip(function() {
      return 'Add a string.';
    });
  },
};

Blockly.Blocks['type_char'] = {
  init: function() {
    this.jsonInit(charConfig);
    this.setTooltip(function() {
      return 'Add a character.';
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
