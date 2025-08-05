/**
 * EpwrStcMgmtGntReg.js
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
    		$('#gntMod').hide();
    		$('#gntAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#gntAdd').hide();
    		$('#gntMod').show();
    		setData(param)
    		$('#btnUpsdMtsoSearch').hide();
    	}
    	setEventListener();
    };
    function setData(param) {
    	$('#EpwrStcMgmtGntRegForm').setData(param);
    }
    function setEventListener() {
    	//취소
    	 $('#btnGntCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnGntReg').on('click', function(e) {
    		 $('#frstRegUserId').val(userId);
    		 $('#lastChgUserId').val(userId);
    		 if($('#mtsoTypCd').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#tankCapa').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','탱크용량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#fuelHldQty').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','보유량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 gntReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnGntMod').on('click', function(e) {
    		 $('#lastChgUserId').val(userId);
    		 if($('#mtsoTypCd').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 gntReg();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnGntDel').on('click', function(e) {

    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 gntDel();
    			 }
    		 });
    	 });
    	 //국사찾기
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
		if(flag == 'gntReg'){
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
			$(opener.location).attr("href","javascript:gnt.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'gntDel') {
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
			$(opener.location).attr("href","javascript:gnt.setGrid("+pageNo+","+rowPerPage+");");
    	}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'gntReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }
    function gntReg(){
    	var param = $('#EpwrStcMgmtGntRegForm').getData();
    	param.fuelHldRate = param.fuelHldQty/param.tankCapa;
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveGnt', param, 'POST', 'gntReg');

    }

    function gntDel(){
    	var param = $('#EpwrStcMgmtGntRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteGnt', param, 'POST', 'gntDel');
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