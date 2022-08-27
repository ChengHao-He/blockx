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

  2. 为了安装BlockX客户端，你可以按照下面的进行(如果没有yarn，需要先在本地安装yarn)：

     ```shell
     $> cd blockx-edu
     $> git clone https://se.jisuanke.com/project1/dawnWarrior/blockx-demo.git
     $> git clone https://se.jisuanke.com/project1/dawnWarrior/blockx.git
     $> cd blockx-demo
     $> yarn install
     $> yarn serve
     ```
  
    
  
  3. 之后你可根据提示进入相应网址进行探索使用。
  
  

## 提供的接口

如果你想自己配置使用Blockx。可按照以下提示进行：

```javascript
// 使用Blockx所需要的依赖
import Blockly from 'blockly'
import 'blockly/blocks'
import 'blockly/javascript'
import 'blockly/python'
import * as en from 'blockly/msg/en'
import Sk from 'skulpt'
// 引入Blockx
import Blockx from 'blockx'
// Blockx提供的接口
// initBlockly（）：初始化Blockly
// initSk（）：初始化Skulpt
// initPythonToBlock（）：如果想使用代码转模块功能，需要在初始化Blockly、Skulpt后，
// 运行该函数以用来初始化代码转模块的相关函数
Blockx.initBlockly(Blockly)
Blockx.initSk(Sk)
Blockx.initPythonToBlock()
// 创建 textToBlock 来接收PythonToBlock类
const textToBlock = Blockx.getPythonToBlock()
const textToBlocks = new textToBlock()


// 代码转模块相关实现：
const that = this
// id为python-code的文本域
this.TxtArea = document.getElementById('python-code')
this.TxtArea.onblur = function () {
  that.TxtArea.removeEventListener('input', that.textChangeListener)
  that.workSpace.addChangeListener(that.updateFunction)
}
this.TxtArea.onfocus = function () {
  that.workSpace.removeChangeListener(that.updateFunction)
  that.TxtArea.addEventListener('input', that.textChangeListener)
}

updateFunction: function () {
  this.code = Blockly.Python.workspaceToCode(this.workSpace)
  document.getElementById('python-code').value = this.code
},
textChangeListener: function () {
  // 使用PythonToBlock类提供的接口convertSource（）进行代码转换的xml获取
  const blockXml = textToBlocks.convertSource(this.TxtArea.value)
  this.workSpace.clear()
  // 使用Blockly类提供的接口Xml.domToWorkspace（）进行代码转换
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(blockXml.xml), this.workSpace)
}

```

