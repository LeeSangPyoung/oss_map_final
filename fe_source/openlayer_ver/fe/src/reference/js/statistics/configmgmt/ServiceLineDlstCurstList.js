/**
 * ServiceLineDlstCurstList
 * 전송망안정화지수 이원화 총괄
 * @author P100700
 * @date 2017.10.11
 * @version 1.0
 */
var svlnCommCodeData = [];  // 서비스회선 공통코드
var gridId = 'dataGrid';

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	createMgmtGrpSelectBox ("mgmtGrpCd", "A", 'SKT');  // 관리 그룹 selectBox
    	$('#btnExportExcel').setEnabled(false);
    	setSelectCode();
    	getGrid();
        setEventListener();   
    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    }
    
    function setEventListener() {
	 	// 엔터 이벤트 
     	$('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnSearch').click();
    			return false;
    		}
     	});	 
	 	// 국사 keydown
     	$('#mtsoNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#mtsoId").val("");
     		}
     	});
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 searchProc();    		 
         });
     	// 관리그룹 클릭시
     	$('#mgmtGrpCd').on('change',function(e){
     		if( $('#mgmtGrpCd').val() == '0001' ){
     		}else{
     		}
     		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
       	});   	 
    	// 본부 선택시
    	$('#hdofcCd').on('change',function(e){
    		changeHdofc("hdofcCd", "teamCd", "tmofCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "tmofCd", "mtso");
      	});      	 
  		// 전송실 선택시
    	$('#tmofCd').on('change',function(e){
    		changeTmof("tmofCd", "mtso");
      	});
		//국사찾기
		$('#btnMtsoSch').on('click', function(e) {
//			openMtsoPop("mtsoCd", "mtsoNm");
			var paramValue = "";
			
			paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text(),"orgId": $('#hdofcCd').val()
					,"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val()
					, "regYn" : "Y", "mtsoStatCd" : "01"}
			openMtsoDataPop("mtsoCd", "mtsoNm", paramValue);
		}); 
		
		//엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
       	 cflineShowProgressBody();
       	 excelDownload();
        });

	};	

	/*
	 * 조회 함수
	 */
	function searchProc(){
		$('#mtsoCd').val("");
    	var param =  $("#searchForm").serialize(); 
    	cflineShowProgressBody();		
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlndlstcurstlist', param, 'GET', 'searchAllInfo');
	}

	function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchAllInfo'){
    		cflineHideProgressBody();
    		$('#'+gridId).alopexGrid("dataSet", response.list);
			$('#btnExportExcel').setEnabled(true);
    	}
	}
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['dualColligation'],			/* 이원화 총괄 */
     		sheetList: [{
     			sheetName: cflineMsgArray['dualColligation'],			/* 이원화 총괄 */
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
    
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchAllInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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
    
    //Grid 초기화
    var getGrid = function() {
    		 $('#'+gridId).alopexGrid({
	            autoColumnIndex : true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	            rowClickSelect : true,
	            rowSingleSelect : false,
	            numberingColumnFromZero : false,
	    		defaultColumnMapping:{sorting: false},
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
			columnMapping: [
				{key : 'mgmtGrpCdNm'				,title : cflineMsgArray['managementGroup'] /*  관리그룹 */ ,align:'center', width: '60px'}
		        , {key : 'hdofcNm'	            	,title : cflineCommMsgArray['hdofc'] /* 본부 */ ,align:'center', width: '100px'}
		        , {key : 'teamNm'	        		,title : cflineCommMsgArray['team'] /* 팀 */ ,align:'center', width: '130px'}     
		        , {key : 'tmofNm'	        		,title : cflineMsgArray['transmissionOffice'] /* 전송실 */ ,align:'center', width: '130px'}    
		        , {key : 'detlBizDivNm'	        	,title : cflineMsgArray['businessDivision'] /* 사업구분 */ ,align:'center', width: '80px'}               
		        , {key : 'mtsoNm'	        		,title : cflineMsgArray['btsName'] /* 기지국사 */ ,align:'center', width: '160px'}    
		        , {key : 'lineDualStat'	        	,title : cflineMsgArray['lineDualostion'] /* 회선 이원화 */ ,align:'center', width: '80px'}               
/*		        , {key : 'dcsDualStat'	        	,title : cflineMsgArray['dcsDualostion']  ,align:'center', width: '80px'}		DCS 이원화 */               
		        , {key : 'dcsUnitDualStat'	        ,title : cflineMsgArray['dcsUnitDualostion'] /* DCS Unit 이원화 */ ,align:'center', width: '100px'}               
		        , {key : 'leaseCorpDualStat'	    ,title : cflineMsgArray['bizDualostion'] /* 사업자 이원화 */ ,align:'center', width: '80px'}                                                                                
			]}); 
    		$('#'+gridId).alopexGrid("columnFix", 3); 
    } 
    
});
