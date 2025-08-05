/**
 * 
 * <ul>
 * <li>업무 그룹명 : tango-transmission-web</li>
 * <li>설 명 : WdmTrunkDetailPop.js</li>
 * <li>작성일 : 2018. 5. 29.</li>
 * <li>작성자 : posgen</li>
 * </ul>
 * 
 ************* 수정이력 ************
 * 2018-05-29  1. [생성] WDM트렁크 기간망 형식으로 변경
 * 2020-01-06  2. PBOX 코드(182)  추가 
 * 2020-04-16  3. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 */  
var baseGridId = "pathBaseInfo";
var detailGridId = "pathList";
var reserveGridId = "reservePathList";
var currentGridId= "pathList";
var gridDivision = "wdm";

// 선번비교 탭의 그리드
var tmpGridList = [ 
                  { pathType : 'M', grid_new : "main_pathList" , grid_old: "old_main_pathList", grid_clct: "autoClct_main_pathList"} 
                , { pathType : 'S', grid_new : "sub_pathList" , grid_old: "old_sub_pathList", grid_clct: "autoClct_sub_pathList"} 
              ];

var gridId = "";
var ntwkLineNo = "";
var rontTrkTypCd = "";
var rontTrkTypCdArr = [];
var topoLclCd = "003";
var topoSclCd = "102";
var dataDeleteCount = 0;
var baseInfData = [];
var setIdNumber = 1;
var ntwkLnoGrpSrno = "";
var reservePathSameNo = "";
var mgmtGrpCd = "";

/* 관리주체키 */
var mgmtOnrNm = "";

var initParam = null;

/**
 * 주선번 상위 EAST, 하위 WEST 체크
 */
var rtnNeFlag = true;

var networkPathParam = null;

/* tsdn기간망회선정보 */
var tsdnRontLineNo = null;
var sprTsdnRontLineNo = null;
var tmpTsdnRontLineNo = null;   // 임시 tsdn 기간망 회선번호
var tmpSprTsdnRontLineNo = null;  // 임시 tsdn 기간망 회선번호

/* 
 * 구 WDM트렁크 선번 수집여부 체크를 위하여
 * 선번이 없는경우도 기존 wdm형식인 것으로 판별함
 * 기간망 구분코드가 있는 경우 수정된 것으로 판별함
 * 교체작업한 경우도 수정한 것으로 판별함
 */
var modifyTsdnWdmTypeMainPath = false;
var modifyTsdnWdmTypeSprPath = false;

/* 주선번 편집여부 */
var modifyMainPath = false;

// TSDN주선번 정보를 다시 반영한 경우 
var reSetTsdnInfo = false;

//var chkExtractAcceptNtwkLine = ""; common.js에 선언되어 있음 // 수용네트워크목록 추출중 SAVE : 저장후호출, CHK_SAVE : [저장을 완료하였습니다/에러메세지] 표시한 후 

/** 기간망구간분류코드 */
var rontSctnClCdArr = [ 
         	          { RONT_SCTN_CL_NM : "종단Client_S", RONT_SCTN_CL_CD : "001" }
             		, { RONT_SCTN_CL_NM : "SPLITTER_S", RONT_SCTN_CL_CD : "014" }
         			, { RONT_SCTN_CL_NM : "전송Client_S", RONT_SCTN_CL_CD : "002" }
         			, { RONT_SCTN_CL_NM : "시스템IO연동_S_1", RONT_SCTN_CL_CD : "003"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_S_2", RONT_SCTN_CL_CD : "004"}
         			, { RONT_SCTN_CL_NM : "Link 정보_S", RONT_SCTN_CL_CD : "005"}
         			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_S", RONT_SCTN_CL_CD : "006"}
         			, { RONT_SCTN_CL_NM : "중계", RONT_SCTN_CL_CD : "013"}
         			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_E", RONT_SCTN_CL_CD : "007"}
         			, { RONT_SCTN_CL_NM : "Link 정보_E", RONT_SCTN_CL_CD : "008"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_E_1", RONT_SCTN_CL_CD : "009"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_E_2", RONT_SCTN_CL_CD : "010"}
         			, { RONT_SCTN_CL_NM : "전송Client_E", RONT_SCTN_CL_CD : "011"}
           			, { RONT_SCTN_CL_NM : "SPLITTER_E", RONT_SCTN_CL_CD : "015" }
         			, { RONT_SCTN_CL_NM : "종단Client_E", RONT_SCTN_CL_CD : "012"}
         	];

/*var rontSctnLinkClCdArr = [
          			  { RONT_SCTN_CL_NM : "Link 정보_S", RONT_SCTN_CL_CD : "005"}
          			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_S", RONT_SCTN_CL_CD : "006"}
          			, { RONT_SCTN_CL_NM : "중계", RONT_SCTN_CL_CD : "013"}
          			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_E", RONT_SCTN_CL_CD : "007"}
          			, { RONT_SCTN_CL_NM : "Link 정보_E", RONT_SCTN_CL_CD : "008"}
          	];*/

var leftOrgNm = "";
var rightOrgNm = "";


leftOrgNm = "LEFT_ORG_NM";
rightOrgNm = "RIGHT_ORG_NM";

// 링크구간은 수정을 못하게? - 확인되면 수정 
$a.page(function() {
	this.init = function(id, param) {
		param.gridId = "dataGridWork";
		gridId = param.gridId;
		ntwkLineNo = param.ntwkLineNo;
		
		// ADAMS 연동 고도화
		mgmtGrpCd = param.mgmtGrpCd;
		//topoSclCd = param.topoSclCd;
		svlnLclCd = param.svlnLclCd;
		mgmtOnrNm = param.mgmtOnrNm;

		if (nullToEmpty(param.topoLclCd) != "003" || nullToEmpty(param.topoSclCd) != "101") {
			//param.topoLclCd = '003';
			//param.topoSclCd = '101';
			alertBox('W', cflineMsgArray['misContact']);		/* 잘못된 접근입니다. */
			$("#btnSave").hide();					// 저장
			$("#btnAutoClctPath").hide();			// 수집선번
			$("#btnChangeToPath").hide();		    // 선번교체
			$("#btnAddToPath").hide();		    	// 선번추가
			$("#btnPathDelete").hide();		    	// 선번삭제
			$("#btnExportExcel").hide();		    // 엑셀다운로드
			return;
		}
		
		initGridNetworkPath(gridId, detailGridId);  // 주선번
		initGridNetworkPath(gridId, reserveGridId);  // 예비선번
		
		//구 wdm 트렁크 선번
		oldWdmTrunkPathInitGrid(gridId, "old_"+detailGridId);  // 주선번
		oldWdmTrunkPathInitGrid(gridId, "old_"+reserveGridId);  // 예비선번
		
		// 선번비교 탭		
		initGridNetworkPath("TMP", tmpGridList[0].grid_new);  // 주선번
		initGridNetworkPath("TMP_C", tmpGridList[0].grid_clct);  // 수집주선번
		oldWdmTrunkPathInitGrid("TMP",tmpGridList[0].grid_old); // Wdm트렁크 기존 선번 형태
		initGridNetworkPath("TMP", tmpGridList[1].grid_new);  // 예비선번
		initGridNetworkPath("TMP_C", tmpGridList[1].grid_clct);  // 수집예비선번
		oldWdmTrunkPathInitGrid("TMP",tmpGridList[1].grid_old); // Wdm트렁크 기존 예비선번 형태
		
		initGridNetworkInfo();
		
		setEventListener();
		setButtonDisplay("dataGridWork");
		// 관할전송실 편집모드
		tmofInfoPop({ntwkLineNo : ntwkLineNo, sFlag : "Y"}, "Y");
		//tmofInfoPop(param, param.sFlag);
		
		$("#rontAllView").setChecked(true);
		$("#btnAutoClctPath").hide();			// 수집선번
		$("#btnChangeToPath").hide();		    // 선번교체
		$("#btnAddToPath").hide();		    	// 선번추가

		cflineShowProgressBody();
		
		// 서비스유형
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01081', null, 'GET', 'rontTrkType');
		
		// 기간망 트렁크 정보
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunkinfo', param, 'GET', 'getRontTrunkInfo');
		
		param.editViewYn = 'Y';
		
		initParam = param;

		// wdm트렁크 정보
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/getwdmtrunkinfo', param, 'GET', 'getWdmTrunkInfo');
		
    };

    // 그리드 더블클릭 이벤트
    function gridDblClickEvent(setGridId, dataObj, editYn) {
    	editYn = true;
    	if(nullToEmpty(dataObj.data.WDM_TRUNK_ID) != ""){
			if(dataObj.mapping.key == "WDM_TRUNK_NM") {
				openNetworkPathPop(false, dataObj.data.WDM_TRUNK_ID, true, dataObj.data.USE_NETWORK_PATH_DIRECTION);
    		}
		}
		else if(editYn){
			if(dataObj.mapping.key == "LEFT_NE_NM" && (currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId)) {
    			openEqpListPop("LEFT");
    		}
    		else if(dataObj.mapping.key == "LEFT_PORT_DESCR" && (currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId)) {
    			openPortListPop("LEFT");
    		}
    		else if(dataObj.mapping.key == "RIGHT_NE_NM") {
    			openEqpListPop("RIGHT");
    		}
    		else if(dataObj.mapping.key == "RIGHT_PORT_DESCR") {
    			openPortListPop("RIGHT");
    		}
		}
    }
    
    function setEventListener() {
    	// 주선번 더블클릭 이벤트
    	$('#'+detailGridId + ', #'+reserveGridId + ', #old_'+detailGridId + ', #old_'+reserveGridId + ', #'+tmpGridList[0].grid_clct + ', #'+tmpGridList[1].grid_clct).on('dblclick', '.bodycell', function(e){    		
    		var dataObj = AlopexGrid.parseEvent(e);
    		var schVal = dataObj.data._state.editing[(dataObj.data._column)];
    		
    		var gridId = AlopexGrid.parseEvent(e).$grid.attr('id');
    		
    		var editYn = $('#'+gridId).alopexGrid("readOption").cellInlineEdit;
    		
    		// 그리드 더블클릭 이벤트
    		gridDblClickEvent(gridId, dataObj, editYn);
    	});
    	
    	var bfRowIndex = -1;
    	$('#old_'+detailGridId).on('rowDragDrop', function(e){
    		var evObj = AlopexGrid.parseEvent(e);
    		var dragData = evObj.dragDataList[0];
    		// 이동전 행 번호 취득
    		bfRowIndex = dragData._index.row;
    	});
    	
    	$('#old_'+detailGridId).on('rowDragDropEnd', function(e){
    		var evObj = AlopexGrid.parseEvent(e);
    		var dragData = evObj.dragDataList[0];
    		
    		// 이동후 행 번호 취득
    		var tmpRowIndex = dragData._index.row;
    		
    		// 이전 행번호와 다른경우 수정된것으로 인지
    		if (bfRowIndex != tmpRowIndex) {
    			modifyMainPath = true;
    			bfRowIndex = -1;
    		}
    	});
    	
    	$('#btnClose').on('click', function(e){
    		$a.close();
	    });
    	
		$('#rontAllView').on('click', function(e){
			// 구간 숨기기 필터적용
    		setFilterInGrid();
		});
		
		// 편집
		$('#btnRegEqp').on('click', function(e){
			setButtonDisplay("dataGridWork");
			
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
    		if(dataList == null || dataList.length == 0){
    			addPathSet(detailGridId);
    		} else {
    			setRontPathData(dataList, false, detailGridId);
    		}
    		
    		var reserveDataList = $('#'+reserveGridId).alopexGrid("dataGet");
    		if(reserveDataList == null || reserveDataList.length == 0){
    			addPathSet(reserveGridId);
    		} else {
    			setRontPathData(reserveDataList, false, reserveGridId);
    		}
    		
    		// 구간 숨기기 필터적용
    		setFilterInGrid();
    		$('#'+currentGridId).alopexGrid("viewUpdate");
    	});
    	
		// 저장
		$('#btnSave').on('click', function(e){
    		//savePath();
			checkAutoProcStat();   // 주선번 수정건인 경우 현재 미처리한 자동수정처리건이 있는지 체크
    	});
		
		// 선번 삭제
    	$('#btnPathDelete').on('click', function(e){
    		//deletePath();
    		// 선번 삭제 버튼을 선번셋 전체삭제 기능으로 사용
    		deletePathSet();
    	});
    	
    	$('#btnAutoClctPath').on('click', function(e){
    		openAutoClctPathListPop();
    	});
    	
    	// 선번 SET 추가
    	$('#btnPathSetAdd').on('click', function(e){
    		addPathSet(currentGridId);
    	});
    	
		// 예비선번으로 변경
		$('#btnReservePathChange').on('click', function(e){
			
			if (modifyTsdnWdmTypeMainPath == true || modifyTsdnWdmTypeSprPath == true) {
				var msg = (modifyTsdnWdmTypeMainPath == true ? cflineMsgArray['weekLno']/* 주선번 */ : cflineMsgArray['spareLineNo']/* 예비선번 */) + cflineMsgArray['possibleChangeExistingWDMLno'];	/* 이 TSDN WDM 트렁크 형태입니다. 기존 WDM 형태의 선번만 교체작업이 가능합니다. */
				alertBox('W', msg);
				return;
			}

			// 주선번
			$('#old_'+detailGridId).alopexGrid("endEdit");
			var networkPathList = AlopexGrid.trimData($('#old_'+detailGridId).alopexGrid('dataGet'));
			$("#old_"+detailGridId).alopexGrid("startEdit");
			
			// 예비선번
			$('#old_'+reserveGridId).alopexGrid("endEdit");
			var reservePathList = AlopexGrid.trimData($('#old_'+reserveGridId).alopexGrid('dataGet'));
			$('#old_'+reserveGridId).alopexGrid("startEdit");
			
			if ((networkPathList.lenght == 0 && reservePathList.length == 0)
				|| (checkOldTypeData(networkPathList) == false && checkOldTypeData(reservePathList) == false)) {
				alertBox('W', cflineMsgArray['noChangeLnoInfo']);		/* 교체할 선번정보가 없습니다. */
				return;
			}
			
			$('#old_'+detailGridId).alopexGrid('dataSet', reservePathList);
			$('#old_'+reserveGridId).alopexGrid('dataSet', networkPathList);
			
			$("#old_"+detailGridId).alopexGrid("startEdit");
			$("#old_"+reserveGridId).alopexGrid("startEdit");
			
			// 구간 숨기기 필터적용
    		//setFilterInGrid();
    		
    		// 주선번 예비선번 교체시
    		/*var tmpNo = tmpTsdnRontLineNo ;
    		tmpTsdnRontLineNo = tmpSprTsdnRontLineNo;
    		tmpSprTsdnRontLineNo = tmpNo;*/
    		modifyMainPath = true;
		});		

		// 선번교체
		$('#btnChangeToPath').on('click', function(e){

   			var pathLineType = $('#pathLineType').val();
			var fromGridId = tmpGridList[0].grid_clct;   // 주선번 선택선번
			var toGridId = detailGridId;   // 주선번
			var fromGridIdForSpr = tmpGridList[1].grid_clct;  // 예비선번 선택선번 
			var toGridIdForSpr = reserveGridId; // 예비선번
			var resultMsg = cflineMsgArray['normallyProcessed'] + "<br>" + (pathLineType == 'M' ? cflineMsgArray['moveWeekLnoTab']/* 주선번탭으로 이동 하시겠습니까?*/ : cflineMsgArray['moveSpareLnoTab']/* 예비선번 탭으로 이동 하시겠습니까? */);
			var tabIndex = 0;
			
			/*if (pathLineType == 'S') {    // 예비선번인 경우
				fromGridId = tmpGridList[1].grid_clct; 
				toGridId = reserveGridId;
				tabIndex = 1;
			} */
			
			$("#"+fromGridId).alopexGrid("endEdit");
			var fromPathList = AlopexGrid.trimData($('#'+fromGridId).alopexGrid('dataGet'));
			$("#"+fromGridId).alopexGrid("startEdit");			

			$("#"+fromGridIdForSpr).alopexGrid("endEdit");
			var fromPathListForSpr = AlopexGrid.trimData($('#'+fromGridIdForSpr).alopexGrid('dataGet'));
			$("#"+fromGridIdForSpr).alopexGrid("startEdit");
			
			if (fromPathList.length == 0) {
				alertBox('W', cflineMsgArray['selectNoData']);
				return;
			}
			

			// 선번교체시 기존에 설정되어 있는지 체크 및 tsdn번호 설정
			var selTsdnRontLineNo = "";
			var selSprTsdnRontLineNo = "";
			
			var tmpMsg = cflineMsgArray['changeWeekLnoSpareLnoSameTime'];		/* 주선번이 교체됨과 동시에 예비선번도 교체됩니다. */
			/*if (fromPathListForSpr.length == 0) {
				tmpMsg = "<br> 선택하신 주선번의 예비선번 정보가 존재 하지 않아 기존 WDM트렁크의 예비선번도 지워집니다. ";
			}*/
			
			// 알림
			callMsgBox('','I', tmpMsg, function(msgId, msgRst){
	       		if (msgRst == 'Y') {
	    			
	    			
	    			// 주선번
	    			for (var i = 0 ; i < fromPathList.length; i++) {
	    				if (nullToEmpty(fromPathList[i].TSDN_RONT_LINE_NO) != "") {
	    					selTsdnRontLineNo = fromPathList[i].TSDN_RONT_LINE_NO;
	    					break;
	    				}
	    			}	
	    			
	    			// 예비선번
	    			for (var i = 0 ; i < fromPathListForSpr.length; i++) {
	    				if (nullToEmpty(fromPathListForSpr[i].TSDN_RONT_LINE_NO) != "") {
	    					selSprTsdnRontLineNo = fromPathListForSpr[i].TSDN_RONT_LINE_NO;
	    					break;
	    				}
	    			}
	    				
	    			//console.log(selSprTsdnRontLineNo);
	    			/*if (pathLineType == 'M') {  // 주선번인경우
	    				if (nullToEmpty(tmpSprTsdnRontLineNo) == nullToEmpty(selTsdnRontLineNo)) {
	    					alertBox('W', "이미 예비선번에 설정된 TSDN WDM 수집 정보입니다.");
	    					return;
	    				}
	    				tmpTsdnRontLineNo = selTsdnRontLineNo;	
	    				if (modifyTsdnWdmTypeMainPath == false) {
	    					$("#old_"+toGridId).hide();
	    					$("#"+toGridId).show();
	    					modifyTsdnWdmTypeMainPath = true;
	    				}
	    				modifyMainPath = true;
	    				reSetTsdnInfo = true;
	    				
	    			} else {  // 예비선번인경우
	    				if (nullToEmpty(tmpTsdnRontLineNo) == nullToEmpty(selTsdnRontLineNo)) {
	    					alertBox('W', "이미 주선번에 설정된 TSDN WDM 수집 정보입니다.");
	    					return;
	    				}
	    				tmpSprTsdnRontLineNo = selTsdnRontLineNo;
	    				if (modifyTsdnWdmTypeSprPath == false) {
	    					$("#old_"+toGridId).hide();
	    					$("#"+toGridId).show();
	    					modifyTsdnWdmTypeSprPath = true;
	    				}

	    				reSetTsdnInfo = true;
	    			}*/	
	    			
	    			// 주선번 설정
	    			tmpTsdnRontLineNo = selTsdnRontLineNo;	
	    			if (modifyTsdnWdmTypeMainPath == false) {
	    				$("#old_"+toGridId).hide();
	    				$("#"+toGridId).show();
	    				modifyTsdnWdmTypeMainPath = true;
	    				$("#old_"+toGridId).alopexGrid('dataEmpty');
		    			$("#old_"+toGridId).alopexGrid("viewUpdate");
	    			}
	    			$('#'+toGridId).alopexGrid('dataSet', fromPathList);
	    			$("#"+toGridId).alopexGrid("viewUpdate");
	    			$("#"+toGridId).alopexGrid("startEdit");
	    			modifyMainPath = true;
	    			reSetTsdnInfo = true;
	    			
	    			// 예비선번 설정

	    			tmpSprTsdnRontLineNo = selSprTsdnRontLineNo;	
	    			if (modifyTsdnWdmTypeSprPath == false) {
	    				$("#old_"+toGridIdForSpr).hide();
	    				$("#"+toGridIdForSpr).show();
	    				modifyTsdnWdmTypeSprPath = true;
	    				$("#old_"+toGridIdForSpr).alopexGrid('dataEmpty');
		    			$("#old_"+toGridIdForSpr).alopexGrid("viewUpdate");
	    			}
	    			
	    			if (fromPathListForSpr.length > 0) {
	    				$('#'+toGridIdForSpr).alopexGrid('dataSet', fromPathListForSpr);
		    			$("#"+toGridIdForSpr).alopexGrid("viewUpdate");
	    				$("#"+toGridIdForSpr).alopexGrid("startEdit");
	    			}
	    						
	    			// 구간 숨기기 필터적용
	        		setFilterInGrid();
	        		
	        		// 그리드에 이벤트 걸어주기
	        		setEqpEventListener(toGridId);
	        		setEqpEventListener(toGridIdForSpr);
	        		
	        		callMsgBox('', 'C', resultMsg, function(msgId, msgRst){ 
	         			if (msgRst == 'Y') {
	         				$('#basicTabsPop').setTabIndex(tabIndex);
	        			}
	        		});
	       		}
			});
		});
		
    	
    	// 탭 선택 이벤트
   	 	$("#basicTabsPop").on("tabchange", function(e, index) {
   	 		if(index == 0) {
   	 			$("#btnAutoClctPath").hide();   		// 수집선번
   	 			if (modifyTsdnWdmTypeMainPath == true) {
   	 				$("#btnReservePathChange").hide();      // 예비선번으로 교체
   	 			} else {
	   	 			if(mgmtGrpCd != "0002") {  // ADAMS - SKB회선 제외
	   	 				$("#btnReservePathChange").show();      // 예비선번으로 교체
	   	 			}
   	 			}
   	 			
   	 			$("#btnChangeToPath").hide();		    // 선번교체
   	 			//$("#btnAddToPath").hide();		    	// 선번추가
   	 			//$("#btnPathSetAdd").show();				// 선번셋추가
   	 			$("#btnPathDelete").show();		    	// 선번삭제
   	 			$("#btnSave").show();					// 저장
   	 			$("#btnExportExcel").show();			// 엑셀
   	 			$("#btnClose").show();					// 닫기
   	 			if (modifyTsdnWdmTypeMainPath == true) {
   	   	 			currentGridId = detailGridId;
   	 			} else {
   	   	 			currentGridId = "old_"+detailGridId;
   	 			}
   	 			$('#'+currentGridId).alopexGrid("viewUpdate");
   	 		} else if(index == 1) {
   	 			$("#btnAutoClctPath").hide();   		// 수집선번
   	 			$("#btnReservePathChange").hide();      // 예비선번으로 교체
   	 			$("#btnChangeToPath").hide();		    // 선번교체
   	 			//$("#btnAddToPath").hide();		    	// 선번추가
   	 			//$("#btnPathSetAdd").show();				// 선번셋추가
   	 			$("#btnPathDelete").show();		    	// 선번삭제
   	 			$("#btnSave").hide();					// 저장
   	 			$("#btnExportExcel").show();			// 엑셀
   	 			$("#btnClose").hide();					// 닫기

   	 			if (modifyTsdnWdmTypeSprPath == true) {
   	   	 			currentGridId = reserveGridId;
   	 			} else {
   	   	 			currentGridId = "old_"+reserveGridId;
   	 			}
   	 			$('#'+currentGridId).alopexGrid("viewUpdate");
   	 		} else if(index == 2) {
   	 			$("#btnReservePathChange").hide();      // 예비선번으로 교체
   	 			//$("#btnAddToPath").show();		    	// 선번추가
   	 			//$("#btnPathSetAdd").hide();				// 선번셋추가
   	 			$("#btnPathDelete").hide();		    	// 선번삭제
   	 			$("#btnSave").hide();					// 저장
   	 			$("#btnExportExcel").hide();			// 엑셀
   	 			$("#btnClose").hide();					// 닫기
   	 			$('.TMP').alopexGrid("viewUpdate");
   	 			
   	 			currentGridId = ($('#pathLineType').val() == 'M' ? tmpGridList[0].grid_clct : tmpGridList[1].grid_clct);
   	 			
	   	 		if ($("#pathLineType").val() == 'M') {
	   	 			if(mgmtGrpCd != "0002") { // ADAMS - SKB회선 제외
	   	 				$('#btnAutoClctPath').show();  // 수집선번
	    				$('#btnChangeToPath').show();  // 수집선번
	   	 			}
	   	 		} else {
	    			$('#btnAutoClctPath').hide();  // 수집선번
	    			$('#btnChangeToPath').hide();  // 수집선번
	   	 		}
   	 			
   	 			setBtnCopyFdfInfo();
   	 		}
   	 	});
    	
    	// 엑셀 다운로드
    	$('#btnExportExcel').on('click', function(e){
    		var tabIdx = $("#basicTabsPop").getCurrentTabIndex();
    		
    		var fileName = cflineMsgArray['wdmTrunk']; /* WDM트렁크*/
    		fileName += (tabIdx == 0 ?  cflineMsgArray['week']/* 주 */ : cflineMsgArray['spare']/* 예비 */) + cflineMsgArray['lno']; /* 선번 */
    		fileName += cflineMsgArray['information']; /* 정보 */
    		fileName += "_" + getCurrDate(); /* date */
    		
    		//$('#'+detailGridId).alopexGrid('hideCol', 'IS_SELECT');

    		var excelGrid = detailGridId;
    		
    		if (tabIdx == 0) {
    			if (modifyTsdnWdmTypeMainPath == false) {
    				excelGrid = "old_" + detailGridId;
    			}
    		} else {
    			if (modifyTsdnWdmTypeSprPath == false) {
    				excelGrid = "old_" + reserveGridId;
    			} else {
    				excelGrid = reserveGridId;
    			}
    		}
    			
    		
    		var worker = new ExcelWorker({
         		excelFileName : fileName, 
         		palette : [{
         			className : 'B_YELLOW',
         			backgroundColor: '#EEEEF8'
         		},{
         			className : 'F_RED',
         			color: '#EEEEF8'
         		}],
         		sheetList: [{
         			sheetName: (tabIdx == 0 ?  cflineMsgArray['week']/* 주 */ : cflineMsgArray['spare']/* 예비 */) + cflineMsgArray['lno'] + cflineMsgArray['information'],
         			placement: 'vertical',
         			$grid: [$('#'+baseGridId), $('#'+excelGrid)]
         		}]
         	});
    		
    		worker.export({
         		merge: false,
         		exportHidden: false,
         		selected: false,
         		useGridColumnWidth : true,
         		border : true,
         		useCSSParser : true
         	});
    		
    		//$('#'+detailGridId).alopexGrid('showCol', 'IS_SELECT');
    	});
    	
    	$('#pathLineType').on('change', function(e){
    		var hideArea = ($(this).val() == 'M' ? 'S' : 'M');
    		$('#' + $(this).val() + '_Path').show();
    		$('#' + hideArea + '_Path').hide();
    		
    		currentGridId = ($(this).val() == 'M' ? tmpGridList[0].grid_clct : tmpGridList[1].grid_clct);
    		
    		setBtnCopyFdfInfo();
    		
    		// 주선번인 경우만 수집선번, 선번교체 버튼 보이도록 처리
    		if ($(this).val() == 'M') {
    			if(mgmtGrpCd != "0002") {  // ADAMS - SKB회선 제외
    				$('#btnAutoClctPath').show();  // 수집선번
    				$('#btnChangeToPath').show();  // 수집선번
    			}
    			
    			$('#'+tmpGridList[0].grid_new).alopexGrid("viewUpdate");
    			$('#'+tmpGridList[0].grid_old).alopexGrid("viewUpdate");
    			$('#'+tmpGridList[0].grid_clct).alopexGrid("viewUpdate");
    		} else {
    			$('#btnAutoClctPath').hide();  // 수집선번
    			$('#btnChangeToPath').hide();  // 수집선번
    			$('#'+tmpGridList[1].grid_new).alopexGrid("viewUpdate");
    			$('#'+tmpGridList[1].grid_old).alopexGrid("viewUpdate");
    			$('#'+tmpGridList[1].grid_clct).alopexGrid("viewUpdate");
    		}

    		$('#'+currentGridId).alopexGrid("viewUpdate");
    	});
    	
    	// 기존 FDF 정보 복사이벤트
    	//$('#btnCopyFdfInfo, #btnCopyFdfInfoSpr').on('click', function(e){
    	$('#btnCopyFdfInfo').on('click', function(e){
    		var result = copyFdfInfo($('#pathLineType').val());
    		// 주선번인 경우
    		if ($('#pathLineType').val() == "M" && result == true) {
    			// 예비선번도 작업함
    			copyFdfInfo("S");
    		}
    	});
    	
    }
});

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, //URL 기존 처럼 사용하시면 됩니다.
		data : Param, //data가 존재할 경우 주입
		method : Method, //HTTP Method
		flag : Flag
	}).done(successCallback)
	.fail(failCallback);
}

function successCallback(response, status, jqxhr, flag){
	if(flag == 'rontTrkType'){
		rontTrkTypCdArr = response;		
	}
	else if(flag == 'getWdmTrunkInfo') {
		if(response != null ){
			$("#popNtwkLineNm").val(response.ntwkLineNm);	// 트렁크명
			$("#popNtwkLineNo").val(response.ntwkLineNo); // 네트워크 회선번호
			$("#popTopoSclNm").val(response.topoSclNm); 	    // 망종류
			$("#popNtwkCapaNm").val(response.ntwkCapaNm); 	    // 용량
			
			tsdnRontLineNo = response.tsdnRontLineNo;  // tsdn기간망회선번호
			tmpTsdnRontLineNo = response.tsdnRontLineNo;  // 임시tsdn기간망회선번호(변경됬는지 여부를 확인하기 위해서)
			sprTsdnRontLineNo = response.sprTsdnRontLineNo;  // 예비tsdn기간망회선번호
			tmpSprTsdnRontLineNo = response.sprTsdnRontLineNo;  // tsdn기간망회선번호(변경됬는지 여부를 확인하기 위해서)
			
			baseInfData = response;
			
			// 선번 조회 : param - 네트워크회선번호, 구간선번그룹코드, 주.예비구분, 자동수집여부
			networkPathParam = {"ntwkLineNo" : ntwkLineNo, "utrdMgmtNo" : initParam.utrdMgmtNo, "exceptFdfNe" : "N", "topoLclCd" : response.topoLclCd, "topoSclCd" : response.topoSclCd, "wkSprDivCd" : "01", "autoClctYn": "N"};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkPathSearch');
			
			// 예비선번 조회
			$.extend(networkPathParam,{"wkSprDivCd": "02"});
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkReservePathSearch');
					
			/**
			 * WDM트렁크 등록시 장비설정하지 않도록 하여 해당 api(selectAutoClctPath) 호출은 주석처리했음
			 * /
			
			// 선번정보가 없고 대표 장비가 설정된 경우 wdm등록시 설정한 장비정보가 있고 
			/*if (nullToEmpty(response.ntwkLnoGrpSrno) == "-2" && (nullToEmpty(response.wdmEqpNm) !="" || nullToEmpty(response.wdmPortNm) != "")) {
			
				// 그정보를 바탕으로 검색한 수집선번이 1건인 경우 해당정보를 갖어와 자동 설정
				if (response.wdmAutoClctCnt == 1) {
					// 1건 기간망 조회하여 선번정보 취득
					response.searchSystem = true;
					response.firstRowIndex = 1;
					response.lastRowIndex = 20;
					cflineShowProgressBody();
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectautoclctpath', response, 'GET', 'selectAutoClctPath');
				}
				// 그정보를 바탕으로 검색한 수집선번이 여러건(혹은 0건)인 경우 수집선번 팝업 열기
				else {
					// 선번비교 탭으로 이동
					$('#basicTabsPop').setTabIndex(2);
					// 팝업 열기
					openAutoClctPathListPop(response);
				}
			}*/
		}
	}
	else if(flag == 'networkPathSearch'){ 				//주선번조회
		cflineHideProgressBody();
		var links;
		
		if(gridId == "dataGridWork"){
			
			if(response.data != undefined && response.data.LINKS != undefined ) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					setRontPathData(links, false, detailGridId);
				}			
			}
			else {
				//addPathSet(detailGridId);
				// 기존 wdm트렁크가 기본
				modifyTsdnWdmTypeMainPath = false;
				$('#'+detailGridId).hide();
				$('#old_'+detailGridId).show();
				$('#old_'+detailGridId).alopexGrid("startEdit");
							
				addRowNullData("old_"+detailGridId);
				setEqpEventListener("old_"+detailGridId);
				
				currentGridId = "old_" + detailGridId;
				
				// 선번비교탭
				$('#'+ tmpGridList[0].grid_new).hide();
				$('#'+ tmpGridList[0].grid_old).show();
			}
		}
		else {
			if(response.data != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					if (checkRontTypeYn(links, detailGridId) == true) {	
						// 주선번
						$('#'+detailGridId).alopexGrid('dataSet', links);
						var tmpLinks = AlopexGrid.trimData($('#'+detailGridId).alopexGrid('dataGet'));
																
						// 선번비교
						$('#'+tmpGridList[0].grid_new).alopexGrid('dataSet', tmpLinks);	
						
						// 주선번 수정됨
						modifyTsdnWdmTypeMainPath = true;
					} else {
						// 주선번
						$('#old_'+detailGridId).alopexGrid('dataSet', links);
						var tmpLinks = AlopexGrid.trimData($('#old_'+detailGridId).alopexGrid('dataGet'));
						// 선번비교
						$('#'+tmpGridList[0].grid_old).alopexGrid('dataSet', tmpLinks);
						
						// 선번이 기존 WDM 트렁크 형태이기 때문에 기존 WDM트렁크 형태로 표시
						$('#'+detailGridId).hide();
						$('#old_'+detailGridId).show();
						$('#old_'+detailGridId).alopexGrid("startEdit");
						addRowNullData("old_"+detailGridId);
						setEqpEventListener("old_"+detailGridId);						
						
						currentGridId = "old_" + detailGridId;
						
						// 선번비교탭
						$('#'+ tmpGridList[0].grid_new).hide();
						$('#'+ tmpGridList[0].grid_old).show();
						
					}
					// 구간 숨기기 필터적용
		    		setFilterInGrid();
				}			
			} else {
				$("#rontAllView").setChecked(false);
				// 주선번 수정됨
				modifyTsdnWdmTypeMainPath = false;
				
				$('#'+detailGridId).hide();
				$('#old_'+detailGridId).show();
				$('#old_'+detailGridId).alopexGrid("startEdit");
				addRowNullData("old_"+detailGridId);
				setEqpEventListener("old_"+detailGridId);
				
				currentGridId = "old_" + detailGridId;
				
				// 선번비교탭
				$('#'+ tmpGridList[0].grid_new).hide();
				$('#'+ tmpGridList[0].grid_old).show();
			}	
		}
		
		ntwkLnoGrpSrno = (links == null)? "1" : response.data.PATH_SAME_NO;
		
		// 엑셀 다운로드를 위한 기본정보 저장
		$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
		$('#'+baseGridId).alopexGrid("viewUpdate");
		$('#'+detailGridId).alopexGrid("viewUpdate");
		$('#old_'+detailGridId).alopexGrid("viewUpdate");
		
		if (modifyTsdnWdmTypeMainPath == true) {
			$("#btnReservePathChange").hide();      // 예비선번으로 교체
		} else {
			if(mgmtGrpCd != "0002") {  // ADAMS - SKB회선 제외
				$("#btnReservePathChange").show();      // 예비선번으로 교체
			}
		}
	
	}else if(flag == "networkReservePathSearch"){ 				//예비선번조회
		var links;
		if(gridId == "dataGridWork"){
			if(response.data != undefined && response.data.LINKS != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					setRontPathData(links, false, reserveGridId);
				}			
			} 
			else {
				//addPathSet(reserveGridId);
				// 기존 wdm트렁크 형태가 기본
				modifyTsdnWdmTypeSprPath = false;

				$('#'+reserveGridId).hide();
				$('#old_'+reserveGridId).show();
				$('#old_'+reserveGridId).alopexGrid("startEdit");
				addRowNullData("old_"+reserveGridId);
				setEqpEventListener("old_"+reserveGridId);
								
				// 선번비교탭
				$('#'+ tmpGridList[1].grid_new).hide();
				$('#'+ tmpGridList[1].grid_old).show();
			}
			
		}
		else {
			if(response.data != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					if (checkRontTypeYn(links, reserveGridId) == true) {	
						// 예비선번
						$('#'+reserveGridId).alopexGrid('dataSet', links);
						var tmpLinks = AlopexGrid.trimData($('#'+reserveGridId).alopexGrid('dataGet'));
					
						// 선번비교
						$('#'+tmpGridList[1].grid_new).alopexGrid('dataSet', tmpLinks);	
						
						// 예비선번 수정됨		
						modifyTsdnWdmTypeSprPath = true;
					} else {
						// 예비선번
						$('#old_'+reserveGridId).alopexGrid('dataSet', links);
						var tmpLinks = AlopexGrid.trimData($('#old_'+reserveGridId).alopexGrid('dataGet'));
						
						// 선번비교
						$('#'+tmpGridList[1].grid_old).alopexGrid('dataSet', tmpLinks);

						// 선번이 기존 WDM 트렁크 형태이기 때문에 기존 WDM트렁크 형태로 표시
						$('#'+reserveGridId).hide();
						$('#old_'+reserveGridId).show();
						$('#old_'+reserveGridId).alopexGrid('startEdit');
						addRowNullData("old_"+reserveGridId);
						setEqpEventListener("old_"+reserveGridId);
						
						// 선번비교탭
						$('#'+ tmpGridList[1].grid_new).hide();
						$('#'+ tmpGridList[1].grid_old).show();
					}
					// 구간 숨기기 필터적용
		    		setFilterInGrid();
				}			
			} else {
				// 예비선번 기존 WDM 형식
				modifyTsdnWdmTypeSprPath = false;		
				
				$('#'+reserveGridId).hide();
				$('#old_'+reserveGridId).show();
				$('#old_'+reserveGridId).alopexGrid("startEdit");
				addRowNullData("old_"+reserveGridId);
				setEqpEventListener("old_"+reserveGridId);
				
				// 선번비교탭
				$('#'+ tmpGridList[1].grid_new).hide();
				$('#'+ tmpGridList[1].grid_old).show();
			}
		}
		
		reservePathSameNo = (links == null)? null : response.data.PATH_SAME_NO;
		
		$('#'+reserveGridId).alopexGrid("viewUpdate");
		$('#old_'+reserveGridId).alopexGrid("viewUpdate");
		
		// 예비선번은 주선번 기준으로 TSDN형식이든 기존 WDM트렁크 형식이든 보여주어야 함
		if (nullToEmpty(tsdnRontLineNo) != "" && modifyTsdnWdmTypeSprPath == false) {
			// 예비선번을 TSDN 형식으로 변경
			modifyTsdnWdmTypeSprPath = true;
			
			$('#old_'+reserveGridId).hide();
			$('#'+reserveGridId).show();
			$('#'+reserveGridId).alopexGrid('startEdit');
			
			// 선번비교탭
			$('#'+ tmpGridList[1].grid_new).show();
			$('#'+ tmpGridList[1].grid_old).hide();
			
		}
	}else if(flag == "saveNetworkPath"){
		if(response.PATH_RESULT) {
			saveReservePath();
		}else{
			cflineHideProgressBody();
			alertBox('W', response.PATH_ERROR_MSG);
			if (modifyTsdnWdmTypeMainPath == true) {
				$("#"+detailGridId).alopexGrid("startEdit");
			} else {
				$("#old_"+detailGridId).alopexGrid("startEdit");
			}
		}
	}
	else if(flag == "saveReserveNetworkPath") {
		if(response.PATH_RESULT) {
			chkExtractAcceptNtwkLine = "";
			// 주선번 변경이 있었던 경우			
			if (modifyMainPath == true) {
   				chkExtractAcceptNtwkLine = "SAVE";
   				cflineShowProgressBody();
   				var acceptParam = {
   						 lineNoStr : ntwkLineNo
   					   , topoLclCd : (typeof topoLclCd != "undefined" ? initParam.topoLclCd: "")
   					   , linePathYn : "N"
   					   , editType : "E"
   					   , excelDataYn : "N"
   					   , callMsg : cflineMsgArray['saveSuccess']  // 저장에 성공한 경우
   				}
   				
   				extractAcceptNtwkLine(acceptParam);

   				modifyMainPath = false;
   			} 
						
			// 주선번 조회
			$.extend(networkPathParam,{"wkSprDivCd": "01"});
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkPathSearchSaveAfter');
			
			// 예비선번 조회
			$.extend(networkPathParam,{"wkSprDivCd": "02"});
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkPathSearchSaveAfterTwo');
			
			// 주선번이나 예비선번의 tsdn 번호가 변경된 경우/ 주선번에 TSDN정보를 반영한 경우
			if (nullToEmpty(tsdnRontLineNo) != nullToEmpty(tmpTsdnRontLineNo) || nullToEmpty(sprTsdnRontLineNo) != nullToEmpty(tmpSprTsdnRontLineNo) || reSetTsdnInfo == true) {
			// 주선번/예비선번이 TSDN WDM 트렁크 형태인 경우
			//if (modifyTsdnWdmTypeMainPath == true || modifyTsdnWdmTypeSprPath == true) {
				$.extend(networkPathParam,{"wkSprDivCd": "01"});
				$.extend(networkPathParam,{"tsdnRontLineNo": tmpTsdnRontLineNo});
				$.extend(networkPathParam,{"sprTsdnRontLineNo": tmpSprTsdnRontLineNo});
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/updatetsdnwdmid', networkPathParam, 'GET', 'updateTsdnWdmId');
			}
			else {			
				// 부모창 데이터 재조회
				if (nullToEmpty(opener) != "" && $('#btnResearch' , opener.document).val() != undefined) {
					$('#btnResearch' , opener.document).click();	// WdmTrunk 상세 재검색
				}
			}
		} 
		// 저장에 실패한 경우(주선번은 저장에 선공함)
		else {
			cflineHideProgressBody();
			//alertBox('W', response.PATH_ERROR_MSG);
			chkExtractAcceptNtwkLine = "";
   			/* 
   			 * WDM트렁크 주선번이 변경된경우(TSDN WDM 형태로 변경 / 기존 WDM 트렁크 선번이 삭제된 경우 / TSDN WDM 트렁크 형태의 데이터에 변경이 발생한 경우 / 기존 WDM트렁크 편집이 발생한 경우(modifyMainPath) 자동 수정할 수용회선 목록 수집
   			 */
   			if (modifyMainPath == true) {
   				chkExtractAcceptNtwkLine = "SAVE";
   				cflineShowProgressBody();
   				var acceptParam = {
   						 lineNoStr : ntwkLineNo
   					   , topoLclCd : (typeof topoLclCd != "undefined" ? initParam.topoLclCd: "")
   					   , linePathYn : "N"
   					   , editType : "E"
   					   , excelDataYn : "N"
   					   , callMsg : response.PATH_ERROR_MSG  // 에러인 경우 에러메세지를 넘김
   				}
   				
   				extractAcceptNtwkLine(acceptParam);

   				modifyMainPath = false;
   			} else {
   				// 주선번 수정이 없었던 경우라면 그냥 에러메세지만 표시
   				alertBox('W', response.PATH_ERROR_MSG);
   			}
			
			if (modifyTsdnWdmTypeSprPath == true) {
				$("#"+reserveGridId).alopexGrid("startEdit");
			} else {
				$("#old_"+reserveGridId).alopexGrid("startEdit");
			}

			// 주선번이 변경이 있었던 경우
			if (nullToEmpty(tsdnRontLineNo) != nullToEmpty(tmpTsdnRontLineNo) || reSetTsdnInfo == true) {
			// 주선번/예비선번이 TSDN WDM 트렁크 형태인 경우
			//if (modifyTsdnWdmTypeMainPath == true || modifyTsdnWdmTypeSprPath == true) {
				$.extend(networkPathParam,{"tsdnRontLineNo": tmpTsdnRontLineNo});
				$.extend(networkPathParam,{"sprTsdnRontLineNo": '-1'});
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/updatetsdnwdmid', networkPathParam, 'GET', 'updateTsdnWdmIdMain');
			} else {			
				// 부모창 데이터 재조회
				if (nullToEmpty(opener) != "" &&  $('#btnResearch' , opener.document).val() != undefined) {
					$('#btnResearch' , opener.document).click();	// WdmTrunk 상세 재검색
				}
			}
		}		
	}
	else if(flag == "rontEqpSctn"){
		/**
		 * FDF 장비구간데이터
		 * 1. 선택한 포트가 1건이고 조회된 구간이 1건일 경우 -> FDF set
		 * 2. 선택한 포트가 1건이고 조회된 구간이 2건일 경우 - 장비가 동일하면 FDF, Rx set
		 * 3. 선택한 포트가 2건이고 각각의 조회된 구간이 1건일 경우 -> FDF, Rx set
		 * 4. 그 외의 케이스는 자동입력 안함
		 */
		if(response != null && response.RIGHT_NE_ID != undefined){
			var focusData = $('#'+currentGridId).alopexGrid("dataGet", {_state : {focused : true}});
			var rowIndex = focusData[0]._index.row;
			
			$.each(response, function(key,val){
		 		$('#'+currentGridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, key);         		
		 	});
			
//			$('#'+detailGridId).alopexGrid('dataEdit', response, {_index : {data : rowIndex}});
		}
		cflineHideProgressBody();	
	}
	else if(flag == "networkPathSearchSaveAfter") {
		var links;
		if(response.data != undefined && response.data.LINKS != undefined) {
			links = response.data.LINKS;
			if(links != null && links.length > 0){
				setRontPathData(links, false, detailGridId, "Y");
			}			
		} else {
			//addPathSet(detailGridId);
			// 저장후 데이터가 없는 경우 선번비교탭 기존 선번 클리어
			if (modifyTsdnWdmTypeMainPath == true) {
				$('#'+tmpGridList[0].grid_new).alopexGrid('dataEmpty');

				$('#'+ tmpGridList[0].grid_new).show();
				$('#'+ tmpGridList[0].grid_old).hide();
			} else {
				$('#'+tmpGridList[0].grid_old).alopexGrid('dataEmpty');
				$('#'+ tmpGridList[0].grid_new).hide();
				$('#'+ tmpGridList[0].grid_old).show();
			}
		}
				
		ntwkLnoGrpSrno = (links == null)? "1" : response.data.PATH_SAME_NO;

		// 저장후 
		if (modifyTsdnWdmTypeMainPath == true) {
			$('#'+detailGridId).alopexGrid("viewUpdate");
		} else {
			$('#old_'+detailGridId).alopexGrid("viewUpdate");
		}		
	}
	else if(flag == "networkPathSearchSaveAfterTwo") {
		var links;
		if(response.data != undefined && response.data.LINKS != undefined) {
			links = response.data.LINKS;
			if(links != null && links.length > 0){
				setRontPathData(links, false, reserveGridId, "Y");
			}			
		} else {
			//addPathSet(reserveGridId);
			// 저장후 데이터가 없는 경우 선번비교탭 기존 선번 클리어
			if (modifyTsdnWdmTypeSprPath == true) {
				$('#'+tmpGridList[1].grid_new).alopexGrid('dataEmpty');
				$('#'+ tmpGridList[1].grid_new).show();
				$('#'+ tmpGridList[1].grid_old).hide();
			} else {
				$('#'+tmpGridList[1].grid_old).alopexGrid('dataEmpty');
				$('#'+ tmpGridList[1].grid_new).hide();
				$('#'+ tmpGridList[1].grid_old).show();
			}
		}
				
		reservePathSameNo = (links == null)? null : response.data.PATH_SAME_NO;
		
		// 저장후 
		if (modifyTsdnWdmTypeSprPath == true) {
			$('#'+reserveGridId).alopexGrid("viewUpdate");
		} else {
			$('#old_'+reserveGridId).alopexGrid("viewUpdate");
		}
		
		// cflineHideProgressBody();
		// alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
		
		if (chkExtractAcceptNtwkLine == "CHK_SAVE") { // 저장을 완료하였습니다. 메시지가 표시되었음
			chkExtractAcceptNtwkLine = "";
		} else if (chkExtractAcceptNtwkLine == "SAVE") {  // 수용네트워크 목록을 취득 하는중
			
		} else {  // 수용네트워크 목록을 추출하는 api를 호출하지 않았음
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
		}
		
	}
	// 선번정보가 없고 wdm트렁크 등록시 장비정보가 있고 해당 정보를 바탕으로 수집선번을 조회했을때 1건만 조회된경우 해당 선번정보를 취득
	// WDM트렁크 등록시 장비설정하지 않도록 하여 해당 api(selectAutoClctPath) 호출은 주석처리했음
	else if(flag == 'selectAutoClctPath'){
		var links;
		
		if(gridId == "dataGridWork"){
			
			if(response.data != undefined && response.data.LINKS != undefined ) {

				// 선번비교 탭으로 이동
				$('#basicTabsPop').setTabIndex(2);
				
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					setRontPathData(links, false, tmpGridList[0].grid_clct);
				}

				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['standardEqpInfoMatchClctLnoSet']); /* WDM트렁크 등록시 입력한 장비정보를 기준으로<br>수집선번 중 일치하는 선번정보 1건을 설정했습니다. */
			}			
		}
		else {
			cflineHideProgressBody();
			if(response.data != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){

					$('#'+tmpGridList[0].grid_clct).alopexGrid('dataSet', links);
					// 구간 숨기기 필터적용
		    		setFilterInGrid();		    		
				}			
			} else {
				$("#rontAllView").setChecked(false);
			}	
		}
	}
	// 선번정보 저장 후 TsdnWdm회선번호 갱신
	else if(flag == 'updateTsdnWdmId' || flag == 'updateTsdnWdmIdMain'){
		tsdnRontLineNo = tmpTsdnRontLineNo; // 주선번의 TSDN기간망 번호 저장
		if (flag == 'updateTsdnWdmId') {
			sprTsdnRontLineNo = tmpSprTsdnRontLineNo; // 주선번의 TSDN기간망 번호 저장
		}

		reSetTsdnInfo = false;
		// 기본정보 변경 후 재검색		
		// wdm트렁크 정보
		//cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/getwdmtrunkinfo', initParam, 'GET', 'reGetWdmTrunkInfo');
		
		// 부모창 데이터 재조회
		if (nullToEmpty(opener) != "" && $('#btnResearch' , opener.document).val() != undefined) {
			$('#btnResearch' , opener.document).click();	// WdmTrunk 상세 재검색
		}
		
	}
	// 기본정보 재검색
	else if (flag == 'reGetWdmTrunkInfo') {
		//cflineHideProgressBody();
		if(response != null ){
			$("#popNtwkLineNm").val(response.ntwkLineNm);	// 트렁크명
			$("#popNtwkLineNo").val(response.ntwkLineNo); // 네트워크 회선번호
			$("#popTopoSclNm").val(response.topoSclNm); 	    // 망종류
			$("#popNtwkCapaNm").val(response.ntwkCapaNm); 	    // 용량
			
			baseInfData = response;
			
			$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
			$('#'+baseGridId).alopexGrid("viewUpdate");
		}
	}
	// 수집선번 주선번 선택시 해당 주선번에 속하는 예비선번이 존재하는 경우 예비선번 자동 검색
	else if(flag == 'selectAutoClctPathForSpr'){
		var links;
			
		if(response.data != undefined && response.data.LINKS != undefined ) {
			
			links = response.data.LINKS;
			if(links != null && links.length > 0){
				
				var tmpData = [];
				$.each(links, function(idx, obj){
    				obj.TSDN_RONT_LINE_NO = response.data.NETWORK_ID;
    				tmpData.push(obj);
    			});
				
				setRontPathData(tmpData, false, tmpGridList[1].grid_clct);
			}

			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchSpareLnoCheckSpareLno']); /* 선택하신 주선번의 예비선번이 검색되었습니다. 예비선번도 확인해 주세요.*/
		}
		else {

			cflineHideProgressBody();
			$('#'+tmpGridList[1].grid_clct).alopexGrid('dataEmpty');
			$('#'+tmpGridList[1].grid_clct).alopexGrid("viewUpdate");
		}
			
	}
}

function failCallback(status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == 'networkPathSearch'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if (flag == 'selectAutoClctPath') {
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
}

/* 
 * 기존 WDM트렁크 데이터 인지 수집선번 형태의 데이터인티 체크
 */
function checkRontTypeYn(chkData, chkGridId, resetTypeYn) {
	var rontTypeData = false;
	
	if ( nullToEmpty(chkData) == "") {
		return rontTypeData;
	}
	
	var tmpLinks = AlopexGrid.trimData(chkData);
	var codeList = rontSctnClCdArr; 
	
	for (var i = 0; i < tmpLinks.length ; i++) {
		var tmpRontCode = tmpLinks[i].RONT_SCTN_CL_CD;
		
		for (var y = 0; y < codeList.length; y++) {
			if (tmpRontCode == codeList[y].RONT_SCTN_CL_CD) {
				rontTypeData = true;
				break;
			}
		}
		
		if (rontTypeData == true ) {
			break ;
		}
	}
	// 주선번 취득후 최초 비교인 경우만 -  ADAMS - SKB회선 제외
	if (rontTypeData == false) {	
		msgArg = (chkGridId == detailGridId ? cflineMsgArray['weekLno']/* 주선번 */ : cflineMsgArray['spareLineNo']/* 예비선번 */);
		msg = makeArgMsg('checkExistingLineSetNewLno',msgArg,"","",""); 
		/* 기존 Wdm트렁크 회선의 {0} 정보가 존재 합니다. <br>TSDN 선번비교 탭에서 기존 회선정보를 확인 하시고 TSDN WDM트렁크의 선번을 설정해 주세요.<br> TSDN 선번비교 탭으로 이동하시겠습니까? */
		
		if ((nullToEmpty(chkGridId) != "" && chkGridId == detailGridId) && modifyTsdnWdmTypeMainPath == false && nullToEmpty(resetTypeYn) != "Y" && mgmtGrpCd != "0002") {
			 callMsgBox('', 'C', msg, function(msgId, msgRst){ 
				if (msgRst == 'Y') {
					$('#basicTabsPop').setTabIndex(2);
				} else {
					currentGridId = "old_"+ detailGridId;
				}
			});
		 } else if ((nullToEmpty(chkGridId) != "" && chkGridId == reserveGridId) && modifyTsdnWdmTypeMainPath == true && modifyTsdnWdmTypeSprPath == false  && nullToEmpty(resetTypeYn) != "Y" && mgmtGrpCd != "0002") {

			 callMsgBox('', 'C', msg, function(msgId, msgRst){ 
				if (msgRst == 'Y') {
					$('#pathLineType').setSelected("S");
					$('#basicTabsPop').setTabIndex(2);
				}
			});
		 }
	}

	
	return rontTypeData;
}

/**
 * setRontPathData(links, isAutoClct, setGridId)
 * 기간망 트렁크 구조에 맞추어 리스트표시하는 작업
 * setPathData(links, isAutoClct, gridId) 로직을 수정하는것 
 * 보다 다른 로직으로 다시 만듬.
 * @params links : 선번정보
 *         isAutoClct : 자동설정여부
 *         setGridId : 셋팅할 그리드ID
 *         resetTypeYn : 재검색하여 설정하는 경우인지 여부
 */
function setRontPathData(links, isAutoClct, setGridId, resetTypeYn) {
	// 데이터의 형태가 기간망 형태인지, 기존 wdm트렁크 형태인지 체크
	var rontTypeData = checkRontTypeYn(links, setGridId, resetTypeYn);
	
	links = AlopexGrid.trimData(links);
	var isPath = false;  // 중계노드
	var addDataList = [];
	var rontCodeList = rontSctnClCdArr;
	var rontCodeNum = 0;
	var isExistsRontCodeRown = false;  // 기간망코드와 일치하는 구간정보가 있는지 여부
	
	if (rontTypeData == true) {
		// links만큼 반복하지만 기간망 셋 단위로 처리
		for(var i=0; i < links.length ; i++){
			var linkCode = links[i].RONT_SCTN_CL_CD;
			var equalRowYn = false;  // 일치코드 있는지 체크
			
		    for (var y = rontCodeNum; y < rontCodeList.length; y++) {
				var addData = {"SET_ID" : "alopex" + setIdNumber };
		    	var rontCode = rontCodeList[y].RONT_SCTN_CL_CD;		    	
		    	
		    	// links의 기간망 코드와 기간망 셋의 기간망 코드가 같으면 레코드로 추가
		    	if (linkCode == rontCode) {
		    		isPath = (rontCode == "014" || rontCode == "015" || rontCode == "013") ? true : false;   // 중계인 경우
		    		//isPath = (rontCode == "013") ? true : false;   // 중계인 경우
		    		equalRowYn = true;	// 일치하는 기간망 코드가 있는경우

		    		addData = $.extend(addData, links[i]);    		    	
					addDataList.push(addData);
		    	} else {
		    		if ((rontCode != "014" && rontCode != "015" && rontCode != "013") || ( (rontCode == "014" || rontCode == "015" || rontCode == "013") && isPath == false)) {
		    		//if (rontCode != "013" || ( rontCode == "013" && isPath == false)) {
			    		addData = $.extend(addData, rontCodeList[y]);
	    		    	
						addDataList.push(addData);
		    		}
		    	}
				
				if (equalRowYn == true) {
					isExistsRontCodeRown = true;
					if (isPath == true) {
			    		rontCodeNum = y; // links의 값이 [중계]인 경우 기간망 셋 코드값이 계속 중계 상태를 유지 해야 하기 때문.
					} else {
						rontCodeNum = (y+1);
					}
					break;
				} 
				
				/**  
				 *   A. 기간망 트렁크 한 셋을 다처리한 경우
				 *   => wdm트렁크의 경우 한셋만 설정함.
				 *   => 단, 기간망 코드가 존재하지 않아 표시할 구간이 한개도 없는 경우를 대비하기 위해 구간정보 체크 후 다음 구간을 처리하도록 로직 변경
				 */
				if (y == (rontCodeList.length-1)) {
					// 만약 기간망 트렁크 코드가 존재하지 않는 한셋이 된경우라면 다음구간으로 이동 
					if (isExistsRontCodeRown == false) {
						rontCodeNum = 0;
						addDataList = [];
					} else {
						// 표시할 구간정보가 존재하면서 한 셋이 다 끝난 경우 [B. 기간망 트렁크 한 셋이 다된경우 다시 한 셋을 셋팅하도록 ] 부분 로직을 타지 않도록 하기 위해 
						// rontCodeNum에 기간망 코드보다 더 큰 수를 입력하여 다른 한 셋이 표시되지 않게 처리함
						rontCodeNum  = (y+1);   
					}
				}
		    }
		    
		    /**
		     * B. 기간망 트렁크 한 셋이 다된경우 다시 한 셋을 셋팅하도록 
		     * rontCodeNum : 초기화 하여 기간망 코드를 처음부터 다시 체크하도록 함
		     * setIdNumber : 기간망 한 셋을 추가함
		     * i : rontCodeNum가 기간망 코드와 같은 숫자라면 기간망 코드 한 셋을 다 체크한 경우로 일치하는 코드가 존재하지 않는 경우이기 때문에 구간의 인덱스 값을 -1 하여 다시 체크하도록 하는 로직
		     *     => 하지만 [A. 기간망 트렁크 한 셋을 다처리한 경우] 체크로직에 의해 이런경우는 데이터가 존재하지 않음.  
		     */ 
		    if (rontCodeNum == (rontCodeList.length-1)) {
		    	rontCodeNum = 0;
		    	setIdNumber++;
		    	i = i-1;
		    }
		}	
		
		// links를 다 처리한 후 기간망 한 셋 이 다 처리되지 않은 경우
		if (rontCodeNum > 0 && rontCodeNum < rontCodeList.length) {
			if ( isPath == true) {
				rontCodeNum = rontCodeNum + 1;
			}
			 for (var y = rontCodeNum; y < rontCodeList.length; y++) {
				 var addData = {"SET_ID" : "alopex" + setIdNumber };
				 addData = $.extend(addData, rontCodeList[y]);
				 addData.SET_ID = "alopex" + setIdNumber;
				 addDataList.push(addData);
			 }
		}
	} 
	// 기존 wdm트렁크 형태의 데이터인 경우
	else {
		addPathSet(setGridId);

		$('#old_'+setGridId).alopexGrid('dataSet', links);
		var tmpLinks = AlopexGrid.trimData($('#old_'+setGridId).alopexGrid('dataGet'));
		
		$('#'+ setGridId).hide();
		$('#old_'+ setGridId).show();
		
		// 주선번 그리드에 셋팅 하는 경우 
		if (setGridId == detailGridId) {			
			$('#'+ tmpGridList[0].grid_old).alopexGrid('dataSet', tmpLinks);
			$('#'+ tmpGridList[0].grid_new).hide();
			$('#'+ tmpGridList[0].grid_old).show();
		} 
		// 예비선번 그리드에 셋팅하는 경우
		else if(setGridId == reserveGridId) {
			$('#'+ tmpGridList[1].grid_old).alopexGrid('dataSet', tmpLinks);
			$('#'+ tmpGridList[1].grid_new).hide();
			$('#'+ tmpGridList[1].grid_old).show();
		}
		
		// 편집모드 활성
		$('#old_'+setGridId).alopexGrid("startEdit");
		addRowNullData("old_"+setGridId);

		setEqpEventListener("old_"+setGridId);
		return;
	}
	
	// 그리드에 추가할 데이터가 있는경우
	if (addDataList.length > 0) {
		// 수집선번 추가건이면
		if(isAutoClct ){
			/*var isNullData = true;
			var data = AlopexGrid.currentData($('#'+setGridId).alopexGrid("dataGet"));
			for(var row in data){
				// 기간망 셋 형태의 데이터가 기본적으로 있기때문에 해당 데이터중 실 데이터 있는지 체크
				if(data[row].LEFT_NE_ID != null || data[row].RIGHT_NE_ID != null){
					isNullData = false;
					break;
				}
			}
			
			if(isNullData){
				$('#'+setGridId).alopexGrid('dataSet', addDataList);
			} else {
				$('#'+setGridId).alopexGrid('dataAdd', addDataList);
			}*/
			// 무조건 한 셋만 설정함
			$('#'+setGridId).alopexGrid('dataSet', addDataList);
		} 
		// 수집선번이 아니면
		else {			
			
			$('#'+setGridId).alopexGrid('dataSet', addDataList);
			var tmpAddDataList = AlopexGrid.trimData($('#'+setGridId).alopexGrid('dataGet'));
			
			// 주선번 그리드에 셋팅 하는 경우 
			if (setGridId == detailGridId) {
				$('#'+ tmpGridList[0].grid_new).alopexGrid('dataSet', tmpAddDataList);
				$('#'+ tmpGridList[0].grid_new).show();
				$('#'+ tmpGridList[0].grid_old).hide();
				modifyTsdnWdmTypeMainPath = true;
			}
			// 예비선번 그리드에 셋팅하는 경우
			else if(setGridId == reserveGridId) {
				$('#'+ tmpGridList[1].grid_new).alopexGrid('dataSet', tmpAddDataList);
				$('#'+ tmpGridList[1].grid_new).show();
				$('#'+ tmpGridList[1].grid_old).hide();
				modifyTsdnWdmTypeSprPath = true;
			}

		}		

		$("#"+setGridId).alopexGrid("startEdit");
		setEqpEventListener(setGridId);
		
		// 구간 숨기기 필터적용
		setFilterInGrid();
	}
}

/**
 * 선번set 추가
 */
function addPathSet(setGridId){
	return;
	cflineShowProgressBody();
//	
	var addData = [];
	var setId = "alopex" + setIdNumber;
	//var codeList = (baseInfData.rontTrkTypCd == "023")? rontSctnLinkClCdArr : rontSctnClCdArr;
	var codeList = rontSctnClCdArr;
	
	for(var i = 0; i < codeList.length; i++) {
		addData.push({'SET_ID' : setId, 'RONT_SCTN_CL_CD':codeList[i].RONT_SCTN_CL_CD,'RONT_SCTN_CL_NM' : codeList[i].RONT_SCTN_CL_NM, _state:{editing:true}});
	}
	
	$('#'+setGridId).alopexGrid('dataAdd', addData);
	setIdNumber++;
	cflineHideProgressBody();
	
	// 구간 숨기기 필터적용
	setFilterInGrid();
}
/**
 *  자동수정처리 미처리 건수 체크
 */
function checkAutoProcStat() {
	
	var links;
	var data;
	var reservelinks;
	var reserveData;
	
	var changedMainData;	
	
	// 주선번이 TSDN WDM 트렁크 선번형태 인경우
	if (modifyTsdnWdmTypeMainPath == true) {
		$("#"+detailGridId).alopexGrid("endEdit");
		links = $('#'+detailGridId).alopexGrid('dataGet');
		changedMainData = AlopexGrid.trimData ( $('#'+detailGridId).alopexGrid("dataGet", { _state : {added : false, edited : true}}, {_state : {added : false, deleted : true } } ));  // 기존 편집, 기존 삭제
		$("#"+detailGridId).alopexGrid("startEdit");
		data = AlopexGrid.trimData(links);
	} else {
		$("#old_"+detailGridId).alopexGrid("endEdit");
		links = $('#old_'+detailGridId).alopexGrid('dataGet');
		changedMainData = AlopexGrid.trimData ( $('#old_'+detailGridId).alopexGrid("dataGet", { _state : {added : false, edited : true}}, {_state : {added : false, deleted : true } } ));  // 기존 편집, 기존 삭제
		$("#old_"+detailGridId).alopexGrid("startEdit");
		data = AlopexGrid.trimData(links);
	}
	
	// 그리드내에 편집된경우
	if (changedMainData.length > 0) {
		modifyMainPath = true;
		//console.log(modifyMainPath);
	}
	
	// 주선번 수정이 있는경우
	if (modifyMainPath == true) {
		var checkAutoProcParam = {
				 "ntwkLineNo" : ntwkLineNo
			   , "topoLclCd" : topoLclCd
		};
		cflineShowProgressBody();
		
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/configmgmt/cfline/networkpathautoproc/checkautoprocstat', 
			data : checkAutoProcParam, //
			method : 'GET', //HTTP Method
			flag : 'checkautoprocstat'
		}).done(function(response){
		  			cflineHideProgressBody();
					//console.log(response);
					
					if (nullToEmpty(response.result) == "SUCCESS") {
						if (nullToEmpty(response.acptNtwkLineNoCnt) == "" ||  response.acptNtwkLineNoCnt == 0) {
							// 자동수정할 건수가 없는 경우
							savePath();
						} else {
							var chkMsg = makeArgMsg("checkAutoProcState", getNumberFormatDis(response.acptNtwkLineNoCnt));
						   /*"자동수정처리중인 수용네트워크(링, 트렁크, 서비스회선)가 <b>" + getNumberFormatDis(response.acptNtwkLineNoCnt) + "</b> 건 존재합니다."
							           + "<br><br>자동수정처리가 완료된 후에 저장해 주십시오."
							           + "<br><br>미처리건이 계속 존재하여 저장작업이 되지 않는경우"
							           + "<br><br>구성>네트워크정보>자동수정대상관리 화면에서 해당건 자동수정처리후"
							           + "<br><br>저장작업을 진행해 주십시오.";*/
							alertBox('W', chkMsg);
						    return;
						}
					} else {
					    alertBox('W', cflineMsgArray['errorOfcheckAutoProcState']);/*'자동수정처리 상태조회 중 에러가 발생했습니다. 관리자에게 문의하세요.'*/
					    return;
					}
				})
		  .fail(function(response){
			  	cflineHideProgressBody();
			    alertBox('W', cflineMsgArray['errorOfcheckAutoProcState']); /*'자동수정처리 상태조회 중 에러가 발생했습니다. 관리자에게 문의하세요.'*/
			    return;
			  	});
	} else {
		// 주선번 수정이 없는 경우
		savePath();
	}
}


/**
 * 선번 저장
 */
function savePath() {
	var links;
	var data;
	var reservelinks;
	var reserveData;
	
	var changedMainData;	
	
	// 주선번이 TSDN WDM 트렁크 선번형태 인경우
	if (modifyTsdnWdmTypeMainPath == true) {
		$("#"+detailGridId).alopexGrid("endEdit");
		links = $('#'+detailGridId).alopexGrid('dataGet');
		changedMainData = AlopexGrid.trimData ( $('#'+detailGridId).alopexGrid("dataGet", { _state : {added : false, edited : true}}, {_state : {added : false, deleted : true } } ));  // 기존 편집, 기존 삭제
		$("#"+detailGridId).alopexGrid("startEdit");
		data = AlopexGrid.trimData(links);
	} else {
		$("#old_"+detailGridId).alopexGrid("endEdit");
		links = $('#old_'+detailGridId).alopexGrid('dataGet');
		changedMainData = AlopexGrid.trimData ( $('#old_'+detailGridId).alopexGrid("dataGet", { _state : {added : false, edited : true}}, {_state : {added : false, deleted : true } } ));  // 기존 편집, 기존 삭제
		$("#old_"+detailGridId).alopexGrid("startEdit");
		data = AlopexGrid.trimData(links);
	}
	
	// 그리드내에 편집된경우
	if (changedMainData.length > 0) {
		modifyMainPath = true;
		//console.log(modifyMainPath);
	}

	// 예비선번이 TSDN WDM 트렁크 선번형태 인경우
	if (modifyTsdnWdmTypeSprPath == true) {
		$("#"+reserveGridId).alopexGrid("endEdit");
		reservelinks = $('#'+reserveGridId).alopexGrid('dataGet');
		$("#"+reserveGridId).alopexGrid("startEdit");
		reserveData = AlopexGrid.trimData(reservelinks);
	} else {
		$("#old_"+reserveGridId).alopexGrid("endEdit");
		reservelinks = $('#old_'+reserveGridId).alopexGrid('dataGet');
		$("#old_"+reserveGridId).alopexGrid("startEdit");
		reserveData = AlopexGrid.trimData(reservelinks);
	}
	
	if ((modifyTsdnWdmTypeMainPath == true && links.length == 0) // tsdn 형식이면서 데이터가 없거나
		|| (modifyTsdnWdmTypeMainPath == false && checkOldTypeData(data) == false)) {  // 기존 WDM 형식이면서 데이터가 없거나
		if ((modifyTsdnWdmTypeSprPath == true && reservelinks.length > 0)    // TSDN 형식이면서 데이터가 있거나
			||(modifyTsdnWdmTypeSprPath == false && checkOldTypeData(reserveData) == true)) {   // 기존 WDM 형식이면서 데이터가 있으면
			alertBox('W', cflineMsgArray['noSetSpareLnoNoWeekLno']);/* 주선번 정보가 없는경우 예비선번은 설정 할 수 없습니다. */
			return;
		}
	} 
	
	if (modifyTsdnWdmTypeMainPath != modifyTsdnWdmTypeSprPath ) {
		var msgParma1 = cflineMsgArray['week'];		/* 주 */
		var msgParma2 = cflineMsgArray['spare'];		/* 예비 */
		if (modifyTsdnWdmTypeMainPath == false) {
			msgParma1 = cflineMsgArray['spare'];		/* 예비 */
			msgParma2 =  cflineMsgArray['week'];		/* 주 */
		}
		
		alertBox('W', makeArgMsg('matchTSDNWDMFormat',msgParma1,msgParma2,"","")); /* {0} 선번이 TSDN WDM 형식인 경우 {1}선번도 TSDN WDM 형식이어야 합니다. */
		return;
	}
		
	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	
	var mainCheck = (modifyTsdnWdmTypeMainPath == true ? fnVaildation(data, "main") : fnValidationForOldType(data));
	
	if (mainCheck == false) {
		return;
	}
	var reserveChek = (modifyTsdnWdmTypeSprPath == true ?  fnVaildation(reserveData, "reserve") : fnValidationForOldType(reserveData, 'reserve'));
	
	// 데이터 검증은 주예비 동시에 검증하고 저장은 주선번을 저장한뒤 예비선번을 저장한다
	if( mainCheck && reserveChek  ){
		// 주 선번
		rtnNeFlag = true;
		if (modifyTsdnWdmTypeMainPath == false) {			
			for(var i = 0; i < data.length; i++) {
				// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
				if(i != (data.length -1)) {
					if(data[i].RIGHT_NE_ID != data[i+1].LEFT_NE_ID) {
						rtnNeFlag = false;
					}
				}
			}
		}

		// 예비 선번 
		var reserveRtnNeFlag = true;
		if (modifyTsdnWdmTypeSprPath == false) {
			for(var i = 0; i < reserveData.length; i++) {
				// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
				if(i != (reserveData.length -1)) {
					if(reserveData[i].RIGHT_NE_ID != reserveData[i+1].LEFT_NE_ID) {
						reserveRtnNeFlag = false;
					}
				}
			}
		}
		
		var saveMsg = cflineMsgArray['saveData'];   /*"저장하시겠습니까?"*/
		if(rtnNeFlag == false || reserveRtnNeFlag == false) {
			saveMsg = "";
			if (rtnNeFlag == false) {
				saveMsg =  cflineMsgArray['week'];		/* 주 */
			}
			
			if (reserveRtnNeFlag == false) {
				saveMsg = (saveMsg != "" ? saveMsg + "/" : "");
				saveMsg = saveMsg + cflineMsgArray['spare'];		/* 예비 */
			}
			saveMsg = makeArgMsg('differentEqpAndSave',saveMsg,"","",""); /* {0} 선번의 EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까? */
		}
		
		callMsgBox('','C', saveMsg, function(msgId, msgRst){ 
 			if (msgRst == 'Y') {
 				
 				// 주선번 수정한 경우
 				if (modifyTsdnWdmTypeMainPath == true) {
					for(var i = 0; i < data.length; i++) {
						for(var key in data[i]) {
							var temp = String(eval("data[i]."+key)).indexOf('alopex'); 
							if(temp == 0) {
								eval("data[i]."+key + " = ''");
							}
						}
						data[i].LINK_SEQ = (i+1);
					}
				}
				var params = {
						  "ntwkLineNo" : ntwkLineNo
						, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno
						, "wkSprDivCd" : "01"
						, "autoClctYn" : "N"
						, "topoLclCd" : topoLclCd
						, "topoSclCd" : topoSclCd
						, "linePathYn" : "N"	// 회선선번여부
						, "userId" : userId
						, "links" : JSON.stringify(data)
				};
				
				//console.log(params);
				cflineShowProgressBody();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPath');
 			}
 			// test용
 			/*else { 				
 				// 주선번 변경이 있었던 경우			
 				if (modifyMainPath == true) {
 	   				chkExtractAcceptNtwkLine = "SAVE";
 	   				cflineShowProgressBody();
 	   				var acceptParam = {
 	   						 lineNoStr : ntwkLineNo
 	   					   , topoLclCd : (typeof topoLclCd != "undefined" ? initParam.topoLclCd: "")
 	   					   , linePathYn : "N"
 	   					   , editType : "E"
 	   					   , excelDataYn : "N"
 	   					   , callMsg : cflineMsgArray['saveSuccess']  // 저장에 성공한 경우
 	   				}
 	   				
 	   				extractAcceptNtwkLine(acceptParam);
 	   			} 
 			}*/
 			
		});
	}
}

function saveReservePath() {
	var reserveLinks ;
	var reserveData;
	
	if (modifyTsdnWdmTypeSprPath == true) {
		$("#"+reserveGridId).alopexGrid("endEdit");
		reservelinks = $('#'+reserveGridId).alopexGrid('dataGet');
		$("#"+reserveGridId).alopexGrid("startEdit");
		reserveData = AlopexGrid.trimData(reservelinks);
	} else {
		$("#old_"+reserveGridId).alopexGrid("endEdit");
		reservelinks = $('#old_'+reserveGridId).alopexGrid('dataGet');
		$("#old_"+reserveGridId).alopexGrid("startEdit");
		reserveData = AlopexGrid.trimData(reservelinks);
	}
	
	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	
	var params = {
			  "ntwkLineNo" : ntwkLineNo
			, "ntwkLnoGrpSrno" : reservePathSameNo
			, "wkSprDivCd" : "02"
			, "autoClctYn" : "N"
			, "topoLclCd" : topoLclCd
			, "topoSclCd" : topoSclCd
			, "linePathYn" : "N"	// 회선선번여부
			, "userId" : userId
			, "links" : JSON.stringify(reserveData)
	};
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveReserveNetworkPath');
}

/* 데이터가 있는지 체크*/
function checkOldTypeData(chkData) {
	var chkResult = false;
	
	for(var i = 0; i < chkData.length; i++) {
		var lftNeNm = nullToEmpty(chkData[i].LEFT_NE_NM);
		var lftNeId = nullToEmpty(chkData[i].LEFT_NE_ID);
		var lftPortId = nullToEmpty(chkData[i].LEFT_PORT_ID);
		var lftPortDescr = nullToEmpty(chkData[i].LEFT_PORT_DESCR);
		
		var rghtNeNm = nullToEmpty(chkData[i].RIGHT_NE_NM);
		var rghtNeId = nullToEmpty(chkData[i].RIGHT_NE_ID);
		var rghtPortId = nullToEmpty(chkData[i].RIGHT_PORT_ID);
		var rghtPortDescr = nullToEmpty(chkData[i].RIGHT_PORT_DESCR);

		if(lftNeNm != "" || lftNeId != "" || lftPortId != "" || lftPortDescr != "" 
			|| rghtNeNm != "" || rghtNeId != "" || rghtPortId != "" || rghtPortDescr != ""  ) {
			chkResult = true;
		}
	}
	
	return chkResult;
}

function addLinkPath(data, $cell, grid){
	cflineShowProgressBody();
	var row = data._index.row + 1;
	var addRow = {"SET_ID":data.SET_ID, "RONT_SCTN_CL_CD":"013", "RONT_SCTN_CL_NM":"중계"};
	
	$("#"+currentGridId).alopexGrid("dataAdd", $.extend({}, addRow), {_index : { row:row} });
	$("#"+currentGridId).alopexGrid("startEdit");
	
	cflineHideProgressBody();
}

//function deletePathSet(data, $cell, grid){
// 선번삭제
function deletePathSet(){
	// tab indexm 취득
	var tabIdx = $("#basicTabsPop").getCurrentTabIndex();
	
	cflineShowProgressBody();
	
	var dataList = $('#'+currentGridId).alopexGrid("dataGet");
	//var dataList = $('#'+tmpCurrentGridId).alopexGrid('dataGet', {_state: {selected:true}});
	
	if (currentGridId == "old_"+detailGridId || currentGridId == "old_" + reserveGridId) {
		dataList = $('#'+currentGridId).alopexGrid("dataGet", {_state : {selected:true}} );
		cflineHideProgressBody();
		if (dataList.length == 0) {
			
			alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
			return;
		} else {
			deletePath(currentGridId);
			return;
		}
	}
	
	if(dataList.length == 0){
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
		return;
	} 
	
	var data = dataList[0];
	
	$('#'+currentGridId).alopexGrid("dataDelete", {"SET_ID" : data.SET_ID});
	
	if (tabIdx == 0) {
		tmpTsdnRontLineNo = null;
		
		// 모든 선번을 삭제한 경우 기존 wdm트렁크 형태로 편집하도록 제공
		if (modifyTsdnWdmTypeMainPath == true) {
			$('#'+currentGridId).hide();
			$('#old_'+currentGridId).show();
			modifyTsdnWdmTypeMainPath = false;
			
			if ($('#old_'+currentGridId).alopexGrid("dataGet").length == 0) {
				addRowNullData("old_"+currentGridId);
			}
			currentGridId = "old_"+currentGridId;
			
			if(mgmtGrpCd != "0002") {  // ADAMS - SKB회선 제외
				$("#btnReservePathChange").show();      // 예비선번으로 교체
			}
			
			setEqpEventListener(currentGridId);
			
			// 주선번이 지워지는 경우 예비선번도 하나도 없으면
			if ($('#'+reserveGridId).alopexGrid("dataGet").length == 0) {
				$('#'+reserveGridId).hide();
				$('#old_'+reserveGridId).show();
				modifyTsdnWdmTypeSprPath = false;

				setEqpEventListener("old_"+reserveGridId);
				
				if ($('#old_'+reserveGridId).alopexGrid("dataGet").length == 0) {
					addRowNullData("old_"+reserveGridId);
				}
			}
		} else {

			if ($('#'+currentGridId).alopexGrid("dataGet").length == 0) {
				addRowNullData(currentGridId);
			}
		}
		modifyMainPath = true;
	} else if (tabIdx == 1) {
		tmpSprTsdnRontLineNo = null;

		// 모든 선번을 삭제한 경우 주선번도 기존 WDM 트렁크인 경우 기존 wdm트렁크 형태로 편집하도록 제공
		if (modifyTsdnWdmTypeSprPath == true && modifyTsdnWdmTypeMainPath == false) {
			$('#'+currentGridId).hide();
			$('#old_'+currentGridId).show();
			modifyTsdnWdmTypeSprPath = false;
			
			if ($('#old_'+currentGridId).alopexGrid("dataGet").length == 0) {
				addRowNullData("old_"+currentGridId);
			}
			
			currentGridId = "old_"+currentGridId;
			setEqpEventListener(currentGridId);
		} 
		// 주선번이 TSDN 형태인경우는 TSDN 형태 유지
		else if (modifyTsdnWdmTypeMainPath == true) {
			modifyTsdnWdmTypeSprPath == true;
		}
		else {
			if ($('#'+currentGridId).alopexGrid("dataGet").length == 0) {
				addRowNullData(currentGridId);
			}
		}
	}
	
	/*if(dataList.length == deleteDataList.length){
		addPathSet(currentGridId);
	}*/
	
	cflineHideProgressBody();
}

/**
 * 선번 삭제
 */
function deletePath(gridId) {
	$("#"+gridId).alopexGrid("endEdit");
	//var dataList = $('#'+currentGridId).alopexGrid("dataGet", {"IS_SELECT" : "true"} );

	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
	var selectCnt = dataList.length;
	var addYn = false;
	if(selectCnt == 0){
		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
		$("#"+gridId).alopexGrid("startEdit");
		return;
	} else {
		for(var i = 0; i < dataList.length; i++ ) {
			var data = dataList[i];    		
			var rowIndex = data._index.data;
			if(nullToEmpty(data.TRUNK_ID) == "" && nullToEmpty(data.WDM_TRUNK_ID) == "" && nullToEmpty(data.RING_ID) == ""
				&& nullToEmpty(data.LEFT_NE_ID) == "" && nullToEmpty(data.RIGHT_NE_ID) == "") {
				addYn = true;
			}
			
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
		}
		
		// 전체를 삭제할 경우 row추가
		var list = $('#'+gridId).alopexGrid("dataGet");
		if(list < 1) {
			addRowNullData(gridId);
		}
		else {
			var lastObject = list[list.length-1];
			if(nullToEmpty(lastObject.TRUNK_ID) != "" || nullToEmpty(lastObject.WDM_TRUNK_ID) != "" || nullToEmpty(lastObject.RING_ID) != ""
				|| nullToEmpty(lastObject.LEFT_NE_ID) != "" || nullToEmpty(lastObject.RIGHT_NE_ID) != "") {
				addRowNullData(gridId);
			}
		}
		$("#"+gridId).alopexGrid("startEdit");

		if ($("#basicTabsPop").getCurrentTabIndex() == 0 ) {
			modifyMainPath = true;
		}
	}
}

/**
 * fnVaildation 
 * TSDN 형태의 데이터 체크
 * @param dataList
 * @returns {Boolean}
 */
function fnVaildation(dataList, guBun){
	
	// 구간의 좌장비 우장비 둘다 존재 하지 않는 구간은 존재 하지 않는다
	// 주선번의 구간이 하나도 존재 하지않으면 저장을 할수 없다.
	var pathCnt = 0;
	if(guBun == "main"){
		for(var i = 0; i < dataList.length; i++){
			if(dataList[i].RIGHT_NE_ID != null || dataList[i].LEFT_NE_ID != null){
				pathCnt++
			}
		}
	}else{
		pathCnt = dataList.length;
	}
	
	/*if(pathCnt < 1 && dataDeleteCount < 1){
		alertBox('W', cflineMsgArray['noReqData']);  요청할 데이터가 없습니다. 
		return false;
	}*/
	/*if (guBun == "main" && pathCnt == 0) {
		alertBox('W', cflineMsgArray['noReqData']);  요청할 데이터가 없습니다. 
		return false;
	}*/
	
	// alopex index id 삭제
	for(key in dataList[i]) {
		var temp = String(eval("dataList[i]."+key)).indexOf('alopex'); 
		if(temp == 0) {
			eval("data[i]."+key + " = ''");
		}
	}
	
	var msgArg = "";	
	for(var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		
		var wdmTrunkId = nullToEmpty(data.WDM_TRUNK_ID);
		if(wdmTrunkId.indexOf("alopex") === 0){
			data.WDM_TRUNK_ID = "";
		}
		if(nullToEmpty(data.WDM_TRUNK_NM) != "" && nullToEmpty(data.WDM_TRUNK_ID) == "") {
			msgArg = cflineMsgArray['trunk']; /* 트렁크 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
		} else if(nullToEmpty(data.RONT_SCTN_CL_NM) == ""){
			alertBox('W', makeArgMsg("requiredMessage", cflineMsgArray['division'])); /* 필수 입력 항목입니다.<br>{0} */
			return false;
		} else if(nullToEmpty(data.LEFT_NE_NM) != "" && nullToEmpty(data.LEFT_NE_ID) == "") {
			msgArg = cflineMsgArray['node']; /* 노드 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
		} else if(nullToEmpty(data.LEFT_PORT_DESCR) != "" && nullToEmpty(data.LEFT_PORT_ID) == "") {
			msgArg = cflineMsgArray['port']; /* 포트 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
//		} else if(nullToEmpty(data.LEFT_NE_ID) != "" && data.LEFT_NE_ID !="DV00000000000" && nullToEmpty(data.LEFT_PORT_ID) == "" ){
//			alertBox('W', makeArgMsg("requiredMessage", "'" + data.LEFT_NE_NM + "'의 " + cflineMsgArray['port'])); /* 필수 입력 항목입니다.<br>{0} */
//			return false;
		} else if(nullToEmpty(data.RIGHT_NE_NM) != "" && nullToEmpty(data.RIGHT_NE_ID) == "") {
			msgArg = cflineMsgArray['fiberDistributionFrame']; /* FDF */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
		} else if(nullToEmpty(data.RIGHT_PORT_DESCR) != "" && nullToEmpty(data.RIGHT_PORT_ID) == "") {
			msgArg = cflineMsgArray['fiberDistributionFramePort']; /* FDF포트 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
//		} else if(nullToEmpty(data.RIGHT_NE_ID) != "" && data.RIGHT_NE_ID !="DV00000000000" && nullToEmpty(data.RIGHT_PORT_ID) == ""){
//			alertBox('W', makeArgMsg("requiredMessage", "'" + data.RIGHT_NE_NM + "'의 " + cflineMsgArray['fiberDistributionFramePort'])); /* 필수 입력 항목입니다.<br>{0} */
//			return false;
		}
	}
	return true;
}


/******************************************************************************************
 * fnValidationForOldType
 * 기존 기간망 형태의 데이터 체크
 * @param dataList
 * @returns {Boolean}
 * 
 * 
 * 1. 장비 체크 - 검색을 통해서 입력할것.(ID 확인)
 * 2. 포트 체크 - 검색을 통해서 입력할것.(ID 확인) && 필수 입력
 * 3. 사용네트워크의 채널과 채널이 다른 경우 체크
 ******************************************************************************************/
function fnValidationForOldType(dataList, reserve) {
	
	if(reserve != "reserve") {
		if(dataList.length < 1 && dataDeleteCount < 1){
			alertBox('W', cflineMsgArray['noReqData']); /* 요청할 데이터가 없습니다. */
			return false;
		}
	}
	
	for(var i = 0; i < dataList.length; i++) {
		var useNtwkId = dataList[i].USE_NETWORK_ID;
		var lftNeNm = dataList[i].LEFT_NE_NM;
		var lftNeId = dataList[i].LEFT_NE_ID;
		var lftPortId = dataList[i].LEFT_PORT_ID;
		var lftPortDescr = dataList[i].LEFT_PORT_DESCR;
		
		var rghtNeNm = dataList[i].RIGHT_NE_NM;
		var rghtNeId = dataList[i].RIGHT_NE_ID;
		var rghtPortId = dataList[i].RIGHT_PORT_ID;
		var rghtPortDescr = dataList[i].RIGHT_PORT_DESCR;

		if( nullToEmpty(lftNeNm) != "" && (lftNeId == null || nullToEmpty(lftNeId) == "")) {
			alertBox('W', cflineMsgArray['validationWestNeId']); /* WEST장비를 검색을 통해 조회한 후 등록해주세요. */
			return false;
		} else if( (lftNeId != null && nullToEmpty(lftNeId) != "") && nullToEmpty(lftNeNm) != ""   ) {
			if( nullToEmpty(lftPortDescr) != "" && (lftPortId == null || nullToEmpty(lftPortId) == "")) {
				alertBox('W', cflineMsgArray['validationWestPortId']); /* WEST포트를 검색을 통해 조회한 후 등록해주세요. */
				return false;
			} 
		}
		
		if( nullToEmpty(rghtNeNm) != "" && (rghtNeId == null || nullToEmpty(rghtNeId) == "")) {
			alertBox('W', cflineMsgArray['validationEastNeId']); /* EAST장비를 검색을 통해 조회한 후 등록해주세요. */
			return false;
		} else if( (rghtNeId != null && nullToEmpty(rghtNeId) !="" ) && nullToEmpty(rghtNeNm) != ''  ) {
			if( nullToEmpty(rghtPortDescr) != "" && (rghtPortId == null || nullToEmpty(rghtPortId) == "")) {
				alertBox('W', cflineMsgArray['validationEastPortId']); /* EAST포트를 검색을 통해 조회한 후 등록해주세요. */
				return false;
			} 
		}
		
		// 채널
		/*
		var channelDescr = dataList[i].LEFT_CHANNEL_DESCR;
		var useChannelDescr = dataList[i].USE_NETWORK_LEFT_CHANNEL_DESCR;
		if(nullToEmpty(channelDescr) != "" && nullToEmpty(useChannelDescr) !=  "" && channelDescr.indexOf(useChannelDescr) != 0) {
			alertBox('W', '채널을 확인해주세요.');
			return false;
		}
		 */
	}
	
	return true;
}

/**
 * setButtonDisplay
 * @param param 그리드 id
 */
function setButtonDisplay(param){
	var displayDiv = nullToEmpty(param) ==""? gridId : param;
	
	if(displayDiv == "dataGrid"){
		$("#infoBtn").show();
		$("#workBtn").hide();
	}
	else {
		$("#infoBtn").hide();
		$("#workBtn").show();
	}
}

/**
 * setEqpEventListener
 * 
 * 각 그리드에서 발생할 이벤트 설정
 * @param setGridId : 대상 그리드 *        
 */
function setEqpEventListener(setGridId) {
		
 	// 주선번 데이터 변경
	$('#'+setGridId).on('propertychange input', function(e){
		var dataObj = AlopexGrid.parseEvent(e).data;
		var rowIndex = dataObj._index.row;
		
		// 좌장비 변경
		if(dataObj._key == "LEFT_NE_NM" && nullToEmpty(dataObj.LEFT_NE_ID) != ""){
			var dataList = AlopexGrid.trimData(dataObj);
			for(var key in dataList) {
				if(key.indexOf("LEFT") == 0) {
					if(key != dataObj._key) {
						$('#'+setGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
					}
				}
			}
			
			setLinkDataNull(rowIndex);
		}
		// 우장비 변경
		else if(dataObj._key == "RIGHT_NE_NM" && nullToEmpty(dataObj.RIGHT_NE_ID) != ""){
			var dataList = AlopexGrid.trimData(dataObj);
			for(var key in dataList) {
				if(key.indexOf("RIGHT") == 0) {
					if(key != dataObj._key) {
						$('#'+setGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
					}
				}
			}
			setLinkDataNull(rowIndex);
		}
		// 좌포트 변경
		else if(dataObj._key == "LEFT_PORT_DESCR" && nullToEmpty(dataObj.LEFT_PORT_ID) != ""){
			var flag = "LEFT_"
			// 포트 column set
			var columnList = [  
			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO"
			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
			                    , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
			                    , "RX_PORT_ID", "RX_PORT_NM", "RX_PORT_STATUS_CD", "RX_PORT_STATUS_NM", "RX_PORT_DUMMY"
			                  ];
			
			$.each(columnList, function(key,val){
				if(dataObj._key != (flag+val)){
					$('#'+setGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
				}
	     	});
			setLinkDataNull(rowIndex);
		}
		// 우포트 변경
		else if(dataObj._key == "RIGHT_PORT_DESCR" && nullToEmpty(dataObj.RIGHT_PORT_ID) != ""){
			var flag = "RIGHT_"
			// 포트 column set
			var columnList = [  
			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO"
			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
			                    , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
			                    , "RX_PORT_ID", "RX_PORT_NM", "RX_PORT_STATUS_CD", "RX_PORT_STATUS_NM", "RX_PORT_DUMMY"
			                  ];
			
			$.each(columnList, function(key,val){
				if(dataObj._key != (flag+val)){
					$('#'+setGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
				}
	     	});
			setLinkDataNull(rowIndex);
		}
	});
	
	$('#'+setGridId).on('keydown', function(e){
		if(e.keyCode == 13) {
			//var focusData = $('#'+setGridId).alopexGrid("focusInfo").inputFocus.mapping;
			var dataObj = AlopexGrid.parseEvent(e).data;
			var rowIndex = dataObj._index.row;
			var schVal = dataObj._state.editing[dataObj._column];
			
			if(dataObj._key == "LEFT_NE_NM" && (setGridId == "old_"+detailGridId || setGridId == "old_"+reserveGridId)) {
				// 좌장비
				openEqpListPop("LEFT");
			} else if(dataObj._key == "RIGHT_NE_NM") {
				// 우장비
				openEqpListPop("RIGHT");
			} else if(dataObj._key == "LEFT_PORT_DESCR" && (setGridId == "old_"+detailGridId || setGridId == "old_"+reserveGridId)) {
			//} else if(focusData.key == "LEFT_PORT_DESCR"  && (setGridId == "old_"+detailGridId || setGridId == "old_"+reserveGridId)) {
				// 좌포트
				if(nullToEmpty(dataObj.LEFT_NE_ID) == "" || dataObj.LEFT_NE_ID == "DV00000000000"){					
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['westEqp'])); /* {0}을 선택하세요 */					
			 		return false;					
				} 
				// 좌포트
				openPortListPop("LEFT");
			} else if(dataObj._key == "RIGHT_PORT_DESCR") {
			//} else if(focusData.key == "RIGHT_PORT_DESCR") {
				// 좌포트
				if(nullToEmpty(dataObj.RIGHT_NE_ID) == "" || dataObj.RIGHT_NE_ID == "DV00000000000"){
			 		
		 			var msg = cflineMsgArray['fiberDistributionFrame'];
					
					if (setGridId == "old_" + detailGridId || setGridId == "old_" + reserveGridId) {
						 msg = cflineMsgArray['eastEqp'];
					}
			 		alertBox('W', makeArgMsg("selectObject",msg)); /* {0}을 선택하세요 */
			 		
			 		return false;
				}
				// 우포트
				openPortListPop("RIGHT");
			}
			return false;
		}
    });
	
}

function setLinkDataNull(rowIndex) {
	//구간 데이터 변경
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_SEQ");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_ID");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_DIRECTION");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_STATUS_CD");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_ID");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_DIRECTION");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_STATUS_CD");
}

/**
 * Function Name : openAutoClctPathListPop
 * Description   : 자동수집선번 팝업
 */
function openAutoClctPathListPop(srchData) {
	
	var param = { "topoLclCd" : initParam.topoLclCd, "topoSclCd" : initParam.topoSclCd };
	
	// 주예비선번 여부 설정
	param.wkSprDivCd = ($('#pathLineType').val() == 'S' ? '02' : '01');
	
	if (nullToEmpty(srchData) !="") {
		param.wdmEqpNm = srchData.wdmEqpNm;		
		param.wdmPortNm = srchData.wdmPortNm;		
	}
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	param.popTitle = "WDM " + cflineMsgArray['clctLno'] + " " + cflineMsgArray['search'];		/* WDM수집선번 조회 */
	
	$a.popup({
	  	popid: 'AutoClctPathListPop',
	  	title: 'WDM'+cflineMsgArray['clctLno'],
	  	url: urlPath+'/configmgmt/cfline/RontClctLnoPop.do',
	    data: param,
	    iframe: false,
	    modal : true,
	    movable : true,
	    windowpopup : true,
	    width : 1200,
	    height : 850,
	    callback:function(data){
	    	if(data != null){	    		
//	    		for(var key in data) {
//	    			// 동일 기간망트렁크 LINK구간 삭제
//	    			if(data[key].WDM_TRUNK_ID != null){
//	    				$('#'+detailGridId).alopexGrid("dataDelete", {"WDM_TRUNK_ID" : data[key].WDM_TRUNK_ID} );
//	    			}
//	    		}
	    		//console.log(data[0]);
	    		var pathLineType = $('#pathLineType').val();
	    		//var setGridId = ($('#pathLineType').val() == 'M' ? tmpGridList[0].grid_clct : tmpGridList[1].grid_clct);
	    		var setGridId = tmpGridList[0].grid_clct;
	    		setRontPathData(data, true, setGridId);
	    		//setRontPathData(data, true, currentGridId);
	    		$("#"+setGridId).alopexGrid("startEdit");
	    		setBtnCopyFdfInfo();
	    		
	    		if (nullToEmpty(tsdnRontLineNo) != "" && nullToEmpty(tsdnRontLineNo) != nullToEmpty(data[0].TSDN_RONT_LINE_NO)) {
	    			//alertBox('I', cflineMsgArray['differentSelectWeekLnoTSDNWDMTrunk']);		/* 선택하신 주선번이 기존에 설정하신 TSDN WDM트렁크와 다릅니다. */
	    			callMsgBox('','I', cflineMsgArray['differentSelectWeekLnoTSDNWDMTrunk'], function(msgId, msgRst){  /* 선택하신 주선번이 기존에 설정하신 TSDN WDM트렁크와 다릅니다. */
	    	       		if (msgRst == 'Y') {
	    		    		// 주선번 설정시 예비선번 자동 검색 후 설정
	    		    		if ( $('#pathLineType').val() == 'M'
	    		    			//&& nullToEmpty(data.SPR_TSDN_RONT_LINE_NO) != '' 
	    		    		) {
	    		    			// 1건 기간망 조회하여 선번정보 취득
	    		    			
	    		    			var sprInfoParam = {
	    		    					 ntwkLineNo : data[0].SPR_TSDN_RONT_LINE_NO
	    		    				  /* , firstRowIndex : 1
	    		    				   , lastRowIndex : 20
	    		    				   , topoLclCd : initParam.topoLclCd
	    		    				   , topoSclCd : initParam.topoSclCd
	    		    				   , searchSystem : true*/
	    		    			};
	    						cflineShowProgressBody();
	    						//console.log(sprInfoParam);
	    						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectautoclctpath', sprInfoParam, 'GET', 'selectAutoClctPathForSpr');
	    		    		}	  
	    	       		}
	    			});
	    		} else {
		    		
		    		// 주선번 설정시 예비선번 자동 검색 후 설정
		    		if ( $('#pathLineType').val() == 'M'
		    			//&& nullToEmpty(data.SPR_TSDN_RONT_LINE_NO) != '' 
		    		) {
		    			// 1건 기간망 조회하여 선번정보 취득
		    			
		    			var sprInfoParam = {
		    					 ntwkLineNo : data[0].SPR_TSDN_RONT_LINE_NO
		    				  /* , firstRowIndex : 1
		    				   , lastRowIndex : 20
		    				   , topoLclCd : initParam.topoLclCd
		    				   , topoSclCd : initParam.topoSclCd
		    				   , searchSystem : true*/
		    			};
						cflineShowProgressBody();
						//console.log(sprInfoParam);
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectautoclctpath', sprInfoParam, 'GET', 'selectAutoClctPathForSpr');
		    		}	    			
	    		}
	    		
	    		if ($("input:checkbox[id='rontAllView']").is(":checked") == true ){
	     	 		$('#rontAllView').setChecked(false);
	     	 		setFilterInGrid();
	     		}
	    	}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
	    }	  
	});
}


/**
 * Function Name : openNetworkPathPop
 * Description   : WDM트렁크 선번 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 :  editYn. 편집 가능 여부
 * 					paramValue. 기간망트렁크ID(networkLineNo) 
 * 					btnPrevRemove. 선번 팝업창에서 '이전' 버튼 유무
 * 					useNetworkPathDirection : 네트워크 방향
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openNetworkPathPop( editYn, paramValue, btnPrevRemove, useNetworkPathDirection) {
//	cflineShowProgressBody();
//	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
//	var param = {"ntwkLineNo" : paramValue, "ntwkLnoGrpSrno" : "1", "searchDivision" : "wdm", "editYn" : editYn, "zIndex":zIndex, "target":"Alopex_Popup_NetworkPathListPop"};
	var param = {"ntwkLineNo" : paramValue
				, "ntwkLnoGrpSrno" : "1"
				, "searchDivision" : "ront"
				, "editYn" : editYn
				, "btnPrevRemove" : btnPrevRemove
				, "useNetworkPathDirection" : useNetworkPathDirection			
	};
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}

	$a.popup({
		popid: 'NetworkPathListPop',
	  	title: cflineMsgArray['lno'],
	  	url: urlPath+'/configmgmt/cfline/NetworkPathListPop.do',
	    data: param,
	    iframe: true,
	    modal : true,
	    movable : true,
	    windowpopup : true,
	    width : 1100,
	    height : 700,
	    callback:function(data){
//	    	cflineHideProgressBody();
	    	if(editYn && data != null){
	    		var focusData = $('#'+currentGridId).alopexGrid("dataGet", {_state : {focused : true}})[0];
	    		if(data.prev == "Y"){
	    			if(String(focusData.WDM_TRUNK_MERGE).indexOf('alopex') == 0){
	    				var schVal = AlopexGrid.currentData(focusData).WDM_TRUNK_NM;
	    				openRontTrunkListPop(nullToEmpty(schVal));
	    			}
	    		} else {
		    		var rowIndex = focusData._index.row;
		    		
		    		// 입력데이터 리셋
		    		$('#'+currentGridId).alopexGrid("cellEdit", null, {_index : { row : rowIndex}}, "WDM_TRUNK_NM");
		    		
		    		// 동일 기간망트렁크 LINK구간 삭제
		    		var deleteDataList = $('#'+currentGridId).alopexGrid("dataGet", {"WDM_TRUNK_ID":paramValue}, "WDM_TRUNK_ID");
		    		var deleteRowIndex = 0;
		    		
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;
		    			$('#'+currentGridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0){
		    			rowIndex = deleteRowIndex;
		    		}

		    		// LINK_DIRECTION 설정
		    		var usePath = data[0].USE_NETWORK_PATH_DIRECTION; 
	    			var useLink = data[0].USE_NETWORK_LINK_DIRECTION;
	    			var link = 'RIGHT';
	    			if(usePath == 'RIGHT' && useLink == 'RIGHT') link = 'RIGHT';
	    			else if(usePath == 'RIGHT' && useLink == 'LEFT') link = 'LEFT';
	    			else if(usePath == 'LEFT' && useLink == 'RIGHT') link = 'LEFT';
	    			else if(usePath == 'LEFT' && useLink == 'LEFT') link = 'RIGHT';
	    			
		    		for(var i = 0; i < data.length; i++) {
		    			data[i].LINK_DIRECTION = link;
		    		}
		    		
		    		$('#'+currentGridId).alopexGrid('dataAdd', data, {_index:{data : rowIndex}});
	    		}
	    	}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
	    }
	});
}

/**
 * Function Name : openEqpListPop
 * Description   : 장비검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 좌우구분(LEFT, RIGHT)
 * ----------------------------------------------------------------------------------------------------
 */ 
function openEqpListPop(param){
	var focusData = AlopexGrid.currentData($('#'+currentGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	var paramData = {"vTmofInfo":vTmofInfo};// 최상위 전송실 조회 리스트
	
	// 기존 WDM트렁크 장비 검색인 경우
	if (currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId) {
		$.extend(paramData,{"neNm":(param == "RIGHT" ? nullToEmpty(focusData.RIGHT_NE_NM) : nullToEmpty(focusData.LEFT_NE_NM) )});
		$.extend(paramData,{"searchDivision":"wdm"});
		$.extend(paramData,{"fdfAddVisible":true});
		
		if(param == "LEFT") {
			$.extend(paramData,{"partnerNeId":focusData.RIGHT_NE_ID});
		} else if(param == "RIGHT") {
			$.extend(paramData,{"partnerNeId":focusData.LEFT_NE_ID});
		}

		// wdm트렁크 장비만 검색하기 위해
		$.extend(paramData,{ "wdmYn" :"Y"});
	}
	// TSDN 형식의 장비 검색인 경우
	else {
		if(param == "RIGHT"){
			$.extend(paramData,{"neRoleCd":"11", "neNm":nullToEmpty(focusData.RIGHT_NE_NM), "fdfAddVisible":true});
		}
		else {
			$.extend(paramData,{"neNm":nullToEmpty(focusData.LEFT_NE_NM), "fdfAddVisible":false});
		}
	}
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	} 
	
	// ADAMS 연동 고도화
	$.extend(paramData,{"mgmtGrpCd" : mgmtGrpCd});
	$.extend(paramData,{"svlnLclCd":""});
	$.extend(paramData,{"topoSclCd":topoSclCd});
	
	
	$a.popup({
	  	popid: "popEqpListSch" + param,
	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
		data: paramData,
		iframe: true,
	    modal: true,
	    movable:true,
	    windowpopup : true,
		width : 1030,
		height : 730,
		callback:function(data){
			if(data != null){
				// 장비 data 초기화 column set
				var columnList = [];
				var dataList = AlopexGrid.trimData(focusData);
    			for(var key in dataList) {
    				if(key.indexOf(param) == 0) {
    					columnList.push(key.replace(param+"_", ""));
    				}
    			}
    			
    			// 기존 WDM트렁크 장비 검색인 경우
    			if (currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId) {
    				var idChk = false;
	    			for( var idx = 0; idx < columnList.length; idx++ ) {
	    				if(columnList[idx] == "NE_ID") {
	    					idChk = true;
	    				}
	    			}
					
	    			if(!idChk) {
	    				columnList.push("NE_ID");
	    			}
    			}
    			
    			// 장비 data set
    			setEqpData(param, rowIndex, data, columnList);
    			setLinkDataNull(rowIndex);
    			
    			// 기존 WDM트렁크 장비 검색인 경우
    			if (currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId) {
    				var lastRowIndex = $('#'+currentGridId).alopexGrid("dataGet").length;
					var lastData = $('#'+currentGridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					
					// row 추가
					if( (nullToEmpty(focusData.LEFT_NE_ID) == "" || nullToEmpty(focusData.LEFT_NE_NM) == "") 
	    				&& ( nullToEmpty(focusData.RIGHT_NE_ID) == "" || nullToEmpty(focusData.RIGHT_NE_NM) == "")) {
						
						if( (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
							|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(currentGridId);
						}
					}
					
					// 다음 구간의 좌장비를 동일하게 설정.
					if(param == "RIGHT") {
						var nextRowData = $('#'+currentGridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
						if(nextRowData.LEFT_NE_ID == null || nextRowData.LEFT_NE_ID == "" || nextRowData.LEFT_NE_ID == "DV00000000000") {
							setEqpData("LEFT", rowIndex+1, data, columnList, currentGridId);
							$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex+1}}, "WDM_TRUNK_NM");
						}
												
						// 마지막 줄 추가
						if( (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
		    				 || (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(currentGridId);
						}
					}
					
					if(param == "LEFT") {
						// 이전 구간의 우장비를 동일하게 설정.
						if(rowIndex > 0) {
							var prevRowData = $('#'+currentGridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
							if(prevRowData.RIGHT_NE_ID == null || prevRowData.RIGHT_NE_ID == "" || prevRowData.RIGHT_NE_ID == "DV00000000000") {
								setEqpData("RIGHT", rowIndex-1, data, columnList, currentGridId);
							}
						}	
					}
					
					$("#"+currentGridId).alopexGrid("endEdit");
					$("#"+currentGridId).alopexGrid("startEdit");
					
					orgChk(currentGridId);
					//errorDataChk(currentGridId); 가입자망인 경우만 체크로직이 들어가기때문에 사용안함
					
					var colNm = param + "_NE_NM";
					$('#'+currentGridId).alopexGrid("focusCell", {_index : {data : rowIndex}}, colNm );
    			}
			}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 		
		}
	});		
}

/**
 * Function Name : openPortListPop
 * Description   : 포트검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 좌우구분(LEFT, RIGHT)
 * ----------------------------------------------------------------------------------------------------
 */ 
function openPortListPop(param){
	var focusData = AlopexGrid.currentData($('#'+currentGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	var neId = "";
	var schVal = "";
	
	var txPortId = "";
	var rxPortId = "";
	
	if(param == "LEFT"){
		neId = focusData.LEFT_NE_ID;
		schVal = focusData.LEFT_PORT_DESCR;
	} else {
		neId = focusData.RIGHT_NE_ID;
		schVal = focusData.RIGHT_PORT_DESCR;
	}
	
	if(nullToEmpty(neId)=="" || neId == "DV00000000000"){
		var msg = param=="LEFT"? cflineMsgArray['node'] : cflineMsgArray['fiberDistributionFrame'];
		
		if (currentGridId == "old_" + detailGridId || currentGridId == "old_" + reserveGridId) {
			 msg = param=="LEFT"? cflineMsgArray['westEqp'] : cflineMsgArray['eastEqp'];
		}
 		alertBox('W', makeArgMsg("selectObject",msg)); /* {0}을 선택하세요 */
 		return;
	}
	
	var paramData = {"ntwkLineNo" : ntwkLineNo, "neId":neId, "portNm":nullToEmpty(schVal), "isService":false, "topoLclCd": topoLclCd, "topoSclCd":topoSclCd};
		
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	} 
	
	$a.popup({
	  	popid: "popPortListSch" + param,
	  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
	  	url: urlPath + '/configmgmt/cfline/PortInfPop.do',
		data: paramData,
		width : 850,
		height : 720,
		iframe: true,
	    modal: true,
	    movable:true,
	    windowpopup : true,
		callback:function(data){
			if(data != null && data.length > 0){
				// 포트 column set
    			var txColumnList = [];
    			
    			// 기존 WDM트렁크 포트 검색인 경우
    			if (currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId) {
    				txColumnList = [  
    			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
    			                  , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
    			                  , "PORT_USE_TYPE_NM", "CARD_WAVELENGTH"
			                  ];
    			}
    			// TSDN 형식의 포트 검색인 경우
    			else {
    				txColumnList =[   "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CHANNEL_DESCR"
    			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
    			                    , "PORT_ID", "PORT_NM", "PORT_DESCR", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY"
    			                  ];
    			}
    			// tx구간 set
    			setEqpData(param, rowIndex, data[0], txColumnList);
    			
    			if(data.length > 1){
    				// rx구간 set
    				var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
    				var rxParam = param+"_RX";
    				setEqpData(rxParam, rowIndex, data[1], rxColumnList);
    				
    				// port descr set
    				var portDescr = makeTxRxPortDescr(data[0].portNm, data[1].portNm);
    				$('#'+currentGridId).alopexGrid( "cellEdit", portDescr, {_index : { row : rowIndex}}, param+"_PORT_DESCR");
    				
    				// rx구간의 장비set
    				var rxSctnColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
    				var rxSctnParam = (param == "LEFT" ? "RIGHT" : "LEFT");
    				var rxSctnData = {"portId" : eval("focusData." + rxSctnParam + "_PORT_ID"), "portDescr" : eval("focusData." + rxSctnParam + "_PORT_DESCR")
    						, "portStatusCd" : eval("focusData." + rxSctnParam + "_PORT_STATUS_CD"), "portStatusNm" : eval("focusData." + rxSctnParam + "_PORT_STATUS_NM")
    						, "portDummy" : eval("focusData." + rxSctnParam + "_PORT_DUMMY"), "neId" : eval("focusData." + rxSctnParam + "_NE_ID")
    						, "neNm" : eval("focusData." + rxSctnParam + "_NE_NM")};
    				
    				
    				if(param == "LEFT") {    					
    					// TSDN 형식의 포트 검색인 경우만
    	    			if ((currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId) == false) {
    	    				setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
    	    			}
    				} else if(param == "RIGHT") {
    					if(eval("focusData." + rxSctnParam + "_RX" + "_PORT_ID") == null) {
    						setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
        				}
    				}
    				
    				txPortId = data[0].portId;
    				rxPortId = data[1].portId;
    			} else {
    				txPortId = data[0].portId;
    				
    				var rxflag = param + "_RX_";
        			var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
        			$.each(rxColumnList, function(key,val){
    					$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, rxflag+val);
    				});
        			
        			/*rxflag = (param == "LEFT" ? "RIGHT" : "LEFT") + "_RX_";
        			$.each(rxColumnList, function(key,val){
    					$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, rxflag+val);
    				});
        			rxflag = (param == "LEFT" ? "RIGHT" : "LEFT")+"_PORT_DESCR";
        			portDescr = $('#'+currentGridId).alopexGrid("dataGet", {_index : { row : rowIndex}})[0].LEFT_PORT_NM;
        			$('#'+currentGridId).alopexGrid( "cellEdit", portDescr, {_index : { row : rowIndex}}, rxflag);*/
    			}
    			
    			// 기존 WDM트렁크인경우 시작
    			if (currentGridId == "old_"+detailGridId || currentGridId == "old_"+reserveGridId) {

	    			// FDF장비인지 체크
	    			var currRowData = AlopexGrid.currentData($('#'+currentGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
					var prevRowData = "";
					if(rowIndex > 0) {
						prevRowData = $('#'+currentGridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
					} 
					var nextRowData = $('#'+currentGridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
					
					var fdfNeYn = false;
					var generateLeft = true;
					if(param == "LEFT") {
						if(currRowData.LEFT_NE_ROLE_CD == '11' || currRowData.LEFT_NE_ROLE_CD == '162' 
							|| currRowData.LEFT_NE_ROLE_CD == '177' || currRowData.LEFT_NE_ROLE_CD == '178' || currRowData.LEFT_NE_ROLE_CD == '182') {  // PBOX 추가  2019-12-24
							fdfNeYn = true;
							generateLeft = true;
						}
					} else if(param == "RIGHT") {
						if(currRowData.RIGHT_NE_ROLE_CD == '11' || currRowData.RIGHT_NE_ROLE_CD == '162' 
							|| currRowData.RIGHT_NE_ROLE_CD == '177' || currRowData.RIGHT_NE_ROLE_CD == '178' || currRowData.RIGHT_NE_ROLE_CD == '182') { // PBOX 추가  2019-12-24 
							fdfNeYn = true;
							generateLeft = false;
						}
					}
					
					// FDF 장비인경우
					if(fdfNeYn) {
						// 좌장비 입력
						if(generateLeft) {							
							var setIndex = 0;
							if(rowIndex == 0 || nullToEmpty(prevRowData.RIGNT_NE_ID != "") ) {
								if(currRowData.LEFT_NE_ID == nullToEmpty(prevRowData.RIGHT_NE_ID)) {
									setIndex = rowIndex -1;
								} else {
									var addData = {};
									$("#"+currentGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
									$("#"+currentGridId).alopexGrid("startEdit");
									if(rowIndex == 0) setIndex = 0;
									else setIndex = rowIndex;
								}
							} else if(currRowData.LEFT_NE_ID == prevRowData.RIGHT_NE_ID) {
								setIndex = rowIndex -1;
							} else {
								setIndex = rowIndex -1;
							}
							
							for(var key in currRowData) {
								if(key.indexOf("LEFT") == 0) {
									var length = key.length;
									$('#'+currentGridId).alopexGrid( "cellEdit", eval("currRowData." + key), {_index : { row : setIndex}}, "RIGHT" + key.substring(4, length));
								}
							}
						} else {
							// 우장비 입력
							var setIndex = 0;
							if(rowIndex == 0 || nullToEmpty(nextRowData.LEFT_NE_ID != "") ) {
								if(currRowData.RIGHT_NE_ID == nullToEmpty(nextRowData.LEFT_NE_ID)) {
									setIndex = rowIndex +1;
								} else {
									var addData = {};
									$("#"+currentGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
									$("#"+currentGridId).alopexGrid("startEdit");
									if(rowIndex == 0) setIndex = 0;
									else setIndex = rowIndex;
								}
							} else if(currRowData.RIGHT_NE_ID == nextRowData.LEFT_NE_ID) {
								setIndex = rowIndex +1;
							} else {
								setIndex = rowIndex +1;
							}
							
							for(var key in currRowData) {
								if(key.indexOf("RIGHT") == 0) {
									var length = key.length;
									$('#'+currentGridId).alopexGrid( "cellEdit", eval("currRowData." + key), {_index : { row : setIndex}}, "LEFT" + key.substring(5, length));
								}
							}
						}
					}
					
					
					if(currentGridId == "old_"+reserveGridId) {
						var colNm = param + "_PORT_DESCR";
						$('#'+currentGridId).alopexGrid("focusCell", {_index : {data : rowIndex}}, colNm );
					}
    			}  // 기존 WDM트렁크인경우 끝
    			// TSDN 형식의 트렁크인 경우
    			else {
        			
        			setLinkDataNull(rowIndex);
    				
        			// 좌포트 입력이고 우장비(FDF)가 null일 경우 장비ID와 포트ID로 FDF 검색
        			if(param == "LEFT" && nullToEmpty(focusData.RIGHT_NE_ID) ){
        				if (currentGridId == detailGridId || currentGridId == reserveGridId || currentGridId == tmpGridList[0].grid_clct || currentGridId == tmpGridList[1].grid_clct ) {
            				searchFDF(neId, txPortId, rxPortId);
        				}
        			}
    			}
    			
			}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
		}
	});
}

function searchFDF(eqpId, txPortId, rxPortId){
	cflineShowProgressBody();
	
	var mtsoList = [];
	$.each(vTmofInfo, function(key,val){
		mtsoList.push(vTmofInfo[key].mtsoId);
	});
	
	var param = {"lftEqpId" : eqpId, "lftPortId" : txPortId, "rxLftPortId" : rxPortId, "topMtsoIdList": mtsoList};

	// 장비구간 FDF검색
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronteqpsctn', param, 'POST', 'rontEqpSctn');
}

/**
 * Function Name : setEqpData
 * Description   : 장비데이터set
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 구분자(LEFT, RIGHT)
 * rowIndex    	 : 데이터를 입력할 grid row
 * data    	 	 : 입력 데이터
 * columnList    : 변경 컬럼 array
 * ----------------------------------------------------------------------------------------------------
 */ 
function setEqpData(param, rowIndex, data, columnList, setGridId){
	
	if (nullToEmpty(setGridId) == "") {
		setGridId = currentGridId;
	}
	var editData = {};
	
	for(var i=0; i < columnList.length; i++){
		var columnKey = columnList[i];
		
		// conversion
		var convertKey = columnKey.toLowerCase();
        convertKey = convertKey.replace(/_(\w)/g, function(word) {
            return word.toUpperCase();
        });
		convertKey = convertKey.replace(/_/g, "");
		
		var setValue = false;
		
		// 기존 WDM트렁크 형식의 그리드에 장비/포트 셋팅시
		if (setGridId == "old_"+detailGridId || setGridId == "old_"+reserveGridId) {
			$.each(data, function(key,val){
		 		if(key == convertKey){
		 			$('#'+setGridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, param+"_"+columnKey);
		 			setValue = true;
		 		}         		
		 	});
			
			if(!setValue && columnKey != 'ADD_DROP_TYPE_CD'){
				$('#'+setGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param+"_"+columnKey);
			}
		} 
		// TSDN형식의 그리드에 장비/포트 셋팅시
		else {
			$.each(data, function(key,val){
		 		if(key == convertKey){
//		 			$('#'+detailGridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, param+"_"+columnKey);
		 			var keyStr = param+"_"+columnKey;
		 			eval("editData" + "." + keyStr + "=" + "val");
		 			setValue = true;
		 		}         		
		 	});
			
			if(!setValue){
				var keyStr = param+"_"+columnKey;
				eval("editData" + "." + keyStr + "=" + "null");
//				$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param+"_"+columnKey);
			}
		}
		
	}

	// TSDN 형식의 그리드에서 작업시
	if ((setGridId == "old_"+detailGridId || setGridId == "old_"+reserveGridId) == false) {
		$('#'+setGridId).alopexGrid( "dataEdit", $.extend({}, editData), {_index : { row : rowIndex}});
	}
	
	// 주선번인 경우
	if (setGridId == detailGridId || setGridId == "old_"+detailGridId) {
		// 주선번 편집됨
		modifyMainPath = true;
	}
	
}

// 기존 FDF 정보 복사 버튼제어
function setBtnCopyFdfInfo(){
	
	if ($("#pathLineType").val() == "M") {
		if (modifyTsdnWdmTypeMainPath == true) {
			// 기존 주선번 tsdn 기간망 번호와 선택 선번 그리드의 TSDN기간망 번호가 같으면
			// 선번교체대상에서 tsdn기간망 번호 취득
			var toPathList = AlopexGrid.trimData($('#'+tmpGridList[0].grid_clct).alopexGrid('dataGet'));
			var chkSelTsdnRontLineNo = null;
			for (var i = 0 ; i < toPathList.length; i++) {
				if (nullToEmpty(toPathList[i].TSDN_RONT_LINE_NO) != "") {
					chkSelTsdnRontLineNo = toPathList[i].TSDN_RONT_LINE_NO;
					break;
				}
			}	
			
			// 기존 TSDN 번호와 선택한 수집선번의 TSDN번호가 같은 경우만 복사
			if (nullToEmpty(tsdnRontLineNo) != "" && tsdnRontLineNo == chkSelTsdnRontLineNo) {
				$("#btnCopyFdfInfo").show();
			} else {
				$("#btnCopyFdfInfo").hide();
			}
			
		} else {
			$("#btnCopyFdfInfo").hide();
		} 
	} 
	// 예비선번
	/*else {
		if (modifyTsdnWdmTypeSprPath == true) {
			// 기존 예비선번 tsdn 기간망 번호와 선택 선번 그리드의 TSDN기간망 번호가 같으면
			// 선번교체대상에서 tsdn기간망 번호 취득
			var toPathList = AlopexGrid.trimData($('#'+tmpGridList[1].grid_clct).alopexGrid('dataGet'));
			var chkSelTsdnRontLineNo = null;
			for (var i = 0 ; i < toPathList.length; i++) {
				if (nullToEmpty(toPathList[i].TSDN_RONT_LINE_NO) != "") {
					chkSelTsdnRontLineNo = toPathList[i].TSDN_RONT_LINE_NO;
					break;
				}
			}
			
			// 기존 TSDN 번호와 선택한 수집선번의 TSDN번호가 같은 경우만 복사
			if (nullToEmpty(sprTsdnRontLineNo) != "" && sprTsdnRontLineNo == chkSelTsdnRontLineNo) {
				$("#btnCopyFdfInfoSpr").show();
			} else {
				$("#btnCopyFdfInfoSpr").hide();
			}
		} else {
			$("#btnCopyFdfInfoSpr").hide();
		}
	}*/
}

// 구간 숨기기 옵션에 따라 필터적용 
function setFilterInGrid(){
	
	var rontGridArray = [detailGridId, reserveGridId, tmpGridList[0].grid_new, tmpGridList[1].grid_new, tmpGridList[0].grid_clct, tmpGridList[1].grid_clct];
	
	for (var i = 0; i < rontGridArray.length; i++) {
		
		if($('#rontAllView').is(':checked')) {
			$('#'+rontGridArray[i]).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
		} else {
			$('#'+rontGridArray[i]).alopexGrid('deleteFilter', 'filterVisibleLink');
		}
	}
}

// 구간 숨기기
function filterVisibleLink( data ) {
	data = AlopexGrid.currentData(data);
	
	if(baseInfData.rontTrkTypCd == "023"){
		return true;
	} else if (data === null || data.LINK_VISIBLE === null || data.LINK_VISIBLE === undefined ) {
	    return true;
	} else if( nullToEmpty(data.RONT_SCTN_CL_CD) == "" 
			|| data.RONT_SCTN_CL_CD == "001" || data.RONT_SCTN_CL_CD == "002" 
			|| data.RONT_SCTN_CL_CD == "014" || data.RONT_SCTN_CL_CD == "015" 
			|| data.RONT_SCTN_CL_CD == "011" || data.RONT_SCTN_CL_CD == "012"){
		return true;
	} else {
		return data.LINK_VISIBLE;
	}
}

// 국사 체크하여 그리드에 색상 표시
function orgChk(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = currentGridId;
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	
	// 리셋
	for(var i = 0; i < dataList.length; i++) {
		$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "LEFT_ORG_BORDER");
		$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "RIGHT_ORG_BORDER");
	}
	
	if(dataList.length > 0) {
		// 좌체크
		var lftOrgId = "";
		var fstChk = true;
		var order = 0;
		for(var i = 0; i < dataList.length; i++) {
			if(lftOrgId == "") {
				lftOrgId = dataList[i].LEFT_ORG_ID;
			} else {
				if(lftOrgId == dataList[i].LEFT_ORG_ID) {
					if(nullToEmpty(dataList[i].LEFT_ORG_ID) != "") {
						if(fstChk) {
							order++;
							$('#'+gridId).alopexGrid("cellEdit", 'leftSame'+order, {_index : { row : i-1}}, "LEFT_ORG_BORDER");
							fstChk = false;
						}
						$('#'+gridId).alopexGrid("cellEdit", 'leftSame'+order, {_index : { row : i}}, "LEFT_ORG_BORDER");
					}
				} else {
					fstChk = true;
				}
				lftOrgId = dataList[i].LEFT_ORG_ID;;
			}
		}
		
		// 우체크
		var rghtOrgId = "";
		var fstChk = true;
		var order = 0;
		for(var i = 0; i < dataList.length; i++) {
			if(rghtOrgId == "") {
				rghtOrgId = dataList[i].RIGHT_ORG_ID;
			} else {
				if(rghtOrgId == dataList[i].RIGHT_ORG_ID) {
					if(nullToEmpty(dataList[i].RIGHT_ORG_ID) != "") {
						if(fstChk) {
							order++;
							$('#'+gridId).alopexGrid("cellEdit", 'rightSame'+order, {_index : { row : i-1}}, "RIGHT_ORG_BORDER");
							fstChk = false;
						}
						$('#'+gridId).alopexGrid("cellEdit", 'rightSame'+order, {_index : { row : i}}, "RIGHT_ORG_BORDER");
					}
				} else {
					fstChk = true;
				}
				rghtOrgId = dataList[i].RIGHT_ORG_ID;;
			}
		}
		
		refreshCell(gridId);
	}
}

// 데이터 편집 후
function refreshCell(gridId) {
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	
	for(var i = 0; i < dataList.length; i++) {
		$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_ORG_NM');
		$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_ORG_NM');
	}	
}

// 기존 FDF정보 복사 처리
function copyFdfInfo(pathLineType) {
	
	// 주선번
	var fromGridId = tmpGridList[0].grid_new;
	var toGridId = tmpGridList[0].grid_clct;
	var targetPathType = modifyTsdnWdmTypeMainPath;
	var targetTsdnRontLineNo = nullToEmpty(tsdnRontLineNo);
	
	// 예비선번
	
	if (pathLineType == "S") {
		fromGridId = tmpGridList[1].grid_new;
		toGridId = tmpGridList[1].grid_clct;
		targetPathType = modifyTsdnWdmTypeSprPath;
		targetTsdnRontLineNo = nullToEmpty(sprTsdnRontLineNo);
	}
	
	// 실제 대상정보가 있는지 체크 및 편집대상인지 체크
	// 주선번인 경우만 알림, 예비선번은 그냥 처리
	if (targetPathType == false ){
		if (pathLineType == "M") {
			alertBox('W', cflineMsgArray['noFDFInfo']);/* FDF정보가 없습니다. */
		}		
		return false;
	} 
	
	var chkSelTsdnRontLineNo = "";
	var fromPathList = AlopexGrid.trimData($('#'+fromGridId).alopexGrid('dataGet'));
	var toPathList = AlopexGrid.trimData($('#'+toGridId).alopexGrid('dataGet'));

	// 주선번인 경우만 알림, 예비선번은 그냥 처리
	if (fromPathList.length == 0 ) {
		if (pathLineType == "M") {
			alertBox('W', cflineMsgArray['noFDFInfo']);
		}		
		return false;
	}
	
	// 주선번인 경우만 알림, 예비선번은 그냥 처리
	if (toPathList.length == 0 && pathLineType == "M") {
		alertBox('W', cflineMsgArray['selectNoData']);
		return false;
	}
	
	// 선번교체대상에서 tsdn기간망 번호 취득
	for (var i = 0 ; i < toPathList.length; i++) {
		if (nullToEmpty(toPathList[i].TSDN_RONT_LINE_NO) != "") {
			chkSelTsdnRontLineNo = toPathList[i].TSDN_RONT_LINE_NO;
			break;
		}
	}	
	
	// 기존 TSDN 번호와 선택한 수집선번의 TSDN번호가 같은 경우만 복사
	if (targetTsdnRontLineNo != chkSelTsdnRontLineNo) {
		if (pathLineType == "M") {
			alertBox('W', cflineMsgArray['possibleFDFInfocopy']);		/* FDF정보 복사는 기존 선번정보와 같은 TSDN WDM 트렁크를 선택한 경우만 가능합니다. */
		}
		else {
			var tmpMsg = cflineMsgArray['possibleFDFInfocopy'];		/* FDF정보 복사는 기존 선번정보와 같은 TSDN WDM 트렁크를 선택한 경우만 가능합니다. */
			tmpMsg = tmpMsg + cflineMsgArray['noFDFInfoCopy'];	/* <br><br>(선택된 주선번의 예비선번이 기존 예비선번의 TSDN WDM과 같지 않아 예비선번의 FDF 복사정보는 복사되지 않았습니다.) */
			alertBox('W', tmpMsg);
		} 
		return false;
	}
	
	// 복사할 정보 존재체크
	
	// 장비 정보 복사
	var param = "RIGHT";

	var rontSctnClCd = null;
	var rowIndex = -1;

	// 현재 WDM선번
	for (var i = 0; i < fromPathList.length; i++) {
		var fromData = fromPathList[i];
		var toData = null;
		
		rontSctnClCd = nullToEmpty(fromData.RONT_SCTN_CL_CD);
		rowIndex = -1;
		
		if (nullToEmpty(fromData.RIGHT_NE_ID) != "" && rontSctnClCd != "" ) {
			
			var columnList = [];
			// 설정할 정보 컬럼 설정
			for(var key in fromData) {
				if(key.indexOf(param) == 0) {
					columnList.push(key);
				}
			}			
			
			// 선택한 TSDN 선번정보에서 해당하는 기간망 코드 정보에 반영
			for (var j = 0 ; j < toPathList.length; j ++) {
				if (nullToEmpty(toPathList[j].RONT_SCTN_CL_CD) == rontSctnClCd && nullToEmpty(toPathList[j].LEFT_NE_ID) != "") {
					rowIndex = j;
					toData = toPathList[j];
					break;
				}
			}
			
			if (rowIndex != -1) {
				// copyFdfEqpData : 는 기본 정보가 LEFT_PORT_ID 처럼 카멜 표기 형식의 데이터를 복사할때 사용 
				copyFdfEqpData(param, rowIndex, fromData, columnList, toGridId);   // 오른쪽 모든 장비를 셋팅해줌
				
				// RX 정보가 있는 경우 해당 왼쪽 장비 정보를 RX_왼쪽장비에 셋팅해줌
				var chkValue = (param == "RIGHT" ? nullToEmpty(fromData.RIGHT_RX_PORT_ID) : nullToEmpty(fromData.LEFT_RX_PORT_ID));
				
				// 기존 FDF의 RX포트 정보가 있는경우
				if (chkValue != "") {
					var rxSctnColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
					var rxSctnParam = (param == "LEFT" ? "RIGHT" : "LEFT");
    				var rxSctnData = {"portId" : eval("toData." + rxSctnParam + "_PORT_ID"), "portDescr" : eval("toData." + rxSctnParam + "_PORT_DESCR")
    						, "portStatusCd" : eval("toData." + rxSctnParam + "_PORT_STATUS_CD"), "portStatusNm" : eval("toData." + rxSctnParam + "_PORT_STATUS_NM")
    						, "portDummy" : eval("toData." + rxSctnParam + "_PORT_DUMMY"), "neId" : eval("toData." + rxSctnParam + "_NE_ID")
    						, "neNm" : eval("toData." + rxSctnParam + "_NE_NM")};
    				
    				if(param == "LEFT") {
    					// setEqpData : 는 기본 정보가 portId 처럼 카멜 표기 형식의 데이터를 복사할때 사용 
    	    			setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);    	    			
    				} else if(param == "RIGHT") {
    					if(eval("toData." + rxSctnParam + "_RX" + "_PORT_ID") == null) {
    						setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
        				}
    				}
				} 
			}
		}
	}
	
	return true;
}

// FDF 장비 복사하여 대상 그리드에 셋팅
function copyFdfEqpData(param, rowIndex, data, columnList, toGridId){
	
	if (nullToEmpty(toGridId) == '' || toGridId == "old_"+detailGridId || toGridId == "old_"+reserveGridId) {
		return;
	}
	
	var editData = {};
	
	for(var i=0; i < columnList.length; i++){
		var columnKey = columnList[i];
		var setValue = false;
		
		$.each(data, function(key,val){
	 		if(key == columnKey){
//	 			$('#'+detailGridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, param+"_"+columnKey);
	 			eval("editData" + "." + columnKey + "=" + "val");
	 			setValue = true;
	 		}         		
	 	});
		
		if(!setValue){
			var keyStr = param+"_"+columnKey;
			eval("editData" + "." + keyStr + "=" + "null");
//			$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param+"_"+columnKey);
		}
	}
	
	$('#'+toGridId).alopexGrid( "dataEdit", $.extend({}, editData), {_index : { row : rowIndex}});
}

// 컨텍스트 메뉴를 통한 주선번 편집
function setChangedMainPath(){
	if (currentGridId == detailGridId || currentGridId == "old_"+detailGridId) {
		modifyMainPath = true;
	}
}
