# ToolsCheck
> 工具包检查项目相关文件

## 文件相关说明

- `lib/common.css`
	全局样式CSS文件
- `lib/functions.js`
	全局基本功能Js文件

## 关于SolaToken验证使用说明:

0. 样例:从URL中的获得SToken参数:`token` 并验证其有效性
```
	SToken.init(NMFunc.getURLParam('token'));
```
1. 样例: 需要监听验证SToken验证完成后的事件
```
	SToken.checkCallback = function(data, param) {
		//SToken验证完成后的事件
	};
	SToken.init(NMFunc.getURLParam('token'));
```