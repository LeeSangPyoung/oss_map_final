    /*==========================*
	 *  변수선언

	 *==========================*/
var clickMtsoNm = "";

	/*==========================*
	 *  function load()
	 *==========================*/
    function load() {
    	  //레이어 조회 버튼 숨기기
        /** 맵 생성 **/
    	 var options = {  //맵생성옵션
    	        	app: 'tango',
    	        	contextmenu: false,
    	            location: {zoom: 10, center: [37.5087805938127, 127.062289345605]}
    	        };
        // 1. 'map' : 맵 생성을 위한 target div element의 id
        // 2. 'BASEMAP' : 설비 없이 베이스 지도만 생성
        // 3. 'BASEMAP' 대신 'TANGO-T'를 입력한 경우 설비 및 미리 정의된 옵션으로 맵 생성
        MapGeo.create('map', 'TANGO-T', options).then(function (map) {
        	window.mgMap = map;// 생성된 map 객체를 window 객체에 추가하여 전역으로 사용 가능
        	window.mtsoInfLayer = map.addCustomLayerByName('MTSO_INF_LAYER',{selectable: true});//국사표시를 위한 레이어
        	window.mtsoInfLayerClick = map.addCustomLayerByName('MTSO_INF_LAYER_CLICK',{selectable: true});//국사표시를 위한 레이어
        	window.mtsoLayerLabel = map.addCustomLayerByName('MTSO_LAYER_LABEL');//구성레이어의 ERP공대 기준,건물기준 레이어 라벨
        	window.rangeRingLayerGroup = L.layerGroup();//링표시 레이어들의 그룹
        	//국사레이어만 선택가능하게
        	//국사레이어만 표시

          	var layers = map.getVectorLayers();
          	_.each(layers, function(layer, index) {
              	layer.properties.selectable = false;
          		layer.setVisible(false);
          	});

//         	var layers = map.getVectorLayers();
//          	_.each(layers, function(layer, index) {
//          		if (// layer.getLayerAliasName()=='T_국소' ||
//           			 layer.getLayerAliasName()=='T_전송실' ||
//           			 layer.getLayerAliasName()=='T_중심국_국사') {
//           			 layer.properties.selectable = true;
//           			 layer.setVisible(true);
//           		}else{
//
//              	layer.properties.selectable = false;
//          		layer.setVisible(false);
//           		}
//          	});
        	//시도 정보 세팅
        	setSido();
            //시설물 선택 이벤트
        	map.on("mg-selected-features", onClickFeatures);
        	//사용자 레이어 스타일 설정
            addUserLayerStyles();

            //조회
            setMapSearch();

        });

        /** 이벤트 걸기**/
        setEventListener();


    }

    /*==========================*
	 * 이벤트 걸기
	 *==========================*/


    function setMapSearch(){
    	$('#map').progress();
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getEqpMtsoConvergy', param, 'GET', 'searchMtsoConvergy');
    	httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getMapSearch', null, 'GET', 'getMapSearchInf');

    }
    function setEventListener() {
    	/*...........................*
		    메뉴 관련
		 *...........................*/
    	/** 거리측정**/

    	$('#mtsoAddBtn').on('click', function(e){


    		var self = this;
			var selLayer = window.mgMap.getSelectLayer();
			this._selLayers = [];
			var mtsoNm = [];
			var paramData = {};
			var i = 0;
//			var layer = window.mgMap.getCustomLayerByName(Const.CUSTOM_LYR.CLUSTOR);
			for(var key in mtsoInfLayerClick._layers){
				mtsoNm[i] = mtsoInfLayerClick._layers[key].feature.mgmtNo;
				i++;
			}
			if(mtsoNm != null || mtsoNm != ""){
				paramData.mtsoMapList = mtsoNm
				window.open('/tango-transmission-web/configmgmt/mtsoinvt/MtsoInvtMgmt.do?mtsoMapList='+paramData.mtsoMapList);
			}else{
				callMsgBox('','W', "청약설계 할 국사를 선택 해 주시길 바랍니다." , function(){});
			}
    	 });

    	 $('#searchBtn').on('click', function(e){
    	        setMapSearch();
    	    });
    }




	 /*==========================*
	 * 시설물선택하면 시설물 정보 가져오기
	 *==========================*/
	function onClickFeatures(featuresObj) {
		var cusLayer = window.mgMap.getSelectedFeatures();
		var selectedFeatures = mgMap.getSelectedFeatures();

		if (featuresObj.features.length > 0){
			var layerId = featuresObj.features[0].feature.getLayerId();
			var layer = window.mgMap.getLayerById(layerId);
			var layrNm = layer.getLayerAliasName();
			var geometry = featuresObj.features[0].feature.geometry;
			var symbolType = geometry.type;

			//국사선택시
			if ( layrNm =='MTSO_INF_LAYER' ||
				layrNm == 'MTSO_INF_LAYER_CLICK') {

				if(layrNm == 'MTSO_INF_LAYER_CLICK'){

					for(var key in mtsoInfLayerClick._layers){
						var pstcdMgmtNo = mtsoInfLayerClick._layers[key]._object_id;
						 clickMtsoNm += mtsoInfLayerClick._layers[key].feature.mgmtNo + ",";
					}
				}else{
					clickMtsoNm = "";
				}

			    //시설물관리번호로 국사정보 가져오기
				var param = new Object();
				param.mtsoMgmtNo = featuresObj.features[0].feature.mgmtNo;//GIS국사관리번호
				param.mtsoLatVal = geometry.coordinates[1];//featureObj의 위도
				param.mtsoLngVal = geometry.coordinates[0];//featureObj의 경도
				httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getUpsdMtsoInf', param, 'GET', 'searchMtsoInf');


			//링선택시
			/*}else if(symbolType == "LineString"){
				//링상세정보와 링-장비리스트 가지러 가기
				var param = new Object();
				param.ringMgmtNo = featuresObj.features[0].feature.mgmtNo;
				param.layerId = layerId;
				param.fdfChk=$("#searchFDFYN").getValue();
				if(layerId = "RING_MAP_LAYER"){//링조회에서 그린 링레이어 선택이면
					param.shouldSelectRow = false;//주변링 리스트에 선택 표시할 필요없어
				}else{//주변링조회에서 그린 주변링레이어 선택이면
					param.shouldSelectRow = true;//주변링 리스트에서 해당링 줄 선택표시
					$('#ringEqpListGrid').alopexGrid('showProgress');//링-장비조회 중임 표시
				}
	 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRingDtlInf', param, 'GET', 'searchRingDtlInf');*/
			}
			mgMap.clearSelectLayer();
		}
	}


	/*==========================*
	 * httpRequest실행
	 *==========================*/
	var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

	/*==========================*
	 * httpRequest 성공
	 *==========================*/
	function successCallback(response, status, jqxhr, flag){
		/*....................................................*
	      GIS국사관리번호로 구성국사정보 가져와서 지도에 표시
		 *....................................................*/
		if(flag == 'getMapSearchInf'){
	    		var mtsoInfLayer = window.mtsoInfLayer;
	    		var result = {features: []};
	    		var param1 = {};

	    		for(i=0; i<response.LayerList.length;i++){
	  				if(  response.LayerList[i].lngVal != null && response.LayerList[i].latVal != null ){
				    	param1.type = 'Point';
				    	param1.style = 'SUBMIT_SETL_PCE_STYLE_POINT_1';
				    	param1.mgmtNo = response.LayerList[i].mtsoId;
				    	param1.coord =[response.LayerList[i].lngVal,response.LayerList[i].latVal];
				    	result.features.push(_M.createFeature(param1));
	  				}
	    		}
	    		mtsoInfLayer.addData(result);
	    		window.mgMap.setView([response.LayerList[0].latVal, response.LayerList[0].lngVal], 10);
	    		drawTitle(response);
		}
		if(flag == 'searchMtsoInf'){
			var mtsoLayerMarker = mgMap.addCustomLayerByName('UMTSO_LAYER1',{selectable: true});//국사표시를 위한 레이어
			var mtsoInfLayerClick = window.mtsoInfLayerClick;
			mtsoLayerMarker.closePopup();
	    	mtsoLayerMarker.clearLayers();
	    	var style = 'SUBMIT_SETL_PCE_STYLE_POINT_1';
	    	var result = {features: []};

	    	if(clickMtsoNm.split(",").length >1){

		    	for(var key in mtsoInfLayerClick._layers){
					 if(mtsoInfLayerClick._layers[key].feature.mgmtNo != response.mtsoInf.mtsoMgmtNo && mtsoInfLayerClick._layers[key].feature.mgmtNo != "" && mtsoInfLayerClick._layers[key].feature.mgmtNo != response.mtsoInf.mtsoId ){
						 if(mtsoInfLayerClick._layers[key]._latlng.lat != null && mtsoInfLayerClick._layers[key]._latlng.lng != null )
							 var param = {};
					    	param.type = 'Point';
					    	param.style = 'SUBMIT_SETL_PCE_STYLE_POINT_5';
					    	param.mgmtNo = mtsoInfLayerClick._layers[key].feature.mgmtNo;
					    	param.coord =[mtsoInfLayerClick._layers[key]._latlng.lng ,mtsoInfLayerClick._layers[key]._latlng.lat];
					    	result.features.push(_M.createFeature(param));
			    		}
				}
		    	mtsoInfLayerClick.clearLayers();
	    	}else{
	    		if( response.mtsoInf.latVal != null && response.mtsoInf.lngVal  != null ){
	    			 //feature 생성
	    				var param = {};
				    	param.type = 'Point';
				    	param.style = 'SUBMIT_SETL_PCE_STYLE_POINT_5';
				    	param.mgmtNo = response.mtsoInf.mtsoId;
				    	param.coord =[response.mtsoInf.lngVal ,response.mtsoInf.latVal];
				    	result.features.push(_M.createFeature(param));
	    		}
	    	}

	    	mtsoInfLayerClick.addData(result)

	    	if(response.mtsoInf.latVal != null && response.mtsoInf.lngVal != null){
	    		var html =
			            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
			            '<b>건물 소유 구분:</b><%pop_bldMgmtTypCd%><br>' +
			            '<b>수용 가능 랙 수 :</b><%pop_upsdAcptRackCnt%><br>'+
			            '<b>현재 사용율 :</b><%pop_upsdUseRate%><br>'+
			            '<b>5G 수용 계획 :</b><%pop_nbd5GAcptRsn%><br>'+
			            '<b>5G 종국 기준 유후 랙 수 :</b><%pop_nbd5GAcptVal%><br>'+
			            '<b>5G 상면 부족 여부 :</b><%pop_nbdUpsdShtgRsn%>';


	    		var nbdUpsdShtgRsn = response.mtsoInf.nbdUpsdShtgRsn;
	    		var nbdG5AcptVal = response.mtsoInf.nbdG5AcptVal;
	    		var bldOwnDivVal = response.mtsoInf.bldOwnDivVal;
	    		var upsdAcptRackCnt = response.mtsoInf.upsdAcptRackCnt;
	    		var g5DuhRackCnt = response.mtsoInf.g5DuhRackCnt;
	    		var upsdUseRate = response.mtsoInf.upsdUseRate;
	    		if(nbdUpsdShtgRsn == undefined){ nbdUpsdShtgRsn = " "; }
	    		if(nbdG5AcptVal == undefined){ nbdG5AcptVal = " "; }
	    		if(bldOwnDivVal == undefined){ bldOwnDivVal = " "; }
	    		if(upsdAcptRackCnt == undefined){ upsdAcptRackCnt = " "; }
	    		if(g5DuhRackCnt == undefined){ g5DuhRackCnt = " "; }
	    		if(upsdUseRate == undefined){ upsdUseRate = " "; } //

//

		        html = html.replace('<%pop_mtsoNm%>',response.mtsoInf.mtsoNm);

	        	html = html.replace('<%pop_bldMgmtTypCd%>',bldOwnDivVal);
		        html = html.replace('<%pop_upsdAcptRackCnt%>',upsdAcptRackCnt);
		        html = html.replace('<%pop_upsdUseRate%>',upsdUseRate);
		        html = html.replace('<%pop_nbd5GAcptRsn%>',nbdG5AcptVal);
		        html = html.replace('<%pop_nbd5GAcptVal%>',g5DuhRackCnt);
		        html = html.replace('<%pop_nbdUpsdShtgRsn%>',nbdUpsdShtgRsn);

		        var marker = L.marker([response.mtsoInf.latVal, response.mtsoInf.lngVal]);
		        mtsoLayerMarker.addLayer(marker);
		        marker.bindPopup(html).openPopup();
	    	}
	    	else{
	    		alert('대상 국사ID가 없습니다.');   /*"삭제할 대상을 선택하세요."*/
	    	}
		}

	}
	 function drawTitle(response) {
	    	var features = [];
	    	_.map(response.LayerList, function(item, index) {
	    		var feature = {};
	    		feature.type = "Feature";
	    		feature.properties = item;
	    		if(item.nbdUpsdShtgRsn == undefined){ item.nbdUpsdShtgRsn = " "; }
	    		if(item.nbdG5AcptVal  == undefined){ item.nbdG5AcptVal = " "; }
	    		if(item.bldOwnDivVal  == undefined){ item.bldOwnDivVal = " "; }

	    		if(item.upsdAcptRackCnt  == undefined){ item.upsdAcptRackCnt = " "; }
	    		if(item.g5DuhRackCnt  == undefined){ item.g5DuhRackCnt = " "; }
	    		if(item.upsdUseRate  == undefined){ item.upsdUseRate = " "; }

	    		feature.properties.LABEL = item.mtsoNm + "/" + item.bldOwnDivVal + "/" +
	    										item.upsdAcptRackCnt + "/" +	item.upsdUseRate+ "/" +
	    										item.nbdG5AcptVal+ "/" + item.g5DuhRackCnt+ "/" + item.nbdUpsdShtgRsn;
	    		feature.geometry = {};
	    		feature.geometry.type = 'Point';
	    		feature.geometry.coordinates = [item.lngVal , item.latVal];
	    		feature.keyNames = ["LABEL"];
	    		feature.style = [ { id : "KEPCO_TLPL_TEXT" ,type: 'text'} ];

	    		features[index] = feature;
	    	});
	    	var mtsoLayerLabel = mgMap.getCustomLayerByName("MTSO_LAYER_LABEL");
	    	if (mtsoLayerLabel) {
	    		mtsoLayerLabel.clearLayers();
	        } else {
	        	mtsoLayerLabel =mgMap.getCustomLayerByName("MTSO_LAYER_LABEL");
	        }
	    	var result = {
	    			features : features
	    	};

	    	mtsoLayerLabel.addData(result);
	    	var textIconOption = {
	    			labelColumn : "LABEL",
		   			faceName : "궁서",
		   			size : "15",
		   			color : "blue",
		   			hAlign : "middle",
		   			vAlign : "top",
		   			opacity : 1.0,
		   			weight: 100
	    	};
	    	for (var key in mtsoLayerLabel._layers) {
	    		var layer = mtsoLayerLabel._layers[key];
	    		layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL, hAlign : "middle", vAlign : "top"})));
	    	}
	    	$('#map').progress().remove();
	    }

    	//HTTP 성공처리끝

	/*==========================*
	 * 그리드에 조회결과 세팅
	 *==========================*/
	function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
      	};
       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    /*====================================*
	 * select 가능한 링레이어 지도표시하기
	 *====================================*/
    function drawRingLayerThatCanBeSelected(gisRingInf, layerId){
    	var ringMgmtNo = gisRingInf.ringMgmtNo;
    	var ringLatLng = gisRingInf.ringLatLng;
    	var lineStyle = null;
    	if(layerId == "RING_MAP_LAYER"){//링조회에서 온거면 핑크링
    		lineStyle = 'STYLE_RING_STRONG_PINK_LINE';
    	}else{//주변링조회에서 온거면 검정링
    		lineStyle = 'STYLE_RING_STRONG_BLACK_LINE';
    	}
		var result = { features :[{ type : 'Feature',
				                    mgmtNo : ringMgmtNo,
				                    geometry : {
				                    type : 'LineString',
				                    coordinates :  ringLatLng
				                },
				                style : [{id: lineStyle}]
				            }
				        ]
				    };
		//window.mgMap.clearSelectLayer();/*select된 레이어들 clear*/
        var ringInfPopupLayer = window.ringInfPopupLayer;
   //    ringInfPopupLayer.closePopup(); //링정보팝업 닫아주고
   	//	ringInfPopupLayer.clearLayers();//링정보팝업레이어 clear

		var ringLayer = window.mgMap.getCustomLayerByName(layerId);
//		if(ringLayer) {//레이어 있으면 초기화
//			ringLayer.clearLayers();
//        }else{//레이어 없으면 새로 생성-선택가능한 레이어로
//        	ringLayer = window.mgMap.addCustomLayerByName(layerId, {selectable: true});
//        }
		ringLayer = window.mgMap.addCustomLayerByName(layerId, {selectable: true});
		ringLayer.addData(result);//생성한 feature 추가
		//주변링레이어 그룹에 포함
 		var rangeRingLayerGroup = window.rangeRingLayerGroup;
 		rangeRingLayerGroup.addLayer(ringLayer);

        //링조회에서 넘어온 링그리기는 feature의 전체 영역으로 지도이동
		if(layerId == "RING_MAP_LAYER"){
			window.mgMap.fitBounds(ringLayer.getBounds(),window.mgMap.getZoom());
		}
    }

    /*==========================*
	 * 레이어지우기
	 *==========================*/
    function clearLayerFunc(layerId){
	    var layer = window.mgMap.getCustomLayerByName(layerId);
		if(layer) {
			layer.clearLayers();
		}
    }

    /*==========================*
	 * 팝업
	 *==========================*/
    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 300,
                  height : window.innerHeight * 0.35
              });
        }

    /*==========================*
	 * httpRequest 실패
	 *==========================*/
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'searchMtso'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail']+"01" , function(msgId, msgRst){});
    	}
    	if(flag == 'searchRing'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail']+"02" , function(msgId, msgRst){});
    	}
    	if(flag == 'searchGisMtsoInf'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail']+"03" , function(msgId, msgRst){});
    	}
    	if(flag == 'searchGisRingInf'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    	if(flag =='serachRingMapList'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'searchMtsoInf'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }


    /*==========================*
	 *  시,도 선택
	 *==========================*/
    function setSido(){
    	L.MG.Api.getSidoByCode().then(function(result){
    		$('#sido').off('change').empty();
    		$('#sido').append('<option value="0">지역선택</option>');
    		_.each(result, function(item, idx){
    			var html = '<option value=<%id%> data-id=<%code%> data-x=<%x%> data-y=<%y%>><%label%></option>';
    			html = html.replace('<%id%>', item.SIDO_CODE);
    			html = html.replace('<%code%>', item.ADMCODE);
    			html = html.replace('<%x%>', item.COORD_X);
    			html = html.replace('<%y%>', item.COORD_Y);
    			html = html.replace('<%label%>', item.SIDO_NAME);
    			$('#sido').append(html);
    		})
    		$('#sido').on('change', function(e){
    			var id = $(e.target).val();
    			setArea(id);
    			if(id == 0){
    				$('#area').attr('disabled', true);
    			}else{
    				$('#area').attr('disabled', false);
    			}
    		})
    	})
    }

    /*==========================*
	 *  구,군,시 선택
	 *==========================*/
    function setArea(sidoCode){
    	L.MG.Api.getSggByCode(sidoCode).then(function(result){
    		$('#area').off('change').empty();
    		$('#area').append('<option value="0">선택</option>');
    		_.each(result, function(item, idx){
    			var html = '<option value=<%id%> data-id=<%code%> data-x=<%x%> data-y=<%y%>><%label%></option>';
    			html = html.replace('<%id%>', item.SGG_CODE);
    			html = html.replace('<%code%>', item.ADMCODE);
    			html = html.replace('<%x%>', item.COORD_X);
    			html = html.replace('<%y%>', item.COORD_Y);
    			html = html.replace('<%label%>', item.SGG_NAME);
    			$('#area').append(html);
    		})

    		$('#area').on('change', function(e){
    			//해당 좌표로 이동
    			window.mgMap.setView([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x]);
    			//window.mgMap.setView([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x], 13);
    			//반경거리 표시해주고
    			var circleRange = 0;
		        if (circleRange != 0){
		        	var distance_circle_layer = window.distanceCircleLayer;
 			        distance_circle_layer.clearLayers();
				    var distance_circle = L.circle([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x], parseInt(circleRange));
				    distance_circle_layer.addLayer(distance_circle);
		        }
		       //주변국사조회
	        //   searchAroundMtso("");
	           //주변링조회
	       //    searchAroundRing();
    		})
    	})
    }

    /*==========================*
	 * 사용자 레이어 스타일
	 *==========================*/
    function addUserLayerStyles() {
	    var styles = [
	        {
	            id : 'STYLE_RING_STRONG_BLACK_LINE',
	            type : L.MG.StyleCfg.STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#000000', //선색상
	            	weight : 5         //선두께
	            }
	        },{
	            id : 'STYLE_RING_STRONG_PINK_LINE',
	            type : L.MG.StyleCfg.STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#FF00DD', //선색상
	            	weight : 5         //선두께
	            }
	        },{
	            id : 'STYLE_RING_POPUP_LINE',
	            type : L.MG.StyleCfg.STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#050099', //선색상
	            	weight : 4         //선두께
	            }
	        },{//국소
        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_1',
	            type : L.MG.StyleCfg.STYLE_TYPE.POINT,
				options: {
					opacity: 1.0,
					markerType: 'icon',
					iconUrl: '../../resources/images/ico_layer_r.png',
					iconSize : [ 10, 10 ],
					iconAnchor : [ 7, 7 ]
				}
	        },{//전송실
        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_2',
	            type : L.MG.StyleCfg.STYLE_TYPE.POINT,
				options: {
					opacity: 1.0,
					markerType: 'icon',
					iconUrl: '../../resources/images/T_tmof.png',
					iconSize : [ 15, 15 ],
					iconAnchor : [ 7, 7 ]
				}
	        },{//중심국 국사
	        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_3',
		            type : L.MG.StyleCfg.STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/T_cif.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
		        },{//skt기지국
		        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_4',
			            type : L.MG.StyleCfg.STYLE_TYPE.POINT,
						options: {
							opacity: 1.0,
							markerType: 'icon',
							iconUrl: '../../resources/images/T_btmso.png',
							iconSize : [ 15, 15 ],
							iconAnchor : [ 7, 7 ]
						}
		        },{//skt기지국
		        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_5',
			            type : L.MG.StyleCfg.STYLE_TYPE.POINT,

						options: {
							opacity: 1.0,
							markerType: 'icon',
							iconUrl: '../../resources/images/mtsoClickLabel.png',
							iconSize : [ 45, 45 ],
							iconAnchor : [ 22, 22 ]
						}
		        },{
					id : "KEPCO_TLPL_TEXT",
					type : L.MG.StyleCfg.STYLE_TYPE.TEXT, // 텍스트 타입
					options : {
						labelColumn : "LABEL",
						faceName : "궁서",
						size : "10",
						color : "red",
						hAlign : "midlle",
						vAlign : "top",
						opacity : 8.0,
					}

		        }
	    ];

	    //시스템에 사용할 스타일 설정
	    L.MG.StyleCfg.setCustomStyles(styles);

  	}


    /*==========================*
	 * 컬럼 숨기기
	 *==========================*/



