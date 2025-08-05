/**
*
*/
var gridId = 'gridIdPop';
var paramData = null;
var bonbuTeamMtsoList = []

var bonbuId = null;
var teamId = null;
var mtsoId = null;

var bonbuNm = null;
var teamNm = null;
var mtsoNm = null;
$a.page(function() {
	this.init = function(id, param) {
		paramData = param;
		$('#title').text("일치성총괄상세");
		setEventListener();
		initGrid();
		
		var mgmtGrpCd = {
				"mgmtGrpCd" : param.mgmtGrpCd
		};
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/samereport/getBonbuTeamMtsoList', mgmtGrpCd, 'GET', 'getBonbuTeamMtsoList');
		$('#lineType').val(param.sclNm);
		$('#itm').val(param.gubun);
		$('#btnExcelDownDetail').setEnabled(false);
		
	}
	
	//Grid 초기화
	function initGrid() {
		var mapping = [
		               			  { key: 'lineNm', 			align: 'left', 			width: '220px',		title: cflineMsgArray['lnNm']			/* 회선명 */ }
		               			, { key: 'svlnSclNm', 		align: 'center', 		width: '150px',		title: cflineMsgArray['lineType']		/* 회선유형 */ }
		               			, { key: 'svlnTypNm', 		align: 'center', 		width: '150px',		title: cflineMsgArray['serviceName']	/* 서비스명 */ }
		               			, { key: 'ogTie1', 			align: 'center', 		width: '180px',		title: "OG_" + cflineMsgArray['tie'],	/* OG_TIE */ 
			  						inlineStyle : function(value,data) {
			  							if(data.isOg == "NOK" && data.isOg != undefined ) {
			  								return {background: 'pink'};
			  							}
			  						}
		               			}
		               			, { key: 'icTie1', 			align: 'center', 		width: '180px',		title: "IC_" + cflineMsgArray['tie'],	/* IC_TIE */ 
			  						inlineStyle : function(value,data) {
			  							if(data.isIc == "NOK" && data.isIc != undefined ) {
			  								return {background: 'pink'};
			  							}
			  						}  	
		               			}
		               			, { key: 'uprMtsoNm', 		align: 'center', 		width: '150px',		title: cflineMsgArray['upperMtso']		/* 상위국사 */ }
		               			, { key: 'lowMtsoNm', 		align: 'center', 		width: '150px',		title: cflineMsgArray['lowerMtso']		/* 하위국사 */ }
		               			, { key: 'uprSystmNm', 		align: 'center', 		width: '150px',		title: cflineMsgArray['upperSystem']	/* 상위시스템 */ }
		               			, { key: 'lowSystmNm', 		align: 'center', 		width: '150px',		title: cflineMsgArray['lowSystem']		/* 하위시스템 */ }
		               ];
		//Grid 생성
		$('#'+gridId).alopexGrid({
				columnMapping : mapping,
		    	pager : true,
				rowInlineEdit : true,
				cellSelectable : true,
				autoColumnIndex: true,
				fitTableWidth: true,
				rowClickSelect : true,
				rowSingleSelect : true,
				numberingColumnFromZero : false,
				height : 380,
				message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
					filterNodata : 'No data'
				}
		});
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
		$('#bonbu').val(bonbuNm);
		$('#team').val(teamNm);
		$('#tmof').val(mtsoNm);
		searchList();
	}
	
	
	function setEventListener() {
		//엑셀다운로드
	    $('#btnExcelDownDetail').on('click', function(e) {
			cflineShowProgressBody();
	       	excelDownload();
	    });
	    
	    //닫기
	    $('#btnCnclPop').on('click', function(e) {
	       $a.close();
	    });
	}
	
	//request 성공시
    function successCallback(response, flag) {
    	if(flag == 'getSameReportDetailList') {
    		$('#' + gridId).alopexGrid('dataSet', response.getSameReportDetailList);
			$('#btnExcelDownDetail').setEnabled(true);
			cflineHideProgressBody();
		}
    	if(flag == 'getBonbuTeamMtsoList') {
    		bonbuTeamMtsoList = response.getBonbuTeamMtsoList;
    		setSelectCode();
		}
    	
    }
    
    //request 실패시.
    function failCallback(response, flag) {
    	if(flag == 'getSameReportDetailList') {
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
    
    function searchList() {
		cflineShowProgressBody();
		var param = null;
		
		if(nullToEmpty(paramData.mtsoId) != "" ) {
			param = {
					 "bonbu" : bonbuId
					, "team" : teamId
					, "tmof" : paramData.mtsoId
					, "sclCd" : paramData.sclCd
			}				
		} else if(nullToEmpty(paramData.teamId) != "" ) {
			param = {
					 "bonbu" : bonbuId
					, "team" : paramData.teamId
					, "tmof" : mtsoId
					, "sclCd" : paramData.sclCd
			}					
		} else {
			param = {
					 "bonbu" : bonbuId
					, "team" : teamId
					, "tmof" : mtsoId
					, "sclCd" : paramData.sclCd
			}				
		}
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/samereport/getSameReportDetailList', param, 'GET', 'getSameReportDetailList');
	}
    
    //엑셀다운로드
    function excelDownload() {
		var date = getTodayStr("-");
		var worker = new ExcelWorker({
     		excelFileName : "일치성총괄통계상세_" + date,
     		sheetList: [{
     			sheetName: "일치성총괄통계상세",	
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