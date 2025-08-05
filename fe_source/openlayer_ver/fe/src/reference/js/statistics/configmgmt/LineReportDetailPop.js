/**
 * LineReportDetailPop.js
 *
 * @author P123512
 * @date 2018.01.24
 * @version 1.0
 */

var gridId = 'dataGridPop';
var paramData = null;
var excelFileSheetName = "";
var bonbuTeamMtsoList = [];

var bonbuId = null;
var teamId = null;
var mtsoId = null;

var bonbuNm = null;
var teamNm = null;
var mtsoNm = null;
$a.page(function() {
	this.init = function(id, param) {
		$('#title').text("회선 현황 상세");
		paramData = param;
		var mgmtGrpCd = {
				"mgmtGrpCd" : paramData.mgmtGrpCd
		};
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linereport/getBonbuTeamMtsoList', mgmtGrpCd, 'GET', 'getBonbuTeamMtsoList');
		
		$('#btnExportExcelPop').setEnabled(false);
		$('#svlnLclCd').val(paramData.svlnLclNm);
		$('#svlnSclCd').val(paramData.svlnSclNm);
		if(paramData.commBizrNm != "소계" && paramData.commBizrNm != "전체") {
			$('#commBizr').val(paramData.commBizrNm);
		}
		$('#service').val(paramData.svlnTypNm);
		$('#btnExcelDownDetail').setEnabled(false);
        setEventListener();
        initGrid();
        
	};
	
	function setSelectCode() {
		for(var index = 0 ; index < bonbuTeamMtsoList.length; index++ ) {
			if(paramData.key == bonbuTeamMtsoList[index].mtsoId ) {
				bonbuId = bonbuTeamMtsoList[index].bonbuId;
				bonbuNm = bonbuTeamMtsoList[index].bonbuNm;
				teamId = bonbuTeamMtsoList[index].teamId;
				teamNm = bonbuTeamMtsoList[index].teamNm;
				mtsoId = bonbuTeamMtsoList[index].mtsoId;
				mtsoNm = bonbuTeamMtsoList[index].mtsoNm;
			}
			if(paramData.key == bonbuTeamMtsoList[index].teamId ) {
				bonbuId = bonbuTeamMtsoList[index].bonbuId;
				bonbuNm = bonbuTeamMtsoList[index].bonbuNm;
				teamId = bonbuTeamMtsoList[index].teamId;
				teamNm = bonbuTeamMtsoList[index].teamNm;			
			}
			if(paramData.key == bonbuTeamMtsoList[index].bonbuId ) {
				bonbuId = bonbuTeamMtsoList[index].bonbuId;
				bonbuNm = bonbuTeamMtsoList[index].bonbuNm;		
			}
		}
		$('#bonbuNm').val(bonbuNm);
		$('#teamNm').val(teamNm);
		$('#topMtsoNm').val(mtsoNm);
		searchList();
	}
	
	
	
	//Grid 초기화
	function initGrid() {
		var columnMapping = [
			                     {key :  'lineNm',		align : 'left',			width:  '340px',			title : cflineMsgArray['lnNm']						/* 회선명 */ }
			                    , {key : 'svlnNo', 		align : 'center', 		width : '120px', 			title : cflineMsgArray['serviceLineNumber']			/* 서비스회선번호 */}
			                    , {key : 'leslNo', 		align : 'center', 		width : '120px', 			title : cflineMsgArray['exclusiveLineNumber']		/* 전용회선번호 */}
			                    , {key : 'commBizrNm',	align : 'center',		width : '120px',			title : cflineMsgArray['orderingOrganization']		/* 사업자 */}
			                    , {key : 'mgmtGrpNm', 	align : 'center', 		width : '120px', 			title : cflineMsgArray['managementGroup'] 			/* 관리그룹*/ }		
			                    , {key : 'svlnLclNm', 	align : 'center', 		width : '150px', 			title : cflineMsgArray['serviceLineLcl'] 			/* 서비스회선대분류 */}
			                    , {key : 'svlnSclNm', 	align : 'center', 		width : '150px', 			title : cflineMsgArray['serviceLineScl'] 			/* 서비스회선소분류 */}
			                    , {key : 'svlnTypNm', 	align : 'center', 		width : '200px', 			title : cflineMsgArray['serviceName'] 				/* 서비스명 */}
			                    , {key : 'lineCapaCdNm',align : 'center', 		width : '120px', 			title : cflineMsgArray['capacity']					/* 용량 */}
			                    , {key : 'svlnStatNm', 	align : 'center',		width : '120px', 			title : cflineMsgArray['lineStatus'] 				/* 회선상태 */}
			                    , {key : 'uprTeamNm', 	align : 'center', 		width : '160px', 			title : cflineMsgArray['upperTeam'] 				/* 상위팀 */}
			                    , {key : 'uprMtsoNm', 	align : 'center', 		width : '160px', 			title : cflineMsgArray['uprSmtso']					/* 상위국소 */}
			                    , {key : 'lowTeamNm', 	align : 'center', 		width : '160px', 			title : cflineMsgArray['lowerTeam']					/* 하위팀 */}
			                    , {key : 'lowMtsoNm', 	align : 'center', 		width : '160px', 			title : cflineMsgArray['lowSmtso']					/* 하위국소 */}
			                    , {key : 'mgmtPostCdNm',align : 'center', 		width : '200px', 			title : cflineMsgArray['postName']					/* 포스트명 */}
			                    , {key : 'chrStatNm', 	align : 'center', 		width : '120px', 			title : cflineMsgArray['chargingStatus']			/* 과금상태 */}
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
		var param = null;
		if(paramData.commBizrCd == "소계") {
			paramData.commBizrCd = null;
		}
	
		if(nullToEmpty(paramData.mtsoId) != "" ) {
			param = {
					"mgmtGrpCd" : paramData.mgmtGrpCd
					,"orgId" : bonbuId
					, "teamId" : teamId
					, "tmof" : paramData.mtsoId
			}				
		} else if(nullToEmpty(paramData.teamId) != "" ) {
			param = {
					"mgmtGrpCd" : paramData.mgmtGrpCd
					,"orgId" : bonbuId
					, "teamId" : paramData.teamId
					, "tmof" : mtsoId
			}					
		} else {
			param = {
					"mgmtGrpCd" : paramData.mgmtGrpCd
					,"orgId" : bonbuId
					, "teamId" : teamId
					, "tmof" : mtsoId
			}			
		}
	
		$.extend(param, {
			 "svlnLclCd" : paramData.svlnLclCd
			, "svlnSclCd" : paramData.svlnSclCd
			, "commBizrCd" : paramData.commBizrCd
			, "svlnTypCd" : paramData.svlnTypCd
			, "dualMtsoFlag" :paramData.dualMtsoFlag
			, "uprMtsoFlag" : paramData.uprMtsoFlag
			, "lowMtsoFlag" : paramData.lowMtsoFlag
		})
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linereport/getlinereportdetaillist', param, 'GET', 'getLineReportDetailList');
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
    	if(flag == 'getBonbuTeamMtsoList') {
    		bonbuTeamMtsoList = response.getBonbuTeamMtsoList;
    		setSelectCode();
		}
		if(flag == 'getLineReportDetailList') {
			cflineHideProgressBody();
			$('#'+gridId).alopexGrid("dataSet", response.getLineReportDetailList);
			$('#btnExportExcelPop').setEnabled(true);
		}
	}
	
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getLineReportDetailList'){
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
    		excelFileName : '회선현황상세_'+date,		
    		sheetList : [{
    			sheetName : '회선현황상세',
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