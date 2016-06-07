/**
 * 签到页面逻辑
 * Created by Lunzi on 5/22/2016.
 */
"use strict";
//DOM
var finishBtn = document.querySelector("#finish");  //完成按钮
var address = document.querySelector("#select");    //值班片区
var confirmMenu = document.querySelector(".weui_dialog_confirm");   //确认窗口
var confirmTitle = document.querySelector(".weui_dialog_title");    //确认窗口标题
var remarkInput = document.querySelector("#input");                 //备注输入框
var confirmBtn = document.querySelector("#confirm");                //确认按钮
var cancleBtn = document.querySelector("#cancle");                  //取消按钮

//value
var area;           //片区编号{AB,CD,凤翔，北门，东门，歧头}（1~6）
var toolStatus;     //工具情况，从右到左位串，正常 0 ，异常 1
var remark;         //若工具异常的备注
var toolList;       //工具列表（nodeList）
var areaNameList = address.querySelectorAll("option");                  //片区名字列表
var toolNameList = document.querySelectorAll(".weui_cell_primary p");   //工具名字列表

//验证Token，设置回调函数
SToken.checkCallback = function (data) {
    // console.log(data);
    var userBlock = {"1":6,"2":4,"3":5,"4":1,"5":3};      //读取到的片区
    changeList(userBlock[data.operator.block]);
};
SToken.init(NMFunc.getURLParam('token'), 'token');

//改变片区事件
address.addEventListener("change", function () {
    changeList();
},false);

//完成签到按钮点击
finishBtn.addEventListener("click", function () {
    getToolStatus();
    if (toolStatus == 0) document.querySelector(".weui_cells_form").style.display = 'none';
    else document.querySelector(".weui_cells_form").style.display = 'block';
    showConfirmMenu();
}, false);

//确认窗口取消按钮点击
var onCanaleClick = function () {
    confirmMenu.classList.add("hide");
};
cancleBtn.addEventListener("click", onCanaleClick, false);

//确认窗口确定按钮点击
var onConfirmClick = function () {
    getRemark();
    if(remark || toolStatus == 0) {
        confirmTitle.innerHTML = "稍等QwQ,正在提交...";
        confirmBtn.style.color = "lightgrey";
        submitStatus();
        confirmBtn.removeEventListener("click", onConfirmClick, false);
        cancleBtn.removeEventListener("click", onCanaleClick, false);
    }else confirmTitle.innerHTML = "请输入说明!";
};
confirmBtn.addEventListener("click", onConfirmClick, false);

//提交AJAX
var submitStatus = function () {
    var token = document.querySelector("#token").value;
    // var data = 'status=' + toolStatus + '&token=' + token;
    // data =(remark) ? data + '&remark=' + remark: data;
    var formData = new FormData();
    formData.append("token",token);
    formData.append("status", toolStatus);
    if(remark)
    formData.append("remark", remark);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://wts.sola.love/api/admin/toolscheck", true);
    xhr.send(formData);
    xhr.onreadystatechange = function () {      //提交状态判断
        if (xhr.readyState == 4) {
            if (xhr.status == 200)
                // location.href = "sign_success.html";
            console.log("success");
            else
                // location.href = "sign_error.html";
                console.log("fail");

        }
    };
};

//显示确认窗口
var showConfirmMenu = function () {
    confirmTitle.innerHTML = "信息确认";
    var tool_no = "";
    for (var i = 0; i < toolNameList.length; i++) {
        var item = toolNameList[i];
        if (!item.checked) {
            tool_no += item.firstChild.nodeValue + " ";
        }
    }
    document.querySelector("#where").innerHTML = areaNameList[area - 1].text;
    document.querySelector("#tool_no").innerHTML = (tool_no.length == 0) ? "所有工具状态正常╰(￣▽￣)╯" : tool_no;
    confirmMenu.classList.remove("hide");
};

//获取当前选择工具并生成位串
var getToolStatus = function () {
    toolList = document.querySelectorAll(".weui_check");
    var temp = "";      //位串字符串
    for (var i = 0; i < toolList.length; i++) {
        var item = toolList[i];
        if (item.checked) {
            temp = "0" + temp;
            toolNameList[i].checked = true;     //为以勾选的条目在工具列表中标记checked属性，为确认窗口提供条目筛选
        } else {
            temp = "1" + temp;
            toolNameList[i].checked = false;    //取消勾选初始化状态
        }
    }
    toolStatus = parseInt(temp, 2);
};

//获取工具异常备注
var getRemark = function () {
    var temp = remarkInput.value;
    if (temp.length != 0) {
        remark = temp;
    }
};

//不同片区改变条目显示
var changeList = function (areaNumber) {
    area = areaNumber || address.value;             //当前片区地址
    address.value = areaNumber || address.value;
    var t9 = document.querySelector("[for=t9]");    //端口模块选项DOM
    var t10 = document.querySelector("[for=t10]");    //端口模块选项DOM
    var t11 = document.querySelector("[for=t11]");
    if (area == 4 || area == 5 || area == 6) {
        t9.style.display = "none";
        toolList[8].checked = true;                 //标记为已勾选
    } else {
        t9.style.display = "flex";
        toolList[8].checked = false;                //标记初始化未勾选
    }
    if (area == 3 || area == 4 || area == 5 || area == 6) {
        t10.style.display = "none";
        toolList[9].checked = true;
    }else {
        t10.style.display = "flex";
        toolList[9].checked = false;
    }
    if (area == 3){
        t11.style.display = "flex";
        toolList[10].checked = false;

    }else{
        t11.style.display = "none";
        toolList[10].checked = true;
    }
};
getToolStatus();