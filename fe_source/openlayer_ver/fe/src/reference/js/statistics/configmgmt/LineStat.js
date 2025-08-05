$a.page( function() {

	var gridId = 'dataGrid';
	var bonbuDataSkb = [];	// SKB 본부데이터
	var teamDataSkb = [];		// SKB 팀데이터
	var mtsoDataSkb = [];		// SKB 전송실데이터

	this.init = function(id, param) {
		$('#btnExportExcel').setEnabled(false);
		
		tomfHeaderYn = "Y";
		
		initGrid();
    	setSelectCode();
        setEventListener();
	};
	
	//Grid 초기화
	function initGrid() {
		var columnMapping = [
			     { key : 'bonbuNm',			align:'left',			width:'150px',		title : cflineCommMsgArray['hdofc'],		rowspan: true		/* 본부 */ }
			     , { key : 'teamNm',			align:'left',			width:'150px',		title : cflineCommMsgArray['team'],		rowspan: true			/* 팀 */ }
			     , { key : 'mtsoNm',			align:'left',			width:'150px',		title : cflineMsgArray['transmissionOffice'],	rowspan: true	 /* 전송실 */ }
			     , { key : 'lineCnt',			align:'right',			width:'110px',		title : cflineMsgArray['lineCountTotal'],		render: {type:"string", rule : "comma"} /* 총회선수 */ }
			     
			     	// 회선 상태 구분	
			     , { key : 'ncomLineCnt',		align:'right',			width:'85px',		title : cflineMsgArray['notFinishLineCount']
			     		,	render: {type:"string", rule : "comma"},	inlineStyle: { cursor:'pointer', color: 'blue'} /* 미완료회선수 */ } 
			     , { key : 'comLineCnt',			align:'right',			width:'85px',		title : cflineMsgArray['finishLineCount'],		render: {type:"string", rule : "comma"} /* 완료회선수 */ }
			     , { key : 'workLineCnt',			align:'right',			width:'85px',		title : cflineMsgArray['workLineCount']
			     		,	render: {type:"string", rule : "comma"},	 inlineStyle: { cursor:'pointer', color: 'blue'} /* 작업회선수 */ }
			     
			     	// 임차 구분
			     , { key : 'skbLeaseCnt',		align:'right',			width:'85px',		title : cflineMsgArray['skBroadBand'],		render: {type:"string", rule : "comma"} /* SKB */ } 
			     , { key : 'cjhLeaseCnt',			align:'right',			width:'85px',		title : cflineMsgArray['cjHello'],				render: {type:"string", rule : "comma"} /* cj헬로비전 */ }
			     , { key : 'etcLeaseCnt',		align:'right',			width:'85px',		title : cflineMsgArray['etc'],					render: {type:"string", rule : "comma"} /* 기타 */ }
			     
			     	// 서비스 구분
			     , { key : 'sL0016Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['nisATMService'],						render: {type:"string", rule : "comma"} /* (NIS)ATM서비스 */ } 
			     , { key : 'sP0034Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['diddodTrunkLine'],					render: {type:"string", rule : "comma"} /* DID/DOD겸용중계선 */ }
			     , { key : 'sP0049Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['diddodTrunkLine'] + "(SSW)",		render: {type:"string", rule : "comma"} /* DID/DOD겸용중계선(SSW) */ }
			     , { key : 'sP0036Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['didTrunkLine'],						render: {type:"string", rule : "comma"} /* DID중계선 */ } 
			     , { key : 'sP0048Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['didTrunkLine'] + "(SSW)",			render: {type:"string", rule : "comma"} /* DID중계선(SSW) */ }
			     , { key : 'sP0040Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['dodTrunkLine'],						render: {type:"string", rule : "comma"} /* DOD중계선 */ }
			     , { key : 'sP0047Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['dodTrunkLine'] + "(SSW)",			render: {type:"string", rule : "comma"} /* DOD중계선(SSW) */ }
			     , { key : 'sP0010Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['isdnPRI'],								render: {type:"string", rule : "comma"} /* ISDN-PRI */ }
			     , { key : 'sL0008Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['intranet'],								render: {type:"string", rule : "comma"} /* Intranet */ }
			     , { key : 'sL0010Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['nationalICS'] + "_IP-VPN",			render: {type:"string", rule : "comma"} /* 국가정보통신서비스_IP-VPN */ } 
			     , { key : 'sL0009Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['nationalICS'] + "_인터넷",			render: {type:"string", rule : "comma"} /* 국가정보통신서비스_인터넷 */ }
			     , { key : 'sL0012Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['internationalInternetDirect'],		render: {type:"string", rule : "comma"} /* 국제인터넷다이렉트 */ }
			     , { key : 'sL0003Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['internationalExclusiveLine'],		render: {type:"string", rule : "comma"} /* 국제전용회선(IPLC) */ } 
			     , { key : 'sL0006Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['ethernetExclusiveLine'],			render: {type:"string", rule : "comma"} /* 이더넷전용회선 */ }
			     , { key : 'sL0014Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['internetDirect'],						render: {type:"string", rule : "comma"} /* 인터넷다이렉트 */ }
			     , { key : 'sL0001Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['exclusiveLine'],						render: {type:"string", rule : "comma"} /* 전용회선 */ }
			     , { key : 'sH0011Cnt',			align:'right',			width:'85px',		title : cflineMsgArray['FTTx'],									render: {type:"string", rule : "comma"} /* 프리밴(FTTx) */ }
			     , { key : 's000Cnt',				align:'right',			width:'85px',		title : cflineMsgArray['unknowability'],						render: {type:"string", rule : "comma"} /* 알수없음 */ }
		     ]
		
		//Grid 생성
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: true,
			cellSelectable : true,
			rowInlineEdit : false,
			numberingColumnFromZero : false,
			height : 550,
			headerGroup : [
			               { fromIndex : 4, toIndex : 6, title : cflineMsgArray['lineStatus'] + "구분" /* 회선상태구분 */ }
			               , { fromIndex : 7, toIndex : 9, title : cflineMsgArray['rentDivision']	/* 임차구분 */ }
			               , { fromIndex : 10, toIndex : 27, title : cflineMsgArray['serviceDivision']	/* 서비스구분 */ }
	       ],
	       message : {
	    	   nodata : "<div class = 'no_data'><i class = 'fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],	/* '조회된 데이터가 없습니다.' */
			   filterNodata : 'No data'
	       },
	       columnMapping : columnMapping,
	       grouping: {
							  by: ['bonbuNm', 'teamNm', 'mtsoNm'],
							  useGrouping: true,
							  useGroupRowspan: true
	       }
		});
	};
	
	//조회조건 세팅
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/linestat/getSelectBonbuList', null, 'GET', 'bonbuDataSkb');
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/linestat/getSelectTeamList', null, 'GET', 'teamDataSkb');
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/linestat/getSelectMtsoList', null, 'GET', 'mtsoDataSkb');
	}
	
	function setEventListener() {
		//본부 선택시
		$('#bonbuId').on('change', function(e) {
			changeBonbu();
		});
		
		//팀 선택시
    	$('#teamId').on('change',function(e){
    		changeTeam();
    	});
		
		//조회
		$('#btnSearch').on('click', function(e) {
			searchProc();
		});
		
		// 회선현황통계 상세팝업
		$('#' + gridId).on('click', '.bodycell', function(e) {
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataKey = dataObj._key;
			
			if(dataKey == "ncomLineCnt" || dataKey == "workLineCnt") {
				detailPop(dataObj);
			}
		});
		
		//엑셀다운로드
		$('#btnExportExcel').on('click', function(e) {
			excelDownload();
		});		
	};
	
	// 조회 함수
	function searchProc(dataParam) {
		cflineShowProgressBody();
		var dataParam = $("#searchForm").getData();
		dataParam.openingDate = dataParam.openingDate.replace(/-/gi,'');
		
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/linestat/getLineStatList', dataParam, 'GET', 'searchList');
	}
	
	// 회선현황통계 상세팝업
	function detailPop(dataObj) {
		var gridData = dataObj;
		var dataKey = gridData._key;
		
		var popData = {
								"bonbuNm" : gridData.bonbuNm
								, "bonbuId" : gridData.bonbuId 
								, "teamNm" : gridData.teamNm
								, "teamId" : gridData.teamId
								, "mtsoNm" : gridData.mtsoNm
								, "mtsoId" : gridData.mtsoId
								, "dataKey" : dataKey
		}
		
		$a.popup({
			popid: "LineStatDtailPop",
			title: cflineMsgArray['lineStateStats'] + " 상세조회",
			url: $('#ctx').val() + '/statistics/configmgmt/LineStatDetailPop.do',
			data: popData,
			iframe: true,
			modal: false,
			windowpopup: true,
			movable: true,
			width: 1000,
			height: 500,
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
		// 링현황B 본부 세팅
    	if(flag == 'bonbuDataSkb') {
    		setSearchDataBySKB(response, 'bonbuDataSkb');
    	}
    	
    	// 링현황B 팀 세팅
    	if(flag == 'teamDataSkb') {
    		setSearchDataBySKB(response, 'teamDataSkb');
    	}
    	
    	// 링현황B 전송실 세팅
    	if(flag == 'mtsoDataSkb') {
    		setSearchDataBySKB(response, 'mtsoDataSkb');
    	}
    	
		if(flag == 'searchList') {
			$('#' + gridId).alopexGrid('dataSet', response.lineList);
			$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
		}
	}
	
	//request 실패시
	function failCallback(response, status, flag) {
		if(flag == 'selectLineList') {
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
	
	//조회조건 세팅
	function setSearchDataBySKB(response, flag) {
		if(flag == 'bonbuDataSkb'){
			bonbuDataSkb.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});
    		
    		for(b = 0; b < response.bonbuList.length; b++) {
    			var bonbuList = response.bonbuList[b];
    			bonbuDataSkb.push(bonbuList);
    		}
    		
    		$('#bonbuId').clear();
    		$('#bonbuId').setData({data: bonbuDataSkb});
		} else if (flag == 'teamDataSkb') {
			teamDataSkb.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});
    		
    		for(t = 0; t < response.teamList.length; t++) {
    			var teamList = response.teamList[t];
    			teamDataSkb.push(teamList);
    		}
    		
    		$('#teamId').clear();
    		$('#teamId').setData({data: teamDataSkb});
		} else {
			mtsoDataSkb.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});

    		for(m = 0; m < response.mtsoList.length; m++) {
    			var mtsoList = response.mtsoList[m];
    			mtsoDataSkb.push(mtsoList);
    		}
    		
    		$('#mtsoId').clear();
    		$('#mtsoId').setData({data: mtsoDataSkb});
		}
	}
	
	//본부 선택시
	function changeBonbu() {
		var teamList = [];
		var mtsoList = [];
		
		if($('#bonbuId').val() == '' || $('#bonbuId').val() == null) {
			$('#teamId').setData({data: teamDataSkb});
			$('#mtsoId').setData({data: mtsoDataSkb});
		} else {
			teamList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			
			for(t = 0; t < teamDataSkb.length; t++){
				if($('#bonbuId').val() == teamDataSkb[t].bonbuId) {
					teamList.push(teamDataSkb[t]);
				}
				$('#teamId').clear();
				$('#teamId').setData({data: teamList});
			}
			
			for(m = 0; m < mtsoDataSkb.length; m++){
				if($('#bonbuId').val() == mtsoDataSkb[m].bonbuId) {
					mtsoList.push(mtsoDataSkb[m]);
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
				$('#mtsoId').setData({data: mtsoDataSkb});
			} else {
				mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
				
				for(m = 0; m < mtsoDataSkb.length; m++ ){
					if($('#bonbuId').val() == mtsoDataSkb[m].bonbuId) {
						mtsoList.push(mtsoDataSkb[m]);
					}
					$('#mtsoId').clear();
					$('#mtsoId').setData({data: mtsoList});
				}
			}
		} else {
			mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			
			for(m = 0 ; m < mtsoDataSkb.length; m++){
				if($('#teamId').val() == mtsoDataSkb[m].teamId) {
					mtsoList.push(mtsoDataSkb[m]);
				}
				$('#mtsoId').clear();
				$('#mtsoId').setData({data: mtsoList});
			}
		}
	}
	
	//엑셀다운로드
	function excelDownload() {
		cflineShowProgressBody();
		
		var date = getCurrDate();
		var worker = new ExcelWorker({
			excelFileName : cflineMsgArray['lineStateStats'] + "_" + date,
			sheetList : [{
				sheetName : cflineMsgArray['lineStateStats'] + "_" + date,
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