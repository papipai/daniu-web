
function showTip(){
	console.log("tipsss.."+$(".tip_word").text());
	$(".tip").css("display","flex");
	setTimeout(function(){
			$(".tip").css("display","none");
		},2000);
}
