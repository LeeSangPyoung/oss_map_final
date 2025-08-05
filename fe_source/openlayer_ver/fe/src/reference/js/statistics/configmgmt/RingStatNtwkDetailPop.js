/**
*
*/
var gridId = 'gridIdPop';
var paramData = null;

$a.page(function() {
	this.init = function(id, param) {
		setEventListener();
		initGrid();
		paramData = param;
		searchList();
		$('#btnExcelDownDetail').setEnabled(false);
	}
	
	//Grid 초기화
	function initGrid() {
		var columnMapping = [
		                     			{ key: 'ntwkLineNm', 					align: 'left', 		width: '80px', 		title: cflineMsgArray['ringName']		/* 링명 */ }
		                     			, { key: 'mgmtGrpCdNm', 		align: 'center', 		width: '80px', 		title: cflineMsgArray['managementGroup']		/* 관리그룹 */ }
		                     			, { key: 'ntwkTypNm', 			align: 'center', 		width: '80px', 		title: cflineMsgArray['networkDivision']		/* 망구분 */ }
		                     			, { key: 'topoSclNm', 		align: 'center', 		width: '80px', 		title: cflineMsgArray['ntwkTopologyCd']		/* 망종류 */ }
		                     			, { key: 'ntwkCapaNm', 					align: 'center', 		width: '80px', 		title: cflineMsgArray['capacity']		/* 용량 */ }
		                     			,{ key: 'ringSwchgMeansNm', 		align: 'center', 		width: '80px', 		title: cflineMsgArray['ringSwchgMeansCd']		/* 절체방식 */ }
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
		  columnMapping: columnMapping,
		});
	};
	
	
	function setEventListener() {
		//엑셀다운로드
	    $('#btnExcelDownDetail').on('click', function(e) {
			cflineShowProgressBody();
	       	excelDownload();
	    });
	    
	    //닫기
	    $('#btnCnclPop').on('click', function(e) {
	    	$a.close()
	    });
	}
	
	//request 성공시
    function successCallback(response, flag) {
    	if(flag == 'searchList'){
    		if(response.result.length > 0) {
        		$('#'+gridId).alopexGrid('dataSet', response.result);
        		setTableText(response.result);
    			$('#btnExcelDownDetail').setEnabled(true);
    		}
    	}
		cflineHideProgressBody();
    }
    
    //request 실패시.
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
    
    function searchList(){
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/ringstat/getRingStatNtwkDetailList', paramData, 'GET', 'searchList');
    }
    
    //테이블 데이터 셋팅
	function setTableText(list) {
		if(paramData.dataKey == "TOTALCNT") {
			if(paramData.ntwkTypNm != "합계") {
				if(paramData.topoSclNm == "소계") {
					$('#popNetDivision').text(list[0].ntwkTypNm);
				} else {
					$('#popNetDivision').text(list[0].ntwkTypNm);
					$('#popNetTopo').text(list[0].topoSclNm);
				}
			} 
		} else {
			if(paramData.evTitle != "합계") {
				if(paramData.radioBtnVal == "B") {
					if(paramData.topoSclNm == "소계") {
						if(paramData.ntwkTypNm != "합계") {
							$('#popNetDivision').text(list[0].ntwkTypNm);
							$('#popBonbu').text(list[0].bonbuNm);
						} else {
							$('#popBonbu').text(list[0].bonbuNm);
						}
					} else {
						$('#popBonbu').text(list[0].bonbuNm);
						$('#popNetDivision').text(list[0].ntwkTypNm);
						$('#popNetTopo').text(list[0].topoSclNm);
					}
				} else if(paramData.radioBtnVal == "T") {
					if(paramData.topoSclNm == "소계") {
						if(paramData.ntwkTypNm != "합계") {
							$('#popBonbu').text(list[0].bonbuNm);
							$('#popTeam').text(list[0].teamNm);
							$('#popNetDivision').text(list[0].ntwkTypNm);
						} else {
							$('#popBonbu').text(list[0].bonbuNm);
							$('#popTeam').text(list[0].teamNm);
						}
					} else {
						$('#popBonbu').text(list[0].bonbuNm);
						$('#popTeam').text(list[0].teamNm);
						$('#popNetDivision').text(list[0].ntwkTypNm);
						$('#popNetTopo').text(list[0].topoSclNm);
					}
				} else {
					if(paramData.topoSclNm == "소계") {
						if(paramData.ntwkTypNm != "합계") {
							if(paramData.evTitle != "소계") {
								$('#popBonbu').text(list[0].bonbuNm);
								$('#popTeam').text(list[0].teamNm);
								$('#popTmof').text(list[0].mtsoNm);
								$('#popNetDivision').text(list[0].ntwkTypNm);
							} else {
								$('#popBonbu').text(list[0].bonbuNm);
								$('#popTeam').text(list[0].teamNm);
								$('#popNetDivision').text(list[0].ntwkTypNm);
							}
						} else {
							if(paramData.evTitle != "소계") {
								$('#popBonbu').text(list[0].bonbuNm);
								$('#popTeam').text(list[0].teamNm);
								$('#popTmof').text(list[0].mtsoNm);
							} else {
								$('#popBonbu').text(list[0].bonbuNm);
								$('#popTeam').text(list[0].teamNm);
							}
						}
					} else {
						if(paramData.evTitle != "소계") {
							$('#popBonbu').text(list[0].bonbuNm);
							$('#popTeam').text(list[0].teamNm);
							$('#popTmof').text(list[0].mtsoNm);
							$('#popNetDivision').text(list[0].ntwkTypNm);
							$('#popNetTopo').text(list[0].topoSclNm);
						} else {
							$('#popBonbu').text(list[0].bonbuNm);
							$('#popTeam').text(list[0].teamNm);
							$('#popNetDivision').text(list[0].ntwkTypNm);
							$('#popNetTopo').text(list[0].topoSclNm);
						}
					}
				}
			} else {
				if(paramData.topoSclNm == "소계") {
					if(paramData.ntwkTypNm != "합계") {
						$('#popBonbu').text(list[0].bonbuNm);
						$('#popNetDivision').text(list[0].ntwkTypNm);
					} else {
						$('#popBonbu').text(list[0].bonbuNm);
					}
				} else {
					$('#popBonbu').text(list[0].bonbuNm);
					$('#popNetDivision').text(list[0].ntwkTypNm);
					$('#popNetTopo').text(list[0].topoSclNm);
				}
			}
		}
	}
    
    //엑셀다운로드
    function excelDownload() {
		var date = getTodayStr("-");
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['ringStatNtwk'] + "_상세_" + date,		/* 링현황(망구분별) */
     		sheetList: [{
     			sheetName: cflineMsgArray['ringStatNtwk'] + "_상세",		/* 링현황(망구분별) */
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
});