/**
 * UseRingReportDetailPop.js
 *
 * @author P095783
 * @date 2018. 5. 16. 오전 11:30:03
 * @version 1.0
 * 
 */

var gridId = 'gridIdPop';
var paramData = null;
var dataKe = null

$a.page(function() {
	this.init = function(id, param) {
		paramData = param;
		dataKey = param.dataKey;
		setEventListener();
		initGrid(dataKey);
		searchList(dataKey);
		$('#ringNmPop').text(paramData.ntwkLineNm);
		$('#btnExportExcelPop').setEnabled(false);
	}
	
	//Grid 초기화
	function initGrid(dataKey) {
		if(dataKey == "useRate") {
			var mapping = [
	               			{ key: 'ntwkLineNm', 			align: 'left', 		width: '180px',			title: cflineMsgArray['ringName']	/* 링명 */ }
	               			, { key: 'ntwkCapaCdNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['ringCapacity']	/* 링용량 */ }
	               			, { key: 'rmPathName', 			align: 'left', 		width: '180px',		title: cflineMsgArray['rmPathNm']	/* RM PATH명 */ }
	               			, { key: 'rmLinkType', 			align: 'center', 		width: '180px',		title: cflineMsgArray['rmType']	/* RM타입 */ }
	               			, { key: 'crsCapaCdNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['lineCapacity']	/* 회선용량 */ }
	               			, { key: 'eqpNm1', 			align: 'left', 		width: '180px',		title: cflineMsgArray['equipment'] + "#1"	/* 장비#1 */ }
	               			, { key: 'aChannelDescr1', 			align: 'left', 		width: '130px', 	title: cflineMsgArray['aPort'] + "#1"		/* A PORT#1 */ }
                			, { key: 'zChannelDescr1', 			align: 'left', 		width: '130px', 	title: cflineMsgArray['bPort'] + "#1"			/* B PORT#1 */ }
                			, { key: 'eqpNm2', 			align: 'left', 		width: '180px',		title: cflineMsgArray['equipment'] + "#2"	/* 장비#2 */ }
	               			, { key: 'aChannelDescr2', 			align: 'left', 		width: '130px', 	title: cflineMsgArray['aPort'] + "#2"		/* A PORT#2 */ }
                			, { key: 'zChannelDescr2', 			align: 'left', 		width: '130px', 	title: cflineMsgArray['bPort'] + "#2"			/* B PORT#2 */ }
	               ];
		} else if(dataKey == "useTrkCnt") {
			var mapping = [
	               			{ key: 'ntwkLineNm', 			align: 'left', 		width: '180px',			title: cflineMsgArray['trunkNm']	/* 트렁크명 */ }
	               			, { key: 'mgmtGrpCdNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['managementGroup']	/* 관리그룹 */ }
	               			/*, { key: 'businessMan', 			align: 'center', 		width: '180px',		title: cflineMsgArray['businessMan']	 사업자  }*/
	               			, { key: 'ntwkCapaCdNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['capacity']	/* 용량 */ }
	               			, { key: 'uprMtsoNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['superStation']	/* 상위국 */ }
	               			, { key: 'lowMtsoNm', 			align: 'center', 		width: '130px', 	title: cflineMsgArray['subStation']	/* 하위국 */ }
	               ];
			
		} else if(dataKey == "useLineCnt"){
			var mapping = [
	               			{ key: 'lineNm', 			align: 'left', 		width: '180px',			title: cflineMsgArray['lnNm']	/* 회선명 */ }
	               			, { key: 'svlnNo', 			align: 'center', 		width: '180px',		title: cflineMsgArray['serviceLineNumber']	/* 서비스회선번호 */ }
	               			, { key: 'leslNo', 			align: 'center', 		width: '180px',		title: cflineMsgArray['exclusiveLineNumber']	/* 전용회선번호 */ }
	               			, { key: 'commBizrNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['rentBusinessMan'] /* 임차사업자 */ }
	               			, { key: 'mgmtGrpCdNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['managementGroup']	/* 관리그룹 */ }
	               			, { key: 'svlnSclCdNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */ }
	               			, { key: 'svlnTypCdNm', 			align: 'center', 		width: '130px', 	title: cflineMsgArray['serviceLineType'] /*  서비스회선유형 */ }
                			, { key: 'lineCapaCdNm', 			align: 'center', 		width: '130px', 	title: cflineMsgArray['capacity']		/* 용량 */ }
                			, { key: 'svlnStatCdNm', 			align: 'center', 		width: '180px',		title: cflineMsgArray['lineStatus']		/* 회선상태 */ }
	               			, { key: 'uprTeamNm', 			align: 'center', 		width: '130px', 	title: cflineMsgArray['upperTeam']	/* 상위팀 */ }
                			, { key: 'uprMtsoNm', 			align: 'center', 		width: '130px', 	title: cflineMsgArray['uprSmtso']			/* 상위국소 */ }
                			, { key: 'lowTeamNm', 			align: 'center', 		width: '130px', 	title: cflineMsgArray['lowerTeam']		/* 하위팀 */ }
                			, { key: 'lowMtsoNm', 			align: 'center', 		width: '130px', 	title: cflineMsgArray['lowSmtso']			/* 하위국소 */ }
                			, { key: 'mgmtPostCdNm', 			align: 'cneter', 		width: '130px', 	title: cflineMsgArray['managementPost']		/* 관리포스트 */ }
                			, { key: 'chrStatCdNm', 			align: 'cneter', 		width: '130px', 	title: cflineMsgArray['chargingStatus']			/* 과금상태 */ }
	               ];
		}
		
		$('#'+gridId).alopexGrid('updateOption', {columnMapping: mapping});

		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
        	cellSelectable : true,
        	rowClickSelect : false,
        	rowInlineEdit : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero : false,
            height: 400,
            message : {
            	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
            	filterNodata: 'No data'
            },
		   columnMapping: mapping
		});
	};
	
	
	function setEventListener() {
		//엑셀다운로드
	    $('#btnExportExcelPop').on('click', function(e) {
			cflineShowProgressBody();
	       	excelDownload(dataKey);
	    });
	    
	    //닫기
	    $('#btnCnclPop').on('click', function(e) {
	       $a.close();
	    });
	}
	
	//request 성공시
    function successCallback(response, flag) {
    	if(flag == 'detailList') {
			if(response.resultList.length > 0) {
				$('#btnExportExcelPop').setEnabled(true);
			}
			$('#' + gridId).alopexGrid('dataSet', response.resultList);
			cflineHideProgressBody();
		}
    }
    
    //request 실패시.
    function failCallback(response, flag) {
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
    
    function searchList(dataKey) {
		cflineShowProgressBody();
		var param = {
				"ntwkLineNo" : paramData.ntwkLineNo
				, "gubun" : dataKey
		}
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/useringstat/getUseRingStatDetailList', param, 'GET', 'detailList');
	}
    
    //엑셀다운로드
    function excelDownload(dataKey) {
		var date = getTodayStr("-");
		var excelFileName = null;
		var sheetName = null;
		
		if(dataKey == "useRate") {
			excelFileName = cflineMsgArray['useRateStatRing'] + " 사용율 상세_" + date;
			sheetName = cflineMsgArray['useRateStatRing'] + " 사용율 상세";
		}
		else if (dataKey == "useTrkCnt") {
			excelFileName = cflineMsgArray['useRateStatRing'] + " 수용트렁크 상세_" + date;
			sheetName = cflineMsgArray['useRateStatRing'] + " 수용트렁크 상세";
		}
		else if (dataKey == "useLineCnt") {
			excelFileName = cflineMsgArray['useRateStatRing'] + " 수용회선 상세_" + date;
			sheetName = cflineMsgArray['useRateStatRing'] + " 수용회선 상세";
		}
		
		var worker = new ExcelWorker({
     		excelFileName : excelFileName,
     		sheetList: [{
     			sheetName: sheetName,	
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
			merge : true,
			exportHidden : false,
			useGridColumnWidth : true,
			border : true,
			useCSSParser : true
		});
		cflineHideProgressBody();
    }
});