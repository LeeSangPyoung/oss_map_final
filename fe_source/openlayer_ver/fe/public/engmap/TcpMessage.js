/**
 *  @Description    : Tango-T Message script
 *  @Create User    : KSY
 *  @Create Date    : 2016.08 .22
 */

$(document).ready(function() {
	//console.log("common.js loaded .. [$(document).ready()]");

	/* ---------------------------------------------------------------------
	 * 화면 Location HTML 삽입
	 * ---------------------------------------------------------------------
	 * <div id="main" class="main">
	 * <div class="location">
	 *		<ul>
	 *	  		<li>구축공정관리</li>
	 *			<li>준공</li>
     *			<li>준공서류제출(선로/관로)</li>
	 *	    </ul>
	 *		<a href="#" class="location_close">close</a>
	 *	</div>
	 * ---------------------------------------------------------------------
	 */
	if($("div.main .location").length != 0 && $('#mainMenuId').val() != ''){
		$("div.main .location ul").empty();
		var url = 'tango-common-business-biz/main/menus/locations/' + $('#mainMenuId').val();
		var locationModel = Tango.ajax.init({url:url});
		locationModel.get().done(function(response){
			var html = '';
			for(var i in response){
				html += '<li>'+response[i].menuNm+'</li>';
			}
			$("div.main .location ul").html(html);
		});
	}
});

(function ($) {
	$.TcpMsg = {
		// 입력된 객체가 null 또는 빈값이면 true를 반환
	    isEmpty : function(sStr) {
	        if (undefined == sStr || null == sStr) return true;
	        if ($.isArray(sStr)) {
	            if (sStr.length < 1) return true;
	        }
	        if ('string' === typeof sStr ) {
	            if ('' == sStr) return true;
	        }
	        return false;
	    },

	    // 입력된 객체가 null 또는 빈값이면 false를 반환
	    isNotEmpty : function(sStr) {
	        return !$.TcpMsg.isEmpty(sStr);
	    },

	    // 입력된 문자열의 Byte를 반환
	    getByteLengh : function(s) {
	    	if(s == null || s.length == 0) return 0;

	    	var size = 0;
	    	for(var i=0; i < s.length; i++){
	    		size += this.charByteSize(s.charAt(i));
	    	}

	    	return size;
	    },

   	    // 입력된 문자열을 Byte 단위로 잘라 반환
	    cutByteLength : function(s, len){
	    	if(s == null || s.length == 0) return 0;

	    	var size = 0;
	    	var rIndex = s.length;

	    	for(var i = 0; i < s.length; i++){
	    		size += this.charByteSize(s.charAt(i));
	    		if(size == len){
	    			rIndex = i + 1;
	    			break;
	    		}else if(size > len){
	    			rIndex = i;
	    			break;
	    		}
	    	}
	    	return s.substring(0, rIndex);
	    },

	    charByteSize : function(ch){
	    	if(ch == null || ch.length == 0) return 0;

	    	var charCode = ch.charCodeAt(0);

	    	if(charCode <= 0x00007F){
	    		return 1;
	    	}else if(charCode <= 0x0007FF){
	    		return 2;
	    	}else if(charCode <= 0x00FFFF){
	    		return 3;
	    	}else{
	    		return 4;
	    	}
	    }
	}

})(jQuery);

/* ---------------------------------------------------------------------
 * checkMsgBox(strId) 파라메터정의
 * strId          : Form ID
 * ---------------------------------------------------------------------
 * Check 항목 마크업관련 설명 (AlopexUI 가이드 Validator 부분 참조)
 * <input type="text" name='cstrCd' id="cstrCd" class="Textinput textinput w90"
 *				       data-alias="<spring:message code='label.construction'/>"
 *				       data-validation-rule="{required:true}"
 *				       data-validation-message="{required:'<spring:message code='message.required' arguments='{attr:data-alias}'/>'}">
 * ---------------------------------------------------------------------
 */
var checkMsgBox = function(strId, callBack){
	 if($.TcpMsg.isEmpty(strId)) return;

	 var formId = strId.replace(/#/, "");

	 var validator = $('#'+formId).validator();

	 	if(!validator.validate()){
	 		var errorstr = '';
	   		var errormessages = validator.getErrorMessage();

	   		for(var name in errormessages) {

	   			var validationElem = $('#'+formId).find('[name="'+name+'"]');
	   			var validationId = validationElem.prop('id');

	   			if($.TcpMsg.isNotEmpty(callBack) && typeof callBack == "function") {
	   				callMsgBox(validationId,'I', errormessages[name].join(""), callBack);
	   				break;
				}else{
					callMsgBox(validationId,'I', errormessages[name].join(""));
					break;
				}
		        //for(var i=0; i < errormessages[name].length; i++) {
		          //errorstr += errormessages[name][i] + '\n';
		        //}
		    }
	 	}else{
	 		if($.TcpMsg.isNotEmpty(callBack)) {
	 			if (typeof callBack == "function") {
					callBack.call(this, strId, ''); //Check에 걸리지 않은 경우 해당 elem ID를 알수 없으므로 Form ID를 던짐
		        }
			}else{
				return true;
			}
	 	}
}

/* ---------------------------------------------------------------------
 * alertBox(strMsgType, strMsgContent) 파라메터정의
 * strMsgType     : 메시지팝업타입(C:Confirm / W:Warning / I:Infomation)
 * strMsgContent  : 메시지내용
 * ---------------------------------------------------------------------
 */
var alertBox = function(strMsgType, strMsgContent){
	callMsgBox("", strMsgType, strMsgContent, "");
}

/* ---------------------------------------------------------------------
 * callMsgBox(strId, strMsgType, strMsgContent, callback) 파라메터정의
 * strId          : 버튼ID (callback구분용)
 * strMsgType     : 메시지팝업타입(C:Confirm / W:Warning / I:Infomation)
 * strMsgContent  : 메시지내용
 * callback       : 사용자 정의 Callback Function
 * ---------------------------------------------------------------------
 */
var callMsgBox = function(strId, strMsgType, strMsgContent, callback){

	var btnId = strId.replace(/#/, "");
	var strMsgByte = "";
	var minWidth = "280";
	var maxWidth = "500";
	var maxYn = "";
	var width = 0;
	var brCnt = 0;

	if($.TcpMsg.isNotEmpty(strMsgContent)){  // 입력 메시지 NULL처리
		// 개행이 존재하는 경우
		if(strMsgContent.indexOf("<br>") > -1){
			brCnt += Number(strMsgContent.split("<br>").length);

			for(var k=0; k < strMsgContent.split("<br>").length; k++){
				var rowStrMsg = strMsgContent.split("<br>")[k]+"";
				strMsgByte = $.TcpMsg.getByteLengh(rowStrMsg);

				if(Number(strMsgByte) * 5 > 500){
					maxYn = "Y";
					brCnt += parseInt(parseInt(Number(strMsgByte) * 5) / 500);
				}else{
					if(k == 0){
						width = Number(strMsgByte) * 5;
					}else{
						if(Number(strMsgByte) * 5 > width) width = Number(strMsgByte) * 5;
					}
				}
			}

			if(maxYn == "Y"){
				width = maxWidth;
			}else{
				if(Number(minWidth) > Number(width)) width = minWidth;
			}
		}else{
			strMsgByte = $.TcpMsg.getByteLengh(strMsgContent);
			if(Number(strMsgByte) * 5 > 500){
				width = maxWidth;
				brCnt += parseInt(parseInt(Number(strMsgByte) * 5) / 500);
			}else{
				width = Number(strMsgByte) * 5;
				if(Number(minWidth) > Number(width)) width = minWidth;
			}
		}
	}else{
		alert('메시지없음!');
		return;
	}

	var height = 160 + (Number(brCnt) * 15); //개행별 18 증가
	var title = "";
	var content = "";
	var type = "blank";
	var btnDivHtml = [];

	//alert("width : "+width+"     height : "+height);

	/* ----------------------------------
	 * type 종류 (기존 Aloxpex UI)
	 * ----------------------------------
	 * null     : default
	 * blank    : 헤더포함
	 * close    : Close 버튼 포함
	 * confirm  : Confirm 버튼 포함
	 * okcancel : OK, CANCEL 버튼 포함
	 */
	 if($.TcpMsg.isNotEmpty(strMsgType)) {
		 if(strMsgType == "C"){ // Confirm
			 title = "(C) 확인";
			 btnDivHtml = "<button type='button' msgRst='Y' class='Button button2 confirm_btn btnMsg'>확인</button>";
			 btnDivHtml += "&nbsp;<button type='button' msgRst='N' class='Button button2 cancel_btn btnMsg'>취소</button>";
		 }else if(strMsgType == "W"){ // Warning
			 title = "(W) 경고";
			 btnDivHtml = "<button type='button' msgRst='Y' class='Button button2 confirm_btn btnMsg'>확인</button>";
		 }else if(strMsgType == "I"){ // Info
			 title = "(I) 알림";
			 btnDivHtml = "<button type='button' msgRst='Y' class='Button button2 confirm_btn btnMsg'>확인</button>";
		 }else if(strMsgType == "C1"){ // Confirm1
			 title = "(C) 확인";
			 btnDivHtml = "<button type='button' msgRst='Y' class='Button button2 save_btn btnMsg'>예</button>"; 
			 btnDivHtml += "&nbsp;<button type='button' msgRst='N' class='Button button2 reg_btn btnMsg'>아니요</button>";
			 btnDivHtml += "<input type='hidden' msgRst='Z' class='btnMsg'/>"; // x 버튼 
		 }else{
			 btnDivHtml = "<button type='button' msgRst='' class='Button button2 confirm_btn btnMsg'>닫기</button>";
		 }
	 }

	 if($.TcpMsg.isNotEmpty(strMsgContent)) {
		 content = strMsgContent;
	 }

	var msgHtml = [];

	if($('#dialogMsg').length != 0){
		$('#dialogMsg').remove();
	}

	//if($('#dialogMsg').length == 0){
		//msgHtml.push("  <div id='dialogMsg' class='Dialog'>");
		//msgHtml.push("		<div class='Dialog-contents color_black' style='word-break:break-all; word-wrap:break-word;'>");
		msgHtml.push("		<div class='Dialog-contents color_black' style='word-wrap:break-word;'>");
		msgHtml.push(content);
		msgHtml.push("		<div class='button_box' style='margin-top:45px;'>");
		msgHtml.push(btnDivHtml);
		msgHtml.push("		</div>");
		msgHtml.push("      </div>");
		//msgHtml.push("  </div>");

		//$("#"+btnId).after(msgHtml.join(""));
		var msgDiv = document.createElement("div");
		msgDiv.setAttribute("id","dialogMsg");
		msgDiv.setAttribute("class","Dialog");
		document.body.appendChild(msgDiv);
		msgDiv.innerHTML = msgHtml.join("");

		$a.convert($("#dialogMsg"));
		//$("#"+btnId).parent().append(msgHtml.join("")).trigger("create");

		$(".btnMsg").on('click',function() {
			if($.TcpMsg.isNotEmpty(callback)) {
				$('#dialogMsg').close().remove();
				if (typeof callback == "function") {
					callback.call(this, btnId, $(this).attr("msgRst"));
		        }
			}else{
				$('#dialogMsg').close().remove();
			}
		});
	//}

    $('#dialogMsg').open({
	    title: title,
	    width: width,
	    height: height,
	    type : type,
	    resizable: false,
	    toggle: false,
	    movable: true,
	    modal: true,
	    animation: "show", //fade, slide
	    xButtonClickCallback : function(el){ // x버튼 처리
	    	$(".btnMsg").last().trigger('click');
	    }
	    //animationtime: 200
	  });

      /*
	  $('#dialogMsg').close(function() {
	  	alert('닫기');
	  });

	  $('#dialogMsg').cancel(function() {
		  $('#dialogMsg').close();
	  });
	  $('#dialogMsg').ok(function() {
	  	$('#dialogMsg').close();
	  });
	  $('#dialogMsg').confirm(function() {
	  	$('#dialogMsg').close();
	  });
	  */
}