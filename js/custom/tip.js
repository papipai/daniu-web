
function showTip(img,word){
	console.log("img="+img);
	console.log("word="+word);
	$("#tip").css("display","flex");
	$("#tip .tip_img img").css("src",img);
	$("#tip .tip_word").text(word);
	setTimeout(function(){
			$("#tip").css("display","none");
		},2000);
}
