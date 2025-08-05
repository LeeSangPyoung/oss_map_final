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
	
	//링조회, 국사조회시 페이당 줄수
	var perPage = 100;
	
	var mtsoParam = null;
	
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
        	
            //시설물 선택 이벤트
        	map.on("mg-selected-features", onClickFeatures);	
        	//사용자 레이어 스타일 설정
            addUserLayerStyles();
             
        });
        
        /** 메뉴,화면 세팅  **/
        menuDivInit();
        /*//메뉴 시작 위치 조정
        mContainer = document.getElementById("menuContainer");
        tab = document.getElementById('tab');
        
        var gap = tab.scrollWidth;
        
        //컨테이너 참조 구하기 (사이드 메뉴)
        startX = parseInt(-START_WIDTH) + gap + 17;
        mContainer.style.width = START_WIDTH + gap + "px";
        mContainer.style.marginLeft = startX + "px";
        
        //메뉴 시작 위치 조정
        mContainer2 = document.getElementById("menuContainer2");
        tab2 = document.getElementById('tab2');
        
        var gap2 = tab.scrollWidth;
        
        //컨테이너 참조 구하기 (사이드 메뉴)
        startX2 = parseInt(-START_WIDTH2) + gap + 17;
        mContainer2.style.width = START_WIDTH2 + gap2 + "px";
        mContainer2.style.marginRight = startX2 + "px";*/
        
        //select값 초기화
        setSelectCode();
        
        /** 이벤트 걸기**/
        setEventListener();
      
    }
   
    /*==========================*
	 * 이벤트 걸기
	 *==========================*/ 
    function setEventListener() {
    	/*...........................*
		    메뉴 관련
		 *...........................*/
    	/** 거리측정**/
    	$('#distanceBtn').on('click', function(e){
            mgMap.setMode('trail-distance');
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
        	$('#divCommDiv').hide();
        	
        	var t = e.target.attributes[e.target.attributes.length - 1].nodeValue;
        	
        	if(t != null && t != ''){
        		console.log("background-color t:"+t);
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
        	}
        })
        
        /**레이어:SKT선택시 서브메뉴**/
        $('#checkSkt').on('click', function(e){
        	if($('#checkSkt').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divSktDiv').show();
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divSktDiv').hide();
        		$('#T_SMTSO').attr('checked', false);
        		setViewLayerFunc("T_SMTSO",false);
        		$('#T_TMOF').attr('checked', false);
        		setViewLayerFunc("T_TMOF",false);
        		$('#T_COFC_MTSO').attr('checked', false);
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
        
        /**레이어:공통 선택시 서브메뉴**/
        $('#checkComm').on('click', function(e){
        	if($('#checkComm').is(':checked')){//체크했으면 하위메뉴보여줘
        		$('#divCommDiv').show();
        	}else{//체크없앴으면 하위 모드 체크 없애
        		$('#divCommDiv').hide();
        		$('#DSTB_MTSO').attr('checked', false);
        		setViewLayerFunc("DSTB_MTSO",false);
        		$('#TRD_CNNT_MTSO').attr('checked', false);
        		setViewLayerFunc("TRD_CNNT_MTSO",false);
        		$('#SKT_BMTSO').attr('checked', false);
        		setViewLayerFunc("SKT_BMTSO",false);
        		$('#SKT_RPETR').attr('checked', false);
        		setViewLayerFunc("SKT_RPETR",false);
        	}
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
        		};
        	}
        })
        
        /**메뉴 ->국사명표시 체크 **/
        $('#checkMtsoNm').on('click', function(e){
        	//명칭 보여주기
        	if($('#checkMtsoNm').is(':checked')){
        		setViewLabelLayerFunc('T_SMTSO_LABEL',true); //T_국소명 레이어
        		setViewLabelLayerFunc('T_TMOF_LABEL',true); //T_전송실명 레이어
        		setViewLabelLayerFunc('T_COFC_MTSO_LABEL',true); //T_중심국_국사명 레이어
            //명칭 안 보여주기
        	}else{
        		setViewLabelLayerFunc('T_SMTSO_LABEL',false); //T_국소명 레이어
        		setViewLabelLayerFunc('T_TMOF_LABEL',false); //T_전송실명 레이어
        		setViewLabelLayerFunc('T_COFC_MTSO_LABEL',false); //T_중심국_국사명 레이어
        	}
        })
        
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
        
      	 
	};//이벤트리스너 끝
	
	
	function btnSelect() {
	    $a.close(mtsoParam);
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
			label_style.mAlign = L.point([10, 10]);
			label_style.color = '#050099';
			var label_style_option = { type: 'TEXT', options: label_style };
			label_layer.setUserStyleConfig(label_style_option).refresh(true);
			
	    }else{//안보여주기
	    	label_layer.setVisible(false);
	    }
	}
   
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
			
			}
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
 		            '<b>건물주소:</b><%pop_bldAddr%><br>'+
 					"<button type='button' class='Button button2' id='btnSelect' onclick='btnSelect();'>선택</button>";
// 		           '<button type=button class=Button button2 id=btnSelect onclick=btnSelect()>선택</button>';
 		
 		        html = html.replace('<%pop_mtsoNm%>',mtsoInf.mtsoNm);
 		        html = html.replace('<%pop_mtsoMgmtNo%>',response.mtsoMgmtNo);
 		        html = html.replace('<%pop_mtsoId%>',mtsoId);
 		        html = html.replace('<%pop_mtsoTyp%>',mtsoInf.mtsoTyp);
 		        html = html.replace('<%pop_mtsoStat%>',mtsoInf.mtsoStat);
 		        html = html.replace('<%pop_bldAddr%>',mtsoInf.bldAddr);
 		        marker.bindPopup(html).openPopup();
 		        
 		       mtsoParam = mtsoInf;
 				
 			}
		}
		
    	
	}//HTTP 성공처리끝
	
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
	 * select 조회조건 코드 세팅
	 *==========================*/ 
    function setSelectCode() {
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
	        }
	    ];

	    //시스템에 사용할 스타일 설정
	    L.MG.StyleCfg.setCustomStyles(styles);

  	}
    