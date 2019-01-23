/**
 * api接口全局配置文件
 * apiPath：服务器地址
 * course：接口地址
 */

var apiPath = {
	
	coursePath:'http://www.suibianshuo.com.cn/daniu-school/course/getCourse.do',
	userPath:'http://www.suibianshuo.com.cn/daniu-school/user/getUser.do',
	wechatPath:'http://www.suibianshuo.com.cn/daniu-school/wechat/toPayInit.do',
	
}
//课程
var course = new Map([
	['allcourse', 'daniu.school.course.allcourse'], 
	['details', 'daniu.school.course.details'],
	['recommend', 'daniu.school.course.recommend'],
	['banner', 'daniu.school.course.banner.list']
])
//用户
var user = new Map([
	['addsuggestion', 'daniu.school.user.suggestion.add'], 
	['learning', 'daniu.school.user.course.learning'],
	['userinfo', 'daniu.school.user.info.details'],
	['adduser', 'daniu.school.user.info.add']
])
//微信支付
var wechat = new Map([
	['coursePay', 'daniu.school.user.buy.course.pay'],//初始化支付订单
	['createOrder', 'daniu.school.user.buy.course.order.add']
])

/**
 * 此方法用户获取后台json数据中object数组的大小
 * @param {Object} jsonData
 */
function getJsonLength(jsonData){
　　var jsonLength = 0;
　　for(var item in jsonData){
　　　　if(item == 'object'){
　　　　　　for(var x in jsonData[item]){
　　　　　　　　jsonLength++;
　　　　　　}
　　　　}
　　}
    return jsonLength;
}
