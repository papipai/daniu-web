/**
 * 调起微信支付
 * courseId 课程id
 * userId 用户id
 * pay_platform 购买渠道（1.公众号，2.小程序）
 */
//初始化下单信息
var pay_platform = 1;//公众号为1
var pay_way = 1;//1-微信支付，2-支付宝支付，3-华为支付
function toPayInit(userId,courseTypeId,order_type,disUserId,username,wechatno,phone,userdemand,yearsId){
	var that = this;
	$.ajax({
		async: false,
		type:"post",
		url:apiPath.wechatPath,
		xhrFields:{withCredentials:true},
		data:{
			"method":wechat.get('communityPay'),
			"userId":userId,
			"courseTypeId":courseTypeId,
			"yearsId":yearsId,
			"pay_platform":pay_platform,
			"pay_way":pay_way,
			"order_type":order_type,
			"disUserId":disUserId
		},
		success : function(data) {// 服务器响应成功时的处理函数
			console.log("33333")
			console.log(data)
			//alert("result="+data.object.result+" prepay_id="+data.object.prepay_id);
			console.log("初始化下单信息是否成功="+data.object.result+" courseTypeId="+courseTypeId+" userId="+userId+" order_type="+order_type);
			if(data.object.result==1){//插入支付记录
				var appid = data.object.appid;
				var timestamp = data.object.timestamp;
				var nonceStr = data.object.noncestr;
				var prepay_id = data.object.prepay_id;
				var paySign = data.object.paySign;
				var out_trade_no = data.object.out_trade_no;
				//alert("money="+money)
				that.onBridgeReady(appid,timestamp,nonceStr,prepay_id,paySign,courseTypeId,userId,username,wechatno,phone,userdemand,yearsId,out_trade_no);
			}else{
				layer.msg('初始化支付接口失败，请联系系统运营商');
			}
		},
		error : function(data, status, e) { // 服务器响应失败时的处理函数
			layer.msg('初始化支付接口失败，请联系系统运营商');
		}
	});
}

//开始支付
function onBridgeReady(appid,timestamp,nonceStr,prepay_id,paySign,courseTypeId,userId,username,wechatno,phone,userdemand,yearsId,out_trade_no){
	WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
           "appId":appid,     //公众号名称，由商户传入     
           "timeStamp":timestamp,         //时间戳，自1970年以来的秒数     
           "nonceStr":nonceStr, //随机串     
           "package":"prepay_id="+prepay_id,     
           "signType":"MD5",         //微信签名方式：     
           "paySign":paySign //微信签名 （这个签名获取看后台）
       },
       function(res){
       		//alert("购买回调="+res.err_msg)
    		// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {//添加社群报名信息
           	//console.log("购买回调="+res.err_msg);
        	    $.ajax({
        	    	async: false,
					type:"post",
					url:apiPath.userPath,
					xhrFields:{withCredentials:true},
					data:{
						"method":wechat.get('addCommunityMsg'),
						"courseTypeId":courseTypeId,
						"userId":userId,
						"username":username,
						"wechatno":wechatno,
						"phone":phone,
						"userdemand":userdemand,
						"yearsId":yearsId,
						"out_trade_no":out_trade_no
					},
					success : function(data) { // 服务器响应成功时的处理函数
						if(data.code == 0){//报名且支付成功
							$(".group_tip").css("display","flex");
						}
					}
				}); 
           }else if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
        	   alert('付款失败，请重新购买');
           }    
       }
   );
}
/**
 * 从url中获取courseId
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
var disUserId = Request['disUserId'];
var order_type = 4;//订单类型（1-课程订单，2-课程分销订单，3-大咖社群订单，4-大咖社群分销订单）
console.log("disUserId="+disUserId);
if (disUserId == null) {
	disUserId = -1;
	order_type = 3;
}

/**
 * 大咖社群购买
 */
$("#submit").click(function(){
	var userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
	console.log("在线模式直接购买");
	var username = $("#username").val();
	var wechatno = $("#wechatno").val();
	var phone = $("#phone").val();
	var yearsId = $("#years").val();
	var userdemandList = $(".demand_selected");
	var userdemand = "";
	var courseTypeId = localStorage.getItem("courseTypeId");
	if(courseTypeId == null){
		courseTypeId = 1;
	}
	$(".demand_selected").each(function(){
		userdemand += $(this).attr("id")+","
	});
	console.log("userdemand="+userdemand)
//	if (username == null || username == "") {
//		checkValue("username","姓名不能为空");
//	}else if (wechatno == null || wechatno == "") {
//		checkValue("wechatno","微信号不能为空");
//	}else if (phone == null || phone == "") {
//		checkValue("phone","手机号不能为空");
//	}else{
//		toPayInit(userInfo.userId,courseTypeId,order_type,disUserId,username,wechatno,phone,userdemand,yearsId);
//	}
	toPayInit(userInfo.userId,courseTypeId,order_type,disUserId,username,wechatno,phone,userdemand,yearsId);
	function checkValue(id,tipMsg){
		$("#tip_msg").text(tipMsg);
		$(".value_tip").css("display","flex");
		setTimeout(function(){
			$("#"+id).focus();
			$(".value_tip").css("display","none");
		},1000)
	}
})

