/**
 * 分享到微信朋友圈或朋友
 */
//$(document).ready(function(){
//	var userInfo = JSON.parse(window.localStorage.getItem("userInfo"));	
//	var currurl = location.href.split('#')[0];
//	var title = $("#course_name").val();
//	var derc = $("#course_derc").val();
//	var img = window.localStorage.getItem("courseThumbImg");
//	console.log("userInfo="+userInfo+",currurl="+currurl+",title="+title+",derc="+derc+",courseThumbImg="+img);
//	var shareData = {
// 			title:title,
// 	      	link: currurl,
// 	      	desc: derc,
//         	imgUrl: img,
//         	success : function() {
//         		$.ajax({
//        			 type:'get',
//        			 url:apiPath.userPath,
//        			 dataType:'json',
//        			 data:{
//							"method":user.get('addShare'),
//							"userId":userInfo.userId,
//							"courseId":$("#courseId").val(),
//							"shareWay":"news",
//							"sharePlace":1
//						},
//        			 success:function(res){
//        			 	console.log(res.code);
//          			if (res.code == 0) {
//          				$(".distri_mark").css("display","none");
//          				console.log("分享成功");
//						}
//        			}
//        		 });
//         	},
//			cancel : function() {
//
//			}
// 	   };
//	//ajax注入权限验证  
//	$.ajax({
//		async: false,
//		type:'get',
//		url : apiPath.wxSharePath,
//		dataType : 'json',
//		data : {
//			"method":wxShare.get('getSign'),
//			'url' : currurl
//		},
//		success : function(res) {
//			var appId = res.appId;
//			var timestamp = res.timestamp;
//			var nonceStr = res.nonceStr;
//			var signature = res.signature;
//			console.log("---------------------")
//	console.log("---------------------")
//	console.log("---------------------")
//	console.log("---------------------")
//	console.log("---------------------")
//	console.log("---------------------")
//	console.log("---------------------")
//	
//			console.log("appId="+appId+" timestamp="+timestamp+" nonceStr="+nonceStr+" signature="+signature);
//			wx.config({
//				debug : true, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
//				appId : appId, //必填，公众号的唯一标识  
//				timestamp : timestamp, // 必填，生成签名的时间戳  
//				nonceStr : nonceStr, //必填，生成签名的随机串  
//				signature : signature, // 必填，签名，见附录1  
//				jsApiList : [ 'onMenuShareAppMessage', 'onMenuShareTimeline' ] //必填，需要使用的JS接口列表，所有JS接口列表 见附录2  
//			});
//			
//			wx.ready(function() {
//				wx.onMenuShareAppMessage(shareData); 
// 
//				wx.onMenuShareTimeline(shareData); 
//			}); 
// 
//			wx.error(function(res) {
//				//alert('config错误'+res);
//			});
//		} 
//	});
//});

function getShareSign(){
	
	var title = window.localStorage.getItem("title");
	var derc = window.localStorage.getItem("derc");
	var img = window.localStorage.getItem("img");
	console.log("title:"+title);
	console.log("derc:"+derc);
	console.log("img:"+img);
	if (title == null) {
		title = "增长帮";
	}
	if (derc == null) {
		derc = "新兴职业教育平台，互联网和互联网+从业人员的黄埔军校。产品，运营，推广，研发，变现，融资，面面俱到，步步深挖，让你站在巨人的肩膀上成长！";
	}
	if (img == null) {
		img = "http://p8v8q53wo.bkt.clouddn.com/zzb/growth_logo.png";
	}
	
	var userInfo = JSON.parse(window.localStorage.getItem("userInfo"));	
	var userId = userInfo.userId;
	var currurl = location.href.split('#')[0];
	console.log("currurl="+currurl);
	console.log("userInfo="+userInfo+",currurl="+currurl+",title="+title+",derc="+derc+",img="+img);
	//		var shareData = {
	//	   			
	//	   	   };
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
			console.log(res);
			var appId = res.object.appId;
			var timestamp = res.object.timestamp;
			var nonceStr = res.object.nonceStr;
			var signature = res.object.signature;
			console.log("appId="+appId+" timestamp="+timestamp+" nonceStr="+nonceStr+" signature="+signature);
			wx.config({
				debug : false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
				appId : appId, //必填，公众号的唯一标识  
				timestamp : timestamp, // 必填，生成签名的时间戳  
				nonceStr : nonceStr, //必填，生成签名的随机串  
				signature : signature, // 必填，签名，见附录1  
				jsApiList : [ 'onMenuShareAppMessage', 'onMenuShareTimeline' ] //必填，需要使用的JS接口列表，所有JS接口列表 见附录2  
			});
			
			wx.ready(function() {
				wx.onMenuShareAppMessage({
					title:title,
				  	link: currurl+"&disUserId="+userId,
				  	desc: derc,
				   	imgUrl: img,
				   	success : function() {
				   		$.ajax({
				  			 type:'post',
				  			 url:apiPath.userPath,
				  			 dataType:'json',
				  			 data:{
									"method":user.get('addShare'),
									"userId":userId,
									"courseId":$("#courseId").val(),
									"shareWay":"news",
									"sharePlace":2
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
						console.log("取消分享");
						}
					});
	 
					wx.onMenuShareTimeline({
						title:title,
					  	link: currurl+"&disUserId="+userId,
				  	desc: derc,
				   	imgUrl: img,
				   	success : function() {
				   		$.ajax({
				  			 type:'post',
				  			 url:apiPath.userPath,
				  			 dataType:'json',
				  			 data:{
									"method":user.get('addShare'),
									"userId":userId,
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
						console.log("取消分享");
						}
					});
				}); 
	 
				wx.error(function(res) {
					//alert('config错误'+res);
				});
			} 
		});
}