
let MtsoInvtSlmtControl = {

	initialize: function() {
		let deferred = $.Deferred();

		MtsoInvtSlmtControl.setEventListener();

		return deferred.promise();
	}
	, setEventListener: function(){
		//등록
		$('#btnMtsoInvtReg').on('click', function(e) {
			let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
			let param = {
					regYn: "Y"
			};

			$a.popup({
				popid : tmpPopId,
				title : '국사 투자 시뮬레이션',
				url : '/tango-transmission-web/trafficintg/engineeringmap/MtsoInvtSlmtPopup.do',
				data : param,
				modal : false,
				windowpopup: true,
				movable : true,
				width : 1000,
                height : 750,
				callback : function() { // 팝업창을 닫을 때 실행
					$('#searchBtn11').click();
					// 선택된 데이터 초기화
		        	gridId11FocusInfo = [];
		        	gridId11BasFocusInfo = [];
				}
			});
	    });

		//수정
		$('#btnMtsoInvtMod').on('click', function(e) {
			if(gridId11FocusInfo.length == 0){
				callMsgBox('','I', "선택된 국사투자 시뮬레이션 정보가 없습니다." , function(msgId, msgRst){});
				return;
			}

			let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
			let param = gridId11FocusInfo;
			param.regYn = "N";

			$a.popup({
				popid : tmpPopId,
				title : '국사 투자 시뮬레이션',
				url : '/tango-transmission-web/trafficintg/engineeringmap/MtsoInvtSlmtPopup.do',
				data : param,
				modal : false,
				windowpopup: true,
				movable : true,
				width : 1000,
                height : 750,
				callback : function() { // 팝업창을 닫을 때 실행
					$('#searchBtn11').click();
					// 선택된 데이터 초기화
		        	gridId11FocusInfo = [];
		        	gridId11BasFocusInfo = [];
				}
			});
	    });

		//통합국 수정
		$('#btnMtsoInvtIntgMod').on('click', function(e) {
			if(gridId11BasFocusInfo.length == 0){
				callMsgBox('','I', "선택된 통합국사 정보가 없습니다.  ." , function(msgId, msgRst){});
				return;
			}

			let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
			let param = gridId11BasFocusInfo;
			if(gridId11BasFocusInfo.coverageId == ""
				|| gridId11BasFocusInfo.coverageId == undefined) { //커버리지 ID가 존재여부로 등록/수정을 판단
				param.regYn = "Y";
			} else {
				param.regYn = "N";
			}

			$a.popup({
				popid : tmpPopId,
				title : '국사 투자 시뮬레이션 통합국',
				url : '/tango-transmission-web/trafficintg/engineeringmap/IntgMtsoInvtSlmtPopup.do',
				data : param,
				modal : false,
				windowpopup: true,
				movable : true,
				width : 1000,
				height : 750,
				callback : function() { // 팝업창을 닫을 때 실행
					// 선택된 데이터 초기화
					gridId11BasFocusInfo = [];

					$('#mtsoSmltBasPageNo').val(1);
					$('#mtsoSmltBasRowPerPage').val(100);

					let paramData =  $("#searchMtsoInvtSmltForm").getData();
					paramData.pageNo = $('#mtsoSmltBasPageNo').val();
					paramData.rowPerPage = $('#mtsoSmltBasRowPerPage').val();
					paramData.mtsoInvtSmltId = gridId11FocusInfo.mtsoInvtSmltId; //국사투자 시뮬레이션기본그리드에서 선택된 ROW 정보
					paramData = Util.convertQueryString(paramData);

			    	$('#'+gridId11Bas).alopexGrid('showProgress');
			    	Util.jsonAjax({ url: '/transmisson/tes/engineeringmap/mtsoinvtslmt/getMtsoInvtSmltBasList'
						   , method:'GET'
						   , data : paramData
						   , async:true})
						.done(function(response) {
								$('#'+gridId11Bas).alopexGrid('hideProgress');
								let serverPageinfo = {
										dataLength  : response.pager.totalCnt, 	//총 데이터 길이
										current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
										perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
								};

								$('#'+gridId11Bas).alopexGrid('dataSet', response.dataList, serverPageinfo);
								//구분이 통합인 row만 조회하여 자동 선택을 시킨다
								let dataList = $('#'+gridId11Bas).alopexGrid("dataGet", {"intgDivVal":"INTG"});
								_.each(dataList, function(data, idx){
									let rowIdx = data._index.row;
									$('#'+gridId11Bas).alopexGrid('rowSelect', {_index: {row:rowIdx}}, true);
								});

								for(let i = 0 ; i < dataList.length ; i++){
									if (dataList[i].mtsoInvtSmltId ==gridId11BasFocusInfo.mtsoInvtSmltId ) {
										if (dataList[i].intgMtsoId ==gridId11BasFocusInfo.intgMtsoId ) {
											gridId11BasFocusInfo.rmkCtt = dataList[i].rmkCtt;
											gridId11BasFocusInfo.znUnitPlanVal = dataList[i].znUnitPlanVal;
											gridId11BasFocusInfo.coverageId = dataList[i].coverageId;

											break
										}
									}
								}

								if (dataList.length == 0) {
									$('#searchBtn11').click();
								}

								MtsoInvtSlmtControl.drawMtsoInvtCoverage(mtsoInvtSlmtCoverLayer, gridId11Bas);
								MtsoInvtSlmtControl.drawMtsoInvtCoverageLabel(mtsoInvtSlmtCoverLabelLayer, gridId11Bas);
							}
						);
				}
			});
		});

		//노드편집
		$('#btnMtsoInvtNodeMod').on('click', function(e){
    		mgMap.setMode('select'); // 노드편집 모드 제거

    		if(gridId11BasFocusInfo.geo != ""
    			&& gridId11BasFocusInfo.geo != undefined) {

    			let selectData = AlopexGrid.trimData($('#'+gridId11Bas).alopexGrid("dataGet" , {_state : {selected:true}}));

    			if (gridId11BasFocusInfo.geoNodeCnt >= 500) {
    				callMsgBox('','W', "선택한 영역의 노드갯수가 500개 이상일 경우 노드편집 할 수 없습니다." , function(msgId, msgRst){});
    				return;
    			}

    			$('#btnMtsoInvtNodeMod').hide();
        		$('#btnMtsoInvtNodeModCancel').show();

    			MtsoInvtSlmtControl.drawHighlightMtsoInvtCoverage(selectData, hMtsoInvtSlmtCoverLayer);
    		} else {
    			callMsgBox('','W', "선택한 통합국사 영역이 없습니다." , function(msgId, msgRst){});
    			return;
    		}
    	});

		//노드편집취소
		$('#btnMtsoInvtNodeModCancel').on('click', function(e){
			$('#btnMtsoInvtNodeModCancel').hide();
    		$('#btnMtsoInvtNodeMod').show();

    		mgMap.setMode('select'); //노드편집 모드 제거
    		Util.clearLayerFunc(hMtsoInvtSlmtCoverLayer);
		});

		//노드저장
		$('#btnMtsoInvtNodeSave').on('click', function(e){
    		let geoString = Util.getPolygonGeometryString();

    		if(geoString == ""
    			|| geoString == null){
    			callMsgBox('','W', "변경한 영역이 존재하지 않습니다." , function(msgId, msgRst){});
    			return;
    		}

    		let param = {};
    		param.mtsoInvtSmltId = gridId11BasFocusInfo.mtsoInvtSmltId;
    		param.intgMtsoId = gridId11BasFocusInfo.intgMtsoId;
    		param.geo = geoString;

    		$('#'+gridId11Bas).alopexGrid('showProgress');
    		Util.jsonAjax({ url: '/transmisson/tes/engineeringmap/mtsoinvtslmt/mtsoInvtSlmtNodeUpdate'
				   , method:'POST'
				   , data : param
				   , async:true})
				.done(function(response) {
						if(response.Result == "Success") {
							callMsgBox('','I', "노드정보를 수정하였습니다." , function(msgId, msgRst){});
							$('#btnMtsoInvtNodeModCancel').click();

							$('#mtsoSmltBasPageNo').val(1);
							$('#mtsoSmltBasRowPerPage').val(100);

							let paramData =  $("#searchMtsoInvtSmltForm").getData();
							paramData.pageNo = $('#mtsoSmltBasPageNo').val();
							paramData.rowPerPage = $('#mtsoSmltBasRowPerPage').val();
							paramData.mtsoInvtSmltId = gridId11FocusInfo.mtsoInvtSmltId; //국사투자 시뮬레이션기본그리드에서 선택된 ROW 정보
							paramData = Util.convertQueryString(paramData);

							Util.jsonAjax({ url: '/transmisson/tes/engineeringmap/mtsoinvtslmt/getMtsoInvtSmltBasList'
									, method:'GET'
									, data : paramData
									, async:true})
								.done(function(response) {
										$('#'+gridId11Bas).alopexGrid('hideProgress');
										let serverPageinfo = {
												dataLength  : response.pager.totalCnt, 	//총 데이터 길이
												current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
												perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
										};

										$('#'+gridId11Bas).alopexGrid('dataSet', response.dataList, serverPageinfo);
										//구분이 통합인 row만 조회하여 자동 선택을 시킨다
										let dataList = $('#'+gridId11Bas).alopexGrid("dataGet", {"intgDivVal":"INTG"});
										_.each(dataList, function(data, idx){
											let rowIdx = data._index.row;
											$('#'+gridId11Bas).alopexGrid('rowSelect', {_index: {row:rowIdx}}, true);
										});

										MtsoInvtSlmtControl.drawMtsoInvtCoverage(mtsoInvtSlmtCoverLayer, gridId11Bas);
									}
								);
						} else {
							callMsgBox('','I', "노드정보 수정에 실패하였습니다." , function(msgId, msgRst){});
						}
					}
				);
    	});

		//시뮬레이션
		$('#btnMtsoInvtSmlt').on('click', function(e) {
			if(gridId11BasFocusInfo.length == 0){
				callMsgBox('','I', "선택된 통합국사 정보가 없습니다." , function(msgId, msgRst){});
				return;
			}

			let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
			let param = {};
			//ECM_국사투자시뮬레이션정보
			param.afeYr = gridId11FocusInfo.afeYr;
			param.afeDemdDgr = gridId11FocusInfo.afeDemdDgr;
			param.topMtsoId = gridId11FocusInfo.topMtsoId;
			param.topMtsoNm = gridId11FocusInfo.topMtsoNm;
			param.mtsoInvtSmltId = gridId11FocusInfo.mtsoInvtSmltId;
			param.mtsoInvtSmltNm = gridId11FocusInfo.mtsoInvtSmltNm;
			//ECM_국사투자시뮬레이션기본
			param.intgMtsoId = gridId11BasFocusInfo.intgMtsoId;
			param.intgMtsoNm = gridId11BasFocusInfo.intgMtsoNm;
			param.mtsoInvtSmltId = gridId11BasFocusInfo.mtsoInvtSmltId;
			param.rmkCtt = gridId11BasFocusInfo.rmkCtt;
			param.lastChgDate = gridId11BasFocusInfo.lastChgDate;
			param.lastChgUserNm = gridId11BasFocusInfo.lastChgUserNm;
			param.znUnitPlanVal = gridId11BasFocusInfo.znUnitPlanVal;
			param.frstRegUserId = gridId11FocusInfo.lastChgUserId;

			$a.popup({
				popid : tmpPopId,
				title : '국사 투자 시뮬레이션',
				url : '/tango-transmission-web/trafficintg/engineeringmap/MtsoInvtSlmtDtlPopup.do',
				data : param,
				modal : false,
				windowpopup: true,
				movable : true,
				width : 1500,
                height : 900,
				callback : function() { // 팝업창을 닫을 때 실행
					let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
					routeanInqLayer.clearLayers();
//					console.log(routeanInqLayer);
//					opener.randerRouteAnlLnqView(param);
				}
			});
	    });
	}

	//국사투자 시뮬레이션정보 - 선택된 통합국사 커버리지
	, drawMtsoInvtCoverage : function(layerId, gridId){
		Util.clearLayerFunc(layerId);

		let selData = $('#'+gridId).alopexGrid('dataGet',{_state: {selected:true}});
		if(selData.length == 0){
			return;
		}

		let style = "MTSO_COV_DSN_LAYER";;
		let result = {features: []};

		_.each(selData, function(feature, idx) {

			if(feature.geo != ""
				&& feature.geo != undefined) {

				let geoJson = L.MG.Util.wktToGeoJSON(feature.geo);
				geoJson.properties = feature;
				geoJson.style = [{id: style}];
				result.features.push(geoJson);
			}
		}, this);

		if(result.features.length == 0){
			return;
		}

		let layer = mgMap.getCustomLayerByName(layerId);
		if(!layer) {
			layer = mgMap.addCustomLayerByName(layerId, {selectable: false});
		}
		layer.addData( result );

		window.mgMap.fitBounds(layer.getBounds(), window.mgMap.getZoom());


	}

	, drawMtsoInvtCoverageLabel : function(layerId, gridId){
		Util.clearLayerFunc(layerId);

		let selData = $('#'+gridId).alopexGrid('dataGet',{_state: {selected:true}});
		if(selData.length == 0){
			return;
		}

		let style = "MTSO_COV_DSN_LABEL";
		let result = {features: []};

		_.each(selData, function(feature, idx) {
			if(feature.geo != ""
				&& feature.geo != undefined) {

				let geometry = L.MG.Util.wktToGeometry(feature.geo);
				let geoJson = L.marker(geometry.getBounds().getCenter()).toGeoJSON();
				feature.mtsonm = "국사설계_"+feature.intgMtsoNm;
				feature.coverageterrnm = "국사설계_"+feature.intgMtsoNm;
				geoJson.properties = feature;
				geoJson.style = [{id: style}];
				result.features.push(geoJson);
			}
		}, this);

		var layer = mgMap.getCustomLayerByName(layerId);
		if(!layer) {
			layer = mgMap.addCustomLayerByName(layerId, {selectable: false});
		}

		layer.addData( result );
	}

	, drawHighlightMtsoInvtCoverage: function(layerList, layerId){

		let ft = mgMap.getSelectedFeatures();
		let style = layerId;
		let result = {features: []};

		_.each(layerList, function(feature, idx) {
			if(feature.geo != ""
				&& feature.geo != undefined) {
				if(feature.intgMtsoId == gridId11BasFocusInfo.intgMtsoId){
					let geoJson = L.MG.Util.wktToGeoJSON(gridId11BasFocusInfo.geo);
					geoJson.properties = feature;
					geoJson.style = [{id: 'MTSO_COV_H_DSN_LAYER'}];
					result.features.push(geoJson);
				}
			}
		}, this);

		let layer = mgMap.getCustomLayerByName(layerId);
		if(!layer) {
			layer = mgMap.addCustomLayerByName(layerId, {selectable: false});
		}

		layer.addData( result );
		window.mgMap.fitBounds(layer.getBounds(), window.mgMap.getZoom());

		let feature = null;
		if ( layer ) {
			if (layer.getLayers().length > 0) {
				let selDatas = layer.getLayers();
				for (var i=0; i<selDatas.length; i++) {
					feature = selDatas[i];
				}
			}
		}
		if ( feature ) { window.mgMap.setMode('trail-edit', {data: {feature: feature}}); }

	}
};
