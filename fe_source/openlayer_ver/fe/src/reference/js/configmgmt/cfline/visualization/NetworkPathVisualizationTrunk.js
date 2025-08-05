/**
 * NetworkPathVisualizationTrunk.js(사용않함)
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 * 
 ************* 수정이력 ************
 *2018-09-12  1. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리하면서 트렁크/wdm트렁크를 사용네트워크로 사용하는경우 공통(NetworkPathVisulizationUseNetwork.js)로 처리함 
 *
 */

/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsTrunkPath = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsTrunkPathData = null;

/**
 * 선번 원본
 */
var originalTrunkPath = null;

/**
 * gojs diagram
 */
var trunkDiagram;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeTrunkDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkTrunkDataArray = [];

/**
 * 다이어그램 init
 */
function initTrunkDiagram() {
	trunkDiagram =
		$go(go.Diagram, "trunkDiv",
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
	
	makeTrunkNodeTemplate();
	makeTrunkLinkTemplate();
//	setDiagramClickEvent();
	
	trunkDiagram.allowDelete = false;
	
	// 마우스 휠 막기
//	trunkDiagram.toolManager.standardMouseWheel = function() {
//		return;
//	}
}

function makeTrunkNodeTemplate() {
	setTrunkNodeTemplate();
	setTrunkGroupTemplate();
}

function generateTrunkDiagram() {
    generateTrunkNodes();
    generateTrunkLinks();
    
    trunkDiagram.model = new go.GraphLinksModel(nodeTrunkDataArray, linkTrunkDataArray);
	
    for(var idx = 0; idx < nodeTrunkDataArray.length; idx++) {
		var nodeData = nodeTrunkDataArray[idx];
		var node = trunkDiagram.findNodeForData(nodeData);
		
		node.selectionAdorned = false;
		node.movable = false;
	}
}

/**
 * 노드를 생성한다.
 */
function generateTrunkNodes() {
	useWdmTrunkNetworkId = null;
	useRingNetworkId = null;
	
    for ( var idx = 0; idx < teamsTrunkPath.NODES.length; idx++) {
    	var node = teamsTrunkPath.NODES[idx];

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
    	
    	node = generateGroupNodes( node, 'trunk' );
    	nodeTrunkDataArray.push( node );
    }
    
    // 사용 네트워크 내의 사용 네트워크 확인(2depth)
    var copyNodeDataArray = nodeTrunkDataArray;
    for( var idx = 0; idx < copyNodeDataArray.length; idx++) {
    	var node = copyNodeDataArray[idx];
    	
    	// 링 노드 일 경우 
    	if(!node.isGroup && node.isRingNode()) {
    		if(node.isWdmTrunkNode()) {
    			// WDM트렁크를 포함한다면 
    			if(useWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				teamsNode = new TeamsNode();
    				teamsNode.key = "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    				teamsNode.isGroup = true;
    				teamsNode.expanded = true;
    				teamsNode.category = "WDM_TRUNK";
    				var networkNm = node.WdmTrunk.NETWORK_NM;
    				if(networkNm.length > 10) {
    					networkNm = networkNm.substring(0, 20) + "...";
    				} 
    				
    				teamsNode.NETWORK_NM = networkNm;
    				teamsNode.NETWORK_ID = node.WdmTrunk.NETWORK_ID;
    				teamsNode.PATH_SAME_NO = node.WdmTrunk.PATH_SAME_NO;
    				teamsNode.color = "#3A8B3A";
    				teamsNode.group = node.group;
//    				teamsNode.SEQ = node.SEQ;
    				var object = nodeTrunkDataArray.splice(idx, copyNodeDataArray.length - idx); 
    				nodeTrunkDataArray.push(teamsNode);
    				for(var i = 0; i < object.length; i++) {
    					nodeTrunkDataArray.push(object[i]);
    				}
    			}
    			
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		}
    	}
    }
    
    
    // rest seq
    for( var idx = 0; idx < nodeTrunkDataArray.length; idx++ ) {
    	nodeTrunkDataArray[idx].SEQ = idx + 1;
    }
}

/**
 * 링크를 연결한다.
 */
function generateTrunkLinks() {
	var fromKey = null;
	var toKey = null;
	
	var count = teamsTrunkPath.NODES.length;
	var prevNode = null;
	var curNode = null;
	
	for ( var idx = 0; idx < count; idx++) {
    	curNode = teamsTrunkPath.NODES[idx];
    	
    	if(prevNode == null) {
    		fromKey = -1;
    	} else {
    		fromKey = prevNode.NODE_ID;
    	}
    	toKey = curNode.NODE_ID;
    	
    	linkTrunkDataArray.push( {from : fromKey, to: toKey} );
    	
    	prevNode = curNode;
    }
}