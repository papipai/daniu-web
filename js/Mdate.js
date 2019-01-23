(function() {
	var d = document;
	var includeCss = function(url) {
		var link = d.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = url;
		d.getElementsByTagName("head")[0].appendChild(link)
	};
	includeCss("css/Mdate.css");
	includeCss("js/config/api.js");
	var dateopts = {
		beginYear: 2000,
		beginMonth: 1,
		beginDay: 1,
		endYear: new Date().getFullYear(),
		endMonth: new Date().getMonth() + 1,
		endDay: new Date().getDate(),
		format: "YMD"
	};
	var MdSelectId = "";
	var MdAcceptId = "";
	var dateContentBox = "";
	var datePlugs = "";
	var yearTag = "";
	var monthTag = "";
	var dayTag = "";
	var indexY = 1;
	var indexM = 1;
	var indexD = 1;
	var initM = null;
	var initD = null;
	var yearScroll = null;
	var monthScroll = null;
	var dayScroll = null;
	var Mdate = function(el, opts) {
		if (!opts) {
			opts = {}
		}
		this.id = el;
		this.selectorId = d.getElementById(this.id);
		this.acceptId = d.getElementById(opts.acceptId) || d.getElementById(this.id);
		this.beginYear = opts.beginYear || dateopts.beginYear;
		this.beginMonth = opts.beginMonth || dateopts.beginMonth;
		this.beginDay = opts.beginDay || dateopts.beginDay;
		this.endYear = opts.endYear || dateopts.endYear;
		this.endMonth = opts.endMonth || dateopts.endMonth;
		this.endDay = opts.endDay || dateopts.endDay;
		this.format = opts.format || dateopts.format;
		this.dateBoxShow()
	};
	Mdate.prototype = {
		constructor: Mdate,
		dateBoxShow: function() {
			var that = this;
			that.selectorId.onclick = function() {
				that.createDateBox();
				that.dateSure()
			}
		},
		createDateBox: function() {
			var that = this;
			MdatePlugin = d.getElementById("MdatePlugin");
			if (!MdatePlugin) {
				dateContentBox = d.createElement("div");
				dateContentBox.id = "MdatePlugin";
				d.body.appendChild(dateContentBox);
				MdatePlugin = d.getElementById("MdatePlugin")
			}
			MdatePlugin.setAttribute("class", "slideIn");
			that.createDateUi();
//			var yearUl = d.getElementById("yearUl");
//			yearUl.innerHTML = that.createDateYMD("year");
			$("#yearUl").append(that.createDateYMD());
			that.initScroll();
			that.refreshScroll()
		},
		createDateUi: function() {
			var str = "" + '<section class="getDateBg"></section>' + 
			'<section class="getDateBox" id="getDateBox">' + 
			'<div class="choiceDateTitle">' + 
			'<button id="dateCancel">取消</button>' + 
			'<span id="tip">请选择开课时间</span>' + 
			'<button id="dateSure" class="fr">确定</button>' + 
			"</div>" + 
			'<div class="dateContent">' + 
			'<div class="checkeDate"></div>' + 
			'<div id="yearwrapper">' + 
			'<ul id="yearUl"></ul>'+
			"</div>" +  
			"</div>" + 
			"</section>";
			MdatePlugin.innerHTML = str
		},
		//循环遍历时间
		createDateYMD: function() {
			var that = this;
			var str = "<li>&nbsp;</li>";
			var beginNum = null,
			endNum = null,
			dataStyle = "data-year";
			var timeList = JSON.parse(window.localStorage.getItem("courseDetails")).daniuCourseBeginTimeList;
			if (timeList != "") {
				for (var i = 0; i < timeList.length; i++) {
					str += "<li " + dataStyle + "=" + timeList[i].beginTime + ">" + timeList[i].beginTime + "</li>"
				}
			}else{
				str += "<li " + dataStyle + "=notime style='color:#FF5D24'>该课程暂未开课，尽情期待~</li>"
			}
			
			return str + "<li>&nbsp;</li>"
		},
		
		initScroll: function() {
			var that = this;
			yearScroll = new iScroll("yearwrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexY = Math.ceil(this.y / 40 * -1 + 1);
					yearTag = yearUl.getElementsByTagName("li")[indexY].getAttribute("data-year");
				}
			});
			
			
		},
		refreshScroll: function() {
			var that = this;
			var inputYear = that.acceptId.getAttribute("data-year");
			var inputMonth = that.acceptId.getAttribute("data-month");
			var inputDay = that.acceptId.getAttribute("data-day");
			inputYear = inputYear || that.beginYear;
			inputMonth = inputMonth || that.beginMonth;
			inputDay = inputDay || that.beginDay;
			initM = that.beginMonth;
			initD = that.beginDay;
			if (inputYear != that.beginYear && initM != 1) {
				initM = 1
			}
			if (inputMonth != that.beginMonth && initD != 1) {
				initD = 1
			}
			inputYear -= that.beginYear;
			inputMonth -= initM;
			inputDay -= initD;
			yearScroll.refresh();
			yearScroll.scrollTo(0, inputYear * 40, 300, true);
			//monthScroll.scrollTo(0, inputMonth * 40, 300, true);
			//dayScroll.scrollTo(0, inputDay * 40, 300, true)
		},
		//确定时间后开始支付
		dateSure: function() {
			var that = this;
			var sureBtn = d.getElementById("dateSure");
			var cancelBtn = d.getElementById("dateCancel");
			var courseId = window.localStorage.getItem("courseId");
			var userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
					
			sureBtn.onclick = function() {
				if (that.format == "YMD") {
					that.acceptId.value = yearTag
				} else {
					that.acceptId.value = yearTag /*+ that.format + that.dateForTen(monthTag) + that.format + that.dateForTen(dayTag)*/
				}
				that.acceptId.setAttribute("data-year", yearTag);
				console.log("date="+yearTag)
				//判断yearTag是否存在
				if(yearTag == "notime"){
					alert("该课程暂未开课，尽请期待~")
				}else{
					toPayInit(courseId,userInfo.userId);//调用WXPay.js里面的方法
				}
				that.dateCancel()
			};
			cancelBtn.onclick = function() {
				that.dateCancel()
			}
		},
		dateForTen: function(n) {
			if (n < 10) {
				return "0" + n
			} else {
				return n
			}
		},
		dateCancel: function() {
			MdatePlugin.setAttribute("class", "slideOut");
			setTimeout(function() {
				MdatePlugin.innerHTML = ""
			},
			400)
		}
	};
	if (typeof exports !== "undefined") {
		exports.Mdate = Mdate
	} else {
		window.Mdate = Mdate
	}
})();