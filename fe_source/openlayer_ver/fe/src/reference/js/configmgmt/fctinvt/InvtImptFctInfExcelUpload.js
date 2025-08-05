/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var invtIntgPop = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var excelGrid = 'imptFctInfDataGrid';
	var invtParam = "";

	var gAfeYr 		= '';
	var gAfeDgr 	= '';
	var grProgressTotCount 	= 0;
	var grProgressbar 		= 0;

	var grPveRtfV48CdNm		= [];
	var grPveRtfV27CdNm		= [];
	var grSystmLipoCdNm		= [];
	var grSystmBatryCdNm	= [];
	var grPveLipoCdNm		= [];
	var grSystmArcnCdNm		= [];
	var grSystmIpdCdNm		= [];
	var grPveIpdCdNm		= [];

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
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct1', param, 'GET', 'code1');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct2', param, 'GET', 'code2');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct3', param, 'GET', 'code3');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct4', param, 'GET', 'code4');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct5', param, 'GET', 'code5');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct6', param, 'GET', 'code6');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct7', param, 'GET', 'code7');

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
		   		,{fromIndex:3, toIndex:8, title:"기본정보"} // 사용자양식을 위해 추가
				,{fromIndex:9, toIndex:9, title:"총소비전력"} // 최상단 그룹
	   			,{fromIndex:10, toIndex:13, title:"MR-H 정류기 현황"}
	   			,{fromIndex:14, toIndex:17, title:"MR-1 정류기 현황"}
	   			,{fromIndex:18, toIndex:21, title:"MR-2 정류기 현황"}
	   			,{fromIndex:22, toIndex:25, title:"MR-2 정류기 현황"}
	   			,{fromIndex:26, toIndex:29, title:"CRS-1800 정류기 현황"}
	   			,{fromIndex:30, toIndex:31, title:"48V1600 리튬 축전지 현황"}
	   			,{fromIndex:32, toIndex:33, title:"27V3200 리튬 축전지 현황"}
	   			,{fromIndex:34, toIndex:35, title:"납 축전지 현황"}
	   			,{fromIndex:36, toIndex:37, title:"냉방기(층) 현황"}
	   			,{fromIndex:38, toIndex:39, title:"IPD(기존)"}
	   			,{fromIndex:40, toIndex:41, title:"정류기 소요용량[A]"}
	   			,{fromIndex:42, toIndex:43, title:"축전지 소요용량[A]"}
	   			,{fromIndex:44, toIndex:45, title:"냉방기 소요용량[RT]"}
	   			,{fromIndex:46, toIndex:50, title:"정류기 48V 투자(SYSTEM)"}
	   			,{fromIndex:51, toIndex:54, title:"정류기 모듈 48V 투자(SYSTEM)"}
	   			,{fromIndex:55, toIndex:59, title:"정류기 27V 투자(SYSTEM)"}
	   			,{fromIndex:60, toIndex:63, title:"정류기 모듈 27V 투자(SYSTEM)"}
	   			,{fromIndex:64, toIndex:67, title:"제어모듈 투자(SYSTEM)"}

	   			,{fromIndex:68, toIndex:72, title:"정류기 48V 투자(수동)"}
	   			,{fromIndex:73, toIndex:76, title:"정류기 모듈 48V 투자(수동)"}
	   			,{fromIndex:77, toIndex:81, title:"정류기 27V 투자(수동)"}
	   			,{fromIndex:82, toIndex:85, title:"정류기 모듈 27V 투자(수동)"}
	   			,{fromIndex:86, toIndex:89, title:"제어모듈 투자(수동)"}
	   			,{fromIndex:90, toIndex:92, title:"정류기 투자비(천원)"}

	   			,{fromIndex:93, toIndex:97, title:"리튬 축전지 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
	   			,{fromIndex:98, toIndex:101, title:"리튬 모듈 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
	   			,{fromIndex:102, toIndex:106, title:"납 축전지 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'

	   			,{fromIndex:107, toIndex:111, title:"리튬 축전지 투자(수동)"}
	   			,{fromIndex:112, toIndex:115, title:"리튬 모듈 투자(수동)"}
	   			,{fromIndex:116, toIndex:120, title:"납 축전지 투자(수동)"}
	   			,{fromIndex:121, toIndex:123, title:"축전지 투자비(천원)"}

	   			,{fromIndex:124, toIndex:128, title:"냉방기 투자(SYSTEM)"}
	   			,{fromIndex:129, toIndex:133, title:"냉방기 투자(수동)"}
	   			,{fromIndex:134, toIndex:136, title:"냉방기 투자비(천원)"}

	   			,{fromIndex:137, toIndex:141, title:"IPD 투자(SYSTEM)"}
	   			,{fromIndex:142, toIndex:146, title:"IPD 투자(수동)"}
	   			,{fromIndex:147, toIndex:149, title:"IPD 투자비(천원)"}
	   			,{fromIndex:150, toIndex:150, title:"투자비 합계(천원)"}
	   			,{fromIndex:151, toIndex:152, title:"기타"}
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
				{ key : 'bldFlorNo', align:'center', title : '층', width: '40px'},
				{ key : 'newExstDivCd', align:'center', title : '신규/기존', width: '100px'},
				{ key : 'mtsoCntrTypNm', align:'center', title : '국사구분', width: '100px'},



				{ key : 'totCnsmEpwrVal', align:'center', title : '무선+유선[W]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrhSystmCnt', align:'center', title : '시스템 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrhRtfMdulCnt', align:'center', title : '정류모듈 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrhUseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrhMoreCapaVal', align:'center', title : '여유용량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr1SystmCnt', align:'center', title : '시스템 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr1RtfMdulCnt', align:'center', title : '정류모듈 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr1UseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr1MoreCapaVal', align:'center', title : '여유용량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr2SystmCnt', align:'center', title : '시스템 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr2RtfMdulCnt', align:'center', title : '정류모듈 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr2UseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMr2MoreCapaVal', align:'center', title : '여유용량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrsSystmCnt', align:'center', title : '시스템 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrsRtfMdulCnt', align:'center', title : '정류모듈 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrsUseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstMrsMoreCapaVal', align:'center', title : '여유용량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstCrs1800SystmCnt', align:'center', title : '시스템 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstCrs1800RtfMdulCnt', align:'center', title : '정류모듈 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstCrs1800UseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstCrs1800MoreCapaVal', align:'center', title : '여유용량[A]', width: '100px', exportDataType: 'number'},
				{ key : 'exstV48LipoSystmCnt', align:'center', title : '시스템 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstV48LipoMdulCnt', align:'center', title : '모듈 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstV27LipoSystmCnt', align:'center', title : '시스템 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstV27LipoMdulCnt', align:'center', title : '모듈 수', width: '100px', exportDataType: 'number'},
				{ key : 'exstBatrySystmNm', align:'center', title : '시스템 명', width: '120px' },
				{ key : 'exstBatryCellCnt', align:'center', title : '셀 수', width: '80px', exportDataType: 'number'},
				{ key : 'exstArcnFcltsCapaVal', align:'center', title : '시설용량[RT]', width: '100px', exportDataType: 'number'},
				{ key : 'exstArcnCommEpwrVal', align:'center', title : '통신전력[KW]', width: '100px', exportDataType: 'number'},
				{ key : 'exstIpdACnt', align:'center', title : 'IPD-A 수', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.exstIpdACntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'exstIpdBCnt', align:'center', title : 'IPD-B 수', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.exstIpdBCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'calcRtfV48CapaVal', align:'center', title : '48V 기준', width: '80px', exportDataType: 'number'},
				{ key : 'calcRtfV27CapaVal', align:'center', title : '27V 기준', width: '80px', exportDataType: 'number'},
				{ key : 'calcBatryV48CapaVal', align:'center', title : '48V 기준', width: '80px', exportDataType: 'number'},
				{ key : 'calcBatryV27CapaVal', align:'center', title : '27V 기준', width: '80px', exportDataType: 'number'},
				{ key : 'calcArcnNeedCapaVal', align:'center', title : '필요 용량', width: '80px', exportDataType: 'number'},
				{ key : 'calcArcnShtgCapaVal', align:'center', title : '부족 용량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfV48CdNm', align:'center', title : 'TYPE', width: '150px'},
				{ key : 'systmRtfV48Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmRtfV48RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfV48InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmRtfV48InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmRtfV48BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfMdulV48Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmRtfMdulV48RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfMdulV48InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmRtfMdulV48InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmRtfMdulV48BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfV27CdNm', align:'center', title : 'TYPE', width: '150px'},
				{ key : 'systmRtfV27Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmRtfV27RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfV27InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmRtfV27InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmRtfV27BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfMdulV27Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmRtfMdulV27RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmRtfMdulV27InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmRtfMdulV27InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmRtfMdulV27BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmCtrlMdulCd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmCtrlMdulRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmCtrlMdulInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmCtrlMdulInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmCtrlMdulBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'pveRtfV48CdNm', align:'center', title : 'TYPE', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfV48CdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfV48Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveRtfV48RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfV48RqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfV48InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfV48InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfV48BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'pveRtfMdulV48Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveRtfMdulV48RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfMdulV48RqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfMdulV48InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfMdulV48InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfMdulV48BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'pveRtfV27CdNm', align:'center', title : 'TYPE', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfV27CdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfV27Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveRtfV27RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfV27RqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfV27InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfV27InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfV27BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'pveRtfMdulV27Cd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveRtfMdulV27RqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfMdulV27RqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfMdulV27InveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveRtfMdulV27InveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveRtfMdulV27BuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'pveCtrlMdulCd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveCtrlMdulRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveCtrlMdulRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveCtrlMdulInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveCtrlMdulInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveCtrlMdulBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'invtRtfMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'invtRtfCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'invtRtfTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},
				{ key : 'systmLipoCdNm', align:'center', title : 'TYPE', width: '150px'},
				{ key : 'systmLipoCd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmLipoRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmLipoInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmLipoMdulInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmLipoBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmLipoMdulCd', align:'center', title : '코드', width: '80px'},
				{ key : 'systmLipoMdulRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmLipoMdulInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmLipoMdulInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmLipoMdulBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmBatryCdNm', align:'center', title : 'TYPE', width: '150px'},
				{ key : 'systmBatryCd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmBatryRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmBatryInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmBatryInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmBatryBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'pveLipoCdNm', align:'center', title : 'TYPE', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveLipoCdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveLipoCd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveLipoRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveLipoRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveLipoInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveLipoInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveLipoBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'pveLipoMdulCd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveLipoMdulRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveLipoMdulRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveLipoMdulInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveLipoMdulInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveLipoMdulBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'pveBatryCdNm', align:'center', title : 'TYPE', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveBatryCdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveBatryCd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveBatryRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveBatryRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveBatryInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveBatryInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveBatryBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'invtBatryMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'invtBatryCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'invtBatryTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},
				{ key : 'systmArcnCdNm', align:'center', title : 'TYPE', width: '190px'},
				{ key : 'systmArcnCd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmArcnRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmArcnInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmArcnInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmArcnBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'pveArcnCdNm', align:'center', title : 'TYPE', width: '190px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveArcnCdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveArcnCd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveArcnRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveArcnRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveArcnInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveArcnInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveArcnBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},
				{ key : 'invtArcnMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'invtArcnCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'invtArcnTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},
				{ key : 'systmIpdCdNm', align:'center', title : 'TYPE', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmIpdCdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmIpdCd', align:'center', title : '코드', width: '100px'},
				{ key : 'systmIpdRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number'},
				{ key : 'systmIpdInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.systmIpdInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'systmIpdBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'pveIpdCdNm', align:'center', title : 'TYPE', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveIpdCdNmErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveIpdCd', align:'center', title : '코드', width: '100px'},
				{ key : 'pveIpdRqrdCnt', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveIpdRqrdCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveIpdInveCnt', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.pveIpdInveCntErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'pveIpdBuyCnt', align:'center', title : '구매 수량', width: '80px', exportDataType: 'number'},

				{ key : 'invtIpdMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number'},
				{ key : 'invtIpdCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number'},
				{ key : 'invtIpdTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number'},
				{ key : 'invtTotCost', align:'center', title : '정류기+축전지+냉방기+IPD', width: '200px', exportDataType: 'number'},
				{ key : 'etcInsRsn', align:'center', title : '수기입력사유', width: '200px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcInsRsnErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},
				{ key : 'etcRmk', align:'center', title : '비고', width: '200px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcRmkErr); }, background : function(value, data, mapping) { return inlineStyleBackgroundColor;}}},


    			/***********************************************
	   			 * Row Check
	   			***********************************************/
				{ key : 'exstIpdACntErr', align:'center', title : 'IPD-A 수', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'exstIpdBCntErr', align:'center', title : 'IPD-B 수', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmRtfV48InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmRtfMdulV48InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmRtfV27InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmRtfMdulV27InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmCtrlMdulInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfV48CdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveRtfV48CdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveRtfV48RqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfV48InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfMdulV48RqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfMdulV48InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfV27CdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveRtfV27CdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveRtfV27RqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfV27InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfMdulV27RqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveRtfMdulV27InveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveCtrlMdulRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveCtrlMdulInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmLipoCdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'systmLipoCdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'systmLipoInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmLipoMdulInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmBatryCdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'systmBatryCdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'systmBatryInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveLipoCdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveLipoCdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveLipoRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveLipoInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveLipoMdulRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveLipoMdulInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveBatryCdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveBatryCdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveBatryRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveBatryInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmArcnCdNmErr', align:'center', title : 'TYPE', width: '190px', hidden : true},
				{ key : 'systmArcnCdNmCol', align:'center', title : 'TYPE', width: '190px', hidden : true},
				{ key : 'systmArcnInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveArcnCdNmErr', align:'center', title : 'TYPE', width: '190px', hidden : true},
				{ key : 'pveArcnCdNmCol', align:'center', title : 'TYPE', width: '190px', hidden : true},

				{ key : 'pveArcnRqrdCntErr', align:'center', title : '소요 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'pveArcnInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'systmIpdCdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'systmIpdCdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'systmIpdInveCntErr', align:'center', title : '재고 수량', width: '80px', hidden : true},
				{ key : 'pveIpdCdNmErr', align:'center', title : 'TYPE', width: '150px', hidden : true},
				{ key : 'pveIpdCdNmCol', align:'center', title : 'TYPE', width: '150px', hidden : true},

				{ key : 'pveIpdRqrdCntErr', align:'center', title : '소유수량', width: '150px', hidden : true},

				{ key : 'pveIpdInveCntErr', align:'center', title : '재고 수량', width: '80px', exportDataType: 'number', hidden : true},
				{ key : 'etcInsRsnErr', align:'center', title : '수기입력사유', width: '200px', hidden : true},
				{ key : 'etcRmkErr', align:'center', title : '비고', width: '200px', hidden : true},


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
					dataList[i].exstIpdACntErr												= isNaNCheck(dataList[i].exstIpdACnt);
					dataList[i].exstIpdBCntErr                          					= isNaNCheck(dataList[i].exstIpdBCnt);
					dataList[i].systmRtfV48InveCntErr                   					= isNaNCheck(dataList[i].systmRtfV48InveCnt);
					dataList[i].systmRtfMdulV48InveCntErr               					= isNaNCheck(dataList[i].systmRtfMdulV48InveCnt);
					dataList[i].systmRtfV27InveCntErr                   					= isNaNCheck(dataList[i].systmRtfV27InveCnt);
					dataList[i].systmRtfMdulV27InveCntErr               					= isNaNCheck(dataList[i].systmRtfMdulV27InveCnt);
					dataList[i].systmCtrlMdulInveCntErr                 					= isNaNCheck(dataList[i].systmCtrlMdulInveCnt);
					dataList[i].pveRtfV48RqrdCntErr                     					= isNaNCheck(dataList[i].pveRtfV48RqrdCnt);
					dataList[i].pveRtfV48InveCntErr                     					= isNaNCheck(dataList[i].pveRtfV48InveCnt);
					dataList[i].pveRtfMdulV48RqrdCntErr                 					= isNaNCheck(dataList[i].pveRtfMdulV48RqrdCnt);
					dataList[i].pveRtfMdulV48InveCntErr                 					= isNaNCheck(dataList[i].pveRtfMdulV48InveCnt);
					dataList[i].pveRtfV27RqrdCntErr                     					= isNaNCheck(dataList[i].pveRtfV27RqrdCnt);
					dataList[i].pveRtfV27InveCntErr                     					= isNaNCheck(dataList[i].pveRtfV27InveCnt);
					dataList[i].pveRtfMdulV27RqrdCntErr                 					= isNaNCheck(dataList[i].pveRtfMdulV27RqrdCnt);
					dataList[i].pveRtfMdulV27InveCntErr                 					= isNaNCheck(dataList[i].pveRtfMdulV27InveCnt);
					dataList[i].pveCtrlMdulRqrdCntErr                   					= isNaNCheck(dataList[i].pveCtrlMdulRqrdCnt);
					dataList[i].pveCtrlMdulInveCntErr                   					= isNaNCheck(dataList[i].pveCtrlMdulInveCnt);
					dataList[i].systmLipoInveCntErr                     					= isNaNCheck(dataList[i].systmLipoInveCnt);
					dataList[i].systmLipoMdulInveCntErr                 					= isNaNCheck(dataList[i].systmLipoMdulInveCnt);
					dataList[i].systmBatryInveCntErr                    					= isNaNCheck(dataList[i].systmBatryInveCnt);
					dataList[i].pveLipoRqrdCntErr                       					= isNaNCheck(dataList[i].pveLipoRqrdCnt);
					dataList[i].pveLipoInveCntErr                       					= isNaNCheck(dataList[i].pveLipoInveCnt);
					dataList[i].pveLipoMdulRqrdCntErr                   					= isNaNCheck(dataList[i].pveLipoMdulRqrdCnt);
					dataList[i].pveLipoMdulInveCntErr                   					= isNaNCheck(dataList[i].pveLipoMdulInveCnt);
					dataList[i].pveBatryRqrdCntErr                      					= isNaNCheck(dataList[i].pveBatryRqrdCnt);
					dataList[i].pveBatryInveCntErr                      					= isNaNCheck(dataList[i].pveBatryInveCnt);
					dataList[i].systmArcnInveCntErr                     					= isNaNCheck(dataList[i].systmArcnInveCnt);
					dataList[i].pveArcnRqrdCntErr											= isNaNCheck(dataList[i].pveArcnRqrdCnt);
					dataList[i].pveArcnInveCntErr                       					= isNaNCheck(dataList[i].pveArcnInveCnt);
					dataList[i].systmIpdInveCntErr                      					= isNaNCheck(dataList[i].systmIpdInveCnt);

					dataList[i].pveIpdRqrdCntErr                        					= isNaNCheck(dataList[i].pveIpdRqrdCnt);
					dataList[i].pveIpdInveCntErr                        					= isNaNCheck(dataList[i].pveIpdInveCnt);


					/***********************
					 * 코드값으로 정의
					***********************/
					dataList[i].pveRtfV48CdNmErr = "0";
					if(typeof dataList[i].pveRtfV48CdNm != 'undefined' && dataList[i].pveRtfV48CdNm != undefined && dataList[i].pveRtfV48CdNm != ''){
						for (var j = 0; j < grPveRtfV48CdNm.length; j++) {
							dataList[i].pveRtfV48CdNmErr = "1";
							if (dataList[i].pveRtfV48CdNm.toString().trim().replace(/ /gi, '') == grPveRtfV48CdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].pveRtfV48CdNmCol = grPveRtfV48CdNm[j].value;
								dataList[i].pveRtfV48CdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].pveRtfV27CdNmErr = "0";
					if(typeof dataList[i].pveRtfV27CdNm != 'undefined' && dataList[i].pveRtfV27CdNm != undefined && dataList[i].pveRtfV27CdNm != ''){
						for (var j = 0; j < grPveRtfV27CdNm.length; j++) {
							dataList[i].pveRtfV27CdNmErr = "1";
							if (dataList[i].pveRtfV27CdNm.toString().trim().replace(/ /gi, '') == grPveRtfV27CdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].pveRtfV27CdNmCol = grPveRtfV27CdNm[j].value;
								dataList[i].pveRtfV27CdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].systmLipoCdNmErr = "0";
					if(typeof dataList[i].systmLipoCdNm != 'undefined' && dataList[i].systmLipoCdNm != undefined && dataList[i].systmLipoCdNm != ''){
						for (var j = 0; j < grSystmLipoCdNm.length; j++) {
							dataList[i].systmLipoCdNmErr = "1";
							if (dataList[i].systmLipoCdNm.toString().trim().replace(/ /gi, '') == grSystmLipoCdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].systmLipoCdNmCol = grSystmLipoCdNm[j].value;
								dataList[i].systmLipoCdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].systmBatryCdNmErr = "0";
					if(typeof dataList[i].systmBatryCdNm != 'undefined' && dataList[i].systmBatryCdNm != undefined && dataList[i].systmBatryCdNm != ''){
						for (var j = 0; j < grSystmBatryCdNm.length; j++) {
							//console.log("1----"+dataList[i].systmBatryCdNm+"--"+grSystmBatryCdNm[j].value.trim()+"--"+grSystmBatryCdNm[j].text.trim());
							dataList[i].systmBatryCdNmErr = "1";
							if (dataList[i].systmBatryCdNm.toString().trim().replace(/ /gi, '') == grSystmBatryCdNm[j].text.trim().replace(/ /gi, '')) {
								//console.log("2----"+dataList[i].systmBatryCdNm+"--"+grSystmBatryCdNm[j].value.trim()+"--"+grSystmBatryCdNm[j].text.trim());
								dataList[i].systmBatryCdNmCol = grSystmBatryCdNm[j].value;
								dataList[i].systmBatryCdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].pveLipoCdNmErr = "0";
					if(typeof dataList[i].pveLipoCdNm != 'undefined' && dataList[i].pveLipoCdNm != undefined && dataList[i].pveLipoCdNm != ''){
						for (var j = 0; j < grSystmLipoCdNm.length; j++) {
							dataList[i].pveLipoCdNmErr = "1";
							if (dataList[i].pveLipoCdNm.toString().trim().replace(/ /gi, '') == grSystmLipoCdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].pveLipoCdNmCol = grSystmLipoCdNm[j].value;
								dataList[i].pveLipoCdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].pveBatryCdNmErr = "0";
					if(typeof dataList[i].pveBatryCdNm != 'undefined' && dataList[i].pveBatryCdNm != undefined && dataList[i].pveBatryCdNm != ''){
						for (var j = 0; j < grSystmBatryCdNm.length; j++) {
							//console.log("1----"+dataList[i].pveBatryCdNm+"--"+grSystmBatryCdNm[j].value.trim()+"--"+grSystmBatryCdNm[j].text.trim());
							dataList[i].pveBatryCdNmErr = "1";
							if (dataList[i].pveBatryCdNm.toString().trim().replace(/ /gi, '') == grSystmBatryCdNm[j].text.trim().replace(/ /gi, '')) {
								//console.log("2----"+dataList[i].pveBatryCdNm+"--"+grSystmBatryCdNm[j].value.trim()+"--"+grSystmBatryCdNm[j].text.trim());
								dataList[i].pveBatryCdNmCol = grSystmBatryCdNm[j].value;
								dataList[i].pveBatryCdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].systmArcnCdNmErr = "0";
//					if(typeof dataList[i].systmArcnCdNm != 'undefined' && dataList[i].systmArcnCdNm != undefined && dataList[i].systmArcnCdNm != ''){
//						for (var j = 0; j < grSystmArcnCdNm.length; j++) {
//							dataList[i].systmArcnCdNmErr = "1";
//							if (dataList[i].systmArcnCdNm.toString().trim().replace(/ /gi, '') == grSystmArcnCdNm[j].text.trim().replace(/ /gi, '')) {
//								dataList[i].systmArcnCdNmCol = grSystmArcnCdNm[j].value;
//								dataList[i].systmArcnCdNmErr = "0";
//								break;
//							}
//						}
//					}

					dataList[i].pveArcnCdNmErr = "0";
					if(typeof dataList[i].pveArcnCdNm != 'undefined' && dataList[i].pveArcnCdNm != undefined && dataList[i].pveArcnCdNm != ''){
						for (var j = 0; j < grSystmArcnCdNm.length; j++) {
							dataList[i].pveArcnCdNmErr = "1";
							if (dataList[i].pveArcnCdNm.toString().trim().replace(/ /gi, '') == grSystmArcnCdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].pveArcnCdNmCol = grSystmArcnCdNm[j].value;
								dataList[i].pveArcnCdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].systmIpdCdNmErr = "0";
					if(typeof dataList[i].systmIpdCdNm != 'undefined' && dataList[i].systmIpdCdNm != undefined && dataList[i].systmIpdCdNm != ''){
						for (var j = 0; j < grSystmIpdCdNm.length; j++) {
							dataList[i].systmIpdCdNmErr = "1";
							if (dataList[i].systmIpdCdNm.toString().trim().replace(/ /gi, '') == grSystmIpdCdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].systmIpdCdNmCol = grSystmIpdCdNm[j].value;
								dataList[i].systmIpdCdNmErr = "0";
								break;
							}
						}
					}

					dataList[i].pveIpdCdNmErr = "0";
					if(typeof dataList[i].pveIpdCdNm != 'undefined' && dataList[i].pveIpdCdNm != undefined && dataList[i].pveIpdCdNm != ''){
						for (var j = 0; j < grSystmIpdCdNm.length; j++) {
							dataList[i].pveIpdCdNmErr = "1";
							if (dataList[i].pveIpdCdNm.toString().trim().replace(/ /gi, '') == grSystmIpdCdNm[j].text.trim().replace(/ /gi, '')) {
								dataList[i].pveIpdCdNmCol = grSystmIpdCdNm[j].value;
								dataList[i].pveIpdCdNmErr = "0";
								break;
							}
						}
					}


					dataList[i].etcInsRsnErr = "0";
					dataList[i].etcRmkErr = "0";

					dataList[i].systmLipoCdNmErr = '0';
					dataList[i].systmBatryCdNmErr = '0';


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

						dataObj[i].exstIpdACntErr					== '0' &&
						dataObj[i].exstIpdBCntErr                   == '0' &&
						dataObj[i].systmRtfV48InveCntErr            == '0' &&
						dataObj[i].systmRtfMdulV48InveCntErr        == '0' &&
						dataObj[i].systmRtfV27InveCntErr            == '0' &&
						dataObj[i].systmRtfMdulV27InveCntErr        == '0' &&
						dataObj[i].systmCtrlMdulInveCntErr          == '0' &&
						dataObj[i].pveRtfV48CdNmErr                 == '0' &&
						dataObj[i].pveRtfV48RqrdCntErr              == '0' &&
						dataObj[i].pveRtfV48InveCntErr              == '0' &&
						dataObj[i].pveRtfMdulV48RqrdCntErr          == '0' &&
						dataObj[i].pveRtfMdulV48InveCntErr          == '0' &&
						dataObj[i].pveRtfV27CdNmErr                 == '0' &&
						dataObj[i].pveRtfV27RqrdCntErr              == '0' &&
						dataObj[i].pveRtfV27InveCntErr              == '0' &&
						dataObj[i].pveRtfMdulV27RqrdCntErr          == '0' &&
						dataObj[i].pveRtfMdulV27InveCntErr          == '0' &&
						dataObj[i].pveCtrlMdulRqrdCntErr            == '0' &&
						dataObj[i].pveCtrlMdulInveCntErr            == '0' &&
						dataObj[i].systmLipoCdNmErr                 == '0' &&
						dataObj[i].systmLipoInveCntErr              == '0' &&
						dataObj[i].systmLipoMdulInveCntErr          == '0' &&
						dataObj[i].systmBatryCdNmErr                == '0' &&
						dataObj[i].systmBatryInveCntErr             == '0' &&
						dataObj[i].pveLipoCdNmErr                   == '0' &&
						dataObj[i].pveLipoRqrdCntErr                == '0' &&
						dataObj[i].pveLipoInveCntErr                == '0' &&
						dataObj[i].pveLipoMdulRqrdCntErr            == '0' &&
						dataObj[i].pveLipoMdulInveCntErr            == '0' &&
						dataObj[i].pveBatryCdNmErr                  == '0' &&
						dataObj[i].pveBatryRqrdCntErr               == '0' &&
						dataObj[i].pveBatryInveCntErr               == '0' &&
//						dataObj[i].systmArcnCdNmErr                 == '0' &&


						dataObj[i].systmArcnInveCntErr              == '0' &&
						dataObj[i].pveArcnCdNmErr                   == '0' &&
						dataObj[i].pveArcnRqrdCntErr              	== '0' &&
						dataObj[i].pveArcnInveCntErr                == '0' &&
						dataObj[i].systmIpdInveCntErr               == '0' &&
						dataObj[i].pveIpdCdNmErr                    == '0' &&
						dataObj[i].pveIpdRqrdCntErr                 == '0' &&
						dataObj[i].pveIpdInveCntErr                 == '0' &&
						dataObj[i].etcInsRsnErr                     == '0' &&
						dataObj[i].etcRmkErr	                    == '0') {
						var tmpList = {
								fctInvtId 				: isUndefinedCheck(dataObj[i].fctInvtId),
								afeYr 		    		: isUndefinedCheck(dataObj[i].afeYr),
								afeDgr 		    		: isUndefinedCheck(dataObj[i].afeDgr),

								exstIpdACnt				: isUndefinedCheck(dataObj[i].exstIpdACnt),
								exstIpdBCnt            	: isUndefinedCheck(dataObj[i].exstIpdBCnt),
								systmRtfV48InveCnt      : isUndefinedCheck(dataObj[i].systmRtfV48InveCnt),
								systmRtfMdulV48InveCnt  : isUndefinedCheck(dataObj[i].systmRtfMdulV48InveCnt),
								systmRtfV27InveCnt      : isUndefinedCheck(dataObj[i].systmRtfV27InveCnt),
								systmRtfMdulV27InveCnt  : isUndefinedCheck(dataObj[i].systmRtfMdulV27InveCnt),
								systmCtrlMdulInveCnt    : isUndefinedCheck(dataObj[i].systmCtrlMdulInveCnt),
								pveRtfV48RqrdCnt        : isUndefinedCheck(dataObj[i].pveRtfV48RqrdCnt),
								pveRtfV48InveCnt        : isUndefinedCheck(dataObj[i].pveRtfV48InveCnt),
								pveRtfMdulV48RqrdCnt    : isUndefinedCheck(dataObj[i].pveRtfMdulV48RqrdCnt),
								pveRtfMdulV48InveCnt    : isUndefinedCheck(dataObj[i].pveRtfMdulV48InveCnt),
								pveRtfV27RqrdCnt        : isUndefinedCheck(dataObj[i].pveRtfV27RqrdCnt),
								pveRtfV27InveCnt        : isUndefinedCheck(dataObj[i].pveRtfV27InveCnt),
								pveRtfMdulV27RqrdCnt    : isUndefinedCheck(dataObj[i].pveRtfMdulV27RqrdCnt),
								pveRtfMdulV27InveCnt    : isUndefinedCheck(dataObj[i].pveRtfMdulV27InveCnt),
								pveCtrlMdulRqrdCnt      : isUndefinedCheck(dataObj[i].pveCtrlMdulRqrdCnt),
								pveCtrlMdulInveCnt      : isUndefinedCheck(dataObj[i].pveCtrlMdulInveCnt),
								systmLipoInveCnt        : isUndefinedCheck(dataObj[i].systmLipoInveCnt),
								systmLipoMdulInveCnt    : isUndefinedCheck(dataObj[i].systmLipoMdulInveCnt),
								systmBatryInveCnt       : isUndefinedCheck(dataObj[i].systmBatryInveCnt),
								pveLipoRqrdCnt          : isUndefinedCheck(dataObj[i].pveLipoRqrdCnt),
								pveLipoInveCnt          : isUndefinedCheck(dataObj[i].pveLipoInveCnt),
								pveLipoMdulRqrdCnt      : isUndefinedCheck(dataObj[i].pveLipoMdulRqrdCnt),
								pveLipoMdulInveCnt      : isUndefinedCheck(dataObj[i].pveLipoMdulInveCnt),
								pveBatryRqrdCnt         : isUndefinedCheck(dataObj[i].pveBatryRqrdCnt),
								pveBatryInveCnt         : isUndefinedCheck(dataObj[i].pveBatryInveCnt),
								systmArcnInveCnt        : isUndefinedCheck(dataObj[i].systmArcnInveCnt),
								pveArcnRqrdCnt        : isUndefinedCheck(dataObj[i].pveArcnRqrdCnt),
								pveArcnInveCnt          : isUndefinedCheck(dataObj[i].pveArcnInveCnt),
								systmIpdInveCnt         : isUndefinedCheck(dataObj[i].systmIpdInveCnt),
								pveIpdRqrdCnt			: isUndefinedCheck(dataObj[i].pveIpdRqrdCnt),
								pveIpdInveCnt           : isUndefinedCheck(dataObj[i].pveIpdInveCnt),
								etcInsRsn               : isUndefinedCheck(dataObj[i].etcInsRsn),
								etcRmk	                : isUndefinedCheck(dataObj[i].etcRmk),

								pveRtfV48CdNm           : isUndefinedCheck(dataObj[i].pveRtfV48CdNmCol),
								pveRtfV27CdNm           : isUndefinedCheck(dataObj[i].pveRtfV27CdNmCol),
								systmLipoCdNm           : isUndefinedCheck(dataObj[i].systmLipoCdNmCol),
								systmBatryCdNm          : isUndefinedCheck(dataObj[i].systmBatryCdNmCol),
								pveLipoCdNm             : isUndefinedCheck(dataObj[i].pveLipoCdNmCol),
								pveBatryCdNm            : isUndefinedCheck(dataObj[i].pveBatryCdNmCol),
								systmArcnCdNm           : isUndefinedCheck(dataObj[i].systmArcnCdNmCol),
								pveArcnCdNm             : isUndefinedCheck(dataObj[i].pveArcnCdNmCol),
								pveIpdCdNm              : isUndefinedCheck(dataObj[i].pveIpdCdNmCol),

								userId					: userId
						};
						excelSaveDtlList.push(tmpList);
						grProgressTotCount 	+= 1;
					}
				}
			}
			if (excelSaveDtlList == null || excelSaveDtlList == undefined || excelSaveDtlList == "") {
				callMsgBox('','W', '저장 가능한 항목이 없습니다.목록을 확인하시기 바랍니다.' , function(msgId, msgRst){});
			} else {
				callMsgBox('','C', comText, function(msgId, msgRst){
	 		        if (msgRst == 'Y') {
	 		        	$('#'+excelGrid).alopexGrid('showProgress');
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtFctExcelUpload', excelSaveDtlList, 'POST', 'saveFctInfo');
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

		if(flag == 'code1'){
    		grPveRtfV48CdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grPveRtfV48CdNm.push(resObj);
			}
    	}
    	if(flag == 'code2'){
    		grPveRtfV27CdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grPveRtfV27CdNm.push(resObj);
			}
    	}
    	if(flag == 'code5'){
    		grSystmLipoCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmLipoCdNm.push(resObj);
			}
    	}
    	if(flag == 'code4'){
    		grSystmBatryCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmBatryCdNm.push(resObj);
			}
    	}
    	if(flag == 'code6'){
    		grSystmArcnCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmArcnCdNm.push(resObj);
			}
    	}

    	if(flag == 'code7'){
    		grSystmIpdCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmIpdCdNm.push(resObj);
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

