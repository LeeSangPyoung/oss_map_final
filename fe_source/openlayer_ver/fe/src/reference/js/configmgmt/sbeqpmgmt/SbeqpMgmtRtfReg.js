/**
 * @author Administrator
 * @date 2018. 10. 22.
 * @version 1.0
 */

var sbeqpRtf = $a.page(function() {

    //초기 진입점
	var paramData = null;
	var sbeqpId = null;
	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,6}([.]\d{0,3})?)|[0-9]([.]\d{0,3})?$/);
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setEventListener();
    	paramData = param;
    	if (paramData.regYn == "Y") {
    		sbeqpId = {"sbeqpId":param.sbeqpId};
    		search();
    	}
    };



    this.rtfValChk =  function(){
    	var param =  $("#sbeqpMgmtRtfRegForm").getData();

    	 if(param.engStdDivNo == ''){
 			var msg = "필수입력 항목입니다.[ ENG기준 구분 ]";
 			return msg;
 	 	}
     	if(param.brRlesStatCd == ''){
     		var msg = "필수입력 항목입니다.[ BR해제 여부 ]";
     		return msg;
     	}
     	if(param.rmsAcptStatCd == ''){
     		var msg = "필수입력 항목입니다.[ RMS수용 여부 ]";
     		return msg;
     	}
     	if(param.eqrstRfctStatCd == ''){
     		var msg = "필수입력 항목입니다.[ 내진보강 완료 여부 ]";
     		return msg;
     	}
     	if(param.combMeansDivNo == ''){
     		var msg = "필수입력 항목입니다.[ 결선 방식 ]";
     		return msg;
     	}
     	if(param.insVoltVal == ''){
     		var msg = "필수입력 항목입니다.[ 입력전압 값 ]";
     		return msg;
     	}
     	if(param.cgrVcurLimt == ''){
     		var msg = "필수입력 항목입니다.[ 충전전류 제한 값 ]";
     		return msg;
     	}
     	if(param.repLoadNm == ''){
     		var msg = "필수입력 항목입니다.[ 대표부하명 ]";
     		return msg;
     	}
     	return "Y";

//	    if(param.engStdDivNo == ''){
//			callMsgBox('','I', '필수입력 항목입니다.[ ENG기준 구분 ]', function(msgId, msgRst){});
//			return false;
//	 	}
//    	if(param.brRlesStatCd == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ BR해제 여부 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.rmsAcptStatCd == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ RMS수용 여부 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.eqrstRfctStatCd == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 내진보강 완료 여부 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.combMeansDivNo == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 결선 방식 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.insVoltVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 입력전압 값 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.cgrVcurLimt == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 충전전류 제한 값 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.repLoadNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 대표부하명 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	return true;
    }

    this.sbeqpRtfReg = function(data) {
    	sbeqpId = data.sbeqpId;
    	var param =  $("#sbeqpMgmtRtfRegForm").getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;

    	param.sbeqpId = sbeqpId;
    	param.voltVal = '1';
    	param.sbeqpClCd = 'R';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);
    	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
    	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpRtfMgmt', param, 'POST', 'SbeqpRtfReg');
    }

    function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpRtfMgmt',sbeqpId, 'GET', 'search');
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
    	$('#btnrepLoadNmSearch').on('click', function(e) {
    		var param = {"mtsoNm": $('#sbeqpInstlMtsoNmReg', parent.document).val(),
    						 "tmofNm": $('#tmofNmReg', parent.document).val(),
    						 "teamNm": $('#teamNmReg', parent.document).val(),
    						 "orgId": $('#orgIdReg', parent.document).val(),
    						 "mgmtGrpNm": $('#mgmtGrpNmReg', parent.document).val()
    		};
	   		 $a.popup({
	   	          	popid: 'EqpLkup',
	   	          	title: '장비조회',
	   	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpEqpLkup.do',
	   	            data: param,
    	            modal: true,
                    movable:true,
                    windowpopup : true,
	   	            width : 950,
	   	           	height : window.innerHeight * 3,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
	   	           		$('#repLoadNmReg').val(data.eqpNm);
	   	           		$('#repLoadNm').val(data.eqpId);
	   	           	}
	   	      });
    	});
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpRtfReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpRtfId') {
        	var param =  $("#sbeqpMgmtRtfRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpRtfMgmt', param, 'POST', 'SbeqpRtfReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpRtfMgmtList[0];
    		$('#sbeqpMgmtRtfRegForm').setData(result);
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