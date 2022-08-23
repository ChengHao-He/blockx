const {resolve} = require('path'); // Node.js内置模块
module.exports = {
  entry: './src/blockx.js', // 配置入口文件
  output: {
    path: resolve(__dirname, './dist'), // 输出路径，__dirname：当前文件所在路径
    filename: 'blockx.js', // 输出文件
  },
};


