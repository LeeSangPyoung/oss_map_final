/**
 * EpwrStcMgmtRprReg.js
 *
 * @author Administrator
 * @date 2018. 02. 13.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	//setSelectCode();
    	console.log(param);
    	setEventListener();
    	paramData = param;
		setData(param);
    };

    function setData(param) {
    	$('#MtsoPueRegRegForm').setData(param);

    	if (param.regYn == 'Y') {
    		$('#btnMtsoPueDel').show();
    	} else {
    		$('#btnMtsoPueDel').hide();
    	}
    }

    function setSelectCode() {
    }

    function setEventListener() {
    	//취소
    	 $('#btnMtsoPueCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnMtsoPueReg').on('click', function(e) {
    		 if ($('#mtsoNm').val() == '') {
    			 callMsgBox('','I', '필수 입력 항목입니다.[ 국사 ]', function(msgId, msgRst){});
    			 return;
    		 }

    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 mtsoPeuReg();
    			 }
    		 });
         });


    	 //삭제
    	 $('#btnMtsoPueDel').on('click', function(e) {
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 mtsoPueDel();
    			 }
    		 });
    	 });

    	 //국사조회
    	 $('#btnUpsdMtsoSearch').on('click',function(e) {
    		 $a.popup({
     		 	popid: 'MtsoLkup',
 	          	title: configMsgArray['findMtso'],
 	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
 	            windowpopup : true,
 	            modal: true,
 	            movable:true,
 	            width : 950,
 	           	height : 800,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	                $('#mtsoId').val(data.mtsoId);
 	   				$('#mtsoNm').val(data.mtsoNm);
 	   				$('#bldAddr').val(data.bldAddr);
 	   				$('#bldCd').val(data.bldCd);
 	   				$('#orgNm').val(data.orgNm);
 	   				var param = {mtsoId : data.mtsoId};
 	   				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoPue', param, 'GET', 'searchInfo');

 	           	}
     		 });
    	 });

    	//취소
    	 	$('#btnClose').on('click', function(e) {
    	 		$a.close();
         });
	};

	$(document).on('keypress', "[id='t1RtfUseVal']", function(evt){
		fnRtfUseSumrVal();
	});

	$(document).on('keypress', "[id='t2RtfUseVal']", function(evt){
		fnRtfUseSumrVal();
	});

	$(document).on('keyup', "[id='t1RtfUseVal']", function(evt){
		fnRtfUseSumrVal();
	});

	$(document).on('keyup', "[id='t2RtfUseVal']", function(evt){
		fnRtfUseSumrVal();
	});

	function fnRtfUseSumrVal() {
		var t1RtfUseVal = $('#t1RtfUseVal').val();
	   	var t2RtfUseVal = $('#t2RtfUseVal').val();

	   	if (isNaN(parseInt(t1RtfUseVal))) { t1RtfUseVal = 0; }
	   	if (isNaN(parseInt(t2RtfUseVal))) { t2RtfUseVal = 0; }

	   	var rtfUseSumrVal = parseInt(t1RtfUseVal) + parseInt(t2RtfUseVal);
   		$('#rtfUseSumrVal').val(rtfUseSumrVal);
	}

	$(document).on('keypress', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode;
    	var _value = $(this).val();
		if (event.keyCode < 48 || event.keyCode > 57) {
			if (event.keyCode != 46) {
				return false;
			}
		}
		var _pattern = /^\d*[.]\d*$/;	// . 체크
		if(_pattern.test(_value)) {
			if(charCode == 46) {
				return false;
			}
		}

		var _pattern1 = /^\d*[.]\d{3}$/;	// 소수점 3자리까지만
		if(_pattern1.test(_value)) {
			return false;
		}
    	return true;
	});

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'mtsoPueReg'){
			$a.close();
			var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:pue.setGrid("+pageNo+","+rowPerPage+");");
		}

		if(flag == 'mtsoPueDel') {

    		$a.close();
    		var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:pue.setGrid("+pageNo+","+rowPerPage+");");
    	}
		if(flag == 'searchInfo') {
			var result = response.MtsoPue;

			if (result.length > 0) {
				$('#mtsoId').val("");
	   				$('#mtsoNm').val("");
	   				$('#bldAddr').val("");
	   				$('#bldCd').val("");
	   				$('#orgNm').val("");

	   				callMsgBox('','W', '등록된 국사가 존재합니다. 다시 검색하여 주시기 바랍니다.' , function(msgId, msgRst){});
			}
    	}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'mtsoEnvReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function mtsoPeuReg(){
    	var param = $('#MtsoPueRegRegForm').getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.userId = userId;

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/mergeMtsoPue', param, 'POST', 'mtsoPueReg');

    }

    function mtsoPueDel(){
    	var param = $('#MtsoPueRegRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteMtsoPue', param, 'POST', 'mtsoPueDel');
    }


    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
});