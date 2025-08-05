/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var invtIntgPop = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var excelGrid = 'adtnFctInfDataGrid';
	var invtParam = "";
	var gAfeYr 		= '';
	var gAfeDgr 	= '';
	var grOutdrCbntCdNm = [];

	this.init = function(id, param) {
		gAfeYr		= param.afeYr;
		gAfeDgr		= param.afeDgr;

		initGrid();
		setSelectCode();
		setEventListener();
	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var param = {matlClNm : '옥외함체'};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtItemInf', param, 'GET', 'outdrCbntCdNm');

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




	   		,{fromIndex:7, toIndex:9, title:"층정보"} // 최상단 그룹
    		,{fromIndex:10, toIndex:88, title:"RMS" , id : "Top"} // 최상단 그룹
  			,{fromIndex:10, toIndex:12, title:"NVR카메라"}
  			,{fromIndex:13, toIndex:15, title:"NVR"}
  			,{fromIndex:16, toIndex:18, title:"전동제어 감시모듈"}
  			,{fromIndex:19, toIndex:21, title:"Door Lock"}
  			,{fromIndex:22, toIndex:24, title:"카드리더(RF리더)"}
  			,{fromIndex:25, toIndex:27, title:"출입문센서"}
  			,{fromIndex:28, toIndex:30, title:"온습도센서"}
  			,{fromIndex:31, toIndex:33, title:"하론 감시모듈"}
  			,{fromIndex:34, toIndex:36, title:"정류기 감시모듈"}
  			,{fromIndex:37, toIndex:39, title:"냉방기 감시모듈"}
  			,{fromIndex:40, toIndex:42, title:"발동발전기 감시모듈"}
  			,{fromIndex:43, toIndex:45, title:"광전센서"}
  			,{fromIndex:46, toIndex:48, title:"화재감지기"}
  			,{fromIndex:49, toIndex:51, title:"UPS감시모듈"}
  			,{fromIndex:52, toIndex:54, title:"상전감시모듈"}
  			,{fromIndex:55, toIndex:57, title:"중심국사용RCU(2U)"}
  			//,{fromIndex:54, toIndex:56, title:"소형RCU(대용량리튬폴리머)"}
  			,{fromIndex:58, toIndex:60, title:"DU용RCU"}
  			,{fromIndex:61, toIndex:63, title:"통합형RCU 기본형"}
  			,{fromIndex:64, toIndex:66, title:"통합형RCU Slave"}
  			,{fromIndex:67, toIndex:69, title:"DI"}
  			,{fromIndex:70, toIndex:72, title:"DO"}
  			,{fromIndex:73, toIndex:75, title:"RS-232"}
  			,{fromIndex:76, toIndex:78, title:"RS-485"}
  			,{fromIndex:79, toIndex:81, title:"RS-422"}
  			,{fromIndex:82, toIndex:84, title:"전력량계(12채널)"}
  			,{fromIndex:85, toIndex:87, title:"투자비(천원)"}

  			,{fromIndex:89, toIndex:101, title:"옥외함체", id : "Top"} // 최상단 그룹
  			,{fromIndex:89, toIndex:93, title:"옥외함체A"}
  			,{fromIndex:94, toIndex:98, title:"옥외함체B"}
  			,{fromIndex:99, toIndex:101, title:"투자비(천원)"}
//
  			,{fromIndex:103, toIndex:116, title:"소화설비", id : "Top"} // 최상단 그룹
  			,{fromIndex:103, toIndex:107, title:"소화설비A"}
  			,{fromIndex:108, toIndex:112, title:"소화설비B"}
  			,{fromIndex:113, toIndex:115, title:"투자비(천원)"}
//
  			,{fromIndex:117, toIndex:125, title:"SPD", id : "Top"} // 최상단 그룹
  			,{fromIndex:117, toIndex:121, title:"SPD"}
  			,{fromIndex:122, toIndex:124, title:"투자비(천원)"}

  			,{fromIndex:126, toIndex:126, title:" ", id : "Top"} // 최상단 그룹
  			,{fromIndex:127, toIndex:127, title:"투자비 합계(천원)"}









// 			,{fromIndex:7, toIndex:8, title:"층정보"} // 최상단 그룹
//	    		,{fromIndex:9, toIndex:87, title:"RMS" , id : "Top"} // 최상단 그룹
//	  			,{fromIndex:9, toIndex:11, title:"NVR카메라" }
//	  			,{fromIndex:12, toIndex:14, title:"NVR"}
//	  			,{fromIndex:15, toIndex:17, title:"전동제어 감시모듈"}
//	  			,{fromIndex:18, toIndex:20, title:"Door Lock"}
//	  			,{fromIndex:21, toIndex:23, title:"카드리더(RF리더)"}
//	  			,{fromIndex:24, toIndex:26, title:"출입문센서"}
//	  			,{fromIndex:27, toIndex:29, title:"온습도센서"}
//	  			,{fromIndex:30, toIndex:32, title:"하론 감시모듈"}
//	  			,{fromIndex:33, toIndex:35, title:"정류기 감시모듈"}
//	  			,{fromIndex:36, toIndex:38, title:"냉방기 감시모듈"}
//	  			,{fromIndex:39, toIndex:41, title:"발동발전기 감시모듈"}
//	  			,{fromIndex:42, toIndex:44, title:"광전센서"}
//	  			,{fromIndex:45, toIndex:47, title:"화재감지기"}
//	  			,{fromIndex:48, toIndex:50, title:"UPS감시모듈"}
//	  			,{fromIndex:51, toIndex:53, title:"상전감시모듈"}
//	  			,{fromIndex:54, toIndex:56, title:"중심국사용RCU(2U)"}
//	  			//,{fromIndex:54, toIndex:56, title:"소형RCU(대용량리튬폴리머)"}
//	  			,{fromIndex:57, toIndex:59, title:"DU용RCU"}
//	  			,{fromIndex:60, toIndex:62, title:"통합형RCU 기본형"}
//	  			,{fromIndex:63, toIndex:65, title:"통합형RCU Slave"}
//	  			,{fromIndex:66, toIndex:68, title:"DI"}
//	  			,{fromIndex:69, toIndex:71, title:"DO"}
//	  			,{fromIndex:72, toIndex:74, title:"RS-232"}
//	  			,{fromIndex:75, toIndex:77, title:"RS-485"}
//	  			,{fromIndex:78, toIndex:80, title:"RS-422"}
//	  			,{fromIndex:81, toIndex:83, title:"전력량계(12채널)"}
//	  			,{fromIndex:84, toIndex:86, title:"투자비(천원)"}
//
//	  			,{fromIndex:88, toIndex:98, title:"옥외함체", id : "Top"} // 최상단 그룹
//	  			,{fromIndex:88, toIndex:92, title:"옥외함체A"}
//	  			,{fromIndex:93, toIndex:97, title:"옥외함체B"}
//	  			,{fromIndex:98, toIndex:100, title:"투자비"}
////
//	  			,{fromIndex:102, toIndex:115, title:"소화설비", id : "Top"} // 최상단 그룹
//	  			,{fromIndex:102, toIndex:106, title:"소화설비A"}
//	  			,{fromIndex:107, toIndex:111, title:"소화설비B"}
//	  			,{fromIndex:112, toIndex:114, title:"투자비(천원)"}
////
//	  			,{fromIndex:116, toIndex:124, title:"SPD", id : "Top"} // 최상단 그룹
//	  			,{fromIndex:116, toIndex:120, title:"SPD"}
//	  			,{fromIndex:121, toIndex:123, title:"투자비(천원)"}
//
//	  			,{fromIndex:125, toIndex:125, title:" ", id : "Top"} // 최상단 그룹
//	  			,{fromIndex:125, toIndex:125, title:"투자비 합계(천원)"}
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
				{ key : 'newExstDivCd', align:'center', title : '신규/기존', width: '100px'},
				{ key : 'bldFlorNo', align:'center', title : '층', width: '40px'},
				{ key : 'allFlorCnt', align:'center', title : '전체층수', width: '80px', exportDataType: 'number', 				inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.allFlorCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'machFlorCnt', align:'center', title : '기계실층수', width: '80px', exportDataType: 'number', 				inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.machFlorCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsNvrCamRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsNvrCamRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsNvrCamInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsNvrCamInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsNvrCamBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'rmsNvrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsNvrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsNvrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsNvrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsNvrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsMntrMdulRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsMntrMdulRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsMntrMdulInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsMntrMdulInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsMntrMdulBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsLockRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsLockRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsLockInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsLockInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsLockBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsCardrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsCardrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsCardrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsCardrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsCardrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsDoorSnsrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDoorSnsrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDoorSnsrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDoorSnsrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDoorSnsrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsTmprSnsrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsTmprSnsrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsTmprSnsrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsTmprSnsrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsTmprSnsrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsHaronMntrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsHaronMntrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsHaronMntrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsHaronMntrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsHaronMntrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsRtfMntrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRtfMntrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRtfMntrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRtfMntrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRtfMntrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsArcnMntrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsArcnMntrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsArcnMntrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsArcnMntrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsArcnMntrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsGntMntrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsGntMntrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsGntMntrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsGntMntrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsGntMntrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsOptlSnsrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsOptlSnsrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsOptlSnsrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsOptlSnsrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsOptlSnsrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsFireSeseRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsFireSeseRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsFireSeseInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsFireSeseInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsFireSeseBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},


				{ key : 'rmsUpsMntrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsUpsMntrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsUpsMntrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsUpsMntrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsUpsMntrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsNvcurMntrRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsNvcurMntrRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsNvcurMntrInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsNvcurMntrInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsNvcurMntrBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsCmtsoRcuRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsCmtsoRcuRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsCmtsoRcuInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsCmtsoRcuInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsCmtsoRcuBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},


				{ key : 'rmsDuRcuRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDuRcuRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDuRcuInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDuRcuInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDuRcuBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsIntgRcuRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsIntgRcuRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsIntgRcuInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsIntgRcuInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsIntgRcuBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},


				{ key : 'rmsRcuSlveRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRcuSlveRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRcuSlveInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRcuSlveInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRcuSlveBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},


				{ key : 'rmsDiRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDiRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDiInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDiInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDiBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},


				{ key : 'rmsDoRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDoRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDoInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsDoInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsDoBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsRs232RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRs232RqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRs232InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRs232InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRs232BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsRs485RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRs485RqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRs485InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRs485InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRs485BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsRs422RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRs422RqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRs422InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRs422InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsRs422BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsWattChnlRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsWattChnlRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsWattChnlInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsWattChnlInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'rmsWattChnlBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'rmsMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'rmsCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'rmsTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},

				{ key : 'rmsRmk', align:'center', title : '비고', width: '180px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmsRmkErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},

				{ key : 'outdrCbntACdNm', align:'center', title : 'TYPE', width: '150px', filter : {useRenderToFilter : true}, inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.outdrCbntACdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'outdrCbntACd', align:'center', title : '코드', width: '100px'},
				{ key : 'outdrCbntARqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.outdrCbntARqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'outdrCbntAInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.outdrCbntAInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'outdrCbntABuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'outdrCbntBCdNm', align:'center', title : 'TYPE', width: '150px', filter : {useRenderToFilter : true}, inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.outdrCbntBCdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'outdrCbntBCd', align:'center', title : '코드', width: '100px'},
				{ key : 'outdrCbntBRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.outdrCbntBRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'outdrCbntBInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.outdrCbntBInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'outdrCbntBBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},



				{ key : 'outdrCbntMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'outdrCbntCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'outdrCbntTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},

				{ key : 'outdrCbntRmk', align:'center', title : '비고', width: '180px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.outdrCbntRmkErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},

				{ key : 'fextnACdNm', align:'center', title : 'TYPE', width: '150px'},
				{ key : 'fextnACd', align:'center', title : '코드', width: '100px'},
				{ key : 'fextnARqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.fextnARqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'fextnAInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.fextnAInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'fextnABuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'fextnBCdNm', align:'center', title : 'TYPE', width: '150px'},
				{ key : 'fextnBCd', align:'center', title : '코드', width: '100px'},
				{ key : 'fextnBRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.fextnBRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'fextnBInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.fextnBInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'fextnBBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'fextnMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'fextnCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'fextnTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},

				{ key : 'fextnRmk', align:'center', title : '비고', width: '180px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.fextnRmkErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},

				{ key : 'spdCdNm', align:'center', title : 'TYPE', width: '150px'},
				{ key : 'spdCd', align:'center', title : '코드', width: '100px'},
				{ key : 'spdRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.spdRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'spdInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.spdInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'spdBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},


				{ key : 'spdMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'spdCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'spdTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},

				{ key : 'spdRmk', align:'center', title : '비고', width: '180px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.spdRmkErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},


				{ key : 'invtAdtnTotCost', align:'center', title : 'RMS+옥외함체+소화설비+SPD', width: '200px', exportDataType: 'number'},



    			/***********************************************
	   			 * Row Check
	   			***********************************************/
				{ key : 'allFlorCntErr', align:'center', title : '전체층수', width: '80px', exportDataType: 'number', 				hidden : true},
				{ key : 'machFlorCntErr', align:'center', title : '기계실층수', width: '80px', exportDataType: 'number', 				hidden : true},
				{ key : 'rmsNvrCamRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsNvrCamInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsNvrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsNvrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsMntrMdulRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsMntrMdulInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsLockRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsLockInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsCardrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsCardrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsDoorSnsrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsDoorSnsrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsTmprSnsrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsTmprSnsrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsHaronMntrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsHaronMntrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsRtfMntrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRtfMntrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsArcnMntrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsArcnMntrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsGntMntrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsGntMntrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsOptlSnsrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsOptlSnsrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsFireSeseRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsFireSeseInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsUpsMntrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsUpsMntrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsNvcurMntrRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsNvcurMntrInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsCmtsoRcuRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsCmtsoRcuInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsDuRcuRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsDuRcuInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsIntgRcuRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsIntgRcuInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRcuSlveRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRcuSlveInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsDiRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsDiInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsDoRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsDoInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'rmsRs232RqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRs232InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRs485RqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRs485InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRs422RqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsRs422InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'rmsWattChnlRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number',	 	hidden : true},
				{ key : 'rmsWattChnlInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 	hidden : true},
				{ key : 'rmsRmkErr', align:'center', title : '비고', width: '180px', 											hidden : true},

				{ key : 'outdrCbntACdNmErr', align:'center', title : 'TYPE', width: '150px',									hidden : true},
				{ key : 'outdrCbntACdNmCol', align:'center', title : 'TYPE', width: '150px',									hidden : true},

				{ key : 'outdrCbntARqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'outdrCbntAInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'outdrCbntBCdNmErr', align:'center', title : 'TYPE', width: '150px',									hidden : true},
				{ key : 'outdrCbntBCdNmCol', align:'center', title : 'TYPE', width: '150px',									hidden : true},

				{ key : 'outdrCbntBRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'outdrCbntBInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 		hidden : true},
				{ key : 'outdrCbntRmkErr', align:'center', title : '비고', width: '180px', 										hidden : true},
				{ key : 'fextnARqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'fextnAInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'fextnBRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'fextnBInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'fextnRmkErr', align:'center', title : '비고', width: '180px', 											hidden : true},
				{ key : 'spdRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'spdInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', 			hidden : true},
				{ key : 'spdRmkErr', align:'center', title : '비고', width: '180px', 											hidden : true},


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

					dataList[i].allFlorCntErr							= isNaNCheck(dataList[i].allFlorCnt);
					dataList[i].machFlorCntErr							= isNaNCheck(dataList[i].machFlorCnt);
					dataList[i].rmsNvrCamRqrdCntErr                     = isNaNCheck(dataList[i].rmsNvrCamRqrdCnt);
					dataList[i].rmsNvrCamInveCntErr                     = isNaNCheck(dataList[i].rmsNvrCamInveCnt);
					dataList[i].rmsNvrRqrdCntErr                        = isNaNCheck(dataList[i].rmsNvrRqrdCnt);
					dataList[i].rmsNvrInveCntErr                        = isNaNCheck(dataList[i].rmsNvrInveCnt);
					dataList[i].rmsMntrMdulRqrdCntErr                   = isNaNCheck(dataList[i].rmsMntrMdulRqrdCnt);
					dataList[i].rmsMntrMdulInveCntErr                   = isNaNCheck(dataList[i].rmsMntrMdulInveCnt);
					dataList[i].rmsLockRqrdCntErr                       = isNaNCheck(dataList[i].rmsLockRqrdCnt);
					dataList[i].rmsLockInveCntErr                       = isNaNCheck(dataList[i].rmsLockInveCnt);
					dataList[i].rmsCardrRqrdCntErr                      = isNaNCheck(dataList[i].rmsCardrRqrdCnt);
					dataList[i].rmsCardrInveCntErr                      = isNaNCheck(dataList[i].rmsCardrInveCnt);
					dataList[i].rmsDoorSnsrRqrdCntErr                   = isNaNCheck(dataList[i].rmsDoorSnsrRqrdCnt);
					dataList[i].rmsDoorSnsrInveCntErr                   = isNaNCheck(dataList[i].rmsDoorSnsrInveCnt);
					dataList[i].rmsTmprSnsrRqrdCntErr                   = isNaNCheck(dataList[i].rmsTmprSnsrRqrdCnt);
					dataList[i].rmsTmprSnsrInveCntErr                   = isNaNCheck(dataList[i].rmsTmprSnsrInveCnt);
					dataList[i].rmsHaronMntrRqrdCntErr                  = isNaNCheck(dataList[i].rmsHaronMntrRqrdCnt);
					dataList[i].rmsHaronMntrInveCntErr                  = isNaNCheck(dataList[i].rmsHaronMntrInveCnt);
					dataList[i].rmsRtfMntrRqrdCntErr                    = isNaNCheck(dataList[i].rmsRtfMntrRqrdCnt);
					dataList[i].rmsRtfMntrInveCntErr                    = isNaNCheck(dataList[i].rmsArcnMntrRqrdCnt);
					dataList[i].rmsArcnMntrRqrdCntErr                   = isNaNCheck(dataList[i].rmsArcnMntrRqrdCnt);
					dataList[i].rmsArcnMntrInveCntErr                   = isNaNCheck(dataList[i].rmsArcnMntrInveCnt);
					dataList[i].rmsGntMntrRqrdCntErr                    = isNaNCheck(dataList[i].rmsGntMntrRqrdCnt);
					dataList[i].rmsGntMntrInveCntErr                    = isNaNCheck(dataList[i].rmsGntMntrInveCnt);
					dataList[i].rmsOptlSnsrRqrdCntErr                   = isNaNCheck(dataList[i].rmsOptlSnsrRqrdCnt);
					dataList[i].rmsOptlSnsrInveCntErr                   = isNaNCheck(dataList[i].rmsOptlSnsrInveCnt);
					dataList[i].rmsFireSeseRqrdCntErr                   = isNaNCheck(dataList[i].rmsFireSeseRqrdCnt);
					dataList[i].rmsFireSeseInveCntErr                   = isNaNCheck(dataList[i].rmsFireSeseInveCnt);
					dataList[i].rmsUpsMntrRqrdCntErr                    = isNaNCheck(dataList[i].rmsUpsMntrRqrdCnt);
					dataList[i].rmsUpsMntrInveCntErr                    = isNaNCheck(dataList[i].rmsUpsMntrInveCnt);
					dataList[i].rmsNvcurMntrRqrdCntErr                  = isNaNCheck(dataList[i].rmsNvcurMntrRqrdCnt);
					dataList[i].rmsNvcurMntrInveCntErr                  = isNaNCheck(dataList[i].rmsNvcurMntrInveCnt);
					dataList[i].rmsCmtsoRcuRqrdCntErr                   = isNaNCheck(dataList[i].rmsCmtsoRcuRqrdCnt);
					dataList[i].rmsCmtsoRcuInveCntErr                   = isNaNCheck(dataList[i].rmsCmtsoRcuInveCnt);
					dataList[i].rmsDuRcuRqrdCntErr                      = isNaNCheck(dataList[i].rmsDuRcuRqrdCnt);
					dataList[i].rmsDuRcuInveCntErr                      = isNaNCheck(dataList[i].rmsDuRcuInveCnt);
					dataList[i].rmsIntgRcuRqrdCntErr                    = isNaNCheck(dataList[i].rmsIntgRcuRqrdCnt);
					dataList[i].rmsIntgRcuInveCntErr                    = isNaNCheck(dataList[i].rmsIntgRcuInveCnt);
					dataList[i].rmsRcuSlveRqrdCntErr                    = isNaNCheck(dataList[i].rmsRcuSlveRqrdCnt);
					dataList[i].rmsRcuSlveInveCntErr                    = isNaNCheck(dataList[i].rmsRcuSlveInveCnt);
					dataList[i].rmsDiRqrdCntErr                         = isNaNCheck(dataList[i].rmsDiRqrdCnt);
					dataList[i].rmsDiInveCntErr                         = isNaNCheck(dataList[i].rmsDiInveCnt);
					dataList[i].rmsDoRqrdCntErr                         = isNaNCheck(dataList[i].rmsDoRqrdCnt);
					dataList[i].rmsDoInveCntErr                         = isNaNCheck(dataList[i].rmsDoInveCnt);
					dataList[i].rmsRs232RqrdCntErr                      = isNaNCheck(dataList[i].rmsRs232RqrdCnt);
					dataList[i].rmsRs232InveCntErr                      = isNaNCheck(dataList[i].rmsRs232InveCnt);
					dataList[i].rmsRs485RqrdCntErr                      = isNaNCheck(dataList[i].rmsRs485RqrdCnt);
					dataList[i].rmsRs485InveCntErr                      = isNaNCheck(dataList[i].rmsRs485InveCnt);
					dataList[i].rmsRs422RqrdCntErr                      = isNaNCheck(dataList[i].rmsRs422RqrdCnt);
					dataList[i].rmsRs422InveCntErr                      = isNaNCheck(dataList[i].rmsRs422InveCnt);
					dataList[i].rmsWattChnlRqrdCntErr                   = isNaNCheck(dataList[i].rmsWattChnlRqrdCnt);
					dataList[i].rmsWattChnlInveCntErr                   = isNaNCheck(dataList[i].rmsWattChnlInveCnt);
					dataList[i].outdrCbntARqrdCntErr                    = isNaNCheck(dataList[i].outdrCbntARqrdCnt);
					dataList[i].outdrCbntAInveCntErr                    = isNaNCheck(dataList[i].outdrCbntAInveCnt);
					dataList[i].outdrCbntBRqrdCntErr                    = isNaNCheck(dataList[i].outdrCbntBRqrdCnt);
					dataList[i].outdrCbntBInveCntErr                    = isNaNCheck(dataList[i].outdrCbntBInveCnt);
					dataList[i].fextnARqrdCntErr                        = isNaNCheck(dataList[i].fextnARqrdCnt);
					dataList[i].fextnAInveCntErr                        = isNaNCheck(dataList[i].fextnAInveCnt);
					dataList[i].fextnBRqrdCntErr                        = isNaNCheck(dataList[i].fextnBRqrdCnt);
					dataList[i].fextnBInveCntErr                        = isNaNCheck(dataList[i].fextnBInveCnt);
					dataList[i].spdRqrdCntErr                           = isNaNCheck(dataList[i].spdRqrdCnt);
					dataList[i].spdInveCntErr                           = isNaNCheck(dataList[i].spdInveCnt);




					dataList[i].rmsRmkErr								= "0";
					dataList[i].outdrCbntRmkErr							= "0";
					dataList[i].fextnRmkErr								= "0";
					dataList[i].spdRmkErr								= "0";


//					outdrCbntACdNmErr
//					outdrCbntACdNmCol
//					outdrCbntBCdNmErr
//					outdrCbntBCdNmCol

					/***********************
					 * 코드값으로 정의
					***********************/
					dataList[i].outdrCbntACdNmErr = "0";
					if(typeof dataList[i].outdrCbntACdNm != 'undefined' && dataList[i].outdrCbntACdNm != undefined && dataList[i].outdrCbntACdNm != ''){
						for (var j = 0; j < grOutdrCbntCdNm.length; j++) {
							dataList[i].outdrCbntACdNmErr = "1";
							if (dataList[i].outdrCbntACdNm.toString().trim().replace(/ /gi, '') == grOutdrCbntCdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].outdrCbntACdNmCol = grOutdrCbntCdNm[j].value;
								dataList[i].outdrCbntACdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].outdrCbntBCdNmErr = "0";
					if(typeof dataList[i].outdrCbntBCdNm != 'undefined' && dataList[i].outdrCbntBCdNm != undefined && dataList[i].outdrCbntBCdNm != ''){
						for (var j = 0; j < grOutdrCbntCdNm.length; j++) {
							dataList[i].outdrCbntBCdNmErr = "1";
							if (dataList[i].outdrCbntBCdNm.toString().trim().replace(/ /gi, '') == grOutdrCbntCdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].outdrCbntBCdNmCol = grOutdrCbntCdNm[j].value;
								dataList[i].outdrCbntBCdNmErr = "0";
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
			var dataObj = $('#'+excelGrid).alopexGrid('dataGet',{});
			var excelSaveDtlList = [];
			var comText = 'Excel 파일을 저장하시겠습니까?(오류가 있는 항목은 저장되지 않습니다.)';
			if (ckGubun) {
				for(var i in dataObj) {
					if (dataObj[i].uploadYn != 'N' &&
						dataObj[i].allFlorCntErr					== '0' &&
						dataObj[i].machFlorCntErr					== '0' &&
						dataObj[i].rmsNvrCamRqrdCntErr              == '0' &&
						dataObj[i].rmsNvrCamInveCntErr              == '0' &&
						dataObj[i].rmsNvrRqrdCntErr                 == '0' &&
						dataObj[i].rmsNvrInveCntErr                 == '0' &&
						dataObj[i].rmsMntrMdulRqrdCntErr            == '0' &&
						dataObj[i].rmsMntrMdulInveCntErr            == '0' &&
						dataObj[i].rmsLockRqrdCntErr                == '0' &&
						dataObj[i].rmsLockInveCntErr                == '0' &&
						dataObj[i].rmsCardrRqrdCntErr               == '0' &&
						dataObj[i].rmsCardrInveCntErr               == '0' &&
						dataObj[i].rmsDoorSnsrRqrdCntErr            == '0' &&
						dataObj[i].rmsDoorSnsrInveCntErr            == '0' &&
						dataObj[i].rmsTmprSnsrRqrdCntErr            == '0' &&
						dataObj[i].rmsTmprSnsrInveCntErr            == '0' &&
						dataObj[i].rmsHaronMntrRqrdCntErr           == '0' &&
						dataObj[i].rmsHaronMntrInveCntErr           == '0' &&
						dataObj[i].rmsRtfMntrRqrdCntErr             == '0' &&
						dataObj[i].rmsRtfMntrInveCntErr             == '0' &&
						dataObj[i].rmsArcnMntrRqrdCntErr            == '0' &&
						dataObj[i].rmsArcnMntrInveCntErr            == '0' &&
						dataObj[i].rmsGntMntrRqrdCntErr             == '0' &&
						dataObj[i].rmsGntMntrInveCntErr             == '0' &&
						dataObj[i].rmsOptlSnsrRqrdCntErr            == '0' &&
						dataObj[i].rmsOptlSnsrInveCntErr            == '0' &&
						dataObj[i].rmsFireSeseRqrdCntErr            == '0' &&
						dataObj[i].rmsFireSeseInveCntErr            == '0' &&
						dataObj[i].rmsUpsMntrRqrdCntErr             == '0' &&
						dataObj[i].rmsUpsMntrInveCntErr             == '0' &&
						dataObj[i].rmsNvcurMntrRqrdCntErr           == '0' &&
						dataObj[i].rmsNvcurMntrInveCntErr           == '0' &&
						dataObj[i].rmsCmtsoRcuRqrdCntErr            == '0' &&
						dataObj[i].rmsCmtsoRcuInveCntErr            == '0' &&
						dataObj[i].rmsDuRcuRqrdCntErr               == '0' &&
						dataObj[i].rmsDuRcuInveCntErr               == '0' &&
						dataObj[i].rmsIntgRcuRqrdCntErr             == '0' &&
						dataObj[i].rmsIntgRcuInveCntErr             == '0' &&
						dataObj[i].rmsRcuSlveRqrdCntErr             == '0' &&
						dataObj[i].rmsRcuSlveInveCntErr             == '0' &&
						dataObj[i].rmsDiRqrdCntErr                  == '0' &&
						dataObj[i].rmsDiInveCntErr                  == '0' &&
						dataObj[i].rmsDoRqrdCntErr                  == '0' &&
						dataObj[i].rmsDoInveCntErr                  == '0' &&
						dataObj[i].rmsRs232RqrdCntErr               == '0' &&
						dataObj[i].rmsRs232InveCntErr               == '0' &&
						dataObj[i].rmsRs485RqrdCntErr               == '0' &&
						dataObj[i].rmsRs485InveCntErr               == '0' &&
						dataObj[i].rmsRs422RqrdCntErr               == '0' &&
						dataObj[i].rmsRs422InveCntErr               == '0' &&
						dataObj[i].rmsWattChnlRqrdCntErr            == '0' &&
						dataObj[i].rmsWattChnlInveCntErr            == '0' &&
						dataObj[i].outdrCbntARqrdCntErr             == '0' &&
						dataObj[i].outdrCbntAInveCntErr             == '0' &&
						dataObj[i].outdrCbntBRqrdCntErr             == '0' &&
						dataObj[i].outdrCbntBInveCntErr             == '0' &&
						dataObj[i].fextnARqrdCntErr                 == '0' &&
						dataObj[i].fextnAInveCntErr                 == '0' &&
						dataObj[i].fextnBRqrdCntErr                 == '0' &&
						dataObj[i].fextnBInveCntErr                 == '0' &&
						dataObj[i].spdRqrdCntErr                    == '0' &&
						dataObj[i].spdInveCntErr                    == '0' &&
						dataObj[i].rmsRmkErr						== '0' &&
						dataObj[i].outdrCbntRmkErr					== '0' &&
						dataObj[i].fextnRmkErr						== '0' &&
						dataObj[i].spdRmkErr						== '0' &&
						dataObj[i].outdrCbntACdNmErr                == '0' &&
						dataObj[i].outdrCbntBCdNmErr                == '0') {
						var tmpList = {
								fctInvtId 				: isUndefinedCheck(dataObj[i].fctInvtId),
								afeYr 		    		: isUndefinedCheck(dataObj[i].afeYr),
								afeDgr 		    		: isUndefinedCheck(dataObj[i].afeDgr),


								allFlorCnt					: isUndefinedCheck(dataObj[i].allFlorCnt),
								machFlorCnt                 : isUndefinedCheck(dataObj[i].machFlorCnt),
								rmsNvrCamRqrdCnt            : isUndefinedCheck(dataObj[i].rmsNvrCamRqrdCnt),
								rmsNvrCamInveCnt            : isUndefinedCheck(dataObj[i].rmsNvrCamInveCnt),
								rmsNvrRqrdCnt               : isUndefinedCheck(dataObj[i].rmsNvrRqrdCnt),
								rmsNvrInveCnt               : isUndefinedCheck(dataObj[i].rmsNvrInveCnt),
								rmsMntrMdulRqrdCnt          : isUndefinedCheck(dataObj[i].rmsMntrMdulRqrdCnt),
								rmsMntrMdulInveCnt          : isUndefinedCheck(dataObj[i].rmsMntrMdulInveCnt),
								rmsLockRqrdCnt              : isUndefinedCheck(dataObj[i].rmsLockRqrdCnt),
								rmsLockInveCnt              : isUndefinedCheck(dataObj[i].rmsLockInveCnt),
								rmsCardrRqrdCnt             : isUndefinedCheck(dataObj[i].rmsCardrRqrdCnt),
								rmsCardrInveCnt             : isUndefinedCheck(dataObj[i].rmsCardrInveCnt),
								rmsDoorSnsrRqrdCnt          : isUndefinedCheck(dataObj[i].rmsDoorSnsrRqrdCnt),
								rmsDoorSnsrInveCnt          : isUndefinedCheck(dataObj[i].rmsDoorSnsrInveCnt),
								rmsTmprSnsrRqrdCnt          : isUndefinedCheck(dataObj[i].rmsTmprSnsrRqrdCnt),
								rmsTmprSnsrInveCnt          : isUndefinedCheck(dataObj[i].rmsTmprSnsrInveCnt),
								rmsHaronMntrRqrdCnt         : isUndefinedCheck(dataObj[i].rmsHaronMntrRqrdCnt),
								rmsHaronMntrInveCnt         : isUndefinedCheck(dataObj[i].rmsHaronMntrInveCnt),
								rmsRtfMntrRqrdCnt           : isUndefinedCheck(dataObj[i].rmsRtfMntrRqrdCnt),
								rmsRtfMntrInveCnt           : isUndefinedCheck(dataObj[i].rmsRtfMntrInveCnt),
								rmsArcnMntrRqrdCnt          : isUndefinedCheck(dataObj[i].rmsArcnMntrRqrdCnt),
								rmsArcnMntrInveCnt          : isUndefinedCheck(dataObj[i].rmsArcnMntrInveCnt),
								rmsGntMntrRqrdCnt           : isUndefinedCheck(dataObj[i].rmsGntMntrRqrdCnt),
								rmsGntMntrInveCnt           : isUndefinedCheck(dataObj[i].rmsGntMntrInveCnt),
								rmsOptlSnsrRqrdCnt          : isUndefinedCheck(dataObj[i].rmsOptlSnsrRqrdCnt),
								rmsOptlSnsrInveCnt          : isUndefinedCheck(dataObj[i].rmsOptlSnsrInveCnt),
								rmsFireSeseRqrdCnt          : isUndefinedCheck(dataObj[i].rmsFireSeseRqrdCnt),
								rmsFireSeseInveCnt          : isUndefinedCheck(dataObj[i].rmsFireSeseInveCnt),
								rmsUpsMntrRqrdCnt           : isUndefinedCheck(dataObj[i].rmsUpsMntrRqrdCnt),
								rmsUpsMntrInveCnt           : isUndefinedCheck(dataObj[i].rmsUpsMntrInveCnt),
								rmsCmtsoRcuRqrdCnt          : isUndefinedCheck(dataObj[i].rmsCmtsoRcuRqrdCnt),
								rmsCmtsoRcuInveCnt          : isUndefinedCheck(dataObj[i].rmsCmtsoRcuInveCnt),
								rmsDuRcuRqrdCnt             : isUndefinedCheck(dataObj[i].rmsDuRcuRqrdCnt),
								rmsDuRcuInveCnt             : isUndefinedCheck(dataObj[i].rmsDuRcuInveCnt),
								rmsIntgRcuRqrdCnt           : isUndefinedCheck(dataObj[i].rmsIntgRcuRqrdCnt),
								rmsIntgRcuInveCnt           : isUndefinedCheck(dataObj[i].rmsIntgRcuInveCnt),
								rmsRcuSlveRqrdCnt           : isUndefinedCheck(dataObj[i].rmsRcuSlveRqrdCnt),
								rmsRcuSlveInveCnt           : isUndefinedCheck(dataObj[i].rmsRcuSlveInveCnt),
								rmsDiRqrdCnt                : isUndefinedCheck(dataObj[i].rmsDiRqrdCnt),
								rmsDiInveCnt                : isUndefinedCheck(dataObj[i].rmsDiInveCnt),
								rmsDoRqrdCnt                : isUndefinedCheck(dataObj[i].rmsDoRqrdCnt),
								rmsDoInveCnt                : isUndefinedCheck(dataObj[i].rmsDoInveCnt),
								rmsRs232RqrdCnt             : isUndefinedCheck(dataObj[i].rmsRs232RqrdCnt),
								rmsRs232InveCnt             : isUndefinedCheck(dataObj[i].rmsRs232InveCnt),
								rmsRs485RqrdCnt             : isUndefinedCheck(dataObj[i].rmsRs485RqrdCnt),
								rmsRs485InveCnt             : isUndefinedCheck(dataObj[i].rmsRs485InveCnt),
								rmsRs422RqrdCnt             : isUndefinedCheck(dataObj[i].rmsRs422RqrdCnt),
								rmsRs422InveCnt             : isUndefinedCheck(dataObj[i].rmsRs422InveCnt),
								rmsWattChnlRqrdCnt          : isUndefinedCheck(dataObj[i].rmsWattChnlRqrdCnt),
								rmsWattChnlInveCnt          : isUndefinedCheck(dataObj[i].rmsWattChnlInveCnt),
								outdrCbntARqrdCnt           : isUndefinedCheck(dataObj[i].outdrCbntARqrdCnt),
								outdrCbntAInveCnt           : isUndefinedCheck(dataObj[i].outdrCbntAInveCnt),
								outdrCbntBRqrdCnt           : isUndefinedCheck(dataObj[i].outdrCbntBRqrdCnt),
								outdrCbntBInveCnt           : isUndefinedCheck(dataObj[i].outdrCbntBInveCnt),
								fextnARqrdCnt               : isUndefinedCheck(dataObj[i].fextnARqrdCnt),
								fextnAInveCnt               : isUndefinedCheck(dataObj[i].fextnAInveCnt),
								fextnBRqrdCnt               : isUndefinedCheck(dataObj[i].fextnBRqrdCnt),
								fextnBInveCnt               : isUndefinedCheck(dataObj[i].fextnBInveCnt),
								spdRqrdCnt                  : isUndefinedCheck(dataObj[i].spdRqrdCnt),
								spdInveCnt                  : isUndefinedCheck(dataObj[i].spdInveCnt),
								outdrCbntACdNm              : isUndefinedCheck(dataObj[i].outdrCbntACdNmCol),
								outdrCbntBCdNm              : isUndefinedCheck(dataObj[i].outdrCbntBCdNmCol),
								rmsRmk                      : isUndefinedCheck(dataObj[i].rmsRmk),
								outdrCbntRmk                : isUndefinedCheck(dataObj[i].outdrCbntRmk),
								fextnRmk                    : isUndefinedCheck(dataObj[i].fextnRmk),
								spdRmk                      : isUndefinedCheck(dataObj[i].spdRmk),





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
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtAdtnExcelUpload', excelSaveDtlList, 'POST', 'saveFctInfo');
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

		if(flag == 'outdrCbntCdNm'){
    		grOutdrCbntCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].namsMatlCd, text : response.codeList[i].etcAttrVal1};
				grOutdrCbntCdNm.push(resObj);
			}
    	}

		if(flag == 'saveFctInfo'){
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

