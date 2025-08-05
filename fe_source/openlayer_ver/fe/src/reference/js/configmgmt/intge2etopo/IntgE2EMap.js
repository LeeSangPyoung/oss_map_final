//$a.page(function() {
/*==========================*
	 *  변수선언
	 *==========================*/
    //마우스 이벤트에 따른 margin값 참조 변수
    var startX;
    var targetX = 0;
    //html요소 참조를 위한 변수 선언
    var mContainer;
    var tab;
    var START_WIDTH = 535;
    var sideTabToggle = false;

    //마우스 이벤트에 따른 margin값 참조 변수
    var startX2
    var targetX2 = 0;
    //html요소 참조를 위한 변수 선언
    var mContainer2;
    var tab2;
    var START_WIDTH2 = 345;
    var sideTabToggle2 = false;

    //리스트 하이라이트 row 인덱스
    var mtsoColorIndex = null;//주변국사 용
    var ringColorIndex = null;//주변링 용

    //상위 조회조건 용
    var circleRange = 0;//반경거리
    var mtsoDetlTypCdList = [];//국사상세구분코드
    var ntwkTypCdList = [];//망구분코드
    var topoSclCdList = [];//링유형코드

    //원장 읽어 받아오는 결과
    var TopoData = []; //망종류
	var NtwkTypData = []; //망구분

	var ringLatLngParam = [];
	var mtsoIdParam = [];
	var coordParam = [];
	var eqpSctnIdParam = [];
	var flagParam = "";

	//링조회, 국사조회시 페이당 줄수
	var perPage = 100;

	/*==========================*
	 *  function load()
	 *==========================*/
    function load() {

        /** 맵 생성 **/
    	 var options = {  //맵생성옵션
    	        	app: 'tango',
    	        	contextmenu: false,
    	            location: {zoom: 13, center: [37.5087805938127, 127.062289345605]}
    	        };

        // 1. 'map' : 맵 생성을 위한 target div element의 id
        // 2. 'BASEMAP' : 설비 없이 베이스 지도만 생성
        // 3. 'BASEMAP' 대신 'TANGO-T'를 입력한 경우 설비 및 미리 정의된 옵션으로 맵 생성
        MapGeo.create('map', 'TANGO-T', options).then(function (map) {

        	window.mgMap = map;// 생성된 map 객체를 window 객체에 추가하여 전역으로 사용 가능
        	window.mtsoInfLayer = map.addCustomLayerByName('MTSO_INF_LAYER');//국사표시를 위한 레이어
        	window.distanceCircleLayer = map.addCustomLayerByName('DISTANCE_CIRCLE_LAYER');//반경거리표시를 위한 레이어
        	window.ringInfPopupLayer = map.addCustomLayerByName('RING_INF_POPUP_LAYER');//링정보표시를 위한 레이어
        	window.rangeRingLayerGroup = L.layerGroup();//링표시 레이어들의 그룹

        	//국사레이어만 선택가능하게
        	//국사레이어만 표시
        	var layers = map.getVectorLayers();
        	_.each(layers, function(layer, index) {
        		if ( layer.getLayerAliasName()=='T_국소' ||
        			 layer.getLayerAliasName()=='T_전송실' ||
        			 layer.getLayerAliasName()=='T_중심국_국사') {
        			layer.properties.selectable = true;
        			layer.setVisible(true);
        		} else {
            		layer.properties.selectable = false;
            		layer.setVisible(false);
        		}
        	});

        	//시도 정보 세팅
//        	setSido();
            //시설물 선택 이벤트
        	map.on("mg-selected-features", onClickFeatures);
        	//사용자 레이어 스타일 설정
            addUserLayerStyles();

            setData();
        });

        /** 이벤트 걸기**/
        setEventListener();
    }

    function setData(){

    	mtsoIdParam = opener.paramInfo().mtsoId;
    	fcltDataParam = opener.paramInfo().fcltData;
    	ringLatLngParam = opener.paramInfo().ringLatLng;

    	coordParam = opener.paramInfo().coord;
    	eqpSctnIdParam = opener.paramInfo().eqpSctnId;
    	flagParam = opener.paramInfo().flag;

    	ntwkLineNoParam = opener.paramInfo().ntwkLineNo;

		var gisRingInf = null;

		if(window.mgMap != undefined){
			var paramData = "1=1";
			if(mtsoIdParam != undefined){
				for (var i = 0; i < mtsoIdParam.length; i++) {
					paramData += '&mtsoIdList=' + mtsoIdParam[i];
				}
				httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/mtsoMapInf', paramData, 'GET', 'searchGisMtsoInf');
			}else if(fcltDataParam != undefined){
				searchGisFcltInf(fcltDataParam);
			}

			if(flagParam == "GIS"){
	    		searchGisRingInf(coordParam, eqpSctnIdParam);
	    	}else if(flagParam == "RING"){
	    		var param = new Object();
	    		param.ntwkLineNo = ntwkLineNoParam;
	    		param.layerId = "RING_MAP_LAYER";
	    		httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisRingInfList', param, 'GET', 'searchGisRingInf');
	    	}else{
	    		var gisRingInf = null;
	    		gisRingInf = {"ringMgmtNo": "", "ntwkLineNo": "", "ringLatLng": ringLatLngParam, "type": ""};
	    		drawRingLayerThatCanBeSelected(gisRingInf, "RING_MAP_LAYER"); //링그리기
	    	}
		}
    }

    /*==========================*
	 * 이벤트 걸기
	 *==========================*/
    function setEventListener() {
    	/*...........................*
		    메뉴 관련
		 *...........................*/
        /**메뉴 마우스 아웃**/
        $('#search').on('mouseenter', function(e){
        	menuDivInit();
        })

        /**맵 마우스 오버**/
        $('#map').on('mouseenter', function(e){
        	menuDivInit();
        })

        /** 국사우클릭 관련 이벤트**/
    	 $(document).contextmenu(function(e) {
     		var feature = window.mgMap.getSelectedFeatures();
     		//중첩국지국정보처리 들어가야지

     		e.preventDefault();
     	});

	};//이벤트리스너 끝
	 /*==========================*
	 * 시설물선택하면 시설물 정보 가져오기
	 *==========================*/
	function onClickFeatures(featuresObj) {

		if (featuresObj.features.length > 0){
			var layerId = featuresObj.features[0].feature.getLayerId();
			var layer = window.mgMap.getLayerById(layerId);
			var layrNm = layer.getLayerAliasName();
			var mgmtNo = L.MG.Util.objectId(featuresObj.features[0]);
			var geometry = featuresObj.features[0].feature.geometry;
			var symbolType = geometry.type;

			//국사선택시
			if ( layrNm =='T_국소' ||
       			 layrNm =='T_전송실' ||
       			 layrNm =='T_중심국_국사') {

			    //시설물관리번호로 국사정보 가져오기
				var param = new Object();
				param.mtsoMgmtNo = mgmtNo;//GIS국사관리번호
				param.mtsoLatVal = geometry.coordinates[1];//featureObj의 위도
				param.mtsoLngVal = geometry.coordinates[0];//featureObj의 경도
				httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getMtsoInf', param, 'GET', 'searchMtsoInf');

			//링선택시
			}else if(symbolType == "LineString"){
				//링상세정보와 링-장비리스트 가지러 가기
				var param = new Object();
				param.ringMgmtNo = featuresObj.features[0].feature.mgmtNo;
				param.layerId = layerId;

				if(layerId = "RING_MAP_LAYER"){//링조회에서 그린 링레이어 선택이면
					param.shouldSelectRow = false;//주변링 리스트에 선택 표시할 필요없어
				}else{//주변링조회에서 그린 주변링레이어 선택이면
					param.shouldSelectRow = true;//주변링 리스트에서 해당링 줄 선택표시
					$('#ringEqpListGrid').alopexGrid('showProgress');//링-장비조회 중임 표시
				}
	 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRingDtlInf', param, 'GET', 'searchRingDtlInf');
			}
		}
	}

		/*==========================*
		 * 주변국사 조회
		 *==========================*/
		var searchAroundMtso = function(mtsoId){
			//지도의 영역을 구해서 wkt형식으로 변환한다.
			var mapBounds = window.mgMap.getBounds(); //지도영역을 구한다.
			var northEast = mapBounds._northEast;
			var southWest = mapBounds._southWest;
			var northWest = new Object(); northWest.lng = southWest.lng; northWest.lat = northEast.lat;
			var southEast = new Object(); southEast.lng = northEast.lng; southEast.lat = southWest.lat;

			var boundsLatLng = [];
			boundsLatLng[0] = northWest;
			boundsLatLng[1] = southWest;
			boundsLatLng[2] = southEast;
			boundsLatLng[3] = northEast;

			var geoJson = L.polygon([boundsLatLng]).toGeoJSON();//Geo Json형식으로
			var boundsWkt = L.MG.Util.geoJsonToWKT(geoJson);    //Geo Wkt형식으로

			//장비구분 조건 체크한다.
			var roadmCheck   = false; if ($('#ROADM').is(':checked')){ roadmCheck = true; };
			var ptsCheck     = false; if ($('#PTS').is(':checked')){ ptsCheck = true; };
			var ringmuxCheck = false; if ($('#RING_MUX').is(':checked')){ ringmuxCheck = true; };
			var l2swCheck    = false; if ($('#L2SW').is(':checked')){ l2swCheck = true; };
			var l3swCheck    = false; if ($('#L3SW').is(':checked')){ l3swCheck = true; };
			var msppCheck    = false; if ($('#MSPP').is(':checked')){ msppCheck = true; };

			//하이라이트해 준 기준국사있으면 clear하고
			if(mtsoColorIndex != null && mtsoColorIndex != ""){
				$('#orgListGrid').alopexGrid("updateOption", { rowOption : {
	                 styleclass : function(data, rowOption){
	                                  if(data._index.row == mtsoColorIndex ){
	                                      return 'row-highlight-unselect'; } } } });
				mtsoColorIndex = "";
			}

			//파라미터생성
			var param= "geoWkt="+boundsWkt+
			           "&roadmCheck="+roadmCheck+
			           "&ptsCheck="+ptsCheck+
			           "&ringmuxCheck="+ringmuxCheck+
					   "&l2swCheck="+l2swCheck+
					   "&l3swCheck="+l3swCheck+
					   "&msppCheck="+msppCheck+
					   "&mtsoDetlTypCdList="+mtsoDetlTypCdList+
					   "&mtsoId="+mtsoId;
			$('#orgListGrid').alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRangeMtsoList', param, 'GET', 'searchRangeMtsoList');
		}

	/*==========================*
	 * 주변링 조회
	 *==========================*/
	var searchAroundRing = function(){
		//링커스텀레이어 다 클리어
		var rangeRingLayerGroup = window.rangeRingLayerGroup;
		rangeRingLayerGroup.eachLayer(function (layer){
			layer.clearLayers();
		});
		rangeRingLayerGroup.clearLayers();
		//링정보팝업레이어 클리어
		var ringInfPopupLayer = window.ringInfPopupLayer;
		ringInfPopupLayer.closePopup();
		ringInfPopupLayer.clearLayers();
		//선택된 이벤트레이어 초기화
		window.mgMap.clearSelectLayer();
		//주변링리스트에 진하게 표시했던 줄 있으면 clear
		if(ringColorIndex != null && ringColorIndex != ""){
			$('#rangeRingGrid').alopexGrid({
	            rowOption : {
	               styleclass : function(data, rowOption){
	                                if(data._index.row == ringColorIndex ){
	                                      return 'row-highlight-unselect';
	                                }
	                            }
	                        }
	     });
		 ringColorIndex = "";
		}
		//링-장비리스트도 클리어
	    $('#ringEqpListGrid').alopexGrid('dataEmpty');

		//지도의 영역을 구해서 wkt형식으로 변환한다.
		var mapBounds = window.mgMap.getBounds(); //지도영역을 구한다.
		var northEast = mapBounds._northEast;
		var southWest = mapBounds._southWest;
		var northWest = new Object(); northWest.lng = southWest.lng; northWest.lat = northEast.lat;
		var southEast = new Object(); southEast.lng = northEast.lng; southEast.lat = southWest.lat;

		var boundsLatLng = [];
		boundsLatLng[0] = northWest;
		boundsLatLng[1] = southWest;
		boundsLatLng[2] = southEast;
		boundsLatLng[3] = northEast;
		var geoJson = L.polygon([boundsLatLng]).toGeoJSON();//Geo Json형식으로
		var boundsWkt = L.MG.Util.geoJsonToWKT(geoJson);    //Geo Wkt형식으로

		var param= "geoWkt="+boundsWkt+"&topoSclCdList="+topoSclCdList+"&ntwkTypCdList="+ntwkTypCdList;
		$('#rangeRingGrid').alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRangeRingList', param, 'GET', 'searchRangeRingList');
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
		if(flag == 'searchMtsoInf'){
			//선택된 이벤트레이어 초기화
			window.mgMap.clearSelectLayer();
			//국사표시
			var mtsoInfLayer = window.mtsoInfLayer;
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();
	        var marker = L.marker([response.mtsoLatVal, response.mtsoLngVal], {radius:20});
	        mtsoInfLayer.addLayer(marker);

			var mtsoInf = response.mtsoInf;
			var mtsoId = null;
    		mtsoId = mtsoInf.mtsoId;

    		//국사ID가 없을 경우
    		if (mtsoId == null || mtsoId == "") {
    			//국사정보팝업
 				var html =
 		            '<b>시설코드:</b><%pop_mtsoMgmtNo%><br>'+
 		            '<b>경도    :</b><%pop_mtsoLatVal%><br>'+
 		            '<b>위도    :</b><%pop_mtsoLngVal%>';

 		        html = html.replace('<%pop_mtsoMgmtNo%>',response.mtsoMgmtNo);
 		        html = html.replace('<%pop_mtsoLatVal%>',response.mtsoLatVal);
 		        html = html.replace('<%pop_mtsoLngVal%>',response.mtsoLngVal);
 		        marker.bindPopup(html).openPopup();
 		        //장비리스트 클리어
 		        $('#eqpListGrid').alopexGrid('dataEmpty');

 			}else{//국사ID가 있는 경우
 				//국사정보팝업
 				var html =
 		            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
 		            '<b>시설코드:</b><%pop_mtsoMgmtNo%><br>'+
 		            '<b>국사번호:</b><%pop_mtsoId%><br>'+
 		            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
 		            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
 		            '<b>건물주소:</b><%pop_bldAddr%>';

 		        html = html.replace('<%pop_mtsoNm%>',mtsoInf.mtsoNm);
 		        html = html.replace('<%pop_mtsoMgmtNo%>',response.mtsoMgmtNo);
 		        html = html.replace('<%pop_mtsoId%>',mtsoId);
 		        html = html.replace('<%pop_mtsoTyp%>',mtsoInf.mtsoTyp);
 		        html = html.replace('<%pop_mtsoStat%>',mtsoInf.mtsoStat);
 		        html = html.replace('<%pop_bldAddr%>',mtsoInf.bldAddr);
 		        marker.bindPopup(html).openPopup();

 				//왼쪽메뉴등장
 		        showLeftContainer();

 		    	//주변국사리스트에 있으면 하이라이트
 		    	var orgList = [];
 		    	orgList = $('#orgListGrid').alopexGrid("dataGet", {"mtsoId":mtsoId}, "mtsoId");
 		    	var selectRowIndex = 0;
 		    	if(orgList.length > 0){
 		    		//해당줄 select 표시
 		    		selectRowIndex = orgList[0]._index.row;
 		    		$('#orgListGrid').alopexGrid("focusCell", {_index : {data : selectRowIndex}}, "mtsoNm" );
 		    		$('#orgListGrid').alopexGrid("rowSelect", {_index : {data : selectRowIndex}},  true );

 		    		//장비리스트만 조회
 		    		var param = {mtsoId:mtsoId};
 					$('#eqpListGrid').alopexGrid('showProgress');
 		 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getEqpList', param, 'GET', 'searchEqpList');

 		    	//주변국사리스트에 없으면 지도이동하고 새로 주변링과 주변국사 조회
 		    	}else{
 		    		//가운데로 이동시키고
 		    		window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], 13);
 		    		//반경거리 표시해주고
 			        if (circleRange != 0){
 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 			        distance_circle_layer.clearLayers();
 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
 					    distance_circle_layer.addLayer(distance_circle);
 			        }

 		    		//주변국사조회
 			        searchAroundMtso(mtsoId);
 			        //주변링조회
 			        searchAroundRing();
 		    	}
 			}
		}

    	/*...........................*
          국사세부유형
		 *...........................*/
		if(flag =='mtsoDetlTyp'){
			for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			var addHtml = '<div class="mtsoDetlTypeCheck">'+
								 '<input id="mtsoTypCd'+resObj.comCd+'" type="checkbox">' +
							       '<span style="font-size: 12px; font-weight: bold;">'+resObj.comCdNm+ '</span>' +
							     '</input>' +
						      '</div>';
    			$('#mtsoDivMenu').append(addHtml);
    		}

			 //국사유형체크 이벤트준다
	        $('.mtsoDetlTypeCheck').on('click', function(e){
	        	var t = e.target.attributes[0].nodeValue;
	        	if(t.substring(0,9) == 'mtsoTypCd'){ //isNaN(t):false --> 숫자이다
	        	    //코드값 리스트에 넣어주기
	        		var arr = [];

	        		if ($('#'+t).is(':checked')){
	        			mtsoDetlTypCdList.push(t.substring(9, t.length));
	        		}else{
	        			var cnt = 0;
	        			for(i=0; i<mtsoDetlTypCdList.length; i++ ){
		        			if(mtsoDetlTypCdList[i] != null && mtsoDetlTypCdList[i] != "" && mtsoDetlTypCdList[i] != t.substring(9, t.length)){
		        				arr[cnt] = mtsoDetlTypCdList[i];
		        				cnt++;
		        			}
		        		}
	        		    mtsoDetlTypCdList = arr;
	        		}
	        	}
	       })
		}

		/*...............................................................................*
         링상세정보 가져온 후--> 링정보팝업레이어(select불가능) 그리고 링-장비리스트 세팅
		*................................................................................*/
	    if(flag =='searchRingDtlInf'){
	    	var gisRingInf = response.gisRingInf; //GIS 링정보
	    	var ringDtlInf = response.ringDtlInf; //링 상세정보
	    	var ringEqpList = response.ringEqpList; //링-장비리스트
	    	var layerId = response.layerId; //레이어ID

	      //팝업할 국사정보 세팅
 		    var html =
		            '<b>링&nbsp;&nbsp;&nbsp;&nbsp;이&nbsp;&nbsp;&nbsp;&nbsp;름: </b><%pop_ntwkLineNm%><br>'+
		            '<b>망&nbsp;&nbsp;&nbsp;&nbsp;구&nbsp;&nbsp;&nbsp;&nbsp;분: </b><%pop_ntwkTypNm%><br>'+
		            '<b>망&nbsp;&nbsp;&nbsp;&nbsp;종&nbsp;&nbsp;&nbsp;&nbsp;류: </b><%pop_topoSclNm%><br>'+
		            '<b>용&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;량: </b><%pop_ntwkCapaNm%><br>'+
		            '<b>링절체방식: </b><%pop_ringSwchgMeansNm%><br>'+
		            '<b>상위국사명: </b><%pop_uprMtsoIdNm%><br>'+
		            '<b>하위국사명: </b><%pop_lowMtsoIdNm%><br>' +
		            '<b>소유사업자: </b><%pop_mgmtGrpCdNm%><br>'+
		            '<b>대표회선명: </b><%pop_repNtwkLineNm%><br>';

	        html = html.replace('<%pop_ntwkLineNm%>',ringDtlInf.ntwkLineNm);
	        html = html.replace('<%pop_ntwkTypNm%>',ringDtlInf.ntwkTypNm);
	        html = html.replace('<%pop_topoSclNm%>',ringDtlInf.topoSclNm);
	        html = html.replace('<%pop_uprMtsoIdNm%>',ringDtlInf.uprMtsoIdNm);
	        html = html.replace('<%pop_lowMtsoIdNm%>',ringDtlInf.lowMtsoIdNm);
	        html = html.replace('<%pop_mgmtGrpCdNm%>',ringDtlInf.mgmtGrpCdNm);
	        if(ringDtlInf.ntwkCapaNm != null){html = html.replace('<%pop_ntwkCapaNm%>',ringDtlInf.ntwkCapaNm)}
	                                     else{html = html.replace('<%pop_ntwkCapaNm%>',' -------')};
            if(ringDtlInf.ringSwchgMeansNm != null){html = html.replace('<%pop_ringSwchgMeansNm%>',ringDtlInf.ringSwchgMeansNm)}
            								   else{html = html.replace('<%pop_ringSwchgMeansNm%>',' -------')};
            if(ringDtlInf.repNtwkLineNm != null){html = html.replace('<%pop_repNtwkLineNm%>',ringDtlInf.repNtwkLineNm)}
			                                   else{html = html.replace('<%pop_repNtwkLineNm%>',' -------')};

			//링정보팝업레이어 초기화
	        var ringInfPopupLayer = window.ringInfPopupLayer;
	        ringInfPopupLayer.closePopup();
	   		ringInfPopupLayer.clearLayers();

	   		//주변링조회 레이어의  그림이나 링조회 레이어의 그림 클릭해서 넘어 온 것이면
			if(response.shouldSelectRow || response.layerId == "RING_MAP_LAYER"){
				//select된feature가져와서 정보팝업
				var featuresObj = window.mgMap.getSelectedFeatures();
				featuresObj[0].bindPopup(html).openPopup();

				if(response.shouldSelectRow){//주변링 리스트 선택표시해야하면
					//주변링리스트의 row 색 진하게 표시
		    		var indexRow =  response.layerId.substring(17, response.layerId.length);
		            $('#rangeRingGrid').alopexGrid({
		                   rowOption : {
		                      styleclass : function(data, rowOption){
		                                       if(parseInt(data._index.row) == parseInt(indexRow) ){
		                                             return 'row-highlight-gray';
		                                       }
		                                   }
		                               }
		            });
		            ringColorIndex = indexRow;//진하게한 인덱스 저장
				}

	        //주변링 리스트 더블클릭으로 넘어 온 거면
			}else{
				window.mgMap.clearSelectLayer();//select된거 있으면 clear하고
				//feature생성해서
				var ringMgmtNo = gisRingInf.ringMgmtNo;
		    	var geoJson = L.MG.Util.wktToGeometry(gisRingInf.geoWkt).toGeoJSON();
		    	var ringLatLng = geoJson.geometry.coordinates;
				var result = { features :[{ type : 'Feature',
						                    mgmtNo : ringMgmtNo,
						                    geometry : {
						                    type : 'LineString',
						                    coordinates :  ringLatLng
						                },
						                style : [{id:'STYLE_RING_POPUP_LINE'}]
						            }
						        ]
						    };
				ringInfPopupLayer.addData(result);//레이어에 추가하고
				window.mgMap.fitBounds(ringInfPopupLayer.getBounds());
				ringInfPopupLayer.bindPopup(html).openPopup();//정보팝업
			}

			if(response.layerId != "RING_MAP_LAYER"){//주변링에서 넘어온 거면 링-장비리스트 세팅
				$('#ringEqpListGrid').alopexGrid('hideProgress');
	         	$('#ringEqpListGrid').alopexGrid('dataSet', ringEqpList, "");
			}

	    }


	    if(flag =='searchGisLineInf'){

			var gisRingInf = null;
			//GIS링정보가 없을 경우
    		if (response.mtsoLineMapList.length == 0) {
    			//레이어초기화
    			clearLayerFunc(response.layerId);
    			//GIS 링관리번호가 없습니다.
        		callMsgBox('','W', configMsgArray['noGisRingMgmtNo'] , function(msgId, msgRst){});

        	//GIS링정보가 있을 경우
 			}else{
 				var ringLatLng = "";
 				var cnt = 0;

 				for(var i=0; i<response.mtsoLineMapList.length; i++){
 					var coord = response.mtsoLineMapList[i].coord.split('/');
 					for(var c=0; c<coord.length; c++){
 						if(c == coord.length-1){
 		 					ringLatLng += "["+coord[c]+"]";
 						}else{
 							ringLatLng += "["+coord[c]+"],";
 						}
					}
 				}

 				gisRingInf = {"ringMgmtNo": "", "ntwkLineNo": "", "ringLatLng": JSON.parse("["+ringLatLng+"]"), "type": ""};
 	    		//링GEO정보가 없을 경우
 	    		if (ringLatLng == null || ringLatLng == "") {
 	    			//레이어초기화
	 	   			clearLayerFunc(response.layerId);
 	 				//GIS 링맵정보가 없습니다.
 	 				callMsgBox('','W', configMsgArray['noGisRingMapInfo'] , function(msgId, msgRst){});
 	 			//링GEO정보가 있을 경우
 	 			}else{
 	 	 			drawRingLayerThatCanBeSelected(gisRingInf, "RING_MAP_LAYER"); //링그리기
 	 			}
 			}
    	}

	    /*...........................*
        GIS링정보 가져온 후 링그리기
	 *...........................*/
	if(flag =='searchGisRingInf'){

		var gisRingInf = null;
		//GIS링정보가 없을 경우
		if (response.gisRingInf.length == 0) {
			//레이어초기화
			clearLayerFunc(response.layerId);
			//GIS 링관리번호가 없습니다.
    		callMsgBox('','W', configMsgArray['noGisRingMgmtNo'] , function(msgId, msgRst){});

    	//GIS링정보가 있을 경우
			}else{
				var ringLatLng = "";
				var lastData = [];	//전체 DATA
				var cnt = 0;

				//마지막 라인의 좌우여부를 판단하기 위해 첫번째라인 정보를 가져온다
				var coord0 = response.gisRingInf[0].coord.split('/');
				//첫 라인의 좌우여부를 판단하기 위해 두번째라인 정보를 가져온다
				var coordF = response.gisRingInf[1].coord.split('/');

				for(var i=0; i<response.gisRingInf.length; i++){
					var coord = response.gisRingInf[i].coord.split('/');
					var coordA = []; //각 라인의 다음 라인 DATA

				var swnData = [];	//좌우가 바뀐 각 라인 DATA
				var cnt3 = 0;	//좌우를 바꿀지 여부 카운트 0:바꾸지 않는다  1:바꾼다

				//각 라인의 DATA 좌우를 바꿔 메모리에 넣는다.
				for(var c=1; c<coord.length+1; c++){
					swnData[c-1] = coord[coord.length-c];
				}

				//첫번째 라인 좌우 계산을 위해
				if(i == 0){
					for(var j=0; j<coordF.length; j++){
						if(coordF[j] == coord[0]){
							//처음 시작할때 처음 위치가 다음 DATA에 포함되어 있으면 좌우를 바꾼다
							cnt3 = 1;
						}
						}
				}

				//중간 라인 좌우 계산을 위해
				if(i > 0 && i < response.gisRingInf.length-1){
					//각 라인의 좌우여부를 판단하기 위해 각 라인의 다음 라인 정보를 가져온다
						coordA = response.gisRingInf[i+1].coord.split('/');

						if(lastData[lastData.length-1] == coord[0]){
							//이전 마지막 위치와 현재 처음 위치가 같으므로 DATA의 좌우를 바꾸지 않음
							cnt3 = 0;
						}else if(lastData[lastData.length-1] == coord[coord.length-1]){
							//이전 마지막 위치와 현재의 끝 위치가 같으므로 DATA의 좌우를 바꾼다
							cnt3 = 1;
						}else{
							//이전 마지막 위치가 현재 DATA에 존재하지 않으면 좌우를 바꾸지 않는다
							cnt3 = 0;
						}

						for(var j=0; j<coordA.length; j++){
							for(var k=0; k<coordA.length; k++){
								if(coordA[j] == coord[0]){
									//현재 처음 위치가 다음 DATA에 포함되어 있으면 좌우를 바꾼다.
									cnt3 = 1;
								}
							}
						}
					}

				//마지막 라인 좌우 계산을 위해
				if(i == response.gisRingInf.length-1){
					//이전 마지막 위치와 현재의 끝 위치가 같으므로 DATA의 좌우를 바꾼다
					if(lastData[lastData.length-1] == coord[coord.length-1]){
						cnt3 = 1;
					}

					for(var j=0; j<coord0.length; j++){
						if(coord0[j] == coord[0]){
							//마지막 라인의 처음 위치가 첫번째 라인의 DATA에 포함되어 있으면 좌우를 바꾼다
							cnt3 = 1;
						}
						}
				}

				//위치를 바꾸지 않는다
				if(cnt3 == 0){
					for(var j=0; j<coord.length; j++){
								lastData[cnt] = coord[j];
								cnt++;
						}
				//좌우 위치를 바꾼다
					}else{
						for(var j=0; j<swnData.length; j++){
							lastData[cnt] = swnData[j];
							cnt++;
					}
					}
				}

				//형식에 맞춰주기 위해 ex) [[aa],[bb],[cc]]
				for(var i=0; i<lastData.length; i++){
 				if(i == lastData.length-1){
 					ringLatLng += "["+lastData[i]+"]";
				}else{
					ringLatLng += "["+lastData[i]+"],";
				}
				}
//alert(ringLatLng);

				gisRingInf = {"ringMgmtNo": response.gisRingInf[0].ringMgmtNo, "ntwkLineNo": response.gisRingInf[0].ntwkLineNo, "ringLatLng": JSON.parse("["+ringLatLng+"]"), "type": response.gisRingInf[0].type};
	    		//링GEO정보가 없을 경우
	    		if (ringLatLng == null || ringLatLng == "") {
	    			//레이어초기화
 	   			clearLayerFunc(response.layerId);
	 				//GIS 링맵정보가 없습니다.
	 				callMsgBox('','W', configMsgArray['noGisRingMapInfo'] , function(msgId, msgRst){});
	 			//링GEO정보가 있을 경우
	 			}else{
	 	 			drawRingLayerThatCanBeSelected(gisRingInf, response.layerId); //링그리기
	 			}
			}
	}

    	/*...........................*
	        국사관리번호 받아서 지도에 표시
		 *...........................*/
    	if(flag =='searchGisMtsoInf'){
    		//레이어초기화
    		var mtsoInfLayer = window.mtsoInfLayer;
    		mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();

	        //GIS국사정보
    		var gisMtsoInf = null; gisMtsoInf = response.mtsoLineMapList;

    		for(var i=0; i<gisMtsoInf.length; i++){
	       //팝업할 국사정보 세팅
	 		    var html =
			            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
			            '<b>국사번호:</b><%pop_mtsoId%><br>' +
			            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
			            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
			            '<b>건물주소:</b><%pop_bldAddr%>';

		        html = html.replace('<%pop_mtsoNm%>',gisMtsoInf[i].mtsoNm);
		        html = html.replace('<%pop_mtsoId%>',gisMtsoInf[i].mtsoId);
		        html = html.replace('<%pop_mtsoTyp%>',gisMtsoInf[i].mtsoTypNm);
		        html = html.replace('<%pop_mtsoStat%>',gisMtsoInf[i].mtsoStatNm);
		        html = html.replace('<%pop_bldAddr%>',gisMtsoInf[i].bldAddr);

 			     var latlng = L.MG.Util.wktToGeometry(gisMtsoInf[i].geoWkt).getLatLng();//국사 위치정보
 			     if(response.moveMap){//지도이동여부 예 이면
 			    	//해당 좌표로 이동
 	 			    window.mgMap.setView([latlng.lat, latlng.lng], 13);
 	 			    //반경거리 표시해주고
 			        if (circleRange != 0){
 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 			        distance_circle_layer.clearLayers();
 					    var distance_circle = L.circle([latlng.lat, latlng.lng], parseInt(circleRange));
 					    distance_circle_layer.addLayer(distance_circle);
 			        }
 			        //지도이동있으니까
 		 			searchAroundMtso(response.mtsoId); //주변국사조회
 		 			searchAroundRing();                //주변링조회
 		 			showLeftContainer();               //왼쪽메뉴등장
 			   }
 			    //국사포인트 표시하고 정보팝업
		        var marker = L.marker([latlng.lat, latlng.lng]);
		        mtsoInfLayer.addLayer(marker);
		        marker.bindPopup(html).openPopup();
    		}
    	}

	}//HTTP 성공처리끝


	function searchGisRingInf(coordParam, eqpSctnIdParam){

		var gisRingInf = null;
		//GIS링정보가 없을 경우
		if (coordParam.length == 0) {
			//레이어초기화
			clearLayerFunc(response.layerId);
			//GIS 링관리번호가 없습니다.
    		callMsgBox('','W', configMsgArray['noGisRingMgmtNo'] , function(msgId, msgRst){});

    	//GIS링정보가 있을 경우
			}else{
				var ringLatLng = "";
				var lastData = [];	//전체 DATA
				var cnt = 0;

				//마지막 라인의 좌우여부를 판단하기 위해 첫번째라인 정보를 가져온다
				var coord0 = coordParam[0].split('/');
				//첫 라인의 좌우여부를 판단하기 위해 두번째라인 정보를 가져온다
				var coordF = coordParam[1].split('/');

				for(var i=0; i<coordParam.length; i++){
					var coord = coordParam[i].split('/');
					var coordA = []; //각 라인의 다음 라인 DATA

				var swnData = [];	//좌우가 바뀐 각 라인 DATA
				var cnt3 = 0;	//좌우를 바꿀지 여부 카운트 0:바꾸지 않는다  1:바꾼다

				//각 라인의 DATA 좌우를 바꿔 메모리에 넣는다.
				for(var c=1; c<coord.length+1; c++){
					swnData[c-1] = coord[coord.length-c];
				}

				//첫번째 라인 좌우 계산을 위해
				if(i == 0){
					for(var j=0; j<coordF.length; j++){
						if(coordF[j] == coord[0]){
							//처음 시작할때 처음 위치가 다음 DATA에 포함되어 있으면 좌우를 바꾼다
							cnt3 = 1;
						}
						}
				}

				//중간 라인 좌우 계산을 위해
				if(i > 0 && i < coordParam.length-1){
					//각 라인의 좌우여부를 판단하기 위해 각 라인의 다음 라인 정보를 가져온다
						coordA = coordParam[i+1].split('/');

						if(lastData[lastData.length-1] == coord[0]){
							//이전 마지막 위치와 현재 처음 위치가 같으므로 DATA의 좌우를 바꾸지 않음
							cnt3 = 0;
						}else if(lastData[lastData.length-1] == coord[coord.length-1]){
							//이전 마지막 위치와 현재의 끝 위치가 같으므로 DATA의 좌우를 바꾼다
							cnt3 = 1;
						}else{
							//이전 마지막 위치가 현재 DATA에 존재하지 않으면 좌우를 바꾸지 않는다
							cnt3 = 0;
						}

						for(var j=0; j<coordA.length; j++){
							for(var k=0; k<coordA.length; k++){
								if(coordA[j] == coord[0]){
									//현재 처음 위치가 다음 DATA에 포함되어 있으면 좌우를 바꾼다.
									cnt3 = 1;
								}
							}
						}
					}

				//마지막 라인 좌우 계산을 위해
				if(i == coordParam.length-1){
					//이전 마지막 위치와 현재의 끝 위치가 같으므로 DATA의 좌우를 바꾼다
					if(lastData[lastData.length-1] == coord[coord.length-1]){
						cnt3 = 1;
					}

					for(var j=0; j<coord0.length; j++){
						if(coord0[j] == coord[0]){
							//마지막 라인의 처음 위치가 첫번째 라인의 DATA에 포함되어 있으면 좌우를 바꾼다
							cnt3 = 1;
						}
						}
				}

				//위치를 바꾸지 않는다
				if(cnt3 == 0){
					for(var j=0; j<coord.length; j++){
								lastData[cnt] = coord[j];
								cnt++;
						}
				//좌우 위치를 바꾼다
					}else{
						for(var j=0; j<swnData.length; j++){
							lastData[cnt] = swnData[j];
							cnt++;
					}
					}
				}

				//형식에 맞춰주기 위해 ex) [[aa],[bb],[cc]]
				for(var i=0; i<lastData.length; i++){
 				if(i == lastData.length-1){
 					ringLatLng += "["+lastData[i]+"]";
				}else{
					ringLatLng += "["+lastData[i]+"],";
				}
				}

				gisRingInf = {"eqpSctnId": eqpSctnIdParam[0], "ntwkLineNo": "", "ringLatLng": JSON.parse("["+ringLatLng+"]"), "type": "LineString"};
	    		//링GEO정보가 없을 경우
	    		if (ringLatLng == null || ringLatLng == "") {
	    			//레이어초기화
 	   			clearLayerFunc("RING_MAP_LAYER");
	 				//GIS 링맵정보가 없습니다.
	 				callMsgBox('','W', configMsgArray['noGisRingMapInfo'] , function(msgId, msgRst){});
	 			//링GEO정보가 있을 경우
	 			}else{
	 	 			drawRingLayerThatCanBeSelected(gisRingInf, "RING_MAP_LAYER"); //링그리기
	 			}
			}
	}

	//시설물 정보 지도에 표시
	function searchGisFcltInf(data) {
		//레이어초기화
		var mtsoInfLayer = window.mtsoInfLayer;
		mtsoInfLayer.closePopup();
        mtsoInfLayer.clearLayers();

        //GIS국사정보
		var gisFcltInf = null; gisFcltInf = data;

		for(var i=0; i<gisFcltInf.length; i++){
       //팝업할 국사정보 세팅

 		    var html =
		            '<b>시설물명&nbsp;:</b><%pop_fcltNm%><br>'+
		            '<b>시설물SK관리번호:</b><%pop_fcltSkMgmtNo%><br>' +
		            '<b>시설물고유관리번호:</b><%pop_fcltUnqMgmtNo%><br>'+
		            '<b>코어:</b><%pop_coreNo%><br>'+
		            '<b>케이블구분:</b><%pop_cblDivNm%><br>'+
		            '<b>시설물구분:</b><%pop_fcltlDivNm%><br>'+
		            '<b>포설거리:</b><%pop_eteDistm%><br>'+
		            '<b>케이블SK관리번호:</b><%pop_cblSkMgmtNo%><br>'+
		            '<b>케이블고유관리번호:</b><%pop_cblUnqMgmtNo%>';

	        html = html.replace('<%pop_fcltNm%>',gisFcltInf[i].fcltNm);
	        html = html.replace('<%pop_fcltSkMgmtNo%>',gisFcltInf[i].fcltSkMgmtNo);
	        html = html.replace('<%pop_fcltUnqMgmtNo%>',gisFcltInf[i].fcltUnqMgmtNo);
	        html = html.replace('<%pop_coreNo%>',gisFcltInf[i].coreNo);
	        html = html.replace('<%pop_cblDivNm%>',gisFcltInf[i].cblDivNm);
	        html = html.replace('<%pop_fcltlDivNm%>',gisFcltInf[i].fcltlDivNm);
	        html = html.replace('<%pop_eteDistm%>',gisFcltInf[i].eteDistm);
	        html = html.replace('<%pop_cblSkMgmtNo%>',gisFcltInf[i].cblSkMgmtNo);
	        html = html.replace('<%pop_cblUnqMgmtNo%>',gisFcltInf[i].cblUnqMgmtNo);

	        var fcltWgs84Val = gisFcltInf[i].fcltWgs84Val.replace("[","").replace("]","").replace(","," ");
//	        var arr = fcltWgs84Val.split(',');
	        var geoWkt = "POINT ("+fcltWgs84Val+")";

			     var latlng = L.MG.Util.wktToGeometry(geoWkt).getLatLng();//국사 위치정보
			     if(data.moveMap){//지도이동여부 예 이면
			    	//해당 좌표로 이동
	 			    window.mgMap.setView([latlng.lat, latlng.lng], 13);
	 			    //반경거리 표시해주고
			        if (circleRange != 0){
			        	var distance_circle_layer = window.distanceCircleLayer;
	 			        distance_circle_layer.clearLayers();
					    var distance_circle = L.circle([latlng.lat, latlng.lng], parseInt(circleRange));
					    distance_circle_layer.addLayer(distance_circle);
			        }
			        //지도이동있으니까
		 			searchAroundMtso(response.mtsoId); //주변국사조회
		 			searchAroundRing();                //주변링조회
		 			showLeftContainer();               //왼쪽메뉴등장
			   }
			    //국사포인트 표시하고 정보팝업
	        var marker = L.marker([latlng.lat, latlng.lng]);
	        mtsoInfLayer.addLayer(marker);
	        marker.bindPopup(html).openPopup();
		}
	}

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
    	if(gisRingInf.eqpSctnId == null && gisRingInf.eqpSctnId ==  "" && gisRingInf.eqpSctnId == undefined){
    		var eqpSctnId = gisRingInf.ringMgmtNo;
    	}else{
    		var eqpSctnId = gisRingInf.eqpSctnId;
    	}
    	var ringLatLng = gisRingInf.ringLatLng;
    	var lineStyle = null;
    	if(layerId == "RING_MAP_LAYER"){//링조회에서 온거면 핑크링
    		lineStyle = 'STYLE_RING_STRONG_LIGHTGREEN_LINE';
    	}else{//주변링조회에서 온거면 검정링
    		lineStyle = 'STYLE_RING_STRONG_BLACK_LINE';
    	}

//		var result1 = { features :[{ type : 'Feature',
//					            mgmtNo : ringMgmtNo,
//					            geometry : {
//					            type : 'LineString',
////					            coordinates :  ringLatLng
//					            coordinates : [["127.133573768858","37.4113313236677"],["127.129741787351","37.4344635555818"]]
//					        },
//					        style : [{id: lineStyle}]
//					    }
//					]
//					};
		window.mgMap.clearSelectLayer();/*select된 레이어들 clear*/
        var ringInfPopupLayer = window.ringInfPopupLayer;
        ringInfPopupLayer.closePopup(); //링정보팝업 닫아주고
   		ringInfPopupLayer.clearLayers();//링정보팝업레이어 clear

		var ringLayer = window.mgMap.getCustomLayerByName(layerId);
		if(ringLayer) {//레이어 있으면 초기화
			ringLayer.clearLayers();
        }else{//레이어 없으면 새로 생성-선택가능한 레이어로
        	ringLayer = window.mgMap.addCustomLayerByName(layerId, {selectable: true});
        }

		if(flagParam == "GIS" || flagParam == "RING"){//GIS지도조회
			var ringLatLngParma = [];

			for(var i=0; i<ringLatLng.length; i++){
				ringLatLngParma[ringLatLngParma.length] = JSON.parse("["+ringLatLng[i]+"]");
			}
			var result = { features :[{ type : 'Feature',
					                    mgmtNo : eqpSctnId,
					                    geometry : {
					                    type : 'LineString',
					                    coordinates :  ringLatLngParma
					                },
					                style : [{id: lineStyle}]
					            }
					        ]
					    };
			ringLayer.addData(result);//생성한 feature 추가
		}else{
			for(var i=0; i<ringLatLng.length; i++){
				var result = { features :[{ type : 'Feature',
						                    mgmtNo : eqpSctnId,
						                    geometry : {
						                    type : 'LineString',
						                    coordinates :  JSON.parse("["+ringLatLng[i]+"]")
						                },
						                style : [{id: lineStyle}]
						            }
						        ]
						    };
				ringLayer.addData(result);//생성한 feature 추가
			}
		}



//		ringLayer.addData(result1);//생성한 feature 추가
		//주변링레이어 그룹에 포함
 		var rangeRingLayerGroup = window.rangeRingLayerGroup;
 		rangeRingLayerGroup.addLayer(ringLayer);

        //링조회에서 넘어온 링그리기는 feature의 전체 영역으로 지도이동
		if(layerId == "RING_MAP_LAYER"){
			window.mgMap.fitBounds(ringLayer.getBounds());
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
                  width : 800,
                  height : window.innerHeight * 0.7
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
	 * 메뉴 초기화
	 *==========================*/
    function menuDivInit(){
    	$('.menuDiv').hide();
    	$('.menuDivSpan').css("background-color", "white");
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
    			window.mgMap.setView([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x], 13);
    			//반경거리 표시해주고
		        if (circleRange != 0){
		        	var distance_circle_layer = window.distanceCircleLayer;
 			        distance_circle_layer.clearLayers();
				    var distance_circle = L.circle([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x], parseInt(circleRange));
				    distance_circle_layer.addLayer(distance_circle);
		        }
		       //주변국사조회
	           searchAroundMtso("");
	           //주변링조회
	           searchAroundRing();
    		})
    	})
    }

    /*===============================*
	 * 왼쪽 컨테이너 등장
	 *===============================*/
    function showLeftContainer() {
	    mContainer.style.marginLeft = targetX + "px";
	    document.all.leftImage.src = "../../resources/images/img_menu_close.png";
		sideTabToggle = true;
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
	            id : 'STYLE_RING_STRONG_LIGHTGREEN_LINE',
	            type : L.MG.StyleCfg.STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#F0690F', //선색상
	            	weight : 4         //선두께
	            }
	        },{
	            id : 'STYLE_RING_POPUP_LINE',
	            type : L.MG.StyleCfg.STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#050099', //선색상
	            	weight : 4         //선두께
	            }
	        }
	    ];

	    //시스템에 사용할 스타일 설정
	    L.MG.StyleCfg.setCustomStyles(styles);

  	}

//});