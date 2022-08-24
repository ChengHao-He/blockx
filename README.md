# BlockX

## 简介
BlockX被设计成可以轻松安装到您的 Web 应用程序中，用户拖动块，BlockX 生成Python代码，用户编写代码，随即生成对应的块。一切内容进行MIT协议开源。我们的主要用户为在开源平台寻找青少年编程学习平台的开发者。

## 功能
- 可以使⽤ Blockly创建积木块
- ⽀持将 Python 代码解释为积木块，也⽀持积木块解释⽣成Python代码
- ⽂本编辑部分⽀持引入CodeMirror6的编辑器及支持对照编辑
- 可以测试各功能是否正常

## 安装

- 第一步，你需要注意我们项目的文件结构，就像这样：

  ```
  blockx-edu/
  	blockx/
  	bkockx-demo/
  ```

  1. 所以你可以通过接下来的一条指令创建项目：

     ```shell
     $> mkdir blockx-edu
     ```

  2. 为了安装BlockX客户端，你可以按照下面的进行：

     ```shell
     $> cd blockx-edu
     $> git clone https://se.jisuanke.com/project1/dawnWarrior/blockx-demo.git
     $> git clone https://se.jisuanke.com/project1/dawnWarrior/blockx.git
     $> cd blockx-demo
     $> yarn install
     $> yarn serve
     ```
    之后你可根据提示进入相应网址进行探索使用。
