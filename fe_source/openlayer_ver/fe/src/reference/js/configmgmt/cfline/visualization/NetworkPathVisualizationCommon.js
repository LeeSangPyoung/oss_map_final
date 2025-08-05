/**
 * NetworkPathVisualizationCommon.js
 *
 * @author Administrator
 * @date 2017. 6. 26. 
 * @version 1.0
 *   
 *  
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-03-15  2. [수정] 구 선번편집창을 기준으로 선택선번창의 추가버튼 제어
 * 2018-04-02  3. [수정] 주선번/예비선번 탭 선택시 버그수정 
 *                NetworkPathVisualizationPop.js도 꼭 확인바람
 *                주선번이든 예비선번이든 탭을 치환하거나 예비선번으로 변경을 수행할때 
 *                주선번과 예비선번 값을 보존 혹은 상호치환하는 작업시 teamsPath.WK_SPR_DIV_CD 값을 통해 이루어 지고 있음.
 *                주선번/예비선번 관련 작업시 해당 값 설정을 명확히 해주어야 함.
 * 2018-09-12  4. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 , RX포트 E2E적용
 * 2019-01-15  5. 5G-PON고도화  5G-PON RU에 주선번이 있는 경우 주선번의 사용링의 역방향으로 예비회선 자동선번생성 처리해주기 위해 예비선번은 편집 불가
 * 2019-09-30  6. 기간망 링 선번 고도화 : openUseRingRontTrunkSearchPopNew로 링/기간망 트렁크 조회하여 링에서 경유링을 설정 할 수 있게 처리함
 * 2020-01-06  7. 시각화편집 COPY & PASTE 기능 추가
 * 2020-01-06  8. PBOX 코드(182)  추가 
 * 2020-07-08  9. 회선 및 링에 포함된 링이 CMUX의 이원화의 확장형인지 판단하는 로직 추가
 * 2020-08-03  10. 자동 ETE연결기능
 *                 e2eApplyAuto : 선로리스트 팝업에서 선택된 장비정보로 ETE연결을 시켜준다.
 * 2021-03-08  11. 상위OLT장비 버튼 추가(btnOltEqpReg)
 */

function getUrlPath() {
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) == ""){
		urlPath = "/tango-transmission-web";
	}
	return urlPath;
} 

 
function isServiceLine() {
	if(typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined") {
		return true;
	} else {
		return false;
	}
}

/* RU회선여부 */
function isRuCoreLine() {
	if( typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined" && initParam.svlnLclCd == "003" && initParam.svlnSclCd == "101") {
		return true;
	} else {
		return false;
	}
}

/*
 * 링-Smux링 여부 
 */
function isSmuxRing() {
	if(initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd  != "undefined" && initParam.topoSclCd == "035") {
		return true;
	} else {
		return false;
	}
}

/*
 * 링-SKB -MUX 링 여부 
 */
function isSkbMuxRing() {
	if(initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd  != "undefined" && (initParam.topoSclCd == "040" || initParam.topoSclCd == "041")) {
		return true;
	} else {
		return false;
	}
}

/*
 * 링-Smux링 여부 
 * 토폴로지구성방식이 링타입
 */
function isSmuxRing001() {
	if(initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd  != "undefined" && initParam.topoSclCd == "035" && initParam.topologyType == "001") {
		return true;
	} else {
		return false;
	}
}

/*
 * 링-Smux링 여부 
 * 토폴로지구성방식이 PTP타입 면서 확장형
 */
function isCmuxRing002() {
	if(initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd  != "undefined" && initParam.topoSclCd == "035" && initParam.topologyType == "002") {		
		if(checkCmuxExt(teamsPath)) {
			return true;
		}
	} else {
		return false;
	}
}

/*
 * 링-5G-PON링 여부 
 * 5G-PON3.1 추가 
 * 2021-11-10
 */
function isFiveGponRing() {
	if(initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd  != "undefined" && (initParam.topoSclCd == "033" || initParam.topoSclCd == "036" || initParam.topoSclCd == "042")) {
		return true;
	} else {
		return false;
	}
}

/*
 * 링-가입자망링 여부 
 */
function isSubScriRing() {
	if(initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd  != "undefined" && initParam.topoSclCd == "031") {
		return true;
	} else {
		return false;
	}
}



/* 중계기정합장치 L9TU 회선여부 */
function isRuMatchLine() {
	if( typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined" && initParam.svlnLclCd == "006" && initParam.svlnSclCd == "061") {
		return true;
	} else {
		return false;
	}
}

/* S-MUX RU회선여부 */
function isSmuxRuCoreLine() {
	if( typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined" && initParam.svlnLclCd == "003" && initParam.svlnSclCd == "101" && nullToEmpty(baseInfData.appltTypeOfFiveg) == "SMUX") {
		return true;
	} else {
		return false;
	}
}


/* C-MUX 확장여부 */
function isCmuxExtLine() {
	if( typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined"
		&& initParam.svlnLclCd == "003" && initParam.svlnSclCd == "101" && nullToEmpty(baseInfData.appltTypeOfFiveg) == "SMUX") {
		return true;
	} else {
		return false;
	}
}


/*
 * 링-SKB CATV망종류 여부
 */
function isSkbCatvRing() {
	if(initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd  != "undefined" 
		&& (initParam.ntwkTypCd == "022" || initParam.ntwkTypCd == "023" || initParam.ntwkTypCd == "024" || initParam.ntwkTypCd == "025")) {
		return true;
	} else {
		return false;
	}
}

/**
 * checkSmuxAndTopoCfgMeansRing 
 * @param chkPath
 * @returns retrunValue
 */
function checkSmuxAndTopoCfgMeansRing(chkPath){

	var retrunValue = false
	var topoCfgMeansCd = "";
	var checkSmuxRing = "";
	var useNetworkPaths = chkPath.USE_NETWORK_PATHS;
	
	if (nullToEmpty(useNetworkPaths) != "") {
		for(var i = 0 ; i < useNetworkPaths.length; i++) {
			if ( nullToEmpty(useNetworkPaths[i].TOPOLOGY_SMALL_CD) == "035") {
				checkSmuxRing = true;
			}
			if ( nullToEmpty(useNetworkPaths[i].TOPOLOGY_CFG_MEANS_CD) != "") {
				topoCfgMeansCd = useNetworkPaths[i].TOPOLOGY_CFG_MEANS_CD;
			}
		}
	}
	if ( checkSmuxRing && topoCfgMeansCd =="001" ){
		retrunValue = true
	}
	
	return retrunValue;
}


/**
 * checkSmuxAndTopoCfgMeansPTP 
 * @param chkPath
 * @returns retrunValue
 */
function checkSmuxAndTopoCfgMeansPTP(chkPath){

	var retrunValue = false
	var topoCfgMeansCd = "";
	var checkSmuxRing = "";
	var useNetworkPaths = chkPath.USE_NETWORK_PATHS;
	
	if (nullToEmpty(useNetworkPaths) != "") {
		for(var i = 0 ; i < useNetworkPaths.length; i++) {
			if ( nullToEmpty(useNetworkPaths[i].TOPOLOGY_SMALL_CD) == "035") {
				checkSmuxRing = true;
			}
			if ( nullToEmpty(useNetworkPaths[i].TOPOLOGY_CFG_MEANS_CD) != "") {
				topoCfgMeansCd = useNetworkPaths[i].TOPOLOGY_CFG_MEANS_CD;
			}
		}
	}
	if ( checkSmuxRing && topoCfgMeansCd =="002" ){
		retrunValue = true
	}
	
	return retrunValue;
}

/**
 * checkCmuxExt 
 * 회선 및 링에 포함된 링이 CMUX의 확장형인지 판단
 * @param chkPath
 * @returns retrunValue
 */
function checkCmuxExt(chkPath){

	var retrunValue = false
	var checkCmuxRing = false;
	var networkPaths = chkPath.NODES;
	
	if(chkPath.NODES.length > 0) {
		//RU광코어회선의 경우
		if(nullToEmpty(chkPath.LINE_SMALL_CD) == '101') {
			if(checkSmuxAndTopoCfgMeansPTP(chkPath)){
				if (nullToEmpty(networkPaths) != "") {
					for(var i = 0 ; i < networkPaths.length; i++) {
						if ( nullToEmpty(networkPaths[i].Ne.NE_ROLE_CD) == "52" || nullToEmpty(networkPaths[i].Ne.NE_ROLE_CD) == "53") {
							checkCmuxRing = true;
							break;
						}
					}
				}
			}
		//SMUX링의 경우
		} else {
			//TODO 추후 이중화가 개발되면 추가
			//SMUX이원화의 경우 - 우선 LMUX의 경우 PTP만 가능하므로 LMUX는 추가하지 않음
			if(checkSmuxAndTopoCfgMeansRing(chkPath)){
				if (nullToEmpty(networkPaths) != "") {
					for(var i = 0 ; i < networkPaths.length; i++) {
						if ( nullToEmpty(networkPaths[i].Ne.NE_ROLE_CD) == "52") {
							checkCmuxRing = true;
							break;
						}
					}
				}
			}
		}
			
		if ( checkCmuxRing ) { 
			/*
			 * CMUX의 확장형 카드를 쓴 경우 확장형으로 판단한다.
			 */
			for(var i = 0 ; i < networkPaths.length; i++) {
				if(isCmuxRnExtCard(networkPaths[i].APortDescr.CARD_MODEL_ID) || isCmuxRnExtCard(networkPaths[i].BPortDescr.CARD_MODEL_ID)){
					retrunValue = true;
				}
				//LMUX 확장형 - 2020-10-19
				if(isLmuxRnExtCard(networkPaths[i].APortDescr.CARD_MODEL_ID) || isLmuxRnExtCard(networkPaths[i].BPortDescr.CARD_MODEL_ID)){
					retrunValue = true;
				}
			}
		}
	}
	return retrunValue;
}

/* 5G-PON RU회선여부 */
function isFiveGponRuCoreLine() {
	
	if( typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined" && initParam.svlnLclCd == "003" && initParam.svlnSclCd == "101" && nullToEmpty(baseInfData.appltTypeOfFiveg) == "5G-PON") {
		return true;
	} else {
		return false;
	}
}

/* DCN, RMS, IP정류기 회선여부, 예비회선 추가 2023-11-08 */
function isDcnLine() {
	if( typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined" 
		&& initParam.svlnLclCd == "006" && ( initParam.svlnSclCd == "070" || initParam.svlnSclCd == "071" || initParam.svlnSclCd == "072" || initParam.svlnSclCd == "106" )) {
		return true;
	} else {
		return false;
	}
}

function isTrunk() {
	if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "002") {
		return true;
	} else {
		return false;
	}
}

function isRing() {
	if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001") {
		return true;
	} else {
		return false;
	}
}

function isPtp() {
	if( typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" && initParam.topoSclCd == "002" )  {
		return true;
	} else {
		return false;
	}
}

function isWdmTrunk() {
	if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "003" && initParam.topoSclCd == "101") {
		return true;
	} else {
		return false;
	}
}

// PBOX 추가  2019-12-24
function isFdfNe(neRoleCd) {
	if(neRoleCd == '11' || neRoleCd == '162' || neRoleCd == '177' || neRoleCd == '178' || neRoleCd == '182') {
		return true;
	} else {
		return false;
	}
}

//포트관련 체크
//ROTN 추가  2021-09-17
function isRotnNe(neRoleCd) {
	if(neRoleCd == '08') { 
		return true;
	} else {
		return false;
	}
}

//5G Smux장비
//5G_LMUX추가 (20200911)
//4G_LMUX장비 (20241113)
function isFGSmuxNe(neRoleCd, neMdlNm) {
	if((neRoleCd == '19' && nullToEmpty(neMdlNm).indexOf("5G-SMUX") == 0)
			|| (neRoleCd == '52' && nullToEmpty(neMdlNm).indexOf("5G-CMUX") == 0)
				|| (neRoleCd == '53' && nullToEmpty(neMdlNm).indexOf("5G-LMUX") == 0)
				|| (neRoleCd == '56' && nullToEmpty(neMdlNm).indexOf("4G-LMUX") == 0)
				) {
		return true;
	} else {
		return false;
	}
}

function comvertPathImage(category) {
	var path = getUrlPath() + "/resources/images/path/" + category + ".png";
	return path;
}

// 편집모드인지 상세보기 모드인지 구분
function isEdit() {
	if ($('#btnPrint').val() == undefined) {
		return true;
	} else {
		return false;
	}
}

/**
 * 선번에 따른 탭 표시
 */
function tabValidation() {
	if(isRing()) {
		$("#waveLengthTab").show();
		$("#btnLnRing").show();
		$("#btnEquipmentRing").show();
		$("#btnRingblockDiagram").show();
	} else if(isWdmTrunk()) {
		$("#channelTab").hide();
		
		$("#btnTrunkAdd").hide();
		$("#btnRingAdd").hide();
		$("#btnWdmTrunkAdd").hide();
		
		$("#useNetworkTabTitle").hide();
		$("#useNetwork").hide();
	}  
	
	if( isPtp() || isWdmTrunk() || isRuCoreLine() || isSmuxRing001() ) {
		$("#wkDiv").show();
		$("#sprDiv").show();
		
		/*$("#" + teamsGridId).alopexGrid("updateOption", { height: 200});
		$("#" + tagngoGridId).alopexGrid("updateOption", { height: 190});
		$("#" + teamsSrpGridId).alopexGrid("updateOption", { height: 190});*/
		
		// 주/예비가 표시되는 경우 상세정보탭의 높이를 조절해 줄 필요가 있음
		$('#detailInfoTab').css({height:"400px"});	
		$('.detailInfoTab').css({height:"370px"});	
	}
	
	$("#wkSprDiv").on("tabchange", function(e,index){
		cflineShowProgressBody();
		
		if(index == 0){
			// 주선번 조회
			$("#visualWkDiv").remove();
			$("#visualDiv").append("<div id=\"visualWkDiv\" style=\"width:100%; height:222px;\"></div>");	
			
			initDiagram();
			
			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			// 현재 teamsPath가 예비선번 이었던 경우 <= 주선번탭 연속해서 누르는 경우 주선번이 사라지는 버그대응
			if(teamsPath.WK_SPR_DIV_CD != '01') {
				teamsPathSpr = teamsPath;
				teamsPathDataSpr = teamsPathData;
				teamsShortPathDataSpr = teamsShortPathData;
			}
			
			teamsPath = teamsPathWk;
			teamsPathData = teamsPathDataWk;
			teamsShortPathData = teamsShortPathDataWk;
			
			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			teamsPath.WK_SPR_DIV_CD = '01';
			
		} else if(index == 1){			

			$("#wdmTrunkSprDiv").remove();
			$("#visualSprDiv").append("<div id=\"wdmTrunkSprDiv\" style=\"width:100%; height:200px;\"></div>");	
			
			initSprDiagram();
			
			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			// 현재 teamsPath가 주선번 이었던 경우 <= 예비선번탭 연속해서 누르는 경우 주선번이 사라지는 버그대응
			if (teamsPath.WK_SPR_DIV_CD != '02') {

				// 주선번 백업
				teamsPathWk = teamsPath;
				teamsPathDataWk = teamsPathData;
				teamsShortPathDataWk = teamsShortPathData;
			}
			
			
			teamsPath = teamsPathSpr;
			teamsPathData = teamsPathDataSpr;
			teamsShortPathData = teamsShortPathDataSpr;
			
			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			teamsPath.WK_SPR_DIV_CD = '02';
			
//			if(wdmTrunkSprOriginal != null ) {
//				// 예비선번 다이어그램에 셋팅
//				teamsPath = teamsPathSpr;
//				teamsPathData = teamsPathDataSpr;
//				teamsShortPathData = teamsShortPathDataSpr;
//			}  else 
//			if(teamsPathDataSpr != null){
//				teamsPath = teamsPathSpr;
//				teamsPathData = teamsPathDataSpr;
//				teamsShortPathData = teamsShortPathDataSpr;
//			} else {
//				teamsPath = new TeamsPath();
//				teamsPathData = null;
//				teamsShortPathData = null;
//			}
		}
		
		// 그리드
		teamsPathData = teamsPath.toData();
		$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
		
		var tangoPath = teamsPath.toTangoPath();
		var tangoPathData = tangoPath.toData(); 
		$('#'+tagngoGridId).alopexGrid('dataSet', tangoPathData.LINKS);
		
		nodeDataArray = [];
		linkDataArray = [];
		
		if(teamsPathData.NODES.length > 0) {
			generateNodes();
			generateLinks();
		}
		
		visualLinePath.clear();
		visualLinePath.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
		
		nodeSelectionAdornedPath();
		
		// rest seq
	    for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
	    	nodeDataArray[idx].SEQ = idx + 1;
	    }
	 
	    // 2019-01-15  5. 5G-PON고도화
		if (isFiveGponRuCoreLine() == true && index == 1) {
			visualLinePath.isEnabled = false;
		} 
		cflineHideProgressBody();
	});
}

function buttonValidation() {
	if(isServiceLine() && initParam.mgmtGrpCd == "0002") {
		$("#btnPathVerify").show();
	}
	
	if(isTrunk()) {
		$("#btnTrunkAdd").hide();
		// 2. [수정] 구 선번편집창을 기준으로 선택선번창의 추가버튼 제어
		// SKT인경우 WDM트렁크 추가할 수 없음
		if (typeof initParam.mgmtGrpCd != "undefined" && initParam.mgmtGrpCd != null && initParam.mgmtGrpCd != "null" && initParam.mgmtGrpCd != ""
			&& initParam.mgmtGrpCd == "0001") {
			$("#btnWdmTrunkAdd").hide();
		}

		// 2019-09-30  6. 기간망 링 선번 고도화 모든 경유링 보기
		if (initParam.mgmtGrpCd == "0001") {
			$('.cascadingRing').show();
		}
	}
	
	if(isRing()) {
		$("#btnTrunkAdd").hide();
		$("#btnRingAdd").hide();
		
		// PTP링만 예비선번
		if (isPtp()) {
			$("#btnReservePathChange").show();
		}		
		// SMUX이원화링의 경우 예비선번구현(토폴로지구성방식이 링타입) - 2020-07-14
		if (isSmuxRing001()) {
			$("#btnReservePathChange").show();
		}
		// 2. [수정] 구 선번편집창을 기준으로 선택선번창의 추가버튼 제어
		// SKT/가입자망링 인경우 WDM트렁크 추가할 수 없음
		if (typeof initParam.mgmtGrpCd != "undefined" && initParam.mgmtGrpCd != null && initParam.mgmtGrpCd != "null" && initParam.mgmtGrpCd != ""
			&& (initParam.mgmtGrpCd == "0001" || (initParam.topoLclCd == "001" && initParam.topoSclCd == "031"))
			) {
			$("#btnWdmTrunkAdd").hide();
		}
		
		// SKT 링에 링 추가
		if (initParam.mgmtGrpCd == "0001") {
			if (isMeshRing(initParam.topoSclCd) == true || isAbleViaRing(initParam.topoSclCd) == true) {
				$('#btnCascadingRingAdd').show();
				// SMUX링은 모든경유링 보기 제외
				if (isAbleViaRing(initParam.topoSclCd) == true && initParam.topoSclCd != "035") {
					// 2019-09-30  6. 기간망 링 선번 고도화
					$('.cascadingRing').show();
				}
			    if (isMeshRing(initParam.topoSclCd) == true) {
			    	$("#rontTrunkDisplayCheckbox1").show();
			    	$("#rontTrunkDisplayCheckbox2").show();
			    }
			}
		}
		// SKB
		else if (initParam.mgmtGrpCd == "0002") {
			if (initParam.topoSclCd == "031") {
				$('#btnCascadingRingAdd').show();
			}
		}
	}
	
	if(isWdmTrunk()) {
		$("#btnTrunkAdd").hide();
		$("#btnRingAdd").hide();
		$("#btnWdmTrunkAdd").hide();
		$("#btnPathCopy").show();
		$("#btnReservePathChange").show();
	}	
	
	// 1. [수정] RU광코어 링/예비선번 사용 - 서비스회선
	if (isServiceLine()) {
		/* 모든 경유링 보기
		 * WDM트렁크추가   - SKB-B2B/SKB-기타-기타회선 : 보임 
		                   - 그외 : 숨김
		                  
		   Ring추가        - WIFI : 숨김
		   
		   트렁크추가      - RU/중계기정합장치(L9TU)/WIFI/SKB-가입자망 : 숨김
		                   - 그외 : 보임
		   서비스회선 추가 - RU/중계기정합장치(L9TU) : 보임
		                   - 그외 : 숨김               		
		*/
		
		// 2019-09-30  6. 기간망 링 선번 고도화 모든 경유링 보기
		if (initParam.mgmtGrpCd == "0001") {
			$('.cascadingRing').show();
		}
		//1. WDM트렁크추가
		$("#btnWdmTrunkAdd").hide();
		if (typeof initParam.mgmtGrpCd != "undefined" && initParam.mgmtGrpCd != null && initParam.mgmtGrpCd != "null" && initParam.mgmtGrpCd != ""
			&& initParam.mgmtGrpCd == "0002"
			&& (initParam.svlnLclCd == "005" || (initParam.svlnLclCd == "006" && initParam.svlnSclCd == "005"))
			) {
			$("#btnWdmTrunkAdd").show();
		}
		
		// 2. Ring추가
		if (typeof initParam.mgmtGrpCd != "undefined" && initParam.mgmtGrpCd != null && initParam.mgmtGrpCd != "null" && initParam.mgmtGrpCd != ""
			&& initParam.mgmtGrpCd == "0001"
			&& initParam.svlnSclCd == "102"
			){
			$("#btnRingAdd").hide();
			$(".cascadingRing").hide();
		}
		
		// 3. 트렁크 추가
		if (typeof initParam.mgmtGrpCd != "undefined" && initParam.mgmtGrpCd != null && initParam.mgmtGrpCd != "null" && initParam.mgmtGrpCd != ""
			&& ((initParam.mgmtGrpCd == "0001" && (isRuCoreLine() || isRuMatchLine() || isDcnLine() || initParam.svlnSclCd == "102")  
				|| (initParam.mgmtGrpCd == "0002" && initParam.svlnSclCd == "201"))			
			   )
			){
			$("#btnTrunkAdd").hide();
		}
		
		/* RU광코어 예비선번 */
		if(isRuCoreLine()) {
			if (isFiveGponRuCoreLine() == false) {
				$("#btnReservePathChange").show();
			}
			
			$("#btnServiceAdd").show();
		}
		
		/* 중계기정합장치 사용서비스회선가능*/
		if(isRuMatchLine()) {
			//$("#btnServiceAdd").show();
		}
	}
		
	if(isServiceLine()) {
		if( (initParam.svlnLclCd == "001" && initParam.svlnSclCd == "001") 
				|| (initParam.svlnLclCd == "001" && initParam.svlnSclCd == "003")
				|| (initParam.svlnLclCd == "001" && initParam.svlnSclCd == "010")
				|| (initParam.svlnLclCd == "001" && initParam.svlnSclCd == "011")
				|| (initParam.svlnLclCd == "001" && initParam.svlnSclCd == "012")
				|| (initParam.svlnLclCd == "001" && initParam.svlnSclCd == "013")
				|| (initParam.svlnLclCd == "001" && initParam.svlnSclCd == "014") ) {
			$("#btnRmLinePathPop").show();
		}
	}
	
	// 구 선번 편집
	$('#btnPathEdit').on('click', function(e) {	
		if(typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined") {
			serviceLineInfoPop();
		} else if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "002") {
			trunkInfoPop();
		} else if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001") {
			ringInfoPop();
		} else if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "003" && initParam.topoSclCd == "101") {
			wdmTrunkInfoPop();
		}
	});
	
	// 20-02-10 
	// SKB 서비스회선
	if(initParam.mgmtGrpCd == "0002") {
		// B2B 회선, 기타회선 일 경우
		
		if( (nullToEmpty(initParam.svlnLclCd == "005") && nullToEmpty(initParam.svlnSclCd == "009"))
			|| (nullToEmpty(initParam.svlnLclCd == "006") && nullToEmpty(initParam.svlnSclCd == "005"))	
		) {
			// 005 B2B회선 / 009 B기업회선, 006기타회선 / 005 기타
			
			// 구간뒤집기 버튼 hide
			$("#btnPathReverse").hide();
			
			// 트렁크 추가버튼 hide
			$("#btnTrunkAdd").hide();
			
			// 링 추가버튼 hide
			$("#btnRingAdd").hide();
			
			// WDM트렁크 추가버튼 hide
			$("#btnWdmTrunkAdd").hide();
			
		}
		
		// 트렁크(002), 링(001), WDM트렁크(003)일 경우
		// SKB링의 경우 선번뒤집기가 가능하도록 개선 - 2025-01-22 이재락M
		if( nullToEmpty(initParam.topoLclCd == "002") || nullToEmpty(initParam.topoLclCd == "001") || nullToEmpty(initParam.topoLclCd == "003") ) {
			if( !nullToEmpty(initParam.topoLclCd == "001") ) {
				// 구간뒤집기 버튼 hide
				$("#btnPathReverse").hide();
			}
			
			// 트렁크 추가버튼 hide
			$("#btnTrunkAdd").hide();
			
			// 링 추가버튼 hide
			$("#btnRingAdd").hide();
			
			// WDM트렁크 추가버튼 hide
			$("#btnWdmTrunkAdd").hide();
		}
		
	}
	
	//선로검색 버튼은 회선, 링, 트렁크, SKT 외의 경우 숨김
	//선로개통에서는 mgmtGrpCd값이 넘어오지 않기 때문에 '' 추가 - 20201012
	if(!isServiceLine() && ( nullToEmpty(initParam.topoLclCd != "001") && nullToEmpty(initParam.topoLclCd != "002") )
			 || (nullToEmpty(initParam.mgmtGrpCd) != '0001' && nullToEmpty(initParam.mgmtGrpCd) != '')
			) {
		// 장비선로버튼
		$("#btnEqpNodeInfo").hide();
	} else {
		$("#btnEqpNodeInfo").show();
	}

	//상위OLT장비등록 버튼은 SKB그룹의 가입자망링 외의 경우 숨김
	if(!isRing() && ( nullToEmpty(initParam.topoLclCd != "001") && nullToEmpty(initParam.topoLclCd != "031") )
			 || (nullToEmpty(initParam.mgmtGrpCd) != '0002' && nullToEmpty(initParam.mgmtGrpCd) != '')
			) {
		// 상위OLT장비등록버튼
		$("#btnOltEqpReg").hide();
	} else {
		$("#btnOltEqpReg").show();
	}
} 


/**
 * 선택 선번에서 편집을 위해 네트워크 또는 장비를 드랍했을 때
 * @param e
 */
function finishDrop(e) {
	try {
		moveYn = false;
		
		if(e.Dq == undefined) {
			// 2019-12-17 키보드 이벤트(ctrl+v로 finishiDrop 발생)
			moveYn = false;
		} else if(e.Dq.currentTarget == null) {
			// e.Dq.currentTarget == null : 선택선번에서 드랍
			moveYn = false;
		} else if(e.Dq.currentTarget != null){
			// e.Dq.currentTarget != null : move
			moveYn = true;
		}
		
		var selectedPath = e.diagram.selection.Da.key;
		selectedPathData = selectedPath.data;
		
		var networkNe = null;
		if(TeamsNode.prototype.isPrototypeOf(selectedPathData)) {
			if(selectedPathData.isGroup) {
				networkNe = "NETWORK";
			} else {
				networkNe = "NE";
			}
		} else if(TeamsPath.prototype.isPrototypeOf(selectedPathData)) {
			networkNe = "NETWORK";
		}
		
		var nodeId = "";
		
		if(e.Ob == "ClipboardPasted") {
			// 2019-12-17 키보드 이벤트(ctrl+v로 finishiDrop 발생)
			// 제일 마지막 위치에 node가 drop되므로 nodeId는 null
			nodeId = null;
		} else {
			// 2019-12-17 마우스 drop event
			nodeId = genereteDropNodeId(e, networkNe, selectedPath, selectedPathData);
		}
		
		var infData = null;
		if( isRing() ) {
			infData = baseInfData[0];
		} else {
			infData = baseInfData;
		}
		
		teamsPath.NETWORK_ID = nullToEmpty(teamsPath.NETWORK_ID) == "" ? infData.ntwkLineNo : teamsPath.NETWORK_ID;
		teamsPath.NETWORK_STATUS_CD = nullToEmpty(teamsPath.NETWORK_STATUS_CD) == "" ? infData.ntwkStatCd : teamsPath.NETWORK_STATUS_CD;
		teamsPath.NETWORK_TYPE_CD = nullToEmpty(teamsPath.NETWORK_TYPE_CD) == "" ? infData.ntwkTypCd : teamsPath.NETWORK_TYPE_CD;
		teamsPath.TOPOLOGY_LARGE_CD = nullToEmpty(teamsPath.TOPOLOGY_LARGE_CD) == "" ? infData.topoLclCd : teamsPath.TOPOLOGY_LARGE_CD;
		teamsPath.TOPOLOGY_SMALL_CD = nullToEmpty(teamsPath.TOPOLOGY_SMALL_CD) == "" ? infData.topoSclCd : teamsPath.TOPOLOGY_SMALL_CD;
		teamsPath.TOPOLOGY_CFG_MEANS_CD = nullToEmpty(teamsPath.TOPOLOGY_CFG_MEANS_CD) == "" ? infData.topoCfgMeansCd : teamsPath.TOPOLOGY_CFG_MEANS_CD;
		
		// 서비스회선정보
		teamsPath.LINE_STATUS_CD = nullToEmpty(teamsPath.LINE_STATUS_CD) == "" ? infData.svlnStatCd : teamsPath.LINE_STATUS_CD;
		teamsPath.LINE_LARGE_CD = nullToEmpty(teamsPath.LINE_LARGE_CD) == "" ? infData.svlnLclCd : teamsPath.LINE_LARGE_CD ;
		teamsPath.LINE_SMALL_CD = nullToEmpty(teamsPath.LINE_SMALL_CD) == "" ? infData.svlnSclCd : teamsPath.LINE_SMALL_CD;
		
		// 선번 추가
		if(!moveYn) {
			if(networkNe == "NE") {
				if(selectedOriginalPath[selectedPathData.NE_ID] == undefined) {
					throw new PathException( {code:"", message:"추가할수 없는 장비입니다."}, "" );
				} else {
					var __gohashid = selectedOriginalPath[selectedPathData.NE_ID].__gohashid; 
					delete selectedOriginalPath[selectedPathData.NE_ID].__gohashid;
					
					selectedPathData = teamsPath.insertNode(nodeId, selectedOriginalPath[selectedPathData.NE_ID]);
					selectedOriginalPath[selectedPathData.NE_ID].__gohashid = __gohashid;
				}
			} else if(networkNe == "NETWORK"){
				/** 2018-09-12  4. RU고도화
				 *  사용서비스회선은 서비스회선에서 1건만 등록할 수 있기때문에 기존 선번에 사용서비스회선이 존재하는지 체크함
				 */
				if (selectedPathData.NETWORK_ID.indexOf("S") == 0) {  // 서비스회선인 경우
					if (teamsPath.checkUseLineCnt(selectedPathData.NETWORK_ID) == 0) {   // 사용네트워크중복체크
						selectedPathData = teamsPath.insertNode(nodeId, selectedOriginalPath[selectedPathData.NETWORK_ID]);	
					} else {
						callMsgBox('', 'W', "이미 사용서비스회선이 설정되어 있습니다. <br>서비스회선 참조는 회선당 1개의 서비스회선만 참조가능합니다.");
					}
				}
				else {
					// 추가하는 네트워크가 링인경우 RU광코어회선은 제한을 둠.
					if (selectedPathData.category == "RING" && isRuCoreLine() == true && checkUseRingAtRuPath(teamsPath.toTangoPath().toData()) == true ) {
						alertBox('W', "RU광코어회선은 1개의 링만 사용가능합니다.");
					} 
					// SMUX링인경우 1갱의 사용링만 참조가능함
					else if (selectedPathData.category == "RING" && isSmuxRing() == true && checkUseRingAtRuPath(teamsPath.toTangoPath().toData()) == true) {
						alertBox('W', "SMUX링은 1개의 경유링만 사용가능합니다.");
					}
					else {
						selectedPathData = teamsPath.insertNode(nodeId, selectedOriginalPath[selectedPathData.NETWORK_ID]);	
					}				
				}
			}
		} else {
			if(selectedPathData.NODE_ID == nodeId) {
				visualLinePath.currentTool.doCancel();
				dragCancle();
			} else {
				teamsPath.moveNode(selectedPathData.NODE_ID, nodeId);
			}
		}
		
		reGenerationDiagram(true);
		
	} catch (err) {
		var errMsg = err.message;
		if(err.code != "001" && err.code != "002") {
			callMsgBox('', 'I', errMsg);
		}  
		visualLinePath.currentTool.doCancel();
		dragCancle();
	}
}

function genereteDropNodeId(e, networkNe, selectedPath, selectedPathData) {
	var nodeId = -1;
	var nodeSeq = -1;
	var nodeSeqCnt = 0;
	if(e.targetDiagram == null) {
		throw new PathException( {code:"", message:"Drop 위치가 다이어그램을 벗어났습니다."}, "" );
	}
	var it = e.targetDiagram.nodes.iterator;
	
	/*
	 * 드랍된 위치의 x좌표로 해당 node 찾기
	 * 1. 맨 처음 위치에 드랍이 되었을 때
	 *    - 기존 선번의 첫 노드ID
	 * 2. 중간 위치에 드랍이 되었을 때
	 *    - 드랍된 위치의 뒷 노드ID
	 * 3. 마지막 위치에 드랍이 되었을 때
	 *    - NULL
	 */
	while(it.next()) {
		var node = it.key;
		
		var x = node.location.x;
		if( (node.data != selectedPath.data) && (node.data.group != selectedPath.data.key) ) {
			// groupKey != node.data.group &&
			if(  x > selectedPath.location.x) {
				if(nodeId < 0) {
					nodeId = node.data.NODE_ID;
					nodeSeq = nodeSeqCnt;
				} 
			} 
		}
		nodeSeqCnt++;
	}
	
	/*
	 * 드랍노드부터 찾아가되 다음 노드가 없을 경우 -> 마지막 위치에 DROP : NODE_ID를 NULL로 변경 
	 */
	if(networkNe == "NE") {
		if(nodeId < 0) nodeId = null;
	} else if(networkNe == "NETWORK"){
		if(nodeId < 0) {
			nodeId = null;
		} else {
			if(nodeSeq == nodeSeqCnt) {
				nodeId = null;
			} else if(nodeDataArray.length < 1) {
				nodeId = null;
			} else {
			}
		}
	}
	
	return nodeId;
}

/**
 * 노드 삭제
 * @param node
 */
function removeNode(node) {
	teamsPath.removeNode(node.data.NODE_ID);
	
	reGenerationDiagram(true);
	
	// 2019-01-15  5. 5G-PON고도화 주선번이 모두 삭제된 경우 예비선번도 모두 삭제한다
	if (isFiveGponRuCoreLine() == true && $("#wkSprDiv").getCurrentTabIndex() == "0") {
		removeSprAllNode();
	}
}

/**
 * 노드 삭제
 * @param node
 */
function removeSprAllNode() {
	// 주선번이 한개도 없는경우
	if (teamsPathWk.NODES.length == 0) {
		// 예비선번 모두 삭제
		wdmTrunkSprOriginal = null;
		teamsPathSpr = new TeamsPath();
		teamsPathDataSpr = null;
		teamsShortPathDataSpr = null;
		reservePathSameNo = "";
	}
}

function removePort(node, target) {
	var data = node.data;
	if( target == "EAST_PORT_CONTEXT" ) {
		// APort
		data.APortDescr = new PortDescr();
		data.EAST_CHANNEL_DESCR = "";
		data.EAST_PORT_CHANNEL = "";
		data.EAST_PORT_ID = "";
		data.EAST_PORT_NM = "";
	} else if( target == "WEST_PORT_CONTEXT" ) {
		// BPort
		data.BPortDescr = new PortDescr();
		data.WEST_CHANNEL_DESCR = "";
		data.WEST_PORT_CHANNEL = "";
		data.WEST_PORT_ID = "";
		data.WEST_PORT_NM = "";
	}
	
	for(var idx = 0; idx < teamsPath.NODES.length; idx++ ) {
		var node = teamsPath.NODES[idx];
		if(node.NODE_ID == data.NODE_ID) {
			teamsPath.NODES[idx] = data;
			break;
		}
	}
	reGenerationDiagram(true);
}

/**
 * E2E적용
 */
function e2eApply(node) {
	var eqpData = node.data.Ne;
	var eqpPortData = node.data.APortDescr;
	fdfNodeId = node.data.NODE_ID;
	
	if(eqpPortData.PORT_ID == "0" || eqpPortData.PORT_ID == "" ) {
		eqpPortData = node.data.BPortDescr;
	}
	
	// 2018-09-12  4. RU고도화 RX포트
	if(eqpPortData.PORT_ID != "0" && eqpPortData.PORT_ID != "") {
		cflineShowProgressBody();
					
		var eqpParam = {"lftEqpId" : eqpData.NE_ID, "lftPortNm" : eqpPortData.PORT_NM, "lftEqpInstlMtsoId" : eqpData.ORG_ID , "lftRxPortNm" : eqpPortData.RX_PORT_NM};
		if (isFiveGponRuCoreLine() == false ) {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectGisFdfE2E', eqpParam, 'GET', 'e2eApplay');
		} else {
			eqpParam = {"eqpId" : eqpData.NE_ID, "portNm" : eqpPortData.PORT_NM, "mtsoId" : eqpData.ORG_ID, "rxPortNm" : eqpPortData.RX_PORT_NM};
			eqpParam.appltTypeOfFiveg = baseInfData.appltTypeOfFiveg;
			eqpParam.ntwkLineNo = initParam.ntwkLineNo;
			eqpParam.lowMtsoId = nullToEmpty(baseInfData.lowMtsoId);
			eqpParam.fiveGponVer = nullToEmpty(baseInfData.fiveGponVer);
			eqpParam.callViewType ="V";  // V : 시각화
			// ETE적용을 클릭한 장비의 국사와 다음 장비의 국사가 같으면 뒤(true)에서 시작한것으로 인지
			
			var nextNode = teamsPath.findNextNodeById(fdfNodeId);
			var preNode = teamsPath.findPreNodeById(fdfNodeId);
			if (eqpData.ORG_ID == nextNode.Ne.ORG_ID) {
				eqpParam.generateLeft = true;  // RU연결장비부터 조회
			} else if (eqpData.ORG_ID == preNode.Ne.ORG_ID) {
				eqpParam.generateLeft = false;  // 시작구간부터 조회
			} else {
				eqpParam.generateLeft = true;  // RU연결장비부터 조회
			}
			
			var crnDataObj = $('#'+teamsGridId).alopexGrid("dataGet", {'B_FIVE_GPON_EQP_TYPE' :'CRN'}, 'B_FIVE_GPON_EQP_TYPE');
			if (crnDataObj.length > 0 && crnDataObj[0]._index.row) {
				eqpParam.crnEqpId = crnDataObj[0].NE_ID;    // CRN장비ID
				eqpParam.crnEqpNm = crnDataObj[0].NE_NM;    // CRN장비명
				eqpParam.crnPortId = crnDataObj[0].B_PORT_ID; // CRN장비의 WEST(B)포트 
				eqpParam.crnPortNm = crnDataObj[0].B_PORT_NM; // CRN장비의 WEST(B)포트 명
				eqpParam.eqpInstlMtsoId = crnDataObj[0].ORG_ID; // CRN장비의 WEST(B)장비실장국사
				
			}
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectEteInfWithEqpList', eqpParam, 'GET', 'e2eApplayWithUseNetwork');
		}
	} else {
//		console.log('E2E적용 불가');
		alertBox('W', '포트를 선택해주세요');
	}
}

/** TODO
 * 자동 E2E적용
 */
function e2eApplyAuto(node) {
	var eqpData = node.Ne;
	var eqpPortData = node.APortDescr;
	fdfNodeId = node.NODE_ID;
	
	if(eqpPortData.PORT_ID == "0" || eqpPortData.PORT_ID == "" ) {
		eqpPortData = node.BPortDescr;
	}

	// 2018-09-12  4. RU고도화 RX포트
	if(eqpPortData.PORT_ID != "0" && eqpPortData.PORT_ID != "") {
		cflineShowProgressBody();
					
		var eqpParam = {"lftEqpId" : eqpData.NE_ID, "lftPortNm" : eqpPortData.PORT_NM, "lftEqpInstlMtsoId" : eqpData.ORG_ID , "lftRxPortNm" : eqpPortData.RX_PORT_NM};
		if (isFiveGponRuCoreLine() == false ) {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectGisFdfE2E', eqpParam, 'GET', 'e2eApplay');
		} else {
			eqpParam = {"eqpId" : eqpData.NE_ID, "portNm" : eqpPortData.PORT_NM, "mtsoId" : eqpData.ORG_ID, "rxPortNm" : eqpPortData.RX_PORT_NM};
			eqpParam.appltTypeOfFiveg = baseInfData.appltTypeOfFiveg;
			eqpParam.ntwkLineNo = initParam.ntwkLineNo;
			eqpParam.lowMtsoId = nullToEmpty(baseInfData.lowMtsoId);
			eqpParam.fiveGponVer = nullToEmpty(baseInfData.fiveGponVer);
			eqpParam.callViewType ="V";  // V : 시각화
			// ETE적용을 클릭한 장비의 국사와 다음 장비의 국사가 같으면 뒤(true)에서 시작한것으로 인지
			eqpParam.generateLeft = true;  // RU연결장비부터 조회
			
			var crnDataObj = $('#'+teamsGridId).alopexGrid("dataGet", {'B_FIVE_GPON_EQP_TYPE' :'CRN'}, 'B_FIVE_GPON_EQP_TYPE');
			if (crnDataObj.length > 0 && crnDataObj[0]._index.row) {
				eqpParam.crnEqpId = crnDataObj[0].NE_ID;    // CRN장비ID
				eqpParam.crnEqpNm = crnDataObj[0].NE_NM;    // CRN장비명
				eqpParam.crnPortId = crnDataObj[0].B_PORT_ID; // CRN장비의 WEST(B)포트 
				eqpParam.crnPortNm = crnDataObj[0].B_PORT_NM; // CRN장비의 WEST(B)포트 명
				eqpParam.eqpInstlMtsoId = crnDataObj[0].ORG_ID; // CRN장비의 WEST(B)장비실장국사
				
			}
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectEteInfWithEqpList', eqpParam, 'GET', 'e2eApplayWithUseNetwork');
		}
	} else {
//		console.log('E2E적용 불가');
		alertBox('W', '포트를 선택해주세요');
	}
}
/**
 * A,B 포트 바꾸기
 */
function swapPort(node) {
	for ( var nodeIdx = 0; nodeIdx < teamsPath.NODES.length; nodeIdx++ ) {
		var teamsNode = teamsPath.NODES[nodeIdx];
//		if( teamsNode.SEQ == node.data.SEQ) {
		if( teamsNode.NODE_ID == node.data.NODE_ID) {
			teamsNode.swapPort();
		}
	}
	reGenerationDiagram(true);
}

/**
 * 선번 추가 및 삭제 후 refresh
 */
function reGenerationDiagram(adornedYn) {
	// shortpath 재생성
	teamsShortPathData = teamsPath.toShortPath();
	
	// 그리드
	teamsPathData = teamsPath.toData();
	$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
	
	var tangoPath = teamsPath.toTangoPath();
	var tangoPathData = tangoPath.toData(); 
	$('#'+tagngoGridId).alopexGrid('dataSet', tangoPathData.LINKS);
	
	nodeDataArray = [];
	generateNodes();
	
	linkDataArray = [];
	generateLinks();
	
	visualLinePath.clear();
	visualLinePath.clearSelection();
	visualLinePath.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
	
	if(adornedYn) {
		nodeSelectionAdornedPath();
	}
	
	// rest seq
    for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
    	nodeDataArray[idx].SEQ = idx + 1;
    }
    
    visualLinePath.contentAlignment = go.Spot.Center;
}

function dragCancle() {
	generateLinks();
	
//	for( var idx = 0; idx < linkDataArray.length; idx++ ) {
//		var link = linkDataArray[idx];
//		if(link.__gohashid != undefined) {
//			delete link.__gohashid;
//		}
//	}
	
	visualLinePath.model.linkDataArray = linkDataArray;
}

/**
 * reset temasPath
 */
function resetTeamsPath() {
	nodeDataArray = [];
	linkDataArray = [];
	originalPath = null;
	teamsPathData = null;
	teamsShortPathData = null;
	teamsPath = new TeamsPath();
	
	$("#visualWkDiv").remove();
	$("#visualDiv").append("<div id=\"visualWkDiv\" style=\"width:100%; height:222px; vertical-align: center;\"></div>");	
	initDiagram();
	
	// 그리드
	teamsPathData = teamsPath.toData();
	$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
	
	var tangoPath = teamsPath.toTangoPath();
	var tangoPathData = tangoPath.toData(); 
	$('#'+tagngoGridId).alopexGrid('dataSet', tangoPathData.LINKS);
}

/**
 * rest 트렁크, 링, wdm트렁크
 */
function diagramReset() {
	$("#useNetworkDiv").remove();
	//$("#trunkDiv").remove();
	$("#ringDiv").remove();
	//$("#wdmDiv").remove();
	
	// 트렁크
	useNetworkDiagram = null;
	originalUseNetworkPath = null;
	nodeUseNetworkDataArray = [];
	linkUseNetworkDataArray = [];
	teamsUseNetworkPath = new TeamsPath();
	
	// 트렁크
	/*trunkDiagram = null;
	originalTrunkPath = null;
	
	nodeTrunkDataArray = [];
	linkTrunkDataArray = [];
	teamsTrunkPath = new TeamsPath();*/
	
	// 링
	ringDiagram = null;
	nodeRingDataArray = [];
	originalRingPath = null;
	teamsRingPath = new TeamsPath();
	originalTeamsPath = new TeamsPath();
	isPtpRing = false;
	isDisplayLinear = false;
	
	// WDM
	/*wdmDiagram = null;
	originalWdmPath = null;
	
	nodeWdmDataArray = [];
	linkWdmDataArray = [];
	teamsWdmPath = new TeamsPath();*/
}


/**
 * 선번 뒤집기
 *  - 항상 표시
 */
function pathReverse() {
	if(teamsPath.NODES.length > 0) {
		teamsPath.reversePath();
		reGenerationDiagram(true);
	} else {
		return;
	}
}

/**
 * 기지국회선	- LTE회선
 * RU회선		- RU회선
 * SKT		- B2B회선, 기타회선-기타
 * SKT		- 트렁크
 * @param workYn
 * @returns {Boolean}
 */
function auth(workYn) {
	var rtn = true;
//	if(isServiceLine()) {
//		// 서비스 회선
//		if(	(svlnLclCd == "001" && svlnSclCd == "016") 
//				|| (svlnLclCd == "003" && svlnSclCd == "103")
//				|| ( mgmtGrpCd =="0001" && ((svlnLclCd == "005") || (svlnLclCd == "006" && svlnSclCd =="005") ) )) {
//			rtn = false;
//		}
//	} else if(isTrunk()) {
//		// 트렁크
//		if( topoLclCd == '002' && topoSclCd == '100') {
//			rtn = false;
//		}
//	}
	
//	if(!rtn) {
//		$("#btnPathReverse").setEnabled(false);
//		$("#btnSave").setEnabled(false);
//		$("#btnApply").setEnabled(false);
//		divDisable("channelDiv", true);
//		
//		// 선택 선번 탭 활성화
//		$("#selectPathTabTitle").show();
//		$("#selectPath").show();
//	}
	
	
//	if(workYn != "Y") {
//		$("#btnPathReverse").setEnabled(false);
//		$("#btnSave").setEnabled(false);
//		$("#btnApply").setEnabled(false);
//		divDisable("channelDiv", true);
//		return false;
//	}
 
	return rtn;
}


function baseInfoHide() {
	/*more_condition script*/
	$('#moreSpan > .arrow_more').click(function(){
		var $this = $(this);
		
		var $condition_box = $this.closest('.popup');
		var $more_condition = $condition_box.find('.path_hide');
		if($more_condition.css('display') == 'none'){
			$this.addClass('on')
			$more_condition.show();
		}else{
			$this.removeClass('on')
			$more_condition.hide();
		}
	});
	
	$('#ruleSpan > .arrow_more').click(function(){
		var $this = $(this);
		
		var $condition_box = $this.closest('.portChannel');
		var $more_condition = $condition_box.find('.ruleDiv');
		if($more_condition.css('display') == 'none'){
			$this.addClass('on')
			$more_condition.show();
			
			$("#portChannelDiv").css("height", "29vh");
			$("#channel").css("height", "20vh");
			$("#channelLeft").css("height", "20vh");
			$("#channelRight").css("height", "20vh");
			$('#'+portGridId).alopexGrid("updateOption", { height: 200});
			$("#waveLength").alopexGrid("updateOption", { height: 200});
			$("#"+portGridId).alopexGrid("viewUpdate");
			$("#waveLength").alopexGrid("viewUpdate");
		}else{
			$this.removeClass('on')
			$more_condition.hide();
			
			// 그리드 높이 조정. 포트/채널 영역 높이 조정
			$("#portChannelDiv").css("height", "44vh");
			$("#channel").css("height", "35vh");
			$("#channelLeft").css("height", "35vh");
			$("#channelRight").css("height", "35vh");
			$('#'+portGridId).alopexGrid("updateOption", { height: 340});
			$("#waveLength").alopexGrid("updateOption", { height: 340});
			$("#"+portGridId).alopexGrid("viewUpdate");
			$("#waveLength").alopexGrid("viewUpdate");
		}
	});
}

/**
 * context menu에서 상세 팝업 오픈
 * @param node
 */
function networkInfoPop(node) {
	var category = node.data.category;
	if(category == "TRUNK") {
		var title = "트렁크상세정보";
		var url = getUrlPath() +'/configmgmt/cfline/TrunkInfoDiagramPop.do';
		
		$a.popup({
			popid: "TrunkInfoDiagramPop" + "Detail",
			title: title,
			url: url,
			data: {"gridId":"dataGridWork", "ntwkLineNo":node.data.NETWORK_ID, "sFlag":"Y", "mgmtGrpCd":"", "topoLclCd":"002"},
			iframe: true,
			modal : false,
			movable : true,
			windowpopup : true,
			width : 1400,
			height : 940,
			callback:function(data){
			}
		});
	} else if(category == "RING") {
		var title = "링상세정보";
		var url = getUrlPath() +'/configmgmt/cfline/RingInfoDiagramPop.do';
		
		$a.popup({
			popid: "RingInfoDiagramPop" + "Detail",
			title: title,
			url: url,
			data: {"gridId":"dataGridWork", "ntwkLineNo":node.data.NETWORK_ID, "sFlag":"Y", "mgmtGrpCd":"", "topoLclCd" : "002", "topoSclCd" : "100"},
			iframe: true,
			modal : false,
			movable : true,
			windowpopup : true,
			width : 1400,
			height : 940,
			callback:function(data){
			}
		});
	} else if(category == "WDM_TRUNK") {
		var title = "WDM트렁크 상세정보";
		//var url = getUrlPath() +'/configmgmt/cfline/WdmTrunkInfoDiagramPop.do';
		var url = getUrlPath() +'/configmgmt/cfline/WdmTrunkDetailPop.do';
		
		$a.popup({
			popid: "WdmTrunkDetailPop" + "Detail",
			title: title,
			url: url,
			data: {"gridId":"dataGridWork", "ntwkLineNo":node.data.NETWORK_ID, "sFlag":"Y", "mgmtGrpCd":"", "topoLclCd" : "003", "topoSclCd" : "101"},
			iframe: true,
			modal : false,
			movable : true,
			windowpopup : true,
			width : 1600,
			height : 940,
			callback:function(data){
			}
		});
	}
}


//function dragSelectSection() {
//	var selection = $go(RealtimeDragSelectingTool,
//							{ isPartialInclusion:true, delay:50 },
//							{ box : $go(go.Part,
//											{layerName: "Tool", selectable:false },
//											$go(go.Shape,
//													{ name: "SHAPE", fill : "rgb(255, 0, 0, 0.1)", stroke: "red", strokeWidth: 2}
//											)
//							)}
//					);
//	return selection; 
//}