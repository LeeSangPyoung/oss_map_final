var tBonbuList_data = [];
var tTeamList_data = [];
var tMtsoList_data = [];
var whole = cflineCommMsgArray['all'] /* 전체 */;
var bonbuId = null;
var teamId = null;
var mtsoId = null;

var showBonbu = null;
var showTeam = null;
var showMtso = null;
$a.page( function() {
	var gridId = 'dataGrid';
	var columnBonbu = columnMapping("bonbu");	//본부 조회 칼럼
	var columnTeam = columnMapping("team");		//팀 조회 칼럼
	var columnMtso = columnMapping("mtso");		//전송실 조회 칼럼

	this.init = function(id, param) {
		$('#btnExportExcel').setEnabled(false);
		
		initGrid();
    	setSelectCode();
        setEventListener();
	};
	
	//Grid 초기화
	function initGrid(sType, headerVal) {
		
		var mapping = [
	                			{ key: 'GUBUN', 			align: 'center', 		width: '50px', 		title: cflineMsgArray['itm']	/* 항목 */ }
	                			, { key: 'SVLN_SCL_NM', 			align: 'center', 		width: '50px', 		title: cflineMsgArray['lineType'],	/* 회선유형 */ 
		      						inlineStyle : function(value,data) {
		      							if(data.SVLN_SCL_NM == "합계"  && data.SVLN_SCL_NM != undefined ) {
		    	  							return {color: 'red'};
		      							}
		      						}
	                			}
	                			, { key: 'GUBUN2', 			align: 'center', 		width: '50px', 		title: cflineMsgArray['dts'],	 	/* 내역 */ 
		      						inlineStyle : function(value,data) {
		      							if(data.SVLN_SCL_NM == "합계"  && data.SVLN_SCL_NM != undefined ) {
		    	  							return {color: 'red'};
		      							}
		      						}
	                			}
	                			, { key: 'transmissionOffice', 		align: 'center', 		width: '200px', 		title: cflineMsgArray['transmissionOffice']	/* 전송실 */}
	               ];
		
	

		//Grid 생성
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: true,
			cellSelectable : true,
			rowInlineEdit : false,
			numberingColumnFromZero : false,
			height : 450,
			headerGroup : [
			               			{ fromIndex: 'transmissionOffice', toIndex: 'transmissionOffice', title: cflineMsgArray['headOffice']		 /* 본부 */ }
	       ],
	       message : {
	    	   nodata : "<div class = 'no_data'><i class = 'fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],	/* '조회된 데이터가 없습니다.' */
			   filterNodata : 'No data'
	       },
	       columnMapping : mapping
		});
		
		/**
		 * 일치성총괄현황 - 본부
		 */
		if(sType == "bonbu") {
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: null});
			
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				fitTableWidth: true,
				disableTextSelection: true,
				cellSelectable : true,
				rowInlineEdit : false,
				numberingColumnFromZero : false,
				height : 450,
				message : {
		    	   nodata : "<div class = 'no_data'><i class = 'fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],	/* '조회된 데이터가 없습니다.' */
				   filterNodata : 'No data'
				},
				columnMapping: columnBonbu,
				grouping: {
								  by: ['GUBUN', 'SVLN_SCL_NM'],
								  useGrouping: true,
								  useGroupRowspan: true
				}
			});
		}
		/**
		 * 일치성총괄현황 - 팀
		 */
		else if(sType == "team") {
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal});
			
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				fitTableWidth: true,
				disableTextSelection: true,
				cellSelectable : true,
				rowInlineEdit : false,
				numberingColumnFromZero : false,
				height : 450,
				message : {
		    	   nodata : "<div class = 'no_data'><i class = 'fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],	/* '조회된 데이터가 없습니다.' */
				   filterNodata : 'No data'
					   
		       },
		       columnMapping: columnTeam,
		       grouping: {
								  by: ['GUBUN', 'SVLN_SCL_NM'],
								  useGrouping: true,
								  useGroupRowspan: true
				}
			});
		}
		/**
		 * 일치성총괄현황 - 전송실
		 */
		if(sType == "mtso") {
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal});
			
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				fitTableWidth: true,
				disableTextSelection: true,
				cellSelectable : true,
				rowInlineEdit : false,
				numberingColumnFromZero : false,
				height : 450,
				message : {
		    	   nodata : "<div class = 'no_data'><i class = 'fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],	/* '조회된 데이터가 없습니다.' */
				   filterNodata : 'No data'
		       },
		       columnMapping: columnMtso,
		       grouping: {
								  by: ['GUBUN', 'SVLN_SCL_NM'],
								  useGrouping: true,
								  useGroupRowspan: true
				}
			});
		}
	}
	
	//컬럼 구성
	function columnMapping(sType) {
			var mapping = [
			               			  { key: 'GUBUN', 			align: 'center', 		width: '180px',		excludeFitWidth: true,		rowspan: true, 		title: cflineMsgArray['itm']	/* 항목 */ }
			               			, { key: 'SVLN_SCL_NM', 		align: 'center', 		width: '150px',		excludeFitWidth: true,		rowspan: true, 		title: cflineMsgArray['lineType'],	/* 회선유형 */
			      						inlineStyle : function(value,data) {
			      							if(data.SVLN_SCL_NM == "합계"  && data.SVLN_SCL_NM != undefined ) {
			    	  							return {color: 'red'};
			      							}
			      						}
			               			}
			               			, { key: 'GUBUN2', 			align: 'center', 		width: '130px',		excludeFitWidth: true, 		title: cflineMsgArray['dts']	,	/* 내역 */ 
			      						inlineStyle : function(value,data) {
			      							if(data.SVLN_SCL_NM == "합계"  && data.SVLN_SCL_NM != undefined ) {
			    	  							return {color: 'red'};
			      							}
			      						}
			               			}
	               ];
		
		return mapping;
	}
	
	//조회조건 세팅
	function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/tiesamereport/getsktbonbu', null, 'GET', 'getSKTBonBu');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/tiesamereport/getsktteam', null, 'GET', 'getSKTTeam');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/tiesamereport/getsktmtso', null, 'GET', 'getSKTMtso');
	}
	
	function setEventListener() {
		//조회 선택시
		$('#btnSearch').on('click', function(e) {
			bonbuId = $('#orgCd').val();
			teamId = $('#teamCd').val();
			mtsoId = $('#topMtsoCd').val();
			showBonbu = $("input:radio[id='showBonbu']").is(":checked");
			showTeam = $("input:radio[id='showTeam']").is(":checked");
			showMtso = $("input:radio[id='showMtso']").is(":checked");
			searchProc();
		});
		
    	//엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
	       	cflineShowProgressBody();
	       	excelDownload();
        });
		
		//상세팝업
		$('#' + gridId).on('click', '.bodycell', function(e) {
			samePop(e);
		});
		
		//본부선택시
		$('#orgCd').on('change',function(e){
			var tTeamList =  [];
			var tMtsoList =  [];
			if($('#orgCd').val() == null || $('#orgCd').val() == 'null' || $('#orgCd').val() == '' ) {
				$('#teamCd').setData({data : tTeamList_data});
				$('#topMtsoCd').setData({data : tMtsoList_data});
			}
			else {
				for( i=0 ; i<tTeamList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tTeamList.push(dataFst);
					}
					if(tTeamList_data[i].uprOrgId == $('#orgCd').val()){
						tTeamList.push(tTeamList_data[i]);	
					}
				}
				$('#teamCd').setData({data : tTeamList});
				for( i=0 ; i<tMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tMtsoList.push(dataFst);
					}
					if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
						tMtsoList.push(tMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : tMtsoList});
			}
      	}); 
		
		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		var tMtsoList =  [];
    		if($('#teamCd').val() == null || $('#teamCd').val() == 'null' || $('#teamCd').val() == '' ) {
    			if($('#orgCd').val() == null || $('#orgCd').val() == 'null' || $('#orgCd').val() == '' ) {
    				$('#topMtsoCd').setData({data : tMtsoList_data});
    			} else {
    				for( i=0 ; i<tMtsoList_data.length; i++) {
    					if(i==0){
    						var dataFst = {"uprComCd":"","value":"","text":whole};
    						tMtsoList.push(dataFst);
    					}
    					if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
    						tMtsoList.push(tMtsoList_data[i]);	
    					}
    				}
    				$('#topMtsoCd').setData({data : tMtsoList});
    			}
			} else {
				for( i=0 ; i<tMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tMtsoList.push(dataFst);
					}
					if(tMtsoList_data[i].teamCd == $('#teamCd').val()){
						tMtsoList.push(tMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : tMtsoList});
			}
      	});
	}
	
	//조회 함수
	function searchProc() {
		cflineShowProgressBody();

		var param = $("#searchForm").getData();
		param.showBonbu = $("input:radio[id='showBonbu']").is(":checked");
		param.showTeam = $("input:radio[id='showTeam']").is(":checked");
		param.showMtso = $("input:radio[id='showMtso']").is(":checked");
		
		var paramData = {
				 "bonbuId" : param.orgCd
				, "teamId" : param.teamCd
				, "mtsoId" : param.topMtsoCd
				, "showBonbu" : param.showBonbu
				, "showTeam" : param.showTeam
				, "showMtso" : param.showMtso
		}
		
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/samereport/getSameReportList', paramData, 'GET', 'getSameReportList');
	}
	
	//팝업
	function samePop(e) {
		var dataObj = AlopexGrid.parseEvent(e).data;
		var dataKey = dataObj._key;
		var eventCellVal = parseInt(AlopexGrid.currentValue(dataObj,  dataKey));

		if(dataObj.GUBUN2 == "불일치" && eventCellVal >= 1 ) {
			detailPop(dataObj);
		}
	}
	
	//상세팝업if(
	function detailPop(dataObj) {
		var popData = {
								  "sclCd"  : dataObj.SVLN_SCL_CD
								, "sclNm"  : dataObj.SVLN_SCL_NM
								, "gubun"  : dataObj.GUBUN
								, "key"     : dataObj._key
								, "bonbuId"     : bonbuId
								, "teamId"     : teamId
								, "mtsoId"     : mtsoId
								, "showBonbu"  : showBonbu
								, "showTeam"    : showTeam
								, "showMtso"    : showMtso
		}
		
		$a.popup({
			popid: "SameReportDetailPop",
			title: cflineMsgArray['lineStateStats'] + " 상세조회",
			url: $('#ctx').val() + '/statistics/configmgmt/SameReportDetailPop.do',
			data: popData,
			iframe: true,
			modal: false,
			windowpopup: true,
			movable: true,
			width: 1200,
			height: 650,
			callback: function(data) {
				if(data != null) {
				}
				// 다른 팝업에 영향을 주지않기위해
				$.alopex.popup.result = null;
			}
		});
	}
	
	//request 성공시
	function successCallback(response, status, jqxhr, flag) {
    	//조회
		if(flag == 'getSameReportList') {
			renderGrid(gridId, response.result.headerList, response.result.keyList);
    		$('#'+gridId).alopexGrid('dataSet', response.result.getSameReportList);
			$('#btnExportExcel').setEnabled(true);	
    		cflineHideProgressBody();
		}
		// T본부 셋팅
		if(flag == 'getSKTBonBu') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tBonbuList_data =  [];
			for(i=0; i<response.bonbulist.length; i++){
				var dataL = response.bonbulist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tBonbuList_data.push(dataFst);
				}
				tBonbuList_data.push(dataL);
			}
			$('#orgCd').clear();
			$('#orgCd').setData({data : tBonbuList_data});
		}
		//T팀 셋팅
		if(flag == 'getSKTTeam') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tTeamList_data =  [];
			for(i=0; i<response.teamlist.length; i++){
				var dataL = response.teamlist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tTeamList_data.push(dataFst);
				}
				tTeamList_data.push(dataL);
				
			}
			$('#teamCd').setData({data : tTeamList_data});

		}
		//T전송실 셋팅
		if(flag == 'getSKTMtso') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tMtsoList_data =  [];
			if(response.mtsolist.length == 0 ) {
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList_data.push(dataFst);
			}
			for(i=0; i<response.mtsolist.length; i++){
				var dataL = response.mtsolist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tMtsoList_data.push(dataFst);
				}
				tMtsoList_data.push(dataL);
				
			}
			$('#topMtsoCd').setData({data : tMtsoList_data});
		}
	}
	
	//request 실패시
	function failCallback(response, status, flag) {
		if(flag == 'searchList') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
	}
	
	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url : Url,		//URL기존처럼 사용
			data : Param,		//data가 존재할 경우 주입
			method : Method, 		//HTTP Method
			flag : Flag
		}).done(successCallback)
			.fail(failCallback);
	}
	
	//그리드 랜더링
	function renderGrid(gridDiv, addHeader, addColumn) {
		var headerDiv = addHeader;
		var columnDiv = "";

		//조회조건에 따른 그리드 구성
		if(gridDiv == gridId) {
			//칼럼 구성
			if(addColumn != null) {
				//본부 조회
				if($("input:radio[id='showBonbu']").is(":checked")) {
					columnBonbu = columnMapping("bonbu");
					
					if(addColumn != null) {
						$.each(addColumn, function(key, val) {
							$.extend(val, {
								"inlineStyle" : function(value,data) {
									if(data.GUBUN2 == "불일치" && data.GUBUN2 != undefined ) {
										if(value != 0 ) {
											return {color: 'blue' , cursor : 'pointer'};	
										}
									} 
									if(data.SVLN_SCL_NM == "합계" && data.SVLN_SCL_NM != undefined ) {
										return {color: 'red'};
									}
								}
							});
							$.extend(val, {"render" : {type: 'string', rule : 'comma'}});
							columnBonbu.push(val);
						})
					}
					columnDiv = "bonbu";
				}
				//팀 조회
				else if($("input:radio[id='showTeam']").is(":checked")) {
					columnTeam = columnMapping("team");
					
					if(addColumn !=  null) {
						$.each(addColumn, function(key, val) {
							$.extend(val, {
								"inlineStyle" : function(value,data) {
									if(data.GUBUN2 == "불일치" && data.GUBUN2 != undefined ) {
										if(value != 0 ) {
											return {color: 'blue' , cursor : 'pointer'};	
										}
									} 
									if(data.SVLN_SCL_NM == "합계" && data.SVLN_SCL_NM != undefined ) {
										return {color: 'red'};
									}
								}
							});
							$.extend(val, {"render" : {type: 'string', rule : 'comma'}});
							columnTeam.push(val);
						})
					}
					columnDiv = "team";
				}
				//전송실 조회
				else if($("input:radio[id='showMtso']").is(":checked")) {
					columnMtso = columnMapping("mtso");
					
					if(addColumn != null) {
						$.each(addColumn, function(key, val) {
							$.extend(val, {
								"inlineStyle" : function(value,data) {
									if(data.GUBUN2 == "불일치" && data.GUBUN2 != undefined ) {
										if(value != 0 ) {
											return {color: 'blue' , cursor : 'pointer'};	
										}
									}
									if(data.SVLN_SCL_NM == "합계" && data.SVLN_SCL_NM != undefined ) {
										return {color: 'red'};
									}
								}
							});
							$.extend(val, {"render" : {type: 'string', rule : 'comma'}});
							columnMtso.push(val);
						})
					}
					columnDiv = "mtso";
				} else {
					headerDiv = "";
					columnDiv = "";
				}
			}
		}
	
		initGrid(columnDiv, headerDiv);
	}
	
	//엑셀다운로드
	function excelDownload() {
		cflineShowProgressBody();
		
		var date = getCurrDate();
		var worker = new ExcelWorker({
			excelFileName : "일치성총괄통계_" + date,
			sheetList : [{
				sheetName :  "일치성총괄통계",
				placement : 'vertical',
				$grid : $('#' + gridId)
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