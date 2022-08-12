/* eslint-disable indent */
'use strict';

Blockly.Python.INDENT = '    ';
Blockly.Python.RESERVED_WORDS_ =
  'False,None,True,and,as,assert,break,class,' +
  'continue,def,del,elif,else,except,finally,for,' +
  'from,global,if,import,in,is,lambda,nonlocal,' +
  'not,or,pass,raise,return,try,while,with,yield';
/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Python.init = function(workspace) {
  /**
   * Empty loops or conditionals are not allowed in Python.
   */
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Python.PASS = this.INDENT + 'pass\n';
  // Create a dictionary mapping desired function names in definitions_
  Blockly.Python.definitions_ = Object.create(null);
  // to actual function names (to avoid collisions with user functions).
  Blockly.Python.functionNames_ = Object.create(null);
  // Keep track of datasets that are already imported
  Blockly.Python.imported_ = Object.create(null);

  if (!Blockly.Python.variableDB_) {
    Blockly.Python.variableDB_ =
      new Blockly.Names(Blockly.Python.RESERVED_WORDS_);
  } else {
    Blockly.Python.variableDB_.reset();
  }

  Blockly.Python.variableDB_.setVariableMap(workspace.getVariableMap());
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Python.finish = function(code) {
  // Convert the definitions dictionary into a list.
  const imports = [];
  const definitions = [];
  // eslint-disable-next-line guard-for-in
  for (const name in Blockly.Python.definitions_) {
    const def = Blockly.Python.definitions_[name];
    if (name in Blockly.Python.imported_) {
      continue;
    }
    if (def.match(/^(from\s+\S+\s+)?import\s+\S+/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }
  // Clean up temporary data.
  delete Blockly.Python.definitions_;
  delete Blockly.Python.functionNames_;

  // acbart: Don't actually inject initializations - we don't need 'em.
  Blockly.Python.variableDB_.reset();
  if (imports.length) {
    return imports.join('\n') + '\n\n' + code;
  } else {
    return code;
  }
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */

Blockly.Python.scrubNakedValue = function(line) {
  // acbart: Remove extra new line
  return line;
};

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Blockly.Workspace} workspace The workspace containing variables.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.Variables.flyoutCategoryBlocks = function(workspace) {
  const variableModelList = workspace.getVariablesOfType('');
  const xmlList = [];

  if (variableModelList.length > 0) {
    // New variables are added to the end of the variableModelList.
    const mostRecentVariableFieldXmlString =
      variableModelList[variableModelList.length - 1];

    if (!Blockly.Variables._HIDE_GETTERS_SETTERS &&
      Blockly.Blocks['ast_Assign']) {
      const gap = Blockly.Blocks['ast_AugAssign'] ? 8 : 24;
      const blockText = '<xml>' + '<block type="ast_Assign" gap="' +
      gap + '">' + mostRecentVariableFieldXmlString + '</block>' +
      '</xml>';
      const block = Blockly.Xml.textToDom(blockText).firstChild;
      xmlList.push(block);
    }

    if (!Blockly.Variables._HIDE_GETTERS_SETTERS &&
      Blockly.Blocks['ast_AugAssign']) {
      const gap = Blockly.Blocks['ast_Name'] ? 20 : 8;
      const blockText = '<xml>' + '<block type="ast_AugAssign" gap="' +
      gap + '">' + mostRecentVariableFieldXmlString + '<value name="VALUE">' +
      '<shadow type="ast_Num">' + '<field name="NUM">1</field>' + '</shadow>' +
      '</value>' + '<mutation options="false" simple="true"></mutation>' +
      '</block>' + '</xml>';
      const block = Blockly.Xml.textToDom(blockText).firstChild;
      xmlList.push(block);
    }

    if (Blockly.Blocks['ast_Name']) {
      variableModelList.sort(Blockly.VariableModel.compareByName);

      for (let i = 0, variable; variable = variableModelList[i]; i++) {
        if (!Blockly.Variables._HIDE_GETTERS_SETTERS) {
          const _block = Blockly.utils.xml.createElement('block');

          _block.setAttribute('type', 'ast_Name');

          _block.setAttribute('gap', 8);

          _block.appendChild(Blockly.Variables
            .generateVariableFieldDom(variable));

          xmlList.push(_block);
        } else {
          block = Blockly.utils.xml.createElement('label');
          block.setAttribute('text', variable.name);
          block.setAttribute('web-class', 'BlockX-toolbox-variable');
          // block.setAttribute('gap', 8);

          xmlList.push(block);
        }
      }
    }
  }

  return xmlList;
}; // *************************************************************************
// Hacks to make variable names case sensitive

/**
 * A custom compare function for the VariableModel objects.
 * @param {Blockly.VariableModel} var1 First variable to compare.
 * @param {Blockly.VariableModel} var2 Second variable to compare.
 * @return {number} -1 if name of var1 is less than name of var2, 0 if equal,
 *     and 1 if greater.
 * @package
 */


Blockly.VariableModel.compareByName = function(var1, var2) {
  const name1 = var1.name;
  const name2 = var2.name;

  if (name1 < name2) {
    return -1;
  } else if (name1 === name2) {
    return 0;
  } else {
    return 1;
  }
};

Blockly.Names.prototype.getName = function(name, type) {
  if (type == Blockly.VARIABLE_CATEGORY_NAME) {
    const varName = this.getNameForUserVariable_(name);

    if (varName) {
      name = varName;
    }
  }

  const normalized = name + '_' + type;
  const isVarType = type == Blockly.VARIABLE_CATEGORY_NAME ||
    type == Blockly.Names.DEVELOPER_VARIABLE_TYPE;
  const prefix = isVarType ? this.variablePrefix_ : '';

  if (normalized in this.db_) {
    return prefix + this.db_[normalized];
  }

  const safeName = this.getDistinctName(name, type);
  this.db_[normalized] = safeName.substr(prefix.length);
  return safeName;
};

Blockly.Names.equals = function(name1, name2) {
  return name1 == name2;
};

Blockly.Variables.nameUsedWithOtherType_ = function(name, type, workspace) {
  const allVariables = workspace.getVariableMap().getAllVariables();

  for (let i = 0, variable; variable = allVariables[i]; i++) {
    if (variable.name == name && variable.type != type) {
      return variable;
    }
  }

  return null;
};

Blockly.Variables.nameUsedWithAnyType_ = function(name, workspace) {
  const allVariables = workspace.getVariableMap().getAllVariables();

  for (let i = 0, variable; variable = allVariables[i]; i++) {
    if (variable.name == name) {
      return variable;
    }
  }
  return null;
};

/**
 * BlockX Class
 * @param {Object} configuration
 * @param {string} Txt
 */
function BlockX(configuration, Txt) {
  this.validateConfiguration(configuration);
  this.initializeVariables();
  this.addChangeListener(function(event) {
    this.Txt.value = event.value;
  });
  if (!this.configuration.skipSkulpt) {
    this.loadSkulpt();
  }
  this.textToBlocks = new BlockXTextToBlocks(this);
  this.textEditor = new BlockXTextEditor(this);
  this.blockEditor = new BlockXBlockEditor(this);
  this.setMode(this.configuration.viewMode);
  this.Txt = Txt;
}

BlockX.prototype.validateConfiguration = function(configuration) {
  this.configuration = {};

  if ('container' in configuration) { // Container
    this.configuration.container = configuration.container;
  } else {
    throw new Error('Invalid configuration: Missing "container" property.');
  }

  if ('run' in configuration) { // Run function
    this.configuration.run = configuration.run;
  } else {
    this.configuration.run = function() {
      console.log('Ran!');
    };
  }
  this.configuration['readOnly'] = configuration['readOnly'] || false;
  this.configuration.height = configuration.height || 500;
  this.configuration.viewMode = configuration.viewMode || 'split';
  // Need to load skulpt?
  this.configuration.skipSkulpt = configuration.skipSkulpt || false;
  this.configuration.blockDelay = configuration.blockDelay || false;
  this.configuration.toolbox = configuration.toolbox || 'normal';
  this.isParsons = function() {
    return false;
  };
  // Convert image URLs?
  this.configuration.imageUploadHook =
    configuration.imageUploadHook || function(old) {
      return Promise.resolve(old);
    };
  this.configuration.imageDownloadHook =
    configuration.imageDownloadHook || function(old) {
      return old;
    };
  this.configuration.imageLiteralHook =
    configuration.imageLiteralHook || function(old) {
      return old;
    };
  this.configuration.imageDetection = configuration.imageDetection || 'string';
  this.configuration.imageMode = configuration.imageMode || false;
};

BlockX.prototype.initializeVariables = function() {
  this.tags = {
    'toolbar': document.createElement('div'),
    'blockContainer': document.createElement('div'),
    'blockEditor': document.createElement('div'),
    'blockArea': document.createElement('div'),
    'textSidebar': document.createElement('div'),
    'textContainer': document.createElement('div'),
  }; // Toolbar

  this.configuration.container.appendChild(this.tags.toolbar); // Block side

  this.configuration.container.appendChild(this.tags.blockContainer);
  this.tags.blockContainer.appendChild(this.tags.blockEditor);
  this.tags.blockContainer.appendChild(this.tags.blockArea); // Text side

  this.configuration.container.appendChild(this.tags.textContainer);
  this.tags.textContainer.appendChild(this.tags.textSidebar);

  // eslint-disable-next-line guard-for-in
  for (const name in this.tags) {
    this.tags[name].style['box-sizing'] = 'border-box';
  } // Files

  this.code_ = '';
  this.mode_ = null; // Update Flags

  this.silenceBlock = false;
  this.silenceBlockTimer = null;
  this.silenceText = false;
  this.silenceModel = 0;
  this.blocksFailed = false;
  this.blocksFailedTimeout = null;
  this.triggerOnChange = null;
  this.firstEdit = true;
  this.blocklyToolboxWidth = 0;
  this.listeners_ = [];
};

BlockX.prototype.loadSkulpt = function() {
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
};

BlockX.prototype.removeAllChangeListeners = function() {
  this.listeners_.length = 0;
};

BlockX.prototype.removeChangeListener = function(callback) {
  const index = this.listeners_.indexOf(callback);

  if (index !== -1) {
    this.listeners_.splice(index, 1);
  }
};

BlockX.prototype.addChangeListener = function(callback) {
  this.listeners_.push(callback);
};

BlockX.prototype.fireChangeListener = function(event) {
  for (let i = 0, func; func = this.listeners_[i]; i++) {
    func(event);
  }
};

BlockX.prototype.setCode = function(code, quietly) {
  this.code_ = code;

  if (!quietly) {
    this.blockEditor.setCode(code, true);
    this.textEditor.setCode(code, true);
    this.Txt.value= code;
  }

  this.fireChangeListener({
    'name': 'changed',
    'value': code,
  });
};

BlockX.prototype.getCode = function() {
  return this.Txt.value;
};

BlockX.prototype.getMode = function() {
  return this.mode_;
};

BlockX.prototype.setMode = function(mode) {
  this.mode_ = mode;
  this.blockEditor.setMode(mode);
  this.textEditor.setMode(mode);
};

BlockX.prototype.setImageMode = function(imageMode) {
  this.configuration.imageMode = imageMode;

  if (imageMode) {
    this.textEditor.enableImages();
  } else {
    this.textEditor.disableImages();
  }

  console.log(imageMode);
};

BlockX.prototype.setReadOnly = function(isReadOnly) {
  this.textEditor.setReadOnly(isReadOnly);
  this.blockEditor.setReadOnly(isReadOnly);
  $(this.configuration.container)
    .toggleClass('block-mirror-read-only', isReadOnly);
};

BlockX.prototype.refresh = function() {
  this.blockEditor.resized();
  this.textEditor.codeMirror.refresh();
};

BlockX.prototype.forceBlockRefresh = function() {
  this.blockEditor.setCode(this.code_, true);
};

BlockX.prototype.VISIBLE_MODES = {
  'block': ['block', 'split'],
  'text': ['text', 'split'],
};
BlockX.prototype.BREAK_WIDTH = 675;

BlockX.prototype.setHighlightedLines = function(lines, style) {
  // this.blockEditor.highlightLines(lines, style);
  this.textEditor.setHighlightedLines(lines, style);
};

BlockX.prototype.clearHighlightedLines = function() {
  // this.blockEditor.unhighlightLines(lines, style);
  this.textEditor.clearHighlightedLines();
};
/* eslint-disable require-jsdoc */
function BlockXTextEditor(BlockX) {
  this.BlockX = BlockX;
  this.textContainer = BlockX.tags.textContainer;
  this.textSidebar = BlockX.tags.textSidebar;
  this.highlightedHandles = []; // notification

  this.silentEvents_ = false; // Do we need to force an update?
  this.outOfDate_ = null; // Use a timer to swallow updates
  this.updateTimer_ = null;
}
BlockXTextEditor.prototype.enableImages = function() {
  const doc = this.codeMirror.getDoc();
  this.updateImages(this.codeMirror, doc.firstLine(), 1 + doc.lastLine());
};

BlockXTextEditor.prototype.disableImages = function() {
  this.imageMarkers.map(function(imageMarker) {
    return imageMarker.clear();
  });
  this.imageMarkers = this.imageMarkers.filter(function(i) {
    return i.find();
  });
};

BlockXTextEditor.prototype.makeImageWidget = function(url) {
  const newImage = document.createElement('IMG');
  newImage.setAttribute('src', url);
  newImage.style.display = 'none';
  // newImage.setAttribute("height", "40");
  newImage.style.maxHeight = '100px';
  // newImage.setAttribute("width", "40");
  newImage.setAttribute('title', url);

  newImage.onclick = function() {
    if (newImage.hasAttribute('width')) {
      newImage.removeAttribute('height');
      newImage.removeAttribute('width');
    } else {
      newImage.setAttribute('height', '40');
      newImage.setAttribute('width', '40');
    }
  };

  const newSpan = document.createElement('span');
  newSpan.className = 'cm-string';
  newSpan.innerText = JSON.stringify(url);

  newSpan.onmouseover = function() {
    newImage.style.display = 'block';
  };

  newSpan.onmouseout = function() {
    newImage.style.display = 'none';
  };

  newSpan.appendChild(newImage);
  return newSpan; // return newImage;
};

BlockXTextEditor.prototype.updateImages = function(cm, from, to) {
  const _this2 = this;

  cm.doc.eachLine(from, to, function(line) {
    let match;
    // eslint-disable-next-line max-len
    const regex = BlockXTextEditor.REGEX_PATTERNS[_this2.BlockX.configuration.imageDetection];

    while ((match = regex.exec(line.text)) !== null) {
      const offset = match[0].length - match[1].length; // console.log(offset);

      const imageMarker = cm.markText({
        line: cm.doc.getLineNumber(line),
        ch: match.index + offset,
      }, {
        line: cm.doc.getLineNumber(line),
        ch: match.index + match[1].length + offset,
      }, {
        className: 'bm-hyperlinked-image',
        attributes: {
          'data-url': match[3],
        },
        inclusiveLeft: false,
        inclusiveRight: false,
      });
      console.log(imageMarker);
      // imageWidget.onclick = (x) => imageMarker.clear();

      _this2.imageMarkers.push(imageMarker);
    }
  });
}; // 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/labrador-head.png'


// eslint-disable-next-line max-len
const FULL_IMAGE_URL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(?:png|jpg|jpeg|gif|svg|mp4)+$/;

// eslint-disable-next-line max-len
const STRING_IMAGE_URL = /((["'])((?:blob:null\/[A-Fa-f0-9-]+)|(?:(?:https?:\/\/)?[\w.-]+(?:\.?[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(?:png|jpg|jpeg|gif|svg)+)|(?:data:image\/(?:png|jpg|jpeg|gif|svg\+xml|webp|bmp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}))\2)/g;

const CONSTRUCTOR_IMAGE_URL = /(?:^|\W)(Image\((["'])(.+?)\2\))/g;
BlockXTextEditor.REGEX_PATTERNS = {
  'constructor': CONSTRUCTOR_IMAGE_URL,
  'string': STRING_IMAGE_URL,
  'none': false,
};

BlockXTextEditor.prototype.isImageUrl = function(url) {
  return url.match(FULL_IMAGE_URL);
};

BlockXTextEditor.prototype.defocus = function() {
  this.codeMirror.display.input.blur();
};

BlockXTextEditor.prototype.updateWidth = function() { };

BlockXTextEditor.prototype.setReadOnly = function(isReadOnly) {
  this.codeMirror.setOption('readOnly', isReadOnly);
};

BlockXTextEditor.prototype.VIEW_CONFIGURATIONS = {
  'split': {
    'width': '40%',
    'visible': true,
    'indentSidebar': false,
  },
  'text': {
    'width': '100%',
    'visible': true,
    'indentSidebar': true,
  },
  'block': {
    'width': '0%',
    'visible': false,
    'indentSidebar': false,
  },
};

BlockXTextEditor.prototype.resizeResponsively = function() {
  const mode = this.BlockX.mode_;
  const configuration = this.VIEW_CONFIGURATIONS[mode];
  const width = configuration.width;
  const height = this.BlockX.configuration.height;

  if (mode === 'split') {
    if (window.innerWidth >= this.BlockX.BREAK_WIDTH) {
      this.textContainer.style.width = width;
      this.textContainer.style.height = height + 'px';
    } else {
      this.textContainer.style.width = '100%';
      this.textContainer.style.height = height / 2 + 'px';
    }
  } else {
    this.textContainer.style.width = width;
    this.textContainer.style.height = height + 'px';
  }
};

BlockXTextEditor.prototype.setMode = function(mode) {
  mode = mode.toLowerCase();
  // If there is an update waiting and we're visible, then update
  const configuration = this.VIEW_CONFIGURATIONS[mode];

  if (this.outOfDate_ !== null && this.isVisible()) {
    this.setCode(this.outOfDate_, true);
  } // Show/hide editor

  this.resizeResponsively();

  this.updateGutter(configuration);
};

BlockXTextEditor.prototype.updateGutter = function(configuration) {
  if (configuration === undefined) {
    const mode = this.BlockX.mode_.toLowerCase();
    configuration = this.VIEW_CONFIGURATIONS[mode];
  }

  const isBigWindow = window.innerWidth >= this.BlockX.BREAK_WIDTH;

  if (configuration.indentSidebar && isBigWindow) {
    const gutters = this.textContainer.querySelector('.CodeMirror-gutters');
    const gutterWidth = gutters.offsetWidth;
    const toolbarWidth = this.BlockX.blockEditor.getToolbarWidth();
    const newGutterWidth = toolbarWidth - gutterWidth - 2;
    this.textSidebar.style.width = newGutterWidth + 'px';
    this.textSidebar.style.display = 'block';
  } else {
    this.textSidebar.style.display = 'none';
    this.textSidebar.style.width = '0px';
  }
};

BlockXTextEditor.prototype.setCode = function(code, quietly) {
  this.silentEvents_ = quietly; // Defaults to a single blank line

  code = code === undefined || code.trim() === '' ? '\n' : code;

  if (this.isVisible()) {
    // this.codeMirror.setValue(code);
    this.outOfDate_ = null;
  } else {
    this.outOfDate_ = code;
  }
};


BlockXTextEditor.prototype.isVisible = function() {
  return this
      .BlockX.VISIBLE_MODES
      .text.
      indexOf(this.BlockX.mode_) !== -1;
};

BlockXTextEditor.prototype.setHighlightedLines = function(lines, style) {
  const handles = lines.map(function(l) {
    return {
      'style': style,
    };
  });
  this.highlightedHandles = this.highlightedHandles.concat(handles);
};

/**
 * Worth noting - Blockly uses a setTimeOut of 0 steps to make events
 * wait. That has some confusing interaction with trying to make
 * things percolate.
 * @param {BlockEditor.super} BlockX
 * @constructor
 */
function BlockXBlockEditor(BlockX) {
  this.BlockX = BlockX;
  this.blockContainer = BlockX.tags.blockContainer;
  this.blockEditor = BlockX.tags.blockEditor;
  this.blockArea = BlockX.tags.blockArea;
  // Null, or the source of the last update

  this.outOfDate_ = null;
  // Have to call BEFORE we inject, or Blockly will delete the css string!

  this.loadBlocklyCSS(); // Inject Blockly

  const blocklyOptions = {
    media: BlockX.configuration.blocklyMediaPath,
    // We use special comment blocks
    zoom: {
      controls: true,
    },
    comments: false,
    disable: false,
    oneBasedIndex: false,
    readOnly: BlockX.configuration.readOnly,
    scrollbars: true,
    toolbox: this.makeToolbox(),
  };
  // Configure Blockly
  this.workspace =
    Blockly.inject(BlockX.tags.blockEditor, blocklyOptions);

  // Configure Blockly DIV
  this.workspace.addChangeListener(this.changed.bind(this));
  // BlockX.tags.blockEditor.style.resize = 'horizontal';

  this.blockContainer.style['float'] = 'left';
  this.blockEditor.style.position = 'absolute';
  this.blockEditor.style.width = '100%';
  this.blockArea.style.height = BlockX.configuration.height + 'px';
  this.readOnlyDiv_ = null;
  window.addEventListener('resize', this.resized.bind(this), false);
  this.resized();
}

BlockXBlockEditor.prototype.resizeReadOnlyDiv = function() {
  if (this.readOnlyDiv_ !== null) {
    if (!this.isVisible()) {
      this.readOnlyDiv_.css('left', '0px');
      this.readOnlyDiv_.css('top', '0px');
      this.readOnlyDiv_.css('width', '0px');
      this.readOnlyDiv_.css('height', '0px');
    }

    const blockArea = this.BlockX.tags.blockArea;
    let current = blockArea;
    let x = 0;
    let y = 0;

    do {
      x += current.offsetLeft;
      y += current.offsetTop;
      current = current.offsetParent;
    } while (current); // Position blocklyDiv over blockArea.


    this.readOnlyDiv_.css('left', x + 'px');
    this.readOnlyDiv_.css('top', y + 'px');
    this.readOnlyDiv_.css('width', blockArea.offsetWidth + 'px');
    this.readOnlyDiv_.css('height', blockArea.offsetHeight + 'px');
  }
};

BlockXBlockEditor.prototype.setReadOnly = function(isReadOnly) {
  if (isReadOnly) {
    if (this.readOnlyDiv_ === null) {
      this.readOnlyDiv_ = $('<div class=\'blockly-readonly-layer\'></div>');
      $('body').append(this.readOnlyDiv_);
    }

    this.resizeReadOnlyDiv();
  } else if (this.readOnlyDiv_ !== null) {
    this.readOnlyDiv_.remove();
    this.readOnlyDiv_ = null;
  }
};

BlockXBlockEditor.prototype.updateWidth = function() {
  //   const newWidth = '0%';
  this.resized();
};

BlockXBlockEditor.prototype.resized = function() {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  this.resizeResponsively();

  const blockArea = this.BlockX.tags.blockArea;
  /* var current = blockArea;
  var x = 0;
  var y = 0;
  do {
      x += current.offsetLeft;
      y += current.offsetTop;
      current = current.offsetParent;
  } while (current);*/
  // Position blocklyDiv over blockArea.

  const blockEditor = this.BlockX.tags.blockEditor;
  /* blockEditor.style.left = x + 'px';
  blockEditor.style.top = y + 'px';*/

  blockEditor.style.width = blockArea.offsetWidth + 'px';
  blockEditor.style.height = blockArea.offsetHeight + 'px';
  Blockly.svgResize(this.workspace);
  this.resizeReadOnlyDiv();
};

BlockXBlockEditor.prototype.toolboxPythonToBlocks =
  function(toolboxPython) {
    const _this6 = this;

    Blockly.Variables._HIDE_GETTERS_SETTERS = false;
    return toolboxPython.map(function(category) {
      if (typeof category === 'string') {
        return category;
      }

      const colour = BlockXTextToBlocks.COLOR[category.colour];
      let header =
        '<category name="'.concat(category.name, '" colour="')
                          .concat(colour, '"');

      if (category.custom) {
        header += ' custom="'.concat(category.custom, '">');
      } else {
        header += '>';
      }

      const body = (category.blocks || []).map(function(code) {
        const result =
          _this6.BlockX.textToBlocks.convertSource('toolbox.py', code);

        return result.rawXml.innerHTML.toString();
      }).join('\n');
      const footer = '</category>';

      if (category['hideGettersSetters']) {
        Blockly.Variables._HIDE_GETTERS_SETTERS = true;
      }

      return [header, body, footer].join('\n');
    }).join('\n');
  };

BlockXBlockEditor.prototype.makeToolbox = function() {
  // Use palette if it exists, otherwise assume its a custom one.
  let toolbox =
    this.BlockX.configuration.toolbox;

  if (toolbox in this.TOOLBOXES) {
    toolbox = this.TOOLBOXES[toolbox];
  } // Convert if necessary


  if (typeof toolbox !== 'string') {
    toolbox = this.toolboxPythonToBlocks(toolbox);
  }
  // TODO: Fix Hack, this should be configurable by instance rather than class


  // eslint-disable-next-line guard-for-in
  for (const name in BlockXBlockEditor.EXTRA_TOOLS) {
    toolbox += BlockXBlockEditor.EXTRA_TOOLS[name];
  }

  return '<xml id="toolbox" style="display:none">' + toolbox + '</xml>';
};

BlockXBlockEditor.prototype.remakeToolbox = function() {
  this.workspace.updateToolbox(this.makeToolbox());
  this.resized();
};
/**
 * Retrieves the current width of the Blockly Toolbox, unless
 * we're in read-only mode (when there is no toolbox).
 * @returns {Number} The current width of the toolbox.
 */


BlockXBlockEditor.prototype.getToolbarWidth = function() {
  if (this.BlockX.configuration.readOnly) {
    return 0;
  } else {
    return this.workspace.toolbox_.width;
  }
};

BlockXBlockEditor.prototype.VIEW_CONFIGURATIONS = {
  'split': {
    'width': '60%',
    'visible': true,
  },
  'block': {
    'width': '100%',
    'visible': true,
  },
  'text': {
    'width': '0%',
    'visible': false,
  },
};

BlockXBlockEditor.prototype.resizeResponsively = function() {
  const mode = this.BlockX.mode_;
  const configuration = this.VIEW_CONFIGURATIONS[mode];

  if (mode === 'split') {
    if (window.innerWidth >= this.BlockX.BREAK_WIDTH) {
      this.blockContainer.style.width = configuration.width;
      this.blockContainer.style.height =
        this.BlockX.configuration.height + 'px';
      this.blockArea.style.height =
        this.BlockX.configuration.height + 'px';
    } else {
      this.blockContainer.style.width = '100%';
      this.blockContainer.style.height =
        this.BlockX.configuration.height / 2 + 'px';
      this.blockArea.style.height =
        this.BlockX.configuration.height / 2 + 'px';
    }
  } else if (mode === 'block') {
    this.blockContainer.style.width = configuration.width;
    this.blockContainer.style.height =
      this.BlockX.configuration.height + 'px';
    this.blockArea.style.height = this.BlockX.configuration.height + 'px';
  }
};

BlockXBlockEditor.prototype.setMode = function(mode) {
  mode = mode.toLowerCase();
  const configuration = this.VIEW_CONFIGURATIONS[mode]; // Show/hide editor

  this.workspace.setVisible(configuration.visible);

  if (configuration.visible) {
    this.blockEditor.style.width = '100%';
    this.resized();
  } else {
    this.blockContainer.style.height = '0%';
    this.blockArea.style.height = '0%';
    this.resizeReadOnlyDiv();
  } // If there is an update waiting and we're visible, then update


  if (this.outOfDate_ !== null && this.isVisible()) {
    this.setCode(this.outOfDate_, true);
  }
};
/**
 * Attempts to update the model for the current code file from the
 * block workspace. Might be prevented if an update event was already
 * percolating.
 */


BlockXBlockEditor.prototype.getCode = function() {
  return Blockly.Python.workspaceToCode(this.workspace);
};
/**
 * Attempts to update the model for the current code file from the
 * block workspace. Might be prevented if an update event was already
 * percolating.
 */


BlockXBlockEditor.prototype.setCode = function(code, quietly) {
  if (this.isVisible()) {
    const result =
      this.BlockX.textToBlocks.convertSource('__main__.py', code);

    if (quietly) {
      Blockly.Events.disable();
    }

    try {
      const xmlCode = Blockly.Xml.textToDom(result.xml);
      this.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlCode, this.workspace);

      if (this.BlockX.isParsons()) {
        this.workspace.shuffle();
      } else {
        this.workspace.cleanUp();
      }
    } catch (error) {
      console.error(error);
    }

    if (quietly) {
      Blockly.Events.enable();
    } else {
      this.BlockX.setCode(code, true);
    }

    this.outOfDate_ = null;
  } else {
    this.outOfDate_ = code;
  }
};

BlockXBlockEditor.prototype.BLOCKLY_CHANGE_EVENTS = [
  Blockly.Events.CREATE,
  Blockly.Events.DELETE,
  Blockly.Events.CHANGE,
  Blockly.Events.MOVE,
  Blockly.Events.VAR_RENAME,
];

BlockXBlockEditor.prototype.changed = function(event) {
  if ((event === undefined ||
    this.BLOCKLY_CHANGE_EVENTS.indexOf(event.type) !== -1
  ) && !this.workspace.isDragging()) {
    const newCode = this.getCode();
    this.BlockX.textEditor.setCode(newCode, true);
    this.BlockX.setCode(newCode, true);
  }
};

BlockXBlockEditor.prototype.isVisible = function() {
  return this.BlockX.VISIBLE_MODES
    .block.indexOf(this.BlockX.mode_) !== -1;
};

BlockXBlockEditor.prototype.DOCTYPE = '<?xml version="1.0" standalone="no"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
BlockXBlockEditor.prototype.BLOCKLY_LOADED_CSS = null;

BlockXBlockEditor.prototype.loadBlocklyCSS = function() {
  if (this.BLOCKLY_LOADED_CSS === null) {
    let result = ['.blocklyDraggable {}'];
    result = result.concat(Blockly.Css.CONTENT);

    if (Blockly.FieldDate) {
      result = result.concat(Blockly.FieldDate.CSS);
    }
    // Strip off any trailing slash (either Unix or Windows).
    result = result.join('\n');

    result = result.replace(/<<<PATH>>>/g, Blockly.Css.mediaPath_);
    this.BLOCKLY_LOADED_CSS = result;
  }
};
/**
 * Generates a PNG version of the current workspace.
 * This PNG is stored in a Base-64 encoded
 * string as part of a data URL (e.g., "data:image/png;base64,...").
 * TODO: There seems to be some problems capturing blocks that don't start with
 * statement level blocks (e.g., expression blocks).
 *
 * @param {Function} callback - A function to be called with the results.
 *  This function should take two parameters,
 * the URL (as a string) of the generated
 *  base64-encoded PNG and the IMG tag.
 */


BlockXBlockEditor.prototype.getPngFromBlocks = function(callback) {
  try {
    // Retreive the entire canvas, strip some unnecessary tags
    this.loadBlocklyCSS();

    const blocks = this.workspace.svgBlockCanvas_.cloneNode(true);
    blocks.removeAttribute('width');
    blocks.removeAttribute('height'); // Ensure that we have some content

    if (blocks.childNodes[0] !== undefined) {
      // Remove tags that offset
      blocks.removeAttribute('transform');
      blocks.childNodes[0].removeAttribute('transform');
      // Add in styles
      blocks.childNodes[0].childNodes[0].removeAttribute('transform');

      const linkElm = document.createElementNS('http://www.w3.org/1999/xhtml', 'style');
      linkElm.textContent = this.BLOCKLY_LOADED_CSS + '\n\n';
      blocks.insertBefore(linkElm, blocks.firstChild); // Get the bounding box
      // Create the XML representation of the SVG
      const bbox =
        document.getElementsByClassName('blocklyBlockCanvas')[0].getBBox();

      let xml = new XMLSerializer().serializeToString(blocks);
      xml = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + bbox.width + '" height="' + bbox.height + '" viewBox="0 0 ' + bbox.width + ' ' + bbox.height + '"><rect width="100%" height="100%" fill="white"></rect>' + xml + '</svg>'; // create a file blob of our SVG.
      // Unfortunately, this crashes modern chrome for unknown reasons.
      // var blob = new Blob([ this.DOCTYPE + xml], { type: 'image/svg+xml' });
      // var url = window.URL.createObjectURL(blob);
      // Old method: this failed on IE

      // Create an IMG tag to hold the new element
      const url =
        'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));

      const img = document.createElement('img');
      img.style.display = 'block';

      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = bbox.width;
        canvas.height = bbox.height;

        if (!canvas.width || !canvas.height) {
          callback('', img);
          return;
        }

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let canvasUrl;

        try {
          canvasUrl = canvas.toDataURL('image/png');
        } catch (e) {
          canvasUrl = url;
        }

        img.onload = null;
        callback(canvasUrl, img);
      };

      img.onerror = function() {
        callback('', img);
      };

      img.setAttribute('src', url);
    } else {
      callback('', document.createElement('img'));
    }
  } catch (e) {
    callback('', document.createElement('img'));
    console.error('PNG image creation not supported!', e);
  }
};
// Make some kind of block map?
BlockXBlockEditor.prototype.highlightLines = function() {

  /* this.workspace.getAllBlocks().map((block) => {
      block
  });*/
};

function BlockXTextToBlocks(BlockX) {
  this.BlockX = BlockX;
  this.hiddenImports = ['plt'];
  this.strictAnnotations = ['int', 'float', 'str', 'bool'];
  Blockly.defineBlocksWithJsonArray(BlockXTextToBlocks.BLOCKS);
}

BlockXTextToBlocks.xmlToString = function(xml) {
  return new XMLSerializer().serializeToString(xml);
};

BlockXTextToBlocks.prototype.convertSourceToCodeBlock =
  function(pythonSource) {
    const xml = document.createElement('xml');
    xml.appendChild(BlockXTextToBlocks.raw_block(pythonSource));
    return BlockXTextToBlocks.xmlToString(xml);
  };
/**
 * The main function for converting a string representation of Python
 * code to the Blockly XML representation.
 *
 * @param {string} filename - The filename being parsed.
 * @param {string} pythonSource - The string representation of Python
 *      code (e.g., "a = 0").
 * @returns {Object} An object which will either have the converted
 *      source code or an error message and the code as a code-block.
 */


BlockXTextToBlocks.prototype.convertSource =
  function(filename, pythonSource) {
    const xml = document.createElement('xml'); // Attempt parsing - might fail!

    let parse;
    let ast = null;
    //   let symbolTable;
    let error;
    let badChunks = [];
    const originalSource = pythonSource;
    this.source = pythonSource.split('\n');
    let previousLine = 1 + this.source.length;

    while (ast === null) {
      if (pythonSource.trim() === '') {
        if (badChunks.length) {
          xml.appendChild(BlockXTextToBlocks
            .raw_block(badChunks.join('\n')));
        }

        return {
          'xml': BlockXTextToBlocks.xmlToString(xml),
          'error': null,
          'rawXml': xml,
        };
      }

      try {
        parse = Sk.parse(filename, pythonSource);
        ast = Sk.astFromParse(parse.cst, filename, parse.flags);
      } catch (e) {
        // console.error(e);
        error = e;

        if (e.traceback &&
          e.traceback.length &&
          e.traceback[0].lineno &&
          e.traceback[0].lineno < previousLine) {
          previousLine = e.traceback[0].lineno - 1;
          badChunks = badChunks.concat(this.source.slice(previousLine));
          this.source = this.source.slice(0, previousLine);
          pythonSource = this.source.join('\n');
        } else {
          // console.error(e);
          xml.appendChild(BlockXTextToBlocks.raw_block(originalSource));
          return {
            'xml': BlockXTextToBlocks.xmlToString(xml),
            'error': error,
            'rawXml': xml,
          };
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

    if (converted !== null) {
      for (let block = 0; block < converted.length; block += 1) {
        xml.appendChild(converted[block]);
      }
    }

    if (badChunks.length) {
      xml.appendChild(BlockXTextToBlocks.raw_block(badChunks.join('\n')));
    }

    return {
      'xml': BlockXTextToBlocks.xmlToString(xml),
      'error': null,
      'lineMap': this.lineMap,
      'comments': this.comments,
      'rawXml': xml,
    };
  };

BlockXTextToBlocks.prototype.recursiveMeasure =
  function(node, nextBlockLine) {
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

    if ('body' in node) {
      for (let i = 0; i < node.body.length; i++) {
        let next = void 0;

        if (i + 1 === node.body.length) {
          next = myNext;
        } else {
          next = node.body[i + 1].lineno - 1;
        }

        this.recursiveMeasure(node.body[i], next);
      }
    }

    if ('orelse' in node) {
      for (let _i = 0; _i < node.orelse.length; _i++) {
        let _next = void 0;

        if (_i === node.orelse.length) {
          _next = nextBlockLine;
        } else {
          _next = 1 + (node.orelse[_i].lineno - 1);
        }

        this.recursiveMeasure(node.orelse[_i], _next);
      }
    }
  };

BlockXTextToBlocks.prototype.measureNode = function(node) {
  this.heights = [];
  this.recursiveMeasure(node, this.source.length - 1);
  this.heights.shift();
};

BlockXTextToBlocks.prototype.getSourceCode = function(frm, to) {
  // Strip out any starting indentation.
  const lines = this.source.slice(frm - 1, to);

  if (lines.length > 0) {
    const indentation = lines[0].search(/\S/);

    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].substring(indentation);
    }
  }

  return lines.join('\n');
};

BlockXTextToBlocks.prototype.convertBody = function(node, parent) {
  this.levelIndex += 1;
  const isTopLevel = this.isTopLevel(parent); // Empty body, return nothing

  /* if (node.length === 0) {
      return null;
  }*/
  // Final result list

  const children = [];
  // The complete set of peers
  let root = null;
  // The top of the current peer
  let current = null;
  // The bottom of the current peer
  //   const levelIndex = this.levelIndex;

  // eslint-disable-next-line require-jsdoc
  function addPeer(peer) {
    if (root == null) {
      children.push(peer);
    } else {
      children.push(root);
    }

    root = peer;
    current = peer;
  }

  function finalizePeers() {
    if (root != null) {
      children.push(root);
    }
  }

  // eslint-disable-next-line require-jsdoc
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

  for (let i = 0; i < node.length; i++) {
    lineNumberInProgram = node[i].lineno;
    distance = 0;

    if (previousLineInProgram != null) {
      distance = lineNumberInProgram - previousLineInProgram - 1;
    }

    for (const _commentLineInProgram in this.comments) {
      if (_commentLineInProgram < lineNumberInProgram) {
        const commentChild =
          this.ast_Comment(this.comments[_commentLineInProgram],
            _commentLineInProgram);

        if (previousLineInProgram == null) {
          nestChild(commentChild);
        } else {
          const skippedPreviousLine =
            Math.abs(previousLineInProgram - _commentLineInProgram) > 1;

          if (isTopLevel && skippedPreviousLine) {
            addPeer(commentChild);
          } else {
            nestChild(commentChild);
          }
        }

        previousLineInProgram = _commentLineInProgram;
        this.highestLineSeen =
          Math.max(this.highestLineSeen, parseInt(_commentLineInProgram, 10));
        distance = lineNumberInProgram - previousLineInProgram;
        delete this.comments[_commentLineInProgram];
      }
    }

    distance = lineNumberInProgram - this.highestLineSeen;
    // Now convert the actual node
    this.highestLineSeen =
      Math.max(lineNumberInProgram, this.highestLineSeen);

    const height = this.heights.shift();
    const originalSourceCode = this.getSourceCode(lineNumberInProgram, height);
    // Skip null blocks (e.g., imports)
    const newChild =
      this.convertStatement(node[i], originalSourceCode, parent);

    if (newChild == null) {
      continue;
    }

    skippedLine = distance > 1;
    previousLineInProgram = lineNumberInProgram;

    if (isTopLevel && newChild.constructor === Array) {
      addPeer(newChild[0]); // Handle skipped line
    } else if (isTopLevel && skippedLine && visitedFirstLine) {
      addPeer(newChild); // The previous line was not a Peer
    } else if (isTopLevel && !previousWasStatement) {
      addPeer(newChild); // Otherwise, always embed it in there.
    } else {
      nestChild(newChild);
    }

    previousWasStatement = newChild.constructor !== Array;
    visitedFirstLine = true;
  } // Handle comments that are on the very last line


  const lastLineNumber = lineNumberInProgram + 1;

  if (lastLineNumber in this.comments) {
    const _commentChild =
      this.ast_Comment(this.comments[lastLineNumber], lastLineNumber);

    if (isTopLevel && !previousWasStatement) {
      addPeer(_commentChild);
    } else {
      nestChild(_commentChild);
    }

    delete this.comments[lastLineNumber];
  } // Handle any extra comments that stuck around


  if (isTopLevel) {
    // eslint-disable-next-line guard-for-in
    for (const commentLineInProgram in this.comments) {
      const _commentChild2 =
      this.ast_Comment(this.comments[commentLineInProgram],
        commentLineInProgram);

      distance = commentLineInProgram - previousLineInProgram;

      if (previousLineInProgram == null) {
        addPeer(_commentChild2);
      } else if (distance > 1) {
        addPeer(_commentChild2);
      } else {
        nestChild(_commentChild2);
      }

      previousLineInProgram = commentLineInProgram;
      delete this.comments[lastLineNumber];
    }
  }

  finalizePeers();
  this.levelIndex -= 1;
  return children;
};

BlockXTextToBlocks.prototype.TOP_LEVEL_NODES =
  ['Module', 'Expression', 'Interactive', 'Suite'];

BlockXTextToBlocks.prototype.isTopLevel = function(parent) {
  return !parent || this.TOP_LEVEL_NODES.indexOf(parent._astname) !== -1;
};

BlockXTextToBlocks.prototype.convert = function(node, parent) {
  const functionName = 'ast_' + node._astname;

  if (this[functionName] === undefined) {
    throw new Error('Could not find function: ' + functionName);
  }

  node._parent = parent;
  return this[functionName](node, parent);
};

function arrayMax(array) {
  return array.reduce(function(a, b) {
    return Math.max(a, b);
  });
}

function arrayMin(array) {
  return array.reduce(function(a, b) {
    return Math.min(a, b);
  });
}

BlockXTextToBlocks.prototype.convertStatement =
  function(node, fullSource, parent) {
    try {
      return this.convert(node, parent);
    } catch (e) {
      const heights = this.getChunkHeights(node);
      const extractedSource =
        this.getSourceCode(arrayMin(heights), arrayMax(heights));
      console.error(e);
      return BlockXTextToBlocks.raw_block(extractedSource);
    }
  };

BlockXTextToBlocks.prototype.getChunkHeights = function(node) {
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
    for (let _i2 = 0; _i2 < node.orelse.length; _i2 += 1) {
      const _subnode = node.orelse[_i2];
      lineNumbers = lineNumbers.concat(this.getChunkHeights(_subnode));
    }
  }

  return lineNumbers;
};

BlockXTextToBlocks.create_block =
  function(type, lineNumber, fields, values, settings, mutations, statements) {
    const newBlock = document.createElement('block'); // Settings

    newBlock.setAttribute('type', type);
    newBlock.setAttribute('line_number', lineNumber);

    // eslint-disable-next-line guard-for-in
    for (const setting in settings) {
      const settingValue = settings[setting];
      newBlock.setAttribute(setting, settingValue);
    } // Mutations


    if (mutations !== undefined && Object.keys(mutations).length > 0) {
      const newMutation = document.createElement('mutation');

      // eslint-disable-next-line guard-for-in
      for (const mutation in mutations) {
        const mutationValue = mutations[mutation];

        if (mutation.charAt(0) === '@') {
          newMutation.setAttribute(mutation.substr(1), mutationValue);
        } else if (mutationValue != null &&
          mutationValue.constructor === Array) {
          for (let i = 0; i < mutationValue.length; i++) {
            const mutationNode = document.createElement(mutation);
            mutationNode.setAttribute('name', mutationValue[i]);
            newMutation.appendChild(mutationNode);
          }
        } else {
          const _mutationNode = document.createElement('arg');

          if (mutation.charAt(0) === '!') {
            _mutationNode.setAttribute('name', '');
          } else {
            _mutationNode.setAttribute('name', mutation);
          }

          if (mutationValue !== null) {
            _mutationNode.appendChild(mutationValue);
          }

          newMutation.appendChild(_mutationNode);
        }
      }

      newBlock.appendChild(newMutation);
    } // Fields


    // eslint-disable-next-line guard-for-in
    for (const field in fields) {
      const fieldValue = fields[field];
      const newField = document.createElement('field');
      newField.setAttribute('name', field);
      newField.appendChild(document.createTextNode(fieldValue));
      newBlock.appendChild(newField);
    } // Values


    // eslint-disable-next-line guard-for-in
    for (const value in values) {
      const valueValue = values[value];
      const newValue = document.createElement('value');

      if (valueValue !== null) {
        newValue.setAttribute('name', value);
        newValue.appendChild(valueValue);
        newBlock.appendChild(newValue);
      }
    } // Statements


    if (statements !== undefined && Object.keys(statements).length > 0) {
      // eslint-disable-next-line guard-for-in
      for (const statement in statements) {
        const statementValue = statements[statement];

        if (statementValue == null) {
          continue;
        } else {
          for (let _i3 = 0; _i3 < statementValue.length; _i3 += 1) {
            // In most cases, you really shouldn't ever have more than
            //  one statement in this list. I'm not sure Blockly likes
            //  that.
            const newStatement = document.createElement('statement');
            newStatement.setAttribute('name', statement);
            newStatement.appendChild(statementValue[_i3]);
            newBlock.appendChild(newStatement);
          }
        }
      }
    }

    return newBlock;
  };

BlockXTextToBlocks.raw_block = function(txt) {
  // TODO: lineno as second parameter!
  return BlockXTextToBlocks.create_block('ast_Raw', 0, {
    'TEXT': txt,
  });
};

BlockXTextToBlocks.BLOCKS = [];

BlockXTextToBlocks.prototype['ast_Module'] = function(node) {
  return this.convertBody(node.body, node);
};

BlockXTextToBlocks.prototype['ast_Interactive'] = function(node) {
  return this.convertBody(node.body, node);
};

BlockXTextToBlocks.prototype['ast_Expression'] =
  BlockXTextToBlocks.prototype['ast_Interactive'];
BlockXTextToBlocks.prototype['ast_Suite'] =
  BlockXTextToBlocks.prototype['ast_Module'];

BlockXTextToBlocks.prototype['ast_Pass'] = function() {
  return null; // block("controls_pass");
};

BlockXTextToBlocks.prototype.convertElements =
  function(key, values, parent) {
    const output = {};

    for (let i = 0; i < values.length; i++) {
      output[key + i] = this.convert(values[i], parent);
    }

    return output;
  };

Blockly.Python['blank'] = '___';
BlockXTextToBlocks.prototype.LOCKED_BLOCK = {
  'inline': 'true',
  'deletable': 'false',
  'movable': 'false',
};
BlockXTextToBlocks.COLOR = {
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

BlockXTextToBlocks['ast_Image'] = function(node, parent, bmttb) {
  if (!bmttb.BlockX.configuration.imageMode) {
    throw new Error('Not using image constructor');
  }

  if (node.args.length !== 1) {
    throw new Error('More than one argument to Image constructor');
  }

  if (node.args[0]._astname !== 'Str') {
    throw new Error(
      'First argument for Image constructor must be string literal',
    );
  }

  return BlockXTextToBlocks
    .create_block('ast_Image', node.lineno, {}, {}, {}, {
      '@src': Sk.ffi.remapToJs(node.args[0].s),
    });
};

BlockXTextToBlocks.prototype.FUNCTION_SIGNATURES = {
  'abs': {
    'returns': true,
    'full': ['x'],
    'colour': BlockXTextToBlocks.COLOR.MATH,
  },
  'all': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LOGIC,
  },
  'any': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LOGIC,
  },
  'ascii': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'bin': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'bool': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LOGIC,
    simple: ['x'],
  },
  'breakpoint': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'bytearray': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'bytes': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'callable': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LOGIC,
  },
  'chr': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'classmethod': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'compile': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'complex': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'delattr': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.VARIABLES,
  },
  'dict': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  'dir': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'divmod': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'enumerate': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'eval': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'exec': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'filter': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'float': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
    simple: ['x'],
  },
  'format': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'frozenset': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'getattr': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'globals': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.VARIABLES,
  },
  'hasattr': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'hash': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'help': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'hex': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'id': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'Image': {
    custom: BlockXTextToBlocks.ast_Image,
  },
  'input': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.FILE,
    simple: ['prompt'],
  },
  'int': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
    simple: ['x'],
  },
  'isinstance': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LOGIC,
  },
  'issubclass': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LOGIC,
  },
  'iter': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'len': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'list': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'locals': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.VARIABLES,
  },
  'map': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'max': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'memoryview': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'min': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'next': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'object': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'oct': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'open': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.FILE,
  },
  'ord': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'pow': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'print': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.FILE,
    simple: ['message'],
    full: ['*messages', 'sep', 'end', 'file', 'flush'],
  },
  'property': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'range': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
    simple: ['stop'],
    full: ['start', 'stop', 'step'],
  },
  'repr': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'reversed': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'round': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
    full: ['x', 'ndigits'],
    simple: ['x'],
  },
  'set': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'setattr': {
    'returns': false,
    'full': ['object', 'name', 'value'],
    'colour': BlockXTextToBlocks.COLOR.OO,
  },
  'slice': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'sorted': {
    'full': ['iterable', '*', '**key', '**reverse'],
    'simple': ['iterable'],
    'returns': true,
    'colour': BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'staticmethod': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'str': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
    simple: ['x'],
  },
  'sum': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'super': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'tuple': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TUPLE,
  },
  'type': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  'vars': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.VARIABLES,
  },
  'zip': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  '__import__': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
};
BlockXTextToBlocks.prototype.METHOD_SIGNATURES = {
  'conjugate': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'trunc': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'floor': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'ceil': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'bit_length': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'to_bytes': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'from_bytes': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'as_integer_ratio': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'is_integer': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'hex': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  'fromhex': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.MATH,
  },
  '__iter__': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  '__next__': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'index': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'count': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'append': {
    'returns': false,
    'full': ['x'],
    'message': 'append',
    'premessage': 'to list',
    'colour': BlockXTextToBlocks.COLOR.LIST,
  },
  'clear': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'copy': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'extend': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'insert': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'pop': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'remove': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'reverse': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'sort': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.LIST,
  },
  'capitalize': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'casefold': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'center': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'encode': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'endswith': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'expandtabs': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'find': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'format': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'format_map': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isalnum': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isalpha': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isascii': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isdecimal': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isdigit': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isidentifier': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'islower': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isnumeric': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isprintable': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isspace': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'istitle': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'isupper': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'join': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'ljust': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'lower': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'lstrip': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'maketrans': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'partition': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'replace': {
    'returns': true,
    'full': ['old', 'new', 'count'],
    'simple': ['old', 'new'],
    'colour': BlockXTextToBlocks.COLOR.TEXT,
  },
  'rfind': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'rindex': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'rjust': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'rpartition': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'rsplit': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'rstrip': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'split': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'splitlines': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'startswith': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'strip': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'swapcase': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'title': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'translate': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'upper': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'zfill': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  'decode': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.TEXT,
  },
  '__eq__': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.LOGIC,
  },
  'tobytes': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'tolist': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'release': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'cast': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.PYTHON,
  },
  'isdisjoint': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'issubset': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'issuperset': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'union': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'intersection': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'difference': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'symmetric_difference': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'update': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'intersection_update': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'difference_update': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'symmetric_difference_update': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'add': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'discard': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.SET,
  },
  'fromkeys': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  'get': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  'items': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  'keys': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  'popitem': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  'setdefault': {
    returns: false,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  'values': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
  '__enter__': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.CONTROL,
  },
  '__exit__': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.CONTROL,
  },
  'mro': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
  '__subclasses__': {
    returns: true,
    colour: BlockXTextToBlocks.COLOR.OO,
  },
};

BlockXTextToBlocks.getFunctionBlock = function(name, values, module) {
  if (values === undefined) {
    values = {};
  } // TODO: hack, we shouldn't be accessing the prototype like this


  let signature;
  let method = false;

  if (module !== undefined) {
    signature =
      BlockXTextToBlocks.prototype
      .MODULE_FUNCTION_SIGNATURES[module][name];
  } else if (name.startsWith('.')) {
    signature =
      BlockXTextToBlocks.prototype.METHOD_SIGNATURES[name.substr(1)];
    method = true;
  } else {
    signature = BlockXTextToBlocks.prototype.FUNCTION_SIGNATURES[name];
  }

  const args =
    signature.simple !== undefined ?
      signature.simple :
      signature.full !== undefined ? signature.full : [];
  const argumentsMutation = {
    '@arguments': args.length,
    '@returns': signature.returns || false,
    '@parameters': true,
    '@method': method,
    '@name': module ? module + '.' + name : name,
    '@message': signature.message ? signature.message : name,
    '@premessage': signature.premessage ? signature.premessage : '',
    '@colour': signature.colour ? signature.colour : 0,
    '@module': module || '',
  };

  for (let i = 0; i < args.length; i += 1) {
    argumentsMutation['UNKNOWN_ARG:' + i] = null;
  }

  const newBlock =
    BlockXTextToBlocks.create_block('ast_Call', null, {}, values, {
      inline: true,
    }, argumentsMutation); // Return as either statement or expression

  return BlockXTextToBlocks.xmlToString(newBlock);
};

BlockXBlockEditor.EXTRA_TOOLS = {};
const TOOLBOX_CATEGORY = {};
TOOLBOX_CATEGORY.VARIABLES = {
  name: 'Variables',
  colour: 'VARIABLES',
  custom: 'VARIABLE',
};
TOOLBOX_CATEGORY.DECISIONS = {
  name: 'Decisions',
  colour: 'LOGIC',
  blocks: [
    'if ___: pass',
    'if ___: pass\nelse: pass',
    '___ < ___',
    '___ and ___',
    'not ___',
  ],
};
TOOLBOX_CATEGORY.CALCULATIONS = {
  name: 'Calculation',
  colour: 'MATH',
  blocks: ['___ + ___', 'round(___)'],
};
TOOLBOX_CATEGORY.OUTPUT = {
  name: 'Output',
  colour: 'PLOTTING',
  blocks: [
    'print(___)',
  ],
};
TOOLBOX_CATEGORY.INPUT = {
  name: 'Input',
  colour: 'TEXT',
  blocks: ['input(\'\')'],
};
TOOLBOX_CATEGORY.VALUES = {
  name: 'Values',
  colour: 'TEXT',
  blocks: ['""', '0', 'True'],
};
TOOLBOX_CATEGORY.SEP = '<sep></sep>';
TOOLBOX_CATEGORY.CONVERSIONS = {
  name: 'Conversion',
  colour: 'TEXT',
  blocks: ['int(___)', 'float(___)', 'str(___)', 'bool(___)'],
};
TOOLBOX_CATEGORY.DICTIONARIES = {
  name: 'Dictionaries',
  colour: 'DICTIONARY',
  blocks: [
    '{\'1st key\': ___, \'2nd key\': ___, \'3rd key\': ___}',
    '{}',
    '___[\'key\']',
  ],
};
BlockXBlockEditor.prototype.TOOLBOXES = {
  //* *****************************************************
  'empty': [{
    'name': 'Empty Toolbox',
    'colour': 'PYTHON',
    'blocks': [],
  }],
  //* *****************************************************
  'minimal': [// TODO: What should live in here?
    TOOLBOX_CATEGORY.VARIABLES],
  //* *****************************************************
  'normal': [
    TOOLBOX_CATEGORY.VARIABLES,
    TOOLBOX_CATEGORY.DECISIONS,
    {
      name: 'Iteration',
      colour: 'CONTROL',
      blocks: ['for ___ in ___: pass', 'while ___: pass', 'break'],
    },
    {
      name: 'Functions',
      colour: 'FUNCTIONS',
      blocks: [
        'def ___(___): pass',
        'def ___(___: int)->str: pass',
        'return ___',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.CALCULATIONS,
    TOOLBOX_CATEGORY.OUTPUT,
    TOOLBOX_CATEGORY.INPUT,
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.VALUES,
    TOOLBOX_CATEGORY.CONVERSIONS,
    {
      name: 'Lists',
      colour: 'LIST',
      blocks: [
        '[0, 0, 0]',
        '[___, ___, ___]',
        '[]',
        '___.append(___)',
        'range(0, 10)',
      ],
    },
    TOOLBOX_CATEGORY.DICTIONARIES,
  ],
  //* *****************************************************
  'ct': [
    TOOLBOX_CATEGORY.VARIABLES,
    TOOLBOX_CATEGORY.DECISIONS,
    {
      name: 'Iteration',
      colour: 'CONTROL',
      blocks: ['for ___ in ___: pass'],
    },
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.CALCULATIONS,
    TOOLBOX_CATEGORY.OUTPUT,
    TOOLBOX_CATEGORY.INPUT,
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.VALUES,
    TOOLBOX_CATEGORY.CONVERSIONS,
    {
      name: 'Lists',
      colour: 'LIST',
      blocks: ['[0, 0, 0]', '[___, ___, ___]', '[]', '___.append(___)'],
    },
  ],
  //* *****************************************************
  'full': [
    TOOLBOX_CATEGORY.VARIABLES,
    {
      name: 'Literal Values',
      colour: 'LIST',
      blocks: [
        '0',
        '\'\'',
        'True',
        'None',
        '[___, ___, ___]',
        '(___, ___, ___)',
        '{___, ___, ___}',
        '{___: ___, ___: ___, ___: ___}',
      ],
    },
    {
      name: 'Calculations',
      colour: 'MATH',
      blocks: [
        '-___',
        '___ + ___',
        '___ >> ___',
        'abs(___)',
        'round(___)',
      ],
    },
    {
      name: 'Logic',
      colour: 'LOGIC',
      blocks: ['___ if ___ else ___',
        '___ == ___',
        '___ < ___',
        '___ in ___',
        '___ and ___',
        'not ___',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    {
      name: 'Classes',
      colour: 'OO',
      blocks: [
        'class ___: pass',
        'class ___(___): pass',
        '___.___',
        '___: ___',
        'super()',
      ],
    },
    {
      name: 'Functions',
      colour: 'FUNCTIONS',
      blocks: [
        'def ___(___): pass',
        'def ___(___: int)->str: pass',
        'return ___',
        'yield ___',
        'lambda ___: ___',
      ],
    },
    {
      name: 'Imports',
      colour: 'PYTHON',
      blocks: ['import ___',
        'from ___ import ___',
        'import ___ as ___',
        'from ___ import ___ as ___',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    {
      name: 'Control Flow',
      colour: 'CONTROL',
      blocks: [
        'if ___: pass',
        'if ___: pass\nelse: pass',
        'for ___ in ___: pass',
        'while ___: pass',
        'break',
        'continue',
        'try: pass\nexcept ___ as ___: pass',
        'raise ___',
        'assert ___',
        'with ___ as ___: pass',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.OUTPUT,
    TOOLBOX_CATEGORY.INPUT,
    {
      name: 'Files',
      colour: 'FILE',
      blocks: [
        'with open(\'\', \'r\') as ___: pass',
        '___.read()',
        '___.readlines()',
        '___.write(___)',
        '___.writelines(___)',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    {
      name: 'Conversion',
      colour: 'TEXT',
      blocks: [
        'int(___)',
        'float(___)',
        'str(___)',
        'chr(___)',
        'bool(___)',
        'list(___)',
        'dict(___)',
        'tuple(___)',
        'set(___)',
        'type(___)',
        'isinstance(___)',
      ],
    },
    {
      name: 'Builtin Functions',
      colour: 'SEQUENCES',
      blocks: [
        'len(___)',
        'sorted(___)',
        'enumerate(___)',
        'reversed(___)',
        'range(0, 10)',
        'min(___, ___)',
        'max(___, ___)',
        'sum(___)',
        'all(___)',
        'any(___)',
        'zip(___, ___)',
        'map(___, ___)',
        'filter(___, ___)',
      ],
    },
    {
      name: 'List Methods',
      colour: 'LIST',
      blocks: ['___.append(___)', '___.pop()', '___.clear()'],
    },
    {
      name: 'String Methods',
      colour: 'TEXT',
      blocks: [
        '___.startswith(\'\')',
        '___.endswith(\'\')',
        '___.replace(\'\', \'\')',
        '___.lower(\'\')',
        '___.upper(\'\')',
        '___.title(\'\')',
        '___.strip(\'\')',
        '___.split(\'\')',
        '\'\'.join(___)',
        '___.format(\'\')',
        '___.strip(\'\')',
      ],
    },
    {
      name: 'Subscripting',
      colour: 'SEQUENCES',
      blocks: [
        '___[___]',
        '___[___:___]',
        '___[___:___:___]',
      ],
    },
    {
      name: 'Generators',
      colour: 'SEQUENCES',
      blocks: [
        '[___ for ___ in ___]',
        '(___ for ___ in ___)',
        '{___ for ___ in ___}',
        '{___: ___ for ___ in ___ if ___}',
        '[___ for ___ in ___ if ___]',
        '(___ for ___ in ___ if ___)',
        '{___ for ___ in ___ if ___}',
        '{___: ___ for ___ in ___ if ___}',
      ],
    },
    {
      name: 'Comments',
      colour: 'PYTHON',
      blocks: ['# ', '"""\n"""'],
    },
    /* ,
    {name: "Weird Stuff", colour: "PYTHON", blocks: [
      "delete ___",
      "global ___"
    ]}*/
  ],
  //* *****************************************************
  'ct2': [
    {
      name: 'Memory',
      colour: 'VARIABLES',
      custom: 'VARIABLE',
      hideGettersSetters: true,
    },
    TOOLBOX_CATEGORY.SEP,
    '<category name="Expressions" expanded="true">',
    {
      name: 'Constants',
      colour: 'TEXT',
      blocks: ['""', '0', 'True', '[0, 0, 0]', '[___, ___, ___]', '[]'],
    },
    {
      name: 'Variables',
      colour: 'VARIABLES',
      blocks: ['VARIABLE'],
    },
    TOOLBOX_CATEGORY.CALCULATIONS,
    TOOLBOX_CATEGORY.CONVERSIONS,
    {
      name: 'Conditions',
      colour: 'LOGIC',
      blocks: ['___ == ___', '___ and ___', 'not ___'],
    },
    TOOLBOX_CATEGORY.INPUT,
    '</category>',
    TOOLBOX_CATEGORY.SEP,
    '<category name="Operations" expanded="true">',
    {
      name: 'Assignment',
      colour: 'VARIABLES',
      blocks: ['VARIABLE = ___', '___.append(___)'],
    },
    TOOLBOX_CATEGORY.OUTPUT,
    '</category>',
    TOOLBOX_CATEGORY.SEP,
    '<category name="Control" expanded="true">',
    {
      name: 'Decision',
      colour: 'CONTROL',
      blocks: ['if ___: pass', 'if ___: pass\nelse: pass'],
    },
    {
      name: 'Iteration',
      colour: 'CONTROL',
      blocks: ['for ___ in ___: pass'],
    },
    '</category>',
  ],
};
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_For',
  'message0': 'for each item %1 in list %2 : %3 %4',
  'args0': [{
    'type': 'input_value',
    'name': 'TARGET',
  }, {
    'type': 'input_value',
    'name': 'ITER',
  }, {
    'type': 'input_dummy',
  }, {
    'type': 'input_statement',
    'name': 'BODY',
  }],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.CONTROL,
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_ForElse',
  'message0': 'for each item %1 in list %2 : %3 %4 else: %5 %6',
  'args0': [{
    'type': 'input_value',
    'name': 'TARGET',
  }, {
    'type': 'input_value',
    'name': 'ITER',
  }, {
    'type': 'input_dummy',
  }, {
    'type': 'input_statement',
    'name': 'BODY',
  }, {
    'type': 'input_dummy',
  }, {
    'type': 'input_statement',
    'name': 'ELSE',
  }],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.CONTROL,
});

Blockly.Python['ast_For'] = function(block) {
  // For each loop.
  const argument0 =
    Blockly.Python
      .valueToCode(block, 'TARGET', Blockly.Python.ORDER_RELATIONAL) ||
    Blockly.Python.blank;

  const argument1 =
    Blockly.Python
      .valueToCode(block, 'ITER', Blockly.Python.ORDER_RELATIONAL) ||
    Blockly.Python.blank;

  const branchBody =
    Blockly.Python
      .statementToCode(block, 'BODY') ||
    Blockly.Python.PASS;

  const branchElse = Blockly.Python.statementToCode(block, 'ELSE');
  let code = 'for ' + argument0 + ' in ' + argument1 + ':\n' + branchBody;

  if (branchElse) {
    code += 'else:\n' + branchElse;
  }

  return code;
};

BlockXTextToBlocks.prototype['ast_For'] = function(node) {
  const target = node.target;
  const iter = node.iter;
  const body = node.body;
  const orelse = node.orelse;
  let blockName = 'ast_For';
  const bodies = {
    'BODY': this.convertBody(body, node),
  };

  if (orelse.length > 0) {
    blockName = 'ast_ForElse';
    bodies['ELSE'] = this.convertBody(orelse, node);
  }

  return BlockXTextToBlocks.create_block(blockName, node.lineno, {}, {
    'ITER': this.convert(iter, node),
    'TARGET': this.convert(target, node),
  }, {}, {}, bodies);
};

Blockly.Python['ast_ForElse'] = Blockly.Python['ast_For'];
BlockXTextToBlocks.prototype['ast_ForElse'] =
  BlockXTextToBlocks.prototype['ast_For'];
Blockly.Blocks['ast_If'] = {
  init: function init() {
    this.orelse_ = 0;
    this.elifs_ = 0;
    this.appendValueInput('TEST').appendField('if');
    this.appendStatementInput('BODY')
      .setCheck(null)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.LOGIC);
    this.updateShape_();
  },
  // TODO: Not mutable currently
  updateShape_: function updateShape_() {
    let i = 0;
    for (; i < this.elifs_; i++) {
      if (!this.getInput('ELIF' + i)) {
        this.appendValueInput('ELIFTEST' + i).appendField('elif');
        this.appendStatementInput('ELIFBODY' + i).setCheck(null);
      }
    } // Remove deleted inputs.


    while (this.getInput('ELIFTEST' + i)) {
      this.removeInput('ELIFTEST' + i);
      this.removeInput('ELIFBODY' + i);
      i++;
    }

    if (this.orelse_ && !this.getInput('ELSE')) {
      this.appendDummyInput('ORELSETEST').appendField('else:');
      this.appendStatementInput('ORELSEBODY').setCheck(null);
    } else if (!this.orelse_ && this.getInput('ELSE')) {
      block.removeInput('ORELSETEST');
      block.removeInput('ORELSEBODY');
    }

    for (i = 0; i < this.elifs_; i++) {
      if (this.orelse_) {
        this.moveInputBefore('ELIFTEST' + i, 'ORELSETEST');
        this.moveInputBefore('ELIFBODY' + i, 'ORELSETEST');
      } else if (i + 1 < this.elifs_) {
        this.moveInputBefore('ELIFTEST' + i, 'ELIFTEST' + (i + 1));
        this.moveInputBefore('ELIFBODY' + i, 'ELIFBODY' + (i + 1));
      }
    }
  },

  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('orelse', this.orelse_);
    container.setAttribute('elifs', this.elifs_);
    return container;
  },

  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.orelse_ = 'true' === xmlElement.getAttribute('orelse');
    this.elifs_ = parseInt(xmlElement.getAttribute('elifs'), 10) || 0;
    this.updateShape_();
  },
};

Blockly.Python['ast_If'] = function(block) {
  // Test
  const test = 'if ' + (
    Blockly.Python.valueToCode(block, 'TEST', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank
  ) +
    ':\n';
  const body =
    Blockly.Python.statementToCode(block, 'BODY') ||
    Blockly.Python.PASS;
  const elifs = new Array(block.elifs_);

  for (let i = 0; i < block.elifs_; i++) {
    let clause =
      'elif ' + (
        Blockly.Python
          .valueToCode(block, 'ELIFTEST' + i, Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank
      );
    clause +=
      ':\n' +
      (
        Blockly.Python
          .statementToCode(block, 'ELIFBODY' + i) ||
        Blockly.Python.PASS
      );
    elifs[i] = clause;
  } // Orelse:


  let orelse = '';

  if (this.orelse_) {
    orelse = 'else:\n' + (
      Blockly.Python
        .statementToCode(block, 'ORELSEBODY') || Blockly.Python.PASS);
  }

  return test + body + elifs.join('') + orelse;
};

BlockXTextToBlocks.prototype['ast_If'] = function(node) {
  const test = node.test;
  const body = node.body;
  let orelse = node.orelse;
  let hasOrelse = false;
  let elifCount = 0;
  const values = {
    'TEST': this.convert(test, node),
  };
  const statements = {
    'BODY': this.convertBody(body, node),
  };

  while (orelse !== undefined && orelse.length > 0) {
    if (orelse.length === 1) {
      if (orelse[0]._astname === 'If') {
        // This is an ELIF
        this.heights.shift();
        values['ELIFTEST' + elifCount] = this.convert(orelse[0].test, node);
        statements['ELIFBODY' + elifCount] =
          this.convertBody(orelse[0].body, node);
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

  return BlockXTextToBlocks
    .create_block('ast_If', node.lineno, {}, values, {}, {
      '@orelse': hasOrelse,
      '@elifs': elifCount,
    }, statements);
};

Blockly.Blocks['ast_While'] = {
  init: function init() {
    this.orelse_ = 0;
    this.appendValueInput('TEST').appendField('while');
    this.appendStatementInput('BODY')
      .setCheck(null)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.CONTROL);
    this.updateShape_();
  },
  // TODO: Not mutable currently
  updateShape_: function updateShape_() {
    if (this.orelse_ && !this.getInput('ELSE')) {
      this.appendDummyInput('ORELSETEST').appendField('else:');
      this.appendStatementInput('ORELSEBODY').setCheck(null);
    } else if (!this.orelse_ && this.getInput('ELSE')) {
      block.removeInput('ORELSETEST');
      block.removeInput('ORELSEBODY');
    }
  },

  /**
   * Create XML to represent the (non-editable) name and arguments.
//    * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('orelse', this.orelse_);
  },

  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.orelse_ = 'true' === xmlElement.getAttribute('orelse');
    this.updateShape_();
  },
};

Blockly.Python['ast_While'] = function(block) {
  // Test
  const test = 'while ' + (
    Blockly.Python.valueToCode(block, 'TEST', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank
  ) + ':\n'; // Body:

  const body =
    Blockly.Python.statementToCode(block, 'BODY') ||
    Blockly.Python.PASS; // Orelse:

  let orelse = '';

  if (this.orelse_) {
    orelse = 'else:\n' + (
      Blockly.Python.statementToCode(block, 'ORELSEBODY') ||
      Blockly.Python.PASS
    );
  }

  return test + body + orelse;
};

BlockXTextToBlocks.prototype['ast_While'] = function(node) {
  const test = node.test;
  const body = node.body;
  const orelse = node.orelse;
  const values = {
    'TEST': this.convert(test, node),
  };
  const statements = {
    'BODY': this.convertBody(body, node),
  };
  let hasOrelse = false;

  if (orelse !== null && orelse.length > 0) {
    statements['ORELSEBODY'] = this.convertBody(orelse, node);
    hasOrelse = true;
  }

  return BlockXTextToBlocks
    .create_block('ast_While', node.lineno, {}, values, {}, {
      '@orelse': hasOrelse,
    }, statements);
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Num',
  'message0': '%1',
  'args0': [{
    'type': 'field_number',
    'name': 'NUM',
    'value': 0,
  }],
  'output': 'Number',
  'colour': BlockXTextToBlocks.COLOR.MATH,
});

Blockly.Python['ast_Num'] = function(block) {
  // Numeric value.
  let code = parseFloat(block.getFieldValue('NUM'));
  let order;

  if (code == Infinity) {
    code = 'float("inf")';
    order = Blockly.Python.ORDER_FUNCTION_CALL;
  } else if (code == -Infinity) {
    code = '-float("inf")';
    order = Blockly.Python.ORDER_UNARY_SIGN;
  } else {
    order =
      code < 0 ? Blockly.Python.ORDER_UNARY_SIGN : Blockly.Python.ORDER_ATOMIC;
  }

  return [code, order];
};

BlockXTextToBlocks.prototype['ast_Num'] = function(node) {
  const n = node.n;
  return BlockXTextToBlocks.create_block('ast_Num', node.lineno, {
    'NUM': Sk.ffi.remapToJs(n),
  });
};

BlockXTextToBlocks.BINOPS = [[
  '+',
  'Add',
  Blockly.Python.ORDER_ADDITIVE,
  'Return the sum of the two numbers.',
  'increase',
  'by',
], [
  '-',
  'Sub',
  Blockly.Python.ORDER_ADDITIVE,
  'Return the difference of the two numbers.',
  'decrease',
  'by',
], [
  '*',
  'Mult',
  Blockly.Python.ORDER_MULTIPLICATIVE,
  'Return the product of the two numbers.',
  'multiply',
  'by',
], [
  '/',
  'Div',
  Blockly.Python.ORDER_MULTIPLICATIVE,
  'Return the quotient of the two numbers.',
  'divide',
  'by',
], [
  '%',
  'Mod',
  Blockly.Python.ORDER_MULTIPLICATIVE,
  'Return the remainder of the first number divided by the second number.',
  'modulo',
  'by',
], [
  '**',
  'Pow',
  Blockly.Python.ORDER_EXPONENTIATION,
  'Return the first number raised to the power of the second number.',
  'raise',
  'to',
], [
  '//',
  'FloorDiv',
  Blockly.Python.ORDER_MULTIPLICATIVE,
  'Return the truncated quotient of the two numbers.',
  'floor divide',
  'by',
], [
  '<<',
  'LShift',
  Blockly.Python.ORDER_BITWISE_SHIFT,
  'Return the left number left shifted by the right number.',
  'left shift',
  'by',
], [
  '>>',
  'RShift',
  Blockly.Python.ORDER_BITWISE_SHIFT,
  'Return the left number right shifted by the right number.',
  'right shift',
  'by',
], [
  '|',
  'BitOr',
  Blockly.Python.ORDER_BITWISE_OR,
  'Returns the bitwise OR of the two values.',
  'bitwise OR',
  'using',
], [
  '^',
  'BitXor',
  Blockly.Python.ORDER_BITWISE_XOR,
  'Returns the bitwise XOR of the two values.',
  'bitwise XOR',
  'using',
], [
  '&',
  'BitAnd',
  Blockly.Python.ORDER_BITWISE_AND,
  'Returns the bitwise AND of the two values.',
  'bitwise AND',
  'using',
], [
  '@',
  'MatMult',
  Blockly.Python.ORDER_MULTIPLICATIVE,
  'Return the matrix multiplication of the two numbers.',
  'matrix multiply',
  'by',
]];
const BINOPS_SIMPLE = ['Add', 'Sub', 'Mult', 'Div', 'Mod', 'Pow'];
const BINOPS_BLOCKLY_DISPLAY_FULL =
  BlockXTextToBlocks.BINOPS.map(function(binop) {
    return [binop[0], binop[1]];
  });
const BINOPS_BLOCKLY_DISPLAY =
  BINOPS_BLOCKLY_DISPLAY_FULL.filter(function(binop) {
    return BINOPS_SIMPLE.indexOf(binop[1]) >= 0;
  });
BlockXTextToBlocks.BINOPS_AUGASSIGN_DISPLAY_FULL =
  BlockXTextToBlocks.BINOPS.map(function(binop) {
    return [binop[4], binop[1]];
  });
BlockXTextToBlocks.BINOPS_AUGASSIGN_DISPLAY =
  BlockXTextToBlocks.BINOPS_AUGASSIGN_DISPLAY_FULL.filter(function(binop) {
    return BINOPS_SIMPLE.indexOf(binop[1]) >= 0;
  });
const BINOPS_BLOCKLY_GENERATE = {};
BlockXTextToBlocks.BINOPS_AUGASSIGN_PREPOSITION = {};
BlockXTextToBlocks.BINOPS.forEach(function(binop) {
  BINOPS_BLOCKLY_GENERATE[binop[1]] = [' ' + binop[0], binop[2]];
  BlockXTextToBlocks.BINOPS_AUGASSIGN_PREPOSITION[binop[1]] =
    binop[5]; // Blockly.Constants.Math.TOOLTIPS_BY_OP[binop[1]] = binop[3];
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_BinOpFull',
  'message0': '%1 %2 %3',
  'args0': [{
    'type': 'input_value',
    'name': 'A',
  }, {
    'type': 'field_dropdown',
    'name': 'OP',
    'options': BINOPS_BLOCKLY_DISPLAY_FULL,
  }, {
    'type': 'input_value',
    'name': 'B',
  }],
  'inputsInline': true,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.MATH,
  // "extensions": ["math_op_tooltip"]

});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_BinOp',
  'message0': '%1 %2 %3',
  'args0': [{
    'type': 'input_value',
    'name': 'A',
  }, {
    'type': 'field_dropdown',
    'name': 'OP',
    'options': BINOPS_BLOCKLY_DISPLAY,
  }, {
    'type': 'input_value',
    'name': 'B',
  }],
  'inputsInline': true,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.MATH,
  // "extensions": ["math_op_tooltip"]

});

Blockly.Python['ast_BinOp'] = function(block) {
  // Basic arithmetic operators, and power.
  const tuple = BINOPS_BLOCKLY_GENERATE[block.getFieldValue('OP')];
  const operator = tuple[0] + ' ';
  const order = tuple[1];
  const argument0 =
    Blockly.Python.valueToCode(block, 'A', order) || Blockly.Python.blank;
  const argument1 =
    Blockly.Python.valueToCode(block, 'B', order) || Blockly.Python.blank;
  const code = argument0 + operator + argument1;
  return [code, order];
};

BlockXTextToBlocks.prototype['ast_BinOp'] = function(node) {
  const left = node.left;
  const op = node.op.name;
  const right = node.right;
  const blockName =
    BINOPS_SIMPLE.indexOf(op) >= 0 ? 'ast_BinOp' : 'ast_BinOpFull';
  return BlockXTextToBlocks.create_block(blockName, node.lineno, {
    'OP': op,
  }, {
    'A': this.convert(left, node),
    'B': this.convert(right, node),
  }, {
    'inline': true,
  });
};

Blockly.Python['ast_BinOpFull'] = Blockly.Python['ast_BinOp'];
BlockXTextToBlocks.prototype['ast_BinOpFull'] =
  BlockXTextToBlocks.prototype['ast_BinOp'];
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Name',
  'message0': '%1',
  'args0': [{
    'type': 'field_variable',
    'name': 'VAR',
    'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
  }],
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.VARIABLES,
  'extensions': ['contextMenu_variableSetterGetter_forBlockX'],
});
/**
 * Mixin to add context menu items to create getter/setter blocks for this
 * setter/getter.
 * Used by blocks 'ast_Name' and 'ast_Assign'.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */

Blockly.Constants.Variables
  .CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN_FOR_BLOCK_MIRROR = {
  /**
* Add menu option to create getter/setter block for this setter/getter.
* @param {!Array} options List of menu options to add to.
* @this Blockly.Block
*/
  customContextMenu: function customContextMenu(options) {
    let name;

    if (!this.isInFlyout) {
      // Getter blocks have the option to create a setter block,
      // and vice versa.
      let oppositeType;
      let contextMenuMsg;

      if (this.type === 'ast_Name') {
        oppositeType = 'ast_Assign';
        contextMenuMsg = Blockly.Msg['VARIABLES_GET_CREATE_SET'];
      } else {
        oppositeType = 'ast_Name';
        contextMenuMsg = Blockly.Msg['VARIABLES_SET_CREATE_GET'];
      }

      const option = {
        enabled: this.workspace.remainingCapacity() > 0,
      };
      name = this.getField('VAR').getText();
      option.text = contextMenuMsg.replace('%1', name);
      const xmlField = document.createElement('field');
      xmlField.setAttribute('name', 'VAR');
      xmlField.appendChild(document.createTextNode(name));
      const xmlBlock = document.createElement('block');
      xmlBlock.setAttribute('type', oppositeType);
      xmlBlock.appendChild(xmlField);
      option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
      options.push(option);
      // Getter blocks have the option to rename or delete that variable.
    } else {
      if (this.type === 'ast_Name' ||
        this.type === 'variables_get_reporter') {
        const renameOption = {
          text: Blockly.Msg.RENAME_VARIABLE,
          enabled: true,
          callback: Blockly.Constants.Variables
            // eslint-disable-next-line new-cap
            .RENAME_OPTION_CALLBACK_FACTORY(this),
        };
        name = this.getField('VAR').getText();
        const deleteOption = {
          text: Blockly.Msg.DELETE_VARIABLE.replace('%1', name),
          enabled: true,
          callback: Blockly.Constants.Variables
            // eslint-disable-next-line new-cap
            .DELETE_OPTION_CALLBACK_FACTORY(this),
        };
        options.unshift(renameOption);
        options.unshift(deleteOption);
      }
    }
  },
};
Blockly.Extensions
  .registerMixin('contextMenu_variableSetterGetter_forBlockX',
    Blockly.Constants.Variables
      .CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN_FOR_BLOCK_MIRROR);

Blockly.Python['ast_Name'] = function(block) {
  // Variable getter.
  const code =
    Blockly.Python.variableDB_
      .getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

BlockXTextToBlocks.prototype['ast_Name'] = function(node) {
  const id = node.id;

  if (id.v == Blockly.Python.blank) {
    return null;
  } else {
    return BlockXTextToBlocks.create_block('ast_Name', node.lineno, {
      'VAR': id.v,
    });
  }
};

Blockly.Blocks['ast_Assign'] = {
  init: function init() {
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.VARIABLES);
    this.targetCount_ = 1;
    this.simpleTarget_ = true;
    this.updateShape_();
    Blockly.Extensions.apply('contextMenu_variableSetterGetter', this, false);
  },
  updateShape_: function updateShape_() {
    if (!this.getInput('VALUE')) {
      this.appendDummyInput().appendField('set');
      this.appendValueInput('VALUE').appendField('=');
    }

    let i = 0;

    if (this.targetCount_ === 1 && this.simpleTarget_) {
      this.setInputsInline(true);

      if (!this.getInput('VAR_ANCHOR')) {
        this.appendDummyInput('VAR_ANCHOR')
          .appendField(new Blockly.FieldVariable('variable'), 'VAR');
      }
      this.moveInputBefore('VAR_ANCHOR', 'VALUE');
    } else {
      this.setInputsInline(true); // Add new inputs.

      for (; i < this.targetCount_; i++) {
        if (!this.getInput('TARGET' + i)) {
          const input = this.appendValueInput('TARGET' + i);

          if (i !== 0) {
            input.appendField('and').setAlign(Blockly.ALIGN_RIGHT);
          }
        }

        this.moveInputBefore('TARGET' + i, 'VALUE');
      } // Kill simple VAR


      if (this.getInput('VAR_ANCHOR')) {
        this.removeInput('VAR_ANCHOR');
      }
    } // Remove deleted inputs.


    while (this.getInput('TARGET' + i)) {
      this.removeInput('TARGET' + i);
      i++;
    }
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('targets', this.targetCount_);
    container.setAttribute('simple', this.simpleTarget_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.targetCount_ = parseInt(xmlElement.getAttribute('targets'), 10);
    this.simpleTarget_ = 'true' === xmlElement.getAttribute('simple');
    this.updateShape_();
  },
};

Blockly.Python['ast_Assign'] = function(block) {
  // Create a list with any number of elements of any type.
  const value =
    Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  const targets = new Array(block.targetCount_);

  if (block.targetCount_ === 1 && block.simpleTarget_) {
    targets[0] =
      Blockly.Python.variableDB_
        .getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  } else {
    for (let i = 0; i < block.targetCount_; i++) {
      targets[i] =
        Blockly.Python
          .valueToCode(block, 'TARGET' + i, Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank;
    }
  }

  return targets.join(' = ') + ' = ' + value + '\n';
};

BlockXTextToBlocks.prototype['ast_Assign'] = function(node) {
  const targets = node.targets;
  const value = node.value;
  let values;
  const fields = {};
  const simpleTarget = targets.length === 1 && targets[0]._astname === 'Name';

  if (simpleTarget) {
    values = {};
    fields['VAR'] = Sk.ffi.remapToJs(targets[0].id);
  } else {
    values = this.convertElements('TARGET', targets, node);
  }

  values['VALUE'] = this.convert(value, node);
  return BlockXTextToBlocks
    .create_block('ast_Assign', node.lineno, fields, values, {
      'inline': 'true',
    }, {
      '@targets': targets.length,
      '@simple': simpleTarget,
    });
};

Blockly.Blocks['ast_AnnAssignFull'] = {
  init: function init() {
    this.appendValueInput('TARGET').setCheck(null).appendField('set');
    this.appendValueInput('ANNOTATION').setCheck(null).appendField(':');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.VARIABLES);
    this.initialized_ = true;
    this.updateShape_();
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('initialized', this.initialized_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.initialized_ = 'true' === xmlElement.getAttribute('initialized');
    this.updateShape_();
  },
  updateShape_: function updateShape_() {
    // Add new inputs.
    if (this.initialized_ && !this.getInput('VALUE')) {
      this.appendValueInput('VALUE')
        .appendField('=')
        .setAlign(Blockly.ALIGN_RIGHT);
    }

    if (!this.initialized_ && this.getInput('VALUE')) {
      this.removeInput('VALUE');
    }
  },
};
BlockXTextToBlocks.ANNOTATION_OPTIONS = [
  ['int', 'int'],
  ['float', 'float'],
  ['str', 'str'],
  ['bool', 'bool'],
  ['None', 'None'],
];
BlockXTextToBlocks.ANNOTATION_GENERATE = {};
BlockXTextToBlocks.ANNOTATION_OPTIONS.forEach(function(ann) {
  BlockXTextToBlocks.ANNOTATION_GENERATE[ann[1]] = ann[0];
});
Blockly.Blocks['ast_AnnAssign'] = {
  init: function init() {
    this.appendDummyInput()
      .appendField('set')
      .appendField(new Blockly.FieldVariable('item'), 'TARGET')
      .appendField(':')
      .appendField(new Blockly
        .FieldDropdown(BlockXTextToBlocks.ANNOTATION_OPTIONS),
        'ANNOTATION');
    this.appendValueInput('VALUE').setCheck(null).appendField('=');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.VARIABLES);
    this.strAnnotations_ = false;
    this.initialized_ = true;
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('str', this.strAnnotations_);
    container.setAttribute('initialized', this.initialized_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.strAnnotations_ = 'true' === xmlElement.getAttribute('str');
    this.initialized_ = 'true' === xmlElement.getAttribute('initialized');
    this.updateShape_();
  },
  updateShape_: function updateShape_() {
    // Add new inputs.
    if (this.initialized_ && !this.getInput('VALUE')) {
      this.appendValueInput('VALUE')
        .appendField('=')
        .setAlign(Blockly.ALIGN_RIGHT);
    }

    if (!this.initialized_ && this.getInput('VALUE')) {
      this.removeInput('VALUE');
    }
  },
};

Blockly.Python['ast_AnnAssignFull'] = function(block) {
  // Create a list with any number of elements of any type.
  const target =
    Blockly.Python
      .valueToCode(block, 'TARGET', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  const annotation =
    Blockly.Python
      .valueToCode(block, 'ANNOTATION', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  let value = '';

  if (this.initialized_) {
    value = ' = ' +
      Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  }

  return target + ': ' + annotation + value + '\n';
};

Blockly.Python['ast_AnnAssign'] = function(block) {
  // Create a list with any number of elements of any type.
  const target =
    Blockly.Python.variableDB_
      .getName(block.getFieldValue('TARGET'), Blockly.Variables.NAME_TYPE);
  let annotation = block.getFieldValue('ANNOTATION');

  if (block.strAnnotations_) {
    annotation = Blockly.Python.quote_(annotation);
  }

  let value = '';

  if (this.initialized_) {
    value = ' = ' +
      Blockly.Python
        .valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  }

  return target + ': ' + annotation + value + '\n';
};

BlockXTextToBlocks.prototype.getBuiltinAnnotation = function(annotation) {
  let result = false; // Can we turn it into a basic type?

  if (annotation._astname === 'Name') {
    result = Sk.ffi.remapToJs(annotation.id);
  } else if (annotation._astname === 'Str') {
    result = Sk.ffi.remapToJs(annotation.s);
  } // Potentially filter out unknown annotations


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

BlockXTextToBlocks.prototype['ast_AnnAssign'] = function(node) {
  const target = node.target;
  const annotation = node.annotation;
  const value = node.value;
  const values = {};
  const mutations = {
    '@initialized': false,
  };

  if (value !== null) {
    values['VALUE'] = this.convert(value, node);
    mutations['@initialized'] = true;
  } // TODO: This controls whether the annotation is stored in __annotations__

  const builtinAnnotation = this.getBuiltinAnnotation(annotation);

  if (target._astname === 'Name' &&
    target.id.v !== Blockly.Python.blank &&
    builtinAnnotation !== false) {
    mutations['@str'] = annotation._astname === 'Str';
    return BlockXTextToBlocks.create_block('ast_AnnAssign', node.lineno, {
      'TARGET': target.id.v,
      'ANNOTATION': builtinAnnotation,
    }, values, {
      'inline': 'true',
    }, mutations);
  } else {
    values['TARGET'] = this.convert(target, node);
    values['ANNOTATION'] = this.convert(annotation, node);
    return BlockXTextToBlocks
      .create_block('ast_AnnAssignFull', node.lineno, {}, values, {
        'inline': 'true',
      }, mutations);
  }
};

Blockly.Blocks['ast_AugAssign'] = {
  init: function init() {
    const this_ = this;
    this.simpleTarget_ = true;
    this.allOptions_ = false;
    this.initialPreposition_ = 'by';
    this.appendDummyInput('OP')
      .appendField(new Blockly.FieldDropdown(
        function() {
        return this_.allOptions_ ?
          BlockXTextToBlocks.BINOPS_AUGASSIGN_DISPLAY_FULL :
          BlockXTextToBlocks.BINOPS_AUGASSIGN_DISPLAY;
      }, function(value) {
        const block = this_.sourceBlock_;
        block.updatePreposition_(value);
      }),
      'OP_NAME')
      .appendField(' ');
    this.appendDummyInput('PREPOSITION_ANCHOR')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('by', 'PREPOSITION');
    this.appendValueInput('VALUE');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.VARIABLES);
    this.updateShape_();
    this.updatePreposition_(this.initialPreposition_);
  },
  updatePreposition_: function updatePreposition_(value) {
    const preposition =
      BlockXTextToBlocks.BINOPS_AUGASSIGN_PREPOSITION[value];
    this.setFieldValue(preposition, 'PREPOSITION');
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('simple', this.simpleTarget_);
    container.setAttribute('options', this.allOptions_);
    container.setAttribute('preposition', this.initialPreposition_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.simpleTarget_ = 'true' === xmlElement.getAttribute('simple');
    this.allOptions_ = 'true' === xmlElement.getAttribute('options');
    this.initialPreposition_ = xmlElement.getAttribute('preposition');
    this.updateShape_();
    this.updatePreposition_(this.initialPreposition_);
  },
  updateShape_: function updateShape_() {
    // Add new inputs.
    this.getField('OP_NAME').getOptions(false);

    if (this.simpleTarget_) {
      if (!this.getInput('VAR_ANCHOR')) {
        this.appendDummyInput('VAR_ANCHOR')
          .appendField(new Blockly.FieldVariable('variable'), 'VAR');
        this.moveInputBefore('VAR_ANCHOR', 'PREPOSITION_ANCHOR');
      }

      if (this.getInput('TARGET')) {
        this.removeInput('TARGET');
      }
    } else {
      if (this.getInput('VAR_ANCHOR')) {
        this.removeInput('VAR_ANCHOR');
      }

      if (!this.getInput('TARGET')) {
        this.appendValueInput('TARGET');
        this.moveInputBefore('TARGET', 'PREPOSITION_ANCHOR');
      }
    }
  },
};

Blockly.Python['ast_AugAssign'] = function(block) {
  // Create a list with any number of elements of any type.
  let target;

  if (block.simpleTarget_) {
    target = Blockly.Python.variableDB_
      .getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  } else {
    target =
      Blockly.Python.valueToCode(block, 'TARGET', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  }

  const operator = BINOPS_BLOCKLY_GENERATE[block.getFieldValue('OP_NAME')][0];
  const value =
    Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  return target + operator + '= ' + value + '\n';
};

BlockXTextToBlocks.prototype['ast_AugAssign'] = function(node) {
  const target = node.target;
  const op = node.op.name;
  const value = node.value;
  const values = {
    'VALUE': this.convert(value, node),
  };
  const fields = {
    'OP_NAME': op,
  };
  const simpleTarget = target._astname === 'Name';

  if (simpleTarget) {
    fields['VAR'] = Sk.ffi.remapToJs(target.id);
  } else {
    values['TARGET'] = this.convert(value, node);
  }

  const preposition = op;
  const allOptions = BINOPS_SIMPLE.indexOf(op) === -1;
  return BlockXTextToBlocks
    .create_block('ast_AugAssign', node.lineno, fields, values, {
      'inline': 'true',
    }, {
      '@options': allOptions,
      '@simple': simpleTarget,
      '@preposition': preposition,
    });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Str',
  'message0': '%1',
  'args0': [{
    'type': 'field_input',
    'name': 'TEXT',
    'value': '',
  }],
  'output': 'String',
  'colour': BlockXTextToBlocks.COLOR.TEXT,
  'extensions': ['text_quotes'],
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_StrChar',
  'message0': '%1',
  'args0': [{
    'type': 'field_dropdown',
    'name': 'TEXT',
    'options': [['\\n', '\n'], ['\\t', '\t']],
  }],
  'output': 'String',
  'colour': BlockXTextToBlocks.COLOR.TEXT,
  'extensions': ['text_quotes'],
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_StrMultiline',
  'message0': '%1',
  'args0': [{
    'type': 'field_multilinetext',
    'name': 'TEXT',
    'value': '',
  }],
  'output': 'String',
  'colour': BlockXTextToBlocks.COLOR.TEXT,
  'extensions': ['text_quotes'],
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_StrDocstring',
  'message0': 'Docstring: %1 %2',
  'args0': [{
    'type': 'input_dummy',
  }, {
    'type': 'field_multilinetext',
    'name': 'TEXT',
    'value': '',
  }],
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.TEXT,
});
Blockly.Blocks['ast_Image'] = {
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.TEXT);
    // this.src_ = 'loading.png';
    this.updateShape_();
    this.setOutput(true);
  },
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('src', this.src_);
    return container;
  },
  domToMutation: function domToMutation(xmlElement) {
    this.src_ = xmlElement.getAttribute('src');
    this.updateShape_();
  },
  updateShape_: function updateShape_() {
    let image = this.getInput('IMAGE');

    if (!image) {
      image = this.appendDummyInput('IMAGE');
      image.appendField(new Blockly.FieldImage(this.src_, 40, 40, {
        alt: this.src_,
        flipRtl: 'FALSE',
      }));
    }

    const imageField = image.fieldRow[0];
    imageField.setValue(this.src_);
  },
};
Blockly.Python['ast_Str'] = function(block) {
  // Text value
  let code = Blockly.Python.quote_(block.getFieldValue('TEXT'));
  code = code.replace('\n', 'n');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['ast_StrChar'] = function(block) {
  // Text value
  const value = block.getFieldValue('TEXT');

  switch (value) {
    case '\n':
      return ['\'\\n\'', Blockly.Python.ORDER_ATOMIC];

    case '\t':
      return ['\'\\t\'', Blockly.Python.ORDER_ATOMIC];
  }
};

Blockly.Python['ast_Image'] = function(block) {
  // Text value
  // Blockly.Python.definitions_["import_image"] = "from image import Image";
  const code = Blockly.Python.quote_(block.src_);
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['ast_StrMultiline'] = function(block) {
  // Text value
  const code = Blockly.Python.multiline_quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['ast_StrDocstring'] = function(block) {
  // Text value.
  let code = block.getFieldValue('TEXT');

  if (code.charAt(0) !== '\n') {
    code = '\n' + code;
  }

  if (code.charAt(code.length - 1) !== '\n') {
    code = code + '\n';
  }

  return Blockly.Python.multiline_quote_(code) + '\n';
};

BlockXTextToBlocks.prototype.isSingleChar = function(text) {
  return text === '\n' || text === '\t';
};

BlockXTextToBlocks.prototype.isDocString = function(node, parent) {
  return parent._astname === 'Expr' &&
    parent._parent &&
    ['FunctionDef', 'ClassDef'].indexOf(parent._parent._astname) !== -1 &&
    parent._parent.body[0] === parent;
};

BlockXTextToBlocks.prototype.isSimpleString = function(text) {
  return text.split('\n').length <= 2 && text.length <= 40;
};

BlockXTextToBlocks.prototype.dedent = function(text, levels, isDocString) {
  if (!isDocString && text.charAt(0) === '\n') {
    return text;
  }

  const split = text.split('\n');
  const indentation = '    '.repeat(levels);
  const recombined = []; // Are all lines indented?

  for (let i = 0; i < split.length; i++) {
    // This was a blank line, add it unchanged unless its the first line
    if (split[i] === '') {
      if (i !== 0) {
        recombined.push('');
      } // If it has our ideal indentation, add it without indentation
    } else if (split[i].startsWith(indentation)) {
      const unindentedLine = split[i].substr(indentation.length);

      if (unindentedLine !== '' || i !== split.length - 1) {
        recombined.push(unindentedLine);
      } // If it's the first line, then add it unmodified
    } else if (i === 0) {
      recombined.push(split[i]);
      // This whole structure cannot be uniformly dedented, better give up.
    } else {
      return text;
    }
  }

  return recombined.join('\n');
}; // TODO: Handle indentation intelligently


BlockXTextToBlocks.prototype['ast_Str'] = function(node, parent) {
  const s = node.s;
  const text = Sk.ffi.remapToJs(s);
  const regex =
    BlockXTextEditor
      .REGEX_PATTERNS[this.BlockX.configuration.imageDetection];
  // console.log(text, regex.test(JSON.stringify(text)));

  if (regex.test(JSON.stringify(text))) {
    // if (text.startsWith("http") && text.endsWith(".png")) {
    return BlockXTextToBlocks
      .create_block('ast_Image', node.lineno, {}, {}, {}, {
        '@src': text,
      });
  } else if (this.isSingleChar(text)) {
    return BlockXTextToBlocks.create_block('ast_StrChar', node.lineno, {
      'TEXT': text,
    });
  } else if (this.isDocString(node, parent)) {
    const dedented = this.dedent(text, this.levelIndex - 1, true);
    return [BlockXTextToBlocks
      .create_block('ast_StrDocstring', node.lineno, {
        'TEXT': dedented,
      })];
  } else if (text.indexOf('\n') === -1) {
    return BlockXTextToBlocks.create_block('ast_Str', node.lineno, {
      'TEXT': text,
    });
  } else {
    const _dedented = this.dedent(text, this.levelIndex - 1, false);

    return BlockXTextToBlocks
      .create_block('ast_StrMultiline', node.lineno, {
        'TEXT': _dedented,
      });
  }
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Expr',
  'message0': 'do nothing with %1',
  'args0': [{
    'type': 'input_value',
    'name': 'VALUE',
  }],
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.PYTHON,
});

Blockly.Python['ast_Expr'] = function(block) {
  // Numeric value.
  const value =
    Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) ||
    Blockly.Python.blank; // TODO: Assemble JavaScript into code variable.

  return value + '\n';
};

BlockXTextToBlocks.prototype['ast_Expr'] = function(node, parent) {
  const value = node.value;
  const converted = this.convert(value, node);

  if (converted.constructor === Array) {
    return converted[0];
  } else if (this.isTopLevel(parent)) {
    return [this.convert(value, node)];
  } else {
    return BlockXTextToBlocks.create_block('ast_Expr', node.lineno, {}, {
      'VALUE': this.convert(value, node),
    });
  }
};

BlockXTextToBlocks.UNARYOPS = [
  ['+', 'UAdd', 'Do nothing to the number'],
  ['-', 'USub', 'Make the number negative'],
  ['not', 'Not', 'Return the logical opposite of the value.'],
  ['~', 'Invert', 'Take the bit inversion of the number'],
];
BlockXTextToBlocks.UNARYOPS.forEach(function(unaryop) {
  // Blockly.Constants.Math.TOOLTIPS_BY_OP[unaryop[1]] = unaryop[2];
  const fullName = 'ast_UnaryOp' + unaryop[1];
  BlockXTextToBlocks.BLOCKS.push({
    'type': fullName,
    'message0': unaryop[0] + ' %1',
    'args0': [{
      'type': 'input_value',
      'name': 'VALUE',
    }],
    'inputsInline': false,
    'output': null,
    'colour': unaryop[1] === 'Not' ?
      BlockXTextToBlocks.COLOR.LOGIC :
      BlockXTextToBlocks.COLOR.MATH,
  });

  Blockly.Python[fullName] = function(block) {
    // Basic arithmetic operators, and power.
    const order = unaryop[1] === 'Not' ?
      Blockly.Python.ORDER_LOGICAL_NOT :
      Blockly.Python.ORDER_UNARY_SIGN;
    const argument1 =
      Blockly.Python.valueToCode(block, 'VALUE', order) ||
      Blockly.Python.blank;
    const code = unaryop[0] + (unaryop[1] === 'Not' ? ' ' : '') + argument1;
    return [code, order];
  };
});

BlockXTextToBlocks.prototype['ast_UnaryOp'] = function(node) {
  const op = node.op.name;
  const operand = node.operand;
  return BlockXTextToBlocks
    .create_block('ast_UnaryOp' + op, node.lineno, {}, {
      'VALUE': this.convert(operand, node),
    }, {
      'inline': false,
    });
};

BlockXTextToBlocks.BOOLOPS = [
  ['and', 'And', Blockly.Python.ORDER_LOGICAL_AND,
    'Return whether the left and right both evaluate to True.'],
  ['or', 'Or', Blockly.Python.ORDER_LOGICAL_OR,
    'Return whether either the left or right evaluate to True.'],
];
const BOOLOPS_BLOCKLY_DISPLAY =
  BlockXTextToBlocks.BOOLOPS.map(function(boolop) {
    return [boolop[0], boolop[1]];
  });
const BOOLOPS_BLOCKLY_GENERATE = {};
BlockXTextToBlocks.BOOLOPS.forEach(function(boolop) {
  BOOLOPS_BLOCKLY_GENERATE[boolop[1]] = [' ' + boolop[0] + ' ', boolop[2]];
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_BoolOp',
  'message0': '%1 %2 %3',
  'args0': [{
    'type': 'input_value',
    'name': 'A',
  }, {
    'type': 'field_dropdown',
    'name': 'OP',
    'options': BOOLOPS_BLOCKLY_DISPLAY,
  }, {
    'type': 'input_value',
    'name': 'B',
  }],
  'inputsInline': true,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.LOGIC,
});

Blockly.Python['ast_BoolOp'] = function(block) {
  // Operations 'and', 'or'.
  const operator = block.getFieldValue('OP') === 'And' ? 'and' : 'or';
  const order = operator === 'and' ?
    Blockly.Python.ORDER_LOGICAL_AND :
    Blockly.Python.ORDER_LOGICAL_OR;
  const argument0 =
    Blockly.Python.valueToCode(block, 'A', order) || Blockly.Python.blank;
  const argument1 =
    Blockly.Python.valueToCode(block, 'B', order) || Blockly.Python.blank;
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

BlockXTextToBlocks.prototype['ast_BoolOp'] = function(node) {
  const op = node.op;
  const values = node.values;
  let resultBlock = this.convert(values[0], node);

  for (let i = 1; i < values.length; i += 1) {
    resultBlock =
      BlockXTextToBlocks.create_block('ast_BoolOp', node.lineno, {
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

BlockXTextToBlocks.COMPARES = [
  ['==', 'Eq',
    'Return whether the two values are equal.'],
  ['!=', 'NotEq',
    'Return whether the two values are not equal.'],
  ['<', 'Lt',
    'Return whether the left value is less than the right value.'],
  ['<=', 'LtE',
    'Return whether the left value is less than or equal to the right value.'],
  ['>', 'Gt',
    'Return whether the left value is greater than the right value.'],
  ['>=', 'GtE',
    // eslint-disable-next-line max-len
    'Return whether the left value is greater than or equal to the right value.'],
  ['is', 'Is',
    'Return whether the left value is identical to the right value.'],
  ['is not', 'IsNot',
    'Return whether the left value is not identical to the right value.'],
  ['in', 'In',
    'Return whether the left value is in the right value.'],
  ['not in', 'NotIn',
    'Return whether the left value is not in the right value.']];
const COMPARES_BLOCKLY_DISPLAY =
  BlockXTextToBlocks.COMPARES.map(function(boolop) {
    return [boolop[0], boolop[1]];
  });
const COMPARES_BLOCKLY_GENERATE = {};
BlockXTextToBlocks.COMPARES.forEach(function(boolop) {
  COMPARES_BLOCKLY_GENERATE[boolop[1]] = boolop[0];
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Compare',
  'message0': '%1 %2 %3',
  'args0': [{
    'type': 'input_value',
    'name': 'A',
  }, {
    'type': 'field_dropdown',
    'name': 'OP',
    'options': COMPARES_BLOCKLY_DISPLAY,
  }, {
    'type': 'input_value',
    'name': 'B',
  }],
  'inputsInline': true,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.LOGIC,
});

Blockly.Python['ast_Compare'] = function(block) {
  // Basic arithmetic operators, and power.
  const tuple = COMPARES_BLOCKLY_GENERATE[block.getFieldValue('OP')];
  const operator = ' ' + tuple + ' ';
  const order = Blockly.Python.ORDER_RELATIONAL;
  const argument0 =
    Blockly.Python.valueToCode(block, 'A', order) || Blockly.Python.blank;
  const argument1 =
    Blockly.Python.valueToCode(block, 'B', order) || Blockly.Python.blank;
  const code = argument0 + operator + argument1;
  return [code, order];
};

BlockXTextToBlocks.prototype['ast_Compare'] = function(node) {
  const ops = node.ops;
  const left = node.left;
  const values = node.comparators;
  let resultBlock = this.convert(left, node);

  for (let i = 0; i < values.length; i += 1) {
    resultBlock =
      BlockXTextToBlocks.create_block('ast_Compare', node.lineno, {
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

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_AssertFull',
  'message0': 'assert %1 %2',
  'args0': [{
    'type': 'input_value',
    'name': 'TEST',
  }, {
    'type': 'input_value',
    'name': 'MSG',
  }],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.LOGIC,
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Assert',
  'message0': 'assert %1',
  'args0': [{
    'type': 'input_value',
    'name': 'TEST',
  }],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.LOGIC,
});

Blockly.Python['ast_Assert'] = function(block) {
  const test =
    Blockly.Python.valueToCode(block, 'TEST', Blockly.Python.ORDER_ATOMIC) ||
    Blockly.Python.blank;
  return 'assert ' + test + '\n';
};

Blockly.Python['ast_AssertFull'] = function(block) {
  const test =
    Blockly.Python.valueToCode(block, 'TEST', Blockly.Python.ORDER_ATOMIC) ||
    Blockly.Python.blank;
  const msg =
    Blockly.Python.valueToCode(block, 'MSG', Blockly.Python.ORDER_ATOMIC) ||
    Blockly.Python.blank;
  return 'assert ' + test + ', ' + msg + '\n';
};

BlockXTextToBlocks.prototype['ast_Assert'] = function(node) {
  const test = node.test;
  const msg = node.msg;

  if (msg == null) {
    return BlockXTextToBlocks.create_block('ast_Assert', node.lineno, {}, {
      'TEST': this.convert(test, node),
    });
  } else {
    return BlockXTextToBlocks
      .create_block('ast_AssertFull', node.lineno, {}, {
        'TEST': this.convert(test, node),
        'MSG': this.convert(msg, node),
      });
  }
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_NameConstantNone',
  'message0': 'None',
  'args0': [],
  'output': 'None',
  'colour': BlockXTextToBlocks.COLOR.LOGIC,
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_NameConstantBoolean',
  'message0': '%1',
  'args0': [{
    'type': 'field_dropdown',
    'name': 'BOOL',
    'options': [['True', 'TRUE'], ['False', 'FALSE']],
  }],
  'output': 'Boolean',
  'colour': BlockXTextToBlocks.COLOR.LOGIC,
});

Blockly.Python['ast_NameConstantBoolean'] = function(block) {
  // Boolean values true and false.
  const code = block.getFieldValue('BOOL') == 'TRUE' ? 'True' : 'False';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['ast_NameConstantNone'] = function() {
  // Boolean values true and false.
  const code = 'None';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

BlockXTextToBlocks.prototype['ast_NameConstant'] = function(node) {
  const value = node.value;

  if (value === Sk.builtin.none.none$) {
    return BlockXTextToBlocks
      .create_block('ast_NameConstantNone', node.lineno, {});
  } else if (value === Sk.builtin.bool.true$) {
    return BlockXTextToBlocks
      .create_block('ast_NameConstantBoolean', node.lineno, {
        'BOOL': 'TRUE',
      });
  } else if (value === Sk.builtin.bool.false$) {
    return BlockXTextToBlocks
      .create_block('ast_NameConstantBoolean', node.lineno, {
        'BOOL': 'FALSE',
      });
  }
};

Blockly.Blocks['ast_List'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function init() {
    this.setHelpUrl(Blockly.Msg['LISTS_CREATE_WITH_HELPURL']);
    this.setColour(BlockXTextToBlocks.COLOR.LIST);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'List');
    this.setMutator(new Blockly.Mutator(['ast_List_create_with_item']));
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function decompose(workspace) {
    const containerBlock = workspace.newBlock('ast_List_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;

    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('ast_List_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }

    return containerBlock;
  },

  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function compose(containerBlock) {
    let itemBlock = containerBlock
      .getInputTargetBlock('STACK'); // Count number of inputs.

    const connections = [];

    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    } // Disconnect any children that don't belong.


    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput('ADD' + i).connection.targetConnection;

      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }

    this.itemCount_ = connections.length;
    this.updateShape_(); // Reconnect any child blocks.

    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },

  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;

    while (itemBlock) {
      const input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
  },

  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function updateShape_() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY').appendField('create empty list []');
    } // Add new inputs.

    let i = 0;
    for (; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        const input = this.appendValueInput('ADD' + i);

        if (i == 0) {
          input.appendField('create list with [');
        } else {
          input.appendField(',').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    }

    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }

    if (this.getInput('TAIL')) {
      this.removeInput('TAIL');
    }

    if (this.itemCount_) {
      this.appendDummyInput('TAIL')
        .appendField(']')
        .setAlign(Blockly.ALIGN_RIGHT);
    }
  },
};
Blockly.Blocks['ast_List_create_with_container'] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.LIST);
    this.appendDummyInput().appendField('Add new list elements below');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};
Blockly.Blocks['ast_List_create_with_item'] = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.LIST);
    this.appendDummyInput().appendField('Element');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Python['ast_List'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.itemCount_);

  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
      Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  }

  const code = '[' + elements.join(', ') + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

BlockXTextToBlocks.prototype['ast_List'] = function(node) {
  const elts = node.elts;
  return BlockXTextToBlocks
    .create_block('ast_List', node.lineno, {},
      this.convertElements('ADD', elts, node),
      {
        'inline': elts.length > 3 ? 'false' : 'true',
      },
      {
        '@items': elts.length,
      });
};

Blockly.Blocks['ast_Tuple'] = {
  /**
   * Block for creating a tuple with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.TUPLE);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Tuple');
    this.setMutator(new Blockly.Mutator(['ast_Tuple_create_with_item']));
  },

  /**
   * Create XML to represent tuple inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  /**
   * Parse XML to restore the tuple inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function decompose(workspace) {
    const containerBlock =
      workspace.newBlock('ast_Tuple_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;

    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('ast_Tuple_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }

    return containerBlock;
  },

  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function compose(containerBlock) {
    let itemBlock =
      containerBlock.getInputTargetBlock('STACK'); // Count number of inputs.

    const connections = [];

    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    } // Disconnect any children that don't belong.


    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput('ADD' + i).connection.targetConnection;

      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }

    this.itemCount_ = connections.length;
    this.updateShape_(); // Reconnect any child blocks.

    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },

  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;

    while (itemBlock) {
      const input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
  },

  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function updateShape_() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY').appendField('()');
    } // Add new inputs.


    for (let i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        const input = this.appendValueInput('ADD' + i);

        if (i === 0) {
          input.appendField('(').setAlign(Blockly.ALIGN_RIGHT);
        } else {
          input.appendField(',').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    }

    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }

    if (this.getInput('TAIL')) {
      this.removeInput('TAIL');
    }

    if (this.itemCount_) {
      const tail = this.appendDummyInput('TAIL');

      if (this.itemCount_ === 1) {
        tail.appendField(',)');
      } else {
        tail.appendField(')');
      }

      tail.setAlign(Blockly.ALIGN_RIGHT);
    }
  },
};
Blockly.Blocks['ast_Tuple_create_with_container'] = {
  /**
   * Mutator block for tuple container.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.TUPLE);
    this.appendDummyInput().appendField('Add new tuple elements below');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};
Blockly.Blocks['ast_Tuple_create_with_item'] = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.TUPLE);
    this.appendDummyInput().appendField('Element');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Python['ast_Tuple'] = function(block) {
  // Create a tuple with any number of elements of any type.
  const elements = new Array(block.itemCount_);

  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
      Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  }

  let requiredComma = '';

  if (block.itemCount_ == 1) {
    requiredComma = ', ';
  }

  const code = '(' + elements.join(', ') + requiredComma + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

BlockXTextToBlocks.prototype['ast_Tuple'] = function(node) {
  const elts = node.elts;
  return BlockXTextToBlocks.create_block(
    'ast_Tuple',
    node.lineno,
    {},
    this.convertElements('ADD', elts, node),
    {
      'inline': elts.length > 4 ? 'false' : 'true',
    }, {
    '@items': elts.length,
  });
};

Blockly.Blocks['ast_Set'] = {
  /**
   * Block for creating a set with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.SET);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Set');
    this.setMutator(new Blockly.Mutator(['ast_Set_create_with_item']));
  },

  /**
   * Create XML to represent set inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    console.log('out XML');
    return container;
  },

  /**
   * Parse XML to restore the set inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function decompose(workspace) {
    const containerBlock = workspace.newBlock('ast_Set_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;

    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('ast_Set_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function compose(containerBlock) {
    let itemBlock =
      containerBlock.getInputTargetBlock('STACK'); // Count number of inputs.

    const connections = [];

    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    } // Disconnect any children that don't belong.


    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput('ADD' + i).connection.targetConnection;

      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }

    this.itemCount_ = connections.length;
    this.updateShape_(); // Reconnect any child blocks.

    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },

  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;

    while (itemBlock) {
      const input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function updateShape_() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY').appendField('create empty set');
    } // Add new inputs.


    for (let i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        const input = this.appendValueInput('ADD' + i);

        if (i === 0) {
          input.appendField('create set with {').setAlign(Blockly.ALIGN_RIGHT);
        } else {
          input.appendField(',').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    }

    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    } // Add the trailing "]"


    if (this.getInput('TAIL')) {
      this.removeInput('TAIL');
    }

    if (this.itemCount_) {
      this.appendDummyInput('TAIL')
        .appendField('}')
        .setAlign(Blockly.ALIGN_RIGHT);
    }
  },
};
Blockly.Blocks['ast_Set_create_with_container'] = {
  /**
   * Mutator block for set container.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.SET);
    this.appendDummyInput().appendField('Add new set elements below');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};
Blockly.Blocks['ast_Set_create_with_item'] = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.SET);
    this.appendDummyInput().appendField('Element');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Python['ast_Set'] = function(block) {
  // Create a set with any number of elements of any type.
  if (block.itemCount_ === 0) {
    return ['set()', Blockly.Python.ORDER_FUNCTION_CALL];
  }

  const elements = new Array(block.itemCount_);

  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
      Blockly.Python.valueToCode(block, 'ADD' + i, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  }

  const code = '{' + elements.join(', ') + '}';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

BlockXTextToBlocks.prototype['ast_Set'] = function(node) {
  const elts = node.elts;
  return BlockXTextToBlocks.create_block('ast_Set',
    node.lineno,
    {},
    this.convertElements('ADD', elts, node),
    {
      'inline': elts.length > 3 ? 'false' : 'true',
    }, {
    '@items': elts.length,
  });
};

Blockly.Blocks['ast_DictItem'] = {
  init: function init() {
    this.appendValueInput('KEY').setCheck(null);
    this.appendValueInput('VALUE').setCheck(null).appendField(':');
    this.setInputsInline(true);
    this.setOutput(true, 'DictPair');
    this.setColour(BlockXTextToBlocks.COLOR.DICTIONARY);
  },
};
Blockly.Blocks['ast_Dict'] = {
  /**
   * Block for creating a dict with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.DICTIONARY);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Dict');
    this.setMutator(new Blockly.Mutator(['ast_Dict_create_with_item']));
  },

  /**
   * Create XML to represent dict inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  /**
   * Parse XML to restore the dict inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function decompose(workspace) {
    const containerBlock = workspace.newBlock('ast_Dict_create_with_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;

    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock('ast_Dict_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }

    return containerBlock;
  },

  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function compose(containerBlock) {
    let itemBlock =
      containerBlock.getInputTargetBlock('STACK'); // Count number of inputs.

    const connections = [];

    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    } // Disconnect any children that don't belong.


    for (let i = 0; i < this.itemCount_; i++) {
      const connection = this.getInput('ADD' + i).connection.targetConnection;

      if (connection && connections.indexOf(connection) == -1) {
        const key = connection.getSourceBlock().getInput('KEY');

        if (key.connection.targetConnection) {
          key.connection.targetConnection.getSourceBlock().unplug(true);
        }

        const value = connection.getSourceBlock().getInput('VALUE');

        if (value.connection.targetConnection) {
          value.connection.targetConnection.getSourceBlock().unplug(true);
        }

        connection.disconnect();
        connection.getSourceBlock().dispose();
      }
    }

    this.itemCount_ = connections.length;
    this.updateShape_(); // Reconnect any child blocks.

    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);

      if (!connections[i]) {
        const _itemBlock = this.workspace.newBlock('ast_DictItem');

        _itemBlock.setDeletable(false);

        _itemBlock.setMovable(false);

        _itemBlock.initSvg();

        this.getInput('ADD' + i)
          .connection.connect(_itemBlock.outputConnection);

        _itemBlock.render(); // this.get(itemBlock, 'ADD'+i)
      }
    }
  },

  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;

    while (itemBlock) {
      const input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
  },

  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function updateShape_() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY').appendField('empty dictionary');
    } // Add new inputs.

    let i = 0;
    for (; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        const input = this.appendValueInput('ADD' + i).setCheck('DictPair');

        if (i === 0) {
          input.appendField('create dict with').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    } // Remove deleted inputs.


    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  },
};
Blockly.Blocks['ast_Dict_create_with_container'] = {
  /**
   * Mutator block for dict container.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.DICTIONARY);
    this.appendDummyInput().appendField('Add new dict elements below');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};
Blockly.Blocks['ast_Dict_create_with_item'] = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.DICTIONARY);
    this.appendDummyInput().appendField('Element');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Python['ast_Dict'] = function(block) {
  // Create a dict with any number of elements of any type.
  const elements = new Array(block.itemCount_);

  for (let i = 0; i < block.itemCount_; i++) {
    const child = block.getInputTargetBlock('ADD' + i);

    if (child === null || child.type != 'ast_DictItem') {
      elements[i] = Blockly.Python.blank + ': ' + Blockly.Python.blank;
      continue;
    }

    const key =
      Blockly.Python.valueToCode(child, 'KEY', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
    const value =
      Blockly.Python.valueToCode(child, 'VALUE', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
    elements[i] = key + ': ' + value;
  }

  const code = '{' + elements.join(', ') + '}';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

BlockXTextToBlocks.prototype['ast_Dict'] = function(node) {
  const keys = node.keys;
  const values = node.values;

  if (keys === null) {
    return BlockXTextToBlocks.create_block('ast_Dict',
      node.lineno,
      {}, {},
      {
        'inline': 'false',
      }, {
      '@items': 0,
    });
  }

  const elements = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];
    elements['ADD' + i] =
      BlockXTextToBlocks.create_block('ast_DictItem',
        node.lineno, {},
        {
          'KEY': this.convert(key, node),
          'VALUE': this.convert(value, node),
        }, this.LOCKED_BLOCK);
  }

  return BlockXTextToBlocks.create_block('ast_Dict',
    node.lineno,
    {},
    elements,
    {
      'inline': 'false',
    }, {
    '@items': keys.length,
  });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Starred',
  'message0': '*%1',
  'args0': [{
    'type': 'input_value',
    'name': 'VALUE',
  }],
  'inputsInline': false,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.VARIABLES,
});

Blockly.Python['ast_Starred'] = function(block) {
  // Basic arithmetic operators, and power.
  const order = Blockly.Python.ORDER_NONE;
  const argument1 =
    Blockly.Python.valueToCode(block, 'VALUE', order) ||
    Blockly.Python.blank;
  const code = '*' + argument1;
  return [code, order];
};

BlockXTextToBlocks.prototype['ast_Starred'] = function(node) {
  const value = node.value;
  return BlockXTextToBlocks.create_block('ast_Starred', node.lineno, {}, {
    'VALUE': this.convert(value, node),
  }, {
    'inline': true,
  });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_IfExp',
  'message0': '%1 if %2 else %3',
  'args0': [{
    'type': 'input_value',
    'name': 'BODY',
  }, {
    'type': 'input_value',
    'name': 'TEST',
  }, {
    'type': 'input_value',
    'name': 'ORELSE',
  }],
  'inputsInline': true,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.LOGIC,
});

Blockly.Python['ast_IfExp'] = function(block) {
  const test =
    Blockly.Python.valueToCode(block, 'TEST',
    Blockly.Python.ORDER_CONDITIONAL) ||
    Blockly.Python.blank;
  const body =
    Blockly.Python.valueToCode(block, 'BODY',
    Blockly.Python.ORDER_CONDITIONAL) ||
    Blockly.Python.blank;
  const orelse =
    Blockly.Python
      .valueToCode(block, 'ORELSE', Blockly.Python.ORDER_CONDITIONAL) ||
    Blockly.Python.blank;
  return [body + ' if ' + test + ' else ' + orelse + '\n',
  Blockly.Python.ORDER_CONDITIONAL];
};

BlockXTextToBlocks.prototype['ast_IfExp'] = function(node) {
  const test = node.test;
  const body = node.body;
  const orelse = node.orelse;
  return BlockXTextToBlocks.create_block('ast_IfExp', node.lineno, {}, {
    'TEST': this.convert(test, node),
    'BODY': this.convert(body, node),
    'ORELSE': this.convert(orelse, node),
  });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_AttributeFull',
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
  'colour': BlockXTextToBlocks.COLOR.OO,
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Attribute',
  'message0': '%1 . %2',
  'args0': [{
    'type': 'field_variable',
    'name': 'VALUE',
    'variable': 'variable',
  }, {
    'type': 'field_input',
    'name': 'ATTR',
    'text': 'attribute',
  }],
  'inputsInline': true,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.OO,
});

Blockly.Python['ast_Attribute'] = function(block) {
  // Text value.
  const value =
    Blockly.Python.variableDB_.getName(block.getFieldValue('VALUE'),
      Blockly.Variables.NAME_TYPE);
  const attr = block.getFieldValue('ATTR');
  const code = value + '.' + attr;
  return [code, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['ast_AttributeFull'] = function(block) {
  // Text value.
  const value =
    Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  const attr = block.getFieldValue('ATTR');
  const code = value + '.' + attr;
  return [code, Blockly.Python.ORDER_MEMBER];
};

BlockXTextToBlocks.prototype['ast_Attribute'] = function(node) {
  const value = node.value;
  const attr = node.attr; // if (value.constructor)

  if (value._astname == 'Name') {
    return BlockXTextToBlocks.create_block('ast_Attribute', node.lineno, {
      'VALUE': Sk.ffi.remapToJs(value.id),
      'ATTR': Sk.ffi.remapToJs(attr),
    });
  } else {
    return BlockXTextToBlocks.create_block('ast_AttributeFull',
      node.lineno,
      {
        'ATTR': Sk.ffi.remapToJs(attr),
      }, {
      'VALUE': this.convert(value, node),
    });
  }
}; // TODO: Support stuff like "append" where
// the message is after the value input
// TODO: Handle updating function/method definition -> update call
// TODO: Do a pretraversal to determine if a given function returns


Blockly.Blocks['ast_Call'] = {
  /**
   * Block for calling a procedure with no return value.
   * @this Blockly.Block
   */
  init: function init() {
    this.givenColour_ = BlockXTextToBlocks.COLOR.FUNCTIONS;
    this.setInputsInline(true);
    // Regular ('NAME') or Keyword (either '**' or '*NAME')

    this.arguments_ = [];
    this.argumentVarModels_ = [];
    // acbart: Added count to keep track of unused parameters

    this.argumentCount_ = 0;
    this.quarkConnections_ = {};
    this.quarkIds_ = null; // acbart: Show parameter names, if they exist

    this.showParameterNames_ = false; // acbart: Whether this block returns

    this.returns_ = true;
    // acbart: added simpleName to handle complex function calls (e.g., chained)

    this.isMethod_ = false;
    this.name_ = null;
    this.message_ = 'function';
    this.premessage_ = '';
    this.module_ = '';
    this.updateShape_();
  },

  /**
   * Returns the name of the procedure this block calls.
   * @return {string} Procedure name.
   * @this Blockly.Block
   */
  getProcedureCall: function getProcedureCall() {
    return this.name_;
  },

  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * Also rename if it was previously null.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this Blockly.Block
   */
  renameProcedure: function renameProcedure(oldName, newName) {
    if (this.name_ === null || Blockly.Names.equals(oldName, this.name_)) {
      this.name_ = newName;
      this.updateShape_();
    }
  },

  /**
   * Notification that the procedure's parameters have changed.
   * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
   * @param {!Array.<string>} paramIds IDs of params (consistent for each
   *     parameter through the life of a mutator, regardless of param renaming),
   *     e.g. ['piua', 'f8b_', 'oi.o'].\
   * @return {boolean}
   * @private
   * @this Blockly.Block
   */
  setProcedureParameters_:
  function setProcedureParameters_(paramNames, paramIds) {
    const defBlock =
      Blockly.Procedures.getDefinition(this.getProcedureCall(), this.workspace);
    const mutatorOpen =
      defBlock && defBlock.mutator &&
      defBlock.mutator.isVisible();

    if (!mutatorOpen) {
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
    }

    if (!paramIds) {
      // Reset the quarks (a mutator is about to open).
      return false;
    } // Test arguments (arrays of strings) for changes. '\n' is not a valid
    // argument name character, so it is a valid delimiter here.


    if (paramNames.join('\n') == this.arguments_.join('\n')) {
      // No change.
      this.quarkIds_ = paramIds;
      return false;
    }

    if (paramIds.length !== paramNames.length) {
      throw new Error('paramNames and paramIds must be the same length.');
    }

    this.setCollapsed(false);

    if (!this.quarkIds_) {
      // Initialize tracking for this block.
      this.quarkConnections_ = {};
      this.quarkIds_ = [];
    } // Switch off rendering while the block is rebuilt.


    const savedRendered = this.rendered;
    this.rendered = false;
    // Update the quarkConnections_ with existing connections.

    for (let i = 0; i < this.arguments_.length; i++) {
      const input = this.getInput('ARG' + i);

      if (input) {
        const connection = input.connection.targetConnection;
        this.quarkConnections_[this.quarkIds_[i]] = connection;

        if (mutatorOpen && connection &&
          paramIds.indexOf(this.quarkIds_[i]) === -1) {
          // This connection should no longer be attached to this block.
          connection.disconnect();
          connection.getSourceBlock().bumpNeighbours_();
        }
      }
    } // Rebuild the block's arguments.


    this.arguments_ = [].concat(paramNames);
    this.argumentCount_ = this.arguments_.length;
    // And rebuild the argument model list.

    this.argumentVarModels_ = [];
    /*
    // acbart: Function calls don't create variables, what do they know?
    for (let i = 0; i < this.arguments_.length; i++) {
        let argumentName = this.arguments_[i];
        var variable = Blockly.Variables.getVariable(
            this.workspace, null, this.arguments_[i], '');
        if (variable) {
            this.argumentVarModels_.push(variable);
        }
    }*/

    this.updateShape_();
    this.quarkIds_ = paramIds; // Reconnect any child blocks.

    if (this.quarkIds_) {
      for (let _i4 = 0; _i4 < this.arguments_.length; _i4++) {
        const quarkId = this.quarkIds_[_i4];

        if (quarkId in this.quarkConnections_) {
          const _connection = this.quarkConnections_[quarkId];

          if (!Blockly.Mutator.reconnect(_connection, this, 'ARG' + _i4)) {
            // Block no longer exists or has been attached elsewhere.
            delete this.quarkConnections_[quarkId];
          }
        }
      }
    } // Restore rendering and show the changes.


    this.rendered = savedRendered;

    if (this.rendered) {
      this.render();
    }

    return true;
  },

  /**
   * Modify this block to have the correct number of arguments.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function updateShape_() {
    // If it's a method, add in the caller
    if (this.isMethod_ && !this.getInput('FUNC')) {
      const func =
        this.appendValueInput('FUNC');
      // If there's a premessage, add it in

      if (this.premessage_ !== '') {
        func.appendField(this.premessage_);
      }
    } else if (!this.isMethod_ && this.getInput('FUNC')) {
      this.removeInput('FUNC');
    }

    const drawnArgumentCount = this.getDrawnArgumentCount_();
    let message =
      this.getInput('MESSAGE_AREA');
    // Zero arguments, just do {message()}

    if (drawnArgumentCount === 0) {
      if (message) {
        message.removeField('MESSAGE');
      } else {
        message =
          this.appendDummyInput('MESSAGE_AREA').setAlign(Blockly.ALIGN_RIGHT);
      }

      message.appendField(new Blockly
        .FieldLabel(this.message_ + '\ ('), 'MESSAGE');
      // One argument, no MESSAGE_AREA
    } else if (message) {
      this.removeInput('MESSAGE_AREA');
    } // Process arguments


    let i;

    for (i = 0; i < drawnArgumentCount; i++) {
      const argument = this.arguments_[i];
      let argumentName = this.parseArgument_(argument);

      if (i === 0) {
        argumentName = this.message_ + '\ (' + argumentName;
      }

      let field = this.getField('ARGNAME' + i);

      if (field) {
        // Ensure argument name is up to date.
        // The argument name field is deterministic based on the mutation,
        // no need to fire a change event.
        Blockly.Events.disable();

        try {
          field.setValue(argumentName);
        } finally {
          Blockly.Events.enable();
        }
      } else {
        // Add new input.
        field = new Blockly.FieldLabel(argumentName);
        this.appendValueInput('ARG' + i)
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(field, 'ARGNAME' + i).init();
      }

      if (argumentName) {
        field.setVisible(true);
      } else {
        field.setVisible(false);
      }
    } // Closing parentheses


    if (!this.getInput('CLOSE_PAREN')) {
      this.appendDummyInput('CLOSE_PAREN')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldLabel(')'));
    } // Move everything into place


    if (drawnArgumentCount === 0) {
      if (this.isMethod_) {
        this.moveInputBefore('FUNC', 'MESSAGE_AREA');
      }

      this.moveInputBefore('MESSAGE_AREA', 'CLOSE_PAREN');
    } else {
      if (this.isMethod_) {
        this.moveInputBefore('FUNC', 'CLOSE_PAREN');
      }
    }

    for (let j = 0; j < i; j++) {
      this.moveInputBefore('ARG' + j, 'CLOSE_PAREN');
    } // Set return state


    this.setReturn_(this.returns_, false); // Remove deleted inputs.

    while (this.getInput('ARG' + i)) {
      this.removeInput('ARG' + i);
      i++;
    }

    this.setColour(this.givenColour_);
  },

  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    const name = this.getProcedureCall();
    container.setAttribute('name', name === null ? '*' : name);
    container.setAttribute('arguments', this.argumentCount_);
    container.setAttribute('returns', this.returns_);
    container.setAttribute('parameters', this.showParameterNames_);
    container.setAttribute('method', this.isMethod_);
    container.setAttribute('message', this.message_);
    container.setAttribute('premessage', this.premessage_);
    container.setAttribute('module', this.module_);
    container.setAttribute('colour', this.givenColour_);

    for (let i = 0; i < this.arguments_.length; i++) {
      const parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }

    return container;
  },

  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.name_ = xmlElement.getAttribute('name');
    this.name_ = this.name_ === '*' ? null : this.name_;
    this.argumentCount_ = parseInt(xmlElement.getAttribute('arguments'), 10);
    this.showParameterNames_ = 'true' === xmlElement.getAttribute('parameters');
    this.returns_ = 'true' === xmlElement.getAttribute('returns');
    this.isMethod_ = 'true' === xmlElement.getAttribute('method');
    this.message_ = xmlElement.getAttribute('message');
    this.premessage_ = xmlElement.getAttribute('premessage');
    this.module_ = xmlElement.getAttribute('module');
    this.givenColour_ = parseInt(xmlElement.getAttribute('colour'), 10);
    const args = [];
    const paramIds = [];

    for (let i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() === 'arg') {
        args.push(childNode.getAttribute('name'));
        paramIds.push(childNode.getAttribute('paramId'));
      }
    }

    const result = this.setProcedureParameters_(args, paramIds);

    if (!result) {
      this.updateShape_();
    }

    if (this.name_ !== null) {
      this.renameProcedure(this.getProcedureCall(), this.name_);
    }
  },

  /**
   * Return all variables referenced by this block.
   * @return {!Array.<!Blockly.VariableModel>} List of variable models.
   * @this Blockly.Block
   */
  getVarModels: function getVarModels() {
    return this.argumentVarModels_;
  },

  /**
   * Add menu option to find the definition block for this call.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function customContextMenu(options) {
    if (!this.workspace.isMovable()) {
      // If we center on the block and the workspace isn't movable we could
      // loose blocks at the edges of the workspace.
      return;
    }

    const workspace = this.workspace;
    const block = this; // Highlight Definition

    const option = {
      enabled: true,
    };
    option.text = Blockly.Msg['PROCEDURES_HIGHLIGHT_DEF'];
    const name = this.getProcedureCall();

    option.callback = function() {
      const def = Blockly.Procedures.getDefinition(name, workspace);

      if (def) {
        workspace.centerOnBlock(def.id);
        def.select();
      }
    };

    options.push(option); // Show Parameter Names

    options.push({
      enabled: true,
      text: 'Show/Hide parameters',
      callback: function callback() {
        block.showParameterNames_ = !block.showParameterNames_;
        block.updateShape_();
        block.render();
      },
    }); // Change Return Type

    options.push({
      enabled: true,
      text: this.returns_ ? 'Make statement' : 'Make expression',
      callback: function callback() {
        block.returns_ = !block.returns_;
        block.setReturn_(block.returns_, true);
      },
    });
  },

  /**
   * Notification that the procedure's return state has changed.
   * @param {boolean} returnState New return state
   * @param {boolean} forceRerender Whether to render
   * @this Blockly.Block
   */
  setReturn_: function setReturn_(returnState, forceRerender) {
    this.unplug(true);

    if (returnState) {
      this.setPreviousStatement(false);
      this.setNextStatement(false);
      this.setOutput(true);
    } else {
      this.setOutput(false);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }

    if (forceRerender) {
      if (this.rendered) {
        this.render();
      }
    }
  },
  // defType_: 'procedures_defnoreturn',
  parseArgument_: function parseArgument_(argument) {
    if (argument.startsWith('KWARGS:')) {
      // KWARG
      return 'unpack';
    } else if (argument.startsWith('KEYWORD:')) {
      return argument.substring(8) + '=';
    } else {
      if (this.showParameterNames_) {
        if (argument.startsWith('KNOWN_ARG:')) {
          return argument.substring(10) + '=';
        }
      }
    }

    return '';
  },
  getDrawnArgumentCount_: function getDrawnArgumentCount_() {
    return Math.min(this.argumentCount_, this.arguments_.length);
  },
};

Blockly.Python['ast_Call'] = function(block) {
  // TODO: Handle import
  if (block.module_) {
    Blockly.Python.definitions_['import_' + block.module_] =
      BlockXTextToBlocks.prototype.MODULE_FUNCTION_IMPORTS[block.module_];
  }


  let funcName = '';

  if (block.isMethod_) {
    funcName =
      Blockly.Python.valueToCode(block, 'FUNC',
        Blockly.Python.ORDER_FUNCTION_CALL) ||
      Blockly.Python.blank;
  }

  funcName += this.name_; // Build the arguments

  const args = [];

  for (let i = 0; i < block.arguments_.length; i++) {
    const value =
      Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
    const argument = block.arguments_[i];

    if (argument.startsWith('KWARGS:')) {
      args[i] = '**' + value;
    } else if (argument.startsWith('KEYWORD:')) {
      args[i] = argument.substring(8) + '=' + value;
    } else {
      args[i] = value;
    }
  } // Return the result


  const code = funcName + '(' + args.join(', ') + ')';

  if (block.returns_) {
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
  } else {
    return code + '\n';
  }
};

BlockXTextToBlocks.prototype.getAsModule = function(node) {
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

BlockXTextToBlocks.prototype['ast_Call'] = function(node, parent) {
  const func = node.func;
  const args = node.args;
  const keywords = node.keywords;
  // Can we make any guesses about this based on its name?

  let signature = null;
  let isMethod = false;
  const module = null;
  let premessage = '';
  let message = '';
  let name = '';
  let caller = null;
  let colour = BlockXTextToBlocks.COLOR.FUNCTIONS;

  if (func._astname === 'Name') {
    message = name = Sk.ffi.remapToJs(func.id);

    if (name in this.FUNCTION_SIGNATURES) {
      signature = this.FUNCTION_SIGNATURES[Sk.ffi.remapToJs(func.id)];
    }
  } else if (func._astname === 'Attribute') {
    isMethod = true;
    caller = func.value;
    // const potentialModule = this.getAsModule(caller);
    const attributeName = Sk.ffi.remapToJs(func.attr);
    message = '.' + attributeName;

    if (attributeName in this.METHOD_SIGNATURES) {
      signature = this.METHOD_SIGNATURES[attributeName];
      name = message;
    } else {
      name = message;
    }
  } else {
    isMethod = true;
    message = '';
    name = '';
    caller = func; // (lambda x: x)()
  }

  let returns = true;

  if (signature !== null && signature !== undefined) {
    if (signature.custom) {
      try {
        return signature.custom(node, parent, this);
      } catch (e) {
        console.error(e);
        // We tried to be fancy and failed,
        // better fall back to default behavior!
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

  returns = returns || parent._astname !== 'Expr';
  const argumentsNormal = {};
  // TODO: do I need to be limiting only the *args* length, not keywords?

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
  }; // Handle arguments

  let overallI = 0;

  if (args !== null) {
    for (let i = 0; i < args.length; i += 1, overallI += 1) {
      argumentsNormal['ARG' + overallI] = this.convert(args[i], node);
      argumentsMutation['UNKNOWN_ARG:' + overallI] = null;
    }
  }

  if (keywords !== null) {
    for (let _i5 = 0; _i5 < keywords.length; _i5 += 1, overallI += 1) {
      const keyword = keywords[_i5];
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
  } // Build actual block


  let newBlock;

  if (isMethod) {
    argumentsNormal['FUNC'] = this.convert(caller, node);
    newBlock =
      BlockXTextToBlocks.create_block('ast_Call',
        node.lineno, {},
        argumentsNormal,
        {
          inline: true,
        }, argumentsMutation);
  } else {
    newBlock =
      BlockXTextToBlocks.create_block('ast_Call',
        node.lineno, {},
        argumentsNormal,
        {
          inline: true,
        }, argumentsMutation);
  } // Return as either statement or expression


  if (returns) {
    return newBlock;
  } else {
    return [newBlock];
  }
};

Blockly.Blocks['ast_Raise'] = {
  init: function init() {
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.EXCEPTIONS);
    this.exc_ = true;
    this.cause_ = false;
    this.appendDummyInput().appendField('raise');
    this.updateShape_();
  },
  updateShape_: function updateShape_() {
    if (this.exc_ && !this.getInput('EXC')) {
      this.appendValueInput('EXC').setCheck(null);
    } else if (!this.exc_ && this.getInput('EXC')) {
      this.removeInput('EXC');
    }

    if (this.cause_ && !this.getInput('CAUSE')) {
      this.appendValueInput('CAUSE').setCheck(null).appendField('from');
    } else if (!this.cause_ && this.getInput('CAUSE')) {
      this.removeInput('CAUSE');
    }

    if (this.cause_ && this.exc_) {
      this.moveInputBefore('EXC', 'CAUSE');
    }
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('exc', this.exc_);
    container.setAttribute('cause', this.cause_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.exc_ = 'true' === xmlElement.getAttribute('exc');
    this.cause_ = 'true' === xmlElement.getAttribute('cause');
    this.updateShape_();
  },
};

Blockly.Python['ast_Raise'] = function(block) {
  if (this.exc_) {
    const exc =
      Blockly.Python.valueToCode(block, 'EXC', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;

    if (this.cause_) {
      const cause =
        Blockly.Python.valueToCode(block, 'CAUSE', Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank;
      return 'raise ' + exc + ' from ' + cause + '\n';
    } else {
      return 'raise ' + exc + '\n';
    }
  } else {
    return 'raise' + '\n';
  }
};

BlockXTextToBlocks.prototype['ast_Raise'] = function(node) {
  const exc = node.exc;
  const cause = node.cause;
  const values = {};
  let hasExc = false;
  let hasCause = false;

  if (exc !== null) {
    values['EXC'] = this.convert(exc, node);
    hasExc = true;
  }

  if (cause !== null) {
    values['CAUSE'] = this.convert(cause, node);
    hasCause = true;
  }

  return BlockXTextToBlocks.create_block('ast_Raise',
    node.lineno, {},
    values, {},
    {
      '@exc': hasExc,
      '@cause': hasCause,
    });
};

Blockly.Blocks['ast_Delete'] = {
  init: function init() {
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.VARIABLES);
    this.targetCount_ = 1;
    this.appendDummyInput().appendField('delete');
    this.updateShape_();
  },
  updateShape_: function updateShape_() {
    // Add new inputs.
    for (let i = 0; i < this.targetCount_; i++) {
      if (!this.getInput('TARGET' + i)) {
        const input = this.appendValueInput('TARGET' + i);

        if (i !== 0) {
          input.appendField(',').setAlign(Blockly.ALIGN_RIGHT);
        }
      }
    } // Remove deleted inputs.


    while (this.getInput('TARGET' + i)) {
      this.removeInput('TARGET' + i);
      i++;
    }
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('targets', this.targetCount_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.targetCount_ = parseInt(xmlElement.getAttribute('targets'), 10);
    this.updateShape_();
  },
};

Blockly.Python['ast_Delete'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.targetCount_);

  for (let i = 0; i < block.targetCount_; i++) {
    elements[i] =
      Blockly.Python.valueToCode(block, 'TARGET' + i,
        Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  }

  const code = 'del ' + elements.join(', ') + '\n';
  return code;
};

BlockXTextToBlocks.prototype['ast_Delete'] = function(node) {
  const targets = node.targets;
  return BlockXTextToBlocks.create_block('ast_Delete',
    node.lineno, {},
    this.convertElements('TARGET', targets, node),
    {
      'inline': 'true',
    }, {
    '@targets': targets.length,
  });
};

Blockly.Blocks['ast_Subscript'] = {
  init: function init() {
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(BlockXTextToBlocks.COLOR.SEQUENCES);
    this.sliceKinds_ = ['I'];
    this.appendValueInput('VALUE').setCheck(null);
    this.appendDummyInput('OPEN_BRACKET').appendField('[');
    this.appendDummyInput('CLOSE_BRACKET').appendField(']');
    this.updateShape_();
  },
  setExistence: function setExistence(label, exist, isDummy) {
    if (exist && !this.getInput(label)) {
      if (isDummy) {
        return this.appendDummyInput(label);
      } else {
        return this.appendValueInput(label);
      }
    } else if (!exist && this.getInput(label)) {
      this.removeInput(label);
    }

    return null;
  },
  createSlice_: function createSlice_(i, kind) {
    // ,
    let input = this.setExistence('COMMA' + i, i !== 0, true);

    if (input) {
      input.appendField(',');
    } // Single index


    const isIndex = kind.charAt(0) === 'I';
    input = this.setExistence('INDEX' + i, isIndex, false); // First index

    input =
      this.setExistence('SLICELOWER' + i,
        !isIndex && '1' === kind.charAt(1), false); // First colon

    input =
      this.setExistence('SLICECOLON' + i, !isIndex, true);

    if (input) {
      input.appendField(':').setAlign(Blockly.ALIGN_RIGHT);
    } // Second index


    input =
      this.setExistence('SLICEUPPER' + i,
        !isIndex && '1' === kind.charAt(2), false);
        // Second colon and third index

    input =
      this.setExistence('SLICESTEP' + i,
        !isIndex && '1' === kind.charAt(3), false);

    if (input) {
      input.appendField(':').setAlign(Blockly.ALIGN_RIGHT);
    }
  },
  updateShape_: function updateShape_() {
    // Add new inputs.
    let i = 0;
    for (; i < this.sliceKinds_.length; i++) {
      this.createSlice_(i, this.sliceKinds_[i]);
    }

    for (let j = 0; j < i; j++) {
      if (j !== 0) {
        this.moveInputBefore('COMMA' + j, 'CLOSE_BRACKET');
      }

      const kind = this.sliceKinds_[j];

      if (kind.charAt(0) === 'I') {
        this.moveInputBefore('INDEX' + j, 'CLOSE_BRACKET');
      } else {
        if (kind.charAt(1) === '1') {
          this.moveInputBefore('SLICELOWER' + j, 'CLOSE_BRACKET');
        }

        this.moveInputBefore('SLICECOLON' + j, 'CLOSE_BRACKET');

        if (kind.charAt(2) === '1') {
          this.moveInputBefore('SLICEUPPER' + j, 'CLOSE_BRACKET');
        }

        if (kind.charAt(3) === '1') {
          this.moveInputBefore('SLICESTEP' + j, 'CLOSE_BRACKET');
        }
      }
    } // Remove deleted inputs.


    while (this.getInput('TARGET' + i) || this.getInput('SLICECOLON')) {
      this.removeInput('COMMA' + i, true);

      if (this.getInput('INDEX' + i)) {
        this.removeInput('INDEX' + i);
      } else {
        this.removeInput('SLICELOWER' + i, true);
        this.removeInput('SLICECOLON' + i, true);
        this.removeInput('SLICEUPPER' + i, true);
        this.removeInput('SLICESTEP' + i, true);
      }

      i++;
    }
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');

    for (let i = 0; i < this.sliceKinds_.length; i++) {
      const parameter = document.createElement('arg');
      parameter.setAttribute('name', this.sliceKinds_[i]);
      container.appendChild(parameter);
    }

    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.sliceKinds_ = [];

    for (let i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() === 'arg') {
        this.sliceKinds_.push(childNode.getAttribute('name'));
      }
    }

    this.updateShape_();
  },
};

Blockly.Python['ast_Subscript'] = function(block) {
  // Create a list with any number of elements of any type.
  const value =
    Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_MEMBER) ||
    Blockly.Python.blank;
  const slices = new Array(block.sliceKinds_.length);

  for (let i = 0; i < block.sliceKinds_.length; i++) {
    const kind = block.sliceKinds_[i];

    if (kind.charAt(0) === 'I') {
      slices[i] =
        Blockly.Python.valueToCode(block, 'INDEX' + i,
          Blockly.Python.ORDER_MEMBER) ||
        Blockly.Python.blank;
    } else {
      slices[i] = '';

      if (kind.charAt(1) === '1') {
        slices[i] +=
          Blockly.Python.valueToCode(block, 'SLICELOWER' + i,
            Blockly.Python.ORDER_MEMBER) ||
          Blockly.Python.blank;
      }

      slices[i] += ':';

      if (kind.charAt(2) === '1') {
        slices[i] +=
          Blockly.Python.valueToCode(block, 'SLICEUPPER' + i,
            Blockly.Python.ORDER_MEMBER) ||
          Blockly.Python.blank;
      }

      if (kind.charAt(3) === '1') {
        slices[i] += ':' +
          Blockly.Python.valueToCode(block, 'SLICESTEP' + i,
            Blockly.Python.ORDER_MEMBER) ||
          Blockly.Python.blank;
      }
    }
  }

  const code = value + '[' + slices.join(', ') + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
};

const isWeirdSliceCase = function isWeirdSliceCase(slice) {
  return slice.lower == null &&
    slice.upper == null &&
    slice.step !== null &&
    slice.step._astname === 'NameConstant' &&
    slice.step.value === Sk.builtin.none.none$;
};

BlockXTextToBlocks.prototype.addSliceDim =
  function(slice, i, values, mutations, node) {
    const sliceKind = slice._astname;

    if (sliceKind === 'Index') {
      values['INDEX' + i] = this.convert(slice.value, node);
      mutations.push('I');
    } else if (sliceKind === 'Slice') {
      let L = '0';
      let U = '0';
      let S = '0';

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

BlockXTextToBlocks.prototype['ast_Subscript'] = function(node) {
  const value = node.value;
  const slice = node.slice;
  const values = {
    'VALUE': this.convert(value, node),
  };
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

  return BlockXTextToBlocks.create_block('ast_Subscript',
    node.lineno, {}, values, {
    'inline': 'true',
  }, {
    'arg': mutations,
  });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_comprehensionFor',
  'message0': 'for %1 in %2',
  'args0': [{
    'type': 'input_value',
    'name': 'TARGET',
  }, {
    'type': 'input_value',
    'name': 'ITER',
  }],
  'inputsInline': true,
  'output': 'ComprehensionFor',
  'colour': BlockXTextToBlocks.COLOR.SEQUENCES,
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_comprehensionIf',
  'message0': 'if %1',
  'args0': [{
    'type': 'input_value',
    'name': 'TEST',
  }],
  'inputsInline': true,
  'output': 'ComprehensionIf',
  'colour': BlockXTextToBlocks.COLOR.SEQUENCES,
});
Blockly.Blocks['ast_Comp_create_with_container'] = {
  /**
   * Mutator block for dict container.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.SEQUENCES);
    this.appendDummyInput().appendField('Add new comprehensions below');
    this.appendDummyInput().appendField('   For clause');
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  },
};
Blockly.Blocks['ast_Comp_create_with_for'] = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.SEQUENCES);
    this.appendDummyInput().appendField('For clause');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};
Blockly.Blocks['ast_Comp_create_with_if'] = {
  /**
   * Mutator block for adding items.
   * @this Blockly.Block
   */
  init: function init() {
    this.setColour(BlockXTextToBlocks.COLOR.SEQUENCES);
    this.appendDummyInput().appendField('If clause');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};
BlockXTextToBlocks.COMP_SETTINGS = {
  'ListComp': {
    start: '[',
    end: ']',
    color: BlockXTextToBlocks.COLOR.LIST,
  },
  'SetComp': {
    start: '{',
    end: '}',
    color: BlockXTextToBlocks.COLOR.SET,
  },
  'GeneratorExp': {
    start: '(',
    end: ')',
    color: BlockXTextToBlocks.COLOR.SEQUENCES,
  },
  'DictComp': {
    start: '{',
    end: '}',
    color: BlockXTextToBlocks.COLOR.DICTIONARY,
  },
};
['ListComp', 'SetComp', 'GeneratorExp', 'DictComp'].forEach(function(kind) {
  Blockly.Blocks['ast_' + kind] = {
    /**
     * Block for creating a dict with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function init() {
      this.setStyle('loop_blocks');
      this.setColour(BlockXTextToBlocks.COMP_SETTINGS[kind].color);
      this.itemCount_ = 3;
      const input =
        this.appendValueInput('ELT')
          .appendField(BlockXTextToBlocks.COMP_SETTINGS[kind].start);

      if (kind === 'DictComp') {
        input.setCheck('DictPair');
      }

      this.appendDummyInput('END_BRACKET')
        .appendField(BlockXTextToBlocks.COMP_SETTINGS[kind].end);
      this.updateShape_();
      this.setOutput(true);
      this.setMutator(new Blockly
        .Mutator(['ast_Comp_create_with_for', 'ast_Comp_create_with_if']));
    },

    /**
     * Create XML to represent dict inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function mutationToDom() {
      const container = document.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },

    /**
     * Parse XML to restore the dict inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function domToMutation(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },

    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function decompose(workspace) {
      const containerBlock =
        workspace.newBlock('ast_Comp_create_with_container');
      containerBlock.initSvg();
      let connection = containerBlock.getInput('STACK').connection;
      const generators = [];

      for (let i = 1; i < this.itemCount_; i++) {
        const generator = this.getInput('GENERATOR' + i).connection;
        let createName = void 0;

        if (generator.targetConnection.getSourceBlock().type ===
          'ast_comprehensionIf') {
          createName = 'ast_Comp_create_with_if';
        } else if (generator.targetConnection.getSourceBlock().type ===
          'ast_comprehensionFor') {
          createName = 'ast_Comp_create_with_for';
        } else {
          throw Error('Unknown block type: ' +
            generator.targetConnection.getSourceBlock().type);
        }

        const itemBlock = workspace.newBlock(createName);
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
        generators.push(itemBlock);
      }

      return containerBlock;
    },

    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function compose(containerBlock) {
      let itemBlock =
        containerBlock.getInputTargetBlock('STACK'); // Count number of inputs.

      const connections = [containerBlock.valueConnection_];
      const blockTypes = ['ast_Comp_create_with_for'];

      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        blockTypes.push(itemBlock.type);
        itemBlock =
          itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      } // Disconnect any children that don't belong.


      for (let i = 1; i < this.itemCount_; i++) {
        const connection =
          this.getInput('GENERATOR' + i).connection.targetConnection;

        if (connection && connections.indexOf(connection) === -1) {
          const connectedBlock = connection.getSourceBlock();

          if (connectedBlock.type === 'ast_comprehensionIf') {
            const testField = connectedBlock.getInput('TEST');

            if (testField.connection.targetConnection) {
              testField.connection
                .targetConnection
                .getSourceBlock()
                .unplug(true);
            }
          } else if (connectedBlock.type === 'ast_comprehensionFor') {
            const iterField = connectedBlock.getInput('ITER');

            if (iterField.connection.targetConnection) {
              iterField.connection
                .targetConnection
                .getSourceBlock()
                .unplug(true);
            }

            const targetField = connectedBlock.getInput('TARGET');

            if (targetField.connection.targetConnection) {
              targetField.connection
                .targetConnection
                .getSourceBlock()
                .unplug(true);
            }
          } else {
            throw Error('Unknown block type: ' + connectedBlock.type);
          }

          connection.disconnect();
          connection.getSourceBlock().dispose();
        }
      }

      this.itemCount_ = connections.length;
      this.updateShape_(); // Reconnect any child blocks.

      for (let i = 1; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'GENERATOR' + i);
        // TODO: glitch when inserting into middle, deletes children values

        if (!connections[i]) {
          let createName = void 0;

          if (blockTypes[i] === 'ast_Comp_create_with_if') {
            createName = 'ast_comprehensionIf';
          } else if (blockTypes[i] === 'ast_Comp_create_with_for') {
            createName = 'ast_comprehensionFor';
          } else {
            throw Error('Unknown block type: ' + blockTypes[i]);
          }

          const _itemBlock2 = this.workspace.newBlock(createName);

          _itemBlock2.setDeletable(false);

          _itemBlock2.setMovable(false);

          _itemBlock2.initSvg();

          this.getInput('GENERATOR' + i)
            .connection
            .connect(_itemBlock2.outputConnection);

          _itemBlock2.render(); // this.get(itemBlock, 'ADD'+i)
        }
      }
    },

    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function saveConnections(containerBlock) {
      containerBlock.valueConnection_ =
        this.getInput('GENERATOR0')
          .connection.targetConnection;
      let itemBlock = containerBlock.getInputTargetBlock('STACK');
      let i = 1;

      while (itemBlock) {
        const input = this.getInput('GENERATOR' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      }
    },

    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function updateShape_() {
      // Add new inputs.
      for (let i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('GENERATOR' + i)) {
          const input = this.appendValueInput('GENERATOR' + i);

          if (i === 0) {
            input.setCheck('ComprehensionFor');
          } else {
            input.setCheck(['ComprehensionFor', 'ComprehensionIf']);
          }

          this.moveInputBefore('GENERATOR' + i, 'END_BRACKET');
        }
      } // Remove deleted inputs.


      while (this.getInput('GENERATOR' + i)) {
        this.removeInput('GENERATOR' + i);
        i++;
      }
    },
  };

  Blockly.Python['ast_' + kind] = function(block) {
    // elt
    let elt;

    if (kind === 'DictComp') {
      const child = block.getInputTargetBlock('ELT');

      if (child === null || child.type !== 'ast_DictItem') {
        elt = Blockly.Python.blank + ': ' + Blockly.Python.blank;
      } else {
        const key =
          Blockly.Python.valueToCode(child, 'KEY', Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
        const value =
          Blockly.Python.valueToCode(child, 'VALUE',
          Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
        elt = key + ': ' + value;
      }
    } else {
      elt =
        Blockly.Python.valueToCode(block, 'ELT', Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank;
    } // generators


    const elements = new Array(block.itemCount_);
    const BAD_DEFAULT =
      elt + ' for ' + Blockly.Python.blank + ' in' + Blockly.Python.blank;

    for (let i = 0; i < block.itemCount_; i++) {
      const _child = block.getInputTargetBlock('GENERATOR' + i);

      if (_child === null) {
        elements[i] = BAD_DEFAULT;
      } else if (_child.type === 'ast_comprehensionIf') {
        const test =
          Blockly.Python.valueToCode(_child, 'TEST',
          Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
        elements[i] = 'if ' + test;
      } else if (_child.type === 'ast_comprehensionFor') {
        const target =
          Blockly.Python
            .valueToCode(_child, 'TARGET', Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
        const iter =
          Blockly.Python.valueToCode(_child, 'ITER',
          Blockly.Python.ORDER_NONE) ||
          Blockly.Python.blank;
        elements[i] = 'for ' + target + ' in ' + iter;
      } else {
        elements[i] = BAD_DEFAULT;
      }
    } // Put it all together


    const code =
      BlockXTextToBlocks.COMP_SETTINGS[kind].start +
      elt + ' ' + elements.join(' ') +
      BlockXTextToBlocks.COMP_SETTINGS[kind].end;
    return [code, Blockly.Python.ORDER_ATOMIC];
  };

  BlockXTextToBlocks.prototype['ast_' + kind] = function(node) {
    const generators = node.generators;
    const elements = {};

    if (kind === 'DictComp') {
      const key = node.key;
      const value = node.value;
      elements['ELT'] =
        BlockXTextToBlocks.create_block('ast_DictItem',
          node.lineno, {}, {
          'KEY': this.convert(key, node),
          'VALUE': this.convert(value, node),
        }, {
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
      elements['GENERATOR' + g] =
        BlockXTextToBlocks.create_block('ast_comprehensionFor',
          node.lineno, {}, {
          'ITER': this.convert(iter, node),
          'TARGET': this.convert(target, node),
        }, DEFAULT_SETTINGS);
      g += 1;

      if (ifs) {
        for (let j = 0; j < ifs.length; j++) {
          elements['GENERATOR' + g] =
            BlockXTextToBlocks.create_block('ast_comprehensionIf',
              node.lineno, {}, {
              'TEST': this.convert(ifs[j], node),
            }, DEFAULT_SETTINGS);
          g += 1;
        }
      }
    }

    return BlockXTextToBlocks.create_block('ast_' +
      kind, node.lineno, {}, elements, {
      'inline': 'false',
    }, {
      '@items': g,
    });
  };
}); // TODO: what if a user deletes a parameter through the context menu?
// The mutator container

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_FunctionHeaderMutator',
  'message0': 'Setup parameters below: %1 %2 returns %3',
  'args0': [{
    'type': 'input_dummy',
  }, {
    'type': 'input_statement',
    'name': 'STACK',
    'align': 'RIGHT',
  }, {
    'type': 'field_checkbox',
    'name': 'RETURNS',
    'checked': true,
    'align': 'RIGHT',
  }],
  'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
  'enableContextMenu': false,
}); // The elements you can put into the mutator

[
  ['Parameter', 'Parameter', '',
    false, false],
  ['ParameterType', 'Parameter with type', '',
    true, false],
  ['ParameterDefault', 'Parameter with default value', '',
    false, true],
  ['ParameterDefaultType', 'Parameter with type and default value', '',
    true, true],
  ['ParameterVararg', 'Variable length parameter', '*',
    false, false],
  ['ParameterVarargType', 'Variable length parameter with type', '*',
    true, false],
  ['ParameterKwarg', 'Keyworded Variable length parameter', '**',
    false],
  ['ParameterKwargType', 'Keyworded Variable length parameter with type', '**',
    true, false]].forEach(function(parameterTypeTuple) {
      const parameterType = parameterTypeTuple[0];
      const parameterDescription = parameterTypeTuple[1];
      const parameterPrefix = parameterTypeTuple[2];
      const parameterTyped = parameterTypeTuple[3];
      const parameterDefault = parameterTypeTuple[4];
      BlockXTextToBlocks.BLOCKS.push({
        'type': 'ast_FunctionMutant' + parameterType,
        'message0': parameterDescription,
        'previousStatement': null,
        'nextStatement': null,
        'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
        'enableContextMenu': false,
      });
      const realParameterBlock = {
        'type': 'ast_Function' + parameterType,
        'output': 'Parameter',
        'message0': parameterPrefix + (parameterPrefix ? ' ' : '') + '%1',
        'args0': [{
          'type': 'field_variable',
          'name': 'NAME',
          'variable': 'param',
        }],
        'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
        'enableContextMenu': false,
        'inputsInline': parameterTyped && parameterDefault,
      };

      if (parameterTyped) {
        realParameterBlock['message0'] += ' : %2';
        realParameterBlock['args0'].push({
          'type': 'input_value',
          'name': 'TYPE',
        });
      }

      if (parameterDefault) {
        realParameterBlock['message0'] += ' = %' + (parameterTyped ? 3 : 2);
        realParameterBlock['args0'].push({
          'type': 'input_value',
          'name': 'DEFAULT',
        });
      }

      BlockXTextToBlocks.BLOCKS.push(realParameterBlock);

      Blockly.Python['ast_Function' + parameterType] = function(block) {
        const name =
          Blockly.Python.variableDB_
            .getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
        let typed = '';

        if (parameterTyped) {
          typed = ': ' +
            (Blockly.Python.valueToCode(block, 'TYPE',
            Blockly.Python.ORDER_NONE) ||
              Blockly.Python.blank);
        }

        let defaulted = '';

        if (parameterDefault) {
          defaulted = '=' + (
            Blockly.Python.valueToCode(block, 'DEFAULT',
              Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank);
        }

        return [parameterPrefix + name + typed + defaulted,
        Blockly.Python.ORDER_ATOMIC];
      };
    });
// TODO: Figure out an elegant "complexity" flag feature
// to allow different levels of Mutators

Blockly.Blocks['ast_FunctionDef'] = {
  init: function init() {
    this.appendDummyInput()
      .appendField('define')
      .appendField(new Blockly.FieldTextInput('function'), 'NAME');
    this.decoratorsCount_ = 0;
    this.parametersCount_ = 0;
    this.hasReturn_ = false;
    this.mutatorComplexity_ = 0;
    this.appendStatementInput('BODY').setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.FUNCTIONS);
    this.updateShape_();
    this.setMutator(new Blockly.Mutator(['ast_FunctionMutantParameter',
      'ast_FunctionMutantParameterType']));
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('decorators', this.decoratorsCount_);
    container.setAttribute('parameters', this.parametersCount_);
    container.setAttribute('returns', this.hasReturn_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.decoratorsCount_ = parseInt(xmlElement.getAttribute('decorators'), 10);
    this.parametersCount_ = parseInt(xmlElement.getAttribute('parameters'), 10);
    this.hasReturn_ = 'true' === xmlElement.getAttribute('returns');
    this.updateShape_();
  },
  setReturnAnnotation_: function setReturnAnnotation_(status) {
    const currentReturn = this.getInput('RETURNS');

    if (status) {
      if (!currentReturn) {
        this.appendValueInput('RETURNS')
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField('returns');
      }

      this.moveInputBefore('RETURNS', 'BODY');
    } else if (!status && currentReturn) {
      this.removeInput('RETURNS');
    }

    this.hasReturn_ = status;
  },
  updateShape_: function updateShape_() {
    // Set up decorators and parameters
    const block = this;
    [
      ['DECORATOR', 'decoratorsCount_', null, 'decorated by'],
      ['PARAMETER', 'parametersCount_', 'Parameter', 'parameters:']]
      .forEach(function(childTypeTuple) {
        const childTypeName = childTypeTuple[0];
        const countVariable = childTypeTuple[1];
        const inputCheck = childTypeTuple[2];
        const childTypeMessage = childTypeTuple[3];
        let i = 0;
        for (; i < block[countVariable]; i++) {
          if (!block.getInput(childTypeName + i)) {
            const input =
              block.appendValueInput(childTypeName + i)
                .setCheck(inputCheck)
                .setAlign(Blockly.ALIGN_RIGHT);

            if (i === 0) {
              input.appendField(childTypeMessage);
            }
          }

          block.moveInputBefore(childTypeName + i, 'BODY');
        } // Remove deleted inputs.


        while (block.getInput(childTypeName + i)) {
          block.removeInput(childTypeName + i);
          i++;
        }
      }); // Set up optional Returns annotation

    this.setReturnAnnotation_(this.hasReturn_);
  },

  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function decompose(workspace) {
    const containerBlock = workspace.newBlock('ast_FunctionHeaderMutator');
    containerBlock.initSvg(); // Check/uncheck the allow statement box.

    if (this.getInput('RETURNS')) {
      containerBlock
        .setFieldValue(this.hasReturn_ ? 'TRUE' : 'FALSE', 'RETURNS');
    } else {// TODO: set up "canReturns" for lambda mode
      // containerBlock.getField('RETURNS').setVisible(false);
    } // Set up parameters


    let connection = containerBlock.getInput('STACK').connection;
    const parameters = [];

    for (let i = 0; i < this.parametersCount_; i++) {
      const parameter = this.getInput('PARAMETER' + i).connection;
      const sourceType = parameter.targetConnection.getSourceBlock().type;
      const createName =
        'ast_FunctionMutant' + sourceType.substring('ast_Function'.length);
      const itemBlock = workspace.newBlock(createName);
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
      parameters.push(itemBlock);
    }

    return containerBlock;
  },

  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function compose(containerBlock) {
    let itemBlock =
      containerBlock.getInputTargetBlock('STACK'); // Count number of inputs.

    const connections = [];
    const blockTypes = [];

    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      blockTypes.push(itemBlock.type);
      itemBlock =
        itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    } // Disconnect any children that don't belong.


    for (let i = 0; i < this.parametersCount_; i++) {
      const connection =
        this.getInput('PARAMETER' + i).connection.targetConnection;

      if (connection && connections.indexOf(connection) === -1) {
        // Disconnect all children of this block
        const connectedBlock = connection.getSourceBlock();

        for (let j = 0; j < connectedBlock.inputList.length; j++) {
          const field = connectedBlock.inputList[j].connection;

          if (field && field.targetConnection) {
            field.targetConnection.getSourceBlock().unplug(true);
          }
        }

        connection.disconnect();
        connection.getSourceBlock().dispose();
      }
    }

    this.parametersCount_ = connections.length;
    this.updateShape_(); // Reconnect any child blocks.

    for (let _i6 = 0; _i6 < this.parametersCount_; _i6++) {
      Blockly.Mutator.reconnect(connections[_i6], this, 'PARAMETER' + _i6);

      if (!connections[_i6]) {
        const createName =
          'ast_Function' +
          blockTypes[_i6].substring('ast_FunctionMutant'.length);

        const _itemBlock3 = this.workspace.newBlock(createName);

        _itemBlock3.setDeletable(false);

        _itemBlock3.setMovable(false);

        _itemBlock3.initSvg();

        this.getInput('PARAMETER' + _i6)
          .connection.connect(_itemBlock3.outputConnection);

        _itemBlock3.render(); // this.get(itemBlock, 'ADD'+i)
      }
    } // Show/hide the returns annotation


    let hasReturns = containerBlock.getFieldValue('RETURNS');

    if (hasReturns !== null) {
      hasReturns = hasReturns === 'TRUE';

      if (this.hasReturn_ != hasReturns) {
        if (hasReturns) {
          this.setReturnAnnotation_(true);
          Blockly.Mutator.reconnect(this.returnConnection_, this, 'RETURNS');
          this.returnConnection_ = null;
        } else {
          const returnConnection = this.getInput('RETURNS').connection;
          this.returnConnection_ = returnConnection.targetConnection;

          if (this.returnConnection_) {
            const returnBlock = returnConnection.targetBlock();
            returnBlock.unplug();
            returnBlock.bumpNeighbours_();
          }

          this.setReturnAnnotation_(false);
        }
      }
    }
  },

  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function saveConnections(containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;

    while (itemBlock) {
      const input = this.getInput('PARAMETER' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
    }
  },
};

Blockly.Python['ast_FunctionDef'] = function(block) {
  // Name
  const name =
    Blockly.Python.variableDB_
      .getName(block.getFieldValue('NAME'),
        Blockly.Variables.NAME_TYPE); // Decorators

  const decorators = new Array(block.decoratorsCount_);

  for (let i = 0; i < block.decoratorsCount_; i++) {
    const decorator =
      Blockly.Python
        .valueToCode(block, 'DECORATOR' + i, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
    decorators[i] = '@' + decorator + '\n';
  } // Parameters


  const parameters = new Array(block.parametersCount_);

  for (let _i7 = 0; _i7 < block.parametersCount_; _i7++) {
    parameters[_i7] =
      Blockly.Python
        .valueToCode(block, 'PARAMETER' + _i7, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  } // Return annotation


  let returns = '';

  if (this.hasReturn_) {
    returns = ' -> ' +
      Blockly.Python.valueToCode(block, 'RETURNS', Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  } // Body


  const body =
    Blockly.Python.statementToCode(block, 'BODY') ||
    Blockly.Python.PASS;
  return decorators.join('') + 'def ' + name +
    '(' + parameters.join(', ') + ')' + returns + ':\n' + body;
};

BlockXTextToBlocks.prototype.parseArg =
  function(arg, type, lineno, values, node) {
    const settings = {
      'movable': false,
      'deletable': false,
    };

    if (arg.annotation === null) {
      return BlockXTextToBlocks.create_block(type, lineno, {
        'NAME': Sk.ffi.remapToJs(arg.arg),
      }, values, settings);
    } else {
      values['TYPE'] = this.convert(arg.annotation, node);
      return BlockXTextToBlocks.create_block(type + 'Type', lineno, {
        'NAME': Sk.ffi.remapToJs(arg.arg),
      }, values, settings);
    }
  };

BlockXTextToBlocks.prototype.parseArgs =
  function(args, values, lineno, node) {
    const positional = args.args;
    const vararg = args.vararg;
    const kwonlyargs = args.kwonlyargs;
    const kwarg = args.kwarg;
    const defaults = args.defaults;
    const kwDefaults = args.kw_defaults;
    let totalArgs = 0; // args (positional)

    if (positional !== null) {
      // "If there are fewer defaults, they correspond to the last n arguments."
      const defaultOffset = defaults ? defaults.length - positional.length : 0;

      for (let i = 0; i < positional.length; i++) {
        const childValues = {};
        let type = 'ast_FunctionParameter';

        if (defaults[defaultOffset + i]) {
          childValues['DEFAULT'] =
            this.convert(defaults[defaultOffset + i], node);
          type += 'Default';
        }

        values['PARAMETER' + totalArgs] =
          this.parseArg(positional[i], type, lineno, childValues, node);
        totalArgs += 1;
      }
    } // *arg


    if (vararg !== null) {
      values['PARAMETER' + totalArgs] =
        this.parseArg(vararg, 'ast_FunctionParameterVararg', lineno, {}, node);
      totalArgs += 1;
    } // keyword arguments that must be referenced by name


    if (kwonlyargs !== null) {
      for (let _i8 = 0; _i8 < kwonlyargs.length; _i8++) {
        const _childValues = {};
        let _type = 'ast_FunctionParameter';

        if (kwDefaults[_i8]) {
          _childValues['DEFAULT'] = this.convert(kwDefaults[_i8], node);
          _type += 'Default';
        }

        values['PARAMETER' + totalArgs] =
          this.parseArg(kwonlyargs[_i8], _type, lineno, _childValues, node);
        totalArgs += 1;
      }
    } // **kwarg


    if (kwarg) {
      values['PARAMETER' + totalArgs] =
        this.parseArg(kwarg, 'ast_FunctionParameterKwarg', lineno, {}, node);
      totalArgs += 1;
    }

    return totalArgs;
  };

BlockXTextToBlocks.prototype['ast_FunctionDef'] = function(node) {
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

  const hasReturn =
    returns !== null && (
      returns._astname !== 'NameConstant' ||
      returns.value !== Sk.builtin.none.none$);

  if (hasReturn) {
    values['RETURNS'] = this.convert(returns, node);
  }

  return BlockXTextToBlocks.create_block('ast_FunctionDef', node.lineno, {
    'NAME': Sk.ffi.remapToJs(name),
  }, values, {
    'inline': 'false',
  }, {
    '@decorators': decoratorList === null ? 0 : decoratorList.length,
    '@parameters': parsedArgs,
    '@returns': hasReturn,
  }, {
    'BODY': this.convertBody(body, node),
  });
};

Blockly.Blocks['ast_Lambda'] = {
  init: function init() {
    this.appendDummyInput().appendField('lambda').setAlign(Blockly.ALIGN_RIGHT);
    this.decoratorsCount_ = 0;
    this.parametersCount_ = 0;
    this.hasReturn_ = false;
    this.appendValueInput('BODY')
      .appendField('body')
      .setAlign(Blockly.ALIGN_RIGHT)
      .setCheck(null);
    this.setInputsInline(false);
    this.setOutput(true);
    this.setColour(BlockXTextToBlocks.COLOR.FUNCTIONS);
    this.updateShape_();
  },
  mutationToDom: Blockly.Blocks['ast_FunctionDef'].mutationToDom,
  domToMutation: Blockly.Blocks['ast_FunctionDef'].domToMutation,
  updateShape_: Blockly.Blocks['ast_FunctionDef'].updateShape_,
  setReturnAnnotation_: Blockly.Blocks['ast_FunctionDef'].setReturnAnnotation_,
};

Blockly.Python['ast_Lambda'] = function(block) {
  // Parameters
  const parameters = new Array(block.parametersCount_);

  for (let i = 0; i < block.parametersCount_; i++) {
    parameters[i] =
      Blockly.Python
        .valueToCode(block, 'PARAMETER' + i, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  } // Body


  const body =
    Blockly.Python.valueToCode(block, 'BODY', Blockly.Python.ORDER_LAMBDA) ||
    Blockly.Python.PASS;
  return ['lambda ' +
    parameters.join(', ') +
    ': ' + body, Blockly.Python.ORDER_LAMBDA];
};

BlockXTextToBlocks.prototype['ast_Lambda'] = function(node) {
  const args = node.args;
  const body = node.body;
  const values = {
    'BODY': this.convert(body, node),
  };
  let parsedArgs = 0;

  if (args !== null) {
    parsedArgs = this.parseArgs(args, values, node.lineno);
  }

  return BlockXTextToBlocks.create_block('ast_Lambda',
    node.lineno, {}, values, {
    'inline': 'false',
  }, {
    '@decorators': 0,
    '@parameters': parsedArgs,
    '@returns': false,
  });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_ReturnFull',
  'message0': 'return %1',
  'args0': [{
    'type': 'input_value',
    'name': 'VALUE',
  }],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Return',
  'message0': 'return',
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
});

Blockly.Python['ast_Return'] = function() {
  return 'return\n';
};

Blockly.Python['ast_ReturnFull'] = function(block) {
  const value = Blockly.Python.valueToCode(block, 'VALUE',
    Blockly.Python.ORDER_ATOMIC) ||
    Blockly.Python.blank;
  return 'return ' + value + '\n';
};

BlockXTextToBlocks.prototype['ast_Return'] = function(node) {
  const value = node.value;

  if (value == null) {
    return BlockXTextToBlocks.create_block('ast_Return', node.lineno);
  } else {
    return BlockXTextToBlocks.create_block('ast_ReturnFull',
      node.lineno, {}, {
      'VALUE': this.convert(value, node),
    });
  }
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_YieldFull',
  'message0': 'yield %1',
  'args0': [{
    'type': 'input_value',
    'name': 'VALUE',
  }],
  'inputsInline': false,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
});
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Yield',
  'message0': 'yield',
  'inputsInline': false,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
});

Blockly.Python['ast_Yield'] = function() {
  return ['yield', Blockly.Python.ORDER_LAMBDA];
};

Blockly.Python['ast_YieldFull'] = function(block) {
  const value = Blockly.Python.valueToCode(block, 'VALUE',
    Blockly.Python.ORDER_LAMBDA) ||
    Blockly.Python.blank;
  return ['yield ' + value, Blockly.Python.ORDER_LAMBDA];
};

BlockXTextToBlocks.prototype['ast_Yield'] = function(node) {
  const value = node.value;

  if (value == null) {
    return BlockXTextToBlocks.create_block('ast_Yield', node.lineno);
  } else {
    return BlockXTextToBlocks.create_block('ast_YieldFull', node.lineno,
      {}, {
      'VALUE': this.convert(value, node),
    });
  }
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_YieldFrom',
  'message0': 'yield from %1',
  'args0': [{
    'type': 'input_value',
    'name': 'VALUE',
  }],
  'inputsInline': false,
  'output': null,
  'colour': BlockXTextToBlocks.COLOR.FUNCTIONS,
});

Blockly.Python['ast_YieldFrom'] = function(block) {
  const value = Blockly.Python.valueToCode(block, 'VALUE',
    Blockly.Python.ORDER_LAMBDA) || Blockly.Python.blank;
  return ['yield from ' + value, Blockly.Python.ORDER_LAMBDA];
};

BlockXTextToBlocks.prototype['ast_YieldFrom'] = function(node) {
  const value = node.value;
  return BlockXTextToBlocks.create_block('ast_YieldFrom',
    node.lineno, {}, {
    'VALUE': this.convert(value, node),
  });
};

Blockly.Blocks['ast_Global'] = {
  init: function init() {
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.VARIABLES);
    this.nameCount_ = 1;
    this.appendDummyInput('GLOBAL').appendField('make global', 'START_GLOBALS');
    this.updateShape_();
  },
  updateShape_: function updateShape_() {
    const input = this.getInput('GLOBAL'); // Update pluralization

    if (this.getField('START_GLOBALS')) {
      this.setFieldValue(this.nameCount_ > 1 ?
        'make globals' : 'make global',
        'START_GLOBALS');
    } // Update fields


    for (let i = 0; i < this.nameCount_; i++) {
      if (!this.getField('NAME' + i)) {
        if (i !== 0) {
          input.appendField(',').setAlign(Blockly.ALIGN_RIGHT);
        }

        input.appendField(new Blockly.FieldVariable('variable'), 'NAME' + i);
      }
    } // Remove deleted fields.


    while (this.getField('NAME' + i)) {
      input.removeField('NAME' + i);
      i++;
    } // Delete and re-add ending field


    if (this.getField('END_GLOBALS')) {
      input.removeField('END_GLOBALS');
    }

    input.appendField('available', 'END_GLOBALS');
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('names', this.nameCount_);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.nameCount_ = parseInt(xmlElement.getAttribute('names'), 10);
    this.updateShape_();
  },
};

Blockly.Python['ast_Global'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.nameCount_);

  for (let i = 0; i < block.nameCount_; i++) {
    elements[i] =
      Blockly.Python.variableDB_
        .getName(block.getFieldValue('NAME' + i), Blockly.Variables.NAME_TYPE);
  }

  return 'global ' + elements.join(', ') + '\n';
};

BlockXTextToBlocks.prototype['ast_Global'] = function(node) {
  const names = node.names;
  const fields = {};

  for (let i = 0; i < names.length; i++) {
    fields['NAME' + i] = Sk.ffi.remapToJs(names[i]);
  }

  return BlockXTextToBlocks
    .create_block('ast_Global', node.lineno, fields, {}, {
      'inline': 'true',
    }, {
      '@names': names.length,
    });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Break',
  'message0': 'break',
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.CONTROL,
});

Blockly.Python['ast_Break'] = function() {
  return 'break\n';
};

BlockXTextToBlocks.prototype['ast_Break'] = function(node) {
  return BlockXTextToBlocks.create_block('ast_Break', node.lineno);
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Continue',
  'message0': 'continue',
  'inputsInline': false,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.CONTROL,
});

Blockly.Python['ast_Continue'] = function() {
  return 'continue\n';
};

BlockXTextToBlocks.prototype['ast_Continue'] = function(node) {
  return BlockXTextToBlocks.create_block('ast_Continue', node.lineno);
};

BlockXTextToBlocks.HANDLERS_CATCH_ALL = 0;
BlockXTextToBlocks.HANDLERS_NO_AS = 1;
BlockXTextToBlocks.HANDLERS_COMPLETE = 3;
Blockly.Blocks['ast_Try'] = {
  init: function init() {
    this.handlersCount_ = 0;
    this.handlers_ = [];
    this.hasElse_ = false;
    this.hasFinally_ = false;
    this.appendDummyInput().appendField('try:');
    this.appendStatementInput('BODY')
      .setCheck(null)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.EXCEPTIONS);
    this.updateShape_();
  },
  // TODO: Not mutable currently
  updateShape_: function updateShape_() {
    for (let i = 0; i < this.handlersCount_; i++) {
      if (this.handlers_[i] === BlockXTextToBlocks.HANDLERS_CATCH_ALL) {
        this.appendDummyInput().appendField('except');
      } else {
        this.appendValueInput('TYPE' + i).setCheck(null).appendField('except');

        if (this.handlers_[i] === BlockXTextToBlocks.HANDLERS_COMPLETE) {
          this.appendDummyInput()
            .appendField('as')
            .appendField(new Blockly.FieldVariable('item'), 'NAME' + i);
        }
      }

      this.appendStatementInput('HANDLER' + i).setCheck(null);
    }

    if (this.hasElse_) {
      this.appendDummyInput().appendField('else:');
      this.appendStatementInput('ORELSE').setCheck(null);
    }

    if (this.hasFinally_) {
      this.appendDummyInput().appendField('finally:');
      this.appendStatementInput('FINALBODY').setCheck(null);
    }
  },

  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('orelse', this.hasElse_);
    container.setAttribute('finalbody', this.hasFinally_);
    container.setAttribute('handlers', this.handlersCount_);

    for (let i = 0; i < this.handlersCount_; i++) {
      const parameter = document.createElement('arg');
      parameter.setAttribute('name', this.handlers_[i]);
      container.appendChild(parameter);
    }

    return container;
  },

  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.hasElse_ = 'true' === xmlElement.getAttribute('orelse');
    this.hasFinally_ = 'true' === xmlElement.getAttribute('finalbody');
    this.handlersCount_ = parseInt(xmlElement.getAttribute('handlers'), 10);
    this.handlers_ = [];

    for (let i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() === 'arg') {
        this.handlers_.push(parseInt(childNode.getAttribute('name'), 10));
      }
    }

    this.updateShape_();
  },
};

Blockly.Python['ast_Try'] = function(block) {
  // Try:
  const body =
    Blockly.Python.statementToCode(block, 'BODY') ||
    Blockly.Python.PASS; // Except clauses

  const handlers = new Array(block.handlersCount_);

  for (let i = 0; i < block.handlersCount_; i++) {
    const level = block.handlers_[i];
    let clause = 'except';

    if (level !== BlockXTextToBlocks.HANDLERS_CATCH_ALL) {
      clause += ' ' +
        Blockly.Python.valueToCode(block, 'TYPE' + i,
          Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank;

      if (level === BlockXTextToBlocks.HANDLERS_COMPLETE) {
        clause += ' as ' +
          Blockly.Python.variableDB_
            .getName(block.getFieldValue('NAME' + i),
            Blockly.Variables.NAME_TYPE);
      }
    }

    clause += ':\n' +
      (Blockly.Python.statementToCode(block, 'HANDLER' + i) ||
        Blockly.Python.PASS);
    handlers[i] = clause;
  } // Orelse:


  let orelse = '';

  if (this.hasElse_) {
    orelse = 'else:\n' +
      (Blockly.Python.statementToCode(block, 'ORELSE') ||
        Blockly.Python.PASS);
  } // Finally:


  let finalbody = '';

  if (this.hasFinally_) {
    finalbody = 'finally:\n' +
      (Blockly.Python.statementToCode(block, 'FINALBODY') ||
        Blockly.Python.PASS);
  }

  return 'try:\n' + body + handlers.join('') + orelse + finalbody;
};

BlockXTextToBlocks.prototype['ast_Try'] = function(node) {
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
  const statements = {
    'BODY': this.convertBody(body, node),
  };

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
      handledLevels.push(BlockXTextToBlocks.HANDLERS_CATCH_ALL);
    } else {
      values['TYPE' + i] = this.convert(handler.type, node);

      if (handler.name === null) {
        handledLevels.push(BlockXTextToBlocks.HANDLERS_NO_AS);
      } else {
        handledLevels.push(BlockXTextToBlocks.HANDLERS_COMPLETE);
        fields['NAME' + i] = Sk.ffi.remapToJs(handler.name.id);
      }
    }
  }

  mutations['ARG'] = handledLevels;
  return BlockXTextToBlocks
    .create_block('ast_Try', node.lineno, fields, values,
      {}, mutations, statements);
};

Blockly.Blocks['ast_ClassDef'] = {
  init: function init() {
    this.decorators_ = 0;
    this.bases_ = 0;
    this.keywords_ = 0;
    this.appendDummyInput('HEADER')
      .appendField('Class')
      .appendField(new Blockly.FieldVariable('item'), 'NAME');
    this.appendStatementInput('BODY').setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.OO);
    this.updateShape_();
  },
  // TODO: Not mutable currently
  updateShape_: function updateShape_() {
    for (let i = 0; i < this.decorators_; i++) {
      const input =
        this.appendValueInput('DECORATOR' + i)
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT);

      if (i === 0) {
        input.appendField('decorated by');
      }

      this.moveInputBefore('DECORATOR' + i, 'BODY');
    }

    for (let _i9 = 0; _i9 < this.bases_; _i9++) {
      const _input =
        this.appendValueInput('BASE' + _i9)
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT);

      if (_i9 === 0) {
        _input.appendField('inherits from');
      }

      this.moveInputBefore('BASE' + _i9, 'BODY');
    }

    for (let _i10 = 0; _i10 < this.keywords_; _i10++) {
      this.appendValueInput('KEYWORDVALUE' + _i10)
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldTextInput('metaclass'),
          'KEYWORDNAME' + _i10)
        .appendField('=');
      this.moveInputBefore('KEYWORDVALUE' + _i10, 'BODY');
    }
  },

  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('decorators', this.decorators_);
    container.setAttribute('bases', this.bases_);
    container.setAttribute('keywords', this.keywords_);
    return container;
  },

  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.decorators_ = parseInt(xmlElement.getAttribute('decorators'), 10);
    this.bases_ = parseInt(xmlElement.getAttribute('bases'), 10);
    this.keywords_ = parseInt(xmlElement.getAttribute('keywords'), 10);
    this.updateShape_();
  },
};

Blockly.Python['ast_ClassDef'] = function(block) {
  // Name
  const name =
    Blockly.Python.variableDB_
      .getName(block.getFieldValue('NAME'),
        Blockly.Variables.NAME_TYPE); // Decorators

  const decorators = new Array(block.decorators_);

  for (let i = 0; i < block.decorators_; i++) {
    const decorator =
      Blockly.Python
        .valueToCode(block, 'DECORATOR' + i, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
    decorators[i] = '@' + decorator + '\n';
  } // Bases


  const bases = new Array(block.bases_);

  for (let _i11 = 0; _i11 < block.bases_; _i11++) {
    bases[_i11] =
      Blockly.Python.valueToCode(block,
        'BASE' + _i11, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  } // Keywords


  const keywords = new Array(block.keywords_);

  for (let _i12 = 0; _i12 < block.keywords_; _i12++) {
    const _name = block.getFieldValue('KEYWORDNAME' + _i12);

    const value =
      Blockly.Python.valueToCode(block,
        'KEYWORDVALUE' + _i12, Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;

    if (_name == '**') {
      keywords[_i12] = '**' + value;
    } else {
      keywords[_i12] = _name + '=' + value;
    }
  } // Body:


  const body =
    Blockly.Python.statementToCode(block, 'BODY') ||
    Blockly.Python.PASS; // Put it together

  let args = bases.concat(keywords);
  args = args.length === 0 ? '' : '(' + args.join(', ') + ')';
  return decorators.join('') + 'class ' + name + args + ':\n' + body;
};

BlockXTextToBlocks.prototype['ast_ClassDef'] = function(node) {
  const name = node.name;
  const bases = node.bases;
  const keywords = node.keywords;
  const body = node.body;
  const decoratorList = node.decorator_list;
  const values = {};
  const fields = {
    'NAME': Sk.ffi.remapToJs(name),
  };

  if (decoratorList !== null) {
    for (let i = 0; i < decoratorList.length; i++) {
      values['DECORATOR' + i] = this.convert(decoratorList[i], node);
    }
  }

  if (bases !== null) {
    for (let _i13 = 0; _i13 < bases.length; _i13++) {
      values['BASE' + _i13] = this.convert(bases[_i13], node);
    }
  }

  if (keywords !== null) {
    for (let _i14 = 0; _i14 < keywords.length; _i14++) {
      values['KEYWORDVALUE' + _i14] = this.convert(keywords[_i14].value, node);
      const arg = keywords[_i14].arg;

      if (arg === null) {
        fields['KEYWORDNAME' + _i14] = '**';
      } else {
        fields['KEYWORDNAME' + _i14] = Sk.ffi.remapToJs(arg);
      }
    }
  }

  return BlockXTextToBlocks.create_block('ast_ClassDef',
    node.lineno, fields, values, {
    'inline': 'false',
  }, {
    '@decorators': decoratorList === null ? 0 : decoratorList.length,
    '@bases': bases === null ? 0 : bases.length,
    '@keywords': keywords === null ? 0 : keywords.length,
  }, {
    'BODY': this.convertBody(body, node),
  });
}; // TODO: direct imports are not variables, because you can do stuff like:
//         import os.path
//       What should the variable be?
//       Blockly will mangle it, but we should really be
//       doing something more complicated here with namespaces
//       (probably make `os` the
//       variable and have some kind of list of attributes.
//       But that's in the fading zone.


Blockly.Blocks['ast_Import'] = {
  init: function init() {
    this.nameCount_ = 1;
    this.from_ = false;
    this.regulars_ = [true];
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.PYTHON);
    this.updateShape_();
  },
  // TODO: Not mutable currently
  updateShape_: function updateShape_() {
    // Possible FROM part
    if (this.from_ && !this.getInput('FROM')) {
      this.appendDummyInput('FROM')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('from')
        .appendField(new Blockly.FieldTextInput('module'), 'MODULE');
    } else if (!this.from_ && this.getInput('FROM')) {
      this.removeInput('FROM');
    } // Import clauses


    for (let i = 0; i < this.nameCount_; i++) {
      let input = this.getInput('CLAUSE' + i);

      if (!input) {
        input = this
          .appendDummyInput('CLAUSE' + i)
          .setAlign(Blockly.ALIGN_RIGHT);

        if (i === 0) {
          input.appendField('import');
        }

        input.appendField(new Blockly.FieldTextInput('default'), 'NAME' + i);
      }

      if (this.regulars_[i] && this.getField('AS' + i)) {
        input.removeField('AS' + i);
        input.removeField('ASNAME' + i);
      } else if (!this.regulars_[i] && !this.getField('AS' + i)) {
        input.appendField('as', 'AS' + i)
          .appendField(new Blockly.FieldVariable('alias'), 'ASNAME' + i);
      }
    } // Remove deleted inputs.


    while (this.getInput('CLAUSE' + i)) {
      this.removeInput('CLAUSE' + i);
      i++;
    } // Reposition everything


    if (this.from_ && this.nameCount_ > 0) {
      this.moveInputBefore('FROM', 'CLAUSE0');
    }

    for (i = 0; i + 1 < this.nameCount_; i++) {
      this.moveInputBefore('CLAUSE' + i, 'CLAUSE' + (i + 1));
    }
  },

  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('names', this.nameCount_);
    container.setAttribute('from', this.from_);

    for (let i = 0; i < this.nameCount_; i++) {
      const parameter = document.createElement('regular');
      parameter.setAttribute('name', this.regulars_[i]);
      container.appendChild(parameter);
    }

    return container;
  },

  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.nameCount_ = parseInt(xmlElement.getAttribute('names'), 10);
    this.from_ = 'true' === xmlElement.getAttribute('from');
    this.regulars_ = [];

    for (let i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() === 'regular') {
        this.regulars_.push('true' === childNode.getAttribute('name'));
      }
    }

    this.updateShape_();
  },
};

Blockly.Python['ast_Import'] = function(block) {
  // Optional from part
  let from = '';

  if (this.from_) {
    const moduleName = block.getFieldValue('MODULE');
    from = 'from ' + moduleName + ' ';
    Blockly.Python.imported_['import_' + moduleName] = moduleName;
  } // Create a list with any number of elements of any type.


  const elements = new Array(block.nameCount_);

  for (let i = 0; i < block.nameCount_; i++) {
    let name = block.getFieldValue('NAME' + i);
    elements[i] = name;

    if (!this.regulars_[i]) {
      name = Blockly.Python.variableDB_
        .getName(block.getFieldValue('ASNAME' + i),
        Blockly.Variables.NAME_TYPE);
      elements[i] += ' as ' + name;
    }

    if (!from) {
      Blockly.Python.imported_['import_' + name] = name;
    }
  }

  return from + 'import ' + elements.join(', ') + '\n';
};

BlockXTextToBlocks.prototype['ast_Import'] = function(node) {
  const names = node.names;
  const fields = {};
  const mutations = {
    '@names': names.length,
  };
  const regulars = [];
  let simpleName = '';

  for (let i = 0; i < names.length; i++) {
    fields['NAME' + i] = Sk.ffi.remapToJs(names[i].name);
    const isRegular = names[i].asname === null;

    if (!isRegular) {
      fields['ASNAME' + i] = Sk.ffi.remapToJs(names[i].asname);
      simpleName = fields['ASNAME' + i];
    } else {
      simpleName = fields['NAME' + i];
    }

    regulars.push(isRegular);
  }

  mutations['regular'] = regulars;

  if (this.hiddenImports.indexOf(simpleName) !== -1) {
    return null;
  }

  if (node._astname === 'ImportFrom') {
    // acbart: GTS suggests module can be None for
    //  '.' but it's an empty string in Skulpt
    mutations['@from'] = true;
    fields['MODULE'] = '.'.repeat(node.level) + Sk.ffi.remapToJs(node.module);
  } else {
    mutations['@from'] = false;
  }

  return BlockXTextToBlocks.create_block('ast_Import',
    node.lineno, fields, {}, {
    'inline': true,
  }, mutations);
}; // Alias ImportFrom because of big overlap


BlockXTextToBlocks.prototype['ast_ImportFrom'] =
  BlockXTextToBlocks.prototype['ast_Import'];
BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_WithItem',
  'output': 'WithItem',
  'message0': 'context %1',
  'args0': [{
    'type': 'input_value',
    'name': 'CONTEXT',
  }],
  'enableContextMenu': false,
  'colour': BlockXTextToBlocks.COLOR.CONTROL,
  'inputsInline': false,
});

Blockly.Python['ast_WithItem'] = function(block) {
  const context = Blockly.Python
    .valueToCode(block, 'CONTEXT', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  return [context, Blockly.Python.ORDER_NONE];
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_WithItemAs',
  'output': 'WithItem',
  'message0': 'context %1 as %2',
  'args0': [{
    'type': 'input_value',
    'name': 'CONTEXT',
  }, {
    'type': 'input_value',
    'name': 'AS',
  }],
  'enableContextMenu': false,
  'colour': BlockXTextToBlocks.COLOR.CONTROL,
  'inputsInline': true,
});

Blockly.Python['ast_WithItemAs'] = function(block) {
  const context =
    Blockly.Python.valueToCode(block, 'CONTEXT', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  const as =
    Blockly.Python.valueToCode(block, 'AS', Blockly.Python.ORDER_NONE) ||
    Blockly.Python.blank;
  return [context + ' as ' + as, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['ast_With'] = {
  init: function init() {
    this.appendValueInput('ITEM0').appendField('with');
    this.appendStatementInput('BODY').setCheck(null);
    this.itemCount_ = 1;
    this.renames_ = [false];
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlockXTextToBlocks.COLOR.CONTROL);
    this.updateShape_();
  },

  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);

    for (let i = 0; i < this.itemCount_; i++) {
      const parameter = document.createElement('as');
      parameter.setAttribute('name', this.renames_[i]);
      container.appendChild(parameter);
    }

    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function domToMutation(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.renames_ = [];

    for (let i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() === 'as') {
        this.renames_.push('true' === childNode.getAttribute('name'));
      }
    }

    this.updateShape_();
  },
  updateShape_: function updateShape_() {
    // With clauses
    for (let i = 1; i < this.itemCount_; i++) {
      let input = this.getInput('ITEM' + i);

      if (!input) {
        input = this.appendValueInput('ITEM' + i);
      }
    } // Remove deleted inputs.


    while (this.getInput('ITEM' + i)) {
      this.removeInput('ITEM' + i);
      i++;
    } // Reposition everything


    for (i = 0; i < this.itemCount_; i++) {
      this.moveInputBefore('ITEM' + i, 'BODY');
    }
  },
};

Blockly.Python['ast_With'] = function(block) {
  // Contexts
  const items = new Array(block.itemCount_);

  for (let i = 0; i < block.itemCount_; i++) {
    items[i] =
      Blockly.Python.valueToCode(block, 'ITEM' + i,
      Blockly.Python.ORDER_NONE) ||
      Blockly.Python.blank;
  } // Body


  const body =
    Blockly.Python.statementToCode(block, 'BODY') ||
    Blockly.Python.PASS;
  return 'with ' + items.join(', ') + ':\n' + body;
};

BlockXTextToBlocks.prototype['ast_With'] = function(node) {
  const items = node.items;
  const body = node.body;
  const values = {};
  const mutations = {
    '@items': items.length,
  };
  const renamedItems = [];

  for (let i = 0; i < items.length; i++) {
    const hasRename = items[i].optional_vars;
    renamedItems.push(hasRename);
    const innerValues = {
      'CONTEXT': this.convert(items[i].context_expr, node),
    };

    if (hasRename) {
      innerValues['AS'] = this.convert(items[i].optional_vars, node);
      values['ITEM' + i] =
        BlockXTextToBlocks.create_block('ast_WithItemAs', node.lineno, {},
          innerValues, this.LOCKED_BLOCK);
    } else {
      values['ITEM' + i] =
        BlockXTextToBlocks.create_block('ast_WithItem', node.lineno, {},
          innerValues, this.LOCKED_BLOCK);
    }
  }

  mutations['as'] = renamedItems;
  return BlockXTextToBlocks.create_block('ast_With',
    node.lineno, {}, values, {
    'inline': 'false',
  }, mutations, {
    'BODY': this.convertBody(body, node),
  });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Comment',
  'message0': '# Comment: %1',
  'args0': [{
    'type': 'field_input',
    'name': 'BODY',
    'text': 'will be ignored',
  }],
  'inputsInline': true,
  'previousStatement': null,
  'nextStatement': null,
  'colour': BlockXTextToBlocks.COLOR.PYTHON,
});

Blockly.Python['ast_Comment'] = function(block) {
  const textBody = block.getFieldValue('BODY');
  return '#' + textBody + '\n';
};

BlockXTextToBlocks.prototype['ast_Comment'] = function(txt, lineno) {
  const commentText = txt.slice(1);
  /* if (commentText.length && commentText[0] === " ") {
      commentText = commentText.substring(1);
  }*/

  return BlockXTextToBlocks.create_block('ast_Comment', lineno, {
    'BODY': commentText,
  });
};

BlockXTextToBlocks.BLOCKS.push({
  'type': 'ast_Raw',
  'message0': 'Code Block: %1 %2',
  'args0': [{
    'type': 'input_dummy',
  }, {
    'type': 'field_multilinetext',
    'name': 'TEXT',
    'value': '',
  }],
  'colour': BlockXTextToBlocks.COLOR.PYTHON,
  'previousStatement': null,
  'nextStatement': null,
});

Blockly.Python['ast_Raw'] = function(block) {
  const code = block.getFieldValue('TEXT') + '\n';
  return code;
};
