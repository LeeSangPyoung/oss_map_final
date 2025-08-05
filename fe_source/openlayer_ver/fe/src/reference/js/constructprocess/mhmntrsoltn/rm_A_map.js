
// 지도 이동 타입
var MOVE_TYPE = {
    NONE : 0,	// 지도를 이동 X
    MOVE_REGION : 1, // 지도 이동 시 지역을 기준으로 이동한다.
    MOVE_LATLNG : 2, // 지도 이동 시 좌표 기준으로 이동한다(필요 정보 : lat, lng, depth, mapLv)
};
//해당 지역 경계 폴리곤 스타일 설정 정보
var layerStyle = {
    // 시도
    "depth2": {fillOpacity: 0.1, fillColor: "#fff", opacity: 1.0, strokeColor: "#80F5FF", weight: 2},
    // 시군구
    "depth3": {fillOpacity: 0.1, fillColor: "#fff", opacity: 1.0, strokeColor: "#80F5FF", weight: 2},
    // 읍면동
    "depth4": {fillOpacity: 0.1, fillColor: "#fff", opacity: 1.0, strokeColor: "#9696bc", weight: 2}
};
//폴리곤 레이어 스타일 (시도/시군구/읍면동 경계 설정)
var polygonLayerStyle = {fill: false, stroke: true, opacity: 1.0, strokeColor: "#9696bc", weight: 1};
//마우스가 행정경계에 들어가면 하이라이트 스타일
var highLightLayerStyle = {fillOpacity: 1.0, fillColor: "#9696bc", opacity: 1.0, strokeColor: "#9696bc", weight: 1};
// 현재 레이어 상 이동 가능한 줌 영역
var zoomBounds = {min: 2, max: 5};
// 지도 표현 한계 영역(독도 표시)
var maxBounds = [[32.55750237326084, 124.4], [38.579344152742955, 132.027656]];
// 전국 지도 설정 좌표(setView 설정값)
var nationMapConfig = {zoom : 2, center: [35.601484032128495, 127.9075683370008]};
// private
var defaultOpt = {
    location : nationMapConfig, // 기본 좌표 및 줌 레벨
    minZoom : 1, // 최소 줌
    maxZoom : 14, // 최대 줌
    height : "655px", // 맵 사이즈
    contextmenu : true ,// 컨택스트 메뉴
    zoomSliderControl : false, // 줌 슬라이더 컨트롤
    scrollWheelZoom : false, // 마우스 휠 (마우스 휠 이벤트에서 관리를 위해 지도 휠 동작 막음)
    keyboard : false // 키보드 입력 막기
};

//dongCd 기준으로 MapLv를 구한다
var getMapLv = function (dongCd) {
	var dongCd = String(dongCd);
	var lv = "";
		
	if (dongCd == "0000000000") {
		lv = "depth1"; // 전국
	} else if (dongCd.length == 2) {
		lv = "depth2"; // 시도
	} else if (dongCd.length == 5) {
		lv = "depth3"; // 시군구
	} else {
		lv = "depth4"; // 읍면동
	}
	
	return lv;
};

var T_a = {};

T_a.Map = (function() {

	// 레이어 명
	var polygonLayer = null; // 시도/시군구/읍면동 경계 생성을 위한 레이어
	var sidoLayer = null;
	var sggLayer = null;
	var emdLayer = null;
	
	// 마우스
	var mouseLatLng = {};	// 현재 마우스 좌표
	var dragEventFlag = false;
	
	// 지도 위치 구성 정보
	var ldongCd = "0000000000";
	// 지도 현재 뎁스
	var mapLv = "depth1";

	//var isInited = false;	// 맵 생성 호출 여부
	
	//var mapDataModel = null;
	var cblMapDataModel = null;
	
	// data
	var markerObjects = []; // 마커 (삭제 처리 위한 배열)

	// 맵 생성
	var mapCreate = function (dongCd, lat, lng, zoomLv, layerLv) {
		// 'map'은 맵 생성을 위한 target div element의 id
		return MapGeo.create("rmMap", "TANGO-RM", defaultOpt).then(function(map) {
			// 생성된 map 객체를 window 객체에 추가하여 전역으로 사용 가능
			window.mgMap_rm = map;
			/* 시도/시군구/읍면동 경계 생성을 위한 레이어 생성 */
			polygonLayer = L.geoJson([], {
				// 스타일 적용
				style : function(geojson) {
					return polygonLayerStyle;
				},
				// 레이어 이벤트 추가 시 사용
				onEachFeature : function(geojson, feature) {
				}
			}).addTo(map);
			
			// 지도 이동 영역 제한.
			map.setMaxBounds(maxBounds);
			
			/* baselayer 설정 값 가져오기 */
			//emdLayer = mgMap_rm.getLayerById("DAWUL_EMD_A");
			emdLayer = mgMap_rm.getLayerById("EMD_TANGO_RM");
			
			//emdLayer = mgMap_rm.getLayerById("DAWUL_RI_A");
			
			//sggLayer = mgMap_rm.getLayerById("DAWUL_SGG_A");
			sggLayer = mgMap_rm.getLayerById("SGG_TANGO_RM");
			
			//sidoLayer = mgMap_rm.getLayerById("DAWUL_SIDO_A");
			sidoLayer = mgMap_rm.getLayerById("SIDO_TANGO_RM");
			
			if (dongCd == "" || dongCd == undefined) {
				ldongCd = "0000000000";
			} else {
				ldongCd = dongCd;
			}
			
			mapLv = getMapLv(ldongCd);
			
			gotoResionMap(MOVE_TYPE.MOVE_REGION);							
			
			// 마우스 휠 제어를 지도 라이브러리가 아닌 기본 마우스 휘 이벤트를 이용해서 제어
			// (지도 라이브러리 상 마우스 휠 동작을 레이어별로 정할 방법을 찾을 수 없다.)
			$("#rmMap").on("mousewheel DOMMouseScroll", function(e) {
				zoomChange(e);
			});
			
			/* base layer에 이벤트 추가 */
			sidoLayer.addEventListener('mouseover', function(e) {
				e.layer.setStyle(highLightLayerStyle);
			});
			sggLayer.addEventListener('mouseover', function(e) {
				e.layer.setStyle(highLightLayerStyle);
			});
			emdLayer.addEventListener('mouseover', function(e) {
				e.layer.setStyle(highLightLayerStyle);
			});

			// 마우스가 행정경계에 벗어나면 원래 스타일을 설정합니다.
			sidoLayer.addEventListener('mouseout', function(e) {
				sidoLayer.resetStyle(e.layer);
			});
			sggLayer.addEventListener('mouseout', function(e) {
				sggLayer.resetStyle(e.layer);
			});
			emdLayer.addEventListener('mouseout', function(e) {
				emdLayer.resetStyle(e.layer);
			});
			
			// 지도 상 마우스 좌표를 저장한다.
			map.on("mousemove", function(e) {
				mouseLatlng = e.latlng;
			});

			// 변경된 지역을 확인하기 위해 dragEventFlag 사용
			map.on("dragstart", function(e) {
				dragEventFlag = true;
			});
			
			map.on("moveend", function(e) {
				if (dragEventFlag) {
					dragEventFlag = false;
					moveMap();
				}
			});
			
			/* 팝업 발생 시 줌 슬라이더 감추기 및 행정동 경계 셀 이동 제한 */
			map.on("popupclose", function(e) {
				$("#rmMap").trigger("closeLegend");
			});
			
			/* 팝업 발생 시 줌 슬라이더 재생성 및 행정동 경계 셀 이동 제한 */
			map.on("popupopen", function(e) {
				$("#rmMap").trigger("openLegend");
			});
			
			isInited = true;
			
			return isInited;
		});
	};
	
	// 선택된 지역으로 맵 이동, 지역 셀렉트 박스 설정
	var gotoResionMap = function (moveType, dongCd, lat, lng, zoomLv, layerLv) {
		if (!moveType){
			moveType = MOVE_TYPE.NONE;
		}
		
		if (dongCd) {
			mapLv = getMapLv(dongCd);
			ldongCd = dongCd;
		}

		setSelectBoxByAdongCd(ldongCd, mapLv);
		
		if ("depth1" == mapLv) {
			clearMarkers(); // 마커 배열 삭제
			showAllMap();
			getCblMapDataList(); // 지도 - 지역별 케이블분포 조회
		} else if ("depth2" == mapLv) {
			clearMarkers(); // 마커 배열 삭제
			showSidoMap(moveType, lat, lng, zoomLv);
			getCblMapDataList(); // 지도 - 지역별 케이블분포 조회
		} else if ("depth3" == mapLv) {
			clearMarkers(); // 마커 배열 삭제
			showSggMap(moveType, lat, lng, zoomLv);
			getCblMapDataList(); // 지도 - 지역별 케이블분포 조회
		} else if ("depth4" == mapLv) {
			showEmdMap(moveType, lat, lng, zoomLv);
		} 
	};
	
	
	// 마우스 휠에 따른 줌 이벤트 처리 함수
	var zoomChange = function (e) {
		var val = e.originalEvent.wheelDelta;
		var zoom = mgMap_rm.getZoom();
		
		// depth 가 전국인 경우 줌을 고정한다.
		if (mapLv != "depth1") {
			if (val > 0) {
				zoom++;// zoomIn 양수
			} else if (val < 0) {
				zoom--;// zoomOut 음수
			}			
		}

		if (zoomBounds.min <= zoom && zoomBounds.max >= zoom) {
			mgMap_rm.setZoom(zoom);
		}
		
		if (zoomBounds.min > zoom) {
			if ("depth1" == mapLv) { // 전국
				
			} else if ("depth2" == mapLv) { // 시도(전국)
				ldongCd = "0000000000";
				mapLv = "depth1";
				gotoResionMap(MOVE_TYPE.MOVE_REGION);
				
				$("#dongCd").val(ldongCd);
		    	$("#dongNm").html("전국");
				//getCblBubbleChartList(ldongCd);
				//getCblCntChartList(ldongCd);
			} else if ("depth3" == mapLv) { // 시군구
				ldongCd = ldongCd.substring(0, 2);
				mapLv = "depth2";
				gotoResionMap(MOVE_TYPE.MOVE_REGION);
				
				$("#dongCd").val(ldongCd);
		    	$("#dongNm").html("");
		    	getCblDongNm(ldongCd, mapLv);
		    	//getCblBubbleChartList(ldongCd);
		    	//getCblCntChartList(ldongCd);
			} else if ("depth4" == mapLv) { // 읍면동
				if (zoom < 7) {
					ldongCd = ldongCd.substring(0, 2);
					mapLv = "depth2";
					gotoResionMap(MOVE_TYPE.MOVE_REGION);
					
					$("#dongCd").val(ldongCd);
			    	$("#dongNm").html("");
			    	getCblDongNm(ldongCd, mapLv);
			    	//getCblBubbleChartList(ldongCd);
			    	//getCblCntChartList(ldongCd);
				}
			}
		}
	};
	
	// 마커 배열 삭제
    var clearMarkers = function () {
        while (markerObjects.length > 0) {
			// marker 내 contextmenu 제거
        	var m = markerObjects[0];
			if (m._items) {
				for (var i = 0; i < m._items.length; i++) {
					m._map.contextmenu.removeItem(m._items[i]);
				}
				m._items.length = 0;	
			}
			if(m.options)m.options.contextmenuInheritItems = true;				
			
			// marker 제거
			mgMap_rm.removeLayer(markerObjects[0]);
			markerObjects.splice(0, 1);
		}
	};
	
	// 마커 관련 모든 tango ajax 호출 취소
	var cblMapDataModelAbort = function () {
		if (cblMapDataModel && cblMapDataModel.readyState != 4) {
			cblMapDataModel.abort();
		}
	};
	
	// 지역 마커 정보를 가져온다. 
	var getCblMapDataList = function () {
		
		cblMapDataModelAbort();
		
		$("#rmMapDiv").progress({appendIn : true});
		
		var orgGrpCd = getOrgGrpCd();
		//var clctDt = getClctDt();
		
		cblMapDataModel = Tango.ajax({
			url : "tango-transmission-biz/transmission/constructprocess/manholemgmt/getManholeMapDataList",
			data : {
				orgGrpCd : orgGrpCd,
				skAfcoDivCd : $('#skAfcoDivCd').val(),
				mhAlmErrCd : $('#mhAlmErrCd').val()
				//clctDt : clctDt,
				//ldongCd : ldongCd,
				//mapLv : mapLv
			},
			method : "GET"
		}).done(function(response, status, jqxhr, flag) {
			console.log("지역별 맨홀분포", response);
			
			$("#rmMapDiv").progress().remove();
			
			drawRegionMarker(response);
		}).fail(function(response){
			$("#rmMapDiv").progress().remove();
		});
		
		//통계전체 조회
		getManholeStc('');
	};
	
	
	// 지역(시도, 시군구, 읍면동) 마커를 추가한다)
	var drawRegionMarker = function (markerInfoList) {
		
		$(markerInfoList).each(function(i, data) {			
			var dongCd = data.ldongCd;
			var dongNm = data.ldongNm;
			var totCnt = data.totCnt;
			var succCnt = data.succCnt;
			var failCnt = data.failCnt;
			var x = data.x;
			var y = data.y;
			
			var divIcon = L.divIcon({
				className : 'ta2_marker ta2_marker_lg ta2_marker_level_1',
				html : '<div class="marker_inner cei_spacing" style="letter-spacing:-0.8px;">' + '<span style="color:#ff0000">' + failCnt + '</span>' + '</div>'
							+ '<div class="marker_arrow">'
							+ '<div style="position:absolute;bottom:-20px;color:#fff;border-radius:5px;white-space:nowrap;margin-left:-15px;">'
							+ dongNm + '</div></div>'
							+ '<div class="codeTag hide">' + dongCd + '</div>',
						iconSize : [ 36, 36 ],
						iconAnchor : [ 18, 36 ],
						popupAnchor : [ 0, -36 ]
				});
		
				var latLngCode = [ Number(data.y), Number(data.x) ];
				
				var config = {};
				config.icon = divIcon;
				config.riseOnHover = true;
				config.riseOffset = 99999;
				config.contextmenu = true;
				config.contextmenuInheritItems = false;
				//config.contextmenuItems = contextmenuItems;
				//if(selectedCell != "")config.zIndexOffset = 10000;
				config.data = data;
				
				var marker = L.marker(latLngCode, config).addTo(mgMap_rm);
				var element = $(marker.getElement());
				
				//지도클릭이벤트
				element.context.onclick = function(element){
					console.log("A지도 클릭 동코드", dongCd);
					$("#dongCd").val(dongCd);
			    	$("#dongNm").html(dongNm);
			    	$("#dongNm2").html(dongNm);
			    	$("#dongNm3").html(dongNm);
			    	
					//getCblBubbleChartList(dongCd);
					
					var lv = getMapLv(dongCd);
					
					/*if (lv == "depth4") {
						getCblDblLineChartList(dongCd);
					} else {
						getCblCntChartList(dongCd);
					}*/
					
					getManholeStc(dongCd);
					
				}.bind(marker);
				
				element.context.ondblclick = function(element) {
					console.log("A지도 더블 클릭 동코드", dongCd);
					// 더블클릭하면 onclick도 같이 실행이 되어서 
					// 더블클릭시에는 지도 이동만 구현
					//var lv = getMapLv(dongCd);
					//if (lv != "depth4") {
						//gotoResionMap(MOVE_TYPE.MOVE_REGION, dongCd);
					//}
						
					getManholeStc(dongCd);
				}.bind(marker);
								
				markerObjects.push(marker);
				//$("#map_box").progress().remove();
		});
	};
	
	// 전국 표시(mapAdongCd 기준)
	var showAllMap = function () {
		boundZoomSet("depth1", 2);
		polygonLayer.clearLayers();
		
		mgMap_rm.setView(nationMapConfig.center, nationMapConfig.zoom);
		mgMap_rm.setMaxBounds(maxBounds);
		
		if (window.mgMap != undefined) {
			window.mgMap.setView(nationMapConfig.center, nationMapConfig.zoom);
		}
	};
	
	// 해당 시도 표시
	var showSidoMap = function (moveType, lat, lng, zoomLv) {
		L.MG.Api.getSggByCode(ldongCd.substring(0, 2), {
			geometry : true
		}).then(function(result) {
			var polygonJsons = [], textJsons = [], geojson, properties;

			_.each(result, function(item, index) {
				properties = {
					type : "sgg",
					code : item.SGG_CODE,
					name : item.SGG_NAME
				};
				// 폴리곤
				geojson = L.MG.Util.wktToGeoJSON(item.GEOM);
				geojson.properties = properties;
				polygonJsons.push(geojson);
			});
			
			// 지도 API 비동기 실행 시 결과 출력이 바꿔는 경우가 발생 방지용
			if ("depth2" == mapLv) {	
				polygonLayer.clearLayers();
				polygonLayer.addData(polygonJsons);
	
				polygonLayer.setStyle(layerStyle["depth2"]);
	
				if (moveType == MOVE_TYPE.MOVE_REGION) {
					boundZoomSet("depth2", getZoomLvByLayer(polygonLayer));
					mgMap_rm.fitBounds(polygonLayer.getBounds());
					
					if (window.mgMap != undefined) {
						window.mgMap.fitBounds(polygonLayer.getBounds());
					}
					
				} else if(moveType == MOVE_TYPE.MOVE_LATLNG) {
					boundZoomSet("depth2", zoomLv);	//레이어 바운더리 설정
					mgMap_rm.setView([lat, lng], zoomLv);
				}
			}
		});
	};
	
	// 해당 시군구 표시(adongCd 기준)
	var showSggMap = function (moveType, lat, lng, zoomLv) {
		L.MG.Api.getHJEmdByCode(ldongCd.substring(0, 5), {
			geometry : true
		}).then(function(result) {
			var polygonJsons = [], textJsons = [], geojson, properties;
			var selectCode;
			
			_.each(result, function(item, index) {
				properties = {
					type : "emd",
					code : item.ADMCODE,
					name : item.EMD_NAME
				};
				// 폴리곤
				geojson = L.MG.Util.wktToGeoJSON(item.GEOM);
				geojson.properties = properties;
				polygonJsons.push(geojson);
			});

			// 지도 API 비동기 실행 시 결과 출력이 바꿔는 경우가 발생 방지용
			if ("depth3" == mapLv){	
				polygonLayer.clearLayers();
				polygonLayer.addData(polygonJsons);
	
				polygonLayer.setStyle(layerStyle["depth3"]);
				
				if (moveType == MOVE_TYPE.MOVE_REGION) {
					boundZoomSet("depth3", getZoomLvByLayer(polygonLayer));
					mgMap_rm.fitBounds(polygonLayer.getBounds());
					
					if (window.mgMap != undefined) {
						window.mgMap.fitBounds(polygonLayer.getBounds());
					}
					
				} else if(moveType == MOVE_TYPE.MOVE_LATLNG) {
					boundZoomSet("depth3", zoomLv);	//레이어 바운더리 설정
					mgMap_rm.setView([lat, lng], zoomLv);
				}
			}
		});
	};
	
	// 실 지도 상 해당 읍면동 표시
	var showEmdMap = function (moveType, lat, lng, zoomLv) {
		L.MG.Api.getHJEmdByCode(ldongCd, {
			geometry : true
		}).then(function(result) {
			console.log("result", result);
			var geojson = L.MG.Util.wktToGeoJSON(result[0].GEOM);
			var geometry = L.MG.Util.wktToGeometry(result[0].GEOM);
			
			mgMap_rm.fitBounds(geometry.getBounds());
			
			if (window.mgMap != undefined) {
				window.mgMap.setView([result[0].COORD_Y, result[0].COORD_X], 8);
			}
		});
	};
	
	// 지도 중점 좌표가 바뀐경우 해당 지역을 기준으로 다시 셀과 마커를 그린다.
	var moveMap = function () {
		L.MG.Api.getHJEmdByPoint(window.mgMap_rm.getCenter()).then(function(result) {
			var adongCode = result.ADMCODE;
			
			if (adongCode) {
				switch (mapLv) {
					case "depth2":
						adongCode = adongCode.substring(0, 2);
						break;
					case "depth3":
						adongCode = adongCode.substring(0, 5);
						break;
					case "depth4":
						break;
				}
				
				if (adongCode != ldongCd) {
					ldongCd = adongCode;
					
					if ("depth1" != mapLv) {
						gotoResionMap(MOVE_TYPE.NONE);
					}
				}
			}
		});
	}
	
	// 시도/시군구/읍면동 별 레이어 레벨 일괄 조정
	var boundZoomSet = function (zoom, boundZoom) {
		mapLv = zoom;
		var zoomArr = [];
		var baseLayer = mgMap_rm.getBaseLayer();

		zoomBounds.min = boundZoom;
		zoomBounds.max = boundZoom + 2;

		switch (mapLv) {
		case "depth1": // 전국
			zoomArr = [1, 14, 15, 15, 15, 15, 15];
			break;
		case "depth2": // 시도(전국)
			zoomArr = [1, 1, 2, 14, 15, 15, 15];
			break;
		case "depth3": // 시군구
			zoomArr = [1, 1, 1, 1, 2, 14, 15];
			break;
		case "depth4": // 읍면동
			zoomArr = [1, 1, 1, 1, 2, 14, 15];
			break;
		}
		
		sidoLayer.properties.minZoom = zoomArr[0];
		sidoLayer.properties.maxZoom = zoomArr[1];
		
		sggLayer.properties.minZoom = zoomArr[2];
		sggLayer.properties.maxZoom = zoomArr[3];
		
		emdLayer.properties.minZoom = zoomArr[4];
		emdLayer.properties.maxZoom = zoomArr[5];
		
		baseLayer.options.minZoom = zoomArr[6];
	}
	
	// Layer 기준 fitBounds 시 최소 zoom LV 구하기
	var getZoomLvByLayer = function (layer) {
		return mgMap_rm.getBoundsZoom(layer.getBounds());
	}
	
	var moveGisMap = function() {
		var center = mgMap_rm.getCenter();
		console.log("center", center);
		
		if (window.mgMap != undefined) {
			window.mgMap.setView(center, 6);
		}
	}
	
	return {
		/**
		 * init
		 * 화면에 표시되는 지도를 초기화한다.	
		 */
		init: function(dongCd, lat, lng, zoomLv, layerLv){
			return mapCreate(dongCd, lat, lng, zoomLv, layerLv); // 맵 생성			
		},
		
		setGotoResionMap : function(dongCd){
			gotoResionMap(MOVE_TYPE.MOVE_REGION, dongCd);
		}
		
	};
	
})();
