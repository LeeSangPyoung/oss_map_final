var _M = {
	ready: false,
	createFeature : function(param) {
		var des = {};

		if (param == null)
			return des;

		if (!param.style) {
			if(param.type.toLowerCase() == 'point' && param.layerNm  != null){
				param.style = _M.setFeatureStyle(param.layerNm);
			} else if (param.type.toLowerCase() == 'point' && param.style == null) {
				param.style = 'RING_JP_POINT';
			} else if (param.type.toLowerCase() == 'linestring' && param.style == null) {
				param.style = 'RING_CABLE_LINE';
			} else if (param.type.toLowerCase() == 'polygon' && param.style == null) {
				param.style = 'RING_CABLE_POLYGON';
			}
		}
		if(param.type == 'point'){
			param.type = 'Point';
		}
		if(param.type == 'linestring'){
			param.type = 'LineString';
		}
		if(param.type == 'polygon'){
			param.type = 'Polygon';
		}

		des = new Object();
		des.mgmtNo = param.mgmtNo;
		des.type = 'Feature';
		des.geometry = new Object();
		des.geometry.type = param.type;
		des.geometry.coordinates = typeof (param.coord) == 'string' ? JSON.parse(param.coord) : param.coord;
		des.style = [ { id : param.style } ];
		return des;
	},
	createFeatures : function(src, styleId) {
		var des = [];

		if (!$.isArray(src)) {
			return null;
		}
		for (var i = 0; i < src.length; i++) {
			if(styleId != null){
				src[i].style = styleId;
			}
			des.push(_M.createFeature(src[i]));
		}
		return des;
	},

	setStyleFlag : false,
	setCustomStyle : function() {
		if (_M.setStyleFlag) {
			return;
		}
		_M.setStyleFlag = true;
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		var styles = [
				{
					id : 'RING_JP_POINT',
					type : L.StyleConfig().STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : 'https://gisstg.tango.sktelecom.com/resource/images/tango_t'
								+ '/res/symbols/JP_16_JP001.png',
						iconSize : [ 20, 20 ],
						iconAnchor : [ 10, 10 ]
					}
				},{
					id : 'CESS_WORKER_T',
					type : L.StyleConfig().STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-web2/resources/images/icon_matic_5.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
				},{
					id : 'CESS_WORKER_B',
					type : L.StyleConfig().STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-web2/resources/images/icon_matic_4.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
				},{
					id : 'CESS_FLAG',
					type : L.StyleConfig().STYLE_TYPE.POINT, // 포인트 타입
					options : {
						markerType : 'icon',
						iconUrl : '/tango-transmission-web2/resources/images/Flag.png',
						iconSize : [ 36, 34 ],
						iconAnchor : [ 18, 34 ]
					}
				}, {
					id : 'WORKER_POINT',
					type : L.StyleConfig().STYLE_TYPE.POINT, // 포인트 타입
					options : {
		                markerType   : 'icon',
		                iconUrl: '../resources/images/ico_worker.png',
						iconSize: [20, 20],
						iconAnchor: [10, 10]
					 }
				 }, {
					id : 'RING_CABLE_LINE',
					type : L.StyleConfig().STYLE_TYPE.LINE, // 라인타입
					options : {
						opacity : 1.0,
						color : '#00ff00',
						weight : 5,
						dashArray : null
					}
				}, {
					id : 'RING_CABLE_POLYGON',
					type : L.StyleConfig().STYLE_TYPE.POLYGON, // 폴리곤 타입
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
					type : L.StyleConfig().STYLE_TYPE.TEXT, // 텍스트 타입
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
					type : L.StyleConfig().STYLE_TYPE.LINE, // 라인타입
					options : {
						opacity : 1.0,
						color : '#00ff00',
						weight : 4,
						dashArray : null
					}
				}, {
					id : 'ETE_CABLE_B',
					type : L.StyleConfig().STYLE_TYPE.LINE, // 라인타입
					options : {
						opacity : 1.0,
						color : '#ff00ff',
						weight : 4,
						dashArray : null
					}
				}
		];
		var colorSet = ['#FF0000','#0000FF','#800000','#008000','#808000','#000080','#800080','#008080','#808080','#C0C0C0','#00FF00','#FFFF00','#000000','#FF00FF','#00FFFF','#C0C0C0','#FFFFFF','#808080','#C0DCC0','#A6CAF0','#FFFBF0','#A0A0A4'];
		for (var i = 0; i < colorSet.length; i++) {
			var line = {
					id : 'ETE_CABLE_LINE_SUM_'+i,
					type : L.StyleConfig().STYLE_TYPE.LINE, // 라인타입
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
		L.StyleConfig().setCustomStyles(styles);
	},

	setFeatureStyle : function(layerNm){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		for(var key in L.StyleConfig()._customStyle.map){
			var style = L.StyleConfig()._customStyle.map[key];
			if(style.iconUrl != null && style.iconUrl.indexOf(layerNm) > -1){
				return key;
			}
		}

		for(var key in L.StyleConfig()._styleCfg.map){
			var style = L.StyleConfig()._styleCfg.map[key];

			if(style.iconUrl != null && style.iconUrl.indexOf(layerNm) > -1){
				L.StyleConfig()._customStyle.map[layerNm] = style;
				return layerNm;
			}
		}
	},
	getCoordnateForMgmtNo : function(param, callback) {
		if (param == null) {
			return;
		}
		Tango.ajax.init({
			url : 'tango-transmission-gis-biz/transmission/gis/common/getCoordnates',
			data : param
		}).post().done(
				function(response) {
					for ( var key in response) {
						if ($.isArray(response[key])) {
							for (var i = 0; i < response[key].length; i++) {
								response[key][i].coord = JSON.parse(response[key][i].coord);
							}
						}
					}
					if (callback != null && $.isFunction(callback)) {
						callback.apply(this, [ response ]);
					}
				});

	},
	moveToCoord : function(type, coordOrMgmtNo) {
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		if ($.isArray(coordOrMgmtNo)) {
			if(coordOrMgmtNo instanceof L.LatLng) {
				mgMap.panTo(coordOrMgmtNo);
			}else{
				mgMap.panTo(L.latLng(coordOrMgmtNo[1], coordOrMgmtNo[0]));
			}
		} else if (typeof (coordOrMgmtNo) == 'string') {
			var param = {};
			param.type = type;
			param[type+'List'] = [{mgmtNo:coordOrMgmtNo}];

			_M.getCoordnateForMgmtNo(param, function(response) {
				mgMap.panTo(_M.getCenter(type, response[type+'List'][0].coord));
			});
		}
	},
	getBounds : function(type, coord){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}

		var bounds = new window.L.LatLngBounds();

		if(type == 'point'){
			bounds.extend(new window.L.latLng(coord[1], coord[0]));
			return bounds;
		} else if(type == 'polygon'){
			coord = coord[0];
		}

		for(var i=0; i<coord.length; i++){
			bounds.extend(new L.latLng(coord[i][1], coord[i][0]));
		}
		return bounds
	},
	getCenter : function(type, coords) {
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}

		var i, halfDist, segDist, dist, p1, p2, ratio;

		var points = [];

		if(typeof(coords) == 'string'){
			coords = JSON.parse(coords);
		}
		if(!$.isArray(coords)){
			return;
		}
		if(type.toUpperCase() == 'POINT'){
			if(!(coords instanceof L.LatLng)){
				return new L.LatLng(coords[1], coords[0], coords[2]);
			}
			return coords;
		} else if(type.toUpperCase() == 'POLYGON'){
			coords = coords[0];
		}
		for (var i = 0; i < coords.length; i++) {
			if(!(coords[i] instanceof L.LatLng)){
				coords[i] = new L.LatLng(coords[i][1], coords[i][0], coords[i][2]);
			}

			points[i] = mgMap.latLngToLayerPoint(coords[i]);
		}

		len = points.length;

		if (!len) {
			return null;
		}

		for (i = 0, halfDist = 0; i < len - 1; i++) {
			halfDist += points[i].distanceTo(points[i + 1]) / 2;
		}
		if (halfDist === 0) {
			return mgMap.layerPointToLatLng(points[0]);
		}

		for (i = 0, dist = 0; i < len - 1; i++) {
			p1 = points[i];
			p2 = points[i + 1];
			segDist = p1.distanceTo(p2);
			dist += segDist;

			if (dist > halfDist) {
				ratio = (dist - halfDist) / segDist;
				return mgMap.layerPointToLatLng([p2.x - ratio * (p2.x - p1.x), p2.y - ratio * (p2.y - p1.y) ]);
			}
		}
	},
	getCenter2 : function(type, coords, map) {
		var i, halfDist, segDist, dist, p1, p2, ratio;

		var points = [];

		if(typeof(coords) == 'string'){
			coords = JSON.parse(coords);
		}
		if(!$.isArray(coords)){
			return;
		}
		if(type.toUpperCase() == 'POINT'){
			return new L.LatLng(coords[1], coords[0], coords[2]);
		} else if(type.toUpperCase() == 'POLYGON'){
			coords = coords[0];
		}
		for (var i = 0; i < coords.length; i++) {
			coords[i] = new L.LatLng(coords[i][1], coords[i][0], coords[i][2]);
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
				return map.layerPointToLatLng([p2.x - ratio * (p2.x - p1.x), p2.y - ratio * (p2.y - p1.y) ]);
			}
		}
	},
	selectFeature : function(type, mgmtNo, highlight, layerNm){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		type = type.toLowerCase();
		var param = {};
		param[type+'List'] = [{'mgmtNo':mgmtNo}];

		_M.getCoordnateForMgmtNo(param, function(response) {
			if(type == 'point'){
				mgMap.setView(_M.getCenter(type, $.merge([], response[type+'List'][0].coord)), 13);
			}else if(type == 'line'){
				mgMap.panTo(_M.getCenter(type, $.merge([], response[type+'List'][0].coord)));
			}else{
				var coord1 = [];
				coord1[0] = $.merge([], response[type+'List'][0].coord[0]);
				var coord2 = $.merge([], coord1)
				mgMap.panTo(_M.getCenter(type, coord2));
			}
			if(highlight){
				return _M.highlightFeature(type, response[type+'List'][0].coord, mgmtNo, response[type+'List'][0].layerNm);
			}
		});
	},
	selectFeatures : function(mgmtNos, highlight){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		_M.getCoordnateForMgmtNo(mgmtNos, function(response) {
			if(highlight){
				var type = 'point';
				var features = [];

				for(var i=0; i<3;i++){
					if(i==1){
						type = 'line';
					}else if(i==2){
						type = 'polygon';
					}

					var fcltList = response[type+'List'];

					if(fcltList != null){
						for(var j=0; j<fcltList.length; j++){
							var hf = {};
							hf.coord = fcltList[j].coord;
							hf.mgmtNo = fcltList[j].mgmtNo;
							hf.style = type.toLocaleUpperCase();

							if(type == 'point'){
								hf.type  = 'Point';
							}else if(type == 'line'){
								hf.type  = 'LineString';
							}else if(type == 'polygon'){
								hf.type  = 'Polygon';
							}
							var featureGeoJson = _M.createFeature(hf);
							var layer = L.GeoJSON.geometryToLayer(featureGeoJson);
							if (layer == null) {
								continue;
							}
							layer.feature = L.GeoJSON.asFeature(featureGeoJson);
							layer.feature.getLayerId = function() { return ''; }

							features.push(layer);
						}
					}
				}
				mgMap.setSelectFeatures(features);
				mgMap.fitBounds(mgMap.getSelectLayer().getBounds());
			}
		});
	},
	selectFeatureByCoord : function(type, coord, mgmtNo){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		mgMap.panTo(_M.getCenter(type, $.merge([], coord)));
		return _M.highlightFeature(type, coord, mgmtNo);
	},
	clearSelectLayer : function(){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		mgMap.getSelectLayer().clearLayers();
	},
	clearCustomLayer : function(layerNm){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}
		if($gisCommon.util.isEmpty(layerNm)){
			return;
		}
		var layer = typeof(layerNm) == "string" ? mgMap.getCustomLayerByName(layerNm) : layerNm;
		if($gisCommon.util.isNotEmpty(layer)){
			layer.clearLayers();
		}
	},
	highlightFeature : function(type, coord, mgmtNo, layerNm){
		if(!_M.ready){
			if(!_M.init()){
				return;
			}
		}

		_M.clearSelectLayer();

		// 레이어 강제로 on
		if(layerNm != null && layerNm !=''){
			var layers  = window.mgMap.getLayersByAlias(layerNm);
			for(var i=0; i<layers.length; i++){
				layers[i].setVisible(true);
			}
		}

		var hf = {};
		hf.coord = coord;
		hf.mgmtNo = mgmtNo;
		hf.style = type.toLocaleUpperCase();

		var fitFlag = true;
		if(type == 'point'){
			hf.type  = 'Point';
			fitFlag = false;
		}else if(type == 'line'){
			hf.type  = 'LineString';
		}else if(type == 'polygon'){
			hf.type  = 'Polygon';
		}

		var featureGeoJson = _M.createFeature(hf);
		var layer = L.GeoJSON.geometryToLayer(featureGeoJson);
		if (layer == null){
			return;
		}
		layer.feature = L.GeoJSON.asFeature(featureGeoJson);
		layer.feature.getLayerId = function() { return ''; }

		mgMap.setSelectFeatures([layer]);

		if(fitFlag){
			mgMap.fitBounds(mgMap.getSelectLayer().getBounds());
		}
		return mgMap.getSelectLayer();
	},
	setMarkerToCoord : function(layerByNm, coord, isPan){
		if(!this.ready){
			if(!this.init()){
				return;
			}
		}
		if(typeof(coord) == 'string'){
			coord = JSON.parse(coord);
		}
		if(!$.isArray(coord)){
			return;
		}
		if(isPan){
			_M.moveToCoord("point", coord);
		}
		var layer = mgMap.addCustomLayerByName(layerByNm);
		layer.addLayer(L.marker(new L.LatLng(coord[1], coord[0])));
		return layer;
	},
	setMarkerToMgmtNo : function(layerByNm, mgmtNo){
		var param = {pointList:[{mgmtNo:mgmtNo}]};

		_M.getCoordnateForMgmtNo(param, function(respone){
			_M.setMarkerToCoord(layerByNm, respone.pointList[0].coord);
		});
	},
	init : function(){

		try {
				if (window.L == null) {
					if(opener == null){
						if(parent == null){
							return false;
						}else{
							if(parent.opener == null){
								return false;
							}else{
								window.L = parent.opener.L;
							}
						}
					}else{
						if(opener.L != null){
							window.L = opener.L;
						} else if(opener.opener != null && opener.opener.L != null){
							window.L = opener.opener.L;
						} else{
							return false;
						}
					}

					if (window.L == null){
						return false;
					}
				}
				if (window.mgMap == null) {
					if(opener == null){
						if(parent == null){
							return false;
						}else{
							if(parent.opener == null){
								return false;
							}else{
								window.mgMap = parent.opener.mgMap;
							}
						}
					}else{
						if(opener.mgMap != null){
							window.mgMap = opener.mgMap;
						} else if(opener.opener != null && opener.opener.mgMap != null){
							window.mgMap = opener.opener.mgMap;
						} else{
							return false;
						}
					}
					if (window.mgMap == null){
						return false;
					}
				}
		} catch(err) {
			return false;
		}
		_M.ready = true;
		return true;
	},
	/**
	 * 관리번호로 시설물 분류 판단 (공통사용)
	 */
	getLayerMgmtCode : function (mgmtNo) {
		// 1) 접속점
		if(mgmtNo.indexOf("JP") > -1){
		    return "JP";
		}
		// 2) 국사/국소
		else if(   mgmtNo.indexOf("TP") > -1
		        || mgmtNo.indexOf("RT") > -1
		        || mgmtNo.indexOf("BS") > -1
		        || mgmtNo.indexOf("BR") > -1
		        || mgmtNo.indexOf("RF") > -1
		        || mgmtNo.indexOf("XO") > -1
		        || mgmtNo.indexOf("TP") > -1
		        || mgmtNo.indexOf("ON") > -1
		        || mgmtNo.indexOf("XP") > -1
		        || mgmtNo.indexOf("SO") > -1
		        || mgmtNo.indexOf("SB") > -1
		        || mgmtNo.indexOf("BT") > -1)
		 {
		    return "TP";
		 }
		 // 3) 건물
		 else if(mgmtNo.indexOf('BD') > -1){
			 return "BD";
		 }else if(mgmtNo.indexOf('MH') > -1){
			 return "MH";
		 }

		 return "";
    }
};
$(function(){

	const styleconfig = new L.StyleConfig();
	_M.setCustomStyle();
	_M.init();
});
