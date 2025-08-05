/**
 * SbeqpMgmtGageReg.js
 */
var sbeqpGage = $a.page(function() {
    //초기 진입점
	var paramData = null;
	var sbeqpId = null;

//	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,9}([.]\d{0,3})?)?$/);
	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,6}([.]\d{0,3})?)|[0-9]([.]\d{0,3})?$/);
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	setEventListener();
    	setSelectCode();
    	paramData = param;
    	if (paramData.regYn == "Y") {
    		sbeqpId = {"sbeqpId":param.sbeqpId};
    		search();
    	}
    };

	this.gageValChk = function() {
		var param = $("#sbeqpMgmtGageRegForm").getData();

		if (param.instlFlor == "") {
			//필수입력 항목입니다.[ 설치 층 ]
			var msg = "필수입력 항목입니다.[ 설치 층 ]";
			return msg;
		}
		if (param.ctrtEpwrRcvgMeansCd == "") {
			//필수입력 항목입니다.[ 수전방식 ]
			var msg = "필수입력 항목입니다.[ 수전방식 ]";
			return msg;
		}
		if (param.rcvgLoc == "") {
		//필수입력 항목입니다.[ 수전위치 ]
			var msg = "필수입력 항목입니다.[ 수전위치 ]";
			return msg;
		}
		if (param.custNo == "") {
		//필수입력 항목입니다.[ 고객번호 ]
			var msg = "필수입력 항목입니다.[ 고객번호 ]";
			return msg;
		}
		if (param.ctrtEpwrVal == "" && param.ctrtEpwrRcvgMeansCd != 2) {
		//필수입력 항목입니다.[ 계약전력 ]
			var msg = "필수입력 항목입니다.[ 계약전력 ]";
			return msg;
		}
		if (param.etranCapaVal == "" && param.ctrtEpwrRcvgMeansCd != 1) {
		//필수입력 항목입니다.[ 변압기 용량 ]
			var msg = "필수입력 항목입니다.[ 변압기 용량 ]";
			return msg;
		}
		if (param.fuseTypStatCd == "" && param.ctrtEpwrRcvgMeansCd == 1) {
			//필수입력 항목입니다.[ 퓨즈유형 ]
			var msg = "필수입력 항목입니다.[ 퓨즈유형 ]";
			return msg;
		}
		if (param.cbrkCapaVal1 == "") {
			//필수입력 항목입니다.[ 1차 측 차단기 용량 ]
			var msg = "필수입력 항목입니다.[ 1차 측 차단기 용량 ]";
			return msg;
		}
		if (param.cblTkns1 == "") {
			//필수입력 항목입니다.[ 1차 측 케이블 굵기 ]
			var msg = "필수입력 항목입니다.[ 1차 측 케이블 굵기 ]";
			return msg;
		}
		if (param.cbrkCapa2Val == "") {
			//필수입력 항목입니다.[ 2차 측 차단기 용량 ]
			var msg = "필수입력 항목입니다.[ 2차 측 차단기 용량 ]";
			return msg;
		}
		if (param.cblTkns2 == "") {
			//필수입력 항목입니다.[ 2차 측 케이블 굵기 ]
			var msg = "필수입력 항목입니다.[ 2차 측 케이블 굵기 ]";
			return msg;
		}

		return "Y";
//		if (param.instlFlor == "") {
//			//필수입력 항목입니다.[ 설치 층 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 설치 층 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.ctrtEpwrRcvgMeansCd == "") {
//			//필수입력 항목입니다.[ 수전방식 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 수전방식 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.rcvgLoc == "") {
//		//필수입력 항목입니다.[ 수전위치 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 수전위치 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.custNo == "") {
//		//필수입력 항목입니다.[ 고객번호 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 고객번호 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.ctrtEpwrVal == "" && param.ctrtEpwrRcvgMeansCd != 2) {
//		//필수입력 항목입니다.[ 계약전력 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 계약전력 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.etranCapaVal == "" && param.ctrtEpwrRcvgMeansCd != 1) {
//		//필수입력 항목입니다.[ 변압기 용량 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 변압기 용량 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.fuseTypStatCd == "" && param.ctrtEpwrRcvgMeansCd == 1) {
//			//필수입력 항목입니다.[ 퓨즈유형 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 퓨즈유형 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.cbrkCapaVal1 == "") {
//			//필수입력 항목입니다.[ 1차 측 차단기 용량 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 1차 측 차단기 용량 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.cblTkns1 == "") {
//			//필수입력 항목입니다.[ 1차 측 케이블 굵기 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 1차 측 케이블 굵기 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.cbrkCapa2Val == "") {
//			//필수입력 항목입니다.[ 2차 측 차단기 용량 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 2차 측 차단기 용량 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.cblTkns2 == "") {
//			//필수입력 항목입니다.[ 2차 측 케이블 굵기 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 2차 측 케이블 굵기 ]', function(msgId, msgRst){});
//			return false;
//		}
//
//		return true;
	}

	this.sbeqpGageReg = function (data) {
		sbeqpId = data.sbeqpId;
    	var param =  $("#sbeqpMgmtGageRegForm").getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'G';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);
    	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
    	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpGageMgmt', param, 'POST', 'SbeqpGageReg');
	}

	function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpGageMgmt',sbeqpId, 'GET', 'search');
    }
	function setSelectCode() {
		var i = 0;
		for(i=-6; i<0; i++){
			$('#instlFlorReg').append("<option value='" + i + "'>" + "B" + -i + "층</option>");
		}
		for(i=1; i<21; i++){
			$('#instlFlorReg').append("<option value='" + i + "'>" + i + "층</option>");
		}

		var capaVal = [50,60,75,100,125,150,175,200,225,250,300,350,400,500,600,630,800,1000,1200,1250];
		var cblTkns = [2.5,4,6,10,16,25,35,50,70,95,120,150,185,240,300];

		for(i=0; i<capaVal.length; i++){
			$("#cbrkCapaVal1Reg").append("<option value='" + capaVal[i] +"'>" + capaVal[i] + "</option>");
			$("#cbrkCapa2ValReg").append("<option value='" + capaVal[i] +"'>" + capaVal[i] + "</option>");
		}

		for(i=0; i<cblTkns.length; i++){
			$("#cblTkns1Reg").append("<option value='" + cblTkns[i] +"'>" + cblTkns[i] + "</option>");
			$("#cblTkns2Reg").append("<option value='" + cblTkns[i] +"'>" + cblTkns[i] + "</option>");
		}
	}

	function undefinedCheck(data) {
    	if(data==undefined){
    		data='';
    	}
    	return data;
    }
	function setEventListener() {
    	$('#ctrtEpwrRcvgMeansCdReg').on('change', function(e) {
    		 var codeID =  $("#ctrtEpwrRcvgMeansCdReg").val();
    		 //한전 , 건물, 모자
    		 if (codeID == "1") {
    			 $("#ctrtEpwrValReg").setEnabled(true);
    			 $("#ctrtEpwrValEm").show();
    			 $("#etranCapaValReg").setEnabled(false);
    			 $("#etranCapaValEm").hide();
    			 $("#etranCapaValReg").val("");
    			 $("#fuseTypStatCdReg").setEnabled(true);
    			 $("#fuseTypStatCdEm").show();
    		 } else if (codeID == "2") {
    			 $("#ctrtEpwrValReg").setEnabled(false);
    			 $("#ctrtEpwrValReg").val("");
    			 $("#ctrtEpwrValEm").hide();
    			 $("#etranCapaValReg").setEnabled(true);
    			 $("#etranCapaValEm").show();
    			 $("#fuseTypStatCdReg").val("");
    			 $("#fuseTypStatCdReg").setEnabled(false);
    			 $("#fuseTypStatCdEm").hide();
    		 } else if (codeID == "3") {
    			 $("#ctrtEpwrValReg").setEnabled(true);
    			 $("#ctrtEpwrValEm").show();
    			 $("#etranCapaValReg").setEnabled(true);
    			 $("#etranCapaValEm").show();
    			 $("#fuseTypStatCdReg").val("");
    			 $("#fuseTypStatCdReg").setEnabled(false);
    			 $("#fuseTypStatCdEm").hide();
    		 } else if (codeID == "") {
    			 $("#ctrtEpwrValReg").setEnabled(true);
    			 $("#ctrtEpwrValEm").show();
    			 $("#etranCapaValReg").setEnabled(true);
    			 $("#etranCapaValEm").show();
    			 $("#fuseTypStatCdReg").val("");
    			 $("#fuseTypStatCdReg").setEnabled(true);
    			 $("#fuseTypStatCdEm").show();
    		 }
    	 });
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpGageReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpGageId') {
        	var param =  $("#sbeqpMgmtGageRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpGageMgmt', param, 'POST', 'SbeqpGageReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpGageMgmtList[0];
    		$('#sbeqpMgmtGageRegForm').setData(result);
    		var codeID =  $("#ctrtEpwrRcvgMeansCdReg").val();
	   		 //한전 , 건물, 모자
	   		 if (codeID == "1") {
	   			 $("#ctrtEpwrValReg").setEnabled(true);
	   			 $("#fuseTypStatCdReg").val("H");
	   			 $("#etranCapaValReg").setEnabled(false);
	   			 $("#etranCapaValReg").val("");
	   			 $("#fuseTypStatCdReg").setEnabled(true);
	   		 } else if (codeID == "2") {
	   			 $("#ctrtEpwrValReg").setEnabled(false);
	   			 $("#etranCapaValReg").setEnabled(true);
	   			 $("#fuseTypStatCdReg").val("");
	   			 $("#fuseTypStatCdReg").setEnabled(false);
	   			 $("#ctrtEpwrValReg").val("");
	   		 } else if (codeID == "3") {
	   			 $("#ctrtEpwrValReg").setEnabled(true);
	   			 $("#etranCapaValReg").setEnabled(true);
	   			 $("#fuseTypStatCdReg").val("");
	   			 $("#fuseTypStatCdReg").setEnabled(false);
	   		 }
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