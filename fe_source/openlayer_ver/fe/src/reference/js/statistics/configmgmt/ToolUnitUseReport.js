/**
 * ToolUnitUseReport.js
 *
 * @author P123512
 * @date 2018.01.03
 * @version 1.0
 */
             

$a.page(function() {
	var gridId = 'dataGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
		$('#sAll').setChecked(true);
		$('#useRate').setEnabled(false);
 		$('#choiceSign').setEnabled(false);
 		
 		tomfHeaderYn = "Y";
		
    	initGrid();
    	setSelectCode();
        setEventListener();
    };
    
  //Grid 초기화
    function initGrid() {
    	var columnMapping = [
    	                     {key : 'GRP_ORG_NM',		    align:'left',			width:'150px',		title : cflineMsgArray['hdofc']								/* 본부 */}
    	                    , {key : 'TEAM_NM',				align:'left',	        width:'150px',		title : cflineMsgArray['team']								/* 팀 */ }
    	        			, {key : 'TOP_MTSO_NM',			align:'left',			width:'170px',		title : cflineMsgArray['transmissionOffice']				/* 전송실 */ }
    	        			, {key : 'EQP_NM',				align:'right',			width:'200px',		title : cflineMsgArray['equipmentName']						/* 장비명 */ }
    	        			, {key : 'sum',					align:'left',			width:'120px',		title : cflineMsgArray['summarization']						/* 합계 */ }
    	        			, {key : 'cardModel',			align:'left',			width:'400px',		title : cflineMsgArray['cardMdlNm']							/* 카드모델 */ }
		]
        //그리드 생성
        $('#'+gridId).alopexGrid({
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
            ,columnMapping : columnMapping
        });
    };
    
    //동적GRID 
    function setGrid(header) {
    	var columnMapping = [
    	                      {key : 'GRP_ORG_NM',			    align:'center',		    width:'150px',		title : cflineMsgArray['hdofc']	,rowspan:true							/* 본부 */}
    	                    , {key : 'TEAM_NM',					align:'center',	        width:'150px',		title : cflineMsgArray['team']	,rowspan:true							/* 팀 */ }
    	        			, {key : 'TOP_MTSO_NM',			    align:'center',		    width:'250px',		title : cflineMsgArray['transmissionOffice']	,rowspan:true			/* 전송실 */ }
    	        			, {key : 'EQP_NM',					align:'center',			width:'330px',		title : cflineMsgArray['equipmentName']	,inlineStyle : {color: 'blue' , cursor:'pointer'} 	
	    	    				,render : function(value, data) {
	    	    					if(data.GRP_ORG_NM == " 합계" || data.TEAM_NM == " 소계" || data.TOP_MTSO_NM == " 소계") {
	    	    						return "";
	    	    					}
	    	    					if (value == null || value == "" || value == '') { 
	    	    					 	return "소계";
	    	    					} else {
	    	    						return value;
	    	    					}

	    	    				}	/* 장비명 */ }
    	        			, {key : 'SUB_TOTAL',				align:'right',		 	width:'90px',		title : cflineMsgArray['summarization']	,render : {type: 'string', rule : 'comma'}	/* 합계 */ }

		]
  
    	for(var index = 0 ; index < header.length; index++) {
    		columnMapping.push( { key : header[index].cardMdlId , align:'right' , width:'150px' , title: header[index].cardMdlNm ,render : {type: 'string', rule : 'comma'} } );
    	}
        //그리드 생성
        $('#'+gridId).alopexGrid({
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
            ,columnMapping : columnMapping
            ,grouping : {
            	by : ['GRP_ORG_NM','TEAM_NM' ,'TOP_MTSO_NM'],
            	useGrouping : true,
            	useGroupRowspan : true,
            }
        });
    	
    }
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	createMgmtGrpSelectBox ("mgmtGrpNm", "N", "SKT");
    	setSearchCode("orgId", "teamId", "tmof");
    	var data =  $("#searchForm").getData();
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/modellist', data, 'GET', 'modelList');
    }
	
	//상세팝업
    function detailPop(rowData){
    	var dataKey = rowData._key;
		var gridData = {  "eqpId" : rowData.EQP_ID
						, "eqpNm" : rowData.EQP_NM
		};
		
		 $a.popup({
 			popid: "ToolUnitUseReportDetailPop",
 			title: "장비유닛 현황상세",
 			url: $('#ctx').val()+'/statistics/configmgmt/ToolUnitUseReportDetailPop.do',
 			data : gridData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1200,
 			height : 650,
 			callback:function(data){
 				if(data != null){
 				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}  
		});
   }
    
    
    function setEventListener() {
      	// 장비명 클릭했을 때 
 		$('#'+gridId).on('click', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
 			var dataKey = dataObj._key;
     	 	if (dataKey == "EQP_NM" && dataObj.EQP_ID != " 소계" && dataObj.EQP_ID != null) {
     	 		detailPop(dataObj);
     	 	}
 		});
 		
 		//관리그룹 선택시
 		$('#mgmtGrpNm').on('change', function(e) {
 			changeMgmtGrp("mgmtGrpNm", "orgId", "teamId", "tmof", "tmof");
 			var data =  $("#searchForm").getData();
 			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/modellist', data, 'GET', 'modelList');
 		});
 		
 		//본부 선택시
 		$('#orgId').on('change', function(e) {
 			changeHdofc("orgId", "teamId", "tmof", "tmof");
 			var data =  $("#searchForm").getData();
 			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/modellist', data, 'GET', 'modelList');
 		});
 		
 		//팀 선택시
     	$('#teamId').on('change',function(e){
     		changeTeam("teamId", "tmof", "tmof");
     		var data =  $("#searchForm").getData();
     		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/modellist', data, 'GET', 'modelList');
       	});
     	
 		//전송실 선택시
     	$('#tmof').on('change',function(e){
     		var data =  $("#searchForm").getData();
     		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/modellist', data, 'GET', 'modelList');
       	});

    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 if(nullToEmpty($('#model').val()) == "" ) {
    			 alertBox('I', "선택할 모델이 없습니다.");	
    			 return;
    		 }
    		 cflineShowProgressBody();
    		 var data =  $("#searchForm").getData();
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/toolunitusereport/gettoolunitusereportlist', data, 'GET', 'getToolUnitUseReportList');
         });

    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
    	
     	
	};
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'modelList') {
        	$('#model').clear();
        	$('#model').setData({data : response.modelList});
		}
		if(flag == 'getToolUnitUseReportList'){
			cflineHideProgressBody();
			setGrid(response.getModelHeader);
			$('#'+gridId).alopexGrid('dataSet', response.getToolUnitUseReportList );
			
			$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
		}
	}
	
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getToolUnitUseReportList'){
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

    //엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : '장비유닛현황_'+date,
     		sheetList: [{
     			sheetName: '장비유닛현황',
     			placement: 'vertical',
     			$grid: $('#'+gridId)
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