/**
 * ServiceLineDlstCurstList
 *
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
    	// 장비모델 
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/getdcsunitdlsteqpmdllist', null, 'GET', 'searchEqpMdl');
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
     	$('#eqpNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#eqpCd").val("");
     		}
     	});
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 searchProc();    		 
         });
    	 
 		//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
         	cflineShowProgressBody();
         	excelDownload();
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
        
		//장비찾기
		$('#btnEqpSch').on('click', function(e) {
//			console.log("eqpNm  : " + nullToEmpty($("#eqpNm").val()));
			openEqpPop("eqpCd", "eqpNm", $("#eqpNm").val());
		}); 

	};	

	/*
	 * 조회 함수
	 */
	function searchProc(){
    	var param =  $("#searchForm").serialize(); 
    	cflineShowProgressBody();		
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlndcsunitdlstlist', param, 'GET', 'searchAllInfo');
	}
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['dcsUnitDualostion'],			/* DCS UNIT 이원화 */
     		sheetList: [{
     			sheetName: cflineMsgArray['dcsUnitDualostion'],			/* DCS UNIT 이원화 */
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

	function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchAllInfo'){
    		getGrid();
    		cflineHideProgressBody();
    		$('#'+gridId).alopexGrid("dataSet", response.list);
        	$('#btnExportExcel').setEnabled(true);
    	}
    	if(flag == 'searchEqpMdl'){
    		var option_data =  [];
			var dataFst = {"eqpMdlId":"","eqpMdlNm":cflineCommMsgArray['all']};
			option_data.push(dataFst);
    		if(response.eqpMdlList != null){
	    		for(k=0; k<response.eqpMdlList.length; k++){
	    			var dataEqpMdl = response.eqpMdlList[k]; 
	    			option_data.push(dataEqpMdl);
	    		}
    		}
			$('#eqpMdlCd').clear();
			$('#eqpMdlCd').setData({data : option_data});
    	}
    	
	}
    
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchAllInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'searchEqpMdl'){
    		var option_data =  [];
			var dataFst = {"eqpMdlId":"","eqpMdlNm":cflineCommMsgArray['all']};
			option_data.push(dataFst);
			$('#eqpMdlCd').clear();
			$('#eqpMdlCd').setData({data : option_data});
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
				{key : 'mgmtGrpCdNm'			,title : cflineMsgArray['managementGroup'] /*  관리그룹 */ ,align:'center', width: '60px'}
				, {key : 'hdofcNm'	          	,title : cflineCommMsgArray['hdofc'] /* 본부 */ ,align:'center', width: '100px'}
		        , {key : 'teamNm'	        	,title : cflineCommMsgArray['team'] /* 팀 */ ,align:'center', width: '130px'}     
		        , {key : 'tmofNm'	        	,title : cflineMsgArray['transmissionOffice'] /* 전송실 */ ,align:'center', width: '130px'} 
		        , {key : 'eqpMdlNm'	        	,title : cflineMsgArray['equipmentModel'] /* 장비모델 */ ,align:'center', width: '150px'}  
		        , {key : 'cardId'	        	,title : cflineMsgArray['card'] /* 카드 */ ,align:'center', width: '100px'}          
		        , {key : 'eqpNm'	        	,title : cflineMsgArray['eqpNm'] /* 장비명 */ ,align:'center', width: '150px'}      
		        , {key : 'mtsoNm'	        	,title : cflineMsgArray['btsName'] /* 기지국사 */ ,align:'center', width: '250px'}      
		        , {key : 'dcsUnitDualStat'	    ,title : cflineMsgArray['dualostionYn'] /* 이원화 여부 */ ,align:'center', width: '80px'}                                                                                 
			]}); 
    		$('#'+gridId).alopexGrid("columnFix", 3); 
    } 
    
});
