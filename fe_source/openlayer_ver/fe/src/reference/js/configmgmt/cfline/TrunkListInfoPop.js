/**
 * TrunkListInfoPop.js
 *
 * @author Administrator
 * @date 2021. 02. 15. 
 * @version 1.0
 *  
 */

var gridId = 'dataGrid';

/**
 * 기본정보 excel생성을 위한 그리드
 */
var baseGridId = "pathBaseInfo";

var paramData = null;
	
$a.page(function() {

    this.init = function(id, param) {
    	paramData = param;
    			
    	initGrid();
        setEventListener();

        searchInit(paramData);
    };

    
    function initGrid() {
		
    	var column = [
					  { key : 'ntwkLineNo', align:'left', title : '회선ID' , width: '100px'}
					, { key : 'ntwkLineNm', align:'left', title : '회선명' , width: '200px'}
					, { key : 'uprMtsoIdNm', align:'left', title : '상위국사명' , width: '150px'}
					, { key : 'lowMtsoIdNm', align:'left', title : '하위국사명' , width: '150px'}
    	];
    	
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	pager : true,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowSelectOption : {
				clickSelect : true ,
				singleSelect : false ,
				groupSelect : true
			} ,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 270 ,	    
			columnMapping : column,
			rowspanGroupSelect: true,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
			}
        });
        
        //paramData
        $('.frontNm').text(paramData.frontNm);
        $('.backNm').text(paramData.backNm);
        $('.fdfNm').text(paramData.fdfNm);
    };

    
    function setEventListener() {
    	 
    	$('#btnClose').on('click', function(e){
    		$a.close();
        });
		
    	//닫기
	 	$('#btnPopClose').on('click', function(e) {
	 		$a.close();
    	});  
	 	
	 	$('#btnExportExcel').on('click', function(e){
    		var date = getCurrDate();
    		var fileName = 'FDF장비사용_트렁크회선';

    		var baseInfData = [];
    		baseInfData.frontNm = "023";
    		$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
    		
    		var grid = [$('#'+baseGridId), $('#'+gridId)];
    		
    		var worker = new ExcelWorker({
         		excelFileName : fileName + '_정보_' + date,
         		sheetList: [{
         			sheetName: fileName + '_정보_' + date,
         			placement: 'vertical',
         			$grid: grid
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
	 	
    }
    
    function searchInit(param) {
    	cflineShowProgressBody();
    	var dataParam = param;
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/trunkLineInfo', dataParam, 'GET', 'search');
    }
	
	function successCallback(response, status, jqxhr, flag){
		
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		var data = response.trunkLineList;

    		$('#'+gridId).alopexGrid('dataSet', data);

    	} 
    }
	
	
	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
		//조회 실패 하였습니다.
	    callMsgBox('','W', cflineMsgArray['searchFail'] , function(msgId, msgRst){});
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