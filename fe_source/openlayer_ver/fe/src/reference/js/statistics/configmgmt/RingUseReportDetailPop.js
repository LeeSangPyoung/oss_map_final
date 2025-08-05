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
var gridValue = null;
$a.page(function() {
	this.init = function(id, param) {
		console.log(param);
		$('#btnExportExcelPop').setEnabled(false);
		paramData = param;
		if(paramData.gridValue == "text" ) {
			$('#title').text("사용율 현황(링) - 사용율 상세");
			gridValue = paramData.gridValue;
		} else if(paramData.gridValue == "value") {
			$('#title').text("수용트렁크상세");
			gridValue = paramData.gridValue;
		} else if(paramData.gridValue == "ex") {
			$('#title').text("수용회선상세");
			gridValue = paramData.gridValue;
		}
        setEventListener();
        initGrid();
        //searchList();
	};

	
	//Grid 초기화
	function initGrid() {
		var columnMapping = []
		if(gridValue == "text" ) {
		//사용율 현황(링) - 사용율 상세
			columnMapping = [
				                     {key : 'cardNo',		align:  'center',		width:  '140px',			title : cflineMsgArray['ringName']			/* 링명 */ }
				                    , {key : 'cardNm', align : 'center', 		width : '250px', 				title : "링용량"								/* 링용량 */}
				                    , {key : 'cardMdlNm',	align : 'center',		width : '140px',			title : "RM_PATH명"							/* RM_PATH명 */}
				                    , {key : 'cardStatCdNm', align : 'center', 		width : '140px', 			title : "RM타입"								/*RM타입*/ }		
				                    , {key : 'capaNm', 		align : 'center', 		width : '140px', 			title : cflineMsgArray['lineCapacity'] 			/* 회선용량 */}
				                    , {key : 'cardSerNoVal', 	align : 'center', 		width : '180px', 			title : "장비#1"								/* 장비#1 */}
				                    , {key : 'pec', 		align : 'center', 		width : '180px', 			title : "a_port#1"									/* a_port#1 */}
				                    , {key : 'mnftYm', 	align : 'center',		width : '150px', 			title : "b_port#1"									/* b_port#1 */}
				                    , {key : 'instlDt', 		align : 'center', 		width : '150px', 			title : "장비#2"									/* 장비#2 */}
				                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title : "a_port#2"									/* a_port#2 */}
				                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title : "b_port#2"									/* b_port#2 */}
				                    
			]
		
		} else if(gridValue == "value") {
			//수용 트렁크 상세
			columnMapping = [
		                     {key : 'cardNo',		align:  'center',		width:  '140px',			title : cflineMsgArray['trunkNm']				/* 트렁크명 */ }
		                    , {key : 'cardNm', align : 'center', 		width : '250px', 			title : cflineMsgArray['managementGroup']			/* 관리그룹 */}
		                    , {key : 'cardMdlNm',	align : 'center',		width : '140px',			title : cflineMsgArray['businessMan']		 	/* 사업자 */}
		                    , {key : 'cardStatCdNm', align : 'center', 		width : '140px', 			title : cflineMsgArray['capacity']				/*용량*/ }		
		                    , {key : 'capaNm', 		align : 'center', 		width : '140px', 			title : cflineMsgArray['superStation'] 			/* 상위국 */}
		                    , {key : 'cardSerNoVal', 	align : 'center', 		width : '180px', 			title : cflineMsgArray['subStation'] 		/* 하위국 */}
		                    
		    ]
		} else if(gridValue == "ex") {
			//수용회선상세
			columnMapping = [
		                     {key : 'cardNo',		align:  'center',		width:  '140px',			title : cflineMsgArray['lnNm']					/* 회선명 */ }
		                    , {key : 'cardNm', align : 'center', 		width : '250px', 			title : cflineMsgArray['exclusiveLineNumber']		/* 전용회선번호 */}
		                    , {key : 'cardMdlNm',	align : 'center',		width : '140px',			title : cflineMsgArray['businessMan']			/* 사업자 */}
		                    , {key : 'cardStatCdNm', align : 'center', 		width : '140px', 			title : cflineMsgArray['managementGroup']		/*관리그룹*/ }		
		                    , {key : 'capaNm', 		align : 'center', 		width : '140px', 			title : cflineMsgArray['lineType'] 				/* 회선유형 */}
		                    , {key : 'cardSerNoVal', 	align : 'center', 		width : '180px', 			title : cflineMsgArray['serviceName'] 		/* 서비스명 */}
		                    , {key : 'pec', 		align : 'center', 		width : '180px', 			title : cflineMsgArray['capacity'] 				/* 용량  */}
		                    , {key : 'mnftYm', 	align : 'center',		width : '150px', 			title : cflineMsgArray['lineStatus'] 				/* 회선상태 */}
		                    , {key : 'instlDt', 		align : 'center', 		width : '150px', 			title : cflineMsgArray['upperTeam'] 		/* 상위팀 */}
		                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title : cflineMsgArray['uprSmtso'] 				/* 상위국소 */}
		                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title : cflineMsgArray['lowerTeam'] 			/* 하위팀 */}
		                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title :  cflineMsgArray['lowSmtso'] 			/* 하위국소 */}
		                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title : cflineMsgArray['managementPost'] 		/* 관리포스트 */}
		                    , {key : 'updateDate', 	align : 'center', 		width : '150px', 			title : cflineMsgArray['chargingStatus'] 		/* 과금상태 */}
		                    
		    ]	
		}

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

		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/getToolUnitUseReportDetailList', data, 'GET', 'getRingUseReportDetailList');
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
    		excelFileName : gridValue+'_'+date,		
    		sheetList : [{
    			sheetName : gridValue+'_'+date,
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