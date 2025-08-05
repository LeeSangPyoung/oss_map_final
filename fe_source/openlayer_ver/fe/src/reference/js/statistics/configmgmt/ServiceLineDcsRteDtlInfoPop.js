/**
 * ServiceLineDcsDlstDtlInfoPop
 *
 * @author Administrator
 * @date 2017. 8. 02.
 * @version 1.0
 */
var gridId = 'popDcsRteInfoListGrid';
var paramData = null;
var selectDataObj = null;
var returnTieMapping = [];
var gridKey = null;
var gubun = "";
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
    	$('#btnExportExcelGrid').setEnabled(false);
		paramData = param;
		$('#hdofcCdPop').val(nullToEmpty(paramData.hdofcCd));
		$('#teamCdPop').val(nullToEmpty(paramData.teamCd));
		$('#tmofCdValPop').val(nullToEmpty(paramData.tmofCdVal));
		$('#tmofCd').val(nullToEmpty(paramData.tmofCd));
		$('#eqpNmPop').val(nullToEmpty(paramData.eqpNm));
		$('#dcsDlstSchDivPop').val("Rte");
		$('#svlnSclCdPop').val(nullToEmpty(paramData.svlnSclCd));
		$('#rtePathValPop').val(nullToEmpty(paramData.rtePathVal));
				
		$('#headerTitlePop').text(nullToEmpty(paramData.headerTitle));
		
		if(nullToEmpty(paramData.eqpNm) == "") {
			$('#eqpTitlePop').text(nullToEmpty(paramData.rtePathVal));	
		} else {
			$('#eqpTitlePop').text(nullToEmpty(paramData.eqpNm));	
		}
		
		gridKey = nullToEmpty(paramData.svlnSclCd);
		gubun = nullToEmpty(paramData.eqpNm);
		getGrid();
        setEventListener();  
		searchDcsDlstPop();
		
    };
    //총건수
    var mappingPopAll = function(){

    	var returnMapping =  [
      		            	 {key : 'rtePathVal'	         ,title : "RTE_NAME" /*  RTE_NAME */ ,align:'left', width:'200px', rowspan: true}	
      		            	, {key : 'svlnNo'	             ,title : "서비스번호" /*  서비스번호 */ ,align:'left', width:'110px', rowspan: true}	
    		                , {key : 'eqpNm'	       		 ,title : "DCS"			,align:'left', width:'80px'}	
    		            	, {key : 'svlnSclNm'	         ,title : "서비스" /*  서비스 */ ,align:'left', width:'70px'}	
    		            	, {key : 'rteCnt'	             ,title : "수용회선수" /*  수용회선수 */ ,align:'left', width:'80px'}	
    		            	, {key : 'success'	             ,title : "이원화" /*  이원화 */ ,align:'left', width:'60px'}	
    		            	, {key : 'ogTieOne'	             ,title : "OG_TIE1" /*  OG_TIE1 */ ,align:'left', width:'110px'}	
    		            	, {key : 'ogTieTwo'	             ,title : "OG_TIE2" /*  OG_TIE2 */ ,align:'left', width:'110px'}	
    		            	, {key : 'icTieOne'	             ,title : "IC_TIE1" /*  IC_TIE1 */ ,align:'left', width:'110px'}	
    		            	, {key : 'icTieTwo'	             ,title : "IC_TIE2" /*  IC_TIE2 */ ,align:'left', width:'110px'}	
    		            	, {key : 'lineNm'	             ,title : "회선명" /*  회선수 */ ,align:'left', width:'300px', rowspan: true}	
    		];	
    	return returnMapping;
    }
    //교환기
    var mappingPopExchrAll = function(){

    	var returnMapping =  [
    		                 {key : 'eqpNm'	       			 ,title : "DCS"			,align:'left', width:'80px', rowspan: true}	
    		            	, {key : 'rtePathVal'	         ,title : "RTE_NAME" /*  RTE_NAME */ ,align:'left', width:'200px', rowspan: true}	
    		            	, {key : 'svlnSclNm'	         ,title : "서비스" /*  서비스 */ ,align:'left', width:'70px'}	
    		            	, {key : 'rteTotalCnt'	         ,title : "전체회선수" /*  전체회선수 */ ,align:'left', width:'80px'}	
    		            	, {key : 'rteCnt'	             ,title : "수용회선수" /*  수용회선수 */ ,align:'left', width:'80px'}	
    		            	, {key : 'success'	             ,title : "이원화" /*  이원화 */ ,align:'left', width:'60px'}	
    		            	, {key : 'svlnNo'	             ,title : "서비스번호" /*  서비스번호 */ ,align:'left', width:'110px'}	
    		            	, {key : 'ogTieOne'	             ,title : "OG_TIE1" /*  OG_TIE1 */ ,align:'left', width:'110px'}	
    		            	, {key : 'ogTieTwo'	             ,title : "OG_TIE2" /*  OG_TIE2 */ ,align:'left', width:'110px'}	
    		            	, {key : 'icTieOne'	             ,title : "IC_TIE1" /*  IC_TIE1 */ ,align:'left', width:'110px'}	
    		            	, {key : 'icTieTwo'	             ,title : "IC_TIE2" /*  IC_TIE2 */ ,align:'left', width:'110px'}	
    		            	, {key : 'lineNm'	             ,title : "회선명" /*  회선명 */ ,align:'left', width:'300px'}	
    		];	
    	return returnMapping;
    }
    //상호접속
    var mappingPopTrd = function(){

    	var returnMapping =  [
    		                 {key : 'eqpNm'	       			 ,title : "DCS"			,align:'left', width:'80px', rowspan: true}	
    		            	, {key : 'rtePathVal'	         ,title : "RTE_NAME" /*  RTE_NAME */ ,align:'left', width:'200px', rowspan: true}	
    		            	, {key : 'svlnSclNm'	         ,title : "서비스" /*  서비스 */ ,align:'left', width:'70px'}	
    		            	, {key : 'rteTotalCnt'	         ,title : "전체회선수" /*  전체회선수 */ ,align:'left', width:'80px'}	
    		            	, {key : 'rteCnt'	             ,title : "수용회선수" /*  수용회선수 */ ,align:'left', width:'80px'}	
    		            	, {key : 'success'	             ,title : "이원화" /*  이원화 */ ,align:'left', width:'60px'}	
    		            	, {key : 'svlnNo'	             ,title : "서비스번호" /*  서비스번호 */ ,align:'left', width:'110px'}	
    		            	, {key : 'ogTieOne'	             ,title : "TIE1" /*  TIE1 */ ,align:'left', width:'110px'}	
    		            	, {key : 'ogTieTwo'	             ,title : "TIE2" /*  TIE2 */ ,align:'left', width:'110px'}	
    		            	, {key : 'lineNm'	             ,title : "회선명" /*  회선명 */ ,align:'left', width:'300px'}	
    		];	
    	return returnMapping;
    }
    
    //Grid 초기화
    var getGrid = function() {    	

        var rowGrouping = [];
        
    	if(gubun != "") {
	    	if(gridKey == "001" || gridKey == "000"){
	    		var returnMapping = mappingPopExchrAll();
			} else {
				var returnMapping = mappingPopTrd();
			}
	    	rowGrouping = ['eqpNm','rtePathVal'];
    	} else {
    		var returnMapping = mappingPopAll();
	    	rowGrouping = ['rtePathVal','svlnNo','lineNm'];
    	}
    	
    	
		//그리드 생성K
        $('#'+gridId).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
//	    		pager:false,  		
			height : 350,	
        	message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		},
    		grouping : {
            	by : rowGrouping,
            	useGrouping : true,
            	useGroupRowspan : true,
            },
        	columnMapping:returnMapping,
        });

    }         

    function setEventListener() { 
    	//취소
   	 	$('#btnCnclPop').on('click', function(e) {
   	 		$a.close(null);
        });  
    	
        //엑셀다운로드
        $('#btnExportExcelGrid').on('click', function(e) {
     	   cflineShowProgressBody();
         	excelDownload();
        });
 		
	};
	// 조회 처리
	function searchDcsDlstPop(){
//		selectDataObj = null;
		var param =  $("#searchDcsRteInfoPopForm").serialize(); 
		cflineShowProgress(gridId);
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlndcsdlstdtlinfo', param, 'GET', 'searchDcsRtePop'); 
	};
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['dcsRteStateDetail'],		/* DCS 현황 상세 */
     		sheetList: [{
     			sheetName: cflineMsgArray['dcsRteStateDetail'],		/* DCS 현황 상세 */
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
    
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchDcsRtePop'){
    		cflineHideProgress(gridId);
    		$('#'+gridId).alopexGrid("dataSet", response.list);
        	$('#btnExportExcelGrid').setEnabled(true);
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchDcsDlstPop'){
    		cflineHideProgress(gridId);
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
  
});