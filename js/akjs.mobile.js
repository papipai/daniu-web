/*! jquery.AKjs.Mobile by Mobile Web App Plugin v1.2.4 Stable --- Copyright Andrew.Kim | (c) 20170808 ~ 20180625 AKjs.Mobile license */
/*! Coding by Andrew.Kim (E-mail: andrewkim365@qq.com) https://github.com/andrewkim365/AKjs.Mobile */

if ("undefined" == typeof jQuery) throw new Error("AKjs.Mobile Plugin's JavaScript requires jQuery");
if (window.location.protocol == "file:") throw new Error("AKjs.Mobile Plugin's Local Ajax requests are not supported");

/*-----------------------------------------------Andrew_Config------------------------------------------*/
function Andrew_Config(setting) {
    var option = $.extend({
            MaskStyle: [],
            Responsive: true,
            touchstart: true,
            ButtonLink: true,
            fixedBar: true,
            WechatHeader: false,
            Orientation: true,
            Prompt: "",
            Topdblclick: true,
            animation: true
        },
        setting);
    Andrew_sUserAgent();
    if(option.MaskStyle) {
        $("body").addClass("ak-mask_" + option.MaskStyle[0]+" ak-mask_"+option.MaskStyle[1]);
    }
    if(!option.Responsive) {
        $("body").addClass("ak-screen");
    }
    if(option.Topdblclick == true) {
        var touchtime = new Date().getTime();
        if (IsMobile) {
            var delegate = "touchstart";
        } else {
            var delegate = "click";
        }
        $("header h1").bind(delegate, function (andrew) {
            andrew.preventDefault();
            if( new Date().getTime() - touchtime < 500 ){
                $("main").animate({scrollTop:0},1000);
            }else{
                touchtime = new Date().getTime();
            }
        });
    }
    if(option.Orientation== true) {
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
            if (window.orientation === 180 || window.orientation === 0) {
                $("main").addClass("scrolling");
                $(".ak-landscape").hide().remove();
            } else if (window.orientation === 90 || window.orientation === -90 ){
                $("input").blur();
                $("textarea").blur();
                $("main").removeClass("scrolling");
                setTimeout(function() {
                    $("body").append("<div class=\"ak-landscape\">"+option.Prompt+"</div>");
                },200);
            }
        }, false);
    }
    if(option.touchstart== true) {
        document.body.addEventListener('touchstart', function () {
        });
        $("main").addClass("scrolling");
    } else {
        $("*").removeClass("touchstart");
    }
    if(option.WechatHeader== true) {
        if(IsWechat) {
            $("header").addClass("dis_none_im").removeClass("dis_block_im");
            $("main").addClass("mt_0");
        } else {
            $("main").removeClass("mt_0");
        }
    }
    if(option.ButtonLink== true) {
        Andrew_HashSharp(false,false);
    } else {
        $("*").removeAttr("data-href");
    }
    if(option.animation) {
        Andrew_Animation();
    } else {
        $("*").removeAttr("data-animation");
    }
    if(option.fixedBar== true) {
        Andrew_InputFocus();
    }
    Andrew_mainHeight();
    $(window).resize(function(){
        Andrew_mainHeight();
    });
}

/*-----------------------------------------------Andrew_Router------------------------------------------*/
function Andrew_Router(setting) {
    var option = $.extend({
            Router: false,
            FileFormat: ".html",
            Parameter: false,
            Animate:"",
            RouterPath:[],
            success:function () {
            },
            error:function () {
            },
            changePage:function () {
            }
        },
        setting);
    if(option.Router== true) {
        if (window.location.protocol != "file:") {
            layout = $.ajax({
                url: option.RouterPath[1],
                async: false,
                cache: false
            });
            $("body").html(layout.responseText);
        }
        Andrew_sUserAgent();
        $(window).bind('load', function () {
            Router_Ajax(option);
            option.changePage(document.location.hash.substring(1));
        });
        $(window).bind('hashchange', function () {
            var page = "hashchange";
            $("header, main, footer").unbind();
            Router_Ajax(option,page);
            option.changePage(document.location.hash.substring(1));
        });
        function Router_Ajax(option,page) {
            $("main").ready(function(){
                if (document.location.hash.substring(1) != "") {
                    if (page == "hashchange") {
                        var ak_menu_btn = $("footer").children("menu").find("button");
                        ak_menu_btn.each(function () {
                            if (document.location.hash == $(this).attr("data-href") || document.location.hash.substring(1) == $(this).attr("data-href")) {
                                $("footer").removeClass("dis_none_im");
                            }
                        });
                        if (option.Animate) {
                            $("main").addClass("dis_opa_0").removeClass("animated " + option.Animate);
                            setTimeout(function () {
                                $("main").removeClass("dis_opa_0").addClass("animated " + option.Animate);
                            }, 100);
                        }
                        $("main").animate({"scrollTop": 0}, 100);
                        $("body").children("div").remove();
                        $(".ak-mask").remove();
                    }
                    var Router_path = "./";
                    if (option.RouterPath[0]) {
                        Router_path = option.RouterPath[0];
                    }
                    var hash_dot = new RegExp("\\.");
                    var hash_question = new RegExp("\\?");
                    if (window.location.protocol != "file:") {
                        if (hash_dot.test(Router_path + document.location.hash.substring(1))) {
                            var ak_url = Router_path + document.location.hash.substring(1)
                        } else {
                            if (hash_question.test(Router_path + document.location.hash.substring(1))) {
                                var ak_hash = Router_path + document.location.hash.substring(1).replace("?", option.FileFormat + "?");
                            } else {
                                var ak_hash = Router_path + document.location.hash.substring(1) + option.FileFormat;
                            }
                            var ak_url = ak_hash.replace("/" + option.FileFormat, "/index" + option.FileFormat);
                        }
                        htmlobj = $.ajax({
                            url: ak_url,
                            async: false,
                            cache: false,
                            success: function () {
                                $("main").removeClass("dis_none_im");
                                option.success(document.location.hash.substring(1));
                            },
                            error: function () {
                                $("main").addClass("dis_none_im");
                                option.error(document.location.hash.substring(1));
                            }
                        });
                        if ($(htmlobj.responseText).prop("localName") == "template") {
                            $("main").html($(htmlobj.responseText).html());
                        } else {
                            $("main").text('sorry! The lack of "<template></template>" elements!');
                        }
                        if ($($(htmlobj.responseText)).next().prop("localName") == "script") {
                            var jsText = $($(htmlobj.responseText)).next().html();
                        } else if ($($(htmlobj.responseText)).next().prop("localName") == "style") {
                            var jsText = $($(htmlobj.responseText)).next().next().html();
                        }
                        if ($($(htmlobj.responseText)).next().next().prop("localName") == "style") {
                            var cssText = $($(htmlobj.responseText)).next().next().html();
                        } else if ($($(htmlobj.responseText)).next().prop("localName") == "script") {
                            var cssText = $($(htmlobj.responseText)).next().html();
                        }
                        $("html").children("script").html("").remove();
                        $("html").children("style").html("").remove();
                        setTimeout(function () {
                            $("<script type=\"text/javascript\">"+jsText+"</script>").appendTo($("html"));
                            $("<style type=\"text/css\">"+cssText+"</style>").appendTo($("html"));
                        }, 100);
                    }
                    Router_Settings();
                }
            });
        }
        function Router_Settings() {
            if ($("footer").find("dfn").length == 0) {
                $("footer").children().before("<dfn />");
                $("footer").children("dfn").addClass("dis_none_im").removeClass("dis_block_im");
            }
            if ($("ak-header").length > 0) {
                if ($("ak-header").attr("data-display") == "false") {
                    $("header").addClass("dis_none_im").removeClass("dis_block_im");
                } else {
                    if ($("ak-header").children().length > 0) {
                        $("header").html($("ak-header").html());
                    } else {
                        $("header").html("<h1 class='text_al_c'>"+$("title").text()+"</h1>");
                    }
                    $("header").removeClass("dis_none_im").addClass("dis_block_im");
                }
                $("ak-header").remove();
            } else {
                $("header").addClass("dis_none_im").removeClass("dis_block_im");
            }
            if ($("ak-footer").length > 0) {
                if ($("ak-footer").attr("data-display") == "false") {
                    $("footer").addClass("dis_none_im").removeClass("dis_block_im");
                } else {
                    if ($("ak-footer").children().length > 0) {
                        $("footer").children("dfn").html($("ak-footer").html());
                        $("footer").children("dfn").removeClass("dis_none_im").addClass("dis_block_im");
                        $("footer").children("menu").addClass("dis_none_im");
                    } else {
                        $("footer").children("dfn").addClass("dis_none_im").removeClass("dis_block_im").remove();
                        $("footer").children("menu").removeClass("dis_none_im");
                    }
                    $("footer").removeClass("dis_none_im").addClass("dis_block_im");
                }
                $("ak-footer").remove();
            } else {
                $("footer").children("dfn").addClass("dis_none_im").removeClass("dis_block_im").remove();
                $("footer").addClass("dis_none_im").removeClass("dis_block_im");
            }
            setTimeout(function() {
                if (option.Parameter) {
                    Andrew_HashSharp(true,true);
                } else {
                    Andrew_HashSharp(true,false);
                }
            },200);
            Andrew_Animation();
        }
    }
}

/*-----------------------------------------------Andrew_Menu--------------------------------------------*/
function Andrew_Menu(setting) {
    var option = $.extend({
            active_color: "",
            menu_icon: new Array(),
            menu_icon_active: new Array(),
            Callback: function() {
            }
        },
        setting);
    var ak_menu = $("footer").find("menu");
    var ak_menu_btn = $("footer").find("menu").find("button");
    if (ak_menu_btn.length > 5) {
        ak_menu_btn.last().remove();
        ak_menu.addClass("length5");
    } else {
        ak_menu.addClass("length"+ak_menu_btn.length);
    }
    ak_menu_btn.each(function () {
        var index = $(this).index();
        if ($(this).attr("data-href")) {
            var data_href = $(this).attr("data-href").split("?")[0];
        }
        $(this).children().eq(0).addClass(option.menu_icon[index]);
        $(this).children().removeClass(option.active_color);
        if (document.location.hash.indexOf(data_href) != -1 || document.location.hash.substring(1).split("?")[0].indexOf(data_href) != -1) {
            ak_menu_btn.children().eq(1).removeClass(option.active_color);
            $(this).children().eq(0).removeClass(option.menu_icon[index]);
            $(this).children().eq(0).addClass(option.menu_icon_active[index]).addClass(option.active_color);
            $(this).children().eq(1).addClass(option.active_color);
            option.Callback($(this),index+1);
        } else if (document.location.hash.substring(1).split("?")[0] == "") {
            ak_menu_btn.eq(0).children().eq(0).removeClass(option.menu_icon[0]).addClass(option.menu_icon_active[0]).addClass(option.active_color);
            ak_menu_btn.eq(0).children().eq(1).addClass(option.active_color);
        }
    });
    $(window).bind('hashchange', function () {
        ak_menu_btn.each(function () {
            var index = $(this).index();
            if ($(this).attr("data-href")) {
                var data_href = $(this).attr("data-href").split("?")[0];
            }
            if (document.location.hash.substring(1).split("?")[0].indexOf(data_href) == -1) {
                $(this).children().eq(0).removeClass(option.menu_icon_active[index]).addClass(option.menu_icon[index]);
                $(this).children().eq(1).removeClass(option.active_color);
            }
        });
    });
}

/*-----------------------------------------------Andrew_sUserAgent------------------------------------------*/
function Andrew_sUserAgent() {
    var terminal = navigator.userAgent.toLowerCase();
    var browser = window.navigator.userAgent;
    var explorer = window.navigator.appVersion;
    IsMobile = terminal.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    IsIpad = terminal.match(/ipad/i) == "ipad";
    IsIphone = terminal.match(/iphone os/i) == "iphone os";
    IsAndroid = terminal.match(/android/i) == "android";
    IsWindows = terminal.match(/windows/i) == "windows";
    IsImac = terminal.match(/macintosh/i) == "Imac";
    IsWechat = terminal.match(/MicroMessenger/i)=="micromessenger";
    IsQQ = terminal.match(/QQ/i)=="qq";
    IsUc7 = terminal.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    IsUc = terminal.match(/ucweb/i) == "ucweb";
    IsWM = terminal.match(/windows mobile/i) == "windows mobile";
    IsChrome = /Chrom/gi.test(browser);
    IsFirefox = /firefox/gi.test(browser);
    IsOpera = /opera/gi.test(browser);
    IsIE = !!document.all;
    IsIE6 = !!document.all && !window.XMLHttpRequest;
    IsIE7 = !!document.all && /msie 7.0/gi.test(explorer);
    IsIE8 = !!document.all && /msie 8.0/gi.test(explorer);
    Oslanguage = (navigator.browserLanguage || navigator.language).toLowerCase();
}

/*-----------------------------------------------Andrew_RegsInput------------------------------------------*/
function Andrew_RegsInput() {
    Regs_email = /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+$/;
    Regs_mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))\d{8})$/;
    Regs_url = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
    Regs_idCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    Regs_postal = /^[1-9]\d{5}(?!\d)$/;
    Regs_date = /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
    Regs_qq = /^[1-9][0-9]{4,9}$/;
    Regs_numAll = /"^\d+$/;
    Regs_userBefit = /^[a-z0-9]+$/i;
    Regs_pwdBefit = /^\w+$/;
}

/*-----------------------------------------------Andrew_InputFocus--------------------------------------*/
function Andrew_InputFocus() {
    Andrew_sUserAgent();
    $('main input[type="text"],main input[type="number"], main input[type="tel"], main input[type="email"]').on('focus', function() {
        var focus = this;
        header_scrollIntoView(focus);
    });
    $('main input[type="password"]').not('main input[type="password"][multiple]').on('focus', function() {
        var focus = this;
        header_scrollIntoView(focus);
    });
    $('main input[type="password"][multiple]').on('focus', function(andrew) {
        andrew.preventDefault();
        var focus = this;
        header_scrollIntoView(focus);
        if (IsIphone || IsIpad) {
            if ($("body").scrollTop() > 0) {
                $("header").addClass("dis_opa_0");
            }
            $("footer").addClass("dis_opa_0");
        }
    });
    $('main textarea').focus(function () {
        var focus = this;
        header_scrollIntoView(focus);
    });
    $('main input[type="text"],main input[type="number"], main input[type="tel"], main input[type="email"]').on('blur', function() {
        Input_BlurScrollTop();
    });
    $('main input[type="password"]').not('main input[type="password"][multiple]').on('blur', function() {
        Input_BlurScrollTop();
    });
    $('main input[type="password"][multiple]').on('blur', function() {
        Input_BlurScrollTop();
        $("header, footer").removeClass("dis_opa_0");
    });
    $('main textarea').on('blur', function() {
        Input_BlurScrollTop();
    });
    $("footer input").focus(function (andrew) {
        andrew.preventDefault();
        $("header, footer").bind({
            touchmove: function (andrew) {
                andrew.preventDefault();
                andrew.stopPropagation();
            }
        });
        if (IsIphone || IsIpad) {
            $("main").on({
                touchmove: function() {
                    document.activeElement.blur();
                    if ($("header").length > 0) {
                        $("header").css({
                            "margin-top": 0
                        });
                    }
                }
            });
            if ($("header").length > 0) {
                setTimeout(function () {
                    if ($("body").scrollTop() > 0) {
                        $("header").animate({
                            "margin-top": $("body").scrollTop()
                        });
                    } else {
                        $("header").css({
                            "margin-top": 0
                        });
                    }
                }, 200);
            }
            if ($("footer").length > 0) {
                $("footer").css({
                    //"margin-bottom": Andrew_GetScrollTop()
                });
            }
        }
    });
    $('footer input').on('blur', function() {
        $("main").unbind('touchstart');
        $("main").unbind('touchmove');
        if (IsIphone || IsIpad) {
            if ($("header").length > 0) {
                $("header").css({
                    "margin-top": 0
                });
            }
        }
    });
    function Input_BlurScrollTop(){
        $("main").unbind('touchstart');
        $("main").unbind('touchmove');
        if (IsIphone || IsIpad) {
            $("main").removeClass("pb_100");
            $("footer").removeClass("minus_bottom_100");
        } else if (IsAndroid) {
            $("footer").removeClass("dis_opa_0");
        }
        if ($("header").length > 0) {
            $("header").css({
                "margin-top": 0
            });
        }
        $("header").show();
    }
    function header_scrollIntoView(focus) {
        if (IsIphone || IsIpad) {
            setTimeout(function () {
                $('main').animate({scrollTop:$('main').scrollTop()},100);
            }, 100);
            if ($("header").length > 0) {
                setTimeout(function () {
                    $("header").animate({
                        "margin-top": Andrew_GetScrollTop()-1
                    });
                }, 200);
                $("main").on({
                    touchmove: function() {
                        $("header").css({
                            "margin-top": 0
                        });
                    }
                });
            }
            $("main").addClass("pb_100");
            $("footer").addClass("minus_bottom_100");
        } else if (IsAndroid) {
            if ($("header").length > 0) {
                $("header").css({
                    "margin-top": 0
                });
            }
            setTimeout(function () {
                focus.scrollIntoView(true);
                //focus.scrollIntoViewIfNeeded();
            }, 100);
        }
    }
}

/*-----------------------------------------------Andrew_GetScrollTop--------------------------------------*/
function Andrew_GetScrollTop() {
    var scrollTop=0;
    if(document.documentElement&&document.documentElement.scrollTop){
        scrollTop=document.documentElement.scrollTop;
    }else if(document.body){
        scrollTop=document.body.scrollTop;
    }
    return scrollTop;
}

/*-----------------------------------------------Andrew_Responsive------------------------------------------*/
function Andrew_Responsive(setting) {
    var option = $.extend({
            resizeCallback: function () {
            }
        },
        setting);
    function ak_WindowSize() {
        var device_width = window.screen.width;
        var device_height = window.screen.height;
        if (window.innerWidth)
            viewport_width = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            viewport_width = document.body.clientWidth;
        if (window.innerHeight)
            viewport_height = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            viewport_height = document.body.clientHeight;
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            viewport_height = document.documentElement.clientHeight;
            viewport_width = document.documentElement.clientWidth;
        }
        option.resizeCallback(device_width,device_height,viewport_width,viewport_height);
    }
    window.onresize = function() {
        ak_WindowSize();
    };
}

/*-----------------------------------------------Andrew_mainHeight--------------------------------------*/
function Andrew_mainHeight() {
    Andrew_sUserAgent();
    if (IsMobile) {
        $("main, textarea").removeClass("scrollbar");
        $(".bar_hide").removeClass("scrollbar_hide");
        $("body").addClass("fix").css({
            width: window.innerWidth,
            height: window.innerHeight
        });
    } else {
        $("main, textarea").addClass("scrollbar");
        $(".bar_hide").addClass("scrollbar_hide");
        $("body").removeClass("fix").removeAttr("style");
    }
    setTimeout(function() {
        if ($("header").hasClass("dis_none_im") && $("footer").hasClass("dis_none_im")) {
            $("main").css({
                "margin-top": 0,
                //"margin-bottom": 0,
                "height": $(window).height()
            });
        } else if ($("header").hasClass("dis_none_im") && !$("footer").hasClass("dis_none_im")) {
            $("main").css({
                "margin-top": 0,
                //"margin-bottom": $("footer").outerHeight(),
                "height": $(window).height() - $("footer").outerHeight()
            });
        } else if (!$("header").hasClass("dis_none_im") && $("footer").hasClass("dis_none_im")) {
            $("main").css({
                "margin-top": $("header").outerHeight(),
                //"margin-bottom": 0,
                "height": $(window).height() - $("header").outerHeight()
            });
        } else if (!$("header").hasClass("dis_none_im") && !$("footer").hasClass("dis_none_im")) {
            $("main").css({
                "margin-top": $("header").outerHeight(),
                //"margin-bottom": $("footer").outerHeight(),
                "height": $(window).height() - ($("header").outerHeight() + $("footer").outerHeight())
            });
        }
        if ($("header").length === 0 && $("footer").length > 0) {
            $("main").css({
                "height": $(window).height() - $("footer").outerHeight()
            });
        } else if ($("header").length > 0 && $("footer").length === 0) {
            $("main").css({
                "height": $(window).height() - $("header").outerHeight()
            });
        } else if ($("header").length === 0 && $("footer").length === 0) {
            $("main").css({
                "height": $(window).height()
            });
        }
        $("main").css({
            "top": "0",
            "bottom": "0",
            "left": "0",
            "right": "0",
        });
        $(".h_fill").css({
            "height": $(window).height()
        });
    },100);
}

/*-----------------------------------------------Andrew_Ajax--------------------------------------------*/
function Andrew_Ajax(setting) {
    var option = $.extend({
            to: "",
            type: "POST",
            url: "",
            data:{},
            async:false,
            cache: false,
            success:function () {
            },
            error:function () {
            }
        },
        setting);
    if (window.location.protocol != "file:") {
        htmlobj = $.ajax({
            type: option.type,
            url: option.url,
            data: option.data,
            async: option.async,
            cache: option.cache,
            success: function (result) {
                option.success(result);
                if ($(option.to)) {
                    $(option.to).html(htmlobj.responseText);
                }
                Andrew_HashSharp(true,false);
                Andrew_Animation();
            },
            error: function (error) {
                if ($(option.to)) {
                    $(option.to).html(htmlobj.responseText);
                }
                option.error(error);
            }
        });
    }
}

/*-----------------------------------------------Andrew_Animation------------------------------------------*/
function Andrew_Animation() {
    $('*[data-animation]').each(function(){
        var ani_ele = $(this);
        var ani_s = new RegExp("s");
        var animated_each = ani_ele.attr("data-animation");
        aniJson_each = eval("(" + animated_each + ")");
        if (aniJson_each.name) {
            ani_ele.removeClass("animated "+aniJson_each.name);
            ani_ele.addClass("animated "+aniJson_each.name);
        }
        if (aniJson_each.duration) {
            if (ani_s.test(aniJson_each.duration)) {
                ani_ele.css({
                    "animation-duration" : parseInt(aniJson_each.duration)
                });
            } else {
                ani_ele.css({
                    "animation-duration" : parseInt(aniJson_each.duration)+"s"
                });
            }
        }
        if (aniJson_each.delay) {
            if (ani_s.test(aniJson_each.delay)) {
                ani_ele.css({
                    "animation-delay" : parseInt(aniJson_each.delay)
                });
            } else {
                ani_ele.css({
                    "animation-delay" : parseInt(aniJson_each.delay)+"s"
                });
            }
        }
    });
}

/*-----------------------------------------------Andrew_HashSharp------------------------------------------*/
function Andrew_HashSharp(form,key) {
    var hash_sharp = new RegExp("#");
    var hash_dot = new RegExp("./");
    var hash_sharps = new RegExp("\\?#");
    var hash_script = new RegExp("javascript");
    var question_mark =  new RegExp("\\?");
    var akTime =  new RegExp("akjs=");
    $('*[data-href]').unbind('click');
    if (Andrew_getUrlParam('akjs') != null || hash_sharp.test(document.location.hash)) {
        $('*[data-href]').bind('click',function(andrew) {
            andrew.preventDefault();
            if (hash_sharp.test($(this).attr("data-href"))) {
                if(question_mark.test($(this).attr("data-href"))){
                    if(akTime.test($(this).attr("data-href"))){
                        if (key) {
                            document.location.href=Andrew_changeURLArg($(this).attr("data-href"),"akjs",new Date().getTime());
                        } else {
                            document.location.href=$(this).attr("data-href");
                        }
                    }else{
                        if (key) {
                            document.location.href=$(this).attr("data-href") + '&akjs=' + new Date().getTime();
                        } else {
                            document.location.href=$(this).attr("data-href");
                        }
                    }
                }else{
                    if (key) {
                        document.location.href=$(this).attr("data-href") + '?akjs=' + new Date().getTime();
                    } else {
                        document.location.href=$(this).attr("data-href");
                    }
                }
                $(this).attr("data-href",$(this).attr("data-href").replace("#",""));
            } else if (hash_script.test($(this).attr("data-href"))){
                document.location.replace($(this).attr("data-href"));
            } else if (hash_sharps.test(document.location.href)) {
                document.location.replace(document.location.href.replace("?#", "#"));
            } else {
                if(question_mark.test($(this).attr("data-href"))){
                    if(akTime.test($(this).attr("data-href"))){
                        if (key) {
                            document.location.href=Andrew_changeURLArg("#"+$(this).attr("data-href"),"akjs",new Date().getTime());
                        } else {
                            document.location.href="#"+$(this).attr("data-href");
                        }
                    }else{
                        if (key) {
                            document.location.href="#"+$(this).attr("data-href") + '&akjs=' + new Date().getTime();
                        } else {
                            document.location.href="#"+$(this).attr("data-href");
                        }
                    }
                } else if (hash_dot.test($(this).attr("data-href"))) {
                    var str = document.location.hash;
                    var index = str.lastIndexOf("\/");
                    str = str.substring(0,index)+"/";
                    str = str.replace("#","");
                    if (key) {
                        document.location.href="#"+$(this).attr("data-href").replace("./", str) + '?akjs=' + new Date().getTime();
                    } else {
                        document.location.href="#"+$(this).attr("data-href").replace("./", str);
                    }
                } else {
                    if (key) {
                        document.location.href="#"+$(this).attr("data-href") + '?akjs=' + new Date().getTime();
                    } else {
                        document.location.href="#"+$(this).attr("data-href");
                    }
                }
            }
        });
    } else {
        $('*[data-href]').bind('click',function(andrew) {
            andrew.preventDefault();
            document.location.href= $(this).attr("data-href");
        });
    }
    if (form == true) {
        $('form[action]').each(function () {
            var hash_sharp = new RegExp("#");
            if (Andrew_getUrlParam('akjs') && hash_sharp.test(document.location.hash)) {
                if (!hash_sharp.test($(this).attr("action"))) {
                    if (key) {
                        $(this).attr("action", "#/" + $(this).attr("action") + '?akjs=' + new Date().getTime());
                    } else {
                        $(this).attr("action", "#/" + $(this).attr("action"));
                    }
                }
            }
        });
    }
}

/*-----------------------------------------------Andrew_Include------------------------------------------*/
function Andrew_Include(url) {
    Andrew_pathURL();
    var type_js = new RegExp(".js");
    var type_css = new RegExp(".css");
    var type_remote = new RegExp("http");
    if(type_js.test(url)){
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("data-akjs",new Date().getTime());
        if (type_remote.test(url)) {
            fileref.setAttribute("src",url);
        } else {
            fileref.setAttribute("src",realPath+"/"+url+"?akjs="+new Date().getTime());
        }
    }else if(type_css.test(url)){
        var fileref = document.createElement('link');
        fileref.setAttribute("rel","stylesheet");
        fileref.setAttribute("type","text/css");
        fileref.setAttribute("data-akjs",new Date().getTime());
        if (type_remote.test(url)) {
            fileref.setAttribute("src",url);
        } else {
            fileref.setAttribute("href",realPath+"/"+url+"?akjs="+new Date().getTime());
        }
    }
    if(typeof fileref != "undefined"){
        if(type_js.test(url)){
            var type ="script";
            var type_url = "src";
        }else if(type_css.test(url)){
            var type ="link";
            var type_url = "href";
        }
        $("head").find(type).each(function(){
            if ($(this).data("akjs")) {
                if ($(this).attr(type_url).indexOf(url) != -1) {
                    $(this).remove();
                }
            }
        });
        $(fileref).appendTo($("head"));
    }else{
        console.info("load include {"+url+"} file method error!");
    }
}

/*-----------------------------------------------Andrew_Location-------------------------------------------*/
function Andrew_Location(url,option) {
    Andrew_sUserAgent();
    if (IsIphone || IsIpad) {
        switch (option) {
            case 'href':
                document.location.href="#"+url;
                break;
            case 'history':
                history.back(url);
                break;
            case 'reload':
                document.location.reload();
                break;
            default:
                document.location.replace("#"+url);
                break;
        }
    }else{
        switch (option) {
            case 'href':
                window.location.href="#"+url;
                break;
            case 'history':
                window.back(url);
                break;
            case 'reload':
                window.location.reload();
                break;
            default:
                window.location.replace("#"+url);
                break;
        }
    }
}

/*-----------------------------------------------Andrew_getUrlParam-------------------------------------------*/
function Andrew_getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var u = document.location.search.substr(1);
    //if(u == ''){
    var temp = document.location.hash.split('?');
    if(temp.length == 2){
        u = temp[1];
    }
    //}
    var r = u.match(reg);
    if (r != null) return unescape(r[2]); return null;
}

/*-----------------------------------------------Andrew_changeURLArg-------------------------------------------*/
function Andrew_changeURLArg(url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
    return url + '\n' + arg + '\n' + arg_val;
}

/*-----------------------------------------------Andrew_Params------------------------------------------*/
function Andrew_Params(number) {
    var hash_sharp = new RegExp("\\#/");
    if (hash_sharp.test(document.location.hash)) {
        hash_arr = (location.hash || "").replace(/^\#/, '').split("&");
    } else {
        hash_arr = (location.hash || "").replace(/^\#/, '/').split("&");
    }
    var params = [];
    for(var i=0; i<hash_arr.length; i++){
        params.push(hash_arr[i].split("/"));
    }
    return params[0][number];
}

/*-----------------------------------------------Andrew_pathURL------------------------------------------*/
function Andrew_pathURL() {
    var hash_sharp = new RegExp("#");
    var hash_question = new RegExp("\\?");
    var hash_dot = new RegExp("[.]");
    wwwPath = window.document.location.href;
    pathName = window.document.location.pathname;
    if(!hash_sharp.test(wwwPath)){
        var urlArr = pathName.split("/");
        var hash_sharp_Url = "";
        for(var i = 0; i<urlArr.length; i++){
            if(hash_dot.test(urlArr[i])){
                hash_sharp_Url =  urlArr[i];
            }
        }
        if(hash_sharp_Url == ""){
            if (hash_question.test(wwwPath)) {
                var question = wwwPath.split("?")[0];
                realPath = question;
            } else {
                realPath = wwwPath;
            }
        }else{
            var new_hash_sharp_Url = new RegExp(hash_sharp_Url+".*");
            realPath = new_hash_sharp_Url.test(wwwPath)?wwwPath.replace(new_hash_sharp_Url,""):wwwPath;
        }
    } else{
        var urlArr = wwwPath.split("/");
        var hash_sharp_Url = "";
        for(var i = 0; i<urlArr.length; i++){
            if(hash_sharp.test(urlArr[i])){
                hash_sharp_Url =  urlArr[i];
            }
        }
        if (hash_question.test(wwwPath)) {
            if(hash_sharp.test(wwwPath)) {
                var question = wwwPath.split("?")[0];
                var urlArr = pathName.split("/");
                var hash_sharp_Url = "";
                for(var i = 0; i<urlArr.length; i++){
                    if(hash_dot.test(urlArr[i])){
                        hash_sharp_Url =  urlArr[i];
                    }
                }
                realPath = wwwPath.replace(hash_sharp_Url,"");
                var question = realPath.split("?")[0];
                realPath = question;
            } else {
                var question = wwwPath.split("?")[0];
                realPath = question;
            }
        } else {
            var new_hash_sharp_Url = new RegExp(hash_sharp_Url+"/.*");
            realPath = new_hash_sharp_Url.test(wwwPath)?wwwPath.replace(new_hash_sharp_Url,""):wwwPath;
        }
    }
}

/*-----------------------------------------------Andrew_setCookie------------------------------------------*/
function Andrew_setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    //Andrew_setCookie("username", user, 365);
}

/*-----------------------------------------------Andrew_getCookie------------------------------------------*/
function Andrew_getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
    //var user = Andrew_getCookie("username");
}

/*-----------------------------------------------Andrew_delCookie------------------------------------------*/
function Andrew_delCookie(name) {
    Andrew_setCookie(name, "", -1);
}

/*-----------------------------------------------Andrew_Unicode------------------------------------------*/
function Andrew_Unicode(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}

/*-----------------------------------------------Andrew_htmlEncode------------------------------------------*/
function Andrew_htmlEncode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, ">");
    s = s.replace(/</g, "<");
    s = s.replace(/>/g, ">");
    s = s.replace(/ /g, " ");
    s = s.replace(/\'/g, "'");
    s = s.replace(/\"/g, '"');
    s = s.replace(/\n/g, "<br>");
    return s;
}

/*-----------------------------------------------Andrew_htmlDecode------------------------------------------*/
function Andrew_htmlDecode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/>/g, "&");
    s = s.replace(/</g, "<");
    s = s.replace(/>/g, ">");
    s = s.replace(/ /g, " ");
    s = s.replace(/'/g, "\'");
    s = s.replace(/"/g, '\"');
    s = s.replace(/<br>/g, "\n");
    return s;
}

/*-----------------------------------------------Andrew_FileFormat------------------------------------------*/
function Andrew_FileFormat(filename) {
    var d=/\.[^\.]+$/.exec(filename);
    var ext = new String(d);
    var s = ext.toLowerCase();
    return s;
}

/*-----------------------------------------------Andrew_DateFormat------------------------------------------*/
function Andrew_DateFormat(date,format) {
    if (date.constructor === Date) {
        var d = date;
    }else if (date.constructor === String) {
        var d = new Date(Date.parse(date.replace(/-/g,   "/")));
    }else{
        var d = new Date();
    }
    var ak_zeroize = function (value, length)
    {
        if (!length) length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++)
        {
            zeros += '0';
        }
        return zeros + value;
    };

    return format.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0)
    {
        switch ($0)
        {
            case 'd': return d.getDate();
            case 'dd': return ak_zeroize(d.getDate());
            case 'M': return d.getMonth() + 1;
            case 'MM': return ak_zeroize(d.getMonth() + 1);
            case 'yy': return String(d.getFullYear()).substr(2);
            case 'yyyy': return d.getFullYear();
            case 'h': return d.getHours() % 12 || 12;
            case 'hh': return ak_zeroize(d.getHours() % 12 || 12);
            case 'H': return d.getHours();
            case 'HH': return ak_zeroize(d.getHours());
            case 'm': return d.getMinutes();
            case 'mm': return ak_zeroize(d.getMinutes());
            case 's': return d.getSeconds();
            case 'ss': return ak_zeroize(d.getSeconds());
            case 'l': return ak_zeroize(d.getMilliseconds(), 3);
            case 'L': var m = d.getMilliseconds();
                if (m > 99) m = Math.round(m / 10);
                return ak_zeroize(m);
            case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z': return d.toUTCString().match(/[A-Z]+$/);
            default: return $0.substr(1, $0.length - 2);
        }
    });
}

/*-----------------------------------------------Andrew_Plugin------------------------------------------*/
function Andrew_Plugin(setting,css) {
    var jssrcs = setting.split("|");
    if (window.location.protocol != "file:") {
        for(var i=0;i<jssrcs.length;i++){
            $.ajax({
                type:'GET',
                url: js_folder+"plugin/"+setting+".js?akjs="+new Date().getTime(),
                async: false,
                cache: false,
                dataType:'script'
            });
        }
        if (css) {
            var css_url = "'" + js_folder + "plugin/css/" + setting + ".css?akjs="+new Date().getTime()+"'";
            $("head").find("link").filter("#"+setting).remove();
            $("head").find("link:first").before("<link rel='stylesheet' type='text/css' id='"+setting+"' href=" + css_url + " />");
        }
    }
}
var scripts = document.scripts;
js_folder = scripts[scripts.length - 1].src.substring(0, scripts[scripts.length - 1].src.lastIndexOf("/") + 1);
