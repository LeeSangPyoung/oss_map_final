/**
 * DcsUseReport.js
 *
 * @author P123512
 * @date 2018.03.26
 * @version 1.0
 */
var main = $a.page(function() {
	var whole = cflineCommMsgArray['all'] /* 전체 */;
	var gridId = 'dataGrid';
	var dcsList_data = [];
	var mgmtGrpCd = null;
	var dcsNm = null;
	var orgId = null;
	var teamId = null;
	var tmof = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
    	tomfHeaderYn = "Y";
    	getGrid();
    	setSelectCode();
        setEventListener();

    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode(){
    	createMgmtGrpSelectBox ("mgmtGrpNm", "N", "SKT");
    	setSearchCode("orgId", "teamId", "tmof");
    	setDCScode();
    }
    
    
    function setEventListener() {
     	//조회 
     	 $('#btnSearch').on('click', function(e) {
     		if( nullToEmpty($('#eqpId').val()) == "") {
     			alertBox('I', "선택할 DCS장비가 없습니다.");		
     			return;
     		}
        	var dataParam =  $("#searchForm").getData(); 
        	cflineShowProgressBody();
     		orgId = null;
     		teamId = null;
     		tmof = null;
        	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsusereport/getdcsusereport', dataParam, 'GET', 'getDcsUseReportList');

          });
         
 		//관리그룹 선택시
 		$('#mgmtGrpNm').on('change', function(e) {
 			changeMgmtGrp("mgmtGrpNm", "orgId", "teamId", "tmof", "tmof");
 			changeDCSList();
 		});
 		
 		//본부 선택시
 		$('#orgId').on('change', function(e) {
 			changeHdofc("orgId", "teamId", "tmof", "tmof");
 			changeDCSList();
 		});
 		
 		//팀 선택시
     	$('#teamId').on('change',function(e){
     		changeTeam("teamId", "tmof", "tmof");
     		changeDCSList();
       	});
     	
 		//전송실 선택시
     	$('#tmof').on('change',function(e){
     		changeDCSList();
       	});
   
    	$('#btnExportExcel').on('click', function(e) {
    		cflineShowProgressBody();
        	excelDownload();
        });
    	
     	// 포트 클릭했을 때 
 		$('#'+gridId).on('click', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
 			var dataKey = dataObj._key;
 			
     	 	if (dataKey == "portNm" ) {
     	 		detailPop(dataObj);
     	 	}
 		});
 
	};
	
	function changeDCSList() {
		var comboData = {  "tmof" : $('#tmof').val()
				, "teamId" : $('#teamId').val()
				, "orgId" : $('#orgId').val()  
		};
		setDCScode(comboData);
	}
	
    //엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : '사용율현황(DCS)_'+date,
     		sheetList: [{
     			sheetName: '사용율현황(DCS)',
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
    
	function getGrid() {
		 $('#'+gridId).alopexGrid({
	            autoColumnIndex : true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	            rowClickSelect : true,
	            rowSingleSelect : true,
	            numberingColumnFromZero : false,
	    		defaultColumnMapping:{sorting: false},
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		columnMapping: [
					  {key : 'eqpNm',			    		align:'center',			width:'150px',		title : cflineMsgArray['equipmentName']				/* 장비명 */}
		            , {key : 'portNm',              		align:'center',	        width:'170px',		title : cflineMsgArray['port'] ,inlineStyle : {color: 'blue',cursor:'pointer'}/* 포트*/ }
					, {key : 'cardNm',			        	align:'center',		    width:'230px',		title : cflineMsgArray['cardName']					/* 카드명 */ }
					, {key : 'cardMdlNm',					align:'center',			width:'150px',		title : cflineMsgArray['cardMdlNm']					/* 카드모델 */ }
					, {key : 'capaCdNm',					align:'center',			width:'150px',		title : cflineMsgArray['capacity']					/* 용량 */ }
					, {key : 'e1CapaCvsnVal',				align:'right',			width:'170px',		title : "수용E1수"			,render : {type: 'string', rule : 'comma'} /* 수용E1수  */ }
					, {key : 'crsE1CapaCvsnVal',			align:'right',			width:'170px',		title : "CRS기준E1수"		,render : {type: 'string', rule : 'comma'} /* CRS기준E1수 */ }
					, {key : 'crsE1Rate',					align:'right',			width:'170px',		title : "CRS기준사용율"		,render : {type: 'string', rule : 'comma'} /* CRS기준사용율 */ }
					, {key : 'lineE1',						align:'right',			width:'170px',		title : "선번기준E1수"		,render : {type: 'string', rule : 'comma'} /* 선번기준E1수 */ }
					, {key : 'lineE1Rate',					align:'right',			width:'170px',		title : "선번기준사용율"		,render : {type: 'string', rule : 'comma'} /* 선번기준사용율 */ }
			]}); 
	} 

	/**
	 *  DCS 목록 조회
	 */
	function setDCScode(comboData) {  
		if(nullToEmpty(comboData) == "" ) {
			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getDCScode', null, 'GET', 'getDCScode');
		} else {
			httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getDCScode', comboData, 'GET', 'getDCScode');
		}
	}
	
    //상세팝업
    function detailPop(rowData){
    	
    	var dataKey = rowData._key;
    	var gridData = { "mgmtGrpCd" : mgmtGrpCd 
    					,"orgId" : orgId
    					,"teamId" : teamId
    					,"tmof" : tmof
    					,"eqpNm" : rowData.eqpNm
    					,"portNm": rowData.portNm
    					,"eqpId" : rowData.eqpId
    					,"portId" : rowData.portId
    	};
		 $a.popup({
 			popid: "DcsUseReportDetailPop",
 			title: "사용율현황상세(DCS PORT별 일치성 현황)",
 			url: $('#ctx').val()+'/statistics/configmgmt/DcsUseReportDetailPop.do',
 			data : gridData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1500,
 			height : 650,
 			callback:function(data){
 				if(data != null){
 				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}  
		});
    }
	
	function successCallback(response, status, jqxhr, flag){
		//사용율현황 조회
		if(flag == 'getDcsUseReportList') {
			if(nullToEmpty($('#mgmtGrpNm').val()) != "") {
				if(nullToEmpty(response.getDcsUseReportList) != "") {
					mgmtGrpCd = response.getDcsUseReportList[0].mgmtGrpCd;
				}
			}
			if(nullToEmpty($('#orgId').val()) != "") {
				if(nullToEmpty(response.getDcsUseReportList) != "") {
					orgId = response.getDcsUseReportList[0].grpOrgId;
				}
			}
			if(nullToEmpty($('#teamId').val()) != "") {
				if(nullToEmpty(response.getDcsUseReportList) != "") {
					teamId = response.getDcsUseReportList[0].teamId;
				}
			}
			if(nullToEmpty($('#tmof').val()) != "") {
				if(nullToEmpty(response.getDcsUseReportList) != "") {
					tmof = response.getDcsUseReportList[0].topMtsoId;
				}
			}
			cflineHideProgressBody();
			$('#'+gridId).alopexGrid("dataSet", response.getDcsUseReportList);
			$('#btnExportExcel').setEnabled(true);	
		}
		//DCS 목록 콤보박스
	 	if(flag == 'getDCScode'){
	 		dcsList_data =  [];
			for(i=0; i<response.getDCScode.length; i++){
				var dataL = response.getDCScode[i]; 
/*				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					dcsList_data.push(dataFst);
				}*/
				dcsList_data.push(dataL);
			}
			$('#eqpId').clear();
			$('#eqpId').setData({data : dcsList_data});
    	}
    }


    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'getDcsUseReportList'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
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