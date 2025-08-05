/*
 * Copyright (c) 2016 SK Telecom.
 * All right reserved.
 *
 * This software is the confidential and proprietary information of SK Telecom.
 * You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with SK Telecom.
 */

/**
 *
 * <ul>
 * <li>업무 그룹명 : TANGO-T GIS </li>
 * <li>서브 업무명 : 지도 링 목록조회</li>
 * <li>설 명 : PopupMapRingList.js</li>
 * <li>작성일 : 2017. 03. 23.</li>
 * <li>작성자 : HS.KANG </li>
 * </ul>
 */

var gisMap = null;
var mgMap;
var L;

$a.page(function(){
	var gridId = "dataGrid";
	var parentObj = {};
	var mtsoMgmtNo = ""; // 국소 번호
	var mgmtNo = "";	 // 관리번호
	var ringLayer;// 지도 보기 레이어
	var ringCableAndNodeData; // 링생성지도 케이블 , 노드(접속점, 국사) 정보
	var paramData= null;
	var ringInfo = null;

    this.init = function(id, param) {
    	initGrid();
    	setEventListener();
    	setSelectCode();

    	paramData = param;

    	setList(1,100,paramData);

//    	$("#btnSearch").trigger("click");

    };
	function initGrid() { //그리드 초기화
		initDetailGrid();

	}
	function initDetailGrid() {
		var mappingColumn =  [
			                     {key : "check", selectorColumn : true, width : "30px"},
					             {key : 'systmClCd', title : 'SK그룹사', width : '80px'},
					             {key : 'ntwkLineNo' , title : '네트워크회선번호', width: '120px'},
	    		                 {key : 'ringNm' , title : '링명', width: '200px', align: 'left'},
	    		                 {key : 'ringNetDivNm' , title : '망분류', width: '110px', align: 'left'},
	    		                 {key : 'topoCd' , title : '망종류', width: '90px', align: 'left'},
	    		                 {key : 'ringRegYn' , title : '등록여부', width: '80px'},
	    		                 {key : 'fedRingMgmtNo' , title : '휘더링번호', width: '100px'},
	    		                 {key : 'fedRingDivNm' , title : '휘더링유형', width: '100px'},
	    		                 {key : 'fedRingNm' , title : '휘더링명', width: '120px', align: 'left'},
	    		                 {key : 'mtsoMgmtNo' , title : '국사 ID', width: '100px', hidden:true},
	    		                 {key : 'ringNetDivCd' , title : '분류', width: '100px', hidden:true},
	    		                 {key : 'ringMgmtNo' , title : '링번호', width: '100px', hidden:true}
    		                 ];

		$('#' + gridId).alopexGrid({

			rowClickSelect : true,
			rowSingleSelect : false,
			columnMapping : mappingColumn,
			defaultColumnMapping : {
				align : 'center',
				resizing : true
			},
			paging: {
				pagerTotal : true
			},
			autoColumnIndex : true,
			columnFixUpto : 1,
			cellSelectable : true,
    		message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>검색 결과가 존재 하지 않습니다.</div>"
			}
		});

	};

	function setSelectCode() {
		httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/getNtwkTypCdList', null, 'GET', 'NtwkTypData'); // 망구분 데이터
		httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/getTopoList', null, 'GET', 'TopoData'); // 링유형 데이터
//		C01052
	}

	//event 등록
	function setEventListener() {
		$('#ntwkTypCd').clear();
		$('#topoSclCd').clear();

		$('#btnSearch').on('click', function(e) {
			var param =  $("#searchForm").serialize();

			setList(1,100,param);
		});

		// 링/서비스ETE 버튼
        $('#btnSrvcEte').on('click', function(e){
        	var data =  $('#dataGrid').alopexGrid('dataGet', {_state : {selected:true}});
            if (data.length < 1 || data[0].ntwkLineNo == '' && data[0].ntwkLineNo == null && data[0].ntwkLineNo == undefiend) {
                alert('선택된 링/회선 ID가 없습니다.');
                return;
            }
            data = data[0];

            var param = {'lineNo':data.ntwkLineNo};

        	$a.popup({
                width: 1580,
                height: 780,
                data: param,
                modal: true,
                url: "/tango-transmission-gis-web/common/SrvcEtePath.do",
                iframe: false,
                windowpopup: true,
                title: '링/서비스ETE경로 조회',
                other: 'top=100,left:100,scrollbars=yes, location=no',
                callback: function(){
                }
            });
        });

        /** 지도이동, 랑 정보관리 클릭시 */
		$('#btnMtsoMove,#btnRingInfoMgmt').on('click', function(e) {

			var rowData = AlopexGrid.trimData($('#' + gridId).alopexGrid("dataGet", {_state : {selected : true}}));

			if(rowData.length == 0){
				alert("체크선택된 항목이 없습니다.<br>하나의 링만 선택하시기 바랍니다.");
			}else if(rowData.length == 1){
				var dataObj = rowData[0];
				var type = $(this).attr("id");

				if(type == "btnMtsoMove") { // 지도이동
					if(typeof dataObj.mtsoMgmtNo == 'undefined'){
	     				alert("선택 시설물은 [관리 번호]가 없어 지도이동할 수 없습니다.");
		     		} else {
		     			if(gisMap == null || gisMap.opener == null) {
			    			gisMap = window.open('/tango-transmission-gis-web/tgis/Main.do');
				   		} else {
				   			gisMap.focus();
				   			gisMap.$('body').progress();
				   		}

						var mtsoMgmtNo = JSON.stringify(dataObj.mtsoMgmtNo);
						mtsoMgmtNo = mtsoMgmtNo.replace(/"/gi,"");

		     			var pointArr = [];
						var dataObj = new Object();
						dataObj.mgmtNo = mtsoMgmtNo;
						pointArr.push(dataObj);

						var d = {};
						d.pointList = pointArr;

//						gisMap.selectFeatures(d, true);
//						_M.selectFeatures(d, true);

						setTimeout(function(){ gisM(d);}, 5000);

		     		}
				}else { // 링 정보관리

					if(typeof dataObj.ringNetDivCd == 'undefined'){
	     				alert("해당링은 GIS에 등록되지 않았습니다.");
					}else {
						var systmClCd = JSON.stringify(dataObj.systmClCd);
						systmClCd = systmClCd.replace(/"/gi,"");

						var ntwkLineNo = JSON.stringify(dataObj.ntwkLineNo);
						ntwkLineNo = ntwkLineNo.replace(/"/gi,"");

						var ringNetDivCd = JSON.stringify(dataObj.ringNetDivCd);
						ringNetDivCd = ringNetDivCd.replace(/"/gi,"");

						var params = {"systmClCd":systmClCd, "ntwkLineNo":ntwkLineNo, "ringNetDivCd":ringNetDivCd};
	//					params = JSON.stringify(params);

						if(ringInfo != null){
							ringInfo.close();
						}

						ringInfo = $a.popup({
							width: '1600',
							height: '720',
							data: params,
							modal:false,
							url: "/tango-transmission-gis-web/mgmtntwk/RingMgmt.do",
							iframe: false,
							windowpopup: true,
							title: '링정보관리(NEW)',
							other: 'top=100,left:100,scrollbars=no, location=no',
				            callback: function(data) {
				            }
						});
					}

//					$(opener.location).attr("href", "javascript:Control.createRingInfoMgmt("+params+");");
				}

			} else {
				alert("하나의 링만 선택하시기 바랍니다.");
			}

		});

		/** 엑셀 다운로드 */
		$('#btnExcel').on('click', function(e) {
			var targetGrid;
			var fileName;
			var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());

			targetGrid = $('#'+gridId);
			fileName = '링목록조회_' + dayTime;

	  		if(targetGrid.alopexGrid('dataGet').length > 0){

				var excelWorker = new ExcelWorker({
					excelFileName : fileName,
					sheetList :[{sheetName : fileName, $grid: targetGrid}]
				}).export({
					merge : true,
					exportHidden : false,
					filtered : false,
					useGridColumnWidth : true,
					border : true
				});

	  		} else {
	  			alert("조회된 데이터가 없습니다. ");
	  		}

		});

	};

	function setList(page, rowPerPage,param){
    	if(JSON.stringify(param).length > 2){

    		$('#pageNo').val(page);
       	    $('#rowPerPage').val(rowPerPage);

       	    if (paramData.length > 2) {
       	    	param.toEqpId = paramData.toEqpId;
       	    	param.fromEqpId = paramData.fromEqpId;
       	    }

        	param.page = 1;
        	param.rowPerPage = 100;
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-tes-biz/transmisson/tes/configmgmt/commonlkup/networkTopoRingList', param, 'GET', 'search'); // 링목록조회(GIS)
        }
    }

	$(document).keydown(function(e) {
		if ( e.keyCode == 13 ) {
			$('#btnSearch').trigger('click');
		}
	});

	function gisM(dataObj){
		gisMap.$('body').progress();

	 	httpRequest('tango-transmission-gis-biz/transmission/gis/common/getCoordnates', dataObj, 'POST', 'mtsoMove');
	}

	function successCallback(response, status, jqxhr, flag){
		if(flag == 'NtwkTypData'){
			$('#ntwkTypCd').clear();
			var option_data =  [];
			NtwkTypData = [{value: "",text: "전체"}];
			for(var i=0; i<response.NtwkTypData.length; i++){
				NtwkTypData.push({value : response.NtwkTypData[i].ntwkTypCd, text : response.NtwkTypData[i].ntwkTypNm});
			}

			$('#ntwkTypCd').setData({
	             data:NtwkTypData
			});
		}

		if(flag == 'TopoData'){
			$('#topoSclCd').clear();
			var option_data =  [];
			TopoData = [{value: "",text: "전체"}];
			for(var i=0; i<response.TopoData.length; i++){
				TopoData.push({value: response.TopoData[i].topoSclCd, text : response.TopoData[i].topoSclNm});
			}

			$('#topoSclCd').setData({
	             data:TopoData
			});
		}

		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId,response, response.ntwkTopoRingList);
		}

		if(flag == 'mtsoMove'){

			mgMap = gisMap.window.mgMap;
			L = gisMap.window.L;
				var type = 'point';
				var features = [];

				var featureInfo = null;

				for (var i = 0; i < 3; i++) {
					if (i == 1) {
						type = 'line';
					} else if (i == 2) {
						type = 'polygon';
					}

					var fcltList = response[type + 'List'];

					if (fcltList != null) {
						for (var j = 0; j < fcltList.length; j++) {
							var hf = {};
							hf.coord = fcltList[j].coord;
							hf.mgmtNo = fcltList[j].mgmtNo;
							hf.style = type.toLocaleUpperCase();
							hf.type = type;

							featureInfo = {};
							featureInfo.type = type;
							featureInfo.mgmtNo = fcltList[j].mgmtNo;
							featureInfo.coord = fcltList[j].coord;
							featureInfo.layerNm = fcltList[j].layerNm;

//							_M.onOffLayer(featureInfo.layerNm, true);
							onOffLayer(mgMap,featureInfo.layerNm, true);

//							var featureGeoJson = _M.createFeature(hf);
							var featureGeoJson = createFeature(hf);
							var layer = L.GeoJSON.geometryToLayer(featureGeoJson);
							if (layer == null) {
								continue;
							}
							layer.feature = L.GeoJSON.asFeature(featureGeoJson);
							layer.feature.getLayerId = function() {
								return '';
							}
							features.push(layer);
						}
					}
				}
				mgMap.setSelectFeatures(features);
				mgMap.fitBounds(mgMap.getSelectLayer().getBounds());

//				if(features != null && features.length == 1 && featureInfo != null){
//
//					View.setContextMenu(featureInfo.mgmtNo, featureInfo.layerNm, featureInfo.coord, featureInfo.type);
//				}

				$('body').progress().remove();
		}

	}

	function onOffLayer(aMgMap,layrNm , flag) {

		var layers = aMgMap.getLayersByAlias(layrNm);
		for (var i = 0; i < layers.length; i++) {

			/*layers[i].setVisible(true);*/
			//flag(true,false) 값에 따른 조건 로직으로 변경
			//
			if(flag == true){
				layers[i].setVisible(true);
			}else{
				layers[i].setVisible(false);
			}

		}
	}

	function createFeature(param) {
		var des = {};

		if (param == null)
			return des;

		if (!param.style) {
			if (param.type.toLowerCase() == 'point' && param.layerNm != null) {
				param.style = _M.setFeatureStyle(param.layerNm);
			} else if (param.type.toLowerCase() == 'point'
					&& param.style == null) {
				param.style = 'RING_JP_POINT';
			} else if (param.type.toLowerCase() == 'linestring'
					&& param.style == null) {
				if(param.systmClCd != null  && param.systmClCd == 'SK'){
					if(param.mwYn != null && param.mwYn == 'Y'){
						param.style = 'ETE_MICRO_WAVE';
					}else{
						param.style = 'ETE_CABLE_T';
					}
				}else{
					param.style = 'ETE_CABLE_B';
				}
//				param.style = 'RING_CABLE_LINE';
			} else if (param.type.toLowerCase() == 'polygon'
					&& param.style == null) {
				param.style = 'RING_CABLE_POLYGON';
			}
		}
		if (param.type == 'point') {
			param.type = 'Point';
		}
		if (param.type == 'linestring' || param.type == 'line') {
			param.type = 'LineString';
		}
		if (param.type == 'polygon') {
			param.type = 'Polygon';
		}

		des = new Object();
		des.mgmtNo = param.mgmtNo;

		des.properties = param;

		des.type = 'Feature';
		des.geometry = new Object();
		des.geometry.type = param.type;
		des.geometry.coordinates = typeof (param.coord) == 'string' ? JSON.parse(param.coord) : param.coord;
		des.style = [ {
			id : param.style
		} ];
		return des;
	}

	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
	}

	function setSPGrid(GridID,Option,Data) {

		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};

		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
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

