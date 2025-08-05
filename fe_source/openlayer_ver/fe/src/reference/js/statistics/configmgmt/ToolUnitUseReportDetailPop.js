/**
 * ToolUnitUseReportDetailPop.js
 *
 * @author P123512
 * @date 2018.04.04
 * @version 1.0
 */
var gridId = 'dataGridPop';
var paramData = null;
var excelFileSheetName = "";
var param = {};
$a.page(function() {
	this.init = function(id, param) {
		$('#title').text("카드세부정보");
		$('#btnExportExcelPop').setEnabled(false);
		paramData = param;
		$('#equipmentName').val(paramData.eqpNm );
        setEventListener();
        initGrid();
        searchList();
	};

	
	//Grid 초기화
	function initGrid() {
		var columnMapping = [
			                     {key : 'cardNo',		align:  'center',		width:  '140px',			title : cflineMsgArray['cardNumber']			/* 카드번호 */ }
			                    , {key : 'cardNm', align : 'center', 		width : '140px', 			title : cflineMsgArray['cardName']				/* 카드명 */}
			                    , {key : 'cardMdlNm',	align : 'center',		width : '140px',			title : "카드모델"									/* 카드모델 */}
			                    , {key : 'cardStatCdNm', align : 'center', 		width : '140px', 			title : cflineMsgArray['status']				/*상태*/ }		
			                    , {key : 'capaNm', 		align : 'center', 		width : '140px', 			title : cflineMsgArray['capacity'] 				/* 용량 */}
			                    , {key : 'cardSerNoVal', 	align : 'center', 		width : '180px', 			title : "SERIAL번호"								/* SERIAL번호 */}
			                    , {key : 'pec', 		align : 'center', 		width : '180px', 			title : "PEC"									/* PEC */}
			                    , {key : 'mnftYm', 	align : 'center',		width : '150px', 			title : "제조일"									/* 제조일 */}
			                    , {key : 'instlDt', 		align : 'center', 		width : '150px', 			title : "설치일"									/* 설치일 */}
			                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title : "갱신일"									/* 갱신일 */}
			]


		//Grid 생성
		$('#'+gridId).alopexGrid({
				columnMapping : columnMapping,
		    	pager : true,
				rowInlineEdit : true,
				cellSelectable : true,
				autoColumnIndex: true,
				fitTableWidth: true,
				rowClickSelect : true,
				rowSingleSelect : true,
				numberingColumnFromZero : false,
				height : 420,
				message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
					filterNodata : 'No data'
				}
		});
	};
	
	function searchList() {
		cflineShowProgressBody();
		var data = {  "eqpId" : paramData.eqpId
		}; 
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/getToolUnitUseReportDetailList', data, 'GET', 'getToolUnitUseReportDetailList');
	}

	function setEventListener() {
		 //엑셀다운로드
	    $('#btnExportExcelPop').on('click', function(e) {
	 	   cflineShowProgressBody();
	     	excelDownload();
	    });
	  
	    //닫기
	    $('#btnCnclPop').on('click', function(e) {
	 	   $a.close();
	    });
	};
	
	//request 성공시
	function successCallback(response, flag) {
		if (flag == 'getToolUnitUseReportDetailList') {
			$('#btnExportExcelPop').setEnabled(true);	
	
			cflineHideProgressBody();
			$('#'+gridId).alopexGrid("dataSet", response.getToolUnitUseReportDetailList);
		}
	}
	
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getToolUnitUseReportDetailList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']);  /*조회 실패 하였습니다.*/
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
    	var date = getCurrDate();
    	var worker = new ExcelWorker({
    		excelFileName : '카드세부정보_'+date,		
    		sheetList : [{
    			sheetName : '카드세부정보',
    			placement : 'vertical',
    			$grid : $('#'+gridId)
    		}]
    	});
    	
    	worker.export({
    		merge : false,
    		exportHidden : false,
    		useGridColumnWidth : true,
    		border : true,
    		useCSSParser : true
    	});
        cflineHideProgressBody();
    }
});