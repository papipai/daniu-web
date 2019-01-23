var VideoPlay=function(){
    this.oOPerBtn=$("#oper-btn");
    this.oPlayBtn=$("#play-btn");
    this.oVideo=$("#video");
    this.oCurrentTime=$("#current-time");
    this.oDuration=$("#duration");
    this.oControl=$("#control");
    this.oVideoScreen=$("#video-screen");
    this.oDragBtn=$("#drag-btn");
    this.oProgressBar=$("#progress-bar");
    this.oPlayProgressBar=$("#play-progress-bar");
    this.oScreenTimeWrap=$("#screen-time-wrap");
    this.oScreenCurrentTime=$("#screen-currenttime");
    this.oScreenDuration=$("#screen-duration");
    this.oFullBtn=$("#full-btn");
    this.oVideoWrap=$("#video-wrap");
    this.oLoading=$("#loading");
    this.iDuration=0;
    this.iCurrentTime=0;
    this.timer;
    this.fnTimer;
//  this.oHls;
    this.bMoving=false;
    this.init();
    
};
VideoPlay.prototype={
    init:function(){
        var _this=this;
        _this.bindEvent();
        _this.eventVideo();
        _this.hideControl(1);
        _this.touchScreenTime();
//      _this.oHls=new Hls();
//      _this.oHls.loadSource(_this.oVideo.attr("src"));
//      _this.oHls.attachMedia(_this.oVideo[0]);
    },
    bindEvent:function(){
        var _this=this;
        _this.oOPerBtn.on("click",function(){//点击暂停、开始按钮
            if($(this).hasClass("play")){
                _this.pauseStyle();
            }else{
                _this.startStyle();
            }
        });
		_this.oPlayBtn.on("click",function(){//点击暂停、开始按钮(屏幕中间)
            if($(this).hasClass("play-hide")){
                _this.pauseStyle();
            }else{
                _this.startStyle();
            }
        });

        //点击屏幕
        _this.oVideoScreen.on("touchstart",function(){
            _this.showHideControl();
        });

        _this.setDragBtn();

        //点击全屏
        _this.oFullBtn.on("click",function(){
            if($(this).hasClass("full-btn")){
                _this.setFullScreen();
            }else{
                _this.setUnFullScreen();
            }
        });

        //监听屏幕方向
        $(window).on("orientationchange",function(){
            _this.orientation();
        });

    },
    orientation:function(){
        var _this=this;
        if(window.orientation==0 || window.orientation==180){//竖屏
            _this.setUnFullScreen();
        }else if(window.orientation==90 || window.orientation==-90){//横屏
            _this.setFullScreen();
        }
    },
    startStyle:function(){
        var _this=this;
        _this.oOPerBtn.removeClass("pause").addClass("play");
        _this.oPlayBtn.addClass("play-hide");
        _this.oVideo[0].pause();
    },
    pauseStyle:function(){
        var _this=this;
        _this.oOPerBtn.removeClass("play").addClass("pause");
        _this.oPlayBtn.removeClass("play-hide");
        _this.oVideo[0].play();
    },
    getCurrentime:function(){
        var _this=this;
        _this.timer=setInterval(function(){
            _this.iCurrentTime=_this.oVideo[0].currentTime;
            _this.oCurrentTime.text(formatSeconds(_this.oVideo[0].currentTime));
            _this.iDuration=_this.oVideo[0].duration;
            setTimeout(function(){
                _this.oDuration.text(formatSeconds(_this.iDuration));
            },1000);
            if(!_this.bMoving) {
                _this.setProgress(_this.oVideo[0].currentTime);
            }
        },1000);
    },
    eventVideo:function(){
        var _this=this;
        //正在播放中
        _this.oVideo[0].addEventListener("playing",function(){
            _this.getCurrentime();
            _this.oLoading.addClass("hide");
        });

        //播放
        _this.oVideo[0].addEventListener("play",function(){
            _this.oLoading.addClass("hide");
        });

        //监听等待
        _this.oVideo[0].addEventListener("waiting",function(){
            _this.oLoading.removeClass("hide");
        });

        //播放结束
        _this.oVideo[0].addEventListener("ended",function(){
            _this.startStyle();
            _this.oLoading.addClass("hide");
        });


    },
    showHideControl:function(){//显示隐藏底部控制面板
        var _this=this;
        clearTimeout(_this.fnTimer);
        if(_this.oControl.attr("data-show")=='1'){
            _this.hideControl(0);
        }else{
            _this.showControl();
        }
    },
    hideControl:function(flag){
        var _this=this;
        if(flag==1){
            _this.fnTimer=setTimeout(function(){
                TweenMax.to(_this.oControl,0.3,{y:55,onComplete:function(){
                    _this.oControl.attr("data-show",'0');
                }});
            },5000);
        }else{
            TweenMax.to(_this.oControl,0.3,{y:55,onComplete:function(){
                _this.oControl.attr("data-show",'0');
            }});
        }

    },
    showControl:function(){
        var _this=this;
        TweenMax.to(_this.oControl,0.3,{y:0,onComplete:function(){
            _this.oControl.attr("data-show",'1');
            _this.hideControl(1);
        }});
    },
    setDragBtn:function(){//拖拽进度条
        var _this=this,startX,moveX,bMove=false;
        _this.oDragBtn.on("touchstart",function(e){
            var touchPros= e.originalEvent.touches[0];
            _this.bMoving=true;
            if(!bMove) {
                startX = touchPros.pageX - touchPros.target.parentNode.offsetLeft;
            }
        }).on("touchmove",function(e){
            bMove=true;
            _this.bMoving=true;
            var touchPros= e.originalEvent.touches[0];
            moveX=touchPros.pageX-startX;
            if(moveX<=0){
                moveX=0;
            }else if(moveX>=_this.oProgressBar.width()-$(this).width()){
                moveX=_this.oProgressBar.width()-$(this).width();
            }
            $(this).css("left",moveX+"px");
            _this.oPlayProgressBar.width(moveX+"px");
        }).on("touchend",function(){
            _this.bMoving=false;
            var fCurrentTime=moveX/(_this.oProgressBar.width()-$(this).width())*_this.iDuration;
            _this.seekTo(fCurrentTime);
        });
    },
    seekTo:function(pTime){
        var _this=this;
        _this.oVideo[0].currentTime=pTime;
    },
    setProgress:function(pTime){
        var _this=this;
        var iProgressWidth=pTime/_this.iDuration*(_this.oProgressBar.width()-_this.oDragBtn.width());
        _this.oPlayProgressBar.width(iProgressWidth+"px");
        _this.oDragBtn.css("left",iProgressWidth+"px");
    },
    touchScreenTime:function(){//触屏显示时间
        var oHammer,_this=this,iCurrentTime= 0,iDirection=0;
        oHammer=new Hammer(_this.oVideoScreen[0]);
        oHammer.on("panstart",function(e){
            iCurrentTime=_this.iCurrentTime;
        });
        oHammer.on("panmove",function(e){
            iDirection= e.direction;
            if(iDirection==2){//左
                iCurrentTime--;
                if(iCurrentTime<=0){
                    iCurrentTime=0;
                }
                _this.oScreenTimeWrap.removeClass("hide");
                _this.setScreenTime(iCurrentTime);
            }
            if(iDirection==4){//右
                iCurrentTime++;
                if(iCurrentTime>=_this.iDuration){
                    iCurrentTime=_this.iDuration;
                }
                _this.oScreenTimeWrap.removeClass("hide");
                _this.setScreenTime(iCurrentTime);
            }
        });
        oHammer.on("panend",function(){
            _this.seekTo(iCurrentTime);
            _this.oScreenTimeWrap.addClass("hide");
        });
    },
    setScreenTime:function(pTime){
        var _this=this;
        _this.oScreenCurrentTime.text(formatSeconds(pTime));
        _this.oScreenDuration.text(formatSeconds(_this.iDuration));
    },
    
//  //进入全屏
//	setFullScreen:function() {
//		var _this=this;
//	    var ele = _this.oVideo[0];
//	    //var ele = document.documentElement;
//	    if (ele .requestFullscreen) {
//	        ele .requestFullscreen();
//	    } else if (ele .mozRequestFullScreen) {
//	        ele .mozRequestFullScreen();
//	    } else if (ele .webkitRequestFullScreen) {
//	        ele .webkitRequestFullScreen();
//	    }
//	},
//	//退出全屏
//	setUnFullScreen:function() {
//		var _this=this;
//	    var de = _this.oVideo[0];
//	    if (de.exitFullscreen) {
//	        de.exitFullscreen();
//	    } else if (de.mozCancelFullScreen) {
//	        de.mozCancelFullScreen();
//	    } else if (de.webkitCancelFullScreen) {
//	        de.webkitCancelFullScreen();
//	    }
//	},

    
    setFullScreen:function(){//全屏(网页全屏)
        var _this=this;
        var iWindowHeight;
        setTimeout(function(){
            _this.oFullBtn.removeClass("full-btn").addClass("unfull-btn");
            iWindowHeight = $(window).height() + "px";
            _this.oVideoWrap.css({"width":"100%","height":iWindowHeight,"position":"absolute","left":"0","top":"0","z-index":99});
        },300);
    },
    setUnFullScreen:function(){//取消全屏
        var _this=this;
        _this.oFullBtn.removeClass("unfull-btn").addClass("full-btn");
        _this.oVideoWrap.css({"width":"100%","height":"4.8rem","position":"relative","z-index":1});
    },
    nextVideo:function(){//下一个视频
    	var _this=this;
    	
    }
};