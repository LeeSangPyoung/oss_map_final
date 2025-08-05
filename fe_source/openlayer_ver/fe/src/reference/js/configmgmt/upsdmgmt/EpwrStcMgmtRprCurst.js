/**
 * EpwrStcMgmtRprCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var rpr = $a.page(function() {
	var rprGridId = 'dataGridRpr';
	var paramData = null;
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		//setDate();
		//setSelectCode();
		setEventListener();
	};
	function initGrid() {
		$('#'+rprGridId).alopexGrid({
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
							/*{ fromIndex : 3, toIndex : 5, title:'수리일자'},*/
							{ fromIndex : 6, toIndex : 8, title:'고장 이력'},
							{ fromIndex : 9, toIndex : 13, title:'수리 이력'}

			],
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'mtsoNm', align:'center',
				title : '국사명',
				width: '130px'
			}, {
				key : 'mtsoTypNm', align:'center',
				title : '국사구분',
				width: '130px'
			}, {
				key : 'rprDt', align:'center',
				title : '수리일자',
				width: '130px'
			},

			/*{
				key : 'rprYear', align:'center',
				title : '년',
				width: '130px'
			}, {
				key : 'rprMonth', align:'center',
				title : '월',
				width: '130px'
			}, {
				key : 'rprDay', align:'center',
				title : '일',
				width: '130px'
			},*/ {
				key : 'faltDivNm', align:'center',
				title : '고장구분',
				width: '130px'
			}, {
				key : 'faltStstmNm', align:'center',
				title : '시스템명',
				width: '130px'
			}, {
				key : 'faltDetlDivNm', align:'center',
				title : '세부구분',
				width: '130px'
			}, {
				key : 'rprVendNm', align:'center',
				title : '업체',
				width: '130px'
			}, {
				key : 'rprDtsVal', align:'center',
				title : '수리내역',
				width: '130px'
			}, {
				key : 'shftCmpntNm', align:'center',
				title : '교체부품',
				width: '130px'
			}, {
				key : 'cmpntVendNm', align:'center',
				title : '제조사',
				width: '130px'
			}, {
				key : 'comntMnftDt', align:'center',
				title : '제조일',
				width: '130px'
			}],

			//data:dataTab9,

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });
	}

	function setEventListener() {
		var perPage = 100;


		//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
		$('#'+rprGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.stat = 'mod';
			parent.top.main.popup('EpwrStcMgmtRprReg','수리내역 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtRprReg.do',dataObj,750,450)

		});

		// 수리내역 그리드 페이지 번호 클릭시
		$('#'+rprGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			rpr.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 수리내역 그리드 페이지 selectbox를 변경했을 시
		$('#'+rprGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			rpr.setGrid(1, eObj.perPage);
		});

		$('#btnRegRpr').on('click', function(e) {
			var data ={stat: 'add'}
			parent.top.main.popup('EpwrStcMgmtRprReg','수리내역 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtRprReg.do',data,750,450)
		})

		//		엑셀다운
		$('#btnRprExportExcel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			rpr.setGridExcel(1, 1000000);
//			var subParam = $("#searchRpr").getData();
//
//			$.extend(param,subParam);
//
//			param = gridExcelColumn(param, rprGridId);
//			param.pageNo = 1;
//			param.rowPerPage = 10;
//			param.firstRowIndex = 1;
//			param.lastRowIndex = 1000000000;
//
//
//			param.fileName = '전력통계_수리내역'
//			param.fileExtension = "xlsx";
//			param.excelPageDown = "N";
//			param.excelUpload = "N";
//			param.method = "getEpwrStcMgmtRprHstCurstList";
//
//			$('#'+rprGridId).alopexGrid('showProgress');
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/rprHstExcelcreate', param, 'GET', 'excelDownload');
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
			$('#'+rprGridId).alopexGrid('hideProgress');
			$('#'+rprGridId).alopexGrid('dataSet', response.epwrMgmtRprHstCurstList, serverPageinfo);
		}

		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+rprGridId).alopexGrid('hideProgress');
			$('#'+rprGridId).alopexGrid('dataSet', response.epwrMgmtRprHstCurstList, serverPageinfo);



			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_수리이력_'+recentYMD,
				sheetList : [{
					sheetName : '수리이력',
					$grid : $("#"+rprGridId)
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
			$('#'+rprGridId).alopexGrid('hideProgress');

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

	}



	this.setGrid = function(page, rowPerPage) {

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchRpr").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+rprGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtRprHstCurstList', param, 'GET', 'search');
	}

	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchRpr").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+rprGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtRprHstCurstList', param, 'GET', 'searchExcel');
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
});