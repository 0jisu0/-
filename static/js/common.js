var GV_THOUSAND_SPRAT = ",", GV_DECIMAL_SPRAT = ".", GV_DATE_FORMAT = 'YYYY-MM-DD';
$(function() {

	// form tag enter refresh disable
	$("form").submit(function() { return false; });

	$(".text_disable").each(function(i, item) {
		ComUtils.setReadOnly($(item), true);
	});

	$(document).on( 'keyup', '.text_uppercase', function(e){
		$( this ).val($( this ).val().toUpperCase());
	});

	$(document).on( 'keyup', '.text_lowercase', function(e){
		$( this ).val($( this ).val().toLowerCase());
	});

	$(document).on('keydown keyup', '.text_text_name', function(){
		$(this).val( $(this).val().replace(/[^ㄱ-힣a-zA-Z\s]/gi,"") ); //한글,영어,띄어쓰기
	});
	/*  keyup keypress */
	$(document).on('keydown keyup', '.text_float, .text_price, .text_number, .text_only_number', function(e){
		var allowKey = [
			8,   /* backspace */
			9,   /* tab */
			46,  /* del */
			48,  /* 0 */
			49,  /* 1 */
			50,  /* 2 */
			51,  /* 3 */
			52,  /* 4 */
			53,  /* 5 */
			54,  /* 6 */
			55,  /* 7 */
			56,  /* 8 */
			57,  /* 9 */
			17,  /* control */
			45,  /* - */
			189, /* _ */
			/* keypad */
			96,  /* 0 */
			97,  /* 1 */
			98,  /* 2 */
			99,  /* 3 */
			100, /* 4 */
			101, /* 5 */
			102, /* 6 */
			103, /* 7 */
			104, /* 8 */
			105, /* 9 */
			/* arrow key */
			37,  /* left */
			38,  /* up */
			39,  /* right */
			40,  /* down */
			144,
		];
		var allow = false;

		// Allow Key check [0-9, -, ...]
		for (var i in allowKey) {
			if (e.keyCode == allowKey[i]) {
				allow = true;
			}
		}

		// Decimal separator Allow
		if ($(e.target).hasClass("text_price") || $(e.target).hasClass("text_float")) {
			if (e.key == GV_DECIMAL_SPRAT) {
				allow = true;
			}
		}

		// Control Key Allow
		var ctrlDown = (e.ctrlKey||e.metaKey);
		if (ctrlDown && (
			ComUtils.nvl(e.key).toUpperCase() == "C"
			|| ComUtils.nvl(e.key).toUpperCase() == "V"
			|| ComUtils.nvl(e.key).toUpperCase() == "X"
			|| ComUtils.nvl(e.key).toUpperCase() == "A"
		)) {
			allow = true;
		}

		//console.log("e.type = " + e.type + " Control = " + (e.ctrlKey||e.metaKey) + " e.keyCode = " + e.keyCode + " allow = " + allow + "   " + e.key);

		if (!allow) {
			e.keyCode = 0;
			e.preventDefault();
		}

		$(e.target).val($(e.target).val().replace(/[\ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi,''));

	});
	
	$(document).on('keydown keyup blur', '.text_mobile_number', function(e){
		var s = "", n = $(this).val().replace(/[^0-9]/g, "");
		if (n.length < 4) {
			s = n;
		} else if (n.length < 7) {
			s = n.substr(0, 3) + '-' + n.substr(3);
		} else if (n.length < 11) {
			s = n.substr(0, 3) + '-' + n.substr(3, 3) + '-' + n.substr(6);
		} else {
			s = n.substr(0, 3) + '-' + n.substr(3, 4) + '-' + n.substr(7);
		}
		$(this).val(s);
		if("010 011 016 017 019".indexOf(s.substr(0, 3)) > -1) {
			$(this).parents(".t-form__row").find(".error-msg").hide();
		} else {
			$(this).parents(".t-form__row").find(".error-msg").show();
		}
	});
	
	$(document).on("keydown keyup blur", ".text_body_temp", function(e) {
		this.value = this.value.substr(0, 4);
		if(this.value.length == 0 || (this.value >= 35 && this.value <= 43)) {
			$(this).parents(".t-form__row").find(".error-msg").hide();
		} else {
			$(this).parents(".t-form__row").find(".error-msg").show();
		}
	});

	$(document).on('blur', '.text_number, .text_float, .text_price', function(e){
		$(this).val(ComUtils.numberWithCommas(this));
	});

	$(document).on('focus', '.text_number, .text_float, .text_price', function(e){
		var num = ComUtils.getValue(this);
		num = num.replace(".", GV_DECIMAL_SPRAT);
		$(this).val(num);
	});
	
	

	$(".__jqueryDate").each(TimeUtils.makejQueryDate);
	$(".__jqueryTime").each(TimeUtils.makejQueryTime);

	// datepicker range >>>
	$("[data-js=range-start]").on("change", function() {
		$(this).siblings("[data-js=range-end]").datepicker("option", "minDate", TimeUtils.toDate(TimeUtils.getDate(this.id)));
	});
	$("[data-js=range-end]").on("change", function() {
		$(this).siblings("[data-js=range-start]").datepicker("option", "maxDate", TimeUtils.toDate(TimeUtils.getDate(this.id)));
	});
	// datepicker range <<<

});

//-----------------------------------------------------------------------------
// 문자의 좌, 우 공백 제거
// @return : String
//-----------------------------------------------------------------------------
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

//-----------------------------------------------------------------------------
// 문자의 좌 공백 제거
// @return : String
//-----------------------------------------------------------------------------
String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/, "");
}

//-----------------------------------------------------------------------------
// 문자의 우 공백 제거
// @return : String
//-----------------------------------------------------------------------------
String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/, "");
}

String.prototype.lpad = function(totalLen,strReplace){
	var strAdd  = "";
	var diffLen = totalLen - this.length;

	for(var i = 0; i < diffLen; ++i)
		strAdd += strReplace;

	return strAdd + this;
};

String.prototype.zf = function(len){
	return this.lpad(len, '0');
};

String.prototype.replaceAll = function(arg1, arg2){
	return this.split(arg1).join(arg2);
};

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(searchString, position) {
		var subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

Number.prototype.zf = function(len){
	return this.toString().lpad(len, '0');
};

function setAutoCompleteOFF(tm){
//  $("input").attr("autocomplete", "new-password");
	$('input, :input').attr('autocomplete', 'new-password');
	$(document).on('focus', ':input', function() {
		$(this).attr('autocomplete', 'new-password');
	});
}

/**
 * 공통 자바스크립트 함수
 */
var ComUtils = {
	loadTemplate : function (id) {
		return document.getElementById(id).innerHTML;
	},
	isPersonalNumber : function(personalId) {
		var checkFrnNum = personalId.substr(6,1); 
		if(checkFrnNum === '1' ||checkFrnNum === '2'
				||checkFrnNum === '3' || checkFrnNum === '4') {
			var regExp = /[0-9]{2}(0[1-9]|1[012])(0[1-9]|1[0-9]|2[0-9]|3[01])-?[012349][0-9]{6}/;
			if (regExp.test(personalId)) {
				var sum = 0;
				for (var i = 0; i < 12; i++){
					sum += personalId.charAt(i)*(i < 8 ? i+2:i-6);
				}
				var result = (11 - (sum % 11)) % 10;
			    if(result == personalId.charAt(12)) {
					return true; 
				} else { 
					return false; 
				}
			} else {
				return false; 
			} 
		} else {
		    var checkSum = 0;
		    for(var i=0; i<12; i++) checkSum += ((personalId.substr(i,1)>>0)*((i%8)+2));
		 
		    var modCheckSum = checkSum%11;
		    var frnMatch = (13-(modCheckSum))%10 == personalId.substr(12,1);
		    
	        return frnMatch;
		} 
	},
	getPatntAge : function(birth) {
		var date = new Date();
	    var year = date.getFullYear();
	    var month = (date.getMonth() + 1);
	    var day = date.getDate();       
	    if (month < 10) month = '0' + month;
	    if (day < 10) day = '0' + day;
	    var monthDay = month + day;
	    birth = birth.replace('-', '').replace('-', '');
	    var birthdayy = birth.substr(0, 4);
	    var birthdaymd = birth.substr(4, 4);
	    var age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;
	    return age;
	},
	rgb2hex : function (rgb) {
		if (  rgb.search("rgb") == -1 ) {
			return rgb;
		} else {
			rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
			function hex(x) {
				return ("0" + parseInt(x).toString(16)).slice(-2);
			}
			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
	},
	toBase64 : function (str) {
		return btoa(unescape(encodeURIComponent(str)));
	},
	fromBase64 : function (str) {
		return decodeURIComponent(escape(window.atob(str)));
	},
	isEmpty : function(arg){
		try {
			if (arg == null || arg == undefined || (arg + "")/*.trim()*/ == "") return true;
			else return false;
		} catch (e) {
			return true;
		}
	}
	, removeTag : function (html, isChangeSpace) {
		isChangeSpace = ComUtils.nvl(isChangeSpace, false);
		if (isChangeSpace) {
			return this.nvl(html).toString().replace(/(<([^>]+)>)/gi, " ");
		} else {
			return this.nvl(html).toString().replace(/(<([^>]+)>)/gi, "");
		}
	}
	, nvl : function(arg, defaultStr){
		if (this.isEmpty(arg)) {
			if (this.isEmpty(defaultStr)) {
				return "";
			} else {
				return defaultStr;
			}
		} else {
			return arg;
		}
	}
	, nvl2 : function(data, value, defaultValue){
		if(!ComUtils.isEmpty(data)){
			return value;
		}else{
			return defaultValue;
		}
	}
	, getObj : function (id) {
		var item;
		if (typeof id == "string") {
			if (id.substr(0, 1) == "#") {
				item = $(id);
			} else {
				item = $("#" + id);
			}

			// 존재하지 않는 경우 이름으로 찾기
			if (item.length <= 0) {
				item = $("input[name="+id+"]");
				// $(':radio[name="radioSwitch"]:checked').val();
			}
		} else {
			item = id;
		}
		return item
	}
	, mergeJSON : function (json1, json2) {
		// $.extend 로 대체
		// return Object.assign({},json1, json1);
		return $.extend(json1, json2);
	}
	, getParams : function (id) {
		var formData;
		var form = this.getObj(id);
		var isFile = $(form).find(":file").length > 0;
		if (isFile) {
			formData = new FormData();
		} else {
			formData = {};
		}

		$(form).find("input, select, textarea, hidden, radio").each(function(i, item) {
			var name = ComUtils.nvl($(item).attr("name"), $(item).attr("id"));
			if(name.length > 0) {
				if (isFile) {
					if (ComUtils.getType( item ) == "file") {
						for(var i=0; i< $(item)[0].files.length; i++) {
							formData.append(name, $(item)[0].files[i]);
						}
					} else {
						if(ComUtils.getType( item ) == 'text'){
							item.value = item.value.replace(/</gi,"&lt").replace(/>/gi,"&gt").replace(/\n/gi,"<br>");
						} 
						formData.append(name, ComUtils.getValue(item));
						
					}
				} else {
					if(ComUtils.getType( item ) == 'text'){
						item.value = item.value.replace(/</gi,"&lt").replace(/>/gi,"&gt").replace(/\n/gi,"<br>");
					}
					formData[name] = ComUtils.getValue(item);
				}
			}
		});
		return formData;
	}
	, clearForm : function (id) {
		var form = this.getObj(id);
		$(form).find("a, input, select, textarea, hidden, span, img").each(function(i, item) {
			$(this).removeClass("errorBox");
			//type이 radio인경우는 value 초기화 안함
			if(item.type != 'radio'){
				if($(this).attr('class') != 'required'){
					ComUtils.setValue($(this), "");
				}
			}else{
				var radioName = $(item).attr("name");
				$('input:radio[name='+radioName+']').removeAttr("checked");
				$('input:radio[name='+radioName+']:input[value=N]').prop("checked", true);
			}

			if (!ComUtils.isEmpty(item.src) && item.className.indexOf('ui-datepicker-trigger') != 0) {
				FileUtils.setImgFile(item.id,'');
			}
		});

		$(".register-info__info").empty();
	}
	, setDataMapping : function(id, jsonData) {
		var form = this.getObj(id);
		if (this.isEmpty(jsonData)) {
			jsonData = {};
		}
		$(form).find("a, input, select, textarea, hidden").each(function(i, item) {
			var key = $(item).attr("id");
			if(item.type != 'radio'){
				if (!ComUtils.isEmpty(key)) {
					ComUtils.setValue(item, ComUtils.nvl(jsonData[key]));
				}
			}else{
				//input type이 radio인 경우 Mapping.
				var radioName = $(item).attr("name");
				$('input:radio[name='+radioName+']').removeAttr("checked");
				$('input:radio[name='+radioName+']:input[value="' + ComUtils.nvl(jsonData[radioName]) + '"]').prop("checked", true);
			}
		});

		$(".register-info__info").empty();
		if($(".register-info").length > 0) {
			$(".register-info__info:eq(0)").text(ComUtils.nvl(jsonData["registerId"]));
			$(".register-info__info:eq(1)").text(ComUtils.nvl(jsonData["registDt"]));
			$(".register-info__info:eq(2)").text(ComUtils.nvl(jsonData["updusrId"]));
			$(".register-info__info:eq(3)").text(ComUtils.nvl(jsonData["updtDt"]));
		}
	}
	, setTableDataMapping : function(id, jsonData){
		var form = this.getObj(id);
		if (this.isEmpty(jsonData)) {
			jsonData = {};
		}
		$(form).find("a, input, select, textarea, hidden, td, span").each(function(i, item) {
			var key = $(item).attr("id");

			var tagName = $(item).prop("tagName");
			if(tagName == 'TD'){
				if (!ComUtils.isEmpty(jsonData[key])) {
					$("#"+key).text(ComUtils.nvl(jsonData[key]));
				}
			}else if(tagName.toLowerCase() == 'span'){
				if (!ComUtils.isEmpty(jsonData[key])) {
					$("#"+key).text(ComUtils.nvl(jsonData[key]));
				}
			}else{
				if(item.type != 'radio'){
					if (!ComUtils.isEmpty(key) && ComUtils.nvl(jsonData[key])) {
						ComUtils.setValue(item, ComUtils.nvl(jsonData[key]));
					}
				}else{
					//input type이 radio인 경우 Mapping.
					var radioName = $(item).attr("name");
					$('input:radio[name='+radioName+']').removeAttr("checked");
					$('input:radio[name='+radioName+']:input[value="' + ComUtils.nvl(jsonData[radioName]) + '"]').prop("checked", true);
				}
			}


		});

		$(".register-info__info").empty();
		if($(".register-info").length > 0) {
			$(".register-info__info:eq(0)").text(ComUtils.nvl(jsonData["register"]));
			$(".register-info__info:eq(1)").text(ComUtils.nvl(jsonData["registDt"]));
			$(".register-info__info:eq(2)").text(ComUtils.nvl(jsonData["lastModifier"]));
			$(".register-info__info:eq(3)").text(ComUtils.nvl(jsonData["lastUpdatedDt"]));
		}
	}
	, disabledForm : function( id, flag ){
		var form = this.getObj(id);
		$(form).find("a, input, select, textarea, hidden, button").each(function(i, item){
			// ComUtils.setReadOnly($(item), flag);
			if( flag ){
				$(item).attr("disabled", true);
			}else{
				$(item).attr("disabled", false);
			}
		});
	}
	, setValue : function (id, value) {
		var item = this.getObj(id);

		if ($(item).length > 0) {
			var typ = this.getType(item);
			if (typ == "text" || typ == "hidden" || typ == "password") {
				if ($(item).hasClass("__jqueryTime")) {
					TimeUtils.setTime($(item), value);
				} else if ($(item).hasClass("__jqueryDate")) {
					TimeUtils.setDate($(item), value);
				} else if ($(item).hasClass( "text_number" ) || $(item).hasClass( "text_float" ) || $(item).hasClass( "text_price" )) {
					$(item).val(ComUtils.numberWithCommas(value));
				} else {
					$(item).val(value);
				}
			} else if (typ == "select-one") {
				$(item).val(value);
			} else if (typ == "checkbox") {
				$(item).prop('checked', ($(item).val() == value));
				// $(item).prop('checked', !this.isEmpty(value));
			} else if (typ == "textarea") {
				$(item).val(unescape(value).replaceAll("<br>", "\n"));
			} else if (typ == "a" || typ == "label") {
				$(item).text(value);
			} else if (typ == "radio") {
				$('input:radio[name='+id+']').removeAttr("checked");
				$('input:radio[name='+id+']:input[value='+value+']').prop("checked", true);
			}else {
				$(item).val(value);
			}
		}
	}
	, getNumber : function (s) {
		s += ''; // 문자열로 변환
		s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
		if (s == '' || isNaN(s)) {
			return "";
		} else {
			return Number(s) + "";
		}
	}
	, getAttr : function (id, attr) {
		var item = this.getObj(id);
		var typ = this.getType(item);
		var rtnValue = "";
		if (typ == "text" || typ == "hidden" || typ == "password") {
			rtnValue = item.attr(attr);
		} else if (typ == "select-one") {
			rtnValue = item.find("option:selected").attr(attr);
		} else if (typ == "radio") {

		} else if (typ == "checkbox") {

		} else {
			rtnValue = item.attr(attr);
		}

		return rtnValue;
	}
	, getValue : function (id) {
		var item = this.getObj(id);

		var typ = this.getType(item);
		var rtnValue = "";
		if (typ == "text" || typ == "hidden" || typ == "password") {
			if ($(item).hasClass( "__jqueryDate" )) {
				rtnValue = TimeUtils.getDate($(item));
			} else if ($(item).hasClass("__jqueryTime")) {
				rtnValue = TimeUtils.getTime($(item));
			} else if ($(item).hasClass("text_number")) {
				var reg = new RegExp("[^-0-9]", "g");
				rtnValue = $(item).val().replace(reg, '');
				rtnValue = ComUtils.getNumber(rtnValue);
			} else if ($(item).hasClass("text_float") || $(item).hasClass("text_price")) {
				var reg = new RegExp("[^-0-9"+GV_DECIMAL_SPRAT+"]", "g");
				rtnValue = $(item).val().replace(reg, '').replace(GV_DECIMAL_SPRAT, ".");
				rtnValue = ComUtils.getNumber(rtnValue);
				if (!ComUtils.isEmpty(rtnValue)) {
					if ($(item).hasClass("text_float")) {
						//유럽 3차 출장
						rtnValue = Number(rtnValue).toFixed(3);
					} else if ($(item).hasClass("text_price")) {
						rtnValue = Number(rtnValue).toFixed(2);
					}
					rtnValue = ComUtils.getNumber(rtnValue);
				}
			} else {
				rtnValue = $(item).val();
			}
		} else if (typ == "select-one") {
			rtnValue = $(item)[0].value;
			// rtnValue = $("#" + $(item).attr("id") + " > option:selected").val();
		} else if (typ == "radio") {
			rtnValue = $(':radio[name="'+$(item).attr("name")+'"]:checked').val();
			//rtnValue = ($(item)[0].checked) ? $(item)[0].value : "";
		} else if (typ == "checkbox") {
			if ($(item).is(":checked")) {
				rtnValue = $(item).val();
			}
		} else if (typ == "textarea") {
			rtnValue = escape($(item).val().replaceAll("\n", "<br>"));
		} else {
			rtnValue = $(item).val();
		}

		if ($(item).hasClass("not_trim")) {
			return this.nvl(rtnValue);
		} else {
			return this.nvl(rtnValue).trim();
		}
	}
	, trim : function(str) {
		return (str+"").replace(/(^\s*)|(\s*$)/g, "");
	}
	, getType : function (item) {
		try {
			var type = $(item)[0].type;
			if (this.isEmpty(type)) {
				type = $(item)[0].nodeName;
			}
			return type.toLowerCase();
		} catch (e) {
			this.log("Error : " + item);
		}
	}
	, getDefaultValue : function(data, key, defaultValue){
		//data에서 key가 존재하면 해당 key의 value return, key가 없을시 defaultValue retrun
		if(!ComUtils.isEmpty(data) && data.hasOwnProperty(key)){
			return data[key];
		}else{
			return defaultValue;
		}
	}
	, log : function (str) {
		var d = new Date();
		var yyyy = d.getFullYear().toString();
		var MM = this.pad(d.getMonth() + 1,2);
		var dd = this.pad(d.getDate(), 2);
		var hh = this.pad(d.getHours(), 2);
		var mm = this.pad(d.getMinutes(), 2)
		var ss = this.pad(d.getSeconds(), 2)

		var sf = yyyy + "." +  MM + "." + dd + ". " +  hh + ":" + mm + ":" + ss;
		try {
			str = JSON.stringify(str)
		} catch (e) {}
		try {
//			console.log(sf + " : " + str);
		} catch (e) {}
	}
	, pad : function(number, length) {
		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}

		return str;
	}
	,showLayerPopup : function(formId){
		// Layer팝업 띄우기.(add, detail 같이 사용)
		// 화면의 높이와 너비를 변수로 만듭니다.
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();

		// background 높이와 너비를 화면의 높이와 너비 변수로 설정합니다.
		$('#background').css({'width':maskWidth,'height':maskHeight});

		$('#background').fadeTo("slow",0.7);

		// 레이어 팝업을 가운데로 띄우기 위해 화면의 높이와 너비의 가운데 값과 스크롤 값을 더하여 변수로 만듭니다.
		var left =  ( $('#content').width() - $(formId).width()) / 2 + "px";
		var top = ($('#content').height() - $(formId).height()) /2  + "px";
		/*    		var top = (($('#content').height() - $(formId).children().height()) / 2)/2 + "px";*/

		// css 스타일을 변경합니다.
		$(formId).css({'left':left,'top':top, 'position':'absolute'});

		// 레이어 팝업을 띄웁니다.
		$(formId).show();
		$(formId).draggable();
	}
	, closeLayerPopup : function(formId){
		$(formId).hide();
		$('#background').hide();
	}
	, redirect : function (redirectUrl, params) {
		var $form = $('<form></form>');
		$form.attr("method", "post");
		$form.attr("action", redirectUrl);
		if (!this.isEmpty(params) && !$.isEmptyObject(params)) {
			for(var key in params) {
				$form.append($('<input/>', { type: 'hidden', name: key, value: ComUtils.nvl(params[key]) }));
			}
			$form.appendTo('body').submit();
		} else {
			location.replace(redirectUrl);
		}
	}
	, redirectNewTab : function (redirectUrl, params) {

		var $form = $('<form></form>');
		$form.attr("method", "post");
		$form.attr("action", redirectUrl);
		window.open("", "newTab");
		$form.attr("target", "newTab");

		// set search parameters
		if (!$.isEmptyObject(GV_SRCH_PARM)) {
			$form.append( $('<input/>', { type: 'hidden', name: 'srchParm', value: ComUtils.fromJSON(GV_SRCH_PARM) }));
		}

		if (!this.isEmpty(params) && !$.isEmptyObject(params)) {
			for(var key in params) {
				$form.append($('<input/>', { type: 'hidden', name: key, value: ComUtils.nvl(params[key]) }));
			}
			$form.appendTo('body').submit();
		} else if (!$.isEmptyObject(GV_SRCH_PARM)) {
			$form.appendTo('body').submit();
		}
	}
	, setReadOnly : function (id, mode) {
		var item = this.getObj(id);
		var typ = this.getType(item);
		if (mode == true) {
			$(item).css('background', '#f2f2f2');
			$(item).attr("readonly", true);
			$(item).attr("disabled", true);
			$(item).addClass("text_disable");
		} else {
			$(item).css('background', '#ffffff');
			$(item).attr("readonly", false);
			$(item).attr("disabled", false);
			$(item).removeClass("text_disable");
		}

		if ($(item).hasClass("__jqueryDate")) {
			$(item).datepicker((mode == true ? "disable" : "enable"));
		}
	}
	, fromJSON : function (str) {
		return JSON.stringify(str);
	}
	, toJSON : function (str) {
		try {
			str = JSON.parse(str);
		} catch (e) {
		}
		return str;
	}
	, validationCheck : function (id) {
		var alertMsg = "";
		var bResult = true;
		var form = this.getObj(id);

		$(form).find("input, select, textarea").each(function(i, item) {
			ComUtils.normalBox(item);
		});

		$(form).find("input, select, textarea").each(function(i, item) {
			if ($(item).is(":disabled") == true) {
				// return true;
			}

			if ($(item).is("[data-checkRequired]")) {
				if (ComUtils.isEmpty(ComUtils.getValue(item))) {
					ComUtils.errorBox(item);

					if (bResult) {
						$(item).focus();
					}
					bResult = false;
				}
			}

			if ($(item).is("[data-checkEmail]")) {
				var str = ComUtils.getValue(item);
				var regExp = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

				if (!ComUtils.isEmpty(str)) {
					if(str.match(regExp) == null) {
						ComUtils.errorBox(item);

						if (bResult) {
							$(item).focus();
						}

						bResult = false;
					}
				}
			}

			if ($(item).is("[data-checkLength]")) {
				var str = ComUtils.getValue(item);
				if (!ComUtils.isEmpty(str)) {
					var len = $(item).attr("data-checkLength").split("-");
					if (len.length == 1) {
						if (ComUtils.getByteLength(str) != len[0]) {
							alertMsg += $(item).attr("label") + "은(는) "  + len[0] + " 길이 입니다.\n";
							ComUtils.errorBox(item);

							if (bResult) {
								$(item).focus();
							}
							bResult = false;
						}
					} else {
						if (ComUtils.getByteLength(str) < len[0] || ComUtils.getByteLength(str) > len[1]) {
							alertMsg += $(item).attr("label") + "은(는) " + len[0] + "~" + len[1] + " 사이의 길이만 허용합니다.\n";
							ComUtils.errorBox(item);

							if (bResult) {
								$(item).focus();
							}
							bResult = false;
						}
					}
				}
			}

			if ($(item).is("[data-sameCheck]")) {
				var chkId = $(item).attr("data-sameCheck");
				var str = ComUtils.getValue(item);
				var str2 = $("#" + chkId).val();
				if (str != str2) {
					alertMsg += $(item).attr("label") + "and " + $("#" + chkId).attr("label") + " are different.\n";
					ComUtils.errorBox(item);
					ComUtils.errorBox("#" + chkId);

					if (bResult) {
						$(item).focus();
					}
					bResult = false;
				}
			}

			if( $(item).is("[data-checkMaxNum]") ){
				var str = ComUtils.getValue(item);

				if (!ComUtils.isEmpty(str)) {
					var maxNum = Number($(item).attr("data-checkMaxNum"));
					var curNum = Number(str);

					if(maxNum < curNum) {
						alertMsg += "The maximum allowable range is " +maxNum + ".\n";
						ComUtils.errorBox(item);

						if (bResult) {
							$(item).focus();
						}

						bResult = false;
					}
				}
			}

		});

		if (!this.isEmpty(alertMsg)) {
			// this.alertClient(alertMsg, "E");
			ComUtils.alert(alertMsg);
		}

		return bResult;
	}
	, errorBox : function (item) {
		$(item).addClass( "errorBox" );
		/*
		$(item).css('outline-color', '#e4a858');
		$(item).css('outline-style', 'solid');
		$(item).css('outline-width', 'thin');
		*/
	}
	, normalBox : function (item) {
		$(item).removeClass( "errorBox" );
		/*
		$(item).css('outline-color', '');
		$(item).css('outline-style', '');
		$(item).css('outline-width', '');
		*/
	}
	, clearHighlight : function (id) {
		var form = this.getObj(id);

		$(form).find("input, select").each(function(i, item) {
			ComUtils.normalBox(item);
		});
	}
	, toCamelCase : function camalize(str) {
		str = str.toLowerCase().replaceAll("_", " ");
		return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
			if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
			return index == 0 ? match.toLowerCase() : match.toUpperCase();
		});
		// return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
	}
	, callAjax : function (targetUrl, formData, callback) {
		var async = false;
		var isFile = false;
		if (callback == undefined)  {
			async = false;
		}  else {
			async = true;
		}
		if (formData instanceof FormData) {
			isFile = true;
		}

		var result;
		$.ajax({
			type:"post",
			async:async,
			url:targetUrl,
			data:(!isFile ? ComUtils.fromJSON(formData) : formData),
			dataType: (!isFile ? "json" : false),
			contentType: (!isFile ? "application/json; charset=utf-8" : false),
			processData:false,
			success: function(response) {
				try {
					response = ComUtils.toJSON( response );
				} catch (e) {
					ComUtils.alert(e.toString());
				}

				ComUtils.hideLoading();

				if (async) {
					callback(response);
				} else {
					result = response;
					return result;
				}
			},
			error:function(response) {
				if (response.status == 999) {
					location.href = GV_CTX;
				} else if (response.status == 401) {
					ComUtils.alert("You do not have permission.");
				} else {
					ComUtils.hideLoading();
					if (!ComUtils.isEmpty(response.responseJSON)) {
						result = response.responseJSON;
					} else {
						result = {result: "F", message: response.status + " ERROR"};
					}
					if (async) {
						callback(result);
					} else {
						return result;
					}
				}
			},
			beforeSend: function () {
				ComUtils.showLoading();
			},
			complete: function () {
				ComUtils.hideLoading();
			},
			xhr: function() {
				var xhr = $.ajaxSettings.xhr();
				xhr.upload.onprogress = function(e) { //progress 이벤트 리스너 추가
					var percent = e.loaded * 100 / e.total;
				};
				return xhr;
			}
		});
		return result;
	},
	delSelectOption : function (id, keys) {
		var item = this.getObj(id);
		var opts = item.find("option");
		for (var i=opts.length-1; i>=0; i--) {
			for (var j=0; j<keys.length; j++) {
				if (opts[i].value == keys[j]) {
					opts[i].remove();
					break;
				}
			}
		}
	},
	clearSelectOption : function (id) {
		var item = this.getObj(id);
		var opts = item.find("option");
		for(var i=0; i<opts.length; i++) {
			opts[i].remove();
		}
	},
	setSelectOption : function (params) {
		var id = ComUtils.nvl(params.id);
		var cd = ComUtils.nvl(params.cd);
		var cdNm = ComUtils.nvl(params.cdNm);
		var selectList = params.selectList;
		var dataList = params.dataList; // ComUtils.nvl(params.dataList);
		var defaultCd = ComUtils.nvl(params.defaultCd);
		var spaceNm = params.spaceNm;
		var innerHtml = params.innerHtml;
		var itemArr = [];

		var obj;
		if (ComUtils.isEmpty(id)) {
			obj = params.obj;
		} else {
			obj = ComUtils.getObj(id);
		}
		$(obj).empty();

		if(spaceNm != undefined) {
			$(obj).append("<option value=''>" + spaceNm +"</option>");
		}

		if(innerHtml != undefined) {
			var tempHtml = innerHtml;

			while(tempHtml.indexOf("item") >= 0) {
				var tempItem = tempHtml.substring(tempHtml.indexOf("item"), tempHtml.indexOf("]")+1);
				itemArr.push(tempItem);
				tempHtml = tempHtml.replace(tempItem, "");
			}
		}

		if(!ComUtils.isEmpty(selectList)) {
			for(var i in selectList) {
				var strItem = JSON.stringify(selectList[i]);
				if(typeof strItem != 'undefined') {
					var item = JSON.parse(strItem);

					var dataHtml = "";

					// data- 뒤의 속성값에 대문자를 넣더라도 HTML 문서가 로딩 될 때 소문자로 변환됨.
					// ex) modelId의 값은 .data("modelid")로 호출.
					for(i in dataList) {
						dataHtml += " data-"+dataList[i]+"='"+item[dataList[i]]+"'";
					}
					if(itemArr.length > 0) {
						var tempHtml = innerHtml;

						if(!ComUtils.isEmpty(tempHtml)) {
							for(i in itemArr) {
								tempHtml = tempHtml.replace(tempHtml.substring(tempHtml.indexOf("item"), tempHtml.indexOf("]")+1), eval(itemArr[i]));
							}
							item[cdNm] = tempHtml;
						}
					}

					if (defaultCd == item[cd]) {
						$(obj).append("<option value='"+item[cd]+"'"+dataHtml+" selected='selected'>"+item[cdNm]+"</option>");
					} else {
						$(obj).append("<option value='"+item[cd]+"'"+dataHtml+">"+item[cdNm]+"</option>");
					}
				}
			}
		}
	},
	textDownload : function(fileName, text){
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', fileName);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	},
	showLoading: function() {
		$("body").append('<div id="loading" style="position:fixed; _position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;">'
			+ '<div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:.3;filter:alpha(opacity=30);background-color:#fff"></div>'
			+ '<div class="loader" style="position: relative; top: 45%; left: 30%;"><img src="/static/assets/images/loadingBar.gif" style="width: 100px;"></img></div></div>');
	},
	hideLoading: function() {
		$("#loading").remove();
	},
	numberWithCommas: function(obj) {
		var num;
		if (ComUtils.isEmpty(obj)) {
			return "";
		}
		if (typeof obj == "string" || typeof obj == "number") {
			num = ComUtils.getNumber(obj);
		} else {
			obj = ComUtils.getObj(obj);
			num = ComUtils.getValue(obj);
		}

		var arr = num.toString().split(".");
		// MOD-000042
		if (arr.length > 1) {
			return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, GV_THOUSAND_SPRAT) + GV_DECIMAL_SPRAT + arr[1];
		} else {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, GV_THOUSAND_SPRAT);
		}
	},
	getByteLength: function(inputValue) {
		var byteLength = 0;
		for (var inx = 0; inx < inputValue.length; inx++)     {
			var oneChar = escape(inputValue.charAt(inx));
			if (oneChar.length == 1){
				byteLength++;
			}else if (oneChar.indexOf("%u") != -1){
				byteLength += 2;
			}else if (oneChar.indexOf("%") != -1){
				byteLength += oneChar.length / 3;
			}
		}
		return byteLength;
	}
	, alert : function( resp, title, funC ){
		var msg = "";
		if (typeof(resp) == "object") {
			msg += "[" + resp.errorCode + "] " + resp.message;
		} else {
			msg = resp;
		}

		FES.UI.modal.alert({
			text : msg,
			title : title,
			option : {
				onConfirm : funC
			}
		});
	}
	, confirm : function( msg, title, funC, funC2 ){
		FES.UI.modal.confirm({
			text : msg,
			title : title,
			option : {
				onConfirm : funC,
				onCancel : funC2
			}
		});
	}
	, clone : function (obj) {
		if(obj === null || typeof(obj) !== 'object') return obj;

		var copy = obj.constructor();

		for(var attr in obj) {
			if(obj.hasOwnProperty(attr)) {
				copy[attr] = obj[attr];
			}
		}
		return copy;
	}
	, jsonClone : function (obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	, searchEvent : function (frm, func) {
		frm.find("input, select, textarea, hidden").each(function(i, item) {
			var type = ComUtils.getType(item);
			if (type == "radio" || type == "select-one") {
				$(item).change(function() {
					func();
				});
			} else if (type = "text") {
				$(item).keyup(function(e) {
					if(e.keyCode == 13) {
						func();
					}
				});

				if ($(item).hasClass("__jqueryDate")) {
					$(item).on('changeDate', function() {
						func();
					});
				}
			}
		});
	}
	, setTotalCount : function(id, data) {
		var item = this.getObj(id + "Cnt");
		var page = this.getObj(id + "Page");
		var cnt = 0;
		if (item.length == 0) {
			return;
		}
		if (!ComUtils.isEmpty(data)) {
			if (page.length > 0) {
				cnt = (data.length > 0) ? data[0].totcnt : 0;
			} else {
				if (typeof data == "number" || typeof data == "string") {
					cnt = data;
				} else {
					cnt = data.length;
				}
			}
		}

		item[0].innerHTML = "전체건수 총 : " + this.numberWithCommas(cnt) + "건";
	}
	, getLocale : function() {
		return (new Intl.NumberFormat()).resolvedOptions().locale.toUpperCase();
	}, getAge : function(birthday){
		if(birthday.length == 0) {
			return 0;
		}
		var date = new Date();
		var year = date.getFullYear();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var birth = TimeUtils.dateConverter(birthday, 'YYYYMMDD');

		if (month < 10) {
			month = '0' + month;
		}

		if (day < 10){
			day = '0' + day;
		}

		var monthDay = month + day;
		birth = birth.replace('-', '').replace('-', '');
		var birthdayy = birth.substr(0, 4);
		var birthdaymd = birth.substr(4, 4);
		var age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;
		return age;
	}
};

var TimeUtils = {
	makejQueryTime : function (i, item){
		var format = ComUtils.nvl($(item).attr("data-format"), "HH:MM");
		$(item).attr({"readonly":"readonly"});
		if (format.indexOf("MM") >= 0) {
			$(item).css('width', '100');
		} else {
			$(item).css('width', '40');
		}
		format=format.replace("MM","mm");

		var pickerOpt = {
			timeFormat: format,
			interval: 10,
			minTime: '00:00',
			maxTime: '23:50',
			dynamic: false,
			dropdown: true,
			scrollbar: true
		};

		$(item).timepicker(pickerOpt);
	}
	, makejQueryDate : function (i, item){
		var format = ComUtils.nvl($(item).attr("data-format"), GV_DATE_FORMAT);
		var disabled = $(item).hasClass("text_disable");
		$(item).attr({"readonly":"readonly"});
		$(item).css('width', format.length * 9);
		format=format.replace("DD","dd");
		format=format.replace("MM","mm");
		format=format.replace("YYYY","yy");

		var old_goToToday = $.datepicker._gotoToday;
		$.datepicker._gotoToday = function(id) {
			old_goToToday.call(this,id);
			this._selectDate(id);
		}

		var pickerOpt = {
			changeMonth: true
			,changeYear: true
			,showButtonPanel: true
			,showOn: 'button'
			,buttonText: 'Show Date'
			,buttonImageOnly: true
			,buttonImage: GV_CTX + '/static/assets/images/button/cal.png'
			,dateFormat: format
		};

		// 년월
		if (format.length == 5) {
			// Button [Clear, Select]

			var pickerButtons = function() {
				// Picker Icon을 눌렀을때만 현재 시간을 기준으로 보여주도록 해야함. 그렇게 하지 않으면 setValue 가 정상동작 하지 않음. 2018.11.21 by 류재명
				// if (!ComUtils.isEmpty(event) && $(event.target).hasClass("ui-datepicker-trigger")) {
				if (arguments != undefined && arguments.length > 0 && $(arguments[0]).hasClass("__jqueryDate")) {
					var selectDate = TimeUtils.getDate($(item));
					if (!ComUtils.isEmpty(selectDate)) {
						var year = Number(selectDate.substring(0, 4));
						var month = Number(selectDate.substring(4, 6)) - 1;
						$(item).datepicker( "option", "defaultDate", new Date(year, month, 1) );
					}
				}

				setTimeout(function () {
					if ($(".ui-custom-clear").length == 0) {
						// Clear Button
						var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
						var btn = $('<button class="ui-custom-clear ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: left;">Clear</button>');
						btn.unbind("click").bind("click", function () {
							$(item).datepicker('setDate', "");
							$(item).datepicker("hide");
							$(item).trigger('changeDate');
						});
						btn.appendTo(buttonPane);

						// Select Button
						var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
						var btn = $('<button class="ui-custom-select ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: right;">Select</button>');
						btn.unbind("click").bind("click", function () {
							var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
							var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
							$(item).datepicker('setDate', new Date(year, month, 1));
							$(item).datepicker("hide");
							$(item).trigger('changeDate');
						});
						btn.appendTo(buttonPane);
					}
				}, 1);
			}

			pickerOpt.onChangeMonthYear = pickerButtons;
			pickerOpt.beforeShow = pickerButtons;
		}
		// 년월일
		else {
			// Button [Clear, Today]
			var pickerButtons = function() {
				setTimeout(function () {
					if ($(".ui-custom-clear").length == 0) {
						// Clear Button
						var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
						var btn = $('<button class="ui-custom-clear ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: left;">Clear</button>');
						btn.unbind("click").bind("click", function () {
							$(item).datepicker('setDate', "");
							$(item).datepicker("hide");
							$(item).trigger('changeDate');

							if ($(item).is("[relationId]")) {
								var relationId = $(item).attr("relationId");
								$("#" + relationId).val("");
								// ComUtils.setValue(relationId, "");
							}
						});
						btn.appendTo(buttonPane);

						// Select Button
						var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
						var btn = $('<button class="ui-custom-today ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: right;">Today</button>');
						btn.unbind("click").bind("click", function () {
							$(item).datepicker('setDate', new Date());
							$(item).datepicker("hide");
							$(item).trigger('changeDate');
						});
						btn.appendTo(buttonPane);
					}
				}, 1);
			}

			// pickerOpt.onChangeMonthYear = changeYearButtons;
			pickerOpt.beforeShow = pickerButtons;
		}

		$(item).datepicker(pickerOpt);

		// 년월만 있는 경우
		if (format.length == 5) {
			$(item).focus(function () {
				$(".ui-datepicker-calendar").remove();
			});
		}

		if(disabled){
			$(item).datepicker('disable');
		} else {
//    			if (format.length != 5) {
//	    			$(item).on("click", function () {
//	    				$(item).datepicker("show");
//	    			});
//    			}
		}

		if (format.length != 5) {
			$(item).on("click", function () {
				$(item).datepicker("show");
			});
		}
	}
	, setDatepickerRange : function (el, type, period) {
		// 오늘 		: TimeUtils.setDatepickerRange(this, 'D', 0)
		// 지난 7일	: TimeUtils.setDatepickerRange(this, 'D', -7)
		// 월 1일~	: TimeUtils.setDatepickerRange(this, 'M')

		// 버튼 스타일
		$(el).addClass('is-active').siblings().removeClass('is-active');

		if(type == 'All'){
			//전체
			$("[data-js=range-start]").val('');
			$("[data-js=range-end]").val('');
		}else{
			//미래
			if(period > 0){
				// 기간 검색 종료일
				if(type == 'D') {
					$("[data-js=range-end]").datepicker("setDate", TimeUtils.addDays(period));
				}
				// 기간 검색 시작일
				$("[data-js=range-start]").datepicker("setDate", new Date());

			}else{
				// 기간 검색 시작일
				if(type == 'D') {
					if(period == 0) {
						$("[data-js=range-start]").datepicker("setDate", new Date());
					} else {
						$("[data-js=range-start]").datepicker("setDate", TimeUtils.addDays(period));
					}
				} else {
					// 1일 ~ 오늘
					$("[data-js=range-start]").datepicker("setDate", TimeUtils.firstDay());
				}

				// 기간 검색 종료일
				$("[data-js=range-end]").datepicker("setDate", new Date());
			}
		}


		// 캘린더 설정 및 조회
		$("[data-js=range-start], [data-js=range-end]").change();
		$("#btnSearch").click();
	}
	, setDate : function (id, str) {
		var obj = ComUtils.getObj(id);
		if (ComUtils.isEmpty(str)) {
			$(obj).datepicker('setDate', '');
			return;
		}
		if (typeof str == "number") {
			str = TimeUtils.dateFormat(str);
			//str = str.toString();
		}
		if (typeof str == "string") {
			var str = str.replace(/[^0-9]/g, '');
			var yy = str.substring(0, 4);
			var mm = str.substring(4, 6);
			var dd = str.substring(6, 8);
			$(obj).datepicker('setDate', new Date(Number(yy), Number(mm) - 1, ComUtils.nvl(dd, "1")));
		} else {
			$(obj).datepicker('setDate', str);
		}
	}
	, getDate : function (id) {
		var obj = ComUtils.getObj(id);
		var format = ComUtils.nvl($(obj).attr("data-format"), GV_DATE_FORMAT);
		var dateStr;
		if (ComUtils.isEmpty(obj.val())) {
			return "";
		} else {
			dateStr = obj.val();
		}
		var formatArray = format.split('/');
		var dateArray = dateStr.split('/');

		if(formatArray.length == 1){
			formatArray = format.split('.');
			dateArray = dateStr.split('.');
		}
		if(formatArray.length == 1){
			formatArray = format.split('-');
			dateArray = dateStr.split('-');
		}

		var yy="", mm="", dd="";
		for(var i=0; formatArray.length > i; i++){
			var format = formatArray[i];

			switch (format) {
				case "YYYY":
					yy= dateArray[i];
					break;
				case "MM":
					mm= dateArray[i];
					break;
				case "DD":
					dd= ComUtils.nvl(dateArray[i], "");
					break;
			}
		}
		return yy+mm+dd;
	}
	, setTime : function (id, str) {
		if (ComUtils.isEmpty(str)) return;
		var obj = ComUtils.getObj(id);
		var format = ComUtils.nvl($(obj).attr("data-format"), "HH:MM");
		var str = str.replace(/[^0-9]/g, '');
		var hh = str.substring(0, 2);
		var mm = str.substring(2, 4);
		var time = hh;
		if (!ComUtils.isEmpty(mm)) {
			time += ":" + mm;
		}
		$(obj).timepicker('setTime', time);
	}
	, getTime : function (id) {
		var obj = ComUtils.getObj(id);
		var format = ComUtils.nvl($(obj).attr("data-format"), GV_DATE_FORMAT);
		var timeStr = "";
		if (ComUtils.isEmpty(obj.val())) {
			return "";
		} else {
			timeStr = obj.val();
		}

		return timeStr.replace(":", "");
	}
	, convertTimeZoneToPC : function (dt) {
		var rtnDt = TimeUtils.convertTimeZone(dt, GV_SYSTEM_TIMEZONE, GV_USER_TIMEZONE);
		rtnDt = rtnDt.replace(/[^0-9]/g, '');
		return rtnDt;
	}
	, convertTimeZoneToServer : function (dt) {
		var rtnDt = TimeUtils.convertTimeZone(dt, GV_USER_TIMEZONE, GV_SYSTEM_TIMEZONE);
		rtnDt = rtnDt.replace(/[^0-9]/g, '');
		return rtnDt;
	}
	, convertTimeZone : function (dt, fromGMT, toGMT) {
		if (ComUtils.isEmpty(dt)) {
			return "";
		}

		fromGMT = fromGMT.substr(fromGMT.indexOf("+"));
		if (fromGMT.indexOf(":") == -1) {
			fromGMT = fromGMT + ":00";
		}

		// 2018-09-07T00:36:26+00:00
		var year = dt.substr(0, 4);
		var month = dt.substr(4, 2);
		var day = dt.substr(6, 2);
		var hour = ComUtils.nvl(dt.substr(8, 2), "00");
		var min = ComUtils.nvl(dt.substr(10, 2), "00");
		var second = ComUtils.nvl(dt.substr(12, 2), "00");
		var fromDtStr = year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + second + "" + fromGMT;
		var fromDt = new Date(fromDtStr);
		var toDt = this.changeTimeZone(fromDt, toGMT);
		return TimeUtils.dateFormat(toDt, "YYYYMMDDHH24MISS");
	}
	, displayDateFormat : function (dt) {
		var dt1 = TimeUtils.convertTimeZoneToPC(dt);
		return TimeUtils.dateFormat(dt1, GV_DATE_FORMAT + " HH24:MI");
	}
	, dateFormat : function (dt, format) {
		if (ComUtils.isEmpty(dt)) {
			return "";
		}
		format = ComUtils.nvl(format, GV_DATE_FORMAT);

		var d;
		if (dt.constructor == Date) {
			d = dt;
		} else if (typeof(dt) == 'number') {
			d = new Date(dt);
		} else if (typeof(dt) == 'string') {
			d = this.toDate(dt);
		}

		var rtn = format.replace(/(YYYY|YY|MM|DD|E|HH24|MI|SS)/gi, function($1) {
			switch ($1) {
				case "YYYY": return d.getFullYear();
				case "YY": return (d.getFullYear() % 1000).zf(2);
				case "MM": return (d.getMonth() + 1).zf(2);
				case "DD": return d.getDate().zf(2);
				case "HH24": return d.getHours().zf(2);
				case "MI": return d.getMinutes().zf(2);
				case "SS": return d.getSeconds().zf(2);
				default: return $1;
			}
		});
		return rtn;
	}
	, dateConverter: function(dt, format) {
		if(!ComUtils.isEmpty(dt)) {
			var d = new Date(dt);
			if(!isNaN(d)) {
				var offsets = GV_USER_TIMEZONE.replace("GMT", "").split(":");
				var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
				dt = new Date(utc + (3600000*offsets[0] + 60000*offsets[1]));
			}
		}
		return TimeUtils.dateFormat(dt, format);
	}
	, toDate : function(sDate){
		sDate = sDate.replace(/[^0-9]/g, '');
		var year, month, day, hour, min, second, millisecond;
		var d;
		year = sDate.substr(0, 4);
		month = sDate.substr(4, 2) -1;
		day = sDate.substr(6, 2);
		if(sDate.length == 12){
			hour = sDate.substr(8, 2);
			min = sDate.substr(10, 2);
			// d = new Date(year + "-" + month + "-" + day + " " + hour + ":"+ min + ":00 GMT+0000");
			d = new Date(year, month, day, hour, min);
		}else if(sDate.length > 12){
			hour = sDate.substr(8, 2);
			min = sDate.substr(10, 2);
			second = sDate.substr(12, 2);
			// d = new Date(year + "-" + month + "-" + day + " " + hour + ":"+ min + ":" + second + " GMT+0000");
			d = new Date(year, month, day, hour, min, second);
		} else {
			// d = new Date(year + "-" + month + "-" + day + " 00:00:00 GMT+0000");
			d = new Date(year, month, day);
		}
		return new Date(d);

	}
	, changeTimeZone : function(d, gmt) {
		var gmt = gmt.substr(gmt.indexOf("+"));
		var offsets = gmt.split(":");
		var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		var nd = new Date(utc + (3600000*offsets[0] + 60000*offsets[1]));
		return nd;
	}
	, addDays : function(days) {
		var date = new Date();
		date.setDate(date.getDate() + days);
		return date;
	}
	, addYears : function(years) {
		var date = new Date();
		date.setFullYear(date.getFullYear() + years);
		return date;
	}
	, getTimeZone : function() {
		var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
		return "GMT" + (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
	}
	, getDays: function(month){
		if(month==null){ month = utils.getMonth(); }
		var value = [];
		var lastDay = TimeUtils.lastDay(TimeUtils.getYear, month);
		var i;

		for(i=0;i<lastDay;i++){
			value.push(ComUtils.pad(month,2) + '.' + ComUtils.pad((i+1),2));
		}
		return value;
	}
	, lastDay: function(year, month){
		return new Date(year, month, 0).getDate();
	}
	, timeFormatter: function(el) {

		var hhmiss= $(el).val().trim().replaceAll(":", "").substring(0, 4);

		var hh = hhmiss.substr(0,2);
		var mi = hhmiss.substr(2,2);

		if(hh.length==2 && hh.match(/^(0[0-9]|1[0-9]|2[0-3])$/) == null) {
			hh = "00";
		}
		if(mi.length==2 && mi.match(/^([0-5][0-9])$/) == null) {
			mi = "00";
		}

		$(el).val( hh + (hh.length==2 ? ":" : "") + mi );
	}, firstDay: function(){
		//이번달 초 날짜
		var now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), 1);
	}, diffTime : function(startDate, endDate){
		var time = (endDate - startDate)/1000;
		var hours = time/3600;

		/*
		if(0 <= hours && hours < 10){
			hours = "0" + Math.floor(hours);
		}else if(hours < 0 || isNaN(hours)){
			hours = "00";
		}else{
			hours = Math.floor(hours);
		}
		*/
		hours = Math.floor(hours);

		var minutes = (time % 3600) / 60;
		if(0 <= minutes && minutes < 10){
			minutes = "0" + Math.floor(minutes);
		}else if(minutes < 0 || isNaN(minutes)){
			minutes = "00";
		}else{
			minutes = Math.floor(minutes);
		}

		var seconds = ( time % 3600) % 60;
		if(0 <= seconds && seconds < 10){
			seconds = "0" + Math.floor(seconds);
		}else if(seconds < 0 || isNaN(seconds)){
			seconds = "00";
		}else{
			seconds = Math.floor(seconds);
		}

		return hours;
	}
};

var GridUtils = {
	/**
	 * @method drawGrid
	 * @param gridId - grid가 그려지는 부분 id
	 * @param dataUrl - json 데이터를 가져오는 경로
	 * @description grid를 그림. reorderRows를 사용하려면 lineNumbers도 있어야 됨. 2018.04.27 김수형
	 */
	drawGrid: function(params, isInfo) {
		var id = params.id;
		// 2018.11.02 Grid info 보여주기
		try {
			// 2020.07.03 isInfo (default:표시 안함)
			isInfo = ComUtils.nvl(isInfo, 'N');
			// 2018.11.05 info 컬럼이 존재할 경우는 제외하도록 !params.columns[0].hasOwnProperty('info') 추가
			if (isInfo != "N" && !params.columns[0].hasOwnProperty('info')) {
				var col = { field: '', caption: 'i', size: '28px', style: 'text-align:center', info:true };
				if (params.columns[0].frozen == true) {
					col.frozen = true;
				}
				params.columns.unshift(col);
				if (!ComUtils.isEmpty(params.columnGroups)) {
					params.columnGroups.unshift({caption: "", master: true, span: 1});
				}
			}
		} catch (e) {}

		// Sortable 표시해주기
		var columns = params.columns;
		for (var i in columns) {
			if (columns[i].sortable) {
				columns[i].caption = "<div class='sortable'>" + columns[i].caption + "</div>"
			}
		}

		var name = (ComUtils.isEmpty(params.name) ? id : params.name);
		$('#'+id).w2grid({
			name : name,
			fixedBody: (ComUtils.isEmpty(params.fixedBody) ? true : params.fixedBody),
			show: {
				selectColumn: (ComUtils.isEmpty(params.isCheck) ? false : params.isCheck),
				lineNumbers: (ComUtils.isEmpty(params.lineNumbers) ? false : params.lineNumbers),
				expandColumn: (ComUtils.isEmpty(params.expandColumn) ? false : params.expandColumn)
//	                    footer      : true,
//	                    selectColumn: true,
			},
			multiSelect : (ComUtils.isEmpty(params.multiSelect) ? false : params.multiSelect),
			reorderRows: true,
			selectType : 'row',
//		                lineHTML: (ComUtils.isEmpty(params.lineHTML) ? null : params.lineHTML),
			lineHTML: '≡', // 고정
			method: 'GET', // need this to avoid 412 error on Safari
			columnGroups: params.columnGroups,
			columns: params.columns,
			searches: (ComUtils.isEmpty(params.searches) ? null : params.searches),
			/* records: (ComUtils.isEmpty(params.records) ? null : params.records), */
			onClick: (ComUtils.isEmpty(params.onClick) ? null : params.onClick),

			onSearch: function(event) {
				console.log(event);
			}
		}).refresh();
		w2ui[name].recordHeight = (ComUtils.isEmpty(params.recordHeight) ? 28 : params.recordHeight);

		if (!ComUtils.isEmpty(params.records)) {
			this.setRecords(name, params.records);
		}

		if (!ComUtils.isEmpty(w2ui[id])) {
			w2ui[id].refresh();
		}
	},
	setRecords : function (id, gridData) {
		if (ComUtils.isEmpty(gridData)) {
			gridData = [];
		}
		for (var i=0; i<gridData.length; i++) {
			gridData[i].recid = (i + 1);
		}

		w2ui[id].records = gridData;
		w2ui[id].selectNone();
//		    		w2ui[id].refresh();

		w2ui[id].reload();
		ComUtils.setTotalCount(id, gridData);

		this.refreshAll();
	},
	add : function (id, rowData) {
		var maxRecid = 0;
		for (var i=0; i<w2ui[id].records.length; i++) {
			if (maxRecid < w2ui[id].records[i].recid) {
				maxRecid = w2ui[id].records[i].recid;
			}
		}
		rowData.recid = maxRecid + 1;
		w2ui[id].add(rowData);
		return rowData.recid;
	},
	set : function (id, recid, rowData){
		w2ui[id].set(recid, rowData);
	},
	remove : function (id, index) {
		if (!ComUtils.isEmpty(index)) {
			w2ui[id].remove(index);
		} else {
			if(w2ui[id].getSelection().length){
				w2ui[id].delete(true);
			}
		}
		w2ui[id].selectNone();
	},
	find : function (id, data) {
		return w2ui[id].find(data);
	},
	select : function (id, recid) {
		w2ui[id].select(recid);
	},
	sort : function (id, field, direction) {
		w2ui[id].sort(field, direction);
	},
	save : function (id) {
		w2ui[id].save();
	},
	getAllData : function (id) {
		return w2ui[id].records;
	},
	getSelectIndex : function (id) {
		return w2ui[id].getSelection();
	},
	getSelectionData : function (id) {
		var idx = this.getSelectIndex(id);
		return w2ui[id].get(idx[0]);
	},
	getSelectionMultiData : function (id){
		return w2ui[id].getSelection();
	},
	getRowData : function (id, idx) {
		return w2ui[id].get(idx);
	},
	selectionEvent : function (id, callBack) {
		w2ui[id].on('select', function(event) {
			event.onComplete = function () {
				callBack(event);
			}
		});
	},
	clickEvent : function (id, callBack) {
		w2ui[id].on('click', function(event) {
			event.onComplete = function () {
				callBack(event);
			}
		});
	},
	gridSearchBox: function (name) {
		var html = $("input[name="+name+"]");
		html.attr('class', 'w2ui-search-all');
		html.attr('tabindex', '-1');
		html.attr('placeholder', 'All Fields');
		html.attr('onfocus', 'clearTimeout(w2ui["'+name+'"].last.kbd_timer)');
		html.keydown(function(event) {
			if(event.keyCode == 13) {
				var grid = w2ui[name];
				var val = this.value;
				var sel = jQuery(html).data('selected');
				var fld = jQuery(html).data('w2field');
				if(fld) val = fld.clean(val);
				if(fld && fld.type == 'list' && sel && typeof sel.id == 'undefined') {
					grid.searchReset();
				} else {
					for(i in grid.searches) {
						if(grid.searches[i].type == 'text') grid.searches[i].operator = 'contains';
					}
					grid.search(grid.last.field, val);
				}
			}
		});
	}
	, makeInputRender : function (params) {
		var id = ComUtils.nvl(params.id);
		var treeId = ComUtils.nvl(params.treeId);
		var rowData = ComUtils.nvl(params.rowData);
		var cssClass = ComUtils.nvl(params.cssClass);
		//MOD-000038 그리드 render에 이벤트 사용할수 있도록 추가
		var event	= ComUtils.nvl(params.event);

		if (cssClass.indexOf("text_disable")>=0) {
			params.option += " style=\"background:'#f2f2f2'\" readonly disabled";
		}

		if( !ComUtils.isEmpty(event) ){
			event = event + "(this);"
		}

		var option = ComUtils.nvl(params.option);
		var changeFunc = "";
		if (!ComUtils.isEmpty(treeId)) {
			changeFunc = " onchange=\"w2ui['"+treeId+"'].get("+rowData.recid+")."+id+"=ComUtils.getValue(this);"
				+ " w2ui['"+treeId+"'].get("+rowData.recid+").isChanged=true;"+event+"\"";
		}
		cssClass = (ComUtils.isEmpty(cssClass) ? " " : "class=\"" + cssClass + "\" ");

		// 2018.11.21 Grid 내의 숫자 컴럼 처리 by 류재명
		var value = ComUtils.nvl(rowData[id]);
		if (cssClass.indexOf("text_number")>=0 || cssClass.indexOf("text_float")>=0 || cssClass.indexOf("text_price")>=0) {
			value = ComUtils.numberWithCommas(value);
		}
		var html = "<input type=\"text\" name=\""+id+"\" value=\"" + value + "\"" + cssClass + ComUtils.nvl(option) + changeFunc + ">";
		return html;
	}
	, makeComboRender : function (params) {
		var id = ComUtils.nvl(params.id);
		var treeId = ComUtils.nvl(params.treeId);
		var codeList = params.codeList;
		var rowData = ComUtils.nvl(params.rowData);
		var spaceName = params.spaceName;
		var cssClass = ComUtils.nvl(params.cssClass);
		var option = ComUtils.nvl(params.option);
		var c_code = ComUtils.nvl(params.c_code, "cd");
		var v_code = ComUtils.nvl(params.v_code, "cdNm");
		var event = ComUtils.nvl(params.event);

		if (!ComUtils.isEmpty(event)) {
			event = event + "(this);"
		}

		var obj = ComUtils.getObj(id);

		//--------------------------
		var changeFunc = "";
		if (!ComUtils.isEmpty(treeId)) {
			changeFunc = " onchange=\"w2ui['"+treeId+"'].get("+rowData.recid+")."+id+"=ComUtils.getValue(this);"
				+ " w2ui['"+treeId+"'].get("+rowData.recid+").isChanged=true;" + event + "\"";
		}
		var html = "<select name=\"" + id + "\" " + (ComUtils.isEmpty(cssClass) ? " " : "class=\"" + cssClass + "\" ") + ComUtils.nvl(option) + changeFunc + ">";



		if (spaceName != undefined) {
			html += "<option value=\"\">"+spaceName+"</option>";
		}
		for (var i in codeList) {
			//item = codeList[i];
			// ie 일때 . 브라우져가 type 을 단순 Object 로 받는 현상이 있음.
			// [2012.10.21:전영우] 해당 객체의 object 가  undefined 인 경우 동작이 안되도록 함.
			var itemDtl = JSON.stringify(codeList[i]);
			if( typeof itemDtl != 'undefined' ){
				var item = JSON.parse( itemDtl );
				if (rowData[id] == item[c_code]) {
					html += "<option value=\""+item[c_code]+"\" selected=\"selected\">"+item[v_code]+"</option>";
				} else {
					html += "<option value=\""+item[c_code]+"\">"+item[v_code]+"</option>";
				}
			}
		}
		html += "</select>"
		return html;
	}
	, makeCheckBoxRender : function (params) {
		var id = ComUtils.nvl(params.id);
		var checkValue = ComUtils.nvl(params.checkValue);
		var treeId = ComUtils.nvl(params.treeId);
		var rowData = ComUtils.nvl(params.rowData);
		var cssClass = ComUtils.nvl(params.cssClass);
		var option = ComUtils.nvl(params.option);
		var event = ComUtils.nvl(params.event);
		var refreshRow = ComUtils.nvl(params.refreshRow);

		if (!ComUtils.isEmpty(event)) {
			event = event + "(this);"
		}

		if(!ComUtils.isEmpty(refreshRow)) {
			refreshRow = "w2ui['"+treeId+"'].refreshRow("+rowData.recid+");"
		}

		var changeFunc = "";
		if (!ComUtils.isEmpty(treeId)) {
			changeFunc = " onclick=\"w2ui['"+treeId+"'].get("+rowData.recid+")."+id+"=ComUtils.getValue(this);" + " w2ui['"+treeId+"'].get("+rowData.recid+").isChanged=true;" + event + refreshRow + "\"";
		}

		var html = "<input type='checkbox' name='" + id + "' value='" + checkValue + "'" + (rowData[id] == checkValue ? " checked " : " ") + (ComUtils.isEmpty(cssClass) ? " " : "class='" + cssClass + "' ") + ComUtils.nvl(option) + changeFunc + ">";
		return html;
	}
	, clear : function (id) {
		return w2ui[id].clear();
	}
	, refreshAll : function () {
		for (var key in w2ui) {
			if (!key.indexOf("_toolbar")>=0) {
				w2ui[key].refresh();
			}

			// remove sort icon
			$("#"+key).find(".w2ui-sort-down, .w2ui-sort-up").removeClass("w2ui-sort-up").removeClass("w2ui-sort-down");

			// header select box
			var hd_select = $("#"+key).find(".w2ui-head.w2ui-col-select");
			if(hd_select.length > 1) {
				hd_select.eq(1).attr({
					'rowspan':2
					, 'onclick' : hd_select.last().attr("onclick")
				});
				hd_select.eq(1).html(hd_select.last().html());
				hd_select.eq(1).parents("table").css("height", "60px");
			}

			// empty grid
			var gridData = w2ui[key].records;
			if(ComUtils.isEmpty(gridData)) {
				$("#"+key).find(".w2ui-grid-frecords, .w2ui-grid-records").empty();
				$("#"+key).find(".w2ui-grid-records").append('<div class="w2ui-grid-empty"><p>검색된 내용이 없습니다.</p></div>');
			}
		}
	}
	, makeRadioBoxRender : function (params) {
		var id = ComUtils.nvl(params.id);
		var resetValue = ComUtils.nvl(params.resetValue);
		var checkValue = ComUtils.nvl(params.checkValue);
		var treeId = ComUtils.nvl(params.treeId);
		var rowData = ComUtils.nvl(params.rowData);
		var cssClass = ComUtils.nvl(params.cssClass);
		var option = ComUtils.nvl(params.option);
		var event = ComUtils.nvl(params.event);

		if (!ComUtils.isEmpty(event)) {
			event = event + "(this);"
		}

		var changeFunc = "";
		if (!ComUtils.isEmpty(treeId)) {
			changeFunc = " onclick=\"GridUtils.resetColumns('"+id+"', '"+resetValue+"','"+treeId+"','"+rowData.recid+"');"
				+ " w2ui['"+treeId+"'].get("+rowData.recid+")."+id+"=ComUtils.getValue(this);"
				+ " w2ui['"+treeId+"'].get("+rowData.recid+").isChanged=true;" + event + "\"";
		}

		var html = "<input type='radio' name='" + id + "' id='" + id + "_" + rowData.recid + "' value='" + checkValue + "'" + (rowData[id] == checkValue ? " checked " : " ") + (ComUtils.isEmpty(cssClass) ? " " : "class='" + cssClass + "' ") + ComUtils.nvl(option) + changeFunc + ">";
		return html;
	}
	/**
	 * columId    : 초기화 할 컬럼명
	 * resetValue : 초기화 할 값
	 *  treeId    : 그리드 아이디
	 *  recid     : 해당 row recid
	 */
	, resetColumns : function(columId, resetValue, treeId, recid){
		var gridData = GridUtils.getAllData(treeId);

		$.each(gridData, function(i,v){
			gridData[i][columId] = resetValue;
		});

		// gridData[recid - 1][columId] =gridData[recid - 1].colorCd;
	}
	, selectNone : function (id) {
		return w2ui[id].selectNone();
	}
	, drawExpandGrid : function (parent, subColumns, initSubgridRecords, subTitle) {
		var recordHeight = 28;
		var columnHeight = 59;
		var maxHeight = 200;
		var prevRecid;
		var existGridList = [];

		w2ui[parent].on('expand', function(event) {
			var tempRecords = [];
			var sg = 'subgrid-' + event.recid;

			if(existGridList.indexOf(sg) == -1) {
				existGridList.push(sg);
			}

			if(prevRecid != undefined && prevRecid != event.recid) {
				w2ui[parent].collapse(prevRecid);
			}

			prevRecid = event.recid;

			if(w2ui.hasOwnProperty(sg)) {
				tempRecords = w2ui[sg].records;
				w2ui[sg].destroy();
			} else {
				var tempRecid =  event.recid;
				if(Array.isArray(tempRecid)) {
					tempRecid = tempRecid[0];
				}
				tempRecords = initSubgridRecords(tempRecid);
			}
			var height = tempRecords.length * recordHeight + columnHeight;
			if(height > maxHeight) height = maxHeight;
			$('#'+ event.box_id).css({ margin: '5px', padding: '5px', width: '96%' }).animate({ height: height }, 100);
			$('#'+ event.fbox_id).css({ margin: '5px', padding: '5px', width: '96%' }).animate({ height: height }, 100);

			setTimeout(function () {
				var subId = event.box_id;

				if(subTitle != undefined) {
					var subHeight = height - 8;
					$('#'+ event.box_id).html(
						"<div id='subBox'>"
						+		"<div style='width:8%; float:left'>"
						+			"<h4>"+subTitle+"</h4>"
						+		"</div>"
						+		"<div id='subgrid' style='width:90%; height:"+subHeight+"px; float:right'>"
						+		"</div>"
						+	"</div>"
					);
					subId = 'subgrid';
				}

				GridUtils.drawGrid({id:subId, columns:subColumns, records: tempRecords, name: sg});
				w2ui[parent].resize(); // 2018.11.13 김수형 expand 후 스크롤이 생기지 않는 문제를 해결하기 위해 추가.
			}, 300);
		});

		if(subTitle != undefined) {
			w2ui[parent].on('collapse', function(event) {
				prevRecid = undefined;
				$(this.box).find('#subBox').slideUp(200);
			});
		}

		return {
			getSelectRecid : function() {
				return prevRecid;
			},
			init : function() {
				prevRecid = undefined;

				var length = existGridList.length;
				for(var i = 0; i<length; i++) {
					w2ui[existGridList.pop()].destroy();
				}
			}
		}
	}

	, gridTransfer : function (params) {
		var leftGrid			= ComUtils.nvl(params.leftGrid);
		var rightGrid			= ComUtils.nvl(params.rightGrid);
		var transferBtnId		= ComUtils.nvl(params.transferBtnId);
		var subColunms			= ComUtils.nvl(params.subColumns);
		var initSubgridRecords	= ComUtils.nvl(params.initSubgridRecords);

		var recordHeight = 28;
		var columnHeight = 59;
		var maxHeight = 200;
		var expandEvent;
		var changed = false;
		var existGridList = [];

		w2ui[rightGrid].on('expand', function(event) {
			var tempRecords = [];
			var sg = 'subgrid-' + event.recid;

			if(existGridList.indexOf(sg) == -1) {
				existGridList.push(sg);
			}

			// 클릭 Row를 제외하고 닫음(라디오 버튼 기능)
			if(w2ui[leftGrid].expandRecid != undefined && w2ui[leftGrid].expandRecid != event.recid) {
				w2ui[rightGrid].collapse(w2ui[leftGrid].expandRecid);
			}

			expandEvent = event;
			w2ui[leftGrid].expandRecid = event.recid;

			// Subgrid가 존재하면 레코드를 임시 저장하고 grid를 삭제, 없으면 initSubgridRecords에서 레코드를 호출
			if(w2ui.hasOwnProperty(sg)) {
				tempRecords = w2ui[sg].records;
				w2ui[sg].destroy();
			} else {
				var tempRecid =  event.recid;
				if(Array.isArray(tempRecid)) {
					tempRecid = tempRecid[0];
				}
				tempRecords = initSubgridRecords(tempRecid);
			}
			var height = tempRecords.length * recordHeight + columnHeight;
			if(height > maxHeight) height = maxHeight;
			$('#'+ event.box_id).css({ margin: '5px', padding: '5px', width: '96%' }).animate({ height: height }, 100);
			$('#'+ event.fbox_id).css({ margin: '5px', padding: '5px', width: '96%' }).animate({ height: height }, 100);

			setTimeout(function () {
				GridUtils.drawGrid({id:event.box_id, columns:subColumns, records: tempRecords, name: sg});
				w2ui[rightGrid].resize();
			}, 300);
		});

		w2ui[rightGrid].on('collapse', function(event) {
			expandEvent = undefined;
			w2ui[leftGrid].expandRecid = undefined;
		});

		return {
			// Subgrid row 삭제
			remove:function(recid, func) {
				var sg = 'subgrid-' + expandEvent.recid;

				changed = true;

				func(w2ui[sg].get(recid));
				w2ui[sg].remove(recid);

				var height = w2ui[sg].records.length * recordHeight + columnHeight;
				if(height > maxHeight) height = maxHeight;
				$('#'+ expandEvent.box_id).css('height',height);
				$('#'+ expandEvent.fbox_id).css('height',height);

				setTimeout(function () {
					w2ui[rightGrid].resize();
					w2ui[sg].resize();
					w2ui[sg].refresh();
				}, 300);
			},
			bind:function() {
				var rightRecords = w2ui[rightGrid].records;
				for(i in rightRecords) {
					var sg = 'subgrid-'+rightRecords[i].recid;
					if(w2ui.hasOwnProperty(sg)) {
						rightRecords[i].childList = w2ui[sg].records;
					}
				}
			},
			transfer:function() {
				var leftRecords = w2ui[leftGrid].records;

				if(expandEvent != undefined) {
					var isExistSelected = false;
					var sg = 'subgrid-' + expandEvent.recid;

					for(i in leftRecords) {
						if(leftRecords[i].selection && !leftRecords[i].disabled) {
							isExistSelected = true;
							changed = true;

//			    						leftRecords[i].originRecid = leftRecords[i].recid;
							GridUtils.add(sg, ComUtils.clone(leftRecords[i]));
							leftRecords[i].disabled = true;
						}
					}

					if(isExistSelected) {
						var height = w2ui[sg].records.length * recordHeight + columnHeight;
						if(height > maxHeight) height = maxHeight;
						$('#'+ expandEvent.box_id).css('height',height);
						$('#'+ expandEvent.fbox_id).css('height',height);

						setTimeout(function () {
							w2ui[rightGrid].resize();
							w2ui[sg].resize();
							w2ui[sg].refresh();
							w2ui[leftGrid].refresh();
						}, 300);
					}
				}
			},
			getSelectRecid:function() {
				var returnVal = -1;
				if(expandEvent != undefined) {
					returnVal = expandEvent.recid;
				}
				return returnVal;
			},
			isChanged:function() {
				return changed;
			},
			init:function() {
				expandEvent = undefined;
				w2ui[leftGrid].expandRecid = undefined;
				changed = false;

				var length = existGridList.length;
				for(var i = 0; i<length; i++) {
					w2ui[existGridList.pop()].destroy();
				}
			}
		}
		/*
		}, getCaptionData : function(id){

			var columns = w2ui[id].columns;
			var rtnList = [];
			$.each(columns, function(idx,value){
				if(!value.hidden){
					rtnList.push(value.caption);
				}
			});
			return rtnList;
		*/
	}, getExcelGridData : function(id){
		var bInfo = false;
		var columns = ComUtils.jsonClone(w2ui[id].columns);
		var colGroupList = ComUtils.jsonClone(w2ui[id].columnGroups);

		if (!ComUtils.isEmpty(w2ui[id].columns[0].info)) {
			bInfo = true;
			columns.shift();
			if (!ComUtils.isEmpty(colGroupList)) {
				colGroupList.shift();
			}
		}

		// ORD-10000 [2018.11.28 - 류재명 / 류재명] - Span 적용시 Excel Download 오류 발생
		// Hidden 처리된 Column을 고려하여 colGroupList 조정
		if (!ComUtils.isEmpty(colGroupList)) {
			var s = 0;
			var span = 0;

			for (var i=0; i<colGroupList.length; i++) {
				colGroupList[i].span = ComUtils.nvl(colGroupList[i].span, 1);
				span = colGroupList[i].span;
				if (s >= columns.length) {
					colGroupList.splice(i);
					break;
				} else {
					for (var j=s; j<s+span; j++) {
						if (j < columns.length) {
							if((columns[j].excelExport == 'Y') || (!columns[j].hidden && columns[j].excelExport != 'N')){

							} else {
								colGroupList[i].span = colGroupList[i].span - 1;
							}
						}
					}
				}
				s += span;
			}
		}

		for (var i=colGroupList.length-1; i>=0; i--) {
			if (colGroupList[i].span == 0) colGroupList.splice(i, 1);
		}

		var titleList = [];
		var feildList = [];
		var styleList = [];
		$.each(columns, function(idx,value){
			if (!bInfo || idx != 0 || value.feild != "") {
				/*
				if(!ComUtils.isEmpty(value.lang)){
					if(value.lang == "X"){
						value.excelExport = 'N'	;
					}
				}
				*/
				if((value.excelExport == 'Y') || (!value.hidden && value.excelExport != 'N')){
					if(value.caption.includes ('<span class="required">*</span>')){
						titleList.push(ComUtils.removeTag(value.caption.replace('<span class="required">*</span>','').trim()));
					} else{
						titleList.push(ComUtils.removeTag(value.caption));
					}
					feildList.push(value.field);
					styleList.push({"bgColor":value.excelBgColor, "style":value.style});
				}
			}
		});

		var rtnData = {
			'colGroupList' : colGroupList
			, 'titleList' : titleList
			, 'feildList' : feildList
			, 'styleList' : styleList
		};

		return rtnData;
	}, click : function (id, recid) {
		w2ui[id].click(recid, { metaKey: false });
	}, hideColumn : function (id, targetCols) {
		if (Array.isArray(targetCols)) {
			for (var i=0; i<targetCols.length; i++) {
				w2ui[id].hideColumn(targetCols[i]);
			}
		} else {
			w2ui[id].hideColumn(targetCols);
		}
	}, showColumn : function (id, targetCols) {
		if (Array.isArray(targetCols)) {
			for (var i=0; i<targetCols.length; i++) {
				w2ui[id].showColumn(targetCols[i]);
			}
		} else {
			w2ui[id].showColumn(targetCols);
		}
		GridUtils.refreshAll();
	}, setStyle : function (id, recId, style, bRefresh) {
		w2ui[id].get(recId)["w2ui"] = { "style": style };
		if (bRefresh) {
			w2ui[id].refresh();
		}
	}, clearStyle : function (id) {
		w2ui[id].records.forEach(function(vo, j) {
			vo["w2ui"] = { "style": "" };
		});
		w2ui[id].refresh();
	}, setRowData : function(gridId, formId){
		var recid = GridUtils.getSelectIndex(gridId)[0];
		w2ui[gridId].set(recid, ComUtils.getParams(formId));
	}, filter : function(gridId, searchFilter) {
		w2ui[gridId].search(searchFilter);
	}
	// MOD-000002
	, filterResultCount : function(gridId) {
		if (w2ui[gridId].searchData.length > 0) {
			return w2ui[gridId].last.searchIds.length;
		} else {
			return GridUtils.getAllData(gridId).length;
		}
	}, clearFilter : function(gridId) {
		w2ui[gridId].searchReset();
	}, focus : function(id, recid) {
		setTimeout(function() {
			w2ui[id].select(recid);
			w2ui[id].scrollIntoView(recid);
		}, 450);
	}
};
