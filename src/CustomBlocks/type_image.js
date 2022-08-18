Blockly.Blocks['image'] = {
  init: function init() {
    this.setColour(180);
    this.src_ = 'loading.png';
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
