/**
 * TnBdgm.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
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

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(param.eqpId != "" && param.eqpId !=null){
    		paramData = param;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmStaEqpFindData', param, 'GET', 'staEqpFind');
    	}
//    	init();
    	initDiagram();
    	setSelectCode();
    	setEventListener();

    };

    function initDiagram() {
    	var $go = go.GraphObject.make;
    	myDiagram =
    		$go(go.Diagram, "myDiagramDiv", {
    			initialContentAlignment: go.Spot.Center,
//    			contentAlignment: go.Spot.Center,
//    			layout: $go(go.TreeLayout, {isInitial:false, isOngoing: false, angle: 90, setsPortSpot: false, setsChildPortSpot: false, arrangement: go.TreeLayout.ArrangementHorizontal}),
    			/*layout: $go(go.TreeLayout, {angle: 90, setsPortSpot: false, setsChildPortSpot: false,
//    										alignment: go.TreeLayout.AlignmentCenterSubtrees,
//    										alignment: go.TreeLayout.AlignmentCenterChildren,
    										alignment: go.TreeLayout.AlignmentStart,
    										sorting: go.TreeLayout.SortingAscending,
    										arrangement: go.TreeLayout.ArrangementHorizontal}),*/
    			//layout: $go(go.TreeLayout, { angle: 90, sorting: go.TreeLayout.SortingAscending}),
    			//"animationManager.isEnabled": false,
    			"toolManager.mouseWheelBehavior" : go.ToolManager.WheelZoom,
    			//"draggingTool.dragsTree": true,
//    			commandHandler: new DrawCommandHandler(),  // defined in DrawCommandHandler.js
    	        // default to having arrow keys move selected nodes
//    	        "commandHandler.arrowKeyBehavior": "move",
//    	        "SelectionMoved": relayoutDiagram,  // defined below
    			//allowMove: false;
    			allowDelete: false
    		});

    	myDiagram.groupTemplate =
    		$go(go.Group, "Auto",
//    			{layout: $go(go.ForceDirectedLayout),
            {isSubGraphExpanded: false,
    		locationSpot: go.Spot.Top,
//    		layout: $go(go.CircularLayout, {radius: 50, nodeDiameterFormula: go.CircularLayout.Circular}),
//    		layout: $go(go.CircularLayout),
            subGraphExpandedChanged: function(group) {
            	if (group.memberParts.count === 0) {
//            		randomGroup(group.data.key);
            		groupYn = true;
            		groupKey = group.data.key;
            		expandNodeGroup(group);
                  }
                // invalidate all member and external link routes
            	group.findSubGraphParts().each(function(n) { if (n instanceof go.Node) n.invalidateConnectedLinks(); });
            }},
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          	$go(go.Shape, "Rectangle", { fill: null, stroke: "gray", strokeWidth: 2 }),
          	$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left, margin: 4 },
          		$go(go.Panel, "Horizontal",
//          			{ defaultAlignment: go.Spot.Top },
          			$go("SubGraphExpanderButton"),
          			$go(go.TextBlock, { font: "Bold 18px Sans-Serif", margin: 4 }, new go.Binding("text", "name"))),
          			$go(go.Placeholder, { padding: new go.Margin(0, 5) }
          		)
          	)
        );

    	/*myDiagram.groupTemplate =
            $(go.Group, "Auto",
              { // define the group's internal layout
                layout: $(go.TreeLayout,
                          { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
                // the group begins unexpanded;
                // upon expansion, a Diagram Listener will generate contents for the group
                isSubGraphExpanded: false,
                // when a group is expanded, if it contains no parts, generate a subGraph inside of it
                subGraphExpandedChanged: function(group) {
                  if (group.memberParts.count === 0) {
                    randomGroup(group.data.key);
                  }
                }
              },
              $(go.Shape, "Rectangle",
                { fill: null, stroke: "gray", strokeWidth: 2 }),
              $(go.Panel, "Vertical",
                { defaultAlignment: go.Spot.Left, margin: 4 },
                $(go.Panel, "Horizontal",
                  { defaultAlignment: go.Spot.Top },
                  // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
                  $("SubGraphExpanderButton"),
                  $(go.TextBlock,
                    { font: "Bold 18px Sans-Serif", margin: 4 },
                    new go.Binding("text", "key"))
                ),
                // create a placeholder to represent the area where the contents of the group are
                $(go.Placeholder,
                  { padding: new go.Margin(0, 10) })
              )  // end Vertical Panel
            );  // end Group
*/
    	/*var nodeToolTip =
    		$go(go.Adornment, "Vertical",
    			{background: "#FFFFD0"},
    			$go(go.TextBlock, {textAlign: "left"}, new go.Binding("text", "name", function(val) {return "장비명: " + val})),
    			$go(go.TextBlock, {textAlign: "left"}, new go.Binding("text", "ip", function(val) {return "IP: " + val})),
    			$go(go.TextBlock, {textAlign: "left"}, new go.Binding("text", "desc", function(val) {return "비고: " + val}))
    		);

    	var nodePopupMenu =
    		$go(go.Adornment, "Vertical",
    			$go("ContextMenuButton", $go(go.TextBlock, "링크정보", { click: nodeMenuClick })),
    			$go("ContextMenuButton", $go(go.TextBlock, "포트정보", { click: nodeMenuClick })),
    			$go("ContextMenuButton", $go(go.TextBlock, "실장도", { click: nodeMenuClick }))
    		);*/

    	myDiagram.nodeTemplate =
    		$go(go.Node, "Vertical",
    			{ doubleClick: eqpDtlLkupPop },
    			{ //toolTip: nodeToolTip,
    			//contextMenu: nodePopupMenu,
    	          isTreeLeaf: false,
//    	          wasTreeExpanded: false
    			isTreeExpanded: false,
//    			locationObjectName: "TARGET",
//    			locationSpot: go.Spot.Center,
    			},
    			new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
    			//new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
    			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    			$go(go.Panel, "Vertical",
    				$go(go.Picture, new go.Binding("source"),
    						{ desiredSize: new go.Size(40, 40)}),
    				$go(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "name"))
    			),
    			//$go("TreeExpanderButton")
    			$go("TreeExpanderButton",
		          {
		            name: 'TREEBUTTON',
		            width: 20, height: 20,
		            alignment: go.Spot.TopRight,
		            alignmentFocus: go.Spot.Center,
		            // customize the expander behavior to
		            // create children if the node has never been expanded
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

    	myDiagram.nodeTemplateMap.add("staEqpFind",
    		$go(go.Node, "Vertical",
    			{ doubleClick: eqpDtlLkupPop },
    			{ //toolTip: nodeToolTip,
    			//contextMenu: nodePopupMenu,
    	          isTreeLeaf: true,
//    	          wasTreeExpanded: true
    			isTreeExpanded: true,
//    			locationObjectName: "TARGET",
//    			locationSpot: go.Spot.Center,
    			},
    			new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
    			//new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
    			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    			$go(go.Panel, "Vertical",
    				$go(go.Picture, new go.Binding("source"),
    						{ desiredSize: new go.Size(40, 40)}),
    				$go(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "name"))
    			)
    			//$go("TreeExpanderButton")
    			/*$go("TreeExpanderButton",
		          {
		            name: 'TREEBUTTON',
		            width: 20, height: 20,
		            alignment: go.Spot.TopRight,
		            alignmentFocus: go.Spot.Center,
		            // customize the expander behavior to
		            // create children if the node has never been expanded
		            click: function (e, obj) {  // OBJ is the Button
		                var node = obj.part;  // get the Node containing this Button
		                if (node === null) return;
		                e.handled = true;
		                groupYn = false;
//		                alert(JSON.stringify(node.data));
		                groupKey = node.data.group;
		                expandNode(node);
		              }
		          }
		        )*/
    		));

    	myDiagram.nodeTemplateMap.add("staEqpId",
        		$go(go.Node, "Vertical",
        			{ doubleClick: eqpDtlLkupPop },
        			{ //toolTip: nodeToolTip,
        	          isTreeLeaf: true,
        			isTreeExpanded: true,
        			},
        			new go.Binding("cursor", "hasData", function(v){if (v=="Y") return "pointer"; else return "default";}),
        			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        			$go(go.Panel, "Vertical",
        				$go(go.Picture, new go.Binding("source"),
        						{ desiredSize: new go.Size(40, 40)}),
        				$go(go.TextBlock, { margin: 2, font: "Bold 12px Sans-Serif", stroke: "red"}, new go.Binding("text", "name"))
        			)
        		));

    	/*var linkToolTip =
    		$go(go.Adornment, "Vertical",
    			{background: "#FFFFD0"},
    			$go(go.TextBlock, new go.Binding("text", "from", function(val) {return "시작점: " + val})),
    			$go(go.TextBlock, new go.Binding("text", "to", function(val) {return "끝점: " + val}))
    		);

    	var linkPopupMenu =
    		$go(go.Adornment, "Vertical",
    			$go("ContextMenuButton", $go(go.TextBlock, "링크정보", { click: nodeMenuClick }))
    		);*/

    	myDiagram.linkTemplate =
    		$go(go.Link,
    			new go.Binding("curve"),
    			new go.Binding("curviness"),
    			new go.Binding("points").makeTwoWay(),
    			{doubleClick: function(e, link){
    				dataParam = {"lftEqpId" : link.data.from.replace("DU","DV").replace("RN","DV"), "rghtEqpId" : link.data.to.replace("DU","DV").replace("RN","DV")};
    				popup('TnBdgmLinkInfPop', $('#ctx').val()+'/configmgmt/tnbdgm/TnBdgmLinkInfPop.do', '링크 정보', dataParam);
	    			}
    			},
    			/*new go.Binding("curve", "arc", function(v) {
    				if (v=="true")
    					return go.Link.Bezier;
    				else
    					return go.Link.JumpOver;
    			}),*/
    			$go(go.Shape)
    		);

    	myDiagram.linkTemplateMap.add("groupLink",
    		$go(go.Link,
    			new go.Binding("curve"),
    			new go.Binding("curviness"),
    			new go.Binding("points").makeTwoWay(),
    			/*new go.Binding("curve", "arc", function(v) {
    				if (v=="true")
    					return go.Link.Bezier;
    				else
    					return go.Link.JumpOver;
    			}),*/
    			$go(go.Shape,
    					{strokeWidth: 0}
    			)
    		));
    }

 // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	 var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//    	//전송실 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');

    }

    function setEventListener() {

    	//본부 선택시 이벤트
	   	 $('#org').on('change', function(e) {

	   		 var orgID =  $("#org").getData();

	   		 if(orgID.orgId == ''){
	   			 var chrrOrgGrpCd;
	   			 if($("#chrrOrgGrpCd").val() == ""){
	   				 chrrOrgGrpCd = "SKT";
	   			 }else{
	   				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
	   			 }

	   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTeamGrp/'+ chrrOrgGrpCd, null, 'GET', 'team');
	   		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');

	   		 }else{
	   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + orgID.orgId, null, 'GET', 'team');
	   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
	   		 }
	        });

	   	 // 팀을 선택했을 경우
	   	 $('#team').on('change', function(e) {

	   		 var orgID =  $("#org").getData();
	   		 var teamID =  $("#team").getData();

	    	 	 if(orgID.orgId == '' && teamID.teamId == ''){
	    	 		var chrrOrgGrpCd;
					 if($("#chrrOrgGrpCd").val() == ""){
						 chrrOrgGrpCd = "SKT";
					 }else{
						 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
					 }

				     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
	    	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
	    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
	    		 }else if(orgID.orgId != '' && teamID.teamId == ''){
	    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
	    		 }else {
	    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
	    		 }

	   	 });

	   //장비조회
		 $('#staEqpSearch').on('click', function(e) {
			 $a.popup({
		          	popid: 'staEqpSearch',
		          	title: configMsgArray['findEquipment'],
		            url: $('#ctx').val()+'/configmgmt/equipment/EqpLkup.do',
		            width : 950,
		           	height : window.innerHeight * 0.83,
		           	modal: true,
	                movable:true,
		           	callback : function(data) { // 팝업창을 닫을 때 실행
		                $('#eqpNm').val(data.eqpNm);
		                $('#eqpId').val(data.eqpId);
		           	}
		      });
	     });

   	 	$("#save").on("click", function(e) {
   	 	document.getElementById("mySavedModel").value = myDiagram.model.toJson();
		});

    	 //저장
    	 $("#saveMap").on("click", function(e) {
 			saveMap();
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

    	 //구성도 등록
    	 $('#bdgm_popup').on('click', function(e) {
    		 //alert("a");
    		 callMsgBox('','I', "a", function(msgId, msgRst){});
          	//tango transmission biz 모듈을 호출하여야한다.
    		 popup('TnBdgmInfReg', $('#ctx').val()+'/configmgmt/tnbdgm/TnBdgmInfReg.do', '구성도 등록');
          });

    	 //장비 등록
    	 $('#eqpReg_popup').on('click', function(e) {
          	//tango transmission biz 모듈을 호출하여야한다.
    		 popup('TnBdgmEqpReg', $('#ctx').val()+'/configmgmt/tnbdgm/TnBdgmEqpReg.do', '장비 등록');
          });

    	//구간 등록
    	 $('#sctnReg_popup').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 //$a.navigate($('#ctx').val()+'/configmgmt/cardmdlmgmt/CardMdl.do');
    		 popup('TnBdgmEqpSctnReg', $('#ctx').val()+'/configmgmt/tnbdgm/TnBdgmEqpSctnReg.do', '구간 등록');
         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};

	function eqpDtlLkupPop(e, obj){
		var eqpId = obj.part.data.key;
		var param = {"eqpId" : eqpId};
		eqpPopup('EqpDtlLkup', $('#ctx').val()+'/configmgmt/tnbdgm/TnBdgmEqpDtlLkup.do', configMsgArray['equipmentDetailInf'], param);
	}

	function successCallback(response, status, jqxhr, flag){


		//본부 콤보박스
    	if(flag == 'fstOrg'){
    		var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			}else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

			var sUprOrgId = "";
			if(paramData == null){
				if($("#sUprOrgId").val() != ""){
					sUprOrgId = $("#sUprOrgId").val();
				}
			}

			$('#org').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
		    		for(var i=0; i<response.length; i++){
		    			var resObj = response[i];
		    			option_data.push(resObj);
		    			if(resObj.orgId == sUprOrgId) {
							selectId = resObj.orgId;
						}
		    		}
		    		if(selectId == null && paramData == null){
		    			selectId = response[0].orgId;
		    			sUprOrgId = selectId;
		    		}
		    		$('#org').setData({
						data:option_data ,
						orgId:selectId
					});
	   		}
	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
	   		if(paramData == null){
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + sUprOrgId, null, 'GET', 'fstTeam');
	   		}else{
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTeamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
	   		}
    	}

    	if(flag == 'org'){
    		$('#org').clear();
    		var option_data =  [{orgId: "", orgNm: "전체",uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#org').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'fstTeam'){
    		var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			}else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

			var sOrgId = "";
			if(paramData == null){
	  			if($("#sOrgId").val() != ""){
	  				sOrgId = $("#sOrgId").val();
	  			}
			}

  			$('#team').clear();

      		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null && paramData == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#team').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#team').val() != ""){
  	    			sOrgId = selectId;
  	    			if(paramData == null){
  	        			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	        		}else{
  	        			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
  	        		}
  	    		}else{
  	    			$('#team').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + $('#org').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
    	}

    	if(flag == 'team'){
    		$('#team').clear();
    		var option_data =  [{orgId: "", orgNm: "전체",uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#team').setData({
                 data:option_data
    		});
    	}

		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: "전체",mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
		}

		if(flag == 'teamTmof'){
    		$('#tmof').clear();
    		var option_data =  [{mtsoId: "",mgmtGrpCd: "",mtsoNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#tmof').setData({
                 data:option_data,
                 mtsoNm:''
    		});
    	}

    	if(flag == "nodeData"){
    		nodeDataArray = [];
    		linkDataArray = [];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			var everexpand = false;
    			if(resObj.eqpNm.indexOf("PE-RT") > 0){
//    				everexpand = true;
    			}
    			var src = getContextPath() + "/resources/images/topology/PE-RT_02.png";
//    			nodeDataArray.push({ key: resObj.key, name: resObj.name, ip: resObj.ip, desc: resObj.nodeDesc, hasData: resObj.hasData, source: resObj.source, loc: resObj.loc });
    			nodeDataArray.push({ key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, everExpanded: everexpand});
    		}
    		//myDiagram.model = go.GraphLinksModel(nodeDataArray, linkDataArray);
        	myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    	}


    	/*if(flag == "linkData"){
    		linkDataArray = [];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
//    			linkDataArray.push({ id: resObj.linkId, from: resObj.linkFrom, to: resObj.linkTo });
    			linkDataArray.push({ from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 });
    		}
//    		alert(JSON.stringify(linkDataArray));
    	}

    	if(flag == "nodeAddData"){
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			var cnt = 0;
    			for(var j=0; j<nodeDataArray.length; j++){
    				if(nodeDataArray[j].key == resObj.eqpId){
    					cnt++;
    				}
    			}
//    			nodeDataArray.push({ key: resObj.key, name: resObj.name, ip: resObj.ip, desc: resObj.nodeDesc, hasData: resObj.hasData, source: resObj.source, loc: resObj.loc });
    			if(cnt == 0){
//    				nodeDataArray.push({ key: resObj.eqpId, name: resObj.eqpNm, source: resObj.source, loc: resObj.loc, everExpanded: false});
    				var nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: resObj.source, loc: resObj.loc, everExpanded: false};
    				myDiagram.model.addNodeData(nodeData);

//    				child = myDiagram.findNodeForData(nodeData);
//    		    	alert(parent+":"+child);
    		    	if(resObj.loc == null){
    		    		child.location = parent.location-1;
    		    	}
    			}
    		}
//    		alert(nodeDataArray);
    		if (response.length == 0) {
    			nodeTemp.findObject('TREEBUTTON').visible = false;
            }
    	}

    	if(flag == "linkAddData"){
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			var cnt = 0;
    			for(var j=0; j<linkDataArray.length; j++){
    				if((linkDataArray[j].from == resObj.lftEqpId && linkDataArray[j].to == resObj.rghtEqpId) ||
    					(linkDataArray[j].from == resObj.rghtEqpId && linkDataArray[j].to == resObj.lftEqpId)){
    					cnt++;
    				}
    			}
//    			linkDataArray.push({ id: resObj.linkId, from: resObj.linkFrom, to: resObj.linkTo });
    			if(cnt == 0){
//    				linkDataArray.push({ from: resObj.lftEqpId, to: resObj.rghtEqpId });
    				var linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 };
    				myDiagram.model.addLinkData(linkData);
    			}
    		}
    	}*/

    	if(flag == "staEqpFind"){

    		nodeDataArray = [];
    		linkDataArray = [];

    		var groupNodeCnt = 0;
    		var ringNodeCnt = 0;
    		var groupLinkCnt = 0;
    		var ringLinkCnt = 0;
    		var nodeAddData = response.nodeAddData;
    		var locYS = 0;

    		for(var i=0; i<response.nodeAddData.length; i++){
    			var resObj = response.nodeAddData[i];
    			var everexpand = false;
    			var src = null;
    			var locXS = 0;

    			if(resObj.loc == null){
					if(i > 0){
	    				if(nodeAddData[i-1].eqpSctnDivCd == resObj.eqpSctnDivCd){
	    					locXS = locXS + 100;
	    				}else{
	    					locYS = locYS + 100;
	    				}
	    			}
					resObj.loc = locXS + " " + locYS;

				}

				if(resObj.eqpNm.indexOf("PE-RT") > 0){ src = getContextPath() + "/resources/images/topology/PE-RT_02.png";}
				else if(resObj.eqpRoleDivCd == "01"){ src = getContextPath() + "/resources/images/topology/L2-SW_01.png";}
				else if(resObj.eqpRoleDivCd == "02"){ src = getContextPath() + "/resources/images/topology/L2-SW_01.png";}
				else if(resObj.eqpRoleDivCd == "03"){ src = getContextPath() + "/resources/images/topology/L3-SW_01.png";}
				else if(resObj.eqpRoleDivCd == "04"){ src = getContextPath() + "/resources/images/topology/IBC_01.png";}
				else if(resObj.eqpRoleDivCd == "05"){ src = getContextPath() + "/resources/images/topology/IBR_01.png";}
				else if(resObj.eqpRoleDivCd == "06"){ src = getContextPath() + "/resources/images/topology/IBRR_01.png";}
				else if(resObj.eqpRoleDivCd == "07"){ src = getContextPath() + "/resources/images/topology/PTS_01.png";}
				else if(resObj.eqpRoleDivCd == "15"){ src = getContextPath() + "/resources/images/topology/DWDM_01.png";}
				else if(resObj.eqpRoleDivCd == "18"){ src = getContextPath() + "/resources/images/topology/SCAN_WM_01.png";}
				else if(resObj.eqpRoleDivCd == "21"){ src = getContextPath() + "/resources/images/topology/OTN_01.png";}
				else if(resObj.eqpRoleDivCd == "23"){ src = getContextPath() + "/resources/images/topology/DU_01.png";}
				else if(resObj.eqpRoleDivCd == "25"){ src = getContextPath() + "/resources/images/topology/RU_01.png";}
				else if(resObj.eqpRoleDivCd == "101"){ src = getContextPath() + "/resources/images/topology/RT_01.png";}
				else { src = getContextPath() + "/resources/images/topology/PG_01.png";}

//    			nodeDataArray.push({ key: resObj.key, name: resObj.name, ip: resObj.ip, desc: resObj.nodeDesc, hasData: resObj.hasData, source: resObj.source, loc: resObj.loc });
				if(resObj.eqpId == paramData.eqpId){
					nodeDataArray.push({ key: resObj.eqpId, name: resObj.eqpNm, category: "staEqpId", source: src, loc: resObj.loc});
				}else{
					nodeDataArray.push({ key: resObj.eqpId, name: resObj.eqpNm, category: "staEqpFind", source: src, loc: resObj.loc});
				}
    		}

    		for(var i=0; i<response.linkAddData.length; i++){
    			var resObj = response.linkAddData[i];
    			var cnt = 0;
    			for(var j=0; j<linkDataArray.length; j++){
    				if(((linkDataArray[j].from == resObj.lftEqpId && linkDataArray[j].to == resObj.rghtEqpId) ||
    					(linkDataArray[j].from == resObj.rghtEqpId && linkDataArray[j].to == resObj.lftEqpId))){
    					cnt++;
    				}
    			}
    			if(cnt == 0){
    			linkDataArray.push({ from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 });
    			}
    		}
    		//myDiagram.model = go.GraphLinksModel(nodeDataArray, linkDataArray);
        	myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);


    		if (response.linkAddData.length == 0) {
    			nodeTemp.findObject('TREEBUTTON').visible = false;
            }
    	}

    	if(flag == "addData"){

    		var groupNodeCnt = 0;
    		var ringNodeCnt = 0;
    		var groupLinkCnt = 0;
    		var ringLinkCnt = 0;
    		var locXX = -100;
    		var locYY = 0;
    		if(!groupYn){
    			locYY = 150;
    		}

    		for(var i=0; i<response.nodeAddData.length; i++){
    			var resObj = response.nodeAddData[i];
    			var cnt = 0;

    			for(var j=0; j<nodeDataArray.length; j++){
    				if(nodeDataArray[j].key == resObj.eqpId){
    					cnt++;
    				}
    			}
//    			nodeDataArray.push({ key: resObj.key, name: resObj.name, ip: resObj.ip, desc: resObj.nodeDesc, hasData: resObj.hasData, source: resObj.source, loc: resObj.loc });
    			if(cnt == 0){
    				var nodeData;
    				var src = null;
//    				alert(resObj.loc);
    				if(resObj.loc == null){

    					if(!groupYn){
    						locXX = Number(locXX) + 150;
    		    		}else{
    		    			locXX = Number(locXX) + 200;
    		    		}
    					var locXData = Number(locX) + Number(locXX);
    					var locYData = Number(locY) + Number(locYY);
//    					alert(locX +":"+locXX);
    					resObj.loc = locXData + " " + locYData;

    					if((i+1)%5 == 0){
    						locXX = -100;
    						locYY += 150;
    					}
    				}
    				if(resObj.eqpRoleDivCd == "01"){ src = getContextPath() + "/resources/images/topology/L2-SW_01.png";}
    				else if(resObj.eqpRoleDivCd == "02"){ src = getContextPath() + "/resources/images/topology/L2-SW_01.png";}
    				else if(resObj.eqpRoleDivCd == "03"){ src = getContextPath() + "/resources/images/topology/L3-SW_01.png";}
    				else if(resObj.eqpRoleDivCd == "04"){ src = getContextPath() + "/resources/images/topology/IBC_01.png";}
    				else if(resObj.eqpRoleDivCd == "05"){ src = getContextPath() + "/resources/images/topology/IBR_01.png";}
    				else if(resObj.eqpRoleDivCd == "06"){ src = getContextPath() + "/resources/images/topology/IBRR_01.png";}
    				else if(resObj.eqpRoleDivCd == "07"){ src = getContextPath() + "/resources/images/topology/PTS_01.png";}
    				else if(resObj.eqpRoleDivCd == "15"){ src = getContextPath() + "/resources/images/topology/DWDM_01.png";}
    				else if(resObj.eqpRoleDivCd == "18"){ src = getContextPath() + "/resources/images/topology/SCAN_WM_01.png";}
    				else if(resObj.eqpRoleDivCd == "21"){ src = getContextPath() + "/resources/images/topology/OTN_01.png";}
    				else if(resObj.eqpRoleDivCd == "23"){ src = getContextPath() + "/resources/images/topology/DU_01.png";}
    				else if(resObj.eqpRoleDivCd == "25"){ src = getContextPath() + "/resources/images/topology/RU_01.png";}
    				else if(resObj.eqpRoleDivCd == "101"){ src = getContextPath() + "/resources/images/topology/RT_01.png";}
    				else { src = getContextPath() + "/resources/images/topology/PG_01.png";}
//    				nodeDataArray.push({ key: resObj.eqpId, name: resObj.eqpNm, source: resObj.source, loc: resObj.loc, everExpanded: false});
    				//그룹에서 만든 노드가 아닐경우
    				if(!groupYn){
//	    				if(resObj.eqpRoleDivCd == "23"){
    					if(resObj.eqpSctnDivCd == "16" || resObj.eqpSctnDivCd == "17" || resObj.eqpSctnDivCd == "18" || resObj.eqpSctnDivCd == "19" || resObj.eqpSctnDivCd == "20" || resObj.eqpSctnDivCd == "21"){
	    					for(var j=0; j<nodeDataArray.length; j++){
    		    				if(nodeDataArray[j].key == resObj.eqpId.replace("DV","DU")){
    		    					groupNodeCnt++;
    		    				}
    		    			}
	    					//DU 그룹을 만들기 위해 나머지 노드는 만들지 않음
	    					if(groupNodeCnt == 0){

	    						nodeData = { key: resObj.eqpId.replace("DV","DU"), name: "DU", source: src, loc: resObj.loc, eqpIdOld: resObj.eqpIdOld, eqpSctnDivCd: resObj.eqpSctnDivCd, everExpanded: false, isGroup: true};
	    						myDiagram.model.addNodeData(nodeData);
	    						groupNodeCnt++;
	    					}
	    				}else if(resObj.eqpSctnDivCd == "22"){
	    					for(var j=0; j<nodeDataArray.length; j++){
    		    				if(nodeDataArray[j].key == resObj.eqpId.replace("DV","RN")){
    		    					ringNodeCnt++;
    		    				}
    		    			}
	    					//DU 그룹을 만들기 위해 나머지 노드는 만들지 않음
	    					if(ringNodeCnt == 0){

	    						nodeData = { key: resObj.eqpId.replace("DV","RN"), name: "RING", loc: resObj.loc, eqpIdOld: resObj.eqpIdOld, eqpSctnDivCd: resObj.eqpSctnDivCd, everExpanded: true, isGroup: true};
	    						myDiagram.model.addNodeData(nodeData);
	    						nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, everExpanded: false, group: resObj.eqpId.replace("DV","RN")};
    							myDiagram.model.addNodeData(nodeData);
	    						ringNodeCnt++;
	    					}
	    				}else if(resObj.eqpSctnDivCd == "06" || resObj.eqpSctnDivCd == "08"){
	    					//DU 그룹을 만들기 위해 나머지 노드는 만들지 않음
    						if(groupKey == "" || groupKey == null){
    							nodeData = { key: resObj.eqpId.replace("DV","RN"), name: "L3_RING", source: src, loc: resObj.loc, eqpIdOld: resObj.eqpIdOld, eqpSctnDivCd: resObj.eqpSctnDivCd, everExpanded: true, isGroup: true};
    							myDiagram.model.addNodeData(nodeData);
    							nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, everExpanded: false, group: resObj.eqpId.replace("DV","RN")};
    							myDiagram.model.addNodeData(nodeData);
    						}else{
    							nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, everExpanded: false, group: groupKey};
    							myDiagram.model.addNodeData(nodeData);
    						}
	    				}else if(resObj.eqpSctnDivCd == "23" || resObj.eqpSctnDivCd == "24" || resObj.eqpSctnDivCd == "25"){
	    					nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, everExpanded: false, group: groupKey};
							myDiagram.model.addNodeData(nodeData);
	    				}else{
    						nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, everExpanded: false};
    						myDiagram.model.addNodeData(nodeData);
	    				}
    				}else{
//    					if(resObj.eqpSctnDivCd == "23" || resObj.eqpSctnDivCd == "24"){
//    						nodeData = { key: resObj.eqpId, name: resObj.eqpNm, category: "Ring", source: src, loc: resObj.loc, everExpanded: false, group: groupKey};
//    						myDiagram.model.addNodeData(nodeData);
//    					}else{
    						nodeData = { key: resObj.eqpId, name: resObj.eqpNm, source: src, loc: resObj.loc, everExpanded: false, group: groupKey};
    						myDiagram.model.addNodeData(nodeData);
//    					}
    				}

//    				child = myDiagram.findNodeForData(nodeData);
//    		    	alert(parent+":"+child);
    		    	/*if(resObj.loc == null){
    		    		child.location = parent.location-1;
    		    	}*/
    			}
    		}

//    		alert(JSON.stringify(response.linkAddData));
    		for(var i=0; i<response.linkAddData.length; i++){
    			var resObj = response.linkAddData[i];
    			var cnt = 0;
    			for(var j=0; j<linkDataArray.length; j++){
    				if(((linkDataArray[j].from == resObj.lftEqpId && linkDataArray[j].to == resObj.rghtEqpId) ||
    					(linkDataArray[j].from == resObj.rghtEqpId && linkDataArray[j].to == resObj.lftEqpId)) && resObj.eqpSctnDivCd != "23" && resObj.eqpSctnDivCd != "24"){
    					cnt++;
    				}
    			}
//    			linkDataArray.push({ id: resObj.linkId, from: resObj.linkFrom, to: resObj.linkTo });
    			if(cnt == 0){
    				var linkData;
    				if(!groupYn){
//	    				if(resObj.eqpRoleDivCd == "23"){
    					if(resObj.eqpSctnDivCd == "16" || resObj.eqpSctnDivCd == "17" || resObj.eqpSctnDivCd == "18" || resObj.eqpSctnDivCd == "19" || resObj.eqpSctnDivCd == "20" || resObj.eqpSctnDivCd == "21"){
	    					if(groupLinkCnt == 0){
	    						linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId.replace("DV","DU"), curviness: 0 };
	    						myDiagram.model.addLinkData(linkData);
	    						groupLinkCnt++;
	    					}
	    				}else if(resObj.eqpSctnDivCd == "22"){
	    					if(ringLinkCnt == 0){
//	    						linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId.replace("DV","RN"), category: "groupLink", curviness: 0 };
//	    						myDiagram.model.addLinkData(linkData);
	    						linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 };
	    						myDiagram.model.addLinkData(linkData);
	    						ringLinkCnt++;
	    					}
	    				}else if((resObj.eqpSctnDivCd == "06" || resObj.eqpSctnDivCd == "08") && groupKey == null){
	    						linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 };
	    						myDiagram.model.addLinkData(linkData);
	    				}else if(resObj.eqpSctnDivCd == "23" || resObj.eqpSctnDivCd == "24" || resObj.eqpSctnDivCd == "25"){
    						linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curve: go.Link.Bezier, curviness: 30 };
    						myDiagram.model.addLinkData(linkData);
	    				}else{
	    					linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 };
	    					myDiagram.model.addLinkData(linkData);
	    				}
//	    				linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 };
    				}else{
//    					if(resObj.eqpSctnDivCd == "23" || resObj.eqpSctnDivCd == "24"){
//    						linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curve: go.Link.Bezier, curviness: 30 };
//    						alert(JSON.stringify(linkData));
//    						myDiagram.model.addLinkData(linkData);
//    					}
    					if(resObj.eqpSctnDivCd == "06" || resObj.eqpSctnDivCd == "08"){
    						linkData = { from: resObj.lftEqpId, to: resObj.rghtEqpId, curviness: 0 };
    						myDiagram.model.removeLinkData(linkData);

    					}
    				}
//    				linkDataArray.push({ from: resObj.lftEqpId, to: resObj.rghtEqpId });
//    				alert(JSON.stringify(linkData));
    			}
    		}

    		if (response.linkAddData.length == 0) {
    			nodeTemp.findObject('TREEBUTTON').visible = false;
            }
    		//myDiagram.model = go.GraphLinksModel(nodeDataArray, linkDataArray);
    	}

    	if(flag == "nodeDataReg"){
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : 650
              });
        }

    function eqpPopup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.65
              });
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


    //var myDiagram;

    function saveProperties(obj) {
    	//curDiagram.model.modelData.position = go.Point.stringify(curDiagram.position);
    }

    function changedModel(e) {
//    	curDiagram.selection.each(function(node) {
//    		console.log(node.data);
//    		console.log(node.data.loc);
//    		node.data.loc = node.data.loc;
//    	});
    }

    function nodeMenuClick(e, obj) {
    	var node = obj.part.adornedPart;
    	//alert(obj.xe + ':' + node.data.name);
    	callMsgBox('','I', obj.xe + ':' + node.data.name , function(msgId, msgRst){});
    }

    function relayoutDiagram() {
    	//curDiagram.layout.invalidateLayout();
    	//curDiagram.findTopLevelGroups().each(function(g) { g.layout.invalidateLayout(); });
    	//curDiagram.layoutDiagram();
    }

    function setTopology(data) {
    	var param =  $("#searchForm").getData();

//    	if(param.eqpId == "" || param.eqpId == null){
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmNodeData', param, 'GET', 'nodeData');
//    	}else{
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmStaEqpFindData', param, 'GET', 'staEqpFind');
//    	}

    }



    function expandNode(node) {
        var diagram = node.diagram;
//        alert(JSON.stringify(node.data.loc));
//        alert(node.data.loc.substring(0, node.data.loc.indexOf(' ')));
//        alert(node.data.loc.substring(node.data.loc.indexOf(' ')));
        locX = node.data.loc.substring(0, node.data.loc.indexOf(' '));
        locY = node.data.loc.substring(node.data.loc.indexOf(' '));
//        alert(locX+":"+locY);
        myDiagram.startTransaction("CollapseExpandTree");
        // this behavior is specific to this incrementalTree sample:
        nodeTemp = node;
        var data = node.data;
        if (!data.everExpanded) {
          // only create children once per node
          diagram.model.setDataProperty(data, "everExpanded", true);
//          alert(data.name);
          if(data.name == "DU" || data.name == "RING"){
        	  createGroupSubTree(data);
          }else{
        	  createSubTree(data);
          }
        }
        // this behavior is generic for most expand/collapse tree buttons:
        if (node.isTreeExpanded) {
          diagram.commandHandler.collapseTree(node);
        } else {
          diagram.commandHandler.expandTree(node);
        }
        myDiagram.commitTransaction("CollapseExpandTree");
        myDiagram.zoomToFit();
      }

    function expandNodeGroup(group) {
        myDiagram.startTransaction("CollapseExpandTree");
        // this behavior is specific to this incrementalTree sample:
        locX = group.data.loc.substring(0, group.data.loc.indexOf(' '));
        locY = group.data.loc.substring(group.data.loc.indexOf(' '));
        var data = group.data;
        if(data.name == "DU" || data.name == "L3_RING"){
      	  	createGroupSubTree(data);
        }else if(data.name == "RING"){
        	createRingSubTree(data);
        }else{
      	  	createSubTree(data);
        }

        myDiagram.commitTransaction("CollapseExpandTree");
        myDiagram.zoomToFit();
      }

    function randomGroup(group) {
        // all modification to the diagram is within this transaction
        myDiagram.startTransaction("addGroupContents");
        var addedKeys = [];  // this will contain the keys of all nodes created
        var groupCount = 0;  // the number of groups in the diagram, to determine the numbers in the keys of new groups
        myDiagram.nodes.each(function(node) {
          if (node instanceof go.Group) groupCount++;
        });

        // create a random number of groups
        // ensure there are at least 10 groups in the diagram
        var groups = Math.floor(Math.random() * 2);
        if (groupCount < 10) groups += 1;
        for (var i = 0; i < groups; i++) {
          var name = "group" + (i + groupCount);
          myDiagram.model.addNodeData({ key: name, isGroup: true, group: group });
          addedKeys.push(name);
        }
        var nodes = Math.floor(Math.random() * 4) + 2;
        // create a random number of non-group nodes
        for (var i = 0; i < nodes; i++) {
          var color = go.Brush.randomColor();
          // make sure the color, which will be the node's key, is unique in the diagram before adding the new node
          if (myDiagram.findPartForKey(color) === null) {
            myDiagram.model.addNodeData({ key: color, group: group });
            addedKeys.push(color);
          }
        }
        // add at least one link from each node to another
        // this could result in clusters of nodes unreachable from each other, but no lone nodes
        var arr = [];
        for (var x in addedKeys) arr.push(addedKeys[x]);
        arr.sort(function (x, y) { return Math.random(2)-1; });
        for (var i = 0; i < arr.length; i++) {
          var from = Math.floor(Math.random() * (arr.length - i)) + i;
          if (from !== i) {
            myDiagram.model.addLinkData({ from: arr[from], to: arr[i] });
          }
        }
        myDiagram.commitTransaction("addGroupContents");
      }

    function createSubTree(data) {

    	var eqpId = data.key;

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmAddData/'+eqpId, null, 'GET', 'addData');
      }

    function createGroupSubTree(data) {

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmAddGroupData', data, 'GET', 'addData');
      }

    function createRingSubTree(data) {

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/tnBdgmAddRingData', data, 'GET', 'addData');
      }

    function deletePage(idx) {
    	for (var i=idx; i<tabList.length-1; i++) {
    		var tab = $("#basicTabs > ul > li")[idx+1];
    		tab.setAttribute("data-content", "#tab" + idx);
    		var tabContent = $("#basicTabs").getTabContentByIndex(i+1);
    		tabContent.setAttribute("id", "tab" + idx);

    		tabList[i] = tabList[i+1];
    		tabList[i+1] = null;
    	}
    	tabList.pop();
    }

    function buttonControl(e)
    {
    	if (e.data.is($("#editMap"))) {
    		$("#editMap").attr("style", "visibility:hidden");
    		$("#saveMap").attr("style", "");
    		$("#cancelMap").attr("style", "");
    	} else {
    		$("#editMap").attr("style", "");
    		$("#saveMap").attr("style", "visibility:hidden");
    		$("#cancelMap").attr("style", "visibility:hidden");
    	}
    }

    function loadMap() {
    	curDiagram.model = go.Model.fromJson($("#mySavedModel").val());
    }

    function saveMap() {
    	$("#mySavedModel").val(myDiagram.model.toJson());
    	var nodeParam = JSON.parse(myDiagram.model.toJson()).nodeDataArray;
//    	var linkParam = JSON.parse(curDiagram.model.toJson()).linkDataArray;

    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 for(var i=0; i<nodeParam.length; i++){
			 nodeParam[i].frstRegUserId = userId;
			 nodeParam[i].lastChgUserId = userId;
		}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/updateTnBdgmNodeData', nodeParam, 'POST', 'nodeDataReg');
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/topology/updateLinkData', linkParam, 'POST', '');
    }




	function init() {
		$("#zoomFit").on("click", function(e) {
			curDiagram.zoomToFit();
		});
		$("#zoomIn").on("click", function(e) {
			curDiagram.commandHandler.increaseZoom();
		});
		$("#zoomOut").on("click", function(e) {
			curDiagram.commandHandler.decreaseZoom();
		});
		$("#loadMap").on("click", function(e) {
			loadMap();
		});
		$("#editMap").on("click", $("#editMap"), function(e) {
			buttonControl(e);
		});
		$("#saveMap").on("click", $("#saveMap"), function(e) {
			buttonControl(e);
			saveMap();
		});
		$("#cancelMap").on("click", $("#cancelMap"), function(e) {
			buttonControl(e);
		});

		$("#basicTabs").on("tabchange", function(e, index) {
 			changePage(index);
     	});
		$("#basicTabs").on("removetab", function(e, index1, index2) {
			deletePage(index1);
		});
		//createPage(0, "전국현황");

	}



});