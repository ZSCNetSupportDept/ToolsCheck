//SolaToken相关类
window.SToken = {
	//可以设置的当check完成的回调函数
	//'checkCallback':function(data,param)
	//如果下面这个回调函数存在,验证失败的时候将会调用这个回调函数而不是跳转到result页面
	//'checkBadCallback':function()
	'opera' : 0,
	//初始化SolaToken类,并且验证SolaToken
	'init' : function(token,inputId){
		var queryURL = 'http://wts.sola.love/api/checksession?more=1&token='+token+'&';
		NMFunc.reqServer(queryURL, SToken.checkDone , 0, SToken.solaDisappear);
		////////////////////////////////////////////////////////////////////////////////////
		if(!token)
			return NMFunc.result('','');
		var v = NMFunc.e(inputId);
		v && (v.value = token);
	},
	//当SolaToken验证请求完成的时候的回调函数
	'checkDone':function(data,param){
		if(data && !data.errCode){
			console.log('SToken验证通过!(权限:' + data.authorized + ')');
			//加载延迟加载的脚本
			!window.NMloadLazyJs  || window.NMloadLazyJs();
			//执行回调函数
			!SToken.checkCallback || SToken.checkCallback(data,param);
		}else{
			SToken.checkBadCallback ? SToken.checkBadCallback : 
				NMFunc.result(SToken.opera,0,'页面已失效\n请关闭页面后重新发送指令');
		}
	},
	//Sola服务器通信不上的时候调用的函数
	'solaDisappear':function(){
		NMFunc.result(SToken.opera,0,'Sola端出问题了,无法回应你的查询请求');
	}
};
//网维在线页面函数集
window.NMFunc = {
	/**
	 * GetElementById
	 */
	e :function(vid){return document.getElementById(vid);},
	
	/**
	 * 跳转到Result页面
	 * @param {Number} op 操作
	 * @param {Number} type 类型
	 * @param {String} msg (可选)消息
	 * 
	 */
	result : function(op,type,msg){
		window.location.href = 'http://topaz.sinaapp.com/nm/v2/result.html?op='+op+'&type='+type+
			(msg?('&msg='+encodeURIComponent(msg)):'');
	},
	
	/**
	 * 携带Token跳转页面路由(管理页面)
	 */
	route : function(url){
		window.location.href 
			= (url.indexOf('?')>0?url:(url+'?'))+'&token='+NMFunc.e('token').value;
	},
	/**
	 * 关闭页面
	 */
	closePage : function(){
		window.WeixinJSBridge ? WeixinJSBridge.call('closeWindow') : window.close();
	},
	/**
	 * 获得URL中的参数
	 */
	getURLParam : function(name,def){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return decodeURIComponent(r[2]);return def;
	},
	/**
	 * 向服务器发送一个HTTP GET请求返回JSON
	 * XXX 原来的 jsonp2S 函数
	 */
	reqServer : function(url, callback, moreData, errCallback){
		var http = new XMLHttpRequest();
		http.open("get", url + '&t=' + new Date().getMilliseconds() , true);
		errCallback && (http.onerror = errCallback);
		http.onreadystatechange = function(){
			if(http.readyState != 4)
				return ;
			if(http.status == 200){
				var retDat = {};
				try{
					retDat = JSON.parse(http.responseText);
				}catch(e){
					console.warn('reqServer:服务器端传回的信息不能被转换成JSON对象', retDat);
				}
				callback && callback(retDat, moreData);
			}else{
				errCallback && errCallback();
			}
		};
		http.send();
	},
	/**
	 * 当微信浏览器加载完成
	 */
	onWechat : function(){
		WeixinJSBridge.invoke('hideOptionMenu',{},function(res){/*res.err_msg*/});
	}
};


/*
 * 微信安全要求
 */
//1.判断UA,如果允许电脑访问设置window.allowDesktop为一个对象
var ua = navigator.userAgent;
//ret表示是否允许电脑
!function(ret){
	//无法获得UA
	if(!ua)
		return ret || NMFunc.result('',88);
	ua = ua.toLocaleLowerCase();
	if(ua.indexOf('micromessenger')==-1 && ua.indexOf('windows phone')==-1)
		return ret || NMFunc.result('',88);
	SToken.isWechat = true;
}(window.allowDesktop);


//2.关闭微信的菜单
window.WeixinJSBridge ? NMFunc.onWechat() : document.addEventListener("WeixinJSBridgeReady", NMFunc.onWechat, false);