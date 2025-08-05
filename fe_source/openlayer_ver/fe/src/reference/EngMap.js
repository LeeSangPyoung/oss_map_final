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
var START_WIDTH2 = 550;
var sideTabToggle2 = false;

//리스트 하이라이트 row 인덱스
var mtsoColorIndex = null;//주변국사 용
var ringColorIndex = null;//주변링 용

//상위 조회조건 용
var circleRange = 0;//반경거리
var mtsoDetlTypCdList = [];
// var mtsoNmCdList = [];//국사상세구분코드
var mtsoTypCdList = []; //국사 유형 코드
var eqpNmCdList = [];//장비 코드
var topoSclCdList = [];//망구분코드
var ntwkTypCdList = [];//링유형코드

//    //구성레이어의 조건 값
var mgmtvalue = null; //관리그룹
var mtsotypalue = []; //국사 유형 코드
var mtsostatvalue = []; //국사 상태 코드
var mtsonmvalue = null; //국사명
var addrvalue = null; //주소

//원장 읽어 받아오는 결과
var TopoData = []; //망종류
var NtwkTypData = []; //망구분

//링조회, 국사조회시 페이당 줄수
var perPage = 100;
var moveFlag = true;
let layerNm = null;
let layerMaxZoom = null;

//전송실 검색 조건
let skt_tmof_option_data = [];
let skb_tmof_option_data = [];

let gridId5 = "covDsnListGrid";
let gridId6 = "covListGrid";
let gridId7 = "covMtsoGrid";
let gridId7Floor = "covMtsoFloorGrid";
let gridId9 = "wreDsnListGrid"; //유선설계 수요검토 목록
let gridId10 = "wreDsnRsltListGrid"; //유선설계결과목록
let gridId10Routean = "routeanInqListGrid"; //유선설계 경로목록
let gridId11 = "mtsoInvtSmltInfGrid"; //국사설계 시뮬레이션기본 목록
let gridId11Bas = "mtsoInvtSmltBasGrid"; //국사설계 시뮬레이션정보 목록

//국사투자 시뮬레이션기본 선택정보
let gridId11FocusInfo = [];
//국사투자 시뮬레이션정보 선택정보
let gridId11BasFocusInfo = [];

//layerId
let covDsnLayer = "MTSO_COV_DSN_LAYER"; //커버리지설계
let covDsnLayerLabel = "MTSO_COV_DSN_LABEL"; //커버리지설계 라벨
let hCovDsnLayer = "H_MTSO_COV_DSN_LAYER"; //커버리지 설계 하일라이이트
let covLayer = "MTSO_COV_LAYER"; //커버리지
let covLayerLabel = "MTSO_COV_LABEL"; //커버리지 라벨
let nodeNetWorkLayer = "NODE_NETWORK_LAYER"; //망구성 국사레이어
let nodeNetworkLabelLayer = "NODE_NETWORK_LABEL_LAYER"; //망구성 국사라벨레이어
let nodeNetWorkLineLayer = "NODE_NETWORK_LINE_LAYER"; //망구성 국사간 회선 레이어
let nodeLineLabelLayer = "NODE_LINE_LABEL_LAYER"; //망구성 국사간 회선 라벨 레이어
let eqpDsnMtsoLayer = "EQP_DSN_MTSO_LAYER"; //유선망 통합설계-수요검토 레이어
let eqpDsnMarkerLayer = "EQP_DSN_MARKER_LAYER"; //유선망 통합설계-수요검토 국사 마커 레이어
let optLnMapLayer = "OPT_LN_LAYER"; //B2B 광선로 설계 레이어
let routeanInqMapLayer = "ROUTEAN_INQ_LAYER"; //TES 경로 조회
let nodeNetWorkLineMarkerLayer = "NODE_NETWORK_LINE_MARKER_LAYER"; //망구성 국사간 회선 마커 레이어
let gisRingLnPathMapLayer = "GIS_RING_LN_PATH_LAYER"; //TES GIS RING 선로 경로 조회
let nodeNetWorkMarkerLayer = "NODE_NETWORK_MARKER_LAYER"; //망구성 국사 마커레이어
let eqpDsnRsltMtsoLayer = "EQP_DSN_RSLT_MTSO_LAYER"; //유선망 통합설계-설계결과 레이어
let eqpDsnRsltMarkerLayer = "EQP_DSN_RSLT_MARKER_LAYER"; //유선망 통합설계-설계결과 국사 마커 레이어
let mtsoInvtSlmtCoverLayer = "MTSO_INVT_SLMT_COVER_LAYER"; //유선망 통합설계-국사투자시뮬레이션 레이어
let mtsoInvtSlmtCoverLabelLayer = "MTSO_INVT_SLMT_COVER_LABEL_LAYER"; //유선망 통합설계-국사투자시뮬레이션 라벨레이어
let hMtsoInvtSlmtCoverLayer = "H_MTSO_INVT_SLMT_COVER_LAYER"; //유선망 통합설계-국사투자시뮬레이션 하일라이이트레이어

var selCovDsnList = []; //노드 편집 후 기존에 선택되어있는 설계 커버리지 임시저장소
var eqpRoleDivCdGridColList = []; //주변국사 및 장비에서 장비타입으로 그리드 초기 컬럼 세팅용

var gridId5FocusInfo = null;

//var mgMap = new Object();

// 회선 조회
var svlnSclCdData = [];  		// 서비스회선소분류코드 데이터
var svlnLclSclCodeData = [];  	// 서비스회선 대분류 소분류코드

var nodeDataArray = [];
var linkDataArray = [];
var dupMtsoId = [];

var locX = null;
var locY = null;
var cnt1 = 0;
var cnt2 = 0;
var cnt3 = 0;
var cnt4 = 0;
var cnt9 = 0;

let btnIds = [];

let mgmtSelected = "SKT";
let callPath = ""

// 구성정보 현재 페이지 정보
let cRingPageNum;
let cLinePageNum;
let cMtsoPageNum;

// 구성정보 레이어 리스트
let checkedRingLayer = [];
let checkedLineLayer = [];
let checkedMtsoLayer = [];

// 현재 메뉴 id
let menuId = null;

let _hasPanned = false;

var main = $a.page(function() {

	if (!window.mgMap) {
        console.log("새로운 MapDawulLayer 인스턴스를 생성합니다.");
        window.mgMap = new L.GeoMap();
    } else {
        console.warn("기존 MapDawulLayer 인스턴스를 재사용합니다.");
    }

	this.init= function(id, param) {

		var adtnAttrVal = $('#adtnAttrVal').val();
    	// 유선망 통합설계 권한 여부
    	//if(adtnAttrVal.indexOf('CM_WRE_EQP') == -1){									// 유선망 통합설계 권한
 //   		$('#engmap_menu_btn').hide();
 //   		$('#leftBtnNetworkLayer').hide();
 //   		$('#leftBtnNetworkTopo').hide();
    		//$('#leftBtnConfig').hide();
 //   		$('#leftBtnAround').hide();
 //   		$('#leftBtnCoverage').hide();
 //   		$('#leftBtnWreDsn').hide();
 //   		$('#wreLnFcltsCurstBtn').hide();
 //   		$('#leftBtnMtsoInvt').hide();
    	//}

		setTimeout(function() {

			initMap();

			setEventListener();

	        //그리드생성
			initGrid();

	        //select값 초기화
			setSelectCode();

		}, 1000);

        //팝업으로 호출 시 호출되야하는 기능에 대한 분기처리
        if(Object.keys(param).length != 0){
        	if(param.gridId == "B2bOptLnDsn") { //호출 경로 - B2B 광선로 설계

        		//맵 로딩 후 호출을 하기 위해서 time out 설정
    			setTimeout(function() {
    				ExtnlCalnControl.drawOptLnLayer(param);
    			}, 5000);
        	} else if(param.gridId == "TesRouteanInqPop") { //호출 경로 - TES 경로 조회

        		//맵 로딩 후 호출을 하기 위해서 time out 설정
    			setTimeout(function() {

    				let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
    				if(routeanInqLayer) {//레이어 있으면 초기화
    					window.mgMap.clearSelectLayer();
    					routeanInqLayer.clearLayers();
    			    }else{//레이어 없으면 새로 생성
    			    	routeanInqLayer = window.mgMap.addCustomLayerByName(routeanInqMapLayer, {selectable: false});
    			    }

    				ExtnlCalnControl.drawRouteanInqLayer(param);
    			}, 5000);
        	} else if(param.gridId == "EqpDsnRslt") { //호출 경로 - 유선망 통합설계(설계 결과)

        		//맵 로딩 후 호출을 하기 위해서 time out 설정
    			setTimeout(function() {
    				let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
    				if(routeanInqLayer) {//레이어 있으면 초기화
    					window.mgMap.clearSelectLayer();
    					routeanInqLayer.clearLayers();
    			    }else{//레이어 없으면 새로 생성
    			    	routeanInqLayer = window.mgMap.addCustomLayerByName(routeanInqMapLayer, {selectable: false});
    			    }

    				ExtnlCalnControl.drawRouteanInqLayer(param);
    			}, 5000);
        	} else { //호출 경로 - 유선망 통합설계(수요 검토)
    			callPath = "EQPDSN";

    			//맵 로딩 후 호출을 하기 위해서 time out 설정
    			setTimeout(function() {
    				LayerTreeControl.getPopUpEqpDsnLayer(param);
    			}, 5000);
        	}
        }

    }

	function initMap() {
        /** 맵 생성 **/
        var options = {  //맵생성옵션
    		app: 'tango',
			contextmenu: true,
		    location: {zoom: 13, center: [37.5087805938127, 127.062289345605]}
		};

        // 1. 'engMap' : 맵 생성을 위한 target div element의 id
        // 2. 'BASEMAP' : 설비 없이 베이스 지도만 생성
        // 3. 'BASEMAP' 대신 'TANGO-T'를 입력한 경우 설비 및 미리 정의된 옵션으로 맵 생성
        //MapGeo.create('engMap', 'TANGO-T', options).then(function (map) {
        window.mgMap.createMap({
            target: "engMap",
            mapOptions: {
                center: [127.0622, 37.5087],
                zoom: 13
            }
        }).then(function (map) {
        	//window.mgMap = map;// 생성된 map 객체를 window 객체에 추가하여 전역으로 사용 가능
        	window.mtsoInfLayer = window.mgMap.addCustomLayerByName('MTSO_INF_LAYER');//국사표시를 위한 레이어
        	window.mtsoLayerLabel = window.mgMap.addCustomLayerByName('MTSO_LAYER_LABEL');//구성레이어의 ERP공대 기준,건물기준 레이어 라벨
        	window.mtsoBulLayer = window.mgMap.addCustomLayerByName('MTSO_BUL_LAYER', {selectable: true});//구성레이어의 건물기준  레이어
        	window.distanceCircleLayer = window.mgMap.addCustomLayerByName('DISTANCE_CIRCLE_LAYER');//반경거리표시를 위한 레이어
        	window.ringInfPopupLayer = window.mgMap.addCustomLayerByName('RING_INF_POPUP_LAYER');//링정보표시를 위한 레이어
        	//window.rangeRingLayerGroup = L.layerGroup();//링표시 레이어들의 그룹
        	window.rangeRingLayerGroup = L.layerGroup();

        	const trailManager = new L.TrailManager(map);
//
//        	trailManager.setMode('trail-simple', {
//        		geomType:'LineString',
//        		repeatMode:true,
//        		style:{
//        			color: '#03f',
//        			weight:5,
//        			dashArray: '5,10,5,10'
//        		}
//        	});
            //시설물 선택 이벤트
        	map.on("mg-selected-features", onClickFeatures);

        	// 도면인쇄
//        	map.printControl.onAdd(map);
//        	$('.leaflet-control-print a').attr('title', '도면인쇄').on('click', function(e){
//        		e.preventDefault();
//
//        		$('leaflet-control-capture a').trigger('click');
//        	});
//        	map.printControl.setOptions({url:"/tango-transmission-web2/trafficintg/Print2.do"});
//			$('.leaflet-control-print a').attr('title', '도면인쇄').on('click', function(e){
//				e.preventDefault();
//				window.print();
//			});

        	//사용자 레이어 스타일 설정
            addUserLayerStyles();

            //map 이동 시 layer 표시 안 나게 해주기
            map.on('moveend',function(e,layer){
            	zoomLvl = mgMap.getZoom();
            	LayerTreeControl.getBulLayer();
            });

            setTimeout(function() {
            	LayerTreeControl.setVectorLayer();

            	LayerTreeControl.getBulLayer();
            	LayerTreeControl.getGisLayer();
            }, 100);



            var styles = [
                {
                    id : 'TEST_USER_STYLE_POLYGON_1',
                    type : L.StyleConfig().STYLE_TYPE.POLYGON,  //폴리곤 타입
                    options : {
                        opacity: 0.5,
                        fillColor: '#FFE400',
                        isStroke: true,
                        strokeColor: '#FF0000',
                        weight: '3',
                        dashArray: '5 5'
                    }
                },
                {
                    id : 'TEST_USER_STYLE_POLYGON_2',
                    type : L.StyleConfig().STYLE_TYPE.POLYGON,  //폴리곤 타입
                    options : {
                        opacity: 0.5,
                        fillColor: '#FF0000',
                        isStroke: true,
                        strokeColor: '#000000',
                        weight: '2'
                    }
                },
                {
                    id : 'TEST_USER_STYLE_LINE_1',
                    type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
                    options : {
                        opacity: 1.0,
                        color: '#000000',
                        weight: 2
                    }
                },
                {
                    id : 'TEST_USER_STYLE_POINT_1',
                    type : L.StyleConfig().STYLE_TYPE.POINT,      //포인트 타입
                    options : {
                        markerType: 'icon',
                        iconUrl: '/resource/images/tango_t/res/symbols/B_무선탭_WiFi.png',
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                    }
                }
            ];

            //시스템에 사용할 스타일 설정
            L.StyleConfig().setCustomStyles(styles);


            var layer = window.mgMap.addCustomLayerByName('TEST_USER_LAYER', {selectable:true, alias:'유저레이어샘플'});

            //사용자레이어에 추가할 Features 구성
            var result = {
                features :[
                    {
                        type : 'Feature',
                        geometry : {
                            type : 'Polygon',
                            coordinates : [
                            	[
                            		[126.96961337, 37.56749987],
                            		[126.97191923, 37.56751021],
                            		[126.97192620, 37.56652293],
                            		[126.96962037, 37.56651259],
                            		[126.96961337, 37.56749987]
                            	]
                            ] //폴리곤은 반드시 3중배열.
                        },
                        geomType : L.FeatureEdit.TYPE.RECT,//폴리곤의 사각형 지정
                        style : [{id:'TEST_USER_STYLE_POLYGON_1'}],
                        properties : {
                            id : "test1",   //선택 가능한 유저레이어 keyNames에 설정된 properties는 반드시 지정
                            name : "rect"
                        },
                        keyNames:["id"] //선택가능한 유저 레이어는 반드시 지정
                    },
                    /*
                    {
                        type : 'Feature',
                        geometry : {
                            type : 'LineString',
                            coordinates : [[126.9696204, 37.5674095],[126.9707703, 37.5665229],[126.9719193, 37.5674099]]
                        },
                        style : [{id:'TEST_USER_STYLE_LINE_1'}],
                        properties : {
                            id : "line 1",   //선택 가능한 유저레이어 keyNames에 설정된 properties는 반드시 지정
                            name : "line"
                        },
                        keyNames:["id"] //선택가능한 유저 레이어는 반드시 지정
                    },
                    {
                        type : 'Feature',
                        geometry : {
                            type : 'Point',
                            coordinates : [126.9707703,37.5665229]
                        },
                        style : [{id:'TEST_USER_STYLE_POINT_1'}],
                        properties : {
                            id : "point 1",   //선택 가능한 유저레이어 keyNames에 설정된 properties는 반드시 지정
                            name : "Point 1"
                        },
                        keyNames:["id"] //선택가능한 유저 레이어는 반드시 지정
                    },
                    {
                        type : 'Feature',
                        geometry : {
                            type : 'Polygon',
                            coordinates : [[[126.9707703, 37.5674095],[126.9719193, 37.5674099],[126.9719192, 37.5682964],[126.9707702, 37.5682059],[126.9707703, 37.5674095]]] //폴리곤은 반드시 3중배열.
                        },
                        geomType : L.FeatureEdit.TYPE.RECT,
                        style : [{id:'TEST_USER_STYLE_POLYGON_2'}],
                        properties : {
                            id : "inter rect1",   //선택 가능한 유저레이어 keyNames에 설정된 properties는 반드시 지정
                            name : "rect 1"
                        },
                        keyNames:["id"] //선택가능한 유저 레이어는 반드시 지정
                    },
                    {
                        type : 'Feature',
                        geometry : {
                            type : 'Polygon',
                            coordinates : [[[126.9702103, 37.5675948],[126.9710697, 37.5677774],[126.9707702, 37.5681606],[126.9702103, 37.5675948]]] //폴리곤은 반드시 3중배열.
                        },
                        style : [{id:'TEST_USER_STYLE_POLYGON_2'}],
                        properties : {
                            id : "inter polygon1",   //선택 가능한 유저레이어 keyNames에 설정된 properties는 반드시 지정
                            name : "polygon 1"
                        },
                        keyNames:["id"] //선택가능한 유저 레이어는 반드시 지정
                    },*/
                ]

            };

           const circles = [
          {center : [126.9707703,37.5665229], radius: 100, id:'test_cir_1',name: 'circleminxy'},
          //{center : [126.9732181,37.5682059], radius: 150, id:'test_cir_2',name: 'circleCent'},
          //{center : [126.9707702,37.5698786], radius: 200, id:'test_cir_3',name: 'circleOut'},
         ];

        circles.forEach(info => {
          const center5179 = ol.proj.transform(info.center,'EPSG:4326','EPSG:5179');
          const circleGeom = new ol.geom.Circle(center5179, info.radius);
          const polygonGeom = ol.geom.Polygon.fromCircle(circleGeom, 64);
          const coords5179 = polygonGeom.getCoordinates();
          const coords4326 = [
        	  coords5179[0].map(coord => ol.proj.transform(coord, 'EPSG:5179','EPSG:4326'))
          ];

          const circleFeature = {
             type: 'Feature',
             geometry: {
               type: 'Polygon',
               coordinates: coords4326
             },
             style:[{id: 'TEST_USER_STYLE_POLYGON_2'}],
             properties: {
                id: info.id,
               name: info.name,
               geomType: L.FeatureEdit.TYPE.CIRCLE
             },
             keyName: ['id']
          };
          result.features.push(circleFeature);
        });
        layer.addData(result);

       //const featureEdit = L.FeatureEdit.getInstance(L.GeoMap().map, {color:'#a0f', fillColor:'#88f'});
       //var f1 = window.mgMap.getLayerById('TEST_USER_LAYER').getSource().getFeatures()[0];
       //featureEdit.setEdit([f1], {}, false);









        });
	}
	function reorderLngLatRect(coords){
		const xs = coords.map(c => c[0]);
		const ys = coords.map(c => c[1]);

		const minX = Math.min(...xs);
		const maxX = Math.max(...xs);
		const minY = Math.min(...ys);
		const maxY = Math.max(...ys);

		return [
			[minX,maxY],
			[maxX,maxY],
			[maxX,minY],
			[minX,minY],
			[minX,maxY]
		];
	};

	// 2024-07-26 유선 엔지니어링 UI 적용
	function leftMenuOnOff(state, id) {
		let sp_position = 350;
        // 구성정보, 주변정보, 커버리지
		if (id == "leftBtnConfig" || id == "leftBtnAround"
			|| id == "leftBtnCoverage" || id == "leftBtnWreDsn") {
			sp_position = 700;

			$("#engmap_left_panel").width(sp_position);
		} else if (id == "leftBtnMtsoInvt") {
			sp_position = 750;

			$("#engmap_left_panel").width(sp_position);
		} else {
			sp_position = 350;
		}

		const sidebarOffest = sp_position / 2;

		if (state) {
			$("#engmap_menu_btn").removeClass("on");
			$("#pathTraceMenuBox").removeClass("on");

			$("#engmap_left-contents").show();

			$('#left-menu_btn').removeClass("left-footer__open").addClass("left-footer__close");


			var opts = $.extend(true, {}, $("#splitter").data("splitter").settings, {position : sp_position});
			$("#splitter").split().destroy();
			$("#splitter").split(opts);
		} else {
			$("#engmap_left-contents").hide();
			$('#left-menu_btn').removeClass("left-footer__close").addClass("left-footer__open");

			if(!this._hasPanned){
				//window.mgMap.panBy(-sidebarOffest, 0);
				this._hasPanned = true;
			}

			var opts = $.extend(true, {}, $("#splitter").data("splitter").settings, {position : 60});
			$("#splitter").split().destroy();
			$("#splitter").split(opts);
		}

	};

    function setEventListener() {

        $a.setup('.multiSelect', {menuWidth : '165', minWidth : 165});
        /*==========================*
    	 * 이벤트 걸기
    	 *==========================*/
     	/**searchFDFYN 클릭 시**/
     	$('.Radio').on('click', function(e){
    		var dataObj =  $('#rangeRingGrid').alopexGrid('dataGet',{_state: {focused:true}});
    		var param = new Object();
     		if(dataObj[0] != undefined){
     		param.layerId ="RANGE_RING_LAYER_"+ dataObj[0]._index.row;
     		param.shouldSelectRow = false;
     		param.ntwkLineNm = dataObj[0].ntwkLineNm;
     		param.ntwkLineNo = dataObj[0].ntwkLineNo;
     		param.ntwkTypNm = dataObj[0].ntwkTypNm;
     		param.ringMgmtNo = dataObj[0].ringMgmtNo;
     		param.topoSclNm = dataObj[0].topoSclNm;
     		param.fdfChk=  $("#searchFDFYN").getValue();
            $('#ringEqpListGrid').alopexGrid('showProgress');
    			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getRingDtlInf', param, 'GET', 'searchRingDtlInf');
     		}else{
     		//	callMsgBox('','W', "aaaa" , function(){});
     		}
    	});

    	/*...........................*
   		  2024-07-26 유선 엔지니어링 맵  신규 개선 메뉴 적용
    	 *...........................*/
		/** Split 설정 **/
    	$("#splitter").split({
    		orientation: 'vertical',
    		position: 60,
    		limit: 59,
    		onDrag : function(e){
				var frameWidth = parseInt($('#engmap_left_panel').width());

				if( frameWidth <= 59 && $('#left-menu_btn').hasClass("left-footer__close")){
					$('#engmap_left-contents').hide();
					$('#left-menu_btn').removeClass("left-footer__close").addClass("left-footer__open");
				} else if( frameWidth > 59 && $('#left-menu_btn').hasClass("left-footer__open")){
					$('#engmap_left-contents').show();
					$('#left-menu_btn').removeClass("left-footer__open").addClass("left-footer__close");
				}

				// 그리드 사이즈 업데이트
				switch (menuId) {
					case 'leftBtnConfig':	// 구성정보
						$('#ringListGrid').alopexGrid('viewUpdate');
						$('#lineListGrid').alopexGrid('viewUpdate');
						$('#mtsoListGrid').alopexGrid('viewUpdate');
						break;
					case 'leftBtnAround':	// 주변정보
						$('#orgListGrid').alopexGrid('viewUpdate');
	    				$('#eqpListGrid').alopexGrid('viewUpdate');
	    				$('#rangeRingGrid').alopexGrid('viewUpdate');
	    				$('#ringEqpListGrid').alopexGrid('viewUpdate');
						break;
					case 'leftBtnCoverage':	// 커버리지
						$('#'+gridId5).alopexGrid('viewUpdate');
	    				$('#'+gridId6).alopexGrid('viewUpdate');
	    				$('#'+gridId7).alopexGrid('viewUpdate');
	    				$('#'+gridId7Floor).alopexGrid('viewUpdate');
						break;
					case 'leftBtnWreDsn':	// 유선설계
						$('#'+gridId9).alopexGrid('viewUpdate');
	    				$('#'+gridId10).alopexGrid('viewUpdate');
	    				$('#'+gridId10Routean).alopexGrid('viewUpdate');
						break;
					case 'leftBtnMtsoInvt':	// 국사설계
						$('#'+gridId11).alopexGrid('viewUpdate');
	    				$('#'+gridId11Bas).alopexGrid('viewUpdate');
						break;
					default:
						break;
				}
    		}
    	});

		// left 상단 메뉴 버튼 클릭
		$("#engmap_menu_btn").on("click", function(e) {

			if ($('#engmap_menu_btn').hasClass('on')) {
				$("#engmap_menu_btn").removeClass("on");
				$("#pathTraceMenuBox").removeClass("on");
			} else {
				$("#engmap_menu_btn").addClass("on");
				$("#pathTraceMenuBox").addClass("on");
				leftMenuOnOff(false, this.id);
			}
		});

		// left 상단 메뉴 - 하위 메뉴 클릭
    	$("#pathTraceMenu li").on("click", function(e) {
    		// left 이미지 버튼 모두 비활성화
    		$("#engmap_left_menu ul li").removeClass("on");

    		// left 박스 모두 숨김
    		$('#engmap_left-contents').find('.menu_layer_item').hide();

    		// left 상단 메뉴 - 기간망 유선설계 팝업
    		if (this.id == "pathDsnRont") {
    			pathAnalTracePopup = $a.popup({
    				id: "newPathDsnRont",
    				url: '/tango-transmission-web2/trafficintg/engineeringmap/DsnRontPopup.do',
    				title: '기간망 유선설계',
    				iframe: false,
    				modal: false,
    				windowpopup: true,
    				width: 1500,
    				height: 805,
    				center: true
    			});
    			$("#engmap_menu_btn").trigger("click");
    			return;
    		// left 상단 메뉴 - M/W 유선 설계 팝업
    		} else if (this.id == "pathDsnMw") {
    			pathAnalTracePopup = $a.popup({
    				id: "newPathDsnMw",
    				url: '/tango-transmission-web2/trafficintg/engineeringmap/DsnMwPopup.do',
    				title: 'M/W 유선 설계',
    				iframe: false,
    				modal: false,
    				windowpopup: true,
    				width: 1500,
    				height: 805,
    				center: true
    			});
    			$("#engmap_menu_btn").trigger("click");
    			return;
    		} else if(this.id == "pathMwLno" ) {
    			pathAnalTracePopup = $a.popup({
    				id: "MwLnoMgmtPopup",
    				url: '/tango-transmission-web2/trafficintg/engineeringmap/MwLnoMgmtPopup.do',
    				title: 'M/W 선번 관리',
    				iframe: false,
    				modal: false,
    				windowpopup: true,
    				width: 1500,
    				height: 805,
    				center: true
    			});
    			$("#engmap_menu_btn").trigger("click");
    			return;
    		} else if(this.id == "pathMwPktTrf") {
    			pathAnalTracePopup = $a.popup({
    				id: "MwPktTrfMgmtPopup",
    				url: '/tango-transmission-web2/trafficintg/engineeringmap/MwPktTrfMgmtPopup.do',
    				title: 'M/W 선번 트래픽',
    				iframe: false,
    				modal: false,
    				windowpopup: true,
    				width: 1500,
    				height: 805,
    				center: true
    			});
    			$("#engmap_menu_btn").trigger("click");
    			return;
    		} else if(this.id == "pathBckbnCoreTraffic" ) {
    			pathAnalTracePopup = $a.popup({
    				id: "newPathBckbnCoreTraffic",
    				url: '/tango-transmission-web2/trafficintg/engineeringmap/BckbnCoreTrafficPopup.do',
    				title: '백본 CORE 대표 Traffic',
    				iframe: false,
    				modal: false,
    				windowpopup: true,
    				width: 1500,
    				height: 740,
    				center: true
    			});
    			$("#engmap_menu_btn").trigger("click");
    			return;
    		} else if(this.id == "pathBckbnUpfTraffic" ) {
    			pathAnalTracePopup = $a.popup({
    				id: "newPathBckbnUpfTraffic",
    				url: '/tango-transmission-web2/trafficintg/engineeringmap/BckbnUpfTrafficPopup.do',
    				title: '백본 UPF Traffic',
    				iframe: false,
    				modal: false,
    				windowpopup: true,
    				width: 1500,
    				height: 740,
    				center: true
    			});
    			$("#engmap_menu_btn").trigger("click");
    			return;
    		} else {
    			alert("작업예정");
    		}

    		// left 박스 사이즈 조절
    		leftMenuOnOff(true, this.id);
    	});

    	// left 이미지 버튼 클릭
    	$("#engmap_left_menu ul li").on("click", function(e) {

    		let prevId = btnIds.length > 0 ?btnIds.pop(): undefined;

    		btnIds.push(this.id);

    		// left 이미지 버튼 모두 비활성화
    		$("#engmap_left_menu ul li").removeClass("on");

    		// 클릭한 이미지 버튼 활성화
    		$(this).addClass("on");

    		// 그리드 autoResize를 위해 menuId를 저장
    		menuId = this.id;

    		// 네트워크 구성도 팝업
    		if (this.id == "leftBtnNetworkTopo") {
    			$a.popup({
    				url: '/tango-transmission-web2/trafficintg/engineeringmap/NetworkTopoPopup.do',
    				title: '네트워크 구성도',
    				iframe: false,
    				modal: false,
    				windowpopup: true,
    				width: 1600,
    				height: 870,
    				center: true,
    				movable: true
    			});
    			return;
    		}

    		// left 박스 모두 숨김
    		$('#engmap_left-contents').find('.menu_layer_item').hide();

    		// 맵 레이어
    		if (this.id == "leftBtnMapLayer") {
    			$("#mapLayerTreeMenu").show();
    			$("#liExmaple").hide();
    			$("#liEqpRoldDiveCd").hide();

    		// 네트워크 레이어
    		} else if (this.id == "leftBtnNetworkLayer") {
        		$("#networkLayerTreeMenu").show();
        		$("#liExmaple").show();
        		$("#liEqpRoldDiveCd").show();
            // 구성정보
    		} else if (this.id == "leftBtnConfig") {

    			$("#configBox").show();
    			$("#AroundBox").hide();
    			$("#CoverageBox").hide();
    			$("#WreDsnBox").hide();
    			$("#liExmaple").hide();
    			$("#liEqpRoldDiveCd").hide();

                setTimeout(function() {
        			$('#ringListGrid').alopexGrid("viewUpdate");
                }, 100);
           	// 주변정보
    		} else if (this.id == "leftBtnAround") {
    			$("#configBox").hide();
    			$("#AroundBox").show();
    			$("#CoverageBox").hide();
    			$("#wreDsnBox").hide();
    			$("#liExmaple").hide();
    			$("#liEqpRoldDiveCd").hide();

                setTimeout(function() {
	    			$('#orgListGrid').alopexGrid("viewUpdate");
	    			$('#eqpListGrid').alopexGrid("viewUpdate");
                }, 100);
           	// 커버리지
    		} else if (this.id == "leftBtnCoverage") {
    			$("#configBox").hide();
    			$("#AroundBox").hide();
    			$("#CoverageBox").show();
    			$("#wreDsnBox").hide();
    			$("#liExmaple").hide();
    			$("#liEqpRoldDiveCd").hide();

                setTimeout(function() {
                	$('#'+gridId5).alopexGrid("viewUpdate");
                }, 100);
    		} else if (this.id == "leftBtnWreDsn") {
    			$("#configBox").hide();
    			$("#AroundBox").hide();
    			$("#CoverageBox").hide();
    			$("#wreDsnBox").show();
    			$("#liExmaple").hide();
    			$("#liEqpRoldDiveCd").hide();

                setTimeout(function() {
                	$('#'+gridId9).alopexGrid("viewUpdate");
                }, 100);
    		} else if (this.id == "leftBtnMtsoInvt") {
    			$("#configBox").hide();
    			$("#AroundBox").hide();
    			$("#CoverageBox").hide();
    			$("#wreDsnBox").hide();
    			$("#mtsoInvtBox").show();
    			$("#liExmaple").hide();
    			$("#liEqpRoldDiveCd").hide();

    			setTimeout(function() {
                	$('#'+gridId11).alopexGrid("viewUpdate");
                	$('#'+gridId11Bas).alopexGrid("viewUpdate");
                }, 100);
    		}

    		if(prevId == this.id) {
    			leftMenuOnOff($('#left-menu_btn').hasClass("left-footer__open"), this.id);
    		} else {
    			leftMenuOnOff(true, this.id);
    		}
    	});

    	$("#left-menu_btn").on("click", function(e) {
    		let itemId = "leftBtnMapLayer";

    		const listItems = document.querySelectorAll('#engmap_left_menu ul li');
    		listItems.forEach((item, index) => {
    			if(item.classList.contains('on')) {
    				itemId = item.id;
    			}
    		});

    		if(!itemId && !this.id) {
    			itemId = "leftBtnMapLayer";
    		}

    		if ($('#left-menu_btn').hasClass("left-footer__open")) {
    			leftMenuOnOff(true, itemId);
    		} else {
    			leftMenuOnOff(false, itemId);
    		}
    	});

    	/*...........................*
		    메뉴 관련
		 *...........................*/

    	/**오른쪽 탭변경 이벤트**/
   	    $('#rightTab1').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
    			Util.clearLayerFunc(hCovDsnLayer);
				mgMap.setMode('select'); // 노드편집 모드 제거

				$('#'+gridId5).alopexGrid("viewUpdate");
				var selectData = AlopexGrid.trimData($('#'+gridId5).alopexGrid("dataGet" , {_state : {selected:true}}));

				if(selectData.length > 0){
					var layer = mgMap.getCustomLayerByName(covDsnLayer);
					if(!layer) {
						layer = mgMap.addCustomLayerByName(covDsnLayer, {selectable: false});
					}
					window.mgMap.fitBounds(layer.getBounds(), window.mgMap.getZoom());
	    		}
				break;
			case 1 :
				Util.clearLayerFunc(hCovDsnLayer);
   				mgMap.setMode('select'); // 노드편집 모드 제거

    			$('#'+gridId6).alopexGrid("viewUpdate");
        		var selectData = AlopexGrid.trimData($('#'+gridId6).alopexGrid("dataGet" , {_state : {selected:true}}));

				if(selectData.length > 0){
	    			var layer = mgMap.getCustomLayerByName(covLayer);
	    			if(!layer) {
	    				layer = mgMap.addCustomLayerByName(covLayer, {selectable: false});
	    			}
	    			window.mgMap.fitBounds(layer.getBounds(), window.mgMap.getZoom());
	    		}
				break;
			case 2 :

				if(gridId5FocusInfo == undefined
	      	   			|| gridId5FocusInfo.length == 0 ){
					$('#'+gridId7).alopexGrid("dataEmpty");
					$('#'+gridId7Floor).alopexGrid("dataEmpty");
					callMsgBox('','W', "선택된 커버리지가 없습니다." , function(msgId, msgRst){});

				} else {
					$('#'+gridId7).alopexGrid("dataEmpty");
					$('#'+gridId7Floor).alopexGrid("dataEmpty");
					$('#'+gridId7).alopexGrid("viewUpdate");
					$('#'+gridId7Floor).alopexGrid("viewUpdate");

					setTab7Data();
				}

				break;
			default :
				break;
			}
    	});

    	/**구성정보 이벤트**/
   	    $('#leftTab').on("tabchange", function(e, index) {
			switch (index) {
			case 0 ://링 조회
				$('#ringListGrid').alopexGrid("viewUpdate");
				break;
			case 1 :// 회선 조회
				$('#lineListGrid').alopexGrid("viewUpdate");
				break;
			case 2 ://국사조회
				$('#mtsoListGrid').alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});

   	   /**주변정보 이벤트**/
   	    $('#leftTab1').on("tabchange", function(e, index) {
			switch (index) {
			case 0 : //주변 국사 및 장비
				$('#orgListGrid').alopexGrid("viewUpdate");
				$('#eqpListGrid').alopexGrid("viewUpdate");
				break;
			case 1 : //주변 링
				$('#rangeRingGrid').alopexGrid("viewUpdate");
				$('#ringEqpListGrid').alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});

   	    $('#leftTab2').on("tabchange", function(e, index) {
   	    	switch (index) {
   	    	case 0 : //수요검토
   	    		$('#'+gridId9).alopexGrid("viewUpdate");
   	    		break;
   	    	case 1 : //설계결과
   	    		$('#'+gridId10).alopexGrid("viewUpdate");
   	    		$('#'+gridId10Routean).alopexGrid("viewUpdate");
   	    		break;
   	    	default :
   	    		break;
   	    	}
   	    });

    	/*...........................*
        	커버리지 관련 이벤트 (SKT ONLY)
    	 *...........................*/
        $('#tmofList5').multiselect({
			beforeopen: function(){
				$('#tmofList5').clear();

				$('#tmofList5').setData({ data:skt_tmof_option_data });
			}
		});

        $('#tmofList6').multiselect({
        	beforeopen: function(){
				$('#tmofList6').clear();

				$('#tmofList6').setData({ data:skt_tmof_option_data });

			}
		});

    	/*...........................*
		        링조회 관련 이벤트
		 *...........................*/
     	 /**페이지 번호 클릭시**/
	   	 $('#ringListGrid').on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	cRingPageNum = eObj.page;
        	setRingListGrid(eObj.page, eObj.pageinfo.perPage);
         });

	   	 /**페이지 selectbox 변경시**/
         $('#ringListGrid').on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	// 레이어 초기화
	   		if(checkedRingLayer.length > 0){
	    		checkedRingLayer = checkedLayerClear(checkedRingLayer);
	   		}
        	cRingPageNum = 1;
        	setRingListGrid(1, eObj.perPage);
         });

	   	 /**링조회 버튼으로 조회**/
	   	 $('#ringListSearBtn').on('click', function(e) {
	   		var eObj = AlopexGrid.parseEvent(e);
	   		// 레이어 초기화
	   		if(checkedRingLayer.length > 0){
	    		checkedRingLayer = checkedLayerClear(checkedRingLayer);
	   		}
        	// 레이어 아이디에 사용
	   		cRingPageNum = 1;
	   		setRingListGrid(1,perPage);
	     });

	   	 /**링조회 엔터키로 조회**/
         $('#searchRingForm').on('keydown', function(e){
    		if (e.which == 6  ){
    			// 레이어 초기화
    	   		if(checkedRingLayer.length > 0){
    	    		checkedRingLayer = checkedLayerClear(checkedRingLayer);
    	   		}
    	   		cRingPageNum = 1;
    			setRingListGrid(1,perPage);
      		}
    	 });

         $("form").submit(function (e) {
        	 e.preventDefault();//링조회엔터시 전체화면refresh방지
         });

         /**링row를 클릭했을때 링지도표시**/
    	 $('#ringListGrid').on('click', '.bodycell', function(e){
      	    //GIS 링관리번호 조회
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var ringMapLayer = "RING_MAP_LAYER_"+cRingPageNum+"_"+dataObj._index.row;

     		// 체크박스 체크
     		if(dataObj._state.selected) {
	    		var param = new Object();
	     		param.ntwkLineNo = dataObj.ntwkLineNo;
	         	param.layerId = ringMapLayer;

	         	// 레이어를 지우기 위한 리스트
	         	checkedRingLayer.push(ringMapLayer);

	 			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getGisRingInfList', param, 'GET', 'searchGisRingInf');
	        //체크박스 해제
     		}else {
     			// 리스트에서 체크해제된 레이어 빼고 새로운 리스트를 만듦
     			checkedRingLayer = checkedRingLayer.filter(function(layer) {
     				return layer !== ringMapLayer;
     			})
     			//해당 레이어지우기
     			Util.clearLayerFunc(ringMapLayer);
     		}
    	 });

    	 /**링 전체 클릭했을때 링지도표시**/
    	 $('#ringListGrid').on('click','.headercell input', function(e) {
    		var dataObj = AlopexGrid.trimData($('#ringListGrid').alopexGrid("dataGet" , {_state : {selected:true}}));
    		// 체크박스 전체 해제
	    	if (dataObj.length == 0 && checkedRingLayer.length != 0) {
	         	//전체 레이어지우기
	    		checkedRingLayer = checkedLayerClear(checkedRingLayer);
		    } else if (dataObj.length > 0){
		    	for(var i=0; i<dataObj.length; i++) {
		    		var param = new Object();
		    		var ringMapLayer = "RING_MAP_LAYER_"+cRingPageNum+"_"+i;
		    		param.ntwkLineNo = dataObj[i].ntwkLineNo;
		         	param.layerId = ringMapLayer;

		         	// 레이어를 지우기 위한 리스트
		         	checkedRingLayer.push(ringMapLayer);

		         	httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getGisRingInfList', param, 'GET', 'searchGisRingInf');
		    	}
		    }
    	 });

    	 /** 회선조회 **/
    	 $('#lineListSearBtn').on('click', function(e) {
    		// 레이어 초기화
 	   		if(checkedLineLayer.length > 0){
 	   			checkedLineLayer = checkedLayerClear(checkedLineLayer);
 	   			checkedMtsoLayer = checkedMtsoClear(checkedMtsoLayer);
 	   		}
 	   		cLinePageNum = 1;
	   		setLineListGrid(1,perPage);
	     });

         /**회선조회 엔터키로 조회**/
         $('#searchLineForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			// 레이어 초기화
     	   		if(checkedLineLayer.length > 0){
     	   			checkedLineLayer = checkedLayerClear(checkedLineLayer);
     	   			checkedMtsoLayer = checkedMtsoClear(checkedMtsoLayer);
     	   		}
     	   		cLinePageNum = 1;
     			setLineListGrid(1,perPage);
       		}
     	 });

         /**회선 조회 row를 클릭했을때  회선 지도표시**/
    	 $('#lineListGrid').on('click', '.bodycell', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var lineMapLayer = "LINE_MAP_LAYER_"+cLinePageNum+"_"+dataObj._index.row;
    		var mtsoMapLayer = "MTSO_INF_LAYER_" + lineMapLayer

    		// 체크박스 체크
     		if(dataObj._state.selected) {
     			var param = new Object();
     			param.layerId = lineMapLayer;
     			param.searchId = dataObj.svlnNo;
     			param.searchGubun = "serviceLineDataForMtsoLink";

     			// 레이어를 지우기 위한 리스트
	         	checkedLineLayer.push(lineMapLayer);
	         	checkedMtsoLayer.push(mtsoMapLayer);

     			httpRequest('tango-transmission-tes-biz2/transmisson/tes/configmgmt/intge2etopo/intgE2ETopo', param, 'GET', "mtsoData");
     		//체크박스 해제
     		}else {
     			// 리스트에서 체크해제된 레이어 빼고 새로운 리스트를 만듦
     			checkedLineLayer = checkedLineLayer.filter(function(layer) {
     				return layer !== lineMapLayer;
     			})
     			checkedMtsoLayer = checkedMtsoLayer.filter(function(layer) {
     				return layer !== mtsoMapLayer;
     			})
     			//해당 레이어지우기
     			Util.clearLayerFunc(lineMapLayer);
     			let mtsoInfLayer = window.mgMap.addCustomLayerByName(mtsoMapLayer);
				mtsoInfLayer.closePopup();
		        mtsoInfLayer.clearLayers();
     		}
    	 });

    	 /**회선 전체 클릭했을때 회선 지도표시**/
    	 $('#lineListGrid').on('click','.headercell input', function(e) {
    		var dataObj = AlopexGrid.trimData($('#lineListGrid').alopexGrid("dataGet" , {_state : {selected:true}}));
    		// 체크박스 전체 해제
	    	if (dataObj.length == 0 && checkedLineLayer.length != 0) {
	         	//전체 레이어지우기
	    		checkedLineLayer = checkedLayerClear(checkedLineLayer);
	    		checkedMtsoLayer = checkedMtsoClear(checkedMtsoLayer);
		    } else if (dataObj.length > 0){
		    	for(var i=0; i<dataObj.length; i++) {
		    		var param = new Object();
		    		var lineMapLayer = "LINE_MAP_LAYER_"+cLinePageNum+"_"+i;
		    		var mtsoMapLayer = "MTSO_INF_LAYER_" + lineMapLayer

		    		param.layerId = lineMapLayer;
	     			param.searchId = dataObj[i].svlnNo;
	     			param.searchGubun = "serviceLineDataForMtsoLink";

	     			// 레이어를 지우기 위한 리스트
		         	checkedLineLayer.push(lineMapLayer);
		         	checkedMtsoLayer.push(mtsoMapLayer);

		         	httpRequest('tango-transmission-tes-biz2/transmisson/tes/configmgmt/intge2etopo/intgE2ETopo', param, 'GET', "mtsoData");
		    	}
		    }
    	 });

    	 /** 페이지 번호 클릭시**/
     	 $('#lineListGrid').on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	cLinePageNum = eObj.page;
          	setLineListGrid(eObj.page, eObj.pageinfo.perPage);
         });

     	 /**페이지 selectbox를 변경했을 시**/
         $('#lineListGrid').on('perPageChange', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	perPage = eObj.perPage;
          	// 레이어 초기화
 	   		if(checkedLineLayer.length > 0){
 	   			checkedLineLayer = checkedLayerClear(checkedLineLayer);
 	   			checkedMtsoLayer = checkedMtsoClear(checkedMtsoLayer);
 	   		}
          	cLinePageNum = 1;
          	setLineListGrid(1, eObj.perPage);
         });

	   	/*...........................*
	             국사조회 관련 이벤트
	   	 *...........................*/
     	/** 페이지 번호 클릭시**/
     	 $('#mtsoListGrid').on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	setMtsoListGrid(eObj.page, eObj.pageinfo.perPage);
          });

     	/**페이지 selectbox를 변경했을 시**/
          $('#mtsoListGrid').on('perPageChange', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	perPage = eObj.perPage;
          	setMtsoListGrid(1, eObj.perPage);
          });

    	/**국사조회 버튼으로 조회**/
    	 $('#mtsoListSearBtn').on('click', function(e) {
    		 setMtsoListGrid(1,perPage);
         });

     	/**주변 국사 버튼으로 조회**/
    	 $('#tab-1MtsoSearchBtn').on('click', function(e) {
			searchAroundMtso("");
         });

      	/**주변 링  버튼으로 조회**/
    	 $('#tab-2RingSearchBtn').on('click', function(e) {
    		 searchAroundRing("");//주변 링 조회
        });

        /**유선커버리지 설계 조회**/
        $('#searchBtn5').on('click', function(e) {
        	setCoverageDsnGrid();
        });

        /**유선커버리지 조회**/
        $('#searchBtn6').on('click', function(e) {
        	setCoverageGrid();
         });

        /**유선망 통합설계 -수요검토 조회**/
        $('#searchBtn9').on('click', function(e) {
        	setWreDsnListGrid(1, perPage);
        });
        /**국사투자 시뮬레이션-국사투자시뮬레이션정보 조회**/
        $('#searchBtn11').on('click', function(e) {
        	$('#'+gridId11Bas).alopexGrid("dataEmpty");

        	setMtsoInvtSmltInfGrid(1, perPage);
        });

        // 페이지 번호 클릭시
   	 	$('#'+gridId9).on('pageSet', function(e){
        	let eObj = AlopexGrid.parseEvent(e);
        	setWreDsnListGrid(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId9).on('perPageChange', function(e){
        	let eObj = AlopexGrid.parseEvent(e);
    		setWreDsnListGrid(1, eObj.perPage);
        });

   	 	$('#'+gridId9).on('click','.headercell input', function(e) {
   	 		LayerTreeControl.getEqpDsnLayer();
   	 	});

   	 	$('#'+gridId9).on('click','.bodycell', function(e) {
   	 		LayerTreeControl.getEqpDsnLayer();
   	 	});

        /**유선망 통합설계 - 설계결과 조회**/
        $('#searchBtn10').on('click', function(e) {
        	let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
	   		if(routeanInqLayer) {//레이어 있으면 초기화
	   			window.mgMap.clearSelectLayer();
	   			routeanInqLayer.clearLayers();
	   		}

	   		$('#'+gridId10Routean).alopexGrid('dataEmpty');
        	setWreDsnRsltListGrid(1, perPage);
        });

        //페이지 번호 클릭시
   	 	$('#'+gridId10).on('pageSet', function(e){
        	let eObj = AlopexGrid.parseEvent(e);

        	setWreDsnRsltListGrid(eObj.page, eObj.pageinfo.perPage);
        });

   	 	$('#'+gridId10).on('perPageChange', function(e){
   	 		let eObj = AlopexGrid.parseEvent(e);

   	 		setWreDsnRsltListGrid(1, eObj.perPage);
   	 	});

   	 	$('#'+gridId10).on('click','.bodycell', function(e) {
   	 		let dataObj = AlopexGrid.parseEvent(e).data;

   	 		$('#endObjMgmtNo').val(dataObj.endObjMgmtNo);
   	 		setWreDsnRsltRouteanListGrid(1, perPage);
   	 	});

   	 	/**유선망 통합설계 - 설계결과 상세조회**/
        $('#searchBtn12').on('click', function(e) {
        	if($('#endObjMgmtNo').val() == "") {
        		callMsgBox('','I', '검색할 데이터가 없습니다.', function(msgId, msgRst){});
  	     		return;
        	}

        	setWreDsnRsltRouteanListGrid(1, perPage);
        });

	   	$('#'+gridId10Routean).on('click','.headercell input', function(e) {
	   		 let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
	   		 if(routeanInqLayer) {//레이어 있으면 초기화
	   			 window.mgMap.clearSelectLayer();
	   			 routeanInqLayer.clearLayers();
	   		 }else{//레이어 없으면 새로 생성
	   			 routeanInqLayer = window.mgMap.addCustomLayerByName(routeanInqMapLayer, {selectable: false});
	   		 }

	   		 let selData = $('#'+gridId10Routean).alopexGrid('dataGet', {_state: {selected:true}});

	   		 ExtnlCalnControl.drawRouteanInqLayer(selData, gridId10Routean);
	 	});

   	 	$('#'+gridId10Routean).on('click','.bodycell', function(e) {
   	 		let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
   	 		if(routeanInqLayer) {//레이어 있으면 초기화
   	 			window.mgMap.clearSelectLayer();
   	 			routeanInqLayer.clearLayers();
   	 		}else{//레이어 없으면 새로 생성
   	 			routeanInqLayer = window.mgMap.addCustomLayerByName(routeanInqMapLayer, {selectable: false});
   	 		}

   	 		let selData = $('#'+gridId10Routean).alopexGrid('dataGet', {_state: {selected:true}});

   	 		ExtnlCalnControl.drawRouteanInqLayer(selData, gridId10Routean);
   	 	});

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId10Routean).on('pageSet', function(e){
	     	let eObj = AlopexGrid.parseEvent(e);

	     	setWreDsnRsltRouteanListGrid(eObj.page, eObj.pageinfo.perPage);
	     });

        $('#'+gridId10Routean).on('perPageChange', function(e){
        	let eObj = AlopexGrid.parseEvent(e);

    		setWreDsnRsltRouteanListGrid(1, eObj.perPage);
        });

        //국사투자시뮬레이션기본 그리드 이벤트
        $('#'+gridId11).on('pageSet', function(e){
        	let eObj = AlopexGrid.parseEvent(e);

        	setMtsoInvtSmltInfGrid(eObj.page, eObj.pageinfo.perPage);
        });

        $('#'+gridId11).on('perPageChange', function(e){
        	let eObj = AlopexGrid.parseEvent(e);

        	setMtsoInvtSmltInfGrid(1, eObj.perPage);
        });

        $('#'+gridId11).on('click','.bodycell', function(e) {
        	gridId11FocusInfo = $('#'+gridId11).alopexGrid('focusInfo').cellFocus.data;

        	setMtsoInvtSmltBasGrid(1, perPage);
   	 	});

        //국사투자시뮬레이션정보 그리드 이벤트
        $('#'+gridId11Bas).on('pageSet', function(e){
        	let eObj = AlopexGrid.parseEvent(e);

        	setMtsoInvtSmltBasGrid(eObj.page, eObj.pageinfo.perPage);
        });

        $('#'+gridId11Bas).on('perPageChange', function(e){
        	let eObj = AlopexGrid.parseEvent(e);

        	setMtsoInvtSmltBasGrid(1, eObj.perPage);
        });

        $('#'+gridId11Bas).on('click','.headercell input', function(e) {
        	var dataObj = AlopexGrid.trimData($('#'+gridId11Bas).alopexGrid("dataGet" , {_state : {selected:true}}));
    		// 체크박스 전체 해제
	    	if (dataObj.length == 0) {
	    		Util.clearLayerFunc(mtsoInvtSlmtCoverLayer);
	    		Util.clearLayerFunc(mtsoInvtSlmtCoverLabelLayer);
	    	} else {
	    		var selectData = $('#'+gridId11Bas).alopexGrid("dataGet", {"intgDivVal":"INTG"});

	        	_.each(selectData, function(data, idx){
	        		let rowIdx = data._index.row;
	        		$('#'+gridId11Bas).alopexGrid('rowSelect', {_index: {row:rowIdx}}, true);
	        	});

	        	MtsoInvtSlmtControl.drawMtsoInvtCoverage(mtsoInvtSlmtCoverLayer, gridId11Bas);
	        	MtsoInvtSlmtControl.drawMtsoInvtCoverageLabel(mtsoInvtSlmtCoverLabelLayer, gridId11Bas);
	    	}
        });

        $('#'+gridId11Bas).on('click','.bodycell', function(e) {
        	gridId11BasFocusInfo = $('#'+gridId11Bas).alopexGrid('focusInfo').cellFocus.data;

        	$('#'+gridId11Bas).alopexGrid("updateOption", { rowOption : {
																styleclass : function(data, rowOption) {
																				if(data['intgMtsoId'] == gridId11BasFocusInfo.intgMtsoId){
																					return 'row-highlight-orange';
																				}
																			}
        														}
        												  });

        	MtsoInvtSlmtControl.drawMtsoInvtCoverage(mtsoInvtSlmtCoverLayer, gridId11Bas);
        	MtsoInvtSlmtControl.drawMtsoInvtCoverageLabel(mtsoInvtSlmtCoverLabelLayer, gridId11Bas);
        });

        /**링조회 엔터키로 조회**/
        $('#searchRingForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			// 레이어 초기화
    	   		if(checkedRingLayer.length > 0){
    	    		checkedRingLayer = checkedLayerClear(checkedRingLayer);
    	   		}
    	   		cRingPageNum = 1;
    			setRingListGrid(1,perPage);
      		}
    	 });

        /**유선커버리지 설계 엔터키로 조회**/
        $('#searchCovDsnForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			setCoverageDsnGrid();
      		}
    	 });

        /**유선커버리지 조회 엔터키로 조회**/
        $('#searchCovForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			setCoverageGrid();
      		}
    	 });

    	/**국사조회 엔터키로 조회**/
         $('#searchMtsoForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setMtsoListGrid(1,perPage);
       		}
     	 });

    	/**국사row를 클릭했을때  국사지도표시**/
    	 $('#mtsoListGrid').on('click', '.bodycell', function(e){
    		//GIS 국사관리번호 조회
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		dataObj.moveMap = true; //지동이동할거다
 			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
    	 });

        /** 국사우클릭 관련 이벤트**/
    	 $(document).contextmenu(function(e) {
     		//var feature = window.mgMap.getSelectedFeatures();
     		//중첩국지국정보처리 들어가야지
     		//e.preventDefault();
     	});
     	/*...........................*
            주변국사조회 관련 이벤트
     	 *...........................*/
    	 /**주변국사row를 클릭했을때 지도에 표시하고 국사-장비리스트 조회**/
    	 $('#orgListGrid').on('click', '.bodycell', function(e){
    	    var dataObj = AlopexGrid.parseEvent(e).data;
    	    //GIS 국사관리번호 조회 지도에 표시
     		dataObj.moveMap = false;//지도이동 안하겠다.
  			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
  			//장비리스트 조회
    		var eqpRoleDivCdList = ($("#eqpRoleDivCdList1").val() == null) ? getMultiSelect("eqpRoleDivCdList1", "value", "") : getMultiSelect("eqpRoleDivCdList1", "value", ":selected");
	    	var param = new URLSearchParams();
	   		param.append("mtsoId", dataObj.mtsoId);
	   		_.each(eqpRoleDivCdList, function(data){
	   			param.append("eqpRoleDivCdList", data);
	   		});

			$('#eqpListGrid').alopexGrid('showProgress');
 			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getEqpList', param.toString(), 'GET', 'searchEqpList');
    	 });

    	 /*...........................*
           주변링조회 관련 이벤트
    	  *...........................*/
    	 /**주변링row를 더블클릭했을 때 링정보팝업과 링-장비리스트조회**/
    	 $('#rangeRingGrid').on('dblclick', '.bodycell', function(e){
     	    //더블클릭한 row 색 진하게 표시
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		ringColorIndex = dataObj._index.row;//진하게 표시한 인덱스 저장
            $('#rangeRingGrid').alopexGrid({
                   rowOption : {
                      styleclass : function(data, rowOption){
                                       if(data._index.row == dataObj._index.row ){
                                             return 'row-highlight-gray';
                                       }
                                   }
                               }
            });
            //링상세정보와 링-장비리스트 가지러 가기
            dataObj.layerId = "RANGE_RING_LAYER_"+dataObj._index.row;
            dataObj.shouldSelectRow = false;
            dataObj.fdfChk =  $("#searchFDFYN").getValue();
            $('#ringEqpListGrid').alopexGrid('showProgress');
 			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getRingDtlInf', dataObj, 'GET', 'searchRingDtlInf');
    	 });
    	/**selectbox를 변경했을 시**/
           $('#rangeRingGrid').on('click', '.bodycell', function(e){
        	var dataObj = AlopexGrid.parseEvent(e).data;
        	var rangeRingLayerId = "RANGE_RING_LAYER_"+dataObj._index.row;

         	//체크박스 체크
         	if(dataObj._state.selected){
         		var param = new Object();
         		param.ntwkLineNo = dataObj.ntwkLineNo;
         		param.ringMgmtNo = dataObj.ringMgmtNo;
         		param.layerId    = rangeRingLayerId;
         		httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getGisRingInfList', param, 'GET', 'searchGisRingInf');
         	//체크박스 해제
         	}else{
         		//해당 레이어지우기
         		Util.clearLayerFunc(rangeRingLayerId);
         	}
         });

       /**링-장비row를 클릭했을때  관리국사지도표시**/
      	 $('#ringEqpListGrid').on('click', '.bodycell', function(e){
      		//GIS 국사관리번호 조회
      		var dataObj = AlopexGrid.parseEvent(e).data;
      		dataObj.moveMap = false; //지동이동 안 할거다
   			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
      	 });


    	/*************************************
    	 * 커버리지 설계 그리드 이벤트 처리
    	 *************************************/
    	//커버리지 설계 그리드 전체 선택
    	$('#'+gridId5).on('click','.headercell input', function(e) {
    		mgMap.setMode('select'); // 노드편집 모드 제거
    		$('#btnNodeModCancel').hide();
    		$('#btnNodeMod').show();

    		Util.clearLayerFunc(covDsnLayer);
    		Util.clearLayerFunc(covDsnLayerLabel);
    		Util.clearLayerFunc(hCovDsnLayer);
    		var selectData = AlopexGrid.trimData($('#'+gridId5).alopexGrid("dataGet" , {_state : {selected:true}}));

    		if(selectData.length > 0){
    			drawPolygonLayer(selectData, covDsnLayer, gridId5);
    			drawPolygonLabel(selectData, covDsnLayerLabel, gridId5);
    		}
    	});

    	//커버리지 설계 그리드 Row 선택
    	$('#'+gridId5).on('click', '.bodycell', function(e){

    		mgMap.setMode('select'); // 노드편집 모드 제거
    		$('#btnNodeModCancel').hide();
    		$('#btnNodeMod').show();

    		Util.clearLayerFunc(covDsnLayer);
    		Util.clearLayerFunc(covDsnLayerLabel);
    		Util.clearLayerFunc(hCovDsnLayer);

    		let selectData = AlopexGrid.trimData($('#'+gridId5).alopexGrid("dataGet" , {_state : {selected:true}}));
    		gridId5FocusInfo = $('#'+gridId5).alopexGrid('focusInfo').cellFocus.data;

    		$('#'+gridId5).alopexGrid("updateOption", { rowOption : {
    																	styleclass : function(data, rowOption){
    																						if(data['coverageId'] == gridId5FocusInfo.coverageId){
    																						return 'row-highlight-orange'; } } } });

    		$('#'+gridId5).alopexGrid('viewUpdate');
    		if(selectData.length > 0){
    			drawPolygonLayer(selectData, covDsnLayer, gridId5);
    			drawPolygonLabel(selectData, covDsnLayerLabel, gridId5);
    		}

        });

    	//유선 커버리지 설계 등록
	    $('#btnCovReg').on('click', function(e) {

			$a.popup({
				popid : 'CovDsnReg',
				title : '유선 커버리지 정보',
				url : '/tango-transmission-web2/trafficintg/engineeringmap/CovDsnReg.do',
				data : '',
				modal : false,
				windowpopup: true,
				movable : true,
				width : 550,
				height : 310,
				callback : function() { // 팝업창을 닫을 때 실행
					setCoverageDsnGrid();
				}
			});
	    });

	    //유선 커버리지 설계 수정
	    $('#btnCovMod').on('click', function(e) {

	    	if(gridId5FocusInfo == undefined
      	   			|| gridId5FocusInfo.length == 0 ){
    			callMsgBox('','W', "선택된 커버리지가 없습니다." , function(msgId, msgRst){});
    			return;
    		}

	    	var param = {
	    			coverageId : gridId5FocusInfo.coverageId,
	    			coverageTerrNm : gridId5FocusInfo.coverageTerrNm,
	    			mtsoId : gridId5FocusInfo.mtsoId,
	    			mtsoNm : gridId5FocusInfo.mtsoNm,
	    			ldongCd : gridId5FocusInfo.ldongCd,
	    			regYn : "Y",
	    	};

	    	$a.popup({
	    		popid : 'CovDsnMod',
	    		title : '유선 커버리지 정보',
	    		url : '/tango-transmission-web2/trafficintg/engineeringmap/CovDsnReg.do',
	    		data : param,
	    		modal : false,
				windowpopup: true,
				movable : true,
	    		width : 550,
	    		height : 340,
	    		callback : function() { // 팝업창을 닫을 때 실행
	    			setCoverageDsnGrid();
	    		}
	    	});
	    });

    	$('#btnNodeMod').on('click', function(e){
    		mgMap.setMode('select'); // 노드편집 모드 제거

    		var selectData = AlopexGrid.trimData($('#'+gridId5).alopexGrid("dataGet" , {_state : {selected:true}}));

    		if(selectData.length > 0){

    			var chkSelData = false;
    			_.each(selectData, function(row, idx){
           			if(gridId5FocusInfo.coverageId == row.coverageId){
           				chkSelData = true;
           			}
           		});

    			if (!chkSelData){
        			callMsgBox('','W', "선택한 영역이 없습니다." , function(msgId, msgRst){});
        			return;
        		}

    			if (gridId5FocusInfo.geoNodeCnt >= 500) {
    				callMsgBox('','W', "선택한 영역의 노드갯수가 500개 이상일 경우 노드편집 할 수 없습니다." , function(msgId, msgRst){});
    				return;
    			}

    			drawHighlightPolygonLayer(selectData, gridId5FocusInfo, hCovDsnLayer);
    		} else {
    			callMsgBox('','W', "선택한 영역이 없습니다." , function(msgId, msgRst){});
    			return;
    		}
    		$('#btnNodeModCancel').show();
    		$('#btnNodeMod').hide();
    	});

    	$('#btnNodeModCancel').on('click', function(e){

    		mgMap.setMode('select'); //노드편집 모드 제거
    		var selectData = AlopexGrid.trimData($('#'+gridId5).alopexGrid("dataGet" , {_state : {selected:true}}));
    		if(selectData.length > 0){
    			Util.clearLayerFunc(covDsnLayer);
    			Util.clearLayerFunc(covDsnLayerLabel);
    			Util.clearLayerFunc(hCovDsnLayer);

    			drawPolygonLayer(selectData, covDsnLayer, gridId5);
    			drawPolygonLabel(selectData, covDsnLayerLabel, gridId5);
    		}else{
    			Util.clearLayerFunc(covDsnLayer);
    			Util.clearLayerFunc(covDsnLayerLabel);
    			Util.clearLayerFunc(hCovDsnLayer);
    		}

    		$('#btnNodeModCancel').hide();
    		$('#btnNodeMod').show();
    	});

    	$('#btnNodeSave').on('click', function(e){

    		var geoString = getPolygonGeometryString();

    		if(geoString == ""
    			|| geoString == null){
    			callMsgBox('','W', "변경한 영역이 존재하지 않습니다." , function(msgId, msgRst){});
    			return;
    		}

    		var selectData = AlopexGrid.trimData($('#'+gridId5).alopexGrid("dataGet" , {_state : {selected:true}}));
    		if(selectData.length > 0){
    			_.each(selectData, function(rowData, idx) {
    				selCovDsnList.push(rowData.coverageId);
    			});
    		}

    		var param = {
    				coverageId : gridId5FocusInfo.coverageId,
    				geoString : geoString,
    				frstRegUserId : $("#userId").val(),
    				lastChgUserId : $("#userId").val()
    		};
    		$('#'+gridId5).alopexGrid('showProgress');
    		httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/updateCoverageDsnGeometry', param, 'POST', 'updateCoverageDsnGeometry');
    	});

    	/*************************************
    	 * 커버리지 그리드 이벤트 처리
    	 *************************************/
    	//커버리지 그리드 전체 선택
    	$('#'+gridId6).on('click','.headercell input', function(e) {
    		Util.clearLayerFunc(covLayer);
    		Util.clearLayerFunc(covLayerLabel);
    		var selectData = AlopexGrid.trimData($('#'+gridId6).alopexGrid("dataGet" , {_state : {selected:true}}));

    		if(selectData.length > 0){
    			drawPolygonLayer(selectData, covLayer, gridId6);
    			drawPolygonLabel(selectData, covLayerLabel, gridId6);
    		}
    	});

    	//커버리지 그리드 Row 선택
    	$('#'+gridId6).on('click', '.bodycell', function(e){

    		let ev = AlopexGrid.parseEvent(e);
			let dataObj = ev.data;
			let rowData = $('#'+gridId6).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

    		if(rowData._key == "covMtsoLkupIcon"){
				// 국사팝업 호출
				callMtsoLkupPop(gridId6, dataObj ,rowData._key);
			}

    		Util.clearLayerFunc(covLayer);
    		Util.clearLayerFunc(covLayerLabel);

			var selectData = AlopexGrid.trimData($('#'+gridId6).alopexGrid("dataGet" , {_state : {selected:true}}));

    		$('#'+gridId6).alopexGrid('viewUpdate');
    		if(selectData.length > 0){
    			drawPolygonLayer(selectData, covLayer, gridId6);
    			drawPolygonLabel(selectData, covLayerLabel, gridId6);
    		}
        });

    	// 도면 클릭시
		$('#'+gridId7Floor).on('click', '#btnDraw', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};

			$a.popup({
				title: '드로잉 툴',
				url: '/tango-transmission-web2/configmgmt/upsdmgmt/DrawTool.do',
				data: data,
				iframe: false,
				windowpopup: true,
				movable:false,
				width : screen.availWidth,
				height : screen.availHeight,
				callback: function(data) {
					floorGridRefresh();
				}
			});
		});

    	$('#btnCovCopy').on('click', function(e){

    		var selectData = AlopexGrid.trimData($('#'+gridId6).alopexGrid("dataGet" , {_state : {selected:true}}));
    		var selMtsoIds = [];
    		var selMtsoNms = [];
    		var selCoverageTypCds = [];

    		if(selectData.length == 0){
    			callMsgBox('','W', "복사할 영역이 존재하지 않습니다." , function(msgId, msgRst){});
    			return;
    		} else {
    			callMsgBox('','I', selectData.length + "개의 영역을 복사합니다." , function(msgId, msgRst){
    				if(msgRst == "Y"){
    					_.each(selectData, function(rowData, idx){
    						selMtsoIds.push(rowData.mtsoId);
    						selMtsoNms.push(rowData.mtsoNm);
    						selCoverageTypCds.push(rowData.coverageTypCd);
    					});

    					var param = {
    		    				mtsoIds : selMtsoIds,
    		    				mtsoNms : selMtsoNms,
    		    				coverageTypCds : selCoverageTypCds,
    		    				frstRegUserId : $("#userId").val(),
    		    				lastChgUserId : $("#userId").val()
    		    		};

    		    		$('#'+gridId6).alopexGrid('showProgress');
    		    		httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/copyCoverageGeometry', param, 'POST', 'copyCoverageGeometry');
    				}
    			});
    		}
    	});

    	$('#btnExportExcel').on('click', function(e) {

      	   	if(gridId5FocusInfo == undefined
      	   			|| gridId5FocusInfo.length == 0){
      	   		callMsgBox('','W', "선택된 커버리지가 없습니다." , function(msgId, msgRst){});
      	   	}

      	   	var now = new Date();
      	   	var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
      	   	var excelFileNm = "커버리지통계_" + dayTime + ".xlsx";

      		var param = {
      				fileName : excelFileNm,
      				mtsoId : gridId5FocusInfo.mtsoId,
      				coverageId : gridId5FocusInfo.coverageId,
      				coverageTerrNm : gridId5FocusInfo.coverageTerrNm,
      				covMtsoNm : gridId5FocusInfo.mtsoNm,
      				flag : 'topology',
      				pageNo : 1,
      				rowPerPage : 1000000
      		};

      		$('#tab-8').progress();
      		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/createExcelCoverageStc', param, 'GET', 'coverageStc');
      	 });

    	// 반경거리
        $('#circleRangeAply').on('click', function(){
        	var circleRange = $('#circleRange').val();

        	if(parseInt(circleRange) >= 0){
        		var distance_circle_layer = window.distanceCircleLayer;
        		distance_circle_layer.clearLayers();
        		if(parseInt(circleRange) != 0){
        			var circle_latlng = window.mgMap.getCenter();
        			var distance_circle = L.circle([ circle_latlng.lat, circle_latlng.lng], parseInt(circleRange));
        			distance_circle_layer.addLayer(distance_circle);
        		}
        	}else{
        		callMsgBox('','W', "양의 정수만 입력하세요." , function(msgId, msgRst){});
    			return;
        	}
        });

        // 유선선로시설현황(LDAS)
        $('#wreLnFcltsCurstBtn').on('click', function(){
        	window.open('https://ldas.skbroadband.com/ca/captureReport/65d5652d383401d79f376538')
        });

		// 영역확대
		$('#mapZoomIn').on('click', function() {
			window.mgMap.setZoom(window.mgMap.getZoom() + 1);
		});

		// 영역축소
		$('#mapZoomOut').on('click', function() {
			window.mgMap.setZoom(window.mgMap.getZoom() - 1);
		});

	}; //이벤트리스너 끝

	/*====================================*
	 * 선택된 Polygon layer 그리기
	 *====================================*/
	drawPolygonLayer = function(layerList, layerId, gridId){
		var style = layerId;

		var result = {features: []};
		_.each(layerList, function(feature, idx) {

			//유선 커버리지 서비스에 대한 레이어 스타일 적용
			if(gridId == gridId6){
				if(feature.coverageTypCd == "5G"){
					style = "MTSO_5G_COV_LAYER";
				} else if(feature.coverageTypCd == "LTE"){
					style = "MTSO_LTE_COV_LAYER";
				}
			}

			var geoJson = L.MG.Util.wktToGeoJSON(feature.geo);
			geoJson.properties = feature;
			geoJson.style = [{id: style}];
			result.features.push(geoJson);
		}, this);

		var layer = mgMap.getCustomLayerByName(layerId);
		if(!layer) {
			layer = mgMap.addCustomLayerByName(layerId, {selectable: false});
		}
		layer.addData( result );

		window.mgMap.fitBounds(layer.getBounds(), window.mgMap.getZoom());
	};

	drawHighlightPolygonLayer = function(layerList, focusRowData, layerId){

		var ft = mgMap.getSelectedFeatures();
		var style = layerId;

		var result = {features: []};
		_.each(layerList, function(feature, idx) {
			if(feature.mtsoId == gridId5FocusInfo.mtsoId){
				var geoJson = L.MG.Util.wktToGeoJSON(gridId5FocusInfo.geo);
				geoJson.properties = feature;
				geoJson.style = [{id: 'MTSO_COV_H_DSN_LAYER'}];
				result.features.push(geoJson);
			}
		}, this);

		var layer = mgMap.getCustomLayerByName(layerId);
		if(!layer) {
			layer = mgMap.addCustomLayerByName(layerId, {selectable: false});
		}

		layer.addData( result );
		window.mgMap.fitBounds(layer.getBounds(), window.mgMap.getZoom());

		var feature = null;
		if ( layer ) {
			if (layer.getLayers().length > 0) {
				var selDatas = layer.getLayers();
				for (var i=0; i<selDatas.length; i++) {
					feature = selDatas[i];
				}
			}
		}
		if ( feature ) { window.mgMap.setMode('trail-edit', {data: {feature: feature}}); }

	};

	/*====================================*
	 * 선택된 Polygon layer label 정보구하기
	 *====================================*/
	drawPolygonLabel = function(layerList, layerId, gridId){
		var style = layerId;
		var result = {features: []};

		_.each(layerList, function(feature, idx) {
			//유선 커버리지 서비스에 대한 레이어 스타일 적용
			if(gridId == gridId6){
				if(feature.coverageTypCd == "5G"){
					style = "MTSO_5G_COV_LABEL";
				} else if(feature.coverageTypCd == "LTE"){
					style = "MTSO_LTE_COV_LABEL";
				}
			}

			var geometry = L.MG.Util.wktToGeometry(feature.geo);
			var geoJson = L.marker(geometry.getBounds().getCenter()).toGeoJSON();
			feature.mtsonm = feature.mtsoNm;
			feature.coverageterrnm = feature.coverageTerrNm;
			geoJson.properties = feature;
			geoJson.style = [{id: style}];

			result.features.push(geoJson);
		}, this);

		var layer = mgMap.getCustomLayerByName(layerId);
		if(!layer) {
			layer = mgMap.addCustomLayerByName(layerId, {selectable: false});
		}

		layer.addData( result );
	}

	getDrawTrailInfo = function() {
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
	};

	getPolygonGeometryString = function() {
		var trailInfo = this.getDrawTrailInfo();
		if ( _.size(trailInfo.trailCoords) == 0 ) { return null; }
		var geoString = '';
		var latlngs = '';
		_.each(trailInfo.trailCoords, function(latlng, idx) {
			latlngs += latlng.lng + ' ' + latlng.lat + ', ';
		});

		latlngs += trailInfo.trailCoords[0].lng + ' ' + trailInfo.trailCoords[0].lat;
		geoString += 'POLYGON(( ' + latlngs + ' ))';

		return geoString;
	};

    /*==========================*
	 * 링조회실행
	 *==========================*/
    var setRingListGrid = function(page, rowPerPage){
    	var firstRow = (page - 1) * rowPerPage + 1;
        var lastRow =  page * rowPerPage;
        $('#ringPageNo').val(page);
		$('#ringRowPerPage').val(rowPerPage);
		$('#firstRowIndex').val(firstRow);
		$('#lastRowIndex').val(lastRow);
		var param =  $("#searchRingForm").getData();
		$('#ringListGrid').alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getSelectRingList', param, 'GET', 'searchRing');
	}

    /*==========================*
	 * 회선조회 실행
	 *==========================*/
    var setLineListGrid = function(page, rowPerPage){
    	var firstRow = (page - 1) * rowPerPage + 1;
        var lastRow =  page * rowPerPage;
        $('#linePageNo').val(page);
		$('#lineRowPerPage').val(rowPerPage);
		$('#lineFirstRowIndex').val(firstRow);
		$('#lineLastRowIndex').val(lastRow);

		var param =  $("#searchLineForm").getData();
		$('#lineListGrid').alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/configmgmt/cfline/serviceline/getservicelistbymap', param, 'GET', 'searchLine');
	}

    /*==========================*
	 * 국사조회실행
	 *==========================*/
	var setMtsoListGrid = function(page, rowPerPage){
    	$('#mtsoPageNo').val(page);
    	$('#mtsoRowPerPage').val(rowPerPage);

    	 var param =  $("#searchMtsoForm").serialize();
   		 $('#mtsoListGrid').alopexGrid('showProgress');
		 httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getMtsoList', param, 'GET', 'searchMtso');
    }

	/*==========================*
	 * 유선커버리지 설계 조회(SKT ONLY)
	 *==========================*/
	var setCoverageDsnGrid = function(){
		mgMap.setMode('select'); //노드편집 모드 제거
		Util.clearLayerFunc(covDsnLayer); //커버리지 설계 레이어
		Util.clearLayerFunc(covDsnLayerLabel); //커버리지 설계 라벨 레이어
		Util.clearLayerFunc(hCovDsnLayer); //커버리지 설계 하일라이트 레이어

		var param =  {};
		param.mgmtGrpNm = "SKT";//$('#mgmtGrpNm').val();
		param.mtsoNm = $("#mtsoNm5").val();
		param.coverageTerrNm = $("#coverrageTerrNm5").val();
		param.bldAddr = $("#bldAddr5").val();
		param.tmofList = ($("#tmofList5").val() == null) ? [] : $("#tmofList5").val();		//전송실

		param = Util.convertQueryString(param);

		$('#'+gridId5).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getCoverageDsnList', param, 'GET', 'selectCoverageDsn');
	}

	/*==========================*
	 * 유선커버리지 조회(SKT ONLY)
	 *==========================*/
	var setCoverageGrid = function(){
		var param =  {};
		param.mgmtGrpNm = "SKT";
		param.mtsoNm = $("#mtsoNm6").val();
		param.bldAddr = $("#bldAddr6").val();
		param.tmofList = ($("#tmofList6").val() == null) ? [] : $("#tmofList6").val();		//전송실
		param.coverageTypList = ($("#coverageTypList6").val() == null) ? [] : $("#coverageTypList6").val();		//서비스

		param = Util.convertQueryString(param);
		$('#'+gridId6).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getCoverageList', param, 'GET', 'selectCoverage');
	}

	//유선망 통합설계 수요검토 목록 조회
	let setWreDsnListGrid = function(page, rowPerPage){
		window.mgMap.clearSelectLayer();
		Util.clearLayerFunc(eqpDsnMtsoLayer);
		Util.clearLayerFunc(eqpDsnMarkerLayer);

		$('#wreDsnPageNo').val(page);
		$('#wreDsnRowPerPage').val(rowPerPage);

		var param =  $("#searchWreDsnForm").getData();
		param.tabIdx = "1";
		param.pageNo = $('#wreDsnPageNo').val();
    	param.rowPerPage = $('#wreDsnRowPerPage').val();

    	$('#'+gridId9).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getWreDsnRvList', param, 'GET', 'searchWreDsnList');
	}

	//유선망 통합설계 결과결과 목록 조회
	let setWreDsnRsltListGrid = function(page, rowPerPage){
		Util.clearLayerFunc(eqpDsnRsltMtsoLayer);
		Util.clearLayerFunc(eqpDsnRsltMarkerLayer);

		$('#wreDsnRsltPageNo').val(page);
		$('#wreDsnRsltRowPerPage').val(rowPerPage);

		let param =  $("#searchWreDsnRsltForm").getData();
		param.pageNo = $('#wreDsnRsltPageNo').val();
		param.rowPerPage = $('#wreDsnRsltRowPerPage').val();
		param.rsltUserNm = $('#rsltUserNm').val();

		if($("#selfChk").is(':checked')) {
 			param.lastChgUserId = $("#userId").val();
 		}

		$('#'+gridId10).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getWreDsnRsltList', param, 'GET', 'searchWreDsnRsltList');
	}

	let setWreDsnRsltRouteanListGrid = function(page, rowPerPage){
		$('#wreDsnRsltRouteanPageNo').val(page);
		$('#wreDsnRsltRouteanRowPerPage').val(rowPerPage);

		let param =  {};
		param.pageNo = $('#wreDsnRsltRouteanPageNo').val();
		param.rowPerPage = $('#wreDsnRsltRouteanRowPerPage').val();
		param.srcReqIdVal = $('#endObjMgmtNo').val();
		param.uprMtsoIdNm = $('#wreDsnUprMtsoIdNm').val();
		param.lowMtsoIdNm = $('#wreDsnLowMtsoIdNm').val();

		$('#'+gridId10Routean).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getRouteReqDtlList', param, 'GET', 'searchWreDsnRsltRouteanList');
	}


	//국사투자 시뮬레이션-국사투자시뮬레이션기본 조회
	let setMtsoInvtSmltInfGrid = function(page, rowPerPage){
		// 선택된 데이터 초기화
    	gridId11FocusInfo = [];
    	gridId11BasFocusInfo = [];

		$('#mtsoSmltInfPageNo').val(page);
		$('#mtsoSmltInfRowPerPage').val(rowPerPage);

		let param =  $("#searchMtsoInvtSmltForm").getData();
		param.pageNo = $('#mtsoSmltInfPageNo').val();
    	param.rowPerPage = $('#mtsoSmltInfRowPerPage').val();
    	param.tmofList = ($("#tmofList11").val() == null) ? [] : $("#tmofList11").val();		//전송실
    	param = Util.convertQueryString(param);

    	$('#'+gridId11).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/engineeringmap/mtsoinvtslmt/getMtsoInvtSmltInfList', param, 'GET', 'selectMtsoInvtSmltInfList');
	}

	//국사투자 시뮬레이션-국사투자시뮬레이션정보 조회

	let setMtsoInvtSmltBasGrid = function(page, rowPerPage){
		// 선택된 데이터 초기화
		gridId11BasFocusInfo = [];

		$('#mtsoSmltBasPageNo').val(page);
		$('#mtsoSmltBasRowPerPage').val(rowPerPage);

		let param =  $("#searchMtsoInvtSmltForm").getData();
		param.pageNo = $('#mtsoSmltBasPageNo').val();
    	param.rowPerPage = $('#mtsoSmltBasRowPerPage').val();
    	param.mtsoInvtSmltId = gridId11FocusInfo.mtsoInvtSmltId; //국사투자 시뮬레이션기본그리드에서 선택된 ROW 정보
    	param = Util.convertQueryString(param);

    	$('#'+gridId11Bas).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/engineeringmap/mtsoinvtslmt/getMtsoInvtSmltBasList', param, 'GET', 'selectMtsoInvtSmltBasList');
	}



	 /*==========================*
	 * 시설물선택하면 시설물 정보 가져오기
	 *==========================*/
	function onClickFeatures(featuresObj) {
		if (featuresObj.features.length > 0){
//			var layerId = featuresObj.features[0].feature.getLayerId();
//			var layer = window.mgMap.getLayerById(layerId);
//			var layrNm = layer.getLayerAliasName();
//			var mgmtNo = L.MG.Util.objectId(featuresObj.features[0]);
//			var geometry = featuresObj.features[0].feature.geometry;
//			var symbolType = geometry.type;

			var layrNm = featuresObj.features[0].getProperties().layerName;

			if(layrNm == sktTmofLayer
					|| layrNm == sktCofcLayer
					|| layrNm == sktBmtsoLayer
					|| layrNm == sktSmtsoLayer
					|| layrNm == skbInfCntrLayer
					|| layrNm == skbMtsoLayer
					|| layrNm == skbSmtsoLayer
					){
				var param = new Object();
				//param.mtsoMgmtNo =featuresObj.features[0].feature.mgmtNo;//GIS국사관리번호
				param.mtsoMgmtNo = featuresObj.features[0].getProperties().mgmtNo;//GIS국사관리번호

				httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getMtsoBulInf', param, 'GET', 'searchguMtsoInf');
			}
			//국사선택시
//			if ( layrNm =='T_국소' ||
//       			 layrNm =='T_전송실' ||
//       			 layrNm =='T_중심국_국사' ||
//       			 layrNm == 'SKT기지국') {
//			    //시설물관리번호로 국사정보 가져오기
//				var param = new Object();
//				param.mtsoMgmtNo = mgmtNo;//GIS국사관리번호
//				param.mtsoLatVal = geometry.coordinates[1];//featureObj의 위도
//				param.mtsoLngVal = geometry.coordinates[0];//featureObj의 경도
//				httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getMtsoInf', param, 'GET', 'searchMtsoInf');
//			}else
			if(layrNm == 'MTSO_ERP_LAYER'){
				var param = new Object();
				//param.mtsoMgmtNo =featuresObj.features[0].feature.mgmtNo;//GIS국사관리번호
				param.mtsoMgmtNo = featuresObj.features[0].getProperties().mgmtNo;//GIS국사관리번호
				httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getMtsoErpInf', param, 'GET', 'searchguMtsoInf');
			}else if(layrNm == 'MTSO_BUL_LAYER'){
				var param = new Object();
				//param.mtsoMgmtNo =featuresObj.features[0].feature.mgmtNo;//GIS국사관리번호
				param.mtsoMgmtNo = featuresObj.features[0].getProperties().mgmtNo;//GIS국사관리번호

				if($('#divBulLayer').is(':checked')){
	 				param.bldChk = "Y"
	 			}
				httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getMtsoBulInf', param, 'GET', 'searchguMtsoInf');

				//해당 기지국에 영향이 있는 중계기 조회
				httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getRpetrOfBmtso', param, 'GET', 'searchRpetrOfBmtso');
			}else if(layrNm == 'EQP_DSN_MTSO_LAYER'){
				let marker = new Object();
				let markerDiv = featuresObj.features[0].feature.markerDiv;
				//메뉴등장
				marker.markerDiv = markerDiv;
				marker.objMgmtNo = featuresObj.features[0].feature.objMgmtNo;
				marker.demdRvSeq = featuresObj.features[0].feature.demdRvSeq;
				marker.demdMtsoId = featuresObj.features[0].feature.demdMtsoId;
				marker.lnkgMtsoId = featuresObj.features[0].feature.lnkgMtsoId;
				marker.mtsoId = featuresObj.features[0].feature.mtsoId;
				marker.mtsoNm = featuresObj.features[0].feature.mtsoNm;
				marker.mtsoLngVal = featuresObj.features[0].feature.mtsoLngVal;
				marker.mtsoLatVal = featuresObj.features[0].feature.mtsoLatVal;
				marker.mtsoTypCd = featuresObj.features[0].feature.mtsoTypCd;
				console.log('featuresObj',featuresObj)

				contextItems = LayerTreeControl.getSelectedMenuItems(mgMap, marker);
				window.mgMap.setSelectedItemContextMenu(contextItems, true);
			} else if(layrNm == 'NODE_NETWORK_LINE_LAYER'){
				let marker = new Object();
				marker.fromEqpId = featuresObj.features[0].feature.fromEqpId;
				marker.toEqpId = featuresObj.features[0].feature.toEqpId;
				marker.fromMtsoId = featuresObj.features[0].feature.fromMtsoId;
				marker.toMtsoId = featuresObj.features[0].feature.toMtsoId;
				marker.lineDivVal = featuresObj.features[0].feature.lineDivVal;
				marker.midLngVal = featuresObj.features[0].feature.midLngVal;
				marker.midLatVal = featuresObj.features[0].feature.midLatVal;
				marker.midLinePoint = featuresObj.features[0].feature.midLinePoint;
				marker.netBdgmNetDivVal = featuresObj.features[0].feature.netBdgmNetDivVal;

				//라인 중앙에 라벨 그리기용 (GIS 라인 정보 표시 제거 - 20250108)
				//drawNodeNetworkLineLabel(marker);

				// 기간망 링크 팝업 메뉴
				if (marker.netBdgmNetDivVal == 'RONT') {
					contextItems = NetworkLayerControl.getSelectedNodeLinkMenuItems(mgMap, marker);
					window.mgMap.setSelectedItemContextMenu(contextItems, true);
				}
			} else if(layrNm == 'NODE_NETWORK_LAYER'){
				let marker = new Object();
				marker.mtsoId = featuresObj.features[0].feature.mtsoId;
				marker.mtsoNm = featuresObj.features[0].feature.mtsoNm;
				marker.lineDivVals = featuresObj.features[0].feature.lineDivVals;
				marker.mtsoTypCd = featuresObj.features[0].feature.mtsoTypCd;
				marker.netBdgmNetDivVal = featuresObj.features[0].feature.netBdgmNetDivVal;
				marker.netBdgmNm = featuresObj.features[0].feature.netBdgmNm

				contextItems = NetworkLayerControl.getSelectedNodeNetworkMenuItems(mgMap, marker);
				window.mgMap.setSelectedItemContextMenu(contextItems, true);
			} else if(gisLayerConf.some(item => item.layrNm === layrNm)) {
				let marker = new Object();
				//메뉴등장
				marker.layrNm = layrNm;
				marker.pkValue = featuresObj.features[0].feature._$id;
				marker.actMode = "READ";

				// 우클릭 메뉴 추가 작업중
				marker.contextMenu = _M.getLayerMgmtCode(mgmtNo);
				console.log('contextMenu', marker.contextMenu);
				console.log('featuresObj.features[0].',featuresObj.features[0])

				contextItems = LayerTreeControl.getGisSelectedMenuItems(mgMap, marker);
				window.mgMap.setSelectedItemContextMenu(contextItems, true);

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

		var mtsoTypCdList = []; //국사유형
		var eqpRoleDivCdList = []; //장비 타입

		//하이라이트해 준 기준국사있으면 clear하고
		if(mtsoColorIndex != null && mtsoColorIndex != ""){
			$('#orgListGrid').alopexGrid("updateOption", { rowOption : {
                 styleclass : function(data, rowOption){
                                  if(data._index.row == mtsoColorIndex ){
                                      return 'row-highlight-unselect'; } } } });
			mtsoColorIndex = "";
		}

		//국사유형
		mtsoTypCdList = ($("#mtsoTypCdList1").val() == null) ? [] : $("#mtsoTypCdList1").val();
		eqpRoleDivCdList = ($("#eqpRoleDivCdList1").val() == null) ? getMultiSelect("eqpRoleDivCdList1", "value", "") : getMultiSelect("eqpRoleDivCdList1", "value", ":selected");

		var param = new URLSearchParams();
		param.append("mgmtGrpNm", $("#mgmtGrpNm1").val());
		param.append("geoWkt", boundsWkt);
		param.append("mtsoId", mtsoId);
		_.each(mtsoTypCdList, function(data){
			param.append("mtsoTypCdList", data);
		});
		_.each(eqpRoleDivCdList, function(data){
			param.append("eqpRoleDivCdList", data);
		});

		$('#orgListGrid').alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getRangeMtsoList', param.toString(), 'GET', 'searchRangeMtsoList');
	}

	function getMultiSelect(objId, gbn, selected){
		var returnVal = [];
		var returnText = [];
		$('#'+objId+' option'+selected).each(function(i){
			var $this = $(this);
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
		//ringInfPopupLayer.closePopup();
		ringInfPopupLayer.clearLayers();
		//선택된 이벤트레이어 초기화
		//window.mgMap.clearSelectLayer();
		L.SelectLayer.getInstance().clearSelectLayer();
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
		topoSclCdList = $("#topoSclCdList").getData().topoSclCdList;
		ntwkTypCdList = $("#ntwkTypCdList").getData().ntwkTypCdList;
		var param= "geoWkt="+boundsWkt+"&topoSclCdList="+topoSclCdList+"&ntwkTypCdList="+ntwkTypCdList ;
		$('#rangeRingGrid').alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getRangeRingList', param, 'GET', 'searchRangeRingList');
	}

    function drawTitle(response) {
    	var features = [];
    	_.map(response.LayerList, function(item, index) {
    		var feature = {};
    		feature.type = "Feature";
    		feature.properties = item;
    		feature.properties.LABEL = item.mtsoNm;
    		feature.geometry = {};
    		feature.geometry.type = 'Point';
    		feature.geometry.coordinates = [item.mtsoLngVal , item.mtsoLatVal];
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
	   			faceName : "돋움",
	   			size : "12",
	   			color : "blue",
	   			hAlign : "middle",
	   			vAlign : "top",
	   			opacity : 1.0,
    	};
    	for (var key in mtsoLayerLabel._layers) {
    		var layer = mtsoLayerLabel._layers[key];
    		layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL, hAlign : "middle", vAlign : "top"})));
    	}
    }


    function setTab7Data(){

    	$("#coverageTerrNm7").val(gridId5FocusInfo.coverageTerrNm);
    	$("#covMtsoNm7").val(gridId5FocusInfo.mtsoNm);

    	$('#tT').progress();
		$('#tA').progress();
		$('#tLn').progress();
//		$('#tLnn').progress();
		$('#tS').progress();

		var param = {
				mtsoId : gridId5FocusInfo.mtsoId,
				coverageId : gridId5FocusInfo.coverageId,
				flag : 'topology',
				pageNo : 1,
				rowPerPage : 100000
		};

		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/mtsoteqpcnt', param, 'GET', 'teqpcnt'); //국사T장비수
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/mtsoaeqpcnt', param, 'GET', 'aeqpcnt'); //국사A장비수
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/mtsofcltcnt', param, 'GET', 'fcltcnt'); //국사시설물수
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/mtsosvlncnt', param, 'GET', 'svlncnt'); //국사서비스회선수
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/mtsolinecnt', param, 'GET', 'linecnt'); //국사선로수
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/mtsoseqpcnt', param, 'GET', 'seqpcnt'); //국사부대장비수

		//tab8 - 국사 목록
		$('#'+gridId7).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commonlkup/mtsodistance', param, 'GET', 'distancecnt');

		//tab8 - 상면국사 층목록
		$('#'+gridId7Floor).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/upsdmgmt/getMtsoFloorList', param, 'GET', 'floorSearch');
    }

	this.floorGridRefresh = function(){
		var param = {
				mtsoId : gridId5FocusInfo.mtsoId,
				coverageId : gridId5FocusInfo.coverageId,
				flag : 'topology',
				pageNo : 1,
				rowPerPage : 100000
		};

		$('#'+gridId7Floor).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/upsdmgmt/getMtsoFloorList', param, 'GET', 'floorSearch');
	}

	// 국사팝업 호출
    function callMtsoLkupPop(gridId, dataObj, flag){

    	var paramData = {};
		if(gridId == gridId6){

			paramData.mtsoId = dataObj.mtsoId;
			paramData.mtsoNm = dataObj.mtsoNm;
			paramData.coverageTypCd = dataObj.coverageTypCd;
		}

		$a.popup({
			popid: "CovMtsoLkupPop",
			title: "커버리지 국사 정보",
			url: "/tango-transmission-web2/trafficintg/engineeringmap/CoverageMtsoPopup.do",
			data: paramData,
			windowpopup : true,
			modal: false,
			movable:true,
			width : 1050,
			height : 650,
			callback: function(data) {
			}
		});
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

		if(flag == 'tmof'){
    		//SKT
    		if(response[0].mgmtGrpCd == "0001"){
    			for(var i=0; i<response.length; i++){
        			var resObj = response[i];
        			skt_tmof_option_data.push(resObj);
        		}
    		}
    		//SKB
    		if(response[0].mgmtGrpCd == "0002"){
    			for(var i=0; i<response.length; i++){
        			var resObj = response[i];
        			skb_tmof_option_data.push(resObj);
        		}
    		}

    		$('#tmofList11').clear();
			$('#tmofList11').setData({
		       data:skt_tmof_option_data,
			});
		}
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

			if(mtsoInf.mtsoId == null){
				mtsoId = mtsoInf.mtsoMgmtNo;
			}else{
				mtsoId = mtsoInf.mtsoId;
			}
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
 		            '<b>국사ID:</b><%pop_mtsoId%><br>'+
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
 				//메뉴등장
 		        //showLeftContainer();
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
 		    		var eqpRoleDivCdList = ($("#eqpRoleDivCdList1").val() == null) ? getMultiSelect("eqpRoleDivCdList1", "value", "") : getMultiSelect("eqpRoleDivCdList1", "value", ":selected");
 		    		var param = new URLSearchParams();
	 		   		param.append("mtsoId", mtsoId);
	 		   		_.each(eqpRoleDivCdList, function(data){
	 		   			param.append("eqpRoleDivCdList", data);
	 		   		});

 					$('#eqpListGrid').alopexGrid('showProgress');
 		 			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getEqpList', param.toString(), 'GET', 'searchEqpList');
 		    	//주변국사리스트에 없으면 지도이동하고 새로 주변링과 주변국사 조회
 		    	}else{
 		    		//가운데로 이동시키고
 		    		window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], window.mgMap.getZoom());
 		    		//반경거리 표시해주고
 			        if (circleRange != 0){
 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 			        distance_circle_layer.clearLayers();
 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
 					    distance_circle_layer.addLayer(distance_circle);
 			        }
 			        //주변링조회
 			     //   searchAroundRing();
 		    	}
 			}
		}

		/*...........................*
	        링 조회시
		 *...........................*/
    	if(flag == 'searchRing'){
    		$('#ringListGrid').alopexGrid('hideProgress');
    		var pageNo = $("#ringPageNo").val();
    		var rowPerPage = $("#ringRowPerPage").val();
    		var serverPageinfo = {
    	      		dataLength  : response.totalCnt, 	//총 데이터 길이
    	      		current 	: pageNo,          		//현재 페이지 번호
    	      		perPage 	: rowPerPage         	//한 페이지에 보일 데이터 갯수
          	};
           	$('#ringListGrid').alopexGrid('dataSet', response.outRingList, serverPageinfo);
    	}

		/*...........................*
	    	회선 조회시
		 *...........................*/
		if(flag == 'searchLine'){
			$('#lineListGrid').alopexGrid('hideProgress');
			var pageNo = $("#linePageNo").val();
			var rowPerPage = $("#lineRowPerPage").val();
			var serverPageinfo = {
		      		dataLength  : response.totalCnt, 	//총 데이터 길이
		      		current 	: pageNo,          		//현재 페이지 번호
		      		perPage 	: rowPerPage         	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#lineListGrid').alopexGrid('dataSet', response.ServiceLineList, serverPageinfo);
		}

		//국사 조회
    	if(flag == "mtsoData") {
        	cnt1 = 0;
        	cnt2 = 0;
        	cnt3 = 0;
        	cnt4 = 0;
        	cnt9 = 0;
            dupMtsoId.length = 0;

    		var sctnresponse = {nodeData:null, linkData:null};

    		var lineListCnt = $('#lineListGrid').alopexGrid('dataGet', {_state: {selected:true}});
    		var pageInfo = $('#lineListGrid').alopexGrid("pageInfo");
    		var alertFlag = false;
    		// 회선 전체 선택시 알림창 off
    		if (lineListCnt.length == pageInfo.pageDataLength) {
    			alertFlag = true;
    		}

    		if(response.sctnData.length == 0 && !alertFlag){
    			callMsgBox('','I', "검색 결과가 없습니다.", function(msgId, msgRst){
    				nodeDataArray = [];
    	    		linkDataArray = [];
    	    		dupMtsoId = [];
    			});
	 	     	return;
    		} else if(response.sctnData.length == 0 && alertFlag){
    			return;
    		}

			//선택된 이벤트레이어 초기화
			window.mgMap.clearSelectLayer();

			//국사표시
			var mtsoInfLayer = window.mtsoInfLayer;
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();

    		sctnresponse = sctnMtsoDataParsing(response.sctnData);

    		nodeDataArray = [];
    		linkDataArray = [];
    		dupMtsoId = [];

    		var groupNodeCnt = 0;
    		var ringNodeCnt = 0;
    		var groupLinkCnt = 0;
    		var ringLinkCnt = 0;
    		var nodeData = null;
    		var linkData = null;
    		var locXS = 0;

    		nodeData = sctnresponse.nodeData;
    		linkData = sctnresponse.linkData;

    		for(var i=0; i<nodeData.length; i++){
    			var resObj = nodeData[i];
    			var everexpand = false;
    			var src = null;
    			var locYS = 0;

    			if(resObj.mtsoTypCd == "1"){
    				if(cnt1 == 0){
    					cnt1++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "전송실", category: "newTypGroup", color: "rgba(255,128,61,0.2)", isGroup: true });
    				}
    			}else if(resObj.mtsoTypCd == "2"){
    				if(cnt2 == 0){
    					cnt2++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "중심국", category: "newTypGroup", color: "rgba(0,128,255,0.2)", isGroup: true });
    				}
    			}else if(resObj.mtsoTypCd == "3"){
    				if(cnt3 == 0){
    					cnt3++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "기지국", category: "newTypGroup", color: "rgba(0,128,0,0.2)", isGroup: true });
    				}

    			}else if(resObj.mtsoTypCd == "4"){
    				if(cnt4 == 0){
    					cnt4++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "국소", category: "newTypGroup", color: "rgba(187,187,0,0.2)", isGroup: true });
    				}
    			}else if(resObj.mtsoTypCd == "9"){
    				if(cnt9 == 0){
    					cnt9++;
    					nodeDataArray.push({ key: resObj.mtsoTypCd, name: "미매핑국사", category: "newTypGroup", color: "rgba(0,0,0,0.2)", isGroup: true });
    				}
    			}

				var cnt = 0;
    			for(var j=0; j<nodeDataArray.length; j++){
    				if(nodeDataArray[j].key == resObj.mtsoId){
    					cnt++;
    				}
    			}
    			if(cnt == 0){
					dupMtsoId[dupMtsoId.length] = resObj.mtsoId;
    			}
    		}

    		for(var i=0; i<linkData.length; i++){
    			var resObj = linkData[i];
    			var cnt = 0;
    			for(var j=0; j<linkDataArray.length; j++){
    				if(((linkDataArray[j].from == resObj.lftMtsoId && linkDataArray[j].to == resObj.rghtMtsoId) ||
    					(linkDataArray[j].from == resObj.rghtMtsoId && linkDataArray[j].to == resObj.lftMtsoId))){
    					cnt++;
    				}
    			}
    			if(cnt == 0){
    				linkDataArray.push({ from: resObj.lftMtsoId, to: resObj.rghtMtsoId, lftVal: resObj.lftVal, rghtVal: resObj.rghtVal, curviness: 0, category: "mtsoLink" });
    			}
    		}

    		var ringLatLng = [];
			for(var i=0; i<linkDataArray.length; i++){
				var cnt = 0;
				for(var j=0; j<ringLatLng.length; j++){
					 if(ringLatLng[j] == "["+linkDataArray[i].lftVal+"],["+linkDataArray[i].rghtVal+"]"){
						 cnt++;
						 break;
					 }
				}
				if(linkDataArray[i].lftVal != "undefined,undefined" && linkDataArray[i].rghtVal != "undefined,undefined"){
					if(linkDataArray[i].lftVal != undefined && linkDataArray[i].rghtVal != undefined){
						if(linkDataArray[i].lftVal.replace(" , ", "") != "" && linkDataArray[i].rghtVal.replace(" , ", "") != ""){
							if(cnt == 0){
								ringLatLng[ringLatLng.length] = "["+linkDataArray[i].lftVal+"],["+linkDataArray[i].rghtVal+"]"
							}
						}
					}
				}
			}

			if(window.mgMap != undefined){
				let paramData = "1=1";
				if(dupMtsoId != undefined){
					paramData += '&layerId=' + response.layerId;
					for (var i = 0; i < dupMtsoId.length; i++) {
						paramData += '&mtsoIdList=' + dupMtsoId[i];
					}

					httpRequest('tango-transmission-tes-biz2/transmisson/tes/configmgmt/intge2etopo/mtsoMapInf', paramData, 'GET', 'searchGisMtsoInfByMap');
				}
				let gisRingInf = {"ringMgmtNo": "", "ntwkLineNo": "", "ringLatLng": ringLatLng, "type": ""};

	    		drawRingLayerThatCanBeSelected(gisRingInf, response.layerId, flag, alertFlag); //링그리기

			}
    	}

    	/*...........................*
         국사관리번호 받아서 지도에 표시
		 *...........................*/
		if(flag =='searchGisMtsoInfByMap'){

			//선택된 이벤트레이어 초기화
			window.mgMap.clearSelectLayer();

			let mtsoInfLayer = window.mgMap.addCustomLayerByName('MTSO_INF_LAYER_' + response.layerId)

	        //GIS국사정보
	        let gisMtsoInf = null;
			gisMtsoInf = response.mtsoLineMapList;

			for(let i=0; i<gisMtsoInf.length; i++){
				//팝업할 국사정보 세팅
				let html =
			            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
			            '<b>국사ID:</b><%pop_mtsoId%><br>' +
			            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
			            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
			            '<b>건물주소:</b><%pop_bldAddr%>';

		        html = html.replace('<%pop_mtsoNm%>',gisMtsoInf[i].mtsoNm);
		        html = html.replace('<%pop_mtsoId%>',gisMtsoInf[i].mtsoId);
		        html = html.replace('<%pop_mtsoTyp%>',gisMtsoInf[i].mtsoTypNm);
		        html = html.replace('<%pop_mtsoStat%>',gisMtsoInf[i].mtsoStatNm);
		        html = html.replace('<%pop_bldAddr%>',gisMtsoInf[i].bldAddr);

		        let latlng = L.MG.Util.wktToGeometry(gisMtsoInf[i].geoWkt).getLatLng();//국사 위치정보
			    if(response.moveMap){//지도이동여부 예 이면
			    	//해당 좌표로 이동
	 			    window.mgMap.setView([latlng.lat, latlng.lng], 13);
	 			    //반경거리 표시해주고
			        if (circleRange != 0){
			        	let distance_circle_layer = window.distanceCircleLayer;
	 			        distance_circle_layer.clearLayers();
	 			        let distance_circle = L.circle([latlng.lat, latlng.lng], parseInt(circleRange));
					    distance_circle_layer.addLayer(distance_circle);
			        }

			        //지도이동있으니까
//		 			searchAroundMtso(response.mtsoId); //주변국사조회
//		 			searchAroundRing();                //주변링조회
//		 			showLeftContainer();               //왼쪽메뉴등장
			    }
			    //국사포인트 표시하고 정보팝업
			    let marker = L.marker([latlng.lat, latlng.lng]);
			    marker.mtsoId = gisMtsoInf[i].mtsoId;
			    marker.mtsoTypCd = gisMtsoInf[i].mtsoTypCd;
		        mtsoInfLayer.addLayer(marker);

		        // 우클릭시 국사 정보 레이어 표시
		        marker.on('popupopen', function(e) {
		        	contextItems = LayerTreeControl.getSelectedMtsoInfItemList(mgMap, e.target);
					window.mgMap.setContextMenu(contextItems);
		        });

		        marker.bindPopup(html).openPopup();
			}
		}

    	/*...........................*
		    국사조회시
		 *...........................*/
    	if(flag == 'searchMtso'){

    		$('#mtsoListGrid').alopexGrid('hideProgress');

    		setSPGrid('mtsoListGrid',response, response.mtsoMgmtList);
    	}

    	/*...........................*
	     주변국사조회시
		 *...........................*/
		if(flag == 'searchRangeMtsoList'){
			initGrid();
			$('#orgListGrid').alopexGrid('hideProgress');

           	$('#orgListGrid').alopexGrid('dataSet', response.rangeMtsoPivotList, "");
           	//클릭하여 이동한 기준국사 있으면 리스트에 주황색으로 표시하고 장비리스트 조회
           	var kijunMtsoId = null; kijunMtsoId = response.kijunMtsoId;
           	if(kijunMtsoId != null && kijunMtsoId != ""){
               	var orgList = [];
    	    	orgList = $('#orgListGrid').alopexGrid("dataGet", {"mtsoId":kijunMtsoId}, "mtsoId");
    	    	var selectRowIndex = 0;
    	    	//row 주황색표시하고
    	    	if(orgList.length > 0){
    	    		selectRowIndex = orgList[0]._index.row;
    	    		$('#orgListGrid').alopexGrid("focusCell", {_index : {data : selectRowIndex}}, "mtsoNm" );
     		    	$('#orgListGrid').alopexGrid("updateOption", { rowOption : {
     		                                                styleclass : function(data, rowOption){
     		                                                                 if(data._index.row == selectRowIndex ){
     		                                                                     return 'row-highlight-orange'; } } } });
    	    	}
    	    	mtsoColorIndex = selectRowIndex;//주황색 하이라이트한 기준국사인텍스 저장
		    	//장비리스트조회
	 			var eqpRoleDivCdList = ($("#eqpRoleDivCdList1").val() == null) ? getMultiSelect("eqpRoleDivCdList1", "value", "") : getMultiSelect("eqpRoleDivCdList1", "value", ":selected");
		    	var param = new URLSearchParams();
 		   		param.append("mtsoId", kijunMtsoId);
 		   		_.each(eqpRoleDivCdList, function(data){
 		   			param.append("eqpRoleDivCdList", data);
 		   		});

	 			$('#eqpListGrid').alopexGrid('showProgress');
	 			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getEqpList', param.toString(), 'GET', 'searchEqpList');

	 		//클릭하여 이동한 국사 없으면
           	}else{
           		//장비리스트 클리어
           		$('#eqpListGrid').alopexGrid('dataEmpty');
           		//국사정보레이어 초기화
           		var mtsoInfLayer = window.mtsoInfLayer;
        		mtsoInfLayer.closePopup();
    	        mtsoInfLayer.clearLayers();
           	}
		}

		/*...........................*
	      장비리스트조회시
		 *...........................*/
		if(flag == 'searchEqpList'){
			$('#eqpListGrid').alopexGrid('hideProgress');
           	$('#eqpListGrid').alopexGrid('dataSet', response.eqpList, "");
		}

		/*...........................*
	      주변링리스트조회시
		 *...........................*/
		if(flag == 'searchRangeRingList'){
			$('#rangeRingGrid').alopexGrid('hideProgress');
         	$('#rangeRingGrid').alopexGrid('dataSet', response.rangeRingList, "");
		}

		/*...........................*
        망종류데이터셋팅
	 *...........................*/
	if(flag =='TopoData'){
		TopoData = [{value: "",text: "전체"}];
		var option_data =  [];
		for(var n=0;n<response.TopoData.length;n++){
			//링조회 화면 셋팅용
			TopoData.push({value: response.TopoData[n].topoSclCd, text : response.TopoData[n].topoSclNm});
			option_data.push(response.TopoData[n]);
			//상위 망종류 셋팅용
			var addHtml = '<div class="ringTypeCheck">'+
							 '<input id="ringTypCd'+response.TopoData[n].topoSclCd+'" type="checkbox">' +
						       '<span style="font-size: 12px; font-weight: bold;">'+response.TopoData[n].topoSclNm+ '</span>' +
						     '</input>' +
					      '</div>';
			$('#ringTypMenu').append(addHtml);
		}
		$('#topoSclCd').clear();
		$('#topoSclCd').setData({data : TopoData});
		$('#topoSclCdList').clear();
		$('#topoSclCdList').setData({
             data:option_data
		});

		//망종류체크 이벤트준다
        $('.topoSclCdList').on('click', function(e){
        	var t = e.target.attributes[0].nodeValue;
        	if(t.substring(0,9) == 'ringTypCd'){
        	    //코드값 리스트에 넣어주기
        		var arr = [];
        		if ($('#'+t).is(':checked')){
        			topoSclCdList.push(t.substring(9, t.length));
        		}else{
        			var cnt = 0;
        			for(i=0; i<topoSclCdList.length; i++ ){
	        			if(topoSclCdList[i] != null && topoSclCdList[i] != "" && topoSclCdList[i] != t.substring(9, t.length)){
	        				arr[cnt] = topoSclCdList[i];
	        				cnt++;
	        			}
	        		}
        			topoSclCdList = arr;
        		}
        	}
	       });

	}

	/*...........................*
        망구분데이터셋팅
	 *...........................*/
	if(flag =='NtwkTypData'){
		var option_data =  [];
		NtwkTypData = [{value: "",text: "전체"}];
		for(var n=0;n<response.NtwkTypData.length;n++){
			//링조회 화면 셋팅용
			NtwkTypData.push({value : response.NtwkTypData[n].ntwkTypCd, text : response.NtwkTypData[n].ntwkTypNm});
			option_data.push(response.NtwkTypData[n]);
			//option_data.push(resObj);
			//상위 망구분 셋팅용
			var addHtml = '<div class="ntwkTypeCheck">'+
							 '<input id="ntwkTypCd'+response.NtwkTypData[n].ntwkTypCd+'" type="checkbox">' +
						       '<span style="font-size: 12px; font-weight: bold;">'+response.NtwkTypData[n].ntwkTypNm+ '</span>' +
						     '</input>' +
					      '</div>';
			$('#mangTypMenu').append(addHtml);
		}
		$('#ntwkTypCd').clear();
		$('#ntwkTypCd').setData({data : NtwkTypData});
		$('#ntwkTypCdList').clear();
		$('#ntwkTypCdList').setData({
             data:option_data
		});

		//망구분체크 이벤트준다
        $('.ntwkTypCdList').on('click', function(e){
        	var t = e.target.attributes[0].nodeValue;
        	if(t.substring(0,9) == 'ntwkTypCd'){ //isNaN(t):false --> 숫자이다
        	    //코드값 리스트에 넣어주기
        		var arr = [];
        		if ($('#'+t).is(':checked')){
        			ntwkTypCdList.push(t.substring(9, t.length));
        		}else{
        			var cnt = 0;
        			for(i=0; i<ntwkTypCdList.length; i++ ){
	        			if(ntwkTypCdList[i] != null && ntwkTypCdList[i] != "" && ntwkTypCdList[i] != t.substring(9, t.length)){
	        				arr[cnt] = ntwkTypCdList[i];
	        				cnt++;
	        			}
	        		}
        			ntwkTypCdList = arr;
        		}
        	}
       })
	}

	/*...........................*
      국사세부유형
	 *...........................*/
	if(flag =='mtsoDetlTyp'){
		$('#mtsoDetlTypCdList').clear();
		var option_data =  [];
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
		}
		$('#mtsoDetlTypCdList').setData({
             data:option_data
		});
		$('#eqpNmCdList').setData({
   			seletecgOption : [{value: "ROADM" , text:"ROADM"},
							    {value: "PTS" , text:"PTS"},
							    {value: "RING_MUX" , text:"RING_MUX"},
							    {value: "L2SW" , text:"L2SW"},
							    {value: "L3SW" , text:"L3SW"},
								{value: "MSPP" , text:"MSPP"}],
			selected1 : ''
   		})
	}

	/*...........................*
        국사 상태
	 *...........................*/
	if(flag =='mtsoStat'){
		$('#mtsoStatCd').clear();
		var option_data =  [{comCd: "",comCdNm: "전체"}];
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
		}
		$('#mtsoStatCd').setData({
           data:option_data,
           mtsoStatCd: '01'
		});

        $('.mtsoStatCd').on('click', function(e){
        	var t = e.target.attributes[0].nodeValue;
        	if(t.substring(0,9) == 'mtsoStatCd'){
        	    //코드값 리스트에 넣어주기
        		var arr = [];
        		if ($('#'+t).is(':checked')){
        			mtsoStatCd.push(t.substring(9, t.length));
        		}else{
        			var cnt = 0;
        			for(i=0; i<mtsoStatCd.length; i++ ){
	        			if(mtsoStatCd[i] != null && mtsoStatCd[i] != "" && mtsoStatCd[i] != t.substring(9, t.length)){
	        				arr[cnt] = mtsoStatCd[i];
	        				cnt++;
	        			}
	        		}
        			mtsoStatCd = arr;
        			selected1
        		}
        	}
       })
	}

	/*...........................*
    	국사 관리 그룹
	 *...........................*/
	if(flag =='mgmtGrpNm'){
			//tab-4
		$('#mgmtGrpNm').clear();
		var option_data =  [];
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
		}
		$('#mgmtGrpNm').setData({
	       data:option_data,
	       mgmtGrpNm: 'SKT'
		});

		var option_data1 =  null;
		mgmtGrpNm = $('#mgmtGrpNm').val();
		if($('#mgmtGrpNm').val() == "SKT"){
			option_data1 =  [{comCd: "1",comCdNm: "전송실"},
							{comCd: "2",comCdNm: "중심국사"},
							{comCd: "3",comCdNm: "기지국사"},
							{comCd: "4",comCdNm: "국소"}
							];
		}else if($('#mgmtGrpNm').val() == "SKB"){
			option_data1 =  [{comCd: "1",comCdNm: "정보센터"},
							{comCd: "2",comCdNm: "국사"},
							{comCd: "4",comCdNm: "국소"}
							];
		}else{
			mgmtGrpNm = null;
		}
		$('#mtsoTypCdList').clear();
		$('#mtsoTypCdList').setData({
	       data:option_data1,
	       mtsoTypCdList: [1, 2, 3]
		});

			//tab-1
			$('#mgmtGrpNm1').clear();
			var option_data =  [];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#mgmtGrpNm1').setData({
		       data:option_data,
		       mgmtGrpNm: 'SKT'
			});

			var option_data1 =  null;
			mgmtGrpNm = $('#mgmtGrpNm1').val();
			if($('#mgmtGrpNm1').val() == "SKT"){
				option_data1 =  [{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else if($('#mgmtGrpNm1').val() == "SKB"){
				option_data1 =  [{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				mgmtGrpNm = null;
			}
			$('#mtsoTypCdList1').clear();
			$('#mtsoTypCdList1').setData({
		       data:option_data1,
		       mtsoTypCdList: [1, 2, 3]
			});
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
	    	if(geoJson.geometry.type == "MultiLineString"){
	    		ringLatLng = geoJson.geometry.coordinates[1];
	    	}
			var result = { features :[{ type : 'Feature',
					                    mgmtNo : ringMgmtNo,
					                    geometry : {
					                    type : 'LineString',
					                    coordinates :  ringLatLng,

					                },
					                style : [{id:'STYLE_RING_POPUP_LINE'}],
					            }
					        ],
					    };
			ringInfPopupLayer.addData(result);//레이어에 추가하고
			//window.mgMap.fitBounds(ringInfPopupLayer.getBounds(),window.mgMap.getZoom());
			ringInfPopupLayer.bindPopup(html).openPopup();//정보팝업
		}

		if(response.layerId != "RING_MAP_LAYER"){//주변링에서 넘어온 거면 링-장비리스트 세팅
			$('#ringEqpListGrid').alopexGrid('hideProgress');
        	$('#ringEqpListGrid').alopexGrid('dataSet', ringEqpList, "");
		}
   }

    	/*...........................*
	        GIS링정보 가져온 후 링그리기
		 *...........................*/
    	if(flag =='searchGisRingInf'){
    		var ringListCnt = $('#ringListGrid').alopexGrid('dataGet', {_state: {selected:true}});
    		var pageInfo = $('#ringListGrid').alopexGrid("pageInfo");
    		var alertFlag = false;
    		// 링 전체 선택시 알림창 off
    		if (ringListCnt.length == pageInfo.pageDataLength) {
    			alertFlag = true;
    		}

    		var gisRingInf = null;
			//GIS링정보가 없을 경우
    		if (response.gisRingInf.length == 0) {
    			//레이어초기화
    			Util.clearLayerFunc(response.layerId);
    			if (!alertFlag) {
    				//GIS 링관리번호가 없습니다.
            		callMsgBox('','W', configMsgArray['noGisRingMgmtNo'] , function(msgId, msgRst){});
    			}
        	//GIS링정보가 있을 경우
 			}else{
 				var ringLatLng = "";
 				var lastData = [];	//전체 DATA
 				var cnt = 0;

 				//마지막 라인의 좌우여부를 판단하기 위해 첫번째라인 정보를 가져온다
 				var coord0 = response.gisRingInf[0].coord.split('/');
 				var coordF = null;

 				if (response.gisRingInf.length > 1) {
 					//첫 라인의 좌우여부를 판단하기 위해 두번째라인 정보를 가져온다
 					coordF = response.gisRingInf[1].coord.split('/');
 				}

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
					if(i == 0 && response.gisRingInf.length > 1){
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
					if(i == response.gisRingInf.length-1 && response.gisRingInf.length > 1){
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

 				gisRingInf = {"ringMgmtNo": response.gisRingInf[0].ringMgmtNo, "ntwkLineNo": response.gisRingInf[0].ntwkLineNo, "ringLatLng": JSON.parse("["+ringLatLng+"]"), "type": response.gisRingInf[0].type};
 	    		//링GEO정보가 없을 경우
 	    		if (ringLatLng == null || ringLatLng == "") {
 	    			//레이어초기화
 	    			Util.clearLayerFunc(response.layerId);
 	    			if (!alertFlag) {
 	 					//GIS 링맵정보가 없습니다.
 	 					callMsgBox('','W', configMsgArray['noGisRingMapInfo'] , function(msgId, msgRst){});
 	 				}
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
    		var gisMtsoInf = null;
    		gisMtsoInf = response.gisMtsoInf;

	        //팝업할 국사정보 세팅
 		    var html =
		            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
		            '<b>시설코드:</b><%pop_mtsoMgmtNo%><br>'+
		            '<b>국사ID:</b><%pop_mtsoId%><br>' +
		            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
		            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
		            '<b>건물주소:</b><%pop_bldAddr%>';

	        html = html.replace('<%pop_mtsoNm%>',response.mtsoNm);
	        html = html.replace('<%pop_mtsoId%>',response.mtsoId);
	        html = html.replace('<%pop_mtsoTyp%>',response.mtsoTyp);
	        html = html.replace('<%pop_mtsoStat%>',response.mtsoStat);
	        html = html.replace('<%pop_bldAddr%>',response.bldAddr);

    		//GIS 국사정보가 없을 경우
    		if (gisMtsoInf == null || gisMtsoInf == "") {
 				//구성팀 국사 위경도 있으면
 			    if (response.mtsoLatVal != null && response.mtsoLatVal != "" &&
 			    	response.mtsoLngVal != null && response.mtsoLngVal != ""	)
 			    {
 			    	//GIS 국사관리번호가 없습니다. 국사의 위경도 위치를 표시합니다.
 	 				callMsgBox('','W', configMsgArray['noGisMtsoMgmtNo'] , function(msgId, msgRst){});
 			    	if(response.moveMap){
 			    		//해당 좌표로 이동
 	 	 			    window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], window.mgMap.getZoom());
 	 	 			    //반경거리 표시해주고
 	 			        if (circleRange != 0){
 	 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 	 			        distance_circle_layer.clearLayers();
 	 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
 	 					    distance_circle_layer.addLayer(distance_circle);
 	 			        }
 			    	}

 	 			    //국사포인트 표시하고 정보팝업
 			        var marker = L.marker([response.mtsoLatVal, response.mtsoLngVal]);
 			        mtsoInfLayer.addLayer(marker);
 			        html = html.replace('<%pop_mtsoMgmtNo%>','**********');
 			        marker.bindPopup(html).openPopup();

 			    //GIS국사정보도 구성팀 국사 위경도도 없으면
 			    }else{
 			    	//국사의 위도,경도 정보가 없습니다.
 			    	callMsgBox('','W', configMsgArray['noMtsoLatLng'] , function(msgId, msgRst){});
 			    }
 			//GIS국사정보가 있으면
 			}else{
 			     var latlng = L.MG.Util.wktToGeometry(gisMtsoInf.geoWkt).getLatLng();//국사 위치정보
 			     if(response.moveMap){//지도이동여부 예 이면
 			    	//해당 좌표로 이동
 	 			    window.mgMap.setView([latlng.lat, latlng.lng], window.mgMap.getZoom());
 	 			//  window.mgMap.setView([latlng.lat, latlng.lng], 13);
 	 			    //반경거리 표시해주고
 			        if (circleRange != 0){
 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 			        distance_circle_layer.clearLayers();
 					    var distance_circle = L.circle([latlng.lat, latlng.lng], parseInt(circleRange));
 					    distance_circle_layer.addLayer(distance_circle);
 			        }
 			        //지도이동있으니까
 		 		//	searchAroundMtso(response.mtsoId); //주변국사조회
 		 		//	searchAroundRing();                //주변링조회
 		 		//	showLeftContainer();               //메뉴등장
 			   }
 			    //국사포인트 표시하고 정보팝업
		        var marker = L.marker([latlng.lat, latlng.lng]);
		        mtsoInfLayer.addLayer(marker);
		        if(gisMtsoInf.mtsoMgmtNo == undefined){
		        	html = html.replace('<%pop_mtsoMgmtNo%>','**********');
		        }else{
		        	html = html.replace('<%pop_mtsoMgmtNo%>',gisMtsoInf.mtsoMgmtNo);
		        }
		        marker.bindPopup(html).openPopup();
 			}

	        // 우클릭시 국사 정보 레이어 표시
    		if(response.mtsoId.length > 0) {
    			marker.mtsoId = response.mtsoId;
    			marker.mtsoTypCd = response.mtsoTypCd;
    	    	contextItems = LayerTreeControl.getSelectedMtsoInfItemList(mgMap, marker);
    			window.mgMap.setContextMenu(contextItems);
    		}

    		marker.getPopup().on('remove', function(e) {
				mtsoInfLayer.clearLayers();
			});
    	}

    	/*...........................*
        ERP공대 지도에 표시
    	*...........................*/
    	if(flag =="searcherpLayer"){

    	}
    	/*...........................*
        기준국사 지도에 표시
    	*...........................*/
    	if(flag =="searchbulLayer"){
    		//커스텀 레이어 가져오기
    		var mtsoBulLayer = window.mtsoBulLayer;
    		var style = null;
    		//레이어초기화
    		mtsoBulLayer.clearLayers();
    		//features 변수 설정
    		var result = {features: []};
    		//layerList 확인
    		if (response.LayerList.length !== 0) {
 			    //feature 생성
    			for(i=0; i<response.LayerList.length;i++){
    				var mtsoTypCd = response.LayerList[i].mtsoTypCd;
    				if(mtsoTypCd =="1"){ //1
    					style = 'SUBMIT_SETL_PCE_STYLE_POINT_2';
    				}else if(mtsoTypCd =="2"){ //2
    					style = 'SUBMIT_SETL_PCE_STYLE_POINT_3';
    				}else if(mtsoTypCd =="3"){ //3
    					style = 'SUBMIT_SETL_PCE_STYLE_POINT_4';
    				}else if(mtsoTypCd =="4"){ //3
    					style = 'SUBMIT_SETL_PCE_STYLE_POINT_1';
    				}
//    				var marker = L.marker([response.LayerList[i].mtsoLatVal, response.LayerList[i].mtsoLngVal]);
//    				mtsoBulLayer.addLayer(marker);
    				var param = {};
			    	param.type = 'Point';
			    	param.style = style;
			    	param.mgmtNo = response.LayerList[i].mtsoId;
			    	param.coord =[response.LayerList[i].mtsoLngVal,response.LayerList[i].mtsoLatVal];
			    	result.features.push(_M.createFeature(param));
    			}
    		}
    		//데이터 넣어주기
    		mtsoBulLayer.addData(result);
    		if($('#checkMtsoNm').is(':checked')){
    			drawTitle(response);
    		}else{
    			mtsoLayerLabel.clearLayers();
    		}
    		//화면에표시
    		//window.mgMap.fitBounds(mtsoBulLayer.getBounds());
    	}

    	if(flag == 'searchguMtsoInf'){
			//선택된 이벤트레이어 초기화
			//window.mgMap.clearSelectLayer();
			L.SelectLayer.getInstance().clearSelectLayer();
			//국사표시
			var mtsoInfLayer = window.mtsoInfLayer;
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();
	        //var marker = L.marker([response.LayerList[0].mtsoLatVal, response.LayerList[0].mtsoLngVal], {radius:20});
	        var marker = new L.OLMarker({lat:response.LayerList[0].mtsoLatVal, lng:response.LayerList[0].mtsoLngVal}, {radius:20});
	        const exists = window.mgMap.map.getLayers().getArray().includes(mtsoInfLayer);
	        if(!exists){
	        	window.mgMap.map.addLayer(mtsoInfLayer);
	        }

	        mtsoInfLayer.addLayer(marker.getFeature());
	        window.mgMap.map.render();

			var mtsoId = response.LayerList[0].mtsoId;

    		//국사ID가 없을 경우
    		if (mtsoId == null || mtsoId == "") {
    			//국사정보팝업
 				var html =
 		            '<b>경도    :</b><%pop_mtsoLatVal%><br>'+
 		            '<b>위도    :</b><%pop_mtsoLngVal%>';
 		        html = html.replace('<%pop_mtsoLatVal%>',response.LayerList[0].mtsoLatVal);
 		        html = html.replace('<%pop_mtsoLngVal%>',response.LayerList[0].mtsoLngVal);
 		        //marker.bindPopup(html).openPopup();
 		        mtsoInfLayer.bindPopup(html);
		        const lonLat = [response.LayerList[0].mtsoLngVal, response.LayerList[0].mtsoLatVal];
		        const coord5179 = ol.proj.transform(lonLat, 'EPSG:4326','EPSG:5179');
		        mtsoInfLayer.setPopupCoordinate(coord5179);
		        mtsoInfLayer.openPopup();

 		        //장비리스트 클리어
 		        $('#eqpListGrid').alopexGrid('dataEmpty');
 			}else{//국사ID가 있는 경우
 				//국사정보팝업
 				var html =
 		            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
 		            '<b>국사ID:</b><%pop_mtsoId%><br>'+
 		            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
 		            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
 		            '<b>건물주소:</b><%pop_bldAddr%>';
 		        html = html.replace('<%pop_mtsoNm%>',response.LayerList[0].mtsoNm);
 		        html = html.replace('<%pop_mtsoId%>',response.LayerList[0].mtsoId);
 		        html = html.replace('<%pop_mtsoTyp%>',response.LayerList[0].mtsoTyp);
 		        html = html.replace('<%pop_mtsoStat%>',response.LayerList[0].mtsoStat);
 		        html = html.replace('<%pop_bldAddr%>',response.LayerList[0].bldAddr);
 		        //marker.bindPopup(html).openPopup();
 		        mtsoInfLayer.bindPopup(html);
 		        const lonLat = [response.LayerList[0].mtsoLngVal, response.LayerList[0].mtsoLatVal];
 		        const coord5179 = ol.proj.transform(lonLat, 'EPSG:4326','EPSG:5179');
 		        mtsoInfLayer.setPopupCoordinate(coord5179);
 		        mtsoInfLayer.openPopup();

 				//메뉴등장
 		        //showLeftContainer();
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
 		    		var eqpRoleDivCdList = ($("#eqpRoleDivCdList1").val() == null) ? getMultiSelect("eqpRoleDivCdList1", "value", "") : getMultiSelect("eqpRoleDivCdList1", "value", ":selected");
 	 		   		var param = new URLSearchParams();
 	 		   		param.append("mtsoId", mtsoId);
 	 		   		_.each(eqpRoleDivCdList, function(data){
 	 		   			param.append("eqpRoleDivCdList", data);
 	 		   		});

 					$('#eqpListGrid').alopexGrid('showProgress');
 		 			httpRequest('tango-transmission-tes-biz2/transmisson/tes/topology/getEqpList', param.toString(), 'GET', 'searchEqpList');
 		    	//주변국사리스트에 없으면 지도이동하고 새로 주변링과 주변국사 조회
 		    	}else{
 		    		//가운데로 이동시키고
// 		    		window.mgMap.setView([response.LayerList[0].mtsoLatVal, response.LayerList[0].mtsoLngVal],window.mgMap.getZoom());
 		    	//	window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], 13);
 		    		//반경거리 표시해주고
 			        if (circleRange != 0){
 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 			        distance_circle_layer.clearLayers();
 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
 					    distance_circle_layer.addLayer(distance_circle);
 			        }
 		    		//주변국사조회
 			   //     searchAroundMtso(mtsoId);
 			        //주변링조회
 			     //   searchAroundRing();
 		    	}

		        // 우클릭시 국사 정보 레이어 표시
 		    	marker.mtsoId = mtsoId;
 		    	marker.mtsoTypCd = response.LayerList[0].mtsoTypCd;
 		    	contextItems = LayerTreeControl.getSelectedMtsoInfItemList(mgMap, marker);
//				window.mgMap.setSelectedItemContextMenu(contextItems, true);
 		    	L.ContextMenuManager.getInstance().setSelectedItemContextMenu(contextItems, true);

				//marker.getPopup().on('remove', function(e) {
// 		    	mtsoInfLayer.getPopup().on('remove', function(e) {
//					mtsoInfLayer.clearLayers();
//				});
 			}
		}

    	//유선커버리지 설계 조회결과
    	if(flag == "selectCoverageDsn"){

    		$('#'+gridId5).alopexGrid('hideProgress');
    		var serverPageinfo = {
    	      		dataLength  : response.totalCnt, 	//총 데이터 길이
          	};
           	$('#'+gridId5).alopexGrid('dataSet', response.resultList, serverPageinfo);
           	$('#'+gridId5).alopexGrid("viewUpdate");

           	if(selCovDsnList.length > 0){

           		var tmpData = $('#' + gridId5).alopexGrid("dataGet");

           		_.each(tmpData, function(row, idx){
           			if(selCovDsnList.includes(row.coverageId)){
           				$('#' + gridId5).alopexGrid('rowSelect', {_index: {row:idx}}, true);
           			}

           		});

           		selCovDsnList = [];
           		$('#btnNodeModCancel').hide();
           		$('#btnNodeMod').show();
           	}

//           	$('#'+gridId5).alopexGrid('focusRestore',gridId5FocusInfo);

           	var selectData = AlopexGrid.trimData($('#'+gridId5).alopexGrid("dataGet" , {_state : {selected:true}}));
    		if(selectData.length > 0){
    			Util.clearLayerFunc(covDsnLayer);
    			Util.clearLayerFunc(covDsnLayerLabel);

    			drawPolygonLayer(selectData, covDsnLayer, gridId5);
    			drawPolygonLabel(selectData, covDsnLayerLabel);
    		}
    	}

    	//유선커버리지 조회결과
    	if(flag == "selectCoverage"){
    		$('#'+gridId6).alopexGrid('hideProgress');
    		var serverPageinfo = {
    	      		dataLength  : response.totalCnt, 	//총 데이터 길이
          	};
           	$('#'+gridId6).alopexGrid('dataSet', response.resultList, serverPageinfo);
    	}

    	if(flag == "updateCoverageDsnGeometry") {
    		$('#'+gridId5).alopexGrid('hideProgress');

    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
            	callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
            		if (msgRst == 'Y') {
            			//그리드 재조회
            			setCoverageDsnGrid();
            			$('#btnNodeModCancel').hide();
                		$('#btnNodeMod').show();
            		}
            	});
    		}
    	}

    	if(flag == "searchRpetrOfBmtso"){
    		var layer = mgMap.getCustomLayerByName("SKT_RPETR");
    		if(!layer) {
    			layer = mgMap.addCustomLayerByName("SKT_RPETR", {selectable: false});
    		}

    		//레이어초기화
    		layer.clearLayers();
    		//features 변수 설정
    		var result = {features: []};
    		//layerList 확인
    		if (response.LayerList.length !== 0) {
 			    //feature 생성
    			for(i=0; i<response.LayerList.length;i++){
    				var param = {};
			    	param.type = 'Point';
			    	param.style = 'SUBMIT_SETL_PCE_STYLE_POINT_1'; //중계기
			    	param.mgmtNo = response.LayerList[i].mtsoId;
			    	param.coord =[response.LayerList[i].mtsoLngVal,response.LayerList[i].mtsoLatVal];
			    	result.features.push(_M.createFeature(param));
    			}
    		}
    		//데이터 넣어주기
    		layer.addData(result);
    	}

    	if(flag == "copyCoverageGeometry") {
    		$('#'+gridId6).alopexGrid('hideProgress');

    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    			});
    		}else{
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){
    			});
    		}
    	}

    	if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCdList1').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#eqpRoleDivCdList1').setData({
                 data:option_data
    		});

    		eqpRoleDivCdGridColList = option_data; //주변국사 및 장비 그리드컬럼 초기 세팅용

    		//그리드 컬럼 세팅을 위해 호출 필요
    		initGrid();
    	}

		// 서비스 회선에서 사용하는 대분류, 소분류, 회선유형 코드
		if(flag == 'svlnLclSclCodeData') {
			svlnLclSclCodeData = response;
			var svlnLclCd_option_data =  [];
			var tmpFirstSclCd = "";
			for(i=0; i<response.svlnLclCdList.length; i++){
				var dataL = response.svlnLclCdList[i];
				if(i==0){
					tmpFirstSclCd = dataL.value;
				}
				svlnLclCd_option_data.push(dataL);

			}
			$('#svlnLclCd').clear();
			$('#svlnLclCd').setData({data : svlnLclCd_option_data});

			var svlnSclCd_option_data =  [];
			var svlnSclCd2_option_data =  [];

			var tmpSvlnLclCd = $('#svlnLclCd').val();
			for(k=0; k<response.svlnSclCdList.length; k++){

				if(k==0 && (tmpFirstSclCd =="005" || tmpFirstSclCd == "001")){
					var dataFst = {"uprComCd":"","value":"","text":"전체"};
					svlnSclCd_option_data.push(dataFst);
					svlnSclCd2_option_data.push(dataFst);
				}

				var dataOption = response.svlnSclCdList[k];
				if(nullToEmpty(tmpSvlnLclCd) == nullToEmpty(dataOption.uprComCd)
				) {
					svlnSclCd_option_data.push(dataOption);
				}

				svlnSclCd2_option_data.push(dataOption);

			}
			svlnSclCdData = svlnSclCd2_option_data;

			$('#svlnSclCd').clear();
			$('#svlnSclCd').setData({data : svlnSclCd_option_data});
		}

		let statisticTab = "tab-8";
    	if(flag == 'teqpcnt'){
			$('#'+statisticTab).setData(response.teqp[0]);
			$('#tT').progress().remove();
		}
		if(flag == 'aeqpcnt'){
			$('#'+statisticTab).setData(response.aeqp[0]);
			$('#tA').progress().remove();
		}
		if(flag == 'fcltcnt'){
			$('#'+statisticTab).setData(response.fcltlnst[0]);
		}
		if(flag == 'svlncnt'){
			$('#'+statisticTab).setData(response.svln[0]);
			$('#tLn').progress().remove();
		}
		if(flag == 'linecnt'){
			$('#tLnn').progress().remove();
			$('#'+statisticTab).setData(response.line[0]);
		}
		if(flag == 'seqpcnt'){
			$('#'+statisticTab).setData(response.seqp[0]);
			$('#tS').progress().remove();
		}

		if(flag == 'distancecnt'){
			$('#'+gridId7).alopexGrid('hideProgress');
			$('#'+gridId7).alopexGrid('dataSet', response.distance);
		}
		if(flag == 'floorSearch'){
			$('#'+gridId7Floor).alopexGrid('hideProgress');
			$('#'+gridId7Floor).alopexGrid('dataSet', response.floorList);
		}

		if(flag == 'coverageStc'){
			if(response.status != "OK") {
				$('#tab-8').progress().remove();
				callMsgBox('','I', "엑셀 다운로드에 실패하였습니다." , function(msgId, msgRst){});
			} else {
				excelDownload(response);
			}
		}

		if(flag == 'afeYr1'){
			$('#afeYr1').clear();
			let option_data =  [];
			let stdAfeYr = "";
			for(let i = 0; i < response.length; i++){
				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}

			$('#afeYr1').setData({data:option_data,afeYr:stdAfeYr});

			selectAfeDemdDgrCode('afeDemdDgr1', {afeYr:stdAfeYr});
		}

		if(flag == 'afeDemdDgr1'){
			$('#afeDemdDgr1').clear();
			let option_data =  [{cd: '', cdNm: '전체'}];
			let stdAfeYr = "";
			for(let i=0; i<response.length; i++){
				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}
			$('#afeDemdDgr1').setData({data:option_data,afeDemdDgr:stdAfeYr});
		}

		if(flag == 'eqpDivCd1'){
			let mEqpDivCmb = response.mainLgc

			let option_data =  [{cd: "", cdNm: "전체"}];
			for(let i = 0; i<mEqpDivCmb.length; i++){
				option_data.push({cd: mEqpDivCmb[i].cd, cdNm: mEqpDivCmb[i].cdNm});
			}

			$('#eqpDivCd1').setData({data:option_data});
		}

		if(flag == 'afeYr2'){
			$('#afeYr2').clear();
			let option_data =  [];
			let stdAfeYr = "";
			for(let i = 0; i < response.length; i++){
				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}

			$('#afeYr2').setData({data:option_data,afeYr:stdAfeYr});

			selectAfeDemdDgrCode('afeDemdDgr2', {afeYr:stdAfeYr});
		}

		if(flag == 'afeDemdDgr2'){
			$('#afeDemdDgr2').clear();
			let option_data =  [{cd: '', cdNm: '전체'}];
			let stdAfeYr = "";
			for(let i=0; i<response.length; i++){
				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}
			$('#afeDemdDgr2').setData({data:option_data,afeDemdDgr:stdAfeYr});
		}

		if(flag == 'eqpDivCd2'){
			let mEqpDivCmb = response.mainLgc

			let option_data =  [{cd: "", cdNm: "전체"}];
			for(let i = 0; i<mEqpDivCmb.length; i++){
				option_data.push({cd: mEqpDivCmb[i].cd, cdNm: mEqpDivCmb[i].cdNm});
			}

			$('#eqpDivCd2').setData({data:option_data});
		}

		if(flag == 'afeYr11'){
			$('#afeYr11').clear();
			let option_data =  [];
			let stdAfeYr = "";
			for(let i = 0; i < response.length; i++){
				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}

			$('#afeYr11').setData({data:option_data,afeYr:stdAfeYr});

			selectAfeDemdDgrCode('afeDemdDgr11', {afeYr:stdAfeYr});
		}

		if(flag == 'afeDemdDgr11'){
			$('#afeDemdDgr11').clear();
			let option_data =  [{cd: '', cdNm: '전체'}];
			let stdAfeYr = "";
			for(let i=0; i<response.length; i++){
				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}
			$('#afeDemdDgr11').setData({data:option_data,afeDemdDgr:stdAfeYr});
		}


		if(flag == 'searchWreDsnList'){
			$('#'+gridId9).alopexGrid('hideProgress');
			let serverPageinfo = {
					dataLength  : response.pager.totalCnt, 	//총 데이터 길이
		      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
		      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};

			$('#'+gridId9).alopexGrid('dataSet', response.dataList, serverPageinfo);
		}

		if(flag == 'searchWreDsnRsltList'){
			$('#'+gridId10).alopexGrid('hideProgress');
			let serverPageinfo = {
					dataLength  : response.pager.totalCnt, 	//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};

			$('#'+gridId10).alopexGrid('dataSet', response.dataList, serverPageinfo);
		}

		if(flag == 'searchWreDsnRsltRouteanList'){
			$('#'+gridId10Routean).alopexGrid('hideProgress');
			let serverPageinfo = {
					dataLength  : response.pager.totalCnt, 	//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};

			$('#'+gridId10Routean).alopexGrid('dataSet', response.dataList, serverPageinfo);
		}

		if(flag == 'selectMtsoInvtSmltInfList'){


			$('#'+gridId11).alopexGrid('hideProgress');
			let serverPageinfo = {
					dataLength  : response.pager.totalCnt, 	//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};

			$('#'+gridId11).alopexGrid('dataSet', response.dataList, serverPageinfo);
		}

		if(flag == 'selectMtsoInvtSmltBasList'){


			$('#'+gridId11Bas).alopexGrid('hideProgress');
			let serverPageinfo = {
					dataLength  : response.pager.totalCnt, 	//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};


			$('#'+gridId11Bas).alopexGrid('dataSet', response.dataList, serverPageinfo);
			//구분이 통합인 row만 조회하여 자동 선택을 시킨다
			let dataList = $('#'+gridId11Bas).alopexGrid("dataGet", {"intgDivVal":"INTG"});
			_.each(dataList, function(data, idx){
				let rowIdx = data._index.row;
				$('#'+gridId11Bas).alopexGrid('rowSelect', {_index: {row:rowIdx}}, true);
			});

			MtsoInvtSlmtControl.drawMtsoInvtCoverage(mtsoInvtSlmtCoverLayer, gridId11Bas);
			MtsoInvtSlmtControl.drawMtsoInvtCoverageLabel(mtsoInvtSlmtCoverLabelLayer, gridId11Bas);
		}
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
    function drawRingLayerThatCanBeSelected(gisRingInf, layerId, flag, alertFlag=false){

    	if(gisRingInf.ringLatLng.length > 0){
    		var ringMgmtNo = gisRingInf.ringMgmtNo;
        	var ringLatLng = gisRingInf.ringLatLng;
        	var lineStyle = null;
        	if(layerId.startsWith("RING_MAP_LAYER") || layerId.startsWith("LINE_MAP_LAYER")){//링조회, 회선조회에서 온거면 핑크링
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

    		if(flag != "mtsoData") {
    			//window.mgMap.clearSelectLayer();/*select된 레이어들 clear*/
    			L.SelectLayer.getInstance().clearSelectLayer();
    		}

            var ringInfPopupLayer = window.ringInfPopupLayer;
            //ringInfPopupLayer.closePopup(); //링정보팝업 닫아주고
       		ringInfPopupLayer.clearLayers();//링정보팝업레이어 clear

    		var ringLayer = window.mgMap.getCustomLayerByName(layerId);
    		if(ringLayer) {//레이어 있으면 초기화
    			ringLayer.clearLayers();
            }else{//레이어 없으면 새로 생성-선택가능한 레이어로
            	ringLayer = window.mgMap.addCustomLayerByName(layerId, {selectable: true});
            }

    		if(flag == "mtsoData") {
    			for(var i=0; i<ringLatLng.length; i++){
    				let feature = { features :[{ type : 'Feature',
    						                    mgmtNo : ringMgmtNo,
    						                    geometry : {
    						                    type : 'LineString',
    						                    coordinates :  JSON.parse("["+ringLatLng[i]+"]")
    						                },
    						                style : [{id: lineStyle}]
    						            }
    						        ]
    						    };
    				ringLayer.addData(feature);//생성한 feature 추가
    			}
    		} else {
    			ringLayer.addData(result);//생성한 feature 추가
    		}
    		//주변링레이어 그룹에 포함
     		var rangeRingLayerGroup = window.rangeRingLayerGroup;
     		rangeRingLayerGroup.addLayer(ringLayer);

            //링조회에서 넘어온 링그리기는 feature의 전체 영역으로 지도이동
    		if(layerId.startsWith("RING_MAP_LAYER")){
    			const sidebarWidth = $('#engmap_left_panel').outerWidth();
    			const offsetX = sidebarWidth / 2 ;

    			window.mgMap.map.once('moveend',() =>{
    				if(sidebarWidth > 100 && $('#left-menu_btn').hasClass('left-footer__close')){
        				//window.mgMap.panBy([offsetX, 0], {animate:false});
    					console.log('moveend');
        				window.mgMap.panBy(+offsetX, 0);
        			}
    			});
    			window.mgMap.fitBounds(ringLayer.getBounds(),window.mgMap.getZoom());

    		}
    	} else {
    		if(!alertFlag) {
    			callMsgBox('','W', '맵에 표시할 링/회선 정보가 존재하지 않습니다.', function(msgId, msgRst){});
    		}
		}
    }

    function selectAfeDemdDgrCode(objId, param) {

		httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeDemdDgrlist', param, 'GET', objId);
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
    	if(flag == 'coverageStc'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail']+"01" , function(msgId, msgRst){});
		}
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

    	//유선커버리지 설계 조회결과
    	if(flag == "selectCoverageDsn"){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	//유선커버리지 조회결과
    	if(flag == "selectCoverage"){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == "copyCoverageGeometry"){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'selectMtsoInvtSmltInfList'){
			$('#'+gridId11).alopexGrid('hideProgress');
			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
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
    		});
    		$('#sido').on('change', function(e){
    			var id = $(e.target).val();
    			setArea(id);
    			if(id == 0){
    				$('#area').attr('disabled', true);
    			}else{
    				$('#area').attr('disabled', false);
    			}
    		});
    	});
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
    		});

    		$('#area').on('change', function(e){
    			//해당 좌표로 이동
    			window.mgMap.setView([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x]);
    			//window.mgMap.setView([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x], 13);
    			//반경거리 표시해주고
		        if (circleRange != 0){
		        	var distance_circle_layer = window.distanceCircleLayer;
 			        distance_circle_layer.clearLayers();
				    var distance_circle = L.circle([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x], parseInt(circleRange));
				    distance_circle_layer.addLayer(distance_circle);
		        }
    		});
    	});
    }

    /*==========================*
	 * select 조회조건 코드 세팅
	 *==========================*/
    function setSelectCode() {
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/tmofs/SKT', null, 'GET', 'tmof'); //전송실
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/tmofs/SKB', null, 'GET', 'tmof'); //전송실
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/getNtwkTypCdList', null, 'GET', 'NtwkTypData'); // 망구분 데이터
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/getTopoList', null, 'GET', 'TopoData'); // 링유형 데이터
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/group/C00186', null, 'GET', 'mtsoStat'); //국사 상태
    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm'); // 관리 그룹

    	httpRequest('tango-transmission-tes-biz2/transmisson/tes/configmgmt/cfline/serviceline/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');	// 회선 대/소분류 코드

    	var mgmtSelected = $("#mgmtGrpYn").val();
    	if(!mgmtSelected) mgmtSelected = "SKT";

		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/eqpRoleDiv/C00148/'+ mgmtSelected, null, 'GET', 'eqpRoleDivCd'); // 장비타입

    	var option_data =  null;
    	if(mgmtSelected == "SKT"){
    		option_data =  [{comCd: "1",comCdNm: "전송실"}, {comCd: "2",comCdNm: "중심국사"}, {comCd: "3",comCdNm: "기지국사"}, {comCd: "4",comCdNm: "국소"}];
    	}
    	else if(mgmtSelected == "SKB"){
    		option_data =  [{comCd: "1",comCdNm: "정보센터"}, {comCd: "2",comCdNm: "국사"}, {comCd: "4",comCdNm: "국소"}];
    	}
    	$('#mtsoTypCdList1').clear();
		$('#mtsoTypCdList1').setData({data:option_data});

    	var option_data1 =  null;
    	if(mgmtSelected == "SKT"){
    		option_data1 =  [{comCd: "5G",comNm: "5G"}, {comCd: "LTE",comNm: "LTE"}];
    	}
    	else if(mgmtSelected == "SKB"){
    		option_data1 =  [{comCd: "5G",comNm: "5G"}, {comCd: "LTE",comNm: "LTE"}];
    	}

    	$('#coverageTypList6').setData({data:option_data1});

    	//유선망 통합설계 추가
    	httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', null, 'GET', 'afeYr1');
    	httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', null, 'GET', 'eqpDivCd1');
    	httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', null, 'GET', 'afeYr2');
    	httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', null, 'GET', 'eqpDivCd2');
    	httpRequest('tango-transmission-tes-biz2/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', null, 'GET', 'afeYr11');

    }

    /*===============================*
	 * 왼쪽 컨테이너 등장
	 *===============================*/
    function showLeftContainer() {
	    mContainer.style.marginLeft = targetX + "px";
	    document.all.leftImage.src = "../../resources/images/img_menu_close.png";
		sideTabToggle = true;
    }

    /*===============================*
     * 왼쪽 컨테이너 등장
     *===============================*/
    function showRightContainer() {
    	mContainer2.style.marginRight = targetX2 + "px";
    	document.all.rightImage.src = "../../resources/images/img_menu_open.png";
	    sideTabToggle2 = true;
    }

    /*==========================*
	 * 사용자 레이어 스타일
	 *==========================*/
    function addUserLayerStyles() {
	    var styles = [
	        {
	            id : 'STYLE_RING_STRONG_BLACK_LINE',
	            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#000000', //선색상
	            	weight : 5         //선두께
	            }
	        },{
	            id : 'STYLE_RING_STRONG_PINK_LINE',
	            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#FF00DD', //선색상
	            	weight : 5         //선두께
	            }
	        },{
	            id : 'STYLE_RING_POPUP_LINE',
	            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
	            options : {
	                opacity: 1,        //투명도
	                color : '#050099', //선색상
	            	weight : 4         //선두께
	            }
	        },{//국소
        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_1',
	            type : L.StyleConfig().STYLE_TYPE.POINT,
				options: {
					opacity: 1.0,
					markerType: 'icon',
					iconUrl: '../../resources/images/ico_layer_r.png',
					iconSize : [ 10, 10 ],
					iconAnchor : [ 7, 7 ]
				}
	        },{//전송실
        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_2',
	            type : L.StyleConfig().STYLE_TYPE.POINT,
				options: {
					opacity: 1.0,
					markerType: 'icon',
					iconUrl: '../../resources/images/T_tmof.png',
					iconSize : [ 15, 15 ],
					iconAnchor : [ 7, 7 ]
				}
	        },{//중심국 국사
	        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_3',
		            type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/T_cif.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
		        },{//skt기지국
		        	   id : 'SUBMIT_SETL_PCE_STYLE_POINT_4',
			            type : L.StyleConfig().STYLE_TYPE.POINT,
						options: {
							opacity: 1.0,
							markerType: 'icon',
							iconUrl: '../../resources/images/T_btmso.png',
							iconSize : [ 15, 15 ],
							iconAnchor : [ 7, 7 ]
						}
		        },{
					id : 'MTSO_COV_DSN_LAYER',
					type : L.StyleConfig().STYLE_TYPE.POLYGON, // 폴리곤 타입
					options : {
						color : '#00570E',
			            weight : 3,
			            opacity : 1,
			            fill : true,
			            isStroke: true,
			            fillColor : '#00570E',
			            fillOpacity : 0.1
					}
				}, {
					id : 'H_MTSO_COV_DSN_LAYER',
					type : L.StyleConfig().STYLE_TYPE.POLYGON, // 폴리곤 타입
					options : {
						color : '#35B34A',
			            weight : 3,
			            opacity : 1,
			            fill : true,
			            isStroke: true,
			            fillColor : '#35B34A',
			            fillOpacity : 0.1
					}
				}, {
					id : 'MTSO_5G_COV_LAYER',
					type : L.StyleConfig().STYLE_TYPE.POLYGON, // 폴리곤 타입
					options : {
						color : '#5D5DDC',
			            weight : 3,
			            opacity : 1,
			            fill : true,
			            isStroke: true,
			            fillColor : '#5D5DDC',
			            fillOpacity : 0.1
					}
				}, {
					id : 'MTSO_LTE_COV_LAYER',
					type : L.StyleConfig().STYLE_TYPE.POLYGON, // 폴리곤 타입
					options : {
						color : '#DC8484',
			            weight : 3,
			            opacity : 1,
			            fill : true,
			            isStroke: true,
			            fillColor : '#DC8484',
			            fillOpacity : 0.1
					}
				}, {
					id: "MTSO_COV_DSN_LABEL",
					type: L.StyleConfig().STYLE_TYPE.TEXT,
					options: {
						labelColumn: 'coverageTerrNm',
						// text:'',
		                faceName: '돋움',
		                size: '18',
		                color: '#00570E',
		                hAlign: 'middle',
		                vAlign: 'middle',
		                weight: 'bold',
		                opacity : 1,
		                isBox : true,
		                boxColor : '#00570E',
		                boxWidth : 2,
		                boxBgColor : '#ffffff',
		                bgBoxColor: '#ffffff'
					}
				}, {
					id: "MTSO_COV_LABEL",
					type: L.StyleConfig().STYLE_TYPE.TEXT,
					options: {
						labelColumn: 'mtsoNm',
						// text:'',
		                faceName: '돋움',
		                size: '18',
		                color: '#00570E',
		                hAlign: 'middle',
		                vAlign: 'middle',
		                weight: 'bold',
		                opacity : 1,
		                isBox : true,
		                boxColor : '#00570E',
		                boxWidth : 2,
		                boxBgColor : '#ffffff',
		                bgBoxColor: '#ffffff'
					}
				}, {
					id: "MTSO_5G_COV_LABEL",
					type: L.StyleConfig().STYLE_TYPE.TEXT,
					options: {
						labelColumn: 'mtsoNm',
						// text:'',
		                faceName: '돋움',
		                size: '18',
		                color: '#5D5DDC',
		                hAlign: 'middle',
		                vAlign: 'middle',
		                weight: 'bold',
		                opacity : 1,
		                isBox : true,
		                boxColor : '#5D5DDC',
		                boxWidth : 2,
		                boxBgColor : '#ffffff',
		                bgBoxColor: '#ffffff'
					}
				}, {
					id: "MTSO_LTE_COV_LABEL",
					type: L.StyleConfig().STYLE_TYPE.TEXT,
					options: {
						labelColumn: 'mtsoNm',
						// text:'',
		                faceName: '돋움',
		                size: '18',
		                color: '#DC8484',
		                hAlign: 'middle',
		                vAlign: 'middle',
		                weight: 'bold',
		                opacity : 1,
		                isBox : true,
		                boxColor : '#DC8484',
		                boxWidth : 2,
		                boxBgColor : '#ffffff',
		                bgBoxColor: '#ffffff'
					}
				}, {
					id : 'MTSO_COV_DSN_H_LAYER',
					type : L.StyleConfig().STYLE_TYPE.POLYGON, // 폴리곤 타입
					options : {
						color : '#35B34A',
			            weight : 3,
			            opacity : 1,
			            fill : true,
			            isStroke: true,
			            fillColor : '#00570E',
			            fillOpacity : 0.1
					}
				},{
					id : "KEPCO_TLPL_TEXT",
					type : L.StyleConfig().STYLE_TYPE.TEXT, // 텍스트 타입
					options : {
						labelColumn : "LABEL",
						faceName : "돋움",
						size : "12",
						color : "blue",
						hAlign : "midlle",
						vAlign : "top",
						opacity : 1.0,
					}

		        },{//ROADM & OTN(중심국)
	        	   id : 'NODE_NETWORK_POINT_01',
		            type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/netbdgm/RONT01.png',
						iconSize : [ 25, 25 ],
						iconAnchor : [ 15, 15 ],
						realSize : [ 50, 50 ],
					}
		        },{//ROADM & OTN(전송실)
	        	   id : 'NODE_NETWORK_POINT_02',
		            type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/netbdgm/RONT02.png',
						iconSize : [ 25, 25 ],
						iconAnchor : [ 15, 15 ],
						realSize : [ 50, 50 ],
					}
		        },{//ROADM(IX상접)
	        	   id : 'NODE_NETWORK_POINT_03',
		            type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/netbdgm/RONT03.png',
						iconSize : [ 25, 25 ],
						iconAnchor : [ 15, 15 ],
						realSize : [ 50, 50 ],
					}
		        },{//ROADM(중심국)
	        	   id : 'NODE_NETWORK_POINT_04',
		            type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/netbdgm/RONT04.png',
						iconSize : [ 25, 25 ],
						iconAnchor : [ 15, 15 ],
						realSize : [ 50, 50 ],
					}
		        },{//ILA(광 중계기)
		        	   id : 'NODE_NETWORK_POINT_05',
			            type : L.StyleConfig().STYLE_TYPE.POINT,
						options: {
							opacity: 1.0,
							markerType: 'icon',
							iconUrl: '../../resources/images/netbdgm/RONT05.png',
							iconSize : [ 25, 25 ],
							iconAnchor : [ 15, 15 ],
							realSize : [ 50, 50 ],
						}
		        },{//MW(도서)
		        	   id : 'NODE_NETWORK_MW_01',
			            type : L.StyleConfig().STYLE_TYPE.POINT,
						options: {
							opacity: 1.0,
							markerType: 'icon',
							iconUrl: '../../resources/images/netbdgm/MW01.png',
							iconSize : [ 25, 25 ],
							iconAnchor : [ 15, 15 ],
							realSize : [ 50, 50 ],
						}
		        },{//MW(산간)
		        	   id : 'NODE_NETWORK_MW_02',
			            type : L.StyleConfig().STYLE_TYPE.POINT,
						options: {
							opacity: 1.0,
							markerType: 'icon',
							iconUrl: '../../resources/images/netbdgm/MW02.png',
							iconSize : [ 25, 25 ],
							iconAnchor : [ 15, 15 ],
							realSize : [ 50, 50 ],
						}
		        }, {
					id: "NODE_NETWORK_MTSO_LABEL",
					type: L.StyleConfig().STYLE_TYPE.TEXT,
					options: {
						labelColumn: 'LABEL',
			            faceName: '돋움',
			            size: '15',
			            color: 'BLACK',
			            hAlign: 'middle',
			            vAlign: 'middle',
			            weight: 'bold',
			            isBox : true,       //라벨의 테두리 사용 여부
			            boxColor : '#00570E',
			            opacity : 0.7,
					}
				}, {
		            id : 'STYLE_NODE_LINK_BLACK_LINE',
		            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
		            options : {
		                opacity: 1,        //투명도
		                color : '#000000', //선색상
		            	weight : 2         //선두께
		            }
		        }, {
		            id : 'STYLE_MTSO_LINK_RED_LINE',
		            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
		            options : {
		                opacity: 1,        //투명도
		                color : '#F43030', //선색상
		            	weight : 2         //선두께
		            }
		        },
		        {//SKT_전송실
		        	id : 'STYLE_CFG_T_TMOF_POINT',
			        type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/T_전송실.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
			    },
		        {//SKT_중심국
		        	id : 'STYLE_CFG_T_COFC_POINT',
			        type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/T_중심국.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
			    },
		        {//SKT_기지국
		        	id : 'STYLE_CFG_T_BMTSO_POINT',
			        type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/T_기지국.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
			    },
		        {//SKT_국소
		        	id : 'STYLE_CFG_T_SMTSO_POINT',
			        type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/T_국소.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
			    },
		        {//SKB_정보센터
		        	id : 'STYLE_CFG_B_INF_CNTR_POINT',
			        type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/B_정보센터.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
			    },
		        {//SKB_국사
		        	id : 'STYLE_CFG_B_MTSO_POINT',
			        type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/B_국사.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
			    },
		        {//SKB_국소
		        	id : 'STYLE_CFG_B_SMTSO_POINT',
			        type : L.StyleConfig().STYLE_TYPE.POINT,
					options: {
						opacity: 1.0,
						markerType: 'icon',
						iconUrl: '../../resources/images/B_국소.png',
						iconSize : [ 15, 15 ],
						iconAnchor : [ 7, 7 ]
					}
			    },
			    {
					id : "CFG_MTSO_MTSO_LABEL",
					type : L.StyleConfig().STYLE_TYPE.TEXT, // 텍스트 타입
					options : {
						labelColumn: 'LABEL',
			            faceName: '돋움',
			            size: '15',
			            color: 'BLACK',
			            hAlign: 'middle',
			            vAlign: 'middle',
			            weight: 'bold',
			            isBox : true,       //라벨의 테두리 사용 여부
			            boxColor : '#00570E',
			            opacity : 0.7,
					}
		        }, {
		            id : 'STYLE_OPT_LN_LINK_RED_LINE',
		            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
		            options : {
		                opacity: 1,        //투명도
		                color : 'BLUE',    //선색상
		            	weight : 4,        //선두께
		            	outline:{          //외곽선
		            		color:'black',
		            		weight: 6,
		            		lineCap: 'round'
		            	}
		            }
		        }, {//예비선로 색 지정
		            id : 'STYLE_OPT_LN_LINK_SPR_LINE',
		            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
		            options : {
		                opacity: 1,        //투명도
		                color : '#FF9900', //선색상
		            	weight : 4,        //선두께
		            	outline:{          //외곽선
		            		color:'black',
		            		weight: 6,
		            		lineCap: 'round'
		            	}
		            }
		        }, {
		            id : 'STYLE_RING_LN_LINK_RED_LINE',
		            type : L.StyleConfig().STYLE_TYPE.LINE, //라인타입
		            options : {
		                opacity: 1,        //투명도
		                color : '#FF00FF', //선색상
		            	weight : 4,         //선두께
		            	outline:{          //외곽선
		            		color:'black',
		            		weight: 6,
		            		lineCap: 'round'
		            	}
		            }
		        }
	    ];

	    var rValue = [0xFF, 0xEF, 0xDF, 0xCF, 0xBF, 0xAF, 0x9F, 0x8F];
	    var gValue = [0xAF, 0x8F, 0x6F, 0x4F];
	    var bValue = [0xFF, 0xBF, 0x7F, 0x3F];

	    var totalColor = rValue.length * gValue.length * bValue.length;

		for(var i=0; i<totalColor; i++) {
			var rIndex = Math.floor(i / (gValue.length * bValue.length));
			var gIndex = Math.floor((i % (gValue.length * bValue.length)) / bValue.length);
			var bIndex = i % bValue.length;

			var rNum = rValue[rIndex];
			var gNum = gValue[gIndex];
			var bNum = bValue[bIndex];

			// 2자리 16진수 문자로 변환하고 대문자로 포멧
			var rHex = rNum.toString(16).padStart(2, '0').toUpperCase();
			var gHex = gNum.toString(16).padStart(2, '0').toUpperCase();
			var bHex = bNum.toString(16).padStart(2, '0').toUpperCase();

			var colorCode = `#${rHex}${gHex}${bHex}`;

    		var style = {
    					  id :'STYLE_ETE_LN_LINK_RED_LINE_' + i,
    					  type : L.StyleConfig().STYLE_TYPE.LINE,
    					  options : {
    			                opacity: 1,        //투명도
    			                color : colorCode, //선색상
    			            	weight : 4,         //선두께
    			            	outline:{          //외곽선
    			            		color:'black',
    			            		weight: 6,
    			            		lineCap: 'round'
    			            	}
    			            }
    		}
    		styles.push(style);
    	};

	    //시스템에 사용할 스타일 설정
	    L.StyleConfig().setCustomStyles(styles);

  	}

	/*==========================*
	 *  그리드 생성
	 *==========================*/
    function initGrid() {

    	var initOrgListColumn = [];
    	initOrgListColumn.push (
    			  {key : 'mtsoNm', align:'left', title : '국사명', width: '105px'}
    			, {key : 'mtsoId', title : '국사ID', width: '5px', hidden:true}
    			, {key : 'mtsoLatVal', title : '위도', width: '5px', hidden:true}
    			, {key : 'mtsoLngVal', title : '경도', width: '5px', hidden:true}
    			, {key : 'mtsoTyp', title : '국사유형', width: '5px', hidden:true}
    			, {key : 'mtsoStat', title : '국사상태', width: '5px', hidden:true}
    			, {key : 'bldAddr', title : '건물주소', width: '5px', hidden:true}
    	);

    	_.each(eqpRoleDivCdGridColList, function(row, idx){
    		initOrgListColumn.push(
    				{key : 'CD' + row.comCd, align:'center', title : row.comCdNm, width: '60px', defaultValue: 0}
    		);
    	});

        //주변국사 리스트
	    $('#orgListGrid').alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 보이게
               ,pagerTotal: true     //총 건수 보이게
               ,pagerSelect: true   //페이지당 줄수 선택   안보이게
               ,pagerCount: 3        //페이저카운터 5개씩
        	},
	    	headerRowHeight: 25,
	    	autoColumnIndex: true,
	    	height: '400px',
	    	columnFixUpto: 1,
	    	rowOption : {
	    		defaultHeight: 30
	    	},
	    	columnMapping: initOrgListColumn,
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //국사장비리스트 생성
	    $('#eqpListGrid').alopexGrid({
	    	headerRowHeight: 25,
	    	height: '300px',
	    	rowOption : {
	    		defaultHeight: 30
	    	},
	    	columnMapping: [{
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '90px'
			}, {
				key : 'eqpRoleDivNm', align:'center',
				title : '장비구분',
				width: '50px'
			}, {
				key : 'bpNm', align:'center',
				title : '제조사',
				width: '60px'
			}, {
				key : 'eqpMdlNm', align:'center',
				title : '모델',
				width: '80px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //주변링리스트
	    $('#rangeRingGrid').alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 보이게
               ,pagerTotal: true     //총 건수 보이게
               ,pagerSelect: true   //페이지당 줄수 선택   안보이게
               ,pagerCount: 3        //페이저카운터 5개씩
        	},
	    	rowOption : {
	    	defaultHeight: 35
	    	},
	    	headerRowHeight: 25,
	    	height: '400px',
	    	rowClickSelect: false,
	    	rowSingleSelect: false,
	    	autoColumnIndex: true,
	    	enableHeaderSelect: false,
	    	columnMapping: [{
	    		align : 'center',
	    		title : ' ',
	    		width : '30px',
	    		selectorColumn : true
	        },{
    			key : 'ntwkLineNm', align:'left',
				title : '링이름',
				width: '130px'
			}, {
    			key : 'topoSclNm', align:'left',
				title : '망종류',
				width: '70px'
			}, {
    			key : 'ntwkTypNm', align:'left',
				title : '망구분',
				width: '70px'
			}, {
    			key : 'ntwkLineNo',
				title : '링번호',
				width: '5px',
				hidden:true
			}, {
    			key : 'ringMgmtNo', align:'left',
				title : '링관리번호',
				width: '5px',
				hidden:true
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //링 장비리스트
	    $('#ringEqpListGrid').alopexGrid({
	    	headerRowHeight: 25,
	    	height: '276px',
	    	rowOption : {
	    		defaultHeight: 30
	    	},
	    	cellRefreshOnRowSelect: true,
	    	columnMapping: [{
    			key : 'eqpNm', align:'left',
				title : '장비명',
				width: '150px'
			}, {
    			key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '150px'
			}, {
    			key : 'mtsoId',
				title : '국사ID',
				width: '5px'
			}, {
    			key : 'mtsoLatVal',
				title : '위도',
				width: '5px'
			}, {
    			key : 'mtsoLngVal',
				title : '경도',
				width: '5px'
			}, {
    			key : 'mtsoTyp',
				title : '국사유형',
				width: '5px'
			}, {
    			key : 'mtsoStat',
				title : '국사상태',
				width: '5px'
			}, {
    			key : 'bldAddr',
				title : '건물주소',
				width: '5px'
			}, {
    			key : 'eqpId',
				title : '장비ID',
				width: '5px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //링조회
	    $('#ringListGrid').alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 보이게
               ,pagerTotal: true     //총 건수 보이게
               ,pagerSelect: true   //페이지당 줄수 선택   안보이게
               ,pagerCount: 3        //페이저카운터 5개씩
        	},
        	height: '638px',
        	autoColumnIndex: true,
    		autoResize: true,
    		rowSelectOption: {
    			clickSelect: false,
    			singleSelect: false
    		},
    		cellSelectable : true,
    		numberingColumnFromZero: false,
    		columnMapping: [
    		  { key : 'check',
    			align: 'center',
    			width: '40px',
    			selectorColumn : true
    		},{
    			key : 'ntwkLineNm',
    			align:'left',
				title : '링이름',
				width: '290px'
			},{
    			key : 'topoSclNm',
				title : '망종류',
				width: '130px'
			},{
    			key : 'ntwkTypNm',
				title : '망구분',
				width: '140px'
			}, {
    			key : 'ntwkLineNo',
				title : '링 번호',
				width: '5px',
				hidden: true
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //서비스라인 조회
	    $('#lineListGrid').alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 보이게
               ,pagerTotal: true     //총 건수 보이게
               ,pagerSelect: true   //페이지당 줄수 선택   안보이게
               ,pagerCount: 3        //페이저카운터 5개씩
        	},
        	height: '638px',
        	autoColumnIndex: true,
    		autoResize: true,
    		rowSelectOption: {
    			clickSelect: false,
    			singleSelect: false
    		},
    		cellSelectable : true,
    		numberingColumnFromZero: false,
    		columnMapping: [
			{
				key : 'check',
    			align: 'center',
    			width: '40px',
    			selectorColumn : true
    		},{
    			key : 'svlnNo',
    			align:'left',
    			title : '회선번호',
    			width: '60px',
    			hidden:true
    		},{
    			key : 'lineNm',
    			align:'left',
				title : '회선명',
				width: '230px'
			},{
    			key : 'svlnLclCdNm',
				title : '회선대분류',
				width: '110px'
			},{
    			key : 'svlnSclCdNm',
				title : '회선소분류',
				width: '110px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //국사조회
		$('#mtsoListGrid').alopexGrid({
			paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 보이게
               ,pagerTotal: true //총 건수   안보이게
               ,pagerSelect: true //페이지당 줄수 선택   안보이게
               ,pagerCount: 3        //페이저카운터 5개씩
        	},
        	height: '600px',
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [{
    			key : 'mtsoNm',
    			align:'left',
				title : '국사명',
				width: '120px'
			}, {
    			key : 'bldAddr',
    			align:'left',
				title : '주소',
				width: '180px'
			}, {
    			key : 'mtsoTyp',
				title : '국사유형',
				width: '70px'
			},{
    			key : 'mtsoStat',
				title : '국사상태',
				width: '70px'
			}, {
    			key : 'mgmtGrpNm',
				title : '관리그룹',
				width: '70px'
			}, {
    			key : 'mtsoId',
				title : '국사ID',
				width: '90px'
			}, {
    			key : 'mtsoLatVal',
				title : '위도',
				width: '5px'
			}, {
    			key : 'mtsoLngVal',
				title : '경도',
				width: '5px'
			}, {
    			key : 'mtsoMgmtNo',
				title : 'GIS국사관리번호',
				width: '5px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

		//유선 커버리지 설계
	    $('#'+gridId5).alopexGrid({
	    	paging : {
               pagerTotal: true //총 건수   안보이게
        	},
        	height: '638px',
        	autoColumnIndex: true,
    		autoResize: true,
    		rowSelectOption: {
    			clickSelect: false,
    			singleSelect: false
    		},
    		cellSelectable : true,
    		columnMapping: [
    			{key : 'check', align: 'center',width: '40px', selectorColumn : true},
    			{key : 'coverageTerrNm', align:'left', title : '커버리지명', width: '140px'},
    			{key : 'mtsoNm', align:'left', title : '국사명', width: '110px'},
    			{key : 'bldAddr', align:'left', title : '주소', width: '160px'},
    			{key : 'creRsnCtt', align:'left', title : '생성사유', width: '120px'},

    			{key : 'coverageId', align:'left', title : '커버리지ID', width: '60px', hidden:true},
    			{key : 'mtsoId', align:'left', title : '국사ID', width: '60px', hidden:true},
    			{key : 'gisLnkgModYn', align:'left', title : 'GIS연동수정여부', width: '60px', hidden:true},
    			{key : 'geo', align:'left', title : '하위국사공간위치G', width: '60px', hidden:true},
    			{key : 'coverageTerrSrno', align:'left', title : '커버리지영역일련번호', width: '60px', hidden:true},
    			{key : 'geoNodeCnt', align:'left', title : '하위국사공간위치G수', width: '60px', hidden:true},
    			{key : 'ldongCd', align:'left', title : '법정동코드', width: '60px', hidden:true}
    		],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //유선 커버리지 조회
	    $('#'+gridId6).alopexGrid({
	    	paging : {
               pagerTotal: true //총 건수   안보이게
        	},
        	height: '638px',
	    	autoColumnIndex: true,
	    	autoResize: true,
	    	rowSelectOption: {
    			clickSelect: false,
    			singleSelect: false
    		},
    		headerGroup: [
      			{fromIndex:'mtsoNm', toIndex:'covMtsoLkupIcon', title:'국사명', hideSubTitle:true},
			],
			renderMapping:{
				"covMtsoLkupIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Signal' style='cursor: pointer'></span>";
					}
				}
    		},
	    	columnMapping: [
	    		{key : 'check', align: 'center',width: '40px', selectorColumn : true},
	    		{key : 'mtsoNm', align:'left', title : '국사명', width: '120px'},
	    		{key : 'covMtsoLkupIcon', width   : '30px', align   : 'center', editable: false, render  : {type:'covMtsoLkupIcon'}, resizing: false},
	    		{key : 'coverageTypCd', align:'center', title : '서비스', width: '80px'},
	    		{key : 'bldAddr', align:'left', title : '주소', width: '180px'},

    			{key : 'mtsoId', align:'left', title : '국사ID', width: '60px', hidden:true},
    			{key : 'geo', align:'left', title : '하위국사공간위치G', width: '60px', hidden:true},
    			{key : 'geoNodeCnt', align:'left', title : '하위국사공간위치G수', width: '60px', hidden:true},
    			{key : 'ldongCd', align:'left', title : '법정동코드', width: '60px', hidden:true}
    		],
    		message: {/* 데이터가 없습니다. */
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    		}
	    });

	    $('#'+gridId7).alopexGrid({
			height : '5row',
			fitTableWidth : true,
			autoColumnIndex : true,
			numberingColumnFromZero : false,
			pager : true,
			paging : {
				pagerTotal: true,
			},
			columnMapping : [
				{align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },
				{ key : 'mtsoNm', align:'left', title : "국사", width: '220px'},
				{ key : 'mtsoTyp', align:'center', title : "유형", width: '70px'},
				{ key : 'mtsoStat', align:'center', title : "상태", width: '50px'},

				{ key : 'bldAddr', align:'left', title : "주소", width: '200px'},
				{ key : 'bldBlkNm', align:'center', title : "건물", width: '100px'},
				{ key : 'bldblkNo', align:'center', title : "층", width: '50px'},
				{ key : 'tnetEqpCnt', align:'center', title : "T망장비", width: '70px'},
				{ key : 'anetEqpCnt', align:'center', title : "A망장비", width: '70px'}
			],
			message : {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

	    $('#'+gridId7Floor).alopexGrid({
	    	height : '3row',
			fitTableWidth : true,
			autoColumnIndex : true,
			numberingColumnFromZero : false,
			pager : true,
			paging : {
				pagerTotal: true,
			},
			columnMapping : [
				{align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },
				{ key : 'sisulCd', hidden:true},
				{ key : 'mtsoId', align : 'center', title : '국사ID', width : '100'},
				{
					key : 'mtsoNm', align : 'center',
					title : '국사명',
					width : '180'
				},
				{ align : 'center', title : '도면', width : '50', render : function(value, data, render, mapping){
																				return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnDraw" type="button"></button></div>';
																			}
				},
				{ key: 'neFloorWidth', align : 'center', title : '가로(mm)', width : '70'},
				{ key: 'neFloorLength', align : 'center', title : '세로(mm)', width : '70'},
				{ key: 'neFloorHeight', align : 'center', title : '층고(mm)', width : '70'},
				{ key : 'celluse', align : 'center', title : '상면사용률', width : '70'},
				{ key : 'rackratio', align : 'center', title : '랙 사용률', width : '70'}
			],
			message : {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

	    $('#'+gridId9).alopexGrid({
	    	paging : {
	    		pagerSelect: [100,300,500,1000],
            	hidePageList: false  // pager 중앙 삭제
        	},
        	height: '725px',
	    	autoColumnIndex: true,
	    	autoResize: true,
	    	rowSelectOption: {
    			clickSelect: false,
    			singleSelect: false
    		},
    		numberingColumnFromZero: false,
    		cellSelectable : false,
	    	columnMapping: [
	    		{ key: 'check', align: 'center', width: '40px', selectorColumn : true},
	    		{ align:'center', title : '순번', width: '40px', resizing : false, numberingColumn: true},
	    		{ key : 'afeYr', align:'center', title : '년도', width: '50px', editable: false},
	    		{ key : 'afeDemdDgr', align:'center', title : '차수', width: '50px', editable: false},
				{ key : 'demdBizDivNm', align:'left', title : '사업목적', width: '100px', editable : false},
				{ key : 'demdRvCnt', align:'center', title : '검토건수', width: '70px', editable : false},
				{ key : 'lowDemdBizDivNm', align:'left', title : '사업구분', width: '180px', editable : false},
				{ key : 'eqpDivNm', align:'center', title : '설계대상', width: '100px', editable : false},
				{ key : 'rvUserNm', align:'left', title : '작업자', width: '70px', editable : false},
				{ key : 'frstRegDate', align:'center', title : '작업일자', width: '100px', editable : false},
				{ key : 'objMgmtNo', align:'center', title : '관리번호', width: '100px', editable : false}
    		],
    		message: {/* 데이터가 없습니다. */
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    		}
	    });

	    $('#'+gridId10).alopexGrid({
	    	paging : {
	    		pagerSelect: [100,300,500,1000],
	    		hidePageList: false  // pager 중앙 삭제
	    	},
	    	height: '325px',
	    	autoColumnIndex: true,
	    	autoResize: true,
	    	rowSelectOption: {
	    		clickSelect: true,
	    		singleSelect: true
	    	},
	    	numberingColumnFromZero: false,
	    	cellSelectable : false,
	    	columnMapping: [
	    		{ align:'center', title : '순번', width: '40px', resizing : false, numberingColumn: true},
	    		{ key : 'afeYr', align:'center', title : '년도', width: '50px', editable: false},
	    		{ key : 'afeDemdDgr', align:'center', title : '차수', width: '50px', editable: false},
	    		{ key : 'demdBizDivNm', align:'left', title : '사업목적', width: '100px', editable : false},
	    		{ key : 'dsnRsltCnt', align:'center', title : '결과건수', width: '70px', editable : false},
	    		{ key : 'routeCnt', align:'center', title : '경로건수', width: '70px', editable : false},
	    		{ key : 'lowDemdBizDivNm', align:'left', title : '사업구분', width: '180px', editable : false},
	    		{ key : 'eqpDivNm', align:'center', title : '설계대상', width: '100px', editable : false},
	    		{ key : 'rsltUserNm', align:'left', title : '작업자', width: '70px', editable : false},
	    		{ key : 'frstRegDate', align:'center', title : '작업일자', width: '100px', editable : false},
	    		{ key : 'endObjMgmtNo', align:'center', title : '관리번호', width: '100px', editable : false},
	    		],
	    		message: {/* 데이터가 없습니다. */
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
	    		}
	    });

	    $('#'+gridId10Routean).alopexGrid({
	    	paging : {
	    		pagerSelect: [100,300,500,1000],
	    		hidePageList: false  // pager 중앙 삭제
	    	},
	    	height: '325px',
	    	autoColumnIndex: true,
	    	autoResize: true,
	    	rowSelectOption: {
	    		clickSelect: false,
	    		singleSelect: false
	    	},
	    	numberingColumnFromZero: false,
	    	cellSelectable : false,
	    	columnMapping: [
	    		{ key: 'check', align: 'center', width: '40px', selectorColumn : true},
	    		{/* 요청순번			*/
					key : 'raReqSeq', align : 'center',
					title : '순번',
					width : '40'
				}, {/* 상위국 국사명			*/
					key : 'uprMtsoIdNm', align:'left',
					title : '상위국',
					width: '150'
				}, {/* 하위국 국사명			*/
					key : 'lowMtsoIdNm', align:'left',
					title : '하위국',
					width: '240'
				}, {/* 소유분류코드			*/
					key : 'ownClCd', align:'center',
					title : '소유분류코드',
					width: '100'
				}, {
					key : 'cnptDistVal', align : 'center',
					title : '신설거리',
					width : '80'
				}, {
					key : 'sktCnt', align : 'right',
					title : 'SKT접속수',
					width : '80'
				}, {
					key : 'skbCnt', align : 'right',
					title : 'SKB접속수',
					width : '80'
				}, {
					key : 'sktCnntCnt', align : 'right',
					title : 'SKT중접수',
					width : '80'
				}, {
					key : 'skbCnntCnt', align : 'right',
					title : 'SKB중접수',
					width : '80'
				}, {
					key : 'sktDistm', align : 'center',
					title : 'SKT기설거리M',
					width : '110'
				}, {
					key : 'skbDistm', align : 'center',
					title : 'SKB기설거리M',
					width : '130'
				}, {
					key : 'cmplDistm', align : 'center',
					title : '기설거리합M',
					width : '140'
				}, {
					key : 'sktSprCnt', align : 'right',
					title : 'SKT접속수예비',
					width : '110'
				}, {
					key : 'skbSprCnt', align : 'right',
					title : 'SKB접속수예비',
					width : '110'
				}, {
					key : 'sktCnntSprCnt', align : 'right',
					title : 'SKT중접수예비',
					width : '110'
				}, {
					key : 'skbCnntSprCnt', align : 'right',
					title : 'SKB중접수예비',
					width : '110'
				}, {
					key : 'sktSprDistm', align : 'center',
					title : 'SKT기설거리M예비',
					width : '120'
				}, {
					key : 'skbSprDistm', align : 'center',
					title : 'SKB기설거리M예비',
					width : '130'
				}, {
					key : 'cmplSprDistm', align : 'center',
					title : '기설거리합M예비',
					width : '150'
				}, {/* 인입투자비		*/
					key : 'linInvtCost', align : 'right',
					title : '인입투자비(만원)',
					width : '120'
				}, {/* SKT투자비		*/
					key : 'sktInvtCost', align : 'right',
					title : 'SKT접속투자비(만원)',
					width : '130'
				}, {/* SKB투자비		*/
					key : 'skbInvtCost', align : 'right',
					title : 'SKB접속투자비(만원)',
					width : '130'
				}, {/* 경로분석요청ID			*/
					key : 'raReqId', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 상위국사ID			*/
					key : 'uprMtsoId', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 하위국사ID			*/
					key : 'lowMtsoId', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 원천요청ID값			*/
					key : 'srcReqIdVal', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 원천요청순번값			*/
					key : 'srcReqSeqVal', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}
	    		],
	    		message: {/* 데이터가 없습니다. */
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
	    		}
	    });

	    $('#'+gridId11).alopexGrid({
	    	paging : {
	    		pagerSelect: [100,300,500,1000],
	    		hidePageList: false  // pager 중앙 삭제
	    	},
	    	height: '300px',
	    	autoColumnIndex: true,
	    	autoResize: true,
	    	rowSelectOption: {
	    		clickSelect: true,
	    		singleSelect: true
	    	},
	    	numberingColumnFromZero: false,
	    	cellSelectable : true,
	    	columnMapping: [
	    		{ align:'center', title : '순번', width: '40px', resizing : false, numberingColumn: true},
	    		{ key : 'afeYr', align:'center', title : '년도', width: '50px', editable: false},
	    		{ key : 'afeDemdDgr', align:'center', title : '차수', width: '50px', editable: false},
	    		{ key : 'topMtsoNm', align:'center', title : '전송실', width: '100px', editable : false},
	    		{ key : 'mtsoInvtSmltNm', align:'left', title : '시뮬레이션명', width: '160px', editable : false},
	    		{ key : 'acptRdusDistm', align:'right', title : '최대반경(Km)', width: '100px', editable : false},
	    		{ key : 'rmkCtt', align:'left', title : '비고', width: '180px', editable : false},
	    		{ key : 'lastChgUserNm', align:'center', title : '최종작업자', width: '80px', editable : false},
	    		{ key : 'lastChgDate', align:'center', title : '최종작업일자', width: '120px', editable : false},
	    		{ key : 'mtsoInvtSmltId', align:'center', title : '국사투자시뮬레이션ID', width: '100px', editable : false, hidden : true},
	    		{ key : 'topMtsoId', align:'center', title : '국사투자시뮬레이션ID', width: '100px', editable : false, hidden : true},
	    		],
	    		message: {/* 데이터가 없습니다. */
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
	    		}
	    });

	    $('#'+gridId11Bas).alopexGrid({
	    	paging : {
	    		pagerSelect: [100,300,500,1000],
	    		hidePageList: false  // pager 중앙 삭제
	    	},
	    	height: '300px',
	    	autoColumnIndex: true,
	    	autoResize: true,
	    	rowSelectOption: {
    			clickSelect: false,
    			singleSelect: false
    		},
	    	numberingColumnFromZero: false,
	    	cellSelectable : true,
	    	columnMapping: [
	    		{ key: 'check', align: 'center', width: '40px', selectorColumn : true},
	    		{ align:'center', title : '순번', width: '40px', resizing : false, numberingColumn: true},
	    		{ key : 'intgMtsoNm', align:'center', title : '통합국', width: '100px', editable: false},
	    		{ key : 'intgDivValNm', align:'center', title : '구분', width: '70px', editable: false},
	    		{ key : 'cifSlfLesNm', align:'center', title : '소유구분', width: '100px', editable : false},
	    		{ key : 'upsdFlorCnt', align:'right', title : '상면층수', width: '70px', editable : false},
	    		{ key : 'totRackCnt', align:'right', title : '총랙수', width: '70px', editable : false},
	    		{ key : 'remRackCnt', align:'right', title : '잔여랙수', width: '70px', editable : false},
	    		{ key : 'rmkCtt', align:'left', title : '비고', width: '160px', editable : false},
	    		{ key : 'lastChgUserNm', align:'center', title : '최종작업자', width: '80px', editable : false},
	    		{ key : 'lastChgDate', align:'center', title : '최종작업일자', width: '100px', editable : false},
	    		{ key : 'mtsoInvtSmltId', align:'center', title : '국사투자시뮬레이션ID', width: '100px', editable : false, hidden : true},
	    		{ key : 'intgDivVal', align:'center', title : '', width: '40px', editable: false, hidden : true},
	    		{ key : 'sisulCd', align:'center', title : '시설코드', width: '100px', editable : false, hidden : true},
	    		{ key : 'coverageId', align:'center', title : '커버리지ID', width: '100px', editable : false, hidden : true},
	    		{ key : 'geo', align:'center', title : '좌표', width: '100px', editable : false, hidden : true},
	    		{ key : 'geoNodeCnt', align:'center', title : '노드수', width: '100px', editable : false, hidden : true},
	    		],
	    		message: {/* 데이터가 없습니다. */
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
	    		}
	    });

		gridHide();
    }

    /*==========================*
	 * 컬럼 숨기기
	 *==========================*/
    function gridHide() {
    	var hideColList = [];
    	var eqpRoleDivCdList = getMultiSelect("eqpRoleDivCdList1", "value", ":selected");
    	if(eqpRoleDivCdList.length > 0){
    		$.each(eqpRoleDivCdGridColList, function(idx, data){
    			hideColList.push("CD"+data.comCd);
    		});

    		$.each(eqpRoleDivCdList, function(idx, selVal){
    			hideColList.splice(hideColList.indexOf("CD"+selVal),1);
    		});
    	}else{
    		hideColList = [];
    	}

    	$('#orgListGrid').alopexGrid("hideCol", hideColList, 'conceal');
    	$('#orgListGrid').alopexGrid("viewUpdate");

    	//링리스트 숨김테이터
/*    	var ringListHideColList = ['ntwkLineNo'];
    	$('#ringListGrid').alopexGrid("hideCol", ringListHideColList, 'conceal');*/
    	$('#ringListGrid').alopexGrid("viewUpdate");

    	//국사리스트 숨김데이터
    	var mtsoListHideColList = ['mtsoLatVal', 'mtsoLngVal','mtsoMgmtNo'];
    	$('#mtsoListGrid').alopexGrid("hideCol", mtsoListHideColList, 'conceal');
    	$('#mtsoListGrid').alopexGrid("viewUpdate");

    	//주변링리스트 숨김 데이터
/*    	var rangeRingHideColList = ['ntwkLineNo', 'ringMgmtNo'];
    	$('#rangeRingGrid').alopexGrid("hideCol", rangeRingHideColList, 'conceal');*/
    	$('#rangeRingGrid').alopexGrid("viewUpdate");

    	//링-장비리스트 숨김 데이터
    	var ringEqpHideColList = ['mtsoId','mtsoLatVal', 'mtsoLngVal','mtsoTyp','mtsoStat','bldAddr','eqpId'];
    	$('#ringEqpListGrid').alopexGrid("hideCol", ringEqpHideColList, 'conceal');
    	$('#ringEqpListGrid').alopexGrid("viewUpdate");

	};

 	$('#mtsoTypCdList').multiselect({
 		 open: function(e){
 			mtsoTypCdList = $("#mtsoTypCdList").getData().mtsoTypCdList;
 		 },
 		 beforeclose: function(e){
 			 var codeID =  $("#mtsoTypCdList").getData();
      		 var param = "";
      		 if(mtsoTypCdList+"" != codeID.mtsoTypCdList+""){
	         		 if(codeID.mtsoTypCdList == ''){
	         		 }else {
	         			for(var i=0; codeID.mtsoTypCdList.length > i; i++){
	         				param += codeID.mtsoTypCdList[i] + ",";
	         			}
	         			mtsoTypCdList = param;
	         		 }
      		 }
 		 }
 	 });

    //tab-4 관리그룹 선택시 이벤트
	 $('#mgmtGrpNm').on('change', function(e) {
		var option_data =  null;
		mgmtGrpNm = $('#mgmtGrpNm').val();
		if($('#mgmtGrpNm').val() == "SKT"){
			option_data =  [{comCd: "1",comCdNm: "전송실"},
							{comCd: "2",comCdNm: "중심국사"},
							{comCd: "3",comCdNm: "기지국사"},
							{comCd: "4",comCdNm: "국소"}
							];
		}else if($('#mgmtGrpNm').val() == "SKB"){
			option_data =  [{comCd: "1",comCdNm: "정보센터"},
							{comCd: "2",comCdNm: "국사"},
							{comCd: "4",comCdNm: "국소"}
							];
		}else{
			mgmtGrpNm = null;
		}
		$('#mtsoTypCdList').setData({
            data:option_data,
		});
    });

	//tab-1 관리그룹 선택시 이벤트
	$('#mgmtGrpNm1').on('change', function(e) {
		var option_data =  null;
		mgmtGrpNm = $('#mgmtGrpNm1').val();
		if($('#mgmtGrpNm1').val() == "SKT"){
			option_data =  [{comCd: "1",comCdNm: "전송실"},
							{comCd: "2",comCdNm: "중심국사"},
							{comCd: "3",comCdNm: "기지국사"},
							{comCd: "4",comCdNm: "국소"}
							];
		}else if($('#mgmtGrpNm1').val() == "SKB"){
			option_data =  [{comCd: "1",comCdNm: "정보센터"},
							{comCd: "2",comCdNm: "국사"},
							{comCd: "4",comCdNm: "국소"}
							];
		}else{
			mgmtGrpNm = null;
		}
		$('#mtsoTypCdList1').setData({
	        data:option_data,
		});

		//주변 국사 및 장비 그리드 초기화
		$('#orgListGrid').alopexGrid("dataEmpty");
		$('#eqpListGrid').alopexGrid("dataEmpty");

    	//2023-Eng고도화 - 필터 변경 : 장비 타입
		httpRequest('tango-transmission-tes-biz2/transmisson/tes/commoncode/eqpRoleDiv/C00148/'+ mgmtSelected, null, 'GET', 'eqpRoleDivCd'); // 장비타입
	});

	$("#afeYr1").on("change", function(e) {
		let mAreaYear1 = $("#afeYr1").val();
    	if(mAreaYear1 == ''){
    		$("#afeDemdDgr1").empty();
			$("#afeDemdDgr1").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
			$("#afeDemdDgr1").setSelected("");
    	}else{
        	var dataParam = {
        			afeYr : this.value
    		};

        	selectAfeDemdDgrCode('afeDemdDgr1', dataParam);
    	}
	});

	$("#afeYr2").on("change", function(e) {
		let mAreaYear1 = $("#afeYr2").val();
		if(mAreaYear1 == ''){
			$("#afeDemdDgr2").empty();
			$("#afeDemdDgr2").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
			$("#afeDemdDgr2").setSelected("");
		}else{
			var dataParam = {
					afeYr : this.value
			};

			selectAfeDemdDgrCode('afeDemdDgr2', dataParam);
		}
	});

	$("#afeYr11").on("change", function(e) {
		let mAreaYear1 = $("#afeYr11").val();
		if(mAreaYear1 == ''){
			$("#afeDemdDgr11").empty();
			$("#afeDemdDgr11").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
			$("#afeDemdDgr11").setSelected("");
		}else{
			var dataParam = {
					afeYr : this.value
			};

			selectAfeDemdDgrCode('afeDemdDgr11', dataParam);
		}
	});

	function nullToEmpty(str) {
	    if (str == null || str == "null" || typeof str == "undefined") {
	    	str = "";
	    }
		return str;
	}

	//서비스회선 소분류 변경
	function changeSvlnSclCd(svlnLclId, svlnSclId, svlnSclCdData, mgmtGrpId){

	 	var svlnLclCd = $('#' + svlnLclId).val();
	 	var tmpSvlnSclCd = $('#' + svlnSclId).val();

		var svlnSclCd_option_data =  [];
	 	if(svlnLclCd != null && svlnLclCd != ""){
			for(m=0; m<svlnSclCdData.length; m++){
				var dataS = svlnSclCdData[m];

				if(dataS.value == "" && (svlnLclCd == "005" || svlnLclCd == "001")){// (B2B회선, 기지국회선)인 경우 전체 는 무조건 포함
					svlnSclCd_option_data.push(dataS);
				}else if(m==0 && dataS.value != "" && (svlnLclCd == "005" || svlnLclCd == "001")){
					var dataFst = {"uprComCd":"","value":"","text":"전체"};
					svlnSclCd_option_data.push(dataFst);
				}

				if(svlnLclCd == dataS.uprComCd){
						svlnSclCd_option_data.push(dataS);
//					}
				}


			}
			if(svlnLclCd =="005"){
				tmpSvlnSclCd = "009";
			}

			$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
			$('#' + svlnSclId).setSelected(tmpSvlnSclCd);

	 	}else{
			for(m=0; m<svlnSclCdData.length; m++){
				var dataS = svlnSclCdData[m];
				if(dataS.value == ""){
					svlnSclCd_option_data.push(dataS);
				}
//				if("ALL" == dataS.cdFltrgVal ){
					svlnSclCd_option_data.push(dataS);
//				}
			}
			$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
		}
	}

	function sctnMtsoDataParsing(sctnData){

		var sctnresponse = {nodeData:null, linkData:null};
		var nodedata = [];
		var linkdata = [];
		var nodecnt = 0;
		var linkcnt = 0;
		var mtsoTmp = [];

		for(var i=0; i<sctnData.length; i++){

			var cntLft = 0;
			var cntRght = 0;
			for(var j=0; j<mtsoTmp.length; j++){
				if(mtsoTmp[j] == sctnData[i].lftMtsoId){
					cntLft++;
				}
				if(mtsoTmp[j] == sctnData[i].rghtMtsoId){
					cntRght++;
				}
			}

			if(cntLft == 0 && sctnData[i].lftMtsoId != "" && sctnData[i].lftMtsoId != undefined){
				nodedata[nodecnt++] = {mtsoId:sctnData[i].lftMtsoId, mtsoNm:sctnData[i].lftMtsoNm, mtsoTypCd:sctnData[i].lftMtsoTypCd, lftIntgMtsoId : sctnData[i].lftIntgMtsoId, lftIntgMtsoNm : sctnData[i].lftIntgMtsoNm, rghtIntgMtsoId : sctnData[i].rghtIntgMtsoId, rghtIntgMtsoNm : sctnData[i].rghtIntgMtsoNm, intgMtsoId : sctnData[i].lftIntgMtsoId, intgMtsoNm : sctnData[i].lftIntgMtsoNm};
				mtsoTmp[mtsoTmp.length] = sctnData[i].lftMtsoId;
			}

			if(cntRght == 0 && sctnData[i].rghtMtsoId != "" && sctnData[i].rghtMtsoId != undefined && sctnData[i].lftMtsoId != sctnData[i].rghtMtsoId){
				nodedata[nodecnt++] = {mtsoId:sctnData[i].rghtMtsoId, mtsoNm:sctnData[i].rghtMtsoNm, mtsoTypCd:sctnData[i].rghtMtsoTypCd, lftIntgMtsoId : sctnData[i].lftIntgMtsoId, lftIntgMtsoNm : sctnData[i].lftIntgMtsoNm, rghtIntgMtsoId : sctnData[i].rghtIntgMtsoId, rghtIntgMtsoNm : sctnData[i].rghtIntgMtsoNm, intgMtsoId : sctnData[i].rghtIntgMtsoId, intgMtsoNm : sctnData[i].rghtIntgMtsoNm};
				mtsoTmp[mtsoTmp.length] = sctnData[i].rghtMtsoId;
			}

			if(sctnData[i].lftMtsoId != sctnData[i].rghtMtsoId){
				linkdata[linkcnt++] = {lftMtsoId:sctnData[i].lftMtsoId, lftVal:sctnData[i].lftMtsoLngVal+","+sctnData[i].lftMtsoLatVal, rghtMtsoId:sctnData[i].rghtMtsoId, rghtVal:sctnData[i].rghtMtsoLngVal+","+sctnData[i].rghtMtsoLatVal, lftIntgMtsoId : sctnData[i].lftIntgMtsoId, lftIntgMtsoNm : sctnData[i].lftIntgMtsoNm, rghtIntgMtsoId : sctnData[i].rghtIntgMtsoId, rghtIntgMtsoNm : sctnData[i].rghtIntgMtsoNm};
			}

		}

		sctnresponse.nodeData = nodedata;
		sctnresponse.linkData = linkdata;

		return sctnresponse
	}

	// 서비스회선 대분류 선택
	$('#svlnLclCd').on('change', function(e){
		changeSvlnSclCd('svlnLclCd', 'svlnSclCd', svlnSclCdData, "mgmtGrpCd"); // 서비스회선소분류 selectbox 제어
	});

	function excelDownload(response){
		$('#tab-8').progress().remove();

		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-tes-biz2/transmisson/tes/commonlkup/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="fileName" value="'+response.excelFileNm+'" />');
		$form.appendTo('body');
		$form.submit().remove();
	}

});

function getNetworkMtsoLink(){
	let paramObj = [];
//	let obj = $('#network_tree .labelLayer .Checkbox');
	let obj = $('.Checkbox[data-checktype="layer_network"]:checked');

	Object.keys(obj)
		  .filter(key => key >= 0)
		  .map(function(i){
			let ele = obj[i];
			let param = {};
			param.nodeId = $(ele).data('nodeid');
			param.nodeName = $(ele).data('layrnm');
			param.parentNodeId = $(ele).data('group');
			param.lineDivVal = $(ele).data('linedivval');
			paramObj.push(param);
	});

//	if(obj.length > 0){
//		NetworkLayerControl.setSelectCode();
//	}

	randerMapView(paramObj, "");

}

// 국사 투자 시뮬레이션에서 경로분석 레이어 표시
function randerRouteAnlLnqView (obj) {

	let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
	if(routeanInqLayer) {//레이어 있으면 초기화
		routeanInqLayer.clearLayers();
    }else{//레이어 없으면 새로 생성
    	routeanInqLayer = window.mgMap.addCustomLayerByName(routeanInqMapLayer, {selectable: false});
    }

	ExtnlCalnControl.drawRouteanInqLayer(obj);
}


//망구성도에서 지도 표시 호출시
function randerMapView(obj, chkVal){

	//window.mgMap.clearSelectLayer();
	L.SelectLayer.getInstance().clearSelectLayer();
	Util.clearLayerFunc(nodeNetWorkLayer);
	Util.clearLayerFunc(nodeNetworkLabelLayer);
	Util.clearLayerFunc(nodeNetWorkLineLayer);
	Util.clearLayerFunc(nodeLineLabelLayer);
	Util.clearLayerFunc(gisRingLnPathMapLayer);

	if(obj.length == 0){
		return;
	}

	if(!$.TcpMsg.isEmpty(chkVal)){
		setCheckBox(chkVal);
	}

	let param = {};
	param.netBdgmIds = Object.keys(obj).map(function(i){
							return obj[i]["nodeId"]
						}).join(",");
	param.netBdgmNms = Object.keys(obj).map(function(i){
							return obj[i]["nodeName"]
						}).join(",");
	param.netBdgmNetDivVals = Object.keys(obj).map(function(i){
								return obj[i]["parentNodeId"]
							}).join(",");

	param.lineDivVals = Object.keys(obj).map(function(i){
								return obj[i]["lineDivVal"]
							}).join(",");

	// 장비타입 목록
	let netBdgmEqpDivVals = "";
	$('#eqpRoleDivCdListByNetowkrLayer :selected').each(function(i){
		var $this = $(this);
		if($this && $this.length){
			netBdgmEqpDivVals += $this.val() + "|";
		}
	});

	if(netBdgmEqpDivVals && netBdgmEqpDivVals.length) {
   		netBdgmEqpDivVals = netBdgmEqpDivVals.substring(0, netBdgmEqpDivVals.length - 1);
	}

	if(netBdgmEqpDivVals) {
   		param.netBdgmEqpDivVals = netBdgmEqpDivVals;
	}

	//망레이어에서 라벨 표시하라고 선택된 망레이어 키값
	if(cgfLayerNwLabelConf.length > 0) {
		param.netBdgmIdMtsoLabels = cgfLayerNwLabelConf.join(",");
	}

	//망레이어 조회
	Tango.ajax({
				url: 'tango-transmission-tes-biz2/transmisson/tes/engineeringmap/networktopo/getNodeNetworkMtsoLink'
			  , data: Util.convertQueryString(param)
			  , method:'GET'
			  , async:true
	  }).done(
		function(result) {

			//망연결정보 조회
			if(result.length > 0){
				drawNodeNetworkLayer(result);
				drawNodeNetworkLabel(result);

				let lineParam = {};
				lineParam.netBdgmIds = Object.keys(obj)
											.map(function(i){
												return obj[i]["nodeId"]
											}).join(",");

				if (Object.keys(obj).filter(key => obj[key].parentNodeId === 'MW').length > 0) {
					lineParam.mwDiv = 'MW';
				}
				if (Object.keys(obj).filter(key => obj[key].parentNodeId === 'RONT').length > 0) {
					lineParam.rontDiv = 'RONT';
					lineParam.lineDivVals = Object.keys(obj)
						.filter(key => obj[key].parentNodeId === 'RONT')
						.map(function(i){
							return obj[i]["lineDivVal"]
						}).join(",");
				}

				if ( lineParam.rontDiv != 'RONT' && lineParam.mwDiv != 'MW' ) {
					return;
				}

				lineParam.eqpRoleDivCds = ($("#eqpRoleDivCdListByNetowkrLayer").val() == null) ? [] : $("#eqpRoleDivCdListByNetowkrLayer").val();

				Tango.ajax({
					url: 'tango-transmission-tes-biz2/transmisson/tes/engineeringmap/networktopo/getTopologyNodeLinkList'
						, data: Util.convertQueryString(lineParam)
						, method:'GET'
						, async:true
				}).done(
					function(result) {
						if(result.length > 0){
							drawNodeNetworkLineLayer(result)
						}
					}
				);
			}
		}
	);
}

//망구성도에서 선로 조회 호출시
function randerLnMapView(dataObj){
	ExtnlCalnControl.drawGisRingLnPathLayer(dataObj);
}

function drawNodeNetworkLineLayer(lineList){

	let layerId = nodeNetWorkLineLayer;
	let linkLayer = window.mgMap.getCustomLayerByName(layerId);
	if(linkLayer) {//레이어 있으면 초기화
		linkLayer.clearLayers();
    }else{//레이어 없으면 새로 생성
    	linkLayer = window.mgMap.addCustomLayerByName(layerId, {selectable: true});
    }

	lineList.forEach((line, idx) => {
		let feature = {
				features :[{
					type : 'Feature',
					fromEqpId : line.eqpId,
					toEqpId : line.toEqpId,
					fromMtsoId : line.fromNetBdgmNodeMtsoId,
					toMtsoId : line.toNetBdgmNodeMtsoId,
					lineDivVal : line.lineDivVal,
					midLngVal : line.midLngVal,
					midLatVal : line.midLatVal,
					midLinePoint : line.midLinePoint,
					netBdgmNetDivVal : line.netBdgmNetDivVal,
					geometry : {
						type : 'LineString',
						coordinates :  [[line.fromMtsoLngVal, line.fromMtsoLatVal], [line.toMtsoLngVal, line.toMtsoLatVal]]
					},
					style : [{id: 'STYLE_NODE_LINK_BLACK_LINE'}]
				}]
		};
		linkLayer.addData(feature);//생성한 feature 추가
	});
}

function drawNodeNetworkLayer(lineList){
	let layerId = nodeNetWorkLayer;
	let style = "";

	let result = {features: []};
	lineList.forEach((item, idx) => {

		let styleCd = item.styleCd;
		if (styleCd == "RONT01") { //ROADM & OTN(중심국)
			style = "NODE_NETWORK_POINT_01";
		} else if(styleCd == "RONT02"){ //ROADM & OTN(전송실)
			style = "NODE_NETWORK_POINT_02";
		} else if(styleCd == "RONT03"){ //ROADM(IX상접)
			style = "NODE_NETWORK_POINT_03";
		} else if(styleCd == "RONT04"){ //ROADM(중심국)
			style = "NODE_NETWORK_POINT_04";
		} else if(styleCd == "RONT05"){ //ILA(광 중계기)
			style = "NODE_NETWORK_POINT_05";
		} else if(styleCd == "MW01"){	//MW(도서)
			style = "NODE_NETWORK_MW_01"
		} else if(styleCd == "MW02"){	//MW(산간)
			style = "NODE_NETWORK_MW_02"
		}

		let mtsoFeature = {type : 'Feature',
						   mtsoId : item.mtsoId,
						   mtsoNm : item.mtsoNm,
						   lineDivVals : item.netBdgmLineDivVal,
						   netBdgmNetDivVal : item.netBdgmNetDivVal,
						   netBdgmNm : item.netBdgmNm,
						   geometry : {
							   type : 'Point',
							   coordinates : [item.mtsoLngVal,item.mtsoLatVal]
						   },
						   style : [{id:style}],
	  		  			  };

    	result.features.push(mtsoFeature);

	});

	let nodeNetworkLayer = mgMap.getCustomLayerByName(layerId);
	if(!nodeNetworkLayer) {
		nodeNetworkLayer = mgMap.addCustomLayerByName(layerId, {selectable: true});
	}
	nodeNetworkLayer.addData(result);

	if(window.mgMap.getZoom() > 9){
		window.mgMap.setZoom(9);
	}else{
		window.mgMap.setZoom(window.mgMap.getZoom());

	}

//	window.mgMap.fitBounds(nodeNetworkLayer.getBounds(), window.mgMap.getZoom());
}

function drawNodeNetworkLabel(lineList){
	let layerId = nodeNetworkLabelLayer;
	let style = "NODE_NETWORK_MTSO_LABEL";

	let result = {features: []};
	lineList.forEach((item, idx) => {

		let feature = {};
		feature.type = "Feature";
		feature.properties = item;
		feature.properties.LABEL = item.mtsoLabel;
		feature.geometry = {};
		feature.geometry.type = 'Point';
		feature.geometry.coordinates = [item.mtsoLngVal , item.mtsoLatVal];
		feature.keyNames = ["LABEL"];
		feature.style = style;

		result.features.push(feature);
	});

	let nodeNetworkLayer = mgMap.getCustomLayerByName(layerId);
	if(!nodeNetworkLayer) {
		nodeNetworkLayer = mgMap.addCustomLayerByName(layerId, {selectable: false});
	}
	nodeNetworkLayer.addData( result );

	let textIconOption = {
			labelColumn: 'LABEL',
			// text:'',
            faceName: '돋움',
            size: '13',
            color: 'BLACK',
            hAlign: 'middle',
            vAlign: 'top',
            weight: 'bold',
            isBox : true,       //라벨의 테두리 사용 여부
            boxColor : 'black',   //테두리 색상
            boxWidth : 1,       //테두리 두께
            opacity : 0.7,
	};

	for (let key in nodeNetworkLayer._layers) {
		let layer = nodeNetworkLayer._layers[key];
		layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL})));
	}
}

function drawNodeNetworkLineLabel(marker){
	Util.clearLayerFunc(nodeLineLabelLayer);

	let param = {};
	param.fromEqpId = marker.fromEqpId;
	param.fromMtsoId = marker.fromMtsoId;
	param.toEqpId = marker.toEqpId;
	param.toMtsoId = marker.toMtsoId;

	var lineDivValList = marker.lineDivVal.split(",");
	var uniuqeineDivVals = [...new Set(lineDivValList)]
	param.lineDivVals =uniuqeineDivVals;

	Util.jsonAjax({
		  url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getGisRingLnInfo'
		, data: Util.convertQueryString(param)
		, method:'GET'
		, async:false}).done(
		function(response) {

			if(!$.TcpUtils.isEmpty(response.result)){
				let lninfo = response.result;

				let layerId = nodeLineLabelLayer;
				let style = "NODE_NETWORK_MTSO_LABEL";

				let result = {features: []};

				let feature = {};
				feature.type = "Feature";
				feature.properties = marker;
				feature.properties.LABEL = lninfo.lnInfo;//.replace(/,/gi, '<br>');
				feature.geometry = {};
				feature.geometry.type = 'Point';
				feature.geometry.coordinates = [marker.midLngVal , marker.midLatVal];
				feature.keyNames = ["LABEL"];
				feature.style = style;

				result.features.push(feature);

				let nodeNetworkLineLabelLayer = mgMap.getCustomLayerByName(layerId);
				if(!nodeNetworkLineLabelLayer) {
					nodeNetworkLineLabelLayer = mgMap.addCustomLayerByName(layerId, {selectable: false});
				}
				nodeNetworkLineLabelLayer.addData( result );

				let textIconOption = {
						labelColumn: 'LABEL',
						 text:'',
						faceName: '돋움',
						size: '13',
						color: 'BLACK',
						hAlign: 'middle',
						vAlign: 'top',
						weight: 'bold',
						isBox : false,       //라벨의 테두리 사용 여부
						boxColor : 'red',   //테두리 색상
						boxWidth : 1,       //테두리 두께
						opacity : 0.7,
				};

				for (let key in nodeNetworkLineLabelLayer._layers) {
					let layer = nodeNetworkLineLabelLayer._layers[key];
//					layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL})));
					layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption)));
				}
			} else {
				callMsgBox('','W', '링 정보가 존재하지 않습니다.', function(msgId, msgRst){});
			}
		});
}

function setCheckBox(chkVal){
	let obj = $('.Checkbox[data-checktype="layer_network"]');
	obj.prop('checked', false);

	Object.keys(obj)
		  .filter(key => key >= 0)
		  .map(function(i){
			let ele = obj[i];
			let nodeId = $(ele).data('nodeid');
			if(nodeId == chkVal){
				$('.Checkbox[data-nodeId="'+nodeId+'"]').prop("checked", true);
			}
	});
}

function checkedLayerClear(layerId) {
	for(let i=0; i<layerId.length; i++) {
			Util.clearLayerFunc(layerId[i])
		}

		return [];
}

function checkedMtsoClear(layerId) {
	for(let i=0; i<layerId.length; i++) {
			let mtsoInfLayer = window.mgMap.addCustomLayerByName(layerId[i]);
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();
		}

		return [];
}

function fetchWFSData(layernm){
	const geoserverURL = `http://90.90.227.174:8080/geoserver/ne/ows?` +
	`service=WFS&` +
	`version=1.0.0&` +
	`request=GetFeature&` +
	`typeName=ne:test_geoserver&` +
	`maxFeatures=50&` +
	`outputFormat=application/json&` +
	`viewparams=layernm:${encodeURIComponent(layernm)}`;

	fetch(geoserverURL)
	.then(res => {
		if(!res.ok){
			throw new Error('error');
		}
		return res.json();
	})
	.then(data => {
		console.log('data : ' + data);
		const features = data.features.map(f => ({
			...JSON.parse(f.properties.json_data)}
		));
		})
	.catch(error => console.error('요청실패'));
}
