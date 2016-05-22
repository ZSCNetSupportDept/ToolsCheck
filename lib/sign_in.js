/**
 * 签到页面逻辑
 * Created by Lunzi on 5/22/2016.
 */

//value
var area;           //片区编号{AB,CD,凤翔，北门，东门，歧头}（1~6）
var toolStatus;     //工具情况，从右到左位串，正常 0 ，异常 1

//DOM
var address = document.querySelector("#select");    //值班片区
var finishBtn = document.querySelector("#finish");  //完成按钮
var toolList;                                       //工具列表（nodeList）

SToken.checkCallback = function (data, param) {
    console.log(data);
};
SToken.init(NMFunc.getURLParam('token'));

//改变片区事件
address.addEventListener("change",function () {
    changeList();
});

//完成签到事件
finishBtn.addEventListener("click", function () {
    //获取当前选择工具并生成位串
    toolList = document.querySelectorAll(".weui_check");
    var temp = "";      //位串字符串
    for(var i = 0; i < toolList.length; i++) {
        var item = toolList[i];
        if (item.checked){
            temp = "0" + temp;
        } else {
            temp = "1" + temp;
        }
    }
    toolStatus = parseInt(temp, 2);
});

//不同片区改变条目显示
var changeList = function (areaNumber) {
    area = areaNumber || address.value;             //当前片区地址
    var t9 = document.querySelector("[for=t9]");    //端口模块选项DOM
    if (area == 4| area == 5|| area == 6) {
        t9.style.display = "none";
    }else {
        t9.style.display = "flex";
    }
};

