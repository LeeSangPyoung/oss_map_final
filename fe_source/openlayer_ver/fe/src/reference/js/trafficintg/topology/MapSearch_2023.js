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
    var START_WIDTH2 = 500;
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
	var layerNm = null;
	var layerMaxZoom = null;
	var layerMaxZoom = null;

	/*==========================*
	 *  function load()
	 *==========================*/
    function load() {
    	  //레이어 조회 버튼 숨기기
        $('#searchBtn').hide();
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
        	window.mtsoErpLayer = map.addCustomLayerByName('MTSO_ERP_LAYER', {selectable: true});//구성레이어의 ERP공대 기준 레이어
        	window.mtsoLayerLabel = map.addCustomLayerByName('MTSO_LAYER_LABEL');//구성레이어의 ERP공대 기준,건물기준 레이어 라벨
        	window.mtsoBulLayer = map.addCustomLayerByName('MTSO_BUL_LAYER', {selectable: true});//구성레이어의 건물기준  레이어
        	window.distanceCircleLayer = map.addCustomLayerByName('DISTANCE_CIRCLE_LAYER');//반경거리표시를 위한 레이어
        	window.ringInfPopupLayer = map.addCustomLayerByName('RING_INF_POPUP_LAYER');//링정보표시를 위한 레이어
        	window.rangeRingLayerGroup = L.layerGroup();//링표시 레이어들의 그룹
        	//국사레이어만 선택가능하게
        	//국사레이어만 표시
        	var layers = map.getVectorLayers();
        	_.each(layers, function(layer, index) {
        		if (// layer.getLayerAliasName()=='T_국소' ||
        			 layer.getLayerAliasName()=='T_전송실' ||
        			 layer.getLayerAliasName()=='T_중심국_국사') {
        			 layer.properties.selectable = true;
        			 layer.setVisible(true);
        		} else if( layer.getLayerAliasName()=='T_국소'||
					layer.getLayerAliasName()=='건물기준' ||
					layer.getLayerAliasName()=='ERP공대기준'){
            		layer.properties.selectable = true;
            		layer.setVisible(false);
        		} else if(layer.getLayerAliasName()=='SKT기지국'){
					layer.properties.selectable = true;
		   			layer.setVisible(true);
		   			layer.properties.minZoom = 1;
		   			layer.refresh(true);
        		}
        		else{
        			layer.properties.selectable = false;
            		layer.setVisible(false);
        		}

        	});
        	//시도 정보 세팅
        	setSido();
            //시설물 선택 이벤트
        	map.on("mg-selected-features", onClickFeatures);
        	//사용자 레이어 스타일 설정
            addUserLayerStyles();

            //map 이동 시 layer 표시 안 나게 해주기
            mgMap.on('moveend',function(e,layer){
            	if(moveFlag == false){
	            	var layers = map.getVectorLayers();
	            	_.each(layers, function(layer, index) {
	            		if(layer.properties.visible){
	            			layer.setVisible(false);
	            		}
	            	})
	        		mtsoErpLayer.clearLayers();
	        		mtsoBulLayer.clearLayers();
	        		mtsoLayerLabel.clearLayers();
            	}else{

            	 	var layers = map.getVectorLayers();
	            	_.each(layers, function(layer, index) {
	            		if(layer.properties.visible){
	            			layer.setVisible(true);
	            		}

	            	})
	            	if($('#checkCom').is(':checked')){
	            		gusungLayerCheck();
            		}
            	}
            })
        });


        /** 메뉴,화면 세팅  **/
        menuDivInit();
        //메뉴 시작 위치 조정
        mContainer = document.getElementById("menuContainer");
        tab = document.getElementById('tab');
        var gap = tab.scrollWidth;
        //컨테이너 참조 구하기 (사이드 메뉴)
        startX = parseInt(-START_WIDTH) + gap + 17;
        mContainer.style.width = START_WIDTH + gap + "px";
        mContainer.style.height = "770px";
        mContainer.style.marginLeft = startX + "px";

        //메뉴 시작 위치 조정
        mContainer2 = document.getElementById("menuContainer2");
        tab2 = document.getElementById('tab2');
        var gap2 = tab.scrollWidth;
        //컨테이너 참조 구하기 (사이드 메뉴)
        startX2 = parseInt(-START_WIDTH2) -5;
        mContainer2.style.width = START_WIDTH2 + gap2+ 23 +"px";
        mContainer2.style.marginRight = startX2 + "px";
        //그리드생성
        initGrid();
        //select값 초기화
        setSelectCode();
        /** 이벤트 걸기**/
        setEventListener();
    }

    /*==========================*
	 * 이벤트 걸기
	 *==========================*/
 	/**searchFDFYN 클릭 시**/
/* 	$('#ringEqp').on('click', function(){
 		console.log("!!!$$$$$$$$$$$$$$$")
 		var dataObj = $('#rangeRingGrid').alopexGrid('dataGet',{_state: {focused:true}});
 		if(dataObj[0] != undefined){
        dataObj.layerId = "RANGE_RING_LAYER_"+dataObj[0]._index.row;
        dataObj.shouldSelectRow = false;
        dataObj.fdfChk =  $("#searchFDFYN").getValue();
        $('#ringEqpListGrid').alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRingDtlInf', dataObj, 'GET', 'searchRingDtlInf');

 		}else{
 		//	callMsgBox('','W', "aaaa" , function(){});
 		}
     })*/
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
			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRingDtlInf', param, 'GET', 'searchRingDtlInf');
 		}else{
 		//	callMsgBox('','W', "aaaa" , function(){});
 		}
     })

    function setEventListener() {
    	/*...........................*
		    메뉴 관련
		 *...........................*/
    	/** 거리측정**/
    	$('#distanceBtn').on('click', function(e){
            mgMap.setMode('trail-distance');
        });

    	/**왼쪽 컨테이너 메뉴 더 보기**/
    	$('#leftImage').on('click', function(e) {
        	var grid = document.all.leftImage;

        	if (sideTabToggle == true){//숨기기
        	    mContainer.style.marginLeft = startX + "px";
        	    grid.src = "../../resources/images/img_menu_open.png";
        	    sideTabToggle = false;
        	} else {//보이기
        		mContainer.style.marginLeft = targetX + "px";
        	    grid.src = "../../resources/images/img_menu_close.png";
        	    sideTabToggle = true;
        	}
    	});

        /**오른쪽 컨테이너 메뉴 더 보기**/
    	$('#rightImage').on('click', function(e) {
        	var grid = document.all.rightImage;

        	if (sideTabToggle2 == true){
        	    mContainer2.style.marginRight = startX2 + "px";
        	    grid.src = "../../resources/images/img_menu_close.png";
        	    sideTabToggle2 = false;
        	} else {
        		mContainer2.style.marginRight = targetX2 + "px";
        	    grid.src = "../../resources/images/img_menu_open.png";
        	    sideTabToggle2 = true;
        	}
    	});

    	/**오른쪽 탭변경 이벤트**/
   	    $('#rightTab1').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				$('#ringListGrid').alopexGrid("viewUpdate");
				break;
			case 1 :
				$('#mtsoListGrid').alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});

   	   /**왼쪽탭변경 이벤트**/
   	    $('#leftTab').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				$('#orgListGrid').alopexGrid("viewUpdate");
				$('#eqpListGrid').alopexGrid("viewUpdate");
				break;
			case 1 :
				$('#rangeRingGrid').alopexGrid("viewUpdate");
				$('#ringEqpListGrid').alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});

        /**상위 메뉴 마우스 오버**/
        $('.searchSpan').on('mouseenter', function(e){
        	menuDivInit();
        	var t = e.target.attributes[e.target.attributes.length - 1].nodeValue;
        	if (t != null && t != '') {
        		$('div[id=' + t + ']').show();
        	}

        })

        /**레이어 세컨드 메뉴에 마우스 오버**/
        $('.menuDivDiv').on('mouseenter', function(e){
            $('.menuDivSpan').css("background-color", "white");
        	$('#divCenterDiv').hide();
        	$('#divSktDiv').hide();
        	$('#divSkbDiv').hide();
        	$('#divTnDiv').hide();
        	$('#divlayerComMenu').hide();
        	$('#divCommDiv').hide();
        	$('#divCommgmtGrpNm1').hide();
        	$('#divcommtsoTypSKT').hide();
        	$('#divcommtsoTypSKB').hide();
        	$('#divCommtsoStatCd').hide();
        	var t = e.target.attributes[e.target.attributes.length - 1].nodeValue;
        	if(t != null && t != ''){
        		$('span[value=' + t + ']').css("background-color", "#EAEAEA");
        		if (t.substring(0,3) != 'div'){$('div[id=' + t + ']').show();};
        		//레이어-SKT
        		if (t == 'divSktDiv' && $('#checkSkt').is(':checked')){$('div[id=' + t + ']').show();}
        		//레이어-SKB
        		if (t == 'divSkbDiv' && $('#checkSkb').is(':checked')){$('div[id=' + t + ']').show();}
        		//레이어-TN
        		if (t == 'divTnDiv' && $('#checkTn').is(':checked')){$('div[id=' + t + ']').show();}
        		//레이어-공통
        		if (t == 'divCommDiv' && $('#checkComm').is(':checked')){$('div[id=' + t + ']').show();}
        		//레이어-구성레이어
        		if (t == 'divlayerComMenu' && $('#checkCom').is(':checked')){$('div[id=' + t + ']').show();}
        	}
        })

         $('.menuDivDivDiv').on('mouseenter', function(e){
            $('.menuDivSpan').css("background-color", "white");
        	$('#divCommgmtGrpNm1').hide();
        	$('#divcommtsoTypSKT').hide();
        	$('#divcommtsoTypSKB').hide();
        	$('#divCommtsoStatCd').hide();
        	var t = e.target.attributes[e.target.attributes.length - 1].nodeValue;
        	if(t != null && t != ''){
        		$('span[value=' + t + ']').css("background-color", "#EAEAEA");
        		if (t.substring(0,3) != 'div'){$('div[id=' + t + ']').show();};
        		//구성 레이어- 관리 그룹
        		if (t == 'divCommgmtGrpNm1' && $('#checkmgmtGrp').is(':checked')){$('div[id=' + t + ']').show();}
        		//구성 레이어- 국사 유형_SKT
        		if (t == 'divCommtsoTypCdList' && $('#checkmtsoTyp').is(':checked')){
        			if($("#mgmtGrpYn").getValue() == "SKT"){
        				$('div[id=divcommtsoTypSKT]').show();
    				}
        			else if($("#mgmtGrpYn").getValue() == "SKB"){
        				$('div[id=divcommtsoTypSKB]').show();
        			}
        		}
        		//구성 레이어- 국사 상태
        		if (t == 'divCommtsoStatCd' && $('#checkmtsoStatCd').is(':checked')){$('div[id=' + t + ']').show();}
        	}
         })

        /**레이어:SKT선택시 서브메뉴**/
        $('#checkSkt').on('click', function(e){
        	if($('#checkSkt').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divSktDiv').show();
        	 	if($('#T_TMOF').is(':checked')){//체크했으면 하위메뉴보여줘
            		setViewLabelLayerFunc('T_TMOF',true);
        	 	}if($('#T_COFC_MTSO').is(':checked')){//체크했으면 하위메뉴보여줘
            		setViewLabelLayerFunc('T_COFC_MTSO',true);
        	 	}
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divSktDiv').hide();
        		$('#T_SMTSO').attr('checked', false);
        		setViewLayerFunc("T_SMTSO",false);
        		//$('#T_TMOF').attr('checked', false);
        		setViewLayerFunc("T_TMOF",false);
        	//	$('#T_COFC_MTSO').attr('checked', false);
        		setViewLayerFunc("T_COFC_MTSO",false);
        		$('#T_RING').attr('checked', false);
        		setViewLayerFunc("T_RING",false);
        		$('#T_OFC_GRD').attr('checked', false);
        		setViewLayerFunc("T_OFC_GRD",false);
        		$('#T_OFC_ARIL').attr('checked', false);
        		setViewLayerFunc("T_OFC_ARIL",false);
        		$('#T_OFC_LES').attr('checked', false);
        		setViewLayerFunc("T_OFC_LES",false);
        		$('#T_OFC_FTTH').attr('checked', false);
        		setViewLayerFunc("T_OFC_FTTH",false);
        		$('#T_CDLN_LES').attr('checked', false);
        		setViewLayerFunc("T_CDLN_LES",false);
        		$('#T_CDLN_SLF').attr('checked', false);
        		setViewLayerFunc("T_CDLN_SLF",false);
        		setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); // 공통 SKT기지국
        		setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
        		setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
        	}
        })

        //레이어:SKB선택시 서브메뉴
        $('#checkSkb').on('click', function(e){
        	if($('#checkSkb').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divSkbDiv').show();
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divSkbDiv').hide();
        		$('#B_IMPT_CUST_RING').attr('checked', false);
        		setViewLayerFunc("B_IMPT_CUST_RING",false);
        		$('#B_RING').attr('checked', false);
        		setViewLayerFunc("B_RING",false);
        		$('#B_FDLK').attr('checked', false);
        		setViewLayerFunc("B_FDLK",false);
        		$('#B_MTSO').attr('checked', false);
        		setViewLayerFunc("B_MTSO",false);
        		$('#B_SKT_BMTSO').attr('checked', false);
        		setViewLayerFunc("B_SKT_BMTSO",false);
        		$('#B_OFC_EM').attr('checked', false);
        		setViewLayerFunc("B_OFC_EM",false);
        		$('#B_OFC_GRD').attr('checked', false);
        		setViewLayerFunc("B_OFC_GRD",false);
        		$('#B_OFC_ARIL').attr('checked', false);
        		setViewLayerFunc("B_OFC_ARIL",false);
        		$('#B_OFC_LES').attr('checked', false);
        		setViewLayerFunc("B_OFC_LES",false);
        		$('#B_OFC_FTTH').attr('checked', false);
        		setViewLayerFunc("B_OFC_FTTH",false);
        		$('#B_CDLN_LES').attr('checked', false);
        		setViewLayerFunc("B_CDLN_LES",false);
        		$('#B_CDLN_SLF').attr('checked', false);
        		setViewLayerFunc("B_CDLN_SLF",false);
        	}
        })
        /**레이어:TN 선택시 서브메뉴**/
        $('#checkTn').on('click', function(e){
        	if($('#checkTn').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divTnDiv').show();
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divTnDiv').hide();
        		$('#TN_MTSO').attr('checked', false);
        		setViewLayerFunc("TN_MTSO",false);
        		$('#TN_OFC_ARIL').attr('checked', false);
        		setViewLayerFunc("TN_OFC_ARIL",false);
        		$('#TN_OFC_GRD').attr('checked', false);
        		setViewLayerFunc("TN_OFC_GRD",false);
        		$('#TN_CDLN_LES').attr('checked', false);
        		setViewLayerFunc("TN_CDLN_LES",false);
         		$('#TN_CDLN_SLF').attr('checked', false);
        		setViewLayerFunc("TN_CDLN_SLF",false);
        	}
        })

        // 레이어(divSktDiv) zoom popup창 띄우기
        $('#divSktDiv').contextmenu(function(e) {
        	 var layerInfo = e.target.previousSibling.id;
        	 layerNm =  e.target.innerHTML;
             layerMaxZoom = window.mgMap.getLayerById(layerInfo).properties.maxZoom;
             layerMinZoom =window.mgMap.getLayerById(layerInfo).properties.minZoom;
             var posx = e.clientX;
             var posy = e.clientY;
             var w = $(window).width();
 			var mapWidth = $('#map').width();
 			var asideWidth = $('.menu_aside').width();
 			var offsetX, offsetY, calc;
 			if ( w > mapWidth ) {
 				calc = (w - mapWidth) / 2 + asideWidth;
 				offsetX = posx - calc;
 			} else {
 				calc = asideWidth;
 				offsetX =posx - calc;
 			}
 			offsetY =posy - asideWidth;
             $('#divZoom').stop().fadeIn('fast').css({
 				top: posy,
 				left: offsetX+15
 			});
 			$('#divZoom').append();
        })

                // 레이어(divSkbDiv) zoom popup창 띄우기
        $('#divSkbDiv').contextmenu(function(e) {
        	 var layerInfo = e.target.previousSibling.id;
        	 layerNm =  e.target.innerHTML;
             layerMaxZoom = window.mgMap.getLayerById(layerInfo).properties.maxZoom;
             layerMinZoom =window.mgMap.getLayerById(layerInfo).properties.minZoom;
             var posx = e.clientX;
             var posy = e.clientY;
             var w = $(window).width();
 			var mapWidth = $('#map').width();
 			var asideWidth = $('.menu_aside').width();
 			var offsetX, offsetY, calc;
 			if ( w > mapWidth ) {
 				calc = (w - mapWidth) / 2 + asideWidth;
 				offsetX = posx - calc;
 			} else {
 				calc = asideWidth;
 				offsetX =posx - calc;
 			}
 			offsetY =posy - asideWidth;
             $('#divZoom').stop().fadeIn('fast').css({
 				top: posy,
 				left: offsetX+15
 			});
 			$('#divZoom').append();
        })

                // 레이어(divCommDiv) zoom popup창 띄우기
        $('#divCommDiv').contextmenu(function(e) {
        	 var layerInfo = e.target.previousSibling.id;
        	 layerNm =  e.target.innerHTML;
             layerMaxZoom = window.mgMap.getLayerById(layerInfo).properties.maxZoom;
             layerMinZoom =window.mgMap.getLayerById(layerInfo).properties.minZoom;
             var posx = e.clientX;
             var posy = e.clientY;
             var w = $(window).width();
 			var mapWidth = $('#map').width();
 			var asideWidth = $('.menu_aside').width();
 			var offsetX, offsetY, calc;
 			if ( w > mapWidth ) {
 				calc = (w - mapWidth) / 2 + asideWidth;
 				offsetX = posx - calc;
 			} else {
 				calc = asideWidth;
 				offsetX =posx - calc;
 			}
 			offsetY =posy - asideWidth;
             $('#divZoom').stop().fadeIn('fast').css({
 				top: posy,
 				left: offsetX+15
 			});
 			$('#divZoom').append();
        })

                // 레이어(divTnDiv) zoom popup창 띄우기
        $('#divTnDiv').contextmenu(function(e) {
        	 var layerInfo = e.target.previousSibling.id;
        	 layerNm =  e.target.innerHTML;
             layerMaxZoom = window.mgMap.getLayerById(layerInfo).properties.maxZoom;
             layerMinZoom =window.mgMap.getLayerById(layerInfo).properties.minZoom;
             var posx = e.clientX;
             var posy = e.clientY;
             var w = $(window).width();
 			var mapWidth = $('#map').width();
 			var asideWidth = $('.menu_aside').width();
 			var offsetX, offsetY, calc;
 			if ( w > mapWidth ) {
 				calc = (w - mapWidth) / 2 + asideWidth;
 				offsetX = posx - calc;
 			} else {
 				calc = asideWidth;
 				offsetX =posx - calc;
 			}
 			offsetY =posy - asideWidth;
             $('#divZoom').stop().fadeIn('fast').css({
 				top: posy,
 				left: offsetX+15
 			});
 			$('#divZoom').append();
        })

        	$('#divZoom').on('click',function(e){
 				var param = new Object();
        		param.menuClickName =layerNm;
        		param.layerMaxZoom =layerMaxZoom;
        		param.layerMinZoom =layerMinZoom;
        		popup('ZoomLevel', '/tango-transmission-web/trafficintg/topology/ZoomLevel.do', '줌 레벨 조회',param);
 			})



        /**레이어:공통 선택시 서브메뉴**/
        $('#checkComm').on('click', function(e){
        	if($('#checkComm').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divCommDiv').show();
        		if($('#SKT_BMTSO').is(':checked')){//체크했으면 하위메뉴보여줘
            		setViewLabelLayerFunc('SKT_BMTSO',true); //T_국소명 레이어
        	 	}
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divCommDiv').hide();
        		$('#DSTB_MTSO').attr('checked', false);
        		setViewLayerFunc("DSTB_MTSO",false);
        		$('#TRD_CNNT_MTSO').attr('checked', false);
        		setViewLayerFunc("TRD_CNNT_MTSO",false);
        	//	$('#SKT_BMTSO').attr('checked', false);
        		setViewLayerFunc("SKT_BMTSO",false);
        		$('#SKT_RPETR').attr('checked', false);
        		setViewLayerFunc("SKT_RPETR",false);
        		setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); // 공통 SKT기지국
        	}
        })

                /**구성레이어 선택시 서브메뉴**/
        $('#checkCom').on('click', function(e){
        	if($('#checkCom').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divlayerComMenu').show();
        		gusungLayerCheck();
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divlayerComMenu').hide();
        		$('#divBulLayer').attr('checked', false);
        		$('#divErpLayer').attr('checked', false);
        	//	$('#checkmgmtGrp').attr('checked', false);
        	//	$('#checkmtsoTyp').attr('checked', false);
        	//	$('#checkmtsoStatCd').attr('checked', false);
        		mtsoErpLayer.clearLayers();
        		mtsoBulLayer.clearLayers();
        	}
        })

    	$('.Check').on('click', function(){
    		gusungLayerCheck();
    	})

        /**개별 레이어보기 체크박스**/
        $('.layerCheck').on('click', function(e){
        	var t = e.target.attributes[0].nodeValue;
        	if(t != null && t != ''){
        		//레이어표시여부
	    		if ($('#'+t).is(':checked')){
	    			setViewLayerFunc(t,true);
	    		}else{
	    			setViewLayerFunc(t,false);
	    		}
	        	if($('#checkMtsoNm').is(':checked')){
	        		if($('#T_SMTSO').is(':checked')){
	        			setViewLabelLayerFunc('T_SMTSO_LABEL',true); //T_국소명 레이어
	        		}else{
	        			setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
	        		}

	        		if($('#T_TMOF').is(':checked')){
	        			setViewLabelLayerFunc('T_TMOF_LABEL',true); //T_전송실명 레이어
	        		}else{
	        			setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
	        		}

	        		if($('#T_COFC_MTSO').is(':checked')){
	        			setViewLabelLayerFunc('T_COFC_MTSO_LABEL',true); //T_중심국_국사명 레이어
	        		}else{
	        			setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); //T_중심국_국사명 레이어
	        		}

	        		if($('#SKT_BMTSO').is(':checked')){

	        			setViewLabelLayerFunc('SKT_BMTSO_LABEL',true); // 공통 SKT기지국
	        		}else{
	        			setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); // 공통 SKT기지국
	        		}
	        		}
	        	}else{
	        		setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); // 공통 SKT기지국
	        		setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); // 공통 SKT기지국
	        		setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
	        		setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
	        	}
        })

//        /**메뉴 ->국사명표시 체크 **/
        $('#checkMtsoNm').on('click', function(e){
        	//명칭 보여주기
        	if($('#checkMtsoNm').is(':checked')){
        		if($('#T_SMTSO').is(':checked')){
        			setViewLabelLayerFunc('T_SMTSO_LABEL',true); //T_국소명 레이어
        		}
        		if($('#T_TMOF').is(':checked')){
        			setViewLabelLayerFunc('T_TMOF_LABEL',true); //T_전송실명 레이어
        		}
        		if($('#T_COFC_MTSO').is(':checked')){
        			setViewLabelLayerFunc('T_COFC_MTSO_LABEL',true); //T_중심국_국사명 레이어
        		}
        		if($('#SKT_BMTSO').is(':checked')){
        			setViewLabelLayerFunc('SKT_BMTSO_LABEL',true); // 공통 SKT기지국
        		}
        		if($('#checkCom').is(':checked')){
        			gusungLayerCheck();
        		}

            //명칭 안 보여주기
        	}else{
        		setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
        		setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
        		setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); //T_중심국_국사명 레이어
        		setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); // 공통 SKT기지국
        		mtsoLayerLabel.clearLayers();
        	}
        })

          $('#checkMoveMap').on('click', function(e){
        	//명칭  안 보여주기
        	if($('#checkMoveMap').is(':checked')){
        		moveFlag = true;
        		$('#searchBtn').hide();
        		btnSearchClickLayerView();

        		if($('#checkCom').is(':checked')){
        			gusungLayerCheck();
        		}
            //명칭  보여주기
        	}else{
        		moveFlag = false;
        //		var searchBtn = new Button($('#searchBtn'));
        		$('#searchBtn').show();
        	}
        })

           /**반경거리 클릭시**/
//        $('.divRadio1').on('click', function(e){
//        	var layerSeleted = $('#' + e.target.id).val();
//	       	 mtsoBulLayer.clearLayers();
//	    	 mtsoErpLayer.clearLayers();
//	    	 getlayerCom(layerSeleted);
//        })
//        $('#divLayer2').on('click', function(e){
//        	if($('#divLayer2').is(':checked')){
//         		var mapBounds = window.mgMap.getBounds(); //지도영역을 구한다..
//         		var param = new Object();
//    	    	param.maplat_start = mapBounds._southWest.lat ;
//    	    	param.maplat_end = mapBounds._northEast.lat;
//    	    	param.maplng_start  = mapBounds._southWest.lng
//    	    	param.maplng_end =  mapBounds._northEast.lng;
//
//     			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getgijiMtsoList', param, 'GET', 'gijiMtsoList');
//        	}
//        	mtsoErpLayer.clearLayers();
//        })
//        /**구성레이어 : 기준 국사 클릭 시  **/
//        $('#radioLayerCheck').on('click', function(e){
//        	if($('#divBulLayer').is(':checked')){
//        		$('#divErpLayer').attr('checked', false);
//        		mtsoErpLayer.clearLayers();
//        		getlayerCom('bulLayer');
//        	}else{
//        		mtsoBulLayer.clearLayers();
//        	}
//        })
//
//        /**구성레이어 : 관리그룹 클릭 시 **/
//        $('#divErpLayer').on('click', function(e){
//        	$('#divBulLayer').attr('checked', false);
//        	if($('#divErpLayer').is(':checked')){
//        		mtsoBulLayer.clearLayers();
//        		getlayerCom('erpLayer');
//        	}else{
//        		mtsoErpLayer.clearLayers();
//        	}
//        })

         $('#divBulLayer').on('click', function(e){
        	 gusungLayerCheck();
        })

        $('#divErpLayer').on('click', function(e){
        	gusungLayerCheck();
        })


          /**구성레이어 : 관리그룹 클릭 시 **/
        $('#checkmgmtGrp').on('click', function(e){
        	if($('#checkmgmtGrp').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divCommgmtGrpNm1').show();
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divCommgmtGrpNm1').hide();
        	}
        })

//        /**구성레이어 : 건물기준/erp공대기준 조회 라디오 버튼 클릭 시  **/
//        $('#layerGrpYn').on('change', function(e){
//        	console.log(e);
//        	var layerSelected = $("#layerGrpYn").getValue();
//        	console.log(layerSelected);
//        })

       /**구성레이어 : 국사 유형 클릭 시 **/
        $('#checkmtsoTyp').on('click', function(e){
        	if($('#checkmtsoTyp').is(':checked')){//체크했으면 하위메뉴보여줘
            	var mgmtSelected = $("#mgmtGrpYn").getValue();
            	if(mgmtSelected == "SKT"){
            		$('#divcommtsoTypSKT').show();
            	}
            	else if(mgmtSelected == "SKB"){
            		$('#divcommtsoTypSKB').show();
            	}else{
            		$('#checkmtsoTyp').attr('checked', false);
            		callMsgBox('','W', "관리그룹 선택 필수입니다." , function(msgId, msgRst){});
            	}

        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divcommtsoTypSKT').hide();
        		$('#divcommtsoTypSKB').hide();
        	//	$('#SK_TRANSMISSIONOFFICE').attr('checked', false);
        	//	$('#SKT_CENTER_MTSO').attr('checked', false);
        	//	$('#SKT_MTSO').attr('checked', false);
        	//	$('#SKT_MTSOID').attr('checked', false);
        	//	$('#SKB_TOP_MTSOTYPNM').attr('checked', false);
        	//	$('#SKB_MTSO').attr('checked', false);
        	//	$('#SKB_MTSOID').attr('checked', false);
        	}
        })

          /**구성레이어 : 국사 상태 클릭 시 **/
        $('#checkmtsoStatCd').on('click', function(e){
        	if($('#checkmtsoStatCd').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divCommtsoStatCd').show();
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divCommtsoStatCd').hide();
        	//	$('#SK_TRANS_01').attr('checked', false);
        	//	$('#SK_TRANS_02').attr('checked', false);
        	//	$('#SK_TRANS_03').attr('checked', false);
        	//	$('#SK_TRANS_99').attr('checked', false);
        	}
        })

      /**구성레이어 : 국사 명 클릭 시 **/
//        $('#checkmtsoNm1').on('click', function(e){
//        	if($('#checkmtsoNm1').is(':checked')){//체크했으면 하위메뉴보여줘
//        		$('#divCommtsoNm1').show();
//        	}else{//체크없앴으면 하위 모드 체크 없애
//        		$('#CommtsoNm1').val(null);
//        		$('#divCommtsoNm1').hide();
//
//        	}
//        })

          /**구성레이어 : 주소 클릭 시 **/
//        $('#checkbldAddr').on('click', function(e){
//        	if($('#checkbldAddr').is(':checked')){//체크했으면 하위메뉴보여줘
//        		$('#divCombldAddr').show();
//        	}else{//체크없앴으면 하위 모드 체크 없애
//        		$('#CombldAddr1').val(null);
//        		$('#divCombldAddr').hide();
//        		//$('#DSTB_MTSO').attr('checked', false);
//        	}
//        })

        //        $('#checkMtsoNm').on('click', function(e){
//        	건물기준 조회 클릭 시
//        	if($('#checkBld').is(':checked')){
//
//        })
//        	ERP 공대기준 조회 클릭 시
//        	if($('#checkERP').is(':checked')){
//
//        })
//
//        $('#divCommDiv').on('click', function(e){
//        	if($('#SKT_BMTSO').is(':checked')){//체크했으면 하위메뉴보여줘
//        		setViewLabelLayerFunc('SKT_BMTSO_LABEL',true); //T_국소명 레이어
//        	}else{
//				setViewLabelLayerFunc('SKT_BMTSO_LABEL',false); //T_국소명 레이어
//			}
//        })

        /**메뉴 마우스 아웃**/
        $('#search').on('mouseenter', function(e){
        	menuDivInit();
        })

        /**맵 마우스 오버**/
        $('#map').on('mouseenter', function(e){
        	menuDivInit();
        })

        /**반경거리 클릭시**/
        $('.divRadio').on('click', function(e){
        	circleRange = $('#' + e.target.id).val();
        	var distance_circle_layer = window.distanceCircleLayer;
	        distance_circle_layer.clearLayers();
	        if(parseInt(circleRange) != 0){
	        	var circle_latlng = window.mgMap.getCenter();
	 		    var distance_circle = L.circle([ circle_latlng.lat, circle_latlng.lng], parseInt(circleRange));
	 		    distance_circle_layer.addLayer(distance_circle);
	        }
        })

    	/*...........................*
		        링조회 관련 이벤트
		 *...........................*/
     	 /**페이지 번호 클릭시**/
	   	 $('#ringListGrid').on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setRingListGrid(eObj.page, eObj.pageinfo.perPage);
         });

	   	 /**페이지 selectbox 변경시**/
         $('#ringListGrid').on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	setRingListGrid(1, eObj.perPage);
         });

	   	 /**링조회 버튼으로 조회**/
	   	 $('#ringListSearBtn').on('click', function(e) {
	   		setRingListGrid(1,perPage);
	     });

	   	 /**링조회 엔터키로 조회**/
         $('#searchRingForm').on('keydown', function(e){
    		if (e.which == 6  ){
    			setRingListGrid(1,perPage);
      		}
    	 });

         $("form").submit(function (e) {
        	 e.preventDefault();//링조회엔터시 전체화면refresh방지
         });

        /**링row를 클릭했을때  링지도표시**/
    	 $('#ringListGrid').on('click', '.bodycell', function(e){
      	    //GIS 링관리번호 조회
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		var param = new Object();
     		param.ntwkLineNo = dataObj.ntwkLineNo;
     		param.layerId = "RING_MAP_LAYER";
 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisRingInfList', param, 'GET', 'searchGisRingInf');
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
   // 		var zoomLevel = window.mgMap.getZoom();
   // 		var tempMtsoCdList = mtsoDetlTypCdList;
    //		var tempEqpCdList = null;

/*    		var eqpListTemp = $('#orgSearchmtsoNmForm').serialize().split("&");
			for(i=0; i<= eqpListTemp.length-1;i++){
				console.log(eqpListTemp)
				if(eqpListTemp[i].substring(0,3) =="eqp"){
					eqpNmCdList =  eqpListTemp[i].replace("eqpNmCdList=","")
				   if(eqpNmCdList == "RING_MUX"){
					   tempEqpCdList= "RING_MUX";
			    	}
				}
			}*/
			searchAroundMtso("");
//			if(tempMtsoCdList == "001,002,003," && tempEqpCdList == "RING_MUX"){
//				 if(parseInt(zoomLevel) < 6) {
//		            	//조회대상구역이 넓습니다. 지도의 줌레벨을 13이상으로 설정한 후 조회하세요.
//		         		callMsgBox('','W', "줌 레벨을 6 이상으로 설정한 후 조회하세요" , function(msgId, msgRst){});
//	             }else{
//	            	searchAroundMtso("");//주변국사조회
//	            }
//			}
//
//			else {
//				if(parseInt(zoomLevel) < 13) {
//            	//조회대상구역이 넓습니다. 지도의 줌레벨을 13이상으로 설정한 후 조회하세요.
//         		callMsgBox('','W', configMsgArray['changeZoomLevel'] , function(msgId, msgRst){});
//	             }else{
//	            	searchAroundMtso("");//주변국사조회
//	            }
//			}
         });

      	/**주변 링  버튼으로 조회**/
    	 $('#tab-2RingSearchBtn').on('click', function(e) {
    		 searchAroundRing("");;//주변 링 조회

//		 	if(topoSclCdList.length == 0 && ntwkTypCdList.length == 0 ){
//		 		callMsgBox('','W', "망종류,망구분 선택 해 주시길 바랍니다." , function(msgId, msgRst){});
//		 	}else{
//	    		 var zoomLevel = window.mgMap.getZoom();
//	             if(parseInt(zoomLevel) < 13) {
//	            	//조회대상구역이 넓습니다. 지도의 줌레벨을 13이상으로 설정한 후 조회하세요.
//	         		callMsgBox('','W', configMsgArray['changeZoomLevel'] , function(msgId, msgRst){});
//	             }else{
//	            	 searchAroundRing("");;//주변 링 조회
//	            }
//		 	}
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
 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
    	 });

        /** 국사우클릭 관련 이벤트**/
    	 $(document).contextmenu(function(e) {
     		var feature = window.mgMap.getSelectedFeatures();
     		//중첩국지국정보처리 들어가야지
     		e.preventDefault();
     	});
     	/*...........................*
            주변국사조회 관련 이벤트
     	 *...........................*/
    	 /**주변국사row를 클릭했을때 지도에 표시하고 국사-장비리스트 조회**/
    	 $('#orgListGrid').on('click', '.bodycell', function(e){
    	    var dataObj = AlopexGrid.parseEvent(e).data;
    	    //GIS 국사관리번호 조회 지도에 표시
     		dataObj.moveMap = false;//지도이동 안하겠다.
  			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
  			//장비리스트 조회
    		var param = {mtsoId:dataObj.mtsoId};
			$('#eqpListGrid').alopexGrid('showProgress');
 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getEqpList', param, 'GET', 'searchEqpList');
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
 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRingDtlInf', dataObj, 'GET', 'searchRingDtlInf');
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
     			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisRingInfList', param, 'GET', 'searchGisRingInf');
         	//체크박스 해제
         	}else{
         		//해당 레이어지우기
         		clearLayerFunc(rangeRingLayerId);
         	}
         });

       /**링-장비row를 클릭했을때  관리국사지도표시**/
      	 $('#ringEqpListGrid').on('click', '.bodycell', function(e){
      		//GIS 국사관리번호 조회
      		var dataObj = AlopexGrid.parseEvent(e).data;
      		dataObj.moveMap = false; //지동이동 안 할거다
   			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
      	 });

	};//이벤트리스너 끝


    /*...........................*
	    조회버튼 클릭
	 *...........................*/
	$('#searchBtn').on('click', function(e){
		btnSearchClickLayerView();
		if($('#checkCom').is(':checked')){
			gusungLayerCheck();
		}
	 });

	 //구성 레이어 클릭
	function gusungLayerCheck(){
		mtsoBulLayer.clearLayers();
		mtsoErpLayer.clearLayers();
		if($('#divBulLayer').is(':checked')){
    		getlayerCom('bulLayer');
		}else if($('#divErpLayer').is(':checked')){
			getlayerCom('erpLayer');
		}else{
			getlayerCom('erpLayer');
			getlayerCom('bulLayer');
		}
	}

	//구성레어이어 sub 메뉴
	function btnSearchClickLayerView(){
		var feature = window.mgMap.getSelectedFeatures();
		if($('#checkSkb').is(':checked')){
			$('#divSkbDiv input:checked').each(function(i,ob){
				setViewLayerFunc(ob.id,true);
			})
		}
		if($('#checkSkt').is(':checked')){
			$('#divSktDiv input:checked').each(function(i,ob){
				setViewLayerFunc(ob.id,true);
			})
		}
		if($('#checkTn').is(':checked')){
			$('#divTnDiv input:checked').each(function(i,ob){
				setViewLayerFunc(ob.id,true);
			})
		}
		if($('#checkComm').is(':checked')){
			$('#divCommDiv input:checked').each(function(i,ob){
				setViewLayerFunc(ob.id,true);
			})
		}
		if($('#checkMtsoNm').is(':checked')){
			if($('#T_SMTSO').is(':checked')){
    			setViewLabelLayerFunc('T_SMTSO_LABEL',true); //T_국소명 레이어
    		}
    		if($('#T_TMOF').is(':checked')){
    			setViewLabelLayerFunc('T_TMOF_LABEL',true); //T_전송실명 레이어
    		}
    		if($('#T_COFC_MTSO').is(':checked')){
    			setViewLabelLayerFunc('T_COFC_MTSO_LABEL',true); //T_중심국_국사명 레이어
    		}
    		if($('#SKT_BMTSO').is(':checked')){
    			setViewLabelLayerFunc('SKT_BMTSO_LABEL',true); // 공통 SKT기지국
    		}
		}
	}

    /*==========================*
	 * 구성 레이어 erp기준공대 및 기준 국사 보여주기/안보여주기
	 *==========================*/
    function getlayerCom(clickNm) {
    	var zoomLevel = window.mgMap.getZoom();
     	var param = new Object();
 		var mapBounds = window.mgMap.getBounds(); //지도영역을 구한다.
 		var maplat_start = mapBounds._southWest.lat ;
 		var maplat_end = mapBounds._northEast.lat;
 		var maplng_start  = mapBounds._southWest.lng
 		var maplng_end =  mapBounds._northEast.lng;
////    	 window.mgMap.clearSelectLayer();
//         if(parseInt(zoomLevel) < 10) {
////        	//조회대상구역이 넓습니다. 지도의 줌레벨을 13이상으로 설정한 후 조회하세요.
//     		callMsgBox('','W', "줌 레벨을 10이상으로 설정한 z후 조회하세요" , function(msgId, msgRst){});
//         }else{
     		param.maplat_start = maplat_start;
     		param.maplat_end = maplat_end;
     		param.maplng_start = maplng_start;
     		param.maplng_end = maplng_end;

     		mgmtvalue = $("#mgmtGrpYn").getValue();
     		param.mgmtvalue = mgmtvalue;
     		//국사유형 (skt,skb 확인 해주어야함)
     		if($('#checkmtsoTyp').is(':checked')){
     			if(mgmtvalue =='SKT'){
     				$('#divcommtsoTypSKT input:checked').each(function(i,ob){
     					if(i == 0){
     						mtsotypalue = ob.id + ",";
     					}else{
     						mtsotypalue += ob.id  + ","
     					}
     					param.mtsotypalue = mtsotypalue;
     				})
     			}else if(mgmtvalue == 'SKB'){
     				$('#divcommtsoTypSKB input:checked').each(function(i,ob){
     					if(i == 0){
     						mtsotypalue = ob.id + ",";
     					}else{
     						mtsotypalue += ob.id  + ","
     					}
     				})
     				param.mtsotypalue = mtsotypalue;
     			}else{
     				param.mtsotypalue = "";
     			}
     		}
     		//국사상태
     		if($('#checkmtsoStatCd').is(':checked')){
       			$('#divCommtsoStatCd input:checked').each(function(i,ob){
     				if(i == 0){
     					mtsostatvalue = ob.id + ",";
     				}else{
     					mtsostatvalue += ob.id + ",";
     				}
     			})
     			param.mtsostatvalue = mtsostatvalue;
     		}else{
     			param.mtsostatvalue = "";
     		}
     		if(clickNm == "bulLayer"){
     			param.moveMap = false; //지동이동 안 할거다
    			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getbulLayer', param, 'GET', 'searchbulLayer');
     		}
         else if(clickNm == "erpLayer"){
        	   param.moveMap = false; //지동이동 안 할거다
    			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/geterpLayer', param, 'GET', 'searcherpLayer');
     		}
    }


    /*==========================*
	 * 레이어 보여주기/안보여주기
	 *==========================*/
    function setViewLayerFunc(layerId, visible) {
	    var layer = window.mgMap.getLayerById(layerId);
        layer.setVisible(visible);//보여주기 여부
	 }

    /*===============================*
	 * 명칭 레이어 보여주기/안보여주기
	 *===============================*/
    function setViewLabelLayerFunc(layerId, visible) {
        //명칭레이어들 가져와서
	    var label_layer = window.mgMap.getLayerById(layerId);
	    if(visible){//보여주기
	    	label_layer.setVisible(true);
			var label_style = L.MG.StyleCfg.getStylesByLayerName(label_layer.getId())[0];
			label_style.vAlign = 'top';
			label_layer.properties.minZoom = 1;
			//label_style.mAlign = L.point([10, 10]);
			label_style.color = '#050099';
			var label_style_option = { type: 'TEXT', options: label_style };
			label_layer.setUserStyleConfig(label_style_option).refresh(true);
	    }else{//안보여주기
	    	label_layer.setVisible(false);
	    }
	}

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
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getSelectRingList', param, 'GET', 'searchRing');
	}

    /*==========================*
	 * 국사조회실행
	 *==========================*/
	var setMtsoListGrid = function(page, rowPerPage){
    	$('#mtsoPageNo').val(page);
    	$('#mtsoRowPerPage').val(rowPerPage);
    	 //var param =  $("#searchMtsoForm").getData();
    	 var param =  $("#searchMtsoForm").serialize();
//     	param += '&' + 'mtsoTypCdList=' + '1';
//     	param += '&' + 'mtsoTypCdList=' + '2';
//     	param += '&' + 'mtsoTypCdList=' + '3';
   		 $('#mtsoListGrid').alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', param, 'GET', 'searchMtso');
    }



	 /*==========================*
	 * 시설물선택하면 시설물 정보 가져오기
	 *==========================*/
	function onClickFeatures(featuresObj) {
		var cusLayer = window.mgMap.getSelectedFeatures();
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
       			 layrNm =='T_중심국_국사' ||
       			 layrNm == 'SKT기지국') {
			    //시설물관리번호로 국사정보 가져오기
				var param = new Object();
				param.mtsoMgmtNo = mgmtNo;//GIS국사관리번호
				param.mtsoLatVal = geometry.coordinates[1];//featureObj의 위도
				param.mtsoLngVal = geometry.coordinates[0];//featureObj의 경도
				httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getMtsoInf', param, 'GET', 'searchMtsoInf');
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
			}else if(layrNm == 'MTSO_ERP_LAYER'){
				var param = new Object();
				//왼쪽메뉴등장
 		        showLeftContainer();
				param.mtsoMgmtNo =featuresObj.features[0].feature.mgmtNo;//GIS국사관리번호
				httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getMtsoErpInf', param, 'GET', 'searchguMtsoInf');
//

			//	searchMtsoInf(featuresObj.features[0].feature.mgmtNo);
			//	searchAroundRing();
			//	httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/selectErpLayer', param, 'GET', 'selectErpLayer');
			}else if(layrNm == 'MTSO_BUL_LAYER'){
				var param = new Object();
				//왼쪽메뉴등장
 		       showLeftContainer();
				param.mtsoMgmtNo =featuresObj.features[0].feature.mgmtNo;//GIS국사관리번호
				httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getMtsoBulInf', param, 'GET', 'searchguMtsoInf');
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
			var roadmCheck   = false;
			var ptsCheck     = false;
			var ringmuxCheck = false;
			var l2swCheck    = false;
			var l3swCheck    = false;
			var msppCheck    = false;
			//장비구분 조건 체크한다.
//			var roadmCheck   = false; if ($('#ROADM').is(':checked')){ roadmCheck = true; };
//			var ptsCheck     = false; if ($('#PTS').is(':checked')){ ptsCheck = true; };
//			var ringmuxCheck = false; if ($('#RING_MUX').is(':checked')){ ringmuxCheck = true; };
//			var l2swCheck    = false; if ($('#L2SW').is(':checked')){ l2swCheck = true; };
//			var l3swCheck    = false; if ($('#L3SW').is(':checked')){ l3swCheck = true; };
//			var msppCheck    = false; if ($('#MSPP').is(':checked')){ msppCheck = true; };
			//하이라이트해 준 기준국사있으면 clear하고
			if(mtsoColorIndex != null && mtsoColorIndex != ""){
				$('#orgListGrid').alopexGrid("updateOption", { rowOption : {
	                 styleclass : function(data, rowOption){
	                                  if(data._index.row == mtsoColorIndex ){
	                                      return 'row-highlight-unselect'; } } } });
				mtsoColorIndex = "";
			}
			var eqpListTemp = $('#orgSearchmtsoNmForm').serialize().split("&");
			for(i=0; i<= eqpListTemp.length-1;i++){
				mtsoDetlTypCdList=	 $("#mtsoDetlTypCdList").getData().mtsoDetlTypCdList;

				if(eqpListTemp[i].substring(0,3) =="eqp"){
					eqpNmCdList =  eqpListTemp[i].replace("eqpNmCdList=","")
				    if(eqpNmCdList == "ROADM"){
				    	roadmCheck = true;
				    }
				    else if(eqpNmCdList == "PTS"){

				    	ptsCheck= true;
			    	}
				    else if(eqpNmCdList == "RING_MUX"){

				    	ringmuxCheck= true;
			    	}
				    else if(eqpNmCdList == "L2SW"){

				    	l2swCheck= true;
			    	}
				    else if(eqpNmCdList == "L3SW"){

				    	l3swCheck= true;
			    	}
				    else if(eqpNmCdList == "MSPP"){

				    	msppCheck= true;
			    	}
				}
			}
			//파라미터생성
			var param= "geoWkt="+boundsWkt+
	           "&roadmCheck="+roadmCheck+
	           "&ringmuxCheck="+ringmuxCheck+
	           "&ptsCheck="+ptsCheck+
			   "&l2swCheck="+l2swCheck+
			   "&l3swCheck="+l3swCheck+
			   "&msppCheck="+msppCheck+
			   "&mtsoDetlTypCdList="+mtsoDetlTypCdList+
			   "&mtsoId="+mtsoId;
		//	param += $('#orgSearchmtsoNmForm').serialize();
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
	//	var fdfYN =  $("#searchFDFYN").getValue();
		topoSclCdList = $("#topoSclCdList").getData().topoSclCdList;
		ntwkTypCdList = $("#ntwkTypCdList").getData().ntwkTypCdList;
		var param= "geoWkt="+boundsWkt+"&topoSclCdList="+topoSclCdList+"&ntwkTypCdList="+ntwkTypCdList ;
		$('#rangeRingGrid').alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getRangeRingList', param, 'GET', 'searchRangeRingList');
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
	   			faceName : "궁서",
	   			size : "9",
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

//    function drawBulTitle(response) {
//    	var features = [];
//    	_.map(response.LayerList, function(item, index) {
//    		var feature = {};
//    		feature.type = "Feature";
//    		feature.properties = item;
//    		feature.properties.LABEL = item.mtsoNm;
//    		feature.geometry = {};
//    		feature.geometry.type = 'Point';
//    		feature.geometry.coordinates = [item.mtsoLngVal , item.mtsoLatVal];
//    		feature.keyNames = ["LABEL"];
//    		feature.style = [ { id : "KEPCO_TLPL_TEXT" ,type: 'text'} ];
//
//    		features[index] = feature;
//    	});
//    	var titleLayer = mgMap.getCustomLayerByName("MTSO_BUL_LAYER_LABEL");
//		titleLayer.clearLayers();
//    	if (titleLayer) {
//    		titleLayer.clearLayers();
//        } else {
//        	titleLayer =mgMap.getCustomLayerByName("MTSO_BUL_LAYER_LABEL");
//        }
//
//    	var result = {
//    			features : features
//    	};
//
//    	titleLayer.addData(result);
//    	var textIconOption = {
//    			labelColumn : "LABEL",
//	   			faceName : "궁서",
//	   			size : "9",
//	   			color : "blue",
//	   			hAlign : "middle",
//	   			vAlign : "top",
//	   			opacity : 1.0,
//    	};
//    	for (var key in titleLayer._layers) {
//    		var layer = titleLayer._layers[key];
//    		layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL, hAlign : "middle", vAlign : "top"})));
//    	}
 //   }
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
 		    		var param = {mtsoId:mtsoId};
 					$('#eqpListGrid').alopexGrid('showProgress');
 		 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getEqpList', param, 'GET', 'searchEqpList');
 		    	//주변국사리스트에 없으면 지도이동하고 새로 주변링과 주변국사 조회
 		    	}else{
 		    		//가운데로 이동시키고
 		    		window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], window.mgMap.getZoom());
 		    	//	window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], 13);
 		    		//반경거리 표시해주고
 			        if (circleRange != 0){
 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 			        distance_circle_layer.clearLayers();
 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
 					    distance_circle_layer.addLayer(distance_circle);
 			        }
 		    		//주변국사조회
 			      //  searchAroundMtso(mtsoId);
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
			$('#orgListGrid').alopexGrid('hideProgress');
           	$('#orgListGrid').alopexGrid('dataSet', response.rangeMtsoList, "");
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
	 			var param = {mtsoId:kijunMtsoId};
	 			$('#eqpListGrid').alopexGrid('showProgress');
	 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getEqpList', param, 'GET', 'searchEqpList');

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
       })
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

//		for(var i=0; i<response.length; i++){
//			var resObj = response[i];
//			var addHtml = '<div class="mtsoDetlTypeCheck">'+
//							 '<input id="mtsoTypCd'+resObj.comCd+'" type="checkbox">' +
//						       '<span style="font-size: 12px; font-weight: bold;">'+resObj.comCdNm+ '</span>' +
//						     '</input>' +
//					      '</div>';
//			$('#mtsoDivMenu').append(addHtml);
//		}
////
////		 //국사유형체크 이벤트준다
//        $('mtsoNmCdList').on('click', function(e){
//        	console.log("click");
//        	var t = e.target.attributes[0].nodeValue;
//        	console.log(t);
//        	if(t.substring(0,9) == 'mtsoTypCd'){ //isNaN(t):false --> 숫자이다
//        	    //코드값 리스트에 넣어주기
//        		var arr = [];
//
//        		if ($('#'+t).is(':checked')){
//        			mtsoDetlTypCdList.push(t.substring(9, t.length));
//        		}else{
//        			var cnt = 0;
//        			for(i=0; i<mtsoDetlTypCdList.length; i++ ){
//	        			if(mtsoDetlTypCdList[i] != null && mtsoDetlTypCdList[i] != "" && mtsoDetlTypCdList[i] != t.substring(9, t.length)){
//	        				arr[cnt] = mtsoDetlTypCdList[i];
//	        				cnt++;
//	        			}
//	        		}
//
//        		    mtsoDetlTypCdList = arr;
//        		}
//        	}
//       })
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
    		var gisMtsoInf = null; gisMtsoInf = response.gisMtsoInf;
	       //팝업할 국사정보 세팅
 		    var html =
		            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
		            '<b>시설코드:</b><%pop_mtsoMgmtNo%><br>'+
		            '<b>국사번호:</b><%pop_mtsoId%><br>' +
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
// 	 	 			 window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], 13);
 	 	 			    //반경거리 표시해주고
 	 			        if (circleRange != 0){
 	 			        	var distance_circle_layer = window.distanceCircleLayer;
 	 	 			        distance_circle_layer.clearLayers();
 	 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
 	 					    distance_circle_layer.addLayer(distance_circle);
 	 			        }
 	 			        //지도이동있으면 주변국사조회
 	 		 			//searchAroundMtso("");
 	 		 			//주변링조회
 	 		 		//	searchAroundRing();
 	 		 			//왼쪽메뉴등장
 	 		 	//		showLeftContainer();
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
 		 		//	showLeftContainer();               //왼쪽메뉴등장
 			   }
 			    //국사포인트 표시하고 정보팝업
		        var marker = L.marker([latlng.lat, latlng.lng]);
		        mtsoInfLayer.addLayer(marker);
		        html = html.replace('<%pop_mtsoMgmtNo%>',gisMtsoInf.mtsoMgmtNo);
		        marker.bindPopup(html).openPopup();
 			}
    	}

    	/*...........................*
        ERP공대 지도에 표시
    	*...........................*/
    	if(flag =="searcherpLayer"){
    		//레이어초기화
    		var mtsoErpLayer = window.mtsoErpLayer;
    		var style = null;
    		mtsoErpLayer.clearLayers();
    		var result = {features: []};
    		if (response.LayerList.length !== 0) {
    			for(i=0; i<response.LayerList.length;i++){
    				var param = {};
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
				    	param.type = 'Point';
				    	param.style = style;
				    	param.mgmtNo = response.LayerList[i].mtsoId;
				    	param.coord =[response.LayerList[i].mtsoLngVal,response.LayerList[i].mtsoLatVal];
				    	result.features.push(_M.createFeature(param));
    			}
    		}
    		mtsoErpLayer.addData(result);
    		if($('#checkMtsoNm').is(':checked')){
    			drawTitle(response);
    		}else{
    			mtsoLayerLabel.clearLayers();
    		}
    		//window.mgMap.fitBounds(mtsoErpLayer.getBounds());
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

    	/*...........................*
        기준국사 지도에 표시
    	*...........................*/
//    	if(flag =="gijiMtsoList"){
//    		//커스텀 레이어 가져오기
//    		var mtsoBulLayer = window.mtsoBulLayer;
//    		mtsoBulLayer.clearLayers();
//    		//features 변수 설정
//    		//layerList 확인
//    		if (response.LayerList.length !== 0) {
// 			    //feature 생성
//    			for(i=0; i<response.LayerList.length;i++){
////    				var marker = L.marker([response.LayerList[i].mtsoLatVal, response.LayerList[i].mtsoLngVal]);
//    				var param = {};
//			    	param.type = 'Point';
//			    	param.style = 'SUBMIT_SETL_PCE_STYLE_POINT_1';
//			    	param.mgmtNo = response.LayerList[i].mtsoId;
//			    	param.coord =[response.LayerList[i].mtsoLngVal,response.LayerList[i].mtsoLatVal];
//			    	result.features.push(_M.createFeature(param));
//    			}
//    		}
//    		//데이터 넣어주기
//    		mtsoBulLayer.addData(result);
//    		//화면에표시
//    		mgMap.fitBounds(mtsoBulLayer.getBounds());
//    		window.mgMap.setView([response.LayerList[0].mtsoLngVal,response.LayerList[0].mtsoLatVal], 10);
//    	}

    	if(flag == 'searchguMtsoInf'){
			//선택된 이벤트레이어 초기화
			window.mgMap.clearSelectLayer();
			//국사표시
			var mtsoInfLayer = window.mtsoInfLayer;
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();
	        var marker = L.marker([response.LayerList[0].mtsoLatVal, response.LayerList[0].mtsoLngVal], {radius:20});
	        mtsoInfLayer.addLayer(marker);
			var mtsoId = response.LayerList[0].mtsoId;


    		//국사ID가 없을 경우
    		if (mtsoId == null || mtsoId == "") {
    			//국사정보팝업
 				var html =
 		            '<b>경도    :</b><%pop_mtsoLatVal%><br>'+
 		            '<b>위도    :</b><%pop_mtsoLngVal%>';
 		        html = html.replace('<%pop_mtsoLatVal%>',response.LayerList[0].mtsoLatVal);
 		        html = html.replace('<%pop_mtsoLngVal%>',response.LayerList[0].mtsoLngVal);
 		        marker.bindPopup(html).openPopup();
 		        //장비리스트 클리어
 		        $('#eqpListGrid').alopexGrid('dataEmpty');
 			}else{//국사ID가 있는 경우
 				//국사정보팝업
 				var html =
 		            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
 		            '<b>국사번호:</b><%pop_mtsoId%><br>'+
 		            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
 		            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
 		            '<b>건물주소:</b><%pop_bldAddr%>';
 		        html = html.replace('<%pop_mtsoNm%>',response.LayerList[0].mtsoNm);
 		        html = html.replace('<%pop_mtsoId%>',response.LayerList[0].mtsoId);
 		        html = html.replace('<%pop_mtsoTyp%>',response.LayerList[0].mtsoTyp);
 		        html = html.replace('<%pop_mtsoStat%>',response.LayerList[0].mtsoStat);
 		        html = html.replace('<%pop_bldAddr%>',response.LayerList[0].bldAddr);
 		        marker.bindPopup(html).openPopup();
 				//왼쪽메뉴등장
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
 		    		var param = {mtsoId:mtsoId};
 					$('#eqpListGrid').alopexGrid('showProgress');
 		 			httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getEqpList', param, 'GET', 'searchEqpList');
 		    	//주변국사리스트에 없으면 지도이동하고 새로 주변링과 주변국사 조회
 		    	}else{
 		    		//가운데로 이동시키고
 		    		window.mgMap.setView([response.LayerList[0].mtsoLatVal, response.LayerList[0].mtsoLngVal],window.mgMap.getZoom());
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
 			}
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
    			window.mgMap.setView([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x]);
    			//window.mgMap.setView([e.target[e.target.selectedIndex].dataset.y, e.target[e.target.selectedIndex].dataset.x], 13);
    			//반경거리 표시해주고
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
	 * select 조회조건 코드 세팅
	 *==========================*/
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getNtwkTypCdList', null, 'GET', 'NtwkTypData'); // 망구분 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getTopoList', null, 'GET', 'TopoData'); // 링유형 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02016', null, 'GET', 'mtsoDetlTyp'); // 국사 유형

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStat'); //국사 상태
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm'); // 관리 그룹
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
		        },{
					id : "KEPCO_TLPL_TEXT",
					type : L.MG.StyleCfg.STYLE_TYPE.TEXT, // 텍스트 타입
					options : {
						labelColumn : "LABEL",
						faceName : "궁서",
						size : "9",
						color : "blue",
						hAlign : "midlle",
						vAlign : "top",
						opacity : 1.0,
					}

		        }
	    ];

	    //시스템에 사용할 스타일 설정
	    L.MG.StyleCfg.setCustomStyles(styles);

  	}

	/*==========================*
	 *  그리드 생성
	 *==========================*/
    function initGrid() {
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
	    	height: '320px',
	    	rowOption : {
	    		defaultHeight: 30
	    	},
	    	columnMapping: [{
    			key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '105px'
			}, {
    			key : 'roadmCnt', align:'center',
				title : 'ROADM',
				width: '30px'
			}, {
    			key : 'ptsCnt', align:'center',
				title : 'PTS',
				width: '30px'
			}, {
    			key : 'ringmuxCnt', align:'center',
				title : 'Ring MUX',
				width: '30px'
			}, {
    			key : 'ltwoCnt', align:'center',
				title : 'L2 S/W',
				width: '30px'
			}, {
    			key : 'lthreeCnt', align:'center',
				title : 'L3 S/W',
				width: '30px'
			}, {
    			key : 'msppCnt', align:'center',
				title : 'MSPP',
				width: '30px'
			}, {
    			key : 'mtsoDistance', align:'center',
				title : '거리',
				width: '35px'
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
			}],
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
	    	height: '326px',
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
				width: '5px'
			}, {
    			key : 'ringMgmtNo', align:'left',
				title : '링관리번호',
				width: '5px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    //링 장비리스트
	    $('#ringEqpListGrid').alopexGrid({
	    	headerRowHeight: 25,
	    	height: '270px',
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
        	height: '530px',
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [{
    			key : 'ntwkLineNm',
    			align:'left',
				title : '링이름',
				width: '180px'
			},{
    			key : 'topoSclNm',
				title : '망종류',
				width: '60px'
			},{
    			key : 'ntwkTypNm',
				title : '망구분',
				width: '60px'
			}, {
    			key : 'ntwkLineNo',
				title : '링 번호',
				width: '5px'
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
        	height: '502px',
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

		gridHide();
    };

    /*==========================*
	 * 컬럼 숨기기
	 *==========================*/
    function gridHide() {
    	//주변국사리스트 숨김데이터
    	var orgListHideColList = ['mtsoId', 'mtsoLatVal', 'mtsoLngVal','mtsoTyp','mtsoStat','bldAddr','mtsoDistance'];
    	$('#orgListGrid').alopexGrid("hideCol", orgListHideColList, 'conceal');

    	//링리스트 숨김테이터
    	var ringListHideColList = ['ntwkLineNo'];
    	$('#ringListGrid').alopexGrid("hideCol", ringListHideColList, 'conceal');

    	//국사리스트 숨김데이터
    	var mtsoListHideColList = ['mtsoLatVal', 'mtsoLngVal','mtsoMgmtNo'];
    	$('#mtsoListGrid').alopexGrid("hideCol", mtsoListHideColList, 'conceal');

    	//주변링리스트 숨김 데이터
    	var rangeRingHideColList = ['ntwkLineNo', 'ringMgmtNo'];
    	$('#rangeRingGrid').alopexGrid("hideCol", rangeRingHideColList, 'conceal');

    	//링-장비리스트 숨김 데이터
    	var ringEqpHideColList = ['mtsoId','mtsoLatVal', 'mtsoLngVal','mtsoTyp','mtsoStat','bldAddr','eqpId'];
    	$('#ringEqpListGrid').alopexGrid("hideCol", ringEqpHideColList, 'conceal');

	};


/* 	$('#mtsoDetlTypCdList').multiselect({
  		 open: function(e){
  			mtsoDetlTypCdList = $("#mtsoDetlTypCdList").getData().mtsoDetlTypCdList;
  		 },
  		 beforeclose: function(e){
  			 var codeID =  $("#mtsoDetlTypCdList").getData();
       		 var param = "";
       		 if(mtsoDetlTypCdList+"" != codeID.mtsoDetlTypCdList+""){
	         		 if(codeID.mtsoDetlTypCdList == ''){
	         		 }else {
	         			for(var i=0; codeID.mtsoDetlTypCdList.length > i; i++){
	         				param += codeID.mtsoDetlTypCdList[i] + ",";
	         			}
	         			mtsoDetlTypCdList = param;
	         		 }
       		 }
  		 }
  	 });*/


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

/* 	$('#topoSclCdList').multiselect({
 		 open: function(e){
 			topoSclCdList = $("#topoSclCdList").getData().topoSclCdList;
 		 },
 		 beforeclose: function(e){
 			 var codeID =  $("#topoSclCdList").getData();
      		 var param = "";
      		 if(topoSclCdList+"" != codeID.topoSclCdList+""){
	         		 if(codeID.topoSclCdList == ''){
	         		 }else {
	         			for(var i=0; codeID.topoSclCdList.length > i; i++){
	         				param += codeID.topoSclCdList[i] + ",";
	         			}
	         			topoSclCdList = param;
	         		 }
      		 }
 		 }
 	 });*/

/* 	$('#ntwkTypCdList').multiselect({
 		 open: function(e){
 			ntwkTypCdList = $("#ntwkTypCdList").getData().ntwkTypCdList;
 		 },
 		 beforeclose: function(e){
 			 var codeID =  $("#ntwkTypCdList").getData();
      		 var param = "";
      		 if(ntwkTypCdList+"" != codeID.ntwkTypCdList+""){
	         		 if(codeID.ntwkTypCdList == ''){
	         		 }else {
	         			for(var i=0; codeID.ntwkTypCdList.length > i; i++){
	         				param += codeID.ntwkTypCdList[i] + ",";
	         			}
	         			ntwkTypCdList = param;
	         		 }
      		 }
 		 }
 	 });*/

    //관리그룹 선택시 이벤트
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

