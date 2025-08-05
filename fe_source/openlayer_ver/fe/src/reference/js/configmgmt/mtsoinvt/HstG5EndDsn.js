/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var g5EndDsn = $a.page(function() {

	var g5EndGridId = 'g5EndDataGrid';
	var subg5EndDataGrid= 'subg5EndDataGrid';
	var paramData = null;
	var shtgItmCd		= [];

    this.init = function(id, param) {
    	g5EndDsnSetSelectCode();
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
			{ key : 'lastChgDate', align:'center', title : '저장 일시', width: '150px' },
			{ key : 'lastChgUserId', align:'center', title : '사용ID', width: '100자px' },
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
				}
			},
			{ key : 'loadEpwrRate', align:'center', title : '부하율(%)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  Math.round((setIsNaNCheck(parseInt(data.loadEpwrVal)) / setIsNaNCheck(parseInt(data.ctrtEpwrVal)))*100,3);
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
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
				}
			},
			{ key : 'trmsRackSubtCnt', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnCnt)) + setIsNaNCheck(parseInt(data.trmsIvrCnt)) + setIsNaNCheck(parseInt(data.trmsIvrrCnt)) + setIsNaNCheck(parseInt(data.trms5gponCnt)) + setIsNaNCheck(parseInt(data.trmsSmuxCnt)) + setIsNaNCheck(parseInt(data.trmsFdfCnt));
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
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
				}
			},
			{ key : 'trmsSubtEpwrVal', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  setIsNaNCheck(parseInt(data.trmsRotnEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrEpwrVal)) + setIsNaNCheck(parseInt(data.trmsIvrrEpwrVal)) + setIsNaNCheck(parseInt(data.trms5gponEpwrVal));
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
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
				}
			},
			{ key : 'sbeqpSubtCnt', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  setIsNaNCheck(parseInt(data.sbeqpRtfRackCnt)) + setIsNaNCheck(parseInt(data.sbeqpIpdCnt)) + setIsNaNCheck(parseInt(data.sbeqpArcnCnt)) + setIsNaNCheck(parseInt(data.sbeqpBatryLipoCnt)) +  setIsNaNCheck(parseInt(data.sbeqpBatryCnt));
					if (isNaN(tmpCnt)) tmpCnt = "0";
					if(data.repMtsoYn == 'Y') {
						return comMain.setComma(tmpCnt);
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
				}
			},
			{ key : 'endEtcColVal1', align:'center', title : '기타1', width: '100px'},
			{ key : 'endEtcColVal2', align:'center', title : '기타2', width: '100px'},
			{ key : 'endEtcColVal3', align:'center', title : '기타3', width: '100px'},
			{ key : 'endEtcColVal4', align:'center', title : '기타4', width: '100px'},
			{ key : 'endEtcColVal5', align:'center', title : '기타5', width: '100px'},
			{ key : 'endEtcColVal6', align:'center', title : '기타6', width: '100px'},
			{ key : 'endEtcColVal7', align:'center', title : '기타7', width: '100px'},
			{ key : 'endEtcColVal8', align:'center', title : '기타8', width: '100px'},
			{ key : 'endEtcColVal9', align:'center', title : '기타9', width: '100px'},
			{ key : 'endEtcColVal10', align:'center', title : '기타10', width: '100px'}

		];

    	return colList;
    }

    this.g5EndDsnInitGrid = function() {
    	$('#'+g5EndGridId).alopexGrid('dataEmpty');
    	var headerMappingN =  [
			 {fromIndex:10, toIndex:12, title:"현재 전력"}
    		,{fromIndex:13, toIndex:14, title:"2G FadeOut"}
    		,{fromIndex:15, toIndex:17, title:"국사 통폐합"}
    		,{fromIndex:18, toIndex:21, title:"-"}
    		,{fromIndex:22, toIndex:28, title:"전송 랙수(개)"}
    		,{fromIndex:29, toIndex:33, title:"전송 전력량(kW)"}
    		,{fromIndex:34, toIndex:39, title:"부대물자 랙수(개)"}
    		,{fromIndex:40, toIndex:41, title:"상면 종국 수요"}
    		,{fromIndex:42, toIndex:47, title:"잔여/누적"}
    		,{fromIndex:48, toIndex:57, title:"기타항목"}
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
    		height : '5row',
			rowInlineEdit: false,
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
			columnFixUpto : 'lastChgUserId',
			headerGroup : headerMappingN,
    		columnMapping: g5EndDsn.g5EndDsnGridCol(),

//    		data:data,

			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+subg5EndDataGrid).alopexGrid({
        	parger : false,
			defaultColumnMapping:{
    			sorting : true
    		},
    		//fullCompareForEditedState: true,
			autoColumnIndex: true,
			rowInlineEdit: false,
			autoResize: true,
			//columnFixUpto : 'lastChgUserId',
			headerGroup : headerMappingN,
    		columnMapping: g5EndDsn.g5EndDsnGridCol(),
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['mtsoInvtId', 'mtsoId', 'repMtsoId', 'repMtsoYn'];

    	$('#'+g5EndGridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+subg5EndDataGrid).alopexGrid("hideCol", hideColList, 'conceal');

    	for(var i = 0; i < publicEndHideCol.length; i++){
			if (publicEndHideCol[i].mtsoInvtItmHidYn == 'N') {
				$('#'+g5EndGridId).alopexGrid('updateColumn', {title : publicEndHideCol[i].mtsoInvtItmNm}, publicEndHideCol[i].mtsoInvtItmVal);
				$('#'+subg5EndDataGrid).alopexGrid('updateColumn', {title : publicEndHideCol[i].mtsoInvtItmNm}, publicEndHideCol[i].mtsoInvtItmVal);
			} else {
				$('#'+g5EndGridId).alopexGrid('updateColumn', {hidden : true}, publicEndHideCol[i].mtsoInvtItmVal);
				$('#'+subg5EndDataGrid).alopexGrid('updateColumn', {hidden : true}, publicEndHideCol[i].mtsoInvtItmVal);
			}
		}

	}

    function g5EndDsnSetEventListener() {

    	$('#'+g5EndGridId).on('click', '.bodycell', function(e){
    		$('#'+subg5EndDataGrid).show();
			var dataObj = AlopexGrid.parseEvent(e).data;

			var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";

			var data = {mtsoInvtId: dataObj.mtsoInvtId, srchDt : srchDt};
			subSetGrid(data);
		});

    	 $('#btnG5EndExportExcel').on('click', function(e) {
    		var userId 		= $('#userId').val();
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
 				excelFileName : '이력_5G종국설계_'+recentYMD,
 				sheetList : [{
 					sheetName : '5G종국설계',
 					$grid : $("#"+g5EndGridId)
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


    function subSetGrid(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getSubHstG5EndDsnList', data, 'GET', 'subSearch');
    }
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

    	if(flag == 'subSearch'){
    		$('#'+subg5EndDataGrid).alopexGrid('hideProgress');
    		$('#'+subg5EndDataGrid).alopexGrid('dataSet', response.mtsoInvtDsnList);
    		//setSPGrid(subMtsoInfDataGrid, response, response.mtsoInvtDsnList);
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
	}

    this.setGrid = function(page, rowPerPage) {
        //this.setGrid = function(page, rowPerPage){ // this 쓰면 permission denied 되서 함수 접근못함.[20171121]

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";
    	param.srchDt = srchDt;
    	param.pageNo = page;
    	param.rowPerPage = rowPerPage;

		$('#'+g5EndGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getHstG5EndDsnList', param, 'GET', 'search');

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