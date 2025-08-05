/**
 * EpwrStcMgmtRprCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var mtsoEnv = $a.page(function() {
	var mtsoEnvGridId = 'dataGridMtsoEnv';
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
		$('#'+mtsoEnvGridId).alopexGrid({
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
							{ fromIndex : 8, toIndex : 9, title:'냉방 용량'}

			],
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {/* 관리그룹--숨김데이터            */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px'
			}, {/* 본부			 */
				key : 'orgNm', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px'
			}, {/* 팀	 */
				key : 'teamNm', align:'center',
				title : configMsgArray['team'],
				width: '100px'
			},{/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '150px'
			},{/* 국사유형		 */
				key : 'mtsoTypNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px'
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '150px'
			}, {
				key : 'inspStdDate', align:'center',
				title : '점검날짜',
				width: '150px'
			}, {
				key : 'arcnTtrnCapa', align:'center',
				title : '적정용량',
				width: '130px'
			}, {
				key : 'arcnShtgCapa', align:'center',
				title : '부족용량',
				width: '130px'
			}, {
				key : 'htmprSoltnCd', align:'center',
				title : '고온솔루션',
				width: '130px',
				render: function(value){
					if(value == '0'){
						return '강제배기';
					}else if(value=='1'){
						return '고정형배풍기';
					}else if(value=='2'){
						return '이동형배풍기';
					}else if(value=='3'){
						return '인버터냉방기';
					}else if(value=='4'){
						return '고정형발전기';
					}
				}
			}, {
				key : 'exstrCbrkLoc', align:'center',
				title : '배풍기차단위치',
				width: '130px'
			}, {
				key : 'scurStatCd', align:'center',
				title : '보안상태<br>(출입문,시건장치 등)',
				width: '130px',
				render: function(value){
					if(value == 'Y'){
						return '양호';
					}else if(value=='N'){
						return '불량';
					}
				}
			}, {
				key : 'clenStatCd', align:'center',
				title : '국사 청소 상태',
				width: '130px',
				render: function(value){
					if(value == 'Y'){
						return '양호';
					}else if(value=='N'){
						return '불량';
					}
				}
			}, {
				key : 'duseStatCd', align:'center',
				title : '불용물자 방치 상태',
				width: '130px',
				render: function(value){
					if(value == 'Y'){
						return '양호';
					}else if(value=='N'){
						return '불량';
					}
				}
			}],

			//data:dataTab9,

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });
	}

	function setEventListener() {
		var perPage = 100;


		$('#'+mtsoEnvGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.regYn = 'Y';
			parent.top.main.popup('EpwrStcMgmtMtsoEnvReg','국사환경 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtMtsoEnvReg.do',dataObj,750,450)

		});

		$('#'+mtsoEnvGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			rpr.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		$('#'+mtsoEnvGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			rpr.setGrid(1, eObj.perPage);
		});

		$('#btnRegMtsoEnv').on('click', function(e) {
			parent.top.main.popup('EpwrStcMgmtMtsoEnvReg','국사환경 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtMtsoEnvReg.do',null,750,450)
		})

		//		엑셀다운
		$('#btnMtsoEnvExportExcel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			mtsoEnv.setGridExcel(1, 1000000);
//			var param =  $("#searchMain").getData();
//			var subParam = $("#searchRpr").getData();
//
//			$.extend(param,subParam);
//
//			param = gridExcelColumn(param, mtsoEnvGridId);
//			param.pageNo = 1;
//			param.rowPerPage = 10;
//			param.firstRowIndex = 1;
//			param.lastRowIndex = 1000000000;
//
//
//			param.fileName = '전력통계_국사환경'
//			param.fileExtension = "xlsx";
//			param.excelPageDown = "N";
//			param.excelUpload = "N";
//			param.method = "getEpwrStcMgmtRprHstCurstList";
//
//			$('#'+mtsoEnvGridId).alopexGrid('showProgress');
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/mtsoEnvExcelcreate', param, 'GET', 'excelDownload');
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
			$('#'+mtsoEnvGridId).alopexGrid('hideProgress');
			$('#'+mtsoEnvGridId).alopexGrid('dataSet', response.epwrStcMgmtMtsoEnvCurstList, serverPageinfo);
		}

		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+mtsoEnvGridId).alopexGrid('hideProgress');
			$('#'+mtsoEnvGridId).alopexGrid('dataSet', response.epwrStcMgmtMtsoEnvCurstList, serverPageinfo);



			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_국사환경_'+recentYMD,
				sheetList : [{
					sheetName : '국사환경',
					$grid : $("#"+mtsoEnvGridId)
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
			$('#'+mtsoEnvGridId).alopexGrid('hideProgress');

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
		var subParam = $("#searchMtsoEnv").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+mtsoEnvGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtMtsoEnvCurstList', param, 'GET', 'search');
	}

	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchMtsoEnv").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+mtsoEnvGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtMtsoEnvCurstList', param, 'GET', 'searchExcel');
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