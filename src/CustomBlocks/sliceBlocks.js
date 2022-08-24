/**
 * 创建slice块
 * @date 2022-08-23
 * @param {any} Blockly
 */
function sliceBlocks(Blockly) {
  Blockly.Blocks.text_getSubstring.init = function() {
    this.WHERE_OPTIONS_1 = [
      [Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_START, 'FROM_START'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_END, 'FROM_END'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_START_FIRST, 'FIRST'],
    ];
    this.WHERE_OPTIONS_2 = [
      [Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_START, 'FROM_START'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_END, 'FROM_END'],
      [Blockly.Msg.TEXT_GET_SUBSTRING_END_LAST, 'LAST'],
    ];
    this.setHelpUrl(Blockly.Msg.TEXT_GET_SUBSTRING_HELPURL);
    this.setStyle('text_blocks');
    this.appendValueInput('STRING')
        .setCheck('String')
        .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT);
    this.appendDummyInput('AT1');

    this.appendValueInput('STEP')
        .setCheck('Number')
        .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_STEP);
    this.appendDummyInput('AT2');
    if (Blockly.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.appendDummyInput('TAIL')
          .appendField(Blockly.Msg.TEXT_GET_SUBSTRING_TAIL);
    }
    this.setInputsInline(false);
    this.setOutput(true, 'String');
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP);
  };

  Blockly.Blocks.lists_getSublist.init = function() {
    this.WHERE_OPTIONS_1 = [
      [Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START, 'FROM_START'],
      [Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END, 'FROM_END'],
      [Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST, 'FIRST'],
    ];
    this.WHERE_OPTIONS_2 = [
      [Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START, 'FROM_START'],
      [Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END, 'FROM_END'],
      [Blockly.Msg.LISTS_GET_SUBLIST_END_LAST, 'LAST'],
    ];
    this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
    this.setStyle('list_blocks');
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField(Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST);
    this.appendDummyInput('AT1');
    this.appendValueInput('STEP')
        .setCheck('Number')
        .appendField(Blockly.Msg.LISTS_GET_SUBLIST_STEP);
    this.appendDummyInput('AT2');
    if (Blockly.Msg.LISTS_GET_SUBLIST_TAIL) {
      this.appendDummyInput('TAIL')
          .appendField(Blockly.Msg.LISTS_GET_SUBLIST_TAIL);
    }
    this.setInputsInline(false);
    this.setOutput(true, 'Array');
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg.LISTS_GET_SUBLIST_TOOLTIP);
  };

  Blockly.Blocks.tuples_getSubtuple = {
  /**
   * @this {Blockly.Block}
   */
    init() {
      this.WHERE_OPTIONS_1 = [
        [Blockly.Msg.TUPLES_GET_SUBTUPLE_START_FROM_START, 'FROM_START'],
        [Blockly.Msg.TUPLES_GET_SUBTUPLE_START_FROM_END, 'FROM_END'],
        [Blockly.Msg.TUPLES_GET_SUBTUPLE_START_FIRST, 'FIRST'],
      ];
      this.WHERE_OPTIONS_2 = [
        [Blockly.Msg.TUPLES_GET_SUBTUPLE_END_FROM_START, 'FROM_START'],
        [Blockly.Msg.TUPLES_GET_SUBTUPLE_END_FROM_END, 'FROM_END'],
        [Blockly.Msg.TUPLES_GET_SUBTUPLE_END_LAST, 'LAST'],
      ];
      this.setColour('#5758BB');
      this.appendValueInput('TUPLE')
          .setCheck('Tuple')
          .appendField(Blockly.Msg.TUPLES_GET_SUBTUPLE_INPUT_IN_TUPLE);
      this.appendDummyInput('AT1');
      this.appendValueInput('STEP')
          .setCheck('Number')
          .appendField(Blockly.Msg.TUPLES_GET_SUBTUPLE_STEP);
      this.appendDummyInput('AT2');
      if (Blockly.Msg.TUPLES_GET_SUBTUPLE_TAIL) {
        this.appendDummyInput('TAIL')
            .appendField(Blockly.Msg.TUPLES_GET_SUBTUPLE_TAIL);
      }
      this.setInputsInline(false);
      this.setOutput(true, 'Tuple');
      this.updateAt_(1, true);
      this.updateAt_(2, true);
    },
    /**
   * Create XML to represent whether there are 'AT' inputs.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
    mutationToDom() {
      const container = Blockly.utils.xml.createElement('mutation');
      const hasAt1 = this.getInput('AT1').type === Blockly.INPUT_VALUE;
      container.setAttribute('at1', hasAt1);
      const hasAt2 = this.getInput('AT2').type === Blockly.INPUT_VALUE;
      container.setAttribute('at2', hasAt2);
      return container;
    },
    /**
   * Parse XML to restore the 'AT' inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
    domToMutation(xmlElement) {
      const isAt1 = (xmlElement.getAttribute('at1') === 'true');
      const isAt2 = (xmlElement.getAttribute('at2') === 'true');
      this.updateAt_(1, isAt1);
      this.updateAt_(2, isAt2);
    },
    /**
   * Create or delete an input for a numeric index.
   * This block has two such inputs, independent of each other.
   * @param {number} n Specify first or second input (1 or 2).
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this {Blockly.Block}
   */
    updateAt_(n, isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
      this.removeInput(`AT${n}`);
      this.removeInput(`ORDINAL${n}`, true);
      // Create either a value 'AT' input or a dummy input.
      if (isAt) {
        this.appendValueInput(`AT${n}`).setCheck('Number');
        if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
          this.appendDummyInput(`ORDINAL${n}`)
              .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
        }
      } else {
        this.appendDummyInput(`AT${n}`);
      }
      const that = this;
      const menu = new Blockly.FieldDropdown(this[`WHERE_OPTIONS_${n}`],
          function(value) {
            const newAt = (value === 'FROM_START') || (value === 'FROM_END');
            // The 'isAt' variable is available due to this function being a
            // closure.
            if (newAt !== isAt) {
              const block = that.getSourceBlock();
              block.updateAt_(n, newAt);
              // This menu has been destroyed and replaced.
              // Update the replacement.
              block.setFieldValue(value, `WHERE${n}`);
              return null;
            }
          });
      this.getInput(`AT${n}`)
          .appendField(menu, `WHERE${n}`);
      if (n === 1) {
        this.moveInputBefore('AT1', 'AT2');
        if (this.getInput('ORDINAL1')) {
          this.moveInputBefore('ORDINAL1', 'AT2');
        }
      }
      if (Blockly.Msg.TUPLES_GET_SUBTUPLE_TAIL) {
        this.moveInputBefore('TAIL', null);
      }
    },
  };
}
export default sliceBlocks;

