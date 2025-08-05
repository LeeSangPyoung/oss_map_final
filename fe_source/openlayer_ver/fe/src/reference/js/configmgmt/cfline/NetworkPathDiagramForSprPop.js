/**
 * NetworkPathDiagramForSprPop.js
 *
 * NetworkPathDiagramPop.jsp 에서 호출한다.
 * 
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 * 
 *  
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-09-12  2. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2019-10-21  3. 기간망 링 선번 고도화 : 링 재사용으로 링 그룹에 2차 3차 링 표시
 */

var wdmTrunkSprOriginal = null;

/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsPathSpr = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsPathSprData = null;


/**
 * TEAMS 선번의 사용 네트워크 구간은 양 끝 노드만 포함하는 선번
 */
var teamsShortPathSprData = null;


/**
 * WDM트렁크 예비 선번
 */
var wdmTrunkSprDiagram;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var sprNodeDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var sprLinkDataArray = [];

var originalSprPath = null;

/**
 * 1. [수정] RU광코어 링/예비선번 사용
 */


//2018-09-12  3. RU고도화
/**
* 사용서비스회선의 그룹핑을 위한 아이디 
*/
var useSprServiceId = null;

/**
 * 사용예비선번트렁크의 그룹핑을 위한 아이디 
 */
var useSprTrunkNetworkId = null;

/**
 * 사용예비선번링의 그룹핑을 위한 아이디
 */
var useSprRingNetworkId = null;

/**
 * 사용예비선번링의 2차링 그룹핑을 위한 아이디
 */
var useSprRingNetworkIdL2 = null;

/**
 * 사용예비선번링의 3차링 그룹핑을 위한 아이디
 */
var useSprRingNetworkIdL3 = null;

/**
 * 사용예비선번WDM트렁크의 그룹핑을 위한 아이디
 */
var useSprWdmTrunkNetworkId = null;


$a.page(function() {
	
	this.init = function(id, param) {
		$("#wdmTrunkWkSpr").on("tabchange", function(e,index){
			if(index == 0){
				$("#teamsPathList").alopexGrid("viewUpdate");
			} else if(index == 1){
				cflineShowProgressBody();
				reserveNetworkPath(wdmTrunkSprOriginal);
				// 예비선번 조회
				$('#'+teamsSrpGridId).alopexGrid("updateOption", { height: 200});
				$("#teamsSprPathList").alopexGrid("viewUpdate");
				// 선번이 없는경우 작업이 필요없음
				exceptFdfNe();
			}
		});
		
		// FDF 구간 제외
		$('#exceptFdfNe').on('click', function(e){
			if($("#wdmTrunkWkSpr").getCurrentTabIndex() == "1") {
				exceptFdfNe();
			}
	    });
		
		// // 예비선번 그리드 데이터 다운로드
		$('#btnSprExportExcel').on('click', function(e) {
			var date = getCurrDate();
			var gridId = "teamsSprPathList";
			var worker = new ExcelWorker({
	     		excelFileName : '예비선번 정보_' + date,
	     		sheetList: [{
	     			sheetName: '예비선번 정보_' + date,
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
		
	};
});

function exceptFdfNe() {
	if($('#exceptFdfNe').is(':checked')) {
		teamsPathSpr.removeFdfNode();
	} else {
		teamsPathSpr = new TeamsPath();
		if (originalSprPath != null) {
			teamsPathSpr.fromTangoPath(originalSprPath);
		}
	}
	
	// shortpath 재생성
	teamsPathSprData = teamsPathSpr.toData();
	teamsShortPathSprData = teamsPathSpr.toShortPath();
	
	// 그리드
	$('#teamsSprPathList').alopexGrid('dataSet', teamsPathSprData.NODES);
	
	sprNodeDataArray = [];
	sprLinkDataArray = [];
	generateSprDiagram();
}

function reserveNetworkPath(data) {
	// reset
	sprNodeDataArray = [];
	sprLinkDataArray = [];
	teamsPathSprData = null;
	teamsShortPathSprData = null;
	teamsPathSpr = new TeamsPath();
	$('#teamsSprPathList').alopexGrid("dataEmpty");
	$("#sprDiv").remove();
	$("#visualSprDiv").append("<div id=\"sprDiv\" style=\"width:100%; height:40vh; vertical-align: center;\"></div>");

	sprNodeDataArray = [];
	sprLinkDataArray = [];
	
	initSprTrunkDiagram();
	
	if(data != null) {
		originalSprPath = data;
		teamsPathSpr.fromTangoPath(data);
		teamsPathSprData = teamsPathSpr.toData();
		teamsShortPathSprData = teamsPathSpr.toShortPath();
		
		generateSprDiagram();
		
		initGridNetworkPath('teamsSprPathList');
		$('#teamsSprPathList').alopexGrid('dataSet', teamsPathSprData.NODES);
	} else {
		initGridNetworkPath('teamsSprPathList');
	}
	
	cflineHideProgressBody();
	
}

function initSprTrunkDiagram() {
	wdmTrunkSprDiagram =
		$go(go.Diagram, "sprDiv",
	        {
			  maxSelectionCount: 0,
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
	          "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom
	          //,isReadOnly: true
	          , isEnabled: true
	        }
		);
	
	makeSprNodeTemplate();
	makeSprLinkTemplate();
	
	//setSprDiagramClickEvent();
	
	wdmTrunkSprDiagram.allowDelete = false;
}

/**
 * 노드 템플릿
 */
function makeSprNodeTemplate() {
	var node = baseNodeTemplate();
	wdmTrunkSprDiagram.nodeTemplate = node;
	
	var group = baseGroupImageTemplate(wdmTrunkSprDiagram);

	wdmTrunkSprDiagram.groupTemplateMap.add("SERVICE", group);
	wdmTrunkSprDiagram.groupTemplateMap.add("TRUNK", group);
	wdmTrunkSprDiagram.groupTemplateMap.add("RING", group);
	wdmTrunkSprDiagram.groupTemplateMap.add("WDM_TRUNK", group);
}

/**
 * 링크 템플릿
 */
function makeSprLinkTemplate() {
	var link = baseLinkTemplate();
	wdmTrunkSprDiagram.linkTemplate = link;	
}

function generateSprDiagram() {
	generateSprNodes();
    generateSprLinks();
	
    wdmTrunkSprDiagram.clear();
    wdmTrunkSprDiagram.model = new go.GraphLinksModel(sprNodeDataArray, sprLinkDataArray);
}

// 예비선번 그룹노드
function groupSprNodeTeamsPath(node, network) {
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
	
	sprNodeDataArray.push(teamsNode);
	
	return groupGuid;
}

// 예비선번 노드
function generateSprNodes() {

	useSprServiceId = null;
	useSprTrunkNetworkId = null;
	useSprRingNetworkId = null;
	useSprRingNetworkIdL2 = null;
	useSprRingNetworkIdL3 = null;
	useSprWdmTrunkNetworkId = null;
	
	/**
	 * 1. [수정] RU광코어 링/예비선번 사용
	 */ 
	//for ( var idx = 0; idx < teamsShortPathSprData.NODES.length; idx++) {
	for ( var idx = 0; idx < teamsPathSpr.NODES.length; idx++) {
		//var node = teamsShortPathSprData.NODES[idx];
		var node = teamsPathSpr.NODES[idx];
		node.key = node.NODE_ID;
    	node.NODE_ID = node.NODE_ID;
    	node.NE_NM = node.Ne.makeNodeTitle();
    	node.NE_ID = node.Ne.NE_ID;
    	node.ORG_NM = node.Ne.ORG_NM;
    	
    	node.WEST_PORT_NM = node.BPortDescr.PORT_NM;
    	node.WEST_PORT_ID = node.BPortDescr.PORT_ID;
    	node.WEST_CHANNEL_DESCR = node.BPortDescr.CHANNEL_DESCR;
    	node.WEST_PORT_CHANNEL = node.BPortDescr.PORT_NM + node.BPortDescr.CHANNEL_DESCR;
    	
    	node.EAST_PORT_NM  =  node.APortDescr.PORT_NM;
    	node.EAST_PORT_ID  =  node.APortDescr.PORT_ID;
    	node.EAST_CHANNEL_DESCR = node.APortDescr.CHANNEL_DESCR;
    	node.EAST_PORT_CHANNEL = node.APortDescr.PORT_NM + node.APortDescr.CHANNEL_DESCR;
    	
    	node.NE_ROLE_CD = node.Ne.NE_ROLE_CD;
    	node.source = getEqpIcon(node.Ne.NE_ROLE_CD, "");
    	node.category = "NE";
    	node.color = "#BDBDBD";
    	
    	node.nodeTooltipText = node.toString();
    	
    	/**
    	 * 1. [수정] RU광코어 링/예비선번 사용
    	 */ 
    	// 그룹
    	/* 2018-09-12  3. RU고도화 */
    	if(node.isServiceNode()) {
    		if(useSprServiceId != node.Service.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupSprNodeTeamsPath(node, "Service");
    		}
    		node.group = groupGuid;
    		useSprServiceId = node.Service.NETWORK_ID;
    	}  
    	else if(node.isTrunkNode()) {
    		if(useSprTrunkNetworkId != node.Trunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupSprNodeTeamsPath(node, "Trunk");
    		}
    		node.group = groupGuid;
    		useSprTrunkNetworkId = node.Trunk.NETWORK_ID;
    	} else if(node.isRingNode()) {
    		if(useSprRingNetworkId != node.Ring.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupSprNodeTeamsPath(node, "Ring");
    		}
    		node.group = groupGuid;
    		useSprRingNetworkId = node.Ring.NETWORK_ID;
    	} else if(node.isWdmTrunkNode()) {
    		if(useSprWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupSprNodeTeamsPath(node, "WdmTrunk");
    		}
    		node.group = groupGuid;
    		useSprWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    	} 
    	
    	sprNodeDataArray.push( node );
	}
	
	/**
	 * 1. [수정] RU광코어 링/예비선번 사용
	 */	
	// 사용 네트워크 내의 사용 네트워크 확인
    var copySprNodeDataArray = sprNodeDataArray;
    for( var idx = 0; idx < copySprNodeDataArray.length; idx++) {
    	var node = copySprNodeDataArray[idx];
    	
    	/* 2018-09-12  3. RU고도화 */
    	// 사용 서비스회선에 속하는 노드인 경우
    	if(!node.isGroup && node.isServiceNode()) {
    		// 트렁크인 경우
    		if(node.isTrunkNode()) {
    			if(useSprTrunkNetworkId != node.Trunk.NETWORK_ID) {
    				// 서비스 안의 트렁크 노드
    				setInfoForGroupNodeSpr(node, "TRUNK", copySprNodeDataArray, idx);
    				idx++;
    			}
    			node.group =  "TRUNK" + node.Trunk.NETWORK_ID;
    			useSprTrunkNetworkId = node.Trunk.NETWORK_ID;
    		}
    		// 링인경우
    		if(node.isRingNode()) {
    			if(useSprRingNetworkId != node.Ring.NETWORK_ID) {
    				// 서비스회선 안의 링 노드
    				setInfoForGroupNodeSpr(node, "RING", copySprNodeDataArray, idx);
    				idx++;
    			}
    			// 2차 혹은 3차 그룹노드인 경우는 useRingNetworkId 값을 업데이트 하지 않는다.
    			if (useSprRingNetworkIdL2 != node.Ring.NETWORK_ID &&  useSprRingNetworkIdL3 != node.Ring.NETWORK_ID) {
    			node.group =  "RING" + node.Ring.NETWORK_ID;
    			useSprRingNetworkId = node.Ring.NETWORK_ID;
    		}

    			// 2019-10-21  4. 기간망 링 선번 고도화
        		// 2차링의 노드인지
        		if(nullToEmpty(node.Ring.RING_ID_L2) != "") {
        			if(useSprRingNetworkIdL2 != node.Ring.RING_ID_L2) {
        				// 링 안의 2차링 노드
        				setInfoForGroupNodeSpr(node, "L2RING", copySprNodeDataArray, idx);
        				idx++;
        			}
        			
        			node.group =  "L2RING" + node.Ring.RING_ID_L2;
        			useSprRingNetworkIdL2 = node.Ring.RING_ID_L2;

            		// 3차링의 노드인지
            		if(nullToEmpty(node.Ring.RING_ID_L3) != "") {
            			if(useSprRingNetworkIdL3 != node.Ring.RING_ID_L3) {
            				// 링 안의 2차링 노드
            				setInfoForGroupNodeSpr(node, "L3RING", copySprNodeDataArray, idx);
            				idx++;
            			}
            			node.group =  "L3RING" + node.Ring.RING_ID_L3;
            			useSprRingNetworkIdL3 = node.Ring.RING_ID_L3;
            		}
        		}
    		}
    		// WDM 트렁크인경우
    		if(node.isWdmTrunkNode()) {
    			if(useSprWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 서비스 안의 WDM트렁크 노드
    				setInfoForGroupNodeSpr(node, "WDM_TRUNK", copySprNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useSprWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		} 
    	}
    	// 사용 트렁크에 속하는 노드인경우
    	else if(!node.isGroup && !node.isServiceNode() && node.isTrunkNode()) {
    		if(node.isRingNode()) {
    			// 2차 3차 링의 그룹노드가 추가되어  그룹 노드에 대해 두번 작업이 이뤄지기도 함.
    			if(useSprRingNetworkId != node.Ring.NETWORK_ID && useSprRingNetworkIdL2 != node.Ring.NETWORK_ID &&  useSprRingNetworkIdL3 != node.Ring.NETWORK_ID) {
    				// 서비스회선 안의 링 노드
    				setInfoForGroupNodeSpr(node, "RING", copySprNodeDataArray, idx);
    				idx++;
    			}
    			// 2차 혹은 3차 그룹노드인 경우는 useRingNetworkId 값을 업데이트 하지 않는다.
    			if (useSprRingNetworkIdL2 != node.Ring.NETWORK_ID &&  useSprRingNetworkIdL3 != node.Ring.NETWORK_ID) {
    			node.group =  "RING" + node.Ring.NETWORK_ID;
    			useSprRingNetworkId = node.Ring.NETWORK_ID;
    		} 
    			// 2019-10-21  4. 기간망 링 선번 고도화
        		// 2차링의 노드인지
        		if(nullToEmpty(node.Ring.RING_ID_L2) != "") {
        			if(useSprRingNetworkIdL2 != node.Ring.RING_ID_L2) {
        				// 링 안의 2차링 노드
        				setInfoForGroupNodeSpr(node, "L2RING", copySprNodeDataArray, idx);
        				idx++;
        			}
        			
        			node.group =  "L2RING" + node.Ring.RING_ID_L2;
        			useSprRingNetworkIdL2 = node.Ring.RING_ID_L2;

            		// 3차링의 노드인지
            		if(nullToEmpty(node.Ring.RING_ID_L3) != "") {
            			if(useSprRingNetworkIdL3 != node.Ring.RING_ID_L3) {
            				// 링 안의 2차링 노드
            				setInfoForGroupNodeSpr(node, "L3RING", copySprNodeDataArray, idx);
            				idx++;
            			}
            			node.group =  "L3RING" + node.Ring.RING_ID_L3;
            			useSprRingNetworkIdL3 = node.Ring.RING_ID_L3;
            		}
        		}
    		} 
    		
    		if(node.isWdmTrunkNode()) {
    			if(useSprWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 트렁크 안의 WDM트렁크 노드
    				setInfoForGroupNodeSpr(node, "WDM_TRUNK", copySprNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useSprWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		}
    	} else if (!node.isGroup  && !node.isServiceNode() && !node.isTrunkNode() &&  node.isRingNode()) {
    		// 2019-10-21  4. 기간망 링 선번 고도화
    		// 2차링의 노드인지
    		if(nullToEmpty(node.Ring.RING_ID_L2) != "") {
    			if(useSprRingNetworkIdL2 != node.Ring.RING_ID_L2) {
    				// 링 안의 2차링 노드
    				setInfoForGroupNodeSpr(node, "L2RING", copySprNodeDataArray, idx);
    				idx++;
    			}
    			
    			node.group =  "L2RING" + node.Ring.RING_ID_L2;
    			useSprRingNetworkIdL2 = node.Ring.RING_ID_L2;

        		// 3차링의 노드인지
        		if(nullToEmpty(node.Ring.RING_ID_L3) != "") {
        			if(useSprRingNetworkIdL3 != node.Ring.RING_ID_L3) {
        				// 링 안의 2차링 노드
        				setInfoForGroupNodeSpr(node, "L3RING", copySprNodeDataArray, idx);
        				idx++;
        			}
        			node.group =  "L3RING" + node.Ring.RING_ID_L3;
        			useSprRingNetworkIdL3 = node.Ring.RING_ID_L3;
        		}
    		}
    		if(node.isWdmTrunkNode()) {
    			if(useSprWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 링 안의 WDM트렁크 노드
    				setInfoForGroupNodeSpr(node, "WDM_TRUNK", copySprNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useSprWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		}
	    }
    }	
	
	// rest seq
    for( var idx = 0; idx < sprNodeDataArray.length; idx++ ) {
    	sprNodeDataArray[idx].SEQ = idx + 1;
    }
}

/**
 *  2018-09-12  3. RU고도화
 *	전달받은 노드로 부터 그룹 타입별로 teamsNode를 생성하여 리턴  
 **/
function setInfoForGroupNodeSpr(tempNode, groupType, copySprNodeDataArray, idx) {
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
	else if (groupType == "RING"  || groupType == "L2RING" || groupType == "L3RING") {
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
	
	var object = sprNodeDataArray.splice(idx, copySprNodeDataArray.length - idx); 
	sprNodeDataArray.push(teamsNode);
	for(var i = 0; i < object.length; i++) {
		sprNodeDataArray.push(object[i]);
	}
}

function generateSprLinks() {
	var fromKey = null;
	var toKey = null;
	
	var count = sprNodeDataArray.length;
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
	
	var lastGroupIdSpr = null;  // 마지막 그룹
	var lastServiceGroupIdSpr = null; // 마지막 트렁크 그룹
	var lastTrunkGroupIdSpr = null; // 마지막 트렁크 그룹
	var lastRingGroupIdSpr = null; // 마지막 링 그룹
	var lastRingGroupIdSprL2 = null; // 마지막 2차링 그룹
	var lastRingGroupIdSprL3 = null; // 마지막 3차링 그룹
	var lastWdmGroupIdSpr = null; // 마지막 WDM트렁크 그룹	
	
	for ( var idx = 0; idx < count; idx++) {
		var tempNode = sprNodeDataArray[idx];		
		
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
		if (lastGroupIdSpr != null && lastGroupIdSpr != nullToEmpty(curNode.group)) {
			// 단일노드 / 단일 네트워크 라면
			if (nodeType == "N" || nodeType == "W" || nodeType == "R" || nodeType == "T" || nodeType == "S") {
				lastGroupId = (lastServiceGroupIdSpr !=null ? lastServiceGroupIdSpr : (lastTrunkGroupIdSpr != null ? lastTrunkGroupIdSpr : (lastRingGroupIdSpr != null ? lastRingGroupIdSpr : lastWdmGroupIdSpr)));
			} 
			// 마지막 그룹노드가 2차링이나 3차 링인 경우
			else if (lastGroupIdSpr.indexOf("L2RING") == 0 || lastGroupIdSpr.indexOf("L3RING") == 0 )  {
				// 마지막 그룹이 3차링이었고 해당 노드가 그 상위 2차링에 속하지 않는 경우 
				if ( lastGroupIdSpr.indexOf("L3RING") == 0  && lastRingGroupIdSprL2 != nullToEmpty(curNode.group)) {
					// 1차링에 속하지 않는다면 그 상위 그룹에 속하는 것으로 마지막 그룹은 링이 되어야 함
					if (lastRingGroupIdSpr != nullToEmpty(curNode.group)) {
						lastGroupIdSpr = lastRingGroupIdSpr;
					} 
					// 1차링에 속한다면 2차그룹이 마지막 그룹임
					else {
						lastGroupIdSpr = lastRingGroupIdSprL2;
					}
				}
				// 마지막 그룹이 2차링이고 해당노드가 그 상위 1차링에 속하지 않는경우
				else if (lastGroupIdSpr.indexOf("L2RING") == 0  && lastRingGroupIdSpr != nullToEmpty(curNode.group)) {
					lastGroupIdSpr = lastRingGroupIdSpr;
				}
			}
			fromKey = lastGroupIdSpr;
		}
		
		// toKey 설정
		toKey = curNode.key;

		if (fromKey != -1) {
			sprLinkDataArray.push( {from : fromKey, to: toKey} );
		}
		
		prevNode = curNode;
		
		/* 각 그룹의 id를 노드 타입에 맞추서 설정 */
		// 그룹소속 노드가 아닌경우 이전 모든 그룹은 없는것임.
		if (nodeType == "N") {
			lastServiceGroupIdSpr = null;
			lastTrunkGroupIdSpr = null;
    		lastRingGroupIdSpr = null;
    		lastRingGroupIdSprL2 = null;
    		lastRingGroupIdSprL3 = null;
    		lastWdmGroupIdSpr = null;
    		lastGroupIdSpr = null;
		} 
		// 그룹소속 노드임
		else {
			// WDM에 대해 정리
			if (nodeType == "W" || nodeType == "STW" || nodeType == "STRW" || nodeType == "GW") {
				lastWdmGroupIdSpr = curNode.key;   // 새로운 WDM 트렁크임
				lastGroupIdSpr = lastWdmGroupIdSpr;
	    		prevNode = null;
	    		
	    		// 자체WDM트렁크가 다시 나온건 서비스/트렁크/링는 끝났다는 의미
	    		if (nodeType == "W") {	    			
	    			lastServiceGroupIdSpr = null;			
					lastTrunkGroupIdSpr = null;
					lastRingGroupIdSpr = null;
		    		lastRingGroupIdSprL2 = null;
		    		lastRingGroupIdSprL3 = null;
	    		}
			}
			// RING에 대해 정리
			else if (nodeType == "R" || nodeType == "STR" || nodeType == "GR" || nodeType == "STRR" || nodeType == "STRRR") {
				// 2차 3차 링이 아닌경우
				if (nodeType != "STRR" && nodeType != "STRRR") {
				lastRingGroupIdSpr = curNode.key;   // 새로운 Ring임
				lastGroupIdSpr = lastRingGroupIdSpr;
				} else if (nodeType == "STRR") {
					lastRingGroupIdSprL2 = curNode.key;   // 새로운 2차Ring임
					lastGroupIdSpr = lastRingGroupIdSprL2;
				} else if (nodeType == "STRRR") {
					lastRingGroupIdSprL3 = curNode.key;   // 새로운 3차Ring임
					lastGroupIdSpr = lastRingGroupIdSprL3;
				}
	    		prevNode = null;
	    		
	    		// 자체 Ring이 다시 나온건 서비스/트렁크/WDM트렁크는 끝났다는 의미
	    		if (nodeType == "R") {	    			
	    			lastServiceGroupIdSpr = null;			
					lastTrunkGroupIdSpr = null;
		    		lastRingGroupIdSprL2 = null;
		    		lastRingGroupIdSprL3 = null;
					lastWdmGroupIdSpr = null;
	    		}
			}
			// Trunk에 대해 정리
			else if (nodeType == "T" || nodeType == "ST" ) {
				lastTrunkGroupIdSpr = curNode.key;   // 새로운 Trunk임
				lastGroupIdSpr = lastTrunkGroupIdSpr;
	    		prevNode = null;
	    		
	    		// 자체 Trunk가 다시 나온건 서비스/Ring/WDM트렁크는 끝났다는 의미
	    		if (nodeType == "T") {	    			
	    			lastServiceGroupIdSpr = null;			
	    			lastRingGroupIdSpr = null;
		    		lastRingGroupIdSprL2 = null;
		    		lastRingGroupIdSprL3 = null;
					lastWdmGroupIdSpr = null;
	    		}
			}
			// Service에 대해 정리
			else if (nodeType == "S" ) {
				lastServiceGroupIdSpr = curNode.key;   // 새로운 Trunk임
				lastGroupIdSpr = lastServiceGroupIdSpr;
	    		prevNode = null;
	    				
	    		// 자체 Service가 다시 나온건 Trunk/Ring/WDM트렁크는 끝났다는 의미
	    		lastTrunkGroupIdSpr = null;			
    			lastRingGroupIdSpr = null;
	    		lastRingGroupIdSprL2 = null;
	    		lastRingGroupIdSprL3 = null;
				lastWdmGroupIdSpr = null;
			}
			// 그룹에 속하는 노드인경우 만약 fromKey 와 lastGroupIdSpr가 같다는건 어떤 그룹이 끝났다는 의미 이기 때문에 그룹id의 정리가 필요함
			else if (fromKey == lastGroupIdSpr) {
				// 마지막 그룹이 WDM 소속인 경우
	    		if (lastGroupIdSpr == lastWdmGroupIdSpr) {
	    			lastWdmGroupIdSpr = null;
	    			lastGroupIdSpr = (lastRingGroupIdSprL3 != null ? lastRingGroupIdSprL3 
                            									: (lastRingGroupIdSprL2 != null ? lastRingGroupIdSprL2 
                            									: (lastRingGroupIdSpr !=null ? lastRingGroupIdSpr 
                            									: (lastTrunkGroupIdSpr != null ? lastTrunkGroupIdSpr 
                            									: (lastServiceGroupIdSpr != null ? lastServiceGroupIdSpr : null))))) ;
	    		} 
	    		// 마지막 그룹이 3차링 소속인 경우
	    		else if (lastGroupIdSpr == lastRingGroupIdSprL3) {
	    			lastWdmGroupIdSpr = null;
	    			lastRingGroupIdSprL3 = null;
	    			// 2차 링이 NULL이 아니고 해당 노드가 2차링 소속인 경우
	    			if (lastRingGroupIdSprL2 != null) {
	    				if (lastRingGroupIdSprL2 == curNode.group) {
	    					lastGroupIdSpr = lastRingGroupIdSprL2;
	    				} else {
	    					lastRingGroupIdSprL2 = null;  // 2차 링 그룹ID 초기화 => 현재 노드가 3차 링 다음이면서 마지막 2차링 소속이 아니라면 링소속 혹은 상위 그룹 소속일 것임 그렇기 때문에 마지막 2차링을 초기화함
	    					// 2차소속의 노드가 아닌경우 링 소속의 노드인지 체크
	    					if (lastRingGroupIdSpr == curNode.group) {
	    						lastGroupIdSpr = lastRingGroupIdSpr;
	    					} else {
	    						lastRingGroupIdSpr = null; // 링 그룹ID 초기화 => 현재 노드가 3차 링 다음이면서 마지막 2차링 소속이 아니고 링소속이 아니라면 상위 그룹 소속일 것임 그렇기 때문에 마지막 2차링을 초기화함
	    						lastGroupIdSpr = (lastTrunkGroupIdSpr !=null ? lastTrunkGroupIdSpr : (lastServiceGroupIdSpr != null ? lastServiceGroupIdSpr : null));
	    					}
	    				}
	    			} else {
	    			lastGroupIdSpr = (lastRingGroupIdSpr !=null ? lastRingGroupIdSpr : (lastTrunkGroupIdSpr != null ? lastTrunkGroupIdSpr : (lastServiceGroupIdSpr != null ? lastServiceGroupIdSpr : null))) ;
	    		} 
	    			
	    		} 
	    		// 마지막 그룹이 2차 링 소속인 경우
	    		else if (lastGroupIdSpr == lastRingGroupIdSprL2) {
	    			lastWdmGroupIdSpr = null;
	    			lastRingGroupIdSprL3 = null;
	    			lastRingGroupIdSprL2 = null;
	    			//  링이 NULL이 아니고 해당 노드가 링 소속인 경우
	    			if (lastRingGroupIdSpr != null) {
	    				if (lastRingGroupIdSpr == curNode.group) {
	    					lastGroupIdSpr = lastRingGroupIdSpr;
	    				} else {
	    					lastRingGroupIdSpr = null;
	    					lastGroupIdSpr = (lastTrunkGroupIdSpr !=null ? lastTrunkGroupIdSpr : (lastServiceGroupIdSpr != null ? lastServiceGroupIdSpr : null));
	    				}
	    			} else {
	    				lastGroupIdSpr = (lastTrunkGroupIdSpr !=null ? lastTrunkGroupIdSpr : (lastServiceGroupIdSpr != null ? lastServiceGroupIdSpr : null));
	    			}
	    		}
	    		// 마지막 그룹이 링 소속인 경우
	    		else if (lastGroupIdSpr == lastRingGroupIdSpr) {
	    			lastWdmGroupIdSpr = null;
	    			lastRingGroupIdSprL3 = null;
	    			lastRingGroupIdSprL2 = null;
	    			lastRingGroupIdSpr = null;
	    			lastGroupIdSpr = (lastTrunkGroupIdSpr !=null ? lastTrunkGroupIdSpr : (lastServiceGroupIdSpr != null ? lastServiceGroupIdSpr : null));
	    		} 
	    		// 마지막 그룹이 트렁크 인경우
	    		else if (lastGroupIdSpr == lastTrunkGroupIdSpr) {
	    			lastWdmGroupIdSpr = null;
	    			lastRingGroupIdSprL3 = null;
	    			lastRingGroupIdSprL2 = null;
	    			lastRingGroupIdSpr = null;
	    			lastTrunkGroupIdSpr = null;
	    			lastGroupIdSpr = (lastServiceGroupIdSpr !=null ? lastServiceGroupIdSpr : null);
	    		} 
	    		// 마지막 그룹이 서비스인경우 
	    		else {
	    			lastWdmGroupIdSpr = null;
	    			lastRingGroupIdSprL3 = null;
	    			lastRingGroupIdSprL2 = null;
	    			lastRingGroupIdSpr = null;
	    			lastTrunkGroupIdSpr = null;
	    			lastServiceGroupIdSpr = null;
	    			lastGroupIdSpr = null;
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
function setSprDiagramClickEvent() {
	wdmTrunkSprDiagram.addDiagramListener("ObjectDoubleClicked", 
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

