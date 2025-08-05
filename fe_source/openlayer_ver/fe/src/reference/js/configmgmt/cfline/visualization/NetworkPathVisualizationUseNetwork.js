/**
 * NetworkPathVisualizationUseNetwork.js
 *
 * @author Administrator
 * @date 2018.10.09.
 * @version 1.0
 */

/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsUseNetworkPath = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsUseNetworkPathData = null;

/**
 * 선번 원본
 */
var originalUseNetworkPath = null;

/**
 * gojs diagram
 */
var useNetworkDiagram;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeUseNetworkDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkUseNetworkDataArray = [];

/**
 * 다이어그램 init
 */
function initUseNetworkDiagram() {
	useNetworkDiagram =
		$go(go.Diagram, "useNetworkDiv",
	        {
//			  maxSelectionCount: 0,
			  layout:
	        	  $go(go.GridLayout,
			              {  
	        		  			wrappingWidth: Infinity, cellSize: new go.Size(4, 4), spacing: new go.Size(20, 20), wrappingColumn:4,
	        		  			alignment: go.GridLayout.Position,
//	        		  			arrangement: go.GridLayout.Location,
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
	          "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom
	        }
		);
	
	makeUseNetworkNodeTemplate();
	makeUseNetworkLinkTemplate();
//	setDiagramClickEvent();
	
	useNetworkDiagram.allowDelete = false;
	
	// 마우스 휠 막기
//	trunkDiagram.toolManager.standardMouseWheel = function() {
//		return;
//	}
}

function makeUseNetworkNodeTemplate() {
	setUseNetworkNodeTemplate();
	setUseNetworkGroupTemplate();
}

function generateUseNetworkDiagram() {
    generateUseNetworkNodes();
    generateUseNetworkLinks();
    
    useNetworkDiagram.model = new go.GraphLinksModel(nodeUseNetworkDataArray, linkUseNetworkDataArray);
	
    for(var idx = 0; idx < nodeUseNetworkDataArray.length; idx++) {
		var nodeData = nodeUseNetworkDataArray[idx];
		var node = useNetworkDiagram.findNodeForData(nodeData);
		
		node.selectionAdorned = false;
		node.movable = false;
	}
}

/*
 * 그룹노드 묶기
 * */
function groupNodeTeamsUseNetworkPath(node, network) {
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
	
	nodeUseNetworkDataArray.push(teamsNode);
	
	return groupGuid;
}

/**
 * 노드를 생성한다.
 */
function generateUseNetworkNodes() {
	useServiceIdForView = null;
	useTrunkNetworkIdForView = null;
	useWdmTrunkNetworkIdForView = null;
	useRingNetworkIdForView = null;
	
    for ( var idx = 0; idx < teamsUseNetworkPath.NODES.length; idx++) {
    	var node = teamsUseNetworkPath.NODES[idx];

    	node.key = node.NODE_ID;
    	node.NODE_ID = node.NODE_ID;
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
    	
    	// 그룹
        /* 2018-09-12  3. RU고도화 */
    	if(node.isServiceNode()) {
    		if(useServiceIdForView != node.Service.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsUseNetworkPath(node, "Service");
    		}
    		node.group = groupGuid;
    		useServiceIdForView = node.Service.NETWORK_ID;
    	}  
    	else if(node.isTrunkNode()) {
    		if(useTrunkNetworkIdForView != node.Trunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsUseNetworkPath(node, "Trunk");
    		}
    		node.group = groupGuid;
    		useTrunkNetworkIdForView = node.Trunk.NETWORK_ID;
    	} else if(node.isRingNode()) {
    		if(useRingNetworkIdForView != node.Ring.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsUseNetworkPath(node, "Ring");
    		}
    		node.group = groupGuid;
    		useRingNetworkIdForView = node.Ring.NETWORK_ID;
    	} else if(node.isWdmTrunkNode()) {
    		if(useWdmTrunkNetworkIdForView != node.WdmTrunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = groupNodeTeamsUseNetworkPath(node, "WdmTrunk");
    		}
    		node.group = groupGuid;
    		useWdmTrunkNetworkIdForView = node.WdmTrunk.NETWORK_ID;
    	}    	  	
    	
    	nodeUseNetworkDataArray.push( node );
    }
    
    // 사용 네트워크 내의 사용 네트워크 확인(2depth)
    var copyNodeDataArray = nodeUseNetworkDataArray;
    for( var idx = 0; idx < copyNodeDataArray.length; idx++) {
    	var node = copyNodeDataArray[idx];
    	
    	/* 2018-09-12  3. RU고도화 */
    	// 사용 서비스회선에 속하는 노드인 경우
    	if(!node.isGroup && node.isServiceNode()) {
    		// 서비스인 경우
    		/*if(node.isServiceNode()) {
    			if(useServiceIdForView != node.Service.NETWORK_ID) {
    				// 서비스 안의 서비스 노드
    				setInfoForGroupNode(node, "SERVICE", copyNodeDataArray, idx);
    			}
    			node.group =  "SERVICE" + node.Service.NETWORK_ID;
    			useServiceIdForView = node.Service.NETWORK_ID;
    		}*/
    		// 트렁크인 경우
    		if(node.isTrunkNode()) {
    			if(useTrunkNetworkIdForView != node.Trunk.NETWORK_ID) {
    				// 서비스 안의 트렁크 노드
    				setInfoForGroupNode(node, "TRUNK", copyNodeDataArray, idx);
    			}
    			node.group =  "TRUNK" + node.Trunk.NETWORK_ID;
    			useTrunkNetworkIdForView = node.Trunk.NETWORK_ID;
    		}
    		// 링인경우
    		if(node.isRingNode()) {
    			if(useRingNetworkIdForView != node.Ring.NETWORK_ID) {
    				// 서비스회선 안의 링 노드
    				setInfoForGroupNode(node, "RING", copyNodeDataArray, idx);
    			}
    			node.group =  "RING" + node.Ring.NETWORK_ID;
    			useRingNetworkIdForView = node.Ring.NETWORK_ID;
    		}
    		// WDM 트렁크인경우
    		if(node.isWdmTrunkNode()) {
    			if(useWdmTrunkNetworkIdForView != node.WdmTrunk.NETWORK_ID) {
    				// 서비스 안의 WDM트렁크 노드
    				setInfoForGroupNode(node, "WDM_TRUNK", copyNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useWdmTrunkNetworkIdForView = node.WdmTrunk.NETWORK_ID;
    		} 
    	}
    	// 사용 트렁크에 속하는 노드인경우
    	else if(!node.isGroup && !node.isServiceNode() && node.isTrunkNode()) {
    		if(node.isRingNode()) {
    			if(useRingNetworkIdForView != node.Ring.NETWORK_ID) {
    				// 트렁크 안의 링 노드
    				setInfoForGroupNode(node, "RING", copyNodeDataArray, idx);
    			}
    			node.group =  "RING" + node.Ring.NETWORK_ID;
    			useRingNetworkIdForView = node.Ring.NETWORK_ID;
    		} 
    		
    		if(node.isWdmTrunkNode()) {
    			if(useWdmTrunkNetworkIdForView != node.WdmTrunk.NETWORK_ID) {
    				// 트렁크 안의 WDM트렁크 노드
    				setInfoForGroupNode(node, "WDM_TRUNK", copyNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useWdmTrunkNetworkIdForView = node.WdmTrunk.NETWORK_ID;
    		} 
	    } 
    	/*
    	 * 1. [수정] RU광코어 링/예비선번 사용
    	 */
    	else if (!node.isGroup && !node.isServiceNode() && !node.isTrunkNode() && node.isRingNode()) {
			if(node.isWdmTrunkNode()) {
    			if(useWdmTrunkNetworkIdForView != node.WdmTrunk.NETWORK_ID) {
    				// 링 안의 WDM트렁크 노드
    				setInfoForGroupNode(node, "WDM_TRUNK", copyNodeDataArray, idx);
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useWdmTrunkNetworkIdForView = node.WdmTrunk.NETWORK_ID;
    		}
	    }
    }    
    
    // rest seq
    for( var idx = 0; idx < nodeUseNetworkDataArray.length; idx++ ) {
    	nodeUseNetworkDataArray[idx].SEQ = idx + 1;
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

	if (groupType == "SERVICE") {
		tempNodeInfo = tempNode.Service;
		tempColor = "#5587ED";
	}
	else if (groupType == "TRUNK") {
		tempNodeInfo = tempNode.Trunk;
		tempColor = "#A89824";
	}
	else if (groupType == "RING") {
		tempNodeInfo = tempNode.Ring;
		tempColor = "#FF7171";
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
	teamsNode.category = groupType;
	teamsNode.expanded = false;
	var networkNm = tempNodeInfo.NETWORK_NM;
	teamsNode.NETWORK_NM_TOOLTIP = networkNm;
	teamsNode.NETWORK_NM = nmCunt(networkNm);
	
	teamsNode.NETWORK_ID = tempNodeInfo.NETWORK_ID;
	teamsNode.PATH_SAME_NO = tempNodeInfo.PATH_SAME_NO;
	teamsNode.color = tempColor;
	teamsNode.group = tempNode.group;
	
	var object = nodeUseNetworkDataArray.splice(idx, copyNodeDataArray.length - idx); 
	nodeUseNetworkDataArray.push(teamsNode);
	for(var i = 0; i < object.length; i++) {
		nodeUseNetworkDataArray.push(object[i]);
	}
	
}

/**
 * 링크를 연결한다.
 */
function generateUseNetworkLinks() {
	var fromKey = -1;
	var toKey = null;
	
	var count = nodeUseNetworkDataArray.length;
	var prevNode = null;
	var curNode = null;
	
	/*
	 * 1. [수정] RU광코어 링/예비선번 사용
	 *    1) 트렁크 : 링, WDM 트렁크 사용이 가능
	 *    2) 링 : WDM 트렁크 사용이 가능
	 *    위의 정보를 바탕으로 계층적인 그룹이 생성가능하기 때문에 링크 연결기 해당 기준으로 링크를 연결함
	 *    groupId - 난수 : 노드/서비스회선/트렁크/링/WDM트렁크일 수 있음
	 *                    => isGroup == true && key - TRUNK~ : 서비스 소속의 트렁크
	 *                    => isGroup == true && key - RING~ : 서비스/트렁크 소속의 링 
	 *                    => isGroup == true && key - WDM_TRUNK~ : 서비스/트렁크/링 소속의 WDM트렁크 
	 *            - TRUNK~ : 서비스 소속의 트렁크에 속하는 노드/링/WDM트렁크일 수 있음
	 *            		  => isGroup == true && key - RING~ : 서비스/트렁크 소속의 링 
	 *                    => isGroup == true && key - WDM_TRUNK~ : 서비스/트렁크/링 소속의 WDM트렁크 
	 *            - RING~ : 서비스/트렁크소속의 링에 속하는 노드/WDM트렁크일 수 있음
	 *                    => isGroup == true && key - WDM_TRUNK~ : 트렁크 소속의 링에 속한 WDM트렁크
	 *            - WDM_TRUNK~ : 트렁크/링 소속의 WDM트렁크소속 노드임
	 *                    => isGroup == true : 트렁크/링 소속 WDM트렁크     
	 */
	
	var nodeType = "N";  // G : 그룹노드, GN : 그룹소속노드, S : 서비스회선, T : 트렁크, ST:서비스소속 트렁크, STR : 서비스-트렁크소속 링, STR
	
	var lastGroupId = null;  // 마지막 그룹
	var lastServiceGroupId = null; // 마지막 트렁크 그룹
	var lastTrunkGroupId = null; // 마지막 트렁크 그룹
	var lastRingGroupId = null; // 마지막 링 그룹
	var lastWdmGroupId = null; // 마지막 WDM트렁크 그룹	
	
	for ( var idx = 0; idx < count; idx++) {
		var tempNode = nodeUseNetworkDataArray[idx];		
		
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
			
			fromKey = lastGroupId;
		}
		
		// toKey 설정
		toKey = curNode.key;
		if (fromKey != -1) {
			linkUseNetworkDataArray.push( {from : fromKey, to: toKey} );
		}
		
		prevNode = curNode;
		
		/* 각 그룹의 id를 노드 타입에 맞추서 설정 */
		// 그룹소속 노드가 아닌경우 이전 모든 그룹은 없는것임.
		if (nodeType == "N") {
			lastServiceGroupId = null;
			lastTrunkGroupId = null;
    		lastRingGroupId = null;
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
	    		}
			}
			// RING에 대해 정리
			else if (nodeType == "R" || nodeType == "STR" || nodeType == "GR") {
				lastRingGroupId = curNode.key;   // 새로운 Ring임
				lastGroupId = lastRingGroupId;
	    		prevNode = null;
	    		
	    		// 자체 Ring이 다시 나온건 서비스/트렁크/WDM트렁크는 끝났다는 의미
	    		if (nodeType == "R") {	    			
	    			lastServiceGroupId = null;			
					lastTrunkGroupId = null;
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
				lastWdmGroupId = null;
			}
			// 그룹에 속하는 노드인경우 만약 fromKey 와 lastGroupId가 같다는건 어떤 그룹이 끝났다는 의미 이기 때문에 그룹id의 정리가 필요함
			else if (fromKey == lastGroupId) {
				// 마지막 그룹이 WDM 소속인 경우
	    		if (lastGroupId == lastWdmGroupId) {
	    			lastWdmGroupId = null;
	    			lastGroupId = (lastRingGroupId !=null ? lastRingGroupId : (lastTrunkGroupId != null ? lastTrunkGroupId : (lastServiceGroupId != null ? lastServiceGroupId : null))) ;
	    		} 
	    		// 마지막 그룹이 링 소속인 경우
	    		else if (lastGroupId == lastRingGroupId) {
	    			lastWdmGroupId = null;
	    			lastRingGroupId = null;
	    			lastGroupId = (lastTrunkGroupId !=null ? lastTrunkGroupId : (lastServiceGroupId != null ? lastServiceGroupId : null));
	    		} 
	    		// 마지막 그룹이 트렁크 인경우
	    		else if (lastGroupId == lastTrunkGroupId) {
	    			lastWdmGroupId = null;
	    			lastRingGroupId = null;
	    			lastTrunkGroupId = null;
	    			lastGroupId = (lastServiceGroupId !=null ? lastServiceGroupId : null);
	    		} 
	    		// 마지막 그룹이 서비스인경우 
	    		else {
	    			lastWdmGroupId = null;
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
 * 기능
 ***********************************************************************************************/
function nmCunt(networkNm) {
	if(networkNm.length > nmCutIdx) {
		networkNm = networkNm.substring(0, nmCutIdx) + "...";
	} 
	return networkNm;
}