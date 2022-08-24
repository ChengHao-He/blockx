# BlockX

## 简介
BlockX被设计成可以轻松安装到您的 Web 应用程序中，用户拖动块，BlockX 生成Python代码，用户编写代码，随即生成对应的块。一切内容进行MIT协议开源。我们的主要用户为在开源平台寻找青少年编程学习平台的开发者。

## 功能
- 可以使⽤ Blockly构建模块
- ⽀持 Python 3.7到3.10 的完整语法，需要完备性，无需⽀持 Python 2
- ⽀持将 Python 代码解释为 Blockly 的块，也⽀持 Blockly 的块解释⽣成Python
- ⽀持能对照编辑，⽂本编辑部分需要能⽀持CodeMirror 6 的编辑器
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