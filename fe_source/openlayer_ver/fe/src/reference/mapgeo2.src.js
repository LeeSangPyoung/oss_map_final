var L = L || {};
L.olMapInstance = null;  // 전역적으로 관리할 맵 인스턴스
L.geoMapInstance = null; // 관리객체
L.mapHistory = L.mapHistory || {
    stack: [],
    idx: -1,
    maxSize: 10
};

L.sharedStyleConfig = {
	styleConfigs: {},

	setStyle(layerName, config){
		this.styleConfigs[layerName] = config;
	},

	getStyle(layerName){
		return this.styleConfigs[layerName] || null;
	},

	resetStyle(layerName){
		delete this.styleConfigs[layerName];
	},

	resetAll(){
		this.styleConfigs = {};
	}
};

(function(global) {
    'use strict';

    function GeoMap() {
        if (L.geoMapInstance) {
            //console.warn("이미 생성된 GeoMap 인스턴스을 반환합니다.");
            return L.geoMapInstance;
        }

        this.geoUtil = new L.GeoUtil();
        this.StyleCfg = new L.StyleConfig();

        this.extent = [254440, 1232737, 1892840, 2871137];
        this.centerPointOL = [127.062289345605, 37.5087805938127];
        this.resolutions = [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];

        proj4.defs(
            'EPSG:5179',
            '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
        );
        ol.proj.proj4.register(proj4);

        this.dawulLayer = new ol.layer.Tile({
        	zIndex:0,
            source: new ol.source.XYZ({
                projection: 'EPSG:5179',
                tileGrid: new ol.tilegrid.TileGrid({
                    extent: this.extent,
                    origin: [this.extent[0], this.extent[3]],
                    resolutions: this.resolutions,
                    tileSize: [400, 400],
                }),
                tileSize: [400, 400],
                tileUrlFunction: this.getTileUrl.bind(this),
            }),
        });

        this._customlayers = {};  // 모든 인스턴스에서 사용할 수 있도록 초기화
        L.geoMapInstance = this; // 전역 변수에 저장


        this._vectorInfoLayers = [];
        this._vectorLayers = [];
        this._rasterLayers = [];
        this._tileLayers = [];
        this.prevZoomlevel = '';
        this._layerParamMap = {};
        this._layerReloadFnMap = {};

    }

    GeoMap.prototype = {

		createMap : async function(options) {
	        if (L.olMapInstance && L.olMapInstance instanceof ol.Map) {
	            console.warn("이미 생성된 ol.Map을 반환합니다.");
	            return L.olMapInstance;
	        }

	        var projection = ol.proj.get('EPSG:5179');
	        if (projection) {
	            projection.setExtent(this.extent);
	        }

	        var centerPoint = options && options.mapOptions && options.mapOptions.center
	            ? options.mapOptions.center
	            : this.centerPointOL;

	        this.map = new ol.Map({
	            target: options.target,
	            view: new ol.View({
	                center: proj4('EPSG:4326', 'EPSG:5179', centerPoint),
	                zoom: options.mapOptions ? options.mapOptions.zoom : 12,
	                maxZoom: 19,
	                minZoom: 1,
	                projection: projection || undefined,
	                minResolution: 0.0078125,
	                maxResolution: 4096,
	                zoomFactor: 2,
	                constrainResolution:true

	            }),
	            layers: [this.dawulLayer],
	            interactions: [
	                new ol.interaction.MouseWheelZoom(), // 마우스 휠 줌
	                new ol.interaction.DragPan(), // 드래그 이동
	                new ol.interaction.KeyboardPan(), // 방향키 이동
	                new ol.interaction.KeyboardZoom(), // 키보드 줌 (+, -)
	            ],
	            controls: []
	        });

	        //컨트롤 추가
	        this.map.addControl(new ol.control.Zoom());
	        this.map.addControl(CustomZoomSliderControl());

	        // 생성된 ol.map을 전역변수에 별도 저장
	        L.olMapInstance = this.map;

	        this.contextMenuManager = new ContextMenuManager(this.map);


	        this.prevZoomlevel = Math.floor(this.map.getView().getZoom());

	        //이벤트 연결
	        this.map.getView().on('change:resolution', () => {

	        	const currentZoom = Math.floor(this.map.getView().getZoom() || 0);

	        	if(currentZoom !== this.prevZoomlevel){
	        		console.log('prevZoomlevel : ' + this.prevZoomlevel + ' currentZoom : ' + currentZoom);
	        		this._updateZoomLevel.call(this, currentZoom);
	        		this.prevZoomlevel = currentZoom;
	        	}
        	});

	        const selectLayer = new SelectLayer(this.map);
	        const selector = new FeatureSelector(this.map);
	        selector.setSelector('rect');

	        // 맵 이동 시 히스토리 저장
	        this.attachHistoryTracking();


	        //레이어목록 및 스타일 조회
	        try{
	        	var aa = {
	        			url:'https://gisstg.tango.sktelecom.com/tango/servlets/layerInfo/getAll',
	        			data:{id: 1, loaderParams: {name: "TANGO-T"}}
	        	};
	        	var bb = {
	        			url:'https://gisstg.tango.sktelecom.com/tango/servlets/layerInfo/getStyles',
	        			data:{output: "rule"}
	        	};

	        	//gis스타일
	        	const styleData = await this.postJSON(bb);

	        	//스타일변경시 사용하는 uuid생성
	        	let styleuuid = await this.getGeoWfs('ne:test_styleuuid');
	        	L.StyleConfig().setStyleuuid(this._formatStyleuuidData(styleuuid));

	        	//구성스타일
//	        	let testStyle = await this.getGeoWfs('ne:test_style');
//	           	const aaa = this._formatStyleData(testStyle);

//	           	styleData.push(...aaa);

	        	this.StyleCfg.create(styleData);

/*	        	//구성 레이어 추가
	        	let testData = await this.getGeoWfs('ne:test_layer');
	        	const data = this._formatData(testData);

	        	var bullayer = null;
	        	_.each(data, function (layerInfo, index) {
                    order = index+1;
                    bullayer =
                        this._createBulTileLayer(order, layerInfo)
                     || this._createBulVectorLayer(order, layerInfo)

                    if ( bullayer ) {
                        this.map.addLayer(bullayer);
                    }
                }, this);
*/
	        	//gis 레이어 추가
	        	const layerData = await this.postJSON(aa);
	        	var layer = null, order = 0;
	        	_.each(layerData, function (layerInfo, index) {
                    order = index+1;
                    layer =
                        this._createTileLayer(order, layerInfo)
                     || this._createRasterGroupLayer(order, layerInfo)
                     || this._createVectorLayer(order, layerInfo)
                     || this._createVectorInfoLayer(order, layerInfo);

                    if ( layer ) {
                        this.map.addLayer(layer);
                    }

                }, this);

	        }catch(error){
	        	console.log('error : ' + error);
	        }

	        window.PopupManager = new PopupManager(this.map);

	        return this.map;
	    },

	    _createTileLayer: function (index, layerInfo) {

            if (!(layerInfo.type === 'tile' ||
                 (layerInfo.type === 'raster_group' && (layerInfo.view==='single' || layerInfo.view==='grid')))) {
                return null;
            }

            var geoUtil = L.geoUtilInstance;
            var map = L.olMapInstance; // 전역 맵 인스턴스 가져오기
            var layerName = layerInfo.name.replace('_RASTERGROUP','').replace('_RASTER','');

            const styles = this.StyleCfg.getStylesByLayerName(layerName);
            let styleProps ={};
            let iconFileName = '';
            let soureStyle = '';
            let soureLayer = '';

            if(Array.isArray(styles) && styles.length > 0 ){
            	const style = styles[0];

            	switch (style.type) {
				case 'POINT':
					//soureStyle = 'gis_point_new2';
					soureStyle = 'gis_point_only';
					soureLayer = 'test_geoserver_point_new';
					const iconUrl = style.iconUrl || '';
					if(iconUrl){
		            	const match = iconUrl.match(/([^\/]+)(?=\.png)/);
		            	iconFileName = match ? match[1] : '';
		            }

					break;
				case 'LINE':
					//soureStyle = 'gis_line_new2';
					soureStyle = 'gis_line_only';
					soureLayer = 'test_geoserver_line_new';
					break;
				case 'POLYGON':
					//soureStyle = 'gis_polygon_new2';
					soureStyle = 'gis_polygon_only	';
					soureLayer = 'test_geoserver_polygon_new';
					break;

				default:
					break;
				}
            }
            const dashArray= styleProps.dashArray || '';
            const color= styleProps.color || '';
            const outlineColor= styleProps.outlineColor || '';
            //const envString = buildEnvParamFromStyle(styleProps);

            this.extent = [254440, 1232737, 1892840, 2871137];
            this.resolutions = [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];

            var customTileGrid = new ol.tilegrid.TileGrid({
                extent: this.extent,
                origin: [this.extent[0], this.extent[3]],
                resolutions: this.resolutions,
                tileSize: [400, 400],
            });

	    	const sym_id = layerInfo.alias.replace('_RASTERGROUP','').replace('_RASTER','').toLowerCase();
	    	const uuid = L.StyleConfig().getStyleuuid();
		    let viewparams = `layernm:${layerName};sym_id:${sym_id};uuid:${uuid};iconnm:${iconFileName}`;

            var wmsLayer = new CustomTileLayer({
            	source : new ol.source.TileWMS({
				            	url: geoUtil.getGeoserverUrl() + "/ne/wms",
				            	tileGrid : customTileGrid,
				            	params: {
				                    SERVICE: "WMS",
				                    VERSION: "1.1.0",
				                    REQUEST: "GetMap",
				                    LAYERS: "ne:" + soureLayer,
				                    SRS: "EPSG:5179",
				                    STYLES: soureStyle,
				                    FORMAT: "image/png",
				                    TILED: true,
				                    //ENV : envString,
				                },
				                serverType: 'geoserver'
				            }),
            	zIndex: index,
            });

			wmsLayer.getSource().setTileLoadFunction((imageTile, src) => {
			    	var tileCoord = imageTile.getTileCoord();
			    	if(!tileCoord){
			    		console.log('타일정보를 가져올 수 없음');
			    		return;
			    	}

			    	var z = tileCoord[0],  //ZOOM LEVEL
			    	    x = tileCoord[1],  //X 좌표
			    	    y = tileCoord[2];  //Y 좌표

//			    	let vpArray = viewparams.split(';').filter(param => !param.startsWith('showlabel:')).filter(param => !param.startsWith('iconnm:'));
//			    	let labekChk = wmsLayer.get('labelChk') ?? false;
//			    	vpArray.push(`showlabel:${labekChk}`);
//
//			    	let iconUrl = wmsLayer.get('iconUrl') ?? '';
//			    	if(iconUrl){
//			    		vpArray.push(`iconUrl:${iconUrl}`);
//			    	}
//
//			    	viewparams = vpArray.join(';');

			    	const vpMap = Object.fromEntries(
			    			viewparams.split(';')
			    			.map(param => param.split(':'))
			    			.filter(([k,v]) => k && v)
			    	);

			    	vpMap.showlabel = wmsLayer.get('labelChk') ?? false;
			    	const iconUrl = wmsLayer.get('iconUrl') ?? '';
			    	if(iconUrl){
			    		vpMap.iconnm = iconUrl;
			    	}
			    	viewparams = Object.entries(vpMap).map(([k,v]) => `${k}:${v}`).join(';');

			    	var bbox = customTileGrid.getTileCoordExtent(tileCoord);
			    	var modifiedSrc = src + "&viewparams=" + viewparams + ";minx:" + bbox[0] + ";miny:" + bbox[1] + ";maxx:" + bbox[2] + ";maxy:" + bbox[3] + ";zoomlv:" + z + "&buffer=128";

			    	imageTile.getImage().src = modifiedSrc;
	    	});


            wmsLayer.setProperties({
            	...layerInfo,
            	minZoom : (layerInfo.minZoom !== undefined) ? layerInfo.minZoom - 1 : undefined,
    			maxZoom : layerInfo.maxZoom
            });

            if(layerInfo.type === 'raster_group'){
            	this._rasterLayers.push(wmsLayer)
            } else {
            	this._tileLayers.push(wmsLayer);
            }

            return wmsLayer;
        },

        _createRasterGroupLayer: function (index, layerInfo) {
            var layer = null;
            if ( (layerInfo.type==='raster_group' && layerInfo.view==='single') || layerInfo.view==='grid') {
                layer = this._createTileLayer(index, layerInfo);
                _rasterLayers.push(layer);
            }
            return layer;
        },

        _createVectorLayer: function (index, layerInfo) {

            if ( layerInfo.type.indexOf('vector') < 0 ) return null;

            var geoUtil = L.geoUtilInstance;
            var layerName = layerInfo.name;
            var vectorTileLayer = new CustomVectorTileLayer({
                source: new ol.source.VectorTile({
                format: new ol.format.MVT(),
                tileUrlFunction:(function (layerName) {
                	return function(tileCoord) {
                    var z = tileCoord[0],
                        x = tileCoord[1],
                        y = tileCoord[2];
                    var timestamp = new Date().getTime();
                    // xyzToEPSG5179BoundingBox 함수는 타일 좌표를 EPSG:5179 bbox로 변환하는 함수여야 함
                    var bbox = xyzToEPSG5179BoundingBox(x, y, z);
                    // geoServer URL은 this.geoUtil.getGeoserverUrl (또는 전역 env.geoServer) 로 설정
                    return geoUtil.getGeoserverUrl() + "/ne/wms?service=WMS&version=1.1.0&request=GetMap" +
                        "&layers=ne:test_geoserver" +
                        "&bbox=" + bbox +
                        "&viewparams=layernm:" + layerName + ";minx:" + bbox.split(',')[0] + ";miny:" + bbox.split(',')[1] + ";maxx:" + bbox.split(',')[2] + ";maxy:" + bbox.split(',')[3] +
                        "&width=256&height=256&srs=EPSG%3A5179&styles=&format=application%2Fvnd.mapbox-vector-tile";
                	};
                })(layerName)
                }),
                zIndex: index,
                style : getStyleFromConfig,
                renderMode:'hybrid',
                declutter:false
            });

            vectorTileLayer.setProperties({
            	...layerInfo,
            	minZoom : (layerInfo.minZoom !== undefined) ? layerInfo.minZoom - 1 : undefined,
    			maxZoom : layerInfo.maxZoom
            });

            this._vectorLayers.push(vectorTileLayer);

            return vectorTileLayer;
        },
        _createVectorInfoLayer: function (index, layerInfo) {

            if ( layerInfo.type.indexOf('info')<0 ) return null;
            this._vectorInfoLayers.push(layer);
        },

        _createBulVectorLayer: function (index, layerInfo) {

            if ( layerInfo.type.indexOf('vector') < 0 ) return null;

            const geoUtil = L.geoUtilInstance;
            const layerName = layerInfo.name;
            const paramStr = JSON.parse(layerInfo.paramStr);
            const mgmtvalue = paramStr.mgmtvalue || 'null';
            const mtsotypalue = paramStr.mtsotypalue || 'null';
            const sqlid = layerInfo.sqlid;
            const uuid = L.StyleConfig().getStyleuuid();


            var vectorTileLayer = new ol.layer.VectorTile({
                source: new ol.source.VectorTile({
                format: new ol.format.MVT(),
                tileUrlFunction:(function (layerName) {
                	return function(tileCoord) {
            		const mtsostatvalue = vectorTileLayer.get('mtsostatvalue') || 'null';
                    const z = tileCoord[0],
                        x = tileCoord[1],
                        y = tileCoord[2];
                    const timestamp = new Date().getTime();
                    // xyzToEPSG5179BoundingBox 함수는 타일 좌표를 EPSG:5179 bbox로 변환하는 함수여야 함
                    const bbox = xyzToEPSG5179BoundingBox(x, y, z);
                    // geoServer URL은 this.geoUtil.getGeoserverUrl (또는 전역 env.geoServer) 로 설정
                    return geoUtil.getGeoserverUrl() + "/ne/wms?service=WMS&version=1.1.0&request=GetMap" +
								                    "&layers=ne:test_geoserver_sql" +
								                    "&bbox=" + bbox +
								                    //mgmtvalue: SKT 첫번째
								                    //mtsostatvalue: 01 일곱번째
								                    //mtsotypalue: 2 여섯번째
								                    "&viewparams=layernm:" + layerName  + ";params:" + mgmtvalue + "|" + bbox.split(',')[0] + "|" + bbox.split(',')[1] + "|" + bbox.split(',')[2] + "|" + bbox.split(',')[3] +
								                    "|" + mtsotypalue + "|" + mtsostatvalue + "|" + "null" + ";sqlid:" + sqlid + ";layerid:" + layerName +
								                    "&width=256&height=256&srs=EPSG%3A5179&styles=&format=application%2Fvnd.mapbox-vector-tile" +"&t=" + timestamp;
                	};
                })(layerName)
                }),
                zIndex: index,
                style : getStyleFromConfig,
            });

            vectorTileLayer.setProperties({
            	...layerInfo,
            });

            vectorTileLayer.set('mtsostatvalue','null',true);

            this._vectorLayers.push(vectorTileLayer);

            return vectorTileLayer;
        },

        _createBulTileLayer: function (index, layerInfo) {

            if (!(layerInfo.type === 'tile' ||
                 (layerInfo.type === 'raster_group' && (layerInfo.view==='single' || layerInfo.view==='grid')))) {
                return null;
            }
            var geoUtil = L.geoUtilInstance;
            var map = L.olMapInstance; // 전역 맵 인스턴스 가져오기
            const paramStr = JSON.parse(layerInfo.paramStr);
            const mgmtvalue = paramStr.mgmtvalue || 'null';
            const mtsotypalue = paramStr.mtsotypalue || 'null';
            const sqlid = layerInfo.sqlid;

            var layerName = layerInfo.name.replace('_RASTERGROUP','').replace('_RASTER','');
            const styles = this.StyleCfg.getStylesByLayerName(layerName);

            let styleProps ={};
            let iconFileName = '';
            if(Array.isArray(styles) && styles.length > 0 ){
            	const style = styles[0];

            	switch (style.type) {
				case 'POINT':
					const iconUrl = style.iconUrl || '';
					if(iconUrl){
		            	const match = iconUrl.match(/([^\/]+)(?=\.png)/);
		            	iconFileName = match ? match[1] : '';
		            }

					styleProps = {
						layerNm: layerName,
						type : 'POINT',
						iconUrl,
						iconFileName,
						iconSize: style.iconSize ? style.iconSize.join(',') : '16,16',
						iconAnchor: style.iconAnchor ? style.iconAnchor.join(',') : '8,8',
						opacity: style.opacity?.toString() ?? '100'
					};

					break;
				case 'LINE':
					styleProps = {
						layerNm:  layerName,
						type : 'LINE',
						color: (style.color || '000000').replace('#',''),
						weight: style.weight || 2,
						opacity: style.opacity ?? 100,
						lineCap: style.lineCap || 'round',
						lineJoin: style.lineJoin || 'round',
						dashArray: style.dashArray && style.dashArray !== 'null' ? style.dashArray : '',
						outlineColor: (style.outline?.color || '').replace('#',''),
						outlineWeight: style.outline?.weight || ''
				};
					break;

				default:
					break;
				}
            }
            const dashArray= styleProps.dashArray || '';
            const color= styleProps.color || '';
            const outlineColor= styleProps.outlineColor || '';
            const envString = buildEnvParamFromStyle(styleProps);

            this.extent = [254440, 1232737, 1892840, 2871137];
            this.resolutions = [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];

            var customTileGrid = new ol.tilegrid.TileGrid({
                extent: this.extent,
                origin: [this.extent[0], this.extent[3]],
                resolutions: this.resolutions,
                tileSize: [400,400],
            });

            var initialViewParams = `layernm:${layerName};iconnm:${iconFileName};dashstyle:${dashArray};color:${color};outlineColor:${outlineColor}`;
            const wmsLayer = new CustomTileLayer({
            	source : new ol.source.TileWMS({
				            	url: geoUtil.getGeoserverUrl() + "/ne/wms",
				            	tileGrid : customTileGrid,
				            	params: {
				                    SERVICE: "WMS",
				                    VERSION: "1.1.0",
				                    REQUEST: "GetMap",
				                    LAYERS: "ne:test_geoserver_sql",
				                    SRS: "EPSG:5179",
				                    STYLES: "test_total_style",
				                    FORMAT: "image/png",
				                    TILED: true,
				                    ENV : envString,
				                },
				                serverType: 'geoserver',
				            }),
	            zIndex: 10,
	            initialViewParams: initialViewParams,
	        });

            wmsLayer.getSource().setTileLoadFunction((imageTile, src) => {
		    	var tileCoord = imageTile.getTileCoord();
		    	if(!tileCoord){
		    		console.log('타일정보를 가져올 수 없음');
		    		return;
		    	}

		    	const mtsostatvalue = wmsLayer.get('mtsostatvalue') || 'null';

		    	var z = tileCoord[0],  //ZOOM LEVEL
		    	    x = tileCoord[1],  //X 좌표
		    	    y = tileCoord[2];  //Y 좌표

		    	var bbox = customTileGrid.getTileCoordExtent(tileCoord);
		    	var viewparams = wmsLayer.getViewParamsString();
		    	var modifiedSrc = '';

		    	if(viewparams){
		    		modifiedSrc = src + "&viewparams=" + viewparams  + ";params:" + mgmtvalue + "|" + bbox[0] + "|" + bbox[1] + "|" + bbox[2] + "|" + bbox[3] +
                	"|" + mtsotypalue + "|" + mtsostatvalue + "|" + "null" + ";sqlid:" + sqlid + ";layerid:" + layerName +
                	";zoomlv:" + tileCoord[0] + "&buffer=128";
		    	} else {
		    		modifiedSrc = src + "&viewparams=" + wmsLayer._initialViewParams + ";params:" + mgmtvalue + "|" + bbox[0] + "|" + bbox[1] + "|" + bbox[2] + "|" + bbox[3] +
                	"|" + mtsotypalue + "|" + mtsostatvalue + "|" + "null" + ";sqlid:" + sqlid + ";layerid:" + layerName + ";zoomlv:" + tileCoord[0] + "&buffer=128";
		    	}

		    	imageTile.getImage().src = modifiedSrc;
            });

            wmsLayer.setProperties({
            	...layerInfo,
            });

            wmsLayer.set('mtsostatvalue','null',true);

            this._tileLayers.push(wmsLayer);

            return wmsLayer;
        },

        getVectorLayers: function () {
            return this._vectorLayers;
        },

	    postJSON : async function(options) {

	    	var url = options.url;
	    	var data = options.data;

	    	try{
	    		let response = await fetch(url,{
	    			method:'POST',
	    			headers:{'Content-Type':'text/plain; charset=utf-8'
	    			},
	    			body: JSON.stringify(data)
	    		});

	    		let result = await response.text();
	    		let json = result;

	    		if(typeof result === 'string') {
	                try {
	                    json = JSON.parse(result);
	                    if ( json.NG ) json=[];
	                }
	                catch (e) { json=[]; console.log(result, data); }
	            }
	    		return json;
	    	} catch (error) {
	    		console.error('error');
	    	}
	    },

	    _formatData(inputData){
	    	return inputData.features.map(item => {
	    		const prop = item.properties;
	    		return {
	    			alias: prop.alias || '',
	    			editable: prop.editable || false,
	    			geomColumn: prop.geom_column || '',
	    			geometryTyp: prop.geometry_type || '',
	    			keyColumns: prop.key_columns || [],
	    			maxZoom: prop.max_zoom || 19,
	    			minZoom: prop.min_zoom || 1,
	    			name: prop.name || '',
	    			overlap: prop.overlap || false,
	    			selectable: prop.selectable || false,
	    			tableName: prop.table_name || '',
	    			type: prop.layer_type || 'vector',
	    			visible: prop.visible || false,
	    			paramStr: prop.filter_param || '',
	    			sqlid: prop.sqlid || '',
	    		};
	    	});
	    },

	    _formatStyleData(inputData){
	    	return inputData.features.map(item => {
	    		const prop = item.properties;
	    		return JSON.parse(prop.rules);
	    	});
	    },

	    _formatStyleuuidData(inputData){
	    	return inputData.features.map(item => {
	    		const prop = item.properties;
	    		return prop.styleuuid;
	    	});
	    },

	    getGeoWfs: async function (layerName) {
            let baseUrl = `https://90.90.227.174:8443/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application/json`;

            try{
            	const response = await fetch(baseUrl);
            	const data = await response.json();
            	return data;
            } catch(error) {
            	console.log(error)
            }
        },

        getGeoBboxWfsByLayeNm: async function (layerName, bbox = null) {

            let baseUrl = `https://90.90.227.174:8443/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature
            &typeName=test_geoserver_query_new&outputFormat=application/json&viewparams=layernm:${layerName};minx:${bbox.split(',')[0]};miny:${bbox.split(',')[1]};maxx:${bbox.split(',')[2]};maxy:${bbox.split(',')[3]}`;

            if(bbox){
            	baseUrl += `&bbox=${bbox},EPSG:5179`;
            }

            try{
            	const response = await fetch(baseUrl);
            	const data = await response.json();
            	return data;
            } catch(error) {
            	console.log(error)
            }
        },

        getTileUrl: function(coords) {
            var x = coords[1], y = coords[2], z = coords[0];
            var tileX = 'C' + x.toString(16).padStart(8, '0');
            var tileY = 'R' + y.toString(16).padStart(8, '0');
            var zoomLevel = 'L' + (z - 1).toString().padStart(2, '0');
            var cacheBuster = Date.now();
            return `https://gis.tango.sktelecom.com/resource/tiles/dawulmap/${zoomLevel}/${tileY}/${tileX}.png?cache=${cacheBuster}`;
        },

         // 전역에서 맵 가져오기
        getMap: function() {
            return L.olMapInstance;  // 전역 변수에서 반환
        },

        // 전역에 맵 저장
        setMap: function(map) {
            if (map instanceof ol.Map) {  // ol.Map 객체인지 확인
                L.olMapInstance = map;
            } else {
                console.error("setMap 오류: 올바른 ol.Map 객체가 아닙니다.", map);
            }
        },

        // 이동 히스토리 저장
        attachHistoryTracking: function () {
            if (!L.olMapInstance) return;

            L.olMapInstance.on('moveend', () => {
                this.saveHistory();
            });
        },

        saveHistory: function () {

        	if(this.historyLock) return;
        	this.historyLock = true;

        	setTimeout(() => {

            var view = this.map.getView();
            var center = proj4('EPSG:5179', 'EPSG:4326', view.getCenter());
            var zoom = view.getZoom();

            if (L.mapHistory.idx !== -1 &&
                L.mapHistory.stack[L.mapHistory.idx].zoom === zoom &&
                JSON.stringify(L.mapHistory.stack[L.mapHistory.idx].center) === JSON.stringify(center)) {
            	this.historyLock = false;
                return;
            }

            // 기존 히스토리 자르기 (뒤로 가기 했을 경우 새로운 기록 추가)
            if (L.mapHistory.idx !== L.mapHistory.stack.length - 1) {
                L.mapHistory.stack = L.mapHistory.stack.slice(0, L.mapHistory.idx + 1);
            }

            // 히스토리 최대 개수 유지
            if (L.mapHistory.stack.length >= L.mapHistory.maxSize) {
                L.mapHistory.stack.shift();
                L.mapHistory.idx--;
            }

            // 새로운 히스토리 추가
            L.mapHistory.stack.push({ center, zoom });
            L.mapHistory.idx++;

            this.historyLock = false;
        	}, 100);
        },

        // 이전 위치로 이동
        goBack: function () {
            if (L.mapHistory.idx > 0) {
                L.mapHistory.idx--;
                var item = L.mapHistory.stack[L.mapHistory.idx];
                this.moveTo(item.center, item.zoom);
            }
        },

        // 다음 위치로 이동
        goForward: function () {
            if (L.mapHistory.idx < L.mapHistory.stack.length - 1) {
                L.mapHistory.idx++;
                var item = L.mapHistory.stack[L.mapHistory.idx];
                this.moveTo(item.center, item.zoom);
            }
        },

        // 지정한 위치로 이동
        moveTo: function (center, zoom) {
            var view = this.map.getView();
            view.setCenter(proj4('EPSG:4326', 'EPSG:5179', center));
            view.setZoom(zoom);
        },

        // onHistoryAction 메서드 추가
        onHistoryAction: function (action) {
            if (action === 'back') {
                this.goBack();
            } else if (action === 'forward') {
                this.goForward();
            }
        },

        // 맵 중심 좌표 반환
        getCenter: function () {
            if (L.olMapInstance) {
                var coordinate = L.olMapInstance.getView().getCenter();
                if (coordinate) {
                    var latLng = proj4('EPSG:5179', 'EPSG:4326', coordinate);
                    return { lat: latLng[1], lng: latLng[0] };
                }
            }
            return null;
        },

        // 현재 줌, 최소 줌, 최대 줌 반환
        getZoom: function (type) {
            if (L.olMapInstance) {
                var view = L.olMapInstance.getView();
                if (type === 'max') return view.getMaxZoom();
                if (type === 'min') return view.getMinZoom();
                return Math.floor(view.getZoom() || 0);
            }
        },

        // 맵을 특정 좌표로 이동
        panTo: function (coords, zoom = 13) {
            if (L.olMapInstance) {
            	L.olMapInstance.getView().animate({ zoom }, { center: proj4('EPSG:4326', 'EPSG:5179', coords) });
            }
        },

        panBy: function(offsetX = 0, offsetY = 0, duration = 0){
        	const view = window.mgMap.map.getView();
        	const center = view.getCenter();
        	if(!center) return;

        	const currentPixel = window.mgMap.map.getPixelFromCoordinate(center);

        	const newPixel = [
        			currentPixel[0] + offsetX,
        			currentPixel[1] + offsetY
        	];

        	const newCenter = window.mgMap.map.getCoordinateFromPixel(newPixel);

        	console.log('center' , center);
        	console.log('currentPixel' , currentPixel);
        	console.log('newPixel' , newPixel);
        	console.log('newCenter' , newCenter);
        	console.log('duration' , duration);

        	if(duration === 0){
        		view.setCenter(newCenter);
        	} else {
        		view.animate({
        			center: newCenter,
        			duration : 1
        		});
        	}
        },

        // 특정 영역을 맞추기
        fitBounds: function (bounds) {

        	if(!L.olMapInstance) return;

        	//배열로
        	if(Array.isArray(bounds) && bounds.length === 4){
        		const extent = bounds;
        		L.olMapInstance.getView().fit(extent, {
        			size: L.olMapInstance.getSize(),
                    duration: 0,
                    padding: [20, 10, 10, 20],
        		});
        		return;
        	}

            if (L.olMapInstance) {
                var minCoordinate = proj4('EPSG:4326', 'EPSG:5179', bounds.min);
                var maxCoordinate = proj4('EPSG:4326', 'EPSG:5179', bounds.max);
                var view = L.olMapInstance.getView();
                var extent = ol.extent.boundingExtent([minCoordinate, maxCoordinate]);
                view.fit(extent, {
                    size: L.olMapInstance.getSize(),
                    duration: 0,
                    padding: [20, 10, 10, 20],
                });
            }
        },

        // 줌 인 (+1 증가)
        zoomIn: function (increment = 1) {
            if (L.olMapInstance) {
                var view = L.olMapInstance.getView();
                view.setZoom(Math.min(view.getZoom() + increment, view.getMaxZoom()));
            }
        },

        // 줌 아웃 (-1 감소)
        zoomOut: function (increment = 1) {
            if (L.olMapInstance) {
                var view = L.olMapInstance.getView();
                view.setZoom(Math.max(view.getZoom() - increment, view.getMinZoom()));
            }
        },

        // 특정 줌 설정
        setZoom: function (targetZoom) {
            if (L.olMapInstance) {
                var view = L.olMapInstance.getView();
                if (targetZoom >= view.getMinZoom() && targetZoom <= view.getMaxZoom()) {
                    view.animate({ zoom: targetZoom });
                }
            }
        },

        //projection : 'EPSG:4326'
        getBounds: function (map, projection) {
            let extent = map.getView().calculateExtent(map.getSize());

            if(projection){
            	extent = ol.proj.transformExtent(
            			extent,
            			map.getView().getProjection(),
            			projection
            	);
            }

            const bottomLeft = ol.extent.getBottomLeft(extent);
            const topRight = ol.extent.getTopRight(extent);

            return [bottomLeft,topRight];
        },

        getLayerById: function (id) {
        	const layer = [
        		...this._vectorInfoLayers,
            	...this._vectorLayers,
            	...this._rasterLayers,
            	...this._tileLayers
            	].find(layer => layer.getProperties().name === id);

        	// 없으면 커스텀에서 찾기
        	return layer || this._customlayers[id];
        },

        getCustomLayerByName: function (name) {
            if (!this._customlayers) {
                console.warn("getCustomLayerByName 오류: 커스텀 레이어 저장소가 존재하지 않습니다.");
                return null;
            }
            return this._customlayers[name] || null;
        },

        removeCustomLayerByName: function (name) {
            if (!L.olMapInstance) {
                console.warn("removeCustomLayerByName 오류: 맵이 존재하지 않습니다.");
                return;
            }

            var layer = this.getCustomLayerByName(name);
            if (layer) {
                L.olMapInstance.removeLayer(layer);
                delete this._customlayers[name];
                console.log(`레이어 '${name}' 제거 완료`);
            } else {
                console.warn(`레이어 '${name}'를 찾을 수 없습니다.`);
            }
        },

        addCustomLayerByName: function (name) {
            if (!L.olMapInstance) {
                console.warn("addCustomLayerByName 오류: 맵이 존재하지 않습니다.");
                return null;
            }

            var vectorLayer = new CustomVectorLayer({
                source: new ol.source.Vector(),
                //zIndex:100
            });

            vectorLayer.setStyle(null);

            vectorLayer.set("name", name);

            this._customlayers[name] = vectorLayer;

            vectorLayer.addData = function(rawData){
            	const source = this.getSource();

            	//더미 피처 제거
                source.getFeatures().forEach(f => {
                	if(f.get('isDummy')){
                		source.removeFeature(f);
                	}
                });

                let feautreAdded = false;

            	rawData.features.forEach(f => {

            		let geom;
            		const coords = f.geometry.coordinates;

            		switch (f.geometry.type.toUpperCase()) {
					case 'POINT':
						geom = new ol.geom.Point(ol.proj.transform(f.geometry.coordinates,'EPSG:4326','EPSG:5179'));
						break;
					case 'LINESTRING':
						geom = new ol.geom.LineString(coords.map(c => ol.proj.transform(c,'EPSG:4326','EPSG:5179')));
						break;
					case 'MULTILINESTRING':
						geom = new ol.geom.MultiLineString(coords.map(line => line.map(c => ol.proj.transform(c,'EPSG:4326','EPSG:5179'))));
						break;
					case 'POLYGON':
						geom = new ol.geom.Polygon(coords.map(ring => ring.map(c => ol.proj.transform(c,'EPSG:4326','EPSG:5179'))));
						break;
					case 'MULTIPOLYGON':
						geom = new ol.geom.MultiPolygon(coords.map(ring => ring.map(c => ol.proj.transform(c,'EPSG:4326','EPSG:5179'))));
						break;
					default:
						console.warn('geometry type : ' + f.geometry.type);
						return;
					}

            		const feature = new ol.Feature({
            			geometry: geom,
            			type: f.geometry.type
            		});

            		Object.entries(f).forEach(([key,value]) => {
            			if(key !== 'geometry' && key !== 'style' && key !== 'type'){
            				feature.set(key,value);
            			}
            		});

            		if(f.style){
            			feature.set('rawStyle',f.style);
            		}

            		if(Array.isArray(this._cfgStyle) && this._cfgStyle.length > 0){
            			const resolution = L.GeoMap().map.getView().getResolution();
            			const style = this.currentStyleFunction(feature, resolution);
            			feature.setStyle(style);
            		}else if(f.style){
            		    let featureStyle = addCustomLayerStyle(feature, L.StyleConfig().getStyle(f.style[0].id));
            			feature.setStyle(featureStyle);
            		}else{
            			const resolution = L.GeoMap().map.getView().getResolution();
            			const style = this.defaultStyleFunction(feature, resolution);
            			feature.setStyle(style);
            		}

            		source.addFeature(feature);
            		feautreAdded = true;
            	});

            	if(!feautreAdded && source.getFeatures().length === 0){
            		const dummy = new ol.Feature({
            			geometry: new ol.geom.Point([NaN,NaN])
            		});
            		dummy.set('isDummy', true);
            		source.addFeature(dummy);
            	}
            	//데이터가 들어갔는지 확인용
            	//SnapCoordinator.getInstance()?.markReady(name);

            	if(!L.olMapInstance.getLayers().getArray().includes(this)){
            		L.olMapInstance.addLayer(vectorLayer);
            	}
            };
            return vectorLayer;
        },


        getCurrentBBox: function () {
        	return L.olMapInstance.getView().calculateExtent(L.olMapInstance.getSize());
        },

        _updateZoomLevel: function(zoomLevel, searchMtsostatArray){

        	const vectorVisible = zoomLevel >= 13;

        	this._vectorLayers.forEach(layer => {
        		const shouldBeVisible = layer.get('shouldBeVisible') || false;
    			const currentlyVisible = layer.getVisible();
    			const finalVisible = shouldBeVisible && vectorVisible;

    			if(finalVisible !== currentlyVisible){
    				if(finalVisible){
    					const layerName = layer.get('name');
    					const sharedStyle = L.sharedStyleConfig.getStyle(layerName);
    					const currentUserStyle = layer.getUserStyleConfig();

    					let mtsostatvalue = layer.get('mtsostatvalue') ?? 'null';

    					if(Array.isArray(searchMtsostatArray)){
    						mtsostatvalue = searchMtsostatArray.length > 0 ? searchMtsostatArray.join('~') : 'null';
    					}

    					layer.set('mtsostatvalue', mtsostatvalue, true);

    					if(!deepEqual(sharedStyle,currentUserStyle)){
    						layer.setUserStyleConfig(sharedStyle);
    					}
    				}

    				layer.setVisible(finalVisible);

    			}
        	});

        	[...this._rasterLayers, ...this._tileLayers].forEach(layer => {
        		const shouldBeVisible = layer.get('shouldBeVisible') || false;
        		const currentlyVisible = layer.getVisible();
    			const finalVisible = shouldBeVisible && !vectorVisible;

    			// 가시성 변경 여부 확인
				if(finalVisible !== currentlyVisible){
					if(finalVisible){
						const layerName = layer.get('name').replace('_RASTERGROUP','').replace('_RASTER','');
						const sharedStyle = L.sharedStyleConfig.getStyle(layerName);
						const currentUserStyle = layer.getUserStyleConfig();

						let mtsostatvalue = layer.get('mtsostatvalue') ?? 'null';

						if(Array.isArray(searchMtsostatArray)){
							mtsostatvalue = searchMtsostatArray.length > 0 ? searchMtsostatArray.join('~') : 'null';
						}

						layer.set('mtsostatvalue', mtsostatvalue, true);

						if(!deepEqual(sharedStyle,currentUserStyle)){
							layer.setUserStyleConfig(sharedStyle);
						}
					}

					layer.setVisible(finalVisible);

				}
				//라벨 상태는 독립적으로 체크 후 반영
				const source = layer.getSource();
				const currentParams = source.getParams();
				const labelChk = layer.get('labelChk') || false;

				let envArray = currentParams.ENV ? currentParams.ENV.split(';') : [];
				envArray = envArray.filter(param => !param.startsWith("showlabel:"))
				envArray.push("showlabel:" + labelChk);
				const updateEnv = envArray.join(';');

				layer.getSource().updateParams({
					ENV : updateEnv,
					_t : new Date().getTime()
				});
				this.map.render();
        	});
        },

        refresh: function(layerNames){
        	const isRefreshAll = !Array.isArray(layerNames) || layerNames.length === 0;

        	L.olMapInstance.getLayers().forEach(layer => {
        		const layerName = layer.get('name');
        		const source = layer.getSource?.();

        		if(!layerName) return;

        		//source없으면 skip
        		if(!source) return;

        		//지도에 표시중이 않으면 skip
        		if(!layer.getVisible()) return;

        		//특정레이어만 대상으로 할 경우 필터링
        		if(!isRefreshAll && !layerNames.includes(layerName)) return;

        		//이미지
        		if(source instanceof CustomTileLayer || source instanceof ol.source.TileWMS || source instanceof ol.source.ImageWMS){
        			//console.log('이미지');
        			const currentParams = source.getParams();
        			source.updateParams({
        				...currentParams,
        				_t: Date.now().toString()
        			});

        		//백터
        		} else if(source instanceof ol.source.Vector){
        			//console.log('백터');

        			const reloadFn = L.GeoMap()._layerReloadFnMap?.[layerName];
        			if(typeof reloadFn === 'function'){
        				source.clear();
        				reloadFn();
        			} else {
        				source.refresh();
        			}
        		//백터타일
        		} else if(source instanceof ol.source.VectorTile){
        			//console.log('백터타일');
        			/*source.clear();

        			const tileUriFunction = source.getTileUrlFunction();
        			source.setTileUrlFunction((tileCoord, pixelRatio, projection) => {
        				const originalUrl = tileUriFunction(tileCoord, pixelRatio, projection);
        				const cacheBuster = `t=${Date.now()}`;
        				return originalUrl.includes('?') ? `${originalUrl}&${cacheBuster}` : `${originalUrl}?${cacheBuster}`;
        			});*/
        			const map = L.GeoMap().map;
            		const oldLayer = layer;
            		const oldSource = oldLayer.getSource();
            		const oldTileUrlFunction = oldSource.getTileUrlFunction();
            		const cacheBuster = `_t=${Date.now()}`;
            		const layerNm = layer.getProperties().name;

            		const newSource = new ol.source.VectorTile({
            			format: new ol.format.MVT(),
            			tileGrid: oldSource.getTileGrid(),
            			projection: oldSource.getProjection(),
            			tileUrlFunction: (tileCoord) =>{
            				let url = oldTileUrlFunction(tileCoord);
            				url = url.replace(/([&?])_t=\d+(&?)/, (match, p1, p2) => {
            					if(p1 === '?' && p2) return '?';
            					if(p1 === '&' && p2) return '&';
            					return '';
            				});
            				return url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
            			}
            		});

            		const newLayer = new CustomVectorTileLayer({
            			source: newSource,
            			style: oldLayer.getStyle(),
            			zIndex: oldLayer.getZIndex(),
            			visible: oldLayer.getVisible(),
            			properties: oldLayer.getProperties()
            		});

            		const index = L.GeoMap()._vectorLayers.findIndex(i => i.getProperties().name === layerNm);
            		if(index !== -1) L.GeoMap()._vectorLayers[index] = newLayer;

            		const layerCollection = map.getLayers();
            		layerCollection.remove(oldLayer);
            		layerCollection.push(newLayer);
        		}
        	});

        },

        setView: function([lon, lat], zoom=13){
        	if(!L.GeoMap()){
        		console.warn('Map이 존재하지 않습니다.');
        		return;
        	}

        	const center = ol.proj.fromLonLat([lon, lat], 'EPSG:5179');

        	L.GeoMap().map.getView().setCenter(center);
        	L.GeoMap().map.getView().setZoom(zoom);
        },

        getSidoByCode : function (admCode,options){
        	if(typeof admCode === 'object' && !options){
        		options = admCode;
        		admCode = undefined;
        	}

        	options = options || [];

        	var params = _.extend({},
        		admCode ? {admCode:admCode} :{} ,
				{
        			geom: options?.geometry ?? false,
        			bounds: options?.bounds ?? false
				}
        	);

        	const deferred = $.Deferred();
    		Util.jsonAjax({url: '/transmisson/tes/engineeringmap/gislist/getSidoByCode', method:'GET', data : params, async:true}).done(
    			function(result) {
    				const removeKeys = ['geom','bounds','simpl'];
    				const filtered = result.getSidoByCode.map(item => {
    					const newItem = {...item};
    					removeKeys.forEach(key => delete newItem[key]);
    					return newItem;
    				});
    				deferred.resolve(filtered);
    			});
    		return deferred.promise();
        },

        getSggByCode : function (admCode,options){
        	if(typeof admCode === 'object' && !options){
        		options = admCode;
        		admCode = undefined;
        	}

        	options = options || [];

        	var params = _.extend({},
        		admCode ? {admCode:admCode} :{} ,
				{
        			geom: options?.geometry ?? false,
        			bounds: options?.bounds ?? false
				}
        	);

        	const deferred = $.Deferred();
    		Util.jsonAjax({url: '/transmisson/tes/engineeringmap/gislist/getSggByCode', method:'GET', data : params, async:true}).done(
    			function(result) {
    				const removeKeys = ['geom','bounds','simpl'];
    				const filtered = result.getSggByCode.map(item => {
    					const newItem = {...item};
    					removeKeys.forEach(key => delete newItem[key]);
    					return newItem;
    				});
    				deferred.resolve(filtered);
    			});
    		return deferred.promise();
        },

    }

    function getCheckedLayerAliasByGroup(groupName){
    	return $('#div_tree_layer .Checkbox[data-checktype="layer"]:checked')
    	.filter((_, el) => $(el).data('group')?.includes(groupName))
    	.map((_, el) => $(el).data('layrnm'))
    	.get();
    }

    function deepEqual(a,b){
    	if(a===b) return true;
    	if (typeof a!== 'object' || typeof b !== 'object' || a === null || b === null) return false;

    	const keysA	 = Object.keys(a);
    	const keysB	 = Object.keys(b);
    	if(keysA.length !== keysB.length) return false;

    	for(let key of keysA){
    		if(!keysB.includes(key) || !deepEqual(a[key],b[key])){
    			return false;
    		}
    	}
    	return true;
    }


//커스텀용 스타일
    function addCustomLayerStyle(feature, styleObj){

    	const type = styleObj.type || feature.get('type').toUpperCase();
    	const properties = feature.getProperties();

    	//console.log('addCustomLayerStyle : ' + type);
    	switch(type){
    	//{"size": "12", "color": "#000000", "isBox": "false", "format": "{0}/{1}", "mAlign": {"x": 10, "y": 10}, "opacity": "1", "faceName": "맑은고딕", "labelColumn": "CSTR_PLCE_SK_MGMT_NO,CSTR_NM", "verticalAlign": "top", "horizontalAlign": "middle"}
		case 'TEXT':
			if(styleObj.isBox){
				const text =  formatString(
						styleObj.format,
						(styleObj.labelColumn ? styleObj.labelColumn.split(',') : [])
						.slice(0, (styleObj.format.match(/{(\d+)}/g) || []).length)
						.map(col => properties.properties[col.toLowerCase()] || '')
				        ).replace(/\/+$/,'');
				const padding = 6;
				const fontSize = 14;
				const font = `bold ${styleObj.size}px ${styleObj.faceName}`;

				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				//텍스트 크기 측정
				ctx.font = font;
				const textWidth = ctx.measureText(text).width;
				const boxWidth = textWidth + padding * 2;
				const boxHeight = fontSize + padding * 2;

				//캔버스 크기
				canvas.width = boxWidth;
				canvas.height = boxHeight;

				// 박스 배경
				ctx.fillStyle = 'rgba(255,255,255,0.8)';
				ctx.fillRect(0,0,boxWidth,boxHeight);

				// 박스 테두리
				ctx.strokeStyle = '#00570e';
				ctx.lineWidth = 1.5;
				ctx.strokeRect(0,0,boxWidth,boxHeight);

				//텍스트
				ctx.fillStyle = styleObj.color || 'black';
				ctx.font = font;
				ctx.textAlign = 'center';
				ctx.textBaseline = styleObj.vAlign || 'middle';
				ctx.fillText(text,boxWidth / 2, boxHeight / 2);

				const canvasStyle = new ol.style.Style({
					image : new ol.style.Icon({
						img:canvas,
						imgSize: [canvas.width, canvas.height],
						anchor:[0.5,-0.4],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction'
					})
				});
				return canvasStyle;
			} else {
				const textStyle =  new ol.style.Style({
					geometry:function(feature){
						const coordinates = feature.getGeometry().getFlatCoordinates();
						const pixel = window.mgMap.map.getPixelFromCoordinate(coordinates);
						const adjustedPixel = [pixel[0], pixel[1] + 15];
						const adjustedCoordinate = window.mgMap.map.getCoordinateFromPixel(adjustedPixel);
						return new ol.geom.Point(adjustedCoordinate);
					},
					text : new ol.style.Text({
						text: formatString(
								styleObj.format,
								(styleObj.labelColumn ? styleObj.labelColumn.split(',') : [])
								.slice(0, (styleObj.format.match(/{(\d+)}/g) || []).length)
								.map(col => properties.properties[col.toLowerCase()] || '')
						).replace(/\/+$/,''),
					    font: `bold ${styleObj.size}px ${styleObj.faceName}`,
						fill: new ol.style.Fill({color : styleObj.color}),
			    		textAlign: styleObj.hAlign || 'center',
			    		textBaseline: styleObj.vAlign || 'middle',
					})
				});
				return textStyle;
			}
		case 'POINT':
			if(!styleObj.iconUrl) return null;

			const realSize = styleObj.realSize || styleObj.iconSize;
			const displaySize =  styleObj.iconSize || [25,25];
			const scale = displaySize[0] / realSize[0];

			const displayAnchor = styleObj.iconAnchor || [displaySize[0] / 2, displaySize[1]];
			const anchor = [
				displayAnchor[0] / scale,
				displayAnchor[1] / scale
			];

			const style =  new ol.style.Style({
				image: new ol.style.Icon({
					src: styleObj.iconUrl,
					size: realSize,
					scale,
					anchor,
					anchorXUnits: 'pixels',
					anchorYUnits: 'pixels',
				})
			});
			return style;

		case 'LINE':

			const styles = [];

			if(styleObj.outline){
				styles.push(new ol.style.Style({
    				stroke: new ol.style.Stroke({
    					color: styleObj.outline.color || '#000000',
    					width: styleObj.outline.weight || 2,
    					lineCap: styleObj.outline.lineCap || 'round',
    					lineJoin: styleObj.outline.lineJoin || 'round',
    					lineDash: (styleObj.outline.dashArray && /^[\d\s]+$/.test(styleObj.outline.dashArray))
    					? styleObj.outline.dashArray.trim().split(/\s+/).map(Number)
    					: undefined
    				})
				}));
			}

			styles.push(new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: styleObj.color || '#000000',
					width: styleObj.weight || 2,
					lineCap: styleObj.lineCap || 'round',
					lineJoin: styleObj.lineJoin || 'round',
					lineDash: (styleObj.dashArray && /^[\d\s]+$/.test(styleObj.dashArray))
					? styleObj.dashArray.trim().split(/\s+/).map(Number)
					: undefined
				})
			}));

			return styles;

		case 'POLYGON':
			return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: styleObj.color || '#000000',
					width: styleObj.weight || 2,
					lineCap: styleObj.lineCap || 'round',
					lineJoin: styleObj.lineJoin || 'round',
					lineDash: (styleObj.dashArray && /^[\d\s]+$/.test(styleObj.dashArray))
					? styleObj.dashArray.trim().split(/\s+/).map(Number)
				    : undefined
				}),
				fill: new ol.style.Fill({
					color: styleObj.fillColor ? styleObj.fillColor || '#00ff00' : 'rgba(0,0,0,0)'
				})
			})
		default:
			return null;
    	}
    }

    function loadIconSize(url){
    	return new Promise((resolve) => {
    		const img = new Image();
    		img.onload = () => resolve([img.width, img.height]);
    		img.src = url;
    	});
    }

    function formatString(template, values){

    	const matches = template.match(/{(\d+)}/g);
    	const maxIndex = matches ? Math.max(...matches.map(m => parseInt(m.replace(/[{}]/g,'')))) : -1;

    	return template.replace(/{(\d+)}/g,(match, index)=> {
    		index = parseInt(index);
    		return index <= maxIndex && typeof values[index] !== 'undefined' ? values[index] : '';
    	});
    }

    function buildEnvParamFromStyle(styleProps){
    	const env = [];

    	if(styleProps.color){
    		env.push(`color:${styleProps.color}`);
    	}
    	if(styleProps.weight){
    		env.push(`weight:${styleProps.weight}`);
    	}
    	if(styleProps.lineCap){
    		env.push(`lineCap:${styleProps.lineCap.toLowerCase()}`);
    	}
    	if(styleProps.lineJoin){
    		env.push(`lineJoin:${styleProps.lineJoin.toLowerCase()}`);
    	}
    	if(styleProps.outlineColor){
    		env.push(`outlineColor:${styleProps.outlineColor}`);
    	}
    	if(styleProps.outlineWeight){
    		env.push(`outlineWeight:${styleProps.outlineWeight}`);
    	}
    	//wms에서는 단일
    	if(styleProps.iconSize){
    		env.push(`iconSize:${styleProps.iconSize.split(',')[0]}`);
    	}
    	if(styleProps.iconAnchor){
    		env.push(`iconAnchor:${styleProps.iconAnchor}`);
    	}
    	if(styleProps.opacity){
    		env.push(`opacity:${styleProps.opacity}`);
    	}

    	return env.join(';');
    }

    //스타일 변경이 없을시 스타일함수
    function getStyleFromConfig(feature){

    	var map = L.olMapInstance; // 전역 맵 인스턴스 가져오기
    	const properties = feature.getProperties();
    	const layerId = properties.layrid;

    	let styles = L.StyleConfig().getStylesByLayerName(layerId);
    	if(!styles || styles.length === 0) {
    		styles = [L.StyleConfig().getStyle(layerId)];
    		if(!styles || styles.length === 0) return null;
    	}

    	const styleObj = styles[0];
    	const type = styleObj.type;

    	const rtnStyles = [];

    	switch(type){
    		case 'TEXT':
    			/*return new ol.style.Style({
    				geometry:function(feature){
    					const coordinates = feature.getGeometry().getFlatCoordinates();
    					const pixel = map.getPixelFromCoordinate(coordinates);
    					const adjustedPixel = [pixel[0], pixel[1] + 15];
    					const adjustedCoordinate = map.getCoordinateFromPixel(adjustedPixel);
    					return new ol.geom.Point(adjustedCoordinate);
    				},
    				text : new ol.style.Text({
    					text: formatString(
    							styleObj.format,
    							(styleObj.labelColumn ? styleObj.labelColumn.split(',') : [])
    							.slice(0, (styleObj.format.match(/{(\d+)}/g) || []).length)
    							.map(col => properties[col.toLowerCase()] || '')
    					).replace(/\/+$/,''),
    				    font: `bold ${styleObj.size}px ${styleObj.faceName}`,
    				    fill: new ol.style.Fill({color : styleObj.color}),
    				    stroke: new ol.style.Stroke({color : '#ffffff', width: 2}),
    				    textAlign: styleObj.hAlign || 'center',
    				    textBaseline: styleObj.vAlign || 'middle'
    				})
    			});*/
    			if(styleObj.isBox){
    				const text =  formatString(
    						styleObj.format,
    						(styleObj.labelColumn ? styleObj.labelColumn.split(',') : [])
    						.slice(0, (styleObj.format.match(/{(\d+)}/g) || []).length)
    						.map(col => properties[col.toLowerCase()] || '')
    				        ).replace(/\/+$/,'');
    				const padding = 6;
    				const fontSize = 14;
    				const font = `bold ${styleObj.size}px ${styleObj.faceName}`;

    				const canvas = document.createElement('canvas');
    				const ctx = canvas.getContext('2d');

    				//텍스트 크기 측정
    				ctx.font = font;
    				const textWidth = ctx.measureText(text).width;
    				const boxWidth = textWidth + padding * 2;
    				const boxHeight = fontSize + padding * 2;

    				//캔버스 크기
    				canvas.width = boxWidth;
    				canvas.height = boxHeight;

    				// 박스 배경
    				ctx.fillStyle = 'rgba(255,255,255,0.8)';
    				ctx.fillRect(0,0,boxWidth,boxHeight);

    				// 박스 테두리
    				ctx.strokeStyle = '#00570e';
    				ctx.lineWidth = 1.5;
    				ctx.strokeRect(0,0,boxWidth,boxHeight);

    				//텍스트
    				ctx.fillStyle = styleObj.color || 'black';
    				ctx.font = font;
    				ctx.textAlign = 'center';
    				ctx.textBaseline = styleObj.vAlign || 'middle';
    				ctx.fillText(text,boxWidth / 2, boxHeight / 2);

    				const canvasStyle = new ol.style.Style({
    					image : new ol.style.Icon({
    						img:canvas,
    						imgSize: [canvas.width, canvas.height],
    						anchor:[0.5,-0.4],
    						anchorXUnits: 'fraction',
    						anchorYUnits: 'fraction'
    					})
    				});
    				return canvasStyle;
    			} else {
    				const textStyle =  new ol.style.Style({
    					geometry:function(feature){
    						const coordinates = feature.getGeometry().getFlatCoordinates();
    						const pixel = window.mgMap.map.getPixelFromCoordinate(coordinates);
    						const adjustedPixel = [pixel[0], pixel[1] + 15];
    						const adjustedCoordinate = window.mgMap.map.getCoordinateFromPixel(adjustedPixel);
    						return new ol.geom.Point(adjustedCoordinate);
    					},
    					text : new ol.style.Text({
    						text: formatString(
    								styleObj.format,
    								(styleObj.labelColumn ? styleObj.labelColumn.split(',') : [])
    								.slice(0, (styleObj.format.match(/{(\d+)}/g) || []).length)
    								.map(col => properties[col.toLowerCase()] || '')
    						).replace(/\/+$/,''),
    					    font: `bold ${styleObj.size}px ${styleObj.faceName}`,
    						fill: new ol.style.Fill({color : styleObj.color}),
    			    		textAlign: styleObj.hAlign || 'center',
    			    		textBaseline: styleObj.vAlign || 'middle',
    					})
    				});
    				return textStyle;
    			}
    		case 'POINT':
    			return new ol.style.Style({
    				image: new ol.style.Icon({
    					src: styleObj.iconUrl,
    					scale: 1,
    					size: styleObj.iconSize,
    					anchor: [styleObj.iconAnchor[0] / styleObj.iconSize[0], styleObj.iconAnchor[1] / styleObj.iconSize[1]],
    				})
    			});
    		case 'LINE':
    			if(styleObj.outline){
    				rtnStyles.push(new ol.style.Style({
        				stroke: new ol.style.Stroke({
        					color: styleObj.outline.color || '#000000',
        					width: styleObj.outline.weight || 2,
        					lineCap: styleObj.outline.lineCap || 'round',
        					lineJoin: styleObj.outline.lineJoin || 'round',
        					lineDash: (styleObj.outline.dashArray && /^[\d\s]+$/.test(styleObj.outline.dashArray))
        					? styleObj.outline.dashArray.trim().split(/\s+/).map(Number)
        					: undefined
        				})
    				}));
    			}

    			rtnStyles.push(new ol.style.Style({
    				stroke: new ol.style.Stroke({
    					color: styleObj.color || '#000000',
    					width: styleObj.weight || 2,
    					lineCap: styleObj.lineCap || 'round',
    					lineJoin: styleObj.lineJoin || 'round',
    					lineDash: (styleObj.dashArray && /^[\d\s]+$/.test(styleObj.dashArray))
    					? styleObj.dashArray.trim().split(/\s+/).map(Number)
    					: undefined
    				})
    			}));

    			return rtnStyles;

    		case 'POLYGON':
    			if(styleObj.outline){
    				rtnStyles.push(new ol.style.Style({
    					stroke: new ol.style.Stroke({
    						color: styleObj.strokeColor || null,
    						width: styleObj.strokeWidth || null,
    						lineCap: styleObj.lineCap || 'round',
    						lineJoin: styleObj.lineJoin || 'round',
    						lineDash: (styleObj.dashArray && /^[\d\s]+$/.test(styleObj.dashArray))
        					? styleObj.dashArray.trim().split(/\s+/).map(Number)
        					: undefined
    					}),
    				}));
    			}

    			if(styleObj.fill !== false){
    				rtnStyles.push(new ol.style.Style({
    					fill: new ol.style.Fill({
    						color: styleObj.fillColor || null,
    					})
    				}));
    			}

				return rtnStyles;

    		default:
    			return null;
    	}
    }





    // GeoServer 관련 유틸리티 클래스 추가
    function GeoUtil(defaultGeoserverUrl) {
        this.defaultGeoserverUrl = defaultGeoserverUrl || "https://90.90.227.174:8443/geoserver";
    }

    function xyzToEPSG5179BoundingBox(x, y, z) {
        // 타일 크기와 해상도 계산
        const tileSize = 256;
        const originShift = 20037508.34;

        // 줌 레벨에 따른 해상도 계산
        const resolution = (2 * originShift) / (tileSize * Math.pow(2, z));

        // x, y 좌표에 따른 BBOX 계산
        const minx = x * tileSize * resolution - originShift;
        const maxx = (x + 1) * tileSize * resolution - originShift;
        const miny = originShift - (y + 1) * tileSize * resolution;
        const maxy = originShift - y * tileSize * resolution;

        return `${minx},${miny},${maxx},${maxy}`;
    }

    GeoUtil.prototype = {

		getGeoserverUrl : function(customUrl){
	    	return  customUrl || this.defaultGeoserverUrl
	    },

        // WFS 요청하여 GeoJSON 가져오기
        getGeoJson: function (layerName, bbox, callback) {
            var bboxString = Array.isArray(bbox) ? bbox.join(",") : bbox;
            var geoUtil = L.geoUtilInstance;

            var url = `${geoUtil.getGeoserverUrl()}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&bbox=${bboxString}&outputFormat=application/json`;

            fetch(url)
                .then(response => response.json())
                .then(data => callback(null, data))
                .catch(error => callback(error, null));
        },


        addImgLayer: function (layerNm, layerId) {

            var map = L.olMapInstance; // 전역 맵 인스턴스 가져오기
            var bbox = L.geoMapInstance.getCurrentBBox();
            var zoomlv = L.geoMapInstance.getZoom();
            var geoUtil = L.geoUtilInstance;
            var ImageLayer = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: `${geoUtil.getGeoserverUrl()}/ne/wms`,
                    params: {
                    	LAYERS: "ne:test_geoserver",
                    	STYLES: "test_style",
                    	FORMAT: "image/png",
                    	TRANSPARENT:true,
                        VERSION: "1.1.1",
                        CRS: "EPSG:5179",
                        VIEWPARAMS: "layernm:" + layerNm + ";minx:" + bbox[0] + ";miny:" + bbox[1] + ";maxx:" + bbox[2] + ";maxy:" + bbox[3] + ";zoomlv:" + zoomlv,
                        ENV:"layerNm:" + layerNm,
                    },
                    serverType: 'geoserver',
                }),
                visible:true,
            });

            if (layerId) {
            	ImageLayer.set("id", layerId); // 커스텀 ID 설정
            }

            map.addLayer(ImageLayer);
            return ImageLayer;
        },

        addWmsLayer: function (layerName, layerId) {

            var map = L.olMapInstance; // 전역 맵 인스턴스 가져오기
            var geoUtil = L.geoUtilInstance;

            var wmsLayer = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: `${geoUtil.getGeoserverUrl()}/ne/wms`,
                    params: {
                        SERVICE: "WMS",
                        VERSION: "1.1.0",
                        REQUEST: "GetMap",
                        LAYERS: layerName, // 요청할 WMS 레이어
                        SRS: "EPSG:5179", // 좌표계 설정
                        STYLES: "", // 스타일 없음
                        FORMAT: "image/png" // 이미지 포맷
                    },
                    serverType: 'geoserver',
                })
            });

            if (layerId) {
                wmsLayer.set("id", layerId); // 커스텀 ID 설정
            }

            map.addLayer(wmsLayer);
            return wmsLayer;
        },

        addTileWmsLayer: function (layerNm, layerId) {

        	var geoUtil = L.geoUtilInstance;
            var map = L.olMapInstance; // 전역 맵 인스턴스 가져오기

            this.extent = [254440, 1232737, 1892840, 2871137];
            this.resolutions = [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];

            var customTileGrid = new ol.tilegrid.TileGrid({
                extent: this.extent,
                origin: [this.extent[0], this.extent[3]],
                resolutions: this.resolutions,
                tileSize: [400, 400],
            });

            var wmsSource = new ol.source.TileWMS({
            	url: geoUtil.getGeoserverUrl() + "/ne/wms",
            	tileGrid : customTileGrid,
            	params: {
                    SERVICE: "WMS",
                    VERSION: "1.1.0",
                    REQUEST: "GetMap",
                    LAYERS: "ne:test_geoserver",
                    SRS: "EPSG:5179",
                    STYLES: "test_style",
                    FORMAT: "image/png",
                    TILED: true,
                },
                serverType: 'geoserver',
                tileLoadFunction: function(imageTile, src) {

                	var tileCoord = imageTile.getTileCoord();
                	if(!tileCoord){
                		console.log('타일정보를 가져올 수 없음');
                		return;
                	}

                	var z = tileCoord[0],  //ZOOM LEVEL
                	    x = tileCoord[1],  //X 좌표
                	    y = tileCoord[2];  //Y 좌표

                	var bbox = customTileGrid.getTileCoordExtent(tileCoord);

                	var modifiedSrc = src + "&viewparams=layernm:" + layerNm + ";minx:" + bbox[0] + ";miny:" + bbox[1] + ";maxx:" + bbox[2] + ";maxy:" + bbox[3] + ";zoomlv:" + z + "&env=layerNm:" + layerNm + "&buffer=128";
                	imageTile.getImage().src = modifiedSrc;

                },
            });

            var wmsLayer = new ol.layer.Tile({
            	source : wmsSource
            });

            if (layerId) {
                wmsLayer.set("id", layerId); // 커스텀 ID 설정
            }

            map.addLayer(wmsLayer);
            return wmsLayer;
        },

        addImgTestLayer : function(layerData){

            var geoUtil = L.geoUtilInstance;
            var map = L.olMapInstance; // 전역 맵 인스턴스 가져오기
            let layerName = 'test';
            let sqlid = 'test1';
            let layerid = 'STYLE_CFG_T_SMTSO_POINT';

            const styles = [L.StyleConfig().getStyle(layerid)];
            let styleProps ={};
            let iconFileName = '';
            if(Array.isArray(styles) && styles.length > 0 ){
            	const style = styles[0];

            	switch (style.type) {
				case 'POINT':
					const iconUrl = style.iconUrl || '';
					if(iconUrl){
		            	const match = iconUrl.match(/([^\/]+)(?=\.png)/);
		            	iconFileName = match ? match[1] : '';
		            }

					styleProps = {
						layerNm: layerName,
						type : 'POINT',
						iconUrl,
						iconFileName,
						iconSize: style.iconSize ? style.iconSize.join(',') : '16,16',
						iconAnchor: style.iconAnchor ? style.iconAnchor.join(',') : '8,8',
						opacity: style.opacity?.toString() ?? '100'
					};

					break;
				case 'LINE':
					styleProps = {
						layerNm:  layerName,
						type : 'LINE',
						color: (style.color || '000000').replace('#',''),
						weight: style.weight || 2,
						opacity: style.opacity ?? 100,
						lineCap: style.lineCap || 'round',
						lineJoin: style.lineJoin || 'round',
						dashArray: style.dashArray && style.dashArray !== 'null' ? style.dashArray : '',
						outlineColor: (style.outline?.color || '').replace('#',''),
						outlineWeight: style.outline?.weight || ''
				};
					break;

				default:
					break;
				}
            }
            const dashArray= styleProps.dashArray || '';
            const color= styleProps.color || '';
            const outlineColor= styleProps.outlineColor || '';
            const envString = buildEnvParamFromStyle(styleProps);

            this.extent = [254440, 1232737, 1892840, 2871137];
            this.resolutions = [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];

            var customTileGrid = new ol.tilegrid.TileGrid({
                extent: this.extent,
                origin: [this.extent[0], this.extent[3]],
                resolutions: this.resolutions,
                tileSize: [256,256],
            });

            var wmsSource = new ol.source.TileWMS({
            	url: geoUtil.getGeoserverUrl() + "/ne/wms",
            	tileGrid : customTileGrid,
            	params: {
                    SERVICE: "WMS",
                    VERSION: "1.1.0",
                    REQUEST: "GetMap",
                    LAYERS: "ne:test_geoserver_sql",
                    SRS: "EPSG:5179",
                    STYLES: "test_total_style",
                    FORMAT: "image/png",
                    TILED: true,
                    ENV : envString,
                },
                serverType: 'geoserver',
                tileLoadFunction:(function (layerName) {
                	return function(imageTile, src) {

                	var tileCoord = imageTile.getTileCoord();
                	if(!tileCoord){
                		console.log('타일정보를 가져올 수 없음');
                		return;
                	}

                	var z = tileCoord[0],  //ZOOM LEVEL
                	    x = tileCoord[1],  //X 좌표
                	    y = tileCoord[2];  //Y 좌표

                	var bbox = customTileGrid.getTileCoordExtent(tileCoord);

                	//mgmtvalue: SKT 첫번째
                    //mtsostatvalue: 01 일곱번째
                    //mtsotypalue: 2 여섯번째
                	var modifiedSrc = src + "&viewparams=layernm:" + layerName  + ";params:" + "SKT" + "|" + bbox[0] + "|" + bbox[1] + "|" + bbox[2] + "|" + bbox[3] +
                	"|" + "4" + "|" + "01" + "|" + "null" + ";sqlid:" + sqlid + ";layerid:" + layerid +
                	";zoomlv:" + tileCoord[0] + ";iconnm:" + iconFileName + ";dashstyle:" + dashArray + ";color:" + color + ";outlineColor:" + outlineColor + "&buffer=128";
                	imageTile.getImage().src = modifiedSrc;
                	};
            	})(layerName)
            });

            var wmsLayer = new ol.layer.Tile({
            	source : wmsSource,
            	zIndex: 10,
            });

            wmsLayer.setProperties({
            	id : 'test22',
    			name : 'test2',
            	minZoom : 1,
    			maxZoom : 20
            });

            return wmsLayer;

        },

        addTileLayer : function(layerData) {
            var geoUtil = L.geoUtilInstance;
            let layerName = 'test';
            let sqlid = 'test1';
            let layerid = 'STYLE_CFG_T_COFC_POINT';
        	var vectorTileLayer = new ol.layer.VectorTile({
                source: new ol.source.VectorTile({
                format: new ol.format.MVT(),
                tileUrlFunction:(function (layerName) {
                	return function(tileCoord) {
                    var z = tileCoord[0],
                        x = tileCoord[1],
                        y = tileCoord[2];
                    var timestamp = new Date().getTime();
                    // xyzToEPSG5179BoundingBox 함수는 타일 좌표를 EPSG:5179 bbox로 변환하는 함수여야 함
                    var bbox = xyzToEPSG5179BoundingBox(x, y, z);
                    // geoServer URL은 this.geoUtil.getGeoserverUrl (또는 전역 env.geoServer) 로 설정
                    return geoUtil.getGeoserverUrl() + "/ne/wms?service=WMS&version=1.1.0&request=GetMap" +
                        "&layers=ne:test_geoserver_sql" +
                        "&bbox=" + bbox +
                        //mgmtvalue: SKT 첫번째
                        //mtsostatvalue: 01 일곱번째
                        //mtsotypalue: 2 여섯번째
                        "&viewparams=layernm:" + layerName  + ";params:" + "SKT" + "|" + bbox.split(',')[0] + "|" + bbox.split(',')[1] + "|" + bbox.split(',')[2] + "|" + bbox.split(',')[3] +
                        "|" + "2" + "|" + "01" + "|" + "null" + ";sqlid:" + sqlid + ";layerid:" + layerid +
                        "&width=256&height=256&srs=EPSG%3A5179&styles=&format=application%2Fvnd.mapbox-vector-tile" +"&t=" + timestamp;
                	};
                })(layerName)
                }),
                style : getStyleFromConfig,
                visible : true,
            });
        	vectorTileLayer.setProperties({
            	id : 'test11',
    			name : 'test11'
            });

            return vectorTileLayer;
        }
    }

    function StyleConfig() {

    	if(StyleConfig.instance){
    		return StyleConfig.instance;
    	}

        this.STYLE_TYPE = {
            POINT: 'POINT',
            LINE: 'LINE',
            POLYGON: 'POLYGON',
            TEXT: 'TEXT',
        },
        this.SELECT_STYLE_ID = {
            POINT: 'SELECT_POINT',
            LINE: 'SELECT_LINE',
            POLYGON: 'SELECT_POLYGON'
        },
        this.HIGHLIGHT_STYLE_ID = {
            POINT: 'HIGHLIGHT_POINT',
            LINE: 'HIGHLIGHT_LINE',
            POLYGON: 'HIGHLIGHT_POLYGON'
        },

        this._layerStyle = new Map(),
        this._styleCfg = new Map(),
        this._customStyle = new Map(),

        StyleConfig.instance = this;

    }

    function createStyleFromOptions(cfg,feature){

    	//기본스타일가져오기
    	const properties = feature.getProperties();
    	const layerId = properties.layrid;
    	const defaultStyles = L.StyleConfig().getStylesByLayerName(layerId);

        const options = cfg.options;
        const type = cfg.type;
        //let zIndex = cfg.zIndex || 0;
    	const styles = [];
		const normalizeOpacity = (value) => {
			const num = Number(value);
			return num > 1 ? num / 100 : num;
		};

		const hexToRgb = (hex) => {

	    	hex = hex.replace('#','');
	    	const bigint = parseInt(hex, 16);
	    	const r = (bigint >> 16) & 255;
	    	const g = (bigint >> 8) & 255;
	    	const b = bigint & 255;
	    	return `${r},${g},${b}`;
	    };

    	switch(type){
		case 'TEXT':
			styles.push(new ol.style.Style({
				geometry:function(feature){
					const coordinates = feature.getGeometry().getFlatCoordinates();
					const pixel = window.mgMap.map.getPixelFromCoordinate(coordinates);
					const adjustedPixel = [pixel[0], pixel[1] + 15];
					const adjustedCoordinate = window.mgMap.map.getCoordinateFromPixel(adjustedPixel);
					return new ol.geom.Point(adjustedCoordinate);
				},
				text : new ol.style.Text({
					text: formatString(
							options.format || '{0}',
							(options.labelColumn ? options.labelColumn.split(',') : [])
							.slice(0, ((options.format || '{0}').match(/{(\d+)}/g) || []).length)
							.map(col => properties[col.toLowerCase()] || '')
					).replace(/\/+$/,''),
				    font: `bold ${options.size}px ${options.faceName}`,
				    fill: new ol.style.Fill({color : options.color}),
				    stroke: new ol.style.Stroke({color : '#ffffff', width: 2}),
				    textAlign: options.hAlign || 'center',
				    textBaseline: options.vAlign || 'middle'
				})
			}));
			break;
		case 'POINT':
			if(options.markerType === 'icon'){
				//const baseUrl = defaultStyles[0]?.iconUrl.substring(0,defaultStyles[0]?.iconUrl.lastIndexOf('/') + 1);
				//const iconUrl = options.iconUrl || '';
				//const isFullUrl = iconUrl.includes('http://') || iconUrl.includes('https://');
				const baseUrl = 'https://90.90.227.174:8443/geoserver/styles/icons/';
				const iconUrl = defaultStyles?.[0]?.iconUrl?.trim() || options.iconUrl?.trim() || '';
				const isFullUrl = iconUrl.startsWith('http://') || iconUrl.startsWith('https://');

				const finalUrl = isFullUrl ? iconUrl : baseUrl + iconUrl;
				//{"width": "16", "height": "16", "anchorX": "0.5", "anchorY": "0.5", "iconUrl": "T_맨홀_인공.png", "markerType": "icon"}
				/*{ 가공된거
				    "opacity": 1,
				    "overlap": "true",
				    "unit": "px",
				    "displayX": 0,
				    "displayY": 0,
				    "displayUnit": "px",
				    "anchorX": 0.5,
				    "anchorY": 0.5,
				    "rotateAngle": 0,
				    "markerType": "icon",
				    "iconUrl": "https://90.90.227.174:8443/geoserver/styles/icons/T_맨홀_인공.png",
				    "id": 909,
				    "iconSize": [
				        16,
				        16
				    ],
				    "iconAnchor": [
				        8,
				        8
				    ],
				    "type": "POINT"
				}*/

				const width = options.width !== undefined ? Number(options.width) : Number(defaultStyles[0].iconSize[0]);
				const height = options.height !== undefined ? Number(options.height) : Number(defaultStyles[0].iconSize[1]);
				const anchorX = options.anchorX !== undefined ? Number(options.anchorX) : Number(defaultStyles[0].iconSize[0]) / width;
				const anchorY = options.anchorY !== undefined ? Number(options.anchorY) : Number(defaultStyles[0].iconSize[1]) / height;

				const offsetX = width * anchorX;
				const offsetY = height * anchorY;

				styles.push(new ol.style.Style({
					image: new ol.style.Icon({
						src: finalUrl,
						//scale: (options.width ? options.width : defaultStyles[0].iconSize[0]) / 32,
						size: [width, height],
						anchor: [offsetX, offsetY],
						anchorOrgin: 'top-left',
						anchorXUnits: 'pixels',
						anchorYUnits: 'pixels'
					})
				}));

			} else if(options.markerType === 'shape'){
				const shapeType = options.shapeType || 'circle';
				const shapeOptions ={
						fill: new ol.style.Fill({color: options.fillColor || '#3388ff'}),
						stroke: options.isStroke ?  new ol.style.Stroke({
							color: options.strokeColor || '#000',
							width: options.weight || 2
						}) : undefined,
						radius: options.size || 10,
				};

				switch (shapeType) {
				case 'circle':
					styles.push(new ol.style.Style({
						image: new ol.style.Circle(shapeOptions)
					}));

					return styles;
				case 'rect':
					styles.push( new ol.style.Style({
						image: new ol.style.RegularShape({
							...shapeOptions,
							points:4,
							angle:Math.PI / 4
							})
					}));
					return styles;
				case 'cross':
					styles.push(new ol.style.Style({
						image: new ol.style.RegularShape({
							...shapeOptions,
							points:4,
							radius2:0,
							angle:0
							})
					}));
					return styles;
				case 'xcross':
					styles.push(new ol.style.Style({
						image: new ol.style.RegularShape({
							...shapeOptions,
							points:4,
							radius2:0,
							angle:Math.PI / 4
							})
					}));
					return styles;
				case 'triangle':
					styles.push(new ol.style.Style({
						image: new ol.style.RegularShape({
							...shapeOptions,
							points:3,
							})
					}));
					return styles;
				case 'itriangle':
					styles.push(new ol.style.Style({
						image: new ol.style.RegularShape({
							...shapeOptions,
							points:3,
							rotation:Math.PI
							})
					}));
					return styles;
				}
			}
			break;
		case 'LINE':
			//모든옵션에 대해 기본값으로 가지고 있는 스타일을 참조한다.
			if(options.isOutline){
				const outlineStyle = new ol.style.Style({
    				stroke: new ol.style.Stroke({
    					color: options.outlinCcolor
    					       ? options.outlineOpacity !== undefined
    					    	  ? `rgba(${hexToRgb(options.outlineColor)}, ${normalizeOpacity(options.outlineOpacity)})`
    				              : options.outlineColor
    				           : (defaultStyles?.[0]?.outlineColor ?? '#000000'),
    					width: options.outlineWeight || (defaultStyles?.[0]?.outlineWeight ?? 2),
    					lineCap: options.outlineCapStyle || (defaultStyles?.[0]?.outlineCapStyle ?? 'round'),
    					lineJoin: options.outlineJoinStyle || (defaultStyles?.[0]?.outlineCapStyle ?? 'round'),
	                    lineDash: typeof options.outlineDashArray === 'string' && options.outlineDashArray.trim() !== '' && options.outlineDashArray.trim().toLowerCase() !== 'null'
		                      ? options.outlineDashArray.trim().split(/\s+/).map(Number)
		                      : (typeof defaultStyles?.[0]?.outlineDashArray === 'string' && defaultStyles?.[0]?.outlineDashArray?.trim() !== '' && defaultStyles?.[0]?.outlineDashArray?.trim().toLowerCase() !== 'null'
		                    	 ? defaultStyles?.[0]?.outlineDashArray?.trim().split(/\s+/).map(Number)
		                    	 : undefined),
    				}),
    				//zIndex: options.zindex || 1
				});
/*
				const stroke = outlineStyle.getStroke();
				console.log('color:' + stroke.getColor());
				console.log('widht:' + stroke.getWidth());
				console.log('linecap:' + stroke.getLineCap());
				console.log('linejoin:' + stroke.getLineJoin());
				console.log('miterLimit:' + stroke.getMiterLimit());
				console.log('linedash:' + stroke.getLineDash());
				console.log('lineDashOffset:' + stroke.getLineDashOffset());

*/

				styles.push(outlineStyle);
			}

			const mainStyle = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: options.color
				       ? options.opacity !== undefined
    					    	  ? `rgba(${hexToRgb(options.color)}, ${normalizeOpacity(options.opacity)})`
    				              : options.color
    				           : (defaultStyles?.[0]?.color ?? '#000000'),
					width: options.weight || (defaultStyles?.[0]?.weight ?? 2),
					lineCap: options.capStyle || (defaultStyles?.[0]?.lineCap ?? 'round'),
					lineJoin: options.joinStyle || (defaultStyles?.[0]?.lineJoin ?? 'round'),
					lineDash: typeof options.dashArray === 'string' && options.dashArray.trim() !== '' && options.dashArray.trim().toLowerCase() != 'null'
		                      ? options.dashArray.trim().split(/\s+/).map(Number)
		                      : (typeof defaultStyles?.[0]?.dashArray === 'string' && defaultStyles?.[0]?.dashArray?.trim() !== '' && defaultStyles?.[0]?.dashArray?.trim().toLowerCase() !== 'null'
		                    	 ? defaultStyles?.[0]?.dashArray?.trim().split(/\s+/).map(Number)
		                    	 : undefined),
				}),
				//zIndex: options.zIndex || 0
			});
/*			const stroke2 = mainStyle.getStroke();
			console.log('--------------------------------------');
			console.log('color:' + stroke2.getColor());
			console.log('widht:' + stroke2.getWidth());
			console.log('linecap:' + stroke2.getLineCap());
			console.log('linejoin:' + stroke2.getLineJoin());
			console.log('miterLimit:' + stroke2.getMiterLimit());
			console.log('linedash:' + stroke2.getLineDash());
			console.log('lineDashOffset:' + stroke2.getLineDashOffset());*/
			styles.push(mainStyle);
			break;

		case 'POLYGON':

			if(options.isStroke){
				const polygonOutlineStyle = new ol.style.Style({
    				stroke: new ol.style.Stroke({
    					color: options.strokeColor
    					? options.opacity !== undefined
  					    	          ? `rgba(${hexToRgb(options.strokeColor)}, $options.opacity)})`
	    				              : options.strokeColor
	    				           : (defaultStyles?.[0]?.strokeColor ?? '#000000'),
    					width: options.strokeWidth || (defaultStyles?.[0]?.strokeWidth ?? 2),
    					lineCap: options.lineCap || (defaultStyles?.[0]?.lineCap ?? 'round'),
    					lineJoin: options.capStyle ||  (defaultStyles?.[0]?.lineJoin ?? 'round'),
    					lineDash: typeof options.dashArray === 'string' && options.dashArray.trim() !== '' && options.dashArray.trim().toLowerCase() != 'null'
		                      ? options.dashArray.trim().split(/\s+/).map(Number)
		                      : (typeof defaultStyles?.[0]?.dashArray === 'string' && defaultStyles?.[0]?.dashArray?.trim() !== '' && defaultStyles?.[0]?.dashArray?.trim().toLowerCase() !== 'null'
		                    	 ? defaultStyles?.[0]?.dashArray?.trim().split(/\s+/).map(Number)
		                    	 : undefined),
    				}),
    				//zIndex: options.zindex || 1
				});
				styles.push(polygonOutlineStyle);
			}

			if(options.fillColor){
				const polygonFillStyle = new ol.style.Style({
					fill: new ol.style.Fill({
						color: options.fillColor
		    					? options.opacity !== undefined
		    					    	          ? `rgba(${hexToRgb(options.fillColor)}, ${normalizeOpacity(options.opacity)})`
    		    				              : options.fillColor
    		    				           : (defaultStyles?.[0]?.fillColor ?? '#000000'),
					})
				});
				styles.push(polygonFillStyle);
			}
			break;
	    }
    	return styles;
    }

    StyleConfig.prototype = {
        create: function (datas) {
            if ( datas==null ) return;

            this._styleCfg.clear();

            this._createSystemStyle(datas);

            this._addSelectStyleConfig();
            this._addHighlightingStyleConfig();
        },

        _createSystemStyle: function (datas) {

            function addSymbolizer(type, symbols) {
                this._setGeomTypeStyleConfig(type, symbols);
                return _.map(symbols, function (item, index) {
                    return {id: item.id, type:type};
                });
            };

            _.each(datas, function (item, index) {
                var rules = [], symbols;

                _.each(item.rules, function (rule, index) {
                    symbols = addSymbolizer.call(this, this.STYLE_TYPE.LINE, rule.LINE)
                    if ( _.size(symbols)>0 ) rules = rules.concat(symbols);
                    symbols = addSymbolizer.call(this, this.STYLE_TYPE.POINT, rule.POINT);
                    if ( _.size(symbols)>0 ) rules = rules.concat(symbols);
                    symbols = addSymbolizer.call(this, this.STYLE_TYPE.POLYGON, rule.POLYGON);
                    if ( _.size(symbols)>0 ) rules = rules.concat(symbols);
                    symbols = addSymbolizer.call(this, this.STYLE_TYPE.TEXT, rule.TEXT);
                    if ( _.size(symbols)>0 ) rules = rules.concat(symbols);
                }, this);

                this._layerStyle.set(item.layerName, rules);
            }, this);
        },

        getStyleType: function (geojson) {
            return (geojson.style && geojson.style[0]) ? geojson.style[0].type : null;
        },

        getStyleId: function (geojson, idx) {
            if ( geojson.style==null ) return '';

            if ( !L.Util.isArray(geojson.style) || _.size(geojson.style)==0 ) {
                return null;
            }

            var style = geojson.style[idx||0],
                ids = style.type ? [style.type, style.id] : [style.id];
            return ids.length>=2 ? ids.join(':') : ids[0];
        },

        getStyleIdsByLayerName: function (layerName) {
            return this._layerStyle.get(layerName);
        },

        getStylesByLayerName: function (layerName) {
            var ids = this.getStyleIdsByLayerName(layerName);
            return _.map(ids, function (item, index) {
                var id = item.type + ':' + item.id;
                return this.getStyle(id);
            }, this);
        },

        getStyle: function (id) {
            var style = this._styleCfg.get(id) || this._customStyle.get(id);
            return style ? _.clone(style) : {};
        },

        style: function (geojson, idx) {
            var id = geojson;
            if ( typeof geojson==='object' ) {
                id = this.getStyleId(geojson, idx);
            }
            return this.getStyle(id);
        },

        _setSystemStyles: function (datas) {
            _.each(datas, function(data, index) {
                this._setSystemStyle(data.id, data.options, data.type);
            }, this);
        },

        _setSystemStyle: function (id, options, type) {
            if ( type ) {
                options = this._optimizeStyleOptions(options, type, false);
            }
            this._styleCfg.set(id, options);
        },

        setCustomStyles: function (datas) {
            _.each(datas, function(data, index) {
                this.setCustomStyle(data.id, data.options, data.type);
            }, this);
        },

        setCustomStyle: function (id, options, type) {
            if ( type ) {
                options = this._optimizeStyleOptions(options, type, true);
            }
            this._customStyle.set(id, options);
        },

        _setGeomTypeStyleConfig: function (type, styles) {
            var id;
            _.each(styles, function (style, index) {
                id = type+':'+style.id;
                style = this._optimizeStyleOptions(style, type, false);

                this._styleCfg.set(id, style);
            }, this);
        },

        _optimizeStyleOptions: function (orgStyle, type, isCustom) {
            var style = orgStyle;

            if ( style.opacity==null ) style.opacity = 1.0;

            if ( type==this.STYLE_TYPE.LINE || type==this.STYLE_TYPE.POLYGON ) {
                style = _.omit(orgStyle, 'width', 'strokeWidth', 'capStyle', 'joinStyle',
                    'isOutline', 'outlineColor', 'outlineWidth');

                if ( orgStyle.width ) {
                    style.weight = orgStyle.width;
                }
                if ( orgStyle.strokeWidth ) {
                    style.weight = orgStyle.strokeWidth;
                }
                if ( orgStyle.capStyle ) {
                    style.lineCap = orgStyle.capStyle;
                }
                if ( orgStyle.joinStyle ) {
                    style.lineJoin = orgStyle.joinStyle;
                }

                if ( type==this.STYLE_TYPE.POLYGON && style.fillOpacity==null ) {
                    style.fillOpacity = style.opacity;
                }

                if ( type==this.STYLE_TYPE.LINE && orgStyle.isOutline ) {
                    style.outline = {
                        color: orgStyle.outlineColor,
                        weight: orgStyle.outlineWidth
                    }
                }
            }
            else if ( type==this.STYLE_TYPE.POINT ) {
                if ( orgStyle.markerType=='shape' ) {
                    style = this._getShapeMarkerOptions(orgStyle);
                } else {
                    style = _.omit(orgStyle, 'width', 'height');

                    if ( orgStyle.width && orgStyle.height ) {
                        style.iconSize = [orgStyle.width, orgStyle.height];
                    }

                    if ( orgStyle.anchorX && orgStyle.anchorY ) {
                        var offsetX = orgStyle.width*orgStyle.anchorX,
                            offsetY = orgStyle.height*orgStyle.anchorY
                        ;
                        style.iconAnchor = [offsetX, offsetY];
                    }
                }
            }
            else if ( type==this.STYLE_TYPE.TEXT ) {
                style = _.omit(orgStyle, 'horizontalAlign', 'verticalAlign', 'justifyAlign', 'marginAlign', 'rotation');

                if (orgStyle.rotation) style.rotation = orgStyle.rotation;

                style.hAlign = orgStyle.horizontalAlign ? orgStyle.horizontalAlign.toLowerCase() : 'middle';
                style.vAlign = orgStyle.verticalAlign ? orgStyle.verticalAlign.toLowerCase() : 'middle';
                style.jAlign = orgStyle.justifyAlign ? orgStyle.justifyAlign.toLowerCase() : 'center';
                style.mAlign = orgStyle.mAlign ? orgStyle.mAlign : [0,0];
            }

            if ( style.iconUrl && !isCustom ) {
                //style.iconUrl = 'https://gisstg.tango.sktelecom.com/resource/images/tango_t' + '/' + style.iconUrl;
            	style.iconUrl = 'https://90.90.227.174:8443/geoserver/styles/icons' + '/' + style.iconUrl.substring(style.iconUrl.lastIndexOf('/') + 1);
            }

            style.type = type;

            return style;
        },

        _getShapeMarkerOptions: function (style) {
            var options = { markerType: 'shape' };

            if ( style.shapeType ) options.shapeType = style.shapeType;
            if ( style.opacity ) {
                options.opacity = style.opacity;
                options.fillOpacity = style.opacity;
            }
            if ( style.fillOpacity ) options.fillOpacity = style.fillOpacity;

            if ( style.size ) {
                if ( style.width || style.height) {
                    options.size = Math.max(style.width, style.height);
                } else {
                    options.size = style.size;
                }
            }

            if ( style.fillColor ) options.fillColor = style.fillColor;
            if ( style.isStroke ) options.isStroke = style.isStroke;
            if ( style.strokeColor ) options.strokeColor = style.strokeColor;
            if ( style.weight ) options.weight = style.weight;
            if ( style.dashArray ) options.dashArray = style.dashArray;

            options.fill = style.fill;

            return options;
        },

        _addSelectStyleConfig: function () {
            this.setCustomStyle(
                this.SELECT_STYLE_ID.POINT,
                { color: '#0000ff', weight: 3, fill: false, radius: 20 },
                this.STYLE_TYPE.POINT
            );
            this.setCustomStyle(
                this.SELECT_STYLE_ID.LINE,
                { color: '#0000ff', weight: 7, opacity: 1 },
                this.STYLE_TYPE.LINE
            );
            this.setCustomStyle(
                this.SELECT_STYLE_ID.POLYGON,
                { color: '#0000ff', weight: 7, opacity: 1, fill: true, fillColor: '#0000ff', fillOpacity: 0.2 },
                this.STYLE_TYPE.POLYGON
            );
        },

        _addHighlightingStyleConfig: function () {
            this.setCustomStyle(
                this.HIGHLIGHT_STYLE_ID.POINT,
                { color: '#ff0000', weight: 3, fill: false, radius: 20 },
                this.STYLE_TYPE.POINT
            );
            this.setCustomStyle(
                this.HIGHLIGHT_STYLE_ID.LINE,
                { color: '#ff0000', weight: 7, opacity: 1 },
                this.STYLE_TYPE.LINE
            );
            this.setCustomStyle(
                this.HIGHLIGHT_STYLE_ID.POLYGON,
                { color: '#ff0000', weight: 7, opacity: 1, fill: true, fillColor: '#0000ff', fillOpacity: 0.2 },
                this.STYLE_TYPE.POLYGON
            );
        },

        saveGisStyle : function (styleChgVal,layerName){
        	const deferred = $.Deferred();
        	const styleId = L.StyleConfig().getStyleuuid();
    		Util.jsonAjax({url: '/transmisson/tes/engineeringmap/gislist/saveGisStyle', method:'POST', data : {styleId: styleId, styleVal: styleChgVal, layerName:layerName},async:true}).done(
    			function(result) {
    				console.log(result);
    				deferred.resolve();
    			});
    		return deferred.promise();
        },

        setStyleuuid : function (uuid){
        	this._styleuuid = uuid[0];
        },

        getStyleuuid : function (uuid){
        	return this._styleuuid || null;
        }
    }

    class CustomTileLayer extends ol.layer.Tile {
    	constructor(options){
    		super(options);
    		this._cfgStyle = [];

    		//초기 ENV값 저장
    		const initalParams = this.getSource().getParams();
    		this._initialENV = initalParams.ENV || null;

    		this._initialViewParams = options.initialViewParams || '';
    		this._viewparamsString = null;
    	}

    	setUserStyleConfig(userConfig){
    		const layerName = this.get('name');
    		this._userStyleConfig = userConfig;

    		if(userConfig === null){
    			//update
    			L.StyleConfig().saveGisStyle(null, layerName.replace('_RASTERGROUP','').replace('_RASTER','')).then(function(){
					//스타일 삭제시 원복
					this._cfgStyle = [];
					L.sharedStyleConfig.resetStyle(layerName.replace('_RASTERGROUP','').replace('_RASTER',''));


					const defaultStyles = L.StyleConfig().getStylesByLayerName(layerName.replace('_RASTERGROUP','').replace('_RASTER',''));
					let iconUrl = null;
					let soureStyle = null;
					if(Array.isArray(defaultStyles) && defaultStyles.length > 0){
						const styleItem = defaultStyles[0];
						if(styleItem.type === 'POINT' && styleItem.iconUrl){
							iconUrl = styleItem.iconUrl;
							const match = iconUrl.match(/([^\/]+)(?=\.png)/);
				            const iconFileName = match ? match[1] : '';

							this.set('iconUrl' , iconFileName);
						}
						switch (styleItem.type) {
						case 'POINT':
							soureStyle = 'gis_point_only';
							break;
						case 'LINE':
							soureStyle = 'gis_line_only';
							break;
						case 'POLYGON':
							soureStyle = 'gis_polygon_only';
							break;
						}
					}
					//스타일변경(SLD:RULE 1개)
					this.getSource().updateParams({
						ENV: this._initialENV,
						STYLES: soureStyle,
						_t : new Date().getTime()
					});

					this._viewparamsString = null;
					this.getSource().refresh();
    			}.bind(this));
    			return;
    		}

    		if(!Array.isArray(userConfig)){
    			userConfig = [userConfig];
    		}

    		this._cfgStyle = userConfig;

    		//insert
    		L.StyleConfig().saveGisStyle(JSON.stringify(userConfig), layerName.replace('_RASTERGROUP','').replace('_RASTER','')).then(function(){
				//공유 스타일 저장
				L.sharedStyleConfig.setStyle(layerName.replace('_RASTERGROUP','').replace('_RASTER',''), userConfig);

				const sharedStyle = L.sharedStyleConfig.getStyle(layerName.replace('_RASTERGROUP','').replace('_RASTER',''));
				let iconUrl = null;
				let soureStyle = null;
				if(Array.isArray(sharedStyle) && sharedStyle.length > 0){
					const styleItem = sharedStyle[0];
					if(styleItem.type === 'POINT' && styleItem.options?.iconUrl){
						iconUrl = styleItem.options.iconUrl;
						const match = iconUrl.match(/([^\/]+)(?=\.png)/);
			            const iconFileName = match ? match[1] : '';

						this.set('iconUrl' , iconFileName);
					}

					switch (styleItem.type) {
					case 'POINT':
						soureStyle = 'gis_point_new2';
						break;
					case 'LINE':
						soureStyle = 'gis_line_new2';
						break;
					case 'POLYGON':
						soureStyle = 'gis_polygon_new2';
						break;
					}
				}

				//스타일변경(SLD:RULE 5개)
				this.getSource().updateParams({
					_t:new Date().getTime(),
					STYLES: soureStyle
				});

				this.getSource().refresh();
    		}.bind(this));

    	}

    	_convertStyleToEnvParams(styleConfigs){
    		const envArray = [];

    		styleConfigs.forEach(style => {
    			switch (style.type) {
				case 'POINT':
					const iconUrl = style.options.iconUrl || '';
					let iconFileName = '';
					if(iconUrl){
		            	const match = iconUrl.match(/([^\/]+)(?=\.png)/);
		            	iconFileName = match ? match[1] : '';
		            }
					envArray.push(
							`iconUrl:${encodeURIComponent(iconUrl)}`,
							`iconFileName:${iconFileName}`,
							`iconSize:${style.options.iconSize ? style.options.iconSize.join(',') : '16,16'}`,
							`iconAnchor:${style.options.iconAnchor ? style.options.iconAnchor.join(',') : '8,8'}`,
							`opacity:${style.options.opacity?.toString() || '100'}`
					);
					break;
				case 'LINE':
					envArray.push(
						`weight:${style.options.weight || 2}`,
						`opacity:${style.options.opacity || 100}`,
						`lineCap:${style.options.lineCap || 'round'}`,
						`lineJoin:${style.options.lineJoin || 'round'}`
				    );
					break;

				default:
					break;
				}
    		});
    		return envArray.join(';');
    	}

    	_convertStyleToViewParams(styleConfigs, layerName){
    		const params = [];
    		styleConfigs.forEach(style => {
    			params.push(`layernm:${layerName.replace('_RASTER','')}`);

    			if(style.options.color){
    				params.push(`color:${style.options.color.replace('#','')}`);
    			}

    			if(style.options.outlinecolor){
    				params.push(`color:${style.options.outlinecolor.replace('#','')}`);
    			}

    			if(style.options.dashArray){
    				params.push(`dashArray:${style.options.dashArray.replace(',',' ')}`);
    			}

    			if(style.options.iconFileName){
    				params.push(`iconnm:${style.options.iconFileName}`);
    			}
    		});
    		return params.join(';');

    	}

    	getViewParamsString(){
    		return this._viewparamsString || '';
    	}

    	getUserStyleConfig(){
    		return this._userStyleConfig || null;
    	}

    	getLayerAliasName(){
    		//console.log(this.get('alias') + ' : ' + this.get('name'));
    		return this.get('alias') || this.get('name');
    	}

    	getTableName(){
    		return this.get('tableName');
    	}

    	getMinZoom(){
    		return this.get('minZoom');
    	}

    	getMaxZoom(){
    		return this.get('maxZoom');
    	}

    	isSelectable(){
    		return this.get('selectable');
    	}

    	refresh(){
    		const currentParams = this.getSource().getParams();
    		this.getSource().updateParams({
				...currentParams,
				_t: Date.now().toString()
			});
    	}

    	clearLayers(){
    		console.log('이미지 형태는 적용할수없음');
    		//clear함수가 존재하지만 지도에 반영된건 제거불가능
    		//단순히 화면에서 안보이게 하는건 setVisible로 대체가능함..
    	}

    	setUserLayerConfig(options){
    		const currentMin = this.getMinZoom?.();
    		const currentMax = this.getMaxZoom?.();

    		const min = options?.minZoom !== null ? options.minZoom - 1 : currentMin;
    		const max = options?.maxZoom !== null ? options.maxZoom : currentMax;

    		this.setMinZoom(min);
    		this.setMaxZoom(max);

    		return this;
    	}


    }

    class CustomVectorTileLayer extends ol.layer.VectorTile {
    	constructor(options = {}) {
    		super(options);

    		//최초 스타일 별도로 저장
    		this._initialStyleConfig = getStyleFromConfig;
    		//기존 스타일 함수를 유지
    		this.defaultStyleFunction = getStyleFromConfig;
    		//현재 적용된 스타일 함수
    		this.currentStyleFunction = this.defaultStyleFunction;
    		//스타일 설정
    		this.setStyle(this.currentStyleFunction);
    		//필터와 스타일 구성 저장 변수
    		this._cfgStyle = [];
    	}

    	createFilter(filterOption){
    		return function(feature){
    			const jsonData = JSON.parse(feature.getProperties().json_data);
    			if(!jsonData) return false;

    			const left = (typeof filterOption.left === 'string') ? JSON.parse(filterOption.left) : filterOption.left;
    			const leftValue = jsonData[left.column];

    			let rightValue;
    			if(typeof filterOption.right === 'string'){
    				if(filterOption.right.startsWith('{')){
    					const parsedRight = JSON.parse(filterOption.right);
    					rightValue = jsonData[parsedRight.column];
    				} else {
    					rightValue = isNaN(filterOption.right) ? filterOption.right : Number(filterOption.right);
    				}
    			} else if(typeof filterOption.right === 'object' && filterOption.right.column){
    				rightValue = jsonData[filterOption.right.column];
    			} else {
    				rightValue = filterOption.right;
    			}


    			const normalize = (v) => {
    				if(typeof v === 'boolean') return Number(v);
    				if(!isNaN(Number(v))) return Number(v);
    				return v;
    			}

    			const numLeft = normalize(leftValue);
    			const numRight = normalize(rightValue);

    			//console.log('[Filter]',{leftValue, rightValue,numLeft,numRight},{typeLeft : typeof numLeft, typeRight :typeof numRight, result: numLeft === numRight});

    			switch (filterOption.operation) {
					case '==': return numLeft === numRight;
					case '!=': return numLeft !== numRight;
					case '>': return numLeft > numRight;
					case '<': return numLeft < numRight;
					case '>=': return numLeft >= numRight;
					case '<=': return numLeft <= numRight;
					default: return false;
				}
    		}
    	}

    	setUserStyleConfig(userConfig){

    		const layerName = this.get('name');
    		this._userStyleConfig = userConfig;

    		if(userConfig === null){
    			this.currentStyleFunction = this.defaultStyleFunction;
    			this._cfgStyle = [];

    			L.sharedStyleConfig.resetStyle(layerName);
    			this.setStyle(this.currentStyleFunction);

    		} else {

    			if(!Array.isArray(userConfig)){
    				userConfig = [userConfig]
    			}

    			this._cfgStyle = userConfig.map((cfg) => {
    				const cfgCopy = {...cfg};
    				if(cfgCopy.filter){
    					cfgCopy.filter = cfg.filter.map(f => this.createFilter(f));
    				}
    				return cfgCopy;
    			});

    			const self = this;

    			this.currentStyleFunction = function (feature, resolution){
    				//필터에 걸리지 않으면 기본 스타일으로 변경
    				const getFallbackStyle = (feature) => {
    					const properties = feature.getProperties();
        				const layerId = properties.layrid;
        		    	const defaultStyles = L.StyleConfig().getStylesByLayerName(layerId);
        		    	const type = defaultStyles[0].type;
        		    	let styles = [];

        		    	const normalizeOpacity = (value) => {
        					const num = Number(value);
        					return num > 1 ? num / 100 : num;
        				};

        				const hexToRgb = (hex) => {
        			    	hex = hex.replace('#','');
        			    	const bigint = parseInt(hex, 16);
        			    	const r = (bigint >> 16) & 255;
        			    	const g = (bigint >> 8) & 255;
        			    	const b = bigint & 255;
        			    	return `${r},${g},${b}`;
        			    };

        		    	switch(type){
        				case 'TEXT':
        					styles.push(new ol.style.Style({
        						geometry:function(feature){
        							const coordinates = feature.getGeometry().getFlatCoordinates();
        							const pixel = window.mgMap.map.getPixelFromCoordinate(coordinates);
        							const adjustedPixel = [pixel[0], pixel[1] + 15];
        							const adjustedCoordinate = window.mgMap.map.getCoordinateFromPixel(adjustedPixel);
        							return new ol.geom.Point(adjustedCoordinate);
        						},
        						text : new ol.style.Text({
        							text: formatString(
        									options.format || '{0}',
        									(options.labelColumn ? options.labelColumn.split(',') : [])
        									.slice(0, ((options.format || '{0}').match(/{(\d+)}/g) || []).length)
        									.map(col => properties[col.toLowerCase()] || '')
        							).replace(/\/+$/,''),
        						    font: `bold ${options.size}px ${options.faceName}`,
        						    fill: new ol.style.Fill({color : options.color}),
        						    stroke: new ol.style.Stroke({color : '#ffffff', width: 2}),
        						    textAlign: options.hAlign || 'center',
        						    textBaseline: options.vAlign || 'middle'
        						})
        					}));
        					break;
        				case 'POINT':
        					if(defaultStyles[0].markerType === 'icon'){
        						const baseUrl = defaultStyles[0].iconUrl.substring(0,defaultStyles[0].iconUrl.lastIndexOf('/') + 1);
        						const iconUrl = defaultStyles[0].iconUrl || '';
        						const isFullUrl = iconUrl.includes('http://') || iconUrl.includes('https://');
        						const finalUrl = isFullUrl ? iconUrl : baseUrl + iconUrl;

        						const width = Number(defaultStyles[0].iconSize[0]);
        						const height = Number(defaultStyles[0].iconSize[1]);
        						const anchorX = Number(defaultStyles[0].iconSize[0]) / width;
        						const anchorY = Number(defaultStyles[0].iconSize[1]) / height;

        						const offsetX = width * anchorX;
        						const offsetY = height * anchorY;

        						styles.push(new ol.style.Style({
        							image: new ol.style.Icon({
        								src: finalUrl,
        								size: [width, height],
        								anchor: [offsetX, offsetY],
        								anchorOrgin: 'top-left',
        								anchorXUnits: 'pixels',
        								anchorYUnits: 'pixels'
        							})
        						}));

        					} else if(defaultStyles[0].markerType === 'shape'){
        						//{"size": "16", "weight": "2", "isStroke": "true", "dashArray": "null", "fillColor": "#0007ff", "shapeType": "circle", "markerType": "shape", "fillOpacity": "0.3", "strokeColor": "#00aabb"}
        						const shapeType = defaultStyles[0].shapeType || 'circle';
        						const shapeOptions ={
        								fill: new ol.style.Fill({color: defaultStyles[0].fillColor || '#3388ff'}),
        								stroke: defaultStyles[0].isStroke ?  new ol.style.Stroke({
        									color: defaultStyles[0].strokeColor || '#000',
        									width: defaultStyles[0].weight || 2
        								}) : undefined,
        								radius: defaultStyles[0].size || 10,
        						};

        						switch (shapeType) {
        						case 'circle':
        							styles.push(new ol.style.Style({
        								image: new ol.style.Circle(shapeOptions)
        							}));

        							return styles;
        						case 'rect':
        							styles.push( new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:4,
        									angle:Math.PI / 4
        									})
        							}));
        							return styles;
        						case 'cross':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:4,
        									radius2:0,
        									angle:0
        									})
        							}));
        							return styles;
        						case 'xcross':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:4,
        									radius2:0,
        									angle:Math.PI / 4
        									})
        							}));
        							return styles;
        						case 'triangle':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:3,
        									})
        							}));
        							return styles;
        						case 'itriangle':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:3,
        									rotation:Math.PI
        									})
        							}));
        							return styles;
        						}
        					}
        					break;
        				case 'LINE':
        					//모든옵션에 대해 기본값으로 가지고 있는 스타일을 참조한다.
        					if(defaultStyles[0].isOutline){
        						const outlineStyle = new ol.style.Style({
        		    				stroke: new ol.style.Stroke({
        		    					color: defaultStyles?.[0]?.outlinCcolor
        		    					? defaultStyles?.[0]?.outlineOpacity !== undefined
      		    					    	          ? `rgba(${hexToRgb(defaultStyles[0].outlinCcolor)}, ${normalizeOpacity(defaultStyles[0].outlineOpacity)})`
            		    				              : defaultStyles?.[0]?.outlinCcolor
            		    				           : (defaultStyles?.[0]?.outlinCcolor ?? '#000000'),
        		    					width: odefaultStyles?.[0]?.outlineWeight ?? 2,
        		    					lineCap: defaultStyles?.[0]?.outlineCapStyle ?? 'round',
        		    					lineJoin: defaultStyles?.[0]?.outlineCapStyle ?? 'round',
        			                    lineDash: typeof defaultStyles?.[0]?.outlineDashArray === 'string' && defaultStyles?.[0]?.outlineDashArray?.trim() !== '' && defaultStyles?.[0]?.outlineDashArray?.trim().toLowerCase() !== 'null'
        				                    	 ? defaultStyles?.[0]?.outlineDashArray?.trim().split(/\s+/).map(Number)
        				                    	 : undefined,
        		    				}),
        		    				//zIndex: options.zindex || 1
        						});
        						styles.push(outlineStyle);
        					}

        					const mainStyle = new ol.style.Style({
        						stroke: new ol.style.Stroke({
        							color: defaultStyles?.[0]?.color
        						       ? defaultStyles?.[0]?.opacity !== undefined
        		    					    	  ? `rgba(${hexToRgb(defaultStyles[0].color)}, ${normalizeOpacity(defaultStyles[0].opacity)})`
        		    				              : defaultStyles?.[0]?.color
        		    				           : (defaultStyles?.[0]?.color ?? '#000000'),
        							width: defaultStyles?.[0]?.weight ?? 2,
        							lineCap: defaultStyles?.[0]?.lineCap ?? 'round',
        							lineJoin: defaultStyles?.[0]?.lineJoin ?? 'round',
        							lineDash: typeof defaultStyles?.[0]?.dashArray === 'string' && defaultStyles?.[0]?.dashArray?.trim() !== '' && defaultStyles?.[0]?.dashArray?.trim().toLowerCase() !== 'null'
        				                    	 ? defaultStyles?.[0]?.dashArray?.trim().split(/\s+/).map(Number)
        				                    	 : undefined,
        						}),
        						//zIndex: options.zIndex || 0
        					});
        					styles.push(mainStyle);
        					break;

        				case 'POLYGON':
        					if(defaultStyles[0].isOutline){
        						const polygonOutlineStyle = new ol.style.Style({
        		    				stroke: new ol.style.Stroke({
        		    					color: defaultStyles?.[0]?.strokeColor
        		    					? defaultStyles?.[0]?.opacity !== undefined
      		    					    	          ? `rgba(${hexToRgb(defaultStyles[0].strokeColor)}, ${normalizeOpacity(defaultStyles[0].opacity)})`
            		    				              : defaultStyles?.[0]?.strokeColor
            		    				           : (defaultStyles?.[0]?.strokeColor ?? '#000000'),
        		    					width: odefaultStyles?.[0]?.strokeWidth ?? 2,
        		    					lineCap: defaultStyles?.[0]?.lineCap ?? 'round',
        		    					lineJoin: defaultStyles?.[0]?.lineJoin ?? 'round',
        			                    lineDash: typeof defaultStyles?.[0]?.dashArray === 'string' && defaultStyles?.[0]?.dashArray?.trim() !== '' && defaultStyles?.[0]?.dashArray?.trim().toLowerCase() !== 'null'
        				                    	 ? defaultStyles?.[0]?.dashArray?.trim().split(/\s+/).map(Number)
        				                    	 : undefined,
        		    				}),
        		    				//zIndex: options.zindex || 1
        						});
        						styles.push(polygonOutlineStyle);
        					}

        					if(defaultStyles[0].fill !== false){
	        					const polygonFillStyle = new ol.style.Style({
	        						fill: new ol.style.Fill({
        	    						color: defaultStyles?.[0]?.fillColor
                		    					? defaultStyles?.[0]?.opacity !== undefined
              		    					    	          ? `rgba(${hexToRgb(defaultStyles[0].fillColor)}, ${normalizeOpacity(defaultStyles[0].opacity)})`
                    		    				              : defaultStyles?.[0]?.fillColor
                    		    				           : (defaultStyles?.[0]?.fillColor ?? '#000000'),
        	    					})
	        					});
	        					styles.push(polygonFillStyle);
        					}
        					break;
        			    }
        		    	return styles;

    				};

    				const matchedStyles =[];

    				for(let cfg of self._cfgStyle){
    					if(!cfg || !cfg.options || !cfg.type){
    						console.warn('스타일문제',cfg);
    						continue;
    					}

    					let isMatch = true;

    					if(cfg.filter){
    						isMatch = cfg.filter.every(filterFn => filterFn(feature))
    					}

    					if(!isMatch) continue;

    					const style = createStyleFromOptions(cfg,feature);
    					matchedStyles.push(...style);
    				}

    				console.log('111matchedStyles  : ' + matchedStyles);

    				if(matchedStyles.length === 0){
    					return getFallbackStyle(feature);
    				}

    				return matchedStyles;
    			};
    			L.sharedStyleConfig.setStyle(layerName, userConfig);
    		 }
    		this.setStyle(this.currentStyleFunction);
    	}

    	getUserStyleConfig(){
    		return this._userStyleConfig || null;
    	}

    	getLayerAliasName(){
    		//console.log(this.get('alias') + ' : ' + this.get('name'));
    		return this.get('alias') || this.get('name');
    	}

    	getTableName(){
    		return this.get('tableName');
    	}

    	getMinZoom(){
    		return this.get('minZoom');
    	}

    	getMaxZoom(){
    		return this.get('maxZoom');
    	}

    	async getBounds(){
    		const extent = L.GeoMap().map.getView().calculateExtent();
    		const bboxParam = extent.join(',');
    		const layerName = this.getProperties().alias;
    		const geojson = await L.GeoMap().getGeoBboxWfsByLayeNm(layerName,bboxParam);

    		const features = new ol.format.GeoJSON().readFeatures(geojson);
    		const bounds = ol.extent.createEmpty();
    		features.forEach(f => {
    			ol.extent.extend(bounds, f.getGeometry().getExtent());
    		});

    		const [minX, minY, maxX, maxY] = bounds;

    		return {
    			west: minX,
    			south: minY,
    			east: maxX,
    			north: maxY
    		};
    	}

    	isSelectable(){
    		return this.get('selectable');
    	}

    	refresh(){
    		const map = L.GeoMap().map;
    		const oldLayer = this;
    		const oldSource = oldLayer.getSource();
    		const oldTileUrlFunction = oldSource.getTileUrlFunction();
    		const cacheBuster = `_t=${Date.now()}`;
    		const layerNm = this.getProperties().name;

    		const newSource = new ol.source.VectorTile({
    			format: new ol.format.MVT(),
    			tileGrid: oldSource.getTileGrid(),
    			projection: oldSource.getProjection(),
    			tileUrlFunction: (tileCoord) =>{
    				let url = oldTileUrlFunction(tileCoord);
    				url = url.replace(/([&?])_t=\d+(&?)/, (match, p1, p2) => {
    					if(p1 === '?' && p2) return '?';
    					if(p1 === '&' && p2) return '&';
    					return '';
    				});
    				return url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
    			}
    		});

    		const newLayer = new CustomVectorTileLayer({
    			source: newSource,
    			style: oldLayer.getStyle(),
    			zIndex: oldLayer.getZIndex(),
    			visible: oldLayer.getVisible(),
    			properties: oldLayer.getProperties()
    		});

    		const index = L.GeoMap()._vectorLayers.findIndex(i => i.getProperties().name === layerNm);
    		if(index !== -1) L.GeoMap()._vectorLayers[index] = newLayer;

    		const layerCollection = map.getLayers();
    		layerCollection.remove(oldLayer);
    		layerCollection.push(newLayer);
    	}

    	clearLayers(){
    		console.log('백터타일 형태는 적용할수없음');
    		//clear함수가 존재하지만 지도에 반영된건 제거 불가능
    		//단순히 화면에서 안보이게 하는건 setVisible로 대체가능함..
    	}

    	setUserLayerConfig(options){
    		const currentMin = this.getMinZoom?.();
    		const currentMax = this.getMaxZoom?.();

    		const min = options?.minZoom !== null ? options.minZoom - 1 : currentMin;
    		const max = options?.maxZoom !== null ? options.maxZoom : currentMax;

    		this.setMinZoom(min);
    		this.setMaxZoom(max);

    		return this;
    	}

    }

    class CustomVectorLayer extends ol.layer.Vector {
    	constructor(options = {}) {
    		super(options);

    		//최초 스타일 별도로 저장
    		this._initialStyleConfig = getStyleFromConfig;
    		//기존 스타일 함수를 유지
    		this.defaultStyleFunction = getStyleFromConfig;
    		//현재 적용된 스타일 함수
    		this.currentStyleFunction = this.defaultStyleFunction;
    		//스타일 설정
    		this.setStyle(this.currentStyleFunction);
    		//필터와 스타일 구성 저장 변수
    		this._cfgStyle = [];

    		this._popupContent = null;
    		this._lastPopupCoord = null;
    	}

    	bindPopup(content){
    		this._popupContent = content;
    		return this;
    	}

    	openPopup(coordinate){
    		if(!this._popupContent) return;
    		const content = typeof this._popupContent === 'function' ? this._popupContent(this) : this._popupContent;
    		const coord = coordinate || this._lastPopupCoord;

    		if(!coord) return;

    		window.PopupManager.show(content, coord);
    		return this;

    	}

    	closePopup(){
    		if(window.PopupManager){
    			window.PopupManager.hide();
    		}
    		return this;
    	}

    	setPopupCoordinate(coord){
    		this._lastPopupCoord = coord;
    	}

    	getPopup(){
    		return this._popupContent;
    	}

    	addLayer(layer){
    		//해당 레이어 피처를 등록한다.
    		const feature = layer instanceof ol.Feature ? layer : layer.feature;
    		if(!feature || !feature.getGeometry()) return;

    		const props = feature.getProperties() || {};
    		const style = feature.getStyle();

    		props.id = props.id;
    		feature.setId(props.id);
    		feature.setProperties(props);
    		feature.setStyle(style);

    		this.getSource().addFeature(feature);
    	}

    	createFilter(filterOption){
    		return function(feature){
    			//const jsonData = JSON.parse(feature.getProperties().json_data);
    			const jsonData = feature.getProperties();
    			if(!jsonData) return false;

    			const left = (typeof filterOption.left === 'string') ? JSON.parse(filterOption.left) : filterOption.left;
    			const leftValue = jsonData[left.column];

    			let rightValue;
    			if(typeof filterOption.right === 'string'){
    				if(filterOption.right.startsWith('{')){
    					const parsedRight = JSON.parse(filterOption.right);
    					rightValue = jsonData[parsedRight.column];
    				} else {
    					rightValue = isNaN(filterOption.right) ? filterOption.right : Number(filterOption.right);
    				}
    			} else if(typeof filterOption.right === 'object' && filterOption.right.column){
    				rightValue = jsonData[filterOption.right.column];
    			} else {
    				rightValue = filterOption.right;
    			}


    			const normalize = (v) => {
    				if(typeof v === 'boolean') return Number(v);
    				if(!isNaN(Number(v))) return Number(v);
    				return v;
    			}

    			const numLeft = normalize(leftValue);
    			const numRight = normalize(rightValue);

    			//console.log('[Filter]',{leftValue, rightValue,numLeft,numRight},{typeLeft : typeof numLeft, typeRight :typeof numRight, result: numLeft === numRight});

    			switch (filterOption.operation) {
					case '==': return numLeft === numRight;
					case '!=': return numLeft !== numRight;
					case '>': return numLeft > numRight;
					case '<': return numLeft < numRight;
					case '>=': return numLeft >= numRight;
					case '<=': return numLeft <= numRight;
					default: return false;
				}
    		}
    	}

    	setUserStyleConfig(userConfig){

    		const layerName = this.get('name');
    		this._userStyleConfig = userConfig;

    		if(userConfig === null){
    			this.currentStyleFunction = this.defaultStyleFunction;
    			this._cfgStyle = [];

    			//L.sharedStyleConfig.resetStyle(layerName);
    			this.setStyle(this.currentStyleFunction);

    			const resolution = L.GeoMap().map.getView().getResolution();
        		const features = this.getSource().getFeatures();

        		features.forEach(f => {
        			const rawStyle = f.get('rawStyle');
        			if(rawStyle){
        				const style = addCustomLayerStyle(f, L.StyleConfig().getStyle(rawStyle[0].id));
            			f.setStyle(style);
        			} else {
        				f.setStyle(this.defaultStyleFunction(f, resolution));
        			}
        		});
        		return;

    		} else {

    			if(!Array.isArray(userConfig)){
    				userConfig = [userConfig]
    			}

    			this._cfgStyle = userConfig.map((cfg) => {
    				const cfgCopy = {...cfg};
    				if(cfgCopy.filter){
    					cfgCopy.filter = cfg.filter.map(f => this.createFilter(f));
    				}
    				return cfgCopy;
    			});

    			const self = this;

    			this.currentStyleFunction = function (feature, resolution){
    				//필터에 걸리지 않으면 기본 스타일으로 변경
    				const getFallbackStyle = (feature) => {
    					const properties = feature.getProperties();
        				const rawStyle = properties.rawStyle;
        		    	const defaultStyles = rawStyle?.[0]?.id ? [L.StyleConfig().getStyle(rawStyle[0].id)] : [];

        		    	if(!defaultStyles[0]){
        		    		console.warn('기본 스타일 없음',feature);
        		    		return [];
        		    	}

        		    	const type = defaultStyles[0].type;
        		    	let styles = [];

        		    	const normalizeOpacity = (value) => {
        					const num = Number(value);
        					return num > 1 ? num / 100 : num;
        				};

        				const hexToRgb = (hex) => {
        			    	hex = hex.replace('#','');
        			    	const bigint = parseInt(hex, 16);
        			    	const r = (bigint >> 16) & 255;
        			    	const g = (bigint >> 8) & 255;
        			    	const b = bigint & 255;
        			    	return `${r},${g},${b}`;
        			    };

        		    	switch(type){
        				case 'TEXT':
        					styles.push(new ol.style.Style({
        						geometry:function(feature){
        							const coordinates = feature.getGeometry().getFlatCoordinates();
        							const pixel = window.mgMap.map.getPixelFromCoordinate(coordinates);
        							const adjustedPixel = [pixel[0], pixel[1] + 15];
        							const adjustedCoordinate = window.mgMap.map.getCoordinateFromPixel(adjustedPixel);
        							return new ol.geom.Point(adjustedCoordinate);
        						},
        						text : new ol.style.Text({
        							text: formatString(
        									options.format || '{0}',
        									(options.labelColumn ? options.labelColumn.split(',') : [])
        									.slice(0, ((options.format || '{0}').match(/{(\d+)}/g) || []).length)
        									.map(col => properties[col.toLowerCase()] || '')
        							).replace(/\/+$/,''),
        						    font: `bold ${options.size}px ${options.faceName}`,
        						    fill: new ol.style.Fill({color : options.color}),
        						    stroke: new ol.style.Stroke({color : '#ffffff', width: 2}),
        						    textAlign: options.hAlign || 'center',
        						    textBaseline: options.vAlign || 'middle'
        						})
        					}));
        					break;
        				case 'POINT':
        					if(defaultStyles[0].markerType === 'icon'){
        						const baseUrl = defaultStyles[0].iconUrl.substring(0,defaultStyles[0].iconUrl.lastIndexOf('/') + 1);
        						const iconUrl = defaultStyles[0].iconUrl || '';
        						const isFullUrl = iconUrl.includes('http://') || iconUrl.includes('https://');
        						const finalUrl = isFullUrl ? iconUrl : baseUrl + iconUrl;

        						const width = Number(defaultStyles[0].iconSize[0]);
        						const height = Number(defaultStyles[0].iconSize[1]);
        						const anchorX = Number(defaultStyles[0].iconSize[0]) / width;
        						const anchorY = Number(defaultStyles[0].iconSize[1]) / height;

        						const offsetX = width * anchorX;
        						const offsetY = height * anchorY;

        						styles.push(new ol.style.Style({
        							image: new ol.style.Icon({
        								src: finalUrl,
        								size: [width, height],
        								anchor: [offsetX, offsetY],
        								anchorOrgin: 'top-left',
        								anchorXUnits: 'pixels',
        								anchorYUnits: 'pixels'
        							})
        						}));

        					} else if(defaultStyles[0].markerType === 'shape'){
        						//{"size": "16", "weight": "2", "isStroke": "true", "dashArray": "null", "fillColor": "#0007ff", "shapeType": "circle", "markerType": "shape", "fillOpacity": "0.3", "strokeColor": "#00aabb"}
        						const shapeType = defaultStyles[0].shapeType || 'circle';
        						const shapeOptions ={
        								fill: new ol.style.Fill({color: defaultStyles[0].fillColor || '#3388ff'}),
        								stroke: defaultStyles[0].isStroke ?  new ol.style.Stroke({
        									color: defaultStyles[0].strokeColor || '#000',
        									width: defaultStyles[0].weight || 2
        								}) : undefined,
        								radius: defaultStyles[0].size || 10,
        						};

        						switch (shapeType) {
        						case 'circle':
        							styles.push(new ol.style.Style({
        								image: new ol.style.Circle(shapeOptions)
        							}));

        							return styles;
        						case 'rect':
        							styles.push( new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:4,
        									angle:Math.PI / 4
        									})
        							}));
        							return styles;
        						case 'cross':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:4,
        									radius2:0,
        									angle:0
        									})
        							}));
        							return styles;
        						case 'xcross':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:4,
        									radius2:0,
        									angle:Math.PI / 4
        									})
        							}));
        							return styles;
        						case 'triangle':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:3,
        									})
        							}));
        							return styles;
        						case 'itriangle':
        							styles.push(new ol.style.Style({
        								image: new ol.style.RegularShape({
        									...shapeOptions,
        									points:3,
        									rotation:Math.PI
        									})
        							}));
        							return styles;
        						}
        					}
        					break;
        				case 'LINE':
        					//모든옵션에 대해 기본값으로 가지고 있는 스타일을 참조한다.
        					if(defaultStyles[0].isOutline){
        						const outlineStyle = new ol.style.Style({
        		    				stroke: new ol.style.Stroke({
        		    					color: defaultStyles?.[0]?.outlinCcolor
        		    					? defaultStyles?.[0]?.outlineOpacity !== undefined
      		    					    	          ? `rgba(${hexToRgb(defaultStyles[0].outlinCcolor)}, ${normalizeOpacity(defaultStyles[0].outlineOpacity)})`
            		    				              : defaultStyles?.[0]?.outlinCcolor
            		    				           : (defaultStyles?.[0]?.outlinCcolor ?? '#000000'),
        		    					width: odefaultStyles?.[0]?.outlineWeight ?? 2,
        		    					lineCap: defaultStyles?.[0]?.outlineCapStyle ?? 'round',
        		    					lineJoin: defaultStyles?.[0]?.outlineCapStyle ?? 'round',
        			                    lineDash: typeof defaultStyles?.[0]?.outlineDashArray === 'string' && defaultStyles?.[0]?.outlineDashArray?.trim() !== '' && defaultStyles?.[0]?.outlineDashArray?.trim().toLowerCase() !== 'null'
        				                    	 ? defaultStyles?.[0]?.outlineDashArray?.trim().split(/\s+/).map(Number)
        				                    	 : undefined,
        		    				}),
        		    				//zIndex: options.zindex || 1
        						});
        						styles.push(outlineStyle);
        					}

        					const mainStyle = new ol.style.Style({
        						stroke: new ol.style.Stroke({
        							color: defaultStyles?.[0]?.color
        						       ? defaultStyles?.[0]?.opacity !== undefined
        		    					    	  ? `rgba(${hexToRgb(defaultStyles[0].color)}, ${normalizeOpacity(defaultStyles[0].opacity)})`
        		    				              : defaultStyles?.[0]?.color
        		    				           : (defaultStyles?.[0]?.color ?? '#000000'),
        							width: defaultStyles?.[0]?.weight ?? 2,
        							lineCap: defaultStyles?.[0]?.lineCap ?? 'round',
        							lineJoin: defaultStyles?.[0]?.lineJoin ?? 'round',
        							lineDash: typeof defaultStyles?.[0]?.dashArray === 'string' && defaultStyles?.[0]?.dashArray?.trim() !== '' && defaultStyles?.[0]?.dashArray?.trim().toLowerCase() !== 'null'
        				                    	 ? defaultStyles?.[0]?.dashArray?.trim().split(/\s+/).map(Number)
        				                    	 : undefined,
        						}),
        						//zIndex: options.zIndex || 0
        					});
        					styles.push(mainStyle);
        					break;

        				case 'POLYGON':
        					if(defaultStyles[0].isOutline){
        						const polygonOutlineStyle = new ol.style.Style({
        		    				stroke: new ol.style.Stroke({
        		    					color: defaultStyles?.[0]?.strokeColor
        		    					? defaultStyles?.[0]?.opacity !== undefined
      		    					    	          ? `rgba(${hexToRgb(defaultStyles[0].strokeColor)}, ${normalizeOpacity(defaultStyles[0].opacity)})`
            		    				              : defaultStyles?.[0]?.strokeColor
            		    				           : (defaultStyles?.[0]?.strokeColor ?? '#000000'),
        		    					width: odefaultStyles?.[0]?.strokeWidth ?? 2,
        		    					lineCap: defaultStyles?.[0]?.lineCap ?? 'round',
        		    					lineJoin: defaultStyles?.[0]?.lineJoin ?? 'round',
        			                    lineDash: typeof defaultStyles?.[0]?.dashArray === 'string' && defaultStyles?.[0]?.dashArray?.trim() !== '' && defaultStyles?.[0]?.dashArray?.trim().toLowerCase() !== 'null'
        				                    	 ? defaultStyles?.[0]?.dashArray?.trim().split(/\s+/).map(Number)
        				                    	 : undefined,
        		    				}),
        		    				//zIndex: options.zindex || 1
        						});
        						styles.push(polygonOutlineStyle);
        					}

        					if(defaultStyles[0].fill !== false){
	        					const polygonFillStyle = new ol.style.Style({
	        						fill: new ol.style.Fill({
        	    						color: defaultStyles?.[0]?.fillColor
                		    					? defaultStyles?.[0]?.opacity !== undefined
              		    					    	          ? `rgba(${hexToRgb(defaultStyles[0].fillColor)}, ${normalizeOpacity(defaultStyles[0].opacity)})`
                    		    				              : defaultStyles?.[0]?.fillColor
                    		    				           : (defaultStyles?.[0]?.fillColor ?? '#000000'),
        	    					})
	        					});
	        					styles.push(polygonFillStyle);
        					}
        					break;
        			    }
        		    	return styles;

    				};

    				const matchedStyles =[];

    				for(let cfg of self._cfgStyle){
    					if(!cfg || !cfg.options || !cfg.type){
    						console.warn('스타일문제',cfg);
    						continue;
    					}

    					let isMatch = true;

    					if(cfg.filter){
    						isMatch = cfg.filter.every(filterFn => filterFn(feature))
    					}

    					if(!isMatch) continue;

    					const style = createStyleFromOptions(cfg,feature);
    					matchedStyles.push(...style);
    				}

    				console.log('matchedStyles  : ' + matchedStyles);

    				if(matchedStyles.length === 0){
    					return getFallbackStyle(feature);
    				}

    				return matchedStyles;
    			};
    			//L.sharedStyleConfig.setStyle(layerName, userConfig);
    		 }
    		this.setStyle(this.currentStyleFunction);

    		const resolution = L.GeoMap().map.getView().getResolution();
    		const features = this.getSource().getFeatures();

    		features.forEach(f => {
    			const style = this.currentStyleFunction(f, resolution);
    			f.setStyle(style);
    		});
    	}

    	getUserStyleConfig(){
    		return this._userStyleConfig || null;
    	}

    	getLayerAliasName(){
    		return this.get('alias') || this.get('name');
    	}

    	getTableName(){
    		return this.get('tableName');
    	}

    	getMinZoom(){
    		return this.get('minZoom');
    	}

    	getMaxZoom(){
    		return this.get('maxZoom');
    	}

    	isSelectable(){
    		return this.get('selectable');
    	}

    	refresh(){
    		const layerName = this.get('name');
    		const reloadFn = L.GeoMap()._layerReloadFnMap?.[layerName];
			this.getSource().clear();
			reloadFn();
    	}

    	clearLayers(){
			this.getSource().clear();
    	}

    	getBounds(){
    		return this.getSource().getExtent();
    	}

    	setUserLayerConfig(options){
    		const currentMin = this.getMinZoom?.();
    		const currentMax = this.getMaxZoom?.();

    		const min = options?.minZoom !== null ? options.minZoom - 1 : currentMin;
    		const max = options?.maxZoom !== null ? options.maxZoom : currentMax;

    		this.setMinZoom(min);
    		this.setMaxZoom(max);

    		return this;
    	}

    }

    class ContextMenuManager {
    	constructor(map){
    		if(ContextMenuManager._instance){
    			return ContextMenuManager._instnace;
    		}
    		this.map = map;
    		this.menu = document.getElementById('map-contextmenu');
    		this.engMap = document.getElementById('engMap');
    		this.mapEl = map.getViewport();

    		this.currentMode = 'default';
    		this.defaultMenuItems = [];
    		this.editMenuItems = {items:[], addDefault:true};
    		this.selectedItemMenu = {items:[], addDefault:true};

    		this._initEventes();

    		ContextMenuManager._instance = this;
    	}

    	static getInstance(){
    		return ContextMenuManager._instance;
    	}

    	_initEventes(){
    		if(!this.mapEl._contextMenuInitialized){
    			this.mapEl.addEventListener('contextmenu', (e) => {
    				e.preventDefault();
    				this.map.get('renderContextMenu')?.(e.clientX, e.clientY);
    			});

    			this.mapEl.addEventListener('click', () => {
    				this.menu.style.display = 'none';
    			});

    			this.mapEl._contextMenuInitialized = true;
    		}
    	}

    	_renderMenu(items,x,y){
    		if(!Array.isArray(items)) return;

    		this.menu.innerHTML = '';
    		items.forEach(item => {
    			const li = document.createElement('li');
    			const iconHtml = item.icon ? `<img src="${item.icon}" alt="" />` : '';
    			li.innerHTML = `${iconHtml} ${item.text}`;
    			li.onclick = () => {
    				item.callback();
    				this.menu.style.display = 'none';
    			};
    			this.menu.appendChild(li);
    		});

    		const mapRect = this.engMap.getBoundingClientRect();
    		const offsetX = x - mapRect.left;
    		const offsetY = y - mapRect.top;

    		this.menu.style.left = `${offsetX}px`;
    		this.menu.style.top = `${offsetY}px`;
    		this.menu.style.display = 'block';
    	}

    	setDefaultContextMenu(items){
    		this.defaultMenuItems = items;
    		this.currentMode = 'default';

    		const render = (x,y) => {
    			this._renderMenu(this.defaultMenuItems,x,y);
    		}

    		this.map.set('renderContextMenu', render);
    	}

    	setEditContextMenu(items, addDefault = true){
    		if(this.currentMode === 'edit') return;

    		this.editMenuItems = {items, addDefault};
    		this.currentMode = 'edit';

    		const merged = addDefault ? [...this.defaultMenuItems, ...items] : items;

    		const render = (x,y) => {
    			this._renderMenu(merged,x,y);
    		}

    		this.map.set('renderContextMenu', render);
    	}

    	setSelectedItemContextMenu(items, addDefault = true){
    		//if(this.currentMode === 'selected') return;

    		this.editMenuItems = {items, addDefault};
    		this.currentMode = 'selected';

    		const merged = addDefault ? [...this.defaultMenuItems, ...items] : items;

    		const render = (x,y) => {
    			this._renderMenu(merged,x,y);
    		}

    		this.map.set('renderContextMenu', render);
    	}

    	setContextMenu(items){
    		this.defaultItems = [];
    		this.editMenuItems = {items:[], addDefault: true};
    		this.selectedItemMenu = {items:[], addDefault: true};
    		this.currentMode = 'custom';

    		const render = (x,y) => {
    			this._renderMenu(merged,x,y);
    		}

    		this.map.set('renderContextMenu', render);

    	}

    }

    //zomm slider control
    /* 컨트롤 구조
    <div class="custom-zoomslider">
    	<div class="zoom-level-label">13</div>
    	<button class="zoom-in-btn">+</button>
    	<div class="zoom-slider-container">
    		<div class="zoom-slider-bar">
	    		<div class="zoom-slider-enabled"></div>
	    		<div class="zoom-slider-knob"></div>
    		</div>
    	</div>
    	<button class="zoom-out-btn">-</button>
    </div>
    */
    function CustomZoomSliderControl(){
        const container = document.createElement('div');
    	container.className = 'ol-zoomslider custom-zoomslider ol-unselectable ol-control';

    	const zoomLevel = document.createElement('div');
    	zoomLevel.className = 'zoom-level-label';
    	container.appendChild(zoomLevel);

    	const zoomInBtn = document.createElement('button');
    	zoomInBtn.className = 'zoom-in-btn custom-button';
    	zoomInBtn.textContent = '+';
    	container.appendChild(zoomInBtn);

    	const sliderContainer = document.createElement('div');
    	sliderContainer.className = 'zoom-slider-container';

    	const sliderBar = document.createElement('div');
    	sliderBar.className = 'zoom-slider-bar';

    	const sliderEnabled = document.createElement('div');
    	sliderEnabled.className = 'zoom-slider-enabled';

    	const sliderKnob = document.createElement('div');
    	sliderKnob.className = 'zoom-slider-knob';

    	sliderBar.appendChild(sliderEnabled);
    	sliderBar.appendChild(sliderKnob);
    	sliderContainer.appendChild(sliderBar);
    	container.appendChild(sliderContainer);

    	const zoomOutBtn = document.createElement('button');
    	zoomOutBtn.className = 'zoom-out-btn custom-button';
    	zoomOutBtn.textContent = '-';
    	container.appendChild(zoomOutBtn);

    	const control = new ol.control.Control({element: container});

    	control.setMap = function (map){
    		ol.control.Control.prototype.setMap.call(control, map);

    		const view = map.getView();
    		const minZoom = view.getMinZoom();
    		const maxZoom = view.getMaxZoom();
    		const barHeight = 125;

    		const toZoom = (y) => {
    			const ratio = 1 - y / barHeight;
    			return minZoom + ratio * (maxZoom - minZoom);
    		};

    		const toY = (zoom) => {
    			const ratio = (zoom - minZoom) / (maxZoom - minZoom);
    			return barHeight * (1 - ratio);
    		}

    		const updateSlider = () => {
    			const zoom = view.getZoom();
    			zoomLevel.textContent = Math.round(zoom);

    			const yRaw = toY(zoom);
    			const y = Math.max(4, Math.min(yRaw,barHeight));
    			const knobHeight = 12;
    			const fillHiehgt = Math.max(0, barHeight - y + knobHeight / 2);

    			sliderKnob.style.top = `${y - knobHeight / 2}px`;
    			sliderEnabled.style.height = `${fillHiehgt}px`;
    		};

    		let isDragging = false;
    		let dragStarted = false;
    		let startY = null;

    		function preventWheel(e){
    			e.preventDefault();
    		}

    		// 클릭-> 즉시이동
    		sliderBar.addEventListener('click', (e) => {
    			const rect = sliderBar.getBoundingClientRect();
    			let y = e.clientY - rect.top;
    			if(y < 0 || y > rect.height) return;
    			const zoom = toZoom(y);
    			view.setZoom(zoom);
    		});

    		//눌렀을때 -> 드래그 준비
    		sliderKnob.addEventListener('mousedown', (e) => {
    			e.preventDefault();
    			e.stopPropagation();
    			isDragging = true;
    			dragStarted = false;
    			startY = e.clientY;
    		});

    		//움직이면 -> 드래그 시작
    		document.addEventListener('mousemove', (e) => {
    			if(!isDragging) return;
    			const z = view.getZoom();
    			const rect = sliderBar.getBoundingClientRect();
    			const insideX = e.clientX >= rect.left && e.clientX <= rect.right;
    			const insideY = e.clientY >= rect.top && e.clientY <= rect.bottom;


    			let y = e.clientY - rect.top;
    			if(!dragStarted){
    				if(!insideX || !insideY) return;
    				if(Math.abs(e.clientY - startY) >= 1){
	    				dragStarted = true;
	    				map.getTargetElement().addEventListener('wheel', preventWheel,{passive:false});
    				} else {
    					return;
    				}
    			}

    			const yRaw = toY(z);
    			const knobY = Math.max(4, Math.min(yRaw,barHeight));
    			const knobHeight = 12;
    			const fillHiehgt = Math.max(0, barHeight - knobY + knobHeight / 2);

    			const zoom = toZoom(y);
    			view.setZoom(zoom);

    			sliderKnob.style.top = `${knobY - knobHeight / 2}px`;
    			sliderEnabled.style.height = `${fillHiehgt}px`;


    		});

    		// 마우스 떼면 종료
    		document.addEventListener('mouseup', () => {
    			if(dragStarted){
    				map.getTargetElement().removeEventListener('wheel', preventWheel);
    			}
    			isDragging = false;
    			dragStarted = false;
    		});

    		zoomInBtn.addEventListener('click', () => {
    			view.setZoom(view.getZoom() + 1);
    		});

    		zoomOutBtn.addEventListener('click', () => {
    			view.setZoom(view.getZoom() - 1);
    		});

    		view.on('change:resolution', updateSlider);
    		updateSlider();


        	createToolButtonGroup(container,[
        		{
        			iconPath:'',
        			label:'영역선택',
        			onClick: () => {console.log('영역선택', );}
        		},
        		{
        			iconPath:'',
        			label:'거리재기',
        			onClick: () => {console.log('거래재기');}
        		},
        	]);

        	createExpandableTool(container,'버튼',[
        		{label:'Rect',onClick: () => {L.FeatureSelector.getInstance().setSelector('rect');$('.tool-expand-panel').css('display','none');}},
        		{label:'Circle',onClick: () => {L.FeatureSelector.getInstance().setSelector('circle');$('.tool-expand-panel').css('display','none');}},
        		{label:'Polygon',onClick: () => {L.FeatureSelector.getInstance().setSelector('poly');$('.tool-expand-panel').css('display','none');}},
    		]);
    	};

    	return control;
    }

    function createToolButtonGroup(container, tools){
    	const toolGroup = document.createElement('div');
    	toolGroup.className = 'map-tool-group';

    	tools.forEach(({iconPath, label, onClick})=> {
    		const buttonWrap = document.createElement('div');
    		buttonWrap.className = 'tool-button-wrap';

    		const button = document.createElement('button');
    		button.className = 'tool-button custom-button';

    		if(iconPath){
    			const icon = document.createElement('img');
    			icon.src = iconPath;
    			icon.alt = label;
    			icon.onerror = () =>{
    				button.innerHTML = label.charAt(0);
    			}
    			button.appendChild(icon);
    		} else {
    			button.innerHTML = label.charAt(0);
    		}

    		buttonWrap.appendChild(button);
    		toolGroup.appendChild(buttonWrap);

    		if(onClick){
    			button.addEventListener('click', onClick);
    		}

    	});

    	container.appendChild(toolGroup);
    }

    function createExpandableTool(container, label, options){
    	const wrap = document.createElement('div');
    	wrap.className = 'tool-button-wrap expandable';

    	const mainBtn = document.createElement('button');
    	mainBtn.className = 'tool-button custom-button';
    	mainBtn.textContent = label;
    	wrap.appendChild(mainBtn);

    	const panel = document.createElement('div');
    	panel.className = 'tool-expand-panel';

    	options.forEach(opt => {
    		const subBtn = document.createElement('button');
    		subBtn.className = 'expand-btn';
    		subBtn.textContent = opt.label;
    		subBtn.onclick = opt.onClick;
    		panel.appendChild(subBtn);
    	});

    	wrap.appendChild(panel);

    	mainBtn.addEventListener('click', () => {
    		wrap.classList.toggle('open');
    		$('.tool-expand-panel').css('display','flex');
    	});

    	container.appendChild(wrap);
    }


    class SelectLayer {
    	constructor(map){
    		if(SelectLayer._instance) return SelectLayer._instance;

    		this.map = map;
    		this.source = new ol.source.Vector();
    		this.layer = new ol.layer.Vector({
    			source: this.source,
    			style: (f,r) => this.getSelectStyle(f,r),
    			zIndex:9999
    		});
    		this.map.addLayer(this.layer);

    		SelectLayer._instance = this;
    	}

    	static getInstance() {
    		return SelectLayer._instance;
    	}

    	setSelectFeatures(features, isAdd = false) {
    		if(!isAdd) this.source.clear();

    		//선택피처 갯수
    		this.selectedCount = features.length;

    		this.source.addFeatures(features);
    	}

    	getSelectFeatures() {
    		return this.source.getFeatures();
    	}

    	clearSelectLayer(){
    		this.source.clear();
    	}

    	getSelectStyle(feature, resolution){
    		const zoom = L.GeoMap().map.getView().getZoomForResolution(resolution);
    		const minZoom= feature.get('minZoom') ?? 0;
    		const maxZoom= feature.get('maxZoom') ?? 20;
    		if(zoom < minZoom || zoom > maxZoom){
    			return null;
    		}
    		const count = this.selectedCount;
    		const isSingle = count === 1;

    		const geomType = feature.getGeometry().getType().toUpperCase();
    		const styleKey = `HIGHLIGHT_${geomType.includes('LINE') ? 'LINE' : geomType}`;
    		const baseStyle = L.StyleConfig().getStyle(styleKey);
    		const highlightColor = isSingle ? baseStyle.color : '#0000FF';
    		const highlightOpacity = baseStyle.opacity ?? 0.3;
    		const fillColor = baseStyle.fillColor ?? '#000000';
			const fillOpacity = baseStyle.fillOpacity ?? 0.3;

			//선택스타일
    		switch (geomType) {
    		case 'POINT':
    			return new ol.style.Style({
    				image:new ol.style.Circle({
    					radius : baseStyle.radius ?? 10,
    					fill: baseStyle.fill !== false ? new ol.style.Fill({color: toRGBA(fillColor,fillOpacity)}) : null,
    					stroke:new ol.style.Stroke({color:toRGBA(highlightColor,highlightOpacity), width:baseStyle.weight ?? 2})
    				})
    			});
    		case 'LINESTRING':
    			return new ol.style.Style({
    				stroke:new ol.style.Stroke({color:highlightColor, width:baseStyle.weight ?? 3})
    			});
    		case 'POLYGON':
    			const strokeColor = highlightColor;
    			return new ol.style.Style({
    				stroke:new ol.style.Stroke({color:toRGBA(highlightColor,highlightOpacity), width:baseStyle.weight ?? 2}),
    				fill: baseStyle.fill !== false ? new ol.style.Fill({color: toRGBA(fillColor,fillOpacity)}) : null,
    			});
    		default:
    			return null;
    		}
    	}
    }

    function toRGBA(color, opacity=1){

    	if(!color) return `rgba(0,0,0,${opacity})`;

    	// 이미 rgba인 경우 -> alpha만 바꿈
    	if(color.startsWith('rgba')){
    		return color.replace(/[^,]+(?=\))$/,opacity);  //rgba(255,0,0,0.6) => 0.6만 잡음
    	}

    	// rgb(r,g,b)형식 -> rgba로 확장
    	if(color.startsWith('rgb')){
    		const parts = color.match(/\d+/g);
    		if(parts.length === 3){
    			return `rgba(${parts[0]},${parts[1]},${parts[2]},${opacity})`;
    		}
    	}

    	//짧은 hex(#38f) -> #3388ff 확장
    	if(color.length === 4 && color.startsWith('#')){
    		color = '#' + [...color.slice(1)].map(c => c + c).join('');
    	}

    	//긴 hex(#rrggbb)
    	if(color.startsWith('#') && color.length === 7){
    		const r = parseInt(color.slice(1,3),16);
    		const g = parseInt(color.slice(3,5),16);
    		const b = parseInt(color.slice(5,7),16);
    		return `rgba(${r},${g},${b},${opacity})`;
    	}

    	//fallback
    	return color;

    }

    class FeatureSelector {
    	constructor(map) {
    		if(FeatureSelector._instance) return FeatureSelector._instance;
    		this.map = map;
    		this.currentDraw = null;
    		this.type = null;
    		this.source = new ol.source.Vector();

    		this.drawLayer = new ol.layer.Vector({
    			source:this.source,
    			style: new ol.style.Style({
    				stroke: new ol.style.Stroke({
    					color:'black',
    					width:1,
    					lineDash:[4,4]
    				}),
    				fill:new ol.style.Fill({color:'rgba(0,0,0,0.1)'}),
    				image: new ol.style.Circle({
    					radius:0,
    					fill: new ol.style.Fill({color:'rgba(0,0,0,0)'}),
    					stroke:null
    				})
    			})
    		});

    		this.map.addLayer(this.drawLayer);
    		FeatureSelector._instance = this;
    	}

    	static getInstance() {
    		return FeatureSelector._instance;
    	}

    	async handleSelectFromGeometry({geometry, isPointSelect=false, clickCoord=null, clickPoint=null, clickPixel=null}){

    		const mode = TrailManager.getInstance().getMode?.();
    		if(mode !== null){
    			console.log('모드존재');
    			return;
    		}

        	const format = new ol.format.GeoJSON();
        	const view = L.GeoMap().map.getView();
        	const resolution = view.getResolution();

        	// 클릭 반경 허용 픽셀
        	const linePixelBuffer = 10;
        	const lineThreshold = resolution * linePixelBuffer;

            //타입별 turf polygon 생성
            let turfPolygon;
            if(geometry.getType() === 'Circle'){
            	const center = ol.proj.transform(geometry.getCenter(), 'EPSG:5179','EPSG:4326');
            	const radius = geometry.getRadius();
            	turfPolygon = turf.circle(center,radius,{steps:64,units:'meters'});
            } else {
            	turfPolygon = format.writeGeometryObject(geometry,{
            		featureProjection: 'EPSG:5179',
            		dataProjection:'EPSG:4326'
            	});
            }

            //bbox추출
            const extent = geometry.getExtent();
        	const bboxParam = extent.join(',');

        	//체크된 대상 레이어 찾기
        	const gis = getCheckedLayerAliasByGroup('GIS');
        	const bul = getCheckedLayerAliasByGroup('구성');
        	//const allLayer = [...gis];

        	//이전 선택레이어 초기화
        	L.SelectLayer.getInstance().clearSelectLayer();

        	const allFiltered =[];
        	//gis
        	for(const layerName of gis){

        		//레이어정보 조회
        		const zoom = Math.floor(L.GeoMap().map.getView().getZoom());
        		const matchedLayer = findLayerByAlias(layerName, zoom);

        		if(!matchedLayer || !matchedLayer.getVisible()) continue;

        		const geojson = await L.GeoMap().getGeoBboxWfsByLayeNm(layerName,bboxParam);
        		if(!geojson || !geojson.features){
        			//console.warn(`geojson오류: ${layerName} 레이어에서 features를 찾을 수 없음`, geojson);
        			continue;
        		}


        		const turfFeatures = geojson.features;
        		//교차판단
        		let filtered = [];

        		if(isPointSelect && clickPoint){
        			let nearestFeature = null;
        			let minDistance = Infinity;

        			for(const f of turfFeatures){
        				const geom = f.geometry;
        				if(!geom) continue;

        				const curZoom = L.GeoMap().map.getView().getZoom();
        				const minZoom = f.properties.minZoom ?? 0;
        				const maxZoom = f.properties.maxZoom ?? 30;

        				if(curZoom < minZoom || curZoom > maxZoom) continue;

        				const turfFeature = {
        						type:'Feature',
        						geometry:geom,
        						properties:[]
        				};

        				let dist = Infinity;
        				let isSelectable = false;

        				switch (geom.type) {
						case 'Point':
							dist = turf.distance(clickPoint, turfFeature, {units:'meters'});

							//픽셀 기준 거리 허용
							const featureCoord = geom.coordinates;
							const coord5179 = ol.proj.transform(featureCoord, 'EPSG:4326', 'EPSG:5179');
							const featurePixel = L.GeoMap().map.getPixelFromCoordinate(coord5179);
							const dx = clickPixel[0] - featurePixel[0];
							const dy = clickPixel[1] - featurePixel[1];
							const pixelDist = Math.sqrt(dx * dx + dy * dy);

							isSelectable = pixelDist <= 12;
							break;
						case 'LineString':
						case 'MultiLineString': {
							const nearest = turf.nearestPointOnLine(turfFeature, clickPoint, {units:'meters'});
							dist = turf.distance(clickPoint, nearest, {units:'meters'});

							isSelectable = dist <= lineThreshold;
							break;
							}
						case 'Polygon':
						case 'MultiPolygon':{

							const isInside = turf.booleanPointInPolygon(clickPoint, turfFeature);
							//console.log(`[판별]${isInside ? '내부' : '외부'}, 좌표:`,clickPoint.geometry.coordinates);

							if(isInside){
								dist = 0;
								isSelectable = true;
							} else {
								const exploded = turf.explode(turfFeature);
								const nearest = turf.nearestPoint(clickPoint, exploded);
								dist = turf.distance(clickPoint, nearest, {units:'meters'});

								isSelectable = dist <= lineThreshold;
							}

							break;
							}
						}

        				//console.log(`[거리계산] 타입 : ${geom.type}, 거리:${dist.toFixed(3)}m`);

        				if(isSelectable && dist < minDistance){
        					minDistance = dist;
        					nearestFeature = f;
        				}
        			}

        			if(nearestFeature) {
        				filtered = [nearestFeature];
        				//console.log(`[gis]선택된 feature(거리 ${minDistance.toFixed(3)}m): `,nearestFeature);
        			} else {
        				//console.log('[gis]선택된 feature 없음 (모든 거리 > threshold)');
        			}

        		} else {
        			//영역 기반: 교차하는 모든 피처
        			filtered = turfFeatures.filter(f => turf.booleanIntersects(turfPolygon, f));
        		}

        		if(matchedLayer){
        			const props = matchedLayer.getProperties();
        			const minZoom = props.minZoom ?? 0;
        			const maxZoom = props.maxZoom ?? 20;

        			filtered.forEach(f => {
        				f.properties.minZoom = minZoom;
        				f.properties.maxZoom = maxZoom;
        			})
        		}

        		allFiltered.push(...filtered);
        	}
        	//구성(db조회)
 /*
           const bulLayerParams = getBulLayerParams(turfPolygon);

        	for(const {layrNm, mgmtvalue, mtsostatvalue, mtsotypalue, bboxParam} of bulLayerParams){

        		try{
        			const geojson = await getGeoFeaturesFromBulLayer({mgmtvalue, mtsostatvalue, mtsotypalue, bboxParam});

        			const turfFeatures = convertToGeoJSONFeatures(geojson.LayerList);

            		//교차판단
            		const filtered = turfFeatures.filter(f => turf.booleanIntersects(turfPolygon, f));

            		//레이어정보 조회
            		const zoom = Math.floor(L.GeoMap().map.getView().getZoom());
            		const matchedLayer = findCustomLayerByName(layrNm.layer);

            		if(matchedLayer){
            			const props = matchedLayer.getProperties();
            			const minZoom = (props.minZoom - 1) ?? 0;
            			const maxZoom = props.maxZoom ?? 20;

            			filtered.forEach(f => {
            				f.properties.minZoom = minZoom;
            				f.properties.maxZoom = maxZoom;
            				f.properties.mgmtvalue = mgmtvalue;
            				f.properties.mtsostatvalue = mtsostatvalue;
            			})
            		}

            		allFiltered.push(...filtered);

        		} catch(e){
        			console.log('error loop : ' + mgmtvalue, mtsostatvalue, mtsotypalue, bboxParam, e);
        		}
*/

        	//지도표시
    		const olFeatures = format.readFeatures({
    			type: 'FeatureCollection',
    			features: allFiltered
    		},{
    			dataProjection: 'EPSG:4326',
    			featureProjection: 'EPSG:5179'
    		});

    		olFeatures.forEach((f, i) => {
    			const raw = allFiltered[i].properties;
    			f.set('minZoom',raw.minZoom);
    			f.set('maxZoom',raw.maxZoom);
    		});

        	//구성(피처에서 바로 조회)
        	const layerNameMap = {
           			'SKT_전송실': {
        	    	    	layer : "SKT_TMOF_LAYER"
           			},
           	    	'SKT_중심국': {
        	    	    	layer : "SKT_COFC_LAYER"
           	    	},
           	    	'SKT_기지국': {
        	    	    	layer : "SKT_BMTSO_LAYER"
           	    	},
           	    	'SKT_국소': {
        	    	    	layer : "SKT_SMTSO_LAYER"
           	    	},
           	    	'SKB_정보센터': {
        	    	    	layer : "SKB_INF_CNTR_LAYER"
           	    	},
           	    	'SKB_국사': {
        	    	    	layer : "SKB_MTSO_LAYER"
           	    	},
           	    	'SKB_국소': {
        	    	    	layer : "SKB_SMTSO_LAYER"
           	    	},
           		}
        	   let bulFiltered = [];
        	   let bulLayerName = [];

        	   $('#div_tree_layer .Checkbox[data-checktype="layer"]:checked').filter((_, el) => $(el).data('group')?.includes('구성')).each((_, el) => {
        	   		const $el = $(el);
    	   			const group = $(el).data('group');
    	   			if(group === '구성_조회옵션') return;
    	   			const groupName = $(el).data('group')?.split('_')[1] + '_' + $(el).data('layrnm');
    	   			bulLayerName.push(layerNameMap[groupName].layer);
        	   });

        	   bulLayerName.forEach(layerName => {
        		   const layer = L.GeoMap()._customlayers[layerName];
        		   if(!layer) return;

        		   const source = layer.getSource?.();
    			   if(!source || typeof source.getFeatures !== 'function') return;

    			   const features = source.getFeatures();
    			   const minZoom = layer.get('minZoom') ?? 0;
    			   const maxZoom = layer.get('maxZoom') ?? 0;

    			   features.forEach(feature => {

    	        	   if(feature.get('isDummy')) return;

    				   const geometry = feature.getGeometry();
    				   if(!geometry) return;

    				   const geojsonGeom = format.writeGeometryObject(geometry,{
    					   featureProjection: 'EPSG:5179',
    					   dataProjection: 'EPSG:4326'
    				   });

    				   const turfFeature ={
    						   type:'Feature',
    						   geometry:geojsonGeom,
    						   properties:[]
    				   };
    				   let isSelectable = false;

    				   if(isPointSelect && clickPoint){
    	        			let dist = Infinity;

	        				switch (geojsonGeom.type) {
							case 'Point':
								dist = turf.distance(clickPoint, turfFeature, {units:'meters'});

								//픽셀 기준 거리 허용
								const featureCoord = geojsonGeom.coordinates;
								const coord5179 = ol.proj.transform(featureCoord, 'EPSG:4326', 'EPSG:5179');
								const featurePixel = L.GeoMap().map.getPixelFromCoordinate(coord5179);
								const dx = clickPixel[0] - featurePixel[0];
								const dy = clickPixel[1] - featurePixel[1];
								const pixelDist = Math.sqrt(dx * dx + dy * dy);

								isSelectable = pixelDist <= 12;
								break;

							case 'LineString':
							case 'MultiLineString': {
								const nearest = turf.nearestPointOnLine(turfFeature, clickPoint, {units:'meters'});
								dist = turf.distance(clickPoint, nearest, {units:'meters'});

								isSelectable = dist <= lineThreshold;
								break;
								}

							case 'Polygon':
							case 'MultiPolygon':{

								const isInside = turf.booleanPointInPolygon(clickPoint, turfFeature);

								if(isInside){
									dist = 0;
									isSelectable = true;
								} else {
									const exploded = turf.explode(turfFeature);
									const nearest = turf.nearestPoint(clickPoint, exploded);
									dist = turf.distance(clickPoint, nearest, {units:'meters'});

									isSelectable = dist <= lineThreshold;
								}
								break;
								}
							}

    	        		} else {
    	        			//영역 기반: 교차하는 모든 피처
    	        			isSelectable = turf.booleanIntersects(turfPolygon, turfFeature);
    	        		}

    				   if(isSelectable){
    					   const props = {
    							   ...(feature.get('properties') ?? {}),
    							   minZoom,
    							   maxZoom,
    							   layerName
    					   };
    					   Object.entries(props).forEach(([key,value]) => {
    						   feature.set(key, value);
    					   });

    					   bulFiltered.push(feature);
    				   }
    			   });
        	   });

        	   bulFiltered.forEach(f => {
        		   const cloned = f.clone();

        		   cloned.setStyle(null);
        		   const props = f.getProperties();
        		   cloned.setProperties(props);
        		   cloned.set('minZoom',f.get('minZoom'));
        		   cloned.set('maxZoom',f.get('maxZoom'));

        		   olFeatures.push(cloned);
        	   });

        	   //클릭 선택일경우 : 가장 가까운 1개만 남김
        	   if(isPointSelect && clickPoint && olFeatures.length > 1){
        		   let minDist = Infinity;
        		   let selectedFeature = null;

        		   olFeatures.forEach(f => {
        			   const geom = f.getGeometry();
        			   const geojsonGeom = format.writeGeometryObject(geom,{
    					   featureProjection: 'EPSG:5179',
    					   dataProjection: 'EPSG:4326'
    				   });

        			   const turfFeature = {
        					   type:'Feature',
        					   geometry:geojsonGeom,
        					   properties:{}
        			   };

        			   let dist = Infinity;

       				   switch (geojsonGeom.type) {
					   case 'Point':
							dist = turf.distance(clickPoint, turfFeature, {units:'meters'});
							break;

						case 'LineString':
						case 'MultiLineString': {
							const nearest = turf.nearestPointOnLine(turfFeature, clickPoint, {units:'meters'});
							dist = turf.distance(clickPoint, nearest, {units:'meters'});
							break;
							}

						case 'Polygon':
						case 'MultiPolygon':{
							const exploded = turf.explode(turfFeature);
							const nearest = turf.nearestPoint(clickPoint, exploded);
							dist = turf.distance(clickPoint, nearest, {units:'meters'});
							break;
							}
						}

       				   if(dist < minDist){
       					   minDist = dist;
       					   selectedFeature = f;
       				   }
        		   });

        		   //가장까운 피처만 남김
        		   olFeatures.length = 0;
        		   if(selectedFeature) olFeatures.push(selectedFeature);
        	   }

        	   L.SelectLayer.getInstance().setSelectFeatures(olFeatures,true);
        	   return olFeatures;
		}

    	setSelector(type){
    		if(this.currentDraw){
    			this.map.removeInteraction(this.currentDraw);
    			this.source.clear();
    			this.currentDraw = null;
    		}

    		const options = {
    			stroke:true,
    			color:'#38f',
    			weight:2,
    			opacity:0.8,
    			fill:true,
    			fillColor:'white',
    			fillOpacity:0.5,
    			dashArray:'3,4'
    		};

    		const drawStyle =  new ol.style.Style({
				stroke: options.stroke !== false ?
					new ol.style.Stroke({
					color:toRGBA(options.color ?? '#000000', options.opacity ?? 1),
					width: options.weight ?? 1,
					lineDash: options.dashArray?.split(',').map(Number) ?? undefined
				}) : null,
				fill: options.fill !== false ? new ol.style.Fill({color:'rgba(0,0,0,0.1)'}) : null,
				image: new ol.style.Circle({
					radius:0,
					fill: new ol.style.Fill({color:'rgba(0,0,0,0)'}),
					stroke:null
				})
			});

    		const drawTypeMap = {
				rect: 'Circle',
				circle:'Circle',
				poly:'Polygon'
    		};

    		const shiftKeyOnly = (event) =>{
    			return ol.events.condition.primaryAction(event) && event.originalEvent.shiftKey;
    		}

    		const drawOptions = {
    			source:this.source,
    			type:drawTypeMap[type],
    			condition: shiftKeyOnly,
    			style:drawStyle
    		};

    		if(type === 'rect'){
    			drawOptions.geometryFunction = ol.interaction.Draw.createBox();
    		}

    		const draw = new ol.interaction.Draw(drawOptions);
    		this.currentDraw = draw;
    		this.type = type;
    		const that = this;



    		L.GeoMap().map.on('singleclick', async (evt) => {

    			const markerSource = window.mtsoInfLayer.getSource();
    			markerSource.getFeatures().forEach(f => {
    				if(f.get('isMarker')){
    					markerSource.removeFeature(f);
    				}
    			});

    			window.PopupManager.hide();

    			this.source.clear();
    			const coordinate = L.GeoMap().map.getCoordinateFromPixel(evt.pixel); //EPSG:5179
    			const coord4326 = ol.proj.transform(coordinate, 'EPSG:5179', 'EPSG:4326');
    			const clickPoint = turf.point(coord4326);

    			const point = new ol.geom.Point(coordinate);
    			const resolution = L.GeoMap().map.getView().getResolution();
    			const pixelBuffer = 10;
    			const bufferMeters = resolution * pixelBuffer;

    			const turfBuffer = turf.buffer(turf.point(coord4326), bufferMeters, {units:'meters'});

    			const reader = new ol.format.GeoJSON();
    			const geometry = reader.readGeometry(turfBuffer.geometry,{
    				dataProjection: 'EPSG:4326',
    				featureProjection: 'EPSG:5179'
    			});

    			const features = await this.handleSelectFromGeometry({
    				geometry,
    				isPointSelect:true,
    				clickCoord:coordinate,
    				clickPoint,
    				clickPixel:evt.pixel
    			});

    			if(L.GeoMap().map.hasListener('mg-selected-features')){
    				L.GeoMap().map.dispatchEvent({
    					type: 'mg-selected-features',
    					features,
    					orginalEvent: evt
    				});
    			}
    		});

    		draw.on('drawend',async (e) => {
    			const geometry = e.feature.getGeometry();
    			this.source.clear();
    			setTimeout(() => this.source.removeFeature(e.feature),0);
    			await this.handleSelectFromGeometry({geometry});
    		});

    		this.map.addInteraction(draw);
    	}
    }

    function findLayerByAlias(alias, zoom){
    	let targetAlias = alias;
    	let searchLayers = [
    		...L.GeoMap()._vectorInfoLayers,
    		...L.GeoMap()._vectorLayers
    	];

    	if(zoom < 13){
    		const rasterAlias = alias + '_RASTERGROUP';
    		const tileAlias= alias + '_RASTER';

    		if(L.GeoMap()._rasterLayers.some(l => l.getProperties().alias === rasterAlias)){
    			targetAlias = rasterAlias;
    			searchLayers = [...L.GeoMap()._rasterLayers];
    		} else if(L.GeoMap()._tileLayers.some(l => l.getProperties().alias === tileAlias)){
    			targetAlias = tileAlias;
    			searchLayers = [...L.GeoMap()._tileLayers];
    		} else {
    			return null;
    		}
    	}

    	return searchLayers.find(layer => layer.getProperties().alias === targetAlias);
    }

    function findCustomLayerByName(name){
    	let targetName = name;
    	let searchLayers = L.GeoMap()._customlayers;

    	return searchLayers[name] || null;
    }

    function getBulLayerParams(turfPolygon){
    	const bulLayerParams =[];
    	const extent = turf.bbox(turfPolygon);
    	const bboxParam = extent.join(',');
    	let layrNm = '';
    	let alias = '';
    	const mtsotypalueMap = {
    		'SKT_전송실' : ['1'],
    		'SKT_중심국' : ['2'],
    		'SKT_기지국' : ['3'],
    		'SKT_국소' : ['4'],
    		'SKB_정보센터' : ['1'],
    		'SKB_국사' : ['2'],
    		'SKB_국소' : ['4'],
    	};

    	const layerNameMap = {
    			'SKT_전송실': {
	    	    	layer : "SKT_TMOF_LAYER",
	    	    	Label : "SKT_TMOF_LAYER_LABEL"
    			},
    	    	'SKT_중심국': {
	    	    	layer : "SKT_COFC_LAYER",
	    	    	Label : "SKT_COFC_LAYER_LABEL"
    	    	},
    	    	'SKT_기지국': {
	    	    	layer : "SKT_BMTSO_LAYER",
	    	    	Label : "SKT_BMTSO_LAYER_LABEL"
    	    	},
    	    	'SKT_국소': {
	    	    	layer : "SKT_SMTSO_LAYER",
	    	    	Label : "SKT_SMTSO_LAYER_LABEL",
    	    	},
    	    	'SKB_정보센터': {
	    	    	layer : "SKB_INF_CNTR_LAYER",
	    	    	Label : "SKB_INF_CNTR_LAYER_LABEL"
    	    	},
    	    	'SKB_국사': {
	    	    	layer : "SKB_MTSO_LAYER",
	    	    	Label : "SKB_MTSO_LABEL_LAYER_LABEL"
    	    	},
    	    	'SKB_국소': {
	    	    	layer : "SKB_SMTSO_LAYER",
	    	    	Label : "SKB_SMTSO_LABEL_LABEL"
    	    	},
    	}


		const mtsostatvalue = [];
		$('#div_tree_layer .Checkbox[data-group="구성_조회옵션"]:checked').each((_, el) => {
			const optName = $(el).data('layrnm');
			if(optName === '운영국사') mtsostatvalue.push('01');
    		if(optName === '대기국사') mtsostatvalue.push('02');
		});

		$('#div_tree_layer .Checkbox[data-checktype="layer"]:checked').filter((_, el) => $(el).data('group')?.includes('구성')).each((_, el) => {
    		const $el = $(el);
    		const childLayers = $(el).closest('li').find('input[data-checktype="layer"]:checked');
    		childLayers.each((_,child) => {
    			const group = $(child).data('group');
    			if(group === '구성_조회옵션') return;

    			const groupName = $(child).data('group')?.split('_')[1] + '_' + $(child).data('layrnm');

    			bulLayerParams.push({
    				layrNm:layerNameMap[groupName].layer,
    				LabelLayrNm:layerNameMap[groupName].Label,
    				mtsotypalue:(mtsotypalueMap[groupName] || []).join(','),
    				mtsostatvalue:mtsostatvalue.join(','),
        			mgmtvalue:$(child).data('group')?.split('_')[1],
        			bboxParam
        		});
    		});
    	});
    	return bulLayerParams;
    }

    async function getGeoFeaturesFromBulLayer({mgmtvalue, mtsostatvalue, mtsotypalue, bboxParam}){
    	const [minLng, minLat, maxLng, maxLat] = bboxParam.split(',').map(Number);

    	const param = {
    			maplat_start : minLat,
    			maplat_end : maxLat,
    			maplng_start : minLng,
    			maplng_end : minLat,
    			mtsostatvalue,
    			mgmtvalue,
    			mtsotypalue
    			//mgmtvalue: SKT
                //mtsostatvalue: 01
                //mtsotypalue: 2
    	};

    	const geojson = await httpRequestPromise('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET');

    	return geojson;
    }

   function httpRequestPromise(url, param, method='GET',flag=null){
	   return new Promise((resolve, reject) => {
		   Tango.ajax({
			   url,
			   data:param,
			   method,
			   flag
		   }).done(resolve).fail(reject);
	   });
   }

   function convertToGeoJSONFeatures(layerList, options = {}){
	   return layerList.map(item => {
		   const lat = parseFloat(item.mtsoLatVal);
		   const lng = parseFloat(item.mtsoLngVal);

		   return {
			   type:'Feature',
			   geometry:{
				   type:'Point',
				   coordinates:[lng,lat]
			   },
			   properties:{
				   ...item,
				   ...options
			   }
		   };
	   });
   }

   class SimpleTrail {
	   constructor(map, options = {}) {
		   this.map = map;
		   this.options = options;
		   this.points = [];
		   this.source = new ol.source.Vector();
		   this.layer = new ol.layer.Vector({
			   source: this.source,
		   });

		   this.map.addLayer(this.layer);

		   this._lineFeature = null;
		   this._previewLineFeature = null;
		   this._pointFeatures = [];
		   this._lastPointCoord = null;
		   this._ctrlPressed = false;
		   this._hasStarted = false;

		   this._onKeyDown = this._onKeyDown.bind(this);
		   this._onKeyUp = this._onKeyUp.bind(this);
		   this._onMapClick = this._onMapClick.bind(this);
		   this._onMouseMove = this._onMouseMove.bind(this);

		   //window.addEventListener('keydown',this._onKeyDown);
		   //window.addEventListener('keyup',this._onKeyUp);
		   this.map.on('click',this._onMapClick);
		   this.map.on('pointermove',this._onMouseMove);
	   }

	   enable(){
		   this.reset();
		   this._ctrlPressed = false;
		   this._hasStarted = true;
		   this.points = [];
	   }

	   _onKeyDown(e){
		   if(e.key === 'Control') this._ctrlPressed = true;
		   if(e.key === 'Escape') this.reset();
	   }

	   _onKeyUp(e){
		   if(e.key === 'Control') this._ctrlPressed = false;
	   }

	   _onMapClick(e){

		  const coord = e.coordinate;
		  const lastCoord = this.points[this.points.length - 1];

		  //마지막점 다시 클릭 -> 종료
		  if(this._hasStarted && lastCoord && this._isClickNear(coord, lastCoord)){
			  this._handleFinish();
			  return;
		  }

		  //중복 점 생성방지
		  if(this._isClickInsideExistingPoint(coord)){
			  console.log('기존점클릭 무시');
			  return;
		  }

		  //최초 시작 조건 ctrl 필요
		  if(!this._ctrlPressed && !this._hasStarted) return;

		   this._hasStarted = true;
		   this.points.push(coord);
		   this._lastPointCoord = coord;

		   const style = this.options.style || {};
		   const color = style.color || 'red';
		   const weight = style.weight || 2;
		   const dash = style.dashArray ? (typeof style.dashArray === 'string' ? style.dashArray.split(',').map(Number) : style.dashArray) : undefined;

		   //점추가
		   const pointFeature =  new ol.Feature({
			   geometry : new ol.geom.Point(coord)
		   });
		   pointFeature.setStyle(new ol.style.Style({
			   image: new ol.style.Circle({
				   radius:7,
				   fill: new ol.style.Fill({color:'red'}),
				   stroke: new ol.style.Stroke({color:'white', width: 1})
			   })
		   }));
		   this.source.addFeature(pointFeature);
		   this._pointFeatures.push(pointFeature);

		   //실제 선 갱신
		   if(this.points.length > 1){
			   if(!this._lineFeature){
				   this._lineFeature = new ol.Feature(new ol.geom.LineString(this.points));
				   this._lineFeature.setStyle(new ol.style.Style({
					   stroke: new ol.style.Stroke({color, width:weight, lineDash:dash || [4,4]})
				   }));
				   this.source.addFeature(this._lineFeature);
			   }else{
				   this._lineFeature.getGeometry().setCoordinates(this.points);
			   }
		   }

		   //가이드 선 제거
		   if(this._previewLineFeature){
			   this.source.removeFeature(this._previewLineFeature);
			   this._previewLineFeature = null;
		   }
	   }

	   _isClickInsideExistingPoint(newCoord, tolerancePx = 6){
		   return this.points.some(existingCoord => {
			   const px1 = this.map.getPixelFromCoordinate(newCoord);
			   const px2 = this.map.getPixelFromCoordinate(existingCoord);

			   const dx = px1[0] - px2[0];
			   const dy = px1[1] - px2[1];
			   const distance = Math.sqrt(dx * dx + dy * dy);

			   return distance < tolerancePx;
		   });
	   }

	   _isClickNear(c1,c2,tolerance = 6){
		   const px1 = this.map.getPixelFromCoordinate(c1);
		   const px2 = this.map.getPixelFromCoordinate(c2);
		   const dx = px1[0] - px2[0];
		   const dy = px1[1] - px2[1];
		   return Math.sqrt(dx * dx + dy * dy) < tolerance;
	   }

	   _handleFinish(){
		   if(this._previewLineFeature){
			   this.source.removeFeature(this._previewLineFeature);
			   this._previewLineFeature = null;
		   }

		   this._pointFeatures.forEach(f => this.source.removeFeature(f));
		   this._pointFeatures = [];

		   if(this.options.repeatMode !== false){
			   this.points = [];
			   this._lineFeature = null;
			   this._previewLineFeature = null;
			   this._lastPointCoord = null;
			   this._hasStarted = true;
		   } else {
			   this._hasStarted = false;
			   this._ctrlPressed = false;
			   console.log('선종료');
		   }
	   }

	   _onMouseMove(e){
		   //그리기 시작한 상태여야하고 최소 한점이 존재
		   if(!this._hasStarted || this.points.length === 0) return;

		   const last = this.points[this.points.length - 1];
		   const current = e.coordinate;
		   const coords = [last, current];

		   const style = this.options.style || {};
		   const color = style.color || 'red';
		   const weight = style.weight || 2;
		   const dash = style.dashArray ? (typeof style.dashArray === 'string' ? style.dashArray.split(',').map(Number) : style.dashArray) : undefined;


		   if(!this._previewLineFeature){
			   this._previewLineFeature = new ol.Feature(new ol.geom.LineString(coords));
			   this._previewLineFeature.setStyle(new ol.style.Style({
				   stroke: new ol.style.Stroke({color, width: weight, lineDash:dash || [4,4]})
			   }));
			   this.source.addFeature(this._previewLineFeature);
		   }else{
			   this._previewLineFeature.getGeometry().setCoordinates(coords);
		   }

	   }

	   reset(){
		   this.points = [];
		   this.source.clear();
		   this._lineFeature = null;
		   this._previewLineFeature = null;
		   this._pointFeatures = [];
		   this._lastPointCoord = null;
		   this._hasStarted = false;
		   this._ctrlPressed = false;
	   }

	   disable() {
		 this.reset();
		 this.map.removeLayer(this.layer);
		 window.removeEventListener('keydown',this._onKeyDown);
		 window.removeEventListener('keyup',this._onKeyUp);
		 this.map.un('click',this._onMapClick);
		 this.map.un('pointermove',this._onMouseMove);
	   }

	   getTrailCoordinates(){
		   return this.source.getFeatures().map(f => f.getGeometry().getCoordinates());
	   }

   }

   class TrailManager {
	   constructor(map) {
		   if(TrailManager._instance) return TrailManager._instance;

		   this.map = map;
		   this.currentTrail = null;
		   this.mode = null;
		   TrailManager._instance = this;
	   }

	   static getInstance() {
		   return TrailManager._instance;
	   }

	   getMode(){
		   return this.mode;
	   }

	   setMode(mode, options = {}) {
		   if(this.currentTrail){
			   this.currentTrail.disable();
			   this.currentTrail = null;
			   this.mode = null;
		   }

		   if(mode === 'select'){
			   return;
		   }

		   const allowedModes = ['trail-simple','trail-distance','trail-area','trail-draw','trail-edit','area-draw'];

		   if(!allowedModes.includes(mode)){
			   console.warn('지원하지 않는 모드 : ',mode)
			   return;
		   }

		   this.mode = mode;

		   if(mode === 'trail-simple'){
			   this.currentTrail = new SimpleTrail(this.map, options);
			   this.currentTrail.enable();
		   } else if(mode === 'trail-distance'){
			   this.currentTrail = new TrailMeasure(this.map, {type:'distance'});
			   this.currentTrail.enable();
		   } else if(mode === 'trail-area'){
			   this.currentTrail = new TrailMeasure(this.map, {type:'area'});
			   this.currentTrail.enable();
		   } else if(mode === 'trail-draw'){
			   this.currentTrail = new DrawSnapTrail(this.map,{
				   geomType: options.geomType || 'LineString',
				   repeatMode: options.repeatMode || false,
				   onDrawCreated: typeof options.onDrawCreated === 'function' ? options.onDrawCreated : ({feature}) => {console.log('입력완료:',feature);},
				   onEditEnd: typeof options.onEditEnd === 'function' ? options.onEditEnd : ({feature}) => {console.log('수정완료:',feature);},
				   style: options.style,
			   });
			   this.currentTrail.enable();
		   } else if(mode === 'trail-edit'){
			   this.currentTrail = EditSnapTrail.getInstance(this.map, options);
			   this.currentTrail.enable();
		   } else if(mode === 'area-draw'){
			   this.currentTrail = new FeatureDraw(this.map);
			   this.currentTrail.setDraw(options.type || FeatureDraw.TYPE.RECT, {
				   style: options.style,
				   onDrawEnd: typeof options.onDrawEnd === 'function' ? options.onDrawEnd : (e) => {console.log('그리기완료:',e);
				   },
			   });
			   this.currentTrail.enable();
		   }

	   }

	   clear() {
		   if(this.currentTrail){
			   this.currentTrail.disable();
			   this.currentTrail = null;
			   this.mode = null;
		   }
	   }

	   getFeatures() {
		   return this.currentTrail ? this.currentTrail.getFeatures() : [];
	   }

	   getTrailCoordinates() {
		   return this.currentTrail ? this.currentTrail.getTrailCoordinates() : [];
	   }
   }

   class TrailMeasure {
	   constructor(map, options = {}){
		   this.map = map;
		   this.type = options.type || 'distance';
		   this.vectorSource = new ol.source.Vector();
		   this.vectorLayer = new ol.layer.Vector({
			   source: this.vectorSource,
			   style: (feature) => {
				   const geom = feature.getGeometry();
				   const type = geom.getType();

				   if(type === 'Polygon'){
					   return new ol.style.Style({
						   stroke: new ol.style.Stroke({
							   color:'#3366FF',
							   width:2
						   }),
						   fill: new ol.style.Fill({color:'rgba(51,102,255,0.3)'}),
						   image: new ol.style.Circle({
							   radius: 5,
							   fill: new ol.style.Fill({color:'red'}),
							   stroke: new ol.style.Stroke({color:'white', width:1})
						   })
					   });
				   }
				   //기본 linestring 스타일
				   return new ol.style.Style({
					   stroke: new ol.style.Stroke({
						   color:'red',
						   width:2
					   }),
					   image: new ol.style.Circle({
						   radius: 5,
						   fill: new ol.style.Fill({color:'red'}),
						   stroke: new ol.style.Stroke({color:'white', width:1})
					   })
				   });
			   }
		   });
		   this._onDrawStart = this._onDrawStart.bind(this);
		   this._onDrawEnd = this._onDrawEnd.bind(this);

		   this.draw = null;
		   this.overlays = [];
		   this._totalDistance = 0;
		   this._clickHandler = null;
		   this._clickedCoords = [];
	   }

	   enable(){

		   if(!this.vectorSource){
			   this.vectorSource = new ol.source.Vector();
		   }

		   const geometryType = this.type === 'distance' ? 'LineString' : 'Polygon';
		   let drawStyle;

		   if(geometryType === 'LineString'){
			   const sketchStyleFunc = (feature) => {
				   const geometry = feature.getGeometry();
				   if(!geometry || geometry.getType() !== 'LineString') return null;

				   const coords = feature.getGeometry().getCoordinates();
				   if(!Array.isArray(coords) || coords.length < 2) return null;

					const styles = [];

					//실선 점과 점사이
					if(coords.length >= 3){
						for(let i = 1; i < coords.length - 1; i++){
							if(Array.isArray(coords[i-1]) && Array.isArray(coords[i])){
								styles.push(new ol.style.Style({
									stroke: new ol.style.Stroke({
										color:'red',
										width:2,
									}),
									geometry: new ol.geom.LineString([coords[i-1], coords[i]])
								}));
							}
						}
					}

					if(Array.isArray(coords[coords.length - 2]) && Array.isArray(coords[coords.length - 1])){
						styles.push(new ol.style.Style({
						   stroke: new ol.style.Stroke({
							   color:'red',
							   width:2,
							   lineDash: [8,4]
						   }),
						   geometry: new ol.geom.LineString([coords[coords.length - 2], coords[coords.length - 1]])
					    }));
					}
					return styles;
			   };

			   this.draw = new ol.interaction.Draw({
				   source: this.vectorSource,
				   type: geometryType,
				   style:sketchStyleFunc
			   });

		   } else if(geometryType === 'Polygon'){
			   const drawStyle = new ol.style.Style({
				   stroke: new ol.style.Stroke({
					   color:'#3366FF',
					   width:2
				   }),
				   fill: new ol.style.Fill({
					   color: 'rgba(51,102,255,0.3)'
				   }),
				   image: new ol.style.Circle({
					   radius: 5,
					   fill: new ol.style.Fill({color:'red'})
				   })
			   });

			   this.draw = new ol.interaction.Draw({
				   source: this.vectorSource,
				   type: geometryType,
				   style: drawStyle
			   });
		   }

		   this.draw.on('drawstart', this._onDrawStart);
		   this.draw.on('drawend', this._onDrawEnd);
		   this.map.addInteraction(this.draw);

		   const layers = this.map.getLayers().getArray();

		   if(!layers.includes(this.vectorLayer)){
			   this.map.addLayer(this.vectorLayer);
		   }


	   }

	   disable(){
		   if(this.draw){
			   this.draw.un('drawstart', this._onDrawStart);
			   this.draw.un('drawend', this._onDrawEnd);
			   this.map.removeInteraction(this.draw);
			   this.draw = null;
		   }

		   this.clear();

		   if(this.map.getLayers().getArray().includes(this.vectorLayer)) {
			   this.map.removeLayer(this.vectorLayer);
		   }
		   this.vectorSource = null;

		   this.clearOverlays();
		   this._removeClickHandler();
		   this._clickedCoords = [];
		   this._totalDistance = 0;
	   }

	   clear(){
		   this.vectorSource?.clear();
		   this.clearOverlays();
		   this._totalDistance = 0;
		   this._clickedCoords = [];

		   if(this.map.getLayers().getArray().includes(this.vectorLayer)){
			   this.map.removeLayer(this.vectorLayer);
		   }
	   }

	   clearOverlays(){
		   this.overlays.forEach(ov => this.map.removeOverlay(ov));
		   this.overlays = [];
	   }

	   _onDrawStart(event){
		   //if(this.type !== 'distance') return;

		   const feature = event.feature;
		   this._clickedCoords = [];

		   this._clickHandler =  (evt) => {
			   const coord = evt.coordinate;

			   //점 피처 추가(linestring,polygon 공통)
			   const pointFeature = new ol.Feature(new ol.geom.Point(coord));
			   this.vectorSource.addFeature(pointFeature);

			   if(this.type === 'distance' && this._clickedCoords.length === 0){
				   //시작점
				   const startLabel = this._createLabel('시작', coord);
				   this.map.addOverlay(startLabel);
				   this.overlays.push(startLabel);
			   }

			   if(this.type === 'distance' && this._clickedCoords.length > 0 ){
				   //거리 계산
				   const prev = this._clickedCoords[this._clickedCoords.length - 1];
				   const segment = new ol.geom.LineString([prev, coord]);
				   const segmentDist = ol.sphere.getLength(segment);

				   if(segmentDist > 1) {
					   this._totalDistance += segmentDist;
					   const label = this._createLabel(`구간거리 ${Math.round(segmentDist)}m<br>총거리 ${Math.round(this._totalDistance)}m`, coord);
					   this.map.addOverlay(label);
					   this.overlays.push(label);
				   }
			   }

			   this._clickedCoords.push(coord);
		   };

		   this.map.on('singleclick',this._clickHandler);
	   }

	   _onDrawEnd(event){
		   const feature = event.feature;
		   const geom = feature.getGeometry();
		   const coords = geom.getCoordinates();

		   if(this.type === 'distance'){
			   //마지막 구간 보정
			   if(coords.length >= 2){
				   const p1 = coords[coords.length - 2];
				   const p2 = coords[coords.length - 1];
				   const segment = new ol.geom.LineString([p1, p2]);
				   const segmentDist = ol.sphere.getLength(segment);

				   //보정 라벨이 안나온 경우만
				   if(segmentDist > 1 && this._clickedCoords.length < coords.length){
					   this._totalDistance += segmentDist;
					   const label = this._createLabel(`구간거리 ${Math.round(segmentDist)}m<br>총거리 ${Math.round(this._totalDistance)}m`, p2);
					   this.map.addOverlay(label);
					   this.overlays.push(label);
				   }
			   }
			   this._addActionMarkers(coords[coords.length - 1]);

		   } else if(this.type === 'area'){
			   // 면적모드일때 계산해서 표시
			   const area = Math.round(ol.sphere.getArea(geom));
			   const coords = geom.getCoordinates();
			   const ring = coords[0];
			   const lastcoord = ring[ring.length - 2];

			   const label = this._createLabel(`총면적 <strong>${area.toLocaleString()}㎡</strong>`,lastcoord);
			   this.map.addOverlay(label);
			   this.overlays.push(label);
			   this._addActionMarkers(lastcoord);
		   }

		   this._removeClickHandler();
	   }

	   _removeClickHandler() {
		   if(this._clickHandler){
			   this.map.un('singleclick', this._clickHandler);
			   this._clickHandler = null;
		   }
	   }

	   _createLabel(text, coord){
		   const el = document.createElement('div');
		   el.className = 'trail-label';
		   el.innerHTML = text;

		   const overlay =  new ol.Overlay({
			   element: el,
			   position: coord,
			   positioning: 'bottom-center',
			   offset: [0,-10],
			   stopEvent: false,
			   zIndex: 3000
		   });

		   overlay.getElement().parentElement.style.zIndex = TrailMeasure._zIndexCounter++;
		   overlay.getElement().parentElement.style.pointerEvents = 'none';
		   return overlay;
	   }

	   _addActionMarkers(coord){
		   //버튼 컨테이너
		   const container = document.createElement('div');
		   container.className = 'trail-action-box';

		   //재시작 버튼
		   const restartEl = document.createElement('div');
		   restartEl.className = 'trail-btn trail-restart-btn';
		   restartEl.title = '재시작';
		   restartEl.onclick = () => {
			   this.clear();
			   this.enable();
		   };

		   //닫기 버튼
		   const closeEl = document.createElement('div');
		   closeEl.className = 'trail-btn trail-close-btn';
		   closeEl.title = '닫기';
		   closeEl.onclick = () => {
			   this.disable();
		   };

		   //버튼 컨테이너에 묶기
		   container.appendChild(restartEl);
		   container.appendChild(closeEl);

		   //Overlay 하나로 묶기
		   const controlOverlay = new ol.Overlay({
			   element: container,
			   position: coord,
			   offset: [20,-10],
		   });

		   this.map.addOverlay(controlOverlay);
		   this.overlays.push(controlOverlay);
	   }

	   getFeatures(){
		   return this.vectorSource.getFeatures();
	   }

	   getTrailCoordinates(){
		   return this.vectorSource.getFeatures().map(f => f.getGeometry().getCoordinates());
	   }

   }

   const isLayerVisible = (layer) => {
	 if(!layer.getVisible()) return false;

	 const viewZoom = L.GeoMap().map.getView().getZoom();
	 const minZoom = layer.get('minZoom') ?? -Infinty;
	 const maxZoom = layer.get('maxZoom') ?? Infinity;

	 return viewZoom >= minZoom && viewZoom <= maxZoom;
   };

   class DrawSnapTrail {
	   constructor(map, options){
		   this.map = map;
		   this.options = options;
		   this.source = new ol.source.Vector();
		   this.drawLayer = new ol.layer.Vector({
			   source: this.source,
			   style: (feature) => this.getTrailStyle(feature),
			   properties: {id:'draw-trail-layer'}
		   });
		   this.map.addLayer(this.drawLayer);

		   this.drawInteraction = null;
		   this._feature = null;
		   this._clickCoordMap = new Map();
		   this.geomType = options.geomType || 'LineString';
		   this.repeatMode = options.repeatMode || false;
		   this._keydownHandler = this._onKeyDown.bind(this);

		   this.onDrawCreated = options.onDrawCreated || function () {};

		   this.editTrail = EditSnapTrail.getInstance(this.map, {
			   onEditEnd: options.onEditEnd || function () {}
		   });
	   }

	   enable(){
		   this._addInteractions();
		   document.addEventListener('keydown',this._keydownHandler);
	   }

	   disable(skipEditTrail = false){
		   if(this.drawInteraction) this.map.removeInteraction(this.drawInteraction);
		   document.removeEventListener('keydown',this._keydownHandler);
		   this.map.removeLayer(this.drawLayer);
		   this.source.clear();
		   this.options = null;
		   if(!skipEditTrail && this.editTrail?._enabled){
			   this.editTrail.disable();
		   }
	   }

	   getTrailCoordinates() {
		   if(this.editTrail?.getTrailCoordinates){
			   return this.editTrail.getTrailCoordinates();
		   }
		   return this._feature ? this._feature.getGeometry()?.getCoordinates() ?? [] : [];
	   }

	   getFeatures() {
		   if(this.editTrail?.getFeatures){
			   return this.editTrail.getFeatures();
		   }
		   return this._feature ? [this._feature] : [];
	   }

	   _addInteractions(){
		   this.drawInteraction = new ol.interaction.Draw({
			   source: this.source,
			   type:this.geomType,
			   style: (feature) => this.getTrailStyle(feature)
		   });

		   this.drawInteraction.on('drawstart', (e) => {
			   this._feature = e.feature;
			   const geom = this._feature.getGeometry();
			   const coords = geom.getCoordinates();

			   let points;
			   if(this.geomType === 'Polygon'){
				   points = coords[0];
			   } else if(this.geomType === 'Point'){
				   points = [coords];
			   } else {
				   points = coords;
			   }

			   const key = points[0].join(',');
			   const prevCount = this._clickCoordMap.get(key) || 0;
			   this._clickCoordMap.set(key, prevCount + 1);
		   });

		   this.map.on('singleclick', (evt) => {
			   if(!this._feature) return;

			   const geom = this._feature.getGeometry();
			   if(!geom) return;

			   const clickedCoord = evt.coordinate;
			   const coords = geom.getCoordinates();

			   let points;
			   if(this.geomType === 'Polygon'){
				   points = coords[0];
			   } else if(this.geomType === 'Point'){
				   points = [coords];
			   } else {
				   points = coords;
			   }

			   const key = clickedCoord.join(',');
			   const prevCount = this._clickCoordMap.get(key) || 0;
			   this._clickCoordMap.set(key, prevCount + 1);

			   const realPoints = points.slice(0,-1); //임시점 제외
			   if (realPoints.length < 2) return;

			   const lastCoord = realPoints[realPoints.length - 1]; //확정된 마지막 점

			   const pixel1 = this.map.getPixelFromCoordinate(lastCoord);
			   const pixel2 = this.map.getPixelFromCoordinate(clickedCoord);
			   const dx = Math.abs(pixel1[0] - pixel2[0]);
			   const dy = Math.abs(pixel1[1] - pixel2[1]);
			   const tolerance = 6;

			   if(this._clickCoordMap.size < 2) return;

			   //마지막 점과 비슷하지 않으면 클릭 무시
			   console.log('dx : ' + dx + ' dy : ' + dy + ' tolerance : ' + tolerance + ' prevCount : ' + prevCount);
			   if(dx >= tolerance && dy >= tolerance ) return;

			   //마지막 점 재클릭
			   if(prevCount > 1){
				   console.log('마지막 점 재클릭: 입력종료');
				   this.drawInteraction.finishDrawing();
				   this._clickCoordMap.clear();
			   }

		   });

		   this.drawInteraction.on('drawend', (e) => {

			   const feature = e.feature;
			   const coords = feature.getGeometry().getCoordinates();

			   this._clickCoordMap.clear();

			   this.editTrail.enable();
			   this.editTrail.setFeature(feature);

			   this.onDrawCreated({feature});

			   if(this.repeatMode){
				   setTimeout(() => this._restartDraw(),0);
			   } else {
				   this.disable(true);
			   }
		   });

		   this.map.addInteraction(this.drawInteraction);
	   }

	   _restartDraw(){
		   if(this.drawInteraction) this.map.removeInteraction(this.drawInteraction);
		   this._addInteractions();
	   }

	   _onKeyDown(e){
		   if(e.key === 'Escape'){
			   this.disable();
		   } else if(e.key === 'Enter'){
			   if(this.drawInteraction) this.drawInteraction.finishDrawing();
		   } else if(e.ctrlKey && e.key.toLowerCase() === 'z'){
			   if(this._feature && this._feature.getGeometry() instanceof ol.geom.LineString){
				   const geom = this._feature.getGeometry();
				   const coords = geom.getCoordinates();
				   if(coords.length > 1){
					   coords.pop();
					   geom.setCoordinates(coords);
				   }
			   }
		   }
	   }

	   getTrailStyle(feature){
		   const geometry = feature.getGeometry();
		   const type = geometry.getType();
		   const styles = [];

		   const color = 'red';
		   const fillOpacity = 0.1;

		   if(type === 'Point'){
			   if(this.options.style?.iconUrl){
				   styles.push(new ol.style.Style({
					   image: new ol.style.Icon({
						   src: this.options.style.iconUrl,
						   scale: 1,
						   anchor: this.options.style.iconAnchor || [0.5,0.5],
						   anchorXUnits: 'pixels',
						   anchorYunits: 'pixels'
					   })
				   }));
			   } else {
				   styles.push(new ol.style.Style({
					   image: new ol.style.Circle({
						   radius: 6,
						   fill: new ol.style.Fill({color}),
						   stroke: new ol.style.Stroke({color: 'white', width: 1})
					   }),
				   }));
			   }
		   } else if(type === 'LineString' || type === 'Polygon'){

			   if(this.options.style){
				   styles.push(...convertToOlStyle(this.options.style, type));
			   } else {
				   styles.push(new ol.style.Style({
					   stroke: new ol.style.Stroke({color, width:2}),
					   fill: (type === 'Polygon') ? new ol.style.Fill({color:`rgba(255,0,0,0.2)`}) : undefined
				   }));
			   }

			   const coords = type === 'Polygon' ? geometry.getCoordinates()[0] : geometry.getCoordinates();
			   coords.forEach(coord => {
				   styles.push(new ol.style.Style({
					   geometry: new ol.geom.Point(coord),
					   image: new ol.style.Circle({
						   radius: 6,
						   fill: new ol.style.Fill({color}),
						   stroke: new ol.style.Stroke({color: 'white', width: 1})
					   })
				   }));
			   });
		   }
		   return styles;
	   }
   }

   function getCheckedSnapLayerNames(){
	   const layerNameMap = {
     			'SKT_전송실': {
  	    	    	layer : "SKT_TMOF_LAYER"
     			},
     	    	'SKT_중심국': {
  	    	    	layer : "SKT_COFC_LAYER"
     	    	},
     	    	'SKT_기지국': {
  	    	    	layer : "SKT_BMTSO_LAYER"
     	    	},
     	    	'SKT_국소': {
  	    	    	layer : "SKT_SMTSO_LAYER"
     	    	},
     	    	'SKB_정보센터': {
  	    	    	layer : "SKB_INF_CNTR_LAYER"
     	    	},
     	    	'SKB_국사': {
  	    	    	layer : "SKB_MTSO_LAYER"
     	    	},
     	    	'SKB_국소': {
  	    	    	layer : "SKB_SMTSO_LAYER"
     	    	},
     		};
  	   let bulLayerName = [];

  	   $('#div_tree_layer .Checkbox[data-checktype="layer"]:checked').filter((_, el) => $(el).data('group')?.includes('구성')).each((_, el) => {
  	   		const $el = $(el);
	   			const group = $(el).data('group');
	   			if(group === '구성_조회옵션') return;
	   			const groupName = $(el).data('group')?.split('_')[1] + '_' + $(el).data('layrnm');
	   			bulLayerName.push(layerNameMap[groupName].layer);
  	   });

  	   return bulLayerName;
   }

   function getConfiguredZoomForLayerId(layerId){
	   //zoomcontrol.js와 맞춰야함
	   const zoomConf = {
			   "SKT_TMOF_LAYER" :  "2",
			   "SKT_COFC_LAYER" :  "5",
			   "SKT_BMTSO_LAYER" :  "8",
			   "SKT_SMTSO_LAYER" :  "11",
			   "SKB_INF_CNTR_LAYER" :  "2",
			   "SKB_MTSO_LAYER" :  "13",
			   "SKB_SMTSO_LAYER" :  "14",
			   };

	   for(const varName in zoomConf){
		   if(varName === layerId){
			   return Number(zoomConf[varName]);
		   }
	   }
	   return undefined;
   }

   function isLayerVisibleAtZoom(layerId, layer, currentZoom){
	   const configuredZoom = getConfiguredZoomForLayerId(layerId);
	   if(configuredZoom !== undefined){
		   return currentZoom >= configuredZoom;
	   }

	   const minZoom = layer.get('minZoom') ?? -Infinty;
	   const maxZoom = layer.get('mAXZoom') ?? Infinty;
	   return currentZoom >= minZoom && currentZoom <= maxZoom;
   }

   class EditSnapTrail {
	   static _instance = null;

	   static getInstance(map, options){
		   if(!EditSnapTrail._instance){
			   EditSnapTrail._instance = new EditSnapTrail(map, options);
		   } else {
			   EditSnapTrail._instance.setOptions(options);
		   }
		   return EditSnapTrail._instance;
	   }

	   constructor(map, options){
		   this.map = map;
		   this.options = options;
		   this._enabled = false;
		   EditSnapTrail._instance = this;
		   this.source = new ol.source.Vector();
		   this.snapSource = new ol.source.Vector();
		   this.editLayer = new ol.layer.Vector({
			   source: this.source,
			   style: (feature) => this.getEditTrailStyle(feature),
			   properties: {id:'edit-trail-layer'},
			   zIndex:10000
		   });
		   this.map.addLayer(this.editLayer);

		   this.modifyInteraction = null;
		   this.snapInteraction = null;
		   this.onEditEnd = options?.onEditEnd || function () {};


	   }

	   setOptions(newOptions){
		   this.options = newOptions;
		   this.onEditEnd = newOptions?.onEditEnd || function () {};
	   }

	   enable(){

		   L.SelectLayer.getInstance().clearSelectLayer();

		   if(!this.map.getLayers().getArray().includes(this.editLayer)){
			   this.map.addLayer(this.editLayer);
		   }

		   this._onKeyDown = (e) => {
			   if(e.key === 'Alt'){
				   this.translateInteraction?.setActive(true);
				   this.modifyInteraction?.setActive(false);
			   }
		   };

		   this._onKeyUp = (e) => {
			   if(e.key === 'Alt'){
				   this.translateInteraction?.setActive(false);
				   this.modifyInteraction?.setActive(true);
			   }
		   };

		   document.addEventListener('keydown',this._onKeyDown);
		   document.addEventListener('keyup',this._onKeyUp);


		   if(!this._translateFeatures){
			   this._translateFeatures = new ol.Collection();
		   }

		   if(!this.translateInteraction){
			   this.translateInteraction = new ol.interaction.Translate({
				   features: this._translateFeatures
			   });

			   this.map.addInteraction(this.translateInteraction);
		   }
		   this.translateInteraction.setActive(false);

		   this.modifyInteraction = new ol.interaction.Modify({
			   source:this.source,
			   deleteCondition: (e) => ol.events.condition.singleClick(e),
			   style: () => null
		   });

		   this.snapInteraction = new ol.interaction.Snap({
			   source: this.snapSource
		   });

		   this._loadSnapFeatures();

		   if(this.options?.data?.feature){
			   this.setFeature(this.options.data.feature);
		   }

		   this.modifyInteraction.on('modifyend', (e) => {
			   const feature = e.features.item(0);
			   if(!feature) return;

			   const geom = feature.getGeometry();
			   const coords = geom.getType() === 'Polygon' ? geom.getCoordinates()[0] : geom.getCoordinates();

			   const snapResults = coords.map(coord => ({
				   x:coord[0],
				   y:coord[1],
			       snapped: this._isCoordSnapped(coord)
			   }));

			   feature.set('snapFeatures', snapResults);
			   feature.set('__originalCoords', coords);
			   feature.changed();

			   this.onEditEnd?.({feature});
		   });

		   this.map.on('moveend', this._onMoveEnd);
		   this._enabled = true;
		   this.map.addInteraction(this.modifyInteraction);
		   this.map.addInteraction(this.snapInteraction);


	   }

	   _onMoveEnd = () => {
		   this._loadSnapFeatures();
	   };

	   disable(){

		   document.removeEventListener('keydown',this._onKeyDown);
		   document.removeEventListener('keyup',this._onKeyUp);
		   if(this.translateInteraction) {
			   this.map.removeInteraction(this.translateInteraction);
			   this.translateInteraction = null;
		   }
		   this._translateFeatures = null;

		   if(this.modifyInteraction) {
			   this.map.removeInteraction(this.modifyInteraction);
			   this.modifyInteraction = null;
		   }
		   if(this.snapInteraction) {
			   this.map.removeInteraction(this.snapInteraction);
			   this.snapInteraction = null;
		   }
		   this.map.un('moveend',this._onMoveEnd);
		   this._enabled = false;
		   this.source.clear();
		   this.snapSource.clear();
		   this.map.removeLayer(this.editLayer);
		   this.options = null;
	   }

	   setFeature(feature){
		   const f = (feature instanceof ol.Feature) ? feature : new ol.Feature(feature);
		   this.source.clear();
		   this.source.addFeature(f);

		   const geom = f.getGeometry();
		   const coords = geom.getType() === 'Polygon' ? geom.getCoordinates()[0] : geom.getCoordinates();
		   f.set('__originalCoords',coords);
		   this._updateSnapInfoForFeature(f);

		   this._translateFeatures?.clear();
		   this._translateFeatures?.push(f);
	   }

	   setSnapFeatures(features){

		   const editCoords = this.source.getFeatures().flatMap(f => {
			   const geom = f.getGeometry();
			   return (geom.getType() === 'Polygon') ? geom.getCoordinates()[0] : geom.getCoordinates();
		   });

		   const validFeatures = features.filter(f => {
			   const coords = f.getGeometry()?.getCoordinates();
			   if(!coords) return false;
			   if(Array.isArray(coords[0])){
				   return !coords.some(c => editCoords.some(ec => ec[0] === c[0] && ec[1] === c[1]));
			   }
			   return !editCoords.some(ec => ec[0] === coords[0] && ec[1] === coords[1]);
		   });

		   this.snapSource.clear();
		   this.snapSource.addFeatures(validFeatures);
	   }

	   async _loadSnapFeatures(){
		   //스냅 대상수집
		   const snapFeatures = [];

		   //구성메뉴 레이어
		   const checkedLayerIds = getCheckedSnapLayerNames();
		   for( const layerName of checkedLayerIds){
			   const reloadFn = L.GeoMap()._layerReloadFnMap?.[layerName];
			   reloadFn();
		   }

		   //gis메뉴 레이어
		   const gis = getCheckedLayerAliasByGroup('GIS');
		   const bboxParam = this.map.getView().calculateExtent().join(',');
		   const currentZoom = this.map.getView().getZoom();

		   for(const layerName of gis){
			   const layerNameForMap = currentZoom <= 12 ? layerName + '_RASTER': layerName;

			   const layer = window.mgMap.map.getLayers().getArray().find(l => l.getProperties().alias === layerNameForMap);

			   if(!layer ||
					   !(layer.getVisible() && currentZoom > (layer.getMinZoom?.() ?? -Infinity) && currentZoom <= (layer.getMaxZoom?.() ?? Infinity))
			   ) continue;

				const geojson = await L.GeoMap().getGeoBboxWfsByLayeNm(layerName,bboxParam);
				if(geojson && geojson.features){
					const features = new ol.format.GeoJSON().readFeatures(geojson,{
						featureProjection: 'EPSG:5179',
	            		dataProjection:'EPSG:4326'
					});
					features.forEach(f => f.set('snapped', true));
					snapFeatures.push(...features);
				}
		   }

	       this.setSnapFeatures(snapFeatures);
	   }

	   refreshSnap(map = this.map){
		   this._loadSnapFeatures();
	   }

	   isEditSnapModeActive(){
		   const edit = EditSnapTrail.getInstance();
		   return edit?._enabled === true;
	   }

	   getEditTrailStyle(feature){

		   const options = this.options || {};
		   const geometry = feature.getGeometry();
		   const type = geometry.getType();

		   const isSnapped = feature.getProperties?.()?.snapped === true;
		   const styles = [];

		   if(type === 'Point'){
			   if(options.style?.iconUrl){
				   //아이콘
				   styles.push(new ol.style.Style({
					   image: new ol.style.Icon({
						   src: options.style?.iconUrl,
						   scale: 1,
						   anchor: options.style?.iconAnchor || [0.5,0.5],
						   anchorXUnits: 'fraction',
						   anchorYunits: 'fraction'
					   })
				   }));
			   }
			   styles.push(new ol.style.Style({
				   image: new ol.style.Circle({
					   radius: 6,
					   fill: new ol.style.Fill({color: isSnapped ? 'blue' : 'red'}),
					   stroke: new ol.style.Stroke({color: 'white', width: 1})
				   })
			   }));

			   //Snap 확인용 외곽 원
			   styles.push(new ol.style.Style({
				   geometry,
				   image: new ol.style.Circle({
					   radius:20,
					   fill: new ol.style.Fill({color: isSnapped ? `rgba(0,0,255,0.2)` : `rgba(255,0,0,0.2)`}),
					   stroke: new ol.style.Stroke({color: isSnapped ? 'blue' : 'red', width:2, lineDash:[4,4]})
				   })
			   }));

		   } else if(type === 'LineString' || type === 'Polygon'){

			   const layerId = feature.getProperties().layrid;
			   const weight = L.StyleConfig().getStylesByLayerName(layerId)[0]?.weight;

			   if(weight){
				   styles.push(new ol.style.Style({
					   stroke : new ol.style.Stroke({
						   color: 'rgba(255,0,0,0.5)',
						   width: Math.max(weight * 2, 8),
					   }),
				   }));
			   }

			   if(options.style){
				   styles.push(...convertToOlStyle(options.style, type));
			   } else {
				   styles.push(new ol.style.Style({
					   stroke: new ol.style.Stroke({color : 'red', width:2}),
					   fill: (type === 'Polygon') ? new ol.style.Fill({color: `rgba(255,165,0,0.2)`}) : undefined
				   }));
			   }

			   const coords = type === 'Polygon' ? geometry.getCoordinates()[0] : geometry.getCoordinates();
			   coords.forEach(coord => {
				   styles.push(new ol.style.Style({
					   geometry: new ol.geom.Point(coord),
					   image: new ol.style.Circle({
						   radius: 6,
						   fill: new ol.style.Fill({color : 'red'}),
						   stroke: new ol.style.Stroke({color: 'white', width: 1})
					   })
				   }));
			   });
		   }
		   return styles;
	   }

	   _updateSnapInfoForFeature(feature){
		   const geometry = feature.getGeometry();
		   const coords = geometry.getType() === 'Polygon' ? geometry.getCoordinates()[0] : geometry.getCoordinates();
		   const snapResults = coords.map(coord => ({
			   x:coord[0],
			   y:coord[1],
			   snapped:this._isCoordSnapped(coord)
		   }));

		   feature.set('snapFeatures', snapResults);
		   feature.changed();
	   }

	   _isCoordSnapped(coord5179){
		   const closest = this.snapSource.getClosestFeatureToCoordinate(coord5179);
		   if(!closest) return false;

		   const geometry = closest.getGeometry();
		   const closestPoint5179 = geometry.getClosestPoint(coord5179);

		   if(!closestPoint5179 || closestPoint5179.some(isNaN)) return false;

		   const coord4326 = ol.proj.toLonLat(coord5179);
		   const snapped4326 = ol.proj.toLonLat(closestPoint5179);

		   if(coord4326.some(isNaN) || snapped4326.some(isNaN)) return false;

		   const pt1 = turf.point(coord4326);
		   const pt2 = turf.point(snapped4326);

		   const dist = turf.distance(pt1,pt2,{units:'meters'});

		   return dist < 0.5;
	   }

	   getTrailCoordinates(){
		   const trails = [];
		   const features = this.source.getFeatures();

		   for(const feature of features){
			   const geometry = feature.getGeometry();
			   const coords = geometry.getType() === 'Polygon' ? geometry.getCoordinates(0) : geometry.getCoordinates();

			   const snapFeatures = (feature.get('snapFeatures') || []).filter(f => f.snapped);

			   trails.push({
				   id:feature.getId?.() ?? null,
				   coords,
				   snapFeatures,
				   properties:feature.getProperties()
			   });
		   }

		   return trails;
	   }

	   getFeatures(){
		   return this.source.getFeatures();
	   }

   }

   function applyOpacity(hex, opacity){
	   const rgb = ol.color.asArray(hex);
	   if(!rgb) return hex;
	   return `rgb(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
   }

   function convertToOlStyle(styleOpt, geomType){
	   const styles = [];

	   const strokeColor = styleOpt.color || '#ff0000';
	   const strokeWidth = styleOpt.weight || 2;
	   const strokeOpacity =  styleOpt.opacity ?? 1;
	   const fillColor = styleOpt.fillColor || 'red';
	   const fillOpacity = styleOpt.fillOpacity ?? 0.2;
	   const fill = styleOpt.fill ?? true;
	   const dashArray = styleOpt.dashArray ? styleOpt.dashArray.split(',').map(Number) : undefined;

	   styles.push(new ol.style.Style({
		   stroke: new ol.style.Stroke({
			   color: applyOpacity(strokeColor, strokeOpacity),
			   width: strokeWidth,
			   lineDash: dashArray
		   }),
		   fill: geomType === 'Polygon' && fill ? new ol.style.Fill({color: applyOpacity(fillColor, fillOpacity)}) : undefined
	   }));

	   return styles;
   }

   class FeatureDraw {
	   static _instance = null;

	   static TYPE = {
		   RECT: 'rect',
		   CIRCLE:'circle',
		   POLYGON:'poly',
	   };

	   static getInstance(map, options){
		   if(!FeatureDraw._instance){
			   FeatureDraw._instance = new FeatureDraw(map, options);
		   } else if(options){
			   FeatureDraw._instance.options = options;
		   }
		   return FeatureDraw._instance;
	   }

	   constructor(map, options = {}){
		   if(FeatureDraw._instance) return FeatureDraw._instance;
		   this.map = map;
		   this.options = options;
		   this.activeType = FeatureDraw.TYPE.RECT;
		   this.drawInteraction = null;
		   this.drawSource = null;
		   this.drawLayer = null;
		   this.onDrawEnd = null;
		   FeatureDraw._instance = this;
	   }

	   setDraw(type, options = {}){
		   this.activeType = type;
		   if(this.drawInteraction){
			   this.map.removeInteraction(this.drawInteraction);
			   this.drawInteraction = null;
		   }

		   if(typeof options.onDrawEnd === 'function'){
			   this.onDrawEnd = options.onDrawEnd;
		   }

		   let geometryFunction, maxPoints;
		   let olType = 'Polygon';

		   if(type === FeatureDraw.TYPE.RECT){
			   olType = 'Circle';
			   geometryFunction = ol.interaction.Draw.createBox();
		   } else if(type === FeatureDraw.TYPE.CIRCLE){
			   olType = 'Circle';
		   } else if(type === FeatureDraw.TYPE.POLYGON){
			   olType = 'Polygon';
		   }

		   this.drawInteraction = new ol.interaction.Draw({
			   source: this._getOrCreateDrawSource(),
			   type: olType,
			   geometryFunction,
			   style: this._makeDrawStyle(type,options)
		   });

		   this.drawInteraction.on('drawend', (e) => {
			   if(typeof this.onDrawEnd === 'function'){
				   this.onDrawEnd(e.feature);
			   }
		   });

		   this.map.addInteraction(this.drawInteraction);
	   }

	   moved(){
		   return !!(this.drawInetraction && this.drawInteraction.getActive());
	   }

	   enable(){
		   if(!this.drawInteraction) return;

		   if(!this.map.getInteractions().getArray().includes(this.drawInteraction)){
			   this.mapaddInteraction(this.drawInteraction);
		   }
		   this.drawInteraction.setActive(true);
	   }

	   disable(){
		   if(this.drawInteraction) this.drawInteraction.setActive(false);
	   }

	   remove(){
		   if(this.drawInetraction){
			   this.map.removeInteraction(this.drawInetraction);
			   this.drawInetraction = null;
		   }
	   }

	   _getOrCreateDrawSource(){
		   if(!this.drawSource){
			   this.drawSource = new ol.source.Vector();
			   this.drawLayer = new ol.layer.Vector({
				   source: this.drawSource,
				   style: (feature) => this._makeDrawStyle(this.activeType, this.options),
				   zIndex:9999
			   });
			   this.map.addLayer(this.drawLayer);
		   }
		   return this.drawSource;
	   }

	   _makeDrawStyle(type, opts){
		   const color = opts.color || '#38f';
		   const fillColor = opts.fillColor || 'white';
		   const opacity = opts.opacity || 0.8;
		   const fillOpacity = opts.fillOpacity || 0.5;
		   const dash = opts.dashArray ? opts.dashArray.split(',').map(Number) : [3,4];

		   return new ol.style.Style({
			   stroke: new ol.style.Stroke({
				   color,
				   width: opts.weight || 2,
				   opacity,
				   lineDash: dash
			   }),
			   fill: new ol.style.Fill({
				   color: `rgba(${this._hexToRgb(fillColor)}, ${fillOpacity})`
			   }),
		   });
	   }

	   _hexToRgb(hex){
		   let c = hex.replace('#','');
		   if(c.length === 3) c = c.split('').map(x => x + x).join(',');
		   const num = parseInt(c, 16);
		   return [(num) >> 16 & 255, (num >> 8) & 255, num & 255].join(',');
	   }

	   on(type, cb){
		   if(type === 'drawend') this.onDrawEnd = cb;
	   }

   }

   class FeatureEdit {
	   static _instance = null;

	   static getInstance(map, options = {}){
		   if(!FeatureEdit._instance){
			   FeatureEdit._instance = new FeatureEdit(map, options);
		   } else if(options){
			   FeatureEdit._instance.options = options;
		   }
		   return FeatureEdit._instance;
	   }

	   static TYPE = {
		   RECT : 'rect',
		   CIRCLE: 'circle'
	   };

	   constructor(map, options = {}){
		   if(FeatureEdit._instance) return FeatureEdit._instance;
		   this.map = map;
		   this.options = options;
		   FeatureEdit._instance = this;
		   this.editSource = new ol.source.Vector();
		   this.editLayer = new ol.layer.Vector({
			   source: this.editSource,
			   style: (feature) => this._makeEditStyle(feature),
			   properties: {id:'feature_edit_layer'},
			   zIndex:10010
		   });

		   this.map.addLayer(this.editLayer);

		   this._centerHandle = null;
		   this._cornerHandles = [];
		   this._shapeFeature = null;

		   this._centerTranslate = null;
		   this._cornerTranslates = [];

		   this._editEndCb = null;


	   }

	   setEdit(features = [], options = {}){

		   this.remove();

		   if(!features.length) return;

		   this.options = options;
		   this._shapeFeature = features[0].clone();
		   this.editSource.addFeature(this._shapeFeature);

		   this.map.addLayer(this.editLayer);

		   const geom = this._shapeFeature.getGeometry();

		   //사각형인 경우 좌표 정렬
		   if(geom instanceof ol.geom.Polygon && this._isRectangle(geom)){
			   const coords = geom.getCoordinates()[0];
			   const orderedCoords = getOrderedRectangleCoords(coords);
			   this._shapeFeature.getGeometry().setCoordinates([orderedCoords]);
			   console.table(orderedCoords);
		   }


		   //원 또는 원형polygon
		   if(geom instanceof ol.geom.Circle || this._isPolygonCicle(geom)){
			   let circleGeom = geom;
			   if(geom instanceof ol.geom.Polygon){
				   //polygon -> circle변환
				   const {center, radius} = this._getCircleParamsFromPolygon(geom);
				   circleGeom = new ol.geom.Circle(center, radius);
				   this._shapeFeature.setGeometry(circleGeom);
				   this._shapeFeature.changed();
			   }
			   this._setupCircleHandles(circleGeom);
		   } else if(geom instanceof ol.geom.Polygon && this._isRectangle(geom)){
			   this._setupRectangleHandles(geom);
		   } else {
			   this._addModifyInteraction();
		   }
	   }

	   //중심 및 외곽선 핸들 배치(circle)
	   _setupCircleHandles(circle){
		   const center = circle.getCenter();
		   const radius = circle.getRadius();
		   const outer = [center[0] + radius, center[1]];

		   //중심 핸들
		   this._centerHandle = new ol.Feature(new ol.geom.Point(center));
		   this._centerHandle.set('type','center');
		   this.editSource.addFeature(this._centerHandle);

		   //바깥 핸들
		   const outerHandle = new ol.Feature(new ol.geom.Point(outer));
		   outerHandle.set('type','outer');
		   this.editSource.addFeature(outerHandle);
		   this._cornerHandles = [outerHandle];

		   this._addTranslateHandles_Circle();
	   }

	   //중심 및 외곽선 핸들 배치(rectangle)
	   _setupRectangleHandles(rectGeom){
		   const coords = rectGeom.getCoordinates()[0];

		   //중심
		   const center = coords.slice(0,-1).reduce((acc,cur) => [acc[0] + cur[0],acc[1] + cur[1]],[0,0]).map(val => val / 4);
		   this._centerHandle = new ol.Feature(new ol.geom.Point(center));
		   this._centerHandle.set('type','center');
		   this.editSource.addFeature(this._centerHandle);

		   //4코너
		   this._cornerHandles = [];
		   for(let i = 0; i < 4; i++){
			   const handle = new ol.Feature(new ol.geom.Point(coords[i]));
			   handle.set('type','corner');
			   handle.set('coornerIdx',i);
			   this.editSource.addFeature(handle);
			   this._cornerHandles.push(handle);
		   }

		   this._addTranslateHandles_Rectangle();
	   }

	   //원형 핸들러 translate 이벤트
	   _addTranslateHandles_Circle(){
		   //중심 핸들: 전체 이동
		   this._centerTranslate = new ol.interaction.Translate({
			   features: new ol.Collection([this._centerHandle])
		   });
		   this.map.addInteraction(this._centerTranslate);

		   //실시간으로 도형/바깥핸들 갱신
		   this._centerTranslate.on('translating', (e) => {
			   const center = this._centerHandle.getGeometry().getCoordinates();
			   //outer도 상대적으로 이동
			   const outer = this._cornerHandles[0].getGeometry().getCoordinates();
			   const oldCenter = this._shapeFeature.getGeometry().getCenter();
			   const dx = center[0] - oldCenter[0], dy = center[1] - oldCenter[1];
			   this._shapeFeature.getGeometry().setCenter(center);
			   this._cornerHandles[0].getGeometry().setCoordinates([outer[0] + dx, outer[1] + dy]);

			   this._shapeFeature.changed();
			   this._cornerHandles[0].changed();
			   if(typeof this._editEndCb === 'function') this._editEndCb(this.getShape());
		   });

		   //바깥 핸들: 크기 조정
		   const outerTranslate = new ol.interaction.Translate({
			   features: new ol.Collection([this._cornerHandles[0]])
		   });
		   this.map.addInteraction(outerTranslate);
		   this._cornerTranslates = [outerTranslate];
		   outerTranslate.on('translating', (e) => {
			   const center = this._centerHandle.getGeometry().getCoordinates();
			   const outer = this._cornerHandles[0].getGeometry().getCoordinates();
			   const radius = Math.sqrt(Math.pow(center[0] - outer[0], 2) + Math.pow(center[1] - outer[1], 2));
			   this._shapeFeature.getGeometry().setRadius(radius);
			   //outer 핸ㄷ르은 반지름 위에 강제 고정
			   const theta = Math.atan2(outer[1] - center[1], outer[0] - center[0]);
			   this._cornerHandles[0].getGeometry().setCoordinates([
				   center[0] + radius * Math.cos(theta),
				   center[1] + radius * Math.sin(theta)
			   ]);

			   this._shapeFeature.changed();
			   this._cornerHandles[0].changed();
			   if(typeof this._editEndCb === 'function') this._editEndCb(this.getShape());
		   });
	   }

	   //사각형 핸들 translate 이벤트
	   _addTranslateHandles_Rectangle(){

		   if(this._centerTranslate){
			   this.map.removeInteraction(this._centerTranslate);
			   this._centerTranslate = null;
		   }

		   if(this._cornerTranslates && this._cornerTranslates.length){
			   this._cornerTranslates.forEach(tr => this.map.removeInteraction(tr));
			   this._cornerTranslates = null;
		   }

		   if(!this._centerHandle || !this._cornerHandles || this._cornerHandles.length !== 4){
			   console.error('핸들 미정의 center : ', this._centerHandle, 'corner : ', this._cornerHandles);
			   return;
		   }

		   const currFeatures = this.editSource.getFeatures();
		   const featureArray = currFeatures.getArray ? currFeatures.getArray() : currFeatures;
		   if(Array.isArray(featureArray) && featureArray.includes(this._centerHandle)) this.editSource.addFeatures(this._centerHandle);
		   for(const handle of this._cornerHandles){
			   if(!currFeatures.includes(handle)) this.editSource.addFeatures(handle);
		   }



		   //중심점: 전체이동
		   this._centerTranslate = new ol.interaction.Translate({
			   features: new ol.Collection([this._centerHandle])
		   });
		   this.map.addInteraction(this._centerTranslate);

		   this._centerTranslate.on('translating', (e) => {
			   const feature = e.features.getArray()[0];
			   const center = feature.getGeometry().getCoordinates();
			   // 기존 중심-각 코너 간 백터유지 모두이동
			   const coords = this._shapeFeature.getGeometry().getCoordinates()[0];
			   const oldCenter = coords.slice(0,-1).reduce((acc, cur) => [acc[0] + cur[0] , acc[1] + cur[1]], [0,0]).map(val => val / 4);

			   const dx = center[0] - oldCenter[0], dy = center[1] - oldCenter[1];
			   //코너 이동
			   for(let i = 0; i < 4; i++){
				   const pt = [
					   coords[i][0] + dx,
					   coords[i][1] + dy
				   ];
				   this._cornerHandles[i].getGeometry().setCoordinates(pt);
				   this._cornerHandles[i].changed();
			   }

			   //사각형 도형 이동
			   const newCoords = [];
			   for(let i = 0;i < 4; i++){
				   newCoords.push([
					   coords[i][0] + dx,
					   coords[i][1] + dy
				   ]);
			   }
			   newCoords.push(newCoords[0]);
			   this._shapeFeature.getGeometry().setCoordinates([newCoords]);
			   this._shapeFeature.changed();
			   if(typeof this._editEndCb === 'function') this._editEndCb(this.getShape());
		   });

		   //각 코너:개별 변형
		   this._cornerTranslates = [];

		   const diagonalMap = {
				   0: 2,
				   1: 3,
				   2: 0,
				   3: 1
		   };


		   for(let i = 0; i < 4; i++){

			   const cornerTranslate = new ol.interaction.Translate({
				   features: new ol.Collection([this._cornerHandles[i]])
			   });

			   this.map.addInteraction(cornerTranslate);
			   this._cornerTranslates.push(cornerTranslate);

			   let dragInfo = null;

			   cornerTranslate.on('translatestart', (e) => {

				   const geom = this._shapeFeature.getGeometry();

				   //폴리곤 타입 확인
				   if(!geom instanceof ol.geom.Polygon){
					   console.warn('폴리곤이 아님');
					   return;
				   }

				   const coordsFull = this._shapeFeature.getGeometry().getCoordinates();
				   if(!coordsFull || coordsFull.length === 0 || !Array.isArray(coordsFull[0]) || coordsFull[0].length < 4){
					   console.warn('구조이상');
					   return;
				   }

				   //꼭짓점 4개만 추출
				   let coords = coordsFull[0].slice(0,4);

				   //좌우 정렬 적용
				   coords = getOrderedRectangleCoords(coords);

				   // 피처에 정렬된 좌표 다시 적용
				   this._shapeFeature.getGeometry().setCoordinates(coords);

				   //꼭짓점 4개만 사용
				   coords = coords.slice(0,4);

				   const movedCorner = coords[i];
				   const fixedCorner = coords[diagonalMap[i]];

				   //baseVector
				   const baseVector = [movedCorner[0] - fixedCorner[0], movedCorner[1] - fixedCorner[1]];
				   const baseLength = Math.hypot(baseVector[0], baseVector[1]);

				   //기준너비 -> aspectRatio 계산
				   const next = coords[(i + 1) % 4];
				   const width = Math.hypot(next[0] - movedCorner[0], next[1] - movedCorner[1]);
				   const aspectRatio = baseLength === 0 ? 1 : width / baseLength;

				   //드레그 상태 저장
				   dragInfo = {fixedCorner, baseVector, baseLength, aspectRatio};
			   });

			   cornerTranslate.on('translating', (e) => {

				   if(!dragInfo) return;

				   const moved = e.features?.getArray?.()[0];
				   const newCorner = moved.getGeometry().getCoordinates();
				   const {fixedCorner, aspectRatio} = dragInfo;

				   //중심점 계산
				   const cx = (newCorner[0] + fixedCorner[0]) / 2;
				   const cy = (newCorner[1] + fixedCorner[1]) / 2;

				   //너비 계산
				   const width = Math.abs(newCorner[0] - fixedCorner[0]);
				   const height = width * aspectRatio;

				   const halfW = width / 2;
				   const halfH = height / 2;

				   const coords = [
					   [cx - halfW, cy + halfH],
					   [cx + halfW, cy + halfH],
					   [cx + halfW, cy - halfH],
					   [cx - halfW, cy - halfH],
					   [cx - halfW, cy + halfH]
				   ];

				   this._shapeFeature.getGeometry().setCoordinates([coords]);
				   this._shapeFeature.changed();
				   this._centerHandle.getGeometry().setCoordinates([cx,cy]);
				   this._centerHandle.changed();

				   for(let j = 0; j < 4; j++){
					   this._cornerHandles[j].getGeometry().setCoordinates(coords[j]);
					   this._cornerHandles[j].changed();
				   }

				   if(typeof this._editEndCb === 'function') this._editEndCb(this.getShape());
			   });

			   cornerTranslate.on('translateend', () => {
				   dragInfo = null;
			   });
		   }
	   }

	   //일반 geometry용 modify
	   _addModifyInteraction(){
		   this.modify = new ol.interaction.Modify({
			   source:this.editSource
		   });

		   this.map.addInteraction(this.modify);

		   this.modify.on('modifyend', (e) => {
			   if(typeof this._editEndCb === 'function'){
				   this._editEndCb(this.getShape());
			   }
		   });
	   }

	   //스타일
	   _makeEditStyle(feature, opts){
		   if(feature.get('type') === 'center'){
			   return new ol.style.Style({
				   image: new ol.style.Circle({
					   radius:6,
					   fill: new ol.style.Fill({color:'#fff'}),
					   stroke: new ol.style.Stroke({color:'#f00', width:2})
				   }),
				   zIndex:1000
			   });
		   }

		   if(feature.get('type') === 'outer'){
			   return new ol.style.Style({
				   image: new ol.style.Circle({
					   radius:6,
					   fill: new ol.style.Fill({color:'#fff'}),
					   stroke: new ol.style.Stroke({color:'#a0f', width:2})
				   }),
				   zIndex:900
			   });
		   }

		   if(feature.get('type') === 'corner'){
			   return new ol.style.Style({
				   image: new ol.style.Circle({
					   radius:5,
					   fill: new ol.style.Fill({color:'#fff'}),
					   stroke: new ol.style.Stroke({color:'#0af', width:2})
				   }),
				   zIndex:900
			   });
		   }

		   //원,사각형 도형 스타일
		   if(feature.getGeometry() instanceof ol.geom.Circle || feature.getGeometry() instanceof ol.geom.Polygon){
			   const color = opts.color || '#a0f';
			   const fillColor = opts.fillColor || '#883388';
			   const fillOpacity = opts.fillOpacity ?? 0.5;
			   const dash = opts.dashArray ? opts.dashArray.split(',').map(Number) : [3,4];
			   return new ol.style.Style({
				   stroke: new ol.style.stroke({
					   color,
					   width: opts.weight || 3,
					   lineDash: dash
				   }),
				   fill: new ol.style.Fill({
					   color: `rgba(${this._hexToRgb(fillColor)}, ${fillOpacity})`
				   }),
				   zIndex:10
			   });
		   }
		   //기본
		   return undefined;
	   }

	   _hexToRgb(hex){
		   let c = hex.replace('#','');
		   if(c.length === 3) c = c.split('').map(x => x + x).join(',');
		   const num = parseInt(c, 16);
		   return [(num) >> 16 & 255, (num >> 8) & 255, num & 255].join(',');
	   }

	   //사각형 polygon 판별
	   _isRectangle(geom, eps = 5){
		   if(!(geom instanceof ol.geom.Polygon)) return false;
		   const coords = geom.getCoordinates()[0];
		   if(coords.length !== 5) return false; //4+1 닫힘

		   //x,y좌표 각각 오차 이내로 유일한 값 그룹핑
		   function groupCoords(arr){
			   const result = [];
			   arr.forEach(val => {
				   if(!result.some(x => Math.abs(x - val) < eps)) result.push(val);
			   });
			   return result;
		   }
		   const xVals = coords.slice(0,4).map(pt => pt[0]);
		   const yVals = coords.slice(0,4).map(pt => pt[1]);
		   const uniqX = groupCoords(xVals);
		   const uniqy = groupCoords(yVals);

		   //각 2개씩이어야 사각형
		   if(uniqX.length !== 2 || uniqy.length !== 2) return false;

		   //각 변이 수직/수평 오차이내
		   for(let i = 0; i < 4; i++){
			   const pt = coords[i];
			   const next = coords[(i + 1) % 4];
			   const dx = Math.abs(pt[0] - next[0]);
			   const dy = Math.abs(pt[1] - next[1]);
			   if(!(
					   (dx < eps && dy > eps) ||
					   (dy < eps && dx > eps)
			   )) return false;
		   }


		   return true;
	   }

	   //polygon이 원형인지 체크
	   _isPolygonCicle(geom){
		   if(!(geom instanceof ol.geom.Polygon)) return false;
		   const coords = geom.getCoordinates()[0];
		   if(coords.length < 20) return false;
		   const n = coords.length;
		   const center = coords.reduce((acc,cur) => [acc[0]+cur[0], acc[1]+cur[1]], [0,0]).map(val => val /n);
		   const radii = coords.map(c => Math.sqrt((c[0] - center[0])**2 + (c[1] - center[1])**2));
		   const mean = radii.reduce((a,b) => a + b) / n;
		   const dev = Math.sqrt(radii.map(r => (r-mean)**2).reduce((a,b) => a+b)/n);
		   return dev < mean * 0.02;
	   }

	   _getCircleParamsFromPolygon(polygon){
		   const coords = polygon.getCoordinates()[0];
		   const coordsNoClose = coords.length > 1 && coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1] ? coords.slice(0, coords.length - 1) : coords;
		   const n = coordsNoClose.length;
		   const center = coordsNoClose.reduce((acc,cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0,0]).map(val => val / n);
		   const dx = coordsNoClose[0][0] - center[0];
		   const dy = coordsNoClose[0][1] - center[1];
		   const radius = Math.sqrt(dx * dx + dy * dy);
		   return {center, radius};
	   }

	   getShape(){
		   if(this._shapeFeature) return [this._shapeFeature];
		   return [];
	   }

       remove(){
    	   if(this._centerTranslate){
    		   this.map.removeInteraction(this._centerTranslate);
    		   this._centerTranslate = null;
    	   }

    	   if(this._cornerTranslates){
    		   this.map.removeInteraction(this._cornerTranslates);
    		   this._cornerTranslates = [];
    	   }

    	   if(this.modify){
    		   this.map.removeInteraction(this.modify);
    		   this.modify = null;
    	   }

    	   this.editSource.clear();
    	   if(this.editLayer) this.map.removeLayer(this.editLayer);
    	   this._centerHandle = null;
    	   this._cornerHandles = [];
    	   this._shapeFeature = null;
    	   FeatureEdit._instance = null;
       }

       onEditEnd(cb){
    	   this._editEndCb = cb;
       }

   }

   function getOrderedRectangleCoords(coords){

	   if(!Array.isArray(coords) || coords.length < 4) return coords;
	   const points = coords.slice(0,4);
	   const first = points[0];

	   //4326 좌표가 잘못들어오면
	   if(first[0] < 200 || first[1] < 200){
		   console.warn('좌표순서 문제',coords);
	   }

	   const xs = points.map(p => p[0]);
	   const ys = points.map(p => p[1]);

	   const minX = Math.min(...xs);
	   const maxX = Math.max(...xs);
	   const minY = Math.min(...ys);
	   const maxY = Math.max(...ys);

	   return [
		   [minX, maxY],
		   [maxX, maxY],
		   [maxX, minY],
		   [minX, minY],
		   [minX, maxY]
	   ];
   }

   class OLLayerGroup {
	   constructor(layers = []){
		   this._layers = {};
		   this._map = null;

		   layers.forEach(layer => this.addLayer(layer));
	   }

	   addTo(map){
		   this.map = map;
		   this.onAdd(map);
		   return this;
	   }

	   removeFrom(map){
		   this.onRemove(map);
		   this._map = null;
		   return this;
	   }

	   addLayer(layer){
		   const id = this.getLayerId(layer);
		   this._layers[id] = layer;
		   if(this._map){
			   this._map.addLayer(layer);
		   }
		   return this;
	   }

	   removeLayer(layer){
		   const id = this._layers[layer] ? layer : this.getLayerId(layer);
		   const target = this._layers[id];
		   if(this._map && target){
			   this._map.removeLayer(target);
		   }
		   delete this._layers[id];
		   return this;
	   }

	   hasLayer(layer){
		   const id = this.getLayerId(layer);
		   return !!this._layers[id];
	   }

	   clearLayers(){
		   Object.values(this._layers).forEach(layer => {
			   if(this._map) this._map.removeLayer(layer);
		   });
		   this._layers = {};
		   return this;
	   }

	   eachLayers(fn, context = null){
		   Object.values(this._layers).forEach(layer => fn.call(context,layer));
		   return this;
	   }

	   invoke(methodName, ...args){
		   this.eachLayer(layer => {
			   if(typeof layer[methodName] === 'function'){
				   layer[methodName](...args);
			   }
		   });
		   return this;
	   }

	   getLayer(id){
		   return this._layers[id];
	   }

	   getLayers(){
		   return Object.values(this._layers);
	   }

	   setZIndex(zIndex){
		   return this.invoke('setZIndex',zIndex);
	   }

	   getLayerId(layer){
		   if(!layer._ol_uid){
			   layer._ol_uid = 'ol-layer-' + OLLayerGroup._uidCounter++;
		   }
		   return layer._ol_uid;
	   }
   }

   function layerGroup(layers = []){
	   return new OLLayerGroup(layers);
   }

   //L.CircleMarker
   class OLCircleMarker {
	   constructor(latlng, options = {}){
		   const radius = options.radius || 10;
		   const coord = ol.proj.fromLonLat([latlng.lng, latlng.lat]);

		   this.feature = new ol.Feature({
			   geometry: new ol.geom.Point(coord)
		   });

		   this.setRadius(radius);
		   this.setStyle(options);
	   }

	   setLatLng(latlng){
		   const coord = ol.proj.fromLonLat([latlng.lng, latlng.lat]);
		   this.feature.getGeometry().setCoordinates(coord);
		   return this;
	   }

	   getLatLng(){
		   const coord = this.feature.getGeometry().getCoordinates();
		   const lonlat = ol.proj.toLonLat(coord);
		   return { lat: lonlat[1], lng:lonlat[0] };
	   }

	   setRadius(radius){
		   this._radius = radius;
		   const style = this.feature.getStyle() || new ol.style.Style();
		   const existing = style.getImage();

		   style.setImage(new ol.style.Circle({
			   radius: radius,
			   fill: existing?.getFill() || new ol.style.Fill({ color : rgba(255,0,0,0.3)}),
			   stroke: existing?.getStroke() || new ol.style.Stroke({ color:'red', width:2})
		   }));

		   this.feature.setStyle(style);
		   return this;
	   }

	   getRadius(){
		   return this._radius;
	   }

	   setStyle(options){
		   const radius = options.radius || this._radius || 10;

		   this.feature.setStyle(new ol.style.Style({
			   image: new ol.style.Circle({
				   radius: radius,
				   fill: new ol.style.Fill({
					   color: options.fillColor || 'rgba(255,0,0,0.3)'
				   }),
				   stroke: new ol.style.Stroke({
					   color: options.color || 'red',
					   width: options.weight || 2
				   })
			   })
		   }));

		   return this;
	   }

	   getFeature(){
		   return this.feature;
	   }
   }

   class OLCircle extends OLCircleMarker {
	   constructor(latlng, options = {}){
		   super(latlng, options);
		   this._latlng = latlng;
		   this._mRadius = options.radius || 100;
		   this._updateGeometry();
	   }

	   setRadius(meterRadius){
		   this._mRadius = meterRadius;
		   this._updateGeometry();
		   return this;
	   }

	   getRadius(){
		   return this._mRadius;
	   }

	   _updateGeometry(){
		   const centerLonLat = [this.latlng.lng, this.latlng.lat];
		   const center = ol.proj.fromLonLat(centerLonLat);

		   //계산 meter -> degree 변환 후 주변점으로 원형 polygon 생성
		   const earthRadius = 6378137;
		   const points = [];
		   const segments = 64;
		   const angleStep = 2 * Math.PI / segments;

		   for(let i = 0; i < segments; i++){
			   const angle = i * angleStep;
			   const dx = this._mRadius * Math.cos(angle);
			   const dy = this._mRadius * Math.sin(angle);
			   const offset = [center[0] + dx, center[1] + dy];
			   points.push(offset);
		   }

		   const polygon = new ol.geom.Polygon([...points, points[0]]);
		   this.feature.setGeometry(polygon);
	   }

	   getBounds(){
		   const geom = this.feature.getGeometry();
		   return geom.getExtent(); // return [minX,minY,maxX,maxY]
	   }
   }

   class OLMarker {
	   constructor(latlng, options = {}){
		   const coord = ol.proj.transform([parseFloat(latlng.lng), parseFloat(latlng.lat)], 'EPSG:4326', 'EPSG:5179');
		   this._latlng = latlng;
		   const baseUrl = window.location.origin;
		   this._options = Object.assign({
			   iconUrl: `${baseUrl}/tango-transmission-web2/resources/images/marker-icon.png`,
			   iconAnchor: [0.5, 1],
			   scale : 1,
			   opacity: 1,
			   zIndex: 0
		   }, options);

		   this.feature = new ol.Feature({
			   geometry: new ol.geom.Point(coord)
		   });

		   this.feature.set('isMarker',true);
		   this._setStyle();
	   }

	   setLatLng(latlng) {
		   this._latlng = latlng;
		   const coord = ol.proj.transform([parseFloat(latlng.lng), parseFloat(latlng.lat)], 'EPSG:4326', 'EPSG:5179');
		   this.feature.getGeometry().setCoordinates(coord);
		   return this;
	   }

	   getLatLng() {
		   return this._latlng;
	   }

	   setZIndexOffset(offset) {
		   this._options.zIndex = offset;
		   this._setStyle();
		   return this;
	   }

	   setOpacity(opacity) {
		   this._options.opacity = opacity;
		   this._setStyle();
		   return this;
	   }

	   setIcon(iconOptions){
		   this._options.iconUrl = iconOptions.iconUrl || this._options.iconUrl;
		   this._options.iconAnchor = iconOptions.iconAnchor || this._options.iconAnchor;
		   this._options.scale = iconOptions.scale || this._options.scale;
		   this._setStyle();
		   return this;
	   }

	   _setStyle() {
		   const icon = new ol.style.Icon({
				   src: this._options.iconUrl,
				   anchor: this._options.iconAnchor,
				   scale: this._options.scale,
				   opacity: this._options.opacity,
				   crossOrigin: 'anonymous'
		   });

		   const iconStyle = new ol.style.Style({image: icon});

		   this.feature.setStyle(iconStyle);

		   icon.load();
		   icon.getImage().onload = () => {
			   L.GeoMap().map.render();
		   };
	   }

	   getFeature() {
		   return this.feature;
	   }
   }

   class PopupManager {
	   constructor(map){
		   this.container = document.getElementById('popup');
		   this.content = document.getElementById('popup-content');
		   this.closer = document.getElementById('popup-closer');

		   this.overlay = new ol.Overlay({
			   element: this.container,
			   positioning: 'bottom-center',
			   offset: [0,-41],
			   autoPan:true,
			   stopEvent:false
		   });
		   map.addOverlay(this.overlay);

		   this.closer.onclick = (e) => {
			   e.preventDefault();
			   this.hide();
		   };
	   }

	   show(content, coordinate){
		   this.content.innerHTML = content;
		   this.overlay.setPosition(coordinate);
	   }

	   hide(){
		   this.overlay.setPosition(undefined);
	   }
   }


   OLLayerGroup._uidCounter = 1;
   TrailMeasure._zIndexCounter = 3000;

   global.L.GeoMap = GeoMap;
   global.L.GeoUtil = GeoUtil;
   global.L.StyleConfig = StyleConfig;
   global.L.SelectLayer = SelectLayer;
   global.L.FeatureSelector = FeatureSelector;
   global.L.ContextMenuManager = ContextMenuManager;
   global.L.TrailManager = TrailManager;
   global.L.EditSnapTrail = EditSnapTrail;
   global.L.FeatureDraw = FeatureDraw;
   global.L.FeatureEdit = FeatureEdit;
   global.L.layerGroup = layerGroup;
   global.L.OLMarker = OLMarker;

   L.geoUtilInstance = L.geoUtilInstance || new L.GeoUtil("https://90.90.227.174:8443/geoserver");
})(this);
