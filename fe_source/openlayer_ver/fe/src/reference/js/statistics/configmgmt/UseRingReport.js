/**
 * UseRingReport.js
 *
 * @author P095783
 * @date 2018. 5. 16. 오전 11:30:03
 * @version 1.0
 * 
 */

$a.page( function() {

	var gridId = 'dataGrid';
	
	var NtwkTypData = [];		// 망구분데이터  value:text
	var NtwkTypDataSkt = [];	// 망구분데이터 SKT value:text
	var NtwkTypDataSkb = [];	// 망구분데이터 SKB value:text
	var mgmtGrpData = [];		// 관리구분데이터 C00188
	
	tomfHeaderYn = "Y";

	this.init = function(id, param) {
		$('#btnExportExcel').setEnabled(false);
		
		var sDay = getTodayStr("-");
		$('#standardDate').val(sDay);
		
		initGrid();
    	setSelectCode();
        setEventListener();
	};
	
	//Grid 초기화
	function initGrid(sType, headerVal) {
		
		var mapping = [
	                			{ key: 'ntwkLineNm', 			align: 'left', 		width: '150px', 		title: cflineMsgArray['ringName']	/* 링명 */ }
	                			, { key: 'mgmtGrpCdNm', 			align: 'center', 		width: '60px', 		title: cflineMsgArray['managementGroup']	/* 관리그룹 */ }
	                			, { key: 'ntwkTypCdNm', 			align: 'center', 		width: '110px', 		title: cflineMsgArray['networkDivision']		/* 망구분 */ }
	                			, { key: 'ntwkCapaCdNm', 			align: 'center', 		width: '60px', 		title: cflineMsgArray['capacity']		/* 용량 */ }
	                			, { key: 'useRate', 		align: 'right', 		width: '60px', 		title: cflineMsgArray['useRate']	+ " (%)", /* 사용율 */ inlineStyle : { cursor: 'pointer' ,  color: 'blue' }}
	                			, { key: 'useTrkCnt', 		align: 'right', 		width: '60px', 		title: cflineMsgArray['acceptTrunk'],	/* 수용트렁크 */ inlineStyle : { cursor: 'pointer' ,  color: 'blue' }}
	                			, { key: 'useLineCnt', 		align: 'right', 		width: '60px', 		title: cflineMsgArray['acceptLine'],	/* 수용회선 */ inlineStyle : { cursor: 'pointer' ,  color: 'blue' }}
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
	        message : {
	    	   nodata : "<div class = 'no_data'><i class = 'fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],	/* '조회된 데이터가 없습니다.' */
			   filterNodata : 'No data'
	        },
	        columnMapping : mapping
		});
	}
	
	//조회조건 세팅
	function setSelectCode() {
		createMgmtGrpSelectBox ("mgmtGrpCd", "N", "SKT");  // 관리 그룹 selectBox
		setSearchCode("bonbuId", "teamId", "mtsoId");	// 본부, 팀, 전송실 selectBox
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', null, 'GET', 'NtwkTypData'); // 망구분 데이터
	}
	
	function setEventListener() {
		//조회 선택시
		$('#btnSearch').on('click', function(e) {
			searchProc();
		});
		
		//상세팝업
		$('#' + gridId).on('click', '.bodycell', function(e) {
			useRingPop(e);
		});
		
		//관리그룹 선택시
		$('#mgmtGrpCd').on('change', function(e) {
			changeMgmtGrp("mgmtGrpCd", "bonbuId", "teamId", "mtsoId", "mtso");
			changeNtwkTyp();
		});
		
		//링현황 본부 선택시
		$('#bonbuId').on('change', function(e) {
			changeHdofc("bonbuId", "teamId", "mtsoId", "mtso");
		});
		
		//링현황 팀 선택시
    	$('#teamId').on('change',function(e){
    		changeTeam("teamId", "mtsoId", "mtso");
      	});
    	
    	//엑셀버튼 선택시
    	$('#btnExportExcel').on('click', function(e) {
			excelDownload();
		});
	}
	
	//조회 함수
	function searchProc() {
		cflineShowProgressBody();
		var param = $("#searchForm").getData();
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/useringstat/getUseRingStatList', param, 'GET', 'searchList');
	}
	
	//팝업
	function useRingPop(e) {
		var dataObj = AlopexGrid.parseEvent(e).data;
		var dataKey = dataObj._key;
		
		if(dataKey == "useRate" || dataKey == "useTrkCnt" || dataKey == "useLineCnt") {
			detailPop(dataObj);
		} 
	}
	
	//상세팝업
	function detailPop(dataObj) {
		var dataKey = dataObj._key;
		var popData = {
				"ntwkLineNo" : dataObj.ntwkLineNo
				, "ntwkLineNm" : dataObj.ntwkLineNm
				, "dataKey" : dataKey
		}
		$a.popup({
			popid: "UseRingReportDetailPop",
			title: cflineMsgArray['useRateStatRing'] + " 상세조회",
			url: $('#ctx').val() + '/statistics/configmgmt/UseRingReportDetailPop.do',
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
		//관리그룹데이터세팅
    	if(flag == 'mgmtGrpData') {
    		mgmtGrpData = response;
    	}
    	
    	// 망구분데이터세팅
    	if(flag == 'NtwkTypData') {
    		setNtwkTypData(response);
    	}
    	
    	//조회
		if(flag == 'searchList') {
			if(response.result.length >0){
	    		$('#btnExportExcel').setEnabled(true);
			}else{
				$('#btnExportExcel').setEnabled(false);
			}
    		$('#'+gridId).alopexGrid('dataSet', response.result);
    		cflineHideProgressBody();
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
	
	//망구분 변경
	function changeNtwkTyp() {
		var mgmtGrpCdNtwk = $('#mgmtGrpCd').val();
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

		var viewMgmtGrpCd = $('#mgmtGrpCd').val() == null ? '' : $('#mgmtGrpCd').val();
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

	//엑셀다운로드
	function excelDownload() {
		cflineShowProgressBody();
		
		var date = getCurrDate();
		var worker = new ExcelWorker({
			excelFileName : cflineMsgArray['useRateStatRing'] + "_" + date,
			sheetList : [{
				sheetName : cflineMsgArray['useRateStatRing'] + "_" + date,
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