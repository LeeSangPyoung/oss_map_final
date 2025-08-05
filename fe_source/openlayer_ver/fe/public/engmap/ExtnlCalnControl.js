
let ExtnlCalnControl = {

	initialize: function() {
		console.log("ExtnlCalnControl initialize ......");
		let deferred = $.Deferred();

		return deferred.promise();
	},
	// B2B 광선로 설계
	drawOptLnLayer: function(dataObj) {
		let optLnLayer = window.mgMap.getCustomLayerByName(optLnMapLayer);
		if(optLnLayer) {//레이어 있으면 초기화
			window.mgMap.clearSelectLayer();
			optLnLayer.clearLayers();
	    }else{//레이어 없으면 새로 생성
	    	optLnLayer = window.mgMap.addCustomLayerByName(optLnMapLayer, {selectable: false});
	    }

		let param = {};
		param.pageNo = 1;
		param.rowPerPage = 100;
		param.b2bDsnId = dataObj.b2bDsnId;
		param.custSeq = dataObj.custSeq;
		param.dsnRsltDivVal = dataObj.dsnRsltDivVal;

		Util.jsonAjax({
			  url: '/transmisson/tes/configmgmt/b2blinedsn/getOptLnDsnDtlList'
			, data: param
			, method:'GET'
			, async:false}).done(
			function(response) {

				if(response.dsnDtlList[0]){

					let lineFeatures = {features: []}; //연결라인
					let multiLineString = Util.getParseMultiLineString(response.dsnDtlList[0].geo);
					let multiSprGeoLineString = Util.getParseMultiLineString(response.dsnDtlList[0].sprGeo);

					_.each(multiSprGeoLineString, function(lineString, idx){
						let lineFeature = {type : 'Feature',
								geometry : {
									type : 'LineString',
									coordinates : lineString
								},
								style : [{id:'STYLE_OPT_LN_LINK_SPR_LINE'}], // 예비선로 색
						};
						lineFeatures.features.push(lineFeature);
					});

					_.each(multiLineString, function(lineString, idx){
						let lineFeature = {type : 'Feature',
								geometry : {
									type : 'LineString',
									coordinates : lineString
								},
								style : [{id:'STYLE_OPT_LN_LINK_RED_LINE'}],
						};
						lineFeatures.features.push(lineFeature);
					});

					optLnLayer.addData(lineFeatures);

					window.mgMap.fitBounds(optLnLayer.getBounds(), window.mgMap.getZoom());
				} else {
					callMsgBox('','W', '경로정보가 존재하지 않습니다.', function(msgId, msgRst){});
				}

			});



	},
	// Tes 경로 조회
	drawRouteanInqLayer: function(dataObj, gridId) {
		let routeanInqLayer = window.mgMap.getCustomLayerByName(routeanInqMapLayer);
		if(routeanInqLayer) {//레이어 있으면 초기화
			window.mgMap.clearSelectLayer();
			routeanInqLayer.clearLayers();
	    }else{//레이어 없으면 새로 생성
//	    	window.mgMap.on('mg-selected-features', onClickFeatures);
	    	routeanInqLayer = window.mgMap.addCustomLayerByName(routeanInqMapLayer, {selectable: false});
	    }

		let param = {};
		let raReqIdArr = [];
		let raReqSeqArr = [];

		param.pageNo = 1;
		param.rowPerPage = 10000000;

		if(gridId == gridId10Routean){
			let chkSelData = false;
			_.each(dataObj, function(row, idx){
				raReqIdArr.push(row.raReqId);
				raReqSeqArr.push(row.raReqSeq);
				chkSelData = true;
       		});

			if(!chkSelData){
				return;
			}

			let uniqueRaReqIdArr = [...new Set(raReqIdArr)];
			let uniqueRaReqSeqArr = [...new Set(raReqSeqArr)];
			param.raReqIds = Object.keys(uniqueRaReqIdArr).map(function(i){
				return raReqIdArr[i]
			}).join(",");
			param.raReqSeqs = Object.keys(uniqueRaReqSeqArr).map(function(i){
				return raReqSeqArr[i]
			}).join(",");
		}else{
			param.raReqId = dataObj.raReqId; //경로분석요청ID
			param.raReqSeq = dataObj.raReqSeq; //경로분석요청순번
			param.srcReqIdVal = dataObj.endObjMgmtNo; //설계정료관리번호
			param.lowMtsoId = dataObj.mtsoId; //설계국사ID
			param.raReqIds = dataObj.raReqIds; //경로분석요청ID배열
			param.raReqSeqs = dataObj.raReqSeqs; //경로분석요청순번ID배열
		}

		Util.jsonAjax({
			  url: '/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getRoutePathDtlInfo'
			, data: param
			, method:'GET'
			, async:false}).done(
			function(response) {

				if(response.result.geo){

					let lineFeatures = {features: []}; //연결라인
					let multiLineString = Util.getParseMultiLineString(response.result.geo);

					_.each(multiLineString, function(lineString, idx){
						let lineFeature = {type : 'Feature',
								geometry : {
									type : 'LineString',
									coordinates : lineString
								},
								style : [{id:'STYLE_OPT_LN_LINK_RED_LINE'}],
						};
						lineFeatures.features.push(lineFeature);
					});

					routeanInqLayer.addData(lineFeatures);

					window.mgMap.fitBounds(routeanInqLayer.getBounds(), window.mgMap.getZoom());
				} else {
					callMsgBox('','W', '경로정보가 존재하지 않습니다.', function(msgId, msgRst){});
				}
			});
	},
	// Tes GIS ETE 선로 경로 조회 팝업
	drawGisRingLnPathLayer: function(dataObj) {
		let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
		dataObj.tmpPopId = tmpPopId;

		$a.popup({
	    	popid: tmpPopId,
			url: '/tango-transmission-web/trafficintg/engineeringmap/EteTraceMtsoPopup.do',
			title: 'M/W 구간 정보',
			data: dataObj,
//			iframe: false,
			modal: false,
			windowpopup: true,
			width: 1300,
			height: 720,
			center: true,
			movable: true,
			callback : function(data) {
			}
		});
	}

};
