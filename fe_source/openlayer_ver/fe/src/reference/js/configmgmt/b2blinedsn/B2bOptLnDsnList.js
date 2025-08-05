/**
 * B2bOptLnDsnList.js
 *
 * @author Administrator
 * @date 2024. 06. 25.
 * @version 1.0
 */
let temGeo;
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var dsnDtlGrid = 'dsnDtlGrid';
	var cnptDtlGrid = 'cnptDtlGrid';
	var excelGridId = null;
	var regFlag = 0;

	var dtlData = {};

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setDate();
		setEventListener();
	};

	//Grid 초기화
	function initGrid() {
		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height : '5row',
			autoResize: true,
			numberingColumnFromZero: false,
			columnMapping: [{
					align:'center',
					title : '순번',
					width: '30',
					resizing: false,
					numberingColumn: true

				}, {/* B2B설계Id			*/
					key : 'b2bDsnId', align : 'center',
					title : '설계Id',
					hidden:true,
					width : '90'
				}, {/* B2B설계명			*/
					key : 'b2bDsnNm', align:'center',
					title : '설계명',
					width: '120',
				}, {/* B2B설계건수			*/
					key : 'b2bDsnNum', align:'center',
					title : '설계건수',
					width: '40'
				}, {/* 진행상태값			*/
					key : 'progStatVal', align:'center',
					title : '진행상태',
					width: '40'
				}, {/* 실행로그			*/
					key : 'logMsgCtt', align:'center',
					title : '실행로그',
					width: '80'
				}, {/* 비고내용	 		*/
					key : 'rmkCtt', align:'center',
					title : '비고',
					width: '70px'
				}, {/* 설계자ID		 	*/
					key : 'dsnrId', align:'center',
					title : '설계자',
					width: '40'
				}, {/* 설계일시			*/
					key : 'dsnDtm', align : 'center',
					title : '설계일시',
					width : '80'
				}, {/* 완료일시			*/
					key : 'fnshDtm', align : 'center',
					title : '완료일시',
					width : '80'
				}, {/* 선로활용조건값		*/
					key : 'lnPraCondVal', align : 'center',
					title : '선로 선택 조건',
					width : '70',
					render : function(value) {
						switch(value) {
							case 'T' : value = 'SKT 선로 우선';
								break;
							case 'B' : value = 'SKB 선로 우선';
								break;
							case 'D' : value = 'T+B 혼용';
								break;
						}

						return value;
					}
				}, {/* 비용최적화조건값		*/
					key : 'cstOtmzCondVal', align : 'center',
					title : '경로 탐색 조건',
					width : '70',
					render : function(value) {
						switch(value) {
							case 'D' : value = 'T+B CapEx 최소화';
								break;
							case 'B' : value = 'SKB CapEx + OpEx';
								break;
						}

						return value;
					}
				}, {/* 계약일자조건값		*/
					key : 'ctrtDtCondVal',
					title : '계약일자',
					width : '50px',
					render : function(value) {
						switch(value) {
							case '12' : value = '12개월';
								break;
							case '24' : value = '24개월';
								break;
							case '36' : value = '36개월';
								break;
							case '48' : value = '48개월';
								break;
							case '60' : value = '60개월';
								break;
						}

						return value;
					}
				}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

		$('#'+dsnDtlGrid).alopexGrid({
			height : '8row',
			fitTableWidth : true,
			autoResize: true,
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			columnMapping : [
				   {/* B2B설계Id			*/
					key : 'b2bDsnId', align : 'center',
					title : '설계Id',
					hidden:true,
					width : '90'
				}, {/* 설계결과구분값				*/
					key : 'dsnRsltDivVal', align : 'center',
					title : '설계결과구분값',
					hidden:true,
					width: '50px',
				}, {/* 순번				*/
					key : 'custSeq', align : 'center',
					title : '순번',
					width: '50px',
				}, {/* 고객명				*/
					key : 'custNm', align : 'center',
					title : '고객명',
					width : '90'
				}, {/* 고객주소			*/
					key : 'custAddr', align : 'center',
					title : '고객주소',
					width : '150'
				}, {/* 주소경도값			*/
					key : 'addrLngVal', align : 'center',
					title : '주소경도',
					width : '70'
				}, {/* 주소위도값			*/
					key : 'addrLatVal', align : 'center',
					title : '주소위도',
					width : '70'
				}, {/* 개황도	: 좌표데이터 사이즈가 차후 문제가 될수 있으므로 api 방식으로 변경함			*/
					key : 'geoIcon', align : 'center',
					title : '개황도',
					width : '60',
					render : function(value, data, render, mapping){
						if(data.b2bDsnId != null && data.b2bDsnId != ''){
							return '<div style="width:100%"><span class="popup_button_gis" style="cursor: pointer" id="geoBtn"></span></div>';
						}
					}
				}, {/* 접속점SK관리번호		*/
					key : 'cnptSkMgmtNo', align : 'center',
					title : '접속점SK관리번호',
					width : '120'
				}, {/* 소유분류코드			*/
					key : 'ownClCd', align : 'center',
					title : '소유분류코드',
					width : '90'
				}, {
					key : 'cnptLngVal', align : 'center',
					title : '근접함체경도',
					width : '90'
				}, {
					key : 'cnptLatVal', align : 'center',
					title : '근접함체위도',
					width : '90'
				}, {
					key : 'cnptDistVal', align : 'center',
					title : '신설거리',
					width : '80'
				}, {
					key : 'sktCnt', align : 'right',
					title : 'SKT접속수',
					width : '80'
				}, {
					key : 'skbCnt', align : 'right',
					title : 'SKB접속수',
					width : '80'
				}, {
					key : 'sktCnntCnt', align : 'right',
					title : 'SKT중접수',
					width : '80'
				}, {
					key : 'skbCnntCnt', align : 'right',
					title : 'SKB중접수',
					width : '80'
				}, {
					key : 'sktDistm', align : 'center',
					title : 'SKT기설거리M',
					width : '110'
				}, {
					key : 'skbDistm', align : 'center',
					title : 'SKB기설거리M',
					width : '110'
				}, {
					key : 'cmplDistm', align : 'center',
					title : '기설거리합M',
					width : '110'
				}, {
					key : 'sktSprCnt', align : 'right',
					title : 'SKT접속수예비',
					width : '110'
				}, {
					key : 'skbSprCnt', align : 'right',
					title : 'SKB접속수예비',
					width : '110'
				}, {
					key : 'sktCnntSprCnt', align : 'right',
					title : 'SKT중접수예비',
					width : '110'
				}, {
					key : 'skbCnntSprCnt', align : 'right',
					title : 'SKB중접수예비',
					width : '110'
				}, {
					key : 'sktSprDistm', align : 'center',
					title : 'SKT기설거리M예비',
					width : '120'
				}, {
					key : 'skbSprDistm', align : 'center',
					title : 'SKB기설거리M예비',
					width : '120'
				}, {
					key : 'cmplSprDistm', align : 'center',
					title : '기설거리합M예비',
					width : '120'
				}, {/* 설계상위국건물코드		*/
					key : 'dsnUmtsoBldCd', align : 'center',
					title : '건물번호',
					width : '110'
				}, {/* 시설물명			*/
					key : 'fcltNm', align : 'center',
					title : '시설물명',
					width : '130'
				}, {/* 입력상위국건물코드		*/
					key : 'insUmtsoBldCd', align : 'center',
					title : '입력건물번호',
					width : '110'
				}, {/* 인입투자비		*/
					key : 'linInvtCost', align : 'right',
					title : '인입투자비(만원)',
					width : '120'
				}, {/* SKT투자비		*/
					key : 'sktInvtCost', align : 'right',
					title : 'SKT접속투자비(만원)',
					width : '130'
				}, {/* SKB투자비		*/
					key : 'skbInvtCost', align : 'right',
					title : 'SKB접속투자비(만원)',
					width : '130'
				}, {/* 최적국사		*/
					key : 'otmzMtsoVal', align : 'center',
					title : '최적국사',
					width : '110'
				}
			],
				message : {
					nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
				}
		});

		$('#'+cnptDtlGrid).alopexGrid({
			height : '8row',
			fitTableWidth : true,
			autoResize: true,
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			numberingColumnFromZero: false,
			columnMapping : [
				{/* 순번				*/
					key : 'cnptSeq', align : 'center',
					title : '순번',
					width: '50px',
					numberingColumn: true
				}, {
					key : 'cnptMgmtNo', align : 'center',
					title : '접속점관리번호',
					width : '90'
				}, {
					key : 'cnptSkMgmtNo', align : 'center',
					title : '접속점SK관리번호',
					width : '90'
				}, {
					key : 'fcltNm', align : 'center',
					title : '시설물명',
					width : '90'
				}, {
					key : 'b2bDsnNum', align : 'right',
					title : '수요건수',
					width : '90'
				}
			],
				message : {
					nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
				}
		});

		gridHide();
	};

	// 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['otmzMtsoVal'];

    	$('#'+dsnDtlGrid).alopexGrid("hideCol", hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {

	}

	function setEventListener() {
		var perPage = 100;

		// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			main.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			main.setGrid(1, eObj.perPage);
		});

		// 설계 내역 페이지 번호 클릭시
		$('#'+dsnDtlGrid).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			dsnDtlSetGrid(dtlData, eObj.page, eObj.pageinfo.perPage);
		});

		// 설계 내역 페이지 selectbox를 변경했을 시.
		$('#'+dsnDtlGrid).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			dsnDtlSetGrid(dtlData, 1, eObj.perPage);
		});

		// 설계 내역 페이지 번호 클릭시
		$('#'+cnptDtlGrid).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			cnptDtlSetGrid(dtlData, eObj.page, eObj.pageinfo.perPage);
		});

		// 설계 내역 페이지 selectbox를 변경했을 시.
		$('#'+cnptDtlGrid).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			cnptDtlSetGrid(dtlData, 1, eObj.perPage);
		});

		// 조회
		$('#btnSearch').on('click', function(e) {
			if($('#searchStartDate').val() > $('#searchEndDate').val()) {
    			callMsgBox('','I', '종료일이 시작일보다 작습니다. 일자를 다시 입력해 주세요.', function(msgId, msgRst){});
  	     		return;
    		}
			main.setGrid(1,perPage);
		});

		// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				if($('#searchStartDate').val() > $('#searchEndDate').val()) {
   				 callMsgBox('','I', '종료일이 시작일보다 작습니다. 일자를 다시 입력해 주세요.', function(msgId, msgRst){});
   				 return;
   			 	}
				main.setGrid(1,perPage);
			}
		});

		// 등록
		$('#btnReg').on('click', function(e) {
			DsnReg();
		});

		// 설계 내역
		$('#'+gridId).on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var perPage = 100;
			var checkedVar = $('input[name="dsnRsltDivVal"]:checked').val()
			var cnptCheckedVar = $('input[name="cnptRsltDivVal"]:checked').val()
			dtlData = {b2bDsnId: dataObj.b2bDsnId, b2bDsnNm: dataObj.b2bDsnNm, dsnRsltDivVal: checkedVar, cnptRsltDivVal: cnptCheckedVar};

			dsnDtlSetGrid(dtlData, 1, perPage);
			cnptDtlSetGrid(dtlData, 1, perPage);
		});

		// 설계 내역 Radio 버튼 클릭시
		$('input[name="dsnRsltDivVal"]').on('change', function(e) {
			var perPage = 100;
			var checkedVar = $('input[name="dsnRsltDivVal"]:checked').val()
			var cnptCheckedVar = $('input[name="cnptRsltDivVal"]:checked').val()
			dtlData = {b2bDsnId: dtlData.b2bDsnId, b2bDsnNm: dtlData.b2bDsnNm, dsnRsltDivVal: checkedVar, cnptRsltDivVal: cnptCheckedVar};

			dsnDtlSetGrid(dtlData, 1, perPage);
		});

		// 접속점 내역 Radio 버튼 클릭시
		$('input[name="cnptRsltDivVal"]').on('change', function(e) {
			var perPage = 100;
			var checkedVar = $('input[name="dsnRsltDivVal"]:checked').val()
			var cnptCheckedVar = $('input[name="cnptRsltDivVal"]:checked').val()
			dtlData = {b2bDsnId: dtlData.b2bDsnId, b2bDsnNm: dtlData.b2bDsnNm, dsnRsltDivVal: checkedVar, cnptRsltDivVal: cnptCheckedVar};

			cnptDtlSetGrid(dtlData, 1, perPage);
		});
/*
		// 설계 내역
		$('#'+gridId).on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var perPage = 100;
			var checkedVar = $('input[name="dsnRsltDivVal"]:checked').val()
			var cnptCheckedVar = $('input[name="cnptRsltDivVal"]:checked').val()
			dtlData = {b2bDsnId: dataObj.b2bDsnId, b2bDsnNm: dataObj.b2bDsnNm, dsnRsltDivVal: checkedVar, cnptRsltDivVal: cnptCheckedVar};

			dsnDtlSetGrid(dtlData, 1, perPage);
			cnptDtlSetGrid(dtlData, 1, perPage);
		});

		// 설계 내역 Radio 버튼 클릭시
		$('input[name="dsnRsltDivVal"]').on('change', function(e) {
			var perPage = 100;
			var checkedVar = $('input[name="dsnRsltDivVal"]:checked').val()
			dtlData = {b2bDsnId: dtlData.b2bDsnId, b2bDsnNm: dtlData.b2bDsnNm, dsnRsltDivVal: checkedVar};

			dsnDtlSetGrid(dtlData, 1, perPage);
		});

		// 접속점 내역 Radio 버튼 클릭시
		$('input[name="cnptRsltDivVal"]').on('change', function(e) {
			var perPage = 100;
			var checkedVar = $('input[name="cnptRsltDivVal"]:checked').val()
			dtlData = {b2bDsnId: dtlData.b2bDsnId, cnptRsltDivVal: checkedVar};

			cnptDtlSetGrid(dtlData, 1, perPage);
		});
*/
		// 개황도 클릭시
		$('#'+dsnDtlGrid).on('click', '#geoBtn', function(e){
			let ev = AlopexGrid.parseEvent(e);
			let dataObj = ev.data;
			let rowData = $('#'+dsnDtlGrid).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			if(rowData._key == "geoIcon"){
				let paramData = {};
				paramData.gridId = "B2bOptLnDsn"; //호출 경로 - B2B 광선로 설계
				paramData.b2bDsnId = rowData.b2bDsnId;
				paramData.custSeq = rowData.custSeq;
				paramData.dsnRsltDivVal = rowData.dsnRsltDivVal;

				let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;

				$a.popup({
					popid: tmpPopId,
					title: '유선 엔지니어링 맵-개황도',
					url: '/tango-transmission-web/trafficintg/engineeringmap/EngMap.do',
					data: paramData,
					windowpopup : true,
					modal: false,
					movable:false,
					width : window.innerWidth,
					height : window.innerHeight,
					callback: function(data) {
					}
				});
			}
		});

		//엑셀다운
		$('#btnExportExcelOnDemand').on('click', function(e) {
			btnExportExcelOnDemandClickEventHandler('dsn', e);
		});

		//엑셀다운
		$('#btnCnptExportExcelOnDemand').on('click', function(e) {
			btnExportExcelOnDemandClickEventHandler('cnpt', e);
		});

		// 선로 활용, 비용 최적화 목표 비활성화
		var radioGroup1 = document.getElementById('disabledRadio1');
		var radios1 = radioGroup1.querySelectorAll('input[type="radio"]');

		radios1.forEach(function(radio1){
			radio1.disabled = true;
		});

		//스크롤 내렸을떄 재 검색
//		$('#'+cnptDtlGrid).on('scrollBottom', function(e) {
//			var pageInfo = $('#'+cnptDtlGrid).alopexGrid("pageInfo");
//
//			if(pageInfo.dataLength != pageInfo.pageDataLength){
//
//				$('#'+cnptDtlGrid).alopexGrid('showProgress');
//
//				var eObj = AlopexGrid.parseEvent(e);
//
//				$('#pageNo').val(parseInt($('#pageNo').val()) + 1);
//				$('#rowPerPage').val($('#rowPerPage').val());
//
//				var checkedVar = $('input[name="cnptRsltDivVal"]:checked').val()
//
//				var param =  $("#searchForm").serialize();
//				param.b2bDsnId = dtlData.b2bDsnId;
//				param.cnptRsltDivVal = checkedVar;
//
//				httpRequest('tango-transmission-tes-biz/transmisson/tes/configmgmt/b2blinedsn/getCnptDtlList', param, 'GET', 'searchForPageAdd');
//			}
//
//		});

	};

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(type, event){
		var excelMethod = "";
		var excelFlag = "";
		var fileName = "";

		var now = new Date();

		if (type == 'dsn') {
			excelGridId = dsnDtlGrid;
			excelMethod = 'getTesOptLnDsnDtlListExcel';
			excelFlag = 'OptLnDsnDtlListExcel';
			fileName = dtlData.b2bDsnNm.trim().replace(/[\s\\/:*?"<>|]/g, '_') +'_'+ dtlData.dsnRsltDivVal +'_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));

		} else if (type == 'cnpt') {
			excelGridId = cnptDtlGrid;
			excelMethod = 'getTesCnptDtlListExcel';
			excelFlag = 'CnptDtlListExcel';
			fileName = dtlData.b2bDsnNm.trim().replace(/[\s\\/:*?"<>|]/g, '_') +'_'+ '접속점_내역'+'_'+ dtlData.cnptRsltDivVal +'_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		}

		var gridData = $('#'+excelGridId).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var param =  $("#searchForm").getData();

		param = gridExcelColumn(param, excelGridId);
   		param.pageNo = 1;
   		param.rowPerPage = 10;
   		param.firstRowIndex = 1;
   		param.lastRowIndex = 1000000000;
   		param.inUserId = $('#sessionUserId').val();

       	// 엑셀 정보
		param.b2bDsnId = dtlData.b2bDsnId;
		param.dsnRsltDivVal = dtlData.dsnRsltDivVal;
		param.cnptRsltDivVal = dtlData.cnptRsltDivVal;
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod =excelMethod;
		param.excelFlag = excelFlag;
		fileNameOnDemand = fileName + '.xlsx';
		$('#'+excelGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	}

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {
			hidden:false
		});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined
					&& gridHeader[i].key != "id"
					&& gridHeader[i].key != "geoIcon")) {
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

		return param;
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

	function setDate() {
    	var date = new Date();
    	var end = new Date(Date.parse(date)-0*1000*60*60*24);

    	var yyyyend = end.getFullYear();
    	var mmend   = end.getMonth()+1;
    	var ddend   = end.getDate();

    	if(mmend < 10){
    		mmend = "0"+mmend;
    	}
    	if(ddend < 10){
    		ddend = "0"+ddend;
    	}

    	var endFullDate = yyyyend+"-"+mmend+"-"+ddend;

    	var start = new Date(Date.parse(date)-30*1000*60*60*24);

    	var yyyystart = start.getFullYear();
    	var mmstart   = start.getMonth()+1;
    	var ddstart   = start.getDate();

    	if(mmstart < 10){
    		mmstart = "0"+mmstart;
    	}
    	if(ddstart < 10){
    		ddstart = "0"+ddstart;
    	}

    	var startFullDate = yyyystart+"-"+mmstart+"-"+ddstart

    	$('#searchStartDate').val(startFullDate);
    	$('#searchEndDate').val(endFullDate);
    }

	// 등록 팝업
	function DsnReg(){
		$a.popup({
			popid: 'B2bOptLnDsnReg',
			url: '/tango-transmission-web/configmgmt/b2blinedsn/B2bOptLnDsnReg.do',
			data: '',
			windowpopup: true,
			modal: true,
			movable:true,
			width : window.innerWidth * 0.65,
			height : window.innerWidth * 0.45,
			callback : function(data) {
				if(data == 'APLY') {
					regFlag = 1;

					// 조회
					searchForm.reset();
					setDate();
					$('#btnSearch').click();
				}
			}
		});
	}

	function onDemandExcelCreatePop (jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileNameOnDemand,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                }
            });
	}

	function successCallback(response, status, jqxhr, flag){

		switch(flag){
			// 설계 조회시
			case "search":
				$('#'+gridId).alopexGrid('hideProgress');
				setSPGrid(gridId, response, response.dsnList);
				break;
			// 설계 내역 조회시
			case "dsnDtlSearch":
				$('#'+dsnDtlGrid).alopexGrid('hideProgress');
				setSPGrid(dsnDtlGrid, response, response.dsnDtlList);
				break;
			case "excelDownloadOnDemand":
				$('#'+excelGridId).alopexGrid('hideProgress');
	            var jobInstanceId = response.resultData.jobInstanceId;
	            onDemandExcelCreatePop ( jobInstanceId );
				break;
			case "cnptDtlSearch":
				$('#'+cnptDtlGrid).alopexGrid('hideProgress');
				setSPGrid(cnptDtlGrid, response, response.cnptDtlList);
				break;
			case "searchForPageAdd":
				$('#'+cnptDtlGrid).alopexGrid('hideProgress');
				setSPADDGrid(cnptDtlGrid, response, response.cnptDtlList);
				break;
		}
	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
	}

	this.setGrid = function(page, rowPerPage){
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);
		$('#'+dsnDtlGrid).alopexGrid('dataEmpty');
		$('#'+cnptDtlGrid).alopexGrid('dataEmpty');

		var param =  $("#searchForm").serialize();

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz/transmisson/tes/configmgmt/b2blinedsn/getOptLnDsnList', param, 'GET', 'search');
	}

	function dsnDtlSetGrid(parameter, page, rowPerPage){
		var pageParam = {};

		pageParam.pageNo = page;
		pageParam.rowPerPage = rowPerPage;
		pageParam.b2bDsnId = parameter.b2bDsnId;
		pageParam.b2bDsnNm = parameter.b2bDsnNm;
		pageParam.dsnRsltDivVal = parameter.dsnRsltDivVal;

		var param = $.param(pageParam);

		$('#'+dsnDtlGrid).alopexGrid('showProgress');

		if (parameter.dsnRsltDivVal == 'OM'){
			$('#'+dsnDtlGrid).alopexGrid("showCol", 'otmzMtsoVal');
		} else {
			$('#'+dsnDtlGrid).alopexGrid("hideCol", 'otmzMtsoVal');
		}

		httpRequest('tango-transmission-tes-biz/transmisson/tes/configmgmt/b2blinedsn/getOptLnDsnDtlList', param, 'GET', 'dsnDtlSearch');
	}

	function cnptDtlSetGrid(parameter, page, rowPerPage){
		var pageParam = {};

		pageParam.pageNo = page;
		pageParam.rowPerPage = rowPerPage;
		pageParam.b2bDsnId = parameter.b2bDsnId;
		pageParam.cnptRsltDivVal = parameter.cnptRsltDivVal;

		var param = $.param(pageParam);

		$('#'+cnptDtlGrid).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz/transmisson/tes/configmgmt/b2blinedsn/getCnptDtlList', param, 'GET', 'cnptDtlSearch');
	}


	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
			data : Param, 		//data가 존재할 경우 주입
			method : Method, 	//HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

		if(regFlag){
			// 새로 등록한 설계 내역
			var perPage = 100;
			var regData = '';
			regData = $('#'+GridID).alopexGrid("dataGetByIndex", {row:0});
			var checkedVar = $('input[name="dsnRsltDivVal"]:checked').val()
			dtlData = {b2bDsnId: regData.b2bDsnId, b2bDsnNm: regData.b2bDsnNm, dsnRsltDivVal: checkedVar};
			regFlag = 0;
			dsnDtlSetGrid(dtlData, 1, perPage);
		}
	}

	function setSPADDGrid(GridID,Option,Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};

		$('#'+GridID).alopexGrid('dataAdd', Data, serverPageinfo);

	}
});

