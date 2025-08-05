/**
 * RmLinePathPop.js
 *
 * @author park. i. h.
 * @date 2017.07.25
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2018-03-12  1. [수정] RM정보존재시 자동조회
 * 2021-04-19  2. [추가] 엑셀다운로드 추가
 */

var returnLineMapping = [];
var svlnTypCdListCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnTypCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnCommCodeData = [];  // 서비스회선 공통코드
var cmCodeData = [];  // 서비스회선 공통코드
var svlnSclCdVal = "";		// 회선유형값(기지국간, 교환기간, 상호접속간)
var searchTmofCdVal = ""		// 검색한 전송실 코드
var infoMaxnumber = 0;
var selectedJobTitle = "";
var popPageForCount = 200;
var pathGrid = "pathGrid";
var trunkGrid = "trunkGrid";

/**
 * gojs object 생성
 */
var $go = go.GraphObject.make;


/**
 * TEAMS 선번의 사용 네트워크 구간은 양 끝 노드만 포함하는 선번
 */
var teamsShortPathData = null;

/**
 * TEAMS 포인트 방식 RM 원본 선번.  
 * RM 선번과 트렁크 선번의 중복 장비를 제거하여 rmTeamsPath 에 표시하므로
 * RM 원본 선번이 필요하다.
 */
var rmOriginalTeamsPath = new TeamsPath();

/**
 * 네트워크로 자동 교체된 RM선번
 */
var rmAutoReplacedTeamsPath = new TeamsPath();

/**
 * TEAMS 포인트 방식 현재 편집 선번
 */
var rmTeamsPath = new TeamsPath();


/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkDataArray = [];

/**
 * gojs diagram
 */
var visualLinePath;

/**
 * 전송실
 */
var mtsoId = "";
/**
 * 전송실 List
 */
var mtsoList = [];

/**
 * 서비스회선번호
 */
var svlnNo = "";

var mgmtGrpCd = "";

$a.page(function() {
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	console.log(param);

    	if( (param.rnmEqpId != null) && (nullToEmpty(param.rnmEqpId) != '') ){
    		$("#rmEqpIdNm").val(param.rnmEqpId);
        	$("#rmEqpNm").val(param.rnmEqpIdNm);
    		$("#rmEqpNm").attr('style', 'background-color:#e2e2e2');
    	}
    	if( (param.rnmPortId != null) && (nullToEmpty(param.rnmPortId) != '') ){
    		$("#rmPortId").val(param.rnmPortId);
    		$("#rmPortNm").val(param.rnmPortIdNm);
    		$("#rmPortNm").attr('style', 'background-color:#e2e2e2');
    	}
    	$("#rmChanlNm").val(param.rnmPortChnlVal);
    	svlnNo = param.ntwkLineNo;
    	mgmtGrpCd = param.mgmtGrpCd;
    	
    	 //임시 데이터
    	//	DV10214802320	AU1013_BuSan2	29		01-1-02-05,01113
//    	$("#rmEqpNm").val("AU1013_BuSan2");
//    	$("#rmEqpIdNm").val("DV10214802320");
//    	$("#rmPortNm").val("01-1-02-05");
//    	$("#rmPortId").val("29");
//    	$("#rmChanlNm").val(",01113");
    	
    	//	링 교체 테스트 샘플
    	//	DV10214802320	AU1013_BuSan2	29		01-1-02-05,01113
    	//  ntwDomId=2/ntwId=1/pathId=298022
    	//	AC6206
//    	$("#rmEqpNm").val("AU1013_BuSan2");
//    	$("#rmEqpIdNm").val("DV10214802320");
//    	$("#rmPortNm").val("01-1-02-05");
//    	$("#rmPortId").val("29");
//    	$("#rmChanlNm").val(",01113");

//    	인접 링 교체 테스트 샘플
//    	DV10214802320	AU1013_BuSan2	29		01-1-02-05,01231
//    	TongYeongSaRyangDo-W63	/	ntwDomId=2/ntwId=1/pathId=291770
//    	$("#rmChanlNm").val(",01231");
    	
//    	트렁크 교체 테스트 샘플
//    	N000000240748	ntwDomId=1/ntwId=1/pathId=1070223	3
//    	==> UDCS43 / DV10214793179 / 01-3-05-16	/ 820 / ,02352
//    	==> 트렁크 UDCS43 A 포트를 B 포트로 변경해서 테스트
//    	==> RM_TEST_DCS패치(U13 01-3-05-13_U43 01-3-05-16) / N000003088425
//    	$("#rmEqpNm").val("UDCS43");
//    	$("#rmEqpIdNm").val("DV10214793179");
//    	$("#rmPortNm").val("01-3-05-16");
//    	$("#rmPortId").val("820");
//    	$("#rmChanlNm").val(",02352");
    	
//    	다중 RM 선번 테스트
//    	$("#rmEqpNm").val("UDCS41");
//    	$("#rmEqpIdNm").val("DV10214784638");
//    	$("#rmPortNm").val("01-3-04-03");
//    	$("#rmPortId").val("798");
//    	$("#rmChanlNm").val(",05221");
    	
    	
    	//if (! jQuery.isEmptyObject(param) ) {
		paramData = param;		 
		setInitParam();
		//createMgmtGrpSelectBox ("mgmtGrpCdPop", "A", mgmtGrpCdVal);  // 관리 그룹 selectBox
				
		$("#visualWkDiv").remove();
		$("#visualDiv").append("<div id=\"visualWkDiv\" style=\"width:100%; height:400px;\"></div>");
		
		initDiagram();
		initGrid();
		//setSelectCode();
		setEventListener();
		
		// 1. [수정] RM정보존재시 자동조회
		if ((param.rnmEqpId != null  &&  nullToEmpty(param.rnmEqpId) != '')
			|| (param.rnmPortId != null && nullToEmpty(param.rnmPortId) != '')
			|| (param.rnmPortChnlVal != null && nullToEmpty(param.rnmPortChnlVal) != '')
			) {
			$('#btnPopSearch').click();
		}

    	$('#btnExportExcel').setEnabled(false);
    };

 // select 조회조건 코드 세팅
    function setInitParam() {    			
		//console.log(paramData);
    	// 전송실 설정 
		mtsoList = paramData.vTmofInfo;
		//console.log(mtsoList);
    	//$('#mtsoId').val(nullToEmpty(paramData.mtsoId));    	    	    	    	   
    };
    
    //Grid 초기화
    function initGrid() {    	
        //그리드 생성
        $('#' + pathGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,    		
    		numberingColumnFromZero: false,  
//        	rowInlineEdit : true, //행전체 편집기능 활성화
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		pager:false,
			height : 715,	    	      
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [ //{ selectorColumn : true, width : '50px' } 
				 {key : 'seq'	              	,title : cflineMsgArray['sequence'] /*  순번 */ ,align:'left'  , width: '250px', styleclass : nodeCopyPasteCss , hidden: true}
	        	, {key : 'rnmSctnNm'	    ,title : cflineMsgArray['rmPathNm'] /*  RM PATH명 */ ,align:'left'  , width: '200px', styleclass : nodeCopyPasteCss}		    		        		       
	        	, {key : 'rnmSctnIdNm'	    ,title : cflineMsgArray['rmPathIdNm'] /* RM PATH ID명 */ ,align:'center', width: '200px'}                                                                                     	                                                                                           
	        	, {key : 'eqpId'	   			,title : cflineMsgArray['equipmentIdentification'] /* 장비 ID */ ,align:'center', width: '100px', hidden: true , styleclass : nodeCopyPasteCss}
	        	, {key : 'portId'	    		,title : cflineMsgArray['portId'] /* PORT ID */ ,align:'center', width: '100px' , hidden: true  , styleclass : nodeCopyPasteCss}
	        					]
			});
        
        	$('#'+pathGrid).alopexGrid("updateOption", { fitTableWidth: true });
        
        	$('#'+pathGrid).on('scrollBottom', function(e){    		
	    		var nFirstRowIndex =parseInt($("#firstRowIndexPop").val()) + popPageForCount; 
	    		$("#firstRowIndex").val(nFirstRowIndex);
	    		var nLastRowIndex =parseInt($("#lastRowIndexPop").val()) + popPageForCount;
	    		$("#lastRowIndex").val(nLastRowIndex);    		
	        	var dataParam =  $("#searchPopForm").serialize(); 
	        	cflineShowProgress(pathGrid);
	        	
				var param = Object;
				param = {"firstRowIndex" : nFirstRowIndex, "lastRowIndex" : nLastRowIndex , "eqpId": nullToEmpty($("#rmEqpIdNm").val())
								, "portId" : nullToEmpty($("#rmPortId").val()), "rmPortChnlVal" : nullToEmpty($("#rmChanlNm").val())}
	        	
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/getrmlinepathlistpop', param, 'GET', 'searchPopForPageAdd');    		
        	});
        	
       
        	//그리드 생성
            $('#' + trunkGrid).alopexGrid({
            	autoColumnIndex: true,
        		autoResize: true,
        		cellSelectable : false,
        		rowClickSelect : true,
        		rowSingleSelect : true,
        		numberingColumnFromZero: false,  
//            	rowInlineEdit : true, //행전체 편집기능 활성화
        		enableDefaultContextMenu:false,
        		enableContextMenu:true,
        		pager:false,
    			height : 200,	    	      
    			message: {
    				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    			},
    			columnMapping: [ //{ selectorColumn : true, width : '50px' } 
    			 	 {title : cflineMsgArray['sequence'] /*순번*/,	align:'center', width: '40px', numberingColumn: true }
    			 	, {key : 'topoSclNm'	, title : cflineMsgArray['topoSclNm']/*망종류*/, align:'center'	, width: '80px' }
    			 	, {key : 'ntwkLineNo'	, title : cflineMsgArray['ntwkLineNo']/*네트워크ID*/, align:'center'	, width: '120px' }
    				, {key : 'ntwkStatNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px' , hidden : true}
    	            , {key : 'ntwkLineNm'	, title : cflineMsgArray['ntwkLineNm']/*네트워크명*/, align:'left'	, width:'150px'	}
    	            , {key : 'mgmtGrpNm'	    ,title : cflineMsgArray['managementGroup'] /* 관리그룹 */	,align:'center', width: '80px'}
    	            , {key : 'ntwkCapaCdNm'	, title : cflineMsgArray['capacity'] /*용량*/, align:'center'	, width: '55px'}
    	            , {key : 'lineOpenDt'	    ,title : cflineMsgArray['openingDate'] /* 개통일자 */ ,align:'center', width: '80px', hidden : true}
    	            , {key : 'lastChgDate'	, title : cflineMsgArray['modificationDate']/*수정일자*/, align:'center'	, width: '80px'}
    	  			, {key : 'uprMtsoNm'	, title : cflineMsgArray['upperMtsoNm']/*상위국사명*/, align:'left'	, width: '120px'}
    	  			, {key : 'lowMtsoNm'	, title : cflineMsgArray['lowerMtsoNm']/*하위국사명*/, align:'left'	, width: '120px'} 
    	  			]
    			});
            
    };    
   	
    function setEventListener() { 	
    	// RM 엔터 이벤트 
     	$('#searchPopForm').on('keydown', onKeyDownSearchPopForm);	
	   	    
     	// Trunk 엔터 이벤트 
     	$('#searchPopForm2').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnPopSearch2').click();
    			return false;
    		}
     	});	
     	
	   	//조회 
	   	$('#btnPopSearch').on('click', searchRmPathList);
    	  
		// 자동 교체
		$('#ckbAutoReplacePath').on('click', onAutoReplaceCheckedChanged );
	   	
		
     	// 트렁크 그리드 더블클릭
 		$('#'+trunkGrid).on('dblclick', '.bodycell', function(e){
 			
 			try {
 	 			var evObj = AlopexGrid.parseEvent(e);
 	 			var row = evObj.data._index.row;	
 	 			var dataObj = AlopexGrid.parseEvent(e).data;
 	 			// select row 
 	 			$('#' + trunkGrid).alopexGrid("rowSelect", {_index:{data:row}} , true);
 	 			
 	 			var node = new Object();
 	 			node.data = new Object();
 	 			if ( dataObj.topoLclCd == '002' ) {
 	 				node.data.category = 'TRUNK';
 	 			} else {
 	 				node.data.category = 'RING';
 	 			}
 	 			node.data.NETWORK_ID = dataObj.ntwkLineNo;
 	 			networkInfoPop(node);
 				
 			} catch ( err ) {
 				console.log(err);
 			}
	    }); 
 				
		
		
		// 닫기
	   	$('#btnPopClose').on('click', function(e) {	   		
	   		$a.close();
	   	});
	   	
     	// 그리드 더블클릭
 		$('#'+pathGrid).on('dblclick', '.bodycell', function(e){
 			
 			var evObj = AlopexGrid.parseEvent(e);
 			var row = evObj.data._index.row;	
 			var dataObj = AlopexGrid.parseEvent(e).data;
 			// select row 
 			$('#' + pathGrid).alopexGrid("rowSelect", {_index:{data:row}} , true);
 			
 			selectRmPath();
	    }); 
 		
 	 	//  선번교체
	   	$('#btnlineNoShift').on('click', function(e) {
	   		$a.close();
	   		opener.rmLinePathAdd(rmTeamsPath);
	   	});
 		
		// 서비스회선 선번 조회버튼 클릭
		$('#btnSvlnLnoInfoPop').on('click', function(e) {
			if(selectDataObj == null){
	   			alertBox('W', cflineMsgArray['selectNoData']); /*  선택된 데이터가 없습니다. */	   			
	   			return;				
			}
    		showServiceLIneInfoPop(pathGrid, selectDataObj, "N");			
		}); 
		
		//엑셀다운로드
	    $('#btnExportExcel').on('click', function(e) {
	    	funExcelBatchExecute();
	    });
	};
    
	// 엑셀배치실행
    function funExcelBatchExecute(){
    	
    	var param = Object;
		param = {"eqpId": nullToEmpty($("#rmEqpIdNm").val())
						, "portId" : nullToEmpty($("#rmPortId").val()), "rmPortChnlVal" : nullToEmpty($("#rmChanlNm").val())}
    	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/excelBatchExecute', param, 'POST', 'excelBatchExecute'); 
    }
	
	function onKeyDownSearchPopForm(e){
 		var rmEqpId = $("#rmEqpIdNm").val();
 		var rmPortId = $("#rmPortId").val();
 		
 		// 검색 Enter 이벤트
 		if (e.which == 13  ){
 			if (nullToEmpty(e.target.id) == "rmEqpNm") {
				cflineShowProgressBody();
 				searchData("searchEqp", "");	
 			} else if (nullToEmpty(e.target.id) == "rmPortNm") {
				if(nullToEmpty(rmEqpId) == ""){
 					$("#rmEqpNm").focus();
    				alertBox('W', "장비를 먼저 검색하십시오.");
     				return false;
 				}else{     			   
 					cflineShowProgressBody();
 					searchData("searchPort", "");	
 				}
 			}
 			
			return false;
		}
 	};
	
 	
 	/**
 	 * RM 선번 목록을 조회한다.
 	 */
 	function searchRmPathList(e) {
 		try {
 			
			selectDataObj = null;
			var rmEqpIdNm = $("#rmEqpIdNm").val();
			var rmEqpNm = $("#rmEqpNm").val();
			var rmPortId = $("#rmPortId").val();
			var rmPortNm = $("#rmPortNm").val();
			var rmChannel = $("#rmChanlNm").val();
			
			if(nullToEmpty(rmEqpIdNm) == "" || nullToEmpty(rmEqpNm) == ""){
				$("#rmEqpNm").focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/
				$("#rmEqpNm").attr('style', 'background-color:#ffffff');
				
				if( nullToEmpty(rmPortNm) == ""){        			
	    			$("#rmPortNm").attr('style', 'background-color:#ffffff');        			
	    			$("#rmPortId").val("");         			
	     		}
	 			return false;
	 		}
			
			if(nullToEmpty(rmPortNm) == ""){
				$("#rmPortNm").focus();
				$("#rmPortId").val("");
				$("#rmPortNm").attr('style', 'background-color:#ffffff');
	 		}
			    		
			
			$("#firstRowIndexPop").val(1);
			$("#lastRowIndexPop").val(popPageForCount);
	
			var param = Object;
			param = {"firstRowIndex" : 1, "lastRowIndex" : popPageForCount , "eqpId": nullToEmpty($("#rmEqpIdNm").val())
							, "portId" : nullToEmpty($("#rmPortId").val()), "rmPortChnlVal" : nullToEmpty($("#rmChanlNm").val())}
			//console.log(param);
			cflineShowProgress(pathGrid);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/getrmlinepathlistpop', param, 'GET', 'searchPop');
 		} catch ( err ) {
 			console.log(err);
 			cflineHideProgress(pathGrid);
 		}
 		
    };
 	
	
	var httpRequest = function(Url, Param, Method, Flag ) {
		var deferred = $.Deferred();
		//console.log(Flag);
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response, status, jqxhr, flag){
    		successCallback(response, status, jqxhr, flag);
    		deferred.resolve(response);
    	})
		  .fail(failCallback);
    	return deferred.promise();
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//console.log(flag);
    	//console.log(response);
    	
    	//조회시
    	if(flag == 'searchPop'){
    		//$('#'+gridResult).alopexGrid('hideProgress');    	
    		cflineHideProgress(pathGrid);
    		setSPGrid(pathGrid, response, response.RmLinePathListPop);
    	}
    	
    	// 트렁크 조회시
    	if(flag == 'searchTrunkPop'){
    		//$('#'+gridResult).alopexGrid('hideProgress');    		
    		cflineHideProgress(trunkGrid);
    		$('#'+trunkGrid).alopexGrid("dataEmpty");
    		if(response.RmLinePathTrunkListPop.length == 0){
				//alert('더 이상 조회될 데이터가 없습니다');
				return false;
			}else{
				//console.log( response.RmLinePathTrunkListPop);
	    		$('#'+trunkGrid).alopexGrid("dataSet", response.RmLinePathTrunkListPop);
	    		//$('#'+pathGrid).alopexGrid("updateOption", { rowClickSelect : true }); ////rowClickSelect : true
			}
    	}   	
    	
    	if(flag == 'searchPopForPageAdd'){
    		cflineHideProgress(pathGrid);
			if(isNullOrEmpty(response.RmLinePathListPop) || response.RmLinePathListPop.length == 0){
				//alert('더 이상 조회될 데이터가 없습니다');
				return false;
			}else{
	    		$('#'+pathGrid).alopexGrid("dataAdd", response.RmLinePathListPop);
			}
		
    	}
    	
    	if(flag == 'searchTrunkPopForPageAdd'){
    		//$('#'+gridResult).alopexGrid('hideProgress');
    		cflineHideProgress(trunkGrid);
			if(isNullOrEmpty(response.ServiceLineList) || response.ServiceLineList.length == 0){
				//alert('더 이상 조회될 데이터가 없습니다');
				return false;
			}else{
	    		$('#'+trunkGrid).alopexGrid("dataAdd", response.RmLinePathTrunkListPop);
			}
    	}
    	
    	if(flag == "searchEqp"){
    		//console.log( response.totalCnt);
    		var totalCnt = response.totalCnt;
    		if(totalCnt == 1){    			
    			$("#rmEqpNm").val(response.eqpInfList[0].neNm); 
    			$("#rmEqpIdNm").val(response.eqpInfList[0].neId);
    			$("#rmEqpNm").attr('style', 'background-color:#e2e2e2');
    			
    			$("#rmPortNm").val(""); 
    			$("#rmPortIdNm").val("");
    			$("#rmPortNm").attr('style', 'background-color:#ffffff');
    		}else{
    			var rmEqpNm  = $("#rmEqpNm").val();    			
    			$("#rmEqpIdNm").val("");
    			$("#rmEqpNm").attr('style', 'background-color:#ffffff');
    			openNeListPop(rmEqpNm);   	
    		}
    		cflineHideProgressBody();
    	}
    	
    	if(flag == "searchPort"){
    		//console.log( response.totalCnt);
    		var totalCnt = response.totalCnt;
    		if(totalCnt == 1){    		
    			$("#rmPortNm").val(response.portInfList[0].portNm); 
    			$("#rmPortId").val(response.portInfList[0].portId);
    			$("#rmPortNm").attr('style', 'background-color:#e2e2e2');
    		}else{
    			$("#rmPortId").val("");
    			$("#rmPortNm").attr('style', 'background-color:#ffffff');
    			var paramData = new Object();
    	   		$.extend(paramData,{"neId":nullToEmpty($("#rmEqpIdNm").val())});
    	   		$.extend(paramData,{"portNm":nullToEmpty($("#rmPortNm").val())});
    				
    	   		// ne_role_cd, ntwk_line_no
    			var urlPath = $('#ctx').val();
    			if(nullToEmpty(urlPath) ==""){
    				urlPath = "/tango-transmission-web";
    			}
    	   		$a.popup({
    				  	popid: "popPortListSch",
    				  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
    				  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
    				  	data: paramData,
    				  	iframe:true,
    					modal: true,
    					movable:true,
//    					windowpopup : true,
    					width : 1100,
    					height : 740,
    					callback:function(data){
    						//console.log(data);
    					
    						if(data != null && data.length > 0){
    							var portNm = data[0].portNm;
    							var portId = data[0].portId;		
    							$("#rmPortNm").val(portNm);
    							$("#rmPortId").val(portId);
    							$("#rmPortNm").attr('style', 'background-color:#e2e2e2');
    						}else{
    							$("#rmPortId").val("");
    			    			$("#rmPortNm").attr('style', 'background-color:#ffffff');
    						}
    					}
    				});       			
    		}
    		cflineHideProgressBody();
    	}
    	
    	// 시각화 생성 
    	if(flag == 'selectRmPath') {
    		cflineHideProgress(pathGrid);
    		//$('#' + pathGrid).alopexGrid("dataEmpty");
    		if ( response.rmOriginalPath != undefined && response.rmAutoReplacedPath != undefined ) {
    			// 초기화
    			nodeDataArray = [];
    			linkDataArray = [];
    			
    			rmOriginalTeamsPath = new TeamsPath();
				rmOriginalTeamsPath.fromData(response.rmOriginalPath);

    			rmAutoReplacedTeamsPath = new TeamsPath();
    			rmAutoReplacedTeamsPath.fromData(response.rmAutoReplacedPath);
    			
    			drawDiagram();
    			
			}
    		
    		if (response.ntwkList != undefined) {
    			$('#'+trunkGrid).alopexGrid("dataSet", response.ntwkList);    			
    		}
    	}
    	
 	 	//  선번교체
    	if(flag == 'updateRmInfo') {
	   		$a.close();
	   		opener.rmLinePathAdd(teamsShortPathData);
    	}
    	
    	if(flag == 'excelBatchExecute') {
			if(response.returnCode == '200'){ 
				jobInstanceId  = response.resultData.jobInstanceId;
				cflineHideProgressBody();
				excelCreatePop(jobInstanceId);
			}else if(response.returnCode == '500'){ 
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
			}
    	}
    	
    };
        
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300,
                callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		//$('#btnSearch').click();
                  	}
               	}
            });
    }
    
 // 색상 처리
    function nodeCopyPasteCss(value, data, mapping) {
    	// 장비 복사, 잘라내기 배경색 
    	var returnValue = "";
    	if(data.delYn == "Y") {
    		if(mapping.key == "jobTitle") {
    			returnValue = 'openTaskDeleteFontColor';
    		} 
    	}
    	return returnValue;
    };
    
    function getUrlPath() {
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) == ""){
    		urlPath = "/tango-transmission-web";
    	}
    	return urlPath;
    }; 
    
    /**
     * 장비 건수 조회
     * 그리드 데이터 세팅  
     */
    function searchData(division, eqpId){    	
    	var callBackFlag = division;
    	var firstRowIndex = infoMaxnumber;
		var lastRowIndex = popPageForCount;		
		var pTopMtsoIdList = [];
		
		// 관할국사
    	if(mtsoList != null) {
    		for( i in mtsoList){
    			pTopMtsoIdList.push(mtsoList[i].mtsoId);
    		}
    	}
    	
    	if(callBackFlag == "searchEqp"){			
    		var rmEqpNm = $("#rmEqpNm").val();	   		
			var paramData = {"neNm" : rmEqpNm, "firstRowIndex" : firstRowIndex, "lastRowIndex":lastRowIndex, "vTmofInfo" : mtsoList, "fdfAddVisible" : true, "partnerNeId" : null, "multiSelect" : true};		    		       		       		    	
    		var dataParam = $.param(paramData, true);
	    	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getEqpInfList', dataParam, 'GET', callBackFlag);
    	}else{    	
    		var nFirstRowIndex = 1;
    		var nLastRowIndex = 20;    		
			var serviceLineYn = 'N';
			var svlnNo = "";	
			var rmEqpIdNm = $("#rmEqpIdNm").val();		
			var portNm = $("#rmPortNm").val();			
    		var paramData =  { "firstRowIndex" : firstRowIndex, "lastRowIndex" : lastRowIndex , "neId" : rmEqpIdNm, "PortNm" : portNm, "topMtsoIdList" : pTopMtsoIdList};    	
    		    		
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/getPortInfList', paramData, 'GET', callBackFlag);    		    		    	
    	}
    };

    /**
	 * RM 장비명 찾기
	 */   
   	$('#btnEqpPopSch').on('click', function(e) {
   		var rmEqpNm  = $("#rmEqpNm").val();
   		openNeListPop(rmEqpNm);   		
    });
   	
   	/**
   	 * 장비 검색 팝업
   	 */
   	function openNeListPop(rmEqpNm) {
   		var pTopMtsoIdList = [];												   		
   		var  topMtsoIdList = [];
   		var paramData = new Object();
   		//paramData = {"neNm": nullToEmpty(rmEqpNm), "vTmofInfo":mtsoList, "fdfAddVisible":true, "Type":"Rm", "topMtsoIdList" : mtsoList};
   		paramData = {"neNm": nullToEmpty(rmEqpNm), "vTmofInfo":mtsoList, "fdfAddVisible":true, "Type":"Rm", "mgmtGrpCd":mgmtGrpCd};
		//console.log(paramData);
		
   		$a.popup({
   		  	popid: "popEqpListSch",
   		  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
   		  	url: getUrlPath() + '/configmgmt/cfline/EqpInfPop.do',
   		  	data: paramData,
   			modal: true,
   			movable:true,
   			width : 1200,
   			height : 810,
   			callback:function(data){
   				//console.log(data);   
   				
   				if(data != null){   	
   					$('#rmEqpIdNm').val(data.neId);
   					$('#rmEqpNm').val(data.neNm);   			
   					$("#rmEqpNm").attr('style', 'background-color:#e2e2e2');
   					
   					$("#rmPortNm").val(""); 
   	    			$("#rmPortIdNm").val("");
   	    			$("#rmPortNm").attr('style', 'background-color:#ffffff');
   				}else{   					
   					$('#rmEqpIdNm').val("");
   					$("#rmEqpNm").attr('style', 'background-color:#ffffff');
   				}
   			}
   		});
   	};
   	
    /**
	 * RM 포트명 찾기
	 */   
   	$('#btnPortPopSch').on('click', function(e) {		
   		var rmEqpIdNm = $("#rmEqpIdNm").val();
   		var searchPortNm = $("#rmPortNm").val(); 
   	
   		if(nullToEmpty(rmEqpIdNm) == ""){
			$("#rmEqpNm").focus();
			alertBox('W', makeArgMsg('rmEqpIdCheck',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/    			
 			return false;
 		}
   		if(nullToEmpty(searchPortNm) == ""){
			$("#rmPortNm").focus();
			alertBox('W', makeArgMsg('required',cflineMsgArray['rmPortNm'],"","","")); /*" RM포트명은필수 입력 항목입니다.;*/
 			return false;
 		}
   		
   		var paramData = new Object();
   		$.extend(paramData,{"neId":nullToEmpty(rmEqpIdNm)});
   		$.extend(paramData,{"portNm":nullToEmpty(searchPortNm)});
			
   		// ne_role_cd, ntwk_line_no
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
   		$a.popup({
			  	popid: "popPortListSch",
			  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
			  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
			  	data: paramData,
			  	iframe:true,
				modal: true,
				movable:true,
//				windowpopup : true,
				width : 1100,
				height : 740,
				callback:function(data){
					//console.log(data);
				
					if(data != null && data.length > 0){
						var portNm = data[0].portNm;
						var portId = data[0].portId;		
						$("#rmPortNm").val(portNm);
						$("#rmPortId").val(portId);
					}
				}
			});   		
    });
   	   	
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchPop' || flag == 'searchPopForPageAdd'){
    		//$('#'+gridResult).alopexGrid('hideProgress');
    		cflineHideProgress(pathGrid);
    		//alert('조회 실패하였습니다.');
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}else{
    		console.log(response);
    	}
    };
    
    // set SPGrid
    function setSPGrid(GridID ,Option ,Data) {

		if(Data.length == 0){
			//alert('조회된 데이터가 없습니다.');
			$('#'+GridID).alopexGrid("dataSet", Data);
			$('#'+GridID).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(Option.totalCnt);
					}}}
			);
		}else{
    		$('#'+GridID).alopexGrid("dataSet", Data);
    		//$("#total").html(response.pager.totalCnt);
    		$('#'+GridID).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(Option.totalCnt);
					}}}
			);
    		$('#btnExportExcel').setEnabled(true);
		}	 
	};   
    
    
	function onAutoReplaceCheckedChanged(e) {
		try {
			
			drawDiagram();
// 			selectRmPath();

		} catch ( err ) {
			console.log(err);
		}
	};
    
	
	function drawDiagram() {
		try {
			
			if ( rmOriginalTeamsPath != null && rmAutoReplacedTeamsPath != null ) {
				var autoReplacePath = $('#ckbAutoReplacePath').is(':checked');

    			rmTeamsPath = null;
    			teamsShortPathData = null;

				if ( autoReplacePath ) {
	    			rmTeamsPath = rmAutoReplacedTeamsPath.clone();
				} else {
	    			rmTeamsPath = rmOriginalTeamsPath.clone();
				}
				
				teamsShortPathData = rmTeamsPath.toShortPath();
				generateDiagram();
				
			}
			
		} catch ( err ) {
			console.log(err);
		}
	};	
	
	
	function selectRmPath() {
	
		try {
	
 			var selectedRmList = $('#'+pathGrid).alopexGrid('dataGet', {_state:{selected:true}});
 			if ( selectedRmList.length > 0 ) {
	 			var selectedRmObj = selectedRmList[0];
	 			
	 			$('#lblRmPathNm').text( selectedRmObj.rnmSctnNm );
	 			$('#lblRmPathIdNm').text( selectedRmObj.rnmSctnIdNm );
	 			
				var autoReplacePath = $('#ckbAutoReplacePath').is(':checked');
	 			var searchParam = {"rnmSctnIdNm":selectedRmObj.rnmSctnIdNm
	 						, "eqpId": selectedRmObj.eqpId
	 						, "portId": selectedRmObj.portId
	 						, "autoReplacePath": ( autoReplacePath ? "Y" : "N" ) }
	 		 			
	 			cflineShowProgress(pathGrid);
	 			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/selectRmPath', searchParam, 'GET', 'selectRmPath') 
 			}
		} catch ( err ) {
			console.log(err);
			cflineHideProgress(pathGrid);
		}
		
	};
    
   	//*****************************************************************************************//
    
    /**
     * 시각화 다이어그램 init
     */
    function initDiagram() {
    	visualLinePath =
    		$go(go.Diagram, "visualWkDiv",
    	        {
    			  //maxSelectionCount: 0,
    			  layout:
    	        	  $go(go.GridLayout,
    			              {  
    	        		  			wrappingWidth: Infinity, cellSize: new go.Size(4, 4), spacing: new go.Size(20, 20),
    	        		  			alignment: go.GridLayout.Position,
//    	        		  			arrangement:go.GridLayout.Position,
    	        		  			arrangement: go.GridLayout.Location,
    	        		  			comparer: function(a, b) {
    									var av = a.data.SEQ;
    									var bv = b.data.SEQ;
    									if(av < bv) return -1;
    									if(av > bv) return 1;
    									return 0;
    	        		  			}
    	        	                , wrappingColumn:4
    			              }), 
    	          initialContentAlignment: go.Spot.Center,
    	          "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom,
    	          "clickCreatingTool.insertPart":function(loc){
    	        	  this.archetypeNodeData = {
    	        	      loc:loc		  
    	        	  };
    	        	  console.log(loc);
   	        	      return go.ClickCreatingTool.prototype.insertPart.call(this,loc);
    	          },    		
    		      isEnabled: true
    		
    	        }
    		);
    	
    	makeNodeTemplate();
    	makeLinkTemplate();
    	
    	visualLinePath.allowDelete = false;
    	
    };
    
    // 노드 만들기
    function makeNodeTemplate() {
    	setNodeTemplate();
    	setGroupTemplate();
    };
    
    /**
     * 서비스 회선
     * 노드 템플릿 정의
     *  - 좌포트, 좌채널, 장비, 우포트, 우채널 모양의 테이블 생성
     */
    function setNodeTemplate() {
    	var node = baseNodeTemplate();
    	visualLinePath.nodeTemplate = node;
    };
    

    /**
     * 서비스 회선
     * 그룹 템플릿 정의
     *   - 사용 네트워크를 그룹핑 하는 템플릿
     *   @returns
     */
    function setGroupTemplate() {
    	var group = baseGroupImageTemplate();
    	
    	visualLinePath.groupTemplateMap.add("TRUNK", group);
    	visualLinePath.groupTemplateMap.add("RING", group);
    	visualLinePath.groupTemplateMap.add("WDM_TRUNK", group);
    };
        
    /**
     * 서비스회선 링크 템플릿
     */
    function makeLinkTemplate() {
    	visualLinePath.linkTemplate = baseLinkTemplate();
    };
        
    /**
     * 기본 템플릿. 텍스box트
     * @returns
     */
    function baseNodeTemplate() {
    	
    	var node =
    		$go(go.Node, "Auto",
    	        {
    				mouseDrop: function(e, nod) { 
    					if(nod.containingGroup != null) {
    						visualLinePath.currentTool.doCancel();
    					} else {
    						finishDrop(e); 
    					}
    				}
    				, mouseEnter: mouseEnter
    				, mouseLeave : mouseLeave
    	        }
    		
    	        , $go(go.Shape, "RoundedRectangle" , { fill: null, strokeWidth: 2, name: "SHAPE" , parameter1: 10, stroke: null})	// , new go.Binding("stroke", "color")  
    			, $go(go.Panel, "Vertical"
    				, $go(go.Panel, "Horizontal"
    							, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
    									, toolTip : $go(go.Adornment, "Auto"
    												, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
    												, $go(go.TextBlock, new go.Binding("text", "", nodeTooltipText), { margin: 4 })
    									) 
    							}
//    							, new go.Binding("background", "color")
    							, $go(go.TextBlock
    									, {
    										margin: 5,
//    										alignment: go.Spot.Left,
    							            isMultiline: true,
    							            editable: false,
    							            font: "bold 10px sans-serif",
    							            wrap: go.TextBlock.WrapFit,
//    							            stroke: "#404040",
//    							            opacity: 0.75,
    							            width: 145,
    							            height: 31
    						             }
    									, new go.Binding("text", "NE_NM").makeTwoWay()
    							)
    							
    							
    				)  // end Horizontal Panel
    						
    				, $go(go.Panel, "Table"
    						, { padding: 0.1}
    						, $go(go.RowColumnDefinition, {row: 0, separatorStroke: "black" })
    						, $go(go.RowColumnDefinition, {column: 0 })
    						, $go(go.RowColumnDefinition, {column: 1 })
    						, $go(go.RowColumnDefinition, {column: 2 })	// , separatorStroke: "black"
    						
    						
    						, $go(go.Panel, "Auto"
    								, {row : 0, column : 0, width:60, height: 70}
    								, $go(go.Shape, "RoundedRectangle", {height:60, stroke: null, fill:null })
    								, $go(go.Shape, "RoundedRectangle", { height:40, margin: 3, stroke: null, fill:null, name: "EAST_PORT_CHANNEL_PART" })
    								, $go(go.TextBlock
    										, {
//    											alignment: go.Spot.Center,
    											textAlign:"center",
    											isMultiline: true,
    											editable: false,
    											margin: 1,
    											font: "bold 10px sans-serif",
    											maxSize: new go.Size(60, 60),
    											minSize: new go.Size(60, NaN),
    											wrap: go.TextBlock.WrapFit,
    											name : "EAST_PORT_CHANNEL"
    										}
    										, new go.Binding("text", "EAST_PORT_CHANNEL").makeTwoWay()
    								)
    						)
    						
    						, $go(go.Picture
    								, {row : 0, column : 1, name : "nodeImage", desiredSize: new go.Size(40,40), margin: 1 }
    								, new go.Binding("source", "NE_ROLE_CD", comvertPathNodeImage)
    						)
    						
    						, $go(go.Panel, "Auto"
    								, {row : 0, column : 2, width:60, height: 70}
    								, $go(go.Shape, "RoundedRectangle", {height:60, stroke: null, fill:null })
    								, $go(go.Shape, "RoundedRectangle", { height:40, margin: 3, stroke: null, fill:null, name: "WEST_PORT_CHANNEL_PART" })
    								, $go(go.TextBlock
    										, {
//    											alignment: go.Spot.Center,
    											textAlign:"center",
    											isMultiline: true,
    											editable: false,
    											margin: 1,
    											font: "bold 10px sans-serif",
    											maxSize: new go.Size(60, 60),
    											minSize: new go.Size(60, NaN),
    											wrap: go.TextBlock.WrapFit,
    											name : "WEST_PORT_CHANNEL"
    										}
    										, new go.Binding("text", "WEST_PORT_CHANNEL").makeTwoWay()
    								)
    						)
    				)
    				 
    				
    	       )
    	    );
    	
    	return node;
    };
    
    
    function baseGroupImageTemplate() {
    	var group = $go(go.Group, "Auto", 
     				{
    		 			background: "transparent",
    	 				layout:  
    						$go(go.GridLayout
    							, { wrappingWidth: Infinity, wrappingColumn:4, cellSize: new go.Size(4, 4), spacing: new go.Size(10, 10),
    								alignment: go.GridLayout.Position,
    								comparer: function(a, b) {
    									var av = a.data.SEQ;
    									var bv = b.data.SEQ;
    									if(av < bv) return -1;
    									if(av > bv) return 1;
    									return 0;
    								}
    							} // wrappingWidth: Infinity, 
    					)
    					, mouseEnter: mouseEnter
    					, mouseLeave : mouseLeave
    					, mouseDrop: function(e, nod) { 
    						if(nod.isSubGraphExpanded) {
    							// 펼쳐진 상태이면
    							visualLinePath.currentTool.doCancel();
    						} else {
    							finishDrop(e); 
    						}
    					}	
    					, handlesDragDropForMembers: false
    					, isSubGraphExpanded : true
    					, subGraphExpandedChanged: function(group) {
    						if(group.isSubGraphExpanded) {
    							// 펼쳐져 있으면 이미지 숨기기
    							group.findObject("groupImageLarge").visible = false;
    							group.findObject("groupImageSmall").visible = true;
    							group.findObject("networkNm").width = 300;
    						} else if(!group.isSubGraphExpanded) {
    							// 묶여져 있으면 이미지 보이기
    							group.findObject("groupImageLarge").visible = true;
    							group.findObject("groupImageSmall").visible = false;
    							group.findObject("networkNm").width = 100; 
    						}
    						
    						visualLinePath.contentAlignment = go.Spot.Center;
    					}
    					
    				}
    				, $go(go.Shape, "RoundedRectangle" , { name:"SHAPE", parameter1: 20, fill : null, stroke : null}) // , new go.Binding("stroke", "color")  fill: "rgb(255,255,255)", stroke:"rgba(0,0,0,0.3)"
    				, $go(go.Panel, "Vertical"
    					, $go(go.Panel, "Horizontal"
    								, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
    									, toolTip : $go(go.Adornment, "Auto"
    													, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
    													, $go(go.TextBlock, new go.Binding("text", "NETWORK_NM"), { margin: 4 })
    									)
    								}
//    								, new go.Binding("background", "color")
    								, $go("SubGraphExpanderButton"
    										, { alignment: go.Spot.Right, margin: 5 })
    								, $go(go.Picture
    										, {name : "groupImageSmall", desiredSize: new go.Size(30,30), margin: 10, visible : true}
    										, new go.Binding("source", "category", comvertPathImage)
    								)
    								, $go(go.TextBlock
    										, {
    												margin: 5,
    												alignment: go.Spot.Left,
    												isMultiline: true,
    												editable: false,
    												font: "bold 11px sans-serif",
    			//								            wrap: go.TextBlock.WrapFit,
//    												stroke: "#404040",
//    												opacity: 0.75,
    												width: 300,
    												height:30,
    												name : "networkNm"
    									}
    									, new go.Binding("text", "NETWORK_NM").makeTwoWay()
    									, new go.Binding("stroke", "color")
    								)
    								
    								
    					)  // end Horizontal Panel
    					, $go(go.Picture
    								, {name : "groupImageLarge", desiredSize: new go.Size(60,60), margin: 1, visible : false }
    								, new go.Binding("source", "category", comvertPathImage)
    					)
    					, $go(go.Placeholder
    							, { padding: 5, alignment: go.Spot.Center }
    					)
    			)  // end Vertical Panel
    		);
    	
    	return group;
    };
    
    /**
     * 링크 템플릿
     * @returns
     */
    function baseLinkTemplate() {
    	var link = $go(go.Link
    			//, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left} // 여러개 일경우
    			, {routing:go.Link.JumpGap, corner:5, selectable:true, fromSpot: go.Spot.Right, toSpot: go.Spot.Left,
		    		doubleClick : function(e){
						console.log(e);
					}
    			} 
    			//, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top} 한개일 경우
    			, new go.Binding("fromSpot", "fromSpot", go.Spot.parse)
    			, new go.Binding("toSpot", "toSpot", go.Spot.parse)
    			, $go(go.Shape, {strokeWidth:1, stroke:"black"})
    			, $go(go.Shape, {toArrow: "Standard", stroke:"black"})
    	);
    	
    	return link;
    };
    
    function mouseEnter(e, obj) {
    	var shape = obj.findObject("SHAPE");
    	shape.stroke = "#6DAB80";
    	shape.strokeWidth = 2;
    	
    	if(obj.data.NE_ROLE_CD != undefined) {
    		obj.findObject("nodeImage").source = comvertPathNodeImageOn(obj.data.NE_ROLE_CD); 
    	}
    };

    function mouseLeave(e, obj) {
    	var shape = obj.findObject("SHAPE");
    	shape.stroke = obj.data.color;
//    	if(obj.data.isGroup) {
//    		shape.stroke = "rgba(0,0,0,0.3)";		
//    	} else {
//    		shape.stroke = null;
//    	}
    	
    	shape.stroke = null;
//    	shape.strokeWidth = 2;
//    	shape.background = "transparent";
    	
    	if(obj.data.NE_ROLE_CD != undefined) {
    		obj.findObject("nodeImage").source = comvertPathNodeImage(obj.data.NE_ROLE_CD); 
    	}
    };
    
 // 노드 툴팁
	 function nodeTooltipText(data) {
	     var str = "";
	     str = '장비ID : ' + nullToEmpty(data.Ne.NE_ID) + '\n장비명 : ' + nullToEmpty(data.Ne.NE_NM) + '\n장비역할 : ' + nullToEmpty(data.Ne.NE_ROLE_NM)
	 	+ '\n제조사 : ' + nullToEmpty(data.Ne.VENDOR_NM)
	 	+ '\n모델 : ' + nullToEmpty(data.Ne.MODEL_NM)
	 	+ '\n모델(대) : ' + nullToEmpty(data.Ne.MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.Ne.MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.Ne.MODEL_SCL_NM)
	  	+ '\n상태 : ' + nullToEmpty(data.Ne.NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.Ne.ORG_NM) + '\n전송실 : ' + nullToEmpty(data.Ne.ORG_NM_L3)
	  	+ '\n더미장비 : ' + nullToEmpty(data.Ne.NE_DUMMY);
	     
	     return str;
	 };
	 
	 function comvertPathImage(category) {
	    	var path = getUrlPath() + "/resources/images/path/" + category + ".png";
	    	return path;
	 };
	 
	 function comvertPathNodeImage(neRoleCd) {
		 return getEqpIcon(neRoleCd,"");
	 };
	 
	 function comvertPathNodeImageOn(neRoleCd) {
		 return getEqpIcon(neRoleCd,"S");
	 };
	
	
    /**
     * generateDiagram
     */
    function generateDiagram() {
    	//visualLinePath.startTransaction("generateDiagram");
    	
		nodeDataArray = [];
		linkDataArray = [];
    	
        generateNodes();
        generateLinks();
        
        visualLinePath.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        //visualLinePath.commitTransaction("generateDiagram");        
        nodeSelectionAdornedPath();
    };
    
   	/**
     * 노드를 생성한다.
     */
    function generateNodes() {
    	useTrunkNetworkId = null;
    	useRingNetworkId = null;
    	useWdmTrunkNetworkId = null;
    	var guid = null;
    	
        for ( var idx = 0; idx < teamsShortPathData.NODES.length; idx++) {
        	var node = teamsShortPathData.NODES[idx];
//        	node.key = idx;
        	node.key = node.NODE_ID;
        	node.NODE_ID = node.NODE_ID;
        	node.NE_NM = node.Ne.makeNodeTitle();
        	node.NE_ID = node.Ne.NE_ID;
        	node.ORG_NM = node.Ne.ORG_NM;
        	
        	node.WEST_PORT_NM = node.BPortDescr.PORT_NM;
        	node.WEST_PORT_ID = node.BPortDescr.PORT_ID;
        	node.WEST_CHANNEL_DESCR = node.BPortDescr.CHANNEL_DESCR;
        	node.WEST_PORT_CHANNEL = node.BPortDescr.PortChannelDescr(); //node.BPortDescr.PORT_NM + node.BPortDescr.CHANNEL_DESCR; 
        	
        	node.EAST_PORT_NM  =  node.APortDescr.PORT_NM;
        	node.EAST_PORT_ID  =  node.APortDescr.PORT_ID;
        	node.EAST_CHANNEL_DESCR = node.APortDescr.CHANNEL_DESCR;
        	node.EAST_PORT_CHANNEL = node.APortDescr.PortChannelDescr(); //node.APortDescr.PORT_NM + node.APortDescr.CHANNEL_DESCR;
        	
        	node.NE_ROLE_CD = node.Ne.NE_ROLE_CD;
        	node.category = "NE";
        	
        	node.color = "#DDDDDD";        	
        	
//        	node.color = "#BFAFAF";
        	
        	node.nodeTooltipText = node.toString();
        	// 노드를 그룹화 한다
        	node = generateGroupNodes(node, "line");
        	

        	// 가상여부에 따라 색상을 달리함
        	//console.log(node);
        	//console.log(node.VIRTUAL_YN);
        	
        	nodeDataArray.push( node );
        }
        
        // rest seq
        for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
        	nodeDataArray[idx].SEQ = idx + 1;
        }
    };

    /**
     * 서비스 회선 그룹 노드 생성
     *  - 노드를 묶는 trunk, ring, wdmTrunk 그룹 생성
     */
    function generateGroupNodes(node, lineNetwork) {
    	if(node.isTrunkNode()) {
    		if(useTrunkNetworkId != node.Trunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = generateTeamsNodeGroup(node, "Trunk", lineNetwork);
    		}
    		node.group = groupGuid;
    		useTrunkNetworkId = node.Trunk.NETWORK_ID;
    	} else if(node.isRingNode()) {
    		if(useRingNetworkId != node.Ring.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = generateTeamsNodeGroup(node, "Ring", lineNetwork);
    		}
    		node.group = groupGuid;
    		useRingNetworkId = node.Ring.NETWORK_ID;
    	} else if(node.isWdmTrunkNode()) {
    		if(useWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = generateTeamsNodeGroup(node, "WdmTrunk", lineNetwork);
    		}
    		node.group = groupGuid;
    		useWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    	}
    	
    	return node;
    };
    
    /**
     * 서비스 회선 그룹 노드의 타입별로 디자인 생성
     * @param  node : 노드, network : 네트워크타입, : 연결타입 
     */
    function generateTeamsNodeGroup(node, network, lineNetwork) {
    	var networkArray = new Array();
    	if(network == "Trunk") {
    		networkArray.push("TRUNK");
    		networkArray.push("#A89824");
    	} else if(network == "Ring") {
    		networkArray.push("RING");
    		networkArray.push("#FF7171");
    	} else if(network == "WdmTrunk") {
    		networkArray.push("WDM_TRUNK");
    		networkArray.push("#3A8B3A");
    	}
    	 
    	var teamsNode = new TeamsNode();
    	teamsNode.key = guid();
    	teamsNode.NODE_ID = node.NODE_ID;
    	teamsNode.isGroup = true;
    	teamsNode.expanded = false;
    	teamsNode.category = networkArray[0];
    	var networkNm = eval("node."+network+".NETWORK_NM");

    	teamsNode.NETWORK_NM = networkNm;
    	teamsNode.color = networkArray[1];
    	teamsNode.NETWORK_ID = eval("node."+network+".NETWORK_ID");
    	teamsNode.PATH_SAME_NO = eval("node."+network+".PATH_SAME_NO");
    	
    	if(network == "Trunk") {
    		// 트렁크
    		teamsNode.category = 'TRUNK';
    		teamsNode.color = '#A89824';
    	} 
    	if(lineNetwork == "line") {
    		nodeDataArray.push(teamsNode);
    	} else if(lineNetwork == "trunk") {
    		nodeTrunkDataArray.push(teamsNode);
    	} 
    	
    	return teamsNode.key;
    };
    
    
    /**
     * 링크를 연결한다.
     */
    function generateLinks() {
    	var fromKey = null;
    	var toKey = null;
    	var count = teamsShortPathData.NODES.length;
    	var prevNode = null;
    	var curNode = null;
    	
    	for ( var idx = 0; idx < count; idx++) {
        	curNode = teamsShortPathData.NODES[idx];
//        	fromKey = idx - 1;
//        	toKey = idx;
        	
        	if(prevNode == null) {
        		fromKey = -1;
        	} else {
        		fromKey = prevNode.NODE_ID;
        	}
        	toKey = curNode.NODE_ID;
        	
        	linkDataArray.push( {from : fromKey, to: toKey, isNetworkLink:prevNode !=null && prevNode.isNetworkNode() && curNode.isNetworkNode()} );
        	
        	prevNode = curNode;
        }
    };
    

 // context menu
    function contextMenu() {
    	var contextMenu = $go(go.Adornment, "Vertical",
    				$go("ContextMenuButton",
    						$go(go.TextBlock, "선번 삭제")
    						, {
    							click : function(e, obj) {
    								var node = obj.part.adornedPart;
    								removeNode(node);
    							}
    						}
    				),
    				$go("ContextMenuButton",
    						$go(go.TextBlock, "A, B포트 바꾸기")
    						, {
    							click : function(e, obj) {
    								var node = obj.part.adornedPart;
    								swapPort(node);
    							}
    						}
    				)
    	);
    	
    	return null;
    };

    function contextMenuNetwork() {
    	var contextMenu = $go(go.Adornment, "Vertical",
    			$go("ContextMenuButton",
    					$go(go.TextBlock, "선번 삭제")
    					, {
    							click : function(e, obj) {
    								var node = obj.part.adornedPart;
    								removeNode(node);
    							}
    					}
    			),
    			$go("ContextMenuButton",
    					$go(go.TextBlock, "선번 뒤집기")
    					, {
    							click : function(e, obj) {
    								var node = obj.part.adornedPart;
    								teamsPath.reverseUseNetwork(node.data.NODE_ID);
    								reGenerationDiagram();
    							}
    					}
    			),
    			$go("ContextMenuButton",
    					$go(go.TextBlock, "상세 보기")
    					, {
    						click : function(e, obj) {
    						var node = obj.part.adornedPart;
    						networkInfoPop(node);
    					}
    				}
    			)
    	);
    	
    	return null;
    };
    
    // 사용 네트워크 내의 장비 노드 선택 불가능하도록
	 function nodeSelectionAdornedPath() {
	 	for(var idx = 0; idx < nodeDataArray.length; idx++) {
	 		var nodeData = nodeDataArray[idx];
	 		var node = visualLinePath.findNodeForData(nodeData);
	 		
	 		if(!nodeData.isGroup && nodeData.isNetworkNode()) {
	 			node.selectionAdorned = false;
	 			node.movable = false;
	 		} else {
	 			if(nodeData.isGroup) {
	 				if(visualLinePath.isEnabled == true) {
	 					node.contextMenu = contextMenuNetwork();
	 				} 
	 			} else {
	 				if(visualLinePath.isEnabled == true) {
	 					node.contextMenu = contextMenu();
	 				}
	 			}
	 		}
	 	}
	 	for(var idx = 0; idx < linkDataArray.length; idx++){
	 		var linkData = linkDataArray[idx];
	 		var link = visualLinePath.findLinkForData(linkData);
	 		if(link.part.data.isNetworkLink){
	 			link.selectionAdorned = false;
	 			link.contextMenu = null;
	 		}
	 	}
	 };
	 
	 
	 function alertMsg(msg){
		 alertBox('A', msg);
	 };
});
