//设置弹窗
document.querySelector('#setting-button').onclick = eventSettingClick;
const backGround = document.getElementById("back-ground");
function eventSettingClick(){
    backGround.style.display = "block";
}
//设置弹窗关闭按钮
document.querySelector('#close-button').onclick = eventCloseSetting;
const CloseButton = document.getElementById("close-button");
function eventCloseSetting(){
    backGround.style.display = "none";
}
//重置按钮实现
const resetButton = document.getElementById("reset-button");
document.querySelector('.reset-button').onclick = eventRestButton;
function eventRestButton() {
    alert('重置成功');
}
//运行按钮实现
const runButton = document.getElementById("run-button");
document.querySelector('.run-button').onclick = eventRunButton;
function eventRunButton() {
    alert('运行成功');
}