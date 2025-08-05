/**
 * EqpInfPop.js
 * 장비 조회 팝업
 * @author Administrator
 * @date 2017. 11. 02.
 * @version 1.0
 * 
 *  *************** 수정이력***********************
 *  2020-08-04  1. SKB BC-MUX링, CWMA-MUX링 추가건
 *  2021-04-20  2. RM장비조회에서 장비조회를 선택하는 경우 전송실파라메터 설정값 추가
 *  2024-09-11  3. [수정] ADAMS관련 편집불가였던 내용에 대해 원복 - 모든링에 대해 관리주체제한없이 편집가능   
 */
$a.page(function() {
	var gridId = 'dataGrid';
	var paramData = null;
	var fixNeRoleCd = "";
	var mtsoList = [];
	var partnerNeId = "";
	var schBpId = "";
	var wdmYn = ""
	var totalCnt = 0;
	// SKB ADAMS 연동 고도화네
	var mgmtGrpCd = "";
	var svlnLclCd = "";
	var topoSclCd = "";
	var mgmtOnrNm = "";
	
	// 제조사
	var eqpBpCdList = [];
	// 장비모델명
	var eqpMdlCdList = [];
	
    this.init = function(id, param) {
    	paramData = param;
    	
    	// SKB ADAMS 연동 고도화
    	mgmtGrpCd =  nullToEmpty(paramData.mgmtGrpCd);
    	svlnLclCd =  nullToEmpty(paramData.svlnLclCd);
    	topoSclCd=  nullToEmpty(paramData.topoSclCd);
    	mgmtOnrNm=  nullToEmpty(paramData.mgmtOnrNm);
    	
    	setInitParam();
    	initGrid();
        setEventListener();
        $("#neRoleCdPop").multiselect({
        	multiple : false,
        	noneSelectedText : cflineCommMsgArray['all'] /* 전체 */
        });
        // 그리드 멀티 셀렉트
    	if(paramData.multiSelect) {
    		$('#'+gridId).alopexGrid("updateOption", { rowSingleSelect : false});
    		$('#btnPopArea').css('display','block');
    	} else {
    		$('#'+gridId).alopexGrid("updateOption", { rowSingleSelect : true});
    	}
    };
    
    // select 조회조건 코드 세팅
    function setInitParam() {
        schBpId = nullToEmpty(paramData.bpId);
    	// FDF 간편등록 버튼
		if(!paramData.fdfAddVisible){
			$("#addFdfBtn").hide();
		}
		
    	// 고정 장비역할 코드
    	fixNeRoleCd = nullToEmpty(paramData.neRoleCd);
    	// 구간내 장비아이디
    	partnerNeId = nullToEmpty(paramData.partnerNeId);
    	// WDM 트렁크 여부
    	wdmYn = nullToEmpty(paramData.wdmYn);
    	
    	// SKB ADAMS 연동 고도화
    	//TODO 이전으로 20240812
    	if(wdmYn == "" && fixNeRoleCd == "11" && mgmtGrpCd == "0002") {
    		//fixNeRoleCd = "";
    	}
    	
    	// 장비타입용 파라메터
    	var neRoleParm =  {"topoSclCd": topoSclCd, "svlnLclCd": svlnLclCd, "neRoleCd": fixNeRoleCd, "wdmYn" : wdmYn, "partnerNeId" : partnerNeId, "mgmtGrpCd": mgmtGrpCd, "mgmtOnrNm": mgmtOnrNm};
    	// 장비타입(장비역할구분코드)
        httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getNeRoleInfList', neRoleParm, 'GET', 'neRoleInfList');
        
		// 장비모델, 제조사 아래 조회도 적용해야함.
    	//var parm =  {"neRoleCd" : fixNeRoleCd, "partnerNeId" : partnerNeId, "wdmYn" :wdmYn};
		var parm =  {"topoSclCd": topoSclCd, "svlnLclCd": svlnLclCd, "neRoleCd": "", "wdmYn" : wdmYn, "partnerNeId" : partnerNeId, "mgmtGrpCd": mgmtGrpCd, "mgmtOnrNm": mgmtOnrNm};
    	//장비모델
    	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'mdlList');
    	//제조사
		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getbplist', parm, 'GET', 'bpList');
		//장비 건물 코드
		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/selectEqpBldCd', parm, 'GET', 'eqpBldCd');		
		
		// 장비명
    	$('#neNmPop').val(nullToEmpty(paramData.neNm));
    	
    	// 장비 TID명
    	if(paramData.tidNm != null) {
    		$('#eqpTidPop').val(nullToEmpty(paramData.tidNm));	
    	}
    	
    	// 관할국사
    	if(paramData.vTmofInfo != null) {
    		for( i in paramData.vTmofInfo){
    			mtsoList.push(paramData.vTmofInfo[i].mtsoId);
    		}
    	}
    	
    	// 관할국사2 - RM장비조회화면에서 넘어오는 경우 2021-04-20
    	if(paramData.vTmofInfoRm != null && paramData.vTmofInfoRm != undefined) {
    		for( i in paramData.vTmofInfoRm){
    			mtsoList.push(paramData.vTmofInfoRm[i]);
    		}
    	}
    	
    	
    	var mtsoParam = {"topMtsoIdList" : mtsoList};
		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getjrdtmtsolist', mtsoParam, 'POST', 'mtsoList');
    }
    
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	fitTableWidth : true,
        	autoColumnIndex: true,
    		autoResize: true,
    		pager : true,
    		height : 420,
    		numberingColumnFromZero: false,
    		fillUndefinedKey:null,
    		columnMapping: [
	    		  { key : 'orgNmL3', align:'center', title : cflineMsgArray['transmissionOffice']/*전송실*/, width: '105px'}
	    		, { key : 'orgNm', align:'center', title : cflineMsgArray['mobileTelephoneSwitchingOffice'] /*국사*/, width: '160px' }
	    		, { key : 'modelNm', align:'center', title : cflineMsgArray['equipmentModelName'] /*장비모델명*/, width: '110px' }
	    		, { key : 'eqpTid', align:'center', title : cflineMsgArray['equipmentTargetId'] /*장비 TID*/, width: '180px' }
	    		, { key : 'useCnt', align:'right', title : cflineMsgArray['portUse'] /*포트사용*/, width: '100px' }
	    		, { key : 'notUseCnt', align:'right', title : cflineMsgArray['portNotUse'] /*포트미사용*/, width: '100px' }
	    		, { key : 'neNm', align:'center', title : cflineMsgArray['equipmentName'] /*장비명*/, width: '180px' }
	    		, { key : 'neId', align:'center', title : cflineMsgArray['equipmentIdentification'] /*장비ID*/, width: '112px' }
	    		, { key : 'neRoleNm', align:'center', title : cflineMsgArray['korEquipmentType'] /*장비타입:장비역할명*/, width: '65px' }
	    		, { key : 'neRoleCd', align:'center', title : cflineMsgArray['equipmentRoleDivisionCode'] /*장비역할코드*/, width: '65px', hidden: true }
				, { key : 'jrdtTeamOrgNm', align:'center', title : cflineMsgArray['managementTeamName'] /*관리팀명*/, width: '65px' , hidden: true }
				, { key : 'opTeamOrgId', align:'center', title : cflineMsgArray['operationTeamOrganizationIdentification'] /*운용팀조직ID*/, width: '65px' , hidden: true }
				, { key : 'opTeamOrgNm', align:'center', title : cflineMsgArray['operationTeam']+cflineMsgArray['organizationName'] /*운용팀조직명*/, width: '65px' , hidden: true }
				, { key : 'orgIdL3', align:'center', title : cflineMsgArray['transmissionOfficeIdentification'] /*전송실ID*/, width: '65px' , hidden: true }
				, { key : 'orgId', align:'center', title : cflineMsgArray['installMobileTelephoneSwitchingOfficeIdentification'] /*설치국사ID*/, width: '65px' , hidden: true }
				, { key : 'modelLclCd', align:'center', title : cflineMsgArray['equipmentModelLargeClassificationCode'] /*장비모델대분류코드*/, width: '65px' , hidden: true }
				, { key : 'modelLclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['largeClassificationName'] /*장비모델대분류명*/, width: '65px' , hidden: true }
				, { key : 'modelMclCd', align:'center', title : cflineMsgArray['equipmentModelMiddleClassificationCode'] /*장비모델중분류코드*/, width: '65px' , hidden: true }
				, { key : 'modelMclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['middleClassificationName'] /*장비모델중분류명*/, width: '65px' , hidden: true }
				, { key : 'modelSclCd', align:'center', title : cflineMsgArray['equipmentModelSmallClassificationCode'] /*장비모델소분류코드*/, width: '65px' , hidden: true}
				, { key : 'modelSclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['smallClassificationName'] /*장비모델소분류명*/, width: '65px' , hidden: true }
				, { key : 'modelId', align:'center', title : cflineMsgArray['equipmentModelIdentification'] /*장비모델ID*/, width: '65px' , hidden: true }
				, { key : 'vendorId', align:'center', title : cflineMsgArray['vendorIdentification'] /*제조사ID*/, width: '65px' , hidden: true }
				, { key : 'vendorNm', align:'center', title : cflineMsgArray['vendorName'] /*제조사명*/, width: '65px' , hidden: true }
				, { key : 'neStatusCd', align:'center', title : cflineMsgArray['equipmentStatusCode'] /*장비상태코드*/, width: '65px' , hidden: true }
				, { key : 'neStatusNm', align:'center', title : cflineMsgArray['equipmentStatus']+cflineMsgArray['name'] /*장비상태명*/, width: '65px' , hidden: true }
				, { key : 'neDummy', align:'center', title : cflineMsgArray['dummy']+cflineMsgArray['equipment']+cflineMsgArray['yesOrNo'] /*더미장비여부*/, width: '65px', hidden: true}
				, { key : 'bldCd', align:'center', title : '건물아이디', width: '65px' , hidden: true } 
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
			}
        });
    };
    
    // 그리드 데이터 세팅 
    function searchData(division, eqpId){
    	var nFirstRowIndex = 1;
    	var nLastRowIndex = 20;
    	var callBackFlag = division;
    	
    	if(division == "scroll"){
    		nFirstRowIndex = parseInt($("#firstRowIndex").val()) + 20;
    		$("#firstRowIndex").val(nFirstRowIndex);
    		nLastRowIndex = parseInt($("#lastRowIndex").val()) + 20;
    		$("#lastRowIndex").val(nLastRowIndex);
    		
    		/* 2019-12-18 lastRowIndex가 총 카운트보다 큰 경우에는 마지막 총카운트를 넘겨준다  */
        	if(nLastRowIndex > totalCnt) {
        		nLastRowIndex = totalCnt;
        	}
  
    		
    	}else {
    		$("#firstRowIndex").val(nFirstRowIndex);
    		$("#lastRowIndex").val(nLastRowIndex);
    		
    		
    	}
    	
    	searchFormData = $("#searchFormPop").getData();
    	
    	// 장비역할 코드 미선택시 parameter로 넘겨받은 장비역할 코드 set
    	var neRoleCd =  nullToEmpty($("#neRoleCdPop").val());
		neRoleCd = (neRoleCd == "")? fixNeRoleCd : neRoleCd;
		searchFormData.neRoleCd = neRoleCd;
		
		if(division == "addFdfSearch" && nullToEmpty(eqpId) != ""){
			searchFormData = {"eqpId" : eqpId, "firstRowIndex" : 0, "lastRowIndex" : 1};
		}
		
		// GIS FDF 검색 여부
		searchFormData.gisFdfYn = ($('#gisFdfYn').is(':checked'))? "Y":"N";
		
		// 관리그룹, 서비스회선 대분류, 토플로지 소분류 파라미터 추가 
		// ADAMS 연동 고도화. 
		$.extend(searchFormData,{"mgmtGrpCd": mgmtGrpCd, "svlnLclCd": svlnLclCd, "topoSclCd": topoSclCd, "userMgmtCd" : $("#userMgmtCd").val(), "mgmtOnrNm": mgmtOnrNm});
		var dataParam = $.param(searchFormData, true);

        if(nFirstRowIndex < nLastRowIndex) { // 마지막 카운트수가 큰 경우에만 검색하도록 수정
        	if(division == "scroll"){
        		cflineShowProgress(gridId);
        	} else {
        		cflineShowProgressBody();
        	}
        	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getEqpInfList', dataParam, 'GET', callBackFlag);
        }
    }
    
    function setEventListener() {
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	// 대국장비가 FDF인데 선택된 장비가 전송장비일 경우 건물아이디가 다르면 
    	 	// 선택 장비는 대국장비의 국사와 일치하지 않습니다.
    	 	/* 11 : FDF, 162 : QDF, 177 : OFD, 178 : IJP, 182 : PBOX  */
    	 	var eqpRoleDivCd = $("#eqpRoleDivCd").val();
    	 	var eqpBldCd = $("#eqpBldCd").val();
    	 	
    	 	if(eqpRoleDivCd != '') {
    	 		if(eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182") {
    	 			if(	dataObj.neRoleCd != "11" && dataObj.neRoleCd != "162" && dataObj.neRoleCd != "177" && dataObj.neRoleCd != "178" && dataObj.neRoleCd != "182") {
    	 				if( eqpBldCd != dataObj.bldCd) {
//    	 					alertBox('W', "선택 장비는 대국장비의 국사와 일치하지 않습니다.");
    	 					callMsgBox('','C', '선택 장비는 대국장비의 국사와 일치하지 않습니다. 등록하시겠습니까?', function(msgId, msgRst) {
    							if(msgRst == 'Y') {
    								$a.close(dataObj);
    							}
    						});
    	 					
    	 					return;
    	 				}
    	 			}
    	 		}
    	 		
    	 		if(eqpRoleDivCd != "11" && eqpRoleDivCd != "162" && eqpRoleDivCd != "177" && eqpRoleDivCd != "178" && eqpRoleDivCd != "182") {
    	 			if(dataObj.neRoleCd == "11" || dataObj.neRoleCd == "162" || dataObj.neRoleCd == "177" || dataObj.neRoleCd == "178" || dataObj.neRoleCd == "182") {
    	 				if( eqpBldCd != dataObj.bldCd) {
//    	 					alertBox('W', "선택 장비는 대국장비의 국사와 일치하지 않습니다.");
    	 					callMsgBox('','I', '선택 장비는 대국장비의 국사와 일치하지 않습니다. 등록하시겠습니까?', function(msgId, msgRst) {
    							if(msgRst == 'Y') {
    								$a.close(dataObj);
    							}
    						});
    	 					return;
    	 				}
    	 			}
    	 		}
    	 	}
    	 	
    	 	$a.close(dataObj);
    	 });
    	 
    	 // 스크롤
    	 $('#'+gridId).on('scrollBottom', function(e){
    		searchData("scroll", "");
    	 });
    	 
    	 $('#btnClose').on('click', function(e){
    		 $a.close();
         });
    	 
    	 // 조회
		 $('#btnSearchPop').on('click', function(e){
			 searchData("search", "");
			/*if(nullToEmpty($('#topMtsoIdListPop').val()) != "") {
			}
			else
			{
				msgArg = cflineMsgArray['jurisdiction']+cflineMsgArray['mobileTelephoneSwitchingOffice']; 관할국사
				alertBox('W', makeArgMsg('required',msgArg,"","",""));  필수 입력 항목입니다.[{0}] 
				return;
			}*/
    	 });
		 
		 // FDF간편등록
		 $("#addFdfBtn").on('click', function(e){
			var urlPath = $('#ctx').val();
			if(nullToEmpty(urlPath) ==""){
				urlPath = "/tango-transmission-web";
			}

			$a.popup({
			  	popid: 'AddFdfPop',
			  	title: cflineMsgArray['equipmentName'] /*FDF간편등록*/,
			  	url: urlPath+'/configmgmt/equipment/EqpFdfReg.do',
			    iframe: false,
			    modal : true,
			    movable : true,
			    windowpopup : true,
			    width : 500,
			    height : window.innerHeight * 0.75,
			    callback:function(data){
			    	if(data != null && data != ""){
			    		searchData("addFdfSearch", data);
			    	}
			    }	  
			});
		 });
			 
		 
		 // GIS FDF 검색 체크박스 선택
		 $('#gisFdfYn').on('click', function(e){
			 if($('#gisFdfYn').is(':checked')) {
				 $('#neRoleCdPop').setSelected("");
				 $('#neRoleCdPop').setEnabled(false);
			 } else {
				 $('#neRoleCdPop').setEnabled(true);
			 }
		});
		  
		document.onkeypress = function(e){
			if(window.event.keyCode == 13){
				if(document.getElementById('dialogMsg') == null){
					$('#btnSearchPop').click();
					return false;
				}else{
					$('#dialogMsg').close().remove();
				}
			}
		}
		
		//장비타입 선택시 이벤트
    	 $('#neRoleCdPop').on('change', function(e) {
    		//cflineShowProgressBody();
    		 // 제조사 셋팅
    		 setBpIdCombo(); 
    		 // 장비모델 셋팅
    		 setMdlCdCombo();
    		 /*var neRoleCd =  nullToEmpty($("#neRoleCdPop").val());
    		neRoleCd = (neRoleCd == "")? fixNeRoleCd : neRoleCd;    		
    		
    		// ADAMS 연동 고도화. 
    		var parm = {"topoSclCd": topoSclCd, "svlnLclCd": svlnLclCd, "neRoleCd": neRoleCd, "wdmYn" :wdmYn, "mgmtGrpCd": mgmtGrpCd, "userMgmtCd" : $("#userMgmtCd").val(), "mgmtOnrNm": mgmtOnrNm};

    		//var parm = {"neRoleCd": neRoleCd, "wdmYn" :wdmYn};
    		
    	    //제조사 조회
    	    httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getbplist', parm, 'GET', 'changeBpList');
    	    // 장비모델조회
    	    httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'changeMdlList');*/
         });
    	 
    	//제조사 선택시 이벤트
    	 $('#bpId').on('change', function(e) {
     		// 장비모델 콤보 셋팅
     		setMdlCdCombo();
     		
     		/* 
     		cflineShowProgressBody();
     		var bpId = nullToEmpty($("#bpId").val()); 
    		var neRoleCd =  nullToEmpty($("#neRoleCdPop").val());
    		neRoleCd = (neRoleCd == "")? fixNeRoleCd : neRoleCd;
    		
     		var parm =  {"neRoleCd": neRoleCd, "bpId" : bpId, "wdmYn" :wdmYn};
     		
     		// 장비모델조회
     		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'changeMdlList');*/
         });
    	 
    	 
    	//닫기
	 	$('#btnPopClose').on('click', function(e) {
	 		$a.close();
    	});    	
     	 
	 	//저장 
     	$('#btnPopConfirm').on('click', function(e) {
     		var resultData =  $('#'+gridId).alopexGrid("dataGet", { _state : { selected : true }});
     		$a.close(resultData);
     	});
    }
    
    // 제조사 콤보 셋팅
    function setBpIdCombo(schBpId) {
    	var tmpBpIdCombo = [];
    	var neRoleCdPop = $('#neRoleCdPop').val();
    	var allBpYn = false;
    	// SKB ADAMS 연동 고도화
    	//TODO 이전으로 20240911
//    	if (mgmtGrpCd == '0001' || mgmtOnrNm == 'TANGO'  
//    		|| (svlnLclCd =='004' && svlnLclCd !='') 
//    		|| (topoSclCd !='' && (topoSclCd =='030' || topoSclCd =='031' /* || topoSclCd =='040' || topoSclCd =='041'*/))
//    	) {
//    		allBpYn = true;    		
//    	}
//    	else if ((mgmtGrpCd == '' && $("#userMgmtCd").val() == 'SKT' ) 
//    			||  mgmtOnrNm == 'TANGO'  
//    			|| (svlnLclCd =='004' && svlnLclCd !='') 
//    			|| (topoSclCd !='' && (topoSclCd =='030' || topoSclCd =='031' /* || topoSclCd =='040' || topoSclCd =='041'*/))
//    			) {
    		allBpYn = true; 
//    	} 
    	
    	// 장비 타입에 대한 제조사 추출
    	var preBpId = "";
    	for (var i =0 ; i < eqpBpCdList.length; i++) {
    		if (nullToEmpty(eqpBpCdList[i].bpId) == "") {
    			tmpBpIdCombo.push(eqpBpCdList[i]);
    			continue;
    		}
    		
    		// 이전에 추가한 BP_ID와 같은 경우 추가하지 않는다
    		if (preBpId == eqpBpCdList[i].bpId) {
    			continue;
    		}
	    	if (nullToEmpty(neRoleCdPop) == "") {
	    		// ADAMS 기준 장비타입 필터 기준 모든 장비타입 사용가능한 경우
	    		if (allBpYn) {
	    			tmpBpIdCombo.push(eqpBpCdList[i]);
	    			preBpId = eqpBpCdList[i].bpId;
	    		} 
	    		// 특정 장비만 사용가능한 경우('11', '162', '177', '178', '182')
	    		else if (nullToEmpty(eqpBpCdList[i].eqpRoleDivCd) == '11' || nullToEmpty(eqpBpCdList[i].eqpRoleDivCd) == '162' || nullToEmpty(eqpBpCdList[i].eqpRoleDivCd) == '177'
	    			|| nullToEmpty(eqpBpCdList[i].eqpRoleDivCd) == '178' || nullToEmpty(eqpBpCdList[i].eqpRoleDivCd) == '182' ) {
	    			tmpBpIdCombo.push(eqpBpCdList[i]);
	    			preBpId = eqpBpCdList[i].bpId;
	    		}
	    	} else {
	    		if (nullToEmpty(eqpBpCdList[i].eqpRoleDivCd) == neRoleCdPop) {
	    			tmpBpIdCombo.push(eqpBpCdList[i]);
	    			preBpId = eqpBpCdList[i].bpId;
	    		}
	    	}
    	}
    	
    	$('#bpId').setData({data : tmpBpIdCombo});
		if(nullToEmpty(schBpId) != ""){
			$('#bpId').setSelected(schBpId);
		}
    }
    
    // 장비모델 콤보 셋팅
    function setMdlCdCombo() {
    	var tmpMdlCdCombo = [];
    	var neRoleCdPop = $('#neRoleCdPop').val();
    	var bpId = $('#bpId').val();
    	
    	var allBpYn = false;
    	// SKB ADAMS 연동 고도화
    	//TODO 이전으로 20240911
//    	if (mgmtGrpCd == '0001' || mgmtOnrNm == 'TANGO'  
//    		|| (svlnLclCd =='004' && svlnLclCd !='') 
//    		|| (topoSclCd !='' && (topoSclCd =='030' || topoSclCd =='031' /*|| topoSclCd =='040' || topoSclCd =='041'*/))
//    	) {
//    		allBpYn = true;    		
//    	}
//    	else if ((mgmtGrpCd == '' && $("#userMgmtCd").val() == 'SKT' ) 
//    			||  mgmtOnrNm == 'TANGO'  
//    			|| (svlnLclCd =='004' && svlnLclCd !='') 
//    			|| (topoSclCd !='' && (topoSclCd =='030' || topoSclCd =='031' /* || topoSclCd =='040' || topoSclCd =='041'*/))
//    			) {
    		allBpYn = true; 
//    	} 
    	
    	// 장비 타입에 대한 제조사 추출
    	var preEqpMdlId = "";
    	for (var i =0 ; i < eqpMdlCdList.length; i++) {
    		if (nullToEmpty(eqpMdlCdList[i].eqpMdlId) == "") {
    			tmpMdlCdCombo.push(eqpMdlCdList[i]);
    			continue;
    		}
    		// 제조사가 있는 경우
    		if (nullToEmpty(bpId) != "" && eqpMdlCdList[i].bpId != bpId) {
    			continue;
    		}
    		// 이전에 추가한 EQP_MDL_ID와 같은 경우 추가하지 않는다
    		if (preEqpMdlId == eqpMdlCdList[i].eqpMdlId) {
    			continue;
    		}
	    	if (nullToEmpty(neRoleCdPop) == "") {
	    		// ADAMS 기준 장비타입 필터 기준 모든 장비타입 사용가능한 경우
	    		if (allBpYn== true) {
	    			
	    			tmpMdlCdCombo.push(eqpMdlCdList[i]);
	    			preEqpMdlId = eqpMdlCdList[i].eqpMdlId;
	    		} 
	    		// 특정 장비만 사용가능한 경우('11', '162', '177', '178', '182')
	    		else if (nullToEmpty(eqpMdlCdList[i].eqpRoleDivCd) == '11' || nullToEmpty(eqpMdlCdList[i].eqpRoleDivCd) == '162' || nullToEmpty(eqpMdlCdList[i].eqpRoleDivCd) == '177'
	    			|| nullToEmpty(eqpMdlCdList[i].eqpRoleDivCd) == '178' || nullToEmpty(eqpMdlCdList[i].eqpRoleDivCd) == '182' ) {
	    			tmpMdlCdCombo.push(eqpMdlCdList[i]);
	    			preEqpMdlId = eqpMdlCdList[i].eqpMdlId;
	    		}
	    	} else {
	    		if (nullToEmpty(eqpMdlCdList[i].eqpRoleDivCd) == neRoleCdPop) {
	    			tmpMdlCdCombo.push(eqpMdlCdList[i]);
	    			preEqpMdlId = eqpMdlCdList[i].eqpMdlId;
	    		}
	    	}
    	}
    	
    	$('#modelIdPop').setData({data : tmpMdlCdCombo});
    }
    
	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		var data = response.eqpInfList;
    		
    		totalCnt = response.totalCnt;
    		$('#'+gridId).alopexGrid('dataSet', data);
    		$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});
    	} else if(flag == 'scroll'){
    		cflineHideProgress(gridId);
			if(response.eqpInfList != null && response.eqpInfList.length > 0){
	    		$('#'+gridId).alopexGrid("dataAdd", response.eqpInfList);
			}
    	} else if(flag == 'neRoleInfList'){
    		var neRoleData = [];
    		neRoleData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		// SKB ADAMS 연동 고도화 FDF 관리그룹 파라미터 추가
    		var mgmtGrpCd = paramData.mgmtGrpCd;
    		var svlnLclCd = paramData.svlnLclCd;
        	var topoSclCd= paramData.topoSclCd;
        	var mgmtOnrNm= paramData.mgmtOnrNm;
			var skbFdfList = [ { "neRoleCd":"11", "neRoleNm":"FDF", "gisFdfYn":"N" },
			                   { "neRoleCd":"162", "neRoleNm":"QDF", "gisFdfYn":"N" },
			                   { "neRoleCd":"177", "neRoleNm":"OFD", "gisFdfYn":"N" },
			                   { "neRoleCd":"178", "neRoleNm":"IJP", "gisFdfYn":"N" },
			                   { "neRoleCd":"182", "neRoleNm":"PBOX", "gisFdfYn":"N" }];
			
			// ADAMS 연동 고도화 (SKT or TANGO등록 SKB회선 or 가입자망 회선 or (가입자망링 or 휘더망링 or BC-MUX링 or CWDM-MUX링))은 전체 리스트
			//TODO 이전으로 20240911
//	    	if ((mgmtGrpCd != "0002") || (mgmtOnrNm == "TANGO") || (svlnLclCd =="004" || topoSclCd =="030" || topoSclCd =="031" || topoSclCd =="040" || topoSclCd =="041")) {
//	    	if ((mgmtGrpCd != "0002") || (svlnLclCd =="004")) {
	    		for(var i=0; i<response.neRoleInfList.length; i++){
					neRoleData.push({value : response.neRoleInfList[i].neRoleCd, text :response.neRoleInfList[i].neRoleNm});
	    		}
//			} else {			
//				for(var i=0; i< skbFdfList.length; i++){
//					neRoleData.push({value : skbFdfList[i].neRoleCd, text : skbFdfList[i].neRoleNm});
//	    		}
//			}

	    	$('#neRoleCdPop').clear();
    		$('#neRoleCdPop').setData({data : neRoleData});
    		cflineHideProgressBody();
    	} else if(flag == 'mdlList'){
			var modelIdData = [{eqpMdlId: "",eqpMdlNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var eqpMdlList = response.eqpMdlList;
				modelIdData = modelIdData.concat(eqpMdlList);	
			}
			
			$('#modelIdPop').clear();
			eqpMdlCdList = modelIdData;
			setMdlCdCombo();
			//$('#modelIdPop').setData({data : modelIdData});
			//if (eqpBpCdList != null && eqpBpCdList.length > 0) {
				cflineHideProgressBody();
			//}
    	} else if(flag == 'bpList'){
			var bpIdData = [{bpId: "",bpNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var bpList = response.bpList;
				bpIdData = bpIdData.concat(bpList);	
			}
			$('#bpId').clear();
			eqpBpCdList = bpIdData;
			setBpIdCombo(schBpId);
			/*$('#bpId').setData({data : bpIdData});
			if(schBpId != ""){
				$('#bpId').setSelected(schBpId);
			}*/
			//if (eqpMdlCdList != null && eqpMdlCdList.length > 0) {
				cflineHideProgressBody();
			//}
		} else if(flag == 'changeMdlList'){
			var modelIdData = [{eqpMdlId: "",eqpMdlNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var eqpMdlList = response.eqpMdlList;
				modelIdData = modelIdData.concat(eqpMdlList);	
			}
			$('#modelIdPop').clear();
			$('#modelIdPop').setData({data : modelIdData});    	
		} else if(flag == 'changeBpList'){
			var bpIdData = [{bpId: "",bpNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var bpList = response.bpList;
				bpIdData = bpIdData.concat(bpList);	
			}
			$('#bpId').clear();
			$('#bpId').setData({data : bpIdData});
		} else if(flag == 'mtsoList'){
	    	$('#topMtsoIdListPop').setData({ data:response.mtsoList, topMtsoIdList:mtsoList });
	    	//console.log("topMtsoIdListPop");
	    	/*if ( $('#neNmPop').val().length > 0) {
	    		searchData("search", ""); // 그리드 데이터 세팅
	    	}*/
		} else if(flag == 'addFdfSearch'){
			var data = response.eqpInfList;
    		$('#'+gridId).alopexGrid('dataSet', data);
    		$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});
			cflineHideProgressBody();
			var dataObj = $('#'+gridId).alopexGrid('dataGet');
    	 	$a.close(dataObj[0]);
		} else if(flag == 'eqpBldCd') {
			if(response != null) {
				if(response.eqpBldCd.length > 0) {
					$("#eqpBldCd").val(response.eqpBldCd[0].bldCd);
					$("#eqpRoleDivCd").val(response.eqpBldCd[0].eqpRoleDivCd);
				}
			}
		}
    }
	
	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
		//조회 실패 하였습니다.
	    callMsgBox('','W', cflineMsgArray['searchFail'] , function(msgId, msgRst){});
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