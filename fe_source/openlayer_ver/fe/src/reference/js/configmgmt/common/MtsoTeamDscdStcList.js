/**
 * MtsoStatisticsList.js
 *
 * @author Administrator
 * @date 2018. 03. 12. 오전 11:21:37
 * @version 1.0
 */
$a.page(function() {
	var $grid = $('#dataGrid');
	var $form = $('#searchForm');
	
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
		
		// Grid 초기화
		function initGrid() {
			// 전송실별 국사통계 그리드 생성
			$grid.alopexGrid({
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
					fromIndex: 7,
					toIndex: 12,
					title: '국사-전송실 일치'
				}, {
					fromIndex: 13,
					toIndex: 20,
					title: '국사-법정동 일치'
				}, {
					fromIndex: 21,
					toIndex: 26,
					title: configMsgArray['mobileTelephoneSwitchingOffice']
				}, {
					fromIndex: 27,
					toIndex: 32,
					title: configMsgArray['transmissionOffice']
				}, {
					fromIndex: 33,
					toIndex: 40,
					title: configMsgArray['legalDong']
				}],
				columnMapping: [{
					align: 'center',
					title: configMsgArray['sequence'],
					width: '50px',
					numberingColumn: true 
				}, {/* 국사ID */
					key: 'mtsoId',
					align: 'center',
					title: configMsgArray['mobileTelephoneSwitchingOfficeIdentification'],
					width: '120px'
				}, {/* 국사명 */
					key: 'mtsoNm',
					align: 'center',
					title: configMsgArray['mobileTelephoneSwitchingOfficeName'],
					width: '150px'
				}, {/* 국사유형코드 - 숨김데이터 */
					key: 'mtsoTypCd',
					align: 'center',
					title: configMsgArray['mobileTelephoneSwitchingOfficeTypeCode'],
					width: '100px'
				}, {/* 국사유형 */
					key: 'mtsoTypNm',
					align: 'center',
					title: configMsgArray['mobileTelephoneSwitchingOfficeType'],
					width: '100px'
				}, {/* 전송실ID -- 숨김데이터 */
					key: 'tmofId',
					align: 'center',
					title: '전송실ID',
					width: '100px'
				}, {/* 전송실 */
					key: 'tmofNm',
					align: 'center',
					title: configMsgArray['transmissionOffice'],
					width: '150px'
				}, {/* 국사-전송실 본부일치여부코드 - 숨김데이터 */
					key: 'mtsoTmofHdofcYn',
					align: 'center',
					title: '본부일치여부코드',
					width: '100px'
				}, {/* 국사-전송실 본부일치 */
					key: 'mtsoTmofHdofcYnNm',
					align: 'center',
					title: '본부일치',
					width: '100px'
				}, {/* 국사-전송실 팀일치여부코드 - 숨김데이터 */
					key: 'mtsoTmofTeamYn',
					align: 'center',
					title: '팀일치여부코드',
					width: '100px'
				}, {/* 국사-전송실 팀일치 */
					key: 'mtsoTmofTeamYnNm',
					align: 'center',
					title: '팀일치',
					width: '100px'
				}, {/* 국사-전송실 운용팀일치여부코드 - 숨김데이터 */
					key: 'mtsoTmofOpTeamYn',
					align: 'center',
					title: '운용팀일치여부코',
					width: '100px'
				}, {/* 국사-전송실 운용팀일치 */
					key: 'mtsoTmofOpTeamYnNm',
					align: 'center',
					title: '운용팀일치',
					width: '100px'
				}, {/* 국사-법정동 본부일치여부코드 - 숨김데이터 */
					key: 'mtsoLdongHdofcYn',
					align: 'center',
					title: '본부일치여부코드',
					width: '100px'
				}, {/* 국사-법정동 본부일치 */
					key: 'mtsoLdongHdofcYnNm',
					align: 'center',
					title: '본부일치',
					width: '100px'
				}, {/* 국사-법정동 팀일치여부코드 - 숨김데이터 */
					key: 'mtsoLdongTeamYn',
					align: 'center',
					title: '팀일치여부코드',
					width: '100px'
				}, {/* 국사-법정동 팀일치 */
					key: 'mtsoLdongTeamYnNm',
					align: 'center',
					title: '팀일치',
					width: '100px'
				}, {/* 국사-법정동 운용팀일치여부코드 - 숨김데이터 */
					key: 'mtsoLdongOpTeamYn',
					align: 'center',
					title: '운용팀일치여부코드',
					width: '100px'
				}, {/* 국사-법정동 운용팀일치 */
					key: 'mtsoLdongOpTeamYnNm',
					align: 'center',
					title: '운용팀일치',
					width: '100px'
				}, {/* 국사-법정동 전송실일치여부코드 - 숨김데이터 */
					key: 'mtsoLdongTmofYn',
					align: 'center',
					title: '전송실일치여부코드',
					width: '100px'
				}, {/* 국사-법정동 전송실일치 */
					key: 'mtsoLdongTmofYnNm',
					align: 'center',
					title: '전송실일치',
					width: '100px'
				}, {/* 국사 본부ID -- 숨김데이터 */ 
					key: 'mtsoHdofcId',
					align: 'center',
					title: configMsgArray['headOfficeIdentification'],
					width: '100px'
				}, {/* 국사 본부 */ 
					key: 'mtsoHdofcNm',
					align: 'center',
					title: configMsgArray['hdofc'],
					width: '150px'
				}, {/* 국사 팀ID -- 숨김데이터 */
					key: 'mtsoTeamId',
					align: 'center',
					title: configMsgArray['teamIdentification'],
					width: '100px'
				}, {/* 국사 팀 */ 
					key: 'mtsoTeamNm',
					align: 'center',
					title: configMsgArray['team'],
					width: '150px'
				}, {/* 국사 운용팀ID -- 숨김데이터 */
					key: 'mtsoOpTeamId',
					align: 'center',
					title: '운용팀ID',
					width: '100px'
				}, {/* 국사 운용팀 */ 
					key: 'mtsoOpTeamNm',
					align: 'center',
					title: '운용팀',
					width: '150px'
				}, {/* 전송실 본부ID -- 숨김데이터 */
					key: 'tmofHdofcId',
					align: 'center',
					title: configMsgArray['headOfficeIdentification'],
					width: '100px'
				}, {/* 전송실 본부 */
					key: 'tmofHdofcNm',
					align: 'center',
					title: configMsgArray['hdofc'],
					width: '150px'
				}, {/* 전송실 팀ID -- 숨김데이터 */
					key: 'tmofTeamId',
					align: 'center',
					title: configMsgArray['teamIdentification'],
					width: '100px'
				}, {/* 전송실 팀 */
					key: 'tmofTeamNm',
					align: 'center',
					title: configMsgArray['team'],
					width: '150px'
				}, {/* 전송실 운용팀ID -- 숨김데이터 */
					key: 'tmofOpTeamId',
					align: 'center',
					title: '운용팀ID',
					width: '100px'
				}, {/* 전송실 운용팀 */
					key: 'tmofOpTeamNm',
					align: 'center',
					title: '운용팀',
					width: '150px'
				}, {/* 법정동 본부ID -- 숨김데이터 */
					key: 'ldongHdofcId',
					align: 'center',
					title: configMsgArray['headOfficeIdentification'],
					width: '100px'
				}, {/* 법정동 본부 */
					key: 'ldongHdofcNm',
					align: 'center',
					title: configMsgArray['hdofc'],
					width: '150px'
				}, {/* 법정동 팀ID -- 숨김데이터 */
					key: 'ldongTeamId',
					align: 'center',
					title: configMsgArray['teamIdentification'],
					width: '100px'
				}, {/* 법정동 팀 */
					key: 'ldongTeamNm',
					align: 'center',
					title: configMsgArray['team'],
					width: '150px'
				}, {/* 법정동 운용팀ID -- 숨김데이터 */
					key: 'ldongOpTeamId',
					align: 'center',
					title: '운용팀ID',
					width: '100px'
				}, {/* 법정동 운용팀 */
					key: 'ldongOpTeamNm',
					align: 'center',
					title: '운용팀',
					width: '150px'
				}, {/* 법정동 전송실ID -- 숨김데이터 */
					key: 'ldongTmofId',
					align: 'center',
					title: '전송실ID',
					width: '100px'
				}, {/* 법정동 전송실 */
					key: 'ldongTmofNm',
					align: 'center',
					title: configMsgArray['transmissionOffice'],
					width: '150px'
				}, {/* 국사주소 */
					key: 'mtsoAddr',
					align: 'left',
					title: '국사 주소',
					width: '250px'
				}, {/* 전송실주소 */
					key: 'tmofAddr',
					align: 'left',
					title: '전송실 주소',
					width: '250px'
				}, {/* 법정동코드 - 숨김데이터 */
					key: 'ldongCd',
					align: 'center',
					title: '법정동코드',
					width: '100px'
				}, {/* 법정동주소 */
					key: 'ldongAddr',
					align: 'left',
					title: '법정동 주소',
					width: '250px'
				}],
				message: {/* 데이터가 없습니다.   */
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
				}
			});
			
			gridHide();
		}
		
		// 컬럼 숨기기
		function gridHide() {
			var hideColTmofList = [
				'mtsoTypCd', 'tmofId',
				'mtsoTmofHdofcYn', 'mtsoTmofTeamYn', 'mtsoTmofOpTeamYn',
				'mtsoLdongHdofcYn', 'mtsoLdongTeamYn', 'mtsoLdongOpTeamYn', 'mtsoLdongTmofYn',
				'mtsoHdofcId', 'mtsoTeamId', 'mtsoOpTeamId',
				'tmofHdofcId', 'tmofTeamId', 'tmofOpTeamId',
				'ldongHdofcId', 'ldongTeamId', 'ldongOpTeamId', 'ldongTmofId',
				'ldongCd'
			];
			$grid.alopexGrid('hideCol', hideColTmofList, 'conceal');
		}
		
		function setSelectCode() {
			// 국사 본부
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/SKT', null, 'GET', 'hdofcFrst');
			// 국사 운용팀
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');
			// 국사 유형
			$('#mtsoTypCdList').setData({
                data: [
       	            { comCd: '1', comCdNm: '전송실' },
    				{ comCd: '2', comCdNm: '중심국사' },
    				{ comCd: '3', comCdNm: '기지국사' },
    				{ comCd: '4', comCdNm: '국소' }
    			]
			});
			// 전송실 본부 일치
			$('#mtsoTmofHdofcYn').setData({
                data: [
                       { mtsoTmofHdofcYn: '', mtsoTmofHdofcYnNm: '전체' },
                       { mtsoTmofHdofcYn: 'N', mtsoTmofHdofcYnNm: '불일치' },
                       { mtsoTmofHdofcYn: 'Y', mtsoTmofHdofcYnNm: '일치' }
                ],
                mtsoTmofHdofcYn: ''
			});
			// 전송실 팀 일치
			$('#mtsoTmofTeamYn').setData({
                data: [
                       { mtsoTmofTeamYn: '', mtsoTmofTeamYnNm: '전체' },
                       { mtsoTmofTeamYn: 'N', mtsoTmofTeamYnNm: '불일치' },
                       { mtsoTmofTeamYn: 'Y', mtsoTmofTeamYnNm: '일치' }
                ],
                mtsoTmofTeamYn: ''
			});
			// 전송실 운용팀 일치
			$('#mtsoTmofOpTeamYn').setData({
                data: [
                       { mtsoTmofOpTeamYn: '', mtsoTmofOpTeamYnNm: '전체' },
                       { mtsoTmofOpTeamYn: 'N', mtsoTmofOpTeamYnNm: '불일치' },
                       { mtsoTmofOpTeamYn: 'Y', mtsoTmofOpTeamYnNm: '일치' }
                ],
                mtsoTmofOpTeamYn: ''
			});
			// 법정동 본부 일치
			$('#mtsoLdongHdofcYn').setData({
                data: [
                       { mtsoLdongHdofcYn: '', mtsoLdongHdofcYnNm: '전체' },
                       { mtsoLdongHdofcYn: 'N', mtsoLdongHdofcYnNm: '불일치' },
                       { mtsoLdongHdofcYn: 'Y', mtsoLdongHdofcYnNm: '일치' }
                ],
                mtsoLdongHdofcYn: ''
			});
			// 법정동 팀 일치
			$('#mtsoLdongTeamYn').setData({
                data: [
                       { mtsoLdongTeamYn: '', mtsoLdongTeamYnNm: '전체' },
                       { mtsoLdongTeamYn: 'N', mtsoLdongTeamYnNm: '불일치' },
                       { mtsoLdongTeamYn: 'Y', mtsoLdongTeamYnNm: '일치' }
                ],
                mtsoLdongTeamYn: ''
			});
			// 법정동 운용팀 일치
			$('#mtsoLdongOpTeamYn').setData({
                data: [
                       { mtsoLdongOpTeamYn: '', mtsoLdongOpTeamYnNm: '전체' },
                       { mtsoLdongOpTeamYn: 'N', mtsoLdongOpTeamYnNm: '불일치' },
                       { mtsoLdongOpTeamYn: 'Y', mtsoLdongOpTeamYnNm: '일치' }
                ],
                mtsoLdongOpTeamYn: ''
			});
			// 법정동 전송실 일치
			$('#mtsoLdongTmofYn').setData({
                data: [
                       { mtsoLdongTmofYn: '', mtsoLdongTmofYnNm: '전체' },
                       { mtsoLdongTmofYn: 'N', mtsoLdongTmofYnNm: '불일치' },
                       { mtsoLdongTmofYn: 'Y', mtsoLdongTmofYnNm: '일치' }
                ],
                mtsoLdongTmofYn: ''
			});
		}
		
		function setEventListener() {
			var perPage = 100;
			
			// 페이지 번호 클릭시
			$grid.on('pageSet', function(e) {
				var eObj = AlopexGrid.parseEvent(e);
				setGrid(eObj.page, eObj.pageinfo.perPage);
			});
			
			// 페이지 selectbox를 변경했을 시.
			$grid.on('perPageChange', function(e) {
				var eObj = AlopexGrid.parseEvent(e);
				perPage = eObj.perPage;
				setGrid(1, eObj.perPage);
			});
			
			// 조회 
			$('#btnSearch').on('click', function(e) {
				setGrid(1, perPage);
			});
			
			// 엔터키로 조회
			$form.on('keydown', function(e) {
				if (e.which == 13) {
					setGrid(1, perPage);
				}
				return false;
			});
			
			// 본부 선택
			$('#mtsoHdofcId').on('change', function(e) {
				var selected = $(this).getData().mtsoHdofcId;
				
				if (selected != '') {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + selected, null, 'GET', 'team');
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + selected + '/ALL', null, 'GET', 'tmof');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/SKT', null, 'GET', 'team');
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/SKT', null, 'GET', 'tmof');
				}
			});
			
			// 팀 선택
			$('#mtsoTeamId').on('change', function(e) {
				var uprSelected = $('#mtsoHdofcId').getData().mtsoHdofcId;
				var selected = $(this).getData().mtsoTeamId;
				
				if (selected != '' || uprSelected != '') {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + (uprSelected != '' ? uprSelected : 'ALL') + '/' + (Selected != '' ? Selected : 'ALL'), null,'GET', 'tmof');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/SKT', null, 'GET', 'tmof');
				}
			});
			
			// 엑셀 다운로드
			$('#btnExportExcel').on('click', function(e) {
				// tango transmission biz 모듈을 호출하여야한다.
				var param = $form.getData();

				param = gridExcelColumn(param, $grid);
				param.pageNo = 1;
				param.rowPerPage = 10;
				param.firstRowIndex = 1;
				param.lastRowIndex = 1000000000;

				param.fileName = param.stcScopCd == 'team' ? '팀-국사통계' : '전송실-국사통계';
				param.fileExtension = 'xlsx';
				param.excelPageDown = 'N';
				param.excelUpload = 'N';
				param.method = 'getMtsoDscdStcList';

				$grid.alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/createExcelMtsoTeamDscdStcList', param, 'GET', 'excelDownload');
			});
			
			// 엑셀 다운로드
			$form.find('#btnExportExcelOnDemand').on('click', function(e) {
				var param = $form.getData();
				
				param.mtsoTypCdList = $form.find("#mtsoTypCdList").getData().mtsoTypCdList.length > 0 ? $form.find("#mtsoTypCdList").getData().mtsoTypCdList : [];
				param = gridExcelColumn(param, $grid);
				param.pageNo = 1;
				param.rowPerPage = 10;
				param.firstRowIndex = 1;
				param.lastRowIndex = 1000000000;
				param.inUserId = $('#sessionUserId').val();
				
				var now = new Date();
				var fileName = '국사-전송실_팀불일치_현황-' + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
				param.fileName = fileName;
				param.fileExtension = 'xlsx';
				param.excelPageDown = 'N';
				param.excelUpload = 'N';
				param.excelMethod = 'getMtsoTeamDscdStcList';
				param.excelFlag = 'MtsoTeamDscdStcList';
				fileNameOnDemand = fileName + '.xlsx';
				
				$grid.alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
			});
			
			// 그리드 더블클릭
			$grid.on('dblclick', '.bodycell', function(e) {
				$('body').progress();
				var dataObj = AlopexGrid.parseEvent(e).data;
				if (dataObj.mtsoId == '' || dataObj.mtsoId == null) {
					callMsgBox('', 'I', makeArgConfigMsg('해당국사는 상세내역을 볼 수 없습니다.'), function(msgId, msgRst) { $('body').progress().remove(); });
				    return;
				}
				var data = { mgmtGrpNm:'SKT', mtsoId: dataObj.mtsoId };
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', data, 'GET', 'mtsoDtlLkup');
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
		
		function setGrid(page, rowPerPage) {
			$('#pageNo').val(page);
			$('#rowPerPage').val(rowPerPage);
			
			var param =  $form.serialize();
			
			$grid.alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoTeamDscdStcList', param, 'GET', 'search');
		}
		
		function setList(param) {
			if (JSON.stringify(param).length > 2) {
				setGrid(1, 100);
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
			if (flag == 'hdofcFrst') {
				setHdofcSelectBox(response, true);
			} else if (flag == 'hdofc') {
				setHdofcSelectBox(response, false);
	    	} else if (flag == 'teamFrst') {
	    		setTeamSelectBox(response, true);
	    	} else if (flag == 'team') {
	    		setTeamSelectBox(response, false);
	    	} else if (flag == 'tmof') {
	    		setTmofSelectBox(response);
	    	} else if (flag == 'opTeam') {
	    		setOpTeamSelectBox(response);
	    	} else if (flag == 'search') {	// 조회시
	    		$grid.alopexGrid('hideProgress');
	    		setSPGrid($grid, response, response.lists);
	    	} else if (flag == 'excelDownload') {
	    		downloadFile($grid, response.subPath, response.fileName, response.fileExtension);
			} else if (flag == 'mtsoDtlLkup') {
				$('body').progress().remove();
				$a.popup({
					popid: 'MtsoDtlLkup',
					title: '국사 상세정보',
					url: '/tango-transmission-web/configmgmt/common/MtsoDtlLkupPop.do',
					data: response.mtsoMgmtList[0],
					windowpopup : true,
					modal: true,
					movable: true,
					width : 865,
					height : 830
				});
			} else if (flag == 'excelDownloadOnDemand') {
				$grid.alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
			}
		}
		
		// 본부 검색 항목 설정
		function setHdofcSelectBox(response, isFirst) {
			var sUprOrgId = '';
			if ($('#sUprOrgId').val() != '') {
				 sUprOrgId = $('#sUprOrgId').val();
			}
			
			$('#mtsoHdofcId').clear();
			
    		var option_data = [{
    			orgId: '',
    			orgNm: configMsgArray['all'],
    			mtsoHdofcId: ''
    		}];
    		
    		var selected;
    		for (var i = 0; i < response.length; i++) {
    			var resObj = response[i];
    			option_data.push(resObj);
    			if (isFirst && resObj.orgId == sUprOrgId) {
    				selected = resObj.orgId;
				}
    		}
    		if (!selected) {
    			selected = option_data[0].orgId;
    		}
    		
    		$('#mtsoHdofcId').setData({
				data: option_data,
				mtsoHdofcId: selected
			});
    		
    		if (isFirst) {
    			if (selected != '') {
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + selected, null, 'GET', 'teamFrst');
    			} else {
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/SKT', null, 'GET', 'teamFrst');
        		}
    		}
		}
		
		// 팀 검색 항목 설정
		function setTeamSelectBox(response, isFirst) {
			var sOrgId = '';
			if ($('#sOrgId').val() != '') {
				 sOrgId = $('#sOrgId').val();
			}
			
			$('#mtsoTeamId').clear();
			
			var option_data = [{
    			orgId: '',
    			orgNm: configMsgArray['all'],
    			mtsoTeamId: ''
    		}];
			
			var selected;
    		for (var i = 0; i < response.length; i++) {
    			var resObj = response[i];
    			option_data.push(resObj);
    			if (isFirst && resObj.orgId == sOrgId) {
    				selected = resObj.orgId;
				}
    		}
    		if (!selected) {
    			selected = option_data[0].orgId;
    		}
    		
    		$('#mtsoTeamId').setData({
				data: option_data,
				mtsoHdofcId: selected
			});
    		
    		if (isFirst) {
    			var mtsoHdofcId = $('#mtsoHdofcId').getData().mtsoHdofcId;
    			if (selected != '' || mtsoHdofcId != '') {
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + (mtsoHdofcId != '' ? mtsoHdofcId : 'ALL') + '/' + selected != '' ? selected : 'ALL', null, 'GET', 'tmof');
    			} else {
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/SKT', null, 'GET', 'tmof');
    			}
    		}
		}
		
		// 전송실 검색 항목 설정
		function setTmofSelectBox(response) {
			$('#tmofId').clear();
			
			var option_data = [{
    			mtsoId: '',
    			mtsoNm: configMsgArray['all'],
    			tmofId: ''
    		}];
			
			for (var i = 0; i < response.length; i++) {
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
			
			$('#tmofId').setData({
				data: option_data,
				tmofId: ''
			});
		}
		
		// 운용팀 검색 항목 설정
		function setOpTeamSelectBox(response) {
			$('#mtsoOpTeamId').clear();
    		var option_data =  [{
    			orgId: '',
    			orgNm: configMsgArray['all'],
    			mtsoOpTeamId: ''
    		}];
    		
    		
    		for (var i = 0; i < response.length; i++) {
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#mtsoOpTeamId').setData({
                 data: option_data,
                 mtsoOpTeamId: ''
    		});
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
		
		// 파일다운로드 실행
		function downloadFileOnDemand(jobInstanceId, fileName) {
			$a.popup({
				popid : 'CommonExcelDownlodPop' + jobInstanceId,
				title : '엑셀다운로드',
				iframe : true,
				modal : false,
				windowpopup : true,
				url : '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
				data : {
					jobInstanceId : jobInstanceId,
					fileName : fileName,
					fileExtension : "xlsx"
				},
				width : 500,
				height : 300,
				callback : function(resultCode) {
					if (resultCode == "OK") {
						// $('#btnSearch').click();
					}
				}
			});
		}
		
		// request 실패시.
	    function failCallback(response, status, jqxhr, flag) {
	    	if (flag == 'search') {
	    		//조회 실패 하였습니다.
	    		$grid.alopexGrid('hideProgress');
	    		callMsgBox('', 'I', configMsgArray['searchFail'] , function(msgId, msgRst){});
	    	} else if (flag == 'mtsoDtlLkup') {
				$('body').progress().remove();
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
		
		function lpad(value, length) {
			var strValue = '';
			if (value) {
				if (typeof value === 'number') {
					strValue = String(value);
				}
			}
			
			var result = '';
			for (var i = strValue.length; i < length; i++) {
				result += strValue;
			}
			
			return result + strValue;
		}
	};
});
