/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var UploadPop = $a.page(function() {
	var excelGrid = 'g5AfeDsnDataGrid';
	var invtParam = "";

	var shtgItmCd		= [];

	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
	};
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'afeYrInf'); // AFE 년도

		var userId 		= $('#userId').val();
		var paramData 	= {downFlag : 'G5AFE', userId : userId};
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

	function initGrid() {
		var colList = []

    	colList = [
			{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '120px'
				, inlineStyle : {
					background : function(value, data, mapping) {
						if (data.uploadYn == 'N') {
							return colColorChange("1");
						} else {

							if (data.sysDuhCntErr			== '3' ||
								//data.sysRotnCntErr      	== '3' ||
								data.sysIvrCntErr       	== '3' ||
								data.sysIvrrCntErr      	== '3' ||
								data.sysRtfCntErr       	== '3' ||
								data.sysBatryCntErr     	== '3' ||
								data.sysCbplCntErr      	== '3' ||
								data.sysArcnCntErr      	== '3' ||
								data.sysEtcEqpFstCntErr 	== '3' ||
								data.sysEtcEqpScndCntErr	== '3' ||
								data.sysEtcEqpThrdCntErr	== '3' ||
								data.sysEtcEqpFothCntErr	== '3' ||
								data.sysEtcEqpFithCntErr	== '3' ||
								data.duhDuhCntErr       	== '3' ||
								data.duhRotnCntErr      	== '3' ||
								data.duhIvcCntErr       	== '3' ||
								data.duhIvrCntErr       	== '3' ||
								data.duhIvrrCntErr      	== '3' ||
								data.rlyRotnCntErr      	== '3' ||
								data.rlyIvcCntErr       	== '3' ||
								data.rlyIvrCntErr       	== '3' ||
								data.rlyIvrrCntErr      	== '3' ||
								data.repceIvcCntErr     	== '3' ||
								data.repceIvrCntErr     	== '3' ||
								data.repceIvrrCntErr    	== '3' ||
								data.rtfCntErr          	== '3' ||
								data.batryCntErr        	== '3' ||
								data.cbplCntErr         	== '3' ||
								data.arcnCntErr         	== '3' ||
								data.etcEqpFstCntErr      	== '3' ||
								data.etcEqpScndCntErr     	== '3' ||
								data.etcEqpThrdCntErr     	== '3' ||
								data.etcEqpFothCntErr     	== '3' ||
								data.etcEqpFithCntErr     	== '3' ||

								data.etcEqp6Err     	== '3' ||
								data.etcEqp7Err     	== '3' ||
								data.etcEqp8Err     	== '3' ||
								data.etcEqp9Err     	== '3' ||
								data.etcEqp10Err     	== '3' ) {
								return colColorChange("3");
							} else {
								if (data.sysDuhCntErr			== '2' ||
									//data.sysRotnCntErr      	== '2' ||
									data.sysIvrCntErr       	== '2' ||
									data.sysIvrrCntErr      	== '2' ||
									data.sysRtfCntErr       	== '2' ||
									data.sysBatryCntErr     	== '2' ||
									data.sysCbplCntErr      	== '2' ||
									data.sysArcnCntErr      	== '2' ||
									data.sysEtcEqpFstCntErr 	== '2' ||
									data.sysEtcEqpScndCntErr	== '2' ||
									data.sysEtcEqpThrdCntErr	== '2' ||
									data.sysEtcEqpFothCntErr	== '2' ||
									data.sysEtcEqpFithCntErr	== '2' ||
									data.duhDuhCntErr       	== '2' ||
									data.duhRotnCntErr      	== '2' ||
									data.duhIvcCntErr       	== '2' ||
									data.duhIvrCntErr       	== '2' ||
									data.duhIvrrCntErr      	== '2' ||
									data.rlyRotnCntErr      	== '2' ||
									data.rlyIvcCntErr       	== '2' ||
									data.rlyIvrCntErr       	== '2' ||
									data.rlyIvrrCntErr      	== '2' ||
									data.repceIvcCntErr     	== '2' ||
									data.repceIvrCntErr     	== '2' ||
									data.repceIvrrCntErr    	== '2' ||
									data.rtfCntErr          	== '2' ||
									data.batryCntErr        	== '2' ||
									data.cbplCntErr         	== '2' ||
									data.arcnCntErr         	== '2' ||
									data.etcEqpFstCntErr      	== '2' ||
									data.etcEqpScndCntErr     	== '2' ||
									data.etcEqpThrdCntErr     	== '2' ||
									data.etcEqpFothCntErr     	== '2' ||
									data.etcEqpFithCntErr     	== '2' ||
									data.etcEqp6Err     		== '2' ||
									data.etcEqp7Err     		== '2' ||
									data.etcEqp8Err     		== '2' ||
									data.etcEqp9Err     		== '2' ||
									data.etcEqp10Err     		== '2') {
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

			{ key : 'sysDuhCnt', align:'center', title : 'DUH(식수)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysDuhCntErr); }}},
			//{ key : 'sysRotnCnt', align:'center', title : 'ROTN', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysRotnCntErr); }}},
			{ key : 'sysIvrCnt', align:'center', title : 'IVR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysIvrCntErr); }}},
			{ key : 'sysIvrrCnt', align:'center', title : 'IVRR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysIvrrCntErr); }}},
			{ key : 'sysRtfCnt', align:'center', title : '정류기', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysRtfCntErr); }}},
			{ key : 'sysBatryCnt', align:'center', title : '축전지', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysBatryCntErr); }}},
			{ key : 'sysCbplCnt', align:'center', title : '분전반', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysCbplCntErr); }}},
			{ key : 'sysArcnCnt', align:'center', title : '냉방기', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysArcnCntErr); }}},
			{ key : 'sysEtcEqpFstCnt', align:'center', title : '기타1', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysEtcEqpFstCntErr); }}},
			{ key : 'sysEtcEqpScndCnt', align:'center', title : '기타2', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysEtcEqpScndCntErr); }}},
			{ key : 'sysEtcEqpThrdCnt', align:'center', title : '기타3', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysEtcEqpThrdCntErr); }}},
			{ key : 'sysEtcEqpFothCnt', align:'center', title : '기타4', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysEtcEqpFothCntErr); }}},
			{ key : 'sysEtcEqpFithCnt', align:'center', title : '기타5', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.sysEtcEqpFithCntErr); }}},
			{ key : 'duhDuhCnt', align:'center', title : 'DUH(식수)', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.duhDuhCntErr); }}},
			{ key : 'duhRotnCnt', align:'center', title : 'ROTN', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.duhRotnCntErr); }}},
			{ key : 'duhIvcCnt', align:'center', title : 'IVC', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.duhIvcCntErr); }}},
			{ key : 'duhIvrCnt', align:'center', title : 'IVR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.duhIvrCntErr); }}},
			{ key : 'duhIvrrCnt', align:'center', title : 'IVRR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.duhIvrrCntErr); }}},
			{ key : 'rlyRotnCnt', align:'center', title : 'ROTN', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rlyRotnCntErr); }}},
			{ key : 'rlyIvcCnt', align:'center', title : 'IVC', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rlyIvcCntErr); }}},
			{ key : 'rlyIvrCnt', align:'center', title : 'IVR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rlyIvrCntErr); }}},
			{ key : 'rlyIvrrCnt', align:'center', title : 'IVRR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rlyIvrrCntErr); }}},
			{ key : 'repceIvcCnt', align:'center', title : 'IVC', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.repceIvcCntErr); }}},
			{ key : 'repceIvrCnt', align:'center', title : 'IVR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.repceIvrCntErr); }}},
			{ key : 'repceIvrrCnt', align:'center', title : 'IVRR', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.repceIvrrCntErr); }}},
			{ key : 'rtfCnt', align:'center', title : '정류기', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.rtfCntErr); }}},
			{ key : 'batryCnt', align:'center', title : '축전지', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.batryCntErr); }}},
			{ key : 'cbplCnt', align:'center', title : '분전반', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.cbplCntErr); }}},
			{ key : 'arcnCnt', align:'center', title : '냉방기', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.arcnCntErr); }}},
			{ key : 'etcEqpFstCnt', align:'center', title : '기타1', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqpFstCntErr); }}},
			{ key : 'etcEqpScndCnt', align:'center', title : '기타2', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqpScndCntErr); }}},
			{ key : 'etcEqpThrdCnt', align:'center', title : '기타3', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqpThrdCntErr); }}},
			{ key : 'etcEqpFothCnt', align:'center', title : '기타4', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqpFothCntErr); }}},
			{ key : 'etcEqpFithCnt', align:'center', title : '기타5', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqpFithCntErr); }}},

			{ key : 'etcEqp6', align:'left', title : '기타6', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqp6Err); }}},
			{ key : 'etcEqp7', align:'left', title : '기타7', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqp7Err); }}},
			{ key : 'etcEqp8', align:'left', title : '기타8', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqp8Err); }}},
			{ key : 'etcEqp9', align:'left', title : '기타9', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqp9Err); }}},
			{ key : 'etcEqp10', align:'left', title : '기타10', width: '100px', inlineStyle : { color : function(value, data, mapping){ return colColorChange(data.etcEqp10Err); }}},




			{ key : 'afeYrErr', align:'center', title : '년도', width: '70px', hidden : true},
			{ key : 'afeDgrErr', align:'center', title : '차수', width: '70px', hidden : true},
			{ key : 'sysDuhCntErr', align:'center', title : 'DUH(식수)', width: '100px', hidden : true},
			//{ key : 'sysRotnCntErr', align:'center', title : 'ROTN', width: '100px', hidden : true},
			{ key : 'sysIvrCntErr', align:'center', title : 'IVR', width: '100px', hidden : true},
			{ key : 'sysIvrrCntErr', align:'center', title : 'IVRR', width: '100px', hidden : true},
			{ key : 'sysRtfCntErr', align:'center', title : '정류기', width: '100px', hidden : true},
			{ key : 'sysBatryCntErr', align:'center', title : '축전지', width: '100px', hidden : true},
			{ key : 'sysCbplCntErr', align:'center', title : '분전반', width: '100px', hidden : true},
			{ key : 'sysArcnCntErr', align:'center', title : '냉방기', width: '100px', hidden : true},
			{ key : 'sysEtcEqpFstCntErr', align:'center', title : '기타1', width: '100px', hidden : true},
			{ key : 'sysEtcEqpScndCntErr', align:'center', title : '기타2', width: '100px', hidden : true},
			{ key : 'sysEtcEqpThrdCntErr', align:'center', title : '기타3', width: '100px', hidden : true},
			{ key : 'sysEtcEqpFothCntErr', align:'center', title : '기타4', width: '100px', hidden : true},
			{ key : 'sysEtcEqpFithCntErr', align:'center', title : '기타5', width: '100px', hidden : true},
			{ key : 'duhDuhCntErr', align:'center', title : 'DUH(식수)', width: '100px', hidden : true},
			{ key : 'duhRotnCntErr', align:'center', title : 'ROTN', width: '100px', hidden : true},
			{ key : 'duhIvcCntErr', align:'center', title : 'IVC', width: '100px', hidden : true},
			{ key : 'duhIvrCntErr', align:'center', title : 'IVR', width: '100px', hidden : true},
			{ key : 'duhIvrrCntErr', align:'center', title : 'IVRR', width: '100px', hidden : true},
			{ key : 'rlyRotnCntErr', align:'center', title : 'ROTN', width: '100px', hidden : true},
			{ key : 'rlyIvcCntErr', align:'center', title : 'IVC', width: '100px', hidden : true},
			{ key : 'rlyIvrCntErr', align:'center', title : 'IVR', width: '100px', hidden : true},
			{ key : 'rlyIvrrCntErr', align:'center', title : 'IVRR', width: '100px', hidden : true},
			{ key : 'repceIvcCntErr', align:'center', title : 'IVC', width: '100px', hidden : true},
			{ key : 'repceIvrCntErr', align:'center', title : 'IVR', width: '100px', hidden : true},
			{ key : 'repceIvrrCntErr', align:'center', title : 'IVRR', width: '100px', hidden : true},
			{ key : 'rtfCntErr', align:'center', title : '정류기', width: '100px', hidden : true},
			{ key : 'batryCntErr', align:'center', title : '축전지', width: '100px', hidden : true},
			{ key : 'cbplCntErr', align:'center', title : '분전반', width: '100px', hidden : true},
			{ key : 'arcnCntErr', align:'center', title : '냉방기', width: '100px', hidden : true},
			{ key : 'etcEqpFstCntErr', align:'center', title : '기타1', width: '100px', hidden : true},
			{ key : 'etcEqpScndCntErr', align:'center', title : '기타2', width: '100px', hidden : true},
			{ key : 'etcEqpThrdCntErr', align:'center', title : '기타3', width: '100px', hidden : true},
			{ key : 'etcEqpFothCntErr', align:'center', title : '기타4', width: '100px', hidden : true},
			{ key : 'etcEqpFithCntErr', align:'center', title : '기타5', width: '100px', hidden : true},

			{ key : 'etcEqp6Err', align:'left', title : '기타6', width: '100px', hidden : true},
			{ key : 'etcEqp7Err', align:'left', title : '기타7', width: '100px', hidden : true},
			{ key : 'etcEqp8Err', align:'left', title : '기타8', width: '100px', hidden : true},
			{ key : 'etcEqp9Err', align:'left', title : '기타9', width: '100px', hidden : true},
			{ key : 'etcEqp10Err', align:'left', title : '기타10', width: '100px', hidden : true},


			{ key : 'rowDelYn', align:'center', title : 'Row삭제유무', width: '150', hidden : true},
   			{ key : 'uploadYn', align:'center', title : '판정결과', hidden : true}
			];


    	var headerMappingN = [
    		{fromIndex:5, toIndex:6, title:"AFE 구분"}
 			 ,{fromIndex:7, toIndex:18, title:"System 산출"}
 			 ,{fromIndex:8, toIndex:9, title:"전송장비"}
 			 ,{fromIndex:10, toIndex:18, title:"부대장비"}

 			 ,{fromIndex:19, toIndex:44, title:"수동 산출"}
 			 ,{fromIndex:20, toIndex:23, title:"DUH 수용 국사"}
 			 ,{fromIndex:24, toIndex:27, title:"중계노드"}
 			 ,{fromIndex:28, toIndex:30, title:"대개체"}
 			 ,{fromIndex:31, toIndex:39, title:"부대장비"}
		   ];
    	//그리드 생성
		$('#'+excelGrid).alopexGrid({
			pager : false,
			autoColumnIndex: true,
			height : '10row',
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
			columnMapping: colList,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});
		var param = {grpCd : 'UM000003', mtsoInvtItmVal : 'etcEqp'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5AfeMenuHidYn', param, 'GET', 'g5AfeMenuHidYn');
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
					dataList[i].afeYrErr                  	= isNaNCheck(dataList[i].afeYr);
					dataList[i].afeDgrErr                 	= isNaNCheck(dataList[i].afeDgr);

					dataList[i].sysDuhCntErr                  	= isNaNCheck(dataList[i].sysDuhCnt);
					//dataList[i].sysRotnCntErr                 	= isNaNCheck(dataList[i].sysRotnCnt);
					dataList[i].sysIvrCntErr                  	= isNaNCheck(dataList[i].sysIvrCnt);
					dataList[i].sysIvrrCntErr                 	= isNaNCheck(dataList[i].sysIvrrCnt);
					dataList[i].sysRtfCntErr                  	= isNaNCheck(dataList[i].sysRtfCnt);
					dataList[i].sysBatryCntErr                	= isNaNCheck(dataList[i].sysBatryCnt);
					dataList[i].sysCbplCntErr                 	= isNaNCheck(dataList[i].sysCbplCnt);
					dataList[i].sysArcnCntErr                 	= isNaNCheck(dataList[i].sysArcnCnt);
					dataList[i].sysEtcEqpFstCntErr            	= isNaNCheck(dataList[i].sysEtcEqpFstCnt);
					dataList[i].sysEtcEqpScndCntErr           	= isNaNCheck(dataList[i].sysEtcEqpScndCnt);
					dataList[i].sysEtcEqpThrdCntErr           	= isNaNCheck(dataList[i].sysEtcEqpThrdCnt);
					dataList[i].sysEtcEqpFothCntErr           	= isNaNCheck(dataList[i].sysEtcEqpFothCnt);
					dataList[i].sysEtcEqpFithCntErr           	= isNaNCheck(dataList[i].sysEtcEqpFithCnt);
					dataList[i].duhDuhCntErr                  	= isNaNCheck(dataList[i].duhDuhCnt);
					dataList[i].duhRotnCntErr                 	= isNaNCheck(dataList[i].duhRotnCnt);
					dataList[i].duhIvcCntErr                  	= isNaNCheck(dataList[i].duhIvcCnt);
					dataList[i].duhIvrCntErr                  	= isNaNCheck(dataList[i].duhIvrCnt);
					dataList[i].duhIvrrCntErr                 	= isNaNCheck(dataList[i].duhIvrrCnt);
					dataList[i].rlyRotnCntErr                 	= isNaNCheck(dataList[i].rlyRotnCnt);
					dataList[i].rlyIvcCntErr                  	= isNaNCheck(dataList[i].rlyIvcCnt);
					dataList[i].rlyIvrCntErr                  	= isNaNCheck(dataList[i].rlyIvrCnt);
					dataList[i].rlyIvrrCntErr                 	= isNaNCheck(dataList[i].rlyIvrrCnt);
					dataList[i].repceIvcCntErr                	= isNaNCheck(dataList[i].repceIvcCnt);
					dataList[i].repceIvrCntErr                	= isNaNCheck(dataList[i].repceIvrCnt);
					dataList[i].repceIvrrCntErr               	= isNaNCheck(dataList[i].repceIvrrCnt);
					dataList[i].rtfCntErr                     	= isNaNCheck(dataList[i].rtfCnt);
					dataList[i].batryCntErr                   	= isNaNCheck(dataList[i].batryCnt);
					dataList[i].cbplCntErr                    	= isNaNCheck(dataList[i].cbplCnt);
					dataList[i].arcnCntErr                    	= isNaNCheck(dataList[i].arcnCnt);
					dataList[i].etcEqpFstCntErr               	= isNaNCheck(dataList[i].etcEqpFstCnt);
					dataList[i].etcEqpScndCntErr              	= isNaNCheck(dataList[i].etcEqpScndCnt);
					dataList[i].etcEqpThrdCntErr              	= isNaNCheck(dataList[i].etcEqpThrdCnt);
					dataList[i].etcEqpFothCntErr              	= isNaNCheck(dataList[i].etcEqpFothCnt);
					dataList[i].etcEqpFithCntErr              	= isNaNCheck(dataList[i].etcEqpFithCnt);

					/***********************
					 * 코드값으로 정의
					***********************/

				}
				$grid.alopexGrid('dataAdd', dataList);
			});
			//$input.val('');

			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr};
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5DtlList', param, 'GET', 'search');
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
						dataObj[i].sysDuhCntErr			!= '3' &&
						//dataObj[i].sysRotnCntErr      	!= '3' &&
						dataObj[i].sysIvrCntErr       	!= '3' &&
						dataObj[i].sysIvrrCntErr      	!= '3' &&
						dataObj[i].sysRtfCntErr       	!= '3' &&
						dataObj[i].sysBatryCntErr     	!= '3' &&
						dataObj[i].sysCbplCntErr      	!= '3' &&
						dataObj[i].sysArcnCntErr      	!= '3' &&
						dataObj[i].sysEtcEqpFstCntErr 	!= '3' &&
						dataObj[i].sysEtcEqpScndCntErr	!= '3' &&
						dataObj[i].sysEtcEqpThrdCntErr	!= '3' &&
						dataObj[i].sysEtcEqpFothCntErr	!= '3' &&
						dataObj[i].sysEtcEqpFithCntErr	!= '3' &&
						dataObj[i].duhDuhCntErr       	!= '3' &&
						dataObj[i].duhRotnCntErr      	!= '3' &&
						dataObj[i].duhIvcCntErr       	!= '3' &&
						dataObj[i].duhIvrCntErr       	!= '3' &&
						dataObj[i].duhIvrrCntErr      	!= '3' &&
						dataObj[i].rlyRotnCntErr      	!= '3' &&
						dataObj[i].rlyIvcCntErr       	!= '3' &&
						dataObj[i].rlyIvrCntErr       	!= '3' &&
						dataObj[i].rlyIvrrCntErr      	!= '3' &&
						dataObj[i].repceIvcCntErr     	!= '3' &&
						dataObj[i].repceIvrCntErr     	!= '3' &&
						dataObj[i].repceIvrrCntErr    	!= '3' &&
						dataObj[i].rtfCntErr          	!= '3' &&
						dataObj[i].batryCntErr        	!= '3' &&
						dataObj[i].cbplCntErr         	!= '3' &&
						dataObj[i].arcnCntErr         	!= '3' &&
						dataObj[i].etcEqpFstCntErr    	!= '3' &&
						dataObj[i].etcEqpScndCntErr   	!= '3' &&
						dataObj[i].etcEqpThrdCntErr   	!= '3' &&
						dataObj[i].etcEqpFothCntErr   	!= '3' &&
						dataObj[i].etcEqpFithCntErr   	!= '3' &&

						dataObj[i].etcEqp6Err     		!= '3' &&
						dataObj[i].etcEqp7Err     		!= '3' &&
						dataObj[i].etcEqp8Err     		!= '3' &&
						dataObj[i].etcEqp9Err     		!= '3' &&
						dataObj[i].etcEqp10Err     		!= '3' && (
						dataObj[i].sysDuhCntErr			== '2' ||
						//dataObj[i].sysRotnCntErr      	== '2' ||
						dataObj[i].sysIvrCntErr       	== '2' ||
						dataObj[i].sysIvrrCntErr      	== '2' ||
						dataObj[i].sysRtfCntErr       	== '2' ||
						dataObj[i].sysBatryCntErr     	== '2' ||
						dataObj[i].sysCbplCntErr      	== '2' ||
						dataObj[i].sysArcnCntErr      	== '2' ||
						dataObj[i].sysEtcEqpFstCntErr 	== '2' ||
						dataObj[i].sysEtcEqpScndCntErr	== '2' ||
						dataObj[i].sysEtcEqpThrdCntErr	== '2' ||
						dataObj[i].sysEtcEqpFothCntErr	== '2' ||
						dataObj[i].sysEtcEqpFithCntErr	== '2' ||
						dataObj[i].duhDuhCntErr       	== '2' ||
						dataObj[i].duhRotnCntErr      	== '2' ||
						dataObj[i].duhIvcCntErr       	== '2' ||
						dataObj[i].duhIvrCntErr       	== '2' ||
						dataObj[i].duhIvrrCntErr      	== '2' ||
						dataObj[i].rlyRotnCntErr      	== '2' ||
						dataObj[i].rlyIvcCntErr       	== '2' ||
						dataObj[i].rlyIvrCntErr       	== '2' ||
						dataObj[i].rlyIvrrCntErr      	== '2' ||
						dataObj[i].repceIvcCntErr     	== '2' ||
						dataObj[i].repceIvrCntErr     	== '2' ||
						dataObj[i].repceIvrrCntErr    	== '2' ||
						dataObj[i].rtfCntErr          	== '2' ||
						dataObj[i].batryCntErr        	== '2' ||
						dataObj[i].cbplCntErr         	== '2' ||
						dataObj[i].arcnCntErr         	== '2' ||
						dataObj[i].etcEqpFstCntErr      == '2' ||
						dataObj[i].etcEqpScndCntErr     == '2' ||
						dataObj[i].etcEqpThrdCntErr     == '2' ||
						dataObj[i].etcEqpFothCntErr     == '2' ||
						dataObj[i].etcEqpFithCntErr     == '2' ||

						dataObj[i].etcEqp6Err     		== '2' ||
						dataObj[i].etcEqp7Err     		== '2' ||
						dataObj[i].etcEqp8Err     		== '2' ||
						dataObj[i].etcEqp9Err     		== '2' ||
						dataObj[i].etcEqp10Err     		== '2' )) {
						var tmpList1 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'SYS',
								duhCnt 		    	: isUndefinedCheck(dataObj[i].sysDuhCnt),
								//rotnCnt 		    : isUndefinedCheck(dataObj[i].sysRotnCnt),
								ivrCnt 		    	: isUndefinedCheck(dataObj[i].sysIvrCnt),
								ivrrCnt 		    : isUndefinedCheck(dataObj[i].sysIvrrCnt),
								rtfCnt 		    	: isUndefinedCheck(dataObj[i].sysRtfCnt),
								batryCnt 			: isUndefinedCheck(dataObj[i].sysBatryCnt),
								cbplCnt 		    : isUndefinedCheck(dataObj[i].sysCbplCnt),
								arcnCnt 		    : isUndefinedCheck(dataObj[i].sysArcnCnt),
								etcEqpFstCnt 		: isUndefinedCheck(dataObj[i].sysEtcEqpFstCnt),
								etcEqpScndCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpScndCnt),
								etcEqpThrdCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpThrdCnt),
								etcEqpFothCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpFothCnt),
								etcEqpFithCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpFithCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList1);
	                    var tmpList2 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'DUH',
	                    		duhCnt 		    	: isUndefinedCheck(dataObj[i].duhDuhCnt),
								rotnCnt 		    : isUndefinedCheck(dataObj[i].duhRotnCnt),
								ivcCnt 		    	: isUndefinedCheck(dataObj[i].duhIvcCnt),
								ivrCnt 				: isUndefinedCheck(dataObj[i].duhIvrCnt),
								ivrrCnt 			: isUndefinedCheck(dataObj[i].duhIvrrCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList2);
	                    var tmpList3 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'RLY',
	                    		rotnCnt 			: isUndefinedCheck(dataObj[i].rlyRotnCnt),
								ivcCnt 			: isUndefinedCheck(dataObj[i].rlyIvcCnt),
								ivrCnt 			: isUndefinedCheck(dataObj[i].rlyIvrCnt),
								ivrrCnt 			: isUndefinedCheck(dataObj[i].rlyIvrrCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList3);
	                    var tmpList4 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'REPCE',
	                    		ivcCnt 		: isUndefinedCheck(dataObj[i].repceIvcCnt),
								ivrCnt 		: isUndefinedCheck(dataObj[i].repceIvrCnt),
								ivrrCnt 		: isUndefinedCheck(dataObj[i].repceIvrrCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList4);
	                    var tmpList5 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'SBEQP',
	                    		rtfCnt 				: isUndefinedCheck(dataObj[i].rtfCnt),
								batryCnt 			: isUndefinedCheck(dataObj[i].batryCnt),
								cbplCnt 			: isUndefinedCheck(dataObj[i].cbplCnt),
								arcnCnt 			: isUndefinedCheck(dataObj[i].arcnCnt),
								etcEqpFstCnt 		: isUndefinedCheck(dataObj[i].etcEqpFstCnt),
								etcEqpScndCnt 		: isUndefinedCheck(dataObj[i].etcEqpScndCnt),
								etcEqpThrdCnt 		: isUndefinedCheck(dataObj[i].etcEqpThrdCnt),
								etcEqpFothCnt 		: isUndefinedCheck(dataObj[i].etcEqpFothCnt),
								etcEqpFithCnt 		: isUndefinedCheck(dataObj[i].etcEqpFithCnt),

								etcEqp6 			: isUndefinedCheck(dataObj[i].etcEqp6),
								etcEqp7 			: isUndefinedCheck(dataObj[i].etcEqp7),
								etcEqp8 			: isUndefinedCheck(dataObj[i].etcEqp8),
								etcEqp9 			: isUndefinedCheck(dataObj[i].etcEqp9),
								etcEqp10 			: isUndefinedCheck(dataObj[i].etcEqp10),


								userId				: userId};
	                    excelSaveDtlList.push(tmpList5);

					}
				}
			} else {
				var comText = '<font color=red>업로드 (행)제외</font>에 항목에 <font color=red>체크 해제</font>되어 있습니다.<br>Excel 다운로드 일시 이후 변경된 항목이 있을 수 있습니다.<br><br>업로드 된 Excel 기준으로 저장하시겠습니까?';
				for(var i in dataObj) {
					if (dataObj[i].uploadYn != 'N' && (
						dataObj[i].sysDuhCntErr			== '2' || dataObj[i].sysDuhCntErr			== '3' ||
						//dataObj[i].sysRotnCntErr      	== '2' || dataObj[i].sysRotnCntErr      	== '3' ||
						dataObj[i].sysIvrCntErr       	== '2' || dataObj[i].sysIvrCntErr       	== '3' ||
						dataObj[i].sysIvrrCntErr      	== '2' || dataObj[i].sysIvrrCntErr      	== '3' ||
						dataObj[i].sysRtfCntErr       	== '2' || dataObj[i].sysRtfCntErr       	== '3' ||
						dataObj[i].sysBatryCntErr     	== '2' || dataObj[i].sysBatryCntErr     	== '3' ||
						dataObj[i].sysCbplCntErr      	== '2' || dataObj[i].sysCbplCntErr      	== '3' ||
						dataObj[i].sysArcnCntErr      	== '2' || dataObj[i].sysArcnCntErr      	== '3' ||
						dataObj[i].sysEtcEqpFstCntErr 	== '2' || dataObj[i].sysEtcEqpFstCntErr 	== '3' ||
						dataObj[i].sysEtcEqpScndCntErr	== '2' || dataObj[i].sysEtcEqpScndCntErr	== '3' ||
						dataObj[i].sysEtcEqpThrdCntErr	== '2' || dataObj[i].sysEtcEqpThrdCntErr	== '3' ||
						dataObj[i].sysEtcEqpFothCntErr	== '2' || dataObj[i].sysEtcEqpFothCntErr	== '3' ||
						dataObj[i].sysEtcEqpFithCntErr	== '2' || dataObj[i].sysEtcEqpFithCntErr	== '3' ||
						dataObj[i].duhDuhCntErr       	== '2' || dataObj[i].duhDuhCntErr       	== '3' ||
						dataObj[i].duhRotnCntErr      	== '2' || dataObj[i].duhRotnCntErr      	== '3' ||
						dataObj[i].duhIvcCntErr       	== '2' || dataObj[i].duhIvcCntErr       	== '3' ||
						dataObj[i].duhIvrCntErr       	== '2' || dataObj[i].duhIvrCntErr       	== '3' ||
						dataObj[i].duhIvrrCntErr      	== '2' || dataObj[i].duhIvrrCntErr      	== '3' ||
						dataObj[i].rlyRotnCntErr      	== '2' || dataObj[i].rlyRotnCntErr      	== '3' ||
						dataObj[i].rlyIvcCntErr       	== '2' || dataObj[i].rlyIvcCntErr       	== '3' ||
						dataObj[i].rlyIvrCntErr       	== '2' || dataObj[i].rlyIvrCntErr       	== '3' ||
						dataObj[i].rlyIvrrCntErr      	== '2' || dataObj[i].rlyIvrrCntErr      	== '3' ||
						dataObj[i].repceIvcCntErr     	== '2' || dataObj[i].repceIvcCntErr     	== '3' ||
						dataObj[i].repceIvrCntErr     	== '2' || dataObj[i].repceIvrCntErr     	== '3' ||
						dataObj[i].repceIvrrCntErr    	== '2' || dataObj[i].repceIvrrCntErr    	== '3' ||
						dataObj[i].rtfCntErr          	== '2' || dataObj[i].rtfCntErr          	== '3' ||
						dataObj[i].batryCntErr        	== '2' || dataObj[i].batryCntErr        	== '3' ||
						dataObj[i].cbplCntErr         	== '2' || dataObj[i].cbplCntErr         	== '3' ||
						dataObj[i].arcnCntErr         	== '2' || dataObj[i].arcnCntErr         	== '3' ||
						dataObj[i].etcEqpFstCntErr      == '2' || dataObj[i].etcEqpFstCntErr      	== '3' ||
						dataObj[i].etcEqpScndCntErr     == '2' || dataObj[i].etcEqpScndCntErr     	== '3' ||
						dataObj[i].etcEqpThrdCntErr     == '2' || dataObj[i].etcEqpThrdCntErr     	== '3' ||
						dataObj[i].etcEqpFothCntErr     == '2' || dataObj[i].etcEqpFothCntErr     	== '3' ||
						dataObj[i].etcEqpFithCntErr     == '2' || dataObj[i].etcEqpFithCntErr     	== '3' ||

						dataObj[i].etcEqp6Err     		== '2' || dataObj[i].etcEqp6Err     		== '3' ||
						dataObj[i].etcEqp7Err     		== '2' || dataObj[i].etcEqp7Err     		== '3' ||
						dataObj[i].etcEqp8Err     		== '2' || dataObj[i].etcEqp8Err     		== '3' ||
						dataObj[i].etcEqp9Err     		== '2' || dataObj[i].etcEqp9Err     		== '3' ||
						dataObj[i].etcEqp10Err    		== '2' || dataObj[i].etcEqp10Err     		== '3' )) {
						var tmpList1 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'SYS',
								duhCnt 		    	: isUndefinedCheck(dataObj[i].sysDuhCnt),
								//rotnCnt 		    : isUndefinedCheck(dataObj[i].sysRotnCnt),
								ivrCnt 		    	: isUndefinedCheck(dataObj[i].sysIvrCnt),
								ivrrCnt 		    : isUndefinedCheck(dataObj[i].sysIvrrCnt),
								rtfCnt 		    	: isUndefinedCheck(dataObj[i].sysRtfCnt),
								batryCnt 			: isUndefinedCheck(dataObj[i].sysBatryCnt),
								cbplCnt 		    : isUndefinedCheck(dataObj[i].sysCbplCnt),
								arcnCnt 		    : isUndefinedCheck(dataObj[i].sysArcnCnt),
								etcEqpFstCnt 		: isUndefinedCheck(dataObj[i].sysEtcEqpFstCnt),
								etcEqpScndCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpScndCnt),
								etcEqpThrdCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpThrdCnt),
								etcEqpFothCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpFothCnt),
								etcEqpFithCnt    	: isUndefinedCheck(dataObj[i].sysEtcEqpFithCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList1);
	                    var tmpList2 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'DUH',
	                    		duhCnt 		    	: isUndefinedCheck(dataObj[i].duhDuhCnt),
								rotnCnt 		    : isUndefinedCheck(dataObj[i].duhRotnCnt),
								ivcCnt 		    	: isUndefinedCheck(dataObj[i].duhIvcCnt),
								ivrCnt 				: isUndefinedCheck(dataObj[i].duhIvrCnt),
								ivrrCnt 			: isUndefinedCheck(dataObj[i].duhIvrrCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList2);
	                    var tmpList3 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'RLY',
	                    		rotnCnt 			: isUndefinedCheck(dataObj[i].rlyRotnCnt),
								ivcCnt 				: isUndefinedCheck(dataObj[i].rlyIvcCnt),
								ivrCnt 				: isUndefinedCheck(dataObj[i].rlyIvrCnt),
								ivrrCnt 			: isUndefinedCheck(dataObj[i].rlyIvrrCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList3);
	                    var tmpList4 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'REPCE',
	                    		ivcCnt 				: isUndefinedCheck(dataObj[i].repceIvcCnt),
								ivrCnt 				: isUndefinedCheck(dataObj[i].repceIvrCnt),
								ivrrCnt 			: isUndefinedCheck(dataObj[i].repceIvrrCnt),
								userId				: userId};
	                    excelSaveDtlList.push(tmpList4);
	                    var tmpList5 = {
	                    		mtsoInvtId 			: isUndefinedCheck(dataObj[i].mtsoInvtId),
	                    		afeYr 				: isUndefinedCheck(dataObj[i].afeYr),
	                    		afeDgr 				: isUndefinedCheck(dataObj[i].afeDgr),
	                    		afeInvtDivCd		: 'SBEQP',
	                    		rtfCnt 				: isUndefinedCheck(dataObj[i].rtfCnt),
								batryCnt 			: isUndefinedCheck(dataObj[i].batryCnt),
								cbplCnt 			: isUndefinedCheck(dataObj[i].cbplCnt),
								arcnCnt 			: isUndefinedCheck(dataObj[i].arcnCnt),
								etcEqpFstCnt 		: isUndefinedCheck(dataObj[i].etcEqpFstCnt),
								etcEqpScndCnt 		: isUndefinedCheck(dataObj[i].etcEqpScndCnt),
								etcEqpThrdCnt 		: isUndefinedCheck(dataObj[i].etcEqpThrdCnt),
								etcEqpFothCnt 		: isUndefinedCheck(dataObj[i].etcEqpFothCnt),
								etcEqpFithCnt 		: isUndefinedCheck(dataObj[i].etcEqpFithCnt),

								etcEqp6 			: isUndefinedCheck(dataObj[i].etcEqp6),
								etcEqp7 			: isUndefinedCheck(dataObj[i].etcEqp7),
								etcEqp8 			: isUndefinedCheck(dataObj[i].etcEqp8),
								etcEqp9 			: isUndefinedCheck(dataObj[i].etcEqp9),
								etcEqp10 			: isUndefinedCheck(dataObj[i].etcEqp10),

								userId				: userId};
	                    excelSaveDtlList.push(tmpList5);
					}
				}
			}
			if (excelSaveDtlList == null || excelSaveDtlList == undefined || excelSaveDtlList == "") {
				callMsgBox('','W', '저장 가능한 항목이 없습니다.(Excel 다운로드 일시 이후 변경된 항목 포함)<br><br>목록을 확인하시기 바랍니다.' , function(msgId, msgRst){});
			} else {
				callMsgBox('','C', comText, function(msgId, msgRst){
	 		        if (msgRst == 'Y') {
	 		        	$('#'+excelGrid).alopexGrid('showProgress');
	 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', excelSaveDtlList, 'POST', 'saveG5Dtl');
	 		        }
			     });
			}
		});

		$('#downLoadDate').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('showProgress');
			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setG5AfeDsnInfAll', param, 'POST', null);
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5DtlList', param, 'GET', 'search');
		});

		$('#afeYr').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('showProgress');
			var afeYr = $("#afeYr").val();
	    	var param = {afeYr : afeYr};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setG5AfeDsnInfAll', param, 'POST', null);
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5DtlList', param, 'GET', 'search');
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
    		var dbData = response.g5DtlList;

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
					  dataObj[i].sysDuhCntErr			== '1' ||
					  //dataObj[i].sysRotnCntErr      	== '1' ||
					  dataObj[i].sysIvrCntErr       	== '1' ||
					  dataObj[i].sysIvrrCntErr      	== '1' ||
					  dataObj[i].sysRtfCntErr       	== '1' ||
					  dataObj[i].sysBatryCntErr     	== '1' ||
					  dataObj[i].sysCbplCntErr      	== '1' ||
					  dataObj[i].sysArcnCntErr      	== '1' ||
					  dataObj[i].sysEtcEqpFstCntErr 	== '1' ||
					  dataObj[i].sysEtcEqpScndCntErr	== '1' ||
					  dataObj[i].sysEtcEqpThrdCntErr	== '1' ||
					  dataObj[i].sysEtcEqpFothCntErr	== '1' ||
					  dataObj[i].sysEtcEqpFithCntErr	== '1' ||
					  dataObj[i].duhDuhCntErr       	== '1' ||
					  dataObj[i].duhRotnCntErr      	== '1' ||
					  dataObj[i].duhIvcCntErr       	== '1' ||
					  dataObj[i].duhIvrCntErr       	== '1' ||
					  dataObj[i].duhIvrrCntErr      	== '1' ||
					  dataObj[i].rlyRotnCntErr      	== '1' ||
					  dataObj[i].rlyIvcCntErr       	== '1' ||
					  dataObj[i].rlyIvrCntErr       	== '1' ||
					  dataObj[i].rlyIvrrCntErr      	== '1' ||
					  dataObj[i].repceIvcCntErr     	== '1' ||
					  dataObj[i].repceIvrCntErr     	== '1' ||
					  dataObj[i].repceIvrrCntErr    	== '1' ||
					  dataObj[i].rtfCntErr          	== '1' ||
					  dataObj[i].batryCntErr        	== '1' ||
					  dataObj[i].cbplCntErr         	== '1' ||
					  dataObj[i].arcnCntErr         	== '1' ||
					  dataObj[i].etcEqpFstCntErr    	== '1' ||
					  dataObj[i].etcEqpScndCntErr   	== '1' ||
					  dataObj[i].etcEqpThrdCntErr   	== '1' ||
					  dataObj[i].etcEqpFothCntErr   	== '1' ||
					  dataObj[i].etcEqpFithCntErr   	== '1' ||
					  dataObj[i].etcEqp6Err   			== '1' ||
					  dataObj[i].etcEqp7Err   			== '1' ||
					  dataObj[i].etcEqp8Err   			== '1' ||
					  dataObj[i].etcEqp9Err   			== '1' ||
					  dataObj[i].etcEqp10Err   			== '1' ) {
					$('#'+excelGrid).alopexGrid('dataEdit',{uploadYn:'N'},{mtsoInvtId:dataObj[i].mtsoInvtId, afeYr : dataObj[i].afeYr, afeDgr : dataObj[i].afeDgr});
					continue;
				}


				var cksysDuhCntErr			= '0';
				var cksysRotnCntErr      	= '0';
				var cksysIvrCntErr       	= '0';
				var cksysIvrrCntErr      	= '0';
				var cksysRtfCntErr       	= '0';
				var cksysBatryCntErr     	= '0';
				var cksysCbplCntErr      	= '0';
				var cksysArcnCntErr      	= '0';
				var cksysEtcEqpFstCntErr 	= '0';
				var cksysEtcEqpScndCntErr	= '0';
				var cksysEtcEqpThrdCntErr	= '0';
				var cksysEtcEqpFothCntErr	= '0';
				var cksysEtcEqpFithCntErr	= '0';
				var ckduhDuhCntErr       	= '0';
				var ckduhRotnCntErr      	= '0';
				var ckduhIvcCntErr       	= '0';
				var ckduhIvrCntErr       	= '0';
				var ckduhIvrrCntErr      	= '0';
				var ckrlyRotnCntErr      	= '0';
				var ckrlyIvcCntErr       	= '0';
				var ckrlyIvrCntErr       	= '0';
				var ckrlyIvrrCntErr      	= '0';
				var ckrepceIvcCntErr     	= '0';
				var ckrepceIvrCntErr     	= '0';
				var ckrepceIvrrCntErr    	= '0';
				var ckrtfCntErr          	= '0';
				var ckbatryCntErr        	= '0';
				var ckcbplCntErr         	= '0';
				var ckarcnCntErr         	= '0';
				var cketcEqpFstCntErr    	= '0';
				var cketcEqpScndCntErr   	= '0';
				var cketcEqpThrdCntErr   	= '0';
				var cketcEqpFothCntErr   	= '0';
				var cketcEqpFithCntErr   	= '0';

				var cketcEqp6Err   			= '0';
				var cketcEqp7Err   			= '0';
				var cketcEqp8Err   			= '0';
				var cketcEqp9Err   			= '0';
				var cketcEqp10Err   		= '0';



				for(var j in dbData) {
					var dBsysLastChgDate = dbData[j].sysLastChgDate;
					var dBduhLastChgDate = dbData[j].duhLastChgDate;
					var dBrlyLastChgDate = dbData[j].rlyLastChgDate;
					var dBrepceLastChgDate = dbData[j].repceLastChgDate;
					var dBetcLastChgDate = dbData[j].etcLastChgDate;

					if (dataObj[i].mtsoInvtId == dbData[j].mtsoInvtId && dataObj[i].afeYr == dbData[j].afeYr && dataObj[i].afeDgr == dbData[j].afeDgr && dataObj[i].uploadYn != 'N') {
						cksysDuhCntErr				= isExcelToDBCheck(dataObj[i].sysDuhCnt,       		dbData[j].sysDuhCnt, 		lastChgDate, 	dBsysLastChgDate);
						//cksysRotnCntErr             = isExcelToDBCheck(dataObj[i].sysRotnCnt,           dbData[j].sysRotnCnt, 		lastChgDate, 	dBsysLastChgDate);
						cksysIvrCntErr              = isExcelToDBCheck(dataObj[i].sysIvrCnt,            dbData[j].sysIvrCnt, 		lastChgDate, 	dBsysLastChgDate);
						cksysIvrrCntErr             = isExcelToDBCheck(dataObj[i].sysIvrrCnt,           dbData[j].sysIvrrCnt, 		lastChgDate, 	dBsysLastChgDate);
						cksysRtfCntErr              = isExcelToDBCheck(dataObj[i].sysRtfCnt,            dbData[j].sysRtfCnt, 		lastChgDate, 	dBsysLastChgDate);
						cksysBatryCntErr            = isExcelToDBCheck(dataObj[i].sysBatryCnt,          dbData[j].sysBatryCnt, 		lastChgDate, 	dBsysLastChgDate);
						cksysCbplCntErr             = isExcelToDBCheck(dataObj[i].sysCbplCnt,           dbData[j].sysCbplCnt, 		lastChgDate, 	dBsysLastChgDate);
						cksysArcnCntErr             = isExcelToDBCheck(dataObj[i].sysArcnCnt,           dbData[j].sysArcnCnt, 		lastChgDate, 	dBsysLastChgDate);
						cksysEtcEqpFstCntErr        = isExcelToDBCheck(dataObj[i].sysEtcEqpFstCnt,      dbData[j].sysEtcEqpFstCnt, 	lastChgDate, 	dBsysLastChgDate);
						cksysEtcEqpScndCntErr       = isExcelToDBCheck(dataObj[i].sysEtcEqpScndCnt,     dbData[j].sysEtcEqpScndCnt, lastChgDate, 	dBsysLastChgDate);
						cksysEtcEqpThrdCntErr       = isExcelToDBCheck(dataObj[i].sysEtcEqpThrdCnt,     dbData[j].sysEtcEqpThrdCnt, lastChgDate, 	dBsysLastChgDate);
						cksysEtcEqpFothCntErr       = isExcelToDBCheck(dataObj[i].sysEtcEqpFothCnt,     dbData[j].sysEtcEqpFothCnt, lastChgDate, 	dBsysLastChgDate);
						cksysEtcEqpFithCntErr       = isExcelToDBCheck(dataObj[i].sysEtcEqpFithCnt,     dbData[j].sysEtcEqpFithCnt, lastChgDate, 	dBsysLastChgDate);
						ckduhDuhCntErr              = isExcelToDBCheck(dataObj[i].duhDuhCnt,            dbData[j].duhDuhCnt, 		lastChgDate, 	dBduhLastChgDate);
						ckduhRotnCntErr             = isExcelToDBCheck(dataObj[i].duhRotnCnt,           dbData[j].duhRotnCnt, 		lastChgDate, 	dBduhLastChgDate);
						ckduhIvcCntErr              = isExcelToDBCheck(dataObj[i].duhIvcCnt,            dbData[j].duhIvcCnt, 		lastChgDate, 	dBduhLastChgDate);
						ckduhIvrCntErr              = isExcelToDBCheck(dataObj[i].duhIvrCnt,            dbData[j].duhIvrCnt, 		lastChgDate, 	dBduhLastChgDate);
						ckduhIvrrCntErr             = isExcelToDBCheck(dataObj[i].duhIvrrCnt,           dbData[j].duhIvrrCnt, 		lastChgDate, 	dBduhLastChgDate);
						ckrlyRotnCntErr             = isExcelToDBCheck(dataObj[i].rlyRotnCnt,           dbData[j].rlyRotnCnt, 		lastChgDate, 	dBrlyLastChgDate);
						ckrlyIvcCntErr              = isExcelToDBCheck(dataObj[i].rlyIvcCnt,            dbData[j].rlyIvcCnt, 		lastChgDate, 	dBrlyLastChgDate);
						ckrlyIvrCntErr              = isExcelToDBCheck(dataObj[i].rlyIvrCnt,            dbData[j].rlyIvrCnt, 		lastChgDate,	dBrlyLastChgDate);
						ckrlyIvrrCntErr             = isExcelToDBCheck(dataObj[i].rlyIvrrCnt,           dbData[j].rlyIvrrCnt, 		lastChgDate, 	dBrlyLastChgDate);
						ckrepceIvcCntErr            = isExcelToDBCheck(dataObj[i].repceIvcCnt,          dbData[j].repceIvcCnt, 		lastChgDate, 	dBrepceLastChgDate);
						ckrepceIvrCntErr            = isExcelToDBCheck(dataObj[i].repceIvrCnt,          dbData[j].repceIvrCnt, 		lastChgDate, 	dBrepceLastChgDate);
						ckrepceIvrrCntErr           = isExcelToDBCheck(dataObj[i].repceIvrrCnt,         dbData[j].repceIvrrCnt, 	lastChgDate, 	dBrepceLastChgDate);
						ckrtfCntErr                 = isExcelToDBCheck(dataObj[i].rtfCnt,               dbData[j].rtfCnt, 			lastChgDate, 	dBetcLastChgDate);
						ckbatryCntErr               = isExcelToDBCheck(dataObj[i].batryCnt,             dbData[j].batryCnt, 		lastChgDate, 	dBetcLastChgDate);
						ckcbplCntErr                = isExcelToDBCheck(dataObj[i].cbplCnt,              dbData[j].cbplCnt, 			lastChgDate, 	dBetcLastChgDate);
						ckarcnCntErr                = isExcelToDBCheck(dataObj[i].arcnCnt,              dbData[j].arcnCnt, 			lastChgDate, 	dBetcLastChgDate);
						cketcEqpFstCntErr           = isExcelToDBCheck(dataObj[i].etcEqpFstCnt,         dbData[j].etcEqpFstCnt, 	lastChgDate, 	dBetcLastChgDate);
						cketcEqpScndCntErr          = isExcelToDBCheck(dataObj[i].etcEqpScndCnt,        dbData[j].etcEqpScndCnt, 	lastChgDate, 	dBetcLastChgDate);
						cketcEqpThrdCntErr          = isExcelToDBCheck(dataObj[i].etcEqpThrdCnt,        dbData[j].etcEqpThrdCnt, 	lastChgDate, 	dBetcLastChgDate);
						cketcEqpFothCntErr          = isExcelToDBCheck(dataObj[i].etcEqpFothCnt,        dbData[j].etcEqpFothCnt, 	lastChgDate,	dBetcLastChgDate);
						cketcEqpFithCntErr          = isExcelToDBCheck(dataObj[i].etcEqpFithCnt,        dbData[j].etcEqpFithCnt, 	lastChgDate, 	dBetcLastChgDate);

						cketcEqp6Err   	= isExcelToDBCheck(dataObj[i].etcEqp6,        dbData[j].etcEqp6, 	lastChgDate, 	dBetcLastChgDate);
						cketcEqp7Err   	= isExcelToDBCheck(dataObj[i].etcEqp7,        dbData[j].etcEqp7, 	lastChgDate, 	dBetcLastChgDate);
						cketcEqp8Err   	= isExcelToDBCheck(dataObj[i].etcEqp8,        dbData[j].etcEqp8, 	lastChgDate, 	dBetcLastChgDate);
						cketcEqp9Err   	= isExcelToDBCheck(dataObj[i].etcEqp9,        dbData[j].etcEqp9, 	lastChgDate, 	dBetcLastChgDate);
						cketcEqp10Err   = isExcelToDBCheck(dataObj[i].etcEqp10,       dbData[j].etcEqp10, 	lastChgDate, 	dBetcLastChgDate);

						//dbData.splice(j,1);
						break;
					}
				}
				var tmpColErrData = {
						sysDuhCntErr			    : cksysDuhCntErr,
						//sysRotnCntErr               : cksysRotnCntErr,
						sysIvrCntErr                : cksysIvrCntErr,
						sysIvrrCntErr               : cksysIvrrCntErr,
						sysRtfCntErr                : cksysRtfCntErr,
						sysBatryCntErr              : cksysBatryCntErr,
						sysCbplCntErr               : cksysCbplCntErr,
						sysArcnCntErr               : cksysArcnCntErr,
						sysEtcEqpFstCntErr          : cksysEtcEqpFstCntErr,
						sysEtcEqpScndCntErr         : cksysEtcEqpScndCntErr,
						sysEtcEqpThrdCntErr         : cksysEtcEqpThrdCntErr,
						sysEtcEqpFothCntErr         : cksysEtcEqpFothCntErr,
						sysEtcEqpFithCntErr         : cksysEtcEqpFithCntErr,
						duhDuhCntErr                : ckduhDuhCntErr,
						duhRotnCntErr               : ckduhRotnCntErr,
						duhIvcCntErr                : ckduhIvcCntErr,
						duhIvrCntErr                : ckduhIvrCntErr,
						duhIvrrCntErr               : ckduhIvrrCntErr,
						rlyRotnCntErr               : ckrlyRotnCntErr,
						rlyIvcCntErr                : ckrlyIvcCntErr,
						rlyIvrCntErr                : ckrlyIvrCntErr,
						rlyIvrrCntErr               : ckrlyIvrrCntErr,
						repceIvcCntErr              : ckrepceIvcCntErr,
						repceIvrCntErr              : ckrepceIvrCntErr,
						repceIvrrCntErr             : ckrepceIvrrCntErr,
						rtfCntErr                   : ckrtfCntErr,
						batryCntErr                 : ckbatryCntErr,
						cbplCntErr                  : ckcbplCntErr,
						arcnCntErr                  : ckarcnCntErr,
						etcEqpFstCntErr             : cketcEqpFstCntErr,
						etcEqpScndCntErr            : cketcEqpScndCntErr,
						etcEqpThrdCntErr            : cketcEqpThrdCntErr,
						etcEqpFothCntErr            : cketcEqpFothCntErr,
						etcEqpFithCntErr            : cketcEqpFithCntErr,

						etcEqp6Err            	: cketcEqp6Err,
						etcEqp7Err            	: cketcEqp7Err,
						etcEqp8Err            	: cketcEqp8Err,
						etcEqp9Err            	: cketcEqp9Err,
						etcEqp10Err            	: cketcEqp10Err


				};

				$('#'+excelGrid).alopexGrid('dataEdit', tmpColErrData, {mtsoInvtId : dataObj[i].mtsoInvtId, afeYr : dataObj[i].afeYr, afeDgr : dataObj[i].afeDgr});
//				dataObj[i].afeYr == dbData[j].afeYr && dataObj[i].afeDgr == dbData[j].afeDgr
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
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setG5AfeDsnInfAll', param, 'POST', null);
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


		if(flag == 'g5AfeMenuHidYn'){
			for(var i = 0; i < response.menuHidYn.length; i++){
				var upWord = response.menuHidYn[i].mtsoInvtItmVal.replace('etc','Etc');
				var colNm1 = 'sys' + upWord;
				var colNm2 = upWord.replace('Etc','etc');
    			if (response.menuHidYn[i].mtsoInvtItmHidYn == 'N') {
    				//$('#'+excelGrid).alopexGrid('updateColumn', {title : response.menuHidYn[i].mtsoInvtItmNm}, colNm1);
    				$('#'+excelGrid).alopexGrid('updateColumn', {title : response.menuHidYn[i].mtsoInvtItmNm}, colNm2);

    				$('#'+excelGrid).alopexGrid('updateColumn', {hidden : true}, colNm1);
    			} else {
    				$('#'+excelGrid).alopexGrid('updateColumn', {hidden : true}, colNm1);
    				$('#'+excelGrid).alopexGrid('updateColumn', {hidden : true}, colNm2);
    			}
			}

    	}
		if(flag == 'saveG5Dtl'){
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

