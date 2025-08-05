/**
 * BizProgCurstMgmt.js
 *
 * @author P028750
 * @date 2016. 9. 29. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var excelMaxCount = 500;
	var m = {form: {formObject: $('#searchForm')}};

	this.init = function(pageId, param) {
		selectSkAfcoDivCd.model.get();
		selectAreaCd.model.get();
		selectProcsClCd.model.get();
    	initGrid();
    	$('#btnSearch').click();
	};

	var selectSkAfcoDivCd = Tango.select.init({
		el: "#skAfcoDivCd",
		model: Tango.ajax.init({
			url: "tango-common-business-biz/common/business/system/codes/C00308",
			complete: function() { }
		}),
		allType: true
	});

	var selectAreaCd = Tango.select.init({
		el: "#areaCd",
		model: Tango.ajax.init({
			url: "tango-transmission-biz/transmisson/constructprocess/common/orgs",
			complete: function() { }
		}),
		valueField: "orgId",
		labelField: "orgNm",
		renderData: function(response) {
			return response.orgList;
		},
		allType: true
	});

	var selectProcsClCd = Tango.select.init({
		el: "#procsClCd",
		model: Tango.ajax.init({
			url: "tango-common-business-biz/common/business/system/codes/C00216",
			complete: function() { }
		}),
		allType: true
	});

	var gridModel  = Tango.ajax.init({url: 'tango-transmission-biz/webportal/bizprogcurstmgmt/bizProgCurstList'});
	var conditionData = null;
	var totalCount = 0;
	var gridColumnMap = [
					{key: 'rownumber',        align:'center', width:'60px',  title: '순번'},
					{key: '',                 align:'center', width:'80px',  title: '진행상태', render: {type: 'unitbProcProgStat'}},
					{key: 'skAfcoDivCdNm',    align:'center', width:'100px', title: '사업자'},
					{key: 'areaCdNm',         align:'left',   width:'130px', title: '본부구분'},
					{key: 'procsClCdNm',      align:'center', width:'100px', title: '프로세스분류'},
					{key: 'workNm',           align:'left',   width:'250px', title: '프로세스분류명'},
					{key: 'actTypNm',         align:'center', width:'80px',  title: '업무구분'},
					{key: 'actNm',            align:'left',   width:'200px', title: '업무명'},
					{key: 'cstrMgmtOnrCdNm',  align:'center', width:'80px',  title: '관리주체'},
					{key: 'userRoleNm',       align:'center', width:'90px',  title: '역할'},
					{key: 'appltNo',          align:'center', width:'150px', title: '청약번호'},
					{key: 'bizStaDtmt',       align:'center', width:'130px', title: '업무시작일시'},
					{key: 'bizFnshDtmt',      align:'center', width:'130px', title: '업무완료일시'},
					{key: 'bizFnshUserNm',    align:'center', width:'90px',  title: '업무완료자'},
					{key: 'elapseTimeFmt',    align:'center', width:'60px',  title: '경과일'},
					{key: 'bizUnqId',         align:'center', width:'150px', title: '업무고유ID'},
					{key: 'preActNm',         align:'left',   width:'100px', title: '이전승인단계'},
					{key: 'preBizFnshDtmt',   align:'center', width:'130px', title: '이전승인완료일시'},
					{key: 'preBizFnshUserNm', align:'left',   width:'120px', title: '이전승인완료자'},
					//----------------------------------------------------------------------------------------------------
					{key: 'skAfcoDivCd',      align:'center', width:'0px',   title: 'SK계열사구분코드',     hidden: true},	        
					{key: 'procsClCd',        align:'center', width:'0px',   title: '프로세스분류코드',     hidden: true},
					{key: 'menuScrnId',       align:'center', width:'0px',   title: '메뉴화면ID',           hidden: true},
					{key: 'menuScrnUrl',      align:'center', width:'0px',   title: '메뉴화면URL',          hidden: true},    	        
					{key: 'actTyp',           align:'center', width:'0px',   title: 'Activity 구분',        hidden: true},	        
					{key: 'userRoleCd',       align:'center', width:'0px',   title: '사용자역할코드',       hidden: true},	        
					{key: 'actCd',            align:'center', width:'0px',   title: 'Activity 코드',        hidden: true},
					{key: 'areaCd',           align:'center', width:'0px',   title: '지역코드',             hidden: true},
					{key: 'clsTlmtDay',       align:'center', width:'0px',   title: '마감기한일',           hidden: true},
					{key: 'scrnMovParm',      align:'center', width:'0px',   title: '화면이동파라미터',     hidden: true},
					{key: 'bizUnqIdVar',      align:'center', width:'0px',   title: '업무고유아이디변수명', hidden: true},
					{key: 'bizProgStatCD',    align:'center', width:'0px',   title: '업무진행상태코드',     hidden: true},
					{key: 'frstRegDate',      align:'center', width:'0px',   title: '최초등록일자',         hidden: true},
					{key: 'frstRegUserId',    align:'center', width:'0px',   title: '최초등록사용자ID',     hidden: true},
					{key: 'lastChgDate',      align:'center', width:'0px',   title: '최종변경일자',         hidden: true},
					{key: 'lastChgUserId',    align:'center', width:'0px',   title: '최종변경사용자ID',     hidden: true}
				];

	//Grid 초기화
	function initGrid() {
		$('#resultGrid').alopexGrid({
			autoColumnIndex: true,
			autoResize: true,
			rowSingleSelect: true,
			paging: {
//				pagerSelect: false,
				pagerTotal: false
			},
			message: {nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i><spring:message code='message.noData'/></div>"},
			renderMapping: {
				'unitbProcProgStat': {
					renderer: function(value, data, render, mapping) {
						return "<a href='#'><i class='fa fa-sitemap unitbProcProgStat'></i></a>";
					}
				}                
			},
			columnMapping: gridColumnMap,
			ajax: { model : gridModel }
		});

		$('#excelGrid').alopexGrid({columnMapping: gridColumnMap});
	};

	$('#btnSearch').click(function(e) {
		conditionData = m.form.formObject.getData();	// 엑셀다운로드시 조회조건 재사용
		gridModel.get({data: conditionData, flag: 'searchForPage'}).done(successCallback).fail(failCallback);
  	});

	$('#btnExcelDown').click(function(){
		if(totalCount == 0) {
			alertBox('I', '조회된 데이터가 없습니다. 조회 후 실행하세요.');
			return;
		}
		if(totalCount > excelMaxCount) {
			alertBox('I', '조회된 데이터가 너무 많습니다. '+excelMaxCount+'건 이하로 조회 후 실행하세요.');
			return;
		}
		Tango.ajax({
			url: 'tango-transmission-biz/webportal/bizprogcurstmgmt/bizProgCurstExcel',
			data: conditionData,
			method: 'GET',
			flag: 'searchForExcel'
		}).done(successCallback).fail(failCallback);
	});

	function successCallback(response, status, jqxhr, flag) {
		if(flag == 'searchForPage') {
			$('#resultTotalCount').text(setComma(response.pager.totalCnt));
			totalCount = response.pager.totalCnt;
		} else if(flag == 'searchForExcel') {
			$('#excelGrid').alopexGrid('dataSet', $.extend(true, [], response));
			excelDownload();
		}
	}

	function failCallback(responseJSON, status, flag) {
		console.log(responseJSON);
		console.log(status);
		console.log(flag);
		callMsgBox(flag,'W',responseJSON.message);
	}

	function excelDownload() {
		var worker = new ExcelWorker({
			excelFileName: '업무진행현황',
			palette: [{
				className: 'B_YELLOW',
				backgroundColor: '255,255,0'
			},{
				className: 'F_RED',
				color: '#FF0000'
			}],
			sheetList: [{
				sheetName: '업무진행현황',
				$grid: $('#excelGrid')
			}]
     	});
		worker.export({
			merge: false,
			exportHidden: false,
			filtered: false,
			selected: false,
			useGridColumnWidth: true,
			border: true
		});
	}

	var setComma = function(str) {
		var reg = /(^[+-]?\d+)(\d{3})/;		// 정규식
		str += '';							// 숫자를 문자열로 변환
		str = str.replace(/[a-zA-Z]/gi, '');
		while(reg.test(str)) {
			str = str.replace(reg, "$1" + "," + "$2");
		}
		return str;
	};

	$('#resultGrid').on('click', '.bodycell', function(event) {
		if (!$(this).hasClass('cell-type-unitbProcProgStat')) return;
		var data = AlopexGrid.parseEvent(event).data;
		$a.popup({
			popid: '업무진행상태',
			title: '업무진행상태',
			url: '/tango-transmission-web/webportal/bizprogcurstmgmt/BizProgCurstMgmtToBpms.do',
			windowpopup: true,
			modal: false,
			movable: true,
			width: 1600,
			height: 800,
			data: {
				appltNo: data.appltNo,
				bizUnqId: data.bizUnqId,
				procsClCd: data.procsClCd,
				userRoleCd: data.userRoleCd,
				menuScrnId: data.menuScrnId,
				view: 'UNIT_BIZ_PROC_PROG_STAT'
			}
		});
	});

});
