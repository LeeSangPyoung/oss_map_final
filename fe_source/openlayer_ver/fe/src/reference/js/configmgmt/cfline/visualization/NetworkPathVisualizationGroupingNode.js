/**
 * NetworkPathVisualizationGroupingNode.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0 *  
 * 
 ************* 수정이력 ************
 * 2018-09-12  1. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 */

/**
 * 서비스 회선 그룹 노드 생성
 *  - 노드를 묶는 service, trunk, ring, wdmTrunk 그룹 생성
 */
function generateGroupNodes(node, lineNetwork) {
	/* * 2018-09-12  1. RU고도화 */
	if(node.isServiceNode()) {
		if(useServiceNetworkId != node.Service.NETWORK_ID) {
			groupGuid = null;
			groupGuid = generateTeamsNodeGroup(node, "Service", lineNetwork);
		}
		node.group = groupGuid;
		useServiceNetworkId = node.Service.NETWORK_ID;
	} else if(node.isTrunkNode()) {
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
}

function generateTeamsNodeGroup(node, network, lineNetwork) {
	var networkArray = new Array();
	/* * 2018-09-12  1. RU고도화 */
	if(network == "Service") {
		networkArray.push("SERVICE");
		networkArray.push("#5587ED");
	} else if(network == "Trunk") {
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
	teamsNode.expanded = true;
	teamsNode.category = networkArray[0];
	var networkNm = eval("node."+network+".NETWORK_NM");
	teamsNode.NETWORK_NM_TOOLTIP = networkNm;
	
	if(networkNm.length > nmCutIdx) {
		networkNm = networkNm.substring(0, nmCutIdx) + "...";
	} 

	teamsNode.NETWORK_NM = networkNm;
	teamsNode.color = networkArray[1];
	teamsNode.NETWORK_ID = eval("node."+network+".NETWORK_ID");
	teamsNode.PATH_SAME_NO = eval("node."+network+".PATH_SAME_NO");
	
	if(lineNetwork == "line") {
		nodeDataArray.push(teamsNode);
	} else if(lineNetwork == "useNetwork") {
		nodeUseNetworkDataArray.push(teamsNode);
	} 
	
	return teamsNode.key;
}