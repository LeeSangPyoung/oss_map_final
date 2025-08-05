/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var invtIntgPop = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var excelGrid 	= 'imptEqpInfDataGrid';
	var invtParam 	= "";
	var gAfeYr 		= '';
	var gAfeDgr 	= '';

	var grBizDivCd			= [];
	var grVndCd				= [];
	var grUpsdCd			= [];
	this.init = function(id, param) {
		gAfeYr		= param.afeYr;
		gAfeDgr		= param.afeDgr;

		initGrid();
		setSelectCode();
		setEventListener();
	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/XBIZTYP', null, 'GET', 'BizDivCd');	// 사업구분
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/XDUHVAL', null, 'GET', 'VndCd');		// 벤더
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/XUPSDTYP', null, 'GET', 'UpsdCd');		// 벤더

		var userId 		= $('#userId').val();
//		var paramData 	= {downFlag : 'EQPINF', userId : userId};
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getDownLoadDate', paramData, 'GET', 'downLoadDate');


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
		var headerMappingN = [
	   		 {fromIndex:0, toIndex:2, title:"업로드 ID, AFE/차수"} // 최상단 그룹
	   		,{fromIndex:3, toIndex:6, title:"기본정보"} // 최상단 그룹
	   		,{fromIndex:7, toIndex:9, title:"투자구분"} // 최상단 그룹 , headerStyleclass : 'headerBackGroundBlueS'
   			,{fromIndex:10, toIndex:13, title:"무선망 장비 현황"}
   			,{fromIndex:14, toIndex:17, title:"무선망 장비 신규(System)"}
   			,{fromIndex:18, toIndex:22, title:"무선망 장비 신규(수동)"} //, headerStyleclass : 'headerBackGroundBlueS'
   			,{fromIndex:23, toIndex:24, title:"무선망 순증 전력"}
   			,{fromIndex:25, toIndex:33, title:"유선망 장비 현황"}
   			,{fromIndex:34, toIndex:42, title:"유선망 장비 신규(System)"}
   			,{fromIndex:43, toIndex:51, title:"유선망 장비 신규(수동)"} //, headerStyleclass : 'headerBackGroundBlueS'
   			,{fromIndex:52, toIndex:61, title:"유선망 신규 전력"} //, headerStyleclass : 'headerBackGroundBlueS'
   			,{fromIndex:62, toIndex:62, title:"총 신규 전력"}
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
			columnFixUpto : 'afeDgr',
			headerGroup : headerMappingN,
			columnMapping: [
				{ key : 'fctInvtId', align:'center', title : '국사투자ID', width: '100px'  },		// 숨김
				{ key : 'afeYr', align:'center', title : 'AFE년도', width: '80px' },				// 숨김
				{ key : 'afeDgr', align:'center', title : 'AFE차수', width: '80px' },			// 숨김
				{ key : 'demdHdofcCd', align:'center', title : '본부', width: '90'},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '90'},
				{ key : 'mtsoNm', align:'center', title : '국사명', width: '180px'},
				{ key : 'bldFlorNo', align:'center', title : '층', width: '60px'},
				{ key : 'upsdCd', align:'center', title : '상면구분코드', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.upsdCdErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'invtBizCd', align:'center', title : '사업구분', width: '130px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.invtBizCdErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'vndCd', align:'center', title : '벤더', width: '80px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.vndCdErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wlesExstDuh10Cnt', align:'center', title : 'DUH10', width: '80px'},
				{ key : 'wlesExstDuh20Cnt', align:'center', title : 'DUH20', width: '80px'},
				{ key : 'wlesExstDuh30Cnt', align:'center', title : 'DUH30', width: '80px'},
				{ key : 'wlesExstLteDuCnt', align:'center', title : 'LTE DU', width: '80px'},
				{ key : 'wlesSystmDuh10NwCnt', align:'center', title : 'DUH10 수', width: '80px'},
				{ key : 'wlesSystmDuh20NwCnt', align:'center', title : 'DUH20 수', width: '80px'},
				{ key : 'wlesSystmDuh30NwCnt', align:'center', title : 'DUH30 수', width: '80px'},
				{ key : 'wlesSystmLteDuCnt', align:'center', title : 'LTE DU 수', width: '80px'},

				{ key : 'wlesPveDuh10NwCnt', align:'center', title : 'DUH10 수', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wlesPveDuh10NwCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wlesPveDuh20NwCnt', align:'center', title : 'DUH20 수', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wlesPveDuh20NwCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wlesPveDuh30NwCnt', align:'center', title : 'DUH30 수', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wlesPveDuh30NwCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wlesPveLteDuCnt', align:'center', title : 'LTE DU 수', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wlesPveLteDuCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wlesPveSkbEpwrVal', align:'center', title : '기타-SKB(소비전력)', width: '135px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wlesPveSkbEpwrValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},

				{ key : 'wlesPuiEpwrRackCnt', align:'center', title : 'Rack 수', width: '80px'},
				{ key : 'wlesPuiCnsmEpwrVal', align:'center', title : '소비전력(W)', width: '100px'},
				{ key : 'wreExstCrRtCnt', align:'center', title : 'CORE RT', width: '100px'},
				{ key : 'wreExstBkhlIvcCnt', align:'center', title : '백홀 IVC', width: '100px'},
				{ key : 'wreExstBkhlIvrCnt', align:'center', title : '백홀 IVR', width: '100px'},
				{ key : 'wreExstBkhlIvrrCnt', align:'center', title : '백홀 IVRR', width: '100px'},
				{ key : 'wreExstRotnCotCnt', align:'center', title : 'ROTN COT', width: '100px'},
				{ key : 'wreExstRotnRtCnt', align:'center', title : 'ROTN RT', width: '100px'},
				{ key : 'wreExstRotnRrtCnt', align:'center', title : 'ROTN RRT', width: '100px'},
				{ key : 'wreExst5gponCotCnt', align:'center', title : '5GPON COT', width: '100px'},
				{ key : 'wreExstSumr', align:'center', title : '소계', width: '100px'},
				{ key : 'wreSystmCrRtCnt', align:'center', title : 'CORE RT', width: '100px'},
				{ key : 'wreSystmBkhlIvcCnt', align:'center', title : '백홀 IVC', width: '100px'},
				{ key : 'wreSystmBkhlIvrCnt', align:'center', title : '백홀 IVR', width: '100px'},
				{ key : 'wreSystmBkhlIvrrCnt', align:'center', title : '백홀 IVRR', width: '100px'},
				{ key : 'wreSystmRotnCotCnt', align:'center', title : 'ROTN COT', width: '100px'},
				{ key : 'wreSystmRotnRtCnt', align:'center', title : 'ROTN RT', width: '100px'},
				{ key : 'wreSystmRotnRrtCnt', align:'center', title : 'ROTN RRT', width: '100px'},
				{ key : 'wreSystm5gponCotCnt', align:'center', title : '5GPON COT', width: '100px'},
				{ key : 'wreSystmSumr', align:'center', title : '소계', width: '100px'},

				{ key : 'wrePveCrRtCnt', align:'center', title : 'CORE RT', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePveCrRtCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wrePveBkhlIvcCnt', align:'center', title : '백홀 IVC', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePveBkhlIvcCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wrePveBkhlIvrCnt', align:'center', title : '백홀 IVR', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePveBkhlIvrCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wrePveBkhlIvrrCnt', align:'center', title : '백홀 IVRR', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePveBkhlIvrrCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wrePveRotnCotCnt', align:'center', title : 'ROTN COT', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePveRotnCotCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wrePveRotnRtCnt', align:'center', title : 'ROTN RT', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePveRotnRtCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wrePveRotnRrtCnt', align:'center', title : 'ROTN RRT', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePveRotnRrtCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'wrePve5gponCotCnt', align:'center', title : '5GPON COT', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wrePve5gponCotCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},


				{ key : 'wrePveSumr', align:'center', title : '소계', width: '100px'},
				{ key : 'wreNwCrRtEpwrVal', align:'center', title : 'CORE RT', width: '100px'},
				{ key : 'wreNwBkhlIvcEpwrVal', align:'center', title : '백홀 IVC', width: '100px'},
				{ key : 'wreNwBkhlIvrEpwrVal', align:'center', title : '백홀 IVR', width: '100px'},
				{ key : 'wreNwBkhlIvrrEpwrVal', align:'center', title : '백홀 IVRR', width: '100px'},
				{ key : 'wreNwRotnCotEpwrVal', align:'center', title : 'ROTN COT', width: '100px'},
				{ key : 'wreNwRotnRtEpwrVal', align:'center', title : 'ROTN RT', width: '100px'},
				{ key : 'wreNwRotnRrtEpwrVal', align:'center', title : 'ROTN RRT', width: '100px'},
				{ key : 'wreNw5gponCotEpwrVal', align:'center', title : '5GPON COT', width: '100px'},


				{ key : 'wreNwEtcEpwrVal', align:'center', title : '기타', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.wreNwEtcEpwrValErr); }}},


				{ key : 'wreNwTotEpwrVal', align:'center', title : '소계', width: '100px', exportDataType: 'number'},
				{ key : 'nwTotEpwrVal', align:'center', title : '무선+유선[w]', width: '120px', exportDataType: 'number'},




    			/***********************************************
	   			 * Row Check
	   			***********************************************/
				{ key : 'wlesPveDuh10NwCntErr', align:'center', title : 'DUH10 수', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'wlesPveDuh20NwCntErr', align:'center', title : 'DUH20 수', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'wlesPveDuh30NwCntErr', align:'center', title : 'DUH30 수', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'wlesPveLteDuCntErr', align:'center', title : 'LTE DU 수', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'wlesPveSkbEpwrValErr', align:'center', title : '기타-SKB(소비전력)', width: '135px', exportDataType: 'number', hidden : true},
				{ key : 'wrePveCrRtCntErr', align:'center', title : 'CORE RT', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wrePveBkhlIvcCntErr', align:'center', title : '백홀 IVC', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wrePveBkhlIvrCntErr', align:'center', title : '백홀 IVR', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wrePveBkhlIvrrCntErr', align:'center', title : '백홀 IVRR', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wrePveRotnCotCntErr', align:'center', title : 'ROTN COT', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wrePveRotnRtCntErr', align:'center', title : 'ROTN RT', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wrePveRotnRrtCntErr', align:'center', title : 'ROTN RRT', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wrePve5gponCotCntErr', align:'center', title : '5GPON COT', width: '100px', exportDataType: 'number', hidden : true},
				{ key : 'wreNwEtcEpwrValErr', align:'center', title : '기타', width: '100px', exportDataType: 'number', hidden : true},


				{ key : 'upsdCdErr', align:'center', title : '상면', width: '150', hidden : true},
				{ key : 'upsdCdCol', align:'center', title : '상면', width: '150', hidden : true},
				{ key : 'invtBizCdErr', align:'center', title : '사업구분', width: '150', hidden : true},
				{ key : 'invtBizCdCol', align:'center', title : '사업구분', width: '150', hidden : true},
				{ key : 'vndCdErr', align:'center', title : '벤더', width: '150', hidden : true},
				{ key : 'vndCdCol', align:'center', title : '벤더', width: '150', hidden : true},


				{ key : 'rowDelYn', align:'center', title : 'Row삭제유무', width: '150', hidden : true},
	   			{ key : 'uploadYn', align:'center', title : '판정결과', hidden : true}
	   		],
	   		message: {
	   		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
       });
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
					dataList[i].uploadYn = 'Y';
					//uploadYn.uploadYn = 'Y';
					dataList[i].afeYr	= gAfeYr;
					dataList[i].afeDgr	= gAfeDgr;
					if(typeof dataList[i].fctInvtId == 'undefined' || dataList[i].fctInvtId == undefined || dataList[i].fctInvtId == ''){
						dataList[i].rowDelYn = 'Y';
						dataList[i].uploadYn = 'N';
						continue;
					} else if(typeof dataList[i].afeYr == 'undefined' || dataList[i].afeYr == undefined || dataList[i].afeYr == ''){
						dataList[i].rowDelYn = 'Y';
						dataList[i].uploadYn = 'N';
						continue;
					}  if(typeof dataList[i].afeDgr == 'undefined' || dataList[i].afeDgr == undefined || dataList[i].afeDgr == ''){
						dataList[i].rowDelYn = 'Y';
						dataList[i].uploadYn = 'N';
						continue;
					} else {
						if(dataList[i].fctInvtId.indexOf('FI') == -1) {
							dataList[i].rowDelYn = 'Y';
							dataList[i].uploadYn = 'N';
							continue;
						}
					}
					/***********************
					 * isNaN 난수 항목 체크
					***********************/
					dataList[i].wlesPveDuh10NwCntErr 			= isNaNCheck(dataList[i].wlesPveDuh10NwCnt);
					dataList[i].wlesPveDuh20NwCntErr 			= isNaNCheck(dataList[i].wlesPveDuh20NwCnt);
					dataList[i].wlesPveDuh30NwCntErr 			= isNaNCheck(dataList[i].wlesPveDuh30NwCnt);
					dataList[i].wlesPveLteDuCntErr 				= isNaNCheck(dataList[i].wlesPveLteDuCnt);
					dataList[i].wlesPveSkbEpwrValErr 			= isNaNCheck(dataList[i].wlesPveSkbEpwrVal);
					dataList[i].wrePveCrRtCntErr 				= isNaNCheck(dataList[i].wrePveCrRtCnt);
					dataList[i].wrePveBkhlIvcCntErr 			= isNaNCheck(dataList[i].wrePveBkhlIvcCnt);
					dataList[i].wrePveBkhlIvrCntErr 			= isNaNCheck(dataList[i].wrePveBkhlIvrCnt);
					dataList[i].wrePveBkhlIvrrCntErr 			= isNaNCheck(dataList[i].wrePveBkhlIvrrCnt);
					dataList[i].wrePveRotnCotCntErr 			= isNaNCheck(dataList[i].wrePveRotnCotCnt);
					dataList[i].wrePveRotnRtCntErr 				= isNaNCheck(dataList[i].wrePveRotnRtCnt);
					dataList[i].wrePveRotnRrtCntErr 			= isNaNCheck(dataList[i].wrePveRotnRrtCnt);
					dataList[i].wrePve5gponCotCntErr 			= isNaNCheck(dataList[i].wrePve5gponCotCnt);
					dataList[i].wreNwEtcEpwrValErr 				= isNaNCheck(dataList[i].wreNwEtcEpwrVal);



					/***********************
					 * 코드값으로 정의
					***********************/
					dataList[i].upsdCdErr = "0";
					if(typeof dataList[i].upsdCd != 'undefined' && dataList[i].upsdCd != undefined && dataList[i].upsdCd != ''){
						for (var j = 0; j < grUpsdCd.length; j++) {
							dataList[i].upsdCdErr = "1";
							if (dataList[i].upsdCd.toString().trim().replace(/ /gi, '') == grUpsdCd[j].text.trim().replace(/ /gi, '')) {
								dataList[i].upsdCdCol = grUpsdCd[j].value;
								dataList[i].upsdCdErr = "0";
								break;
							}
						}
					}
					dataList[i].invtBizCdErr = "0";
					if(typeof dataList[i].invtBizCd != 'undefined' && dataList[i].invtBizCd != undefined && dataList[i].invtBizCd != ''){
						for (var j = 0; j < grBizDivCd.length; j++) {
							dataList[i].bizDivCdErr = "1";
							if (dataList[i].invtBizCd.toString().trim().replace(/ /gi, '') == grBizDivCd[j].text.trim().replace(/ /gi, '')) {
								dataList[i].invtBizCdCol = grBizDivCd[j].value;
								dataList[i].invtBizCdErr = "0";
								break;
							}
						}
					}
					dataList[i].vndCdErr = "0";
					if(typeof dataList[i].vndCd != 'undefined' && dataList[i].vndCd != undefined && dataList[i].vndCd != ''){
						for (var j = 0; j < grVndCd.length; j++) {
							dataList[i].vndCdErr = "1";
							if (dataList[i].vndCd.toString().trim().replace(/ /gi, '') == grVndCd[j].text.trim().replace(/ /gi, '')) {
								dataList[i].vndCdCol = grVndCd[j].value;
								dataList[i].vndCdErr = "0";
								break;
							}
						}
					}
				}
				$grid.alopexGrid('dataAdd', dataList);
			});
			$('#'+excelGrid).alopexGrid("viewUpdate");
			$('#'+excelGrid).alopexGrid('hideProgress');
			//$input.val('');

//			var param = [];
//	    	var page = 1;
//	    	var rowPerPage = 1000000;
//	    	param.pageNo = page;
//	    	param.rowPerPage = rowPerPage;
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5EndDsnList', param, 'GET', 'search');
		});

		$('#btnUpload').on('click', function(e) {

			var ckGubun = $("input:checkbox[name=gubun1][value='Y']").is(":checked") ? true : false;
			var ckGubun = true;
			var userId 	= $("#userId").val();
			if (userId == "" || userId == undefined || userId == null) {
				userId = 'TANGO-EC';
			}
			var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
			var excelSaveDtlList = [];
			var comText = 'Excel 파일을 저장하시겠습니까?(오류가 있는 항목은 저장되지 않습니다.)';
			if (ckGubun) {
				for(var i in dataObj) {
					if (dataObj[i].uploadYn != 'N' &&
						dataObj[i].wlesPveDuh10NwCntErr		== '0' &&
						dataObj[i].wlesPveDuh20NwCntErr     == '0' &&
						dataObj[i].wlesPveDuh30NwCntErr     == '0' &&
						dataObj[i].wlesPveLteDuCntErr 	    == '0' &&
						dataObj[i].wlesPveSkbEpwrValErr     == '0' &&
						dataObj[i].wrePveCrRtCntErr 	    == '0' &&
						dataObj[i].wrePveBkhlIvcCntErr      == '0' &&
						dataObj[i].wrePveBkhlIvrCntErr      == '0' &&
						dataObj[i].wrePveBkhlIvrrCntErr     == '0' &&
						dataObj[i].wrePveRotnCotCntErr      == '0' &&
						dataObj[i].wrePveRotnRtCntErr 	    == '0' &&
						dataObj[i].wrePveRotnRrtCntErr      == '0' &&
						dataObj[i].wrePve5gponCotCntErr     == '0' &&
						dataObj[i].wreNwEtcEpwrValErr 	    == '0' &&
						dataObj[i].upsdCdErr     			== '0' &&
						dataObj[i].invtBizCdErr     		== '0' &&
						dataObj[i].vndCdErr 	    		== '0') {
						var tmpList = {
								fctInvtId 				: isUndefinedCheck(dataObj[i].fctInvtId),
								afeYr 		    		: isUndefinedCheck(dataObj[i].afeYr),
								afeDgr 		    		: isUndefinedCheck(dataObj[i].afeDgr),

								wlesPveDuh10NwCnt       : isUndefinedCheck(dataObj[i].wlesPveDuh10NwCnt),
								wlesPveDuh20NwCnt       : isUndefinedCheck(dataObj[i].wlesPveDuh20NwCnt),
								wlesPveDuh30NwCnt       : isUndefinedCheck(dataObj[i].wlesPveDuh30NwCnt),
								wlesPveLteDuCnt         : isUndefinedCheck(dataObj[i].wlesPveLteDuCnt),
								wlesPveSkbEpwrVal       : isUndefinedCheck(dataObj[i].wlesPveSkbEpwrVal),
								wrePveCrRtCnt           : isUndefinedCheck(dataObj[i].wrePveCrRtCnt),
								wrePveBkhlIvcCnt        : isUndefinedCheck(dataObj[i].wrePveBkhlIvcCnt),
								wrePveBkhlIvrCnt        : isUndefinedCheck(dataObj[i].wrePveBkhlIvrCnt),
								wrePveBkhlIvrrCnt       : isUndefinedCheck(dataObj[i].wrePveBkhlIvrrCnt),
								wrePveRotnCotCnt        : isUndefinedCheck(dataObj[i].wrePveRotnCotCnt),
								wrePveRotnRtCnt         : isUndefinedCheck(dataObj[i].wrePveRotnRtCnt),
								wrePveRotnRrtCnt        : isUndefinedCheck(dataObj[i].wrePveRotnRrtCnt),
								wrePve5gponCotCnt       : isUndefinedCheck(dataObj[i].wrePve5gponCotCnt),
								wreNwEtcEpwrVal         : isUndefinedCheck(dataObj[i].wreNwEtcEpwrVal),

								upsdCd					: isUndefinedCheck(dataObj[i].upsdCdCol),
								invtBizCd				: isUndefinedCheck(dataObj[i].invtBizCdCol),
								vndCd 					: isUndefinedCheck(dataObj[i].vndCdCol),


								userId					: userId
						};
						//console.log(tmpList);
						excelSaveDtlList.push(tmpList);
					}
				}
			}
			if (excelSaveDtlList == null || excelSaveDtlList == undefined || excelSaveDtlList == "") {
				callMsgBox('','W', '저장 가능한 항목이 없습니다.목록을 확인하시기 바랍니다.' , function(msgId, msgRst){});
			} else {
				callMsgBox('','C', comText, function(msgId, msgRst){
	 		        if (msgRst == 'Y') {
	 		        	$('#'+excelGrid).alopexGrid('showProgress');
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtImptEqpInfExcelUpload', excelSaveDtlList, 'POST', 'saveEqpInfo');
	 		        }
			     });
			}
		});


//		$('#downLoadDate').on('change', function(e) {
//			$('#'+excelGrid).alopexGrid('showProgress');
//			var param = [];
//	    	var page = 1;
//	    	var rowPerPage = 1000000;
//	    	param.pageNo = page;
//	    	param.rowPerPage = rowPerPage;
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5EndDsnList', param, 'GET', 'search');
//		});

		// 닫기
		$('#btnCancel').on('click', function(e) {
			$a.close();
		});
	};

	function successCallback(response, status, jqxhr, flag) {
		if(flag == 'search'){
//    		$('#'+excelGrid).alopexGrid('hideProgress');
//
//    		var lastChgDate = $("#downLoadDate").val();
//    		var dbData = response.g5EndDsnList;
//    		//var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{rowDelYn : 'N'});
//    		var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
//			for(var i in dataObj) {
//				if (typeof dataObj[i].mtsoInvtId != 'undefined' && dataObj[i].mtsoInvtId != undefined) {
//					if (dataObj[i].mtsoInvtId.indexOf('MI') == -1) {
//						$('#'+excelGrid).alopexGrid("dataDelete", {mtsoInvtId:dataObj[i].mtsoInvtId});
//						continue;
//					}
//				} else {
//					dataObj[i].mtsoInvtId = '';
//					continue;
//				}
//
//				if (dataObj[i].ctrtEpwrValErr 			== '1' ||
//					dataObj[i].loadEpwrValErr 			== '1' ||
//					dataObj[i].g2RemvRackCntErr	 		== '1' ||
//					dataObj[i].g2ScreEpwrValErr 		== '1' ||
//					dataObj[i].lgcyEpwrValErr 			== '1' ||
//					dataObj[i].lgcyRackCntErr 			== '1' ||
//					dataObj[i].lgcyDemdEpwrValErr 		== '1' ||
//					dataObj[i].g5DulCntErr 				== '1' ||
//					dataObj[i].g5DuhCntErr 				== '1' ||
//					dataObj[i].g5DuhRackCntErr 			== '1' ||
//					dataObj[i].g5DuhEpwrValErr 			== '1' ||
//					dataObj[i].trmsRotnCntErr 			== '1' ||
//					dataObj[i].trmsIvrCntErr 			== '1' ||
//					dataObj[i].trmsIvrrCntErr 			== '1' ||
//					dataObj[i].trms5gponCntErr 			== '1' ||
//					dataObj[i].trmsSmuxCntErr 			== '1' ||
//					dataObj[i].trmsFdfCntErr 			== '1' ||
//					dataObj[i].trmsRotnEpwrValErr 		== '1' ||
//					dataObj[i].trmsIvrEpwrValErr 		== '1' ||
//					dataObj[i].trmsIvrrEpwrValErr 		== '1' ||
//					dataObj[i].trms5gponEpwrValErr 		== '1' ||
//					dataObj[i].sbeqpRtfRackCntErr 		== '1' ||
//					dataObj[i].sbeqpIpdCntErr 			== '1' ||
//					dataObj[i].sbeqpArcnCntErr 			== '1' ||
//					dataObj[i].sbeqpBatryLipoCntErr 	== '1' ||
//					dataObj[i].sbeqpBatryCntErr 		== '1' ||
//					dataObj[i].upsdDemdRackCntErr 		== '1' ||
//					dataObj[i].upsdDemdEpwrValErr 		== '1' ||
//					dataObj[i].remRackCntErr 			== '1' ||
//					dataObj[i].remEpwrValErr 			== '1' ||
//					dataObj[i].shtgItmCdErr 			== '1' ||
//					dataObj[i].screPsblEpwrValErr 		== '1' ||
//					dataObj[i].epwrRfctInvtCostErr 		== '1') {
//					$('#'+excelGrid).alopexGrid('dataEdit',{uploadYn:'N'},{mtsoInvtId:dataObj[i].mtsoInvtId});
//					continue;
//				}
//
//				var ckctrtEpwrValErr 			= '0';
//				var ckloadEpwrValErr 			= '0';
//				var ckg2RemvRackCntErr	 		= '0';
//				var ckg2ScreEpwrValErr 			= '0';
//				var cklgcyEpwrValErr 			= '0';
//				var cklgcyRackCntErr 			= '0';
//				var cklgcyDemdEpwrValErr 		= '0';
//				var ckg5DulCntErr 				= '0';
//				var ckg5DuhCntErr 				= '0';
//				var ckg5DuhRackCntErr 			= '0';
//				var ckg5DuhEpwrValErr 			= '0';
//				var cktrmsRotnCntErr 			= '0';
//				var cktrmsIvrCntErr 			= '0';
//				var cktrmsIvrrCntErr 			= '0';
//				var cktrms5gponCntErr 			= '0';
//				var cktrmsSmuxCntErr 			= '0';
//				var cktrmsFdfCntErr 			= '0';
//				var cktrmsRotnEpwrValErr 		= '0';
//				var cktrmsIvrEpwrValErr 		= '0';
//				var cktrmsIvrrEpwrValErr 		= '0';
//				var cktrms5gponEpwrValErr 		= '0';
//				var cksbeqpRtfRackCntErr 		= '0';
//				var cksbeqpIpdCntErr 			= '0';
//				var cksbeqpArcnCntErr 			= '0';
//				var cksbeqpBatryLipoCntErr 		= '0';
//				var cksbeqpBatryCntErr 			= '0';
//				var ckupsdDemdRackCntErr 		= '0';
//				var ckupsdDemdEpwrValErr 		= '0';
//				var ckremRackCntErr 			= '0';
//				var ckremEpwrValErr 			= '0';
//				var ckshtgItmCdErr				= '0';
//				var ckscrePsblEpwrValErr 		= '0';
//				var ckepwrRfctInvtCostErr 		= '0';
//				var ckrmkErr					= '0';
//
//
//				var ckendEtcColVal1Err					= '0';
//				var ckendEtcColVal2Err					= '0';
//				var ckendEtcColVal3Err					= '0';
//				var ckendEtcColVal4Err					= '0';
//				var ckendEtcColVal5Err					= '0';
//				var ckendEtcColVal6Err					= '0';
//				var ckendEtcColVal7Err					= '0';
//				var ckendEtcColVal8Err					= '0';
//				var ckendEtcColVal9Err					= '0';
//				var ckendEtcColVal10Err					= '0';
//
//
//				for(var j in dbData) {
//					var dBlastChgDate = dbData[j].lastChgDate;
//					if (dataObj[i].mtsoInvtId == dbData[j].mtsoInvtId && dataObj[i].uploadYn != 'N') {
//						ckctrtEpwrValErr 			= isExcelToDBCheck(dataObj[i].ctrtEpwrVal, 		dbData[j].ctrtEpwrVal, lastChgDate, 	dBlastChgDate);
//						ckloadEpwrValErr 			= isExcelToDBCheck(dataObj[i].loadEpwrVal, 		dbData[j].loadEpwrVal, lastChgDate, 	dBlastChgDate);
//						ckg2RemvRackCntErr	 		= isExcelToDBCheck(dataObj[i].g2RemvRackCnt, 	dbData[j].g2RemvRackCnt, lastChgDate, 	dBlastChgDate);
//						ckg2ScreEpwrValErr 			= isExcelToDBCheck(dataObj[i].g2ScreEpwrVal, 	dbData[j].g2ScreEpwrVal, lastChgDate, 	dBlastChgDate);
//						cklgcyEpwrValErr 			= isExcelToDBCheck(dataObj[i].lgcyEpwrVal, 		dbData[j].lgcyEpwrVal, lastChgDate, 	dBlastChgDate);
//						cklgcyRackCntErr 			= isExcelToDBCheck(dataObj[i].lgcyRackCnt, 		dbData[j].lgcyRackCnt, lastChgDate, 	dBlastChgDate);
//						cklgcyDemdEpwrValErr 		= isExcelToDBCheck(dataObj[i].lgcyDemdEpwrVal, 	dbData[j].lgcyDemdEpwrVal, lastChgDate, dBlastChgDate);
//						ckg5DulCntErr 				= isExcelToDBCheck(dataObj[i].g5DulCnt, 		dbData[j].g5DulCnt, lastChgDate, 		dBlastChgDate);
//						ckg5DuhCntErr 				= isExcelToDBCheck(dataObj[i].g5DuhCnt, 		dbData[j].g5DuhCnt, lastChgDate, 		dBlastChgDate);
//						ckg5DuhRackCntErr 			= isExcelToDBCheck(dataObj[i].g5DuhRackCnt, 	dbData[j].g5DuhRackCnt, lastChgDate, 	dBlastChgDate);
//						ckg5DuhEpwrValErr 			= isExcelToDBCheck(dataObj[i].g5DuhEpwrVal, 	dbData[j].g5DuhEpwrVal, lastChgDate, 	dBlastChgDate);
//						cktrmsRotnCntErr 			= isExcelToDBCheck(dataObj[i].trmsRotnCnt, 		dbData[j].trmsRotnCnt, lastChgDate, 	dBlastChgDate);
//						cktrmsIvrCntErr 			= isExcelToDBCheck(dataObj[i].trmsIvrCnt, 		dbData[j].trmsIvrCnt, lastChgDate, 		dBlastChgDate);
//						cktrmsIvrrCntErr 			= isExcelToDBCheck(dataObj[i].trmsIvrrCnt, 		dbData[j].trmsIvrrCnt, lastChgDate, 	dBlastChgDate);
//						cktrms5gponCntErr 			= isExcelToDBCheck(dataObj[i].trms5gponCnt, 	dbData[j].trms5gponCnt, lastChgDate, 	dBlastChgDate);
//						cktrmsSmuxCntErr 			= isExcelToDBCheck(dataObj[i].trmsSmuxCnt, 		dbData[j].trmsSmuxCnt, lastChgDate, 	dBlastChgDate);
//						cktrmsFdfCntErr 			= isExcelToDBCheck(dataObj[i].trmsFdfCnt, 		dbData[j].trmsFdfCnt, lastChgDate, 		dBlastChgDate);
//						cktrmsRotnEpwrValErr 		= isExcelToDBCheck(dataObj[i].trmsRotnEpwrVal, 	dbData[j].trmsRotnEpwrVal, lastChgDate, dBlastChgDate);
//						cktrmsIvrEpwrValErr 		= isExcelToDBCheck(dataObj[i].trmsIvrEpwrVal, 	dbData[j].trmsIvrEpwrVal, lastChgDate, 	dBlastChgDate);
//						cktrmsIvrrEpwrValErr 		= isExcelToDBCheck(dataObj[i].trmsIvrrEpwrVal, 	dbData[j].trmsIvrrEpwrVal, lastChgDate, dBlastChgDate);
//						cktrms5gponEpwrValErr 		= isExcelToDBCheck(dataObj[i].trms5gponEpwrVal, dbData[j].trms5gponEpwrVal, lastChgDate,dBlastChgDate);
//						cksbeqpRtfRackCntErr 		= isExcelToDBCheck(dataObj[i].sbeqpRtfRackCnt, 	dbData[j].sbeqpRtfRackCnt, lastChgDate, dBlastChgDate);
//						cksbeqpIpdCntErr 			= isExcelToDBCheck(dataObj[i].sbeqpIpdCnt, 		dbData[j].sbeqpIpdCnt, lastChgDate, 	dBlastChgDate);
//						cksbeqpArcnCntErr 			= isExcelToDBCheck(dataObj[i].sbeqpArcnCnt, 	dbData[j].sbeqpArcnCnt, lastChgDate, 	dBlastChgDate);
//						cksbeqpBatryLipoCntErr 		= isExcelToDBCheck(dataObj[i].sbeqpBatryLipoCnt,dbData[j].sbeqpBatryLipoCnt, lastChgDate, dBlastChgDate);
//						cksbeqpBatryCntErr 			= isExcelToDBCheck(dataObj[i].sbeqpBatryCnt, 	dbData[j].sbeqpBatryCnt, lastChgDate, 	dBlastChgDate);
//						ckupsdDemdRackCntErr 		= isExcelToDBCheck(dataObj[i].upsdDemdRackCnt, 	dbData[j].upsdDemdRackCnt, lastChgDate, dBlastChgDate);
//						ckupsdDemdEpwrValErr 		= isExcelToDBCheck(dataObj[i].upsdDemdEpwrVal, 	dbData[j].upsdDemdEpwrVal, lastChgDate, dBlastChgDate);
//						ckremRackCntErr 			= isExcelToDBCheck(dataObj[i].remRackCnt, 		dbData[j].remRackCnt, lastChgDate, 		dBlastChgDate);
//						ckremEpwrValErr 			= isExcelToDBCheck(dataObj[i].remEpwrVal, 		dbData[j].remEpwrVal, lastChgDate, 		dBlastChgDate);
//						ckshtgItmCdErr				= isExcelToDBCheck(dataObj[i].shtgItmCdCol, 	dbData[j].shtgItmCd, lastChgDate, 		dBlastChgDate);
//						ckscrePsblEpwrValErr 		= isExcelToDBCheck(dataObj[i].screPsblEpwrVal, 	dbData[j].screPsblEpwrVal, lastChgDate, dBlastChgDate);
//						ckepwrRfctInvtCostErr 		= isExcelToDBCheck(dataObj[i].epwrRfctInvtCost, dbData[j].epwrRfctInvtCost, lastChgDate,dBlastChgDate);
//						ckrmkErr					= isExcelToDBCheck(dataObj[i].rmk, 				dbData[j].g5EndRmk, lastChgDate, 			dBlastChgDate);
//
//						ckendEtcColVal1Err			= isExcelToDBCheck(dataObj[i].endEtcColVal1, 				dbData[j].endEtcColVal1, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal2Err			= isExcelToDBCheck(dataObj[i].endEtcColVal2, 				dbData[j].endEtcColVal2, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal3Err			= isExcelToDBCheck(dataObj[i].endEtcColVal3, 				dbData[j].endEtcColVal3, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal4Err			= isExcelToDBCheck(dataObj[i].endEtcColVal4, 				dbData[j].endEtcColVal4, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal5Err			= isExcelToDBCheck(dataObj[i].endEtcColVal5, 				dbData[j].endEtcColVal5, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal6Err			= isExcelToDBCheck(dataObj[i].endEtcColVal6, 				dbData[j].endEtcColVal6, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal7Err			= isExcelToDBCheck(dataObj[i].endEtcColVal7, 				dbData[j].endEtcColVal7, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal8Err			= isExcelToDBCheck(dataObj[i].endEtcColVal8, 				dbData[j].endEtcColVal8, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal9Err			= isExcelToDBCheck(dataObj[i].endEtcColVal9, 				dbData[j].endEtcColVal9, lastChgDate, 			dBlastChgDate);
//						ckendEtcColVal10Err			= isExcelToDBCheck(dataObj[i].endEtcColVal10, 				dbData[j].endEtcColVal10, lastChgDate, 			dBlastChgDate);
//						//dbData.splice(j,1);
//						break;
//					}
//				}
//				var tmpColErrData = {
//						ctrtEpwrValErr 			: ckctrtEpwrValErr,
//						loadEpwrValErr 			: ckloadEpwrValErr,
//						g2RemvRackCntErr	 	: ckg2RemvRackCntErr,
//						g2ScreEpwrValErr 		: ckg2ScreEpwrValErr,
//						lgcyEpwrValErr 			: cklgcyEpwrValErr,
//						lgcyRackCntErr 			: cklgcyRackCntErr,
//						lgcyDemdEpwrValErr 		: cklgcyDemdEpwrValErr,
//						g5DulCntErr 			: ckg5DulCntErr,
//						g5DuhCntErr 			: ckg5DuhCntErr,
//						g5DuhRackCntErr 		: ckg5DuhRackCntErr,
//						g5DuhEpwrValErr 		: ckg5DuhEpwrValErr,
//						trmsRotnCntErr 			: cktrmsRotnCntErr,
//						trmsIvrCntErr 			: cktrmsIvrCntErr,
//						trmsIvrrCntErr 			: cktrmsIvrrCntErr,
//						trms5gponCntErr 		: cktrms5gponCntErr,
//						trmsSmuxCntErr 			: cktrmsSmuxCntErr,
//						trmsFdfCntErr 			: cktrmsFdfCntErr,
//						trmsRotnEpwrValErr 		: cktrmsRotnEpwrValErr,
//						trmsIvrEpwrValErr 		: cktrmsIvrEpwrValErr,
//						trmsIvrrEpwrValErr 		: cktrmsIvrrEpwrValErr,
//						trms5gponEpwrValErr 	: cktrms5gponEpwrValErr,
//						sbeqpRtfRackCntErr 		: cksbeqpRtfRackCntErr,
//						sbeqpIpdCntErr 			: cksbeqpIpdCntErr,
//						sbeqpArcnCntErr 		: cksbeqpArcnCntErr,
//						sbeqpBatryLipoCntErr 	: cksbeqpBatryLipoCntErr,
//						sbeqpBatryCntErr 		: cksbeqpBatryCntErr,
//						upsdDemdRackCntErr 		: ckupsdDemdRackCntErr,
//						upsdDemdEpwrValErr 		: ckupsdDemdEpwrValErr,
//						remRackCntErr 			: ckremRackCntErr,
//						remEpwrValErr 			: ckremEpwrValErr,
//						shtgItmCdErr			: ckshtgItmCdErr,
//						screPsblEpwrValErr 		: ckscrePsblEpwrValErr,
//						epwrRfctInvtCostErr 	: ckepwrRfctInvtCostErr,
//						rmkErr					: ckrmkErr,
//
//						endEtcColVal1Err		: ckendEtcColVal1Err,
//						endEtcColVal2Err	    : ckendEtcColVal2Err,
//						endEtcColVal3Err	    : ckendEtcColVal3Err,
//						endEtcColVal4Err	    : ckendEtcColVal4Err,
//						endEtcColVal5Err	    : ckendEtcColVal5Err,
//						endEtcColVal6Err	    : ckendEtcColVal6Err,
//						endEtcColVal7Err	    : ckendEtcColVal7Err,
//						endEtcColVal8Err	    : ckendEtcColVal8Err,
//						endEtcColVal9Err	    : ckendEtcColVal9Err,
//						endEtcColVal10Err	    : ckendEtcColVal10Err
//
//				}
//
//				$('#'+excelGrid).alopexGrid('dataEdit', tmpColErrData, {mtsoInvtId : dataObj[i].mtsoInvtId});
//
//			}
//
//    		$('#'+excelGrid).alopexGrid("viewUpdate");
    	}

		if(flag == 'BizDivCd'){
    		grBizDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grBizDivCd.push(resObj);
			}
    	}

    	if(flag == 'VndCd'){
    		grVndCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grVndCd.push(resObj);
			}
    	}

    	if(flag == 'UpsdCd'){
    		grUpsdCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grUpsdCd.push(resObj);
			}
    	}



//		if(flag == 'downLoadDate'){
//			$('#downLoadDate').clear();
//			var option_data = [];
//			if (response.downLoadList.length > 0) {
//				for(var i=0; i < response.downLoadList.length; i++){
//					var resObj = {cd : response.downLoadList[i].lastChgDate, cdNm : response.downLoadList[i].lastChgDate};
//					option_data.push(resObj);
//				}
//			} else {
//				var tmpDate = new Date().format("yyyy-MM-dd") + " 00:00:00.0";
//				var resObj = {cd : tmpDate, cdNm : tmpDate};
//				option_data.push(resObj);
//			}
//			$('#downLoadDate').setData({ data : option_data});
//
//		}

		if(flag == 'saveEqpInfo'){
    		$a.close();
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

