/**
 * IntgE2ETopoLineLkup.js
 *
 * @author Administrator
 * @version 1.0
 */
var gisMapPop;
var mgMap;
var L;
var Object;
	
$a.page(function() {

	var nodeDataArray = [];
    var linkDataArray = [];
    var parent;
    var nodeTemp;
    var curDiagram;
    var tabList = new Array();
    var groupYn = false;
    var groupKey = null;
    var paramData = null;
    var dupMtsoId = [];
	var searchData = null;
	var mtsoNodeTemp = [];
	var searchNm = '';
	var fcltDataArray = [];
	var mapFlag = "";

	// ETE 지도경로
    var ETE_MAP_LAYER = 'ETE_MAP_LAYER';
    var ETE_LABEL_MAP_LAYER = 'ETE_LABEL_MAP_LAYER';
    var routePathLayer = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initDiagram();

    	//파라미터가 넘어올 경우 바로 조회
    	if (!jQuery.isEmptyObject(param) ) {
    		setEventListener(param);
    		$('body').progress();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/nodeDataLineList', param, 'GET', 'eqpData');
        }
    };

    function initDiagram() {
    	var $ = go.GraphObject.make;

     // get tooltip text from the object's data
        function nodeTooltipTextConverter(data) {
          var str = "";
          if (data.name !== undefined) str += "시설물명: " + data.name;
          if (data.fcltsSkMgmtNo !== undefined) str += "\n시설물SK관리번호: " + data.fcltsSkMgmtNo;
          if (data.fcltUnqMgmtNo !== undefined) str += "\n시설물고유관리번호: " + data.fcltUnqMgmtNo;
          if (data.coreNo !== undefined) str += "\n코어: " + data.coreNo;
          if (data.cblDivNm !== undefined) str += "\n케이블구분: " + data.cblDivNm;
          if (data.fcltDivNm !== undefined) str += "\n시설물구분: " + data.fcltDivNm;
          if (data.eteDistm !== undefined) str += "\n포설거리: " + data.eteDistm;
          if (data.cblSkMgmtNo !== undefined) str += "\n케이블SK관리번호: " + data.cblSkMgmtNo;
          if (data.cblUnqMgmtNo !== undefined) str += "\n케이블고유관리번호: " + data.cblUnqMgmtNo;
          return str;
        }

        // define tooltips for nodes
        var nodeTooltiptemplate =
          $(go.Adornment, "Auto",
            $(go.Shape, "Rectangle",
              { fill: "whitesmoke", stroke: "black" }),
            $(go.TextBlock,
              { font: "bold 10pt Helvetica, bold Arial, sans-serif",
                wrap: go.TextBlock.WrapFit,
                margin: 5 },
              new go.Binding("text", "", nodeTooltipTextConverter))
          );

        // get tooltip text from the object's data
        function linkTooltipTextConverter(data) {
          var str = "";
          if (data.lftEqpNm !== undefined) str += "Left 장비: " + data.lftEqpNm;
          if (data.text !== undefined) str += "\nLeft 포트: " + data.text;
          if (data.rghtEqpNm !== undefined) str += "\nRight 장비: " + data.rghtEqpNm;
          if (data.toText !== undefined) str += "\nRight 포트: " + data.toText;
          if (data.centerText !== undefined) str += "\n용량: " + data.centerText;
          return str;
        }

        // define tooltips for nodes
        var linkTooltiptemplate =
          $(go.Adornment, "Auto",
            $(go.Shape, "Rectangle",
              { fill: "whitesmoke", stroke: "black" }),
            $(go.TextBlock,
              { font: "bold 10pt Helvetica, bold Arial, sans-serif",
                wrap: go.TextBlock.WrapFit,
                margin: 5 },
              new go.Binding("text", "", linkTooltipTextConverter))
          );

    	myDiagram =
    		$(go.Diagram, "myDiagramLineDiv", {
    			initialContentAlignment: go.Spot.Center,
    			"toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom,
//    			layout: $(CustomLayout),
//    			layout: $(go.TreeLayout, {angle: 0, setsPortSpot: false, setsChildPortSpot: false}),
//    			draggingTool: $(CustomDraggingTool),
//    			layout:
//		            $(go.GridLayout,
//		              { wrappingColumn: 5, alignment: go.GridLayout.Position,
//		                  cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4) }),
//                layout: $(go.CircularLayout),
//                layout: $(go.GridLayout),
    			allowDelete: false,
    			"undoManager.isEnabled": true,
    			"toolManager.hoverDelay": 10
    		});


    	myDiagram.nodeTemplate =
    		$(go.Node, "Vertical",
    			{toolTip: nodeTooltiptemplate },
    			{locationSpot: go.Spot.Center},
    			{ doubleClick: facilityInfoMgmtPop }, // 추후진행 :  쿼리 작성후 진행
    			{selectionAdornmentTemplate:
    				$(go.Adornment,"Auto",
    					$(go.Shape, "RoundedRectangle",
    					{fill: null, stroke: "dodgerblue", strokeWidth: 2}),
    					$(go.Placeholder)
    				)},
				{selectionAdorned: true,
					selectionChanged: onSelectionChanged},
    			{ //toolTip: nodeToolTip,
    	          isTreeLeaf: false,
    			isTreeExpanded: true,
    			zOrder:3,
    			},
    			new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
    			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    			$(go.Panel, "Vertical",
    				$(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "fcltDiv")),
    				$(go.Picture, new go.Binding("source"),
    						{ desiredSize: new go.Size(40, 40)}),
    				$(go.TextBlock, { margin: 2, font: "Bold 11px Sans-Serif" }, new go.Binding("text", "name"))
    			)
    		);

    	function highlightLink(link, show){
    		link.isHighlighted = show;
    		link.fromNode.isHighlighted = show;
    		link.toNode.isHighlighted = show;
    	}

    	myDiagram.linkTemplate =
    		$(go.Link,
//    			{routing: go.Link.AvoidsNodes, corner: 10},
    			new go.Binding("curve"),
    			new go.Binding("curviness"),
    			new go.Binding("points").makeTwoWay(),
    			{
//    				click: linkInfSelect ,
//    				doubleClick: tnBdgmLinkInfPop,
//    				toolTip: linkTooltiptemplate,
//    				mouseEnter: function(e, link) {highlightLink(link, true)},
//    				mouseLeave: function(e, link) {highlightLink(link, false)}
    			},
    			$(go.Shape,
    					{stroke: "#FF6600", strokeWidth: 4}
//    				new go.Binding("stroke", "isHighlighted",
//    								function(h, shape){ return h ? "red" : "black";})
//    								.ofObject(),
//    				new go.Binding("strokeWidth", "isHighlighted",
//									function(h){ return h ? 2 : 1;})
//									.ofObject()
    								),
    			$(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "#1967B3",
	    				  segmentIndex: 0,
	    				  segmentOffset: new go.Point(NaN, NaN),
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "text")),
	            $(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "#1967B3",
	    				  segmentIndex: -1,
	    				  segmentOffset: new go.Point(NaN, NaN),
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "toText")),
	            $(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "blue",
//	    				  segmentIndex: 1,
	    				  segmentOffset: new go.Point(0, 10),
//	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "centerText"))
    		);


    }


    function setEventListener(data) {
    	//지도 버튼
   	 	$("#searchMap").on("click", function(e) {
   	 	 mapFlag = "GIS";
   	 	 window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2EMap.do');
 		 });

   	 	//GIS지도 버튼
    	$("#searchMapGis").on("click", function(e) {
  	 	 mapFlag = "";
  	 	 gisMapPop = window.open('/tango-transmission-gis-web/tgis/Main.do');

  	 	setTimeout(function(){
			gisM();
			}, 5000);

		 });

   	 	//캡쳐 버튼
   	 	$("#captureTopo").on("click", function(e) {
   		 if(myDiagram != null) {
    			var image = myDiagram.makeImage(
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

    			fileName = dateStr + '_' + data.lftEqpNm + '_'+ data.rghtEqpNm + '_선로정보.png';
    			downloadImage(image, fileName);
    		}
 		 });
	};

	window.paramInfo = function(){
		var ringLatLng = [];
		var coord = [];
		var eqpSctnId = [];

		for(var i=0; i<linkDataArray.length; i++){
			 if(linkDataArray[i].lftVal != undefined && linkDataArray[i].rghtVal != undefined){
    			ringLatLng[ringLatLng.length] = linkDataArray[i].lftVal+","+linkDataArray[i].rghtVal;
			 }

			 if(linkDataArray[i].coord != undefined){
				 coord[coord.length] = linkDataArray[i].coord;
				 eqpSctnId[eqpSctnId.length] = linkDataArray[i].eqpSctnId;
			 }
		 }
		 var param = {"ringLatLng": ringLatLng, "fcltData": fcltDataArray, "coord": coord, "eqpSctnId": eqpSctnId, "flag": mapFlag};

		 return param;
	};

	drawEtePath = function(cableList, nodeList) {
    	if(cableList == null || nodeList == null){
    		alert('케이블과 노드목록 정보를 찾지 못했습니다.');
    		return;
    	}

		mgMap = gisMapPop.window.mgMap;
		L = gisMapPop.window.L;
		Object = gisMapPop.window.Object;

		if ($.TcpUtils.isEmpty(mgMap)) {
			alert('지도객체 정보가 없습니다.');
			return;
		}else{
			
			setCustomStyle();
		}


		// 지도
		var nodeFeatures = createFeatures(nodeList);
		var cableFeatures = createFeatures(cableList);
		var result = {
		    features : cableFeatures.concat(nodeFeatures)
		};

		if (!result || $.TcpUtils.isEmpty(result.features)) {
			alert('지도상에 시설물 객체를 생성하지 못했습니다.');
			return;
		}

		if(routePathLayer == null){
			routePathLayer = mgMap.addCustomLayerByName(ETE_MAP_LAYER);
		}else{
			routePathLayer.clearLayers();
		}
	    //사용자레이어에 Features 추가
		routePathLayer.addData(result);

	    if(routePathLayer.getLayers().length >= 1) {
            //해당 명칭의 사용자레이어의 전체 영역 이동
            mgMap.fitBounds(routePathLayer.getBounds());
        }
	    
	    mgMap = null;
	    L = null;
	    routePathLayer = null;
    }

	function gisM(){
		gisMapPop.$('body').progress();
		var param = {"node":nodeDataArray[0].mtsoMgmtNo,"cable":nodeDataArray[0].cblMgmtNo,"core":nodeDataArray[0].coreNo,"userId":"TANGOT","isBox":false,"selectFlag":"MAP"};
	 	httpRequest('tango-transmission-gis-biz/transmission/gis/cc/endToEnd', param, 'POST', 'routeList');
	}

	function onSelectionChanged(node){
		var src = null;

		var eqpRoleDivCd = "";
		if (node.data.fcltDiv == "FDF") {
			eqpRoleDivCd = "11";
		}else{
			eqpRoleDivCd = "CBNT";
		}

		if(node.isSelected){
			src = getEqpIcon(eqpRoleDivCd, "S");
			myDiagram.model.setDataProperty(node.data, "source", src);
		}else{
			src = getEqpIcon(eqpRoleDivCd, "");
			myDiagram.model.setDataProperty(node.data, "source", src);
		}
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

    		var myDiagramDiv = document.getElementById('myDiagramLineDiv');
    		myDiagramDiv.appendChild(a);
    		a.click();
    		setTimeout(function(){
    			myDiagramDiv.removeChild(a);
    		}, 100);
    	}

    }

	function successCallback(response, status, jqxhr, flag){

    	//장비조회
    	if(flag == "eqpData"){

    		if(response.nodeLineData.length == 0){
    			$('body').progress().remove();
    			callMsgBox('','I', "검색 결과가 없습니다.", function(msgId, msgRst){
    				$a.close();
    			});
    		}

    		nodeDataArray = [];
    		linkDataArray = [];

    		var groupNodeCnt = 0;
    		var ringNodeCnt = 0;
    		var groupLinkCnt = 0;
    		var ringLinkCnt = 0;
    		var nodeData = null;
    		var linkData = null;
    		var locXS = 0;
    		var locYS = 0;
    		var locXY = "";
    		var cnt = 1;

			nodeData = response.nodeLineData;

    		for(var i=0; i<nodeData.length; i++){
    			var resObj = nodeData[i];
    			var everexpand = false;
    			var src = null;

    			if(i > 0){
    				if(i%4 == 0){
    					locYS = locYS + 120;
    					cnt++;
    				}else{
    					if(cnt%2 == 0){
    						locXS = locXS - 200;
    					}else{
    						locXS = locXS + 200;
    					}
    				}
    			}
    			locXY = locXS + " " + locYS;

    			var fcltDiv = "";
    			var eqpRoleDivCd = "";
    			if (resObj.fcltsSkMgmtNo.lastIndexOf('TP') > 0) {
    				fcltDiv = "FDF";
    				eqpRoleDivCd = "11";
    			} else if (resObj.fcltsSkMgmtNo.lastIndexOf('RT') > 0) {
    				fcltDiv = "FDF";
    				eqpRoleDivCd = "11";
 				} else if (resObj.fcltsSkMgmtNo.lastIndexOf('JP') > 0) {
 					fcltDiv = "함체";
 					eqpRoleDivCd = "CBNT";
 				}

    			//장비 타입 별 장비 아이콘
				src = getEqpIcon(eqpRoleDivCd, "");

    			//지도에 넘길 시설물 정보
    			fcltDataArray.push(nodeData[i]);

    			nodeDataArray.push({ key: resObj.fcltUnqMgmtNo + resObj.lineSctnLnoSrno, name: resObj.fcltNm, fcltDiv: fcltDiv, loc: locXY, fcltsSkMgmtNo: resObj.fcltsSkMgmtNo, lineSctnLnoSrno: resObj.lineSctnLnoSrno, fcltUnqMgmtNo: resObj.fcltUnqMgmtNo, coreNo: resObj.coreNo, cblDivNm: resObj.cblDivNm, fcltDivNm: resObj.fcltDivNm, eteDistm: resObj.eteDistm, cblSkMgmtNo: resObj.cblSkMgmtNo, cblUnqMgmtNo: resObj.cblUnqMgmtNo, mgmtNo: resObj.mgmtNo, mtsoMgmtNo: resObj.mtsoMgmtNo, cblMgmtNo: resObj.cblMgmtNo, source: src, everExpanded: false});
    			if(i < nodeData.length-1){
    				linkDataArray.push({ from: nodeData[i].fcltUnqMgmtNo + nodeData[i].lineSctnLnoSrno, to: nodeData[i+1].fcltUnqMgmtNo + nodeData[i+1].lineSctnLnoSrno, lftVal: nodeData[i].fcltWgs84Val, rghtVal: nodeData[i+1].fcltWgs84Val, eqpSctnId: nodeData[i].eqpSctnId, coord: nodeData[i].coord, centerText: nodeData[i].cblUnqMgmtNo, curviness: 0 });
    			}

    		}

        	myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

            $('body').progress().remove();

    	}

    	if(flag == "routeList"){

    		var routeList = response.resultData.lists.routeList;

    		if (routeList.length < 1 || $.TcpUtils.isEmpty(routeList[0].mCaMgno)) {
            	alert('ETE경로 조회결과가 없습니다.');
                return;
            }

	    	var  fclt
	    	 	,node = {}
	    	 	,cableList = []
	    	 	,nodeList = [];

	    	// 케이블목록과 노드목록을 분류한다. (∵케이블을 그린후 노드를 그려야 노드가 뭍히지 않는다.)
	    	for (var i = 0 ; i < routeList.length ; i++) {
	    		fclt = routeList[i];
	    		if (!fclt) {
	    			continue;
	    		}

	    		// add to cableList
	    		if ($.TcpUtils.isNotEmpty(fclt.mCaMgno)) {
	    			node = {mgmtNo: fclt.mCaMgno, type: fclt.mCaGeomType, layerNm: fclt.mCaLayerNm, coord: fclt.mCaCoord};

	    			// ETE경로 케이블은 사용자정의 스타일로 설정한다.
	    			if (fclt.mCaSysClf && fclt.mCaSysClf.indexOf('SKT') > -1) {
	    				node.style = 'ETE_CABLE_T';
	    			} else {
	    				node.style = 'ETE_CABLE_B';
	    			}
	    			cableList.push(node);
	    		}
	    		// add to nodeList
	    		if ($.TcpUtils.isNotEmpty(fclt.mNodeMgno)) {
	    			node = {mgmtNo: fclt.mNodeMgno, type: fclt.mNodeGeomType, layerNm: fclt.mNodeLayerNm, coord: fclt.mNodeCoord};
	    			// 접속점,국소류는 기본스타일대로 표시하므로 설정하지 않는다.
	    			nodeList.push(node);
	    		}
	    	} // End of for

//	    	callMsgBox('','I', "전체ETE경로를 메인지도에 표시합니다." , function(msgId, msgRst){
	    		drawEtePath(cableList, nodeList);
//	    	});
	    		gisMapPop.$('body').progress().remove();
    	}

    }
   // 함체 정보(시설물 정보 관리)
    function facilityInfoMgmtPop(e, obj){

//	    var param = {
//	    	actMode:"READ",
//	    	buildInOut:"OUT",
//	    	createFeaturePoint:"",
////	    	distance:"295.2600894006822",
//	    	layrNm:"T_분기접속점_자가",
//	    	pkValue:"45130JP007389"
//    	}

	    var eteDistm = obj.part.data.eteDistm;
    	var fcltDivNm = obj.part.data.fcltDivNm;
    	var mgmtNo = obj.part.data.mgmtNo;
	    var param = {
	    	actMode:"READ",
	    	buildInOut:"OUT",
	    	createFeaturePoint:"",
//	    	distance: "0",
	    	layrNm: fcltDivNm,
	    	pkValue: mgmtNo
    	}

		/*facilityPopup('facilityDtlLkup', 'http://dev.tango.sktelecom.com/tango-transmission-gis-web/fm/facilityinfo/FacilityInfoMgmt.do', '시설물 조회', param);*/
		facilityPopup('facilityDtlLkup', '/tango-transmission-gis-web/fm/facilityinfo/FacilityInfoMgmt.do', '시설물 조회', param);
	}

	function facilityPopup(pidData, urlData, titleData, paramData) {

	        $a.popup({
	              	popid: pidData,
	              	title: titleData,
	                  url: urlData,
	                  data: paramData,
	                  windowpopup : true,
	                  modal: true,
	                  movable:true,
	                  width : 865,
	                  height : 820
	              });
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    var httpRequest = function(Url, Param, Method, Flag ){
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }


});