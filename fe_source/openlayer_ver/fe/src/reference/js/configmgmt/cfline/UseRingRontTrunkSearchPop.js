/**
 * UseRingRontTrunkSearchPop.js
 *
 * @date 2019.10.01
 * 
 * ************* 수정이력 ************
 * 2020-05-15 1. SMUX링 경유링 사용 
 *                경유링은 1차 까지만 참조가능
 *                경유링으로 사용가능한 종류 : SMUX링 
 * 2020-08-03 2. 가입자망링 경유링 사용 
 *                경유링은 1차 까지만 참조가능
 *                경유링으로 사용가능한 종류 : BC-MUX링, CWDM-MUX링 
 * 
 */
var mainGridId = 'mainGrid';
var lnoGridId = 'lnoGrid';
var addData = false;
var editRingId = '';
var useRingId = '';
var rontTrunkId = '';
var rontTrunkNm = '';
var editRingTopoSclCd = '';  // 편집중일 링의 망종류
var editViewVisualYn = 'N';  // 구선번 편집(N)/ 시각화 편집(Y)
var editRingMgmtCd = '';   // 편집중일 링의 관리그룹
var mtsoList = [];
var editYn = null;

var ringNtwkTypDataPop = [];	//망구분데이터  value:text
var ringTopoDataPop = []; 		//망종류데이터 
var ringNtwkTypDataSktPop = [];	//망구분데이터 SKT  value:text
var ringTopoDataSktPop = []; 		//망종류데이터 SKT
var ringNtwkTypDataSkbPop = [];	//망구분데이터 SKB value:text
var ringTopoDataSkbPop = []; 		//망종류데이터 SKB
var ringC00194Data = []; // 용량

var capaTypCdPop = [];	// 회선타입
var rontTrkTypCdPop = [];	// 서비스유형

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

// 선택한 서비스회선 번호
var networkInfo = ['NETWORK_ID', 'NETWORK_NM', 'NETWORK_STATUS_CD', 'NETWORK_STATUS_NM', 'PATH_DIRECTION', 'PATH_SAME_NO', 'PATH_SEQ', 'TOPOLOGY_LARGE_CD', 'TOPOLOGY_LARGE_NM', 'TOPOLOGY_SMALL_CD', 'TOPOLOGY_SMALL_NM', 'TOPOLOGY_CFG_MEANS_CD', 'TOPOLOGY_CFG_MEANS_NM'];
$a.page(function() {
	
	this.init = function(id, param) {
		ringAddDropData = null;
		editRingId = nullToEmpty(param.editRingId);
		editRingMgmtCd = nullToEmpty(param.editRingMgmtCd);
		useRingId = nullToEmpty(param.useRingId);
		rontTrunkId = nullToEmpty(param.rontTrunkId);
		rontTrunkNm = nullToEmpty(param.rontTrunkNm);
		editRingTopoSclCd = nullToEmpty(param.editRingTopoSclCd);  // 편집중인 링의 망종류값
		editViewVisualYn = nullToEmpty(param.editViewVisualYn);  // 구선번 편집(N)/ 시각화 편집(Y)
		editYn = nullToEmpty(param.editYn);
		
		$('#topoSclCd').val(editRingTopoSclCd);
		// SMUX링인 경우 기간망 트렁크는 조회하지 않는다
		if (editRingTopoSclCd == "035" || editRingTopoSclCd == "031") {
			$('.NTWK_RONT').hide();			
		}
		
		// 경유링명 클릭시 경유링이 꽂혀있을 경우
		if(useRingId != "" || (editRingTopoSclCd == "002" || editRingTopoSclCd == "039") ) {
			$('#' + mainGridId).hide();
			$('#info').hide();
			$('#btnSearch').hide();
			
			$('#popTitle').text(rontTrunkId != "" ? "기간망 트렁크 선번" : "링 선번");
			$('#popSubTitle').text("선번");
			
			// PTP 혹은 M/W PTP링링인 경우 해당 링ID 조회작업하지 않는다
			if (editRingTopoSclCd != "002" && editRingTopoSclCd != "039") {
				selectedRingId = useRingId;
				if (nullToEmpty(param.useRingPathDirection) == "" || nullToEmpty(param.useRingPathDirection) == "RIGHT") {
					$('#directionOne').setSelected();
				} else {
					$('#directionTwo').setSelected();
				}
				$('#directionOne').val(nullToEmpty(param.useRingPathDirection) == "" ? "RIGHT" : nullToEmpty(param.useRingPathDirection));
				searchTopoLclType = "RING";

				searchTopoSclCd = nullToEmpty(param.useRingTopoSclCd);
				searchTopoCfgMeansCd = nullToEmpty(param.useRingTopoCfgMeansCd);
				$('.tab_1').hide();
				// 선번그리드의 높이를 수정			
				var paramData = { 
											"ntwkLineNo": useRingId
											, "topoLclCd" : param.useRingTopoLclCd
											, "topoSclCd" : param.useRingTopoSclCd
										}
				
				fnSearch("lno", true, paramData);
				
			} 
			// PTP링 혹은 M/W PTP 인경우 조회작업 하지 않음
			else {
				$('#useRingRontTrunkSearchForm').hide();
				$('#basicTabs').hide();
				callMsgBox('','I', "PTP링 혹은 M/W PTP링은 경유링 사용이 불가능합니다.", function(msgId, msgRst){   /* PTP링 혹은 M/W PTP링은 경유링 사용이 불가능합니다.*/
					// 사용링 형태로 셋팅
					if (msgRst == 'Y') {
						/* PTP링은 경유링 사용이 불가능합니다.*/
						$a.close();
					}
				});
			}
		} else {
			$('#info').show();
			$('#btnSearch').show();
			$('#popTitle').text("경유 링 조회팝업");
			$('#popSubTitle').text("경유 링 조회");
			$('#editRingId').val(nullToEmpty(param.editRingId));
			$('#schRingNtwkLineNm').val(nullToEmpty(param.ntwkLineNm));
			
			var tmofParamData = [];
    		var mtsoIdList = [];
    		
    		if(nullToEmpty(param.vTmofInfo) != "") {
    			var mtsoId = "";
    			var mtsoNm = "";
    			var index = 0;
    			for(i=0; i<param.vTmofInfo.length ;i++) {
    				//if (param.vTmofInfo[i].jrdtMtsoTypCd == "01") {
	    				mtsoId = param.vTmofInfo[i].mtsoId;
	    				mtsoNm = param.vTmofInfo[i].text
	    				if(nullToEmpty(mtsoNm) != ""){
	    					tmofParamData.push({value:mtsoId, text:mtsoNm});
	    					mtsoIdList[index] = mtsoId;
	    					index++;
	    				}
    				//}
    			}
    			tmofCd = mtsoIdList.join(',');
    		}
    		
        	$('#tmofCd').setData({
        		data:tmofParamData,
        		tmofCd:mtsoIdList
        	});
        	
        	// 링명이 있는경우 셋팅
        	if (nullToEmpty(param.srchRingNm) != "") {
        		$('#ringNm').val(param.srchRingNm);
        	}
        	//중계구간 input box
        	inputEnableProc("linkPath1","linkPath2","");
        	inputEnableProc("linkPath2","linkPath3","");
        	inputEnableProc("linkPath3","linkPath4","");
        	inputEnableProc("linkPath4","linkPath5","");

			$('#directionOne').setSelected();
		}
		
		addData = false;
    	setSelectCode();
    	setEventListener();
    	// 선택버튼비활성화
    	$('#btnConfirmPop').setEnabled(false);
    	// 서비스회선 비활성화
    	//$('#svlnSclCd').attr("disabled", true);  
    };
});

function setSelectCode() {

	// 링
	var comParam = {"userMgmtNm": ''};
	httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', comParam, 'GET', 'ringNtwkTypData'); // 망구분 데이터
	httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getTopoList', comParam, 'GET', 'ringTopoData'); // 망종류 데이터
	httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data'); // 용량 데이터
	
	// 기간망
	httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01572', null, 'GET', 'capaType');
	// 서비스유형
	httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01058', null, 'GET', 'rontTrkType');
	
	
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
				// 기간망 트렁크의 경유 PTP링 혹은 M/W PTP링 인경우만 ADD/DROP없이 바로 적용하기 위해 방향값 설정할 수 있게 표시함
				if (searchTopoLclType == "RONT_TRK" ) {
					$('#directionDiv').show();
					$('#autoAddDropCheckbox').hide();
					$('#addDropProc').setChecked(false);
				} else if (isPtpTypeRing() == true) {  //(searchTopoSclCd == "002" || searchTopoSclCd == "039") {					
						$('#directionDiv').show();
						$('#autoAddDropCheckbox').show();
						$('#addDropProc').setChecked(true);
				} else {
					$('#directionDiv').hide();
					$('#autoAddDropCheckbox').hide();
					$('#addDropProc').setChecked(false);
				}
				
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
				break;
			default :
				break;
    	}
    	setConfirmView();
	});
	
 	// 엔터 이벤트 
 	$('#useRingRontTrunkSearchForm').on('keydown', function(e){
 		if (e.which == 13){
 			addData = false;
 			fnSearch("main", true,"");
 	    	$('#btnConfirmPop').setEnabled(true);
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
		//changeTmof("tmofCd", "mtso");
  	});
	
	// 네트워크 타입 선택
	$('input:radio[name=schNtwkType]').on('click', function(e) {	
	    
		 var schNtwkType = $('#schNtwkType:checked').val();
		 $('.TYP_CON').hide();			
		 $('.'+schNtwkType).show();
		
		 // 그리드 컬럼 표시 및 그리드 데이터 클리어
		 // 만약 링 선택시
		 
		 if (schNtwkType == 'RING') {
			 $('#'+mainGridId).alopexGrid('hideCol', ['rontTrkTypCd', 'wdmChnlVal', 'wdmWavlVal', 'rontTrkCapaTypCd', 'useRingNtwkLineNoList']);  // 기간망 항목 숨기기
			 $('#'+mainGridId).alopexGrid('showCol', ['ntwkTypCdNm', 'topoSclCdNm', 'topoCfgMeansCdNm', 'ntwkCapaCdNm']);  // 링 항목 보이기
			 $('#'+lnoGridId).alopexGrid('hideCol', ['MOVE', 'RONT_LINK_PATH_NODE']);
		 } 
		 // 기간망 트렁크 선택시
		 else if (schNtwkType == 'RONT_TRK') {
			 $('#'+mainGridId).alopexGrid('showCol', ['rontTrkTypCd', 'wdmChnlVal', 'wdmWavlVal', 'rontTrkCapaTypCd', 'useRingNtwkLineNoList']);  // 기간망 항목 보이기
			 $('#'+mainGridId).alopexGrid('hideCol', ['ntwkTypCdNm', 'topoSclCdNm', 'topoCfgMeansCdNm', 'ntwkCapaCdNm']);   // 링 항목 숨기기
			 $('#'+lnoGridId).alopexGrid('showCol', ['MOVE', 'RONT_LINK_PATH_NODE']);
		 }

		 $('#'+mainGridId).alopexGrid('dataEmpty');
		 $('#'+lnoGridId).alopexGrid('dataEmpty');
		 $('#'+mainGridId).alopexGrid("updateOption", { fitTableWidth: true });
		 $('#'+lnoGridId).alopexGrid("updateOption", { fitTableWidth: true });
		 $('#directionDiv').hide();
	 });    
 	
 	//조회버튼 클릭시
    $('#btnSearch').on('click', function(e) {
    	fnSearch("main", true,"");
    	$('#btnConfirmPop').setEnabled(true);
    });
    
    //국사찾기
	$('#btnMtsoSch').on('click', function(e) {
		var paramValue = "";
		
		paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text(),"orgId": $('#hdofcCd').val()
				,"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val()
				, "regYn" : "Y", "mtsoStatCd" : "01"}
		openMtsoDataPop("mtsoCd", "mtsoNm", paramValue);
	}); 

    //경유링조회팝업 스크롤 이동시
   	$('#'+mainGridId).on('scrollBottom', function(e){
   		addData = true;
   		fnSearch("main", false,"");
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
		
		// 기간망 트렁크 아니고, PTP링 혹은 M/W PTP링 도 아닌 경우 ADD/DROP 설정화면
		if (searchTopoLclType == "RING" 
			//&&  ((searchTopoSclCd != "002" && searchTopoSclCd != "039" ) 
			//		|| ((searchTopoSclCd == "002" || searchTopoSclCd == "039") && $('#addDropProc').is(':checked') == false))) 
			&& (isPtpTypeRing() == false || (isPtpTypeRing() == true && $('#addDropProc').is(':checked') == false)))
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
				// 기간망 트렁크 이고 사용링 정보가 없는경우
				if (searchTopoLclType == "RONT_TRK" && nullToEmpty(dataList[i].RING_ID) == "") {
					continue;
				} 
				if (bfRingId != nullToEmpty(dataList[i].RING_ID) && bfRingId != "" && searchTopoLclType == "RONT_TRK") {
					teamsRingPath.push({"LINKS" : tmpPathList, "USE_NETWORK_PATHS" : []});
					tmpPathList = [];
				} 
				// 기간망 트렁크이면서 새로운 링인 경우 혹은 PTP/ M/W PTP링 이고 첫구간인경우 ADD구간 처리
				if ((searchTopoLclType == "RONT_TRK"  && bfRingId != nullToEmpty(dataList[i].RING_ID))
					//	  || (searchTopoLclType == "RING" &&  (searchTopoSclCd == "002" || searchTopoSclCd == "039") && i == 0)) 
						|| (searchTopoLclType == "RING" &&  isPtpTypeRing() == true && i == 0)) 
				{
					// ADD 구간 정보 셋팅
					ringAddDropData.push(addDropEqpSet(dataList[i],  "A"));
					// 시각화용
					//tmpPathList.push(ringAddDropData[ringAddDropData.length-1]);
				}
				// PTP 링인 경우 사용링 처리 필요함
				if (searchTopoLclType == "RING" && isPtpTypeRing() == true )//(searchTopoSclCd == "002" ||  searchTopoSclCd == "039")) 
				{
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
				}
	   			dataList[i].RING_MERGE = null;

	   			if (dataList[i].WDM_TRUNK_ID != null && dataList[i].WDM_TRUNK_ID.indexOf('alopex') == 0) {
	   				dataList[i].WDM_TRUNK_ID = null;
	   			}  		
	   			if (dataList[i].WDM_MERGE != null && dataList[i].WDM_MERGE.indexOf('alopex') == 0) {
	   				dataList[i].WDM_MERGE = null;
	   			} 
				
	    		dataList[i].LEFT_ADD_DROP_TYPE_CD = "T";
	    		dataList[i].RIGHT_ADD_DROP_TYPE_CD = "T";

	    		//dataList[i].LEFT_NODE_ROLE_CD = "NA";
	    		//dataList[i].RIGHT_NODE_ROLE_CD = "NA";

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
				if ( (searchTopoLclType == "RONT_TRK"  && bfRingId != (i+1 == dataList.length ? "1" : nullToEmpty(dataList[i+1].RING_ID)))
							//|| (searchTopoLclType == "RING" &&  (searchTopoSclCd == "002" || searchTopoSclCd == "039") && (i+1 == dataList.length))) 
						|| (searchTopoLclType == "RING" &&  isPtpTypeRing() == true && (i+1 == dataList.length))) 
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
			if ($('#schNtwkType').val() == "RONT_TRK") {
				msgStr = "선택한 기간망 트렁크의 경유 PTP링의 선번정보가 없습니다.";
			}
			alertBox('W', msgStr);/* 선택된 데이터가 없습니다. */
			return;
		}
	});
	
	//중계구간 input box
 	$('#linkPath1').on('propertychange input', function(e){
 		inputEnableProc("linkPath1","linkPath2","");
 		inputEnableProc("linkPath2","linkPath3","");
 		inputEnableProc("linkPath3","linkPath4","");
 		inputEnableProc("linkPath4","linkPath5","");
 	});
 	$('#linkPath2').on('propertychange input', function(e){
 		inputEnableProc("linkPath2","linkPath3","");
 		inputEnableProc("linkPath3","linkPath4","");
 		inputEnableProc("linkPath4","linkPath5","");
 	});
 	$('#linkPath3').on('propertychange input', function(e){
 		inputEnableProc("linkPath3","linkPath4","");
 		inputEnableProc("linkPath4","linkPath5","");
 	});
 	$('#linkPath4').on('propertychange input', function(e){
 		inputEnableProc("linkPath4","linkPath5","");
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
		if (editYn == "N") {
			$('#btnConfirmPop').hide();
		} else {
			$('#btnConfirmPop').show();
		}		

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
		else if ( searchTopoLclType == "RONT_TRK" && chkUseRingCnt == 0) {
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
	//회선유형
	if(flag == 'capaType'){
		var allOption = [{value: "",text: cflineCommMsgArray['all']}]; /*전체*/
		
		for(var i=0; i<response.length; i++){
			if(response[i].useYn == "Y") {
				capaTypCdPop.push(response[i]);
			}	
		}
		
		$('#schRontTrkCapaTypCd').setData({data : allOption.concat(capaTypCdPop)});
	}
	//서비스유형
	else if(flag == 'rontTrkType'){
		var allOption = [{value: "",text: cflineCommMsgArray['all']}]; /*전체*/
		
		for (var i=0; i< response.length; i++) {
			if (response[i].useYn == "Y" && nullToEmpty(response[i].cdFltrgVal) !='SKB') {
				rontTrkTypCdPop.push(response[i]);
			}
		}

		$('#schRontTrkTypCd').setData({data : allOption.concat(rontTrkTypCdPop)});
	}
	// 시스템 - 좌장비 역할 코드
	else if(flag == 'eqpRoleDivCd'){
		var allOption =  [{comCd: "", comCdNm: cflineCommMsgArray['all']/*전체*/}];
		$('#schlftEqpRoleDiv').clear();
		$('#schlftEqpRoleDiv').setData({data:allOption.concat(response) });
	}
	// 망구분데이터셋팅
	else if(flag =='ringNtwkTypData'){
		var gridNtwkTypData = [];
		for(n=0;n<response.NtwkTypData.length;n++){
			
			ringNtwkTypDataPop.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			//gridNtwkTypData.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			// 전체에 속하는경우
			if (response.NtwkTypData[n].cdMgmtGrpVal == 'ALL') {
				ringNtwkTypDataSktPop.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
				ringNtwkTypDataSkbPop.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			} else if (response.NtwkTypData[n].cdMgmtGrpVal == 'SKT') {
				ringNtwkTypDataSktPop.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			} else if (response.NtwkTypData[n].cdMgmtGrpVal == 'SKB') {
				ringNtwkTypDataSkbPop.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			} 
		}

		var viewMgmtGrpCd = $('#userMgmtCdSrchPop').val() ;
		var comboNtwkTypData = [];
		if (viewMgmtGrpCd == '') {
			comboNtwkTypData = comboNtwkTypData.concat(ringNtwkTypDataPop);
		} else if (viewMgmtGrpCd == 'SKT') {
			comboNtwkTypData = comboNtwkTypData.concat(ringNtwkTypDataSktPop);
		} else if (viewMgmtGrpCd == 'SKB') {
			comboNtwkTypData = comboNtwkTypData.concat(ringNtwkTypDataSkbPop);
		}
		//console.log(NtwkTypData);
		$('#schNtwkTypCd').clear();			
		$('#schNtwkTypCd').setData({data : comboNtwkTypData});
		//NtwkTypData = gridNtwkTypData;
		
	}
		
	// 망종류데이터셋팅
	else if(flag =='ringTopoData'){
		var gridTopoData = [];
		//TopoData = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
		for(n=0;n<response.TopoData.length;n++){
			ringTopoDataPop.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm});
			//gridTopoData.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm});
			if (response.TopoData[n].cdMgmtGrpVal == 'ALL') {
				ringTopoDataSktPop.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
				ringTopoDataSkbPop.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
			} else if (response.TopoData[n].cdMgmtGrpVal == 'SKT') {
				ringTopoDataSktPop.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
			} else if (response.TopoData[n].cdMgmtGrpVal == 'SKB') {
				ringTopoDataSkbPop.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm})
			} 
		}
		
		var viewMgmtGrpCd =  $('#userMgmtCdSrchPop').val();
		
		var comboTopoData = [];
		if (viewMgmtGrpCd == '') {
			comboTopoData = comboTopoData.concat(ringTopoDataPop);
		} 
		//else if (viewMgmtGrpCd == 'SKT') {
		else if (editRingMgmtCd == '0001') {
			comboTopoData = comboTopoData.concat(ringTopoDataSktPop);
		} 
		//else if (viewMgmtGrpCd == 'SKB') {
		else if (editRingMgmtCd == '0002') {
			comboTopoData = comboTopoData.concat(ringTopoDataSkbPop);
		}
		
		/* 사용링을 조회하는 편집중인 링의 망종류에 따라 제공 가능한 링 목록을 편집함
		   1. PTP : 사용링 사용불가
		   2. MESH : PTP링 사용가능
		   3. Ring, IBS, IBRR, IVS, IVRR : 1, 2번 사용 가능
		   4. SMUX링 : SMUX링
		 */
		var setComboTopoData = [];

		var setTopoSclCd = [];
		// 1. PTP (002) 혹은 M/W PTP링(039)
		if (editRingTopoSclCd == "002" || editRingTopoSclCd == "039") {
			setComboTopoData = [];
		} 
		// 2. MESH (020)
		//else if (editRingTopoSclCd == "020") {
		else if (isMeshRing(editRingTopoSclCd) == true) {

			var index = 0;
			for (var i =0; i < comboTopoData.length; i++) {
				if (comboTopoData[i].value == "002" || comboTopoData[i].value == "039") {
					setComboTopoData.push(comboTopoData[i]);
					baseTopoSclCdListForRing.push(comboTopoData[i].value);
					setTopoSclCd[index] = comboTopoData[i].value;
					index++;
				}
			}
		} 
		// 3. Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038) : 1, 2번 사용 가능
		//else if (editRingTopoSclCd == "001" || editRingTopoSclCd == "011" || editRingTopoSclCd == "015" || editRingTopoSclCd == "037" || editRingTopoSclCd == "038" ) {
		// SMUX링도 경유링 포함 가능 단, 같은 SMUX링만 가능함  2020-05-23
		// 2020-08-03 2. 가입자망링 경유링 사용
		else if (isAbleViaRing(editRingTopoSclCd) == true) {
			var index = 0;
			for (var i =0; i < comboTopoData.length; i++) {
				// SMUX링인경우
				if (editRingTopoSclCd == "035") {
					// SMUX링만
					if (comboTopoData[i].value == "035") {
						setComboTopoData.push(comboTopoData[i]);
						baseTopoSclCdListForRing.push(comboTopoData[i].value);
						setTopoSclCd[index] = comboTopoData[i].value;
						index++;
						break;
					}
				}
				// 가입자망링인경우
				else if (editRingTopoSclCd == "031") {
					// BC-MUX링 , CWDM-MUX링만
					if (comboTopoData[i].value == "040" || comboTopoData[i].value == "041") {
						setComboTopoData.push(comboTopoData[i]);
						baseTopoSclCdListForRing.push(comboTopoData[i].value);
						setTopoSclCd[index] = comboTopoData[i].value;
						index++;
					}
				}
				else if (comboTopoData[i].value == "002" || comboTopoData[i].value == "020" || comboTopoData[i].value == "039") {
					setComboTopoData.push(comboTopoData[i]);
					baseTopoSclCdListForRing.push(comboTopoData[i].value);
					setTopoSclCd[index] = comboTopoData[i].value;
					index++;
				}
			}
		}
		
		$('#schTopoSclCd').clear();
		$('#schTopoSclCd').setData({
			  data : setComboTopoData
			, schTopoSclCd : setTopoSclCd
			});
		
		//TopoData = gridTopoData;
	}
	
	// 용량데이터셋팅
	if(flag == 'C00194Data'){
		var gridC00194Data = [];
		ringC00194Data = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
		for(var i=0; i<response.length; i++){
			ringC00194Data.push({value : response[i].value, text :response[i].text});
		}
		$('#schNtwkCapaCd').clear();
		$('#schNtwkCapaCd').setData({data : ringC00194Data});
	}
	
	//조회
	else if(flag == 'searchMain') {
		
		var data = response.list;
		renderGrid(mainGridId, data, response.totalCnt, addData);
		
		var schNtwkType = $('#schNtwkType:checked').val();
		 // 그리드 컬럼 표시 및 그리드 데이터 클리어
		 // 만약 링 선택시
		 
		 if (schNtwkType == 'RING') {
			 $('#'+mainGridId).alopexGrid('hideCol', ['rontTrkTypCd', 'wdmChnlVal', 'wdmWavlVal', 'rontTrkCapaTypCd', 'useRingNtwkLineNoList']);  // 기간망 항목 숨기기
			 $('#'+mainGridId).alopexGrid('showCol', ['ntwkTypCdNm', 'topoSclCdNm', 'ntwkCapaCdNm']);  // 링 항목 보이기
		 } 
		 // 기간망 트렁크 선택시
		 else if (schNtwkType == 'RONT_TRK') {
			 $('#'+mainGridId).alopexGrid('showCol', ['rontTrkTypCd', 'wdmChnlVal', 'wdmWavlVal', 'rontTrkCapaTypCd', 'useRingNtwkLineNoList']);  // 기간망 항목 보이기
			 $('#'+mainGridId).alopexGrid('hideCol', ['ntwkTypCdNm', 'topoSclCdNm', 'ntwkCapaCdNm']);   // 링 항목 숨기기
		 }

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
				
				//fnSearch("lno", true, param);
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
			if (searchTopoLclType == "RING") {
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
			} else if (searchTopoLclType == "RONT_TRK") {
				if (data.linkNodePtpPathJson != undefined ) {
					if(data.linkNodePtpPathJson.length > 0) {
		    			linkData = data.linkNodePtpPathJson;
		    		} else {
		    			$('#'+lnoGridId).alopexGrid('dataEmpty');
		    			selectedRingId = null;
		    		}
				}
			}
		}		
		
		//renderGrid(lnoGridId, linkData, "", addData);
		
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
		if (searchTopoLclType == "RONT_TRK" ) {
			$('#directionDiv').show();
			$('#autoAddDropCheckbox').hide();
			$('#addDropProc').setChecked(false);
		} else if (isPtpTypeRing() == true) {//(searchTopoSclCd == "002" || searchTopoSclCd == "039") {
			$('#directionDiv').show();
			$('#autoAddDropCheckbox').show();
			$('#addDropProc').setChecked(true);
		} else {
			$('#directionDiv').hide();
			$('#autoAddDropCheckbox').hide();
			$('#addDropProc').setChecked(false);
		}
		
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

// 검색
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
	if (sType == "main") {
		var paramData = $("#useRingRontTrunkSearchForm").serialize(); 
		
		// 전송실
		paramData = paramData + "&tmofCdPopListView="+tmofCd;		
		
		// 검색조건 셋팅
		paramData += "&ntwkLineNo=" + $('#srchNtwkLineNo').val();
		paramData += "&rontTrkCapaTypCd=" + $('#schRontTrkCapaTypCd').val();
		paramData += "&rontTrkTypCd=" + $('#schRontTrkTypCd').val();
		if ( $('#schNtwkType:checked').val() == "RING") {
			paramData += "&ntwkLineNm=" + $('#schRingNtwkLineNm').val();
			//paramData += "&mgmtGrpCd=" + ($('#userMgmtCdSrchPop').val() == "SKB" ? "0002" : "0001");
			paramData += "&mgmtGrpCd=" + editRingMgmtCd;
			// 망종류 미선택시 기본 망종류 조건
			if (nullToEmpty($('#schTopoSclCd').val()) == "") {
				
				alertBox('I', "최소 한개의 망종류를 선택해 주세요."); /* 최소 한개의 망종류를 선택해 주세요.*/
				cflineHideProgressBody();
				return;
				/*$.each(baseTopoSclCdListForRing, function(idx, obj){
					paramData += "&topoSclCdList=" + baseTopoSclCdListForRing[idx];
    			});*/
			}
		} else {
			paramData += "&ntwkLineNm=" + $('#schRontNtwkLineNm').val();
		}
		
		if (addData != true) {
			$('#'+mainGridId).alopexGrid('dataEmpty');
			$('#'+lnoGridId).alopexGrid('dataEmpty');
		}
		searchTopoLclType =  $('#schNtwkType:checked').val();		
		$('#basicTabs').setTabIndex(0);
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/useringronttrunk/getuseringronttrunk', paramData, 'GET', 'searchMain');
	}else if (sType == "lno") {

		param.schNtwkType = $('#schNtwkType:checked').val();
		$('#'+lnoGridId).alopexGrid('dataEmpty');
		$('#basicTabs').setTabIndex(1);
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/useringronttrunk/getuseringronttrunkpath', param, 'GET', 'searchLno');
	}
}

