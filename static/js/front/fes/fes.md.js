/* VIEWPORT_WIDTH&HEIGHT */
FES.MD.VIEWPORT = function(){
	if(FES.UI.elem.$html.hasClass('safari')) {
		FES.VARS.VIEWPORT_WIDTH = Math.max( FES.UI.elem.$win.width() || 0);
	} else {
		FES.VARS.VIEWPORT_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
	FES.VARS.VIEWPORT_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

FES.MD.CHK_DEVICE = function() {
	var mobileInfo = ['Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson'];
	$.each(mobileInfo, function(index){
		if (navigator.userAgent.match(mobileInfo[index]) !== null){
			FES.VARS.IS_HAND_DEVICE = true;
			FES.VARS.IS_MOBILE = true;
		}
	});

	if(FES.VARS.VIEWPORT_WIDTH < FES.VARS.IS_SIZE.MAXMOBILE && FES.VARS.IS_HAND_DEVICE){
		FES.VARS.IS_VIEWTYPE = 'mobile';
	} else if(FES.VARS.VIEWPORT_WIDTH < FES.VARS.IS_SIZE.MAXTABLET && FES.VARS.IS_HAND_DEVICE){
		FES.VARS.IS_VIEWTYPE = 'tablet';
	} else {
		if(FES.VARS.VIEWPORT_WIDTH < FES.VARS.IS_SIZE.MAXMOBILE ) {
			FES.VARS.IS_VIEWTYPE = 'mobile';
		} else if (FES.VARS.VIEWPORT_WIDTH < FES.VARS.IS_SIZE.MAXTABLET ) {
			FES.VARS.IS_VIEWTYPE = 'tablet';
		} else {
			FES.VARS.IS_VIEWTYPE = 'web';
		}
	}

	/*if(FES.VARS.VIEWPORT_WIDTH <= FES.VARS.IS_SIZE.MAXMOBILE && FES.VARS.IS_HAND_DEVICE){
		FES.VARS.IS_VIEWTYPE = 'mobile';
	} else {
		if(FES.VARS.VIEWPORT_WIDTH <= FES.VARS.IS_SIZE.MAXMOBILE ) {
			FES.VARS.IS_VIEWTYPE = 'mobile';
		} else {
			FES.VARS.IS_VIEWTYPE = 'web';
		}
	}*/

	/* IS_TABLET check 추가 */

	if(FES.VARS.VIEWPORT_WIDTH >= FES.VARS.IS_SIZE.MAXMOBILE && FES.VARS.IS_MOBILE) {
		FES.VARS.IS_MOBILE = false;
		FES.VARS.IS_TABLET = true;
	}

	FES.VARS.IS_HAND_DEVICE ? $('html').addClass('handy') :$('html').addClass('no-handy');
	//console.log(FES.VARS.IS_VIEWTYPE);
};


/**
 * $target 안 Focus First, last Element return
 * return : Object type
 * el_firstFocus : first Element
 * el_lastFocus : last Element
 * */
FES.MD.FOCUSABLE = function( $target, justVisible ){
	var focusable = [];
	var focusableObj = {};
	focusableObj.el_firstFocus = null;
	focusableObj.el_lastFocus = null;

	$target.find('*').each(function(i, val) {
		if(val.tagName.match(/^A$|AREA|INPUT|TEXAREA|SELECT|BUTTON/gim) && parseInt(val.getAttribute("tabIndex")) !== -1 && ($(val).css('display') !== 'none') && ($(val).parent().css('display') !== 'none') ) {

			if( $(val).is(':disabled') ){
				return;
			}

			if( justVisible ){
				$(val).is(':visible') && focusable.push(val);
			} else {
				focusable.push(val);
			}
		}
		if((val.getAttribute("tabIndex") !== null) && (parseInt(val.getAttribute("tabIndex")) >= 0) && (val.getAttribute("tabIndex", 2) !== 32768) ) {
			if( justVisible ){
				$(val).is(':visible') && focusable.push(val);
			} else {
				focusable.push(val);
			}
		}
	});
	focusableObj.el_firstFocus = focusable[0];
	focusableObj.el_lastFocus = focusable[focusable.length-1];
	return focusableObj;
};

/* CALLBACK DELAY FUNC */
FES.MD.DELAY_FUNC = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

/* checkbox 전체 체크 및 해제 */
FES.MD.checkInputAllBinding = function ($all, $items, reverse) {
	var itemLen = $items.length - $items.filter(':disabled').length;
	reverse = reverse || false;
	$all.on('change.all.all',function () {
		var state = $(this).prop('checked');
		if(reverse){
			state = !state;
		}
		$items.each(function () {
			if( !$(this).is('[disabled]') ) {
				$(this).prop('checked', state);
			}
		})
	});

	$items.on('change.all.item', function () {
		var state = (itemLen === $items.filter(':checked').length) ? true : false;
		if(reverse){
			state = !state;
		}
		$all.prop('checked', state);
	});
};



/** @preserve
 * 브라우저 체크
 * callback:function
 * params:parameter
 * callback 없을시에 html에 해당 브라우저 class 추가
 * */
FES.MD.getBrowser = function( callback, params ){
	var agent = navigator.userAgent.toLowerCase(),
		name = navigator.appName,
		browser;

	// MS 계열 브라우저를 구분하기 위함.
	if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
		browser = 'ie';
		if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
			agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
			browser += parseInt(agent[1]);
		} else { // IE 11+
			if(agent.indexOf('trident') > -1) { // IE 11
				browser += 11;
			} else if(agent.indexOf('edge/') > -1) { // Edge
				browser = 'edge';
			}
		}
	} else if(agent.indexOf('safari') > -1) { // Chrome or Safari
		if(agent.indexOf('opr') > -1) { // Opera
			browser = 'opera';
		} else if(agent.indexOf('chrome') > -1) { // Chrome
			browser = 'chrome';
		} else { // Safari
			browser = 'safari';
		}
	} else if(agent.indexOf('firefox') > -1) { // Firefox
		browser = 'firefox';
	}

	// IE: ie7~ie11, Edge: edge, Chrome: chrome, Firefox: firefox, Safari: safari, Opera: opera
	//document.getElementsByTagName('html')[0].className = browser;
	if( typeof callback === 'function') {
		callback( params );
	} else {
		FES.UI.elem.$html.addClass(browser);
	}
	return browser;
};

FES.MD.SETCOOKIE = function ( name, value, expirehours ) {
	var date = new Date();
	date.setDate( date.getDate() + expirehours );
	document.cookie = name + "=" +escape( value ) + "; path=/; expires=" + date.toGMTString() + ";"
}
