/**
 * SbeqpMgmtCbplReg.js
 */
var sbeqpCbpl = $a.page(function() {
    //초기 진입점
	var paramData = null;
	var sbeqpId = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();
    	setEventListener();
    	paramData = param;
    	if (paramData.regYn == "Y") {
    		sbeqpId = {"sbeqpId":param.sbeqpId};
    		search();
    	}
    };

	this.cbplValChk = function() {
		var param = $("#sbeqpMgmtCbplRegForm").getData();

		if (param.instlFlor == "") {
			//필수입력 항목입니다.[ 설치 층 ]
				var msg = "필수입력 항목입니다.[ 설치 층 ]";
				return msg;
			}
			if (param.usgDiv == "") {
			//필수입력 항목입니다.[ 용도구분 ]
				var msg = "필수입력 항목입니다.[ 용도구분 ]"
				return msg;
			}
			if (param.instlLoc == "") {
			//필수입력 항목입니다.[ 설치위치 ]
				var msg = "필수입력 항목입니다.[ 설치위치 ]";
				return msg;
			}
			if (param.capaVal == "") {
			//필수입력 항목입니다.[ 용량 ]
				var msg = "필수입력 항목입니다.[ 용량 ]";
				return msg;
			}
			if (param.fram == "") {
				//필수입력 항목입니다.[ 프레임 ]
				var msg = "필수입력 항목입니다.[ 프레임 ]";
				return msg;
			}
			if (param.cblTkns == "") {
				//필수입력 항목입니다.[ 케이블굵기 ]
				var msg = "필수입력 항목입니다.[ 케이블굵기 ]";
				return msg;
			}
			return "Y";

//		if (param.instlFlor == "") {
//		//필수입력 항목입니다.[ 설치 층 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 설치 층 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.usgDiv == "") {
//		//필수입력 항목입니다.[ 용도구분 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 용도구분 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.instlLoc == "") {
//		//필수입력 항목입니다.[ 설치위치 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 설치위치 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.capaVal == "") {
//		//필수입력 항목입니다.[ 용량 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 용량 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.fram == "") {
//			//필수입력 항목입니다.[ 프레임 ]
//				callMsgBox('','W', '필수입력 항목입니다.[ 프레임 ]', function(msgId, msgRst){});
//				return false;
//			}
//		if (param.cblTkns == "") {
//			//필수입력 항목입니다.[ 케이블굵기 ]
//				callMsgBox('','W', '필수입력 항목입니다.[ 케이블굵기 ]', function(msgId, msgRst){});
//				return false;
//			}
//		return true;
	}

	this.sbeqpCbplReg = function (data) {
		sbeqpId = data.sbeqpId;
		var param =  $("#sbeqpMgmtCbplRegForm").getData();
		var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'L';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);
    	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
    	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpCbplMgmt', param, 'POST', 'SbeqpCbplReg');
	}

	function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpCbplMgmt',sbeqpId, 'GET', 'search');
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
		var fr = [32,50,63,100,125,250,400,630,800];

		for(i=0; i<capaVal.length; i++){
			$("#capaValReg").append("<option value='" + capaVal[i] +"'>" + capaVal[i] + "</option>");
		}

		for(i=0; i<cblTkns.length; i++){
			$("#cblTknsReg").append("<option value='" + cblTkns[i] +"'>" + cblTkns[i] + "</option>");
		}

		for(i=0; i<fr.length; i++){
			$("#framReg").append("<option value='" + fr[i] +"'>" + fr[i] + "</option>");
		}
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
    	if(flag == 'SbeqpCbplReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpCbplId') {
        	var param =  $("#sbeqpMgmtCbplRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpCbplMgmt', param, 'POST', 'SbeqpCbplReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpCbplMgmtList[0];
    		$('#sbeqpMgmtCbplRegForm').setData(result);
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