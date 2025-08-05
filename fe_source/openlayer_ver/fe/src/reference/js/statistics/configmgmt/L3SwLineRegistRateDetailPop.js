/**
 * L3SwLineRegistRateDetailPop.js
 *
 * @author P123512
 * @date 2018.06.04
 * @version 1.0
 */
var gridId = 'gridIdPop';
var paramData = null;

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#title').text("L3 SW 미등록회선수 상세");
    	$('#btnExportExcelPop').setEnabled(false);
    	paramData = param;
        setEventListener();
        initGrid();
        searchList();
    };
    
  	//Grid 초기화
    function initGrid() {
    	var columnMapping = [
    	                      {key : 'bonbuNm',			align:'center',			width:'150px',		title : cflineMsgArray['headOffice']	/* 본부 */}
    	         			, {key : 'teamNm',			align:'center',			width:'150px',		title : cflineMsgArray['team']		/* 팀 */}
    	         			, {key : 'mtsoNm',			align:'center',			width:'150px',		title : cflineMsgArray['transmissionOffice'] /* 전송실 */	}
    	         			, {key : 'lineNm',			align:'left',			width:'230px',		title : cflineMsgArray['lnNm'] /* 회선명 */ }
    	         			, {key : 'svlnLclCdNm',		align:'center',			width:'130px',		title : cflineMsgArray['serviceLineLcl'] /* 서비스회선 대분류 */ }
    	         			, {key : 'svlnSclCdNm',		align:'center',			width:'130px',		title : cflineMsgArray['serviceLineScl'] /* 서비스회선 소분류 */ }
    	         			, {key : 'mainEqpIpAddr',	align:'left',			width:'170px',		title : cflineMsgArray['internetProtocol'] /* IP */ }
     	]
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	columnMapping : columnMapping,
        	pager : true,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : true,
			rowSingleSelect : true,
			numberingColumnFromZero : false,
			height : 400,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
				filterNodata : 'No data'
			}
        });
    };
    

    function searchList(){
    	cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/l3swlineregistrate/getl3swlinenotregistcntlist', paramData ,'GET','getL3SwLineNotRegistCntList');
    }
    
    function setEventListener() {
       //엑셀다운로드
       $('#btnExportExcelPop').on('click', function(e) {
    	   cflineShowProgressBody();
        	excelDownload();
       });
     
       //닫기
       $('#btnCnclPop').on('click', function(e) {
    	   $a.close();
       });
	};

	//request 성공시
    function successCallback(response, flag){ 
    	if (flag == 'getL3SwLineNotRegistCntList') {
			$('#'+gridId).alopexGrid('dataSet', response.getL3SwLineNotRegistCntList );
			$('#btnExportExcelPop').setEnabled(true);
			cflineHideProgressBody();
    	}
    }
    //request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getL3SwLineNotRegistCntList'){
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
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }
    
    //엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : 'L3 SW 미등록회선수 상세_'+date,		
     		sheetList: [{
     			sheetName: 'L3 SW 미등록회선수 상세',		    
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
});