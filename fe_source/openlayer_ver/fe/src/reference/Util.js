const WEB_IP = '/invt-tango-transmission-web'
const BIZ_IP = 'tango-transmission-tes-biz2';
const BIZ_IP2 =  'tango-transmission-biz2';
const COMMON_BIZ_IP = 'tango-common-business-biz';

	var Util = {
		_progress: null,
		_loadCnt: 0,

		// Ajax 공통 함수 ( Tango 제공 )
		jsonAjax: function(object) {

			var self = this;
			if ( this.doAjax(object) ) {
				var deferred = $.Deferred();

				if ( object.isProgress ) self._progress = $('body').progress();

				Tango.ajax({
					url: BIZ_IP + object.url,
					method: object.method,
					data: object.data,
					async: (object.async == null ? true : object.async)
				}).done(function(response, status, jqxhr, flag) {
					var json = response;
					if ( typeof json == 'string' ) {
						json = JSON.parse(json);
					}
					if ( self._progress != null ) {
						self._progress.remove();
						self._progress = null;
					}
					deferred.resolve(json);
				}).fail(function(responseJSON, status, flag) {
					if ( self._progress != null ) {
						self._progress.remove();
						self._progress = null;
					}

					if ( responseJSON.code && responseJSON.message ) {
						alert(responseJSON.code + ' : ' + responseJSON.message);
					} else {
						alert(status);
					}

					deferred.reject(responseJSON);
				});

				return deferred.promise();
			}
		},

		getCommonCode: function(object) {
			if ( this.doAjax(object) ) {
				var deferred = $.Deferred();
				Tango.ajax({
					url: BIZ_IP2 + object.url,
					method: object.method,
					data: object.data,
					async: (object.async == null ? true : object.async)
				}).done(function(response, status, jqxhr, flag) {
					var json = response;
					if ( typeof json == 'string' ) {
						json = JSON.parse(json);
					}
					deferred.resolve(json);
				}).fail(function(responseJSON, status, flag) {
					alert(responseJSON.code + ' : ' + responseJSON.message);
				});

				return deferred.promise();
			}
		},

		menuBoxAjax: function(object) {
			if ( this.doAjax(object) ) {
				var deferred = $.Deferred();

				Tango.ajax({
					url: COMMON_BIZ_IP + object.url,
					method: object.method,
					data: object.data,
					async: (object.async == null ? true : object.async)
				}).done(function(response, status, jqxhr, flag) {
					var json = response;
					if ( typeof json == 'string' ) {
						json = JSON.parse(json);
					}
					deferred.resolve(json);
				}).fail(function(responseJSON, status, flag) {
					alert(responseJSON.message);
					deferred.reject(responseJSON);
				});

				return deferred.promise();
			}
		},

		excelUploadAjax: function(object, formData) {
			var self = this;
			if ( this.doAjax(object) ) {
				if ( object.isProgress ) self._progress = $('body').progress();
				var deferred = $.Deferred();
				Tango.ajax({
					url: BIZ_IP + object.url,
					method: object.method,
					data: object.data,
					processData:false,
					contentType:false,
					async: (object.async == null ? true : object.async)
				}).done(function(response, status, jqxhr, flag) {
					if ( self._progress != null ) {
						self._progress.remove();
						self._progress = null;
					}
					deferred.resolve(response);
				}).fail(function(responseJSON, status, flag) {
					if ( self._progress != null ) {
						self._progress.remove();
						self._progress = null;
					}
					alert(responseJSON.message);
					deferred.reject(responseJSON);
				});

				return deferred.promise();
			}
		},

		traceAjax: function(object) {
			var self = this;
			if ( this.doAjax(object) ) {
				if ( object.isProgress == true ) self._progress = $('body').progress();
				var deferred = $.Deferred();
				$.ajax({
					url: object.url,
					contentType: object.contentType,
					method: object.method,
					data: object.data,
					async: (object.async == null ? true : object.async)
				}).done(function(response, status, jqxhr, flag) {

					if ( object.isProgress == true && self._progress != null ) {
						self._progress.remove();
						self._progress = null;
					}

					var json = response;
					if ( typeof json == 'string' && json != '' ) {
						json = JSON.parse(json);
					}
					deferred.resolve(json);

				}).fail(function(responseJSON, status, flag) {
					if ( object.isProgress == true && self._progress != null ) {
						self._progress.remove();
						self._progress = null;
					}

					alert(responseJSON);
					deferred.reject(responseJSON);
				});

				return deferred.promise();
			}
		},

		// Ajax 실행 전, validationCheck
		doAjax: function(object) {

			if ( object != undefined ) {
				if ( object.method != undefined ) {
					if ( object.url != undefined ) {
						return true;
					} else {
						alert('URL 설정이 되어있지 않습니다.');
					}
				} else {
					alert('HTTP Protocol를 설정해주시기 바랍니다.');
				}
			}

			return false;
		},

		openBottomLayout: function() {
			//$('#grid_spliter').css({width: '100%', height: '100%'}).split({orientation: 'horizontal', limit: 110, position:'60%'});
			/*$('#grid_spliter').css({width: '100%', height: '100%'}).split({orientation: 'horizontal', limit: 0, position:'60%'});*/
			$('.grid_result_main').fadeIn('fast').addClass('on');
			$('.grid_result').fadeIn('fast').addClass('on');
		},

		controlVisible: function(visible) {
			var block = visible ? 'block' : 'none';
			$('#bookmark_btn').css('display', block);
			window.TGIS.ContextMenu.doChangeStyle = visible;
		},

		jsonCopy: function(json) {
			var result = JSON.stringify(json);
			return JSON.parse(result);
		},

		getPolygonByPoint: function(latlng, findDist, vertices) {
			var mgMap = window.mgMap ;

			var points = [],
				crs = mgMap.options.crs,
				DOUBLE_PI = Math.PI * 2,
				angle = 0.0,
				projectedCentroid, radius, point, project, unproject;

			var circle = new L.circle(latlng, {radius: findDist});

			if ( crs === L.CRS.EPSG3857 ) {
				project = mgMap.latLngToLayerPoint.bind(mgMap);
				unproject = mgMap.layerPointToLatLng.bind(mgMap);
				radius = circle._radius;
			} else {
				project = crs.projection.project.bind(crs.projection);
				unproject = crs.projection.unproject.bind(crs.projection);
				radius = circle._mRadius;
			}

			projectedCentroid = project(circle._latlng);
			vertices = vertices || 16;

			for(var i=0; i<vertices - 1; i++) {
				angle -= (DOUBLE_PI / vertices);
				point = new L.point(
					projectedCentroid.x + (radius * Math.cos(angle)),
					projectedCentroid.y + (radius * Math.sin(angle))
				);

				if ( i>0 && point.equals(points[i-1]) ) {
					continue;
				}

				points.push(unproject(point));
			}

			return new L.polygon(points);
		}

		, isUndefined: function (str){
			let returnVal;
			if ($.TcpUtils.isEmpty(str)) {
				returnVal = "";
			}else{
				returnVal = str
			}
			return returnVal;
		}

		, convertQueryString: function(obj){
			return Object.keys(obj).map(function(i){
				return encodeURIComponent(i) + '=' + encodeURIComponent(obj[i])
			}).join("&");
		}

		, clearLayerFunc: function(layerId){
		    let layer = window.mgMap.getCustomLayerByName(layerId);
			if(layer) {
				layer.clearLayers();
			}
		}

		, getMultiSelect: function(objId, gbn, selected){
			let returnVal = [];
			let returnText = [];
			$('#'+objId+' option'+selected).each(function(i){
				let $this = $(this);
				if($this.length){
					returnVal.push($this.val());
					returnText.push($this.text());
				}
			});

			if("text" == gbn){
				return returnText;
			}else if("value" == gbn){
				return returnVal;
			}
		}

		, getParseMultiLineString: function(multiLineStr){
			// MULTILINESTRING 텍스트를 좌표 배열로 변환
			let coordinates = multiLineStr.replace('MULTILINESTRING((', '')
										  .replace('))', '')
										  .split('),(')
										  .map(line => line.split(',').map(coord => coord.split(' ').map(Number)));
			return coordinates;
		}

		, getRingPathLineString: function(lineStr){
			return lineStr.map(coord => coord.split(',').map(Number));
		}

		, isExists: function(arrObj, key, value){
			let exists = false;
			exists = arrObj.some(item => item[key] === value);
			return exists;
		}

		, getPolygonGeometryString: function() {
			var trailInfo = Util.getDrawTrailInfo();
			if ( _.size(trailInfo.trailCoords) == 0 ) { return null; }
			var geoString = '';
			var latlngs = '';
			_.each(trailInfo.trailCoords, function(latlng, idx) {
				latlngs += latlng.lng + ' ' + latlng.lat + ', ';
			});

			latlngs += trailInfo.trailCoords[0].lng + ' ' + trailInfo.trailCoords[0].lat;
			geoString += 'POLYGON(( ' + latlngs + ' ))';

			return geoString;
		}

		, getDrawTrailInfo: function() {
			var trailInfo = {};
			var trailMode = window.mgMap.getTrailMode();
			if ( trailMode ) {
				var trailCoords = trailMode.getTrailCoordinates();

				if( _.size(trailCoords) > 0 ) {
					trailCoords = trailCoords[0].coords;
				}

				trailInfo.trailCoords = trailCoords;
				trailInfo.trailType = trailMode.getGeomTypeFromFeature();

				return trailInfo;
			}

			return trailInfo;
		}
	};
