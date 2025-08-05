/**
 * RingDiagramPop.js
 *
 * @author Administrator
 * @date 2017. 2. 11. 17:30:03 
 * @version 1.0
 */
//var networkInfo = ['NETWORK_ID', 'NETWORK_NM', 'NETWORK_STATUS_CD', 'NETWORK_STATUS_NM', 'PATH_DIRECTION', 'PATH_SAME_NO', 'PATH_SEQ', 'TOPOLOGY_LARGE_CD', 'TOPOLOGY_LARGE_NM', 'TOPOLOGY_SMALL_CD', 'TOPOLOGY_SMALL_NM'];

// parent progress z-index 설정
var targetName;
var zIndex;

/**
 * ScrollingTable Panel js --- START
 */
// This also defines an "AutoRepeat Button" Panel,
// which is used by the scrollbar in the "ScrollingTable" Panel.

var $go = go.GraphObject.make;
// This defines a custom "Button" that automatically repeats its click
// action when the user holds down the mouse.
go.GraphObject.defineBuilder("AutoRepeatButton", function(args){
	
	// some internal helper functions for auto-repeating
	function delayClicking(e, obj) {
		endClicking(e, obj);
		if(obj.click) {
			obj._timer = setTimeout(function(){ repeatClicking(e, obj);}, 500);
		}
	}
	
	function repeatClicking(e, obj) {
		if(obj._timer) clearTimeout(obj._timer);
		if(obj.click) {
			obj._timer = 
				setTimeout(function(){
					if(obj.click) {
						(obj.click)(e, obj);
						repeatClicking(e, obj);
					}
				}, 100); // 0.1 seconds between clicks
		}
	}
	
	function endClicking(e, obj) {
		if(obj._timer) {
			clearTimeout(obj._timer);
			obj._timer = undefined;
		}
	}
	
	return $go("Button", {actionDown: delayClicking, actionUp: endClicking});
});

// Create a scrolling Table Panel, whose name is given as the optional first argument.
// If not given the name defaults to "TABLE".
// Example use:
//		$("ScrollingTable", "TABLE",
//			new go.Binding("TABLE.itemArray", "someArrayProperty"),
//			...)
// Note that if you have more than one of these in a Part,
// you'll want to make sure each one has a unique name.
go.GraphObject.defineBuilder("ScrollingTable", function(args){
	var tablename = go.GraphObject.takeBuilderArgument(args, "TABLE");
	
	// an internal helper function for actually performing a scrolling operation
	function incrTableIndex(obj, i) {
		var diagram = obj.diagram;
		if(diagram != null) diagram.startTransaction("scroll");
		var table = obj.panel.panel.panel.findObject(tablename); // Be careful!!!!
		if(i === +Infinity || i === -Infinity) { // page up or down
			var tabh = table.actualBounds.height;
			var rowh = table.elt(table.topIndex).actualBounds.height; // assume each row has same height?
			if(i === +Infinity) {
				i = Math.max(1, Math.ceil(tabh / rowh) - 1);
			} else {
				i = -Math.max(1, Math.ceil(tabh / rowh) - 1);
			}
		}
		var idx = table.topIndex + i;
		if(idx < 0) idx = 0;
		else if(idx >= table.rowCount - 1) idx = table.rowCount - 1;
		table.topIndex = idx;
		var up = table.panel.findObject("UP");
		if(up) up.visible = (idx > 0);
		var down = table.panel.findObject("DOWN");
		if(down) down.visible = (idx < table.rowCount - 1);
		if(diagram !== null) diagram.commitTransaction("scroll");
	}
	
	var tableGraphObject = 
		$go(go.Panel, "Table",
			
			// this actually holds the item elements
			$go(go.Panel, "Table",
					{name: tablename, column: 0, stretch: go.GraphObject.Fill, background: "whitesmoke",
					rowSizing: go.RowColumnDefinition.None, defaultAlignment: go.Spot.Top}),
			
			// this is the scrollbar
			$go(go.RowColumnDefinition,
					{column: 1, sizing: go.RowColumnDefinition.None}),
			$go(go.Panel, "Table"
					, {column: 1, stretch: go.GraphObject.Vertical, background: "#DDDDDD"}
					// the scroll up button
					, $go("AutoRepeatButton"
							, {
							row: 0,
							alignment: go.Spot.Top,
							"ButtonBorder.figure": "Rectangle",
							"ButtonBorder.fill": "lightgray",
							click: function(e, obj) { incrTableIndex(obj, -1); }
							}
							, $go(go.Shape, "TriangleUp"
									, { stroke: null, desiredSize: new go.Size(8, 8)})  // triangle size. Modify this if you want.
					)
					, $go("AutoRepeatButton",
							{
							row: 3,
							alignment: go.Spot.Bottom,
							"ButtonBorder.figure": "Rectangle",
							"ButtonBorder.fill": "lightgray",
							click: function(e, obj) { incrTableIndex(obj, +1); }
							},
							$go(go.Shape, "TriangleDown",
									{ stroke: null, desiredSize: new go.Size(8, 8)})) // triangle size. Modify this if you want.
					)
			);
	
	return tableGraphObject;
});


var main = $a.page(function() {
	
	var responseObject = {};
	var isMainPTP = false;
	var otherNPsInfo = [];
	var ringDiagram = null;
	var mainNtwkLineNo = '';
	var mainNtwkLnoGrpSrno = '';
	
	var nodeDataArray = [];
	var linkDataArray = [];
	var radius = '300'; // 링형 네트워크의 반지름 값.
	var mainNetworkNm = '';
	
	// init. parameter 설정
	this.init = function(id, param) {
		if (! jQuery.isEmptyObject(param) ) {
			jQuery('#multiRingDiv').append('<div class="button_box">' +
					'&nbsp;&nbsp;&nbsp;<button type="button" class="Button button bg_blue" id="btnImageSave" style="margin-left:10px;float:left;" >이미지 저장</button>' +
					"<span id='diagLegendBlue' name='diagLegend' style='text-align:center;width:100px;color:blue;font-size:1.1em;float:right;'>● WEST포트</span>" + 
	    			"<span id='diagLegendRed' name='diagLegend' style='text-align:center;width:100px;color:red;font-size:1.1em;float:right;'>● EAST포트</span>" +
	    			'<span style="text-align:center;width:100px;font-size:1.1em;float:right;"><input type="checkbox" id="portBox" class="Checkbox" value="SHOW PORTS" checked="checked">SHOW PORTS</span>' +
					'</div>'
			);
			jQuery('#multiRingDiv').append('<div id="ringDiagramDiv" style="margin-top:30px; height:730px;"></div>');
			
			mainNtwkLineNo = param.ntwkLineNo;
			mainNtwkLnoGrpSrno = param.ntwkLnoGrpSrno;
			if(mainNtwkLnoGrpSrno == null || mainNtwkLnoGrpSrno == undefined || mainNtwkLnoGrpSrno == '') mainNtwkLnoGrpSrno = '1';
			var data = {"ntwkLineNo" : mainNtwkLineNo, "ntwkLnoGrpSrno" : mainNtwkLnoGrpSrno};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectMultiRingPath', data, 'GET', 'search');
    	}
    };
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
    		data : Param, 		//data가 존재할 경우 주입
    		method : Method, 	//HTTP Method
    		flag : Flag
    	}).done(successCallback);
    }
    
    this.setImgSrc = function(){
		if(ringDiagram != null) {
			var myImg = ringDiagram.makeImage(
					{
						scale: 1
						, maxSize: new go.Size(Infinity, Infinity)
						, type: 'image/png'
					}
			);

			var myImgSrc = myImg.src;
			myImgSrc = myImgSrc.replace("data:image/png;base64,","");
			
			return myImgSrc;
		}
    }
    
    function setEventListener() {
//    	$a.convert(jQuery("#ringAddDropDiv"));
    	
    	// 이미지 저장 버튼
    	jQuery('button#btnImageSave').on('click', function(e) {
    		if(ringDiagram != null) {
    			var image = ringDiagram.makeImage(
    					{
    						scale: 1
    						, maxSize: new go.Size(Infinity, Infinity)
    						, type: 'image/png'
    					}
    			);
    			var fileName = '';
    			var d = new Date();
    			var dateStr = lpad(d.getFullYear().toString(), '0', 4) 
    						+ lpad((d.getMonth() + 1).toString(), '0', 2)
    						+ lpad( d.getDate().toString(), '0', 2)
    						+ lpad( d.getHours().toString(), '0', 2)
    						+ lpad( d.getMinutes().toString(), '0', 2)
    						+ lpad( d.getSeconds().toString(), '0', 2);
    			
    			fileName = dateStr + '_' + mainNetworkNm + '.png';
    			downloadImage(image, fileName);
    		}
    	});
    	
    	jQuery('#portBox').on('click', function(e) {
    		var model = ringDiagram.model;
    		if(jQuery(this).prop('checked') == true) {
    			
    	    	model.startTransaction("show ports");
    			var nodeDataArr = model.nodeDataArray;
    			for(var i = 0; i < nodeDataArr.length; i++) {
    				var graphObj = ringDiagram.findNodeForData(nodeDataArr[i]);
    				if(graphObj != null) {
    					if(graphObj.findObject('portLeft') != null) {
    						graphObj.findObject('portLeft').setProperties({opacity : 1});
    					}
    					if(graphObj.findObject('portLeftText') != null) {
    						graphObj.findObject('portLeftText').setProperties({opacity : 1});
    					}
    					if(graphObj.findObject('portRight') != null) {
    						graphObj.findObject('portRight').setProperties({opacity : 1});
    					}
    					if(graphObj.findObject('portRightText') != null) {
    						graphObj.findObject('portRightText').setProperties({opacity : 1});
    					}
    				}
    			}
    			model.commitTransaction("show ports");
    		} else {
    			model.startTransaction("hide ports");
    			var nodeDataArr = model.nodeDataArray;
    			for(var i = 0; i < nodeDataArr.length; i++) {
    				var graphObj = ringDiagram.findNodeForData(nodeDataArr[i]);
    				if(graphObj != null) {
    					if(graphObj.findObject('portLeft') != null) {
    						graphObj.findObject('portLeft').setProperties({opacity : 0});
    					}
    					if(graphObj.findObject('portLeftText') != null) {
    						graphObj.findObject('portLeftText').setProperties({opacity : 0});
    					}
    					if(graphObj.findObject('portRight') != null) {
    						graphObj.findObject('portRight').setProperties({opacity : 0});
    					}
    					if(graphObj.findObject('portRightText') != null) {
    						graphObj.findObject('portRightText').setProperties({opacity : 0});
    					}
    				}
    			}
    			model.commitTransaction("hide ports");
    		}
    	});
    }
    
    function lpad(s, c, n){
    	if(! s || ! c || s.length>=n){
    		return s;
    	}
    	var max = (n- s.length)/c.length;
    	for(var i = 0;i<max;i++){
    		s = c+s;
    	}
    	return s;
    }
    
    function downloadImage(img, fileName) {
    	var imgDataArr = img.src.split(',');
    	var imgData = atob(imgDataArr[1]);
    	var len = imgData.length;
    	var buf = new ArrayBuffer(len);
    	var view = new Uint8Array(buf);
    	var blob;
    	var fileExt = imgDataArr[0].substring(imgDataArr[0].indexOf(':')+1, imgDataArr[0].indexOf(';')).replace('image\/', '');
    	
    	for(var i = 0; i < len; i++) {
    		view[i] = imgData.charCodeAt(i) & 0xff;
    	}
    	
    	blob =  new Blob([view], {type: 'application/octet-stream'});
    	if(window.navigator.msSaveOrOpenBlob) {
    		window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + fileExt);
    	} else {
    		var a = document.createElement('a');
    		a.style = "display: none";
    		a.href = img.src;
    		a.download = fileName;
    		
    		var multiRingDiv = document.getElementById('multiRingDiv');
    		multiRingDiv.appendChild(a);
    		a.click();
    		setTimeout(function(){
    			multiRingDiv.removeChild(a);
    		}, 100);
    	}
    	
    }
    
    function makeDiagramTemplate() {
    	var $ = go.GraphObject.make;
		
		ringDiagram = $(go.Diagram, "ringDiagramDiv", {
    		initialContentAlignment:go.Spot.Center, padding:10, isReadOnly:true
    		, initialAutoScale: go.Diagram.None
    		, initialScale: 0.80
    		, initialDocumentSpot : go.Spot.Center
    		, initialViewportSpot : go.Spot.Center
    		, "toolManager.hoverDelay" : 300
    		
    		, maxSelectionCount:0
    	});
		
		/**
		 * 노드 템플릿
		 */
		var neNodeTemplate =
			$(go.Node, "Spot"
					, {locationSpot: go.Spot.Center, name : "nodeData", zOrder: 1//, selectionAdorned:false, selectionChanged: addDropSelect
    					, toolTip : $(go.Adornment, "Auto",
    									$(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"}),
    									$(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4})
    								)
    				}
					, new go.Binding('location', 'loc', go.Point.parse)
//					, new go.Binding('opacity', 'opacity')
					, new go.Binding('visible', 'visible')
					// 노드 이미지
					, $(go.Picture, {name : "nodeImage", desiredSize: new go.Size(77, 78)}, new go.Binding("source", "role"))
					// 입력측 포트 마크
					, $(go.Panel, "Vertical", {name : "portLeft", alignment: go.Spot.Left}
							, $(go.Shape, "Circle"
						   			, { name : "portLeftPanel", fill : "red", stroke:null, desiredSize: new go.Size(15, 15)}
		   					)
					)
					// 입력측 포트 정보
					, $(go.TextBlock, new go.Binding("text", "RIGHT_PORT_DESCR"), 
							{name : "portLeftText", font: "11pt Dotum", width : 100, alignment : new go.Spot(0.5,0.5,-100,0), textAlign : "center"}
					)
					// 출력측 포트 마크
					, $(go.Panel, "Vertical", {name : "portRight", alignment: go.Spot.Right}
							, $(go.Shape, "Circle"
				   					, { name : "portRightPanel", fill : "blue", stroke:null, desiredSize: new go.Size(15, 15)}
							)
					)
					// 출력측 포트 정보
					, $(go.TextBlock, new go.Binding("text", "LEFT_PORT_DESCR"), 
							{name : "portRightText", font: "11pt Dotum", width : 100, alignment: new go.Spot(0.5,0.5,100,0), textAlign : "center"}
					)
					// 장비명
					, $(go.TextBlock, new go.Binding("text", "NODE_DESCR"), 
							{font: "12pt Dotum bold", alignment:go.Spot.BottomCenter, width: 200, textAlign : "center"
							, wrap : go.TextBlock.wrapDesiredSize}
					)
    		);
		
		var templateMap = new go.Map("string", go.Node);
		templateMap.add("ne", neNodeTemplate);
		ringDiagram.nodeTemplateMap = templateMap;
		
		/**
		 * 그룹 템플릿
		 */
		var fieldTemplate = 
			$(go.Panel, "TableRow"
					, new go.Binding("background", "connectedNeId", function(connectedNeId) {return (connectedNeId == 'main')? "lightgreen" : "transparent"})
					, {
//						background : "transparent" // 이 포트의 백그라운드가 마우스로 선택될 수 있게 하기 위해
						cursor: 'pointer'
						, toolTip : $(go.Adornment, "Auto",
										$(go.Shape, "RoundedRectangle", {fill: "#FFBBCC"}),
										$(go.TextBlock, new go.Binding("text", "networkNm"), { margin: 4})
									)
					}
					, { // allow the user to select items --  the backgroud color indicates whether "selected"
						//?? maybe this should be more sophisticated than simple toggling of selection
						click : function(e, item) { 
							// assume "transparent" means not "selected", for items 
//							var oldskips = item.diagram.skipsUndoManager;
							
							item.diagram.skipsUndoManager = true;
							
							var tempKeyStr = item.data.connectedNeId + "BGroup"; // connectedNeId 가 키임..
							if(tempKeyStr == 'mainBGroup') {
								return;
							}
							
							var bigGroupGraphObj = ringDiagram.findPartForKey(tempKeyStr);
							var list = bigGroupGraphObj.findObject("TABLE");
							
							if(list) {
								var itr = list.elements;
								while(itr.next()) {
									var itrItem = itr.value;
									
									if(itrItem.data.networkId == item.data.networkId) {
										if(item.background == 'dodgerblue') {
											// 선택해제
											itrItem.background = "transparent";
											showAndHideAdjacentNe(item.data.connectedNeId, false);
											showAndHideNodes(false, itrItem.data.networkId, false);
											
										} else {
											// 선택
											itrItem.background = "dodgerblue";
											showAndHideAdjacentNe(item.data.connectedNeId, true);
											showAndHideNodes(false, itrItem.data.networkId, true);
											
										}
									} else {
										// 선택해제
										itrItem.background = "transparent";
										showAndHideNodes(false, itrItem.data.networkId, false);
//										showAndHideAdjacentNe(item.data.connectedNeId, false);
									}
								}
							}
							
//							item.diagram.skipsUndoManager = oldskips;
						}
					}
					, $(go.TextBlock
							, {margin: new go.Margin(0, 2), column: 0, font: "bold 16px sans-serif", alignment: go.Spot.Left
								, fromLinkable: false, toLinkable: false
							}
							, new go.Binding("text", "networkNm")
					)
			);
		
		
		var bigGroupTemplate = 
			$(go.Group, "Auto"
					, new go.Binding('location', 'loc', go.Point.parse)
					, {locationSpot: go.Spot.Center, zOrder: 2}
					, $(go.Shape, {fill: "#EEEEEE"})
					, $(go.Panel, "Auto"
							// this Panel holds aPanel for each item object in the itemArray;
							// each item Panel is defined by the itemTemplate to be a TableRow in ths Table
							, $("ScrollingTable"
									, new go.Binding("TABLE.itemArray", "items")
									, {name: "SCROLLING"
										, desiredSize: new go.Size(NaN, 60)
										, minSize: new go.Size(200, 10)
										, maxSize: new go.Size(300, 300)
										, "TABLE.itemTemplate": fieldTemplate
										, "TABLE.defaultColumnSeparatorStroke": "gray"
										, "TABLE.defaultColumnSeparatorStrokeWidth": 0.5
										, "TABLE.defaultRowSeparatorStroke": "gray"
										, "TABLE.defaultRowSeparatorStrokeWidth": 0.5
//										, "TABLE.defaultSeparatorPadding": new go.Margin(1, 3, 0, 3)
									}
							)
					)
			);
		
		var smallGroupTemplate = 
			$(go.Group
					, new go.Binding('location', 'loc', go.Point.parse)
					, new go.Binding('opacity', 'opacity')
//					, {locationSpot: go.Spot.Center, zOrder: 5}
//					, $(go.Panel, "Auto"
//							, $(go.Shape, "RoundedRectangle", {fill: 'blue'})
//							, $(go.TextBlock, new go.Binding("text", "TOPOLOGY_SMALL_NM"))
//					)
			);
		
		var grpTemplateMap = new go.Map("string", go.Group);
		grpTemplateMap.add("OfGroups", bigGroupTemplate);
		grpTemplateMap.add("OfNodes", smallGroupTemplate);
		ringDiagram.groupTemplateMap = grpTemplateMap;
		
		
		/**
		 * 링크 템플릿
		 */
		var lineLinkTemplate = 
			$(go.Link, {
				curve: go.Link.Bezier, selectable: false, zOrder: 0
				, toolTip : $(go.Adornment, "Auto",
						$(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"}),
						$(go.TextBlock, new go.Binding("text", "linelinkTooltip"), { margin: 4})
					)
				}
				, $(go.Shape, {strokeWidth: 3, stroke:"black"})	
			);
		
		var dottedLineLinkTemplate = 
			$(go.Link, {selectable: false, zOrder: 0}
					, new go.Binding('opacity', 'opacity')
					, $(go.Shape, {strokeWidth: 3, stroke:"green", strokeDashArray: [10, 10]})	
			);
		
		var ptpLineLinkTemplate = 
			$(go.Link, {curve: go.Link.None, selectable: false, zOrder: 0}
					, new go.Binding('opacity', 'opacity')
					, $(go.Shape, {strokeWidth: 2, stroke:"black"})	
			);
		
		var lkTemplateMap = new go.Map("string", go.Link);
		lkTemplateMap.add("line", lineLinkTemplate);
		lkTemplateMap.add("dottedLine", dottedLineLinkTemplate);
		lkTemplateMap.add("ptpLine", ptpLineLinkTemplate);
		ringDiagram.linkTemplateMap = lkTemplateMap;
		
	}
    	
    	
    function successCallback(response, status, jqxhr, flag){
//    	console.log('response');
//    	console.log(response);

    	if(response.data != null) {
    		responseObject = response.data;
    		mainNetworkNm = responseObject.NETWORK_NM;

			jQuery('#ntwkLineNm').val(responseObject.NETWORK_NM );
			jQuery('#ntwkLineNo').val(responseObject.NETWORK_ID );
			jQuery('#topoSclNm').val(responseObject.TOPOLOGY_SMALL_NM );
			
    		setEventListener();
    		
    		if(responseObject.TOPOLOGY_SMALL_CD === '002') {
    			isMainPTP = true;
    		}
    		
    		makeDiagramTemplate();
    		
    		// nodeDataArray 설정
    		var dataList = makeData(responseObject);
    		
    		if(dataList.length == 0){
    			callMsgBox('','W', '표시할 데이터가 없습니다.', function(msgId, msgRst){
            		if (msgRst == 'Y') {
            			var returnData = '';
                		$a.close(returnData);
            		}
        		});
    			
    			return;
    		} else {
    			nodeDataArray = dataList;
        		
        		// linkDataArray 설정
        		/**
        		 * 1. 실선인 경우 링 구간 표시
        		 * 2. 점선인 경우 메인 링의 구간과 다른 선번의 구간이 같은 경우 표시
        		 */
        		var lnkDataList = makeLinkData(nodeDataArray);
        		linkDataArray = lnkDataList;
            	
            	ringDiagram.startTransaction('insert data into model');
        		ringDiagram.model.nodeDataArray = nodeDataArray;
        		ringDiagram.model.linkDataArray = linkDataArray;
        		ringDiagram.commitTransaction('insert data into model');
        		
        		showAndHideNodes(true);
    		}
    	} else {
    		callMsgBox('','W', '조회된 데이터가 없습니다.', function(msgId, msgRst){
        		if (msgRst == 'Y') {
        			var returnData = '';
            		$a.close(returnData);
        		}
    		});
    	}
    }
    
    
    function makeData(dataObj) {
		var mainRingDataArr = makeNodeData(responseObject, true, 'main'); // 일단 메인
		
		if(mainRingDataArr.length < 2) {
			return [];
		}
		
		var tmpDataList = [];
		
//		for(var i = 0; i < mainRingDataArr.length; i++) {
//			tmpDataList.push(mainRingDataArr[i]);
//		}
		tmpDataList = mainRingDataArr.slice(0);
//		tmpDataList = mainRingDataArr;
		
    	// data.ADJACENT_RING_PATHS 인접 링 추가
		var allNetworkLineIds = [];
		var isSameNetworkId = false;
		var mainRingDataArrLen = mainRingDataArr.length;
		
    	for(var i = 0; i < mainRingDataArrLen; i++) {
    		if(mainRingDataArr[i].ADJACENT_RING_PATHS.length > 0) {
    			for(var j = 0; j<mainRingDataArr[i].ADJACENT_RING_PATHS.length; j++) {
    				// 중복 링 체크
    				for(var index in allNetworkLineIds) {
    					if(mainRingDataArr[i].ADJACENT_RING_PATHS[j].NETWORK_ID == allNetworkLineIds[index]) {
    						isSameNetworkId = true;
    						break;
    					}
    				}
    				
    				if(!isSameNetworkId) {
    					var tmpArr = [];
        				tmpArr = makeNodeData(mainRingDataArr[i].ADJACENT_RING_PATHS[j], false, mainRingDataArr[i].key);
        				
        				if(tmpArr.length > 0) {
        					for(k = 0; k < tmpArr.length; k++) {
        						tmpDataList.push(tmpArr[k]);
        					}
        				}
        				
        				allNetworkLineIds.push(mainRingDataArr[i].ADJACENT_RING_PATHS[j].NETWORK_ID);
    				} else {
    					isSameNetworkId = false; //해당 변수 초기화
    				}
    			}
    		}
    	}
    	
    	// 노드에 딸린 대그룹 데이터 추가
		var tmpObj = {};
		tmpObj.key = 'mainBGroup'; // 키값은 장비 아이디. + 'BGroup'
		tmpObj.isGroup = true;
		tmpObj.category = "OfGroups";
//		tmpObj.connectedNeKey = "main";
		
		var listLen = tmpDataList.length;
		var keyVal = tmpObj.key;
		
    	for(var i = 0; i < listLen; i++) {
    		if(tmpDataList[i].hasOwnProperty('isGroup') && tmpDataList[i].isGroup && keyVal !== (tmpDataList[i].group)) {
    			var tmp = {};
    			tmp.key = tmpDataList[i].group;
    			tmp.isGroup = true;
    			tmp.category = "OfGroups";
//    			tmpObj.connectedNeKey = "main";
    			
    			tmpDataList.push(tmp);
    			
    			keyVal = tmp.key;
    		}
    	}
    	
    	tmpDataList.push(tmpObj); // 초기 설정값도 추가.
    	
    	// 큰 그룹에서 NETWORK_NM 리스트를 추가. 이 데이터로 작은 그룹을 선택함.
    	for(var i = 0; i < tmpDataList.length; i++) {
    		var compareVal = ''; // 메인
    		
    		if(tmpDataList[i].category === "OfGroups") {
    			compareVal = tmpDataList[i].key;
    			var networkNmList = [];
    			
    			for(var j = 0; j < tmpDataList.length; j++) {
    				if(tmpDataList[j].category == 'OfNodes' && tmpDataList[j].group == compareVal) {
    					var tmpObj = {
    							networkId : tmpDataList[j].NETWORK_ID
    							, networkNm : tmpDataList[j].NETWORK_NM
    							, connectedNeId : tmpDataList[i].key.substring(0, tmpDataList[i].key.indexOf("BGroup"))
    					}
    					networkNmList.push(tmpObj);
    				}
    			}
    			
    			tmpDataList[i].items = networkNmList;
    		}
    	}
    	
    	// 메인부터 위치 잡아야함.
    	computeLocation(tmpDataList, true);
    	computeLocation(tmpDataList, false);
    	
    	return tmpDataList;
    }
    
    
    function computeLocation(dataArray, isMain) {
    	if(isMain) {
    		var networkId = '';
    		var connectedNeKey = '';
    		
    		for(var i = 0; i < dataArray.length; i++) {
        		//메인 대그룹 중점 위치
        		if(dataArray[i].category == "OfGroups" && dataArray[i].key == "mainBGroup") {
        			dataArray[i].loc = '0 0';
        			networkId = dataArray[i].items[0].networkId;
        			connectedNeKey = '';
        		}
        	}
    		
    		if(isMainPTP) {
    			computePTPLocation(dataArray, networkId, connectedNeKey, true);
    		} else {
    			computeCircleLocation(dataArray, networkId, connectedNeKey);
    		}
    	} else {
    		if(isMainPTP) {
    			// 대그룹 위치 설정
    			for(var i = 0; i < dataArray.length; i++) {
    				
    				if(dataArray[i].category == "OfGroups" && dataArray[i].key != "mainBGroup") {
    					var neKeyForfinding = dataArray[i].key.substring(0, dataArray[i].key.indexOf("BGroup"));
    					var tmpLoc = '0 0';
    					
    					for(var j = 0; j < dataArray.length; j++) {
    						if(dataArray[j].category == "ne" && dataArray[j].key == neKeyForfinding) {
    							tmpLoc = dataArray[j].loc;
    							break;
    						}
    					}
    					
    					var addX = Number(radius) * (2/3);
    					var addY = Number(radius) / 2;
    					var tmpLocArr = tmpLoc.split(' ');
    					var x = Number(tmpLocArr[0]) + addX;
    					var y = Number(tmpLocArr[1]) + addY;
    					
    					dataArray[i].loc = x + ' ' + y;
    				}
    			}
    			
    			
    			// 메인이 ptp 인 경우는 subNetwork가 ptp인 경우와 보통 링인 경우를 나눠서 생각해야 한다.
    			for(var i = 0; i < dataArray.length; i++) {
    				// 메인의 ptp링의 장비에서 인접한 링 networkId를 구한다.
    				if(dataArray[i].category == "ne" && dataArray[i].NETWORK_ID == mainNtwkLineNo) {
    					var adjacentRingPathsArr = dataArray[i].ADJACENT_RING_PATHS;
    					
    					for(var j = 0; j < adjacentRingPathsArr.length; j++) {
    						var networkId = adjacentRingPathsArr[j].NETWORK_ID;
    						var topologySmallCd = adjacentRingPathsArr[j].TOPOLOGY_SMALL_CD;
    						var isPTP = false;
    						var connectedNekey = dataArray[i].key;
    						
    						if(topologySmallCd == '002') {
    							isPTP = true;
    						}
    						
    						if(isPTP) {
    							computePTPLocation(dataArray, networkId, connectedNekey, false);
    						} else {
    							computeCircleLocation(dataArray, networkId, connectedNekey);
    						}
    					}
    				}
    			}
    			
    		} else {
//    			var radius = '250'; // computeCircleLocation 함수에서도 사용하는데 값이 서로 다르면 위치가 변함. 항상 동일하게.
    			for(var i = 0; i < dataArray.length; i++) {
        			if(dataArray[i].category == "OfGroups" && dataArray[i].key != "mainBGroup") {
        				var connectedNekey = dataArray[i].key.substring(0, dataArray[i].key.indexOf("BGroup"));
        				var neKeyValue = connectedNekey;
        				var connectedNeAngle = 0;
        				
        				for(var j = 0; j < dataArray.length; j++) {
        					if(dataArray[j].category == "ne" && dataArray[j].key == neKeyValue) {
        						connectedNeAngle = dataArray[j].angle;
        						connectedNeLoc = dataArray[j].loc;
        					}
        				}
        				
        				// 중점위치 잡고 장비 위치 설정.
        				var centerX = 0;
        				var centerY = 0;
        				var connectedNeCoordinate = connectedNeLoc.split(' ');
        				
        				centerX = Number(connectedNeCoordinate[0]) + Math.floor( (Number(radius) * Math.cos( (connectedNeAngle/180)*Math.PI )) * 100 ) / 100;
        				centerY = Number(connectedNeCoordinate[1]) + Math.floor( ((Number(radius) * Math.sin( (connectedNeAngle/180)*Math.PI ) * -1)) * 100 ) / 100;
        				
        				var tempLocStr = String(centerX) + ' ' + String(centerY);
        				dataArray[i].loc = tempLocStr;
        				
        				for(var k = 0; k < dataArray[i].items.length; k++) {
        					computeCircleLocation(dataArray, dataArray[i].items[k].networkId, neKeyValue);
        				}
        			}
        		}
    		}
    	}
    	
    	return dataArray;
    }
    
    function computeCircleLocation(dataArray, networkId, connectedNekey) {
//    	var radius = '250'; // 꼭 스트링으로
    	var curNodeAngle = 0;
    	var eachNodeAngle = 0;
    	var groupCenterLoc = '0 0';
    	
    	// 중점 위치는 대그룹의 위치
    	for(var i = 0; i < dataArray.length; i++) {
    		if(dataArray[i].category == "OfGroups" && dataArray[i].items.length > 0) {
    			for(var j = 0; j < dataArray[i].items.length; j++) {
    				if(dataArray[i].items[j].networkId == networkId) {
    					groupCenterLoc = dataArray[i].loc;
    				}
    			}
    		}
    	}
    	
    	/////////////// 시작 앵글 ///////////////////////////
    	if(connectedNekey == "") { // 메인인 경우 connectedNekey는 ''
    		curNodeAngle = 90;
    	} else {
    		// 메인이 아닌 경우는 메인 링의 장비 아이디를 확인해서 앵글을 구한다.
    		var keyValue = connectedNekey; // 메인쪽 연결된 장비의 키 값.
    		
    		for(var i = 0; i < dataArray.length; i++) {
    			if(dataArray[i].category == "ne" && dataArray[i].key == keyValue) {
    				var tempAngle = dataArray[i].angle;
    				
    				if(tempAngle >= 180) {
    					tempAngle -= 180;
    				} else if(tempAngle >= 0 && tempAngle < 180) {
    					tempAngle += 180;
    				}
    				
    				curNodeAngle = tempAngle;
    			}
    		}
    	}
    	
    	/////////////////// 각 노드의 앵글 ///////////////////////////
    	var nodeNumber = 0;
    	for(var i = 0; i < dataArray.length; i++) {
    		if(dataArray[i].category == "ne" && dataArray[i].group == networkId) {
    			nodeNumber++;
    		}
    	}
    	eachNodeAngle = 360 / nodeNumber;
    	
    	// 해당 소그룹 위치 및 장비 위치 설정
    	var centerCoordinate = groupCenterLoc.split(' ');
    	
    	for(var i = 0; i < dataArray.length; i++) {
    		// 소그룹 중심 위치 설정
    		if(dataArray[i].category == "OfNodes" && dataArray[i].NETWORK_ID == networkId) {
    			dataArray[i].loc = groupCenterLoc;
    		}
    		
    		// 장비 위치 설정
    		if(dataArray[i].category == "ne" && dataArray[i].group == networkId) {
    			var tempX = 0;
    	    	var tempY = 0;
    	    	var tempLocStr = '';
    	    	
    	    	dataArray[i].angle = curNodeAngle; // 앵글값 먼저 추가
    	    	
    	    	tempX = Math.floor( (Number(radius) * Math.cos( (curNodeAngle/180)*Math.PI )) * 100 ) / 100 + Number(centerCoordinate[0]);
				tempY = Math.floor( (Number(radius) * Math.sin( (curNodeAngle/180)*Math.PI ) * -1) * 100 ) / 100 + Number(centerCoordinate[1]);
    			
    			tempLocStr = String(tempX) + ' ' + String(tempY);
    			dataArray[i].loc = tempLocStr;
    			
    			curNodeAngle -= eachNodeAngle;
    			
    			if(curNodeAngle < 0) {
    	    		curNodeAngle += 360;
    	    	}
    		}
    	}
    }
    
    function computePTPLocation(dataArray, networkId, connectedNeKey, isMain) {
    	// 메인 PTP링인 경우 connectedNeKey 값은 ''
    	// 메인 그룹의 패널(링명) 표시는 정 가운데에서 시작.
    	// 메인 링의 개수에 따라 위치가 결정됨.
    	if(isMain) {	
    		// 메인은 각 장비가 가로로 그려짐.
    		var y = '100'; // 메인 대그룹의 위치에서 해당 변수값 만큼 아래로 내림.
        	var groupCenterLoc = '0 ' + y;
        	var mainNeNumber = 0;
        	
        	for(var i = 0; i < dataArray.length; i++) {
        		if(dataArray[i].category == "ne" && dataArray[i].group == mainNtwkLineNo) {
        			mainNeNumber++;
        		}
        	}
        	// 메인 링의 전체길이. 각 장비의 간격은 radius로 함.
        	var mainWidth = Number(radius) * mainNeNumber;
        	var curX = -1 * mainWidth / 2;
        	for(var i = 0; i < dataArray.length; i++) {
        		//소그룹 위치
        		if(dataArray[i].category == "OfNodes" && dataArray[i].key == mainNtwkLineNo) {
        			dataArray[i].loc = groupCenterLoc;
        		}
        		//장비 위치
        		if(dataArray[i].category == "ne" && dataArray[i].group == mainNtwkLineNo) {
        			 // 왼쪽부터 정렬
        			dataArray[i].loc = curX + ' ' + y;
        			curX += Number(radius);
        		}
        	}
    		
    	} else {
    		// 서브는 ptp인 경우 세로. 간격은 radius - 100으로.. 가로 간격을 좀 작게
    		var gap = Number(radius) - 100;
    		// 메인 장비의 위치로부터 시작.
    		var startLoc = '';
    		for(var i = 0; i < dataArray.length; i++) {
    			if(dataArray[i].category == "ne" && dataArray[i].key == connectedNeKey) {
    				startLoc = dataArray[i].loc;
    				break;
    			}
    		}
    		
    		// 소그룹 위치 지정
    		for(var i = 0; i < dataArray.length; i++) {
    			if(dataArray[i].category == "OfNodes" && dataArray[i].key == networkId) {
    				dataArray[i].loc = startLoc;
    			}
    		}
    		
    		// 해당 네트워크 총 장비 개수 및 장비 seq가 0인 것 찾기
    		var neNumber = 0;
    		var zeroOrderIndex = 0;
    		for(var i = 0; i < dataArray.length; i++) {
    			if(dataArray[i].category == "ne" && dataArray[i].group == networkId) {
    				if(dataArray[i].key.substring(dataArray[i].key.length - 1) == '0') {
    					zeroOrderIndex = neNumber;
        			}
    				
    				neNumber++;
    			}
    		}
    		
    		var orderNum = 0;
    		var startLocArr = startLoc.split(' ');
    		// 위치 지정
    		for(var i = 0; i < dataArray.length; i++) {
    			if(dataArray[i].category == "ne" && dataArray[i].group == networkId) {
    				var x, y;
    				
    				if(zeroOrderIndex > 0) {
    					if(orderNum < zeroOrderIndex) {
        					x = startLocArr[0];
        					y = String(Number(startLocArr[1]) + (orderNum * gap));
        					dataArray[i].loc = x + ' ' + y;
        				} else {
        					x = startLocArr[0];
        					y = String(Number(startLocArr[1]) + ((neNumber - orderNum) * gap) * -1 );
        					dataArray[i].loc = x + ' ' + y;
        				}
    				} else {
    					x = startLocArr[0];
    					y = String(Number(startLocArr[1]) + (orderNum * gap));
    					dataArray[i].loc = x + ' ' + y;
    				}
    				
    				orderNum++;
    			}
    		}
    	}
    }
    
    
    /**
     * responseObject의 구조
     * LINKS : Array
     * NETWORK_ID, NETWORK_NM 등등
     * USE_NETWORK_PATHS : Array, responseObject 구조와 동일.
     */
    function makeNodeData(dataObject, isMain, connectedNeKey) {
    	if(dataObject == null) {
    		return null;
    	} else if(!dataObject.hasOwnProperty('LINKS') || dataObject.LINKS.length == 0) {
    		return null;
    	}
    	
    	
    	var rtnDataList = [];
    	var curSeq = 0;
    	
    	/*************************************************************************
    	 * 1. 쿼리해온 데이터에서 이미 WDM, FDF 장비는 제외.
    	 * 2. LEFT는 장비의 왼쪽을 의미하는 것이 아니라 출력쪽(정방향)을 의미.
    	 * 	  RIGHT은 입력쪽(정방향)을 의미.
    	 * 3. leftLinkId, rightLinkId도 위 2번과 같이 left는 출력측(정방향), right는 입력측(정방향)을 의미.
    	 * 
    	 **************************************************************************/
    	var data = {};
    	data.NETWORK_ID = dataObject.NETWORK_ID;
    	data.NETWORK_NM = dataObject.NETWORK_NM;
    	data.TOPOLOGY_LARGE_CD = dataObject.TOPOLOGY_LARGE_CD;
    	data.TOPOLOGY_LARGE_NM = dataObject.TOPOLOGY_LARGE_NM;
    	data.TOPOLOGY_SMALL_CD = dataObject.TOPOLOGY_SMALL_CD;
    	data.TOPOLOGY_SMALL_NM = dataObject.TOPOLOGY_SMALL_NM;
    	data.TOPOLOGY_CFG_MEANS_CD = dataObject.TOPOLOGY_CFG_MEANS_CD;
    	data.TOPOLOGY_CFG_MEANS_NM = dataObject.TOPOLOGY_CFG_MEANS_NM;
    	data.ADJACENT_RING_PATHS = [];
//    	data.JRDT_TEAM_ORG_ID = '';
//    	data.JRDT_TEAM_ORG_NM = '';
//    	data.MODEL_ID = '';
//    	data.NE_ID = '';
//    	data.NE_NM = '';
//    	data.NE_ROLE_CD = '';
//    	data.NE_ROLE_NM = '';
//    	data.NE_STATUS_CD = '';
//    	data.NE_STATUS_NM = '';
//    	data.NODE_ROLE_CD = '';
//    	data.NODE_ROLE_NM = '';
//    	data.OP_TEAM_ORG_ID = '';
//    	data.OP_TEAM_ORG_NM = '';
//    	data.ORG_ID = '';
//    	data.ORG_ID_L3 = '';
//    	data.ORG_NM = '';
//    	data.ORG_NM_L3 = '';
//    	data.PORT_DESCR = '';
//    	data.PORT_ID = '';
//    	data.PORT_NM = '';
//    	data.PORT_STATUS_CD = '';
//    	data.PORT_STATUS_NM = '';
    	data.category = 'OfNodes';
    	data.items = []; // 해당 장비에 걸린 네트워크 명들
    	data.key = dataObject.NETWORK_ID;
    	data.text = dataObject.NETWORK_NM;
//    	data.group = dataObject.NETWORK_ID;
    	data.group = connectedNeKey + 'BGroup';
    	data.isGroup = true; // 센터...
    	
    	rtnDataList.push(data);
    	
    	// base의 장비 데이터
    	for(var i=0; i<dataObject.LINKS.length; i++) {
    		var data ={}; // WEST 장비
    		var data1 = {}; // EAST 장비
    		var isExcept = false;
    		
			data.NETWORK_ID = dataObject.NETWORK_ID;
    		data.NETWORK_NM = dataObject.NETWORK_NM;
        	data.TOPOLOGY_LARGE_CD = dataObject.TOPOLOGY_LARGE_CD;
        	data.TOPOLOGY_LARGE_NM = dataObject.TOPOLOGY_LARGE_NM;
        	data.TOPOLOGY_SMALL_CD = dataObject.TOPOLOGY_SMALL_CD;
        	data.TOPOLOGY_SMALL_NM = dataObject.TOPOLOGY_SMALL_NM;
        	data.TOPOLOGY_CFG_MEANS_CD = dataObject.TOPOLOGY_CFG_MEANS_CD;
        	data.TOPOLOGY_CFG_MEANS_NM = dataObject.TOPOLOGY_CFG_MEANS_NM;
    		data.ADJACENT_RING_PATHS = dataObject.LINKS[i].LEFT_ADJACENT_RING_PATHS; // array임.
    		data.JRDT_TEAM_ORG_ID = dataObject.LINKS[i].LEFT_JRDT_TEAM_ORG_ID;
    		data.JRDT_TEAM_ORG_NM = dataObject.LINKS[i].LEFT_JRDT_TEAM_ORG_NM;
    		data.MODEL_ID = dataObject.LINKS[i].LEFT_MODEL_ID;
    		data.MODEL_NM = dataObject.LINKS[i].LEFT_MODEL_NM;
    		data.NE_ID = dataObject.LINKS[i].LEFT_NE_ID;
    		data.NE_NM = dataObject.LINKS[i].LEFT_NE_NM;
    		data.NE_ROLE_CD = dataObject.LINKS[i].LEFT_NE_ROLE_CD;
    		data.NE_ROLE_NM = dataObject.LINKS[i].LEFT_NE_ROLE_NM;
    		data.NE_STATUS_CD = dataObject.LINKS[i].LEFT_NE_STATUS_CD;
    		data.NE_STATUS_NM = dataObject.LINKS[i].LEFT_NE_STATUS_NM;
    		data.NODE_ROLE_CD = dataObject.LINKS[i].LEFT_NODE_ROLE_CD;
    		data.NODE_ROLE_NM = dataObject.LINKS[i].LEFT_NODE_ROLE_NM;
    		data.OP_TEAM_ORG_ID = dataObject.LINKS[i].LEFT_OP_TEAM_ORG_ID;
    		data.OP_TEAM_ORG_NM = dataObject.LINKS[i].LEFT_OP_TEAM_ORG_NM;
    		data.ORG_ID = dataObject.LINKS[i].LEFT_ORG_ID;
    		data.ORG_ID_L3 = dataObject.LINKS[i].LEFT_ORG_ID_L3;
    		data.ORG_NM = dataObject.LINKS[i].LEFT_ORG_NM;
    		data.ORG_NM_L3 = dataObject.LINKS[i].LEFT_ORG_NM_L3;
    		data.LEFT_PORT_DESCR = dataObject.LINKS[i].LEFT_PORT_DESCR;
    		data.LEFT_PORT_ID = dataObject.LINKS[i].LEFT_PORT_ID;
    		data.LEFT_PORT_NM = dataObject.LINKS[i].LEFT_PORT_NM;
    		data.LEFT_PORT_STATUS_CD = dataObject.LINKS[i].LEFT_PORT_STATUS_CD;
    		data.LEFT_PORT_STATUS_NM = dataObject.LINKS[i].LEFT_PORT_STATUS_NM;
    		data.RIGHT_PORT_DESCR = '';
    		data.RIGHT_PORT_ID = '';
    		data.RIGHT_PORT_NM = '';
    		data.RIGHT_PORT_STATUS_CD = '';
    		data.RIGHT_PORT_STATUS_NM = '';
    		
    		data.leftLinkId = dataObject.LINKS[i].LINK_ID;
    		data.rightLinkId = '';
    		data.category = 'ne';
    		data.items = [];
    		data.key = dataObject.LINKS[i].LEFT_NE_ID + '_' + dataObject.NETWORK_ID + '_' + curSeq;
//    		data.text = omitLongText(dataObject.LINKS[i].LEFT_NE_NM);
    		data.NODE_DESCR = makeNodeTitle(dataObject.LINKS[i].LEFT_NE_NM, dataObject.LINKS[i].LEFT_ORG_NM, dataObject.LINKS[i].LEFT_NE_DUMMY);
    		data.group = dataObject.NETWORK_ID;
    		
    		data.role = nodeTypeImage({neRoleCd: data.NE_ROLE_CD, nodeRoleCd: data.NODE_ROLE_CD});
    		data.nodeTooltipText = makeNodeTooltipTxt(data.NE_ID, data.NE_NM, data.NE_ROLE_NM, data.MODEL_NM, data.ORG_NM_L3, data.ORG_NM);
    		
    		isExcept = checkExceptNe(data.NE_ROLE_CD, data.TOPOLOGY_SMALL_CD);

    		if ( data.NE_ID === 'DV00000000000' ) {
    			isExcept = true;
    		}
    		
    		if(isExcept){
    			// 해당 변수 초기화만 하고 아래로..
//    			isExcept = false;
    		} else if(i == 0 || (i > 0 && rtnDataList[rtnDataList.length-1].NE_ID !== data.NE_ID)) {
    			rtnDataList.push(data);
    			curSeq++;
    		} else if(rtnDataList[rtnDataList.length-1].NE_ID === data.NE_ID) {
    			// 이전 장비데이터의 EAST쪽 설정.
    			rtnDataList[rtnDataList.length -1].LEFT_PORT_DESCR = dataObject.LINKS[i].LEFT_PORT_DESCR;
    			rtnDataList[rtnDataList.length -1].LEFT_PORT_ID = dataObject.LINKS[i].LEFT_PORT_ID;
    			rtnDataList[rtnDataList.length -1].LEFT_PORT_NM = dataObject.LINKS[i].LEFT_PORT_NM;
    			rtnDataList[rtnDataList.length -1].LEFT_PORT_STATUS_CD = dataObject.LINKS[i].LEFT_PORT_STATUS_CD;
    			rtnDataList[rtnDataList.length -1].LEFT_PORT_STATUS_NM = dataObject.LINKS[i].LEFT_PORT_STATUS_NM;
    			
    			rtnDataList[rtnDataList.length -1].leftLinkId = dataObject.LINKS[i].LINK_ID;
    		}
    		
    		if( i < dataObject.LINKS.length - 1 
    		|| ( (i == dataObject.LINKS.length - 1) && rtnDataList.length > 1 
    			&& dataObject.LINKS[i].RIGHT_NE_ID != rtnDataList[1].NE_ID) ) {
        		data1.NETWORK_ID = dataObject.NETWORK_ID;
        		data1.NETWORK_NM = dataObject.NETWORK_NM;
        		data1.ADJACENT_RING_PATHS = dataObject.LINKS[i].RIGHT_ADJACENT_RING_PATHS;
        		data1.JRDT_TEAM_ORG_ID = dataObject.LINKS[i].RIGHT_JRDT_TEAM_ORG_ID;
        		data1.JRDT_TEAM_ORG_NM = dataObject.LINKS[i].RIGHT_JRDT_TEAM_ORG_NM;
        		data1.MODEL_ID = dataObject.LINKS[i].RIGHT_MODEL_ID;
        		data1.MODEL_NM = dataObject.LINKS[i].RIGHT_MODEL_NM;
        		data1.NE_ID = dataObject.LINKS[i].RIGHT_NE_ID;
        		data1.NE_NM = dataObject.LINKS[i].RIGHT_NE_NM;
        		data1.NE_ROLE_CD = dataObject.LINKS[i].RIGHT_NE_ROLE_CD;
        		data1.NE_ROLE_NM = dataObject.LINKS[i].RIGHT_NE_ROLE_NM;
        		data1.NE_STATUS_CD = dataObject.LINKS[i].RIGHT_NE_STATUS_CD;
        		data1.NE_STATUS_NM = dataObject.LINKS[i].RIGHT_NE_STATUS_NM;
        		data1.NODE_ROLE_CD = dataObject.LINKS[i].RIGHT_NODE_ROLE_CD;
        		data1.NODE_ROLE_NM = dataObject.LINKS[i].RIGHT_NODE_ROLE_NM;
        		data1.OP_TEAM_ORG_ID = dataObject.LINKS[i].RIGHT_OP_TEAM_ORG_ID;
        		data1.OP_TEAM_ORG_NM = dataObject.LINKS[i].RIGHT_OP_TEAM_ORG_NM;
        		data1.ORG_ID = dataObject.LINKS[i].RIGHT_ORG_ID;
        		data1.ORG_ID_L3 = dataObject.LINKS[i].RIGHT_ORG_ID_L3;
        		data1.ORG_NM = dataObject.LINKS[i].RIGHT_ORG_NM;
        		data1.ORG_NM_L3 = dataObject.LINKS[i].RIGHT_ORG_NM_L3;
        		data1.LEFT_PORT_DESCR = '';
        		data1.LEFT_PORT_ID = '';
        		data1.LEFT_PORT_NM = '';
        		data1.LEFT_PORT_STATUS_CD = '';
        		data1.LEFT_PORT_STATUS_NM = '';
        		data1.RIGHT_PORT_DESCR = dataObject.LINKS[i].RIGHT_PORT_DESCR;
        		data1.RIGHT_PORT_ID = dataObject.LINKS[i].RIGHT_PORT_ID;
        		data1.RIGHT_PORT_NM = dataObject.LINKS[i].RIGHT_PORT_NM;
        		data1.RIGHT_PORT_STATUS_CD = dataObject.LINKS[i].RIGHT_PORT_STATUS_CD;
        		data1.RIGHT_PORT_STATUS_NM = dataObject.LINKS[i].RIGHT_PORT_STATUS_NM;
        		
        		data1.leftLinkId = '';
        		data1.rightLinkId = dataObject.LINKS[i].LINK_ID;
        		data1.category = 'ne';
        		data1.items = [];
        		data1.key = dataObject.LINKS[i].RIGHT_NE_ID + '_' + dataObject.NETWORK_ID+ '_' + curSeq;
//        		data1.text = omitLongText(dataObject.LINKS[i].RIGHT_NE_NM);
        		data1.NODE_DESCR = makeNodeTitle(dataObject.LINKS[i].RIGHT_NE_NM, dataObject.LINKS[i].RIGHT_ORG_NM, dataObject.LINKS[i].RIGHT_NE_DUMMY);
        		
        		data1.group = dataObject.NETWORK_ID;
        		
        		data1.role = nodeTypeImage({neRoleCd: data1.NE_ROLE_CD, nodeRoleCd: data1.NODE_ROLE_CD});
        		data1.nodeTooltipText = makeNodeTooltipTxt(data1.NE_ID, data1.NE_NM, data1.NE_ROLE_NM, data1.MODEL_NM, data1.ORG_NM_L3, data.ORG_NM);
        		
        		isExcept = checkExceptNe(data1.NE_ROLE_CD, data1.TOPOLOGY_SMALL_CD);

        		if ( data1.NE_ID === 'DV00000000000' ) {
        			isExcept = true;
        		}
        		
        		if(isExcept){
        			// 해당 변수 초기화만 하고 아래로..
//        			isExcept = false;
        		} else {
        			rtnDataList.push(data1);
        			curSeq++;
        		}
    		} else { // 마지막이면서 처음 장비와 마지막 장비가 같은 경우
    			// rtnDataList[0]은 센터 데이터임. 그러므로 rtnDataList[1]이 처음 그려지는 장비 데이터
    			if(rtnDataList.length > 1) {
    				rtnDataList[1].RIGHT_PORT_DESCR = dataObject.LINKS[i].RIGHT_PORT_DESCR;
        			rtnDataList[1].RIGHT_PORT_ID = dataObject.LINKS[i].RIGHT_PORT_ID;
        			rtnDataList[1].RIGHT_PORT_NM = dataObject.LINKS[i].RIGHT_PORT_NM;
        			rtnDataList[1].RIGHT_PORT_STATUS_CD = dataObject.LINKS[i].RIGHT_PORT_STATUS_CD;
        			rtnDataList[1].RIGHT_PORT_STATUS_NM = dataObject.LINKS[i].RIGHT_PORT_STATUS_NM;
        			
        			rtnDataList[1].rightLinkId = dataObject.LINKS[i].LINK_ID;
    			} else {
    				// 보여줄 장비 데이터가 전혀 없는 경우
    				rtnDataList = [];
    			}
    			
    		}
    	}
    	
    	// 연결된 장비의 순서를 맞춤.
    	if(!isMain) {
    		var startIdx = 0;
    		
    		for(var i = 0; i < rtnDataList.length; i++) {
//    			if(i > 0 && rtnDataList[i].NE_ID == connectedNeId) { // index i가 0은 소그룹 데이터
    			if(i > 0 && rtnDataList[i].NE_ID == connectedNeKey.substring(0, connectedNeKey.indexOf('_'))) { // index i가 0은 소그룹 데이터
    				startIdx = i;
					break;
    			}
    		}
    		
    		var tempRtnDataList = [];
    		
    		if(startIdx > 1) {
    			tempRtnDataList.push(rtnDataList[0]);
    			for(var i = startIdx; i < rtnDataList.length; i++) {
    				tempRtnDataList.push(rtnDataList[i]);
    			}
    			for(var i = 1; i < startIdx; i++) {
    				tempRtnDataList.push(rtnDataList[i]);
    			}
    			
    			rtnDataList = tempRtnDataList;
    		}
    	}
    	
    	return rtnDataList;
    }
    
    function makeLinkData(){
    	var tempLinkDataList = [];
    	
    	if(isMainPTP) {
    		// 링은 ptp와 다른 링으로 또 구별해야 한다.
    		for(var i = 0; i < nodeDataArray.length; i++) {
        		if(nodeDataArray[i].category == 'OfNodes') {
        			var networkId = nodeDataArray[i].NETWORK_ID;
        			var topologySmallCd = nodeDataArray[i].TOPOLOGY_SMALL_CD;
        			
        			if(topologySmallCd == '002') {
        				for(var j = 0 ; j < nodeDataArray.length; j++) {
            				if(nodeDataArray[j].category == 'ne' && nodeDataArray[j].group == networkId 
            				&& nodeDataArray[j+1].category == 'ne') {
    							tempLinkDataList.push( {category : 'ptpLine', from : nodeDataArray[j].key, to : nodeDataArray[j+1].key} );
            				}
            			}
        			} else {
        				var isSamePath = true;
            			var firstIdxValue = 0;
            			
        				for(var j = 0 ; j < nodeDataArray.length; j++) {
            				if(nodeDataArray[j].category == 'ne' && nodeDataArray[j].group == networkId) {
            					if(isSamePath) firstIdxValue = j;
            					if(j < nodeDataArray.length -1) {
            						if(nodeDataArray[j+1].category != 'ne') { // 해당 조건이 참이면 다음 소그룹이 됨
            							tempLinkDataList.push( {category : 'line', from : nodeDataArray[j].key, to : nodeDataArray[firstIdxValue].key} );
            						} else {
            							tempLinkDataList.push( {category : 'line', from : nodeDataArray[j].key, to : nodeDataArray[j+1].key} );
            						}
            					}
            					
            					isSamePath = false;
            				}
            			}
        			}
        		}
        	}
    	} else {
    		for(var i = 0; i < nodeDataArray.length; i++) {
        		if(nodeDataArray[i].category == 'OfNodes') {
        			var networkId = nodeDataArray[i].NETWORK_ID;
        			var isSamePath = true;
        			var firstIdxValue = 0;
        			
        			for(var j = 0 ; j < nodeDataArray.length; j++) {
        				if(nodeDataArray[j].category == 'ne' && nodeDataArray[j].group == networkId) {
        					if(isSamePath) firstIdxValue = j;
        					if(j < nodeDataArray.length -1) {
        						if(nodeDataArray[j+1].category != 'ne') {
        							var tmpLinkDataObj = {};
        							tmpLinkDataObj.category = 'line';
        							tmpLinkDataObj.from = nodeDataArray[j].key;
        							tmpLinkDataObj.to = nodeDataArray[firstIdxValue].key;
        							tmpLinkDataObj.linelinkTooltip = makeLineLinkTooltip(nodeDataArray[j], nodeDataArray[firstIdxValue]);
        							tempLinkDataList.push(tmpLinkDataObj);
        						} else {
        							var tmpLinkDataObj = {};
        							tmpLinkDataObj.category = 'line';
        							tmpLinkDataObj.from = nodeDataArray[j].key;
        							tmpLinkDataObj.to = nodeDataArray[j+1].key;
        							tmpLinkDataObj.linelinkTooltip = makeLineLinkTooltip(nodeDataArray[j], nodeDataArray[j+1]);
        							tempLinkDataList.push(tmpLinkDataObj);
        						}
        						
        					}
        					
        					isSamePath = false;
        				}
        			}
        		}
        	}
        	
        	///////////// 	점선	////////////////////////////
        	// 시작은 메인, 끝은 다른 네트워크
        	var mainNekeyList = [];
        	for(var i = 0; i < nodeDataArray.length; i++) {
        		if(nodeDataArray[i].category == 'ne' && nodeDataArray[i].NETWORK_ID == mainNtwkLineNo) {
        			mainNekeyList.push(nodeDataArray[i].key);
        		}
        	}
        	
        	if(mainNekeyList.length > 0) {
        		for(var i = 0; i < mainNekeyList.length; i++) {
        			for(var j = 0; j < nodeDataArray.length; j++) {
        				// 다른 네트워크 경로인 경우 중첩되는 장비도 제외되어야 함.
        				// category가 ne로 시작되는 경우의 index가 무조건 1이상임.
        				if(nodeDataArray[j].category == 'ne' && nodeDataArray[j].NETWORK_ID != mainNtwkLineNo
        				&& nodeDataArray[j].NE_ID ==  mainNekeyList[i].substring(0, mainNekeyList[i].indexOf('_'))
        				&& nodeDataArray[j-1].category != 'OfNodes') {
        					tempLinkDataList.push( {category : 'dottedLine', from : mainNekeyList[i], to : nodeDataArray[j].key} );
        				}
        			}
        		}
        	}
    	}
    	
    	return tempLinkDataList;
    }
    
    /**
     * 함수명		: showAndHideNodes
     * parameter	: Object{connectedNeId  , networkId	, networkNm}, boolean
     * return		: 없음
     */
    function showAndHideNodes(isAll, networkId, isVisible) {
    	// 임시
    	var model = ringDiagram.model;
    	
    	model.startTransaction("show and hide nodes");
    	showAndHideNodes2(isAll, networkId, isVisible);
    	showAndHideDottedLine();
    	model.commitTransaction("show and hide nodes");
    }
    
    // showAndHideNodes2는 재귀 호출이 있는데 showAndHideNodes 함수에서 트랜잭션 처리가 있어서 따로 뺌.
    function showAndHideNodes2(isAll, networkId, isVisible) {
    	var model = ringDiagram.model;
    	var data = model.nodeDataArray;
    	var linkData = model.linkDataArray;
    	
    	if(isAll) {
    		// 처음 로드시 메인과 각 장비에 인접된 링의 첫번째 네트워크만 보이게 함.
    		// 메인은 visible 속성 설정 안 함.
    		for(var i = 0; i < data.length; i ++) {
    			if(data[i].category == "OfGroups" && data[i].key != "mainBGroup") {
    				for(var j = 0; j < data[i].items.length; j++) {
    					if(j == 0) { // 첫번째 것.
    						showAndHideNodes2(false, data[i].items[j].networkId, true);
    						// 해당 네트워크 선택된 것 표시
    						var list = ringDiagram.findNodeForData(data[i]).findObject("TABLE");
							
    						if(list) {
    							var itr = list.elements;
    							while(itr.next()) {
    								var itrItem = itr.value;
    								
    								if(itrItem.data.networkId == data[i].items[j].networkId) {
    									itrItem.background = "dodgerblue";
    								}
    							}
    						}
    						
    						for(var k = 0; k < data.length; k++) {
    							// 소그룹 데이터 바로 다음 번째의 데이터는 인접한 장비.
    							if(data[k].category == "OfNodes" && data[k].key == data[i].items[j].networkId) {
    								showAndHideAdjacentNe(data[k+1].key, true); 
    								break;
    							}
    						}
    						
    					} else {
    						showAndHideNodes2(false, data[i].items[j].networkId, false);
    					}
    				}
    			}
    		}
    	} else {
    		// visible로 처리해야 link도 같이 안보이게 됨.
    		// mainNtwkLineNo는 전역변수 파라미터로 받은 것.
    		// 메인은 영향을 받으면 안됨.
        	for(var i = 0; i < data.length; i ++) {
        		if(data[i].category == 'ne' && data[i].group == networkId) {
        			model.setDataProperty(data[i], "visible", isVisible);
        			
        			var tmp = 0;
        			if(isVisible) {
        				tmp = 1;
        			}
        			ringDiagram.findNodeForData(data[i]).setProperties({opacity: tmp})
        		}
        	}
    	}
    }
    
    
    function showAndHideDottedLine() {
    	// dottedLine은 목적지 장비(to)가 visible = false가 되면 대그룹의 중점으로 연결이 되어버림...
    	var model = ringDiagram.model;
    	var data = model.nodeDataArray;
    	var linkData = model.linkDataArray;
    	
    	for(var i = 0; i < linkData.length; i++) {
    		if(linkData[i].category == 'dottedLine') {
    			var nodeGraphObj = ringDiagram.findNodeForKey(linkData[i].to);
    			if(nodeGraphObj.data.visible) {
    				model.setDataProperty(linkData[i], "opacity", 1);
    			} else {
    				model.setDataProperty(linkData[i], "opacity", 0);
    			}
    		}
    	}
    }
    
    function showAndHideAdjacentNe(neKey, isHide) {
    	ringDiagram.startTransaction('show and hide main Adjacent Ne');
    	if(isHide) {
    		ringDiagram.findNodeForKey(neKey).setProperties({opacity : 0});
    	} else {
    		ringDiagram.findNodeForKey(neKey).setProperties({opacity : 1});
    	}
    	ringDiagram.commitTransaction('show and hide main Adjacent Ne');
    }
    
    
    function checkExceptNe(roleCd, topologySmallCd) {
//    	11		FDF
//		162	QDF 
//		177	OFD
//		178	IJP
//	    	
//    	124	M-WDM(기간망)
//    	125	WDM(기간망)
//    	145	WDM 시외망(단국용)
//    	15		DWDM
//    	150	CWDM(기간망)
//    	16		CWDM
//    	169	WDM 시내망(단국용)
    	
//		181   COUPLER    
//		182   PBOX     추가  2019-12-24
    	
    	
//    	debugger;
    	var exceptEqpRoleDivCdArr = ['11', '162', '177', '178', '15', '16', '124', '125', '145', '150', '169', '181', '182'];  // PBOX 추가  2019-12-24
    	if(topologySmallCd == '013') {
    		 // WDM_Ring의 경우 FDF, 커플러 만 제외
    		exceptEqpRoleDivCdArr = ['11', '162', '177', '178', '181', '182'];  // PBOX 추가  2019-12-24
    	}
    	
    	var rtnVal = false;
    	for(var i=0; i<exceptEqpRoleDivCdArr.length; i++) {
    		if(exceptEqpRoleDivCdArr[i] == roleCd) {
    			rtnVal = true;
    			break;
    		}
    	}
    	
    	return rtnVal;
    }
    
    
    function nodeTypeImage(roleObj) {
    	
//    	eqpRoleDivCd = neRoleCd, nodeRoleCd
    	var imagePath = getContextPath() + "/resources/images/topology/";
    	if(roleObj.neRoleCd == '01' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "L2-SW_01_ON.png";
    	} else if(roleObj.neRoleCd == '01' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "L2-SW_01.png";
    	} 
    	else if(roleObj.neRoleCd == '02' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "L2-SW_01_ON.png";
    	} else if(roleObj.neRoleCd == '02' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "L2-SW_01.png";
    	} 
    	else if(roleObj.neRoleCd == '03' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "L3-SW_01_ON.png";
    	} else if(roleObj.neRoleCd == '03' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "L3-SW_01.png";
    	}
    	else if(roleObj.neRoleCd == '04' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "IBC_01_ON.png";
    	} else if(roleObj.neRoleCd == '04' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "IBC_01.png";
    	}
    	else if(roleObj.neRoleCd == '05' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "IBR_01_ON.png";
    	} else if(roleObj.neRoleCd == '05' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "IBR_01.png";
    	}
    	else if(roleObj.neRoleCd == '06' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "IBRR_01_ON.png";
    	} else if(roleObj.neRoleCd == '06' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "IBRR_01.png";
    	}
    	else if(roleObj.neRoleCd == '07' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "PTS_01_ON.png";
    	} else if(roleObj.neRoleCd == '07' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "PTS_01.png";
    	}
    	else if(roleObj.neRoleCd == '15' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "DWDM_01_ON.png";
    	} else if(roleObj.neRoleCd == '15' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "DWDM_01.png";
    	}
    	else if(roleObj.neRoleCd == '18' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "SCAN_WM_01_ON.png";
    	} else if(roleObj.neRoleCd == '18' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "SCAN_WM_01.png";
    	}
    	else if(roleObj.neRoleCd == '21' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "OTN_01_ON.png";
    	} else if(roleObj.neRoleCd == '21' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "OTN_01.png";
    	}
//    	else if(roleObj.neRoleCd == '23' && roleObj.nodeRoleCd == 'C') {
//    		return imagePath + "DU_01_ON.png";
//    	} else if(roleObj.neRoleCd == '23' && roleObj.nodeRoleCd != 'C') {
//    		return imagePath + "DU_01.png";
//    	}
    	else if(roleObj.neRoleCd == '25' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "RU_01_ON.png";
    	} else if(roleObj.neRoleCd == '25' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "RU_01.png";
    	}
    	else if(roleObj.neRoleCd == '101' && roleObj.nodeRoleCd == 'C') {
    		return imagePath + "RT_01_ON.png";
    	} else if(roleObj.neRoleCd == '101' && roleObj.nodeRoleCd != 'C') {
    		return imagePath + "RT_01.png";
    	}
    	else if(roleObj.nodeRoleCd == 'C') {
    		return imagePath + "PG_01_ON.png";
    	} else {
    		return imagePath + "PG_01.png";
    	}
    }
    
    function omitLongText(str, lenWanted) {
    	var text = '';
    	var length = 0;
    	
    	if(lenWanted == null || isNaN(lenWanted)) {
    		length = 28;
    	} else {
    		length = lenWanted;
    	}
    	
    	if(nullToEmpty(str) == '') {
    		text = '';
    	} else if(str.length <= length) {
    		text = str;
    	} else {
    		text = str.substring(0, length) + '...';
    	}
    	
    	return text;
    }
    
    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str == "undefined") {
        	str = "";
        }	
    	return str;
    }
    
    
    function makeNodeTooltipTxt(neId, neNm, neRoleNm, modelNm, orgNmL3, orgNm){
    	return '장비ID : ' + neId + '\n장비명 : '+ neNm +'\n장비타입 : ' + neRoleNm + '\n모델명 : ' + modelNm + '\n전송실 : ' + orgNmL3 + '\n국사 : ' + orgNm;
    }
    
    function makeLineLinkTooltip(fromObj, toObj) {
    	var returnStr = '';
    	if(fromObj.leftLinkId == toObj.rightLinkId) {
    		returnStr = '장비명 : '+ fromObj.NE_NM + '\nWEST Port : ' + fromObj.LEFT_PORT_DESCR
    			+ '\n\n장비명 : ' + toObj.NE_NM + '\nEAST Port : '+ toObj.RIGHT_PORT_DESCR;
    	}
    	
    	return returnStr;
    }
    
    function makeNodeTitle(neNm, orgNm, isNeDummy) {

    	if ( neNm == null || neNm == '' ) {
    		if ( orgNm == null || orgNm == '' ) {
    			return "미확인장비";
    		} else {
        		if ( isNeDummy ) {
            		return omitLongText(orgNm + "_미확인장비");
        		} else {
            		return omitLongText(orgNm);
        		}
    		}
    	} else {
    		return omitLongText(neNm);
    	}
    }
    
    
});
