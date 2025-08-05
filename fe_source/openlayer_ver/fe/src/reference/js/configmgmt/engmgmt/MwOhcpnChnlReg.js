/**
 * CardMdlReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

    //초기 진입점
	var paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	paramData = null;

    	if(param.regYn == "Y"){
    		paramData = param;
    	}

        setEventListener();
        setSelectCode();
        setRegDataSet(param);

    };


    function setRegDataSet(data) {

    	$('#avlbMaxChnlCntReg').val('0');
    	$('#useChnlValReg').val('0');
    	$('#cmptrUseChnlValReg').val('0');
    	$('#remChnlCntReg').val('0');

    	if(data.regYn == "Y"){
    		$('#MwOhcpnChnlRegArea').setData(paramData);
    	}



    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

		//MW 주파수
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02505', null, 'GET', 'mwFreqCdReg');
		//MW 대역폭
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02506', null, 'GET', 'mwBdwhCdReg');
		//MW 변조방식
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02507', null, 'GET', 'modulMeansCdReg');


    }

    function setEventListener() {

    	$('#ntwkLineNmPop').on('click', function(e) {

    		$a.popup({
 	          	popid: 'RingListPop',
 	          	title: '링명(도서지역) 조회',
 	            url: '/tango-transmission-web/configmgmt/cfline/RingListPop.do',
 	            data: null,
 	            windowpopup : true,
 	            modal: true,
                 movable:true,
 	            width : 950,
 	           	height : 850,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	           		if(data !== null){
	 	           		if (data.ntwkLineNo != null || data.ntwkLineNo != '' || data.ntwkLineNo != undefined) {
		 	           		var param = [];
		 	           		param = { ntwkLineNo : data.ntwkLineNo};
			 	           	httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwInvtDtlInfoList', param, 'GET', 'mwInvtDtlInfoList');
		 	           	}
 	           		}
	           	}
    		})
    	});

    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveReg').on('click', function(e) {
    		 mwOhcpnChnlReg();
         });

    	 // 가용 최대 채널수
    	 $('#avlbMaxChnlCntReg').on('keyup', function(e) {
    		 remChnlCal();
    	 });

    	 // 현재 사용 채널수
    	 $('#useChnlValReg').on('keyup', function(e) {
    		 remChnlCal();
    	 });

    	 // 경쟁사 사용 채널수
    	 $('#cmptrUseChnlValReg').on('keyup', function(e) {
    		 remChnlCal();
    	 });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

		if(flag == 'mwFreqCdReg'){
			$('#mwFreqCdReg').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){

				var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
				option_data.push(resObj);
			}

			$('#mwFreqCdReg').setData({
	             data:option_data
			});
		}

		if(flag == 'mwBdwhCdReg'){
			$('#mwBdwhCdReg').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){

				var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
				option_data.push(resObj);
			}

			$('#mwBdwhCdReg').setData({
	             data:option_data
			});
		}

		if(flag == 'modulMeansCdReg'){
			$('#modulMeansCdReg').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){

				var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
				option_data.push(resObj);
			}

			$('#modulMeansCdReg').setData({
	             data:option_data
			});
		}



		if(flag == 'mwOhcpnChnlMgmt'){

			if(response.Result == "Success"){

	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    			if (msgRst == 'Y') {
	    				$a.close(response.resultList);
	    			}
	    		});
			}
			else if (response.Result == "dupMwOhcpnChnlMgmtInf") {
				callMsgBox('','I', response.ResultMessage , function(msgId, msgRst){});
			}


		}

		if(flag == 'mwInvtDtlInfoList'){

			// 선택된 링에 대한 MW 정보 출력
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				resObj.avlbMaxChnlCnt = resObj.chnlCnt;			// 링 마스터에 가용 채널 최대 수 자동 기입
				$('#MwOhcpnChnlRegForm').formReset();

				$('#avlbMaxChnlCntReg').val('0');
		    	$('#useChnlValReg').val('0');
		    	$('#cmptrUseChnlValReg').val('0');
		    	$('#remChnlCntReg').val('0');

				$('#MwOhcpnChnlRegForm').setData(resObj);

				remChnlCal();
			}
		}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpMdlReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    $(document).on('keypress', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode;
    	var _value = $(this).val();
		if (event.keyCode < 48 || event.keyCode > 57) {
			if (event.keyCode != 46) {
				return false;
			}
		}
		var _pattern = /^\d*[.]\d*$/;	// . 체크
		if(_pattern.test(_value)) {
			if(charCode == 46) {
				return false;
			}
		}

		var _pattern1 = /^\d*[.]\d{3}$/;	// 소수점 3자리까지만
		if(_pattern1.test(_value)) {
			return false;
		}
    	return true;
	});

	$(document).on('keyup', ".numberOnly", function(evt){
		var charCode = (evt.which) ? evt.which :event.keyCode;
		if (charCode ==8 || charCode == 46 || charCode == 37 || charCode ==39) {
			return;
		}
		else {
			evt.target.value = evt.target.value.replace(/[^0-9\.]/g,"");
		}
	});

    function mwOhcpnChnlReg() {

    	var param =  $("#MwOhcpnChnlRegArea").getData();

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 if ($("#ntwkLineNoReg").getData().ntwkLineNo == "" || $("#ntwkLineNoReg").getData().ntwkLineNo == undefined ) {
			 callMsgBox('','W', '필수입력 항목입니다. [ 링명(도서지역) ]', function(msgId, msgRst){});
			 return;
		 }

		 param.demdHdofcCd = param.orgId;

		 param.ntwkLineNo = $("#ntwkLineNoReg").getData().ntwkLineNo;
		 param.useYn = 'Y';

		 if(paramData != '' && paramData != null && paramData != undefined) {
			 if (paramData.regYn == 'Y')
				 param.regYn = 'Y' ;
		 }
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mergeMwOhcpnChnlMgmt', param, 'GET', 'mwOhcpnChnlMgmt');
    }

    $.fn.formReset = function() {

    	return this.each(function() {
    		var type = this.type,
    			tag = this.tagName.toLowerCase()
    		if (tag === "form") {
    			return $(":input", this).formReset()
    		}

    		if (type === "text" || type === "password" || type == "hidden" || tag === "textarea") {
    			this.value = ""
    		}
    		else if (type === "checkbox" || type === "radio") {
    			this.checked = false
    		}
    		else if (tag === "select") {
    			this.selectedIndex = -1
    		}
    	})
    }

    function remChnlCal() {
    	 var buf = null;

		 buf =  $('#avlbMaxChnlCntReg').getData();
		 var avlbMaxChnlCnt =buf.avlbMaxChnlCnt;

		 buf = $('#useChnlValReg').getData();
		 var useChnlVal = buf.useChnlVal;

		 buf = $('#cmptrUseChnlValReg').getData();
		 var cmptrUseChnlVal = buf.cmptrUseChnlVal;

		 var remChnlCnt = 0;

		 if (cmptrUseChnlVal >= 0) {

			 remChnlCnt	  = avlbMaxChnlCnt - useChnlVal - cmptrUseChnlVal;

			 if (isNaN(remChnlCnt))
				 remChnlCnt = 0;
			 $('#remChnlCntReg').val(remChnlCnt);
		 }
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