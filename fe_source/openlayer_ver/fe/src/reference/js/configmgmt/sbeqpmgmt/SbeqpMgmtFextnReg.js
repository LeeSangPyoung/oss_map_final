/**
 * @author Administrator
 * @date 2018. 10. 22.
 * @version 1.0
 */

var sbeqpFextn = $a.page(function() {

    //초기 진입점
	var paramData = null;
	var sbeqpId = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$a.maskedinput($('#mnftDateReg')[0], '0000-00-00');
    	setEventListener();
    	paramData = param;
    	if (paramData.regYn == "Y") {
    		sbeqpId = {"sbeqpId":param.sbeqpId};
    		search();
    	}
    };

    this.fextnValChk =  function(){
    	var param =  $("#sbeqpMgmtFextnRegForm").getData();

    	if(param.capaVal == ''){
    		var msg = "필수입력 항목입니다.[ 용량 ]";
    		return msg;
    	}
    	if(param.fextnCnt == ''){
    		var msg = "필수입력 항목입니다.[ 대수 ]";
    		return msg;
    	}
    	if(param.rmsAcptStatCd == ''){
    		var msg = "필수입력 항목입니다.[ RMS 수용 ]";
    		return msg;
    	}
    	return "Y";
//    	if(param.capaVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 용량 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.fextnCnt == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 대수 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.rmsAcptStatCd == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ RMS 수용 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	return true;
    }

    this.sbeqpFextnReg = function(data) {
    	sbeqpId = data.sbeqpId;
    	var param =  $("#sbeqpMgmtFextnRegForm").getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'F';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);

	   	 if(param.mnftDate.length > 6) {
	 		var tmp = (param.mnftDate).split('-');
	     	param.mnftDate = tmp[0];
	 	 }
	   	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
	   	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpFextnMgmt', param, 'POST', 'SbeqpFextnReg');
    }

    function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnMgmt',sbeqpId, 'GET', 'search');
    }
    function setSelectCode() {

    }
    function undefinedCheck(data) {
    	if(data==undefined){
    		data='';
    	}
    	return data;
    }
    function setEventListener() {
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpFextnReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpFextnId') {
        	var param =  $("#sbeqpMgmtFextnRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpFextnMgmt', param, 'POST', 'SbeqpFextnReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpFextnMgmtList[0];
    		$('#sbeqpMgmtFextnRegForm').setData(result);
    	}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	parent.sbeqp.fail();
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