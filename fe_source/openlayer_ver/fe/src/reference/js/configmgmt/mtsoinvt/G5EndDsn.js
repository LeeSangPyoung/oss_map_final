/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var g5EndDsn = $a.page(function() {

	var g5EndGridId = 'g5EndDataGrid';
	var paramData = null;
	var shtgItmCd		= [];

	var g5EndScrollOffset = null;

    this.init = function(id, param) {
    	g5EndDsnSetSelectCode();
    	//g5EndDsnInitGrid();
    	g5EndDsnSetEventListener();
    };


	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function g5EndDsnSetSelectCode() {
    	// 부족 항목
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/SHTG', null, 'GET', 'shtgItmList');
    }

    this.g5EndDsnGridCol = function() {
    	var colList = [];

    	colList =  [
			{ key : 'mtsoId', align:'center', title : '국사ID', width: '100px' },		// 숨김
			{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '100px' },		// 숨김
			{ key : 'demdHdofcCd', align:'center', title : '본부', width: '90',
				render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return data.demdHdofcCd ;
						} else {
							return '';
						}
				}
			},
			{ key : 'demdAreaCd', align:'center', title : '지역', width: '90',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						return data.demdAreaCd ;
					} else {
						return '';
					}
			}
			},
			{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '50px' },		// 숨김
			{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '50px' },		// 숨김
			{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						return data.mtsoNm ;
					} else {
						return '';
					}
				}
			},
			{ key : 'floorNm', align:'center', title : '층명', width: '150px',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						return '';
					} else {
						return data.floorNm ;
					}
				}
			},
			{ key : 'ctrtEpwrVal', align:'center', title : '계약전력(Kw)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'loadEpwrVal', align:'center', title : '부하전력(Kw)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'loadEpwrRate', align:'center', title : '부하율(%)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  Math.round((setIsNaNCheck(parseInt(data.loadEpwrVal)) / setIsNaNCheck(parseInt(data.ctrtEpwrVal)))*100,3);
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
					}
				},
				editable : function(value, data) {
					var strVal =  Math.round((setIsNaNCheck(parseInt(data.loadEpwrVal)) / setIsNaNCheck(parseInt(data.ctrtEpwrVal)))*100,3);
					if (isNaN(strVal)) strVal = "0";
					var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'g2RemvRackCnt', align:'center', title : '철거랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'g2ScreEpwrVal', align:'center', title : '확보전력(Kw)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},

			{ key : 'lgcyEpwrVal', align:'center', title : 'Legacy 전력량(kw)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'lgcyRackCnt', align:'center', title : '랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'lgcyDemdEpwrVal', align:'center', title : '전력량(kw)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'g5DulCnt', align:'center', title : 'DUL수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'g5DuhCnt', align:'center', title : 'DUH수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'g5DuhRackCnt', align:'center', title : 'DUH랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'g5DuhEpwrVal', align:'center', title : 'DUH전력량(kW)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},

			{ key : 'trmsRotnCnt', align:'center', title : 'ROTN', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsIvrCnt', align:'center', title : 'IVR', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsIvrrCnt', align:'center', title : 'IVRR', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trms5gponCnt', align:'center', title : '5GPON', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsSmuxCnt', align:'center', title : 'SMUX', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsFdfCnt', align:'center', title : 'FDF', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsRackSubtCnt', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnCnt)) + setIsNaNCheck(parseInt(data.trmsIvrCnt)) + setIsNaNCheck(parseInt(data.trmsIvrrCnt)) + setIsNaNCheck(parseInt(data.trms5gponCnt)) + setIsNaNCheck(parseInt(data.trmsSmuxCnt)) + setIsNaNCheck(parseInt(data.trmsFdfCnt));
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
					}
				},
				editable : function(value, data) {
					var strVal =  setIsNaNCheck(parseInt(data.trmsRotnCnt)) + setIsNaNCheck(parseInt(data.trmsIvrCnt)) + setIsNaNCheck(parseInt(data.trmsIvrrCnt)) + setIsNaNCheck(parseInt(data.trms5gponCnt)) + setIsNaNCheck(parseInt(data.trmsSmuxCnt)) + setIsNaNCheck(parseInt(data.trmsFdfCnt));
					if (isNaN(strVal)) strVal = "0";
					var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},

			{ key : 'trmsRotnEpwrVal', align:'center', title : 'ROTN', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsIvrEpwrVal', align:'center', title : 'IVR', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsIvrrEpwrVal', align:'center', title : 'IVRR', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trms5gponEpwrVal', align:'center', title : '5GPON', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'trmsSubtEpwrVal', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrrEpwrVal)) + setIsNaNCheck(parseInt(data.trms5gponEpwrVal));
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
					}
				},
				editable : function(value, data) {
					var strVal =  setIsNaNCheck(parseInt(data.trmsRotnEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrrEpwrVal)) + setIsNaNCheck(parseInt(data.trms5gponEpwrVal));
					if (isNaN(strVal)) strVal = "0";
					var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},

			{ key : 'sbeqpRtfRackCnt', align:'center', title : '정류기랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'sbeqpIpdCnt', align:'center', title : 'IPD', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'sbeqpArcnCnt', align:'center', title : '냉방기', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'sbeqpBatryLipoCnt', align:'center', title : '축전지_리튬', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'sbeqpBatryCnt', align:'center', title : '축전지_납', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'sbeqpSubtCnt', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  setIsNaNCheck(parseInt(data.sbeqpRtfRackCnt)) + setIsNaNCheck(parseInt(data.sbeqpIpdCnt)) + setIsNaNCheck(parseInt(data.sbeqpArcnCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryLipoCnt)) +  setIsNaNCheck(parseInt(data.sbeqpBatryCnt));
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
					}
				},
				editable : function(value, data) {
					var strVal =  setIsNaNCheck(parseInt(data.sbeqpRtfRackCnt)) + setIsNaNCheck(parseInt(data.sbeqpIpdCnt)) + setIsNaNCheck(parseInt(data.sbeqpArcnCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryLipoCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryCnt));
					if (isNaN(strVal)) strVal = "0";
					var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" readonly class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},

			{ key : 'upsdDemdRackCnt', align:'center', title : '랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'upsdDemdEpwrVal', align:'center', title : '소모전력(kW)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},

			{ key : 'remRackCnt', align:'center', title : '잔여랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'remEpwrVal', align:'center', title : '잔여전력', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'shtgItmCd', align:'center', title : '부족항목', width: '130px',  filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(shtgItmCd);
							return render_data;
						} else {
							data.shtgItmCd = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in shtgItmCd) {
							var exist = '';
							if (value && value.indexOf(shtgItmCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+shtgItmCd[i].value+' '+exist+'>'+shtgItmCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'screPsblEpwrVal', align:'center', title : '확보가능전력', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'epwrRfctInvtCost', align:'center', title : '전력보강투자비', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'g5EndRmk', align:'center', title : '비고', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.g5EndRmk = '';
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'endEtcColVal1', align:'center', title : '기타1', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal2', align:'center', title : '기타2', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal3', align:'center', title : '기타3', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal4', align:'center', title : '기타4', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal5', align:'center', title : '기타5', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal6', align:'center', title : '기타6', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal7', align:'center', title : '기타7', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal8', align:'center', title : '기타8', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal9', align:'center', title : '기타9', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'endEtcColVal10', align:'center', title : '기타10', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}

		];

    	return colList;
    }

    this.g5EndDsnInitGrid = function() {
    	$('#'+g5EndGridId).alopexGrid('dataEmpty');
    	var headerMappingN =  [
			 {fromIndex:8, toIndex:10, title:"현재 전력"}
    		,{fromIndex:11, toIndex:12, title:"2G FadeOut"}
    		,{fromIndex:13, toIndex:15, title:"국사 통폐합"}
    		,{fromIndex:16, toIndex:19, title:"-"}
    		,{fromIndex:20, toIndex:26, title:"전송 랙수(개)"}
    		,{fromIndex:27, toIndex:31, title:"전송 전력량(kW)"}
    		,{fromIndex:32, toIndex:37, title:"부대물자 랙수(개)"}
    		,{fromIndex:38, toIndex:39, title:"상면 종국 수요"}
    		,{fromIndex:40, toIndex:45, title:"잔여/누적"}
    		,{fromIndex:46, toIndex:55, title:"기타항목"}
    		];

        //그리드 생성
        $('#'+g5EndGridId).alopexGrid({
        	parger : true,
        	paging : {
				pagerSelect: false,
				pagerTotal : true
				,hidePageList: true  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			fullCompareForEditedState: true,
			defaultColumnMapping:{
    			sorting : true
    		},
			rowInlineEdit: true,
			autoResize: true,
			filteringHeader: true,
			filter: {
				title: true,
				movable: true,
				saveFilterSize: true,
				sorting: true,
				dataFilterInstant: true,
				dataFilterSearch: true,
				closeFilter: {
					applyButton: true,
					removeButton: true
				},
				typeListDefault : {
					selectValue : 'contain',
					expandSelectValue : 'contain'
				},
				filterByEnter: true,
				focus: 'searchInput'
			},

			columnFixUpto : 'floorNm',
			headerGroup : headerMappingN,
    		columnMapping: g5EndDsn.g5EndDsnGridCol(),

//    		data:data,

			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['mtsoInvtId', 'mtsoId', 'repMtsoId', 'repMtsoYn'];

    	$('#'+g5EndGridId).alopexGrid("hideCol", hideColList, 'conceal');


    	for(var i = 0; i < publicEndHideCol.length; i++){
			if (publicEndHideCol[i].mtsoInvtItmHidYn == 'N') {
				$('#'+g5EndGridId).alopexGrid('updateColumn', {title : publicEndHideCol[i].mtsoInvtItmNm}, publicEndHideCol[i].mtsoInvtItmVal);
			} else {
				$('#'+g5EndGridId).alopexGrid('updateColumn', {hidden : true}, publicEndHideCol[i].mtsoInvtItmVal);
			}
		}

	}

    function g5EndDsnSetEventListener() {

    	$('#'+g5EndGridId).on('rowInlineEditEnd',function(e){
    		var param = AlopexGrid.parseEvent(e).data;
			var userId;
			 if($("#userId").val() == ""){
				 userId = "SYSTEM";
			 }else{
				 userId = $("#userId").val();
			 }

			 param.frstRegUserId = userId;
			 param.lastChgUserId = userId;

			 $('#'+g5EndGridId).alopexGrid('dataFlush', function(editedDataList){

				 var result = $.map(editedDataList, function(el, idx){ return el.mtsoInvtId;})

				if (result.length > 0) {
					 if (param.repMtsoYn == 'Y') {
						 httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/mergeG5EndDsn', param, 'POST', 'G5EndDsn');
					 }
				}
			 });
        });

    	$('#btnG5EndImportExcel').on('click', function(e) {
    		$a.popup({
    		  	popid: 'ExcelUpload',
    		  	title: 'Excel Upload',
    		      url: '/tango-transmission-web/configmgmt/mtsoinvt/G5EndDsnExcelUpload.do',
    		      windowpopup : true,
    		      modal: true,
    		      movable:true,
    		      width : window.innerWidth * 0.9,
    		      height : 750,
    		      callback : function(data) {
    		    	  g5EndDsn.setGrid(1,100000);
    		      }
    		});
    	});

    	 $('#btnG5EndExportExcel').on('click', function(e) {
    		var userId 		= $('#userId').val();
    		var paramData 	= {downFlag : 'G5END', userId : userId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setExcelDownLoadHis', paramData, 'POST', '');
    		//필터링 체크 여부
    		 var filtered = false;
    		 if (document.getElementsByClassName('alopexgrid-filter-dropdownbutton filtered').length > 0) {
    			 filtered = true;
    		 }

    		 var dt = new Date();
 			var recentY = dt.getFullYear();
 			var recentM = dt.getMonth() + 1;
 			var recentD = dt.getDate();

 			if(recentM < 10) recentM = "0" + recentM;
 			if(recentD < 10) recentD = "0" + recentD;

 			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

 			$('#'+g5EndGridId).alopexGrid("showCol", 'mtsoInvtId');

 			var worker = new ExcelWorker({
 				excelFileName : '5G종국설계_'+recentYMD,
 				sheetList : [{
 					sheetName : '5G종국설계',
 					$grid : $("#"+g5EndGridId)
 				},{
 					sheetName : '항목별 코드표',
 					$grid : $("#codeTotalDataGrid")
 				}]
 			});
 			worker.export({
 				merge : true,
 				useCSSParser : true,
 				useGridColumnWidth : true,
 				border : true,
 				filtered : filtered,
 				callback : {
 					preCallback : function(gridList){
 						for(var i=0; i < gridList.length; i++) {
 							if(i == 0  || i == gridList.length -1)
 								gridList[i].alopexGrid('showProgress');
 						}
 					},
 					postCallback : function(gridList) {
 						for(var i=0; i< gridList.length; i++) {
 							gridList[i].alopexGrid('hideProgress');
 						}
 					}
 				}
 			});

 			$('#'+g5EndGridId).alopexGrid("hideCol", 'mtsoInvtId', 'conceal');
         });

    };



	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	// 부족항목
    	if(flag == 'shtgItmList'){

    		shtgItmCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				shtgItmCd.push(resObj);
			}
    	}

    	if(flag == 'search'){

    		$('#'+g5EndGridId).alopexGrid('hideProgress');

    		setSPGrid(g5EndGridId, response, response.g5EndDsnList);
    	}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	       	// 스크롤 유지시 컬럼 고정이 있는 경우 위치 이동이 안되 컬럼 고정 풀고 스크롤 위치 이동후 다시 고정 설정
	       	$('#'+GridID).alopexGrid('columnUnfix');
	       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : g5EndScrollOffset.column}});
	       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});
	}

    this.setGrid = function(page, rowPerPage) {
        //this.setGrid = function(page, rowPerPage){ // this 쓰면 permission denied 되서 함수 접근못함.[20171121]

    	g5EndScrollOffset = $('#'+g5EndGridId).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();

    	param.pageNo = page;
    	param.rowPerPage = rowPerPage;

		$('#'+g5EndGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5EndDsnList', param, 'GET', 'search');

    }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
              });
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

    function setIsNaNCheck(strVal) {
		if (isNaN(strVal)) { strVal = 0; }
		return strVal;
	}
});