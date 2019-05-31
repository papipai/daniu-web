/**
 * 获取用户授权信息
 */

	
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
var Request = new Object();
	Request = GetRequest();
var code = Request['code'];
var source = Request['source'];
	
/**
 * point 防止多次请求后台
 */
var point = window.sessionStorage.getItem("point");
//var point = window.localStorage.getItem("point");
console.log("point="+point);
  if (point == null) {
	 	//sessionStorage.setItem("point","point");
 	window.sessionStorage.setItem("point","point");
 	if (code != null && code != "null") {
 			console.log("code="+code);
			sendCode();
	}
}
	
function sendCode(){
	console.log("进入sendCode");
	 $.ajax({
	 	async:false,
		type:"post",
		url:apiPath.userPath,
		xhrFields:{withCredentials:true},
		data:{
			"method":user.get("adduser"),
			"code":code,
			"source":source
		},
		success:function(data){//用户登录成功后吧用户信息保存到localstorage中
			if(data.code == 0){
				console.log("授权获取到用户信息="+JSON.stringify(data.object));
				window.localStorage.setItem("userInfo",JSON.stringify(data.object));
				window.localStorage.setItem("userId",data.object.userId);
			}else{
				alert("登录失败");
			}
		}
	});
}