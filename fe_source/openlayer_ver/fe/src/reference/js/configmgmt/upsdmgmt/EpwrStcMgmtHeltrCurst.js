/**
 * EpwrStcMgmtHeltrCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var heltr = $a.page(function() {
	var heltrGridId = 'dataGridHeltr';
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
		$('#'+heltrGridId).alopexGrid({
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
			               { fromIndex : 8, toIndex : 11, title:'수전'},
			               { fromIndex : 12, toIndex : 14, title:'정류기'},
			               { fromIndex : 15, toIndex : 18, title:'축전지'},
			               { fromIndex : 19, toIndex : 20, title:'비상전원'},
			               { fromIndex : 21, toIndex : 22, title:'부대설비'},
			               { fromIndex : 23, toIndex : 24, title:'환경'},
			               { fromIndex : 25, toIndex : 26, title:'점수'}
			],
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'heltrInf', align:'center',
				title : '건강도',
				width: '100px',
				inlineStyle :{
					background: function(data){
						if(data == 'Red'){
							return 'red';
						}else if(data == 'Yellow'){
							return 'yellow';
						}else{
							return 'green';
						}
					}
				}
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
				width: '180px'
			}
//			, {
//				key : 'opCellCnt', align:'center',
//				title : '운용Cell수',
//				width: '100px'
//			}
			, {
				key : 'ctrtEpwrVal', align:'center',
				title : '계약전력',
				width: '100px'
			}, {
				key : 'mainCbrkCapa', align:'center',
				title : 'Main차단기용량',
				width: '120px'
			}, {
				key : 'cbplCblTmpr', align:'center',
				title : '차단기/케이블 발열',
				width: '140px'
			}, {
				key : 'tvssInstl', align:'center',
				title : 'SPD설치',
				width: '100px'
			}, {
				key : 'mdulTtrnCnt', align:'center',
				title : '모듈적정수량',
				width: '110px'
			}, {
				key : 'ipdCapaValStatCd', align:'center',
				title : 'IPD차단기용량',
				width: '110px'
			}, {
				key : 'brRlesStatCd', align:'center',
				title : 'BR해제',
				width: '100px'
			}, {
				key : 'batryTtrnCapa', align:'center',
				title : '축전지적정용량',
				width: '120px'
			}, {
				key : 'batryStat', align:'center',
				title : '축전지상태',
				width: '100px'
			}, {
				key : 'batryIntnVolt', align:'center',
				title : '축전지 내부저항',
				width: '120px'
			}, {
				key : 'batryCblVoltDrop', align:'center',
				title : '축전지 케이블 전압강하',
				width: '160px'
			}, {
				key : 'gntPwrSplyProcs', align:'center',
				title : '발전기 전원공급 프로세스',
				width: '170px'
			}, {
				key : 'movGntTmnbx', align:'center',
				title : '이동용 발전기 단자함',
				width: '150px'
			}, {
				key : 'arcnTtrnCapa', align:'center',
				title : '냉방기 적정용량',
				width: '120px'
			}, {
				key : 'fextnMgmt', align:'center',
				title : '소화설비관리',
				width: '110px'
			}, {
				key : 'envMntrDevStat', align:'center',
				title : '환경감시장치',
				width: '110px'
			}, {
				key : 'scurStatCd', align:'center',
				title : '환경보안',
				width: '100px'
			}, {
				key : 'maxval',
				align:'center',
				title : '만점',
				width: '100px',
				defaultValue: '100'
			}, {
				key : 'totCnt', align:'center',
				title : '취득',
				width: '100px'
			}],

			//data:dataTab7,

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });
	}

	function setEventListener() {
		var perPage = 100;
		// 축전지 그리드 페이지 번호 클릭시
		$('#'+heltrGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			heltr.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 축전지 그리드 페이지 selectbox를 변경했을 시
		$('#'+heltrGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			heltr.setGrid(1, eObj.perPage);
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
			$('#'+heltrGridId).alopexGrid('hideProgress');
			$('#'+heltrGridId).alopexGrid('dataSet', response.epwrMgmtHeltrCurstList, serverPageinfo);

		}

		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+heltrGridId).alopexGrid('hideProgress');
			$('#'+heltrGridId).alopexGrid('dataSet', response.epwrMgmtHeltrCurstList, serverPageinfo);



			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_건강도_'+recentYMD,
				sheetList : [{
					sheetName : '건강도',
					$grid : $("#"+heltrGridId)
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
			$('#'+heltrGridId).alopexGrid('hideProgress');

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
		var subParam = $("#searchHeltr").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+heltrGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtHeltrCurstList', param, 'GET', 'search');
	}

	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchHeltr").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+heltrGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtHeltrCurstList', param, 'GET', 'searchExcel');
	}

	//	엑셀다운
	$('#btnHeltrExportExcel').on('click', function(e) {
		//tango transmission biz 모듈을 호출하여야한다.
		heltr.setGridExcel(1, 1000000);
//		var param =  $("#searchMain").getData();
//		var subParam = $("#searchHeltr").getData();
//
//		$.extend(param,subParam);
//
//		param = gridExcelColumn(param, heltrGridId);
//		param.pageNo = 1;
//		param.rowPerPage = 10;
//		param.firstRowIndex = 1;
//		param.lastRowIndex = 1000000000;
//
//
//		param.fileName = '전력통계_건강도';
//		param.fileExtension = "xlsx";
//		param.excelPageDown = "N";
//		param.excelUpload = "N";
//		param.method = "getEpwrStcMgmtHeltrCurstList";
//
//		$('#'+heltrGridId).alopexGrid('showProgress');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/heltrExcelcreate', param, 'GET', 'excelDownload');
	});


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