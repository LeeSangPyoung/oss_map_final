/**
 * EpwrStcMgmtRprReg.js
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

    	$a.maskedinput($('#rprDt')[0], '0000-00-00');
    	$a.maskedinput($('#comntMnftDt')[0], '0000-00');

    	paramData = param
    	if(param.stat == 'add'){
    		$('#rprMod').hide();
    		$('#rprAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#rprAdd').hide();
    		$('#rprMod').show();
    		setData(param)
    		$('#btnUpsdMtsoSearch').hide();
    	}
    	setEventListener();
    };
    function setData(param) {
    	$('#EpwrStcMgmtRprRegForm').setData(param);
		/*$('#rprNo').val(param.rprNo);
		$('#mtsoId').val(param.mtsoId);
		$('#mtsoTypCd').val(param.mtsoTypCd);
		$('#rprDt').val(param.rprDt);
		$('#faltDivNm').setSelected(param.faltDivNm);
		$('#faltStstmNm').val(param.faltStstmNm);
		$('#faltDetlDivNm').setSelected(param.faltDetlDivNm);
		$('#rprVendNm').val(param.rprVendNm);
		$('#rprDtsVal').val(param.rprDtsVal);
		$('#shftCmpntNm').val(param.shftCmpntNm);
		$('#cmpntVendNm').val(param.cmpntVendNm);
		$('#comntMnftDt').val(param.comntMnftDt);*/
    }
    function setEventListener() {
    	//취소
    	 $('#btnRprCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnRprReg').on('click', function(e) {
    		 if ($('#mtsoNm').val() == '') {
    			 callMsgBox('','I', '필수 입력 항목입니다.[ 국사 ]', function(msgId, msgRst){});
    			 return;
    		 }
    		 /*if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rprReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnRprMod').on('click', function(e) {
    		  if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', '수정하시겠습니까?', function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rprReg();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnRprDel').on('click', function(e) {
    		 /*    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rprDel();
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
    				 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorSearch', {sisulCd:data.sisulCd}, 'GET', 'florId');
    			 }
    		 });
    	 })
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'rprReg'){
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
			$(opener.location).attr("href","javascript:rpr.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'rprDel') {
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
			$(opener.location).attr("href","javascript:rpr.setGrid("+pageNo+","+rowPerPage+");");
    	}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'rprReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function rprReg(){
    	var param = $('#EpwrStcMgmtRprRegArea').getData();
    	param.userId = "TestRegUserId"; // 추후 삭제 요망

    	if(param.rprDt.length > 8) {
    		var tmp = (param.rprDt).split('-');
        	param.rprDt = tmp[0]+tmp[1]+tmp[2];
    	}

    	if(param.comntMnftDt.length > 6) {
    		tmp = (param.comntMnftDt).split('-');
        	param.comntMnftDt = tmp[0]+tmp[1];
    	}


    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsertRprHstMgmt', param, 'POST', 'rprReg');

    }

    function rprDel(){
    	var param = $('#EpwrStcMgmtRprRegArea').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRprHstMgmt', param, 'POST', 'rprDel');
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