/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var afeDsnPop = $a.page(function() {
	var excelGrid = 'afeDsnDataGrid';
	var invtParam = "";

	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'afeYrInf'); // AFE 년도


		var userId 		= $('#userId').val();
		var paramData 	= {downFlag : 'MTSOINVT', userId : userId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getDownLoadDate', paramData, 'GET', 'downLoadDate'); // AFE 년도


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

	function initGrid() {
		var colList = []

    	colList = [
			{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '120px'
				, inlineStyle : {
					background : function(value, data, mapping) {
						if (data.uploadYn == 'N') {
							return colColorChange("1");
						} else {

							if (data.afeDgrLandCostErr		   	== '3' ||
								data.afeDgrNbdCostErr           == '3' ||
								data.afeDgrLinCdlnCostErr       == '3' ||
								data.afeDgrRprCapexCostErr      == '3' ||
								data.afeDgrRprOperCostErr       == '3' ||
								data.afeDgrBascEnvCostErr       == '3' ||

								data.afeDgrEtcColVal1Err       == '3' ||
								data.afeDgrEtcColVal2Err       == '3' ||
								data.afeDgrEtcColVal3Err       == '3' ||
								data.afeDgrEtcColVal4Err       == '3' ||
								data.afeDgrEtcColVal5Err       == '3' ||
								data.afeDgrEtcColVal6Err       == '3' ||
								data.afeDgrEtcColVal7Err       == '3' ||
								data.afeDgrEtcColVal8Err       == '3' ||
								data.afeDgrEtcColVal9Err       == '3' ||
								data.afeDgrEtcColVal10Err       == '3'
							) {
								return colColorChange("3");
							} else {
								if (data.afeDgrLandCostErr		   	== '2' ||
									data.afeDgrNbdCostErr           == '2' ||
									data.afeDgrLinCdlnCostErr       == '2' ||
									data.afeDgrRprCapexCostErr      == '2' ||
									data.afeDgrRprOperCostErr       == '2' ||
									data.afeDgrBascEnvCostErr       == '2' ||
									data.afeDgrEtcColVal1Err       == '2' ||
									data.afeDgrEtcColVal2Err       == '2' ||
									data.afeDgrEtcColVal3Err       == '2' ||
									data.afeDgrEtcColVal4Err       == '2' ||
									data.afeDgrEtcColVal5Err       == '2' ||
									data.afeDgrEtcColVal6Err       == '2' ||
									data.afeDgrEtcColVal7Err       == '2' ||
									data.afeDgrEtcColVal8Err       == '2' ||
									data.afeDgrEtcColVal9Err       == '2' ||
									data.afeDgrEtcColVal10Err       == '2'
								) {
									return colColorChange("2");
								}
							}
						}

					}
				}
			},		// 숨김
			{ key : 'demdHdofcCd', align:'center', title : '본부', width: '65px' },
   			{ key : 'demdAreaCd', align:'center', title : '지역', width: '65px' },
   			{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px' },
   			{ key : 'floorNm', align:'center', title : '층명', width: '150px'},
			{ key : 'afeYr', align:'center', title : '년도', width: '70px'},
			{ key : 'afeDgr', align:'center', title : '차수', width: '70px'},

			{ key : 'afeDgrTotCost', align:'center', title : '소계', width: '100px',
				render : function(value, data, render, mapping){
					return '-';
				}
			},
			{ key : 'afeDgrLandCost', align:'center', title : '토지', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrLandCostErr); }}},
			{ key : 'afeDgrNbdCost', align:'center', title : '건축', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrNbdCostErr); }}},
			{ key : 'afeDgrLinCdlnCost', align:'center', title : '인입관로', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrLinCdlnCostErr); }}},
			{ key : 'afeDgrRprCapexCost', align:'center', title : '대수선(CapEx)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrRprCapexCostErr); }}},
			{ key : 'afeDgrRprOperCost', align:'center', title : '대수선(OpEx)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrRprOperCostErr); }}},
			{ key : 'afeDgrBascEnvCost', align:'center', title : '기초환경', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrBascEnvCostErr); }}},

			{ key : 'afeDgrEtcColVal1', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal1Err); }}},
			{ key : 'afeDgrEtcColVal2', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal2Err); }}},
			{ key : 'afeDgrEtcColVal3', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal3Err); }}},
			{ key : 'afeDgrEtcColVal4', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal4Err); }}},
			{ key : 'afeDgrEtcColVal5', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal5Err); }}},
			{ key : 'afeDgrEtcColVal6', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal6Err); }}},
			{ key : 'afeDgrEtcColVal7', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal7Err); }}},
			{ key : 'afeDgrEtcColVal8', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal8Err); }}},
			{ key : 'afeDgrEtcColVal9', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal9Err); }}},
			{ key : 'afeDgrEtcColVal10', align:'center', title : '기타', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.afeDgrEtcColVal10Err); }}},



			{ key : 'afeDgrLandCostErr', align:'center', title : '토지', width: '100px', hidden : true},
			{ key : 'afeDgrNbdCostErr', align:'center', title : '건축', width: '100px', hidden : true},
			{ key : 'afeDgrLinCdlnCostErr', align:'center', title : '인입관로', width: '100px', hidden : true},
			{ key : 'afeDgrRprCapexCostErr', align:'center', title : '대수선(CapEx)', width: '100px', hidden : true},
			{ key : 'afeDgrRprOperCostErr', align:'center', title : '대수선(OpEx)', width: '100px', hidden : true},
			{ key : 'afeDgrBascEnvCostErr', align:'center', title : '기초환경', width: '100px', hidden : true},

			{ key : 'afeDgrEtcColVal1Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal2Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal3Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal4Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal5Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal6Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal7Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal8Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal9Err', align:'left', title : '기타', width: '100px', hidden : true},
			{ key : 'afeDgrEtcColVal10Err', align:'left', title : '기타', width: '100px', hidden : true},



			{ key : 'rowDelYn', align:'center', title : 'Row삭제유무', width: '150', hidden : true},
   			{ key : 'uploadYn', align:'center', title : '판정결과', hidden : true}
			];


		var headerMappingN = [
			 {fromIndex:5, toIndex:6, title:"AFE 구분"},
			 {fromIndex:7, toIndex:13, title:"AFE 항목"}
		   ];
    	//그리드 생성
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
			excelWorker :{
				importOption : {
					columnOrderToKey : true
				}
			},
			columnFixUpto : 'floorNm',
			headerGroup : headerMappingN,
			columnMapping: colList,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});
		var param = {grpCd : 'UM000004', mtsoInvtItmVal : 'afeDgrEtcColVal'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'afeDgrEtcHideVal');
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
					dataList[i].afeDgrLandCostErr		   = isNaNCheck(dataList[i].afeDgrLandCost);
					dataList[i].afeDgrNbdCostErr           = isNaNCheck(dataList[i].afeDgrNbdCost);
					dataList[i].afeDgrLinCdlnCostErr       = isNaNCheck(dataList[i].afeDgrLinCdlnCost);
					dataList[i].afeDgrRprCapexCostErr      = isNaNCheck(dataList[i].afeDgrRprCapexCost);
					dataList[i].afeDgrRprOperCostErr       = isNaNCheck(dataList[i].afeDgrRprOperCost);
					dataList[i].afeDgrBascEnvCostErr       = isNaNCheck(dataList[i].afeDgrBascEnvCost);

				}
				$grid.alopexGrid('dataAdd', dataList);
			});
			//$input.val('');

			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDsnDtlList', param, 'GET', 'search');
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
						dataObj[i].afeDgrLandCostErr		   != '3' &&
						dataObj[i].afeDgrNbdCostErr           != '3' &&
						dataObj[i].afeDgrLinCdlnCostErr       != '3' &&
						dataObj[i].afeDgrRprCapexCostErr      != '3' &&
						dataObj[i].afeDgrRprOperCostErr       != '3' &&
						dataObj[i].afeDgrBascEnvCostErr       != '3' &&

						dataObj[i].afeDgrEtcColVal1Err       != '3' &&
						dataObj[i].afeDgrEtcColVal2Err       != '3' &&
						dataObj[i].afeDgrEtcColVal3Err       != '3' &&
						dataObj[i].afeDgrEtcColVal4Err       != '3' &&
						dataObj[i].afeDgrEtcColVal5Err       != '3' &&
						dataObj[i].afeDgrEtcColVal6Err       != '3' &&
						dataObj[i].afeDgrEtcColVal7Err       != '3' &&
						dataObj[i].afeDgrEtcColVal8Err       != '3' &&
						dataObj[i].afeDgrEtcColVal9Err       != '3' &&
						dataObj[i].afeDgrEtcColVal10Err       != '3' && (
						dataObj[i].afeDgrLandCostErr		   == '2' ||
						dataObj[i].afeDgrNbdCostErr           == '2' ||
						dataObj[i].afeDgrLinCdlnCostErr       == '2' ||
						dataObj[i].afeDgrRprCapexCostErr      == '2' ||
						dataObj[i].afeDgrRprOperCostErr       == '2' ||
						dataObj[i].afeDgrBascEnvCostErr       == '2' ||
						dataObj[i].afeDgrEtcColVal1Err       == '2' ||
						dataObj[i].afeDgrEtcColVal2Err       == '2' ||
						dataObj[i].afeDgrEtcColVal3Err       == '2' ||
						dataObj[i].afeDgrEtcColVal4Err       == '2' ||
						dataObj[i].afeDgrEtcColVal5Err       == '2' ||
						dataObj[i].afeDgrEtcColVal6Err       == '2' ||
						dataObj[i].afeDgrEtcColVal7Err       == '2' ||
						dataObj[i].afeDgrEtcColVal8Err       == '2' ||
						dataObj[i].afeDgrEtcColVal9Err       == '2' ||
						dataObj[i].afeDgrEtcColVal10Err      == '2' )) {
						var tmpList = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
								afeDgrLandCost		: isUndefinedCheck(dataObj[i].afeDgrLandCost),
								afeDgrNbdCost     	: isUndefinedCheck(dataObj[i].afeDgrNbdCost),
								afeDgrLinCdlnCost 	: isUndefinedCheck(dataObj[i].afeDgrLinCdlnCost),
								afeDgrRprCapexCost	: isUndefinedCheck(dataObj[i].afeDgrRprCapexCost),
								afeDgrRprOperCost 	: isUndefinedCheck(dataObj[i].afeDgrRprOperCost),
								afeDgrEtcColVal1 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal1),
								afeDgrEtcColVal2 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal2),
								afeDgrEtcColVal3 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal3),
								afeDgrEtcColVal4 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal4),
								afeDgrEtcColVal5 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal5),
								afeDgrEtcColVal6 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal6),
								afeDgrEtcColVal7 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal7),
								afeDgrEtcColVal8 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal8),
								afeDgrEtcColVal9 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal9),
								afeDgrEtcColVal10 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal10),

								afeDgrBascEnvCost 	: isUndefinedCheck(dataObj[i].afeDgrBascEnvCost),


								userId				: userId};
	                    excelSaveDtlList.push(tmpList);
					}
				}
			} else {
				var comText = '<font color=red>업로드 (행)제외</font>에 항목에 <font color=red>체크 해제</font>되어 있습니다.<br>Excel 다운로드 일시 이후 변경된 항목이 있을 수 있습니다.<br><br>업로드 된 Excel 기준으로 저장하시겠습니까?';
				for(var i in dataObj) {
					if (dataObj[i].uploadYn != 'N' && (
						dataObj[i].afeDgrLandCostErr		  == '2' || dataObj[i].afeDgrLandCostErr      		== '3' ||
						dataObj[i].afeDgrNbdCostErr           == '2' || dataObj[i].afeDgrNbdCostErr      		== '3' ||
						dataObj[i].afeDgrLinCdlnCostErr       == '2' || dataObj[i].afeDgrLinCdlnCostErr      	== '3' ||
						dataObj[i].afeDgrRprCapexCostErr      == '2' || dataObj[i].afeDgrRprCapexCostErr      	== '3' ||
						dataObj[i].afeDgrRprOperCostErr       == '2' || dataObj[i].afeDgrRprOperCostErr      	== '3' ||
						dataObj[i].afeDgrBascEnvCostErr       == '2' || dataObj[i].afeDgrBascEnvCostErr      	== '3' ||

						dataObj[i].afeDgrEtcColVal1Err       == '2' || dataObj[i].afeDgrEtcColVal1Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal2Err       == '2' || dataObj[i].afeDgrEtcColVal2Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal3Err       == '2' || dataObj[i].afeDgrEtcColVal3Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal4Err       == '2' || dataObj[i].afeDgrEtcColVal4Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal5Err       == '2' || dataObj[i].afeDgrEtcColVal5Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal6Err       == '2' || dataObj[i].afeDgrEtcColVal6Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal7Err       == '2' || dataObj[i].afeDgrEtcColVal7Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal8Err       == '2' || dataObj[i].afeDgrEtcColVal8Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal9Err       == '2' || dataObj[i].afeDgrEtcColVal9Err      	== '3' ||
						dataObj[i].afeDgrEtcColVal10Err      == '2' || dataObj[i].afeDgrEtcColVal10Err      	== '3' )) {

						var tmpList = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
								afeDgrLandCost		: isUndefinedCheck(dataObj[i].afeDgrLandCost),
								afeDgrNbdCost     	: isUndefinedCheck(dataObj[i].afeDgrNbdCost),
								afeDgrLinCdlnCost 	: isUndefinedCheck(dataObj[i].afeDgrLinCdlnCost),
								afeDgrRprCapexCost	: isUndefinedCheck(dataObj[i].afeDgrRprCapexCost),
								afeDgrRprOperCost 	: isUndefinedCheck(dataObj[i].afeDgrRprOperCost),
								afeDgrBascEnvCost 	: isUndefinedCheck(dataObj[i].afeDgrBascEnvCost),

								afeDgrEtcColVal1 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal1),
								afeDgrEtcColVal2 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal2),
								afeDgrEtcColVal3 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal3),
								afeDgrEtcColVal4 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal4),
								afeDgrEtcColVal5 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal5),
								afeDgrEtcColVal6 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal6),
								afeDgrEtcColVal7 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal7),
								afeDgrEtcColVal8 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal8),
								afeDgrEtcColVal9 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal9),
								afeDgrEtcColVal10 	: isUndefinedCheck(dataObj[i].afeDgrEtcColVal10),

								userId				: userId};
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
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeByMtsoDtlList', excelSaveDtlList, 'POST', 'saveByDtl');
	 		        }
			     });
			}
		});


		$('#downLoadDate').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('showProgress');
			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setByMtsoInfAll', param, 'POST', null);
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDsnDtlList', param, 'GET', 'search');
		});

		$('#afeYr').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('showProgress');
			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setByMtsoInfAll', param, 'POST', null);
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDsnDtlList', param, 'GET', 'search');
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
    		var dbData = response.afeDsnDtlList;

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

				if (dataObj[i].afeYrErr					== '1' ||
					  dataObj[i].afeDgrErr      		== '1' ||
					  dataObj[i].afeDgrLandCostErr	   	== '1' ||
					  dataObj[i].afeDgrNbdCostErr      	== '1' ||
					  dataObj[i].afeDgrLinCdlnCostErr  	== '1' ||
					  dataObj[i].afeDgrRprCapexCostErr 	== '1' ||
					  dataObj[i].afeDgrRprOperCostErr  	== '1' ||
					  dataObj[i].afeDgrBascEnvCostErr  	== '1') {
					$('#'+excelGrid).alopexGrid('dataEdit',{uploadYn:'N'},{mtsoInvtId:dataObj[i].mtsoInvtId, afeYr : dataObj[i].afeYr, afeDgr : dataObj[i].afeDgr});
					continue;
				}


				var ckafeDgrLandCostErr	   		= '0';
				var ckafeDgrNbdCostErr      	= '0';
				var ckafeDgrLinCdlnCostErr  	= '0';
				var ckafeDgrRprCapexCostErr 	= '0';
				var ckafeDgrRprOperCostErr  	= '0';
				var ckafeDgrBascEnvCostErr  	= '0';

				var ckafeDgrEtcColVal1Err  	= '0';
				var ckafeDgrEtcColVal2Err  	= '0';
				var ckafeDgrEtcColVal3Err  	= '0';
				var ckafeDgrEtcColVal4Err  	= '0';
				var ckafeDgrEtcColVal5Err  	= '0';
				var ckafeDgrEtcColVal6Err  	= '0';
				var ckafeDgrEtcColVal7Err  	= '0';
				var ckafeDgrEtcColVal8Err  	= '0';
				var ckafeDgrEtcColVal9Err  	= '0';
				var ckafeDgrEtcColVal10Err	= '0';

				for(var j in dbData) {
					var dBlastChgDate 	= dbData[j].lastChgDate;
					if (dataObj[i].mtsoInvtId == dbData[j].mtsoInvtId && dataObj[i].afeYr == dbData[j].afeYr && dataObj[i].afeDgr == dbData[j].afeDgr && dataObj[i].uploadYn != 'N') {
						ckafeDgrLandCostErr	   		= isExcelToDBCheck(dataObj[i].afeDgrLandCost,       	dbData[j].afeDgrLandCost, 		lastChgDate, 	dBlastChgDate);
						ckafeDgrNbdCostErr     		= isExcelToDBCheck(dataObj[i].afeDgrNbdCost,       		dbData[j].afeDgrNbdCost, 		lastChgDate, 	dBlastChgDate);
						ckafeDgrLinCdlnCostErr 		= isExcelToDBCheck(dataObj[i].afeDgrLinCdlnCost,       	dbData[j].afeDgrLinCdlnCost, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrRprCapexCostErr		= isExcelToDBCheck(dataObj[i].afeDgrRprCapexCost,       dbData[j].afeDgrRprCapexCost, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrRprOperCostErr 		= isExcelToDBCheck(dataObj[i].afeDgrRprOperCost,       	dbData[j].afeDgrRprOperCost, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrBascEnvCostErr 		= isExcelToDBCheck(dataObj[i].afeDgrBascEnvCost,       	dbData[j].afeDgrBascEnvCost, 	lastChgDate, 	dBlastChgDate);

						ckafeDgrEtcColVal1Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal1,       	dbData[j].afeDgrEtcColVal1, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal2Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal2,       	dbData[j].afeDgrEtcColVal2, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal3Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal3,       	dbData[j].afeDgrEtcColVal3, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal4Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal4,       	dbData[j].afeDgrEtcColVal4, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal5Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal5,       	dbData[j].afeDgrEtcColVal5, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal6Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal6,       	dbData[j].afeDgrEtcColVal6, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal7Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal7,       	dbData[j].afeDgrEtcColVal7, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal8Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal8,       	dbData[j].afeDgrEtcColVal8, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal9Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal9,       	dbData[j].afeDgrEtcColVal9, 	lastChgDate, 	dBlastChgDate);
						ckafeDgrEtcColVal10Err 		= isExcelToDBCheck(dataObj[i].afeDgrEtcColVal10,       	dbData[j].afeDgrEtcColVal10, 	lastChgDate, 	dBlastChgDate);

						//dbData.splice(j,1);
						break;
					}
				}
				var tmpColErrData = {
						afeDgrLandCostErr	   		: ckafeDgrLandCostErr,
						afeDgrNbdCostErr     		: ckafeDgrNbdCostErr,
						afeDgrLinCdlnCostErr 		: ckafeDgrLinCdlnCostErr,
						afeDgrRprCapexCostErr		: ckafeDgrRprCapexCostErr,
						afeDgrRprOperCostErr 		: ckafeDgrRprOperCostErr,
						afeDgrBascEnvCostErr 		: ckafeDgrBascEnvCostErr,

						afeDgrEtcColVal1Err  		: ckafeDgrEtcColVal1Err,
						afeDgrEtcColVal2Err  		: ckafeDgrEtcColVal2Err,
						afeDgrEtcColVal3Err  		: ckafeDgrEtcColVal3Err,
						afeDgrEtcColVal4Err  		: ckafeDgrEtcColVal4Err,
						afeDgrEtcColVal5Err  		: ckafeDgrEtcColVal5Err,
						afeDgrEtcColVal6Err  		: ckafeDgrEtcColVal6Err,
						afeDgrEtcColVal7Err  		: ckafeDgrEtcColVal7Err,
						afeDgrEtcColVal8Err  		: ckafeDgrEtcColVal8Err,
						afeDgrEtcColVal9Err  		: ckafeDgrEtcColVal9Err,
						afeDgrEtcColVal10Err 		: ckafeDgrEtcColVal10Err


				};

				$('#'+excelGrid).alopexGrid('dataEdit', tmpColErrData, {mtsoInvtId : dataObj[i].mtsoInvtId, afeYr : dataObj[i].afeYr, afeDgr : dataObj[i].afeDgr});
			}

    		$('#'+excelGrid).alopexGrid("viewUpdate");
    	}



		if(flag == 'afeYrInf'){
			$('#afeYr').clear();
			var option_data = [];
			for(var i=0; i<response.afeYrList.length; i++){
				var resObj = {cd : response.afeYrList[i].afeYr, cdNm : response.afeYrList[i].afeYr+"년도"};
				option_data.push(resObj);
			}
			$('#afeYr').setData({ data : option_data, option_selected: '2020' });

			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setByMtsoInfAll', param, 'POST', null);
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


		if(flag == 'afeDgrEtcHideVal'){
    		for(var j = 1; j < 13; j++){
    			for(var i = 0; i < response.menuHidYn.length; i++){
    				var upWord = response.menuHidYn[i].mtsoInvtItmVal.replace('Afe','afe');
        			if (response.menuHidYn[i].mtsoInvtItmHidYn == 'N') {
        				$('#'+excelGrid).alopexGrid('updateColumn', {title : response.menuHidYn[i].mtsoInvtItmNm}, upWord);
        			} else {
        				$('#'+excelGrid).alopexGrid('updateColumn', {hidden : true}, upWord);
        			}
    			}
    		}

    	}


		if(flag == 'saveByDtl'){
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

