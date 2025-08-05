/**
 * EpwrStcMgmtFextnReg.js
 *
 * @author Administrator
 * @date 2018. 02. 13.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var userId = 'testUser';
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param
    	if(param.stat == 'add'){
    		$('#fextnMod').hide();
    		$('#fexntAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#fextnAdd').hide();
    		$('#fextnMod').show();
    		setData(param)
    		$('#btnUpsdMtsoSearch').hide();
    	}
    	setEventListener();
    };



    function setData(param) {
    	$('#EpwrStcMgmtFextnRegForm').setData(param);
    }
    function setSelectCode() {
    	var mtsoTypCd = {supCd : '008000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', mtsoTypCd, 'GET', 'mtsoTypCd');
    }
    function setEventListener() {
    	//취소
    	 $('#btnFextnCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnFextnReg').on('click', function(e) {
    		 $('#frstRegUserId').val(userId);
    		 $('#lastChgUserId').val(userId);
    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#systmNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','시스템명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#capa').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용량'), function(msgId, msgRst){});
    			 return;
    		 }

    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 fextnReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnFextnMod').on('click', function(e) {
    		 $('#lastChgUserId').val(userId);
    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#systmNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','시스템명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#capa').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 fextnReg();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnFextnDel').on('click', function(e) {
    		 /*    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 fextnDel();
    			 }
    		 });
    	 });
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
/*    	 $("#idSelect").setOptions({
    		 url : 'tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoSearch',
    		 method : "get",
    		 datatype: "json",
    		 paramname : "mtsoNm",
    		 minlength: 0,
    		 before : function(id, option){
    		 },
    		 select : function(e){
    			 var param = $('#idSelect').getSelectedData();
    			 $('#mtsoTypNm').val(param.affairNm);
    			 $('#mtsoTypCd').val(param.affairCd);
    		 }
    	 });*/
    };

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'fextnReg'){
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
			$(opener.location).attr("href","javascript:fextn.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'fextnDel') {
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
			$(opener.location).attr("href","javascript:fextn.setGrid("+pageNo+","+rowPerPage+");");
    	}


    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'fextnReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function fextnReg(){
    	var param = $('#EpwrStcMgmtFextnRegForm').getData();


    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveFextn', param, 'POST', 'fextnReg');

    }

    function fextnMod(){
    	var param = $('#EpwrStcMgmtFextnRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveFextn', param, 'POST', 'fextnReg');
    }

    function fextnDel(){
    	var param = $('#EpwrStcMgmtFextnRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteFextn', param, 'POST', 'fextnDel');
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