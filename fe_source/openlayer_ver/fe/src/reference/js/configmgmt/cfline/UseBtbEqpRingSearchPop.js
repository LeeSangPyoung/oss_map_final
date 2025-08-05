/**
 * UseBtbEqpRingSearchPop.js
 *
 * @date 2021.04.14
 * 
 * 
 */
var mainGridId = 'mainGrid';
var lnoGridId = 'lnoGrid';
var addData = false;
var useRingId = '';
var editRingTopoSclCd = '';  // 편집중일 링의 망종류
var editViewVisualYn = 'N';  // 구선번 편집(N)/ 시각화 편집(Y)
var editYn = null;

var tmofCd = "";
var searchTopoLclType = "";    // 조회할 선번의 네트워크 타입(RING, RONT_TRK) 
var searchTopoSclCd = "";  // 조회할 선번의 망종류 코드(RING의 망종류)
var searchTopoCfgMeansCd = "";  // 조회할 선번의 토폴로지구성방식코드(PTP만 자동 ADD/DROP)
var baseTopoSclCdListForRing = [];
var pathData = [];
var onLoadPathInfo = false;

var selectedRingId = "";  // 선택한 링의 id
var ringAddDropData = null;  // 선택한 데이터 값
var setRingAddDropDataYn = false;  // 데이터 셋팅여부
var handelAddDropPop = null; // 팝업 Close용 핸들러

var paramData = null;

// 선택한 서비스회선 번호
var networkInfo = ['NETWORK_ID', 'NETWORK_NM', 'NETWORK_STATUS_CD', 'NETWORK_STATUS_NM', 'PATH_DIRECTION', 'PATH_SAME_NO', 'PATH_SEQ', 'TOPOLOGY_LARGE_CD', 'TOPOLOGY_LARGE_NM', 'TOPOLOGY_SMALL_CD', 'TOPOLOGY_SMALL_NM', 'TOPOLOGY_CFG_MEANS_CD', 'TOPOLOGY_CFG_MEANS_NM'];
$a.page(function() {
	
	this.init = function(id, param) {

		editViewVisualYn = nullToEmpty(param.editViewVisualYn);  // 구선번 편집(N)/ 시각화 편집(Y)
		editYn = nullToEmpty(param.editYn);
		
		$('#info').show();
		$('#btnSearch').show();
		$('#popTitle').text("전송망링 조회팝업");
		$('#popSubTitle').text("전송망링 조회");
		
		$('#directionOne').setSelected();
			
		addData = false;
    	setEventListener();
    	// 선택버튼비활성화
    	$('#btnConfirmPop').setEnabled(false);

    	fnSearch("main", true, param);
    };
});


//검색
function fnSearch(sType, changeSearch, param) {
	// 기본정보 검색
	if(sType == "main") {
		setRowIndexInfo(changeSearch);
	} 
	// 선번검색
	else if(sType == "lno") {
		setRowIndexWork(changeSearch);
	}	
	cflineShowProgressBody();

	if(param != "") {
		$("#orgId").val(param.orgId);
	}

	var dataParam = $("#searchForm").serialize();

	if (sType == "main") {
		$('#basicTabs').setTabIndex(0);
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/useringronttrunk/getusebtbeqpring', dataParam, 'GET', 'searchMain');

	} else if (sType == "lno") {
		$('#'+lnoGridId).alopexGrid('dataEmpty');
		$('#basicTabs').setTabIndex(1);
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/useringronttrunk/getusebtbeqpringpath', param, 'GET', 'searchLno');
	}
}

function setEventListener() {
	
	$('#basicTabs').on("tabchange", function(e, index) {
		//var arrow_more_on = $(".arrow_more.on").length;    
		
    	var selectTab = parseInt($('#basicTabs').getCurrentTabIndex());
    	switch (selectTab) {
			case 0 :    // 목록
				$('#'+mainGridId).alopexGrid("viewUpdate");
				break;
			case 1 :    // 선번
				$('#'+lnoGridId).alopexGrid("viewUpdate");				
				$('#directionDiv').show();
				$('#autoAddDropCheckbox').show();
				$('#addDropProc').setChecked(true);
				
				// 만약 링의선번조회용인경우
				if (nullToEmpty(useRingId) != "") {
					// 역방향인경우
					if ($('#directionTwo').is(":checked") == true) {
						var dataList = AlopexGrid.trimData(pathData);
				   		var rePathData = [];
				   		
					 	if(onLoadPathInfo == true) {
					 		rePathData = reverseData(pathData);
				   	 		rePathData.reverse();
				   	 		pathData = rePathData;
				   	 		$('#'+lnoGridId).alopexGrid('dataSet', rePathData);
				   	 		$("#"+lnoGridId).alopexGrid("viewUpdate");
				   	 	    onLoadPathInfo = true; 
					 	}
					}
				}
				break;
			default :
				break;
    	}
    	setConfirmView();
	});
	
 	// 엔터 이벤트 
 	$('#searchForm').on('keydown', function(e){
 		if (e.which == 13){
 			addData = false;
 			fnSearch("main", true,"");
 	    	$('#btnConfirmPop').setEnabled(true);
		}
 	});	      	
 
 	
 	//조회버튼 클릭시
    $('#btnSearch').on('click', function(e) {
    	fnSearch("main", true,"");
    	$('#btnConfirmPop').setEnabled(true);
    });


    //경유링조회팝업 스크롤 이동시
    $('#'+mainGridId).on('scrollBottom', function(e){
        addData = true;
   		fnSearch("main", false, "");
	});   
    
    //경유링 상세 목록 조회팝업(선번)
    $('#'+mainGridId).on('dblclick', '.bodycell', function(e){
    	var dataObj = AlopexGrid.parseEvent(e).data;
	 	var dataKey = dataObj._key; 
	 	var ntwkLnoGrpSrno = dataObj.ntwkLnoGrpSrno;
	 	
		if (ntwkLnoGrpSrno == undefined){
			ntwkLnoGrpSrno = null;
		}
		
		searchTopoSclCd = dataObj.topoSclCd;
		searchTopoCfgMeansCd = dataObj.topoCfgMeansCd;
		
		selectedRingId = (nullToEmpty(dataObj.topoLclCd) == "001" ? dataObj.ntwkLineNo : null);
    	var param = {
    						"gridId" : lnoGridId
    						, "ntwkLineNo": dataObj.ntwkLineNo
    						, "topoLclCd" : dataObj.topoLclCd
    						, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno
    						, "ringMgmtDivCd" : (nullToEmpty(dataObj.topoLclCd) == "001" ? "1" : null)
    						, "wkSprDivCd" : "01"
    						, "autoClctYn" : "N"	
    						};
    	$('#directionOne').setSelected();
    	fnSearch("lno", true, param);
    });
 	
	// 닫기
	$('#btnClosePop').on('click', function(e) {		
		$a.close();    	
    });
	
	// 그룹단위로 처리하기 위해
	var rowDragDropYn = true;
		
	// 기간망 트렁크의 링단위 이동
	$('#'+lnoGridId).on('rowDragOver', function(e) {
		
		var evObj = AlopexGrid.parseEvent(e);
		var dragData = evObj.dragDataList[0];  // 드래그로 이동중인 데이터
		
		if (nullToEmpty(dragData.RING_ID) != "") {
			var selectCnt = $('#'+lnoGridId).alopexGrid("dataGet", {_state : { selected : true }}).length;
			var ringCnt = $('#'+lnoGridId).alopexGrid("dataGet", {'RING_ID' :dragData.RING_ID}).length;
			if (selectCnt < ringCnt) {
				$('#'+lnoGridId).alopexGrid("rowSelect", {'RING_MERGE' :dragData.RING_MERGE}, true);
				rowDragDropYn = false;
				
				return false;
			}
		}
		
		// 다건이어야할 드레그 이벤트의 경우
		if (rowDragDropYn == false && evObj.dragDataList.length == 1) {
			return false;
		}
	});
	
	// 기간망 트렁크의 링단위 이동
	$('#'+lnoGridId).on('rowDragDrop', function(e) {
		
		var evObj = AlopexGrid.parseEvent(e);
		
		if (rowDragDropYn == false) {
			rowDragDropYn = true;
			return false;
		}
	});
		
	// 기간망 트렁크의 링단위 이동
	$('#'+lnoGridId).on('rowDragDropEnd', function(e) {
		var evObj = AlopexGrid.parseEvent(e);
		if (rowDragDropYn == true) {
			$('#'+lnoGridId).alopexGrid("rowSelect", {_state : { selected : true }}, false);
		}
	});
	
	// 선택 
	$('#btnConfirmPop').on('click', function(e) {
		setRingAddDropDataYn = false;
		/**
		 * 기간망의 경유 PTP링의 경우 ADD/DROP없이 직접 사용링 처리 하기 때문에 연결되지 않은 링도 사용링으로 사용될수 있음
		 */
		ringAddDropData = [];
		var teamsRingPath = [];
		var dataList =  $('#'+lnoGridId).alopexGrid("dataGet");
		var mainDataList =  $('#'+mainGridId).alopexGrid("dataGet");
		
		if (mainDataList.length == 0) {
			alertBox('W', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
			return;
		}		
		
		// ADD/DROP 자동설정을 체크하지 않은 경우 ADD/DROP 설정화면
		if ( $('#addDropProc').is(':checked') == false)
		{
			// 구선번 편집
			if (editViewVisualYn == "N") {
				addDropPopOld();
			} 
			// 시각화 편집
			else if (editViewVisualYn == "Y") {
				addDropPopNew();
			} 
			// 기본 구선번
			else {
				addDropPopOld();
			}	
		}
		else if(dataList.length >= 1){	

			// 서비스회선정보 구선번편집 화면에서 사용가능하도록 수정
			var division = "";
	   		var pathDirection = 'RIGHT';
	   		
	   		var bfRingId = "";
	   		var tmpPathList = [];
	   		// 사용링 처리
	   		var ringLvl = "1";
			for(var i = 0; i < dataList.length; i++) {
				
				if (bfRingId != nullToEmpty(dataList[i].RING_ID) && bfRingId != "" && searchTopoLclType == "RONT_TRK") {
					teamsRingPath.push({"LINKS" : tmpPathList, "USE_NETWORK_PATHS" : []});
					tmpPathList = [];
				} 
				if(i == 0){
					// ADD 구간 정보 셋팅
					ringAddDropData.push(addDropEqpSet(dataList[i],  "A"));
					// 시각화용
					tmpPathList.push(ringAddDropData[ringAddDropData.length-1]);
				}

	    		dataList[i].RING_ID = networkInfo[0];
	    		dataList[i].RING_NM = networkInfo[1];
	    		dataList[i].RING_STATUS_CD = networkInfo[2];
	    		dataList[i].RING_STATUS_NM = networkInfo[3];
	    		dataList[i].RING_PATH_SAME_NO = networkInfo[5];
	    		dataList[i].RING_PATH_DIRECTION = $('input:radio[name="direction"]:checked').val();
	    		dataList[i].RING_PATH_SEQ = networkInfo[6];
	    		dataList[i].RING_TOPOLOGY_LARGE_CD = networkInfo[7];
	    		dataList[i].RING_TOPOLOGY_LARGE_NM = networkInfo[8];
	    		dataList[i].RING_TOPOLOGY_SMALL_CD = networkInfo[9];
	    		dataList[i].RING_TOPOLOGY_SMALL_NM = networkInfo[10];
	    		dataList[i].RING_TOPOLOGY_CFG_MEANS_CD = networkInfo[11];
	    		dataList[i].RING_TOPOLOGY_CFG_MEANS_NM = networkInfo[12];

	   			dataList[i].RING_MERGE = null;

	   			if (dataList[i].WDM_TRUNK_ID != null && dataList[i].WDM_TRUNK_ID.indexOf('alopex') == 0) {
	   				dataList[i].WDM_TRUNK_ID = null;
	   			}  		
	   			if (dataList[i].WDM_MERGE != null && dataList[i].WDM_MERGE.indexOf('alopex') == 0) {
	   				dataList[i].WDM_MERGE = null;
	   			} 
				
	    		dataList[i].LEFT_ADD_DROP_TYPE_CD = "T";
	    		dataList[i].RIGHT_ADD_DROP_TYPE_CD = "T";

	    		// 구선버인 경우만해당처리
	    		if (editViewVisualYn == "N") {
		   			dataList[i].USE_NETWORK_ID = dataList[i].RING_ID;
		   			dataList[i].USE_NETWORK_NM = dataList[i].RING_NM;
	    			dataList[i].USE_NETWORK_PATH_SAME_NO = dataList[i].RING_PATH_SAME_NO;
					dataList[i].USE_NETWORK_PATH_DIRECTION = dataList[i].RING_PATH_DIRECTION;
					
					dataList[i].USE_NETWORK_LINK_DIRECTION = dataList[i].LINK_DIRECTION;
	    		}
	    		
	    		dataList[i].RING_LVL = ringLvl;

				ringAddDropData.push(dataList[i]);
				// 시각화용
				tmpPathList.push(dataList[i]);
				
				bfRingId = nullToEmpty(dataList[i].RING_ID);
				
				// 기간망 트렁크이면서 링의 마지막인 경우 혹은 ptp링 혹은 M/W PTP링  이고 마지막구간인경우 DROP 구간
				if ((i+1 == dataList.length)) 
				{
					// DROP 구간
					ringAddDropData.push(addDropEqpSet(dataList[i],  "D"));

					// 시각화용
					//tmpPathList.push(ringAddDropData[ringAddDropData.length-1]);
				}
			}
			
			
			// 시각화용
			teamsRingPath.push({"LINKS" : tmpPathList, "USE_NETWORK_PATHS" : []});
			
			// 팝업닫기위해
			setRingAddDropDataYn = true;
			// 구선번이면 그대로 사용
			if (editViewVisualYn == "N")  {
				setRingData(ringAddDropData);
			}
			// 시각화인 경우 TeamsPath형태로 변환 필요
			else if (editViewVisualYn == "Y") {
				 // 링 단위의 선번정보를 TeamspPath형태로 변경
				for (var j = 0 ; j < teamsRingPath.length; j++) {
					var tmpTangoPath = teamsRingPath[j];
					
					// 시각화용 TeamsPath 형태로 만들기 위해 사용링 정보는 지워주고 해당 정보를 바탕으로 네트워크 정보를 셋팅해 준다.
					for (var z = 0; z < tmpTangoPath.LINKS.length; z++) {
						if (nullToEmpty(tmpTangoPath.LINKS[z].RING_ID) != "") {
							// 각 네트워크별 1번만 네트워크정보를 셋팅해주면 된다.
							if (nullToEmpty(tmpTangoPath.LINKS.NETWORK_ID) == "") {
								tmpTangoPath.NETWORK_ID = tmpTangoPath.LINKS[z].RING_ID;
								tmpTangoPath.NETWORK_NM = tmpTangoPath.LINKS[z].RING_NM;
								tmpTangoPath.NETWORK_STATUS_CD = tmpTangoPath.LINKS[z].RING_STATUS_CD;
								tmpTangoPath.NETWORK_STATUS_NM = tmpTangoPath.LINKS[z].RING_STATUS_NM;
								tmpTangoPath.PATH_DIRECTION = tmpTangoPath.LINKS[z].RING_PATH_DIRECTION;
								tmpTangoPath.PATH_SAME_NO = tmpTangoPath.LINKS[z].RING_PATH_SAME_NO;
								tmpTangoPath.TOPOLOGY_LARGE_CD = tmpTangoPath.LINKS[z].RING_TOPOLOGY_LARGE_CD;
								tmpTangoPath.TOPOLOGY_LARGE_NM = tmpTangoPath.LINKS[z].RING_TOPOLOGY_LARGE_NM;
								tmpTangoPath.TOPOLOGY_SMALL_CD = tmpTangoPath.LINKS[z].RING_TOPOLOGY_SMALL_CD;
								tmpTangoPath.TOPOLOGY_SMALL_NM = tmpTangoPath.LINKS[z].RING_TOPOLOGY_SMALL_NM;
								tmpTangoPath.TOPOLOGY_CFG_MEANS_CD = tmpTangoPath.LINKS[z].RING_TOPOLOGY_CFG_MEANS_CD;
								tmpTangoPath.TOPOLOGY_CFG_MEANS_NM = tmpTangoPath.LINKS[z].RING_TOPOLOGY_CFG_MEANS_NM;
							}
							// 사용링 정보는 모두 삭제해 준다.
							tmpTangoPath.LINKS[z].RING_ID = null;
							tmpTangoPath.LINKS[z].RING_NM = null;
							tmpTangoPath.LINKS[z].RING_STATUS_CD = null;
							tmpTangoPath.LINKS[z].RING_STATUS_NM = null;
							tmpTangoPath.LINKS[z].RING_PATH_DIRECTION = null;
							tmpTangoPath.LINKS[z].RING_PATH_SAME_NO = null;
							tmpTangoPath.LINKS[z].RING_PATH_SEQ = null;
							tmpTangoPath.LINKS[z].RING_TOPOLOGY_LARGE_CD = null;
							tmpTangoPath.LINKS[z].RING_TOPOLOGY_LARGE_NM = null;
							tmpTangoPath.LINKS[z].RING_TOPOLOGY_SMALL_CD = null;
							tmpTangoPath.LINKS[z].RING_TOPOLOGY_SMALL_NM = null;
							tmpTangoPath.LINKS[z].RING_TOPOLOGY_CFG_MEANS_CD = null;
							tmpTangoPath.LINKS[z].RING_TOPOLOGY_CFG_MEANS_NM = null;
						}
					}
					
					var originalTeamsPath = new TeamsPath();
					originalTeamsPath.fromTangoPath(tmpTangoPath);
					originalTeamsPath.PATH_DIRECTION = tmpTangoPath.PATH_DIRECTION;
					//originalTeamsPath.USE_NETWORK_PATHS.push();
					//teamsRingPath[j] = originalTeamsPath.createRingPath();
					teamsRingPath[j] = originalTeamsPath;
				}
				//console.log(teamsRingPath);
				setRingData(teamsRingPath);				
			}
		}else{
			var msgStr = "선택한 링의 선번정보가 없습니다.";
			
			alertBox('W', msgStr);/* 선택된 데이터가 없습니다. */
			return;
		}
	});
	 	
 	$('input:radio[name="direction"]').change(function() {
	 		
   		var dataList = AlopexGrid.trimData(pathData);
   		var rePathData = [];
   		
	 	if(onLoadPathInfo == true) {
	 		rePathData = reverseData(pathData);
   	 		rePathData.reverse();
   	 		pathData = rePathData;
   	 		$('#'+lnoGridId).alopexGrid('dataSet', rePathData);
   	 		$("#"+lnoGridId).alopexGrid("viewUpdate");
   	 	    onLoadPathInfo = true; 
	 	}
	});
}

/**
 * setRingData 선택한 링의 정보를 리턴한다.
 * @param ringAddDropData
 */
function setRingData(ringAddDropData) {	
	if (handelAddDropPop != null) {
		clearInterval(handelAddDropPop);
		handelAddDropPop = null;
	}
	$a.close(ringAddDropData);	
}

/** ADD / DROP 장비 셋팅
 * @param tmpData     add/drop 구간정보
 * @param addDropTyp  add/drop 여부(A : ADD, D : DROP)
 */
function addDropEqpSet(tmpData, addDropTyp) {
	// ADD 정보	   		
		
		var makeData = {};
		for(var key in tmpData) {
			// WEST이면 EAST로 바꾼다.
			if(key.indexOf("LEFT") == 0) {
				var length = key.length;
				var column = "RIGHT" + key.substring(4, length);
				// ADD 구간장비
				if (addDropTyp == "A") {
					eval("makeData." + column + " = tmpData." + key);  // ADD구간 장비의 경우 LEFT장비를 RIGHT장비로 셋팅
				} else {
					eval("makeData." + column + " = null");   // DROP구간  장비인 경우 RIGHT는 NULL
				}				
			} else if (key.indexOf("RING_") == 0) {  // 사용링인경우 삭제
				eval("makeData." + key + " = null");
			} else if (key.indexOf("RIGHT") == 0) {
				var length = key.length;
				var column = "LEFT" + key.substring(5, length);
				// DROP
				if (addDropTyp == "A") {
					eval("makeData." + column + " = null");  // ADD구간 장비의 경우 LEFT는 NULL 셋팅
				} else {
					eval("makeData." + column + " = tmpData." + key);    // DROP구간  장비인 경우 RIGHT장비를 LEFT장비로 셋팅
				}				
			} else if (key.indexOf("USE_NETWORK") == 0) {
				eval("makeData." + key + " = null");  // ADD/DROP장비의 경우 사용네트워크 부분은  null
			} else {
				eval("makeData." + key + " = tmpData." + key);
			}
		}
		
		if (addDropTyp == "A") {
			// 좌장비 ADD_DROP타입설정
			makeData.LEFT_NE_NM = "";
			makeData.LEFT_PORT_NM = "";
			makeData.LEFT_ADD_DROP_TYPE_CD = "N";
			makeData.LEFT_NODE_ROLE_CD = "NA";
            // 우장비 정보 셋팅
			makeData.RIGHT_PORT_DESCR = "";
			makeData.RIGHT_PORT_NM = "";
			makeData.RIGHT_PORT_ID = null;
			makeData.RIGHT_ADD_DROP_TYPE_CD = "A";
			makeData.RIGHT_NODE_ROLE_CD = "NA";
			makeData.RIGHT_RX_NE_ID = null;
			makeData.RIGHT_RX_NE_NM = "";
			makeData.RIGHT_RX_PORT_ID = null;    		
		} else {
			makeData.RIGHT_NE_NM = "";
			makeData.RIGHT_PORT_NM = "";
			makeData.RIGHT_ADD_DROP_TYPE_CD = "N";
			makeData.RIGHT_NODE_ROLE_CD = "NA";
            // 우장비 정보 셋팅
			makeData.LEFT_PORT_DESCR = "";
			makeData.LEFT_PORT_NM = "";
			makeData.LEFT_PORT_ID = null;
			makeData.LEFT_ADD_DROP_TYPE_CD = "D";
			makeData.LEFT_NODE_ROLE_CD = "NA";
			makeData.LEFT_RX_NE_ID = null;
			makeData.LEFT_RX_NE_NM = "";
			makeData.LEFT_RX_PORT_ID = null;
		}
		makeData.REFC_RONT_TRK_NTWK_LINE_NM = null;
		makeData.REFC_RONT_TRK_NTWK_LINE_NO = null;
		makeData.TRUNK_ID = null;
		makeData.WDM_TRUNK_ID = null;
		makeData.SERVICE_ID = null;
		return makeData;
}

// 선번 뒤집기
function reverseData(pathData) {
	var rePathData = [];
	jQuery.each(pathData, function(index, value) {
		var data = {};
		for(var key in value) {
			// WEST이면 EAST로 바꾼다.
			if(key.indexOf("LEFT") == 0) {
				var length = key.length;
				var column = "RIGHT" + key.substring(4, length);
				eval("data." + column + " = value." + key);
			} else if(key.indexOf("RIGHT") == 0) {
				// EAST이면 WEST로 바꾼다
				var length = key.length;
				var column = "LEFT" + key.substring(5, length);
				eval("data." + column + " = value." + key);
			} 
			// RING 정보
			else if(key.indexOf("RING_PATH_DIRECTION") == 0 && nullToEmpty(eval("value."+key)) != "") {
				if (nullToEmpty(eval("value."+key)) == "RIGHT") {
					data.RING_PATH_DIRECTION = "LEFT";
				} else {
					data.RING_PATH_DIRECTION = "RIGHT";
				}
			} else {
				eval("data." + key + " = value." + key);
			}
		}
		rePathData.push(data);
	});
	
	return rePathData;
}

// 특정 링 뒤집기
function reverseRingPath(ringData) {
	
	if (ringData.length == 0) {
		return;
	}
	var reverseRingId = nullToEmpty(ringData.RING_ID);
	if (reverseRingId == "") return;
	
	var tmpRingPath = $('#'+lnoGridId).alopexGrid("dataGet", {'RING_ID' :reverseRingId}, 'RING_ID');
	var rePathData = reverseData(tmpRingPath);
	rePathData.reverse();
	
	var allPath = $('#'+lnoGridId).alopexGrid('dataGet');
	var reversRingIdx = 0;
	
	// 데이터 교체
	for (var i =0 ; i < allPath.length; i++) {
		if (allPath[i].RING_ID == reverseRingId) {
			if (reversRingIdx < rePathData.length) {
				//$('#'+lnoGridId).alopexGrid('dataSet', rePathData[reversRingIdx], {_index: {data : i}});
				allPath[i]=rePathData[reversRingIdx];
				reversRingIdx++;
			}
		}
	}
	$('#'+lnoGridId).alopexGrid('dataSet', allPath);
	$("#"+lnoGridId).alopexGrid("viewUpdate");
    
	onLoadPathInfo = true; 

	pathData = $('#'+lnoGridId).alopexGrid('dataGet');
}


/**
 * setConfirmView
 * 선번 상세 화면에 선택버튼 활성/비활성 제어
 */
function setConfirmView() {
	var selectTab = parseInt($('#basicTabs').getCurrentTabIndex());
	
	if (selectTab == 0) {
		$('#btnConfirmPop').hide();
		$('#directionDiv').hide();
		$('#autoAddDropCheckbox').hide();
		$('#addDropProc').setChecked(false);
	} else {
		$('#btnConfirmPop').show();

		var chkData = $("#"+lnoGridId).alopexGrid("dataGet");
		
		var chkUseRingCnt = 0;
		var bfUseRing = "";
		for(var i = 0 ; i < chkData.length; i++) {
			if (nullToEmpty(chkData[i].RING_ID) != "") {
				if (bfUseRing != nullToEmpty(chkData[i].RING_ID) && chkData[i].RING_ID.substring(0,1) == "N") {
					bfUseRing = nullToEmpty(chkData[i].RING_ID);
					chkUseRingCnt++;
				}
			}
		}
		
		if (chkData.length == 0 ) {
			$('#btnConfirmPop').setEnabled(false);  // 선택불가
		} 
		else {
			$('#btnConfirmPop').setEnabled(true);  // 선택가능
		}		
	}
}

// 구선번 ADD/DROP지정
function addDropPopOld() {
	
	handelAddDropPop = null; // 팝업 Close용 핸들러
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
		
	cflineShowProgressBody();
	
	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
	// editYn = "Y" 인 이유는 이 팝업이 여기서 호출되는 경우는 편집중일때 링을 조회하고 해당 링의 선번을 선택했기 때문임
	var params = {"ntwkLineNo" : networkInfo[0], "ntwkLnoGrpSrno" : networkInfo[5], "editYn" : "Y", "useNetworkPathDirection" : networkInfo[4]
					, "zIndex":zIndex, "target":"Alopex_Popup_selectAddDrop"};
	
	addDropPopupObj = $a.popup({
    	popid: "selectAddDrop",
		title: "링 ADD DROP",
		url: urlPath+'/configmgmt/cfline/RingAddDropPop.do',
		data: params,
		iframe: true,
		modal: true,
		movable:true,
		windowpopup : true,
		width : 1200,
		height : 850,
		callback:function(data){
			cflineHideProgressBody();
			if(data != null) {
				ringAddDropData = data;
				if (ringAddDropData != null && nullToEmpty(ringAddDropData.prev) != 'Y') {
					//setRingData(ringAddDropData);
					setRingAddDropDataYn = true;
					
				} else {
					ringAddDropData = null;
					clearInterval(handelAddDropPop);
					handelAddDropPop = null;
				}
			} else {
				ringAddDropData = null;
				clearInterval(handelAddDropPop);
				handelAddDropPop = null;
			}
			// 다른 팝업에 영향을 주지않기 위해
 			$.alopex.popup.result = null; 
		}
    });
	
	if (handelAddDropPop == null) {
		handelAddDropPop = setInterval(function() {
				if (setRingAddDropDataYn == true) {
					setRingData(ringAddDropData);
				}
		}, 100);	
	}
}


//시각화 ADD/DROP지정
function addDropPopNew() {
	
	handelAddDropPop = null; // 팝업 Close용 핸들러
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
		
	cflineShowProgressBody();
	
	var params = {"ntwkLineNo" : networkInfo[0], "ntwkLnoGrpSrno" : networkInfo[5], editYn : "Y" }; 
	addDropPopupObj = $a.popup({
 	popid: "selectAddDropTeamsPath",
		title: "링 ADD DROP",
		url: urlPath+'/configmgmt/cfline/RingAddDropPopTeamsPath.do',
		data: params,
		iframe: true,
		modal: true,
		movable:true,
		windowpopup : true,
		width : 1200,
		height : 850,
		callback:function(data){
			cflineHideProgressBody();
			if(data != null) {

				ringAddDropData = data;
				if (ringAddDropData != null && nullToEmpty(ringAddDropData.prev) != 'Y') {

					ringAddDropData = [];
					ringAddDropData.push(data);
					setRingAddDropDataYn = true;
					
				} else {
					ringAddDropData = null;
					clearInterval(handelAddDropPop);
					handelAddDropPop = null;
				}
			} else {
				ringAddDropData = null;
				clearInterval(handelAddDropPop);
				handelAddDropPop = null;
			}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
		}
 });
	
	if (handelAddDropPop == null) {
		handelAddDropPop = setInterval(function() {
				if (setRingAddDropDataYn == true) {
					setRingData(ringAddDropData);
				}
		}, 100);	
	}
}

// Ajax 콜백함수
function successCallbackPop(response, status, jqxhr, flag){
		

	//조회
	if(flag == 'searchMain') {
		
		var data = response.list;
		renderGrid(mainGridId, data, response.totalCnt, addData);

		if(addData) {
			$('#'+mainGridId).alopexGrid("dataAdd", data);
			addData = false;
			cflineHideProgressBody();
		} else {
			$('#'+mainGridId).alopexGrid("dataSet", data);
			// 스크롤 추가 검색이 아니고 mainGrid에 서비스회선이 검색되었을 때 첫 데이터의 선번정보를 검색
			if ($('#'+mainGridId).alopexGrid('dataGet').length > 0) {
				var dataObj = $('#'+mainGridId).alopexGrid("dataGet", {_index : { data:0 }})[0];

			 	var ntwkLnoGrpSrno = dataObj.ntwkLnoGrpSrno;
			 	
				if (ntwkLnoGrpSrno == undefined){
					ntwkLnoGrpSrno = null;
				}
				searchTopoSclCd = dataObj.topoSclCd;
				searchTopoCfgMeansCd = dataObj.topoCfgMeansCd;
				var param = {
						  "gridId" : lnoGridId
						, "ntwkLineNo": dataObj.ntwkLineNo
						, "topoLclCd" : dataObj.topoLclCd
						, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno
						, "ringMgmtDivCd" : (nullToEmpty(dataObj.topoLclCd) == "001" ? "1" : null)
						, "wkSprDivCd" : "01"
						, "autoClctYn" : "N"	
						};
				
			} // 그이외의 경우 회선정보그리드를 클리어 한다.
			else {
				$('#'+lnoGridId).alopexGrid('dataEmpty');
			}
			
			cflineHideProgressBody();
		}
	}
	else if(flag == 'searchLno') {
		var data = "";
		var linkData = [];
		
		//결과가 있을 시
		if (response.listMap != undefined ) {
			data = response.listMap;
			// 일반 링 조회시
			if(data.ringOrgData != undefined ) {
				// 해당 링의 기본 정보
				networkInfo[0] = String(data.ringOrgData.NETWORK_ID);
	    		networkInfo[1] = String(data.ringOrgData.NETWORK_NM);
	    		networkInfo[2] = String(data.ringOrgData.NETWORK_STATUS_CD);
	    		networkInfo[3] = String(data.ringOrgData.NETWORK_STATUS_NM);
	    		networkInfo[4] = String(data.ringOrgData.PATH_DIRECTION);
	    		networkInfo[5] = String(data.ringOrgData.PATH_SAME_NO);
	    		networkInfo[6] = String(data.ringOrgData.PATH_SEQ);
	    		networkInfo[7] = String(data.ringOrgData.TOPOLOGY_LARGE_CD);
	    		networkInfo[8] = String(data.ringOrgData.TOPOLOGY_LARGE_NM);
	    		networkInfo[9] = String(data.ringOrgData.TOPOLOGY_SMALL_CD);
	    		networkInfo[10] = String(data.ringOrgData.TOPOLOGY_SMALL_NM);
	    		networkInfo[11] = String(data.ringOrgData.TOPOLOGY_CFG_MEANS_CD);
	    		networkInfo[12] = String(data.ringOrgData.TOPOLOGY_CFG_MEANS_NM);
	    		
	    		if(data.ringOrgData.LINKS != undefined) {
	    			linkData = data.ringOrgData.LINKS;
	    		} else {
	    			$('#'+lnoGridId).alopexGrid('dataEmpty');
	    			selectedRingId = null;
	    		}
			}
		}		
		
		if(addData) {
			$('#'+lnoGridId).alopexGrid("dataAdd", linkData);
			addData = false;
		} else {
			$('#'+lnoGridId).alopexGrid("dataSet", linkData);
		}
		pathData = linkData;
		onLoadPathInfo = true;
		
		setConfirmView();		

		// 기간망 트렁크의 경유 PTP링 혹은 M/W PTP링 인경우만 ADD/DROP없이 바로 적용하기 위해 방향값 설정할 수 있게 표시함
		$('#directionDiv').show();
		$('#autoAddDropCheckbox').show();
		$('#addDropProc').setChecked(true);
		
		// 만약 링의선번조회용인경우
		if (nullToEmpty(useRingId) != "") {
			// 역방향인경우
			if ($('#directionTwo').is(":checked") == true) {
				var dataList = AlopexGrid.trimData(pathData);
		   		var rePathData = [];
		   		
			 	if(onLoadPathInfo == true) {
			 		rePathData = reverseData(pathData);
		   	 		rePathData.reverse();
		   	 		pathData = rePathData;
		   	 		$('#'+lnoGridId).alopexGrid('dataSet', rePathData);
		   	 		$("#"+lnoGridId).alopexGrid("viewUpdate");
		   	 	    onLoadPathInfo = true; 
			 	}
			}
			// 만약 편집 불가모드인 경우
			if (editYn == "N") {
				$('#directionOne').setEnabled(false);
				$('#directionTwo').setEnabled(false);
				$('#addDropProc').setEnabled(false);
			}
		}
		
		cflineHideProgressBody();
	}
}

// 선번이 PTP타입 링인지 체크(PTP, M/W PTP링만 대상으로 함)
function isPtpTypeRing() {
	if (searchTopoSclCd != "002" && searchTopoSclCd != "039") {
		return false;
	}
	
	// 토폴로지 구성방식 가 있는경우 
	if (nullToEmpty(searchTopoCfgMeansCd) != "" ) {
		// 토폴로지 구성방식이 PTP
		if ( searchTopoCfgMeansCd == "002") {
			return true;
		} else {
			return false;
		}
	}
	
	return true;
}

var httpRequestPop = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 
		data : Param, 
		method : Method,
		flag : Flag
	}).done(successCallbackPop)
	  .fail(function(response){failCallbackPop(response, Flag);});
}

function failCallbackPop(response, flag){
	cflineHideProgressBody();
	if(flag == 'searchMain'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		return;
	}
	else if(flag == 'searchLno'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		$('#'+lnoGridId).alopexGrid('dataEmpty');
	}
	else {
		alertBox('I', cflineMsgArray['systemError']); /* 시스템 오류가 발생하였습니다. */
	}
}

// info list row intex 
function setRowIndexInfo(changeSearch){
	if(changeSearch){
		$("#firstRow01").val(1);
   	    $("#lastRow01").val(20);
	} 
	else {
	 	if(addData){
	 		var first = parseInt($("#firstRow01").val());
	 		var last = parseInt($("#lastRow01").val());
	 		$("#firstRow01").val(first + 20);
	 		$("#lastRow01").val(last + 20);
	 	}
	}
	$("#firstRowIndex").val($("#firstRow01").val());
    $("#lastRowIndex").val($("#lastRow01").val());
}

// work list row intex
function setRowIndexWork(changeSearch){
	if(changeSearch){
		$("#firstRow02").val(1);
   	    $("#lastRow02").val(20);
	} else {
	     	if(addData){
	     		var first = parseInt($("#firstRow02").val());
	     		var last = parseInt($("#lastRow02").val());
	     		$("#firstRow02").val(first + 20);
	     		$("#lastRow02").val(last + 20);
	     	}
	}
	$("#firstRowIndex").val($("#firstRow02").val());
    $("#lastRowIndex").val($("#lastRow02").val());
}


