/**
 * 调起微信支付
 * courseId 课程id
 * userId 用户id
 * pay_platform 购买渠道（1.公众号，2.小程序）
 */
//初始化下单信息
var pay_platform = 1;//公众号为1
var pay_way = 1;//1-微信支付，2-支付宝支付，3-华为支付
function toPayInit(courseId,userId,order_type,disUserId){
	console.log(courseId+ userId+ order_type)
	var that = this;
	$.ajax({
		async: false,
		type:"post",
		url:apiPath.wechatPath,
		xhrFields:{withCredentials:true},
		data:{
			"method":wechat.get('coursePay'),
			"courseId":courseId,
			"userId":userId,
			"order_type":order_type,
			"disUserId":disUserId,
			"pay_platform":pay_platform,
			"pay_way":pay_way
		},
		success : function(data) {// 服务器响应成功时的处理函数
			console.log(data)
			//alert("result="+data.object.result+" prepay_id="+data.object.prepay_id);
			console.log("初始化下单信息是否成功="+data.object.result+" courseId="+courseId+" userId="+userId+" order_type="+order_type);
			if(data.object.result==1){//插入支付记录
				var appid = data.object.appid;
				var timestamp = data.object.timestamp;
				var nonceStr = data.object.noncestr;
				var prepay_id = data.object.prepay_id;
				var paySign = data.object.paySign;
				var out_trade_no = data.object.out_trade_no;
//				var spbill_create_ip = data.object.spbill_create_ip;
//				var detail = data.object.detail;
//				var body = data.object.body;
//				var out_trade_no = data.object.out_trade_no;
//				var money = data.object.payMoery;
				
				//alert("money="+money)
//				that.onBridgeReady(appid,paySign,prepay_id,nonceStr,timestamp,courseId,userId,detail,body,out_trade_no,money,order_type);
				that.onBridgeReady(appid,timestamp,nonceStr,prepay_id,paySign,courseId,out_trade_no);
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
//function onBridgeReady(appid,timestamp,nonceStr,prepay_id,paySign,courseId,userId,detail,body,out_trade_no,money,order_type){
function onBridgeReady(appid,timestamp,nonceStr,prepay_id,paySign,courseId,out_trade_no){
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
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {//添加订单记录和用户购买的课程
           	//查询订单状态是否为已支付
        	    $.ajax({
        	    	async: false,
					type:"post",
					url:apiPath.userPath,
					xhrFields:{withCredentials:true},
					data:{
						"method":user.get('orderStatus'),
						"out_trade_no":out_trade_no
					},
					success : function(data) { // 服务器响应成功时的处理函数
//						alert("查询订单结果："+data.object.orderStatus)
//						alert("课程支付订单结果="+data)
//						alert("用户是否关注公众号："+userInfo.subscribe)
						if(data.object.orderStatus == 1){//插入支付记录
							$(".btn_buy").attr("id","learing_atonce");
							$(".btn_buy").text("立即学习");
							//立即学习
							$("#learing_atonce").click(function(){
								var courseDetails = JSON.parse(window.localStorage.getItem("courseDetails"));
								window.localStorage.setItem("courseChapterUrl",courseDetails.courseChapterList.courseChapterUrl);
								window.localStorage.setItem("nums",1);
								window.location.href = "play.html";
								
							})
			
							if (userInfo.subscribe == 0) {
								//提示用户关注公众号
								$(".group_tip").css("display","flex");
							}else if (userInfo.subscribe == 1) {
								$(".buy_tip").css("display","flex");
								setTimeout(function(){
									window.localStorage.setItem("courseId",courseId);
									window.localStorage.setItem("isbuy","Y");
									window.location.href = "play.html";
								},2000);
							}
							
						}else{
							alert("支付成功！")
						}
					}
				}); 
           }else if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
//      	   alert('付款失败，请重新购买');
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
var order_type = 2;
console.log("disUserId="+disUserId);
if (disUserId == null) {
	disUserId = -1;
	order_type = 1;
}

/**
 * 课程支付购买
 * 训练营课程需要选定时间才能付款（在Mdate.js实现）
 * 录播课程直接付款
 * @param {Object} courseId
 * @param {Object} userId
 */
var courseDetails = JSON.parse(window.localStorage.getItem("courseDetails"));
$("#dateSelectorOne").click(function(){
	toPayInit(courseDetails.courseId,userInfo.userId,order_type,disUserId);
})

