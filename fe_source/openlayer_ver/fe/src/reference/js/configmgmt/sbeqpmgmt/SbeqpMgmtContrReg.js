/**
 * SbeqpMgmtContrReg.js
 */
var sbeqpContr = $a.page(function() {
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

	this.contrValChk = function() {
		var param = $("#sbeqpMgmtContrRegForm").getData();

		if (param.insPwrEqpId1 == "") {
			//필수입력 항목입니다.[ 입력전원장비1 ]
			var msg = "필수입력 항목입니다.[ 입력전원장비1 ]";
			return msg;
		}
		if (param.capaVal == "") {
		//필수입력 항목입니다.[ 용량 ]
			var msg = "필수입력 항목입니다.[ 용량 ]";
			return msg;
		}
		if (param.prtVoltVal == "") {
		//필수입력 항목입니다.[ 출력 전압 ]
			var msg = "필수입력 항목입니다.[ 출력 전압 ]";
			return msg;
		}
		return "Y";

//		if (param.insPwrEqpId1 == "") {
//		//필수입력 항목입니다.[ 입력전원장비1 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 입력전원장비1 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.capaVal == "") {
//		//필수입력 항목입니다.[ 용량 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 용량 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.prtVoltVal == "") {
//		//필수입력 항목입니다.[ 출력 전압 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 출력 전압 ]', function(msgId, msgRst){});
//			return false;
//		}
//		return true;
	}

	this.sbeqpContrReg = function (data) {
		sbeqpId = data.sbeqpId;
		var param =  $("#sbeqpMgmtContrRegForm").getData();
		var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'C';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);
    	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
    	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드
    	
    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpContrMgmt', param, 'POST', 'SbeqpContrReg');
	}

	function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpContrMgmt',sbeqpId, 'GET', 'search');
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
		$('#btninsPwrEqpId1RegSearch').on('click', function(e) { //입력전원 장비
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
	   	           		$('#insPwrEqpId1Reg').val(data.eqpId);
	   	           		$('#insPwrEqpNm1Reg').val(data.eqpNm);
	   	           	}
	   	      });
    	});
		$('#btninsPwrEqpId2RegSearch').on('click', function(e) { //입력전원 장비
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
	   	           		$('#insPwrEqpId2Reg').val(data.eqpId);
	   	           		$('#insPwrEqpNm2Reg').val(data.eqpNm);
	   	           	}
	   	      });
    	});
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpContrReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpContrId') {
        	var param =  $("#sbeqpMgmtContrRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpContrMgmt', param, 'POST', 'SbeqpContrReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpContrMgmtList[0];
    		$('#sbeqpMgmtContrRegForm').setData(result);
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