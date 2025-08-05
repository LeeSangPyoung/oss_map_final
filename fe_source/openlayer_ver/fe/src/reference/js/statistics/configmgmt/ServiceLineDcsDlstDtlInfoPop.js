/**
 * ServiceLineDcsDlstDtlInfoPop
 *
 * @author Administrator
 * @date 2017. 8. 02.
 * @version 1.0
 */
//var gridDcsDlstPop = 'tieListPopGrid';
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
		$('#tmofCd').val(nullToEmpty(paramData.tmofCdVal));
		$('#eqpCdPop').val(nullToEmpty(paramData.eqpCd));
		$('#dcsDlstSchDivPop').val(nullToEmpty(paramData.dcsDlstSchDiv));
		$('#svlnTypSclCdPop').val(nullToEmpty(paramData.svlnTypSclCd));
		

		$('#impoYnPop').val(nullToEmpty(paramData.impoYn));
		$('#dcsCntCdPop').val(nullToEmpty(paramData.dcsCntCd));
		
		$('#belongToTitlePop').text(nullToEmpty(paramData.belongToTitle));
		$('#headerTitlePop').text(nullToEmpty(paramData.headerTitle));
		$('#eqpTitlePop').text(nullToEmpty(paramData.eqpNm));
		$('#impoYnPop').text(nullToEmpty(paramData.impoYn));
		$('#dcsCntCdPop').text(nullToEmpty(paramData.dcsCntCd));
		
		
		gridKey = nullToEmpty(paramData.dcsDlstSchDiv);
		getGrid();
        setEventListener();  
 		if($('#dcsDlstSchDivPop').val() =="" || $('#dcsDlstSchDivPop').val() == ""){
 			$a.close('invalidParamValue');
 			return;
 		}
		if($('#tiePopTie').val() !=null && $('#tiePopTie').val().length < 5){	
 			$a.close('minLengthPossible');
		}else{
			searchDcsDlstPop();
		} 
    };
    

    //Grid 초기화
    var getGrid = function() {    	
    	if(gridKey == "All"){
			returnTieMapping = mappingPopAll();
		}else if(gridKey == "Bts"){
			returnTieMapping = mappingPopBts();
		}else if(gridKey == "SigOnm"){
			returnTieMapping = mappingPopSigOnm();
		}else{
			returnTieMapping = mappingPopCuid();
		}
		
		//그리드 생성K
        $('#'+gridDcsDlstPop).alopexGrid({
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
        	columnMapping:returnTieMapping,
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
		var param =  $("#searchDcsDlstInfoPopForm").serialize(); 
		cflineShowProgress(gridDcsDlstPop);
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlndcsdlstdtlinfo', param, 'GET', 'searchDcsDlstPop'); 
	};
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['dcsStateDetail'],		/* DCS 현황 상세 */
     		sheetList: [{
     			sheetName: cflineMsgArray['dcsStateDetail'],		/* DCS 현황 상세 */
     			placement: 'vertical',
     			$grid: $('#'+gridDcsDlstPop)
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
    	if(flag == 'searchDcsDlstPop'){
    		cflineHideProgress(gridDcsDlstPop);
    		$('#'+gridDcsDlstPop).alopexGrid("dataSet", response.list);
        	$('#btnExportExcelGrid').setEnabled(true);
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchDcsDlstPop'){
    		cflineHideProgress(gridDcsDlstPop);
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