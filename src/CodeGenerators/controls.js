/**
 * controls块的代码生成器
 * @date 2022-08-23
 * @param {any} Blockly
 */
function controlsGenerate(Blockly) {
  Blockly.Python['for'] = function(block) {
  // for each loop.
    const argument0 = Blockly.Python.valueToCode(block, 'TARGET',
        Blockly.Python.ORDER_RELATIONAL) || Blockly.Python.blank;
    const argument1 = Blockly.Python.valueToCode(block, 'ITERATOR',
        Blockly.Python.ORDER_RELATIONAL) || Blockly.Python.blank;
    const branchBody =
    Blockly.Python.statementToCode(block, 'BODY') ||
    Blockly.Python.PASS;
    const branchElse = Blockly.Python.statementToCode(block, 'ELSE');
    let code = 'for ' + argument0 + ' in ' + argument1 + ':\n' + branchBody;
    if (branchElse) {
      code += 'else:\n' + branchElse;
    }
    return code;
  };
  Blockly.Python['for_else'] = Blockly.Python['for'];

  Blockly.Python['while'] = function(block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = Blockly.Python.valueToCode(block, 'BOOL', until ?
      Blockly.Python.ORDER_LOGICAL_NOT :
      Blockly.Python.ORDER_NONE) || 'False';
    let branchBody = Blockly.Python.statementToCode(block, 'DO');
    branchBody = Blockly.Python.addLoopTrap(branchBody, block) ||
      Blockly.Python.PASS;
    const branchElse = (Blockly.Python.statementToCode(block, 'ELSE') ||
      Blockly.Python.PASS);
    if (until) {
      argument0 = `not ${ argument0}`;
    }
    return `while ${argument0}:\n${branchBody}else:\n${branchElse}`;
  };

  Blockly.Python['if'] = function(block) {
  // Test
    const test = 'if ' + (Blockly.Python.valueToCode(block, 'TEST',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank) + ':\n';
    // Body:
    const body =
      Blockly.Python.statementToCode(block, 'BODY') ||
      Blockly.Python.PASS;
    // Elifs
    const elifs = new Array(block.elifs_);
    for (let i = 0; i < block.elifs_; i++) {
      let clause = 'elif ' + (Blockly.Python.valueToCode(block, 'ELIFTEST' + i,
          Blockly.Python.ORDER_NONE) || Blockly.Python.blank);
      clause += ':\n' +
        (Blockly.Python.statementToCode(block, 'ELIFBODY' + i) ||
        Blockly.Python.PASS);
      elifs[i] = clause;
    }
    // Orelse:
    let orelse = '';
    if (this.orelse_) {
      orelse = 'else:\n' +
        (Blockly.Python.statementToCode(block, 'ORELSEBODY') ||
        Blockly.Python.PASS);
    }
    return test + body + elifs.join('') + orelse;
  };

  Blockly.Python['break'] = function(_block) {
    return 'break\n';
  };

  Blockly.Python['continue'] = function(_block) {
    return 'continue\n';
  };

  Blockly.Python['assert'] = function(block) {
    const test = Blockly.Python
        .valueToCode(block, 'TEST', Blockly.Python.ORDER_ATOMIC) ||
      Blockly.Python.blank;
    return 'assert ' + test + '\n';
  };

  Blockly.Python['assert_full'] = function(block) {
    const test = Blockly.Python
        .valueToCode(block, 'TEST', Blockly.Python.ORDER_ATOMIC) ||
      Blockly.Python.blank;
    const msg = Blockly.Python
        .valueToCode(block, 'MSG', Blockly.Python.ORDER_ATOMIC) ||
      Blockly.Python.blank;
    return 'assert ' + test + ', '+ msg + '\n';
  };

  Blockly.Python['with_item'] = function(block) {
    const context = Blockly.Python.valueToCode(block, 'CONTEXT',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    return [context, Blockly.Python.ORDER_NONE];
  };

  Blockly.Python['with_item_as'] = function(block) {
    const context = Blockly.Python.valueToCode(block, 'CONTEXT',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    const as = Blockly.Python.valueToCode(block, 'AS',
        Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
    return [context + ' as ' + as, Blockly.Python.ORDER_NONE];
  };

  Blockly.Python['with'] = function(block) {
  // Contexts
    const items = new Array(block.itemCount_);
    for (let i = 0; i < block.itemCount_; i++) {
      items[i] = (Blockly.Python
          .valueToCode(block, 'ITEM' + i, Blockly.Python.ORDER_NONE) ||
            Blockly.Python.blank);
    }
    // Body
    const body = Blockly.Python
        .statementToCode(block, 'BODY') || Blockly.Python.PASS;
    return 'with ' + items.join(', ') + ':\n' + body;
  };

  Blockly.Python['try'] = function(block) {
  // Try:
    const body =
      Blockly.Python.statementToCode(block, 'BODY') || Blockly.Python.PASS;
    // Except clauses
    const handlers = new Array(block.handlersCount_);
    for (let i = 0; i < block.handlersCount_; i++) {
      const level = block.handlers_[i];
      let clause = 'except';
      if (level !== Blockly.TRY_SETTINGS.HANDLERS_CATCH_ALL) {
        clause += ' ' + Blockly.Python.valueToCode(block, 'TYPE' + i,
            Blockly.Python.ORDER_NONE) || Blockly.Python.blank;
        if (level === Blockly.TRY_SETTINGS.HANDLERS_COMPLETE) {
          clause += ' as ' +
        Blockly.Python.variableDB_.getName(block.getFieldValue('NAME' + i),
            Blockly.Variables.NAME_TYPE);
        }
      }
      clause += ':\n' +
        (Blockly.Python.statementToCode(block, 'HANDLER' + i) ||
        Blockly.Python.PASS);
      handlers[i] = clause;
    }
    // Orelse:
    let orelse = '';
    if (this.hasElse_) {
      orelse = 'else:\n' +
        (Blockly.Python.statementToCode(block, 'ORELSE') ||
        Blockly.Python.PASS);
    }
    // Finally:
    let finalbody = '';
    if (this.hasFinally_) {
      finalbody = 'finally:\n' +
        (Blockly.Python.statementToCode(block, 'FINALBODY') ||
        Blockly.Python.PASS);
    }
    return 'try:\n' + body + handlers.join('') + orelse + finalbody;
  };

  Blockly.Python['raise'] = function(block) {
    if (this.exc_) {
      const exc = Blockly.Python
          .valueToCode(block, 'EXC', Blockly.Python.ORDER_NONE) ||
        Blockly.Python.blank;
      if (this.cause_) {
        const cause = Blockly.Python
            .valueToCode(block, 'CAUSE', Blockly.Python.ORDER_NONE) ||
                Blockly.Python.blank;
        return 'raise ' + exc + ' from ' + cause + '\n';
      } else {
        return 'raise ' + exc + '\n';
      }
    } else {
      return 'raise'+'\n';
    }
  };
};
export default controlsGenerate;

