/**
*
*/
var gridWorkId = 'gridIdWorkPop';
var gridDetailId = 'gridIdDetailPop';
var paramData = null;

$a.page(function() {
	this.init = function(id, param) {
		paramData = param;
		setEventListener();
		initGrid();
		searchList();
		
	}
	
	//Grid 초기화
	function initGrid() {
		var workMapping = [
		               			{ key: 'makeDate', 			align: 'center', 		width: '70px',			title: cflineMsgArray['requestDay']	/* 요청일 */ }
		               			, { key: 'svlnSclNm', 			align: 'center', 		width: '60px',		title: cflineMsgArray['lineType']	/* 회선유형 */ }
		               			, { key: 'jobTitle', 			align: 'center', 		width: '220px',		title: cflineMsgArray['workName']	/* 작업명 */ }
		               			, { key: 'linePerCnt', 			align: 'center', 		width: '70px',		title: cflineMsgArray['lineCount']	/* 회선수 */ }
		               			, { key: 'jobCmplDt', 			align: 'center', 		width: '80px',		title: cflineMsgArray['workFinishDay']	/* 작업완료일 */ }
		               ];
		
		var detailMapping = [
		                     			{ key: 'jobTypeCdNm', 			align: 'center', 		width: '60px',			title: cflineMsgArray['workType']	/* 작업유형 */ }
		                     			, { key: 'lineType', 			align: 'center', 		width: '60px',			title: cflineMsgArray['lineType']	/* 회선유형 */ }
		                     			, { key: 'jobCompleteCdNm', 			align: 'center', 		width: '60px',			title: cflineMsgArray['openTaskJobCmplYn']	/* 작업상황 */ }
		                     			, { key: 'jobCmplDt', 			align: 'center', 		width: '60px',			title: cflineMsgArray['openingDay']	/* 개통일 */ }
		                     			, { key: 'ogTransroomName', 			align: 'center', 		width: '60px',			title: "OG " + cflineMsgArray['transmissionOffice']	/* OG 전송실 */ }
		                     			, { key: 'ogSysName', 			align: 'center', 		width: '60px',			title: "OG " + cflineMsgArray['systemName']	/* OG 시스템명 */ }
		                     			, { key: 'ogTieOne', 			align: 'center', 		width: '60px',			title: "OG TIE1"	/* OG TIE1 */ }
		                     			, { key: 'ogTieTwoBtsName', 			align: 'center', 		width: '60px',			title: "OG TIE2"	/* OG TIE2 */ }
		                     			, { key: 'icTransroomName', 			align: 'center', 		width: '60px',			title: "IC " + cflineMsgArray['transmissionOffice']	/* IC 전송실 */ }
		                     			, { key: 'icSysName', 			align: 'center', 		width: '60px',			title: "IC " + cflineMsgArray['systemName']	/* IC 시스템명 */ }
		                     			, { key: 'icTieOne', 			align: 'center', 		width: '60px',			title: "IC TIE1"	/* IC TIE1 */ }
		                     			, { key: 'icTieTwoBtsName', 			align: 'center', 		width: '60px',			title: "IC TIE2"	/* IC TIE2 */ }
		                     			, { key: 'lineNm', 			align: 'center', 		width: '60px',			title: cflineMsgArray['lnNm']	/* 회선명 */ }
		                     ];
		
		$('#' + gridWorkId).alopexGrid({
			autoColumnIndex: true,
        	cellSelectable : true,
        	rowInlineEdit : false,
        	rowSelectOption: {
        		clickSelect: true,
        		singleSelect: true
        	},
        	numberingColumnFromZero : false,
            height: 300,
            message : {
            	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
            	filterNodata: 'No data'
            },
		  columnMapping: workMapping
		});
		
		$('#' + gridDetailId).alopexGrid({
			autoColumnIndex: true,
        	cellSelectable : true,
        	rowInlineEdit : false,
        	numberingColumnFromZero : false,
            height: 300,
            message : {
            	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
            	filterNodata: 'No data'
            },
		  columnMapping: detailMapping
		});
	};
	
	function setEventListener() {
		//상세팝업
		$('#' + gridWorkId).on('click', '.bodycell', function(e) {
			gridDetail(e);
		});
	}
    
    function searchList() {
		cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/opentaskreport/getOpenTaskReportDetailList', paramData, 'GET', 'searchList');
	}
    
    function gridDetail(e) {
    	var dataObj = AlopexGrid.parseEvent(e).data;
    	
    	var param = {
    						"jobId" : dataObj.jobId
    						, "svlnSclCd" : dataObj.svlnSclCd
    						, "tmofCd" : dataObj.mtsoId
    					}
    	
    	httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/opentaskreport/getOpenTaskReportJobList', param, 'GET', 'detailList');
    	
    	cflineShowProgressBody();
    }
    
    //request 성공시
    function successCallback(response, flag) {
    	if(flag == 'searchList') {
    		$('#' + gridWorkId).alopexGrid('dataSet', response.result);
			cflineHideProgressBody();
		}
    	
    	if(flag == 'detailList') {
    		console.log(response);
    	  	$('#' + gridDetailId).alopexGrid('dataEmpty');
    		$('#' + gridDetailId).alopexGrid('dataSet', response.jobList);
    		cflineHideProgressBody();
    	}
    }
    
    //request 실패시.
    function failCallback(response, flag) {
    	if(flag == 'searchList') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
    	
    	if(flag == 'detailList') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }
});