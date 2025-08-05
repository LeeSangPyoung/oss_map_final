/**
 * NetworkPathDiagramPop.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 *  
 * 
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-03-15  2. [수정] LTE / RU(CMS수집선번) 편집 불가
 * 2018-09-12  3. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2019-10-21  4. 기간망 링 선번 고도화 : 링 재사용으로 링 그룹에 2차 3차 링 표시
 */

/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsPath = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsPathData = null;


/**
 * TEAMS 선번의 사용 네트워크 구간은 양 끝 노드만 포함하는 선번
 */
var teamsShortPathData = null;

/**
 * 선번 원본
 */
var originalPath = null;

/**
 * gojs diagram
 */
var visualLinePath;

/**
 * gojs object 생성
 */
var $go = go.GraphObject.make;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkDataArray = [];

/**
 * 사용네트워크 그룹핑을 위한 아이디
 */
var useNetworkId = null;

// 2018-09-12  3. RU고도화

/**
 * 사용트렁크의 그룹핑을 위한 아이디 
 */
var useServiceId = null;

/**
 * 사용트렁크의 그룹핑을 위한 아이디 
 */
var useTrunkNetworkId = null;

/**
 * 사용링의 그룹핑을 위한 아이디
 */
var useRingNetworkId = null;

/**
 * 사용링의 2차링 그룹핑을 위한 아이디
 */
var useRingNetworkIdL2 = null;

/**
 * 사용링의 3차링 그룹핑을 위한 아이디
 */
var useRingNetworkIdL3 = null;

/**
 * 사용WDM트렁크의 그룹핑을 위한 아이디
 */
var useWdmTrunkNetworkId = null;


/**
 * 
 */
var initParam = null;

/**
 * 트렁크, WDM트렁크 선번
 */
var visualDetailDiv;

/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsTrunkPath = new TeamsPath();

/**
 * TEAMS 선번의 사용 네트워크 구간은 양 끝 노드만 포함하는 선번
 */
var teamsTrunkShortPathData = null;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeTrunkDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkTrunkDataArray = [];

/**
 * 선번 조회 parameter
 */
var searchParam = null;

/**
 * 선번 기본정보 조회 parameter
 */
var vDataParam = null;

/**
 * 주예비 여부
 */
var wkSprYn = false;

/**
 * 네트워크 및 장비명이 길 경우 cut할 길이
 */
var nmCutIdx = 10;

/**
 * 선번 기본정보 데이터
 */
//var baseInfData = {};

$a.page(function() {
	
	this.init = function(id, param) {
		
		$("#lineRingDiagram").on("tabchange", function(e,index){
			if(index == 2){
				$("#"+teamsGridId).alopexGrid("viewUpdate");
			}  
		});
		
		if (! jQuery.isEmptyObject(param) ) {
			initParam = param;

			if(wkSprYn) {
				$('#'+teamsGridId).alopexGrid("updateOption", { height: 200});
			}
			
			if(isServiceLine() || isTrunk()) {
				$("#ringDiagramDiv").show();
			}
			
			if(isRing()) {
				// PTP링 -> 주,예비 선번으로 화면을 WDM트렁크처럼 변경
				if(isPtp()) {
					$("#lineRingDiagram").remove();
					$("#wdmTrunkWkSpr").show();
				}
				if (isMeshRing(initParam.topoSclCd) == true || isAbleViaRing(initParam.topoSclCd) == true) {
					$("#ringDiagramDiv").show();
				}
			}
			
			/*
			 * 1. [수정] RU광코어 링/예비선번 사용
			 */
			if (isRuCoreLine()) {
				$("#lineRingDiagram").remove();
				$("#wdmTrunkWkSpr").show();
			}
			
			cflineShowProgressBody();
			
			searchParam = null;
			if(isServiceLine()) {
				vDataParam =  {"svlnNo":param.ntwkLineNo};
				searchParam = {"ntwkLineNo" : param.ntwkLineNo, "utrdMgmtNo" : param.utrdMgmtNo, "exceptFdfNe" : "N", "svlnLclCd" : param.svlnLclCd, "svlnSclCd" : param.svlnSclCd};
			} else {
				vDataParam =  {"ntwkLineNo":param.ntwkLineNo};
				searchParam = {"ntwkLineNo" : param.ntwkLineNo, "utrdMgmtNo" : param.utrdMgmtNo, "exceptFdfNe" : "N", "topoLclCd" : param.topoLclCd, "topoSclCd" : param.topoSclCd};
			}
			
			var ntwkLnoGrpSrno = param.ntwkLnoGrpSrno;
			if(nullToEmpty(ntwkLnoGrpSrno) == "") {
				$.extend(searchParam,{"wkSprDivCd": "01"});
				$.extend(searchParam,{"autoClctYn": "N"});
			} else {
				$.extend(searchParam,{"ntwkLnoGrpSrno": ntwkLnoGrpSrno});
			}
			
			if(isServiceLine()) {
				httpRequestBase('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getServiceLineInfo', vDataParam, 'GET', 'getServiceLineInfo');
			} else if(isTrunk()) {
				httpRequestBase('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getTrunkInfo', vDataParam, 'GET', 'getTrunkInfo');
			} else if(isRing()){
				httpRequestBase('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getOutData', vDataParam, 'GET', 'getRingInfo');
			} else if(isWdmTrunk()) {
				httpRequestBase('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/getwdmtrunkinfo', vDataParam, 'GET', 'getWdmTrunkInfo');
			}			
    	}
		
		// FDF재전송을 위한 버튼 표시여부
		if(nullToEmpty(param.svlnLclCd) != ""  || nullToEmpty(param.topoLclCd) == "001") {
//			console.log(param);
			$("#btnResendFdfInfoPop").show();
		}
		
		// 2. [수정] LTE, WCDMA(IPNB)수집, 5G  / RU(CMS수집선번) 편집 불가
		if (nullToEmpty(param.svlnLclCd) != "" && nullToEmpty(param.svlnSclCd) != ""
			&& ((nullToEmpty(param.svlnLclCd) == "001" && nullToEmpty(param.svlnSclCd) == "016" )  
					|| (nullToEmpty(param.svlnLclCd) == "001" && nullToEmpty(param.svlnSclCd) == "030" ) 
					|| (nullToEmpty(param.svlnLclCd) == "001" && nullToEmpty(param.svlnSclCd) == "020" && nullToEmpty(param.autoClctYn) == "Y" ) 
					|| (nullToEmpty(param.svlnLclCd) == "003" && nullToEmpty(param.svlnSclCd) == "103"))
			) {
			$("#btnPahViaualEdit").hide();
		}

		/* FDF 정보 재전송 */
		$('#btnResendFdfInfoPop').on('click', function(e) {
			var fdfInfoType = "";  // S : 서비스회선, R : RING
			var fdfEditType = "A"; // A : 현 선번정보 (현 구간정보 모두 전송)
			if (nullToEmpty(param.svlnLclCd) != "") {
				fdfInfoType = "S";
			} else if (nullToEmpty(param.topoLclCd) == "001") {
				fdfInfoType = "R";
			}
			
			if (fdfInfoType == "") return;
			
			var fdfParam = {
					 lineNoStr : param.ntwkLineNo
				   , fdfEditLneType : fdfInfoType
				   , fdfEditType : fdfEditType  // A : 현 선번정보와 바로 이전 이력정보를 모두 보냄
			}
			callMsgBox('','C', cflineMsgArray['transmission'], function(msgId, msgRst){   /*전송하시겠습니까?*/
	        	if (msgRst == 'Y') {
					//console.log(fdfParam);
					cflineShowProgressBody();
					Tango.ajax({
						url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendfdfuseinfo', 
						data : fdfParam, //data가 존재할 경우 주입
						method : 'GET', //HTTP Method
						flag : 'sendfdfuseinfo'
					}).done(function(response){
								cflineHideProgressBody();
								alertBox('I', cflineMsgArray['normallyProcessed']); /*"정상적으로 처리되었습니다.;*/
							})
					  .fail(function(response){
						  		cflineHideProgressBody();
						  		alertBox('I', cflineMsgArray['abnormallyProcessed']); /*"정상적으로 처리되지 않았습니다.<br>관리자에게 문의하시기 바랍니다.;*/
						  	});
	        	}
			});
    	});
		
		setButtonEventListener();
//		baseInfoHide();
//		initGridPortInf();
		
		// 주예비 여부
		wkSprYn = ( isWdmTrunk() || isPtp() || isRuCoreLine()); 
		
	};
});

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
		data : Param, 		//data가 존재할 경우 주입
		method : Method, 	//HTTP Method
		flag : Flag
	}).done(successCallback);
};

var httpRequestBase = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
		data : Param, 		//data가 존재할 경우 주입
		method : Method, 	//HTTP Method
		flag : Flag
	}).done(successCallbackBase);
};


function successCallbackBase(response, status, jqxhr, flag) {
	if(flag == "getServiceLineInfo") {
		if(response.svlnWorkYn != "Y") {
			$("#btnPathEdit").setEnabled(false);
			$("#btnPahViaualEdit").setEnabled(false);
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'selectLinePath');
		
		// 회선명 표시
		var lineInfoText = " ";
		lineInfoText = cflineMsgArray['lnNm'] + " : " + nullToEmpty(response.lineNm) + " , " +  cflineMsgArray['lineNo'] + " : " + nullToEmpty(response.svlnNo) ; 		
		$("#lineInfoPop").html(" " + lineInfoText + " "); 
		
	} else if(flag == "getTrunkInfo" || flag == "getRingInfo" || flag == "getWdmTrunkInfo") {		
		if(initParam.callFrmTyp != undefined && initParam.callFrmTyp == "SIM") {
			$("#btnPathEdit").setEnabled(true);
			$("#btnPahViaualEdit").setEnabled(true);
		} else {
			var workYn = "N";
			
			if(flag == "getRingInfo") {
				workYn = response.getOutInfoData[0].ntwkWorkYn;
			} else {
				workYn = response.ntwkWorkYn;
			}
			
			if(workYn != "Y") {
				$("#btnPathEdit").setEnabled(false);
				$("#btnPahViaualEdit").setEnabled(false);
			}
		}
		
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath');

		// 회선명 표시
		var lineInfoText = " ";
		lineInfoText = cflineMsgArray['networkName'] + " : " + (flag == "getRingInfo" ? nullToEmpty(response.getOutInfoData[0].ntwkLineNm) : nullToEmpty(response.ntwkLineNm)) + " , " +  cflineMsgArray['networkIdentification'] + " : " + (flag == "getRingInfo" ? nullToEmpty(response.getOutInfoData[0].ntwkLineNo) : nullToEmpty(response.ntwkLineNo)) ;
		$("#lineInfoPop").html(" " + lineInfoText + " "); 
		
	} 
}

function successCallback(response, status, jqxhr, flag){
	
	if(response.data != undefined) {
		if( flag == "ringSearch" ) {
			cflineHideProgressBody();
			$("#ringNetworkNm").html(response.data.NETWORK_NM);
			$("#ringDiv").remove();
			$("#visualRingDiv").append("<div id=\"ringDiv\" style=\"width:100%;  height:80vh;\"></div>");
			
			nodeRingDataArray = [];
			originalRingPath = null;
			teamsRingPath = new TeamsPath();
			originalTeamsPath = new TeamsPath();
			isPtpRing = false;
			isDisplayLinear = false;
			
			if(response.data != undefined) {
				$("#lineRingDiagram").setTabIndex(1);
				originalRingPath = response.data;
				teamsRingPath.fromTangoPath(originalRingPath);
				
			    originalTeamsPath.fromTangoPath(originalRingPath);
			    teamsRingPath = originalTeamsPath.createRingPath();
			    
			    if( teamsRingPath.NODES.length < 1 ) {		    	
//			    	alertBox('W', '링 구성도를 표시할 데이터가 없습니다.');
			    	return false;
			    }
				    
			    if ( originalRingPath.TOPOLOGY_SMALL_CD === '002' ||  originalRingPath.TOPOLOGY_SMALL_CD === '031' ) {
					isPtpRing = true;
				} 

				if ( isPtpRing || teamsRingPath.NODES.length <= 2 ) {
					isDisplayLinear = true;
				}
				
				initRingDiagram();
				generateRingDiagram();
			}
			
		} else if( flag == "selectLinePath" || flag == "selectNetworkPath" ) {
			initDiagram();
			
			teamsPath = new TeamsPath();
			
			originalPath = response.data;
			teamsPath.fromTangoPath(originalPath);
			
			teamsPathData = teamsPath.toData();		// 그리드
			
			generateDiagram();
			initGridNetworkPath('teamsPathList');
			teamsPathGrid();
			
			if(wkSprYn) {
				searchParam.wkSprDivCd = "02";
				
				/*
				 * 1. [수정] RU광코어 링/예비선번 사용
				 */
				if (isRuCoreLine() == true) {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'reserveLinePath');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'reserveNetworkPath');
				}
				$('#teamsPathList').alopexGrid("updateOption", { height: 220});
			} else {
				$('#'+teamsGridId).alopexGrid("updateOption", { height: 700});
				cflineHideProgressBody();
			}
			/*// RU인경우 그리드 높이 수정
			if (isRuCoreLine() == true) {
				// 주선번 그리드 높이 수정
				$("#teamsPathList").alopexGrid("updateOption", { height: 220});
			}*/
		}
		/*
		 * 1. [수정] RU광코어 링/예비선번 사용
		 */
		else if(flag == "reserveLinePath") {	
			wdmTrunkSprOriginal = response.data;
			cflineHideProgressBody();		
		}
		else if( flag == "reserveNetworkPath" ) {
			wdmTrunkSprOriginal = response.data;
			cflineHideProgressBody();
		} 
	} else {
		initGridNetworkPath('teamsPathList');
		
		// 예비선번이 없는 경우
		if(wkSprYn == false) {
			// 주선번 그리드 높이 수정
		$('#'+teamsGridId).alopexGrid("updateOption", { height: 700});
		}
		cflineHideProgressBody();
	}
}

function initDiagram() {

	$("#visualDiv").remove();
	if (wkSprYn == true) {
		$("#lineDiagram").append("<div id=\"visualDiv\" style=\"width:100%; height:50vh; vertical-align: center;\"></div>");
	} else {
		$("#lineDiagram").append("<div id=\"visualDiv\" style=\"width:100%; height:80vh; vertical-align: center;\"></div>");
	}	
	
	nodeDataArray = [];
	linkDataArray = [];
	
	visualLinePath =
		$go(go.Diagram, "visualDiv",
	        {
			  maxSelectionCount: 0,
			  layout:
	        	  $go(go.GridLayout,
			              {  
	        		  			cellSize: new go.Size(2, 2), spacing: new go.Size(20, 20), //  wrappingWidth: Infinity, wrappingColumn: 3,   
	        		  			alignment: go.GridLayout.Position,
	        		  			arrangement: go.GridLayout.Location,
	        		  			wrappingColumn:6,
	        		  			comparer: function(a, b) {
									var av = a.data.SEQ;
									var bv = b.data.SEQ;
									if(av < bv) return -1;
									if(av > bv) return 1;
									return 0;
	        		  			}
			              }), 
	          initialContentAlignment: go.Spot.Center,
	          "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom
//	          isReadOnly: true
	        }
		);
	
	makeNodeTemplate();
	makeLinkTemplate();
	
	/*
	 * 1. [수정] RU광코어 링/예비선번 사용
	 * 예비선번 사용으로 링을 표시해도 더블클릭시 이벤트 실행 하지 못하게 설정
	 */
	if (wkSprYn == false) {
		setDiagramClickEvent();
	}
	
	visualLinePath.allowDelete = false;
}

/**
 * 노드 템플릿
 */
function makeNodeTemplate() {
	setNodeTemplate();
	setGroupTemplate();
}

function generateDiagram() {
	generateNodes();
    generateLinks();
	
	visualLinePath.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

function groupNodeTeamsPath(node, network) {
	var teamsNode = new TeamsNode();
	teamsNode.key = guid();
	groupGuid = teamsNode.key; 
	teamsNode.NODE_ID = node.NODE_ID;
	teamsNode.isGroup = true;
	teamsNode.expanded = false;
	
	/* 2018-09-12  3. RU고도화 */
	if(network == "Service") {
		// 서비스회선
		teamsNode.category = 'SERVICE';
		teamsNode.color = '#5587ED';	
	} 
	else if(network == "Trunk") {
		// 트렁크
		teamsNode.category = 'TRUNK';
		teamsNode.color = '#A89824';		
	} else if(network == "Ring") {
		// 링
		teamsNode.category = 'RING';
		teamsNode.color = '#FF7171';
	} else if(network == "WdmTrunk") {
		// WDM트렁크
		teamsNode.category = 'WDM_TRUNK';
		teamsNode.color = '#3A8B3A';
	}
	
	teamsNode.SEQ = node.SEQ;

	teamsNode.NETWORK_ID = eval("node."+network+".NETWORK_ID");
//	teamsNode.NETWORK_NM = eval("node."+network+".NETWORK_NM");
	var networkNm = eval("node."+network+".NETWORK_NM")
	teamsNode.NETWORK_NM_TOOLTIP = networkNm;
	teamsNode.NETWORK_NM = nmCunt(networkNm);
	teamsNode.PATH_SAME_NO = eval("node."+network+".PATH_SAME_NO");
	
	nodeDataArray.push(teamsNode);
	
	return groupGuid;
}

function generateNodes() {
	useServiceId = null;
	useTrunkNetworkId = null;
	useRingNetworkId = null;
	useRingNetworkIdL2 = null;
	useRingNetworkIdL3 = null;
	useWdmTrunkNetworkId = null;
	
	for ( var idx = 0; idx < teamsPath.NODES.length; idx++) {
    	var node = teamsPath.NODES[idx];
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
    	
    	node.nodeTooltipText = node.toString();
    	
    	// 그룹
        /* 2018-09-12  3. RU고도화 */
    	if(node.isServiceNode()) {
    		if(useServiceId != node.Service.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsPath(node, "Service");
    		}
    		node.group = groupGuid;
    		useServiceId = node.Service.NETWORK_ID;
    	}  
    	else if(node.isTrunkNode()) {
    		if(useTrunkNetworkId != node.Trunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsPath(node, "Trunk");
    		}
    		node.group = groupGuid;
    		useTrunkNetworkId = node.Trunk.NETWORK_ID;
    	} else if(node.isRingNode()) {
    		if(useRingNetworkId != node.Ring.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsPath(node, "Ring");
    		}
    		node.group = groupGuid;
    		useRingNetworkId = node.Ring.NETWORK_ID;
    	} else if(node.isWdmTrunkNode()) {
    		if(useWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsPath(node, "WdmTrunk");
    		}
    		node.group = groupGuid;
    		useWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    	}    	  	
    	
    	nodeDataArray.push( node );
    }
	//useServiceId = null;
	// 사용 네트워크 내의 사용 네트워크 확인
    var copyNodeDataArray = nodeDataArray;
    for( var idx = 0; idx < copyNodeDataArray.length; idx++) {
    	var node = copyNodeDataArray[idx];
    	
    	/* 2018-09-12  3. RU고도화 */
    	// 사용 서비스회선에 속하는 노드인 경우
    	if(!node.isGroup && node.isServiceNode()) {
    		// 서비스인 경우
    		/*if(node.isServiceNode()) {
    			if(useServiceId != node.Service.NETWORK_ID) {
    				// 서비스 안의 서비스 노드
    				setInfoForGroupNode(node, "SERVICE", copyNodeDataArray, idx);
    			}
    			node.group =  "SERVICE" + node.Service.NETWORK_ID;
    			useServiceId = node.Service.NETWORK_ID;
    		}*/
    		// 트렁크인 경우
    		if(node.isTrunkNode()) {
    			if(useTrunkNetworkId != node.Trunk.NETWORK_ID) {
    				// 서비스 안의 트렁크 노드
    				setInfoForGroupNode(node, "TRUNK", copyNodeDataArray, idx);
    				idx++;
    			}
    			node.group =  "TRUNK" + node.Trunk.NETWORK_ID;
    			useTrunkNetworkId = node.Trunk.NETWORK_ID;
    		}
    		// 링인경우
    		if(node.isRingNode()) {
    			if(useRingNetworkId != node.Ring.NETWORK_ID) {
    				// 서비스회선 안의 링 노드
    				setInfoForGroupNode(node, "RING", copyNodeDataArray, idx);
    				idx++;
    			}
    			// 2차 혹은 3차 그룹노드인 경우는 useRingNetworkId 값을 업데이트 하지 않는다.
    			if (useRingNetworkIdL2 != node.Ring.NETWORK_ID &&  useRingNetworkIdL3 != node.Ring.NETWORK_ID) {
    			node.group =  "RING" + node.Ring.NETWORK_ID;
    			useRingNetworkId = node.Ring.NETWORK_ID;
    		}
        		
    			// 2019-10-21  4. 기간망 링 선번 고도화
        		// 2차링의 노드인지
        		if(nullToEmpty(node.Ring.RING_ID_L2) != "") {
        			if(useRingNetworkIdL2 != node.Ring.RING_ID_L2) {
        				// 링 안의 2차링 노드
        				setInfoForGroupNode(node, "L2RING", copyNodeDataArray, idx);
        				idx++;
        			}
        			
        			node.group =  "L2RING" + node.Ring.RING_ID_L2;
        			useRingNetworkIdL2 = node.Ring.RING_ID_L2;

            		// 3차링의 노드인지
            		if(nullToEmpty(node.Ring.RING_ID_L3) != "") {
            			if(useRingNetworkIdL3 != node.Ring.RING_ID_L3) {
            				// 링 안의 2차링 노드
            				setInfoForGroupNode(node, "L3RING", copyNodeDataArray, idx);
            				idx++;
            			}
            			node.group =  "L3RING" + node.Ring.RING_ID_L3;
            			useRingNetworkIdL3 = node.Ring.RING_ID_L3;
            		}
        		}
    		}    		
    		
    		// WDM 트렁크인경우
    		if(node.isWdmTrunkNode()) {
    			if(useWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 서비스 안의 WDM트렁크 노드
    				setInfoForGroupNode(node, "WDM_TRUNK", copyNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		} 
    	}
    	// 사용 트렁크에 속하는 노드인경우
    	else if(!node.isGroup && !node.isServiceNode() && node.isTrunkNode()) {
    		if(node.isRingNode()) {
    			
    			// 2차 3차 링의 그룹노드가 추가되어  그룹 노드에 대해 두번 작업이 이뤄지기도 함.
    			if(useRingNetworkId != node.Ring.NETWORK_ID && useRingNetworkIdL2 != node.Ring.NETWORK_ID &&  useRingNetworkIdL3 != node.Ring.NETWORK_ID) {
    				// 트렁크 안의 링 노드
    				setInfoForGroupNode(node, "RING", copyNodeDataArray, idx);
    				idx++;
    			}
    			
    			// 2차 혹은 3차 그룹노드인 경우는 useRingNetworkId 값을 업데이트 하지 않는다.
    			if (useRingNetworkIdL2 != node.Ring.NETWORK_ID &&  useRingNetworkIdL3 != node.Ring.NETWORK_ID) {
    			node.group =  "RING" + node.Ring.NETWORK_ID;
    			useRingNetworkId = node.Ring.NETWORK_ID;
    		} 
    			// 2019-10-21  4. 기간망 링 선번 고도화
        		// 2차링의 노드인지
        		if(nullToEmpty(node.Ring.RING_ID_L2) != "") {
        			if(useRingNetworkIdL2 != node.Ring.RING_ID_L2) {
        				// 링 안의 2차링 노드
        				setInfoForGroupNode(node, "L2RING", copyNodeDataArray, idx);
        				idx++;
        			}
        			
        			node.group =  "L2RING" + node.Ring.RING_ID_L2;
        			useRingNetworkIdL2 = node.Ring.RING_ID_L2;

            		// 3차링의 노드인지
            		if(nullToEmpty(node.Ring.RING_ID_L3) != "") {
            			if(useRingNetworkIdL3 != node.Ring.RING_ID_L3) {
            				// 링 안의 2차링 노드
            				setInfoForGroupNode(node, "L3RING", copyNodeDataArray, idx);
            				idx++;
            			}
            			node.group =  "L3RING" + node.Ring.RING_ID_L3;
            			useRingNetworkIdL3 = node.Ring.RING_ID_L3;
            		}
        		}
    		} 
    		
    		if(node.isWdmTrunkNode()) {
    			if(useWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 트렁크 안의 WDM트렁크 노드
    				setInfoForGroupNode(node, "WDM_TRUNK", copyNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		} 
	    } 
    	/*
    	 * 1. [수정] RU광코어 링/예비선번 사용
    	 */
    	else if (!node.isGroup && !node.isServiceNode() && !node.isTrunkNode() && node.isRingNode()) {
    		// 2019-10-21  4. 기간망 링 선번 고도화
    		// 2차링의 노드인지
    		if(nullToEmpty(node.Ring.RING_ID_L2) != "") {
    			if(useRingNetworkIdL2 != node.Ring.RING_ID_L2) {
    				// 링 안의 2차링 노드
    				setInfoForGroupNode(node, "L2RING", copyNodeDataArray, idx);
    				idx++;
    			}
    			
    			node.group =  "L2RING" + node.Ring.RING_ID_L2;
    			useRingNetworkIdL2 = node.Ring.RING_ID_L2;

        		// 3차링의 노드인지
        		if(nullToEmpty(node.Ring.RING_ID_L3) != "") {
        			if(useRingNetworkIdL3 != node.Ring.RING_ID_L3) {
        				// 링 안의 2차링 노드
        				setInfoForGroupNode(node, "L3RING", copyNodeDataArray, idx);
        				idx++;
        			}
        			node.group =  "L3RING" + node.Ring.RING_ID_L3;
        			useRingNetworkIdL3 = node.Ring.RING_ID_L3;
        		}
    		}
    		// WDM트렁크인경우
			if(node.isWdmTrunkNode()) {
    			if(useWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 링 안의 WDM트렁크 노드
    				setInfoForGroupNode(node, "WDM_TRUNK", copyNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		}
	    }
    }
	
	// rest seq
    for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
    	nodeDataArray[idx].SEQ = idx + 1;
    }
}

/**
 *  2018-09-12  3. RU고도화
 *	전달받은 노드로 부터 그룹 타입별로 teamsNode를 생성하여 리턴  
 **/
function setInfoForGroupNode(tempNode, groupType, copyNodeDataArray, idx) {
	var tempKey = null;
	var tempNodeInfo = null;
	var tempColor = null;
	var category = groupType;

	if (groupType == "SERVICE") {
		tempNodeInfo = tempNode.Service;
		tempColor = "#5587ED";
	}
	else if (groupType == "TRUNK") {
		tempNodeInfo = tempNode.Trunk;
		tempColor = "#A89824";
	}
	else if (groupType == "RING" || groupType == "L2RING" || groupType == "L3RING") {
		tempNodeInfo = tempNode.Ring;
		tempColor = "#FF7171";
		// 2차 링 정보
		if (groupType == "L2RING") {
			tempNodeInfo.NETWORK_ID = tempNodeInfo.RING_ID_L2;
			tempNodeInfo.NETWORK_NM = tempNodeInfo.RING_NM_L2;
		} 
		// 3차 링 정보
		if (groupType == "L3RING") {
			tempNodeInfo.NETWORK_ID = tempNodeInfo.RING_ID_L3;
			tempNodeInfo.NETWORK_NM = tempNodeInfo.RING_NM_L3;
			// 2차링의 노드의 그룹 id를 변경해줌
			tempNode.group = "L2RING" + tempNode.Ring.RING_ID_L2;
		}
		category = "RING";
	}
	else if (groupType == "WDM_TRUNK") {
		tempNodeInfo = tempNode.WdmTrunk;
		tempColor = "#3A8B3A";
	}
	

	tempKey = groupType + tempNodeInfo.NETWORK_ID;
	
	// 트렁크 안의 링 노드
	teamsNode = new TeamsNode();
	teamsNode.key = tempKey;
	teamsNode.isGroup = true;
	teamsNode.category = category;
	teamsNode.expanded = false;
	var networkNm = tempNodeInfo.NETWORK_NM;
	teamsNode.NETWORK_NM_TOOLTIP = networkNm;
	teamsNode.NETWORK_NM = nmCunt(networkNm);
	
	teamsNode.NETWORK_ID = tempNodeInfo.NETWORK_ID;
	teamsNode.PATH_SAME_NO = tempNodeInfo.PATH_SAME_NO;
	teamsNode.color = tempColor;
	teamsNode.group = tempNode.group;
	
	var object = nodeDataArray.splice(idx, copyNodeDataArray.length - idx); 
	nodeDataArray.push(teamsNode);
	for(var i = 0; i < object.length; i++) {
		nodeDataArray.push(object[i]);
	}
	
}

function generateLinks() {
	var fromKey = -1;
	var toKey = null;
	
	var count = nodeDataArray.length;
	var prevNode = null;
	var curNode = null;
	
	/*
	 * 1. [수정] RU광코어 링/예비선번 사용
	 *    1) 트렁크 : 링, WDM 트렁크 사용이 가능
	 *    2) 링 : 링, WDM 트렁크 사용이 가능
	 *    위의 정보를 바탕으로 계층적인 그룹이 생성가능하기 때문에 링크 연결시 해당 기준으로 링크를 연결함
	 *    groupId - 난수 : 노드/서비스회선/트렁크/링/WDM트렁크일 수 있음
	 *                    => isGroup == true && key - TRUNK~ : 서비스 소속의 트렁크
	 *                    => isGroup == true && key - RING~ : 서비스/트렁크/링 소속의 링 
	 *                    => isGroup == true && key - WDM_TRUNK~ : 서비스/트렁크/링 소속의 WDM트렁크 
	 *            - TRUNK~ : 서비스 소속의 트렁크에 속하는 노드/링/WDM트렁크일 수 있음
	 *            		  => isGroup == true && key - RING~ : 서비스/트렁크 소속의 링 
	 *            		  => isGroup == true && key - L2RING~ : 서비스/트렁크/링 소속의 링 
	 *            		  => isGroup == true && key - L3RING~ : 서비스/트렁크/링 소속의 링에 속한 링 
	 *                    => isGroup == true && key - WDM_TRUNK~ : 서비스/트렁크/링 소속의 WDM트렁크 
	 *            - RING~ : 서비스/트렁크/링소속의 링에 속하는 노드/WDM트렁크/링일 수 있음
	 *            		  => isGroup == true && key - RING~ : 서비스/트렁크 소속의 링 	
	 *            		  => isGroup == true && key - L2RING~ : 서비스/트렁크/링 소속의 링 
	 *            		  => isGroup == true && key - L3RING~ : 서비스/트렁크/링 소속의 링에 속한 링 
	 *                    => isGroup == true && key - WDM_TRUNK~ : 트렁크 소속의 링에 속한 WDM트렁크
	 *            - WDM_TRUNK~ : 트렁크/링 소속의 WDM트렁크소속 노드임
	 *                    => isGroup == true : 트렁크/링 소속 WDM트렁크     
	 */
	
	// G : 그룹노드, GN : 그룹소속노드, S : 서비스회선, T : 트렁크, ST:서비스소속 트렁크, STR : 서비스-트렁크소속 링
	// , STW : 서비스에 속하는 트렁크에 속하는 WDM트렁크그룹, STRW :  서비스/트렁크에 Ring에 속하는 WDM트렁크그룹	
	// , STRR/STRRR : 서비스/트렁크/링 소속의 링
	var nodeType = "N";  
	
	var lastGroupId = null;  // 마지막 그룹
	var lastServiceGroupId = null; // 마지막 트렁크 그룹
	var lastTrunkGroupId = null; // 마지막 트렁크 그룹
	var lastRingGroupId = null; // 마지막 링 그룹
	var lastRingGroupIdL2 = null; // 마지막 2차링 그룹
	var lastRingGroupIdL3 = null; // 마지막 3차링 그룹
	var lastWdmGroupId = null; // 마지막 WDM트렁크 그룹	
	
	for ( var idx = 0; idx < count; idx++) {
		var tempNode = nodeDataArray[idx];		
		
		// 그룹노드가 아닌경우
		if (!tempNode.isGroup) {
			curNode = tempNode;	
			if (tempNode.isNetworkNode()) { nodeType = "GN"; }
			else { nodeType = "N"; }
		}
		// 그룹노드인 경우(그룹정보를 가지고 있는 노드) 시작
		else {
			// 1. 서비스그룹인경우
			if (tempNode.category == "SERVICE") { nodeType = "S" }
			// 1. 트렁크그룹인경우
			else if (tempNode.category == "TRUNK") {
				if (tempNode.key.indexOf("TRUNK") == 0) { nodeType = "ST" ; }  // 서비스 소속 트렁크인경우				
				else {	nodeType = "T";	}   // 자체트렁크
			}
			// 2. 링그룹인경우
			else if (tempNode.category == "RING") {				
				if (tempNode.key.indexOf("RING") == 0) {  // 서비스/트렁크 소속 링인경우					
					if (tempNode.group.indexOf("TRUNK") == 0) { nodeType = "STR"; }  // 서비스 소속의 트렁크에 속하는 링 
					else  { nodeType = "GR"; }   // 서비스/트렁크 소속의 링 
				}				
				// 2차링
				else if (tempNode.key.indexOf("L2RING") == 0) { // 링 소속 링인경우	
					nodeType = "STRR";
				}
				// 3차링
				else if (tempNode.key.indexOf("L3RING") == 0) { // 링 소속 링인경우	
					nodeType = "STRRR";
				}
				else {nodeType = "R"; } // 자체링인경우
			}
			// 3. WDM트렁크인 경우
			else if (tempNode.category == "WDM_TRUNK") {				
				if (tempNode.key.indexOf("WDM_TRUNK") == 0) {  // 서비스/트렁크/링 소속 링인경우					
					if (tempNode.group.indexOf("TRUNK") == 0) {nodeType = "STW";	} // 서비스에 속하는 트렁크에 속하는 WDM트렁크그룹
					else if (tempNode.group.indexOf("RING") == 0) {nodeType = "STRW";	} // 서비스/트렁크에 Ring에 속하는 WDM트렁크그룹					
					else { nodeType = "GW"; } // 자체 서비스/트렁크/링에 소속 WDM트렁크					
				}				
				else { nodeType = "W";} // 단독 WDM트렁크
			}
		} // 그룹노드인 경우 끝
		
		
		// 각 노드의 타입별 fromKey /toKey 를 설정한다
		curNode = tempNode;
		
		// fromKey 설정
		if(prevNode == null) {
    		fromKey = -1;
    	} else {
    		fromKey = prevNode.key;
    	}
		// 이전 그룹ID가 있고 현재 노드가 속한 그룹과 이전 그룹이 다르면 해당 그룹 ID가 fromKey가 되어야 함
		if (lastGroupId != null && lastGroupId != nullToEmpty(curNode.group)) {
			// 단일노드 / 단일 네트워크 라면
			if (nodeType == "N" || nodeType == "W" || nodeType == "R" || nodeType == "T" || nodeType == "S") {
				lastGroupId = (lastServiceGroupId !=null ? lastServiceGroupId : (lastTrunkGroupId != null ? lastTrunkGroupId : (lastRingGroupId != null ? lastRingGroupId : lastWdmGroupId)));
			}
			// 마지막 그룹노드가 2차링이나 3차 링인 경우
			else if (lastGroupId.indexOf("L2RING") == 0 || lastGroupId.indexOf("L3RING") == 0 )  {
				// 마지막 그룹이 3차링이었고 해당 노드가 그 상위 2차링에 속하지 않는 경우 
				if ( lastGroupId.indexOf("L3RING") == 0  && lastRingGroupIdL2 != nullToEmpty(curNode.group)) {
					// 1차링에 속하지 않는다면 그 상위 그룹에 속하는 것으로 마지막 그룹은 링이 되어야 함
					if (lastRingGroupId != nullToEmpty(curNode.group)) {
						lastGroupId = lastRingGroupId;
					} 
					// 1차링에 속한다면 2차그룹이 마지막 그룹임
					else {
						lastGroupId = lastRingGroupIdL2;
					}
				}
				// 마지막 그룹이 2차링이고 해당노드가 그 상위 1차링에 속하지 않는경우
				else if (lastGroupId.indexOf("L2RING") == 0  && lastRingGroupId != nullToEmpty(curNode.group)) {
					lastGroupId = lastRingGroupId;
				}
			}
			
			fromKey = lastGroupId;
		}
		
		// toKey 설정
		toKey = curNode.key;
		if (fromKey != -1) {
			linkDataArray.push( {from : fromKey, to: toKey} );
		}
		
		prevNode = curNode;
		
		/* 각 그룹의 id를 노드 타입에 맞추서 설정 */
		// 그룹소속 노드가 아닌경우 이전 모든 그룹은 없는것임.
		if (nodeType == "N") {
			lastServiceGroupId = null;
			lastTrunkGroupId = null;
    		lastRingGroupId = null;
    		lastRingGroupIdL2 = null;
    		lastRingGroupIdL3 = null;
    		lastWdmGroupId = null;
    		lastGroupId = null;
		} 
		// 그룹소속 노드임
		else {
			// WDM에 대해 정리
			if (nodeType == "W" || nodeType == "STW" || nodeType == "STRW" || nodeType == "GW") {
				lastWdmGroupId = curNode.key;   // 새로운 WDM 트렁크임
				lastGroupId = lastWdmGroupId;
	    		prevNode = null;
	    		
	    		// 자체WDM트렁크가 다시 나온건 서비스/트렁크/링는 끝났다는 의미
	    		if (nodeType == "W") {	    			
	    			lastServiceGroupId = null;			
					lastTrunkGroupId = null;
					lastRingGroupId = null;
					lastRingGroupIdL2 = null;
					lastRingGroupIdL3 = null;
	    		}
			}
			// RING에 대해 정리
			else if (nodeType == "R" || nodeType == "STR" || nodeType == "GR" || nodeType == "STRR" || nodeType == "STRRR") {
				// 2차 3차 링이 아닌경우
				if (nodeType != "STRR" && nodeType != "STRRR") {
				lastRingGroupId = curNode.key;   // 새로운 Ring임
				lastGroupId = lastRingGroupId;
				} else if (nodeType == "STRR") {
					lastRingGroupIdL2 = curNode.key;   // 새로운 2차Ring임
					lastGroupId = lastRingGroupIdL2;
				} else if (nodeType == "STRRR") {
					lastRingGroupIdL3 = curNode.key;   // 새로운 3차Ring임
					lastGroupId = lastRingGroupIdL3;
				}
				
	    		prevNode = null;
	    		
	    		// 자체 Ring이 다시 나온건 서비스/트렁크/WDM트렁크는 끝났다는 의미
	    		if (nodeType == "R") {	    			
	    			lastServiceGroupId = null;			
					lastTrunkGroupId = null;
					lastRingGroupIdL2 = null;  // 2차 링
					lastRingGroupIdL3 = null;  // 3차 링
					lastWdmGroupId = null;
	    		}
			}
			// Trunk에 대해 정리
			else if (nodeType == "T" || nodeType == "ST" ) {
				lastTrunkGroupId = curNode.key;   // 새로운 Trunk임
				lastGroupId = lastTrunkGroupId;
	    		prevNode = null;
	    		
	    		// 자체 Trunk가 다시 나온건 서비스/Ring/WDM트렁크는 끝났다는 의미
	    		if (nodeType == "T") {	    			
	    			lastServiceGroupId = null;			
	    			lastRingGroupId = null;
					lastRingGroupIdL2 = null;  // 2차 링
					lastRingGroupIdL3 = null;  // 3차 링
					lastWdmGroupId = null;
	    		}
			}
			// Service에 대해 정리
			else if (nodeType == "S" ) {
				lastServiceGroupId = curNode.key;   // 새로운 Trunk임
				lastGroupId = lastServiceGroupId;
	    		prevNode = null;
	    				
	    		// 자체 Service가 다시 나온건 Trunk/Ring/WDM트렁크는 끝났다는 의미
	    		lastTrunkGroupId = null;			
    			lastRingGroupId = null;
				lastRingGroupIdL2 = null;  // 2차 링
				lastRingGroupIdL3 = null;  // 3차 링
				lastWdmGroupId = null;
			}
			// 그룹에 속하는 노드인경우 만약 fromKey 와 lastGroupId가 같다는건 어떤 그룹이 끝났다는 의미 이기 때문에 그룹id의 정리가 필요함
			else if (fromKey == lastGroupId) {
				// 마지막 그룹이 WDM 소속인 경우
	    		if (lastGroupId == lastWdmGroupId) {
	    			lastWdmGroupId = null;
	    			lastGroupId = (lastRingGroupIdL3 != null ? lastRingGroupIdL3 
	    					                                 : (lastRingGroupIdL2 != null ? lastRingGroupIdL2 
	    					                                 : (lastRingGroupId !=null ? lastRingGroupId 
	    					                                 : (lastTrunkGroupId != null ? lastTrunkGroupId 
	    					                                 : (lastServiceGroupId != null ? lastServiceGroupId : null))))) ;
	    		}
	    		// 마지막 그룹이 3차링 소속인 경우
	    		else if (lastGroupId == lastRingGroupIdL3) {
	    			lastWdmGroupId = null;
	    			lastRingGroupIdL3 = null;
	    			// 2차 링이 NULL이 아니고 해당 노드가 2차링 소속인 경우
	    			if (lastRingGroupIdL2 != null) {
	    				if (lastRingGroupIdL2 == curNode.group) {
	    					lastGroupId = lastRingGroupIdL2;
	    				} else {
	    					lastRingGroupIdL2 = null;  // 2차 링 그룹ID 초기화 => 현재 노드가 3차 링 다음이면서 마지막 2차링 소속이 아니라면 링소속 혹은 상위 그룹 소속일 것임 그렇기 때문에 마지막 2차링을 초기화함
	    					// 2차소속의 노드가 아닌경우 링 소속의 노드인지 체크
	    					if (lastRingGroupId == curNode.group) {
	    						lastGroupId = lastRingGroupId;
	    					} else {
	    						lastRingGroupId = null; // 링 그룹ID 초기화 => 현재 노드가 3차 링 다음이면서 마지막 2차링 소속이 아니고 링소속이 아니라면 상위 그룹 소속일 것임 그렇기 때문에 마지막 2차링을 초기화함
		    					lastGroupId = (lastTrunkGroupId !=null ? lastTrunkGroupId : (lastServiceGroupId != null ? lastServiceGroupId : null));
	    					}
	    				}
	    			} else {
	    			lastGroupId = (lastRingGroupId !=null ? lastRingGroupId : (lastTrunkGroupId != null ? lastTrunkGroupId : (lastServiceGroupId != null ? lastServiceGroupId : null))) ;
	    		} 
	    			
	    		} 
	    		// 마지막 그룹이 2차 링 소속인 경우
	    		else if (lastGroupId == lastRingGroupIdL2) {
	    			lastWdmGroupId = null;
	    			lastRingGroupIdL3 = null;
	    			lastRingGroupIdL2 = null;
	    			//  링이 NULL이 아니고 해당 노드가 링 소속인 경우
	    			if (lastRingGroupId != null) {
	    				if (lastRingGroupId == curNode.group) {
	    					lastGroupId = lastRingGroupId;
	    				} else {
	    					lastRingGroupId = null;
	    					lastGroupId = (lastTrunkGroupId !=null ? lastTrunkGroupId : (lastServiceGroupId != null ? lastServiceGroupId : null));
	    				}
	    			} else {
		    			lastGroupId = (lastTrunkGroupId !=null ? lastTrunkGroupId : (lastServiceGroupId != null ? lastServiceGroupId : null));
	    			}
	    		} 
	    		// 마지막 그룹이 링 소속인 경우
	    		else if (lastGroupId == lastRingGroupId) {
	    			lastWdmGroupId = null;
	    			lastRingGroupIdL3 = null;
	    			lastRingGroupIdL2 = null;
	    			lastRingGroupId = null;
	    			lastGroupId = (lastTrunkGroupId !=null ? lastTrunkGroupId : (lastServiceGroupId != null ? lastServiceGroupId : null));
	    		} 
	    		// 마지막 그룹이 트렁크 인경우
	    		else if (lastGroupId == lastTrunkGroupId) {
	    			lastWdmGroupId = null;
	    			lastRingGroupIdL3 = null;
	    			lastRingGroupIdL2 = null;
	    			lastRingGroupId = null;
	    			lastTrunkGroupId = null;
	    			lastGroupId = (lastServiceGroupId !=null ? lastServiceGroupId : null);
	    		} 
	    		// 마지막 그룹이 서비스인경우 
	    		else {
	    			lastWdmGroupId = null;
	    			lastRingGroupIdL3 = null;
	    			lastRingGroupIdL2 = null;
	    			lastRingGroupId = null;
	    			lastTrunkGroupId = null;
	    			lastServiceGroupId = null;
	    			lastGroupId = null;
	    		}		    		
			}
		}
	}
	
}

/************************************************************************************************
 * 이벤트 리스너
 ***********************************************************************************************/
/**
 * 클릭 이벤트
 */
function setDiagramClickEvent() {
	visualLinePath.addDiagramListener("ObjectDoubleClicked", 
			function(e) {
				var part = e.subject.part;
				
				if(part.data.category != undefined) {
					if(part.data.category == "TRUNK") {
						// 트렁크
//						cflineShowProgressBody();
//						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO}; // , "modifyYn" : false
//						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramData, 'GET', 'trunkSearch');
					} else if(part.data.category == "RING") {
						// RING
						cflineShowProgressBody();
						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO}; // , "modifyYn" : false
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramData, 'GET', 'ringSearch');
					} else if(part.data.category == "WDM_TRUNK") {
						// WDM트렁크
//						cflineShowProgressBody();
//						var paramData = {"ntwkLineNo" : part.data.NETWORK_ID, "ntwkLnoGrpSrno" : part.data.PATH_SAME_NO};	// , "modifyYn" : false
//						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramData, 'GET', 'wdmTrunkSearch');
					}
				}
			}
	);
	
	
}

/**
 * 버튼 이벤트
 */
function setButtonEventListener() {
	// FDF 구간 제외
	$('#exceptFdfNe').on('click', function(e){
		if ($("#wdmTrunkWkSpr").getCurrentTabIndex() != 1 ) {
			if($('#exceptFdfNe').is(':checked')) {
				teamsPath.removeFdfNode();
				teamsPath.removeCouplerNode();
			} else {
				teamsPath = new TeamsPath();
				teamsPath.fromTangoPath(originalPath);
			}
			
			reGenerationDiagram(false);
		}
    });
	
	// 전체펼치기/숨기기시 스케일 조정
	function checkDiagramWidth(tempDiv, tempLinePath, expYn) {
		// 노드의 사이즈에 맞추어 스케일 조정
		var tempDivWidth = Math.ceil($("#" + tempDiv).width());
		var tempLinePathWidth = Math.ceil(tempLinePath.documentBounds.width) + (expYn == "Y" ? 30 : 0) ;  // 전체펼치기 인경우 링크설 표시까지 하기 위해
		
		var vScale = tempLinePath.scale;
		
		// 접하기일때는 크기 조정
		if (expYn == "N") {
			if (vScale < 1) {
				vScale = 1;
			}
		}
		
		if (tempLinePathWidth > tempDivWidth ) {
			var tempScale = Math.ceil((tempDivWidth / tempLinePathWidth).toFixed(3) * 1000) / 1000;
			
			if ((tempScale > 0.0) && (tempScale < vScale)) {
				vScale = tempScale;
			}
		}
		
		//console.log(tempDivWidth);
		//console.log(tempLinePathWidth);
		//console.log(vScale);
		tempLinePath.scale = vScale;
	}
	
	// 전체 펼치기
	// 1. [수정] RU광코어 링/예비선번 사용
	$('#btnAllExpandOn').on('click', function(e){
		var tempLinePath = visualLinePath;
		var tempDiv = 'visualDiv';
		var tempNodeDataArray = nodeDataArray;
		var tempLinkDataArray = linkDataArray;
		
		if ($("#wdmTrunkWkSpr").getCurrentTabIndex() == 1 ) {
			tempLinePath = wdmTrunkSprDiagram;
			tempDiv = 'visualSprDiv';
			tempNodeDataArray = sprNodeDataArray;
			tempLinkDataArray = sprLinkDataArray;
		} 
		
		for(var idx = 0; idx < tempNodeDataArray.length; idx++ ) {
			var node = tempNodeDataArray[idx];
			node.expanded = true;
			
			if(node.isGroup) {
				nmCutIdx = 70;
				tempLinePath.findNodeForData(node).isSubGraphExpanded = true;
				node.NETWORK_NM = nmCunt(node.NETWORK_NM_TOOLTIP);
			}
		}
		
		tempLinePath.clear();
		tempLinePath.model = new go.GraphLinksModel(tempNodeDataArray, tempLinkDataArray);	
		
		setTimeout(function(){
			checkDiagramWidth(tempDiv, tempLinePath, "Y");
		}, 1500);
	});
	
	// 전체 숨기기
	// 1. [수정] RU광코어 링/예비선번 사용
	$('#btnAllExpandOff').on('click', function(e){
		var tempLinePath = visualLinePath;
		var tempDiv = 'visualDiv';
		var tempNodeDataArray = nodeDataArray;
		var tempLinkDataArray = linkDataArray;
		
		if ($("#wdmTrunkWkSpr").getCurrentTabIndex() == 1 ) {
			tempLinePath = wdmTrunkSprDiagram;
			tempDiv = 'visualSprDiv';
			tempNodeDataArray = sprNodeDataArray;
			tempLinkDataArray = sprLinkDataArray;
		} 
		
		for(var idx = 0; idx < tempNodeDataArray.length; idx++ ) {
			var node = tempNodeDataArray[idx];
			node.expanded = false;
			
			if(node.isGroup) {
				nmCutIdx = 10;
				tempLinePath.findNodeForData(node).isSubGraphExpanded = false;
				node.NETWORK_NM = nmCunt(node.NETWORK_NM_TOOLTIP);
			}
		}
		
		tempLinePath.clear();
		tempLinePath.model = new go.GraphLinksModel(tempNodeDataArray, tempLinkDataArray);
		
		setTimeout(function(){
			checkDiagramWidth(tempDiv, tempLinePath, "N");
		}, 1500);
	});
	
	$('#zoomsin').on('click', function(e){
		// 상위 레이어로
		if($("#wdmTrunkWkSpr").getCurrentTabIndex() == 1) {
			wdmTrunkSprDiagram.commandHandler.increaseZoom(1.25);
		} else {
			visualLinePath.commandHandler.increaseZoom(1.25);
		}
	});
	
	$('#zoomsout').on('click', function(e){
		// 하위 레이어로
		if($("#wdmTrunkWkSpr").getCurrentTabIndex() == 1) {
			wdmTrunkSprDiagram.commandHandler.decreaseZoom(0.8);
		} else {
			visualLinePath.commandHandler.decreaseZoom(0.8);
		}
	});
	
	// 그리드 데이터 다운로드
	$('#btnExportExcel').on('click', function(e) {
		var date = getCurrDate();
		var gridId = "teamsPathList";
		var worker = new ExcelWorker({
     		excelFileName : '선번 정보_' + date,
     		sheetList: [{
     			sheetName: '선번 정보_' + date,
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: false,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
	});
		
	
	// 인쇄
	// 1. [수정] RU광코어 링/예비선번 사용
	$('#btnPrint').on('click', function(e) {
		var tempLinePath = visualLinePath;
		var tempDiv = 'visualDiv';
		
		if ($("#wdmTrunkWkSpr").getCurrentTabIndex() == 1 ) {
			tempLinePath = wdmTrunkSprDiagram;
			tempDiv = 'visualSprDiv';
		}
		if(tempLinePath != null) {
//			window.print();
			popupWindow = window.open("", "_blank","width=1600,height=850");
			$a.block(self);
			popupWindow.onunload = function(){
				$a.unblock();
			}
			$(popupWindow.document.head).html($("<style/>").attr({type:"text/css"}).html("@page {size:landscape;}"));
			
			
			// Diagram 사이즈에 맞추어 인쇄크기 조절
			// div 영역크기 / Diagram 크기로 스케일 설정
			var vScale = tempLinePath.scale;
			var tempDivWidth = Math.ceil($("#" + tempDiv).width());
			var tempDiagramWidth = Math.ceil(tempLinePath.documentBounds.width);
			
			if (tempDiagramWidth > tempDivWidth) {
				vScale = Math.ceil((tempDivWidth / tempDiagramWidth).toFixed(2) * 100) / 100;
			}
			
			var $visualDiv = tempLinePath.makeImage(
					{
						  scale: vScale
//						, maxSize: new go.Size(Infinity, Infinity)
						, type: 'image/png'
					}
			);
			$(popupWindow.document.body).html(
					// 내용
					$("<div style='float:center;width:100%;margin-left:50px'/>").html($($visualDiv)).get(0).outerHTML
			);
						
			setTimeout(function(){
				popupWindow.print();
				popupWindow.close();
			},100);
			
		}
	});
	
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

	// 선번 시각화 편집
	$('#btnPahViaualEdit').on('click', function(e) {	
		if(typeof initParam.svlnLclCd  != "undefined" && typeof initParam.svlnSclCd  != "undefined") {
			serviceLineVisual();
		} else if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "002") {
			trunkVisual();
		} else if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001") {
			ringVisual();
		} else if(typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "003" && initParam.topoSclCd == "101") {
			wdmTrunkVisual();
		}
	});
	
	// 선번 재검색 편집
	$('#btnDetailResearch').on('click', function(e) {	
		searchParam.wkSprDivCd = "01";
		cflineHideProgressBody();
		// 서비스회선인 경우
		if (isServiceLine()) {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParam, 'GET', 'selectLinePath');
		} else {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath');
		}
	});
	

	// 2019-09-30  5. 기간망 링 선번 고도화
	// 모든 경유링 표시
	$('#cascadingRingDisplay, #cascadingRingDisplaySpr').on('click', function(e) {	
		var editTeamsGrid =  teamsGridId;
		var editTangoGrid =  tagngoGridId;
		var gridType = "M";  // 주선번
		var editRontChkBox = "rontTrunkDisplay";
		// 예비선번의 모든 경유링 표시를 클릭한 경우
		if (this.id == "cascadingRingDisplaySpr") {
			editTeamsGrid =  teamsSrpGridId;
			gridType = "S";
			editRontChkBox = "rontTrunkDisplaySpr";
		}
		if($('#' + this.id).is(':checked')) {
			if (isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == true) {
				$('#'+editTeamsGrid).alopexGrid('showCol', ['CASCADING_RING_NM_3']);
				if (gridType == "M") {
					$('#'+editTangoGrid).alopexGrid('showCol', ['CASCADING_RING_NM_3']);
				} 
			} else {
				$('#'+editTeamsGrid).alopexGrid('showCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
				if (gridType == "M") {
					$('#'+editTangoGrid).alopexGrid('showCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
				}
			}

			// 기간망 트렁크
			if (gridType == "M") {
				$("#rontTrunkDisplayCheckbox").show();
			} else {
				$("#rontTrunkDisplaySprCheckbox").show();
			}
		} else {
			if (isAbleViaRing(nullToEmpty(initParam.topoSclCd)) == true) {
				$('#'+editTeamsGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_3']);
				if (gridType == "M") {
					$('#'+editTangoGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_3']);
				}
			} else {
				$('#'+editTeamsGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
				if (gridType == "M") {
					$('#'+editTangoGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
				}
			}
		
			// 모든경유링 보기가 해지되면 경유링 보기도 체크해제하고 숨기기
			if($('#' + editRontChkBox).is(':checked')) {
				$('#' + editRontChkBox).click();
			}
			if (gridType == "M") {
				$("#rontTrunkDisplayCheckbox").hide();
			} else {
				$("#rontTrunkDisplaySprCheckbox").hide();
			}
		}
		$('#'+editTeamsGrid).alopexGrid("updateOption", { fitTableWidth: true });
		if (gridType == "M") {
			$('#'+editTangoGrid).alopexGrid("updateOption", { fitTableWidth: true });
		}
	});
	
	$('#btnOpenerSeach').on('click', function(e){
		if (nullToEmpty(opener) != "" &&  $('#btnSearch' , opener.document).val() != undefined) {
			$('#btnSearch' , opener.document).click();
		}
	});

	// 2019-09-30  5. 기간망 링 선번 고도화
	// 기간망 트렁크 표시
	$('#rontTrunkDisplay, #rontTrunkDisplaySpr').on('click', function(e){
		var editTeamsGrid =  teamsGridId;
		var editTangoGrid =  tagngoGridId;
		var gridType = "M";  // 주선번
		// 예비선번의 모든 경유링 표시를 클릭한 경우
		if (this.id == "rontTrunkDisplaySpr") {
			editTeamsGrid =  teamsSrpGridId;
			gridType = "S";
		}
		if($('#' + this.id).is(':checked')) {
			$('#'+editTeamsGrid).alopexGrid('showCol', ['RONT_TRK_NM']);
			if (gridType == "M") {
				$('#'+editTangoGrid).alopexGrid('showCol', ['RONT_TRK_NM']);
			} 
		} else {
			$('#'+editTeamsGrid).alopexGrid('hideCol', ['RONT_TRK_NM']);
			if (gridType == "M") {
				$('#'+editTangoGrid).alopexGrid('hideCol', ['RONT_TRK_NM']);
			} 
		}
		$('#'+editTeamsGrid).alopexGrid("updateOption", { fitTableWidth: true });
		if (gridType == "M") {
			$('#'+editTangoGrid).alopexGrid("updateOption", { fitTableWidth: true });
		} 
	});
}

/************************************************************************************************
 * 팝업 
 ***********************************************************************************************/
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
 * 서비스 회선 시각화
 */
function serviceLineVisual() {
	var url = getUrlPath()  +'/configmgmt/cfline/ServiceLineInfoPopNew.do';
	var width = 1400;
	var height = 940;
	initParam.sFlag = "Y";
	
	$a.popup({
		popid: "ServiceLineInfoPopNew",
		title: '서비스회선 시각화',
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
 * 트렁크 시각화
 */
function trunkVisual() {
	var url = getUrlPath() +'/configmgmt/cfline/TrunkInfoPopNew.do';
	var width = 1400;
	var height = 940;
	initParam.sFlag = "Y";
	
	$a.popup({
		popid: "TrunkInfoPopNew",
		title: '트렁크 시각화',
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
 * 링 시각화
 */
function ringVisual() {
	var url = getUrlPath() +'/configmgmt/cfline/RingInfoPopNew.do';
	var width = 1400;
	var height = 940;
	initParam.sFlag = "Y";
	
	$a.popup({
		popid: "RingInfoPopNew",
		title: '링 시각화',
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

/**
 * wdm트렁크 상세
 */
function wdmTrunkVisual() {
	var url = getUrlPath() +'/configmgmt/cfline/WdmTrunkDetailPop.do';
	var width = 1600;
	var height = 940;
	
	$a.popup({
		popid: "WdmTrunkDetailPop",
		title: 'WDM 트렁크 상세',
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
 * 기능
 ***********************************************************************************************/
function nmCunt(networkNm) {
	if(networkNm.length > nmCutIdx) {
		networkNm = networkNm.substring(0, nmCutIdx) + "...";
	} 
	return networkNm;
}
