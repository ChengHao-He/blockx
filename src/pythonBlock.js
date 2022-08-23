// Expr ok
pythonToBlock
    .prototype['pythonToBlockExpr'] = function(node, parent) {
      const value = node.value;
      const converted = this.convert(value, node);

      if (converted.constructor === Array) {
        return converted[0];
      } else if (this.isTopLevel(parent)) {
        return [this.convert(value, node)];
      } else {
        return pythonToBlock
            .create_block('expression', node.lineno, {}, {
              'VALUE': this.convert(value, node),
            });
      }
    };
// AnnAssign ok
pythonToBlock.prototype.getBuiltinAnnotation = function(annotation) {
  let result = false;
  if (annotation._astname === 'Name') {
    result = Sk.ffi.remapToJs(annotation.id);
  } else if (annotation._astname === 'Str') {
    result = Sk.ffi.remapToJs(annotation.s);
  }
  if (result !== false && this.strictAnnotations) {
    if (this.strictAnnotations.indexOf(result) !== -1) {
      return result;
    } else {
      return false;
    }
  } else {
    return result;
  }
};
pythonToBlock.prototype['pythonToBlockAnnAssign'] = function(node, parent) {
  const target = node.target;
  const annotation = node.annotation;
  const value = node.value;

  const values = {};
  const mutations = {'@initialized': false};
  if (value !== null) {
    values['VALUE'] = this.convert(value, node);
    mutations['@initialized'] = true;
  }
  const builtinAnnotation = this.getBuiltinAnnotation(annotation);

  if (target._astname === 'Name' && target.id.v !== Blockly
      .Python.blank && builtinAnnotation !== false) {
    mutations['@str'] = annotation._astname === 'Str';
    return pythonToBlock.create_block('AnnAssign', node.lineno, {
      'TARGET': target.id.v,
      'ANNOTATION': builtinAnnotation,
    },
    values,
    {
      'inline': 'true',
    }, mutations);
  } else {
    values['TARGET'] = this.convert(target, node);
    values['ANNOTATION'] = this.convert(annotation, node);
    return pythonToBlock
        .create_block('AnnAssignFull', node.lineno, {},
            values,
            {
              'inline': 'true',
            }, mutations);
  }
};
// Assert ok
pythonToBlock.prototype['pythonToBlockAssert'] = function(node, parent) {
  const test = node.test;
  const msg = node.msg;
  if (msg == null) {
    return pythonToBlock.create_block('assert', node.lineno, {}, {
      'TEST': this.convert(test, node),
    });
  } else {
    return pythonToBlock
        .create_block('assertFull', node.lineno, {}, {
          'TEST': this.convert(test, node),
          'MSG': this.convert(msg, node),
        });
  }
};
// Assign ok
pythonToBlock.
    prototype['pythonToBlockAssign'] = function(node, parent) {
      const targets = node.targets;
      const value = node.value;

      let values;
      const fields = {};
      const simpleTarget = (targets
          .length === 1 && targets[0]._astname === 'Name');
      if (simpleTarget) {
        values = {};
        fields['VAR'] = Sk.ffi.remapToJs(targets[0].id);
      } else {
        values = this.convertElements('TARGET', targets, node);
      }
      values['VALUE'] = this.convert(value, node);

      return pythonToBlock.create_block('assign', node.lineno, fields,
          values,
          {
            'inline': 'true',
          }, {
            '@targets': targets.length,
            '@simple': simpleTarget,
          });
    };
// Attribute AttributeFull ok
pythonToBlock.prototype['pythonToBlockAttribute'] = function(node, parent) {
  const value = node.value;
  const attr = node.attr;
  if (value._astname == 'Name') {
    return pythonToBlock.create_block('attribute', node.lineno, {
      'VALUE': Sk.ffi.remapToJs(value.id),
      'ATTR': Sk.ffi.remapToJs(attr),
    });
  } else {
    return pythonToBlock
        .create_block('attribute_full', node.lineno, {
          'ATTR': Sk.ffi.remapToJs(attr),
        }, {
          'VALUE': this.convert(value, node),
        });
  }
};
// AugAssign ok
pythonToBlock.prototype['pythonToBlockAugAssign'] = function(node, parent) {
  const target = node.target;
  const op = node.op.name;
  const value = node.value;

  const values = {'VALUE': this.convert(value, node)};
  const fields = {'OP_NAME': op};
  const simpleTarget = target._astname === 'Name';
  if (simpleTarget) {
    fields['VAR'] = Sk.ffi.remapToJs(target.id);
  } else {
    values['TARGET'] = this.convert(value, node);
  }
  const preposition = op;
  const allOptions = BINOPS_SIMPLE.indexOf(op) === -1;
  return pythonToBlock
      .create_block('AugAssign', node.lineno, fields,
          values,
          {
            'inline': 'true',
          }, {
            '@options': allOptions,
            '@simple': simpleTarget,
            '@preposition': preposition,
          });
};
// BinOp BinOpFull ok
pythonToBlock.prototype['pythonToBlockBinOp'] = function(node, parent) {
  const left = node.left;
  const op = node.op.name;
  const right = node.right;
  const blockName = (Blockly.BINOPS
      .indexOf(op) >= 0) ? 'BinOp' : 'BinOpFull';
  return pythonToBlock.create_block(blockName, node.lineno, {
    'OP': op,
  }, {
    'A': this.convert(left, node),
    'B': this.convert(right, node),
  }, {
    'inline': true,
  });
};
pythonToBlock.
    prototype['BinOpFull'] = pythonToBlock.prototype['BinOp'];
// BoolOp  ok
pythonToBlock.prototype['pythonToBlockBoolOp'] = function(node, parent) {
  const op = node.op;
  const values = node.values;
  let resultBlock = this.convert(values[0], node);
  for (let i = 1; i < values.length; i += 1) {
    resultBlock = pythonToBlock
        .create_block('BoolOp', node.lineno, {
          'OP': op.name,
        }, {
          'A': resultBlock,
          'B': this.convert(values[i], node),
        }, {
          'inline': 'true',
        });
  }
  return resultBlock;
};
// Break ok
pythonToBlock.prototype['pythonToBlockBreak'] = function(node, parent) {
  return pythonToBlock.create_block('break', node.lineno);
};
// Call ok
pythonToBlock.prototype.getAsModule = function(node) {
  if (node._astname === 'Name') {
    return Sk.ffi.remapToJs(node.id);
  } else if (node._astname === 'Attribute') {
    const origin = this.getAsModule(node.value);
    if (origin !== null) {
      return origin + '.' + Sk.ffi.remapToJs(node.attr);
    }
  } else {
    return null;
  }
};
pythonToBlock.prototype['pythonToBlockCall'] = function(node, parent) {
  const func = node.func;
  const args = node.args;
  const keywords = node.keywords;
  let signature = null;
  let isMethod = false;
  let module = null;
  let premessage = '';
  let message = '';
  let name = '';
  let caller = null;
  let colour = pythonToBlock.COLOR.FUNCTIONS;

  if (func._astname === 'Name') {
    message = name = Sk.ffi.remapToJs(func.id);
    if (name in this.FUNCTION_SIGNATURES) {
      signature = this.FUNCTION_SIGNATURES[Sk.ffi.remapToJs(func.id)];
    }
  } else if (func._astname === 'Attribute') {
    isMethod = true;
    caller = func.value;
    const potentialModule = this.getAsModule(caller);
    const attributeName = Sk.ffi.remapToJs(func.attr);
    message = '.' + attributeName;
    if (potentialModule in this.MODULE_FUNCTION_SIGNATURES) {
      signature = this
          .MODULE_FUNCTION_SIGNATURES[potentialModule][attributeName];
      module = potentialModule;
      message = name = potentialModule + message;
      isMethod = false;
    } else if (attributeName in this.METHOD_SIGNATURES) {
      signature = this.METHOD_SIGNATURES[attributeName];
      name = message;
    } else {
      name = message;
    }
  } else {
    isMethod = true;
    message = '';
    name = '';
    caller = func;
  }
  let returns = true;

  if (signature !== null && signature !== undefined) {
    if (signature.custom) {
      try {
        return signature.custom(node, parent, this);
      } catch (e) {
        console.error(e);
      }
    }
    if ('returns' in signature) {
      returns = signature.returns;
    }
    if ('message' in signature) {
      message = signature.message;
    }
    if ('premessage' in signature) {
      premessage = signature.premessage;
    }
    if ('colour' in signature) {
      colour = signature.colour;
    }
  }

  returns = returns || (parent._astname !== 'Expr');

  const argumentsNormal = {};
  const argumentsMutation = {
    '@arguments': (args !== null ? args.length : 0) +
            (keywords !== null ? keywords.length : 0),
    '@returns': returns,
    '@parameters': true,
    '@method': isMethod,
    '@name': name,
    '@message': message,
    '@premessage': premessage,
    '@colour': colour,
    '@module': module || '',
  };
  let overallI = 0;
  if (args !== null) {
    for (let i = 0; i < args.length; i += 1, overallI += 1) {
      argumentsNormal['ARG' + overallI] = this.convert(args[i], node);
      argumentsMutation['UNKNOWN_ARG:' + overallI] = null;
    }
  }
  if (keywords !== null) {
    for (let i = 0; i < keywords.length; i += 1, overallI += 1) {
      const keyword = keywords[i];
      const arg = keyword.arg;
      const value = keyword.value;
      if (arg === null) {
        argumentsNormal['ARG' + overallI] = this.convert(value, node);
        argumentsMutation['KWARGS:' + overallI] = null;
      } else {
        argumentsNormal['ARG' + overallI] = this.convert(value, node);
        argumentsMutation['KEYWORD:' + Sk.ffi.remapToJs(arg)] = null;
      }
    }
  }
  let newBlock;
  if (isMethod) {
    argumentsNormal['FUNC'] = this.convert(caller, node);
    newBlock = pythonToBlock.create_block('Call', node.lineno,
        {}, argumentsNormal, {inline: true}, argumentsMutation);
  } else {
    newBlock = pythonToBlock.create_block('Call', node.lineno, {},
        argumentsNormal, {inline: true}, argumentsMutation);
  }
  if (returns) {
    return newBlock;
  } else {
    return [newBlock];
  }
};
// ClassDef ok
pythonToBlock.prototype['pythonToBlockClassDef'] = function(node, parent) {
  const name = node.name;
  const bases = node.bases;
  const keywords = node.keywords;
  const body = node.body;
  const decoratorList = node.decorator_list;

  const values = {};
  const fields = {'NAME': Sk.ffi.remapToJs(name)};

  if (decoratorList !== null) {
    for (let i = 0; i < decoratorList.length; i++) {
      values['DECORATOR' + i] = this.convert(decoratorList[i], node);
    }
  }

  if (bases !== null) {
    for (let i = 0; i < bases.length; i++) {
      values['BASE' + i] = this.convert(bases[i], node);
    }
  }

  if (keywords !== null) {
    for (let i = 0; i < keywords.length; i++) {
      values['KEYWORDVALUE' + i] = this.convert(keywords[i].value, node);
      const arg = keywords[i].arg;
      if (arg === null) {
        fields['KEYWORDNAME' + i] = '**';
      } else {
        fields['KEYWORDNAME' + i] = Sk.ffi.remapToJs(arg);
      }
    }
  }

  return pythonToBlock
      .create_block('ClassDef', node.lineno, fields,
          values,
          {
            'inline': 'false',
          }, {
            '@decorators': (decoratorList === null ? 0 : decoratorList
                .length),
            '@bases': (bases === null ? 0 : bases.length),
            '@keywords': (keywords === null ? 0 : keywords.length),
          }, {
            'BODY': this.convertBody(body, node),
          });
};
// Comment ok
pythonToBlock.prototype['pythonToBlockComment'] = function(txt, lineno) {
  const commentText = txt.slice(1);
  return pythonToBlock.create_block('Comment', lineno, {
    'BODY': commentText,
  });
};
// Comp ok
['ListComp', 'SetComp', 'GeneratorExp', 'DictComp'].forEach(function(kind) {
  pythonToBlock.prototype['pythonToBlock' + kind] = function(node, parent) {
    switch (kind) {
      case 'ListComp': kind = 'list_comp';
        break;
      case 'SetComp': kind = 'set_comp';
        break;
      case 'GeneratorExp': kind = 'generator_expr';
        break;
      case 'DictComp': kind = 'dict_comp';
        break;
    }
    const generators = node.generators;
    const elements = {};
    if (kind === 'dict_comp') {
      const key = node.key;
      const value = node.value;
      elements['ELT'] = pythonToBlock
          .create_block('dicts_pair', node.lineno, {},
              {
                'KEY': this.convert(key, node),
                'VALUE': this.convert(value, node),
              },
              {
                'inline': 'true',
                'deletable': 'false',
                'movable': 'false',
              });
    } else {
      const elt = node.elt;
      elements['ELT'] = this.convert(elt, node);
    }
    const DEFAULT_SETTINGS = {
      'inline': 'true',
      'deletable': 'false',
      'movable': 'false',
    };
    let g = 0;
    for (let i = 0; i < generators.length; i++) {
      const target = generators[i].target;
      const iter = generators[i].iter;
      const ifs = generators[i].ifs;
      elements['GENERATOR' + g] = pythonToBlock
          .create_block('comprehension_for', node.lineno, {},
              {
                'ITERATOR': this.convert(iter, node),
                'TARGET': this.convert(target, node),
              },
              DEFAULT_SETTINGS);
      g += 1;
      if (ifs) {
        for (let j = 0; j < ifs.length; j++) {
          elements['GENERATOR' + g] = pythonToBlock
              .create_block('comprehension_if', node.lineno, {},
                  {
                    'TEST': this.convert(ifs[j], node),
                  },
                  DEFAULT_SETTINGS);
          g += 1;
        }
      }
    }

    return pythonToBlock.create_block(kind, node.lineno, {},
        elements,
        {
          'inline': 'false',
        }, {
          '@items': g,
        });
  };
});
// Compare ok
pythonToBlock.prototype['pythonToBlockCompare'] = function(node, parent) {
  const ops = node.ops;
  const left = node.left;
  const values = node.comparators;
  let resultBlock = this.convert(left, node);
  for (let i = 0; i < values.length; i += 1) {
    resultBlock = pythonToBlock
        .create_block('Compare', node.lineno, {
          'OP': ops[i].name,
        }, {
          'A': resultBlock,
          'B': this.convert(values[i], node),
        }, {
          'inline': 'true',
        });
  }
  return resultBlock;
};
// Continue ok
pythonToBlock.prototype['pythonToBlockContinue'] = function(node, parent) {
  return pythonToBlock.create_block('continue', node.lineno);
};
// Delete ok
pythonToBlock.prototype['pythonToBlockDelete'] = function(node, parent) {
  const targets = node.targets;
  return pythonToBlock.create_block('delete', node.lineno, {},
      this.convertElements('VALUE', targets, node),
      {
        'inline': 'true',
      }, {
        '@targets': targets.length,
      });
};
// Dict ok
pythonToBlock.prototype['pythonToBlockDict'] = function(node, parent) {
  const keys = node.keys;
  const values = node.values;
  if (keys === null) {
    return pythonToBlock.create_block('dicts_create_with', node.lineno, {},
        {}, {'inline': 'false'}, {'@items': 0});
  }
  const elements = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];
    elements['ADD' + i] = pythonToBlock
        .create_block('dicts_pair', node.lineno, {},
            {
              'KEY': this.convert(key, node),
              'VALUE': this.convert(value, node),
            },
            this.LOCKED_BLOCK);
  }
  return pythonToBlock.create_block('dicts_create_with', node.lineno, {},
      elements,
      {
        'inline': 'false',
      }, {
        '@items': keys.length,
      });
};
// For ForElse ok
pythonToBlock.prototype['pythonToBlockFor'] = function(node, parent) {
  const target = node.target;
  const iter = node.iter;
  const body = node.body;
  const orelse = node.orelse;
  let blockName = 'for';
  const bodies = {'BODY': this.convertBody(body, node)};
  if (orelse.length > 0) {
    blockName = 'for_else';
    bodies['ELSE'] = this.convertBody(orelse, node);
  }
  return pythonToBlock.create_block(blockName, node.lineno, {
  }, {
    'ITERATOR': this.convert(iter, node),
    'TARGET': this.convert(target, node),
  }, {}, {}, bodies);
};
pythonToBlock.
    prototype['pythonToBlockForElse'] = pythonToBlock
        .prototype['pythonToBlockFor'];
// FunctionDef ok
pythonToBlock.
    prototype.parseArg = function(arg, type, lineno, values, node) {
      const settings = {
        'movable': false,
        'deletable': false,
      };
      if (arg.annotation === null) {
        return pythonToBlock.create_block(type,
            lineno, {'NAME': Sk.ffi.remapToJs(arg.arg)}, values, settings);
      } else {
        values['TYPE'] = this.convert(arg.annotation, node);
        return pythonToBlock.create_block(type + 'Type',
            lineno, {'NAME': Sk.ffi.remapToJs(arg.arg)}, values, settings);
      }
    };
pythonToBlock.
    prototype.parseArgs = function(args, values, lineno, node) {
      const positional = args.args;
      const vararg = args.vararg;
      const kwonlyargs = args.kwonlyargs;
      const kwarg = args.kwarg;
      const defaults = args.defaults;
      const kwDefaults = args.kw_defaults;
      let totalArgs = 0;
      if (positional !== null) {
        const defaultOffset = defaults ? defaults
            .length - positional.length : 0;
        for (let i = 0; i < positional.length; i++) {
          const childValues = {};
          let type = 'FunctionParameter';
          if (defaults[defaultOffset + i]) {
            childValues['DEFAULT'] = this
                .convert(defaults[defaultOffset + i], node);
            type += 'Default';
          }
          values['PARAMETER' + totalArgs] = this
              .parseArg(positional[i], type, lineno, childValues, node);
          totalArgs += 1;
        }
      }
      if (vararg !== null) {
        values['PARAMETER' + totalArgs] = this
            .parseArg(vararg, 'FunctionParameterVararg', lineno, {}, node);
        totalArgs += 1;
      }
      if (kwonlyargs !== null) {
        for (let i = 0; i < kwonlyargs.length; i++) {
          const childValues = {};
          let type = 'FunctionParameter';
          if (kwDefaults[i]) {
            childValues['DEFAULT'] = this.convert(kwDefaults[i], node);
            type += 'Default';
          }
          values['PARAMETER' + totalArgs] = this
              .parseArg(kwonlyargs[i], type, lineno, childValues, node);
          totalArgs += 1;
        }
      }
      if (kwarg) {
        values['PARAMETER' + totalArgs] = this
            .parseArg(kwarg, 'FunctionParameterKwarg', lineno, {}, node);
        totalArgs += 1;
      }

      return totalArgs;
    };

pythonToBlock.prototype['pythonToBlockFunctionDef'] = function(node, parent) {
  const name = node.name;
  const args = node.args;
  const body = node.body;
  const decoratorList = node.decorator_list;
  const returns = node.returns;

  const values = {};

  if (decoratorList !== null) {
    for (let i = 0; i < decoratorList.length; i++) {
      values['DECORATOR' + i] = this.convert(decoratorList[i], node);
    }
  }

  let parsedArgs = 0;
  if (args !== null) {
    parsedArgs = this.parseArgs(args, values, node.lineno, node);
  }

  const hasReturn = (returns !== null &&
        (returns._astname !== 'NameConstant' || returns
            .value !== Sk.builtin.none.none$));
  if (hasReturn) {
    values['RETURNS'] = this.convert(returns, node);
  }

  return pythonToBlock.create_block('FunctionDef', node.lineno, {
    'NAME': Sk.ffi.remapToJs(name),
  },
  values,
  {
    'inline': 'false',
  }, {
    '@decorators': (decoratorList === null ? 0 : decoratorList.length),
    '@parameters': parsedArgs,
    '@returns': hasReturn,
  }, {
    'BODY': this.convertBody(body, node),
  });
};
pythonToBlock.prototype.FUNCTION_SIGNATURES = {
  'abs': {
    'returns': true,
    'full': ['x'], 'colour': pythonToBlock.COLOR.MATH,
  },
  'all': {returns: true, colour: pythonToBlock.COLOR.LOGIC},
  'any': {returns: true, colour: pythonToBlock.COLOR.LOGIC},
  'ascii': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'bin': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'bool': {returns: true, colour: pythonToBlock.COLOR.LOGIC,
    simple: ['x']},
  'breakpoint': {returns: false, colour: pythonToBlock.COLOR.PYTHON},
  'bytearray': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'bytes': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'callable': {returns: true, colour: pythonToBlock.COLOR.LOGIC},
  'chr': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'classmethod': {returns: true, colour: pythonToBlock.COLOR.OO},
  'compile': {returns: false, colour: pythonToBlock.COLOR.PYTHON},
  'complex': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'delattr': {returns: false, colour: pythonToBlock.COLOR.VARIABLES},
  'dict': {returns: true, colour: pythonToBlock.COLOR.DICTIONARY},
  'dir': {returns: true, colour: pythonToBlock.COLOR.PYTHON},
  'divmod': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'enumerate': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'eval': {returns: true, colour: pythonToBlock.COLOR.PYTHON},
  'exec': {returns: false, colour: pythonToBlock.COLOR.PYTHON},
  'filter': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'float': {returns: true, colour: pythonToBlock.COLOR.MATH,
    simple: ['x']},
  'format': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'frozenset': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'getattr': {returns: true, colour: pythonToBlock.COLOR.OO},
  'globals': {returns: true, colour: pythonToBlock.COLOR.VARIABLES},
  'hasattr': {returns: true, colour: pythonToBlock.COLOR.OO},
  'hash': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'help': {returns: true, colour: pythonToBlock.COLOR.PYTHON},
  'hex': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'id': {returns: true, colour: pythonToBlock.COLOR.PYTHON},
  'Image': {custom: pythonToBlock.Image},
  'input': {returns: true, colour: pythonToBlock.COLOR.FILE,
    simple: ['prompt']},
  'int': {returns: true, colour: pythonToBlock.COLOR.MATH,
    simple: ['x']},
  'isinstance': {returns: true, colour: pythonToBlock.COLOR.LOGIC},
  'issubclass': {returns: true, colour: pythonToBlock.COLOR.LOGIC},
  'iter': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'len': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'list': {returns: true, colour: pythonToBlock.COLOR.LIST},
  'locals': {returns: true, colour: pythonToBlock.COLOR.VARIABLES},
  'map': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'max': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'memoryview': {returns: true, colour: pythonToBlock.COLOR.PYTHON},
  'min': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'next': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'object': {returns: true, colour: pythonToBlock.COLOR.OO},
  'oct': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'open': {returns: true, colour: pythonToBlock.COLOR.FILE},
  'ord': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'pow': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'print': {returns: false, colour: pythonToBlock.COLOR.FILE,
    simple: ['message'], full: ['*messages', 'sep', 'end', 'file', 'flush']},
  'property': {returns: true, colour: pythonToBlock.COLOR.OO},
  'range': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES,
    simple: ['stop'], full: ['start', 'stop', 'step']},
  'repr': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'reversed': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'round': {returns: true, colour: pythonToBlock.COLOR.MATH,
    full: ['x', 'ndigits'],
    simple: ['x']},
  'set': {returns: true, colour: pythonToBlock.COLOR.SET},
  'setattr': {
    'returns': false,
    'full': ['object', 'name',
      'value'], 'colour': pythonToBlock.COLOR.OO,
  },
  'slice': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'sorted': {
    'full': ['iterable', '*', '**key', '**reverse'],
    'simple': ['iterable'],
    'returns': true,
    'colour': pythonToBlock.COLOR.SEQUENCES,
  },
  'staticmethod': {returns: true, colour: pythonToBlock.COLOR.OO},
  'str': {returns: true, colour: pythonToBlock.COLOR.TEXT,
    simple: ['x']},
  'sum': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'super': {returns: true, colour: pythonToBlock.COLOR.OO},
  'tuple': {returns: true, colour: pythonToBlock.COLOR.TUPLE},
  'type': {returns: true, colour: pythonToBlock.COLOR.OO},
  'vars': {returns: true, colour: pythonToBlock.COLOR.VARIABLES},
  'zip': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  '__import__': {returns: false, colour: pythonToBlock.COLOR.PYTHON},


};

pythonToBlock.prototype.METHOD_SIGNATURES = {
  'conjugate': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'trunc': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'floor': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'ceil': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'bit_length': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'to_bytes': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'from_bytes': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'as_integer_ratio': {returns: true,
    colour: pythonToBlock.COLOR.MATH},
  'is_integer': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'hex': {returns: true, colour: pythonToBlock.COLOR.MATH},
  'fromhex': {returns: true, colour: pythonToBlock.COLOR.MATH},
  '__iter__': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  '__next__': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'index': {returns: true, colour: pythonToBlock.COLOR.LIST},
  'count': {returns: true, colour: pythonToBlock.COLOR.LIST},
  'append': {
    'returns': false,
    'full': ['x'],
    'message': 'append',
    'premessage': 'to list', 'colour': pythonToBlock.COLOR.LIST,
  },
  'clear': {returns: false, colour: pythonToBlock.COLOR.SEQUENCES},
  'copy': {returns: true, colour: pythonToBlock.COLOR.LIST},
  'extend': {returns: false, colour: pythonToBlock.COLOR.LIST},
  'insert': {returns: false, colour: pythonToBlock.COLOR.LIST},
  'pop': {returns: true, colour: pythonToBlock.COLOR.SEQUENCES},
  'remove': {returns: false, colour: pythonToBlock.COLOR.SEQUENCES},
  'reverse': {returns: false, colour: pythonToBlock.COLOR.LIST},
  'sort': {returns: false, colour: pythonToBlock.COLOR.LIST},
  'capitalize': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'casefold': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'center': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'encode': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'endswith': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'expandtabs': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'find': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'format': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'format_map': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isalnum': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isalpha': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isascii': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isdecimal': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isdigit': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isidentifier': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'islower': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isnumeric': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isprintable': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isspace': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'istitle': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'isupper': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'join': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'ljust': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'lower': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'lstrip': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'maketrans': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'partition': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'replace': {
    'returns': true,
    'full': ['old', 'new', 'count'],
    'simple': ['old', 'new'], 'colour': pythonToBlock.COLOR.TEXT,
  },
  'rfind': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'rindex': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'rjust': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'rpartition': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'rsplit': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'rstrip': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'split': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'splitlines': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'startswith': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'strip': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'swapcase': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'title': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'translate': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'upper': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'zfill': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  'decode': {returns: true, colour: pythonToBlock.COLOR.TEXT},
  '__eq__': {returns: true, colour: pythonToBlock.COLOR.LOGIC},
  'tobytes': {returns: true, colour: pythonToBlock.COLOR.PYTHON},
  'tolist': {returns: true, colour: pythonToBlock.COLOR.PYTHON},
  'release': {returns: false, colour: pythonToBlock.COLOR.PYTHON},
  'cast': {returns: false, colour: pythonToBlock.COLOR.PYTHON},
  'isdisjoint': {returns: true, colour: pythonToBlock.COLOR.SET},
  'issubset': {returns: true, colour: pythonToBlock.COLOR.SET},
  'issuperset': {returns: true, colour: pythonToBlock.COLOR.SET},
  'union': {returns: true, colour: pythonToBlock.COLOR.SET},
  'intersection': {returns: true, colour: pythonToBlock.COLOR.SET},
  'difference': {returns: true, colour: pythonToBlock.COLOR.SET},
  'symmetric_difference': {returns: true,
    colour: pythonToBlock.COLOR.SET},
  'update': {returns: false, colour: pythonToBlock.COLOR.SET},
  'intersection_update': {returns: false,
    colour: pythonToBlock.COLOR.SET},
  'difference_update': {returns: false,
    colour: pythonToBlock.COLOR.SET},
  'symmetric_difference_update': {returns: false,
    colour: pythonToBlock.COLOR.SET},
  'add': {returns: false, colour: pythonToBlock.COLOR.SET},
  'discard': {returns: false, colour: pythonToBlock.COLOR.SET},
  'fromkeys': {returns: true, colour: pythonToBlock.COLOR.DICTIONARY},
  'get': {returns: true, colour: pythonToBlock.COLOR.DICTIONARY},
  'items': {returns: true, colour: pythonToBlock.COLOR.DICTIONARY},
  'keys': {returns: true, colour: pythonToBlock.COLOR.DICTIONARY},
  'popitem': {returns: true, colour: pythonToBlock.COLOR.DICTIONARY},
  'setdefault': {returns: false,
    colour: pythonToBlock.COLOR.DICTIONARY},
  'values': {returns: true, colour: pythonToBlock.COLOR.DICTIONARY},
  '__enter__': {returns: true, colour: pythonToBlock.COLOR.CONTROL},
  '__exit__': {returns: true, colour: pythonToBlock.COLOR.CONTROL},
  'mro': {returns: true, colour: pythonToBlock.COLOR.OO},
  '__subclasses__': {returns: true, colour: pythonToBlock.COLOR.OO},
};

pythonToBlock.prototype.MODULE_FUNCTION_IMPORTS = {
  'plt': 'import matplotlib.pyplot as plt',
  'turtle': 'import turtle',
};

pythonToBlock.prototype.MODULE_FUNCTION_SIGNATURES = {
  'cisc108': {
    'assert_equal': {
      returns: false,
      simple: ['left', 'right'],
      message: 'assert_equal',
      colour: pythonToBlock.COLOR.PYTHON,
    },
  },
  'turtle': {},
  'plt': {
    'show': {
      returns: false,
      simple: [],
      message: 'show plot canvas',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'hist': {
      returns: false,
      simple: ['values'],
      message: 'plot histogram',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'bar': {
      returns: false,
      simple: ['xs', 'heights', '*tick_label'],
      message: 'plot bar chart',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'plot': {
      returns: false,
      simple: ['values'],
      message: 'plot line',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'boxplot': {
      returns: false,
      simple: ['values'],
      message: 'plot boxplot',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'hlines': {
      returns: false,
      simple: ['y', 'xmin', 'xmax'],
      message: 'plot horizontal line',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'vlines': {
      returns: false,
      simple: ['x', 'ymin', 'ymax'],
      message: 'plot vertical line',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'scatter': {
      returns: false,
      simple: ['xs', 'ys'],
      message: 'plot scatter',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'title': {
      returns: false,
      simple: ['label'],
      message: 'make plot\'s title',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'xlabel': {
      returns: false,
      simple: ['label'],
      message: 'make plot\'s x-axis label',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'ylabel': {
      returns: false,
      simple: ['label'],
      message: 'make plot\'s y-axis label',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'xticks': {
      returns: false,
      simple: ['xs', 'labels', '*rotation'],
      message: 'make x ticks',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
    'yticks': {
      returns: false,
      simple: ['ys', 'labels', '*rotation'],
      message: 'make y ticks',
      colour: pythonToBlock.COLOR.PLOTTING,
    },
  },
};

pythonToBlock.prototype.FUNCTION_SIGNATURES['assert_equal'] =
    pythonToBlock
        .prototype.MODULE_FUNCTION_SIGNATURES['cisc108']['assert_equal'];

/**
 * 描述
 * @date 2022-08-22
 * @param {any} name
 * @param {any} returns
 * @param {any} values
 * @param {any} message
 * @param {any} aliases
 */
function makeTurtleBlock(name, returns, values, message, aliases) {
  pythonToBlock
      .prototype.MODULE_FUNCTION_SIGNATURES['turtle'][name] = {
        'returns': returns,
        'simple': values,
        'message': message,
        'colour': pythonToBlock.COLOR.PLOTTING,
      };
  if (aliases) {
    aliases.forEach(function(alias) {
      pythonToBlock.prototype
          .MODULE_FUNCTION_SIGNATURES['turtle'][alias] =
                pythonToBlock
                    .prototype.MODULE_FUNCTION_SIGNATURES['turtle'][name];
    });
  }
}

makeTurtleBlock('forward', false, ['amount'], 'move turtle forward by', ['fd']);
makeTurtleBlock('backward', false, ['amount'],
    'move turtle backward by', ['bd']);
makeTurtleBlock('right', false, ['angle'], 'turn turtle right by', ['rt']);
makeTurtleBlock('left', false, ['angle'], 'turn turtle left by', ['lt']);
makeTurtleBlock('goto', false, ['x', 'y'],
    'move turtle to position', ['setpos', 'setposition']);
makeTurtleBlock('setx', false, ['x'], 'set turtle\'s x position to ', []);
makeTurtleBlock('sety', false, ['y'], 'set turtle\'s y position to ', []);
makeTurtleBlock('setheading', false, ['angle'],
    'set turtle\'s heading to ', ['seth']);
makeTurtleBlock('home', false, [], 'move turtle to origin ', []);
makeTurtleBlock('circle', false, ['radius'],
    'move the turtle in a circle ', []);
makeTurtleBlock('dot', false, ['size', 'color'], 'turtle draws a dot ', []);
makeTurtleBlock('stamp', true, [], 'stamp a copy of the turtle shape ', []);
makeTurtleBlock('clearstamp', false, ['stampid'], 'delete stamp with id ', []);
makeTurtleBlock('clearstamps', false, [], 'delete all stamps ', []);
makeTurtleBlock('undo', false, [], 'undo last turtle action ', []);
makeTurtleBlock('speed', true, ['x'], 'set or get turtle speed', []);
makeTurtleBlock('position', true, [], 'get turtle\'s position ', ['pos']);
makeTurtleBlock('towards', true, ['x', 'y'],
    'get the angle from the turtle to the point ', []);
makeTurtleBlock('xcor', true, [], 'get turtle\'s x position ', []);
makeTurtleBlock('ycor', true, [], 'get turtle\'s y position ', []);
makeTurtleBlock('heading', true, [], 'get turtle\'s heading ', []);
makeTurtleBlock('distance', true, ['x', 'y'],
    'get the distance from turtle\'s position to ', []);
makeTurtleBlock('degrees', false, [], 'set turtle mode to degrees', []);
makeTurtleBlock('radians', false, [], 'set turtle mode to radians', []);
makeTurtleBlock('pendown', false, [], 'pull turtle pen down ', ['pd', 'down']);
makeTurtleBlock('penup', false, [], 'pull turtle pen up ', ['pu', 'up']);
makeTurtleBlock('pensize', false, [], 'set or get the pen size ', ['width']);
makeTurtleBlock('pencolor', false, [], 'set or get the pen color ', []);
makeTurtleBlock('fillcolor', false, [], 'set or get the fill color ', []);
makeTurtleBlock('reset', false, [], 'reset drawing', []);
makeTurtleBlock('clear', false, [], 'clear drawing', []);
makeTurtleBlock('write', false, ['message'], 'write text ', []);
makeTurtleBlock('bgpic', false, ['url'], 'set background to ', []);
makeTurtleBlock('done', false, [], 'start the turtle loop ', ['mainloop']);
makeTurtleBlock('setup', false, ['width', 'height'],
    'set drawing area size ', []);
makeTurtleBlock('title', false, ['message'], 'set title of drawing area ', []);
makeTurtleBlock('bye', false, [], 'say goodbye to turtles ', []);


pythonToBlock
    .prototype.MODULE_FUNCTION_SIGNATURES['matplotlib.pyplot'] =
    pythonToBlock.prototype.MODULE_FUNCTION_SIGNATURES['plt'];

pythonToBlock.getFunctionBlock = function(name, values, module) {
  if (values === undefined) {
    values = {};
  }
  let signature;
  let method = false;
  if (module !== undefined) {
    signature = pythonToBlock
        .prototype.MODULE_FUNCTION_SIGNATURES[module][name];
  } else if (name.startsWith('.')) {
    signature = pythonToBlock
        .prototype.METHOD_SIGNATURES[name.substr(1)];
    method = true;
  } else {
    signature = pythonToBlock.prototype.FUNCTION_SIGNATURES[name];
  }
  const args = (signature.simple !== undefined ? signature.simple :
               signature.full !== undefined ? signature.full : []);
  const argumentsMutation = {
    '@arguments': args.length,
    '@returns': (signature.returns || false),
    '@parameters': true,
    '@method': method,
    '@name': module ? module+'.'+name : name,
    '@message': signature.message ? signature.message : name,
    '@premessage': signature.premessage ? signature.premessage : '',
    '@colour': signature.colour ? signature.colour : 0,
    '@module': module || '',
  };
  for (let i = 0; i < args.length; i += 1) {
    argumentsMutation['UNKNOWN_ARG:' + i] = null;
  }
  const newBlock = pythonToBlock.create_block('Call', null, {},
      values, {inline: true}, argumentsMutation);
  return pythonToBlock.xmlToString(newBlock);
};
// Global NAME0！！！！！！！！
pythonToBlock.prototype['pythonToBlockGlobal'] = function(node, parent) {
  const names = node.names;

  const fields = {};
  for (let i = 0; i < names.length; i++) {
    fields['NAME' + i] = Sk.ffi.remapToJs(names[i]);
  }
  return pythonToBlock.create_block('global', node.lineno,
      fields,
      {}, {
        'inline': 'true',
      }, {
        '@names': names.length,
      });
};
// If ok
pythonToBlock.prototype['pythonToBlockIf'] = function(node, parent) {
  const test = node.test;
  const body = node.body;
  let orelse = node.orelse;
  let hasOrelse = false;
  let elifCount = 0;
  const values = {'IF0': this.convert(test, node)};
  const statements = {'DO0': this.convertBody(body, node)};
  while (orelse !== undefined && orelse.length > 0) {
    if (orelse.length === 1) {
      if (orelse[0]._astname === 'If') {
        this.heights.shift();
        values['ELIFTEST' + elifCount] = this.convert(orelse[0].test, node);
        statements['ELIFBODY' + elifCount] = this
            .convertBody(orelse[0].body, node);
        elifCount++;
      } else {
        hasOrelse = true;
        statements['ORELSEBODY'] = this.convertBody(orelse, node);
      }
    } else {
      hasOrelse = true;
      statements['ORELSEBODY'] = this.convertBody(orelse, node);
    }
    orelse = orelse[0].orelse;
  }
  return pythonToBlock.create_block('controls_if', node.lineno, {},
      values, {}, {
        '@orelse': hasOrelse,
        '@elifs': elifCount,
      }, statements);
};
// IfExp ok
pythonToBlock.prototype['pythonToBlockIfExp'] = function(node, parent) {
  const test = node.test;
  const body = node.body;
  const orelse = node.orelse;
  return pythonToBlock.create_block('if_expr', node.lineno, {}, {
    'TEST': this.convert(test, node),
    'BODY': this.convert(body, node),
    'ORELSE': this.convert(orelse, node),
  });
};
// Import ok ImportFrom ok
pythonToBlock.prototype['pythonToBlockImport'] = function(node, parent) {
  const names = node.names;
  const fields = {};
  const mutations = {'@names': names.length};
  const regulars = [];
  let simpleName = '';
  for (let i = 0; i < names.length; i++) {
    fields['NAME' + i] = Sk.ffi.remapToJs(names[i].name);
    const isRegular = (names[i].asname === null);
    if (!isRegular) {
      fields['ASNAME' + i] = Sk.ffi.remapToJs(names[i].asname);
      simpleName = fields['ASNAME'+i];
    } else {
      simpleName = fields['NAME'+i];
    }
    regulars.push(isRegular);
  }
  mutations['regular'] = regulars;
  if (this.hiddenImports.indexOf(simpleName) !== -1) {
    return null;
  }
  if (node._astname === 'ImportFrom') {
    mutations['@from'] = true;
    fields['MODULE'] = ('.'.repeat(node.level)) + Sk.ffi.remapToJs(node.module);
  } else {
    mutations['@from'] = false;
  }
  return pythonToBlock.create_block('import', node.lineno, fields,
      {}, {'inline': true}, mutations);
};
pythonToBlock
    .prototype['pythonToBlockImportFrom'] = pythonToBlock
        .prototype['pythonToBlockImport'];
// Lambda ok
pythonToBlock.prototype['pythonToBlockLambda'] = function(node, parent) {
  const args = node.args;
  const body = node.body;
  const values = {'BODY': this.convert(body, node)};
  let parsedArgs = 0;
  if (args !== null) {
    parsedArgs = this.parseArgs(args, values, node.lineno);
  }
  return pythonToBlock.create_block('lambda', node.lineno, {},
      values,
      {
        'inline': 'false',
      }, {
        '@decorators': 0,
        '@parameters': parsedArgs,
        '@returns': false,
      });
};
// List 内置 ok
pythonToBlock.prototype['pythonToBlockList'] = function(node, parent) {
  const elts = node.elts;
  return pythonToBlock.create_block('lists_create_with', node.lineno, {},
      this.convertElements('ADD', elts, node),
      {
        'inline': elts.length > 3 ? 'false' : 'true',
      }, {
        '@items': elts.length,
      });
};
// Name ok
pythonToBlock.prototype['pythonToBlockName'] = function(node, parent) {
  const id = node.id;
  if (id.v == Blockly.Python.blank) {
    return null;
  } else {
    return pythonToBlock.create_block('name', node.lineno, {
      'VAR': id.v,
    });
  }
};
// NameConstant ok
pythonToBlock.prototype['pythonToBlockNameConstant'] = function(node, parent) {
  const value = node.value;

  if (value === Sk.builtin.none.none$) {
    return pythonToBlock
        .create_block('logic_null', node.lineno, {});
  } else if (value === Sk.builtin.bool.true$) {
    return pythonToBlock
        .create_block('logic_boolean', node.lineno, {
          'BOOL': 'TRUE',
        });
  } else if (value === Sk.builtin.bool.false$) {
    return pythonToBlock
        .create_block('logic_boolean', node.lineno, {
          'BOOL': 'FALSE',
        });
  }
};
// Nonlocal 打不出来！！！
pythonToBlock.prototype['pythonToBlockNonlocal'] = function(node, parent) {
  const names = node.names;
  const fields = {};
  for (let i = 0; i < names.length; i++) {
    fields['NAME' + i] = Sk.ffi.remapToJs(names[i]);
  }
  return pythonToBlock.create_block('Nonlocal', node.lineno,
      fields,
      {}, {
        'inline': 'true',
      }, {
        '@names': names.length,
      });
};
// Num ok
pythonToBlock.prototype['pythonToBlockNum'] = function(node, parent) {
  const n = node.n;
  return pythonToBlock.create_block('math_number', node.lineno, {
    'NUM': Sk.ffi.remapToJs(n),
  });
};
// Raise ok
pythonToBlock.prototype['pythonToBlockRaise'] = function(node, parent) {
  const exc = node.exc;
  const cause = node.cause;
  const values = {};
  let hasExc = false; let hasCause = false;
  if (exc !== null) {
    values['EXC'] = this.convert(exc, node);
    hasExc = true;
  }
  if (cause !== null) {
    values['CAUSE'] = this.convert(cause, node);
    hasCause = true;
  }
  return pythonToBlock
      .create_block('raise', node.lineno, {}, values, {}, {
        '@exc': hasExc,
        '@cause': hasCause,
      });
};
// Return ok
pythonToBlock.prototype['pythonToBlockReturn'] = function(node, parent) {
  const value = node.value;
  if (value == null) {
    return pythonToBlock.create_block('return', node.lineno);
  } else {
    return pythonToBlock
        .create_block('return_full', node.lineno, {}, {
          'VALUE': this.convert(value, node),
        });
  }
};
// Set ok
pythonToBlock.prototype['pythonToBlockSet'] = function(node, parent) {
  const elts = node.elts;
  return pythonToBlock.create_block('sets_create_with', node.lineno, {},
      this.convertElements('ADD', elts, node),
      {
        'inline': elts.length > 3 ? 'false' : 'true',
      }, {
        '@items': elts.length,
      });
};
// Starred ok
pythonToBlock.prototype['pythonToBlockStarred'] = function(node, parent) {
  const value = node.value;
  return pythonToBlock.create_block('starred', node.lineno, {}, {
    'VALUE': this.convert(value, node),
  }, {
    'inline': true,
  });
};
// Str Image删除了！
pythonToBlock.prototype.isSingleChar = function(text) {
  return text === '\n' || text === '\t';
};
pythonToBlock.prototype.isDocString = function(node, parent) {
  return (parent._astname === 'Expr' &&
        parent._parent &&
        ['FunctionDef', 'ClassDef'].indexOf(parent._parent._astname) !== -1 &&
        parent._parent.body[0] === parent);
};
pythonToBlock.prototype.isSimpleString = function(text) {
  return text.split('\n').length <= 2 && text.length <= 40;
};
pythonToBlock.prototype.dedent = function(text, levels, isDocString) {
  if (!isDocString && text.charAt(0) === '\n') {
    return text;
  }
  const split = text.split('\n');
  const indentation = '    '.repeat(levels);
  const recombined = [];
  for (let i = 0; i < split.length; i++) {
    if (split[i] === '') {
      if (i !== 0) {
        recombined.push('');
      }
    } else if (split[i].startsWith(indentation)) {
      const unindentedLine = split[i].substr(indentation.length);
      if (unindentedLine !== '' || i !== split.length - 1) {
        recombined.push(unindentedLine);
      }
    } else if (i === 0) {
      recombined.push(split[i]);
    } else {
      return text;
    }
  }
  return recombined.join('\n');
};
pythonToBlock.prototype['pythonToBlockStr'] = function(node, parent) {
  const s = node.s;
  const text = Sk.ffi.remapToJs(s);
  if (this.isSingleChar(text)) {
    return pythonToBlock
        .create_block('character', node.lineno, {'TEXT': text});
  } else if (this.isDocString(node, parent)) {
    const dedented = this.dedent(text, this.levelIndex - 1, true);
    return [pythonToBlock
        .create_block('type_doc_string', node.lineno, {'TEXT': dedented})];
  } else if (text.indexOf('\n') === -1) {
    return pythonToBlock
        .create_block('type_string', node.lineno, {'TEXT': text});
  } else {
    const dedented = this.dedent(text, this.levelIndex - 1, false);
    return pythonToBlock
        .create_block('type_multiline_string', node.lineno, {'TEXT': dedented});
  }
};
// Subscript ok
pythonToBlock.prototype.
    addSliceDim = function(slice, i, values, mutations, node) {
      const sliceKind = slice._astname;
      if (sliceKind === 'Index') {
        values['INDEX' + i] = this.convert(slice.value, node);
        mutations.push('I');
      } else if (sliceKind === 'Slice') {
        let L = '0'; let U = '0'; let S = '0';
        if (slice.lower !== null) {
          values['SLICELOWER' + i] = this.convert(slice.lower, node);
          L = '1';
        }
        if (slice.upper !== null) {
          values['SLICEUPPER' + i] = this.convert(slice.upper, node);
          U = '1';
        }
        if (slice.step !== null && !isWeirdSliceCase(slice)) {
          values['SLICESTEP' + i] = this.convert(slice.step, node);
          S = '1';
        }
        mutations.push('S' + L + U + S);
      }
    };
pythonToBlock.prototype['pythonToBlockSubscript'] = function(node, parent) {
  const value = node.value;
  const slice = node.slice;
  const values = {'VALUE': this.convert(value, node)};
  const mutations = [];
  const sliceKind = slice._astname;
  if (sliceKind === 'ExtSlice') {
    for (let i = 0; i < slice.dims.length; i += 1) {
      const dim = slice.dims[i];
      this.addSliceDim(dim, i, values, mutations, node);
    }
  } else {
    this.addSliceDim(slice, 0, values, mutations, node);
  }
  return pythonToBlock.create_block('Subscript', node.lineno, {},
      values, {'inline': 'true'}, {'arg': mutations});
};
// Try 有问题
pythonToBlock.prototype['pythonToBlockTry'] = function(node, parent) {
  const body = node.body;
  const handlers = node.handlers;
  const orelse = node.orelse;
  const finalbody = node.finalbody;
  const fields = {};
  const values = {};
  const mutations = {
    '@ORELSE': orelse !== null && orelse.length > 0,
    '@FINALBODY': finalbody !== null && finalbody.length > 0,
    '@HANDLERS': handlers.length,
  };
  const statements = {'BODY': this.convertBody(body, node)};
  if (orelse !== null) {
    statements['ORELSE'] = this.convertBody(orelse, node);
  }
  if (finalbody !== null && finalbody.length) {
    statements['FINALBODY'] = this.convertBody(finalbody, node);
  }
  const handledLevels = [];
  for (let i = 0; i < handlers.length; i++) {
    const handler = handlers[i];
    statements['HANDLER' + i] = this.convertBody(handler.body, node);
    if (handler.type === null) {
      handledLevels.push(pythonToBlock.HANDLERS_CATCH_ALL);
    } else {
      values['TYPE' + i] = this.convert(handler.type, node);
      if (handler.name === null) {
        handledLevels.push(pythonToBlock.HANDLERS_NO_AS);
      } else {
        handledLevels.push(pythonToBlock.HANDLERS_COMPLETE);
        fields['NAME' + i] = Sk.ffi.remapToJs(handler.name.id);
      }
    }
  }
  mutations['ARG'] = handledLevels;
  return pythonToBlock.create_block('try', node.lineno, fields,
      values, {}, mutations, statements);
};
// Tuple ok
pythonToBlock.prototype['pythonToBlockTuple'] = function(node, parent) {
  const elts = node.elts;
  return pythonToBlock.create_block('tuples_create_with', node.lineno, {},
      this.convertElements('ADD', elts, node),
      {
        'inline': elts.length > 4 ? 'false' : 'true',
      }, {
        '@items': elts.length,
      });
};
// UnaryOp ok
pythonToBlock.prototype['pythonToBlockUnaryOp'] = function(node, parent) {
  const op = node.op.name;
  const operand = node.operand;
  return pythonToBlock
      .create_block('UnaryOp' + op, node.lineno, {}, {
        'VALUE': this.convert(operand, node),
      }, {
        'inline': false,
      });
};
// While ok
pythonToBlock.prototype['pythonToBlockWhile'] = function(node, parent) {
  const test = node.test;
  const body = node.body;
  const orelse = node.orelse;
  const values = {'BOOL': this.convert(test, node)};
  const statements = {'DO': this.convertBody(body, node)};
  let hasOrelse = false;
  if (orelse !== null && orelse.length > 0) {
    statements['ELSE'] = this.convertBody(orelse, node);
    hasOrelse = true;
  }
  return pythonToBlock.create_block('while', node.lineno, {},
      values, {}, {
        '@orelse': hasOrelse,
      }, statements);
};
// With ok
pythonToBlock.prototype['pythonToBlockWith'] = function(node, parent) {
  const items = node.items;
  const body = node.body;
  const values = {};
  const mutations = {'@items': items.length};
  const renamedItems = [];
  for (let i = 0; i < items.length; i++) {
    const hasRename = items[i].optional_vars;
    renamedItems.push(hasRename);
    const innerValues = {'CONTEXT': this.convert(items[i].context_expr, node)};
    if (hasRename) {
      innerValues['AS'] = this.convert(items[i].optional_vars, node);
      values['ITEM'+i] = pythonToBlock
          .create_block('with_item_as', node.lineno,
              {}, innerValues, this.LOCKED_BLOCK);
    } else {
      values['ITEM'+i] = pythonToBlock
          .create_block('with_item', node.lineno,
              {}, innerValues, this.LOCKED_BLOCK);
    }
  }
  mutations['as'] = renamedItems;
  return pythonToBlock.create_block('with', node.lineno, {},
      values,
      {
        'inline': 'false',
      }, mutations, {
        'BODY': this.convertBody(body, node),
      });
};
// Yield ok
pythonToBlock.prototype['pythonToBlockYield'] = function(node, parent) {
  const value = node.value;
  if (value == null) {
    return pythonToBlock
        .create_block('yield', node.lineno);
  } else {
    return pythonToBlock
        .create_block('yield_full', node.lineno, {}, {
          'VALUE': this.convert(value, node),
        });
  }
};
// YieldFrom ok
pythonToBlock.prototype['pythonToBlockYieldFrom'] = function(node, parent) {
  const value = node.value;
  return pythonToBlock
      .create_block('yield_from', node.lineno, {}, {
        'VALUE': this.convert(value, node),
      });
};
