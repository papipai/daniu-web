	/**
	 * 判断用户是否已经授权
	 * url:需要授权的页面
	 * oauth2Url：微信授权接口
	 */
	
	var appid = "wxe222cbca54bed80c";//大牛财商
	//var appid = "wx0fc83cabd74c9566";//大牛学堂
	var redirect_uri = window.location.href;//获取当前页面的url
	var oauth2Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
	var userInfo = window.localStorage.getItem("userInfo");
	
	console.log("redirect_uri="+redirect_uri);
	console.log("oauth2Url="+oauth2Url);
	console.log("userInfo="+userInfo);
	
	/**
	 * oauth 防止多次授权
	 */
	var oauth = window.sessionStorage.getItem("oauth");
	console.log("oauth="+oauth);
  	if (oauth == null) {
		//sessionStorage.setItem("point","point");
		window.sessionStorage.setItem("oauth","oauth");
		 	
		if (userInfo == null) {
			window.location.href = oauth2Url;
		}else{
			window.location.href = redirect_uri;
		}
	}
	
	

