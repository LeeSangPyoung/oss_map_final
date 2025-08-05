/**
 * FdfDetailPop
 *
 * @author P095783
 * @date 2020. 7. 17. 오전 13:21:03
 * @version 1.0
 */

var gridId = 'gridIdPop';
var paramData = null;

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcelPop').setEnabled(false);
    	paramData = param;
        setEventListener();
        initGrid();
        searchList();
    };
    
  	//Grid 초기화
    function initGrid() {
    	var columnMapping = [
    	                     {key : 'srvcMgmtNo',			align:'center',			width:'110px',		title : "서비스관리번호"}
    	         			, {key : 'appltReqNo',			align:'center',			width:'110px',		title : "청약요청번호"}
    	         			, {key : 'cstrCd',			align:'center',			width:'110px',		title : "공사코드"	}
    	         			, {key : 'lnNo',			align:'center',			width:'110px',		title : "선로번호"	}
    	         			, {key : 'cstrCd',			align:'center',			width:'110px',		title : "RN장비포트번호"	}
    	         			, {key : 'umtsoNm',			align:'center',			width:'110px',		title : "상위국사명" }
    	         			, {key : 'rackNo',			align:'center',			width:'110px',		title : "RACK" }
    	         			, {key : 'shlfNo',			align:'center',			width:'110px',		title : "SHELF" }
    	         			, {key : 'portNo',			align:'center',			width:'110px',		title : "PORT"}
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
			height : 480,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+"조회된 데이터가 없습니다."+"</div>",
				filterNodata : 'No data'
			}
        });
    };
    

    function searchList(){
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/selectFdfDetailList', paramData, 'GET', 'searchList');
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
    	if (flag == 'searchList') {
			$('#'+gridId).alopexGrid('dataSet', response );
			$('#btnExportExcelPop').setEnabled(true);
			cflineHideProgressBody();
    	}
    }
    //request 실패시.
    function failCallback(response, flag){
    	if(flag == 'searchList'){
    		cflineHideProgressBody();
    		alertBox('I', "조회 실패 하였습니다.");
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
     		excelFileName : "FDF선번정보",
     		sheetList: [{
     			sheetName: "FDF선번정보",
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