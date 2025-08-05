var addPutBoxCheckVal = false;
var createFeaturePoint = "";

var T_g = {};
T_g.Map = (function(){
	var View = {
			
			editPsblYnList: [],
			_mapProgress: null,
			
			init : function(centerPoint, zoom, cblMgmtNo) {
				
				$("#map").append(leftHtml.join(""));
				$("#map").append(subLeftHtml.join(""));
				$("#map").append(subRightHtml.join(""));
				
				this.createMap(centerPoint, zoom, cblMgmtNo);
			},

			createMap : function(centerPoint, zoom, cblMgmtNo) {
				var _self = this;
				
				if (centerPoint == undefined) {
					centerPoint = [37.5087805938127, 127.062289345605];
				}
				
				if (zoom == undefined) {
					zoom = 10;
				}
				
				var options = {
					maxZoom: 19,
					printControl: true,
					location: {
						zoom : zoom,
						center: centerPoint
					}
				};
				
				MapGeo.create("map_view_area", "TANGO-T", options).then(function (map) {
					window.mgMap = map;

					window._layers = new L.MG.Util.Dict();
					
					_self._map = map;
					
					map.setDefaultContextMenu(_self.getDefaultContextMenu());
					
					_self.getLayerList();
					
					_self.addEventListener();
					
					$('.leaflet-control-locate').append('<a class="leaflet-control-locate-label" style="width:60px;">레이어명</a>');
					$('.leaflet-control-locate').append('<a class="leaflet-control-locate-lng" style="width:150px;text-align:left;padding-left:5px;"><label for="mapLayerNmLabel"></label></a>');
					$('.leaflet-control-locate').append('<a class="leaflet-control-locate-label" style="outline: none;width:80px;">SK 관리번호</a>');
					$('.leaflet-control-locate').append('<a class="leaflet-control-locate-lat" style="width:220px;text-align:left;padding-left:5px;"><label for="mapSkMgmtNoLabel"></label></a>');
					
					if (cblMgmtNo != undefined) {
						_self.selectFeature("line", cblMgmtNo, true);
						_self.getGisCblInfoData(cblMgmtNo);
					}
					
				});
			},
			
			getLayerList : function() {
				var _self = this;
				Tango.ajax({
					url : "tango-transmission-gis-biz/transmission/gis/rm/dashboard/getLayerList"
		    	}).done(function(response, status, jqxhr, flag) {
		    		
		    		var map = _self._map;
		    		
		    		for (var i = 0; i < response.length; i++) {
		    			if (response[i].editPsblYn == "Y") {
		    				var layer = map.getLayersByAlias(response[i].layrNm)[0];
		    				
		    				if (layer != undefined) {
			    				_self.editPsblYnList.push(layer.getId());
		    				}
		    			} 
		    		}
		    		
		    		_self.createTreeLayerList(response);
		    		
		    	}).fail(function(response, status) {
					
				});
			},
			
			createTreeLayerList : function(layerList) {
				var _self = this;
				
				var map = this._map;
	    		var tree = [], root, subItem, values;
	    		
	    		_.each(layerList, function (item, index) {
	    			root = _.find(tree, function (item2, index) {
						return item2.name==item.mm;
					});
	    			
	    			if (root == null) {
						root = { name: item.mm };
						tree.push(root);
					}
	    			
	    			subItem = _.find(root.subItem, function (item3, index) {
						return item3.name==item.layrGrpNm;
					});
	    			
	    			if (subItem == null) {
						subItem = {
							name: item.layrGrpNm,
							value: []
						};
						if ( _.size(root.subItem)<1 ) root.subItem = [];
						root.subItem.push(subItem);
					}
	    			
	    			setVectorLayer(subItem.value, item);
	    		});
	    		
	    		function setVectorLayer(list, item) {
					var layer = map.getLayersByAlias(item.layrNm)[0];
					
					// Raster(Tile), RasterGroup(WMS)가 존재 시, layer의 min max level 조절 및 on/off 설정
					if (layer) {
						
						//layer = getVectorVislbleLevelCtl(layer);
						//layer = getWmsVislbleLevelCtl(layer);
						
						// Vecter레이어 기본 on/off 설정 (raster, rasterGroup은  vecter기본값에 따라감)
						setVectorVisibleCtl(item.layrDispYn, layer);
						setWmsVisibleCtl(item.layrDispYn, layer);
						list.push(layer);
					}
				};
				
				function getWmsVislbleLevelCtl(layer) {
					var lyrId = layer.getId();

					// VECTER LAYER MIN = RASTERGROUP MAX + 1 = VECTER MIN값으로 설정
					var wmsLyr = window.mgMap.getLayerById(lyrId + '_RASTERGROUP');
					if ( wmsLyr ) {
						var zoom = wmsLyr.getMaxZoom();
	                    layer.properties.minZoom = zoom+1;
	                    if ( layer.properties.minZoom>layer.properties.maxZoom ) {
	                        layer.properties.maxZoom = layer.properties.minZoom;
	                    }

	                    layer._initializeUserConfig(layer.properties);

	                    setWmsLabelLayerVisibleLevelCtl(lyrId, zoom);
					}

					return layer;
				};
				
				function setWmsLabelLayerVisibleLevelCtl(lyrId, zoom) {

					var labelLyr = window.mgMap.getLayerById(lyrId + '_LABEL');
					var wmsLabelLyr = window.mgMap.getLayerById(lyrId + '_LABEL_RASTERGROUP');
					
	                if ( wmsLabelLyr ) {
	                	labelLyr.properties.minZoom = zoom+1;
	                    if ( labelLyr.properties.minZoom-1>wmsLabelLyr.properties.maxZoom ) {
	                    	wmsLabelLyr.properties.maxZoom = labelLyr.properties.minZoom-1;
	                    }
	                }
				};
				
				function getVectorVislbleLevelCtl(layer) {
					var lyrId = layer.getId();
					
					// RASTER LAYER의 레벨이 RASTERGROUP보다 높은레벨값에서 사용되기 때문에 RASTER레이어 설정 후 RASTERGROUP설정  
					// RASTER MAX + 1 = VECTER MIN값으로 설정
					var rasterLyr = window.mgMap.getLayerById(lyrId + '_RASTER');
					if ( rasterLyr ) {
						var zoom = rasterLyr.getMaxZoom();
	                    layer.properties.minZoom = zoom+1;
	                    if ( layer.properties.minZoom>layer.properties.maxZoom ) {
	                        layer.properties.maxZoom = layer.properties.minZoom;
	                    }

	                    layer._initializeUserConfig(layer.properties);

	                    setLabelLayerVisibleLevelCtl(lyrId, zoom);
					}

					// VECTER LAYER MIN = RASTERGROUP MAX + 1 = VECTER MIN값으로 설정
					var rasterGroupLyr = window.mgMap.getLayerById(lyrId + '_RASTERGROUP');
					if ( rasterGroupLyr ) {
						var zoom = rasterGroupLyr.getMaxZoom();
	                    layer.properties.minZoom = zoom+1;
	                    if ( layer.properties.minZoom>layer.properties.maxZoom ) {
	                        layer.properties.maxZoom = layer.properties.minZoom;
	                    }

	                    layer._initializeUserConfig(layer.properties);

	                    setLabelLayerVisibleLevelCtl(lyrId, zoom);
					}

					return layer;
				};
				
				function setLabelLayerVisibleLevelCtl(lyrId, zoom) {
					var labelLyr = window.mgMap.getLayerById(lyrId + '_LABEL');
	                if ( labelLyr ) {
	                	labelLyr.properties.minZoom = zoom+1;
	                    if ( labelLyr.properties.minZoom>labelLyr.properties.maxZoom ) {
	                        labelLyr.properties.maxZoom = labelLyr.properties.minZoom;
	                    }
	                }
				};
				
				
				function setVectorVisibleCtl(layrDispYn, layer) {
					var visible = layrDispYn == 'Y' ? true : false;
					layer.setVisible(visible, false);

					var rasterLyr = window.mgMap.getLayerById(layer.getId() + '_RASTER');

					if ( rasterLyr ) {
						rasterLyr.setVisible(visible, false);
					}
				};	
				
				function setWmsVisibleCtl(layrDispYn, layer) {
					var visible = layrDispYn == 'Y' ? true : false;
					layer.setVisible(visible, false);

					var wmsLyr = window.mgMap.getLayerById(layer.getId() + '_RASTERGROUP');

					if ( wmsLyr ) {
						wmsLyr.setVisible(visible, false);
					}
				};
				
				
				var _treeLayer = this._removeEmptyValue(tree);
				
				var treeLayerGroup = this.setModel(_treeLayer);
				
				this.setLayerControlList(treeLayerGroup);
				
				this.setLayerControlEvent();
			},
			
			_removeEmptyValue: function (tree) {
				var result = [];
				_.each(tree, function (item, index) {
					if ( item.subItem ) {
						subItems = [];
						_.each(item.subItem, function (subItem, index) {
							if ( _.size(subItem.value)>0 ) {
								subItems.push(subItem);
							}
						});

						if ( _.size(subItems)>0 ) {
							result.push({
								name: item.name,
								subItem: subItems
							});
						}
					} else {
						if ( _.size(item.value)>0 ) {
							result.push(item);
						}
					}
				});
				return result;
			},
			
			setModel: function (tree) {
	            var self = this;
	            var model = _.map(tree, function (item, index) {
	                var obj = {name: item.name};
	                if ( item.value ) {
	                    obj.value = cloneLayerInfo(item.value);
	                } else {
	                    obj.subItem = cloneSubItems(item.subItem);
	                }
	                return obj;
	            });

	            function cloneSubItems (list) {
	                return _.map(list, function (item, index) {
	                    if ( item.subItem ) {
	                        return cloneSubItems(item.subItem);
	                    }

	                    return {
	                        name: item.name,
	                        value: cloneLayerInfo(item.value)
	                    };
	                });
	            };

	            function cloneLayerInfo(values) {
	            	var _self = this;
	                return _.map(values, function (item, index) {
	                    var id = _.uniqueId('tree_layer'),
	                        layerInfo = {
	                            labelVisible: false,

	                            getId: function() { return id; },
	                            getLayerId: function() { return item.getId(); },
	                            getLabel: function() { return item.getLayerAliasName(); },
	                            isVisible: function() { return item.isVisible(); },
	                            //getImgUrl: function() { return TGIS.Const.imgPath + item.getLayerAliasName() + '.png'; },
	                            getImgUrl: function() { return L.MG.ENV.APP_IMAGEPATH + "/res/symbols/" + item.getLayerAliasName() + '.png'; },
	                            isLabelVisible: function() { return this.labelVisible; },
	                            toggleLabelVisible: function () { 
	                                this.labelVisible = !this.labelVisible;
	                                return this.labelVisible;
	                            }
	                        };
	                    //self._layers.put(id, layerInfo);
	                    _self._layers.put(id, layerInfo);
	                    return layerInfo;
	                });
	            };

	            return model;
	        },
	        
	        setLayerControlList: function(list) {
	            var html = this.getRootTreeHtml(list);

	            $(".item_1").append(html);
	            $(".menu_layer").convert();

	            this.setEventLabelOnOff();
	            this.setEventFeatureOnOff();

	            this.setIndeterminateEvt();

	            var height = $(".menu_layer").height()-$('.menu_layer_tit').height();
	            $('#div-tree1').height(height);
	        },
	        
	        getRootTreeHtml: function (list) {
	            var html = '<div id="div-tree1" style="overflow:auto;"><ul id="tree1" class="Tree menu_layer_tree" data-checkbox="visible">';

	            _.each(list, function(item, index) {
	        		html += '<li>';
	                html +=     '<span class="Arrow"></span>';
	                // if ( !('subItem' in item) ) html +=     '<input class="Checkbox" checkType="layerAll" type="checkbox">';
	                html +=     '<a>' + item.name + '</a>';

	                if ( 'subItem' in item ) html += this.getSubTreeHtml(item.subItem);
	                else html += this.getNodeTreeHtml(item.value);

	                html += '</li>';
	                
	            }, this);

	            html += '</ul></div>';
	            return html;
	        },

	        getSubTreeHtml: function (list) {
	            var html = '<ul>';

	            _.each(list, function(item, index) {
	                html += '<li>';
	                    html += '<span class="Arrow"></span>';
	                    html += '<input class="Checkbox" checkType="layerAll" type="checkbox">';
	                    html += '<a>' + item.name + '</a>';

	                    if ( 'subItem' in item ) html += this.getSubTreeHtml(item.subItem);
	                    else html += this.getNodeTreeHtml(item.value);
	                html += '</li>';
	            }, this);

	            html += '</ul>';
	            return html;
	        },

	        getNodeTreeHtml: function (list) {
	            if ( _.size(list)==0 ) return '';

	            var html = '<ul>';

	            _.each(list, function(item, index) {
	                html += '<li class="labelLayer" layerId='+ item.getId() + '>';
	                    html += '<span class="line"></span>';
	                    html += this.getImgTagHtml(item);
	                    html += this.getCheckBoxHtml(item);
	                    html += ' ' + item.getLabel();
	                html += '</li>';
	            }, this);
	            html += '</ul>';

	            return html;
	        },

	        getImgTagHtml: function(layer) {
	            var html = null,
	                imgUrl = layer.getImgUrl();
	            if ( imgUrl == undefined ) {
	                html = '<img src="../../resources/images/ico_metro_1.png" alt="">';
	            } else {
	                html = '<img src=' + imgUrl + ' alt="">';
	            }
	            
	            return html;
	        },

	        getCheckBoxHtml: function(layer) {
	            var idx = _.indexOf(this.editPsblYnList, layer.getLayerId());

	            var html = null;
	            if ( layer.isVisible() ) {
	                if ( idx > -1 ) {
	                    html = '<input class="Checkbox" isCheck="true" checkType="layer" layerId=' + layer.getId() + ' type="checkbox" checked>';
	                    html += '<img class="img-select-on-off" src="../../resources/images/selectable_on.png" layerId=' + layer.getId() + ' />';
	                } else {
	                    html = '<input class="Checkbox" checkType="layer" layerId=' + layer.getId() + ' type="checkbox" checked>';
	                    html += '<img class="img-select-on-off" src="../../resources/images/selectable_off.png" layerId=' + layer.getId() + ' />';
	                }
	                
	            } else {
	                if ( idx > -1 ) {
	                    html = '<input class="Checkbox" isCheck="true" checkType="layer" layerId=' + layer.getId() + ' type="checkbox">';
	                    html += '<img class="img-select-on-off" src="../../resources/images/selectable_off.png" layerId=' + layer.getId() + ' />';
	                } else {
	                    html = '<input class="Checkbox" checkType="layer" layerId=' + layer.getId() + ' type="checkbox">';
	                    html += '<img class="img-select-on-off" src="../../resources/images/selectable_off.png" layerId=' + layer.getId() + ' />';
	                }
	                
	            }

	            html += '<img class="img-label-on-off" src="../../resources/images/labelTagOff.png" layerId=' + layer.getId() + ' />';
	            return html;
	        },
	        
	        setEventLabelOnOff: function() {
	            var self = this;
	            $('.img-label-on-off').on('click', function() {
	                //var lyrInfo = self._layers.get( $(this).attr('layerId') );
	            	var lyrInfo = window._layers.get( $(this).attr('layerId') );
	            	
	                var labelVisible = lyrInfo.toggleLabelVisible();

	                var layerId = lyrInfo.getLayerId();
	                //var layer = self._lyrCtl.getVectorLayerById(layerId);
	                var layer = window.mgMap.getLayerById(layerId)
	                //var labelLayer = self._lyrCtl.getLabelLayerById(layerId);
	                var labelLayer = window.mgMap.getLayerById(layerId+'_LABEL');
	                var visible = layer.isVisible();

	                if ( visible && labelVisible ) $(this).attr('src', '../../resources/images/labelTagOn.png');
	                else if ( visible && !labelVisible ) $(this).attr('src', '../../resources/images/labelTagOff.png');

	                //self._lyrCtl.setLayerVisible(layerId, visible, labelVisible);
	                self.setLayerVisible(layerId, visible, labelVisible);
	                self.setLabelValignStyle(labelLayer);
	            });
	        },
	        
	        setLabelValignStyle: function(labelLayer) {
	        	// 기본 라벨스타일설정
	            var style = L.MG.StyleCfg.getStylesByLayerName(labelLayer.getId())[0];
	            style.vAlign = 'top';
	            style.mAlign = L.point([10, 10]);
	            style.faceName = "맑은고딕";
	            style.size = "11";
            	
	            var option = { type: 'TEXT', options: style };
	            labelLayer.setUserStyleConfig(option);
	        },
	        
	        setEventFeatureOnOff: function() {
	            //var self = this;
	            $('.img-select-on-off').on('click', function() {
	            	
	                //var lyrInfo = self._layers.get( $(this).attr('layerId') );
	            	var lyrInfo = window._layers.get( $(this).attr('layerId') );
	            	
	                // var labelVisible = lyrInfo.toggleLabelVisible();

	                var layerId = lyrInfo.getLayerId();

//	                if ( layerId == 'DAWUL_SIDO_A_TILE_RASTER' || layerId == 'DAWUL_SGG_A_TILE_RASTER' || layerId == 'DAWUL_RI_A' ) {
//	                    alert('행정경계는 선택하실 수 없습니다.');
//	                    return;
//	                }

	                //var layer = self._lyrCtl.getVectorLayerById(layerId);
	                var layer = window.mgMap.getLayerById(layerId);
	                

	                if ( layer ) {
	                    var rasterLyr = window.mgMap.getLayerById( layerId + '_RASTER' );
	                    var visible = layer.isVisible();
	                    var selectable = layer.isSelectable();

	                    var selectMode = true;

	                    if ( visible && !selectable ) {
	                        $(this).attr('src', '../../resources/images/selectable_on.png');
	                        
	                    } else if ( visible && selectable ) {
	                        $(this).attr('src', '../../resources/images/selectable_off.png');
	                        selectMode = false;
	                    }

	                    layer.properties.selectable = selectMode;
	                    layer.refresh(true);

	                    if ( rasterLyr ) {
	                        rasterLyr.properties.selectable = selectMode;
	                        rasterLyr.refresh(true)
	                    } 
	                }
	            });
	        },
	        
	        setIndeterminateEvt: function() {
	            if ( window.navigator.userAgent.indexOf('Trident') >= 0) {
	                $('#tree1').on('mousedown', 'input.Checkbox', function() {
	                    if ( this.indeterminate ) {
	                        $(this).trigger('change');
	                    }
	                });
	            }
	        },
	        
	        setLayerControlEvent: function() {
	        	var _self = this;
	        	
	            $('#tree1 input[type="checkbox"]').on('click', function(e) {
	            	var checkbox = e.currentTarget;
		            var $checkbox = $(checkbox);

		            var isAttrYnList = $(checkbox.parentNode).find('input[type="checkbox"]');
		            var attrCheck = "N";

		            isAttrYnList.each(function() {
		                if ( $(this).attr('isCheck') !== undefined ) {
		                    attrCheck = 'Y';
		                }
		            });

		            if ( $checkbox.is(':checked') ) {
		                $(checkbox.parentNode).find('input[type="checkbox"]').each(function() {
		                    if ( attrCheck == 'Y' ) {
		                        if( $(this).attr('isCheck') == 'true' ) {
		                            this.indeterminate = false;
		                            this.setAttribute('checked', true);
		                            this.checked = true;
		                            _self._setLayerVisible(this);
		                        } 
		                    } else {
		                        this.indeterminate = false;
		                        this.setAttribute('checked', true);
		                        this.checked = true;
		                        _self._setLayerVisible(this);
		                    }
		                });
		            } else {
		                $(checkbox.parentNode).find('input[type="checkbox"]').removeAttr('checked').each(function() {
		                    if ( attrCheck == 'Y' ) {
		                        // if ( $(this).attr('isCheck') == 'true' ) {
		                            this.indeterminate = false;
		                            this.removeAttribute('checked');
		                            _self._setLayerVisible(this);
		                        // }
		                    } else {
		                        this.indeterminate = false;
		                        this.removeAttribute('checked');
		                        _self._setLayerVisible(this);
		                    }
		                });
		            }

		            $('#tree1').traverseUpCheck(e.currentTarget.parentNode);
	            });
	        },
			
	        _setLayerVisible: function (element) {
	            var attrLayerId = $(element).attr('layerId');
	            if ( attrLayerId == undefined ) return;
	            //var layerInfo = this._layers.get(attrLayerId);
	            var layerInfo = window._layers.get(attrLayerId);
	            var visible = $(element).is(':checked');

	            //this._lyrCtl.setLayerVisible(layerInfo.getLayerId(), visible, layerInfo.isLabelVisible(), element);
	            this.setLayerVisible(layerInfo.getLayerId(), visible, layerInfo.isLabelVisible(), element);
	        },
	        
	        setLayerVisible: function(layerId, visible, labelVisible, element) {
	        	var vectorLayer = window.mgMap.getLayerById(layerId);
	        	var labelLayer = window.mgMap.getLayerById(layerId + "_LABEL");
	        	var rasterLayer = window.mgMap.getLayerById(layerId + "_RASTER");
	        	var rasterGroupLayer = window.mgMap.getLayerById(layerId + "_RASTERGROUP");
	        	var labelRasterGroupLayer = window.mgMap.getLayerById(layerId + "_LABEL_RASTERGROUP");

				if ( vectorLayer ) {
					var selectable = vectorLayer.isSelectable();

					vectorLayer.setVisible(visible);

					if ( visible && element ) {
						vectorLayer.properties.selectable = true;
	                    vectorLayer.refresh(true);
						var img = $(element).parent().find('.img-select-on-off');
						$(img).attr('src', '../../resources/images/selectable_on.png');

					} else if ( element && !visible ) {
						var img = $(element).parent().find('.img-select-on-off');
						$(img).attr('src', '../../resources/images/selectable_off.png');
					}

					if ( rasterLayer ) {
						rasterLayer.setVisible(visible);	
					}
					
					if ( rasterGroupLayer ) {
						rasterGroupLayer.setVisible(visible);
					}

					// 벡터 레이어가 켜진 상태에서만 라벨 레이어를 컨트롤하고 꺼져있으면 같이 꺼진다.
					if (labelLayer) {
						if ( visible ) {
							labelLayer.setVisible(labelVisible);
							
							if (labelRasterGroupLayer) {
								labelRasterGroupLayer.properties.selectable = false;
								labelRasterGroupLayer.setVisible(labelVisible);
							}
							
							if ( element && labelVisible == true ) {
								var img = $(element).parent().find('.img-label-on-off');
								$(img).attr('src', '../../resources/images/labelTagOn.png');
							}

						} else {
							labelLayer.setVisible(false);
							
							if (labelRasterGroupLayer) {
								labelRasterGroupLayer.properties.selectable = false;
								labelRasterGroupLayer.setVisible(false);
							}
							
							if ( element ) {
								var img = $(element).parent().find('.img-label-on-off');
								$(img).attr('src', '../../resources/images/labelTagOff.png');
							}
						}
					}
				}
			},
	        
			addEventListener : function() {
				
				var _self = this;
				
				window.mgMap.on('mg-map-loading-start', function(e) {
//					this._mapProgress = $('#mapDiv').progress({opacity:0});
	            }.bind(this));
				
				this._map.on('mg-map-loading-end', function(e) {
//	            	if (this._mapProgress != null) {
//	            		this._mapProgress.remove();
//	            		this._mapProgress = null;
//	            	}
	            }.bind(this));
				
		    	window.mgMap.on('mg-selected-features', this.onClickFeatures, this); // 설비 선택 시
		    	window.mgMap.on('mg-selected-features', this._onSelectedFeatures, this);
				
				this._map.on("click", function() {
	            	$("#gisMap").focus();
	            });
		    	
		    	$(".menu_list > li").find("> a").on("click", function(e) {
		    		
		    		var idx = $(this).parent().index();
		    		
		    		var menu_id = $(this).attr("id");
		    		
		    		if (menu_id == "facility_btn") {
						$(this).parent().addClass('on').siblings().removeClass('on');
						$a.popup({
							url: '/tango-transmission-gis-web/fm/facilitylookup/FacilityLookup.do?callType=rm',
							id: 'rmDashboard',
							title: '시설물검색',
							iframe: false,
							modal: false,
							windowpopup: true,
							width: 1600,
							height: 720,
							center: true,
							movable: true
						});
						
						return;
					}
		    		
		    		if (_self.returnAside() ) {
						$(".menu_layer").find(".menu_layer_item").hide().eq(idx).show();
					} else {
						$(".menu_layer").find(".menu_layer_item").hide().eq(idx).show();
						_self.openAsideFunc();
					}
		    		
		    		$(this).parent().addClass("on").siblings().removeClass("on");
					e.preventDefault();
		    	});
		    	
		    	$(".btn_aside").on("click", function(e) {				
		    		_self.openAsideFunc();
					e.preventDefault();
				});
		    },
		    
		    openAsideFunc: function() {
				
				$('#map').toggleClass('open_aside');
				$('.menu_box').add($('.btn_menu')).removeClass('on');
				var openAside = this.returnAside();
				
				if ( openAside ) {
					$('.btn_aside').stop().fadeIn();
				} else {
					$('.menu_list > li').removeClass('on');
				}
				
				//$(document).trigger("EVENT_OPEN_SUBLEFT", {isOpen: openAside});
			},
		    
		    returnAside: function() {
				if ( $('#map').hasClass('open_aside') ) return true;
				else return false;
			},
			
			getDefaultContextMenu : function() {
				return [
		          {
		        	  text: '확대',
		        	  icon: L.MG.ENV.IMAGEPATH +'/zoom-in.png',
		              callback: function(e) {window.mgMap.zoomIn();}
		          }, 
		          
		          {
		              text: '축소',
		              icon: L.MG.ENV.IMAGEPATH +'/zoom-out.png',
		              callback: function(e) {window.mgMap.zoomOut();}
		          },
		        ];
			},
			
			_onSelectedFeatures: function (data) {
				var _self = this; 
				
				 var selectedFeatures = data.features,
				 size = _.size(selectedFeatures);
		        
				 if( size == 1 ) {
					 var layer = window.mgMap.getLayerById(selectedFeatures[0].feature['layerName']);
					 
					 var layrNmParam = layer.getLayerAliasName();
					 var mgmtNoParam = L.MG.Util.objectId(selectedFeatures[0]);
					 var typeParam = selectedFeatures[0].options['type'];

						// 레이어명 출력
					 $("label[for='mapLayerNmLabel'").html(layrNmParam);
					 $("label[for='mapSkMgmtNoLabel'").html("");
						
					 var params = {'mgmt':mgmtNoParam, 'layrNm': layrNmParam, 'fcltyType' : typeParam};
						
					 _self.getMultiFcltyInfoData(params);
				 } else if( size == 0 ) {
					 $("label[for='mapLayerNmLabel'").html("");
					 $("label[for='mapSkMgmtNoLabel'").html("");					
				 }
			},
			
			// Map Event Callback Method
			onClickFeatures : function(featuresObj) {
				
				var _self = this;
				
				var userSelLayer = this._map.getCustomLayerByName('USER_LAYER_SELECT_FEATURE');
				
				if ( userSelLayer ) {
					userSelLayer.clearLayers();
				}
		
				var contextMenu = this.getLayerMgmtCode(featuresObj);
				
				// 케이블 위험도&영향도
				if (contextMenu == "CA") {
					var cblMgmtNo = featuresObj.features[0].feature._$id;
					
					_self.getGisCblInfoData(cblMgmtNo);
					
				} else {
					$("#caInfo").removeClass("ca_open_aside");
				}
				
				var selFeturesLen = featuresObj.features.length;
				
				var itemList = this.getSelectedItemList(featuresObj, contextMenu, selFeturesLen);
				
				window.mgMap.setSelectedItemContextMenu(itemList, true);
			},
			
			getLayerMgmtCode : function(featuresObj) {
				for (var i in featuresObj.features) {
					if( i != "getIndex" && i != "remove") {
						return this.getLayerCode(L.MG.Util.objectId(featuresObj.features[i]));
	                }
	            } // End of for
	            return "";
	        }, 
	        
	        /**
	    	 * 관리번호로 시설물 분류 판단 (공통사용)
	    	 */
	        getLayerCode : function(mgmtNo) {
	    		// 1) 접속점
	    		if (mgmtNo.indexOf("JP") > -1) {
	    			return "JP";
	    		} else if (mgmtNo.indexOf("CP") > -1) {
	    			return "CP";
	    		}
	    		// 2) 국사/국소
	    		else if (mgmtNo.indexOf("TP") > -1 || mgmtNo.indexOf("RT") > -1
	    				|| mgmtNo.indexOf("BS") > -1 || mgmtNo.indexOf("BR") > -1
	    				|| mgmtNo.indexOf("RF") > -1 || mgmtNo.indexOf("XO") > -1
	    				|| mgmtNo.indexOf("TP") > -1 || mgmtNo.indexOf("ON") > -1
	    				|| mgmtNo.indexOf("XP") > -1 || mgmtNo.indexOf("SO") > -1
	    				|| mgmtNo.indexOf("SB") > -1 || mgmtNo.indexOf("BT") > -1) {
	    			return "TP";
	    		}
	    		// 3) 건물
	    		else if (mgmtNo.indexOf('BD') > -1) {
	    			return "BD";
	    		} else if (mgmtNo.indexOf('MH') > -1) {
	    			return "MH";
	    		} else if (mgmtNo.indexOf('POL') >-1) {
	    			return "POL";
	    		} else if (mgmtNo.indexOf('MOL') >-1) {
	    			return "MOL";
	    		}
	    		// 4) 작업자 레이어 클릭
	    		else if (mgmtNo.indexOf('PTN') >-1){
	    			return "PTN";
	    		}
	    		// 5) 광케이블
	    		else if (mgmtNo.indexOf('CA') >-1){
	    			return "CA";
	    		}
	    			
	    		return "";
	    	},
	    	
	    	// 지도에서 시설물 선택시 Context 메뉴 구성
			getSelectedItemList: function(featuresObj, contextMenu, selFeturesLen) {

				var itemList = [];
				var _self = this;
				
				if (contextMenu == "JP" || contextMenu == "TP" || selFeturesLen == 1 
						|| contextMenu == "BD" || contextMenu == "MH" || contextMenu == "CA") {
					//단일선택시
					var layerId = featuresObj.features[0].feature.getLayerId();
					var layer = window.mgMap.getLayerById(layerId);
					
					var layrNm = layer.getLayerAliasName();			
					var pkValue = L.MG.Util.objectId(featuresObj.features[0]);
					var geometry = featuresObj.features[0].feature.geometry;
					var symbolType = geometry.type;

					// 작업자 위치점 선택
					if (layerId == "CESS_WORKER_LAYER") {
						pkValue = featuresObj.features[0].feature.mgmtNo;
					}
					
					if (symbolType == "LineString") {
						var tmp = featuresObj.features[0].getVertexLatLngs();
						distance = L.GeometryUtil.distanceByLatLngs(window.mgMap, tmp);
					} else {
						distance = "0";
					}
					
					var actMode = "READ";

					itemList = [
						{
							text: '선택해제',
							callback: function(e) { window.mgMap.clearSelectLayer();}
						},
						{
							text: '속성정보관리',
							callback: function(e) {
								// 작업자 정보 팝업
								if (layerId == 'CESS_WORKER_LAYER') {
									_self.openCessWorkerInfoPopup(pkValue);
									return;
	 							}
								
								if (layrNm == 'T_위해개소' || layrNm == 'B_위해개소') {
									_self.openInjuryPlaceModifyPopup(pkValue, layrNm);
								} else if (layrNm == 'T_공사장' || layrNm == 'B_공사장' || layrNm == '유관기관') {
									_self.openRelateModifyPopup(pkValue, layrNm);
								} else if (layrNm == 'T_선로고장' || layrNm == 'B_선로고장') {
									_self.openFaltModifyPopup(pkValue, layrNm);
								} else {
									_self.getFacilityInfo(actMode, layrNm, pkValue);	
								}	
							}
						}, 
						{
							text: '접속정보관리',
							callback: function(e){
								if(contextMenu == 'BD' || layerId == 'CESS_WORKER_LAYER'){
									alert('선택한 시설물은 접속정보를 관리하지 않습니다.');
									return;	
								}
							    // 접속정보관리
							    if (contextMenu == "JP" || contextMenu == "CP" ) {
							        _self.openJpPop(featuresObj);
							    }
							    // FDF선번장 관리
							    else if (contextMenu == "TP") {
							        _self.openFdfMgmtPopup(layrNm, pkValue);
							    }
							}
						},
						{
							text: '링 목록조회',
							callback: function(e){
								// 팝업 생성시, 기존에 생성 되어있는 팝업 제거
					            if (_self._popup != null){ 
					            	_self._popup.close();
					            }
								
					            _self._popup = _self.openPopupMapRingListPopup(pkValue);
							}
						}
					];
					
					if (contextMenu == 'JP') {
						// 20180906 HSW 메인화면 Context메뉴에 함체접속도면 화면 팝업 링크 추가
	                    itemList.push({
	                        text: '함체접속도면',
	                        callback: function(e){
	                            // 팝업 생성시, 기존에 생성 되어있는 팝업 제거
	                        	if (_self._popup != null){ 
					            	_self._popup.close();
					            }
	                        	
	                        	_self._popup = _self.openCnntSimpleDrawPopup(pkValue);                             
	                        }
	                    });
					}
				}
				
				if (contextMenu == 'POL' || contextMenu == 'MOL') {
					var pkValue = featuresObj.features[0].feature._$id;
					itemList = [{
						text: '선택해제',
						callback: function(e) { window.mgMap.clearSelectLayer();}
					}];
					
					$a.popup({
						width: '625',
						height: '515',
						url: "../../db/external/ExternalInfo.do", 
						data:{lnkgEvtId: pkValue},
						iframe: false,
						windowpopup: true,
						modal: true,
						resize: false,
						other: 'top=100,left:100,scrollbars=yes, location=no',
						callback:function(data){
						}
					});
				}
				
				if (contextMenu == 'PTN') {
					var pkValue = featuresObj.features[0].feature._$id;
					itemList = [{
						text: '선택해제',
						callback: function(e) { window.mgMap.clearSelectLayer();}
					}];
					
					$a.popup({
						url: '/tango-transmission-gis-web/rm/cess/CessWorkerInfo.do',
						data:{paramInfo: pkValue},
						iframe: false,
						modal: false,
						windowpopup: true,
						width: 625,
						height: 515,
						center: true,
						movable: true
					});
				}
				
				if (contextMenu == 'BD') {
					itemList.push({
						text: '건물내 시설물 관리',
						callback: function(e){
							// 건물내 시설물
							if (contextMenu == 'BD') {
								var coord = $.merge([], geometry.coordinates[0]);
								var centerCoord = _M.getCenter(geometry.type, [coord]);
								$a.popup({
									width: '1600',
									height: '720',
						    		data:{"bldMgmtNo":pkValue, "centerCoord":JSON.stringify(centerCoord)},
						    		url: "../../fm/facilityInBld/FacilityInBuilding.do",
						    		windowpopup: true,
						    		title: '건물내 시설물 관리',
						    		other: 'top=100,left:100,scrollbars=yes, location=no'
						    	});
							}
						}
					});
				}
				
				if (contextMenu == 'MH') {
					itemList.push({
						text: '인수공 정보 관리',
						callback: function(e) {
						// 인수공 정보 관리
							if (contextMenu == 'MH') {
								var coord = $.merge([], geometry.coordinates);
								$a.popup({
									width: '1600',
						    		height: '720',
						    		data:{"mhMgmtNo":pkValue, "centerCoord":JSON.stringify(coord)},
						    		url: "/tango-transmission-gis-web/fm/manhole/ArtiHandiInfo.do",
						    		windowpopup: true,
						    		title: '인수공 정보 관리',
						    		other: 'top=100,left:100,scrollbars=yes, location=no'
						    	});
							}
						}
					});
				}
				
				if (contextMenu == 'CA') {
					itemList.push({
						text: '부가기능',
						callback: function(e) {
							// 팝업 생성시, 기존에 생성 되어있는 팝업 제거
							if (_self._popup != null) { 
								_self._popup.close();
				            }
		
				            // 시설물 부가기능
				            //GisContext._popup = $a.popup({
							_self._popup = $a.popup({
					    		width: '1600',
					    		height: '700',
					    		data:{
					    			"layrNm":layrNm,
					    			"tblNm":'GIS_FCLT_CBL_BAS',
					    			"layrGrpNm":'',
					    			"layrMgmtNo":pkValue,
					    			"wkrtNo":'',
					    			"cstrCd":'',
					    			"buildInOut":'OUT'
					    		},
					    		url: "/tango-transmission-gis-web/fm/facilityinfo/AdditionalFunction.do",
					    		iframe: false,
					    		windowpopup: true,
								modal: false,
								resize: false,
					    		title: '시설물 정보 관리',
								other: 'top=100,left:100,scrollbars=yes, location=no',
								callback:function(data){
									//GisContext._popup = null;
									_self._popup = null;
								}
					    	});								
						}
					});
				}
				
				return itemList; 
			},
			
			getContextItemList : function(fcltMgmtNo, contextMenu, layrNm, geometry, geoType) {
				var _self = this;
				var actMode = "READ";
				var itemList = [];
				
				if (contextMenu == "JP" || contextMenu == "TP" || contextMenu == 'BD' || 
						contextMenu == 'MH' || contextMenu == "CP" || contextMenu == "CA" || contextMenu == '') {
					//단일선택시
					var pkValue = fcltMgmtNo;
					var symbolType = geometry.type;
					
					if (geoType.toUpperCase() == "LINE") {
						var latlngs = [];
						for (var i = 0; i < geometry.length; i++) {
							latlngs.push(new L.LatLng(geometry[i][1], geometry[i][0]));
						}
						distance = L.GeometryUtil.distanceByLatLngs(window.mgMap, latlngs);
					} else {
						distance = "0";
					}
					
					itemList = [
					    {
					    	text: '선택해제',
					    	callback: function(e) { window.mgMap.clearSelectLayer();}
					    },
					    {
					    	text: '속성정보관리',
					    	callback: function(e) {
					    		if (layrNm == 'T_위해개소' || layrNm == 'B_위해개소') {
					    			_self.openInjuryPlaceModifyPopup(pkValue, layrNm);
					    		} else if (layrNm == 'T_공사장' || layrNm == 'B_공사장' || layrNm == '유관기관')  {
									_self.openRelateModifyPopup(pkValue, layrNm);
					    		} else if(layrNm == 'T_선로고장' || layrNm == 'B_선로고장') {
									_self.openFaltModifyPopup(pkValue, layrNm);
					    		} else {
					    			_self.getFacilityInfo(actMode, layrNm, pkValue);	
					    		}								
					    	}
					    },
					    {
					    	text: '접속정보관리',
					    	callback: function(e) {
					    		if (contextMenu == 'BD' || contextMenu == 'MH') {
					    			alert('선택한 시설물은 접속정보를 관리하지 않습니다.');
					    			return;	
								}
							    // 접속정보관리
							    if (contextMenu == "JP") {
							        _self.jpPopup = $gisCommon.popup.cnnt(pkValue, function() {
							        	_self.jpPopup = null;
							        });
							    }
							    // FDF선번장 관리
							    else if (contextMenu == "TP") {
							        _self.openFdfMgmtPopup(layrNm, pkValue);
							    }
							}
						},
						{
							text: '링 목록조회',
							callback: function(e) {
								// 팝업 생성시, 기존에 생성 되어있는 팝업 제거
								if (_self._popup != null){ 
					            	_self._popup.close();
					            }
								
								_self._popup = _self.openPopupMapRingListPopup(pkValue);
							}
						}
					];
				}
				
				if (contextMenu == 'POL' || contextMenu == 'MOL') {
					itemList = [{
						text: '선택해제',
						callback: function(e) { window.mgMap.clearSelectLayer();}
					}];
				}
				
				if (contextMenu == 'BD') {
					itemList.push({
						text: '건물내 시설물 관리',
						callback: function(e) {
							// 건물내 시설물
							if (contextMenu == 'BD') {
								var coord = $.merge([], geometry[0]);
								var centerCoord = _M.getCenter('polygon', [coord]);
								$a.popup({
									width: '1600',
									height: '720',
									data:{"bldMgmtNo":pkValue, "centerCoord":JSON.stringify(centerCoord)},
									url: "../../fm/facilityInBld/FacilityInBuilding.do",
									windowpopup: true,
									title: '건물내 시설물 관리',
									other: 'top=100,left:100,scrollbars=yes, location=no'
								});
							}
						}
					});
				}
				
				if (contextMenu == 'MH') {
					itemList.push({
						text: '인수공 정보 관리',
						callback: function(e) {
							// 인수공 정보 관리
							if (contextMenu == 'MH') {
								var coord = $.merge([], geometry);
								$a.popup({
									width: '1600',
						    		height: '720',
						    		data:{"mhMgmtNo":pkValue, "centerCoord":JSON.stringify(coord)},
						    		url: "../../fm/manhole/ArtiHandiInfo.do",
						    		windowpopup: true,
						    		title: '인수공 정보 관리',
						    		other: 'top=100,left:100,scrollbars=yes, location=no'
								});
							}
						}
					});
				}
				
				if (contextMenu == 'JP') {
					// 20180906 HSW 메인화면 Context메뉴에 함체접속도면 화면 팝업 링크 추가
	                itemList.push({
	                    text: '함체접속도면',
	                    callback: function(e) {
	                        // 팝업 생성시, 기존에 생성 되어있는 팝업 제거
	                    	if (_self._popup != null){ 
				            	_self._popup.close();
				            }
	                    	
	                    	_self._popup = _self.openCnntSimpleDrawPopup(pkValue);
	                    }
	                });
				}
				
				if (contextMenu == 'CA') {
					itemList.push({
						text: '부가기능',
						callback: function(e) {
							// 팝업 생성시, 기존에 생성 되어있는 팝업 제거
							if (_self._popup != null) { 
								_self._popup.close();
				            }
		
				            // 시설물 부가기능
							_self._popup = $a.popup({
					    		width: '1600',
					    		height: '700',
					    		data:{
					    			"layrNm":layrNm,
					    			"tblNm":'GIS_FCLT_CBL_BAS',
					    			"layrGrpNm":'',
					    			"layrMgmtNo":pkValue,
					    			"wkrtNo":'',
					    			"cstrCd":'',
					    			"buildInOut":'OUT'
					    		},
					    		url: "/tango-transmission-gis-web/fm/facilityinfo/AdditionalFunction.do",
					    		iframe: false,
					    		windowpopup: true,
								modal: false,
								resize: false,
					    		title: '시설물 정보 관리',
								other: 'top=100,left:100,scrollbars=yes, location=no',
								callback:function(data){
									_self._popup = null;
								}
					    	});								
						}
					});
				}
				
				return itemList;
			},
			
			getFacilityInfo: function(actMode, layrNm, pkValue){
		    	//$map = window.mgMap;
		    	
		    	if(pkValue != ""){
			    	Tango.ajax({
			    		url:"tango-transmission-gis-biz/transmission/gis/fm/facilityinfo/layrbas/canPopupLayout"
			    		, data:{"actMode":actMode, "layrNm":layrNm, "pkValue":pkValue, "distance":distance, "buildInOut":"OUT"}
			    	    , method:"POST"
			    	    , flag:"facilityInfo"
			    	}).done(successFn).fail(failFn);
		    	}else{
		    		createFacility("T_광케이블_FTTH", "INS", "OUT");
		    	}
		    },
			
			getJpCnptMgmtNo : function(featuresObj){
				var cnptMgmtNo = "";
				
				for(var i in featuresObj.features){
					if(i != "getIndex" && i != "remove"){
						//var tmpCnptMgmtNo = featuresObj.features[i].feature._$id;
						//kyhkim 수정
						var tmpCnptMgmtNo = L.MG.Util.objectId(featuresObj.features[i]);
						if(tmpCnptMgmtNo.indexOf('JP') > 0 || tmpCnptMgmtNo.indexOf('CP') > 0){
							cnptMgmtNo = tmpCnptMgmtNo;
						} 
					}
				}
				
				return cnptMgmtNo;
			},
			
			// 접속정보관리
			jpPopup : null,
			
			openJpPop : function(featuresObj) {
				var _self = this;
				var jpMgNo = _self.getJpCnptMgmtNo(featuresObj).toString();
				_self.jpPopup = $gisCommon.popup.cnnt(jpMgNo, function(){
					_self.jpPopup = null;
				});
			},
			
			// FDF선번장관리
			openFdfMgmtPopup : function(layrNm, pkValue) {
				$gisCommon.popup.fdf(pkValue);
	        },
	        
	        openCessWorkerInfoPopup: function(pkValue) {
	        	$a.popup({
					width: '625',
					height: '515',
					url: "/tango-transmission-gis-web/rm/cess/CessWorkerInfo.do", 
					data:{wkrtNo: pkValue},
					iframe: false,
					windowpopup: true,
					modal: true,
					resize: false,
					other: 'top=100,left:100,scrollbars=yes, location=no',
					callback:function(data){
					}
				});
	        },
	        
	        openInjuryPlaceModifyPopup: function(pkValue, layrNm) {
	        	$a.popup({
					width: '1350',
					height: '780',
					data:{
						"layrNm": layrNm, 
						"vbpceMgmtNo": pkValue,
						"createLdongCd": "",
						"createFeaturePoint": "",
						"actMode": "UPD",
						"buildInOut": "OUT"
					},
					url: "../../lr/injuryplace/InjuryPlaceModify.do",
					iframe: false,
					windowpopup: true,
					modal: false,
					center: true,
					title: '위해개소 정보 관리',
					other: 'top=100,left:100,scrollbars=no, location=no'
				});
	        },
	        
	        openRelateModifyPopup: function(pkValue, layrNm) {
	        	$a.popup({
					width: '1350',
					height: '780',
					data: {
						"layrNm": layrNm,
						"pkValue": pkValue,
						"createLdongCd": "",
						"createFeaturePoint": "",
						"actMode": "UPD",
						"buildInOut":"OUT"
					},
					url: "../../mgmtrm/RelateMgmt.do",
					//url: "../../lr/relate/RelateModify.do",
					iframe: false,
					windowpopup: true,
					modal: false,
					center: true,
					title: '공사장 정보 관리',
					other: 'top=100,left:100,scrollbars=yes, location=no'
				});	
	        },
	        
	        openFaltModifyPopup: function(pkValue, layrNm) {
	        	$a.popup({
					width: '1350',
					height: '780',
					data: {
						"layrNm": layrNm,
						"pkValue": pkValue,
						"createLdongCd": "",
						"createFeaturePoint": "",
						"actMode": "UPD",
						"buildInOut": "OUT"
					},
					url: "../../lr/falt/FaltModify.do",
					iframe: false,
					windowpopup: true,
					modal: false,
					center: true,
					title: '전송망 고장 관리',
					other: 'top=100,left:100,scrollbars=yes, location=no'
				});		
	        },
	        
	        openPopupMapRingListPopup: function(pkValue) {
	        	var _self = this;
	        	// 링목록 조회
	        	$a.popup({
		    		id:'ringWindow',
					width: '1000',
					height: '515',
					url: "/tango-transmission-gis-web/popup/PopupMapRingList.do",
					data:{"mgmtNo": pkValue},
					iframe: false,
					windowpopup: true,
					modal: false,
					resize: false,
					other: 'top=100,left:100,scrollbars=yes, location=no',
					callback:function(data){
						_self._popup = null;
					}
				});
	        },
	        
	        openCnntSimpleDrawPopup: function(pkValue) {
	        	var _self = this;
	        	// 함체접속도면화면생성
	            $a.popup({
	                width: '950',
	                height: '1000',
	                data:{"cnptmgmtNo": pkValue},
	                url: "../../nm/cnnctnpoint/CnntSimpleDraw.do",
	                windowpopup: true,
	                modal: false,
	                title: '함체접속도면',
	                other: 'top=10,left:10,scrollbars=yes, location=no',
	                callback:function(data){
	                	_self._popup = null;
	                }
	            });  
	        },
	        
	        selectFeature: function(type, mgmtNo, highlight) {
	        	var _self = this;
	        	
				type = type.toLowerCase();
				var param = {};
				param[type + 'List'] = [{
					'mgmtNo' : mgmtNo
				}];

				_M.getCoordnateForMgmtNo(param, function(response) {
					var coord = response[type + 'List'][0].coord;
					var layerNm = response[type+ 'List'][0].layerNm;
					
					if (type == 'point') {
						if (coord.length == 0) {
							highlight = false;
							alert('좌표정보가 없어 이동할 수 없습니다.');
						} else {
							window.mgMap.setView(_self.getCenter(type, $.merge([], coord)), 13);	
						}
					} else if (type == 'line') {
						window.mgMap.panTo(_self.getCenter(type, $.merge([], coord)));
					} else {
						var coord1 = [];
						coord1[0] = $.merge([], coord[0]);
						var coord2 = $.merge([], coord1)
						window.mgMap.panTo(_self.getCenter(type, coord2));
					}
					
					if (highlight) {
						_self.setFeatureInfo(mgmtNo, type.toUpperCase(), layerNm);
						_self.highlightFeature(type, coord, mgmtNo, layerNm)
						
						_self.setContextMenu(mgmtNo, layerNm, coord, type);	
					}
				});
			},
			
			setContextMenu: function(fcltMgmtNo, layerNm, geometry, geoType) { 
//				var userSelLayer = this._map.getCustomLayerByName(TGIS.Const.USER_DRAW.USER_LAYER_SELECT_FEATURE);
//				if ( userSelLayer ) {
//					userSelLayer.clearLayers();
//				}

				var contextMenu = this.getLayerMgmtCode(fcltMgmtNo);
				var itemList = this.getContextItemList(fcltMgmtNo, contextMenu,  layerNm, geometry, geoType);
				window.mgMap.setSelectedItemContextMenu(itemList, true);
			},
			
			setFeatureInfo: function(mgmtNo, type, layerNm){
				var _self = this;
				
				$("label[for='mapLayerNmLabel'").html(layerNm);
				$("label[for='mapSkMgmtNoLabel'").html("");
				var params = {'mgmt':mgmtNo, 'layrNm': layerNm, 'fcltyType' : type.toUpperCase()};
				
				_self.getMultiFcltyInfoData(params);
				_self.onClickMapLayerCheck(layerNm);
			},
			
			onClickMapLayerCheck : function (layer) { //사용자레이어 초기화
		    	for(var i=0; i < layer.length; i++){
					
					var key = "";
					if (layer[i].nm != undefined) {
						key = $("li:contains('"+layer[i].nm+"'):last").attr("layerid");
					} else {
						key = $("li:contains('"+layer+"'):last").attr("layerid");
					}
					
					if($("li [layerid="+key+"]").find('input').is(":checked") == false){
						$("li [layerid="+key+"]").find('input').trigger("click");
					}	    		
		    	}
			},
			
			getMultiFcltyInfoData : function (params){
				var param = {};
				var fcltyInfoArray = new Array();
				fcltyInfoArray.push(params);
				
				if (fcltyInfoArray.length > 0) {
					param.fcltyInfoList = fcltyInfoArray;
	
					var multiFcltyInfoAlopexGrid = Tango.ajax.init({
						url: "tango-transmission-gis-biz/transmission/gis/fm/multifcltyinfo/multifclty/lists"
							, data: param
							, flag: "multiFcltyInfoGrid"
						});
					multiFcltyInfoAlopexGrid.post().done(function(response, status, jqxhr, flag){
						
						if(response.lists.length > 0){
			            	// SK관리번호 출력
			            	$("label[for='mapSkMgmtNoLabel'").html(response.lists[0].skMgmtNo);					
						}
						
			     	}).fail();
				}
		    },
		    
		    highlightFeature: function(type, coord, mgmtNo, layerNm, fitFlag) {
		    	var _self = this;
		    	
		    	window.mgMap.clearSelectLayer();
		    	
		    	if (fitFlag == undefined) {
					fitFlag = true;
				}
		    	
		    	//onOffLayer
		    	var layers = window.mgMap.getLayersByAlias(layerNm);
				for (var i = 0; i < layers.length; i++) {
					layers[i].setVisible(true);
				}
				
				var hf = {};
				hf.coord = coord;
				hf.mgmtNo = mgmtNo;
				hf.style = type.toLocaleUpperCase();
				
				if (type.toLowerCase() == 'point') {
					hf.type = 'Point';
					fitFlag = false;
				} else if (type.toLowerCase() == 'line') {
					hf.type = 'LineString';
				} else if (type.toLowerCase() == 'polygon') {
					hf.type = 'Polygon';
				}
	
				var featureGeoJson = _self.createFeature(hf);
				var layer = L.GeoJSON.geometryToLayer(featureGeoJson);
				if (layer == null) {
					return;
				}
				layer.feature = L.GeoJSON.asFeature(featureGeoJson);
				layer.feature.getLayerId = function() {
					return '';
				}
				layer.feature.properties = {};
				layer.feature.properties.layrNm = layerNm;
				layer.feature.properties.fcltMgmtNo	 = mgmtNo;

				window.mgMap.setSelectFeatures([ layer ]);
				
				if (fitFlag) {
					window.mgMap.fitBounds(window.mgMap.getSelectLayer().getBounds());
				}
			},
		    
		    createFeature: function(param) {
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
							param.style = 'ETE_CABLE_T';	
						}else{
							param.style = 'ETE_CABLE_B';
						}
					} else if (param.type.toLowerCase() == 'polygon'
							&& param.style == null) {
						param.style = 'RING_CABLE_POLYGON';
					}
				}

//				if (!param.style) {
//					if (param.type.toLowerCase() == 'linestring' && param.style == null) {
//						if(param.systmClCd != null  && param.systmClCd == 'SK'){
//							param.style = 'ETE_CABLE_T';	
//						}else{
//							param.style = 'ETE_CABLE_B';
//						}
//					}
//				}
				
				if (param.type == 'point') {
					param.type = 'Point';
				}
				if (param.type == 'linestring' || param.type == 'line') {
					param.type = 'LineString';
				}
				if (param.type == 'polygon') {
					param.type = 'Polygon';
				}

				des.mgmtNo = param.mgmtNo;
				des.properties = param;
				des.type = 'Feature';
				des.geometry = {};
				des.geometry.type = param.type;
				des.geometry.coordinates = typeof (param.coord) == 'string' ? JSON.parse(param.coord) : param.coord;
				des.style = [ {
					id : param.style
				} ];
				return des;
			},
		    
		    getCenter: function(type, coords) {
				var i, halfDist, segDist, dist, p1, p2, ratio;

				var points = [];

				if (typeof (coords) == 'string') {
					coords = JSON.parse(coords);
				}
				if (!$.isArray(coords)) {
					return;
				}
				if (type.toUpperCase() == 'POINT') {
					if (!(coords instanceof L.LatLng)) {
						return new L.LatLng(coords[1], coords[0], coords[2]);
					}
					return coords;
				} else if (type.toUpperCase() == 'POLYGON') {
					coords = coords[0];
				}
				for (var i = 0; i < coords.length; i++) {
					if (!(coords[i] instanceof L.LatLng)) {
						coords[i] = new L.LatLng(coords[i][1], coords[i][0], coords[i][2]);
					}

					points[i] = window.mgMap.latLngToLayerPoint(coords[i]);
				}

				len = points.length;

				if (!len) {
					return null;
				}

				for (i = 0, halfDist = 0; i < len - 1; i++) {
					halfDist += points[i].distanceTo(points[i + 1]) / 2;
				}
				if (halfDist === 0) {
					return window.mgMap.layerPointToLatLng(points[0]);
				}

				for (i = 0, dist = 0; i < len - 1; i++) {
					p1 = points[i];
					p2 = points[i + 1];
					segDist = p1.distanceTo(p2);
					dist += segDist;

					if (dist > halfDist) {
						ratio = (dist - halfDist) / segDist;
						return window.mgMap.layerPointToLatLng([ p2.x - ratio * (p2.x - p1.x), p2.y - ratio * (p2.y - p1.y) ]);
					}
				}
			},
			getGisCblInfoData : function(cblMgmtNo) {
				$("#gisCblMgmtNo").val(cblMgmtNo);
				$("#caInfo").addClass("ca_open_aside");
				
				var clctDt = getClctDt();
				var orgGrpCd = getOrgGrpCd();
				
				$("#gisCblInfuProgress").progress({appendIn: true});
				$("#gisCblRskProgress").progress({appendIn: true});
				
				Tango.ajax({
		    		url: "tango-transmission-gis-biz/transmission/gis/rm/dashboard/getCblInfoData",
		    		data: {
		    			cblMgmtNo: cblMgmtNo,
		    			clctDt: clctDt,
		    			orgGrpCd: orgGrpCd
		    		},
		    		method : "GET"
		    	}).done(function(response, status, jqxhr, flag){
		    		//console.log("GIS 그리드 조회", response);
		    		$("#gisCblInfuDate").html(setClctDt(clctDt));
	    			$("#gisCblRskDate").html(setClctDt(clctDt));
		    		
		    		var infuParam = {};
		    		infuParam.chartId = "gisCblInfuChart";
		    		infuParam.gridId = "gisCblInfuGrid";
		    		
		    		var rskParam = {};
		    		rskParam.chartId = "gisCblRskChart";
		    		rskParam.gridId = "gisCblRskGrid";
		    		
		    		var infuDataArr = [];
		    		var rskDataArr = [];
		    		var xAxisArr = [];
		    		var infuObj = null;
		    		var rskObj = null;
		    		var date = "";
		    		var resLen = response.cblInfuRskChart.length;
		    		
		    		var sameNum = -1;
		    		var yearArr = getYearArr();
		    		
		    		var todayNum = 0;
		    		
		    		if (resLen > 0) {
		    			todayNum = getSameNum(clctDt, response.cblInfuRskChart);
		    			
			    		for (var i = 0; i < yearArr.length; i++) {
			    			sameNum = getSameNum(yearArr[i], response.cblInfuRskChart);
			    			
			    			infuObj = {};
		    				infuObj.date = yearArr[i];
		    				infuObj.cblMgmtNo = cblMgmtNo; 
		    				
		    				rskObj = {};
		    				rskObj.date = yearArr[i];
		    				rskObj.cblMgmtNo = cblMgmtNo;
		    				
		    				if (sameNum >= 0) {
		    					infuObj.y = response.cblInfuRskChart[sameNum].convInfuVal;
		    					rskObj.y = response.cblInfuRskChart[sameNum].rskVal;
		    				} else {
		    					infuObj.y = 0;
		    					rskObj.y = 0;
		    				}
		    				
		    				infuDataArr.push(infuObj);
		    				rskDataArr.push(rskObj);
			    		}
		    		} else {
		    			for (var i = 0; i < yearArr.length; i++) {
			    			infuObj = {};
		    				infuObj.date = yearArr[i];
		    				infuObj.y = 0;
		    				infuObj.cblMgmtNo = cblMgmtNo;
		    				
		    				rskObj = {};
		    				rskObj.date = yearArr[i];
		    				rskObj.y = 0;
		    				rskObj.cblMgmtNo = cblMgmtNo;
		    				
		    				infuDataArr.push(infuObj);
		    				rskDataArr.push(rskObj);
			    		}
		    		}
		    		
		    		infuParam.seriesName = "영향도";
	        		infuParam.color = "#f781f3";
	        		infuParam.dataArr = infuDataArr;
	        		
	        		rskParam.seriesName = "위험도";
	        		rskParam.color = "#81daf5";
	        		rskParam.dataArr = rskDataArr;
	        		
	        		drawCblLineChart(infuParam, "gisCblInfuGrid");
	        		drawCblLineChart(rskParam, "gisCblRskGrid");
	        		
	        		if (resLen > 0) {
	        			if (todayNum >= 0) {
	        				$("#gisCblInfuCnt").text(response.cblInfuRskChart[todayNum].convInfuVal);
				    		$("#gisCblRskCnt").text(response.cblInfuRskChart[todayNum].rskVal);
	        			} else {
	        				$("#gisCblInfuCnt").text("0");
				    		$("#gisCblRskCnt").text("0");
	        			}
			    		
	        			setCblInfuGrid("gisCblInfuGrid", response.cblInfuGrid);
						setCblRskGrid("gisCblRskGrid", response.cblRskGrid);
	        		} else {
	        			$("#gisCblInfuCnt").text("0");
	        			$("#gisCblRskCnt").text("0");

	        			setNullCblInfuGrid("gisCblInfuGrid", orgGrpCd);
	        			setNullCblRskGrid("gisCblRskGrid", orgGrpCd);
	        		}
	        		
	        		$("#gisCblInfuProgress").progress().remove();
					$("#gisCblRskProgress").progress().remove();
		    	}).fail(function(response, status, flag) {
		    		console.log("getCaInfuRskChart fail", response);
		    		$("#gisCblInfuProgress").progress().remove();
					$("#gisCblRskProgress").progress().remove();
				});
			}
	}
	
	return View;
	
})();

successFn = function(response, status, jqxhr, flag){
	var layrNm = response.layrNm;
	var pkValue = response.pkValue;
	var actMode = response.actMode;
	var attrModYn = response.attrModYn;

	if(flag == 'facilityInfoNodeMove'){
		distance = distanceNodeMove;
	}
	
	$a.popup({
		width: '750',
		height: '900',
		//data:{"layrNm":"TN_전주_타사", "pkValue":"29200EP045868"},
		data:{"actMode":actMode, "layrNm":layrNm, "pkValue":pkValue, "createFeaturePoint":createFeaturePoint, "distance":distance, "buildInOut":"OUT", "attrModYn":attrModYn},
		url: "/tango-transmission-gis-web/fm/facilityinfo/FacilityInfoMgmt.do",
		iframe: false,
		windowpopup: true,
		callback:function(){
			//Facility.selectedClear();
			 window.mgMap.clearSelectLayer();
		},
		title: '시설물 정보 관리',
		other: 'top=100,left:100,scrollbars=yes, location=no'
	});				    	
};

failFn = function(responseJSON, status, jqxhr, flag){
	if(status != 200){
    	alert(responseJSON.message);
    	return;
	}
};

createFacility = function(layrNm, actMode, buildInOut){
	$a.popup({
		width: '750',
		height: '900',
		//data:{"layrNm":"TN_전주_타사", "pkValue":"29200EP045868"},
		data:{"layrNm":layrNm},
		url: "../../fm/facilityinfo/FacilityInfoMgmt.do",
		iframe: false,
		windowpopup: true,
		title: '시설물 정보 관리',
		other: 'top=100,left:100,scrollbars=yes, location=no'
	});				    		
}

var leftHtml = [];
leftHtml.push('<div class="menu_aside" style="width:55px;height:100%;">');	
leftHtml.push('	<ul class="menu_list">');
leftHtml.push('		<li class="list_1"><a href="javascript:void(0);"><span class="blind">레이어</span></a></li>');
leftHtml.push('		<li class="list_2"><a href="javascript:void(0);" id="facility_btn"><span class="blind">시설물</span></a></li>');
leftHtml.push('	</ul>');
leftHtml.push('</div>');

var subLeftHtml = [];
subLeftHtml.push('<div class="menu_layer">');
subLeftHtml.push('	<div class="menu_layer_item item_1">');
subLeftHtml.push('		<div class="menu_layer_tit">');
subLeftHtml.push('			<h3>Map Layer</h3>');
subLeftHtml.push('		</div>');
subLeftHtml.push('	</div>');
subLeftHtml.push('	<a href="javascript:void(0);" class="btn_aside"><span class="blind">메뉴 열기닫기</a>');
subLeftHtml.push('</div>');

var subRightHtml = [];
subRightHtml.push('<div id="caInfo" class="right_menu_layer highcharts-background">');
subRightHtml.push('	<div style="width:100%;height:50%;">');
subRightHtml.push('		<div class="gis_infu_cbl_title">');
subRightHtml.push('			<span style="padding-left:103px;">영향도</span>');
subRightHtml.push('			<span style="margin-right:1px;float:right;"><button id="gisCblDtlBtn" type="button" class="Button button3 setEventDateBtn">상세</button></span>');
subRightHtml.push('		</div>');
subRightHtml.push('		<div id="gisCblInfuProgress" style="width:250px;height:318px;position:relative;">');
subRightHtml.push('			<div id="gisCblInfuCnt" class="gis_cbl_cnt"></div>');
subRightHtml.push('			<div class="gis_cbl_sub_title">영향도 추이 (<span id="gisCblInfuDate"></span>)</div>');
subRightHtml.push('			<div id="gisCblInfuChart" class="gis_cbl_chart"></div>');
subRightHtml.push('			<div class="gis_cbl_grid" style="height:175px;">');
subRightHtml.push('				<div id="gisCblInfuGrid"></div>');
subRightHtml.push('			</div>');
subRightHtml.push('		</div>');
subRightHtml.push('	</div>');
subRightHtml.push('	<div style="width:100%;height:50%;">');
subRightHtml.push('		<div class="gis_rsk_cbl_title">위험도</div>');
subRightHtml.push('		<div id="gisCblRskProgress" style="width:250px;height:345px;position:relative;">');
subRightHtml.push('			<div id="gisCblRskCnt" class="gis_cbl_cnt"></div>');
subRightHtml.push('			<div class="gis_cbl_sub_title">위험도 추이 (<span id="gisCblRskDate"></span>)</div>');
subRightHtml.push('			<div id="gisCblRskChart" class="gis_cbl_chart"></div>');
subRightHtml.push('			<div class="gis_cbl_grid" style="height:175px;">');
subRightHtml.push('				<div id="gisCblRskGrid" class="gis_cbl_grid"></div>');
subRightHtml.push('			</div>');
subRightHtml.push('		</div>');
subRightHtml.push('	</div>');
subRightHtml.push('</div>');
