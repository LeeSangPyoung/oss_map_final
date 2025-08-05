/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var InvtIntgPlan = $a.page(function() {

	var invtIntgGridId = 'invtIntgDataGrid';
	var subinvtIntgDataGrid = 'subinvtIntgDataGrid';
	var paramData = null;

	var nbdG5AcptDivCd		= [];
	var nbdUpsdShtgRsn		= [];
	var nbdUpsdRmdyDivCd		= [];
	var areaInvtYr		= [];
	var hdqtrInvtYr		= [];
	var closMtsoYn		= [];


    this.init = function(id, param) {
    	invtIntgSetSelectCode();
    	//invtIntgInitGrid();
    	invtIntgSetEventListener();
    };


	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function invtIntgSetSelectCode() {

    	// 5G수용계획
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/G5ACPTCD', null, 'GET', 'nbdG5AcptDivList');
		 // 상면부족사유
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/UPSDRSN', null, 'GET', 'nbdUpsdShtgRsnList');
		 // 상면부족해소방안
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/RMDYCD', null, 'GET', 'nbdUpsdRmdyDivList');
//		 //폐국대상여부
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/CLOSYN', null, 'GET', 'closMtsoYnList');

		 var d = new Date();
		 var year = d.getFullYear();
			for(i = year - 30; i < year + 6; i++) {
				var yearObj = {value : i, text : i};
				areaInvtYr.push(yearObj);
				hdqtrInvtYr.push(yearObj);
			}
    }

    this.invtIntgGridCol = function() {
    	var colList = [];

    	colList =  [
			{ key : 'mtsoId', align:'center', title : '국사ID', width: '100px' },		// 숨김
			{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '100px' },		// 숨김
			{ key : 'lastChgDate', align:'center', title : '저장 일시', width: '150px' },
			{ key : 'lastChgUserId', align:'center', title : '사용자ID', width: '100자px' },
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
			{ key : 'nbdG5AcptDivCd', align:'center', title : '5G수용계획', width: '120px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(nbdG5AcptDivCd);
							return render_data;
						} else {
							data.nbdG5AcptDivCd = '';
						}
					}
				}
			},
			{ key : 'nbdG5AcptRsn', align:'left', title : '5G 임시수용사유 및 향후계획', width: '250px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.nbdG5AcptRsn = '';
						}
					}
				}
			},
			{ key : 'nbdUpsdShtgRsn', align:'center', title : '상면부족사유', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(nbdUpsdShtgRsn);
							return render_data;
						} else {
							data.nbdUpsdShtgRsn = '';
						}
					}
				}
			},
			{ key : 'nbdUpsdRmdyDivCd', align:'center', title : '상면부족해소방안', width: '120px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(nbdUpsdRmdyDivCd);
							return render_data;
						} else {
							data.nbdUpsdRmdyDivCd = '';
						}
					}
				}
			},
			{ key : 'areaInvtYr', align:'center', title : '투자시기(지역)', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(areaInvtYr);
							return render_data;
						} else {
							data.areaInvtYr = '';
						}
					}
				}
			},
			{ key : 'hdqtrInvtYr', align:'center', title : '투자시기(본사)', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(hdqtrInvtYr);
							return render_data;
						} else {
							data.hdqtrInvtYr = '';
						}
					}
				}
			},
			{ key : 'newMtsoNm', align:'center', title : '신규통합국명', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.newMtsoNm = '';
						}
					}
				}
			},
			{ key : 'exstMtsoNm', align:'center', title : '기존통합국명', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.exstMtsoNm = '';
						}
					}
				}
			},
			{ key : 'closMtsoYn', align:'center', title : '폐국대상여부', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(closMtsoYn);
							return render_data;
						} else {
							data.closMtsoYn = '';
						}
					}
				}
			},
			{ key : 'diffMtsoNm', align:'center', title : '이설국사명', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.diffMtsoNm = '';
						}
					}
				}
			},
			{ key : 'mtsoDiffCost', align:'center', title : '이설비용(백만원)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				}
			},
			{ key : 'mtsoLesCost', align:'center', title : '현임차료(백만원/월)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				}
			},
			{ key : 'diffScdleVal', align:'center', title : '이설시기', width: '100px', exportDataType: 'number',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						}
					}
				}
			},
			{ key : 'invtIntgRmk', align:'left', title : '비고', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						}
					}
				}
			},
			{ key : 'intgEtcColVal1', align:'center', title : '기타1', width: '100px'},
			{ key : 'intgEtcColVal2', align:'center', title : '기타2', width: '100px'},
			{ key : 'intgEtcColVal3', align:'center', title : '기타3', width: '100px'},
			{ key : 'intgEtcColVal4', align:'center', title : '기타4', width: '100px'},
			{ key : 'intgEtcColVal5', align:'center', title : '기타5', width: '100px'},
			{ key : 'intgEtcColVal6', align:'center', title : '기타6', width: '100px'},
			{ key : 'intgEtcColVal7', align:'center', title : '기타7', width: '100px'},
			{ key : 'intgEtcColVal8', align:'center', title : '기타8', width: '100px'},
			{ key : 'intgEtcColVal9', align:'center', title : '기타9', width: '100px'},
			{ key : 'intgEtcColVal10', align:'center', title : '기타10', width: '100px'}
		];

    	return colList
    }

    this.invtIntgInitGrid = function() {
    	$('#'+invtIntgGridId).alopexGrid('dataEmpty');
    	var headerMappingN =  [
			 {fromIndex:10, toIndex:23, title:"국사 신규 및 통폐합", id: "Top"} // 최상단 그룹

			 ,{fromIndex:10, toIndex:15, title:"국사 신축 검토"}
    		,{fromIndex:16, toIndex:17, title:"신규/기존 국사명"}
    		,{fromIndex:18, toIndex:23, title:"국사 통폐합"}
    		,{fromIndex:24, toIndex:33, title:"기타항목"}
    		];

        //그리드 생성
        $('#'+invtIntgGridId).alopexGrid({
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
    		columnMapping: InvtIntgPlan.invtIntgGridCol(),

//    		data:data,

			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });


        $('#'+subinvtIntgDataGrid).alopexGrid({
        	parger : false,
			defaultColumnMapping:{
    			sorting : true
    		},
			autoColumnIndex: true,
			rowInlineEdit: false,
			autoResize: true,
			headerGroup : headerMappingN,
    		columnMapping: InvtIntgPlan.invtIntgGridCol(),
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['mtsoInvtId', 'mtsoId', 'repMtsoId', 'repMtsoYn'];

    	$('#'+invtIntgGridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+subinvtIntgDataGrid).alopexGrid("hideCol", hideColList, 'conceal');
    	for(var i = 0; i < publicIntgHideCol.length; i++){
			if (publicIntgHideCol[i].mtsoInvtItmHidYn == 'N') {
				$('#'+invtIntgGridId).alopexGrid('updateColumn', {title : publicIntgHideCol[i].mtsoInvtItmNm}, publicIntgHideCol[i].mtsoInvtItmVal);
				$('#'+subinvtIntgDataGrid).alopexGrid('updateColumn', {title : publicIntgHideCol[i].mtsoInvtItmNm}, publicIntgHideCol[i].mtsoInvtItmVal);
			} else {
				$('#'+invtIntgGridId).alopexGrid('updateColumn', {hidden : true}, publicIntgHideCol[i].mtsoInvtItmVal);
				$('#'+subinvtIntgDataGrid).alopexGrid('updateColumn', {hidden : true}, publicIntgHideCol[i].mtsoInvtItmVal);
			}
		}

	}


    function invtIntgSetEventListener() {

    	$('#'+invtIntgGridId).on('click', '.bodycell', function(e){
    		$('#'+subinvtIntgDataGrid).show();
			var dataObj = AlopexGrid.parseEvent(e).data;

			var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";

			var data = {mtsoInvtId: dataObj.mtsoInvtId, srchDt : srchDt};
			subSetGrid(data);
		});

    	 $('#btnInvtIntgExportExcel').on('click', function(e) {
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

 			$('#'+invtIntgGridId).alopexGrid("showCol", 'mtsoInvtId');
 			var worker = new ExcelWorker({
 				excelFileName : '이력_통폐합계획_'+recentYMD,
 				sheetList : [{
 					sheetName : '통폐합계획',
 					$grid : $("#"+invtIntgGridId)
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

 			$('#'+invtIntgGridId).alopexGrid("hideCol", 'mtsoInvtId', 'conceal');
         });

    };

    function subSetGrid(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getSubHstInvtIntgPlanList', data, 'GET', 'subSearch');
    }

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	// 5G수용계획
    	if(flag == 'nbdG5AcptDivList'){

    		nbdG5AcptDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				nbdG5AcptDivCd.push(resObj);
			}
    	}

    	// 상면부족사유
    	if(flag == 'nbdUpsdShtgRsnList'){

    		nbdUpsdShtgRsn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				nbdUpsdShtgRsn.push(resObj);
			}
    	}

    	// 상면부족해소방안
    	if(flag == 'nbdUpsdRmdyDivList'){

    		nbdUpsdRmdyDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				nbdUpsdRmdyDivCd.push(resObj);
			}
    	}

    	//폐국대상여부
    	if(flag == 'closMtsoYnList'){

    		closMtsoYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				closMtsoYn.push(resObj);
			}
    	}

    	if(flag == 'search'){

    		$('#'+invtIntgGridId).alopexGrid('hideProgress');

    		setSPGrid(invtIntgGridId, response, response.invtIntgPlanList);
    	}

    	if(flag == 'subSearch'){
    		$('#'+subinvtIntgDataGrid).alopexGrid('hideProgress');
    		$('#'+subinvtIntgDataGrid).alopexGrid('dataSet', response.mtsoInvtDsnList);
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

    	$('#invtIntgPageNo').val(page);
    	$('#invtIntgRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}
    	var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";
    	param.srchDt = srchDt;
    	var subParam =  $("#invtIntgPageNo").getData();
    	var page = $('#invtIntgPageNo').val();
    	var rowPerPage = $('#invtIntgRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+invtIntgGridId).alopexGrid('showProgress')
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getHstInvtIntgPlanList', param, 'GET', 'search');

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