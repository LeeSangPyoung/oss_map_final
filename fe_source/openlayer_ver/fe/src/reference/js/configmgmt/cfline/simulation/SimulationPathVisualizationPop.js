/** 
 * ServiceLineSimulWithVisualization.js
 *
 * @author P092781
 * @date 2017.09.19
 * @version 1.0
 */

var tempRingData = {};

var testNode = null;
/**
 * gojs object 생성
 */
var $go = go.GraphObject.make;

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
 * 사용네트워크 그룹핑을 위한 아이디
 */
var useNetworkId = null;

/**
 * 사용트렁크의 그룹핑을 위한 아이디 
 */
var useTrunkNetworkId = null;

/**
 * 사용링의 그룹핑을 위한 아이디
 */
var useRingNetworkId = null;

/**
 * 사용WDM트렁크의 그룹핑을 위한 아이디
 */
var useWdmTrunkNetworkId = null;

var initParam = null;

var ringInitParam = null;



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
 * 선택선번 teams path
 */
var selectedLinePathDiv;

var selectedTeamsPath = null;//new TeamsPath();

var selectedShortPathData = null;

var selectedOriginalPath = new Object();

/**
 * 선택 선번 객체의 데이터 목록
 */
var selectedPathNodeDataArray = [];

/**
 * 선택 선번 구간 그래프 객체의 데이터 목록
 */
var selectedPathLinkDataArray = [];

/**
 * 수정권한
 */
var workYn = null;

var testNode = null;

// 창 닫을때 변경여부 반영을 위해
var changeYn = "N";

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	cflineShowProgressBody();
		initDiagram();

        changeYn = "N";
        
        //x버튼으로 닫기
        $(window).unload(function(){//.on('beforeunload', function(e) {        	
        	var returnParam = {
        			"changeYn" : changeYn	
        		};
        	var windowOpener = window.opener.$.alopex.popup.config[window.name];
        	//windowOpener.callback(changeYn);
        	// 저장후 자동으로 닫히는 경우가 아닌 닫기 혹은 x버튼으로 닫을 경우 
        	// 저장후 데이터를 넘기고 싶을 경우 처리
        	if (changeYn == "Y") {
        		// windowOpener.callback(changeYn); <- 결과 플레그만 넘길경우
        		windowOpener.callback(returnParam); //<- 데이터 값으로 넘기는 경우
        	}
        	//console.log("pop changeYn : " + changeYn);
            //window.opener.$.alopex.popup.config[window.name].callback(returnParam);
        });

    };
});

function searchAddress() {
	$a.popup({
		popid : 'SearchAddress',
		url : '/tango-transmission-web/demandmgmt/buildinginfomgmt/SearchAddress.do',
		iframe : true,
		modal : true,
		width : 830,
		height : 630,
		data : {callType : 'SRVC_SIMUL'},
		title : cflineMsgArray['addressSearch'],
		movable : true,
		callback : function(data){
			
			//console.log(data);
			
			var bunji = "";
			
			if(data.selectSmlBunjiVal != "") {
				//console.log(parseInt(data.selectSmlBunjiVal));
				if(parseInt(data.selectSmlBunjiVal) != "0") {
					bunji = parseInt(data.selectBigBunjiVal) + "-" + parseInt(data.selectSmlBunjiVal);
				}
				else {
					bunji = parseInt(data.selectBigBunjiVal);
					//console.log(" data.selectSmlBunjiVal : " + data.selectSmlBunjiVal );
				}
			}
			else {
				//console.log( parseInt(data.selectBigBunjiVal));
				//console.log(" data.selectBigBunjiVal : " + isNumeric(parseInt(data.selectBigBunjiVal), 'only') );
				//if (isNumeric(parseInt(data.selectBigBunjiVal))) {
				if (isNaN(parseInt(data.selectBigBunjiVal)) == false) {
					bunji = parseInt(data.selectBigBunjiVal);
					//console.log(" data.selectBigBunjiVal : " + data.selectBigBunjiVal );
				}
			}
			
			//console.log("bunji : " + bunji);
			
			var lndDivCd = "";
			
			if(data.selectLndDivCd == "2") {
				lndDivCd = "산 ";
			}
			else if(data.selectLndDivCd == "3") {
				lndDivCd = "블록";
			}
			
			var finalBunji = "";
			
			if(data.selectLndDivCd == "3") {
				finalBunji = "블록 " + data.selectHmstZnNm;
				//finalBunji = '';
			}
			else {
				finalBunji = lndDivCd + bunji;
			}
			
			//console.log("finalBunji : " + finalBunji);
			
			finalBunji = finalBunji != 'NaN' ? finalBunji : '';
			
			$('#popAllAddr').val(data.selectAllAddr + " " + finalBunji);
			//$('#popAddrBunjiVal').val(finalBunji);
			//$('#popHmstZnNm').val(data.selectHmstZnNm);
			//$('#ldongCd').val(data.selectLdongCd);
			//$('#pnuLtnoCd').val(data.selectPnuLtnoCd);
			
			if(data.selectLndDivCd == "3") {
				bunji = "블록";
			}
			
			//$('#bunjiVal').val(bunji);		
			
			// 주소검색시 검색조건
			var srchAddrParam = {
					  srchType : 'ADDRESS'
					, ldongCd : data.selectLdongCd
					, pnuLtnoCd : data.selectPnuLtnoCd
					//, bunjiVal : finalBunji
					//, bunjiTypCd : data.selectLndDivCd
					, bldAddr : finalBunji != '' ? $('#popAllAddr').val() : ''
			};
			
			// 주소로특정국사검색
			_app.searchList(_app.prop.caller.mtsobyaddr, srchAddrParam);
			// 만약 값이 있는경우 response.mtsoByAddr 값이 있는경우 response.mtsoByAddr.mtsoLngVal 와  response.mtsoByAddr.mtsoLatVal
		}
	});
}
    	
       
    function getUrlPath() {
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) == ""){
    		urlPath = "/tango-transmission-web";
    	}
    	return urlPath;
    } 
    
    
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
    	        		  			  wrappingColumn:4
    	        		  			//, wrappingWidth: Infinity
    	        		  			, cellSize: new go.Size(4, 4), spacing: new go.Size(20, 20),
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
    			              }), 
    	          initialContentAlignment: go.Spot.Center,
    	          
    	          // 드래그 이벤트
    	          allowDrop: true,
    	          mouseDrop: function(e) {
    	        	  //return;
    	        	  finishDrop(e);
    	          }
    		      ,isEnabled: false
    		
    	        }
    		);
    	
    	makeNodeTemplate();
    	makeLinkTemplate();
    	setDiagramClickEvent();
    	
    	visualLinePath.allowDelete = false;
    	
    	// 마우스 휠 막기
    	visualLinePath.toolManager.standardMouseWheel = function() {
    		return;
    	}
    }
    

    // 노드 만들기
    function makeNodeTemplate() {
    	setNodeTemplate();
    	setGroupTemplate();
    }
    

    /**
     * 서비스회선 링크 템플릿
     */
    function makeLinkTemplate() {
    	visualLinePath.linkTemplate = baseLinkTemplate();
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
     * 링크 템플릿
     * @returns
     */
    function baseLinkTemplate() {
    	var link = $go(go.Link
		    			//, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left} // 여러개 일경우
		    			//, {routing:go.Link.JumpGap, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left} // 여러개 일경우
		    			, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left} 
		    			//, {routing:go.Link.AvoidsNodes, corner:5, selectable:false, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top} 한개일 경우
		//    			, new go.Binding("fromSpot", "fromSpot", go.Spot.parse)
		//    			, new go.Binding("toSpot", "toSpot", go.Spot.parse)
		    			, $go(go.Shape, {strokeWidth:1, stroke:"black"})
		    			, $go(go.Shape, {toArrow: "Standard", stroke:"black"})
		    			/*, {
		    				contextMenu : linkContextMenu()
		    			}*/
    	);
    	
    	return link;
    }
    

    function comvertPathImage(data) {
    	var path = "";
    	if (nullToEmpty(data.virtualYn) == "Y") {
    		path = getUrlPath() + "/resources/images/path/VI_" + data.category + ".png";
    	} else {
    		path = getUrlPath() + "/resources/images/path/" + data.category + ".png";
    	}
    	return path;
    }



    function comvertPathNodeImage(data) {
    	var path = "";
    	var neRoleCd = data.NE_ROLE_CD;
    	if (nullToEmpty(data.virtualYn) == "Y") {
    		path = getUrlPath() + "/resources/images/path/VI_equipment_icon_ETC.png";
    	} 
    	else if(neRoleCd == "TRUNK" || neRoleCd == "RING" || neRoleCd == "WDM_TRUNK") { 
    		path = getUrlPath() + "/resources/images/path/" + neRoleCd + ".png"; 
    	} else {
    		path = getEqpIcon(neRoleCd, "");
    	}
    	
    	return path;
    }

    function comvertPathNodeImageOn(data) {
    	var path = "";
    	var neRoleCd = data.NE_ROLE_CD;
    	if (nullToEmpty(data.virtualYn) == "Y") {
    		path = getUrlPath() + "/resources/images/path/VI_equipment_icon_ETC.png";
    	} else {
    		path = getEqpIcon(neRoleCd, "S");
    	}
    	
    	return path;
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
    					//return;
    					//console.log(e);
    					if(nod.containingGroup != null) {
    						visualLinePath.currentTool.doCancel();
    					} else {
    						
    						finishDrop(e); 
    					}
    				}
    				, mouseDragEnter: function(e, grp, prev) {
    					return;
    					hlighlightGroup(e, grp, true);
    				}
    				, mouseDragLeave: function(e, grp, prev) {
    					return;
    					hlighlightGroup(e, grp, false);
    				}

    				, mouseEnter: mouseEnter
					, mouseLeave : mouseLeave
//    				, contextMenu: contextMenu()
    	        }
    		
//    			, new go.Binding("background", "isHighlighted", function(h) { return h ? "#FFFFCC" : "transparent"; }).ofObject()
    	        //, $go(go.Shape, "Rectangle" , { fill: null, strokeWidth: 1, name: "SHAPE" }, new go.Binding("stroke", "color"))
    		    //, $go(go.Shape, "RoundedRectangle" , { fill: null, strokeWidth: 2, name: "SHAPE" , parameter1: 10}, new go.Binding("stroke", "color"))
    		    , $go(go.Shape, "RoundedRectangle" , { fill: null, strokeWidth: 2, name: "SHAPE" , parameter1: 10, stroke : null})
    			, $go(go.Panel, "Vertical"
					, $go(go.Panel, "Horizontal"
								//, { stretch: go.GraphObject.Horizontal }
							, { stretch:  go.GraphObject.Horizontal
										, cursor: "pointer" 
										, toolTip : $go(go.Adornment, "Auto"
												  , $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
												  , $go(go.TextBlock, new go.Binding("text", "", nodeTooltipText), { margin: 1 })
									              ) 
							  }
//								, new go.Binding("background", "color")
								, $go(go.TextBlock
										, {
											margin: 2,
											alignment: go.Spot.Left,
								            isMultiline: true,
								            editable: false,
								            font: "bold 10px sans-serif",
								            wrap: go.TextBlock.WrapFit,
	//    							            stroke: "#404040",
	//							            opacity: 0.75,
								            width: 145,
								            height:31,
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
    											margin: 2,
    											font: "bold 10px sans-serif",
    											maxSize: new go.Size(60, 60),
    											minSize: new go.Size(60, NaN),
//    											stroke: "red",
    											wrap: go.TextBlock.WrapFit,
    											name : "EAST_PORT_CHANNEL"
    										}
    										, new go.Binding("text", "EAST_PORT_CHANNEL").makeTwoWay()
    								)
    						)
    						
    						, $go(go.Picture
    								, {row : 0, column : 1, name : "nodeImage", desiredSize: new go.Size(50,50), margin: 1 }
    								//, new go.Binding("source", "category", comvertPathImage)
    								//, new go.Binding("source", "NE_ROLE_CD", comvertPathNodeImage)
    								, new go.Binding("source", "", comvertPathNodeImage)
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
    		 			background: "transparent"
    	 				, layout:  
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
    					, mouseDrop: function(e, nod) { 
    						//return;
    						if(nod.isSubGraphExpanded) {
    							// 펼쳐진 상태이면
    							visualLinePath.currentTool.doCancel();
    						} else {
    							finishDrop(e); 
    						}
    					}	
    					, mouseDragEnter: function(e, grp, prev) {
    						return;
    						hlighlightGroup(e, grp, true);
    					}
    					, mouseDragLeave: function(e, grp, prev) {
    						return;
    						hlighlightGroup(e, grp, false);
    					}
    					, mouseEnter: mouseEnter
    					, mouseLeave : mouseLeave
    					, handlesDragDropForMembers: false
    					, isSubGraphExpanded : false
    					, subGraphExpandedChanged: function(group) {
    						//return;
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
//    				, new go.Binding("background", "isHighlighted", function(h) { return h ? "#FFFFCC" : "transparent"; }).ofObject()
    				//, $go(go.Shape, "Rectangle" , { fill: null, strokeWidth: 2, name:"SHAPE"}, new go.Binding("stroke", "color"))
    				//, $go(go.Shape, "RoundedRectangle" , { fill: null, strokeWidth: 2, name:"SHAPE", parameter1: 10}, new go.Binding("stroke", "color"))
    				//, $go(go.Shape, "RoundedRectangle" , { fill: null, strokeWidth: 2, name:"SHAPE", parameter1: 10, stroke : null})
    				, new go.Binding("isSubGraphExpanded", "expanded")
    				, $go(go.Shape, "RoundedRectangle" , { name: "SHAPE", parameter1: 20, fill : null, stroke : null}) 
    				, $go(go.Panel, "Vertical"
    					, $go(go.Panel, "Horizontal"
    								, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
    									, toolTip : $go(go.Adornment, "Auto"
    													, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
    													, $go(go.TextBlock, new go.Binding("text", "NETWORK_NM"), { margin: 4 })
    									)
    								}
//    								, new go.Binding("background", "color")
    								// 펼치기 버튼
    								, $go("SubGraphExpanderButton", { name : "SubGraphExpanderButton", alignment: go.Spot.Right, margin: 5, visible:false })
    								, $go(go.Picture
    										, {name : "groupImageSmall", desiredSize: new go.Size(30,30), margin: 10, visible : false}
    										, new go.Binding("source", "", comvertPathImage)
    								)
    								, $go(go.TextBlock
    										, {
    											margin: 5,
    											alignment: go.Spot.Left,
    								            isMultiline: true,
    								            editable: false,
    								            font: "bold 11px sans-serif",
//    								            wrap: go.TextBlock.WrapFit,
//    								            stroke: "#404040",
//    								            opacity: 0.75,
    								            width: 100,
    								            height:40,
    								            name : "networkNm"
    							             }
    										, new go.Binding("text", "NETWORK_NM").makeTwoWay()
    										, new go.Binding("stroke", "color")
    								)
    								
    					)  // end Horizontal Panel
    					, $go(go.Picture
    								, {name : "groupImageLarge", desiredSize: new go.Size(60,60), margin: 5, visible : true }    					
    								, new go.Binding("source", "", comvertPathImage)
    					)
    					, $go(go.Placeholder
    							, { padding: 5, alignment: go.Spot.Center }
    					)
    			)  // end Vertical Panel
    		);
    	
    	return group;
    }
    
    /**
     * 다이어그램 사용네트워크 클릭 이벤트
     */
    function setDiagramClickEvent() {
    	//return;
    	visualLinePath.addDiagramListener("ObjectSingleClicked",function(e){
    		
    		var ob = e.subject.ob;
    		if (ob == "EAST_PORT_CHANNEL" || ob == "WEST_PORT_CHANNEL" ) {
    			return;
    		}
    		try{    			
    			_app.mu.selectPathFeature(e.subject.part.data);
    		}catch(exception){
    			console.log(exception)
    		}
    	})
    	visualLinePath.addDiagramListener("ObjectDoubleClicked", 
    			function(e) {
    				// 상세보기 
    		        //console.log(e.subject.part.data);
					var node = e.subject.part.data;
					//console.log(node.NODE_ID);
					var data = {nodeData:{uprNodeId:node.NODE_ID}};
					_app.tpu.updateNode("showDetailData",data);
					
    				//var part = e.subject.part;
    				/*if(part.data.category != undefined) {
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
    				}*/
    			}
    	);
    }
           

    /**
     * 선번 추가 및 삭제 후 refresh
     */
    function reGenerationDiagram() {
    	// shortpath 재생성
    	teamsShortPathData = (function(tp){
    		if(tp != null){
    			return app.tpu.teamsPath.toShortPath();
    		}else{
    			var tempTeamsPath = new TeamsPath();
    			tempTeamsPath.NODES = [];
    			return tempTeamsPath;
    		}
    	})(_app.tpu.teamsPath);
    	
    	// 그리드
    	teamsPathData = _app.tpu.teamsPath == null ? [] : _app.tpu.teamsPath.toData();
//    	teamsPathGrid();
    	//$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
    	
//    	tangoPathGrid();
    	//var tangoPath = teamsPath.toTangoPath();
    	//var tangoPathData = tangoPath.toData(); 
    	//$('#'+tagngoGridId).alopexGrid('dataSet', tangoPathData.LINKS);
    	
    	nodeDataArray = [];
    	// 노드 만들기
    	generateNodes();

    	linkDataArray = [];
    	// 링크만들기
    	generateLinks();
    	
    	visualLinePath.clear();
    	visualLinePath.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    	
    	// 컨텍스트 메뉴 
    	nodeSelectionAdornedPath();

    	// 펼치기 버튼
		showSubGraphExpanderButtonAtEditMode();
    	
    	// rest seq
        for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
        	nodeDataArray[idx].SEQ = idx + 1;
        }
        
        // 상하위국에 가입자 링인 경우 
        setUserRingUprLowNetworkNo(nodeDataArray);
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
        	
        	// 가상노드여부값
        	node.virtualYn = node.Ne.VIRTUAL_YN;
        	
        	if (node.__gohashid != undefined) {
        		delete node.__gohashid;
        	}
        	        	
        	nodeDataArray.push( node );
        	
        }
        
        // rest seq
        for( var idx = 0; idx < nodeDataArray.length; idx++ ) {
        	nodeDataArray[idx].SEQ = idx + 1;
        }
    }

    /**
     * 링크를 연결한다.
     */
    function generateLinks() {
    	var fromKey = null;
    	var toKey = null;
    	var prevNode = null;
    	var curNode = null;
    	var count = teamsShortPathData.NODES.length;    	
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
     * 서비스 회선 그룹 노드 생성
     *  - 노드를 묶는 trunk, ring, wdmTrunk 그룹 생성
     */
    function generateGroupNodes(node, lineNetwork) {
    	if(node.isTrunkNode()) {
    		if(useTrunkNetworkId != node.Trunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = generateTeamsNodeGroup(node, "Trunk", lineNetwork);
    		}
    		//node.group = groupGuid;
    		useTrunkNetworkId = node.Trunk.NETWORK_ID;
    	} else if(node.isRingNode()) {
    		if(useRingNetworkId != node.Ring.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = generateTeamsNodeGroup(node, "Ring", lineNetwork);
    		}
    		//node.group = groupGuid;
    		useRingNetworkId = node.Ring.NETWORK_ID;
    	} else if(node.isWdmTrunkNode()) {
    		if(useWdmTrunkNetworkId != node.WdmTrunk.NETWORK_ID) {
    			groupGuid = null;
    			groupGuid = generateTeamsNodeGroup(node, "WdmTrunk", lineNetwork);
    		}
    		//node.group = groupGuid;
    		useWdmTrunkNetworkId = node.WdmTrunk.NETWORK_ID;
    	}
    	
    	if (node.isTrunkNode() || node.isRingNode() || node.isWdmTrunkNode()) {
    		node.group = groupGuid;    		
    	} 
    	
    	return node;
    }


    /**
     * 서비스 회선 그룹 노드의 타입별로 디자인 생성
     * @param  node : 노드, network : 네트워크타입, : 연결타입 
     */
    function generateTeamsNodeGroup(node, network, lineNetwork) {
    	var networkArray = new Array();
    	var virtual_yn = eval("node."+network+".VIRTUAL_YN");
    	if(network == "Trunk") {
    		networkArray.push("TRUNK");
    		if (virtual_yn != 'Y') {
    			networkArray.push("#A89824");
    		} else {
    			networkArray.push("#AAAAAA");
    		}
    	} else if(network == "Ring") {
    		networkArray.push("RING");
    		if (virtual_yn != 'Y') {
    			networkArray.push("#FF7171");
    		} else {
    			networkArray.push("#AAAAAA");
    		}
    	} else if(network == "WdmTrunk") {
    		networkArray.push("WDM_TRUNK");
    		if (virtual_yn != 'Y') {
    			networkArray.push("#3A8B3A");
    		} else {
    			networkArray.push("#AAAAAA");
    		}
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
    	// 가상여부
    	teamsNode.virtualYn = virtual_yn;
    	
    	teamsNode.NETWORK_ID = eval("node."+network+".NETWORK_ID");
    	teamsNode.PATH_SAME_NO = eval("node."+network+".PATH_SAME_NO");
    	
    	if(lineNetwork == "line") {
    		nodeDataArray.push(teamsNode);
    	} else if(lineNetwork == "trunk") {
    		nodeTrunkDataArray.push(teamsNode);
    	} 
    	
    	return teamsNode.key;
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
	 	//return;
	 	// for 시작
	 	// 포트, 채널 수정 가능 여부 확인
	 	var editableColor = '#E8CEC9';
	 	var disEditableColor = '#DDDDDD';
	 	var portColor = "";
	 	for(var idx = 0; idx < nodeDataArray.length; idx++) {
			var nodeData = nodeDataArray[idx];
			var node = visualLinePath.findNodeForData(nodeData);
			portColor = disEditableColor;
			
			if(!nodeData.isGroup) {
					// 포트 색상 설정
				var eastPortChannelNode = node.findObject('EAST_PORT_CHANNEL');
				var westPortChannelNode = node.findObject('WEST_PORT_CHANNEL');
				if (nullToEmpty(eastPortChannelNode) != null ) {					
					if (nodeData.APortDescr.EDITABLE_PORT == true) {
						portColor = editableColor;
						nodePortSearch(eastPortChannelNode, nodeData);
					}
					portChannelRect('EAST_PORT_CHANNEL_PART', portColor, node, nodeData, nodeData.APortDescr.EDITABLE_PORT);
				}
				
				if (nullToEmpty(westPortChannelNode) != null ) {
					if (nodeData.BPortDescr.EDITABLE_PORT == true) {
						portColor = editableColor;
						nodePortSearch(westPortChannelNode, nodeData);
					}
					portChannelRect('WEST_PORT_CHANNEL_PART', portColor, node, nodeData, nodeData.BPortDescr.EDITABLE_PORT);
				}
				/*if(nodeData.isNetworkNode()) {
					// 네트워크 노드
					if(nodeData.isAddNode()) {
						// ADD이면 좌 = 수정 가능 색깔.
						if(nodeData.isRingNode()) {
							
							// 링일 경우 수정 가능
							var portChannelNode = node.findObject('EAST_PORT_CHANNEL');
							nodePortSearch(portChannelNode, nodeData);
							portChannelRect('EAST_PORT_CHANNEL_PART', '#E8CEC9', node, nodeData);
						} else {
							if(nodeData.EAST_PORT_CHANNEL != "" && !nodeData.isWdmTrunkNode()) {
								// 포트가 없으면 포트 및 채널 수정 불가능
								var portChannelNode = node.findObject('EAST_PORT_CHANNEL');
								nodePortSearch(portChannelNode, nodeData);
								portChannelRect('EAST_PORT_CHANNEL_PART', '#E8CEC9', node, nodeData);
							} else {
								portChannelRect('EAST_PORT_CHANNEL_PART', '#DDDDDD', node, nodeData);
							}
						}
						
						// 우 = 수정 불가능한 색깔
						portChannelRect('WEST_PORT_CHANNEL_PART', '#DDDDDD', node, nodeData);
					} else if(nodeData.isDropNode()) {
						// DROP이면 우 = 수정 가능한 색깔
						if(nodeData.isRingNode()) {
							// 링일 경우 수정 가능
							var portChannelNode = node.findObject('WEST_PORT_CHANNEL');
							nodePortSearch(portChannelNode, nodeData);
							portChannelRect('WEST_PORT_CHANNEL_PART', '#E8CEC9', node, nodeData);
						} else {
							if(nodeData.WEST_PORT_CHANNEL != "" && !nodeData.isWdmTrunkNode()) {
								
								var portChannelNode = node.findObject('WEST_PORT_CHANNEL');
								nodePortSearch(portChannelNode, nodeData);
								portChannelRect('WEST_PORT_CHANNEL_PART', '#E8CEC9', node, nodeData);
							} else {
								portChannelRect('WEST_PORT_CHANNEL_PART', '#DDDDDD', node, nodeData);
							}
						}
						
						// 좌 = 수정 불가능 색깔
						portChannelRect('EAST_PORT_CHANNEL_PART', '#DDDDDD', node, nodeData);
					}
				} else {
					// 장비.
					var eastPortChannelNode = node.findObject('EAST_PORT_CHANNEL');
					var westPortChannelNode = node.findObject('WEST_PORT_CHANNEL');
					nodePortSearch(eastPortChannelNode, nodeData);
					nodePortSearch(westPortChannelNode, nodeData);
					portChannelRect('WEST_PORT_CHANNEL_PART', '#E8CEC9', node, nodeData);
					portChannelRect('EAST_PORT_CHANNEL_PART', '#E8CEC9', node, nodeData);
				}*/
			}
		}
	 	// for 끝
	 	
	 }
    

	 // 포트 채널 
	 function portChannelRect(objName, color, node, nodeData, editableYn) {
	 	var portChannelRect = node.findObject(objName);
	 	portChannelRect.strokeWidth = 3;

	 	var disableColor = "#DDDDDD";
		
		if (editableYn == false) {
			color = disableColor;
		}
		
	 	portChannelRect.fill = color;
	 	portChannelRect.stroke = color;
	 	
	 	var virtual_yn = "";
	 // 네트워크 노드
		if (nodeData.isNetworkNode()) {
			if (nodeData.isTrunkNode()) {
				virtual_yn = nodeData.Trunk.VIRTUAL_YN;
			} else if (nodeData.isRingNode()) {
				virtual_yn = nodeData.Ring.VIRTUAL_YN;
			} else if (nodeData.isWdmTrunkNode()) {
				virtual_yn = nodeData.WdmTrunk.VIRTUAL_YN;
			}			
		} else {
			virtual_yn = nodeData.Ne.VIRTUAL_YN;
		}
		
		if (virtual_yn == "Y") {
			portChannelRect.stroke = disableColor;
			portChannelRect.fill = disableColor;
			return;
		}
	 		 	
	 	if(color == "#E8CEC9") {
	 		var name = objName.substring(0, 4) + "_PORT_CHANNEL";
	 		if(eval("node.data." + name) == "" ) {
	 			portChannelRect.fill = "#FF0000";
	 		} else {
	 			portChannelRect.fill = color;
	 		}
	 	} 
	 }

	 // 포트찾기
	 function nodePortSearch(node, nodeData) {
		// 네트워크 노드
		 
		// console.log(nodeData);
		if (nodeData.isNetworkNode()) {
			if (nodeData.isTrunkNode()) {
				if (nodeData.Trunk.VIRTUAL_YN == "Y") return;
			} else if (nodeData.isRingNode()) {
				if (nodeData.Ring.VIRTUAL_YN == "Y") return;
			} else if (nodeData.isWdmTrunkNode()) {
				if (nodeData.WdmTrunk.VIRTUAL_YN == "Y") return;
			}			
		} else {
			if (nodeData.Ne.VIRTUAL_YN == "Y") return;
		}
	 	node.click = function(e, obj) {
	 		portSearch(obj, e);
	 	}	
	 	node.cursor = "pointer";
	 }
	 
	 // 포트설정 창 보여주기
	 function portSearch(obj, e) {
		 var paramData = {"node" : obj.part.data, "target" : e.pg.Ob, "svlnNo" : _app.data.svlnInfo.svlnNo,"svlnLclCd" : _app.data.svlnInfo.svlnLclCd, "svlnSclCd" : _app.data.svlnInfo.svlnSclCd}; 
		 
		 $a.popup({ popid: "SimulationPathVisualizationPortList",
			   title: cflineMsgArray['portInf']/*"포트정보"*/,
	 	       url: $('#ctx').val()+"/configmgmt/cfline/SimulationPathVisualizationPortList.do",
			   data: paramData,
			   iframe: true,
			   modal: true,
			   movable:true,
			   windowpopup : true,
			   /*iframe: false,
			   modal: true,
			   movable:false,*/
			   width : 1400,
			   height : 800,
			   callback:function(data){
				  // 다른 팝업에 영향을 주지않기 위해
				  $.alopex.popup.result = null;
				  reGenerationDiagram();
			   }
		 });
	 }

	 /**
	  * 선택 선번에서 편집을 위해 네트워크 또는 장비를 드랍했을 때
	  * @param e
	  */
	 function finishDrop(e) {		
	 	try {
	 		var moveYn = false;
	 		if(e.Dq.currentTarget == null) {
	 			// e.Dq.currentTarget == null : 선택선번에서 드랍
	 			moveYn = false;
	 		} else if(e.Dq.currentTarget != null){
	 			// e.Dq.currentTarget != null : move
	 			moveYn = true;
	 			
	 		}
	 		
	 		var selectedPath = e.diagram.selection.Da.key;
	 		selectedPathData = selectedPath.data;
	 		
	 		var networkNe = null;
	 		if(TeamsNode.prototype.isPrototypeOf(selectedPathData)) {
	 			if(selectedPathData.isGroup) {
	 				networkNe = "NETWORK";
	 			} else {
	 				networkNe = "NE";
	 			}
	 		} else if(TeamsPath.prototype.isPrototypeOf(selectedPathData)) {
	 			networkNe = "NETWORK";
	 		}
	 		
	 		var nodeId = genereteDropNodeId(e, networkNe, selectedPath, selectedPathData);
	 		
	 		// 선번 추가
	 		if(!moveYn) {
	 			if(networkNe == "NE") {
	 				if(selectedOriginalPath[selectedPathData.NE_ID] == undefined) {
	 					//throw new Error( cflineMsgArray['impossibleEquipment']); /*"추가할수 없는 장비입니다."*/
						throw new PathException( {code:"", message:cflineMsgArray['impossibleEquipment']}, "");
	 				} else {
	 					var __gohashid = selectedOriginalPath[selectedPathData.NE_ID].__gohashid; 
	 					delete selectedOriginalPath[selectedPathData.NE_ID].__gohashid;
	 					
	 					_app.tpu.teamsPath.insertNode(nodeId, selectedOriginalPath[selectedPathData.NE_ID]);
	 					
	 					selectedOriginalPath[selectedPathData.NE_ID].__gohashid = __gohashid;
	 				}
	 			} else if(networkNe == "NETWORK"){
	 				_app.tpu.teamsPath.insertNode(nodeId, selectedOriginalPath[selectedPathData.NETWORK_ID]);
	 			}
	 		} else {
	 			if(selectedPathData.NODE_ID == nodeId) {
	 				visualLinePath.currentTool.doCancel();
	 			} else {
	 				_app.tpu.teamsPath.moveNode(selectedPathData.NODE_ID, nodeId);
	 			}
	 		}

	    	_app.tpu.refreshPath(true);
	 		reGenerationDiagram();
	 		
	 	} catch (err) {
	 		/*var errMsg = err + "";
	 		var msg = errMsg.split("Error: ");
	 		if(msg.length > 1) {
	 			callMsgBox('', 'I', msg[1]);			
	 		} else {
	 			callMsgBox('', 'I', errMsg);
	 		}
	 		visualLinePath.currentTool.doCancel();*/
	 		var errMsg = err.message;
			if(err.code != "001" && err.code != "002" ) {
				callMsgBox('', 'I', errMsg);
			}  
			visualLinePath.currentTool.doCancel();
			dragCancle();
	 	}
	 }
	 

	 function dragCancle() {
	 	generateLinks();
	 	
//	 	for( var idx = 0; idx < linkDataArray.length; idx++ ) {
//	 		var link = linkDataArray[idx];
//	 		if(link.__gohashid != undefined) {
//	 			delete link.__gohashid;
//	 		}
//	 	}
	 	
	 	visualLinePath.model.linkDataArray = linkDataArray;
	 }
	 

	 function genereteDropNodeId(e, networkNe, selectedPath, selectedPathData) {
	 	var nodeId = -1;
	 	var nodeSeq = -1;
	 	var nodeSeqCnt = 0;
	 	
	 	/*if(e.targetDiagram == null) {
			throw new PathException( {code:"", message:"Drop 위치가 다이어그램을 벗어났습니다."}, "" );
		}*/
	 	
	 	var it = e.targetDiagram.nodes.iterator;
	 	
	 	/*
	 	 * 드랍된 위치의 x좌표로 해당 node 찾기
	 	 * 1. 맨 처음 위치에 드랍이 되었을 때
	 	 *    - 기존 선번의 첫 노드ID
	 	 * 2. 중간 위치에 드랍이 되었을 때
	 	 *    - 드랍된 위치의 뒷 노드ID
	 	 * 3. 마지막 위치에 드랍이 되었을 때
	 	 *    - NULL
	 	 */
	 	
	 	while(it.next()) {
	 		var node = it.key;
	 		
	 		var yLoc = 0;
	 		if(node.data.isGroup || node.data.group == undefined) {
	 			if(node.data != selectedPath.data) {
	 				yLoc = parseInt(node.getDocumentPoint(go.Spot.Center).y) * 2;
	 			}
	 		}
	 		
	 		if( yLoc > selectedPath.getDocumentPoint(go.Spot.Center).y) {
	 			var x = node.location.x;
	 			if(x > selectedPath.location.x) {
	 				if(nodeId < 0) {
	 					nodeId = node.data.NODE_ID;
	 					nodeSeq = nodeSeqCnt;
	 				} 
	 			} 
	 		}
//	 		nodeSeqCnt++;
	 	}
	 	
	 	/*
	 	 * 드랍노드부터 찾아가되 다음 노드가 없을 경우 -> 마지막 위치에 DROP : NODE_ID를 NULL로 변경 
	 	 */
	 	if(networkNe == "NE") {
	 		if(nodeId < 0) nodeId = null;
	 	} else if(networkNe == "NETWORK"){
	 		if(nodeId < 0) {
	 			nodeId = null;
	 		} else {
	 			for(var idx = nodeSeq; idx < nodeDataArray.length -1; idx++) {
	 				if( (!nodeDataArray[nodeSeq].isGroup) && (nodeDataArray[nodeSeq].group == nodeDataArray[idx].group)) {
	 					if(idx == nodeDataArray.length -2) {
	 						nodeId = null;
	 					}
	 				}
	 			}
	 			
	 			if( nodeDataArray.length < 1) {
	 				nodeId = null;
	 			}
	 		}
	 	}
	 	
	 	return nodeId;
	 }
	 
	 /**
	  * 노드 삭제
	  * @param node
	  */
	 function removeNode(node) {
		 if (node.data.NETWORK_ID == _app.tpu.uprNetworkNo) {
			 _app.tpu.uprNetworkNo = null;
		 } else if (node.data.NETWORK_ID == _app.tpu.lowNetworkNo) {
			 _app.tpu.lowNetworkNo = null;
		 }
		 _app.tpu.teamsPath.removeNode(node.data.NODE_ID);
		 _app.tpu.refreshPath(true);
	 	reGenerationDiagram();
	 } 
	 
	 /**
	  * E2E적용
	  */
	 function e2eApply(node) {
	 	var eqpData = node.data.Ne;
	 	var eqpPortData = node.data.APortDescr;
	 	fdfNodeId = node.data.NODE_ID;
	 	
	 	if(eqpPortData.PORT_ID == "0" || eqpPortData.PORT_ID == "" ) {
	 		eqpPortData = node.data.BPortDescr;
	 	}
	 	
	 	if(eqpPortData.PORT_ID != "0" && eqpPortData.PORT_ID != "") {
	 		cflineShowProgressBody();
	 		var eqpParam = {"lftEqpId" : eqpData.NE_ID, "lftPortNm" : eqpPortData.PORT_NM, "lftEqpInstlMtsoId" : eqpData.ORG_ID };
	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectGisFdfE2E', eqpParam, 'GET', 'e2eApplay');
	 	} else {
	 		//console.log('E2E적용 불가');
	 	}
	 }

	 /**
	  * A,B 포트 바꾸기
	  */
	 function swapPort(node) {
	 	node.data.swapPort();
	 	 _app.tpu.refreshPath(true);
	 	reGenerationDiagram();
	 }

	// context menu
	function contextMenu() {
		var contextMenu = $go(go.Adornment, "Vertical",
					$go("ContextMenuButton",
							$go(go.TextBlock, cflineMsgArray['delete']) /*삭제*/
							, {
								click : function(e, obj) {
									var node = obj.part.adornedPart;
									removeNode(node);
								}
							}
					)
					/*,$go("ContextMenuButton",
							$go(go.TextBlock, "A, B포트 바꾸기")
							, {
								click : function(e, obj) {
									var node = obj.part.adornedPart;
									swapPort(node);
								}
							}
					)*/
		);
		
		return contextMenu;
	}

	// context menu
	function linkContextMenu() {
		var contextMenu = $go(go.Adornment, "Vertical",
					$go("ContextMenuButton",
							$go(go.TextBlock, "링크메뉴")
							, {
								click : function(e, obj) {
									var linkInfo = obj.part.adornedPart.data;
									//console.log(linkInfo);
									var leftNode =  _app.tpu.teamsPath.NODES[_app.tpu.teamsPath.findIndexById(linkInfo.from)];
									//console.log(leftNode);
									var rightNode =  _app.tpu.teamsPath.NODES[_app.tpu.teamsPath.findIndexById(linkInfo.to)];
									//console.log(leftNode);
								}
							}
					)
		);
		
		return contextMenu;
	}

	 /**
	  * 삭제메뉴
	  * @param 
	  */
	 function contextMenu() {
			var contextMenu = $go(go.Adornment, "Vertical",
						$go("ContextMenuButton",
								$go(go.TextBlock, cflineMsgArray['delete']) /*삭제*/
								, {
									click : function(e, obj) {
										var node = obj.part.adornedPart;
										removeNode(node);
									}
								}
						)
						/*,$go("ContextMenuButton",
								$go(go.TextBlock, "A, B포트 바꾸기")
								, {
									click : function(e, obj) {
										var node = obj.part.adornedPart;
										swapPort(node);
									}
								}
						)*/
			);
			
			return contextMenu;
		}
	 
	 /**
	  * FDF 삭제메뉴
	  * @param 
	  */
	 function contextMenuFdf() {
	 	var contextMenu = $go(go.Adornment, "Vertical",
	 			$go("ContextMenuButton",
	 					$go(go.TextBlock, cflineMsgArray['delete']) /*삭제*/
	 					, {
	 							click : function(e, obj) {
	 								var node = obj.part.adornedPart;
	 								removeNode(node);
	 							}
	 					}
	 			)
	 			/*,$go("ContextMenuButton",
	 					$go(go.TextBlock, "E2E적용")
	 					, {
	 							click : function(e, obj) {
	 								var node = obj.part.adornedPart;
	 								e2eApply(node);
	 							}
	 					}
	 			),
	 			$go("ContextMenuButton",
	 					$go(go.TextBlock, "FDF 구간 뒤집기")
	 					, {
	 							click : function(e, obj) {
	 								var node = obj.part.adornedPart;
	 								_app.tpu.teamsPath.reverseFdfPath(node.data.NODE_ID);
	 								_app.tpu.refreshPath();
	 								reGenerationDiagram();
	 							}
	 					}
	 			)*/
	 	);

	 	return contextMenu;
	 }

	 /**
	  * NETWORK 삭제메뉴
	  * @param 
	  */
	 function contextMenuNetwork() {
	 	var contextMenu = $go(go.Adornment, "Vertical",
	 			$go("ContextMenuButton",
	 					$go(go.TextBlock, cflineMsgArray['delete']) /*삭제*/
	 					, {
	 							click : function(e, obj) {
	 								var node = obj.part.adornedPart;
	 								removeNode(node);
	 							}
	 					}
	 			),
	 			$go("ContextMenuButton",
	 					$go(go.TextBlock, cflineMsgArray['reverse'])/*"선번 뒤집기"*/
	 					, {
	 							click : function(e, obj) {
	 								var node = obj.part.adornedPart;
	 								_app.tpu.teamsPath.reverseUseNetwork(node.data.NODE_ID);
	 								_app.tpu.refreshPath(true);
	 								reGenerationDiagram();
	 							}
	 					}
	 			)
	 	);
	 	
	 	return contextMenu;
	 }
	 
     // 노드 툴팁
	 function nodeTooltipText(data) {
	     var str = "";
	     str = cflineMsgArray['eqpId'] + ' : ' + nullToEmpty(data.Ne.NE_ID) + '\n' + cflineMsgArray['eqpNm'] + ' : ' + nullToEmpty(data.Ne.NE_NM) + '\n' + cflineMsgArray['equipmentRole'] + ' : ' + nullToEmpty(data.Ne.NE_ROLE_NM) /*장비ID 장비명 장비역할*/
	 	+ '\n' + cflineMsgArray['vend'] + ' : ' + nullToEmpty(data.Ne.VENDOR_NM) /*제조사*/
	 	+ '\n' + cflineMsgArray['modelName'] + ' : ' + nullToEmpty(data.Ne.MODEL_NM) /*모델명*/
	 	+ '\n' + cflineMsgArray['modelLarge'] + ' : ' + nullToEmpty(data.Ne.MODEL_LCL_NM) + '\n' + cflineMsgArray['modelMiddle'] + ' : ' + nullToEmpty(data.Ne.MODEL_MCL_NM)+ '\n' + cflineMsgArray['modelSmall'] + ' : ' + nullToEmpty(data.Ne.MODEL_SCL_NM) /*모델(대) 모델(중) 모델(소)*/
	  	+ '\n' + cflineMsgArray['status'] + ' : ' + nullToEmpty(data.Ne.NE_STATUS_NM) + '\n' + cflineMsgArray['mobileTelephoneSwitchingOffice'] + ' : ' + nullToEmpty(data.Ne.ORG_NM) + '\n' + cflineMsgArray['transmissionOffice'] + ' : ' + nullToEmpty(data.Ne.ORG_NM_L3) /*상태 국사 전송실*/
	  	+ '\n' + cflineMsgArray['dummyEquipment'] + ' : ' + nullToEmpty(data.Ne.NE_DUMMY); /*더미장비*/
	     
	     return str;
	 }
	 

	 function mouseLeave(e, obj) {
	 	var shape = obj.findObject("SHAPE");
	 	shape.stroke = null;//obj.data.color;
	 	shape.strokeWidth = 2;
//	 	shape.background = "transparent";
	 	
	 	if(obj.data.NE_ROLE_CD != undefined) {
	 		obj.findObject("nodeImage").source = comvertPathNodeImage(obj.data); 
	 	}
	 }


	 function mouseEnter(e, obj) {
	 	var shape = obj.findObject("SHAPE");
	 	shape.stroke = obj.data.color;//"#6DAB80";
	 	shape.strokeWidth = 2;
	 	
	 	if(obj.data.NE_ROLE_CD != undefined) {
	 		obj.findObject("nodeImage").source = comvertPathNodeImageOn(obj.data); 
	 	}
	 }

	 
	 // 편집 모드시만 펼치기 버튼 보이도록
	 // 사용 네트워크 내의 장비 노드 선택 불가능하도록
	 function showSubGraphExpanderButtonAtEditMode() {
		 
		 visualLinePath.findTopLevelGroups().each(function(g){
			 if (g instanceof go.Group) {
				 //console.log(g);
				 //testNode = g;
				 g.findObject("SubGraphExpanderButton").visible = visualLinePath.isEnabled;
			 }			 
		 });
	 }
	 	 
	 // 상하위국 가입자링 네트워크 id 설정
     function setUserRingUprLowNetworkNo(nodeDataArray) {
    	 
    	 for (var i = 0; i < nodeDataArray.length; i++) {
    		 var tempNode = nodeDataArray[i];
    		
    		 if (tempNode.Ring != null 
    				 // && tempNode.Ring.TOPOLOGY_LARGE_CD == "001" && tempNode.Ring.TOPOLOGY_SMALL_CD == "031"
    				 &&  tempNode.Ring.NETWORK_TYPE_CD == "004"
    		    ) {
    			 
        		 if ( (tempNode.Ne.ORG_ID == _app.tpu.uprMtso.MTSO_ID ) && nullToEmpty(_app.tpu.uprNetworkNo) == "") {
        			 _app.tpu.uprNetworkNo = tempNode.Ring.NETWORK_ID;
        		 } else if ((tempNode.Ne.ORG_ID == _app.tpu.lowMtso.MTSO_ID ) && nullToEmpty(_app.tpu.lowNetworkNo) == "") {
        			 _app.tpu.lowNetworkNo = tempNode.Ring.NETWORK_ID;
        		 }
    		 }
    	 }
     }

    //회선설계시뮬레이션용 실패CallBack함수
    function failCallbackSim (response, flag) {
 	   	
    }
    
