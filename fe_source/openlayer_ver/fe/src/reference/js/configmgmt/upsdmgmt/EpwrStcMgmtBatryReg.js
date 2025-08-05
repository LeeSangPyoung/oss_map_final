/**
 * DrawCblIstnAttr.js
 *
 * @author Administrator
 * @date 2017. 11. 27.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var rtfInfTmp = [];
	var userId = 'testUser';
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param
    	if(param.stat == 'add'){
    		$('#batryMod').hide();
    		$('#batryAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#batryAdd').hide();
    		$('#batryMod').show();
    		setData(param);
    		$('#btnUpsdMtsoSearch').hide();
    	}
    	setEventListener();
    };

    function setData(param) {
    	if (param.mdlNm != null && param.mdlNm != '' && param.mdlNm != ' ') {
	    	var mdl = param.mdlNm;
	    	var tmp = mdl.split('-');
	    	param.mdlNm = tmp[0];
    	}

    	$('#EpwrStcMgmtBatryRegForm').setData(param)
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfInf', {mtsoId : param.mtsoId}, 'GET', 'getRtfInf');
    }
    function setEventListener() {
    	//취소
    	 $('#btnBatryCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnBatryReg').on('click', function(e) {
    		 $('#frstRegUserId').val(userId);
    		 $('#lastChgUserId').val(userId);
    		 if($('#mtsoTypCd').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','정류기명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#capa').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#voltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#cellCnt').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','Cell개수'), function(msgId, msgRst){});
    			 return;
    		 }
         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 BatryReg();
		        }
    		 });
    	 });

    	 //수정
    	 $('#btnBatryMod').on('click', function(e) {
    		 $('#lastChgUserId').val(userId);
    		 if($('#mtsoTypCd').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','정류기명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#capa').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#voltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#cellCnt').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','Cell개수'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 BatryMod();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnBatryDel').on('click', function(e) {
    		 /*    		 if($('#mtsoTypCd').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 BatryDel();
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

   	           httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfInf', {mtsoId : data.mtsoId}, 'GET', 'getRtfInf');
   	           	}
   	      	});

    	 })
    	 $('#rtfNm').on('change',function(e) {
    		 var i = document.getElementById('rtfNm').selectedIndex-1;
    		 $('#rtfMdlNm').val(rtfInfTmp[i].rtfMdlNm)
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
		if(flag == 'batryReg'){
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
			$(opener.location).attr("href","javascript:batry.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'batryMod'){
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
			$(opener.location).attr("href","javascript:batry.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'batryDel') {
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
			$(opener.location).attr("href","javascript:batry.setGrid("+pageNo+","+rowPerPage+");");
    	}

		if(flag == 'getRtfInf') {
			var option_data = [{rtfNm: '', rtfNm: '선택'}];
			for(var i=0; i<response.length; i++){
				var resObj = {rtfNm: response[i].rtfNm, rtfNm: response[i].rtfNm};
				option_data.push(resObj);
			}
			$('#rtfNm').setData({
				data : option_data,
				option_selected: ''
			});
			rtfInfTmp = response;
		}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'batryReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function BatryReg(){
    	var param = $('#EpwrStcMgmtBatryRegForm').getData();
    	param.cblTknsSumr = parseInt(param.cblTknsVal) * parseInt(param.cblCnt);
    	if(param.mdlNm != "" && param.mdlNm != null){
    		param.mdlNm = param.mdlNm + '-' + param.capa;
    	}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveBatry', param, 'POST', 'batryReg');

    }

    function BatryMod(){
    	var param = $('#EpwrStcMgmtBatryRegForm').getData();
    	param.batryId = paramData.batryId
    	param.cblTknsSumr = parseInt(param.cblTknsVal) * parseInt(param.cblCnt);
    	if(param.mdlNm != "" && param.mdlNm != null){
    		param.mdlNm = param.mdlNm + '-' + param.capa;
    	}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveBatry', param, 'POST', 'batryMod');
    }

    function BatryDel(){
    	var param = $('#EpwrStcMgmtBatryRegForm').getData();
    	param.batryId = paramData.batryId
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteBatry', param, 'POST', 'batryDel');
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