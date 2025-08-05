/**
 * CifMtsoReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.

	var paramData = null;

    this.init = function(id, param) {

    	if(param.regYn == "Y"){
    		paramData = param;
    	}
    	setEventListener();
        setSelectCode();
        setRegDataSet(param);
    };

    function setRegDataSet(data) {
    	$("#mtsoId").val(data.mtsoId);
    	if(data.autoSearchYn == "Y"){
    		data.page = 1;
    		data.rowPerPage = 100;
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoAdtnList', data, 'GET', 'search');
        }else{
        	$('#cifMtsoAdtnRegArea').setData(data);
        }
    }

    function setSelectCode() {
    }

    function setEventListener() {

    	//취소
    	 $('#btnCncl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });
//    	 $('#epwrFixdGntEyn').setEnabled(false);
//    	 $('#epwrMovGntEyn').setEnabled(false);
//    	 $('#epwrDlstYn').setEnabled(false);
    	 $('#trmsOptlLnDlstYn').setEnabled(false);

    	//저장
    	 $('#btnSave').on('click', function(e) {

    		 var param =  $("#cifMtsoRegForm").getData();

         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 cifMtsoAdtnReg();
		        }
		     });
         });

    	 $('#accGoutTimeVal').keyup(function(e) {
  	 		if(!$("#accGoutTimeVal").validate()){
 	   			//시간은 숫자만 입력 가능합니다.
 	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal','[시간]' ), function(msgId, msgRst){});
 	   			$('#accGoutTimeVal').val("");
 	   			 return;
 	   		};
  	 	 });

    	 $('#accGoutDistVal').keyup(function(e) {
   	 		if(!$("#accGoutDistVal").validate()){
  	   			//거리는 숫자만 입력 가능합니다.
  	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal','[거리]' ), function(msgId, msgRst){});
  	   			$('#accGoutDistVal').val("");
  	   			 return;
  	   		};
   	 	 });

    	 $('#trmsGoutTimeVal').keyup(function(e) {
   	 		if(!$("#trmsGoutTimeVal").validate()){
  	   			//시간은 숫자만 입력 가능합니다.
  	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal','[시간]' ), function(msgId, msgRst){});
  	   			$('#trmsGoutTimeVal').val("");
  	   			 return;
  	   		};
   	 	 });

     	 $('#trmsGoutDistVal').keyup(function(e) {
    	 	if(!$("#trmsGoutDistVal").validate()){
   	   			//거리는 숫자만 입력 가능합니다.
   	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal','[거리]' ), function(msgId, msgRst){});
   	   			$('#trmsGoutDistVal').val("");
   	   			 return;
   	   		};
    	 });

	};



	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {

    		$('#cifMtsoAdtnRegArea').setData(response.cifMtsoAdtnList[0]);
    	}

    	if(flag == 'CifMtsoAdtnReg') {
    		console.log("!!!!!!!!!!")
    		if(response.Result == "Success"){

	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		           $a.close();
	    		       }
	    		});

	    		var pageNo = $("#pageNo", opener.document).val();
	    		var rowPerPage = $("#rowPerPage", opener.document).val();

	            $(opener.location).attr("href","javascript:cifMtso.setGrid("+pageNo+","+rowPerPage+");");
    		}else{
    			//저장을 실패 하였습니다.
        		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'CifMtsoAdtnReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}

    }

    function cifMtsoAdtnReg() {
    	 var param =  $("#cifMtsoAdtnRegForm").getData();

//    	 if(param.epwrFixdGntEyn == "O"){
//			 param.epwrFixdGntEyn = "Y";
//		 }else if(param.epwrFixdGntEyn == "X"){
//			 param.epwrFixdGntEyn = "N";
//		 }
//
//    	 if(param.epwrDlstYn == "O"){
//			 param.epwrDlstYn = "Y";
//		 }else if(param.epwrDlstYn == "X"){
//			 param.epwrDlstYn = "N";
//		 }
//
//    	 if(param.epwrMovGntEyn == "O"){
//			 param.epwrMovGntEyn = "Y";
//		 }else if(param.epwrMovGntEyn == "X"){
//			 param.epwrMovGntEyn = "N";
//		 }
//
//    	 if(param.trmsOptlLnDlstYn == "O"){
//			 param.trmsOptlLnDlstYn = "Y";
//		 }else if(param.trmsOptlLnDlstYn == "X"){
//			 param.trmsOptlLnDlstYn = "N";
//		 }
//
//    	 if(param.envIntnCctvEyn == "O"){
//			 param.envIntnCctvEyn = "Y";
//		 }else if(param.envIntnCctvEyn == "X"){
//			 param.envIntnCctvEyn = "N";
//		 }
//
//    	 if(param.envFlodSnsrEyn == "O"){
//			 param.envFlodSnsrEyn = "Y";
//		 }else if(param.envFlodSnsrEyn == "X"){
//			 param.envFlodSnsrEyn = "N";
//		 }
//
//    	 if(param.flodSnsrNeedYn == "O"){
//			 param.flodSnsrNeedYn = "Y";
//		 }else if(param.flodSnsrNeedYn == "X"){
//			 param.flodSnsrNeedYn = "N";
//		 }
//
//    	 if(param.comUseYn == "O"){
//			 param.comUseYn = "Y";
//		 }else if(param.comUseYn == "X"){
//			 param.comUseYn = "N";
//		 }
//
//


    	 if (param.epwrFixdGntEyn	== 'O') {param.epwrFixdGntEyn	= 'Y';} else if (param.epwrFixdGntEyn	== 'X') {param.epwrFixdGntEyn	= 'N';}
    	 if (param.epwrMovGntEyn	== 'O') {param.epwrMovGntEyn	= 'Y';} else if (param.epwrMovGntEyn	== 'X') {param.epwrMovGntEyn	= 'N';}
    	 if (param.epwrDlstYn       == 'O') {param.epwrDlstYn       = 'Y';} else if (param.epwrDlstYn       == 'X') {param.epwrDlstYn       = 'N';}
    	 if (param.comUseYn         == 'O') {param.comUseYn         = 'Y';} else if (param.comUseYn         == 'X') {param.comUseYn         = 'N';}
    	 if (param.epwrDlstYn       == 'O') {param.epwrDlstYn       = 'Y';} else if (param.epwrDlstYn       == 'X') {param.epwrDlstYn       = 'N';}
    	 if (param.trmsOptlLnDlstYn == 'O') {param.trmsOptlLnDlstYn = 'Y';} else if (param.trmsOptlLnDlstYn == 'X') {param.trmsOptlLnDlstYn = 'N';}
    	 if (param.envIntnCctvEyn   == 'O') {param.envIntnCctvEyn   = 'Y';} else if (param.envIntnCctvEyn   == 'X') {param.envIntnCctvEyn   = 'N';}
    	 if (param.envFlodSnsrEyn   == 'O') {param.envFlodSnsrEyn   = 'Y';} else if (param.envFlodSnsrEyn   == 'X') {param.envFlodSnsrEyn   = 'N';}
    	 if (param.flodSnsrNeedYn   == 'O') {param.flodSnsrNeedYn   = 'Y';} else if (param.flodSnsrNeedYn   == 'X') {param.flodSnsrNeedYn   = 'N';}


    	 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 console.log(param);

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mergeCifMtsoAdtnInf', param, 'POST', 'CifMtsoAdtnReg');
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