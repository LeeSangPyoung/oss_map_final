/**
 * 
 */
$a.page(function() {
	var gridIdNtwk = 'resultGrid';
	var gridIdOrg = 'resultGridB';
	
	var columnBonbu = columnMapping("bonbu");	//링현황(망구분별) 본부 조회 칼럼
	var columnTeam = columnMapping("team");		//링현황(망구분별) 팀 조회 칼럼
	var columnMtso = columnMapping("mtso");		//링현황(망구분별) 전송실 조회 칼럼
	var mgmtGrpCdVal = ''; 	//링현황(망구분별) 팝업용 관리그룹
	var radioBtnVal = "M"; // 팝업용 라디오버튼 값 :  B = 본부, T = 팀, M = 전송실
	var bonbuCdVal = '';	//링현황(망구분별) 팝업용 bonbuId
	var teamCdVal = '';	//링현황(망구분별) 팝업용 teamId
	var mtsoCdVal = '';	//링현황 팝업용 mtsoId
	var mgmtGrpCd = '';
	
	var NtwkTypData = [];		// 망구분데이터  value:text
	var NtwkTypDataSkt = [];	// 망구분데이터 SKT  value:text
	var NtwkTypDataSkb = [];	// 망구분데이터 SKB value:text
	var mgmtGrpData = [];		// 관리구분데이터 C00188
	
	this.init = function(id, param) {			 
		$(".ringStatO").hide();
		
		var sDay = getTodayStr("-");
		//$('#standardDate').val(sDay);
 		
		tomfHeaderYn = "Y";
	
		setSelectCode();
		setEventListener();
		createGrid();

		$('#btnExportExcel').setEnabled(false);
	};
	
	//select 조회조건 세팅
	function setSelectCode() {
		createMgmtGrpSelectBox ("mgmtGrpCdNtwk", "N", "SKT");  // 링현황(망구분별) 관리 그룹 selectBox
		createMgmtGrpSelectBox ("mgmtGrpCdOrg", "N", "SKT");  // 링현황(조직별) 관리 그룹 selectBox

		setSearchCode("bonbuCdNtwk", "teamCdNtwk", "mtsoCdNtwk");	// 링현황(망구분별) 조회조건
		setSearchCode("bonbuCdOrg", "teamCdOrg", "mtsoCdOrg");			// 링현황(조직별) 조회조건
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', null, 'GET', 'NtwkTypData'); // 망구분 데이터
	}
	
	function setEventListener() {
		//탭 선택 이벤트
		$('#basicTabs').on('tabchange', function(e, index) {
			tabChange(index);
		});
		
		//조회 선택시
		$('#btnSearch').on('click', function(e) {
			searchProc();
		});
		
		// 링현황 상세팝업
		$('#' + gridIdNtwk).on('click', '.bodycell', function(e) {
			ringNPop(e);
		});
		
		// 링현황(조직별) 상세팝업
		$('#' + gridIdOrg).on('click', '.bodycell', function(e) {
			ringOPop(e);
		});
		
		//Excel 이벤트
		$('#btnExportExcel').on('click', function(e) {
			excelDownload();
		});
		
		//링현황(망구부별) 관리그룹 선택시
		$('#mgmtGrpCdNtwk').on('change', function(e) {
			changeMgmtGrp("mgmtGrpCdNtwk", "bonbuCdNtwk", "teamCdNtwk", "mtsoCdNtwk", "mtso");
			changeNtwkTyp();
		});
		
		//링현황(망구분별) 본부 선택시
		$('#bonbuCdNtwk').on('change', function(e) {
			changeHdofc("bonbuCdNtwk", "teamCdNtwk", "mtsoCdNtwk", "mtso");
		});
		
		//링현황(망구분별) 팀 선택시
    	$('#teamCdNtwk').on('change',function(e){
    		changeTeam("teamCdNtwk", "mtsoCdNtwk", "mtsoCd");
      	});
    	
    	//링현황(조직별) 관리그룹 선택시
		$('#mgmtGrpCdOrg').on('change', function(e) {
			changeMgmtGrp("mgmtGrpCdOrg", "bonbuCdOrg", "teamCdOrg", "mtsoCdOrg", "mtsoCd");
			changeNtwkTyp();
		});
    	
    	//링현황(조직별) 본부 선택시
		$('#bonbuCdOrg').on('change', function(e) {
			changeHdofc("bonbuCdOrg", "teamCdOrg", "mtsoCdOrg", "mtsoCd");
		});
		
		//링현황(조직별) 팀 선택시
    	$('#teamCdOrg').on('change',function(e){
    		changeTeam("teamCdOrg", "mtsoCdOrg", "mtsoCd");
    	});
	}
	
	function createGrid(sType, headerVal) {
		
		/**
		 * 링현황(망구분별)
		 */	
		var ringMapping =  [
							{ key: 'networkDivision', 			align: 'center', 		width: '50px', 		title: cflineMsgArray['networkDivision']	/* 망구분 */ }
							, { key: 'ntwkTopologyCd', 		align: 'center', 		width: '50px', 		title: cflineMsgArray['ntwkTopologyCd']	 /* 망종류 */ }
							, { key: 'summarization', 			align: 'right', 		width: '50px', 		title: cflineMsgArray['summarization'] /*합계 */ }
							, { key: 'transmissionOffice', 		align: 'center', 		width: '200px', 		title: cflineMsgArray['transmissionOffice']	/* 전송실 */}
	               ];
		
		$('#' + gridIdNtwk).alopexGrid({
			autoColumnIndex: true,
			autoResize: false,
			fitTableWidth: true,
			disableTextSelection: true,
		    cellSelectable : true,
		    rowInlineEdit : false,
		    numberingColumnFromZero : false,
		    height: 450,
		    message : {
		      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
		       	filterNodata: 'No data'
		    },
		    headerGroup : [
									{ fromIndex: 3, toIndex: 4, title: cflineMsgArray['headOffice']		/* 본부 */}
		                         ],
		    columnMapping: ringMapping
		});
		
		if(sType == "bonbu") {
			$('#'+gridIdNtwk).alopexGrid('updateOption', {headerGroup: null});
			
			/**
			 * 링현황(망구분별) -본부
			 */
			$('#' + gridIdNtwk).alopexGrid({
				autoColumnIndex: true,
				autoResize: false,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnBonbu,
			    grouping: {
					  by: ['NTWK_TYP_NM'],
					  useGrouping: true,
					  useGroupRowspan: true
			    }
			});
		} else if (sType == "team") {
			$('#'+gridIdNtwk).alopexGrid('updateOption', {headerGroup: headerVal});

			/**
			 * 링현황(망구분별) -팀
			 */
			$('#' + gridIdNtwk).alopexGrid({
				autoColumnIndex: true,
				autoResize: false,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnTeam,
			    grouping: {
					  by: ['NTWK_TYP_NM'],
					  useGrouping: true,
					  useGroupRowspan: true
			    }
			});
		} else if (sType == "mtso") {
			$('#'+gridIdNtwk).alopexGrid('updateOption', {headerGroup: headerVal});

			/**
			 * 링현황(망구분별) -전송실
			 */
			$('#' + gridIdNtwk).alopexGrid({
				autoColumnIndex: true,
				autoResize: false,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnMtso,
			    grouping: {
					  by: ['NTWK_TYP_NM'],
					  useGrouping: true,
					  useGroupRowspan: true
			    }
			});
		}
		
		/**
		 * 링현황(조직별) grid
		 */
		var ringSKBMapping = [
									{ key: 'bonbuNm', 			align: 'left',				width: '110px', 		title: cflineMsgArray['headOffice'],	rowspan: true	 /* 본부 */}
									, { key: 'teamNm', 			align: 'left',				width: '110px', 		title: cflineMsgArray['team'],	rowspan: true 	/* 팀 */}
									, { key: 'mtsoNm', 			align: 'left',				width: '110px', 		title: cflineMsgArray['transmissionOffice'],	rowspan: true 	/* 전송실 */}
									, { key: 'ringCnt', 			align: 'right',			width: '80px', 			title: cflineMsgArray['totalRingCnt'],  render: {type:"string", rule : "comma"} 	/* 총링수 */}											
									, { key: 'ncomRingCnt',		align: 'right',			width: '80px',			title: cflineMsgArray['notProgressingRingCnt'] /* 미진행 링 수 */
										, inlineStyle: { cursor:'pointer', color: 'blue' },	 render: {type:"string", rule : "comma"}}
									, { key: 'comRingCnt',		align: 'right',			width: '80px',			title: cflineMsgArray['finishRingCnt'],  render: {type:"string", rule : "comma"}	/* 완료 링 수 */}
									, { key: 'workRingCnt',		align: 'right',			width: '80px',			title: cflineMsgArray['workRingCount'] 	/* 작업 링 수 */
										, inlineStyle: {  cursor:'pointer', color: 'blue' },	 render: {type:"string", rule : "comma"}}
									, { key: 'ntwkTyp001Cnt',	align: 'right',			width: '80px',			title: cflineMsgArray['backboneNetworkRingCnt']	,	 render: {type:"string", rule : "comma"}	/* 기간망 링 수 */}
									, { key: 'ntwkTyp004Cnt',	align: 'right',			width: '80px',			title: cflineMsgArray['scrbrNetNtwkLineNoRingCnt'],	 render: {type:"string", rule : "comma"} 		/* 가입자망 링 수 */}
									, { key: 'ntwkTypEtcCnt',	align: 'right',			width: '80px',			title: cflineMsgArray['etcRingCnt'],	 render: {type:"string", rule : "comma"}		/* 기타 링 수 */}
							];

		//링현황(조직별) 그리드 생성
		$('#' + gridIdOrg).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: true,
			cellSelectable : true,
			rowInlineEdit : false,
			numberingColumnFromZero : false,
			height: 450,
			message : {
		  					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
		  					filterNodata: 'No data'
		  				},
		  	headerGroup : [
		                 			{ fromIndex: 4, 		toIndex: 6, 		title: cflineMsgArray['ringStatus']	+ " 구분"		/* 링상태 구분 */ }
		                 			, { fromIndex: 7, 		toIndex: 9, 		title: cflineMsgArray['net']	+ " 구분"		/* 망 구분 */ }
		                 ],
		    columnMapping: ringSKBMapping,
		    grouping: {
							  by: ['bonbuNm', 'teamNm', 'mtsoNm'],
							  useGrouping: true,
							  useGroupRowspan: true
		    }
		});
	}
	
	var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
	
	function successCallback(response, status, jqxhr, flag) {
		// 관리그룹데이터세팅
    	if(flag == 'mgmtGrpData') {
    		mgmtGrpData = response;
    	}
    	
    	//링현황(망구분별) 조회
    	if(flag == 'searchListNtwk') { 
    		renderGrid(gridIdNtwk, response.result.headerList, response.result.keyList);
    		$('#'+gridIdNtwk).alopexGrid('dataSet', response.result.ringList);
    		$('#btnExportExcel').setEnabled(true);
    		cflineHideProgressBody();
    	}
    	
    	//링현황(조직별) 조회
    	if(flag == 'searchListOrg') {
    		$('#'+gridIdOrg).alopexGrid('dataSet', response.result);
    		$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
    	}

    	// 망구분데이터세팅
    	if(flag == 'NtwkTypData') {
    		setNtwkTypData(response);
    	}
	}
	
	function failCallback(response, status, jqxhr, flag) {
		if(flag == 'searchListNtwk') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
		
		if(flag == 'searchListOrg') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
	}
	
	//컬럼 구성
	function columnMapping(sType) {		
		var mapping = [
								{ key: 'NTWK_TYP_NM', 			align: 'center', 		width: '220px', 		excludeFitWidth: true,		title: cflineMsgArray['networkDivision'],		rowspan: true		/* 망구분 */ }
								, { key: 'TOPO_SCL_NM', 		align: 'center', 		width: '190px', 		excludeFitWidth: true,		title: cflineMsgArray['ntwkTopologyCd']		 /* 망종류 */ }
								, { key: 'TOTALCNT', 			align: 'right', 			width: '180px', 		excludeFitWidth: true,		title: cflineMsgArray['summarization'] /*합계 */ }
		               ];
		
		return mapping;
	}
	
	//그리드 랜더링
	function renderGrid(gridDiv, addHeader, addColumn) {
		var headerDiv = addHeader;
		var columnDiv = "";

		//조회조건에 따른 그리드 구성
		if(gridDiv == gridIdNtwk) {
			//칼럼 구성
			if(addColumn != null) {
				//본부 조회
				if($("input:radio[id='showBonbu']").is(":checked")) {
					columnBonbu = columnMapping("bonbu");
					
					if(addColumn != null) {
						$.each(addColumn, function(key, val) {
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
	
		createGrid(columnDiv, headerDiv);
	}
	
	//망구분데이터 세팅
	function setNtwkTypData(response) {
		NtwkTypData.push({value: "",text: cflineCommMsgArray['all']/*전체*/});
		NtwkTypDataSkt.push({value: "",text: cflineCommMsgArray['all']/*전체*/});
		NtwkTypDataSkb.push({value: "",text: cflineCommMsgArray['all']/*전체*/});
		
		for(n = 0; n < response.NtwkTypData.length; n++) {
			
			NtwkTypData.push({ value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			
			// 전체에 속하는경우
			if (response.NtwkTypData[n].cdMgmtGrpVal == 'ALL') {
				NtwkTypDataSkt.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
				NtwkTypDataSkb.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			} 
			else if (response.NtwkTypData[n].cdMgmtGrpVal == 'SKT') {
				NtwkTypDataSkt.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			} 
			else if (response.NtwkTypData[n].cdMgmtGrpVal == 'SKB') {
				NtwkTypDataSkb.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			} 
		}

		var viewMgmtGrpCd = $('#mgmtGrpCdNtwk').val() == null ? '' : $('#mgmtGrpCdNtwk').val();
		var comboNtwkTypData = [];
		if (viewMgmtGrpCd == ''){
			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypData);
		} 
		else if (viewMgmtGrpCd == '0001') {
			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkt);
		} 
		else if (viewMgmtGrpCd == '0002') {
			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkb);
		}

		$('#ntwkTypCd').clear();			
		$('#ntwkTypCd').setData({data : comboNtwkTypData});
	}
	
	//링현황(망구분별) 팝업
	function ringNPop(e) {
		var evData=  AlopexGrid.parseEvent(e);
		var dataObj = AlopexGrid.parseEvent(e).data;
		var dataKey = dataObj._key;
		var data = $('#' + gridIdNtwk).alopexGrid('dataGet', {_state: {selected: true}});
		var eventCellVal = parseInt( AlopexGrid.currentValue(dataObj,  dataKey) );
		if(dataKey == "NTWK_TYP_NM" || dataKey == "TOPO_SCL_NM" || eventCellVal < 1) {
			return false;
		} else {
			detailPop(evData);
		}
	}
	
	//링현황(조직별) 팝업
	function ringOPop(e) {
		var dataObj = AlopexGrid.parseEvent(e).data;
		var dataKey = dataObj._key;		//grid에서 선택된 칼럼의 키값 저장
		
		if(dataKey == "ncomRingCnt" || dataKey == "workRingCnt") {
			detailBPop(dataObj);
		}
	}
	
	//조회 함수
	function searchProc() {
		var selectTab = parseInt($('#basicTabs').getCurrentTabIndex());
		var param =  $("#searchForm").getData();
		
		bonbuCdVal = param.bonbuCdNtwk;
		teamCdVal = param.teamCdNtwk;
		mtsoCdVal = param.mtsoCdNtwk;
		
		cflineShowProgressBody();
		
		if(selectTab == 0) {
			
			mgmtGrpCdVal =  $('#mgmtGrpCdNtwk').val();
			if( $("input:radio[id='showBonbu']").is(":checked") ) {
				radioBtnVal = "B";
			} else if( $("input:radio[id='showTeam']").is(":checked") ) {
				radioBtnVal = "T";
			} else {
				radioBtnVal = "M";
			}
			param.showBonbu = $("input:radio[id='showBonbu']").is(":checked");
			param.showTeam = $("input:radio[id='showTeam']").is(":checked");
			param.showMtso = $("input:radio[id='showMtso']").is(":checked");
			
			var ringParam = {
					"mgmtGrpCd" : param.mgmtGrpCdNtwk
					, "bonbuId" : param.bonbuCdNtwk
					, "teamId" : param.teamCdNtwk
					, "mtsoId" : param.mtsoCdNtwk
					, "ntwkTypCd" : param.ntwkTypCd
					, "showBonbu" : param.showBonbu
					, "showTeam" : param.showTeam
					, "showMtso" : param.showMtso
			}

			httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/ringstat/getRingStatNtwkList', ringParam, 'GET', 'searchListNtwk');
		} else {
			mgmtGrpCd = param.mgmtGrpCdOrg;
			
			var ringBParam = {
					"mgmtGrpCd" : param.mgmtGrpCdOrg
					, "bonbuId" : param.bonbuCdOrg
					, "teamId" : param.teamCdOrg
					, "mtsoId" : param.mtsoCdOrg
			}
			httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/ringstat/getRingStatOrgList', ringBParam, 'GET', 'searchListOrg');
		}
	}
	
	//탭 변경
	function tabChange(index) {
		var changeGridId = getGridId(index);
		if(index == 0) {
			$(".ringStatN").show();
			$(".ringStatO").hide();
		} else if(index == 1){
			$(".ringStatN").hide();
			$(".ringStatO").show();
		}

		$('#'+changeGridId).alopexGrid("viewUpdate");
		
		if($('#'+changeGridId).alopexGrid("dataGet").length <= 0){
			$('#btnExportExcel').setEnabled(false);
		} else {
			$('#btnExportExcel').setEnabled(true);
		}
	}
	
	//Excel 다운로드
	function excelDownload() {
		var index = parseInt($('#basicTabs').getCurrentTabIndex());
		var changeGridId = getGridId(index);
		var date = getCurrDate();
		
		if(changeGridId == 'resultGrid') {
			fileName = cflineMsgArray['ringStatNtwk'] + "_" + date	/* 링현황(망구분별) */
			sheetNm = cflineMsgArray['ringStatNtwk']	/* 링현황(망구분별) */
		} else {
			fileName = cflineMsgArray['ringStatOrganization'] + "_" + date	/* 링현황(조직별) */
			sheetNm = cflineMsgArray['ringStatOrganization']	/* 링현황(조직별) */
		}
		
		cflineShowProgressBody();
		
		var worker = new ExcelWorker({
     		excelFileName : fileName,	
     		sheetList: [{
     			sheetName: sheetNm,
     			placement: 'vertical',
     			$grid: $('#'+changeGridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
	}
	
	// tab에따른 그리드 값
	function getGridId(index) {
		if(index == 0) {
			return changeGridId = 'resultGrid';
		} else if(index == 1) {
			return changeGridId = 'resultGridB';
		}
	}
	
	// 링현황(망구분별) 상세팝업
	function detailPop(evData) {
		var evTitle = evData.mapping.title;
		var dataObj = evData.data; 
		var dataKey = null;
		var data = {
							"mgmtGrpCd" : mgmtGrpCdVal
							, "ntwkTypCd" : dataObj.NTWK_TYP_CD
							, "ntwkTypNm" : dataObj.NTWK_TYP_NM
							, "topoSclCd" : dataObj.TOPO_SCL_CD
							, "topoSclNm" : dataObj.TOPO_SCL_NM
							, "evTitle" : evTitle
							, "radioBtnVal" : radioBtnVal
		};
		var addData = getAddData(evTitle, evData);
		$.extend(data, addData);
		$a.popup({
			popid: "RingStatNtwkDetailPop",
			title: "상세조회",
			url: $('#ctx').val() + '/statistics/configmgmt/RingStatNtwkDetailPop.do',
			data: data,
			iframe: true,
			modal: false,
			windowpopup: true,
			movable: true,
			width: 1000,
			height: 530,
			callback: function(data) {
				if(data != null) {
				}
				// 다른 팝업에 영향을 주지않기위해
				$.alopex.popup.result = null;
			}
		});
	}
	
	// 링현황(조직별) 상세팝업
	function detailBPop(dataObj) {
		var data = {
							"mgmtGrpCd" : mgmtGrpCd
							, "bonbuNm" : dataObj.bonbuNm
							, "bonbuId" : dataObj.bonbuId 
							, "teamNm" : dataObj.teamNm
							, "teamId" : dataObj.teamId
							, "mtsoNm" : dataObj.mtsoNm
							, "mtsoId" : dataObj.mtsoId
							, "dataKey" : dataObj._key
						}
		$a.popup({
			popid: "RingStatOrgDetailPop",
			title: "링현황 상세조회",
			url: $('#ctx').val() + '/statistics/configmgmt/RingStatOrgDetailPop.do',
			data: data,
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

	//망구분 변경
	function changeNtwkTyp() {
		var mgmtGrpCdNtwk = $('#mgmtGrpCdNtwk').val();
		var comboNtwkTypData = [];
		
		if(mgmtGrpCdNtwk == '') {
			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypData);
		} else if (mgmtGrpCdNtwk == '0001') {
			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkt);
		} else if (mgmtGrpCdNtwk == '0002') {
			comboNtwkTypData = comboNtwkTypData.concat(NtwkTypDataSkb);
		}
		
		//망구분
		$('#ntwkTypCd').clear();
		$('#ntwkTypCd').setData({data : comboNtwkTypData});
	}
	
	// 선택한 데이터에 따라 본부, 팀, 전송실을 구분한다.
	function getAddData(evTitle, evData){
		var addData = {};
		
		var dataObj = evData.data; 
		var dataKey = null;
		
		dataKey = dataObj._key;
		
		if(dataKey != "TOTALCNT"){
			if(radioBtnVal == "B"){
				addData = {"bonbuId" : dataKey
								, "teamId" : teamCdVal
								, "mtsoId" : mtsoCdVal
								, "dataKey" : dataKey};
			} else if(radioBtnVal == "T"){
				if(evTitle == "합계"){
					addData = {"bonbuId" : dataKey
									, "teamId" : teamCdVal
									, "mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				} else {
					addData = {"bonbuId" : bonbuCdVal
									, "teamId" : dataKey
									, "mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				}
			} else {
				if(evTitle == "합계"){
					addData = {"bonbuId" : dataKey
									, "teamId" : teamCdVal
									, "mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				}else if(evTitle == "소계"){
					addData = {"bonbuId" : bonbuCdVal
									, "teamId" : dataKey
									, "mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				}else{
					addData = {"mtsoId" : dataKey
									, "dataKey" : dataKey};
				}
			}
		} else {
			if(radioBtnVal == "B"){
				addData = {"bonbuId" : bonbuCdVal
								, "teamId" : teamCdVal
								, "mtsoId" : mtsoCdVal
								, "dataKey" : dataKey};
			} else if(radioBtnVal == "T"){
				if(evTitle == "합계"){
					addData = {"bonbuId" : bonbuCdVal
									, "teamId" : teamCdVal
									, "mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				} else {
					addData = {"bonbuId" : bonbuCdVal
									, "teamId" : teamCdVal
									, "dataKey" : dataKey};
				}
			} else {
				if(evTitle == "합계"){
					addData = {"bonbuId" : bonbuCdVal
									, "teamId" : teamCdVal
									, "mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				}else if(evTitle == "소계"){
					addData = {"bonbuId" : bonbuCdVal
									, "teamId" : teamCdVal
									, "mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				}else{
					addData = {"mtsoId" : mtsoCdVal
									, "dataKey" : dataKey};
				}
			}
		}
		
		return addData;
	}
});