/**
 * OpenTaskCmplPathErrorPop
 *
 * @author Administrator
 * @date 2017. 10. 24.
 * @version 1.0
 */
var paramData = null;
var selectedJobTitlePop = null;
var gridPathErrorPop = 'pathErrorListPopGrid';
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
		paramData = param;
		selectedJobTitlePop = nullToEmpty(param.selectedJobTitle);
		getTieGrid();
		searchErrorListPop(param.pathList);
        setEventListenerPop();
    };
    

    //Grid 초기화
    var getTieGrid = function(response) {  
    	
			//그리드 생성
	        $('#'+gridPathErrorPop).alopexGrid({
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		rowClickSelect : false,
	    		rowSingleSelect : true,
	    		numberingColumnFromZero: false,
	    		pager:false,  		
				height : 300,	
	        	message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
	    		},
			columnMapping: [ 
				{key : 'lineNm'	          	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '200px'}
				, {key : 'svlnNo'	      	,title : cflineMsgArray['serviceLineNumber']  /* 서비스회선번호 */			,align:'center', width: '120px'} 
				, {key : 'noexistTrkNm'	    ,title : cflineMsgArray['terminateTrunkName']  /* 해지 트렁크명 */			,align:'center', width: '200px'} 
				, {key : 'noexistRingNm'	,title : cflineMsgArray['terminateRingName']  /* 해지 링명 */			,align:'center', width: '200px'} 
				, {key : 'noexistEqpNm'	    ,title : cflineMsgArray['terminateEqpName']  /* 해지 장비명 */			,align:'center', width: '200px'}                                         
			]}); 

    }      
    
    function setEventListenerPop() {
     	// 엑셀 다운로드   
    	$('#popBtnExportExcel').on('click', function(e) {
    		var date = getCurrDate();
    		var sheetNm = cflineMsgArray['lnoErrorLine'] /* 선번 오류 회선 */;
    		
    		var worker = new ExcelWorker({
         		excelFileName : sheetNm + '_' + selectedJobTitlePop + '_' + date,
         		sheetList: [{
         			sheetName: sheetNm,
         			placement: 'vertical',
         			$grid: $('#'+gridPathErrorPop)
         		}]
         	});
    		
    		worker.export({
         		merge: false,
         		exportHidden: false,
         		useGridColumnWidth : true,
         		border : true,
         		useCSSParser : true
         	});
    	});    	
    	// 닫기
    	$('#popBtnclose').on('click', function(e) {
			$a.close(null);
		});
	};
	// 조회 처리
	function searchErrorListPop(pathList){
		$('#'+gridPathErrorPop).alopexGrid("dataSet", pathList);
	};
  
});