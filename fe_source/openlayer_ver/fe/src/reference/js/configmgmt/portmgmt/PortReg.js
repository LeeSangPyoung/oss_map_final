/**
 * PortReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	//초기 진입점
	var paramData = null;
	var fromEqpMgmt = null;
	var portRuleInfData = [];

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
	//function init(id,param){

    	if(param.regYn == "Y"){
    		paramData = param;
    	}

        setEventListener();
        setSelectCode();
        setRegDataSet(param);

        if(param.fromEqpMgmt == "Y"){
        	fromEqpMgmt = "Y";
        	$('#ruleChkErr').hide();
            $('#ruleChk').hide();
        	$('#btnEqpSearch').hide();
        	$('#portRule').val("");
        	$('#portRuleErrMsg').val("");
            $('#eqpNmPortReg').val(param.eqpNm);
            $('#eqpIdPortReg').val(param.eqpId);
            $('#eqpMdlIdPortReg').val(param.eqpMdlId);
            setPortId(param.eqpId);
            setCardId(param.eqpId);
            portRuleInf(param.eqpMdlId);

            if(param.eqpRoleDivCd == "15" || param.eqpRoleDivCd == "16"){
        		$('#wavlValReg').setEnabled(true);
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/wavlVal/'+ param.eqpId, null, 'GET', 'wavlVal');
        	}
        }

        if(param.cardMdlNm != null && param.cardMdlNm != "" && param.cardMdlNm != undefined){
        	if(param.cardMdlNm.indexOf("5GPON_MAIN") > -1 || param.cardMdlNm.indexOf("5GPON_SUB") > -1){
        		$('#portNmReg').setEnabled(false);
        	}else{
        		$('#portNmReg').setEnabled(true);
        	}
        }else{
        	$('#portNmReg').setEnabled(true);
        }

        if(param.rackShlfSlot == "" || param.rackShlfSlot == null){
        	if(param.eqpId != "" && param.cardId != "")
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/rackShlfSlot/'+ param.eqpId +'/'+ param.cardId, null, 'GET', 'rackShlfSlot');
		 }

        //선택한 장비에 해당하는 수동등록여부 조회[20171019]
        var paramS = {"eqpId" : param.eqpId, "eqpMdlId" : param.eqpMdlId};
        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', paramS, 'GET', 'eqpPortPveRegIsolYn');

    }

    //장비ID 생성
    function setPortId(data) {

    	if(paramData == null){

			httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portId/'+data, null, 'GET', 'portIdReg');
    	}
    }

  //카드정보 조회
    function setCardId(data) {

			httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/cardId/'+data, null, 'GET', 'cardIdReg');
    }

    function portRuleInf(data) {

    	if(paramData == null){

			httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portRuleInf/'+data, null, 'GET', 'portRuleInf');
    	}
    }

    function setRegDataSet(data) {

    	$('#ruleChk').hide();
    	$('#ruleChkErr').hide();
    	$('#portNmReg').setEnabled(false);
    	$('#cardIdReg').setEnabled(false);

    	$('#lgcPortYnReg').setEnabled(false);
    	$('#srsPortYnReg').setEnabled(false);
    	$('#autoMgmtYnReg').setEnabled(false);
    	$('#upLinkPortYnReg').setEnabled(false);
    	$('#dplxgMeansDivCdReg').setEnabled(false);
    	$('#dplxgPortYnReg').setEnabled(false);

    	if(data.regYn == "Y"){
    		$('#portRegYn').val("Y");
        	$('#btnEqpSearch').hide();

        	$('#portRegArea').setData(data);
        	$('#portNmOld').val(data.portNm);

        	if(data.mgmtGrpNm == "SKB"){			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + data.eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
//	   	    	callMsgBox('','I', "SKB 장비는 수정할수 없습니다.", function(msgId, msgRst){
//	   	    		$a.close();
//	   	    	});
	   	    }

        	if(data.eqpRoleDivCd != "15" && data.eqpRoleDivCd != "16"){
        		$('#wavlValReg').setData({
        			data:[{wavlVal: "",wavlValNm: "선택"}]
        		});
        		$('#wavlValReg').setEnabled(false);
        	}else{
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/wavlVal/'+ data.eqpId, null, 'GET', 'wavlVal');
        	}

        	if (data.eqpRoleDivCd == '11' || data.eqpRoleDivCd == '177' || data.eqpRoleDivCd == '178' || data.eqpRoleDivCd == '182') {
   			 	$('#portStatCdReg').setEnabled(false);
   		 	}

        	if(data.dumyPortYn == "YES"){
        		$('#dumyPortYnReg').setEnabled(true);
        	}else{
        		$('#dumyPortYnReg').setEnabled(false);
        	}

    	}else{
    		$('#btnPortInfCopyReg').setEnabled(false);
        	$('#btnChgHstReg').setEnabled(false);
        	$('#wavlValReg').setData({
    			data:[{wavlVal: "",wavlValNm: "선택"}]
    		});
        	$('#wavlValReg').setEnabled(false);
        	$('#dumyPortYnReg').setEnabled(false);
//    		$('#portRegArea').clear();
        	$('#lgcPortYnReg').val("NO");
        	$('#srsPortYnReg').val("NO");
        	$('#autoMgmtYnReg').val("NO");
        	$('#upLinkPortYnReg').val("NO");
        	$('#dplxgPortYnReg').val("NO");
        	$('#dumyPortYnReg').setSelected("NO");
    	}
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	//포트 유형 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00028', null, 'GET', 'portTypCdReg');
    	//포트 상태 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00101', null, 'GET', 'portStatCdReg');
    	//포트 용량 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'portCapaCdReg');
    	//이중화방식구분 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00102', null, 'GET', 'dplxgMeansDivCdReg');
    	//포트서비스구분 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00563', null, 'GET', 'portSrvcDivCdReg');
    	//포트 역할 구분 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00542', null, 'GET', 'cardRoleDivCdReg');
    	//카드정보 조회
    	if(paramData == null){
    		$('#cardIdReg').setData({
    			data:[{cardId: "",cardNm: "선택"}]
    		});
    	}else{
    		setCardId(paramData.eqpId);
    	}
    }

    function setEventListener() {

	    	//목록
	   	 $('#btnPrevReg').on('click', function(e) {
	   		$a.close();
	        });


	   	//포트관리정보
	   	 $('#btnPortMgmtInfReg').on('click', function(e) {
	   		 var param =  $("#portRegForm").getData();
	   		 //popup('PortMgmtInfReg', $('#ctx').val()+'/configmgmt/portmgmt/PortMgmtInfReg.do', '포트관리정보', param);
	   		popup('PortMgmtInfReg', '/tango-transmission-web/configmgmt/portmgmt/PortMgmtInfReg.do', '포트관리정보', param);
	        });

	   	//포트정보복사
	   	 $('#btnPortInfCopyRegToPort').on('click', function(e) {
	   		var param =  $("#portRegForm").getData();
	   		//popupList('PortInfCopyReg', $('#ctx').val()+'/configmgmt/portmgmt/PortInfCopyReg.do', '포트정보복사', param);
	   		popupList('PortInfCopyReg', '/tango-transmission-web/configmgmt/portmgmt/PortInfCopyReg.do', '포트정보복사', param);
	        });

	   //장비구간현황
	   	 $('#btnEqpSctnCurstLkupRegToPort').on('click', function(e) {
	   		var param =  $("#portRegForm").getData();
	   		//popupList2('EqpSctnAcptCurstReg', $('#ctx').val()+'/configmgmt/equipment/EqpSctnAcptCurst.do',configMsgArray['equipmentSectionCurrentState'], param);
	   		popupList2('EqpSctnAcptCurstReg', '/tango-transmission-web/configmgmt/equipment/EqpSctnAcptCurst.do',configMsgArray['equipmentSectionCurrentState'], param);
        });

		   	//네트워크현황
	   	 $('#btnNtwkLineCurstLkupRegToPort').on('click', function(e) {
	   		var param =  $("#portRegForm").getData();
	   		//popupList2('EqpNtwkLineAcptCurstReg', $('#ctx').val()+'/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
	   		popupList2('EqpNtwkLineAcptCurstReg', '/tango-transmission-web/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
        });

		   	//서비스회선현황
	   	 $('#btnSrvcLineCurstLkupRegToPort').on('click', function(e) {
	   		var param =  $("#portRegForm").getData();
	   		//popupList2('EqpSrvcLineAcptCurstReg', $('#ctx').val()+'/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
	   		popupList2('EqpSrvcLineAcptCurstReg', '/tango-transmission-web/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
        });

	   	//변경이력
	   	 $('#btnChgHstRegToPort').on('click', function(e) {
	   		var param =  $("#portRegForm").getData();
	   	    //popupList2('PortChgHstLkup', $('#ctx').val()+'/configmgmt/portmgmt/PortChgHstLkup.do', '변경이력', param);
	   		popupList2('PortChgHstLkup', '/tango-transmission-web/configmgmt/portmgmt/PortChgHstLkup.do', '변경이력', param);
	     });

	   //취소
		 $('#btnCnclPortReg').on('click', function(e) {
			 $a.close();
	     });

		//저장
    	 $('#btnSavePortReg').on('click', function(e) {

    		 var param =  $("#portRegForm").getData();

	    	 if (param.eqpId == "") {
	     		//필수 선택 항목입니다.[ 장비 ]
	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 장비 "), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.portNm == "") {
	     		//필수 선택 항목입니다.[ 포트명 ]
	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 포트명 "), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if ($('#portRuleErrMsg').val() != "") {
		     		//필수 선택 항목입니다.[ 포트명 ]
		     		callMsgBox('','W', '포트명의 표기법이 옳바르지 않습니다.', function(msgId, msgRst){});
		     		return;
		     	 }

	    	 if (param.portStatCd == "") {
	     		//필수 선택 항목입니다.[ 포트상태 ]
	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 포트상태 "), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 var saveConfirmMsg = '';
	    	 if (param.autoMgmtYn == "YES"){
	    		 saveConfirmMsg = configMsgArray['saveConfirm']+" ("+configMsgArray['autoMgmtYnAply']+")";
	    	 }else{
	    		 saveConfirmMsg = configMsgArray['saveConfirm'];
	    	 };

	    	callMsgBox('','C', saveConfirmMsg, function(msgId, msgRst){
	    		//저장한다고 하였을 경우
	 		    if (msgRst == 'Y') {
	 				portReg();
	 	    	}
	    	});

         });

    	//장비조회
    	 $('#btnEqpSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'EqpLkup',
    	          	title: '장비조회',
    	            //url: $('#ctx').val()+'/configmgmt/equipment/EqpLkup.do',
    	          	url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.83,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행

                        if(data.portPveRegIsolYn == 'Y'){  //[20171019]

                            setEnableObjByPortPveReg(false);

                            alertBox('W','수동등록 할 수없는 모델입니다.');
                            return;

                        } else {

                            setEnableObjByPortPveReg(true);

                            $('#ruleChk').hide();
                            $('#ruleChkErr').hide();
                            $('#portRule').val("");
                            $('#portRuleErrMsg').val("");
                            $('#eqpNmPortReg').val(data.eqpNm);
                            $('#eqpIdPortReg').val(data.eqpId);
                            $('#eqpMdlIdPortReg').val(data.eqpMdlId);
                            setPortId(data.eqpId);
                            setCardId(data.eqpId);
                            portRuleInf(data.eqpMdlId);
                            $('#portNmReg').setEnabled(true);
                            if(data.eqpRoleDivCd == "15" || data.eqpRoleDivCd == "16"){
                                $('#wavlValReg').setEnabled(true);
                                httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/wavlVal/'+ data.eqpId, null, 'GET', 'wavlVal');
                            }
                        }

    	           	}
    	      });
         });

    	//카드명 선택시 이벤트
    	 $('#cardIdReg').on('change', function(e) {
    		 var cardId = $("#cardIdReg").val();
    		 var cardNm = $("#cardIdReg").getTexts();
    		 var eqpId = $("#eqpIdPortReg").val();

    		 var chrrOrgGrpCd;
    		 if($("#chrrOrgGrpCd").val() == ""){
    			 chrrOrgGrpCd = "SKT";
    		 }else{
    			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    		 }

    		 if(eqpId != "" && cardId != ""){
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/rackShlfSlot/'+ eqpId +'/'+ cardId, null, 'GET', 'rackShlfSlot');
    		 }else{
    			 $('#rackShlfSlotReg').val("");
    		 }

    		 /*if(chrrOrgGrpCd == "SKB"){
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/tmptInf/'+ eqpId +'/'+ cardNm, null, 'GET', 'tmptInf');
    		 }else{

    		 }*/

         });

    	 //카드 등록
    	 $('#btnRegCardPort').on('click', function(e) {

    		 var param =  $("#portRegForm").getData();
//    		 dataParam = {"regYnCard" : "N"};
    		 param.fromPortReg = "Y";
    		 param.regYnCard = "N";

    		 if (param.eqpId == "") {
 	     		//필수 선택 항목입니다.[ 장비 ]
 	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 장비 "), function(msgId, msgRst){});
 	     		return;
 	     	 }

     		$a.popup({
              	popid: 'CardReg',
              	title: '형상 Card 등록',
                  //url: $('#ctx').val()+'/configmgmt/shpmgmt/CardReg.do',
              	  url: '/tango-transmission-web/configmgmt/shpmgmt/CardReg.do',
                  data: param,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.85,
                  callback : function(data) { // 팝업창을 닫을 때 실행
                	  if($('#eqpIdPortReg').val() != ""){
                		  setCardId($('#eqpIdPortReg').val());
                	  }
  	           	  }
              });
          });

    	 $('#portNmReg').keyup(function(e) {
    		 if($('#eqpIdPortReg').val() != "" && portRuleInfData.length > 0){
	    		 var portNm = $('#portNmReg').val();

	    		 var num = 0;
	    		 for(var i=0; i<portRuleInfData.length; i++){
	    			 var portRuleInf = new RegExp(portRuleInfData[i].portRglaExprVal+"$", "g");
        			 if(portRuleInf.test(portNm)){
        				 num++;
        			 }
        		 }

	    		 if(num > 0){
	    			 $('#portRuleErrMsg').val("");
	    		 }else{
	    			 $('#portRuleErrMsg').val("'"+portNm+"' 의 표기법은 옳바르지 않습니다.");
	    		 }
    		 }
    	 });

    	 $('#portNmReg').on('click', function(e) {
    		 if($('#eqpIdPortReg').val() != "" && portRuleInfData.length > 0){
    			 $('#ruleChk').show();
        		 $('#ruleChkErr').show();
        		 var portRule = "";
        		 	portRule = portRule + '모델명 : ' + portRuleInfData[0].eqpMdlNm;
        		 for(var i=0; i<portRuleInfData.length; i++){
        			 var num = i+1;
        			 portRule = portRule + '\n   - 룰' + num + ') ' + portRuleInfData[i].shpRuleRmk;
        		 }

        		 $('#portRule').val(portRule);
    		 }
         });

    	 $('#portNmReg').on('blur', function(e) {
    		 if($('#eqpIdPortReg').val() != "" && $('#portRuleErrMsg').val() == ""){
	    		 $('#ruleChk').hide();
	    		 $('#ruleChkErr').hide();
    		 }
         });


    	 $('#btnClose').on('click', function(e) {
       		 $a.close();
         });
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'PortReg') {
    		if(response.Result == "Success"){
    			if(response.resultList.lnkgDatDivCd == "C"){
    				var userId;
    				if($("#userId").val() == ""){
    					userId = "SYSTEM";
    				}else{
    					userId = $("#userId").val();
    				}

    				var param = {"eqpId":$("#eqpIdPortReg").val(), "lastChgUserId":userId};
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portNmCnt', param, 'GET', 'portNmCnt');
    			}

	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    			if (msgRst == 'Y') {
	    				response.resultList.portStatNm = $('#portStatCdReg').getTexts()[0];
//	    				console.log(response.resultList);
						 $a.close(response.resultList);
		    		}
		    	 });

	    		if(response.resultList.lnkgDatDivCd == "U" && response.resultList.portStatCd == "0003"){
	    			response.resultList.lnkgDatDivCd = "D";
	    		}

	    		param = response.resultList;
	    		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO005Send', param, 'POST', '');

	    		var pageNo = $("#pageNo", parent.document).val();
	    		var rowPerPage = $("#rowPerPage", parent.document).val();

	    		if(fromEqpMgmt == "Y"){
	    			$(parent.location).attr("href","javascript:portPop.setGrid("+pageNo+","+rowPerPage+");");
	    			$(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
	    		}
    		}else if(response.Result == "Dup"){
    			callMsgBox('','I', configMsgArray['saveFail']+" (중복된 포트명이 있습니다.)" , function(msgId, msgRst){});
    		}else if(response.Result == "Gren"){
    			callMsgBox('','I', "GIS에서 잠금상태인 코어 입니다.<br/>GIS에서 잠금 상태를 해제하시면 수정하실 수 있습니다." , function(msgId, msgRst){});
    		}else if(response.Result == "ExistsNtwkLine"){
    			var param =  $("#portRegForm").getData();
    			param.eqpRegCheck = 'ExistsNtwkLine';
    	   		//popupList('EqpNtwkLineAcptCurst', $('#ctx').val()+'/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
    	   		popupList('EqpNtwkLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
    		}else if(response.Result == "ExistsSrvcLine"){
    	   		var param =  $("#portRegForm").getData();
    			param.eqpRegCheck = 'ExistsSrvcLine';
    	   		//popupList('EqpSrvcLineAcptCurst', $('#ctx').val()+'/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
    	   		popupList('EqpSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
    		}
    	}

    	if(flag == 'portTypCdReg'){

    		$('#portTypCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#portTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#portTypCdReg').setData({
    	             data:option_data,
    	             portTypCd:paramData.portTypCd
    			});
    		}
    	}

    	if(flag == 'portStatCdReg'){

    		$('#portStatCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#portStatCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#portStatCdReg').setData({
    	             data:option_data,
    	             portStatCd:paramData.portStatCd
    			});
    		}
    	}

    	if(flag == 'portCapaCdReg'){

    		$('#portCapaCdReg').clear();

    		var option_data =  [{capaVal: "", capaCd: "",capaCdNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#portCapaCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#portCapaCdReg').setData({
    	             data:option_data,
    	             portCapaCd:paramData.portCapaCd
    			});
    		}
    	}


		if(flag == 'dplxgMeansDivCdReg'){

			$('#dplxgMeansDivCdReg').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#dplxgMeansDivCdReg').setData({
		             data:option_data
				});
			}
			else {
				$('#dplxgMeansDivCdReg').setData({
		             data:option_data,
		             dplxgMeansDivCd:paramData.dplxgMeansDivCd
				});
			}
		}

		if(flag == 'portSrvcDivCdReg'){

			$('#portSrvcDivCdReg').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#portSrvcDivCdReg').setData({
		             data:option_data
				});
			}
			else {
				$('#portSrvcDivCdReg').setData({
		             data:option_data,
		             portSrvcDivCd:paramData.portSrvcDivCd
				});
			}
		}

		if(flag == 'cardRoleDivCdReg'){

			$('#cardRoleDivCdReg').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#cardRoleDivCdReg').setData({
		             data:option_data
				});
			}
			else {
				$('#cardRoleDivCdReg').setData({
		             data:option_data,
		             cardRoleDivCd:paramData.cardRoleDivCd
				});
			}
		}

		//포트ID 생성
    	if(flag == 'portIdReg'){

    		$("#portIdReg").val(response.portId);  // 실제 Insert될때 이 값으로.
            $("#portIdAndIdxNo").val(response.portId); //화면에 보여주기만 하는 값.[20171121]
    		//$("#portIdxNoReg").val(response.portIdxNo);
    	}

    	//카드정보
    	if(flag == 'cardIdReg'){

    		$('#cardIdReg').clear();

			var option_data =  [{cardId: "",cardNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#cardIdReg').setData({
		             data:option_data
				});
			}
			else {
				$('#cardIdReg').setData({
		             data:option_data,
		             cardId:paramData.cardId
				});
			}
    	}

    	if(flag == 'portRuleInf'){

    		portRuleInfData = response;
    	}

    	if(flag == 'rackShlfSlot'){
    		if(response.rackNm != " " || response.shlfNm != " " || response.slotNo != " "){
    			var rackShlfSlot = response.rackNm+"/"+response.shlfNm+"/"+response.slotNo;

    			$('#rackShlfSlotReg').val(rackShlfSlot);
    		}
    	}

    	/*if(flag == 'tmptInf'){
    		var port_descr:String		= '';
			var card_descr:String 		= DataUtil.NVL(response.cardNm);
			var pattern_type:String 	= DataUtil.NVL(response.PATTERN_TYPE);
			var gubun_str:String 		= DataUtil.NVL(item.GUBUN_STR);
			var shelf_descr:String 		= DataUtil.NVL(item.SHELF_DESCR);
			var pattern_str:String 		= DataUtil.NVL(item.PATTERN_STR);
			var pattern_str_c:String	= DataUtil.NVL(pattern_str.substr(0, pattern_str.indexOf('#')));
			var pattern_str_n:String	= DataUtil.NVL(pattern_str.substring(pattern_str.indexOf('#')));
			var port_pattern:String		= makePortPattern(index+1, pattern_str_n);

			port_descr = pattern_type == '0' ? card_descr + gubun_str + pattern_str_c + port_pattern : pattern_str;
    	}*/

    	if(flag == 'wavlVal'){

    		$('#wavlValReg').clear();

			var option_data =  [{wavlVal: "",wavlValNm: "선택"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#wavlValReg').setData({
		             data:option_data
				});
			}
			else {
				$('#wavlValReg').setData({
		             data:option_data,
		             wavlVal:paramData.wavlVal
				});
			}
    	}

    	if(flag == 'portNmCnt'){
    		if(response.portNmCnt.portCnt > 0){
    			httpRequest('tango-transmission-gis-biz/transmission/gis/nm/fdflnst/updatePort?eqpId='+response.portNmCnt.eqpId+"&portCnt="+response.portNmCnt.portCnt+"&insUserId="+response.portNmCnt.lastChgUserId , null, 'GET', 'updatePort');
    		}
    	}

        /* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */
        if(flag == 'eqpPortPveRegIsolYn'){
            if(response.Result == 'Y'){
                $('#btnPortInfCopyRegToPort').setEnabled(false);
            }
        }
        /* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */

        if(flag == 'adamsEqpMdlYn'){
    		if (response.length > 0 ) {			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
    	    	callMsgBox('','I', "ADAMS 수집 모델인 경우는 수정할수 없습니다.", function(msgId, msgRst){
    	    		$a.close();
    	    	 });
    		}
    	}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'EqpReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function portReg() {

		var param =  $("#portRegForm").getData();

		if(param.lgcPortYn == "YES"){
			 param.lgcPortYn = "Y";
		}else{
			 param.lgcPortYn = "N";
		}

		if(param.srsPortYn == "YES"){
			 param.srsPortYn = "Y";
		}else{
			 param.srsPortYn = "N";
		}

		if(param.autoMgmtYn == "YES"){
			 param.autoMgmtYn = "Y";
		}else{
			 param.autoMgmtYn = "N";
		}

		if(param.upLinkPortYn == "YES"){
			 param.upLinkPortYn = "Y";
		}else{
			 param.upLinkPortYn = "N";
		}

		if(param.dplxgPortYn == "YES"){
			 param.dplxgPortYn = "Y";
		}else{
			 param.dplxgPortYn = "N";
		}

		if(param.edgYn == "YES"){
			 param.edgYn = "Y";
		}else{
			 param.edgYn = "N";
		}

		if(param.dumyPortYn == "YES"){
			 param.dumyPortYn = "Y";
		}else{
			 param.dumyPortYn = "N";
		}

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 if(param.portStatCd == "0001"){
			 param.useYn = "Y";
		 }else if(param.portStatCd == "0002"){
			 param.useYn = "N";
		 }else if(param.portStatCd == "0003"){
			 param.useYn = "B";
		 }else if(param.portStatCd == "0004"){
			 param.useYn = "B";
		 }else if(param.portStatCd == "0005"){
			 param.useYn = "S";
		 }

		 if(param.regYn == "Y"){
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/updatePortMgmt', param, 'POST', 'PortReg');
   	 	}else{
   	 		 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/insertPortMgmt', param, 'POST', 'PortReg');
   	 	}
    }

    /* [20171019] */
     function setEnableObjByPortPveReg(enable){
         // 소스상으로는 화면진입시 장비정보가 없으면 rack,shelf,card 등록처럼 장비를 검색할 수있게 되어있지만,
         // 실제로 그런식으로 동작하는 화면이 현재로서는 없는듯 보인다.
         // 혹시 모르니 저장버튼, 포트정보복사 버튼만은 막아두었다.

         $('#btnSavePortReg').setEnabled(enable);
         $('#btnPortInfCopyRegToPort').setEnabled(enable);
     }
     /*_[20171019] */

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
              });
        }

    function popupList2(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7

              });
        }

    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }*/
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