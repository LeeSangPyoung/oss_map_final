/**
 * RingListBySvlnPop.js 
 *
 * @author Administrator
 * @date 2016. 10. 24. 오후 14:02:03
 * @version 1.0
 */
$a.page(function() {
	var gridResult = 'resultListGrid';
	var isNotParamNull = false ; // param의 null여부: 조회 조건 항목 변화
	var setInitParam = "";
	var lftEqpNm = "";
	var lftPortNm = "";
	var ntwkLineNm = "";
	var topMtsoIdList = "";
	var topoSclData = ""; // 망종류(토폴로지소분류코드)
	var ntwkTypData = ""; // 망구분(네트워크유형코드)
    var openerReturnValue = null;
	
    this.init = function(id, param) {
    	if(param.ntwkLineNm != undefined) { // networkPath 검색 조건 표출 (data : param)
    		//console.log(param);
    		isNotParamNull = true;
    		
    		var tmofParamData = [];
    		var mtsoIdList = [];
    		var tmofCd = "";
    		if(nullToEmpty(param.vTmofInfo) != "") {
        		//console.log(nullToEmpty(param.vTmofInfo));
    			var mtsoId = "";
    			var mtsoNm = "";
    			var index = 0;
    			for(i=0; i<param.vTmofInfo.length ;i++) {
    				mtsoId = param.vTmofInfo[i].mtsoId;
    				mtsoNm = param.vTmofInfo[i].mtsoNm
    				if(nullToEmpty(mtsoNm) != ""){
    					tmofParamData.push({value:mtsoId, text:mtsoNm});
    					mtsoIdList[index] = mtsoId;
    					index++;
    				}
    			}
    			tmofCd = mtsoIdList.join(',');
    		}

    		//console.log("tmofCd===========" + tmofCd);
    		//console.log(tmofParamData);
        	$('#topMtsoIdListPop').setData({
        		data:tmofParamData,
        		topMtsoIdList:mtsoIdList
        	});
    		
    		ntwkLineNm = nullToEmpty(param.ntwkLineNm);
    		topMtsoIdList = tmofCd;
    		var topoLclCd = nullToEmpty(param.topoLclCd);
    		var topoSclCd = nullToEmpty(param.topoSclCd);
    		var mgmtGrpCd = nullToEmpty(param.mgmtGrpCd);
    		$('#ntwkLineNmPop').val(ntwkLineNm);
    		
    		setInitParam = {"ntwkLineNm" : ntwkLineNm, "topMtsoIdList" : tmofCd, "topoLclCd" : topoLclCd, "topoSclCd" : topoSclCd, "mgmtGrpCd" : mgmtGrpCd}; 
    		// 그리드 데이터 셋팅
    		//2017-04-17 자동조회제거
    		setSelectCode("path");
    	}else { // 공통 검색 조건 표출(data : null)
    		isNotParamNull = false;
    		setSelectCode("");	
    	}
    	
    	
    	// process for input text box
//    	inputEnableProc("lftEqpNmPop","lftPortNmPop","");
//    	inputEnableProc("rghtEqpNmPop","rghtPortNmPop","");
    	
    	initGrid();
    	setEventListener();   
    };
    
    // 그리드 초기화
    function initGrid() {
    	var nodata = cflineMsgArray['noInquiryData'] /* 조회된 데이터가 없습니다. */;
        $('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		preventScrollPropagation: true, // 그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting: true
			},
			height : 430,
	    	message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
	    	},
			columnMapping: [
//			                { selectorColumn : true, width : '100px' } 
						    {key : 'check', align:'center', width:'40px',	title : cflineMsgArray['sequence'] /*순번*/,	numberingColumn : true}
						   , {key : 'ntwkLineNo',	title : cflineMsgArray['ringIdentification'] /*링ID*/,	align:'center',	width: '110px'}
						   , {key : 'ntwkLineNm',	title : cflineMsgArray['ringName'] /*링명*/,	align:'left',	width: '240px'}
						   , {key : 'mgmtGrpCdNm',	title : cflineMsgArray['managementGroup'] /*관리그룹*/,	align:'center',	width: '90px'}
						   , {key : 'ntwkTypNm',	title : cflineMsgArray['networkDivision'] /*망구분*/,	align:'center',	width: '135px'}
						   , {key : 'topoSclNm',	title : cflineMsgArray['ntwkTopologyCd'] /*망종류*/,	align:'center',	width: '150px'}
						   , {key : 'ntwkCapaNm',	title : cflineMsgArray['capacity'] /*용량*/,	align:'center',	width: '90px'}
						   , {key : 'ringSwchgMeansNm',	title : cflineMsgArray['ringSwchgMeansCd'] /*절체방식*/,	align:'center',	width: '120px'}
						   , {key : 'frstRegUserId',	title : cflineMsgArray['registrant'] /*등록자*/,	align:'center',	width: '120px'}
						   , {key : 'lineOpenDt',	title : cflineMsgArray['openingDate'] /*개통일자*/,	align:'center',	width: '81px'}
						   , {key : 'lastChgUserId',	title : cflineMsgArray['changer'] /*변경자*/,	align:'center',	width: '120px'}
						   , {key : 'lastChgDate',	title : cflineMsgArray['modificationDate'] /*수정일자*/,	align:'center',	width: '81px'}
					       ]                                                                       
			               });
    };
    
    function setSelectCode(flag) {
    	var param = {"userMgmtNm": "SKT"};
    	//console.log(param);
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getTopoList', param, 'GET', 'TopoData'); // 망종류데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', param, 'GET', 'NtwkTypData'); // 망구분 데이터
    }
    
    function setEventListener() { 
	   	//조회 
    	$('#btnSearchPop').on('click', function(e) {
	    	lftEqpNm = $('#lftEqpNmPop').val();
	    	lftPortNm = $('#lftPortNmPop').val();
	    	ntwkLineNm = $('#ntwkLineNmPop').val();
	    	topoSclData = $('#topoSclCdPop').val(); // 망종류(토폴로지소분류코드)
	    	ntwkTypData = $('#ntwkTypCdPop').val(); // 망구분(네트워크유형코드)
	    	if(nullToEmpty($('#topMtsoIdListPop').val()) != "") {
	    		topMtsoIdList = $('#topMtsoIdListPop').val().join(',');
	    	}else {
	    		topMtsoIdList = "topMtsoIdList";
	    	}
	   		fnSearchProcess();
        });
    	
    	// 엔터 이벤트
    	$('#searchFormPop').on('keydown', function(e){
     		if (e.which == 13  ){
				$('#btnSearchPop').click();
				return false;
     		}
     	});
     	
//     	// 좌장비
//     	$('#lftEqpNmPop').on('propertychange input', function(e){
//     		inputEnableProc("lftEqpNmPop","lftPortNmPop","");
//     	});
//     	
//     	// 우장비
//     	$('#rghtEqpNmPop').on('propertychange input', function(){
//     		inputEnableProc("rghtEqpNmPop","rghtPortNmPop","");
//     	});
     	
     	// 그리드스크롤
    	$('#'+gridResult).on('scrollBottom', function(e){
    		// 그리드 데이터 셋팅
    		setGridData("scrollBottom");
    	});
    	
    	//그리드 더블클릭시
        $('#'+gridResult).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
    		//openTrunkPathPop(true, dataObj.ntwkLineNo, dataObj.ntwkLineNm);
			openRingPathPop(true, dataObj.ntwkLineNo, dataObj.ntwkLineNm);
    	 	//$a.navigate($('#ctx').val()+'/configmgmt/common/MtsoReg.do',dataObj);
    	 	//$a.close(dataObj);
    	 });
     	
 
    	//닫기
   	 	$('#btnPopClose').on('click', function(e) {
   	 		//console.log("btnPopClose===================");
        	$a.close(openerReturnValue);
        });  
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchPop'){
    		cflineHideProgressBody();
    		$("#"+gridResult).alopexGrid("viewUpdate");
    		$('#'+gridResult).alopexGrid("dataSet", response.outRingList);
    		$('#'+gridResult).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);} } } );
    	}
    	
    	if(flag == 'searchPopForPageAdd'){
    		cflineHideProgress(gridResult);
			if(response.outRingList.length <= 0){
				return false;
			}else{
	    		$('#'+gridResult).alopexGrid("dataAdd", response.outRingList);
	    		$('#'+gridResult).alopexGrid('updateOption',
						{paging : {pagerTotal: function(paging) {
							return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);
						}}}
				);
			}
    	}
    	
    	if(flag == 'TopoData') {
    		var TopoData = [{value: "", text: cflineCommMsgArray['all']/*전체*/}];
    		var paramTopoData = nullToEmpty(setInitParam.topoSclCd);
    		for(var n=0 ; n<response.TopoData.length ;n++) {
    			if(paramTopoData != ""){
    				if(paramTopoData == response.TopoData[n].topoSclCd){
    					TopoData.push({value:response.TopoData[n].topoSclCd, text: response.TopoData[n].topoSclNm});
    				}
    			}else{
    				TopoData.push({value:response.TopoData[n].topoSclCd, text: response.TopoData[n].topoSclNm});
    			}
    		}
    		$('#topoSclCdPop').clear();
    		$('#topoSclCdPop').setData({data : TopoData});
    		$('#topoSclCdPop').setSelected(paramTopoData);
    	}
    	
    	// 망 구분 조회조건 설정
    	if(flag =='NtwkTypData'){
    		var NtwkTypData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
    		for(n=0 ; n<response.NtwkTypData.length ; n++){
    			NtwkTypData.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
    		}
			$('#ntwkTypCdPop').clear();
			$('#ntwkTypCdPop').setData({data : NtwkTypData});
    	}
    }
    
    function failCallback(response, status, flag){
    	if(flag == 'searchPop'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }

    function fnSearchProcess() {
    	// 데이터 정합성 검사
    	var ringNameVal = $("#ntwkLineNmPop").val(); 
    	if(ringNameVal.length >100){
    		cflineHideProgressBody();
    		var msgArg = cflineMsgArray['ringName'];
    		var msgArg1 = 100;
    		alertBox('I', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* {0} 항목은 {1}자까지 입력가능합니다. */
    		$('#ntwkLineNmPop').focus();
    		return false;
    	}
    	// 그리드 데이터 셋팅
    	setGridData("searchProcess");
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
    
    function setGridData(division){
    	var param = "";
    	var nFirstRowIndex = 1;
    	var nLastRowIndex = 20;
    	var callBackFlag = 'searchPop';
    	//var searchFormData1 = $("#searchFormPop").serialize();
    	var searchFormData = "";
    	
    	if(division == "scrollBottom"){
    		nFirstRowIndex = parseInt($("#firstRowIndexPop").val()) + 20;
    		$("#firstRowIndexPop").val(nFirstRowIndex);
    		nLastRowIndex = parseInt($("#lastRowIndexPop").val()) + 20;
    		$("#lastRowIndexPop").val(nLastRowIndex);
    		callBackFlag = 'searchPopForPageAdd';
    		cflineShowProgress(gridResult);
    		
    	}else{
    		$("#firstRowIndexPop").val(nFirstRowIndex);
    		$("#lastRowIndexPop").val(nLastRowIndex);
    		cflineShowProgressBody();
    	}
    	
    	searchFormData = $("#searchFormPop").serialize();
    	
		if(isNotParamNull) {
			param = setInitParam;
			param.ntwkLineNm = ntwkLineNm;
			param.lftEqpNm = lftEqpNm;
			param.lftPortNm = lftPortNm;
			param.firstRowIndex = nFirstRowIndex;
			param.lastRowIndex = nLastRowIndex;
	    	param.topMtsoIdList = topMtsoIdList;

    	
	    	param.ntwkTypCd = ntwkTypData;
	    	
			if(setInitParam.topoSclCd != '010' && setInitParam.topoSclCd != '030'){
				param.topoSclCd = topoSclData;
			}
		}else{
			param = searchFormData;
		}
		//console.log(param);
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getSelectRingList', param, 'GET', callBackFlag);
    }
    


    /**
     * Function Name : openTrunkPathPop
     * Description   : 링구성도 팝업창
     * ----------------------------------------------------------------------------------------------------
     * param    	 : editYn
     *                 callGridIdForRing. 링 호출한 Grid
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function openRingPathPop (editYn, ntwkLineNo, ntwkLineNm) {
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) ==""){
    		urlPath = "/tango-transmission-web";
    	}
    	
    	cflineShowProgressBody();
    	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
    	var params = {"ntwkLineNo" : ntwkLineNo, "editYn" : editYn, "useNetworkPathDirection" : null
    					, "zIndex":zIndex, "target":"Alopex_Popup_selectAddDrop"};

    	//console.log(params);

    	$a.popup({
        	popid: "selectAddDrop",
    		title: "링 ADD DROP",
    		url: urlPath+'/configmgmt/cfline/RingAddDropPop.do',
    		data: params,
    		iframe: true,
    		modal: true,
    		movable:true,
    		windowpopup : true,
    		width : 1200,
    		height : 850,
    		callback:function(data){
    			cflineHideProgressBody();
	    		var returnArr = null;
    	    	if(data != null) {
    	    		//console.log(data);
    		    	if(nullToEmpty(data.prev) != "Y") {  // 이전버튼 클릭이 아닌경우
			    		if(data != null && data.length > 0){
			    			returnArr = {lnoList: data, useRingNm: ntwkLineNm};
			    		}
	    	    		openerReturnValue = returnArr;
	        	    	$('#btnPopClose').click();
    		    	}
    	    		openerReturnValue = null;
    	    	}else{
    	    		openerReturnValue = null;
    	    	}
    	    },
    	    xButtonClickCallback : function(el){
    			cflineHideProgressBody();
    	    	openerReturnValue = null;
    	    }
//    			if(data != null) {
//    				console.log(data);
//    				if(data.prev != 'Y') {
//    					var getDataSize = data.length;
//
//			    		if(data != null && getDataSize > 0){
//			    			returnArr = {lnoList: data, useRing: ntwkLineNm};
//			    		}
//	    	    		openerReturnValue = returnArr;
//	        	    	$('#btnPopClose').click();  
//    				}
//    			}
//    		}
        });
    }    
    
    
    
});