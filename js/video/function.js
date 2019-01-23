function formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
        }
        var result = ""+prefixInteger(parseInt(theTime),2)+"";
    }else{
        var result = "00:"+prefixInteger(parseInt(theTime),2)+"";
    }

    if(theTime1 > 0) {
        result = ""+prefixInteger(parseInt(theTime1),2)+":"+result;
    }
    if(theTime2 > 0) {
        result = ""+prefixInteger(parseInt(theTime2),2)+":"+result;
    }
    return result;
}

function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
