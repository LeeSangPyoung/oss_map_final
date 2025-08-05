/**
 * NetworkPathVisualizationPop.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0 *   
 * 
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-03-12  2. [수정] RM선번편집 창 자동열기
 * 2018-04-02  3. [수정] 주선번/예비선번 탭 선택시 버그수정
 *                NetworkPathVisualizationCommon.js도 꼭 확인바람 
 *                주선번이든 예비선번이든 탭을 치환하거나 예비선번으로 변경을 수행할때 
 *                주선번과 예비선번 값을 보존 혹은 상호치환하는 작업시 teamsPath.WK_SPR_DIV_CD 값을 통해 이루어 지고 있음.
 *                주선번/예비선번 관련 작업시 해당 값 설정을 명확히 해주어야 함. 
 * 2018-04-26  4. [수정]가입자망인 경우 선번그룹번호 전송  
 * 2018-12-04  5. [수정]SMUX링/서비스회선 고도화 selectSvlnLinePath/selectSmuxRingPathInfo/autoProcSmuxRingToSvlnNo/updateSmuxRingNameByCotNm 추가함
 * 				  selectSvlnLinePath : SMUX링에서 기설서비스회선 정보취득하여 FDF~FDF정보셋팅
 * 				  selectSmuxRingPathInfo : SMUX관련 RU에서 기설/신설 링 정보취득하여 사용링 정보셋팅
 * 				  autoProcSmuxRingToSvlnNo : SMUX링에서 선번이 정상적으로 등록된 경우 행당 링을 기설 서비스회선에서 사용링 선번으로 구현하여 선번 교체
 * 				  updateSmuxRingNameByCotNm : SMUX링에서 COT장비가 첫 구간으로 설정된 경우 링명에 해당 장비의 번호가 없으면 링명을 업데이트 처리해줌
 * 
 * 2018-09-12  6. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리
 * 2019-01-08  7. 5G-PON고도화  5G-PON링에 COT장비가 설정된 경우 링명에 해당 장비의 번호가 없으면 링명을 업데이트 처리해줌 updateFiveGRingNameByCotNm(Common.js에 존재)
 * 2019-01-15  8. 5G-PON고도화  5G-PON RU에 주선번이 있는 경우 주선번의 사용링의 역방향으로 예비회선 자동선번생성 처리해줌 autoProcSprPathOfFgPonSvlnLine
 *                              5G-PON RU의 ETE적용시 사용가능한 CRN장비 및 사용링 자동처리 selectEteInfWithEqpList 
 *                              5G-PON RU중 장비ENG 에서 설정한 CRN 파장기준 장비모델 추출-> 해당 모델을 사용하는 서비스회선 선번복제  copySvlnPathInfoByCrn
 * 2019-09-30  9. 기간망 링 선번 고도화 : openUseRingRontTrunkSearchPopNew로 링/기간망 트렁크 조회하여 링에서 경유링을 설정 할 수 있게 처리함
 * 2020-01-06  7. 시각화편집 COPY & PASTE 기능 추가
 * 2020-01-06  8. PBOX 코드(182)  추가
 * 2020-04-16  10. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 * 2020-05-19 11. SMUX링 경유링 사용
 *                경유링은 1차 까지만 참조가능
 *                경유링으로 사용가능한 종류 : SMUX링 
 * 2020-06-10  12. 예비선번 구현 : 서비스회선 저장시 추가된 CMUX링이 이원화된 링이면서 확장형인 경우 예비선번 구현
 *                           : Cascade한 링이 CMUX이원화로 구성되어있는 SMUX링인 경우 저장시에 예비선번도 구성해서 저장함
 * 2020-08-03  13. 회선 및 링의 경우 선로정보를 팝업으로 보여주고 선택후 이동시 ETE연결까지 자동으로 화면에 셋팅 
 *                 openFdfListPop : 선로리스트 팝업
 * 2020-08-03  14. 가입자망링 경유링 사용 
 *                경유링은 1차 까지만 참조가능
 *                경유링으로 사용가능한 종류 : BC-MUX링, CWDM-MUX링 
 *                가입자망 편집시 자동수정대상 목록 추출 파람에 ntwkLnoGrpSrno 셋팅
 * 2021-03-08  15. 상위OLT장비등록 openOltEqpListPop
 * 2021-05-13  16. useRingPopChk
 *                SKB의 경유링 추가시 일반경유링, 전송망링추가 선택할수 있는 팝업  (openUseBtbEqpRingPop) 
 *                (FDF장비에서 검색하는 경우 FDF장비의 국사에 속하는 FDF장비를 제외한 장비가 속한 모든 링(가입자망제외) 을 검색해서 보여준다
 * 2021-06-08  17. selectLinePath
 *                기지국회선의경우 인접 사용네트워크처리를 하지 않는다. - TeamsPath 수정
 *                (dummy장비가 저장되는 경우 DCS일치율에 영향을 끼치기 때문에) 
 * 2024-09-11  18. [수정] ADAMS관련 편집불가였던 내용에 대해 원복 - 모든링에 대해 관리주체제한없이 편집가능                
 */ 
   

/*
 * 저장작업과 관련하여 여러 체크가 존재해 해당 메소드명 정리함
 * 1) 저장버튼/그리드내 저장메뉴 				: preSavePath()
 * 2) preSavePath() - RU회선_광코어의 경우		: 사용서비스회선 체크 checkUseServiceLine()
 *                  - 경유링사용 가능 링인경우  : 사용링 체크 checkUseRingNtwk()
 *    preSavePath() - RU회선_광코어 이외 경우   : 저장작업 진행 savePath()
 * 3) checkUseServiceLine() 사용서비스회선 체크 : 정상 사용인 경우 저장작업 진행 savePath()
 *    checkUseRingNtwk() 사용링체크             : 정상 사용인 경우 저장작업 진행 savePath()
 * 4) savePath() 								:  저장 작업
 *                 
 */

/* 시각화 편집창에서 저장시 flag 정리
 * 주선번만 존재하는 회선인경우 : saveLinePath(서비스회선) / saveNetworkPath(네트워크회선) 
 *                              / saveNetworkPathSelectChangeAfter(가입자망링 선번선택 셀렉트 박스의 값을 변경하여 저장)/saveNetworkPathLineInsertAfter(가입자망링에선 신규선번 버튼을 클릭하여 기존선번 저장시)
 * 주선번/예비선번이 존재하는 회선인 경우 : saveLinePath(서비스회선 주선번 저장) -> saveLinePathReserve(서비스회선 예비선번 저장) 
 *                                          saveNetworkPath(네트워크회선 주선번 저장) -> saveNetworkPathReserve(네트워크회선 예비선번 저장)
 *                                          
 */

/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsPath = new TeamsPath();
var teamsPathWk = null;
var teamsPathSpr = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsPathData = null;
var teamsPathDataWk = null;
var teamsPathDataSpr = null;

/**
 * TEAMS 선번의 사용 네트워크 구간은 양 끝 노드만 포함하는 선번
 */
var teamsShortPathData = null;
var teamsShortPathDataWk = null;
var teamsShortPathDataSpr = null;

/**
 * 선번 원본
 */
var originalPath = null;

var responsePathJrdtMtsoList = new PathJrdtMtsoList();

/**
 * gojs diagram
 */
var visualLinePath;

/**
 * 선택 선번
 */
var selectedLinePathDiv;

var selectedShortPathData = null;

var selectedOriginalPath = new Object();

/**
 * gojs object 생성
 */
var $go = go.GraphObject.make;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeDataArray = [];
var nodeDataArraySpr = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkDataArray = [];
var linkDataArraySpr = [];

/**
 * 선택 선번 객체의 데이터 목록
 */
var selectedPathNodeDataArray = [];

/**
 * 선택 선번 구간 그래프 객체의 데이터 목록
 */
var selectedPathLinkDataArray = [];

/**
 * 선택선번 teams path
 */
var selectedTeamsPath = new TeamsPath();

/**
 * 사용네트워크 그룹핑을 위한 아이디
 */
var useNetworkId = null;

/**2018-09-12  5.RU고도화
 * 사용서비스회선의 그룹핑을 위한 아이디 
 */
var useServiceNetworkId = null;

/**
 * 사용트렁크의 그룹핑을 위한 아이디 
 */
var useTrunkNetworkId = null;

/**
 * 사용링의 그룹핑을 위한 아이디
 */
var useRingNetworkId = null;

/**
 * 사용WDM트렁크의 그룹핑을 위한 아이디
 */
var useWdmTrunkNetworkId = null;

var initParam = null;

var ringInitParam = null;

/**
 * 선번 조회 parameter
 */
var searchParam = null;

/**
 * 선번에서 조회해온 SAME_NO
 */
var pathSameNo = "";
var reservePathSameNo = "";

/**
 * 수정 가능 여부
 */
var workYn = "";

/**
 * 선택 선번 데이터(이동 또는 추가를 위해 선택한 네트워크 또는 장비)
 */
var selectedPathData = null;

var fdfNodeId = null;


/**
 * 포트 선택했을 때 해당 장비에 채널이 이미 선택이 되어 있을 경우
 */
var selectedChannel = "";

/**
 * 트렁크 유휴율 데이터
 */
//var trunkIdle = null;

/**
 * 미처리 관리번호
 */
var utrdMgmtNo = null;

/**
 * '선번생성'버튼 클릭을 통한 저장
 */
var btnLineInsertClickYn = false;

/**
 * 주선번 select change를 통한 저장
 */
var selNtwkLnoGrpSrnoChg = false;

/**
 * 주선번 여러개 생성시 이전 주선번 ID
 */
var prevNtwkLnoGrpSrno = ""; 

/**
 * 주예비 여부
 */
var wkSprYn = false;

var wdmTrunkSprOriginal = null;

/**
 * west상하위
 */
var westNodeRole = [];

/**
 * east상하위
 */
var eastNodeRole = [];

/**
 * west사용용도
 */
var westPortUseType = [];

/**
 * east사용용도
 */
var eastPortUseType = [];

/**
 * 노드 이동시 선택된 네트워크 또는 노드
 */
var nodeSelectedIdx = null;

/**
 * 네트워크 및 장비명이 길 경우 cut할 길이
 */
var nmCutIdx = 70;

/**
 * 선번편집 drag&drop시 이동된 노드인지 추가된 노드인지 여부
 */
var moveYn = false;

var portChannelEditable = false;

/* 2018-04-26  4. [수정]가입자망인 경우 선번그룹번호 전송 */
var fdfSendLnoGrpSrno = "";  /* 가입자망 저장시 사용된 선번그룹번호*/

/*wdm 트렁크 여부*/
var wdmYn = "";

/*포트검색 POPUP에서 사용할 포트객체생성 exploer 오류해결*/
var setPortData = new PortDescr();

/* 
 * 2018-09-12  3. RU고도화
 * 
 * modifyMainPath == true  (주선번만 체크함)
 *  1. 사용네트워크의 변경이 있어 사용네트워크 정보가 변경된경우 (response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH 값 )
 *  2. 사용자가 선번 정보를 변경한 경우(사용 서비스회선/트렁크/링/wdm트렁크 설정/재설정,  장비/포트/채널/COT 설정, 구간 잘라내기, 구간 삽입, 구간 뒤집기, 선번 삭제)
 *  3. 주/예비 선번을 교환한 경우 (주/예비 선번 교체클릭)
 *  
 *  위의 경우처럼 주선번이 변경이 발생한 경우 자동수정 대상을 추출하는 작업 진행을 위해 extractAcceptNtwkLine 을 호출시
 *  editType : 편집타입(E : 주선번편집, C : 해지, RS : 주선번변경없이 재저장) 의 타입을 E로 설정한다.
 *  
 *  만약 주선번의 변경 작업이 없는경우 editType : RS 로 설정하여 자동수정대상을 추출하지 않도록 처리함.
 *  
 *  그렇기 때문에 주선번의 변집 작업이 있는 경우 꼭 modifyMainPath 를 true로 설정해 주어야 함
 *  
 *  modifyMainPath 체크 대상 : 
 *                           => setChangedMainPath(gridId)을 호출함
 *  
 *  */
var modifyMainPath = false;

var topologyType = "";
var bRessmuxRing = true;

var svlnLclCd = "";
var topoSclCd = "";
var mgmtOnrNm = "";
var orgId = "";

$a.page(function() {
	
	this.init = function(id, param) {
		
		if (! jQuery.isEmptyObject(param) ) {
			initParam = param;
			
			mgmtOnrNm = nullToEmpty(param.mgmtOnrNm);
			cflineShowProgressBody();
			
			utrdMgmtNo = nullToEmpty(param.utrdMgmtNo) == "" ? "" : param.utrdMgmtNo;
			topologyType = nullToEmpty(param.topologyType);
			if(topologyType == "001")
				bRessmuxRing = false;
			
			if(isServiceLine()) {
				searchParam = {"ntwkLineNo" : param.ntwkLineNo, "utrdMgmtNo" : utrdMgmtNo, "exceptFdfNe" : "N", "svlnLclCd" : param.svlnLclCd, "svlnSclCd" : param.svlnSclCd, "reqPathJrdtMtsoList":"Y"};
				svlnLclCd = param.svlnLclCd;
			} else {
				searchParam = {"ntwkLineNo" : param.ntwkLineNo, "utrdMgmtNo" : utrdMgmtNo, "exceptFdfNe" : "N", "topoLclCd" : param.topoLclCd, "topoSclCd" : param.topoSclCd};
				topoSclCd = param.topoSclCd;
			}
			
			var ntwkLnoGrpSrno = param.ntwkLnoGrpSrno;
			if(nullToEmpty(ntwkLnoGrpSrno) == "") {
				$.extend(searchParam,{"wkSprDivCd": "01"});
				$.extend(searchParam,{"autoClctYn": "N"});
			} else {
				$.extend(searchParam,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
			}
			
			
			if(isRing()) {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00030', null, 'GET', 'C00030'); // 링 상하위
			} else if(isServiceLine()) {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00967', null, 'GET', 'C00967'); // 회선 상하위
			} else if(isWdmTrunk()) {
				// wdm
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00542', null, 'GET', 'C00542'); // 사용용도
			} else {
				// 트렁크
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath');
			}
			 
//			if(isServiceLine()) {
//				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'selectLinePath');
//			} else {
//				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath');
//			}
			if(isWdmTrunk()){
				wdmYn="Y";
			}
			
    	}
		
		setButtonEventListener();
		baseInfoHide();
//		initGridPortInf();
		
		// 탭, 버튼 validation		
		tabValidation();  // tab영역
		buttonValidation();  // 버튼 영역
		
		// 주예비 여부
		/* 2023-05-16 MUX링의 토폴로지구성방식 Ring타입인 경우에만 주,예비가능하기 때문에 MUX Ring타입판단 function 호출 변경 isSmuxRing -> isSmuxRing001
		 * 2023-05-16 SKB CATV 망종류링의 예비선번구현을 위해 체크 function 추가
		 */ 
		wkSprYn = ( isWdmTrunk() || (isPtp() && initParam.mgmtGrpCd != "0002") || isRuCoreLine() || isSmuxRing001() || isSkbCatvRing()); 	
	};
});

/**
 * Function Name : setOLTEqp
 * Description   : 상위OLT장비 설정
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 네트워크ID, 그룹ID
 * ----------------------------------------------------------------------------------------------------
 */
function setOLTEqp(param) {
	 
	cflineShowProgressBody();
	var dataParam = param;

	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectVisualOltEqp', param, 'GET', 'selectVisualOltEqp');

};

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
		data : Param, 		//data가 존재할 경우 주입
		method : Method, 	//HTTP Method
		flag : Flag
	}).done(successCallback);
};

function successCallback(response, status, jqxhr, flag){
	// 선번 조회 전 공통 코드 조회
	if(flag == "C00030") {
		// 링 상하위
		westNodeRole = response;
		eastNodeRole = response;

		searchParam.ringMgmtDivCd = '1';
		searchParam.wkSprDivCd =  '01';
		searchParam.autoClctYn = 'N';
			
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath');
	} else if(flag == "C00967") {
		// 회선 상하위
		westNodeRole = response;
		eastNodeRole = response;
 
		// RU회선 - RU(CMS수집) : 003 - 103
		// 기지국회선 - LTE : 001 - 016 , 기지국회선 - 5G : 001 - 030
		if( (svlnLclCd == "003" && svlnSclCd == "013") || (svlnLclCd == "001" && svlnSclCd == "016") || (svlnLclCd == "001" && svlnSclCd == "030")) {
			if(searchParam.ntwkLnoGrpSrno == "") {
				searchParam.autoClctYn = "Y";
			}
		}
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'selectLinePath');
	} else if(flag == "C00542") {
		// WDM 사용용도
		westPortUseType = response;
		eastPortUseType = response;
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath');
	
	}
	
	
	if(flag == "selectLinePath" || flag == "selectNetworkPath") {
		workYn = "";
		if( flag == "selectLinePath" ) {
			workYn = baseInfData.svlnWorkYn;
		} else if( flag == "selectNetworkPath" ){
			workYn = baseInfData.ntwkWorkYn;
			//ADAMS관련... PTP링중 그룹관리 SKB인 경우에는 예비선번변경 불가 - 2020-04-03
			//TODO 이전으로 20240911
			//if(nullToEmpty(mgmtOnrNm) == "ADAMS") {
			//	$("#btnReservePathChange").hide();
			//}
		}
		
		workYn = "Y";
		if(workYn == "Y") {
			// 선택 선번 탭 활성화
			$("#selectPathTabTitle").show();
			
			// 선택 선번 Diagram 그리기
			initSelectedDiagram();
		} else {
			$("#selectPathTabTitle").hide();
			$("#selectPath").hide();
		}
		
		$("#visualWkDiv").remove();
		$("#visualDiv").append("<div id=\"visualWkDiv\" style=\"width:100%; height:220px;\"></div>");	
		initDiagram();
		initGridNetworkPath('teamsPathList');
		initGridNetworkPath('tangoPathList');
		
		// 검증 결과 확인을 위한 국사 정보 설정
		responsePathJrdtMtsoList = response.pathJrdtMtsoList;
		if(response.data != undefined) {
			originalPath = response.data;
			/**
			 * tangoPath로 변환할때 기지국회선의 경우에는 
			 * 인접사용네트워크처리를 하지 않게
			 * TeamsPath를 수정
			 * 2021-06-08
			 */
			teamsPath.fromTangoPath(originalPath);  // <-- 이때 더미장비가 생김
			teamsPathData = teamsPath.toData();		// 그리드
			teamsShortPathData = teamsPath.toShortPath();
			
			// 주선번 데이터 보존
			teamsPathWk = teamsPath;
			teamsPathDataWk = teamsPathData;
			teamsShortPathDataWk = teamsShortPathData;
			
			generateDiagram();
			teamsPathGrid();
			tangoPathGrid();
			
			pathSameNo = response.data.PATH_SAME_NO;

			// 2018-09-12  3. RU고도화 주선번이 자동보정된 경우 주선번 편집으로 판별한다
			modifyMainPath = response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH;
		}	
		else if(response.data == undefined) {			
			
			if(flag == "selectNetworkPath" && isSmuxRing() == true) {	// 링
				/* 
				 * 실 작업은 common.js의 setPreLinePath()에서 처리함 
				 * SMUX링의 경우 청약시 설정한 기설 서비스회선이 존재하고 해당 회선의 선번에 SMUX링을 사용하고 있지 않은 경우
				 * 해당 선번을 이용하여 SMUX의 링 선번을 자동 구현한다 
				 * SMUX링의 SMUX(COT/RN) 장비가 존재하는경우 1), 4)번은 작업하고 없는경우 1), 4)번은 작업하지 않는다
				 * 1) 첫구간 WEST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(COT) 장비
				 * 2) 첫구간 EAST 장비 : 기설 서비스회선의 첫 EAST FDF 장비
				 * 3) 2)부터~ 마지막 WEST FDF 장비까지의 선번정보 복사
				 * 4) 마지막 EAST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(RN) 장비
				 */
				
				cflineShowProgressBody();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectSvlnLinePath', searchParam, 'GET', 'selectSvlnLinePath');
				
			} 
		}
		
		if (flag == "selectLinePath") {
			/*
			 * RU회선-광코어
			 * SMUX회선의 신설 청약의 경우 해당 회선의 선번이 RU장비만 존재하는 경우
			 * 해당 회선의 청약의 기설/신설 SMUX링의 선번을 취득하여 선번을 자동 구현 한다.
			 * 1) 기설/신설 SMUX링의 선번이 정상 구현된 경우(SMUX_COR ~ FDF -> FDF(ETE) ~ SMUX_RN) 해당 선번을 취득
			 * 2) 1) 선번의 첫 구간의 WEST 장비인 SMUX_COT장비를 서비스 회선의 첫 선번의 EAST 장비에 셋팅
			 * 3) 1) 선번을 복사
			 * 4) 1) 선번의 마지막 구간의 EAST 장비인 SMUX_RN 장비를 서비스회선의 마지막 구간의 WEST 장비에 셋팅
			 * 
			 * */	
			
			 //S-MUX RU광코어 신설 서비스회선에 기설/신설 링 선번정보 자동셋팅
			 if(isSmuxRuCoreLine() == true && checkUseRingAtRuPath(originalPath) == false ) {					
				cflineShowProgressBody();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectSmuxRingPathInfo', searchParam, 'GET', 'selectSmuxRingPathInfo');
			 }
			 
			 /*
				 * 서비스 회선의 선번 존재여부와 상관 없이
				 * RU회선-광코어
				 * 5G-PON 회선의 신설 청약의 경우 해당 회선의 선번이사용링이 없는경우
				 * 해당 회선의 청약의 장비ENG에서 설정한 COT장비와 CRN장비의 파장정보를 바탕으로 해당 CRN을 사용하는 서비스회선을 조회하여 선번을 복제
				 *    장비ENG : 청약번호당 ENG가 다건발행됨
				 *              기본적으로 최근 ENG번호기준
				 *              단, COT장비/CRN 파장 장비가 설정된 ENG가 있는경우 해당건이 우선함.
				 *              ENG 1 COT 장비설정됨/ CRN 파장 설정됨
				 *              ENG 2 COT 장비설정됨/ CRN 파장 설정 안됨
				 *              <= ENG 1번 사용함
				 * 1) 해당 회선의 장비ENG(CRN 파장)에서 설정한 정보를 바탕으로 DU-L/하위국사와 같은 건물에 속한 같은 CNR모델의 장비를 사용하는 서비스회선을 찾음 
				 * 2) 1) 해당 선번정보중 CRN의 포트를 ENG 설정한 주파수에 해당하는 채널포트 2개(TX/RX)로 교체
				 * 3) 2) 에 원 선번의 DU-L정보를 셋팅하여 선번을 구현
				 * 4) 해당 선번을 원 선번 뒤에 추가함
				 * 
				 * */	
				
				/* 신설 서비스회선에 CRN 장비기준 기존 서비스회선 선번 자동셋팅 주석*/
				if(isFiveGponRuCoreLine() == true && checkUseRingAtRuPath(originalPath) == false ) {					
					cflineShowProgressBody();
					var copyParam = {"svlnNo" : searchParam.ntwkLineNo}
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/copySvlnPathInfoByCrn', copyParam, 'GET', 'copySvlnPathInfoByCrn');
				}
				
				// 5G-PON RU 서비스회선인 경우 예비선번으로 변경 버튼 숨기기
				if(isFiveGponRuCoreLine() == true) {
					$("#btnReservePathChange").hide();
				}
		}
		
		if(wkSprYn) {
			// 예비 선번 조회
			searchParam.wkSprDivCd = "02";
			/*
			 * 1. [수정] RU광코어 링/예비선번 사용
			 */
			if (isServiceLine() == true) {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'reserveLinePath');
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'reserveNetworkPath');	
			}
			
			
			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			// 최초 읽어온 선번이 주선번 임을 셋팅 
			teamsPath.WK_SPR_DIV_CD = '01';
		} else {
			cflineHideProgressBody();
		}
		
		// 가입자망링일 경우 주선번이 여러개 존개. 선번생성 버튼 활성화 및 select 생성
		if(isRing() && initParam.topoLclCd == '001' && initParam.topoSclCd == '031') {
			pathCreate(response);
		}
				
		// 2. [수정] RM선번편집 창 자동열기
		// RM선번편집(initParam.rmEditYn == "Y") 직접 호출인 경우 RM편집 버튼 클릭
		if (typeof initParam.rmEditYn != "undefined" && initParam.rmEditYn != null && initParam.rmEditYn != "null" && initParam.rmEditYn == "Y") {			
			$('#btnRmLinePathPop').click();
		}
		
		// 수집선번비교 버튼
		if(isFiveGponRuCoreLine() == true) {			
			$('#btnCmslineCompare').show();	//수집회선비교버튼의 활성화
		} else {
			$('#btnCmslineCompare').hide(); //그외조건에서는 수집회선비교버튼 비활성화 처리
		}
		
		/*
		 * 1. 경유링이 CMUX,LMUX ptp링이면서 확장형인 경우
		 * 2. 서비스회선에서 사용한 링이 SMUX링 이면서 토폴로지구성방식이 RING형식인 경우 
		 * 3. 서비스회선에서 사용한 링이 CMUX, LMUX링 이면서 토폴로지구성방식이 PTP확장형인 경우
		 * 예비선번 버튼 활성
		 */
		if(isCmuxRing002() || checkSmuxAndTopoCfgMeansRing(teamsPath) || checkCmuxExt(teamsPath)) {
			$("#btnReservePathChange").show();
		} else {
			$("#btnReservePathChange").hide();
		}
	}
	/*
	 * 1. [수정] RU광코어 링/예비선번 사용
	 */
	else if(flag == "reserveLinePath") {		
		
		wdmTrunkSprOriginal = response.data;
		if(wdmTrunkSprOriginal != undefined) {
			teamsPathSpr.fromTangoPath(wdmTrunkSprOriginal);
			teamsPathDataSpr = teamsPathSpr.toData();		// 그리드
			teamsShortPathDataSpr = teamsPathSpr.toShortPath();
			reservePathSameNo = wdmTrunkSprOriginal.PATH_SAME_NO;

			//console.log("teamsPathSpr" + teamsPathSpr.NODES.length);
		}
		
		if (nullToEmpty(chkExtractAcceptNtwkLine) !="SAVE") {
			cflineHideProgressBody();
		}	
		
		// 만약 현재 예비선번 탭이 선택된 상태라면 teamsPath는 예비선번 값을 갖고 있어야 함
		if($("#wkSprDiv").getCurrentTabIndex() == "1") {
			teamsPath = teamsPathSpr;
			teamsPathData = teamsPathDataSpr;
			teamsShortPathData = teamsShortPathDataSpr;
			
			teamsPath.WK_SPR_DIV_CD = '02';

			//console.log("teamsPath" + teamsPath.NODES.length);
		}
	} else if(flag == "reserveNetworkPath" ) {
		// WDM트렁크 예비선번 조회
		wdmTrunkSprOriginal = response.data;
		if(wdmTrunkSprOriginal != undefined) {
			teamsPathSpr.fromTangoPath(wdmTrunkSprOriginal);
			teamsPathDataSpr = teamsPathSpr.toData();		// 그리드
			teamsShortPathDataSpr = teamsPathSpr.toShortPath();
			reservePathSameNo = wdmTrunkSprOriginal.PATH_SAME_NO;
		}

		if (nullToEmpty(chkExtractAcceptNtwkLine) !="SAVE") {
			cflineHideProgressBody();
		}
	} else if(flag == "trunkSearch") {
		// 트렁크 구성도 조회
		//trunkSearch(response);
		useNetworkSearch(response);
		
	} else if(flag == "ringSearch") {
		// 링 구성도 조회
		ringSearch(response);
		
	} else if(flag == "wdmTrunkSearch") {
		// WDM트렁크 구성도 조회
		//wdmTrunkSearch(response);
		useNetworkSearch(response);
		
	} else if(flag == "selectedTrunkPath") {
		// 선택선번 트렁크 조회
		generateSelectedPath(response.data, "TRUNK", guid());
		
	} else if(flag == "selectedWdmTrunkPath") {
		// 선택선번 WDM트렁크 조회
		generateSelectedPath(response.data, "WDM_TRUNK", guid());
		
	} else if( flag == "saveLinePath" || flag == "saveLinePathReserve"    // 1. [수정] RU광코어 링/예비선번 사용
				|| flag == "saveNetworkPath" || flag == "saveNetworkPathReserve"		 		
		) {
		// 서비스 회선 저장(saveLinePath), 네트워크 저장(saveNetworkPath), WDM트렁크 예비선번 저장(saveNetworkPathReserve)
		if(response.PATH_RESULT) {
			/*
			 * 1. [수정] RU광코어 링/예비선번 사용
			 * RU광코어 예비선번 사용건으로 api호출 제어 변경
			 * 
			 * 1. 예비선번이 있는 경우
			 *    1-1 예비선번저장( saveLinePathReserve / saveNetworkPathReserve )
			 * 2. 예비선번 저장 후
			 *    2-1 주선번 조회 ( selectLinePathSaveAfter / selectNetworkPathSaveAfter )
			 *    2-2 예비선번 조회	 ( reserveLinePath / reserveNetworkPath )
			 * 3. 예비선번이 없는 경우
			 *    3-1 주선번 조회  ( selectLinePathSaveAfter / selectNetworkPathSaveAfter )
			 */
			
			/* 20170518 수용네트워크 처리 시작 */
			if (   (flag == "saveLinePathReserve" || (flag == "saveLinePath"  && wkSprYn == false) )    // 서비스회선이면서 예비선번 저장후 or 서비스회선 이면서 예비선번 저장하지 않는 경우
				|| (flag == "saveNetworkPathReserve" || (flag == "saveNetworkPath"  && wkSprYn == false))) // 네트워크회선 이면서 예비선번 저장후 or 네트워크회선 이면서 예비선번 저장하지 않는 경우
			  {		
					chkExtractAcceptNtwkLine = "SAVE";
					bRessmuxRing = false;
					var aceptBase = null;
					if( isRing() ) {
						aceptBase = baseInfData[0];
					} else {
						aceptBase = baseInfData;
					}
					
					var acceptParam = {
							 lineNoStr : initParam.ntwkLineNo
						   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
						   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
						   , linePathYn : (isServiceLine() ? "Y" : "N")
						   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
						   , excelDataYn : "N"
						   , mgmtGrpCd : nullToEmpty(aceptBase.mgmtGrpCd)
	   					   , callMsg : cflineMsgArray['saveSuccess']  // 저장에 성공한 경우
					       , callViewType : nullToEmpty(initParam.callViewType)
					       , subScrNtwkLnoGrpSrno : (isSubScriRing() == true ? $('#ntwkLnoGrpSrno').val() : "")  // 가입자망 링의 선번그룹일련번호
					}
					modifyMainPath == false;
					
					//ADAMS 고도화 - SKB회선 제외 2020.04.01
					//TODO 이전으로 20240911
					extractAcceptNtwkLine(acceptParam);
					
					//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//					if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (nullToEmpty(topoSclCd) == "030" || nullToEmpty(topoSclCd) == "031")) {
//						extractAcceptNtwkLine(acceptParam);
//					} else {
//						cflineHideProgressBody();;
//						var msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
//						alertBox('I', msg);    //정상적으로 처리되었습니다. 
//					}
			}
			/* 20170518 수용네트워크 처리 끝 */
			
			/* SMUX링의 기설 서비스호선 회선 자동생성 기능 호출 */
			if (flag == "saveNetworkPath" && isSmuxRing() == true) {
				var smuxRingParam = {
							 "useRingNtwkLineNo" : initParam.ntwkLineNo
						   , "newServiceLineYn" : "N"
		        		   , "callApiForSmux" : "CF"  // 회선자체에서 해당 기능을 사용하기 위해
		        		   , "userId" : $("#userId").val()	   
				}
				autoProcSmuxRingToSvlnNo(smuxRingParam);
			}
			
			/* SMUX링인경우 COT장비의 번호를 링명에 셋팅*/
			if (flag == "saveNetworkPath" && isSmuxRing() == true) {
				var smuxRingParam = {
							 "ntwkLineNo" : initParam.ntwkLineNo
		        		   , "userId" : $("#userId").val()    
		        		   , "viewType" : "N" 
				}
				updateSmuxRingNameByCotNm(smuxRingParam);  // common.js에 있음
			}
			
			/* 5G-PON링인경우 COT장비의 번호를 링명에 셋팅*/
			if (flag == "saveNetworkPath" && isFiveGponRing() == true) {
				var fiveGponRingParam = {
							 "ntwkLineNo" : initParam.ntwkLineNo
		        		   , "userId" : $("#userId").val()    
		        		   , "viewType" : "N" 
				}
				updateFiveGRingNameByCotNm(fiveGponRingParam);  // common.js에 있음
			}
			
			/* M/W PTP링인경우 MW용도구분 셋팅*/
			if (flag == "saveNetworkPath" && isMWPtpRingOld() ==  true) {
				insertMwUsgDiv(initParam.ntwkLineNo);
			}
			
			/* RU회선_중계기인 경우 망구성방식코드 정보갱신 */
			if (isRuCoreLine() == true) {
				var ruParam = {
						"lineNoStr" : initParam.ntwkLineNo
					  , "editType"  : "E"
				}
				setRuNetCfgMeans(ruParam);
			}
			
			// 토폴로지구성방식이 PTP인경우 마지막 FDF의 설치국사로 하위국사 셋팅 2019-01-16
			if(flag == "saveNetworkPath" && typeof initParam.topoLclCd != "undefined"  && initParam.topoLclCd == '001' && baseInfData[0].topoCfgMeansCd == '002'){
				var params = {
						 "ntwkLineNo" : initParam.ntwkLineNo
				}
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/setlowmtsobylastfdf', params, 'GET', 'setLowMtsoByLastFdf');
			}
			
			// 1. 예비선번이 있는 경우
			if( wkSprYn && (flag == "saveLinePath" || flag == "saveNetworkPath")) {
				var tangoPath = teamsPathSpr.toTangoPath();
				var tangoPathData = tangoPath.toData(); 
				var linePathYn = isServiceLine() ? "Y" : "N";
				
				var saveParams = {
						"ntwkLineNo" : initParam.ntwkLineNo,
//						"ntwkLnoGrpSrno" : reservePathSameNo,
						"wkSprDivCd" : "02",
						"autoClctYn" : "N",
						"linePathYn" : linePathYn,
						"userId" : $("#userId").val(),
						"utrdMgmtNo" : utrdMgmtNo,
						"links" : JSON.stringify(tangoPathData.LINKS)
				};
				
				$.extend(saveParams,{"ntwkLnoGrpSrno": reservePathSameNo});
				
				if (isServiceLine() == true) {
					
					// 2019-01-15  8. 5G-PON고도화 - 5G-PON RU회선인 경우 주선번이 존재 하고 주선번이 변경된 경우 경우 예비선번은 자동생성한다. 
					if (isFiveGponRuCoreLine() == true && (teamsPathWk != null && teamsPathWk.NODES.length > 0) &&  modifyMainPath == true) {
						
						var autoProcSprPath = {
								"svlnNo" : initParam.ntwkLineNo
						}
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoprocsprpathoffgponsvlnline', autoProcSprPath, 'GET', 'saveLinePathReserve');
					} else if(isRuCoreLine() == true && (teamsPathWk != null && teamsPathWk.NODES.length > 0) && checkSmuxAndTopoCfgMeansRing(teamsPathWk) == true && modifyMainPath == true){
						var autoProcSprPath = {
								"svlnNo" : initParam.ntwkLineNo
						}
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoprocsprpathofsmuxsvlnline', autoProcSprPath, 'GET', 'saveLinePathReserve');

					/*  
					 * 서비스회선 저장시 CUMX링을 추가하고 추가된 CMUX링이 이원화된 링이면서 확장형인 경우
			         * CMUX링의 예비선번으로 회선의 예비선번을 구성해준다.
			         * 2020-06-11
			         */
					} else if(checkCmuxExt(teamsPathSpr)) {
						var autoProcSprPath = {
								"svlnNo" : initParam.ntwkLineNo,
								"ringExtYn" : "Y"
						}
						
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoprocsprpathofsmuxsvlnline', autoProcSprPath, 'GET', 'saveLinePathReserve');
					} else {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', saveParams, 'POST', 'saveLinePathReserve');
					}
				} else {
					if(topoSclCd == '035') {
						/*
						 *  SMUX링의 경우 SMUX, CMUX장비구분에 따라 랑에 링을 꽂은 경우 예비선번을 저장하는 경우가 있음
						 *  CMUX 이원화로 구성되어있는 SMUX링을 저장시에 예비선번도 구성해서 저장함
						 *  2020-06-11
						 */
						var autoProcSprPath = {
								"ntwkLineNo" : initParam.ntwkLineNo,
								"userId" : $("#userId").val(),
								"delRerveCd" : "N"
						}
						if(checkCmuxExt(teamsPathWk)) {
							//이원화로 구성된 링의 확장형의 경우 - 예비선번 저장
							$.extend(autoProcSprPath,{"ringExtYn": "Y"});  // 이원화로 구성된 링의 확장형의 경우
							httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/autoprocsprpathofcmuxextline', autoProcSprPath, 'POST', 'saveNetworkPathReserve');

						} else {
							//이원화로 구성된 링의 확장형이 아닌 경우 - 기존에 예비선번이 있는 경우에는 삭제 아닌 경우에는 반환
							$.extend(autoProcSprPath,{"ntwkLnoGrpSrno": reservePathSameNo});
							$.extend(autoProcSprPath,{"delRerveCd": "Y"});  // 예비선번이 있는 경우	
							httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/autoprocsprpathofcmuxextline', autoProcSprPath, 'POST', 'saveNetworkPathReserve');
						}
					} else {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', saveParams, 'POST', 'saveNetworkPathReserve');
					}
				}				
			} 
			// 2. 예비선번 저장 후
			else if (flag == "saveLinePathReserve" || flag == "saveNetworkPathReserve") {
				// 2-1 주선번 조회
				searchParam.wkSprDivCd = "01";
				if (isServiceLine() == true) {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'selectLinePathSaveAfter');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPathSaveAfter');	
				}
				
				// 2-2 예비선번 조회	
				wdmTrunkSprOriginal = null;
				teamsPathSpr = new TeamsPath();
				teamsPathDataSpr = null;
				teamsShortPathDataSpr = null;
				reservePathSameNo = "";
				
				// 예비 선번 저장 후 조회 
				searchParam.wkSprDivCd = "02";
				if (isServiceLine() == true) {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'reserveLinePath');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'reserveNetworkPath');
				}
			} 
			// 3. 예비선번이 없는 경우
			else if (wkSprYn == false) {
				// 3-1 주선번 조회
				searchParam.wkSprDivCd = "01";
				if (isServiceLine() == true) {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'selectLinePathSaveAfter');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPathSaveAfter');	
				}
			}
			
			/* 20170907 FDF사용정보 GIS 전송건 시작
			 * 20171222 예비선번정보까지 검색위해 호출 위치 변경
			 * 			PTP 링 / WDM 트렁크의 경우 주선번 저장시 flag : saveNetworkPath  -> 그후 예비선번 저장시 flag : saveNetworkPathReserve 호출함
			 *          그렇기때문에 서비스회선 flag(saveLinePath)와 
			 *                       PTP링이외의 링일 경우 주선번 저장시 flag(saveNetworkPath) 
			 *                       PTP링 인경우 예비선번이 저장된 후의 flag(saveNetworkPathReserve)가 성공한 경우 호출함
			 * 20180306 1. [수정] RU광코어 링/예비선번 사용
			 *          RU광코어 예비선번 사용가능해짐
			 *          서비스회선 중 예비선번 사용하지않는경우 바로호출 flag(saveLinePath) 
			 *          서비스회선 중 예비선번 사용하는 경우 예비선번 저장후 flag(saveLinePathReserve)
			 */			
			// 서비스회선   / 링
			if ( ( flag == "saveLinePathReserve"  // 서비스회선이면서 예비선번 저장후
				   || (flag == "saveLinePath"  && wkSprYn == false) // 서비스회선 이면서 예비선번 저장하지 않는 경우
				  )
				|| (isRing() == true //(typeof initParam.topoLclCd != "undefined"  && initParam.topoLclCd == '001') // 링
						&& (   (flag == "saveNetworkPathReserve")   // 예비선번 저장후 
								|| (flag == "saveNetworkPath" && wkSprYn == false)  // 예비선번 저장하는 케이스가 아닌 저장의 경우
							)
					)
			   ) {
				sendFdfUseInfo(flag);
			}
			/* 20170907 FDF사용정보 GIS 전송건 끝 */

			/* 20171222 네트워크정보 TSDN 전송건 시작 */
			// PTP 링인 경우/기간망 트렁크는 시각화 편집이 없음  
			if ( ((flag == "saveNetworkPath" && wkSprYn == false)
				  || flag == "saveNetworkPathReserve")	// 네트워크
				&& (typeof topoLclCd != "undefined"  && topoSclCd != "undefined" && topoLclCd == '001' && topoSclCd == '002') ) {  // PTP링
				var ntwkEditLneType = (topoLclCd == '001') ? "R" : "T";
				sendToTsdnNetworkInfo(initParam.ntwkLineNo,ntwkEditLneType, "E");
			}
			/* 20171222 네트워크정보 TSDN 전송건 끝 */	
		} else {
			cflineHideProgressBody();
			//alertBox('W', response.PATH_ERROR_MSG);
						
			// 1. [수정] RU광코어 링/예비선번 사용
			// 예비선번 사용하는 서비스회선/링인경우 주선번 저장 후 예비선번 저장에서 에러가 나도 
			// 이미 저장된 주선번의 FDF정보를 전송해야함
			if ( wkSprYn == true  && ( 
					flag == "saveLinePathReserve" || (isRing() == true && flag == "saveNetworkPathReserve"))
				) {				
				sendFdfUseInfo(flag);
			}
			
			/* 20170518 수용네트워크 처리 시작 */
			if ( wkSprYn == true      // 예비선번이 존재하는 회선의 경우
				 && ( flag == "saveLinePathReserve" || (flag == "saveNetworkPathReserve" && typeof topoLclCd != "undefined"))) // 서비스회선/네트워크회선의 예비선번 저장시 에러발생의 경우 주선번은 정상 저장 된 것이기 때문에
			  {		
					chkExtractAcceptNtwkLine = "SAVE";
					var aceptBase = null;
					if( isRing() ) {
						aceptBase = baseInfData[0];
					} else {
						aceptBase = baseInfData;
					}
					
					var acceptParam = {
							 lineNoStr : initParam.ntwkLineNo
						   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
						   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
						   , linePathYn : (isServiceLine() ? "Y" : "N")
						   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
						   , excelDataYn : "N"
						   , mgmtGrpCd : nullToEmpty(aceptBase.mgmtGrpCd)
	   					   , callMsg : response.PATH_ERROR_MSG  // 저장에 성공한 경우
	   					   , onlyMainOk : "Y"  // 주선번만 정상 저장됨
						   , callViewType : nullToEmpty(initParam.callViewType)
						   , subScrNtwkLnoGrpSrno : (isSubScriRing() == true ? $('#ntwkLnoGrpSrno').val() : "")  // 가입자망 링의 선번그룹일련번호
					}
					modifyMainPath == false;	
					//ADAMS 고도화 - SKB회선 제외 2020.04.01
					//TODO 이전으로 20240911
					extractAcceptNtwkLine(acceptParam);
					//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//					if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (topoSclCd == "030" || topoSclCd == "031")) {
//						extractAcceptNtwkLine(acceptParam);
//					}
			}
			/* 20170518 수용네트워크 처리 끝 */
			else {
				alertBox('W', response.PATH_ERROR_MSG);
			}
		}
		
		// 부모창 데이터 재조회
		if (nullToEmpty(opener) != "" && $('#btnDetailResearch' , opener.document).val() != undefined) {
			$('#btnDetailResearch' , opener.document).click();	// WdmTrunk 상세 재검색
		}
		
	} else if( flag == "selectLinePathSaveAfter" || flag == "selectNetworkPathSaveAfter" ) {
		// 저장 후 주선번 재조회 결과 재조회. 서비스 회선(selectLinePathSaveAfter), 네트워크 회선(selectNetworkPathSaveAfter)		
		if(response.data != undefined) {
			originalPath = null;
			teamsPathData = null;
			teamsShortPathData = null;
			teamsPath = new TeamsPath();
			
			// 주선번 정보 보존
			teamsPathWk = new TeamsPath();
			originalPath = response.data;
			teamsPathWk.fromTangoPath(originalPath);
			teamsPathDataWk = teamsPathWk.toData();		// 그리드
			teamsShortPathDataWk = teamsPathWk.toShortPath();
			pathSameNo = response.data.PATH_SAME_NO;
			//console.log("teamsPathWk" + teamsPathWk.NODES.length);
			
			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			// 예비선번이 존재하는 회선인 경우 주선번 저장 후 현재선번이 주선번 임을 표시  
			if (wkSprYn == true) {
				teamsPathWk.WK_SPR_DIV_CD = '01';
			}			
			/*teamsPath.fromTangoPath(originalPath);
			teamsPathData = teamsPath.toData();		// 그리드
			teamsShortPathData = teamsPath.toShortPath();*/
			
			// 만약 현재 예비선번 탭이 선택된 상태라면 teamsPath는 예비선번 값을 갖고 있어야 함
			if($("#wkSprDiv").getCurrentTabIndex() == "1") {

				teamsPath = teamsPathSpr;
				teamsPathData = teamsPathDataSpr;
				teamsShortPathData = teamsShortPathDataSpr;
				
				teamsPath.WK_SPR_DIV_CD = '02';
				//console.log("teamsPath1" + teamsPath.NODES.length);
			} else {
				teamsPath = teamsPathWk;
				teamsPathData = teamsPathDataWk;
				teamsShortPathData = teamsShortPathDataWk;
				reGenerationDiagram(true);
				//console.log("teamsPath2" + teamsPath.NODES.length);
			}
					
			
			if (chkExtractAcceptNtwkLine == "CHK_SAVE") { // 저장을 완료하였습니다. 메시지가 표시되었음
				chkExtractAcceptNtwkLine = "";
			} else if (chkExtractAcceptNtwkLine == "SAVE") {  // 수용네트워크 목록을 취득 하는중
				
			} else {  // 수용네트워크 목록을 추출하는 api를 호출하지 않았음
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
			}			

			// 2018-09-12  3. RU고도화 주선번이 자동보정된 경우 주선번 편집으로 판별한다
			modifyMainPath = response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH;
			
			/*callMsgBox('' , 'I', cflineMsgArray['saveSuccess'] , function(msgId, msgRst){
			});*/
		} else {
			cflineHideProgressBody();
		}
		
	} else if( flag == "e2eApplay" ) {
		// E2E적용
		cflineHideProgressBody();
		if(response.gisFdfE2E.NODES.length > 0) {
			var gidFdfE2eData = response.gisFdfE2E;
			
			var e2ePath = new TeamsPath();
			e2ePath.fromData(gidFdfE2eData);
 
			teamsPath.insertNode(fdfNodeId, e2ePath);
			teamsPath.removeNode(fdfNodeId);
			reGenerationDiagram(true);
		}
		
		if (nullToEmpty(response.errMsg) != "" ) {  
			alertBox('W', response.errMsg);
			return;
		}
		
	} else if( flag == "saveNetworkPathLineInsertAfter" ) {
		/**
		 * 링-가입자망링
		 *   - 선번생성 버튼을 통한 저장 후 : saveNetworkPathLineInsertAfter
		 **/
		
		btnLineInsertClickYn = false;
		var params = { "ntwkLineNo" : initParam.ntwkLineNo };
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectMaxNtwkLnoGrpSrno', params, 'POST', 'selectMaxNtwkLnoGrpSrno');		

		/* 20170907 FDF사용정보 GIS 전송건 시작
		 * 20171222 예비선번정보까지 검색위해 호출 위치 변경
		 * 			PTP 링 / WDM 트렁크의 경우 주선번 저장시 flag : saveNetworkPath  -> 그후 예비선번 저장시 flag : saveNetworkPathReserve 호출함
		 *          그렇기때문에 서비스회선 flag(saveLinePath)와 
		 *                       PTP링이외의 링일 경우 주선번 저장시 flag(saveNetworkPath) 
		 *                       PTP링 인경우 예비선번이 저장된 후의 flag(saveNetworkPathReserve)가 성공한 경우 호출함
		 */
		// 서비스회선   / 링
		if (isRing() == true) {
			sendFdfUseInfo(flag);
		}
		/* 20170907 FDF사용정보 GIS 전송건 끝 */

		/* 20171222 네트워크정보 TSDN 전송건 시작 */
		// PTP 링인 경우/기간망 트렁크는 시각화 편집이 없음  
		if ( typeof topoLclCd != "undefined"  && topoSclCd != "undefined" && topoLclCd == '001' && topoSclCd == '002' ) {  // PTP링
			var ntwkEditLneType = (topoLclCd == '001') ? "R" : "T";
			sendToTsdnNetworkInfo(initParam.ntwkLineNo,ntwkEditLneType, "E");
		}
		/* 20171222 네트워크정보 TSDN 전송건 끝 */
		
		/* 20170518 수용네트워크 처리 시작 */
		if (isRing() == true ) { // 주선번 저장 후
			chkExtractAcceptNtwkLine = "SAVE";

			var aceptBase = null;
			if( isRing() ) {
				aceptBase = baseInfData[0];
			} else {
				aceptBase = baseInfData;
			}
			
			var acceptParam = {
					 lineNoStr : initParam.ntwkLineNo
				   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
				   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
				   , linePathYn : (isServiceLine() ? "Y" : "N")
				   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
				   , excelDataYn : "N"
				   , mgmtGrpCd : nullToEmpty(aceptBase.mgmtGrpCd)
   				   , callMsg : ""  // 에러인 경우 에러메세지를 넘김
   				   , onlyMainOk : "Y"  // 주선번만 정상 저장됨
				   , callViewType : nullToEmpty(initParam.callViewType)
				   , subScrNtwkLnoGrpSrno : (isSubScriRing() == true ? prevNtwkLnoGrpSrno : "")  // 가입자망 링의 선번그룹일련번호
			}
			modifyMainPath == false;
			
			//ADAMS 고도화 - SKB회선 제외 2020.04.01
			//TODO 이전으로 20240911
			extractAcceptNtwkLine(acceptParam);
			//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//			if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (nullToEmpty(topoSclCd) == "030" || nullToEmpty(topoSclCd) == "031")) {
//				extractAcceptNtwkLine(acceptParam);
//			} else {
//				cflineHideProgressBody();;
//				var msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
//				alertBox('I', msg);    //정상적으로 처리되었습니다. 
//			}
		}
		/* 20170518 수용네트워크 처리 끝 */
		
	} else if( flag == "saveNetworkPathSelectChangeAfter" ) {
		/**
		 * 링-가입자망링
		 *   - select change event를 통한 저장 후 : saveNetworkPathSelectChangeAfter
		 **/
		selNtwkLnoGrpSrnoChg = false;
		$.extend(searchParam,{"ntwkLnoGrpSrno": $("#ntwkLnoGrpSrno").val()});
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPathSrnoAdd');
		
		/* 20170907 FDF사용정보 GIS 전송건 시작
		 * 20171222 예비선번정보까지 검색위해 호출 위치 변경
		 * 			PTP 링 / WDM 트렁크의 경우 주선번 저장시 flag : saveNetworkPath  -> 그후 예비선번 저장시 flag : saveNetworkPathReserve 호출함
		 *          그렇기때문에 서비스회선 flag(saveLinePath)와 
		 *                       PTP링이외의 링일 경우 주선번 저장시 flag(saveNetworkPath) 
		 *                       PTP링 인경우 예비선번이 저장된 후의 flag(saveNetworkPathReserve)가 성공한 경우 호출함
		 */
		// 서비스회선   / 링
		if (isRing() == true) {
			sendFdfUseInfo(flag);
		}
		/* 20170907 FDF사용정보 GIS 전송건 끝 */

		/* 20171222 네트워크정보 TSDN 전송건 시작 */
		// PTP 링인 경우/기간망 트렁크는 시각화 편집이 없음  
		if ( typeof topoLclCd != "undefined"  && topoSclCd != "undefined" && topoLclCd == '001' && topoSclCd == '002' ) {  // PTP링
			var ntwkEditLneType = (topoLclCd == '001') ? "R" : "T";
			sendToTsdnNetworkInfo(initParam.ntwkLineNo,ntwkEditLneType, "E");
		}
		/* 20171222 네트워크정보 TSDN 전송건 끝 */			

		/* 20170518 수용네트워크 처리 시작 */
		if (isRing() == true) { // 주선번 저장 후

			chkExtractAcceptNtwkLine = "SAVE";

			var aceptBase = null;
			if( isRing() ) {
				aceptBase = baseInfData[0];
			} else {
				aceptBase = baseInfData;
			}
			var acceptParam = {
					 lineNoStr : initParam.ntwkLineNo
				   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
				   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
				   , linePathYn : (isServiceLine() ? "Y" : "N")
				   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
				   , excelDataYn : "N"
				   , mgmtGrpCd : nullToEmpty(aceptBase.mgmtGrpCd)
   				   , callMsg : ""  // 에러인 경우 에러메세지를 넘김
   				   , onlyMainOk : "Y"  // 주선번만 정상 저장됨
				   , callViewType : nullToEmpty(initParam.callViewType)
				   , subScrNtwkLnoGrpSrno : (isSubScriRing() == true ? prevNtwkLnoGrpSrno : "")  // 가ntwkLnoGroSrno입자망 링의 선번그룹일련번호
			}
			modifyMainPath == false;
			
			//ADAMS 고도화 - SKB회선 제외 2020.04.01
			//TODO 이전으로 20240911
			extractAcceptNtwkLine(acceptParam);
			
			//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//			if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (topoSclCd == "030" || topoSclCd == "031")) {
//				extractAcceptNtwkLine(acceptParam);
//			} else {
//				cflineHideProgressBody();
//				var msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
//				alertBox('I', msg);    //정상적으로 처리되었습니다. 
//			}
		}
		/* 20170518 수용네트워크 처리 끝 */
		setPrevNtwkLnoGrpSrno($("#ntwkLnoGrpSrno").val());
		
	} else if( flag == "selectNetworkPathSrnoAdd" ) {
		resetTeamsPath();
		cflineHideProgressBody();
		
		if(response.data != undefined) {
			originalPath = response.data;
			teamsPath.fromTangoPath(originalPath);
			reGenerationDiagram(true);
			
			pathSameNo = response.data.PATH_SAME_NO;
		}
		
		pathCreate(response);
	} else if ( flag == "selectMaxNtwkLnoGrpSrno" ){
		// MAX 선번ID 조회 후 설정 
		cflineHideProgressBody();
		
		var ntwkLnoGrpSrno = response.ntwkLineNo;
		var optionHtml = "<option value='" + ntwkLnoGrpSrno + "' selected='selected'>" + ntwkLnoGrpSrno + "</option>";
		var addYn = true;
		
		$("#ntwkLnoGrpSrno").find("option").each(function() {
			if(ntwkLnoGrpSrno == this.value) {
				addYn = false;
			} 
		})
		
		if(addYn) {
			$("#ntwkLnoGrpSrno").append(optionHtml);
		}
		
		// 현재 선번 그룹 번호
		pathSameNo = ntwkLnoGrpSrno;
		setPrevNtwkLnoGrpSrno(ntwkLnoGrpSrno);
		
		resetTeamsPath();
	}
	// Smux링에서 기설 서비스회선 선번 정보취득 
	else if ( flag == "selectSvlnLinePath") {	
		cflineHideProgressBody();
		if(response.data != undefined) {
			// 취득한 기설 서비스회선정보의 LINKS정보만 취하고 기본 data 정보는 현재 링의 정보로 셋팅하여 teamsPath에 넘겨준다
			var infData = baseInfData[0];
			var tmpData = {
					 "NETWORK_ID" : infData.ntwkLineNo
			       , "NETWORK_NM" : infData.ntwkLineNm 
			       , "NETWORK_STATUS_CD" : infData.ntwkStatCd 
			       , "NETWORK_STATUS_NM" : null
			       , "NETWORK_TYPE_CD" : infData.ntwkTypCd 
			       , "NETWORK_TYPE_NM" : null
			       , "PATH_DIRECTION" : null
			       , "PATH_SAME_NO" : null
			       , "PATH_SEQ" : null
			       , "TOPOLOGY_LARGE_CD" : infData.topoLclCd 
			       , "TOPOLOGY_LARGE_NM" : null 
			       , "TOPOLOGY_SMALL_CD" : infData.topoSclCd 
			       , "TOPOLOGY_SMALL_NM" : infData.topoSclNm
			       , "TOPOLOGY_CFG_MEANS_CD" : infData.topoCfgMeansCd
			       , "TOPOLOGY_CFG_MEANS_NM" : infData.topoCfgMeansCdNm
			       , "USE_NETWORK_PATHS" : null
			       , "USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH" : false
			} 
			
			var copyPathData = [];
			
			copyPathData = tmpData;
			copyPathData.LINKS = setPreLinePath(response);
						
			if (copyPathData.LINKS.length > 0) {
				alertBox('I', "청약시 설정한 기설 서비스회선 [" + response.data.NETWORK_NM + "] 의 <br>선번을 복제하여 자동 셋팅했습니다. <br>선번 내용을 확인해 주세요.");
			
				originalPath = copyPathData;
				teamsPath.fromTangoPath(originalPath);
				teamsPathData = teamsPath.toData();		// 그리드
				teamsShortPathData = teamsPath.toShortPath();
				
				// 주선번 데이터 보존
				teamsPathWk = teamsPath;
				teamsPathDataWk = teamsPathData;
				teamsShortPathDataWk = teamsShortPathData;
				
				generateDiagram();
				teamsPathGrid();
				tangoPathGrid();
				
				pathSameNo = response.data.PATH_SAME_NO;
				modifyMainPath = true;
			}
			
		}
	}
	else if(flag == "selectSmuxRingPathInfo") {	
		if(response.data != undefined) {
									
			var tmpPathWithSmuxRingLinks= setPathRingData(response);
			
			if (tmpPathWithSmuxRingLinks.length > 0) {
				
				alertBox('I', "청약시 설정한 링  [" + response.data.NETWORK_NM + "] 의 <br>선번을 복제하여 자동 셋팅했습니다. <br>선번 내용을 확인해 주세요.");
				
				if (nullToEmpty(originalPath) == "") {

					var infData = baseInfData;
					var tmpData = {
							 "LINE_LARGE_CD" : infData.svlnLclCd
					 		, "LINE_LARGE_NM" : infData.svlnLclCdNm
					 		, "LINE_SMALL_CD" : infData.svlnSclCd
					 		, "LINE_SMALL_NM" : infData.svlnSclCdNm
					 		, "LINE_STATUS_CD" : infData.svlnStatCd
					 		, "LINE_STATUS_NM" : infData.svlnStatCdNm
					 		, "NETWORK_ID" : infData.svlnNo
					 		, "NETWORK_NM" : infData.lineNm
					 		, "PATH_DIRECTION" : null
					 		, "PATH_SAME_NO" : null
					 		, "PATH_SEQ" : null
					 		, "USE_NETWORK_PATHS" : []
					 		, "USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH" : false
					 		, "LINKS" : []
					} 
					originalPath = tmpData;
				} 
				
				teamsPathData = null;
				teamsShortPathData = null;
				teamsPath = new TeamsPath();
					
				// 기존 서비스회선 선번에 SMUX링 편집 선번을 추가함
				for (var i = 0 ; i < tmpPathWithSmuxRingLinks.length; i++) {
					originalPath.LINKS.push(tmpPathWithSmuxRingLinks[i]);
				}
												
				teamsPath.fromTangoPath(originalPath);
				teamsPathData = teamsPath.toData();		// 그리드
				teamsShortPathData = teamsPath.toShortPath();

				
				// 주선번 데이터 보존
				teamsPathWk = teamsPath;
				teamsPathDataWk = teamsPathData;
				teamsShortPathDataWk = teamsShortPathData;
				
				teamsPathGrid();
				tangoPathGrid();
				
				//pathSameNo = infData.PATH_SAME_NO;
				reGenerationDiagram(true);
				modifyMainPath = true;
			}
		}
	}
	// 2018-09-12  5. RU고도화 
	// 서비스회선추가를 통해 서비스회선을 사용네트워크로 선택한 경우 선번정보 취득
	else if ( flag == "selectedServicePath" ) {
		// 선택선번 트렁크 조회
		generateSelectedPath(response.data, "SERVICE", guid());
	}
	// 사용서비스회선 더블클릭하여 조회한 경우
	else if(flag == "serviceSearch") {
		// 사용네트워크 구성도 조회
		useNetworkSearch(response);
		
	} 
	// 5G-PON RU의 ETE적용
	else if (flag == "e2eApplayWithUseNetwork") {
		// E2E적용
		cflineHideProgressBody();
		setEteInfoFor5GPON(response);	
	}
	// CRN장비기반 서비스회선 선번 복제
	else if(flag == "copySvlnPathInfoByCrn") {	
		if(nullToEmpty(response.result) == 'OK') {
									
			var copyPath = response.copyPath;	
			
			if (copyPath.LINKS.length > 0) {
				
				alertBox('I', " [" + copyPath.NETWORK_NM + "] 의 <br>선번을 복제하여 자동 셋팅했습니다. <br>선번 내용을 확인해 주세요.");
				
				if (nullToEmpty(originalPath) == "") {

					var infData = baseInfData;
					var tmpData = {
							 "LINE_LARGE_CD" : infData.svlnLclCd
					 		, "LINE_LARGE_NM" : infData.svlnLclCdNm
					 		, "LINE_SMALL_CD" : infData.svlnSclCd
					 		, "LINE_SMALL_NM" : infData.svlnSclCdNm
					 		, "LINE_STATUS_CD" : infData.svlnStatCd
					 		, "LINE_STATUS_NM" : infData.svlnStatCdNm
					 		, "NETWORK_ID" : infData.svlnNo
					 		, "NETWORK_NM" : infData.lineNm
					 		, "PATH_DIRECTION" : null
					 		, "PATH_SAME_NO" : null
					 		, "PATH_SEQ" : null
					 		, "USE_NETWORK_PATHS" : []
					 		, "USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH" : false
					 		, "LINKS" : []
					} 
					originalPath = tmpData;
				} 
				
				teamsPathData = null;
				teamsShortPathData = null;
				teamsPath = new TeamsPath();
					
				// 기존 서비스회선 선번에 SMUX링 편집 선번을 추가함
				for (var i = 0 ; i < copyPath.LINKS.length; i++) {
					originalPath.LINKS.push(copyPath.LINKS[i]);
				}
												
				teamsPath.fromTangoPath(originalPath);
				teamsPathData = teamsPath.toData();		// 그리드
				teamsShortPathData = teamsPath.toShortPath();

				
				// 주선번 데이터 보존
				teamsPathWk = teamsPath;
				teamsPathDataWk = teamsPathData;
				teamsShortPathDataWk = teamsShortPathData;
				
				teamsPathGrid();
				tangoPathGrid();
				
				reGenerationDiagram(true);
				modifyMainPath = true;
			}
		} 
		else if (nullToEmpty(response.result) == 'NG1' && nullToEmpty(response.resultMsg) != "") {
			alertBox('W', response.resultMsg);
		}
	}
	else if(flag == "checkSMuxRingType"){
		cflineHideProgressBody();
		
		if(response.result == "OK"){
			bRessmuxRing = true;
			$("#btnSave").click();
		}
		else if (response.result == "NG"){
			callMsgBox('','C', 'S-MUX의 토폴로지 Ring 구조에 맞지않는 선번입니다.<br>자동으로 보정처리 하시겠습니까?<br>취소시 이대로 저장됩니다.', function(msgId, msgRst) {
				if (msgRst == 'Y') {
					cflineShowProgressBody();
					var data = AlopexGrid.trimData($('#'+'tangoPathList').alopexGrid('dataGet'));
					for(var i = 0; i < data.length; i++) {
						for(key in data[i]) {
							var temp = String(eval("data[i]."+key)).indexOf('alopex'); 
							if(temp == 0) {
								eval("data[i]."+key + " = ''");
							}
						}
						data[i].LINK_SEQ = (i+1);
					}
					
					var ruleParam = {"links" : JSON.stringify(data)
							, "topoLclCd" : initParam.topoLclCd
							, "topoSclCd" : initParam.topoSclCd
					};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/makeSMuxSubRing', ruleParam, 'POST', 'makeSMuxSubRing');
				}
				else{
					bRessmuxRing = true;
					$("#btnSave").click();
				}
			});
			bRessmuxRing = true;
			$("#btnSave").click();
		}
		else if (response.result == "MISS"){
			var saveMsg = response.errMsg + "<br>계속 진행하시겠습니까?";
			
			callMsgBox('','C', saveMsg, function(msgId, msgRst) {
				if (msgRst == 'Y') {
					bRessmuxRing = true;
					$("#btnSave").click();
				} else {
					bRessmuxRing = false;
				}
			});
		}
	}
	else if(flag == "makeSMuxSubRing"){
		cflineHideProgressBody();
		
		if(response.result == "OK"){
			
			teamsPathData = null;
			teamsShortPathData = null;
			teamsPath = new TeamsPath();
			
			deleteClassData(response.links);

			if(originalPath == null){
				var infData = baseInfData[0];
				var tmpData = {
						 "NETWORK_ID" : infData.ntwkLineNo
				       , "NETWORK_NM" : infData.ntwkLineNm 
				       , "NETWORK_STATUS_CD" : infData.ntwkStatCd 
				       , "NETWORK_STATUS_NM" : null
				       , "NETWORK_TYPE_CD" : infData.ntwkTypCd 
				       , "NETWORK_TYPE_NM" : null
				       , "PATH_DIRECTION" : null
				       , "PATH_SAME_NO" : null
				       , "PATH_SEQ" : null
				       , "TOPOLOGY_LARGE_CD" : infData.topoLclCd 
				       , "TOPOLOGY_LARGE_NM" : null 
				       , "TOPOLOGY_SMALL_CD" : infData.topoSclCd 
				       , "TOPOLOGY_SMALL_NM" : infData.topoSclNm
				       , "TOPOLOGY_CFG_MEANS_CD" : infData.topoCfgMeansCd
				       , "TOPOLOGY_CFG_MEANS_NM" : infData.topoCfgMeansCdNm
				       , "USE_NETWORK_PATHS" : null
				       , "USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH" : false
				} 
				
				originalPath = tmpData;
			}
			originalPath.LINKS = response.links;
			teamsPath.fromTangoPath(originalPath);
			teamsPathData = teamsPath.toData();		// 그리드
			teamsShortPathData = teamsPath.toShortPath();
			
			// 주선번 데이터 보존
			teamsPathWk = teamsPath;
			teamsPathDataWk = teamsPathData;
			teamsShortPathDataWk = teamsShortPathData;
			
			nodeDataArray = [];
	    	linkDataArray = [];
	    	
			generateDiagram();
			teamsPathGrid();
			tangoPathGrid();
			
			modifyMainPath = true;
			
			if(response.msg != undefined && response.msg != null && response.msg != ""){
				callMsgBox('','I', response.msg, function(msgId, msgRst){  
					
				});
			}
		}
		else{
			callMsgBox('','W', response.msg, function(msgId, msgRst){  
				
			});
		}
		
	}
	
	if(flag == "insertMwUsgDiv"){
		if(response.updateCnt > 0){
			// 부모창 데이터 재조회
			if (nullToEmpty(opener) != "" &&  $('#btnOpenerSeach' , opener.document).val() != undefined) {
				$('#btnOpenerSeach' , opener.document).click();
			}
		}
	}
	
	if(flag =="setLowMtsoByLastFdf"){
		var param = {"ntwkLineNo" : baseInfData[0].ntwkLineNo
				
		}
		tmofInfoPop(param, "Y");
	}
	
	//상위OLT장비등록
	if(flag == "selectVisualOltEqp") {
		
		var result = false;
		if(nullToEmpty(response.failMsg) == "") {
			//1건이 검색된 경우 바로 셋팅
			if (nullToEmpty(response.otlEqpIdInfCnt) == 1) {				
				cflineHideProgressBody();
				if(response.otlEqpIdInf.NODES.length > 0) {
					var gidOltEqpData = response.otlEqpIdInf;

					var oltPath = new TeamsPath();
					
					oltPath.fromData(gidOltEqpData);
					teamsPathData = oltPath.toData();		// 그리드
					
					var finPathIndex = oltPath.NODES.length;
					var node = teamsPath.NODES[finPathIndex-1];
					fdfNodeId = node.NODE_ID;
					
					teamsPath.insertNode(fdfNodeId, oltPath);
					reGenerationDiagram(true);

				}
			} else if (nullToEmpty(response.otlEqpIdInfCnt) > 1) {
				cflineHideProgressBody();
				//다건검색된 경우 팝업표시
				openOltEqpListPop(response);
			} 
		} else {
			cflineHideProgressBody();
			alertBox('I', response.failMsg);
		}
	}
}


/**
 * 다이어그램 init
 */
function initDiagram() {
	visualLinePath =
		$go(go.Diagram, "visualWkDiv",
	        {
			  maxSelectionCount: 1,
			  layout:
	        	  $go(go.GridLayout,
			              {  
	        		  			wrappingWidth: Infinity, cellSize: new go.Size(4, 4), spacing: new go.Size(20, 20),
	        		  			alignment: go.GridLayout.Position,
	        		  			comparer: function(a, b) {
									var av = a.data.SEQ;
									var bv = b.data.SEQ;
									if(av < bv) return -1;
									if(av > bv) return 1;
									return 0;
	        		  			}
			              }), 
	          initialContentAlignment: go.Spot.Center,
	          
	          "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom,
	          scale : 0.8,

	          // 드래그 이벤트
	          allowZoom: true,
	          allowDrop: true,
	          mouseDrop: function(e) {
	        	  finishDrop(e);
	          }
	          , ClipboardPasted : ClipboardPasted	// 2019-12-17 키보드 이벤트 추가
	        }
		);
	
	makeNodeTemplate();
	makeLinkTemplate();
	setDiagramClickEvent();
	
	visualLinePath.allowDelete = false;
	
	// 선택선번에서 드랍할 때 스크롤이 아래로 가는 현상 제거(세로 스크롤 비허용)
	visualLinePath.allowVerticalScroll = false;
		
	// 드래그 할 때 링크연결 해제
	var tool = visualLinePath.toolManager.draggingTool;
	tool.canStart = function(pt, obj) {
		if(this.findDraggablePart() != undefined) {
			var model = visualLinePath.model;
			model.linkDataArray = [];
//			var draggedData = this.findDraggablePart().data;
		}
		return true;
	}
	
	tool.doDragOver = function(pt, obj) {
		if(selectedLinePathDiv.currentTool.currentPart != null) {
			var model = visualLinePath.model;
			if(model.linkDataArray.length > 0) {
				model.linkDataArray = [];
			}
		}
	}
		
	// 드래그 된 후 센터 이동
	visualLinePath.addDiagramListener("InitialLayoutCompleted", function(e) {
		if(nodeSelectedIdx != null) {
			if($("#visualWkDiv").find("canvas")[0].scrollWidth > 1310) {
				var node = visualLinePath.findNodeForData(nodeDataArray[nodeSelectedIdx]);
				visualLinePath.centerRect(node.actualBounds);
			}
		}
		nodeSelectedIdx = null;
	});
	
	// 2019-12-17 키보드 이벤트
	visualLinePath.commandHandler.copySelection = function() {
		var data = this.diagram.selection.Da.key.data;
		
		if(TeamsNode.prototype.isPrototypeOf(data)) {
			if(data.isGroup) {
				networkNe = "NETWORK";
			} else {
				networkNe = "NE";
			}
		} else if(TeamsPath.prototype.isPrototypeOf(data)) {
			networkNe = "NETWORK";
		}
		
	  	if(networkNe == "NETWORK") {
	  		this.diagram.commandHandler.copyToClipboard(null);
	  	} else {
	  		// SKB일 경우 FDF 장비만 붙여넣기 가능하도록 수정
	  		if(initParam.mgmtGrpCd == "0001") {
	  			go.CommandHandler.prototype.copySelection.call(visualLinePath.commandHandler);
      		} else {
      			if(isFdfNe(data.NE_ROLE_CD)) {
      				go.CommandHandler.prototype.copySelection.call(visualLinePath.commandHandler);
      			} else {
      				// clipboard data clear
      				this.diagram.commandHandler.copyToClipboard(null);
      			}
      		}
	  	}
		
	}
}

function initSprDiagram() {
	visualLinePath =
		$go(go.Diagram, "wdmTrunkSprDiv",
	        {
			  layout:
	        	  $go(go.GridLayout,
			              {  
	        		  			wrappingWidth: Infinity, cellSize: new go.Size(4, 4), spacing: new go.Size(20, 20),
	        		  			alignment: go.GridLayout.Position,
	        		  			comparer: function(a, b) {
									var av = a.data.SEQ;
									var bv = b.data.SEQ;
									if(av < bv) return -1;
									if(av > bv) return 1;
									return 0;
	        		  			}
			              }), 
	          initialContentAlignment: go.Spot.Center,
	          scale : 0.8,
	          // 드래그 이벤트
	          allowDrop: true,
	          mouseDrop: function(e) {
	        	  finishDrop(e);
	          }
	        }
		);
	
	makeNodeTemplate();
	makeLinkTemplate();
	setDiagramClickEvent();
	
	visualLinePath.allowDelete = false;
	
	// 드래그 할 때 링크연결 해제
	var tool = visualLinePath.toolManager.draggingTool;
	tool.canStart = function() {
		if(this.findDraggablePart() != undefined) {
			var model = visualLinePath.model;
			model.linkDataArray = [];
		}
		return true;
	}
	
	tool.doDragOver = function(pt, obj) {
		if(selectedLinePathDiv.currentTool.currentPart != null) {
			var model = visualLinePath.model;
			if(model.linkDataArray.length > 0) {
				model.linkDataArray = [];
			}
		}
	}
}

function initSelectedDiagram() {
	selectedLinePathDiv = 
		$go(go.Palette, "selectPathDiv",
		        {
				  maxSelectionCount: 1,
				  layout:
					  $go(go.GridLayout,
			              {
						  		spacing: new go.Size(10, 10),
	        		  			alignment: go.GridLayout.Location
			              })
			      , scale : 0.8
			      , "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom
		        }
			);
	
	setSelectedNodeTemplate();
	setSelectedGroupTemplate();
	setSelectedDiagramClickEvent();
	selectedLinePathDiv.addDiagramListener("SelectionMoved",
		function(e) {
			if(e.diagram.selection.Da.key.data.group != undefined) {
				selectedLinePathDiv.currentTool.doCancel();
			}
		}
	);
}


function makeNodeTemplate() {
	setNodeTemplate();
	setGroupTemplate();
}

/**
 * generateDiagram
 */
function generateDiagram() {
	generateNodes();
	generateLinks();
	
	visualLinePath.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    nodeSelectionAdornedPath();
    
//    visualLinePath.scale = parseFloat(0.8);
}

/**
 * 노드를 생성한다.
 */
function generateNodes() {
	useServiceNetworkId = null;
	useTrunkNetworkId = null;
	useRingNetworkId = null;
	useWdmTrunkNetworkId = null;
	var guid = null;
	
    for ( var idx = 0; idx < teamsShortPathData.NODES.length; idx++) {
    	var node = teamsShortPathData.NODES[idx];
    	node.key = node.NODE_ID;
    	node.NODE_ID = node.NODE_ID;
    	node.NE_NM = node.Ne.makeNodeTitle();
    	node.NE_ID = node.Ne.NE_ID;
    	node.ORG_NM = node.Ne.ORG_NM;
    	
    	node.WEST_PORT_NM = node.BPortDescr.PORT_NM;
    	node.WEST_PORT_ID = node.BPortDescr.PORT_ID;
    	node.WEST_CHANNEL_DESCR = node.BPortDescr.CHANNEL_DESCR;
    	node.WEST_PORT_CHANNEL = node.BPortDescr.PortChannelDescr();
    	
    	node.EAST_PORT_NM  =  node.APortDescr.PORT_NM;
    	node.EAST_PORT_ID  =  node.APortDescr.PORT_ID;
    	node.EAST_CHANNEL_DESCR = node.APortDescr.CHANNEL_DESCR;
    	node.EAST_PORT_CHANNEL = node.APortDescr.PortChannelDescr();
    	
    	node.NE_ROLE_CD = node.Ne.NE_ROLE_CD;
    	node.source = getEqpIcon(node.Ne.NE_ROLE_CD, "");
    	node.category = "NE";
    	node.color = "#BDBDBD";
//    	node.color = "#BFAFAF";
    	
    	node.nodeTooltipText = node.toString();
    	node = generateGroupNodes(node, "line");
    	    	
    	nodeDataArray.push( node );
    }
    
    // rest seq
    for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
    	nodeDataArray[idx].SEQ = idx + 1;
    }
}

/**
 * 링크를 연결한다.
 */
function generateLinks() {
	var fromKey = null;
	var toKey = null;
	
	var count = teamsShortPathData.NODES.length;
	var prevNode = null;
	var curNode = null;
	linkDataArray = [];
	
	for ( var idx = 0; idx < count; idx++) {
    	curNode = teamsShortPathData.NODES[idx];
//    	fromKey = idx - 1;
//    	toKey = idx;
    	
    	if(prevNode == null) {
    		fromKey = -1;
    	} else {
    		fromKey = prevNode.NODE_ID;
    	}
    	toKey = curNode.NODE_ID;
    	
    	linkDataArray.push( {from : fromKey, to: toKey} );
    	
    	prevNode = curNode;
    }
}


/**
 * 선택 선번 네트워크 노드
 * @param network
 */
function generateSelectedNodes(network, guid) {
	 for ( var idx = 0; idx < selectedShortPathData.NODES.length; idx++) {
    	var node = selectedShortPathData.NODES[idx];
    	
//    	node.key = idx;
    	node.key = node.NODE_ID;
    	node.NODE_ID = node.NODE_ID;
//    	node.group = network + selectedTeamsPath.NETWORK_ID;
    	node.group = guid;
    	node.NE_NM = node.Ne.makeNodeTitle();
    	node.NE_ID = node.Ne.NE_ID;
    	node.ORG_NM = node.Ne.ORG_NM;
    	
    	node.WEST_PORT_NM = node.BPortDescr.PORT_NM;
    	node.WEST_CHANNEL_DESCR = node.BPortDescr.CHANNEL_DESCR;
    	node.WEST_PORT_CHANNEL = node.BPortDescr.PORT_NM + node.BPortDescr.CHANNEL_DESCR; 
    	
    	node.EAST_PORT_NM  =  node.APortDescr.PORT_NM;
    	node.EAST_CHANNEL_DESCR = node.APortDescr.CHANNEL_DESCR;
    	node.EAST_PORT_CHANNEL = node.APortDescr.PORT_NM + node.APortDescr.CHANNEL_DESCR;
    	
    	node.NE_ROLE_CD = node.Ne.NE_ROLE_CD;
    	node.source = getEqpIcon(node.Ne.NE_ROLE_CD, "");
    	node.category = "NE";
    	node.color = "#BDBDBD";
    	
    	node.nodeTooltipText = node.toString();
    	
    	if(node.__gohashid != undefined) {
    		delete node.__gohashid;
    	}
    	selectedPathNodeDataArray.push( node );
    }
}

/**
 * 선택 선번 장비 노드
 * @param network
 */
function generateSelectedNeNodes(data) {
	var node = new TeamsNode();
	var autoSetPort = new PortDescr();
	// node.Ne 설정
	for(var key in node.Ne) {
		var convertKey = key.toLowerCase();
	        convertKey = convertKey.replace(/_(\w)/g, function(word) {
            return word.toUpperCase();
        });
		convertKey = convertKey.replace(/_/g, "");
		
		$.each(data, function(dataKey, dataVal) {
			if(dataKey == convertKey) {
				node.Ne[key] = dataVal;				
			}
		});		
	}
	var tmpFiveGponEqpType = getFiveGponEqpType(node.Ne, "");
	node.Ne.FIVE_GPON_EQP_TYPE = tmpFiveGponEqpType;
		
	//autoPortSetYn : 자동셋팅할 포트가 있는경우 /autoSetPortId : 자동셋틩 포트 ID / autoSetPortNm : 자동셋팅 포트 NM
	//자동셋팅 모델 혹은 장비타임 추가가 필요할경우 장비 조회 쿼리수정필요	
	//장비셋팅시 포트동일하게 셋팅하므로 left / right 포트에 동일하게 com1 포트가 셋팅됨.	
	
	// TODO BC-MUX, CWDM-MUX 링 이 아닌데 BCMUX, CWDMMUX 장비를 택한 경우 COM 포트 자동 셋팅하지 않음
	if (isSkbMuxRing() == false && data.autoPortSetYn == "Y" && (data.neRoleCd == "183" || data.autoPortSetYn == "184")) {
		data.autoPortSetYn = "N"; 
	}
	// BC-MUX, CWDM-MUX 링인경유  BCMUX, CWDMMUX 장비 이외의 장비에 대해서는 COM 포트 자동 셋팅 하지 않음
	else if (isSkbMuxRing() == true && data.autoPortSetYn == "Y" && data.neRoleCd != "183" && data.autoPortSetYn != "184") {
		data.autoPortSetYn = "N";
	}	
	
	if(data.autoPortSetYn == "Y" && nullToEmpty(data.autoSetPortId) != "" && initParam.topoSclCd == "035" && topologyType != "001"){
		autoSetPort.PORT_ID = data.autoSetPortId;
		autoSetPort.PORT_NM = data.autoSetPortNm;
		autoSetPort.PORT_DESCR = data.autoSetPortNm;
		//시각화의경우 a,b포트 모드 셋팅후 사용자가 포트 삭제하도록 한다. 
		node.APortDescr = autoSetPort;
		node.BPortDescr = autoSetPort;				
	}  
	// BC-MUX, CWDM-MUX 링인경우
	else if (data.autoPortSetYn == "Y" && nullToEmpty(data.autoSetPortId) != "" && isSkbMuxRing() == true) {
		autoSetPort.PORT_ID = data.autoSetPortId;
		autoSetPort.PORT_NM = data.autoSetPortNm;
		autoSetPort.PORT_DESCR = data.autoSetPortNm;
		//시각화의경우 a,b포트 모드 셋팅후 사용자가 포트 삭제하도록 한다. 
		node.APortDescr = autoSetPort;
		node.BPortDescr = autoSetPort;	
	}
	
	
//    	node.key = 0;
//    	node.group = "NE" + node.Ne.NE_ID;
	node.NE_NM = node.Ne.makeNodeTitle();
	node.NE_ID = node.Ne.NE_ID;
	node.ORG_NM = node.Ne.ORG_NM;
	
	node.NE_ROLE_CD = node.Ne.NE_ROLE_CD;
	node.source = getEqpIcon(node.Ne.NE_ROLE_CD, "");
	node.category = "NE";
	node.color = "#BDBDBD";
	
	node.nodeTooltipText = node.toString();
	
	selectedPathNodeDataArray.push( node );
	selectedOriginalPath[data.neId] = node;
	
	selectedLinePathDiv.model = new go.GraphLinksModel(selectedPathNodeDataArray, selectedPathLinkDataArray);
	
	nodeSelectionAdorned();
}

/**
 * 선택 선번 그룹
 * 
 * @param network
 */
function generateSelectedGroupNodes(network, guid) {
	// 그룹 템플릿
	var teamsNode = new TeamsNode();
	teamsNode.key = guid;
	
	teamsNode.expanded = true;
	teamsNode.isGroup = true;
	teamsNode.expanded = true;
	teamsNode.category = network;
	
	if(network == "TRUNK") {
		// 유휴율 포함
		var trunkIdleText = "";
		if(trunkIdle != null) {
			for(var idx = 0; idx < trunkIdle.length; idx++) {
				if(trunkIdle[idx].ntwkLineNo == selectedShortPathData.NETWORK_ID) {
					var ntwkIdleRate = trunkIdle[idx].ntwkIdleRate;
					if(ntwkIdleRate == undefined) {
						ntwkIdleRate = 0;
					}
					
					var e1PortSpare = trunkIdle[idx].e1PortSpare;
					if(e1PortSpare == undefined) {
						e1PortSpare = 0;
					}
					
					trunkIdleText = "  <유휴율 : " + ntwkIdleRate + ", E1여유 : " + e1PortSpare + ">";
				}
			}
		}
		teamsNode.NETWORK_NM = selectedShortPathData.NETWORK_NM + trunkIdleText;
	} else {
		teamsNode.NETWORK_NM = selectedShortPathData.NETWORK_NM;
	}
	teamsNode.NETWORK_ID = selectedShortPathData.NETWORK_ID;
	teamsNode.PATH_SAME_NO = selectedShortPathData.PATH_SAME_NO;
	
	if(network == "SERVICE") {
		teamsNode.color = "#5587ED";
	} else if(network == "TRUNK") {
		teamsNode.color = "#A89824";
	} else if(network == "RING") {
		teamsNode.color = "#FF7171";
	} else if(network == "WDM_TRUNK") {
		teamsNode.color = "#3A8B3A";
	}
	
	selectedPathNodeDataArray.push(teamsNode);
}

/**
 * 선택 선번의 노드 추가
 *   - 서비스,트렁크, WDM트렁크
 */
function generateSelectedPath(data, network, guid) {
	if( data != undefined ) {
		selectedTeamsPath = new TeamsPath();
		selectedShortPathData = null;
		
		// 트렁크, WDM트렁크
		if( network == "SERVICE" || network == "TRUNK" || network == "WDM_TRUNK" ) {
			selectedTeamsPath.fromTangoPath(data);
		} else if( network == "RING" ) {
			selectedTeamsPath = data;
		}
		selectedShortPathData = selectedTeamsPath.toShortestPath();
		
		selectedOriginalPath[data.NETWORK_ID] = selectedTeamsPath;
		
		generateSelectedNodes(network, guid);
		generateSelectedGroupNodes(network, guid);
		
		selectedLinePathDiv.clear();
		selectedLinePathDiv.model = new go.GraphLinksModel(selectedPathNodeDataArray, selectedPathLinkDataArray);
		
		nodeSelectionAdorned();
	} else {
		alertBox('W', '선번 정보가 없습니다');
	}
	
	cflineHideProgressBody();
}

/**
 * 주선번 여러개 생성
 */
function pathCreate(response) {
	$("#wkSprlabel").show();
	
	if(response.ntwkLnoGrpSrno != undefined) {
		// 선번이 존재
		$("#ntwkLnoGrpSrno").remove();
		var selectHtml = "<select id = 'ntwkLnoGrpSrno' name = 'ntwkLnoGrpSrno' class='divselect'>";
		for(var i = 0; i < response.ntwkLnoGrpSrno.length; i++) {
			var optionHtml = "<option value='" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "'";
			/*if(pathSameNo == response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno) optionHtml += " selected=true ";*/
			optionHtml += ">" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "</option>";
			selectHtml += optionHtml;
		}
		
		selectHtml += "</select>";
		$("#wkSprlabel").append(selectHtml);
		$("#ntwkLnoGrpSrno").val(pathSameNo);
		
		// select change시 저장해야 될 ID
		setPrevNtwkLnoGrpSrno(pathSameNo);
	} else {
		// 선번이 존재하지 않아서 기본 1로 설정
		$("#ntwkLnoGrpSrno").remove();
		var selectHtml = "<select id = 'ntwkLnoGrpSrno' name = 'ntwkLnoGrpSrno' class='divselect'>";
		selectHtml += "<option value='1' selected=true>1</option>";
		selectHtml += "</select>";
		$("#wkSprlabel").append(selectHtml);
		
		// select change시 저장해야 될 ID
		setPrevNtwkLnoGrpSrno("1");
	}
	
	// select change 이벤트 바인딩
	ntwkLnoGrpSrnoChangeEvent();
}


function ntwkLnoGrpSrnoChangeEvent() {
	$("#ntwkLnoGrpSrno").change(function(e) {
		var selectedValue = $(this).val();
		callMsgBox('','C', cflineMsgArray['saveCurrntPath'] + cflineMsgArray['saveMsg'], function(msgId, msgRst){
			if (msgRst == 'Y') {
				selNtwkLnoGrpSrnoChg = true;
				$('#btnSave').click();
			} else {
				selectedValue = prevNtwkLnoGrpSrno;
			}			
			//저장후 및 취소후 표기할 선번그룹 셋팅
			//저장 취소시 선택이전 data를 정상적으로 가져오시 못하는 버그 수정 
    		$("#ntwkLnoGrpSrno").children("option:selected").removeAttr("selected");
    		$("#ntwkLnoGrpSrno").val(selectedValue);   
    		
		});
	});
}
		
function setPrevNtwkLnoGrpSrno(tempValue) {
	prevNtwkLnoGrpSrno = tempValue;
}
		
/************************************************************************************************
 * 다이어그램 그리기
 ***********************************************************************************************/
/**
 * 트렁크 그리기(사용않함)
 * @param response
 */
function trunkSearch(response) {
	if(response.data != null) {
		$("#ringAddDropBtnDiv").hide();
		diagramReset();
		$("#selectedUseNetwork").attr("style", "height: 39vh;");
		$("#selectedUseNetwork").append("<div id=\"trunkDiv\" style=\"width:100%;  height:42vh;\"></div>");	
		
		originalTrunkPath = response.data;
		teamsTrunkPath.fromTangoPath(originalTrunkPath);
		
		initTrunkDiagram();
		generateTrunkDiagram();
		$("#basicTabs").setTabIndex(2);
	}
	cflineHideProgressBody();
}

/**
 * 링 그리기
 * @param response
 */
function ringSearch(response) {
	if(response.data != null) {
		
		$("#ringAddDropBtnDiv").show();
		diagramReset();
		$("#selectedUseNetwork").attr("style", "height: 39vh; padding-top:35px;");
		$("#selectedUseNetwork").append("<div id=\"ringDiv\" style=\"width:100%;  height:37vh; position:relative;\"></div>");
		
		
		originalRingPath = response.data;
		teamsRingPath.fromTangoPath(originalRingPath);
		
	    originalTeamsPath.fromTangoPath(originalRingPath);
	    teamsRingPath = originalTeamsPath.createRingPath();
	    
	    if( teamsRingPath.NODES.length < 1 ) {		    	
//	    	alertBox('W', '링 구성도를 표시할 데이터가 없습니다.');
	    	return false;
	    }
		    
	    if ( originalRingPath.TOPOLOGY_SMALL_CD === '002' ) {
			isPtpRing = true;
		} 

		if ( isPtpRing || teamsRingPath.NODES.length <= 2 ) {
			isDisplayLinear = true;
		}
		
		initRingDiagram();

		// 2개이상으로 동그란 링을 그려야 하는 경우 맨 처음 구성도 탭에 이미지를 그리는 경우 다이아그램의 div영역이 존재하지 않아 scale사이즈가 너무 작아 그림이 나타나지 않음
		// divi영역을 인식시키기 위해 탭이동을 머저 처리함(2018-03-28)
		$("#basicTabs").setTabIndex(2);		
		generateRingDiagram();
	}
	cflineHideProgressBody();
}

/**
 * WDM트렁크 그리기(사용않함)
 */
function wdmTrunkSearch(response) {
	if(response.data != null) {
		$("#ringAddDropBtnDiv").hide();
		diagramReset();
		
		$("#selectedUseNetwork").append("<div id=\"wdmDiv\" style=\"width:100%;  height:44vh;\"></div>");	
		
		
		originalWdmPath = response.data;
		teamsWdmPath.fromTangoPath(originalWdmPath);
		
		initWdmDiagram();
		generateWdmDiagram();
		$("#basicTabs").setTabIndex(2);
	}
	
	cflineHideProgressBody();
}

/**
 * 사용 네트워크 그리기(공통으로 빼서 서비스회선/트렁크/WDM트렁크 모두 같이 사용하도록 처리)
 * @param response
 */
function useNetworkSearch(response) {
	if(response.data != null) {
		$("#ringAddDropBtnDiv").hide();
		diagramReset();
		$("#selectedUseNetwork").attr("style", "height: 35vh;");
		$("#selectedUseNetwork").append("<div id=\"useNetworkDiv\" style=\"width:100%;  height:35vh;\"></div>");	
		
		originalUseNetworkPath = response.data;
		teamsUseNetworkPath.fromTangoPath(originalUseNetworkPath);
		
		initUseNetworkDiagram();
		generateUseNetworkDiagram();
		$("#basicTabs").setTabIndex(2);
	}
	cflineHideProgressBody();
}


/************************************************************************************************
 * 이벤트 리스너
 ***********************************************************************************************/
/**
 * 버튼 이벤트
 */
function setButtonEventListener() {
	$('#zoomsin').on('click', function(e){
		// 상위 레이어로
		visualLinePath.commandHandler.increaseZoom(1.25);
	});
	
	$('#zoomsout').on('click', function(e){
		// 하위 레이어로
		visualLinePath.commandHandler.decreaseZoom(0.8);
	});
	
	// 선번 생성 버튼 클릭
	$('#btnLineInsert').on('click', function(e){
		callMsgBox('','C', cflineMsgArray['saveCurrntPath'] + ' ' + cflineMsgArray['saveMsg'], function(msgId, msgRst){
    		if (msgRst == 'Y') {
    			// 저장 로직
    			// 저장 후 callback으로 변경
    			// httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectMaxNtwkLnoGrpSrno', params, 'POST', 'selectMaxNtwkLnoGrpSrno');
    			btnLineInsertClickYn = true;
    			$('#btnSave').click();
    		}
		});
	});
	
	// 선번 복사
	$('#btnPathCopy').on('click', function(e) {
		copyPath();
	});
	
	// 예비선번으로 변경
	$('#btnReservePathChange').on('click', function(e) {	
		/**
		 * 1. 현재 탭이 주선번 일 경우
		 * teamsPath = teamsPathWk
		 * teamsPathSpr
		 * 
		 * 2. 현재 탭이 예비선번일 경우
		 * teamsPath = teamsPathSpr
		 */
		if($("#wkSprDiv").getCurrentTabIndex() == 0) {
			// 주선번
			var tmpTeamsPath = new TeamsPath();
			var tmpTeamsPathData = null;
			var tmpTeamsShortPathData = null;
			
			// 주선번의 데이터 temp에 담기
			tmpTeamsPath = teamsPath;
			tmpTeamsPathData = teamsPathData;
			tmpTeamsShortPathData = teamsShortPathData;
			
			// 예비선번 데이터 주선번에 담기
			teamsPath = teamsPathSpr;
			teamsPathData = teamsPathDataSpr;
			teamsShortPathData = teamsShortPathDataSpr;
			
			teamsPathWk = teamsPathSpr;
			teamsPathDataWk = teamsPathDataSpr;
			teamsShortPathDataWk = teamsShortPathDataSpr;
			
			// temp데이터(주선번) 예비선번에 담기
			teamsPathSpr = tmpTeamsPath;
			teamsPathDataSpr = tmpTeamsPathData;
			teamsShortPathDataSpr = tmpTeamsShortPathData;
			
			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			// 현재선번 주선번 표시
			teamsPath.WK_SPR_DIV_CD = '01';
		} else {
			// 예비선번
			var tmpTeamsPath = new TeamsPath();
			var tmpTeamsPathData = null;
			var tmpTeamsShortPathData = null;
			
			// 예비선번의 데이터 temp에 담기
			tmpTeamsPath = teamsPath;
			tmpTeamsPathData = teamsPathData;
			tmpTeamsShortPathData = teamsShortPathData;
			
			// 주선번 데이터 예비선번(현재선번)에 담기
			teamsPath = teamsPathWk;
			teamsPathData = teamsPathDataWk;
			teamsShortPathData = teamsShortPathDataWk;
			
			teamsPathSpr = teamsPathWk;
			teamsPathDataSpr = teamsPathDataWk;
			teamsShortPathDataSpr = teamsShortPathDataWk;
			
			// temp데이터(예비선번) 주선번에 담기
			teamsPathWk = tmpTeamsPath;
			teamsPathDataWk = tmpTeamsPathData;
			teamsShortPathDataWk = tmpTeamsShortPathData;

			// 3. [수정] 주선번/예비선번 탭 선택시 버그수정
			// 현재선번 예비선번 표시
			teamsPath.WK_SPR_DIV_CD = '02';
		}
		
		reGenerationDiagram(true);		
	});
	
	// 서비스회선 추가
	$('#btnServiceAdd').on('click', function(e) {	
		if (isRuCoreLine() == false && isRuMatchLine() == false) {
			return;
		}
		// 서비스회선조회
		openServiceListPop();
	});
		
	// 트렁크 추가
	$('#btnTrunkAdd').on('click', function(e) {	
		openTrunkListPop();
	});
	
	// 링 추가
	$('#btnRingAdd').on('click', function(e) {	
		openRingListPop();
	});
	
	// WDM트렁크 추가
	$('#btnWdmTrunkAdd').on('click', function(e) {	
		openWdmTrunkListPop();
	});
	
	// 장비 추가
	$('#btnNeAdd').on('click', function(e) {	
		openNeListPop();
	});
	
	// 선번 뒤집기
	$('#btnPathReverse').on('click', function(e) {	
		pathReverse();
	});
	
	// 링 구성도 확인
	$('#btnRingPath').on('click', function(e) {
		var data = {"ntwkLineNo" : teamsRingPath.NETWORK_ID, "ntwkLnoGrpSrno" : teamsRingPath.PATH_SAME_NO, "editYn" : "N" };
		openRingPath(data);
	});
	
	// 선로링, 장비링
	$('#btnLnRing, #btnEquipmentRing').on('click', function(e){
		openLnRingEqpRingPop(this.id);
	});
	
	// 회선 검증
	$('#btnPathVerify').on('click', function(e){

		//	검증 결과 초기화
		teamsPath.resetVerifyResult();
		teamsPathData = teamsPath.toData();
		$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
		
		//	검증을 했다는 것을 인식할 수 있도록 
		//	검증 결과를 초기화한 후에 타이머를 사용하여 결과를 표시한다.
		setTimeout( function() {
			var pathJrdtMtsoList = new PathJrdtMtsoList();
			pathJrdtMtsoList.fromData(responsePathJrdtMtsoList);
			teamsPath.verifyLinePath(pathJrdtMtsoList);
			
			// 그리드
			teamsPathData = teamsPath.toData();
			$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
			
		}, 200 );
		
	});
	
	$('#btnRingblockDiagram').on('click', function(e){
		openRingBlockDiagramPop();
	});
	
	// 저장
	$('#btnSave').on('click', function(e) {

		// 2019-12-12 링 이원화 : SMUX링의 토폴로지구성방식이 Ring인경우 링 구조에 맞는지체크
		if(initParam.topoSclCd == '035' && topologyType == "001" && bRessmuxRing == false){			
			// Grid의 길이가 0일 경우는 그대로 진행
			if(checkRingType() == true) {
				preSavePath();
			} 
		} 
	    //  SMUX링이 아니거나  SMUX링이면서 토폴로지구성방식이 Ring이 아닌경우
		else {
			preSavePath();
		}
	});
	
	//수집회선비교 버튼
	$('#btnCmslineCompare').on('click', function(e){	

		// 주선번
		var tmpTeamsPath = new TeamsPath();
		var tmpTeamsPathData = null;
		var tmpTeamsShortPathData = null;
		
		// 주선번의 데이터 temp에 담기
		tmpTeamsPath = teamsPath.clone();
		tmpTeamsPathData = tmpTeamsPath.toData();
		tmpTeamsShortPathData = tmpTeamsPath.toShortPath();
		
		if(tmpTeamsPathData.WK_SPR_DIV_CD == "02"){
	    	 alertBox('I', "예비선번은 수집회선 비교를 할수 없습니다."); /* 조회 실패 하였습니다.*/
	    	 return;
		} else {
		
			var rnmEqpId = (typeof initParam.rnmEqpId  != "undefined") ? initParam.rnmEqpId : "";
			var rnmEqpIdNm = (typeof initParam.rnmEqpIdNm  != "undefined") ? initParam.rnmEqpIdNm : "";
			var rnmPortId = (typeof initParam.rnmPortId  != "undefined") ? initParam.rnmPortId : "";
			var rnmPortIdNm = (typeof initParam.rnmPortIdNm  != "undefined") ? initParam.rnmPortIdNm : "";
			var rnmPortChnlVal = (typeof initParam.rnmPortChnlVal  != "undefined") ? initParam.rnmPortChnlVal : "";
			
			var editPath = tmpTeamsPathData; // WK_SPR_DIV_CD:	"01"

			$a.popup({
				popid: "CmsLineComparePop",
				title: "수집회선 비교",/*수집회선 비교*/
				url: 'CmsLineComparePop.do',
				data: {"gridId":initParam.gridId,"ntwkLineNo":searchParam.ntwkLineNo,"svlnLclCd":searchParam.svlnLclCd,"svlnSclCd":searchParam.svlnSclCd
					, "rnmEqpId" : rnmEqpId, "rnmEqpIdNm" : rnmEqpIdNm, "rnmPortId" : rnmPortId, "rnmPortIdNm" : rnmPortIdNm, "rnmPortChnlVal" : rnmPortChnlVal
					, "callViewType" : nullToEmpty(initParam.callViewType)
					, "editPath" : editPath
					, "baseInfData" : baseInfData
					, "teamsFlag" : true},
				iframe: false,
				modal : true,
				movable:false,
				windowpopup : true,
				width : 1500,
				height : 800
				,callback:function(data){
					if(data != null){
							
						if(data.pathNew.NODES.length > 0) {

							teamsPathData = null;
							teamsShortPathData = null;
							teamsPath = new TeamsPath();
							
							teamsPath.fromData(data.pathNew);
							teamsPathData = teamsPath.toData();		// 그리드
							teamsShortPathData = teamsPath.toShortPath();
	
							// 주선번 데이터 보존
							teamsPathWk = teamsPath;
							teamsPathDataWk = teamsPathData;
							teamsShortPathDataWk = teamsShortPathData;
						}
						teamsPathGrid();
						tangoPathGrid();
						reGenerationDiagram(true);
					}
				}
			});
		}
		
	});
	
	//장비/선로정보버튼클릭
	$('#btnEqpNodeInfo').on('click', function(e){	

		// 주선번
		var tmpTeamsPath = new TeamsPath();
		var tmpTeamsPathData = null;
		var tmpTeamsShortPathData = null;

		openFdfListPop();
		
	});

	//상위OLT정보버튼클릭
	$('#btnOltEqpReg').on('click', function(e){	
		var chkResult = false;
		// 주선번
		var tmpTeamsPath = new TeamsPath();
		var tmpTeamsPathData = null;
		var tmpTeamsShortPathData = null;

		var lftEqpInstlMtsoId = "";
		var lftEqpId = "";
		var lftPortNm = "";
		
		var dataList = teamsPathData.NODES;
			
		if(dataList.length > 0) {
			for(var i = 0; i < dataList.length; i++) {						
				var eqpRoleDivCd = nullToEmpty(dataList[i].NE_ROLE_CD);
				if(eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182") {
					lftEqpInstlMtsoId = dataList[i].ORG_ID; 
					lftEqpId = dataList[i].NE_ID;	
					lftPortNm = dataList[i].B_PORT_NM;	
					chkResult = true;
					break;
				}
			}
		}
		
		if(lftEqpId == "") {
			alertBox("I", "적용할 상위OLT장비가 없습니다.");
			chkResult = false;
			return;
		} else {
			var msg = "";
			if(dataList.length > 0) {
				for(var i = 0; i < dataList.length; i++) {						
					var eqpRoleDivCd = nullToEmpty(dataList[i].NE_ROLE_CD);
					if(eqpRoleDivCd == "114") {
						msg = "상위OLT장비가 존재합니다. 진행하시겠습니까?";
						break;
					}
				}
			}
			
			if(msg != "") {
				callMsgBox('','C', msg, function(msgId, msgRst) {
					if(msgRst == 'Y') {
						cflineShowProgressBody();
						var param = {"ntwkLineNo": initParam.ntwkLineNo
								, "ntwkLnoGrpSrno": $('#ntwkLnoGrpSrno').val()
								, "lftEqpInstlMtsoId" : lftEqpInstlMtsoId
								, "lftEqpId" : lftEqpId	
								, "lftPortNm" : lftPortNm	
						}
						setOLTEqp(param);
					} else {
						chkResult = false;
					}
				});
			} else {
				var param = {"ntwkLineNo": initParam.ntwkLineNo
						, "ntwkLnoGrpSrno": $('#ntwkLnoGrpSrno').val()
						, "lftEqpInstlMtsoId" : lftEqpInstlMtsoId
						, "lftEqpId" : lftEqpId	
						, "lftPortNm" : lftPortNm	
				}
				setOLTEqp(param);
			}
		}
	});
	
	//경유링 추가 버튼
	$('#btnCascadingRingAdd').on('click', function(e){
		if (isMeshRing(nullToEmpty(initParam.topoSclCd)) == false && isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == false) {
			return;
		}
		
		//SKB 가입자망링 경유링추가
		useRingPopChk();
	});
	
	// 모든 경유링 표시
	$('#cascadingRingDisplay1, #cascadingRingDisplay2').on('click', function(e) {
		// 구간선번 탭에서 선택한 경우
		var editGrid =  tagngoGridId;
		var chkboxTyp = "TG";  // TG : tango, TM : teams
		var editRontChkBox = "rontTrunkDisplay1";
		// 예비선번의 모든 경유링 표시를 클릭한 경우
		if (this.id == "cascadingRingDisplay2") {
			editRontChkBox = "rontTrunkDisplay2";
			editGrid =  teamsGridId;
			chkboxTyp = "TM";
		}
		
		var focusData = $('#'+editGrid).alopexGrid("dataGet");
		var rowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData[0]._index.row);
		if($('#' + this.id).is(':checked')) {
			if (isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == true) {
				$('#'+editGrid).alopexGrid('showCol', ['CASCADING_RING_NM_3']);
			} else {
				$('#'+editGrid).alopexGrid('showCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
			}
			$('#'+editGrid).alopexGrid("focusCell", {_index : {data : rowIndex}}, 'CASCADING_RING_NM_3' );
			// 기간망 트렁크 TangoGrid
			if (chkboxTyp == "TG") {
				$("#rontTrunkDisplayCheckbox1").show();
			} else {
				$("#rontTrunkDisplayCheckbox2").show();
			}
		} else {
			if (isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == true) {
				$('#'+editGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_3']);				
			} else {
				$('#'+editGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
			}
			
			// 모든경유링 보기가 해지되면 경유링 보기도 체크해제하고 숨기기
			if($('#' + editRontChkBox).is(':checked')) {
				$('#' + editRontChkBox).click();
			}
			if (chkboxTyp == "TG") {
				$("#rontTrunkDisplayCheckbox1").hide();
			} else {
				$("#rontTrunkDisplayCheckbox2").hide();
			}
		}
		$('#'+editGrid).alopexGrid("updateOption", { fitTableWidth: true });		
	});
	
	// 2019-09-30  5. 기간망 링 선번 고도화
	// 기간망 트렁크 표시
	$('#rontTrunkDisplay1, #rontTrunkDisplay2').on('click', function(e){
		var editGrid =  tagngoGridId;
		
		if (this.id == "rontTrunkDisplay2") {
			editGrid =  teamsGridId;			
		}
		if($('#' + this.id).is(':checked')) {
			$('#'+editGrid).alopexGrid('showCol', ['RONT_TRK_NM']);
		} else {
			$('#'+editGrid).alopexGrid('hideCol', ['RONT_TRK_NM']);
		}
		$('#'+editGrid).alopexGrid("updateOption", { fitTableWidth: true });
    });
}

/* TODO
 * useRingPopChk
 * SKB 경유링선택팝업
 * 2021-05-13
 */
function useRingPopChk(){
	  	
	$a.popup({
    	popid: 'OpenUseRingChkPop',
    	title: '경유링 종류 선택 팝업',
    	iframe: true,
        modal: false,
        windowpopup: true,
	    url : getUrlPath()+'/configmgmt/cfline/OpenUseRingChkPop.do',
        data: dataParam,
        width : 700,
        height : 350 
    	,callback: function(data) {
    		
    		if(data != null) {
    			if(data == "1"){	//일반 경유링 선택
    				openUseRingRontTrunkSearchPopNew();
    			} else {	//전송망링 경유링 선택			
    				openUseBtbEqpRingPopNode();
				}
    		}
       	}
    });
}

function preSavePath() {
	
	// 2018-09-12  5. RU고도화
	// 주선번 변경여부
	if (wkSprYn) {
		if (checkWkSprYn() == false) {
			return;
		}
		
		// RU광코어이고, 주선번에 링이 2개이상이거나 5G-PON회선이 아니면서 예비선번의 링이 2개 이상인경우
		if (isRuCoreLine() == true 
			&& (checkUseRingCntAtRuPath(teamsPathWk.toTangoPath().toData()) > 1 || (isFiveGponRuCoreLine() == false && checkUseRingCntAtRuPath(teamsPathSpr.toTangoPath().toData()) > 1))) {
			alertBox('W', "RU광코어회선은 1개의 링만 사용가능합니다.");
			return;
		}
		
		// RU광코어이고, 가장마지막 EAST장비에 DU-L장비군이 등록되어있지 않는 경우
		if (isRuCoreLine() == true && checkDuLEqpLow(teamsPathWk.toData()) == 0) {
			alertBox('W', "EAST장비가 등록되지 않았습니다. 장비명 확인바랍니다."); 
			return;
		}
		
	} else {
		if (teamsPathWk == null || teamsPathWk.NODES.length == 0) {
		 teamsPathWk = teamsPath; // 작업중인 주선번 정보가 없는경우 초기화 하기 위해
		}
	}
	
	// 주선번 변경여부 체크하기 위해
	var tmpMainPathChk = new TeamsPath();
	tmpMainPathChk.fromTangoPath(originalPath);  // 선번 읽었을때 주선번
	var orgTangoPath = tmpMainPathChk.toTangoPath();   // 주선번
	var tmpTangoPath = teamsPathWk.toTangoPath();      // 작업한 주선번
		
	if(checkCmuxExt(teamsPathWk)) {
		wkSprYn = true;
	}	
	
	// 5G-PON링인경우 COT장비 필수 체크
	if (isFiveGponRing() == true) {		
		if (checkCotEqpLowNew(teamsPathWk.toData()) == false ) {
			alertBox('W', "5G-PON링의 경우 COT장비는 첫구간에 설정하셔야 합니다.");
			return;
		};
	}
	
	if (modifyMainPath == false) {
		var tmpChk = false;
		if (orgTangoPath != null) {	  // 기존 주선번이 있는경우		
			//var orgLinks = orgTangoData.LINKS;
			if (tmpTangoPath == null) {
				tmpChk = true;
			} else {
				tmpChk = orgTangoPath.isChange(tmpTangoPath);
			}
		} else if (tmpTangoPath != null) {  // 기존 주선번이 없고 작업후 주선번이 생긴경우
			tmpChk = true;
		}
		modifyMainPath = tmpChk;
	}
	
	/*
	 * 가입자망도 경유링 사용이 가능해져서 사용링 관련 체크를 해야함
	 * // 가입자망 링의 다중 선번작업으로 인해 저장여부 확인 메세지 분기처리함
	 * // 1. 가입자망링 신규선번생성버튼 클릭 
	 * if (btnLineInsertClickYn == true) {
		savePath();
	} 
	// 2. 가입자망링 선번 선택커튼을 통한 클릭
	else if (selNtwkLnoGrpSrnoChg == true) {
		savePath();
	} else {
	
	*/
		callMsgBox('','C', '저장하시겠습니까?', function(msgId, msgRst) {
			if (msgRst == 'Y') {
				if (isRuCoreLine() == true /*|| isRuMatchLine() == true*/) {
					
					var mainPathData = teamsPathWk.toTangoPath().toData(); 
					var subPathData = null;
					if (isRuCoreLine() == true && teamsPathSpr != null) {
						subPathData = teamsPathSpr.toTangoPath().toData(); 
					}
					/* 사용서비스회선 정보체크 common.js*/
					var checkParam = {	"editSvlnNo" : baseInfData.svlnNo
					                  , "mainPathData" : (mainPathData != null ? mainPathData.LINKS : "")
					                  , "subPathData" : (subPathData != null ? subPathData.LINKS : "")		
					                  };
					
					checkUseServiceLine(checkParam);
				}
				// 2019-09-30  5. 기간망 링 선번 고도화
				else if (isMeshRing(nullToEmpty(initParam.topoSclCd)) == true || isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == true) {
					
					var mainPathData = teamsPathWk.toTangoPath().toData(); 
					var subPathData = null;
					if (teamsPathSpr != null) {
						subPathData = teamsPathSpr.toTangoPath().toData(); 
					}
					/* 사용링 정보체크 common.js*/
					var checkParam = {	"editRingId" : initParam.ntwkLineNo
					                  , "mainPathData" : (mainPathData != null ? mainPathData.LINKS : "")
					                  , "subPathData" : (subPathData != null ? subPathData.LINKS : "")		
					                  , "editPathType" : "NP"   // OP : old_path,  NP : Visualization Edit (new path)
					                  , "lnoGrpSrno" : (isSubScriRing() == true ? (selNtwkLnoGrpSrnoChg == true ? prevNtwkLnoGrpSrno : $('#ntwkLnoGrpSrno').val()) : "")
					                  };					
					
					//사용 링으로 사용링 사용가능여부 체크로직
					checkUseRingNtwk(checkParam);
				}
				else {
					savePath();
				}
			}
		});
	/*}*/
}

// 주예비상관 체크
function checkWkSprYn() {
	if (wkSprYn) {
		if($("#wkSprDiv").getCurrentTabIndex() == 0) {
			teamsPathWk = teamsPath;	
		} else if ($("#wkSprDiv").getCurrentTabIndex() == 1) {
			teamsPathSpr = teamsPath;	
		}
		
		if (teamsPathWk == null) {
			if($("#wkSprDiv").getCurrentTabIndex() == 0) {
				teamsPathWk = teamsPath;				
			}
		}
		if (teamsPathSpr == null) {
			if($("#wkSprDiv").getCurrentTabIndex() == 1) {
				teamsPathSpr = teamsPath;				
			}
		}
		
		if ((teamsPathWk == null && teamsPathSpr != null && teamsPathSpr.NODES.length > 0)
			|| (teamsPathWk!= null && teamsPathWk.NODES.length < 1 && teamsPathSpr != null && teamsPathSpr.NODES.length > 0)
			) {
			alertBox('W', cflineMsgArray['spareLineNoChange']);	/* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
			return false;
		}
		if(teamsPathWk == null) {
			teamsPathWk = teamsPath;
		}
		
		
	}
	return true;
}

/*
 * 저장하기
 * */
function savePath() {
		
	var tangoPath = null;
	if( wkSprYn && teamsPathWk != null) {
		
		tangoPath = teamsPathWk.toTangoPath();
		
		// 예비선번에 데이터 셋팅
		teamsPathSpr.NETWORK_ID = teamsPathWk.NETWORK_ID;
		teamsPathSpr.NETWORK_STATUS_CD = teamsPathWk.NETWORK_STATUS_CD;
		teamsPathSpr.NETWORK_TYPE_CD = teamsPathWk.NETWORK_TYPE_CD
		teamsPathSpr.TOPOLOGY_LARGE_CD = teamsPathWk.TOPOLOGY_LARGE_CD;
		teamsPathSpr.TOPOLOGY_SMALL_CD = teamsPathWk.TOPOLOGY_SMALL_CD;
		teamsPathSpr.TOPOLOGY_CFG_MEANS_CD = teamsPathWk.TOPOLOGY_CFG_MEANS_CD;
	} else {
		var infData = null;
		if( isRing() ) {
			infData = baseInfData[0];
		} else {
			infData = baseInfData;
		}
		
		if(isServiceLine()) {
			teamsPath.NETWORK_ID = infData.svlnNo;
			teamsPath.LINE_STATUS_CD = infData.svlnStatCd;
			teamsPath.LINE_LARGE_CD = infData.svlnLclCd;
			teamsPath.LINE_SMALL_CD = infData.svlnSclCd;
		} else {
			teamsPath.NETWORK_ID = infData.ntwkLineNo;
			teamsPath.NETWORK_STATUS_CD = infData.ntwkStatCd;
			teamsPath.NETWORK_TYPE_CD = infData.ntwkTypCd;
			teamsPath.TOPOLOGY_LARGE_CD = infData.topoLclCd;
			teamsPath.TOPOLOGY_SMALL_CD = infData.topoSclCd;
			teamsPath.TOPOLOGY_CFG_MEANS_CD = infData.topoCfgMeansCd;
		}
		
		tangoPath = teamsPath.toTangoPath();
		
	}
	
	var tangoPathData = tangoPath.toData(); 
	var linePathYn = isServiceLine() ? "Y" : "N";
	
	var saveParams = {
			"ntwkLineNo" : initParam.ntwkLineNo,
			"wkSprDivCd" : "01",
			"autoClctYn" : "N",
			"linePathYn" : linePathYn,
			"userId" : $("#userId").val(),
			"utrdMgmtNo" : utrdMgmtNo,
			"links" : JSON.stringify(tangoPathData.LINKS)
	};
	
	var ntwkLnoGrpSrno = initParam.ntwkLnoGrpSrno;
	
	if(btnLineInsertClickYn) {
		// 가입자망링. 선번생성 버튼을 통해서 저장을 할 경우
		$.extend( saveParams,{"ntwkLnoGrpSrno": $("#ntwkLnoGrpSrno").val()} );
	} else if(selNtwkLnoGrpSrnoChg) {
		// 가입자망링. select change를 통해서 저장을 할 경우
		$.extend( saveParams,{"ntwkLnoGrpSrno": prevNtwkLnoGrpSrno} );
	} else {
		if(nullToEmpty(ntwkLnoGrpSrno) == "") {
			if (isSubScriRing() == true) {
				$.extend( saveParams,{"ntwkLnoGrpSrno": $("#ntwkLnoGrpSrno").val()} );
			} else if(pathSameNo != "") {
				$.extend(saveParams,{"ntwkLnoGrpSrno": pathSameNo});
			} else {
				$.extend(saveParams,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
			}
		} else {
			// 가입자망 링이고 저장버튼을 클릭한 경우 현재의 선번그룹을 저장
			if (isSubScriRing() == true) {
				$.extend( saveParams,{"ntwkLnoGrpSrno": $("#ntwkLnoGrpSrno").val()} );
			} else {
				$.extend(saveParams,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
			}
		}
	}
	
	// SKB 가입자망링의 FDF사용정보를 전송하기 위해 선번그룹번호를 보관함
	// 선번편집시 예비선번이 존재하는 타 망링의 경우 그룹 1만 전달되어 예비선번 FDF정보가 GIS로 넘어가지 않는 현상이 있어 개선  - 2024-10-30
	if(initParam.mgmtGrpCd == '0002' && initParam.topoSclCd == '031') {
		
		fdfSendLnoGrpSrno = saveParams.ntwkLnoGrpSrno;
	}
	
	cflineShowProgressBody();
	
	if(isServiceLine()) {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', saveParams, 'POST', 'saveLinePath');
	} else {
		if( btnLineInsertClickYn ) {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', saveParams, 'POST', 'saveNetworkPathLineInsertAfter');
		} else if( selNtwkLnoGrpSrnoChg ) {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', saveParams, 'POST', 'saveNetworkPathSelectChangeAfter');
		} else {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', saveParams, 'POST', 'saveNetworkPath');
		}
	}
}

/**
 * 다이어그램 사용네트워크 클릭 이벤트
 */
function setDiagramClickEvent() {
	visualLinePath.addDiagramListener("ObjectDoubleClicked", 
			function(e) {
				var part = e.subject.part;
				
				if(part.data.category != undefined) {
					if(part.data.category == "SERVICE") {
						// 트렁크
						cflineShowProgressBody();
						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO}; // , "modifyYn" : false
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', paramData, 'GET', 'serviceSearch');
					} else if(part.data.category == "TRUNK") {
						// 트렁크
						cflineShowProgressBody();
						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO}; // , "modifyYn" : false
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramData, 'GET', 'trunkSearch');
					} else if(part.data.category == "RING") {
						// RING
						cflineShowProgressBody();
						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO}; // , "modifyYn" : false
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramData, 'GET', 'ringSearch');
					} else if(part.data.category == "WDM_TRUNK") {
						// WDM트렁크
						cflineShowProgressBody();
						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO};	// , "modifyYn" : false
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramData, 'GET', 'wdmTrunkSearch');
					}
				}
			}
	);
}


/**
 * 선택선번 사용네트워크 클릭 이벤트
 */
function setSelectedDiagramClickEvent() {
	selectedLinePathDiv.addDiagramListener("ObjectDoubleClicked", 
			function(e) {
				var part = e.subject.part;
				
				if(part.data.category != undefined) {
					if(part.data.category == "TRUNK" || part.data.category == "WDM_TRUNK") {
						// 트렁크, WDM트렁크 선번 팝업
						openNetworkPathListPop(part.data);
					} else if(part.data.category == "RING") {
						// RING ADD, DROP 팝업 
//						cflineShowProgressBody();
//						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO};	// , "modifyYn" : false
//						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramData, 'GET', 'ringSearch');
						openRingPath(part.data);
					}
				}
			}
	);
}


/************************************************************************************************
 * 팝업 
 ***********************************************************************************************/
/**
 * 2018-09-12  5. RU고도화
 * 서비스회선 검색 팝업
 */
function openServiceListPop() {
	
	if (isRuCoreLine() == false && isRuMatchLine() == false) {
		alertBox('W', "광코어/중계기정합장치 회선만 서비스회선을 참조 사용가능합니다.");
		return;
	}
	
	var popParam = {"vTmofInfo" : vTmofInfo, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val()), "serviceId" : "", "editSvlnNo" : initParam.ntwkLineNo};

	if (isServiceLine() == true) {
		$.extend(popParam,{"svlnLclCd": initParam.svlnLclCd});
		$.extend(popParam,{"svlnSclCd": initParam.svlnSclCd});
	}
	
	$a.popup({
		popid: 'UseServiceLineSearchPop',
	  	url: getUrlPath()+'/configmgmt/cfline/UseServiceLineSearchPop.do',
	    data: popParam,
	    windowpopup : true,
	    width : 1300,
	    height : 760,
	    callback:function(data){
	    	if(data != null) {
	    		
	    		if (isRuCoreLine() == false && isRuMatchLine() == false) {
	    			alertBox('W', "광코어/중계기정합장치 회선만 서비스회선을 참조 사용가능합니다.");
	    			return;
	    		}
	    		
	    		var dupCnt = 0;
	    		for(var idx = 0; idx < data.length; idx++) {
	    			var dupCheck = duplicationCheck(nullToEmpty(data[idx].SERVICE_ID));
	    			// 선택 선번 중복 제거
	    			if(dupCheck) {
//	    				console.log("중복 : " + data[idx].ntwkLineNo + " / " + data[idx].ntwkLineNm);
	    				dupCnt++;
	    			} else {
	    				
	    				if (nullToEmpty(data[idx].SERVICE_ID) == "" || nullToEmpty(data[idx].SERVICE_LINE_LARGE_CD) == "" || nullToEmpty(data[idx].SERVICE_LINE_SMALL_CD) == "") {
	    					alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
	    					break;
	    				}
	    				cflineShowProgressBody();
	    				/*var param = {"ntwkLineNo" : data[idx].ntwkLineNo, "ntwkLnoGrpSrno" : ""};
	    				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', param, 'GET', 'selectedServicePath');*/
	    					    				
	    				var tmpParam = {"ntwkLineNo" : data[idx].SERVICE_ID, "utrdMgmtNo" : "", "exceptFdfNe" : "N", "svlnLclCd" : data[idx].SERVICE_LINE_LARGE_CD, "svlnSclCd" : data[idx].SERVICE_LINE_SMALL_CD, "reqPathJrdtMtsoList":"Y"};
	    				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', tmpParam, 'GET', 'selectedServicePath');
	    				break;
	    			}
	    		}
	    		
	    		//if(dupCnt == data.length) cflineHideProgressBody();
	    		if(dupCnt > 0) cflineHideProgressBody();
	    	}
//	    	cflineHideProgressBody();
	    }
	});
}

/**
 * 트렁크 검색 팝업
 */
function openTrunkListPop() {
	var searchTopoLclCd = '002';
	var searchTopoSclCd = '';
	var isLink = false;
	var param = {"vTmofInfo" : vTmofInfo, "topoLclCd" : searchTopoLclCd, "topoSclCd" : searchTopoSclCd, "isLink" : isLink, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val()), "multiSelect" : true, "idleSearchYn" : "Y"};
	$a.popup({
		popid: 'TrunkListPopVisual',
	  	url: getUrlPath()+'/configmgmt/cfline/TrunkListPop.do',
	    data: param,
	    windowpopup : true,
	    width : 1200,
	    height : 760,
	    callback:function(data){
	    	if(data != null) {
	    		var dupCnt = 0;
	    		for(var idx = 0; idx < data.length; idx++) {
	    			var dupCheck = duplicationCheck(data[idx].ntwkLineNo);
	    			// 선택 선번 중복 제거
	    			if(dupCheck) {
//	    				console.log("중복 : " + data[idx].ntwkLineNo + " / " + data[idx].ntwkLineNm);
	    				dupCnt++;
	    			} else {
	    				cflineShowProgressBody();
	    				var param = {"ntwkLineNo" : data[idx].ntwkLineNo, "ntwkLnoGrpSrno" : ""};
	    				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', param, 'GET', 'selectedTrunkPath');
	    			}
	    		}
	    		trunkIdle = data;
	    		
	    		if(dupCnt == data.length) cflineHideProgressBody();
	    	}
//	    	cflineHideProgressBody();
	    }
	});
}


/**
 * WDM트렁크 검색 팝업
 */
function openWdmTrunkListPop() {
	var searchTopoLclCd = '003';
	var searchTopoSclCd = '101';
	var isLink = false;
	
	if(!isServiceLine()) {
		isLink = (topoLclCd == '003' && topoSclCd == '101') ? true : false;
	} else {
		isLink = false;
	}
	
	var param = {"vTmofInfo" : vTmofInfo, "topoLclCd" : searchTopoLclCd, "topoSclCd" : searchTopoSclCd, "isLink" : isLink, "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val()), "multiSelect" : true};
	$a.popup({
		popid: 'WdmTrunkListPopVisual',
	  	url: getUrlPath()+'/configmgmt/cfline/TrunkListPop.do',
	    data: param,
//	    modal: true,
//		movable:true,
	    windowpopup : true,
	    width : 1200,
	    height : 760,
	    callback:function(data){
	    	if(data != null) {
	    		cflineShowProgressBody();
	    		var dupCnt = 0;
	    		for(var idx = 0; idx < data.length; idx++) {
	    			var dupCheck = duplicationCheck(data[idx].ntwkLineNo);
	    			// 선택 선번 중복 제거
	    			if(dupCheck) {
	    				console.log("중복 : " + data[idx].ntwkLineNo + " / " + data[idx].ntwkLineNm);
	    				dupCnt++;
	    			} else {
	    				var param = {"ntwkLineNo" : data[idx].ntwkLineNo, "ntwkLnoGrpSrno" : ""};
	    				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', param, 'GET', 'selectedWdmTrunkPath');
	    			}
	    		}
	    		
	    		if(dupCnt == data.length) cflineHideProgressBody();
	    	}
	    }
	});
}

/**
 * 링 검색 팝업
 */
function openRingListPop() {	
	
	// ntwkLineNm 항목이 없을 경우 검색 조건 표출
	var param = {"vTmofInfo" : vTmofInfo, "ntwkLineNm" : "", "topoLclCd" : "001", "topoSclCd" : '', "mgmtGrpCd" : nullToEmpty($('#mgmtGrpCd').val())};
	
	if(isServiceLine()) {
		$.extend(param,{"svlnLclCd": svlnLclCd});
		$.extend(param,{"svlnSclCd": svlnSclCd});
	}
	
 
	$a.popup({
	  	popid: 'RingListPop',
	  	title: '링리스트조회팝업',
	    url: getUrlPath() +'/configmgmt/cfline/RingListPop.do',
	    data: param,
	    iframe: true,
//	    modal : true,
//	    movable : true,
	    windowpopup : true,
	    width : 1200,
	    height : 700,
	    callback:function(data){
	    	if(data != null) {
	    		cflineShowProgressBody();	
	    		openRingPath(data);
	    	}
	    }
	});
}

/**
 * 2019-09-30  9. 기간망 링 선번 고도화
 * 경유용 링 검색 팝업
 */
function openUseRingRontTrunkSearchPopNew() {
	
	if (isMeshRing(nullToEmpty(initParam.topoSclCd)) == false && isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == false) {
		alertBox('W', "MESH링 혹은 Ring, IBS, IBRR, IVS, IVRR, MSPP, Free, PTS링, L3_Switch링, T2IP링, SMUX링만 링을 참조 사용가능합니다.");
		return;
	}
	
	var editRingId = initParam.ntwkLineNo ;
	var editRingTopoSclCd = (isServiceLine() == true ? "" : initParam.topoSclCd) ;
	var editRingMgmtCd = (isRing() == true ?  initParam.mgmtGrpCd :  '') ; 
	var useRingRontTrunkParam = {  "vTmofInfo" : vTmofInfo,  "editRingId" : editRingId, "editRingTopoSclCd" : editRingTopoSclCd, "editRingMgmtCd" : editRingMgmtCd
			                     , "editViewVisualYn" : "Y", "editYn" : "Y", "useRingId" : "", "useRingPathDirection" : ""
		                         , "useRingTopoLclCd" : "", "useRingTopoSclCd" : ""
						        };
    
	$a.popup({
		popid: 'UseRingRontTrunkSearchPop',
	  	url: getUrlPath()+'/configmgmt/cfline/UseRingRontTrunkSearchPop.do',
	    data: useRingRontTrunkParam,
	    windowpopup : true,
	    width : 1300,
	    height : 780,
	    callback:function(teamsRingPath){
	    	if(teamsRingPath != null) {
	    		
	    		if (isMeshRing(nullToEmpty(initParam.topoSclCd)) == false && isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == false) {
	    			alertBox('W', "MESH링 혹은 Ring, IBS, IBRR, IVS, IVRR, Free, PTS링, L3_Switch링, T2IP링, SMUX링, 가입자망링만 링을 참조 사용가능합니다.");
	    			return true;
	    		}
	    		
	    		var dupCnt = 0;
	    		var bfRingId = "";
	    		var dupMsg = "";
	    		
	    		var addRingYn = false;
	    		for(var idx = 0; idx < teamsRingPath.length; idx++) {
	    			
	    			if (nullToEmpty(teamsRingPath[idx].NETWORK_ID) == "" || bfRingId == nullToEmpty(teamsRingPath[idx].NETWORK_ID)) {
	    				continue;
	    			}
	    			var dupCheck = duplicationCheck(nullToEmpty(teamsRingPath[idx].NETWORK_ID));
	    			// 선택 선번 중복 제거
	    			if(dupCheck) {
//	    				console.log("중복 : " + data[idx].ntwkLineNo + " / " + data[idx].ntwkLineNm);
	    				dupCnt++;
	    				dupMsg += (dupMsg != "" ? ",<br>" : "") + teamsRingPath[idx].NETWORK_NM + "(" + teamsRingPath[idx].NETWORK_ID + ")";
	    			} else {
	    				
	    				
	    				// ADD, DROP EDIT
						if(TeamsNode.prototype.isPrototypeOf(teamsRingPath[idx])) {
							// 기존 링 데이터 삭제
							delete selectedOriginalPath[teamsRingPath[idx].NETWORK_ID];
							
							for ( var idx = selectedPathNodeDataArray.length - 1; idx >= 0; idx-- ) {
								if( (selectedPathNodeDataArray[idx].key == teamsRingPath[idx].key) 
										|| (selectedPathNodeDataArray[idx].group == teamsRingPath[idx].key) ) {
									selectedPathNodeDataArray.splice( idx, 1 );
								}
							}
						}
						
						/* 링의 경우 선택선번에 연속적으로 2개이상을 선택하면 해당 링의 NODE의 __gohashid 값이 동일 하게 추가되는 버그가 있음
						 * (=> 링의 ADD-DROP 영역에서 생성해서 추가하기 때문인듯)
						 * 이로 인해 해당 링을 모두 선번에 추가하는 경우 NODE의 __gohashid 값이 동일하여 각자의 그룹으로 묶이지 않는 버그가 있음
						 * 추가하는 경우 강제로 각 값을 수정하는 작업이 필요함. 혹시 몰라 링만 처리해봄
						 */ 
						for (var i = 0; i < teamsRingPath[idx].NODES.length; i++) {
							var tmpRingNode = teamsRingPath[idx].NODES[i];
					    	if(tmpRingNode.__gohashid != undefined) {
					    		delete teamsRingPath[idx].NODES[i].__gohashid;
					    	}
						}
																
						Object.setPrototypeOf(teamsRingPath[idx], TeamsPath.prototype);
						teamsRingPath[idx].resetPrototype();
						
						generateSelectedPath(teamsRingPath[idx], "RING", guid());
	    				
	    				bfRingId = nullToEmpty(teamsRingPath[idx].NETWORK_ID);
	    				//break;
	    				addRingYn= true;
	    			}
	    		}
	    		
	    		if (addRingYn == true) {
	    			
	    			selectedLinePathDiv.commandHandler.increaseZoom(1.25);
	    			selectedLinePathDiv.commandHandler.decreaseZoom(0.8);
	    		}
	    		
	    		// 중복건
	    		if(dupCnt > 0) {
	    			dupMsg += ",<br> 의 링은 중복되어 추가하지 않았습니다.";
	    			alertBox('W', dupMsg);
	    		}
	    	}
	    	// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
//	    	cflineHideProgressBody();
	    }
	});
	
	
}

/**
 * TODO
 * 2021-05-10  기간망링 선번 고도화
 * 전송망 경유용 링 검색 팝업
 */
function openUseBtbEqpRingPopNode() {

	var uperMtsoOrg = "";
	var lowerMtsoOrg = "";
	for (var i = 0; i < nodeDataArray.length; i++ ) {
		
		if((nodeDataArray[i].NE_ROLE_CD == "11" || nodeDataArray[i].NE_ROLE_CD == "162" || nodeDataArray[i].NE_ROLE_CD == "177" || nodeDataArray[i].NE_ROLE_CD == "178" || nodeDataArray[i].NE_ROLE_CD == "182")
			) {

			var neData = nodeDataArray[i].Ne;
			if (uperMtsoOrg == "" && nullToEmpty(neData.ORG_ID) != "") {
				uperMtsoOrg = nullToEmpty(neData.ORG_ID);
			}
			if (nullToEmpty(neData.ORG_ID) != "") {
				lowerMtsoOrg = nullToEmpty(neData.ORG_ID);
			}
		}
	}
	
	var orgId = "";
	orgId = uperMtsoOrg;
	orgId = orgId + ',' + lowerMtsoOrg;
	
	var editRingId = initParam.ntwkLineNo ;
	var editRingTopoSclCd = (isServiceLine() == true ? "" : initParam.topoSclCd) ;
	var editRingMgmtCd = (isRing() == true ?  initParam.mgmtGrpCd :  '') ; 
	var useBtbEqpRingParam = {  "vTmofInfo" : vTmofInfo,  "editRingId" : editRingId, "editRingTopoSclCd" : editRingTopoSclCd, "editRingMgmtCd" : editRingMgmtCd
			                     , "editViewVisualYn" : "Y", "editYn" : "Y", "useRingId" : "", "useRingPathDirection" : ""
		                         , "useRingTopoLclCd" : "", "useRingTopoSclCd" : "", "orgId":orgId
		                       };

	$a.popup({
		popid: 'UseBtbEqpRingSearchPop',
	  	url: getUrlPath()+'/configmgmt/cfline/UseBtbEqpRingSearchPop.do',
	  	data: useBtbEqpRingParam,
	    windowpopup : true,
	    width : 1300,
	    height : 780,
	    callback:function(teamsRingPath){
	    	if(teamsRingPath != null) {
	    		
	    		var dupCnt = 0;
	    		var bfRingId = "";
	    		var dupMsg = "";
	    		
	    		var addRingYn = false;
	    		for(var idx = 0; idx < teamsRingPath.length; idx++) {
	    			
	    			if (nullToEmpty(teamsRingPath[idx].NETWORK_ID) == "" || bfRingId == nullToEmpty(teamsRingPath[idx].NETWORK_ID)) {
	    				continue;
	    			}
	    			var dupCheck = duplicationCheck(nullToEmpty(teamsRingPath[idx].NETWORK_ID));
	    			// 선택 선번 중복 제거
	    			if(dupCheck) {
//	    				console.log("중복 : " + data[idx].ntwkLineNo + " / " + data[idx].ntwkLineNm);
	    				dupCnt++;
	    				dupMsg += (dupMsg != "" ? ",<br>" : "") + teamsRingPath[idx].NETWORK_NM + "(" + teamsRingPath[idx].NETWORK_ID + ")";
	    			} else {
	    				
	    				
	    				// ADD, DROP EDIT
						if(TeamsNode.prototype.isPrototypeOf(teamsRingPath[idx])) {
							// 기존 링 데이터 삭제
							delete selectedOriginalPath[teamsRingPath[idx].NETWORK_ID];
							
							for ( var idx = selectedPathNodeDataArray.length - 1; idx >= 0; idx-- ) {
								if( (selectedPathNodeDataArray[idx].key == teamsRingPath[idx].key) 
										|| (selectedPathNodeDataArray[idx].group == teamsRingPath[idx].key) ) {
									selectedPathNodeDataArray.splice( idx, 1 );
								}
							}
						}
						
						/* 링의 경우 선택선번에 연속적으로 2개이상을 선택하면 해당 링의 NODE의 __gohashid 값이 동일 하게 추가되는 버그가 있음
						 * (=> 링의 ADD-DROP 영역에서 생성해서 추가하기 때문인듯)
						 * 이로 인해 해당 링을 모두 선번에 추가하는 경우 NODE의 __gohashid 값이 동일하여 각자의 그룹으로 묶이지 않는 버그가 있음
						 * 추가하는 경우 강제로 각 값을 수정하는 작업이 필요함. 혹시 몰라 링만 처리해봄
						 */ 
						for (var i = 0; i < teamsRingPath[idx].NODES.length; i++) {
							var tmpRingNode = teamsRingPath[idx].NODES[i];
					    	if(tmpRingNode.__gohashid != undefined) {
					    		delete teamsRingPath[idx].NODES[i].__gohashid;
					    	}
						}
																
						Object.setPrototypeOf(teamsRingPath[idx], TeamsPath.prototype);
						teamsRingPath[idx].resetPrototype();
						
						generateSelectedPath(teamsRingPath[idx], "RING", guid());
	    				
	    				bfRingId = nullToEmpty(teamsRingPath[idx].NETWORK_ID);
	    				//break;
	    				addRingYn= true;
	    			}
	    		}
	    		
	    		if (addRingYn == true) {
	    			
	    			selectedLinePathDiv.commandHandler.increaseZoom(1.25);
	    			selectedLinePathDiv.commandHandler.decreaseZoom(0.8);
	    		}
	    		
	    		// 중복건
	    		if(dupCnt > 0) {
	    			dupMsg += ",<br> 의 링은 중복되어 추가하지 않았습니다.";
	    			alertBox('W', dupMsg);
	    		}
	    	}
	    	// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
//	    	cflineHideProgressBody();
	    }
	});
}

/**
 * 장비 검색 팝업
 */
function openNeListPop() {
	var param = {"vTmofInfo" : vTmofInfo, "neNm" : "", "fdfAddVisible" : true, "partnerNeId" : null, "multiSelect" : true, "wdmYn" : wdmYn};
	
	// SKB ADAMS 연동 고도화
	$.extend(param,{"mgmtGrpCd" : $("#mgmtGrpCd").val()}); // 관리그룹
	$.extend(param,{"mgmtOnrNm" : mgmtOnrNm}); // 관리주체
	
	if( typeof svlnLclCd != "undefined") {
		$.extend(param,{"svlnLclCd" : svlnLclCd}); //회선 대분류 코드
	}
	if( typeof topoSclCd != "undefined") {
		$.extend(param,{"topoSclCd" : topoSclCd}); //토플로지 소분류 코드
	}
	
	$a.popup({
	  	popid: "neListPopVisual",
	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
	  	url: getUrlPath() + '/configmgmt/cfline/EqpInfPop.do',
	  	data: param,
		modal: true,
		movable:true,
		width : 1200,
		height : 810,
		callback:function(data){
			if(data != null){
				if(data.length == undefined) {
					generateSelectedNeNodes(data);
				} else {
					for(var idx = 0; idx < data.length; idx++) {
						var dupCheck = duplicationCheck(data[idx].neId);
						// 선택 선번 중복 제거
						if(dupCheck) {
							console.log("중복 : " + data[idx].neId + " / " + data[idx].neNm);
							dupCnt++;
						} else {
							generateSelectedNeNodes(data[idx]);
						}
					}
				}
			}
		}
	});
}


/**
 * 링선번 팝업
 */
function openRingPath(data) {
	cflineShowProgressBody();
	
	var params = null;
	if(TeamsNode.prototype.isPrototypeOf(data)) {
		// 선택 선번 더블클릭으로 ADD, DROP지정
		params = {"ntwkLineNo" : data.NETWORK_ID, "ntwkLnoGrpSrno" : data.PATH_SAME_NO, editYn : "Y"
					,  "useRingPath" : selectedOriginalPath[data.NETWORK_ID]};
	} else if(data.editYn == "N") {
		// 구성도 탭에서 팝업창 오픈
		params = {"ntwkLineNo" : data.ntwkLineNo, "ntwkLnoGrpSrno" : data.ntwkLnoGrpSrno, editYn : "N" };
	} else {
		// 링을 선택 후 ADD, DROP 팝업창 오픈
		params = {"ntwkLineNo" : data.ntwkLineNo, "ntwkLnoGrpSrno" : data.ntwkLnoGrpSrno, editYn : "Y" }; // "useNetworkPathDirection" : useNetworkPathDirection
	}
	
	$a.popup({
    	popid: "selectAddDropTeamsPath",
		title: "링 ADD DROP",
		url: getUrlPath() +'/configmgmt/cfline/RingAddDropPopTeamsPath.do',
		data: params,
		iframe: true,
		modal: true,
		movable:true,
		windowpopup : true,
		width : 1200,
		height : 850,
		callback:function(ringData){
			cflineHideProgressBody();

			if(ringData != null) {
				if(ringData.prev == 'Y') {
//					cflineShowProgressBody();
					openRingListPop();
				} else {
					// ADD, DROP EDIT
					if(TeamsNode.prototype.isPrototypeOf(data)) {
						// 기존 링 데이터 삭제
						delete selectedOriginalPath[data.NETWORK_ID];
						
						for ( var idx = selectedPathNodeDataArray.length - 1; idx >= 0; idx-- ) {
							if( (selectedPathNodeDataArray[idx].key == data.key) 
									|| (selectedPathNodeDataArray[idx].group == data.key) ) {
								selectedPathNodeDataArray.splice( idx, 1 );
							}
						}
						
					}
					
					/* 링의 경우 선택선번에 연속적으로 2개이상을 선택하면 해당 링의 NODE의 __gohashid 값이 동일 하게 추가되는 버그가 있음
					 * (=> 링의 ADD-DROP 영역에서 생성해서 추가하기 때문인듯)
					 * 이로 인해 해당 링을 모두 선번에 추가하는 경우 NODE의 __gohashid 값이 동일하여 각자의 그룹으로 묶이지 않는 버그가 있음
					 * 추가하는 경우 강제로 각 값을 수정하는 작업이 필요함. 혹시 몰라 링만 처리해봄
					 */ 
					for (var i = 0; i < ringData.NODES.length; i++) {
						var tmpRingNode = ringData.NODES[i];
				    	if(tmpRingNode.__gohashid != undefined) {
				    		delete ringData.NODES[i].__gohashid;
				    	}
					}
															
					Object.setPrototypeOf(ringData, TeamsPath.prototype);
					ringData.resetPrototype();
					
					generateSelectedPath(ringData, "RING", guid());
				}
			}
		}
	});
}

/* 트렁크, WDM 트렁크 선번 조회 */
function openNetworkPathListPop(data) {
	var param = {"ntwkLineNo" : data.NETWORK_ID, "ntwkLnoGrpSrno" : data.PATH_SAME_NO, "searchDivision" : data.category.toLowerCase(), "editYn" : true
			, "btnPrevRemove" : true, "useNetworkPathDirection" : selectedOriginalPath[data.PATH_DIRECTION], "pathSameNo" : null };
	
	$a.popup({
	  	url: getUrlPath() + '/configmgmt/cfline/NetworkPathListPop.do',
	  	data: param,
	    windowpopup : true,
	    width : 1100,
	    height : 700,
	    callback:function(directionData){
	    	cflineHideProgressBody();
	    	selectedOriginalPath[data.PATH_DIRECTION] = directionData[0].USE_NETWORK_PATH_DIRECTION;
	    }
	});
}

/**
 * 선로링, 장비링 팝업
 * @param btnId
 */
function openLnRingEqpRingPop(btnId) {
	var title = "";
	var ringMgmtDivCd = "";
	if(btnId == 'btnLnRing') {
		// 선로링
		ringMgmtDivCd = "2";
		title = cflineMsgArray['lnRing'];
	} else {
		// 장비링
		ringMgmtDivCd = "3";
		title = cflineMsgArray['equipmentRing'];
	}
	var paramData = {"ntwkLineNo" : initParam.ntwkLineNo, "ringMgmtDivCd" : ringMgmtDivCd, "title" : title, "mgmtGrpCd" : $("#mgmtGrpCd").val()};
	
	$a.popup({
	  	popid: "ringMgmtDivPathListPop" + title,
	  	title: title,
	  	url: getUrlPath() +'/configmgmt/cfline/RingMgmtDivPathListPop.do',
	  	data: paramData,
	  	iframe:true,
		modal: false,
		movable:true,
		windowpopup : true,
		width : 1100,
	    height : 630,
		callback:function(data){
			if(data != null && data.length > 0){
			}
		}
	}); 
}

function openFdfListPop() {

	$a.popup({
		popid: "EqpNodeInfPop",
		title: "장비/선로정보" /*수집회선 비교*/,
		url: 'EqpNodeInfPop.do',
		data: {"svlnNo":searchParam.ntwkLineNo},
		iframe: true,
		modal : true,
		movable:false,
		windowpopup : true,
		width : 860,
		height : 400
		,callback:function(data){
			if(data != null){
				if (data.length > 0) {
					var addData = {};
					var eteSussYn = "N";
					var fdfCnt = 0;
					var rowIndex = 0;
					
					if (nullToEmpty(originalPath) == "") {
						
						var infData = baseInfData;
						var tmpData = {
								 "LINE_LARGE_CD" : infData.svlnLclCd
						 		, "LINE_LARGE_NM" : infData.svlnLclCdNm
						 		, "LINE_SMALL_CD" : infData.svlnSclCd
						 		, "LINE_SMALL_NM" : infData.svlnSclCdNm
						 		, "LINE_STATUS_CD" : infData.svlnStatCd
						 		, "LINE_STATUS_NM" : infData.svlnStatCdNm
						 		, "NETWORK_ID" : infData.svlnNo
						 		, "NETWORK_NM" : infData.lineNm
						 		, "PATH_DIRECTION" : null
						 		, "PATH_SAME_NO" : null
						 		, "PATH_SEQ" : null
						 		, "USE_NETWORK_PATHS" : []
						 		, "USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH" : false
						 		, "LINKS" : []
						} 
						originalPath = tmpData;
					} 
								
					teamsPathData = null;
					teamsShortPathData = null;
					teamsPath = new TeamsPath();
					

					for(var i = 0; i < data.length; i++) {

						eteSussYn = data[i].eteSussYn;
						if(eteSussYn == "Y") {
							//ETE가 성공된 경우 ETE연결을 시켜줘야 함. 하위국 기준으로만 장비 셋팅후 ETE연결
							//그냥하면 중복으로 장비가 셋팅됨
							if(data[i].eqpStatus == "LOW") {
								addData = addEqpFdfData(data[i], "R");
								originalPath.LINKS.push(addData);

								addData = addEqpFdfData(data[i], "L"); 
								originalPath.LINKS.push(addData);
								eteSussYn = data[i].eteSussYn;
							}
						} else {
							addData = addEqpFdfData(data[i], "R");
							originalPath.LINKS.push(addData);

							addData = addEqpFdfData(data[i], "L"); 
							originalPath.LINKS.push(addData);
							eteSussYn = data[i].eteSussYn;
						}
					}
											
					teamsPath.fromTangoPath(originalPath);
					teamsPathData = teamsPath.toData();		// 그리드
					
					teamsPathGrid();
					tangoPathGrid();
					
					reGenerationDiagram(true);
					modifyMainPath = true;
					
					var finPathIndex = teamsPathData.NODES.length;
					
					if(eteSussYn == "Y") {
						var node = teamsPath.NODES[finPathIndex-1];
						e2eApplyAuto(node);
					}
				}
			}
		}
	});
}

/*
 * 상위OLT장비정보 설정
 */
function openOltEqpListPop(data) {

	$a.popup({
		popid: "OltEqpInfPop",
		title: "상위OLT장비정보",
		url: 'OltEqpInfPop.do',
		data: {"data":data},
		iframe: true,
		modal : true,
		movable:false,
		windowpopup : true,
		width : 700,
		height : 500
		,callback:function(data){
			cflineHideProgressBody();
			if(data != null){
				var oltEqpLink = null;
				var addData = {};
				//originalPath
				if (nullToEmpty(originalPath) == "") {
					
					var infData = baseInfData;
					var tmpData = {
							 "LINE_LARGE_CD" : infData.svlnLclCd
					 		, "LINE_LARGE_NM" : infData.svlnLclCdNm
					 		, "LINE_SMALL_CD" : infData.svlnSclCd
					 		, "LINE_SMALL_NM" : infData.svlnSclCdNm
					 		, "LINE_STATUS_CD" : infData.svlnStatCd
					 		, "LINE_STATUS_NM" : infData.svlnStatCdNm
					 		, "NETWORK_ID" : infData.svlnNo
					 		, "NETWORK_NM" : infData.lineNm
					 		, "PATH_DIRECTION" : null
					 		, "PATH_SAME_NO" : null
					 		, "PATH_SEQ" : null
					 		, "USE_NETWORK_PATHS" : []
					 		, "USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH" : false
					 		, "LINKS" : []
					} 
					originalPath = tmpData;
				} 
				
				teamsPathData = null;
				teamsPath = new TeamsPath();
					
				// 기존 링 선번에 OLT장비를 추가함
				for(var i = 0; i < data.length; i++) {
					oltEqpLink = setOltEqpData(data[i], "R");
					originalPath.LINKS.push(oltEqpLink);
				}
				
				teamsPath.fromTangoPath(originalPath);
				teamsPathData = teamsPath.toData();		// 그리드

				// 주선번 데이터 보존
				teamsPathWk = teamsPath;
				teamsPathDataWk = teamsPathData;
				
				teamsPathGrid();
				tangoPathGrid();
				
				reGenerationDiagram(true);
				modifyMainPath = true;
			}
		}
	});
}
/**
 * 인접링포함 구성도
 */
function openRingBlockDiagramPop() {
//	var ntwkLnoGrpSrno = "";
//	if(pathSameNo != "") {
//		ntwkLnoGrpSrno = pathSameNo;
//	} else {
//		ntwkLnoGrpSrno = $('#ntwkLnoGrpSrno').val();
//	}
		
	$a.popup({
   		popid: "selectAddDrop",
		title: cflineMsgArray['ringBlockDiagram'] /*링 구성도*/,
		url: getUrlPath() +'/configmgmt/cfline/RingDiagramPop.do',
		data: {"ntwkLineNo" : initParam.ntwkLineNo, "ntwkLnoGrpSrno" : pathSameNo},
		iframe: true,
		modal: false,
		movable:true,
		windowpopup : true,
		width : 1400,
		height : 900
	});
}

/**
 * 포트 팝업
 */
function nodePortSearch(node) {
	node.doubleClick = function(e, obj) {
//		포트 팝업
		var paramData = null;
		if( isServiceLine() ) {
			paramData = {"node" : obj.part.data, "target" : e.pg.Ob, "svlnLclCd" : initParam.svlnLclCd, "svlnSclCd" : initParam.svlnSclCd, "svlnNo" : initParam.svlnNo};
		} else {
			paramData = {"node" : obj.part.data, "target" : e.pg.Ob, "topoLclCd" : initParam.topoLclCd, "topoSclCd" : initParam.topoSclCd, "ntwkLineNo" : initParam.ntwkLineNo, "topologyType" : topologyType};
		}
		
		$a.popup({
	   		popid: "portSearch",
			title: '포트 검색',
			url: getUrlPath() +'/configmgmt/cfline/NetworkPathVisualizationPortList.do',
			data: paramData,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : 1200,
			height : 720,
			callback:function(data){
				setPortData = new PortDescr();
				reGenerationDiagram(true);
			}
		});
		
	}	
	node.cursor = "pointer";
}

//TODO
function nodeNeClick(node) {
	node.click = function(e, obj) {
        //포트 팝업
		neNode = obj.part.data;
		orgId = neNode.Ne.ORG_ID;
		orgId = orgId + ',' + neNode.Ne.ORG_ID_L3;
	}	
}

//RM선번조회팝업
$('#btnRmLinePathPop').on('click', function(){
	 //alert("RM선번조회팝업");	
	var rnmEqpId = (typeof initParam.rnmEqpId  != "undefined") ? initParam.rnmEqpId : "";
	var rnmEqpIdNm = (typeof initParam.rnmEqpIdNm  != "undefined") ? initParam.rnmEqpIdNm : "";
	var rnmPortId = (typeof initParam.rnmPortId  != "undefined") ? initParam.rnmPortId : "";
	var rnmPortIdNm = (typeof initParam.rnmPortIdNm  != "undefined") ? initParam.rnmPortIdNm : "";
	var rnmPortChnlVal = (typeof initParam.rnmPortChnlVal  != "undefined") ? initParam.rnmPortChnlVal : "";
	var ntwkLineNo = (typeof initParam.ntwkLineNo  != "undefined") ? initParam.ntwkLineNo : "";
	var mgmtGrpCd = (typeof initParam.mgmtGrpCd  != "undefined") ? initParam.mgmtGrpCd : "0001";
	
	var param = {"vTmofInfo":vTmofInfo, "ntwkLineNo" : ntwkLineNo
						, "rnmEqpId" : rnmEqpId, "rnmEqpIdNm" : rnmEqpIdNm, "rnmPortId" : rnmPortId
						, "rnmPortIdNm" : rnmPortIdNm, "rnmPortChnlVal" : rnmPortChnlVal, "mgmtGrpCd" : mgmtGrpCd};  
	
	
//	$.extend(param,{"vTmofInfo":vTmofInfo}); // 전송실 조회 리스트
	var strTitle = "RM 선번 조회";
	$a.popup({
		popid: "PopRmLinePath",
		title: strTitle,
		url: getUrlPath() +'/configmgmt/cfline/RmLinePathPop.do',
		data: param,
		modal: true,
		movable:true,
		windowpopup : true,
		width : 1400,
		height: 910,
	    //height : window.innerHeight * 0.9,
		callback:function(data){
//			alert(JSON.stringify(data));
			//console.log(data);
		}
	 });
 });


//RM선번 추가 
function rmLinePathAdd(rmTeamsPath) {
	try {
		Object.setPrototypeOf(rmTeamsPath, TeamsPath.prototype);
		rmTeamsPath.resetPrototype();
		
		// 초기화 		
		teamsPath.NODES = [];
		console.log(rmTeamsPath);
		teamsPath.NODES = teamsPath.NODES.concat(rmTeamsPath.NODES);
//		teamsPath.insertNode(null, rmTeamsPath);
		
		originalPath = null;
		teamsPathData = teamsPath.toData();		// 그리드
		teamsShortPathData = teamsPath.toShortPath();
		
		// 주선번 데이터 보존
		teamsPathDataWk = teamsPathData;
		teamsShortPathDataWk = teamsShortPathData;	
		
		reGenerationDiagram(true);
	} catch ( err ) {
		console.log(err);
	}
	
}


/**
 * WDM트렁크 선번 복사
 */
function copyPath() {
	$a.popup({
   		popid: "copyPath",
   		title: cflineMsgArray['pathCopy'], 		/* 선번복사 */
		url: '/tango-transmission-web/configmgmt/cfline/NetworkPathCopyPop.do',
		data: null,
		iframe: true,
		modal: true,
		movable:true,
		width : 1200,
		height : 600,
		callback:function(data){
			copyPathAdd(data);
		}
	});
}


/**
 * 선번 복사
 */
function copyPathAdd(data) {
	if(data != null) {
		var basicPath = originalPath;
		basicPath.LINKS = data.mainLinks;
		
		teamsPath = new TeamsPath();
		teamsPath.fromTangoPath(basicPath);
		teamsPathData = teamsPath.toData();
		teamsShortPathData = teamsPath.toShortPath();
		
		// 주선번 데이터 보존
		teamsPathDataWk = teamsPathData;
		teamsShortPathDataWk = teamsShortPathData;
	}
	
	if(data.reserveLinks != undefined){
		var basicPath = wdmTrunkSprOriginal;
		basicPath.LINKS = data.reserveLinks;
		teamsPathSpr = new TeamsPath();
		
		teamsPathSpr.fromTangoPath(basicPath);
		teamsPathDataSpr = teamsPathSpr.toData();
		teamsShortPathDataSpr = teamsPathSpr.toShortPath();
	} else {
		teamsPathSpr = new TeamsPath();
		teamsPathDataSpr = null;
		teamsShortPathDataSpr = null;
	}
	
	reGenerationDiagram(true);
}

/**
 * 서비스 회선 선번 편집
 */
function serviceLineInfoPop() {
	var url = getUrlPath() +'/configmgmt/cfline/ServiceLineInfoPop.do';
	var width = 1400;
	var height = 780;
	
	$a.popup({
		popid: "ServiceLineInfoPop",
		title: "서비스회선상세정보",
		url: url,
		data: initParam,
		iframe: true,
		modal : false,
		movable:true,
		windowpopup : true,
		width : width,
		height : height
		,callback:function(data){
			if(data != null){
				//alert(data);
			}
		}
	});
}

/**
 * 트렁크 선번 편집
 */
function trunkInfoPop() {
	var url = getUrlPath() +'/configmgmt/cfline/TrunkInfoPop.do';
	var width = 1400;
	var height = 780;
	
	$a.popup({
		popid: "TrunkInfoPop",
		title: "트렁크 상세정보",
		url: url,
		data: initParam,
		iframe: true,
		modal : false,
		movable:true,
		windowpopup : true,
		width : width,
		height : height
		,callback:function(data){
			if(data != null){
				//alert(data);
			}
		}
	});
}

/**
 * 링 상세 정보
 */
function ringInfoPop() {
	var url = getUrlPath() +'/configmgmt/cfline/RingInfoPop.do';
	var width = 1400;
	var height = 780;
	
	$a.popup({
		popid: "RingInfoPop",
		title: "링 상세정보",
		url: url,
		data: initParam,
		iframe: true,
		modal : false,
		movable:true,
		windowpopup : true,
		width : width,
		height : height
		,callback:function(data){
			if(data != null){
				//alert(data);
			}
		}
	});
}

/**
 * wdm트렁크 상세 정보
 */
function wdmTrunkInfoPop() {
	//var url = getUrlPath() +'/configmgmt/cfline/WdmTrunkInfoPop.do';
	var url = getUrlPath() +'/configmgmt/cfline/WdmTrunkDetailPop.do';
	var width = 1600;
	var height = 940;
	initParam.sFlag = "Y";
	
	$a.popup({
		popid: "WdmTrunkDetailPop",
		title: "WDM트렁크 상세정보",
		url: url,
		data: initParam,
		iframe: true,
		modal : false,
		movable:true,
		windowpopup : true,
		width : width,
		height : height
		,callback:function(data){
			if(data != null){
				//alert(data);
			}
		}
	});
}

/************************************************************************************************
 * 
 ***********************************************************************************************/
function duplicationCheck(checkId) {
	var dupCheck = false;
	if(Object.keys(selectedOriginalPath).length > 0) {
		if(eval("selectedOriginalPath."+checkId) != undefined) {
			dupCheck = true;
		}
	}
	
	return dupCheck;
}


//FDF사용정보 전송(서비스회선/링편집시만 호출됨)
function sendFdfUseInfo(flag ) {
 
	sendFdfUseInfoCommon(initParam.ntwkLineNo, ((flag == "saveLinePath" || flag == "saveLinePathReserve") ? "S" : "R"), "E", fdfSendLnoGrpSrno);
	
}

/** RU회선_광코어의 경우 사용링이 있는경우
 *   1. SMUX링 선번 자동 검색기능 실행 하지 않기
 *   2. 5G-PON 기존 서비스회선 복제를 실행하지 않기위해
 *   3. 사용링 수 제한하기위해
 * @param 체크할 그리드
 * @return true : 사용링 존재, false : 사용링 없음
*/
function checkUseRingAtRuPath(chkPath) {
	
	var chkUseRing = false;
	if (nullToEmpty(chkPath) != "" && nullToEmpty(chkPath.LINKS) != "") {
		for(var i = 0 ; i < chkPath.LINKS.length; i++) {
			if (nullToEmpty(chkPath.LINKS[i].RING_ID) != "" && chkPath.LINKS[i].RING_ID.substring(0,1) == "N") {
				chkUseRing = true;
				break;
			}
		}
	}
	return chkUseRing;
}

/** 사용링 갯수 체크
 * @param 체크할 그리드
 * @return 링갯수
*/
function checkUseRingCntAtRuPath(chkPath) {
	
	var chkUseRingCnt = 0;
	var bfUseRing = "";
	if (nullToEmpty(chkPath) != "" && nullToEmpty(chkPath.LINKS) != "") {
		for(var i = 0 ; i < chkPath.LINKS.length; i++) {
			if ( nullToEmpty(chkPath.LINKS[i].RING_ID) != "" && chkPath.LINKS[i].RING_ID.substring(0,1) == "N") {
				if (bfUseRing != nullToEmpty(chkPath.LINKS[i].RING_ID)) {
					bfUseRing = nullToEmpty(chkPath.LINKS[i].RING_ID);
					chkUseRingCnt++;
				}
			}
		}
	}
	return chkUseRingCnt;
}

/*
 * 5G-PON 링 COT 장비 체크 
 */
function checkCotEqpLowNew(links) {
	if (links.NODES.length > 0) {
		var conYn = false;
		var conFirstRow = -1;
		for (var i =0; i < links.NODES.length; i++) {
			if (conYn == false && isFiveGponCot(links.NODES[i], "A") == true) {
				conYn = true;
				conFirstRow = i;
			} 
			if (conYn == true) {
				break;
			}
		}
		if (conYn == true && (conFirstRow > 1)) {
			return false;
		}
	}
	return true;
}

/* * 
 * 링의 장비, 포트 체크
 */
function checkRingPort(links) {
	if (links.NODES.length > 0) {
		var portYN = true;
		for (var i =0; i < links.NODES.length; i++) {
		    var result = false;
		    var ringId = nullToEmpty(links.NODES[i].RING_ID);
		    var neId = nullToEmpty(links.NODES[i].NE_ID); //B_PORT_ID
			var aPortId = nullToEmpty(links.NODES[i].A_PORT_ID);
			var bPortId = nullToEmpty(links.NODES[i].B_PORT_ID);
			
			if(ringId != "" && ringId != null) {
				if ((neId != "" && neId != null) &&
						(aPortId == "-" || bPortId == "-" )) {
					portYN = false;
					break;
				} 
			}
		}
		if(portYN == false) {
			return false;
		}
	}
	return true;
}

/* TODO
 * 마지막 East장비(DUL) 등록여부 확인 - 2024-10-30
 * RU광코어회선 DU-L 장비 체크 
 * 25	LTE RU
 * 26	W-RU
 * 27	광중계기
 * 28	RF중계기
 * 31	중계기정합장치
 * 32	MiBOS
 * 38	5G DU-L
 * 42	ERP 광중계기
 * 43	ERP RF급
 */
function checkDuLEqpLow(links) {

	var eqpList = ['25','26','27','28','31','32','38','42','43']; //DUL장비군
	
	var chkDulEqpCnt = 0;
	
	if (links.NODES.length > 0) {
		var count = 1;
		
		for (var i =0; i < links.NODES.length; i++) {
			
		    if(count == (links.NODES.length)) {
				var neRoleCd = nullToEmpty(links.NODES[i].NE_ROLE_CD);
				
		    	for (var j = 0; j < eqpList.length; j++) {
					if (neRoleCd == eqpList[j]) {
						chkDulEqpCnt++;
						break;
					}
				}
		    }
		    count++;
		}
	}
	
	return chkDulEqpCnt;
}

/******************************* 5G-PON 서비스회선용 ETE적용 START ************************************/
	function setEteInfoFor5GPON(response) {
		// ETE적용결과가 있는 경우
		var errMsg = "";
		if(response.gisFdfE2E.NODES.length > 0) {	
			//console.log(response);
			var gidFdfE2eData = response.gisFdfE2E;
			
			var e2ePath = new TeamsPath();
			e2ePath.fromData(gidFdfE2eData);
		
			teamsPath.insertNode(fdfNodeId, e2ePath);
			teamsPath.removeNode(fdfNodeId);
			reGenerationDiagram(true);
			
			fdfNodeId = e2ePath.firstNode().NODE_ID;
			
			// CRN장비목록 / 사용링 정보가 있는경우			
			if (nullToEmpty(response.eqpSctnRghtInf) != "" && response.eqpSctnRghtInf.length > 1 && nullToEmpty(response.eqpSctnRghtInf[0].errMsg) != "") {   
				errMsg = response.eqpSctnRghtInf[0].errMsg + "<br><br>";
			}
		} // ETE결과가 없으면
		else {
			// fdfNodeId로 장비를 찾아서 장비 타입을 확인
			var tmpNode = teamsPath.findNodeById(fdfNodeId);
			var tmpNodeEqpType = isFiveGponCrn(tmpNode.Ne, "");
			if (tmpNodeEqpType == false && nullToEmpty(response.eqpSctnRghtInf) != "" && response.eqpSctnRghtInf.length > 0 && nullToEmpty(response.eqpSctnRghtInf[0].errMsg) != "") {  
				//alertBox('W', response.eqpSctnRghtInf[0].errMsg);
				//return;
				errMsg = response.eqpSctnRghtInf[0].errMsg+"<br><br>";
			}
		}
		
		
		
		var cfMsg = errMsg;
		if (nullToEmpty(response.useRing)== "NONE" ) {
			// ETE 구간의 종단에 SUB-RN 장비 정보를 취득한 경우
			if (response.crnEqpList != undefined && nullToEmpty(response.crnEqpList)!= "" && response.crnEqpList.length > 0) {
				cfMsg += response.eqpSctnRghtInf[0].rghtTopMtsoNm + "국사 소속의 C-RN장비목록이 조회되었습니다.<br> C-RN장비를 설정하시겠습니까?"
				callMsgBox('','C', cfMsg, function(msgId, msgRst){   /*XX국사 소속의 C-RN장비목록이 조회되었습니다.<br> C-RN장비를 설정하시겠습니까?*/
					// 장비선택
					if (msgRst == 'Y') {
						// 서비스회선의 국사별 RN, FDF 장비 설정
						openEqpListOfMtsoPop(response);
					}
				});
			} else {
				if (errMsg != "") {
					alertBox('W', errMsg);
					return;
				}
			}
		} 
		 // 사용링 없는 경우
		else if (nullToEmpty(response.useRing)!= "NONE"  && isFiveGponRuCoreLine() == true && checkUseRingAtRuPath(teamsPath.toTangoPath().toData()) == false  ) {
			cfMsg += "선택하신 CRN정보를 바탕으로 연관된 MRN장비를 사용하는 링의 구간을 찾았습니다. 자동으로 사용링 처리 하시겠습니까? ";
			callMsgBox('','C', cfMsg, function(msgId, msgRst){   /*전송하시겠습니까?*/
				// 사용링 형태로 셋팅
				if (msgRst == 'Y') {						
					// 청약설정시 설정한 장비와 일치하는 경우
					
					var addEqpInf = { }
					
					if (nullToEmpty(baseInfData.fiveGponCotEqpId) != "") {
						addEqpInf = {							
							"lftPortNm" : nullToEmpty(baseInfData.fiveGponCotPortNm)
						  , "lftPortId" : 	nullToEmpty(baseInfData.fiveGponCotPortId)
						  , "lftEqpId" : nullToEmpty(baseInfData.fiveGponCotEqpId)
						}
					}
					setEteInfoToGridWithUseNetworkPath(response,  "UR", addEqpInf, response.mainRnInfo);
				} 
			});
		} else {
			if (errMsg != "") {
				alertBox('W', errMsg);
				return;
			}
		}
		
		// MRN 장비가 취득된 경우
	}
	
	/**
	 * 8. 5G-PON고도화 5G-PON 서비스회선의 국사별 RN, FDF 장비 설정
	 */
	function openEqpListOfMtsoPop(data) {

		var param = data;
		// COT 정보
		param.fiveGponCotEqpNm = nullToEmpty(baseInfData.fiveGponCotEqpNm);
		param.fiveGponCotPortNm = nullToEmpty(baseInfData.fiveGponCotPortNm);
		// MRN 정보
		param.fiveGponMrnEqpMdlNm = getFiveGponEqpMdlNm(nullToEmpty(baseInfData.fiveGponMrnEqpMdlId), "MRN");
		param.fiveGponMrnPortNm = nullToEmpty(baseInfData.fiveGponMrnPortNm);
		
		// CRN정보
		param.fiveGponCrnEqpMdlId = nullToEmpty(baseInfData.fiveGponCrnEqpMdlId);
		param.fiveGponCrnEqpMdlNm = getFiveGponEqpMdlNm(nullToEmpty(baseInfData.fiveGponCrnEqpMdlId), "CRN");
		param.fiveGponCrnChnlNm = nullToEmpty(baseInfData.fiveGponCrnChnlNm);
		param.fiveGponCrnWaveNm = nullToEmpty(baseInfData.fiveGponCrnWaveNm);
		
		param.popTitle ="RN장비, FDF 장비 설정";
		$a.popup({
 		  	popid: 'SubRnInfoPop',
 		  	title: 'RN장비, FDF 장비 설정',
 		    url: '/tango-transmission-web/configmgmt/cfline/EqpListOfMtsoPop.do',
 		    data: param,
 		    iframe: true,
 		    modal : true,
 		    movable : true,
 		    windowpopup : true,
 		    width : 1200,
 		    height : 800,
 		    callback:function(data){
 		    	if(data != null){
 		    		//console.log(data);
 		    		if (nullToEmpty(data.eqpInfoForVisual) != "" && data.eqpInfoForVisual.NODES.length > 0) {
 		    									 	
 		    			var rnEqpPath = new TeamsPath();
 		    			rnEqpPath.fromData(data.eqpInfoForVisual);
 		    			
 						teamsPath.insertNode(fdfNodeId, rnEqpPath);
 						reGenerationDiagram(true);
 						
 						fdfNodeId = rnEqpPath.firstNode().NODE_ID;
 						
 						// 연결장비 설정에서 ETE적용을 선택하거나 FDF설정없이 CRN장비만 설정한 경우 ETE작용 적용
 		    			if (data.eteYn == "Y" || (data.eteYn == "N" && data.eqpSctnRghtInf[1].fiveGponEqpType == "CRN"  && nullToEmpty(data.rnInfo) != "" && nullToEmpty(data.rnInfo.eqpId) != "")) {
 		    				cflineShowProgressBody();
 		    				var eqpParam = {
 		    						"eqpId" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftEqpId : "")
 		    					  , "portNm" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftPortNm : "")
 		    					  , "mtsoId" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftTopMtsoId : "")
 		    					  , "generateLeft" : true
 		    					  , "rxPortNm" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftRxPortNm : "")
 		    				};
 		    				
 		    				if (nullToEmpty(data.rnInfo) != "" && nullToEmpty(data.rnInfo.eqpId) != "") {
 		    					eqpParam.crnEqpId = data.rnInfo.eqpId;    // CRN장비ID
		    					eqpParam.crnEqpNm = data.rnInfo.eqpNm;    // CRN장비ID
		    					eqpParam.crnPortId = data.rnInfo.bPortId; // CRN장비의 WEST(B)포트
		    					eqpParam.crnPortNm = data.rnInfo.bPortNm; // CRN장비의 WEST(B)포트 
		    					eqpParam.eqpInstlMtsoId = data.rnInfo.mtsoId; // CRN장비의 WEST(B)실장국사
 		    				}
 		    				eqpParam.appltTypeOfFiveg = baseInfData.appltTypeOfFiveg;
 		    				eqpParam.ntwkLineNo = initParam.ntwkLineNo;
 		    				eqpParam.callViewType ="V";  // V : 시각화
 		    				eqpParam.generateLeft = true;  // 설정한 FDF 장비를 기준으로 역으로 취득
 		    				eqpParam.lowMtsoId = nullToEmpty(baseInfData.lowMtsoId);
 		    				eqpParam.fiveGponVer = nullToEmpty(baseInfData.fiveGponVer);

 		    				
 		    				
 		    				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectEteInfWithEqpList', eqpParam, 'GET', 'e2eApplayWithUseNetwork');
 		    			}
 		    		}
 		    	}
 		    	// 다른 팝업에 영향을 주지않기 위해
 				$.alopex.popup.result = null; 
 		    }
		
		});
	}

	/**
	 * ETE적용한 구간의 사용링 처리
	 * @param response : 리턴값 
	 * @param useNetworkType : 사용네트워크타입 
	 * @param addEqpInf : ADD연결장비정보 (5G-PON : 장비ENG에 설정한 COT) 
	 * @param useNetworkType : DROP 연결장비정보 (5G-PON : MRN COT) 
	 * 
	 */
	function setEteInfoToGridWithUseNetworkPath(response, useNetworkType, addEqpInf, dropEqpInf) {
		
		if (useNetworkType == "UR") {
			
			// 앞뒤 장비 붙여주고 ADD-DROP정보 설정 필요
			var useNetworkPath = response.useRing;
			//console.log(useNetworkPath);
			
			// 시각화용 링정보 처리
			var useRingPath = new TeamsPath();
			
			// 사용링 처리하기 위해 ADD-DROP장비설정
			var tmpLinkList = [];
			
			for (var i =0; i < useNetworkPath.LINKS.length; i++) {
				var tmpLink = useNetworkPath.LINKS[i];
				// 첫구간
				if (i == 0) {
					var addData = {};
					for(var s in tmpLink){
						if(s.indexOf('LEFT_') == 0 ) {
							eval("addData." + s.replace("LEFT_", "RIGHT_") + " = tmpLink." + s);
						}
					}
					// 좌장비 ADD_DROP타입설정
		    		addData.LEFT_ADD_DROP_TYPE_CD = "N";
		    		addData.LEFT_NODE_ROLE_CD = "NA";
		            // 우장비 정보 셋팅
		    		addData.RIGHT_PORT_DESCR = "";
		    		addData.RIGHT_PORT_NM = "";
		    		addData.RIGHT_PORT_ID = null;	    		
		    		addData.RIGHT_ADD_DROP_TYPE_CD = "A";
		    		addData.RIGHT_NODE_ROLE_CD = "NA";
	
		    		// Add 장비정보(COT장비)가 있는경우 포트 설정
		    		if (nullToEmpty(addEqpInf) != "" && addData.RIGHT_NE_ID == addEqpInf.lftEqpId && addEqpInf.lftEqpId != "" && addEqpInf.lftPortId != ""  ) {
	
			            addData.RIGHT_PORT_DESCR = addEqpInf.lftPortNm;
			            addData.RIGHT_PORT_NM = addEqpInf.lftPortNm;
			            addData.RIGHT_PORT_ID = addEqpInf.lftPortId;
		    		}
		    		
					tmpLinkList.push(addData);
				}
				
				tmpLink.LEFT_ADD_DROP_TYPE_CD = "T";
				tmpLink.RIGHT_ADD_DROP_TYPE_CD = "T";
	
				tmpLink.LEFT_NODE_ROLE_CD = "NA";
				tmpLink.RIGHT_NODE_ROLE_CD = "NA";
				tmpLinkList.push(tmpLink);
				
				// 마지막 구간
				if (i == useNetworkPath.LINKS.length -1) {
					var addData = {};
					for(var s in tmpLink){
						if(s.indexOf('RIGHT_') == 0 ) {
							eval("addData." + s.replace("RIGHT_", "LEFT_") + " = tmpLink." + s);
						}
					}
					// 우장비 ADD_DROP타입설정
					addData.RIGHT_ADD_DROP_TYPE_CD = "N";
					addData.RIGHT_NODE_ROLE_CD = "NA";
					
		            // 좌장비 정보 셋팅
		            addData.LEFT_PORT_DESCR = "";
		            addData.LEFT_PORT_NM = "";
		            addData.LEFT_PORT_ID = null;
		            addData.LEFT_ADD_DROP_TYPE_CD = "D";
		            addData.LEFT_NODE_ROLE_CD = "NA";
	
		    		// Drop 장비정보(MRN)가 있는경우 포트 설정
		    		if (nullToEmpty(dropEqpInf) != "" && dropEqpInf.lftEqpId != "" && dropEqpInf.lftPortId != "" && nullToEmpty(baseInfData.fiveGponVer) == "2") {
	
			            addData.LEFT_PORT_DESCR = dropEqpInf.lftPortNm;
			            addData.LEFT_PORT_NM = dropEqpInf.lftPortNm;
			            addData.LEFT_PORT_ID = dropEqpInf.lftPortId;
		    		}
		            
		            tmpLinkList.push(addData);
				}
			}
			// 편집한 링크 삽입
			useNetworkPath.LINKS = tmpLinkList;
			
			useRingPath.fromTangoPath(useNetworkPath);
			useRingPath.PATH_DIRECTION = useNetworkPath.PATH_DIRECTION;
			
			teamsPath.insertNode(fdfNodeId, useRingPath);
			reGenerationDiagram(true);
		}
	}

	/**
	 * 5G-PON 2.0 장비 타입별 모델명 추출
	 * @param eqpMdlId : 장비모델 ID
	 * @param eqpMdlType : 장비모델 타입
	 */
	function getFiveGponEqpMdlNm(eqpMdlId, eqpMdlType) {
		var mdlList = [];
		
		if (eqpMdlType == "COT") {
			mdlList = baseInfData.fiveGponEqpMdlIdList.cotEqpMdlList;
		} else if (eqpMdlType == "MRN") {
			mdlList = baseInfData.fiveGponEqpMdlIdList.mrnEqpMdlList;
		} else if (eqpMdlType == "CRN") {
			mdlList = baseInfData.fiveGponEqpMdlIdList.crnEqpMdlList;
		}
		
		var eqpMdlNm = "";
		for (var i = 0; i < mdlList.length; i++) {
			if (eqpMdlId == mdlList[i].text) {
				eqpMdlNm = mdlList[i].comCdDesc;
				break;
			}
		}
		
		return eqpMdlNm;
	}

	function checkRingType(){
		var bres = false;
		var dataList = $('#'+'tangoPathList').alopexGrid("dataGet");
		var len = dataList.length;
		
		if(len <= 0)		return true;
		
		var data = AlopexGrid.trimData($('#'+'tangoPathList').alopexGrid('dataGet'));
		for(var i = 0; i < data.length; i++) {
			for(key in data[i]) {
				var temp = String(eval("data[i]."+key)).indexOf('alopex'); 
				if(temp == 0) {
					eval("data[i]."+key + " = ''");
				}
			}
			data[i].LINK_SEQ = (i+1);
		}
		var ruleParam = {"links" : JSON.stringify(data)
				, "topoLclCd" : initParam.topoLclCd
				, "topoSclCd" : initParam.topoSclCd
				, "ntwkLineNo" : initParam.ntwkLineNo
		};
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/checkSMuxRingType', ruleParam, 'POST', 'checkSMuxRingType');
		
		return bres;
	}

	function deleteClassData(links){
		
		var len = links.length;
		var revlen = len - 1;
		
		if(len == 0)		return;
		
		for(var i= 0 ; i < len; i++){
			var data = links[i];

			delete data.leftNode;
			delete data.rightNode;
		}
	}

	/*
	 * 링-M/W PTP링 여부 
	 */
	function isMWPtpRingOld() {
		var chkLineType = false;
		if(gridDivision == "ring" && nullToEmpty(topoLclCd) == "001" && nullToEmpty(topoSclCd) == "039") {
			chkLineType = true; 
		}
		return chkLineType;
	}
	
	/*
	 * M/W PTP링 저장시 네트워크기본정보에 M/W 용도구분 insert
	 */
	function insertMwUsgDiv(ntwkLineNo){
		var param = {
			"ntwkLineNo" : ntwkLineNo
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/insertmwusgdiv', param, 'GET', 'insertMwUsgDiv');
	}
/******************************5G-PON 서비스회선용 ETE적용 END ****************************************************/
// 2019-12-17 키보드 이벤트
// 클립보드에 copy한 노드를 마지막 SEQ로 생성하며 맨 뒤에 붙힌다
function ClipboardPasted(e) {
	var data = e.diagram.selection.Da.key.data;
	data.SEQ = 9999;
	selectedOriginalPath[data.NE_ID] = data;
	finishDrop(e);
}

