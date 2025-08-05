/**
 * UseServiceLineSearchPop.js
 *
 * @date 2018.09.11 
 * 
 * 2019-10-24  1. 기간망 링 선번 고도화
 */
var mainGridId = 'mainGrid';
var lnoGridId = 'lnoGrid';
var addData = false;
var serviceId = '';
var mtsoList = [];

var svlnSclCdData = [];  // 서비스회선소분류코드 데이터
//var svlnLclSclCodeData = [];  // 서비스회선 대분류 소분류코드
var useLineSvlnSclCd = []; // 사용서비스회선에서만 사용하는 소분류만 보관

var tmofCd = "";
var pathDataInfo = null;
// 선택한 서비스회선 번호
var networkInfo = ['NETWORK_ID', 'NETWORK_NM', 'LINE_STATUS_CD', 'LINE_STATUS_NM', 'PATH_DIRECTION', 'PATH_SAME_NO', 'PATH_SEQ', 'LINE_LARGE_CD', 'LINE_LARGE_NM', 'LINE_SMALL_CD', 'LINE_SMALL_NM'];
$a.page(function() {
	
	this.init = function(id, param) {
		serviceId = nullToEmpty(param.serviceId);
		pathDataInfo = [];
		// 회선명 클릭시 서비스회선이 꽂혀있을 경우
		if(serviceId != "") {
			$('#' + mainGridId).hide();
			$('#info').hide();
			$('#btnSearch').hide();
			$('#btnConfirmPop').hide();
			$('#popTitle').text("서비스회선 선번");
			$('#popSubTitle').text("선번");
			
			// 선번그리드의 높이를 수정			
			var paramData = { 
										"ntwkLineNo": serviceId
										, "svlnLclCd" : param.svlnLclCd
										, "svlnSclCd" : param.svlnSclCd
										, "mgmtGrpCd" : param.mgmtGrpCd
									}
			
			fnSearch("lno", true, paramData);
		} else {
			$('#info').show();
			$('#btnSearch').show();
			$('#btnConfirmPop').show();
			$('#popTitle').text("서비스회선조회팝업");
			$('#popSubTitle').text("서비스회선조회");
			$('#editSvlnNo').val(nullToEmpty(param.editSvlnNo));
			
			var tmofParamData = [];
    		var mtsoIdList = [];
    		
    		if(nullToEmpty(param.vTmofInfo) != "") {
    			var mtsoId = "";
    			var mtsoNm = "";
    			var index = 0;
    			for(i=0; i<param.vTmofInfo.length ;i++) {
    				if (param.vTmofInfo[i].jrdtMtsoTypCd == "01") {
	    				mtsoId = param.vTmofInfo[i].mtsoId;
	    				mtsoNm = param.vTmofInfo[i].text
	    				if(nullToEmpty(mtsoNm) != ""){
	    					tmofParamData.push({value:mtsoId, text:mtsoNm});
	    					mtsoIdList[index] = mtsoId;
	    					index++;
	    				}
    				}
    			}
    			tmofCd = mtsoIdList.join(',');
    		}
    		
        	$('#tmofCd').setData({
        		data:tmofParamData,
        		tmofCd:mtsoIdList
        	});
        	
        	// 서비스회선명이 있는경우 셋팅
        	if (nullToEmpty(param.srchSvlnNm) != "") {
        		$('#svlnNm').val(param.srchSvlnNm);
        	}
			
		}
		
		addData = false;
    	setSelectCode();
    	setEventListener();
    	// 선택버튼비활성화
    	$('#btnConfirmPop').setEnabled(false);
    	// 서비스회선 비활성화
    	//$('#svlnSclCd').attr("disabled", true);  
    };
});

function setSelectCode() {
	//나중에 mgmtGrpCd 받아오면서 수정 setSearch2Code("hdofcCd", "teamCd", "tmofCd", "A");
	//setSearchCode2("0001","hdofcCd", "teamCd", "tmofCd");
	httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
	
	// 사용자 소속 전송실
	//searchUserJrdtTmofInfo("tmofCd");
}

function setEventListener() {
 	// 엔터 이벤트 
 	$('#svlnSearchForm').on('keydown', function(e){
 		if (e.which == 13){
 			addData = false;
 			fnSearch("main", true,"");
 	    	$('#btnConfirmPop').setEnabled(true);
		}
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
		//changeTmof("tmofCd", "mtso");
  	});
	
	$('#svlnLclCd').on('change', function(e){

		var svlnSclCd_option_data =  [];
		for (var i = 0 ; i < useLineSvlnSclCd.length; i++) {
			if (nullToEmpty(useLineSvlnSclCd[i].uprComCd) == $(this).val()) {
				if (useLineSvlnSclCd[i].comCd == "101" || useLineSvlnSclCd[i].comCd == "061") {
					svlnSclCd_option_data.push(useLineSvlnSclCd[i]);
				}
			}
		}
		
		$('#svlnSclCd').clear();
		$('#svlnSclCd').setData({data : svlnSclCd_option_data});	
  	});       
 	
 	//조회버튼 클릭시
    $('#btnSearch').on('click', function(e) {
    	fnSearch("main", true,"");
    	$('#btnConfirmPop').setEnabled(true);
    });
    
    //국사찾기
	$('#btnMtsoSch').on('click', function(e) {
		var paramValue = "";
		
		paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text(),"orgId": $('#hdofcCd').val()
				,"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val()
				, "regYn" : "Y", "mtsoStatCd" : "01"}
		openMtsoDataPop("mtsoCd", "mtsoNm", paramValue);
	}); 

    //서비스회선조회팝업 스크롤 이동시
   	$('#'+mainGridId).on('scrollBottom', function(e){
   		addData = true;
   		fnSearch("main", false,"");
 	});
   	
   	
 /*// 회선 정보 그리드 더블클릭
    $('#'+gridId).on('dblclick', '.bodycell', function(e){
       	var dataObj = AlopexGrid.parseEvent(e).data;
	 	var dataKey = dataObj._key; 
	 	showServiceLineEditPop( gridId, dataObj ,"Y");
	 	
	 	
	 	var paramData = {
				"gridId" : gridId
				, "ntwkLineNo" : dataObj.svlnNo
				, "svlnLclCd" : dataObj.svlnLclCd
				, "svlnSclCd" : dataObj.svlnSclCd
				, "sFlag" : sFlag
				, "ntwkLnoGrpSrno" : lineLnoGrpSrno
				, "mgmtGrpCd" : dataObj.mgmtGrpCd 
				, "rnmEqpId" : tmpRmEqpId 
				, "rnmEqpIdNm" : tmpRmEqpIdNm 
				, "rnmPortId" : tmpPortId 
				, "rnmPortIdNm" : tmpPortIdNm 
				, "rnmPortChnlVal" : tmpPortChnlVal 
			};
    });*/
    
    
    //서비스회선 상세 목록 조회팝업(선번)
    $('#'+mainGridId).on('click', '.bodycell', function(e){
    	var dataObj = AlopexGrid.parseEvent(e).data;
	 	var dataKey = dataObj._key; 
	 	var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
	 	
		if (lineLnoGrpSrno == undefined){
			lineLnoGrpSrno = null;
		}
		
    	var param = {
    						"gridId" : lnoGridId
    						, "ntwkLineNo": dataObj.svlnNo
    						, "svlnLclCd" : dataObj.svlnLclCd
    						, "svlnSclCd" : dataObj.svlnSclCd
    						, "mgmtGrpCd" : dataObj.mgmtGrpCd
    						, "ntwkLnoGrpSrno" : lineLnoGrpSrno
    						};
    	fnSearch("lno", true, param);
    });
 	
	// 닫기
	$('#btnClosePop').on('click', function(e) {
		$a.close();
    });
	
	// 선택 
	$('#btnConfirmPop').on('click', function(e) {
		
		/* 2019-10-24  1. 기간망 링 선번 고도화
		 * 서비스 회선의 선번이 조회된 후 선번 상세 그리드에 dataSet처리하면 기존 데이터가 그리드에 맞게 편집되어 해당 데이터를 그대로 다시 서비스회선 선번에 적용하면 해당 데이터가 정상적으로 처리되지 않는 버그가 있어
		 * 서비스회선의 선번을 조회한 후 해당 데이터를 복제한 데이터를 넘기는 것으로 수정함
		 */
		//var dataList =  $('#'+lnoGridId).alopexGrid("dataGet"); 
		var dataList = pathDataInfo;
		var mainDataList =  $('#'+mainGridId).alopexGrid("dataGet");
		
		if (mainDataList.length == 0) {
			alertBox('W', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
			return;
		}
		//debugger;
		if(dataList != null && dataList != "" && dataList.length >= 1  ){
			
			// 서비스회선정보 구선번편집 화면에서 사용가능하도록 수정
			var division = "";
	   		var pathDirection = 'RIGHT';
	   		var useServicePathInfo = [];
			for(var i = 0; i < dataList.length; i++) {
				dataList[i].SERVICE_ID = networkInfo[0];
				
	   			dataList[i].SERVICE_NM = networkInfo[1];
	   			dataList[i].SERVICE_STATUS_CD = networkInfo[2];
	   			dataList[i].SERVICE_STATUS_NM = networkInfo[3];
	   			
	   			dataList[i].SERVICE_PATH_DIRECTION = pathDirection;
	   			
	   			dataList[i].SERVICE_PATH_SAME_NO = networkInfo[5];
	   			dataList[i].SERVICE_PATH_SEQ = networkInfo[6];
	   			dataList[i].SERVICE_LINE_LARGE_CD = networkInfo[7];
	   			dataList[i].SERVICE_LINE_LARGE_NM = networkInfo[8];
	   			dataList[i].SERVICE_LINE_SMALL_CD = networkInfo[9];
	   			dataList[i].SERVICE_LINE_SMALL_NM = networkInfo[10];

	   			
	   			/*dataList[i].SERVICE_MERGE = null;
	   			dataList[i].TRUNK_MERGE = null;
	   			dataList[i].RING_MERGE = null;
	   			dataList[i].WDM_TRUNK_MERGE = null;*/
	   			/*
	   			if(dataList[i].TRUNK_ID == null) {
//	   				dataList[i].RING_ID = links[i]._index.grid;
	   				dataList[i].TRUNK_ID = AlopexGrid.generateKey();
	   			}
	   			
	   			if (dataList[i].WDM_TRUNK_ID != null && dataList[i].WDM_TRUNK_ID.indexOf('alopex') == 0) {
	   				dataList[i].WDM_TRUNK_ID = null;
	   			}  		
	   			if (dataList[i].WDM_MERGE != null && dataList[i].WDM_MERGE.indexOf('alopex') == 0) {
	   				dataList[i].WDM_MERGE = null;
	   			}
	   			
	   			if(dataList[i].WDM_TRUNK_ID == null) {
	   				dataList[i].WDM_TRUNK_ID = AlopexGrid.generateKey();
	   			}
	   			
	   			//if (dataList[i].RING_ID != null && dataList[i].RING_ID.indexOf('alopex') == 0) {
	   			if (nullToEmpty(dataList[i].RING_ID) == "" ) {
	   				dataList[i].RING_ID =  AlopexGrid.generateKey();
	   				//dataList[i].RING_ID = null;
	   			}

	   			if (nullToEmpty(dataList[i].RING_ID_L1) == "") {
	   				dataList[i].RING_ID_L1 =  AlopexGrid.generateKey();
	   				//dataList[i].RING_ID = null;
	   			}

	   			if (nullToEmpty(dataList[i].RING_ID_L2) == "" ) {
	   				dataList[i].RING_ID_L2 =  AlopexGrid.generateKey();
	   				//dataList[i].RING_ID = null;
	   			}

	   			if (nullToEmpty(dataList[i].RING_ID_L3) == "" ) {
	   				dataList[i].RING_ID_L3 =  AlopexGrid.generateKey();
	   				//dataList[i].RING_ID = null;
	   			}*/

	   			dataList[i].USE_NETWORK_ID = networkInfo[0];
	   			dataList[i].USE_NETWORK_NM = networkInfo[1];
    			dataList[i].USE_NETWORK_PATH_SAME_NO = networkInfo[5];
				dataList[i].USE_NETWORK_PATH_DIRECTION = 'RIGHT';
				
				dataList[i].USE_NETWORK_LINK_DIRECTION = dataList[i].LINK_DIRECTION;
				
			}
			$a.close(dataList);
		}else{
			alertBox('W', "선택한 회선의 선번정보가 없습니다.");/* 선택된 데이터가 없습니다. */
			return;
		}
	});
}

function successCallbackPop(response, status, jqxhr, flag){
	// 서비스 회선에서 사용하는 대분류, 소분류코드
	if(flag == 'svlnLclSclCodeData') {	
		var tmpMgmtCd = "0001";
		var tmpMgmtCdNm = "SKT";
		var svlnLclCd_option_data =  [];
		var svlnSclCd_option_data =  [];
		var tmpFirstSclCd = "";
		
		for(i=0; i<response.svlnLclCdList.length; i++){
			var dataL = response.svlnLclCdList[i]; 
			if(dataL.comCd == "003" || dataL.comCd ==  "006") {
				tmpFirstSclCd = dataL.value;
				svlnLclCd_option_data.push(dataL);
			}
		}
		$('#svlnLclCd').clear();
		$('#svlnLclCd').setData({data : svlnLclCd_option_data});
		

		var tmpSvlnLclCd = $('#svlnLclCd').val();
		for(k=0; k<response.svlnSclCdList.length; k++){

			var dataOption = response.svlnSclCdList[k]; 

			/*if(nullToEmpty(tmpSvlnLclCd) == nullToEmpty(dataOption.uprComCd) 
					&& ("ALL" == nullToEmpty(dataOption.cdFltrgVal) || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataOption.cdFltrgVal) )){*/
			if (nullToEmpty(dataOption.uprComCd) == "003" ||  nullToEmpty(dataOption.uprComCd) == "006") {
				// RU회선중 광코어와 기타회선의 중계기정합장치만 사용하기 위해
				useLineSvlnSclCd.push(dataOption);
				if (dataOption.comCd =="101") {
					svlnSclCd_option_data.push(dataOption);
				}
			}
		}		
		$('#svlnSclCd').clear();
		$('#svlnSclCd').setData({data : svlnSclCd_option_data});	
	}
	//조회
	else if(flag == 'searchMain') {
		
		var data = response.list;
		renderGrid(mainGridId, data, response.totalCnt, addData);
		if(addData) {
			$('#'+mainGridId).alopexGrid("dataAdd", data);
			addData = false;
			cflineHideProgressBody();
		} else {
			$('#'+mainGridId).alopexGrid("dataSet", data);
			// 스크롤 추가 검색이 아니고 mainGrid에 서비스회선이 검색되었을 때 첫 데이터의 선번정보를 검색
			if ($('#'+mainGridId).alopexGrid('dataGet').length > 0) {
				var dataObj = $('#'+mainGridId).alopexGrid("dataGet", {_index : { data:0 }})[0];
				
				var param = {
									"gridId" : lnoGridId
									, "ntwkLineNo": dataObj.svlnNo
									, "svlnLclCd" : dataObj.svlnLclCd
									, "svlnSclCd" : dataObj.svlnSclCd
									, "mgmtGrpCd" : dataObj.mgmtGrpCd
									//, "ntwkLnoGrpSrno" : dataObj.ntwkLnoGrpSrno
						};
				
				fnSearch("lno", true, param);
			} // 그이외의 경우 회선정보그리드를 클리어 한다.
			else {
				$('#'+lnoGridId).alopexGrid('dataEmpty');
			}
			
			cflineHideProgressBody();
		}
	}
	else if(flag == 'searchLno') {
		var data = "";
		
		if (response.data != undefined) {
			networkInfo[0] = String(response.data.NETWORK_ID);
    		networkInfo[1] = String(response.data.NETWORK_NM);
    		networkInfo[2] = String(response.data.LINE_STATUS_CD);
    		networkInfo[3] = String(response.data.LINE_STATUS_NM);
    		networkInfo[4] = String(response.data.PATH_DIRECTION);
    		networkInfo[5] = String(response.data.PATH_SAME_NO);
    		networkInfo[6] = String(response.data.PATH_SEQ);
    		networkInfo[7] = String(response.data.LINE_LARGE_CD);
    		networkInfo[8] = String(response.data.LINE_LARGE_NM);
    		networkInfo[9] = String(response.data.LINE_SMALL_CD);
    		networkInfo[10] = String(response.data.LINE_SMALL_NM);
		}
		
		if(response.data != undefined && response.data.LINKS != undefined) {
			data = response.data.LINKS;
		} else {
			$('#'+lnoGridId).alopexGrid('dataEmpty');
			selectedServiceId = null;
		}
		
		/* 2019-10-24  1. 기간망 링 선번 고도화
		 * 선택한 선번을 서비스회선에 셋팅할때 링명컬럼이 rowspan 되지 않는 버그를 해결하기 위해 선번정보를 복제한다.
		 */ 
		pathDataInfo = [];
		jQuery.each(data, function(index, value) {
			var resultData = {};
			for(var key in value) {
			   eval("resultData." + key + " = value." + key);
			}
			pathDataInfo.push(resultData);
		});
		
		renderGrid(lnoGridId, data, "", addData);
		
		if(addData) {
			$('#'+lnoGridId).alopexGrid("dataAdd", data);
			addData = false;
		} else {
			$('#'+lnoGridId).alopexGrid("dataSet", data);
		}
		cflineHideProgressBody();
	}
}

var httpRequestPop = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 
		data : Param, 
		method : Method,
		flag : Flag
	}).done(successCallbackPop)
	  .fail(function(response){failCallbackPop(response, Flag);});
}

function failCallbackPop(response, flag){
	cflineHideProgressBody();
	if(flag == 'searchMain'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		return;
	}
	else if(flag == 'searchLno'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		$('#'+lnoGridId).alopexGrid('dataEmpty');
	}
	else {
		alertBox('I', cflineMsgArray['systemError']); /* 시스템 오류가 발생하였습니다. */
	}
}

// info list row intex 
function setRowIndexInfo(changeSearch){
	if(changeSearch){
		$("#firstRow01").val(1);
   	    $("#lastRow01").val(20);
	} 
	else {
	 	if(addData){
	 		var first = parseInt($("#firstRow01").val());
	 		var last = parseInt($("#lastRow01").val());
	 		$("#firstRow01").val(first + 20);
	 		$("#lastRow01").val(last + 20);
	 	}
	}
	$("#firstRowIndex").val($("#firstRow01").val());
    $("#lastRowIndex").val($("#lastRow01").val());
}

// work list row intex
function setRowIndexWork(changeSearch){
	if(changeSearch){
		$("#firstRow02").val(1);
   	    $("#lastRow02").val(20);
	} else {
	     	if(addData){
	     		var first = parseInt($("#firstRow02").val());
	     		var last = parseInt($("#lastRow02").val());
	     		$("#firstRow02").val(first + 20);
	     		$("#lastRow02").val(last + 20);
	     	}
	}
	$("#firstRowIndex").val($("#firstRow02").val());
    $("#lastRowIndex").val($("#lastRow02").val());
}

// 검색
function fnSearch(sType, changeSearch, param) {
	if(sType == "main") {
		setRowIndexInfo(changeSearch);
	} else if(sType == "lno") {
		setRowIndexWork(changeSearch);
	}
	
	var paramData = $("#svlnSearchForm").serialize(); 
	
	paramData = paramData + "&tmofCdPopListView="+tmofCd;
	
	cflineShowProgressBody();
	if (sType == "main") {
		/*if ($("#svlnSclCd").val() == "101") {
			paramData = paramData + "&svlnSclCd=101";
		}*/
		
		if (addData != true) {
			$('#'+mainGridId).alopexGrid('dataEmpty');
			$('#'+lnoGridId).alopexGrid('dataEmpty');
		}
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getuselinetargetlist', paramData, 'GET', 'searchMain');
	}else if (sType == "lno") {
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', param, 'GET', 'searchLno');
	}
}
