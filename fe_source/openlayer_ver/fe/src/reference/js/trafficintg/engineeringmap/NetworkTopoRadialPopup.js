let myDiagram;
let mtsoId;
let lineDivVals;
let netBdgmNetDivVal;
let perPage = 10;
let uniqueLineDivVals = [];
let uniqueEqpIds = [];

let main = $a.page(function() {

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	// 호출시Title 지정이 않되서 강제 지정
    	$(document).context.title = param.title;

		mtsoId = param.mtsoId;
		lineDivVals = param.lineDivVals;
		netBdgmNetDivVal = param.netBdgmNetDivVal;

		let arr = (lineDivVals||"").split(",");
		param.lineDivVals = arr;
		uniqueLineDivVals = param.lineDivVals;

		if (netBdgmNetDivVal == "RONT") {
			// 선번장 그리드 초기화
			RadialControl.initLineGrid();

			// 중계노드 그리드 초기화
			RadialControl.initRlyNodeGrid();
		} else {
			// 선번장 부분 안 보이게
			$('#left').hide();
			$('#right').hide();
			$('#ringInfoBox').height(400);
		}

		// 링 정보 그리드 초기화
		RadialControl.initRingInfoGrid();

		RadialControl.initialize(id, param);
		RadialControl.setEventListner();
    }
});

let RadialControl = {

		initialize: function(id, param) {
			let deferred = $.Deferred();

			Util.jsonAjax({
				url: '/transmisson/tes/engineeringmap/networktopo/getTopologyNodeEqpList',
				data:param,
				method:'POST',
				async:false
				}).done(
				function(result) {

					console.log(result);

					if (result.length > 0) {

						RadialControl.initDiagram(result);
						RadialControl.drawDiagram(result);

			            $.each(result, function(index, item) {

			            	if(uniqueEqpIds.indexOf(item["eqpId"]) === -1) {
			            		uniqueEqpIds.push(item["eqpId"]);
			            	}
			            	if(uniqueEqpIds.indexOf(item["toEqpId"]) === -1) {
			            		uniqueEqpIds.push(item["toEqpId"]);
			            	}
			            });

			            param.lineDivVals = uniqueLineDivVals.join(",");
			            param.eqpIds = uniqueEqpIds.join(",");

			            sessionStorage.setItem('param', JSON.stringify(param));

			    		if (netBdgmNetDivVal == "RONT") {
				            // 선번장 그리드 초기화
							RadialControl.setLineDivGrid(param, 1, perPage);

							// 중계노드 그리드 초기화
							let lineDivData = $('#lineDivGrid').alopexGrid("dataGetByIndex", {row:0});
							let grdLineDivData = JSON.stringify(lineDivData);

							if (lineDivData != null && lineDivData != '' && lineDivData != undefined) {
								param.lineDivVal = lineDivData.lineDivVal;
								param.lineSeq = lineDivData.lineSeq;

								RadialControl.setRlyNodeGrid(param, 1, perPage);
							}
			    		}

						// 링 정보 그리드 초기화
						RadialControl.setRingInfoGrid(param, 1, perPage);
					}

					deferred.resolve();

				}.bind(this)
			);

			return deferred.promise();
		},

		// 국사 통합 정보 팝업
		eqpDtlComLkupPop: function (e, key){
			var mtsoGubun, linkTab = "";
			mtsoGubun = "eqp";
			linkTab = "tab_Eqp";

			var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
			var paramData = {
					mtsoEqpGubun :mtsoGubun,
					mtsoEqpId : key,
					parentWinYn : 'Y',
					linkTab : linkTab
			};

			var popMtsoEqp = $a.popup({
				popid: tmpPopId,
				title: '통합 국사/장비 정보',
				url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
				data: paramData,
				iframe: false,
				modal: false,
				movable:false,
				windowpopup: true,
				width : 1300,
				height : window.innerHeight * 0.83
			});
		},

		// 장비실장 정보 팝업f
		eqpMgrInfoPop: function (e, key, eqpNm){
			console.log("eqpDeployDiagPop key : ", key);

			var mtsoGubun, linkTab = "";
			mtsoGubun = "eqp";
			linkTab = "tab_Eqp";

			var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
			var paramData = {mtsoEqpId : key, mEqpNm : eqpNm};

	    	console.log("paramData : ", paramData);
			var popMtsoEqp = $a.popup({
				popid: tmpPopId,
				title: '장비실장정보',
				url: '/tango-transmission-web/configmgmt/commonlkup/EqpMgrInfo.do',
				data: paramData,
				iframe: false,
				modal: false,
				movable:false,
				windowpopup: true,
				width : 1660,
				height : 786
			});
		},

		setEventListner: function() {
	    	// Hide the context menu when clicking elsewhere
	    	$(document).on('click', function hideMenu() {
	    		$('#contextMenuLink').hide();
	    		$('#contextMenuLink').css('z-index', 1);

	    		$('#contextMenuNode').hide();
	    		$('#contextMenuNode').css('z-index', 1);

	    		$(document).off("click", hideMenu);
	    	});

	    	$("#contextMenuLink").on("click", function(e) {
	    		e.stopPropagation();
	    	});

	    	$("#contextMenuNode").on("click", function(e) {
	    		e.stopPropagation();
	    	});

	    	// 기본 윈도우 컨텍스트 메뉴 비활성화
	    	$("#myDiagramDiv").on("contextmenu", function(e) {
	    		e.preventDefault();	// 브라우저 기본 메뉴 차단
	    	});

	    	$("#contextMenuLink ul li").on("click", function(e) {
	    		let menuId = $(this).attr('id');
	    		let $context = $("#contextMenuLink");

	    		if(menuId === 'mapview') {	// ETE 선로 조회
	    			let popParams = {};

	    			popParams.fromEqpId = $context.data("fromEqpId");
	    			popParams.toEqpId   = $context.data("toEqpId");
	    			popParams.fromMtsoId = $context.data("fromMtsoId");
	    			popParams.toMtsoId = $context.data("toMtsoId");
	    			popParams.lineDivVal = lineDivVals;

	    			// 유선 엔지니어링 맵 에서 ETE 선로 조회시
	    			if(opener && typeof opener.randerLnMapView === 'function') {
	    				opener.randerLnMapView(popParams);
	    			} else { // 망 구성도 에서 ETE 선로 조회시
	    			opener.parent.opener.randerLnMapView(popParams);
	    			}

	    		} else if (menuId === 'ring') {	// 링 정보(구성)
	    			let popParams = {};
//	    			popParams.fromEqpId = $context.data("fromEqpId");
//	    			popParams.toEqpId   = $context.data("toEqpId");
	    			popParams.fromMtsoId = $context.data("fromMtsoId");
	    			popParams.toMtsoId = $context.data("toMtsoId");

	    			$a.popup({
	        			url: "/tango-transmission-web/trafficintg/engineeringmap/RingInfoPopup.do", // 팝업에 표시될 HTML
	        			iframe: true, // default,
	        			modal: false,
	    				movable:true,
	        			windowpopup: true,
	        			data: popParams,
	        			width: 830,
	        			height : 650,
	    				callback : function(data) { // 팝업창을 닫을 때 실행

	    		    	}
	        		});

	    		} else if (menuId === 'ringList') { // 링목록(GIS)
	    			let popParams = {};
	    			popParams.fromEqpId = $context.data("fromEqpId");
	    			popParams.toEqpId   = $context.data("toEqpId");

	    			$a.popup({
	    				url: "/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoRingList.do", // 팝업에 표시될 HTML
	        			iframe: true, // default,
	        			modal: false,
	    				movable:true,
	        			windowpopup: true,
	        			data: popParams,
	        			width: 1000,
	        			height : 650,
	    				callback : function(data) { // 팝업창을 닫을 때 실행

	    		    	}
	        		});
	    		}

	    		$('#contextMenuLink').hide();
	    		$('#contextMenuLink').css('z-index', 1);
	    	});

	    	$("#contextMenuNode ul li").on("click", function(e) {
	    		let menuId = $(this).attr('id');
	    		let $contextMenu = $("#contextMenuNode");
    			let key = $contextMenu.data('key');
    			let eqpNm = $contextMenu.data('eqpNm');

	    		if(menuId === 'eqpintg') {	// 장비통합정보
	    			// 국사 통합 정보 팝업
	    			let deviceId = key;
	    			RadialControl.eqpDtlComLkupPop(e, deviceId);

	    		} else if (menuId === 'eqpmgr') { // 장비실장정보
	    			RadialControl.eqpMgrInfoPop(e, key, eqpNm);
	    		}

	    		$('#contextMenuNode').hide();
	    		$('#contextMenuNode').css('z-index', 1);

	    	});

	    	// 페이지 번호 클릭시
			$('#lineDivGrid').on('pageSet', function(e) {
				let eObj = AlopexGrid.parseEvent(e);
				let param = JSON.parse(sessionStorage.getItem('param'));

				RadialControl.setLineDivGrid(param, eObj.page, eObj.pageinfo.perPage);
			});

			// 페이지 selectbox를 변경했을 시.
			$('#lineDivGrid').on('perPageChange', function(e) {
				let eObj = AlopexGrid.parseEvent(e);
				let param = JSON.parse(sessionStorage.getItem('param'));

				perPage = eObj.perPage;
				RadialControl.setLineDivGrid(param, 1, eObj.perPage);
			});

			$('#lineDivGrid').on('click', '.bodycell', function(e){
				let eObj = AlopexGrid.parseEvent(e);
				let dataObj = AlopexGrid.parseEvent(e).data;
				let param = {"lineDivVal":dataObj.lineDivVal, "lineSeq":dataObj.lineSeq};

				RadialControl.setRlyNodeGrid(param, 1, eObj.perPage);
			});
	    },

		initDiagram : function(result) {

			// GoJS Diagram 정의
            let $ = go.GraphObject.make;
            myDiagram = $(go.Diagram, "myDiagramDiv", {
            	initialContentAlignment: go.Spot.Center,
            	layout: $(go.ForceDirectedLayout)
            });

            // 사용자 정의 방사형 레이아웃 정의
            function RadialLayout() {
                go.Layout.call(this);
            }

            go.Diagram.inherit(RadialLayout, go.Layout);

            RadialLayout.prototype.doLayout = function(call) {

                let diagram = this.diagram;

                if (diagram === null) {
                	return;
                }

                let nodes = diagram.nodes;
                let centerNode = nodes.first(); // 중심 노드
                let radius = 150; // 방사형으로 배치할 반경
                let angleStep = 360 / (nodes.count - 1); // 각도간격계산

                // 중심 노드를 중앙에 배치
                centerNode.location = new go.Point((diagram.viewportBounds.width/2),(diagram.viewportBounds.height/2));

                // 나머지 노드를 방사형으로 배치
                let i = 0;
                nodes.each(function(node) {
                    if(i > 0) {
                    	let angle = i * angleStep;
                    	let radian = (angle * Math.PI) / 180; // 각도를 라디안으로 변환
                    	let x = centerNode.location.x + radius * Math.cos(radian);
                    	let y = centerNode.location.y + radius * Math.sin(radian);
                        node.location = new go.Point(x, y);
                    }
                    i++;
                });
            }

            // 다이어그램에 사용자 정의 레이아웃 적용
            myDiagram.layout = new RadialLayout();

            // 툴팁 노드 포맷
            function formatToolTipNode(nodes) {
    	    	let result = "";
    	    	let title = "";
    	    	for(key in nodes) {
    	    		if(key == "img" || key == "eqpRoleDivCd" || key.indexOf("gohashid") > -1) {
    	    			continue;
    	    		}

    	    		if(key === "key") {
    	    			title = "장비ID";
    	    		} else if (key === "name") {
    	    			title = "장비명";
    	    		} else if (key === "eqpRoleDivCdNm") {
    	    			title = "장비타입";
    	    		}
    	    		result += title + ": " + nodes[key] + "\n";
    	    	}
    	    	return result;
    	    }

            // 툴팁 링크 포맷
            function formatToolTipLink(link) {
    	    	let result = "";
    	    	result = "Link from " + link.from + " to " + link.to;
    	    	return result;
    	    }

            // 노드 템플릿 정의
            myDiagram.nodeTemplate =
            $(go.Node, "Vertical",
            	{
            		toolTip: $(go.Adornment, "Auto",
            			$(go.Shape, {fill: "lightyellow"}),
            			$(go.TextBlock, {margin: 4},
            				new go.Binding("text", "", function(data) {
            					return formatToolTipNode(data);
            				}))
            		),
            		mouseEnter: function(e, obj) {
            			obj.findObject("SHAPE").fill = "lightgreen";
            			obj.findObject("SHAPE").stroke= "red";
            			obj.findObject("SHAPE").strokeWidth = 2;
            		},
            		mouseLeave: function(e, obj) {
            			obj.findObject("SHAPE").fill = "transparent";
            			obj.findObject("SHAPE").stroke= "black";
            			obj.findObject("SHAPE").strokeWidth = 1;
            		}
            	},
            	{
	            	"contextClick": function(e, obj) {
	            		let mousePt = e.diagram.lastInput.viewPoint;
	            		RadialControl.showContextMenu(e, "Node", mousePt.x+60, mousePt.y+60, obj.part.data);
	            	}
            	},
            	{
	            	"doubleClick": function(e, obj) {
	            		let deviceId = obj.part.data.key;
	            		RadialControl.eqpDtlComLkupPop(e, deviceId);
	            	}
            	},
	            $(go.TextBlock,
		            	{
		            	 margin: new go.Margin(0,0,5,0),
		            	 font: "bold 12px sans-serif",
		            	 wrap: go.TextBlock.None,
		            	 textAlign: "center"
		            	},
		            	new go.Binding("text", "eqpRoleDivCdNm")
		            ),
	            $(go.Panel, "Auto",
	    	        $(go.Shape, "Circle", { name: "SHAPE", fill: "transparent", stroke: "black", strokeWidth: 1, width: 50, height: 50 }),
	            	$(go.Picture,
	            		{
	            		width: 50,
	            		height:50,
	            		margin: new go.Margin(5, 0, 0, 0),
	            		},
	            		new go.Binding("source", "img"))
	            ),
	            $(go.TextBlock,
	            	{
	            	 margin: new go.Margin(5,0,0,0),
	            	 font: "bold 10px sans-serif",
	            	 wrap: go.TextBlock.None,
	            	 textAlign: "center"
	            	},
	            	new go.Binding("text", "name")
	            )
            );


            function linkLineInfo(link){
				var textBlock = link.part.findObject("linkLineInfo");
				var linkData = link.part.data;

				var linkTextData = "";

				if (textBlock) {

					if (textBlock.text != "") {
						textBlock.visible = false;
						textBlock.text = linkTextData;
					} else {

						var param ={};
						param.fromMtsoId = linkData.fromMtsoId;
						param.toMtsoId = linkData.toMtsoId;
						param.lineDivVals = linkData.lineDivVal;

						Util.jsonAjax({
							url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getGisRingLnInfo'
						  , data: param
						  , method:'GET'
						  , async:true
						  }).done(
							function(result) {
								if (result != null) {

									var linkDataTemp = result.result.lnInfo.split(",");
									var uniuqeineDivVals = [...new Set(linkDataTemp)]

									linkTextData = uniuqeineDivVals.join("\r\n");

									textBlock.visible = true;
									textBlock.text = linkTextData;
								}


							}.bind(this)
						);
						textBlock.visible = true;
						textBlock.text = linkTextData;
					}
				}
            }

        	myDiagram.linkTemplate =
    		$(go.Link,
    			{
	    			routing: go.Link.Normal,
	    			corner: 0,
	    			curviness: 0,
	    			relinkableFrom: true,
	    			relinkableTo: true,
//	    			toShortLength: 0,
	    			mouseEnter : function(e, link) {
	    				let linkShape = link.findObject("LINK");
	    				if(linkShape) {
	    					linkShape.stroke = "blue";
	    					linkShape.strokeWidth = 3;
	    				}
	    			},
	    			mouseLeave : function(e, link) {
	    				let linkShape = link.findObject("LINK");
	    				if(linkShape) {
	    					linkShape.stroke = "black";
	    					linkShape.strokeWidth = 2;
	    				}
	    			},
	    			toolTip: $(go.Adornment, "Auto",
	    				$(go.Shape, {fill : "lightyellow"}),
	    				$(go.TextBlock, {margin: 4},
	    					new go.Binding("text","", formatToolTipLink)
	    				)
	    			),
	    			"contextClick": function(e, obj) {
	    				if (netBdgmNetDivVal == "RONT") {
		    				let mousePt = e.diagram.lastInput.viewPoint;
		    				RadialControl.showContextMenu(e, "Link", mousePt.x + 30, mousePt.y, obj.part.data);
	    				}
	    			}
    			},
    			$(go.Shape, {
    				name: "LINK", stroke: "black", strokeWidth: 2
    			}),
    			$(go.Shape, {toArrow: "", stroke: null}), //화살표 제거
    			$(go.TextBlock,
			            { textAlign: "left",
	    				  font: "Bold 10px Sans-Serif",
	    				  stroke: "red",
	    				  name:  "linkLineInfo",
	    				  segmentIndex: 1,
	    				  segmentOffset: new go.Point(0, -10),
	    				  segmentOrientation: go.Link.OrientUpright
	    				},
			            new go.Binding("text", "linkLabelText")
	    		),
	    		new go.Binding("points").makeTwoWay(),
    			{
    				// GIS 라인 정보 표시 제거 - 20250108
    				//click: function(e, obj) {linkLineInfo(obj)}
    			}
    		);
		},

	    showContextMenu : function (e, menudiv, x, y, data) {
	    	let $contextMenu = $("#contextMenu"+menudiv);
	    	let zindex = RadialControl.getMaxZIndex() + 1;
	    	$contextMenu.css({
	    		'top'  : y + 'px',
	    		'left' : x + 'px',
	    		'display': 'block',
	    		'z-index': zindex
	    	});

	    	$contextMenu.data("key",  data.key);
	    	$contextMenu.data("type", menudiv);
	    	$contextMenu.data("eqpNm", data.name);
	    	if(menudiv == "Link") {
	    		$contextMenu.data("fromEqpId",  data.from);
	    		$contextMenu.data("toEqpId"  ,  data.to);
	    		$contextMenu.data("fromMtsoId",  data.fromMtsoId);
	    		$contextMenu.data("toMtsoId"  ,  data.toMtsoId);
	    	}

	    	e.diagram.toolManager.contextMenuTool.isShowingContextMenu = false;

	    	$(document).on("click.hideMenu", function() {
	    		$contextMenu.hide();
	    		$(document).off("click.hideMenu");
	    	});
	    },

	    getMaxZIndex : function () {
	    	let max = Math.max.apply(null, $.map($('body *'), function(e, n) {
	    		if($(e).css('position') !== 'static') {
	    			return parseInt($(e).css('z-index')) || 1;
	    		}
	    	}));

	    	return max;
	    },

		drawDiagram: function(result) {
            let node = [];
            let link = [];

            for(let index = 0; index < result.length; index++) {
            	let data = result[index];

            	let fromkey  	= data.eqpId;
            	let fromtext 	= data.eqpNm;
            	let fromMtsoId  	= data.mtsoId;
            	let tokey  		= data.toEqpId;
            	let totext 		= data.toEqpNm;
            	let toMtsoId  	= data.toMtsoId;

            	let eqpRoleDivCd  = data.eqpRoleDivCd;
            	let eqpRoleDivCdNm= data.eqpRoleDivCdNm;
            	let imgsrc = getEqpIcon(eqpRoleDivCd);

            	if(index == 0) {
            		node.push({"key": fromkey, "name": fromtext, "fromMtsoId" : fromMtsoId, "toMtsoId" : toMtsoId, "img": imgsrc, "eqpRoleDivCd": eqpRoleDivCd, "eqpRoleDivCdNm": eqpRoleDivCdNm});
            	}
            	node.push({"key": tokey, 	"name": totext, "toMtsoId" : toMtsoId, "img": imgsrc, "eqpRoleDivCd": eqpRoleDivCd, "eqpRoleDivCdNm": eqpRoleDivCdNm});
            	link.push({"from": fromkey, "to": tokey, "fromMtsoId" : fromMtsoId, "toMtsoId" : toMtsoId, 	"img": imgsrc, "eqpRoleDivCd": eqpRoleDivCd, "eqpRoleDivCdNm": eqpRoleDivCdNm});
            }

        	//다이어그램 데이터 설정
        	myDiagram.model =
        		new go.GraphLinksModel(
        			node,
        			link
        			);
		},

		// 중계 노드 그리드
		initRlyNodeGrid: function() {
			$('#rlyNodeGrid').alopexGrid({
				paging : {
					pagerSelect: [10,30,50,100,500],
					hidePageList: false  // pager 중앙 삭제
				},
				height: '4row',
				fitTableWidth : true,
				autoResize: true,
				columnMapping : [
						{/* 회선 구분		*/
						key : 'lineDivVal', align : 'center',
						title : '회선 구분',
						hidden:true,
						width : '70'
					}, {/* 회선 순번		*/
						key : 'lineSeq', align : 'center',
						title : '회선 순번',
						hidden:true,
						width : '30'
					}, {/* 중계 순번		*/
						key : 'rlySeq', align : 'center',
						title : '회선 순번',
						hidden:true,
						width : '30'
					}, {/* 장비명			*/
						key : 'rlyEqpNm', align : 'center',
						title : '장비명',
						width : '70'
					}, {/* 선번장			*/
						key : 'rlyNodeNm', align : 'center',
						title : '선번장',
						width : '130'
					}, {/* 중계 장비ID			*/
						key : 'eqpNm', align : 'center',
						title : '중계 장비ID',
						hidden:true,
						width : '100'
					   }
				],
				message : {
					nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
				}
			});
		},

		// 선번장 그리드 초기화
		initLineGrid: function() {
			//그리드 생성
			$('#lineDivGrid').alopexGrid({
				paging : {
					pagerSelect: [10,30,50,100,500],
					hidePageList: false  // pager 중앙 삭제
				},
				height: '3row',
				fitTableWidth : true,
				autoResize: true,
				numberingColumnFromZero: false,
//				rowClickSelect : true,
//				rowSingleSelect : false,
				headerGroup: [
	      			{fromIndex:'lineDivVal',toIndex:'lineNoVal',title:'기간망 회선 정보'}
				],
				columnMapping: [{
						align:'center',
						title : '순번',
						width: '50',
						numberingColumn: true
					}, {/* 회선 구분		*/
						key : 'lineDivVal', align : 'center',
						title : '회선 구분',
						width : '70'
					}, {/* 회선 순번		*/
						key : 'lineSeq', align : 'center',
						title : '회선 순번',
						hidden:true,
						width : '30'
					},  {/* 구간S			*/
						key : 'lineSctnStaVal', align : 'center',
						title : '구간S',
						width : '50'
					}, {/* 구간E			*/
						key : 'lineSctnEndVal', align : 'center',
						title : '구간E',
						width : '50'
					}, {/* 회선명			*/
						key : 'lineNm', align : 'center',
						title : '회선명',
						width : '180'
					}, {/* 서비스 유형		*/
						key : 'lineSrvcTypVal', align : 'center',
						title : '서비스 유형',
						width : '90'
					}, {/* 채널			*/
						key : 'lineChnlVal', align : 'center',
						title : '채널',
						width : '50'
					}, {/* 파장			*/
						key : 'lineWavlVal', align : 'center',
						title : '파장',
						width : '60'
					}, {/* 회선 Type		*/
						key : 'lineTypVal', align : 'center',
						title : '회선 Type',
						width : '70'
					}, {/* 보호모드		*/
						key : 'lineProtModeVal', align : 'center',
						title : '보호모드',
						width : '70'
					}, {/* 회선ID			*/
						key : 'lineId', align : 'center',
						title : '회선ID',
						width : '100'
					}, {/* 기간망 회선번호	*/
						key : 'lineNoVal', align : 'center',
						title : '기간망 회선번호',
						width : '110'
					}
					],
					message : {
						nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
					}
				});

		},

		// 링 정보 그리드
		initRingInfoGrid: function() {
			//그리드 생성
			$('#ringInfoGrid').alopexGrid({
				 height: (netBdgmNetDivVal == "MW" ? '12row' : '5row'),
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
	            },
				columnMapping: [
					{ align:'center', 	  title: '순번', width: '40px', numberingColumn: true },
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
	        		{ key : 'lowMtsoNm', align:'center', title : '하위국', width: '130px' }
					],
					message : {
						nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
					}
			});
		},

		// 중계노드 그리드 데이터 세팅
		setRlyNodeGrid: function(param, page, rowPerPage) {
			$('#pageNo').val(page);
			$('#rowPerPage').val(rowPerPage);

			$('#rlyNodeGrid').alopexGrid('dataEmpty');
			$('#rlyNodeGrid').alopexGrid('showProgress');

			Util.jsonAjax({
				url: '/transmisson/tes/engineeringmap/dsnRont/getRlyNodeList',
				data:param,
				method:'GET',
				async:false
				}).done(
				function(response) {
					let serverPageinfo = {};

		    		$('#rlyNodeGrid').alopexGrid('hideProgress');
		    		serverPageinfo = {
		    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
		    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
		    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
		    		};

		    		$('#rlyNodeGrid').alopexGrid('dataSet', response.rlyNodeList, serverPageinfo);

				}.bind(this)
			);

		},

		// 선번장 그리드
		setLineDivGrid : function(param, page, rowPerPage) {
			$('#pageNo').val(page);
			$('#rowPerPage').val(rowPerPage);

			$('#lineDivGrid').alopexGrid('dataEmpty');
			$('#lineDivGrid').alopexGrid('showProgress');

			Util.jsonAjax({
				url: '/transmisson/tes/engineeringmap/dsnRont/getLnstInfList',
				data:param,
				method:'GET',
				async:false
				}).done(
				function(response) {
					let serverPageinfo = {};

		    		$('#lineDivGrid').alopexGrid('hideProgress');
		    		serverPageinfo = {
		    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
		    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
		    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
		    		};

		    		$('#lineDivGrid').alopexGrid('dataSet', response.lnstInfList, serverPageinfo);

				}.bind(this)
			);
		},

		// 링 정보 그리드
		setRingInfoGrid : function(param, page, rowPerPage) {
			$('#pageNo').val(page);
			$('#rowPerPage').val(rowPerPage);

			$('#ringInfoGrid').alopexGrid('dataEmpty');
			$('#ringInfoGrid').alopexGrid('showProgress');

			Util.jsonAjax({
				url: '/transmisson/tes/configmgmt/commonlkup/eqpntwks',
				data:param,
				method:'GET',
				async:false
				}).done(
				function(response) {
		    		$('#ringInfoGrid').alopexGrid('hideProgress');
		    		$('#ringInfoGrid').alopexGrid('dataSet', response.ntwks);
				}.bind(this)
			);
		}

}