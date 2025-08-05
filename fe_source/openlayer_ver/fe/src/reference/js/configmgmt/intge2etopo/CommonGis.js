function getCenter3(type, coords, map) {
		var i, halfDist, segDist, dist, p1, p2, ratio;

		var points = [];

		if (typeof (coords) == 'string') {
			coords = JSON.parse(coords);
		}
		if (!$.isArray(coords)) {
			return;
		}
		if (type.toUpperCase() == 'POINT') {
			return new L.LatLng(coords[1], coords[0], coords[2]);
		} else if (type.toUpperCase() == 'POLYGON'
				|| type.toUpperCase() == 'MULTILINESTRING') {
			coords = coords[0];
		}
		for (var i = 0; i < coords.length; i++) {
//			coords[i] = L.LatLng(coords[i][1], coords[i][0], coords[i][2]);
			points[i] = map.latLngToLayerPoint(coords[i]);
		}

		len = points.length;

		if (!len) {
			return null;
		}

		for (i = 0, halfDist = 0; i < len - 1; i++) {
			halfDist += points[i].distanceTo(points[i + 1]) / 2;
		}

		if (halfDist === 0) {
			return map.layerPointToLatLng(points[0]);
		}

		for (i = 0, dist = 0; i < len - 1; i++) {
			p1 = points[i];
			p2 = points[i + 1];
			segDist = p1.distanceTo(p2);
			dist += segDist;

			if (dist > halfDist) {
				ratio = (dist - halfDist) / segDist;
				return map.layerPointToLatLng([ p2.x - ratio * (p2.x - p1.x),
						p2.y - ratio * (p2.y - p1.y) ]);
			}
		}
	}

	function createFeature(param) {
		var des = {};

		if (param == null)
			return des;

		if (!param.style) {
			if (param.type.toLowerCase() == 'point' && param.layerNm != null) {
				param.style = setFeatureStyle(param.layerNm);
			} else if (param.type.toLowerCase() == 'point'
					&& param.style == null) {
				param.style = 'RING_JP_POINT';
			} else if (param.type.toLowerCase() == 'linestring'
					&& param.style == null) {
				if(param.systmClCd != null  && param.systmClCd == 'SK'){
					param.style = 'ETE_CABLE_T';
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

	function createFeatures(src, styleId) {
		var des = [];

		if (!$.isArray(src)) {
			return null;
		}
		for (var i = 0; i < src.length; i++) {
			if (styleId != null) {
				src[i].style = styleId;
			}
			des.push(createFeature(src[i]));
		}
		return des;
	}

	function setFeatureStyle(layerNm) {
		for ( var key in L.MG.StyleCfg._customStyle.map) {
			var style = L.MG.StyleCfg._customStyle.map[key];
			var urlSpl = style.iconUrl == null ? [''] : style.iconUrl.split('/');
			if (urlSpl != null && urlSpl[urlSpl.length-1].indexOf(layerNm) == 0) {
				return key;
			}
		}

		for ( var key in L.MG.StyleCfg._styleCfg.map) {
			var style = L.MG.StyleCfg._styleCfg.map[key];
			var urlSpl = style.iconUrl == null ? [''] : style.iconUrl.split('/');
			if (urlSpl != null && urlSpl[urlSpl.length-1].indexOf(layerNm) == 0) {
				L.MG.StyleCfg._customStyle.map[layerNm] = style;
				return layerNm;
			}
		}
	}

	function setCustomStyle() {
		var styles = [{ id : 'RING_LABEL_TEXT',
			  type : L.MG.StyleCfg.STYLE_TYPE.TEXT, // 텍스트 타입
			   options : {
							labelColumn : 'LABEL',
							faceName : '굴림',
							size : '15',
							color : 'black',
							hAlign : 'left',
							vAlign : 'bottom'
						}},

				{
					id : 'RING_JP_POINT',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : L.MG.ENV.APP_IMAGEPATH
						+ '/res/symbols/JP_16_JP001.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},

				{
					id : 'RING_JP_POINT_GREEN_A_T',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입 그린함체_전체__SKT
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/them_01.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},
				{
					id : 'RING_JP_POINT_GREEN_B_T',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입 그린함체_일부__SKT
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/them_04.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},
				{
					id : 'RING_JP_POINT_GREEN_D_T',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입 그린함체_폭탄__SKT
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/them_07.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},

				{
					id : 'RING_JP_POINT_GREEN_A_B',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입 그린함체_전체__SKB
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/them_02.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},

				{
					id : 'RING_JP_POINT_GREEN_B_B',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입 그린함체_일부__SKB
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/them_05.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},

				{
					id : 'RING_JP_POINT_GREEN_D_B',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입 그린함체_폭탄__SKB
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/them_08.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},

				{
					id : 'CESS_WORKER_T',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/WORKER_SKT.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
				}, {
					id : 'CESS_WORKER_B',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/WORKER_SKB.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
				}, {
					id : 'CESS_FLAG',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/Flag.png',
						iconSize : [ 36, 34 ],
						iconAnchor : [ 18, 34 ]
					}
				}, {
					id : 'WORKER_POINT',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/ico_worker.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				}, {
					id : 'VIVID_POINT',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT,
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/vivid_point.png',
						iconSize : [ 48, 48 ],
						iconAnchor : [ 24, 24 ]
//						iconSize : L.point(16,16),
//						iconAnchor : L.point(10,10)
					}
				}, {
					id : 'RING_CABLE_LINE',
					type : L.MG.StyleCfg.STYLE_TYPE.LINE, // 라인타입
					options : {
						opacity : 1.0,
						color : '#00ff00',
						weight : 5,
						dashArray : null
					}
				}, {
					id : 'RING_CABLE_POLYGON',
					type : L.MG.StyleCfg.STYLE_TYPE.POLYGON, // 폴리곤 타입
					options : {
						opacity : 0.5,
						fillColor : '#FFE400',
						isStroke : true,
						strokeColor : '#FF0000',
						weight : '3',
						dashArray : '5,5'
					}
				}, {
					id : 'RING_LABEL_TEXT',
					type : L.MG.StyleCfg.STYLE_TYPE.TEXT, // 텍스트 타입
					options : {
						labelColumn : 'label',
						// text:'TEST TEXT',
						faceName : '궁서',
						size : '15',
						color : 'red',
						hAlign : 'left',
						vAlign : 'top',
						opacity : 0.7,
						isBox : true,
						boxColor : 'red',
						boxWidth : 1,
						background : 'yellow'
					}
				}, {
					id : 'ETE_CABLE_T',
					type : L.MG.StyleCfg.STYLE_TYPE.LINE, // 라인타입
					options : {
						opacity : 1.0,
						color : '#00ff00',
						weight : 4,
						dashArray : null
					}
				}, {
					id : 'ETE_CABLE_B',
					type : L.MG.StyleCfg.STYLE_TYPE.LINE, // 라인타입
					options : {
						opacity : 1.0,
						color : '#ff00ff',
						weight : 4,
						dashArray : null
					}
				}, {
					id : 'CORE_RING_CABLE_LINE',
					type : L.MG.StyleCfg.STYLE_TYPE.LINE, // 라인타입
					options : {
						opacity : 1.0,
						color : '#FF0000',
						weight : 5,
						dashArray : null
					}
				},{
					id : 'SKT-TEAMS',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/CESS_TEAMS_T.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},{
					id : 'SKT-IRCS',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/CESS_IRCS.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},{
					id : 'SKT-IAM',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/CESS_IAM.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},{
					id : 'SKB-TEAMS',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/CESS_TEAMS_B.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},{
					id : 'SKB-FOMS',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/CESS_FOMS.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},{
					id : 'SKB-FOMS-SUBSCRIBER',
					type : L.MG.StyleCfg.STYLE_TYPE.POINT, // 포인트타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-gis-web/resources/images/CESS_FOMS.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				} ];
		var colorSet = [ '#FF0000', '#0000FF', '#800000', '#008000', '#808000',
				'#000080', '#800080', '#008080', '#808080', '#C0C0C0',
				'#00FF00', '#FFFF00', '#000000', '#FF00FF', '#00FFFF',
				'#C0C0C0', '#FFFFFF', '#808080', '#C0DCC0', '#A6CAF0',
				'#FFFBF0', '#A0A0A4' ];
		for (var i = 0; i < colorSet.length; i++) {
			var line = {
				id : 'ETE_CABLE_LINE_SUM_' + i,
				type : L.MG.StyleCfg.STYLE_TYPE.LINE, // 라인타입
				options : {
					opacity : 1.0,
					color : colorSet[i],
					weight : 4,
					dashArray : '5,10'
				}
			}
			styles.push(line);
		}

		// 시스템에 사용할 스타일 설정
		L.MG.StyleCfg.setCustomStyles(styles);
	}