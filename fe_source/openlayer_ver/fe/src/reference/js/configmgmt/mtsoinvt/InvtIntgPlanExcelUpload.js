/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var invtIntgPop = $a.page(function() {
	var excelGrid = 'invtIntgDataGrid';
	var invtParam = "";
	var grNbdG5AcptDivCd	= [];
	var grNbdUpsdShtgRsn	= [];
	var grNbdUpsdRmdyDivCd= [];
	var grAreaInvtYr		= [];
	var grHdqtrInvtYr		= [];
	var grClosMtsoYn		= [];


	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/G5ACPTCD', null, 'GET', 'nbdG5AcptDivList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/UPSDRSN', null, 'GET', 'nbdUpsdShtgRsnList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/RMDYCD', null, 'GET', 'nbdUpsdRmdyDivList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/CLOSYN', null, 'GET', 'closMtsoYnList');


		var userId 		= $('#userId').val();
		var paramData 	= {downFlag : 'PLAN', userId : userId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getDownLoadDate', paramData, 'GET', 'downLoadDate');

		var d = new Date();
		var year = d.getFullYear();
		for(i = year - 30; i < year + 6; i++) {
			var yearObj = {value : i, text : i};
			grAreaInvtYr.push(yearObj);
			grHdqtrInvtYr.push(yearObj);
		}


		var startDate = new Date().format("yyyy-MM-dd");
		//startDate = dateAddRemove('R',startDate, 1);
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
			color = "#3191e8";	// 변경 가능 데이터
			break;
		case "3":
			color = "#ff7e00";	// 기준일 이후 변경 데이터
			break;
		}
		return color;

	}

	function initGrid() {
		var headerMappingN =  [ {fromIndex:5, toIndex:18, title:"국사 신규 및 통폐합"} ,
								{fromIndex:5, toIndex:10, title:"국사 신축 검토"} ,
								{fromIndex:11, toIndex:12, title:"신규/기존 국사명"} ,
								{fromIndex:13, toIndex:18, title:"국사 통폐합"} ];

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

								if (data.nbdG5AcptDivCdErr	  	== '3' ||
									data.nbdG5AcptRsnErr        == '3' ||
									data.nbdUpsdShtgRsnErr 	  	== '3' ||
									data.nbdUpsdRmdyDivCdErr    == '3' ||
									data.areaInvtYrErr          == '3' ||
									data.hdqtrInvtYrErr         == '3' ||
									data.newMtsoNmErr           == '3' ||
									data.exstMtsoNmErr          == '3' ||
									data.closMtsoYnErr		  	== '3' ||
									data.diffMtsoNmErr          == '3' ||
									data.mtsoDiffCostErr        == '3' ||
									data.mtsoLesCostErr         == '3' ||
									data.diffScdleValErr        == '3' ||
									data.rmkErr                 == '3') {
									return colColorChange("3");
								} else {
									if (data.nbdG5AcptDivCdErr	  	== '2' ||
										data.nbdG5AcptRsnErr        == '2' ||
										data.nbdUpsdShtgRsnErr 	  	== '2' ||
										data.nbdUpsdRmdyDivCdErr    == '2' ||
										data.areaInvtYrErr          == '2' ||
										data.hdqtrInvtYrErr         == '2' ||
										data.newMtsoNmErr           == '2' ||
										data.exstMtsoNmErr          == '2' ||
										data.closMtsoYnErr		  	== '2' ||
										data.diffMtsoNmErr          == '2' ||
										data.mtsoDiffCostErr        == '2' ||
										data.mtsoLesCostErr         == '2' ||
										data.diffScdleValErr        == '2' ||
										data.rmkErr                 == '2') {
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
	   			{ key : 'nbdG5AcptDivCd', align:'center', title : '5G수용계획', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.nbdG5AcptDivCdErr); }}},
	   			{ key : 'nbdG5AcptRsn', align:'left', title : '5G 임시수용사유 및 향후계획', width: '250px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.nbdG5AcptRsnErr); }}},
	   			{ key : 'nbdUpsdShtgRsn', align:'center', title : '상면부족사유', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.nbdUpsdShtgRsnErr); }}},
	   			{ key : 'nbdUpsdRmdyDivCd', align:'center', title : '상면부족해소방안', width: '120px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.nbdUpsdRmdyDivCdErr); }}},
	   			{ key : 'areaInvtYr', align:'center', title : '투자시기(지역)', width: '110px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.areaInvtYrErr); }}},
	   			{ key : 'hdqtrInvtYr', align:'center', title : '투자시기(본사)', width: '110px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.hdqtrInvtYrErr);}}},
	   			{ key : 'newMtsoNm', align:'center', title : '신규통합국명', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.newMtsoNmErr);}}},
	   			{ key : 'exstMtsoNm', align:'center', title : '기존통합국명', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.exstMtsoNmErr);}}},
	   			{ key : 'closMtsoYn', align:'center', title : '폐국대상여부', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.closMtsoYnErr);}}},
	   			{ key : 'diffMtsoNm', align:'center', title : '이설국사명', width: '150px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.diffMtsoNmErr);}}},
	   			{ key : 'mtsoDiffCost', align:'center', title : '이설비용(백만원)', width: '120px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.mtsoDiffCostErr);}}},
	   			{ key : 'mtsoLesCost', align:'center', title : '현임차료(백만원/월)', width: '135px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.mtsoLesCostErr);}}},
	   			{ key : 'diffScdleVal', align:'center', title : '이설시기', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.diffScdleValErr);}}},
	   			{ key : 'rmk', align:'left', title : '비고', width: '200px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rmkErr);}}},

	   			{ key : 'intgEtcColVal1', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal2', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal3', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal4', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal5', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal6', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal7', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal8', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal9', align:'center', title : '기타1', width: '100px'},
    			{ key : 'intgEtcColVal10', align:'center', title : '기타1', width: '100px'},


	   			/***********************************************
	   			 * Row Check
	   			***********************************************/
	   			{ key : 'nbdG5AcptDivCdCol', align:'center', title : '5G수용계획 코드', width: '150', hidden : true},
	   			{ key : 'nbdG5AcptDivCdErr', align:'center', title : '5G수용계획', width: '150', hidden : true},
	   			{ key : 'nbdG5AcptRsnErr', align:'center', title : '5G 임시수용사유 및 향후계획', width: '150', hidden : true},
	   			{ key : 'nbdUpsdShtgRsnCol', align:'center', title : '상면부족사유 코드', width: '150', hidden : true},
	   			{ key : 'nbdUpsdShtgRsnErr', align:'center', title : '상면부족사유', width: '150', hidden : true},
	   			{ key : 'nbdUpsdRmdyDivCdCol', align:'center', title : '상면부족해소방안 코드', width: '150', hidden : true},
	   			{ key : 'nbdUpsdRmdyDivCdErr', align:'center', title : '상면부족해소방안', width: '150', hidden : true},
	   			{ key : 'areaInvtYrErr', align:'center', title : '투자시기(지역)', width: '150', hidden : true},
	   			{ key : 'hdqtrInvtYrErr', align:'center', title : '투자시기(본사)', width: '150', hidden : true},
	   			{ key : 'newMtsoNmErr', align:'center', title : '투자시기(본사)', width: '150', hidden : true},
	   			{ key : 'exstMtsoNmErr', align:'center', title : '기존통합국명', width: '150px', hidden : true},
	   			{ key : 'closMtsoYnCol', align:'center', title : '폐국대상여부', width: '100px', hidden : true},
	   			{ key : 'closMtsoYnErr', align:'center', title : '폐국대상여부', width: '100px', hidden : true},
	   			{ key : 'diffMtsoNmErr', align:'center', title : '이설국사명', width: '150px', hidden : true},
	   			{ key : 'mtsoDiffCostErr', align:'center', title : '이설비용(백만원)', width: '150', hidden : true}, //
	   			{ key : 'mtsoLesCostErr', align:'center', title : '현임차료(백만원/월)', width: '150', hidden : true},
	   			{ key : 'diffScdleValErr', align:'center', title : '이설시기', width: '100px', hidden : true},
	   			{ key : 'rmkErr', align:'left', title : '비고', width: '200px', hidden : true},

	   			{ key : 'intgEtcColVal1Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal2Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal3Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal4Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal5Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal6Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal7Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal8Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal9Err', align:'center', title : '기타1', width: '100px', hidden : true},
    			{ key : 'intgEtcColVal10Err', align:'center', title : '기타1', width: '100px', hidden : true},

	   			{ key : 'rowDelYn', align:'center', title : 'Row삭제유무', width: '150', hidden : true},
	   			{ key : 'uploadYn', align:'center', title : '판정결과', hidden : true}
	   		],
	   		message: {
	   		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
       });

		var param = {grpCd : 'UM000005', mtsoInvtItmVal : 'intgEtcColVal'}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'intgHideCol');

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
					dataList[i].areaInvtYrErr 			= isNaNCheck(dataList[i].areaInvtYr);
					dataList[i].hdqtrInvtYrErr 			= isNaNCheck(dataList[i].hdqtrInvtYr);
					dataList[i].mtsoDiffCostErr 		= isNaNCheck(dataList[i].mtsoDiffCost);
					dataList[i].mtsoLesCostErr 			= isNaNCheck(dataList[i].mtsoLesCost);

					/***********************
					 * 코드값으로 정의
					***********************/
					if(typeof dataList[i].nbdG5AcptDivCd != 'undefined' && dataList[i].nbdG5AcptDivCd != undefined && dataList[i].nbdG5AcptDivCd != ''){
						for (var j = 0; j < grNbdG5AcptDivCd.length; j++) {
							dataList[i].nbdG5AcptDivCdErr = "1";
							if (dataList[i].nbdG5AcptDivCd.toString().trim().replace(/ /gi, '') == grNbdG5AcptDivCd[j].text.trim().replace(/ /gi, '')) {
								dataList[i].nbdG5AcptDivCdCol = grNbdG5AcptDivCd[j].value;
								dataList[i].nbdG5AcptDivCdErr = "0";
								break;
							}
						}
					}
					if(typeof dataList[i].nbdUpsdShtgRsn != 'undefined' && dataList[i].nbdUpsdShtgRsn != undefined && dataList[i].nbdUpsdShtgRsn != ''){
						for (var j = 0; j < grNbdUpsdShtgRsn.length; j++) {
							dataList[i].nbdUpsdShtgRsnErr = "1";
							if (dataList[i].nbdUpsdShtgRsn.trim().replace(/ /gi, '') == grNbdUpsdShtgRsn[j].text.trim().replace(/ /gi, '')) {
								dataList[i].nbdUpsdShtgRsnCol = grNbdUpsdShtgRsn[j].value;
								dataList[i].nbdUpsdShtgRsnErr = "0";
								break;
							}
						}
					}
					if(typeof dataList[i].nbdUpsdRmdyDivCd != 'undefined' && dataList[i].nbdUpsdRmdyDivCd != undefined && dataList[i].nbdUpsdRmdyDivCd != ''){
						for (var j = 0; j < grNbdUpsdRmdyDivCd.length; j++) {

							dataList[i].nbdUpsdRmdyDivCdErr = "1";
							if (dataList[i].nbdUpsdRmdyDivCd.trim().replace(/ /gi, '') == grNbdUpsdRmdyDivCd[j].text.trim().replace(/ /gi, '')) {
//								console.log(dataList[i].nbdUpsdRmdyDivCd.trim()+"-----"+grNbdUpsdRmdyDivCd[j].text.trim());
								dataList[i].nbdUpsdRmdyDivCdCol = grNbdUpsdRmdyDivCd[j].value;
								dataList[i].nbdUpsdRmdyDivCdErr = "0";
								break;
							}
						}
					}
					if(typeof dataList[i].closMtsoYn != 'undefined' && dataList[i].closMtsoYn != undefined && dataList[i].closMtsoYn != ''){
						for (var j = 0; j < grClosMtsoYn.length; j++) {
							dataList[i].closMtsoYnErr = "1";
							if (dataList[i].closMtsoYn.trim().replace(/ /gi, '') == grClosMtsoYn[j].text.trim().replace(/ /gi, '')) {
								dataList[i].closMtsoYnCol = grClosMtsoYn[j].value;
								dataList[i].closMtsoYnErr = "0";
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
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getInvtIntgPlanList', param, 'GET', 'search');
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
						dataObj[i].nbdG5AcptDivCdErr	  != '3' &&
						dataObj[i].nbdG5AcptRsnErr        != '3' &&
					    dataObj[i].nbdUpsdShtgRsnErr 	  != '3' &&
					    dataObj[i].nbdUpsdRmdyDivCdErr    != '3' &&
					    dataObj[i].areaInvtYrErr          != '3' &&
					    dataObj[i].hdqtrInvtYrErr         != '3' &&
					    dataObj[i].newMtsoNmErr           != '3' &&
					    dataObj[i].exstMtsoNmErr          != '3' &&
					    dataObj[i].closMtsoYnErr		  != '3' &&
					    dataObj[i].diffMtsoNmErr          != '3' &&
					    dataObj[i].mtsoDiffCostErr        != '3' &&
					    dataObj[i].mtsoLesCostErr         != '3' &&
					    dataObj[i].diffScdleValErr        != '3' &&
					    dataObj[i].rmkErr                 != '3' &&
					    dataObj[i].intgEtcColVal1Err			!= '3' &&
						dataObj[i].intgEtcColVal2Err			!= '3' &&
						dataObj[i].intgEtcColVal3Err			!= '3' &&
						dataObj[i].intgEtcColVal4Err			!= '3' &&
						dataObj[i].intgEtcColVal5Err			!= '3' &&
						dataObj[i].intgEtcColVal6Err			!= '3' &&
						dataObj[i].intgEtcColVal7Err			!= '3' &&
						dataObj[i].intgEtcColVal8Err			!= '3' &&
						dataObj[i].intgEtcColVal9Err			!= '3' &&
						dataObj[i].intgEtcColVal10Err		!= '3' && (
						dataObj[i].nbdG5AcptDivCdErr	  == '2' ||
						dataObj[i].nbdG5AcptRsnErr        == '2' ||
						dataObj[i].nbdUpsdShtgRsnErr 	  == '2' ||
						dataObj[i].nbdUpsdRmdyDivCdErr    == '2' ||
						dataObj[i].areaInvtYrErr          == '2' ||
						dataObj[i].hdqtrInvtYrErr         == '2' ||
						dataObj[i].newMtsoNmErr           == '2' ||
						dataObj[i].exstMtsoNmErr          == '2' ||
						dataObj[i].closMtsoYnErr		  == '2' ||
						dataObj[i].diffMtsoNmErr          == '2' ||
						dataObj[i].mtsoDiffCostErr        == '2' ||
						dataObj[i].mtsoLesCostErr         == '2' ||
						dataObj[i].diffScdleValErr        == '2' ||
						dataObj[i].rmkErr                 == '2' ||
						dataObj[i].intgEtcColVal1Err			== '2' ||
						dataObj[i].intgEtcColVal2Err			== '2' ||
						dataObj[i].intgEtcColVal3Err			== '2' ||
						dataObj[i].intgEtcColVal4Err			== '2' ||
						dataObj[i].intgEtcColVal5Err			== '2' ||
						dataObj[i].intgEtcColVal6Err			== '2' ||
						dataObj[i].intgEtcColVal7Err			== '2' ||
						dataObj[i].intgEtcColVal8Err			== '2' ||
						dataObj[i].intgEtcColVal9Err			== '2' ||
						dataObj[i].intgEtcColVal10Err		== '2' )) {
							var tmpList = {
									mtsoInvtId 				: isUndefinedCheck(dataObj[i].mtsoInvtId),
									nbdG5AcptDivCd			: isUndefinedCheck(dataObj[i].nbdG5AcptDivCdCol),
									nbdG5AcptRsn     	    : isUndefinedCheck(dataObj[i].nbdG5AcptRsn),
									nbdUpsdShtgRsn 		   	: isUndefinedCheck(dataObj[i].nbdUpsdShtgRsnCol),
									nbdUpsdRmdyDivCd	  	: isUndefinedCheck(dataObj[i].nbdUpsdRmdyDivCdCol),
									areaInvtYr        	    : isUndefinedCheck(dataObj[i].areaInvtYr),
									hdqtrInvtYr       	    : isUndefinedCheck(dataObj[i].hdqtrInvtYr),
									newMtsoNm         	    : isUndefinedCheck(dataObj[i].newMtsoNm),
									exstMtsoNm        	    : isUndefinedCheck(dataObj[i].exstMtsoNm),
									closMtsoYn		       	: isUndefinedCheck(dataObj[i].closMtsoYnCol),
									diffMtsoNm        	    : isUndefinedCheck(dataObj[i].diffMtsoNm),
									mtsoDiffCost      	    : isUndefinedCheck(dataObj[i].mtsoDiffCost),
									mtsoLesCost       	    : isUndefinedCheck(dataObj[i].mtsoLesCost),
									diffScdleVal      	    : isUndefinedCheck(dataObj[i].diffScdleVal),
									rmk               	    : isUndefinedCheck(dataObj[i].rmk),

									intgEtcColVal1			: isUndefinedCheck(dataObj[i].intgEtcColVal1),
									intgEtcColVal2			: isUndefinedCheck(dataObj[i].intgEtcColVal2),
									intgEtcColVal3			: isUndefinedCheck(dataObj[i].intgEtcColVal3),
									intgEtcColVal4			: isUndefinedCheck(dataObj[i].intgEtcColVal4),
									intgEtcColVal5			: isUndefinedCheck(dataObj[i].intgEtcColVal5),
									intgEtcColVal6			: isUndefinedCheck(dataObj[i].intgEtcColVal6),
									intgEtcColVal7			: isUndefinedCheck(dataObj[i].intgEtcColVal7),
									intgEtcColVal8			: isUndefinedCheck(dataObj[i].intgEtcColVal8),
									intgEtcColVal9			: isUndefinedCheck(dataObj[i].intgEtcColVal9),
									intgEtcColVal10 		: isUndefinedCheck(dataObj[i].intgEtcColVal10),

									userId 					: userId,
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
						dataObj[i].nbdG5AcptDivCdErr	  == '2' || dataObj[i].nbdG5AcptDivCdErr	  == '3' ||
						dataObj[i].nbdG5AcptRsnErr        == '2' || dataObj[i].nbdG5AcptRsnErr        == '3' ||
						dataObj[i].nbdUpsdShtgRsnErr 	  == '2' || dataObj[i].nbdUpsdShtgRsnErr 	  == '3' ||
						dataObj[i].nbdUpsdRmdyDivCdErr    == '2' || dataObj[i].nbdUpsdRmdyDivCdErr    == '3' ||
						dataObj[i].areaInvtYrErr          == '2' || dataObj[i].areaInvtYrErr          == '3' ||
						dataObj[i].hdqtrInvtYrErr         == '2' || dataObj[i].hdqtrInvtYrErr         == '3' ||
						dataObj[i].newMtsoNmErr           == '2' || dataObj[i].newMtsoNmErr           == '3' ||
						dataObj[i].exstMtsoNmErr          == '2' || dataObj[i].exstMtsoNmErr          == '3' ||
						dataObj[i].closMtsoYnErr		  == '2' || dataObj[i].closMtsoYnErr		  == '3' ||
						dataObj[i].diffMtsoNmErr          == '2' || dataObj[i].diffMtsoNmErr          == '3' ||
						dataObj[i].mtsoDiffCostErr        == '2' || dataObj[i].mtsoDiffCostErr        == '3' ||
						dataObj[i].mtsoLesCostErr         == '2' || dataObj[i].mtsoLesCostErr         == '3' ||
						dataObj[i].diffScdleValErr        == '2' || dataObj[i].diffScdleValErr        == '3' ||
						dataObj[i].rmkErr                 == '2' || dataObj[i].rmkErr        			== '3' ||
						dataObj[i].intgEtcColVal1Err	  	== '2' || dataObj[i].intgEtcColVal1Err	  	== '3' ||
						dataObj[i].intgEtcColVal2Err		== '2' || dataObj[i].intgEtcColVal2Err		== '3' ||
						dataObj[i].intgEtcColVal3Err		== '2' || dataObj[i].intgEtcColVal3Err		== '3' ||
						dataObj[i].intgEtcColVal4Err		== '2' || dataObj[i].intgEtcColVal4Err		== '3' ||
						dataObj[i].intgEtcColVal5Err		== '2' || dataObj[i].intgEtcColVal5Err		== '3' ||
						dataObj[i].intgEtcColVal6Err		== '2' || dataObj[i].intgEtcColVal6Err		== '3' ||
						dataObj[i].intgEtcColVal7Err		== '2' || dataObj[i].intgEtcColVal7Err		== '3' ||
						dataObj[i].intgEtcColVal8Err		== '2' || dataObj[i].intgEtcColVal8Err		== '3' ||
						dataObj[i].intgEtcColVal9Err		== '2' || dataObj[i].intgEtcColVal9Err		== '3' ||
						dataObj[i].intgEtcColVal10Err		== '2' || dataObj[i].intgEtcColVal10Err		== '3' )) {
						var tmpList = {
								mtsoInvtId 				: isUndefinedCheck(dataObj[i].mtsoInvtId),
								nbdG5AcptDivCd			: isUndefinedCheck(dataObj[i].nbdG5AcptDivCdCol),
								nbdG5AcptRsn     	    : isUndefinedCheck(dataObj[i].nbdG5AcptRsn),
								nbdUpsdShtgRsn 		   	: isUndefinedCheck(dataObj[i].nbdUpsdShtgRsnCol),
								nbdUpsdRmdyDivCd	  	: isUndefinedCheck(dataObj[i].nbdUpsdRmdyDivCdCol),
								areaInvtYr        	    : isUndefinedCheck(dataObj[i].areaInvtYr),
								hdqtrInvtYr       	    : isUndefinedCheck(dataObj[i].hdqtrInvtYr),
								newMtsoNm         	    : isUndefinedCheck(dataObj[i].newMtsoNm),
								exstMtsoNm        	    : isUndefinedCheck(dataObj[i].exstMtsoNm),
								closMtsoYn		       	: isUndefinedCheck(dataObj[i].closMtsoYnCol),
								diffMtsoNm        	    : isUndefinedCheck(dataObj[i].diffMtsoNm),
								mtsoDiffCost      	    : isUndefinedCheck(dataObj[i].mtsoDiffCost),
								mtsoLesCost       	    : isUndefinedCheck(dataObj[i].mtsoLesCost),
								diffScdleVal      	    : isUndefinedCheck(dataObj[i].diffScdleVal),
								rmk               	    : isUndefinedCheck(dataObj[i].rmk),

								intgEtcColVal1			: isUndefinedCheck(dataObj[i].intgEtcColVal1),
								intgEtcColVal2			: isUndefinedCheck(dataObj[i].intgEtcColVal2),
								intgEtcColVal3			: isUndefinedCheck(dataObj[i].intgEtcColVal3),
								intgEtcColVal4			: isUndefinedCheck(dataObj[i].intgEtcColVal4),
								intgEtcColVal5			: isUndefinedCheck(dataObj[i].intgEtcColVal5),
								intgEtcColVal6			: isUndefinedCheck(dataObj[i].intgEtcColVal6),
								intgEtcColVal7			: isUndefinedCheck(dataObj[i].intgEtcColVal7),
								intgEtcColVal8			: isUndefinedCheck(dataObj[i].intgEtcColVal8),
								intgEtcColVal9			: isUndefinedCheck(dataObj[i].intgEtcColVal9),
								intgEtcColVal10 		: isUndefinedCheck(dataObj[i].intgEtcColVal10),

								userId 					: userId,
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
//				console.log(excelSaveDtlList);
				callMsgBox('','C', comText, function(msgId, msgRst){
	 		        if (msgRst == 'Y') {
	 		        	$('#'+excelGrid).alopexGrid('showProgress');
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeInvtIntgPlanList', excelSaveDtlList, 'POST', 'saveIntgPlan');
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
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getInvtIntgPlanList', param, 'GET', 'search');
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
    		var dbData = response.invtIntgPlanList;
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

				if (dataObj[i].nbdG5AcptDivCdErr 	== "1" ||
					dataObj[i].nbdUpsdShtgRsnErr 	== "1" ||
					dataObj[i].nbdUpsdRmdyDivCdErr 	== "1" ||
					dataObj[i].closMtsoYnErr 		== "1" ||
					dataObj[i].areaInvtYrErr 		== "1" ||
					dataObj[i].hdqtrInvtrYrErr 		== "1" ||
					dataObj[i].mtsoDiffCostErr 		== "1" ||
					dataObj[i].mtsoLesCostErr 		== "1") {
					$('#'+excelGrid).alopexGrid('dataEdit',{uploadYn:'N'},{mtsoInvtId:dataObj[i].mtsoInvtId});
					continue;
				}


	   			var cKnbdG5AcptDivCdErr				= '0';
	   			var cKnbdG5AcptRsnErr               = '0';
	   			var cKnbdUpsdShtgRsnErr             = '0';
	   			var cKnbdUpsdRmdyDivCdErr           = '0';
	   			var cKareaInvtYrErr                 = '0';
	   			var cKhdqtrInvtYrErr                = '0';
	   			var cKnewMtsoNmErr                  = '0';
	   			var cKexstMtsoNmErr                 = '0';
	   			var cKclosMtsoYnErr                 = '0';
	   			var cKdiffMtsoNmErr                 = '0';
	   			var cKmtsoDiffCostErr               = '0';
	   			var cKmtsoLesCostErr                = '0';
	   			var cKdiffScdleValErr               = '0';
	   			var ckctrtEpwrValErr                = '0';
	   			var cKrmkErr                        = '0';

	   			var cKintgEtcColVal1Err                        = '0';
	   			var cKintgEtcColVal2Err                        = '0';
	   			var cKintgEtcColVal3Err                        = '0';
	   			var cKintgEtcColVal4Err                        = '0';
	   			var cKintgEtcColVal5Err                        = '0';
	   			var cKintgEtcColVal6Err                        = '0';
	   			var cKintgEtcColVal7Err                        = '0';
	   			var cKintgEtcColVal8Err                        = '0';
	   			var cKintgEtcColVal9Err                        = '0';
	   			var cKintgEtcColVal10Err                        = '0';


				for(var j in dbData) {
					var dBlastChgDate = dbData[j].lastChgDate;
					if (dataObj[i].mtsoInvtId == dbData[j].mtsoInvtId && dataObj[i].uploadYn != 'N') {
						cKnbdG5AcptDivCdErr 		= isExcelToDBCheck(dataObj[i].nbdG5AcptDivCdCol, 	dbData[j].nbdG5AcptDivCd, 		lastChgDate, dBlastChgDate);
						cKnbdG5AcptRsnErr 			= isExcelToDBCheck(dataObj[i].nbdG5AcptRsn, 		dbData[j].nbdG5AcptRsn, 		lastChgDate, dBlastChgDate);
						cKnbdUpsdShtgRsnErr 		= isExcelToDBCheck(dataObj[i].nbdUpsdShtgRsnCol, 	dbData[j].nbdUpsdShtgRsn, 		lastChgDate, dBlastChgDate);
						cKnbdUpsdRmdyDivCdErr		= isExcelToDBCheck(dataObj[i].nbdUpsdRmdyDivCdCol,	dbData[j].nbdUpsdRmdyDivCd, 	lastChgDate, dBlastChgDate);
						cKareaInvtYrErr 			= isExcelToDBCheck(dataObj[i].areaInvtYr, 			dbData[j].areaInvtYr, 			lastChgDate, dBlastChgDate);
						cKhdqtrInvtYrErr 			= isExcelToDBCheck(dataObj[i].hdqtrInvtYr, 			dbData[j].hdqtrInvtYr, 			lastChgDate, dBlastChgDate);
						cKnewMtsoNmErr 				= isExcelToDBCheck(dataObj[i].newMtsoNm, 			dbData[j].newMtsoNm, 			lastChgDate, dBlastChgDate);
						cKexstMtsoNmErr 			= isExcelToDBCheck(dataObj[i].exstMtsoNm, 			dbData[j].exstMtsoNm, 			lastChgDate, dBlastChgDate);
						cKclosMtsoYnErr	 			= isExcelToDBCheck(dataObj[i].closMtsoYnCol, 		dbData[j].closMtsoYn, 			lastChgDate, dBlastChgDate);
						cKdiffMtsoNmErr 			= isExcelToDBCheck(dataObj[i].diffMtsoNm, 			dbData[j].diffMtsoNm, 			lastChgDate, dBlastChgDate);
						cKmtsoDiffCostErr 			= isExcelToDBCheck(dataObj[i].mtsoDiffCost, 		dbData[j].mtsoDiffCost, 		lastChgDate, dBlastChgDate);
						cKmtsoLesCostErr 			= isExcelToDBCheck(dataObj[i].mtsoLesCost, 			dbData[j].mtsoLesCost, 			lastChgDate, dBlastChgDate);
						cKdiffScdleValErr 			= isExcelToDBCheck(dataObj[i].diffScdleVal, 		dbData[j].diffScdleVal, 		lastChgDate, dBlastChgDate);
						ckctrtEpwrValErr 			= isExcelToDBCheck(dataObj[i].ctrtEpwrVal, 			dbData[j].ctrtEpwrVal, 			lastChgDate, dBlastChgDate);
						cKrmkErr 					= isExcelToDBCheck(dataObj[i].rmk, 					dbData[j].invtIntgRmk, 			lastChgDate, dBlastChgDate);

						cKintgEtcColVal1Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal1, 					dbData[j].intgEtcColVal1, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal2Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal2, 					dbData[j].intgEtcColVal2, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal3Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal3, 					dbData[j].intgEtcColVal3, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal4Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal4, 					dbData[j].intgEtcColVal4, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal5Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal5, 					dbData[j].intgEtcColVal5, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal6Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal6, 					dbData[j].intgEtcColVal6, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal7Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal7, 					dbData[j].intgEtcColVal7, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal8Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal8, 					dbData[j].intgEtcColVal8, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal9Err        = isExcelToDBCheck(dataObj[i].intgEtcColVal9, 					dbData[j].intgEtcColVal9, 			lastChgDate, dBlastChgDate);
			   			cKintgEtcColVal10Err       = isExcelToDBCheck(dataObj[i].intgEtcColVal10, 					dbData[j].intgEtcColVal10, 			lastChgDate, dBlastChgDate);



						//dbData.splice(j,1);
						break;
					}
				}
				var tmpColErrData = {
						nbdG5AcptDivCdErr 		: cKnbdG5AcptDivCdErr,
				        nbdG5AcptRsnErr 		: cKnbdG5AcptRsnErr,
						nbdUpsdShtgRsnErr 		: cKnbdUpsdShtgRsnErr,
						nbdUpsdRmdyDivCdErr		: cKnbdUpsdRmdyDivCdErr,
						areaInvtYrErr 			: cKareaInvtYrErr,
						hdqtrInvtYrErr 			: cKhdqtrInvtYrErr,
						newMtsoNmErr 			: cKnewMtsoNmErr,
						exstMtsoNmErr 			: cKexstMtsoNmErr,
						closMtsoYnErr	 		: cKclosMtsoYnErr,
						diffMtsoNmErr 			: cKdiffMtsoNmErr,
						mtsoDiffCostErr 		: cKmtsoDiffCostErr,
						mtsoLesCostErr 			: cKmtsoLesCostErr,
						diffScdleValErr 		: cKdiffScdleValErr,
						ctrtEpwrValErr 			: ckctrtEpwrValErr,
						rmkErr 					: cKrmkErr,

						intgEtcColVal1Err  		: cKintgEtcColVal1Err,
						intgEtcColVal2Err       : cKintgEtcColVal2Err,
						intgEtcColVal3Err       : cKintgEtcColVal3Err,
						intgEtcColVal4Err       : cKintgEtcColVal4Err,
						intgEtcColVal5Err       : cKintgEtcColVal5Err,
						intgEtcColVal6Err       : cKintgEtcColVal6Err,
						intgEtcColVal7Err       : cKintgEtcColVal7Err,
						intgEtcColVal8Err       : cKintgEtcColVal8Err,
						intgEtcColVal9Err       : cKintgEtcColVal9Err,
						intgEtcColVal10Err      : cKintgEtcColVal10Err
				}

				$('#'+excelGrid).alopexGrid('dataEdit', tmpColErrData, {mtsoInvtId : dataObj[i].mtsoInvtId});

			}

    		$('#'+excelGrid).alopexGrid("viewUpdate");
    	}

		// 5G수용계획
    	if(flag == 'nbdG5AcptDivList'){
    		grNbdG5AcptDivCd 		= [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grNbdG5AcptDivCd.push(resObj);
			}
    	}
    	// 상면부족사유
    	if(flag == 'nbdUpsdShtgRsnList'){
    		grNbdUpsdShtgRsn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grNbdUpsdShtgRsn.push(resObj);
			}
    	}
    	// 상면부족해소방안
    	if(flag == 'nbdUpsdRmdyDivList'){
    		grNbdUpsdRmdyDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grNbdUpsdRmdyDivCd.push(resObj);
			}
    	}
    	//폐국대상여부
    	if(flag == 'closMtsoYnList'){
    		grClosMtsoYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grClosMtsoYn.push(resObj);
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


    	if(flag == 'saveIntgPlan'){
    		$a.close();
    	}

    	if(flag == 'intgHideCol'){
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
		if(flag == 'saveIntgPlan'){
			callMsgBox('','W', "엑설 저장 중 오류가 발생하였습니다. 엑셀파일을 다시 한번 점검해 주시기 바랍니다.", function(msgId, msgRst){});
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

