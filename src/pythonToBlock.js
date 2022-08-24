import {getBlockly, getSkulpt} from './dependence';
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
  getBlockly().defineBlocksWithJsonArray(pythonToBlock.BLOCKS);
  getSkulpt().configure({
    __future__: getSkulpt().python3,
    read: function read(filename) {
      if (getSkulpt().builtinFiles === undefined ||
        getSkulpt().builtinFiles['files'][filename] === undefined) {
        throw new Error('File not found: \'' + filename + '\'');
      }
      return getSkulpt().builtinFiles['files'][filename];
    },
  });
}
export default pythonToBlock;
