/**
 * LineBtsReport.js
 *
 * @author P123512
 * @date 2018.03.12
 * @version 1.0
 */

var whole = cflineCommMsgArray['all'] /* 전체 */;
var tBonbuList_data = [];
var tTeamList_data = [];
var tMtsoList_data = [];
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
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linebtsreport/getsktbonbu', null, 'GET', 'getSKTBonBu');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linebtsreport/getsktteam', null, 'GET', 'getSKTTeam');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linebtsreport/getsktmtso', null, 'GET', 'getSKTMtso');
    }

    function setEventListener() {
   		// 본부 선택시
    	$('#orgCd').on('change',function(e){
			var tTeamList =  [];
			var tMtsoList =  [];
			if($('#orgCd').val() == null || $('#orgCd').val() == 'null' || $('#orgCd').val() == '' ) {
				$('#teamCd').setData({data : tTeamList_data});
				$('#topMtsoCd').setData({data : tMtsoList_data});
			}
			else {
				for( i=0 ; i<tTeamList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tTeamList.push(dataFst);
					}
					if(tTeamList_data[i].uprOrgId == $('#orgCd').val()){
						tTeamList.push(tTeamList_data[i]);	
					}
				}
				$('#teamCd').setData({data : tTeamList});
				for( i=0 ; i<tMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tMtsoList.push(dataFst);
					}
					if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
						tMtsoList.push(tMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : tMtsoList});
			}
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		var tMtsoList =  [];
    		if($('#teamCd').val() == null || $('#teamCd').val() == 'null' || $('#teamCd').val() == '' ) {
    			if($('#orgCd').val() == null || $('#orgCd').val() == 'null' || $('#orgCd').val() == '' ) {
    				$('#topMtsoCd').setData({data : tMtsoList_data});
    			} else {
    				for( i=0 ; i<tMtsoList_data.length; i++) {
    					if(i==0){
    						var dataFst = {"uprComCd":"","value":"","text":whole};
    						tMtsoList.push(dataFst);
    					}
    					if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
    						tMtsoList.push(tMtsoList_data[i]);	
    					}
    				}
    				$('#topMtsoCd').setData({data : tMtsoList});
    			}
			} else {
				for( i=0 ; i<tMtsoList_data.length; i++) {
					if(i==0){
						var dataFst = {"uprComCd":"","value":"","text":whole};
						tMtsoList.push(dataFst);
					}
					if(tMtsoList_data[i].teamCd == $('#teamCd').val()){
						tMtsoList.push(tMtsoList_data[i]);	
					}
				}
				$('#topMtsoCd').setData({data : tMtsoList});
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
    	cflineShowProgressBody();	
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linebtsreport/getlinebtsreportlist', dataParam, 'GET', 'getLineBtsReportList');
	}
	
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'getLineBtsReportList'){
			$('#btnExportExcel').setEnabled(true);	
			cflineHideProgressBody();
			getGrid("select");
			$('#'+gridId).alopexGrid("dataSet", response.getLineBtsReportList);
		}
		// B본부 셋팅
		if(flag == 'getSKTBonBu') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tBonbuList_data =  [];
			for(i=0; i<response.bonbulist.length; i++){
				var dataL = response.bonbulist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tBonbuList_data.push(dataFst);
				}
				tBonbuList_data.push(dataL);
			}
			$('#orgCd').clear();
			$('#orgCd').setData({data : tBonbuList_data});
		}
		//B팀 셋팅
		if(flag == 'getSKTTeam') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tTeamList_data =  [];
			for(i=0; i<response.teamlist.length; i++){
				var dataL = response.teamlist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tTeamList_data.push(dataFst);
				}
				tTeamList_data.push(dataL);
				
			}
			$('#teamCd').setData({data : tTeamList_data});

		}
		//B전송실 셋팅
		if(flag == 'getSKTMtso') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			tMtsoList_data =  [];
			if(response.mtsolist.length == 0 ) {
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList_data.push(dataFst);
			}
			for(i=0; i<response.mtsolist.length; i++){
				var dataL = response.mtsolist[i]; 
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tMtsoList_data.push(dataFst);
				}
				tMtsoList_data.push(dataL);
				
			}
			$('#topMtsoCd').setData({data : tMtsoList_data});
		}

	}

	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getLineBtsReportList'){
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
     		excelFileName : '기지국회선현황_'+date,
     		sheetList: [{
     			sheetName: '기지국회선현황',
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
    function getGrid(select) {
    	var headerGroup =[];
    	var columnMapping = [];
    	if(select == "select") {
	    	headerGroup = [
                           { fromIndex : 'oneXSktOper', toIndex : 'subOneX', title : "1X" 								/* 1X */},
                           { fromIndex : 'oneXSktOper', toIndex : 'oneXSktEtc', title : "SKT"							/* SKT */},
                           { fromIndex : 'oneXSktTwoOper', toIndex : 'oneXSktTwoEtc', title : "SKT2"					/* SKT2 */},
                           { fromIndex : 'oneXSktAllOper', toIndex : 'oneXSktAllEtc', title : "SKTALL"					/* SKTALL */},
                           { fromIndex : 'oneXSkbOper', toIndex : 'oneXSkbEtc', title : "SKB"							/* SKB */ },
                           { fromIndex : 'oneXLgu', toIndex : 'oneXEtc', title : "타사업자"								/*타사업자*/},
                           
                           
                           { fromIndex : 'twoGSktOper', toIndex : 'subTwoG', title : "2G" 								/* 2G */},
                           { fromIndex : 'twoGSktOper', toIndex : 'twoGSktEtc', title : "SKT"							/* SKT */},
                           { fromIndex : 'twoGSktTwoOper', toIndex : 'twoGSktTwoEtc', title : "SKT2"					/* SKT2 */},
                           { fromIndex : 'twoGSktAllOper', toIndex : 'twoGSktAllEtc', title : "SKTALL"					/* SKTALL */},
                           { fromIndex : 'twoGSkbOper', toIndex : 'twoGSkbEtc', title : "SKB"							/* SKB */ },
                           { fromIndex : 'twoGLgu', toIndex : 'twoGEtc', title : "타사업자"								/*타사업자*/},
                           
                           
                           { fromIndex : 'wcdmaSktOper', toIndex : 'subWcdma', title : "WCDMA" 							/* WCDMA */},
                           { fromIndex : 'wcdmaSktOper', toIndex : 'wcdmaSktEtc', title : "SKT"							/* SKT */},
                           { fromIndex : 'wcdmaSktTwoOper', toIndex : 'wcdmaSktTwoEtc', title : "SKT2"					/* SKT2 */},
                           { fromIndex : 'wcdmaSktAllOper', toIndex : 'wcdmaSktAllEtc', title : "SKTALL"				/* SKTALL */},
                           { fromIndex : 'wcdmaSkbOper', toIndex : 'wcdmaSkbEtc', title : "SKB"							/* SKB */ },
                           { fromIndex : 'wcdmaLgu', toIndex : 'wcdmaEtc', title : "타사업자"								/*타사업자*/},
                           
                           
                           { fromIndex : 'wibroSktOper', toIndex : 'subWibro', title : "WIBRO" 							/* WIBRO */},
                           { fromIndex : 'wibroSktOper', toIndex : 'wibroSktEtc', title : "SKT"							/* SKT */},
                           { fromIndex : 'wibroSktTwoOper', toIndex : 'wibroSktTwoEtc', title : "SKT2"					/* SKT2 */},
                           { fromIndex : 'wibroSktAllOper', toIndex : 'wibroSktAllEtc', title : "SKTALL"				/* SKTALL */},
                           { fromIndex : 'wibroSkbOper', toIndex : 'wibroSkbEtc', title : "SKB"							/* SKB */ },
                           { fromIndex : 'wibroLgu', toIndex : 'wibroEtc', title : "타사업자"								/*타사업자*/},
                           
                           
                           { fromIndex : 'evDoSktOper', toIndex : 'subEvDo', title : "EVDO" 							/* EVDO */},
                           { fromIndex : 'evDoSktOper', toIndex : 'evDoSktEtc', title : "SKT"							/* SKT */},
                           { fromIndex : 'evDoSktTwoOper', toIndex : 'evDoSktTwoEtc', title : "SKT2"					/* SKT2 */},
                           { fromIndex : 'evDoSktAllOper', toIndex : 'evDoSktAllEtc', title : "SKTALL"					/* SKTALL */},
                           { fromIndex : 'evDoSkbOper', toIndex : 'evDoSkbEtc', title : "SKB"							/* SKB */ },
                           { fromIndex : 'evDoLgu', toIndex : 'evDoEtc', title : "타사업자"								/*타사업자*/}
                           
          ]
          columnMapping = [
  					  {key : 'grpOrgNm',			    	align:'left',			width:'120px',		title : cflineMsgArray['hdofc']				,rowspan:true			/* 본부 */ }
  		            , {key : 'teamNm',              		align:'center',	        width:'120px',		title : cflineMsgArray['team']				,rowspan:true			/* 팀  */  }
  					, {key : 'topMtsoNm',					align:'center',		    width:'170px',		title : cflineMsgArray['transmissionOffice'],rowspan:true			/* 전송실 */}
  					, {key : 'btsNm',						align:'center',			width:'250px',		title : cflineMsgArray['baseMtso']			,rowspan:true			/* 기지국 */}
  					, {key : 'twoWay',						align:'center',			width:'80px',		title : cflineMsgArray['dualostion']								/* 이원화 */}
  					, {key : 'subTotalCnt',					align:'right',			width:'80px',		title : cflineMsgArray['summarization']	,render : {type: 'string', rule : 'comma'}							/* 합계 */ }
  					
  					, {key : 'oneXSktOper',					align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'}								/* 운영 */ }
  					, {key : 'oneXSktRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'}								/* 예비 */ }
  					, {key : 'oneXSktEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'}								/* 기타 */ }
  					, {key : 'oneXSktTwoOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'}								/* 운영 */ }
  					, {key : 'oneXSktTwoRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'}								/* 예비 */ }
  					, {key : 'oneXSktTwoEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'}								/* 기타 */ }
  					, {key : 'oneXSktAllOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'}		,hidden:true									/* 운영 */ }
  					, {key : 'oneXSktAllRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'}		,hidden:true			/* 예비 */ }
  					, {key : 'oneXSktAllEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'}		,hidden:true			/* 기타 */ }
  					, {key : 'oneXSkbOper',					align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'}								/* 운영 */ }
  					, {key : 'oneXSkbRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'}								/* 예비 */ }
  					, {key : 'oneXSkbEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'}								/* 기타 */ }
  					, {key : 'oneXLgu',						align:'right',			width:'70px',		title : "LGU"						,render : {type: 'string', rule : 'comma'}								/* LGU */}
  					, {key : 'oneXDl',						align:'right',			width:'70px',		title : "DL"						,render : {type: 'string', rule : 'comma'}								/* DL */ }
  					, {key : 'oneXSj',						align:'right',			width:'70px',		title : "SJ"						,render : {type: 'string', rule : 'comma'}								/* SJ */ }
  					, {key : 'oneXKt',						align:'right',			width:'70px',		title : "KT"						,render : {type: 'string', rule : 'comma'}								/* KT */ }
  					, {key : 'oneXEtc',						align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'}								/* 기타 */ }
  					, {key : 'subOneX',						align:'right',			width:'70px',		title : cflineMsgArray['subTotal']	,render : {type: 'string', rule : 'comma'}								/* 소계 */ }
  					
  					
  					, {key : 'twoGSktOper',					align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'twoGSktRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'twoGSktEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'twoGSktTwoOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'twoGSktTwoRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'twoGSktTwoEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'twoGSktAllOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 운영 */ }
  					, {key : 'twoGSktAllRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 예비 */ }
  					, {key : 'twoGSktAllEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 기타 */ }
  					, {key : 'twoGSkbOper',					align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'twoGSkbRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'twoGSkbEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'twoGLgu',						align:'right',			width:'70px',		title : "LGU"						,render : {type: 'string', rule : 'comma'} 								/* LGU */}
  					, {key : 'twoGDl',						align:'right',			width:'70px',		title : "DL"						,render : {type: 'string', rule : 'comma'} 								/* DL */ }
  					, {key : 'twoGSj',						align:'right',			width:'70px',		title : "SJ"						,render : {type: 'string', rule : 'comma'} 								/* SJ */ }
  					, {key : 'twoGKt',						align:'right',			width:'70px',		title : "KT"						,render : {type: 'string', rule : 'comma'} 								/* KT */ }
  					, {key : 'twoGEtc',						align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'subTwoG',						align:'right',			width:'70px',		title : cflineMsgArray['subTotal']	,render : {type: 'string', rule : 'comma'} 								/* 소계 */ }
  					
  					
  					, {key : 'wcdmaSktOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'wcdmaSktRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'wcdmaSktEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'wcdmaSktTwoOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'wcdmaSktTwoRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'wcdmaSktTwoEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'wcdmaSktAllOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 운영 */ }
  					, {key : 'wcdmaSktAllRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 예비 */ }
  					, {key : 'wcdmaSktAllEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 기타 */ }
  					, {key : 'wcdmaSkbOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'wcdmaSkbRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'wcdmaSkbEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'wcdmaLgu',					align:'right',			width:'70px',		title : "LGU"						,render : {type: 'string', rule : 'comma'} 								/* LGU */}
  					, {key : 'wcdmaDl',						align:'right',			width:'70px',		title : "DL"						,render : {type: 'string', rule : 'comma'} 								/* DL */ }
  					, {key : 'wcdmaSj',						align:'right',			width:'70px',		title : "SJ"						,render : {type: 'string', rule : 'comma'} 								/* SJ */ }
  					, {key : 'wcdmaKt',						align:'right',			width:'70px',		title : "KT"						,render : {type: 'string', rule : 'comma'} 								/* KT */ }
  					, {key : 'wcdmaEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'subWcdma',					align:'right',			width:'70px',		title : cflineMsgArray['subTotal']	,render : {type: 'string', rule : 'comma'} 								/* 소계 */ }
  					
  					
  					, {key : 'wibroSktOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'wibroSktRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'wibroSktEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'wibroSktTwoOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'wibroSktTwoRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'wibroSktTwoEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'wibroSktAllOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 운영 */ }
  					, {key : 'wibroSktAllRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 예비 */ }
  					, {key : 'wibroSktAllEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']	    ,render : {type: 'string', rule : 'comma'} 		,hidden:true			/* 기타 */ }
  					, {key : 'wibroSkbOper',				align:'right',			width:'70px',		title : "운영"						,render : {type: 'string', rule : 'comma'} 								/* 운영 */ }
  					, {key : 'wibroSkbRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']		,render : {type: 'string', rule : 'comma'} 								/* 예비 */ }
  					, {key : 'wibroSkbEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'wibroLgu',					align:'right',			width:'70px',		title : "LGU"						,render : {type: 'string', rule : 'comma'} 								/* LGU */}
  					, {key : 'wibroDl',						align:'right',			width:'70px',		title : "DL"						,render : {type: 'string', rule : 'comma'} 								/* DL */ }
  					, {key : 'wibroSj',						align:'right',			width:'70px',		title : "SJ"						,render : {type: 'string', rule : 'comma'} 								/* SJ */ }
  					, {key : 'wibroKt',						align:'right',			width:'70px',		title : "KT"						,render : {type: 'string', rule : 'comma'} 								/* KT */ }
  					, {key : 'wibroEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']		,render : {type: 'string', rule : 'comma'} 								/* 기타 */ }
  					, {key : 'subWibro',					align:'right',			width:'70px',		title : cflineMsgArray['subTotal']	,render : {type: 'string', rule : 'comma'} 								/* 소계 */ }
  					
  					
  					
  					, {key : 'evDoSktOper',					align:'right',			width:'70px',		title : "운영"					,render : {type: 'string', rule : 'comma'} 									/* 운영 */ }
  					, {key : 'evDoSktRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']	,render : {type: 'string', rule : 'comma'} 									/* 예비 */ }
  					, {key : 'evDoSktEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']	,render : {type: 'string', rule : 'comma'} 									/* 기타 */ }
  					, {key : 'evDoSktTwoOper',				align:'right',			width:'70px',		title : "운영"					,render : {type: 'string', rule : 'comma'} 									/* 운영 */ }
  					, {key : 'evDoSktTwoRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']	,render : {type: 'string', rule : 'comma'} 									/* 예비 */ }
  					, {key : 'evDoSktTwoEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']	,render : {type: 'string', rule : 'comma'} 									/* 기타 */ }
  					, {key : 'evDoSktAllOper',				align:'right',			width:'70px',		title : "운영"					,render : {type: 'string', rule : 'comma'} 			,hidden:true			/* 운영 */ }
  					, {key : 'evDoSktAllRes',				align:'right',			width:'70px',		title : cflineMsgArray['spare']	,render : {type: 'string', rule : 'comma'} 			,hidden:true			/* 예비 */ }
  					, {key : 'evDoSktAllEtc',				align:'right',			width:'70px',		title : cflineMsgArray['etc']	,render : {type: 'string', rule : 'comma'} 			,hidden:true			/* 기타 */ }
  					, {key : 'evDoSkbOper',					align:'right',			width:'70px',		title : "운영"					,render : {type: 'string', rule : 'comma'} 									/* 운영 */ }
  					, {key : 'evDoSkbRes',					align:'right',			width:'70px',		title : cflineMsgArray['spare']	,render : {type: 'string', rule : 'comma'} 									/* 예비 */ }
  					, {key : 'evDoSkbEtc',					align:'right',			width:'70px',		title : cflineMsgArray['etc']	,render : {type: 'string', rule : 'comma'} 									/* 기타 */ }
  					, {key : 'evDoLgu',						align:'right',			width:'70px',		title : "LGU"					,render : {type: 'string', rule : 'comma'} 									/* LGU */}
  					, {key : 'evDoDl',						align:'right',			width:'70px',		title : "DL"					,render : {type: 'string', rule : 'comma'} 									/* DL */ }
  					, {key : 'evDoSj',						align:'right',			width:'70px',		title : "SJ"					,render : {type: 'string', rule : 'comma'} 									/* SJ */ }
  					, {key : 'evDoKt',						align:'right',			width:'70px',		title : "KT"				,render : {type: 'string', rule : 'comma'} 										/* KT */ }
  					, {key : 'evDoEtc',						align:'right',			width:'70px',		title : cflineMsgArray['etc']	,render : {type: 'string', rule : 'comma'} 									/* 기타 */ }
  					, {key : 'subEvDo',						align:'right',			width:'70px',		title : cflineMsgArray['subTotal']	,render : {type: 'string', rule : 'comma'} 								/* 소계 */ }
  					
  	
			]
    	} else {
    		columnMapping = [
    						  {key : 'grpOrgNm',			   	align:'left',			    width:'120px',		title : cflineMsgArray['hdofc']									/* 본부 */ }
    			            , {key : 'teamNm',             		align:'center',	        	width:'120px',		title : cflineMsgArray['team']									/* 팀 */  }
    						, {key : 'topMtsoNm',	      		align:'center',		   		width:'170px',		title : cflineMsgArray['transmissionOffice']					/* 전송실 */ }
    						, {key : 'btsNm',					align:'center',				width:'250px',		title : cflineMsgArray['baseMtso']								/* 기지국 */ }
    						, {key : 'twoWay',					align:'center',				width:'80px',		title : cflineMsgArray['dualostion']							/* 이원화 */ }
    						, {key : 'subTotalCnt',				align:'right',				width:'80px',		title : cflineMsgArray['summarization']							/* 합계 */ }
    						, {key : 'twoGSktOper',				align:'right',				width:'70px',		title : "운영"													/* 운영 */ }
    						, {key : 'twoGSktRes',				align:'right',				width:'70px',		title : cflineMsgArray['spare']									/* 예비 */ }
    						, {key : 'twoGSktEtc',				align:'right',				width:'70px',		title : cflineMsgArray['etc']									/* 기타 */ }
    						, {key : 'twoGSktTwoOper',			align:'right',				width:'70px',		title : "운영"													/* 운영 */ }
    						, {key : 'twoGSktTwoRes',			align:'right',				width:'70px',		title : cflineMsgArray['spare']									/* 예비 */ }
    						, {key : 'twoGSktTwoEtc',			align:'right',				width:'70px',		title : cflineMsgArray['etc']									/* 기타 */ }
    						, {key : 'twoGSktAllOper',			align:'right',				width:'70px',		title : "운영"								,hidden:true		/* 운영 */ }
    	  					, {key : 'twoGSktAllRes',			align:'right',				width:'70px',		title : cflineMsgArray['spare']				,hidden:true		/* 예비 */ }
    	  					, {key : 'twoGSktAllEtc',			align:'right',				width:'70px',		title : cflineMsgArray['etc']				,hidden:true		/* 기타 */ }
    						, {key : 'twoGSkbOper',				align:'right',				width:'70px',		title : "운영"													/* 운영 */ }
    						, {key : 'twoGSkbRes',				align:'right',				width:'70px',		title : cflineMsgArray['spare']									/* 예비 */ }
    						, {key : 'twoGSkbEtc',				align:'right',				width:'70px',		title : cflineMsgArray['etc']									/* 기타 */ }
    						, {key : 'twoGPw',					align:'right',				width:'70px',		title : "PW"													/* PW */ }
    						, {key : 'twoGDl',					align:'right',				width:'70px',		title : "DL"													/* DL */ }
    						, {key : 'twoGSj',					align:'right',				width:'70px',		title : "SJ"													/* SJ */ }
    						, {key : 'twoGEtc',					align:'right',				width:'70px',		title : cflineMsgArray['etc']									/* 기타 */ }
    						, {key : 'subTwoG',					align:'right',				width:'70px',		title : cflineMsgArray['subTotal']								/* 소계 */ }
    			
    						
    				]
    		    	headerGroup = [
    		                             { fromIndex : 'twoGSktOper', toIndex : 'subTwoG', title : "2G" 																		/* 2G */},
    		                             { fromIndex : 'twoGSktOper', toIndex : 'twoGSktEtc', title : "SKT"																		/* SKT */},
    		                             { fromIndex : 'twoGSktTwoOper', toIndex : 'twoGSktTwoEtc', title : "SKT2"																/* SKT2 */},
    		                             { fromIndex : 'twoGSktAllOper', toIndex : 'twoGSktAllEtc', title : "SKTALL"															/* SKB */ },
    		                             { fromIndex : 'twoGSkbOper', toIndex : 'twoGSkbEtc', title : "SKB"																		/* SKB */ },
    		                             { fromIndex : 'twoGPw', toIndex : 'twoGEtc', title : "타사업자"																			/*타사업자*/}
    		                             
    		           ]
    	}
    	
    	
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
	    		columnMapping: columnMapping,
	    		headerGroup : headerGroup
	            ,grouping : {
	            	by : ['grpOrgNm','teamNm' ,'topMtsoNm', 'btsNm' ],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
    		 });

    } 
    
    
});