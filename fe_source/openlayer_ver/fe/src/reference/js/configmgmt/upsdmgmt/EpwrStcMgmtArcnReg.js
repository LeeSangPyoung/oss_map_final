
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var userId = 'testUser'
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	$a.maskedinput($('#mnftDt')[0], '0000-00');

    	paramData = param
    	if(param.stat == 'add'){
    		$('#arcnMod').hide();
    		$('#arcnAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#arcnAdd').hide();
    		$('#arcnMod').show();
    		setData(param)
    		$('#btnUpsdMtsoSearch').hide();
    	}
    	setEventListener();
    }
    function setData(param) {
    	$('#EpwrStcMgmtArcnRegArea').setData(param);
/*    	$('#sbeqpId').val(param.sbeqpId);
    	$('#mtsoTypCd').val(param.mtsoTypCd); // 코드값이 들어간다.

    	$('#mtsoId').val(param.mtsoId);
    	$('#mtsoTypNm').setSelected(param.mtsoTypCd); // 코드의 값 value가 선택되어 이름이 나온다
    	$('#intgFcltsCd').val(param.intgFcltsCd);
    	$('#systmNm').val(param.systmNm);
    	$('#capa').setSelected(param.capa);
    	$('#vendNm').setSelected(param.vendNm);
    	$('#mnftDt').val(param.mnftDt);
    	$('#htmprSoltnVal').setSelected(param.htmprSoltnVal);
    	$('#exstrCbrkLoc').val(param.exstrCbrkLoc);
    	$('#rmsAcptYn').setSelected(param.rmsAcptYn);
    	$('#ttrnCapa').val(param.ttrnCapa);
    	$('#shtgCapa').val(param.shtgCapa);
    	$('#opStatYn').setSelected(param.opStatYn);
    	$('#eqrstRfctYn').setSelected(param.eqrstRfctYn);*/
    }
    function setSelectCode() {
    	var searchGubun = {supCd : '008000'};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchGubun, 'GET', 'mtsoTypNm');
    }
    function setEventListener() {
    	//취소
    	 $('#btnArcnCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnArcnReg').on('click', function(e) {
    		 var param =  $("#EpwrStcMgmtArcnRegForm").getData();
    		 /*if ( !(($('#mtsoId').validator()).validate()) ) {
    			 callMsgBox('','I', '필수 입력 항목입니다.[ 국사명 ]', function(msgId, msgRst){});
    			 return;
    		 }*/
    		 if (param.mtsoNm == "") {
 	     		//필수 선택 항목입니다.[ 국사명 ]
 		    	callMsgBox('','I', '필수 입력 항목입니다.[ 국사명 ]', function(msgId, msgRst){});
 		    	//callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['managementGroup']), function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.mtsoTypNm == "") {
 	     		//필수 선택 항목입니다.[ 국사구분 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 국사구분 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.systmNm == "") {
 	     		//필수 선택 항목입니다.[ 시스템명 ]
 		    	callMsgBox('','I', '필수 입력 항목입니다.[ 시스템명 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.capa == "") {
 	     		//필수 선택 항목입니다.[ 용량 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 용량 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.vendNm == "") {
 	     		//필수 선택 항목입니다.[ 제조사명 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 제조사명 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.mnftDt == "") {
 	     		//필수 입력 항목입니다.[ 제조일자 ]
 		    	callMsgBox('','I', '필수 입력 항목입니다.[ 제조일자 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.htmprSoltnVal == "") {
 	     		//필수 선택 항목입니다.[ 고온 솔루션 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 고온 솔루션 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.rmsAcptYn == "") {
 	     		//필수 선택 항목입니다.[ RMS수용 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ RMS수용 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	ArcnReg();
		        }
		     });
         });

    	 //수정
    	 $('#btnArcnMod').on('click', function(e) {
    		 var param =  $("#EpwrStcMgmtArcnRegForm").getData();

    		 if (param.mtsoId == "") {
 	     		//필수 선택 항목입니다.[ 국사명 ]
 		    	callMsgBox('','I', '필수 입력 항목입니다.[ 국사명 ]', function(msgId, msgRst){});
 		    	//callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['managementGroup']), function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.mtsoTypNm == "") {
 	     		//필수 선택 항목입니다.[ 국사구분 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 국사구분 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.systmNm == "") {
 	     		//필수 선택 항목입니다.[ 시스템명 ]
 		    	callMsgBox('','I', '필수 입력 항목입니다.[ 시스템명 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.capa == "") {
 	     		//필수 선택 항목입니다.[ 용량 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 용량 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.vendNm == "") {
 	     		//필수 선택 항목입니다.[ 제조사명 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 제조사명 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.mnftDt == "") {
 	     		//필수 입력 항목입니다.[ 제조일자 ]
 		    	callMsgBox('','I', '필수 입력 항목입니다.[ 제조일자 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.htmprSoltnVal == "") {
 	     		//필수 선택 항목입니다.[ 고온 솔루션 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ 고온 솔루션 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 if (param.rmsAcptYn == "") {
 	     		//필수 선택 항목입니다.[ RMS수용 ]
 		    	callMsgBox('','I', '필수 선택 항목입니다.[ RMS수용 ]', function(msgId, msgRst){});
 	     		return;
 	     	 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', '수정하시겠습니까?', function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 ArcnMod();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnArcnDel').on('click', function(e) {
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //삭제한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 ArcnDel();
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
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'ArcnReg'){
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
			$(opener.location).attr("href","javascript:arcn.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'ArcnMod'){
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
			$(opener.location).attr("href","javascript:arcn.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'ArcnDel') {
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
			$(opener.location).attr("href","javascript:arcn.setGrid("+pageNo+","+rowPerPage+");");
    	}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'arcnReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function ArcnReg(){
    	var param = $('#EpwrStcMgmtArcnRegArea').getData();
    	param.userId = "TestRegUserId"; // 추후 삭제 요망

    	if(param.mnftDt.length > 6) {
    		var tmp = (param.mnftDt).split('-');
        	param.mnftDt = tmp[0]+tmp[1];
    	}

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveArcn', param, 'POST', 'ArcnReg');

    }

    function ArcnMod(){
    	var param = $('#EpwrStcMgmtArcnRegArea').getData();
    	param.userId = "TestRegUserId"; // 추후 삭제 요망

    	if(param.mnftDt.length > 6) {
    		var tmp = (param.mnftDt).split('-');
        	param.mnftDt = tmp[0]+tmp[1];
    	}

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveArcn', param, 'POST', 'ArcnMod');
    }

    function ArcnDel(){
    	var param = $('#EpwrStcMgmtArcnRegArea').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteArcnMgmt', param, 'POST', 'ArcnDel');
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