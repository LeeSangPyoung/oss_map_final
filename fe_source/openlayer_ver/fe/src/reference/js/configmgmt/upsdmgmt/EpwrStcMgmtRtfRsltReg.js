/**
 * EpwrStcMgmtRtfRsltReg.js
 *
 * @author Administrator
 * @date 2018. 02. 21.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param
    	$('#sbeqpId').val(param.sbeqpId)
    	if(param.stat == 'add'){
    		$('#rtfRsltMod').hide();
    		$('#rtfRsltAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#rtfRsltAdd').hide();
    		$('#rtfRsltMod').show();
    		setData(param)
    	}
    	setEventListener();
    };

    function setData(param) {
		$('#EpwrStcMgmtRtfRsltRegForm').setData(param);

    }

    function setEventListener() {
    	//취소
    	 $('#btnRtfRsltCncl').on('click', function(e) {
    		 $a.close();
         });

    	//등록
    	 $('#btnRtfRsltReg').on('click', function(e) {
/*    		 if($('#csType').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용도구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 rtfRsltReg();
		        }
		     });
         });
    	 //수정
    	 $('#btnRtfRsltMod').on('click', function(e) {
    		 /*    		 if($('#csType').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용도구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rtfRsltReg();
    			 }
    		 });
    	 });
    	 //삭제
    	 $('#btnRtfRsltDel').on('click', function(e) {
    		 /*    		 if($('#csType').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용도구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rtfRsltDel();
    			 }
    		 });
    	 });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'rtfRsltReg') {
    		if(response.Result == "Success"){
	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		           $a.close();
	    		       }
	    		});
    		}
            var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:rtf.setGrid("+pageNo+","+rowPerPage+");");
    	}
    	if(flag == 'rtfRsltDel') {
    		if(response.Result == "Success"){
    			//삭제 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close();
    				}
    			});
    		}
    		var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:rtf.setGrid("+pageNo+","+rowPerPage+");");
    	}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'rtfRsltReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'rtfRsltDel'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function rtfRsltReg() {
    	var param =  $("#EpwrStcMgmtRtfRsltRegForm").getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsertRtfDcghTest', param, 'POST', 'rtfRsltReg');
    }

    function rtfRsltDel() {
    	var param =  $("#EpwrStcMgmtRtfRsltRegForm").getData();
    	param.msmtNo = paramData.msmtNo;
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsertRtfDcghTest', param, 'POST', 'rtfRsltDel');
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