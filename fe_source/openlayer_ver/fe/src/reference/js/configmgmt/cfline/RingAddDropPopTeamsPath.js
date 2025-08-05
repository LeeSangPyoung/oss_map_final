/**
 * PopRingAddDropTeamsPath.js
 * 
 * @author Administrator
 * @date 2017. 7. 14. 오전 17:30:03
 * @version 1.0
 */




/**
 * parent progress z-index 설정
 */
var targetName;

/**
 * parent progress z-index 설정
 */
var zIndex;

/**
 * PAGE 
 */
$a.page(function() {
	window.addEventListener("beforeunload", function(e) {
		$a.close();
	});
	

	/**
	 * Add 노드 그래프 객체
	 */
	var addNode = null;

	/**
	 * Drop 노드 그래프 객체
	 */
	var dropNode = null;

	/**
	 * PTP 링 여부
	 */
	var isPtpRing = false;

	/**
	 * PTP 링 또는 링 중 노드가 2개이하인 경우는 직선으로 표시한다.
	 */
	var isDisplayLinear = false;
	
	/**
	 * 노드 그래프 객체의 데이터 목록
	 */
	var nodeDataArray = [];

	/**
	 * 구간 그래프 객체의 데이터 목록
	 */
	var linkDataArray = [];

	/**
	 * 이 링이 회선(트렁크) 에서 사용될 때의 방향
	 */
	var useNetworkPathDirection = "";

	/**
	 * 링 구간 선번 데이터 원본
	 */
	var originalLinkPathData = null;

	/**
	 * TEAMS 포인트 방식의 링 원본 선번
	 */
	var originalTeamsPath = new TeamsPath();
	
	/**
	 * TEAMS 포인트 방식 링 선번 ( FDF 등을 제거한 선번 )
	 */
	var teamsPath = null;

	
	/**
	 * TEAMS 포인트 방식 사용 링 선번 ( 외부에서 링 ADD-DROP 을 수정하려고 할 때 넘긴 선번 ) 
	 */
	var useRingTeamsPath = null;
	
	
	/**
	 * ADD, DROP 지정 안된 상태
	 */
	var ADD_DROP_STATUS_NONE = 0;

	/**
	 * ADD 지정 가능 상태
	 */
	var ADD_DROP_STATUS_ADD = 1;

	/**
	 * ADD 를 지정한 후, DROP 지정 가능 상태
	 */
	var ADD_DROP_STATUS_DROP = 2;

	/**
	 * ADD, DROP 지정 완료 상태
	 */
	var ADD_DROP_STATUS_COMPLETE = 3;
	
	/**
	 * ADD, DROP 현재 상태
	 */
	var addDropStatus;
	
	/**
	 * ADD 포트 설정 여부
	 */
	var isSetAddPortInfo = false;
	
	/**
	 * DROP 포트 설정 여부
	 */
	var isSetDropPortInfo = false;
	
	/**
	 * 링 다이어그램 객체
	 */
	var ringDiagram;

	/**
	 * 편집 모드 여부
	 */
	var editYn = 'Y';
	
	/**
	 * 부모창에서 넘긴 파라미터 데이터
	 */
	var paramData = null;
	
	// init. parameter 설정
	this.init = function(id, param) {
		
		try {
			
			if (! jQuery.isEmptyObject(param) ) {
				paramData = param;
				
				var data = {"ntwkLineNo" : param.ntwkLineNo, "ntwkLnoGrpSrno" : param.ntwkLnoGrpSrno};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', data, 'GET', 'search');
	    	} 
	
			if ( isNullOrEmpty(paramData) == false ) {
				
//				debugger;
				
				if ( isNullOrEmpty(paramData.useRingPath) == false ) {
					Object.setPrototypeOf(paramData.useRingPath, TeamsPath.prototype);
					
					useRingTeamsPath = paramData.useRingPath;
					useRingTeamsPath.resetPrototype();
					
					useNetworkPathDirection = useRingTeamsPath.PATH_DIRECTION;
				}
				
				editYn = paramData.editYn;
				targetName = paramData.target;
				zIndex = paramData.zIndex;
			}
			
			addDropStatus = ADD_DROP_STATUS_NONE;
		} catch ( err ) {
			console.log(err);
		}
    };
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
    		data : Param, 		//data가 존재할 경우 주입
    		method : Method, 	//HTTP Method
    		flag : Flag
    	}).done(successCallback);
    };
    
    /**
     * setEventListener
     */
    function setEventListener() {
    	$a.convert(jQuery("#ringAddDropDiv"));
    	
    	// 이전 버튼
    	jQuery('button#btnPrev').on('click', function(e) {
    		var returnData = {};
    		returnData.prev = 'Y';
    		$a.close(returnData);
    	});
    	
    	// 등록 버튼
    	jQuery('button#btnInsert').on('click', save);

    	// ADD, DROP 지정
    	jQuery('button#setAddDropEnable').on('click', onClickSetAddDropEnable);
    	
    	// 정방향, 역방향 변환
    	jQuery(':input[name="direction"]').change(function() {
    		changeDirection();
    	});
    };
    
    
    
    /**
     * save
     */
    function save() {
    	try {
    		
			if(addNode == null || dropNode == null) {
				alertBox('W', 'ADD, DROP을 선택해주세요.');
				return;
			}
			
		       //	Add, Drop 노드, 포트
	        var addNodeData = addNode.data;
	        var dropNodeData = dropNode.data;
	        
	        var addPortData = addNodeData.AddDropPort;
	        var dropPortData = dropNodeData.AddDropPort;
	
	    	var directionVal = jQuery("input[name=direction]").getValue();
//			var reverseDirection = false;
//			if ( directionVal == 'LEFT' ) {
//				reverseDirection = true;
//			}

	    	//	링 Add-Drop 사이의 Validation 체크시에는 화면에 표시되는 노드 대상으로만 한다.
	    	teamsPath.createRingPathAddDrop( addNodeData.NODE_ID, addPortData, dropNodeData.NODE_ID, dropPortData, directionVal, true );
	    	
			var useRingTeamsPath = originalTeamsPath.createRingPathAddDrop( addNodeData.NODE_ID, addPortData, dropNodeData.NODE_ID, dropPortData, directionVal, false );
		
			/* 2019-11-29 
	    	 * 링의 경유링 사용으로 인해 링의 경유링이 인접링인 경우 생성된 인접노드에 대해 
	    	 * 링구성도에서 인접노드로 추가된 RIGHT노드가 존재함. 
	    	 *    1) LEFT 노드 : 이노드와 쌍이되는 LEFT노드는 A/B포트를 모두 같는 노드로 변경되어 있음.
	    	 *       -> B노드 정보를 지움
	    	 *    2) RIGHT 노드 : A포트정보가 NULL이기 때문에 ADD/DROP(createRingPathAddDrop)시 정상적으로 처리되도록 createRingPathAddDrop메소드에서 인접노드 예외처리함
	    	 * 
	    	 * => removeAdjacentNode에서 작업한것 되돌림
	    	 */
	    	for (var idx = 0 ; idx < useRingTeamsPath.NODES.length; idx++) {
	    		var tmpNode = useRingTeamsPath.NODES[idx];
	    		if (tmpNode.ADJACENT_NODE == 'Y' && tmpNode.PREFIX == 'RIGHT_' && idx > 0 ) {

	   			    // 인접노드 삭제시 복사한 B포트 정보 삭제
	    			var adjacentNode = useRingTeamsPath.NODES[idx-1];
	    			adjacentNode.BPortDescr = tmpNode.APortDescr ;
	   			 }
	    	}
	        
	        var temp = useRingTeamsPath.toShortestPath();
	        
	    	//console.log(useRingTeamsPath);
	    	$a.close(useRingTeamsPath);
    	} catch ( err ) {
    		console.log(err);
    		alertBox('W', err+'');
    	}
    };
    
    /**
     * ADD-DROP 지정 버튼 클릭시
     */
    function onClickSetAddDropEnable() {
		if ( nodeDataArray.length === 1 ) {
			var msg = '장비가 1개이므로 ADD, DROP 지정할 수 없습니다.';
			callMsgBox('','I', msg, function(msgId, msgRst){
        		if (msgRst == 'Y') {
        		}
    		});
			return;
		} 
		
		if ( addDropStatus == ADD_DROP_STATUS_ADD || addDropStatus == ADD_DROP_STATUS_DROP ) {
			var msg = makeArgMsg("selectObject", cflineMsgArray['equipment']);
    		callMsgBox('','I', msg, function(msgId, msgRst){
        		if (msgRst == 'Y') {
        		}
    		});
			return;
		}
		
    	// add, drop 설정이 가능하도록 변경
		ringDiagram.setProperties({maxSelectionCount: 2});
		
		addDropStatus = ADD_DROP_STATUS_ADD;
		addNode = null;
		dropNode = null;
		// 설정된 노드 리셋
		resetDiagram();
		
		// 문구 안보이게
		jQuery('#explainAddDropPortSetting').css('visibility', 'hidden');
    };
    
    /**
     * changeDirection
     */
    function changeDirection() {
    	
		if ( nodeDataArray.length > 0 ) {
		
			reverseLinkDataArray();
			
			if ( addDropStatus !== ADD_DROP_STATUS_COMPLETE ) {
				addDropStatus = ADD_DROP_STATUS_NONE;
			}
			
			ringDiagram.setProperties({maxSelectionCount: 0});
			
			resetDiagram();

			drawAddDropMark();

			setLegend();

		}
    };
    
    
    /**
     * diagram 범례변경
     */
    function setLegend() {
		
    	var directionVal = jQuery("input[name=direction]").getValue();
		if ( directionVal == 'LEFT' ) {
			jQuery('#diagLegendBlue').text('● A 포트');
			jQuery('#diagLegendRed').text('● B 포트');
		} else {
			jQuery('#diagLegendBlue').text('● B 포트');
			jQuery('#diagLegendRed').text('● A 포트');
		}
    }
    
    
    /**
     * 구간 데이터를 뒤집어 화살표를 바꾼다.
     */
    function reverseLinkDataArray() {
    	
    	var linkChangeDataArray = [];
 		// 방향 뒤집기
   	 	for (var idx = 0; idx < linkDataArray.length; idx++) {
   	 		var linkData = linkDataArray[idx];
			var obj = ringDiagram.findLinkForData(linkData).data;
			linkChangeDataArray.push({from : obj.to, to : obj.from});
		}

   	 	linkDataArray = linkChangeDataArray;
		
		ringDiagram.model.linkDataArray = linkDataArray;
		
    }
    

    /**
     * drawAddDropMark
     */
    function drawAddDropMark() {
		if ( addNode != null && dropNode != null ) {
			
			if(addNode.findObject('addMark') == null) {
				setAddDropMark(addNode, 'A');
				setAddDropClickEvent(addNode, 'addMark');
			}
			if(dropNode.findObject('dropMark') == null) {
				setAddDropMark(dropNode, 'D');
				setAddDropClickEvent(dropNode, 'dropMark');
			}
			
			highlightPath(addNode, dropNode);
		}    	
    }

    /**
     * resetDiagram
     */
    function resetDiagram() {
		for (var idx = 0; idx < nodeDataArray.length; idx++) {
			var nodeData = nodeDataArray[idx];
			var node = ringDiagram.findNodeForData(nodeData);
			var nodeImage = node.findObject("nodeImage");
			nodeImage.source = nodeTypeImage(nodeData.NE_ROLE_CD);
    		
			node.findLinksOutOf().each( function(link) { link.isHighlighted = false } );
			
			//add 포트, drop 포트는 삭제
			if(node.findObject('addMarkPort') != null) {
				node.findObject('addMark').remove(node.findObject('addMarkPort'));
				nodeData.AddDropPort = null;
				
				isSetAddPortInfo = false;
			}
			
			if(node.findObject('dropMarkPort') != null) {
				node.findObject('dropMark').remove(node.findObject('dropMarkPort'));
				nodeData.AddDropPort = null;
				
				isSetDropPortInfo = false;
			}
			
//			if ( addDropStatus == ADD_DROP_STATUS_COMPLETE || (nodeDataArray.length == 2) ) {
				//ADD, DROP 마크 삭제
				if(node.findObject('addMark') != null) {
					node.remove(node.findObject('addMark'));
				}
				if(node.findObject('dropMark') != null) {
					node.remove(node.findObject('dropMark'));
				}
//			}
		}
		
		updateAddDropBtnText();
    }
    

    /**
     *	ADD, DROP지정 버튼 문구 변경 
     */
    function updateAddDropBtnText() {
    	if(addDropStatus === ADD_DROP_STATUS_NONE || addDropStatus === ADD_DROP_STATUS_COMPLETE) {
    		jQuery('button#setAddDropEnable').text('ADD, DROP 지정').css('background-color', '#878787');
    	} else if(addDropStatus === ADD_DROP_STATUS_ADD) {
    		jQuery('button#setAddDropEnable').text('ADD 지정').css('background-color', 'red');
    	} else if(addDropStatus === ADD_DROP_STATUS_DROP) {
    		jQuery('button#setAddDropEnable').text('DROP 지정').css('background-color', 'blue');
    	}
    }
    

    
    /**
     * getSpacing
     */
    function getSpacing() {
    	if ( isDisplayLinear == false ) {
    		if ( nodeDataArray.length < 10 && nodeDataArray.length > 0 ) {
        		return parseInt(300 / nodeDataArray.length);
        	}
    	} 
    	
    	return 10;
    }
    
    /**
     * successCallback
     */
    function successCallback(response, status, jqxhr, flag){
    	// parent progress z-index 설정 
    	jQuery(parent.document.body).find("#"+targetName).css("z-index", zIndex);
    	
    	
    	
    	jQuery("#ringAddDropDiv").append("&nbsp;&nbsp;&nbsp;<div id='btnDiv' style=''>" +
    			"<span id='directionDiv'>" +
    			"<label><input class='Radio' type='radio' id='directionRight' name='direction' value='RIGHT'>정방향</label>" +
    			"<label><input class='Radio' type='radio' id='directionLeft' name='direction' value='LEFT'>역방향</label>" +
    			"</span>" +
    			"<span id='dataDiv' style='font-size:10px;'></span>" +
    			"&nbsp;&nbsp;&nbsp;<button type='button' class='Button button3' id='setAddDropEnable'>ADD, DROP 지정</button>" +
    			"<span id='explainAddDropPortSetting' style='margin:0 0 0 20px;background:yellow;visibility:hidden'>ADD, DROP 박스를 Click하면 포트를 지정할 수 있습니다.</span>" +
    			"<span id='diagLegendBlue' name='diagLegend' style='text-align:center;width:60px;color:blue;font-size:1.1em;float:right';'>● B 포트</span>" + 
    			"<span id='diagLegendRed' name='diagLegend' style='text-align:center;width:60px;color:red;font-size:1.1em;float:right;'>● A 포트</span>" +
    			"</div>"
    	);
    	jQuery("#ringAddDropDiv").append("<div id='divRingDiagram' style='height:680px;'></div>");
    	jQuery("#ringAddDropDiv").append("<div class='button_box'><button type='button' class='Button button bg_blue' id='btnPrev'>이전</button><button type='button' class='Button button bg_blue' id='btnInsert'>등록</button></div>");
    	
    	setEventListener();
    	
	    originalLinkPathData = response.data;
    	
	    
	    originalTeamsPath.fromTangoPath(originalLinkPathData);
    	
	    teamsPath = originalTeamsPath.createRingPath();

	    if( teamsPath.NODES.length < 1 ) {		    	
	    	callMsgBox('','W', '링 구성도를 표시할 데이터가 없습니다.', function(msgId, msgRst){
        		if (msgRst == 'Y') {
        			var returnData = {};
            		$a.close(returnData);
        		}
    		});
	    	
	    	return false;
	    }
	    
		//if ( originalLinkPathData.TOPOLOGY_SMALL_CD === '002' || originalLinkPathData.TOPOLOGY_SMALL_CD === '031') {
	    if (originalTeamsPath.isPtpTypeRing() == true) {
			isPtpRing = true;
		} 

		if ( isPtpRing || teamsPath.NODES.length <= 2 ) {
			isDisplayLinear = true;
		}		
		
		// 경유링이 인접링이 경우 인접된 링간 인접노드가 추가되어 있음 해당 노드를 삭제하는 작업을 해줌
		removeAdjacentNode();		
		
		initDiagram();
		generateCircle();
		
		initAddDropNode();
		initButton();  
    }
    
    /**
     * initDiagram
     */
    function initDiagram() {
	    var $ = go.GraphObject.make;
	    if ( isDisplayLinear ) {
	    	ringDiagram = $(go.Diagram, "divRingDiagram", {
	    		initialContentAlignment:go.Spot.Center, padding:10, isReadOnly:true
	    		, initialAutoScale: go.Diagram.UniformToFill
	    		, layout : $(go.GridLayout, {sorting: go.GridLayout.Forward, wrappingColumn:5, spacing: new go.Size(100, 100)})
	    		, maxSelectionCount:0
	    	});
	    } else {
	    	ringDiagram = $(go.Diagram, "divRingDiagram"
	    						, {initialContentAlignment:go.Spot.Center, padding:10, isReadOnly:true
	    								, InitialLayoutCompleted : initPortPosition
	    								, initialAutoScale: go.Diagram.Uniform
	    								, layout : $(go.CircularLayout, {sorting: go.CircularLayout.Forwards, startAngle : -90
//	    										, aspectRatio: 1, sweepAngle: 360, arrangement: go.CircularLayout.ConstantSpacing
//	    										, direction: go.CircularLayout.Clockwise
	    										})
	    								, maxSelectionCount:0
	    					});
	    			
	    }
	    
	    ringDiagram.toolManager.clickSelectingTool.standardMouseSelect = function() {
	    	var diagram = this.diagram;
	    	if(diagram === null || !diagram.allowSelect) return;
	    	var e = diagram.lastInput;
	    	var count = diagram.selection.count;
	    	var curobj = diagram.findPartAt(e.documentPoint, false);
	    	
	    	if(curobj !== null) {
	    		if(count < 2) {
	    			if(!curobj.isSelected) {
	    				var part = curobj;
	    				if(part !== null) {
	    					part.isSelected = true;
	    				}
	    			}
	    		} else {
	    			if(!curobj.isSelected) {
	    				var part = curobj;
	    				if(part !== null) {
	    					diagram.select(part);
	    				}
	    			}
	    		}
	    	} else if(e.left && !(e.controll || e.meta) && !e.shift) {
	    		updateAddDropBtnText();
	    		diagram.clearSelection();
	    	}
	    }
	    
		// LINK_DIRECTION
		if(useNetworkPathDirection == "RIGHT") {
			jQuery("#directionRight").setSelected();
		} else if(useNetworkPathDirection == "LEFT") {
			jQuery("#directionLeft").setSelected();
		} else {
			jQuery("#directionRight").setSelected();
		}		    

		setLegend();
		
	    makeNodeTemplate();
    	makeLinkTemplate();
    }
    
    /**
     * makeNodeTemplate
     */
    function makeNodeTemplate() {
	    var $ = go.GraphObject.make;
    	var inport = makePortShape($, true);
    	var outport = makePortShape($, false);
    	var nodeSize = new go.Size(80, 80);
    	
    	var node = 
    			$(go.Node, "Spot"
				, {locationSpot: go.Spot.Center, name : "nodeData", selectionAdorned:false, selectionChanged: onSelectionChangedNode
					, toolTip : $(go.Adornment, "Auto",
									$(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"}),
									$(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4 })
								)
				}
				, $(go.Picture, {name : "nodeImage", desiredSize: nodeSize}, new go.Binding("source", "NE_ROLE_CD", nodeTypeImage))
				, $(go.Panel, "Vertical", {name : "panelEastPort", alignment: go.Spot.Left}
						, inport
				)
				, $(go.TextBlock, new go.Binding("text", "EAST_PORT_NM"), 
						{name : "txtEastPortNm", font: "12pt Dotum", width : 100, alignment : new go.Spot(0.5,0.5,-100,0), textAlign : "right"}
				)
				, $(go.Panel, "Vertical", {name : "panelWestPort", alignment: go.Spot.Right}
						, outport
				)
				, $(go.TextBlock, new go.Binding("text", "WEST_PORT_NM"), 
						{name : "txtWestPortNm", font: "12pt Dotum", width : 100, alignment: new go.Spot(0.5,0.5,100,0), textAlign : "left"}
				)
				, $(go.TextBlock, new go.Binding("text", "NE_NM"), 
						{font: "14pt Dotum bold", alignment: go.Spot.BottomCenter, width: 200, textAlign : "center"
						, wrap : go.TextBlock.wrapDesiredSize}
				)
		);
    	
    	ringDiagram.nodeTemplate = node;
    }
 
    
    /**
     * makeLinkTemplate
     */
    function makeLinkTemplate() {
    	var $ = go.GraphObject.make;
    	ringDiagram.linkTemplate = $(go.Link, {routing:go.Link.Normal, selectable:false}
		, $(go.Shape, {strokeWidth:2, stroke:"black"}
		, new go.Binding("stroke", "isHighlighted", function(h) {return h ? "green" : "black";}).ofObject())
		, $(go.Shape, {toArrow: "Standard", stroke:"black"}
		, new go.Binding("stroke", "isHighlighted", function(h) {return h ? "green" : "black";}).ofObject())
    	);
    }    
 
    /**
     * generateCircle
     */
    function generateCircle() {
    	ringDiagram.startTransaction("generateCircle");
	    generateNodes();
	    generateLinks();
//	    initNodeDefaultStatus();
	    layoutDiagram();
    	ringDiagram.commitTransaction("generateCircle");
    }
    
    
    /**
     * 처음에 Add, Drop 노드를 선택 표시한다.
     */
    function initAddDropNode() {
    	
    	try {
    		
	    	if ( isNullOrEmpty(useRingTeamsPath) == false ) {
	    		
	    		if ( useRingTeamsPath.NODES.length >= 2 ) {
	    			//	최소 2개 ( Add, Drop ) 의 데이터가 있어야 한다.
	    			var addTeamsNode = useRingTeamsPath.getAddNode();
	    			var dropTeamsNode = useRingTeamsPath.getDropNode();
	    			
	    			var addNeId = addTeamsNode.Ne.NE_ID;
	    			var dropNeId = dropTeamsNode.Ne.NE_ID;
	    			
	    			var addPort = addTeamsNode.APortDescr;
	    			var dropPort = dropTeamsNode.BPortDescr;
	    			
	    			//	Add, Drop Node 설정
	    			var initAddNodeData = teamsPath.findNodeByNe(addNeId);
	    			var intDropNodeData = teamsPath.findNodeByNe(dropNeId);
	    			
	    			if ( initAddNodeData != null ) {
	    				addNode = ringDiagram.findNodeForData(initAddNodeData);
	    			}
	
	    			if ( intDropNodeData != null ) {
	    				dropNode = ringDiagram.findNodeForData(intDropNodeData);
	    			}
	    	    	
	    	    	//	사용 방향이 역방향이면 구간 화살표를 변경한다.
	    	    	if ( useNetworkPathDirection == 'LEFT' ) {
	    	    		reverseLinkDataArray();    		
	    	    	}
	    	    	
	    			drawAddDropMark();
	    	    	addDropStatus = ADD_DROP_STATUS_COMPLETE;
	    			
	    	    	//	drawAddDropMark 후에 Add, Drop 포트를 설정한다.
					if ( addNode != null && addPort != null && addPort.isValid() ) {
	    				initAddNodeData.AddDropPort = addPort;
						isSetAddPortInfo = true;
						showAddDropPort(addNode, 'A');
					}    				
	    				
					if ( dropNode != null && dropPort != null && dropPort.isValid() ) {
						intDropNodeData.AddDropPort = dropPort;
						isSetDropPortInfo = true;
						showAddDropPort(dropNode, 'D');
					}    				
	    		}
	    	}
    	} catch ( err ) {
    		console.log(err);
    	}
    }
    
    
    /**
     * makePortShape
     */
	function makePortShape($, leftside) {
		var shapePortLeft = $(go.Shape, "Circle"
			   			, { name : "shapePortLeft", fill : "red", stroke:null, desiredSize: new go.Size(15, 15)} // , portId : "", toMaxLinks:1
	   					);
		var shapePortRight = $(go.Shape, "Circle"
	   					, { name : "shapePortRight", fill : "blue", stroke:null, desiredSize: new go.Size(15, 15)} // , portId : "", toMaxLinks:1
						);
		var panel = $(go.Panel, "Horizontal", {margin: new go.Margin(2,0)});
	   
		if ( leftside ) {
			panel.add(shapePortLeft);
		} else {
			panel.add(shapePortRight);
		}
		return panel;
	}
        
    
    
    /**
     * 노드를 생성한다.
     */
	function generateNodes() {
		
	    for ( var idx = 0; idx < teamsPath.NODES.length; idx++) {
	    	var node = teamsPath.NODES[idx];
    		
	    	node.key = node.NODE_ID;
	    	node.NE_NM = node.Ne.makeNodeTitle();
	    	node.WEST_PORT_NM = node.BPortDescr.PORT_NM;
	    	node.EAST_PORT_NM  =  node.APortDescr.PORT_NM;
	    	node.NE_ROLE_CD = node.Ne.NE_ROLE_CD;
	    	node.nodeTooltipText = node.toString();
	    	nodeDataArray.push( node );
	    } 
	    
	    ringDiagram.model.nodeDataArray = nodeDataArray;

	}

    /**
     * 함수명 		: initPortPosition
     * parameter 	: 없음
     * return 	 	: 없음
     * 역할 		: 한 노드의 좌우 포트점을 화면 중점 기준으로 중점보다 오른쪽에 노드가 위치하면 포트는 그대로
     * 				  중점보다 왼쪽에 노드가 위치하면 포트는 좌우 변경.
     * 				  ptp는 적용 안 됨.
     */
    function initPortPosition() {

    	var locMaxX = 0;
		var locMinX = 0;
		var locMaxY = 0;
		var locMinY = 0;
		
		// 중점 위치 계산
    	for(var i = 0; i < nodeDataArray.length; i++) {
			var node = ringDiagram.findNodeForData(nodeDataArray[i]);
			var x = node.location.x;
			var y = node.location.y;
			
			if(x > locMaxX) locMaxX = x;
			if(locMinX == 0 || locMinX > x) locMinX = x;
			
			//if(y > locMaxY) locMaxY = x;
			if(y > locMaxY) locMaxY = y;
			if(locMinY == 0 || locMinY > y) locMinY = y;
		}
    	var centerX = (locMaxX + locMinX) / 2;
    	var centerY = (locMaxY + locMinY) / 2;
		
		// 중점 위치의 x값은 처음 노드의 x location값이라 판단됨.
    	if(nodeDataArray.length > 0) {
    		
        	for(var i = 0; i < nodeDataArray.length; i++) {
    			var node = ringDiagram.findNodeForData(nodeDataArray[i]);
    			var x = node.location.x;
    			var y = node.location.y;
    			
//				if( (x - center) < (y - centerY) ) {
    			if ( x < centerX || y > centerY ) {
					if(node.findObject("panelEastPort") != null) {
						node.findObject("panelEastPort").alignment = go.Spot.Right;
						node.findObject("panelWestPort").alignment = go.Spot.Left;
						
						// 포트 텍스트를 같은 panel에서 분리 후에 추가된 소스
						node.findObject("txtEastPortNm").alignment = new go.Spot(0.5,0.5,120,0);
						node.findObject("txtEastPortNm").textAlign = "left";
						node.findObject("txtWestPortNm").alignment = new go.Spot(0.5,0.5,-120,0);
						node.findObject("txtWestPortNm").textAlign = "right";
					}
				}
				
    		}
    	}
    }	
	
    /**
     * 구간(선) 을 생성한다.
     */
    function generateLinks() {
    	if ( teamsPath.NODES.count < 2 )
    		return;

    	var fromKey = null;
    	var toKey = null;
    	
		var count = teamsPath.NODES.length;
		var prevNode = null;
		var curNode = null;
		
	    for ( var idx = 0; idx < count; idx++) {
	    	curNode = teamsPath.NODES[idx];
	    		    	
	    	//	이전 장비 B 포트와 장비 A 포트가 유효해야 연결시킨다.
	    	if ( prevNode != null && prevNode.BPortDescr.isValid() && curNode.APortDescr.isValid() ) {
		    	fromKey = prevNode.NODE_ID;
		    	toKey = curNode.NODE_ID;
				linkDataArray.push( {from : fromKey, to: toKey} );
	    	}
	    	
	    	prevNode = curNode;
	    } 
	    
	    //	일반 링은 마지막 장비와 시작 장비를 연결시켜준다.
    	if ( isDisplayLinear == false && teamsPath.NODES.length > 0 ) {
    		curNode = teamsPath.NODES[0];
    		if ( prevNode != null && prevNode.BPortDescr.isValid() && curNode.APortDescr.isValid() ) {
		    	fromKey = prevNode.NODE_ID;
		    	toKey = curNode.NODE_ID;
			    	
				linkDataArray.push( {from : fromKey, to: toKey} );
    		}
    	}
	    
	    ringDiagram.model.linkDataArray = linkDataArray;
	    
    }
    
    
    /**
     * 노드가 2개일 경우에는 Add, Drop 을 자동 지정한다.
     */
    function initNodeDefaultStatus() {
    
	    //	노드갯수(장비갯수)가 2개인 링인 경우(ptp링 아님) add, drop 미리 지정
	    if ( nodeDataArray.length == 2 && linkDataArray.length == 1) {
   			addNode = ringDiagram.findNodeForData(nodeDataArray[0]);
   			dropNode = ringDiagram.findNodeForData(nodeDataArray[1]);
			
			drawAddDropMark();
			
	    	addDropStatus = ADD_DROP_STATUS_COMPLETE;
	    }
	        	
    }
    
    /**
     * layoutDiagram
     */
    function layoutDiagram() {
    	ringDiagram.startTransaction("layoutDiagram");
    	var lay = ringDiagram.layout;
    	
    	if ( isDisplayLinear ) {
    		
//    		if ( nodeDataArray.length > 3 ) {
//        		lay.wrappingColumn = 3;
//    		} else {
//        		lay.wrappingColumn = nodeDataArray.length;
//    		}
    		
//    		lay.wrappingColumn = 3;
//    		lay.cellSize = new go.Size ( 200, 200 );
//    		lay.spacing = new go.Size ( 50, 50 );
//    		lay.alignment = go.GridLayout.Location;
//    		lay.arrangement = go.GridLayout.LeftToRight;
//    		lay.sorting = go.GridLayout.Forward;
    	} else {
	    	//	1 is circular; > 0
	    	lay.aspectRatio = 1;
	    	//	angle at first element
	    	lay.startAngle = -90;
	    	//	degrees occupied; >= 1, <= 360
	    	lay.sweepAngle = 360;
	    	//	actual spacing also depends on radius
	    	lay.spacing = getSpacing();
	    	//
	    	lay.arrangement = go.CircularLayout.ConstantSpacing;
	    	//
	    	lay.nodeDiameterFormula = go.CircularLayout.Circular;
	    	//
	    	lay.direction = go.CircularLayout.Clockwise;
	    	//
	    	lay.sorting = go.CircularLayout.Forwards;
    	}
	    	
    	ringDiagram.commitTransaction("layoutDiagram");

    }

    /**
     * getAddDropToolTipStr
     */
    function getAddDropToolTipStr() {
    	var str = '';
    	if(addDropStatus === ADD_DROP_STATUS_ADD) {
    		str = 'ADD를 지정하세요';
    	} else if(addDropStatus === ADD_DROP_STATUS_DROP) {
    		str = 'DROP을 지정하세요';
    	}
    	
    	return str;
    }
    
    

    /**
     * onSelectionChangedNode
     */
    function onSelectionChangedNode(node) {
    	
    	var diagram = node.diagram;
    	if(diagram === null) {
    		return;
    	}

        // ADD, DROP선택
    	if ( node.isSelected ) {
    		var checkedNode = node.findObject("nodeImage");
    		checkedNode.source = nodeTypeImageOn(node.data.NE_ROLE_CD);
    		
    		if ( diagram.selection.count === 2 ) {
    			var begin = diagram.selection.first();
    			var end = node;
    			highlightPath(begin, end);
    			addNode = begin;
    			dropNode = end;
    			diagram.setProperties({maxSelectionCount:0});
    			addDropStatus = ADD_DROP_STATUS_COMPLETE;
    			//문구표시
    		    jQuery('#explainAddDropPortSetting').css('visibility', 'visible');
    			setAddDropMark(node, 'D');
    			setAddDropClickEvent(node, 'dropMark');
    		} else if(diagram.selection.count === 1) {
    			addDropStatus = ADD_DROP_STATUS_DROP;
    			setAddDropMark(node, 'A');
    			setAddDropClickEvent(node, 'addMark');
    		}
    		
    	} else {
    		
    		if(addDropStatus != ADD_DROP_STATUS_COMPLETE) {
    			var msg = makeArgMsg("selectObject", cflineMsgArray['equipment']);
	    		callMsgBox('','I', msg, function(msgId, msgRst){
	        		if (msgRst == 'Y') {

	        			addDropStatus = ADD_DROP_STATUS_NONE;
	        			ringDiagram.setProperties({maxSelectionCount:0});
	        			// 설정된 노드 리셋
	    	    		resetDiagram();
	    	    		return;
	        		}
	    		});
    		}
    		
    	}
    }
    
    /**
     * setAddDropMark
     */
    function setAddDropMark(node, div) {
		var $1 = go.GraphObject.make;
		
		if(div === 'A') {
			node.add($1(go.Panel, "Vertical", 
					{name: 'addMark', alignment: new go.Spot(0.5,0.5,0,-70), cursor: 'pointer'},
					$1(go.TextBlock, {text: 'ADD', font: '14pt Dotum bold', stroke: 'white', background : 'green'})
			));
		} else if(div === 'D') {
			node.add($1(go.Panel, "Vertical", 
					{name: 'dropMark', alignment: new go.Spot(0.5,0.5,0,70), cursor: 'pointer'},
					$1(go.TextBlock, {text: 'DROP', font: '14pt Dotum bold', stroke: 'white', background : 'green'})
			));
		}
		
		updateAddDropBtnText();
    }
    
    /**
     * showAddDropPort
     */
    function showAddDropPort(node, div) {
    	if ( node.data.hasOwnProperty('AddDropPort') && isNullOrEmpty(node.data.AddDropPort) == false ) {
    		var $1 = go.GraphObject.make;
    		
    		if(div === 'A') {
    			if(node.findObject('addMarkPort') != null) {
    				node.findObject('addMark').remove(node.findObject('addMarkPort'));
    			}
    			
    			node.findObject('addMark').add($1(go.TextBlock, 
    					{name: 'addMarkPort', text: node.data.AddDropPort.PORT_NM, font: '10pt Dotum', stroke: 'black', background : 'yellow'}
    			));
    			
		 		//	취소선 그리기
//    		 	var originalAPort = node.findObject("txtEastPortNm");
//    		 	if ( originalAPort != null ) {
//    		 		//debugger;
//    		 	}
    		 	
    		} else if(div === 'D') {
    			if(node.findObject('dropMarkPort') != null) {
    				node.findObject('dropMark').remove(node.findObject('dropMarkPort'));
    			}
    			
    			node.findObject('dropMark').add($1(go.TextBlock, 
    					{name: 'dropMarkPort', text: node.data.AddDropPort.PORT_NM, font: '10pt Dotum', stroke: 'black', background : 'yellow'}
    			));
    			
		 		//	취소선 그리기
//    		 	var originalBPort = node.findObject("txtWestPortNm");
//    		 	if ( originalBPort != null ) {
//    		 		//debugger;
//    		 	}
    			
    		}
    	}
    }
    
    /**
     * setAddDropClickEvent
     */
    function setAddDropClickEvent(node, addDropMark) {
    	node.findObject(addDropMark).setProperties({click: function(e, obj){
    		openPortListPop( node, addDropMark );
    	}});
    }
    
    /**
     * openPortListPop
     */
    function openPortListPop( node, addDropMark ) {
    	var neId = nullToEmpty(node.data.Ne.NE_ID);
    	var searchPortNm = '';//nullToEmpty(node.Ne.NE_ID);
		var paramData = new Object();
		$.extend(paramData,{"neId":neId});
		$.extend(paramData,{"portNm":searchPortNm});
		
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		$a.popup({
		  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
		  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
		  	data: paramData,
		  	iframe:true,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 850,
			height : 700,
			callback:function(data){
				if(data != null && data.length > 0){
					var selPort = data[0];

					var addDropPort = new PortDescr();
					addDropPort.PORT_DESCR = selPort.portDescr;
					addDropPort.PORT_ID = selPort.portId;
					addDropPort.PORT_NM = selPort.portNm;
					addDropPort.PORT_STATUS_CD = selPort.portStatCd;
					addDropPort.PORT_STATUS_NM = selPort.portStatNm;
					addDropPort.PORT_DUMMY = ( nullToEmpty(selPort.portDummy) == 'Y' );
					addDropPort.PORT_NULL = ( nullToEmpty(selPort.portId) == '0' );
					addDropPort.PORT_USE_TYPE_CD = selPort.portUseTypeCd;
					addDropPort.PORT_USE_TYPE_NM = selPort.portUseTypeNm;
					addDropPort.PORT_WAVELENGTH = '';
					addDropPort.IS_CHANNEL_T1 = false;
					addDropPort.CHANNEL_DESCR = '';
					addDropPort.CHANNEL_IDS = [];

					addDropPort.RACK_NM = selPort.rackNm;
					addDropPort.RACK_NO = selPort.rackNo;
					addDropPort.SHELF_NM = selPort.shelfNm;
					addDropPort.SHELF_NO = selPort.shelfNo;
					addDropPort.SLOT_NO = selPort.slotNo;
					addDropPort.CARD_ID = selPort.cardId;
					addDropPort.CARD_NM = selPort.cardNm;
					addDropPort.CARD_MODEL_ID = selPort.cardModelId;
					addDropPort.CARD_MODEL_NM = selPort.cardModelNm;
					addDropPort.CARD_STATUS_CD = selPort.cardStatusCd;
					addDropPort.CARD_STATUS_NM = selPort.cardStatusNm;
					addDropPort.CARD_WAVELENGTH = selPort.cardWavelength;					
					
					node.data.AddDropPort = addDropPort;
					
					var div = '';
					if(addDropMark.indexOf('add') == 0) {
						div = 'A';
						isSetAddPortInfo = true;
					} else if(addDropMark.indexOf('drop') == 0) {
						div = 'D';
						isSetDropPortInfo = true;
					}
					showAddDropPort(node, div);
				}
			}
		}); 
    }
    

    /**
     * highlightPath
     */
    function highlightPath(begin, end) {
    	/****************************************************************************
    	 * 1. 정방향일 경우
    	 *  - ADD장비의 좌포트가 ADD가 되고 DROP장비의 우포트가 DROP이 된다.
    	 * 2. 역방향일 경우
    	 *  - ADD장비의 우포트가 ADD가 되고 DROP장비의 좌포트가 DROP이 된다.
    	 *  # begin : add, end : drop
    	 ****************************************************************************/
    	var addLeft = begin.findObject("txtEastPortNm").text;
    	var addRight = begin.findObject("txtWestPortNm").text;
    	var dropLeft = end.findObject("txtEastPortNm").text;
    	var dropRight = end.findObject("txtWestPortNm").text;
    	
    	var addDropText = "";
    	var direction = jQuery("input[name=direction]").getValue();
    	if ( direction === "RIGHT" ) {
    		// 정방향
    		begin.findObject("panelEastPort").stroke = "black";
    		end.findObject("panelWestPort").stroke = "black";
    		begin.findObject("panelEastPort").strokeWidth = 2;
    		end.findObject("panelWestPort").strokeWidth = 2;
    		
    		addDropText = addLeft + " / " + dropRight;
    		
    		// 리셋
    		begin.findObject("panelWestPort").stroke = null;
    		end.findObject("panelEastPort").stroke = null;
    	} else if( direction === "LEFT" ) {
    		// 역방향
    		begin.findObject("panelWestPort").stroke = "black";
    		end.findObject("panelEastPort").stroke = "black";
    		begin.findObject("panelWestPort").strokeWidth = 2;
    		end.findObject("panelEastPort").strokeWidth = 2;
    		addDropText = addRight + " / " + dropLeft;
    		
    		// 리셋
    		begin.findObject("panelEastPort").stroke = null;
    		end.findObject("panelWestPort").stroke = null;
    	}
    	
//		jQuery("#dataDiv").html(addDropText);
    	
    	//	Add, Drop 사이의 노드, 구간을 찾는다.
    	var firstData = begin.data;
    	var lastData = end.data;
    	
    	//	역방향일 때는 서로 맞바꾸어 찾아야 한다.
    	if ( direction === "LEFT" ) {
        	firstData = end.data;
        	lastData = begin.data;
    	}
    	
    	var firstIdx = -1;
    	var lastIdx = -1;
    	for ( var idx = 0; idx < nodeDataArray.length; idx++) {
    		var nodeData = nodeDataArray[idx];
    		if ( nodeData === firstData ) {
    			firstIdx = idx;
    		}
    		
    		if ( nodeData === lastData ) {
    			lastIdx = idx;
    		}
    	}
    	
    	var path = new go.List();
    	
        if ( firstIdx <= lastIdx ) {
            var startIdx = firstIdx;
            var endIdx = Math.min( lastIdx, nodeDataArray.length  - 1 );
            for ( var idx = startIdx; idx <= endIdx; idx++ ) {
                var nodeData = nodeDataArray[idx];
                var node = ringDiagram.findNodeForData(nodeData);
                path.add(node);
            }
            
        } else {
        
        	//	첫번째 위치가 마지막 위치보다 큰 경우에는 구간 목록 마지막까지 추가한후
        	//	0 부터 다시 마지막 위치까지 추가한다.
        	//	ex) 목록수 5개, 시작 위치 : 3, 마지막 위치 : 1 ==> IDX 가 3, 4, 0, 1 인 것을 추가.
            var startIdx = firstIdx;
            var endIdx = nodeDataArray.length - 1;
            
            for ( var idx = startIdx; idx <= endIdx; idx++ ) {
                var nodeData = nodeDataArray[idx];
                var node = ringDiagram.findNodeForData(nodeData);
                path.add(node);
            }
            
            startIdx = 0;
            endIdx = Math.min( lastIdx, nodeDataArray.length  - 1 );
            for ( var idx = startIdx; idx <= endIdx; idx++ ) {
                var nodeData = nodeDataArray[idx];
                var node = ringDiagram.findNodeForData(nodeData);
                path.add(node);
            }
             
        }    	
    	
        
    	// 노드 색깔
    	for ( var i = 0; i < path.count; i++ ) {
    		var node = path.elt(i)
    		var checkedNode = node.findObject("nodeImage");
    		checkedNode.source = nodeTypeImageOn(node.data.NE_ROLE_CD);    		
    	}

        //	역방향일 때는 순서를 역정렬해서 구간을 칠해야 한다.	
    	if ( direction === "LEFT" ) {
        	path.reverse();
        }
    	
    	// 링크 색깔
    	for(var i = 0; i < path.count -1; i++) {
    		var f = path.elt(i);
    		var t = path.elt(i+1);
    		
    		f.findLinksTo(t).each(function(l) {
    			l.isHighlighted = true;
    		});
    	}
    	
    	addDropStatus = ADD_DROP_STATUS_COMPLETE;
    }
    

    /**
     * initButton
     */
    function initButton() {
    	if(editYn == false || editYn === "N") {
    		jQuery("#setAddDropEnable").remove();
    		jQuery("#btnPrev").remove();
    		jQuery("#btnInsert").remove();
    		jQuery("#directionRight").setEnabled(false);
    		jQuery("#directionLeft").setEnabled(false);
    	}
    }

    /**
     * removeAdjacentNode
     * 링의 경유링이 인접링인 경우 인접노드를 추가
     * 링 구성도에 가상으로 추가된 인접노드로 인해 링 연결이 끊김
     * => 링 구성도에서는 가상의 인접노드를 삭제하고
     *    RIGHT노드의 B포트 정보를 LEFT노드의 B포트에 설정 
     */
    function removeAdjacentNode(){
    	 for ( var idx = 0; idx < teamsPath.NODES.length; idx++) {
    		 var node = teamsPath.NODES[idx];
    		 if (node.ADJACENT_NODE == 'Y' && node.PREFIX == 'RIGHT_' && idx > 0 ) {
			    var adjacentNode = teamsPath.NODES[idx-1];
			    adjacentNode.BPortDescr = node.BPortDescr;
				teamsPath.NODES.splice( idx, 1 );
			}
    	}
    }

});
