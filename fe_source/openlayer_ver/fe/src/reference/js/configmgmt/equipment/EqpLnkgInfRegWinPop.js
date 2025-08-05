/**
 * EqpReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

//	var emsIpAddr = "";
	var dcnInfList = [];
	var paramData = null;
	var eqpLnkgInf = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
        setEventListener();
        setRegDataSet(param);
    };

    function setRegDataSet(data) {
    	$('body').progress();
    	data.mtsoId = data.eqpInstlMtsoId;

    	$('#eqpLnkgInfRegArea').setData(data);
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpLnkgInf/'+data.eqpId, null, 'GET', 'eqpLnkgInf');

    }

    function setEventListener() {

    	$('#snmpRattNcnt').keyup(function(e) {
    		 if(!$("#snmpRattNcnt").validate()){
    			//SNMP 재시도횟수는 숫자만 입력 가능합니다.
    			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['simpleNetworkManagementProtocolReAttemptNumberOfCount']), function(msgId, msgRst){});
    			$('#snmpRattNcnt').val("");
    			 return;
    		 };
        });

    	$('#snmpLimtTimeSec').keyup(function(e) {
   		 if(!$("#snmpLimtTimeSec").validate()){
   			//SNMP제한시간초는 숫자만 입력 가능합니다.
   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['simpleNetworkManagementProtocolLimitTimeSecond']), function(msgId, msgRst){});
   			$('#snmpLimtTimeSec').val("");
   			 return;
   		 };
       });

    	$('#emsPortNoVal').keyup(function(e) {
   	 		if(!$("#emsPortNoVal").validate()){
	   			//EMS포트번호는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['elementManagementSystemPortNumber']), function(msgId, msgRst){});
	   			$('#emsPortNoVal').val("");
	   			 return;
	   		};
   	 	});


    	//취소
    	 $('#btnCncl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });

    	//저장
    	 $('#btnSave').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
 			 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
 			        if (msgRst == 'Y') {
 			        	eqpLnkgInfReg();
 			        }
 			      });
         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

    	//탭변경 이벤트
    	 $('#basicTabs').on("tabchange", function(e, index) {
 			switch (index) {
 			case 0 :
 				$('#btnSave').show();
 				$('#btnCncl').show();
 				break;
 			default :
 				$('#btnSave').hide();
				$('#btnCncl').hide();
 				break;
 			}
     	});

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'dcnByLnkg') {
    		if(response.Result == "Success"){

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpLnkgInf/'+paramData.eqpId, null, 'GET', 'eqpLnkgInf');

    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close("Y");
    				}
    			});

    			var pageNo = $("#pageNo", opener.document).val();
    			var rowPerPage = $("#rowPerPage", opener.document).val();

    			$(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
        	}else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	//장비 연동 정보 셋팅
    	if(flag == 'eqpLnkgInf') {

    		if(paramData.mgmtGrpNm == "SKT"){
    			paramData.mgmtGrpCd = "0001";
        	}else{
        		paramData.mgmtGrpCd = "0002";
        	}
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpDcnPort', paramData, 'GET', 'eqpDcnPort');

        	eqpLnkgInf = response;

    		$('#eqpLnkgInfRegArea').setData(response);
//    		if(response.emsIpAddr != null && response.emsIpAddr != ""){
//    			emsIpAddr = response.emsIpAddr;
//    		}
    	}

    	if(flag == 'eqpDcnPort') {
    		//연동코드가 TEAMS가 아닐 경우 기타장비(IP장비포함) 탭 선택
    		if(eqpLnkgInf.lnkgSystmCd != "TEAMS"){
    			if (eqpLnkgInf.lnkgSystmCd != null) {
    				$('#basicTabs').removeTab(1);
    				$('#basicTabs').removeTab(1);
    				$('#btnSave').show();
     				$('#btnCncl').show();
    			} else {
//    			$('#basicTabs').setTabIndex(2);
	    			$('#basicTabs').removeTab(0);
	    			$('#basicTabs').removeTab(0);
	    			$('#btnSave').hide();
	 				$('#btnCncl').hide();
    			}
    		}else{
    			//연동코드가 TEAMS이고 포트정보가 있을 경우 전송장비-직접접속(DCN정보) 탭 선택
    			if(response.length > 0){
//    				$('#basicTabs').setTabIndex(0);
    				$('#basicTabs').removeTab(1);
    				$('#basicTabs').removeTab(1);
    				$('#btnSave').show();
     				$('#btnCncl').show();
    			//연동코드가 TEAMS이고 포트정보가 없을 경우 전송장비-EMS접속 탭 선택
    			}else{
//    				$('#basicTabs').setTabIndex(1);
    				$('#basicTabs').removeTab(0);
    				$('#basicTabs').removeTab(1);
    				$('#btnSave').hide();
     				$('#btnCncl').hide();
    			}
    		}

    		if(response.length > 0){
    			$('#btnSave').setEnabled(true);
    			dcnInfList = response;

    			for (var i = 0; i < response.length; i++) {
        			var portType = response[i].portTypVal;
    				var portTypeName = "";
    				var portTypeCnt = 0;
    				if(portType != undefined){
    					for(var a=0; a<portType.length; a++)
    					{
    						if(portType.charAt(a) == '1')
    						{
    							if(portTypeCnt > 0)
    							{
    								portTypeName += "/";
    							}

    							if(a==0)
    							{
    								portTypeName += "장애";
    							}
    							else if(a==1)
    							{
    								portTypeName += "제어";
    							}
    							else if(a==2)
    							{
    								portTypeName += "장비접속";
    							}
    							else if(a==3)
    							{
    								portTypeName += "성능";
    							}
    							else if(a==4)
    							{
    								portTypeName += "실장";
    							}
    							else if(a==5)
    							{
    								portTypeName += "NE목록";
    							}

    							portTypeCnt++;
    						}
    					}
    				}
    				$("#portVal"+(i+1)).val(response[i].portVal);
    				$("#portTypVal"+(i+1)).val(response[i].portTypVal);
    				$("#portTypValNm"+(i+1)).val(portTypeName);
    				$("#lginId"+(i+1)).val(response[i].lginId);
    				$("#lginPwd"+(i+1)).val(response[i].lginPwd);
    				$("#lginId"+(i+1)).setEnabled(true);
    				$("#lginPwd"+(i+1)).setEnabled(true);
    			}
    		}else{
    			$('#btnSave').setEnabled(false);
    		}

    		$('body').progress().remove();
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'dcnByLnkg'){
    		//저장을 실패 하였습니다.
    	    callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'eqpDcnPort') {
    		var aa = 1;
    	}
    }

    function eqpLnkgInfReg() {
    	var userId;
		if($("#userId").val() == ""){
			userId = "SYSTEM";
		}else{
			userId = $("#userId").val();
		}

		var isSKB = $("#mgmtGrpNm").val() == "SKB" ? true : false; //SKB
		var isRT = $("#eqpRoleDivCd").val() == "101" ? true : false; //RT장비
		var isMakeDcnYn = true;
		if (dcnInfList != null && dcnInfList.length > 0)
		{
			if(dcnInfList[0].dcnCreYn == "N"){ //CM_DCN_STD_PORT_INF 값, 수정시 CF_DCN에 이미 저장된 경우는 MAKE_DCN_YN값 없음. 이 경우 임의로 저장시키도록 처리.
				isMakeDcnYn = false;
			}

			//SKT요구: 기간망장비 모델 NTROADM_CPL (DMT0001482) 중 서브 TID 는 DCN 저장 하지 않는다.
			//SKB인 경우, RT 장비는 DCN 생성이 되지 않도록 처리, 기간망, COT 장비라고 하더라도 CF_DCN_STD_PORT 의 MAKE_DCN_YN 이 'Y' 인경우에만 DCN 을 생성하도록 수정
			if (($("#eqpTid").val().indexOf("_#") > 0 && ($("#eqpMdlId").val() == "DMT0001482" || $("#eqpMdlId").val() == "DMT0009375")) || (isSKB && (isRT || !isMakeDcnYn))){
				callMsgBox('','W', "DCN을 생성 할수 없는 장비입니다..", function(msgId, msgRst){});
	    	}else{
	    		if($("#mainEqpIpAddr").val() == ""){
		   			callMsgBox('','W', "장비정보 수정 화면에서 장비IP주소를 입력하십시오.", function(msgId, msgRst){});
		   			 return;
		   		};

				 for (var i = 0; i < dcnInfList.length; i++) {
					 dcnInfList[i].dcnId = $("#dcnId").val();
					 dcnInfList[i].mgmtGrpCd = $("#mgmtGrpNm").val() == "SKT" ? "0001" : "0002";
					 dcnInfList[i].eqpTid = $("#eqpTid").val();
					 dcnInfList[i].mainEqpIpAddr = $("#mainEqpIpAddr").val();
					 dcnInfList[i].eqpId = $("#eqpId").val();
					 dcnInfList[i].mtsoId = $("#mtsoId").val();
					 dcnInfList[i].eqpMdlId = $("#eqpMdlId").val();
					 dcnInfList[i].frstRegUserId = userId;
					 dcnInfList[i].lastChgUserId = userId;

					//장비의 skt2여부를 dcn정보에 넣어준다
					 if($("#skt2EqpYn").val() == "YES"){
						 dcnInfList[i].skt2EqpYn = "Y";
					 }else{
						 dcnInfList[i].skt2EqpYn = "N";
					 }

					if (i == 0) {
						if ($('#portVal1').val() != '' && $('#portPortVal1').val() != '') {
							dcnInfList[i].lginId = $('#lginId1').val();
							dcnInfList[i].lginPwd = $('#lginPwd1').val();
						}
					} else if (i == 1) {
						if ($('#portVal2').val() != '' && $('#portPortVal2').val() != '') {
							dcnInfList[i].lginId = $('#lginId2').val();
							dcnInfList[i].lginPwd = $('#lginPwd2').val();
						}
					} else if (i == 2) {
						if ($('#portVal3').val() != '' && $('#portPortVal3').val() != '') {
							dcnInfList[i].lginId = $('#lginId3').val();
							dcnInfList[i].lginPwd = $('#lginPwd3').val();
						}
					} else if (i == 3) {
						if ($('#portVal4').val() != '' && $('#portPortVal4').val() != '') {
							dcnInfList[i].lginId = $('#lginId4').val();
							dcnInfList[i].lginPwd = $('#lginPwd4').val();
						}
					}
				}

				 if($("#dcnId").val() == ""){
					 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/insertDcnByLnkg', dcnInfList, 'POST', 'dcnByLnkg');
				 }else{
					 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/updateDcnByLnkg', dcnInfList, 'POST', 'dcnByLnkg');
				 }
	    	}
    	}
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