/**
 * RingUseReport.js
 *
 * @author P123512
 * @date 2018.01.05
 * @version 1.0
 */

$a.page(function() {
	var gridId = 'dataGrid';
	var NtwkTypData = [];		// 망구분데이터  value:text
	var NtwkTypDataSkt = [];	// 망구분데이터 SKT  value:text
	var NtwkTypDataSkb = [];	// 망구분데이터 SKB value:text
	var C00188Data = [];  // 관리구분데이타   comCd:comCdNm
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	createMgmtGrpSelectBox ("ownCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
    	$('#btnExportExcel').setEnabled(false);
		$('#sAll').setChecked(true);
		$('#useRate').setEnabled(false);
 		$('#choiceSign').setEnabled(false);
 		
 		tomfHeaderYn = "Y";
		
    	initGrid();
    	setSelectCode();
        setEventListener();
    };

    
  //Grid 초기화
    function initGrid() {
    	var columnMapping = [
    	                     {key : 'lineType',			    align:'left',			    width:'150px',		title : cflineMsgArray['ringName']								/* 링명 */ }
    	                    , {key : 'orderingOrganization',align:'left',	        width:'150px',		title : cflineMsgArray['managementGroup']					/* 관리그룹 */ }
    	        			, {key : 'service',			        align:'left',			    width:'150px',		title : cflineMsgArray['networkDivision']						/* 망구분 */ }
    	        			, {key : 'summarization',		align:'right',			width:'110px',		title : cflineMsgArray['ntwkTopologyCd']						/* 망종류 */ }
    	        			, {key : 'possessionRate',		align:'left',				width:'150px',		title : cflineMsgArray['capacity']		                        /* 용량 */  }
    	        			, {key : 'text',		align:'left',				width:'150px',		title : cflineMsgArray['useRate']		                        /* 사용율 */  }
    	        			, {key : 'value',		align:'left',				width:'150px',		title : "수용트렁크"	                                            /* 수용트렁크 */  }
    	        			, {key : 'ex',		align:'left',				width:'150px',		title : cflineMsgArray['acceptLine']		                        /* 수용회선 */  }

		]
 		
        //그리드 생성
        $('#'+gridId).alopexGrid({
            autoColumnIndex : true,
            fitTableWidth : true,
            disableTextSelection : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            height : 550,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,columnMapping : columnMapping
        });
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearchCodeByTrk("orgCd", "teamCd", "topMtsoCd","", "all");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', null, 'GET', 'NtwkTypData'); // 망구분 데이터
    	// 사용자 소속 전송실
    	searchUserJrdtTmofInfo("topMtsoCd");

    }

	function setSearchCodeByTrk(hdofcId, teamId, tmofId, selGbn){
		hdofcSelectBoxId = hdofcId;
		teamCdSelectBoxId = teamId;
		tomfIdSelectBoxId = tmofId;
		if(hdofcId != null && hdofcId != ""){
			httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/01', null, 'GET', 'hdofcCmCdData', hdofcId, selGbn);
		}
		if(teamId != null && teamId != ""){
			httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/02', null, 'GET', 'teamCmCdData', teamId, selGbn);
		}
		if(tmofId != null && tmofId != ""){
			httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofCmCdData', tmofId, selGbn);
		}
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

		var viewMgmtGrpCd = $('#ownCd').val() == null ? '' : $('#ownCd').val();
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
	
	//상세팝업
    function detailPop(rowData){
    	var dataKey = rowData._key;
    	var gridData = {
    		"gridValue" : dataKey 	
    	};
		 $a.popup({
 			popid: "RingUseReportDetailPop",
 			title: "국사 현황 상세",
 			url: $('#ctx').val()+'/statistics/configmgmt/RingUseReportDetailPop.do',
 			data : gridData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1200,
 			height : 650,
 			callback:function(data){
 				if(data != null){
 				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}  
		});
    }
    
	//망구분 변경
	function changeNtwkTyp() {
		var mgmtGrpCdNtwk = $('#ownCd').val();
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
	
    function setEventListener() {
    	//사용율 , 수용트렁크, 수용회선 클릭했을 때 
 		$('#'+gridId).on('click', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
 			var dataKey = dataObj._key;
 			
     	 	if (dataKey == "value" || dataKey == "text" || dataKey == "ex" ) {
     	 		detailPop(dataObj);
     	 	}
 		});
    	// 관리그룹 선택시
	 	$('#ownCd').on('change',function(e){
	   		changeMgmtGrp("ownCd", "orgCd", "teamCd", "topMtsoCd", "mtso");
	   		changeNtwkTyp();
	   	});  
   		// 본부 선택시
    	$('#orgCd').on('change',function(e){
    		changeHdofc("orgCd", "teamCd", "topMtsoCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "topMtsoCd", "mtso");
      	});

    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 cflineShowProgressBody();
    		 //var dataParam =  $("#searchForm").getData();
    		 //httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/ringusereport/getringusereportlist', dataParam, 'GET', 'getRingUseReportList');
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/ringusereport/getringusereportlist', null, 'GET', 'getRingUseReportList');
         });

    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
    	
     	
	};
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'getRingUseReportList'){
			$('#'+gridId).alopexGrid('dataSet', response.getRingUseReportList );
			$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
		}
		if(flag == 'NtwkTypData'){
			setNtwkTypData(response);
		}
	}
	
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getRingUseReportList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
 
    function onloadMgmtGrpChange(){
   		changeMgmtGrp("ownCd", "orgCd", "teamCd", "topMtsoCd", "mtso", "topMtsoAll");
    }

    //엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : '사용율현황(링)_'+date,
     		sheetList: [{
     			sheetName: '사용율현황(링)_'+date,
     			placement: 'vertical',
     			$grid: $('#'+gridId)
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

    
});