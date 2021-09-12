var _kglobal = {
    dev:true,
    w: window.innerWidth,
    h: window.innerHeight,
    scrollTop: 0,
    device_type: false,
    device_version: null,
    os_type: null,
    os_version: null,
}
// agent 
var k_ua = window.navigator.userAgent.toLowerCase()
  , AgentDetect = {
    IS_WIN: /Windows/i.test(k_ua),
    IS_MAC: /Macintosh/i.test(k_ua),
    IS_OP: "undefined" != typeof window.opera || /Opera/i.test(k_ua),
    IS_IE: !this.IS_OP && !!k_ua.match(/(?:(MSIE) |(Trident)\/.+rv[ :])([\w.]+)/i),
    IS_EDGE: /Edge/i.test(k_ua),
    IS_FF: /Firefox/i.test(k_ua),
    IS_CR: /Chrome|CriOS/i.test(k_ua),
    IS_SF: !/Chrome|CriOS/i.test(k_ua) && (k_ua || "").indexOf("safari") > -1,
    IS_IOS: /iPhone|iPad|iPod/i.test(k_ua),
    IS_IPHONE: /iPhone;/i.test(k_ua),
    IS_IPAD: /iPad;/i.test(k_ua),
    IS_IPOD: /iPod;/i.test(k_ua),
    IS_ANDROID: /Android/i.test(k_ua),
    IS_WINDOWS_MOBILE: /Windows Phone|Windows CE/i.test(k_ua),
    IS_BLACKBERRY: /BlackBerry/i.test(k_ua),
    IS_SONYERICSSON: /SonyEricsson/i.test(k_ua),
    IS_SYMBIAN_OS: /SymbianOS/i.test(k_ua),
    IS_WEB_OS: /webOS/i.test(k_ua),
    IS_WEBKIT_MOBILE: /AppleWebKit/i.test(k_ua),
    IS_IE_MOBILE: /IEMobile/i.test(k_ua),
    IS_OPERA_MINI: /Opera Mini/i.test(k_ua),
    IS_DOLFIN: /Dolfin/i.test(k_ua),
    IS_SAMSUNG: /SamsungBrowser/i.test(k_ua),
    init: function() {
        this.IE = "IE",
        this.EDGE = "Edge",
        this.CR = "Chrome",
        this.SF = "Safari",
        this.OP = "Opera",
        this.FF = "Firefox",
        this.WEBKIT_MOBILE = "WebKit Mobile",
        this.IE_MOBILE = "IE Mobile",
        this.OPERA_MINI = "Opera Mini",
        this.DOLFIN = "Dolfin",
        this.WIN = "Windows",
        this.MAC = "Macintosh",
        this.IOS = "IOS",
        this.ANDROID = "Android",
        this.WINDOWS_MOBILE = "Windows Mobile",
        this.BLACKBERRY = "BlackBerry",
        this.SONYERICSSON = "SonyEricsson",
        this.SYMBIAN_OS = "SymbianOS",
        this.WEB_OS = "WebOS",
        this.UNKNOWN_OR_NOT_SUPPORTED_BROWSER = "an unknown or not supported browser",
        this.UNKNOWN_BROWSER_VERSION = "an unknown browser version",
        this.UNKNOWN_OS_VERSION = "an unknown OS version",
        this.UNKNOWN_OR_NOT_SUPPORTED_OS = "an unknown or not supported OS",
        this.BROWSER = this.searchBrowser() || this.UNKNOWN_OR_NOT_SUPPORTED_BROWSER,
        this.BROWSER_VERSION = this.searchBrowserVersion() || this.UNKNOWN_BROWSER_VERSION,
        this.OS_VERSION = this.searchOSVersion() || this.UNKNOWN_OS_VERSION,
        this.OS = this.searchOS() || this.UNKNOWN_OR_NOT_SUPPORTED_OS
    },
    isMobile: function() {
        return this.IS_IOS || this.IS_ANDROID || this.IS_WINDOWS_MOBILE || this.IS_BLACKBERRY || this.IS_SONYERICSSON || this.IS_SYMBIAN_OS || this.IS_WEB_OS || this.IS_OPERA_MINI || this.IS_DOLFIN
    },
    searchBrowser: function() {
        if (this.isMobile()) {
            if (this.IS_WEBKIT_MOBILE)
                return this.WEBKIT_MOBILE;
            if (this.IS_IE_MOBILE)
                return this.IE_MOBILE;
            if (this.IS_OPERA_MINI)
                return this.OPERA_MINI;
            if (this.IS_DOLFIN)
                return this.DOLFIN
        } else {
            if (this.IS_OP)
                return this.OP;
            if (this.IS_IE)
                return this.IE;
            if (this.IS_EDGE)
                return this.EDGE;
            if (this.IS_FF)
                return this.FF;
            if (this.IS_CR)
                return this.CR;
            if (this.IS_SF)
                return this.SF
        }
    },
    searchBrowserVersion: function() {
        if (this.isMobile()) {
            var a = {
                chrome: this.UNKNOWN_BROWSER_VERSION,
                samsung: this.UNKNOWN_BROWSER_VERSION,
                webview: this.UNKNOWN_BROWSER_VERSION,
            };
            return this.IS_CR && null != k_ua.match(/(Chrome|CriOS)\/([0-9\.]+)/i) && (a.chrome = parseFloat(k_ua.match(/(Chrome|CriOS)\/([0-9\.]+)/i)[2])),
            this.IS_SAMSUNG && null != k_ua.match(/SamsungBrowser\/([0-9\.]+)/i) && (a.samsung = parseFloat(k_ua.match(/SamsungBrowser\/([0-9\.]+)/i)[1])),
            this.IS_WEBKIT_MOBILE && null != k_ua.match(/Version\/([0-9\.]+)/i) && (a.webview = parseFloat(k_ua.match(/Version\/([0-9\.]+)/i)[1])),
            a
        }
        if (this.IS_IE) {
            if ("Microsoft Internet Explorer" == navigator.appName)
                return parseFloat(k_ua.match(/MSIE ([0-9\.]+)/i)[1]);
            if ("Netscape" == navigator.appName) {
                var b = new RegExp("trident/.*rv[ :]([0-9]{1,}[.0-9]{0,})");
                if (null != b.exec(k_ua))
                    return parseFloat(RegExp.$1)
            }
            return -1
        }
        return this.IS_EDGE ? parseInt(k_ua.match(/Edge\/([0-9\.]+)/i)[1]) : this.IS_CR ? parseFloat(k_ua.match(/Chrome\/([0-9\.]+)/i)[1]) : this.IS_SF ? parseFloat(k_ua.match(/Version\/([0-9\.]+)/i)[1]) : this.IS_OP ? parseFloat(k_ua.match(/Version\/([0-9\.]+)/i)[1]) : this.IS_FF ? parseFloat(k_ua.match(/Firefox\/([0-9\.]+)/i)[1]) : void 0
    },
    searchOSVersion: function() {
        if (this.isMobile()) {
            if (this.IS_IOS)
                return parseFloat(k_ua.match(/OS ((\d+_?){2,3})\s/i)[1].replace(/_/g, "."));
            if (this.IS_ANDROID)
                return parseFloat(k_ua.match(/Android ([0-9\.]+)/i)[1]);
            if (/Windows Phone/i.test(k_ua))
                return parseFloat(k_ua.match(/Windows Phone ([0-9\.]+)|Windows Phone OS ([0-9\.]+)/i)[0].match(/[0-9\.]+/));
            if (this.IS_SYMBIAN_OS)
                return parseFloat(k_ua.match(/SymbianOS\/([0-9\.]+)/i)[1]);
            if (this.IS_WEB_OS)
                return parseFloat(k_ua.match(/webOS\/([0-9\.]+)/i)[1])
        } else if (this.IS_WIN)
            return parseFloat(k_ua.match(/Windows NT ([0-9\.]+)/i)[1])
    },
    searchOS: function() {
        if (this.isMobile()) {
            if (this.IS_IOS)
                return this.IOS;
            if (this.IS_ANDROID)
                return this.ANDROID;
            if (this.IS_WINDOWS_MOBILE)
                return this.WINDOWS_MOBILE;
            if (this.IS_BLACKBERRY)
                return this.BLACKBERRY;
            if (this.IS_SONYERICSSON)
                return this.SONYERICSSON;
            if (this.IS_SYMBIAN_OS)
                return this.SYMBIAN_OS;
            if (this.IS_WEB_OS)
                return this.WEB_OS
        } else {
            if (this.IS_WIN)
                return this.WIN;
            if (this.IS_MAC)
                return this.MAC
        }
    },
    checkAgent: function(a) {
        return 10 === a ? !(!this.IS_WIN || !this.IS_IE || 8 == this.searchBrowserVersion()) : 20 === a ? !(!this.IS_WIN || !this.IS_IE) : 30 === a ? !(!this.IS_WIN || !this.IS_IE && !this.IS_CR) : 40 === a ? !(!this.IS_WIN || !(this.IS_IE || this.IS_CR || this.IS_SF)) : 45 === a ? !(!this.IS_WIN || !(this.IS_IE || this.IS_SF || this.IS_OP)) : 50 === a ? !(!this.IS_WIN || !(this.IS_IE || this.IS_CR || this.IS_SF || this.IS_OP)) : 60 === a ? !(!this.IS_WIN || !(this.IS_IE || this.IS_CR || this.IS_SF || this.IS_FF)) : 80 === a ? !(!this.IS_WIN || !(this.IS_IE || this.IS_FF || this.IS_CR || this.IS_SF || this.IS_OP)) : 90 === a && !!(this.IS_IE || this.IS_FF || this.IS_CR || this.IS_SF || this.IS_OP)
    },
    hasFP: function() {
        if (navigator.plugins && navigator.mimeTypes.length) {
            var a = navigator.plugins["Shockwave Flash"];
            if (a && a.description)
                return !0
        } else
            try {
                var b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                if (null != b)
                    return !0
            } catch (c) {}
        return !1
    }
};
AgentDetect.init();

_kglobal.device_type = AgentDetect.isMobile() ? "device-type-mobile" : "device-type-pc";
_kglobal.device_version = "device-version-"+AgentDetect.searchBrowserVersion();
_kglobal.os_type = "os-"+AgentDetect.searchOS();
_kglobal.os_version = "os-"+AgentDetect.searchOSVersion();
document.getElementsByTagName("html")[0].setAttribute("class", _kglobal.device_type + " " + _kglobal.device_version + " " + _kglobal.os_type + " " + _kglobal.os_version);
//document.querySelector(".log").innerHTML = _kglobal.device_type + " " + _kglobal.device_version + " " + _kglobal.os_type + " " + _kglobal.os_version;
/********************************************************************************************************************************
 * resize
*********************************************************************************************************************************/
function resize() {
    _kglobal.w = window.innerWidth;
    _kglobal.h = window.innerHeight;
}
function scrollHandler(){
    var scrollTop = $(window).scrollTop();
    if(scrollTop > 30){
        $("html").addClass("fixed");
    }else{
        $("html").removeClass("fixed");
    }
}
// input clear button 추가
$(function (){
    //input 텍스트 길이 체크
    $(".k-input-search input").keyup((e)=>{
        var input = $(e.currentTarget).parent().find("input");
        if(input.val().length > 0) input.addClass("on");
        if(input.val().length == 0) input.removeClass("on");
    });
    //clear 버튼 클릭
    $(".k-input-search .clear").click((e)=>{
        $(e.currentTarget).parent().find("input").val("").removeClass("on");
    });
});
// a7000 관리현황 - 격리해제일 refresh button
$(function (){
    $(".icon-time-refresh").click((e)=>{
        $(e.currentTarget).addClass("on");
        setTimeout(()=>{ $(e.currentTarget).removeClass("on");}, 500);
    });
});
// 이벤트 설정
$(function () {
    $(window).resize(resize);
    resize();

    $(window).scroll(scrollHandler);
    scrollHandler();

    //로컬 테스트 코드
    if(_kglobal.dev){
        $(".k-header .header-item.right").click(function () {
        window.location.reload();
        });
        var path = location.href;
        path = path.split("?").length > 0 ? path.split("?")[0] : path;
        $(".k-head .header-item.center").click(function (){
            location.href = path + "?data=" + Math.floor(Math.random()*100000) ;
        });
    }

    //로컬 테스트 코드
    if(_kglobal.dev){
        $(".k-head .header-item.left button").click(function (){
            //history.back();
        });
    }
});

// 로컬 테스트 코드
function requestData($url, $request, $complete, $error){
    var ajax = $.ajax({
        type:"get",
        //dataType:"json",
        url:$url,
        async: true,
        crossDomain:true,
        //data :$request,
        success : function(data) {
            var d = data;
            //console.log(d);
            $complete(data);
        },
        error : function(err) {
            try {console.warn("err")} catch (e) {}
            try {console.log(err)} catch (e) {}
        }
    });
}
// 로컬 테스트 코드
try{
    //if(_kglobal.dev) requestData("./local.js", null, function localComplete(data){/*log("localComplete1");*/});
}catch(e){}

// 로컬 테스트 코드
function log(a, b, c, d, e, f, g){
    if(_kglobal.dev){
        console.log(a, b, c, d, e, f, g)
    }
}








/*******************************************************************************************
 * a7031 서명
********************************************************************************************/
function add(){
	var arr = [];
	var value = document.getElementById("log").value;
	for(var i = 0;i<value.split("/").length;i++){
		var lines = value.split("/")[i];
		arr[i] = [];
		for(var j = 0;j<lines.split("-").length-1;j++){
			var pos = lines.split("-")[j].split(",");
			var tx = Number(pos[0]);
			var ty = Number(pos[1]);
			arr[i][j] = [tx, ty]
		}
	}
	_draw.add('canvas_output', arr);
}
/*******************************************************************************************
 * reset
********************************************************************************************/
function reset(){
	document.getElementById("log").value = "";
	_draw.reset('canvas_input');
	_draw.reset('canvas_output');
}

function log(){
	document.getElementById("log").value = "";
	var str = "";
	for(var i =0;i<_draw._posArray.length;i++){
		if(i != 0) str +="/"
		for(var j = 0;j<_draw._posArray[i].length;j++){
			var p = _draw._posArray[i][j];
			str += p[0] + "," + p[1] + "-";
		}
	}
	document.getElementById("log").value = str;
}


/*******************************************************************************************
 * Draw
********************************************************************************************/
function Draw(){
	this._draw = false;
	this._count = 0;
	this._posArray = [];
	this._drawIndex = 0;
	this.canvas_input;
	this.context_input;
	this.canvas_output;
	this.context_output;
    this.touch;
    
	this.init();
}
Draw.prototype.add = function ($canvas, $arr){
    var canvas_output = document.getElementById($canvas);
	context_output.fillStyle = "#fff";
	context_output.fillRect(0, 0, canvas_output.width, canvas_output.height);
	for(var i =0;i<$arr.length;i++){
		var ball = new Ball();
		for(var j = 0;j<$arr[i].length;j++){
			var p = $arr[i][j];
			ball.x = p[0];
			ball.y = p[1];
			ball.draw(context_output);
		}
	}
}
Draw.prototype.reset = function ($canvas){
	this._count = 0;
	this._posArray.length = 0;
	this._drawIndex = 0;
	this._draw = false;
	var canvas = document.getElementById($canvas);
    var context = canvas.getContext('2d');
    context.clearRect(0,0,window.innerWidth, window.innerHeight);
    $(".canvas-wrap").removeClass("on");
}
Draw.prototype.init = function (){
	var _this = this;
    this.canvas_input = document.getElementById('canvas_input');
    this.canvas_input.width = window.innerWidth; 
    this.canvas_input.height = window.innerHeight;
    
    this.context_input = this.canvas_input.getContext('2d');
    this.touch = utils.captureTouch(this.canvas_input);
	this.context_input.fillStyle = "rgba(255,255,255,0)";
	this.context_input.fillRect(0, 0, canvas_input.width, canvas_input.height);
	var ball;

	var body_scrollLeft = document.body.scrollLeft;
	var element_scrollLeft = document.documentElement.scrollLeft;
	var body_scrollTop = document.body.scrollTop;
	var element_scrollTop = document.documentElement.scrollTop;
	var offsetLeft = canvas_input.offsetLeft;
	var offsetTop = canvas_input.offsetTop;
	
	this.canvas_input.addEventListener('touchstart', function (event) {
		event.preventDefault();
		if(_this._count > 0){
			_this.drawnext();
		}else{
			_this.drawstart();
		}
	}, false);
	this.canvas_input.addEventListener('touchend', function (event) {
		event.preventDefault();
		log();
	}, false);

	var p = {x:0, y:0}
	this.canvas_input.addEventListener('touchmove', function (event) {
		event.preventDefault();
		var x, y;
		var touch_event = event.touches[0];
		if (touch_event.pageX || touch_event.pageY) {
			x = touch_event.pageX;
			y = touch_event.pageY;
		} else {
			x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
			y = touch_event.clientY + body_scrollTop + element_scrollTop;
		}
		_this.ball.x = x;
		_this.ball.y = y;
		_this.ball.draw(_this.context_input);
		_this._posArray[_this._drawIndex].push([x,y]);
		p.x = x;
		p.y = y;
		_this._count++;
	}, false);	
};
Draw.prototype.drawstart = function (){
	this.ball = new Ball();
	this._count = 0;
	this._draw = true;
	this._drawIndex = 0;
	this._posArray.length = 0;
	this._posArray[this._drawIndex] = [];
}
Draw.prototype.drawnext = function (){
	this.ball = new Ball();
	this._drawIndex++;
	this._posArray[this._drawIndex] = [];
}
/*******************************************************************************************
 * Ball
********************************************************************************************/
function Ball () {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.color = "rgba(0, 0, 0, 1.0)";
	this.lineWidth = 10;
	this.prevx = 0;
	this.prevy = 0;
}
Ball.prototype.draw = function (context) {
	context.save();
	context.translate(0, 0);
	context.rotate(this.rotation);
	context.scale(this.scaleX, this.scaleY);
    context.beginPath();
    context.lineCap = "round";
	context.lineWidth = this.lineWidth;
	context.strokeStyle = "black";
	if(this.prevx != 0) context.moveTo(this.prevx, this.prevy);
	var dx = this.prevx-this.x;
	var dy = this.prevy-this.y;
	var dx = this.prevx + this.x-this.prevx;
	var dy = this.prevy + this.y-this.prevy;
	context.quadraticCurveTo(dx, dy,this.x,this.y)
	//context.closePath();
	context.stroke();
	context.restore();
	context.save();
	context.translate(0, 0);
	context.rotate(this.rotation);
	context.scale(this.scaleX, this.scaleY);
	//context.shadowBlur = 15;
	//context.shadowColor = "rgba(0, 0, 0, 0.5)";
	context.arc(this.x,this.y, 5, 0, Math.PI * 2, true);
	context.fillStyle = "black";
	context.fill();
	context.restore();
	this.prevx = this.x;
	this.prevy = this.y;
};
window.utils = {};
window.utils.captureTouch = function (element) {
    var touch = {
            x: null,
            y: null,
            isPressed: false,
            event: null
        },
        body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;
    element.addEventListener('touchstart', function (event) {
        touch.isPressed = true;
        touch.event = event;
    }, false);
    element.addEventListener('touchend', function (event) {
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
        touch.event = event;
        //
        $(".canvas-wrap").addClass("on");
        try{
            document.getElementsByClassName('canvas_output')[0].src = document.getElementById('canvas_input').toDataURL();
        }catch(e){}
    }, false);
    element.addEventListener('touchmove', function (event) {
        var x,
            y,
            touch_event = event.touches[0]; // first touch

        if (touch_event.pageX || touch_event.pageY) {
            x = touch_event.pageX;
            y = touch_event.pageY;
        } else {
            x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
            y = touch_event.clientY + body_scrollTop + element_scrollTop;
        } x -= offsetLeft;
        y -= offsetTop;
        touch.x = x;
        touch.y = y;
        touch.event = event;
    }, false);

    return touch;
};
var _draw
setTimeout(() => {
    try{
        _draw = new Draw();
    }catch(e){}
}, 100);
