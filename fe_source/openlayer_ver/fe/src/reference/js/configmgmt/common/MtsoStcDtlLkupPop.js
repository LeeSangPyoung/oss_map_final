$a.page(function() {
	var $form = $('#mtsoStcDtlSearchForm');
	var $grid = $('#mtsoStcDtlGrid');
	var perPage = 100;
	var paramData = null;
	var fileNameOnDemand = '';

    this.init = function(id, param) {
        initGrid();
		setSelectCode();
		setRegDataSet(param);
		setEventListener();
		
		if (param.autoSearchYn == "Y") {
			setGrid(1, 100);
		}
    };
    
    function setRegDataSet(data) {
    	var stcScopCdVal = data.stcScopCd;
    	$grid.alopexGrid('hideCol', ['tmofNm'], 'conceal');
    	if (stcScopCdVal == 'sido') {
    		$('#ldong_cd_title').html('시도코드');
    		$('#ldong_nm_title').html('시도명');
    		$('#param_tmof_yn').hide();
    		$('#param_ldong_yn').show();
    	} else if (stcScopCdVal == 'sgg') {
    		$('#ldong_cd_title').html('시군구코드');
    		$('#ldong_nm_title').html('시군구주소');
    		$('#param_tmof_yn').hide();
    		$('#param_ldong_yn').show();
    	} else if (stcScopCdVal == 'emd') {
    		$('#ldong_cd_title').html('법정동코드');
    		$('#ldong_nm_title').html('법정동주소');
    		$('#param_tmof_yn').hide();
    		$('#param_ldong_yn').show();
    	} else if (stcScopCdVal == 'hdofc') {
    		$('#param_ldong_yn').hide();
    		$('#param_tmof_yn').show();
    		$('#param_tmof_yn').find('.param_team_dtl_yn').hide();
    		$('#param_tmof_yn').find('.param_tmof_dtl_yn').hide();
    		$grid.alopexGrid('showCol', ['tmofNm']);
    	} else if (stcScopCdVal == 'team') {
    		$('#param_ldong_yn').hide();
    		$('#param_tmof_yn').show();
    		$('#param_tmof_yn').find('.param_team_dtl_yn').show();
    		$('#param_tmof_yn').find('.param_tmof_dtl_yn').hide();
    	} else {
    		$('#param_ldong_yn').hide();
    		$('#param_tmof_yn').show();
    		$('#param_tmof_yn').find('.param_team_dtl_yn').show();
    		$('#param_tmof_yn').find('.param_tmof_dtl_yn').show();
    	}
    	$form.find('#stcScopCd').val(data.stcScopCd);
    	$form.find('#hdofcId').val(data.hdofcId);
    	$form.find('#hdofcNm').val(data.hdofcNm);
    	$form.find('#teamId').val(data.teamId);
    	$form.find('#teamNm').val(data.teamNm);
    	$form.find('#tmofId').val(data.tmofId);
    	$form.find('#tmofNm').val(data.tmofNm);
    	$form.find('#ldongCd').val(data.ldongCd);
    	$form.find('#ldongCdText').val(data.ldongCd);
    	$form.find('#ldongAddr').val(data.ldongAddr);
    }
    
    function initGrid() {
		//그리드 생성
    	$grid.alopexGrid({
			paging : {
				pagerSelect: [100, 300, 500, 1000, 5000],
				hidePageList: false	// pager 중앙 삭제
			},
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			defaultColumnMapping: {
				sorting : true
			},
			columnFixUpto: 4,
			columnMapping: [{
				align: 'center',
				title: configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
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
			}, {/* 국사세부유형코드 - 숨김데이터 */
				key: 'mtsoDetlTypCd',
				align: 'center',
				title: '국사세부유형코드',
				width: '100px'
			}, {/* 국사세부유형 */
				key: 'mtsoDetlTypNm',
				align: 'center',
				title: '국사세부유형',
				width: '120px'
			}, {/* 중심/통합/집중국 구분코드 - 숨김데이터 */
				key: 'mtsoCntrTypCd',
				align: 'center',
				title: '중심/통합/집중국 구분코드',
				width: '100px'
			}, {/* 중심/통합/집중국 구분 */
				key: 'mtsoCntrTypNm',
				align: 'center',
				title: '중심/통합/집중국 구분',
				width: '120px'
			}, {/* 건물주소 */
				key: 'bldAddr',
				align: 'center',
				title: configMsgArray['buildingAddress'],
				width: '250px'
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
			message: {/* 데이터가 없습니다. */
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
			}
		});

		gridHide();
    }
    
    // 컬럼 숨기기
	function gridHide() {
		var hideColTmofList = ['tmofId', 'mtsoTypCd', 'mtsoDetlTypCd', 'mtsoCntrTypCd'];
		$grid.alopexGrid('hideCol', hideColTmofList, 'conceal');
	}
	
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		// 국사유형
		$('#mtsoTypCdList').setData({
            data: [
   	            { comCd: '1', comCdNm: '전송실' },
				{ comCd: '2', comCdNm: '중심국사' },
				{ comCd: '3', comCdNm: '기지국사' },
				{ comCd: '4', comCdNm: '국소' }
			]
		});
		// 국사세부유형
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02016', null, 'GET', 'mtsoDetlTyp');
		// 중통집 구분
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
	}
	
	function setEventListener() {
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
		 
		//조회 
		$form.find('#mtsoStcDtlBtnSearch').on('click', function(e) {
			setGrid(1, perPage);
		});
		
		// 엔터키로 조회
		$form.on('keydown', function(e) {
			if (e.which == 13) {
				setGrid(1, perPage);
			}
			return false;
		});
		
		// 엑셀 다운로드
		$form.find('#btnExportExcelOnDemand').on('click', function(e) {
			// tango transmission biz 모듈을 호출하여야한다.
			var param = $form.getData();
			
			param.mtsoTypCdList = $form.find("#mtsoTypCdList").getData().mtsoTypCdList.length > 0 ? $form.find("#mtsoTypCdList").getData().mtsoTypCdList : [];
			param.mtsoCntrTypCdList = $form.find("#mtsoCntrTypCdList").getData().mtsoCntrTypCdList.length > 0 ? $form.find("#mtsoCntrTypCdList").getData().mtsoCntrTypCdList : [];
			param = gridExcelColumn(param, $grid);
			param.pageNo = 1;
			param.rowPerPage = 10;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;
			param.inUserId = $('#sessionUserId').val();
			
			var now = new Date();
			var fileName = (
				param.stcScopCd == 'hdofc' ? '본부(' + $form.find('#hdofcNm').val().replace(/[\/\\:*<>|]/, '_') + ')-국사목록-' :
				param.stcScopCd == 'team' ? '팀(' + $form.find('#teamNm').val().replace(/[\/\\:*<>|]/, '_')  + ')-국사목록-' :
				param.stcScopCd == 'tmof' ? '전송실(' + $form.find('#tmofNm').val().replace(/[\/\\:*<>|]/, '_')  + ')-국사목록-' :
				(param.stcScopCd == 'sido' ? '시도' : (param.stcScopCd == 'sgg' ? '시군구' : '법정동')) + '(' + $form.find('#ldongAddr').val().replace(/[\/\\:*<>|]/, '_')  + ')-국사목록-'
			) + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
			param.fileName = fileName;
			param.fileExtension = 'xlsx';
			param.excelPageDown = 'N';
			param.excelUpload = 'N';
			param.excelMethod = ('sido|sgg|emd'.indexOf(param.stcScopCd) > -1 ? 'getMtsoStcDtlLkupOfLDong' : 'getMtsoStcDtlLkupOfTmof');
			param.excelFlag = 'MtsoStcDtlList';
			fileNameOnDemand = fileName + '.xlsx';
			
			$grid.alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
		});
	}
	
	function setGrid(page, rowPerPage) {
		$form.find('#pageNo').val(page);
		$form.find('#rowPerPage').val(rowPerPage);
		
		var param = $form.serialize();
		
		$grid.alopexGrid('showProgress');
		if ($form.find('#stcScopCd').val() == 'sido' || $form.find('#stcScopCd').val() == 'sgg' || $form.find('#stcScopCd').val() == 'emd') {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoStcDtlOfLDongList', param, 'GET', 'search');
		} else {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoStcDtlOfTmofList', param, 'GET', 'search');
		}
	}
	
	function setSPGrid($Grid, Option, Data) {
		var serverPageinfo = {
			dataLength: Option.pager.totalCnt,	//총 데이터 길이
			current: Option.pager.pageNo,		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
			perPage: Option.pager.rowPerPage	//한 페이지에 보일 데이터 갯수
		};
		$Grid.alopexGrid('dataSet', Data, serverPageinfo);
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
	
	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url: Url, //URL 기존 처럼 사용하시면 됩니다.
			data: Param, //data가 존재할 경우 주입
			method: Method, //HTTP Method
			flag: Flag
		}).done(successCallback)
		.fail(failCallback);
	};
	
	function successCallback(response, status, jqxhr, flag) {
		if (flag == 'mtsoDetlTyp') {
			$('#mtsoDetlTypCd').clear();

			var option_data = [ {
				comGrpCd : '',
				comCd : '',
				comCdNm : configMsgArray['all'],
				useYn : ''
			} ];

			for (var i = 0; i < response.length; i++) {
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoDetlTypCd').setData({
				data : option_data
			});
		} else if (flag == 'mtsoCntrTypCdList') {
			$('#mtsoCntrTypCdList').clear();

			var option_data = [];

			for (var i = 0; i < response.length; i++) {
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoCntrTypCdList').setData({
				data : option_data
			});
    	} else if (flag == 'search') {	// 국사 조회시
			$grid.alopexGrid('hideProgress');
			setSPGrid($grid, response, response.lists);
		} else if (flag == 'excelDownloadOnDemand') {
			$grid.alopexGrid('hideProgress');
    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
		}
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
			callMsgBox('', 'I', configMsgArray['searchFail'], function(msgId, msgRst) {});
		}
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
});
