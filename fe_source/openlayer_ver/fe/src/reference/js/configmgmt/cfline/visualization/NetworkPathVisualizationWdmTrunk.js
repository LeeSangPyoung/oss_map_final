/**
 * NetworkPathVisualizationWdmTrunk.js(사용않함)
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0 
 * 
 ************* 수정이력 ************
 *2018-09-12  1. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리하면서 트렁크/wdm트렁크를 사용네트워크로 사용하는경우 공통(NetworkPathVisulizationUseNetwork.js)로 처리함 
 */
/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsWdmPath = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsWdmPathData = null;

/**
 * 선번 원본
 */
var originalWdmPath = null;

/**
 * gojs diagram
 */
var wdmDiagram;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeWdmDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkWdmDataArray = [];

/**
 * 다이어그램 init
 */
function initWdmDiagram() {
	wdmDiagram =
		$go(go.Diagram, "wdmDiv",
	        {
//			  maxSelectionCount: 0,
			  layout:
	        	  $go(go.GridLayout,
			              {  
	        		  			wrappingWidth: Infinity, cellSize: new go.Size(4, 4), spacing: new go.Size(20, 20),
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
	
	makeWdmNodeTemplate();
	makeWdmLinkTemplate();
//	setDiagramClickEvent();
	
	wdmDiagram.allowDelete = false;
	// 마우스 휠 막기
//	wdmDiagram.toolManager.standardMouseWheel = function() {
//		return;
//	}
}

function makeWdmNodeTemplate() {
	setWdmNodeTemplate();
//	setWdmGroupTemplate();
}

function generateWdmDiagram() {
    generateWdmNodes();
    generateWdmLinks();
    
    wdmDiagram.model = new go.GraphLinksModel(nodeWdmDataArray, linkWdmDataArray);
	
    for(var idx = 0; idx < nodeWdmDataArray.length; idx++) {
		var nodeData = nodeWdmDataArray[idx];
		var node = wdmDiagram.findNodeForData(nodeData);
		
		node.selectionAdorned = false;
		node.movable = false;
	}
}

/**
 * 노드를 생성한다.
 */
function generateWdmNodes() {
    for ( var idx = 0; idx < teamsWdmPath.NODES.length; idx++) {
    	var node = teamsWdmPath.NODES[idx];

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
    	nodeWdmDataArray.push( node );
    }
    
    // rest seq
    for( var idx = 0; idx < nodeWdmDataArray.length; idx++ ) {
    	nodeWdmDataArray[idx].SEQ = idx + 1;
    }
}

/**
 * 링크를 연결한다.
 */
function generateWdmLinks() {
	var fromKey = null;
	var toKey = null;
	
	var count = teamsWdmPath.NODES.length;
	var prevNode = null;
	var curNode = null;
	
	for ( var idx = 0; idx < count; idx++) {
    	curNode = teamsWdmPath.NODES[idx];
    	
    	if(prevNode == null) {
    		fromKey = -1;
    	} else {
    		fromKey = prevNode.NODE_ID;
    	}
    	toKey = curNode.NODE_ID;
    	
    	linkWdmDataArray.push( {from : fromKey, to: toKey} );
    	
    	prevNode = curNode;
    }
}