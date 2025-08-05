/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var invtIntgPop = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var excelGrid = 'imptElctyInfDataGrid';
	var invtParam = "";
	var gAfeYr 		= '';
	var gAfeDgr 	= '';
	var grBizDivCd			= [];
	var grVndCd				= [];

	var grDistCd			 = [];
	var grMeansCd			 = [{value : '가공', text : '가공'}, {value : '지중', text : '지중'}];

	this.init = function(id, param) {
		gAfeYr		= param.afeYr;
		gAfeDgr		= param.afeDgr;

		initGrid();
		setSelectCode();
		setEventListener();
	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var param = {};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct8', param, 'GET', 'distCd');

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
			 ,{fromIndex:7, toIndex:15, title:"전력정보", id : "Top"} // 최상단 그룹
  			 ,{fromIndex:10, toIndex:12, title:"증설[KW](c)"}
  			 ,{fromIndex:16, toIndex:41, title:"공사비", id : "Top"}
  			 ,{fromIndex:16, toIndex:17, title:"계약전력증설"}
  			 ,{fromIndex:18, toIndex:22, title:"한전인입케이블"}
  			 ,{fromIndex:23, toIndex:27, title:"한전인입/통신/냉방 분전반(ea)"}
  			 ,{fromIndex:28, toIndex:30, title:"차단기[A]"}
  			 ,{fromIndex:31, toIndex:35, title:"전력케이블"}
  			 ,{fromIndex:36, toIndex:37, title:"임시공사"}
  			 ,{fromIndex:38, toIndex:39, title:"기타공사"}
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
				{ key : 'afeYr', align:'center', title : 'AFE년도', width: '80px'},				// 숨김
				{ key : 'afeDgr', align:'center', title : 'AFE차수', width: '80px'},				// 숨김
	    		{ key : 'demdHdofcCd', align:'center', title : '본부', width: '90'},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '90'},
				{ key : 'mtsoNm', align:'center', title : '국사명', width: '180px'},
				{ key : 'bldFlorNo', align:'center', title : '층', width: '60px', hidden:true},

				{ key : 'epwrCtrtVal', align:'center', title : '계약전력[KW](a)', width: '120px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.epwrCtrtValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'epwrLoadVal', align:'center', title : '부하전력[KW](b)', width: '120px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.epwrLoadValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'epwrLoadRate', align:'center', title : '부하율(%)', width: '100px'},

				{ key : 'epwrIcreCommCnt', align:'center', title : '통신', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.epwrIcreCommCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'epwrIcreArcnCnt', align:'center', title : '냉방', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.epwrIcreArcnCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},

				{ key : 'epwrIcreSumr', align:'center', title : '합계', width: '100px'},
				{ key : 'epwrOvstVal', align:'center', title : '과부족[KW]<br>(d=a-b-c)', width: '100px'},
				{ key : 'epwrChgCtrtVal', align:'center', title : '변경계약전력[KW]<br>(e=[a-d]/0.8)', width: '100px'},
				{ key : 'epwrIcdcVal', align:'center', title : '증감전력[KW]<br>(f=[e-a])', width: '100px'},

				{ key : 'cstrCtrtMeansCd', align:'center', title : '계약방식[가공/지중]', width: '150px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrCtrtMeansCdErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrCtrtIcreCost', align:'center', title : '계약전력증설[한전불입금]', width: '200px'},
				{ key : 'cstrLinStrdVal', align:'center', title : '규격[mm2]', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrLinStrdValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrLinCblCnt', align:'center', title : 'LINE[상당 본수]', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrLinCblCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrLinMeansCd', align:'center', title : '인입방식[가공/지중]', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrLinMeansCdErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrLinDistVal', align:'center', title : '거리[m]', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrLinDistValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrLinCblVal', align:'center', title : '공사비', width: '100px'},

				{ key : 'cstrCbplGageCnt', align:'center', title : '계량기함', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrCbplGageCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrMainCbplCnt', align:'center', title : 'Main분전반', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrMainCbplCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrCrtfShftCost', align:'center', title : 'CT교체비', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrCrtfShftCostErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrFlorCbplCnt', align:'center', title : '층별분전반', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrFlorCbplCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrIncidFctVal', align:'center', title : '한전인입/통신/냉방/분전반[신설, 대개체]', width: '250px'},

				{ key : 'cstrCbrkCapaVal', align:'center', title : '용량[AF]', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrCbrkCapaValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrCbrkCnt', align:'center', title : '수량[ea]', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrCbrkCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrCbrkNwRepceVal', align:'center', title : '공사비', width: '100px'},

				{ key : 'cstrMlAStrdVal', align:'center', title : '케이블 A 규격[mm2]', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrMlAStrdValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrMlADistVal', align:'center', title : '케이블 A 거리[m]', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrMlADistValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrMlBStrdVal', align:'center', title : '케이블 B 규격[mm2]', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrMlBStrdValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrMlBDistVal', align:'center', title : '케이블 B 거리[m]', width: '150px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrMlBDistValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrEpwrCblVal', align:'center', title : '공사비', width: '100px'},
				{ key : 'cstrTmpAVal', align:'center', title : '공사내용', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrTmpAValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrTmpBVal', align:'center', title : '공사비', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrTmpBValErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},

				{ key : 'cstrEtcCtt', align:'left', title : '공사 내용', width: '150px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrEtcCttErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrEtcCost', align:'center', title : '공사비', width: '100px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cstrEtcCostErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'cstrTotCost', align:'center', title : '공사비 [합계]', width: '150px'},
				{ key : 'loadExcsOccrCtt', align:'left', title : '부하율 100%초과 발생 내역', width: '250px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.loadExcsOccrCttErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},


    			/***********************************************
	   			 * Row Check
	   			***********************************************/
				{ key : 'epwrCtrtValErr', align:'center', title : '계약전력[KW](a)', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'epwrLoadValErr', align:'center', title : '부하전력[KW](b)', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'epwrIcreCommCntErr', align:'center', title : '통신', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'epwrIcreArcnCntErr', align:'center', title : '냉방', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrCtrtMeansCdErr', align:'center', title : '계약방식[가공/지중]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrLinStrdValErr', align:'center', title : '규격[mm2]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrLinCblCntErr', align:'center', title : 'LINE[상당 본수]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrLinMeansCdErr', align:'center', title : '인입방식[가공/지중]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrLinDistValErr', align:'center', title : '거리[m]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrCbplGageCntErr', align:'center', title : '계량기함', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrMainCbplCntErr', align:'center', title : 'Main분전반', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrCrtfShftCostErr', align:'center', title : 'CT교체비', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrFlorCbplCntErr', align:'center', title : '층별분전반', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrCbrkCapaValErr', align:'center', title : '용량[AF]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrCbrkCntErr', align:'center', title : '수량[ea]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrMlAStrdValErr', align:'center', title : '케이블 A 규격[mm2]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrMlADistValErr', align:'center', title : '케이블 A 거리[m]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrMlBStrdValErr', align:'center', title : '케이블 B 규격[mm2]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrMlBDistValErr', align:'center', title : '케이블 B 거리[m]', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrTmpAValErr', align:'center', title : '공사내용', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrTmpBValErr', align:'center', title : '공사비', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrEtcCttErr', align:'center', title : '공사내용', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'cstrEtcCostErr', align:'center', title : '공사비', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'loadExcsOccrCttErr', align:'center', title : '부하율 100%초과 발생 내역', width: '80px', exportDataType: 'number', hidden : true},

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
					dataList[i].epwrCtrtValErr 				= isNaNCheck(dataList[i].epwrCtrtVal);
					dataList[i].epwrLoadValErr 				= isNaNCheck(dataList[i].epwrLoadVal);
					dataList[i].epwrIcreCommCntErr 			= isNaNCheck(dataList[i].epwrIcreCommCnt);
					dataList[i].epwrIcreArcnCntErr 			= isNaNCheck(dataList[i].epwrIcreArcnCnt);
					dataList[i].cstrLinStrdValErr 			= isNaNCheck(dataList[i].cstrLinStrdVal);
					dataList[i].cstrLinCblCntErr 			= isNaNCheck(dataList[i].cstrLinCblCnt);
					dataList[i].cstrLinDistValErr 			= isNaNCheck(dataList[i].cstrLinDistVal);
					dataList[i].cstrCbplGageCntErr 			= isNaNCheck(dataList[i].cstrCbplGageCnt);
					dataList[i].cstrMainCbplCntErr 			= isNaNCheck(dataList[i].cstrMainCbplCnt);
					dataList[i].cstrCrtfShftCostErr 		= isNaNCheck(dataList[i].cstrCrtfShftCost);
					dataList[i].cstrFlorCbplCntErr 			= isNaNCheck(dataList[i].cstrFlorCbplCnt);
					dataList[i].cstrCbrkCapaValErr 			= isNaNCheck(dataList[i].cstrCbrkCapaVal);
					dataList[i].cstrCbrkCntErr 				= isNaNCheck(dataList[i].cstrCbrkCnt);
					dataList[i].cstrMlAStrdValErr 			= isNaNCheck(dataList[i].cstrMlAStrdVal);
					dataList[i].cstrMlADistValErr 			= isNaNCheck(dataList[i].cstrMlADistVal);
					dataList[i].cstrMlBStrdValErr 			= isNaNCheck(dataList[i].cstrMlBStrdVal);
					dataList[i].cstrMlBDistValErr 			= isNaNCheck(dataList[i].cstrMlBDistVal);
					dataList[i].cstrTmpBValErr 				= isNaNCheck(dataList[i].cstrTmpBVal);
					dataList[i].cstrEtcCostErr 				= isNaNCheck(dataList[i].cstrEtcCost);



					/***********************
					 * 코드값으로 정의
					***********************/
					dataList[i].cstrCtrtMeansCdErr = "0";
					if(typeof dataList[i].cstrCtrtMeansCd != 'undefined' && dataList[i].cstrCtrtMeansCd != undefined && dataList[i].cstrCtrtMeansCd != ''){
						for (var j = 0; j < grMeansCd.length; j++) {
							dataList[i].cstrCtrtMeansCdErr = "1";
							if (dataList[i].cstrCtrtMeansCd.toString().trim().replace(/ /gi, '') == grMeansCd[j].text.trim().replace(/ /gi, '')) {
								dataList[i].cstrCtrtMeansCdErr = "0";
								break;
							}
						}
					}
					dataList[i].cstrLinMeansCdErr = "0";
					if(typeof dataList[i].cstrLinMeansCd != 'undefined' && dataList[i].cstrLinMeansCd != undefined && dataList[i].cstrLinMeansCd != ''){
						for (var j = 0; j < grMeansCd.length; j++) {
							dataList[i].cstrLinMeansCdErr = "1";
							if (dataList[i].cstrLinMeansCd.toString().trim().replace(/ /gi, '') == grMeansCd[j].text.trim().replace(/ /gi, '')) {
								dataList[i].cstrLinMeansCdErr = "0";
								break;
							}
						}
					}
					dataList[i].cstrLinStrdValCdErr = "0";
					if(typeof dataList[i].cstrLinStrdVal != 'undefined' && dataList[i].cstrLinStrdVal != undefined && dataList[i].cstrLinStrdVal != ''){
						for (var j = 0; j < grDistCd.length; j++) {
							dataList[i].cstrLinStrdValErr = "1";
							if (dataList[i].cstrLinStrdVal.toString().trim() == grDistCd[j].text.trim()) {
								dataList[i].cstrLinStrdValErr = "0";
								break;
							}
						}
					}
					dataList[i].cstrMlAStrdValCdErr = "0";
					if(typeof dataList[i].cstrMlAStrdVal != 'undefined' && dataList[i].cstrMlAStrdVal != undefined && dataList[i].cstrMlAStrdVal != ''){
						for (var j = 0; j < grDistCd.length; j++) {
							dataList[i].cstrMlAStrdValErr = "1";
							if (dataList[i].cstrMlAStrdVal.toString().trim() == grDistCd[j].text.trim()) {
								dataList[i].cstrMlAStrdValErr = "0";
								break;
							}
						}
					}
					dataList[i].cstrMlBStrdValCdErr = "0";
					if(typeof dataList[i].cstrMlBStrdVal != 'undefined' && dataList[i].cstrMlBStrdVal != undefined && dataList[i].cstrMlBStrdVal != ''){
						for (var j = 0; j < grDistCd.length; j++) {
							dataList[i].cstrMlBStrdValErr = "1";
							if (dataList[i].cstrMlBStrdVal.toString().trim() == grDistCd[j].text.trim()) {
								dataList[i].cstrMlBStrdValErr = "0";
								break;
							}
						}
					}

					dataList[i].cstrTmpAValErr = "0";
					dataList[i].cstrEtcCttErr = "0";
					dataList[i].loadExcsOccrCttErr = "0";

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
			var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
			var excelSaveDtlList = [];
			var comText = 'Excel 파일을 저장하시겠습니까?(오류가 있는 항목은 저장되지 않습니다.)';
			if (ckGubun) {
				for(var i in dataObj) {
					if (dataObj[i].uploadYn != 'N' &&

						dataObj[i].epwrCtrtValErr			== '0' &&
						dataObj[i].epwrLoadValErr           == '0' &&
						dataObj[i].epwrIcreCommCntErr       == '0' &&
						dataObj[i].epwrIcreArcnCntErr       == '0' &&
						dataObj[i].cstrCtrtMeansCdErr       == '0' &&
						dataObj[i].cstrLinStrdValErr        == '0' &&
						dataObj[i].cstrLinCblCntErr         == '0' &&
						dataObj[i].cstrLinMeansCdErr        == '0' &&
						dataObj[i].cstrLinDistValErr        == '0' &&
						dataObj[i].cstrCbplGageCntErr       == '0' &&
						dataObj[i].cstrMainCbplCntErr       == '0' &&
						dataObj[i].cstrCrtfShftCostErr      == '0' &&
						dataObj[i].cstrFlorCbplCntErr       == '0' &&
						dataObj[i].cstrCbrkCapaValErr       == '0' &&
						dataObj[i].cstrCbrkCntErr           == '0' &&
						dataObj[i].cstrMlAStrdValErr        == '0' &&
						dataObj[i].cstrMlADistValErr        == '0' &&
						dataObj[i].cstrMlBStrdValErr        == '0' &&
						dataObj[i].cstrMlBDistValErr        == '0' &&
						dataObj[i].cstrTmpAValErr           == '0' &&
						dataObj[i].cstrTmpBValErr           == '0' &&
						dataObj[i].cstrEtcCttErr            == '0' &&
						dataObj[i].cstrEtcCostErr           == '0' &&
						dataObj[i].loadExcsOccrCttErr	    == '0') {
						var tmpList = {
								fctInvtId 				: isUndefinedCheck(dataObj[i].fctInvtId),
								afeYr 		    		: isUndefinedCheck(dataObj[i].afeYr),
								afeDgr 		    		: isUndefinedCheck(dataObj[i].afeDgr),

								epwrCtrtVal				: isUndefinedCheck(dataObj[i].epwrCtrtVal),
								epwrLoadVal         	: isUndefinedCheck(dataObj[i].epwrLoadVal),
								epwrIcreCommCnt     	: isUndefinedCheck(dataObj[i].epwrIcreCommCnt),
								epwrIcreArcnCnt     	: isUndefinedCheck(dataObj[i].epwrIcreArcnCnt),
								cstrCtrtMeansCd     	: isUndefinedCheck(dataObj[i].cstrCtrtMeansCd),
								cstrLinStrdVal      	: isUndefinedCheck(dataObj[i].cstrLinStrdVal),
								cstrLinCblCnt       	: isUndefinedCheck(dataObj[i].cstrLinCblCnt),
								cstrLinMeansCd      	: isUndefinedCheck(dataObj[i].cstrLinMeansCd),
								cstrLinDistVal      	: isUndefinedCheck(dataObj[i].cstrLinDistVal),
								cstrCbplGageCnt     	: isUndefinedCheck(dataObj[i].cstrCbplGageCnt),
								cstrMainCbplCnt     	: isUndefinedCheck(dataObj[i].cstrMainCbplCnt),
								cstrCrtfShftCost    	: isUndefinedCheck(dataObj[i].cstrCrtfShftCost),
								cstrFlorCbplCnt     	: isUndefinedCheck(dataObj[i].cstrFlorCbplCnt),
								cstrCbrkCapaVal     	: isUndefinedCheck(dataObj[i].cstrCbrkCapaVal),
								cstrCbrkCnt         	: isUndefinedCheck(dataObj[i].cstrCbrkCnt),
								cstrMlAStrdVal      	: isUndefinedCheck(dataObj[i].cstrMlAStrdVal),
								cstrMlADistVal      	: isUndefinedCheck(dataObj[i].cstrMlADistVal),
								cstrMlBStrdVal      	: isUndefinedCheck(dataObj[i].cstrMlBStrdVal),
								cstrMlBDistVal      	: isUndefinedCheck(dataObj[i].cstrMlBDistVal),
								cstrTmpAVal         	: isUndefinedCheck(dataObj[i].cstrTmpAVal),
								cstrTmpBVal         	: isUndefinedCheck(dataObj[i].cstrTmpBVal),
								cstrEtcCtt          	: isUndefinedCheck(dataObj[i].cstrEtcCtt),
								cstrEtcCost         	: isUndefinedCheck(dataObj[i].cstrEtcCost),
								loadExcsOccrCtt	    	: isUndefinedCheck(dataObj[i].loadExcsOccrCtt),

								userId					: userId
						};
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
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtElctyCstrInfExcelUpload', excelSaveDtlList, 'POST', 'saveElctyCstrInfo');
	 		        }
			     });
			}
		});


		// 닫기
		$('#btnCancel').on('click', function(e) {
			$a.close();
		});
	};

	function successCallback(response, status, jqxhr, flag) {
		if(flag == 'search'){}

		if(flag == 'distCd'){
    		grDistCd = [];
    		for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grDistCd.push(resObj);
			}
    	}

		if(flag == 'saveElctyCstrInfo'){
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

