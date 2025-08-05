/**
 * EqpReportDetailPop.js
 *
 * @author P123512
 * @date 2018.01.24
 * @version 1.0
 */
var gridId = 'dataGridPop';
var paramData = null;
var excelFileSheetName = "";
var param = {};
$a.page(function() {
	this.init = function(id, param) {
		$('#title').text("장비 현황 상세");
		$('#btnExportExcelPop').setEnabled(false);
		paramData = param;
        setEventListener();
        initGrid();
        searchList();
	};
	
	
	
	//Grid 초기화
	function initGrid() {
		var columnMapping = [
			                     {key : 'eqpNm',		align:'center',			width:'200px',				title : cflineMsgArray['equipmentName']					/* 장비명 */ }
			                    , {key : 'mgmtGrpCdNm', align : 'center', 		width : '120px', 			title : cflineMsgArray['managementGroup']				/* 관리그룹 */}
			                    , {key : 'topMtsoNm',	align : 'center',		width : '200px',			title : cflineMsgArray['transmissionOffice']			/* 전송실 */}
			                    , {key : 'mtsoTypCdNm', align : 'center', 		width : '200px', 			title : cflineMsgArray['mobileTelephoneSwitchingOfficeType'] /*국사유형*/ }		
			                    , {key : 'mtsoNm', 		align : 'center', 		width : '200px', 			title : cflineMsgArray['smallMtso'] 					/* 국소 */}
			                    , {key : 'comCdNm', 	align : 'center', 	width : '200px', 			title : cflineMsgArray['equipmentKind'] 					/* 장비종류 */}
			                    , {key : 'bpNm', 		align : 'center', 		width : '200px', 			title : cflineMsgArray['vend']							/* 제조사 */}
			                    , {key : 'eqpMdlNm', 	align : 'center',		width : '200px', 			title : cflineMsgArray['modelName'] 					/* 모델명 */}
			                    , {key : 'eqpTid', 		align : 'center', 		width : '200px', 			title : cflineMsgArray['targetId'] 						/* TID */}
			                    , {key : 'eqpCapaNm', 	align : 'center', 		width : '200px', 			title : cflineMsgArray['capacity']						/* 용량 */}
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
				height : 350,
				message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
					filterNodata : 'No data'
				}
		});
	};
	
	function searchList() {
		cflineShowProgressBody();
	
		var forBtmListParam = { "mgmtGrpCd" : paramData.mgmtGrpCd, "sqlDiv" : paramData.sqlDiv, "bldChk" : paramData.bldChk };
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/getBtmList', forBtmListParam, 'GET', 'btmList');
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
		if (flag == 'searchList') {
			if( response.getEqpReportDetailList.length > 0 ){
				$('#'+gridId).alopexGrid('dataSet', response.getEqpReportDetailList );
				$('#btnExportExcelPop').setEnabled(true);
				
				if(paramData.comCdNm != "합계") {
					$('#equipmentKind').val( paramData.comCdNm);
				}
				if(paramData.bpNm != "소계") {
					$('#vend').val(paramData.bpNm );
				}
				if(paramData.eqpMdlNm != "소계"){
					$('#modelName').val(paramData.eqpMdlNm );
				}
				
				if($('#bonbuNm').val() == null || $('#bonbuNm').val() == "") {
					$('#bonbuNm').val(paramData.bonbuNmVal);
				}
				if($('#teamNm').val() == null || $('#teamNm').val() == "") {
					$('#teamNm').val(paramData.teamNmVal);
				}
			} else {
				$('#bonbuNm').val(paramData.bonbuNmVal);		/* 본부 */
				$('#teamNm').val(paramData.teamNmVal);			/* 팀 */
				$('#equipmentKind').val(paramData.comCdNm);		/* 장비종류 */
				$('#vend').val(paramData.bpNm);					/* 제조사 */
				$('#modelName').val(paramData.eqpMdlNm);		/* 모델명 */
			}
			cflineHideProgressBody();
    	}
		if( flag == 'btmList') {
			if(paramData.dataKey == "CNTTOT" ) {
				
				httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/getEqpReportDetailList', paramData, 'GET', 'searchList');
			}
			else {
				if( response.getBtmList.length > 0 ) {
					for(var index = 0; index < response.getBtmList.length; index++ ) {
						if(paramData.dataKey == response.getBtmList[index].mtsoKey ) {
							$('#bonbuNm').val(response.getBtmList[index].bonbuNm);
							$('#teamNm').val(response.getBtmList[index].teamNm);
							$('#topMtsoNm').val(response.getBtmList[index].mtsoNm); 
							param = { "bpId" : paramData.bpId
									, "eqpRoleDivCd" : paramData.eqpRoleDivCd
									, "eqpMdlId" :  paramData.eqpMdlId
									, "mgmtGrpCd" : paramData.mgmtGrpCd
									, "bonbuId" : response.getBtmList[index].bonbuKey
									, "teamId" : response.getBtmList[index].teamKey
									, "mtsoId" : response.getBtmList[index].mtsoId
									, "backboneNetworkEqp" : paramData.backboneNetworkEqp
									, "tmofCnt" : paramData.tmofCnt
									, "showMtsoCntrTyp" : paramData.showMtsoCntrTyp
									, "mtsoCntrTypCdList" : paramData.mtsoCntrTypCdList
							};   
							
							httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/getEqpReportDetailList', param, 'GET', 'searchList');
							break;
	
						} 
						if(paramData.dataKey == response.getBtmList[index].teamId) {
							$('#bonbuNm').val(response.getBtmList[index].bonbuNm);
							$('#teamNm').val(response.getBtmList[index].teamNm);
							if(paramData.mtsoNmVal != null ) {
								$('#topMtsoNm').val(paramData.mtsoNmVal);
							}
							param = { "bpId" : paramData.bpId
									, "eqpRoleDivCd" : paramData.eqpRoleDivCd
									, "eqpMdlId" :  paramData.eqpMdlId
									, "mgmtGrpCd" : paramData.mgmtGrpCd
									, "teamId" : response.getBtmList[index].teamKey
									, "backboneNetworkEqp" : paramData.backboneNetworkEqp
									, "mtsoId" : paramData.mtsoId
									, "bonbuId" : paramData.bonbuId
									, "tmofCnt" : paramData.tmofCnt
									, "showMtsoCntrTyp" : paramData.showMtsoCntrTyp
									, "mtsoCntrTypCdList" : paramData.mtsoCntrTypCdList
							}; 
							httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/getEqpReportDetailList', param, 'GET', 'searchList');
							break;
						}
						if(paramData.dataKey == response.getBtmList[index].bonbuId) {
							$('#bonbuNm').val(response.getBtmList[index].bonbuNm);
							if(paramData.teamNmVal != null ) {
								$('#teamNm').val(paramData.teamNmVal);
							}
							if(paramData.mtsoNmVal != null ) {
								$('#topMtsoNm').val(paramData.mtsoNmVal);
							}
							param = { "bpId" : paramData.bpId
									, "eqpRoleDivCd" : paramData.eqpRoleDivCd
									, "eqpMdlId" :  paramData.eqpMdlId
									, "mgmtGrpCd" : paramData.mgmtGrpCd
									, "bonbuId" : response.getBtmList[index].bonbuKey
									, "backboneNetworkEqp" : paramData.backboneNetworkEqp
									, "mtsoId" : paramData.mtsoId
									, "teamId" : paramData.teamId
									, "tmofCnt" : paramData.tmofCnt
									, "showMtsoCntrTyp" : paramData.showMtsoCntrTyp
									, "mtsoCntrTypCdList" : paramData.mtsoCntrTypCdList
							};
							httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/eqpreport/getEqpReportDetailList', param, 'GET', 'searchList');
							break;
						}
					}
				}
			}
		}
	}
	
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'searchList'){
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
    		excelFileName : '장비총괄현황상세_'+date,		
    		sheetList : [{
    			sheetName : '장비총괄현황상세_'+date,
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