/**
 * DcsUseReportDetailPop.js
 *
 * @author P123512
 * @date 2018.03.26
 * @version 1.0
 */
var gridId = 'dataGridPop';
var paramData = null;
var excelFileSheetName = "";
var param = {};
var whole = cflineCommMsgArray['all'] /* 전체 */;
var bonbuList_data = [];
var teamList_data = [];
var mtsoList_data = [];
var dcsEqpId = [];
var portNm = null;
var mgmtGrpCd = null;
$a.page(function() {
	
	this.init = function(id, param) {
		paramData = param;
		
		portNm = paramData.portNm;
		dcsEqpId.push(paramData.eqpId);
		dcsEqpId.push('');
        mgmtGrpCd = paramData.mgmtGrpCd;
		$('#title').text("사용율현황상세(DCS PORT별 일치성현황)");
		$('#digitalCrossConnectSystem').val(paramData.eqpNm);
		$('#portEng').val(paramData.portNm);
		$('#btnExportExcel').setEnabled(false);
        setEventListener();
        initGrid();
        setSelectCode();
        
        
	};
	
	
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsusereport/getbonbulist', paramData, 'GET', 'getBonBuList');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsusereport/getteamlist', paramData, 'GET', 'getTeamList');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsusereport/getmtsolist', paramData, 'GET', 'getMtsoList');
    	
    
		 var data = "mgmtGrpCd="+mgmtGrpCd+"&orgId="+paramData.orgId+"&teamId="+paramData.teamId+"&tmof="+paramData.tmof+"&portEng="+portNm+"&dcsEqpId="+dcsEqpId[0]; 
		
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getDcsSameReportList', data ,'GET','getDcsUseReportDetailList');
    }
	
	//Grid 초기화
	function initGrid() {
		
		var headerGroup = [
                       { fromIndex : 3, toIndex : 6, 		title : cflineMsgArray['crs']  							/* CRS */},
                       { fromIndex : 7, toIndex : 10, 		title : cflineMsgArray['lno']							/* 선번 */}
         ]
		
		var columnMapping = [
			                      {key : 'grpOrgNm',		align:  'center',		width:  '150px',			title : cflineMsgArray['headOffice'],rowspan:true		/* 본부    */ }
			                    , {key : 'teamNm',			align : 'center', 		width : '150px', 			title : cflineMsgArray['team']		,rowspan:true		/* 팀       */}
			                    , {key : 'topMtsoNm',		align : 'center',		width : '150px',			title : cflineMsgArray['transmissionOffice'],rowspan:true/* 전송실 */}
			                    , {key : 'aChannelDescr', 	align : 'center', 		width : '200px', 			title : cflineMsgArray['aPort'] 						/* A포트 */}
			                    , {key : 'zChannelDescr', 	align : 'center', 		width : '200px', 			title : cflineMsgArray['bPort']							/* B포트 */}
			                    , {key : 'capaCdNm', 		align : 'center',		width : '120px', 			title : cflineMsgArray['capacity'] 						/* 용량   */}
			                    , {key : 'rmPathName', 		align : 'left', 		width : '350px', 			title : cflineMsgArray['pathNm'] 					    /* PATH명 */}
			                    , {key : 'aChnlDescr', 		align : 'center', 		width : '200px', 			title : cflineMsgArray['aPort'] 						/* A포트  */}
			                    , {key : 'bChnlDescr', 		align : 'center', 		width : '200px', 			title : cflineMsgArray['bPort']							/* B포트  */}
			                    , {key : 'lineNm', 			align : 'left', 		width : '230px', 			title : cflineMsgArray['lnNm']							/* 회선명  */}
			                    , {key : 'svlnNo', 			align : 'center', 		width : '200px', 			title : cflineMsgArray['lineNo']						/* 회선번호 */}
			]


		//Grid 생성
		$('#'+gridId).alopexGrid({
    			headerGroup : headerGroup,
				columnMapping : columnMapping,
		    	pager : true,
				rowInlineEdit : true,
				cellSelectable : true,
				autoColumnIndex: true,
				fitTableWidth: true,
				rowClickSelect : true,
				rowSingleSelect : true,
				numberingColumnFromZero : false,
				height : 430,
				message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
					filterNodata : 'No data'
				}
	        	,grouping : {
	        	by : ['grpOrgNm','teamNm' ,'topMtsoNm' ],
	        	useGrouping : true,
	        	useGroupRowspan : true,
	        	}
		});
	};
	
	/*
	 * 조회 함수
	 */
	function searchProc(){
		cflineShowProgressBody();
		$('#btnExportExcel').setEnabled(false);
		var backboneNetworkEqp = $("input:checkbox[id='backboneNetworkEqp']").is(":checked");
		var data = "mgmtGrpCd="+mgmtGrpCd+"&orgId="+$('#orgId').val()+"&teamId="+$('#teamId').val()+"&tmof="+$('#tmof').val()+"&portEng="+portNm+"&dcsEqpId="+dcsEqpId[0]+"&backboneNetworkEqp="+backboneNetworkEqp;
			
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getDcsSameReportList', data ,'GET','getDcsUseReportDetailList');
	}

	function setEventListener() {
    	//조회 
		$('#btnSearch').on('click', function(e) {
   		 	searchProc();   
        });
		 //엑셀다운로드
	    $('#btnExportExcel').on('click', function(e) {
	    	cflineShowProgressBody();
	     	excelDownload();
	    });
	  
	    //닫기
	    $('#btnCncl').on('click', function(e) {
	    	$a.close();
	    });
	    
   		// 본부 선택시
    	$('#orgId').on('change',function(e){
			var teamList =  [];
			var mtsoList =  [];
			if($('#orgId').val() == null || $('#orgId').val() == 'null' || $('#orgId').val() == '' ) {
				$('#teamId').setData({data : teamList_data});
				$('#tmof').setData({data : mtsoList_data});
			}
			else {
				for( i=0 ; i<teamList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						teamList.push(dataFst);
					}
					if(teamList_data[i].uprOrgId == $('#orgId').val()){
						teamList.push(teamList_data[i]);	
					}
				}
				$('#teamId').setData({data : teamList});
				for( i=0 ; i<mtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						mtsoList.push(dataFst);
					}
					if(mtsoList_data[i].orgId == $('#orgId').val()){
						mtsoList.push(mtsoList_data[i]);	
					}
				}
				$('#tmof').setData({data : mtsoList});
			}
      	});    	 
  		// 팀 선택시
    	$('#teamId').on('change',function(e){
    		var mtsoList =  [];
    		if($('#teamId').val() == null || $('#teamId').val() == 'null' || $('#teamId').val() == '' ) {
    			if($('#orgId').val() == null || $('#orgId').val() == 'null' || $('#orgId').val() == '' ) {
    				$('#tmof').setData({data : mtsoList_data});
    			} else {
    				for( i=0 ; i<mtsoList_data.length; i++) {
    					if(i==0){
    						var dataFst = {"uprComCd":"","value":"","text":whole};
    						mtsoList.push(dataFst);
    					}
    					if(mtsoList_data[i].orgId == $('#orgId').val()){
    						mtsoList.push(mtsoList_data[i]);	
    					}
    				}
    				$('#tmof').setData({data : mtsoList});
    			}
			} else {
				for( i=0 ; i<mtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						mtsoList.push(dataFst);
					}
					if(mtsoList_data[i].teamId == $('#teamId').val()){
						mtsoList.push(mtsoList_data[i]);	
					}
				}
				$('#tmof').setData({data : mtsoList});
			}
      	});
	    
	    
	    
	};
	
	//request 성공시
	function successCallback(response, flag) {
		if (flag == 'getDcsUseReportDetailList') {
			$('#btnExportExcel').setEnabled(true);	
			$('#'+gridId).alopexGrid("dataSet", response.getDcsSameReportList);
			cflineHideProgressBody();
			
    	}
		if(flag == 'getBonBuList') {
			bonbuList_data =  [];
			for(i=0; i<response.bonbulist.length; i++){
				var dataL = response.bonbulist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					bonbuList_data.push(dataFst);
				}
				bonbuList_data.push(dataL);
			}
			$('#orgId').clear();
			$('#orgId').setData({data : bonbuList_data});
			
			if(nullToEmpty(paramData.orgId) != "") {
		    	$('#orgId').setData({
		    		orgId:paramData.orgId
				});
			}
		}
		if(flag == 'getTeamList') {
			teamList_data =  [];
			for(i=0; i<response.teamlist.length; i++){
				var dataL = response.teamlist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					teamList_data.push(dataFst);
				}
				teamList_data.push(dataL);
			}
			$('#teamId').clear();
			$('#teamId').setData({data : teamList_data});
			
			if(nullToEmpty(paramData.teamId) != "") {
		    	$('#teamId').setData({
		    		teamId:paramData.teamId
				});
			}
		}
		if(flag == 'getMtsoList') {
			mtsoList_data =  [];
			for(i=0; i<response.mtsolist.length; i++){
				var dataL = response.mtsolist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					mtsoList_data.push(dataFst);
				}
				mtsoList_data.push(dataL);
			}
			$('#tmof').clear();
			$('#tmof').setData({data : mtsoList_data});
			
			if(nullToEmpty(paramData.tmof) != "") {
		    	$('#tmof').setData({
		    		tmof:paramData.tmof
				});
			}
		}
	}
	
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getDcsUseReportDetailList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']);  /*조회 실패 하였습니다.*/
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

    //엑셀다운로드
    function excelDownload() {
    	var date = getCurrDate();
    	var worker = new ExcelWorker({
    		excelFileName : '사용율현황상세(DCS PORT별 일치성현황)_'+date,		
    		sheetList : [{
    			sheetName : '사용율현황상세(DCS PORT별 일치성현황)',
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