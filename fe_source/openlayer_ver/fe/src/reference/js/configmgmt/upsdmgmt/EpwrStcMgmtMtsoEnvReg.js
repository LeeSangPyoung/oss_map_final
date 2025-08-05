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

    	setSelectCode();
    	setEventListener();
    	if(param.regYn == "Y"){
    		paramData = param;
    		setData(param);
    		$("#btnInspItm").show();
    	}else{
    		$("#btnInspItm").hide();
    	}
    };

    function setData(param) {
    	$('#EpwrStcMgmtMtsoEnvRegForm').setData(param);
    }

    function setSelectCode() {
    	//총 층수
    	for(var i=-6; i<0; i++){
    		$('#florDivVal').append("<option value='" + i + "'>" + "B" + -i + "층</option>");
    	}
    	for(var i=1; i<21; i++){
    		$('#florDivVal').append("<option value='" + i + "'>" + i + "층</option>");
    	}
    }

    function setEventListener() {
    	//취소
    	 $('#btnMtsoEnvCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnMtsoEnvReg').on('click', function(e) {
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
    				 mtsoEnvReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnMtsoEnvMod').on('click', function(e) {
    		  if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', '수정하시겠습니까?', function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 mtsoEnvReg();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnMtsoEnvDel').on('click', function(e) {
    		 /*    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 mtsoEnvDel();
    			 }
    		 });
    	 });

    	 //국사조회
    	 $('#btnUpsdMtsoSearch').on('click',function(e) {
    		 $a.popup({
     		 	popid: 'MtsoLkup',
 	          	title: configMsgArray['findMtso'],
 	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
 	            windowpopup : true,
 	            modal: true,
 	            movable:true,
 	            width : 950,
 	           	height : 800,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	                $('#mtsoId').val(data.mtsoId);
 	   				$('#mtsoNm').val(data.mtsoNm);
 	   				$('#mtsoTypNm').val(data.mtsoTyp);
 	   				$('#mtsoTypCd').val(data.mtsoTypCd);
 	           	}
     		 });
    	 })

    	//점검항목
    	 	$('#btnInspItm').on('click', function(e) {
 			var param =  $("#EpwrStcMgmtMtsoEnvRegForm").getData();
 			$a.navigate('/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtMtsoEnvInspReg.do',param);
         });

    	//취소
    	 	$('#btnClose').on('click', function(e) {
    	 		$a.close();
         });
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'mtsoEnvReg'){
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});

				var pageNo = $("#pageNo", opener.document).val();
				var rowPerPage = $("#rowPerPage", opener.document).val();
				$(opener.location).attr("href","javascript:mtsoEnv.setGrid("+pageNo+","+rowPerPage+");");
			}else if(response.Result == "DupMtsoEnv"){
    			callMsgBox('','I', "이미 등록 된 국사 입니다." , function(msgId, msgRst){});
    		}
		}

		if(flag == 'mtsoEnvDel') {
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
			$(opener.location).attr("href","javascript:mtsoEnv.setGrid("+pageNo+","+rowPerPage+");");
    	}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'mtsoEnvReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function mtsoEnvReg(){
    	var param = $('#EpwrStcMgmtMtsoEnvRegArea').getData();
    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 if(paramData != null){
			 if(paramData.regYn != "" && paramData.regYn != null && paramData.regYn != undefined){
				 param.regYn = paramData.regYn;
			 }else{
				 param.regYn = "N";
			 }
		 }else{
			 param.regYn = "N";
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/mergeMtsoEnvInf', param, 'POST', 'mtsoEnvReg');

    }

    function mtsoEnvDel(){
    	var param = $('#EpwrStcMgmtMtsoEnvRegArea').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRprHstMgmt', param, 'POST', 'mtsoEnvDel');
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