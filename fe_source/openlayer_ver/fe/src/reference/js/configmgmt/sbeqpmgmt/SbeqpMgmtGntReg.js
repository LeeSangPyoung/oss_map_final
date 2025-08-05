/**
 * @author Administrator
 * @date 2018. 10. 22.
 * @version 1.0
 */

var sbeqpGnt = $a.page(function() {

    //초기 진입점
	var paramData = null;
	var sbeqpId = null;
	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,6}([.]\d{0,3})?)|[0-9]([.]\d{0,3})?$/);
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$a.maskedinput($('#gntPartMdlMnftYmReg')[0], '0000-00');
    	$a.maskedinput($('#atsPartMdlMnftYmReg')[0], '0000-00');

    	setEventListener();
    	paramData = param;
    	if (paramData.regYn == "Y") {
    		sbeqpId = {"sbeqpId":param.sbeqpId};
    		search();
    	}
    };

    this.gntValChk =  function(){
    	var param =  $("#sbeqpMgmtGntRegForm").getData();

    	if(param.gntTyp == ''){
    		var msg = "필수입력 항목입니다.[ 발전기 유형 ]";
    		return msg;
    	}
    	if(param.rmsAcptStatCd == ''){
    		var msg = "필수입력 항목입니다.[ RMS 수용 ]";
    		return msg;
    	}
    	if(param.gntPartMdlNm == ''){
    		var msg = "필수입력 항목입니다.[ 발전기부 모델 ]";
    		return msg;
    	}
    	if(param.gntPartVendNm == ''){
    		var msg = "필수입력 항목입니다.[ 발전기부 제조사 ]";
    		return msg;
    	}
    	if(param.gntPartMdlMnftYm == ''){
    		var msg = "필수입력 항목입니다.[ 발전기부 제조년월 ]";
    		return msg;
    	}
    	if(param.gntPartObizPrtVal == ''){
    		var msg = "필수입력 항목입니다.[ 발전기부 상용출력 ]";
    		return msg;
    	}
    	if(param.gntPartEmgncPrtVal == ''){
    		var msg = "필수입력 항목입니다.[ 발전기부 비상출력 ]";
    		return msg;
    	}
    	if(param.engnPartMdlNm == ''){
    		var msg = "필수입력 항목입니다.[ 엔진부 모델 ]";
    		return msg;
    	}
    	if(param.engnPartVendNm == ''){
    		var msg = "필수입력 항목입니다.[ 엔진부 제조사 ]";
    		return msg;
    	}
    	if(param.staExusBatryMdlNm == ''){
    		var msg = "필수입력 항목입니다.[ 시동용 축전지 모델 ]";
    		return msg;
    	}
    	if(param.staExusBatryVendNm == ''){
    		var msg = "필수입력 항목입니다.[ 시동용 축전지 제조사 ]";
    		return msg;
    	}
    	if(param.fuelTankVal == ''){
    		var msg = "필수입력 항목입니다.[ 탱크 용량 ]";
    		return msg;
    	}
    	if(param.atsPartMdlNm == ''){
    		var msg = "필수입력 항목입니다.[ ATS 모델 ]";
    		return msg;
    	}
    	if(param.atsPartVendNm == ''){
    		var msg = "필수입력 항목입니다.[ ATS 제조사 ]";
    		return msg;
    	}
    	if(param.atsPartMdlMnftYm == ''){
    		var msg = "필수입력 항목입니다.[ ATS 제조년월 ]";
    		return msg;
    	}
    	if(param.atsPartCapaVal == ''){
    		var msg = "필수입력 항목입니다.[ ATS 용량 ]";
    		return msg;
    	}
    	return "Y";
//    	if(param.gntTyp == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 발전기 유형 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.rmsAcptStatCd == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ RMS 수용 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.gntPartMdlNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 발전기 모델 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.gntPartVendNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 발전기 제조사 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.gntPartMdlMnftYm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 발전기 제조년월 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.gntPartObizPrtVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 발전기 상용출력 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.gntPartEmgncPrtVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 발전기 비상출력 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.engnPartMdlNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 엔진부 모델 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.engnPartVendNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 엔진부 제조사 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.staExusBatryMdlNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 시동용 축전지 모델 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.staExusBatryVendNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 시동용 축전지 제조사 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.fuelTankVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ 탱크 용량 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.atsPartMdlNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ ATS 모델 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.atsPartVendNm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ ATS 제조사 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.atsPartMdlMnftYm == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ ATS 제조년월 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	if(param.atsPartCapaVal == ''){
//    		callMsgBox('','I', '필수입력 항목입니다.[ ATS 용량 ]', function(msgId, msgRst){});
//    		return false;
//    	}
//    	return true;
    }

    this.sbeqpGntReg = function(data) {
    	sbeqpId = data.sbeqpId;
    	var param =  $("#sbeqpMgmtGntRegForm").getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'N';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);

    	if(param.gntPartMdlMnftYm.length > 4) {
    		var tmp = (param.gntPartMdlMnftYm).split('-');
    		param.gntPartMdlMnftYm = tmp[0];
    	}
	   	 if(param.atsPartMdlMnftYm.length > 4) {
		 		var tmp = (param.atsPartMdlMnftYm).split('-');
		     	param.atsPartMdlMnftYm = tmp[0];
	 	 }
	   	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
	   	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpGntMgmt', param, 'POST', 'SbeqpGntReg');
    }

    function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpGntMgmt',sbeqpId, 'GET', 'search');
    }
    function setSelectCode() {

    }
    function undefinedCheck(data) {
    	if(data==undefined){
    		data='';
    	}
    	return data;
    }
    function modelSearch(data1, data2){
  		 var param = {"sbeqpClCd": data1};
   		 param.fix = "Y";
   		 param.sbeqpClLowCd = data2;
   		 $a.popup({
   	          	popid: 'SbeqpMdlLkup',
   	          	title: '부대장비모델조회',
   	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMdlLkup.do',
   	            data: param,
   	            modal: true,
                movable:true,
                windowpopup : true,
   	            width : 950,
   	           	height : window.innerHeight * 1.5,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	           		if(data.sbeqpClLowCd){
	   	     			switch(data.sbeqpClLowCd){
		   	    			case 'N':
		   	    				$('#gntPartMdlId').val(data.sbeqpMdlId);
		   	    				$('#gntPartMdlNmReg').val(data.sbeqpMdlNm);
		   	    				$('#gntPartVendNmReg').val(data.sbeqpVendNm);
		   	    				break;
		   	    			case 'E':
		   	    				$('#engnPartMdlId').val(data.sbeqpMdlId);
		   	    				$('#engnPartMdlNmReg').val(data.sbeqpMdlNm);
		   	    				$('#engnPartVendNmReg').val(data.sbeqpVendNm);
		   	    				break;
		   	    			case 'A':
		   	    				$('#atsPartMdlId').val(data.sbeqpMdlId);
		   	    				$('#atsPartMdlNmReg').val(data.sbeqpMdlNm);
		   	    				$('#atsPartVendNmReg').val(data.sbeqpVendNm);
		   	    				break;
		   	    			default :
		   	    				break;
	   	    			}
   	           		}
   	           		else{
   	    				$('#staExusBatryMdlId').val(data.sbeqpMdlId);
   	    				$('#staExusBatryMdlNmReg').val(data.sbeqpMdlNm);
   	    				$('#staExusBatryVendNmReg').val(data.sbeqpVendNm);
   	           		}
   	           	}
   	      });
    }
    function setEventListener() {
    	//부대장비 발전기모델조회
	   	 $('#btnGntMdlSearch').on('click', function(e) {
	   		modelSearch("N","N");
	   	 });
	   	 //부대장비 엔진모델조회
	   	 $('#btnEngnMdlSearch').on('click', function(e) {
	   		 modelSearch("N","E");
	   	 });
	   	 //부대장비 시동용 축전지모델조회
	   	 $('#btnStaExusBatryMdlSearch').on('click', function(e) {
	   		 modelSearch("B","");
	   	 });
	   	 //부대장비 발전기모델조회
	   	 $('#btnAtsMdlSearch').on('click', function(e) {
	   		 modelSearch("N","A");
	   	 });
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpGntReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpGntId') {
        	var param =  $("#sbeqpMgmtGntRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpGntMgmt', param, 'POST', 'SbeqpGntReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpGntMgmtList[0];
    		$('#sbeqpMgmtGntRegForm').setData(result);
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