/**
 * KpiReportSkt.js
 *
 * @author P095783
 * @date 2017.12.10
 * @version 1.0
 */
var gridId = 'dataGridPop';
var paramData = null;
var excelFileSheetName = "";

$a.page(function() {
	this.init = function(id, param) {
		$('#btnExportExcelPop').setEnabled(false);
		paramData = param;
		$('#topMtsoNm').val(param.topMtsoNm);
		var selectGubun = param.selectGubun;
		getTitleExcelName(selectGubun);
        setEventListener();
        initGrid();
        searchList(selectGubun);
	};
	
	//Grid 초기화
	function initGrid() {
		if(paramData.selectGubun == '01') {
			if(paramData.gubun == "링"){
				var columnMapping = [
					                    {key : 'gubun',			align:'left',			width:'200px',			title : cflineMsgArray['division']							/* 구분 */ }
					                    , {key : 'ntwkLineNm', 				align : 'left', 			width : '200px', 		title : cflineMsgArray['lnNm']								/* 회선명 */}
					                    , {key : 'ntwkTypNm',				align : 'left',				width : '200px',		title : cflineMsgArray['networkType']					/* 네트워크 타입 */}
					                    , {key : 'mtsoLnoInsProgStatCd', 		align : 'left', 			width : '200px', 		title : '작업 진행상태' 											/* 작업 진행상태 */}
					]
			}else{
				var columnMapping = [
					                    {key : 'gubun',			align:'left',			width:'200px',			title : cflineMsgArray['division']							/* 구분 */ }
					                    , {key : 'eqpNm', 				align : 'left', 			width : '200px', 		title : "장비명"}
					                    , {key : 'eqpRoleDivNm',				align : 'left',				width : '200px',		title : cflineMsgArray['networkType']					/* 네트워크 타입 */}
					                    , {key : 'mgmtInfNrgstYn', 		align : 'left', 			width : '200px', 		title : '등록여부' 											/* 작업 진행상태 */}
					]
			}
		}
		else if(paramData.selectGubun == '02') {
			var columnMapping = [
			                     	{key : 'lineNm',		align : 'left',	width : '200', 	title : '회선명'}
			                     	, {key : 'svlnSclNm', 		align : 'left', 	width : '200px', 	title : '회선구분'}
			                     	, {key : 'svlnStatNm', 		align : 'left', 	width : '200px', 	title : '회선상태'}
			                     	, {key : 'svlnTypNm', 		align : 'left', 	width : '200px', 	title : '서비스구분'}
			                     	, {key : 'mtsoLnoInsProgStatNm', 		align : 'left', 	width : '200px', 	title : '선번작업 진행상태'}
			                     ]
		}
		else if(paramData.selectGubun == '03') {
			var columnMapping = [ 
			                      { key : 'lineNm', align : 'left' , width : '200', title : '회선명' }
			                      ,{ key : 'lesCommBizrNm', align : 'left' , width : '200', title : '사업자' }
			                      ,{ key : 'rtLnoCttNm', align : 'left' , width : '200', title : 'RT선번내용' }
			                      ]
		}
		else if(paramData.selectGubun == '04') {
			if(paramData.gubun == "DCS일치성"){
				var columnMapping = [ 
				                       {key : 'gubun',			align:'center',			width:'100px',			title : cflineMsgArray['division']	/* 구분 */ }
						              ,{ key : 'modelName', align : 'center' , width : '100', title : '모델명' }
				                      ,{ key : 'eqpNm', align : 'center' , width : '100', title : '장비명' }
				                      ,{ key : 'aChannelDescr', align : 'left' , width : '100', title : 'CRS A PORT' }
				                      ,{ key : 'bChannelDescr', align : 'left' , width : '100', title : 'CRS B PORT' }
				                      ,{ key : 'capacityNm', align : 'center' , width : '50', title : '용량' }
				                      ,{ key : 'rmPathName', align : 'left' , width : '200', title : 'RM PATH명' }
				                      ,{ key : 'aPortDescr', align : 'left' , width : '100', title : '선번 A PORT' }
				                      ,{ key : 'bPortDescr', align : 'left' , width : '100', title : '선번 B PORT' }
				                      ,{ key : 'lineNm', align : 'left' , width : '200', title : '회선명' }
				                      ,{ key : 'svlnNo', align : 'center' , width : '100', title : '회선번호' }
				                      ]
			} else {
				var columnMapping = [ 
				                       {key : 'gubun',			align:'center',			width:'100px',			title : cflineMsgArray['division']	/* 구분 */ }
						              ,{ key : 'modelName', align : 'center' , width : '100', title : '모델명' }
				                      ,{ key : 'eqpNm', align : 'center' , width : '100', title : '장비명' }
				                      ,{ key : 'aChannelDescr', align : 'left' , width : '150', title : 'CRS A PORT' }
				                      ,{ key : 'bChannelDescr', align : 'left' , width : '150', title : 'CRS B PORT' }
				                      ,{ key : 'svlnNo', align : 'center' , width : '150', title : '회선번호' }
				                      ,{ key : 'lineNm', align : 'left' , width : '250', title : '회선명' }
				                      ,{ key : 'remark', align : 'left' , width : '300', title : '비고' }
				                      ]
			}
			
		}
		/*	else if(selectGubun == '05') {
			var columnMapping = [
			                     	{key: '', 		align : 'center', 	width : '80px', 	title : '회선명'}
			                     	, {key : '', 	align : 'left',			width : '130px',	title : 'TDM, 장비 등록 유무'}
			                     	, {key : '', 	align : 'left', 		width : '130px', 	title : 'CRS 포트정보 일치 유무'}
			                     ]
		}*/
		
		//Grid 생성
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
				height : 350,
				message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
					filterNodata : 'No data'
				}
		});
	};
	
	function searchList(selectGubun) {
		cflineShowProgressBody();
		if(selectGubun == '01') {
			var gubun = "";
			if(paramData.gubun == '링'){
				gubun = '001';
			}else{
				gubun = '002';
			}
			var param = { "selectGubun" : paramData.selectGubun
								, "ntwkTypCd" : paramData.ntwkTypCd
								, "topMtsoId" :  paramData.topMtsoId
								, "topMtsoCdList" :  paramData.topMtsoId
								, "gubun" : gubun
							};
		} else if(selectGubun == '02') {
			var param = { "selectGubun" : paramData.selectGubun
								, "svlnLclCd" : paramData.svlnLclCd
								, "svlnSclCd" : paramData.svlnSclCd
								, "svlnTypCd" : paramData.svlnTypCd 
								, "topMtsoId" : paramData.topMtsoId
								, "topMtsoCdList" : paramData.topMtsoId
							};
		} else if ( selectGubun == '03' ){
			var param = { "selectGubun" : paramData.selectGubun
					, "standardDate" : paramData.standardDate
					, "topMtsoId" : paramData.topMtsoId
					, "topMtsoCdList" : paramData.topMtsoId
					, "svlnStatCd" : paramData.svlnStatCd
					, "lineCapaCd" : paramData.lineCapaCd
					, "svlnTypCd" : paramData.svlnTypCd
					, "lesCommBizrId" : paramData.lesCommBizrId
				};
			
		} else if(selectGubun == '04') {
			var gubun = "";
			if(paramData.gubun == 'DCS일치성'){
				gubun = '001';
			}else{
				gubun = '002';
			}
			
			var param = {"selectGubun" : paramData.selectGubun
					, "standardDate" : paramData.standardDate
					, "tmofCd" : paramData.tmofCd
					, "modelCode" : paramData.modelCode
					, "gubun" : gubun
					, "eqpId" : paramData.eqpId
					, "teamCd" : paramData.teamCd
					}
		}
		
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kpireport/getKpiReportSktDetailList', param, 'GET', 'searchList');
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
	function successCallback(response, flag) {
		if (flag == 'searchList') {
			if( response.list.length > 0 ){
				$('#'+gridId).alopexGrid('dataSet', response.list );
				$('#btnExportExcelPop').setEnabled(true);
				if(paramData.topMtsoNm != "TOTAL") {
					$('#bonbuNm').val(response.list[0].bonbuNm);
					$('#teamNm').val(response.list[0].teamNm);
					$('#topMtsoNm').val(response.list[0].topMtsoNm);
				}
			}
			cflineHideProgressBody();
    	}
	}
	
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'searchList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }
    
    function getTitleExcelName(selectGubun){
    	if(selectGubun == '01'){
    		$('#title').text("장비 및 링 등록율 상세조회");
    		excelFileSheetName = "장비 및 링 등록율 상세";
    	}else if(selectGubun == '02'){
    		$('#title').text("회선 등록율 상세조회");
    		excelFileSheetName = "회선 등록율 상세";
    	}else if(selectGubun == '03'){
    		$('#title').text("기지국 회선 RT PORT 등록율 작업 상세조회");
    		excelFileSheetName = "기지국 회선 RT PORT 등록율 작업 상세";
    	}else if(selectGubun == '04'){
    		$('#title').text("DCS CRS일치율(E1) 상세조회");
    		excelFileSheetName = "DCS CRS일치율(E1) 상세";
    	}else{
    		$('#title').text();
    		excelFileSheetName = "";
    	}
    }
    
    //엑셀다운로드
    function excelDownload() {
    	var date = getCurrDate();
    	var worker = new ExcelWorker({
    		excelFileName : excelFileSheetName,			/* TEAMS : 장비 및 링 등록율(링) 상세조회 수도권 Network본부 보라매NOC 보라매(T전송실) 날짜 */
    		sheetList : [{
    			sheetName : excelFileSheetName,
    			placement : 'vertical',
    			$grid : $('#'+gridId)
    		}]
    	});
    	
    	worker.export({
    		merge : false,
    		exportHidden : false,
    		useGridColumnWidth : true,
    		border : true,
    		useCSSParser : true
    	});
        cflineHideProgressBody();
    }
});