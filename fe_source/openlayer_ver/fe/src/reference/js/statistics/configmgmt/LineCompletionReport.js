/**
 * LineCompletionReport.js
 *
 * @author P123512
 * @date 2017.12.22
 * @version 1.0
 */
var mgmtObj  = [
                	   {"uprComCd":"","value":"","text":cflineCommMsgArray['all']}
                	   ,{value: "Y",text: "O"}
	                   ,{value: "N",text: "X"}
			         ]; 
var whole = cflineCommMsgArray['all'] /* 전체 */;
var bBonbuList_data = [];
var bTeamList_data = [];
var bMtsoList_data = [];
$a.page(function() {
	var gridId = 'dataGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
 		setSelectCode();
 		getGrid();
        setEventListener();
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	$('#coLineVrfYn').clear();
    	$('#coLineVrfYn').setData({data : mgmtObj});
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linecompletionreport/getbizcdlist', null, 'GET', 'bizrCdList');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linecompletionreport/get0002bonbu', null, 'GET', 'get0002BonBu');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linecompletionreport/get0002team', null, 'GET', 'get0002Team');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linecompletionreport/get0002mtso', null, 'GET', 'get0002Mtso');
    }

    function setEventListener() {
   		// 본부 선택시
    	$('#orgCd').on('change',function(e){
			var bTeamList =  [];
			var bMtsoList =  [];
			if($('#orgCd').val() == null || $('#orgCd').val() == 'null' || $('#orgCd').val() == '' ) {
				$('#teamCd').setData({data : bTeamList_data});
				$('#topMtsoCd').setData({data : bMtsoList_data});
			}
			else {
				for( i=0 ; i<bTeamList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						bTeamList.push(dataFst);
					}
					if(bTeamList_data[i].uprOrgId == $('#orgCd').val()){
						bTeamList.push(bTeamList_data[i]);	
					}
				}
				$('#teamCd').setData({data : bTeamList});
				for( i=0 ; i<bMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						bMtsoList.push(dataFst);
					}
					if(bMtsoList_data[i].hdofcCd == $('#orgCd').val()){
						bMtsoList.push(bMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : bMtsoList});
			}
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		var bMtsoList =  [];
    		if($('#teamCd').val() == null || $('#teamCd').val() == 'null' || $('#teamCd').val() == '' ) {
    			if($('#orgCd').val() == null || $('#orgCd').val() == 'null' || $('#orgCd').val() == '' ) {
    				$('#topMtsoCd').setData({data : bMtsoList_data});
    			} else {
    				for( i=0 ; i<bMtsoList_data.length; i++) {
    					if(i==0){
    						var dataFst = {"uprComCd":"","value":"","text":whole};
    						bMtsoList.push(dataFst);
    					}
    					if(bMtsoList_data[i].hdofcCd == $('#orgCd').val()){
    						bMtsoList.push(bMtsoList_data[i]);	
    					}
    				}
    				$('#topMtsoCd').setData({data : bMtsoList});
    			}
			} else {
				for( i=0 ; i<bMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						bMtsoList.push(dataFst);
					}
					if(bMtsoList_data[i].teamCd == $('#teamCd').val()){
						bMtsoList.push(bMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : bMtsoList});
			}
      	});
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 searchProc();   
         });		
    	 
    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
    	
     	
	};
	/*
	 * 조회 함수
	 */
	function searchProc(){
		$('#btnExportExcel').setEnabled(false);
    	var dataParam =  $("#searchForm").getData(); 
		dataParam.lineOpenDt = dataParam.lineOpenDt.replace(/-/gi,'');
    	cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linecompletionreport/getlinecompletionreportlist', dataParam, 'GET', 'selectLineCompletionReportList');
	}
	
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'selectLineCompletionReportList'){
			$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
			$('#'+gridId).alopexGrid("dataSet", response.LineCompletionReportList);
		}
		// B본부 셋팅
		if(flag == 'get0002BonBu') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			bBonbuList_data =  [];
			for(i=0; i<response.bonbulist.length; i++){
				var dataL = response.bonbulist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					bBonbuList_data.push(dataFst);
				}
				bBonbuList_data.push(dataL);
			}
			$('#orgCd').clear();
			$('#orgCd').setData({data : bBonbuList_data});
		}
		//B팀 셋팅
		if(flag == 'get0002Team') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			bTeamList_data =  [];
			for(i=0; i<response.teamlist.length; i++){
				var dataL = response.teamlist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					bTeamList_data.push(dataFst);
				}
				bTeamList_data.push(dataL);
				
			}
			$('#teamCd').setData({data : bTeamList_data});

		}
		//B전송실 셋팅
		if(flag == 'get0002Mtso') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			bMtsoList_data =  [];
			if(response.mtsolist.length == 0 ) {
				var dataFst = {"uprComCd":"","value":"","text":whole};
				bMtsoList_data.push(dataFst);
			}
			for(i=0; i<response.mtsolist.length; i++){
				var dataL = response.mtsolist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					bMtsoList_data.push(dataFst);
				}
				bMtsoList_data.push(dataL);
				
			}
			$('#topMtsoCd').setData({data : bMtsoList_data});
		}
		// 임차사업자 셋팅
		if(flag == 'bizrCdList') {
	    	var whole = cflineCommMsgArray['all'] /* 전체 */;

			var bizrCdList_data =  [];
			for(i=0; i<response.list.length; i++){
				var dataL = response.list[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					bizrCdList_data.push(dataFst);
				}
				bizrCdList_data.push(dataL);
				
			}
			$('#commBizrId').clear();
			$('#commBizrId').setData({data : bizrCdList_data});
		}
	}

	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'selectLineCompletionReportList'){
    		cflineHideProgressBody();
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
 
    //엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : date+'상하위국별 완료현황',
     		sheetList: [{
     			sheetName: date+'상하위국별 완료현황',
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
    
    
    //Grid 초기화
    var getGrid = function() {
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
					  {key : 'lineNm',			    		align:'left',			    width:'150px',		title : cflineMsgArray['customerName']						/* 고객명 */}
		            , {key : 'svlnNo',              		align:'center',	        width:'150px',		title : cflineMsgArray['lineNo']									/* 회선 번호 */ }
					, {key : 'leslNo',			        	align:'center',		    width:'150px',		title : cflineMsgArray['leaseLineNumber']				/* 임차회선번호 */ }
					, {key : 'commBizrNm',				align:'center',				width:'110px',		title : cflineMsgArray['orderingOrganization']				/* 사업자 */ }
					, {key : 'mgmtGrpCdNm',			align:'center',			width:'110px',		title : cflineMsgArray['managementGroup']					/* 관리그룹 */ }
					, {key : 'svlnSclCdNm',				align:'center',				width:'110px',		title : cflineMsgArray['lineType']								/* 회선유형 */ }
					, {key : 'svlnTypCdNm',				align:'center',				width:'140px',		title : cflineMsgArray['serviceName']							/* 서비스명 */ }
					, {key : 'lineCapaCdNm',			align:'center',			width:'110px',		title : cflineMsgArray['capacity']								/* 용량 */ }
					, {key : 'svlnStatCdNm',			align:'center',			width:'110px',		title : cflineMsgArray['lineStatus']								/* 회선상태 */ }
					, {key : 'faltMgmtObjName',		align:'center',			width:'110px',		title : cflineMsgArray['faultManagementObject']			/* 고장관리대상 */ }
					, {key : 'lineOpenDt',				align:'center',			width:'110px',		title : cflineMsgArray['openingDay']							/* 개통일 */ }
					, {key : 'lastChgDate',				align:'center',			width:'110px',		title : cflineMsgArray['modificationDate']						/* 수정일자 */ }
					, {key : 'lineTrmnSchdDt',			align:'center',			width:'110px',		title : cflineMsgArray['terminationDate'] + '(예정)'			/* 해지일자(예정) */ }
					, {key : 'uprTeamNm',				align:'left',				width:'130px',		title : cflineMsgArray['upperTeam']							/* 상위팀 */ }
					, {key : 'uprMtsoNm',				align:'left',				width:'130px',		title : cflineMsgArray['uprSmtso']								/* 상위국소 */ }
					, {key : 'uprMtsoStatCdNm',		align:'center',			width:'120px',		title : cflineMsgArray['uprSmtsoCompletionStatus'] 		/* 상위국소 완료상태 */ } 
					, {key : 'lowTeamNm',				align:'left',				width:'130px',		title : cflineMsgArray['lowerTeam']							/* 하위팀 */ }
					, {key : 'lowMtsoNm',				align:'left',				width:'130px',		title : cflineMsgArray['lowSmtso']								/* 하위국소 */ }
					, {key : 'lowMtsoStatCdNm',		align:'center',			width:'120px',		title : cflineMsgArray['lowSmtsoCompletionStatus']			/* 하위국소 완료상태 */  }
					, {key : 'mgmtPostCdNm',			align:'center',			width:'110px',		title : cflineMsgArray['postName'] 							/* 포스트명 */ }
					, {key : 'chrStatCdNm',				align:'center',			width:'110px',		title : cflineMsgArray['chargingStatus']			    		/* 과금상태 */ }
					, {key : 'scrbSrvcMgmtNo',		align:'left',				width:'115px',		title : cflineMsgArray['subscriServiceNumber']				/* 가입서비스번호 */ }
					, {key : 'svlnCustNo',				align:'left',				width:'110px',		title : cflineMsgArray['serviceNumber']						/* 서비스번호 */ }
					, {key : 'srvcMgmtNo',				align:'left',				width:'110px',		title : cflineMsgArray['customerNumber']					/* 고객번호 */ }
					, {key : 'cdngMeansTypCdNm',	align:'center',			width:'110px',		title : cflineMsgArray['codingMeansType']					/* 코딩방식유형 */ }
					, {key : 'lineMgmtGrCdNm',		align:'center',			width:'110px',		title : cflineMsgArray['importantGrade']						/* 중요등급 */ }
					, {key : 'lineRmk1',					align:'left',				width:'110px',		title : cflineMsgArray['remark1']								/* 비고1 */ }
					, {key : 'lineRmk2',					align:'left',				width:'110px',		title : cflineMsgArray['remark2']								/* 비고2 */ }
					, {key : 'lineRmk3',					align:'left',				width:'110px',		title : cflineMsgArray['remark3']								/* 비고3 */ }
					, {key : 'coLineVrfYn',				align:'center',			width:'110px',		title : cflineMsgArray['mgmtObj']								/* 관리대상 */ }
			]}); 
    } 
    
    
});