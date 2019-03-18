/**
 * 分享到微信朋友圈或朋友
 */
$(document).ready(function(){
	var userInfo = JSON.parse(window.localStorage.getItem("userInfo"));	
	var currurl = location.href.split('#')[0];
	var title = $("#course_name").val();
	var derc = $("#course_derc").val();
	var img = $("#banner_img").src;
	alert("userInfo="+userInfo+",currurl="+currurl+",title="+title+",derc="+derc+",img="+img);
	var shareData = {
   			title:title,
 	      	link: currurl,
 	      	desc: derc,
           	imgUrl: img,
           	success : function() {
           		$.ajax({
          			 type:'get',
          			 url:apiPath.userPath,
          			 dataType:'json',
          			 data:{
							"method":user.get('addShare'),
							"userId":userInfo.userId,
							"courseId":$("#courseId").val(),
							"shareWay":"news",
							"sharePlace":1
						},
          			 success:function(res){
          			 	console.log(res.code);
            			if (res.code == 0) {
            				console.log("分享成功");
						}
          			}
          		 });
           	},
			cancel : function() {

			}
   	   };
	//ajax注入权限验证  
	$.ajax({
		async: false,
		type:'get',
		url : apiPath.wxSharePath,
		dataType : 'json',
		data : {
			"method":wxShare.get('getSign'),
			'url' : currurl
		},
		success : function(res) {
			var appId = res.appId;
			var timestamp = res.timestamp;
			var nonceStr = res.nonceStr;
			var signature = res.signature;
			alert("appId="+appId+" timestamp="+timestamp+" nonceStr="+nonceStr+" signature="+signature);
			wx.config({
				debug : false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
				appId : appId, //必填，公众号的唯一标识  
				timestamp : timestamp, // 必填，生成签名的时间戳  
				nonceStr : nonceStr, //必填，生成签名的随机串  
				signature : signature, // 必填，签名，见附录1  
				jsApiList : [ 'onMenuShareAppMessage', 'onMenuShareTimeline' ] //必填，需要使用的JS接口列表，所有JS接口列表 见附录2  
			});
			
			wx.ready(function() {
				wx.onMenuShareAppMessage(shareData); 
 
				wx.onMenuShareTimeline(shareData); 
			}); 
 
			wx.error(function(res) {
				//alert('config错误'+res);
			});
		} 
	});
});