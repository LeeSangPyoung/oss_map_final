/**
 * SbeqpMgmtIvtrReg.js
 */
var sbeqpIvtr = $a.page(function() {
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
	this.ivtrValChk = function() {
		var param = $("#sbeqpMgmtIvtrRegForm").getData();

		if (param.insPwrEqpId == "") {
			//필수입력 항목입니다.[ 입력전원장비 ]
			var msg = "필수입력 항목입니다.[ 입력전원장비 ]";
			return msg;
		}
		if (param.insPwrVal == "") {
			//필수입력 항목입니다.[ 입력전원 ]
			var msg = "필수입력 항목입니다.[ 입력전원 ]";
			return msg;
		}
		if (param.connEqpId == "") {
		//필수입력 항목입니다.[ 연결장비 ]
			var msg = "필수입력 항목입니다.[ 연결장비 ]";
			return msg;
		}
		if (param.capaVal == "") {
		//필수입력 항목입니다.[ 용량 ]
			var msg = "필수입력 항목입니다.[ 용량 ]";
			return msg;
		}

		return "Y";

//		if (param.insPwrEqpId == "") {
//		//필수입력 항목입니다.[ 입력전원장비 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 입력전원장비 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.insPwrVal == "") {
//			//필수입력 항목입니다.[ 입력전원 ]
//				callMsgBox('','W', '필수입력 항목입니다.[ 입력전원 ]', function(msgId, msgRst){});
//				return false;
//		}
//		if (param.connEqpId == "") {
//		//필수입력 항목입니다.[ 연결장비 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 연결장비 ]', function(msgId, msgRst){});
//			return false;
//		}
//		if (param.capaVal == "") {
//		//필수입력 항목입니다.[ 용량 ]
//			callMsgBox('','W', '필수입력 항목입니다.[ 용량 ]', function(msgId, msgRst){});
//			return false;
//		}
//
//		return true;
	}

	this.sbeqpIvtrReg = function (data) {
		sbeqpId = data.sbeqpId;
    	var param =  $("#sbeqpMgmtIvtrRegForm").getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;
    	param.sbeqpId = sbeqpId;
    	param.sbeqpClCd = 'I';
    	//'undefined'로 들어오는것들 '' 처리
    	data.jrdtTeamOrgId = undefinedCheck(data.jrdtTeamOrgId);
    	data.mnftDt = undefinedCheck(data.mnftDt);
    	data.sbeqpRmsId = undefinedCheck(data.sbeqpRmsId);
    	data.barNo = undefinedCheck(data.barNo);
    	data.sbeqpRmk = undefinedCheck(data.sbeqpRmk);
    	data.rmsMappDivVal = undefinedCheck(data.rmsMappDivVal); //2023 통합국사 고도화 - 추가필드

    	param.sbeqpCommonVO = [''+data.sbeqpId+'',''+data.sbeqpMdlId+'',''+data.sbeqpInstlMtsoId+'',''+data.jrdtTeamOrgId+'',''+data.sbeqpNm+'',''+data.barNo+'',''+data.sbeqpRmsId+'',''+data.sbeqpOpStatCd+'',''+data.mnftDt+'',''+data.frstRegUserId+'',''+data.lastChgUserId+'',''+data.sbeqpRmk+'',''+data.rmsMappDivVal+''];
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpIvtrMgmt', param, 'POST', 'SbeqpIvtrReg');
	}

	function search() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpIvtrMgmt',sbeqpId, 'GET', 'search');
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
		$('#btninsPwrEqpIdSearch').on('click', function(e) { //입력전원 장비
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
	   	           		$('#insPwrEqpIdReg').val(data.eqpId);
	   	           		$('#insPwrEqpNmReg').val(data.eqpNm);
	   	           	}
	   	      });
    	});
		$('#btncconnEqpIdSearch').on('click', function(e) { //연결장비
			var param = {"sbeqpClCd": "AS", "fix": "N",
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
	   	           		$('#connEqpIdReg').val(data.eqpId);
	   	           		$('#connEqpNmReg').val(data.eqpNm);
	   	           	}
	   	      });
    	});
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpIvtrReg') {
    		parent.sbeqp.success();
    	}

    	if(flag == 'SbeqpIvtrId') {
        	var param =  $("#sbeqpMgmtIvtrRegForm").getData();
        	param.sbeqpId = sbeqpId;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpIvtrMgmt', param, 'POST', 'SbeqpIvtrReg');
    	}

    	if(flag == 'search'){
    		var result = response.sbeqpIvtrMgmtList[0];
    		$('#sbeqpMgmtIvtrRegForm').setData(result);
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