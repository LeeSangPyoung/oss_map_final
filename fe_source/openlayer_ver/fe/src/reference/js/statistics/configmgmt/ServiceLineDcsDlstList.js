/**
 * ServiceLineDlstCurstList
 *
 * @author P100700
 * @date 2017.10.11
 * @version 1.0
 */
var svlnCommCodeData = [];  // 서비스회선 공통코드
var pageForCount = 300;
var gridId = 'dataGrid';

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	createMgmtGrpSelectBox ("mgmtGrpCd", "A", 'SKT');  // 관리 그룹 selectBox
    	$('#btnExportExcel').setEnabled(false);
    	setSelectCode();
    	getGrid();
        setEventListener();   
    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    	// 장비모델 
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/getdcsdlsteqpmdllist', null, 'GET', 'searchEqpMdl');
    }
    
    function setEventListener() {
	 	// 엔터 이벤트 
     	$('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnSearch').click();
    			return false;
    		}
     	});	 
	 	// 국사 keydown
     	$('#eqpNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#eqpCd").val("");
     		}
     	});
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 searchProc();    		 
         });

     	// 관리그룹 클릭시
     	$('#mgmtGrpCd').on('change',function(e){
     		if( $('#mgmtGrpCd').val() == '0001' ){
     		}else{
     		}
     		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
       	});   	 
    	// 본부 선택시
    	$('#hdofcCd').on('change',function(e){
    		changeHdofc("hdofcCd", "teamCd", "tmofCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "tmofCd", "mtso");
      	});      	 
  		// 전송실 선택시
    	$('#tmofCd').on('change',function(e){
    		changeTmof("tmofCd", "mtso");
      	});
        
		//장비찾기
		$('#btnEqpSch').on('click', function(e) {
			
			var mtsoList = [];
			
			if($('#tmofCd').val().length > 0){
				for(k=0; k<$('#tmofCd').val().length; k++){
					mtsoList.push( $('#tmofCd').val()[k] );
	    		}
			}
			
			openEqpPopThis("eqpCd", "eqpNm", $("#eqpNm").val(), mtsoList);
		}); 
		// 그리드 클릭시
		$('#' + gridId).on('click', function(e) {
			var url = "/statistics/configmgmt/ServiceLineDcsDlstDtlInfoPop.do";
			var popid = "popOpenDcsDlstDtlInfo";
			var width = 1000;
			var height = 630;
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var selectedId = $('#' + gridId).alopexGrid('dataGet', {_state:{selected:true}});
        	
        	if (data == null) {
        		return false;
        	}
        	var lineAllStr = "lineCnt,line001Cnt,line003Cnt,line005Cnt,lineBtbCnt";
        	var lineBtsStr = "line002Cnt,lineCnt2g,lineCnt1x,lineCntw,lineCntEtc";
        	var lineNotStr = "hdofcNm,teamNm,tmofNm,eqpNm,dualSuccRate,dualSuccRateImpo,cuidRate,wdualRate";
        	var lineSigStr = "elgSuccessRate,slSuccessRate,onmSuccessRate";
        	
        	//TODO RTE
        	var lineRteStr = "balanTotalRate,balanRate001,balanRate003";
        	
        	var mappKey = object.mapping.key;
        	var columnIndex = object.mapping.columnIndex;
        	//상세팝업이 표시되지 않는 컬럼
        	if(lineNotStr.indexOf(mappKey)>-1){
        		if(mappKey != "dualSucc") {
        			return false;
        		}
        	}
        	var dcsDlstSchDiv = "Cuid";
        	var headerTitle = getHeaderTitle(gridId, columnIndex);  // 헤더 정보 가져오기(그리드에서)
        	if(headerTitle==""){
        		headerTitle = object.mapping.title;
        	}else{
        		headerTitle = headerTitle + " > " + object.mapping.title;
        	}

        	var svlnTypSclCd = "";
        	var svlnSclCd = "";
        	
        	if(lineAllStr.indexOf(mappKey)>-1){  // 수용회선(기지국회선제외)
        		dcsDlstSchDiv = "All";
        		if(mappKey=="line001Cnt"){
            		svlnTypSclCd = "001"
        		}else if(mappKey=="line003Cnt"){
            		svlnTypSclCd = "003"
        		}else if(mappKey=="line005Cnt"){
            		svlnTypSclCd = "005"
        		}else if(mappKey=="lineBtbCnt"){
            		svlnTypSclCd = "B2B"
        		}
        	}else if(lineBtsStr.indexOf(mappKey)>-1){ // 수용회선(기지국회선)
        		dcsDlstSchDiv = "Bts";
        		if(mappKey.indexOf("2g")>0){
            		svlnTypSclCd = "2G"
        		}else if(mappKey.indexOf("1x")>0){
            		svlnTypSclCd = "1X"
        		}else if(mappKey.indexOf("w")>0){
            		svlnTypSclCd = "WC"
        		}else if(mappKey.indexOf("Etc")>0){
            		svlnTypSclCd = "ETC"
        		}
        	}else{  // 나머지
        		dcsDlstSchDiv = "Cuid";
        		if(mappKey.indexOf("2g")>0){
            		svlnTypSclCd = "2G"
        		}else if(mappKey.indexOf("1x")>0){
            		svlnTypSclCd = "1X"
        		}else if(mappKey.indexOf("w")>0){
            		svlnTypSclCd = "WC"
        		}
        	}

    		var dcsCntCd = "";
    		if(mappKey.indexOf("Succ")>0){
    			dcsCntCd = "SUCC"
    		}else if(mappKey.indexOf("Fail")>0){
    			dcsCntCd = "FAIL"
    		}
    		var impoYn = "";
    		if(mappKey.indexOf("Impo")>0){
    			impoYn = "Y"
    		}
    		
    		if(lineSigStr.indexOf(mappKey)>-1){ 
    			dcsDlstSchDiv = "SigOnm";
    			//"elgSuccessRate,slSuccessRate,onmSuccessRate";
    			if(mappKey == "elgSuccessRate") {
    				dcsCntCd = "elgSuccessRate";
    				svlnTypSclCd = "ELG";
        		} else if(mappKey == "slSuccessRate") {
    				dcsCntCd = "slSuccessRate";
    				svlnTypSclCd = "";
        		} else {
    				dcsCntCd = "onmSuccessRate";
    				svlnTypSclCd = "";
        		}
        	}
    		
    		if(lineRteStr.indexOf(mappKey)>-1){ 
    			dcsDlstSchDiv = "Rte";
    			if(mappKey=="balanRate001"){
            		svlnTypSclCd = "001";
            		svlnSclCd = "001";
        		}else if(mappKey=="balanRate003"){
            		svlnTypSclCd = "003";
            		svlnSclCd = "003";
        		}else {
        			svlnTypSclCd = "000";
            		svlnSclCd = "000";
        		}
        	}
    		
        	var belongToTitle = data.hdofcNm;  // 소속 정보 가져오기(그리드 data에서)
        	if(dcsDlstSchDiv != "Rte") {
	        	if(nullToEmpty(data.teamNm) != ""){
	        		belongToTitle = belongToTitle + " - " + data.teamNm;
	        	}
	        	if(nullToEmpty(data.tmofNm) != ""){
	        		belongToTitle = belongToTitle + " - " + data.tmofNm;
	        	}
        	} else {
        		if(nullToEmpty(data.teamNm) != ""){
	        		belongToTitle = belongToTitle + " - " + data.teamNm;
	        	}
        	}
//        	if(map) 기지국 국소수(중요)
//        	var headerGroup = $('#'+gridId).alopexGrid("headerGroupGet");
        	/*
        	 * 총계의 경우 본부, 팀, 전송실이 설정되어 있지 않으므로
        	 * 조회시 선택한 본부, 팀, 전송실을 파라메터로 넘긴다.
        	 */
        	//본부
        	var hdofcCd = "";
        	if(nullToEmpty(data.hdofcCd) == "") {
        		hdofcCd = $('#hdofcCd').val();
        	} else {
        		hdofcCd = nullToEmpty(data.hdofcCd);
        	}
        		
        	//팀
        	var teamCd = "";
    		if(nullToEmpty(data.teamCd) == "") {
    			teamCd = $('#teamCd').val();
        	} else {
        		teamCd = nullToEmpty(data.teamCd);
        	}
    		//전송실
        	var tmofCd = "";
        	if(nullToEmpty(data.tmofCd) == "") {
        		tmofCd = $('#tmofCd').val();
        	} else {
        		tmofCd = nullToEmpty(data.tmofCd);
        	}
//        	var param =  $("#searchForm").serialize();     		
    		var popParam = {"dcsDlstSchDiv":dcsDlstSchDiv, "belongToTitle":belongToTitle, "headerTitle":headerTitle, "svlnTypSclCd":svlnTypSclCd, "svlnSclCd" : svlnSclCd
    				     , "hdofcCd":hdofcCd, "teamCd":teamCd, "tmofCdVal":tmofCd
    				     , "eqpCd":nullToEmpty(data.eqpId), "eqpNm":nullToEmpty(data.eqpNm), "dcsCntCd":nullToEmpty(dcsCntCd), "impoYn":nullToEmpty(impoYn)};

//    		param+="&searchSystem=true";
    		if(dcsDlstSchDiv == "Rte"){
    			url = "/statistics/configmgmt/ServiceLineDcsRteBalanDtlInfoPop.do"; //ServiceLineDcsRteBalanDtlInfoPop
    			popid = "popOpenDcsRteBalanDtlInfo";
    			width = 1500;
    			height = 830;
    		} 
    		
    		$a.popup({
    		  	popid: popid,
    		  	title: cflineMsgArray['dcsStateDetail'] /* DCS 현황 상세 */,
    			url: $('#ctx').val() + url,
    			data: popParam,
    			iframe: true,
    			modal: true,
    			movable:true,
    			windowpopup : true,
    			width : width,
    			height : height,
    			callback:function(data){
					if(data != null){
						if(data == 'invalidParamValue'){
				 			alertBox('I', cflineMsgArray['invalidParamValue']); /* 잘못 전달된 값입니다. */
				 			return;
						} 
					}

    			}
    		});     	
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
		$('#eqpCd').val("");
    	var param =  $("#searchForm").serialize(); 
    	cflineShowProgressBody();		
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlndcsdlstlist', param, 'GET', 'searchAllInfo');

	}

	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['dcsDualostion'],			/* DCS 이원화 */
     		sheetList: [{
     			sheetName: cflineMsgArray['dcsDualostion'],			/* DCS 이원화 */
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
	
	function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchAllInfo'){
    		getGrid();
    		cflineHideProgressBody();
    		$('#'+gridId).alopexGrid("dataSet", response.list);
			$('#btnExportExcel').setEnabled(true);
    	}
    	
    	if(flag == 'searchEqpMdl'){
    		var option_data =  [];
			var dataFst = {"eqpMdlId":"","eqpMdlNm":cflineCommMsgArray['all']};
			option_data.push(dataFst);
    		if(response.eqpMdlList != null){
	    		for(k=0; k<response.eqpMdlList.length; k++){
	    			var dataEqpMdl = response.eqpMdlList[k]; 
	    			option_data.push(dataEqpMdl);
	    		}
    		}
			$('#eqpMdlCd').clear();
			$('#eqpMdlCd').setData({data : option_data});
    	}
    	
	}
    
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchAllInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'searchEqpMdl'){
    		var option_data =  [];
			var dataFst = {"eqpMdlId":"","eqpMdlNm":cflineCommMsgArray['all']};
			option_data.push(dataFst);
			$('#eqpMdlCd').clear();
			$('#eqpMdlCd').setData({data : option_data});
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
    
    function setSPGrid(Data, totalCnt) {
		$('#'+gridId).alopexGrid("dataSet", Data);
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
	    		enableContextMenu:false,
			    columnFixUpto: 3,
	    		pager:false,
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		headerGroup : [
	    		       {fromIndex:4,   toIndex:13, title: cflineMsgArray['acceptLineCount'] /* 수용회선수 */, id:"lineLable"}
	    		       ,{fromIndex:9,  toIndex:13, title: cflineMsgArray['baseMtsoPlace'] /* 기지국간 */, id:"lineBmtsoLable"}
	    		       ,{fromIndex:14, toIndex:26, title: cflineMsgArray['bmtsoSmtsoCountAll'] /* 기지국 국소수(전체) */, id:"lineCntLable"}
	    		       ,{fromIndex:14, toIndex:17, title: cflineCommMsgArray['all'] /* 전체 */, id:"lineCntAllLable"}
	    		       ,{fromIndex:18, toIndex:21, title: cflineMsgArray['dcsDualostion'] /* DCS 이원화 */, id:"lineCntDcsLable"}
	    		       ,{fromIndex:22, toIndex:25, title: cflineMsgArray['dcsIndependence'] /* DCS 단독 */, id:"lineCntDcsFailLable"}
	    		       
	    		       ,{fromIndex:27, toIndex:39, title: cflineMsgArray['bmtsoSmtsoCountSerious'] /* 기지국 국소수(중요) */, id:"lineImpoLable"}
	    		       ,{fromIndex:27, toIndex:30, title: cflineCommMsgArray['all'] /* 전체 */, id:"lineImpoAllLable"}
	    		       ,{fromIndex:31, toIndex:34, title: cflineMsgArray['dcsDualostion'] /* DCS 이원화 */, id:"lineImpoDcsLable"}
	    		       ,{fromIndex:35, toIndex:38, title: cflineMsgArray['dcsIndependence'] /* DCS 단독 */, id:"lineImpoDcsFailLable"}
	    		       /* SIG/ONM 정보 - 20210322 추가 */
	    		       ,{fromIndex:40, toIndex:42, title: 'SIG/ONM 이원화율' /* 전체 */, id:"sigOnmAllLable"}
	    		       ,{fromIndex:41, toIndex:42, title: '삼성' /* 전체 */, id:"samsumgLable"}
	    		       /* RTE_NAME 대국정보 - 202312 추가 */
	    		       ,{fromIndex:45, toIndex:47, title: cflineMsgArray['rteInputRate'] /* 교환기간/상호접속 발란싱율  */, id:"rteNameAllLable"}
	    		       
	    		       
	    		],
	    		grouping : {
	            	by : ['hdofcNm','teamNm','tmofNm'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            },
	    		columnMapping: [
				  {key : 'hdofcNm'	            	,title : cflineCommMsgArray['hdofc'] /* 본부 */ ,align:'center', width: '100px', rowspan : true}
		        , {key : 'teamNm'	        		,title : cflineCommMsgArray['team'] /* 팀 */ ,align:'center', width: '130px', rowspan : true}     
		        , {key : 'tmofNm'	        		,title : cflineMsgArray['transmissionOffice'] /* 전송실 */ ,align:'center', width: '130px', rowspan : true}       
		        , {key : 'eqpNm'	        		,title : 'DCS' ,align:'center', width: '150px'} 
		        
		        , {key : 'lineCnt'	        		,title : cflineCommMsgArray['all'] /* 전체 */ ,align:'right', width: '80px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'line001Cnt'	        		,title : cflineMsgArray['exchangerPlace'] /* 교환기간 */ ,align:'right', width: '80px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'line003Cnt'	        		,title : cflineMsgArray['trdConnection'] /* 상호접속 */ ,align:'right', width: '80px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'line005Cnt'	        		,title : cflineMsgArray['etc'] /* 기타 */ ,align:'right', width: '80px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'lineBtbCnt'	        		,title : 'B2B' ,align:'right', width: '80px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }       
		        
		        , {key : 'line002Cnt'	        		,title : cflineMsgArray['subTotal'] /* 기지국간 소계 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'lineCnt2g'	        		,title : '2G' /* 기지국간 2G */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'lineCnt1x'	        		,title : '1X' /* 기지국간 1X */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'lineCntw'	        		,title : 'W' /* 기지국간 W */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'lineCntEtc'	        		,title : cflineMsgArray['etc'] /* 기지국간 기타 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }

		        , {key : 'totalCount'	        		,title : cflineMsgArray['subTotal'] /* 기지국소 전체 소계 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'cnt2g'	        		,title : '2G' /* 기지국소 전체 2G */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'cnt1x'	        		,title : '1X' /* 기지국소 전체 1X */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'cntw'	        		,title : 'W' /* 기지국소 전체 W */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }

		        , {key : 'dualSucc'	        		,title : cflineMsgArray['subTotal'] /* 기지국소 DCS이원화 소계 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualSucc2g'	        		,title : '2G' /* 기지국소 DCS이원화 2G */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualSucc1x'	        		,title : '1X' /* 기지국소 DCS이원화 1X */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualSuccw'	        		,title : 'W' /* 기지국소 DCS이원화 W */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }  

		        , {key : 'dualFail'	        		,title : cflineMsgArray['subTotal'] /* 기지국소 DCS단독 소계 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualFail2g'	        		,title : '2G' /* 기지국소 DCS단독 2G */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualFail1x'	        		,title : '1X' /* 기지국소 DCS단독 1X */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualFailw'	        		,title : 'W' /* 기지국소 DCS단독 W */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }     
		        
		        , {key : 'dualSuccRate'	        		,title : cflineMsgArray['dualostionRate'] /* 기지국소 이원화율 */ ,align:'right', width: '100px'}

		        , {key : 'totalCntImpo'	        		,title : cflineMsgArray['subTotal'] /* 기지국소(중요) 전체 소계 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'cnt2gImpo'	        		,title : '2G' /* 기지국소(중요) 전체 2G */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'cnt1xImpo'	        		,title : '1X' /* 기지국소(중요) 전체 1X */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'cntwImpo'	        		,title : 'W' /* 기지국소(중요) 전체 W */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }

		        , {key : 'dualSuccImpo'	        		,title : cflineMsgArray['subTotal'] /* 기지국소(중요) DCS이원화 소계 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualSucc2gImpo'	        		,title : '2G' /* 기지국소(중요) DCS이원화 2G */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualSucc1xImpo'	        		,title : '1X' /* 기지국소(중요) DCS이원화 1X */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualSuccwImpo'	        		,title : 'W' /* 기지국소(중요) DCS이원화 W */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }

		        , {key : 'dualFailImpo'	        		,title : cflineMsgArray['subTotal'] /* 기지국소(중요) DCS단독 소계 */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualFail2gImpo'	        		,title : '2G' /* 기지국소(중요) DCS단독 2G */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualFail1xImpo'	        		,title : '1X' /* 기지국소(중요) DCS단독 1X */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }   
		        , {key : 'dualFailwImpo'	        		,title : 'W' /* 기지국소(중요) DCS단독 W */ ,align:'right', width: '60px'
		        	, render : function(value, data) {
						if (nullToEmpty(value) == '') {return '';}
						return setComma( value );
					}
		        }
		        
		        , {key : 'dualSuccRateImpo'	        		,title : cflineMsgArray['dualostionRate'] /* 기지국소(중요) 이원화율 */ ,align:'right', width: '100px'}
		        
		        /* SIG/ONM 정보 - 20210322 추가  */
		        , {key : 'elgSuccessRate'	        		,title : 'ELG' /* ELG */ ,align:'right', width: '100px'}
		        , {key : 'slSuccessRate'	        		,title : 'SIG' /* SIG */ ,align:'right', width: '100px'}
		        , {key : 'onmSuccessRate'	        		,title : 'ONM' /* ONM */ ,align:'right', width: '100px'}
		        
		        , {key : 'cuidRate'	        		,title : cflineMsgArray['cuidInputRate'] /* CUID입력율 */ ,align:'right', width: '100px'}
		        , {key : 'wdualRate'	        		,title : cflineMsgArray['wbmtsoDualRate'] /* W기지국 이원화율 */ ,align:'right', width: '120px'}
		        

 		        /* RTE_NAME 대국정보 - 2023-12-20 추가 */
		        , {key : 'balanTotalRate'	        		,title : cflineCommMsgArray['all'] /* 전체 */ ,align:'right', width: '100px'}
		        , {key : 'balanRate001'	        		,title : cflineMsgArray['exchangerPlace']  /* 교환기간 */ ,align:'right', width: '100px'}
		        , {key : 'balanRate003'	        		,title : cflineMsgArray['trdConnection'] /* 상호접속 */,align:'right', width: '100px'}
			]}); 
    		/*$('#'+gridId).alopexGrid("columnFix", 3);*/
    } 
    

	// 그리드 헤더로 소속 타이틀 만들기
	function getHeaderTitle(GridId, columnIdx) {
		
		var headerGroup = $('#'+GridId).alopexGrid("headerGroupGet");
		var mergeHdTitle = '';
//		console.log("headerGroup.length =======" + headerGroup.length);
//		console.log(headerGroup);
		if (headerGroup.length > 0 && headerGroup[0].fromIndex != undefined) {
			for (var i =  headerGroup.length-1 ;i > -1 ; i--) {
				if(headerGroup[i].fromIndex <= columnIdx && headerGroup[i].toIndex >= columnIdx){
					if(mergeHdTitle==""){
						mergeHdTitle = headerGroup[i].title;
					}else{
						mergeHdTitle = mergeHdTitle + " > " + headerGroup[i].title;
					}
				}
			}
		}
		return mergeHdTitle;
	}     
	
	 //장비 찾기 팝업
    function openEqpPopThis(eqpId, eqpNm, searchEqpNm, vTmofInfo, division){
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) ==""){
    		urlPath = "/tango-transmission-web";
    	}
    	
    	var param = new Object();
    	$.extend(param,{"neNm":nullToEmpty(searchEqpNm)});
    	$.extend(param,{"vTmofInfoRm":vTmofInfo}); // 최상위 전송실 조회 리스트
    	$.extend(param,{"searchDivision":division});
    	
    	$a.popup({
    	  	popid: "popEqpSch",
    	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
    	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
    	  	data: param,
    		modal: false,
    		movable:true,
    		windowpopup : true,
    		width : 1100,
    		height : 600,
    		callback:function(data){
    			if(data != null){
    				$('#' + eqpId).val(data.neId);
    				$('#' + eqpNm).val(data.neNm);
    			}
    		}
    	}); 	
    }
    
    
});
