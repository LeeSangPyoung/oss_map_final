/**
 * EqpSctnAcptCurst.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setRegDataSet(param);
        setEventListener();
        setGrid(1,100);
    };

    function setRegDataSet(data) {
    	$('#contentArea').setData(data);
    }

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    		sorting : true
    		},
    		rowOption : {
    			styleclass : function(data, rowOption){
    				if(data["lvl"] == 2)
    					return 'row-highlight2'
					if(data["lvl"] == 3)
    					return 'row-highlight3'
    			}
    		},
    		columnMapping: [{
    			align:'left',
    			key : 'rghtEqpNm',
				title : '장비명',
				width: '180px',
				treeColumn : true,
				treeColumnHeader : true
			}, {/* 국사명	 */
				key : 'rghtMtsoNm', align:'center',
				title : '국사명',
				width: '120px'
			}, {/* 국사타입		 */
				key : 'rghtMtsoTypNm', align:'center',
				title : '국사타입',
				width: '100px'
			}, {/* 장비타입    	 */
				key : 'rghtEqpRoleDivNm', align:'center',
				title : '장비타입',
				width: '100px'
			}],
			tree : { useTree:true, idKey:'treeNo', parentIdKey : 'treePrntNo',expandedKey : 'treeDivVal'},
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }


    function setEventListener() {

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(1, eObj.perPage);
         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

    	 $('#1'+gridId).on('dblclick', '.bodycell', function(e){
 	       	var dataObj = AlopexGrid.parseEvent(e).data;
     	 	var treeNo = dataObj.treeNo;
     	 	var dataList = $('#'+gridId).alopexGrid("treeGetParent", {"treeNo" : treeNo}, {recursive:true, inclusive:true});
//     	 	for(var i=0; i<dataList.length; i++){
//     	 		nodeData = { key: dataList[i].eqpId, name: dataList[i].eqpNm, source: "", loc: dataList[i].loc, eqpId: dataList[i].eqpId, eqpRoleDivCd: dataList[i].eqpRoleDivCd, eqpRoleDivNm: dataList[i].eqpRoleDivNm, mgmtGrpNm: dataList[i].mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: dataList[i].mtsoId};
//     	 		window.opener.myDiagram.model.addNodeData(nodeData);
//     	 	}

//     	 	var locXS = parseInt(nodeDataArray[nodeDataArray.length - 1].loc.substring(0, nodeDataArray[nodeDataArray.length - 1].loc.indexOf(' ')));

     	 	var locXS = window.opener.locX;
     	 	var locYS = window.opener.locY;

    		var nodeDataArray = window.opener.nodeDataArray;
    		var linkDataArray = window.opener.linkDataArray;

    		for(var i=0; i<dataList.length; i++){
    			var resObj = dataList[i];
    			var cnt = 0;
//    			var locYS = Number(locY);

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

	    			if(resObj.rghtMtsoTypCd == "1"){
	    				var cnt11 = 0;
	    				for(var j=0; j<nodeDataArray.length; j++){
	    					if(nodeDataArray[j].mtsoId == resObj.rghtMtsoId){
	    						cnt11++;
	    					}
	    				}
	    				if(cnt11 == 0){

	    					nodeData = { key: resObj.rghtMtsoId, name: resObj.rghtMtsoNm, mtsoId: resObj.rghtMtsoId, mtsoTypCd: resObj.rghtMtsoTypCd, category: "newGroup", color: "rgba(255,128,61,0.1)", isGroup: true, mtsoYn: "YES" };
	    					window.opener.myDiagram.model.addNodeData(nodeData);
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
	    					window.opener.myDiagram.model.addNodeData(nodeData);
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
	    					window.opener.myDiagram.model.addNodeData(nodeData);
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
	    					window.opener.myDiagram.model.addNodeData(nodeData);
	    				}
	    			}else if(resObj.rghtMtsoTypCd == "9"){
	    				var cnt99 = 0;
	    				for(var j=0; j<nodeDataArray.length; j++){
	    					if(nodeDataArray[j].mtsoId == resObj.rghtMtsoId){
	    						cnt99++;
	    					}
	    				}
	    				if(cnt99 == 0){
	//    					cntT--;
	    					nodeData = { key: resObj.rghtMtsoId, name: resObj.rghtMtsoNm, mtsoId: resObj.rghtMtsoId, mtsoTypCd: resObj.rghtMtsoTypCd, category: "newGroup", color: "rgba(0,0,0,0.1)", isGroup: true, mtsoYn: "YES" };
	    					window.opener.myDiagram.model.addNodeData(nodeData);
	    				}
	    			}

	    			locXS = parseInt(locXS) + 250;
	    			resObj.loc = locXS + " " + locYS;

					//장비 타입 별 장비 아이콘
					src = getEqpIcon(resObj.rghtEqpRoleDivCd, "");

					nodeData = { key: resObj.rghtEqpId, name: resObj.rghtEqpNm, source: src, loc: resObj.loc, eqpId: resObj.rghtEqpId, eqpRoleDivCd: resObj.rghtEqpRoleDivCd, eqpRoleDivNm: resObj.rghtEqpRoleDivNm, mgmtGrpNm: resObj.mgmtGrpNm, everExpanded: false, isTreeExpanded: false, category: "nodeData2", group: resObj.rghtMtsoId};
	     	 		window.opener.myDiagram.model.addNodeData(nodeData);

				}

    			var cntLink = 0;

				for(var j=0; j<linkDataArray.length; j++){
					if(((linkDataArray[j].lftEqpId == resObj.lftEqpId && linkDataArray[j].rghtEqpId == resObj.rghtEqpId) ||
						(linkDataArray[j].rghtEqpId == resObj.rghtEqpId && linkDataArray[j].lftEqpId == resObj.lftEqpId)) &&
						resObj.eqpSctnDivCd != "23" && resObj.eqpSctnDivCd != "24"){
						cntLink++;
					}
				}

				if(cntLink == 0){
					linkData = { eqpSctnId: "", from: resObj.lftEqpId, lftEqpId: resObj.lftEqpId, lftEqpNm: resObj.lftEqpNm, to: resObj.rghtEqpId, rghtEqpId: resObj.rghtEqpId, rghtEqpNm: resObj.rghtEqpNm, lftVal: resObj.lftMtsoLngVal+","+resObj.lftMtsoLatVal, rghtVal: resObj.rghtMtsoLngVal+","+resObj.rghtMtsoLatVal, portCapaNm: resObj.portCapaNm,trkVisible: false, ringVisible: false, wdmVisible: false, lineVisible: false, curviness: 0 };
					window.opener.myDiagram.model.addLinkData(linkData);
				}

    		}

    		var nodeTemp = window.opener.nodeTemp;
    		linkData = { eqpSctnId: "", from: nodeTemp.data.key, lftEqpId: nodeTemp.data.lftEqpId, lftEqpNm: nodeTemp.data.lftEqpNm, to: dataList[0].lftEqpId, rghtEqpId: dataList[0].lftEqpId, rghtEqpNm: dataList[0].lftEqpNm, lftVal: nodeTemp.data.lftMtsoLngVal+","+nodeTemp.data.lftMtsoLatVal, rghtVal: dataList[0].lftMtsoLngVal+","+dataList[0].lftMtsoLatVal, portCapaNm: resObj.portCapaNm,trkVisible: false, ringVisible: false, wdmVisible: false, lineVisible: false, curviness: 0 };
    		window.opener.myDiagram.model.addLinkData(linkData);

//			$a.close();
         });

	};


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');

    		$('#'+gridId).alopexGrid('dataSet', response.lowEqpData);
    	}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function setGrid(page, rowPerPage) {

		$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/lowEqpList', param, 'GET', 'search');
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

});