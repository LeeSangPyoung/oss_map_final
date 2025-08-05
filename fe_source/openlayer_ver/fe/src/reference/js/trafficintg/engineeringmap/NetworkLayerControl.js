checkMtsoNm = true;

// 망 레이어 컨트롤
var NetworkLayerControl = {

	initialize: function() {
		let deferred = $.Deferred();
		let param = {};
		Util.jsonAjax({
			  url: '/transmisson/tes/engineeringmap/networktopo/getTreeNode'
			, data: param
			, method:'POST'
			, async:false}).done(
			function(result) {

				this.setSelectCode();

				this.createNetowrkTree(result);

				this.setEventListener();

				deferred.resolve();

			}.bind(this)
		);

		return deferred.promise();
	},

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    setSelectCode: function() {
    	let mgmtSelected = "SKT";

    	Util.jsonAjax({
			  url: '/transmisson/tes/commoncode/NWCMIMG/getTopoloyTypCdList'
			, data: {}
			, method:'GET'
			, async:false}).done(
			function(response) {
				NetworkLayerControl.makeLiExampleList($('#buttonExampleListByNetowkrLayer'), response);
			});

		Util.jsonAjax({
			  url: '/transmisson/tes/commoncode/eqpRoleDiv/C00148/'+ mgmtSelected
			, data: {}
			, method:'GET'
			, async:false}).done(
			function(response) {
				let $select = $('#eqpRoleDivCdListByNetowkrLayer');
				$select.clear();
	    		let option_data =  [];

	    		$.each(response, function(index, item) {
	    			option_data.push({
						"comCd"		:item.comCd,
						"comCdNm"	:item.comCdNm
						});
	    		});

	    		$select.setData({
	                 data: option_data
	    		});
			});
    },

    /*===============================*
	 * 명칭 레이어 보여주기/안보여주기
	 *===============================*/
	setViewLabelLayerFunc : function (layerId, visible) {
        //명칭레이어들 가져와서
	    let label_layer = window.mgMap.getLayerById(layerId);
	    if(visible){//보여주기
	    	label_layer.setVisible(true);
	    	let label_style = L.MG.StyleCfg.getStylesByLayerName(label_layer.getId())[0];
			label_style.vAlign = 'top';
			label_layer.properties.minZoom = 1;
			label_style.color = '#050099';
			let label_style_option = { type: 'TEXT', options: label_style };
			label_layer.setUserStyleConfig(label_style_option).refresh(true);
	    }else{//안보여주기
	    	label_layer.setVisible(false);
	    }
	},

    setViewLabelMtsoName: function () {
 		if(checkMtsoNm) { 	// 국사명 표시
 	 		if(T_SMTSO) { 	//T_국소명
 	 			NetworkLayerControl.setViewLabelLayerFunc('T_SMTSO_LABEL',true); //T_국소명 레이어
 	 		}else{
 	 			NetworkLayerControl.setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
 	 		}

 	 		if(T_TMOF) {	//T_전송실
 	 			NetworkLayerControl.setViewLabelLayerFunc('T_TMOF_LABEL',true); //T_전송실명 레이어
    		}else{
    			NetworkLayerControl.setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
    		}

 	 		if(T_COFC_MTSO) { //T_중심국
 	 			NetworkLayerControl.setViewLabelLayerFunc('T_COFC_MTSO_LABEL',true); //T_중심국_국사명 레이어
    		}else{
    			NetworkLayerControl.setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); //T_중심국_국사명 레이어
    		}

 	 		if(T_BMTSO) {     //T_기지국
 	 			NetworkLayerControl.setViewLabelLayerFunc('SKT_BMTSO_LABEL',true); // 공통 SKT기지국
    		}else{
    			NetworkLayerControl.setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); // 공통 SKT기지국
    		}
 		} else {
 			NetworkLayerControl.setViewLabelLayerFunc('SKT_BMTSO_LABEL',true); // 공통 SKT기지국
 			NetworkLayerControl.setViewLabelLayerFunc('T_COFC_MTSO_LABEL',true); // 공통 SKT기지국
 			NetworkLayerControl.setViewLabelLayerFunc('T_TMOF_LABEL',true); //T_전송실명 레이어
 			NetworkLayerControl.setViewLabelLayerFunc('T_SMTSO_LABEL',true); //T_국소명 레이어
 		}
    },

	setEventListener: function() {

		$('#div_network_layer .Arrow').on('click', function() {
			if ($(this).parent('li').hasClass('af-tree-expanded Expanded')) {
                $(this).parent('li').removeClass('af-tree-expanded Expanded');
                $(this).parent('li').data('expand', 'false');

                $(this).siblings('a').removeClass('af-pressed Selected');
                $(this).parent('li').children('ul').css('display','none');
            } else {
                $(this).parent('li').addClass('af-tree-expanded Expanded');
                $(this).parent('li').data('expand', 'true');

                $(this).siblings('a').addClass('af-pressed Selected');
                $(this).parent('li').children('ul').css('display','block');
            }
        });

		$('#div_network_layer .af-tree-link').on('click', function() {
			if ($(this).parent('li').hasClass('af-tree-expanded Expanded')) {
                $(this).parent('li').removeClass('af-tree-expanded Expanded');
                $(this).parent('li').data('expand', 'false');

                $(this).siblings('a').removeClass('af-pressed Selected');
                $(this).parent('li').children('ul').css('display','none');
            } else {
                $(this).parent('li').addClass('af-tree-expanded Expanded');
                $(this).parent('li').data('expand', 'true');

                $(this).siblings('a').addClass('af-pressed Selected');
                $(this).parent('li').children('ul').css('display','block');
            }
        });

		$('#div_network_layer .Checkbox').on('click', function() {
			let isChecked = $(this).prop('checked');
			if(isChecked || isChecked == "checked") {
				$(this).prop('checked',"checked");
			} else {
				$(this).prop('checked',"");
			}

//			LayerTreeControl.getBulLayer();
			NetworkLayerControl.setSelectCode();
			getNetworkMtsoLink();

		});

		$('#eqpRoleDivCdListByNetowkrLayer').change(function() {
//			LayerTreeControl.getBulLayer();
			getNetworkMtsoLink();
		});
	},

	// 구성 레이아웃 생성
	getBulLayer: function() {
		engMap = window.mgMap;

	    let mtsotypalue = []; //국사 유형 코드
	    let mgmtvalue   = [];

    	let zoomLevel 		= engMap.getZoom();
    	let mapBounds 		= engMap.getBounds(); //지도영역을 구한다.

    	let maplat_start 	= mapBounds._southWest.lat;
    	let maplat_end 		= mapBounds._northEast.lat;
    	let maplng_start  	= mapBounds._southWest.lng
    	let maplng_end 		= mapBounds._northEast.lng;

    	let param = new Object();

     	param.maplat_start = maplat_start;
 		param.maplat_end = maplat_end;
 		param.maplng_start = maplng_start;
 		param.maplng_end = maplng_end;

 		let isChecked = true;
		const layers = $('#div_network_layer .Checkbox[data-checktype="layer_network"]:checked');

		_.each(layers, function(layer, i) {
			let layrNm = $(layer).data("layrnm");
//			if(layrNm == "전송실") {
				T_TMOF = true;
				if(mtsotypalue.length == 0){
					mtsotypalue = 1;
 				} else {
					mtsotypalue += "," + 1;
 				}
//			} else if (layrNm == "중심국") {
				T_COFC_MTSO = true;
				if(mtsotypalue.length == 0){
					mtsotypalue = 2;
 				} else {
					mtsotypalue += "," + 2;
 				}
//			} else if (layrNm == "기지국") {
				T_BMTSO = true;
				if(mtsotypalue.length == 0){
					mtsotypalue = 3;
 				} else {
					mtsotypalue += "," + 3;
 				}
//			} else if (layrNm == "국소") {
				T_SMTSO = true;
				if(mtsotypalue.length == 0){
					mtsotypalue = 4;
 				} else {
					mtsotypalue += "," + 4;
 				}
//			}
		});

 		const uniqueArray = [...new Set(mgmtvalue)].join(',');
 		if(mgmtvalue.length > 0 && uniqueArray) {
 			param.mgmtvalue = uniqueArray;
 		}

 		if(mtsotypalue.length > 0) {
 	 		param.mtsotypalue = mtsotypalue;
 		}

		Util.jsonAjax({
			  url: '/transmisson/tes/topology/getBulLayer'
			, data: param
			, method:'GET'
			, async:false
			}).done(
			function(response) {
		    	/*...........................*
				  기준국사 지도에 표시
			  	*...........................*/
				let mtsoLayerLabel = window.mgMap.getCustomLayerByName("MTSO_LAYER_LABEL");
		    	if (mtsoLayerLabel) {
		    		mtsoLayerLabel.clearLayers();
		        } else {
		        	mtsoLayerLabel = window.mgMap.getCustomLayerByName("MTSO_LAYER_LABEL");
		        }
		  		//커스텀 레이어 가져오기
		  		let mtsoBulLayer = window.mtsoBulLayer;
		  		let style = null;
		  		//레이어초기화
		  		mtsoBulLayer.clearLayers();
		  		//features 변수 설정
		  		let result = {features: []};
		  		//layerList 확인
		  		if (response.LayerList.length !== 0) {
					    //feature 생성
		  			for(i=0; i<response.LayerList.length;i++){
		  				let mtsoTypCd = response.LayerList[i].mtsoTypCd;
		  				if(mtsoTypCd =="1"){ //1
		  					style = 'SUBMIT_SETL_PCE_STYLE_POINT_2';
		  				}else if(mtsoTypCd =="2"){ //2
		  					style = 'SUBMIT_SETL_PCE_STYLE_POINT_3';
		  				}else if(mtsoTypCd =="3"){ //3
		  					style = 'SUBMIT_SETL_PCE_STYLE_POINT_4';
		  				}else if(mtsoTypCd =="4"){ //3
		  					style = 'SUBMIT_SETL_PCE_STYLE_POINT_1';
		  				}

		  				let param = {};
					    	param.type = 'Point';
					    	param.style = style;
					    	param.mgmtNo = response.LayerList[i].mtsoId;
					    	param.coord =[response.LayerList[i].mtsoLngVal,response.LayerList[i].mtsoLatVal];
					    	result.features.push(_M.createFeature(param));
		  			}
		  		}

		  		//데이터 넣어주기
		  		mtsoBulLayer.addData(result);
		  		if(!checkMtsoNm){
		  			mtsoLayerLabel.clearLayers();
		  		}

		  		NetworkLayerControl.setViewLabelMtsoName(); // 국사명 표시

			//화면에표시
			//window.mgMap.fitBounds(mtsoBulLayer.getBounds());

			}.bind(this)
		);
	},
	createNetowrkTree: function(_tree) {
		let html = [];
		html.push('<ul id="network_tree" class="Tree menu_layer_tree" data-checkbox="visible" data-type="tree" data-classinit="true" draggable="false" data-converted="true">');

		let cnt = 1;
		for(let index = 0; index < _tree.length; index++) {
			if(!_tree[index].parentNodeId) {
				cnt = 1;

				html.push(' <li class="expandable af-tree-expanded Expanded" data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
				html.push(' <span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
				html.push(' <a class="af-tree-link af-pressed Selected">'+_tree[index].nodeName+'</a>'); //af-pressed Selected
				html.push('	<ul class="af-tree-group" style="display: block;">'); //display: block
			}

			if(_tree[index].parentNodeId && _tree[index].nodeId) {
				html.push('			<li class="labelLayer Checked" layerid="tree_layer'+cnt+'" data-expand="false" style="list-style: none;">');
				html.push('			<span class="line"></span>');
				html.push('			<input class="Checkbox" data-group="'+_tree[index].parentNodeId+'" data-layrNm="'+_tree[index].nodeName+'" data-nodeId="'+_tree[index].nodeId+'" data-lineDivVal="'+Util.isUndefined(_tree[index].netBdgmLineDivVal)+'" data-checktype="layer_network" checktype="layer" layerid="tree_layer'+cnt+'" type="checkbox" data-type="checkbox" data-classinit="true" data-converted="true" style="display: inline-block;">');
				html.push('			<span class="" style="visibility: visible;"></span>')
				html.push('					<img class="img-nw-label-on-off" src="../../resources/images/labelTagOff.png" layrNm="'+_tree[index].nodeName+'" nodeId="'+_tree[index].nodeId+'" lineDivVal="'+Util.isUndefined(_tree[index].netBdgmLineDivVal)+'" labelStatus="off">');
				html.push(_tree[index].nodeName+'</li>');
			}

			if((index+1) < _tree.length && !_tree[index+1].parentNodeId) {
				html.push('	</ul>');
				html.push('	</li>');
			}

			cnt++;
		}

		html.push('</ul>');

		$('#div_network_layer').append(html.join(''));

		this.setEventNwLabelOnOff();

	},

    getMaxZIndex : function () {
    	let max = Math.max.apply(null, $.map($('body *'), function(e, n) {
    		if($(e).css('position') !== 'static') {
    			return parseInt($(e).css('z-index')) || 1;
    		}
    	}));

    	return max;
    },

	/*-----------------------------*
     *  범례 ul > li tag 생성
     *-----------------------------*/
	makeLiExampleList: function($ul, response) {
		let height = (response.TopoTypData.length * 32) + 'px';
		let zindex = NetworkLayerControl.getMaxZIndex() + 1;
		$ul.css({
			'width' :'200px',
			'height':height,
			'align-item':'center',
			'z-index': zindex,
			'position':'fixed'
			});

		$ul.empty();

		$.each(response.TopoTypData, function(index, item) {
			let value = item.comCd;
			let text = item.comCdNm;
			let imgsrc = item.etcAttrVal1.replace("/transmission-web", "../..") + item.comCd + '.png';

			let $li = $('<li>', {
				'data-value': value,
				'data-icon' : imgsrc,
				css: {
					float: 'left',
					display: 'flex',
					cursor : 'pointer',
					valign : 'middle',
					'align-items' : 'center'
				}
			});

			let $img = $('<img>', {
				src: imgsrc,
				alt: text,
				css: {
					width:  '20px'
				,	height: '20px'
				,	marginRight: '5px'
				,	valign: 'middle'
				}
			});

			let $text = $('<span>').text(text);
			$li.append($img).append($text);
			$ul.append($li);
		});
	},

    setEventNwLabelOnOff: function() {
        $(".img-nw-label-on-off").on("click", function(e) {
        	let status = $(this).attr("labelStatus");

        	if(status == "off"){
        		$(this).attr("labelStatus", "on")
        		$(this).attr("src", "../../resources/images/labelTagOn.png");
        		cgfLayerNwLabelConf.push($(this).attr("nodeId"));
        	}else if(status == "on"){
        		$(this).attr("labelStatus", "off")
        		$(this).attr("src", "../../resources/images/labelTagOff.png");
        		cgfLayerNwLabelConf = cgfLayerNwLabelConf.filter(item => item !== $(this).attr("nodeId"));
        	}

        	getNetworkMtsoLink();
        });
    },

	getSelectedNodeLinkMenuItems: function(map, marker) {
		let markerLayer = window.mgMap.getCustomLayerByName(nodeNetWorkLineMarkerLayer);
		if(markerLayer) {//레이어 있으면 초기화
			markerLayer.clearLayers();
			markerLayer.closePopup();
	    }else{//레이어 없으면 새로 생성
	    	markerLayer = window.mgMap.addCustomLayerByName(nodeNetWorkLineMarkerLayer, {selectable: false});
	    }

		let items = [];
		let ringLineItem = {text: '링 정보(구성)',
				callback: function(e) {
					let popParams = {};
	    			popParams.fromMtsoId = marker.fromMtsoId;
	    			popParams.toMtsoId   = marker.toMtsoId;

	    			$a.popup({
	        			url: "/tango-transmission-web/trafficintg/engineeringmap/RingInfoPopup.do", // 팝업에 표시될 HTML
	        			iframe: true, // default,
	        			modal: false,
	    				movable:true,
	        			windowpopup: true,
	        			data: popParams,
	        			width: 830,
	        			height : 550,
	    				callback : function(data) { // 팝업창을 닫을 때 실행
	    		    	}
	        		});
				}
		};

		let ringListItem = {text: '링 목록(GIS)',
				callback: function(e) {
					let popParams = {};
					popParams.fromEqpId = marker.fromEqpId;
	    			popParams.toEqpId   = marker.toEqpId;

	    			$a.popup({
	        			url: "/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoRingList.do", // 팝업에 표시될 HTML
	        			iframe: true, // default,
	        			modal: false,
	    				movable:true,
	        			windowpopup: true,
	        			data: popParams,
	        			width: 1000,
	        			height : 650,
	    				callback : function(data) { // 팝업창을 닫을 때 실행

	    		    	}
	        		});
				}
		};

		let linksItem = {text: 'ETE 선로 조회',
				callback: function(e) {
					ExtnlCalnControl.drawGisRingLnPathLayer(marker);
				}
		};

		items.push(ringLineItem);
		items.push(ringListItem);
		items.push(linksItem);

	    return items;
	},

	getSelectedNodeNetworkMenuItems: function(map, marker) {
		let markerLayer = window.mgMap.getCustomLayerByName(nodeNetWorkMarkerLayer);
		if(markerLayer) {//레이어 있으면 초기화
			markerLayer.clearLayers();
			markerLayer.closePopup();
	    }else{//레이어 없으면 새로 생성
	    	markerLayer = window.mgMap.addCustomLayerByName(nodeNetWorkMarkerLayer, {selectable: false});
	    }

		let items = [];
		let mtsoinf = {text: '국사 통합 정보',
		          callback: function(e) {
						let mtsoGubun = "mtso";
						let linkTab = "tab_Mtso";

			        	let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
			        	let paramData = {
			        			mtsoEqpGubun : mtsoGubun,
			        			mtsoEqpId : marker.mtsoId,
			        			parentWinYn : 'Y',
			        			mtsoTypCd : marker.mtsoTypCd,		//국사유형
			        			linkTab : linkTab					//국사상세 탭선택 옵션
			        	};

			    		let popMtsoEqp = $a.popup({
			    			popid: tmpPopId,
			    			title: '국사/장비 정보',
			    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
			    			data: paramData,
			    			iframe: false,
			    			modal: false,
			    			movable:false,
			    			windowpopup: true,
			    			width : 1300,
			    			height : window.innerHeight * 0.83
			          });
				}
		};

		let mtsoItem = {text: '국사 구성도',
				callback: function(e) {

					let param = {mtsoId: marker.mtsoId,
								 mtsoNm: marker.mtsoNm,
								 lineDivVals: marker.lineDivVals,
								 netBdgmNetDivVal: marker.netBdgmNetDivVal
								};

			    	let width = 820, height = 950;

			    	let left = (window.innerWidth /2) - (width/2);
			    	let top  = (window.innerHeight/2) - (height/2);

			    	var strTitle = marker.netBdgmNm + "-" +marker.mtsoNm;
			    	param.title = strTitle;
					$a.popup({
						url: '/tango-transmission-web/trafficintg/engineeringmap/NetworkTopoRadialPopup.do',
						title: strTitle,
						iframe: false,
						modal: false,
						data: param,
						windowpopup: true,
						width:  width,
						height: height,
						center: true,
						movable:true,    // 이동 가능
						resizable:true,     // 리사이즈
						center: false,
						other: "top="+top+",left="+left+",scrollbars=auto,resizable=yes",
						beforeCallback : function(data) { // 팝업창을 닫을 때 실행
							return true; //리턴값이 true가 아닌경우 팝업창이 닫히지 않고 중단됨. true일 경우는 callback함수가 호출된다.
						},
						callback : function(data) { // 팝업창을 닫을 때 실행
						}
					});

				}
		};

		items.push(mtsoinf);
		items.push(mtsoItem);

	    return items;
    }
};
