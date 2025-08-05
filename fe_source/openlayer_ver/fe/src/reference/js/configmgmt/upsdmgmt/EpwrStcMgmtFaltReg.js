/**
 * EpwrStcMgmtFaltReg.js
 *
 * @author Administrator
 * @date 2018. 02. 13.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	$a.maskedinput($('#occrTime')[0], '00:00');
    	$a.maskedinput($('#rcovTime')[0], '00:00');
    	$a.maskedinput($('#gntTruckDeptrTime')[0], '00:00');
    	$a.maskedinput($('#gntTruckArvlTime')[0], '00:00');

    	$a.maskedinput($('#faltDt')[0], '0000-00-00');

    	paramData = param
    	if(param.stat == 'add'){
    		$('#faltMod').hide();
    		$('#faltAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#faltAdd').hide();
    		$('#faltMod').show();
    		setData(param)
    		$('#btnUpsdMtsoSearch').hide();
    		$('#btnRtfNmSearch').hide();
    	}
    	setEventListener();
    };

    function setData(param) {
    	$('#EpwrStcMgmtFaltRegForm').setData(param);
/*    	$('#faltNo').val(param.faltNo);
		$('#mtsoId').val(param.mtsoId);
		$('#mtsoTypCd').val(param.mtsoTypCd);
		$('#mtsoTypNm').setSelected(param.mtsoTypNm);
		$('#faltDt').val(param.faltDt);
		$('#occrTime').val(param.occrTime);
		$('#rcovTime').val(param.rcovTime);
		$('#overTime').val(param.overTime);
		$('#srvcStopEyn').setSelected(param.srvcStopEyn);
		$('#srvcStopTime').val(param.srvcStopTime);
		$('#gntTruckDeptrTime').val(param.gntTruckDeptrTime);
		$('#gntTruckArvlTime').val(param.gntTruckArvlTime);
		$('#dablFcltsDtsVal').val(param.dablFcltsDtsVal);
		$('#lclFaltTypNm').setSelected(param.lclFaltTypNm);
		$('#mclFaltTypNm').setSelected(param.mclFaltTypNm);
		$('#occrCasVal').val(param.occrCasVal);
		$('#trtmDtsVal').val(param.trtmDtsVal);
		$('#ststmNm').val(param.ststmNm);
		$('#rtfVendNm').val(param.rtfVendNm);
		$('#rtfMdlNm').val(param.rtfMdlNm);
		$('#batryCapa').val(param.batryCapa);
		$('#exptPkTime').val(param.exptPkTime);
		$('#realPkTime').val(param.realPkTime);
*/
    }
    function setSelectCode() {
    	var mtsoTypNm = {supCd : '008000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', mtsoTypNm, 'GET', 'mtsoTypNm');
    }
    function setEventListener() {
    	//취소
    	 $('#btnFaltCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnFaltReg').on('click', function(e) {
    		 if ($('#mtsoNm').val() == '') {
    			 callMsgBox('','I', '필수 입력 항목입니다.[ 국사 ]', function(msgId, msgRst){});
    			 return;
    		 }
    		 if ($('#ststmNm').val() == '') {
  		    	callMsgBox('','I', '필수 입력 항목입니다.[ 정류기 ]', function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 var regTest = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

      		 if ($('#occrTime').val() != null && $('#occrTime').val() != '' && $('#occrTime').val() != ' ') {
      			 if (!regTest.test($('#occrTime').val())) {
          			 callMsgBox('','I', '발생시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
          			 return;
          		 }
      		 }
      		 if ($('#rcovTime').val() != null && $('#rcovTime').val() != '' && $('#rcovTime').val() != ' ') {
      			 if (!regTest.test($('#rcovTime').val())) {
      				 callMsgBox('','I', '복구시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
      				 return;
      			 }
      		 }
      		 if ($('#gntTruckDeptrTime').val() != null && $('#gntTruckDeptrTime').val() != '' && $('#gntTruckDeptrTime').val() != ' ') {
      			 if (!regTest.test($('#gntTruckDeptrTime').val())) {
      				 callMsgBox('','I', '발전자 출반시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
      				 return;
      			 }
      		 }
      		 if ($('#gntTruckArvlTime').val() != null && $('#gntTruckArvlTime').val() != '' && $('#gntTruckArvlTime').val() != ' ') {
      			 if (!regTest.test($('#gntTruckArvlTime').val())) {
      				 callMsgBox('','I', '발전차 도착시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
      				 return;
      			 }
      		 }

    		 /*if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 faltReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnFaltMod').on('click', function(e) {

    		  if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if ($('#ststmNm').val() == '') {
    		    	callMsgBox('','I', '필수 입력 항목입니다.[ 정류기 ]', function(msgId, msgRst){});
    	     		return;
    	      }
      		 var regTest = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

      		 if ($('#occrTime').val() != null && $('#occrTime').val() != '' && $('#occrTime').val() != ' ') {
      			 if (!regTest.test($('#occrTime').val())) {
          			 callMsgBox('','I', '발생시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
          			 return;
          		 }
      		 }
      		 if ($('#rcovTime').val() != null && $('#rcovTime').val() != '' && $('#rcovTime').val() != ' ') {
      			 if (!regTest.test($('#rcovTime').val())) {
      				 callMsgBox('','I', '복구시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
      				 return;
      			 }
      		 }
      		 if ($('#gntTruckDeptrTime').val() != null && $('#gntTruckDeptrTime').val() != '' && $('#gntTruckDeptrTime').val() != ' ') {
      			 if (!regTest.test($('#gntTruckDeptrTime').val())) {
      				 callMsgBox('','I', '발전자 출반시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
      				 return;
      			 }
      		 }
      		 if ($('#gntTruckArvlTime').val() != null && $('#gntTruckArvlTime').val() != '' && $('#gntTruckArvlTime').val() != ' ') {
      			 if (!regTest.test($('#gntTruckArvlTime').val())) {
      				 callMsgBox('','I', '발전차 도착시간의 형식이 올바르지 않습니다. [23:59]', function(msgId, msgRst){});
      				 return;
      			 }
      		 }

    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', '수정하시겠습니까?', function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 faltReg();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnFaltDel').on('click', function(e) {
    		 /*    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 faltDel();
    			 }
    		 });
    	 });
    	 //국사조회
    	 $('#btnUpsdMtsoSearch').on('click',function(e) {
    		 $a.popup({
    			 popid: 'UpsdMtsoLkup',
    			 title: configMsgArray['findMtso'],
    			 url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdMtsoLkup.do',
    			 modal: true,
    			 movable:true,
    			 windowpopup: true,
    			 width : 850,
    			 height : 600,
    			 callback : function(data) { // 팝업창을 닫을 때 실행
    				 $('#mtsoId').val(data.mtsoId);
    				 $('#intgFcltsCd').val(data.sisulCd);
    				 $('#mtsoNm').val(data.sisulNm);
    				 $('#mtsoTypNm').val(data.affairNm);
    				 $('#mtsoTypCd').val(data.affairCd);
    			 }
    		 });
    	 })
    	//정류기 조회
    	 $('#btnRtfNmSearch').on('click', function(e) {
    		 var param =  $("#EpwrStcMgmtFaltRegForm").getData();
    		 $a.popup({
    	          	popid: 'RtfNm',
    	          	title: '정류기 조회',
    	            url: '/tango-transmission-web/configmgmt/upsdmgmt/RtfNmSearch.do',
    	            data: param,
    	            modal: true,
                    movable:true,
                    windowpopup: true,
    	            width : 650,
    	           	height : 600,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#rtfId').val(data.rtfId);
    	                $('#ststmNm').val(data.systmNm);
    	                $('#rtfVendNm').val(data.vendNm);
    	                $('#rtfMdlNm').val(data.mdlNm);
    	                $('#batryCapa').val(data.batryCapa);
    	                $('#exptPkTime').val(data.bkExptTime);
    	           	}
    	      });
         });
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'faltReg'){
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			}

			var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:falt.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'faltDel') {
    		if(response.Result == "Success"){
    			//삭제 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close();
    				}
    			});
    		}
    		var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:falt.setGrid("+pageNo+","+rowPerPage+");");
    	}
		if(flag == 'mtsoTypNm'){
			var option_data = [{cd: '', cdNm: '선택'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			if(paramData.stat=='add') {
				$('#'+flag).setData({
					data: option_data,
					mtsoTypNm: ''
    			});
    		}
    		else {
    			$('#'+flag).setData({
    				data: option_data,
    				mtsoTypNm: paramData.mtsoTypCd
    			});
    		}
		}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'faltReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function faltReg(){
    	var param = $('#EpwrStcMgmtFaltRegArea').getData();
    	param.userId = "TestRegUserId"; // 추후 삭제 요망

    	if(param.faltDt.length > 8) {
    		var tmp = (param.faltDt).split('-');
        	param.faltDt = tmp[0]+tmp[1]+tmp[2];
    	}

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsertFaltHstMgmt', param, 'POST', 'faltReg');

    }

    function faltDel(){
    	var param = $('#EpwrStcMgmtFaltRegArea').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteFaltHstMgmt', param, 'POST', 'faltDel');
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