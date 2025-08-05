/**
 * MtsoStatisticsList.js
 *
 * @author Administrator
 * @date 2018. 03. 12. 오전 11:21:37
 * @version 1.0
 */
$a.page(function() {
	var $form = $('#searchForm');
	var $grid = $('#dataGrid');
	
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
		
		// Grid 초기화
		function initGrid() {
			initGrid();
			initGridOfLDong();
		}
		
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
					title: configMsgArray['teamIdentification'] + 'ID',
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
				}, {/* 대표통시 미존재 국사 */
					key: 'notMtsoIntgCnt',
					align: 'right',
					title: '국사 대표통시 미존재',
					width: '170px'
				}, {/* 매핑ERP 미존재 */
					key: 'notMtsoErpCnt',
					align: 'right',
					title: '매핑ERP 미존재',
					width: '150px'
				}, {/* 국사주소 매존재 */
					key: 'notMtsoAddrCnt',
					align: 'right',
					title: '국사주소 매존재',
					width: '150px'
				}, {/* ERP주소 매존재 */
					key: 'notErpAddrCnt',
					align: 'right',
					title: 'ERP주소 매존재',
					width: '150px'
				}, {/* ERP주소 오류 */
					key: 'errErpAddrCnt',
					align: 'right',
					title: 'ERP주소 오류',
					width: '120px'
				}, {/* 주소 불일치 */
					key: 'discrdAddrCnt',
					align: 'right',
					title: '주소 불일치',
					width: '100px'
				}, {/* 법정동 일치 */
					key: 'okLdongCnt',
					align: 'right',
					title: '법정동 일치',
					width: '100px'
				}, {/* 번지 불일치 */
					key: 'discrdBunjiCnt',
					align: 'right',
					title: '번지 불일치',
					width: '100px'
				}, {/* 일치 */
					key: 'okCnt',
					align: 'right',
					title: '일치',
					width: '100px'
				}, {/* 일치율(%) */
					key: 'okRate',
					align: 'right',
					title: '일치율(%)',
					width: '100px'
				}],
				message: {/* 데이터가 없습니다.   */
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
				}
			});
			
			gridHide();
		}
		
		// 컬럼 숨기기
		function gridHide() {
			var hideColTmofList = ['hdofcId', 'teamId', 'tmofId'];
			$grid.alopexGrid('hideCol', hideColTmofList, 'conceal');
		}
		
		function setSelectCode() {
			$('#stcScopCd').setData({
                data: [
                       { scopCd: 'tmof', scopNm: '전송실별 통계' },
                       { scopCd: 'team', scopNm: '팀별 통계' }
                ],
                stcScopCd: 'tmof'
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
			
			// 엑셀 다운로드
			$('#btnExportExcel').on('click', function(e) {
				// tango transmission biz 모듈을 호출하여야한다.
				var param = $form.getData();

				param = gridExcelColumn(param, $grid);
				param.pageNo = 1;
				param.rowPerPage = 10;
				param.firstRowIndex = 1;
				param.lastRowIndex = 1000000000;

				param.fileName = param.stcScopCd == 'team' ? '팀-국사ERP주소불일치통계' : '전송실-국사ERP주소불일치통계';
				param.fileExtension = 'xlsx';
				param.excelPageDown = 'N';
				param.excelUpload = 'N';
				param.method = 'getMtsoErpAddrDscdStcList';

				$grid.alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/createExcelMtsoErpAddrDscdStcList', param, 'GET', 'excelDownload');
			});
			
			// 그리드 더블클릭
			$grid.on('dblclick', '.bodycell', function(e) {
				var dataObj = AlopexGrid.parseEvent(e).data;
				dataObj['stcScopCd'] = $('#stcScopCd').getData().stcScopCd;
				dataObj['autoSearchYn'] = 'Y';
				
				$a.popup({
					popid: 'MtsoErpAddrDscdStcDtlLkup',
					title: '전송실별 국사-ERP 주소 불일치 목록',
					url: '/tango-transmission-web/configmgmt/common/MtsoErpAddrDscdStcDtlLkupPop.do',
					data: dataObj,
					windowpopup : true,
					modal: true,
					movable:true,
					width : 1680,
					height : 750
				});
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
			
			var param =  $form.getData();
			
			$grid.alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoErpAddrDscdStcList', param, 'GET', 'search');
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
			if (flag == 'search') {	// 전송실별 국사통계 조회시
	    		if ($('#stcScopCd').getData().stcScopCd == 'team') {
	    			$grid.alopexGrid('hideCol', ['tmofNm'], 'conceal');
	    		} else {
	    			$grid.alopexGrid('showCol', ['tmofNm']);
	    		}
	    		
	    		$grid.alopexGrid('hideProgress');
	    		
	    		setSPGrid($grid, response, response.lists);
	    	} else if (flag == 'excelDownload') {
	    		downloadFile($grid, response.subPath, response.fileName, response.fileExtension);
			}
		}
		
		// request 실패시.
	    function failCallback(response, status, jqxhr, flag) {
	    	if (flag == 'search') {
	    		//조회 실패 하였습니다.
	    		$grid.alopexGrid('hideProgress');
	    		callMsgBox('', 'I', configMsgArray['searchFail'] , function(msgId, msgRst){});
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
