
$(function(){
	//class value
	$.fn.getClassValue = function(key){
		var cl = $(this).attr("class");
		if(cl.indexOf(key) < 0)return "";
		var value = cl.split(key)[1].split(" ")[0];

		return value;
	};
	//location 정보 세팅
	setMenuLocation();
});

//date type 자동 변환 by jys
$a.data.control('date', {
	// change 이벤트 시점에 판단하는 기준이 됨.
	editable: true,
	// rendering 할 때 호출되는 함수.
	render: function(element, key, value, data, rule) {
		if(typeof value != 'string') {
			return;
		}
		var match = value.match(/(\d{4})(\d{2})(\d{2})/);
		if(match){
			$(element).val(match[1] + '-' + match[2] + '-' + match[3]);
		} else {
			return '';
		}
	},
	// 엘리먼트로 부터 값 읽어올 때 호출되는 함수
	data: function(element) {
		var data;
		if(element.tagName.toLowerCase() == 'input') {
			data = $(element).val();
		} else {
			data = $(element).text();
		}
		return data.replace(/\//g, '');
	}
});

//화면 팝업
function openCoreScreenPopup(callback) {
	var w = 1200;
	var h = 660;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/core/popup/PopupScreenList.do"
		, title: "화면 검색"
		, windowpopup: true
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}

//API 팝업
function openCoreApiPopup(callback) {
	var w = 1200;
	var h = 660;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/core/popup/PopupApiList.do"
		, title: "API 검색"
		, windowpopup: true
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}

/*
회원가입용 조직팝업(선택된 조직부터 하위까지만 나옴)
*/
function openCoreOrgPopup(callback) {
	var w = 550;
	var h = 750;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/popup/PopupOrgExpList.do?type=SKT&orgDivCd=01"
		, title: "조직 검색"
		, windowpopup: true
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}

//조직이 없는 사용자 팝업
function openUserNotOrgPopup(callback) {
	var w = 1200;
	var h = 560;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/popup/PopupUserNotInOrg.do"
		, title: "사용자 검색"
		, windowpopup: true
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}


//업무 팝업
function openCoreTaskPopup(callback, type, orgDivCd, orgGrpCd, orgId) {
	var w = 880;
	var h = 720;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/popup/PopupTaskList.do"
		, title: "업무 검색"
		, windowpopup: true
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}

//업무 팝업
function openCoreMultiTaskPopup(callback, type, orgDivCd, orgGrpCd, orgId) {
	var w = 900;
	var h = 720;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/popup/PopupTaskMultiList.do"
		, title: "담당업무 추가요청"
		, windowpopup: true
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}

//담당부서 팝업
function openCoreChrrOrgPopup(callback, userId) {
	
	$a.popup({
    	title : '담당부서 관리'
        ,url : '/tango-common-business-web/business/popup/PopupChrrOrg.do'
        ,iframe : true // default
        ,width : 550
        ,height : 450
        ,data : {'userId':userId}
        ,callback: callback
    });
}

function alert(content){
	alertDlg(content);
}

function alertDlg(content, callback, width, height){
	$('#alertDlg .Dialog-contents').html(content);
	$('#alertDlg').open({
        title:"",
        type : "close",
        width: width == undefined ? 300 : width,
        height: height == undefined ? 170 : height
    });
	$('.popup').removeAttr('style');
	$('#alertDlg').css('z-index','1000001');
	$('.Dialog-mask').css('z-index','1000000');
	if(callback != undefined && callback != null){
		$('#alertDlg').closed(callback);
		$('#alertDlg').cancel(callback);
	}
}

//Validate 공통함수
function getValidateResult(validator) {
	var $target;
	var result = validator.validate();
	if (!result) {
		var errorstr = '',
	        errormessages = validator.getErrorMessage();
	    for(var name in errormessages) {
		    $target = $('[name='+name+']');
	    	var item = $('[for='+name+']').text();
	    	errorstr = item + ': ' + errormessages[name][0];
	    	break;
	    }
	    //alert(errorstr);
	    callMsgBox('validationFail','I', errorstr, '');
	    $target.focus();
	    return false;
	}
	return true;
}



//type : close, okcancel
/*function confirmDlg(content, okCallback, cancelCallback, width, height){
	$('#alertDlg .Dialog-contents').html(content);
	$('#alertDlg').open({
        title:"",
        type : "okcancel",
        width: width == undefined ? 300 : width,
        height: height == undefined ? 170 : height
    });
	$('.popup').removeAttr('style');
	$('#alertDlg').css('z-index','1000001');
	$('.Dialog-mask').css('z-index','1000000');
	$('#alertDlg').ok(function(){
		okCallback();
		$('#alertDlg').close();
	});
	$('#alertDlg').cancel(function(){
		if(cancelCallback != null && cancelCallback != undefined)cancelCallback();
		$('#alertDlg').close();
	});

}*/

// 공지사항 팝업 열기
function openNoticePopup(anceMtrSrno) {

	var uri = 'tango-common-business-biz/common/business/board/notice';
	uri += anceMtrSrno != null ? '/' + anceMtrSrno : '?popupAnceYn=Y';

	var gridModel = Tango.ajax.init( { url:uri } );

	gridModel.get().done(function (response){

		if( response.lists == null ) {
			response.lists = [response];
		}

		$(response.lists).each(function(){

			// 하루동안 열지 않기 체크
			if( $.cookie(this.anceMtrSrno) != "done" || anceMtrSrno != null ) {

				var w = this.xaxPopupSzCd;
				var h = this.yaxPopupSzCd;

				$a.popup({
					  url: "/tango-common-business-web/business/board/notice/NoticeListPopup.do"
					, title: "공지사항"
					, data : { 'anceMtrSrno' : this.anceMtrSrno, 'height' : h }
					, width: w
					, height: h
					, center: true
					, iframe: true
					, modal : true
				});
			}
		});
	});
}
// 메뉴-화면 맵핑 중복체크
function openMenuScrnMappingCheck(addScrnList , callback) {
	var w = 1008;
	var h = 520;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/popup/PopupMenuScrnCheck.do"
		, title: "메뉴-화면 맵핑 중복 검사"
		, windowpopup: true
		, data : {'addScrnList' : addScrnList}
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}

// DextEditor
function creDextEditor(id, mode){

	var editor = document.createElement("script");
	editor.type  = "text/javascript";
	editor.text += " DEXT5.config.InitServerXml = '/tango-common-business-biz/dext/editorhandler.up?f=dext_editor.xml';";
	editor.text += " DEXT5.config.Mode = '"+ mode +"';"; // edit, view
	editor.text += " DEXT5.config.EditorHolder = 'editor_PlaceHolder_"+ id +"'; ";
	editor.text += " DEXT5.config.Width = '100%'; ";
	if(mode == 'view') {
		editor.text += " DEXT5.config.ViewModeAutoHeight = '1'; ";
		editor.text += " DEXT5.config.Height = '200px'; ";
	}
	editor.text += " new Dext5editor('"+ id +"'); ";

	$("#editor_"+id).append(editor);
}
function creDextEditorEx(id, mode,placeHolder){
	var editor = document.createElement("script");
	editor.type  = "text/javascript";
	editor.text += " DEXT5.config.InitServerXml = '/tango-common-business-biz/dext/editorhandler.up?f=dext_editor.xml';";
	editor.text += " DEXT5.config.Mode = '"+ mode +"';"; // edit, view
	editor.text += " DEXT5.config.EditorHolder ='" + placeHolder +"'; ";
	editor.text += " DEXT5.config.Width = '100%'; ";
	editor.text += " DEXT5.config.Height = '400px'; ";
	if(mode == 'view') {
		editor.text += " DEXT5.config.ViewModeAutoHeight = '1'; ";
		editor.text += " DEXT5.config.Height = '200px'; ";
	}
	editor.text += " new Dext5editor('"+ id +"'); ";

	$("#"+placeHolder).append(editor);
}
//DextEditor
function creDextUpload(id, mode, fileCnt){

	var uploader = document.createElement("script");
	uploader.type = "text/javascript";
	uploader.text += " DEXT5UPLOAD.config.Mode = '"+ mode +"';"; // edit, view

	if(''== fileCnt || null == fileCnt){
		fileCnt = '5';
	}
	var maxHeight = 100 + (21*fileCnt);
	uploader.text += " DEXT5UPLOAD.config.Height = '"+ maxHeight +"px'; ";

	if(mode == "edit"){
		uploader.text += " DEXT5UPLOAD.config.MaxTotalFileSize = '500MB';";
		uploader.text += " DEXT5UPLOAD.config.MaxTotalFileCount = '5';";
		uploader.text += " DEXT5UPLOAD.config.ButtonBarEdit = 'add,remove,remove_all';";
	}
	uploader.text += " DEXT5UPLOAD.config.UploadHolder = 'uploader_PlaceHolder_"+ id +"'; ";
	uploader.text += " new Dext5Upload('"+ id +"'); ";

	$("#uploader_"+id).append(uploader);
}

function getComCdList(elementId, type, grpCd, value,allType){

	var comCd = '';
	var uri = 'tango-common-business-biz/common/business/system/codes/' + grpCd;
	var allTypeLabel = allType == undefined ? '' : allType
	if(type == "select"){
		comCd =	Tango.select.init({
			el: '#'+ elementId,		// Select Element ID
			model: Tango.ajax.init({
				url: uri,
				flag:elementId
			}), 					// Select에 적용되는 model 지정.
			valueField: 'comCd', 	// data에서 option value에 지정할 field(key)
			labelField: 'comCdNm', 	// data에서 option text에 지정할 field(key)
			selected: value, 		// selected 지정. option value값으로 지정할 수 있다.
			allType : allTypeLabel
		});

	} else if(type == "checkbox"){

		var chkValues = value == "" ? [] : value;

		comCd =Tango.component.init({
			parent: '#'+ elementId,		// element가들어갈부모 dom영역지정. jquery selector규칙을따른다.
			model: Tango.ajax.init({
				url: uri,
				flag:elementId
			}),							// Tango.ajax.init Model 객체지정.
			type: 'checkbox',			// element type지정 (checkbox / radio 중선택)
			name: elementId,			// input element의 name 지정
			className: '',				// label에 className지정. 기본값은'ImageCheckbox'
			valueField: 'comCd',		// Model data에서 input element의 value로지정할 key
			labelField: 'comCdNm',		// Model data에서 input element의 text로지정할 key
			checked: chkValues				// rendering시 checked지정. 기본은 Array형태. 단일체크인경우 value string 형태가능 (생략가능 option)
		});
	}

	
	comCd.model.get().done(function(response, status, jqxhr, flag){
		
		if(flag == 'cnstAnceMtrDivCd' ){
			var tData = null;
			response.forEach(function(data){
				if(data.comCd == '9'){
					tData = data;
					response.pop();
				}				
			});
			response.unshift(tData);
		}
		comCd.render(response);
	});
}

//메뉴-화면 맵핑 중복체크
function openMenuList(callback) {
	var w = 630;
	var h = 720;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/popup/PopupSelectMenuList.do"
		, title: "메뉴 목록"
		, windowpopup: true
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}

//휴대폰 전화번호 관리 - 대표전화번호 팝업창
function openCelpTlno(callback , param) {
	var w = 630 ;
	var h = 610;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	var popup = $a.popup({
		url: "/tango-common-business-web/business/popup/PopupCelpTlnoList.do"
		, title: "휴대폰 전화번호 관리"
		, windowpopup: true
		, data : param
		, other: "width="+w+",height="+h+",top="+t+",left="+l+",scrollbars=no"
		, callback: callback
	});

	popupMakeSure(popup);
}
//휴대폰 전화번호 관리 - 대표전화번호 추가 팝업창
function openAddCelpTlno(callback,param) {
	var w = 370 ;
	var h = 200;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	$a.popup({
		url: "/tango-common-business-web/business/popup/PopupAddCelpTlno.do"
			, title: "휴대폰 전화번호 추가"
				, windowpopup: false
				, iframe : true
				, modal : true
				, center : true
				, width : w
				, height : h
				, callback: callback
				, data : param
	});
}

//휴대폰 전화번호 관리 - 대표전화번호 추가 팝업창
function openTaskRjct(callback,param) {
	var w = 500 ;
	var h = 250;
	var l = (screen.width-w)/2;
	var t = (screen.height-h)/2;

	$a.popup({
		url: "/tango-common-business-web/business/popup/PopupTaskRjct.do"
			, title: "담당업무 추가요청 반려"
				, windowpopup: false
				, iframe : true
				, modal : true
				, center : true
				, width : w
				, height : h
				, callback: callback
				, data : param
	});
}

// 화면 새로고침 하면 Session Storage 정보 초기화
function setClearParams() {
	$(window).on('keydown', function(event){
		if(event.keyCode == 116 || (event.keyCode == 82 && event.ctrlKey)){
	    	console.log(event.keyCode);
	    	$a.navigate(location.href);
		}
	});
}


//SHJI
//조회수 증가 여부를 판별
//sessionStorage에 존재 -> 조회수 증가 안함
//sessionStorage에 존재X -> sessionStorage 에 추가, 조회수 증가
//vo 에 alreadyReadYn 속성 추가
//dao 에 if문 추가
function alreadyReadCheck(key,seq){

	if($a.session('boardReadYn') != null && $a.session('boardReadYn') != "undefined"){
		var boardReadMap = $a.session('boardReadYn');
		var boardArr = boardReadMap[key];
		var Seq = _.find(boardArr,function(num){
			return num == seq;
		});

		if(Seq == undefined){
			if(boardReadMap[key] == undefined || boardReadMap[key] == null ){
				boardReadMap[key] = new Array();
			}
			boardReadMap[key].push(seq)
			alreadyReadYn = false;
			$a.session('boardReadYn',boardReadMap);
		} else {
			alreadyReadYn = true;
		}

	} else {
		var readArr =[];
		readArr.push(seq);
		var boardReadMap = {};
		boardReadMap[key] = readArr;
		$a.session('boardReadYn',boardReadMap);
		alreadyReadYn = false;
	}

	return alreadyReadYn;
}
//메뉴 초기화
function initMenus(){
	var url = 'tango-common-business-biz/main/menus/total';
	var totalMenu = Tango.ajax.init({url:url});
	totalMenu.get().done(function(menus){
		tangoMainInfo = {menus : menus};
		$a.session('tangoMainInfo',tangoMainInfo);
	});
}

//capslock 체크
function checkCapsLock(el){
	if($('body span[name=capsLockTootip]').length == 0){
		var html="<span name='capsLockTootip' class='tooltips'>&nbsp;<b>Caps Lock</b>이 켜져 있습니다.&nbsp;</sapn>";
		$('body').append(html);
	}
	el.on("keypress",function(e){
	    var keyCode = 0;
	    var shiftKey = false;
	    keyCode = e.keyCode;
	    shiftKey = e.shiftKey;
	    var tooltipTop = el.offset().top + el.height()/2 - 46;
	    if (((keyCode >= 65 && keyCode <= 90) && !shiftKey)|| ((keyCode >= 97 && keyCode <= 122) && shiftKey)) {
	    	$('span[name=capsLockTootip]').addClass('on');
	    	$('span[name=capsLockTootip]').offset({left:el.offset().left,top:tooltipTop})
	        setTimeout(function(){
	        	$('span[name=capsLockTootip]').removeClass('on');
	        }, 3500);
	    } else {
	    	$('span[name=capsLockTootip]').removeClass('on');
	    }
	});
}
//excel download
function excelDownload(targetGrid, url, key, title){
	var prog = $('body').progress();
	var data = $('.basic_condition').getData();
	if(key == undefined && title != undefined){
		key = [];
		title = [];
		var column = $('#' + targetGrid).alopexGrid('readOption').columnMapping;
		for(var i in column){
			key[i] = column[i].key;
			title[i] = column[i].title;
		}
	}
	data.key = key;
	data.title = title;

	var $form=$('<form></form>');
	$form.attr('name','downloadForm');
	$form.attr('id', 'downloadForm');
	$form.attr('action',url);
	$form.attr('method','get');
	$form.attr('target','downloadIframe');
	// 2016-11-인증관련 추가 file 다운로드시 추가필요
	$form.append(Tango.getFormRemote());
	$.each(data, function(key, value){
			$form.append($('<input />').attr('type', 'hidden').attr('name', key).attr('value', value));
	})
	$form.appendTo('body');
	$form.submit().remove();
	if (null != prog && 'undefined' != prog) {
			prog.remove();
	}
}

function setComma(str) {
	var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
	str += ""; // 숫자를 문자열로 변환
	str = str.replace(/[a-zA-Z]/gi, '');
	while ( reg.test(str) ) {
		str = str.replace(reg, "$1" + "," + "$2");
	}

	return str;
};




var recieverData = null;

// 수신자관리 팝업 호출
function  openConstructNoticeRecieverMgmt(){
	
	$a.popup({
      	popid: 'ConstructNoticeRecieverMgmt',
      	title: '수신자관리',
        url: '/tango-transmission-web/constructprocess/board/notice/ConstructNoticeRecieverMgmt.do',
        data: recieverData,
        windowpopup : true,
        modal: true,
        movable: true,			           			           
        width : 1410,
        height : 780,
	        callback: function(data){
	        	
	        	setRecvListData(data);
	        	
	        }
  	});
}; // openConstructNoticeRecieverMgmt();


// 메일 수신자 데이터 반환
function getMailRecvList(){
	return recieverData;
}

// 메일 발송


// 수신자 리스트 셋팅
function setRecvListData(data){
	
	if($.TcpUtils.isNotEmpty(data)){
		
		$('#listDiv').children().remove();
		$('#mailRecvList').append('<div id="listDiv" class="Display-inblock Valign-top "></div>');
		
		recieverData = data;
		
		var txt = ""; 
		
		if($.TcpUtils.isNotEmpty(data.recvList)){
			txt = "수신 : ";	        		
			if(data.recvList.length > 0){
				data.recvList.forEach(function(eachData){
					txt += eachData.userNm+", ";
				});	        			
				$('#listDiv').append("<p><span>"+txt.replace(/(\,\s)$/g,'')+"</span><p>");	        			
			}
		}
		
		if($.TcpUtils.isNotEmpty(data.refcList)){
			txt = "참조 : ";	        		
			if(data.refcList.length > 0){
				data.refcList.forEach(function(eachData){
					txt += eachData.userNm+", ";
				});
				$('#listDiv').append("<p><span>"+txt.replace(/(\,\s)$/g,'')+"</span><p>");	        			
			}
		}	        		
	}
}



// 수신자 영역 셋팅
function setRecvDiv(data){
	
	setRecvListData(data);
	
	if(data.frstRegUserId == $('#loginUserId').val()){
		
		$('#receiverMgmtBtn').css('display','');
		
		$('#updateNotice').css('display','');
		$('#removeNotice').css('display','');
		
		
		if(data.cnstAnceMtrDivCd == '9'){
			$('#receiverMgmtBtn').setEnabled(true);
			
			$('#listDiv').css("width","80%");
			
			$('#mailRecvList').append(
					'<div class="Display-inblock" style="margin-left:10px;">'								
					+'<p><button type="button" class="Button button2 bg_purple sendBtns" id="mailSendBtn" style="width:70px;">Mail발송</button></p>'									
					+'<p><button type="button" class="Button button2 bg_purple sendBtns" id="mmsSendBtn"  style="width:70px;">MMS발송</button></p>'																	
					+'</div>'	
					+'<div class="Display-inblock">'
					+'<p><input type="checkbox" class="Checkbox" id="mailSendChk" name="mailSendChk" data-bind="checked: mailSendChk" /></p>'
					+'<p><input type="checkbox" class="Checkbox" id="mmsSendChk" name="mmsSendChk" data-bind="checked: mmsSendChk" /></p>'
					+'</div>'
					);
			
			$a.convert($('#mailRecvList'));
			
			if($.TcpUtils.isNotEmpty(recieverData.emailSndDtm)){
				$('#mailSendChk').setChecked(true);
			}
			
			if($.TcpUtils.isNotEmpty(recieverData.mmsMsgTrmsDtm)){
				$('#mmsSendChk').setChecked(true);
			}
			
			$('#mailSendChk').setEnabled(false);
			$('#mmsSendChk').setEnabled(false);
			
			setRecvDivEvent();
			
		}else{
			$('#receiverMgmtBtn').setEnabled(false);
		}	
	}else{
		if(data.cnstAnceMtrDivCd != '9'){
			$('#updateNotice').css('display','');
			$('#removeNotice').css('display','');
		}else{
			$('#updateNotice').remove();
			$('#removeNotice').remove();
		}
		$('#receiverMgmtBtn').css('display','none');
	}
};// setRecvDiv()


// 구축공지공통 발신버튼 영역 event
function setRecvDivEvent(){
	$('#mailSendBtn').on('click',function(e){		
		noticeCommonSend('mail');
	});
	
	$('#mmsSendBtn').on('click',function(e){
		noticeCommonSend('mms');
	});
}


function noticeCommonSend(flag){
	
	var param = {};
	param.cnstAnceMtrSrno = $('#cnstAnceMtrSrno').val();
	param.sendFlag = flag;
	
	$('body').progress();
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmission/constructprocess/board/cnstAnceSend',
		data : param,
		method : 'POST'
	}).done(function(response){
		$('body').progress().remove();
		if(flag == 'mail'){
			$('#mailSendChk').setChecked(true)
		}else if(flag == 'mms'){
			$('#mmsSendChk').setChecked(true)
		}
		
		
		alertBox('I','발송되었습니다.');							
	})
	  .fail(function(response){$('body').progress().remove(); alertBox('I',"발송시 오류가 발생하였습니다. 담당자에게 문의하세요.[ "+response.message+"]");});
	
}

// 구축 공지 공통코드 호출 (임시)
function noticeCommonGetComCdList(id){
	switch(id){
	case 'prcsClCd' :
		
		var list = [];
		// list.push({'comCd':'','comCdNm':'선택'});
		list.push({'comCd':'01','comCdNm':'설계'});
		list.push({'comCd':'02','comCdNm':'예산'});
		list.push({'comCd':'03','comCdNm':'공정'});
		list.push({'comCd':'04','comCdNm':'정산'});
		list.push({'comCd':'05','comCdNm':'고장'});
		list.push({'comCd':'06','comCdNm':'시스템/프로세스'});
		list.push({'comCd':'07','comCdNm':'기타'});
		
		var comCd = Tango.select.init({
			el: '#'+ id,		// Select Element ID			
			valueField: 'comCd', 	// data에서 option value에 지정할 field(key)
			labelField: 'comCdNm', 	// data에서 option text에 지정할 field(key)
			selected: '', 		// selected 지정. option value값으로 지정할 수 있다.
			allType : '선택'
		});
		
		
		comCd.render(list);
//		$a.convert($('body')); 
//		$('#'+id).setSelected('');
		
		break;
	}
	
}




