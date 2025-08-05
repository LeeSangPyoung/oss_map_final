let engMap = new Object();
let checkMtsoNm = false;
let T_SMTSO = false; 	//T_국소명
let T_TMOF  = false; 	//T_전송실
let T_COFC_MTSO= false; //T_중심국
let T_BMTSO= false;     //T_기지국
let tree_list = [];
let tree_list2 = [];
let isPop = false;

var LayerTreeControl = {

	initialize: function() {
		let param = new Object();

		let deferred = $.Deferred();

		Util.jsonAjax({url: '/transmisson/tes/engineeringmap/gislist/search', method:'POST',async:true}).done(
			function(result) {
				this.createTreeLayerList(result);
				this.setEventListener();
				deferred.resolve();


//				Util.jsonAjax({url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpDsnLayerList', method:'GET',async:true}).done(
//						function(result1) {
//							LayerTreeControl.createEqpDsnTreeLayerList(result1);
//							LayerTreeControl.setEventListener();
//
//							deferred.resolve();
//						}
//					);

			}.bind(this)
		);
		return deferred.promise();
	},

    /*===============================*
	 * 명칭 레이어 보여주기/안보여주기
	 *===============================*/
	setViewLabelLayerFunc : function (layerId, visible) {
        //명칭레이어들 가져와서
	    let label_layer = window.mgMap.getLayerById(layerId);
	    if(visible){//보여주기
	    	label_layer.setVisible(true);
	    	//let label_style = L.MG.StyleCfg.getStylesByLayerName(label_layer.getId())[0];
	    	let label_style =L.StyleConfig().getStylesByLayerName(label_layer.getId())[0];
			label_style.vAlign = 'top';
			label_layer.getProperties().minZoom = 1;
			label_style.color = '#050099';
			let label_style_option = { type: 'TEXT', options: label_style };
			label_layer.setUserStyleConfig(label_style_option).refresh(true);
	    }else{//안보여주기
	    	label_layer.setVisible(false);
	    }
	},

	gettestBulLayer: function() {

		let layer_list = [];
		let disp_list  = [];
		let undsp_list= [];
		let layer_label_list = [];

		let layers = window.mgMap.getVectorLayers();

		let layerMap = [];

		layers.forEach(layer => {
			const alias = layer.getProperties().alias;
			if(!layerMap[alias]) layerMap[alias] = [];
			layerMap[alias].push(layer);
		});

		_.each(this.tree_list2, function(tree, i) {
			let l = layerMap[tree.layrNm] || [];
			layer_list.push(l);
		});

		engMap = window.mgMap;

		//조회 조건
	    let mtsostatvalue = []; //국사상태


 		if($('#div_tree_layer .Checkbox[data-group="구성1_조회옵션"][data-layrnm="운영국사"]').is(':checked')){
 			mtsostatvalue.push("01");
 		}

 		if($('#div_tree_layer .Checkbox[data-group="구성1_조회옵션"][data-layrnm="대기국사"]').is(':checked')){
 			mtsostatvalue.push("02");
 		}

 		_.each(bulLayerLabelConf, function(item, i) {
	 		let l = layers.filter(layer => (layer.getProperties().alias == item));
	 		layer_label_list.push(l[0].getProperties().name);
	 	});

 		let isChecked = true;
 		let layerAll = $('#div_tree_layer .Checkbox[data-checktype="layerAll"]');

 		let _layerAll = [];
 		_.each(layerAll , function(layerGrp, index) {
 			let grp =  $(layerGrp).data("group");
 			if(grp != "구성1_조회옵션"){
 				if( grp.indexOf("구성1") > -1) {
 					_layerAll.push($(layerGrp));
 				}
 			}
 		});

 		_.each(_layerAll , function(layerGrp, index) {
 			const group = layerGrp.data("group");
 			let _layers = [], _unLayers = [];

 			const checkedLayers   = $('#div_tree_layer .Checkbox[data-checktype="layer"]:checked');
 			const unCheckedLayers = $('#div_tree_layer .Checkbox[data-checktype="layer"]:not(:checked)');

			_.each(checkedLayers, function(lyr, i) {
				if($(lyr).data("group") == group) {
					_layers.push($(lyr));
				}
			});

			_.each(unCheckedLayers, function(lyr, i) {
				if($(lyr).data("group") == group) {
					_unLayers.push($(lyr));
				}
			});

			_.each(_layers, function(lyr, i) {
				let layrNm = $(lyr).data("layrnm");

				_.each(layer_list, function(layer, j) {
					if(!layer[0]) {
						return;
					}

					if(layer[0].getProperties().alias == layrNm) {
						disp_list.push(layer);
						return;
					}
				})
			});

			_.each(_unLayers, function(lyr, i) {
				let layrNm = $(lyr).data("layrnm");

				_.each(layer_list, function(layer, j) {
					if(!layer[0]) {
						return;
					}

					//if(layer[0].getProperties().alias == layrNm && layer[0].getProperties().visible) {
					if(layer[0].getProperties().alias == layrNm && layer[0].get('shouldBeVisible')) {
						undsp_list.push(layer);
						return;
					}
				})
			});
 		});

 		_.each(undsp_list, function(layer, index) {

	 		if(!layer) return;

	 		let layerId = layer[0].getProperties().name;
	 		LayerTreeControl.setLayerVisible(layerId, false, false, mtsostatvalue);
	 	});

	 	_.each(disp_list, function(layer, index) {

	 		if(!layer) return;

	 		let layerId = layer[0].getProperties().name;
	 		let labelLayer = LayerTreeControl.getLabelLayerById(layerId);

	 		let labelLayerVisiable = false;

	 		_.each(layer_label_list, function(item, idx){
		 		if(layerId == item) {
		 			labelLayerVisiable = true;
		 		}
		 	});

	 		LayerTreeControl.setLayerVisible(layerId, true, labelLayerVisiable, mtsostatvalue);
	 	});
	},

	// 구성 레이아웃 생성
	getBulLayer: function() {
//		if(callPath == "EQPDSN" && isPop == false){
//			LayerTreeControl.setRemoveAllCheckVal();
//		}

		let checkedLayers = $('#div_tree_layer .Checkbox[data-group^="구성_SK"]:checked');
		if(checkedLayers.length < 1){
			ZoomControl.setAllCfgMtsoLayerClear();
			return;
		}

		engMap = window.mgMap;

		//조회 조건
	    let mtsostatvalue = []; //국사상태

    	let mapBounds 		= engMap.getBounds(engMap.map, 'EPSG:4326'); //지도영역을 구한다.
    	let maplat_start 	= mapBounds[0][1];
    	let maplng_start  	= mapBounds[0][0];
    	let maplat_end 		= mapBounds[1][1];
    	let maplng_end 		= mapBounds[1][0];

    	let paramObj = {};
    	paramObj.maplat_start = maplat_start;
    	paramObj.maplat_end = maplat_end;
 		paramObj.maplng_start = maplng_start;
 		paramObj.maplng_end = maplng_end;

 		//구성_조회조건
// 		if($('#div_tree_layer .Checkbox[data-group="구성_조회옵션"][data-layrnm="국사명표시"]').is(':checked')){
// 			checkMtsoNm = true;
// 		}

 		if($('#div_tree_layer .Checkbox[data-group="구성_조회옵션"][data-layrnm="운영국사"]').is(':checked')){
 			mtsostatvalue.push("01");
 		}

 		if($('#div_tree_layer .Checkbox[data-group="구성_조회옵션"][data-layrnm="대기국사"]').is(':checked')){
 			mtsostatvalue.push("02");
 		}

 		if(mtsostatvalue.length > 0){
 			paramObj.mtsostatvalue = mtsostatvalue;
 		}

 		let isChecked = true;
 		let layerAll = $('#div_tree_layer .Checkbox[data-checktype="layerAll"]');

 		let _layerAll = [];
 		_.each(layerAll , function(layerGrp, index) {
 			let grp =  $(layerGrp).data("group");
 			if(grp != "구성_조회옵션"){
 				if( grp.indexOf("구성") > -1) {
 					_layerAll.push($(layerGrp));
 				}
 			}
 		});

 		_.each(_layerAll , function(layerGrp, index) {
 			const group = layerGrp.data("group");
 			let _layers = [];

 			const layers = $('#div_tree_layer .Checkbox[data-checktype="layer"]:checked');

			_.each(layers, function(lyr, i) {
				if($(lyr).data("group") == group) {
					_layers.push($(lyr));
				}
			});

 			let grpNm = group.substring(group.indexOf("_") + 1, group.length);

			_.each(_layers, function(layer, i) {
				let layrNm = $(layer).data("layrnm");
				let callBack = '';
				if(grpNm == "SKT") {
					paramObj.mgmtvalue = [grpNm]; //관리그룹
					if(layrNm == "전송실") {
     					paramObj.mtsotypalue = ["1"]; //국사 유형 코드

     					if(ZoomControl.setCfgCtl(grpNm, layrNm)){
     						$('.right-contents').progress();
     						let param = Util.convertQueryString(paramObj);

     						LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', sktTmofLayer);
     						callBack = sktTmofLayer;
     					}
 					} else if (layrNm == "중심국") {
 						paramObj.mtsotypalue = ["2"]; //국사 유형 코드

     					if(ZoomControl.setCfgCtl(grpNm, layrNm)){
     						$('.right-contents').progress();
     						let param = Util.convertQueryString(paramObj);

     						LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', sktCofcLayer);
     						callBack = sktCofcLayer;
     					}
 					} else if (layrNm == "기지국") {
 						paramObj.mtsotypalue = ["3"]; //국사 유형 코드

     					if(ZoomControl.setCfgCtl(grpNm, layrNm)){
     						$('.right-contents').progress();
     						let param = Util.convertQueryString(paramObj);

     						LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', sktBmtsoLayer);
     						callBack = sktBmtsoLayer;
     					}
 					} else if (layrNm == "국소") {
 						paramObj.mtsotypalue = ["4"]; //국사 유형 코드

     					if(ZoomControl.setCfgCtl(grpNm, layrNm)){
     						$('.right-contents').progress();
     						let param = Util.convertQueryString(paramObj);

     						LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', sktSmtsoLayer);
     						callBack = sktSmtsoLayer;
     					}
 					}
	 			} else if(grpNm == "SKB") {
	 				paramObj.mgmtvalue = [grpNm];
 					if(layrNm == "정보센터") {
 						paramObj.mtsotypalue = ["1"]; //국사 유형 코드

     					if(ZoomControl.setCfgCtl(grpNm, layrNm)){
     						$('.right-contents').progress();
     						let param = Util.convertQueryString(paramObj);

     						LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', skbInfCntrLayer);
     						callBack = skbInfCntrLayer;
     					}
 					} else if (layrNm == "국사") {
 						paramObj.mtsotypalue = ["2"]; //국사 유형 코드

     					if(ZoomControl.setCfgCtl(grpNm, layrNm)){
     						$('.right-contents').progress();
     						let param = Util.convertQueryString(paramObj);

     						LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', skbMtsoLayer);
     						callBack = skbMtsoLayer;
     					}
 					} else if (layrNm == "국소") {
 						paramObj.mtsotypalue = ["4"]; //국사 유형 코드

     					if(ZoomControl.setCfgCtl(grpNm, layrNm)){
     						$('.right-contents').progress();
     						let param = Util.convertQueryString(paramObj);

     						LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', skbSmtsoLayer);
     						callBack = skbSmtsoLayer;
     					}
 					}
	 			}

				//refresh용 함수저장
				const clonedParamObj = JSON.parse(JSON.stringify(paramObj));

				window.mgMap._layerParamMap[callBack] = clonedParamObj;
				window.mgMap._layerReloadFnMap[callBack] = () => {
					const param = Util.convertQueryString(window.mgMap._layerParamMap[callBack]);
					LayerTreeControl.httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getBulLayer', param, 'GET', callBack);
				};

 			});
 		});
	},

	/*==========================*
	 * httpRequest실행
	 *==========================*/
	httpRequest : function( Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(this.successCallback)
		  .fail(this.failCallback);
    },

    /*==========================*
	 * httpRequest 실패
	 *==========================*/
    failCallback: function (response, status, jqxhr, flag) {
    	if(flag == 'searchbulLayer'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}


    	if(flag == sktTmofLayer) { //SKT_전송실
    		$('.right-contents').progress().remove();
    		callMsgBox('','I', "SKT_전송실 " + configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == sktCofcLayer) { //SKT_중심국
    		$('.right-contents').progress().remove();
    		callMsgBox('','I', "SKT_중심국 " + configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == sktBmtsoLayer) { //SKT_기지국
    		$('.right-contents').progress().remove();
    		callMsgBox('','I', "SKT_기지국 " + configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == sktSmtsoLayer) { //SKT_국소
    		$('.right-contents').progress().remove();
    		callMsgBox('','I', "SKT_국소 " + configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == skbInfCntrLayer) { //SKB_정보센터
    		$('.right-contents').progress().remove();
    		callMsgBox('','I', "SKB_정보센터 " + configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == skbMtsoLayer) { //SKB_국사
    		$('.right-contents').progress().remove();
    		callMsgBox('','I', "SKB_국사 " + configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == skbSmtsoLayer) { //SKB_국소
    		$('.right-contents').progress().remove();
    		callMsgBox('','I', "SKB_국소 " + configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == "searchDemdLinkMtso"){
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    },

    setViewLabelMtsoName: function () {
 		if(checkMtsoNm) { 	// 국사명 표시
 	 		if(T_SMTSO) { 	//T_국소명
 	 			LayerTreeControl.setViewLabelLayerFunc('T_SMTSO_LABEL',true); //T_국소명 레이어
 	 		}else{
 	 			LayerTreeControl.setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
 	 		}

 	 		if(T_TMOF) {	//T_전송실
 	 			LayerTreeControl.setViewLabelLayerFunc('T_TMOF_LABEL',true); //T_전송실명 레이어
    		}else{
    			LayerTreeControl.setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
    		}

 	 		if(T_COFC_MTSO) { //T_중심국
 	 			LayerTreeControl.setViewLabelLayerFunc('T_COFC_MTSO_LABEL',true); //T_중심국_국사명 레이어
    		}else{
    			LayerTreeControl.setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); //T_중심국_국사명 레이어
    		}

 	 		if(T_BMTSO) {     //T_기지국
 	 			LayerTreeControl.setViewLabelLayerFunc('SKT_BMTSO_LABEL',true); // 공통 SKT기지국
    		}else{
    			LayerTreeControl.setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); // 공통 SKT기지국
    		}
 		} else {
 			LayerTreeControl.setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); // 공통 SKT기지국
			LayerTreeControl.setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); // 공통 SKT기지국
    		LayerTreeControl.setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
    		LayerTreeControl.setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
 		}
    },

	/*==========================*
	 * httpRequest 성공
	 *==========================*/
	successCallback : function ( response, status, jqxhr, flag ) {
		engMap = window.mgMap;

		let mtsoLayerLabel = window.mgMap.getCustomLayerByName("MTSO_LAYER_LABEL");
    	if (mtsoLayerLabel) {
    		window.mgMap.getMap().removeLayer(mtsoLayerLabel);
    		mtsoLayerLabel.clearLayers();
        } else {
        	mtsoLayerLabel = window.mgMap.getCustomLayerByName("MTSO_LAYER_LABEL");
        }

    	/*...........................*
		기준국사 지도에 표시
    	*...........................*/
    	if(flag == sktTmofLayer) { //SKT_전송실
    		LayerTreeControl.drawBulMtsoLayer(response.LayerList, sktTmofLayer);

    		if(cgfLayerLabelConf[sktTmofLayer] == "on") {
    			LayerTreeControl.drawBulMtsoLabelLayer(response.LayerList, sktTmofLayerLabel);
    		}
    	}

    	if(flag == sktCofcLayer) { //SKT_중심국
    		LayerTreeControl.drawBulMtsoLayer(response.LayerList, sktCofcLayer);

    		if(cgfLayerLabelConf[sktCofcLayer] == "on") {
    			LayerTreeControl.drawBulMtsoLabelLayer(response.LayerList, sktCofcLayerLabel);
    		}
    	}

    	if(flag == sktBmtsoLayer) { //SKT_기지국
    		LayerTreeControl.drawBulMtsoLayer(response.LayerList, sktBmtsoLayer);

    		if(cgfLayerLabelConf[sktBmtsoLayer] == "on") {
    			LayerTreeControl.drawBulMtsoLabelLayer(response.LayerList, sktBmtsoLayerLabel);
    		}
    	}

    	if(flag == sktSmtsoLayer) { //SKT_국소
    		LayerTreeControl.drawBulMtsoLayer(response.LayerList, sktSmtsoLayer);

    		if(cgfLayerLabelConf[sktSmtsoLayer] == "on") {
    			LayerTreeControl.drawBulMtsoLabelLayer(response.LayerList, sktSmtsoLayerLabel);
    		}
    	}

    	if(flag == skbInfCntrLayer) { //SKB_정보센터
    		LayerTreeControl.drawBulMtsoLayer(response.LayerList, skbInfCntrLayer);

    		if(cgfLayerLabelConf[skbInfCntrLayer] == "on") {
    			LayerTreeControl.drawBulMtsoLabelLayer(response.LayerList, skbInfCntrLayerLabel);
    		}
    	}

    	if(flag == skbMtsoLayer) { //SKB_국사
    		LayerTreeControl.drawBulMtsoLayer(response.LayerList, skbMtsoLayer);

    		if(cgfLayerLabelConf[skbMtsoLayer] == "on") {
    			LayerTreeControl.drawBulMtsoLabelLayer(response.LayerList, skbMtsoLayerLabel);
    		}
    	}

    	if(flag == skbSmtsoLayer) { //SKB_국소
    		LayerTreeControl.drawBulMtsoLayer(response.LayerList, skbSmtsoLayer);

    		if(cgfLayerLabelConf[skbSmtsoLayer] == "on") {
    			LayerTreeControl.drawBulMtsoLabelLayer(response.LayerList, skbSmtsoLayerLabel);
    		}
    	}

    	if(flag =="searchbulLayer") {
    		//커스텀 레이어 가져오기
    		let mtsoBulLayer = window.mtsoBulLayer;
    		let style = null;
    		//레이어초기화
    		mtsoBulLayer.clearLayers();
    		window.mgMap.getMap().removeLayer(mtsoBulLayer);
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
    		//mtsoBulLayer.addData(result);
    		if(checkMtsoNm){
    		}else{
    			mtsoLayerLabel.clearLayers();
    			window.mgMap.getMap().removeLayer(mtsoLayerLabel);
    		}

			LayerTreeControl.setViewLabelMtsoName(); // 국사명 표시

    		//화면에표시
    		//window.mgMap.fitBounds(mtsoBulLayer.getBounds());
    	}

    	if(flag == "searchDemdLinkMtso"){
    		LayerTreeControl.drawEqpDsnMtsoLayer(response.dataList);
    	}
	},

	// indeterminate 처리
	updateLayerAllCheckbox: function(group) {
		if( !group ) {
			return;
		}

		let $layerAllCheckbox = $('.Checkbox[data-checktype="layerAll"][data-group="'+group+'"]')[0];
		let $childCheckboxes  = $('.Checkbox[data-checktype="layer"][data-group="'+group+'"]');

		let total = $childCheckboxes.length;
		let checked = $childCheckboxes.filter(':checked').length;

		if (checked === 0) {
			$layerAllCheckbox.indeterminate = false;
			$layerAllCheckbox.checked = false;
		} else if (checked === total) {
			$layerAllCheckbox.indeterminate = false;
			$layerAllCheckbox.checked = true;
		} else {
			$layerAllCheckbox.indeterminate = true;
		}
	},

	setEventListener: function() {
		checkMtsoNm = false;

		$allCheckBox = $('#div_tree_layer .Checkbox');
		_.each($allCheckBox, function($chk, index) {
			const chktp = $($chk).data("checktype");
			const group = $($chk).data("group");

			LayerTreeControl.updateLayerAllCheckbox(group);

			if (chktp == "layerAll") {
				$($chk).on('change',function() {
					const isChecked = $($chk).prop('checked');
					$('#div_tree_layer .Checkbox[data-checktype="layer"]').filter(chk => ($(chk).data("group") == group)).prop('checked',isChecked);
					LayerTreeControl.updateLayerAllCheckbox(group);
				});
			} else if (chktp == "layer") {
				$($chk).on('change', function() {
					LayerTreeControl.updateLayerAllCheckbox(group);
				});
			}
		});

		$('#div_tree_layer .Arrow').on('click', function() {
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

		$('#div_tree_layer .Checkbox').on('click', function() {
			checkMtsoNm = false;

			let isChecked = $(this).prop('checked');
			if(isChecked || isChecked == "checked") {
				$(this).prop('checked',"checked");
			} else {
				$(this).prop('checked',"");
			}

			let chktp = $(this).data("checktype");
			let group = $(this).data("group");

			if(chktp == "layerAll") {
				isChecked = $(this).prop('checked');

				let $parentLi = $(this).closest('li');
				let $lis = $parentLi.find('ul').find('li');
				$lis.each(function() {
					let $checkbox = $(this).find('.Checkbox');
					$checkbox.each(function() {
						$(this).prop('checked', isChecked);
					});
				});
			} else {

			}

//			if($('#div_tree_layer .Checkbox[data-group="구성_조회옵션"][data-layrnm="국사명표시"]').is(':checked')){
//	 			checkMtsoNm = true;
//	 		}else{
//	 			checkMtsoNm = false;
//	 		}
			ZoomControl.setAllCfgMtsoLayerLabelClear(); //구성에서 활성화되어있는 라벨레이어 모두 초기화

			LayerTreeControl.updateLayerAllCheckbox(group);
			LayerTreeControl.getBulLayer();
			//LayerTreeControl.gettestBulLayer();
			LayerTreeControl.getGisLayer();
			//편집모드일때 스냅refresh
			const edit = L.EditSnapTrail.getInstance(L.GeoMap().map);
			if(edit?.isEditSnapModeActive?.()) {
				edit.refreshSnap();
			}
        });

		$('#div_tree_layer .af-tree-link').on('click', function() {
			let $parentLi = $(this).closest('li');

 			if ($(this).hasClass('af-pressed Selected')) {
 				$(this).removeClass('af-pressed Selected');
 				$parentLi.removeClass('af-tree-expanded Expanded');
 				$parentLi.data('expand', 'false');
		        $parentLi.find('ul').css('display','none');
		    } else {
 				$(this).addClass('af-pressed Selected');
 				$parentLi.addClass('af-tree-expanded Expanded');
 				$parentLi.data('expand', 'true');
		        $parentLi.find('ul').css('display','block');
		    }
		});
	},

	// GIS 레이어 디스플레이
	getGisLayer: function() {
		let layer_list = [];
		let disp_list  = [];
		let undsp_list= [];
		let layer_label_list = [];

		let layers = window.mgMap.getVectorLayers();

		let layerMap = [];

		layers.forEach(layer => {
			const alias = layer.getProperties().alias;
			if(!layerMap[alias]) layerMap[alias] = [];
			layerMap[alias].push(layer);
		});

		_.each(this.tree_list, function(tree, i) {
			let l = layerMap[tree.layrNm] || [];
			layer_list.push(l);
		});

	 	_.each(gisLayerLabelConf, function(item, i) {
	 		let l = layers.filter(layer => (layer.getProperties().alias == item));
	 		layer_label_list.push(l[0].getProperties().name);
	 	});

	 	let isChecked = true;
 		let layerAll = $('#div_tree_layer .Checkbox[data-checktype="layerAll"]');

 		let _layerAll = [];
 		_.each(layerAll , function(layerGrp, index) {
 			let grp =  $(layerGrp).data("group");
 			if( grp.indexOf("GIS") > -1) {
 				_layerAll.push($(layerGrp));
 			}
 		});

 		_.each(_layerAll , function(layerGrp, index) {
 			const group = layerGrp.data("group");
 			let _layers = [], _unLayers = [];

 			const checkedLayers   = $('#div_tree_layer .Checkbox[data-checktype="layer"]:checked');
 			const unCheckedLayers = $('#div_tree_layer .Checkbox[data-checktype="layer"]:not(:checked)');

			_.each(checkedLayers, function(lyr, i) {
				if($(lyr).data("group") == group) {
					_layers.push($(lyr));
				}
			});

			_.each(unCheckedLayers, function(lyr, i) {
				if($(lyr).data("group") == group) {
					_unLayers.push($(lyr));
				}
			});

			_.each(_layers, function(lyr, i) {
				let layrNm = $(lyr).data("layrnm");

				_.each(layer_list, function(layer, j) {
					if(!layer[0]) {
						return;
					}

					if(layer[0].getProperties().alias == layrNm) {
						disp_list.push(layer);
						return;
					}
				})
			});

			_.each(_unLayers, function(lyr, i) {
				let layrNm = $(lyr).data("layrnm");

				_.each(layer_list, function(layer, j) {
					if(!layer[0]) {
						return;
					}

					if(layer[0].getProperties().alias == layrNm && layer[0].get('shouldBeVisible')) {
						undsp_list.push(layer);
						return;
					}
				})
			})
 		});

/*	 	_.each(undsp_list, function(layer, index) {

	 		if(!layer) return;

	 		let layerId = layer[0].getProperties().name;
	 		LayerTreeControl.setLayerVisible(layerId, false, false);
	 	});*/

	 	_.each(undsp_list, function(layer, index) {

	 		if(!layer) return;

	 		let layerId = layer[0].getProperties().name;
	 		let labelLayer = LayerTreeControl.getLabelLayerById(layerId);

	 		let labelLayerVisiable = false;

	 		_.each(layer_label_list, function(item, idx){
		 		if(layerId == item) {
		 			labelLayerVisiable = true;
		 		}
		 	});

	 		LayerTreeControl.setLayerVisible(layerId, false, labelLayerVisiable);
	 	});

	 	_.each(disp_list, function(layer, index) {

	 		if(!layer) return;

	 		let layerId = layer[0].getProperties().name;
	 		let labelLayer = LayerTreeControl.getLabelLayerById(layerId);

	 		let labelLayerVisiable = false;

	 		_.each(layer_label_list, function(item, idx){
		 		if(layerId == item) {
		 			labelLayerVisiable = true;
		 		}
		 	});

	 		LayerTreeControl.setLayerVisible(layerId, true, labelLayerVisiable);
	 	});
	},

	setVectorLayer: function () {
		let layer_list = [];
	 	let layers = window.mgMap.getVectorLayers();
	 	_.each(this.tree_list, function(tree, i) {
	 		let l = layers.filter(layer => (layer.getProperties().alias == tree.layrNm));
	 		layer_list.push(l);
	 	});

	 	_.each(layer_list, function(layer, index) {

	 		if(!layer) return;

	 		layer = LayerTreeControl.getVectorVislbleLevelCtl(layer, window.mgMap);
	 		layer = LayerTreeControl.getWmsVislbleLevelCtl(layer, window.mgMap);

	 	});
	},

	getWmsVislbleLevelCtl : function (layer, map) {

		if(!layer) {
			return;
		}

		var lyrId = layer.getProperties().name;

		// VECTER LAYER MIN = RASTERGROUP MAX + 1 = VECTER MIN값으로 설정
		var wmsLyr = map.getLayerById(lyrId + '_RASTERGROUP');
		if ( wmsLyr ) {
			var zoom = wmsLyr.getMaxZoom();
            layer.getProperties().minZoom = zoom+1;
            if ( layer.getProperties().minZoom>layer.getProperties().maxZoom ) {
                layer.getProperties().maxZoom = layer.getProperties().minZoom;
            }

            //layer._initializeUserConfig(layer.getProperties());

            LayerTreeControl.setWmsLabelLayerVisibleLevelCtl(lyrId, zoom, map);
		}

		return layer;
	},

	setWmsLabelLayerVisibleLevelCtl : function (lyrId, zoom, map) {

		var labelLyr = map.getLayerById(lyrId + '_LABEL');
		var wmsLabelLyr = map.getLayerById(lyrId + '_LABEL_RASTERGROUP');

        if ( wmsLabelLyr ) {
        	if (lyrId != null && lyrId != undefined && lyrId != 'T_COFC_MTSO' && lyrId != 'T_TMOF' && lyrId != 'B_MTSO') {
            	labelLyr.getProperties().minZoom = zoom+1;
        	}
            if ( labelLyr.getProperties().minZoom-1>wmsLabelLyr.getProperties().maxZoom ) {
            	wmsLabelLyr.getProperties().maxZoom = labelLyr.getProperties().minZoom-1;
            }
        }
	},

	// raster LAYER 레벨 설정
	getVectorVislbleLevelCtl : function(lyr, map) {

		let layer = lyr[0];

		if(!layer) return;

		var lyrId = layer.getProperties().name;

		if ( lyrId == 'DAWUL_SIDO_A_TILE' || lyrId == 'DAWUL_SGG_A_TILE' ) {

		} else {
			// RASTER LAYER의 레벨이 RASTERGROUP보다 높은레벨값에서 사용되기 때문에 RASTER레이어 설정 후 RASTERGROUP설정
			// RASTER MAX + 1 = VECTER MIN값으로 설정
			var rasterLyr = map.getLayerById(lyrId + '_RASTER');

			if ( rasterLyr ) {
				var zoom = rasterLyr.getMaxZoom();
				layer.getProperties().minZoom = zoom+1;
				if ( layer.getProperties().minZoom>layer.getProperties().maxZoom ) {
					layer.getProperties().maxZoom = layer.getProperties().minZoom;
				}

				//layer._initializeUserConfig(layer.getProperties());

				LayerTreeControl.setLabelLayerVisibleLevelCtl(lyrId, zoom, map);
			} else {

				// VECTER LAYER MIN = RASTERGROUP MAX + 1 = VECTER MIN값으로 설정
				var rasterGroupLyr = map.getLayerById(lyrId + '_RASTERGROUP');
				if ( rasterGroupLyr ) {
					var zoom = rasterGroupLyr.getMaxZoom();
					layer.getProperties().minZoom = zoom+1;
					if ( layer.getProperties().minZoom>layer.getProperties().maxZoom ) {
						layer.getProperties().maxZoom = layer.getProperties().minZoom;
					}

					//layer._initializeUserConfig(layer.getProperties());

					LayerTreeControl.setLabelLayerVisibleLevelCtl(lyrId, zoom, map);
				}
			}
		}

		return layer;
	},

	setLabelLayerVisibleLevelCtl : function (lyrId, zoom, map) {
		if (lyrId != null && lyrId != undefined && lyrId != 'T_COFC_MTSO' && lyrId != 'T_TMOF' && lyrId != 'B_MTSO') {
			var labelLyr = map.getLayerById(lyrId + '_LABEL');
            if ( labelLyr ) {
            	labelLyr.getProperties().minZoom = zoom+1;
                if ( labelLyr.getProperties().minZoom>labelLyr.getProperties().maxZoom ) {
                    labelLyr.getProperties().maxZoom = labelLyr.getProperties().minZoom;
                }
            }
		}
	},

	//레이어트리 생성
	createTreeLayerList: function(layerList) {
		const composition_tree = [
						{mm: "구성", layrGrpNm: "SKT", 		layrNm: "전송실", 		layrDispYn: "Y", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "SKT", 		layrNm: "중심국", 		layrDispYn: "Y", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "SKT", 		layrNm: "기지국", 		layrDispYn: "N", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "SKT", 		layrNm: "국소",   		layrDispYn: "N", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "SKB", 		layrNm: "정보센터",		layrDispYn: "N", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "SKB", 		layrNm: "국사", 		layrDispYn: "N", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "SKB", 		layrNm: "국소", 		layrDispYn: "N", editPsblYn: "Y"},
//						{mm: "구성", layrGrpNm: "조회옵션", layrNm: "국사명표시",	layrDispYn: "N", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "조회옵션", layrNm: "운영국사", 	layrDispYn: "Y", editPsblYn: "Y"},
						{mm: "구성", layrGrpNm: "조회옵션", layrNm: "대기국사", 	layrDispYn: "N", editPsblYn: "Y"}
					]

		const composition_tree1 = [
			{mm: "구성1", layrGrpNm: "SKT", 		layrNm: "SKT_전송실1", 		layrDispYn: "Y", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "SKT", 		layrNm: "SKT_중심국1", 		layrDispYn: "Y", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "SKT", 		layrNm: "SKT_기지국1", 		layrDispYn: "N", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "SKT", 		layrNm: "SKT_국소1",   		layrDispYn: "N", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "SKB", 		layrNm: "SKB_정보센터1",		layrDispYn: "N", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "SKB", 		layrNm: "SKB_국사1", 		layrDispYn: "N", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "SKB", 		layrNm: "SKB_국소1", 		layrDispYn: "N", editPsblYn: "Y"},
//			{mm: "구성1", layrGrpNm: "조회옵션", layrNm: "국사명표시",	layrDispYn: "N", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "조회옵션", layrNm: "운영국사", 	layrDispYn: "Y", editPsblYn: "Y"},
			{mm: "구성1", layrGrpNm: "조회옵션", layrNm: "대기국사", 	layrDispYn: "N", editPsblYn: "Y"}
		]

		const gis_tree = layerList.filter(layer => (
						(layer.mm == "광설비" && (layer.layrGrpNm == "SKT" ||layer.layrGrpNm == "SKB" ||layer.layrGrpNm == "공통" ))
					  ||(layer.mm == "주요망" && (layer.layrGrpNm == "SKT" ||layer.layrGrpNm == "SKB"))
					  ||(layer.mm == "M/W설비")
					  ||(layer.mm == "한전설비" && (layer.layrGrpNm == "가공" ||layer.layrGrpNm == "지중"))
					  ||(layer.mm == "기본도" && (layer.layrGrpNm == "공간정보포탈" ||layer.layrGrpNm == "기본도"))
					  ||(layer.mm == "기본도")
					  ||(layer.mm == "지도정보")
					  )
					);

		this.tree_list = gis_tree;
		//this.tree_list2 = composition_tree1;
		gisLayerConf = gis_tree;
		let html = [];
		html.push('<ul id="tree1" class="Tree menu_layer_tree" data-checkbox="visible" data-type="tree" data-classinit="true" draggable="false" data-converted="true">');
		html.push('     <li class="expandable af-tree-expanded Expanded" data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
		html.push('     <span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
		html.push('     <a tabindex="0" class="af-tree-link af-pressed Selected">구성 </a>'); //af-pressed Selected
		html.push('     <ul class="af-tree-group" style="display: block;">'); //display: block

		// 구성 트리 구조
		html = this.maketTreeLayerHtml(composition_tree, html);

	/*	html.push('     <li class="expandable af-tree-expanded Expanded" data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
		html.push('     <span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
		html.push('     <a tabindex="0" class="af-tree-link af-pressed Selected">구성1 </a>'); //af-pressed Selected
		html.push('     <ul class="af-tree-group" style="display: block;">'); //display: block
		html = this.maketTreeLayerHtml(composition_tree1, html);*/

		// GIS 트리 구조
		html.push('     <li class="expandable af-tree-expanded Expanded" data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
		html.push('     <span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
		html.push('     <a tabindex="0" class="af-tree-link af-pressed Selected">GIS</a>'); //af-pressed Selected
		html.push('     <ul class="af-tree-group" style="display: block;">'); //display: block

		html = this.maketTreeLayerHtml(gis_tree, html);

		html.push('		</ul>');
		html.push('		</li>');

		html.push('</ul>');

		$('#div_tree_layer').append(html.join(''));


		this.setEventCfgLabelOnOff();
		this.setEventGisLabelOnOff();
		this.setEventBulLabelOnOff();
	},

	maketTreeLayerHtml: function(_tree, html) {
		let preNm, preGrpNm;
		let cnt = 1;
		let mmcnt = 0;
		let mmIdx = 0;
		let grpMmIdx = 0;

		for(let index = 0; index < _tree.length; index++) {
			let keys = [], nextKeys = [];
			let item = _tree[index];
			let nextItem,
				mm,
				grpNm,
				nextMm,
				nextGrpNm ,
				layrNm,
				layrDispYn,
				editPsblYn,
				dataGrpNm,
				imgSrc;

			if(!item) {
				continue;
			}

			keys = Object.keys(item);

			if(index + 1 < _tree.length) {
				nextItem = _tree[index + 1];
			}

			if(nextItem) {
				nextKeys = Object.keys(nextItem);
			}

			mm = item[keys[0]];
			grpNm = item[keys[1]];
			layrNm = item[keys[2]];
			layrDispYn = item[keys[3]];
			editPsblYn = item[keys[4]];

			if(mm == "구성") {
				dataGrpNm = mm + "_" + grpNm;
				imgSrc = dataGrpNm  + "_" + layrNm;
			} else if(mm == "구성1") {
				dataGrpNm = mm + "_" + grpNm;
				imgSrc = dataGrpNm  + "_" + layrNm;
			} else {
				dataGrpNm = "GIS" + "_" + mm + "_" + grpNm;
			}

			if(nextItem && nextKeys) {
				nextMm = nextItem[keys[0]];
				nextGrpNm = nextItem[keys[1]];
			}

			if((!preNm || preNm !== mm) && mm != "구성") {
				mmIdx = index;

				html.push(' <li class="expandable " data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
				html.push(' <span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
				html.push(' <a class="af-tree-link ">'+mm+'</a>'); //af-pressed Selected
				html.push('	<ul class="af-tree-group" style="display: none;">'); //display: block
			}

			if(!preGrpNm || preGrpNm !== grpNm) {
				grpMmIdx = index;

				cnt = 1;

				html.push('		    <li class="expandable " data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
				html.push('			<span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
				html.push('			<input class="Checkbox" checktype="layerAll" type="checkbox" data-checktype="layerAll" data-group="'+dataGrpNm+'" data-type="checkbox" data-classinit="true" datra-converted="true" style="display: inline-block;" >'); //checked="checked"
				html.push('			<a class="af-tree-link">'+grpNm+'</a>'); //af-pressed Selected
				html.push('			<ul class="af-tree-group" style="display: none;">'); //display: block
			}

			html.push('					<li class="labelLayer Checked" layerid="tree_layer'+cnt+'" data-expand="false" style="list-style: none;">');
			html.push('					<span class="line"></span>');
			html.push('					<input class="Checkbox" data-ischeck="'+(layrDispYn=="Y" || mm == "구성" || mm == "GIS"?'Y':'N') + '" data-group="'+dataGrpNm+'" data-layrNm="'+layrNm+'" data-checktype="layer" checktype="layer" layerid="tree_layer'+cnt+'" type="checkbox" '+(mm == "구성" && layrDispYn=="Y"?'checked':'') + ' data-type="checkbox" data-classinit="true" data-converted="true" style="display: inline-block;">');
			html.push('					<span class="" style="visibility: visible;"></span>');
			//구성
			if(dataGrpNm == "구성_SKT" || dataGrpNm == "구성_SKB"){
				html.push('					<img src="'+cgfLayerImgConf[imgSrc]+'">');
				html.push('					<img class="img-label-on-off cfg" src="../../resources/images/labelTagOff.png" labelGroup="'+dataGrpNm+'" labelLayrNm="'+layrNm+'" labelStatus="off">');
			}
			//구성
			if(dataGrpNm == "구성1_SKT" || dataGrpNm == "구성1_SKB"){
				html.push('					<img src="'+cgfLayerImgConf[imgSrc]+'">');
				html.push('					<img class="img-label-on-off cfg1" src="../../resources/images/labelTagOff.png" labelGroup="'+dataGrpNm+'" labelLayrNm="'+layrNm+'" labelStatus="off">');
			}
			//GIS
			if(dataGrpNm == "GIS_광설비_SKT" || dataGrpNm == "GIS_광설비_SKB"
				|| dataGrpNm == "GIS_광설비_공통"
				|| dataGrpNm == "GIS_주요망_SKT" || dataGrpNm == "GIS_주요망_SKB"
				|| dataGrpNm == "GIS_M/W설비_SKT"
				|| dataGrpNm == "GIS_기본도_공간정보포탈" || dataGrpNm == "GIS_기본도_기본도"
				|| dataGrpNm == "GIS_M/GIS_지도정보_행정구역"
					){
				html.push('					<img class="img-label-on-off gis" src="../../resources/images/labelTagOff.png" labelGroup="'+dataGrpNm+'" labelLayrNm="'+layrNm+'" labelStatus="off">');
			}

			html.push(layrNm+'</li>');

			if(!nextItem || (nextGrpNm !== grpNm)) {
				html.push('			</ul>');
				html.push('		</li>');
			}

			if(!nextItem || (mm !== nextMm)) {
				html.push('	</ul>');
				html.push('</li>');

				mmcnt++;
			}

			preNm = mm;
			preGrpNm = grpNm;

			cnt ++;
		} // end of for

		return html;
	},

	getVectorLayerById: function (layerId) {
		return window.mgMap.getLayerById(layerId);
	},

	getLabelLayerById: function (layerId) {
		let labelId = layerId+'_LABEL';
		return window.mgMap.getLayerById(labelId);
	},

	getRasterLayerById: function (layerId) {
		let labelId = layerId+'_RASTER';
		return window.mgMap.getLayerById(labelId);
	},

	getRasterGroupLayerById: function(layerId) {
		let labelId = layerId+'_RASTERGROUP';
		return window.mgMap.getLayerById(labelId);
	},

	getLabelRasterGroupLayerById: function (layerId) {
		let labelId = layerId+'_LABEL_RASTERGROUP';
		return window.mgMap.getLayerById(labelId);
	},

	setLayerVisible: function(layerId, visible, labelVisible, mtsostatvalue) {

		let vectorLayer = this.getVectorLayerById(layerId),
			labelLayer = this.getLabelLayerById(layerId),
			rasterLayer = this.getRasterLayerById(layerId),
			rasterGroupLayer = this.getRasterGroupLayerById(layerId),
			labelRasterGroupLayer = this.getLabelRasterGroupLayerById(layerId);

		if ( vectorLayer ) {
			//var selectable = vectorLayer.isSelectable();

			//vectorLayer.setVisible(visible);
			vectorLayer.set('shouldBeVisible', visible);

			if ( visible ) {
				vectorLayer.set('selectable', true);
			} else if ( !visible ) {
				vectorLayer.set('selectable', false);
			}

			if ( rasterLayer ) {
				//rasterLayer.setVisible(visible);
				rasterLayer.set('shouldBeVisible', visible);
			}

			if ( rasterGroupLayer ) {
				//rasterGroupLayer.setVisible(visible);
				rasterGroupLayer.set('shouldBeVisible', visible);
			}

			//메뉴에 구성되어 있는 레이어는 항상 라벨레이어가 존재....
			if (labelLayer) {
				if ( visible ) {
					labelLayer.set('shouldBeVisible', labelVisible);
					if(rasterLayer) rasterLayer.set('labelChk', labelVisible);

					if(rasterGroupLayer){
						rasterGroupLayer.set('labelChk', labelVisible);
					}

				} else {
					labelLayer.set('shouldBeVisible', false);
					if(rasterLayer) rasterLayer.set('labelChk', labelVisible);

					if(rasterGroupLayer){
						rasterGroupLayer.set('labelChk', labelVisible);
					}
				}
			}

			window.mgMap._updateZoomLevel(window.mgMap.getZoom(), mtsostatvalue);
		}
	},

	createEqpDsnTreeLayerList: function(layerList) {
		let html = [];

		// 유선설계 트리 구조
		const eqp_dsn_tree = layerList.filter(layer => (
				layer.mm == "수요검토"
			  )
			);

		html.push('     <li class="expandable " data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
		html.push('     <span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
		html.push('     <a tabindex="0" class="af-tree-link ">유선설계</a>'); //af-pressed Selected
		html.push('     <ul class="af-tree-group" style="display: none;">'); //display: block

		html = this.maketEqpDsnTreeLayerHtml(eqp_dsn_tree, html);

		html.push('		</ul>');
		html.push('		</li>');

		$('#tree1').append(html.join(''));

	},

	maketEqpDsnTreeLayerHtml: function(_tree, html) {
		let preNm, preGrpNm;
		let cnt = 1;
		let mmcnt = 0;
		let mmIdx = 0;
		let grpMmIdx = 0;

		for(let index = 0; index < _tree.length; index++) {
			let keys = [], nextKeys = [];
			let item = _tree[index];
			let nextItem,
				mm,
				grpNm,
				nextMm,
				nextGrpNm ,
				layrNm,
				layrDispYn,
				editPsblYn,
				dataGrpNm,
				objMgmtNo;

			if(!item) {
				continue;
			}

			keys = Object.keys(item);

			if(index + 1 < _tree.length) {
				nextItem = _tree[index + 1];
			}

			if(nextItem) {
				nextKeys = Object.keys(nextItem);
			}

			mm = item[keys[3]];
			grpNm = item[keys[0]];
			layrNm = item[keys[4]];
			layrDispYn = item[keys[5]];
			editPsblYn = item[keys[6]];
			objMgmtNo = item[keys[7]];

			if(mm == "수요검토") {
				dataGrpNm = "EQPDSN" + "_" + mm + "_" + grpNm;
			}

			if(nextItem && nextKeys) {
				nextMm = nextItem[keys[3]];
				nextGrpNm = nextItem[keys[0]];
			}

			if(!preNm || preNm !== mm) {

				mmIdx = index;

				html.push(' <li class="expandable " data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
				html.push(' <span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
				html.push(' <a class="af-tree-link ">'+mm+'</a>'); //af-pressed Selected
				html.push('	<ul class="af-tree-group" style="display: none;">'); //display: block
			}

			if(!preGrpNm || preGrpNm !== grpNm) {
				grpMmIdx = index;

				cnt = 1;

				html.push('		    <li class="expandable " data-expand="false" style="list-style: none;">'); //af-tree-expanded Expanded data-expand="true"
				html.push('			<span class="Arrow" data-expand="false" style="visibility: visible;"></span>');
				html.push('			<input class="Checkbox" checktype="layerAll" type="checkbox" data-checktype="layerAll" data-group="'+dataGrpNm+'" data-type="checkbox" data-classinit="true" datra-converted="true" style="display: inline-block;" >'); //checked="checked"
				html.push('			<a class="af-tree-link">'+grpNm+'</a>'); //af-pressed Selected
				html.push('			<ul class="af-tree-group" style="display: none;">'); //display: block
			}

			html.push('					<li class="labelLayer Checked" layerid="tree_layer'+cnt+'" data-expand="false" style="list-style: none;">');
			html.push('					<span class="line"></span>');
			html.push('					<input class="Checkbox" data-ischeck="N" data-group="'+dataGrpNm+'" data-layrNm="'+layrNm+'" data-objMgmtNo="'+objMgmtNo+'" data-checktype="layer" checktype="layer" layerid="tree_layer'+cnt+'" type="checkbox" data-type="checkbox" data-classinit="true" data-converted="true" style="display: inline-block;">');
			html.push('					<span class="" style="visibility: visible;"></span>'+layrNm+'</li>');

			if(!nextItem || (nextGrpNm !== grpNm)) {
				html.push('			</ul>');
				html.push('		</li>');
			}

			if(!nextItem || (mm !== nextMm)) {
				html.push('	</ul>');
				html.push('</li>');

				mmcnt++;
			}

			preNm = mm;
			preGrpNm = grpNm;

			cnt ++;
		} // end of for

		return html;
	},

	getEqpDsnLayer: function() {
		let paramData = {};
		let paramObj = [];

//		if(callPath == "EQPDSN"){
//			return;
//		}

		let eqpDsnLayer = window.mgMap.getCustomLayerByName(eqpDsnMtsoLayer);
		if(eqpDsnLayer) {//레이어 있으면 초기화
			eqpDsnLayer.clearLayers();
			window.mgMap.getMap().removeLayer(eqpDsnLayer);
	    }

		let markerLayer = window.mgMap.getCustomLayerByName(eqpDsnMarkerLayer);
		if(markerLayer) {//레이어 있으면 초기화
			markerLayer.clearLayers();
			window.mgMap.getMap().removeLayer(markerLayer);
			markerLayer.closePopup();
	    }

		//유선설계 그리드의 체크된  데이터
		let selectData = AlopexGrid.trimData($('#'+gridId9).alopexGrid("dataGet" , {_state : {selected:true}}));
		if(selectData.length == 0){
			return;
		}
		_.each(selectData, function(item, idx){
			paramObj.push(item.objMgmtNo);
		});

		paramData.objMgmtNoList = paramObj;
		let param = Util.convertQueryString(paramData);

		if(paramObj.length > 0){
			LayerTreeControl.httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getEqpDemdLinkMtsoList', param, 'GET', 'searchDemdLinkMtso');
		}
	},

	// 유선망 통합설계에서 팝업시킬 경우
	getPopUpEqpDsnLayer: function(paramData) {
		isPop = true;

		let eqpDsnLayer = window.mgMap.getCustomLayerByName(eqpDsnMtsoLayer);
		if(eqpDsnLayer) {//레이어 있으면 초기화
			eqpDsnLayer.clearLayers();
			window.mgMap.getMap().removeLayer(eqpDsnLayer);
	    }

		let param = Util.convertQueryString(paramData);
		LayerTreeControl.httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getEqpDemdLinkMtsoList', param, 'GET', 'searchDemdLinkMtso');
	},

	drawEqpDsnMtsoLayer: function(layerList) {
		if(layerList.length > 0){
			let eqpDsnLayer = window.mgMap.getCustomLayerByName(eqpDsnMtsoLayer);
			if(eqpDsnLayer) {//레이어 있으면 초기화
				//window.mgMap.clearSelectLayer();
				eqpDsnLayer.clearLayers();
				window.mgMap.getMap().removeLayer(eqpDsnLayer);
			}else{//레이어 없으면 새로 생성
//	    	window.mgMap.on('mg-selected-features', onClickFeatures);
				eqpDsnLayer = window.mgMap.addCustomLayerByName(eqpDsnMtsoLayer, {selectable: true});
			}

			let demdMtsoFeatures = {features: []}; //수요국사
			let lnkgMtsoFeatures = {features: []}; //연동국사
			let lineFeatures = {features: []}; //연결라인

			_.each(layerList, function(item, idx){

				//수요국사 마킹
				if(item.demdMtsoLngVal != null && item.demdMtsoLatVal != null ){
					let demdMtsoStyle = "";
					if(item.demdMtsoTypCd =="1"){ //1
						demdMtsoStyle = cgfLayerStyleConf[sktTmofLayer];
					}else if(item.demdMtsoTypCd =="2"){ //2
						demdMtsoStyle = cgfLayerStyleConf[sktCofcLayer];
					}else if(item.demdMtsoTypCd =="3"){ //3
						demdMtsoStyle = cgfLayerStyleConf[sktBmtsoLayer];
					}else if(item.demdMtsoTypCd =="4"){ //3
						demdMtsoStyle = cgfLayerStyleConf[sktSmtsoLayer];
					}

					let demdMtsoFeature = {type : 'Feature',
							objMgmtNo : item.objMgmtNo,
							demdRvSeq : item.demdRvSeq,
							demdMtsoId : item.demdMtsoId,
							lnkgMtsoId : item.lnkgMtsoId,
							mtsoId : item.demdMtsoId,
							mtsoNm : item.demdMtsoNm,
							mtsoLngVal : item.demdMtsoLngVal,
							mtsoLatVal : item.demdMtsoLatVal,
							mtsoTypCd : item.demdMtsoTypCd,
							markerDiv : 'DEMD',
							geometry : {
								type : 'Point',
								coordinates : [item.demdMtsoLngVal,item.demdMtsoLatVal]
							},
							style : [{id:demdMtsoStyle}],
					};
					demdMtsoFeatures.features.push(demdMtsoFeature);
				}

				//연동국사 마킹
				if(item.lnkgMtsoLngVal != null && item.lnkgMtsoLatVal != null ){
					let lnkgMtsoStyle = "";
					if(item.lnkgMtsoTypCd =="1"){ //1
						lnkgMtsoStyle = cgfLayerStyleConf[sktTmofLayer];
					}else if(item.lnkgMtsoTypCd =="2"){ //2
						lnkgMtsoStyle = cgfLayerStyleConf[sktCofcLayer];
					}else if(item.lnkgMtsoTypCd =="3"){ //3
						lnkgMtsoStyle = cgfLayerStyleConf[sktBmtsoLayer];
					}else if(item.lnkgMtsoTypCd =="4"){ //3
						lnkgMtsoStyle = cgfLayerStyleConf[sktSmtsoLayer];
					}

					let lnkgMtsoFeature = {type : 'Feature',
							objMgmtNo : item.objMgmtNo,
							demdRvSeq : item.demdRvSeq,
							demdMtsoId : item.demdMtsoId,
							lnkgMtsoId : item.lnkgMtsoId,
							mtsoId : item.lnkgMtsoId,
							mtsoNm : item.lnkgMtsoNm,
							mtsoLngVal : item.lnkgMtsoLngVal,
							mtsoLatVal : item.lnkgMtsoLatVal,
							mtsoTypCd : item.lnkgMtsoTypCd,
							markerDiv : 'LNKG',
							geometry : {
								type : 'Point',
								coordinates : [item.lnkgMtsoLngVal,item.lnkgMtsoLatVal]
							},
							style : [{id:lnkgMtsoStyle}],
					};
					lnkgMtsoFeatures.features.push(lnkgMtsoFeature);
				}

				//수요 연동국사 라인 연결
				if( item.demdMtsoLngVal != null && item.demdMtsoLatVal != null
						&& item.lnkgMtsoLngVal != null && item.lnkgMtsoLatVal != null){
					let lineFeature = {type : 'Feature',
							objMgmtNo : item.objMgmtNo,
							demdRvSeq : item.demdRvSeq,
							demdMtsoId : item.demdMtsoId,
							lnkgMtsoId : item.lnkgMtsoId,
							markerDiv : 'LINE',
							geometry : {
								type : 'LineString',
								coordinates : [[item.demdMtsoLngVal,item.demdMtsoLatVal],[item.lnkgMtsoLngVal,item.lnkgMtsoLatVal]]
							},
							style : [{id:'STYLE_MTSO_LINK_RED_LINE'}],
					};
					lineFeatures.features.push(lineFeature);

				}
			});

			//eqpDsnLayer.addData(demdMtsoFeatures);
			//eqpDsnLayer.addData(lnkgMtsoFeatures);
			//eqpDsnLayer.addData(lineFeatures);

			if(isPop){
				window.mgMap.fitBounds(eqpDsnLayer.getBounds(), window.mgMap.getZoom());
			}else{
				window.mgMap.setZoom(7);
			}
		} else {
			callMsgBox('','W', '맵에 표시할 정보가 존재하지 않습니다.', function(msgId, msgRst){});
		}
	},

	getSelectedMenuItems: function(map, marker) {
		let markerLayer = window.mgMap.getCustomLayerByName(eqpDsnMarkerLayer);
		if(markerLayer) {//레이어 있으면 초기화
			markerLayer.clearLayers();
			window.mgMap.getMap().removeLayer(markerLayer);
			markerLayer.closePopup();
	    }else{//레이어 없으면 새로 생성
	    	markerLayer = window.mgMap.addCustomLayerByName(eqpDsnMarkerLayer, {selectable: false});
	    }

		if(marker.markerDiv == "DEMD"
			|| marker.markerDiv == "LNKG"){

			//window.mgMap.clearSelectLayer();

			let tooltipMarker = L.marker([marker.mtsoLatVal, marker.mtsoLngVal], {radius:20});
			markerLayer.addLayer(tooltipMarker);

			let html = '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
		               '<b>국사ID:</b><%pop_mtsoId%><br>';
					   '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
			           '<b>국사상태:</b><%pop_mtsoStat%><br>'+
			           '<b>건물주소:</b><%pop_bldAddr%>';
		        html = html.replace('<%pop_mtsoNm%>',marker.mtsoNm);
		        html = html.replace('<%pop_mtsoId%>',marker.mtsoId);
//		        html = html.replace('<%pop_mtsoTyp%>',response.LayerList[0].mtsoTyp);
//		        html = html.replace('<%pop_mtsoStat%>',response.LayerList[0].mtsoStat);
//		        html = html.replace('<%pop_bldAddr%>',response.LayerList[0].bldAddr);
		    tooltipMarker.bindPopup(html).openPopup();

		    tooltipMarker.getPopup().on('remove', function(e) {
		    	markerLayer.clearLayers();
		    	window.mgMap.getMap().removeLayer(markerLayer);
			});
		}

		let items = [];

		let demdMtsoItem = {text: '수요 국사 정보',
				callback: function(e) {
					let mtsoGubun = "mtso";
					let linkTab = "tab_Mtso";

		        	let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
		        	let paramData = {
		        			mtsoEqpGubun : mtsoGubun,
		        			mtsoEqpId : marker.demdMtsoId,
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

		let lnkgMtsoItem = {text: '연동 국사 정보',
				callback: function(e) {
					let mtsoGubun = "mtso";
					let linkTab = "tab_Mtso";

					let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
					let paramData = {
							mtsoEqpGubun : mtsoGubun,
							mtsoEqpId : marker.lnkgMtsoId,
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

		let lnkgItem = {text: '연동 국사 변경',
				callback: function(e) {
					let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
					let mtsoPopup = $a.popup({
						popid: tmpPopId,
				        title: "국사ID 조회",
				        url: "/tango-transmission-web/configmgmt/common/MtsoLkup.do",
				        windowpopup : true,
				        modal: true,
				        movable:true,
				        width : 950,
				        height : 800,
				        callback: function(data) {
				        	if(data != null){
				        		callMsgBox('','C', '연동 국사를 변경하시겠습니까.', function(msgId, msgRst){
				        			if("Y" == msgRst){
				        				let param = {
				        						objMgmtNo : marker.objMgmtNo,
				        						demdRvSeq : marker.demdRvSeq,
				        						lnkgMtsoId : data.mtsoId,
				        						markerDiv : marker.markerDiv
				        				};

				        				Util.jsonAjax({ url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/updateEqpDemdLinkMtso'
				        								   , method:'POST'
				        								   , data : param
				        								   , async:true})
				        					.done(
				        						function(result) {
				        							if(result.returnCode == '200'){
				        								callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
				        								if(callPath == "EQPDSN"){
				        									LayerTreeControl.getPopUpEqpDsnLayer(param);
				        								}else{
				        									LayerTreeControl.getEqpDsnLayer();
				        								}
				        							}else{
				        								callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
				        							}
				        						}
				        					);
				        			}
				        		});
				        	}
				        }
				    });
				}
		};

		let demdItem = {text: '수요 국사 변경',
				callback: function(e) {
					let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
					let mtsoPopup = $a.popup({
						popid: tmpPopId,
				        title: "국사ID 조회",
				        url: "/tango-transmission-web/configmgmt/common/MtsoLkup.do",
				        windowpopup : true,
				        modal: true,
				        movable:true,
				        width : 950,
				        height : 800,
				        callback: function(data) {

				        	if(data != null){
				        		callMsgBox('','C', '수요 국사를 변경하시겠습니까.', function(msgId, msgRst){
				        			if("Y" == msgRst){
				        				let param = {
				        						objMgmtNo : marker.objMgmtNo,
				        						demdRvSeq : marker.demdRvSeq,
				        						demdMtsoId : data.mtsoId,
				        						markerDiv : marker.markerDiv
				        				};

				        				Util.jsonAjax({ url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/updateEqpDemdLinkMtso'
				        								   , method:'POST'
					        							   , data : param
					        							   , async:true})
				        					.done(
				        						function(result) {
				        							if(result.returnCode == '200'){
				        								callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
				        								if(callPath == "EQPDSN"){
				        									LayerTreeControl.getPopUpEqpDsnLayer(param);
				        								}else{
				        									LayerTreeControl.getEqpDsnLayer();
				        								}
				        							}else{
				        								callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
				        							}
				        						}
				        					);
				        			}
				        		});
				        	}
				        }
				    });
				}
		};

		if(marker.markerDiv == "DEMD"){
			items.push(demdMtsoItem);
		} else if (marker.markerDiv == "LNKG") {
			items.push(lnkgMtsoItem);
		} else if (marker.markerDiv == "LINE") {
			items.push(demdMtsoItem);
			items.push(lnkgMtsoItem);
			items.push(demdItem);
			items.push(lnkgItem);
		}

	    return items;
	},

	drawBulMtsoLayer: function(dataList, layerNm) {
		let bulMtsoLayer = window.mgMap.getCustomLayerByName(layerNm);
		if(bulMtsoLayer) {//레이어 있으면 초기화
			//window.mgMap.clearSelectLayer();
			bulMtsoLayer.clearLayers();
			window.mgMap.getMap().removeLayer(bulMtsoLayer);
			//bulMtsoLayer.getSource().clear();
	    }else{//레이어 없으면 새로 생성
	    	bulMtsoLayer = window.mgMap.addCustomLayerByName(layerNm, {selectable: true});
	    }

		let result = {features: []};
		//조회 국사 fearture 생성
		_.each(dataList, function(item, idx){
			let feature = {};
			feature.type = 'Point';
			feature.style = cgfLayerStyleConf[layerNm];
			feature.mgmtNo = item.mtsoId;
			feature.coord =[item.mtsoLngVal, item.mtsoLatVal];
	    	result.features.push(_M.createFeature(feature));
		});

		//맵 데이터 넣어주기
		//if(result.features.length > 0) {
			bulMtsoLayer.addData(result);
		//}

	    //스냅 처리 추가
		const edit = L.EditSnapTrail.getInstance(L.GeoMap().map);
		if(edit?.isEditSnapModeActive?.()) {
			const olFeatures = bulMtsoLayer.getSource().getFeatures();
			olFeatures.forEach(f => f.set('snapped', true));
			edit.snapSource.addFeatures(olFeatures);
		}


		$('.right-contents').progress().remove();
	},

	drawBulMtsoLabelLayer: function(dataList, layerNm) {
		let bulMtsoLabelLayer = window.mgMap.getCustomLayerByName(layerNm);
		if(bulMtsoLabelLayer) {//레이어 있으면 초기화
			//window.mgMap.clearSelectLayer();
			bulMtsoLabelLayer.clearLayers();
			window.mgMap.getMap().removeLayer(bulMtsoLabelLayer);
			//bulMtsoLabelLayer.getSource().clear();
		}else{//레이어 없으면 새로 생성
			bulMtsoLabelLayer = window.mgMap.addCustomLayerByName(layerNm, {selectable: false});
		}


		let styles =[
			{
				id : layerNm,
				type : L.StyleConfig().STYLE_TYPE.TEXT, // 텍스트 타입
				options : {
			    			labelColumn: 'label',
			    			faceName: '돋움',
				            size: '12',
				            color: 'black',
				            hAlign: 'middle',
				            vAlign: 'middle',
				            weight: 'bold',
				            isBox : layerNm === 'SKT_BMTSO_LAYER_LABEL' ? false : true,       //라벨의 테두리 사용 여부
				            boxWidth : '1',
				            boxColor : '#00570E',
				            opacity : 0.7,
				            format: '{0}',
				          }
			}
		];
		L.StyleConfig().setCustomStyles(styles);

		let features = [];
    	_.each(dataList, function(item, index) {
    		var feature = {};
    		feature.type = "Feature";
    		feature.properties = item;
    		feature.properties.label = item.mtsoNm;
    		feature.geometry = {};
    		feature.geometry.type = 'Point';
    		feature.geometry.coordinates = [item.mtsoLngVal , item.mtsoLatVal];
    		feature.keyNames = ["label"];
    		feature.style = [ { id : layerNm ,type: 'text'} ];

    		features[index] = feature;
    	});

    	let result = {
    			features : features
    	};

    	//맵 데이터 넣어주기
    	//bulMtsoLabelLayer.addData(result);
    	//if(result.features.length > 0) {
    		bulMtsoLabelLayer.addData(result);
		//}

//    	let textIconOption = {
//    			labelColumn: 'LABEL',
//    			faceName: '돋움',
//	            size: '12',
//	            color: 'BLACK',
//	            hAlign: 'middle',
//	            vAlign: 'middle',
//	            weight: 'bold',
//	            isBox : true,       //라벨의 테두리 사용 여부
//	            boxWidth : '1',
//	            boxColor : '#00570E',
//	            opacity : 0.7,
//    	};
//
//    	for (var key in bulMtsoLabelLayer._layers) {
//    		var layer = bulMtsoLabelLayer._layers[key];
//    		layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL, hAlign : "middle", vAlign : "top"})));
//    	}

		$('.right-contents').progress().remove();

//		let drawLabelObj = document.querySelectorAll('.leaflet-text-icon');
//
//		_.each(drawLabelObj, function(obj, idx) {
//			obj.style.marginTop = "10px";
//		});

	},

	setRemoveAllCheckVal: function(){
		//기본세팅된 국사 체크박스의 체크상태를 제거
		let checkedLayers = $('#div_tree_layer .Checkbox[data-group^="구성_SK"]:checked');
		_.each(checkedLayers, function(layer, idx) {
			$(layer).prop('checked', false);
		});
	},

	setEventCfgLabelOnOff: function() {
        $(".img-label-on-off.cfg").on("click", function(e) {
        	let status = $(this).attr("labelStatus");

        	if(status == "off"){
        		$(this).attr("labelStatus", "on")
        		$(this).attr("src", "../../resources/images/labelTagOn.png");
        	}else if(status == "on"){
        		$(this).attr("labelStatus", "off")
        		$(this).attr("src", "../../resources/images/labelTagOff.png");
        	}

        	//구성 라벨처리
        	let layers = $('.img-label-on-off.cfg');
     		_.each(layers , function(layer, index) {
     			let labelGroup = $(layer).attr("labelGroup");
     			let labelLayrNm = $(layer).attr("labelLayrNm");
     			let labelStatus = $(layer).attr("labelStatus");
     			if(labelGroup == "구성_SKT") {
     				if(labelLayrNm == "전송실") {
     					cgfLayerLabelConf[sktTmofLayer] = labelStatus;
     				} else if(labelLayrNm == "중심국") {
     					cgfLayerLabelConf[sktCofcLayer] = labelStatus;
     				} else if(labelLayrNm == "기지국") {
     					cgfLayerLabelConf[sktBmtsoLayer] = labelStatus;
     				} else if(labelLayrNm == "국소") {
     					cgfLayerLabelConf[sktSmtsoLayer] = labelStatus;
     				}

     			} else if(labelGroup == "구성_SKB") {
     				if(labelLayrNm == "정보센터") {
     					cgfLayerLabelConf[skbInfCntrLayer] = labelStatus;

     				} else if(labelLayrNm == "국사") {
     					cgfLayerLabelConf[skbMtsoLayer] = labelStatus;

     				} else if(labelLayrNm == "국소") {
     					cgfLayerLabelConf[skbSmtsoLayer] = labelStatus;

     				}
     			}
     		});
     		LayerTreeControl.getBulLayer();
        });
    },

	setEventGisLabelOnOff: function() {
        $(".img-label-on-off.gis").on("click", function(e) {
        	let status = $(this).attr("labelStatus");

        	if(status == "off"){
        		$(this).attr("labelStatus", "on")
        		$(this).attr("src", "../../resources/images/labelTagOn.png");
        		gisLayerLabelConf.push($(this).attr("labelLayrNm"));
        	}else if(status == "on"){
        		$(this).attr("labelStatus", "off")
        		$(this).attr("src", "../../resources/images/labelTagOff.png");
        		gisLayerLabelConf = gisLayerLabelConf.filter(item => item !== ($(this).attr("labelLayrNm")));
        	}

     		LayerTreeControl.getGisLayer();
        });
    },

    setEventBulLabelOnOff: function() {
        $(".img-label-on-off.cfg1").on("click", function(e) {
        	let status = $(this).attr("labelStatus");

        	if(status == "off"){
        		$(this).attr("labelStatus", "on")
        		$(this).attr("src", "../../resources/images/labelTagOn.png");
        		bulLayerLabelConf.push($(this).attr("labelLayrNm"));
        	}else if(status == "on"){
        		$(this).attr("labelStatus", "off")
        		$(this).attr("src", "../../resources/images/labelTagOff.png");
        		bulLayerLabelConf = bulLayerLabelConf.filter(item => item !== $(this).attr("labelLayrNm"));
        	}

     		LayerTreeControl.gettestBulLayer();
        });
    },

    getGisSelectedMenuItems: function(map, marker) {

		let items = [
            {
            	text: "확대",
			    icon: L.MG.ENV.IMAGEPATH + "/zoom-in.png",
			    callback: function(e) {map.zoomIn();}
            },
            {
            	text: "축소",
            	icon: L.MG.ENV.IMAGEPATH + "/zoom-out.png",
            	callback: function(e) {map.zoomOut();}
            },
            {
            	text: "위경도복사",
            	callback: function(e) {
            		var lng = e.latlng.lng;
            		var lat = e.latlng.lat;
            		var t = document.createElement("textarea");
            		document.body.appendChild(t);
            		t.value = lat + "," + lng;
            		t.select();
            		document.execCommand('copy');
            		document.body.removeChild(t);
            	}
            },
            {
				text: "선택해제",
				callback: function(e) {map.clearSelectLayer();}
			},
			{
				text: "속성정보관리",
				callback: function(e) {
					if (marker.pkValue != "") {
						Tango.ajax({
				    		url: "tango-transmission-gis-biz/transmission/gis/fm/facilityinfo/layrbas/canPopupLayout",
				    		data: {
				    			actMode: marker.actMode,
				    			layrNm: marker.layrNm,
				    			pkValue: marker.pkValue,
				    			distance: "0",
				    			buildInOut: "OUT"
				    		},
				    		method: "POST",
				    		flag: "facilityInfo"
				    	}).done(function(response, status, jqxhr, flag) {

				    		var actMode = response.actMode;
				    		var layrNm = response.layrNm;
				    		var pkValue = response.pkValue;
				    		var attrModYn = response.attrModYn;

				    		$a.popup({
				    			width: "800",
				    			height: "900",
				    			url: "/tango-transmission-gis-web/fm/facilityinfo/FacilityInfoMgmt.do",
				    			data: {
				    				actMode: actMode,
				    				layrNm: layrNm,
				    				pkValue: pkValue,
				    				createFeaturePoint: null,
				    				distance: "0",
				    				buildInOut: "OUT",
				    				attrModYn: attrModYn
				    			},
				    			iframe: false,
				    			windowpopup: true,
				    			title: "시설물 정보 관리",
				    			other: "top=100,left:100,scrollbars=yes,location=no",
				    			callback: function(data) {
				    				//window.mgMap.clearSelectLayer();
				    			}
				    		});
				    	}).fail(function(responseJSON, status, flag) {
				    		if (status != 200) {
				    			alert(responseJSON.message);
				    	    	return;
				    		}
				    	});
			    	} else {
			    		callMsgBox('','I', '시설물관리번호가 존재하지 않습니다.' , function(msgId, msgRst){});
			    	}
				}
//			},
//			{
//				text: "접속정보관리",
//				callback: function(e) {
//					if (marker.contextMenu != "") {
//						if(marker.contextMenu == 'BD' || marker.contextMenu == 'MH'){
//							alert('선택한 시설물은 접속정보를 관리하지 않습니다.');
//							return;
//						}
//
//						// 접속정보관리
//					    if (marker.contextMenu == "JP" || marker.contextMenu == "CP") {
//					    	if ($.TcpUtils.isEmpty(marker.pkValue)){
//						        alert('시설물 관리번호가 없어 접속정보관리를 실행할 수 없습니다.');
//						        return;
//						    }
//							return $a.popup({
//									width: '1600',
//									height: (screen.height-120),
//									data:{"jpMgNo":cnptMgmtNo},
//									url: "/tango-transmission-gis-web/nm/cnnctnpoint/CnnctnInfo.do",
//									iframe: false,
//									windowpopup: true,
//									modal: false,
//									resize: false,
//									title: '접속정보관리',
//									other: 'top=0,left:100,scrollbars=yes, location=no',
//									callback:function(data) {
//					    				window.mgMap.clearSelectLayer();
//					    			}
//								});
//					    }
//					    // FDF선번장 관리
//					    else if (marker.contextMenu == "TP") {
//					    	var param = {};
//							/*if ('object' == typeof marker.pkValue) {
//								param = marker.pkValue;	// {mtsoMgmtNo:'11620TP000039', rackNo:'30', shlfNo:'3',portNo:'3'}
//							} else { // string
//								param = {mtsoMgmtNo: marker.pkValue};
//							}*/
//					    	param = {mtsoMgmtNo: marker.pkValue};
//						    var popupOption = {
//				                width: 1600,
//				                height: 720,
//				                url: '/tango-transmission-gis-web/nm/fdflnst/FdfLnstMgmt.do',
//				                data: param,
//				                iframe: false,
//				                windowpopup: true,
//				                modal: false,
//				                resize: false,
//				                title: 'FDF선번장관리',
//				                other: 'top=100,left:100,scrollbars=yes, location=no',
//				                callback: function(data) {
//				    				window.mgMap.clearSelectLayer();
//				    			}
//				            };
//
////						    popupOption = $.extend({}, popupOption, option);
////				            return $a.popup(popupOption);
//					    }
//					} else {
//			    		callMsgBox('','I', '시설물 관리번호가 없어 접속정보관리를 실행할 수 없습니다.' , function(msgId, msgRst){});
//			    	}
//				}
			}];

	    return items;
	},

	getSelectedMtsoInfItemList : function(map, marker) {
		return [
					{
			          text: '국사 통합 정보',
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
					}
				];
	}

};
