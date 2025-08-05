/**
 * MtsoDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var gridModel = null;


var startX
var targetX = 0;
//html요소 참조를 위한 변수 선언
var mContainer;
var START_WIDTH = 220;
var sideTabToggle = false;

//회선 파라미터
var mgmtGrpCd = "";
var gridId = "";
var zoomSize = 0;
var serviceGridId = 'serviceLineGridId';
var fromGridId = 'fromDataGrid';
var toGridId = 'toDataGrid';
var serviceLineGridId = 'serviceLineGridId';
var pathGridId = 'pathGridId';
var nodeDataArray = [];
var linkDataArray = [];
var parent;
var nodeTemp;
var curDiagram;
var tabList = new Array();
var groupYn = false;
var groupKey = null;
var paramData = null;
var locX = null;
var locY = null;
var cnt1 = 0;
var cnt2 = 0;
var cnt3 = 0;
var cnt4 = 0;
var cnt9 = 0;
var dupMtsoId = [];
var cntT = 0;
var searchData = null;
var mtsoNodeTemp = [];
var addNodeDataTemp = [];
var addLinkDataTemp = [];
var searchNm = "";
var addKey = "";

//통합국
var dupIntgMtsoId = [];
var cntIntg = 0;

var mgmtGrpCdParam = "";
var svlnSclCdParam = "";

var mapFlag = "";

var gisMap;
var mgMap;
var L;
var Object;

var lowEqpParam = null;

//링생성지도 케이블 , 노드(접속점, 국사) 정보
var ringCableAndNodeData;
// 링 지도 관련하여 라벨 스타일
var textIconOption = {
	labelColumn : 'LABEL',
	faceName : '굴림',
	size : '12',
	color : 'black',
	hAlign : 'left',
	vAlign : 'bottom'
 };
// 지도 보기 레이어
var ringLayer;
var ringLabelLayer;


var comLine = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataGrid';
	var gridIdPort = 'dataGridPort';
	var paramData = null;


    this.init = function(id, param) {
    	initGrid('N');
//    	initGridPort();
    	initDiagram();
    	setEventListener();
        paramData = param;
        $('#eqpLineLkupArea').setData(param);
        $('#imgRight').click();


        $('#'+gridId).alopexGrid('showProgress');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpntwks', param, 'GET', 'eqpntwks');
//        $('#'+gridIdPort).alopexGrid('showProgress');
//        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpports', param, 'GET', 'eqpports');

        // iframe ReSize -- 무조건 호출해야 함.
        resizeContents();
    };

    function resizeContents(){
    	var contentHeight = $("#eqpLineLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

    function initGrid(strGubun) {

    	if (strGubun == "N") {
    		var mappingN =  [{ align:'center', title : '순번', width: '40px', numberingColumn: true },
        		{ key : 'ntwkLineNo', align:'center', title : '링ID', width: '110px' },
        		{ key : 'ntwkLineNm', align:'left', title : '링명', width: '350px' },
        		{ key : 'ntwkTypNm', align:'center', title : '망구분', width: '100px' },
        		{ key : 'topoSclNm', align:'center', title : '망종류', width: '100px' },
        		{ key : 'ntwkStatNm', align:'center', title : '회선상태', width: '80px' },
        		{ key : 'ntwkCapaNm', align:'center', title : '용량', width: '80px' },
        		{ key : 'ringSwchgMeansNm', align:'center', title : '절체방식', width: '130px' },
        		{ key : 'uprMtsoId', align:'center', title : '상위국ID', width: '130px' },
        		{ key : 'uprMtsoNm', align:'center', title : '상위국', width: '130px' },
        		{ key : 'lowMtsoId', align:'center', title : '하위국ID', width: '130px' },
        		{ key : 'lowMtsoNm', align:'center', title : '하위국', width: '130px' }];
    	} else {
    		var mappingN =  [{ align:'center', title : '순번', width: '40px', numberingColumn: true },
        		{ key : 'svlnNo', align:'center', title : '서비스회선번호', width: '110px' },
        		{ key : 'lineNm', align:'left', title : '서비스회선명', width: '350px' },
        		{ key : 'svlnTypNm', align:'center', title : '대분류', width: '100px' },
        		{ key : 'svlnLclNm', align:'center', title : '소분류', width: '100px' },
        		{ key : 'lineLnoGrpSrno', align:'center', title : '경로번호', width: '80px' },
        		{ key : 'svlnSclNm', align:'center', title : '서비스회선유형', width: '80px' },
        		{ key : 'svlnStatNm', align:'center', title : '서비스회선상태', width: '130px' },
        		{ key : 'uprMtsoId', align:'center', title : '상위국ID', width: '130px' },
        		{ key : 'uprMtsoNm', align:'center', title : '상위국', width: '130px' },
        		{ key : 'lowMtsoId', align:'center', title : '하위국ID', width: '130px' },
        		{ key : 'lowMtsoNm', align:'center', title : '하위국', width: '130px' }];
    	}


        $('#'+gridId).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : false,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:false
            }, columnMapping : mappingN
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row"
        });


        $('#menuListGrid').alopexGrid({
    		pager: false,
    		height:"480px",
    		width:"250px",
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [{
    			key : 'rghtEqpNm',
				title : '하위장비명',
				align:'left',
				width: '5px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    }

    function initGridPort() {

            var mappingP = [{ align:'center', title : '순번', width: '50px', numberingColumn: true },
//            	{ key : 'mgmtGrpNm', align:'center', title : '관리그룹', width: '70px' },
//            	{ key : 'orgId', align:'center', title : 'orgId', width: '70px' },
//            	{ key : 'teamId', align:'center', title : 'teamId', width: '70px' },
//            	{ key : 'tmof', align:'center', title : 'tmof', width: '70px' },
//            	{ key : 'tmofNm', align:'center', title : '전송실', width: '150px' },
//            	{ key : 'eqpRoleDivCd', align:'center', title : '장비타입코드', width: '100px' },
//            	{ key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '100px' },
//            	{ key : 'bpId', align:'center', title : '제조사ID', width: '100px' },
//            	{ key : 'bpNm', align:'center', title : '제조사', width: '100px' },
//            	{ key : 'eqpMdlId', align:'center', title : '모델ID', width: '100px' },
//            	{ key : 'eqpMdlNm', align:'center', title : '장비모델명', width: '100px' },
//            	{ key : 'eqpInstlMtsoId', align:'center', title : '국사ID', width: '100px' },
//            	{ key : 'eqpInstlMtsoNm', align:'center', title : '국사명', width: '200px' },
//            	{ key : 'eqpId', align:'center', title : '장비ID', width: '100px' },
//            	{ key : 'eqpNm', align:'center', title : '장비명', width: '200px' },
            	{ key : 'portIdxNo', align:'center', title : '포트Index', width: '100px' },
            	{ key : 'portId', align:'center', title : '포트ID', width: '100px' },
            	{ key : 'portNm', align:'center', title : '포트명', width: '200px' },
            	{ key : 'portAlsNm', align:'center', title : '포트별칭명', width: '200px' },
            	{ key : 'portOpStatNm', align:'center', title : '포트운용상태', width: '100px' },
            	{ key : 'stndRackNo', align:'center', title : 'RaNo', width: '28px' },
            	{ key : 'stndShelfNo', align:'center', title : 'ShNo', width: '28px' },
            	{ key : 'stndSlotNo', align:'center', title : 'SlNo', width: '28px' },
            	{ key : 'stndSubSlotNo', align:'center', title : 'SuNo', width: '28px' },
            	{ key : 'stndPortNo', align:'center', title : 'PoNo', width: '28px' },
            	{ key : 'crsLnkgYn', align:'center', title : 'CRS연동여부', width: '100px' },
            	{ key : 'crsPathNm', align:'center', title : 'CRS경로명', width: '200px' },
            	{ key : 'crsChgDate', align:'center', title : 'CRS변경일자', width: '100px' },
            	{ key : 'portIpAddr', align:'center', title : '포트IP', width: '100px' },
            	{ key : 'portTypCd', align:'center', title : '포트유형코드', width: '100px' },
            	{ key : 'portTypNm', align:'center', title : '포트유형', width: '100px' },
            	{ key : 'portStatCd', align:'center', title : '포트상태코드', width: '100px' },
            	{ key : 'portStatNm', align:'center', title : '포트상태', width: '100px' },
            	{ key : 'dumyPortYn', align:'center', title : 'DUMMY여부', width: '100px' },
            	{ key : 'portCapaCd', align:'center', title : '포트용량코드', width: '100px' },
            	{ key : 'portCapaNm', align:'center', title : '포트용량', width: '100px' },
            	{ key : 'lgcPortYn', align:'center', title : '논리포트여부', width: '100px' },
            	{ key : 'srsPortYn', align:'center', title : '중요포트여부', width: '100px' },
            	{ key : 'autoMgmtYn', align:'center', title : '자동관리여부', width: '100px' },
            	{ key : 'upLinkPortYn', align:'center', title : 'UP링크포트여부', width: '100px' },
            	{ key : 'dplxgMeansDivCd', align:'center', title : '이중화방식코드', width: '100px' },
            	{ key : 'dplxgMeansDivNm', align:'center', title : '이중화방식', width: '100px' },
            	{ key : 'dplxgPortYn', align:'center', title : '이중화여부', width: '100px' },
            	{ key : 'portMacNo', align:'center', title : '포트MAC', width: '100px' },
            	{ key : 'portGwIpAddr', align:'center', title : '포트게이트웨이', width: '100px' },
            	{ key : 'portSrvcDivCd', align:'center', title : '포트서비스구분코드', width: '100px' },
            	{ key : 'portSrvcDivNm', align:'center', title : '포트서비스구분', width: '100px' },
            	{ key : 'portSbntIpAddr', align:'center', title : '포트서브넷', width: '100px' },
            	{ key : 'termlEqpNm', align:'center', title : '종속단장비명', width: '150px' },
            	{ key : 'portDesc', align:'center', title : '포트설명', width: '100px' },
            	{ key : 'portRmk', align:'center', title : '포트비고', width: '100px' },
            	{ key : 'edgYn', align:'center', title : '말단여부', width: '100px' },
            	{ key : 'chnlVal', align:'center', title : '채널값', width: '100px' },
            	{ key : 'wavlVal', align:'center', title : '파장값', width: '100px' },
//            	{ key : 'frstRegDate', align:'center', title : '등록일', width: '100px' },
//            	{ key : 'frstRegUserId', align:'center', title : '등록자', width: '100px' },
//            	{ key : 'lastChgDate', align:'center', title : '변경일', width: '100px' },
//            	{ key : 'lastChgUserId', align:'center', title : '변경자', width: '100px' },
//            	{ key : 'cardId', align:'center', title : '카드ID', width: '100px' },
            	{ key : 'cardNm', align:'center', title : '카드명', width: '100px' }];

            $('#'+gridIdPort).alopexGrid({
           	 cellSelectable : true,
                autoColumnIndex : true,
                fitTableWidth : true,
                rowClickSelect : true,
                rowSingleSelect : true,
                rowInlineEdit : true,
                pager : false,
                numberingColumnFromZero : false
               ,paging: {
            	   pagerTotal:false
               }, columnMapping : mappingP
       	   ,message: {
   				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
   				filterNodata : 'No data'
   			},
               defaultColumnMapping: { resizing : true, sorting: true },
               height: "8row"
           });





    }

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	}

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	}


	function initDiagram() {
    	var $ = go.GraphObject.make;

     // get tooltip text from the object's data
        function nodeTooltipTextConverter(data) {
          var str = "";
          if (data.key !== undefined) str += "장비ID: " + data.eqpId;
          if (data.name !== undefined) str += "\n장비명: " + data.name;
          if (data.eqpRoleDivNm !== undefined) str += "\n장비타입: " + data.eqpRoleDivNm;
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
          if (data.seq !== undefined) str += "순번: " + data.seq;
          if (data.lftEqpNm !== undefined) str += "\nLeft 장비: " + data.lftEqpNm;
          if (data.text !== undefined) str += "\nLeft 포트: " + data.text;
          if (data.rghtEqpNm !== undefined) str += "\nRight 장비: " + data.rghtEqpNm;
          if (data.toText !== undefined) str += "\nRight 포트: " + data.toText;
          if (data.portCapaNm !== undefined) str += "\n용량: " + data.portCapaNm;
          if (data.trkNm !== "" && data.trkNm !== undefined) str += "\n트렁크명: " + data.trkNm;
          if (data.ringNm !== "" && data.ringNm !== undefined) str += "\n링명: " + data.ringNm;
          if (data.wdmNm !== "" && data.wdmNm !== undefined) str += "\nWDM트렁크명: " + data.wdmNm;
          if (data.mtsoVrfRslt !== "S" && data.mtsoVrfRslt !== undefined){
        	  var desc = "";
        	  if(data.mtsoVrfDesc == "NONE"){
        		  desc = "검증 안한 상태";
        	  }else if(data.mtsoVrfDesc == "FAIL_NOT_EQUAL_PREV_EQP_MTSO"){
        		  desc = "이전 장비 국사와 불일치";
        	  }else if(data.mtsoVrfDesc == "FAIL_NOT_EQUAL_NEXT_EQP_MTSO"){
        		  desc = "다음 장비 국사와 불일치";
        	  }else if(data.mtsoVrfDesc == "FAIL_NOT_EQUAL_UPPER_MTSO"){
        		  desc = "첫번째 또는 마지막 장비 국사가 상위국과 불일치";
        	  }else if(data.mtsoVrfDesc == "FAIL_NOT_EQUAL_LOWER_MTSO"){
        		  desc = "첫번째 또는 마지막 장비 국사가 하위국과 불일치";
        	  }else if(data.mtsoVrfDesc == "FAIL_PORT_NULL"){
        		  desc = "A, B 포트 모두 입력 안 한 경우";
        	  }else if(data.mtsoVrfDesc == "EXCEPT_VERIFY_PATH_NODE"){
        		  desc = "검증 대상에서 제외된 선번 노드";
        	  }else if(data.mtsoVrfDesc == "EXCEPT_VERIFY_LINE"){
        		  desc = "검증 대상에서 제외된 회선 선번 통계 산출 로직에서 처리할 것";
        	  }else if(data.mtsoVrfDesc == "NOTHING_PATH"){
        		  desc = "선번이 없는 경우";
        	  }else if(data.mtsoVrfDesc == "FAIL_UNKNOWN_ERROR"){
        		  desc = "시스템 오류로 검증 실패";
        	  }
        	  str += "\n검증결과: " + desc;
          }

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
    		$(go.Diagram, "myDiagramDiv", {
    			initialContentAlignment: go.Spot.Center,
    			"toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom,
    			allowDelete: false,
    			"undoManager.isEnabled": true,
    			"toolManager.hoverDelay": 10
    		});

    	myDiagram.groupTemplate =
    		$(go.Group, "Auto",
            {isSubGraphExpanded: true,
    		locationSpot: go.Spot.Top,
    		zOrder:4,
            subGraphExpandedChanged: function(group) {
            	if (group.memberParts.count === 0) {
            		groupYn = true;
            		groupKey = group.data.key;
            		expandNodeGroup(group);
                  }
            	group.findSubGraphParts().each(function(n) { if (n instanceof go.Node) n.invalidateConnectedLinks(); });
            }},
          	$(go.Shape,
          			"Circle",
          			{ fill: null, stroke: "rgba(128,128,128,0.5)", strokeWidth: 4, name: "PIPE", strokeDashArray: [10,10]},
          			new go.Binding("desiredSize", "size", go.Size.parse)),
          	$(go.TextBlock, { font: "Bold 18px Sans-Serif", margin: 4 ,stroke:"rgba(0,0,0,0.6)"}, new go.Binding("text", "name")),
          	$(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left, margin: 4 },
          		$(go.Panel, "Horizontal",
          			$("SubGraphExpanderButton")
          			),
          	$(go.Placeholder, { padding: new go.Margin(0, 5) })
          	)
        );

    	myDiagram.groupTemplateMap.add("newTypGroup",
    			$(go.Group, "Auto",
        		    	{
        		    		locationSpot: go.Spot.TopRight,
        		    		zOrder:2},
        		    		{selectionAdornmentTemplate:
        	  	  				$(go.Adornment,
        	  	  					$(go.Shape,
        	  	  					{fill: null, stroke: null}),
        	  	  					$(go.Placeholder)
        	  	  				)},
        		        $(go.Shape, "RoundedRectangle",
        		        	new go.Binding("fill", "color"),
    	    		          {
//        	    		            fill: null, stroke:null,
//        	    		            fill: "rgba(133,240,90,0.2)",
    	    		        	stroke: null, parameter1: 20,
    	    		            spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
    	    		          }
        		        ),
        	          	$(go.Panel, "Vertical", { defaultAlignment: go.Spot.Center, margin: 10 },
        	          			$(go.TextBlock,
    	        		            { font: "bold 11pt sans-serif",
//        	        		        	  background: "rgba(0,0,0,0.3)",
    	        		        	  textAlign:"center",
    	        		        	  stretch: go.GraphObject.Fill,
    	        		        	  width: 100,
    	        		        	  background: "white",
    	        		        	  stroke:"rgba(0,0,0,0.6)",
    	        		        	  alignment: new go.Spot(0.5, 0, 0, 0),
    	        		        	  margin: new go.Margin(0, 0, 10, 0) },
    	        		            new go.Binding("text","name")),
          		        	$(go.Picture, new go.Binding("source"),
          		        			new go.Binding("desiredSize", "size", go.Size.parse)),
        	          	$(go.Placeholder, { padding: new go.Margin(0, 0) }),
        	          	{padding: new go.Margin(0, 10)}
        	          	)
            ));

    	myDiagram.groupTemplateMap.add("newGroup",
			$(go.Group, "Auto",
//    		    	{ click: mtsoInfSelect2 },
					{ doubleClick: mtsoDtlComLkupPop },
    		    	{isSubGraphExpanded: true,
    		    		locationSpot: go.Spot.Center,
    		    		zOrder:2,
    		            subGraphExpandedChanged: function(group) {
    		            	expandNodeGroup(group);
    		            }
    		    	},
    		        $(go.Shape, "RoundedRectangle",
    		        	new go.Binding("fill", "color"),
    		          {
    		            stroke:"rgba(0,0,0,0.3)",
    		            strokeWidth: 1,
    		            parameter1: 20
    		          }
    		        ),
    	          	$(go.Panel, "Vertical", { defaultAlignment: go.Spot.Center, margin: 10 },
    	          			$(go.Picture, new go.Binding("source"),
	          						new go.Binding("desiredSize", "size", go.Size.parse)),
    	          		$(go.Panel, "Horizontal",
    	          				$(go.TextBlock, { font: "Bold 12px Sans-Serif", margin: 4 ,stroke:"rgba(255,102,0,0.8)",
    	          					alignment: new go.Spot(0.5, 0),
    	          					margin: 2, textAlign: "center"
    	          				},
    	          				new go.Binding("text", "name")),

    	          			$("SubGraphExpanderButton")
    	          			),
    	          	$(go.Placeholder, {alignment: go.Spot.Center, padding: new go.Margin(0, 0) })
    	          	),
    		        {
    					contextMenu:
    						$(go.Adornment, "Vertical",
//    							$("ContextMenuButton",
//    								$(go.TextBlock,"중복국사관리"),
//    								{ click: DupMtsoPop }
//    								),
//    							$("ContextMenuButton",
//        							$(go.TextBlock,"장비목록"),
//        							{ click: eqpListPop }
//        							),
//        						$("ContextMenuButton",
//        							$(go.TextBlock,"국사수정"),
//        							{ click: mtsoDtlLkupPop }
//        							)
//    							)
    		    		$("ContextMenuButton",
    							$(go.TextBlock,"국사통합정보"),
    							{ click: mtsoDtlComLkupPop }
							)
							)
    				}
        ));
    	myDiagram.groupTemplateMap.add("topGroup",
    			$(go.Group, "Auto",
        		    	{doubleClick: mtsoDtlComLkupPop },
        		    	{isSubGraphExpanded: true,
        		    		locationSpot: go.Spot.Center,
        		    		zOrder:2,
        		            subGraphExpandedChanged: function(group) {
        		            	expandNodeGroup(group);
        		            }
        		    	},
        		        $(go.Shape, "RoundedRectangle",
        		        	new go.Binding("fill", "color"),
        		          {
        		            stroke:"rgba(0,0,0,0.3)",
        		            strokeWidth: 1,
        		            parameter1: 20
        		          }
    								),
        	          	$(go.Panel, "Vertical", { defaultAlignment: go.Spot.Center, margin: 10 },
        	          			$(go.Picture, new go.Binding("source"),
    	          						new go.Binding("desiredSize", "size", go.Size.parse)),
        	          		$(go.Panel, "Horizontal",
        	          				$(go.TextBlock, { font: "Bold 12px Sans-Serif", margin: 4 ,stroke:"rgba(255,102,0,0.8)",
        	          					alignment: new go.Spot(0.5, 0),
        	          					margin: 2, textAlign: "center"
        	          				},
        	          				new go.Binding("text", "name")),

        	          			$("SubGraphExpanderButton")
        	          			),
        	          	$(go.Placeholder, {alignment: go.Spot.Center, padding: new go.Margin(0, 0) })
        							),
        		        {
        					contextMenu:
        						$(go.Adornment, "Vertical",
//        							$("ContextMenuButton",
//        								$(go.TextBlock,"중복국사관리"),
//        								{ click: DupMtsoPop }
//        								),
//        							$("ContextMenuButton",
//            							$(go.TextBlock,"장비목록"),
//            							{ click: eqpListPop }
//            							),
        						$("ContextMenuButton",
            							$(go.TextBlock,"국사통합정보"),
            							{ click: mtsoDtlComLkupPop }
        							)
    							)
    				}
        ));
    	myDiagram.nodeTemplate =
    		$(go.Node, "Vertical",
    				{ doubleClick: eqpDtlComLkupPop },
    			{ //toolTip: nodeToolTip,
    	          isTreeLeaf: false,
    			isTreeExpanded: false,
    			zOrder:3
    			},
    			{selectionAdornmentTemplate:
    				$(go.Adornment,"Auto",
    					$(go.Shape, "RoundedRectangle",
    					{fill: null, stroke: "dodgerblue", strokeWidth: 2}),
    					$(go.Placeholder)
    				)},
    			new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
    			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    			$(go.Panel, "Vertical",
    				$(go.Picture, new go.Binding("source"),
    						{ desiredSize: new go.Size(40, 40)}),
    				$(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "name"))
    			),
    			$("TreeExpanderButton",
		          {
		            name: 'TREEBUTTON',
		            width: 20, height: 20,
		            alignment: go.Spot.TopRight,
		            alignmentFocus: go.Spot.Center,
		            click: function (e, obj) {  // OBJ is the Button
		                var node = obj.part;  // get the Node containing this Button
		                if (node === null) return;
		                e.handled = true;
		                groupYn = false;
		                groupKey = node.data.group;
		                expandNode(node);
		              }
		          }
		        )
    		);

    	myDiagram.nodeTemplateMap.add("nodeData1",
        		$(go.Node, "Vertical",
        			{selectionAdornmentTemplate:
        				$(go.Adornment,"Auto",
        					$(go.Shape, "RoundedRectangle",
        					{fill: null, stroke: "dodgerblue", strokeWidth: 2}),
        					$(go.Placeholder)
        				)},
    				{locationSpot: go.Spot.Center,
        			//doubleClick: mtsoDtlLkupPop,
        			doubleClick: mtsoDtlComLkupPop,
        			selectionAdorned: true,
    				selectionChanged: onSelectionChanged,
    				mouseEnter: function(e, obj) {
    						  var node = obj.part;
    						  enterNodeAdornment.adornedObject = node;
    						  node.addAdornment("mouseEnter", enterNodeAdornment)},
    				mouseLeave: function(e, obj) {
    						  var node = obj.part;
    						  leaveNodeAdornment.adornedObject = node;
    						  node.addAdornment("mouseEnter", leaveNodeAdornment)},
    				zOrder:3
    				},
        			new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
        			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        			$(go.Panel, "Vertical",
        				$(go.Picture, new go.Binding("source"),
        						{ desiredSize: new go.Size(40, 40)}),
        				$(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "name"))
        			),
    		        {
    					contextMenu:
    						$(go.Adornment, "Vertical",
//    							$("ContextMenuButton",
//    								$(go.TextBlock,"중복국사관리"),
//    								{ click: DupMtsoPop }
//    								),
//    							$("ContextMenuButton",
//        							$(go.TextBlock,"장비목록"),
//        							{ click: eqpListPop }
//        							),
//        						$("ContextMenuButton",
//        							$(go.TextBlock,"국사수정"),
//        							{ click: mtsoDtlLkupPop }
//        							)
//    							)
    						$("ContextMenuButton",
        							$(go.TextBlock,"국사통합정보"),
        							{ click: mtsoDtlComLkupPop }
    							)
    							)
    				}
        		));

    	var leaveNodeAdornment =
    		$(go.Adornment,"Auto",
					$(go.Shape, "RoundedRectangle",
					{fill: null, stroke: null}),
					$(go.Placeholder)
				);

    	var enterNodeAdornment =
    		$(go.Adornment,"Auto",
					$(go.Shape, "RoundedRectangle",
					{fill: null, stroke: "red", strokeWidth: 2}),
					$(go.Placeholder)
				);

    	myDiagram.nodeTemplateMap.add("nodeData2",
    		$(go.Node, "Vertical",
    			{selectionAdornmentTemplate:
    				$(go.Adornment,"Auto",
    					$(go.Shape, "RoundedRectangle",
    					{fill: null, stroke: "dodgerblue", strokeWidth: 3}),
    					$(go.Placeholder)
    				)},
    			{ //toolTip: nodeToolTip,
    			  name: "nodeData2",
				  locationSpot: go.Spot.Center,
				  doubleClick: eqpDtlComLkupPop,
				  toolTip: nodeTooltiptemplate,
    	          isTreeLeaf: false,
    	          selectionAdorned: true,
				  selectionChanged: onSelectionChanged,
				  mouseEnter: function(e, obj) {
					  var node = obj.part;
					  enterNodeAdornment.adornedObject = node;
					  node.addAdornment("mouseEnter", enterNodeAdornment)},
				  mouseLeave: function(e, obj) {
					  var node = obj.part;
					  leaveNodeAdornment.adornedObject = node;
					  node.addAdornment("mouseEnter", leaveNodeAdornment)},
    			  zOrder:3
    			},
    			new go.Binding("isTreeExpanded", "isTreeExpanded"),
    			new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
    			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    			$(go.Panel, "Vertical",
    				$(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "eqpRoleDivNm")),
    				$(go.Picture, new go.Binding("source"),
    						{ desiredSize: new go.Size(40, 40)}),
    				$(go.TextBlock, { margin: 2, font: "Bold 11px Sans-Serif" }, new go.Binding("text", "name"))
    			),
    			$("TreeExpanderButton",
		          {
		            name: 'TREEBUTTON',
		            width: 15, height: 15,
		            alignment: go.Spot.TopRight,
		            alignmentFocus: go.Spot.Center,
		            click: function (e, obj) {  // OBJ is the Button
		                var node = obj.part;  // get the Node containing this Button
		                if (node === null) return;
		                e.handled = true;
		                groupYn = false;
		                groupKey = node.data.group;
		                expandNode(node);
		              }
		          },
		          new go.Binding("visible", "btnVisible")
		        ),
		        {
					contextMenu:
						$(go.Adornment, "Vertical",
								$("ContextMenuButton",
										$(go.TextBlock,"장비통합정보"),
										{ click: eqpDtlComLkupPop }
										)
//									$("ContextMenuButton",
//										$(go.TextBlock,"연동정보"),
//										{ click: eqpLnkgInfPop }
//										),
//									$("ContextMenuButton",
//		    							$(go.TextBlock,"형상정보"),
//		    							{ click: shpInfPop }
//		    							),
//		    						$("ContextMenuButton",
//		    							$(go.TextBlock,"포트현황"),
//		    							{ click: portInfMgmtPop }
//		    							),
//		    						$("ContextMenuButton",
//		    							$(go.TextBlock,"포트복사"),
//		    							{ click: portInfCopyPop }
//		    							),
////									$("ContextMenuButton",
////										$(go.TextBlock,"구간현황"),
////		    							{ click: eqpSctnAcptCurstPop }
////										),
//									$("ContextMenuButton",
//										$(go.TextBlock,"링/서비스 회선"),
//		    							{ click: eqpNtwkLineAcptCurstPop }
//										),
////									$("ContextMenuButton",
////										$(go.TextBlock,"회선정보"),
////		    							{ click: eqpSrvcLineAcptCurstPop }
////										),
//									$("ContextMenuButton",
//		    							$(go.TextBlock,"변경이력"),
//		    							{ click: eqpChgHstLkupPop }
//		    							)
									)
				}
    		));


    	function highlightLink(link, show){
    		link.isHighlighted = show;
    		link.fromNode.isHighlighted = show;
    		link.toNode.isHighlighted = show;
    	}

    	myDiagram.linkTemplate =
    		$(go.Link,
//    			{routing: go.Link.AvoidsNodes, corner: 100},
//    			{curve: go.Link.Bezier},
    			new go.Binding("curve"),
    			new go.Binding("curviness"),
    			new go.Binding("points").makeTwoWay(),
    			{
    				click: linkSelect ,
    				doubleClick: tnBdgmLinkInfPop,
    				toolTip: linkTooltiptemplate,
    				mouseEnter: function(e, link) {highlightLink(link, true)},
    				mouseLeave: function(e, link) {highlightLink(link, false)}
    			},
    			$(go.Shape,
    					{name: "LINK_SHAPE"},
    				new go.Binding("stroke", "isHighlighted",
    								function(h, shape){ return h ? "red" : "black";})
    								.ofObject(),
    				new go.Binding("strokeWidth", "isHighlighted",
									function(h){ return h ? 2 : 1;})
									.ofObject()
    								),
    			$(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "#1967B3",
	    				  name:  "lftPort",
	    				  segmentIndex: 0,
	    				  segmentOffset: new go.Point(NaN, NaN),
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "text")),
	            $(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "#1967B3",
	    				  name:  "rghtPort",
	    				  segmentIndex: -1,
	    				  segmentOffset: new go.Point(NaN, NaN),
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "toText")),
	            $(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "red",
	    				  name:  "centerCapa",
	    				  segmentIndex: 1,
	    				  segmentOffset: new go.Point(0, -10),
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "centerText")),
	            $(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "#A89824",
	    				  name:  "centerTrk",
	    				  segmentIndex: 1,
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
//	    				{ click: test },
			            new go.Binding("text", "centerTrkText"),
			            new go.Binding("segmentOffset", "segmentOffsetTrk")),
	            $(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "#FF7171",
	    				  name:  "centerRing",
	    				  segmentIndex: 1,
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
//			    				{ click: test },
			            new go.Binding("text", "centerRingText"),
			            new go.Binding("segmentOffset", "segmentOffsetRing")),
			    $(go.TextBlock,
			            { textAlign: "center",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "#3A8B3A",
	    				  name:  "centerWdm",
	    				  segmentIndex: 1,
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
//	    				{ click: test },
			            new go.Binding("text", "centerWdmText"),
			            new go.Binding("segmentOffset", "segmentOffsetWdm")),
	            {
					contextMenu:
						$(go.Adornment, "Vertical",
							$("ContextMenuButton",
								$(go.TextBlock,"링크정보"),
								{ click: tnBdgmLinkInfPop }
								),
							$("ContextMenuButton",
								$(go.TextBlock,"선로조회"),
								{ click: searchLineInf },
								new go.Binding("visible", "lineVisible")
								),
							$("ContextMenuButton",
								$(go.TextBlock,"트렁크시각화편집"),
								{ click: trunkInfoPopNew },
								new go.Binding("visible", "trkVisible")
								),
							$("ContextMenuButton",
    							$(go.TextBlock,"링시각화편집"),
    							{ click: ringInfoPopNew },
    							new go.Binding("visible", "ringVisible")
    							),
    						$("ContextMenuButton",
    							$(go.TextBlock,"WDM트렁크시각화편집"),
    							{ click: wdmTrunkInfoPopNew },
    							new go.Binding("visible", "wdmVisible")
    							)
							)
				}
    		);

    	myDiagram.linkTemplateMap.add("mtsoLink",
        		$(go.Link,
        			$(go.Shape)
        ));

    	myDiagram.linkTemplateMap.add("groupLink",
    		$(go.Link,
    			new go.Binding("curve"),
    			new go.Binding("curviness"),
    			new go.Binding("points").makeTwoWay(),
    			$(go.Shape,
    					{strokeWidth: 0}
    			)
    	));

    	myDiagram.linkTemplateMap.add("subLink",
    		$(go.Link,
    			$(go.Shape,
    					{stroke: null}
    		)
    	));
    	myDiagram.commandHandler.decreaseZoom(0.6);
    }

    function linkIsTrue(link){
    	return link.findObject("LINK_SHAPE").stroke === "green";
    }

    function updateStates(){
    	var oldskips = myDiagram.skipsUndoManager;
    	myDiagram.skipsUndoManager = true;
		myDiagram.links.each(function(link){
			if(link.data.mtsoVrfRslt != "S" && link.data.mtsoVrfRslt != undefined){
				if(linkIsTrue(link)){
					link.findObject("LINK_SHAPE").stroke = "red";
				}else{
					link.findObject("LINK_SHAPE").stroke = "green";
				}
				link.findObject("LINK_SHAPE").strokeWidth = "2";
			}
		});
		myDiagram.skipsUndoManager = oldskips;
    }

    //링 표현 회전하도록
    var opacity = 1;
    var down = true;
    function loop(){
    	setTimeout(function() {updateStates(); loop(); }, 400);
    }

    function setEventListener() {

    	$('#imgRight').on('click', function(e) {
    		//alert();
			var $this = $('#menuContainer');
			if ($this.hasClass('open')) {
				$this.animate ({
					right : 0
				}, 300).removeClass('open');
			} else {
				$this.animate ({
					right : '-250px'
				}, 300).addClass('open');
			}
		});

    	$('#btn-zoom-in').on('click', function(e){
			//if(zoomSize < 20){
				myDiagram.commandHandler.increaseZoom(1.67);
				zoomSize = zoomSize + 1;
				$("#btn-zoom-size").html(zoomSize);
			//}
    	});

    	$('#btn-zoom-out').on('click', function(e){
    		//if(zoomSize > 1){
    			myDiagram.commandHandler.decreaseZoom(0.6);
				zoomSize = zoomSize - 1;
				$("#btn-zoom-size").html(zoomSize);
			//}
        });

    	$(document).on('click', "[name='rdGubun']", function(e){
    		var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;

    		if (ckGubun) {

    			initGrid('N');
    			var eqpId = $("#eqpId").val();
    			var param = {eqpId : eqpId};
    			$('#'+gridId).alopexGrid('showProgress');
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpntwks', param, 'GET', 'eqpntwks');

    			//$("input:radio[name=rdGubun]").removeAttr("checked");
    			//$("input:radio[name=rdGubun][value='N']").prop("checked", true);
    		} else {

    			initGrid('S');
    			var eqpId = $("#eqpId").val();
    			var param = {eqpId : eqpId};
    			$('#'+gridId).alopexGrid('showProgress');
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpsrvcs', param, 'GET', 'eqpsrvcs');

    			//$("input:radio[name=rdGubun]").removeAttr("checked");
    			//$("input:radio[name=rdGubun][value='S']").prop("checked", true);
    		}
      	 });

    	$('#'+gridId).on('click', '.bodycell', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;
    		var data = null;
    		if (ckGubun) {

    			$("#searchId").val(dataObj.ntwkLineNo);
    			$("#searchNm").val(dataObj.ntwkLineNm);
    			data = {searchTarget : "RING", searchId : dataObj.ntwkLineNo, searchNm : dataObj.ntwkLineNm};
    			setTopology("RING", dataObj.ntwkLineNo, dataObj.ntwkLineNm);
    		} else {
    			$("#searchId").val(dataObj.svlnNo);
    			$("#searchNm").val(dataObj.lineNm);
    			data = {searchTarget : "SRVN", searchId : dataObj.svlnNo, searchNm : dataObj.lineNm};
    			setTopology("SRVN", dataObj.svlnNo, dataObj.lineNm);
    		}
		});

    	$('#menuListGrid').on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			comLine.lowEqpData(dataObj.rghtEqpId);

			var $this = $('#menuContainer');
            if ($this.hasClass('open')) {
			} else {
				$this.animate ({
					right : '-250px'
				}, 300).addClass('open');
			}
		});
    	$(document).on('click', "[id^='searchLayer']", function(e){
    		var searchId = $("#searchId").val();
    		var searchNm = $("#searchNm").val();
    		if (searchId != null && searchId != undefined && searchId != "") {
    			var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;
        		if (ckGubun) {
        			setTopology("RING", searchId, searchNm);
        		} else {
        			setTopology("SRVN", searchId, searchNm);
        		}
    		}

    	});
    	$(document).on('click', "[id^='searchFDFYN']", function(e){
    		var searchId = $("#searchId").val();
    		var searchNm = $("#searchNm").val();
    		if (searchId != null && searchId != undefined && searchId != "") {
    			var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;
        		if (ckGubun) {
        			setTopology("RING", searchId, searchNm);
        		} else {
        			setTopology("SRVN", searchId, searchNm);
        		}
    		}
    	});

    	$(document).on('change', "[id='viewPort']", function(e){
    		var searchId = $("#searchId").val();
    		var searchNm = $("#searchNm").val();
    		if (searchId != null && searchId != undefined && searchId != "") {
    			var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;
        		if (ckGubun) {
        			setTopology("RING", searchId, searchNm);
        		} else {
        			setTopology("SRVN", searchId, searchNm);
        		}
    		}
    	});

    	$(document).on('change', "[id='viewNtwk']", function(e){
    		var searchId = $("#searchId").val();
    		var searchNm = $("#searchNm").val();
    		if (searchId != null && searchId != undefined && searchId != "") {
    			var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;
        		if (ckGubun) {
        			setTopology("RING", searchId, searchNm);
        		} else {
        			setTopology("SRVN", searchId, searchNm);
        		}
    		}
    	});


   	 $("#searchLineInf").on("click", function(e) {
   		 searchLineInf();
   	 });

   	//지도 버튼
   	 $("#searchMap").on("click", function(e) {
   		var param = null;
   		var searchId = $("#searchId").val();
		var searchNm = $("#searchNm").val();
   		param =  $("#eqpLineLkupForm").getData();
   		param.searchId = searchId;
   		param.searchNm = searchNm;
   		var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;
		if (ckGubun) {
			mapFlag = "RING";
		} else {
			mapFlag = "";
		}
   		 window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2EMap.do');

 	});

   	//GIS지도 버튼
   	 $("#searchMapGis").on("click", function(e) {
   	 	mapFlag = "";
   	 	gisMap = window.open('/tango-transmission-gis-web/tgis/Main.do');

		setTimeout(function(){
			gisM();
			}, 5000);
		});

   	$('#btnEqpLineExportExcel').on('click', function(e) {

   		var ckGubun = $("input:radio[name=rdGubun][value='N']").is(":checked") ? true : false;
		var excelFileName = "";

   		if (ckGubun) {
   			excelFileName = "장비통합정보_링_";
		} else {
			excelFileName = "장비통합정보_회선_";
		}

		 var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : excelFileName+recentYMD,
				sheetList : [{
					sheetName : '장비통합정보',
					$grid : $('#'+gridId)
				}]
			});
			worker.export({
				merge : true,
				useCSSParser : true,
				useGridColumnWidth : true,
				border : true,
				callback : {
					preCallback : function(gridList){
						for(var i=0; i < gridList.length; i++) {
							if(i == 0  || i == gridList.length -1)
								gridList[i].alopexGrid('showProgress');
						}
					},
					postCallback : function(gridList) {
						for(var i=0; i< gridList.length; i++) {
							gridList[i].alopexGrid('hideProgress');
						}
					}
				}
			});

     });

	}

    this.lowEqpData = function(data){
		var strCnt = 0;
		var testNode=[];
		var allChk = 0;

		if(data == "ALL"){
			var a = 0;
			var b = 0;
			var c = 0;
			if(addLinkDataTemp.length > 0){
				for(var i=1; i<lowEqpParam.length; i++){
					for(var j=0; j<addLinkDataTemp.length; j++){
						if(addLinkDataTemp[j].rghtEqpId == lowEqpParam[i].lftEqpId){//템프에 나를 연장시킨 노드가 있으면 삭제하지 않는다
							a++;
						}
					}
				}
				if(a == 0){
					for(var j=0; j<addNodeDataTemp.length; j++){
						myDiagram.model.removeNodeData(addNodeDataTemp[j]);
					}
					for(var j=0; j<addLinkDataTemp.length; j++){
						myDiagram.model.removeLinkData(addLinkDataTemp[j]);
					}
					addNodeDataTemp.length = 0;
					addLinkDataTemp.length = 0;
					allChk++;
				}
			}
		}

		//마지막 노드값
		var locXL = parseInt(nodeDataArray[nodeDataArray.length - 1].loc.substring(0, nodeDataArray[nodeDataArray.length - 1].loc.indexOf(' ')));

		for(var i=1; i<lowEqpParam.length; i++){

			var cnt = 0;
			var locYS = Number(locY);
			var resObj = lowEqpParam[i];

			if(resObj.rghtEqpId == data){
				var a = 0;
				var b = 0;
				var c = 0;
				if(addLinkDataTemp.length > 0){
					for(var j=0; j<addLinkDataTemp.length; j++){
						if(addLinkDataTemp[j].rghtEqpId == resObj.lftEqpId){//템프에 나를 연장시킨 노드가 있으면 삭제하지 않는다
							a++;
						}
						if(addLinkDataTemp[j].lftEqpId == resObj.lftEqpId){//같은 위치에 노드가 있으면 삭제
							b++;
						}
					}
					for(var j=0; j<addNodeDataTemp.length; j++){
						//추가로 생긴 템프노드들 중에 지금 선택한 노드가 없으면 신규 시작점으로 보고 이미 생긴 추가 노드들을 삭제한다.
						if(nodeTemp.data.eqpId == addNodeDataTemp[j].eqpId){
							c++;
						}
					}
					if((a == 0 && b > 0) || c == 0){
						for(var j=0; j<addNodeDataTemp.length; j++){
							myDiagram.model.removeNodeData(addNodeDataTemp[j]);
						}
						for(var j=0; j<addLinkDataTemp.length; j++){
							myDiagram.model.removeLinkData(addLinkDataTemp[j]);
						}
						addNodeDataTemp.length = 0;
						addLinkDataTemp.length = 0;
					}
				}
			}

			var locXS = locX; //부모 노드의 위치값

			for(var j=0; j<nodeDataArray.length; j++){
				if(nodeDataArray[j].eqpId == resObj.rghtEqpId){
					cnt++;
				}
			}

			var nodeData;
			var src = null;
			var cntA = 40;
			var cntB = 80;

			if(cnt == 0){

				if(resObj.rghtEqpId == data || data == "ALL"){

					if(resObj.rghtMtsoTypCd == "1"){
						var cnt11 = 0;
						for(var j=0; j<nodeDataArray.length; j++){
							if(nodeDataArray[j].mtsoId == resObj.rghtMtsoId){
								cnt11++;
							}
						}
						if(cnt11 == 0){

							nodeData = { key: resObj.rghtMtsoId, name: resObj.rghtMtsoNm, mtsoId: resObj.rghtMtsoId, mtsoTypCd: resObj.rghtMtsoTypCd, category: "newGroup", color: "rgba(255,128,61,0.1)", isGroup: true, mtsoYn: "YES" };
							myDiagram.model.addNodeData(nodeData);
							dupMtsoId[dupMtsoId.length] = resObj.rghtMtsoId;
							addNodeDataTemp[addNodeDataTemp.length] = nodeData;
						}
					}else if(resObj.rghtMtsoTypCd == "2"){
						var cnt22 = 0;
						for(var j=0; j<nodeDataArray.length; j++){
							if(nodeDataArray[j].mtsoId == resObj.rghtMtsoId){
								cnt22++;
							}
						}
						if(cnt22 == 0){

							nodeData = { key: resObj.rghtMtsoId, name: resObj.rghtMtsoNm, mtsoId: resObj.rghtMtsoId, mtsoTypCd: resObj.rghtMtsoTypCd, category: "newGroup", color: "rgba(0,128,255,0.1)", isGroup: true, mtsoYn: "YES" };
							myDiagram.model.addNodeData(nodeData);
							dupMtsoId[dupMtsoId.length] = resObj.rghtMtsoId;
							addNodeDataTemp[addNodeDataTemp.length] = nodeData;
						}
					}else if(resObj.rghtMtsoTypCd == "3"){
						var cnt33 = 0;
						for(var j=0; j<nodeDataArray.length; j++){
							if(nodeDataArray[j].mtsoId == resObj.rghtMtsoId){
								cnt33++;
							}
						}
						if(cnt33 == 0){
							nodeData = { key: resObj.rghtMtsoId, name: resObj.rghtMtsoNm, mtsoId: resObj.rghtMtsoId, mtsoTypCd: resObj.rghtMtsoTypCd, category: "newGroup", color: "rgba(0,128,0,0.1)", isGroup: true, mtsoYn: "YES" };
							myDiagram.model.addNodeData(nodeData);
							dupMtsoId[dupMtsoId.length] = resObj.rghtMtsoId;
							addNodeDataTemp[addNodeDataTemp.length] = nodeData;
						}

					}else if(resObj.rghtMtsoTypCd == "4"){
						var cnt44 = 0;
						for(var j=0; j<nodeDataArray.length; j++){
							if(nodeDataArray[j].mtsoId == resObj.rghtMtsoId){
								cnt44++;
							}
						}
						if(cnt44 == 0){
							nodeData = { key: resObj.rghtMtsoId, name: resObj.rghtMtsoNm, mtsoId: resObj.rghtMtsoId, mtsoTypCd: resObj.rghtMtsoTypCd, category: "newGroup", color: "rgba(187,187,0,0.1)", isGroup: true, mtsoYn: "YES" };
							myDiagram.model.addNodeData(nodeData);
							dupMtsoId[dupMtsoId.length] = resObj.rghtMtsoId;
							addNodeDataTemp[addNodeDataTemp.length] = nodeData;
						}
					}else if(resObj.rghtMtsoTypCd == "9"){
						var cnt99 = 0;
						for(var j=0; j<nodeDataArray.length; j++){
							if(nodeDataArray[j].mtsoId == resObj.rghtMtsoId){
								cnt99++;
							}
						}
						if(cnt99 == 0){
							nodeData = { key: resObj.rghtMtsoId, name: resObj.rghtMtsoNm, mtsoId: resObj.rghtMtsoId, mtsoTypCd: resObj.rghtMtsoTypCd, category: "newGroup", color: "rgba(0,0,0,0.1)", isGroup: true, mtsoYn: "YES" };
							myDiagram.model.addNodeData(nodeData);
							dupMtsoId[dupMtsoId.length] = resObj.rghtMtsoId;
							addNodeDataTemp[addNodeDataTemp.length] = nodeData;
						}
					}

					if(data == "ALL"){

						if(allChk > 0){
							locXS = Number(locXL) + 250;//새로 뿌려지는 전체data는 마지막 노드 다음에 뿌려지도록 한다.
						}else{
							locXS = Number(locXS) + 250;//추가로 연장된 노드에서의 전체data는 선택 노드 다음에 뿌려지도록 한다.
						}

						if(strCnt > 0){ // 첫 좌표는 (0,0)으로 준다.
							//국사 그룹의 첫 데이타
							if((nodeDataArray[nodeDataArray.length-2].category != "newTypGroup" && nodeDataArray[nodeDataArray.length-1].category == "newGroup") || nodeDataArray[nodeDataArray.length-1].name == "RING"){
								cntA = 120;
								cntB = 160;
								//국사타입 그룹의 첫 데이타
							}else if(nodeDataArray[nodeDataArray.length-2].category == "newTypGroup" && nodeDataArray[nodeDataArray.length-1].category == "newGroup"){
								cntA = 120;
								cntB = 210;
							}
							for(var j=0; j<nodeDataArray.length; j++){
								if(nodeDataArray[(nodeDataArray.length-1)-j].isGroup != true && nodeDataArray[(nodeDataArray.length-1)-j].category != "newTypGroup" && nodeDataArray[(nodeDataArray.length-1)-j].category != "newGroup"){
									testNode.unshift(nodeDataArray[nodeDataArray.length-1-j].loc);
									break;
								}

							}
							for(var j=0; j<testNode.length; j++){
								testNode[j] = locXS + " " + ( parseInt(testNode[j].substring(testNode[j].indexOf(' '))) - cntA );
							}
						}else{
							if(resObj.rghtEqpNm.length > 25){
								locXS = Number(locXS) + 400;
							}else{
								locXS = Number(locXS) + 310;  // Y값은 유지되어 남아있다.
							}
						}

						if(testNode.length > 0){
							resObj.loc = locXS + " " + ( parseInt(testNode[0].substring(testNode[0].indexOf(' '))) + cntB );
						}else{
							resObj.loc = locXS + " " + locYS;
						}

						var aa = 0;
						var h=0;
						for(var k=0; k<testNode.length; k++){
							h=aa;
							for(h; h<nodeDataArray.length; h++){
								if(nodeDataArray[(nodeDataArray.length-1)-h].isGroup == true || nodeDataArray[(nodeDataArray.length-1)-h].category == "newTypGroup" || nodeDataArray[(nodeDataArray.length-1)-h].category == "newGroup"){
									aa++;
								}else{
									myDiagram.model.setDataProperty(nodeDataArray[(nodeDataArray.length-1)-h], "loc", testNode[k]);
									aa++;
									break;
								}
							}
						}
					}else{
						//선택한 노드의 다음 위치에 다른 노드가 있으면 그 노드의 마지막 Y값에 +한다.
						for(var j=nodeDataArray.length; j>0; j--){
							if(nodeDataArray[j-1].isGroup != true && nodeDataArray[j-1].category != "newTypGroup" && nodeDataArray[j-1].category != "newGroup"){
								var locXH = nodeDataArray[j-1].loc.substring(0, nodeDataArray[j-1].loc.indexOf(' '));
								var locYH = nodeDataArray[j-1].loc.substring(nodeDataArray[j-1].loc.indexOf(' '));
								if(locXH == (Number(locXS) + 250)){
									if(nodeDataArray[j-1].group == resObj.rghtMtsoId){
										locYS = (Number(locYH) + 100)
									}else{
										locYS = (Number(locYH) + 160)
									}
									break;
								}
							}
						}
						resObj.loc = (Number(locXS) + 250) + " " + locYS;
					}

					//장비 타입 별 장비 아이콘
					src = getEqpIcon(resObj.rghtEqpRoleDivCd, "");

					nodeData = { key: resObj.rghtEqpId, name: resObj.rghtEqpNm, source: src, loc: resObj.loc, eqpId: resObj.rghtEqpId, eqpRoleDivCd: resObj.rghtEqpRoleDivCd, eqpRoleDivNm: resObj.rghtEqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: true, category: "nodeData2", group: resObj.rghtMtsoId};
					myDiagram.model.addNodeData(nodeData);
					addNodeDataTemp[addNodeDataTemp.length] = nodeData;

					linkData = { eqpSctnId: resObj.eqpSctnId, from: addKey, lftEqpId: resObj.lftEqpId, lftEqpNm: resObj.lftEqpNm, to: resObj.rghtEqpId, rghtEqpId: resObj.rghtEqpId, rghtEqpNm: resObj.rghtEqpNm, curviness: 0 };
					myDiagram.model.addLinkData(linkData);
					addLinkDataTemp[addLinkDataTemp.length] = linkData;
				}
			}
			strCnt++;

		}

		//다른 노드의 연장 노드들이 삭제될때 부모노드의 버튼이 사라지는 현상이 있어 전체 버튼을 보여준다.
		myDiagram.nodes.each(function(n){
			if(n.data.isGroup != true && n.data.category != "newTypGroup" && n.data.category != "newGroup"){
				n.findObject('TREEBUTTON').visible = true;
			}
		});
	}




    function linkSelect(e, link){
//		var dataList = AlopexGrid.trimData($('#'+pathGridId).alopexGrid("dataGet"));
//		for(var idx = 0; idx < dataList.length; idx++ ) {
//			if(link.data.eqpSctnId == dataList[idx].eqpSctnId) {
//				$('#'+pathGridId).alopexGrid('rowSelect', {_index: {row:idx}}, true);
//			}
//		}
	}


    function onSelectionChanged(node){
		var src = null;

		if(node.data.mtsoYn == "YES"){
			if(node.isSelected){
				src = getMtsoIcon(node.data.mtsoTypCd, "S");
				myDiagram.model.setDataProperty(node.data, "source", src);
			}else{
				src = getMtsoIcon(node.data.mtsoTypCd, "");
				myDiagram.model.setDataProperty(node.data, "source", src);
			}
		}else{
			if(node.isSelected){
				src = getEqpIcon(node.data.eqpRoleDivCd, "S");
				myDiagram.model.setDataProperty(node.data, "source", src);
			}else{
				src = getEqpIcon(node.data.eqpRoleDivCd, "");
				myDiagram.model.setDataProperty(node.data, "source", src);
			}
		}
	}

    function setTopology(strTarget, strId, strNm) {
    	$('#menuListGrid').alopexGrid("dataEmpty");
    	var param = {};
    	param.searchTarget = strTarget;
		param.searchId = strId;
		param.searchNm = strNm;

    	var flag = "";
    	var searchLayer = $('#searchLayer').getValue();
    	var searchFDFYN = $('#searchFDFYN').getValue();
    	cnt1 = 0;
    	cnt2 = 0;
    	cnt3 = 0;
    	cnt4 = 0;
    	cnt9 = 0;
        dupMtsoId.length = 0;
    	cntT = 0;

    	//통합국
    	cntIntg = 0;
    	dupIntgMtsoId.length = 0;

    	$('body').progress();

    	if(param.searchTarget == "SRVN" && param.searchId != ""){//서비스회선번호 검색 시
    		searchData = "serviceLineData";
    		searchNm = strNm+"_서비스회선";
			if(searchLayer == "M"){
				if(searchFDFYN == "Y"){
					param.searchGubun = "serviceLineDataForMtsoLink";
					flag = "mtsoData"
				}else{
					param.searchGubun = "serviceLineDataForMtso";
					flag = "mtsoData"
				}
			}else{
				if(searchFDFYN == "Y"){
					param.searchGubun = "serviceLineDataForEqpLink";
					flag = "linkData"
				}else{
					param.searchGubun = "serviceLineDataForEqp";
					flag = "eqpData"
				}
			}
    	}else if((param.searchTarget == "RING" || param.searchTarget == "TRK") && param.searchId != ""){//링으로 검색 시

    		if(param.searchTarget == "RING"){
    			searchData = "ringData";
    			searchNm = strNm+"_링";
    		}

			if(searchLayer == "M"){
				if(searchFDFYN == "Y"){
					param.searchGubun = "ringDataForMtsoLink";
					flag = "mtsoData"
				}else{
					param.searchGubun = "ringDataForMtso";
					flag = "mtsoData"
				}
			}else{
				if(searchFDFYN == "Y"){
					param.searchGubun = "ringDataForEqpLink";
					flag = "linkData"
				}else{
					param.searchGubun = "ringDataForEqp";
					flag = "eqpData"
				}
			}
    	}

    	if(searchData == "ringData"){
    		$("#searchMapGis").show();
    		$("#acptTrk").show();
    		$("#acptLine").hide();
    	}else if(searchData == "trunkData"){
    		$("#searchMapGis").hide();
    		$("#acptLine").show();
    		$("#acptTrk").hide();
    	}else{
    		$("#searchMapGis").hide();
    		$("#acptLine").hide();
    		$("#acptTrk").hide();
    	}

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/intgE2ETopo', param, 'GET', flag);
    }
	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'eqpntwks') {
    		$('#'+gridId).alopexGrid('hideProgress');
    		if(response.ntwks.length > 0){
    			$('#'+gridId).alopexGrid('dataSet', response.ntwks);
    		}
//    		else {
//    			var eqpId = $("#eqpId").val();
//    			var param = {eqpId : eqpId};
//    			//$("input:radio[name=rdGubun][value='S']").prop("checked", true);
//    			$('#'+gridId).alopexGrid('showProgress');
//    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpsrvcs', param, 'GET', 'eqpsrvcs');
//    		}
    	}
    	if(flag == 'eqpsrvcs') {
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.srvcs);
    	}

    	if(flag == 'eqpports') {
    		$('#'+gridIdPort).alopexGrid('hideProgress');
    		$('#'+gridIdPort).alopexGrid('dataSet', response.ports);
    	}


    	if(flag == "addData"){

    		var groupNodeCnt = 0;
    		var ringNodeCnt = 0;
    		var groupLinkCnt = 0;
    		var ringLinkCnt = 0;
    		var strCnt = 0;
    		var addNodeCnt = 0;
    		var addLinkCnt = 0;

    		addNodeDataTemp.length = 0;
    		addLinkDataTemp.length = 0;
    		var locXS = parseInt(nodeDataArray[nodeDataArray.length - 1].loc.substring(0, nodeDataArray[nodeDataArray.length - 1].loc.indexOf(' ')));


    		testNode=[];
    		for(var i=0; i<response.nodeAddData.length; i++){
    			var resObj = response.nodeAddData[i];
    			var cnt = 0;
    			var locYS = Number(locY);

    			for(var j=0; j<nodeDataArray.length; j++){
    				if(nodeDataArray[j].eqpId == resObj.eqpId){
    					cnt++;
    				}
    			}

    			var nodeData;
				var src = null;
    			var cntA = 40;
    			var cntB = 80;

    			if(cnt == 0){

	    			if(resObj.mtsoTypCd == "1"){
	    				var cnt11 = 0;
	    				for(var j=0; j<nodeDataArray.length; j++){
	    					if(nodeDataArray[j].mtsoId == resObj.mtsoId){
	    						cnt11++;
	    					}
	    				}
	    				if(cnt11 == 0){

	    					nodeData = { key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(255,128,61,0.1)", isGroup: true, mtsoYn: "YES" };
    						myDiagram.model.addNodeData(nodeData);
	    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
	    					addNodeDataTemp[addNodeCnt++] = nodeData;
	    					linkData = { from: addKey, to: resObj.mtsoId, category: "subLink"};
	    					myDiagram.model.addLinkData(linkData);
	    				}
	    			}else if(resObj.mtsoTypCd == "2"){
	    				var cnt22 = 0;
	    				for(var j=0; j<nodeDataArray.length; j++){
	    					if(nodeDataArray[j].mtsoId == resObj.mtsoId){
	    						cnt22++;
	    					}
	    				}
	    				if(cnt22 == 0){

	    					nodeData = { key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,255,0.1)", isGroup: true, mtsoYn: "YES" };
    						myDiagram.model.addNodeData(nodeData);
	    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
	    					addNodeDataTemp[addNodeCnt++] = nodeData;
	    					linkData = { from: addKey, to: resObj.mtsoId, category: "subLink"};
	    					myDiagram.model.addLinkData(linkData);
	    				}
	    			}else if(resObj.mtsoTypCd == "3"){
	    				var cnt33 = 0;
	    				for(var j=0; j<nodeDataArray.length; j++){
	    					if(nodeDataArray[j].mtsoId == resObj.mtsoId){
	    						cnt33++;
	    					}
	    				}
	    				if(cnt33 == 0){
	    					nodeData = { key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,0,0.1)", isGroup: true, mtsoYn: "YES" };
    						myDiagram.model.addNodeData(nodeData);
	    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
	    					addNodeDataTemp[addNodeCnt++] = nodeData;
	    					linkData = { from: addKey, to: resObj.mtsoId, category: "subLink"};
	    					myDiagram.model.addLinkData(linkData);
	    				}

	    			}else if(resObj.mtsoTypCd == "4"){
	    				var cnt44 = 0;
	    				for(var j=0; j<nodeDataArray.length; j++){
	    					if(nodeDataArray[j].mtsoId == resObj.mtsoId){
	    						cnt44++;
	    					}
	    				}
	    				if(cnt44 == 0){
	    					nodeData = { key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(187,187,0,0.1)", isGroup: true, mtsoYn: "YES" };
    						myDiagram.model.addNodeData(nodeData);
	    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
	    					addNodeDataTemp[addNodeCnt++] = nodeData;
	    					linkData = { from: addKey, to: resObj.mtsoId, category: "subLink"};
	    					myDiagram.model.addLinkData(linkData);
	    				}
	    			}else if(resObj.mtsoTypCd == "9"){
	    				var cnt99 = 0;
	    				for(var j=0; j<nodeDataArray.length; j++){
	    					if(nodeDataArray[j].mtsoId == resObj.mtsoId){
	    						cnt99++;
	    					}
	    				}
	    				if(cnt99 == 0){
	//    					cntT--;
	    					nodeData = { key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,0,0,0.1)", isGroup: true, mtsoYn: "YES" };
    						myDiagram.model.addNodeData(nodeData);
	    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
	    					addNodeDataTemp[addNodeCnt++] = nodeData;
	    					linkData = { from: addKey, to: resObj.mtsoId, category: "subLink"};
	    					myDiagram.model.addLinkData(linkData);
	    				}
	    			}

					if(strCnt > 0){ // 첫 좌표는 (0,0)으로 준다.
						//국사 그룹의 첫 데이타
						if((nodeDataArray[nodeDataArray.length-2].category != "newTypGroup" && nodeDataArray[nodeDataArray.length-1].category == "newGroup") || nodeDataArray[nodeDataArray.length-1].name == "RING"){
							cntA = 120;
							cntB = 160;
						//국사타입 그룹의 첫 데이타
						}else if(nodeDataArray[nodeDataArray.length-2].category == "newTypGroup" && nodeDataArray[nodeDataArray.length-1].category == "newGroup"){
							cntA = 120;
							cntB = 210;
						}
						for(var j=0; j<nodeDataArray.length; j++){
							if(nodeDataArray[(nodeDataArray.length-1)-j].isGroup != true && nodeDataArray[(nodeDataArray.length-1)-j].category != "newTypGroup" && nodeDataArray[(nodeDataArray.length-1)-j].category != "newGroup"){
								testNode.unshift(nodeDataArray[nodeDataArray.length-1-j].loc);
								break;
							}

						}
						for(var j=0; j<testNode.length; j++){
							testNode[j] = locXS + " " + ( parseInt(testNode[j].substring(testNode[j].indexOf(' '))) - cntA );
						}
	    			}else{
	    				if(resObj.eqpNm.length > 25){
	    					locXS = locXS + 400;
	    				}else{
	    					locXS = locXS + 310;  // Y값은 유지되어 남아있다.
	    				}
	    			}

					if(testNode.length > 0){
						resObj.loc = locXS + " " + ( parseInt(testNode[0].substring(testNode[0].indexOf(' '))) + cntB );
					}else{
						resObj.loc = locXS + " " + locYS;
					}

					var aa = 0;
					var h=0;
					for(var k=0; k<testNode.length; k++){
						h=aa;
						for(h; h<nodeDataArray.length; h++){
							if(nodeDataArray[(nodeDataArray.length-1)-h].isGroup == true || nodeDataArray[(nodeDataArray.length-1)-h].category == "newTypGroup" || nodeDataArray[(nodeDataArray.length-1)-h].category == "newGroup"){
								aa++;
							}else{
								myDiagram.model.setDataProperty(nodeDataArray[(nodeDataArray.length-1)-h], "loc", testNode[k]);
								aa++;
								break;
							}
						}
					}

					//장비 타입 별 장비 아이콘
					src = getEqpIcon(resObj.eqpRoleDivCd, "");

					//그룹에서 만든 노드가 아닐경우
					if(!groupYn){
	    				if(resObj.eqpSctnDivCd == "22"){
	    					for(var j=0; j<nodeDataArray.length; j++){
			    				if(nodeDataArray[j].key == resObj.eqpId.replace("DV","RN")){
			    					ringNodeCnt++;
			    				}
			    			}
	    						nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, eqpId: resObj.eqpId, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: resObj.mtsoId};
	    						myDiagram.model.addNodeData(nodeData);
	    						addNodeDataTemp[addNodeCnt++] = nodeData;
	    				}else{
							nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, eqpId: resObj.eqpId, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: resObj.mtsoId};
    						myDiagram.model.addNodeData(nodeData);
    						addNodeDataTemp[addNodeCnt++] = nodeData;
	    				}
					}else{
							nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, eqpId: resObj.eqpId, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: resObj.mtsoId};
    						myDiagram.model.addNodeData(nodeData);
    						addNodeDataTemp[addNodeCnt++] = nodeData;
					}

					//첫 데이타임을 확인하기 위해
					strCnt++;
				}
    		}

			for(var i=0; i<response.linkAddData.length; i++){
				var resObj = response.linkAddData[i];
				var cnt = 0;
				var textData = "";
    			var toTextData = "";
    			var centerTextData = "";
    			var portCapaNm = "없음";

				textData = resObj.lftPortNm;
				toTextData = resObj.rghtPortNm;

				if(resObj.portCapaNm != undefined){portCapaNm = resObj.portCapaNm}
				centerTextData = (i+1) + " [" + portCapaNm + "]";

				for(var j=0; j<linkDataArray.length; j++){
					if(((linkDataArray[j].lftEqpId == resObj.lftEqpId && linkDataArray[j].rghtEqpId == resObj.rghtEqpId) ||
						(linkDataArray[j].rghtEqpId == resObj.rghtEqpId && linkDataArray[j].lftEqpId == resObj.lftEqpId)) &&
						resObj.eqpSctnDivCd != "23" && resObj.eqpSctnDivCd != "24"){
						cnt++;
					}
				}

				if(cnt == 0){
					var linkData;

					if(!groupYn){
						if(resObj.eqpSctnDivCd == "23" || resObj.eqpSctnDivCd == "24" || resObj.eqpSctnDivCd == "25"){
							linkData = { eqpSctnId: resObj.eqpSctnId, from: addKey, lftEqpId: resObj.lftEqpId, lftEqpNm: resObj.lftEqpNm, to: resObj.rghtEqpId, rghtEqpId: resObj.rghtEqpId, rghtEqpNm: resObj.rghtEqpNm, lftVal: resObj.lftMtsoLngVal+","+resObj.lftMtsoLatVal, rghtVal: resObj.rghtMtsoLngVal+","+resObj.rghtMtsoLatVal, text: textData, toText: toTextData, centerText: centerTextData, seq: i+1, portCapaNm: resObj.portCapaNm,trkVisible: false, ringVisible: false, wdmVisible: false, lineVisible: false, curve: go.Link.Bezier, curviness: 30 };
    						myDiagram.model.addLinkData(linkData);
    						addLinkDataTemp[addLinkCnt++] = linkData;
	    				}else{
	    					linkData = { eqpSctnId: resObj.eqpSctnId, from: addKey, lftEqpId: resObj.lftEqpId, lftEqpNm: resObj.lftEqpNm, to: resObj.rghtEqpId, rghtEqpId: resObj.rghtEqpId, rghtEqpNm: resObj.rghtEqpNm, lftVal: resObj.lftMtsoLngVal+","+resObj.lftMtsoLatVal, rghtVal: resObj.rghtMtsoLngVal+","+resObj.rghtMtsoLatVal, text: textData, toText: toTextData, centerText: centerTextData, seq: i+1, portCapaNm: resObj.portCapaNm,trkVisible: false, ringVisible: false, wdmVisible: false, lineVisible: false, curviness: 0 };
	    					myDiagram.model.addLinkData(linkData);
	    					addLinkDataTemp[addLinkCnt++] = linkData;
	    				}
					}else{
						if(resObj.eqpSctnDivCd == "06" || resObj.eqpSctnDivCd == "08"){
							linkData = { eqpSctnId: resObj.eqpSctnId, from: addKey, lftEqpId: resObj.lftEqpId, lftEqpNm: resObj.lftEqpNm, to: resObj.rghtEqpId, rghtEqpId: resObj.rghtEqpId, rghtEqpNm: resObj.rghtEqpNm, lftVal: resObj.lftMtsoLngVal+","+resObj.lftMtsoLatVal, rghtVal: resObj.rghtMtsoLngVal+","+resObj.rghtMtsoLatVal, text: textData, toText: toTextData, centerText: centerTextData, seq: i+1, portCapaNm: resObj.portCapaNm,trkVisible: false, ringVisible: false, wdmVisible: false, lineVisible: false, curviness: 0 };
    						myDiagram.model.removeLinkData(linkData);
						}
					}
				}
			}

			if (response.linkAddData.length == 0) {
				nodeTemp.findObject('TREEBUTTON').visible = false;
	        }

			$('body').progress().remove();
    	}



    	if(flag == "addLowEqpList"){
    		var $this = $('#menuContainer');
            if ($this.hasClass('open')) {
				$this.animate ({
					right : 0
				}, 300).removeClass('open');
			}
            if(response.lowEqpData.length > 0){
            	lowEqpParam = response.lowEqpData;
            	var testObj = {rghtEqpNm:"전체",rghtEqpId:"ALL"};
            	lowEqpParam.unshift(testObj);
            	$('#menuListGrid').alopexGrid('dataSet', lowEqpParam, "");
            }else{
            	$('#menuListGrid').alopexGrid("dataEmpty");
            }
            $('#menuListGrid').alopexGrid('hideProgress');
		}


    	if(flag == "mtsoData"){
    		if(response.sctnData.length == 0){
    			$('body').progress().remove();
    			myDiagram.clear();//토폴로지 화면 초기화
    			callMsgBox('','I', "검색 결과가 없습니다.", function(msgId, msgRst){
    				nodeDataArray = [];
    	    		linkDataArray = [];
    			});
	 	     	return;
    		}

    		sctnresponse = sctnMtsoDataParsing(response.sctnData);

    		nodeDataArray = [];
    		linkDataArray = [];

    		var groupNodeCnt = 0;
    		var ringNodeCnt = 0;
    		var groupLinkCnt = 0;
    		var ringLinkCnt = 0;
    		var nodeData = null;
    		var linkData = null;
    		var locXS = 0;

    		nodeData = sctnresponse.nodeData;
    		linkData = sctnresponse.linkData;

    		for(var i=0; i<nodeData.length; i++){
    			var resObj = nodeData[i];
    			var everexpand = false;
    			var src = null;
    			var locYS = 0;

    			if(resObj.mtsoTypCd == "1"){
    				if(cnt1 == 0){
    					cnt1++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "전송실", category: "newTypGroup", color: "rgba(255,128,61,0.2)", isGroup: true });
    				}
    			}else if(resObj.mtsoTypCd == "2"){
    				if(cnt2 == 0){
    					cnt2++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "중심국", category: "newTypGroup", color: "rgba(0,128,255,0.2)", isGroup: true });
    				}
    			}else if(resObj.mtsoTypCd == "3"){
    				if(cnt3 == 0){
    					cnt3++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "기지국", category: "newTypGroup", color: "rgba(0,128,0,0.2)", isGroup: true });
    				}

    			}else if(resObj.mtsoTypCd == "4"){
    				if(cnt4 == 0){
    					cnt4++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "국소", category: "newTypGroup", color: "rgba(187,187,0,0.2)", isGroup: true });
    				}
    			}else if(resObj.mtsoTypCd == "9"){
    				if(cnt9 == 0){
    					cnt9++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "미매핑국사", category: "newTypGroup", color: "rgba(0,0,0,0.2)", isGroup: true });
    				}
    			}

//    			if(i > 0){
//    				if(linkData[0].lftMtsoId == linkData[linkData.length-1].rghtMtsoId){
    				if (searchData == "ringData"){
//    					if(i == 1){
//    						locYS = locYS - 60;
//    					}
//    					if(i == linkData.length-1){
//    						locYS = locYS + 60;
//    					}
    					locXS = Math.cos(Math.PI/180 * (360/nodeData.length*i-180)) * 250;
						locYS = Math.sin(Math.PI/180 * (360/nodeData.length*i-180)) * 200;
    				}else if (searchData == "serviceLineData"){
    					locXS = locXS + 200;

    					if (svlnSclCdParam != "016" && svlnSclCdParam != "103") {
    						if      (resObj.mtsoTypCd == "1") {locYS = -200;}
    						else if (resObj.mtsoTypCd == "2") {locYS = -50;}
    						else if (resObj.mtsoTypCd == "3") {locYS =  100;}
    						else if (resObj.mtsoTypCd == "4") {
								if(mgmtGrpCdParam == "0002"){
									locYS =  100;
								}else{
									locYS =  250;
								}
							}
    						else                              {locYS =  400;};
    					}
    				}else{
    					locXS = locXS + 200;
    				}
//    			}
				resObj.loc = locXS + " " + locYS;

				//국사 아이콘
				src = getMtsoIcon(resObj.mtsoTypCd, "");

					var cnt = 0;
	    			for(var j=0; j<nodeDataArray.length; j++){
	    				if(nodeDataArray[j].key == resObj.mtsoId){
	    					cnt++;
	    				}
	    			}
	    			if(cnt == 0){
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId:resObj.mtsoId, lineSctnLnoSrno: resObj.lineSctnLnoSrno, mtsoTypCd: resObj.mtsoTypCd, category: "nodeData1", source: src, loc: resObj.loc, everExpanded: true, group: resObj.mtsoTypCd, mtsoYn: "YES"});
    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
	    			}
//				}
    		}

    		for(var i=0; i<linkData.length; i++){
    			var resObj = linkData[i];
    			var cnt = 0;
    			for(var j=0; j<linkDataArray.length; j++){
    				if(((linkDataArray[j].from == resObj.lftMtsoId && linkDataArray[j].to == resObj.rghtMtsoId) ||
    					(linkDataArray[j].from == resObj.rghtMtsoId && linkDataArray[j].to == resObj.lftMtsoId))){
    					cnt++;
    				}
    			}
    			if(cnt == 0){
    			linkDataArray.push({ from: resObj.lftMtsoId, to: resObj.rghtMtsoId, lftVal: resObj.lftVal, rghtVal: resObj.rghtVal, curviness: 0, category: "mtsoLink" });
    			}
    		}
        	myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

            $('body').progress().remove();
    	}

    	//장비조회, 링크조회
    	if(flag == "eqpData" || flag == "linkData"){

    		if(response.sctnData.length == 0){
    			$('body').progress().remove();
    			myDiagram.clear();//토폴로지 화면 초기화
    			callMsgBox('','I', "검색 결과가 없습니다.", function(msgId, msgRst){
    				nodeDataArray = [];
    	    		linkDataArray = [];
    			});
	 	     	return;
    		}

    		sctnresponse = sctnDataParsing(response.sctnData);

    		nodeDataArray = [];
    		linkDataArray = [];

    		var groupNodeCnt = 0;
    		var ringNodeCnt = 0;
    		var groupLinkCnt = 0;
    		var ringLinkCnt = 0;
    		var nodeData = null;
    		var linkData = null;
    		var locXS = 0;
    		var lftXCnt = 0;

   			nodeData = sctnresponse.nodeData;
   			linkData = sctnresponse.linkData;

   			var mtsoTypCnt1 = 0;
			var mtsoTypCnt2 = 0;
			var mtsoTypCnt3 = 0;
			var mtsoTypCnt4 = 0;

			//국사 타입에 따라 높이를 조절하기 위해 해당 국사 타입이 존재 하는지 확인
			for(var h=0; h<nodeData.length; h++){
				if(nodeData[h].mtsoTypCd == "1" && mtsoTypCnt1 == 0){
					mtsoTypCnt1++;
				}else if(nodeData[h].mtsoTypCd == "2" && mtsoTypCnt2 == 0){
					mtsoTypCnt2++;
				}else if(nodeData[h].mtsoTypCd == "3" && mtsoTypCnt3 == 0){
					mtsoTypCnt3++;
				}else if(nodeData[h].mtsoTypCd == "4" && mtsoTypCnt4 == 0){
					mtsoTypCnt4++;
				}
			}

			var intgGroupKey = "";
    		for(var i=0; i<nodeData.length; i++){
    			var resObj = nodeData[i];
    			var everexpand = false;
    			var src = null;
    			var locYS = 0;
    			var cntA = 40;
    			var cntB = 80;

    			if($.trim(resObj.intgMtsoId) != ""){

    				for(var j=0; j<dupIntgMtsoId.length; j++){
    					if(dupIntgMtsoId[j] == resObj.intgMtsoId){
    						cntIntg++;
    					}
    				}
    				if(cntIntg == 0){
    					intgGroupKey = resObj.intgMtsoId+"*_*1";
    					nodeDataArray.push({ key: intgGroupKey, name: resObj.intgMtsoNm, mtsoId: resObj.intgMtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "topGroup", color: "rgba(204,153,255,0.5)", isGroup: true, mtsoYn: "YES" });
    					dupIntgMtsoId[dupIntgMtsoId.length] = resObj.intgMtsoId;
    				}
    			}
    			if(resObj.mtsoTypCd == "1"){
    				var cnt11 = 0;
    				for(var j=0; j<dupMtsoId.length; j++){
    					if(dupMtsoId[j] == resObj.mtsoId){
    						cnt11++;
    					}
    				}
    				if(cnt11 == 0){
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(255,128,61,0.1)", isGroup: true, mtsoYn: "YES" });
    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
    				}
    			}else if(resObj.mtsoTypCd == "2"){
    				var cnt22 = 0;
    				for(var j=0; j<dupMtsoId.length; j++){
    					if(dupMtsoId[j] == resObj.mtsoId){
    						cnt22++;
    					}
    				}
    				if(cnt22 == 0){
    					if(intgGroupKey == resObj.intgMtsoId+"*_*1"){
    						nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,255,0.1)", isGroup: true, mtsoYn: "YES", group : intgGroupKey});
    					}else{
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,255,0.1)", isGroup: true, mtsoYn: "YES" });
    					}
    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
    				}
    			}else if(resObj.mtsoTypCd == "3"){
    				var cnt33 = 0;
    				for(var j=0; j<dupMtsoId.length; j++){
    					if(dupMtsoId[j] == resObj.mtsoId){
    						cnt33++;
    					}
    				}
    				if(cnt33 == 0){
    					if(intgGroupKey == resObj.intgMtsoId+"*_*1"){
    						nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,0,0.1)", isGroup: true, mtsoYn: "YES", group : intgGroupKey});
    					}else{
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,0,0.1)", isGroup: true, mtsoYn: "YES" });
    					}
    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
    				}

    			}else if(resObj.mtsoTypCd == "4"){
    				var cnt44 = 0;
    				for(var j=0; j<dupMtsoId.length; j++){
    					if(dupMtsoId[j] == resObj.mtsoId){
    						cnt44++;
    					}
    				}
    				if(cnt44 == 0){
    					if(intgGroupKey == resObj.intgMtsoId+"*_*1"){
    						nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(187,187,0,0.1)", isGroup: true, mtsoYn: "YES", group : intgGroupKey});
    					}else{
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(187,187,0,0.1)", isGroup: true, mtsoYn: "YES" });
    					}
    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
    				}
    			}else if(resObj.mtsoTypCd == "9"){
    				var cnt99 = 0;
    				for(var j=0; j<dupMtsoId.length; j++){
    					if(dupMtsoId[j] == resObj.mtsoId){
    						cnt99++;
    					}
    				}
    				if(cnt99 == 0){
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,0,0,0.1)", isGroup: true, mtsoYn: "YES" });
    					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
    				}
    			}

					// 링 데이터 일 때
					if (searchData == "ringData") {
						if (nodeData.length/20 > 1) {
							locXS = Math.cos(Math.PI/180 * (360/nodeData.length*i-180)) * 650 * (nodeData.length/20);
							locYS = Math.sin(Math.PI/180 * (360/nodeData.length*i-180)) * 350 * (nodeData.length/20);
						} else {
							locXS = Math.cos(Math.PI/180 * (360/nodeData.length*i-180)) * 650;
							locYS = Math.sin(Math.PI/180 * (360/nodeData.length*i-180)) * 250;
						};
					}
					// 서비스 회선
					else if (searchData == "serviceLineData") {
						// 서비스회선 소분류코드
						var searchSvlnSclCd = linkData[0].svlnSclCd;
						// 자동 회선일 때 016:LTE, 103:RU회선
						if (searchSvlnSclCd == "016" || searchSvlnSclCd == "103") {
							var chkX = "";
							var chkY = "";
							for(var j=0; j<nodeDataArray.length; j++){
								if (nodeDataArray[j].shortNm == resObj.shortNm && nodeDataArray[j].group == resObj.mtsoId && resObj.eqpNm != "DUMMY") {
									chkX = nodeDataArray[j].loc.substring(0, nodeDataArray[j].loc.indexOf(' '));
									chkY = nodeDataArray[j].loc.substring(   nodeDataArray[j].loc.indexOf(' ')+1);
									break;
								}
							}
							if (chkX != ""){
								locXS = chkX;
								locYS = parseInt(chkY) + 100;
							} else {
								locXS = -400 + (lftXCnt * 250) ;
								locYS = -200;
								lftXCnt++
							}
						}
						// 자동 회선이 아닐 때
						else {
							var chkX = "";
							var chkY = "";
							for(var j=0; j<nodeDataArray.length; j++){
								if (nodeDataArray[j].shortNm == resObj.shortNm && nodeDataArray[j].group == resObj.mtsoId && resObj.eqpNm != "DUMMY") {
									chkX = nodeDataArray[j].loc.substring(0, nodeDataArray[j].loc.indexOf(' '));
									chkY = nodeDataArray[j].loc.substring(   nodeDataArray[j].loc.indexOf(' ')+1);
									break;
								}
							}
							if (chkX != ""){
								locXS = chkX;
								locYS = parseInt(chkY) + 100;
							} else {
								locXS = -400 + (lftXCnt * 250) ;
								lftXCnt++;

								var mtsoTypSum1 = mtsoTypCnt1 + mtsoTypCnt2;
								var mtsoTypSum2 = mtsoTypCnt1 + mtsoTypCnt2 + mtsoTypCnt3;
								var mtsoTypSum3 = mtsoTypCnt1 + mtsoTypCnt2 + mtsoTypCnt3 + mtsoTypCnt4;

								if(resObj.mtsoTypCd == "1") {
									locYS = -500;
								}else if(resObj.mtsoTypCd == "2") {
									if(mtsoTypCnt1 > 0)	{locYS = -200;}
									else				{locYS = -500;}
								}else if(resObj.mtsoTypCd == "3") {
									if(mtsoTypSum1 == 0)		{locYS = -500;}
									else if(mtsoTypSum1 == 1)	{locYS = -200;}
									else						{locYS =  100;}
								}else if(resObj.mtsoTypCd == "4") {
									if(mgmtGrpCdParam == "0002"){
										locYS =  100;
									}else{
										if(mtsoTypSum2 == 0)	{locYS = -500;}
										else if(mtsoTypSum2 == 1){locYS = -200;}
										else if(mtsoTypSum2 == 2){locYS =  100;}
										else					{locYS =  400;}
									}
								}else{//DUMMY
									if(mtsoTypSum3 == 1){locYS =  -500;}
									else				{locYS =  -700;}
								}
							}
						}
						//장비 조회
					}else if (searchData == "eqpData") {
						var chkX = "";
						var chkY = "";
						for(var j=nodeDataArray.length-1; j>-1; j--){
							if (nodeDataArray[j].eqpRoleDivCd == resObj.eqpRoleDivCd) {
								chkX = nodeDataArray[j].loc.substring(0, nodeDataArray[j].loc.indexOf(' '));
								chkY = nodeDataArray[j].loc.substring(   nodeDataArray[j].loc.indexOf(' ')+1);
								if(nodeDataArray[j].group == resObj.mtsoId){
									locXS = chkX;
									locYS = parseInt(chkY) + 100;
								}else{
									var chkM = "";
									for(var h=0; h<nodeDataArray.length; h++){
										if(nodeDataArray[h].group == resObj.mtsoId){
											chkY = nodeDataArray[h].loc.substring(   nodeDataArray[h].loc.indexOf(' ')+1);
											chkM = "Y";
											break;
										}
									}
									locXS = chkX;
									if(chkM == "Y"){
										locYS = parseInt(chkY);
									}else{
										locYS = parseInt(chkY) + 160;
									}
								}
								break;
							}
						}
//						if (chkX != ""){
//							locXS = chkX;
//							locYS = parseInt(chkY) + 100;
//						} else {
						if (chkX == ""){
							locXS = -400 + (lftXCnt * 250) ;
							locYS = -200;
							lftXCnt++
						}
					} else {
						var chkX = "";
						var chkY = "";
						for(var j=0; j<nodeDataArray.length; j++){
							if (nodeDataArray[j].shortNm == resObj.shortNm && nodeDataArray[j].group == resObj.mtsoId) {
								chkX = nodeDataArray[j].loc.substring(0, nodeDataArray[j].loc.indexOf(' '));
								chkY = nodeDataArray[j].loc.substring(   nodeDataArray[j].loc.indexOf(' ')+1);
								break;
							};
						};
						if (chkX != ""){
							locXS = chkX;
							locYS = parseInt(chkY) + 100;
						} else {
							locXS = -400 + (lftXCnt * 250) ;
							locYS = -200;
							lftXCnt++
						};
					}

					resObj.loc = locXS + " " + locYS;

					//장비 타입 별 장비 아이콘
					src = getEqpIcon(resObj.eqpRoleDivCd, "");

					//FDF계열, COUPLER는 노드 버튼 삭제
					var btnVisible = true;
					if(resObj.eqpRoleDivCd == "11" || resObj.eqpRoleDivCd == "177" || resObj.eqpRoleDivCd == "178" || resObj.eqpRoleDivCd == "181" || resObj.eqpRoleDivCd == "182"){
						btnVisible = false;
					}

					var cnt = 0;
	    			for(var j=0; j<nodeDataArray.length; j++){
	    				if(nodeDataArray[j].eqpId == resObj.eqpId){
	    					cnt++;
	    				}
	    			}
	    			if(cnt == 0 && searchData != "ringData"){
	    				nodeDataArray.push({ key: resObj.nodekey, eqpId: resObj.eqpId, name: resObj.eqpNm, shortNm: resObj.shortNm, lineSctnLnoSrno: resObj.lineSctnLnoSrno, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, category: "nodeData2", source: src, loc: resObj.loc, everExpanded: false, isTreeExpanded: true, group: resObj.mtsoId, btnVisible: btnVisible});
	    			}else{
	    				nodeDataArray.push({ key: resObj.nodekey, eqpId: resObj.eqpId, name: resObj.eqpNm, shortNm: resObj.shortNm, lineSctnLnoSrno: resObj.lineSctnLnoSrno, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, category: "nodeData2", source: src, loc: resObj.loc, everExpanded: false, isTreeExpanded: true, group: resObj.mtsoId, btnVisible: btnVisible});
	    			}
    		}

    		for(var i=0; i<linkData.length; i++){
    			var resObj = linkData[i];
    			var cnt = 0;
    			var textData = "";
    			var toTextData = "";
    			var centerTextData = "";
    			var portCapaNm = "없음";

    			var centerTrkText = "";
    			var centerRingText = "";
    			var centerWdmText = "";
    			var segmentOffsetTrk = "";
    			var segmentOffsetRing = "";
    			var segmentOffsetWdm = "";
    			var trkNm = "";
    			var ringNm = "";
    			var wdmNm = "";
    			var trkVisible = false;
    			var ringVisible = false;
    			var wdmVisible = false;
    			var lineVisible = false;

				if(resObj.trkNm != " " && resObj.trkNm != undefined){	//트렁크 정보가 있으면 링크 우클릭시 트렁크시각화편집 버튼을 보여준다.
					if(resObj.trkNm.length > 15){
						centerTrkText = resObj.trkNm.substring(0, 15)+"...";
					}else{
						centerTrkText = resObj.trkNm;
					}
					trkNm = resObj.trkNm;	//툴팁에 표시할 데이타
					segmentOffsetTrk = new go.Point(0, 10);
					trkVisible = true;
				}
				if(resObj.ringNm != " " && resObj.ringNm != undefined){	//링 정보가 있으면 링크 우클릭시 링시각화편집 버튼을 보여준다.
					if(resObj.ringNm.length > 15){
						centerRingText = resObj.ringNm.substring(0, 15)+"...";
					}else{
						centerRingText = resObj.ringNm;
					}
					ringNm = resObj.ringNm;	//툴팁에 표시할 데이타
					if(centerTrkText == ""){
						segmentOffsetRing = new go.Point(0, 10);
					}else{
						segmentOffsetRing = new go.Point(0, 20);
					}
					ringVisible = true;
				}
				if(resObj.wdmNm != " " && resObj.wdmNm != undefined){	//WDM트렁크 정보가 있으면 링크 우클릭시 WDM트렁크시각화편집 버튼을 보여준다.
					if(resObj.wdmNm.length > 15){
						centerWdmText = resObj.wdmNm.substring(0, 15)+"...";
					}else{
						centerWdmText = resObj.wdmNm;
					}
					wdmNm = resObj.wdmNm;	//툴팁에 표시할 데이타
					if(centerTrkText == "" && centerRingText == ""){
						segmentOffsetWdm = new go.Point(0, 10);
					}else if(centerTrkText == "" || centerRingText == ""){
						segmentOffsetWdm = new go.Point(0, 20);
					}else{
						segmentOffsetWdm = new go.Point(0, 30);
					}
					wdmVisible = true;
				}

    			//FDF계열은 링크 우클릭 시 선로조회 버튼을 보여준다.
    			if((resObj.lftEqpRoleDivCd == "11" || resObj.lftEqpRoleDivCd == "177" || resObj.lftEqpRoleDivCd == "178" || resObj.lftEqpRoleDivCd == "182") && (resObj.rghtEqpRoleDivCd == "11" || resObj.rghtEqpRoleDivCd == "177" || resObj.rghtEqpRoleDivCd == "178" || resObj.rghtEqpRoleDivCd == "182")){
    				lineVisible = true;
    			}

				textData = resObj.lftPortNm;
				toTextData = resObj.rghtPortNm;

				if(resObj.portCapaNm != undefined){portCapaNm = resObj.portCapaNm}
				centerTextData = (i+1) + " [" + portCapaNm + "]";

    			for(var j=0; j<linkDataArray.length; j++){
    				if(((linkDataArray[j].from == resObj.frkey && linkDataArray[j].to == resObj.tokey) ||
    					  (linkDataArray[j].from == resObj.tokey && linkDataArray[j].to == resObj.frkey))){
    					cnt++;
    				}
    			}
    			if(cnt == 0){
    				linkDataArray.push({ from: resObj.frkey, lftEqpId: resObj.lftEqpId, lftEqpNm: resObj.lftEqpNm, to: resObj.tokey, rghtEqpId: resObj.rghtEqpId, rghtEqpNm: resObj.rghtEqpNm, lftVal: resObj.lftMtsoLngVal+","+resObj.lftMtsoLatVal, rghtVal: resObj.rghtMtsoLngVal+","+resObj.rghtMtsoLatVal, eqpSctnId: resObj.eqpSctnId, text: textData, toText: toTextData, centerText: centerTextData, centerTrkText: centerTrkText, segmentOffsetTrk: segmentOffsetTrk, centerRingText: centerRingText, segmentOffsetRing: segmentOffsetRing, centerWdmText: centerWdmText, segmentOffsetWdm: segmentOffsetWdm, trkNm: trkNm, trkNtwkLineNo: resObj.trkNtwkLineNo, trkNtwkLnoGrpSrno: resObj.trkNtwkLnoGrpSrno, trkTopoLclCd: resObj.trkTopoLclCd, trkTopoSclCd: resObj.trkTopoSclCd, trkVisible: trkVisible, ringNm: ringNm, ringNtwkLineNo: resObj.ringNtwkLineNo, ringNtwkLnoGrpSrno: resObj.ringNtwkLnoGrpSrno, ringTopoLclCd: resObj.ringTopoLclCd, ringTopoSclCd: resObj.ringTopoSclCd, ringVisible: ringVisible, wdmNm: wdmNm, wdmTrkNtwkLineNo: resObj.wdmTrkNtwkLineNo, wdmTrkNtwkLnoGrpSrno: resObj.wdmTrkNtwkLnoGrpSrno, wdmTrkTopoLclCd: resObj.wdmTrkTopoLclCd, wdmTrkTopoSclCd: resObj.wdmTrkTopoSclCd, wdmVisible: wdmVisible, lineVisible: lineVisible, seq: i+1, portCapaNm: resObj.portCapaNm, mtsoVrfRslt: resObj.mtsoVrfRslt, mtsoVrfDesc: resObj.mtsoVrfDesc, curviness: 0 });
    			}
    		}

        	myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

        	//포트 표시 여부
			viewPort();
			//링/트렁크 표시 여부
			viewNtwk();

            $('body').progress().remove();

    	}







































    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    }


    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }



    function sctnDataParsing(sctnData){
		// 같은 계위의 이중화 장비명을 같이 배열하기 위해서
		var getshortname = function (longname) {
				var shortname = longname;
 				if (longname.lastIndexOf('-') > 0) {
 					shortname = longname.substring(0, longname.lastIndexOf('-'))
 				} else if (longname.lastIndexOf('_') > 0) {
 					shortname = longname.substring(0, longname.lastIndexOf('_'))
 				} else {
 					shortname = longname
 				};
 				return shortname;
		}

		// 같은 장비가 있는지 체크
		var getdupeqpcheck = function (nodeData, chkEqpId, chkYN) {
			if (!chkYN) {return "";};

			for(var i=0; i<nodeData.length; i++){
				if (nodeData[i].eqpId == chkEqpId) {
					return nodeData[i].nodekey;
				};
			};
			return "";
		}

		var sctnresponse = {nodeData:null, linkData:null};
		var nodecnt = 0;
		var linkcnt = 0;
		var preveqpid = "";
		var nodedata = [];
		var linkdata = [];
		var frkey = "";
		var tokey = "";

		//망종류가 IBS링, IBN_L3SW링, IBRR링인 것을 제외한 나머지 링조회는 노드 중복 체크를 하지 않는다.
		var dupchk = !(searchData == "ringData" && sctnData[0].topoSclCd != "011" && sctnData[0].topoSclCd != "012" && sctnData[0].topoSclCd != "015");

		for(var i=0; i<sctnData.length; i++){
			//if(!(searchData == "serviceLineData" && (sctnData[i].lftEqpNm == "DUMMY" || sctnData[i].rghtEqpNm == "DUMMY"))){ // 서비스회선 조회 시 DUMMY장비는 제외
			if(!((searchData == "serviceLineData" || searchData == "trunkData") && i==0 && sctnData[i].lftEqpNm == "DUMMY")){
				// 중복 체크하는 경우는 기존 key 사용
				var dupkey = getdupeqpcheck(nodedata, sctnData[i].lftEqpId, dupchk);
				if (dupkey != "" && !(searchData == "serviceLineData" && sctnData[i].lftEqpNm == "DUMMY")) {// 서비스회선 조회 시 DUMMY장비는 제외
					frkey = dupkey;
					// 첫번째 행이거나 이전 추가된 장비와 left 장비가 같지 않으면 left 장비도 추가
				} else if (preveqpid == "" || preveqpid != sctnData[i].lftEqpId) {
					// 장비가 중복으로 보이는 경우 처리를 위해서 키를 장비ID + 선번일련번호로 생성
					frkey = sctnData[i].lftEqpId + "*_*" + sctnData[i].sctnLnoSrno;
					shortname = getshortname(sctnData[i].lftEqpNm);

					with (sctnData[i]) {
						nodedata[nodecnt++] = {nodekey:frkey, mtsoId:lftMtsoId,mtsoNm:lftMtsoNm,mtsoTypCd:lftMtsoTypCd,eqpId:lftEqpId,eqpNm:lftEqpNm,shortNm:shortname,eqpRoleDivCd:lftEqpRoleDivCd,eqpRoleDivNm:lftEqpRoleDivNm,lineSctnLnoSrno:lftLineSctnLnoSrno,mgmtGrpNm:mgmtGrpNm,source:"",loc:"", eqpMdlId : lftEqpMdlId, eqpMdlNm : lftEqpMdlNm, lftIntgMtsoId : lftIntgMtsoId, lftIntgMtsoNm : lftIntgMtsoNm, rghtIntgMtsoId : rghtIntgMtsoId, rghtIntgMtsoNm : rghtIntgMtsoNm, intgMtsoId : lftIntgMtsoId, intgMtsoNm : lftIntgMtsoNm};
					};
					preveqpid = sctnData[i].lftEqpId;
				}
				else {
					frkey = tokey;
				}
			}

			if(!((searchData == "serviceLineData" || searchData == "trunkData") && i==sctnData.length-1 && sctnData[i].rghtEqpNm == "DUMMY")){
				// 마지막 라인이고 첫번째 left 장비와 마지막 right 장비 중복 발생 제거
				if (i>0 && i==sctnData.length-1 && nodedata[0].eqpId == sctnData[i].rghtEqpId) {
					tokey = nodedata[0].nodekey;
				} else {
					var dupkey = getdupeqpcheck(nodedata, sctnData[i].rghtEqpId, dupchk);
					if (dupkey != "" && !(searchData == "serviceLineData" && sctnData[i].rghtEqpNm == "DUMMY")) {// 서비스회선 조회 시 DUMMY장비는 제외
						tokey = dupkey;
					} else {
						tokey = sctnData[i].rghtEqpId + "*_*" + sctnData[i].sctnLnoSrno;
						shortname = getshortname(sctnData[i].rghtEqpNm);
						if(sctnData[i].lftEqpId != sctnData[i].rghtEqpId){
							with (sctnData[i]) {
								nodedata[nodecnt++] = {nodekey:tokey, mtsoId:rghtMtsoId,mtsoNm:rghtMtsoNm,mtsoTypCd:rghtMtsoTypCd,eqpId:rghtEqpId,eqpNm:rghtEqpNm,shortNm:shortname,eqpRoleDivCd:rghtEqpRoleDivCd,eqpRoleDivNm:rghtEqpRoleDivNm,lineSctnLnoSrno:rghtLineSctnLnoSrno,mgmtGrpNm:mgmtGrpNm,source:"",loc:"", eqpMdlId : rghtEqpMdlId, eqpMdlNm : rghtEqpMdlNm, lftIntgMtsoId : lftIntgMtsoId, lftIntgMtsoNm : lftIntgMtsoNm, rghtIntgMtsoId : rghtIntgMtsoId, rghtIntgMtsoNm : rghtIntgMtsoNm, intgMtsoId : rghtIntgMtsoId, intgMtsoNm : rghtIntgMtsoNm};
							};
						}
						preveqpid = sctnData[i].rghtEqpId;
					};
				};
			}

			linkdata[linkcnt] = sctnData[i]
			linkdata[linkcnt]["frkey"] = frkey;
			linkdata[linkcnt]["tokey"] = tokey;
			linkcnt++;
		}
		//}

		sctnresponse.nodeData = nodedata;
		sctnresponse.linkData = linkdata;

		return sctnresponse
	}

	function sctnMtsoDataParsing(sctnData){

		var sctnresponse = {nodeData:null, linkData:null};
		var nodedata = [];
		var linkdata = [];
		var nodecnt = 0;
		var linkcnt = 0;
		var mtsoTmp = [];

		for(var i=0; i<sctnData.length; i++){

			var cntLft = 0;
			var cntRght = 0;
			for(var j=0; j<mtsoTmp.length; j++){
				if(mtsoTmp[j] == sctnData[i].lftMtsoId){
					cntLft++;
				}
				if(mtsoTmp[j] == sctnData[i].rghtMtsoId){
					cntRght++;
				}
			}

			if(cntLft == 0 && sctnData[i].lftMtsoId != "" && sctnData[i].lftMtsoId != undefined){
				nodedata[nodecnt++] = {mtsoId:sctnData[i].lftMtsoId, mtsoNm:sctnData[i].lftMtsoNm, mtsoTypCd:sctnData[i].lftMtsoTypCd, lftIntgMtsoId : sctnData[i].lftIntgMtsoId, lftIntgMtsoNm : sctnData[i].lftIntgMtsoNm, rghtIntgMtsoId : sctnData[i].rghtIntgMtsoId, rghtIntgMtsoNm : sctnData[i].rghtIntgMtsoNm, intgMtsoId : sctnData[i].lftIntgMtsoId, intgMtsoNm : sctnData[i].lftIntgMtsoNm};
				mtsoTmp[mtsoTmp.length] = sctnData[i].lftMtsoId;
			}

			if(cntRght == 0 && sctnData[i].rghtMtsoId != "" && sctnData[i].rghtMtsoId != undefined && sctnData[i].lftMtsoId != sctnData[i].rghtMtsoId){
				nodedata[nodecnt++] = {mtsoId:sctnData[i].rghtMtsoId, mtsoNm:sctnData[i].rghtMtsoNm, mtsoTypCd:sctnData[i].rghtMtsoTypCd, lftIntgMtsoId : sctnData[i].lftIntgMtsoId, lftIntgMtsoNm : sctnData[i].lftIntgMtsoNm, rghtIntgMtsoId : sctnData[i].rghtIntgMtsoId, rghtIntgMtsoNm : sctnData[i].rghtIntgMtsoNm, intgMtsoId : sctnData[i].rghtIntgMtsoId, intgMtsoNm : sctnData[i].rghtIntgMtsoNm};
				mtsoTmp[mtsoTmp.length] = sctnData[i].rghtMtsoId;
			}

			if(sctnData[i].lftMtsoId != sctnData[i].rghtMtsoId){
				linkdata[linkcnt++] = {lftMtsoId:sctnData[i].lftMtsoId, lftVal:sctnData[i].lftMtsoLngVal+","+sctnData[i].lftMtsoLatVal, rghtMtsoId:sctnData[i].rghtMtsoId, rghtVal:sctnData[i].rghtMtsoLngVal+","+sctnData[i].rghtMtsoLatVal, lftIntgMtsoId : sctnData[i].lftIntgMtsoId, lftIntgMtsoNm : sctnData[i].lftIntgMtsoNm, rghtIntgMtsoId : sctnData[i].rghtIntgMtsoId, rghtIntgMtsoNm : sctnData[i].rghtIntgMtsoNm};
			}

		}

		sctnresponse.nodeData = nodedata;
		sctnresponse.linkData = linkdata;

		return sctnresponse
	}



	function mtsoExpandNode(node) {
        var diagram = node.diagram;
        myDiagram.startTransaction("CollapseExpandTree");
        var data = node.data;

        if (!data.everExpanded) {
          diagram.model.setDataProperty(data, "everExpanded", true);

        }

        if (node.isTreeExpanded) {
        	var arr = node.data._members;
			for (var i = 0; i < arr.length; i++) {
				var d = arr[i];
				mtsoNodeTemp.push({ key: d.key, name: d.name, source: d.source, loc: d.loc, eqpRoleDivCd: d.eqpRoleDivCd, eqpRoleDivNm: d.eqpRoleDivNm, everExpanded: d.everExpanded, group: d.group, category: d.category, supers: d.supers});
				myDiagram.model.removeNodeData(d);
			}
          diagram.commandHandler.collapseTree(node);
        } else {
        	for (var i = 0; i < mtsoNodeTemp.length; i++) {
				var d = mtsoNodeTemp[i];
				nodeDataArray.push(d);
			}
        	mtsoNodeTemp = [];
          diagram.commandHandler.expandTree(node);
        }
        myDiagram.commitTransaction("CollapseExpandTree");
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        myDiagram.zoomToFit();
      }

    function expandNode(node) {
        var diagram = node.diagram;
        locX = node.data.loc.substring(0, node.data.loc.indexOf(' '));
        locY = node.data.loc.substring(node.data.loc.indexOf(' '));
        myDiagram.startTransaction("CollapseExpandTree");

        nodeTemp = node;
        var data = node.data;
        addKey = data.key;

        $('#menuListGrid').alopexGrid('showProgress');

		sideTabToggle = true;

//		document.getElementById("zoom").style.marginLeft = "85%";


        var param = {"eqpId": data.eqpId};
        httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/lowEqpList', param, 'GET', 'addLowEqpList');

          myDiagram.commitTransaction("CollapseExpandTree");
        }

    //국사 레벨의 그룹화 시 이미지 변경
    function expandNodeGroup(group) {
        myDiagram.startTransaction("CollapseExpandTree");
        var data = group.data;
        var scr = "";

        //국사 아이콘
		src = getMtsoIcon(data.mtsoTypCd, "");

        if (group.isSubGraphExpanded) {
        	myDiagram.model.setDataProperty(data, "source", "");
        	myDiagram.model.setDataProperty(data, "size", "0, 0");
        }else{
        	myDiagram.model.setDataProperty(data, "source", src);
        	myDiagram.model.setDataProperty(data, "size", "40, 40");
        }
        myDiagram.commitTransaction("CollapseExpandTree");
      }


    function createSubTree(data) {

    	var eqpId = data.eqpId;
    	addKey = data.key;

    	$('body').progress();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/addData/'+eqpId, null, 'GET', 'addData');
      }

    function createGroupSubTree(data) {

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmAddGroupData', data, 'GET', 'addData');
      }

    function createRingSubTree(data) {

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmAddRingData', data, 'GET', 'addData');
      }


});