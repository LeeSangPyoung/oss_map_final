/**
 * @author Administrator
 * @date 2018. 10. 22.
 * @version 1.0
 */

var sbeqpBatry = $a.page(function() {
	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,6}([.]\d{0,3})?)|[0-9]([.]\d{0,3})?$/);
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



    this.batryValChk =  function(){
    	var param =  $("#sbeqpMgmtBatryRegForm").getData();

    	if(param.rtfNm == ''){
			var msg = "필수입력 항목입니다.[ 정류기 명 ]";
			return msg;
	 	}
    	if(param.voltVal == ''){
    		var msg = "필수입력 항목입니다.[ 전압 ]";
    		return msg;
    	}
    	if(param.cellCnt == ''){
    		var msg = "필수입력 항목입니다.[ Cell 개수 ]";
    		return msg;
    	}
    	if(param.cblPceCnt == ''){
    		var msg = "필수입력 항목입니다.[ 가닥수 ]";
    		return msg;
    	}
    	if(param.capaVal == ''){
    		var msg = "필수입력 항목입니다.[ 용량 ]";
    		return msg;
    	}
    	return "Y";
//	    if(param.rtfNm == ''){
//			callMsgBox('','I', '필수입력 항목입니다.[ 정류기 명 ]', function(msgId, msgRst){});
//			return false;
//	 	}
//    	if(param.voltVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 전압 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.cellCnt == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ Cell 개수 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.cblPceCnt == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 가닥수 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.capaVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 용량 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	return true;
    }

    this.sbeqpBatryReg = function(data) {
    	sbeqpId = data.sbeqpId;
    	var param =  $("#sbeqpMgmtBatryRegForm").getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'B';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);
    	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
    	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];   	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpBatryMgmt', param, 'POST', 'SbeqpBatryReg');
    }

    function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryMgmt',sbeqpId, 'GET', 'search');
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
    	$('#btnRtfSearch').on('click', function(e) {
    		var param = {"sbeqpClCd": "R", "fix": "Y",
    				 		 "mtsoNm": $('#sbeqpInstlMtsoNmReg', parent.document).val(),
    				 		 "tmofNm": $('#tmofNmReg', parent.document).val(),
    				 		 "teamNm": $('#teamNmReg', parent.document).val(),
    				 		 "orgId": $('#orgIdReg', parent.document).val(),
    				 		 "mgmtGrpNm": $('#mgmtGrpNmReg', parent.document).val()
    		};

	   		 $a.popup({
	   	          	popid: 'EqpLkup',
	   	          	title: '장비조회',
	   	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpLkup.do',
	   	            data: param,
    	            modal: true,
                    movable:true,
                    windowpopup : true,
	   	            width : 950,
	   	           	height : window.innerHeight * 3,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
	   	           		$('#rtfIdReg').val(data.eqpId);
	   	           		$('#rtfNmReg').val(data.eqpNm);
	   	           		$('#rtfMdlNmReg').val(data.sbeqpMdlNm);
	   	           	}
	   	      });
    	});
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpBatryReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpBatryId') {
        	var param =  $("#sbeqpMgmtBatryRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpBatryMgmt', param, 'POST', 'SbeqpBatryReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpBatryMgmtList[0];
    		$('#sbeqpMgmtBatryRegForm').setData(result);
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