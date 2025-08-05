/**
 * MtsoReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.

	var paramData = null;
	var dupBldChk = "N";
	var dupMtsoNm = "";
	var mtsoDetlTypChg = null;
	var cifTakeAprvStatCd = "";

    this.init = function(id, param) {
    	setEventListener();
        setRegDataSet(param);
        httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoTakeRv', param, 'GET', 'cifMtsoTakeRv');

    };

    function setRegDataSet(data) {

    	$('#cifMtsoTakeRvArea').setData(data);

    	var param =  $("#cifMtsoTakeRvForm").getData();

    	var adtnAttrVal = param.adtnAttrVal;
    	var aprvT = ""; //T망 권한

    	if(adtnAttrVal.indexOf('CIF_MTSO_APRV_T') > 0){
    		aprvT = "Y";
    	}

    	if(aprvT == "Y"){
    		$('#btnAprvSave').show();
    		$('#btnCdtlAprvSave').show();
    		$('#btnSpmReq').show();
    		$('#btnTempSave').show();
    	}else{
    		$('#btnAprvSave').hide();
    		$('#btnCdtlAprvSave').hide();
    		$('#btnSpmReq').hide();
    		$('#btnTempSave').hide();
    	}

    }

    function setEventListener() {


    	//취소
    	 $('#btnCncl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });

    	//인수승인
    	 $('#btnAprvSave').on('click', function(e) {

    		 var param =  $("#cifMtsoTakeRvForm").getData();

    		 if ( validationCheck(param, "A") == true){
    			 //tango transmission biz 모듈을 호출하여야한다.
    			 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    				 //저장한다고 하였을 경우
    				 if (msgRst == 'Y') {
    					 cifTakeAprvStatCd = "05";
    					 cifMtsoReg();
    				 }
    			 });
    		 }
         });

    	 //조건부승인
    	 $('#btnCdtlAprvSave').on('click', function(e) {

    		 var param =  $("#cifMtsoTakeRvForm").getData();

    		 if ( validationCheck(param, "C") == true){
    			 //tango transmission biz 모듈을 호출하여야한다.
    			 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    				 //저장한다고 하였을 경우
    				 if (msgRst == 'Y') {
    					 cifTakeAprvStatCd = "04";
    					 cifMtsoReg();
    				 }
    			 });
    		 }
         });

    	 //보완요청
    	 $('#btnSpmReq').on('click', function(e) {
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	cifTakeAprvStatCd = "03";
		        	 cifMtsoReg();
		        }
		     });
    	 });

    	 //임시저장
    	 $('#btnTempSave').on('click', function(e) {
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	cifTakeAprvStatCd = "02";
		        	 cifMtsoReg();
		        }
		     });
    	 });

	};

	function makeMsg(flag, data) {
		var msg = "";
		if(flag == "A"){
			msg = "인수승인 시에는 모든 값이 양호 이어야 합니다. ["+data+"]";
		}else if(flag == "C"){
			msg = "조건부승인 시에는 모든 필수 값이 양호 이어야 합니다. ["+data+"]";
		}
		return msg;
	}

	function validationCheck(param, flag) {

//		 if (param.ofcDlstVal == "" && flag == "A") {
//	    	callMsgBox('','I', makeMsg(flag, '광케이블 이원화 - 광케이블 이원화 여부 확인'), function(msgId, msgRst){});
//     		return false;
//     	 }

		 if (param.rcvgDsbnFcltsMdctObsrvYn != "Y") {
	    	callMsgBox('','I', makeMsg(flag, '시설공법 준수 - SKT 표준공법 준수 여부'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.rcvgDsbnCapaSuitYn != "Y") {
		    callMsgBox('','I', makeMsg(flag, '수배전 용량 적정성 - 차단기, 케이블'), function(msgId, msgRst){});
	     	return false;
	     }

    	 if (param.rcvgDsbnEmgncEgrnTmnbxYn != "Y" && flag == "A") {
 	    	callMsgBox('','I', makeMsg(flag, '수배전 비상발전 단자함 - 장시간 정전 대비 단자함 설치 여부'), function(msgId, msgRst){});
      		return false;
      	 }

    	 if (param.rtfOpStatYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '정류기 운용 상태 - 정상 작동 여부 확인'), function(msgId, msgRst){});
		    return false;
	     }

    	 if (param.rtfBrStatYn != "Y") {
			callMsgBox('','I', makeMsg(flag, 'BR 상태 - BR 해제 여부 확인'), function(msgId, msgRst){});
		    return false;
	     }

    	 if (param.rtfCapaSuitYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '용량 적정성 - 부하율 70%이하 용량 확보 여부 확인'), function(msgId, msgRst){});
		    return false;
	     }

    	 if (param.batryOpStatYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '축전지 운용 상태 - 정상 작동 여부 확인'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.batryCapaSuitYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '용량 적정성 - 백업시간 3시간 이상'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.batrySwchgTestYn != "Y" && flag == "A") {
   	    	callMsgBox('','I', makeMsg(flag, '절체시험 - 축전지 절체시 정상 백업 여부'), function(msgId, msgRst){});
        		return false;
         }

    	 if (param.gntOpStatYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '발전기 운용 상태 - 정상 작동 여부 확인'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.gntCapaSuitYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '용량적정성 - 부하 대비 용량 확인'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.arcnOpStatYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '냉방기 운용 상태 - 정상작동 여부 확인'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.arcnCapaSuitYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '용량 적정성 - 실온도 25ºC 이하, 부하대비 용량 확인'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.fextnOpStatYn != "Y") {
			callMsgBox('','I', makeMsg(flag, '소화설비 운용 상태 - 정상 작동 여부 확인'), function(msgId, msgRst){});
     		return false;
     	 }

    	 if (param.envMntrDevOpStatYn != "Y" && flag == "A") {
	    	callMsgBox('','I', makeMsg(flag, '환경감시장치 운용 상태 - 정상 작동 여부 확인'), function(msgId, msgRst){});
     		return false;
    	 }

    	 if (param.envNmntrFctYn != "Y" && flag == "A") {
 	    	callMsgBox('','I', makeMsg(flag, '미감시 설비 여부 - 감시 누락 설비 여부 확인'), function(msgId, msgRst){});
      		return false;
     	 }

    	 if (param.envCctvYn != "Y" && flag == "A") {
  	    	callMsgBox('','I', makeMsg(flag, 'CCTV - 설치, 정상 작동 여부 확인'), function(msgId, msgRst){});
       		return false;
      	 }

    	 if (param.envTmprSnsrYn != "Y" && flag == "A") {
   	    	callMsgBox('','I', makeMsg(flag, '온도센서 - 설치, 정상작동 여부 확인'), function(msgId, msgRst){});
        	return false;
       	 }

    	 return true;
	}

	function cifMtsoReg() {
	   	 var param =  $("#cifMtsoTakeRvForm").getData();
	   	 param.comAddSpmMtrVal = $("#comAddSpmMtrVal").val();

	   	 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 param.cifTakeAprvStatCd = cifTakeAprvStatCd;
		 param.takeAprvId = userId;
		 if(cifTakeAprvStatCd == "04" || cifTakeAprvStatCd == "05"){
//			 승인 시 국사유형을 중심국사로 변경
			 param.mtsoTypCd = "2";
			 //승인 시 국사세부유형을 T_중심국으로 변경
			 param.mtsoDetlTypCd = "002";
		 }
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

	   	 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateCifMtsoTakeRvInfo', param, 'POST', 'updateCifMtsoTakeRvInfo');
   }

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'cifMtsoTakeRv') {
    		$('#cifMtsoTakeRvArea').setData(response.cifMtsoTakeRvInfo[0]);
    		$('#comAddSpmMtrVal').val(response.cifMtsoTakeRvInfo[0].comAddSpmMtrVal);
    	}

    	if(flag == 'updateCifMtsoTakeRvInfo') {
    		var userId;
	   		if($("#userId").val() == ""){
	   			userId = "TANGOT";
	   		}else{
	   			userId = $("#userId").val();
	   		}
    		//userId = "PTN0036774";

    		var rcprUserId = [];
	   		var param = $("#cifMtsoTakeRvForm").getData();

	   		if(cifTakeAprvStatCd == "04" || cifTakeAprvStatCd == "05"){
				 //승인 시 국사세부유형을 T_중심국으로 변경
				 var paramDataR = [{"mtsoId":param.mtsoId, "mtsoDetlTypCd":"002", "ukeyMtsoCd":param.ukeyMtsoId, "fcltNm":param.mtsoNm, "bldNo":param.bldCd ,"addrNm":param.bldAddr ,"intgFcltsCd":param.repIntgFcltsCd ,"editUserId":userId}];
		         httpRequest('tango-transmission-gis-biz/transmission/gis/fm/facilityinfo/updateMtsoDetlTypCd' , paramDataR, 'POST', '');
			}

	   		rcprUserId[0] = $("#takeReqpId").val(); //여러명에게 보낼 수 있도록 일단 배열처리
	   		param.rcprUserId = rcprUserId; //수신자 ID
//	   		param.orgId = $("#orgId").val(); // totMailYn = Y 인 경우 orgId에 속한 사람들에게 메일 전송 - 지금은 업무 로직과 맞지 않아 주석처리
	   		param.totMailYn = "N"; // Y:수신자가 속한 본부의 사람들 모두에게 전송, N:수신자에게만 전송(rcprUserId[])
	   		param.aprvGubun = "AT"; // 해당 권한자에게 발송
	   		param.userId = userId; //발신자 ID
	   		param.frstRegUserId = userId;
	   		param.lastChgUserId = userId;
	   		param.emailTitlNm = "통합국 인수 검토 결과"; // 메일 제목

	   		var emailCtt = "";
	   		if(cifTakeAprvStatCd == "03"){ // 보완요청
	   			emailCtt = "요청하신 [" + param.mtsoNm + "] 국사의 중통집 인수 검토 결과 보완 요청 되었습니다.";
	   			emailCtt += "<br>보완요청내용 : "+$("#comAddSpmMtrVal").val();
	   		}else if(cifTakeAprvStatCd == "04"){ // 조건부승인
	   			emailCtt = "요청하신 [" + param.mtsoNm + "] 국사의 중통집 인수 검토 결과 조건부승인이 완료 되었습니다.";
	   		}else if(cifTakeAprvStatCd == "05"){ // 인수승인
	   			emailCtt = "요청하신 [" + param.mtsoNm + "] 국사의 중통집 인수 검토 결과 인수승인이 완료 되었습니다.";
	   		}
	   		param.emailCtt = emailCtt; // 메일 내용

    		if(response.Result == "Success"){
    			if(cifTakeAprvStatCd != "02" && cifTakeAprvStatCd != ""){
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/reqemail', param, 'POST', 'reqemail');
    			}else{
	        		callMsgBox('','I', '정상적으로 완료 되었습니다.' , function(msgId, msgRst){
	        			if (msgRst == 'Y') {
	        				$a.close();
	        			}
	        		});
    			}
    		}else{
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'reqemail') {
    		if(response.Result == "Success"){
        		callMsgBox('','I', '정상적으로 완료 되었습니다.' , function(msgId, msgRst){
        			if (msgRst == 'Y') {
        				$a.close();
        			}
        		});
    		}else{
    			callMsgBox('','I', response.Msg , function(msgId, msgRst){
    				if (msgRst == 'Y') {
        				$a.close();
        			}
    			});
    		}

    	}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

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

    function popup(pidData, urlData, titleData, paramData) {

     $a.popup({
           	popid: pidData,
           	title: titleData,
               url: urlData,
               data: paramData,
               iframe: true,
               modal: true,
               movable:true,
               width : 1200,
               height : window.innerHeight * 0.9

               /*
               	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
               */
               //width: 1000,
               //height: 700

           });
     }
});