/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var invtIntgPop = $a.page(function() {
	var excelGrid = 'g5EndDsnDataGrid';
	var invtParam = "";

	var grShtgItmCd		= [];

	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/SHTG', null, 'GET', 'shtgItmList');

		var userId 		= $('#userId').val();
		var paramData 	= {downFlag : 'G5END', userId : userId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getDownLoadDate', paramData, 'GET', 'downLoadDate');


		var startDate = new Date().format("yyyy-MM-dd");
		startDate =dateAddRemove('R',startDate, 1);
		$("#srchStartDt").val(startDate);
		var option_data =  [];
		for(var i=0; i < 24; i++){
			var tmpH =  i.zf(2);
			var resObj = {cd:tmpH, cdNm : tmpH};
			option_data.push(resObj);
		}
		$('#srchStartHh').setData({ data:option_data });
		$("#srchStartHh").val("00");

		var option_data =  [];
		for(var i=0; i < 60; i++){
			var tmpM =  i.zf(2);
			var resObj = {cd:tmpM, cdNm : tmpM};
			option_data.push(resObj);
		}
		$('#srchStartMi').setData({ data:option_data });
		$("#srchStartMi").val("00");

	}

	Date.prototype.format = function(f) {
	    if (!this.valueOf()) return " ";
	    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var d = this;
	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};

	Number.prototype.zf = function(len){return prependZeor(this, len);};
	function prependZeor(num, len) {
		while(num.toString().length < len) {
			num = "0"+num;
		}
		return num;
	}

	function dateAddRemove(sGubun, sDate, sNum) {
		var sDate = sDate.split("-");
		var yy = parseInt(sDate[0]);
		var mm = parseInt(sDate[1]);
		var dd = parseInt(sDate[2]);
		if (sGubun == 'R') {
			var d = new Date(yy, mm -1, dd - sNum);
		} else {
			var d = new Date(yy, mm -1, dd + sNum);
		}
		yy = d.getFullYear();
		mm = d.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;
		dd = d.getDate(); dd = (dd < 10) ? '0' + dd : dd;
		return '' + yy + '-' + mm + '-' + dd;

	}

	function colColorChange(code) {
		var color = '#000000';
		switch(code)  {
		case "1":
			color = "#ff253a";	// 불가
			break;
		case "2":
			color = "#3191e8";	// 변경 데이터
			break;
		case "3":
			color = "#ff7e00";	// 변경 데이터
			break;
		}
		return color;

	}

	function setIsNaNCheck(strVal) {
		if (isNaN(strVal)) { strVal = 0; }
		return strVal;
	}

	function initGrid() {
		var headerMappingN =  [
			 {fromIndex:5, toIndex:7, title:"현재 전력"}
	   		,{fromIndex:8, toIndex:9, title:"2G FadeOut"}
	   		,{fromIndex:10, toIndex:12, title:"국사 통폐합"}
	   		,{fromIndex:13, toIndex:16, title:""}
	   		,{fromIndex:17, toIndex:23, title:"전송 랙수(개)"}
	   		,{fromIndex:24, toIndex:28, title:"전송 전력량(kW)"}
	   		,{fromIndex:29, toIndex:34, title:"부대물자 랙수(개)"}
	   		,{fromIndex:35, toIndex:36, title:"상면 종국 수요"}
	   		,{fromIndex:37, toIndex:42, title:"잔여/누적"}
	   		];

		$('#'+excelGrid).alopexGrid({
			pager : false,
			autoColumnIndex: true,
			height : '12row',
			autoResize: true,
			rowClickSelect : false,
            rowSingleSelect : true,
			rowInlineEdit: true,
			cellSelectable : false,
			numberingColumnFromZero: false,
			defaultState : {
//				dataSet : {editing : true}
			},
			excelWorker :{
				importOption : {
					columnOrderToKey : true
				}
			},
			columnFixUpto : 'floorNm',
			headerGroup : headerMappingN,
			columnMapping: [
				{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '110px'
					, inlineStyle : {
						background : function(value, data, mapping) {
							if (data.uploadYn == 'N') {
								return colColorChange("1");
							} else {

								if (data.ctrtEpwrValErr 			== '3' ||
									data.loadEpwrValErr 		    == '3' ||
									data.g2RemvRackCntErr	 		== '3' ||
									data.g2ScreEpwrValErr 	    	== '3' ||
									data.lgcyEpwrValErr 		    == '3' ||
									data.lgcyRackCntErr 		    == '3' ||
									data.lgcyDemdEpwrValErr 	    == '3' ||
									data.g5DulCntErr 				== '3' ||
									data.g5DuhCntErr 				== '3' ||
									data.g5DuhRackCntErr 			== '3' ||
									data.g5DuhEpwrValErr 			== '3' ||
									data.trmsRotnCntErr 		    == '3' ||
									data.trmsIvrCntErr 		    	== '3' ||
									data.trmsIvrrCntErr 		    == '3' ||
									data.trms5gponCntErr 			== '3' ||
									data.trmsSmuxCntErr 		    == '3' ||
									data.trmsFdfCntErr 		    	== '3' ||
									data.trmsRotnEpwrValErr 	    == '3' ||
									data.trmsIvrEpwrValErr 	    	== '3' ||
									data.trmsIvrrEpwrValErr 	    == '3' ||
									data.trms5gponEpwrValErr     	== '3' ||
									data.sbeqpRtfRackCntErr 	    == '3' ||
									data.sbeqpIpdCntErr 		    == '3' ||
									data.sbeqpArcnCntErr 			== '3' ||
									data.sbeqpBatryLipoCntErr    	== '3' ||
									data.sbeqpBatryCntErr 	    	== '3' ||
									data.upsdDemdRackCntErr 	    == '3' ||
									data.upsdDemdEpwrValErr 	    == '3' ||
									data.remRackCntErr 		    	== '3' ||
									data.remEpwrValErr 		    	== '3' ||
									data.shtgItmCdErr				== '3' ||
									data.screPsblEpwrValErr 	    == '3' ||
									data.epwrRfctInvtCostErr     	== '3' ||
									data.rmkErr						== '3' ) {
									return colColorChange("3");
								} else {
									if (data.ctrtEpwrValErr 			== '2' ||
										data.loadEpwrValErr 		    == '2' ||
										data.g2RemvRackCntErr	 		== '2' ||
										data.g2ScreEpwrValErr 	    	== '2' ||
										data.lgcyEpwrValErr 		    == '2' ||
										data.lgcyRackCntErr 		    == '2' ||
										data.lgcyDemdEpwrValErr 	    == '2' ||
										data.g5DulCntErr 				== '2' ||
										data.g5DuhCntErr 				== '2' ||
										data.g5DuhRackCntErr 			== '2' ||
										data.g5DuhEpwrValErr 			== '2' ||
										data.trmsRotnCntErr 		    == '2' ||
										data.trmsIvrCntErr 		    	== '2' ||
										data.trmsIvrrCntErr 		    == '2' ||
										data.trms5gponCntErr 			== '2' ||
										data.trmsSmuxCntErr 		    == '2' ||
										data.trmsFdfCntErr 		    	== '2' ||
										data.trmsRotnEpwrValErr 	    == '2' ||
										data.trmsIvrEpwrValErr 	    	== '2' ||
										data.trmsIvrrEpwrValErr 	    == '2' ||
										data.trms5gponEpwrValErr     	== '2' ||
										data.sbeqpRtfRackCntErr 	    == '2' ||
										data.sbeqpIpdCntErr 		    == '2' ||
										data.sbeqpArcnCntErr 			== '2' ||
										data.sbeqpBatryLipoCntErr    	== '2' ||
										data.sbeqpBatryCntErr 	    	== '2' ||
										data.upsdDemdRackCntErr 	    == '2' ||
										data.upsdDemdEpwrValErr 	    == '2' ||
										data.remRackCntErr 		    	== '2' ||
										data.remEpwrValErr 		    	== '2' ||
										data.shtgItmCdErr				== '2' ||
										data.screPsblEpwrValErr 	    == '2' ||
										data.epwrRfctInvtCostErr     	== '2' ||
										data.rmkErr						== '2' ) {
										return colColorChange("2");
									}
								}
							}

						}
					}
				},
				{ key : 'demdHdofcCd', align:'center', title : '본부', width: '65px' },
	   			{ key : 'demdAreaCd', align:'center', title : '지역', width: '65px' },
	   			{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px' },
	   			{ key : 'floorNm', align:'center', title : '층명', width: '150px'},

    			{ key : 'ctrtEpwrVal', align:'center', title : '계약전력(Kw)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.ctrtEpwrValErr); }}},
    			{ key : 'loadEpwrVal', align:'center', title : '부하전력(Kw)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.loadEpwrValErr); }}},
    			{ key : 'loadEpwrRate', align:'center', title : '부하율(%)', width: '100px',
    				render : function(value, data, render, mapping){
    					return '-';
    				}
    			},
    			{ key : 'g2RemvRackCnt', align:'center', title : '철거랙수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.g2RemvRackCntErr); }}},
    			{ key : 'g2ScreEpwrVal', align:'center', title : '확보전력(Kw)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.g2ScreEpwrValErr); }}},
    			{ key : 'lgcyEpwrVal', align:'center', title : 'Legacy 전력량(kw)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.lgcyEpwrValErr); }}},
    			{ key : 'lgcyRackCnt', align:'center', title : '랙수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.lgcyRackCntErr); }}},
    			{ key : 'lgcyDemdEpwrVal', align:'center', title : '전력량(kw)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.lgcyDemdEpwrValErr); }}},
    			{ key : 'g5DulCnt', align:'center', title : 'DUL수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.g5DulCntErr); }}},
    			{ key : 'g5DuhCnt', align:'center', title : 'DUH수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.g5DuhCntErr); }}},
    			{ key : 'g5DuhRackCnt', align:'center', title : 'DUH랙수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.g5DuhRackCntErr); }}},
    			{ key : 'g5DuhEpwrVal', align:'center', title : 'DUH전력량(kW)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.g5DuhEpwrValErr); }}},
    			{ key : 'trmsRotnCnt', align:'center', title : 'ROTN', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsRotnCntErr); }}},
    			{ key : 'trmsIvrCnt', align:'center', title : 'IVR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsIvrCntErr); }}},
    			{ key : 'trmsIvrrCnt', align:'center', title : 'IVRR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsIvrrCntErr); }}},
    			{ key : 'trms5gponCnt', align:'center', title : '5GPON', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trms5gponCntErr); }}},
    			{ key : 'trmsSmuxCnt', align:'center', title : 'SMUX', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsSmuxCntErr); }}},
    			{ key : 'trmsFdfCnt', align:'center', title : 'FDF', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsFdfCntErr); }}},
    			{ key : 'trmsRackSubtCnt', align:'center', title : '소계', width: '100px',
    				render : function(value, data, render, mapping){
    					return '-';
    				}
    			},
    			{ key : 'trmsRotnEpwrVal', align:'center', title : 'ROTN', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsRotnEpwrValErr); }}},
    			{ key : 'trmsIvrEpwrVal', align:'center', title : 'IVR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsIvrEpwrValErr); }}},
    			{ key : 'trmsIvrrEpwrVal', align:'center', title : 'IVRR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trmsIvrrEpwrValErr); }}},
    			{ key : 'trms5gponEpwrVal', align:'center', title : '5GPON', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.trms5gponEpwrValErr); }}},
    			{ key : 'trmsSubtEpwrVal', align:'center', title : '소계', width: '100px',
    				render : function(value, data, render, mapping){
    					return '-';
    				}
    			},
    			{ key : 'sbeqpRtfRackCnt', align:'center', title : '정류기랙수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sbeqpRtfRackCntErr); }}},
    			{ key : 'sbeqpIpdCnt', align:'center', title : 'IPD', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sbeqpIpdCntErr); }}},
    			{ key : 'sbeqpArcnCnt', align:'center', title : '냉방기', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sbeqpArcnCntErr); }}},
    			{ key : 'sbeqpBatryLipoCnt', align:'center', title : '축전지_리튬', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sbeqpBatryLipoCntErr); }}},
    			{ key : 'sbeqpBatryCnt', align:'center', title : '축전지_납', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sbeqpBatryCntErr); }}},
    			{ key : 'sbeqpSubtCnt', align:'center', title : '소계', width: '100px',
    				render : function(value, data, render, mapping){
    					return '-';
    				}
    			},
    			{ key : 'upsdDemdRackCnt', align:'center', title : '랙수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.upsdDemdRackCntErr); }}},
    			{ key : 'upsdDemdEpwrVal', align:'center', title : '소모전력(kW)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.upsdDemdEpwrValErr); }}},
    			{ key : 'remRackCnt', align:'center', title : '잔여랙수', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.remRackCntErr); }}},
    			{ key : 'remEpwrVal', align:'center', title : '잔여전력', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.remEpwrValErr); }}},
    			{ key : 'shtgItmCd', align:'center', title : '부족항목', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.shtgItmCdErr); }}},
    			{ key : 'screPsblEpwrVal', align:'center', title : '확보가능전력', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.screPsblEpwrValErr); }}},
    			{ key : 'epwrRfctInvtCost', align:'center', title : '전력보강투자비', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.epwrRfctInvtCostErr); }}},
    			{ key : 'rmk', align:'center', title : '비고', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmkErr); }}},

    			{ key : 'endEtcColVal1', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal2', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal3', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal4', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal5', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal6', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal7', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal8', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal9', align:'center', title : '기타1', width: '100px'},
    			{ key : 'endEtcColVal10', align:'center', title : '기타1', width: '100px'},


    			/***********************************************
	   			 * Row Check
	   			***********************************************/
    			{ key : 'ctrtEpwrValErr', align:'center', title : '계약전력(Kw)', width: '100px', hidden : true},
    			{ key : 'loadEpwrValErr', align:'center', title : '부하전력(Kw)', width: '100px', hidden : true},
    			{ key : 'g2RemvRackCntErr', align:'center', title : '철거랙수', width: '100px', hidden : true},
    			{ key : 'g2ScreEpwrValErr', align:'center', title : '확보전력(Kw)', width: '100px', hidden : true},
    			{ key : 'lgcyEpwrValErr', align:'center', title : 'Legacy 전력량(kw)', width: '100px', hidden : true},
    			{ key : 'lgcyRackCntErr', align:'center', title : '랙수', width: '100px', hidden : true},
    			{ key : 'lgcyDemdEpwrValErr', align:'center', title : '전력량(kw)', width: '100px', hidden : true},
    			{ key : 'g5DulCntErr', align:'center', title : 'DUL수', width: '100px', hidden : true},
    			{ key : 'g5DuhCntErr', align:'center', title : 'DUH수', width: '100px', hidden : true},
    			{ key : 'g5DuhRackCntErr', align:'center', title : 'DUH랙수', width: '100px', hidden : true},
    			{ key : 'g5DuhEpwrValErr', align:'center', title : 'DUH전력량(kW)', width: '100px', hidden : true},
    			{ key : 'trmsRotnCntErr', align:'center', title : 'ROTN', width: '100px', hidden : true},
    			{ key : 'trmsIvrCntErr', align:'center', title : 'IVR', width: '100px', hidden : true},
    			{ key : 'trmsIvrrCntErr', align:'center', title : 'IVRR', width: '100px', hidden : true},
    			{ key : 'trms5gponCntErr', align:'center', title : '5GPON', width: '100px', hidden : true},
    			{ key : 'trmsSmuxCntErr', align:'center', title : 'SMUX', width: '100px', hidden : true},
    			{ key : 'trmsFdfCntErr', align:'center', title : 'FDF', width: '100px', hidden : true},
    			{ key : 'trmsRotnEpwrValErr', align:'center', title : 'ROTN', width: '100px', hidden : true},
    			{ key : 'trmsIvrEpwrValErr', align:'center', title : 'IVR', width: '100px', hidden : true},
    			{ key : 'trmsIvrrEpwrValErr', align:'center', title : 'IVRR', width: '100px', hidden : true},
    			{ key : 'trms5gponEpwrValErr', align:'center', title : '5GPON', width: '100px', hidden : true},
    			{ key : 'sbeqpRtfRackCntErr', align:'center', title : '정류기랙수', width: '100px', hidden : true},
    			{ key : 'sbeqpIpdCntErr', align:'center', title : 'IPD', width: '100px', hidden : true},
    			{ key : 'sbeqpArcnCntErr', align:'center', title : '냉방기', width: '100px', hidden : true},
    			{ key : 'sbeqpBatryLipoCntErr', align:'center', title : '축전지_리튬', width: '100px', hidden : true},
    			{ key : 'sbeqpBatryCntErr', align:'center', title : '축전지_납', width: '100px', hidden : true},
    			{ key : 'upsdDemdRackCntErr', align:'center', title : '랙수', width: '100px', hidden : true},
    			{ key : 'upsdDemdEpwrValErr', align:'center', title : '소모전력(kW)', width: '100px', hidden : true},
    			{ key : 'remRackCntErr', align:'center', title : '잔여랙수', width: '100px', hidden : true},
    			{ key : 'remEpwrValErr', align:'center', title : '잔여전력', width: '100px', hidden : true},
    			{ key : 'shtgItmCdErr', align:'center', title : '부족항목', width: '100px', hidden : true},
    			{ key : 'shtgItmCdCol', align:'center', title : '부족항목', width: '100px', hidden : true},

    			{ key : 'screPsblEpwrValErr', align:'center', title : '확보가능전력', width: '100px', hidden : true},
    			{ key : 'epwrRfctInvtCostErr', align:'center', title : '전력보강투자비', width: '100px', hidden : true},
    			{ key : 'rmkErr', align:'center', title : '비고', width: '100px', hidden : true},

    			{ key : 'endEtcColVal1Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal2Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal3Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal4Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal5Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal6Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal7Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal8Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal9Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'endEtcColVal10Err', align:'center', title : '기타1', width: '100px', hidden : true},

	   			{ key : 'rowDelYn', align:'center', title : 'Row삭제유무', width: '150', hidden : true},
	   			{ key : 'uploadYn', align:'center', title : '판정결과', hidden : true}
	   		],
	   		message: {
	   		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
       });
		var param = {grpCd : 'UM000006', mtsoInvtItmVal : 'endEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'endHideCol');
	}

	function isUndefinedCheck(str) {
		var reStr = str;
		if(typeof str == 'undefined' && str == undefined){
			reStr = '';
		} else {
			reStr = str.toString().replace(/,/gi, '');
		}
		return reStr;
	}

	function isNaNCheck(str) {
		var reStr = '0';
		if(typeof str != 'undefined' && str != undefined && str != ''){
			str = str.toString().replace(/,/gi, '');
			if (isNaN(str)) {
				reStr = "1";
			}
		}
		return reStr;
	}

	function isExcelToDBCheck(excelStr, dbStr, baseDate, dbDate) {
		var reStr = '0';

		if (typeof excelStr != 'undefined' && excelStr != undefined) {
			excelStr = excelStr.toString().replace(/ /gi, '').replace(/,/gi, '');
		} else {
			excelStr = '';
		}

		if (typeof dbStr != 'undefined' && dbStr != undefined) {
			dbStr = dbStr.toString().replace(/ /gi, '').replace(/,/gi, '');
		} else {
			dbStr = '';
		}

		if (excelStr != dbStr) {
			reStr = '2';
			if(typeof dbDate != 'undefined' && dbDate != undefined && dbDate != ''){
				if (baseDate < dbDate) { reStr = '3'; }
			}
		}
		return reStr;
	}

	function setEventListener() {
		$('#uploadfile').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('dataEmpty');
			$('#'+excelGrid).alopexGrid('showProgress');
			var $input = $(this);
			var $grid = $('#'+excelGrid);
			var files = e.target.files;
			var worker = new ExcelWorker();
			worker.import($grid, files, function(dataList){
				for(var i = 0; i < dataList.length; i++){
					/***********************
					 * 국사투자자ID 정보 없는 제외
					***********************/
					dataList[i].rowDelYn = 'N';
					//uploadYn.uploadYn = 'Y';
					if(typeof dataList[i].mtsoInvtId == 'undefined' || dataList[i].mtsoInvtId == undefined || dataList[i].mtsoInvtId == ''){
						dataList[i].rowDelYn = 'Y';
						dataList[i].uploadYn = 'N';
						continue;
					} else {
						if(dataList[i].mtsoInvtId.indexOf('MI') == -1) {
							dataList[i].rowDelYn = 'Y';
							dataList[i].uploadYn = 'N';
							continue;
						}
					}
					/***********************
					 * isNaN 난수 항목 체크
					***********************/
					dataList[i].ctrtEpwrValErr 			= isNaNCheck(dataList[i].ctrtEpwrVal);
					dataList[i].loadEpwrValErr 			= isNaNCheck(dataList[i].loadEpwrVal);
					dataList[i].g2RemvRackCntErr	 	= isNaNCheck(dataList[i].g2RemvRackCnt);
					dataList[i].g2ScreEpwrValErr 		= isNaNCheck(dataList[i].g2ScreEpwrVal);
					dataList[i].lgcyEpwrValErr 			= isNaNCheck(dataList[i].lgcyEpwrVal);
					dataList[i].lgcyRackCntErr 			= isNaNCheck(dataList[i].lgcyRackCnt);
					dataList[i].lgcyDemdEpwrValErr 		= isNaNCheck(dataList[i].lgcyDemdEpwrVal);
					dataList[i].g5DulCntErr 			= isNaNCheck(dataList[i].g5DulCnt);
					dataList[i].g5DuhCntErr 			= isNaNCheck(dataList[i].g5DuhCnt);
					dataList[i].g5DuhRackCntErr 		= isNaNCheck(dataList[i].g5DuhRackCnt);
					dataList[i].g5DuhEpwrValErr 		= isNaNCheck(dataList[i].g5DuhEpwrVal);
					dataList[i].trmsRotnCntErr 			= isNaNCheck(dataList[i].trmsRotnCnt);
					dataList[i].trmsIvrCntErr 			= isNaNCheck(dataList[i].trmsIvrCnt);
					dataList[i].trmsIvrrCntErr 			= isNaNCheck(dataList[i].trmsIvrrCnt);
					dataList[i].trms5gponCntErr 		= isNaNCheck(dataList[i].trms5gponCnt);
					dataList[i].trmsSmuxCntErr 			= isNaNCheck(dataList[i].trmsSmuxCnt);
					dataList[i].trmsFdfCntErr 			= isNaNCheck(dataList[i].trmsFdfCnt);
					dataList[i].trmsRotnEpwrValErr 		= isNaNCheck(dataList[i].trmsRotnEpwrVal);
					dataList[i].trmsIvrEpwrValErr 		= isNaNCheck(dataList[i].trmsIvrEpwrVal);
					dataList[i].trmsIvrrEpwrValErr 		= isNaNCheck(dataList[i].trmsIvrrEpwrVal);
					dataList[i].trms5gponEpwrValErr 	= isNaNCheck(dataList[i].trms5gponEpwrVal);
					dataList[i].sbeqpRtfRackCntErr 		= isNaNCheck(dataList[i].sbeqpRtfRackCnt);
					dataList[i].sbeqpIpdCntErr 			= isNaNCheck(dataList[i].sbeqpIpdCnt);
					dataList[i].sbeqpArcnCntErr 		= isNaNCheck(dataList[i].sbeqpArcnCnt);
					dataList[i].sbeqpBatryLipoCntErr 	= isNaNCheck(dataList[i].sbeqpBatryLipoCnt);
					dataList[i].sbeqpBatryCntErr 		= isNaNCheck(dataList[i].sbeqpBatryCnt);
					dataList[i].upsdDemdRackCntErr 		= isNaNCheck(dataList[i].upsdDemdRackCnt);
					dataList[i].upsdDemdEpwrValErr 		= isNaNCheck(dataList[i].upsdDemdEpwrVal);
					dataList[i].remRackCntErr 			= isNaNCheck(dataList[i].remRackCnt);
					dataList[i].remEpwrValErr 			= isNaNCheck(dataList[i].remEpwrVal);
					dataList[i].screPsblEpwrValErr 		= isNaNCheck(dataList[i].screPsblEpwrVal);
					dataList[i].epwrRfctInvtCostErr 	= isNaNCheck(dataList[i].epwrRfctInvtCost);


					/***********************
					 * 코드값으로 정의
					***********************/
					if(typeof dataList[i].shtgItmCd != 'undefined' && dataList[i].shtgItmCd != undefined && dataList[i].shtgItmCd != ''){
						for (var j = 0; j < grShtgItmCd.length; j++) {
							dataList[i].shtgItmCdErr = "1";
							if (dataList[i].shtgItmCd.toString().trim().replace(/ /gi, '') == grShtgItmCd[j].text.trim().replace(/ /gi, '')) {
								dataList[i].shtgItmCdCol = grShtgItmCd[j].value;
								dataList[i].shtgItmCdErr = "0";
								break;
							}
						}
					}
				}
				$grid.alopexGrid('dataAdd', dataList);
			});
			//$input.val('');

			var param = [];
	    	var page = 1;
	    	var rowPerPage = 1000000;
	    	param.pageNo = page;
	    	param.rowPerPage = rowPerPage;
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5EndDsnList', param, 'GET', 'search');
		});

		$('#btnUpload').on('click', function(e) {

			var ckGubun = $("input:checkbox[name=gubun1][value='Y']").is(":checked") ? true : false;
			var userId 	= $("#userId").val();
			var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
			var excelSaveDtlList = [];
			var comText = 'Excel 다운로드 일시 이후 변경된 항목은 저장되지 않습니다.<br><br>저장하시겠습니까?';
			if (ckGubun) {
				for(var i in dataObj) {
					if (dataObj[i].uploadYn != 'N' &&
						dataObj[i].ctrtEpwrValErr 			!= '3' &&
						dataObj[i].loadEpwrValErr 		    != '3' &&
						dataObj[i].g2RemvRackCntErr	 		!= '3' &&
						dataObj[i].g2ScreEpwrValErr 	    != '3' &&
						dataObj[i].lgcyEpwrValErr 		    != '3' &&
						dataObj[i].lgcyRackCntErr 		    != '3' &&
						dataObj[i].lgcyDemdEpwrValErr 	    != '3' &&
						dataObj[i].g5DulCntErr 				!= '3' &&
						dataObj[i].g5DuhCntErr 				!= '3' &&
						dataObj[i].g5DuhRackCntErr 			!= '3' &&
						dataObj[i].g5DuhEpwrValErr 			!= '3' &&
						dataObj[i].trmsRotnCntErr 		    != '3' &&
						dataObj[i].trmsIvrCntErr 		    != '3' &&
						dataObj[i].trmsIvrrCntErr 		    != '3' &&
						dataObj[i].trms5gponCntErr 			!= '3' &&
						dataObj[i].trmsSmuxCntErr 		    != '3' &&
						dataObj[i].trmsFdfCntErr 		    != '3' &&
						dataObj[i].trmsRotnEpwrValErr 	    != '3' &&
						dataObj[i].trmsIvrEpwrValErr 	    != '3' &&
						dataObj[i].trmsIvrrEpwrValErr 	    != '3' &&
						dataObj[i].trms5gponEpwrValErr     	!= '3' &&
						dataObj[i].sbeqpRtfRackCntErr 	    != '3' &&
						dataObj[i].sbeqpIpdCntErr 		    != '3' &&
						dataObj[i].sbeqpArcnCntErr 			!= '3' &&
						dataObj[i].sbeqpBatryLipoCntErr    	!= '3' &&
						dataObj[i].sbeqpBatryCntErr 	    != '3' &&
						dataObj[i].upsdDemdRackCntErr 	    != '3' &&
						dataObj[i].upsdDemdEpwrValErr 	    != '3' &&
						dataObj[i].remRackCntErr 		    != '3' &&
						dataObj[i].remEpwrValErr 		    != '3' &&
						dataObj[i].shtgItmCdErr				!= '3' &&
						dataObj[i].screPsblEpwrValErr 	    != '3' &&
						dataObj[i].epwrRfctInvtCostErr 		!= '3' &&
						dataObj[i].rmkErr					!= '3' &&
						dataObj[i].endEtcColVal1Err			!= '3' &&
						dataObj[i].endEtcColVal2Err			!= '3' &&
						dataObj[i].endEtcColVal3Err			!= '3' &&
						dataObj[i].endEtcColVal4Err			!= '3' &&
						dataObj[i].endEtcColVal5Err			!= '3' &&
						dataObj[i].endEtcColVal6Err			!= '3' &&
						dataObj[i].endEtcColVal7Err			!= '3' &&
						dataObj[i].endEtcColVal8Err			!= '3' &&
						dataObj[i].endEtcColVal9Err			!= '3' &&
						dataObj[i].endEtcColVal10Err		!= '3' && (
						dataObj[i].ctrtEpwrValErr 			== '2' ||
						dataObj[i].loadEpwrValErr 		    == '2' ||
						dataObj[i].g2RemvRackCntErr	 		== '2' ||
						dataObj[i].g2ScreEpwrValErr 	    == '2' ||
						dataObj[i].lgcyEpwrValErr 		    == '2' ||
						dataObj[i].lgcyRackCntErr 		    == '2' ||
						dataObj[i].lgcyDemdEpwrValErr 	    == '2' ||
						dataObj[i].g5DulCntErr 				== '2' ||
						dataObj[i].g5DuhCntErr 				== '2' ||
						dataObj[i].g5DuhRackCntErr 			== '2' ||
						dataObj[i].g5DuhEpwrValErr 			== '2' ||
						dataObj[i].trmsRotnCntErr 		    == '2' ||
						dataObj[i].trmsIvrCntErr 		    == '2' ||
						dataObj[i].trmsIvrrCntErr 		    == '2' ||
						dataObj[i].trms5gponCntErr 			== '2' ||
						dataObj[i].trmsSmuxCntErr 		    == '2' ||
						dataObj[i].trmsFdfCntErr 		    == '2' ||
						dataObj[i].trmsRotnEpwrValErr 	    == '2' ||
						dataObj[i].trmsIvrEpwrValErr 	    == '2' ||
						dataObj[i].trmsIvrrEpwrValErr 	    == '2' ||
						dataObj[i].trms5gponEpwrValErr     	== '2' ||
						dataObj[i].sbeqpRtfRackCntErr 	    == '2' ||
						dataObj[i].sbeqpIpdCntErr 		    == '2' ||
						dataObj[i].sbeqpArcnCntErr 			== '2' ||
						dataObj[i].sbeqpBatryLipoCntErr    	== '2' ||
						dataObj[i].sbeqpBatryCntErr 	    == '2' ||
						dataObj[i].upsdDemdRackCntErr 	    == '2' ||
						dataObj[i].upsdDemdEpwrValErr 	    == '2' ||
						dataObj[i].remRackCntErr 		    == '2' ||
						dataObj[i].remEpwrValErr 		    == '2' ||
						dataObj[i].shtgItmCdErr				== '2' ||
						dataObj[i].screPsblEpwrValErr 	    == '2' ||
						dataObj[i].epwrRfctInvtCostErr     	== '2' ||
						dataObj[i].rmkErr					== '2' ||
						dataObj[i].endEtcColVal1Err			== '2' ||
						dataObj[i].endEtcColVal2Err			== '2' ||
						dataObj[i].endEtcColVal3Err			== '2' ||
						dataObj[i].endEtcColVal4Err			== '2' ||
						dataObj[i].endEtcColVal5Err			== '2' ||
						dataObj[i].endEtcColVal6Err			== '2' ||
						dataObj[i].endEtcColVal7Err			== '2' ||
						dataObj[i].endEtcColVal8Err			== '2' ||
						dataObj[i].endEtcColVal9Err			== '2' ||
						dataObj[i].endEtcColVal10Err		== '2' )) {
						var tmpList = {
								mtsoInvtId 				: isUndefinedCheck(dataObj[i].mtsoInvtId),
								ctrtEpwrVal 		    : isUndefinedCheck(dataObj[i].ctrtEpwrVal),
								loadEpwrVal 		    : isUndefinedCheck(dataObj[i].loadEpwrVal),
								g2RemvRackCnt	 	    : isUndefinedCheck(dataObj[i].g2RemvRackCnt),
								g2ScreEpwrVal 	        : isUndefinedCheck(dataObj[i].g2ScreEpwrVal),
								lgcyEpwrVal 		    : isUndefinedCheck(dataObj[i].lgcyEpwrVal),
								lgcyRackCnt 		    : isUndefinedCheck(dataObj[i].lgcyRackCnt),
								lgcyDemdEpwrVal 	    : isUndefinedCheck(dataObj[i].lgcyDemdEpwrVal),
								g5DulCnt 			    : isUndefinedCheck(dataObj[i].g5DulCnt),
								g5DuhCnt 			    : isUndefinedCheck(dataObj[i].g5DuhCnt),
								g5DuhRackCnt 		    : isUndefinedCheck(dataObj[i].g5DuhRackCnt),
								g5DuhEpwrVal 		    : isUndefinedCheck(dataObj[i].g5DuhEpwrVal),
								trmsRotnCnt 		    : isUndefinedCheck(dataObj[i].trmsRotnCnt),
								trmsIvrCnt 		        : isUndefinedCheck(dataObj[i].trmsIvrCnt),
								trmsIvrrCnt 		    : isUndefinedCheck(dataObj[i].trmsIvrrCnt),
								trms5gponCnt 		    : isUndefinedCheck(dataObj[i].trms5gponCnt),
								trmsSmuxCnt 		    : isUndefinedCheck(dataObj[i].trmsSmuxCnt),
								trmsFdfCnt 				: isUndefinedCheck(dataObj[i].trmsFdfCnt),
								trmsRotnEpwrVal 		: isUndefinedCheck(dataObj[i].trmsRotnEpwrVal),
								trmsIvrEpwrVal 			: isUndefinedCheck(dataObj[i].trmsIvrEpwrVal),
								trmsIvrrEpwrVal 		: isUndefinedCheck(dataObj[i].trmsIvrrEpwrVal),
								trms5gponEpwrVal 		: isUndefinedCheck(dataObj[i].trms5gponEpwrVal),
								sbeqpRtfRackCnt 		: isUndefinedCheck(dataObj[i].sbeqpRtfRackCnt),
								sbeqpIpdCnt 			: isUndefinedCheck(dataObj[i].sbeqpIpdCnt),
								sbeqpArcnCnt 			: isUndefinedCheck(dataObj[i].sbeqpArcnCnt),
								sbeqpBatryLipoCnt		: isUndefinedCheck(dataObj[i].sbeqpBatryLipoCnt),
								sbeqpBatryCnt 			: isUndefinedCheck(dataObj[i].sbeqpBatryCnt),
								upsdDemdRackCnt 		: isUndefinedCheck(dataObj[i].upsdDemdRackCnt),
								upsdDemdEpwrVal 		: isUndefinedCheck(dataObj[i].upsdDemdEpwrVal),
								remRackCnt 				: isUndefinedCheck(dataObj[i].remRackCnt),
								remEpwrVal 				: isUndefinedCheck(dataObj[i].remEpwrVal),
								shtgItmCd				: isUndefinedCheck(dataObj[i].shtgItmCdCol),
								screPsblEpwrVal 		: isUndefinedCheck(dataObj[i].screPsblEpwrVal),
								epwrRfctInvtCost 		: isUndefinedCheck(dataObj[i].epwrRfctInvtCost),
								rmk 					: isUndefinedCheck(dataObj[i].rmk),


								endEtcColVal1			: isUndefinedCheck(dataObj[i].endEtcColVal1),
								endEtcColVal2			: isUndefinedCheck(dataObj[i].endEtcColVal2),
								endEtcColVal3			: isUndefinedCheck(dataObj[i].endEtcColVal3),
								endEtcColVal4			: isUndefinedCheck(dataObj[i].endEtcColVal4),
								endEtcColVal5			: isUndefinedCheck(dataObj[i].endEtcColVal5),
								endEtcColVal6			: isUndefinedCheck(dataObj[i].endEtcColVal6),
								endEtcColVal7			: isUndefinedCheck(dataObj[i].endEtcColVal7),
								endEtcColVal8			: isUndefinedCheck(dataObj[i].endEtcColVal8),
								endEtcColVal9			: isUndefinedCheck(dataObj[i].endEtcColVal9),
								endEtcColVal10 			: isUndefinedCheck(dataObj[i].endEtcColVal10),




								userId					: userId,
								frstRegUserId			: userId,
								lastChgUserId			: userId
						};
						excelSaveDtlList.push(tmpList);
					}
				}
			} else {
				var comText = '<font color=red>업로드 (행)제외</font>에 항목에 <font color=red>체크 해제</font>되어 있습니다.<br>Excel 다운로드 일시 이후 변경된 항목이 있을 수 있습니다.<br><br>업로드 된 Excel 기준으로 저장하시겠습니까?';
				for(var i in dataObj) {
					if (dataObj[i].uploadYn != 'N' && (
						dataObj[i].ctrtEpwrValErr 			== '2' || dataObj[i].ctrtEpwrValErr 			== '3' ||
						dataObj[i].loadEpwrValErr 		    == '2' || dataObj[i].loadEpwrValErr 		    == '3' ||
						dataObj[i].g2RemvRackCntErr	 		== '2' || dataObj[i].g2RemvRackCntErr	 		== '3' ||
						dataObj[i].g2ScreEpwrValErr 	    == '2' || dataObj[i].g2ScreEpwrValErr 	    	== '3' ||
						dataObj[i].lgcyEpwrValErr 		    == '2' || dataObj[i].lgcyEpwrValErr 		    == '3' ||
						dataObj[i].lgcyRackCntErr 		    == '2' || dataObj[i].lgcyRackCntErr 		    == '3' ||
						dataObj[i].lgcyDemdEpwrValErr 	    == '2' || dataObj[i].lgcyDemdEpwrValErr 	    == '3' ||
						dataObj[i].g5DulCntErr 				== '2' || dataObj[i].g5DulCntErr 				== '3' ||
						dataObj[i].g5DuhCntErr 				== '2' || dataObj[i].g5DuhCntErr 				== '3' ||
						dataObj[i].g5DuhRackCntErr 			== '2' || dataObj[i].g5DuhRackCntErr 			== '3' ||
						dataObj[i].g5DuhEpwrValErr 			== '2' || dataObj[i].g5DuhEpwrValErr 			== '3' ||
						dataObj[i].trmsRotnCntErr 		    == '2' || dataObj[i].trmsRotnCntErr 		    == '3' ||
						dataObj[i].trmsIvrCntErr 		    == '2' || dataObj[i].trmsIvrCntErr 		    	== '3' ||
						dataObj[i].trmsIvrrCntErr 		    == '2' || dataObj[i].trmsIvrrCntErr 		    == '3' ||
						dataObj[i].trms5gponCntErr 			== '2' || dataObj[i].trms5gponCntErr 			== '3' ||
						dataObj[i].trmsSmuxCntErr 		    == '2' || dataObj[i].trmsSmuxCntErr 		    == '3' ||
						dataObj[i].trmsFdfCntErr 		    == '2' || dataObj[i].trmsFdfCntErr 		    	== '3' ||
						dataObj[i].trmsRotnEpwrValErr 	    == '2' || dataObj[i].trmsRotnEpwrValErr 	    == '3' ||
						dataObj[i].trmsIvrEpwrValErr 	    == '2' || dataObj[i].trmsIvrEpwrValErr 	    	== '3' ||
						dataObj[i].trmsIvrrEpwrValErr 	    == '2' || dataObj[i].trmsIvrrEpwrValErr 	    == '3' ||
						dataObj[i].trms5gponEpwrValErr     	== '2' || dataObj[i].trms5gponEpwrValErr     	== '3' ||
						dataObj[i].sbeqpRtfRackCntErr 	    == '2' || dataObj[i].sbeqpRtfRackCntErr 	    == '3' ||
						dataObj[i].sbeqpIpdCntErr 		    == '2' || dataObj[i].sbeqpIpdCntErr 		    == '3' ||
						dataObj[i].sbeqpArcnCntErr 			== '2' || dataObj[i].sbeqpArcnCntErr 			== '3' ||
						dataObj[i].sbeqpBatryLipoCntErr    	== '2' || dataObj[i].sbeqpBatryLipoCntErr    	== '3' ||
						dataObj[i].sbeqpBatryCntErr 	    == '2' || dataObj[i].sbeqpBatryCntErr 	    	== '3' ||
						dataObj[i].upsdDemdRackCntErr 	    == '2' || dataObj[i].upsdDemdRackCntErr 	    == '3' ||
						dataObj[i].upsdDemdEpwrValErr 	    == '2' || dataObj[i].upsdDemdEpwrValErr 	    == '3' ||
						dataObj[i].remRackCntErr 		    == '2' || dataObj[i].remRackCntErr 		    	== '3' ||
						dataObj[i].remEpwrValErr 		    == '2' || dataObj[i].remEpwrValErr 		    	== '3' ||
						dataObj[i].shtgItmCdErr				== '2' || dataObj[i].shtgItmCdErr				== '3' ||
						dataObj[i].screPsblEpwrValErr 	    == '2' || dataObj[i].screPsblEpwrValErr 	    == '3' ||
						dataObj[i].epwrRfctInvtCostErr     	== '2' || dataObj[i].epwrRfctInvtCostErr     	== '3' ||
						dataObj[i].rmkErr     				== '2' || dataObj[i].rmkErr     				== '3' ||

						dataObj[i].endEtcColVal1Err			== '2' || dataObj[i].endEtcColVal1Err			== '3' ||
						dataObj[i].endEtcColVal2Err			== '2' || dataObj[i].endEtcColVal2Err			== '3' ||
						dataObj[i].endEtcColVal3Err			== '2' || dataObj[i].endEtcColVal3Err			== '3' ||
						dataObj[i].endEtcColVal4Err			== '2' || dataObj[i].endEtcColVal4Err			== '3' ||
						dataObj[i].endEtcColVal5Err			== '2' || dataObj[i].endEtcColVal5Err			== '3' ||
						dataObj[i].endEtcColVal6Err			== '2' || dataObj[i].endEtcColVal6Err			== '3' ||
						dataObj[i].endEtcColVal7Err			== '2' || dataObj[i].endEtcColVal7Err			== '3' ||
						dataObj[i].endEtcColVal8Err			== '2' || dataObj[i].endEtcColVal8Err			== '3' ||
						dataObj[i].endEtcColVal9Err			== '2' || dataObj[i].endEtcColVal9Err			== '3' ||
						dataObj[i].endEtcColVal10Err		== '2' || dataObj[i].endEtcColVal10Err			== '3' )) {
						var tmpList = {
								mtsoInvtId 				: isUndefinedCheck(dataObj[i].mtsoInvtId),
								ctrtEpwrVal 		    : isUndefinedCheck(dataObj[i].ctrtEpwrVal),
								loadEpwrVal 		    : isUndefinedCheck(dataObj[i].loadEpwrVal),
								g2RemvRackCnt	 	    : isUndefinedCheck(dataObj[i].g2RemvRackCnt),
								g2ScreEpwrVal 	        : isUndefinedCheck(dataObj[i].g2ScreEpwrVal),
								lgcyEpwrVal 		    : isUndefinedCheck(dataObj[i].lgcyEpwrVal),
								lgcyRackCnt 		    : isUndefinedCheck(dataObj[i].lgcyRackCnt),
								lgcyDemdEpwrVal 	    : isUndefinedCheck(dataObj[i].lgcyDemdEpwrVal),
								g5DulCnt 			    : isUndefinedCheck(dataObj[i].g5DulCnt),
								g5DuhCnt 			    : isUndefinedCheck(dataObj[i].g5DuhCnt),
								g5DuhRackCnt 		    : isUndefinedCheck(dataObj[i].g5DuhRackCnt),
								g5DuhEpwrVal 		    : isUndefinedCheck(dataObj[i].g5DuhEpwrVal),
								trmsRotnCnt 		    : isUndefinedCheck(dataObj[i].trmsRotnCnt),
								trmsIvrCnt 		        : isUndefinedCheck(dataObj[i].trmsIvrCnt),
								trmsIvrrCnt 		    : isUndefinedCheck(dataObj[i].trmsIvrrCnt),
								trms5gponCnt 		    : isUndefinedCheck(dataObj[i].trms5gponCnt),
								trmsSmuxCnt 		    : isUndefinedCheck(dataObj[i].trmsSmuxCnt),
								trmsFdfCnt 				: isUndefinedCheck(dataObj[i].trmsFdfCnt),
								trmsRotnEpwrVal 		: isUndefinedCheck(dataObj[i].trmsRotnEpwrVal),
								trmsIvrEpwrVal 			: isUndefinedCheck(dataObj[i].trmsIvrEpwrVal),
								trmsIvrrEpwrVal 		: isUndefinedCheck(dataObj[i].trmsIvrrEpwrVal),
								trms5gponEpwrVal 		: isUndefinedCheck(dataObj[i].trms5gponEpwrVal),
								sbeqpRtfRackCnt 		: isUndefinedCheck(dataObj[i].sbeqpRtfRackCnt),
								sbeqpIpdCnt 			: isUndefinedCheck(dataObj[i].sbeqpIpdCnt),
								sbeqpArcnCnt 			: isUndefinedCheck(dataObj[i].sbeqpArcnCnt),
								sbeqpBatryLipoCnt		: isUndefinedCheck(dataObj[i].sbeqpBatryLipoCnt),
								sbeqpBatryCnt 			: isUndefinedCheck(dataObj[i].sbeqpBatryCnt),
								upsdDemdRackCnt 		: isUndefinedCheck(dataObj[i].upsdDemdRackCnt),
								upsdDemdEpwrVal 		: isUndefinedCheck(dataObj[i].upsdDemdEpwrVal),
								remRackCnt 				: isUndefinedCheck(dataObj[i].remRackCnt),
								remEpwrVal 				: isUndefinedCheck(dataObj[i].remEpwrVal),
								shtgItmCd				: isUndefinedCheck(dataObj[i].shtgItmCdCol),
								screPsblEpwrVal 		: isUndefinedCheck(dataObj[i].screPsblEpwrVal),
								epwrRfctInvtCost 		: isUndefinedCheck(dataObj[i].epwrRfctInvtCost),
								rmk 					: isUndefinedCheck(dataObj[i].rmk),

								endEtcColVal1			: isUndefinedCheck(dataObj[i].endEtcColVal1),
								endEtcColVal2			: isUndefinedCheck(dataObj[i].endEtcColVal2),
								endEtcColVal3			: isUndefinedCheck(dataObj[i].endEtcColVal3),
								endEtcColVal4			: isUndefinedCheck(dataObj[i].endEtcColVal4),
								endEtcColVal5			: isUndefinedCheck(dataObj[i].endEtcColVal5),
								endEtcColVal6			: isUndefinedCheck(dataObj[i].endEtcColVal6),
								endEtcColVal7			: isUndefinedCheck(dataObj[i].endEtcColVal7),
								endEtcColVal8			: isUndefinedCheck(dataObj[i].endEtcColVal8),
								endEtcColVal9			: isUndefinedCheck(dataObj[i].endEtcColVal9),
								endEtcColVal10 			: isUndefinedCheck(dataObj[i].endEtcColVal10),

								userId					: userId,
								frstRegUserId			: userId,
								lastChgUserId			: userId
						};
						excelSaveDtlList.push(tmpList);
					}
				}
			}
			if (excelSaveDtlList == null || excelSaveDtlList == undefined || excelSaveDtlList == "") {
				callMsgBox('','W', '저장 가능한 항목이 없습니다.(Excel 다운로드 일시 이후 변경된 항목 포함)<br><br>목록을 확인하시기 바랍니다.' , function(msgId, msgRst){});
			} else {
				callMsgBox('','C', comText, function(msgId, msgRst){
	 		        if (msgRst == 'Y') {
	 		        	$('#'+excelGrid).alopexGrid('showProgress');
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5EndDsnList', excelSaveDtlList, 'POST', 'saveG5EndDsn');
	 		        }
			     });
			}
		});


		$('#downLoadDate').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('showProgress');
			var param = [];
	    	var page = 1;
	    	var rowPerPage = 1000000;
	    	param.pageNo = page;
	    	param.rowPerPage = rowPerPage;
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5EndDsnList', param, 'GET', 'search');
		});

		// 닫기
		$('#btnCancel').on('click', function(e) {
			$a.close();
		});
	};

	function successCallback(response, status, jqxhr, flag) {
		if(flag == 'search'){
    		$('#'+excelGrid).alopexGrid('hideProgress');

    		var lastChgDate = $("#downLoadDate").val();
    		var dbData = response.g5EndDsnList;
    		//var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{rowDelYn : 'N'});
    		var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
			for(var i in dataObj) {
				if (typeof dataObj[i].mtsoInvtId != 'undefined' && dataObj[i].mtsoInvtId != undefined) {
					if (dataObj[i].mtsoInvtId.indexOf('MI') == -1) {
						$('#'+excelGrid).alopexGrid("dataDelete", {mtsoInvtId:dataObj[i].mtsoInvtId});
						continue;
					}
				} else {
					dataObj[i].mtsoInvtId = '';
					continue;
				}

				if (dataObj[i].ctrtEpwrValErr 			== '1' ||
					dataObj[i].loadEpwrValErr 			== '1' ||
					dataObj[i].g2RemvRackCntErr	 		== '1' ||
					dataObj[i].g2ScreEpwrValErr 		== '1' ||
					dataObj[i].lgcyEpwrValErr 			== '1' ||
					dataObj[i].lgcyRackCntErr 			== '1' ||
					dataObj[i].lgcyDemdEpwrValErr 		== '1' ||
					dataObj[i].g5DulCntErr 				== '1' ||
					dataObj[i].g5DuhCntErr 				== '1' ||
					dataObj[i].g5DuhRackCntErr 			== '1' ||
					dataObj[i].g5DuhEpwrValErr 			== '1' ||
					dataObj[i].trmsRotnCntErr 			== '1' ||
					dataObj[i].trmsIvrCntErr 			== '1' ||
					dataObj[i].trmsIvrrCntErr 			== '1' ||
					dataObj[i].trms5gponCntErr 			== '1' ||
					dataObj[i].trmsSmuxCntErr 			== '1' ||
					dataObj[i].trmsFdfCntErr 			== '1' ||
					dataObj[i].trmsRotnEpwrValErr 		== '1' ||
					dataObj[i].trmsIvrEpwrValErr 		== '1' ||
					dataObj[i].trmsIvrrEpwrValErr 		== '1' ||
					dataObj[i].trms5gponEpwrValErr 		== '1' ||
					dataObj[i].sbeqpRtfRackCntErr 		== '1' ||
					dataObj[i].sbeqpIpdCntErr 			== '1' ||
					dataObj[i].sbeqpArcnCntErr 			== '1' ||
					dataObj[i].sbeqpBatryLipoCntErr 	== '1' ||
					dataObj[i].sbeqpBatryCntErr 		== '1' ||
					dataObj[i].upsdDemdRackCntErr 		== '1' ||
					dataObj[i].upsdDemdEpwrValErr 		== '1' ||
					dataObj[i].remRackCntErr 			== '1' ||
					dataObj[i].remEpwrValErr 			== '1' ||
					dataObj[i].shtgItmCdErr 			== '1' ||
					dataObj[i].screPsblEpwrValErr 		== '1' ||
					dataObj[i].epwrRfctInvtCostErr 		== '1') {
					$('#'+excelGrid).alopexGrid('dataEdit',{uploadYn:'N'},{mtsoInvtId:dataObj[i].mtsoInvtId});
					continue;
				}

				var ckctrtEpwrValErr 			= '0';
				var ckloadEpwrValErr 			= '0';
				var ckg2RemvRackCntErr	 		= '0';
				var ckg2ScreEpwrValErr 			= '0';
				var cklgcyEpwrValErr 			= '0';
				var cklgcyRackCntErr 			= '0';
				var cklgcyDemdEpwrValErr 		= '0';
				var ckg5DulCntErr 				= '0';
				var ckg5DuhCntErr 				= '0';
				var ckg5DuhRackCntErr 			= '0';
				var ckg5DuhEpwrValErr 			= '0';
				var cktrmsRotnCntErr 			= '0';
				var cktrmsIvrCntErr 			= '0';
				var cktrmsIvrrCntErr 			= '0';
				var cktrms5gponCntErr 			= '0';
				var cktrmsSmuxCntErr 			= '0';
				var cktrmsFdfCntErr 			= '0';
				var cktrmsRotnEpwrValErr 		= '0';
				var cktrmsIvrEpwrValErr 		= '0';
				var cktrmsIvrrEpwrValErr 		= '0';
				var cktrms5gponEpwrValErr 		= '0';
				var cksbeqpRtfRackCntErr 		= '0';
				var cksbeqpIpdCntErr 			= '0';
				var cksbeqpArcnCntErr 			= '0';
				var cksbeqpBatryLipoCntErr 		= '0';
				var cksbeqpBatryCntErr 			= '0';
				var ckupsdDemdRackCntErr 		= '0';
				var ckupsdDemdEpwrValErr 		= '0';
				var ckremRackCntErr 			= '0';
				var ckremEpwrValErr 			= '0';
				var ckshtgItmCdErr				= '0';
				var ckscrePsblEpwrValErr 		= '0';
				var ckepwrRfctInvtCostErr 		= '0';
				var ckrmkErr					= '0';


				var ckendEtcColVal1Err					= '0';
				var ckendEtcColVal2Err					= '0';
				var ckendEtcColVal3Err					= '0';
				var ckendEtcColVal4Err					= '0';
				var ckendEtcColVal5Err					= '0';
				var ckendEtcColVal6Err					= '0';
				var ckendEtcColVal7Err					= '0';
				var ckendEtcColVal8Err					= '0';
				var ckendEtcColVal9Err					= '0';
				var ckendEtcColVal10Err					= '0';


				for(var j in dbData) {
					var dBlastChgDate = dbData[j].lastChgDate;
					if (dataObj[i].mtsoInvtId == dbData[j].mtsoInvtId && dataObj[i].uploadYn != 'N') {
						ckctrtEpwrValErr 			= isExcelToDBCheck(dataObj[i].ctrtEpwrVal, 		dbData[j].ctrtEpwrVal, lastChgDate, 	dBlastChgDate);
						ckloadEpwrValErr 			= isExcelToDBCheck(dataObj[i].loadEpwrVal, 		dbData[j].loadEpwrVal, lastChgDate, 	dBlastChgDate);
						ckg2RemvRackCntErr	 		= isExcelToDBCheck(dataObj[i].g2RemvRackCnt, 	dbData[j].g2RemvRackCnt, lastChgDate, 	dBlastChgDate);
						ckg2ScreEpwrValErr 			= isExcelToDBCheck(dataObj[i].g2ScreEpwrVal, 	dbData[j].g2ScreEpwrVal, lastChgDate, 	dBlastChgDate);
						cklgcyEpwrValErr 			= isExcelToDBCheck(dataObj[i].lgcyEpwrVal, 		dbData[j].lgcyEpwrVal, lastChgDate, 	dBlastChgDate);
						cklgcyRackCntErr 			= isExcelToDBCheck(dataObj[i].lgcyRackCnt, 		dbData[j].lgcyRackCnt, lastChgDate, 	dBlastChgDate);
						cklgcyDemdEpwrValErr 		= isExcelToDBCheck(dataObj[i].lgcyDemdEpwrVal, 	dbData[j].lgcyDemdEpwrVal, lastChgDate, dBlastChgDate);
						ckg5DulCntErr 				= isExcelToDBCheck(dataObj[i].g5DulCnt, 		dbData[j].g5DulCnt, lastChgDate, 		dBlastChgDate);
						ckg5DuhCntErr 				= isExcelToDBCheck(dataObj[i].g5DuhCnt, 		dbData[j].g5DuhCnt, lastChgDate, 		dBlastChgDate);
						ckg5DuhRackCntErr 			= isExcelToDBCheck(dataObj[i].g5DuhRackCnt, 	dbData[j].g5DuhRackCnt, lastChgDate, 	dBlastChgDate);
						ckg5DuhEpwrValErr 			= isExcelToDBCheck(dataObj[i].g5DuhEpwrVal, 	dbData[j].g5DuhEpwrVal, lastChgDate, 	dBlastChgDate);
						cktrmsRotnCntErr 			= isExcelToDBCheck(dataObj[i].trmsRotnCnt, 		dbData[j].trmsRotnCnt, lastChgDate, 	dBlastChgDate);
						cktrmsIvrCntErr 			= isExcelToDBCheck(dataObj[i].trmsIvrCnt, 		dbData[j].trmsIvrCnt, lastChgDate, 		dBlastChgDate);
						cktrmsIvrrCntErr 			= isExcelToDBCheck(dataObj[i].trmsIvrrCnt, 		dbData[j].trmsIvrrCnt, lastChgDate, 	dBlastChgDate);
						cktrms5gponCntErr 			= isExcelToDBCheck(dataObj[i].trms5gponCnt, 	dbData[j].trms5gponCnt, lastChgDate, 	dBlastChgDate);
						cktrmsSmuxCntErr 			= isExcelToDBCheck(dataObj[i].trmsSmuxCnt, 		dbData[j].trmsSmuxCnt, lastChgDate, 	dBlastChgDate);
						cktrmsFdfCntErr 			= isExcelToDBCheck(dataObj[i].trmsFdfCnt, 		dbData[j].trmsFdfCnt, lastChgDate, 		dBlastChgDate);
						cktrmsRotnEpwrValErr 		= isExcelToDBCheck(dataObj[i].trmsRotnEpwrVal, 	dbData[j].trmsRotnEpwrVal, lastChgDate, dBlastChgDate);
						cktrmsIvrEpwrValErr 		= isExcelToDBCheck(dataObj[i].trmsIvrEpwrVal, 	dbData[j].trmsIvrEpwrVal, lastChgDate, 	dBlastChgDate);
						cktrmsIvrrEpwrValErr 		= isExcelToDBCheck(dataObj[i].trmsIvrrEpwrVal, 	dbData[j].trmsIvrrEpwrVal, lastChgDate, dBlastChgDate);
						cktrms5gponEpwrValErr 		= isExcelToDBCheck(dataObj[i].trms5gponEpwrVal, dbData[j].trms5gponEpwrVal, lastChgDate,dBlastChgDate);
						cksbeqpRtfRackCntErr 		= isExcelToDBCheck(dataObj[i].sbeqpRtfRackCnt, 	dbData[j].sbeqpRtfRackCnt, lastChgDate, dBlastChgDate);
						cksbeqpIpdCntErr 			= isExcelToDBCheck(dataObj[i].sbeqpIpdCnt, 		dbData[j].sbeqpIpdCnt, lastChgDate, 	dBlastChgDate);
						cksbeqpArcnCntErr 			= isExcelToDBCheck(dataObj[i].sbeqpArcnCnt, 	dbData[j].sbeqpArcnCnt, lastChgDate, 	dBlastChgDate);
						cksbeqpBatryLipoCntErr 		= isExcelToDBCheck(dataObj[i].sbeqpBatryLipoCnt,dbData[j].sbeqpBatryLipoCnt, lastChgDate, dBlastChgDate);
						cksbeqpBatryCntErr 			= isExcelToDBCheck(dataObj[i].sbeqpBatryCnt, 	dbData[j].sbeqpBatryCnt, lastChgDate, 	dBlastChgDate);
						ckupsdDemdRackCntErr 		= isExcelToDBCheck(dataObj[i].upsdDemdRackCnt, 	dbData[j].upsdDemdRackCnt, lastChgDate, dBlastChgDate);
						ckupsdDemdEpwrValErr 		= isExcelToDBCheck(dataObj[i].upsdDemdEpwrVal, 	dbData[j].upsdDemdEpwrVal, lastChgDate, dBlastChgDate);
						ckremRackCntErr 			= isExcelToDBCheck(dataObj[i].remRackCnt, 		dbData[j].remRackCnt, lastChgDate, 		dBlastChgDate);
						ckremEpwrValErr 			= isExcelToDBCheck(dataObj[i].remEpwrVal, 		dbData[j].remEpwrVal, lastChgDate, 		dBlastChgDate);
						ckshtgItmCdErr				= isExcelToDBCheck(dataObj[i].shtgItmCdCol, 	dbData[j].shtgItmCd, lastChgDate, 		dBlastChgDate);
						ckscrePsblEpwrValErr 		= isExcelToDBCheck(dataObj[i].screPsblEpwrVal, 	dbData[j].screPsblEpwrVal, lastChgDate, dBlastChgDate);
						ckepwrRfctInvtCostErr 		= isExcelToDBCheck(dataObj[i].epwrRfctInvtCost, dbData[j].epwrRfctInvtCost, lastChgDate,dBlastChgDate);
						ckrmkErr					= isExcelToDBCheck(dataObj[i].rmk, 				dbData[j].g5EndRmk, lastChgDate, 			dBlastChgDate);

						ckendEtcColVal1Err			= isExcelToDBCheck(dataObj[i].endEtcColVal1, 				dbData[j].endEtcColVal1, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal2Err			= isExcelToDBCheck(dataObj[i].endEtcColVal2, 				dbData[j].endEtcColVal2, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal3Err			= isExcelToDBCheck(dataObj[i].endEtcColVal3, 				dbData[j].endEtcColVal3, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal4Err			= isExcelToDBCheck(dataObj[i].endEtcColVal4, 				dbData[j].endEtcColVal4, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal5Err			= isExcelToDBCheck(dataObj[i].endEtcColVal5, 				dbData[j].endEtcColVal5, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal6Err			= isExcelToDBCheck(dataObj[i].endEtcColVal6, 				dbData[j].endEtcColVal6, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal7Err			= isExcelToDBCheck(dataObj[i].endEtcColVal7, 				dbData[j].endEtcColVal7, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal8Err			= isExcelToDBCheck(dataObj[i].endEtcColVal8, 				dbData[j].endEtcColVal8, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal9Err			= isExcelToDBCheck(dataObj[i].endEtcColVal9, 				dbData[j].endEtcColVal9, lastChgDate, 			dBlastChgDate);
						ckendEtcColVal10Err			= isExcelToDBCheck(dataObj[i].endEtcColVal10, 				dbData[j].endEtcColVal10, lastChgDate, 			dBlastChgDate);
						//dbData.splice(j,1);
						break;
					}
				}
				var tmpColErrData = {
						ctrtEpwrValErr 			: ckctrtEpwrValErr,
						loadEpwrValErr 			: ckloadEpwrValErr,
						g2RemvRackCntErr	 	: ckg2RemvRackCntErr,
						g2ScreEpwrValErr 		: ckg2ScreEpwrValErr,
						lgcyEpwrValErr 			: cklgcyEpwrValErr,
						lgcyRackCntErr 			: cklgcyRackCntErr,
						lgcyDemdEpwrValErr 		: cklgcyDemdEpwrValErr,
						g5DulCntErr 			: ckg5DulCntErr,
						g5DuhCntErr 			: ckg5DuhCntErr,
						g5DuhRackCntErr 		: ckg5DuhRackCntErr,
						g5DuhEpwrValErr 		: ckg5DuhEpwrValErr,
						trmsRotnCntErr 			: cktrmsRotnCntErr,
						trmsIvrCntErr 			: cktrmsIvrCntErr,
						trmsIvrrCntErr 			: cktrmsIvrrCntErr,
						trms5gponCntErr 		: cktrms5gponCntErr,
						trmsSmuxCntErr 			: cktrmsSmuxCntErr,
						trmsFdfCntErr 			: cktrmsFdfCntErr,
						trmsRotnEpwrValErr 		: cktrmsRotnEpwrValErr,
						trmsIvrEpwrValErr 		: cktrmsIvrEpwrValErr,
						trmsIvrrEpwrValErr 		: cktrmsIvrrEpwrValErr,
						trms5gponEpwrValErr 	: cktrms5gponEpwrValErr,
						sbeqpRtfRackCntErr 		: cksbeqpRtfRackCntErr,
						sbeqpIpdCntErr 			: cksbeqpIpdCntErr,
						sbeqpArcnCntErr 		: cksbeqpArcnCntErr,
						sbeqpBatryLipoCntErr 	: cksbeqpBatryLipoCntErr,
						sbeqpBatryCntErr 		: cksbeqpBatryCntErr,
						upsdDemdRackCntErr 		: ckupsdDemdRackCntErr,
						upsdDemdEpwrValErr 		: ckupsdDemdEpwrValErr,
						remRackCntErr 			: ckremRackCntErr,
						remEpwrValErr 			: ckremEpwrValErr,
						shtgItmCdErr			: ckshtgItmCdErr,
						screPsblEpwrValErr 		: ckscrePsblEpwrValErr,
						epwrRfctInvtCostErr 	: ckepwrRfctInvtCostErr,
						rmkErr					: ckrmkErr,

						endEtcColVal1Err		: ckendEtcColVal1Err,
						endEtcColVal2Err	    : ckendEtcColVal2Err,
						endEtcColVal3Err	    : ckendEtcColVal3Err,
						endEtcColVal4Err	    : ckendEtcColVal4Err,
						endEtcColVal5Err	    : ckendEtcColVal5Err,
						endEtcColVal6Err	    : ckendEtcColVal6Err,
						endEtcColVal7Err	    : ckendEtcColVal7Err,
						endEtcColVal8Err	    : ckendEtcColVal8Err,
						endEtcColVal9Err	    : ckendEtcColVal9Err,
						endEtcColVal10Err	    : ckendEtcColVal10Err

				}

				$('#'+excelGrid).alopexGrid('dataEdit', tmpColErrData, {mtsoInvtId : dataObj[i].mtsoInvtId});

			}

    		$('#'+excelGrid).alopexGrid("viewUpdate");
    	}

		if(flag == 'shtgItmList'){
			grShtgItmCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grShtgItmCd.push(resObj);
			}
    	}

		if(flag == 'downLoadDate'){
			$('#downLoadDate').clear();
			var option_data = [];
			if (response.downLoadList.length > 0) {
				for(var i=0; i < response.downLoadList.length; i++){
					var resObj = {cd : response.downLoadList[i].lastChgDate, cdNm : response.downLoadList[i].lastChgDate};
					option_data.push(resObj);
				}
			} else {
				var tmpDate = new Date().format("yyyy-MM-dd") + " 00:00:00.0";
				var resObj = {cd : tmpDate, cdNm : tmpDate};
				option_data.push(resObj);
			}
			$('#downLoadDate').setData({ data : option_data});

		}

		if(flag == 'saveG5EndDsn'){
    		$a.close();
    	}


		if(flag == 'endHideCol'){
			for(var i = 0; i < response.menuHidYn.length; i++){
				if (response.menuHidYn[i].mtsoInvtItmHidYn == 'N') {
					$('#'+excelGrid).alopexGrid('updateColumn', {title : response.menuHidYn[i].mtsoInvtItmNm}, response.menuHidYn[i].mtsoInvtItmVal);
				} else {
					$('#'+excelGrid).alopexGrid('updateColumn', {hidden : true}, response.menuHidYn[i].mtsoInvtItmVal);
				}
			}
    	}
	}

	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){

		}
	}

	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}
});

