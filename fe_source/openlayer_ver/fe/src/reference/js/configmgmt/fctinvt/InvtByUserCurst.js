/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var byUserCurst = $a.page(function() {

	var byUserCurstGridId = 'byUserCurstDataGrid';
	var paramData = null;


	var defaultColList = [];  // 기본 그리드
	var mtsoInfColList = []; // 기본정보 그리드
	var imptEqpInfColList = [];	 // 토지건물정보 그리드
	var elctyCstrInfColList =[];  // 통폐합 계획 그리드
	var imptFctlInfColList = []; // 5g투자설계 그리드
	var adtnFctlInfColList = []; // 국사투자설계 그리드

	var byUserCurstScrollOffset = null;

	var UserMenuGridList = []; 	// 사용자 항목 리스트

    this.init = function(id, param) {
    	byUserCurstSetSelectCode();
    	byUserCurstInitGrid();
    	byUserCurstSetEventListener();

    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function byUserCurstSetSelectCode() {

    	var userId = $("#userId").val();
		var paramData = {userId : userId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getUserGrpList', paramData, 'GET', 'userGrpList'); 	// 사용자그룹

    }


    function byUserCurstInitGrid() {

    	var headerMappingN = [


		   ];

        //그리드 생성
    	$('#'+byUserCurstGridId).alopexGrid({
        	parger : true,
        	paging : {
				pagerSelect: false,
				pagerTotal : true
				,hidePageList: true  // pager 중앙 삭제
			},
			defaultColumnMapping:{
    			sorting : true
    		},
			autoColumnIndex: true,
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
    		columnMapping: [

				] ,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['fctInvtId', 'repMtsoId', 'repMtsoYn'];

    	$('#'+byUserCurstGridId).alopexGrid("hideCol", hideColList, 'conceal');

	}
    this.gridColList = function() {

    	defaultColList = [
//    		{ key : 'fctInvtId', align:'center', title : '국사투자ID', width: '50px' },		// 숨김
			{ key : 'demdHdofcCd', align:'center', title : '본부', width: '100px',
				render : function(value, data, render, mapping){
					return data.demdHdofcCd ;
				}
			},
			{ key : 'demdAreaCd', align:'center', title : '지역', width: '100',
				render : function(value, data, render, mapping){
					return data.demdAreaCd ;
			}
			},
//			{ key : 'mtsoId', align:'center', title : '국사ID', width: '100' },		// 숨김
//			{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '50px' },		// 숨김
//			{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '50px' },		// 숨김
			{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px',
				render : function(value, data, render, mapping){
					return data.mtsoNm ;
				}
			}
//			{ key : 'floorNm', align:'center', title : '층명', width: '150px',
//				render : function(value, data, render, mapping){
//					return data.floorNm ;
//				}
//			}
    	];


    	mtsoInfColList = removeComCol(parsingCol($('#mtsoInfDataGrid').alopexGrid('headerGroupGet')),'1');		// 기본정보
    	imptEqpInfColList = removeComCol(parsingCol($('#imptEqpInfDataGrid').alopexGrid('headerGroupGet')));		//주장비
    	imptFctlInfColList = removeComCol(parsingCol($('#imptFctInfDataGrid').alopexGrid('headerGroupGet')));	// 주요설비
    	adtnFctlInfColList =  removeComCol(parsingCol($('#adtnFctInfDataGrid').alopexGrid('headerGroupGet')));	// 부가설비
    	elctyCstrInfColList =removeComCol(parsingCol($('#elctyCstrInfDataGrid').alopexGrid('headerGroupGet')));			// 전기공사


    }

    function parsingCol(GridList) {
    	var bufList = GridList;

    	var gridList = [];

    	var ColTmpList = [];

    	var HeaderTitle = null;
    	var TopHeaderTitle = null;

    	var dupCheck = false;

    	var Tmp =[];
    	for (i=bufList.length-1; i>= 0 ;i--) {

    		ColTmpList =bufList[i];

    		if (ColTmpList.id == "Top") {
    			TopHeaderTitle =  ColTmpList.title;
    			HeaderTitle = "";
//    			continue;
    		}
    		else {
    			HeaderTitle = ColTmpList.title;
//    			TopHeaderTitle = "";
    		}

			for (k=0; k<ColTmpList.groupMappingList.length; k++) {

				if (HeaderTitle.length > 0)
					ColTmpList.groupMappingList[k].headerTitle = HeaderTitle;

				if (TopHeaderTitle != null)
					ColTmpList.groupMappingList[k].topHeaderTitle = TopHeaderTitle;


				for (j=0; j<gridList.length; j++) {			// 중복체크

					if (gridList[j].key.toUpperCase() == ColTmpList.groupMappingList[k].key.toUpperCase()) {
						dupCheck = true;
						break;
					}
				}

				if (dupCheck == false) {
					gridList.push(ColTmpList.groupMappingList[k]);
				}

				dupCheck = false;
			}

    	}


    	return gridList
    }

    function removeComCol(ColList,type) {

    	var bufList = ColList;

    	var gridList = [];

    	var bMatch = false;


    	if (type != null)
    		var removeList = ['fctInvtId', 'demdHdofcCd','demdAreaCd','repMtsoId','repMtsoYn','mtsoNm','floorNm'];
    	else
    		var removeList = ['fctInvtId', 'demdHdofcCd','demdAreaCd','mtsoId','repMtsoId','repMtsoYn','mtsoNm','floorNm'];

		for (i=0; i<bufList.length; i++) {

			bMatch = false;

			for (j=0; j<removeList.length; j++) {
				if(bufList[i].key == removeList[j]) {
					bMatch = true;
					break;
				}
			}

			if(bMatch == false)
				gridList.push(bufList[i]);
		}

		return gridList
    }

    function byUserCurstSetEventListener() {

    	$('#'+byUserCurstGridId).on('rowInlineEditEnd',function(e){
			var param = AlopexGrid.parseEvent(e).data;

			var userId;
			 if($("#userId").val() == ""){
				 userId = "SYSTEM";
			 }else{
				 userId = $("#userId").val();
			 }

			 param.frstRegUserId = userId;
			 param.lastChgUserId = userId;


//			 var ckGubun = $("input:radio[name=byUserCurstGubun][value='T']").is(":checked") ? true : false;
//
//			 if (ckGubun) {
////				 httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/mergeByUserCurst', param, 'GET', 'ByUserCurst');
//			 }

    	});

    	// 사용자별 항목 관리
		$('#btnUserMenuMgmtPop').on('click', function(e) {
			$a.popup({
				popid: 'UserMenuLkup',
				title: '사용자별 항목관리',
				url: '/tango-transmission-web/configmgmt/fctinvt/InvtUserMenuPop.do',
				modal: true,
				movable:true,
				windowpopup : true,
				width : 1290,
				height : 690,
				callback : function(data) {
					var userId = $("#userId").val();
					var paramData = {userId : userId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getUserGrpList', paramData, 'GET', 'userGrpList'); 	// 사용자그룹

				}
			});
		});

    	$('#btnByUserCurstImportExcel').on('click', function(e) {


    	});



    	 $('#btnByUserCurstExportExcel').on('click', function(e) {

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
 				excelFileName : '사용자양식_'+recentYMD,
 				sheetList : [{
 					sheetName : '사용자양식',
 					$grid : $("#"+byUserCurstGridId)
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

    	 $('#btnByUserCurstUserGrpId').on('change', function(e) {

    		 byUserCurst.gridColList();
			 byUserCurst.setGridCol();

    	 });

    };

    this.setGridCol = function() {

    	var paramData =  $("#searchForm").getData();	// 상위
//    	var param = {afeYr : paramData.afeYr, afeDivCd : "G5", useYn : "Y"};
    	var userId = $("#userId").val();
    	var storgboxId = $('#btnByUserCurstUserGrpId').val();
		var paramData = {afeYr : paramData.afeYr,userId : userId, storgboxId : storgboxId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getByUserCurstMenu', paramData, 'GET', 'byUserMenuCurst'); 	// 사용자 항목
    }


    this.UserMenuGridSet = function() {

    	var colList = [];
		colList = defaultColList;

		var headerMappingN = [];
		var headerMappingT = [];

		var fromIndex = 0;

		// 기본 정보
		for (i=0; i<mtsoInfColList.length; i++) {
			for (k=0; k< UserMenuGridList.length; k++) {
				if (mtsoInfColList[i].key.toUpperCase() == UserMenuGridList[k].fctInvtItmVal.toUpperCase()) {

					var align = mtsoInfColList[i].align;
					var key = mtsoInfColList[i].key;
					var width = mtsoInfColList[i].width;
					var headerTitle = mtsoInfColList[i].headerTitle;
					var title = mtsoInfColList[i].title;
					var topHeaderTitle = mtsoInfColList[i].topHeaderTitle;
					var render = mtsoInfColList[i].render;
					var filter = mtsoInfColList[i].filter;
					var exportDataType = mtsoInfColList[i].exportDataType;

					colList.push({align : align , key : key, width: width, headerTitle : headerTitle, title: title, topHeaderTitle : topHeaderTitle, render : render, filter : filter, exportDataType: exportDataType});
				}
			}
		}

		// 주장비
		for (i=0; i<imptEqpInfColList.length; i++) {
    			for (k=0; k< UserMenuGridList.length; k++) {
    				if (imptEqpInfColList[i].key.toUpperCase() == UserMenuGridList[k].fctInvtItmVal.toUpperCase()) {

    					var align = imptEqpInfColList[i].align;
    					var key = imptEqpInfColList[i].key;
    					var width = imptEqpInfColList[i].width;
    					var headerTitle = imptEqpInfColList[i].headerTitle;
    					var title = imptEqpInfColList[i].title;
    					var topHeaderTitle = imptEqpInfColList[i].topHeaderTitle;
    					var render = imptEqpInfColList[i].render;
    					var filter = imptEqpInfColList[i].filter;
    					var exportDataType = imptEqpInfColList[i].exportDataType;

    					colList.push({align : align , key : key, width: width, headerTitle : headerTitle, title: title, topHeaderTitle : topHeaderTitle, render : render, filter : filter, exportDataType : exportDataType});
    				}
    			}

		}

		// 주요설비
		for (i=0; i<imptFctlInfColList.length; i++) {
			for (k=0; k< UserMenuGridList.length; k++) {
				if (imptFctlInfColList[i].key.toUpperCase() == UserMenuGridList[k].fctInvtItmVal.toUpperCase()) {

					var align = imptFctlInfColList[i].align;
					var key = imptFctlInfColList[i].key;
					var width = imptFctlInfColList[i].width;
					var headerTitle = imptFctlInfColList[i].headerTitle;
					var title = imptFctlInfColList[i].title;
					var topHeaderTitle = imptFctlInfColList[i].topHeaderTitle;
					var render = imptFctlInfColList[i].render;
					var filter = imptFctlInfColList[i].filter;
					var exportDataType = imptFctlInfColList[i].exportDataType;

					colList.push({align : align , key : key, width: width, headerTitle : headerTitle, title: title, topHeaderTitle : topHeaderTitle, render : render, filter : filter, exportDataType: exportDataType});
				}
			}

		}

		// 부가설비
		for (i=0; i<adtnFctlInfColList.length; i++) {
			for (k=0; k< UserMenuGridList.length; k++) {
				if (adtnFctlInfColList[i].key.toUpperCase() == UserMenuGridList[k].fctInvtItmVal.toUpperCase()) {

					var align = adtnFctlInfColList[i].align;
					var key = adtnFctlInfColList[i].key;
					var width = adtnFctlInfColList[i].width;
					var headerTitle = adtnFctlInfColList[i].headerTitle;
					var title = adtnFctlInfColList[i].title;
					var topHeaderTitle = adtnFctlInfColList[i].topHeaderTitle;
					var render = adtnFctlInfColList[i].render;
					var filter = adtnFctlInfColList[i].filter;
					var exportDataType = adtnFctlInfColList[i].exportDataType;

					colList.push({align : align , key : key, width: width, headerTitle : headerTitle, title: title, topHeaderTitle : topHeaderTitle, render: render, filter : filter, exportDataType : exportDataType});
				}
			}
		}

		// 전기공사
		for (i=0; i<elctyCstrInfColList.length; i++) {
			for (k=0; k< UserMenuGridList.length; k++) {
				if (elctyCstrInfColList[i].key.toUpperCase() == UserMenuGridList[k].fctInvtItmVal.toUpperCase()) {

					var align = elctyCstrInfColList[i].align;
					var key = elctyCstrInfColList[i].key;
					var width = elctyCstrInfColList[i].width;
					var headerTitle = elctyCstrInfColList[i].headerTitle;
					var title = elctyCstrInfColList[i].title;
					var topHeaderTitle = elctyCstrInfColList[i].topHeaderTitle;
					var render = elctyCstrInfColList[i].render;
					var filter = elctyCstrInfColList[i].filter;
					var exportDataType = elctyCstrInfColList[i].exportDataType;

					colList.push({align : align , key : key, width: width, headerTitle : headerTitle, title: title, topHeaderTitle : topHeaderTitle, render : render, filter : filter, exportDataType : exportDataType});
//					colList.push(elctyCstrInfColList[i]);
				}
			}
		}


		var preHeaderTitle = null;
		// 중간 헤더
		for (i =0; i<colList.length; i++) {

			if (colList[i].headerTitle != undefined && colList[i].headerTitle != "undefined" && colList[i].headerTitle != null) {
				if (preHeaderTitle == null) {
					preHeaderTitle = colList[i].headerTitle;
					fromIndex = i;
				}
				else {
					if (preHeaderTitle != colList[i].headerTitle) {

						headerMappingN.push({fromIndex : fromIndex, toIndex: i-1, title: preHeaderTitle});

						preHeaderTitle =colList[i].headerTitle;
						fromIndex = i;

					}
				}
			}
			else {
				if (preHeaderTitle != null) {
					headerMappingN.push({fromIndex : fromIndex, toIndex: i-1, title: preHeaderTitle});

					preHeaderTitle =null;
					fromIndex = i;
				}
			}

			if (i==colList.length-1) {
				if (preHeaderTitle != null) {
					headerMappingN.push({fromIndex : fromIndex, toIndex: i, title: preHeaderTitle});
				}
			}

		}

		var preTopHeaderTitle = null;

		// 최상위 헤더
		for (i =0; i<colList.length; i++) {

			if (colList[i].topHeaderTitle != undefined && colList[i].topHeaderTitle != "undefined" && colList[i].topHeaderTitle != null) {
				if (preTopHeaderTitle == null) {
					preTopHeaderTitle = colList[i].topHeaderTitle;
					fromIndex = i;
				}
				else {
					if (preTopHeaderTitle != colList[i].topHeaderTitle) {

						if (preTopHeaderTitle.length <= 0)
							continue;



						headerMappingT.push({fromIndex : fromIndex, toIndex: i-1, title: preTopHeaderTitle, id :'Top'});

						preTopHeaderTitle =colList[i].topHeaderTitle;
						fromIndex = i;

					}
				}
			}
			else {
				if (preTopHeaderTitle != null) {

					if (preTopHeaderTitle.length <= 0)
						continue;

					headerMappingT.push({fromIndex : fromIndex, toIndex: i-1, title: preTopHeaderTitle, id :'Top'});

					preTopHeaderTitle =null;
					fromIndex = i;
				}
			}

			if (i==colList.length-1) {
				if (preTopHeaderTitle != null) {

					if (preTopHeaderTitle.length <= 0)
						continue;

					headerMappingT.push({fromIndex : fromIndex, toIndex: i, title: preTopHeaderTitle, id : 'Top'});
				}
			}

		}

		var headerMapping = [];

		//	최상위 헤더 + 상위 헤더
		for (i =0; i<headerMappingN.length; i++) {
			headerMappingT.push(headerMappingN[i]);
		}

		// 최상위 헤더가 먼저 오도록 Sorting
		headerMappingT.sort(function (a,b){

			if(a.fromIndex < b.fromIndex)
				return -1;

			if(a.fromIndex > b.fromIndex)
				return 1;

			if(a.fromIndex == b.fromIndex) {

				if (a.id != undefined)
					return -1;
				else
					return 1;
			}

			return 0;

		});

		$('#'+byUserCurstGridId).alopexGrid("updateOption", {columnMapping: colList, headerGroup: headerMappingT});

//		$('#'+byUserCurstGridId).alopexGrid("updateOption", {columnMapping: colList});

		 gridHide();

    }

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'byUserMenuCurst'){
    		UserMenuGridList = response.byUserCurstMenuList;
    		byUserCurst.UserMenuGridSet();
    	}

    	if(flag == 'search'){

    		byUserCurst.gridColList();
			byUserCurst.setGridCol();

    		$('#'+byUserCurstGridId).alopexGrid('hideProgress');
    		setSPGrid(byUserCurstGridId, response, response.byUserCurstList);

    	}

    	if(flag == 'userGrpList') {

			$('#btnByUserCurstUserGrpId').clear();

			var option_data = [{cd: '', cdNm: '사용자 그룹을 선택해주세요'}];
			if (response.UserGrpList.length > 0) {
				option_data = [];
				for(var i=0; i<response.UserGrpList.length; i++){
					var resObj = {cd : response.UserGrpList[i].storgboxId, cdNm : response.UserGrpList[i].storgboxTitlNm};
					option_data.push(resObj);
				}
			}

			$('#btnByUserCurstUserGrpId').setData({ data : option_data, option_selected: '' });

			byUserCurst.gridColList();
			byUserCurst.setGridCol();

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
	       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column :byUserCurstScrollOffset.column}});
	       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});
	}

    this.setGrid = function(page, rowPerPage) {

    	byUserCurstScrollOffset = $('#'+byUserCurstGridId).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#byUserCurstPageNo').val(page);
    	$('#byUserCurstRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	var subParam =  $("#byUserCurstForm").getData();
    	var page = $('#byUserCurstPageNo').val();
    	var rowPerPage = $('#byUserCurstRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;
    	param.bfAfeYr = setIsNaNCheck(parseInt(param.afeYr)) - 1;
    	$('#'+byUserCurstGridId).alopexGrid('showProgress')
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getByUserCurstList', param, 'GET', 'search');

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