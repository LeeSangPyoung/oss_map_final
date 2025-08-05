/**
 * CardMdlReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {



    //초기 진입점
	var paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	paramData = null;

    	if(param.regYn == "Y"){
    		paramData = param;

    	}

    	initGrid();
        setEventListener();
        setSelectCode();
        setRegDataSet(paramData);

    };

    function initGrid() {

	}

  //장비모델ID 생성
    function setEqpMdlId(data) {

    }

    function setRegDataSet(data) {

     	data.pageNo = 1;
     	data.rowPerPage = 100;
    	if(data.regYn == "Y"){
    		$('#eqpMdlModForm').setData(data);
    	}
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }

    function setEventListener() {

    	// 파일추가
    	$('#btnUpload').on('click', function(e) {

    		if(paramData.atflNm.length > 0) {
    			callMsgBox('','I', '단일파일만 첨부가능합니다.' , function(msgId, msgRst){});
    			return;
    		}

    		$a.popup({
    			popid: 'EqpMdlFileUpload',
    			title: '장비모델 첨부파일 업로드',
    			url: '/tango-transmission-web/configmgmt/eqpmdlmgmt/EqpMdlFileUpload.do',
    			data: paramData,
    			windowpopup : true,
    			modal: true,
    			movable:true,
    			width : 380,
    			height : 200,
    			callback : function(data) { // 팝업창을 닫을 때 실행
    				if (data != null) {
    					if(data.Result = 'Success') {
    						callMsgBox('','I', '파일 업로드에 성공했습니다.', function(msgId, msgRst){});
        					httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlAtflUladInf', paramData, 'GET', 'eqpMdlAtflUladInf');
    					}
    				}
    			}
    		});
    	});

    	// 파일삭제
    	$('#btnUploadDel').on('click', function(e) {
    		var param =  $("#eqpMdlModForm").getData();

    		if(param.atflNm == undefined || param.atflNm == 'undefined' || param.atflNm == '') {
    			callMsgBox('','I', '삭제할 파일이 없습니다.' , function(msgId, msgRst){});
    			return;
    		}

    		callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			if (msgRst == 'Y') {
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/deleteEqpMdlAtflUladInf', param, 'GET', 'deleteEqpMdlAtflUladInf');
    			}
    		});
    	});

    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close(paramData);
         });

    	//저장
    	 $('#btnSaveReg').on('click', function(e) {

    		 var param =  $("#eqpMdlModForm").getData();

    		 var userId;
    		 if($("#userId").val() == ""){
    			 userId = "SYSTEM";
    		 }else{
    			 userId = $("#userId").val();
    		 }

    		 param.frstRegUserId = userId;
    		 param.lastChgUserId = userId;

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/updateEqpMdlInf', param, 'POST', 'eqpMdlMod');

         });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'eqpMdlMod') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		    	   var param =$("#eqpMdlIdReg").getData();

    		    	   $a.close(param);
    		       }
    		});

    	}

    	if(flag == 'eqpMdlAtflUladInf'){
    		paramData.atflNm = response.eqpMdlAtflUladInf[0].atflNm
    		paramData.atflSrno = response.eqpMdlAtflUladInf[0].atflSrno
//    		$('#eqpMdlAtfl').setData(paramData);


    		$('#atflNm').val(paramData.atflNm);
    		$('#atflSrno').val(paramData.atflSrno);
    	}

    	if(flag == 'deleteEqpMdlAtflUladInf'){
    		if(response.Result = 'Success'){
    			callMsgBox('','I', '파일을 삭제하였습니다.', function(msgId, msgRst){});
        		paramData.atflNm = "";
        		paramData.atflSrno="";
        		$('#atflNm').val("");
        		$('#atflSrno').val("");
    		} else{
    			//삭제를 실패 하였습니다.
        		callMsgBox('','I', configMsgArray['delFail'], function(msgId, msgRst){});
    		}

    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpMdlMod'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'deleteEqpMdlAtflUladInf'){
    		//삭제를 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['delFail'], function(msgId, msgRst){});
    	}
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

	$(document).on('keyup', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which :event.keyCode;
		if (charCode ==8 || charCode == 46 || charCode == 37 || charCode ==39) {
			return;
		}
		else {
			evt.target.value = evt.target.value.replace(/[^0-9\.]/g,"");
		}
	});

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
              });
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