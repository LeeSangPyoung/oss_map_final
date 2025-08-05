$a.page( function() {

	var gridId = 'dataGrid';
	
	var bonbuDataSkt = [];		// SKT 본부데이터
	var teamDataSkt = [];		// SKT 팀데이터
	var mtsoDataSkt = [];		// SKT 전송실데이터
	
	var columnBonbu = columnMapping("bonbu");	//본부 조회 칼럼
	var columnTeam = columnMapping("team");		//팀 조회 칼럼
	var columnMtso = columnMapping("mtso");		//전송실 조회 칼럼
	
	var bonbuIdVal = '';	//팝업용 bonbuId
	var teamIdVal = '';	//팝업용 teamId
	var mtsoIdVal = '';	//팝업용 mtsoId

	tomfHeaderYn = "Y";

	this.init = function(id, param) {
		$('#btnExportExcel').setEnabled(false);
		
		var sDay = getTodayStr("-");
		$('#openPeriod').val(sDay);
		
		$(".yearSelect").hide();
		$(".monthSelect").hide();
		
		initGrid();
    	setSelectCode();
        setEventListener();
	};
	
	//Grid 초기화
	function initGrid(sType, headerVal) {
		
		var mapping = [
	                			{ key: 'svlnSclNm', 			align: 'center', 		width: '90px', 		title: cflineMsgArray['lineType']	/* 회선유형 */ }
	                			, { key: 'jobName', 			align: 'center', 		width: '80px', 		title: cflineMsgArray['kind']		/* 종류 */ }
	                			, { key: 'summarization', 			align: 'center', 		width: '50px', 		title: cflineMsgArray['summarization']		/* 합계 */ }
	                			, { key: 'transmissionOffice', 		align: 'center', 		width: '280px', 		title: cflineMsgArray['transmissionOffice']	/* 전송실 */ }
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
		       columnMapping: columnBonbu
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
		       columnMapping: columnTeam
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
		       columnMapping: columnMtso
			});
		}
	}
	
	//컬럼 구성
	function columnMapping(sType) {
			var mapping = [
			               			{ key: 'SVLN_SCL_NM', 			align: 'center', 		width: '200px', 	excludeFitWidth: true,		title: cflineMsgArray['lineType']	/* 회선유형 */}
			               			, { key: 'JOB_NAME', 			align: 'center', 		width: '150px', 		excludeFitWidth: true,		title: cflineMsgArray['kind']		/* 종류 */ }
			               		];
		
		return mapping;
	}
	
	//조회조건 세팅
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/opentaskreport/getSelectBonbuList', null, 'GET', 'bonbuDataSkt');
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/opentaskreport/getSelectTeamList', null, 'GET', 'teamDataSkt');
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/opentaskreport/getSelectMtsoList', null, 'GET', 'mtsoDataSkt');
	}
	
	function setEventListener() {
		//조회 선택시
		$('#btnSearch').on('click', function(e) {
			searchProc();
		});
		
		//상세팝업
		$('#' + gridId).on('click', '.bodycell', function(e) {
			openTaskPop(e);
		});

		//본부 선택시
		$('#bonbuId').on('change', function(e) {
			changeBonbu();
		});
		
		//팀 선택시
    	$('#teamId').on('change',function(e) {
    		changeTeam();
      	});
    	
    	//일별 선택시
    	$('#showDay').on('click', function(e) {
    		dateCondition();
    	});
    	
    	//주간 선택시
    	$('#showWeekly').on('click', function(e) {
    		dateCondition();
    	});
    	
    	//월별 선택시
    	$('#showMonthly').on('click',function(e) {
    		dateCondition("month");
      	});
    	
    	//엑셀버튼 선택시
    	$('#btnExportExcel').on('click', function(e) {
			excelDownload();
		});
	}
	
	//기간 조건 세팅
	function dateCondition(flag) {
		if(flag == "month") {
			$('.daterange').hide();
			$('.yearSelect').show();
			$(".monthSelect").show();
			
			var date = new Date();
    		var year = date.getFullYear();
    		var yearData = [];
    		var monthData = [];

    		for(y = 0; y < 10; y++) {
    			yearData.push({value: year ,text: year});
    			year -= 1;
    		}
    		
    		$('#inputYear').clear();
    		$('#inputYear').setData({data : yearData});
    		
    		for(d = 1; d <=12; d++) {
    			var textMonth = d;
    			
    			if(d < 10) {
    				d = "0" + d;
    			}
    			monthData.push({value: d, text: textMonth});
    		}
    		
    		$('#inputMonth').clear();
    		$('#inputMonth').setData({data : monthData});
		}
		else {
			$('.daterange').show();
    		$('.yearSelect').hide();
    		$(".monthSelect").hide();
		}
	}
	
	//조회 함수
	function searchProc() {
		var param = $("#searchForm").getData();
		var searchDate = null;
		
		param.showDay = $("input:radio[id='showDay']").is(":checked");
		param.showWeekly = $("input:radio[id='showWeekly']").is(":checked");
		param.showMonthly = $("input:radio[id='showMonthly']").is(":checked");
		param.showBonbu = $("input:radio[id='showBonbu']").is(":checked");
		param.showTeam = $("input:radio[id='showTeam']").is(":checked");
		param.showMtso = $("input:radio[id='showMtso']").is(":checked");
		
		if($("input:radio[id='showDay']").is(":checked") || $("input:radio[id='showWeekly']").is(":checked")) {
			searchDate = param.openPeriod.replace(/-/gi, '');
		}
		else if(param.showMonthly = $("input:radio[id='showMonthly']").is(":checked")) {
			searchDate = param.inputYear + param.inputMonth;
		}
		
		bonbuIdVal = param.bonbuId;
		teamIdVal = param.teamId;
		mtsoIdVal = param.mtsoId;
		
		var paramData = {
				"bonbuId" : param.bonbuId
				, "teamId" : param.teamId
				, "mtsoId" : param.mtsoId
				, "searchDate" : searchDate
				, "showDay" : param.showDay
				, "showWeekly" : param.showWeekly
				, "showMonthly" : param.showMonthly
				, "showBonbu" : param.showBonbu
				, "showTeam" : param.showTeam
				, "showMtso" : param.showMtso
		}

		if(searchDate == '') {
			alertBox('I', cflineMsgArray['checkPeriod']);		/* 기간은 필수 입력 입니다. */
		} else {
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/opentaskreport/getOpenTaskReportList', paramData, 'GET', 'searchList');
		}
	}
	
	//팝업
	function openTaskPop(e) {
		var evData=  AlopexGrid.parseEvent(e);
		var dataObj = AlopexGrid.parseEvent(e).data;
		var dataKey = dataObj._key;
		
		//접수건수일 때만 팝업
		if(dataKey.includes("CNT1")) {
			detailPop(evData);
		}
	}
	
	//상세팝업
	function detailPop(evData) {
		var dataObj = evData.data; 
		var param = $("#searchForm").getData();
		var searchDate = null;
		
		param.showDay = $("input:radio[id='showDay']").is(":checked");
		param.showWeekly = $("input:radio[id='showWeekly']").is(":checked");
		param.showMonthly = $("input:radio[id='showMonthly']").is(":checked");
		
		if($("input:radio[id='showDay']").is(":checked") || $("input:radio[id='showWeekly']").is(":checked")) {
			searchDate = param.openPeriod.replace(/-/gi, '');
		}
		else if(param.showMonthly = $("input:radio[id='showMonthly']").is(":checked")) {
			searchDate = param.inputYear + param.inputMonth;
		}
		
		//본부, 팀, 종류
		var popData = {
								"svlnSclCd" : dataObj.SVLN_SCL_CD
								, "jobTypeCd" : dataObj.JOB_TYPE_CD
								, "searchDate" : searchDate
								, "showDay" : param.showDay
								, "showWeekly" : param.showWeekly
								, "showMonthly" : param.showMonthly
		}
		
		var addData = getAddData(evData);
		$.extend(popData, addData);
		
		$a.popup({
			popid: "OpenTaskReportDetailPop",
			title:  cflineMsgArray['openTaskStat'] + " 상세조회",
			url: $('#ctx').val() + '/statistics/configmgmt/OpenTaskReportDetailPop.do',
			data: popData,
			iframe: true,
			modal: false,
			windowpopup: true,
			movable: true,
			width: 1400,
			height: 680,
			callback: function(data) {
				if(data != null) {
				}
				// 다른 팝업에 영향을 주지않기위해
				$.alopex.popup.result = null;
			}
		});
	}
	
	//헤더의 키값을 얻기 위한 함수
	function getAddData(evData) {
		var param = $("#searchForm").getData();
		var addData = {};
		
		param.showBonbu = $("input:radio[id='showBonbu']").is(":checked");
		param.showTeam = $("input:radio[id='showTeam']").is(":checked");
		param.showMtso = $("input:radio[id='showMtso']").is(":checked");
		
		var dataObj = evData.data;
		var dataKey = dataObj._key;
		
		if(param.showBonbu) {
			var bonbuId = null;
			bonbuId = dataKey;  
			bonbuId = bonbuId.replace(/CNT1_/i, '');
			addData = {"bonbuId" : bonbuId
							, "teamId" : teamIdVal
							, "mtsoId" : mtsoIdVal};
		}
		else if (param.showTeam) {  
			var teamId = null;
			teamId = dataKey;
			teamId = teamId.replace(/CNT1_/i, '');
			addData = {"teamId" : teamId
							, "bonbuId" : bonbuIdVal
							, "mtsoId" : mtsoIdVal};
		}
		else if (param.showMtso) {
			var mtsoId = null;
			mtsoId = dataKey;
			mtsoId = mtsoId.replace(/CNT1_/i, '');
			addData = {"mtsoId" : mtsoId
							, "bonbuId" : bonbuIdVal
							, "teamId" : teamIdVal};
		}
		return addData;
	}
	
	//request 성공시
	function successCallback(response, status, jqxhr, flag) {
		//조회
		if(flag == 'searchList') {
			renderGrid(gridId, response.result.headerList, response.result.keyList);
    		$('#'+gridId).alopexGrid('dataSet', response.result.openTaskList);
    		$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
		}
		
		//SKT 본부 리스트 조회
		if(flag == 'bonbuDataSkt') {
			setSearchDataBySKT(response, 'bonbuDataSkt');
		}
		
		//SKT 팀 리스트 조회
		if(flag == 'teamDataSkt') {
			setSearchDataBySKT(response, 'teamDataSkt');
		}
		
		//SKT 전송실 리스트 조회
		if(flag == 'mtsoDataSkt') {
			setSearchDataBySKT(response, 'mtsoDataSkt');
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
	
	//SKT 조회조건 세팅
	function setSearchDataBySKT(response, flag) {
		if(flag == 'bonbuDataSkt') {
			bonbuDataSkt.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});
			
			for(b = 0; b < response.bonbuList.length; b++) {
    			var bonbuList = response.bonbuList[b];
    			bonbuDataSkt.push(bonbuList);
    		}
    		
    		$('#bonbuId').clear();
    		$('#bonbuId').setData({data: bonbuDataSkt});
		} else if (flag == 'teamDataSkt') {
			teamDataSkt.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});
    		
    		for(t = 0; t < response.teamList.length; t++) {
    			var teamList = response.teamList[t];
    			teamDataSkt.push(teamList);
    		}
    		
    		$('#teamId').clear();
    		$('#teamId').setData({data: teamDataSkt});
		} else {
			mtsoDataSkt.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});

    		for(m = 0; m < response.mtsoList.length; m++) {
    			var mtsoList = response.mtsoList[m];
    			mtsoDataSkt.push(mtsoList);
    		}
    		
    		$('#mtsoId').clear();
    		$('#mtsoId').setData({data: mtsoDataSkt});
		}
	}
	
	//본부 선택시
	function changeBonbu() {
		var teamList = [];
		var mtsoList = [];
		
		if($('#bonbuId').val() == '' || $('#bonbuId').val() == null) {
			$('#teamId').setData({data: teamDataSkt});
			$('#mtsoId').setData({data: mtsoDataSkt});
		} else {
			teamList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			
			for(t = 0; t < teamDataSkt.length; t++){
				if($('#bonbuId').val() == teamDataSkt[t].bonbuId) {
					teamList.push(teamDataSkt[t]);
				}
				$('#teamId').clear();
				$('#teamId').setData({data: teamList});
			}
			
			for(m = 0; m < mtsoDataSkt.length; m++){
				if($('#bonbuId').val() == mtsoDataSkt[m].bonbuId) {
					mtsoList.push(mtsoDataSkt[m]);
				}
				$('#mtsoId').clear();
				$('#mtsoId').setData({data: mtsoList});
			}
		}
	}
	
	//팀 선택시
	function changeTeam() {
		var mtsoList = [];
		
		if($('#teamId').val() == '' || $('#teamId').val() == null) {
			if($('#bonbuId').val() == '' || $('#bonbuId').val() == null) {
				$('#mtsoId').setData({data: mtsoDataSkt});
			} else {
				mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
				
				for(m = 0; m < mtsoDataSkt.length; m++ ){
					if($('#bonbuId').val() == mtsoDataSkt[m].bonbuId) {
						mtsoList.push(mtsoDataSkt[m]);
					}
					$('#mtsoId').clear();
					$('#mtsoId').setData({data: mtsoList});
				}
			}
		} else {
			mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			
			for(m = 0 ; m < mtsoDataSkt.length; m++){
				if($('#teamId').val() == mtsoDataSkt[m].teamId) {
					mtsoList.push(mtsoDataSkt[m]);
				}
				$('#mtsoId').clear();
				$('#mtsoId').setData({data: mtsoList});
			}
		}
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
							if(val.title == "접수건수") {
								$.extend(val, {inlineStyle: {color: 'blue', cursor: 'pointer'}});
							}
							
							if(val.title != "적기개통율") {
								$.extend(val, {render: {type: 'string', rule : 'comma'}});
							}
							
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
							if(val.title == "접수건수") {
								$.extend(val, {inlineStyle: {color: 'blue', cursor: 'pointer'}});
							}
							
							if(val.title != "적기개통율") {
								$.extend(val, {render: {type: 'string', rule : 'comma'}});
							}
							
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
							if(val.title == "접수건수") {
								$.extend(val, {inlineStyle: {color: 'blue', cursor: 'pointer'}});
							}
							
							if(val.title != "적기개통율") {
								$.extend(val, {render: {type: 'string', rule : 'comma'}});
							}
							
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
			excelFileName : cflineMsgArray['openTaskStat'] + "_" + date,
			sheetList : [{
				sheetName : cflineMsgArray['openTaskStat'],
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