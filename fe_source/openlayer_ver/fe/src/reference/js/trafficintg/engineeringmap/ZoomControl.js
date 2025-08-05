/*구성 Layer*/
//SKT_전송실
let sktTmofLayer = "SKT_TMOF_LAYER";
let sktTmofLayerLabel = "SKT_TMOF_LAYER_LABEL";
//SKT_중심국
let sktCofcLayer = "SKT_COFC_LAYER";
let sktCofcLayerLabel = "SKT_COFC_LAYER_LABEL";
//SKT_기지국
let sktBmtsoLayer = "SKT_BMTSO_LAYER";
let sktBmtsoLayerLabel = "SKT_BMTSO_LAYER_LABEL";
//SKT_국소
let sktSmtsoLayer = "SKT_SMTSO_LAYER";
let sktSmtsoLayerLabel = "SKT_SMTSO_LAYER_LABEL";
//SKB_정보센터
let skbInfCntrLayer = "SKB_INF_CNTR_LAYER";
let skbInfCntrLayerLabel = "SKB_INF_CNTR_LAYER_LABEL";
//SKB_국사
let skbMtsoLayer = "SKB_MTSO_LAYER";
let skbMtsoLayerLabel = "SKB_MTSO_LABEL_LAYER_LABEL";
//SKB_국소
let skbSmtsoLayer = "SKB_SMTSO_LAYER";
let skbSmtsoLayerLabel = "SKB_SMTSO_LABEL_LABEL";

let zoomLvl="13"; //줌 기본 세팅값

//구성 레이어 조회 줌설정
let cgfMapZoomConf = {
	sktTmofLayer :  "2",
	sktCofcLayer :  "5",
	sktBmtsoLayer :  "8",
	sktSmtsoLayer :  "11",
	skbInfCntrLayer :  "2",
	skbMtsoLayer :  "13",
	skbSmtsoLayer :  "14",
};

//구성 레이어 스타일 설정
let cgfLayerStyleConf = {
		"SKT_TMOF_LAYER" : "STYLE_CFG_T_TMOF_POINT",
		"SKT_COFC_LAYER" : "STYLE_CFG_T_COFC_POINT",
		"SKT_BMTSO_LAYER" : "STYLE_CFG_T_BMTSO_POINT",
		"SKT_SMTSO_LAYER" : "STYLE_CFG_T_SMTSO_POINT",
		"SKB_INF_CNTR_LAYER" : "STYLE_CFG_B_INF_CNTR_POINT",
		"SKB_MTSO_LAYER" : "STYLE_CFG_B_MTSO_POINT",
		"SKB_SMTSO_LAYER" : "STYLE_CFG_B_SMTSO_POINT",
};

// 구성 레이어 국사 아이콘 이미지 설정
let cgfLayerImgConf = {
		"구성_SKT_전송실" : "../../resources/images/T_전송실.png",
		"구성_SKT_중심국" : "../../resources/images/T_중심국.png",
		"구성_SKT_기지국" : "../../resources/images/T_기지국.png",
		"구성_SKT_국소" : "../../resources/images/T_국소.png",
		"구성_SKB_정보센터" : "../../resources/images/B_정보센터.png",
		"구성_SKB_국사" : "../../resources/images/B_국사.png",
		"구성_SKB_국소" : "../../resources/images/B_국소.png",
};

//구성 레이어 국사 라벨 설정
let cgfLayerLabelConf = {
		"SKT_TMOF_LAYER" : "off",
		"SKT_COFC_LAYER" : "off",
		"SKT_BMTSO_LAYER" : "off",
		"SKT_SMTSO_LAYER" : "off",
		"SKB_INF_CNTR_LAYER" : "off",
		"SKB_MTSO_LAYER" : "off",
		"SKB_SMTSO_LAYER" : "off",
};

//망 레이어 라벨관련
let cgfLayerNwLabelConf = [];
let gisLayerLabelConf = [];
let bulLayerLabelConf = [];
let gisLayerConf = [];


let ZoomControl = {

	initialize: function() {
		let deferred = $.Deferred();

		//map zoom level 변경 시 이벤트 캐취
//		const targetEle = document.querySelector('.leaflet-control-zoomslider-level');
//
//		const observer = new MutationObserver(function(mutationsList, observer){
//				for(let mutation of mutationsList){
//					if(mutation.type === 'characterData' || mutation.type === 'childList'){
//						zoomLvl = $(targetEle).text();
//
//					}
//				}
//			}
//		);
//
//		const config = {characterData: true, childList: true, subtree: true};
//		observer.observe(targetEle, config);

		return deferred.promise();
	},

	setCfgCtl: function(grpNm, layrNm){
		let cfgLayer, checker = false;

		ZoomControl.setAllCfgMtsoLayerClear(); //구성에서 활성화되어있는 레이어 모두 초기화
		ZoomControl.setAllCfgMtsoLayerLabelClear(); //구성에서 활성화되어있는 라벨레이어 모두 초기화

		if(grpNm == "SKT") {
			if(layrNm == "전송실") {
				if(Number(cgfMapZoomConf.sktTmofLayer) > Number(zoomLvl)) { //지도 줌레벨이 설정값보다 작아지면
					checker = false;
				}else{
					checker = true;
				}
			} else if (layrNm == "중심국") {
				if(Number(cgfMapZoomConf.sktCofcLayer) > Number(zoomLvl)){ //지도 줌레벨이 설정값보다 작아지면
					checker = false;
				}else{
					checker = true;
				}
			} else if (layrNm == "기지국") {
				if(Number(cgfMapZoomConf.sktBmtsoLayer) > Number(zoomLvl)){ //지도 줌레벨이 설정값보다 작아지면
					checker = false;
				}else{
					checker = true;
				}
			} else if (layrNm == "국소") {
				if(Number(cgfMapZoomConf.sktSmtsoLayer) > Number(zoomLvl)){ //지도 줌레벨이 설정값보다 작아지면
					checker = false;
				}else{
					checker = true;
				}
			}
		} else if(grpNm == "SKB") {

			if(layrNm == "정보센터") {
				if(Number(cgfMapZoomConf.skbInfCntrLayer) > Number(zoomLvl)){ //지도 줌레벨이 설정값보다 작아지면
					checker = false;
				}else{
					checker = true;
				}
			} else if (layrNm == "국사") {
				if(Number(cgfMapZoomConf.skbMtsoLayer) > Number(zoomLvl)){ //지도 줌레벨이 설정값보다 작아지면
					checker = false;
				}else{
					checker = true;
				}
			} else if (layrNm == "국소") {
				if(Number(cgfMapZoomConf.skbSmtsoLayer) > Number(zoomLvl)){ //지도 줌레벨이 설정값보다 작아지면
					checker = false;
				}else{
					checker = true;
				}
			}
		}

		return checker;
	},

	setAllCfgMtsoLayerClear: function(){
		let cfgSktTmofLayer = window.mgMap.getCustomLayerByName(sktTmofLayer);
		if(cfgSktTmofLayer){
			//window.mgMap.getCustomLayerByName(sktTmofLayer).clearLayers();
			cfgSktTmofLayer.getSource().clear();
		}

		let cfgSktCofcLayer = window.mgMap.getCustomLayerByName(sktCofcLayer);
		if(cfgSktCofcLayer){
			//window.mgMap.getCustomLayerByName(sktCofcLayer).clearLayers();
			cfgSktCofcLayer.getSource().clear();
		}

		let cfgSktBmtsoLayer = window.mgMap.getCustomLayerByName(sktBmtsoLayer);
		if(cfgSktBmtsoLayer){
			//window.mgMap.getCustomLayerByName(sktBmtsoLayer).clearLayers();
			cfgSktBmtsoLayer.getSource().clear();
		}

		let cfgSktSmtsoLayer = window.mgMap.getCustomLayerByName(sktSmtsoLayer);
		if(cfgSktSmtsoLayer){
			//window.mgMap.getCustomLayerByName(sktSmtsoLayer).clearLayers();
			cfgSktSmtsoLayer.getSource().clear();
		}

		let cfgSkbInfCntrLayer = window.mgMap.getCustomLayerByName(skbInfCntrLayer);
		if(cfgSkbInfCntrLayer){
			//window.mgMap.getCustomLayerByName(skbInfCntrLayer).clearLayers();
			cfgSkbInfCntrLayer.getSource().clear();
		}

		let cfgSkbMtsoLayer = window.mgMap.getCustomLayerByName(skbMtsoLayer);
		if(cfgSkbMtsoLayer){
			//window.mgMap.getCustomLayerByName(skbMtsoLayer).clearLayers();
			cfgSkbMtsoLayer.getSource().clear();
		}

		let cfgSkbSmtsoLayer = window.mgMap.getCustomLayerByName(skbSmtsoLayer);
		if(cfgSkbSmtsoLayer){
			//window.mgMap.getCustomLayerByName(skbSmtsoLayer).clearLayers();
			cfgSkbSmtsoLayer.getSource().clear();
		}
	},

	setAllCfgMtsoLayerLabelClear: function(){
		let cfgSktTmofLayerLabel = window.mgMap.getCustomLayerByName(sktTmofLayerLabel);
		if(cfgSktTmofLayerLabel){
			//window.mgMap.getCustomLayerByName(sktTmofLayerLabel).clearLayers();
			cfgSktTmofLayerLabel.getSource().clear();
		}

		let cfgSktCofcLayerLabel = window.mgMap.getCustomLayerByName(sktCofcLayerLabel);
		if(cfgSktCofcLayerLabel){
			//window.mgMap.getCustomLayerByName(sktCofcLayerLabel).clearLayers();
			cfgSktCofcLayerLabel.getSource().clear();
		}

		let cfgSktBmtsoLayerLabel = window.mgMap.getCustomLayerByName(sktBmtsoLayerLabel);
		if(cfgSktBmtsoLayerLabel){
			//window.mgMap.getCustomLayerByName(sktBmtsoLayerLabel).clearLayers();
			cfgSktBmtsoLayerLabel.getSource().clear();
		}

		let cfgSktSmtsoLayerLabel = window.mgMap.getCustomLayerByName(sktSmtsoLayerLabel);
		if(cfgSktSmtsoLayerLabel){
			//window.mgMap.getCustomLayerByName(sktSmtsoLayerLabel).clearLayers();
			cfgSktSmtsoLayerLabel.getSource().clear();
		}

		let cfgSkbInfCntrLayerLabel = window.mgMap.getCustomLayerByName(skbInfCntrLayerLabel);
		if(cfgSkbInfCntrLayerLabel){
			//window.mgMap.getCustomLayerByName(skbInfCntrLayerLabel).clearLayers();
			cfgSkbInfCntrLayerLabel.getSource().clear();
		}

		let cfgSkbMtsoLayerLabel = window.mgMap.getCustomLayerByName(skbMtsoLayerLabel);
		if(cfgSkbMtsoLayerLabel){
			//window.mgMap.getCustomLayerByName(skbMtsoLayerLabel).clearLayers();
			cfgSkbMtsoLayerLabel.getSource().clear();
		}

		let cfgSkbSmtsoLayerLabel = window.mgMap.getCustomLayerByName(skbSmtsoLayerLabel);
		if(cfgSkbSmtsoLayerLabel){
			//window.mgMap.getCustomLayerByName(skbSmtsoLayerLabel).clearLayers();
			cfgSkbSmtsoLayerLabel.getSource().clear();
		}
	}
};
