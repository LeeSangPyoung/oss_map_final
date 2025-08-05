/**
 * NetworkPathVisualizationTemplate.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0 *  
 * 
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-09-12  2. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 */

/**
 * 서비스 회선
 * 노드 템플릿 정의
 */
function setNodeTemplate() {
	var node = baseNodeTemplate();
	visualLinePath.nodeTemplate = node;
}


/**
 * 사용네트워크
 */
function setUseNetworkNodeTemplate() {
	var node = baseNodeTemplate();
	useNetworkDiagram.nodeTemplate = node;
}

/**
 * 트렁크(사용않함)
 */
function setTrunkNodeTemplate() {
	var node = baseNodeTemplate();
	trunkDiagram.nodeTemplate = node;
}

/**
 * WDM트렁크(사용않함)
 */
function setWdmNodeTemplate() {
	var node = baseNodeTemplate();
	wdmDiagram.nodeTemplate = node;
}

/**
 * 선택 선번 템플릿
 */
function setSelectedNodeTemplate() {
	var node = baseNodeTemplate();
	selectedLinePathDiv.nodeTemplate = node;
}

/**
 * 서비스 회선
 * 그룹 템플릿 정의
 *   - 사용 네트워크를 그룹핑 하는 템플릿
 */
function setGroupTemplate() {
	var group = baseGroupImageTemplate();

	visualLinePath.groupTemplateMap.add("SERVICE", group);
	visualLinePath.groupTemplateMap.add("TRUNK", group);
	visualLinePath.groupTemplateMap.add("RING", group);
	visualLinePath.groupTemplateMap.add("WDM_TRUNK", group);
}

/**
 * 사용네트워크 그룹 템플릿
 */
function setUseNetworkGroupTemplate() {
	var group = baseGroupImageTemplate();

	useNetworkDiagram.groupTemplateMap.add("SERVICE", group);
	useNetworkDiagram.groupTemplateMap.add("TRUNK", group);
	useNetworkDiagram.groupTemplateMap.add("RING", group);
	useNetworkDiagram.groupTemplateMap.add("WDM_TRUNK", group);
}

/**
 * 트렁크 그룹 템플릿(사용않함)
 */
function setTrunkGroupTemplate() {
	var group = baseGroupImageTemplate();
	
	trunkDiagram.groupTemplateMap.add("RING", group);
	trunkDiagram.groupTemplateMap.add("WDM_TRUNK", group);
}

/**
 * WDM 트렁크 그룹 템플릿(사용않함)
 */
function setWdmGroupTemplate() {
	var group = baseGroupImageTemplate();
}


/**
 * 선택 선번 그룹 템플릿
 */
function setSelectedGroupTemplate() {
	var group = selectedGroupImageTemplate();

	selectedLinePathDiv.groupTemplateMap.add("SERVICE", group);
	selectedLinePathDiv.groupTemplateMap.add("TRUNK", group);
	selectedLinePathDiv.groupTemplateMap.add("RING", group);
	selectedLinePathDiv.groupTemplateMap.add("WDM_TRUNK", group);
}


/**
 * 서비스회선 링크 템플릿
 */
function makeLinkTemplate() {
	visualLinePath.linkTemplate = baseLinkTemplate();
}

/**
 * 사용네트워크 링크 템플릿
 */
function makeUseNetworkLinkTemplate() {
	useNetworkDiagram.linkTemplate = baseLinkTemplate();
}

/**
 * 트렁크 링크 템플릿(사용않함)
 */
function makeTrunkLinkTemplate() {
	trunkDiagram.linkTemplate = baseLinkTemplate();
}

/**
 * WDM트렁크 링크 템플릿(사용않함)
 */
function makeWdmLinkTemplate() {
	wdmDiagram.linkTemplate = baseLinkTemplate();
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
						dragCancle();
					} else {
						finishDrop(e); 
					}
				}
				, mouseEnter: mouseEnter
				, mouseLeave : mouseLeave
	        }
		
	        , $go(go.Shape, "RoundedRectangle" , { fill: null, name: "SHAPE" , parameter1: 20, stroke:"rgba(0,0,0,0.3)", })	// , new go.Binding("stroke", "color")  
			, $go(go.Panel, "Vertical"
				, $go(go.Panel, "Horizontal"
							, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
									, toolTip : $go(go.Adornment, "Auto"
												, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
												, $go(go.TextBlock, new go.Binding("text", "", nodeTooltipText), { margin: 4 })
									) 
							}
							, $go(go.TextBlock
									, {
										margin: 5,
							            isMultiline: true,
							            editable: false,
							            font: "bold 10px sans-serif",
							            wrap: go.TextBlock.WrapFit,
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
								, {row : 0, column : 0, width:55, height: 70, contextMenu: contextMenuPort("EAST_PORT_CONTEXT") }
								, $go(go.Shape, "RoundedRectangle", {height:60, stroke: null, fill:null })
								, $go(go.Shape, "RoundedRectangle", { height:40, margin: 3, stroke: null, fill:null, name: "EAST_PORT_CHANNEL_PART" })
								, $go(go.TextBlock
										, {
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
								, new go.Binding("source")
						)
						
						, $go(go.Panel, "Auto"
								, {row : 0, column : 2, width:55, height: 70, contextMenu: contextMenuPort("WEST_PORT_CONTEXT") }
								, $go(go.Shape, "RoundedRectangle", {height:60, stroke: null, fill:null })
								, $go(go.Shape, "RoundedRectangle", { height:40, margin: 3, stroke: null, fill:null, name: "WEST_PORT_CHANNEL_PART" })
								, $go(go.TextBlock
										, {
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

/**
 * WDM트렁크 템플릿(사용않함)
 */
function setWdmTrunkNodeTemplate() {
	var node = $go(go.Node, "Auto",
	        {
				mouseDrop: function(e, nod) { 
					finishDrop(e); 
				}
				, alignment : go.Spot.Center
		    },
		    
		    // 장비, 포트 의 네모 박스
			$go(go.Shape, "RoundedRectangle"
					, { fill: "#FFFFFF", strokeWidth : 2 }
			),
		    
			// 장비, 포트 테이블 생성
			$go(go.Panel, "Table"
					, { padding: 0.5, defaultColumnSeparatorStroke: "black" }
					, $go(go.RowColumnDefinition, {row: 1, separatorStroke: "black" })
					
					// 장비명
					, $go(go.Panel, "Vertical"
							, {row : 0, column : 0, width:150, height:70
									, toolTip : $go(go.Adornment, "Auto"
										, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"})
										, $go(go.TextBlock, new go.Binding("text", "nodeTooltipText", nodeTooltipText), { margin: 4 })
									)
							}
							, $go(go.TextBlock
									, textBlockStyle()
									, new go.Binding("text", "NE_NM").makeTwoWay()
									, new go.Binding("stroke", "NE_ID", function(data) {
					          			if(data == "-") {
					          				return "red";
					          			} else {
					          				return "black";
					          			}
									})
							)
					)
			        
			        // 좌채널
					, $go(go.Panel, "Vertical"
							, {row : 1, column : 0, width:150, height:70 }
					        , $go(go.TextBlock
									, textBlockStyle()
									, new go.Binding("text", "EAST_PORT_NM").makeTwoWay()
			          		)
			        )
		    )
		);
	
	wdmTrunkDiagram.nodeTemplate = node;
}

function baseGroupImageTemplate(targetDiagram) {
	var group = $go(go.Group, "Auto", 
 				{
	                /*fromSpot: go.Spot.RightSide,
	                toSpot: go.Spot.LeftSide,*/
		
		 			background: "transparent",
	 				layout: $go(go.GridLayout
								, { 
								    wrappingWidth: Infinity, 
								    wrappingColumn:4, 
								    cellSize: new go.Size(4, 4), 
								    spacing: new go.Size(10, 10),
									alignment: go.GridLayout.Position,
									comparer: function(a, b) {
										var av = a.data.SEQ;
										var bv = b.data.SEQ;
										if(av < bv) return -1;
										if(av > bv) return 1;
										return 0;
									}
								}
							)
					, isSubGraphExpanded : true
					, mouseEnter: mouseEnter
					, mouseLeave : mouseLeave
					, mouseDrop: function(e, nod) { 
						if(nod.isSubGraphExpanded) {
							// 펼쳐진 상태이면
							visualLinePath.currentTool.doCancel();
							dragCancle();
						} else {
							finishDrop(e); 
						}
					}	
					, handlesDragDropForMembers: false
					, subGraphExpandedChanged: function(group) {						
						if(group.isSubGraphExpanded) {
							// 펼쳐져 있으면 이미지 숨기기
							group.findObject("groupImageLarge").visible = false;
							group.findObject("groupImageSmall").visible = true;
							group.findObject("networkNm").width = 500;
							if (nullToEmpty(group.data.NETWORK_NM_TOOLTIP) != '') {
								group.findObject("networkNm").me = group.data.NETWORK_NM_TOOLTIP;
							}
							
						} else if(!group.isSubGraphExpanded) {
							// 묶여져 있으면 이미지 보이기
							group.findObject("groupImageLarge").visible = true;
							group.findObject("groupImageSmall").visible = false;
							group.findObject("networkNm").width = 100; 
							if (nullToEmpty(group.data.NETWORK_NM) != '') {
								group.findObject("networkNm").me = group.data.NETWORK_NM;
							}
						}
						
						visualLinePath.contentAlignment = go.Spot.Center;
						
						
						/*
						 * 2018-03-06
						 * 1. [수정] RU광코어 링/예비선번 사용
						 */
						if (typeof targetDiagram != "undefined" && targetDiagram != null && targetDiagram !="null" && targetDiagram != "") {
							targetDiagram.contentAlignment = go.Spot.Center;	
						}
					}
				} 
				, new go.Binding("isSubGraphExpanded", "expanded")
				, $go(go.Shape, "RoundedRectangle" 
						     , {   name:"SHAPE"
						    	 , parameter1: 20
						    	 , fill : null
						    	 , stroke:"rgba(0,0,0,0.3)"
						    	}
					 ) // , new go.Binding("stroke", "color")  fill: "rgb(255,255,255)", stroke:"rgba(0,0,0,0.3)", stroke : null
				, $go(go.Panel, "Vertical"
					, $go(go.Panel, "Horizontal"
								, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
									, toolTip : $go(go.Adornment, "Auto"
													, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
													, $go(go.TextBlock, new go.Binding("text", "NETWORK_NM_TOOLTIP"), { margin: 4 })
									)
								}
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
												width: 300,
												height:30,
												name : "networkNm",
												cursor: "pointer" 
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

function selectedGroupImageTemplate() {
	var group = $go(go.Group, "Auto", 
 				{
		 			background: "transparent"
	 				, layout:  
						$go(go.GridLayout
							, { cellSize: new go.Size(4, 4), wrappingColumn:4, spacing: new go.Size(20, 20),
								comparer: function(a, b) {
									var av = a.data.SEQ;
									var bv = b.data.SEQ;
									if(av < bv) return -1;
									if(av > bv) return 1;
									return 0;
								}
							} 
					)
					, isSubGraphExpanded : true
				}
				, $go(go.Shape, "RoundedRectangle" , { fill: null, strokeWidth: 2, parameter1: 10 }, new go.Binding("stroke", "color"))
				, $go(go.Panel, "Vertical"
					, $go(go.Panel, "Horizontal"
								, { stretch: go.GraphObject.Horizontal, cursor: "pointer" 
									, toolTip : $go(go.Adornment, "Auto"
													, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC", parameter1: 10})
													, $go(go.TextBlock, new go.Binding("text", "NETWORK_NM"), { margin: 4 })
									)
								}
								, $go(go.Picture
										, {name : "groupImageSmall", desiredSize: new go.Size(30,30), margin: 5}
										, new go.Binding("source", "category", comvertPathImage)
								)
								, $go(go.TextBlock
										, {
											margin: 5,
											alignment: go.Spot.Left,
								            isMultiline: true,
								            editable: false,
								            font: "bold 10px sans-serif",
								            width: 300,
								            height:35,
								            name : "networkNm",
								            cursor: "pointer" 
							             }
										, new go.Binding("text", "NETWORK_NM").makeTwoWay()
										, new go.Binding("stroke", "color")
								)
								
					)  // end Horizontal Panel
					, $go(go.Placeholder
							, { padding: 5, alignment: go.Spot.Center }
					)
			)  // end Vertical Panel
		);
	
	return group;
}

/**
 * 트렁크 선택 선번 템플릿
 */
function selectedTrunkNodeTemplate() {
	var node = 
		$go(go.Node, "Auto",
		        {
					mouseDrop: function(e, nod) { 
						finishDrop(e); 
					}
					, alignment : go.Spot.Center
		        },
				
		        // 네모 박스
				$go(go.Shape, "RoundedRectangle"
						, { fill : "white", strokeWidth : 2, parameter1: 10 } //, new go.Binding("fill", "color")
				),
		        
				// ADD, DROP의 국사, 좌포트, 좌채널, 장비, 우포트, 우채널 모양의 
				$go(go.Panel, "Table"
						, { padding: 0.5, defaultAlignment : go.Spot.Center }	// , defaultColumnSeparatorStroke: "black"
						, $go(go.RowColumnDefinition, {row: 0, background:"#FFFFCC", coversSeparators: true})
						, $go(go.RowColumnDefinition, {row: 1, separatorStroke: "black", background:"white", coversSeparators: true})
						, $go(go.RowColumnDefinition, {row: 2, separatorStroke: "black", coversSeparators: true})
						, $go(go.RowColumnDefinition, {row: 3, separatorStroke: "black"})
						, $go(go.RowColumnDefinition, {column: 0, separatorStroke: "black", coversSeparators: true })
						, $go(go.RowColumnDefinition, {column: 1, separatorStroke: "black"})
						, $go(go.RowColumnDefinition, {column: 2, separatorStroke: "black", coversSeparators: true })
						, $go(go.RowColumnDefinition, {column: 3, separatorStroke: "black", coversSeparators: true })
						
						// 트렁크명
						, $go(go.Panel, "Vertical"
								, {row : 0, column : 0, columnSpan : 4, width:300, height:30 }
						        , $go(go.TextBlock
										, textBlockStyle()
										, new go.Binding("text", "NETWORK_NM").makeTwoWay()
				          		)
		          		)
		          		
		          		////////////////////////////////////// ADD
		          		// ADD 국사
				        , $go(go.Panel, "Vertical"
								, {row : 1, column : 0, columnSpan : 2, width:150, height:30 }
						        , $go(go.TextBlock
										, textBlockStyle()
										, new go.Binding("text", "ADD_ORG_NM").makeTwoWay()
				          		)
		          		)
		          		
		          		// ADD 장비
				        , $go(go.Panel, "Vertical"
								, {row : 2, column : 0, columnSpan: 2,  width:150, height: 30 		//, defaultColumnSeparatorStroke : "red", defaultRowSeparatorStroke
				        				, toolTip : $go(go.Adornment, "Auto"
				        								, $go(go.Shape, "RoundedRectangle") //, {fill: "#FFFFCC"}
				        								, $go(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4 })
				        							)
				        		}
						        , $go(go.TextBlock
										, textBlockStyle()
										, new go.Binding("text", "ADD_NE_NM").makeTwoWay()
										, new go.Binding("stroke", "ADD_NE_ID", function(data) {
						          			if(data == "-") {
						          				return "red";
						          			} else {
						          				return "black";
						          			}
										})
				          		)
		          		)
		          		
		          		// ADD 좌포트
						, $go(go.Panel, "Vertical"
								, {row : 3, column : 0, width:75, height: 30 }
								, $go(go.TextBlock
										, textBlockStyle()
										, new go.Binding("text", "ADD_EAST_PORT_NM").makeTwoWay()
								)
						)
		          		
		          		// ADD 우포트
		          		, $go(go.Panel, "Vertical"
								, {row : 3, column : 1, width:75, height: 30 }
								, $go(go.TextBlock
										, textBlockStyle()
						          		, new go.Binding("text", "ADD_WEST_PORT_NM").makeTwoWay()
						        )
				        )
		          		
		          		////////////////////////////////////// DROP
		          		// DROP 국사
				        , $go(go.Panel, "Vertical"
								, {row : 1, column : 2, columnSpan : 2, width:150, height:30 }
						        , $go(go.TextBlock
										, textBlockStyle()
										, new go.Binding("text", "DROP_ORG_NM").makeTwoWay()
				          		)
		          		)
		          		
		          		// DROP 장비
				        , $go(go.Panel, "Vertical"
								, {row : 2, column : 2, columnSpan: 2,  width:120, height: 30 		//, defaultColumnSeparatorStroke : "red", defaultRowSeparatorStroke
				        				, toolTip : $go(go.Adornment, "Auto"
				        								, $go(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"})
				        								, $go(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4 })
				        							)
				        		}
						        , $go(go.TextBlock
										, textBlockStyle()
										, new go.Binding("text", "DROP_NE_NM").makeTwoWay()
										, new go.Binding("stroke", "DROP_NE_ID", function(data) {
						          			if(data == "-") {
						          				return "red";
						          			} else {
						          				return "black";
						          			}
										})
				          		)
		          		)
		          		
		          		// DROP 좌포트
						, $go(go.Panel, "Vertical"
								, {row : 3, column : 2, width:75, height: 30 }
								, $go(go.TextBlock
										, textBlockStyle()
										, new go.Binding("text", "DROP_EAST_PORT_NM").makeTwoWay()
								)
						)
		          		
		          		// DROP 우포트
		          		, $go(go.Panel, "Vertical"
								, {row : 3, column : 3, width:75, height: 30 }
								, $go(go.TextBlock
										, textBlockStyle()
						          		, new go.Binding("text", "DROP_WEST_PORT_NM").makeTwoWay()
						        )
				        )
		        )
		    );
	return node;
}

/**
 * 링크 템플릿
 * @returns
 */
function baseLinkTemplate() {
	var link = $go(go.Link
			, {routing:go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner:5, selectable:false, fromSpot: go.Spot.Right, toSpot: go.Spot.Left} 
			, $go(go.Shape, {strokeWidth:1, stroke: "rgba(0,0,0,0.3)", name : "linkStroke"})
			, $go(go.Shape, {toArrow: "Standard", stroke: "rgba(0,0,0,0.3)", name : "linkArrow"})
	);
	
	return link;
}

// context menu
/*
 * 포트
 */
function contextMenuPort(name) {
	var contextMenu = $go(go.Adornment, "Vertical",
							$go("ContextMenuButton", { name : name },
									$go(go.TextBlock, "포트 삭제")
									, {
										click : function(e, obj) {
											var node = obj.part.adornedPart;
											removePort(node, obj.name);
										}
									}
							)
					);
	return contextMenu;
}

/*
 * 장비
 */
function contextMenu() {
	var rowDefinition = [];
	for(var idx = 0; idx < westNodeRole.length; idx++ ) {
		rowDefinition.push($go(go.RowColumnDefinition, {row: idx }));
		
	}
	
	var contextMenu = $go(go.Adornment, "Vertical",  
							$go("ContextMenuButton", contextMenuStyle()
									, $go(go.TextBlock, "선번 삭제", { name : "removeNode"})
									, {
										click : function(e, obj) {
											var node = obj.part.adornedPart;
											removeNode(node);
										}
									}
									
							),
							$go("ContextMenuButton", contextMenuStyle()
									, $go(go.TextBlock, "A, B포트 바꾸기", {name : "swapPort" })
									, {
										click : function(e, obj) {
											var node = obj.part.adornedPart;
											swapPort(node);
										}
									}
							),
							$go(go.Panel, "Horizontal",  { stretch: go.GraphObject.Horizontal, visible : false, name : "NODE_ROLE_TABLE"},
								$go(go.Panel, "Table"
										, { padding: 0.5, defaultAlignment : go.Spot.Center }
										, rowDefinition
										, $go(go.RowColumnDefinition, {column: 0 })
										, $go(go.RowColumnDefinition, {column: 1 })
										
										, $go("ContextMenuButton", contextMenuStyle(), {row : 0, column : 0, width:100 }
											, $go(go.TextBlock, "상하위")
										)
										, contextMenuNodeRole()
								)
							)
							,$go("ContextMenuButton", contextMenuStyle(), {visible : false, name : "EQP_LIST_DU_L"}
									, $go(go.TextBlock, "DU-L연결장비설정")
									, {
											click : function(e, obj) {
												var node = obj.part.adornedPart;
												fdfNodeId = node.data.NODE_ID;
												var nodeInfo = {
														
														"dulMtsoId" : node.data.Ne.ORG_ID
									    			   ,"dulMtsoIdNm" : node.data.Ne.ORG_NM
								    				   , "lowMtsoId" : nullToEmpty(baseInfData.lowMtsoId)
								    			       , "lowMtsoIdNm" : nullToEmpty(baseInfData.lowMtsoIdNm)
							    					   , "fiveGponVer" : nullToEmpty(baseInfData.fiveGponVer)
							    					   , "fiveGponEqpType" : "CRN"
							    				}
												openEqpListOfMtsoPop(nodeInfo);
											}
									}
							)
					);
	
	if( isServiceLine() || isRing() ) {
		contextMenu.findObject("NODE_ROLE_TABLE").visible = true;
	}
	
	return contextMenu;
}

function showContextMenu(event, obj) {
	for(var idx = 0; idx < westNodeRole.length; idx++ ) {
		var name = westNodeRole[idx].comCd;
		obj.part.findObject( "NODE_ROLE_" + name  ).visible = true;
	}
	
}

function hideContextMenu(event, obj) {
	for(var idx = 0; idx < westNodeRole.length; idx++ ) {
		var name = westNodeRole[idx].comCd;
		obj.part.findObject( "NODE_ROLE_" + name ).visible = false;
	}
}

/*
 * FDF장비
 */
function contextMenuFdf() {
	var rowDefinition = [];
	for(var idx = 0; idx < westNodeRole.length; idx++ ) {
		rowDefinition.push($go(go.RowColumnDefinition, {row: idx }));
		
	}
	
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
								teamsPath.reverseFdfPath(node.data.NODE_ID);
								reGenerationDiagram(true);
							}
					}
			),
			$go(go.Panel, "Horizontal",  { stretch: go.GraphObject.Horizontal, visible : false, name : "NODE_ROLE_TABLE" },
				$go(go.Panel, "Table"
						, { padding: 0.5, defaultAlignment : go.Spot.Center }
						, rowDefinition
						, $go(go.RowColumnDefinition, {column: 0 })
						, $go(go.RowColumnDefinition, {column: 1 })
						
						, $go("ContextMenuButton", {row : 0, column : 0, width:100 }
							, $go(go.TextBlock, "상하위")
						)
						, contextMenuNodeRole()
				)
			)
			
	);
	
	if( isServiceLine() || isRing() ) {
		contextMenu.findObject("NODE_ROLE_TABLE").visible = true;
	}

	return contextMenu;
}

/*
 * 사용네트워크
 */
function contextMenuNetwork() {
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
					$go(go.TextBlock, "선번 뒤집기")
					, {
							click : function(e, obj) {
								var node = obj.part.adornedPart;
								teamsPath.reverseUseNetwork(node.data.NODE_ID);
								reGenerationDiagram(true);
							}
					}
			),
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

/*
 * 사용네트워크의 상하위
 */
function contextMenuUseNtwkNodeRole() {
	var rowDefinition = [];
	for(var idx = 0; idx < westNodeRole.length; idx++ ) {
		rowDefinition.push($go(go.RowColumnDefinition, {row: idx }));
		
	}
	
	var contextMenu = $go(go.Adornment, "Vertical",  
							$go(go.Panel, "Horizontal",  { stretch: go.GraphObject.Horizontal, visible : false, name : "NODE_ROLE_TABLE"},
								$go(go.Panel, "Table"
										, { padding: 0.5, defaultAlignment : go.Spot.Center }
										, rowDefinition
										, $go(go.RowColumnDefinition, {column: 0 })
										, $go(go.RowColumnDefinition, {column: 1 })
										
										, $go("ContextMenuButton", contextMenuStyle(), {row : 0, column : 0, width:100 }
											, $go(go.TextBlock, "상하위")
										)
										, contextMenuNodeRole()
								)
							)
					);
	
	if( isServiceLine() || isRing() ) {
		contextMenu.findObject("NODE_ROLE_TABLE").visible = true;
	}
	
	return contextMenu;
}

/*
 * 링, 회선 상하위
 */
function contextMenuNodeRole() {
	var nodeRole = [];
	for(var idx = 0; idx < westNodeRole.length; idx++ ) {
		nodeRole.push($go("ContextMenuButton", contextMenuStyle()
							, {row : idx, column : 1, visible : true, name : "NODE_ROLE_" + westNodeRole[idx].comCd, "ButtonBorder.stroke" : null, "_buttonStrokeOver": null}
							, $go(go.TextBlock, westNodeRole[idx].comCdNm)
							, {
								click : function(e, obj) {
									var node = obj.part.adornedPart;
									for ( var nodeIdx = 0; nodeIdx < teamsPath.NODES.length; nodeIdx++ ) {
										var teamsNode = teamsPath.NODES[nodeIdx];
										if( teamsNode.NODE_ID == node.data.NODE_ID ) {
											teamsNode.NODE_ROLE_CD = westNodeRole[obj.part.findObject(obj.Ob).row].comCd;
											teamsNode.NODE_ROLE_NM = westNodeRole[obj.part.findObject(obj.Ob).row].comCdNm;
										}
									}
									
									// 그리드
									teamsPathData = teamsPath.toData();
									$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
									
									var tangoPath = teamsPath.toTangoPath();
									var tangoPathData = tangoPath.toData(); 
									$('#'+tagngoGridId).alopexGrid('dataSet', tangoPathData.LINKS);
								}
							}
						));
	}
	
	return nodeRole;
}


// 사용 네트워크 내의 장비 노드 선택 불가능하도록 & CONTEXTMENU
function nodeSelectionAdornedPath() {
	for(var idx = 0; idx < nodeDataArray.length; idx++) {
		var nodeData = nodeDataArray[idx];
		var node = visualLinePath.findNodeForData(nodeData);
		
		if(!nodeData.isGroup && nodeData.isNetworkNode()) {
			node.selectionAdorned = false;
			node.movable = false;
			
			// 네트워크 노드. 서비스회선이거나 링일 경우. 상하위 표시
			node.contextMenu = contextMenuUseNtwkNodeRole();
		} else {
			if(nodeData.isGroup) {
				node.contextMenu = contextMenuNetwork();
			} else if(isFdfNe(nodeData.Ne.NE_ROLE_CD)) {
				node.contextMenu = contextMenuFdf();
			} else {
				node.contextMenu = contextMenu();
				if (isFiveGponRuCoreLine() == true && isFiveGponDuL(node.data.Ne, "A") == true) {
					node.contextMenu.findObject("EQP_LIST_DU_L").visible = true;
				}
			}
		}
	}
	
	// 네트워크(장비)를 이동 또는 추가했을 때 해당 노드 표시
	if(selectedPathData != null) {
		for(var idx = 0; idx < nodeDataArray.length; idx++) {
			var shape = visualLinePath.findNodeForData(nodeDataArray[idx]).findObject("SHAPE");
			
			if(!moveYn) {
				if(nullToEmpty(selectedPathData.NETWORK_ID) != "") {
					if( selectedPathData.NODES != undefined ) {
						selectedPathData.toShortPath();
						if( (selectedPathData.NODES[0].NODE_ID == nodeDataArray[idx].NODE_ID) && nodeDataArray[idx].isGroup ) {
							shape.stroke = "#F15F5F";
							shape.strokeWidth = 5;
							nodeSelectedIdx = idx;
						}
					}
				} else {
					if( nodeDataArray[idx].NODE_ID == selectedPathData.NODE_ID ) {
						shape.stroke = "#F15F5F";
						shape.strokeWidth = 5;
						nodeSelectedIdx = idx;
					}
				}
			} else {
				if( (nodeDataArray[idx].isGroup == selectedPathData.isGroup) 
						&& (nodeDataArray[idx].NODE_ID == selectedPathData.NODE_ID) ) {
					shape.stroke = "#F15F5F";
					shape.strokeWidth = 5;
					nodeSelectedIdx = idx;
				} else {
					shape.fill = null;
				}
			}
		}
	} else {
		
	}
	
	selectedPathData = null;
	 
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
			if (nullToEmpty(eastPortChannelNode) != null) {
				if (nodeData.APortDescr.EDITABLE_PORT || nodeData.APortDescr.EDITABLE_CHANNEL) {
					portColor = editableColor;
					nodePortSearch(eastPortChannelNode);
					portChannelEditable = true;
				}
				portChannelRect('EAST_PORT_CHANNEL_PART', portColor, node, nodeData);
			}
			
			portColor = disEditableColor;
			if (nullToEmpty(westPortChannelNode) != null) {
				if (nodeData.BPortDescr.EDITABLE_PORT == true || nodeData.BPortDescr.EDITABLE_CHANNEL == true) {
					portColor = editableColor;
					nodePortSearch(westPortChannelNode, nodeData);
					portChannelEditable = true;
				}
				portChannelRect('WEST_PORT_CHANNEL_PART', portColor, node, nodeData);
			}

		}
	}
}

function portChannelRect(objName, color, node) {
	var portChannelRect = node.findObject(objName);
	portChannelRect.strokeWidth = 3;
	portChannelRect.stroke = color;
	portChannelRect.fill = color;
	
	if(color == "#E8CEC9") {
		var name = objName.substring(0, 4) + "_PORT_CHANNEL";
		if(eval("node.data." + name) == "" && portChannelEditable) {
			portChannelRect.fill = "#FF0000";
		} else {
			portChannelRect.fill = color;
		}
	} 
	
	portChannelEditable = false;
}


function nodeSelectionAdorned() {
	for(var idx = 0; idx < selectedPathNodeDataArray.length; idx++) {
		var nodeData = selectedPathNodeDataArray[idx];
		var node = selectedLinePathDiv.findNodeForData(nodeData);
		
		if(!nodeData.isGroup) {
			node.selectionAdorned = false;
			node.movable = false;
		}  
	}
}

function mouseEnter(e, obj) {
	
	var shape = obj.findObject("SHAPE");
	shape.stroke = "#6DAB80";
	shape.strokeWidth = 1.49;
	  
	if(obj.data.NE_ROLE_CD != undefined) {
		obj.findObject("nodeImage").source = getEqpIcon(obj.data.NE_ROLE_CD, "S"); 
	}
}

function mouseLeave(e, obj) {
	var shape = obj.findObject("SHAPE");
	shape.stroke = "rgba(0,0,0,0.3)";
	shape.strokeWidth = 1;
	
	if(obj.data.NE_ROLE_CD != undefined) {
		obj.findObject("nodeImage").source = getEqpIcon(obj.data.NE_ROLE_CD, ""); 
	}
}

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