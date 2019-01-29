
function showTip(id){
	console.log("id="+id);
	console.log("tipsss.."+$(".tip_word").text());
	$(id).css("display","flex");
	setTimeout(function(){
			$(id).css("display","none");
		},2000);
}
