/**
 * KukSaOverlapReport.js
 *
 * @author P123512
 * @date 2018.01.05
 * @version 1.0
 */
 var tabIndex = 0      
 var equipDataGrid = 'equipDataGrid';
 var lineDataGrid = 'lineDataGrid';
 
 var mtso = null;
 var popCallBackData = [];
 var mobileLine = null;
 var etcLine = null;
 var companyLine = null; 
 
$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
		$('#sAll').setChecked(true);
		$('#useRate').setEnabled(false);
 		$('#choiceSign').setEnabled(false);
 		
 		tomfHeaderYn = "Y";
		
    	initGrid(tabIndex);
        setEventListener();
    };

    
  //Grid 초기화
    function initGrid(tabIndex) {
    	var equipDataColumn = []
    		equipDataColumn = [
       	                      {key : 'eqpNm',			align:'left',			    width:'250px',		title : cflineMsgArray['equipmentName']								/* 장비명 */ }
       	                    , {key : 'mtsoCnt',			align:'right',	        	width:'80px',		title : "중복건수"	,inlineStyle : {color: 'blue',cursor:'pointer'} ,render : {type: 'string', rule : 'comma'}/* 중복건수 */ }
       	        			, {key : 'mgmtGrpNm',		align:'center',			    width:'100px',		title : cflineMsgArray['managementGroup']							/* 관리그룹 */ }
       	        			, {key : 'topMtsoNm',		align:'center',				width:'180px',		title : cflineMsgArray['transmissionOffice']						/* 전송실 */ }
       	        			, {key : 'uprMtsoNm',		align:'center',				width:'150px',		title : cflineMsgArray['mtso']		                			    /* 국사 */  }
       	        			, {key : 'mtsoNm',			align:'center',				width:'150px',		title : cflineMsgArray['smallMtso']		                  		    /* 국소 */  }
       	        			, {key : 'bpNm',			align:'left',				width:'150px',		title : cflineMsgArray['vend']                             	        /* 제조사 */  }
       	        			, {key : 'eqpMdlNm',		align:'left',				width:'400px',		title : cflineMsgArray['modelName']		                       	    /* 모델명 */  }
       	    ]
    	
    	var lineDataColumn = []
    		lineDataColumn = [
      	                      {key : 'mtsoNm',			    align:'center',			    width:'300px',		title : cflineMsgArray['mtso']+"(국소)"													/* 국사명 */ }
      	                    , {key : 'serviceNm',			align:'left',	       	 	width:'200px',		title : cflineMsgArray['serviceName']													/* 서비스명 */ }
      	        			, {key : 'sktCnt',			    align:'right',			    width:'90px',		title : cflineMsgArray['skTelecom']			,render : {type: 'string', rule : 'comma'}	/* SKT */ }
      	        			, {key : 'skt2Cnt',				align:'right',				width:'90px',		title : cflineMsgArray['skt2']				,render : {type: 'string', rule : 'comma'}	/* SKT2 */ }
      	        			, {key : 'sktAllCnt',			align:'right',				width:'90px',		title : "SKT_ALL"	,   hidden : true		,render : {type: 'string', rule : 'comma'}	/* SKT_ALL */  }
      	        			, {key : 'dlCnt',				align:'right',				width:'90px',		title : cflineMsgArray['dreamLine']			,render : {type: 'string', rule : 'comma'}  /* 드림라인 */  }
      	        			, {key : 'sjCnt',				align:'right',				width:'90px',		title : cflineMsgArray['sj'] 				,render : {type: 'string', rule : 'comma'}  /* SJ */  }
      	        			, {key : 'dcCnt',				align:'right',				width:'90px',		title : cflineMsgArray['dacom']				,render : {type: 'string', rule : 'comma'}	/* 데이콤 */  }
      	        			, {key : 'lguCnt',				align:'right',				width:'90px',		title : cflineMsgArray['lgUplus']			,render : {type: 'string', rule : 'comma'}	/* LGU */  }
      	        			, {key : 'skbCnt',				align:'right',				width:'90px',		title : cflineMsgArray['skBroadBand']		,render : {type: 'string', rule : 'comma'}	/* SKB */  }
      	        			, {key : 'cjCnt',				align:'right',				width:'90px',		title : cflineMsgArray['cj']				,render : {type: 'string', rule : 'comma'}	/* CJ */  }
      	        			, {key : 'cnmCnt',				align:'right',				width:'90px',		title : cflineMsgArray['cnm']				,render : {type: 'string', rule : 'comma'}	/* CNM */  }
      	        			, {key : 'subTotalCnt',			align:'right',				width:'90px',		title : cflineMsgArray['totalSummarization'],render : {type: 'string', rule : 'comma'}	/* 총합계 */  }
      	    ]											


        //그리드 생성
        $('#'+equipDataGrid).alopexGrid({
            autoColumnIndex : true,
            fitTableWidth : true,
            disableTextSelection : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            height : 550,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,columnMapping : equipDataColumn
        });
    	
        //그리드 생성
        $('#'+lineDataGrid).alopexGrid({
            autoColumnIndex : true,
            fitTableWidth : true,
            disableTextSelection : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            height : 550,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,columnMapping : lineDataColumn
        });
    };
    
    //추가 팝업
	function addSearchPop() {
		$a.popup({
			popid: "KukSaOverlapReportSearchPop",
			title: "추가검색",
			url: $('#ctx').val()+'/statistics/configmgmt/KukSaOverlapReportSearchPop.do',
			data : { "data" : popCallBackData },
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1200,
 			height : 800,
 			callback:function(data){
 				if(data != null) {
 					popCallBackData = data;
 				}
 				$('#addSearchText').html("외 "+popCallBackData.length+"개 가 추가 선택 되었습니다.");
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}
		});
	}
	
	//탭 변경
	function tabChange(index) {
		var changeGridId = getGridId(index);
		
		$('#'+changeGridId).alopexGrid("viewUpdate");
		
		if($('#'+changeGridId).alopexGrid("dataGet").length <= 0){
			$('#btnExportExcel').setEnabled(false);
		} else {
			$('#btnExportExcel').setEnabled(true);
		}
	}
	
	// tab에따른 그리드 값
	function getGridId(index) {
		if(index == 0) {
			return changeGridId = 'equipDataGrid';
		} else if(index == 1) {
			return changeGridId = 'lineDataGrid';
		}
	}
	
	//상세팝업
    function detailPop(dataObj){
		var gridData = {  "eqpId" : dataObj.eqpId
				, "mtso" : mtso
				, "mobileLine" : mobileLine
				, "etcLine" : etcLine
				, "companyLine" : companyLine
				, "popCallBackData" : popCallBackData
		};
   
		 $a.popup({
 			popid: "KukSaOverlapReportDetailPop",
 			title: "국사 현황 상세",
 			url: $('#ctx').val()+'/statistics/configmgmt/KukSaOverlapReportDetailPop.do',
 			data : gridData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1700,
 			height : 500,
 			callback:function(data){
 				if(data != null){
 				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}  
		});
    }
	
    function setEventListener() {
     	// 중복건수 클릭했을 때 
 		$('#'+equipDataGrid).on('click', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
 			var dataKey = dataObj._key;
 			
     	 	if (dataKey == "mtsoCnt" ) {
     	 		detailPop(dataObj);
     	 	}
 		});
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 mobileLine = $("input:radio[id='mobileLine']").is(":checked");
    		 etcLine = $("input:radio[id='etcLine']").is(":checked");
    		 companyLine = $("input:radio[id='companyLine']").is(":checked");
    		 mtso = $('#mtso').val();
    		 
    		 if((popCallBackData == null || popCallBackData == '') && (mtso == null || mtso == '') ) {
    			 alertBox('I', "국사(국소) 검색어를 입력하시거나 1개 이상의 국사(국소)를 선택하시기 바랍니다.");		
    			 return;
    		 } 
    		 cflineShowProgressBody();
    		 
    		 var dataParam = "mtso="+mtso+"&mobileLine="+mobileLine+"&etcLine="+etcLine+"&companyLine="+companyLine; 
    		 
    		 for(var index = 0 ; index < popCallBackData.length ; index++ ) {
    			 dataParam += "&popCallBackData="+popCallBackData[index].addmtsoId;
    		 }
    		 
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kuksaoverlapreport/getkuksaoverlapreportlist', dataParam, 'GET', 'getKukSaOverlapReportList');
    		 
         });
    	 
    	// 엔터 이벤트 
      	$('#searchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			 mobileLine = $("input:radio[id='mobileLine']").is(":checked");
	       		 etcLine = $("input:radio[id='etcLine']").is(":checked");
	       		 companyLine = $("input:radio[id='companyLine']").is(":checked");
	       		 mtso = $('#mtso').val();
	       		 
	       		 if((popCallBackData == null || popCallBackData == '') && (mtso == null || mtso == '') ) {
	       			 alertBox('I', "국사(국소) 검색어를 입력하시거나 1개 이상의 국사(국소)를 선택하시기 바랍니다.");		
	       			 return;
	       		 } 
	       		 cflineShowProgressBody();
	       		 
	       		 var dataParam = "mtso="+mtso+"&mobileLine="+mobileLine+"&etcLine="+etcLine+"&companyLine="+companyLine; 
	       		 
	       		 for(var index = 0 ; index < popCallBackData.length ; index++ ) {
	       			 dataParam += "&popCallBackData="+popCallBackData[index].addmtsoId;
	       		 }
	       		 
	       		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kuksaoverlapreport/getkuksaoverlapreportlist', dataParam, 'GET', 'getKukSaOverlapReportList');
        	}
      	});

    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
         
         //추가 검색 
         $('#addSearchBtn').on('click', function(e) {
        	 addSearchPop();
         });
    	
         // 탭 선택 이벤트
	     $("#basicTabs").on("tabchange", function(e, index) {
	 		 tabChange(index);
	 	 });    
	};
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'getKukSaOverlapReportList'){
			$('#'+equipDataGrid).alopexGrid('dataSet', response.getKukSaOverlapReportEquip );
			$('#equipCntSpan').text("("+getNumberFormatDis(response.getEquipListTotalCnt)+")");
			
			$('#'+lineDataGrid).alopexGrid('dataSet', response.getKukSaOverlapReportLine );
			$('#lineCntSpan').text("("+getNumberFormatDis(response.getLineListTotalCnt)+")");
			
			$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
		}
	}
	
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getKukSaOverlapReportList'){
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
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
	//Excel 다운로드
	function excelDownload() {
		var index = parseInt($('#basicTabs').getCurrentTabIndex());
		var changeGridId = getGridId(index);
		var date = getCurrDate();
		
		if(changeGridId == 'equipDataGrid') {
			fileName = "국사현황통계(장비기준)_" + date	;
			sheetNm = "국사현황통계(장비기준)";
		} else {
			fileName = "국사현황통계(회선기준)_" + date	;
			sheetNm = "국사현황통계(회선기준)"	;
		}
		
		cflineShowProgressBody();
		
		var worker = new ExcelWorker({
     		excelFileName : fileName,	
     		sheetList: [{
     			sheetName: sheetNm,
     			placement: 'vertical',
     			$grid: $('#'+changeGridId)
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

    
});