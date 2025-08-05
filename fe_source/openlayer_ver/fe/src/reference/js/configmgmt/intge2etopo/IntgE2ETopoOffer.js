/**
 * IntgE2ETopo.js
 *
 * @author Administrator
 * @date 2017. 10. 21. 오전 17:30:03
 * @version 1.0
 */

//마우스 이벤트에 따른 margin값 참조 변수
var startX
var targetX = 0;
//html요소 참조를 위한 변수 선언
var mContainer;
var START_WIDTH = 220;
var sideTabToggle = false;

//회선 파라미터
var mgmtGrpCd = "";
var gridId = "";

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

//검색 단어에 따라 검색 속도가 달라 먼저 검색한 단어가 나중에 표시되는 문제를 방지 하기 위해 따로 작성하였음
(function($) {

	/***************************************************************************
	 * autocomplete
	 **************************************************************************/
	$.alopex.widget.autocomplete = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'autocomplete',
		setters : ['autocomplete', 'setOptions'],
		getters : ['getSelectedData'],
		properties: {
			textinput : null,
			dropdown : null,
			noresultstr : 'No Results',
			lastKeyword : "",
			url : null,
			method : "GET",
			datatype : "json",
			paramname : null,
			source : undefined,
			minlength : 1,
			fitwidth : true,
			maxheight : '',
			select : null,
			selected : undefined,
			maxresult : 100
		},
		init : function(el, option) {
			$.extend(el, this.properties, option);
//			if ( $(el).find('.Textinput').length === 0 ){
//				$(el).append('<input class="Textinput">');
//			}
			if ( $(el).find('.Dropdown').length === 0 ){
				$(el).append('<ul class="Dropdown"></ul>');
			}
			el.textinput = $(el).find('.Textinput').first();
			el.dropdown = $(el).find('.Dropdown').first();
			$(el.dropdown).css('minWidth', $(el.textinput).outerWidth());
			$(el.dropdown).css('display', 'none');
//			el.fitwidth
//				? $(el.dropdown).width($(el.textinput).outerWidth()-2*parseInt($(el.textinput).css('border-left-width'))) // border 1px * 2 을 제하여 주어야 함
//				: $(el.dropdown).css('display', 'inline-block');
			$(el.dropdown).css('maxHeight', el.maxheight);
			$(el.dropdown).css('overflow-y','auto');
			$a.convert(el.textinput);
			$a.convert(el.dropdown);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);

			$(el.dropdown).addHandler($.alopex.widget.autocomplete._defaultHandler);
		},
		_defaultHandler : function(e){
			var el = e.currentTarget.parentElement.parentElement;
			el.lastKeyword = e.currentTarget.innerText;
			el.selected = e.currentTarget.data;

			if( typeof el.select === "function" ){
				el.select(e, el.selected);
			}
		},
		setOptions : function(el, data){
			$.extend(el, data);
			$(el.textinput).on('keyup.autocomplete', $.alopex.widget.autocomplete._keyupHandler);
		},
		_keyupHandler : function(e){

			// [20160503 kjb - e.keyCode 이용해서 키보드의 기능키 등 불필요한  키 입력에 대해서는 return 처리]

			var el = e.currentTarget;
			var text = $(el).val();
			var divEl = el.parentElement;
			var req = {};
			req.data = {};
			req.el = divEl;
			// minLength 와 같거나 큰 길이의 입력에 대해서만 동작
			if( e.keyCode !== 13 && divEl.lastKeyword != text ){
				divEl.lastKeyword = text;
				if( 0 < $('#searchNm').val().length ){
					req.url = divEl.url;
					divEl.paramname? req.data[divEl.paramname] = text : req.data = text;
					req.method = divEl.method;
					req.dataType = divEl.datatype;
					req.success = function(res){
						if( res.length > this.el.maxresult ){
							res.length = this.el.maxresult;
						}
						if(res.length > 0){
							var textRes = res[0].text.toUpperCase();
							if(textRes.indexOf($('#searchNm').val().toUpperCase()) > -1){
								$.alopex.widget.autocomplete._setDataSource(this.el.dropdown, res);
								$.alopex.widget.autocomplete._noResultHandler(divEl);
								$(this.el.dropdown).open();
							}
						}else{
							if(text == $('#searchNm').val()){
								$.alopex.widget.autocomplete._setDataSource(this.el.dropdown, res);
								$.alopex.widget.autocomplete._noResultHandler(divEl);
								$(this.el.dropdown).open();
							}
						}
					}
					$.ajax(req);
				}else{
					$(el.dropdown).html('');
					$(el.dropdown).close();
				}
			}else if( e.keyCode !== 13 && divEl.lastKeyword == text ){
				$(el.dropdown).open();
			}else {
				return;
			}
		},
		_setDataSource : function(dd, data){
			switch (typeof data) {
			case 'string':
				$el.html(data);
				break;
			case 'object':
				$.alopex.widget.autocomplete._htmlGenerator(dd, data);
				break;
			default:
				break;
			}
			$(dd).refresh();
			// [20160503 kjb - 아래 주석 풀었음]
			dd.userInputDataSource = data;
		},
		_noResultHandler : function(el){
			if ( $(el.dropdown).find('li').length === 0 ){
				$(el.dropdown).append('<li class="af-disabled Disabled" data-role="empty">'+el.noresultstr+'</li>');
			}
		},
		_htmlGenerator: function(dd, data) {
			var item;

			$(dd).html('');

			for( var i = 0 ; i < data.length ; i++ ){
				item = document.createElement('li');
				if ( data[i].id !== undefined ) {
					item.id = data[i].id;
				}
				if ( data[i].text !== undefined ){
					item.innerText = data[i].text;
				} else if ( data[i].value !== undefined ){
					item.innerText = data[i].value;
				} else {
					item.innerText = data[i];
				}
				item.data = data[i];
				$(dd).append(item);
			}
		},
		getSelectedData : function(el){
			return el.selected;
		}
 	});
})(jQuery);

var main = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	initDiagram();
    	setEventListener(param);

		//메뉴 시작 위치 조정
//        mContainer = document.getElementById("menuContainer");

        //컨테이너 참조 구하기 (사이드 메뉴)
//        startX = parseInt(-START_WIDTH);
//        mContainer.style.width = "220px";
//        mContainer.style.height = "600px";
//        mContainer.style.marginRight = startX + "px";

//        document.getElementById("rightImageDiv").style.display = "block";
//        document.getElementById("menuList").style.display = "block";
//        mContainer.style.marginRight = startX + 5 + "px";
//        document.all.rightImage.src = "../../resources/images/img_menu_close.png";


    	//검색-장비정보를 보여준다
    	$("#eqpInfSearch").hide();
    	$("#mtsoInfSearch").hide();
    	$("#serviceLineInfSearch").hide();
    	$("#pathSearch").hide();
    	$("#ringInfSearch").hide();
    	$("#trunkInfSearch").hide();


//    	선택-장비정보를 보여준다
    	$("#mtsoInfSelect").hide();
    	$("#eqpInfSelect").hide();
    	$("#linkInfSelect").hide();

    	$("#diagramDown").hide();

    	$("#searchMapGis").hide();
    	$("#acptLine").hide();
    	$("#acptTrk").hide();

    	//파라미터가 넘어올 경우 바로 조회
    	if (!jQuery.isEmptyObject(param) ) {
    		if(param.searchId != null){
    			$("#searchTarget").setSelected(param.searchTarget);
        		$("#searchId").val(param.searchId);
        		$("#searchNm").val(param.searchNm);
        		mgmtGrpCd = param.mgmtGrpCd;
        		gridId = param.gridId;
        		setTopology(param)
    		}

        }
    };

    function initGrid() {

//    	$('#menuListGrid').alopexGrid({
////    		header: false,
//    		pager: false,
//    		height:"580px",
//    		width:"200px",
//        	autoColumnIndex: true,
//    		autoResize: true,
//    		numberingColumnFromZero: false,
//    		columnMapping: [{
//    			key : 'rghtEqpNm',
//				title : '하위장비명',
//				width: '5px'
//			}],
//			message: {/* 데이터가 없습니다. */
//				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
//			}
//	    });

        //링크정보 from 그리드 생성
        $('#'+fromGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		columnMapping: [{
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '100%'
			}, {
				key : 'portIdxNo', align:'center',
				title : 'INDEX',
				width: '100%'
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트 IP',
				width: '100%'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '100%'
			},{
				key : 'portDesc', align:'center',
				title : '설명',
				width: '100%'
			}, {
				key : 'portAlsNm', align:'center',
				title : '별명',
				width: '100%'
			}]
        });



        //링크정보 to 그리드 생성
        $('#'+toGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		columnMapping: [{
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '120px'
			}, {
				key : 'portIdxNo', align:'center',
				title : 'INDEX',
				width: '70px'
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트 IP',
				width: '70px'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '70px'
			},{
				key : 'portDesc', align:'center',
				title : '설명',
				width: '70px'
			}, {
				key : 'portAlsNm', align:'center',
				title : '별명',
				width: '150px'
			}]
        });

        $('#'+serviceLineGridId).alopexGrid({
        	pager : false,
        	height:"2row",
        	rowClickSelect: true,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		columnMapping: [{
				key : 'lineNm', align:'left',
				title : '회선명',
				width: '220px'
			}, {
				key : 'svlnNo', align:'center',
				title : '서비스회선번호',
				width: '120px'
			}, {
				key : 'svlnStatNm', align:'center',
				title : '서비스회선상태',
				width: '120px'
			/*}, {
				key : 'svlnNetDivNm', align:'center',
				title : '망구분',
				width: '70px'*/
			},{
				key : 'lineLnoGrpSrno', align:'center',
				title : '경로번호',
				width: '100px'
			}, {
				key : 'svlnLclNm', align:'center',
				title : '서비스회선대분류',
				width: '120px'
			}, {
				key : 'svlnSclNm', align:'center',
				title : '서비스회선소분류',
				width: '120px'
			}, {
				key : 'mgmtGrpNm', align:'center',
				title : '관리그룹',
				width: '100px'
			}, {
				key : 'svlnTypNm', align:'center',
				title : '서비스회선유형',
				width: '120px'
			}, {
				key : 'uprMtsoNm', align:'center',
				title : '상위국사',
				width: '150px'
			}, {
				key : 'lowMtsoNm', align:'center',
				title : '하위국사',
				width: '150px'
			}]
        });


        $('#'+pathGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
    		autoColumnIndex: true,
    		grouping:{
    			by:['trkNm','ringNm','wdmNm'],
    			useGrouping:true,
//    			useGroupRearrange:true,
    			useGroupRowspan:true
    		},
    		columnMapping: [{
				key : 'trkNm', align:'left',
				title : '트렁크',
				width: '200px',
				rowspan:true,
				highlight: function (value, data, mapping){
					if(value){
						return 'row-white-background-trk';
					}
				}
			}, {
    			key : 'ringNm', align:'center',
				title : '링',
				width: '200px',
				rowspan:true,
				highlight: function (value, data, mapping){
					if(value){
						return 'row-white-background-ring';
					}
				}
			}, {
				key : 'wdmNm', align:'center',
				title : 'WDM트렁크',
				width: '200px',
				rowspan:true,
				highlight: function (value, data, mapping){
					if(value){
						return 'row-white-background-wdm';
					}
				}
			}, {
				key : 'lftMtsoNm', align:'center',
				title : 'WEST국사',
				width: '150px'
			},{
				key : 'lftEqpRingDivNm', align:'center',
				title : 'WEST상하위',
				width: '100px'
			}, {
				key : 'lftEqpNm', align:'center',
				title : 'WEST장비',
				width: '300px'
			}, {
				key : 'lftPortNm', align:'center',
				title : 'WEST포트',
				width: '120px'
			},{
				key : 'lftChnlVal', align:'center',
				title : 'WEST채널',
				width: '120px'
			}, {
				key : 'rghtMtsoNm', align:'center',
				title : 'EAST국사',
				width: '150px'
			}, {
				key : 'rghtEqpRingDivNm', align:'center',
				title : 'EAST상하위',
				width: '100px'
			}, {
				key : 'rghtEqpNm', align:'center',
				title : 'EAST장비',
				width: '300px'
			}, {
				key : 'rghtPortNm', align:'center',
				title : 'EAST포트',
				width: '120px'
			}, {
				key : 'rghtChnlVal', align:'center',
				title : 'EAST채널',
				width: '120px'
			}]
        });

    };

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
//    			layout: $(CustomLayout),
//    			layout: $(go.TreeLayout, {angle: 0, setsPortSpot: false, setsChildPortSpot: false}),
//    			draggingTool: $(CustomDraggingTool),
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
//    					contextMenu:
//    						$(go.Adornment, "Vertical",
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
    				}
        ));

    	myDiagram.nodeTemplate =
    		$(go.Node, "Vertical",
//    			{ doubleClick: eqpDtlLkupPop },
//    			{ //toolTip: nodeToolTip,
//    	          isTreeLeaf: false,
//    			isTreeExpanded: false,
//    			zOrder:3
//    			},
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
    			)
//    			$("TreeExpanderButton",
//		          {
//		            name: 'TREEBUTTON',
//		            width: 20, height: 20,
//		            alignment: go.Spot.TopRight,
//		            alignmentFocus: go.Spot.Center,
//		            click: function (e, obj) {  // OBJ is the Button
//		                var node = obj.part;  // get the Node containing this Button
//		                if (node === null) return;
//		                e.handled = true;
//		                groupYn = false;
//		                groupKey = node.data.group;
//		                expandNode(node);
//		              }
//		          }
//		        )
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
//        			doubleClick: mtsoDtlLkupPop,
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
//    					contextMenu:
//    						$(go.Adornment, "Vertical",
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
//				  doubleClick: eqpDtlLkupPop,
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
//    			$("TreeExpanderButton",
//		          {
//		            name: 'TREEBUTTON',
//		            width: 15, height: 15,
//		            alignment: go.Spot.TopRight,
//		            alignmentFocus: go.Spot.Center,
//		            click: function (e, obj) {  // OBJ is the Button
//		                var node = obj.part;  // get the Node containing this Button
//		                if (node === null) return;
//		                e.handled = true;
//		                groupYn = false;
//		                groupKey = node.data.group;
//		                expandNode(node);
//		              }
//		          },
//		          new go.Binding("visible", "btnVisible")
//		        ),
		        {
//					contextMenu:
//						$(go.Adornment, "Vertical",
//							$("ContextMenuButton",
//								$(go.TextBlock,"장비정보"),
//								{ click: eqpDtlLkupPop }
//								),
//							$("ContextMenuButton",
//								$(go.TextBlock,"연동정보"),
//								{ click: eqpLnkgInfPop }
//								),
//							$("ContextMenuButton",
//    							$(go.TextBlock,"형상정보"),
//    							{ click: shpInfPop }
//    							),
//    						$("ContextMenuButton",
//    							$(go.TextBlock,"포트현황"),
//    							{ click: portInfMgmtPop }
//    							),
//    						$("ContextMenuButton",
//    							$(go.TextBlock,"포트복사"),
//    							{ click: portInfCopyPop }
//    							),
//							$("ContextMenuButton",
//								$(go.TextBlock,"구간현황"),
//    							{ click: eqpSctnAcptCurstPop }
//								),
//							$("ContextMenuButton",
//								$(go.TextBlock,"네트워크정보"),
//    							{ click: eqpNtwkLineAcptCurstPop }
//								),
//							$("ContextMenuButton",
//								$(go.TextBlock,"회선정보"),
//    							{ click: eqpSrvcLineAcptCurstPop }
//								),
//							$("ContextMenuButton",
//    							$(go.TextBlock,"변경이력"),
//    							{ click: eqpChgHstLkupPop }
//    							)
//							)
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
//    				doubleClick: tnBdgmLinkInfPop,
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
//					contextMenu:
//						$(go.Adornment, "Vertical",
//							$("ContextMenuButton",
//								$(go.TextBlock,"링크정보"),
//								{ click: tnBdgmLinkInfPop }
//								),
//							$("ContextMenuButton",
//								$(go.TextBlock,"선로조회"),
//								{ click: searchLineInf },
//								new go.Binding("visible", "lineVisible")
//								),
//							$("ContextMenuButton",
//								$(go.TextBlock,"트렁크시각화편집"),
//								{ click: trunkInfoPopNew },
//								new go.Binding("visible", "trkVisible")
//								),
//							$("ContextMenuButton",
//    							$(go.TextBlock,"링시각화편집"),
//    							{ click: ringInfoPopNew },
//    							new go.Binding("visible", "ringVisible")
//    							),
//    						$("ContextMenuButton",
//    							$(go.TextBlock,"WDM트렁크시각화편집"),
//    							{ click: wdmTrunkInfoPopNew },
//    							new go.Binding("visible", "wdmVisible")
//    							)
//							)
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

//        loop();
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
    	/*var diagram = myDiagram;
    	setTimeout(function() {
    		var oldskips = diagram.skipsUndoManager;
    		diagram.skipsUndoManager = true;
    		diagram.findTopLevelGroups().each(function(lane){
    			var shape = lane.findObject("PIPE");
    			var off = shape.strokeDashOffset - 2 ;
    			shape.strokeDashOffset = (off <=0) ? 20 : off;
    		});
    	diagram.skipsUndoManager = oldskips;
    	loop();
    	}, 100);*/
    }

    function setEventListener(data) {

    	//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
//		$('#menuListGrid').on('click', '.bodycell', function(e){
//			var dataObj = AlopexGrid.parseEvent(e).data;
//			main.lowEqpData(dataObj.rghtEqpId);
//
////			document.getElementById("menuList").style.display = "none";
//
//    	    mContainer.style.marginRight = startX + 5+ "px";
//    		document.all.rightImage.src = "../../resources/images/img_menu_close.png";
//    		sideTabToggle = false;
//
//    		document.getElementById("zoom").style.marginLeft = "96%";
//		});
//
//    	$('#rightImage').on('click', function(e) {
//        	var grid = document.all.rightImage;
//
//        	if (sideTabToggle == true){
//
////        		document.getElementById("menuList").style.display = "none";
//
//        	    mContainer.style.marginRight = startX + 5 + "px";
//        	    grid.src = "../../resources/images/img_menu_close.png";
//        	    sideTabToggle = false;
//
//        	    document.getElementById("zoom").style.marginLeft = "96%";
//        	} else {
//
//        		document.getElementById("menuList").style.display = "block";
//
//        		mContainer.style.marginRight = targetX + "px";
//        	    grid.src = "../../resources/images/img_menu_open.png";
//        	    sideTabToggle = true;
//
//        	    document.getElementById("zoom").style.marginLeft = "85%";
//        	}
//    	});

    	 /*$("#menuContainer").on('mouseleave', function(e) {

//    		 	document.getElementById("menuList").style.display = "none";

     	    	mContainer.style.marginRight = startX + 5 + "px";
     	    	document.all.rightImage.src = "../../resources/images/img_menu_close.png";
     	    	sideTabToggle = false;

     	    	document.getElementById("aa").style.marginLeft = "92%";
			}
		 );*/

//    	 $("#menuContainer").on('mouseover', function(e) {
//
//    		document.getElementById("menuList").style.display = "block";
//
//     		mContainer.style.marginRight = targetX + "px";
//     		document.all.rightImage.src = "../../resources/images/img_menu_close.png";
//     	    sideTabToggle = true;
//
//     	    document.getElementById("aa").style.marginLeft = "85%";
//			}
//		 );

    	$('#zoomsin').on('click', function(e){
    	// 상위 레이어로
    		myDiagram.commandHandler.increaseZoom(1.67);
        });

    	$('#zoomsout').on('click', function(e){
    	// 하위 레이어로
    		myDiagram.commandHandler.decreaseZoom(0.6);
        });

    	//링크정보 페이지 번호 클릭시
   	 	$('#'+fromGridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFromGrid(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//링크정보페이지 selectbox를 변경했을 시.
        $('#'+fromGridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFromGrid(1, eObj.perPage);
        });

        //링크정보 페이지 번호 클릭시
   	 	$('#'+toGridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setToGrid(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//링크정보페이지 selectbox를 변경했을 시.
        $('#'+toGridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setToGrid(1, eObj.perPage);
        });

//        //서비스회선 그리드 더블클릭 시
//        $('#'+serviceLineGridId).on('dblclick', '.bodycell', function(e){
//	       	var dataObj = AlopexGrid.parseEvent(e).data;
//    	 	var dataKey = dataObj._key;
//    	 	showServiceLIneInfoPop( serviceLineGridId, dataObj ,"Y");
//        });

        //서비스회선 그리드 클릭 시
//        $('#'+serviceLineGridId).on('click', '.bodycell', function(e){
//	       	var dataObj = AlopexGrid.parseEvent(e).data;
//
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/linePathList', dataObj, 'GET', 'linePathList');
//        });

        //그리드 선택 시 해당 구간 토폴로지에 표시
        $('#'+pathGridId).on('click', '.bodycell', function(e){
	       	var dataObj = AlopexGrid.parseEvent(e).data;

    	 	var oldskips = myDiagram.skipsUndoManager;
        	myDiagram.skipsUndoManager = true;
    		myDiagram.links.each(function(link){
    			if(link.data.eqpSctnId == dataObj.eqpSctnId){
    				link.findObject("LINK_SHAPE").stroke = "red";
    				link.findObject("LINK_SHAPE").strokeWidth = "2";
    			}else{
    				link.findObject("LINK_SHAPE").stroke = "black";
    				link.findObject("LINK_SHAPE").strokeWidth = "1";
    			}
    		});
    		myDiagram.skipsUndoManager = oldskips;
        });

        var urlData = "";
    	if(data.searchTarget == "SRVN"){
			//서비스회선 자동 검색
			urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/lineAutoSearch";
		}else if(data.searchTarget == "RING"){
			//링 자동 검색
			urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/ringAutoSearch";
		}else if(data.searchTarget == "TRK"){
			//트렁크 자동 검색
			urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/trunkAutoSearch";
		}else if(data.searchTarget == "EQP"){
			//장비 자동 검색
			urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/eqpAutoSearch";
		}else if(data.searchTarget == "MTSO"){
			//국사 자동 검색
			urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/mtsoAutoSearch";
		}else if(data.searchTarget == "FCLT"){

		}else{
        	//기본으로 서비스회선 자동 검색
			urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/lineAutoSearch";
        }

 		//처음 서비스회선 자동 검색
 		$("#idSelect").setOptions({

 			url : urlData,
 			method : "get",
 			datatype: "json",
 			paramname : "searchNm",
 			minlength: 2,
 			noresultstr : "검색 결과가 없습니다.",
 			before : function(id, option){

 			}
 		});

 		//조회대상 변경 시 자동 검색 셋팅
		$('#searchTarget').on('change', function(e) {
			var searchT =  $("#searchTarget").getData();
			$('#idSelect').clear();

			if(searchT.searchTarget == "SRVN"){
				//서비스회선 자동 검색
				urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/lineAutoSearch";
			}else if(searchT.searchTarget == "RING"){
				//링 자동 검색
				urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/ringAutoSearch";
			}else if(searchT.searchTarget == "TRK"){
				//트렁크 자동 검색
				urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/trunkAutoSearch";
			}else if(searchT.searchTarget == "EQP"){
				//장비 자동 검색
				urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/eqpAutoSearch";
			}else if(searchT.searchTarget == "MTSO"){
				//국사 자동 검색
				urlData = "/tango-transmission-biz/transmisson/configmgmt/commoncode/mtsoAutoSearch";
			}else if(searchT.searchTarget == "FCLT"){

			}

			$("#idSelect").setOptions({
	 			url : urlData,
	 			method : "get",
	 			datatype: "json",
	 			paramname : "searchNm",
	 			minlength: 2,
	 			noresultstr : "검색 결과가 없습니다.",
	 			before : function(id, option){
	 			}
	 		});
		});

		//다이어그램 창 높이 좁게 조절
		$('#diagramUp').on('click', function(e){
			$("#diagramUp").hide();
	    	$("#diagramDown").show();

			var div = myDiagram.div;
			div.style.height = "400px";
			myDiagram.requestUpdate();

//			mContainer.style.height = "400px";
//			$('#menuListGrid').alopexGrid('updateOption', {height: "380px"});
        });

		//다이어그램 창 높이 넓게 조절
		$('#diagramDown').on('click', function(e){
			$("#diagramUp").show();
	    	$("#diagramDown").hide();

			var div = myDiagram.div;
			div.style.height = "600px";
			myDiagram.requestUpdate();

//			mContainer.style.height = "600px";
//			$('#menuListGrid').alopexGrid('updateOption', {height: "580px"});
        });

		//검색팝업
		$('#btnSearchIdSch').on('click', function(e) {
			var searchT =  $("#searchTarget").getData();

			if(searchT.searchTarget == "SRVN"){
				$a.popup({
		        	popid: 'linenum',
		        	title: '서비스 회선 조회 팝업',
		            url: '/tango-transmission-web/configmgmt/cfline/ServiceLineListPop.do',
		            data: null,
				    modal: true,
				    movable:false,
				    width : 1400,
				    height : window.innerHeight * 0.9,
		            callback: 	function (data) {
		            	if(data !== null ){
		            		$("#idSelect").setOptions({selected: null});
		            		$('#searchId').val(data[0].svlnNo);
		            		$('#searchNm').val(data[0].lineNm+" ["+data[0].svlnNo+"]");
	  		            }
	  				}
		        });
			}else if(searchT.searchTarget == "RING"){  // 링 조회
				$a.popup({
		        	popid: 'linenum',
		            url: '/tango-transmission-web/configmgmt/cfline/RingListPop.do',
		            data: null,
				    modal: true,
				    windowpopup : true,
				    movable:false,
				    width : 1400,
				    height : window.innerHeight * 0.9,
		            callback: 	function (data) {
		            	if(data !== null ){
		            		$("#idSelect").setOptions({selected: null});
		            		$('#searchId').val(data.ntwkLineNo);
		            		$('#searchNm').val(data.ntwkLineNm+" ["+data.ntwkLineNo+"]");
	  		            }
	  				}
		    });
		}else if(searchT.searchTarget == "TRK"){  // 트렁크 조회
			$a.popup({
	        	popid: 'linenum',
	            url: '/tango-transmission-web/configmgmt/cfline/TrunkListPop.do',
	            data: null,
			    modal: true,
			    windowpopup : true,
			    movable:false,
			    width : 1400,
			    height : window.innerHeight * 0.9,
	            callback: 	function (data) {
	            	if(data !== null ){
	            		$("#idSelect").setOptions({selected: null});
	            		$('#searchId').val(data[0].ntwkLineNo);
	            		$('#searchNm').val(data[0].ntwkLineNm+" ["+data[0].ntwkLineNo+"]");
  		            }
  				}
			});
		}else if(searchT.searchTarget == "EQP"){
				$a.popup({
				  	popid: "popEqpSch",
				  	title: configMsgArray['equipment']/* 장비 조회 */,
				  	url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
					modal: false,
					movable:true,
					windowpopup : true,
					width : 950,
					height : 750,
					callback:function(data){
						if(data != null){
							$("#idSelect").setOptions({selected: null});
							$('#searchId').val(data.eqpId);
							$('#searchNm').val(data.eqpNm+" ["+data.eqpId+"]");
						}
					}
				});
			}else if(searchT.searchTarget == "MTSO"){
				$a.popup({
				  	popid: "popMtsoSch",
				  	title: configMsgArray['mobileTelephoneSwitchingOffice']/* 국사 조회 */,
				  	url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
					modal: false,
					movable:true,
					windowpopup : true,
					width : 950,
					height : 750,
					callback:function(data){
						if(data != null){
							$("#idSelect").setOptions({selected: null});
							$('#searchId').val(data.mtsoId);
							$('#searchNm').val(data.mtsoNm);
						}
					}
				});
			}else if(searchT.searchTarget == "FCLT"){
				alert('개발중입니다.');
			}


		});

//		 $("#lowEqpPop").blur(function() {
//			 alert("a");
//			 document.getElementById("lowEqpPop").style.display = "none";
// 		 });

		/*$("#lowEqpPop").on('click', function(e) {
			var li = e.currentTarget;
			var selectEl = $(li).find('select');
//			alert(JSON.stringify(selectEl));
		});*/
		// blur시 드랍다운 close 처리.
		 $("#lowEqpPop").on('mouseleave', function(e) {
//			 alert("AA");
//			 $(document.body).on('click', function(e) {
//				 alert("AA");
//					var dropdown = e.currentTarget.dropdown;
					      $("#lowEqpPop").close();
//					      document.getElementById("lowEqpPop").style.display = "none";
//				}
//			 )
//				var dropdown = e.currentTarget.dropdown;
			}
		 );
		// hover시 af-focus 표시.
		 $("#lowEqpPop").on('mouseleave mouseenter', 'li.af-menuitem', function(e) {
		  var target = e.currentTarget;

		  var $target = $(target);
		  var $el = $target.closest('[data-type]');
		  $el.find('*').filter('.af-focused.Focused').removeClass('af-focused Focused');

		  var inputEl = $(e.currentTarget).find('input');
		  if (inputEl) {
		    var type = $(e.currentTarget).find('input').attr('type');
		    if (type == 'checkbox' || type == 'text' || type == 'button') {
		      return;
		    }
		  }

		  var selectEl = $(e.currentTarget).find('select');
		  if (selectEl.length > 0) {
		    return;
		  }

		  if (target.className.indexOf('af-disabled Disabled') === -1) {
		    $target.addClass('af-focused Focused');
		  }
		});

    	 //선로 버튼
    	 $("#searchLineInf").on("click", function(e) {
    		 searchLineInf();
  		 });

    	//지도 버튼
    	 $("#searchMap").on("click", function(e) {

    		var param = null;
	    		param =  $("#searchForm").getData();

	 		if(JSON.stringify($("#idSelect").getSelectedData()) != null && JSON.stringify($("#idSelect").getSelectedData()) != "null"){
	 			var searchId = "";
	 			searchId = JSON.stringify($("#idSelect").getSelectedData().searchId);
	 			param.searchId = searchId.replace(/"/g, "");
	 		}else{
	 			if($("#searchNm").val() == ""){
	 				param.searchId = "";
	 			}else{
	 				param.searchId = $("#searchId").val();
	 			}
	 		}

	 		if(param.searchId == ""){
		   			 callMsgBox('','W', '먼저 검색 대상을 조회 하십시오.', function(msgId, msgRst){});
		   			 return;
	 		}
	 		if(linkDataArray.length == 0){
	   			 callMsgBox('','W', '검색 대상이 없습니다.', function(msgId, msgRst){});
	   			 return;
	 		}

	 		var searchT =  $("#searchTarget").getData();
	   		if(searchT.searchTarget == "RING"){
	   			 mapFlag = "RING";
	   		}else{
	   			 mapFlag = "";
	   		}

    		 window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2EMap.do');
  		 });

    	//GIS지도 버튼
    	 $("#searchMapGis").on("click", function(e) {
//    	 	mapFlag = "RING";
//    	 	gisMap = window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2EMap.do');

    	 	mapFlag = "";
    	 	gisMap = window.open('/tango-transmission-gis-web/tgis/Main.do');

			setTimeout(function(){
				gisM();
				}, 5000);
  		 });

    	 $("#test").on("click", function(e) {
    		 window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget='+'SRVN'+'&searchId='+'S000022204535'+'&searchNm='+'S야탑중심국_모란역LDT_02');
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

     			fileName = dateStr + '_' + searchNm + '.png';
     			downloadImage(image, fileName);
     		}
  		 });

    	 //출력 버튼
    	 $("#printTopo").on("click", function(e) {
  			var param =  $("#serviceLineInfForm").getData();

  			console.log(param.lineNm);

  			window.print();
    		 //alert("개발중입니다.");
  		 });

    	//국사 편집 팝업
  		$('#changeMtso').on('click', function(e) {

  			var param =  $("#mtsoInfSelectForm").getData(); // 나중에 검색용으로 바꿔야함
  			param.regYn = "Y";

  			$a.popup({
  	        	popid: 'MtsoInfoPopNew',
  	        	title: '국사 시각화',
  	            url: '/tango-transmission-web/configmgmt/common/MtsoRegPop.do',
  	            data: param,
  	            windowpopup : true,
    				iframe: false,
    				modal: true,
    				movable:true,
    				width : 865,
    				height : window.innerHeight * 0.8,
  	            callback: 	function (data) {
  	            	if(data !== null ){

    		            }
    				}
  	        });

  		});

  		//장비 편집 팝업
  		$('#changeEqp').on('click', function(e) {

  			var param =  $("#eqpInfForm").getData();
  			param.regYn = "Y";

  			$a.popup({
  	        	popid: 'EqpInfoPopNew',
  	        	title: '장비 시각화',
  	            url: '/tango-transmission-web/configmgmt/equipment/EqpRegPop.do',
  	            data: param,
  			    modal: true,
  			    movable: true,
  			    windowpopup : true,
  			    width : 865,
  			    height : window.innerHeight * 0.77,
  	            callback: 	function (data) {
  	            	if(data !== null ){

    		            }
    				}
  	        });

  		});

  		//선택 장비 편집 팝업
  		$('#changeSelectEqp').on('click', function(e) {

  			var param =  $("#eqpInfSelectForm").getData();
  			param.regYn = "Y";

  			$a.popup({
  	        	popid: 'EqpInfoPopNew',
  	        	title: '장비 시각화',
  	            url: '/tango-transmission-web/configmgmt/equipment/EqpRegPop.do',
  	            data: param,
  			    modal: true,
  			    movable: true,
  			    windowpopup : true,
  			    width : 865,
  			    height : window.innerHeight * 0.77,
  	            callback: 	function (data) {
  	            	if(data !== null ){

    		        }
    			}
  	        });

  		});

  		//수용 회선 조회 팝업
  		$('#acptLine').on('click', function(e) {

  			var param =  $("#trunkInfForm").getData();

  			$a.popup({
  	        	popid: 'IntgE2ETopoAcptLineCurst',
  	        	title: '수용 트렁크 현황',
  	            url: '/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopoAcptLineCurst.do',
  	            data: param,
  			    modal: true,
  			    movable: true,
  			    windowpopup : true,
  			    width : 1200,
  			    height : 600,
  	            callback: 	function (data) {
  	            	if(data !== null ){

    		        }
    			}
  	        });

  		});

  		//수용 트렁크 조회 팝업
  		$('#acptTrk').on('click', function(e) {

  			var param =  $("#ringInfForm").getData();

  			$a.popup({
  	        	popid: 'IntgE2ETopoAcptTrkCurst',
  	        	title: '수용 트렁크 현황',
  	            url: '/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopoAcptTrkCurst.do',
  	            data: param,
  			    modal: true,
  			    movable: true,
  			    windowpopup : true,
  			    width : 1200,
  			    height : 600,
  	            callback: 	function (data) {
  	            	if(data !== null ){

    		        }
    			}
  	        });

  		});


  		//링 시각화 편집 팝업
  		$('#ringInfoPopNew').on('click', function(e) {
  			ringInfoPopNew();
  		});

  		//링 선번 편집 팝업
  		$('#ringInfoPop').on('click', function(e) {
  			ringInfoPop();
  		});

  		//링 구성도 조회 팝업
  		$('#ringInfoDiagramPop').on('click', function(e) {
  			ringInfoDiagramPop();
  		});

  		//트렁크/WDM트렁크 시각화 편집 팝업
  		$('#trunkInfoPopNew').on('click', function(e){
  			trunkInfoPopNew();
  		});

  		//트렁크/WDM트렁크 선번 편집 팝업
  		$('#trunkInfoPop').on('click', function(e){
  			trunkInfoPop();
  		});

  		//트렁크/WDM트렁크 시각화 조회 팝업
  		$('#trunkInfoDiagramPop').on('click', function(e){
  			trunkInfoDiagramPop();
  		});

  		//선번시각화편집
  		$('#serviceLineInfoPopNew').on('click', function(e) {

  			var param = $('#'+serviceGridId).alopexGrid("dataGet", {_state : {selected : true}});

  			if(param.length == 0){
 				//선택된 데이터가 없습니다.
 				callMsgBox('','W', configMsgArray['selectNoData'] , function(msgId, msgRst){});
 				return;
 			}

	  			param[0].ntwkLineNo = param[0].svlnNo;
	  			param[0].ntwkLnoGrpSrno = "1";
	  			param[0].sFlag = "Y";

	  			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
	  				param[0].mgmtGrpCd = mgmtGrpCd;
	  			}
	  			if(gridId != "" && gridId != undefined){
	  				param[0].gridId = gridId;
	  			}else{
	  				param[0].gridId = "dataGridWork";
	  			}

 				$a.popup({
 		        	popid: 'ServiceLineInfoPopNew',
 		        	title: '서비스 회선 시각화',
 		            url: '/tango-transmission-web/configmgmt/cfline/ServiceLineInfoPopNew.do',
 		            data: param[0],
 		            iframe : true,
 				    modal: false,
 				    movable: true,
 				    windowpopup : true,
 				    width : 1400,
 				    height : 940,
 		            callback: 	function (data) {

 	  				}
 		        });

  		});

  		//선번편집
  		$('#serviceLineInfoPop').on('click', function(e) {
  			var param = $('#'+serviceGridId).alopexGrid("dataGet", {_state : {selected : true}});

  			if(param.length == 0){
 				//선택된 데이터가 없습니다.
 				callMsgBox('','W', configMsgArray['selectNoData'] , function(msgId, msgRst){});
 				return;
 			}

  			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
  				param[0].mgmtGrpCd = mgmtGrpCd;
  			}
  			if(gridId != "" && gridId != undefined){
  				param[0].gridId = gridId;
  			}else{
  				param[0].gridId = "dataGridWork";
  			}

  			var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do';
  			var width = 1400;
  			var height = 780;

  			if(param[0].svlnLclCd =="001" && param[0].svlnSclCd == "020"){
  				url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineIpTransLineInfoPop.do';
  				width = 1000;
  				height = 300;
  			}
  			var lineLnoGrpSrno = param[0].lineLnoGrpSrno;
  			if (lineLnoGrpSrno == undefined){
  				lineLnoGrpSrno =null;
  			}
  			$a.popup({
  				popid: "ServiceLIneInfoPop",
  				title: "서비스회선상세정보" /*서비스회선상세정보*/,
  				url: url,
  				data: {"gridId":serviceLineGridId,"ntwkLineNo":param[0].svlnNo,"svlnLclCd":param[0].svlnLclCd,"svlnSclCd":param[0].svlnSclCd,"sFlag":"Y", "ntwkLnoGrpSrno": lineLnoGrpSrno, "mgmtGrpCd":param[0].mgmtGrpCd, "gridId":param[0].gridId },
  				iframe: true,
  				modal : false,
  				movable:true,
  				windowpopup : true,
  				width : width,
  				height : height
  				,callback:function(data){
  					if(data != null){
  					}
  				}
  			});
  		});


  		//선번시각화조회
  		$('#serviceLineInfoDiagramPop').on('click', function(e) {

  			var param = $('#'+serviceGridId).alopexGrid("dataGet", {_state : {selected : true}});

  			if(param.length == 0){
 				//선택된 데이터가 없습니다.
 				callMsgBox('','W', configMsgArray['selectNoData'] , function(msgId, msgRst){});
 				return;
 			}

  			if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
  				param[0].mgmtGrpCd = mgmtGrpCd;
  			}
  			if(gridId != "" && gridId != undefined){
  				param[0].gridId = gridId;
  			}else{
  				param[0].gridId = "dataGridWork";
  			}

	  			param[0].ntwkLineNo = param[0].svlnNo;
	  			param[0].ntwkLnoGrpSrno = "1";
	  			param[0].sFlag = "Y";

 				$a.popup({
 		        	popid: 'ServiceLineInfoDiagramPop',
 		        	title: '서비스 회선 시각화',
 		            url: '/tango-transmission-web/configmgmt/cfline/ServiceLineInfoDiagramPop.do',
 		            data: param[0],
 		            iframe : true,
 				    modal: false,
 				    movable: true,
 				    windowpopup : true,
 				    width : 1400,
 				    height : 940,
 		            callback: 	function (data) {

 	  				}
 		        });

  		});

  		//포트정보 표시
  		$('input:checkbox[id="viewPort"]').on('click', function(e){
  			viewPort();
        });

  		//링/트렁크 정보 표시
  		$('input:checkbox[id="viewNtwk"]').on('click', function(e){
  			viewNtwk();
        });

  		$('#btnRefresh').on('click', function(e){

  			var param = null;
  	    		param =  $("#searchForm").getData();

    		if(JSON.stringify($("#idSelect").getSelectedData()) != null && JSON.stringify($("#idSelect").getSelectedData()) != "null"){
    			var searchId = "";
    			searchId = JSON.stringify($("#idSelect").getSelectedData().searchId);
    			param.searchId = searchId.replace(/"/g, "");
    		}else{
    			if($("#searchNm").val() == ""){
    				param.searchId = "";
    			}else{
    				param.searchId = $("#searchId").val();
    			}
    		}

    		if(param.searchId == ""){
	   			 callMsgBox('','W', '갱신 할 검색 조건을 입력하십시오.', function(msgId, msgRst){});
	   			 return;
    		}

    		$('body').progress();
  			httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/execEqpRefresh', param, 'GET', 'execEqpRefresh');
        });


    	//조회
		 $('#btnSearch').on('click', function(e) {
	     	//tango transmission biz 모듈을 호출하여야한다.
			 setTopology();
			 //TestData();		// 테스트 데이타 Input
	     });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setTopology();
       		}
     	 });

	};

	//지도표시 화면에서 호출하는 부분
	window.paramInfo = function(){
		var ringLatLng = [];

		for(var i=0; i<linkDataArray.length; i++){
			 var cnt = 0;
			 for(var j=0; j<ringLatLng.length; j++){
				 if(ringLatLng[j] == "["+linkDataArray[i].lftVal+"],["+linkDataArray[i].rghtVal+"]"){
					 cnt++;
					 break;
				 }
			 }
			 if(linkDataArray[i].lftVal != "undefined,undefined" && linkDataArray[i].rghtVal != "undefined,undefined"){
				 if(linkDataArray[i].lftVal != undefined && linkDataArray[i].rghtVal != undefined){
					 if(linkDataArray[i].lftVal.replace(" , ", "") != "" && linkDataArray[i].rghtVal.replace(" , ", "") != ""){
						 if(cnt == 0){
							 ringLatLng[ringLatLng.length] = "["+linkDataArray[i].lftVal+"],["+linkDataArray[i].rghtVal+"]"
						 }
					 }
				 }
			 }
		 }

		var ntwkLineNo = "";
		if(JSON.stringify($("#idSelect").getSelectedData()) != null && JSON.stringify($("#idSelect").getSelectedData()) != "null"){
			var searchId = "";
			searchId = JSON.stringify($("#idSelect").getSelectedData().searchId);
			ntwkLineNo = searchId.replace(/"/g, "");
		}else{
			if($("#searchNm").val() == ""){
				ntwkLineNo = "";
			}else{
				ntwkLineNo = $("#searchId").val();
			}
		}

		 var param = {"ringLatLng": ringLatLng, "mtsoId": dupMtsoId, "ntwkLineNo": ntwkLineNo, "flag": mapFlag};

		 return param;
	};

	//링크 선택 시 해당 구간 그리드에 선택표시
	function linkSelect(e, link){
		var dataList = AlopexGrid.trimData($('#'+pathGridId).alopexGrid("dataGet"));
		for(var idx = 0; idx < dataList.length; idx++ ) {
			if(link.data.eqpSctnId == dataList[idx].eqpSctnId) {
				$('#'+pathGridId).alopexGrid('rowSelect', {_index: {row:idx}}, true);
			}
		}
	}

	//아이콘 선택시 색상 변경
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

	//국사 선택 시 국사정보조회
	function mtsoInfSelect(e, obj){
		//폼값 초기화
		$("#eqpInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	$("#mtsoInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	$("#mtsoInfSelect").show();
    	$("#eqpInfSelect").hide();
    	$("#linkInfSelect").hide();

    	$('body').progress();

		var mtsoId = obj.part.data.key;
		var param = {"mtsoId" : mtsoId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', param, 'GET', 'mtsoInfSelect');
	}

	//Layer2의 국사 선택 시 국사정보조회
	function mtsoInfSelect2(e, obj){

		var mtsoId = obj.part.data.mtsoId;
		if(mtsoId != null && mtsoId != undefined){
			//폼값 초기화
			$("#eqpInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
			$("#mtsoInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
			$("#mtsoInfSelect").show();
			$("#eqpInfSelect").hide();
			$("#linkInfSelect").hide();

			$('body').progress();

			var param = {"mtsoId" : mtsoId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', param, 'GET', 'mtsoInfSelect');
		}
	}

	//장비 선택 시 장비정보조회
	function eqpInfSelect(e, obj){
		//폼값 초기화
    	$("#eqpInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	$("#mtsoInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	$("#mtsoInfSelect").hide();
    	$("#eqpInfSelect").show();
    	$("#linkInfSelect").hide();

    	$('body').progress().remove();

		var eqpId = obj.part.data.eqpId;
		var param = {"eqpId" : eqpId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpInfSelect');
	}

	function test(e, link){
		var a =link.data;
	}

	this.lowEqpData = function(data){
		var strCnt = 0;
		var testNode=[];
		var allChk = 0;

		if(data == "ALL"){
			/*for(var j=0; j<addNodeDataTemp.length; j++){
				myDiagram.model.removeNodeData(addNodeDataTemp[j]);
			}
			for(var j=0; j<addLinkDataTemp.length; j++){
				myDiagram.model.removeLinkData(addLinkDataTemp[j]);
			}
			addNodeDataTemp.length = 0;
			addLinkDataTemp.length = 0;*/

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
				/*for(var j=0; j<addNodeDataTemp.length; j++){
					//추가로 생긴 템프노드들 중에 지금 선택한 노드가 없으면 신규 시작점으로 보고 이미 생긴 추가 노드들을 삭제한다.
					if(nodeTemp.data.eqpId == addNodeDataTemp[j].eqpId){
						c++;
					}
				}*/
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

					nodeData = { key: resObj.rghtEqpId, name: resObj.rghtEqpNm, source: src, loc: resObj.loc, eqpId: resObj.rghtEqpId, eqpRoleDivCd: resObj.rghtEqpRoleDivCd, eqpRoleDivNm: resObj.rghtEqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: true, category: "nodeData2", group: resObj.rghtMtsoId, lftEqpMdlId : resObj.lftEqpMdlId, lftEqpMdlNm : resObj.lftEqpMdlNm, rghtEqpMdlId : resObj.rghtEqpMdlId, rghtEqpMdlNm : resObj.rghtEqpMdlNm};
					myDiagram.model.addNodeData(nodeData);
					addNodeDataTemp[addNodeDataTemp.length] = nodeData;

					linkData = { eqpSctnId: resObj.eqpSctnId, from: addKey, lftEqpId: resObj.lftEqpId, lftEqpNm: resObj.lftEqpNm, to: resObj.rghtEqpId, rghtEqpId: resObj.rghtEqpId, rghtEqpNm: resObj.rghtEqpNm, curviness: 0, lftEqpMdlId : resObj.lftEqpMdlId, lftEqpMdlNm : resObj.lftEqpMdlNm, rghtEqpMdlId : resObj.rghtEqpMdlId, rghtEqpMdlNm : resObj.rghtEqpMdlNm };
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

	//링크 선택 시 링크정보조회
	function linkInfSelect(e, link){
		//폼값 초기화
    	$("#eqpInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	$("#mtsoInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	$("#mtsoInfSelect").hide();
    	$("#eqpInfSelect").hide();
    	$("#linkInfSelect").show();

    	$('#pageNo').val(1);
    	$('#rowPerPage').val(100);

    	 var param =  $("#linkInfSelectForm").getData();
    	 param.lftEqpId = link.data.lftEqpId.replace("DU","DV").replace("RN","DV");
    	 param.rghtEqpId = link.data.rghtEqpId.replace("DU","DV").replace("RN","DV");

		 $('#'+fromGridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/fromLinkInf', param, 'GET', 'from');

		 $('#'+toGridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/toLinkInf', param, 'GET', 'to');
	}

	// 국사수정 팝업
	function mtsoDtlLkupPop(e, obj){

		var mtsoId = obj.part.data.mtsoId;
		var param = {"mtsoId" : mtsoId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', param, 'GET', 'mtsoInfData');

	}

	// 해당국사 장비목록 팝업(해당 국사에 대하여)
	function eqpListPop(e, obj){

		var mtsoId = obj.part.data.mtsoId;
		var param = {"mtsoId" : mtsoId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', param, 'GET', 'eqpInfData');

	}

	// 중복국사 관리
	function DupMtsoPop(e, obj){

		var mtsoId = obj.part.data.mtsoId;
		var param = {"mtsoId" : mtsoId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', param, 'GET', 'DupMtsoInfData');

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

    		var myDiagramDiv = document.getElementById('myDiagramDiv');
    		myDiagramDiv.appendChild(a);
    		a.click();
    		setTimeout(function(){
    			myDiagramDiv.removeChild(a);
    		}, 100);
    	}

    }

	function gisM(){
		gisMap.$('body').progress();
		var param =  $("#ringInfForm").getData();
		httpRequest('tango-transmission-gis-biz/transmission/gis/nm/ringinfo/getRingCreateMapList', param, 'GET', 'ringCreatList');
	}

	// 링 생성 지도 or 국사 지도에 표시 tpFlag = true 는 국사지도
    function drawRingMap(drawType){

    	if(ringCableAndNodeData == null){
    		return;
    	}

    	var nodeList = [];

		// 링 생성 지도
		if(drawType == 1){
			nodeList = ringCableAndNodeData.nodeList;

		}else if(drawType == 2){ // 링 생성 - 국사 3 일때는 링 입력지도
			for(var i=0; i<ringCableAndNodeData.nodeList.length;i++){
				if(ringCableAndNodeData.nodeList[i].mgmtNo.indexOf('TP') >-1){
					nodeList.push(ringCableAndNodeData.nodeList[i]);
				}
			}
		}

		currentMapType = drawType;

		mgMap = gisMap.window.mgMap;
		L = gisMap.window.L;
		Object = gisMap.window.Object;

		setCustomStyle();

		var result = {
	        features :createFeatures(ringCableAndNodeData.cableList).concat(createFeatures(nodeList))
	    };


		if ($.TcpUtils.isEmpty(mgMap)) {
			alert('지도객체 정보가 없습니다.');
			return;
		}

		var labelInfo = {};

		labelInfo.features = [];
		for(var i=0; i<result.features.length; i++){
			var feature =  $.extend({}, {}, result.features[i]);

	   	   	if(feature.properties.fcltNm == null){
	   	   		continue;
	   	   	}
	   	   	feature.geometry = $.extend({}, {}, feature.geometry);
	   	   	if(feature.geometry.type.toUpperCase() != 'POINT'){
	   	   		if(drawType == 2){
	   	   			continue;
	   	   		}
		   	   	var coord = $.merge([], feature.geometry.coordinates);
	   	   		var center = getCenter3(feature.geometry.type, coord, mgMap);
	   	   		feature.geometry.type = 'Point';
	   	   		feature.geometry.coordinates = [center.lng, center.lat];
	   	   	}

	   	   	var addFlag = true;
	   	   	for(var j=0; j<labelInfo.features.length; j++){
	   	   		if(labelInfo.features[j].properties.fcltNm == feature.properties.fcltNm){
	   	   			addFlag = false;
	   	   			break;
	   	   		}
	   	   	}
	   	   	if(addFlag){
	   	   		labelInfo.features.push(feature)
	   	   	}
		}
		if(ringLayer == null){
			ringLayer = mgMap.addCustomLayerByName('RING_MAP_LAYER');
			ringLabelLayer = mgMap.addCustomLayerByName('RING_LABEL_MAP_LAYER');
		}else{
			ringLayer.clearLayers();
			ringLabelLayer.clearLayers();
		}
	    //사용자레이어에 Features 추가
		ringLayer.addData(result);
		ringLabelLayer.addData(labelInfo);

	    if(ringLayer.getLayers().length > 0) {
            //해당 명칭의 사용자레이어의 전체 영역 이동
            mgMap.fitBounds(ringLayer.getBounds());

            for(var key in ringLabelLayer._layers){
    			var layer = ringLabelLayer._layers[key];
				layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.fcltNm})));
    		}
        }
	    mgMap = null;
	    L = null;
	    ringLayer = null;
	    ringLabelLayer = null;
	    gisMap.$('body').progress().remove();
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
						nodedata[nodecnt++] = {nodekey:frkey, mtsoId:lftMtsoId,mtsoNm:lftMtsoNm,mtsoTypCd:lftMtsoTypCd,eqpId:lftEqpId,eqpNm:lftEqpNm,shortNm:shortname,eqpRoleDivCd:lftEqpRoleDivCd,eqpRoleDivNm:lftEqpRoleDivNm,lineSctnLnoSrno:lftLineSctnLnoSrno,mgmtGrpNm:mgmtGrpNm,source:"",loc:"", eqpMdlId : lftEqpMdlId, eqpMdlNm : lftEqpMdlNm};
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
								nodedata[nodecnt++] = {nodekey:tokey, mtsoId:rghtMtsoId,mtsoNm:rghtMtsoNm,mtsoTypCd:rghtMtsoTypCd,eqpId:rghtEqpId,eqpNm:rghtEqpNm,shortNm:shortname,eqpRoleDivCd:rghtEqpRoleDivCd,eqpRoleDivNm:rghtEqpRoleDivNm,lineSctnLnoSrno:rghtLineSctnLnoSrno,mgmtGrpNm:mgmtGrpNm,source:"",loc:"", eqpMdlId : rghtEqpMdlId, eqpMdlNm : rghtEqpMdlNm};
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
				nodedata[nodecnt++] = {mtsoId:sctnData[i].lftMtsoId, mtsoNm:sctnData[i].lftMtsoNm, mtsoTypCd:sctnData[i].lftMtsoTypCd};
				mtsoTmp[mtsoTmp.length] = sctnData[i].lftMtsoId;
			}

			if(cntRght == 0 && sctnData[i].rghtMtsoId != "" && sctnData[i].rghtMtsoId != undefined && sctnData[i].lftMtsoId != sctnData[i].rghtMtsoId){
				nodedata[nodecnt++] = {mtsoId:sctnData[i].rghtMtsoId, mtsoNm:sctnData[i].rghtMtsoNm, mtsoTypCd:sctnData[i].rghtMtsoTypCd};
				mtsoTmp[mtsoTmp.length] = sctnData[i].rghtMtsoId;
			}

			if(sctnData[i].lftMtsoId != sctnData[i].rghtMtsoId){
				linkdata[linkcnt++] = {lftMtsoId:sctnData[i].lftMtsoId, lftVal:sctnData[i].lftMtsoLngVal+","+sctnData[i].lftMtsoLatVal, rghtMtsoId:sctnData[i].rghtMtsoId, rghtVal:sctnData[i].rghtMtsoLngVal+","+sctnData[i].rghtMtsoLatVal};
			}

		}

		sctnresponse.nodeData = nodedata;
		sctnresponse.linkData = linkdata;

		return sctnresponse
	}

	function successCallback(response, status, jqxhr, flag){

		if(flag == "linePathList"){
			$("#pathSearch").show();
			$('#'+pathGridId).alopexGrid('hideProgress');
    		$('#'+pathGridId).alopexGrid('dataSet', response.linePathData);
		}

		if(flag == "ntwkPathList"){
			$("#pathSearch").show();
			$('#'+pathGridId).alopexGrid('hideProgress');
    		$('#'+pathGridId).alopexGrid('dataSet', response.ntwkPathData);
		}

		//선택 국사
		if(flag == "mtsoInfSelect"){
			$('body').progress().remove();
			$('#mtsoInfSelectForm').setData(response.mtsoMgmtList[0]);
		}

		//선택 장비
		if(flag == "eqpInfSelect"){
			$('body').progress().remove();
			$('#eqpInfSelectForm').setData(response.eqpMgmtList[0]);
		}

		//선택 링크
		if(flag == 'from') {
    		$('#'+fromGridId).alopexGrid('hideProgress');
    		setSPGrid(fromGridId, response, response.fromLinkInf);
    	}

		//선택 링크
    	if(flag == 'to') {
    		$('#'+toGridId).alopexGrid('hideProgress');
    		setSPGrid(toGridId, response, response.toLinkInf);
    	}

		//검색 국사
		if(flag == "mtsoInfSearch"){
			$("#eqpInfSearch").hide();
	    	$("#mtsoInfSearch").show();
	    	$("#serviceLineInfSearch").hide();
	    	$("#ringInfSearch").hide();
	    	$("#trunkInfSearch").hide();
			$('#mtsoInfForm').setData(response.mtsoMgmtList[0]);
		}

		//검색 장비
		if(flag == "eqpInfSearch"){
			$("#eqpInfSearch").show();
	    	$("#mtsoInfSearch").hide();
	    	$("#trunkInfSearch").hide();
	    	$("#serviceLineInfSearch").hide();
	    	$("#ringInfSearch").hide();
			$('#eqpInfForm').setData(response.eqpMgmtList[0]);
		}

		//검색 서비스회선
		if(flag == "serviceLineInfSearch"){
			$("#eqpInfSearch").hide();
	    	$("#mtsoInfSearch").hide();
	    	$("#trunkInfSearch").hide();
	    	$("#serviceLineInfSearch").show();
	    	$("#ringInfSearch").hide();

	    	mgmtGrpCdParam = response.serviceLineInfList[0].mgmtGrpCd;
	    	svlnSclCdParam = response.serviceLineInfList[0].svlnSclCd;

			$('#'+serviceLineGridId).alopexGrid('hideProgress');
    		$('#'+serviceLineGridId).alopexGrid('dataSet', response.serviceLineInfList);
    		$('#'+serviceLineGridId).alopexGrid('rowSelect', {_state : {selected : false}}, true);


    		$('#searchNm').val(response.serviceLineInfList[0].lineNm+" ["+response.serviceLineInfList[0].svlnNo+"]");

    		var param = $('#'+serviceLineGridId).alopexGrid("dataGet", {_state : {selected : true}});

			httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/linePathList', param[0], 'GET', 'linePathList');
		}

		//검색 링
		if(flag == "ringInfSearch"){
			$("#eqpInfSearch").hide();
	    	$("#mtsoInfSearch").hide();
	    	$("#trunkInfSearch").hide();
	    	$("#serviceLineInfSearch").hide();
	    	$("#ringInfSearch").show();
	    	$('#ringInfForm').setData(response.ringInfSearchData[0]);

		}

		//검색 트렁크
		if(flag == "trunkInfSearch"){
			$("#eqpInfSearch").hide();
	    	$("#mtsoInfSearch").hide();
	    	$("#serviceLineInfSearch").hide();
	    	$("#ringInfSearch").hide();
	    	$("#trunkInfSearch").show();
	    	$('#trunkInfForm').setData(response.ringInfSearchData[0]);

		}

		if(flag == 'from') {
    		$('#'+fromGridId).alopexGrid('hideProgress');
    		setSPGrid(fromGridId, response, response.fromLinkInf);
    	}

		// 국사수정팝업(2)
		if(flag == "mtsoInfData"){

			var param = response.mtsoMgmtList[0];
			param.regYn = "Y";

			eqpPopup('MtsoDtlLkup', '/tango-transmission-web/configmgmt/common/MtsoRegPop.do', '국사 시각화', param);

		}

		// 해당국사 장비목록 팝업(해당 국사에 대하여)
		if(flag == "eqpInfData"){

			var param = response.mtsoMgmtList[0];
			param.closeYn = "N"
			$a.popup({
	          	popid: 'EqpLkup',
	          	title: configMsgArray['findEquipment'],
	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
	            data: param,
	            modal: true,
		        windowpopup : true,
	            movable:true,
	            width : 950,
	           	height : window.innerHeight * 0.83,
	      });

		}

		// 중복국사 관리
		if(flag == "DupMtsoInfData"){

			var param = response.mtsoMgmtList[0];
			param.closeYn = "Y"
			$a.popup({
	          	popid: 'EqpLkup',
	          	title: configMsgArray['findEquipment'],
	            url: '/tango-transmission-web/configmgmt/common/DupMtsoMgmt.do',
	            data: param,
	            modal: true,
		        windowpopup : true,
	            movable:true,
	            width : 1200,
	           	height : window.innerHeight * 0.83,
	      });

		}

		//GIS 맵 조회
		if(flag == "ringCreatList"){
			ringCableAndNodeData = response.resultData;
			drawRingMap(1);
		}

		//국사 조회
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

    		for(var i=0; i<nodeData.length; i++){
    			var resObj = nodeData[i];
    			var everexpand = false;
    			var src = null;
    			var locYS = 0;
    			var cntA = 40;
    			var cntB = 80;

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
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,255,0.1)", isGroup: true, mtsoYn: "YES" });
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
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(0,128,0,0.1)", isGroup: true, mtsoYn: "YES" });
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
    					nodeDataArray.push({ key: resObj.mtsoId, name: resObj.mtsoNm, mtsoId: resObj.mtsoId, mtsoTypCd: resObj.mtsoTypCd, category: "newGroup", color: "rgba(187,187,0,0.1)", isGroup: true, mtsoYn: "YES" });
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
	    				nodeDataArray.push({ key: resObj.nodekey, eqpId: resObj.eqpId, name: resObj.eqpNm, shortNm: resObj.shortNm, lineSctnLnoSrno: resObj.lineSctnLnoSrno, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, category: "nodeData2", source: src, loc: resObj.loc, everExpanded: false, isTreeExpanded: true, group: resObj.mtsoId, btnVisible: btnVisible, eqpMdlId : resObj.eqpMdlId, eqpMdlNm : resObj.eqpMdlNm});
	    			}else{
	    				nodeDataArray.push({ key: resObj.nodekey, eqpId: resObj.eqpId, name: resObj.eqpNm, shortNm: resObj.shortNm, lineSctnLnoSrno: resObj.lineSctnLnoSrno, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, category: "nodeData2", source: src, loc: resObj.loc, everExpanded: false, isTreeExpanded: true, group: resObj.mtsoId, btnVisible: btnVisible, eqpMdlId : resObj.eqpMdlId, eqpMdlNm : resObj.eqpMdlNm});
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

    	//+버튼 클릭 시 data 조회
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
	    						nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, eqpId: resObj.eqpId, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: resObj.mtsoId, eqpMdlId : resObj.eqpMdlId, eqpMdlNm : resObj.eqpMdlNm};
	    						myDiagram.model.addNodeData(nodeData);
	    						addNodeDataTemp[addNodeCnt++] = nodeData;
	    				}else{
							nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, eqpId: resObj.eqpId, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: resObj.mtsoId, eqpMdlId : resObj.eqpMdlId, eqpMdlNm : resObj.eqpMdlNm};
    						myDiagram.model.addNodeData(nodeData);
    						addNodeDataTemp[addNodeCnt++] = nodeData;
	    				}
					}else{
							nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, eqpId: resObj.eqpId, eqpRoleDivCd: resObj.eqpRoleDivCd, eqpRoleDivNm: resObj.eqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: resObj.mtsoId, eqpMdlId : resObj.eqpMdlId, eqpMdlNm : resObj.eqpMdlNm};
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

			//포트 표시 여부
//			viewPort();
			//링/트렁크 표시 여부
//			viewNtwk();

//			myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
			$('body').progress().remove();
    	}

//    	if(flag == "addLowEqpList"){
////    		var html = "";
//            if(response.lowEqpData.length > 0){
////            	html += "<li class='af-menuitem'><a href=javascript:main.lowEqpData('ALL')>전체 선택</a></li>";
//            	lowEqpParam = response.lowEqpData;
//            	var testObj = {rghtEqpNm:"전체",rghtEqpId:"ALL"};
//            	lowEqpParam.unshift(testObj);
////
////            	for(var i=0; i<response.lowEqpData.length; i++){
////            		var resObj = response.lowEqpData[i];
////            		html += "<li class='af-menuitem'><a href=javascript:main.lowEqpData('"+resObj.rghtEqpId+"')>"+resObj.rghtEqpNm+"</a></li>";
////            	$('#menuListGrid').alopexGrid('dataSet', lowEqpParam, "");
//            }else{
//            	$('#menuListGrid').alopexGrid("dataEmpty");
//            }
////            }else{
////            	html += "<li class='af-menuitem'>data가 없습니다.</li>";
////            }
////
////            document.getElementById("lowEqpPop").innerHTML = html;
//            $('#menuListGrid').alopexGrid('hideProgress');
//
//
//		}

//    	if(flag == "execEqpRefresh"){
//    		$('body').progress().remove();
//    		if(response.Result == "Success"){
//
//	    		//갱신이 완료 되었습니다.
//	    		callMsgBox('','I', '갱신이 완료 되었습니다.' , function(msgId, msgRst){
//	    			if (msgRst == 'Y') {
//	    				setTopology();
//						 $a.close();
//		    		}
//		    	 });
//    		}else if(response.Result == "Fail"){
//
//	    		//갱신이 실패 하였습니다.
//	    		callMsgBox('','I', '갱신을 실패 하였습니다.' , function(msgId, msgRst){
//	    			if (msgRst == 'Y') {
//						 $a.close();
//		    		}
//		    	 });
//    		}
//    	}
    }


	function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
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

    function setTopology(data) {
//    	document.getElementById("rightImageDiv").style.display = "block";
//        document.getElementById("menuList").style.display = "block";
//        mContainer.style.marginRight = startX + 5 + "px";
//        document.all.rightImage.src = "../../resources/images/img_menu_close.png";
//        $('#menuListGrid').alopexGrid("dataEmpty");
        document.getElementById("zoom").style.marginLeft = "96%";

    	var param = null;
    	if(data == null){
    		param =  $("#searchForm").getData();

    		if(JSON.stringify($("#idSelect").getSelectedData()) != null && JSON.stringify($("#idSelect").getSelectedData()) != "null"){
    			var searchId = "";
    			searchId = JSON.stringify($("#idSelect").getSelectedData().searchId);
    			param.searchId = searchId.replace(/"/g, "");
    		}else{
    			if($("#searchNm").val() == ""){
    				param.searchId = "";
    			}else{
    				param.searchId = $("#searchId").val();
    			}
    		}
    	}else{
    		param =  $("#searchForm").getData();
    		param.searchTarget = data.searchTarget;
    		param.searchId = data.searchId;
    		param.searchNm = data.searchNm;
    	}

    	var searchT =  $("#searchTarget").getData();
    	var flag = "";

    	//선택된 노드값
    	/*var n = myDiagram.selection.first();
    	var d = null;
    	var m = null;
    	if(n != null && n.data.category != "Super" && n.data.category != "Super3"){
    		d = n.data.eqpId;
    		m = n.data.mtsoYn;
    	}*/

    	if(param.searchId == ""){
			 callMsgBox('','W', '검색 조건을 입력하십시오.', function(msgId, msgRst){});
			 return;
		}

    	//조회방식 값
    	var searchLayer = $('#searchLayer').getValue();
    	//조회범위 값
    	var searchFDFYN = $('#searchFDFYN').getValue();

    	//폼값 초기화
    	$("#eqpInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	$("#mtsoInfSelectForm").closest('form').find('input[type="text"], textarea, select').val('');
    	//layer1을 제외하고는 장비정보를 보여준다
    	$("#mtsoInfSelect").hide();
    	$("#eqpInfSelect").hide();
    	$("#pathSearch").hide();
    	cnt1 = 0;
    	cnt2 = 0;
    	cnt3 = 0;
    	cnt4 = 0;
    	cnt9 = 0;
        dupMtsoId.length = 0;
    	cntT = 0;

    	$('body').progress();

    	if(searchT.searchTarget == "SRVN" && param.searchId != ""){//서비스회선번호 검색 시
    		searchData = "serviceLineData";
    		searchNm = $("#searchNm").val()+"_서비스회선";
    		$('#'+pathGridId).alopexGrid('showCol','trkNm');
    		$('#'+pathGridId).alopexGrid('showCol','ringNm');
			//서비스회선정보 조회
			httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/serviceLineInfList', param, 'GET', 'serviceLineInfSearch');

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
    	}else if(searchT.searchTarget == "MTSO" && param.searchId != ""){//국사로 검색 시
			searchData = "mtsoData";
			searchNm = $("#searchNm").val()+"_국사";
			param.searchGubun = "mtsoDataForMtso";
			flag = "mtsoData"
    	}else if(searchT.searchTarget == "EQP" && param.searchId != ""){//장비로 검색 시
    		searchData = "eqpData";
    		searchNm = $("#searchNm").val()+"_장비";
    		param.eqpId = param.searchId;
    		//선택한 노드가 없을때
			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpInfSearch');

			if(searchLayer == "M"){
				if(searchFDFYN == "Y"){
					param.searchGubun = "eqpDataForMtsoLink";
					flag = "mtsoData"
				}else{
					param.searchGubun = "eqpDataForMtso";
					flag = "mtsoData"
				}
			}else{
				if(searchFDFYN == "Y"){
					param.searchGubun = "eqpDataForEqpLink";
					flag = "linkData"
				}else{
					param.searchGubun = "eqpDataForEqp";
					flag = "eqpData"
				}
			}
    	}else if((searchT.searchTarget == "RING" || searchT.searchTarget == "TRK") && param.searchId != ""){//링으로 검색 시

    		//링 선번조회
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/ntwkPathList', param, 'GET', 'ntwkPathList');

    		if(searchT.searchTarget == "RING"){
    			searchData = "ringData";
    			searchNm = $("#searchNm").val()+"_링";
    			$('#'+pathGridId).alopexGrid('hideCol','trkNm');
    			$('#'+pathGridId).alopexGrid('hideCol','ringNm');
        		//선택한 노드가 없을때
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/ringInfSearchData', param, 'GET', 'ringInfSearch');
    		}else if(searchT.searchTarget == "TRK"){
    			searchData = "trunkData";
    			searchNm = $("#searchNm").val()+"_트렁크";
    			$('#'+pathGridId).alopexGrid('hideCol','trkNm');
    			$('#'+pathGridId).alopexGrid('showCol','ringNm');
        		//선택한 노드가 없을때
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/ringInfSearchData', param, 'GET', 'trunkInfSearch');
    		}

    		//링/트렁크가 나중에 분리되었지만 쿼리는 같으므로 호출은 걍 링조회 API만 호출
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

//        document.getElementById("lowEqpPop").innerHTML = "";
//        document.getElementById("lowEqpPop").style.left = window.event.clientX + "px";
//        document.getElementById("lowEqpPop").style.top = window.event.clientY + "px";
//        document.getElementById("lowEqpPop").style.display = "block";

//        document.getElementById("rightImageDiv").style.display = "block";

//        $('#menuListGrid').alopexGrid('showProgress');

//        document.getElementById("menuList").style.display = "block";

//	    mContainer.style.marginRight = targetX + "px";
//	    document.all.rightImage.src = "../../resources/images/img_menu_open.png";
//		sideTabToggle = true;

//		document.getElementById("zoom").style.marginLeft = "85%";


//        var param = {"eqpId": data.eqpId};
//        httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/lowEqpList', param, 'GET', 'addLowEqpList');

//        diagram.model.setDataProperty(data, "everExpanded", false);
        //alert(window.event.clientX +":"+ window.event.clientY);
//        $("#lowEqpPopDiv").hide();
        //lowEqpPop(data);
/*        if (!data.everExpanded) {
            diagram.model.setDataProperty(data, "everExpanded", true);
          	createSubTree(data);
            diagram.commandHandler.expandTree(node);
          }else{
          	var linkCnt = 0;
          	var linkTemp = [];
          	if (node.isTreeExpanded) {
//          		var link = node.findTreeParentLink();
//          		var nodes = node.findTreeParts();
          		//          		var links = node.findTreeParts();
          		//          		var aa = linkDataArray;
          		//          		for(var j=0; j<linkDataArray.length; j++){
          		//          			if(linkDataArray[j].rghtEqpId == data.eqpId){
          		//          				linkTemp[linkCnt++] = linkDataArray[j];
          		//          			}
//
//          		}
//          		var aa = node.findTreeParentChain();
//          		var bb = node.findLinkTo();
//          		diagram.removeParts(node.findTreeParts());
//          		var chl = node.findTreeChildrenNodes();
//          		diagram.remove(chl.part);
				//          		chl.each(function(child){
				//          			var chl1 = child.part.findTreeChildrenNodes();
				//          			chl1.each(function(child){
				//          				var chl2 = child.part.findTreeChildrenNodes();
				//          				chl2.each(function(child){
				//          					diagram.removeParts(child.findTreeParts());
				//          				});
				//          				diagram.removeParts(child.findTreeParts());
				//          			});
				//              		diagram.removeParts(child.findTreeParts());
				//              	});
//          		node.findObject('TREEBUTTON').visible = true;
//          		diagram.model.setDataProperty(data, "everExpanded", false);
//          		myDiagram.model.addNodeData(data);
//          		myDiagram.model.addLinkData(link.data);
				//          		for(var h=0; h<linkTemp.length; h++){
				//          				myDiagram.model.addLinkData(linkTemp[h]);
				//
				//          		}
				//          		links.each(function(n){
				//          			if(n.data.from != undefined && n.data.category != "subLink" && n.data.lftEqpId != 'DV10215039928'){
				//          				myDiagram.model.addLinkData(n.data);
				//          			}
				//          		});
          		diagram.commandHandler.collapseTree(node);
//          		node.isTreeExpanded = false;
//          		myDiagram.model.addNodeData(nodeData);
          	} else {
//          		createSubTree(data);
          		var nodes = node.findTreeParts();
          		var a = 0;
          		var b = 0;
          		nodes.each(function(n){
          			a++;
          			if(n.data.key != undefined && n.data.isGroup == undefined){
          				b++;
          				myDiagram.model.removeNodeData(n.data);
          				myDiagram.model.addNodeData(n.data);
          			}
          		});
          		diagram.commandHandler.expandTree(node);
          	}
          }*/

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