/**
 * TieSameReport.js
 *
 * @author P123512
 * @date 2018.03.13
 * @version 1.0
 */

var whole = cflineCommMsgArray['all'] /* 전체 */;
var tBonbuList_data = [];
var tTeamList_data = [];
var tMtsoList_data = [];
var lineTypeSkt =[];
$a.page(function() {
	var gridId = 'dataGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	lineTypeSkt.push({"uprComCd":"","value":"","text":whole});
    	$('#btnExportExcel').setEnabled(false);
 		setSelectCode();
 		getGrid();
        setEventListener();
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/tiesamereport/getsktbonbu', null, 'GET', 'getSKTBonBu');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/tiesamereport/getsktteam', null, 'GET', 'getSKTTeam');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/tiesamereport/getsktmtso', null, 'GET', 'getSKTMtso');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getbmtsosclcdlist', null, 'GET', 'svlnSclBmtsoCodeDataPop');
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
         
     	// 엔터 이벤트 
       	$('#searchForm').on('keydown', function(e){
       		if (e.which == 13  ){
       			searchProc();   
         	}
       	});
    	
     	
	};
	/*
	 * 조회 함수
	 */
	function searchProc(){
		$('#btnExportExcel').setEnabled(false);
    	var dataParam =  $("#searchForm").getData(); 
    	dataParam.nonEqual = $("input:checkbox[id='nonEqual']").is(":checked");
    	cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/tiesamereport/gettiesamereportlist', dataParam, 'GET', 'getTieSameReportList');
	}
	
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'getTieSameReportList'){
			cflineHideProgressBody();
			$('#'+gridId).alopexGrid("dataSet", response.getTieSameReportList);
			$('#btnExportExcel').setEnabled(true);	
		}
		// T본부 셋팅
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
		//T팀 셋팅
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
		//T전송실 셋팅
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
		//회선유형 셋팅 
		if(flag == 'svlnSclBmtsoCodeDataPop') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			for(var index = 0 ; index < response.sclCdList.length ; index++) {
				lineTypeSkt.push(response.sclCdList[index]);
			}
			$('#lineType').setData({data : lineTypeSkt});
		}

	}

	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getTieSameReportList'){
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
     		excelFileName : 'Tie일치성현황_'+date,
     		sheetList: [{
     			sheetName: 'Tie일치성현황',
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
    function getGrid() {
	    	
          var columnMapping = [
  					  {key : 'lineNm',			 	align:'left',		    width:'330px',		title : cflineMsgArray['lnNm']						/* 회선명 */}
  		            , {key : 'svlnSclNm',          	align:'center',	       	width:'100px',		title : cflineMsgArray['lineType']					/* 회선유형 */ }
  					, {key : 'svlnTypNm',		   	align:'center',		    width:'120px',		title : cflineMsgArray['serviceName']				/* 서비스명 */ }
  					, {key : 'ogTie1',				align:'left',			width:'270px',		title : "OG_TIE"	, 								/* OG_TIE */
  						inlineStyle : function(value,data) {
  							if(data.tieMatchYn == "NOK") {
	  							if(data.isOg == "NOK" && data.isOg != undefined ) {
	  								return {background: 'pink'};
	  							}
  							}
  						}
  					} 
  					, {key : 'icTie1',				align:'left',			width:'270px',		title : "IC_TIE"	, 								/* IC_TIE */ 
  						inlineStyle : function(value,data) {
  							if(data.tieMatchYn == "NOK") {
	  							if(data.isIc == "NOK" && data.isIc != undefined ) {
	  								return {background: 'pink'};
	  							}
  							}
  						}  						
  					}
  					, {key : 'uprMtsoNm',			align:'center',			width:'150px',		title : cflineMsgArray['upperMtso']					/* 상위국사 */ }
  					, {key : 'lowMtsoNm',			align:'center',			width:'150px',		title : cflineMsgArray['lowerMtso']					/* 하위국사 */ }
  					, {key : 'uprSystmNm',			align:'center',			width:'130px',		title : "상위시스템"									/* 상위시스템 */ }
  					, {key : 'lowSystmNm',			align:'center',			width:'130px',		title : "하위시스템" 									/* 하위시스템 */ }
  			]
  				
    	
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
	    		columnMapping: columnMapping
    		 }); 
    } 
    
    
});