/* eslint-disable max-len */
/**
 * 描述
 * @date 2022-08-19
 */
function pythonToBlock() {
  // eslint-disable-next-line no-invalid-this
  this.hiddenImports = ['plt'];
  // eslint-disable-next-line no-invalid-this
  this.strictAnnotations = ['int', 'float', 'str', 'bool'];
  Blockly.defineBlocksWithJsonArray(pythonToBlock.BLOCKS);
  Sk.configure({
    __future__: Sk.python3,
    read: function read(filename) {
      if (Sk.builtinFiles === undefined ||
        Sk.builtinFiles['files'][filename] === undefined) {
        throw new Error('File not found: \'' + filename + '\'');
      }

      return Sk.builtinFiles['files'][filename];
    },
  });
}

pythonToBlock.xmlToString = function(xml) {
  return new XMLSerializer().serializeToString(xml);
};

pythonToBlock.prototype
    .convertSourceToCodeBlock = function(pythonSource) {
      const xml = document.createElement('xml');
      xml.appendChild(pythonToBlock.raw_block(pythonSource));
      return pythonToBlock.xmlToString(xml);
    };

/**
* The main function for converting a string representation of Python
* code to the Blockly XML representation.
*
* @param {string} pythonSource - The string representation of Python
*      code (e.g., "a = 0").
* @return {Object} An object which will either have the converted
*      source code or an error message and the code as a code-block.
*/
pythonToBlock.prototype.convertSource = function(pythonSource) {
  /**
   * 描述
   * @date 2022-08-23
   * @param {any} converted
   * @param {any} xml
   * @return {any}
   */
  const xmlAppendChild=function(converted, xml) {
    if (converted !== null) {
      // eslint-disable-next-line guard-for-in
      for (const perConverted of converted) {
        xml.appendChild(perConverted);
      }
    }
    if (badChunks.length) {
      xml.appendChild(pythonToBlock.raw_block(badChunks.join('\n')));
    }
    return xml;
  };
  let xml = document.createElement('xml');
  const filename = '__main__.py';
  let parse; let ast = null;
  let error;
  let badChunks = [];
  const originalSource = pythonSource;
  this.source = pythonSource.split('\n');
  let previousLine = 1+this.source.length;
  while (ast === null) {
    if (pythonSource.trim() === '') {
      if (badChunks.length) {
        xml.appendChild(pythonToBlock
            .raw_block(badChunks.join('\n')));
      }
      return {'xml': pythonToBlock.xmlToString(xml),
        'error': null,
        'rawXml': xml};
    }
    try {
      parse = Sk.parse(filename, pythonSource);
      ast = Sk.astFromParse(parse.cst, filename, parse.flags);
    } catch (e) {
      error = e;
      if (e.traceback && e.traceback.length && e.traceback[0].lineno &&
              e.traceback[0].lineno < previousLine) {
        previousLine = e.traceback[0].lineno - 1;
        badChunks = badChunks.concat(this.source.slice(previousLine));
        this.source = this.source.slice(0, previousLine);
        pythonSource = this.source.join('\n');
      } else {
        xml.appendChild(pythonToBlock.raw_block(originalSource));
        return {'xml': pythonToBlock
            .xmlToString(xml), 'error': error, 'rawXml': xml};
      }
    }
  }
  this.comments = {};

  // eslint-disable-next-line guard-for-in
  for (const commentLocation in parse.comments) {
    const lineColumn = commentLocation.split(',');
    const yLocation = parseInt(lineColumn[0], 10);
    this.comments[yLocation] = parse.comments[commentLocation];
  }

  this.highestLineSeen = 0;
  this.levelIndex = 0;
  this.nextExpectedLine = 0;
  this.measureNode(ast);
  const converted = this.convert(ast);
  xml=xmlAppendChild(converted, xml);
  return {
    'xml': pythonToBlock.xmlToString(xml),
    'error': null,
    'lineMap': this.lineMap,
    'comments': this.comments,
    'rawXml': xml,
  };
};

pythonToBlock.prototype.recursiveMeasure = function(node, nextBlockLine) {
  if (node === undefined) {
    return;
  }
  let myNext = nextBlockLine;
  if ('orelse' in node && node.orelse.length > 0) {
    if (node.orelse.length === 1 && node.orelse[0]._astname === 'If') {
      myNext = node.orelse[0].lineno - 1;
    } else {
      myNext = node.orelse[0].lineno - 1 - 1;
    }
  }
  this.heights.push(nextBlockLine);
  let i = 0;
  if ('body' in node) {
    for (; i < node.body.length; i++) {
      let next;
      if (i + 1 === node.body.length) {
        next = myNext;
      } else {
        next = node.body[i + 1].lineno - 1;
      }
      this.recursiveMeasure(node.body[i], next);
    }
  }
  if ('orelse' in node) {
    for (const ondeOrelse of node.orelse) {
      let next;
      if (i === node.orelse.length) {
        next = nextBlockLine;
      } else {
        next = 1 + (ondeOrelse.lineno - 1);
      }
      this.recursiveMeasure(ondeOrelse, next);
    }
  }
};

pythonToBlock.prototype.measureNode = function(node) {
  this.heights = [];
  this.recursiveMeasure(node, this.source.length - 1);
  this.heights.shift();
};

pythonToBlock.prototype.getSourceCode = function(frm, to) {
  const lines = this.source.slice(frm - 1, to);
  if (lines.length > 0) {
    const indentation = lines[0].search(/\S/);
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].substring(indentation);
    }
  }
  return lines.join('\n');
};

pythonToBlock.prototype.convertBody = function(node, parent) {
  this.levelIndex += 1;
  const isTopLevel = this.isTopLevel(parent);

  const children = [];
  let root = null;
  let current = null;

  /**
   * 描述
   * @date 2022-08-22
   * @param {any} peer
   */
  function addPeer(peer) {
    if (root == null) {
      children.push(peer);
    } else {
      children.push(root);
    }
    root = peer;
    current = peer;
  }

  /**
   * 描述
   * @date 2022-08-22
   */
  function finalizePeers() {
    if (root != null) {
      children.push(root);
    }
  }

  /**
   * 描述
   * @date 2022-08-22
   * @param {any} child
   */
  function nestChild(child) {
    if (root == null) {
      root = child;
      current = child;
    } else if (current == null) {
      root = current;
    } else {
      const nextElement = document.createElement('next');
      nextElement.appendChild(child);
      current.appendChild(nextElement);
      current = child;
    }
  }

  let lineNumberInProgram;
  let previousLineInProgram = null;
  let distance;
  let skippedLine;
  let previousWasStatement = false;
  let visitedFirstLine = false;
  for (const nodeLength of node) {
    lineNumberInProgram = nodeLength.lineno;
    for (const commentLineInProgram in this.comments) {
      if (commentLineInProgram < lineNumberInProgram) {
        const commentChild = this.
            pythonToBlockComment(this
                .comments[commentLineInProgram], commentLineInProgram);
        if (previousLineInProgram == null) {
          nestChild(commentChild);
        } else {
          const skippedPreviousLine = Math
              .abs(previousLineInProgram - commentLineInProgram) > 1;
          if (isTopLevel && skippedPreviousLine) {
            addPeer(commentChild);
          } else {
            nestChild(commentChild);
          }
        }
        previousLineInProgram = commentLineInProgram;
        this.highestLineSeen = Math
            .max(this.highestLineSeen, parseInt(commentLineInProgram, 10));
        delete this.comments[commentLineInProgram];
      }
    }

    distance = lineNumberInProgram - this.highestLineSeen;
    this.highestLineSeen = Math.max(lineNumberInProgram, this.highestLineSeen);
    const height = this.heights.shift();
    const originalSourceCode = this.getSourceCode(lineNumberInProgram, height);
    const newChild = this.convertStatement(nodeLength, originalSourceCode, parent);

    if (newChild == null) {
      continue;
    }

    skippedLine = distance > 1;
    previousLineInProgram = lineNumberInProgram;
    if (isTopLevel && newChild.constructor === Array) {
      addPeer(newChild[0]);
    } else if (isTopLevel && skippedLine && visitedFirstLine) {
      addPeer(newChild);
    } else if (isTopLevel && !previousWasStatement) {
      addPeer(newChild);
    } else {
      nestChild(newChild);
    }
    previousWasStatement = newChild.constructor !== Array;

    visitedFirstLine = true;
  }

  const lastLineNumber = lineNumberInProgram + 1;
  if (lastLineNumber in this.comments) {
    const commentChild = this
        .pythonToBlockComment(this.comments[lastLineNumber], lastLineNumber);
    if (isTopLevel && !previousWasStatement) {
      addPeer(commentChild);
    } else {
      nestChild(commentChild);
    }
    delete this.comments[lastLineNumber];
  }

  if (isTopLevel) {
    // eslint-disable-next-line guard-for-in
    for (const commentLineInProgram in this.comments) {
      const commentChild = this.pythonToBlockComment(this.comments[commentLineInProgram], commentLineInProgram);
      distance = commentLineInProgram - previousLineInProgram;
      if (previousLineInProgram == null) {
        addPeer(commentChild);
      } else if (distance > 1) {
        addPeer(commentChild);
      } else {
        nestChild(commentChild);
      }
      previousLineInProgram = commentLineInProgram;
      delete this.comments[lastLineNumber];
    }
  }


  finalizePeers();

  this.levelIndex -= 1;

  return children;
};

pythonToBlock.prototype
    .TOP_LEVEL_NODES = ['Module', 'Expression', 'Interactive', 'Suite'];

pythonToBlock.prototype.isTopLevel = function(parent) {
  return !parent || this.TOP_LEVEL_NODES.indexOf(parent._astname) !== -1;
};

pythonToBlock.prototype.convert = function(node, parent) {
  const functionName = 'pythonToBlock' + node._astname;
  if (this[functionName] === undefined) {
    throw new Error('Could not find function: ' + functionName);
  }
  node._parent = parent;
  return this[functionName](node, parent);
};

/**
 * 描述
 * @date 2022-08-22
 * @param {any} array
 * @return {any}
 */
function arrayMax(array) {
  return array.reduce(function(a, b) {
    return Math.max(a, b);
  });
}

/**
 * 描述
 * @date 2022-08-22
 * @param {any} array
 * @return {any}
 */
function arrayMin(array) {
  return array.reduce(function(a, b) {
    return Math.min(a, b);
  });
}

pythonToBlock.prototype.convertStatement = function(node, _fullSource, parent) {
  try {
    return this.convert(node, parent);
  } catch (e) {
    const heights = this.getChunkHeights(node);
    const extractedSource = this.getSourceCode(arrayMin(heights), arrayMax(heights));
    console.error(e);
    return pythonToBlock.raw_block(extractedSource);
  }
};

pythonToBlock.prototype.getChunkHeights = function(node) {
  let lineNumbers = [];
  if (node.hasOwnProperty('lineno')) {
    lineNumbers.push(node.lineno);
  }
  if (node.hasOwnProperty('body')) {
    for (let i = 0; i < node.body.length; i += 1) {
      const subnode = node.body[i];
      lineNumbers = lineNumbers.concat(this.getChunkHeights(subnode));
    }
  }
  if (node.hasOwnProperty('orelse')) {
    for (const nodeOrelse of node.orelse) {
      lineNumbers = lineNumbers.concat(this.getChunkHeights(nodeOrelse));
    }
  }
  return lineNumbers;
};

pythonToBlock.create_block = function(type, lineNumber, fields, values, settings, mutations, statements) {
  const newBlock = document.createElement('block');
  newBlock.setAttribute('type', type);
  newBlock.setAttribute('line_number', lineNumber);
  // eslint-disable-next-line guard-for-in
  for (const setting in settings) {
    const settingValue = settings[setting];
    newBlock.setAttribute(setting, settingValue);
  }
  if (mutations !== undefined && Object.keys(mutations).length > 0) {
    const newMutation = document.createElement('mutation');
    // eslint-disable-next-line guard-for-in
    for (const mutation in mutations) {
      const mutationValue = mutations[mutation];
      if (mutation.charAt(0) === '@') {
        newMutation.setAttribute(mutation.substr(1), mutationValue);
      } else if (mutationValue != null && mutationValue.constructor === Array) {
        for (const perMutationValue of mutationValue) {
          const mutationNode = document.createElement(mutation);
          mutationNode.setAttribute('name', perMutationValue);
          newMutation.appendChild(mutationNode);
        }
      } else {
        const mutationNode = document.createElement('arg');
        if (mutation.charAt(0) === '!') {
          mutationNode.setAttribute('name', '');
        } else {
          mutationNode.setAttribute('name', mutation);
        }
        if (mutationValue !== null) {
          mutationNode.appendChild(mutationValue);
        }
        newMutation.appendChild(mutationNode);
      }
    }
    newBlock.appendChild(newMutation);
  }
  // eslint-disable-next-line guard-for-in
  for (const field in fields) {
    const fieldValue = fields[field];
    const newField = document.createElement('field');
    newField.setAttribute('name', field);
    newField.appendChild(document.createTextNode(fieldValue));
    newBlock.appendChild(newField);
  }
  // eslint-disable-next-line guard-for-in
  for (const value in values) {
    const valueValue = values[value];
    const newValue = document.createElement('value');
    if (valueValue !== null) {
      newValue.setAttribute('name', value);
      newValue.appendChild(valueValue);
      newBlock.appendChild(newValue);
    }
  }
  // Statements
  if (statements !== undefined && Object.keys(statements).length > 0) {
    // eslint-disable-next-line guard-for-in
    for (const statement in statements) {
      const statementValue = statements[statement];
      if (statementValue == null) {
        continue;
      } else {
        for (const perStatementValue of statementValue) {
          const newStatement = document.createElement('statement');
          newStatement.setAttribute('name', statement);
          newStatement.appendChild(perStatementValue);
          newBlock.appendChild(newStatement);
        }
      }
    }
  }
  return newBlock;
};

pythonToBlock.raw_block = function(txt) {
  return pythonToBlock.create_block('raw_block', 0, {'TEXT': txt});
};

pythonToBlock.BLOCKS = [];

pythonToBlock.prototype['pythonToBlockModule'] = function(node) {
  return this.convertBody(node.body, node);
};

pythonToBlock.prototype['pythonToBlockInteractive'] = function(node) {
  return this.convertBody(node.body, node);
};

pythonToBlock.prototype['pythonToBlockExpression'] = pythonToBlock
    .prototype['pythonToBlockInteractive'];
pythonToBlock.prototype['pythonToBlockSuite'] = pythonToBlock
    .prototype['pythonToBlockModule'];

pythonToBlock.prototype['pythonToBlockPass'] = function() {
  return null;
};

pythonToBlock.prototype.convertElements = function(key, values, parent) {
  const output = {};
  for (let i = 0; i < values.length; i++) {
    output[key + i] = this.convert(values[i], parent);
  }
  return output;
};

Blockly.Python['blank'] = '___';

pythonToBlock.prototype.LOCKED_BLOCK = {
  'inline': 'true',
  'deletable': 'false',
  'movable': 'false',
};

pythonToBlock.COLOR = {
  VARIABLES: 225,
  FUNCTIONS: 210,
  OO: 240,
  CONTROL: 270,
  MATH: 190,
  TEXT: 120,
  FILE: 170,
  PLOTTING: 140,
  LOGIC: 345,
  PYTHON: 60,
  EXCEPTIONS: 300,
  SEQUENCES: 15,
  LIST: 30,
  DICTIONARY: 0,
  SET: 10,
  TUPLE: 20,
};
