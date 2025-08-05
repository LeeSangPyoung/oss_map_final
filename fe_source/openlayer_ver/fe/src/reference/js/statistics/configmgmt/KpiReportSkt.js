/**
 * KpiReportSkt.js
 *
 * @author P095783
 * @date 2017.12.04
 * @version 1.0
 * 
 *  
 ************* 수정이력 ************
 * 2021-10-13  1. [수정] NOC별 통계내역을 본부/팀별로 수정
 */
 
var gridId = 'dataGrid';
var gubunData = [	{value: "01", text: "장비 및 링 등록율"}
			                , {value: "02", text: "회선 등록율"}
			                , {value: "03", text: "기지국 회선 RT 포트 등록율"}
			                , {value: "04", text: "DCS CRS 일치율(E1)"}
			                /*, {value: "05", text: "TRUNK 등록율"}*/
			             ];
var chartVal = $("input:radio[name=chartType]:checked").val();
var gubunVal = $("input:radio[name=gubunType]:checked").val();
var excelFileSheetName = "장비 및 링 등록율";
var ringChartVal = null;
var eqpChartVal = null;
var crsChartVal = null;
var dcsChartVal = null;
var sDay = getTodayStr("-");
var columnFixUpto = 0;
var columnMtso = "";

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

		$('#standardDateDiv').hide();
		$('#crsE1Div').hide();
		$('#bonbuDiv').hide();
		$('#exceptYnLb').hide();
    	$('#btnExportExcel').setEnabled(false);
    	setSelectCode();
    	CrsInitGrid("01");
        setEventListener();  
        createChart(null, 'ring');

    	createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
		$('#gubun').clear();
		$('#gubun').setData({data : gubunData});

    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getMgmtBonbuTeam', null, 'GET', 'getMgmtBonbuTeam');	// 관리 본부/팀 데이터
   	 	// 사용자 소속 전송실
    	searchUserJrdtTmofInfo("tmofCd");
    }
    
    // setEventListener
    function setEventListener() {
    	//구분 변경 이벤트,
    	$('#gubun').on('change', function(e) {
    		ringChartVal = null;
    		eqpChartVal = null;
    		crsChartVal = null;
    		dcsChartVal = null;
    		if($('#gubun').val() == '01' ) {
     			excelFileSheetName = "장비 및 링 등록율";
     			$('#standardDateDiv').hide();
     			$('#crsE1Div').hide();
     			$('#bonbuDiv').hide();
     			CrsInitGrid("01");
     			
     			$('#EqpRingDiv').show();
     			//createChart(null, chartVal);
     			createChart();
     		} else if($('#gubun').val() == '02' ) {
     			excelFileSheetName = "회선 등록율";
     			$('#standardDateDiv').hide();
     			$('#crsE1Div').hide();
     			$('#bonbuDiv').hide();
     			CrsInitGrid("02");
     			
     			$('#EqpRingDiv').hide();
     			createChart();
     		} else if($('#gubun').val() == '03' ) {
     			excelFileSheetName = "기지국 회선 RT 포트 등록율";
     			$('#standardDateDiv').hide();
     			$('#crsE1Div').hide();
     			$('#bonbuDiv').hide();
     			$('#exceptYnLb').hide();
     			CrsInitGrid("03");
     			
     			$('#EqpRingDiv').hide();
     			createChart();
     		} else if($('#gubun').val() == '04') {
     			excelFileSheetName = "DCS CRS 일치율(E1)";
     			var yDay = getYesterStr("-");
     			$('#standardDateDiv').show();
     			$('#crsE1Div').show();
     			$('#bonbuDiv').show();
     	    	$('#standardDate').val(yDay);
     			$('#exceptYnLb').hide();
     	    	createGrid('','');
     			$('#EqpRingDiv').hide();
     			createChart(null, gubunVal);
     		} else {
     			$('#standardDateDiv').hide();
     			$('#crsE1Div').hide();
     			$('#bonbuDiv').hide();
     			initGrid("05");
     			
     			$('#EqpRingDiv').hide();
     			//createChart();
     		}
        	$('#btnExportExcel').setEnabled(false);
    		$('#'+gridId).alopexGrid("dataEmpty");
 			$('#'+gridId).alopexGrid("viewUpdate");
    		/*$('#'+gridId).alopexGrid('updateOption',
    				{paging : {pagerTotal: function(paging) {
    					return cflineCommMsgArray['totalCnt']총 건수 + ' : ' + 0;
    				}}}
    		);*/
     	});
    	
	 	// 엔터 이벤트 
     	$('#searchForm').on('keydown', function(e) {
     		if (e.which == 13  ) {
    			$('#btnSearch').click();
    			return false;
    		}
     	});	
     	
    	//조회 	
    	 $('#btnSearch').on('click', function(e) {
    		 searchProc();
         });
    	 
       	 //Excel 이벤트
    	 $('#btnExportExcel').on('click', function(e) {
    		 cflineShowProgressBody();
    		 excelDownload();
    	 });
    	 
    	//작업 선택 시 상세팝업
  		$('#'+gridId).on('click', '.bodycell', function(e){
        	
  			var dataObj = AlopexGrid.parseEvent(e);
      	 	var dataKey = dataObj.data._key;
      	 	
      	 	//if(dataObj.ntwkTypNm != "총계"){ //총계시에도 검색될수 있도록 수정 2021-06-23
      	 	//불일치카운터에 대해서 검색
      	 		if (dataKey == "workCnt103" || dataKey == "workCnt104" || dataKey == "workCnt105" 
          	 		|| dataKey == "workCnt102" || dataKey == "workCnt101" || dataKey == "workCnt107" 
          	 		|| dataKey == "workCnt106" || dataKey == "workCnt116" || dataKey == "workCnt109" 
          	 		|| dataKey == "workCnt110" || dataKey == "workCnt111" || dataKey == "workCnt112"
          	 		|| dataKey == "workCnt113" || dataKey == "workCnt114" || dataKey == "workCnt115" 
          	 		|| dataKey == "workCnt116"  
          	 		|| dataKey.indexOf("WorkCnt") > 0
          	 		|| dataKey.indexOf("W_") != -1) {
          	 		detailPop(dataObj);
          	 	}
      	 	//}
  		});
  		
  		$("input:radio[name=chartType]").on('change', function(e) {
			chartVal = $(this).val();
			if(chartVal == 'ring') {
				createChart(ringChartVal, chartVal);
			} else if(chartVal == 'eqp') {
				createChart(eqpChartVal, chartVal);
			} 

		});
  		
  		$("input:radio[name=gubunType]").on('change', function(e) {
  			gubunVal = $(this).val();
		});
  		
  		$("#exceptYn").on("change", function(e){
  			var checkEx = $('#exceptYn').is(':checked'); // true 와 false로 값이 구분
  			if ( checkEx == true  ) {
  				$('#standardDate').attr("disabled",true);
  				$('#standardDate').val("");
  			} else if ( checkEx == false ) {
  				$('#standardDate').attr("disabled",false);
  				$('#standardDate').val(sDay);
  			}
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
	
    };

	/*
	 * 조회 함수
	 */
	function searchProc() {
		cflineShowProgressBody();	

    	var param =  $("#searchForm").serialize();
    	
		var gubunVal = $("input:radio[name=gubunType]:checked").val();
		
    	$.extend(param,{"selectGubun": $('#gubun').val() });
    	$.extend(param,{"standardDate": $('#standardDate').val() });
    	$.extend(param,{"gubunType": gubunVal });
    	
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kpireport/getkpireportsktlist', param, 'GET', 'searchList');
	}

	/*
	 *  Excel 함수 
	 */
	function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
			excelFileName : excelFileSheetName,
			sheetList : [{
				sheetName : excelFileSheetName,
				placement : 'vertical',
				$grid : $('#'+gridId)
			}]
		});
		
		worker.export({
			merge : true,
			exportHidden : false,
			useGridColumnWidth : true,
			border : true,
			useCSSParser : true
		});
		cflineHideProgressBody();
	}
	
	/**
	 * 전송실명으로 뒷자리취득
	 */
	function mtsoTmp(mtsoNm) {
		//boramae
		var tmp = mtsoNm.replace("WorkCnt", "");
		//tot
		var boramaeNoc = ["boramae","bundang","incheon"];
		var seongsuNoc = ["seongsu","suyu"];
		var busanNoc = ["busan","centum"];
		var daeguNoc = ["daegu","bonri","taepyeong"];
		var westernPartNoc = ["seobu","gwangju","jeonju","jeju"];
		var centerPartNoc = ["jungbu","doonsan","busa","wonju"];
		
		for (var i = 0; i < boramaeNoc.length; i++) {
			if (tmp == boramaeNoc[i]) {
				return "MO00000000103,MO00000000104,MO00000000105";
				break;
			}
		}

		for (var i = 0; i < seongsuNoc.length; i++) {
			if (tmp == seongsuNoc[i]) {
				return "MO00000000101,MO00000000102";
				break;
			}
		}

		for (var i = 0; i < busanNoc.length; i++) {
			if (tmp == busanNoc[i]) {
				return "MO00000000106,MO00000000107";
				break;
			}
		}

		for (var i = 0; i < daeguNoc.length; i++) {
			if (tmp == daeguNoc[i]) {
				return "MO00000000116,MO00000000109";
				break;
			}
		}

		for (var i = 0; i < westernPartNoc.length; i++) {
			if (tmp == westernPartNoc[i]) {
				return "MO00000000110,MO00000000111,MO00000000112";
				break;
			}
		}

		for (var i = 0; i < centerPartNoc.length; i++) {
			if (tmp == centerPartNoc[i]) {
				return "MO00000000113,MO00000000114,MO00000000115";
				break;
			}
		}
		
		if(tmp == "tot") {
			return "";
		}
	}
	
	//상세 팝업
	function detailPop(dataObj) {

  	 	var columnIndex = dataObj.mapping.columnIndex;
    	var mtsoHeaderTitle = getHeaderTitle(gridId, columnIndex);  // 헤더 정보 가져오기(그리드에서)
    	if(mtsoHeaderTitle==""){
    		mtsoHeaderTitle = dataObj.mapping.title;
    	}

		var gridData = dataObj.data;
		var dataKey = dataObj.data._key;
		var selectGubun =  $('#gubun').val();
		var svlnLclCd = "";
		var svlnSclCd = "";
		var svlnTypCd = "";

		var tmp = dataKey.replace("workCnt", "");
		var MtsoId = "";

		var result = isNaN(tmp);	//문자면 true, 숫자면false
		/*
		 * 총계 > 계 > 작업을 클릭하여
		 * 문자가 포함된 경우에는 포함된 모든 해당 전송실을 넘겨준다 
		 */
		if(result) {
			MtsoId = mtsoTmp(tmp);
		} else {
			//tmp 구하기
			MtsoId = "MO00000000" + tmp;
		}
		
		if(gridData.svlnSclNm == "소계" || gridData.svlnSclNm == "총계") {
			svlnLclCd = gridData.svlnCd;
			svlnSclCd = "";
			svlnTypCd = "";
		} else {
			svlnLclCd = gridData.svlnLclCd;
			svlnSclCd = gridData.svlnSclCd;
			svlnTypCd = gridData.svlnTypCd;
		}
		
		var date = $('#standardDate').val();
		
		var popData = {};
		//grpGubun : 011
		if(selectGubun == '01') {
			popData = { "selectGubun" : selectGubun
						 , "ntwkTypCd" : gridData.ntwkTypCd
						 , "topMtsoId" : MtsoId 
						 , "gubun" : gridData.gubun
						 , "topMtsoNm" : mtsoHeaderTitle
			};
		} else if(selectGubun == '02') {
			popData = { "selectGubun" : selectGubun
							, "svlnSclNm" : gridData.svlnSclNm
							, "svlnTypNm" : gridData.svlnTypNm
							, "svlnSclCd" : svlnSclCd 
							, "svlnLclCd" : svlnLclCd
							, "svlnTypCd" : svlnTypCd 
			                , "topMtsoId" : MtsoId 
							, "topMtsoNm" : mtsoHeaderTitle
			           };
		} else if(selectGubun == '03') {
			popData = {"selectGubun" : selectGubun
					, "standardDate" : date
					, "topMtsoId" : MtsoId
					, "svlnStatCd" : gridData.svlnStatCd
					, "lineCapaCd" : gridData.lineCapaCd
					, "svlnTypCd" : gridData.svlnTypCd
					, "lesCommBizrId" : gridData.lesCommBizrId
					, "topMtsoNm" : mtsoHeaderTitle};
		} else if(selectGubun == '04') {
			//TODO
			var mtsoIdTmp = "";
			var mtsoId = "";
			var teamCd = "";
			var tmofCd = "";
			if(gridData.EQPNM == "소계" || gridData.EQPNM == "총계" || gridData.MODELNAME == "총계") {
				mtsoIdTmp = dataKey.replace("W_", "");	//"W_00004185"
				if(mtsoIdTmp.indexOf("MO") > -1) {	//전송실의 소계/총계인경우
					tmofCd = mtsoIdTmp;
				} else {	//total계에서 소계/총계클릭한 경우
					return;
				}
			}
			
			popData = {"selectGubun" : selectGubun
					, "standardDate" : date
					, "tmofCd"    : tmofCd
					, "teamCd"    : teamCd
					, "gubun"     : gridData.GUBUN 
					, "modelName" : gridData.MODELNAME
					, "modelCode" : gridData.MODELCODE
					, "topMtsoNm" : ""
				    , "eqpId"     : gridData.EQPID};
		} else {
			popData = {}
		}

		$a.popup({
			popid: "KpiReportSktDetailPop",
			title: "상세조회",
			url: $('#ctx').val()+'/statistics/configmgmt/KpiReportSktDetailPop.do',
			data: popData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1100,
 			height : 600,
 			callback:function(data){
 				if(data != null){
 				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}
		});
	}

	function successCallback(response, status, jqxhr, flag) {
    	//조회시
    	if(flag == 'searchList'){
    		cflineHideProgressBody();    	
    		$('#btnExportExcel').setEnabled(true);

    		ringChartVal = null;
    		eqpChartVal = null;
    		crsChartVal = null;
    		dcsChartVal = null;
			
    		if($('#gubun').val() == '01' ) {
				ringChartVal = response.ringChart;
    			eqpChartVal = response.eqpChart;
    			
    			if(chartVal == 'ring') {
        			createChart(ringChartVal, chartVal);
        		} else if(chartVal == 'eqp') {
        			createChart(eqpChartVal, chartVal);
        		}

     		} else if($('#gubun').val() == '02' ) {
     			createChart(response.chart, '');
     		} else if($('#gubun').val() == '03' ) {
     			createChart(response.chart, '');
     		} else if($('#gubun').val() == '04') {
     			if(gubunVal == "crs") {
     				crsChartVal = response.crsChart;
        			createChart(crsChartVal, gubunVal);
     			} else {
     				dcsChartVal = response.dcsChart;
        			createChart(dcsChartVal, gubunVal);
     			}

    			renderGrid(response.headerList, response.keyList);
            	
     		} else{
     			createChart(response.chart, '');
     		}

        	$('#'+gridId).alopexGrid('dataSet', response.list);
      	}
	}

	//컬럼 구성
	function columnMapping() {		
		var mapping = [				
							  {key : 'GUBUN',				align:'center',		width:'80px',		title : cflineMsgArray['division']	/* 구분 */}
							, {key : 'MODELNAME',			align:'center',		width:'80px',		title : "모델"}
							, {key : 'EQPNM',	    		align:'center',		width:'120px',		title : "DCS" /* DCS */} 
							, {key : 'MTSOID',				align:'center',			hidden: true}
	    ];
		
		return mapping;
	}	
	//그리드 랜더링
	function renderGrid(addHeader, addColumn) {
		var headerDiv = addHeader;
		var columnDiv = "";
		//칼럼 구성
		if(addColumn != null) {
			columnMtso = columnMapping();
			
			if(addColumn != null) {
				$.each(addColumn, function(key, val) {
					columnMtso.push(val);
				})
			}
			
		} else {
			headerDiv = "";
			columnDiv = "";
		}
		createGrid("mtso", headerDiv);
	}

	function createGrid(sType, headerVal) {
		
		var defaultMapping =  [					
							  {key : 'GUBUN',				align:'center',		width:'80px',		title : cflineMsgArray['division']	/* 구분 */}
							, {key : 'MODELNAME',			align:'center',		width:'80px',		title : "모델"}
							, {key : 'EQPNM',	    		align:'center',		width:'120px',		title : "DCS" /* DCS */} 
							, {key : 'MTSOID',				align:'center',		hidden: true}
							, {key : 'transmissionOffice', 	align:'center', 	width:'200px', 		title: cflineMsgArray['transmissionOffice']	/* 전송실 */}
	  	    ];
		
		/**
		 *  default 화면
		 */
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: true,
		    cellSelectable : true,
		    rowInlineEdit : false,
		    numberingColumnFromZero : false,
		    height: 450,
			headerGroup : [
	               			{ fromIndex: 'transmissionOffice', toIndex: 'transmissionOffice', title: cflineMsgArray['headOffice']		 /* 본부 */ }
	        ],
		    message : {
		      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
		       	filterNodata: 'No data'
		    },
		    columnMapping: defaultMapping
		});
		
		if(sType == "mtso") {

    		var columnFixUpto = columnMapping().length-1;
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal, hideSortingHandle: true, disableHeaderClickSorting: true});
    		
			/**
			 *  전송실
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnFixUpto: columnFixUpto,
			    columnMapping: columnMtso
			});
		}
		
	}
	
	
	//request 실패시.
    function failCallback(response, status, flag) {
    	if(flag == 'searchList'){
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

	var columnMappingE1 = null;

	function CrsInitGrid(gubun) {
    	
    	var columnMapping = [];
    	var fristTitle = cflineMsgArray['work']	/* 작업 */;
    	var thirdTitle = cflineMsgArray['registrationRate'] /* 등록율 */;
    	var headerIndex = 2;
    	
    	if(gubun == '04' || gubun == '05' ){
    		fristTitle = cflineMsgArray['disaccord']; /* 불일치 */
    		thirdTitle = cflineMsgArray['accordRate']; /* 일치율 */
 		};
    	
    	var extendColumn = [
     		       			//  보라매(T전송/교환실)
     		       			{key : 'workCnt103',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt103',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate103',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}

     		       			//분당(T전송/교환실)
     		       			, {key : 'workCnt104',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt104',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate104',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}

     		       			//인천(T전송/교환실)
     		       			, {key : 'workCnt105',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt105',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate105',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//성수(T전송/교환실)
     		       			, {key : 'workCnt102',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt102',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate102',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//수유(T전송/교환실)
     		       			, {key : 'workCnt101',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt101',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate101',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			// 전송운용1팀 총계
     		       			, {key : 'oneWorkCnt',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'oneRgstCnt',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'oneRgstRate',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//부산(T전송/교환실)
     		       			, {key : 'workCnt107',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt107',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate107',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//센텀(T전송/교환실)
     		       			, {key : 'workCnt106',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt106',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate106',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//본리(T전송/교환실)
     		       			, {key : 'workCnt116',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt116',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate116',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//태평(T전송/교환실)
     		       			, {key : 'workCnt109',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt109',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate109',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//광주(T전송/교환실)
     		       			, {key : 'workCnt110',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt110',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate110',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//전주(T전송/교환실)
     		       			, {key : 'workCnt111',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt111',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'rgstRate111',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//제주(T전송/교환실)
     		       			, {key : 'workCnt112',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt112',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록*/ }
     		       			, {key : 'rgstRate112',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//둔산(T전송/교환실)
     		       			, {key : 'workCnt113',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt113',			align:'right',			width:'80px',		title : cflineMsgArray['registration']/*	 등록*/ }
     		       			, {key : 'rgstRate113',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//부사(T전송/교환실)
     		       			, {key : 'workCnt114',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt114',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록*/ }
     		       			, {key : 'rgstRate114',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//원주(T전송/교환실)
     		       			, {key : 'workCnt115',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'rgstCnt115',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록*/ }
     		       			, {key : 'rgstRate115',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//전송운용2팀 총계
     		       			, {key : 'twoWorkCnt',			align:'right',			width:'80px',		title : fristTitle}
     		       			, {key : 'twoRgstCnt',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'twoRgstRate',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//SKT임시전송실
     		       			//, {key : 'workCnt117',			align:'right',			width:'80px',		title : fristTitle}
     		       			//, {key : 'rgstCnt117',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록*/ }
     		       			//, {key : 'rgstRate117',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			//SKT미확인국사
     		       			//, {key : 'workCnt199',			align:'right',			width:'80px',		title : fristTitle}
     		       			//, {key : 'rgstCnt199',			align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록*/ }
     		       			//, {key : 'rgstRate199',			align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			// 유선솔루션팀 총계
     		       			//, {key : 'threeWorkCnt',		align:'right',			width:'80px',		title : fristTitle}
     		       			//, {key : 'threeRgstCnt',		align:'right',			width:'80px',		title : cflineMsgArray['registration']	/* 등록 */}
     		       			//, {key : 'threeRgstRate',		align:'right',			width:'80px',		title : thirdTitle + "(%)"}
     		       			
     		       			// total
     		       			, {key : 'totWorkCnt',			align:'right',			width:'80px',		title : "TOTAL" + fristTitle}
     		       			, {key : 'totRgstCnt',			align:'right',			width:'80px',		title : "TOTAL" + cflineMsgArray['registration']	/* 등록 */}
     		       			, {key : 'totRgstRate',			align:'right',			width:'120px',		title : "TOTAL" + thirdTitle + "(%)"}
     		       		]
  		
    	if(gubun == '01' ) {
    		prevColumn = [
			    		                 {key : 'gubun',			align:'center',			width:'80px',		title : cflineMsgArray['division']	/* 구분 */ }
			    		     			 , {key : 'ntwkTypNm',			align:'left',			width:'110px',		title : cflineMsgArray['networkType'] /* 네트워크타입 */}
    		                 ];
    		for(var i =0; i<prevColumn.length;i++){
    			columnMapping.push(prevColumn[i]);
    		}
    		columnFixUpto = prevColumn.length-1;
    		for(var k =0; k<extendColumn.length;k++){
    			columnMapping.push(extendColumn[k]);
    		}
 		}else if(gubun == '02' ){
 			var headerIndex = 3;
 			prevColumn = [
			    		                   {key : 'svlnSclNm',			align:'center',			width:'80px',		title : cflineMsgArray['line'] /* 회선 */ + cflineMsgArray['division']	/* 구분 */ }
				    		     		 , {key : 'svlnTypNm',			align:'left',			width:'110px',		title : cflineMsgArray['service'] /* 서비스 */ + cflineMsgArray['division'] /* 구분 */}
				    		     		 , {key : 'svlnCd',			    align:'left',			width:'110px',		title : "서비스구분",	hidden : true}
 			                 ];
    		for(var i =0; i<prevColumn.length;i++) {
    			columnMapping.push(prevColumn[i]);
    		}
    		columnFixUpto = prevColumn.length-1;
    		for(var k =0; k<extendColumn.length;k++) {
    			columnMapping.push(extendColumn[k]);
    		}
 		}else if(gubun == '03' ){
 			var headerIndex = 4;
 			prevColumn = [
										 {key : 'svlnTypNm',			align:'right',			width:'80px',		title : cflineMsgArray['service'] /* 서비스 */}
										, {key : 'svlnStatNm',			align:'right',			width:'80px',		title : cflineMsgArray['lineStatus'] /* 회선상태 */}
										, {key : 'lineCapaNm',			align:'right',			width:'80px',		title : cflineMsgArray['capacity'] /* 용량 */}
										, {key : 'lesCommBizrNm',			align:'right',			width:'80px',		title : cflineMsgArray['rentBusinessMan'] /* 임차사업자 */}
 			                 ];
    		for(var i =0; i<prevColumn.length;i++) {
    			columnMapping.push(prevColumn[i]);
    		}
    		columnFixUpto = prevColumn.length-1;
    		for(var k =0; k<extendColumn.length;k++){
    			columnMapping.push(extendColumn[k]);
    		}
    		
 		}else if(gubun == '04' ){
			var headerIndex = 4;
			prevColumn = [
			              				 
										  {key : 'gubun',			align:'center',			width:'80px',		title : cflineMsgArray['division']	/* 구분 */}
										, {key : 'modelName',		align:'center',			width:'80px',		title : "모델"}
										, {key : 'eqpNm',		    align:'center',			width:'120px',		title : "DCS" /* DCS */}
										, {key : 'modelCode',		align:'center',			hidden: true}
			                 ];
			for(var i =0; i<prevColumn.length;i++) {
				columnMapping.push(prevColumn[i]);
			}
			columnFixUpto = prevColumn.length-1;
			for(var k =0; k<extendColumn.length;k++) {
				columnMapping.push(extendColumn[k]);
			}
 		}
   
        //그리드 생성
        $('#'+gridId).alopexGrid({
            autoColumnIndex : true,
            fitTableWidth : true,
            disableTextSelection : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            columnFixUpto: columnFixUpto,
            headerGroup : [
                           { fromIndex : headerIndex + 0, toIndex : headerIndex + 50, title : "IP Infra본부" /* IP Infra본부 */},
                           { fromIndex : headerIndex + 0, toIndex : headerIndex + 17, title : "전송운용1팀" /* 전송운용1팀 */},
                           { fromIndex : headerIndex + 0, toIndex : headerIndex + 2, title : cflineMsgArray['boramae']		/* 보라매 */},
                           { fromIndex : headerIndex + 3, toIndex : headerIndex + 5, title : cflineMsgArray['bundang']		/* 분당 */},
                           { fromIndex : headerIndex + 6, toIndex : headerIndex + 8, title : cflineMsgArray['incheon']		/* 인천 */ },
                           { fromIndex : headerIndex + 9, toIndex : headerIndex + 11, title : cflineMsgArray['seongsu']		/* 성수 */},
                           { fromIndex : headerIndex + 12, toIndex : headerIndex + 14, title : cflineMsgArray['suyu']		/* 수유 */},
                           { fromIndex : headerIndex + 15, toIndex : headerIndex + 17, title : cflineMsgArray['tot']		/*계*/},
                           
                           { fromIndex : headerIndex + 18, toIndex : headerIndex + 50, title : "전송운용2팀" /* 전송운용2팀 */},
                           { fromIndex : headerIndex + 18, toIndex : headerIndex + 20, title : cflineMsgArray['busan']		/* 부산 */},
                           { fromIndex : headerIndex + 21, toIndex : headerIndex + 23, title : cflineMsgArray['centum']		/* 센텀 */},
                           { fromIndex : headerIndex + 24, toIndex : headerIndex + 26, title : cflineMsgArray['bonri']		/* 본리 */},
                           { fromIndex : headerIndex + 27, toIndex : headerIndex + 29, title : cflineMsgArray['taepyeong']	/* 태평 */},
                           { fromIndex : headerIndex + 30, toIndex : headerIndex + 32, title : cflineMsgArray['gwangju']	/* 광주 */},
                           { fromIndex : headerIndex + 33, toIndex : headerIndex + 35, title : cflineMsgArray['jeonju']		/* 전주 */},
                           { fromIndex : headerIndex + 36, toIndex : headerIndex + 38, title : cflineMsgArray['jeju']		/* 제주 */ },
                           { fromIndex : headerIndex + 39, toIndex : headerIndex + 41, title : cflineMsgArray['doonsan']	/* 둔산 */},
                           { fromIndex : headerIndex + 42, toIndex : headerIndex + 44, title : cflineMsgArray['busa']		/* 부사 */},
                           { fromIndex : headerIndex + 45, toIndex : headerIndex + 47, title : cflineMsgArray['wonju']		/*원주*/},
                           { fromIndex : headerIndex + 48, toIndex : headerIndex + 50, title : cflineMsgArray['tot']		/*계*/},
                           
                           { fromIndex : headerIndex + 51, toIndex : headerIndex + 53, title : "TOTAL"}
            ],
            height : 400,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,columnMapping : columnMapping
        });
    };
    
    var createChart = function(chartData, chartVal) {
    	var chtCtg = [];
    	var chtWData = [];
    	var chtRData = [];
    	var max = 0;
    	
    	//카테고리, series
    	$(chartData).each(function(i, val) {
    		if ( val.teamNm != undefined ){
    			chtCtg.push(val.teamNm);
    			chtWData.push(Number(val.workCnt));
        		chtRData.push(Number(val.totalCnt) - Number(val.workCnt));
    		} else if ( val.topMtsoNm != undefined  ){
    			chtCtg.push(val.topMtsoNm);
    			chtWData.push(Number(val.workCnt));
        		chtRData.push(Number(val.totalCnt));
    		}
    		if ( max < val.totalCnt ) {
    			max = val.totalCnt;
    		}
    	});
    	
    	// y_axis_default를 종합 갯수 최대값에 따른 y축 최대값 변경
    	var y_axis_default = (max % 5) * 10; 
    	// 그레프가 표시되지 않는 현상을 막기 위해 0인 경우 임의의 수 10을 설정해준다.
    	if(y_axis_default == 0) {
    		y_axis_default = 10;
    	}
    	
    	//구분에 따른 차트 제목, series 변경
    	var titleText = '';
    	var seriesText1 = '';
    	var seriesText2 = '';
    	
    	if($('#gubun').val() == '01') {
    		seriesText1 = '등록';
    		seriesText2 = '작업';
    		
    		if(chartVal == 'ring') {
    			titleText = '국사별 링 차트';
    		}
    		else {
    			titleText = '국사별 장비 차트'
    		}
    	}
    	else if($('#gubun').val() == '02') {
    		seriesText1 = '등록';
    		seriesText2 = '작업';
    		
    		titleText = '회선 등록율 차트';
    	}
    	else if($('#gubun').val() == '03') {
    		seriesText1 = '등록';
    		seriesText2 = '작업';
    		
    		titleText = '기지국 회선 RT 포트 등록율 차트';
    	}
    	else if($('#gubun').val() == '04') {
    		seriesText1 = '일치';
    		seriesText2 = '불일치';
    		
    		if(chartVal == 'crs') {
    			titleText = 'CRS 일치율(E1) 차트';
    		}
    		else {
    			titleText = 'DCS 일치성 차트';
    		}
    	}
    	else if($('#gubun').val() == '05') {
    		seriesText1 = '일치';
    		seriesText2 = '불일치';
    		
    		titleText = 'Trunk 등록율 차트'
    	}

    	Highcharts.setOptions({
    		lang : {
    			thousandsSep : ','
    		}
    	});
    	
		Highcharts.chart('dataChart', 
						{
							chart : {
								type : 'column'
							},
							title : {
								text : titleText
							},
							xAxis : {
								// x축지정 : NOC
								//categories : [ '보라매NOC', '성수NOC', '부산NOC', '대구NOC', '서부NOC', '제주 품질 관리팀', '중부NOC' ]
								categories : chtCtg
							},
							yAxis : {
								min : 0,
								// y축지정 : 10000단위
								tickInterval: y_axis_default,
								// tickAmount: y축 표시 갯수(ex, tickAmount: 5이면 0, 10k, 20k, 30k, 40k)
								stackLabels : {
									enabled : true,
									style : {
										fontWeight : 'bold',
										color : (Highcharts.theme && Highcharts.theme.textColor)|| 'gray'
									}
								},
								// y축 제목, default: values
								title: {
									text: ''
								}
							},
							// series 표시
							// ex, 그래프 선택 시 등록인지 작업인지 해당 데이터값만 표시
							legend : {
								align : 'right',
								x : -30,						//'-'값 일수록 오른쪽에서 왼쪽으로 이동
								verticalAlign : 'top',
								y : 10,						//'-'값 일수록 하단에서 상단으로 이동
								floating : true,
								backgroundColor : (Highcharts.theme && Highcharts.theme.background2)|| 'white',
								borderColor : '#CCC',
								borderWidth : 1,
								shadow : false
							},
							// default - header: 카테고리명 pointFormat: 
							// point.y값
							tooltip : {
								headerFormat : '<b>{point.x}</b><br/>',
								pointFormat : '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
							},
							// 그래프 위 데이터 표시
							plotOptions : {
								column : {
									stacking : 'normal',
									dataLabels: {
										// true일 시, 그래프 위에 데이터 표시 ex) 등록
										// 10,000 / 작업 500
										enabled : false,
										// 그래프 위 표시되는 값의 색
										color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
									}
								}
							},
							// 차트 데이터: '등록', ' 작업'을 표시
							// data 표시방법 1. 현재 사용한 방법
							// 2. data: [[x value, y value]]});
							// 3. 현재 사용 방법에서 data대신 y: [value]
							series : [ {name : seriesText2, data : chtWData, color : 'red'}
										,{name : seriesText1, data : chtRData, color : '#7cb5ec'}]
					});
	}

	// 그리드 헤더로 소속 타이틀 만들기
	function getHeaderTitle(GridId, columnIdx) {
		
		var headerGroup = $('#'+GridId).alopexGrid("headerGroupGet");
		var mergeHdTitle = '';
		if (headerGroup.length > 0 && headerGroup[0].fromIndex != undefined) {
			for (var i =  headerGroup.length-1 ;i > -1 ; i--) {
				if(headerGroup[i].fromIndex <= columnIdx && headerGroup[i].toIndex >= columnIdx){
					if(mergeHdTitle==""){
						//보라매NOC
						mergeHdTitle = headerGroup[i].title;
					}else{
						if(headerGroup[i].title != "계") {
							mergeHdTitle = headerGroup[i].title + "(T전송/교환실)";
						} else {
							//var sliceChr = mergeHdTitle.indexOf("NOC");
							mergeHdTitle = mergeHdTitle; //.slice(0, sliceChr) + "(T전송/교환실)";
						}
					}
				}
			}
		}
		return mergeHdTitle;
	} 
	
	/**
	 * 어제 날짜 가져오기
	 * @param pattern
	 * @returns
	 */
	function getYesterStr(pattern){
		var date = new Date();
		var yesterday = new Date(date.setDate(date.getDate()-1));
		var year = yesterday.getFullYear();
		var month = yesterday.getMonth() + 1;
		var day = yesterday.getDate();
		if(("" + month).length ==1){
			month = "0" + month;
		}
		if(("" + day).length ==1){
			day = "0" + day;
		}

		return year + pattern + month + pattern + day;		
	};
});	/* a.page end */