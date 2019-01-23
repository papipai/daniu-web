/**
 * 调起微信支付
 */
//初始化下单信息
function toPayInit(courseId,userId){
	var that = this;
	$.ajax({
		async: false,
		type:"post",
		url:apiPath.wechatPath,
		xhrFields:{withCredentials:true},
		data:{
			"method":wechat.get('coursePay'),
			"courseId":courseId,
			"userId":userId
		},
		success : function(data) {// 服务器响应成功时的处理函数
			//alert("result="+data.object.result+" prepay_id="+data.object.prepay_id);
			console.log("初始化下单信息是否成功="+data.object.result+"courseId="+courseId+" userId="+userId);
			if(data.object.result==1){//插入支付记录
				var paySign = data.object.paySign;
				var prepay_id = data.object.prepay_id;
				var nonceStr = data.object.noncestr;
				var timestamp = data.object.timestamp;
				var spbill_create_ip = data.object.spbill_create_ip;
				var detail = data.object.detail;
				var body = data.object.body;
				var out_trade_no = data.object.out_trade_no;
				var money = data.object.payMoery;
				var appid = data.object.appid;
				//alert("money="+money)
				that.onBridgeReady(appid,paySign,prepay_id,nonceStr,timestamp,courseId,userId,detail,body,out_trade_no,money);
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
function onBridgeReady(appid,paySign,prepay_id,nonceStr,timestamp,courseId,userId,detail,body,out_trade_no,money){
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
    		// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {//添加订单记录和用户购买的课程
           	//alert("购买回调="+res.err_msg)
           	//console.log("购买回调="+res.err_msg);
        	    $.ajax({
        	    	async: false,
					type:"post",
					url:apiPath.wechatPath,
					xhrFields:{withCredentials:true},
					data:{
						"method":wechat.get('createOrder'),
						"courseId":courseId,
						"userId":userId,
						"detail":detail,
						"body":body,
						"out_trade_no":out_trade_no,
						"money":money
					},
					success : function(data) { // 服务器响应成功时的处理函数
						//alert("支付是否成功="+data.code);
						if(data.code == 0){//插入支付记录
							window.localStorage.setItem("courseId",courseId);
							alert('购买成功，开启学霸模式~');
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
 * 课程支付购买
 * 训练营课程需要选定时间才能付款（在Mdate.js实现）
 * 录播课程直接付款
 * @param {Object} courseId
 * @param {Object} userId
 */
var courseDetails = JSON.parse(window.localStorage.getItem("courseDetails"));
//判断购买的课程模式是否为训练营模式，训练营模式需选择开课时间再支付，在线模式直接支付
if (courseDetails.courseMode == 2) {//因为点击事件与Mdata插件冲突，所以当课程为在线模式时修改立即购买按钮的id
	$(".btn_buy").attr("id","btn_buy");
	//$("#buy-now").attr("id","buy-now-mode1");//播放详情页的立即购买
}
$("#btn_buy").click(function(){
	console.log("在线模式直接购买");
	toPayInit(courseDetails.courseId,userInfo.userId);
})

//立即购买
//$("#buy-now-mode1").click(function(){
//	console.log("播放详情页-在线模式直接购买");
//	toPayInit(courseDetails.courseId,userInfo.userId);
//})