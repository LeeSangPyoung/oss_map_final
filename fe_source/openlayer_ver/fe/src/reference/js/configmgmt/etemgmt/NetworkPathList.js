/**
 * 
 * 2020-01-06  8. PBOX 코드(182)  추가 
 */
var detailGridId = "pathList";
var reserveGrid = "reservePathList";
var baseGridId = "pathBaseInfo";

var openGridId = "";
var baseNtwkLineNo = "";
var ntwkLineNo = "";
var westNodeRole = [];		// west상하위
var eastNodeRole = [];		// east상하위
var westPortUseType = [];	// west사용용도
var eastPortUseType = [];	// east사용용도
var dataArray = [];			// 장비, 포트 검색시 return data
var ntwkLnoGrpSrno = "";	// 서비스회선에서 넘겨주는 선번ID
var prevNtwkLnoGrpSrno = ""; 
var pathSameNo = "";		// 선번에서 조회해온 SAME_NO
var reservePathSameNo = "";	// 예비선번
var utrdMgmtNo = "";		// 미처리관리번호
var dataDeleteCount = 0;
var searchTopoLclCd = "";
var searchTopoSclCd = "";
var isLink = false;
var params = "";
var event = "";
var hideCol = [];
var eqpMdlPortRule = [];	// 선번 룰
var eqpMdlPortRuleYn = true;
var channelIds = [];
//미처리 구분
var gubunValue= "";
//선로 미처리 상태
var utrdStatNm = "";
//선로 미처리 상세내역 구분(가입자회선 : 01, 장비 : 02, Obj : 03)
var remvObjDivCd = "";
//공사코드 : 해지일 경우에만 값이 넘어 온다.(개통인지 해지인지 구분 기준)
var cstrCd = "";
//장비 해제 여부 : 공사완료 여부
var eqpRlesYn = "";
//선번작업완료여부
var remvObjRlesYn = "";

$a.page(function() {
	
	this.init = function(id, param) {
		openGridId = param.gridId;				// 데이터 그리드 OR 작업정보 그리드
		baseNtwkLineNo = param.ntwkLineNo;
		gubunValue = param.gubunValue;
		utrdStatNm = param.utrdStatNm;
		remvObjDivCd = param.remvObjDivCd;
		
		//버튼처리
		$("#btnRegEqp").hide();
		$("#btnSave").hide();
		$("#btnPathDelete").hide();
		$("#btnPathComplete").hide();
		$("#lbDisplayDeletedLineSctn").hide();
		//개통
		if(gubunValue == "01"){			
			if(utrdStatNm == "처리완료"){
			}
			else{
				//선번편집
				$("#btnRegEqp").show();
			}
		}//해지
		else if(gubunValue == "02"){
			cstrCd = param.cstrCd;
			eqpRlesYn = param.eqpRlesYn;
			remvObjRlesYn = param.remvObjRlesYn;
			
			if(utrdStatNm == "처리완료"){
				//선번편집완료
				$("#btnPathComplete").hide();
				//선번편집
				$("#btnRegEqp").hide();
				//선번삭제
				$("#btnPathDelete").hide();
				//선번저장
				$("#btnSave").hide();
			}
			else{
				//선번편집완료
				$("#btnPathComplete").show();
				//선번작업완료여부 : 선번편집불가, 
				if(remvObjRlesYn == "Y"){
					//선번편집완료
					$("#btnPathComplete").text('선번편집취소');
					//선번편집
					$("#btnRegEqp").hide();
					//선번삭제
					$("#btnPathDelete").hide();
					//선번저장
					$("#btnSave").hide();
				}
				else{
					//선번편집완료
					$("#btnPathComplete").text('선번편집완료');					
					//공사완료여부 : 선번편집 가능, 선번편집완료 불가
					if(eqpRlesYn == "Y"){
						//선번편집
						$("#btnRegEqp").show();
						//선번삭제
						$("#btnPathDelete").hide();
						//선번저장
						$("#btnSave").hide();
					}
					else{
						//선번편집
						$("#btnRegEqp").hide();
					}
				}	
			}			
			//삭제구간표시여부
			$("#lbDisplayDeletedLineSctn").show();
		}//망작업
		else{
			if(utrdStatNm == "처리완료"){
				//선번편집
				$("#btnRegEqp").hide();
				//선번저장
				$("#btnSave").hide();
			}
			else{
				//선번편집
				$("#btnRegEqp").show();				
			}
		}
		
		ntwkLnoGrpSrno = nullToEmpty(param.ntwkLnoGrpSrno) == "" ? "" : param.ntwkLnoGrpSrno;
		
		if(gridDivision == "serviceLine") {
			utrdMgmtNo = nullToEmpty(param.utrdMgmtNo) == "" ? "" : param.utrdMgmtNo;
		}
		
		params = {"ntwkLineNo" : baseNtwkLineNo, "utrdMgmtNo" : utrdMgmtNo};
	
		if(ntwkLnoGrpSrno == "") {
			$.extend(params,{"wkSprDivCd": "01"});
			$.extend(params,{"autoClctYn": "N"});
		} else {
			$.extend(params,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
		}
		
		setSelectCode();
		setButtonListener();
		setEventListener();
		cflineShowProgressBody();
	}
	
	function setSelectCode() {
		if(gridDivision == "ring") {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00030', null, 'GET', 'C00030'); // 링 상하위
		} else if(gridDivision == "serviceLine") {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00967', null, 'GET', 'C00967'); // 회선 상하위
		} else if(gridDivision == "wdm") {
			// wdm
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00542', null, 'GET', 'C00542'); // 사용용도
		} else {
			// 트렁크
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
		}
	}
    
	function setButtonListener() {
		/**
		 * 어떤 팝업인지에 따라서 display설정
		 * gridDivision : trunk -> ring, wdmtrunk
		 * gridDivision : ring -> wdmtrunk
		 * gridDivision : wdmtrunk -> wdmtrunk   
		 */
		if(gridDivision == 'trunk') {
			$("#trunkDisplayCheckbox").hide();
		} else if(gridDivision == 'ring') {
			$("#trunkDisplayCheckbox").hide();
			$("#ringAllDisplayCheckbox").hide();
			$("#btnLnRing").show();
			$("#btnEquipmentRing").show();
		} else if( gridDivision == 'wdm') {
			$("#trunkDisplayCheckbox").hide();
			$("#ringAllDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
		}
		
		$("#mtsoDisplay").setChecked(true);
		$("#trunkDisplay").setChecked(true);
		$("#wdmTrunkDisplay").setChecked(true);
		
		$("#wdmTrunkAllDisplay").setChecked(true);
		$("#ringAllDisplay").setChecked(true);
		
		if(openGridId == "dataGrid") {
			if(gridDivision != 'wdm') {
				$("#btnReservePathChange").hide();	
				$("#btnReservePath").hide();
			} else {
				$("#btnReservePathChange").hide();
			}
			
			$("#btnPathDelete").hide();
			$("#btnSave").hide();
//			$("#btnAutoClctPath").hide();
//			$("#ringCoupler").hide();
		} else {
			if(gridDivision != 'wdm') {
				$("#btnReservePathChange").hide();	
				$("#btnReservePath").hide();
			}
		}
	}
	
	function setEventListener() {
		// 링 전체보기. 기본적으로 ADD-DROP구간만 표시하는데 전체보기를 클릭하면 전체구간을 표시한다.
		$('#ringAllDisplay').on('click', function(e){
			
		});
		
		// WDM트렁크 전체보기. 기본적으로 맨위,아래 구간만 표시하는데 전체보기를 클릭하면 전체구간을 표시한다.
		$('#wdmTrunkAllDisplay').on('click', function(e){
			
		});
 
		// 국사 표시
		$('#mtsoDisplay').on('click', function(e){
			if(!$('#mtsoDisplay').is(':checked')) {
				$('#'+detailGridId).alopexGrid('hideCol', [leftOrgNm, rightOrgNm]);
			} else {
				$('#'+detailGridId).alopexGrid('showCol', [leftOrgNm, rightOrgNm]);
			}
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
	    });
		
		// 트렁크 표시.
		$('#trunkDisplay').on('click', function(e){
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
			if(!$('#trunkDisplay').is(':checked')) {
//				$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'TRUNK_BTN']);
				$('#'+detailGridId).alopexGrid('hideCol', 'TRUNK_NM');
				for(var i = 0; i < dataList.length; i++) {
					if(dataList[i].TRUNK_ID == dataList[i].TRUNK_MERGE) {
						dataList[i].TRUNK_ROW_FILTER = false;
					} else {
						dataList[i].TRUNK_ROW_FILTER = true;
					}
				}
			} else {
//				$('#'+detailGridId).alopexGrid('showCol', ['TRUNK_NM', 'TRUNK_BTN']);
				$('#'+detailGridId).alopexGrid('showCol', 'TRUNK_NM');
				for(var i = 0; i < dataList.length; i++) {
					dataList[i].TRUNK_ROW_FILTER = true;
				}
			}
			
			$('#'+detailGridId).alopexGrid("viewUpdate");
			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleTrunkRow', filterVisibleTrunkRow);
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
		});
		
		// WDM트렁크 표시
		$('#wdmTrunkDisplay').on('click', function(e){
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
			if(!$('#wdmTrunkDisplay').is(':checked')) {
//				$('#'+detailGridId).alopexGrid('hideCol', ['WDM_TRUNK_NM', 'WDM_TRUNK_BTN']);
				$('#'+detailGridId).alopexGrid('hideCol', 'WDM_TRUNK_NM');
				for(var i = 0; i < dataList.length; i++) {
					if(dataList[i].WDM_TRUNK_ID == dataList[i].WDM_TRUNK_MERGE) {
						dataList[i].WDM_ROW_FILTER = false;
					} else {
						dataList[i].WDM_ROW_FILTER = true;
					}
				}
			} else {
//			    $('#'+detailGridId).alopexGrid('showCol', ['WDM_TRUNK_NM', 'WDM_TRUNK_BTN']);
				$('#'+detailGridId).alopexGrid('showCol', 'WDM_TRUNK_NM');
				for(var i = 0; i < dataList.length; i++) {
					dataList[i].WDM_ROW_FILTER = true;
				}
			}
			
			$('#'+detailGridId).alopexGrid("viewUpdate");
			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleWdmRow', filterVisibleWdmRow);		// WDM
			$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
		});
		
		// 예비 선번으로 변경
//		$('#btnReservePath').on('click', function(e){
//			$("#reservePathList").show();
//			initGridNetworkPath(reserveGrid);
//	    });
		
		// 선로링, 장비링
		$('#btnLnRing, #btnEquipmentRing').on('click', function(e){
			var title = "";
			var ringMgmtDivCd = "";
			if(this.id == 'btnLnRing') {
				// 선로링
				ringMgmtDivCd = "2";
				title = cflineMsgArray['lnRing'];
			} else {
				// 장비링
				ringMgmtDivCd = "3";
				title = cflineMsgArray['equipmentRing'];
			}
			
			var urlPath = $('#ctx').val();
	 		if(nullToEmpty(urlPath) == ""){
	 			urlPath = "/tango-transmission-web";
	 		}
			var paramData = {"ntwkLineNo" : baseNtwkLineNo, "ringMgmtDivCd" : ringMgmtDivCd, "title" : title};
			
			$a.popup({
			  	popid: "ringMgmtDivPathListPop",
			  	title: title,
			  	url: urlPath +'/configmgmt/cfline/RingMgmtDivPathListPop.do',
			  	data: paramData,
			  	iframe:true,
				modal: false,
				movable:true,
				windowpopup : true,
				width : 1100,
			    height : 600,
				callback:function(data){
					if(data != null && data.length > 0){
					}
				}
			}); 
		});
		
    	$('#btnClose').on('click', function(e){
    		$a.close();
	    });
    	 
    	$('#btnRegEqp').on('click', function(e){
    		var btnShowArray = ['btnSave', 'btnPathDelete']; // 'btnReservePathChange', 'btnReservePath', 'ringCoupler' 
    		var btnHideArray = ['btnRegEqp'];
    		addRow(btnShowArray, btnHideArray);
    		gridHidColSet();
    		
    		if(gridDivision != 'serviceLine' && topoLclCd == '001' && topoSclCd == '031') {
				// 가입자망링
				$("#btnLineInsert").show();
			}
    		
    		if(gridDivision == 'wdm') {
    			// WDM트렁크
    			$("#btnReservePathChange").show();
    			btnRegEqpClick();
    		}
    		
    		if(gridDivision == 'serviceLine') mtsoInfoByPathList({"svlnNo" : baseNtwkLineNo, "sFlag" : "Y"}, 'Y');
    		else tmofInfoPop({"ntwkLineNo" : baseNtwkLineNo, "sFlag" : "Y"}, 'Y');
    	});
    	
    	$('#btnSave').on('click', function(e){
    		savePath();
    	});
    	
    	// 선번 삭제
    	$('#btnPathDelete, #reserveBtnPathDelete').on('click', function(e){
    		var gridId = this.id == 'btnPathDelete' ? detailGridId : reserveGrid;
    		deletePath(gridId);
    	});
    	
    	// 수집 선번
    	$('#btnAutoClctPath').on('click', function(e){
    		openAutoClctPathListPop();
    	});
    	
    	// 선번 생성
    	$('#btnLineInsert').on('click', function(e){
    		callMsgBox('','I', cflineMsgArray['saveCurrntPath'], function(msgId, msgRst){
        		if (msgRst == 'Y') {
//        			cflineShowProgressBody();
        			
        			// 현재 그리드의 선번을 저장 한 뒤에 선번 ID 생성
            		var links = savePathPrev();
            		var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
            		var linePathYn = gridDivision == "serviceLine" ? "Y" : "N";
            		
            		// 그리드의 삭제 데이터 건수가 없을 경우 '요청할 데이터가 없습니다'라는 문구가 뜨게 되는데 
            		// 신규로 추가된 선번ID에서 데이터가 없을 경우에는 선번ID를 삭제해줘야되기때문에 삭제 카운트를 임의로 1로 둔다.
            		dataDeleteCount = 1;
            		if(fnValidation(links)){
            			// 구간 검증 
            			var rtnNeFlag = true;
            			for(var i = 0; i < links.length; i++) {
            				// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
            				if(i != (links.length -1)) {
            					if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
            						rtnNeFlag = false;
            					}
            				}
            			}
            			
            			var data = tempDataTrim();
            			var params = {
            					"ntwkLineNo" : baseNtwkLineNo,
            					"wkSprDivCd" : "01",
            					"autoClctYn" : "N",
            					"linePathYn" : linePathYn,
            					"userId" : userId,
            					"utrdMgmtNo" : utrdMgmtNo,
            					"links" : JSON.stringify(data)
            			};
            			$.extend(params,{"ntwkLnoGrpSrno": $("#ntwkLnoGroSrno").val()});
            			
            			if(!rtnNeFlag) {
            				callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
            					if (msgRst == 'Y') {
            						cflineShowProgressBody();
            						httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathLineInsertAfter');
            					} else {
            						addRowNullData();
            						$("#"+detailGridId).alopexGrid("startEdit");
            					}
            				});
            			} else {
            				cflineShowProgressBody();
            				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathLineInsertAfter');
            			}            			
            		}
        		}
    		});
    	});
    	
    	
    	// ETE 조회
    	$('#btnETE').on('click', function(e){
    		openETEPop();
    	});
		
    	$('#btnPathComplete').on('click', function(e){
    		if($('#btnPathComplete').text() == "선번편집완료"){
    			$("#btnPathComplete").text('선번편집취소');
    			remvObjRlesYn = "Y";
    		}
    		else{
    			$("#btnPathComplete").text('선번편집완료');
    			remvObjRlesYn = "N";
    		}
    		
    		var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
    		
    		var params = {
    			"utrdMgmtNo" : utrdMgmtNo,
    			"remvObjDivCd" : remvObjDivCd,
    			"remvObjRlesYn" : remvObjRlesYn,
    			"userId" : userId
    		};
    		
    		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/etemgmt/updateLnAvlbUtrdTermDtlComplete', params, 'POST', 'updateLnAvlbUtrdTermDtlComplete');
	    });
    	
    	// 엑셀 다운로드
    	$('#btnExportExcel').on('click', function(e){
    		var date = getCurrDate();
    		var fileName = '';
    		if(gridDivision == 'trunk') {
    			fileName = '트렁크';
    		} else if(gridDivision == 'ring') {
    			fileName = '링';
    		} else if(gridDivision == 'wdm') {
    			fileName = 'WDM 트렁크';
    		} else {
    			fileName = '서비스 회선';
    		}
    		
    		var worker = new ExcelWorker({
         		excelFileName : fileName + '_선번 정보_' + date,
//         		palette : [{
//         			className : 'B_YELLOW',
//         			backgroundColor: '#EEEEF8'
//         		},{
//         			className : 'F_RED',
//         			color: '#EEEEF8'
//         		}],
         		sheetList: [{
         			sheetName: fileName + '_선번 정보_' + date,
         			placement: 'vertical',
         			$grid: [$('#'+baseGridId), $('#'+detailGridId)]
         		}]
         	});
    		
    		worker.export({
         		merge: false,
         		exportHidden: false,
//         		filtered  : true,
         		useGridColumnWidth : true,
         		border : true,
         		useCSSParser : true
         	});
    	});
    	
    	/**
    	 * 트렁크, 링, WDM트렁크 더블클릭 이벤트
    	 */
    	$('#'+detailGridId + ', #'+reserveGrid).on('dblclick', '.bodycell', function(e){
    		event = e;
    		var dataObj = AlopexGrid.parseEvent(e);
     	 	var schVal = dataObj.data._state.editing[(dataObj.data._column)];
     	 	var division = (gridDivision == "wdm") ? "wdm" : "";
     	 	
     	 	if(dataObj.mapping.key == "TRUNK_NM") {
    			checkPop("trunk", schVal, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.USE_NETWORK_PATH_DIRECTION, dataObj.data);
    		} else if(dataObj.mapping.key == "RING_NM") {
    			checkPop("ring", schVal, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.RING_PATH_DIRECTION, dataObj.data);
    		} else if(dataObj.mapping.key == "WDM_TRUNK_NM") {
    			checkPop("wdm", schVal, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.USE_NETWORK_PATH_DIRECTION, dataObj.data);
    		} else if(dataObj.mapping.key == "LEFT_NE_NM") {
    			openEqpListPop(schVal, vTmofInfo, division, "LEFT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "LEFT_PORT_DESCR") {
    			if(nullToEmpty(dataObj.data.LEFT_NE_ID) == "" || dataObj.data.LEFT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['westEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
    			openPortListPop(dataObj.data.LEFT_NE_ID, schVal, "LEFT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "RIGHT_NE_NM") {
    			openEqpListPop(schVal, vTmofInfo, division, "RIGHT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "RIGHT_PORT_DESCR") {
    			if(nullToEmpty(dataObj.data.RIGHT_NE_ID) == "" || dataObj.data.RIGHT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['eastEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
    			openPortListPop(dataObj.data.RIGHT_NE_ID, schVal, "RIGHT", dataObj.$grid.attr('id'));
    		} else if(dataObj.mapping.key == "LEFT_CHANNEL_DESCR" || dataObj.mapping.key == "RIGHT_CHANNEL_DESCR") {
    			openCouplerPop(dataObj, null, null, dataObj.$grid.attr('id'));
    		}
    	});
    	
    	// 데이터 변경
    	$('#'+detailGridId + ', #'+reserveGrid).on('propertychange input', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var rowIndex = dataObj._index.data;
    		var gridId = AlopexGrid.parseEvent(e).$grid.attr('id');
    		// 좌장비 변경
    		if(dataObj._key == "LEFT_NE_NM" && nullToEmpty(dataObj.LEFT_NE_ID) != ""){
    			var dataList = AlopexGrid.trimData(dataObj);
    			for(var key in dataList) {
    				if(key.indexOf("LEFT") == 0) {
    					if(key != dataObj._key) {
    						$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
    					}
    				}
    			}
    			
    			$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'TRUNK_NM');
    			$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'WDM_TRUNK_NM');
    			$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'RING_NM');
    			setLinkDataNull(rowIndex, gridId);
    			 
    			// 해당 row에 남은 데이터가 하나도 없고 밑에 빈row가 있을 경우
    			if(dataObj.LEFT_NE_ID == null && dataObj.LEFT_PORT_ID == null) {
    				var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
					var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					
					if((lastData.TRUNK_ID == null && lastData.RING_ID == null && lastData.WDM_TRUNK_ID == null)
							&& (lastData.LEFT_NE_ID == null && lastData.LEFT_NE_NM == null) 
	    					&& (lastData.RIGHT_NE_ID == null && lastData.RIGHT_NE_NM == null )) {
//							$('#'+detailGridId).alopexGrid("dataDelete", {_index : { data:lastRowIndex-1 }});
						}
					
    			}
    		} else if(dataObj._key == "RIGHT_NE_NM" && nullToEmpty(dataObj.RIGHT_NE_ID) != ""){
    			// 우장비 변경
    			var dataList = AlopexGrid.trimData(dataObj);
				for(var key in dataList) {
					if(key.indexOf("RIGHT") == 0) {
						if(key != dataObj._key) {
							$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
						}
					}
				}
				$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'TRUNK_NM');
				$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'WDM_TRUNK_NM');
				$('#'+gridId).alopexGrid( "startCellInlineEdit", {_index: {row: rowIndex}}, 'RING_NM');
				setLinkDataNull(rowIndex, gridId);
				
    		} else if(dataObj._key == "LEFT_PORT_DESCR"){
    			// 좌포트 변경
    			var flag = "LEFT_";
				var columnList = [  
				                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
				                  , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
				                  ];
				
//				if(dataList.LEFT_PORT_ID != null) {
					$.each(columnList, function(key,val){
						if(dataObj._key != (flag+val)){
							$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
						}
					});
//				}
    			setLinkDataNull(rowIndex);
    			
    			// RX 리셋
    			var rxflag = "LEFT_RX_";
    			var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
    			$.each(rxColumnList, function(key,val){
					$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, rxflag+val);
				});
       			
    		} else if(dataObj._key == "RIGHT_PORT_DESCR"){
    			// 우포트 변경
    			var flag = "RIGHT_";
    			var columnList = [  
  			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
  			                  , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
  			                  ];
//    			if(dataList.RIGHT_PORT_ID != null) {
    				$.each(columnList, function(key,val){
    	  				if(dataObj._key != (flag+val)){
    	  					$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
    	  				}
    	  	     	});
        			setLinkDataNull(rowIndex, gridId);
//    			}
    		}
    		
    		// RX 리셋
			var rxflag = "RIGHT_RX_";
			var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
			$.each(rxColumnList, function(key,val){
				$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, rxflag+val);
			});
    	});
    	
		// 데이터를 입력하지 않았을때 drag 하지 못하도록
		$('#'+detailGridId).on('rowDragOver', function(e){
			var dragDataList = e.alopexgrid.dragDataList;
			for(var i = 0; i < dragDataList.length; i++) {
				var dataObj = dragDataList[i];
				if(dataObj._state.added && nullToEmpty(dataObj.TRUNK_ID) == "" && nullToEmpty(dataObj.WDM_TRUNK_ID) == "" && nullToEmpty(dataObj.RING_ID) == ""
					&& nullToEmpty(dataObj.LEFT_NE_ID) == "" && nullToEmpty(dataObj.RIGHT_NE_ID) == "") {
					return false;
				}	
			}
		});
		
		// drag가 끝났을때 구간 비교하여 자동 생성
//		$('#'+detailGridId).on('rowDragDropEnd', function(e){
//			var dragDataList = e.alopexgrid.dragDataList;
//			var gridDataList = $('#'+detailGridId).alopexGrid("dataGet");
//			
//			for(var i = 0; i < dragDataList.length; i++) {
//				var dataObj = dragDataList[i];
//				var rowIndex = dataObj._index.row; 
//				if( rowIndex > 0) {
//					if(i == 0) {
//						// 드래그데이터의 첫구간
//						if(dataObj.LEFT_NE_ID != gridDataList[rowIndex-1].RIGHT_NE_ID) {
//							// 좌장비의 데이터가 이전 구간의 우장비 데이터와 동일하지 않으면 데이터 자동생성
//							
//							// 이전 구간의 우장비 데이터를 신규 생성되는 구간의 좌장비 데이터에 셋팅한다.
//							var rightDataList = AlopexGrid.trimData(gridDataList[rowIndex-1]);
//							var addData = {};
//							var keyParam = "RIGHT";
//			    			for(var key in rightDataList) {
//			    				if(key.indexOf(keyParam) == 0) {
//			    					if(key.indexOf(keyParam+"_PORT") != 0 && key.indexOf(keyParam+"_RACK") != 0 && key.indexOf(keyParam+"_SHELF") != 0 
//			    							&& key.indexOf(keyParam+"_CARD") != 0 && key.indexOf(keyParam+"_SLOT") != 0 
//			    							&& key.indexOf(keyParam+"_CHANNEL") != 0 && key.indexOf(keyParam+"_ADD_DROP") != 0) {
//			    						eval("addData." + key.replace(keyParam + "_", "LEFT_") + " = rightDataList." + key);
//			    					}
//			    				}
//			    			}
//			    			
//			    			// 현재 구간의 좌장비 데이터를 신규 생성되는 구간의 우장비 데이터에 셋팅한다.
//			    			keyParam = "LEFT";
//			    			var leftDataList = AlopexGrid.trimData(dataObj);
//			    			for(var key in leftDataList) {
//			    				if(key.indexOf(keyParam) == 0) {
//			    					if(key.indexOf(keyParam+"_PORT") != 0 && key.indexOf(keyParam+"_RACK") != 0 && key.indexOf(keyParam+"_SHELF") != 0 
//			    							&& key.indexOf(keyParam+"_CARD") != 0 && key.indexOf(keyParam+"_SLOT") != 0
//			    							&& key.indexOf(keyParam+"_CHANNEL") != 0 && key.indexOf(keyParam+"_ADD_DROP") != 0) {
//			    						eval("addData." + key.replace(keyParam + "_", "RIGHT_") + " = leftDataList." + key);
//			    					}
//			    				}
//			    			}
//			    			
//			    			// 현재 구간
//							$("#"+detailGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
//							$("#"+detailGridId).alopexGrid("startEdit");
//						}
//					} else if(i == dragDataList.length-1) {
//						// 드래그데이터의 마지막구간
//						if(dataObj.RIGHT_NE_ID != gridDataList[rowIndex+1].LEFT_NE_ID) {
//							var addData = {};
//							
//							$("#"+detailGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
//							$("#"+detailGridId).alopexGrid("startEdit");
//						}
//					}
//				}
//			}
//		});
		
		$('#chkDisplayDeletedLineSctn').change(function(){
			if($('#chkDisplayDeletedLineSctn').is(':checked')){
				//선번편집완료
				$("#btnPathComplete").hide();
				//선번편집
				$("#btnRegEqp").hide();
				//선번삭제
				$("#btnPathDelete").hide();
				//선번저장
				$("#btnSave").hide();
			}
			else{
				//가용선로 미처리 처리완료인 경우
				if(utrdStatNm == "처리완료"){
					//선번편집완료
					$("#btnPathComplete").hide();
					//선번편집
					$("#btnRegEqp").hide();
					//선번삭제
					$("#btnPathDelete").hide();
					//선번저장
					$("#btnSave").hide();
				}
				else{
					//선번편집완료
					$("#btnPathComplete").show();
					//선번작업완료여부 : 선번편집불가, 
					if(remvObjRlesYn == "Y"){
						//선번편집완료
						$("#btnPathComplete").text('선번편집취소');
						//선번편집
						$("#btnRegEqp").hide();
						//선번삭제
						$("#btnPathDelete").hide();
						//선번저장
						$("#btnSave").hide();
					}
					else{
						//선번편집완료
						$("#btnPathComplete").text('선번편집완료');					
						//공사완료여부 : 선번편집 가능, 선번편집완료 불가
						if(eqpRlesYn == "Y"){
							//선번편집
							$("#btnRegEqp").show();
							//선번삭제
							$("#btnPathDelete").hide();
							//선번저장
							$("#btnSave").hide();
						}
						else{
							//선번편집
							$("#btnRegEqp").hide();
						}
					}
				}			
			}			
			
			setSelectCode();
		});
		
		/**
		 * 1. 사용네트워크의 채널과 비교하여 시작 문자열이 다르면 테두리 처리
		 * 2. 포트, 채널 선번 룰 체크
		 */
		$('#'+detailGridId).on('cellValueEditing', function(e){
			var ev = AlopexGrid.parseEvent(e);        	
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	
        	// 좌채널 변경
        	if(mapping.key == 'LEFT_CHANNEL_DESCR') {
        		if(AlopexGrid.currentValue(data,  "LEFT_CHANNEL_IDS") == "") {
        			var useChannelDescr = AlopexGrid.currentValue(data,  "USE_NETWORK_LEFT_CHANNEL_DESCR");
        			var channelDescr = AlopexGrid.currentValue(data,  "LEFT_CHANNEL_DESCR");
        			if(nullToEmpty(channelDescr) != "" && nullToEmpty(useChannelDescr) != "" && channelDescr.indexOf(useChannelDescr) != 0) {
        				// 셀 테두리 처리
        				$($cell).find('input').attr('style', 'border-color:red');
        			} else {
        				if($($cell).find('input > style').size() > 0) {
        					$($cell).find('input').removeAttr('style');
        				}
        				$($cell).removeClass('channelDescrCss');
        			}
        			
        			// 룰체크
        			checkEqpMdlPortRule(data, $cell, channelDescr, "LEFT");
        		}
        		
//        		debugger;
//        		var dataList = $('#'+detailGridId).alopexGrid("groupRangeGet", {_index: {row : rowIndex}}, "RING_MERGE").member;
        	}
        	 
        	
        	// 우채널 변경
        	if(mapping.key == 'RIGHT_CHANNEL_DESCR') {
        		if(AlopexGrid.currentValue(data,  "RIGHT_CHANNEL_IDS") == "") {
        			var useChannelDescr = AlopexGrid.currentValue(data,  "USE_NETWORK_RIGHT_CHANNEL_DESCR");
            		var channelDescr = AlopexGrid.currentValue(data,  "RIGHT_CHANNEL_DESCR");
            		if(channelDescr.indexOf(useChannelDescr) != 0) {
            			$($cell).find('input').attr('style', 'border-color:red');
            		} else {
            			if($($cell).find('input > style').size() > 0) {
            				$($cell).find('input').removeAttr('style');
            			}
            			$($cell).removeClass('channelDescrCss');
            		}
            		
            		// 룰체크
            		checkEqpMdlPortRule(data, $cell, channelDescr, "RIGHT");
        		}
        	}
		});
		
//		$('#'+detailGridId).on('rowDragDropEnd', function(e){
//        	var evObj = AlopexGrid.parseEvent(e);
//     	 	var dragDataList = AlopexGrid.currentData(evObj.dragDataList);
//     	 	for(var i=0; i<dragDataList.length; i++){
//     	 		var data = dragDataList[i]
//     	 		data._state.added = false;
//     	 	}
//     	 	return evObj.cancelled;
//        });
	}
});

function checkEqpMdlPortRule(data, $cell, channelDescr, seperator) {
	// 선번 룰 체크
	// TODO eval에서 오류날 케이스 정리
	if(nullToEmpty(channelDescr) != "" && nullToEmpty(AlopexGrid.currentValue(data,  seperator + "_MODEL_ID")) != "" ) {
		var ruleArray = eval("eqpMdlPortRule."+ AlopexGrid.currentValue(data,  seperator + "_MODEL_ID"));
		var eqpMdlNm = "";
		var shpRuleRmk = "";
		var channelRuleMsg = "";
		
		// 그룹핑('/', '~')된 채널 분리해서 확인
		var chkYn = false;
		for(var i = 0; i < ruleArray.length; i++) {
			// 포트명 + 채널 구분자 앞 + 채널 + 채널 구분자 뒤
			var channelDescr = AlopexGrid.currentValue(data, seperator + "_CHANNEL_DESCR");
			var channelGroup = channelDescr.split('/');
			
			for(var groupCnt = 0; groupCnt < channelGroup.length; groupCnt++) {
				var channelGroupDetail = channelGroup[groupCnt].split('~');
				for(var detailCnt = 0; detailCnt < channelGroupDetail.length; detailCnt++) {
					if(!chkYn) {
						var portChannelDescr = "";
						var portChannelRgal = "";
						
						// 입력된 포트
						portChannelDescr = AlopexGrid.currentValue(data, seperator + "_PORT_DESCR");
						
						// 입력된 채널이 시작 구분자로 시작하는지 체크
						if(channelGroupDetail[detailCnt].substring(0, 1) != nullToEmpty(ruleArray[i].frstSepVal)) {
							portChannelDescr += nullToEmpty(ruleArray[i].frstSepVal);
						}
						
						// 입력된 채널
						portChannelDescr += channelGroupDetail[detailCnt];
					
						// 입력된 채널이 종료 구분자로 끝나는지 체크
						var length = channelGroupDetail[detailCnt].length;
						if(channelGroupDetail[detailCnt].substring(length-1, length) != nullToEmpty(ruleArray[i].lastSepVal)) {
							portChannelDescr += nullToEmpty(ruleArray[i].lastSepVal);
						}
						
						if(ruleArray[i].portRglaExprVal == null) {
							portChannelRgal = new RegExp(ruleArray[i].chnlRglaExprVal.substring(0, ruleArray[i].chnlRglaExprVal.length-1), 'gi');
						} else {
							portChannelRgal = new RegExp(ruleArray[i].portRglaExprVal + ruleArray[i].chnlRglaExprVal.substring(0, ruleArray[i].chnlRglaExprVal.length-1), 'gi');
						}
						
//						if(ruleArray[i].chnlRglaExprVal != null) {
//							portChannelRgal = new RegExp(ruleArray[i].chnlRglaExprVal.substring(0, ruleArray[i].chnlRglaExprVal.length-1));
//						}  
						
	//					console.log('portChannelRgal : ' + portChannelRgal);
	//					console.log('portChannelDescr : ' + portChannelDescr);
//						console.log('portChannelRgal.test(portChannelDescr) : ' + portChannelRgal.test(portChannelDescr));
//						console.log('chkYn : ' + chkYn);
						
						if(!portChannelRgal.test(portChannelDescr)) {
							eqpMdlPortRuleYn = true;
							chkYn = true;
						} else {
							eqpMdlPortRuleYn = false;
							channelRuleMsg = channelGroupDetail[detailCnt];
						}
					}
				}
			}
			
			if(eqpMdlNm == "") eqpMdlNm = "모델명 : " + ruleArray[i].shpRuleNm;
			shpRuleRmk += '<br/>' + '   - 룰' + parseInt(i+1) + ') ' + ruleArray[i].shpRuleRmk;
		}
		
		var channelRule = eqpMdlNm + shpRuleRmk;
		channelRuleMsg = "채널 " + channelRuleMsg + "을 확인해주세요.";
		
		if(!eqpMdlPortRuleYn) {
			// 룰이 틀렸을때의 처리 로직
    		$($cell).find('input').attr('style', 'border-color:red');
    		
    		$("#channelRule").empty();
    		$("#channelRuleMsg").empty();
    		
    		$("#channelRule").append(channelRule);
    		$("#channelRuleMsg").append(channelRuleMsg);
    		$("#channelRuleBox").show();
    	} else {
    		$($cell).find('input').removeAttr('style');
    		$("#channelRuleBox").hide();
    	}
	} else {
		$($cell).find('input').removeAttr('style');
		$("#channelRuleBox").hide();
	}
}

function setLinkDataNull(rowIndex, gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	//구간 데이터 변경
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_SEQ");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_ID");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_DIRECTION");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_STATUS_CD");
	
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_ID");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_DIRECTION");
	$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_STATUS_CD");
}

/**
 * 
 * @param division
 * @param schVal
 * @param trunkDataObj
 * @param ringDataObj
 * @param wdmTrunkDataObj
 */
function checkPop(division, schVal, trunkDataObj, ringDataObj, wdmTrunkDataObj, useNetworkPathDirection, dataObj) {
	var editYn = $('#'+detailGridId).alopexGrid("readOption").cellInlineEdit;
	
	var trunkId = nullToEmpty(trunkDataObj);
	trunkId = (trunkId.indexOf("alopex") == 0) ? "" : trunkId; 
	var ringId = nullToEmpty(ringDataObj);
	ringId = (ringId.indexOf("alopex") == 0) ? "" : ringId;
	var wdmTrunkId = nullToEmpty(wdmTrunkDataObj);
	wdmTrunkId = (wdmTrunkId.indexOf("alopex") == 0) ? "" : wdmTrunkId;
	
	if(trunkId != "") {
		// 트렁크 선번 팝업창 오픈
		openNetworkPathPop(editYn, trunkDataObj, "trunk", true, useNetworkPathDirection, dataObj.WDM_TRUNK_PATH_SAME_NO);
	} else if(trunkId == "" && ringId != "") {
		if(dataObj.RING_TOPOLOGY_LARGE_CD == '001' && dataObj.RING_TOPOLOGY_SMALL_CD == '031') {
			openNetworkPathPop(editYn, ringDataObj, "ring", true, useNetworkPathDirection, dataObj.RING_PATH_SAME_NO);
		} else {
			addDropPop(editYn, ringId, useNetworkPathDirection);
		}
	} else if(trunkId == "" && ringId == "" && wdmTrunkId != "") {
		// WDM 트렁크 선번 팝업창 오픈
		openNetworkPathPop(editYn, wdmTrunkDataObj, "wdm", true, useNetworkPathDirection, dataObj.TRUNK_PATH_SAME_NO);
	} else {
		if(division == "trunk") openTrunkListPop(schVal, "trunk");
		else if(division == "ring") openRingListPop(schVal);
		else if(division == "wdm") 	openTrunkListPop(schVal, "wdm");
	}
}

/**
 * 각 버튼을 클릭 할 때 이벤트
 */
function setEqpEventListener(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	$('#'+gridId).on('keyup', function(e){
		if(e.keyCode == 13) {
			event = e;
			var focusData = $('#'+gridId).alopexGrid("focusInfo").inputFocus.mapping;
			var dataObj = AlopexGrid.parseEvent(e).data;
			var schVal = dataObj._state.editing[dataObj._column];
			
			// 
			if(focusData.key == "TRUNK_NM") {
				checkPop("trunk", schVal, dataObj.TRUNK_ID, null, null, null, dataObj);
			} else if(focusData.key == "WDM_TRUNK_NM"){
				// WDM 트렁크
				checkPop("wdm", schVal, dataObj.TRUNK_ID, dataObj.RING_ID, dataObj.WDM_TRUNK_ID, null, dataObj);
			} else if(focusData.key == "RING_NM") {
				// 링
				checkPop("ring", schVal, dataObj.TRUNK_ID, dataObj.RING_ID, null, null, dataObj);
			} else if(focusData.key == "LEFT_NE_NM") {
				// 좌장비
				var division = (gridDivision == "wdm") ? "wdm" : "";
				openEqpListPop(schVal, vTmofInfo, division, "LEFT", gridId);
			} else if(focusData.key == "RIGHT_NE_NM") {
				// 우장비
				var division = (gridDivision == "wdm") ? "wdm" : "";
				openEqpListPop(schVal, vTmofInfo, division, "RIGHT", gridId);
			} else if(focusData.key == "LEFT_PORT_DESCR") {
				// 좌포트
				if(nullToEmpty(dataObj.LEFT_NE_ID) == "" || dataObj.LEFT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['westEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
				openPortListPop(dataObj.LEFT_NE_ID, schVal, "LEFT", gridId);
			} else if(focusData.key == "RIGHT_PORT_DESCR") {
				// 우포트
				if(nullToEmpty(dataObj.RIGHT_NE_ID)=="" || dataObj.RIGHT_NE_ID == "DV00000000000"){
			 		alertBox('W', makeArgMsg("selectObject",cflineMsgArray['eastEqp'])); /* {0}을 선택하세요 */
			 		return;
				}
				
				openPortListPop(dataObj.RIGHT_NE_ID, schVal, "RIGHT", gridId);
			} else if(focusData.key == "LEFT_CHANNEL_DESCR" || focusData.key == "RIGHT_CHANNEL_DESCR") {
				openCouplerPop(dataObj, null, null);
			}

			return false;
		} else {
//			if(focusData.key == "LEFT_EDITABLE_PORT_DESCR"){
//				if(schVal !== "") {
//					$("#channelRule").show();
////					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', dataList, 'POST', 'channelRule');
//				} else {
//					$("#channelRule").hide();
//				}
//			}
		}
		
    });
}

/**
 * Function Name : openTrunkListPop
 * Description   : 트렁크, WDM트렁크 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : ntwkLineNm. 입력한 트렁크 및 WDM트렁크 명 
 *                 division. 트렁크 WDM트렁크 구분 
 *                 prev. 선번 팝업창에서 '이전' 버튼으로 호출하는지 여부
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openTrunkListPop(ntwkLineNm, searchDivision, prev) {
	var checkYn = true;
	checkYn = prev == 'Y'? true : checkOpenPopYn();  
 	if(checkYn) {
 		// 대분류, 소분류 코드 정의
 		if(searchDivision == 'trunk') {
 			searchTopoLclCd = '002';
 			searchTopoSclCd = '';
 			isLink = false;
 		} else if(searchDivision == 'wdm') {
 			if(gridDivision != 'serviceLine') {
 				isLink = (topoLclCd == '003' && topoSclCd == '101') ? true : false;
 			} else {
 				isLink = false;
 			}
 			
 			searchTopoLclCd = '003';
 			searchTopoSclCd = '101';
 		} else if(searchDivision == 'ring') {
 			searchTopoLclCd = '001';
 			searchTopoSclCd = '';
 			isLink = false;
 		}
 		
 		var param = {"vTmofInfo" : vTmofInfo, "ntwkLineNm" : ntwkLineNm, "topoLclCd" : searchTopoLclCd, "topoSclCd" : searchTopoSclCd, "isLink" : isLink, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())};
 		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) == ""){
 			urlPath = "/tango-transmission-web";
 		}
 		
 		var title = searchDivision == 'wdm' ? 'WDM 트렁크 리스트 조회' : '트렁크 리스트 조회';
 		
 		$a.popup({
 		  	url: urlPath+'/configmgmt/cfline/TrunkListPop.do',
 		    data: param,
 		    windowpopup : true,
// 		    other:'width=1200,height=700,scrollbars=yes,resizable=yes',
// 		  	popid: 'TrunkListPop',
// 		  	title: title,
// 		    iframe: true,
// 		    modal : false,
// 		    movable : true,
 		    width : 1200,
 		    height : 700,
 		    callback:function(data){
// 		    	var ntwkLineNm = "";
 		    	if(data != null){
 		    		if(data.length == 1) {
 		    			ntwkLineNo = data[0].ntwkLineNo;
// 		    			ntwkLineNm = data[0].ntwkLineNm;
 		    		} else {
 		    			ntwkLineNo = data.ntwkLineNo;
// 		    			ntwkLineNm = data.ntwkLineNm;
 		    		}
 		    		
 		    		var dataObj = [];
 		    		if(searchDivision == "wdm") {
 		    			dataObj = $('#'+detailGridId).alopexGrid("dataGet", {'WDM_TRUNK_ID' :ntwkLineNo}, 'WDM_TRUNK_ID');
 		    		} else {
 	 		    		dataObj = $('#'+detailGridId).alopexGrid("dataGet", {'TRUNK_ID' :ntwkLineNo}, 'TRUNK_ID');
 		    		}
 		    		
 		    		if(dataObj.length > 0) {
		    			var msg = cflineMsgArray['duplicationSctn']; /* 중복 선번입니다. */
		    			alertBox('I', msg); 
		    			return;
		    		} else {
		    			// 가져온 트렁크 및 WDM트렁크의 선번 팝업 오픈.
		    			openNetworkPathPop(true, ntwkLineNo, searchDivision, null, null, null);
		    		}
 		    	}
 		    }	  
 		});
 	}
}

/**
 * Function Name : openRingListPop
 * Description   : 링 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : ntwkLineNm. 입력한 링 명 
 * 				   prev. 선번 팝업창에서 '이전' 버튼으로 호출하는지 여부 
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openRingListPop(ntwkLineNm, prev) {
	var checkYn = true;
	checkYn = prev == 'Y'? true : checkOpenPopYn();  
	
	if(checkYn) {
 		if(ntwkLineNm == undefined) ntwkLineNm = '';
 		
 		var param = {"vTmofInfo" : vTmofInfo, "ntwkLineNm" : ntwkLineNm, "topoLclCd" : "001", "topoSclCd" : '', "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())};
 		
 		if(gridDivision == "serviceLine") {
 			$.extend(param,{"svlnLclCd": svlnLclCd});
 			$.extend(param,{"svlnSclCd": svlnSclCd});
 		}
 		
 		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) ==""){
 			urlPath = "/tango-transmission-web";
 		}
 		
 		$a.popup({
 		  	popid: 'RingListPop',
 		  	title: '링리스트조회팝업',
 		    url: urlPath+'/configmgmt/etemgmt/RingListPop.do',
 		    data: param,
 		    iframe: true,
 		    modal : true,
 		    movable : true,
 		    windowpopup : true,
 		    width : 1200,
 		    height : 700,
 		    callback:function(data){
 		    	if(data != null){
 		    		ntwkLineNo = data.ntwkLineNo;
 		    		
 		    		var dataObj = [];
 		    		dataObj = $('#'+detailGridId).alopexGrid("dataGet", {'RING_ID' :ntwkLineNo}, 'RING_ID');
 		    		
 		    		if(dataObj.length > 0) {
		    			var msg = cflineMsgArray['duplicationSctn']; /* 중복 선번입니다. */
		    			alertBox('I', msg); 
		    			return;
		    		} else {
		    			if(data.topoLclCd == "001" && data.topoSclCd == "031") {
		    				// 가입자망링 - 선번창 오픈
		    				openNetworkPathPop(true, ntwkLineNo, 'ring', null, null, null);
		    			} else {
		    				// 링 구성도 오픈 
		    				addDropPop(true, ntwkLineNo, null);
		    			}
		    		}
 				}
 		    }	  
 		});
 	}
	
}

/**
 * Function Name 	: openNetworkPathPop
 * Description   	: 트렁크, WDM트렁크 선번 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 	: 
 *   editYn		 	: 수정가능 여부
 *   ntwkLineNo  	: 선번 번호
 *   searchDivision : 트렁크, WDM트렁크 구분
 *   btnPrevRemove	: 선번 팝업창에서 '이전' 버튼 유무
 *   useNetworkPathDirection : 네트워크 방향
 *   pathSameNo		: 선ID번
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openNetworkPathPop(editYn, ntwkLineNo, searchDivision, btnPrevRemove, useNetworkPathDirection, pathSameNo) {
//	cflineHideProgressBody();
	if(ntwkLineNo == null) return;

//	cflineShowProgressBody();
//	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
	var param = {"ntwkLineNo" : ntwkLineNo, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno, "searchDivision" : searchDivision, "editYn" : editYn
						, "btnPrevRemove" : btnPrevRemove, "useNetworkPathDirection" : useNetworkPathDirection, "pathSameNo" : pathSameNo };
//						, "zIndex":zIndex, "target":"Alopex_Popup_NetworkPathListPop"
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	var popupName = $a.popup({
	  	url: urlPath+'/configmgmt/cfline/NetworkPathListPop.do',
	  	data: param,
	    windowpopup : true,
//	    other:'width=1100,height=700,scrollbars=yes,resizable=yes',
//		popid: 'NetworkPathListPop',
//	  	title: '선번',
//	    iframe: true,
//	    modal : true,
//	    movable : true,
	    width : 1100,
	    height : 700,
	    callback:function(data){
	    	cflineHideProgressBody();
	    	if(data != null) {
		    	if(data.prev == 'Y') {
					// 이전 
					$("#"+detailGridId).alopexGrid("endEdit");
		     	 	var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
		     	 	$("#"+detailGridId).alopexGrid("startEdit");
		     	 	
		     	 	if(searchDivision == 'trunk') {
		     	 		if(String(focusData[0].TRUNK_MERGE).indexOf('alopex') == 0) {
		     	 			openTrunkListPop(eval("focusData[0]." + focusData[0]._key), searchDivision, 'Y');
			     	 	}
		     	 	} else if(searchDivision == 'wdm') {
		     	 		if(String(focusData[0].WDM_TRUNK_MERGE).indexOf('alopex') == 0) {
		     	 			openTrunkListPop(eval("focusData[0]." + focusData[0]._key), searchDivision, 'Y');
			     	 	}
		     	 	} else if(searchDivision == 'ring') {
		     	 		if(String(focusData[0].WDM_TRUNK_MERGE).indexOf('alopex') == 0) {
		     	 			openRingListPop(eval("focusData[0]." + focusData[0]._key), "Y");
			     	 	}
		     	 	}
				}  else {
					var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.row;
		    		
		    		// 검색을 위한 입력데이터 리셋
		    		var column = "";
		    		if(searchDivision == "wdm") {
		    			column = "WDM_TRUNK_NM"; 
		    		} else if(searchDivision == "trunk") {
		    			column = "TRUNK_NM"; 
		    		} else {
		    			column = "RING_NM";
		    		}
		    			 
		    		$('#'+detailGridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, column);
		    		
		    		// 서비스 회선, 링 선번일 경우 상하위 리셋(링 : C00030(N) / 서비스 회선 : C00967(NA))
		    		if(gridDivision == "serviceLine") {
		    			$('#'+detailGridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
		    			$('#'+detailGridId).alopexGrid('cellEdit', 'NA', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
		    		} else if(gridDivision == "ring") {
		    			$('#'+detailGridId).alopexGrid('cellEdit', 'N', {_index : { row : rowIndex}}, 'LEFT_NODE_ROLE_CD');
		    			$('#'+detailGridId).alopexGrid('cellEdit', 'N', {_index : { row : rowIndex}}, 'RIGHT_NODE_ROLE_CD');
		    		}
 
		    		var deleteDataList = [];
		    		if(searchDivision == "trunk") {
		    			deleteDataList = $('#'+detailGridId).alopexGrid("dataGet", {"TRUNK_ID":ntwkLineNo}, "TRUNK_ID");
		    		} else if(searchDivision == "wdm") {
		    			deleteDataList = $('#'+detailGridId).alopexGrid("dataGet", {"WDM_TRUNK_ID":ntwkLineNo}, "WDM_TRUNK_ID");
		    		} else if(searchDivision == "ring") {
		    			deleteDataList = $('#'+detailGridId).alopexGrid("dataGet", {"RING_ID":ntwkLineNo}, "RING_ID");
		    		}
		    		
		    		var deleteRowIndex = 0;
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;
		    			$('#'+detailGridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0) {
		    			rowIndex = deleteRowIndex;
		    		}
		    		
		    		/************************************************************************************
		    		 * LINK_DIRECTION 조합
		    		 * 1. USE_NETWORK_LINK_DIRECTION : 구간 방향
		    		 *     - 예) 서비스회선에서 트렁크를 사용했을때 트렁크의 LINK_DIRECTION이 RIGHT이면 RIGHT가 된다.
		    		 * 2. USE_NETWORK_PATH_DIRECTION : 사용 방향
		    		 *     - 예) 서비스회선에서 트렁크를 사용하는 방향
		    		 * 3. LINK_DIRECTION : USE_NETWORK_LINK_DIRECTION + USE_NETWORK_PATH_DIRECTION
		    		 *     - 예) 정 + 정 = 정, 역 + 정 = 역, 정 + 역 = 역, 역 + 역 = 정
		    		 *     
		    		 * 유형에 따른 LEFT_ADD_DROP_TYPE_CD, RIGHT_ADD_DROP_TYPE_CD 설정
		    		 * case 1. 시작 구간의 좌장비가 없고 우장비가 있다. 					(N / A)
		    		 *         through구간에는 장비가 존재하고 포트가 있을수도 없을수도 있다. 	(T / T)
		    		 *    	   마지막 구간이 좌장비가 있고 우장비가 없다.					(D / N)
		    		 * case 2. 시작 구간, through구간, 마지막구간에 모두 장비가 존재한다.
		    		 * 
		    		 * 인접 트렁크 설정
		    		 * 1. 비정형(SKB 요청) 인접 트렁크
		    		 *    - 이전 트렁크의 마지막 구간에서 좌장비가 있고 우장비가 없다.
		    		 *    - 새로 등록하는 트렁크의 시작 구간에서 좌장비가 없고 우장비가 있다.
		    		 *      → 블럭 합치기
		    		 * 2. 정형 인접 트렁크(트렁크와 트렁크)
		    		 *    - 이전 트렁크 전체와 비교하여 구간(장비, 포트)가 일치한 경우 새로 등록하는 트렁크의 구간은 미표시한다.
		    		 ************************************************************************************ 
		    		 */
		    		
		    		var lineData = $('#'+detailGridId).alopexGrid("dataGet");
		    		var adJoinId = "";
		    		var adJoinSctn = false;
		    		var linkArray = [];
		    		
		    		if(rowIndex > 0) {
		    			adJoinId = lineData[rowIndex-1].TRUNK_ID;
		    		}
		    		
		    		for(var i = 0; i < data.length; i++) {
		    			// LINK_DIRECTION
		    			var usePath = data[i].USE_NETWORK_PATH_DIRECTION; 
		    			var useLink = data[i].USE_NETWORK_LINK_DIRECTION;
		    			var link = 'RIGHT';
		    			if(usePath == 'RIGHT' && useLink == 'RIGHT') link = 'RIGHT';
		    			else if(usePath == 'RIGHT' && useLink == 'LEFT') link = 'LEFT';
		    			else if(usePath == 'LEFT' && useLink == 'RIGHT') link = 'LEFT';
		    			else if(usePath == 'LEFT' && useLink == 'LEFT') link = 'RIGHT';
		    			data[i].LINK_DIRECTION = link;
		    			
		    			// ADD, DROP 정의
		    			if(i == 0) {
		    				// 시작 구간
//		    				if(data[i].LEFT_NE_ID == "DV00000000000" && data[i].RIGHT_NE_ID != null ) {
//		    					// case 1
//		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'N';
//		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'A';
//		    				} else {
//		    					// case 2
//		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'A';
//		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'N';
//		    				}
		    				
		    				if(searchDivision == 'ring') {
		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'N';
		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'A';
		    				} else {
		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'A';
		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'N';
		    					
		    					if(data.length == 1) {
		    						data[i].RIGHT_ADD_DROP_TYPE_CD = 'D';
		    					}
		    				}
		    				
		    			} else if(i == (data.length-1)) {
//		    				// 마지막 구간
//		    				if(data[i].LEFT_NE_ID != null && data[i].RIGHT_NE_ID == "DV00000000000" ) {
//		    					// case 1
//		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'D';
//		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'N';
//		    				} else {
//		    					// case 2
//		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'N';
//		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'D';
//		    				}
		    				
		    				if(searchDivision == 'ring') {
		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'D';
		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'N';
		    				} else {
		    					data[i].LEFT_ADD_DROP_TYPE_CD = 'N';
		    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'D';
		    				}
		    			} else {
		    				data[i].LEFT_ADD_DROP_TYPE_CD = 'T';
	    					data[i].RIGHT_ADD_DROP_TYPE_CD = 'T';
		    			}
		    			
		    			// 정형 인접 트렁크
		    			if(i == 0) {
		    				// 선택된 트렁크의 이전 구간이 트렁크인지 확인한다.
		    				if(adJoinId != "") {
		    					for(var adjCnt = 0; adjCnt < lineData.length; adjCnt++) {
		    						if(lineData[adjCnt].TRUNK_ID == adJoinId) {
		    							adJoinSctn = true;
		    							break;
		    						}
		    					}
		    				}
		    			}
		    			
		    			/**
		    			 * lineData : 그리드 내의 데이터
		    			 * adJoinId : 인접트렁크 아이디
		    			 * data		: 선번 선택을 통해서 내린 데이터
		    			 */
		    			if(adJoinSctn) {
		    				for(var adjCnt = 0; adjCnt < lineData.length; adjCnt++) {
	    						if(lineData[adjCnt].TRUNK_ID == adJoinId) {
	    							// 이전 사용 네트워크가 트렁크 이면
	    							if(data[i].LINK_ID == lineData[adjCnt].LINK_ID) {
	    								// 현재 구간 ID와 그리드 내의 구간 ID가 동일 할 경우
	    								if(linkArray.length == 0 && i > 0) {
	    									// 선번 선택을 통해서 내린 데이터의 첫번째 구간 아이디가 이전 트렁크의 마지막 구간 아이디와 동일하지 않을 경우 pass
	    									break;
	    								} else if(linkArray.length == 0) {
	    									// 인접 구간 ID가 하나도 없을 경우 push
	    									linkArray.push(data[i].LINK_ID);
	    								} else if(data[i-1].LINK_ID == lineData[adjCnt-1].LINK_ID) {
	    									// 선번을 통해서 내린 이전 구간아이디와 그리드내의 이전 구간 아이디가 동일할 경우.
	    									linkArray.push(data[i].LINK_ID);
	    								} else {
	    									linkArray = [];
	    								}
	    							}
	    						}
	    					}
	    				}
		    			 
		    			// 채널 확인
		    			data[i].USE_NETWORK_LEFT_CHANNEL_DESCR  = data[i].LEFT_CHANNEL_DESCR;
		    			data[i].USE_NETWORK_RIGHT_CHANNEL_DESCR  = data[i].RIGHT_CHANNEL_DESCR;
		    		}
		    		
		    		for(var i = data.length-1; i--;) {
		    			for(var j = 0; j < linkArray.length; j++) {
		    				if( data[i].LINK_ID == linkArray[j] ) {
		    					data.splice(i, 1);
		    				}
		    			}
		    		}
		    		
		    		$('#'+detailGridId).alopexGrid('dataAdd', data, {_index:{data : rowIndex}});
		    		$('#'+detailGridId).alopexGrid('startEdit');
				}
	    	}
	    }	  
	});
	
//	setTimeout(function(){
//		// NetworkPathListPop
//		if(popupName.name == '' || popupName.name == undefined) {
//			$("div[data-blockname*='Alopex_Popup_'").remove();
//		}
//	}, 1000);
	
//	$("div[data-blockname*='Alopex_Popup_'").remove();
}


/**
 * Function Name : addDropPop
 * Description   : 링구성도 팝업창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : editYn
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function addDropPop(editYn, ntwkLineNo, useNetworkPathDirection) {
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	cflineShowProgressBody();
	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
	var params = {"ntwkLineNo" : ntwkLineNo, "editYn" : editYn, "useNetworkPathDirection" : useNetworkPathDirection
					, "zIndex":zIndex, "target":"Alopex_Popup_selectAddDrop"};

	// 링 데이터 가져오기(A,T,D)
	var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
	var rowIndex = focusData[0]._index.row;
	var dataList = $('#'+detailGridId).alopexGrid("groupRangeGet", {_index: {row : rowIndex}}, "RING_MERGE").member;
	
	if(dataList.length > 1) {
		$.extend(params,{"dataList":AlopexGrid.trimData(dataList)});
	}

	$a.popup({
    	popid: "selectAddDrop",
		title: "링 ADD DROP",
		url: urlPath+'/configmgmt/cfline/RingAddDropPop.do',
		data: params,
		iframe: true,
		modal: true,
		movable:true,
		windowpopup : true,
		width : 1200,
		height : 730,
		callback:function(data){
			cflineHideProgressBody();
			if(data != null) {
				if(data.prev == 'Y') {
					// 이전 
					$("#"+detailGridId).alopexGrid("endEdit");
		     	 	var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
		     	 	$("#"+detailGridId).alopexGrid("startEdit");
		     	 	if(String(focusData[0].RING_MERGE).indexOf('alopex') == 0) {
		     	 		openRingListPop(eval("focusData[0]." + focusData[0]._key), "Y");
		     	 	}
				} else {
					var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.row;
					
		    		// 검색을 위한 입력데이터 리셋
		    		$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RING_NM");
	    			
		    		// 동일한 링구간 삭제
		    		var deleteDataList = $('#'+detailGridId).alopexGrid("dataGet", {"RING_ID":ntwkLineNo}, "RING_ID");
		    		var deleteRowIndex = 0;
		    		
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;
		    			$('#'+detailGridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0){
		    			rowIndex = deleteRowIndex;
		    		}
		    		
		    		// 데이터 넣기
					$('#'+detailGridId).alopexGrid('dataAdd', data, {_index: {data : rowIndex}});
		    		$('#'+detailGridId).alopexGrid('startEdit');
				}
			}
		}
    });
}

/**
* Function Name : openEqpListPop
* Description   : 장비 검색
* ----------------------------------------------------------------------------------------------------
* param    	 	: 
* ----------------------------------------------------------------------------------------------------
* return        : return param  
*/ 
function openEqpListPop(searchEqpNm, vTmofInfo, division, param, gridId){
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var focusData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	
	if(checkOpenPopYn(gridId)) {
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		var paramData = new Object();
		$.extend(paramData,{"neNm":nullToEmpty(searchEqpNm)});
		$.extend(paramData,{"vTmofInfo":vTmofInfo}); // 최상위 전송실 조회 리스트
		$.extend(paramData,{"searchDivision":division});
		$.extend(paramData,{"fdfAddVisible":true});
		
		if(param == "LEFT") {
			$.extend(paramData,{"partnerNeId":focusData.RIGHT_NE_ID});
		} else if(param == "RIGHT") {
			$.extend(paramData,{"partnerNeId":focusData.LEFT_NE_ID});
		}
		
		$a.popup({
		  	popid: "popEqpListSch" + param,
		  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
		  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
		  	data: paramData,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 1200,
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
					
	    			// 장비 data set
	    			setEqpData(param, rowIndex, data, columnList, gridId);
	    			setLinkDataNull(rowIndex, gridId);
	    			
	    			var lastRowIndex = $('#'+gridId).alopexGrid("dataGet").length;
					var lastData = $('#'+gridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
					
					// row 추가
					if( (focusData.TRUNK_ID == null && focusData.RING_ID == null && focusData.WDM_TRUNK_ID == null)
							&& (focusData.LEFT_NE_ID == null || focusData.LEFT_NE_NM == null) 
	    					&& (focusData.RIGHT_NE_ID == null || focusData.RIGHT_NE_NM == null)) {
						if((lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
							|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
	    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
							addRowNullData(gridId);
						}
					}
					
					// row의 좌장비를 동일하게 설정.
					if(param == "RIGHT") {
						var nextRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
						if(nextRowData.LEFT_NE_ID == null || nextRowData.LEFT_NE_ID == "" || nextRowData.LEFT_NE_ID == "DV00000000000") {
							setEqpData("LEFT", rowIndex+1, data, columnList, gridId);
						}
						if((lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
								|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
		    					|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
								addRowNullData(gridId);
							}
					}
					
					$("#"+gridId).alopexGrid("endEdit");
					$("#"+gridId).alopexGrid("startEdit");
				}
			}
		});
	}
	
}

/**
 * Function Name : openPortListPop
 * Description   : 포트 검색
 * ----------------------------------------------------------------------------------------------------
 * param    	 : PortId. 포트 아이디
 *                 PortNm. 포트명
 *                 neId. 장비 아이디
 *                 searchPortNm. 검색할 포트 명
 *                 leftRight. 좌포트 우포트 구분
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openPortListPop(neId, searchPortNm, param, gridId){
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var focusData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	
	if(checkOpenPopYn(gridId)) {
		var paramData = new Object();
		$.extend(paramData,{"neId":nullToEmpty(neId)});
		$.extend(paramData,{"portNm":nullToEmpty(searchPortNm)});
		
		// ne_role_cd, ntwk_line_no
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		if(gridDivision == "serviceLine") {
			$.extend(paramData,{"isService":true});
			$.extend(paramData,{"svlnNo": baseNtwkLineNo});
			$.extend(paramData,{"svlnLclCd": svlnLclCd});
			$.extend(paramData,{"svlnSclCd": svlnSclCd});
		} else {
			$.extend(paramData,{"isService":false});
			$.extend(paramData,{"ntwkLineNo": baseNtwkLineNo});
			$.extend(paramData,{"topoLclCd": topoLclCd});
			$.extend(paramData,{"topoSclCd": topoSclCd});
		}
		
		$a.popup({
		  	popid: "popPortListSch" + param,
		  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
		  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
		  	data: paramData,
		  	iframe:true,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 1100,
			height : 730,
			callback:function(data){
				if(data != null && data.length > 0){
					// 포트 column set
	    			var txColumnList = [  
		    			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
		    			                  , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
		    			                  , "PORT_USE_TYPE_NM", "CARD_WAVELENGTH"
	    			                  ];
	    			// tx구간 set
					setEqpData(param, rowIndex, data[0], txColumnList, gridId);
	    			
	    			if(data.length > 1){
	    				// rx구간 set
	    				var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
	    				var rxParam = param+"_RX";
	    				setEqpData(rxParam, rowIndex, data[1], rxColumnList);
	    				
	    				// port descr set
	    				var portDescr = makeTxRxPortDescr(data[0].portNm, data[1].portNm);
	    				$('#'+detailGridId).alopexGrid( "cellEdit", portDescr, {_index : { row : rowIndex}}, param+"_PORT_DESCR");
	    				
	    				// rx구간의 장비set
	    				var rxSctnColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
	    				var rxSctnParam = (param == "LEFT" ? "RIGHT" : "LEFT");
	    				var rxSctnData = {"portId" : eval("focusData." + rxSctnParam + "_PORT_ID"), "portDescr" : eval("focusData." + rxSctnParam + "_PORT_DESCR")
	    						, "portStatusCd" : eval("focusData." + rxSctnParam + "_PORT_STATUS_CD"), "portStatusNm" : eval("focusData." + rxSctnParam + "_PORT_STATUS_NM")
	    						, "portDummy" : eval("focusData." + rxSctnParam + "_PORT_DUMMY"), "neId" : eval("focusData." + rxSctnParam + "_NE_ID")
	    						, "neNm" : eval("focusData." + rxSctnParam + "_NE_NM")};
	    				
	    				if(param == "LEFT") {
	    					setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
	    				} else if(param == "RIGHT") {
	    					if(eval("focusData." + rxSctnParam + "_RX" + "_PORT_ID") == null) {
	    						setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
	        				}
	    				}
	    			} 
	    			
	    			
	    			// FDF장비의 포트를 선택 했는데 다음 ROW의 장비가 동일하다면 동일한 포트를 설정해주고 구간을 찾아서 셋팅
	    			/* 11 : FDF, 162 : QDF, 177 : OFD, 178 : IJP */
	    			var fdfNeYn = false;
					var currRowData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
					var nextRowData = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
					
					if(param == "LEFT") {
						if(currRowData.LEFT_NE_ROLE_CD == '11' || currRowData.LEFT_NE_ROLE_CD == '162' 
							|| currRowData.LEFT_NE_ROLE_CD == '177' || currRowData.LEFT_NE_ROLE_CD == '178' || currRowData.LEFT_NE_ROLE_CD == '182') { // PBOX 추가  2019-12-24
							fdfNeYn = true;
						}
					} else if(param == "RIGHT") {
//						if(currRowData.RIGHT_NE_ID == nextRowData.LEFT_NE_ID) {
//							setEqpData("LEFT", rowIndex+1, data[0], txColumnList, gridId);
//						}
						if(currRowData.RIGHT_NE_ROLE_CD == '11' || currRowData.RIGHT_NE_ROLE_CD == '162' 
							|| currRowData.RIGHT_NE_ROLE_CD == '177' || currRowData.RIGHT_NE_ROLE_CD == '178' || currRowData.RIGHT_NE_ROLE_CD == '182') { // PBOX 추가  2019-12-24
							fdfNeYn = true;
						}
					}
					 
					// FDF장비의 포트까지 입력된 경우 구간 찾기
					if(fdfNeYn) {
						// 더미 장비가 아니면
						var lftEqpId = "";
						var lftPortId = "";
						var lftEqpInstlMtsoId = "";
						var generateLeft = false; 
						if(param == "LEFT") {
							lftEqpId = currRowData.LEFT_NE_ID;
							lftPortId = currRowData.LEFT_PORT_ID;
							lftEqpInstlMtsoId = currRowData.LEFT_ORG_ID;
							generateLeft = true;
						} else if(param == "RIGHT") {
							lftEqpId = currRowData.RIGHT_NE_ID;
							lftPortId = currRowData.RIGHT_PORT_ID;
							lftEqpInstlMtsoId = currRowData.RIGHT_ORG_ID;
							generateLeft = false;
						}
						
						var eqpParam = {"lftEqpId" : lftEqpId, "lftPortId" : lftPortId, "lftEqpInstlMtsoId" : lftEqpInstlMtsoId, "generateLeft" : generateLeft};
						httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectEqpSctnRghtInf', eqpParam, 'GET', 'selectEqpSctnRghtInf'+gridId);
					} else {
						setLinkDataNull(rowIndex);
						$('#'+gridId).alopexGrid("viewUpdate");
					}
				}
			}
		}); 
	}
}

/**
 * Function Name : openAutoClctPathListPop
 * Description   : 자동수집선번 팝업
 */
function openAutoClctPathListPop() {
	var mapping = columnMappingNetworkPath();
	var isService = (gridDivision == "serviceLine") ? true : false; 
	var param = { "ntwkLineNo" : baseNtwkLineNo, "userNtwkLnoGrpSrno": pathSameNo, "hideCol" : hideCol, "isService" : true};
	
	$.extend(param,{"mapping": mapping});
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: 'AutoClctPathListPop',
	  	title: '자동수집선번 팝업',
	  	url: urlPath+'/configmgmt/cfline/AutoClctPathListPop.do',
	    data: param,
	    iframe: true,
	    modal : true,
	    movable : true,
	    windowpopup : true,
	    width : 1200,
	    height : 650,
	    callback:function(data){
	    	if(data != null){
//	    		var gridData = $('#'+detailGridId).alopexGrid("dataGet");
//	    		var lastIndex = gridData[gridData.length-1]._index.row;
	    		var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.row;
	    		
	    		$('#'+detailGridId).alopexGrid('dataAdd', data, {_index : {data : rowIndex}});
	    		$("#"+detailGridId).alopexGrid("startEdit");
	    	}
	    }	  
	});
}

/**
 * Function Name : openETEPop
 * Description   : 서비스회선 ETE 팝업
 */

function openETEPop() {
	var param = {"ntwkLineNo":baseNtwkLineNo};
	
	var urlPath = "/tango-transmission-web";
		
	$a.popup({
		popid: 'serviceLineEtePop',
		title: 'ETE 현황 조회',
		url: urlPath+'/configmgmt/etemgmt/ServiceLineEtePop.do',
		data: param,
		iframe: false,
		windowpopup: true,
		modal : true,
		movable : true,
		width : 1200,
		height : 850,
		callback:function(data){
			/*if(data != null){
//	    		var gridData = $('#'+detailGridId).alopexGrid("dataGet");
//	    		var lastIndex = gridData[gridData.length-1]._index.row;
				var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
				var rowIndex = focusData[0]._index.row;
				
				$('#'+detailGridId).alopexGrid('dataAdd', data, {_index : {data : rowIndex}});
				$("#"+detailGridId).alopexGrid("startEdit");
			}*/
		}	  
	});
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
function setEqpData(param, rowIndex, data, columnList, gridId){
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	for(var i=0; i < columnList.length; i++){
		var columnKey = columnList[i];
		
		// conversion
		var convertKey = columnKey.toLowerCase();
        convertKey = convertKey.replace(/_(\w)/g, function(word) {
            return word.toUpperCase();
        });
		convertKey = convertKey.replace(/_/g, "");
		
		var setValue = false;
		$.each(data, function(key,val){
	 		if(key == convertKey){
	 			$('#'+gridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, param+"_"+columnKey);
	 			setValue = true;
	 		}         		
	 	});
		
		if(!setValue && columnKey != 'ADD_DROP_TYPE_CD'){
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param+"_"+columnKey);
		}
		

	}
}

function checkOpenPopYn(gridId) {
	// 팝업 오픈 여부 판단
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var focusData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	
	var dataObj = AlopexGrid.parseEvent(event);
	var editing = dataObj.$cell.context.classList;
 	var editYn = false;
 	
 	for(var i = 0; i < editing.length; i++) {
 		if(editing[i] == 'editing') {
 			editYn = true;
 		}
 	}
 	
 	if(!editYn && !(focusData._state.editing == false)) {
 		return true;
 	} else {
 		return false;
 	}
}

/**
 * Function Name : addRow
 * Description   : 선번 편집 공통. 그리드 row 추가
 * ----------------------------------------------------------------------------------------------------
 * param    	 : btnShowArray. 편집기능이 활성화 될때 보여줄 버튼 ID 리스트
 *                 btnHideArray. 편집기능이 활성화 될때 숨여야될 버튼 ID 리스트
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function addRow(btnShowArray, btnHideArray) {
	if(nullToEmpty(btnShowArray) != "") {
		for(var show = 0; show < btnShowArray.length; show++) {
			$("#"+btnShowArray[show]).show();
		}
	}
	
	if(nullToEmpty(btnHideArray) != "") {
		for(var hide = 0; hide < btnHideArray.length; hide++) {
			$("#"+btnHideArray[hide]).hide();
		}
	}
	 
	initGridNetworkPathEdit();
	addRowNullData();
	
	// 컬럼 업데이트 모드
	$("#"+detailGridId).alopexGrid("startEdit");
	$('#'+detailGridId).alopexGrid("viewUpdate");
	
	setEqpEventListener();
}

function initGridNetworkPathEdit(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
	var columnEdit = columnMappingNetworkPathEdit();
	$('#'+gridId).alopexGrid("updateOption", {
		rowSingleSelect : false,
		rowInlineEdit: true,
		rowClickSelect : false,
		cellInlineEdit : true,
		cellSelectable : false,		
		multiRowDragDrop: true,
//		headerGroup : headerGroup,
		enableDefaultContextMenu:false,
		enableContextMenu:true,
		contextMenu : [
		               {
							title: cflineMsgArray['lineDelete'],		/* 선번 삭제 */
						    processor: function(data, $cell, grid) {
						    	deletePath(gridId);
						    },
						    use: function(data, $cell, grid) {
						    	return true;
						    }
					   },
					   {
							title: cflineMsgArray['save'],				/* 저장 */
						    processor: function(data, $cell, grid) {
						    	savePath();
						    },
						    use: function(data, $cell, grid) {
						    	return true;
						    }
					   },
					   {
							title: cflineMsgArray['sectionInsert'],		/* 구간 삽입 */
						    processor: function(data, $cell, grid) {
						    	sectionInsert(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		return true;
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['sectionMerge'],		/* 구간 병합 */
						    processor: function(data, $cell, grid) {
						    	sectionMerge(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
						    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
						    			return false;
						    		} else {
						    			return true;
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['sectionSeparation'],		/* 구간 분리 */
						    processor: function(data, $cell, grid) {
						    	sectionSeparation(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
						    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
						    			return false;
						    		} else {
						    			return true;
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   },
					   {
							title: cflineMsgArray['sectionReverse'],	/* 구간 뒤집기 */
						    processor: function(data, $cell, grid) {
						    	reverseLink(data, $cell, gridId);
						    },
						    use: function(data, $cell, grid) {
						    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
						    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
						    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
						    			return false;
						    		} else {
						    			return true;
						    		}
						    	} else {
						    		return false;
						    	}
						    }
					   },
//					   {
//							title: cflineMsgArray['RingSuperSubStaionDirectionConvert'],			/* 링 상하위국 방향전환 */
//						    processor: function(data, $cell, grid) {
//						    	alertBox('W', '2차 개발범위입니다.');
//						    },
//						    use: function(data, $cell, grid) {
//						    	return true;
//						    }
//					   },
//					   {
//							title: cflineMsgArray['portBatchApply'],	/* 포트 일괄적용 */
//						    processor: function(data, $cell, grid) {
//						    	alertBox('W', '2차 개발범위입니다.');
//						    },
//						    use: function(data, $cell, grid) {
//						    	return true;
//						    }
//					   },
					   {
						   	title: cflineMsgArray['wavelength'],		/* 커플러 */
						   	processor: function(data, $cell, grid) {
						    	openCouplerPop(data, $cell, grid);
						    },
						    use: function(data, $cell, grid) {
						    	if( (typeof topoLclCd != "undefined") && topoLclCd == '001') {
						    		if(data._key == 'LEFT_CHANNEL_DESCR') { //  && data.LEFT_NE_ROLE_CD == '16' 
							    		return true;
							    	} else if(data._key == 'RIGHT_CHANNEL_DESCR') { //  && data.RIGHT_NE_ROLE_CD == '16'
							    		return true;
							    	} else {
							    		return false;
							    	}
						    	} else {
						    		return false;
						    	}
						    }
					   }
//					   {
//							title: cflineMsgArray['remark'],		/* 비고 */
//						    processor: function(data, $cell, grid) {
//						    	openEqpRemarkPop(data, $cell, grid);
//						    },
//						    use: function(data, $cell, grid) {
//						    	if(data != null) {
//							    	if(data._key == 'LEFT_NE_NM' || data._key == 'RIGHT_NE_NM') {
//							    		return true;
//							    	} else {
//							    		return false;
//							    	}
//						    	}
//						    }
//					   }
		],
		columnMapping : columnEdit
	});
}

function addRowNullData(gridId) {
	if(gubunValue != "02"){
		if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	
		var addData = {};
		$("#"+gridId).alopexGrid('dataAdd', $.extend({_state:{editing:true}}, addData));
//	$("#"+detailGridId).alopexGrid('dataAdd', $.extend({}, addData));
	}
}

function networkPathBtnStyle(btnId) {
	celStr = '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="' + btnId + '" type="button"></button></div>';
	return celStr;
}

function savePathPrev(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	$("#"+gridId).alopexGrid("endEdit");
	var links = $('#'+gridId).alopexGrid('dataGet');
	
	// 미입력 row 삭제
	var num = links.length;
	for(var i = 0; i < num; i++) {
		if(nullToEmpty(links[i].LEFT_NE_NM) == "" && nullToEmpty(links[i].LEFT_PORT_DESCR) == ""
			&& nullToEmpty(links[i].RIGHT_PORT_DESCR) == "" && nullToEmpty(links[i].RIGHT_NE_NM) == "") {
			var rowIndex = links[i]._index.data;
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
			links.splice(i-num, 1);
		}
	}
	
	return links;
}

function tempDataTrim(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	// 임시 데이터 제거
	var data = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet'));
	for(var i = 0; i < data.length; i++) {
		for(key in data[i]) {
			var temp = String(eval("data[i]."+key)).indexOf('alopex'); 
			if(temp == 0) {
				eval("data[i]."+key + " = ''");
			}
		}
		data[i].LINK_SEQ = (i+1);
	}
	
	return data;
}


/**
 * WDM트렁크 주선번, 예비선번 저장
 */
function saveReserveLinks() {
	var links = savePathPrev(detailGridId);
	var reserveLinks = savePathPrev(reserveGrid);
	
	if(links.length < 1 && reserveLinks.length > 0) {
		alertBox('W', cflineMsgArray['spareLineNoChange']);	/* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
		addRowNullData(detailGridId);
		addRowNullData(reserveGrid);
		
		$("#"+detailGridId).alopexGrid("startEdit");
		$("#"+reserveGrid).alopexGrid("startEdit");
		return;
	}
	
	
	
	if(fnValidation(links) && fnValidation(reserveLinks, 'reserve')){
		// 주 선번
		var rtnNeFlag = true;
		for(var i = 0; i < links.length; i++) {
			// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
			if(i != (links.length -1)) {
				if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
					rtnNeFlag = false;
				}
			}
		}
		
		// 예비 선번 
		var reserveRtnNeFlag = true;
		for(var i = 0; i < reserveLinks.length; i++) {
			// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
			if(i != (reserveLinks.length -1)) {
				if(reserveLinks[i].RIGHT_NE_ID != reserveLinks[i+1].LEFT_NE_ID) {
					reserveRtnNeFlag = false;
				}
			}
		}
		
		
		if(!rtnNeFlag || !reserveRtnNeFlag) {
			callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
				if (msgRst == 'Y') {
//					saveReserve();
					save();
				} else {
					addRowNullData(detailGridId);
					addRowNullData(reserveGrid);
					$("#"+detailGridId).alopexGrid("startEdit");
					$("#"+reserveGrid).alopexGrid("startEdit");
				}
			});
		} else {
//			saveReserve();
			save();
		}
	} else {
		addRowNullData(detailGridId);
		addRowNullData(reserveGrid);
		$("#"+detailGridId).alopexGrid("startEdit");
		$("#"+reserveGrid).alopexGrid("startEdit");
	}
}

/**
 * 선번 저장
 */
function savePath() {
	// WDM트렁크 예비 선번까지 같이 저장
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '003' && topoSclCd == '101') {
		saveReserveLinks();
	} else {
		var links = savePathPrev(detailGridId);
		
		// 데이터 검증
		if(fnValidation(links)){
			// 구간 검증 
			var rtnNeFlag = true;
			for(var i = 0; i < links.length; i++) {
				// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
				if(i != (links.length -1)) {
					if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
						if(links[i].TRUNK_ID == links[i+1].TRUNK_ID || links[i].RING_ID == links[i+1].RING_ID || links[i].WDM_TRUNK_ID == links[i+1].WDM_TRUNK_ID) {
							rtnNeFlag = false;
						}
					}
				}
			}
			
			if(!rtnNeFlag) {
				callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
					if (msgRst == 'Y') {
						save();
					} else {
						addRowNullData();
						$("#"+detailGridId).alopexGrid("startEdit");
					}
				});
			} else {
				save();
			}
			 
		} else {
			addRowNullData();
			$("#"+detailGridId).alopexGrid("startEdit");
		}
	}
}

function save() {
	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	var linePathYn = gridDivision == "serviceLine" ? "Y" : "N";
	
	var data = tempDataTrim();
	var params = {
			"ntwkLineNo" : baseNtwkLineNo,
			"wkSprDivCd" : "01",
			"autoClctYn" : "N",
			"linePathYn" : linePathYn,
			"userId" : userId,
			"utrdMgmtNo" : utrdMgmtNo,
			"links" : JSON.stringify(data),
			"cstrCd" : cstrCd
	};
	
	// 선번그룹일련번호
	// 패킷 회선인 경우 ntwkLnoGrpSrno가 존재.
	// 패킷 회선이 아닌경우 
	//  - 기존 저장 회선일 경우 pathSameNo
	//  - 신규 저장 회선일 경우 null
	ntwkLnoGrpSrno = $('#ntwkLnoGroSrno').val();
	if(ntwkLnoGrpSrno == "" || ntwkLnoGrpSrno == undefined) {
		if(pathSameNo != "") {
			$.extend(params,{"ntwkLnoGrpSrno": pathSameNo});
		} else {
			$.extend(params,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
		}
	} else {
		// 패킷 회선 or 가입자망링 일경우
		$.extend(params,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
	}
	
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001') {
		$.extend(params,{"ringMgmtDivCd": "1"});
	}
	
	cflineShowProgressBody();
	if(gridDivision == "serviceLine") {
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', params, 'POST', 'saveLinePath');
	} else {
		if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '003' && topoSclCd == '101') {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveReserveNetworkPath');
		} else {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPath');
		}
	}
}

/**
 * 선번 삭제
 */
function deletePath(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
	var selectCnt = dataList.length;
	var addYn = false;
	
	if(selectCnt <= 0){
		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
	} else {
//		$('#'+detailGridId).alopexGrid("showProgress");
		dataDeleteCount = 0;
		for(var i = 0; i < dataList.length; i++ ) {
			var data = dataList[i];    		
			var rowIndex = data._index.data;
			if(nullToEmpty(data.TRUNK_ID) == "" && nullToEmpty(data.WDM_TRUNK_ID) == "" && nullToEmpty(data.RING_ID) == ""
				&& nullToEmpty(data.LEFT_NE_ID) == "" && nullToEmpty(data.RIGHT_NE_ID) == "") {
				addYn = true;
			}
			
			dataDeleteCount++;
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
		}
		
		// 전체를 삭제할 경우 row추가
		var list = $('#'+gridId).alopexGrid("dataGet");
		if(list < 1) {
			addRowNullData(gridId);
			$("#"+gridId).alopexGrid("startEdit");
			addYn = false;
		}
		
		if(addYn) {
			addRowNullData(gridId);
			$("#"+gridId).alopexGrid("startEdit");
		}
	}
}

/**
 * 구간 삽입
 */
function sectionInsert(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var addData = {};
	$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
	$("#"+gridId).alopexGrid("startEdit");
}

/**
 * 구간 병합
 */
function sectionMerge(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var dataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	var nextDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
	var mergeYn = false;
	var generateLeft = false;

	if(dataObj.RIGHT_NE_ID == null || dataObj.RIGHT_NE_ID == "" || dataObj.RIGHT_NE_ID == "DV00000000000") {
		// 현재 구간의 우장비가 비었을 경우 다음 구간의 좌장비가 비어야 한다.
		if( (nextDataObj.LEFT_NE_ID == null || nextDataObj.LEFT_NE_ID == "" || nextDataObj.LEFT_NE_ID == "DV00000000000")
				&& (nextDataObj.RIGHT_NE_ID != null && nextDataObj.RIGHT_NE_ID != "" && nextDataObj.RIGHT_NE_ID != "DV00000000000")) {
			mergeYn = true;
			generateLeft = true;
		}
	} else if(dataObj.LEFT_NE_ID == null || dataObj.LEFT_NE_ID == "" || dataObj.LEFT_NE_ID == "DV00000000000") {
		// 현재 구간의 좌장비가 비었을 경우 다음 구간의 우장비가 비어야 한다.
		if( (nextDataObj.RIGHT_NE_ID == null || nextDataObj.RIGHT_NE_ID == "" || nextDataObj.RIGHT_NE_ID == "DV00000000000")
				&& (nextDataObj.LEFT_NE_ID != null && nextDataObj.LEFT_NE_ID != "" && nextDataObj.LEFT_NE_ID != "DV00000000000")) {
			mergeYn = true;
			generateLeft = false;
		}
	}
	
	
	
//	
//	for(var key in rightDataList) {
//		if(key.indexOf(keyParam) == 0) {
//			eval("addData." + key + " = rightDataList." + key);
//		}
//	}
	
	var dataObjList = AlopexGrid.trimData(dataObj);
	var nextDataObjList = AlopexGrid.trimData(nextDataObj); 
	if(mergeYn) {
		var keyParam = "";
		if(generateLeft) {
			// 현재 구간의 좌장비와 다음 구간의 우장비 병합
			keyParam = "RIGHT";
		} else {
			// 현재 구간의 우장비와 다음 구간의 좌장비 병합 
			keyParam = "LEFT";
		}
		
		for(var key in nextDataObjList) {
			if(key.indexOf(keyParam) == 0) {
				$('#'+gridId).alopexGrid( "cellEdit", eval("nextDataObjList."+key), {_index : { row : rowIndex}}, key);
			}
		}
		
		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex+1 }});
	}
	
}

/**
 * 구간 분리
 */
function sectionSeparation(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var gridDataList = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	var addDataList = AlopexGrid.trimData(gridDataList);
	var addData = {};
	
	var keyParam = "RIGHT";
	for(var key in addDataList) {
		if(key.indexOf("RIGHT") == 0) {
			eval("addData." + key + " = addDataList." + key);
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
		}
	}
	
	setLinkDataNull(rowIndex, gridId);
	$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
	$("#"+gridId).alopexGrid("startEdit");
}

/**
 * 구간 뒤집기
 */
function reverseLink(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var reverseYn = true;
	var dataNullYn = true;
	
	if(gridDivision == "serviceLine") {
		reverseYn = (data.TRUNK_MERGE === data.TRUNK_ID || data.TRUNK_MERGE === data.RING_ID || data.TRUNK_MERGE === data.WDM_TRUNK_ID) ? false : true;
	} else if(gridDivision == "trunk") {
		reverseYn = (data.RING_MERGE === data.RING_ID) ? false : true;
	} else if(gridDivision == "ring" || gridDivision == "wdm") {
		reverseYn = (data.WDM_TRUNK_MERGE == data.WDM_TRUNK_ID) ? false : true;
	}
	
	if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "") && ( data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "") ) {
		dataNullYn = false;
	}
	
	if(reverseYn && dataNullYn) {
		for(var key in data) {
			if(key.indexOf("LEFT") == 0) {
				var length = key.length;
				var column = "RIGHT" + key.substring(4, length);
				$('#'+gridId).alopexGrid( "cellEdit", eval("data." + key), {_index : { row : rowIndex}}, column);
			} else if(key.indexOf("RIGHT") == 0) {
				var length = key.length;
				var column = "LEFT" + key.substring(5, length);
				$('#'+gridId).alopexGrid( "cellEdit", eval("data." + key), {_index : { row : rowIndex}}, column);
			} 
		}
		
		if(data.LINK_ID != null) {
			var linkDirection = data.LINK_DIRECTION;
			if(linkDirection == 'RIGHT') {
				$('#'+gridId).alopexGrid( "cellEdit", 'LEFT', {_index : { row : rowIndex}}, 'LINK_DIRECTION');
			} else if(linkDirection == 'LEFT') {
				$('#'+gridId).alopexGrid( "cellEdit", 'RIGHT', {_index : { row : rowIndex}}, 'LINK_DIRECTION');
			}
		}
	} else {
		alertBox('W', cflineMsgArray['notReverseLink']); /* 구간뒤집기를 할수 없습니다. */
	}
	
}

/**
 * 장비 비고
 */
function openEqpRemarkPop(data, $cell, grid) {
	var eqpId = "";
	var eqpKey = "";
		
	if(data._key == "LEFT_NE_NM") {
		eqpId = data.LEFT_NE_ID;
		eqpKey = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		eqpId = data.RIGHT_NE_ID;
		eqpKey = "RIGHT";
	}
	
	if(eqpId == "" || eqpId == null) return;
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	var paramData = {"ntwkLineNo" : baseNtwkLineNo, "eqpSctnId" : data.LINK_ID, "lftEqpRmk" : data.LEFT_NE_REMARK, "rghtEqpRmk" : data.RIGHT_NE_REMARK, "eqpKey" : eqpKey, "division" : gridDivision};
	$a.popup({
	  	popid: "EqpRemarkInfPop" + data._key,
	  	title: '비고',
	  	url: urlPath + '/configmgmt/cfline/EqpRemarkInfPop.do',
	  	data: paramData,
		modal: true,
		movable:true,
		width : 300,
		height : 180,
		callback:function(data){
//			cflineShowProgressBody();
//			if(gridDivision == "serviceLine") {
//				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
//			} else {
//				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
//			}
		}
	});
}

/**
 * 커플러 추가
 */
function openCouplerPop(data, $cell, grid) {
	// 팝업 오픈 여부 판단
	var focusData = AlopexGrid.currentData($('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	var dataObj = AlopexGrid.parseEvent(event);
	var popOpenYn = true;
	
	// 더블클릭이나 엔터로 호출한 경우
	if(dataObj.$cell != undefined) {
		var editing = dataObj.$cell.context.classList;
	 	var editYn = false;
	 	
	 	for(var i = 0; i < editing.length; i++) {
	 		if(editing[i] == 'editing') {
	 			editYn = true;
	 		}
	 	}
	 	
	 	
	 	if(!editYn && !(focusData._state.editing == false)) {
	 		popOpenYn = true;
	 	} else {
	 		popOpenYn = false;
	 	}
	}
	
	if(popOpenYn) {
		var eqpMdlId = "";
		var eqpKey = "";
		var eqpRoleCd = "";
			
		if(data._key == "LEFT_CHANNEL_DESCR") {
			eqpMdlId = data.LEFT_MODEL_ID;
			eqpKey = "LEFT";
		} else if(data._key == "RIGHT_CHANNEL_DESCR") {
			eqpMdlId = data.RIGHT_MODEL_ID;
			eqpKey = "RIGHT";
		} else if(data.mapping.key == "LEFT_CHANNEL_DESCR") {
			eqpMdlId = data.data.LEFT_MODEL_ID;
			eqpKey = "LEFT";
		} else if(data.mapping.key == "RIGHT_CHANNEL_DESCR") {
			eqpMdlId = data.data.RIGHT_MODEL_ID;
			eqpKey = "RIGHT";
		}
		
		var chkEqpMdlId = [
							'DMB0000430', 'DMB0000638', 'DMB0000639', 'DMB0000750', 'DMB0000902', 'DMB0000914',
							'DMB0000917', 'DMB0000918', 'DMB0001098', 'DMB0001108', 'DMB0001109', 'DMB0001125',
							'DMB0001495', 'DMB0001543', 'DMB0001544', 'DMB0001561', 'DMB0001588', 'DMT0001296',
							'DMT0001403', 'DMT0001405', 'DMT0001409', 'DMT0001482', 'DMT0001491', 'DMT0001493',
							'DMT0001494', 'DMT0001496', 'DMT0001497', 'DMT0001498', 'DMT0001499', 'DMT0001500',
							'DMT0001505', 'DMT0001506', 'DMT0001633', 'DMT0001634', 'DMT0002067', 'DMT0002068',
							'DMT0004831', 'DMT0004832', 'DMT0004833', 'DMT0004834', 'DMT0004835', 'DMT0004841',
							'DMT0004842', 'DMT0004843', 'DMT0004844', 'DMT0004845' 
							];
		
		var couplerChk = false;
		for(var i=0; i < chkEqpMdlId.length; i++){
			if(eqpMdlId == chkEqpMdlId[i]) {
				couplerChk = true;
			}
		}
		 
		if(couplerChk) {
			if(eqpMdlId == "" || eqpMdlId == null) {
				alertBox('W', cflineMsgArray['setEqp']);
				return;
			}
			
			var urlPath = $('#ctx').val();
			if(nullToEmpty(urlPath) ==""){
				urlPath = "/tango-transmission-web";
			}
			
			var paramData = {"eqpMdlId" : eqpMdlId};
			$a.popup({
			  	popid: "RingCouplerPop" + eqpKey,
			  	title: '파장 조회',
			  	url: urlPath + '/configmgmt/cfline/RingCouplerPop.do',
			  	data: paramData,
				modal: true,
				movable:true,
				iframe: true,
				windowpopup : true,
				width : 400,
				height : 640,
				callback:function(data){
					if(data != null){
						var channelVal = "";
						channelIds = [];
						for(var i = 0; i < data.length; i++) {
							/*
							if(nullToEmpty(data[i].wavlVal) != "") {
								channelVal += data[i].wavlVal;
							} else if(nullToEmpty(data[i].freqVal) != "") {
								channelVal += data[i].freqVal;
							} else if(nullToEmpty(data[i].chnlVal) != "") {
								channelVal += data[i].chnlVal;
							}
							*/
							
							if(i == 0) channelVal += "("; 
							channelVal += data[i].wavlVal;
							if(i < (data.length-1) && data[i].wavlVal != "") channelVal += "/";
							if(i == data.length-1) channelVal += ")"; 
							
							var temp = {"EQP_MDL_ID" : data[i].eqpMdlId, "EQP_MDL_DTL_SRNO" : data[i].eqpMdlDtlSrno};
							channelIds.push(temp);
						}

						var focusData = AlopexGrid.currentData($('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
						var rowIndex = focusData._index.row;
						$('#'+detailGridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, eqpKey + '_CHANNEL_DESCR');
						$('#'+detailGridId).alopexGrid('cellEdit', channelVal, {_index : { row : rowIndex}}, eqpKey + '_CHANNEL_DESCR');
						$('#'+detailGridId).alopexGrid('cellEdit', channelIds, {_index : { row : rowIndex}}, eqpKey + '_CHANNEL_IDS');
					}
				}
			});
		} else {
			alertBox('W', '파장 추가 불가능한 모델입니다.');
		}
	}
}

/******************************************************************************************
 * fnValidation
 * @param dataList
 * @returns {Boolean}
 * 
 * 
 * 1. 장비 체크 - 검색을 통해서 입력할것.(ID 확인)
 * 2. 포트 체크 - 검색을 통해서 입력할것.(ID 확인) && 필수 입력
 * 3. 사용네트워크의 채널과 채널이 다른 경우 체크
 ******************************************************************************************/
function fnValidation(dataList, reserve) {
	
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

		if( nullToEmpty(lftNeNm) != "" && lftNeId == null) {
			alertBox('W', cflineMsgArray['validationWestNeId']); /* WEST장비를 검색을 통해 조회한 후 등록해주세요. */
			return false;
		} else if( (lftNeId != null && lftNeNm != '' ) ) {
			if( nullToEmpty(lftPortDescr) != "" && (lftPortId == null || lftPortId == "")) {
				alertBox('W', cflineMsgArray['validationWestPortId']); /* WEST포트를 검색을 통해 조회한 후 등록해주세요. */
				return false;
			} else if( (lftPortId == null || lftPortId == '' ) || ( lftPortDescr == null || lftPortDescr == "")) {
//				if((useNtwkId == null || useNtwkId == "") ) {
//					alertBox('W', makeArgMsg("requiredMessage", "'" + lftNeNm + "'의 " + cflineMsgArray['westPort'])); /* 필수 입력 항목입니다.<br>{0} */
//					return false;
//				}
			}
		} 
		
		if( nullToEmpty(rghtNeNm) != "" && rghtNeId == null) {
			alertBox('W', cflineMsgArray['validationEastNeId']); /* EAST장비를 검색을 통해 조회한 후 등록해주세요. */
			return false;
		} else if( (rghtNeId != null && rghtNeNm != '' ) ) {
			if( nullToEmpty(rghtPortDescr) != "" && (rghtPortId == null || rghtPortId == "")) {
				alertBox('W', cflineMsgArray['validationEastPortId']); /* EAST포트를 검색을 통해 조회한 후 등록해주세요. */
				return false;
			} else if( (rghtPortId == null || rghtPortId == '' ) || ( rghtPortDescr == null || rghtPortDescr == "")) {
//				if((useNtwkId == null || useNtwkId == "") ) {
//					alertBox('W', makeArgMsg("requiredMessage", "'" + rghtNeNm + "'의 " + cflineMsgArray['eastPort'])); /* 필수 입력 항목입니다.<br>{0} */
//					return false;
//				}
			}
		}
		
		// 채널
		var channelDescr = dataList[i].LEFT_CHANNEL_DESCR;
		var useChannelDescr = dataList[i].USE_NETWORK_LEFT_CHANNEL_DESCR;
		if(nullToEmpty(channelDescr) != "" && nullToEmpty(useChannelDescr) !=  "" && channelDescr.indexOf(useChannelDescr) != 0) {
			alertBox('W', '채널을 확인해주세요.'); /* 채널을 확인해주세요. */
			return false;
		}
	}
	
	// 링일 경우 validation 체크 : 상위 WEST, 하위 EAST 동일 장비 미 입력시 저장 불가
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001') {
		var length = dataList.length;
		// 첫 구간
		if(getDefaultString(dataList[0].LEFT_NE_ID, "DV00000000000") != getDefaultString(dataList[length-1].RIGHT_NE_ID, "DV00000000000")) {
			alertBox('W', '상위 WEST장비와 하위EAST장비는 동일해야합니다.');
			return false;
		}  
	}	
	
	return true;
}

function getDefaultString(str1, str2) {
	var returnValue = "";
	if(str1 == str2 || str1 == null) {
		returnValue = ""; 
	} else {
		returnValue = str1;
	}
    return returnValue;
}

var httpRequestNetworkPath = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url,			//URL 기존 처럼 사용하시면 됩니다.
		data : Param,		//data가 존재할 경우 주입
		method : Method,	//HTTP Method
		flag : Flag
	}).done(successCallback)
	  .fail(failCallback);
}

function successCallback(response, status, jqxhr, flag){
	if(flag.indexOf("selectEqpSctnRghtInf") == 0) {
		// 장비구간의 우장비 정보 조회
		if(response.eqpSctnRghtInf != undefined) {
			var currGridId = flag.replace("selectEqpSctnRghtInf", "");
			var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
			var rowIndex = focusData._index.row;
			var addDataList = [];
			
			for(var i = 0; i < response.eqpSctnRghtInf.length; i++) {
				var addData = {};
				for(var key in response.eqpSctnRghtInf[i]) {
					eval("addData." + key + " = response.eqpSctnRghtInf[i]." + key);
				}
				addDataList.push(addData);
			}
			
			if(!addDataList[0].generateLeft) {
				// 우장비부터 시작
				for(var i = 0; i < addDataList.length; i++) {
					if(i == 0) {
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpId, {_index : { row : rowIndex+i}}, "RIGHT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpNm, {_index : { row : rowIndex+i}}, "RIGHT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortId, {_index : { row : rowIndex+i}}, "RIGHT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortNm, {_index : { row : rowIndex+i}}, "RIGHT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoId, {_index : { row : rowIndex+i}}, "RIGHT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoNm, {_index : { row : rowIndex+i}}, "RIGHT_ORG_NM");
					} else if(i == addDataList.length-1) {
						// 마지막 구간은 무조건 왼쪽만
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpId, {_index : { row : rowIndex+i}}, "LEFT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpNm, {_index : { row : rowIndex+i}}, "LEFT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortId, {_index : { row : rowIndex+i}}, "LEFT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortNm, {_index : { row : rowIndex+i}}, "LEFT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoId, {_index : { row : rowIndex+i}}, "LEFT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoNm, {_index : { row : rowIndex+i}}, "LEFT_ORG_NM");
					} else {
						// 그 외는 다
						var addData = {};
						$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+i}});
						
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpId, {_index : { row : rowIndex+i}}, "LEFT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpNm, {_index : { row : rowIndex+i}}, "LEFT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortId, {_index : { row : rowIndex+i}}, "LEFT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortNm, {_index : { row : rowIndex+i}}, "LEFT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoId, {_index : { row : rowIndex+i}}, "LEFT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoNm, {_index : { row : rowIndex+i}}, "LEFT_ORG_NM");
						
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpId, {_index : { row : rowIndex+i}}, "RIGHT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpNm, {_index : { row : rowIndex+i}}, "RIGHT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortId, {_index : { row : rowIndex+i}}, "RIGHT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortNm, {_index : { row : rowIndex+i}}, "RIGHT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoId, {_index : { row : rowIndex+i}}, "RIGHT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoNm, {_index : { row : rowIndex+i}}, "RIGHT_ORG_NM");
					}
				}
			} else {
				// 좌장비부터 시작 
				var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
				var rightDataList = AlopexGrid.trimData(focusData);
				var keyParam = "RIGHT";
				var addData = {}
				for(var key in rightDataList) {
    				if(key.indexOf(keyParam) == 0) {
						eval("addData." + key + " = rightDataList." + key);
    				}
				}
				
				for(var i = 0; i < addDataList.length; i++) {
					if(i == 0) {
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpId, {_index : { row : rowIndex+i}}, "LEFT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpNm, {_index : { row : rowIndex+i}}, "LEFT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortId, {_index : { row : rowIndex+i}}, "LEFT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortNm, {_index : { row : rowIndex+i}}, "LEFT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoId, {_index : { row : rowIndex+i}}, "LEFT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoNm, {_index : { row : rowIndex+i}}, "LEFT_ORG_NM");
						
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpId, {_index : { row : rowIndex+i}}, "RIGHT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpNm, {_index : { row : rowIndex+i}}, "RIGHT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortId, {_index : { row : rowIndex+i}}, "RIGHT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortNm, {_index : { row : rowIndex+i}}, "RIGHT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoId, {_index : { row : rowIndex+i}}, "RIGHT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoNm, {_index : { row : rowIndex+i}}, "RIGHT_ORG_NM");
					} else if(i == addDataList.length-1) {
						$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+i}});
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpId, {_index : { row : rowIndex+i}}, "LEFT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpNm, {_index : { row : rowIndex+i}}, "LEFT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortId, {_index : { row : rowIndex+i}}, "LEFT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortNm, {_index : { row : rowIndex+i}}, "LEFT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoId, {_index : { row : rowIndex+i}}, "LEFT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoNm, {_index : { row : rowIndex+i}}, "LEFT_ORG_NM");
					} else {
						var addEmptyData = {};
						$("#"+currGridId).alopexGrid('dataAdd', addEmptyData, {_index:{row:rowIndex+i}});
						
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpId, {_index : { row : rowIndex+i}}, "LEFT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftEqpNm, {_index : { row : rowIndex+i}}, "LEFT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortId, {_index : { row : rowIndex+i}}, "LEFT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftPortNm, {_index : { row : rowIndex+i}}, "LEFT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoId, {_index : { row : rowIndex+i}}, "LEFT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].lftTopMtsoNm, {_index : { row : rowIndex+i}}, "LEFT_ORG_NM");
						
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpId, {_index : { row : rowIndex+i}}, "RIGHT_NE_ID");		
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtEqpNm, {_index : { row : rowIndex+i}}, "RIGHT_NE_NM");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortId, {_index : { row : rowIndex+i}}, "RIGHT_PORT_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtPortNm, {_index : { row : rowIndex+i}}, "RIGHT_PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoId, {_index : { row : rowIndex+i}}, "RIGHT_ORG_ID");
						$('#'+currGridId).alopexGrid( "cellEdit", addDataList[i].rghtTopMtsoNm, {_index : { row : rowIndex+i}}, "RIGHT_ORG_NM");
					}
				}
			}
			 
			$("#"+currGridId).alopexGrid("startEdit");	

			// row 추가
			var lastRowIndex = $('#'+currGridId).alopexGrid("dataGet").length;
			var lastData = $('#'+currGridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
			
			if((lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
				|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
				|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
				addRowNullData(currGridId);
				$("#"+currGridId).alopexGrid("startEdit");
			}
		}
	} else if(flag == "saveReserveNetworkPath") {
		// WDM 트렁크 예비 선번포함
		if(response.PATH_RESULT) {
			var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
			
			var data = tempDataTrim(reserveGrid);
			var reserveParams = {
					"ntwkLineNo" : baseNtwkLineNo,
					"wkSprDivCd" : "02",
					"autoClctYn" : "N",
					"linePathYn" : "N",
					"userId" : userId,
					"utrdMgmtNo" : utrdMgmtNo,
					"links" : JSON.stringify(data)
			};
			$.extend(reserveParams,{"ntwkLnoGrpSrno": reservePathSameNo});
			
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', reserveParams, 'POST', 'saveNetworkPath');
		} else {
			alertBox('W', response.PATH_ERROR_MSG);
			addRowNullData(detailGridId);
			addRowNullData(reserveGrid);
			$("#"+detailGridId).alopexGrid("startEdit");
			$("#"+reserveGrid).alopexGrid("startEdit");
		}
	} else if(flag == "saveNetworkPath" || flag == "saveLinePath") {
		// 네트워크, 서비스 저장 후
		cflineHideProgressBody();
		
		if(response.PATH_RESULT) {
			if(flag == "saveLinePath") {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearchSaveAfter');
			} else {
//				var dataList = $('#'+detailGridId).alopexGrid("dataGet");
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchSaveAfter');
			}
			
		} else {
			alertBox('W', response.PATH_ERROR_MSG);
			addRowNullData();
			$("#"+detailGridId).alopexGrid("startEdit");
		}
	} else if(flag == "C00030") {
		// 링 상하위
		westNodeRole = response;
		eastNodeRole = response;
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
	} else if(flag == "C00967") {
		// 회선 상하위
		westNodeRole = response;
		eastNodeRole = response;
		
		if($('#chkDisplayDeletedLineSctn').is(':checked')){
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePathIncludeDelete', params, 'GET', 'linePathSearchIncludeDelete');
		}
		else{
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
		}
	} else if(flag == "C00542") {
		// WDM 사용용도
		westPortUseType = response;
		eastPortUseType = response;
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
	} else if(flag == "linePathSearch" || flag == "linePathSearchIncludeDelete" || flag == "networkPathSearch") {
		// 네트워크, 서비스 조회 후
		gridHidColSet();
		cflineHideProgressBody();
		
		var ringYn = false;
		if(flag == "networkPathSearch" && topoLclCd == '001' && topoSclCd == '031') {
			// 가입자망링
			$("#wkSpr").show();
			
			if(!$('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
				if(openGridId != "dataGridWork") {
					$("#btnLineInsert").hide();
				}
			}
			
			ringYn = true;
		}
		
		if(response.data != undefined) {
			pathSameNo = response.data.PATH_SAME_NO;
			$('#'+detailGridId).alopexGrid('dataSet', response.data.LINKS);
//			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
		}
		else{
			$('#'+detailGridId).alopexGrid('dataEmpty');
		}
		
		eqpMdlPortRule = response.eqpMdlPortRule;
		
		// 가입자망링 일 때 선번ID 표시
		if(ringYn && flag == "networkPathSearch") {
			if(response.ntwkLnoGrpSrno != undefined) {
				// 선번이 존재
				$("#ntwkLnoGroSrno").remove();
				var selectHtml = "<select id = 'ntwkLnoGroSrno' name = 'ntwkLnoGroSrno' class='divselect'>";
				for(var i = 0; i < response.ntwkLnoGrpSrno.length; i++) {
					var optionHtml = "<option value='" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "'";
					if(pathSameNo == response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno) optionHtml += " selected=true ";
					optionHtml += ">" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "</option>";
					selectHtml += optionHtml;
				}
				
				selectHtml += "</select>";
				$("#wkSprlabel").append(selectHtml);
				
				// select change시 저장해야 될 ID
				setPrevNtwkLnoGrpSrno(pathSameNo);
			} else {
				// 선번이 존재하지 않아서 기본 1로 설정
				$("#ntwkLnoGroSrno").remove();
				var selectHtml = "<select id = 'ntwkLnoGroSrno' name = 'ntwkLnoGroSrno' class='divselect'>";
				selectHtml += "<option value='1' selected=true>1</option>";
				selectHtml += "</select>";
				$("#wkSprlabel").append(selectHtml);
				
				// select change시 저장해야 될 ID
				setPrevNtwkLnoGrpSrno("1");
			}
			
			// select change 이벤트 바인딩
			ntwkLnoGrpSrnoChangeEvent();
		}
		
		// 엑셀 다운로드를 위한 기본정보 저장
		baseInfData.svlnLclSclCdNm = baseInfData.svlnLclCdNm + " - " + baseInfData.svlnSclCdNm;
		$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
//		$('#'+baseGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
		
		if(openGridId == "dataGridWork") {
    		var btnHideArray = ['btnRegEqp'];
    		addRow("", btnHideArray);
			$("#"+detailGridId).alopexGrid("startEdit");
			gridHidColSet();
		}
	} else if(flag == "linePathSearchSaveAfter" || flag == "networkPathSearchSaveAfter" || flag == "networkPathSearchSelectChangeAfter") {
		// 선번 저장 후 리로딩을 위해 저장 후 재조회 한 후					: linePathSearchSaveAfter, networkPathSearchSaveAfter)
		// SELECT CHANGE를 통해 데이터 저장 후 현재 선택된 선번을 가져 온 뒤 	: networkPathSearchSelectChangeAfter
		
		if(response.data != undefined) {
			pathSameNo = response.data.PATH_SAME_NO;
			$('#'+detailGridId).alopexGrid('dataSet', response.data.LINKS);
//			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
		} 
		
		if(flag != "networkPathSearchSelectChangeAfter") {
			alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
		} else {
			setPrevNtwkLnoGrpSrno(pathSameNo);
		}
		
		cflineHideProgressBody();
		addRowNullData();
		$("#"+detailGridId).alopexGrid("startEdit");
		
		if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '003' && topoSclCd == '101') {
			reserveNetworkPath(true);
		}
	} else if(flag == "saveNetworkPathLineInsertAfter") {
		// 선번 생성 버튼을 통해 그리드의 데이터를 저장 한 후 MAX 선번 아이디를 가져 온다
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectMaxNtwkLnoGrpSrno', params, 'POST', 'selectMaxNtwkLnoGrpSrno');
	} else if(flag == "saveNetworkPathSelectChangeAfter") {
		// SELECT CHANGE를 통해서 그리드의 데이터를 저장 한 후 
		params = {
				"ntwkLineNo" : baseNtwkLineNo, 
				"utrdMgmtNo" : utrdMgmtNo,
				"ntwkLnoGrpSrno" : $('#ntwkLnoGroSrno').val()
		};
		
		$('#'+detailGridId).alopexGrid('dataEmpty');
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchSelectChangeAfter');
	} else if(flag == "selectMaxNtwkLnoGrpSrno") {
		// MAX 선번 아이디를 가지고 온 뒤
		cflineHideProgressBody();
		var ntwkLnoGrpSrno = response.ntwkLineNo;
		
		var optionHtml = "<option value='" + ntwkLnoGrpSrno + "' selected='selected'>" + ntwkLnoGrpSrno + "</option>";
		var addYn = true;
		
		$("#ntwkLnoGroSrno").find("option").each(function() {
			if(ntwkLnoGrpSrno == this.value) {
				addYn = false;
			} 
		})
		
		if(addYn) {
			$("#ntwkLnoGroSrno").append(optionHtml);
		}
		
		$('#'+detailGridId).alopexGrid('dataEmpty');
		addRowNullData();
		$("#"+detailGridId).alopexGrid("startEdit");
		
		// select change 이벤트 바인딩
//		ntwkLnoGrpSrnoChangeEvent();
		
		// select change 할때 이전
		setPrevNtwkLnoGrpSrno(ntwkLnoGrpSrno);
	}
	else if(flag == "updateLnAvlbUtrdTermDtlComplete"){
		alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/		
				
		//선번작업완료여부 : 선번편집불가, 
		if(remvObjRlesYn == "Y"){
			//선번편집완료
			$("#btnPathComplete").text('선번편집취소');
			//선번편집
			$("#btnRegEqp").hide();
			//선번삭제
			$("#btnPathDelete").hide();
			//선번저장
			$("#btnSave").hide();
		}
		else{
			//선번편집완료
			$("#btnPathComplete").text('선번편집완료');					
			//공사완료여부 : 선번편집 가능, 선번편집완료 불가
			if(eqpRlesYn == "Y"){
				//선번편집
				$("#btnRegEqp").show();
				//선번삭제
				$("#btnPathDelete").hide();
				//선번저장
				$("#btnSave").hide();
			}
			else{
				//선번편집
				$("#btnRegEqp").hide();
			}
		}
	}
}

// 선번 ID SELECT CHANGE EVENT
function ntwkLnoGrpSrnoChangeEvent() {
	$("#ntwkLnoGroSrno").change(function(e) {
		var selectedValue = $(this).val();
		$("#ntwkLnoGroSrno").find("option").each(function() {
			if(selectedValue == this.value) {
				$(this).attr('selected', 'selected');
			} else {
				$(this).removeAttr('selected');
			}
		});
		
		
		if(openGridId == "dataGridWork" || $('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
			callMsgBox('','I', cflineMsgArray['saveCurrntPath'], function(msgId, msgRst){
        		if (msgRst == 'Y') {
//        			cflineShowProgressBody();
        			
        			// 현재 선번 저장
        			var links = savePathPrev();
        			var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
        			var linePathYn = gridDivision == "serviceLine" ? "Y" : "N";
        	 
        			// 그리드의 삭제 데이터 건수가 없을 경우 '요청할 데이터가 없습니다'라는 문구가 뜨게 되는데 
        			// 신규로 추가된 선번ID에서 데이터가 없을 경우에는 선번ID를 삭제해줘야되기때문에 삭제 카운트를 임의로 1로 둔다.
        			dataDeleteCount = 1;
        			if(fnValidation(links)){
        				if(links.length == 0) {
        					$("#ntwkLnoGroSrno").find("option").each(function() {
        						if(prevNtwkLnoGrpSrno == this.value) {
        							$("#ntwkLnoGroSrno option[value='" + this.value + "'").remove();
//        							$("#ntwkLnoGroSrno option:eq(0)").attr("selected", "selected");
        						}
        					});
        					
        					params = {
        							"ntwkLineNo" : baseNtwkLineNo, 
        							"utrdMgmtNo" : utrdMgmtNo,
        							"ntwkLnoGrpSrno" : $('#ntwkLnoGroSrno').val()
        					};
        					
        					cflineShowProgressBody();
        					$('#'+detailGridId).alopexGrid('dataEmpty');
        					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchSelectChangeAfter');
        				} else {
        					// 구간 검증 
        					var rtnNeFlag = true;
        					for(var i = 0; i < links.length; i++) {
        						// EAST장비와 다음구간 WEST장비가 다른 경우 경고창. 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?'
        						if(i != (links.length -1)) {
        							if(links[i].RIGHT_NE_ID != links[i+1].LEFT_NE_ID) {
        								rtnNeFlag = false;
        							}
        						}
        					}
        					
        					var data = tempDataTrim();
        					var params = {
        							"ntwkLineNo" : baseNtwkLineNo,
        							"wkSprDivCd" : "01",
        							"autoClctYn" : "N",
        							"linePathYn" : linePathYn,
        							"userId" : userId,
        							"utrdMgmtNo" : utrdMgmtNo,
        							"links" : JSON.stringify(data)
        					};
        					$.extend(params,{"ntwkLnoGrpSrno": prevNtwkLnoGrpSrno});
        					
        					if(!rtnNeFlag) {
        						callMsgBox('','C', 'EAST 장비와 다음 구간 WEST 장비는 동일해야 하는데 다릅니다. 그래도 저장하시겠습니까?', function(msgId, msgRst) {
        							if (msgRst == 'Y') {
        								cflineShowProgressBody();
        								httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathSelectChangeAfter');
        							} else {
        								addRowNullData();
        								$("#"+detailGridId).alopexGrid("startEdit");
        							}
        						});
        					} else {
        						cflineShowProgressBody();
        						httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPathSelectChangeAfter');
        					}
        				}
        			}
        		}
        	});
		} else {
			cflineShowProgressBody();
			params = {
					"ntwkLineNo" : baseNtwkLineNo, 
					"utrdMgmtNo" : utrdMgmtNo,
					"ntwkLnoGrpSrno" : $('#ntwkLnoGroSrno').val()
			};
			
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
		}
	});
}

// 
function setPrevNtwkLnoGrpSrno(tempValue) {
	prevNtwkLnoGrpSrno = tempValue;
//	$("#temp").val(prevNtwkLnoGrpSrno);
}

// LINK_VISIBLE
function filterVisibleLink( data ) {
	if (data === null || nullToEmpty(data.LINK_VISIBLE) == "" ) {
	    return false;
	}
	return data.LINK_VISIBLE;
}

// WDM 트렁크 LINK_VISIBLE
function filterVisibleWdmRow( data ) {
	if (data === null || data.WDM_ROW_FILTER === null || data.WDM_ROW_FILTER === undefined ) {
	    return false;
	}
	return data.WDM_ROW_FILTER;
}

// 트렁크 LINK_VISIBLE
function filterVisibleTrunkRow( data ) {
	if (data === null || data.TRUNK_ROW_FILTER === null || data.TRUNK_ROW_FILTER === undefined ) {
	    return false;
	}
	return data.TRUNK_ROW_FILTER;
}

function failCallback(response, status, jqxhr, flag){
	if(flag == 'networkPathSearch' || flag == 'linePathSearch'){
		cflineHideProgressBody();
		alertBox('W', cflineMsgArray['searchFail']);  /* 조회 실패 하였습니다. */
	}
}

/******************************************************************************************
 * 그리드 컬럼 셋팅
 * 1. 서비스회선
 *     - RU회선(003) - RU(103)						: 트렁크, WDM트렁크 숨기기
 *     - RU회선(003) - 중계기(광코어)(101), WIFI(102) 	: 트렁크, 링, WDM트렁크 숨기기
 *     - 가입자망회선(004)								: 트렁크, WDM트렁크 숨기기
 *     - 기지국회선	(001)								: WDM트렁크 숨기기
 * 2. 링 - 가입자망링(001/031)							: 트렁크, WDM트렁크 숨기기
 *******************************************************************************************/
function gridHidColSet() {
	if(gridDivision == "serviceLine") {
		if(nullToEmpty(svlnLclCd) == "003" && nullToEmpty(svlnSclCd) == "103") {
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
		} else if(nullToEmpty(svlnLclCd) == "003" && (nullToEmpty(svlnSclCd) == "101" || nullToEmpty(svlnSclCd) == "102")) {
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM'];
		} else if(nullToEmpty(svlnLclCd) == "004") {
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
		} else if(nullToEmpty(svlnLclCd) == "001") {
			$('#'+detailGridId).alopexGrid('hideCol', ['WDM_TRUNK_NM']);
			hideCol = ['WDM_TRUNK_NM'];
			$("#wdmTrunkDisplayCheckbox").hide();
		}
	} else if(gridDivision == "ring"){
		if(nullToEmpty(topoLclCd) == "001" && nullToEmpty(topoSclCd) == "031") {
			$('#'+detailGridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			hideCol = ['TRUNK_NM', 'WDM_TRUNK_NM'];
			$("#trunkDisplayCheckbox").hide();
			$("#wdmTrunkDisplayCheckbox").hide();
		}
	}
}