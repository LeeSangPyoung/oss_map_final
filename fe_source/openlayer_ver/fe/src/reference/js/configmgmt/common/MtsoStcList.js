/**
 * MtsoStatisticsList.js
 *
 * @author Administrator
 * @date 2018. 03. 12. 오전 11:21:37
 * @version 1.0
 */
$a.page(function() {
	var $formOfTmof = $('#searchFormOfTmof');
	var $formOfLDong = $('#searchFormOfLDong');
	var $gridOfTmof = $('#dataGridOfTmof');
	var $gridOfLDong = $('#dataGridOfLDong');
	var selectedStcScopCdOfTmof;
	var selectedStcScopCdOfLDong;
	
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
		
		// Grid 초기화
		function initGrid() {
			initGridOfTmof();
			initGridOfLDong();
		}
		
		function initGridOfTmof() {
			// 전송실별 국사통계 그리드 생성
			$gridOfTmof.alopexGrid({
				paging: {
					pagerSelect: [100, 300, 500, 1000, 5000],
					hidePageList: false  // pager 중앙 삭제
				},
				autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping: {
					sorting: true
				},
				columnFixUpto: 6,
				headerGroup: [{
					fromIndex: 8,
					toIndex: 11,
					title: configMsgArray['mobileTelephoneSwitchingOfficeType']
				}, {
					fromIndex: 12,
					toIndex: 18,
					title: '국사세부유형'
				}, {
					fromIndex: 19,
					toIndex: 21,
					title: '중심/통합/집중국 구분'
				}],
				columnMapping: [{
					align: 'center',
					title: configMsgArray['sequence'],
					width: '50px',
					numberingColumn: true 
				}, {/* 본부ID -- 숨김데이터 */ 
					key: 'hdofcId',
					align: 'center',
					title: configMsgArray['headOfficeIdentification'],
					width: '100px'
				}, {/* 본부 */ 
					key: 'hdofcNm',
					align: 'center',
					title: configMsgArray['hdofc'],
					width: '150px'
				}, {/* 팀ID -- 숨김데이터 */
					key: 'teamId',
					align: 'center',
					title: configMsgArray['teamIdentification'],
					width: '100px'
				}, {/* 팀 */ 
					key: 'teamNm',
					align: 'center',
					title: configMsgArray['team'],
					width: '150px'
				}, {/* 전송실ID -- 숨김데이터 */
					key: 'tmofId',
					align: 'center',
					title: configMsgArray['transmissionOffice'] + 'ID',
					width: '100px'
				}, {/* 전송실 */
					key: 'tmofNm',
					align: 'center',
					title: configMsgArray['transmissionOffice'],
					width: '150px'
				}, {/* 총국사수 */
					key: 'totMtsoCnt',
					align: 'right',
					title: '총국사수',
					width: '100px'
				}, {/* 전송실수 */
					key: 'tmofCnt',
					align: 'right',
					title: '전송실수',
					width: '100px'
				}, {/* 중심국사수 */
					key: 'cmtsoCnt',
					align: 'right',
					title: '중심국사수',
					width: '100px'
				}, {/* 기지국사수 */
					key: 'bmtsoCnt',
					align: 'right',
					title: '기지국사수',
					width: '100px'
				}, {/* 국소수 */
					key: 'smtsoCnt',
					align: 'right',
					title: '국소수',
					width: '100px'
				}, {/* T전송실수 */
					key: 'sktTmofCnt',
					align: 'right',
					title: 'T전송실수',
					width: '100px'
				}, {/* T중심국수 */
					key: 'sktCmtsoCnt',
					align: 'right',
					title: 'T중심국수',
					width: '100px'
				}, {/* T기지국수 */
					key: 'sktBmtsoCnt',
					align: 'right',
					title: 'T기지국수',
					width: '100px'
				}, {/* 상호접속국사수 */
					key: 'trdCnntMtsoCnt',
					align: 'right',
					title: '상호접속국사수',
					width: '120px'
				}, {/* T중계기수 */
					key: 'sktRpetrCnt',
					align: 'right',
					title: 'T중계기수',
					width: '100px'
				}, {/* T WIFI수 */
					key: 'sktWifiCnt',
					align: 'right',
					title: 'T WIFI수',
					width: '100px'
				}, {/* T광가입자수 */
					key: 'sktOptlScrbrCnt',
					align: 'right',
					title: 'T광가입자수',
					width: '100px'
				}, {/* 전송중심국수 */
					key: 'trmsCmtsoCnt',
					align: 'right',
					title: '전송중심국수',
					width: '100px'
				}, {/* 통합국수 */
					key: 'intgMtsoCnt',
					align: 'right',
					title: '통합국수',
					width: '100px'
				}, {/* DU집중국수 */
					key: 'duFocsMtsoCnt',
					align: 'right',
					title: 'DU집중국수',
					width: '100px'
				}, {/* L2/L3 SW */
					key: 'l2swCnt',
					align: 'right',
					title: 'L2/L3 SW',
					width: '100px'
				}, {/* IB백홀 */
					key: 'ibsCnt',
					align: 'right',
					title: 'IB백홀',
					width: '100px'
				}, {/* PTS */
					key: 'ptsCnt',
					align: 'right',
					title: 'PTS',
					width: '100px'
				}, {/* 기간망 */
					key: 'roadmCnt',
					align: 'right',
					title: '기간망',
					width: '100px'
				}, {/* WDM */
					key: 'wdmCnt',
					align: 'right',
					title: 'WDM',
					width: '100px'
				}, {/* 광장비 */
					key: 'optCnt',
					align: 'right',
					title: '광장비',
					width: '100px'
				}, {/* 링먹스 */
					key: 'rmuxCnt',
					align: 'right',
					title: '링먹스',
					width: '100px'
				}, {/* DU */
					key: 'duCnt',
					align: 'right',
					title: 'DU',
					width: '100px'
				}, {/* RU */
					key: 'ruCnt',
					align: 'right',
					title: 'RU',
					width: '100px'
				}, {/* 기지국 */
					key: 'staCnt',
					align: 'right',
					title: '기지국',
					width: '100px'
				}, {/* 중계기 */
					key: 'rruCnt',
					align: 'right',
					title: '중계기',
					width: '100px'
				}, {/* WiFi */
					key: 'wifiCnt',
					align: 'right',
					title: 'WiFi',
					width: '100px'
				}, {/* FDF */
					key: 'fdfCnt',
					align: 'right',
					title: 'FDF',
					width: '100px'
				}, {/* COUPLER */
					key: 'couplerCnt',
					align: 'right',
					title: 'COUPLER',
					width: '100px'
				}],
				message: {/* 데이터가 없습니다.   */
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
				}
			});
			
			gridHideOfTmof();
		}
		
		function initGridOfLDong() {
			// 법정동별 국사통계 그리드 생성
			$gridOfLDong.alopexGrid({
				paging: {
					pagerSelect: [100, 300, 500, 1000, 5000],
					hidePageList: false  // pager 중앙 삭제
				},
				autoColumnIndex: true,
				autoResize: true,
				numberingColumnFromZero: false,
				defaultColumnMapping: {
					sorting: true
				},
				columnFixUpto: 2,
				headerGroup: [{
					fromIndex: 4,
					toIndex: 7,
					title: configMsgArray['mobileTelephoneSwitchingOfficeType']
				}, {
					fromIndex: 8,
					toIndex: 14,
					title: '국사세부유형'
				}, {
					fromIndex: 15,
					toIndex: 17,
					title: '중심/통합/집중국 구분'
				}],
				columnMapping: [{
					align: 'center',
					title: configMsgArray['sequence'],
					width: '50px',
					numberingColumn: true
				}, {/* 법정동코드 */
					key: 'ldongCd',
					align: 'center',
					title: '법정동코드',
					width: '100px'
				}, {/* 법정동주소 */
					key: 'ldongAddr',
					align: 'left',
					title: '법정동주소',
					width: '250px'
				}, {/* 총국사수 */
					key: 'totMtsoCnt',
					align: 'right',
					title: '총국사수',
					width: '100px'
				}, {/* 전송실수 */
					key: 'tmofCnt',
					align: 'right',
					title: '전송실수',
					width: '100px'
				}, {/* 중심국사수 */
					key: 'cmtsoCnt',
					align: 'right',
					title: '중심국사수',
					width: '100px'
				}, {/* 기지국사수 */
					key: 'bmtsoCnt',
					align: 'right',
					title: '기지국사수',
					width: '100px'
				}, {/* 국소수 */
					key: 'smtsoCnt',
					align: 'right',
					title: '국소수',
					width: '100px'
				}, {/* T전송실수 */
					key: 'sktTmofCnt',
					align: 'right',
					title: 'T전송실수',
					width: '100px'
				}, {/* T중심국수 */
					key: 'sktCmtsoCnt',
					align: 'right',
					title: 'T중심국수',
					width: '100px'
				}, {/* T기지국수 */
					key: 'sktBmtsoCnt',
					align: 'right',
					title: 'T기지국수',
					width: '100px'
				}, {/* 상호접속국사수 */
					key: 'trdCnntMtsoCnt',
					align: 'right',
					title: '상호접속국사수',
					width: '120px'
				}, {/* T중계기수 */
					key: 'sktRpetrCnt',
					align: 'right',
					title: 'T중계기수',
					width: '100px'
				}, {/* T WIFI수 */
					key: 'sktWifiCnt',
					align: 'right',
					title: 'T WIFI수',
					width: '100px'
				}, {/* T광가입자수 */
					key: 'sktOptlScrbrCnt',
					align: 'right',
					title: 'T광가입자수',
					width: '100px'
				}, {/* 전송중심국수 */
					key: 'trmsCmtsoCnt',
					align: 'right',
					title: '전송중심국수',
					width: '100px'
				}, {/* 통합국수 */
					key: 'intgMtsoCnt',
					align: 'right',
					title: '통합국수',
					width: '100px'
				}, {/* DU집중국수 */
					key: 'duFocsMtsoCnt',
					align: 'right',
					title: 'DU집중국수',
					width: '100px'
				}, {/* L2/L3 SW */
					key: 'l2swCnt',
					align: 'right',
					title: 'L2/L3 SW',
					width: '100px'
				}, {/* IB백홀 */
					key: 'ibsCnt',
					align: 'right',
					title: 'IB백홀',
					width: '100px'
				}, {/* PTS */
					key: 'ptsCnt',
					align: 'right',
					title: 'PTS',
					width: '100px'
				}, {/* 기간망 */
					key: 'roadmCnt',
					align: 'right',
					title: '기간망',
					width: '100px'
				}, {/* WDM */
					key: 'wdmCnt',
					align: 'right',
					title: 'WDM',
					width: '100px'
				}, {/* 광장비 */
					key: 'optCnt',
					align: 'right',
					title: '광장비',
					width: '100px'
				}, {/* 링먹스 */
					key: 'rmuxCnt',
					align: 'right',
					title: '링먹스',
					width: '100px'
				}, {/* DU */
					key: 'duCnt',
					align: 'right',
					title: 'DU',
					width: '100px'
				}, {/* RU */
					key: 'ruCnt',
					align: 'right',
					title: 'RU',
					width: '100px'
				}, {/* 기지국 */
					key: 'staCnt',
					align: 'right',
					title: '기지국',
					width: '100px'
				}, {/* 중계기 */
					key: 'rruCnt',
					align: 'right',
					title: '중계기',
					width: '100px'
				}, {/* WiFi */
					key: 'wifiCnt',
					align: 'right',
					title: 'WiFi',
					width: '100px'
				}, {/* FDF */
					key: 'fdfCnt',
					align: 'right',
					title: 'FDF',
					width: '100px'
				}, {/* COUPLER */
					key: 'couplerCnt',
					align: 'right',
					title: 'COUPLER',
					width: '100px'
				}],
				message: {/* 데이터가 없습니다.   */
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
				}
			});
			
			gridHideOfLDong();
		}
		
		// 컬럼 숨기기
		function gridHideOfTmof() {
			var hideColTmofList = ['hdofcId', 'teamId', 'tmofId'];
			$gridOfTmof.alopexGrid('hideCol', hideColTmofList, 'conceal');
		}
		
		// 컬럼 숨기기
		function gridHideOfLDong() {
//			var hideColLDongList = [];
//			$gridOfLDong.alopexGrid('hideCol', hideColLDongList, 'conceal');
		}
		
		function setSelectCode() {
			$('#stcScopCdOfTmof').setData({
                data: [
                       { scopCd: 'tmof', scopNm: '전송실별 국사통계' },
                       { scopCd: 'team', scopNm: '팀별 국사통계' },
                       { scopCd: 'hdofc', scopNm: '지역본부별 국사통계' }
                ],
                stcScopCd: 'tmof'
			});
			
			$('#stcScopCdOfLDong').setData({
                data: [
                       { scopCd: 'emd', scopNm: '법정동별 국사통계' },
                       { scopCd: 'sgg', scopNm: '시군구별 국사통계' },
                       { scopCd: 'sido', scopNm: '시도별 국사통계' }
                ],
                stcScopCd: 'emd'
			});
			
		}
		
		function setEventListener() {
			var perPage = 100;
			
			// 탭 선택시
			$('#mtso_statistics_tabs').on('tabchange', function(e, index) {
				var $this = $(this);
				var content = $this.getTabContentByIndex(index);
				var $grids = $(content).find('.alopexgrid:visible');
				if ($grids.length > -1) {
					$grids.alopexGrid('viewUpdate');
				}
			});
			
			// 페이지 번호 클릭시
			$gridOfTmof.on('pageSet', function(e) {
				var eObj = AlopexGrid.parseEvent(e);
				setGridOfTmof(eObj.page, eObj.pageinfo.perPage);
			});
			$gridOfLDong.on('pageSet', function(e) {
				var eObj = AlopexGrid.parseEvent(e);
				setGridOfLDong(eObj.page, eObj.pageinfo.perPage);
			});
			
			// 페이지 selectbox를 변경했을 시.
			$gridOfTmof.on('perPageChange', function(e) {
				var eObj = AlopexGrid.parseEvent(e);
				perPage = eObj.perPage;
				setGridOfTmof(1, eObj.perPage);
			});
			$gridOfLDong.on('perPageChange', function(e) {
				var eObj = AlopexGrid.parseEvent(e);
				perPage = eObj.perPage;
				setGridOfLDong(1, eObj.perPage);
			});
			
			$('#stcScopCdOfTmof').on('change', function(e) {
				if (!selectedStcScopCdOfTmof) {
					selectedStcScopCdOfTmof = e.target._value;
				}
			});
			$('#stcScopCdOfLDong').on('change', function(e) {
				if (!selectedStcScopCdOfLDong) {
					selectedStcScopCdOfLDong = e.target._value;
				}
			});

			// 조회 
			$('#btnSearchOfTmof').on('click', function(e) {
				selectedStcScopCdOfTmof = $('#stcScopCdOfTmof').getData().stcScopCd;
				changeGridHeadersOfTmof();
				setGridOfTmof(1, perPage);
			});
			$('#btnSearchOfLDong').on('click', function(e) {
				selectedStcScopCdOfLDong = $('#stcScopCdOfLDong').getData().stcScopCd;
				changeGridHeadersOfLDong();
				setGridOfLDong(1, perPage);
			});
			
			// 엔터키로 조회
			$formOfTmof.on('keydown', function(e) {
				if (e.which == 13) {
					$('#btnSearchOfTmof').trigger('click');
				}
				return false;
			});
			$formOfLDong.on('keydown', function(e) {
				if (e.which == 13) {
					$('#btnSearchOfLDong').trigger('click');
				}
				return false;
			});
			
			// 엑셀 다운로드
			$('#btnExportExcelOfTmof').on('click', function(e) {
				changeGridHeadersOfTmof();
				
				// tango transmission biz 모듈을 호출하여야한다.
				var param = $formOfTmof.getData();

				param = gridExcelColumn(param, $gridOfTmof);
				param.pageNo = 1;
				param.rowPerPage = 10;
				param.firstRowIndex = 1;
				param.lastRowIndex = 1000000000;

				param.fileName = param.stcScopCd == 'hdofc' ? '본부-국사통계' : (param.stcScopCd == 'team' ? '팀-국사통계' : '전송실-국사통계');
				param.fileExtension = 'xlsx';
				param.excelPageDown = 'N';
				param.excelUpload = 'N';
				param.method = 'getMtsoStcList';

				$gridOfTmof.alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/createExcelMtsoStcOfTmof', param, 'GET', 'excelDownloadOfTmof');
				
				if (selectedStcScopCdOfTmof) {
	    			$('#stcScopCdOfTmof').setSelected(selectedStcScopCdOfTmof);
	    			changeGridHeadersOfTmof();
	    		}
			});
			$('#btnExportExcelOfLDong').on('click', function(e) {
				changeGridHeadersOfLDong();
				
				// tango transmission biz 모듈을 호출하여야한다.
				var param = $formOfLDong.getData();

				param = gridExcelColumn(param, $gridOfLDong);
				param.pageNo = 1;
				param.rowPerPage = 10;
				param.firstRowIndex = 1;
				param.lastRowIndex = 1000000000;

				param.fileName = param.stcScopCd == 'sido' ? '시도-국사통계' : (param.stcScopCd == 'sgg' ? '시군구-국사통계' : '법정동-국사통계');
				param.fileExtension = 'xlsx';
				param.excelPageDown = 'N';
				param.excelUpload = 'N';
				param.method = 'getMtsoStcList';

				$gridOfLDong.alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/createExcelMtsoStcOfLDong', param, 'GET', 'excelDownloadOfLDong');
				
				if (selectedStcScopCdOfLDong) {
					$('#stcScopCdOfLDong').setSelected(selectedStcScopCdOfLDong);
					changeGridHeadersOfLDong();
				}
			});
			
			// 그리드 더블클릭
			$gridOfTmof.on('dblclick', '.bodycell', function(e) {
				var dataObj = AlopexGrid.parseEvent(e).data;
				dataObj['stcScopCd'] = $('#stcScopCdOfTmof').getData().stcScopCd;
				dataObj['autoSearchYn'] = 'Y';
				
				$a.popup({
					popid: 'MtsoStcDtlLkup',
					title: '전송실별 국사목록',
					url: '/tango-transmission-web/configmgmt/common/MtsoStcDtlLkupPop.do',
					data: dataObj,
					windowpopup: true,
					modal: true,
					movable: true,
					width: 1220,
					height: 700
				});
			});
			$gridOfLDong.on('dblclick', '.bodycell', function(e) {
				var dataObj = AlopexGrid.parseEvent(e).data;
				dataObj['stcScopCd'] = $('#stcScopCdOfLDong').getData().stcScopCd;
				dataObj['autoSearchYn'] = 'Y';
				
				$a.popup({
					popid: 'MtsoStcDtlLkup',
					title: '법정동별 국사목록',
					url: '/tango-transmission-web/configmgmt/common/MtsoStcDtlLkupPop.do',
					data: dataObj,
					windowpopup: true,
					modal: true,
					movable: true,
					width: 1220,
					height: 700
				});
			});
		}
		
		function changeGridHeadersOfTmof() {
			var selectedValue = $('#stcScopCdOfTmof').getData().stcScopCd;
			if (selectedValue == 'hdofc') {
				$gridOfTmof.alopexGrid('hideCol', ['teamNm'], 'conceal');
				$gridOfTmof.alopexGrid('hideCol', ['tmofNm'], 'conceal');
			} else if (selectedValue == 'team') {
				$gridOfTmof.alopexGrid('hideCol', ['tmofNm'], 'conceal');
				$gridOfTmof.alopexGrid('showCol', ['teamNm']);
			} else {
				$gridOfTmof.alopexGrid('showCol', ['teamNm']);
				$gridOfTmof.alopexGrid('showCol', ['tmofNm']);
			}
			$gridOfTmof.alopexGrid('updateColumn', function(mapping) {
				if (mapping.key == 'hdofcId')
					mapping.title = selectedValue == 'hdofc' ? '지역본부ID' : configMsgArray['headOfficeIdentification'];
				if (mapping.key == 'hdofcNm')
					mapping.title = selectedValue == 'hdofc' ? '지역본부' : configMsgArray['hdofc'];
			});
		}
		function changeGridHeadersOfLDong() {
			var selectedValue = $('#stcScopCdOfLDong').getData().stcScopCd;
			$gridOfLDong.alopexGrid('updateColumn', function(mapping) {
				if (mapping.key == 'ldongCd')
					mapping.title = selectedValue == 'sido' ? '시도코드' : (selectedValue == 'sgg' ? '시군구코드' : '법정동코드');
				if (mapping.key == 'ldongAddr')
					mapping.title = selectedValue == 'sido' ? '시도명' : (selectedValue == 'sgg' ? '시군구주소' : '법정동주소');
			});
		}
		
		function gridExcelColumn(param, $grid) {
			var gridColmnInfo = $grid.alopexGrid('headerGroupGet');

			var gridHeader = $grid.alopexGrid('columnGet', {
				hidden: false
			});

			var excelHeaderCd = '';
			var excelHeaderNm = '';
			var excelHeaderAlign = '';
			var excelHeaderWidth = '';
			for (var i = 0; i < gridHeader.length; i++) {
				if ((gridHeader[i].key != undefined && gridHeader[i].key != 'id')) {
					excelHeaderCd += gridHeader[i].key;
					excelHeaderCd += ';';
					excelHeaderNm += gridHeader[i].title;
					excelHeaderNm += ';';
					excelHeaderAlign += gridHeader[i].align;
					excelHeaderAlign += ';';
					excelHeaderWidth += gridHeader[i].width;
					excelHeaderWidth += ';';
				}
			}

			param.excelHeaderCd = excelHeaderCd;
			param.excelHeaderNm = excelHeaderNm;
			param.excelHeaderAlign = excelHeaderAlign;
			param.excelHeaderWidth = excelHeaderWidth;

			return param;
		}
		
		function setGridOfTmof(page, rowPerPage) {
			$('#pageNoOfTmof').val(page);
			$('#rowPerPageOfTmof').val(rowPerPage);
			
			var param =  $formOfTmof.getData();
			
			$gridOfTmof.alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoStcOfTmofList', param, 'GET', 'searchOfTmof');
		}
		function setGridOfLDong(page, rowPerPage) {
			$('#pageNoOfLDong').val(page);
			$('#rowPerPageOfLDong').val(rowPerPage);
			
			var param =  $formOfLDong.getData();
			
			$gridOfLDong.alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoStcOfLDongList', param, 'GET', 'searchOfLDong');
		}
		
		function setListOfTmof(param) {
			if (JSON.stringify(param).length > 2) {
				setGridOfTmof(1, 100);
			}
		}
		
		function setListOfLDong(param) {
			if (JSON.stringify(param).length > 2) {
				setGridOfLDong(1, 100);
			}
		}
		
		function httpRequest(Url, Param, Method, Flag) {
			Tango.ajax({
				url : Url,			// URL 기존 처럼 사용하시면 됩니다.
				data : Param,		// data가 존재할 경우 주입
				method : Method,	// HTTP Method
				flag : Flag
			}).done(successCallback)
			  .fail(failCallback);
		}
		
		function successCallback(response, status, jqxhr, flag) {
			if (flag == 'searchOfTmof') {	// 전송실별 국사통계 조회시
				if ($('#stcScopCdOfTmof').getData().stcScopCd == 'hdofc') {
					$gridOfTmof.alopexGrid('hideCol', ['teamNm'], 'conceal');
					$gridOfTmof.alopexGrid('hideCol', ['tmofNm'], 'conceal');
				} else if ($('#stcScopCdOfTmof').getData().stcScopCd == 'team') {
	    			$gridOfTmof.alopexGrid('hideCol', ['tmofNm'], 'conceal');
	    			$gridOfTmof.alopexGrid('showCol', ['teamNm']);
	    		} else {
	    			$gridOfTmof.alopexGrid('showCol', ['teamNm']);
	    			$gridOfTmof.alopexGrid('showCol', ['tmofNm']);
	    		}
	    		
	    		$gridOfTmof.alopexGrid('hideProgress');
	    		
	    		setSPGrid($gridOfTmof, response, response.lists);
	    	} else if (flag == 'searchOfLDong') {	// 법정동별 국사통계 조회시
	    		if ($('#stcScopCdOfLDong').getData().stcScopCd == 'sido') {
	    			$gridOfLDong.alopexGrid('updateColumn', function(mapping) {
	    				if (mapping.key == 'ldongCd')
	    					mapping.title = '시도코드';
	    				if (mapping.key == 'ldongAddr')
	    					mapping.title = '시도명';
	    			});
	    		} else if ($('#stcScopCdOfLDong').getData().stcScopCd == 'sgg') {
	    			$gridOfLDong.alopexGrid('updateColumn', function(mapping) {
	    				if (mapping.key == 'ldongCd')
	    					mapping.title = '시군구코드';
	    				if (mapping.key == 'ldongAddr')
	    					mapping.title = '시군구주소';
	    			});
	    		} else {
	    			$gridOfLDong.alopexGrid('updateColumn', function(mapping) {
	    				if (mapping.key == 'ldongCd')
	    					mapping.title = '법정동코드';
	    				if (mapping.key == 'ldongAddr')
	    					mapping.title = '법정동주소';
	    			});
	    		}
	    		
	    		$gridOfLDong.alopexGrid('hideProgress');
	    		
	    		setSPGrid($gridOfLDong, response, response.lists);
	    	} else if (flag == 'excelDownloadOfTmof') {
	    		downloadFile($gridOfTmof, response.subPath, response.fileName, response.fileExtension);
			} else if (flag == 'excelDownloadOfLDong') {
				downloadFile($gridOfLDong, response.subPath, response.fileName, response.fileExtension);
			}
		}
		
		// 파일다운로드 실행
		function downloadFile($grid, subPath, fileName, fileExtension) {
			$grid.alopexGrid('hideProgress');

			var $form = $('<form></form>');
			$form.attr('name', 'downloadForm');
			$form.attr('action', '/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload');
			$form.attr('method', 'GET');
			$form.attr('target', 'downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append(
				'<input type="hidden" name="subPath" value="' + subPath + '" />' +
				'<input type="hidden" name="fileName" value="' + fileName + '" />' +
				'<input type="hidden" name="fileExtension" value="' + fileExtension + '" />'
			);
			$form.appendTo('body');
			$form.submit().remove();
		}
		
		// request 실패시.
	    function failCallback(response, status, jqxhr, flag) {
	    	if (flag == 'searchOfTmof') {
	    		//조회 실패 하였습니다.
	    		$gridOfTmof.alopexGrid('hideProgress');
	    		callMsgBox('', 'I', configMsgArray['searchFail'] , function(msgId, msgRst){});
	    	} else if (flag == 'searchOfLDong') {
	    		//조회 실패 하였습니다.
	    		$gridOfLDong.alopexGrid('hideProgress');
	    		callMsgBox('', 'I', configMsgArray['searchFail'] , function(msgId, msgRst){});
	    	}
	    }
		
		function setSPGrid($Grid, Option, Data) {
			var serverPageinfo = {
		  		dataLength: Option.pager.totalCnt,	// 총 데이터 길이
		  		current: Option.pager.pageNo, 		// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
		  		perPage: Option.pager.rowPerPage 	// 한 페이지에 보일 데이터 갯수
		  	};
			$Grid.alopexGrid('dataSet', Data, serverPageinfo);
		}
	};
});
