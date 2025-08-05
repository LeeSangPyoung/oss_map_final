/**
 * @author Administrator
 * @date 2018. 10. 22.
 * @version 1.0
 */

var sbeqpArcn = $a.page(function() {

    //초기 진입점
	var paramData = null;
	var sbeqpId = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setEventListener();
    	paramData = param;
    	if (paramData.regYn == "Y") {
    		sbeqpId = {"sbeqpId":param.sbeqpId};
    		search();
    	}
    };

    this.arcnValChk =  function(){
    	var param =  $("#sbeqpMgmtArcnRegForm").getData();

    	if(param.capaVal == ''){
    		var msg = "필수입력 항목입니다.[ 용량 ]";
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
//    	if(param.rmsAcptStatCd == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ RMS 수용 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	return true;
    }

    this.sbeqpArcnReg = function(data) {
    	sbeqpId = data.sbeqpId;
    	var param =  $("#sbeqpMgmtArcnRegForm").getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'A';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);
    	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
    	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpArcnMgmt', param, 'POST', 'SbeqpArcnReg');
    }

    function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpArcnMgmt',sbeqpId, 'GET', 'search');
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
    	if(flag == 'SbeqpArcnReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpArcnId') {
        	var param =  $("#sbeqpMgmtArcnRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpArcnMgmt', param, 'POST', 'SbeqpArcnReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpArcnMgmtList[0];
    		$('#sbeqpMgmtArcnRegForm').setData(result);
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