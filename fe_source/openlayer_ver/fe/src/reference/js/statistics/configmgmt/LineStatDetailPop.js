/**
 * 
 */
var gridId = 'gridIdPop';
var paramData = null;

$a.page(function() {
	this.init = function(id, param) {
		paramData = param;

		setEventListener();
		initGrid();
		searchList();
		
		$('#btnExportExcelPop').setEnabled(false);
	}
	
	function initGrid() {
		var columnMapping = [
		                     			{ key: 'lineNm',							align: 'left',					width: '110px',				title: cflineMsgArray['lnNm']	/* 회선명 */	}
		                     			, { key: 'svlnNo',							align: 'center',				width: '80px',				title: cflineMsgArray['lineNo']	/* 회선번호 */ }
		                     			, { key: 'scrbSrvcMgmtNo',				align: 'center',				width: '80px',				title: cflineMsgArray['subscriServiceNumber']		/* 가입서비스번호 */ }
		                     			, { key: 'svlnCustNo',					align: 'center',				width: '80px',				title: cflineMsgArray['customerNumber']	/* 고객번호 */ }
		                     			, { key: 'svlnSclNm',						align: 'center',				width: '80px',				title: cflineMsgArray['lineDivision']	/* 회선구분 */ }
		                     			, { key: 'svlnStatNm',					align: 'center',				width: '70px',				title: cflineMsgArray['lineStatus']		/* 회선상태 */ }
		                     			, { key: 'svlnTypNm',						align: 'center',				width: '85px',				title: cflineMsgArray['serviceDivision']	/* 서비스구분 */ }
		                     ];
		
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
        	cellSelectable : true,
        	rowClickSelect : false,
        	rowInlineEdit : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero : false,
            height: 300,
            message : {
            	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
            	filterNodata: 'No data'
            },
            columnMapping: columnMapping
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
	
	function searchList() {
		cflineShowProgressBody();

		var statCd = paramData.dataKey == "ncomLineCnt" ? "01" : "02";
		var param = {
							"statCd" : statCd
							, "bonbuId" : paramData.bonbuId
							, "teamId" : paramData.teamId
							, "mtsoId" : paramData.mtsoId		
		}	
		
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/linestat/getLineStatDetailList', param, 'GET', 'searchList');
	}
	
	//request 성공시
	function successCallback(response, flag) {
		if(flag == 'searchList') {
			$('#bonbu').text(paramData.bonbuNm);
			$('#team').text(paramData.teamNm);
			$('#mtso').text(paramData.mtsoNm);
			
			if(response.lineDetailList.length > 0) {
				$('#' + gridId).alopexGrid('dataSet', response.lineDetailList);
				$('#btnExportExcelPop').setEnabled(true);
			}
			cflineHideProgressBody();
		}
	}
	
	//request 실패시
	function failCallback(response, flag) {
		if(flag == 'searchList') {
			cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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
	
	//엑셀다운로드
	function excelDownload() {
		cflineShowProgressBody();
		
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['lineStateStats'] + '상세_' + date,
     		sheetList: [{
     			sheetName: cflineMsgArray['lineStateStats'] + '상세_' + date,
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
})