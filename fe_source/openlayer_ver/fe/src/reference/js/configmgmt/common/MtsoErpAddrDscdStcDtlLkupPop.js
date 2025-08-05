$a.page(function() {
	var $form = $('#mtsoErpAddrDscdStcDtlSearchForm');
	var $grid = $('#mtsoErpAddrDscdStcDtlGrid');
	var perPage = 100;

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
    	$form.find('#stcScopCd').val(data.stcScopCd);
    	$form.find('#hdofcId').val(data.hdofcId);
    	$form.find('#hdofcNm').val(data.hdofcNm);
    	$form.find('#teamId').val(data.teamId);
    	$form.find('#teamNm').val(data.teamNm);
    	$form.find('#tmofId').val(data.tmofId);
    	$form.find('#tmofNm').val(data.tmofNm);
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
			}, {/* 대표통시코드 */
				key: 'repIntgFcltsCd',
				align: 'center',
				title: '대표통시코드',
				width: '120px'
			}, {/* 대표통시명 */
				key: 'repIntgFcltsNm',
				align: 'center',
				title: '대표통시명',
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
			}, {/* 국사 번지주소 */
				key: 'mtsoAddr',
				align: 'left',
				title: '국사 번지주소',
				width: '250px'
			}, {/* ERP 번지주소 */
				key: 'erpAddr',
				align: 'left',
				title: 'ERP 번지주소',
				width: '250px'
			}, {/* 비교결과코드 */
				key: 'compTypCd',
				align: 'center',
				title: '비교결과코드',
				width: '100px'
			}, {/* 비교결과명 */
				key: 'compTypNm',
				align: 'center',
				title: '비교결과',
				width: '150px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
			}
		});

		gridHide();
    }
    
    // 컬럼 숨기기
	function gridHide() {
		$grid.alopexGrid('hideCol', ['mtsoTypCd', 'mtsoDetlTypCd', 'mtsoCntrTypCd', 'compTypCd'], 'conceal');
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
		// 비교결과
		$form.find('#compTypCdList').setData({
            data: [
                   { compTypCd: 'MRX', compTypNm: '국사 대표통시 미존재' },
                   { compTypCd: 'MEX', compTypNm: '매핑ERP 미존재' },
                   { compTypCd: 'MAX', compTypNm: '국사주소 미존재' },
                   { compTypCd: 'EAX', compTypNm: 'ERP주소 미존재' },
                   { compTypCd: 'ERE', compTypNm: 'ERP주소 오류' },
                   { compTypCd: 'LDN', compTypNm: '주소 불일치' },
                   { compTypCd: 'LDY', compTypNm: '법정동 일치' },
                   { compTypCd: 'BJN', compTypNm: '번지 불일치' },
                   { compTypCd: 'BJY', compTypNm: '일치' }
            ]
		});
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
		
		// 엔터키로 조회
		$form.on('keydown', function(e) {
			if (e.which == 13) {
				setGrid(1, perPage);
			}
			return false;
		});
		 
		//조회 
		$form.find('#mtsoErpAddrDscdStcDtlBtnSearch').on('click', function(e) {
			setGrid(1, perPage);
		});
		
		// 엑셀 다운로드
		$form.find('#btnExportExcelOnDemand').on('click', function(e) {
			// tango transmission biz 모듈을 호출하여야한다.
			var param = $form.getData();
			
			param.mtsoTypCdList = $form.find("#mtsoTypCdList").getData().mtsoTypCdList.length > 0 ? $form.find("#mtsoTypCdList").getData().mtsoTypCdList : [];
			param.mtsoCntrTypCdList = $form.find("#mtsoCntrTypCdList").getData().mtsoCntrTypCdList.length > 0 ? $form.find("#mtsoCntrTypCdList").getData().mtsoCntrTypCdList : [];
			param.compTypCdList = $form.find("#compTypCdList").getData().compTypCdList.length > 0 ? $form.find("#compTypCdList").getData().compTypCdList : [];
			param = gridExcelColumn(param, $grid);
			param.pageNo = 1;
			param.rowPerPage = 10;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;
			param.inUserId = $('#sessionUserId').val();
			
			var now = new Date();
			var fileName = (
				'국사-ERP주소불일치(' + $form.find('#tmofNm').val().replace(/[\/\\:*<>|]/, '_')  + ')-국사현황-') + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
			param.fileName = fileName;
			param.fileExtension = 'xlsx';
			param.excelPageDown = 'N';
			param.excelUpload = 'N';
			param.excelMethod = 'getMtsoErpAddrDscdStcDtlLkup';
			param.excelFlag = 'MtsoErpAddrDscdStcDtlList';
			fileNameOnDemand = fileName + '.xlsx';
			
			$grid.alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
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
		$form.find('#pageNo').val(page);
		$form.find('#rowPerPage').val(rowPerPage);
		
		var param = $form.serialize();
		$grid.alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoErpAddrDscdStcDtlList', param, 'GET', 'search');
	}
	
	function setSPGrid($Grid, Option, Data) {
		var serverPageinfo = {
			dataLength: Option.pager.totalCnt,	//총 데이터 길이
			current: Option.pager.pageNo,		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
			perPage: Option.pager.rowPerPage	//한 페이지에 보일 데이터 갯수
		};
		$Grid.alopexGrid('dataSet', Data, serverPageinfo);
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
