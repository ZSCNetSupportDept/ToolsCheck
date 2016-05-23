/**
 * 签到页面逻辑
 * Created by Lunzi on 5/22/2016.
 */
function ToolCheck() {
    //DOM
    var address = document.querySelector("#select");    //值班片区
    var finishBtn = document.querySelector("#finish");  //完成按钮
    var toolList;                                       //工具列表（nodeList）

    var confirmMenu = document.querySelector(".weui_dialog_confirm");   //确认窗口
    var cancleBtn = document.querySelector("#cancle");                  //取消按钮
    var confirmBtn = document.querySelector("#confirm");                //确认按钮

    //value
    var area;           //片区编号{AB,CD,凤翔，北门，东门，歧头}（1~6）
    var toolStatus;     //工具情况，从右到左位串，正常 0 ，异常 1
    var areaNameList = address.querySelectorAll("option");                  //片区名字列表
    var toolNameList = document.querySelectorAll(".weui_cell_primary p");   //工具名字列表

    SToken.checkCallback = function (data, param) {
        console.log(data);

    };
    SToken.init(NMFunc.getURLParam('token'));

    //改变片区事件
    address.addEventListener("change", function () {
        changeList();
    });

    //完成签到按钮点击
    finishBtn.addEventListener("click", function () {
        getToolStatus();
        showConfirmMenu();
    }, false);

    //确认窗口取消按钮点击
    var onCanaleClick = function () {
        confirmMenu.classList.add("hide");
    };
    cancleBtn.addEventListener("click", onCanaleClick, false);

    //确认窗口确定按钮点击
    var onConfirmClick = function () {
        document.querySelector(".weui_dialog_title").innerHTML = "稍等QwQ,正在提交...";
        confirmBtn.style.color = "lightgrey";
        //TODO:AJAX HERE
        confirmBtn.removeEventListener("click", onConfirmClick, false);
        cancleBtn.removeEventListener("click", onCanaleClick, false);
    };
    confirmBtn.addEventListener("click", onConfirmClick, false);

    var showConfirmMenu = function () {
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

    //不同片区改变条目显示
    var changeList = function (areaNumber) {
        area = areaNumber || address.value;             //当前片区地址
        var t9 = document.querySelector("[for=t9]");    //端口模块选项DOM
        if (area == 4 | area == 5 || area == 6) {
            t9.style.display = "none";
            toolNameList[8].checked = true;                 //标记为已勾选
        } else {
            t9.style.display = "flex";
            toolNameList[8].checked = false;                //标记初始化未勾选
        }
    };
}