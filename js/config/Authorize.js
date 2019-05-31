	/**
	 * 判断用户是否已经授权
	 * url:需要授权的页面
	 * oauth2Url：微信授权接口
	 * 一定要对url进行encodeURIComponent()
	 */
	
	var appid = "wx7cee254e432f44ee";//增长帮
	var redirect_uri = window.location.href;//获取当前页面的url
	var oauth2Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+encodeURIComponent(redirect_uri)+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
	var userInfo = window.localStorage.getItem("userInfo");
	
	console.log("redirect_uri="+redirect_uri);
	console.log("encodeURIComponent(redirect_uri)="+encodeURIComponent(redirect_uri));
	console.log("oauth2Url="+oauth2Url);
	console.log("userInfo="+userInfo);
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
	if(code == null){
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
	}
	
	
	
	

