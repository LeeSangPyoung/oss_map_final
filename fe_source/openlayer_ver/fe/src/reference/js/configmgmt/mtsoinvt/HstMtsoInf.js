/**
 * MtsoInf.js
 *
 * @author Administrator
 * @date 2020. 03. 03. 오전 17:30:03
 * @version 1.0
 */

var mtsoInf = $a.page(function() {

	var mtsoInfDataGridId = 'mtsoInfDataGrid';
	var subMtsoInfDataGrid = 'subMtsoInfDataGrid';
	var paramData = null;

	var step2Cd_0 	= [{value : 'T11001', text : '수도권'}];
	var step2Cd_1 	= [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var step2Cd_2 	= [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var step2Cd_3 	= [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];
	var step1Cd 	= [{value : 'T11000', text : '수도권'},{value : 'T12000', text : '동부'},{value : 'T13000', text : '서부'},{value : 'T14000', text : '중부'}];
	var step1To2 	= {'T11000' : step2Cd_0, 'T12000': step2Cd_1, 'T13000' : step2Cd_2, 'T14000' : step2Cd_3};

	var grUsgTypCd	= [];
	var grLaraCd	= [];
	var grDntnYn	= [];
	var grNewYnCd	= [];
    this.init = function(id, param) {
    	mtosInfSetSelectCode();
    	//mtosInfInitGrid();
    	mtosInfSetEventListener();

    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function mtosInfSetSelectCode() {
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/MTSOUSG', null, 'GET', 'mtsoUsgList');	// 층 용도
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/DNTNYN', null, 'GET', 'dntnYnList');	// 도심/외곽여부
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LARACD', null, 'GET', 'laraCdList');	// 권역 구분
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/NEWYNCD', null, 'GET', 'newYnList');	// 신규/기존여부

    }


    this.mtosInfInitGrid = function() {

    	var headerMappingN =  [
			 {fromIndex:6, toIndex:13, title:"기본정보"},
			 {fromIndex:14, toIndex:24, title:"위치정보"},
			 {fromIndex:25, toIndex:34, title:"기타항목"}
    		];

        //그리드 생성
        $('#'+mtsoInfDataGridId).alopexGrid({
        	paging : {
				pagerSelect: [2000,5000]
				,hidePageList: true  // pager 중앙 삭제
				,pagerSelect: false
			},
			defaultColumnMapping:{
    			sorting : true
    		},
    		height : '5row',
    		fullCompareForEditedState: true,
			autoColumnIndex: true,
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
    		columnMapping: [
    			{ key : 'lastChgDate', align:'center', title : '저장 일시', width: '150px' },
    			{ key : 'lastChgUserId', align:'center', title : '사용ID', width: '100자px' },

    			{ key : 'demdHdofcCd', align:'center', title : '본부', width: '70', styleclass : 'font-blue', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(step1Cd);
								return render_data;
							} else {
								data.demdHdofcCd = '';
							}
						}
					}
				},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '70', styleclass : 'font-blue', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								var currentData = AlopexGrid.currentData(data);
								if (step1To2[currentData.demdHdofcCd]) {
									render_data = render_data.concat(step1To2[currentData.demdHdofcCd]);
								}
								return render_data;
							} else {
								data.demdAreaCd = '';
							}
						}
					}
				},
				{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						}
					}
				},
				{ key : 'floorNm', align:'center', title : '층명', width: '150px',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'N') {
							return value;
						}
					}
				},
				{ key : 'newExstDivCd', align:'center', title : '신규/기존', width: '100px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNewYnCd);
								return render_data;
							} else {
								data.newExstDivCd = '';
							}
						}
					}
				},
				{ key : 'bldFlorNo', align:'center', title : '층 정보', width: '100px' },
    			{ key : 'usgTypCd', align:'center', title : '층용도', width: '200px', styleclass : 'font-orange', filter : {useRenderToFilter : true},
					render : function(value, data, render, mapping){
						var strText = '';
						if (value != undefined && value != null && value != ""){
							var usgTypCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

							var names = [];
							var uniqueNames = [];
							for(i=0; i < usgTypCd.length; i++) {
								names.push(usgTypCd[i]);
							}
							$.each(names, function(i, el){
								if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
							})
							for(i=0; i < uniqueNames.length; i++) {
								for(var j=0; j < grUsgTypCd.length; j++) {
									if (uniqueNames[i].toString() == grUsgTypCd[j].value.toString()) {
										strText += grUsgTypCd[j].text + ',';
									}
								}
							}
						}
						strText = strText.substr(0,strText.length-1);
						return strText;
					}
				},
				{ key : 'mtsoTyp', align:'center', title : '국사유형', width: '110px', filter : {useRenderToFilter : true} },
				{ key : 'bldCd', align:'center', title : '건물코드', width: '110px', filter : {useRenderToFilter : true} },
				{ key : 'siteCd', align:'center', title : '사이트키', width: '85px'},
				{ key : 'mtsoId', align:'center', title : '국사ID', width: '115px' },
				{ key : 'repIntgFcltsCd', align:'center', title : '공대코드', width: '90px' },
				{ key : 'bldAddr', align:'left', title : '주소', width: '350px' },
				{ key : 'sidoNm', align:'center', title : '시도', width: '90px' },
				{ key : 'sggNm', align:'center', title : '시군구', width: '100px' },
				{ key : 'emdNm', align:'center', title : '읍면동', width: '80px' },
				{ key : 'riNm', align:'center', title : '리', width: '80px' },
				{ key : 'addrBunjiVal', align:'center', title : '번지', width: '60px' },
				{ key : 'bldNm', align:'center', title : '건물명', width: '150px' },
				{ key : 'dongFloor', align:'center', title : '동/층', width: '100px' },
				{ key : 'laraCd', align:'center', title : '권역', width: '100px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grLaraCd);
								return render_data;
							} else {
								data.laraCd = '';
							}
						}
					}
				},
				{ key : 'dntnYn', align:'center', title : '도심/외곽', width: '80px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grDntnYn);
								return render_data;
							} else {
								data.dntnYn = '';
							}
						}
					}
				},
				{ key : 'mtsoLatValT', align:'center', title : '위도', width: '110px' },
				{ key : 'mtsoLngValT', align:'center', title : '경도', width: '110px' },

				{ key : 'dsnEtcColVal1', align:'center', title : '기타1', width: '100px'},
				{ key : 'dsnEtcColVal2', align:'center', title : '기타2', width: '100px'},
				{ key : 'dsnEtcColVal3', align:'center', title : '기타3', width: '100px'},
				{ key : 'dsnEtcColVal4', align:'center', title : '기타4', width: '100px'},
				{ key : 'dsnEtcColVal5', align:'center', title : '기타5', width: '100px'},
				{ key : 'dsnEtcColVal6', align:'center', title : '기타6', width: '100px'},
				{ key : 'dsnEtcColVal7', align:'center', title : '기타7', width: '100px'},
				{ key : 'dsnEtcColVal8', align:'center', title : '기타8', width: '100px'},
				{ key : 'dsnEtcColVal9', align:'center', title : '기타9', width: '100px'},
				{ key : 'dsnEtcColVal10', align:'center', title : '기타10', width: '100px'},
				{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', hidden : true },
				{ key : 'repMtsoId', align:'center', title : '상위국사ID', hidden : true },
				{ key : 'repMtsoYn', align:'center', title : '상위국사여부', hidden : true }


    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });


        subMtsoInfDataGridInit();
    };

    function subMtsoInfDataGridInit() {

    	var headerMappingN =  [
			 {fromIndex:6, toIndex:12, title:"기본정보"},
			 {fromIndex:13, toIndex:23, title:"위치정보"},
			 {fromIndex:24, toIndex:33, title:"기타항목"}
    		];

        //그리드 생성
        $('#'+subMtsoInfDataGrid).alopexGrid({
        	paging : {
				pagerSelect: [2000,5000]
				,hidePageList: true  // pager 중앙 삭제
				,pagerSelect: false
			},
			pager : false,
			defaultColumnMapping:{
    			sorting : true
    		},
    		fullCompareForEditedState: true,
			autoColumnIndex: true,
			rowInlineEdit: false,
			autoResize: true,
			columnFixUpto : 'lastChgUserId',
			headerGroup : headerMappingN,
    		columnMapping: [
    			{ key : 'lastChgDate', align:'center', title : '저장 일시', width: '150px' },
    			{ key : 'lastChgUserId', align:'center', title : '사용ID', width: '100자px' },
    			{ key : 'demdHdofcCd', align:'center', title : '본부', width: '100', styleclass : 'font-blue', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(step1Cd);
								return render_data;
							} else {
								data.demdHdofcCd = '';
							}
						}
					}
				},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '100', styleclass : 'font-blue', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								var currentData = AlopexGrid.currentData(data);
								if (step1To2[currentData.demdHdofcCd]) {
									render_data = render_data.concat(step1To2[currentData.demdHdofcCd]);
								}
								return render_data;
							} else {
								data.demdAreaCd = '';
							}
						}
					}
				},
				{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						}
					}
				},
				{ key : 'floorNm', align:'center', title : '층명', width: '150px',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'N') {
							return value;
						}
					}
				},
				{ key : 'newExstDivCd', align:'center', title : '신규/기존', width: '100px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNewYnCd);
								return render_data;
							} else {
								data.newExstDivCd = '';
							}
						}
					}
				},
				{ key : 'bldFlorNo', align:'center', title : '층 정보', width: '100px' },
    			{ key : 'usgTypCd', align:'center', title : '층용도', width: '200px', styleclass : 'font-orange', filter : {useRenderToFilter : true},
					render : function(value, data, render, mapping){
						var strText = '';
						if (value != undefined && value != null && value != ""){
							var usgTypCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

							var names = [];
							var uniqueNames = [];
							for(i=0; i < usgTypCd.length; i++) {
								names.push(usgTypCd[i]);
							}
							$.each(names, function(i, el){
								if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
							})
							for(i=0; i < uniqueNames.length; i++) {
								for(var j=0; j < grUsgTypCd.length; j++) {
									if (uniqueNames[i].toString() == grUsgTypCd[j].value.toString()) {
										strText += grUsgTypCd[j].text + ',';
									}
								}
							}
						}
						strText = strText.substr(0,strText.length-1);
						return strText;
					}
				},
				{ key : 'mtsoTyp', align:'center', title : '국사유형', width: '110px', filter : {useRenderToFilter : true} },
				{ key : 'bldCd', align:'center', title : '건물코드', width: '110px', filter : {useRenderToFilter : true} },
				{ key : 'siteCd', align:'center', title : '사이트키', width: '85px'},
				{ key : 'mtsoId', align:'center', title : '국사ID', width: '115px' },
				{ key : 'repIntgFcltsCd', align:'center', title : '공대코드', width: '90px' },
				{ key : 'bldAddr', align:'left', title : '주소', width: '350px' },
				{ key : 'sidoNm', align:'center', title : '시도', width: '90px' },
				{ key : 'sggNm', align:'center', title : '시군구', width: '100px' },
				{ key : 'emdNm', align:'center', title : '읍면동', width: '80px' },
				{ key : 'riNm', align:'center', title : '리', width: '80px' },
				{ key : 'addrBunjiVal', align:'center', title : '번지', width: '60px' },
				{ key : 'bldNm', align:'center', title : '건물명', width: '150px' },
				{ key : 'dongFloor', align:'center', title : '동/층', width: '100px' },
				{ key : 'laraCd', align:'center', title : '권역', width: '100px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grLaraCd);
								return render_data;
							} else {
								data.laraCd = '';
							}
						}
					}
				},
				{ key : 'dntnYn', align:'center', title : '도심/외곽', width: '80px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grDntnYn);
								return render_data;
							} else {
								data.dntnYn = '';
							}
						}
					}
				},
				{ key : 'mtsoLatValT', align:'center', title : '위도', width: '110px' },
				{ key : 'mtsoLngValT', align:'center', title : '경도', width: '110px' },
				{ key : 'dsnEtcColVal1', align:'center', title : '기타1', width: '100px'},
				{ key : 'dsnEtcColVal2', align:'center', title : '기타2', width: '100px'},
				{ key : 'dsnEtcColVal3', align:'center', title : '기타3', width: '100px'},
				{ key : 'dsnEtcColVal4', align:'center', title : '기타4', width: '100px'},
				{ key : 'dsnEtcColVal5', align:'center', title : '기타5', width: '100px'},
				{ key : 'dsnEtcColVal6', align:'center', title : '기타6', width: '100px'},
				{ key : 'dsnEtcColVal7', align:'center', title : '기타7', width: '100px'},
				{ key : 'dsnEtcColVal8', align:'center', title : '기타8', width: '100px'},
				{ key : 'dsnEtcColVal9', align:'center', title : '기타9', width: '100px'},
				{ key : 'dsnEtcColVal10', align:'center', title : '기타10', width: '100px'},
				{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', hidden : true },
				{ key : 'repMtsoId', align:'center', title : '상위국사ID', hidden : true },
				{ key : 'repMtsoYn', align:'center', title : '상위국사여부', hidden : true }


    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        mtsoInfHideCol();
    };



    function mtsoInfHideCol() {
    	for(var i = 0; i < publicMtsoInfHideCol.length; i++){
			if (publicMtsoInfHideCol[i].mtsoInvtItmHidYn == 'N') {
				$('#'+mtsoInfDataGridId).alopexGrid('updateColumn', {title : publicMtsoInfHideCol[i].mtsoInvtItmNm}, publicMtsoInfHideCol[i].mtsoInvtItmVal);
				$('#'+subMtsoInfDataGrid).alopexGrid('updateColumn', {title : publicMtsoInfHideCol[i].mtsoInvtItmNm}, publicMtsoInfHideCol[i].mtsoInvtItmVal);

			} else {
				$('#'+mtsoInfDataGridId).alopexGrid('updateColumn', {hidden : true}, publicMtsoInfHideCol[i].mtsoInvtItmVal);
				$('#'+subMtsoInfDataGrid).alopexGrid('updateColumn', {hidden : true}, publicMtsoInfHideCol[i].mtsoInvtItmVal);
			}
		}
    }

    function mtosInfSetEventListener() {

    	$('#'+mtsoInfDataGridId).on('click', '.bodycell', function(e){
    		$('#'+subMtsoInfDataGrid).show();
			var dataObj = AlopexGrid.parseEvent(e).data;

			var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";

			var data = {mtsoInvtId: dataObj.mtsoInvtId, srchDt : srchDt};
			subSetGrid(data);
		});

    	 $('#btnMtosInfExportExcel').on('click', function(e) {

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
 				excelFileName : '이력_국사투자기본정보_'+recentYMD,
 				sheetList : [{
 					sheetName : '기본정보',
 					$grid : $("#"+mtsoInfDataGridId)
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

         });

    };



	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	// 층 용도
    	if(flag == 'mtsoUsgList'){
    		grUsgTypCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grUsgTypCd.push(resObj);
			}
    	}
    	// 도심/외곽여부
    	if(flag == 'dntnYnList'){
    		grDntnYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grDntnYn.push(resObj);
			}
    	}
    	// 권역 구분
    	if(flag == 'laraCdList'){
    		grLaraCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grLaraCd.push(resObj);
			}
    	}

    	if(flag == 'newYnList'){
    		grNewYnCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grNewYnCd.push(resObj);
			}
    	}

    	if(flag == 'search'){
    		$('#'+mtsoInfDataGridId).alopexGrid('hideProgress');
    		setSPGrid(mtsoInfDataGridId, response, response.mtsoInvtDsnList);
    	}

    	if(flag == 'subSearch'){
    		$('#'+subMtsoInfDataGrid).alopexGrid('hideProgress');
    		$('#'+subMtsoInfDataGrid).alopexGrid('dataSet', response.mtsoInvtDsnList);
    		//setSPGrid(subMtsoInfDataGrid, response, response.mtsoInvtDsnList);
    	}


    	if(flag == 'mtsoUseYn'){
    		var pageNo			= 1;
			var rowPerPage		= 100000;
			mtsoInf.setGrid(pageNo,rowPerPage);
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

    function subSetGrid(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getSubHstMtsoInvtDsnList', data, 'GET', 'subSearch');
    }

    this.setGrid = function(page, rowPerPage){ // this 쓰면 permission denied 되서 함수 접근못함.[20171121]

        	$('#mtsoInfPageNo').val(page);
        	$('#mtsoInfRowPerPage').val(rowPerPage);

        	var param =  $("#searchForm").getData();
        	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
        	if(ckGubun){
        		param.repMtsoYn = "Y";
	       	} else {
	       		param.repMtsoYn = "";
	       	}

    		var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";
        	param.srchDt = srchDt;
        	var subParam =  $("#mtsoInfForm").getData();
        	var page = $('#mtsoInfPageNo').val();
        	var rowPerPage = $('#mtsoInfRowPerPage').val();
        	param.pageNo = page;
        	param.rowPerPage = rowPerPage;

    		$('#'+mtsoInfDataGridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getHstMtsoInvtDsnList', param, 'GET', 'search');

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