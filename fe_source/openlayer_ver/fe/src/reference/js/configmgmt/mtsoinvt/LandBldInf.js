/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var landBldInf = $a.page(function() {

	var landBldGridId = 'landBldDataGrid';
	var paramData = null;

	var bldMgmtTypCd		= [];
	var landOwnDivCd		= [];
	var bldOwnDivCd		= [];
	var screLandYr		    = [];
	var screLandDivCd		= [];
	var screBldYr 			 =[];

	var landBldScrollOffset = null;

    this.init = function(id, param) {
    	landBldSetSelectCode();
    	//landBldInitGrid();
    	landBldSetEventListener();

    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function landBldSetSelectCode() {

    	 // 건물관리주체
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/BLDMGMT', null, 'GET', 'bldMgmtTypList');
		 // 토지소유구분
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LOWNCD', null, 'GET', 'landOwnDivList');
		 // 건물소유구분
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/BOWNCD', null, 'GET', 'bldOwnDivList');
		 //토지용도
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LDIVCD', null, 'GET', 'screLandDivList');

		 var d = new Date();
		 var year = d.getFullYear();
			for(i = year - 50; i < year + 6; i++) {
				var yearObj = {value : i, text : i};
				screLandYr.push(yearObj);
				screBldYr.push(yearObj);
			}
    }


    this.landBldGridCol = function() {
    	var colList = []

    	colList = [
    		{ key : 'mtsoId', align:'center', title : '국사ID', width: '100px' },		// 숨김
			{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '50px' },		// 숨김
			{ key : 'demdHdofcCd', align:'center', title : '본부', width: '90',
//				title: function(mapping) { return "<div><span>본부</span><button type='button' id='demdHdofcCdBtn' class='filterBtn alopexgrid-ignore-pointeraction'>&nbsp;</button></div>" },
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
			{ key : 'bldMgmtTypCd', align:'center', title : '건물관리주체', width: '140px', styleclass : 'font-blue', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(bldMgmtTypCd);
							return render_data;
						} else {
							data.bldMgmtTypCd = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in bldMgmtTypCd) {
							var exist = '';
							if (value && value.indexOf(bldMgmtTypCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+bldMgmtTypCd[i].value+' '+exist+'>'+bldMgmtTypCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'landOwnDivCd', align:'center', title : '토지소유구분', width: '120px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(landOwnDivCd);
							return render_data;
						} else {
							data.landOwnDivCd = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in landOwnDivCd) {
							var exist = '';
							if (value && value.indexOf(landOwnDivCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+landOwnDivCd[i].value+' '+exist+'>'+landOwnDivCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'bldOwnDivCd', align:'center', title : '건물소유구분', width: '120px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(bldOwnDivCd);
							return render_data;
						} else {
							data.bldOwnDivCd = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in bldOwnDivCd) {
							var exist = '';
							if (value && value.indexOf(bldOwnDivCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+bldOwnDivCd[i].value+' '+exist+'>'+bldOwnDivCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'screLandYr', align:'center', title : '토지', width: '90px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(screLandYr);
							return render_data;
						} else {
							data.screLandYr = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in screLandYr) {
							var exist = '';
							if (value && value.indexOf(screLandYr[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+screLandYr[i].value+' '+exist+'>'+screLandYr[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'screLandDivCd', align:'center', title : '토지용도', width: '140px' , filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(screLandDivCd);
							return render_data;
						} else {
							data.screLandYr = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in screLandDivCd) {
							var exist = '';
							if (value && value.indexOf(screLandDivCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+screLandDivCd[i].value+' '+exist+'>'+screLandDivCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'screBldYr', align:'center', title : '건물', width: '90px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(screBldYr);
							return render_data;
						} else {
							data.screBldYr = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in screBldYr) {
							var exist = '';
							if (value && value.indexOf(screBldYr[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+screBldYr[i].value+' '+exist+'>'+screBldYr[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'landArPyngVal', align:'center', title : '토지면적(평)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmp = value;
						if(!isNaN(tmp)) {
							return comMain.setComma(tmp);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						if (data.landArPyngVal == undefined || data.landArPyngVal == null || data.landArPyngVal == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'cbgRate', align:'center', title : '용적율(%)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmp = value;
						if(!isNaN(tmp)) {
							return comMain.setComma(tmp);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						if (data.cbgRate == undefined || data.cbgRate == null || data.cbgRate == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'bldCoverageRate', align:'center', title : '건폐율(%)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmp = value;
						if(!isNaN(tmp)) {
							return comMain.setComma(tmp);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						if (data.bldCoverageRate == undefined || data.bldCoverageRate == null || data.bldCoverageRate == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'bldArPyngVal', align:'center', title : '건평(평)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmp = value;
						if(!isNaN(tmp)) {
							return comMain.setComma(tmp);
						}
					}
				}
			},
			{ key : 'totAr', align:'center', title : '연면적(평)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(isNaN(tmp)) {tmp = 0;}
					return comMain.setComma(tmp);
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn != 'Y') {
						if (data.totAr == undefined || data.totAr == null || data.totAr == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
					}
				},
				editedValue : function(cell, data, render, mapping, grid) {
					if(data.repMtsoYn != 'Y') {
						var tmpVal = $(cell).find('input').val();
						var topVal = tmpVal;
						if (isNaN(topVal)) {topVal = 0;}
						var dataObj = $('#'+landBldGridId).alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
						for(var i in dataObj) {
							if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].totAr != undefined  && dataObj[i].totAr != null) {
								var objVal = dataObj[i].totAr
								if (isNaN(objVal)) {objVal = 0;}
								tmpVal = parseInt(tmpVal)+parseInt(objVal);
								if (parseInt(topVal) < parseInt(objVal)) {
									topVal = objVal;
								}
							}
						}
						if(data.repMtsoYn != 'Y') {
							$('#'+landBldGridId).alopexGrid('dataEdit',{totAr:tmpVal,bldArPyngVal:topVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						}

					}
					return $(cell).find('input').val();
				}
			},
			// 수기입력불가 항목 (AFE 1차에는 수동 가능)
			{ key : 'upsdAcptRackCnt', align:'center', title : '수용가능랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) {
						return comMain.setComma(tmp);
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn != 'Y') {
						if (data.upsdAcptRackCnt == undefined || data.upsdAcptRackCnt == null || data.upsdAcptRackCnt == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
					}
				},
				editedValue : function(cell, data, render, mapping, grid) {
					var tmpVal = parseInt($(cell).find('input').val());
					if (isNaN(tmpVal)) {tmpVal = 0;}
					var topVal = tmpVal;
					var dataObj = $('#'+landBldGridId).alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
					for(var i in dataObj) {
						if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].upsdAcptRackCnt != undefined  && dataObj[i].upsdAcptRackCnt != null) {
							var objVal = parseInt(dataObj[i].upsdAcptRackCnt);
							if (isNaN(objVal)) {objVal = 0;}
							tmpVal = parseInt(tmpVal)+parseInt(objVal);
							if (parseInt(topVal) < parseInt(objVal)) {
								topVal = objVal;
							}
						}
					}
					if(data.repMtsoYn != 'Y') {
						$('#'+landBldGridId).alopexGrid('dataEdit',{upsdAcptRackCnt:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
					}
					return $(cell).find('input').val();
				}
			},
			{ key : 'upsdFcltsRackCnt', align:'center', title : '시설랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) {
						return comMain.setComma(tmp);
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn != 'Y') {
						if (data.upsdFcltsRackCnt == undefined || data.upsdFcltsRackCnt == null || data.upsdFcltsRackCnt == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="'+strVal+'"/></div>';
					}
				},
				editedValue : function(cell, data, render, mapping, grid) {
					var tmpVal = parseInt($(cell).find('input').val());
					if (isNaN(tmpVal)) {tmpVal = 0;}
					var topVal = tmpVal;
					var dataObj = $('#'+landBldGridId).alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
					for(var i in dataObj) {
						if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].upsdFcltsRackCnt != undefined  && dataObj[i].upsdFcltsRackCnt != null) {
							var objVal = parseInt(dataObj[i].upsdFcltsRackCnt);
							if (isNaN(objVal)) {objVal = 0;}
							tmpVal = parseInt(tmpVal)+parseInt(objVal);
							if (parseInt(topVal) < parseInt(objVal)) {
								topVal = objVal;
							}
						}
					}
					if(data.repMtsoYn != 'Y') {
						$('#'+landBldGridId).alopexGrid('dataEdit',{upsdFcltsRackCnt:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
					}
					return $(cell).find('input').val();
				}
			},
			{ key : 'upsdIdleRackCnt', align:'center', title : '유휴랙수', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					tmp = setIsNaNCheck(parseInt(data.upsdAcptRackCnt)) - setIsNaNCheck(parseInt(data.upsdFcltsRackCnt));
					if(isNaN(tmp)) {tmp = 0;}
					return comMain.setComma(tmp);
				},
				editedValue : function(cell, data, render, mapping, grid) {
					var tmpVal = parseInt($(cell).find('input').val());
					if (isNaN(tmpVal)) {tmpVal = 0;}
					var topVal = tmpVal;
					var dataObj = $('#'+landBldGridId).alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
					for(var i in dataObj) {
						if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].upsdIdleRackCnt != undefined  && dataObj[i].upsdIdleRackCnt != null) {
							var objVal = parseInt(dataObj[i].upsdIdleRackCnt);
							if (isNaN(objVal)) {objVal = 0;}
							tmpVal = parseInt(tmpVal)+parseInt(objVal);
							if (parseInt(topVal) < parseInt(objVal)) {
								topVal = objVal;
							}
						}
					}
					if(data.repMtsoYn != 'Y') {
						$('#'+landBldGridId).alopexGrid('dataEdit',{upsdIdleRackCnt:tmpVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
					}
					return $(cell).find('input').val();
				}
			},
			{ key : 'upsdUseRate', align:'center', title : '사용율(%)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var upsdFcltsRackCnt = data.upsdFcltsRackCnt;
					if (isNaN(upsdFcltsRackCnt)) {upsdFcltsRackCnt = 0;}
					var upsdAcptRackCnt = data.upsdAcptRackCnt;
					if (isNaN(upsdAcptRackCnt)) {upsdAcptRackCnt = 0;}
					if (upsdFcltsRackCnt == 0 || upsdAcptRackCnt == 0) {
						return 0;
					} else {
						var tmpCnt =  parseInt((upsdFcltsRackCnt / upsdAcptRackCnt)*100);
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}

				},
				editable : function(value, data) {
					var upsdFcltsRackCnt = data.upsdFcltsRackCnt;
					if (isNaN(upsdFcltsRackCnt)) {upsdFcltsRackCnt = 0;}
					var upsdAcptRackCnt = data.upsdAcptRackCnt;
					if (isNaN(upsdAcptRackCnt)) {upsdAcptRackCnt = 0;}

					var tmpCnt = 0;
					if (upsdFcltsRackCnt == 0 || upsdAcptRackCnt == 0) {
					} else {
						tmpCnt =  parseInt((upsdFcltsRackCnt / upsdAcptRackCnt)*100);
					}
					var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
					return '<div><input type="text" readonly style="'+strCss+'" value="'+tmpCnt+'" "/></div>';
				}
			},
			{ key : 'landEtcColVal1', align:'center', title : '기타1', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal2', align:'center', title : '기타2', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal3', align:'center', title : '기타3', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal4', align:'center', title : '기타4', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal5', align:'center', title : '기타5', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal6', align:'center', title : '기타6', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal7', align:'center', title : '기타7', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal8', align:'center', title : '기타8', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal9', align:'center', title : '기타9', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'landEtcColVal10', align:'center', title : '기타10', width: '100px',
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

    this.landBldInitGrid = function() {
    	$('#'+landBldGridId).alopexGrid('dataEmpty');
    	var headerMappingN = [
								  			 {fromIndex:8, toIndex:22, title:"토지/건물/상면 정보", id : "Top"} // 최상단 그룹
								   			 ,{fromIndex:8, toIndex:10, title:"관리/소유"}
								   			 ,{fromIndex:11, toIndex:13, title:"확보년도"}
								   			 ,{fromIndex:14, toIndex:18, title:"규모"}
								   			 ,{fromIndex:19, toIndex:22, title:"상면정보"}
								   			,{fromIndex:23, toIndex:32, title:"기타항목", id : "Top"}
				   			 		   ];
        //그리드 생성
        $('#'+landBldGridId).alopexGrid({
        	parger : true,
        	paging : {
				pagerSelect: false,
				pagerTotal : true
				,hidePageList: true  // pager 중앙 삭제
			},
			defaultColumnMapping:{
    			sorting : true
    		},
    		fullCompareForEditedState: true,
			autoColumnIndex: true,
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
    		columnMapping: landBldInf.landBldGridCol() ,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['mtsoInvtId', 'mtsoId', 'repMtsoId', 'repMtsoYn'];

    	$('#'+landBldGridId).alopexGrid("hideCol", hideColList, 'conceal');

    	for(var i = 0; i < publicLandBldHideCol.length; i++){
			if (publicLandBldHideCol[i].mtsoInvtItmHidYn == 'N') {
				$('#'+landBldGridId).alopexGrid('updateColumn', {title : publicLandBldHideCol[i].mtsoInvtItmNm}, publicLandBldHideCol[i].mtsoInvtItmVal);
			} else {
				$('#'+landBldGridId).alopexGrid('updateColumn', {hidden : true}, publicLandBldHideCol[i].mtsoInvtItmVal);
			}
		}
	}


    function landBldSetEventListener() {

    	$('#'+landBldGridId).on('rowInlineEditEnd',function(e){
			var param = AlopexGrid.parseEvent(e).data;

			var userId;
			 if($("#userId").val() == ""){
				 userId = "SYSTEM";
			 }else{
				 userId = $("#userId").val();
			 }

			 param.frstRegUserId = userId;
			 param.lastChgUserId = userId;


			 $('#'+landBldGridId).alopexGrid('dataFlush', function(editedDataList){

				 var result = $.map(editedDataList, function(el, idx){ return el.mtsoInvtId;})

				if (result.length > 0) {
					 var ckGubun = $("input:radio[name=landBldGubun][value='T']").is(":checked") ? true : false;

					 if (ckGubun) {
						 httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/mergeLandBldInf', param, 'POST', 'LandBldInf');
					 }
				}
			 });



    	});

    	 $('#btnLandBldExportExcel').on('click', function(e) {

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

 			var worker = new ExcelWorker({
 				excelFileName : '토지건물정보_'+recentYMD,
 				sheetList : [{
 					sheetName : '토지건물정보',
 					$grid : $("#"+landBldGridId)
 				}]
 			});
 			worker.export({
 				merge : true,
 				useCSSParser : true,
 				useGridColumnWidth : true,
 				border : true,
// 				exportNumberingColumn : true,
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
         });

    };


	//request 성공시
    function successCallback(response, status, jqxhr, flag){


    	// 건물관리주체
    	if(flag == 'bldMgmtTypList'){

    		bldMgmtTypCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				bldMgmtTypCd.push(resObj);
			}
    	}

    	// 토지소유구분
    	if(flag == 'landOwnDivList'){

    		landOwnDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				landOwnDivCd.push(resObj);
			}
    	}

    	// 건물소유구분
    	if(flag == 'bldOwnDivList'){

    		bldOwnDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				bldOwnDivCd.push(resObj);
			}
    	}

    	//토지용도
    	if(flag == 'screLandDivList'){

    		screLandDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				screLandDivCd.push(resObj);
			}
    	}

    	if(flag == 'search'){

    		$('#'+landBldGridId).alopexGrid('hideProgress');

    		setSPGrid(landBldGridId, response, response.landBldInfList);
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
       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : landBldScrollOffset.column}});
       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});
	}

    this.setGrid = function(page, rowPerPage) {

    	landBldScrollOffset = $('#'+landBldGridId).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#landBldInfPageNo').val(page);
    	$('#landBldInfRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	var subParam =  $("#landBldInfForm").getData();
    	var page = $('#landBldInfPageNo').val();
    	var rowPerPage = $('#landBldInfRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+landBldGridId).alopexGrid('showProgress')
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getLandBldInfList', param, 'GET', 'search');

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