/**
 * api接口全局配置文件
 * apiPath：服务器地址
 * course：接口地址
 */
//var prefix = "http://www.suibianshuo.com.cn/daniu-school/";//大牛财商正式环境
var prefix = "http://www.suibianshuo.com.cn/super_lecture/";//超级讲座正式环境
//var prefix = "http://super.ngrok.xiaomiqiu.cn/";//本地测试环境
//var prefix = "http://www.suibianshuo.com.cn/daniu-school-test/";//测试环境
var apiPath = {
	
	coursePath:prefix+'course/getCourse.do',
	userPath:prefix+'user/getUser.do',
	wechatPath:prefix+'pay/toPayInit.do',
	wxSharePath:prefix+'main/getWechat.do',
	
}
//课程
var course = new Map([
	['allcourse', 'daniu.school.course.allcourse'], 
	['details', 'daniu.school.course.details'],
	['recommend', 'daniu.school.course.recommend'],
	['banner', 'daniu.school.course.banner.list'],
	['courseList', 'daniu.school.course.type.list'],
	['reShopCourse','daniu.school.shop.recommend.list']
])
//用户
var user = new Map([
	['addsuggestion', 'daniu.school.user.suggestion.add'], 
	['learning', 'daniu.school.user.course.learning'],
	['add', 'daniu.school.user.course.add'],
	['userinfo', 'daniu.school.user.info.details'],
	['adduser', 'camp.user.info.add'],
	['delete', 'daniu.school.user.course.delete'],
	['shopDetails','daniu.school.user.shop.details'],
	['addShopCourse','daniu.school.user.shop.course.add'],
	['wallet','daniu.school.user.wallet.details'],
	['tradeRecord','daniu.school.user.trade.record.get'],
	['tempList','daniu.school.distribution.shop.poster.temp.list'],
	['createPoster','daniu.school.distribution.shop.poster'],
	['addShare','daniu.school.user.distribution.record.add']
])
//微信支付
var wechat = new Map([
	['coursePay', 'daniu.school.user.buy.course.pay'],//初始化支付订单
	['createOrder', 'daniu.school.user.buy.course.order.add']
])
//微信分享
var wxShare = new Map([
	['getSign','daniu.school.wechat.share.sign']
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
