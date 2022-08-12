To run the `index.html`, you should import some dependencies from their website first,
the file structure looks like this:
```
src 
 |-blockx
 |-lib
 |  |-blockly
 |  |-codemirror5
 |  |-skulpt
 |-Test
 |-index.html
 |-style.css
 |-README.md
```
You can
- download blockly from [blockly](https://github.com/google/blockly)
- codemirror5 from [CodeMirror](https://github.com/codemirror/codemirror5)
- skulpt from [skulpt](https://github.com/skulpt/skulpt)

## step:
```
cd lib
npm install blockly
git clone git@github.com:codemirror/codemirror5.git

git clone git@github.com:skulpt/skulpt.git
cd skulpt
npm install
npm run dist
```
