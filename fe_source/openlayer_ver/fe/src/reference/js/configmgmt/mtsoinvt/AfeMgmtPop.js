/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var main = $a.page(function() {
	var g5Grid = 'g5Grid';
	var invtParam = "";
	var objStaMthData = 0;
	var objEndMthData = 0;
	var useYnData = 'N';
	var grClsDivCd = [{value : 'Y', text : 'Lock'}, {value : 'N', text : '해제'}];
	var pageGubun = '';
	this.init = function(id, param) {

		pageGubun = param.pageGubun;
		if (pageGubun != 'fctinvt') {
			$('#pageFct').css('display','none');
		}


		initGrid();
		setSelectCode();
		setEventListener();
	};


	function initGrid() {
		$('#'+g5Grid).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			pager : false,
			autoColumnIndex: true,
			height : '8row',
			autoResize: true,
			rowClickSelect : false,
            rowSingleSelect : false,
			rowInlineEdit: true,
			cellSelectable : false,
			numberingColumnFromZero: false,
			defaultState : {
//				dataSet : {editing : true}
			},
			columnMapping: [
				{ key : 'afeDgr', align:'center', title : '차수',
					render : function(value, data, render, mapping){
						return numberPad(value,3)
					}
				},
				{ key : 'useYn', align:'center', title : '화면출력', width: '60', resizing: false,
					render : function(value, data, render, mapping){
						if (value == "Y") {
							return '<font style="color:green">출력</>';
						} else {
							return '<font style="color:red">미출력</>';
						}
					},
					editable : {type:'checkbox', rule : [{value:'Y', checked:true},{value:'N', checked:false}]},
					editedValue : function (cell) {
						return $(cell).find('input').is(':checked') ? 'Y':'N';
					}
				},
				{ key : 'clsDivCd', align:'center', title : 'Lock', width: '60',
					render : function(value, data, render, mapping){
						if (value == "N") {
							return '<font style="color:red">Lock</>';
						} else {
							return '<font style="color:green">해제</>';
						}
					},
					editable : {type:'checkbox', rule : [{value:'Y', checked:true},{value:'N', checked:false}]},
					editedValue : function (cell) {
						return $(cell).find('input').is(':checked') ? 'Y':'N';
					}
				},
				],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});



		gridHide();
	}

	function gridHide() {
		if (pageGubun == 'fctinvt') {
			var hideColList = [];
			$('#'+g5Grid).alopexGrid("hideCol", hideColList, 'conceal');
		} else {
			var hideColList = ['clsDivCd'];
			$('#'+g5Grid).alopexGrid("hideCol", hideColList, 'conceal');
		}
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {

		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeYr', '', 'GET', 'afeYrInf'); // AFE 년도

	}


	function setEventListener() {
		// AFE 년도 선택
		$('#afeYr').on('change', function(e) {
			$('#'+g5Grid).alopexGrid('showProgress');
			var afeYr		= $('#afeYr').val();
			var afeDivCd	= 'G5';
			var paramData = {afeYr : afeYr, afeDivCd : afeDivCd};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', paramData, 'GET', 'g5AfeDgrInf'); // 5G AFE 차수

		});

		/**********************************************************
		*	5G AFE 차수 수정 START
		**********************************************************/
		// 수정된 컬럼이 있는지 여부를 체크하기 위함.
		$('#'+g5Grid).on('rowInlineEditStart',function(e){
			var data 			= AlopexGrid.parseEvent(e).data;
			objStaMthData		= data.objStaMth;
			objEndMthData		= data.objEndMth;
			useYnData			= data.useYn;
			clsDivCdData		= data.clsDivCd;
        });
		// 저장
		$('#'+g5Grid).on('rowInlineEditEnd',function(e){
			var data 			= AlopexGrid.parseEvent(e).data;
			var useYn 		= data.useYn;
			var afeDgr 		= data.afeDgr;
			var afeYr		= data.afeYr;
			var afeDivCd	= 'G5';
			var clsDivCd	= data.clsDivCd;
			var objStaMth 	= data.objStaMth;
			var objEndMth 	= data.objEndMth;
			var userId 		= $('#userId').val();
			var paramData 	= {afeYr : afeYr, afeDgr : afeDgr, afeDivCd : afeDivCd, useYn : useYn, objStaMth : objStaMth, objEndMth : objEndMth, userId : userId, clsDivCd : clsDivCd};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setAfeDgr', paramData, 'POST', 'saveAfeDgr');
//			if (useYnData == data.useYn && objStaMthData == data.objStaMthData && objEndMthData == data.objEndMth) {
//			} else {
//				if (parseInt(data.objStaMth) > parseInt(data.objEndMth)) {
//					callMsgBox('','W', "설정하신 종료일이 시작월보다 작습니다.(저장불가)", function(msgId, msgRst){});
//					//$('#'+g5Grid).alopexGrid('dataEdit',{objEndMth:data.objStaMth},{afeDgr:data.afeDgr.toString()});
//				} else {
//
//				}
//			}
        });
		/**********************************************************
		*	5G AFE 차수 수정 END
		**********************************************************/
		/**********************************************************
		*	국사 AFE 차수 수정 START
		**********************************************************/

		/**********************************************************
		*	국사 AFE 차수 수정 END
		**********************************************************/
		// 닫기
		$('#btnCancel').on('click', function(e) {
			$a.close();
		});
	};

	function numberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}

	function successCallback(response, status, jqxhr, flag) {
		if(flag == 'afeYrInf'){
			$('#afeYr').clear();
			var option_data = [];
			for(var i=0; i<response.afeYrList.length; i++){
				var resObj = {cd : response.afeYrList[i].afeYr, cdNm : response.afeYrList[i].afeYr+"년도"};
				option_data.push(resObj);
			}
			$('#afeYr').setData({ data : option_data, option_selected: '2020' });



			$('#'+g5Grid).alopexGrid('showProgress');
			var afeYr		= $('#afeYr').val();
			var afeDivCd	= 'G5';
			var paramData = {afeYr : afeYr, afeDivCd : afeDivCd};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDgr', paramData, 'GET', 'g5AfeDgrInf'); // 5G AFE 차수

		}
		if(flag == 'g5AfeDgrInf'){
			$('#'+g5Grid).alopexGrid('hideProgress');
			var serverPageinfo = {dataLength : 0,current : 1, perPage : 10};
			$('#'+g5Grid).alopexGrid('dataSet', response.afeDgrList, serverPageinfo);


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

