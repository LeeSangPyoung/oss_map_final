/**
 * ServiceLineCuidCurstDtlInfoPop
 *
 * @author P128406
 * @date 2023.04.05
 * @version 1.0
 */
var gridCuidCurstPop = 'popCuidCurstInfoListGrid';
var paramData = null;
var cuidCurstSchDiv = null;
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
    	$('#btnExportExcelGrid').setEnabled(false);
		paramData = param;
		$('#hdofcCdPop').val(nullToEmpty(paramData.hdofcCd));
		$('#teamCdPop').val(nullToEmpty(paramData.teamCd));
		$('#tmofCdValPop').val(nullToEmpty(paramData.tmofCdVal));
		$('#tmofCd').val(nullToEmpty(paramData.tmofCdVal));
		$('#cuidCurstSchDiv').val(nullToEmpty(paramData.cuidCurstSchDiv));
		$('#cuidCurstRstDiv').val(nullToEmpty(paramData.cuidCurstRstDiv));
		
		$('#belongToTitlePop').text(nullToEmpty(paramData.belongToTitle));
		$('#headerTitlePop').text(nullToEmpty(paramData.headerTitle));

		cuidCurstSchDiv = nullToEmpty(paramData.cuidCurstSchDiv);
		
		getGrid();
        setEventListener();  
		searchCuidCurstPop();

    };
    

    //Grid 초기화
    var getGrid = function() {    	

        var rowGrouping = [];
        var columnMapping =[
                          {key : 'eqpNm'	       			 ,title : "단독 장비명"			,align:'left', width:'200px', rowspan: true}
      					, {key : 'btsName'	             ,title : cflineMsgArray['btsName'] /*  기지국사 */ ,align:'left', width:'200px', rowspan: true}	
      					, {key : 'cuidVal'	             ,title : "CUID" ,align:'left', width:'60px', rowspan: true}	
      					, {key : 'mscId'	             ,title : "MSC" ,align:'left', width:'40px', rowspan: true}	
      					, {key : 'bscId'	             ,title : "BSC" ,align:'left', width:'40px', rowspan: true}	
      					, {key : 'btsId'	             ,title : "BTS" ,align:'left', width:'40px', rowspan: true}	
      					, {key : 'bldAddr'	             ,title : cflineMsgArray['address'] /*  주소 */ ,align:'left', width:'300px', rowspan: true}	
      					, {key : 'success'	             ,title : "이원화" /*  주소 */ ,align:'left', width:'60px', rowspan: true}	
                              ];
        
        if(cuidCurstSchDiv == "COT/AON" || cuidCurstSchDiv == "RT") {
        	rowGrouping = ['cuidVal', 'btsName', 'mscId', 'bscId', 'btsId', 'bldAddr', 'success', 'rmk', 'eqpNm'];
        	columnMapping.push(
					         	 {key : 'svlnNo'	             ,title : cflineMsgArray['lineNo'] /*  회선번호 */ ,align:'left', width:'100px'}	
					         	, {key : 'lineNm'	             ,title : "회선명" /*  회선명 */ ,align:'left', width:'300px'}	
					         	, {key : 'rmk'	                 ,title : "비고"  /*  비고 */ ,align:'left', width:'300px', rowspan: true	}
				         	);
        } else {
        	columnMapping.push(
         		            	 {key : 'svlnCnt'	             ,title : cflineMsgArray['lineCount'] /*  회선수 */ ,align:'left', width:'60px'}	
        	    	         	, {key : 'lineNm'	             ,title : "회선명" /*  회선명 */ ,align:'left', width:'300px'}	
        	    	         	, {key : 'rmk'	                 ,title : "비고"  /*  비고 */ ,align:'left', width:'300px'}
        	             	);
        }
		
		//그리드 생성K
        $('#'+gridCuidCurstPop).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
			height : 600,	
			grouping: {
  			  by: rowGrouping,
  			  useGrouping : true,
		          useGroupRowspan : true,
	  		},
	  		rowSelectOption: {
	  			groupSelect: false
	  		},
        	message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		},
        	columnMapping:columnMapping
        });
        

    }         

    function setEventListener() { 
    	//취소
   	 	$('#btnPopCancel').on('click', function(e) {
   	 		$a.close(null);
        });  
    	
        //엑셀다운로드
        $('#btnExportExcelGrid').on('click', function(e) {
     	   cflineShowProgressBody();
         	excelDownload();
        });
 		
	};
	// 조회 처리
	function searchCuidCurstPop(){
		var param =  $("#searchCuidCurstInfoPopForm").serialize(); 
		cflineShowProgress(gridCuidCurstPop);
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlncuidcurstdtlinfo', param, 'GET', 'searchCuidCurstPop'); 
	};
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['cuidStateDetail'],		/* 기지국사 현황 상세 */
     		sheetList: [{
     			sheetName: cflineMsgArray['cuidStateDetail'],		/* 기지국사 현황 상세 */
     			placement: 'vertical',
     			$grid: $('#'+gridCuidCurstPop)
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
    	if(flag == 'searchCuidCurstPop'){
    		cflineHideProgress(gridCuidCurstPop);
    		$('#'+gridCuidCurstPop).alopexGrid("dataSet", response.list);
        	$('#btnExportExcelGrid').setEnabled(true);
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchCuidCurstPop'){
    		cflineHideProgress(gridCuidCurstPop);
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