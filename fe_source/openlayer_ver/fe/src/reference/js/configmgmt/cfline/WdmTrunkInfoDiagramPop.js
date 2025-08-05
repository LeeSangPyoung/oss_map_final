/**
 * WdmTrunkInfoDiagramPop.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 * 
 * 
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
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

/**
 * 사용예비선번트렁크의 그룹핑을 위한 아이디 
 */
var useSprTrunkNetworkId = null;

/**
 * 사용예비선번링의 그룹핑을 위한 아이디
 */
var useSprRingNetworkId = null;

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
		teamsPathSpr.fromTangoPath(originalSprPath);
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
	
	if(network == "Trunk") {
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

	useSprTrunkNetworkId = null;
	useSprRingNetworkId = null;
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
    	if(node.isTrunkNode()) {
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
    	
    	if(!node.isGroup && node.isTrunkNode()) {
    		if(node.isRingNode()) {
    			if(useSprRingNetworkId != node.Ring.NETWORK_ID) {
    				// 트렁크 안의 링 노드
    				teamsNode = new TeamsNode();
    				teamsNode.key = "RING" + node.Ring.NETWORK_ID;
    				teamsNode.isGroup = true;
    				teamsNode.category = "RING";
    				teamsNode.expanded = false;
    				var networkNm = node.Ring.NETWORK_NM;
    				teamsNode.NETWORK_NM_TOOLTIP = networkNm;
    				teamsNode.NETWORK_NM = nmCunt(networkNm);
    				
    				teamsNode.NETWORK_ID = node.Ring.NETWORK_ID;
    				teamsNode.PATH_SAME_NO = node.Ring.PATH_SAME_NO;
    				teamsNode.color = "#FF7171";
    				teamsNode.group = node.group;
    				
    				var object = sprNodeDataArray.splice(idx, copySprNodeDataArray.length - idx); 
    				sprNodeDataArray.push(teamsNode);
					for(var i = 0; i < object.length; i++) {
						sprNodeDataArray.push(object[i]);
    				}
    			}
    			node.group =  "RING" + node.Ring.NETWORK_ID;
    			useSprRingNetworkId = node.Ring.NETWORK_ID;
    		} 
    		
    		if(node.isWdmTrunkNode()) {
    			if(useSprWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 트렁크 안의 WDM트렁크 노드
    				teamsNode = new TeamsNode();
    				teamsNode.key = "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    				teamsNode.isGroup = true;
    				teamsNode.category = "WDM_TRUNK";
    				teamsNode.expanded = false;
//    				teamsNode.NETWORK_NM =  node.WdmTrunk.NETWORK_NM;
    				
    				var networkNm = node.WdmTrunk.NETWORK_NM;
    				teamsNode.NETWORK_NM_TOOLTIP = networkNm;
    				teamsNode.NETWORK_NM = nmCunt(networkNm);
    				
    				teamsNode.NETWORK_ID = node.WdmTrunk.NETWORK_ID;
    				teamsNode.PATH_SAME_NO = node.WdmTrunk.PATH_SAME_NO;
    				teamsNode.color = "#3A8B3A";
    				teamsNode.group = node.group;
    				
    				var object = sprNodeDataArray.splice(idx, copySprNodeDataArray.length - idx); 
    				sprNodeDataArray.push(teamsNode);
					for(var i = 0; i < object.length; i++) {
						sprNodeDataArray.push(object[i]);
    				}
    			}
    			node.group =  "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    			useSprWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    		}
    	} else if (!node.isGroup && !node.isTrunkNode() && node.isRingNode()) {
    		if(node.isWdmTrunkNode()) {
    			if(useSprWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    				// 트렁크 안의 WDM트렁크 노드
    				teamsNode = new TeamsNode();
    				teamsNode.key = "WDM_TRUNK" + node.WdmTrunk.NETWORK_ID;
    				teamsNode.isGroup = true;
    				teamsNode.category = "WDM_TRUNK";
    				teamsNode.expanded = false;
//    				teamsNode.NETWORK_NM =  node.WdmTrunk.NETWORK_NM;
    				
    				var networkNm = node.WdmTrunk.NETWORK_NM;
    				teamsNode.NETWORK_NM_TOOLTIP = networkNm;
    				teamsNode.NETWORK_NM = nmCunt(networkNm);
    				
    				teamsNode.NETWORK_ID = node.WdmTrunk.NETWORK_ID;
    				teamsNode.PATH_SAME_NO = node.WdmTrunk.PATH_SAME_NO;
    				teamsNode.color = "#3A8B3A";
    				teamsNode.group = node.group;
    				
    				var object = sprNodeDataArray.splice(idx, copySprNodeDataArray.length - idx); 
    				sprNodeDataArray.push(teamsNode);
					for(var i = 0; i < object.length; i++) {
						sprNodeDataArray.push(object[i]);
    				}
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

function generateSprLinks() {
	var fromKey = null;
	var toKey = null;
	
	var count = sprNodeDataArray.length;
	var prevNode = null;
	var curNode = null;
	
	/*
	 * 1. [수정] RU광코어 링/예비선번 사용
	 *    1) 트렁크 : 링, WDM 트렁크 사용이 가능
	 *    2) 링 : WDM 트렁크 사용이 가능
	 *    위의 정보를 바탕으로 계층적인 그룹이 생성가능하기 때문에 링크 연결기 해당 기준으로 링크를 연결함
	 *    groupId - 난수 : 노드/트렁크/링/WDM트렁크일 수 있음
	 *                    => isGroup == true && key - RING~ : 트렁크 소속의 링 
	 *                    => isGroup == true && key - WDM_TRUNK~ : 트렁크/링 소속의 WDM트렁크 
	 *            - RING~ : 트렁크소속의 링에 속하는 노드/WDM트렁크일 수 있음
	 *                    => isGroup == true && key - WDM_TRUNK~ : 트렁크 소속의 링에 속한 WDM트렁크
	 *            - WDM_TRUNK~ : 트렁크/링 소속의 WDM트렁크소속 노드임
	 *                    => isGroup == true : 트렁크/링 소속 WDM트렁크     
	 */
	
	var lastGroupIdSpr = null;  // 마지막 그룹
	var lastTrunkGroupIdSpr = null; // 마지막 트렁크 그룹
	var lastRingGroupIdSpr = null; // 마지막 링 그룹
	var lastWdmGroupIdSpr = null; // 마지막 WDM트렁크 그룹	
	
	for ( var idx = 0; idx < count; idx++) {

		/*
		 * 1. [수정] RU광코어 링/예비선번 사용
		 */
		var tempNode = sprNodeDataArray[idx];
		
		// 그룹노드가 아닌경우
		if (!tempNode.isGroup) {
			curNode = tempNode;			
			
			// 그룹소속노드인지
			if (tempNode.isNetworkNode()) {
				if(prevNode == null) {
		    		fromKey = -1;
		    	} else {
		    		fromKey = prevNode.key;
		    		// 그룹내의 노드의 경우 해당 그룹에 속하지 않으면
		    		if (lastGroupIdSpr != null && (lastGroupIdSpr != curNode.group)) {
		    			// 마지막 그룹 id를 출발 그룹으로 설정해 준다.
		    			fromKey = lastGroupIdSpr;
		    		}
		    	}
			}
	    	// 단일 노드인지
			else {
		    	if (lastGroupIdSpr == null) {
		    		if(prevNode == null) {
			    		fromKey = -1;
			    	} else {
			    		fromKey = prevNode.key;
			    	}
		    	} else {
		    		fromKey = lastGroupIdSpr;		    		
		    	}
			}
			
	    	toKey = curNode.key;
	    	sprLinkDataArray.push( {from : fromKey, to: toKey} );
	    	
	    	prevNode = curNode;
	    	
	    	// 이전 그룹을 사용하여 링크를 연결한 경우 이전 그룹을 지워준다.
	    	if (fromKey == lastGroupIdSpr) {
	    	// 단일 노드인 경우
		    	if (!tempNode.isNetworkNode()) {	    		
			    		lastTrunkGroupIdSpr = null;
			    		lastRingGroupIdSpr = null;
			    		lastWdmGroupIdSpr = null;
			    		lastGroupIdSpr = null;
		    	}
		    	// 그룹내 노드인 경우
		    	else {
		    		// 마지막 그룹이 WDM 소속인 경우
		    		if (lastGroupIdSpr == lastWdmGroupIdSpr) {
		    			lastWdmGroupIdSpr = null;
		    			lastGroupIdSpr = (lastRingGroupIdSpr !=null ? lastRingGroupIdSpr : (lastTrunkGroupIdSpr != null ? lastTrunkGroupIdSpr : null)) ;
		    		} 
		    		// 마지막 그룹이 링 소속인 경우
		    		else if (lastGroupIdSpr == lastRingGroupIdSpr) {
		    			lastRingGroupIdSpr = null;
		    			lastGroupIdSpr = (lastTrunkGroupIdSpr !=null ? lastTrunkGroupIdSpr : null);
		    		} 
		    		// 마지막 그룹이 트렁크 인경우
		    		else {
		    			lastTrunkGroupIdSpr = null;
		    			lastGroupIdSpr = null;
		    		}		    		
		    	}
	    	}
		} 
		// 그룹노드인 경우
		else {
			// 1. 트렁크인경우
			if (tempNode.category == "TRUNK") {
				// 1-1 마지막 트렁크그룹ID 있으면
				if (lastTrunkGroupIdSpr != null) {
					sprLinkDataArray.push( {from : lastTrunkGroupIdSpr, to: tempNode.key} );
				}				
				// 1-2 마지막 트렁크그룹ID없으면
			    else {
			    	// 1-2-1 처음 만나는 트렁크 그룹
			    	//     1) 만약 이전 노드가 그룹인 경우
			    	//        해당 그룹을 기준으로 링크 연결
			    	if (lastRingGroupIdSpr != null || lastWdmGroupIdSpr != null) {
			    		sprLinkDataArray.push( {from : (lastRingGroupIdSpr != null ? lastRingGroupIdSpr : lastWdmGroupIdSpr), to: tempNode.key} );
			    	} 
			    	// 첫 노드 혹은 단일 노드 후 첫 트렁크
			    	else {
			    		// 이전 노드
			    		if(prevNode == null) {
				    		fromKey = -1;
				    	} else {
				    		fromKey = prevNode.key;
				    	}
			    		sprLinkDataArray.push( {from : fromKey, to: tempNode.key} );
			    	}
				}  
		    	
				lastTrunkGroupIdSpr = tempNode.key;
				lastGroupIdSpr = lastTrunkGroupIdSpr;

	    		// 트렁크그룹이 시작이란것은 링/WDM트렁크그룹은 끝났다는 의미
	    		lastRingGroupIdSpr = null;
	    		lastWdmGroupIdSpr = null;
	    		
				prevNode = null;
			} 
			
			// 2. 링인경우
			else if (tempNode.category == "RING") {
				// 트렁크 소속 링인경우
				if (tempNode.key.indexOf("RING") == 0) {
					// 이전노드가 링인 경우
					if (lastRingGroupIdSpr != null) {
						sprLinkDataArray.push( {from : lastRingGroupIdSpr, to: tempNode.key} );
					}
					// 마지막 링그룹 ID 없으면
					else {
				    	//     이전노드가 WDM 트렁크인 경우
				    	if (lastWdmGroupIdSpr != null) {
				    		sprLinkDataArray.push( {from : lastWdmGroupIdSpr, to: tempNode.key} );
				    	} 
				    	// 첫 노드 혹은 노드후 첫 트렁크
				    	else {
				    		// 이전 노드
				    		if(prevNode == null) {
					    		fromKey = -1;
					    	} else {
					    		fromKey = prevNode.key;
					    	}
				    		sprLinkDataArray.push( {from : fromKey, to: tempNode.key} );
				    	} 
					}
					
					// 트렁크 속 링인 경우 WDM트렁크그룹은 끝났다는 의미
		    		lastWdmGroupIdSpr = null;
				}
				// 자체링인경우
				else {
					// 이전노드가 그룹인 경우(트렁크/링/WDM트렁크이다)
					if (lastGroupIdSpr != null) {
						sprLinkDataArray.push( {from : lastGroupIdSpr, to: tempNode.key} );
					}
					// 마지막 링그룹 ID 없으면
					else {						
							// 이전 노드
				    		if(prevNode == null) {
					    		fromKey = -1;
					    	} else {
					    		fromKey = prevNode.key;
					    	}
				    		sprLinkDataArray.push( {from : fromKey, to: tempNode.key} );				    	  						
					}
					
		    		// 자체링이 다시 이전 노드가 만약 트렁크/WDM트렁크인 경우 해당 그룹이 끝났다는 의미
					lastTrunkGroupIdSpr = null;
		    		lastWdmGroupIdSpr = null;
				}				 
		    	lastRingGroupIdSpr = tempNode.key;
				lastGroupIdSpr = lastRingGroupIdSpr;
	    		prevNode = null;
			} 
			// 3. WDM트렁크인 경우
			else if (tempNode.category == "WDM_TRUNK") {
				// 트렁크/링 소속 링인경우
				if (tempNode.key.indexOf("WDM_TRUNK") == 0) {
					// 트렁크 소속의 링에 속하는 WDM트렁크그룹
					if (tempNode.group.indexOf("RING") == 0) {						
						// 이전 WDM트렁크가 있으면
						if (lastWdmGroupIdSpr != null) {
							sprLinkDataArray.push( {from : lastWdmGroupIdSpr, to: tempNode.key} );
						} 
						// 이전 WDM트렁크가 없으면
						else {							
				    		// 이전 노드
				    		if(prevNode == null) {
					    		fromKey = -1;
					    	} else {
					    		fromKey = prevNode.key;
					    	}
				    		sprLinkDataArray.push( {from : fromKey, to: tempNode.key} );					    	 
						}
					} 
					// 자체 링 소속 WDM트렁크
					else {
						// 이전 WDM트렁크가 있으면
						if (lastWdmGroupIdSpr != null) {
							sprLinkDataArray.push( {from : lastWdmGroupIdSpr, to: tempNode.key} );
						} 
						// 이전 WDM트렁크가 없으면
						else {							
				    		// 이전 노드
				    		if(prevNode == null) {
					    		fromKey = -1;
					    	} else {
					    		fromKey = prevNode.key;
					    	}
				    		sprLinkDataArray.push( {from : fromKey, to: tempNode.key} );					    	 
						}
					}
				} 
				// 단독 WDM트렁크
				else {
					// 마지막 그룹 ID 있으면(트렁크/링/WDM트렁크)
					if (lastGroupIdSpr != null) {
						sprLinkDataArray.push( {from : lastGroupIdSpr, to: tempNode.key} );
					}
					// 마지막 그룹 ID 없으면
					else {						
							// 이전 노드
				    		if(prevNode == null) {
					    		fromKey = -1;
					    	} else {
					    		fromKey = prevNode.key;
					    	}
				    		sprLinkDataArray.push( {from : fromKey, to: tempNode.key} );				    	  						
					}
					
		    		// 자체WDM트렁크가 다시 나온건 트렁크/링는 끝났다는 의미
					lastTrunkGroupIdSpr = null;
					lastRingGroupIdSpr = null;
				}
				 
				lastWdmGroupIdSpr = tempNode.key;
				lastGroupIdSpr = lastWdmGroupIdSpr;
	    		prevNode = null;
			}			
		}		
		
		/**
		 * 1. [수정] RU광코어 링/예비선번 사용
		 *//*			
		var linkYn = false; 
			
		if(!sprNodeDataArray[idx].isNetworkNode()) {
			if(!sprNodeDataArray[idx].isGroup) {
				linkYn = true;
			} else {
				var index = sprNodeDataArray[idx].key.lastIndexOf(sprNodeDataArray[idx].NETWORK_ID);
				if(index < 0) {
					linkYn = true;
				}
			}
		} 
		

		if(linkYn) {
	    	curNode = sprNodeDataArray[idx];
	    	
	    	if(prevNode == null) {
	    		fromKey = -1;
	    	} else {
	    		fromKey = prevNode.key;
	    	}
	    	toKey = curNode.key;
	    	
	    	sprLinkDataArray.push( {from : fromKey, to: toKey} );
	    	
	    	prevNode = curNode;
		} else {
			curNode = sprNodeDataArray[idx];
	    	
	    	if(prevNode == null) {
	    		fromKey = -1;
	    	} 
	    	toKey = curNode.key;
	    	
	    	sprLinkDataArray.push( {from : fromKey, to: toKey} );
	    	
	    	prevNode = curNode;
		}*/
		
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

