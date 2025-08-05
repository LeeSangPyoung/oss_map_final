/**
*
*/
$a.page(function() {
	var gridId = 'gridIdPop';
	var paramData = null;
	var excelFileSheetName = null;
	
	this.init = function(id, param) {
		paramData = param;

		$('#btnExportExcelPop').setEnabled(false);
		
		setEventListener();
		initGrid();
		searchList();
	}
	
	function initGrid() {
		var orgMapping = [
		                     			{ key: 'ntwkLineNm', 			align: 'left', 		width: '200px', 	title: cflineMsgArray['ringName']		/* 링명 */ }
		                     			, { key: 'ntwkTypNm', 			align: 'center', 		width: '40px', 		title: cflineMsgArray['networkDivision']		/* 망구분 */ }
		                     			, { key: 'topoSclNm', 			align: 'center', 		width: '40px', 		title: cflineMsgArray['ntwkTopologyCd']		/* 망종류 */ }
		                     ];
		
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: true,
        	cellSelectable : true,
        	rowInlineEdit : false,
        	numberingColumnFromZero : false,
            height: 300,
            message : {
            	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
            	filterNodata: 'No data'
            },
		  columnMapping: orgMapping
		});
	};
	
	function setEventListener() {
		//엑셀다운로드
		$('#btnExportExcelPop').on('click', function(e) {
			excelDownload();
		});
		
		//닫기
		$('#btnCnclPop').on('click', function(e) {
			$a.close();
		});
	}
	
	//request 성공시
	function successCallback(response, flag) {
		if(flag == 'searchList') {
			getBelongTo();
			 
			if(response.result.length > 0) {
				$('#' + gridId).alopexGrid('dataSet', response.result);
				$('#btnExportExcelPop').setEnabled(true);
				
				$('#ringStatus').text(response.result[0].mtsoLnoInsProgStatNm);
			}
			cflineHideProgressBody();
		}
	}
	
	//request 실패시
	function failCallback(response, flag) {
		if(flag == 'searchList') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
	}
	
	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
		}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
	}
	
	
	/**
	 * 함수정의
	 */
	
	function searchList() {
		cflineShowProgressBody();
		var statCd = paramData.dataKey == "ncomRingCnt" ? "01" : "02";
		var param = {
				"mgmtGrpCd" : paramData.mgmtGrpCd
				, "statCd" : statCd
				, "bonbuId" : paramData.bonbuId
				, "teamId" : paramData.teamId
				, "mtsoId" : paramData.mtsoId		
		}	
		
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/ringstat/getRingStatOrgDetailList', param, 'GET', 'searchList');
	}
	
	function getTitleExcelName() {
		if(paramData.dataKey == "ncomRingCnt") {
			excelFileSheetName = cflineMsgArray['ringStatOrganization'] + '_상세_' + cflineMsgArray['notProgressingRingCnt']
		} else {
			excelFileSheetName = cflineMsgArray['ringStatOrganization'] + '_상세_' + cflineMsgArray['finishRingCnt']
		}
	}
	
	//엑셀다운로드
	function excelDownload() {
		getTitleExcelName();
		cflineShowProgressBody();
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : excelFileSheetName + "_" + date,
     		sheetList: [{
     			sheetName: excelFileSheetName,
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: false,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
	}
	
	//소속
	function getBelongTo() {
		if(paramData.teamNm == null && paramData.mtsoNm == null) {
			$('#belongTo').text(paramData.bonbuNm);
		} else if(paramData.mtsoNm == null) {
			$('#belongTo').text(paramData.bonbuNm + "-" + paramData.teamNm);
		} else {
			$('#belongTo').text(paramData.bonbuNm + "-" + paramData.teamNm + "-" + paramData.mtsoNm);
		}
	}
});