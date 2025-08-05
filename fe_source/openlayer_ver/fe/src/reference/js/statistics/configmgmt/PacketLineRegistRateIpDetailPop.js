var gridId = 'gridIdPop';
var paramData = null;
var title = null;

$a.page(function() {
    this.init = function(id, param) {
    	paramData = param;
    	if(paramData.dataKey == "unCountTrunk") {
    		title = cflineMsgArray['ptsUnCntTrunkDetail']	/* PTS 미등록 회선 수 상세(IP) */
    	} else {
    		title = cflineMsgArray['ringUnCntDetail']	/* 링 미등록 회선 수 상세(IP)  */
    	}
    	
    	$('#popTitle').text(title); 
    	$('#headTitle').text(title); 
  
    	$('#btnExportExcelPop').setEnabled(false);
    	
        setEventListener();
        initGrid();
        searchList();
    };
    
  	//Grid 초기화
    function initGrid() {
  			var columnMapping = [
  			                     			{key : 'bonbuNm',		align:  'center',		width:  '130px',			title : cflineMsgArray['headOffice'] /* 본부 */ }
  			                     			, {key : 'teamNm',			align : 'center', 		width : '130px', 			title : cflineMsgArray['team']	 /* 팀 */ }
  			                     			, {key : 'mtsoNm',		align : 'center',		width : '130px',			title : cflineMsgArray['transmissionOffice'] /* 전송실 */}
  			                     			, {key : 'lineNm',			align:'left',			width:'180px',		title : cflineMsgArray['lnNm'] /* 회선명 */ }
  			                     			, {key : 'svlnLclCdNm',			align:'center',			width:'120px',		title : cflineMsgArray['serviceLargeClassificationName'] /* 서비스대분류명 */ }
  			                     			, {key : 'svlnSclCdNm',			align:'center',			width:'130px',		title : cflineMsgArray['serviceSmallClassificationName'] /* 서비스소분류명 */ }
  			                     			, {key : 'duIp',			align:'center',			width:'90px',		title : cflineMsgArray['internetProtocol'] /* ip */ }
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
			height : 420,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
				filterNodata : 'No data'
			}
        });
    };
    

    function searchList(){
    	cflineShowProgressBody();
    	
    	httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/packetlineregistrateip/getPacketLineRegistRateIpDetailList', paramData , 'GET', 'getPacketLineRegistRateIpDetailList');
    }
    
    function setEventListener() {
    	
       //엑셀다운로드
       $('#btnExportExcelPop').on('click', function(e) {
	       	excelDownload();
       });
     
       //닫기
       $('#btnCnclPop').on('click', function(e) {
    	   $a.close();
       });
	};

	//request 성공시
    function successCallback(response, flag){ 
    	if (flag == 'getPacketLineRegistRateIpDetailList') {
			$('#'+gridId).alopexGrid('dataSet', response.result );
			if(response.result.length > 0) {
				$('#btnExportExcelPop').setEnabled(true);
			}
			cflineHideProgressBody();
    	}
    }
    //request 실패시.
    function failCallback(response, flag){
    	if(flag == 'searchList'){
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
    	cflineShowProgressBody();
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : title + "_" + date,		
     		sheetList: [{
     			sheetName: title,		
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