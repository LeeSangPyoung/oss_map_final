/**
 * NetworkPathVisualizationRing.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 */

/**
 * TEAMS 포인트 방식 회선 선번( FDF 등을 제거한 선번 )
 */
var teamsRingPath = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsRingPathData = null;

/**
 * TEAMS 포인트 방식의 링 원본 선번
 */
var originalRingPath = null;

/**
 * gojs diagram
 */
var ringDiagram;


/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeRingDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkRingDataArray = [];

/**
 * PTP 링 여부
 */
var isPtpRing = false;

/**
 * PTP 링 또는 링 중 노드가 2개이하인 경우는 직선으로 표시한다.
 */
var isDisplayLinear = false;

/**
 * TEAMS 포인트 방식의 링 원본 선번
 */
var originalTeamsPath = new TeamsPath();

/**
 * 다이어그램 init
 */
function initRingDiagram() {
	if ( isDisplayLinear ) {
		ringDiagram = $go(go.Diagram, "ringDiv", {
    		initialContentAlignment:go.Spot.Center, padding:10, isReadOnly:true
//    		, initialAutoScale: go.Diagram.UniformToFill
    		, layout : $go(go.GridLayout, {sorting: go.GridLayout.Forward, wrappingWidth: Infinity, spacing: new go.Size(100, 100)})
    		, maxSelectionCount:0
    		, "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom
    	});
	} else {
		ringDiagram =
			$go(go.Diagram, "ringDiv",
					{
						initialContentAlignment: go.Spot.Center,
						initialAutoScale: go.Diagram.Uniform,
						padding: 10,
						isReadOnly: true,
						layout: $go(RadialLayout, {
							maxLayers: 1,
							commitLayers: function() {
								var diagram = this.diagram;
								var $inGo = go.GraphObject.make;
								var radius = this.layerThickness * 2
								// 큰 원
								var circle = 
									$inGo(go.Part,
											{ name : "CIRCLE", layerName: "Grid" },
											{ locationSpot: go.Spot.Center, location: this.root.location, selectionAdorned: false, movable: false },
											$inGo(go.Shape, "Circle",
													{ width: radius * 2, height: radius * 2},
													{ fill : "white", stroke: "black"}
											)
									);
								diagram.add(circle);
							}
						})
					}
			);
	}
	
	makeRingNodeTemplate();
	makeRingLinkTemplate();
	
	ringDiagram.allowDelete = false;
	
	// 마우스 휠 막기
//	ringDiagram.toolManager.standardMouseWheel = function() {
//		return;
//	}
}


function makeRingNodeTemplate() {
	ringDiagram.nodeTemplate = 
			$go(go.Node, "Spot",
					{
						locationSpot: go.Spot.Center,
						locationObjectName: "SHAPE",
						selectionAdorned: false,
						movable: false
					},
					$go(go.Shape, "Rectangle",
							{
								name: "SHAPE",
								stroke: "transparent",
								fill: "white",
								desiredSize: new go.Size(30, 60)
							}
					),
					$go(go.Picture
							, {name : "groupImageLarge", desiredSize: new go.Size(30, 30), margin: 5
										, toolTip : $go(go.Adornment, "Auto"
													, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"})
													, $go(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4 })
										)
							}
//							, new go.Binding("source", "NE_ROLE_CD", comvertPathNodeImage)
							, new go.Binding("source")
					), 
					$go(go.TextBlock,
							{
								name: "TEXTBLOCK",
								alignment: go.Spot.Right,
								alignmentFocus: go.Spot.Left,
								font: "8pt sans-serif",
								width: 80
								, toolTip : $go(go.Adornment, "Auto"
											, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"})
											, $go(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4 })
									)
							},
							new go.Binding("text", "NE_NM").makeTwoWay()
							
					)
			);
	
	ringDiagram.nodeTemplateMap.add("Root",
			$go(go.Node, "Auto",
					{
						locationSpot: go.Spot.Center,
						selectionAdorned: false,
						movable: false
					},
					$go(go.Shape, "Circle", { fill : "white", stroke: null, desiredSize: new go.Size(380, 380) } ),
					$go(go.TextBlock,
							{ font: "blod 12pt sans-serif", margin:5 }, 
							new go.Binding("NETWORK_NM")
					)
			)
	);
}

function makeRingLinkTemplate() {
	var link = null;
	
	if ( isDisplayLinear ) {
		link = $go(go.Link
				, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left}
				, $go(go.Shape, {stroke: "black"})
		);

	} else {
		link = $go(go.Link
				, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left}
				, $go(go.Shape, {stroke: null})
		);

	}
	ringDiagram.linkTemplate = link;
	
}

function generateRingDiagram() {
	generateRingNodes();
	generateRingkLinks();
	ringDiagram.model = new go.GraphLinksModel(nodeRingDataArray, linkRingDataArray);
    
    if ( !isDisplayLinear ) {
    	nodeClicked(null, ringDiagram.findNodeForData(nodeRingDataArray[0]));
    }  
}	

function generateRingNodes() {
	// root node 만들기
	if ( !isDisplayLinear ) {
		var node = new TeamsNode(); 
		node.NETWORK_NM = teamsRingPath.NETWORK_NM;
		node.NETWORK_ID = teamsRingPath.NETWORK_ID;
		node.key = 0;
		nodeRingDataArray.push( node );
	}
	
	for ( var idx = 0; idx < teamsRingPath.NODES.length; idx++) {
		var node = teamsRingPath.NODES[idx];
    	node.key = node.NODE_ID;
    	node.NODE_ID = node.NODE_ID;
    	node.NE_NM = node.Ne.makeNodeTitle();
    	node.category = "NE";
    	
    	node.WEST_PORT_NM = node.BPortDescr.PORT_NM;
    	node.EAST_PORT_NM  =  node.APortDescr.PORT_NM;
    	node.NE_ROLE_CD = node.Ne.NE_ROLE_CD;
    	node.source = getEqpIcon(node.Ne.NE_ROLE_CD, "");
    	node.nodeTooltipText = node.toString();
    	nodeRingDataArray.push( node );
    }
}

function generateRingkLinks() {
	var fromKey = null;
	var toKey = null;
	
	var count = nodeRingDataArray.length;
	var prevNode = null;
	var curNode = null;
	
	linkRingDataArray = [];
	
	if ( isDisplayLinear ) {
		for ( var idx = 0; idx < count; idx++) {
	    	curNode = nodeRingDataArray[idx];
	    	
	    	if(prevNode == null) {
	    		fromKey = -1;
	    	} else {
	    		fromKey = prevNode.key;
	    	}
	    	toKey = curNode.key;
	    	
	    	linkRingDataArray.push( {from : fromKey, to: toKey} );
	    	
	    	prevNode = curNode;
	    }
	} else {
		for ( var idx = 1; idx < count; idx++) {
			curNode = nodeRingDataArray[idx];
			toKey = curNode.key;
			
			linkRingDataArray.push( {from : 0, to: toKey} );
		}
	}
}

function nodeClicked(e, root) {
	var diagram = root.diagram;
	if(diagram == null) {
		return;
	}
	
//	diagram.nodes.each(function(n) {
//		n.visible = true;
//		if (n !== root) n.category = "";
//	})
	
	root.category = "Root";
	diagram.layout.root = root;
	diagram.layoutDiagram(true);
}