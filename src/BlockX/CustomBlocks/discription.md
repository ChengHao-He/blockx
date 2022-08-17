## 代码格式：
本文件夹(`CustomBlocks`)中所有`.js`文件代码格式规范示例：
```javascript
// 1. 块基本配置信息
const intNumberConfig = {
  'message0': 'int: %1',
  'args0': [
    {
      'type': 'field_number',
      'name': 'NUM',
      'value': 0,
      'precision': 1,
    },
  ],
  'output': 'Number',
  'colour': 190,
};

// 2. 块初始化以及部分扩展定义
Blockly.Blocks['int_number'] = {
  init: function() {
    this.jsonInit(intNumberConfig);
    // Assign 'this' to a variable for use in the tooltip closure below.
    const thisBlock = this;
    this.setTooltip(function() {
      return 'Add a int number "%1".'.replace('%1',
          thisBlock.getFieldValue('NUM'));
    });
  },
};

// 3. 代码生成器
Blockly.Python['int_number'] = function(block) {
  var code = parseFloat(block.getFieldValue('NUM'));
  var order;
  if (code == Infinity) {
    code = 'float("inf")';
    order = Blockly.Python.ORDER_FUNCTION_CALL;
  } else if (code == -Infinity) {
    code = '-float("inf")';
    order = Blockly.Python.ORDER_UNARY_SIGN;
  } else {
    order = code < 0 ? Blockly.Python.ORDER_UNARY_SIGN :
            Blockly.Python.ORDER_ATOMIC;
  }
  return [code, order];
};
```
