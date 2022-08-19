# A demo with BlockX.
这是我们为`blockx`设计的一个demo...

## 安装

### codemirror
    想要成功运行 demo，需先配置`codemirror5`。首先运行以下命令创建文件夹：
```shell
    cd src/demo
    mkdir codemirror
    cd codemirror
```
安装时，可以通过以下两种方式完成安装：
1. 获取最新版本的 [zip file](https://codemirror.net/5/codemirror.zip)，
然后把压缩包解压到codemirror文件夹中，再将解压后的文件重命名为codemirror5.

2. 确保您安装了[Node](https://nodejs.org/)，然后进入codemirror文件夹，命令行输入：
```shell
    git clone https://github.com/codemirror/codemirror5.git
    npm install codemirror
    npm install
```
运行`npm install`是因为这是库的源存储库，而不是分发渠道。
克隆不是安装库的推荐方法，除非同时运行该构建步骤，否则克隆将不起作用。

## 快速启动
请确保您有Node.js，然后只需在浏览器中打开`demo.html`
