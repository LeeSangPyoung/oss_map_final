/**
 * RmNtwkLinePop
 *
 * @author Administrator
 * @date 2017. 11. 13.
 * @version 1.0
 */
var paramData = null;
var selectDataObj = null;
var returnTieMapping = [];
var trunkGrid = "trunkGrid";
var trunkData = null;
/**
 * gojs object 생성
 */
var $go = go.GraphObject.make;

/**
 * 선번 원본
 */
var originalPath = null;

/**
 * TEAMS 선번의 사용 네트워크 구간은 양 끝 노드만 포함하는 선번
 */
var teamsPath = null;
var teamsShortPathData = null;

var rmOriginalTeamsPath = new TeamsPath();

/**
 * TEAMS 포인트 방식 RM 선번 전체 ( RM + TRUNK )
 */
var rmTeamsPath = new TeamsPath();

/**
 * TEAMS 포인트 방식의 회선 선번(그리드 데이터)
 */
var teamsPathData = null;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeDataArray = [];

/**
 * 구간 그래프 객체의 데이터 목록
 */
var linkDataArray = [];

/**
 * gojs diagram
 */
var visualLinePath;

/**
 * 전송실
 */
var mtsoId = "";
/**
 * 전송실 List
 */
var mtsoList = [];

$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
    	
		//param.lftEqpId = 'DV10214774432';
	    //param.lftPortId = '1723';
	    //param.rghtEqpId = 'DV10214774434';
 	    //param.rghtPortId = '35'; 
		 
    	paramData = param;
		initGrid();
		initDiagram();
        setEventListener();  
        searchList();
    };
    

    //Grid 초기화
    function initGrid (){  
    	
    	//그리드 생성
        $('#' + trunkGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,  
//        	rowInlineEdit : true, //행전체 편집기능 활성화
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		pager:false,
			height : 255,	    	      
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [ //{ selectorColumn : true, width : '50px' } 
			 	 {title : cflineMsgArray['sequence'] /*순번*/,	align:'center', width: '40px', numberingColumn: true }
			 	, {key : 'ntwkLineNo'	, title : cflineMsgArray['trunkIdentification']/*트렁크ID*/, align:'center'	, width: '120px' , hidden : true}
				, {key : 'ntwkStatNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px' , hidden : true}
	            , {key : 'ntwkLineNm'	, title : cflineMsgArray['trunkNm']/*트렁크명*/, align:'left'	, width:'280px'	}
	            , {key : 'mgmtGrpNm'	    ,title : cflineMsgArray['managementGroup'] /* 관리그룹 */	,align:'center', width: '90px'}
	            , {key : 'ntwkCapaCdNm'	, title : cflineMsgArray['capacity'] /*용량*/, align:'center'	, width: '55px'}
	            , {key : 'lineOpenDt'	    ,title : cflineMsgArray['openingDate'] /* 개통일자 */ ,align:'center', width: '80px'}
	            , {key : 'lastChgDate'	, title : cflineMsgArray['modificationDate']/*수정일자*/, align:'center'	, width: '80px'
	            	,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
					,  editable : true}
	  			, {key : 'uprMtsoNm'	, title : cflineMsgArray['upperMtsoNm']/*상위국사명*/, align:'left'	, width: '100px'}
	  			, {key : 'lowMtsoNm'	, title : cflineMsgArray['lowerMtsoNm']/*하위국사명*/, align:'left'	, width: '100px'} 
	  			]
			});
    };         

    function setEventListener() { //	  
     	// 그리드 더블클릭
 		$('#'+trunkGrid).on('dblclick', '.bodycell', function(e){
	   		var data = AlopexGrid.parseEvent(e).data;
	   		var  ntwkLineNo = data.ntwkLineNo;
	   		
			var searchParam = {"ntwkLineNo":ntwkLineNo,"wkSprDivCd":"01","autoClctYn":"N","ringMgmtDivCd":"1"}
			cflineShowProgress(trunkGrid);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', searchParam, 'GET', 'selectNetworkPath')

			.done(function(response){				
				if(response.data == null){
					alertBox('A', "트렁크 선번이 존재하지 않습니다.");
					return;								
				}else{
					//	트렁크 추가
					var trunkPath = new TeamsPath();
					trunkData = response.data;
					trunkPath.fromTangoPath(response.data);
					if ( trunkPath.NODES.length == 0 ) {
						alertBox('A', "트렁크 선번이 없어 등록할 수 없습니다.");
						return;
					} 
					
					rmTeamsPath = rmOriginalTeamsPath.clone();
					rmTeamsPath.insertNode(null, trunkPath);
					teamsShortPathData = rmTeamsPath.toShortPath();
					
					generateDiagram();
					cflineHideProgress(trunkGrid);
				};
			});   
	    });  		
 		$("#btnlineNoShift").on("click",function(){  //교체 버튼 클릭
 			if(teamsShortPathData == null){
 				alertBox("A","선택된 트렁크가 없어 교체 할 수 없습니다.");
 				return;
 			};
 			$a.close(trunkData);
 		});
 		$("#btnPopClose").on("click",function(){  //닫기 버튼 클릭
 			$a.close();
 		});
    }
	function searchList(){
		var dataParam = $.extend({},paramData);
		cflineShowProgress(trunkGrid);
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rmlinepath/selectTrunkListByPath', dataParam, 'GET', 'selectTrunkListByPath');
	}
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'selectTrunkListByPath'){
    		cflineHideProgress(trunkGrid);
    		$('#'+trunkGrid).alopexGrid("dataSet", response.lists);
    		if(response.lists.length == 0){
    			opener.alertBox('A', "수용 트렁크가 존재하지 않습니다.");
    			$a.close();
    		}
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'selectTrunkListByPath'){
    		cflineHideProgress(trunkGrid);
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }

    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	var deferred = $.Deferred();
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response, status, jqxhr, flag){
    		successCallback(response, status, jqxhr, flag);
    		deferred.resolve(response);
    	}).fail(failCallback);
    	return deferred.promise();
    }

   	//*****************************************************************************************//
    
    /**
     * 시각화 다이어그램 init
     */
    function initDiagram() {
    	visualLinePath =
    		$go(go.Diagram, "visualDiv",
    	        {
    			  //maxSelectionCount: 0,
    			  layout:
    	        	  $go(go.GridLayout,
    			              {  
    	        		  			wrappingWidth: Infinity, cellSize: new go.Size(4, 4), spacing: new go.Size(20, 20),
    	        		  			alignment: go.GridLayout.Position,
//    	        		  			arrangement:go.GridLayout.Position,
    	        		  			arrangement: go.GridLayout.Location,
    	        		  			comparer: function(a, b) {
    									var av = a.data.SEQ;
    									var bv = b.data.SEQ;
    									if(av < bv) return -1;
    									if(av > bv) return 1;
    									return 0;
    	        		  			}
    	        	                , wrappingColumn:4
    			              }), 
    	          initialContentAlignment: go.Spot.Center,
    	          "toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom,
    		      isEnabled: true
    	        }
    		);
    	
    	makeNodeTemplate();
    	makeLinkTemplate();
    	setDiagramClickEvent();
    	
    	visualLinePath.allowDelete = false;
    	
    }
    
    // 노드 만들기
    function makeNodeTemplate() {
    	setNodeTemplate();
    	setGroupTemplate();
    }
    
    /**
     * 서비스 회선
     * 노드 템플릿 정의
     *  - 좌포트, 좌채널, 장비, 우포트, 우채널 모양의 테이블 생성
     */
    function setNodeTemplate() {
    	var node = baseNodeTemplate();
    	visualLinePath.nodeTemplate = node;
    }
    

    /**
     * 서비스 회선
     * 그룹 템플릿 정의
     *   - 사용 네트워크를 그룹핑 하는 템플릿
     *   @returns
     */
    function setGroupTemplate() {
    	var group = baseGroupImageTemplate();
    	
    	visualLinePath.groupTemplateMap.add("TRUNK", group);
    	visualLinePath.groupTemplateMap.add("RING", group);
    	visualLinePath.groupTemplateMap.add("WDM_TRUNK", group);
    };
        
    /**
     * 서비스회선 링크 템플릿
     */
    function makeLinkTemplate() {
    	visualLinePath.linkTemplate = baseLinkTemplate();
    }    
        
    /**
     * 기본 템플릿. 텍스box트
     * @returns
     */
    function baseNodeTemplate() {
    	
    	var node =
    		$go(go.Node, "Auto",
    	        {
    				mouseDrop: function(e, nod) { 
    					if(nod.containingGroup != null) {
    						visualLinePath.currentTool.doCancel();
    					} else {
    						finishDrop(e); 
    					}
    				}
    				, mouseEnter: mouseEnter
    				, mouseLeave : mouseLeave
//    				, contextMenu: contextMenu()
    	        }
    		
    	        , $go(go.Shape, "RoundedRectangle" , { fill: null, strokeWidth: 2, name: "SHAPE" , parameter1: 10, stroke: null})	// , new go.Binding("stroke", "color")  
    			, $go(go.Panel, "Vertical"
    				, $go(go.Panel, "Horizontal"
    							, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
    									, toolTip : $go(go.Adornment, "Auto"
    												, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
    												, $go(go.TextBlock, new go.Binding("text", "", nodeTooltipText), { margin: 4 })
    									) 
    							}
//    							, new go.Binding("background", "color")
    							, $go(go.TextBlock
    									, {
    										margin: 5,
//    										alignment: go.Spot.Left,
    							            isMultiline: true,
    							            editable: false,
    							            font: "bold 10px sans-serif",
    							            wrap: go.TextBlock.WrapFit,
//    							            stroke: "#404040",
//    							            opacity: 0.75,
    							            width: 145,
    							            height: 31
    						             }
    									, new go.Binding("text", "NE_NM").makeTwoWay()
    							)
    							
    							
    				)  // end Horizontal Panel
    						
    				, $go(go.Panel, "Table"
    						, { padding: 0.1}
    						, $go(go.RowColumnDefinition, {row: 0, separatorStroke: "black" })
    						, $go(go.RowColumnDefinition, {column: 0 })
    						, $go(go.RowColumnDefinition, {column: 1 })
    						, $go(go.RowColumnDefinition, {column: 2 })	// , separatorStroke: "black"
    						
    						
    						, $go(go.Panel, "Auto"
    								, {row : 0, column : 0, width:60, height: 70}
    								, $go(go.Shape, "RoundedRectangle", {height:60, stroke: null, fill:null })
    								, $go(go.Shape, "RoundedRectangle", { height:40, margin: 3, stroke: null, fill:null, name: "EAST_PORT_CHANNEL_PART" })
    								, $go(go.TextBlock
    										, {
//    											alignment: go.Spot.Center,
    											textAlign:"center",
    											isMultiline: true,
    											editable: false,
    											margin: 1,
    											font: "bold 10px sans-serif",
    											maxSize: new go.Size(60, 60),
    											minSize: new go.Size(60, NaN),
    											wrap: go.TextBlock.WrapFit,
    											name : "EAST_PORT_CHANNEL"
    										}
    										, new go.Binding("text", "EAST_PORT_CHANNEL").makeTwoWay()
    								)
    						)
    						
    						, $go(go.Picture
    								, {row : 0, column : 1, name : "nodeImage", desiredSize: new go.Size(40,40), margin: 1 }
    								, new go.Binding("source", "NE_ROLE_CD", comvertPathNodeImage)
    						)
    						
    						, $go(go.Panel, "Auto"
    								, {row : 0, column : 2, width:60, height: 70}
    								, $go(go.Shape, "RoundedRectangle", {height:60, stroke: null, fill:null })
    								, $go(go.Shape, "RoundedRectangle", { height:40, margin: 3, stroke: null, fill:null, name: "WEST_PORT_CHANNEL_PART" })
    								, $go(go.TextBlock
    										, {
//    											alignment: go.Spot.Center,
    											textAlign:"center",
    											isMultiline: true,
    											editable: false,
    											margin: 1,
    											font: "bold 10px sans-serif",
    											maxSize: new go.Size(60, 60),
    											minSize: new go.Size(60, NaN),
    											wrap: go.TextBlock.WrapFit,
    											name : "WEST_PORT_CHANNEL"
    										}
    										, new go.Binding("text", "WEST_PORT_CHANNEL").makeTwoWay()
    								)
    						)
    				)
    				 
    				
    	       )
    	    );
    	
    	return node;
    }
    
    
    function baseGroupImageTemplate() {
    	var group = $go(go.Group, "Auto", 
     				{
    		 			background: "transparent",
    	 				layout:  
    						$go(go.GridLayout
    							, { wrappingWidth: Infinity, wrappingColumn:4, cellSize: new go.Size(4, 4), spacing: new go.Size(10, 10),
    								alignment: go.GridLayout.Position,
    								comparer: function(a, b) {
    									var av = a.data.SEQ;
    									var bv = b.data.SEQ;
    									if(av < bv) return -1;
    									if(av > bv) return 1;
    									return 0;
    								}
    							} // wrappingWidth: Infinity, 
    					)
    					, mouseEnter: mouseEnter
    					, mouseLeave : mouseLeave
    					, mouseDrop: function(e, nod) { 
    						if(nod.isSubGraphExpanded) {
    							// 펼쳐진 상태이면
    							visualLinePath.currentTool.doCancel();
    						} else {
    							finishDrop(e); 
    						}
    					}	
    					, handlesDragDropForMembers: false
    					, isSubGraphExpanded : true
    					, subGraphExpandedChanged: function(group) {
    						if(group.isSubGraphExpanded) {
    							// 펼쳐져 있으면 이미지 숨기기
    							group.findObject("groupImageLarge").visible = false;
    							group.findObject("groupImageSmall").visible = true;
    							group.findObject("networkNm").width = 300;
    						} else if(!group.isSubGraphExpanded) {
    							// 묶여져 있으면 이미지 보이기
    							group.findObject("groupImageLarge").visible = true;
    							group.findObject("groupImageSmall").visible = false;
    							group.findObject("networkNm").width = 100; 
    						}
    						
    						visualLinePath.contentAlignment = go.Spot.Center;
    					}
//    					, contextMenu: contextMenu()
    					
    				}
    				, $go(go.Shape, "RoundedRectangle" , { name:"SHAPE", parameter1: 20, fill : null, stroke : null}) // , new go.Binding("stroke", "color")  fill: "rgb(255,255,255)", stroke:"rgba(0,0,0,0.3)"
    				, $go(go.Panel, "Vertical"
    					, $go(go.Panel, "Horizontal"
    								, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
    									, toolTip : $go(go.Adornment, "Auto"
    													, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
    													, $go(go.TextBlock, new go.Binding("text", "NETWORK_NM"), { margin: 4 })
    									)
    								}
//    								, new go.Binding("background", "color")
    								, $go("SubGraphExpanderButton"
    										, { alignment: go.Spot.Right, margin: 5 })
    								, $go(go.Picture
    										, {name : "groupImageSmall", desiredSize: new go.Size(30,30), margin: 10, visible : true}
    										, new go.Binding("source", "category", comvertPathImage)
    								)
    								, $go(go.TextBlock
    										, {
    												margin: 5,
    												alignment: go.Spot.Left,
    												isMultiline: true,
    												editable: false,
    												font: "bold 11px sans-serif",
    			//								            wrap: go.TextBlock.WrapFit,
//    												stroke: "#404040",
//    												opacity: 0.75,
    												width: 300,
    												height:30,
    												name : "networkNm"
    									}
    									, new go.Binding("text", "NETWORK_NM").makeTwoWay()
    									, new go.Binding("stroke", "color")
    								)
    								
    								
    					)  // end Horizontal Panel
    					, $go(go.Picture
    								, {name : "groupImageLarge", desiredSize: new go.Size(60,60), margin: 1, visible : false }
    								, new go.Binding("source", "category", comvertPathImage)
    					)
    					, $go(go.Placeholder
    							, { padding: 5, alignment: go.Spot.Center }
    					)
    			)  // end Vertical Panel
    		);
    	
    	return group;
    }
    
    /**
     * 링크 템플릿
     * @returns
     */
    function baseLinkTemplate() {
    	var link = $go(go.Link
    			//, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left} // 여러개 일경우
    			, {routing:go.Link.JumpGap, corner:5, selectable:true, fromSpot: go.Spot.Right, toSpot: go.Spot.Left,
		    		doubleClick : function(e){
						console.log(e);
					},
					contextMenu : 
				    		$go(go.Adornment, "Vertical",
				    			$go("ContextMenuButton", $go(go.TextBlock, "수용트렁크 찾기", 
				    					{ click: function(e,obj){
											var linkInfo = obj.part.adornedPart.data;
											var leftNode =  visualLinePath.findNodeForKey(linkInfo.from).part.data;
											var rightNode =  visualLinePath.findNodeForKey(linkInfo.to).part.data;
											var param = {lftEqpId:leftNode.NE_ID,lftPortId:leftNode.EAST_PORT_ID,rghtEqpId:rightNode.NE_ID,rghtPortId:rightNode.WEST_PORT_ID};
											
											 var strTitle = "수용 트렁크 선택";
											 $a.popup({
												popid: "RmTrunkListPop",
												title: strTitle,
												url: getUrlPath() +'/configmgmt/cfline/RmTrunkListPop.do',
												iframe: true,
												data: param,
												modal: true,
												movable:true,
												windowpopup : true,
												width : 920,
												height: 800,
												callback:function(data){
													
												}
											 });
											 
				    					}}))
				    		)
    			} 
    			//, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top} 한개일 경우
    			, new go.Binding("fromSpot", "fromSpot", go.Spot.parse)
    			, new go.Binding("toSpot", "toSpot", go.Spot.parse)
    			, $go(go.Shape, {strokeWidth:1, stroke:"black"})
    			, $go(go.Shape, {toArrow: "Standard", stroke:"black"})
    	);
    	
    	return link;
    }
    
    function mouseEnter(e, obj) {
    	var shape = obj.findObject("SHAPE");
    	shape.stroke = "#6DAB80";
    	shape.strokeWidth = 2;
    	
    	if(obj.data.NE_ROLE_CD != undefined) {
    		obj.findObject("nodeImage").source = comvertPathNodeImageOn(obj.data.NE_ROLE_CD); 
    	}
    }

    function mouseLeave(e, obj) {
    	var shape = obj.findObject("SHAPE");
    	shape.stroke = obj.data.color;
//    	if(obj.data.isGroup) {
//    		shape.stroke = "rgba(0,0,0,0.3)";		
//    	} else {
//    		shape.stroke = null;
//    	}
    	
    	shape.stroke = null;
//    	shape.strokeWidth = 2;
//    	shape.background = "transparent";
    	
    	if(obj.data.NE_ROLE_CD != undefined) {
    		obj.findObject("nodeImage").source = comvertPathNodeImage(obj.data.NE_ROLE_CD); 
    	}
    }
    
 // 노드 툴팁
	 function nodeTooltipText(data) {
	     var str = "";
	     str = '장비ID : ' + nullToEmpty(data.Ne.NE_ID) + '\n장비명 : ' + nullToEmpty(data.Ne.NE_NM) + '\n장비역할 : ' + nullToEmpty(data.Ne.NE_ROLE_NM)
	 	+ '\n제조사 : ' + nullToEmpty(data.Ne.VENDOR_NM)
	 	+ '\n모델 : ' + nullToEmpty(data.Ne.MODEL_NM)
	 	+ '\n모델(대) : ' + nullToEmpty(data.Ne.MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.Ne.MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.Ne.MODEL_SCL_NM)
	  	+ '\n상태 : ' + nullToEmpty(data.Ne.NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.Ne.ORG_NM) + '\n전송실 : ' + nullToEmpty(data.Ne.ORG_NM_L3)
	  	+ '\n더미장비 : ' + nullToEmpty(data.Ne.NE_DUMMY);
	     
	     return str;
	 }
	 
	 function comvertPathImage(category) {
	    	var path = getUrlPath() + "/resources/images/path/" + category + ".png";
	    	return path;
	    }
	 
	 function comvertPathNodeImage(neRoleCd) {
		 return getEqpIcon(neRoleCd,"");
	 }
	 
	 function comvertPathNodeImageOn(neRoleCd) {
		 return getEqpIcon(neRoleCd,"S");
	}
    /**
     * generateDiagram
     */
    function generateDiagram() {
    	//visualLinePath.startTransaction("generateDiagram");
    	
		nodeDataArray = [];
		linkDataArray = [];
    	
        generateNodes();
        generateLinks();
        
        visualLinePath.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        //visualLinePath.commitTransaction("generateDiagram");        
        nodeSelectionAdornedPath();
    }
    
   	/**
     * 노드를 생성한다.
     */
    function generateNodes() {
    	useTrunkNetworkId = null;
    	useRingNetworkId = null;
    	useWdmTrunkNetworkId = null;
    	var guid = null;
    	
        for ( var idx = 0; idx < teamsShortPathData.NODES.length; idx++) {
        	var node = teamsShortPathData.NODES[idx];
//        	node.key = idx;
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
        	node.category = "NE";
        	
        	node.color = "#DDDDDD";        	
        	
//        	node.color = "#BFAFAF";
        	
        	node.nodeTooltipText = node.toString();
        	// 노드를 그룹화 한다
        	node = generateGroupNodes(node, "line");
        	

        	// 가상여부에 따라 색상을 달리함
        	//console.log(node);
        	//console.log(node.VIRTUAL_YN);
        	
        	nodeDataArray.push( node );
        }
        
        // rest seq
        for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
        	nodeDataArray[idx].SEQ = idx + 1;
        }
    }

    /**
     * 서비스 회선 그룹 노드 생성
     *  - 노드를 묶는 trunk, ring, wdmTrunk 그룹 생성
     */
    function generateGroupNodes(node, lineNetwork) {
    	if(node.isTrunkNode()) {
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
    
    /**
     * 서비스 회선 그룹 노드의 타입별로 디자인 생성
     * @param  node : 노드, network : 네트워크타입, : 연결타입 
     */
    function generateTeamsNodeGroup(node, network, lineNetwork) {
    	var networkArray = new Array();
    	if(network == "Trunk") {
    		networkArray.push("TRUNK");
    		networkArray.push("#F1EBBF");
    	} else if(network == "Ring") {
    		networkArray.push("RING");
    		networkArray.push("#FFEAEA");
    	} else if(network == "WdmTrunk") {
    		networkArray.push("WDM_TRUNK");
    		networkArray.push("#D6EED6");
    	}
    	 
    	var teamsNode = new TeamsNode();
    	teamsNode.key = guid();
    	teamsNode.NODE_ID = node.NODE_ID;
    	teamsNode.isGroup = true;
    	teamsNode.expanded = false;
    	teamsNode.category = networkArray[0];
    	var networkNm = eval("node."+network+".NETWORK_NM");

    	teamsNode.NETWORK_NM = networkNm;
    	teamsNode.color = networkArray[1];
    	teamsNode.NETWORK_ID = eval("node."+network+".NETWORK_ID");
    	teamsNode.PATH_SAME_NO = eval("node."+network+".PATH_SAME_NO");
    	
    	if(network == "Trunk") {
    		// 트렁크
    		teamsNode.category = 'TRUNK';
    		teamsNode.color = '#A89824';
    	} 
    	if(lineNetwork == "line") {
    		nodeDataArray.push(teamsNode);
    	} else if(lineNetwork == "trunk") {
    		nodeTrunkDataArray.push(teamsNode);
    	} 
    	
    	return teamsNode.key;
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
    	
    	for ( var idx = 0; idx < count; idx++) {
        	curNode = teamsShortPathData.NODES[idx];
//        	fromKey = idx - 1;
//        	toKey = idx;
        	
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
     * 다이어그램 사용네트워크 클릭 이벤트
     */
    function setDiagramClickEvent() {
    	visualLinePath.addDiagramListener("ObjectDoubleClicked", 
    			function(e) {
    				var part = e.subject.part;
    				
    				if(part.data.category != undefined) {
    					if(part.data.category == "TRUNK") {
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
    };
    // context menu
    function contextMenu() {
    	var contextMenu = $go(go.Adornment, "Vertical",
    				$go("ContextMenuButton",
    						$go(go.TextBlock, "선번 삭제")
    						, {
    							click : function(e, obj) {
    								var node = obj.part.adornedPart;
    								removeNode(node);
    							}
    						}
    				),
    				$go("ContextMenuButton",
    						$go(go.TextBlock, "A, B포트 바꾸기")
    						, {
    							click : function(e, obj) {
    								var node = obj.part.adornedPart;
    								swapPort(node);
    							}
    						}
    				)
    	);
    	
    	return contextMenu;
    }

    function contextMenuNetwork() {
    	var contextMenu = $go(go.Adornment, "Vertical",
    			$go("ContextMenuButton",
    					$go(go.TextBlock, "상세 보기")
    					, {
    						click : function(e, obj) {
    						var node = obj.part.adornedPart;
    						networkInfoPop(node);
    					}
    				}
    			)
    	);
    	
    	return contextMenu;
    }    
    // 사용 네트워크 내의 장비 노드 선택 불가능하도록
	 function nodeSelectionAdornedPath() {
	 	for(var idx = 0; idx < nodeDataArray.length; idx++) {
	 		var nodeData = nodeDataArray[idx];
	 		var node = visualLinePath.findNodeForData(nodeData);
	 		
	 		if(!nodeData.isGroup && nodeData.isNetworkNode()) {
	 			node.selectionAdorned = false;
	 			node.movable = false;
	 		} else {
	 			if(nodeData.isGroup) {
	 				if(visualLinePath.isEnabled == true) {
	 					node.contextMenu = contextMenuNetwork();
	 				} 
	 			} else {
	 				if(visualLinePath.isEnabled == true) {
	 					node.contextMenu = contextMenu();
	 				}
	 			}
	 		}
	 	}
	 };
});