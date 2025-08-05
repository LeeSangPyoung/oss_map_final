    /*==========================*
	 *  변수선언
	 *==========================*/
//    //구성레이어의 조건 값


	/*==========================*
	 *  function load()
	 *==========================*/
var gridId = "conListGrid";
var covLayer = "MTSO_COV_LAYER"; //커버리지

var conMap = $a.page(function() {
	var mtsoId= null;//  앞단에서 넘어오는 paramter 국사 id 값 저장
	var eqpId= null;//  앞단에서 넘어오는 paramter장비의 id 값 저장
	var tmtsoId= null; // 기지국의 layer와 중계기의 layer 중복을 막기 위한 mtsoId
	var tmtsoLng= null;// 기지국의 layer와 중계기의 layer 중복을 막기 위한 lng
	var tmtsoLat= null;// 기지국의 layer와 중계기의 layer 중복을 막기 위한 lat
	var smtsoId = null; // 지도상에서 feature 클릭 시 해당 mtso 정보 binding popup하기 위한 mtsoId
	var mtsoEqpCheck= null; // 넘어오는 파라미터가 mtso인지 eqpmtso인지 체크
	var dumtsoIdv= null;
	 // smtsoId 정리 해야함 ~ 그리고 장비랑 국사 클릭 다를때 xml 다르게 불러줘야함 그것도 check 해야함 월요일날 해야될것 !
	this.init = function(id, param) {
		if (param.mtsoId != null || param.mtsoId != undefined && param.mtsoId != ""){
			mtsoId = param.mtsoId;
			mtsoEqpCheck = "m";
//			$('#checkGunDiv').hide();
		} else {
			eqpId = param.eqpId;
			mtsoEqpCheck = "d";
			$('#checkGunDiv').hide();
		}
    	  //레이어 조회 버튼 숨기기
        /** 맵 생성 **/
	    $.getScript(GLOBAL_GIS_ENGINE_IP + "/mapgeo/build/mapgeo.js",function(){
//	        $(".jCarouselLite1").jCarouselLite({ visible: 1, speed: 400, auto: 4000, vertical: true });
	    	 var options = {  //맵생성옵션
	    	        	app: 'tango',
	    	        	contextmenu: false,
	    	            location: {zoom: 10, center: [37.5087805938127, 127.062289345605]}
	    	        };
	    	  MapGeo.create('map', 'TANGO-T', options).then(function (map) {
	          	window.mgMap = map;// 생성된 map 객체를 window 객체에 추가하여 전역으로 사용 가능
	          	window.mtsoNmLayerLabel = window.mgMap.addCustomLayerByName('MTSONM_LAYER_LABEL');// 국사라벨 레이어
	          	window.mtsoLayer = map.addCustomLayerByName('MTSO_LAYER', {selectable: true});
	          	window.duLayer = map.addCustomLayerByName('DU_LAYER', {selectable: true});//기지국 레이어
	          	window.ruLayer = map.addCustomLayerByName('RU_LAYER', {selectable: true});//중계기 레이어
	          	window.lineLayer = map.addCustomLayerByName('LINE_LAYER');//라인 레이어

	          	var layers = map.getVectorLayers();
	          	_.each(layers, function(layer, index) {
	              	layer.properties.selectable = false;
	          		layer.setVisible(false);
	          	});
	          	//사용자 레이어 스타일 설정
	              addUserLayerStyles();
	              // 기본 우클릭 메뉴 구성
//	              mgMap.setDefaultContextMenu(getDefaultMenuItems(mgMap));
	              mgMap.on('mg-selected-features', onSelectedFeatures);

	              checkGridSearch('Layer');
	              resizeContents();
	      	 });
	    });
//    	 var options = {  //맵생성옵션
//    	        	app: 'tango',
//    	        	contextmenu: false,
//    	            location: {zoom: 10, center: [37.5087805938127, 127.062289345605]}
//    	        };
        // 1. 'map' : 맵 생성을 위한 target div element의 id
        // 2. 'BASEMAP' : 설비 없이 베이스 지도만 생성
        // 3. 'BASEMAP' 대신 'TANGO-T'를 입력한 경우 설비 및 미리 정의된 옵션으로 맵 생성
//    	 setTimeout(function(){  MapGeo.create('map', 'TANGO-T', options).then(function (map) {
//        	window.mgMap = map;// 생성된 map 객체를 window 객체에 추가하여 전역으로 사용 가능
//        	window.mtsoNmLayerLabel = window.mgMap.addCustomLayerByName('MTSONM_LAYER_LABEL');// 국사라벨 레이어
//        	window.mtsoLayer = map.addCustomLayerByName('MTSO_LAYER', {selectable: true});
//        	window.duLayer = map.addCustomLayerByName('DU_LAYER', {selectable: true});//기지국 레이어
//        	window.ruLayer = map.addCustomLayerByName('RU_LAYER', {selectable: true});//중계기 레이어
//        	window.lineLayer = map.addCustomLayerByName('LINE_LAYER');//라인 레이어
//
//        	var layers = map.getVectorLayers();
//        	_.each(layers, function(layer, index) {
//            	layer.properties.selectable = false;
//        		layer.setVisible(false);
//        	});
//        	//사용자 레이어 스타일 설정
//            addUserLayerStyles();
//            // 기본 우클릭 메뉴 구성
////            mgMap.setDefaultContextMenu(getDefaultMenuItems(mgMap));
//            mgMap.on('mg-selected-features', onSelectedFeatures);
//
//            checkGridSearch('Layer');
//            resizeContents();
//    	 });
//    	 },5000);
        /** 이벤트 걸기**/
        initGrid();
//        setEvent();
        checkGridSearch('Grid');

        resizeContents();


    };

    $('#check3G').on('click', function(e){
    	checkGridSearch('GridLayer');
    });
    $('#checkLte').on('click', function(e){
    	checkGridSearch('GridLayer');
    	if($('#checkCov').is(':checked')){
    		checkGridSearch('CovLayer');
    	}
    });
    $('#check5G').on('click', function(e){
		checkGridSearch('GridLayer');
		if($('#checkCov').is(':checked')){
    		checkGridSearch('CovLayer');
    	}
    });
    $('#checkGun').on('click', function(e){
    	checkGridSearch('GridLayer');
    });
    $('#checkLine').on('click', function(e){
    	if($('#checkLine').is(':checked')){
    		checkGridSearch('Layer');
//			getAllLayer();
		}else{
			lineLayer.clearLayers();
		}
    });

    $('#checkMtsoNm').on('click', function(e){
    	if($('#checkMtsoNm').is(':checked')){
    		checkGridSearch('Layer');
//			getAllLayer();
		}else{
			mtsoNmLayerLabel.clearLayers();
		}
    });

    $('#checkCov').on('click', function(e){
    	if($('#checkCov').is(':checked')){
    		checkGridSearch('CovLayer');
    	}else{
    		clearLayerFunc(covLayer);
    	}
    });

    /*==========================*
	 * 레이어지우기
	 *==========================*/
    function clearLayerFunc(layerId){
	    var layer = window.mgMap.getCustomLayerByName(layerId);
		if(layer) {
			layer.clearLayers();
		}
    }

    //GET방식 queryString 생성
    function convertQueryString(obj){
    	return Object.keys(obj).map(function(i){
    		return encodeURIComponent(i) + '=' + encodeURIComponent(obj[i])
    	}).join('&');
    }

    function resizeContents(){
    	var contentHeight = $("#mtsoConverArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

    /*==========================*
	 * 시설물선택하면 시설물 정보 가져오기
	 *==========================*/
	function onSelectedFeatures(featuresObj) {
		var cusLayer = window.mgMap.getSelectedFeatures();
			if (featuresObj.features.length > 0){
			var layerId = featuresObj.features[0].feature.getLayerId();
			var layer = window.mgMap.getLayerById(layerId);
			var layrNm = layer.getLayerAliasName();
			var smtsoId = featuresObj.features[0].feature.mgmtNo;
			 if(layrNm == 'MTSO_LAYER' || layrNm == 'DU_LAYER'  || layrNm == 'RU_LAYER'){
				 if(smtsoId != null){
					 var param = new Object();
			     	 param.moveMap = true; //지동이동할거다
			     	if($('#check3G').is(':checked')){
			     		param.check3G = "Y";
					}else {
			     		param.check3G = "N";
			     	}
					 if($('#check5G').is(':checked')){
						 param.check5G = "Y";
					}else {
			     		param.check5G = "N";
			     	}
					 if($('#checkLte').is(':checked')){
						 param.checkLte = "Y";
					}else {
				     	param.checkLte = "N";
			     	}
					 if($('#checkGun').is(':checked')){
						 param.searchGubun = "Y";
					}else {
				     	param.searchGubun = "N";
			     	}
					 param.mtsoId = smtsoId;
					 param.eqpId = eqpId;
					 param.mtsoEqpCheck =mtsoEqpCheck;
					 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtsoClick', param, 'GET', 'clickMtso');


//					 checkGridSearch('selectMtso');
				 }
			}
		}
	}

	function checkGridSearch(getController){
		 var param = new Object();
     	 param.moveMap = true; //지동이동할거다
     	if($('#check3G').is(':checked')){
     		param.check3G = "Y";
		}else {
     		param.check3G = "N";
     	}
		 if($('#check5G').is(':checked')){
			 param.check5G = "Y";
		}else {
     		param.check5G = "N";
     	}
		 if($('#checkLte').is(':checked')){
			 param.checkLte = "Y";
		}else {
	     	param.checkLte = "N";
     	}
		 if($('#checkGun').is(':checked')){
			 param.searchGubun = "Y";
		}else {
	     	param.searchGubun = "N";
     	}
		 param.mtsoId = mtsoId;
		 param.eqpId = eqpId;
		 param.mtsoEqpCheck =mtsoEqpCheck;

		 if(param.checkLte == "Y" || param.check5G  == "Y" || param.check3G =="Y"){
			 $('#map').progress();

			if(getController == "Grid"){
			param.layerFlag = "Y";
			param.pageNo = '1';
			param.rowPerPage = '100';
			 gridModel.get({
		     		data: param
		     	}).done(function(response,status,xhr,flag){

//		     		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getEqpMtsoConvergy', param, 'GET', 'searchMtsoConvergy');

		     	})
		     	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});
			}else if(getController == "Layer"){
				mtsoLayer.clearLayers();
				duLayer.clearLayers();
				ruLayer.clearLayers();
				lineLayer.clearLayers();
				mtsoNmLayerLabel.clearLayers();

				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getEqpMtsoConvergy', param, 'GET', 'searchMtsoConvergy');

			}else if(getController == "CovLayer"){
				clearLayerFunc(covLayer);

				var coverageTypList = []; //커버리지 서비스 종류
				if($('#check5G').is(':checked')){
					coverageTypList.push("5G");
				}else{
					coverageTypList.push("NA");
				}
				if($('#checkLte').is(':checked')){
					coverageTypList.push("LTE");
				}else{
					coverageTypList.push("NA");
				}

				param.mgmtGrpNm = "SKT";//$('#mgmtGrpNm').val();
				param.coverageTypList = coverageTypList;		//서비스

				param = convertQueryString(param);
				httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/selectCoverageList', param, 'GET', 'selectCoverage');

			}else if(getController == "GridLayer"){
				param.layerFlag = "Y";
				param.pageNo = '1';
				param.rowPerPage = '100';
				mtsoLayer.clearLayers();
				duLayer.clearLayers();
				ruLayer.clearLayers();
				lineLayer.clearLayers();
				mtsoNmLayerLabel.clearLayers();

				gridModel.get({
		     		data: param
		     	}).done(function(response,status,xhr,flag){
		     		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getEqpMtsoConvergy', param, 'GET', 'searchMtsoConvergy');
		     	})
		     	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});

			}else if(getController == 'selectMtso'){
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtsoClick', param, 'GET', 'clickMtso');
			}
		 }else{
			 alert('3G,LTE,5G 셋 중 하나는 무조건 선택 되어야합니다.');
		 }


//	   		 $('#conListGrid').alopexGrid('showProgress');
//			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtsoConvergy', param, 'GET', 'searchMtsoConvergy');
//		 getAllLayer();
	}

function initGrid() { //mst & dtl
    	var mapping =  [
    		{key : 'duLineNm', align:'left', width:'250px', title : '회선명'}
    		,{key : 'duSvlnNo',align:'center',width:'150px',title : '회선ID' }
//    		,{key : 'duEqpId',align:'center',width:'60px',title : '장비ID'}
    		,{key : 'duSvlnTypCdNm',align:'center',width:'100px',title : '회선유형'}
    		,{key : 'duSvlnSclCdNm', align:'center', width:'100px', title : '회선 소분류'}
//    		,{key : 'duMtsoId',align:'center',width:'250px',title : '국사ID'}
    		,{key : 'duMtsoNm',align:'left',width:'100px',title : '국사명'}
    		,{key : 'duBldAddr',align:'left',width:'180px',title : '국사주소'}
//    		,{key : 'duMtsoLatVal',align:'center',width:'250px',title : 'Lat'}
//    		,{key : 'duMtsoLngVal',align:'center',width:'250px',title : 'Lng'}

    		,{key : 'ruLineNm', align:'left', width:'250px', title : '회선명'}
    		,{key : 'ruSvlnNo',align:'center',width:'150px',title : '회선ID' }
//    		,{key : 'ruEqpId',align:'center',width:'60px',title : '장비ID' }
    		,{key : 'ruSvlnTypCdNm',align:'center',width:'100px',title : '회선유형'}
    		,{key : 'ruSvlnSclCdNm', align:'center', width:'100px', title : '회선 소분류'}
//    		,{key : 'ruMtsoId',align:'center',width:'250px',title : '국사ID' }
    		,{key : 'ruMtsoNm',align:'left',width:'100px',title : '국사명'}
    		,{key : 'ruBldAddr',align:'left',width:'180px',title : '국사주소'}
//    		,{key : 'ruMtsoLatVal',align:'center',width:'250px',title : 'Lat'}
//    		,{key : 'ruMtsoLngVal',align:'center',width:'250px',title : 'Lng'}
    	];
    	var gurl = null;
    	 if(mtsoEqpCheck == "m"){
    		 gurl = "tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtsoLabelList" ;
//			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtsoLabelList', paramObj, 'GET', 'selectMtsoLabelList');
		 }
		 else if(mtsoEqpCheck == "d"){
			 gurl = "tango-transmission-biz/transmisson/configmgmt/commonlkup/getEqpMtsoLabelList" ;
//			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getEqpMtsoLabelList', paramObj, 'GET', 'selectEqpMtsoLabelList');
		 }

    	gridModel = Tango.ajax.init({
//    		url : gurl
        	url: "tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtsoConvergy"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 10,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : false,
             rowInlineEdit : true,
             numberingColumnFromZero : false
            ,paging: {
//            	pagerTotal:true,
        	   pagerSelect:false,
         	   hidePageList:true
            },
            headerGroup:
    			[
    				//2단
    				{fromIndex:0, toIndex:5, title:'기지국 회선'},
    				{fromIndex:6, toIndex:12, title:'중계기 회선 '},
    		    ]
    	   ,columnMapping : mapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,ajax: {
      	         model: gridModel                  // ajax option에 grid 연결할 model을지정
      		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
      		    }
            ,defaultColumnMapping: {
            	sorting: true
            }
            ,height: 300
        });

	}
     function drawTitle(response) {
    	var features = [];
    	_.map(response.lists, function(item, index) {
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
    	var mtsoNmLayerLabel = window.mtsoNmLayerLabel;

    	var result = {
    			features : features
    	};

    	mtsoNmLayerLabel.addData(result);
    	var textIconOption = {
    			labelColumn : "LABEL",
	   			faceName : "궁서",
	   			size : "9",
	   			color : "blue",
	   			hAlign : "middle",
	   			vAlign : "top",
	   			opacity : 1.0,
    	};
    	for (var key in mtsoNmLayerLabel._layers) {
    		var layer = mtsoNmLayerLabel._layers[key];
    		layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL, hAlign : "middle", vAlign : "top"})));
    	}
    	$('#map').progress().remove();
    }

     function drawEqpTitle(response) {
     	var features = [];
     	_.map(response.lists, function(item, index) {
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
     	var mtsoNmLayerLabel = window.mtsoNmLayerLabel;

     	var result = {
     			features : features
     	};

     	mtsoNmLayerLabel.addData(result);
     	var textIconOption = {
     			labelColumn : "LABEL",
 	   			faceName : "돋움",
 	   			size : "12",
 	   			color : "blue",
 	   			hAlign : "middle",
 	   			vAlign : "top",
 	   			opacity : 1.0,
     	};
     	for (var key in mtsoNmLayerLabel._layers) {
     		var layer = mtsoNmLayerLabel._layers[key];
     		layer.setIcon(new L.MG.TextIcon($.extend({}, textIconOption, {text:layer.feature.properties.LABEL, hAlign : "middle", vAlign : "top"})));
     	}
     	$('#map').progress().remove();
     }

	/*=========================*
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

		if(flag == 'search'){

    		// 검색
    	}

		if(flag == 'searchMtsoConvergy'){
			var duLayer = window.duLayer;
			var ruLayer = window.ruLayer;
			var lineLayer = window.lineLayer;
			var style = null;
			var duLng = null;
			var duLat = null;
//			duLayer.clearLayers();
//			ruLayer.clearLayers();
//			lineLayer.clearLayers();
	  		var result1 = {features: []};
	  		var result2 = {features: []};
	  		var result3 = {features: []};

	  		var paramObj = new Object();
	  		paramObj.mtsoId = mtsoId;
	  		paramObj.eqpId = eqpId;
	  		paramObj.mtsoEqpCheck =mtsoEqpCheck;
    		if($('#check3G').is(':checked')){
    			paramObj.check3G = "Y";
    		}else {
    			paramObj.check3G = "N";
         	}
    		 if($('#check5G').is(':checked')){
    			 paramObj.check5G = "Y";
    		}else {
    			paramObj.check5G = "N";
         	}
    		 if($('#checkLte').is(':checked')){
    			 paramObj.checkLte = "Y";
    		}else {
    			paramObj.checkLte = "N";
         	}
    		 if($('#checkGun').is(':checked')){
    			 paramObj.searchGubun = "Y";
    		}else {
    			paramObj.searchGubun = "N";
         	}

//	  		var tempduList = response.lists.reduce(function(a,b){
//	  			if(a.indexOf(b) < 0){
//	  				a.push(b);
//	  			}
//	  			return a;
//	  		},[]);
	  		if (response.lists.length > 0) {
	  			var param1 = {};
	  			var param2 = {};
	  			var tempMtsoId = null;

	  			for(i=0; i<response.lists.length;i++){
	  				if(  response.lists[i].duMtsoLngVal != null && response.lists[i].duMtsoLatVal != null ){
				    	param1.type = 'Point';
				    	param1.style = 'SUBMIT_SETL_PCE_STYLE_POINT_1';
				    	param1.mgmtNo = response.lists[i].duMtsoId;
				    	param1.coord =[response.lists[i].duMtsoLngVal,response.lists[i].duMtsoLatVal];
				    	result1.features.push(_M.createFeature(param1));
	  				}

	  				if( response.lists[i].ruMtsoLatVal != null && response.lists[i].ruMtsoLngVal != null){
	  					param2.type = 'Point';
  						param2.style = 'SUBMIT_SETL_PCE_STYLE_POINT_2';
  				    	param2.mgmtNo = response.lists[i].ruMtsoId;
  				    	param2.coord =[response.lists[i].ruMtsoLngVal,response.lists[i].ruMtsoLatVal];
  				    	result2.features.push(_M.createFeature(param2));
  				    	if($('#checkLine').is(':checked')){
	  						result3 = { features :[{ type : 'Feature',
				                    geometry : {
				                    type : 'LineString',
				                    coordinates : [[response.lists[i].duMtsoLngVal,response.lists[i].duMtsoLatVal],[response.lists[i].ruMtsoLngVal,response.lists[i].ruMtsoLatVal]]
						                },
						                style : [{id:'STYLE_RING_POPUP_LINE'}],
						            }
						        ],
						    };
			  		  		lineLayer.addData(result3);//레이어에 추가하고
		  					}
	  					}
		  			}
  				duLayer.addData(result1);
		  		ruLayer.addData(result2);

		  		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtso', paramObj, 'GET', 'selectMtsoList');
  			}else{
		  		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtso', paramObj, 'GET', 'selectMtsoList');
  			}

	  		if($('#checkMtsoNm').is(':checked')){
	    		 if(mtsoEqpCheck == "m"){
	    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getMtsoLabelList', paramObj, 'GET', 'selectMtsoLabelList');
	    		 }
	    		 else if(mtsoEqpCheck == "d"){
	    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/getEqpMtsoLabelList', paramObj, 'GET', 'selectEqpMtsoLabelList');
	    		 }
	  		}


//	  		}
		}
		if(flag == 'clickMtso' ){
		var mtsoLayerMarker = mgMap.addCustomLayerByName('UMTSO_LAYER1',{selectable: true});//국사표시를 위한 레이어
		mtsoLayerMarker.closePopup();
    	mtsoLayerMarker.clearLayers();

	    	if(response.lists[0].mtsoLatVal != null && response.lists[0].mtsoLngVal != null){
	    		var html =
			            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
			            '<b>국사번호:</b><%pop_mtsoId%><br>' +
			            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
			            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
			            '<b>건물주소:</b><%pop_bldAddr%>';

		        html = html.replace('<%pop_mtsoNm%>',response.lists[0].mtsoNm);
		        html = html.replace('<%pop_mtsoId%>',response.lists[0].mtsoId);
		        html = html.replace('<%pop_mtsoTyp%>',response.lists[0].mtsoTypNm);
		        html = html.replace('<%pop_mtsoStat%>',response.lists[0].mtsoStatNm);
		        html = html.replace('<%pop_bldAddr%>',response.lists[0].mtsoBldAddr);

		        var marker = L.marker([response.lists[0].mtsoLatVal, response.lists[0].mtsoLngVal]);
		        mtsoLayerMarker.addLayer(marker);
		        marker.bindPopup(html).openPopup();
	    	}
	    	else{
	    		alert('대상 국사ID가 없습니다.');   /*"삭제할 대상을 선택하세요."*/
	    	}
		}



			if(flag == 'selectMtsoList' ){
      		var mtsoLayer = window.mtsoLayer;
    		var style = 'SUBMIT_SETL_PCE_STYLE_POINT_3';
//    		mtsoLayer.clearLayers();
    		var result = {features: []};
    		tmtsoId = response.lists[0].mtsoId;
    		tmtsoLng =  response.lists[0].mtsoLngVal
    		tmtsoLat = response.lists[0].mtsoLatVal
    		if( response.lists[0].mtsoLatVal != null && response.lists[0].mtsoLngVal ){
	    		if (response.lists.length > 0) {
	    			 //feature 생성
	    			for(i=0; i<response.lists.length;i++){
//	    				var marker = L.marker([response.LayerList[i].mtsoLatVal, response.LayerList[i].mtsoLngVal]);
//	    				mtsoBulLayer.addLayer(marker);
	    				var param = {};
				    	param.type = 'Point';
				    	param.style = style;
				    	param.mgmtNo = response.lists[i].mtsoId;
				    	param.coord =[tmtsoLng,tmtsoLat];
				    	result.features.push(_M.createFeature(param));
	    			}
	    		}
	    		mtsoLayer.addData(result);
	    		window.mgMap.setView([response.lists[0].mtsoLatVal, response.lists[0].mtsoLngVal], 10);

	    		$('#map').progress().remove();
    		}


			}
			if(flag == 'selectMtsoLabelList' ){
				drawTitle(response)
			}
			if(flag == 'selectEqpMtsoLabelList' ){
				drawEqpTitle(response)
			}

		if(flag == "selectCoverage"){
			$('#map').progress().remove();

			if(response.pager.totalCnt > 0){
				drawPolygonLayer(response.resultList, covLayer);
			} else {
				callMsgBox('','I', '유선 커버리지 정보가 존재하지 않습니다.' , function(msgId, msgRst){});
			}
		}
	}


	/*====================================*
	 * 선택된 Polygon layer 그리기
	 *====================================*/
	drawPolygonLayer = function(layerList, layerId){
		console.log("drawPolygonLayer layerList : ", layerList);
		console.log("drawPolygonLayer layerId : ", layerId);
		var style = layerId;

		var result = {features: []};
		_.each(layerList, function(feature, idx) {

			//유선 커버리지 서비스에 대한 레이어 스타일 적용
			if(feature.coverageTypCd == "5G"){
				style = "MTSO_5G_COV_LAYER";
			} else if(feature.coverageTypCd == "LTE"){
				style = "MTSO_LTE_COV_LAYER";
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
		$('#map').progress().remove();
	};

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
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

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
	            	weight : 1         //선두께
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
						iconUrl: '../../resources/images/startPt_2.png',
						iconSize : [ 20, 25 ],
						iconAnchor : [ 15, 15 ]
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
					faceName : "돋움",
					size : "12",
						color : "blue",
						hAlign : "midlle",
						vAlign : "top",
						opacity : 1.0,
					}
	        }, {
				id : 'MTSO_5G_COV_LAYER',
				type : L.MG.StyleCfg.STYLE_TYPE.POLYGON, // 폴리곤 타입
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
				type : L.MG.StyleCfg.STYLE_TYPE.POLYGON, // 폴리곤 타입
				options : {
					color : '#DC8484',
		            weight : 3,
		            opacity : 1,
		            fill : true,
		            isStroke: true,
		            fillColor : '#DC8484',
		            fillOpacity : 0.1
				}
		        }
	    ];
	    //시스템에 사용할 스타일 설정
	    L.MG.StyleCfg.setCustomStyles(styles);
  	}
});