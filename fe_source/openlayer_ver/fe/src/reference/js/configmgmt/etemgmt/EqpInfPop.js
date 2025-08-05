/**
 * EqpInfPop.js
 *
 * @author Administrator
 * @date 2016. 12. 02. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var gridId = 'dataGrid';
	var paramData = null;
	var fixNeRoleCd = "";
	var mtsoList = [];
	
    this.init = function(id, param) {
    	paramData = param;
    	setInitParam();
    	initGrid();
        setEventListener();
//        $("#neRoleCdPop").multiselect({
//        	multiple : false,
//        	noneSelectedText : cflineCommMsgArray['all'] /* 전체 */
//        });
    };
    
    // select 조회조건 코드 세팅
    function setInitParam() {
    	// FDF 간편등록 버튼
		if(!paramData.fdfAddVisible){
			$("#addFdfBtn").hide();
		}
		
    	// 고정 장비역할 코드
    	fixNeRoleCd = nullToEmpty(paramData.neRoleCd);
    	
    	var parm = {"neRoleCd" : fixNeRoleCd };
    	// 장비타입(장비역할구분코드)
        httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getNeRoleInfList', parm, 'GET', 'neRoleInfList');
//    	//장비모델
//    	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'mdlList');
//    	//제조사
//		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getbplist', parm, 'GET', 'bpList');
		
		// 장비명
    	$('#neNmPop').val(nullToEmpty(paramData.neNm));
    	
    	// 관할국사
    	if(paramData.vTmofInfo != null) {
    		for( i in paramData.vTmofInfo){
    			mtsoList.push(paramData.vTmofInfo[i].mtsoId);
    		}
    	}
    	
    	//var mtsoParam = {"topMtsoIdList" : mtsoList};
		//httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getjrdtmtsolist', mtsoParam, 'POST', 'mtsoList');
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
	    		, { key : 'eqpTid', align:'center', title : cflineMsgArray['equipmentFdfTid'] /*FDF TID*/, width: '180px' }
	    		, { key : 'useCnt', align:'right', title : cflineMsgArray['portUse'] /*포트사용*/, width: '100px' }
	    		, { key : 'notUseCnt', align:'right', title : cflineMsgArray['portNotUse'] /*포트미사용*/, width: '100px' }
	    		, { key : 'eqpNm', align:'center', title : cflineMsgArray['equipmentName'] /*장비명*/, width: '180px' }
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
				, { key : 'neDummy', align:'center', title : cflineMsgArray['dummy']+cflineMsgArray['equipment']+cflineMsgArray['yesOrNo'] /*더미장비여부*/, width: '65px' , hidden: true }
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
    		
    		cflineShowProgress(gridId);
    	}else {
    		$("#firstRowIndex").val(nFirstRowIndex);
    		$("#lastRowIndex").val(nLastRowIndex);
    		
    		cflineShowProgressBody();
    	}
    	
    	searchFormData = $("#searchFormPop").getData();
    	
    	// 장비역할 코드 미선택시 parameter로 넘겨받은 장비역할 코드 set
    	var neRoleCd =  nullToEmpty($("#neRoleCd").val());
		neRoleCd = (neRoleCd == "")? fixNeRoleCd : neRoleCd;
		searchFormData.neRoleCd = neRoleCd;
		
		if(division == "addFdfSearch" && nullToEmpty(eqpId) != ""){
			searchFormData = {"eqpId" : eqpId, "firstRowIndex" : 0, "lastRowIndex" : 1};
		}
		
		// GIS FDF 검색 여부
		searchFormData.gisFdfYn = ($('#gisFdfYn').is(':checked'))? "Y":"N";
		
		var dataParam = $.param(searchFormData, true);
    	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getEqpInfEteList', dataParam, 'GET', callBackFlag);
    }
    
    function setEventListener() {
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
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
				 $('#neRoleCd').setSelected("");
				 //$('#neRoleCdPop').setEnabled(false);
			 } else {
				 $('#neRoleCd').setSelected("11");
				 //$('#neRoleCdPop').setEnabled(true);
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
//    	 $('#neRoleCdPop').on('change', function(e) {
//    		cflineShowProgressBody();
//    		var neRoleCd =  nullToEmpty($("#neRoleCdPop").val());
//    		neRoleCd = (neRoleCd == "")? fixNeRoleCd : neRoleCd;
//    		var parm = {"neRoleCd": neRoleCd };
//    		
//    	    //제조사 조회
//    	    httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getbplist', parm, 'GET', 'changeBpList');
//    	    // 장비모델조회
//    	    httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'changeMdlList');
//         });
    	 
    	//제조사 선택시 이벤트
    	 $('#bpId').on('change', function(e) {
    		cflineShowProgressBody();
    		var bpId = nullToEmpty($("#bpId").val()); 
    		var neRoleCd =  nullToEmpty($("#neRoleCd").val());
    		neRoleCd = (neRoleCd == "")? fixNeRoleCd : neRoleCd;
     		var parm = {"neRoleCd" : neRoleCd, "bpId" : bpId};
     		
     		// 장비모델조회
     		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'changeMdlList');
         });
    }
    
	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		var data = response.eqpInfList;
    		
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
			for(var i=0; i<response.neRoleInfList.length; i++){
				neRoleData.push({value : response.neRoleInfList[i].neRoleCd, text :response.neRoleInfList[i].neRoleNm});
    		}
    		$('#neRoleCd').clear();
    		$('#neRoleCd').setData({data : neRoleData});    	
    		
    		$('#neRoleCd').setSelected("11");
    		
    		var neRoleCd =  nullToEmpty($("#neRoleCd").val());
    		neRoleCd = (neRoleCd == "")? fixNeRoleCd : neRoleCd;
     		var parm = {"neRoleCd" : neRoleCd};
     		
    		//장비모델
        	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'mdlList');
        	//제조사
    		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getbplist', parm, 'GET', 'bpList');
    	} else if(flag == 'mdlList'){
			var modelIdData = [{eqpMdlId: "",eqpMdlNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var eqpMdlList = response.eqpMdlList;
				modelIdData = modelIdData.concat(eqpMdlList);	
			}
			
			$('#modelIdPop').clear();
			$('#modelIdPop').setData({data : modelIdData});
    	} else if(flag == 'bpList'){
			var bpIdData = [{bpId: "",bpNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var bpList = response.bpList;
				bpIdData = bpIdData.concat(bpList);	
			}
			$('#bpId').clear();
			$('#bpId').setData({data : bpIdData});
		} else if(flag == 'changeMdlList'){
			var modelIdData = [{eqpMdlId: "",eqpMdlNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var eqpMdlList = response.eqpMdlList;
				modelIdData = modelIdData.concat(eqpMdlList);	
			}
			
			$('#modelIdPop').clear();
			$('#modelIdPop').setData({data : modelIdData});

			cflineHideProgressBody();
    	
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
	    	if ( $('#neNmPop').val().length > 0) {
	    		searchData("search", ""); // 그리드 데이터 세팅
	    	}
		} else if(flag == 'addFdfSearch'){
			var data = response.eqpInfList;
    		$('#'+gridId).alopexGrid('dataSet', data);
    		$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});
			cflineHideProgressBody();
			var dataObj = $('#'+gridId).alopexGrid('dataGet');
    	 	$a.close(dataObj[0]);
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