/**
 * RmPathLineListPop.
 *
 * @author Administrator
 * @date 2021. 04. 19. 
 * @version 1.0
 * 
 *  *************** 수정이력***********************
 *  
 */
$a.page(function() {
	var gridId = 'dataGrid';
	var paramData = null;
	var mtsoList = [];
	var totalCnt = 0;
	// SKB ADAMS 연동 고도화
	var mgmtGrpCd = "";
	var svlnLclCd = "";
	var mgmtOnrNm = "";
	// 장비모델명
	var eqpMdlCdList = [];
	
	var pageForCount = 200;
	var eqpNm = "";
	var eqpId = "";
	
    this.init = function(id, param) {
    	paramData = param;
    	
    	mgmtGrpCd =  nullToEmpty(paramData.mgmtGrpCd);
    	svlnLclCd =  nullToEmpty(paramData.svlnLclCd);
    	mgmtOnrNm =  nullToEmpty(paramData.mgmtOnrNm);
    	mtsoList  = nullToEmpty(paramData.mtsoList);
    	
        createMgmtGrpSelectBox ("mgmtGrpCd", "A", param.mgmtGrpNm);  // 관리 그룹 selectBox
    	setSelectCode();
    	
    	initGrid();
        setEventListener();


    	$('#tmofCd').setData({tmofCd:mtsoList});
    };
    
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getMgmtBonbuTeam', null, 'GET', 'getMgmtBonbuTeam');	// 관리 본부/팀 데이터

    	//장비모델
    	var parm =  {"topoSclCd": "", "svlnLclCd": svlnLclCd, "neRoleCd": "", "wdmYn" : "", "partnerNeId" : "", "mgmtGrpCd": "0001", "mgmtOnrNm": mgmtOnrNm};
    	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', parm, 'GET', 'mdlList');
    	// 사용자 소속 전송실
    	searchUserJrdtTmofInfo("tmofCd");

    }

    
    function searchData(division){
    	
    	var callBackFlag = division;
    	
    	if(callBackFlag == "searchEqp"){			
    		var rmEqpNm = $("#rmEqpNm").val();	
    		
			var paramData = {"neNm" : rmEqpNm, "firstRowIndex" : firstRowIndex, "lastRowIndex":lastRowIndex, "vTmofInfo" : mtsoList, "fdfAddVisible" : true, "partnerNeId" : null, "multiSelect" : true};		    		       		       		    	
    		var dataParam = $.param(paramData, true);
	    	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getEqpInfList', dataParam, 'GET', callBackFlag);
    	}else{  
			
    		var tmofCd = $("#tmofCd").val();
    		var mtsoNm = $("#mtsoNm").val();
    		var rmEqpNm = $("#rmEqpNm").val();
    		var modelId = $("#modelIdPop").val();
    		
    		//국사, 장비모델명, RM장비명이 입력되지 않은 경우 최소 전송실은 필수임
    		if(nullToEmpty(mtsoNm) == "" && nullToEmpty(rmEqpNm) == "" && nullToEmpty(modelId) == ""){
    			if(nullToEmpty(tmofCd) == ""){
        			alertBox('W', makeArgMsg('required',cflineMsgArray['transmissionOffice'],"","","")); /*" 전송실은 필수 입력 항목입니다.;*/
         			return false;
         		}
    		}
    		
	    	cflineShowProgressBody();
	    	
			$("#firstRowIndex").val(1);
	     	$("#lastRowIndex").val(pageForCount); // 페이징개수
	     	$("#eqpNm").val($("#rmEqpNm").val());
	     	
	    	var param =  $("#searchForm").serialize();
	    	    	
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/selectRmEqpList', param, 'GET', 'search');    		
    	}
    }
    
    // 장비모델 콤보 셋팅
    function setMdlCdCombo() {
    	var tmpMdlCdCombo = [];
    	
    	for (var i =0 ; i < eqpMdlCdList.length; i++) {
    		if (nullToEmpty(eqpMdlCdList[i].eqpMdlId) == "") {
    			tmpMdlCdCombo.push(eqpMdlCdList[i]);
    			continue;
    		}
    		
    		tmpMdlCdCombo.push(eqpMdlCdList[i]);
    	}
    	
    	$('#modelIdPop').setData({data : tmpMdlCdCombo});
    }
    
 
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	fitTableWidth : true,
        	autoColumnIndex: true,
    		autoResize: true,
    		pager : true,
    		height : 500,
    		numberingColumnFromZero: false,
    		fillUndefinedKey:null,
    		columnMapping: [
	    		   { key : 'eqpNm', align:'center', title : cflineMsgArray['equipmentName']/*장비명*/, width: '105px'}
	    		  ,{ key : 'eqpId', align:'center', hidden:true}
	    		  ,{ key : 'mgmtGrpNm', align:'center', title : cflineMsgArray['managementGroup']/*관리그룹*/, width: '80px'}
	    		  ,{ key : 'tmofNm', align:'center', title : cflineMsgArray['transmissionOffice']/*전송실*/, width: '100px'}
	    		  ,{ key : 'eqpInstlMtsoNm', align:'center', title : cflineMsgArray['mobileTelephoneSwitchingOffice']/*국사*/, width: '100px'}
	    		  ,{ key : 'uprMtsoNm', align:'center', title : cflineMsgArray['smallMtso']/*국소*/, width: '100px'}
	    		  ,{ key : 'vendorNm', align:'center', title : cflineMsgArray['vend']/*제조사*/, width: '80px'}
	    		  ,{ key : 'eqpMdlNm', align:'center', title : cflineMsgArray['equipmentModelName']/*모델명*/, width: '100px'}
	    		  ,{ key : 'lnkgYn', align:'center', title : cflineMsgArray['linkageYesOrNo']/*연동여부*/, width: '80px'}
	    		  ,{ key : 'ip', align:'center', title : cflineMsgArray['internetProtocol']/*IP*/, width: '100px'}
	    		  ,{ key : 'version', align:'center', title : cflineMsgArray['version']/*버전*/, width: '80px'}
	    		  ,{ key : 'eqpTid', align:'center', title : cflineMsgArray['equipmentTargetId']/*TID*/, width: '110px'}
	    		  ,{ key : 'capaNm', align:'center', title : cflineMsgArray['capacity']/*용량*/, width: '80px'}
	    		  ,{ key : 'eqpRmk', align:'center', title : "기타정보", width: '180px'}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
			}
        });
    };
    
        
    function setEventListener() {
    	//국사찾기
		$('#btnMtsoSch').on('click', function(e) {
			var paramValue = "";
			
			paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text()
					,"orgId": $('#hdofcCd').val()
					,"teamId": $('#teamCd').val()
					,"mtsoNm": $('#mtsoNm').val()
					, "regYn" : "Y", "mtsoStatCd" : "01"}
			openMtsoDataPop("mtsoCd", "mtsoNm", paramValue);
		}); 
     	   	 
    	 // 스크롤
    	 $('#'+gridId).on('scrollBottom', function(e){
    	        	    	     	
        	/* 전체 카운트수가 기본카운트수 200 이 넘을때만 재검색 20191113 */
        	if(totalCnt > 200) {
	    		var nFirstRowIndex =parseInt($("#firstRowIndex").val()) + pageForCount; // 페이징개수
	    		var nLastRowIndex =parseInt($("#lastRowIndex").val()) + pageForCount; // 페이징개수
	
	    		/* 2019-11-06 lastRowIndex가 총 카운트보다 큰 경우에는 마지막 총카운트를 넘겨준다 */
	        	if(nLastRowIndex > totalCnt) {
	        		nLastRowIndex = totalCnt;
	        	}
	    		
	            if(nFirstRowIndex < nLastRowIndex) { // 마지막 카운트수가 큰 경우에만 검색하도록 수정
		    		$("#firstRowIndex").val(nFirstRowIndex);
		    		$("#lastRowIndex").val(nLastRowIndex);  
			     	//$("#eqpId").val($("#rmEqpId").val());

		    		var param =  $("#searchForm").serialize();
		    		cflineShowProgress(gridId);
		    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/selectRmEqpList', param, 'GET', 'scroll');
	            }
        	}
    		 
    	 });
    	 
    	 $('#btnClose').on('click', function(e){
    		 $a.close();
         });
    	 
    	 // 조회
		 $('#btnSearchPop').on('click', function(e){
			 searchData("search", "");
    	 });
		 
		// 관리그룹 클릭시
	    $('#mgmtGrpCd').on('change',function(e){
	    	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
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
 	 
    	//닫기
	 	$('#btnPopClose').on('click', function(e) {
	 		$a.close();
    	});
	 	
	 	//경유링 상세 목록 조회팝업(선번)
	    $('#'+gridId).on('click', '.bodycell', function(e){

			var dataObj = AlopexGrid.parseEvent(e).data;
		 	var dataKey = dataObj._key; 
		 	eqpId = dataObj.eqpId;
		 	eqpNm = dataObj.eqpNm;
		 	
	    });
	    
	 	//엑셀다운로드
	    $('#btnExportExcel').on('click', function(e) {
	    	//TODO
			//엑셀다운로드시 RM장비는 필수임
	    	if((eqpId != null && eqpId != "")) {
	    		funExcelBatchExecute(eqpId);
	    	} else {
	    		alertBox('W', "RM선번 EXCEL다운로드시 그리드에서 장비를 선택해주세요."); /*" RM선번 EXCEL다운로드시 그리드에서 장비를 선택해주세요 */
     			return false;
	    	}
	    });
	    
	    // 관리그룹 클릭시
     	$('#mgmtGrpCd').on('change',function(e){
     		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
       	});  
     	
	    // 본부 선택시
    	$('#hdofcCd').on('change',function(e){
    		changeHdofc("hdofcCd", "teamCd", "tmofCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "tmofCd", "mtso");
      	});      	 
  		// 전송실 선택시
    	$('#tmofCd').on('change',function(e){
    		changeTmof("tmofCd", "mtso");
      	});
    }
	
    /**
	 * RM 장비명 찾기
	 */   
   	$('#btnEqpPopSch').on('click', function(e) {
   		
   		var tmofCd = $("#tmofCd").val();
		var rmEqpNm = $("#rmEqpNm").val();
		
		//RM장비조회시 전송실은 필수임
//		if(nullToEmpty(tmofCd) == ""){
//			alertBox('W', makeArgMsg('required',cflineMsgArray['transmissionOffice'],"","","")); /*" 전송실은 필수 입력 항목입니다.;*/
// 			return false;
// 		}
//		
//		if(nullToEmpty(rmEqpNm) == ""){
//			$("#rmEqpId").val('');
//		}
		
   		//openNeListPop(rmEqpNm);   		
    });
   	
   	/**
   	 * 장비 검색 팝업
   	 */
   	function openNeListPop(rmEqpNm) {
   		var pTopMtsoIdList = [];												   		
   		var  topMtsoIdList = [];
   		var paramData = new Object();

   		
		mtsoList = $("#tmofCd").val();
		
   		paramData = {"neNm": nullToEmpty(rmEqpNm), "vTmofInfoRm":mtsoList, "fdfAddVisible":true, "Type":"Rm", "mgmtGrpCd":"0001", "mgmtOnrNm":"TANGO"};
		
   		$a.popup({
   		  	popid: "popEqpListSch",
   		  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
   		  	url: getUrlPath() + '/configmgmt/cfline/EqpInfPop.do',
   		  	data: paramData,
   			modal: true,
   			movable:true,
   			width : 1200,
   			height : 810,
   			callback:function(data){
   				//console.log(data);   
   				
   				if(data != null){   	
   					$('#rmEqpId').val(data.neId);
   					$('#rmEqpNm').val(data.neNm);   			
   					$("#rmEqpNm").attr('style', 'background-color:#e2e2e2');
   				}else{   					
   					$('#rmEqpId').val("");
   					$("#rmEqpNm").attr('style', 'background-color:#ffffff');
   				}
   			}
   		});
   	};
    // 엑셀배치실행
    function funExcelBatchExecute(eqpId){
    	if(eqpNm == "") {
    		eqpNm = nullToEmpty($("#rmEqpNm").val());
    	} 
    	
     	var param = {
     			  "eqpId": eqpId
     			, "portId": ""
     			, "rmPortChnlVal": ""
     			, "rmEqpNm": eqpNm
     			}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/excelBatchExecute', param, 'POST', 'excelBatchExecute'); 
     	
    }
    
	function successCallback(response, status, jqxhr, flag){
				
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		var data = response.rmList;
    		
    		totalCnt = response.rmTotalCnt;
    		$('#'+gridId).alopexGrid('dataSet', data);
    		$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.rmTotalCnt);}}});
   		
    		if(totalCnt > 0) {
    			$('#btnExportExcel').show();
    		}	
    		eqpId = "";
    	} else if(flag == 'scroll'){
    		cflineHideProgress(gridId);
			if(response.rmList != null && response.rmList.length > 0){
	    		$('#'+gridId).alopexGrid("dataAdd", response.rmList);
			}
    	} else if(flag == 'mdlList'){
			var modelIdData = [{eqpMdlId: "",eqpMdlNm: cflineCommMsgArray['all']/*전체*/}];
			
			if(response != null){
				var eqpMdlList = response.eqpMdlList;
				modelIdData = modelIdData.concat(eqpMdlList);	
			}
			
			$('#modelIdPop').clear();
			eqpMdlCdList = modelIdData;
			setMdlCdCombo();
			cflineHideProgressBody();
			
    	} else if(flag == "searchEqp"){
    		var totalCnt = response.totalCnt;
    		if(totalCnt == 1){    			
    			$("#rmEqpNm").val(response.eqpInfList[0].neNm); 
    			$("#rmEqpId").val(response.eqpInfList[0].neId);
    			$("#rmEqpNm").attr('style', 'background-color:#e2e2e2');
    		}else{
    			var rmEqpNm  = $("#rmEqpNm").val();    			
    			$("#rmEqpId").val("");
    			$("#rmEqpNm").attr('style', 'background-color:#ffffff');
    		}
    		cflineHideProgressBody();
    	} else if(flag == 'excelBatchExecute') {
			if(response.returnCode == '200'){ 
				jobInstanceId  = response.resultData.jobInstanceId;
				cflineHideProgressBody();
				excelCreatePop(jobInstanceId);
			}else if(response.returnCode == '500'){ 
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
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
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300,
                callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		//$('#btnSearch').click();
                  	}
               	}
            });
       	 
       	eqpId = "";
    }
    
    function getUrlPath() {
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) == ""){
    		urlPath = "/tango-transmission-web";
    	}
    	return urlPath;
    }; 
});