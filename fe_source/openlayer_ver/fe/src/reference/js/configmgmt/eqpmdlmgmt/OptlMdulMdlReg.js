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

    	if(data.regYn == "Y"){
    		$('#optlMdulMdlRegArea').setData(paramData);
    	}else{

    		$("#optlMdulMdlIdReg").val("OMT*******");
    	}
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

	    //바코드대상여부
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/BARYN', null, 'GET', 'barYnReg');
    	//멀티모드/싱글모드
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00546', null, 'GET', 'cblIstnDivValReg');
    	//파장 구분
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/WAVLDIV', null, 'GET', 'wavlDivValReg');
    	//장비 타입
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCdReg');
    	//FIber Connector
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01079', null, 'GET', 'optlDcrsMachStrdValReg');

    }

    function setEventListener() {

    	//제조사 선택
    	$('#btnVendPop').on('click', function(e) {

	    		 $a.popup({
	 	          	popid: 'VendPop',
	 	          	title: '제조사 조회',
	 	            url: '/tango-common-business-web/business/popup/PopupBpList.do',
	 	            data: null,
	 	            windowpopup : true,
	 	            modal: true,
	                 movable:true,
	 	            width : 950,
	 	           	height : window.innerHeight * 0.83,
	 	           	callback : function(data) { // 팝업창을 닫을 때 실행
	 	           		if(data !== null){
		    	           		console.log(data)
		    	           		$('#vendNmReg').val(data.bpNm);
		    	           		$('#vendId').val(data.bpId);
	 	           		}
	 	           	}
	    		 });
        })

        //공급사 선택
        $('#btnPrvdPop').on('click', function(e) {
	        	$a.popup({
	 	          	popid: 'PrvdPop',
	 	          	title: '공급사 조회',
	 	            url: '/tango-common-business-web/business/popup/PopupBpList.do',
	 	            data: null,
	 	            windowpopup : true,
	 	            modal: true,
	                 movable:true,
	 	            width : 950,
	 	           	height : window.innerHeight * 0.83,
	 	           	callback : function(data) { // 팝업창을 닫을 때 실행
	 	           		if(data !== null){
		    	           		console.log(data)
		    	           		$('#prvdNmReg').val(data.bpNm);
		    	           		$('#prvdId').val(data.bpId);
	 	           		}
	 	           	}
	    		 });
        })


    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveReg').on('click', function(e) {

    		 optlMdulMdlReg();

         });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	//장비타입
    	if(flag == 'eqpRoleDivCdReg'){

    		$('#eqpRoleDivCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);

			}

    			$('#eqpRoleDivCdReg').setData({
    	             data:option_data
    			});

    	}
    	if(flag == 'wavlDivValReg'){

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#wavlDivValReg').setData({
	             data:option_data
			});


    	}

    	if(flag == 'cblIstnDivValReg'){

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#cblIstnDivValReg').setData({
	             data:option_data
			});
    	}

    	if(flag == 'barYnReg'){
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#barYnReg').setData({
	             data:option_data
			});
    	}

    	if(flag == 'optlDcrsMachStrdValReg'){
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#optlDcrsMachStrdValReg').setData({
	             data:option_data
			});
    	}

    	if(flag == 'OptlMdulMdlReg'){
    		if(response.Result == "Success"){

        		//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
        			if (msgRst == 'Y') {
        				$a.close(response.resultList);
        			}
        		});
    		}
    		else if (response.Result == "dupOptlMdulMdl") {
    			callMsgBox('','I', response.ResultMessage , function(msgId, msgRst){});
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

    function optlMdulMdlReg() {

    	var param =  $("#optlMdulMdlRegForm").getData();

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 // 필수값 체크 확인
		 if (param.vendPartsNoVal == "") {
			 callMsgBox('','W', '필수입력 항목입니다. [ 제조사 Part Number ]', function(msgId, msgRst){});
			 return;
		 }
		 if (param.matlCd == "") {
			 callMsgBox('','W', '필수입력 항목입니다. [ SKT기준 자재코드 ]', function(msgId, msgRst){});
			 return;
		 }
		 if (param.matlNm == "") {
			 callMsgBox('','W', '필수입력 항목입니다. [ SKT기준 자재명칭 ]', function(msgId, msgRst){});
			 return;
		 }

		 param.useYn = 'Y';
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 if(paramData === '' || paramData === null || paramData === undefined) {
			 param.optlMdulMdlId = null
		 }

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/mergeOptlMdulMdlInf', param, 'POST', 'OptlMdulMdlReg');
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