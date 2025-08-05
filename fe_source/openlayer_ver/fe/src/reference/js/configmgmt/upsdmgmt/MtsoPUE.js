/**
 * EpwrStcMgmtArcnCurst.js
 *
 * @author Administrator
 * @date 2018. 01. 25.
 * @version 1.0
 */
var pue = $a.page(function() {
	var pueGridId = 'dataGridPue';
	var paramData = null;
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setEventListener();
	};
	function initGrid() {
		$('#'+pueGridId).alopexGrid({
			paging : {
	    		pagerSelect: [100,300,500,1000,5000]
	           ,hidePageList: false  // pager 중앙 삭제
	    	},
	    	autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			defaultColumnMapping:{
				sorting : true
			},
			headerGroup : [

				{fromIndex:6, toIndex:7, title: '통시코드'},
				{fromIndex:10, toIndex:11, title: '정류기'}
			],

			columnMapping: [
				{ align:'center', title : 'No', width: '40px', numberingColumn: true },
				{/* 관리그룹--숨김데이터            */ 	key : 'mgmtGrpNm', align:'center', title : configMsgArray['managementGroup'], width: '70px' },
				{/* 본부			 */ 		key : 'orgNm', align:'center', title : configMsgArray['hdofc'], width: '100px' },
				{/* 국사명		 */ 			key : 'mtsoNm', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeName'], width: '150px' },

				{ key : 'bldCd', align:'center', title : '건물코드', width: '150px' },
				{ key : 'bldAddr', align:'center', title : '주소', width: '130px' },
				{ key : 'trmsIntgFcltsCd', align:'center', title : '전송', width: '130px' },
				{ key : 'focsIntgFcltsCd', align:'center', title : '집중국', width: '130px' },

				{ key : 'elctyMstVal', align:'center', title : '전기료 마스터 코드', width: '130px' },
				{ key : 'kepcoUseVal', align:'center', title : '한전사용량', width: '130px' },
				{ key : 't1RtfUseVal', align:'center', title : 'T1  사용량 합', width: '130px' },
				{ key : 't2RtfUseVal', align:'center', title : 'T2  사용량 합', width: '130px' },
				{ key : 'rtfUseSumrVal', align:'center', title : '사용량 합', width: '130px',
    				render : function(value, data, render, mapping){
    					var rtfUseSumrVal = parseInt(data.t1RtfUseVal) + parseInt(data.t2RtfUseVal)
						return rtfUseSumrVal;
    				}
				},
				{ key : 'mtsoId', align:'center', title : '국사 ID', width: '130px', hidden:true }
			],
			//data:dataTab4,

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
		});
		//$('#'+pueGridId).alopexGrid("hideCol","mtsoTypCd");

	}

	function setEventListener() {
		var perPage = 100;


		//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
		$('#'+pueGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.pageNo = $('#pageNo').val();
     	 	dataObj.rowPerPage = $('#rowPerPage').val();
     	 	dataObj.regYn = 'Y';
			var dd = $a.popup({
				popid: 'PuePop',
				title: '통합국사',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/MtsoPueRegPop.do',
				data: dataObj,
				iframe: true,
                modal: true,
                movable:true,
                windowpopup : true,
                width : 900,
                height : 450
			});

		});

		// 냉방기 그리드 페이지 번호 클릭시
		$('#'+pueGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			arcn.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 냉방기 그리드 페이지 selectbox를 변경했을 시
		$('#'+pueGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			arcn.setGrid(1, eObj.perPage);
		});

		$('#btnRegPue').on('click', function(e) {
			var pageNo = $('#pageNo').val();
     	 	var rowPerPage = $('#rowPerPage').val();
     	 	//dataObj.regYn = 'N';
			$a.popup({
              	popid: 'PuePop',
              	title: '통합국사',
                  url: '/tango-transmission-web/configmgmt/upsdmgmt/MtsoPueRegPop.do',
                  data: "",
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 450
              });
		})

		// 엑셀다운
		$('#btnPueExportExcel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			pue.setGridExcel(1, 1000000);
//			var param =  $("#searchMain").getData();
//			var subParam = $("#searchArcn").getData();
//
//			$.extend(param,subParam);
//
//			param = gridExcelColumn(param, pueGridId);
//			param.pageNo = 1;
//			param.rowPerPage = 10;
//			param.firstRowIndex = 1;
//			param.lastRowIndex = 1000000000;
//
//
//			param.fileName = '전력통계_냉방기'
//				param.fileExtension = "xlsx";
//			param.excelPageDown = "N";
//			param.excelUpload = "N";
//			param.method = "getEpwrStcMgmtArcnCurstList";
//
//			$('#'+pueGridId).alopexGrid('showProgress');
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/arcnExcelcreate', param, 'GET', 'excelDownload');
		});

	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+pueGridId).alopexGrid('hideProgress');
			$('#'+pueGridId).alopexGrid('dataSet', response.epwrStcMgmtMtsoEnvCurstList, serverPageinfo);

		}

		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+pueGridId).alopexGrid('hideProgress');
			$('#'+pueGridId).alopexGrid('dataSet', response.epwrStcMgmtMtsoEnvCurstList, serverPageinfo);


			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_PUE_'+recentYMD,
				sheetList : [{
					sheetName : '에어컨',
					$grid : $("#"+pueGridId)
				}]
			});
			worker.export({
				merge : false,
				useCSSParser : true,
				useGridColumnWidth : true,
				border : true
			});

		}


		if(flag == 'excelDownload'){
			$('#'+pueGridId).alopexGrid('hideProgress');

			var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
		}
	}
//	request 실패시.
	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
	}

	this.setGrid = function(page, rowPerPage) {

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		var param =  $("#searchMain").getData();
		paramData = param

		$('#'+pueGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoPueList', param, 'GET', 'search');
	}

	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		paramData = param

		$('#'+pueGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoPueList', param, 'GET', 'searchExcel');
	}



	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
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

	function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
        }
});