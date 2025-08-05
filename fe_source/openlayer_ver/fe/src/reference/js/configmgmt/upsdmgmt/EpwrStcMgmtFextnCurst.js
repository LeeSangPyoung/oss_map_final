/**
 * EpwrStcMgmtFextnCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var fextn = $a.page(function() {
	var fextnGridId = 'dataGridFextn';
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
		$('#'+fextnGridId).alopexGrid({
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
					key : 'sbeqpNm', align:'center',
					title : '부대장비명',
					width: '130px'
				}, {
					key : 'capa', align:'center',
					title : '용량[kg]',
					width: '130px'
				}, {
					key : 'btlCnt', align:'center',
					title : '대수[BT]',
					width: '130px'
				}, {
					key : 'vendNm', align:'center',
					title : '제조사',
					width: '130px'
				}, {
					key : 'mnftDt', align:'center',
					title : '제조일자',
					width: '130px',
					render: function(value){
						if(value){
							return value.substr(0,4) + "-" + value.substr(4,2) + "-" + value.substr(6,2);

						}
					}
				}, {
					key : 'rtfMnftDt', align:'center',
					title : '축전지제조년월',
					width: '130px',
					render: function(value){
						if(value){
							return value.substr(0,4) + "-" + value.substr(4,2) + "-" + value.substr(6,2);

						}
					}
				}, {
					key : 'rmsLnkgVal', align:'center',
					title : 'RMS연동',
					width: '130px',
					render: function(value){
						if(value == 'Y'){
							return 'O';
						} else {
							return 'X';
						}
					}
				}, {
					key : 'opStatVal', align:'center',
					title : '동작상태',
					width: '130px',
					render: function(value){
						if(value == 'Y'){
							return '양호';
						} else {
							return '불량';
						}
					}
				}],

				//data:dataTab5,

				message: {
					nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
				}
		});
	}

	function setEventListener() {
		var perPage = 100;


		//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
		$('#'+fextnGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.pageNo = $('#pageNo').val();
     	 	dataObj.rowPerPage = $('#rowPerPage').val();
     	 	dataObj.epwrClCd = "F";
     	 	//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnDtlLkup.do?sbeqpId="+dataObj.sbeqpId, '부대장비소화설비상세정보',dataObj);
//			var dataObj = AlopexGrid.parseEvent(e).data;
//			dataObj.stat = 'mod';
//			parent.top.main.popup('EpwrStcMgmtFextnReg','소화설비 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtFextnReg.do',dataObj,750,450)
     	 	var data = {
					mtsoEqpGubun : 'eqp',	// mtso Or eqp
					mtsoEqpId:dataObj.sbeqpId
					};

			var dd = $a.popup({
				popid: 'MtsoDtlLkup',
				title: '국사 상세정보',
				url: $('#ctx').val()+'/configmgmt/commonlkup/ComLkup.do',
				data: data,
				iframe: false,
				modal: false,
				movable:true,
				windowpopup: true,
				width : 900,
				height : window.innerHeight * 0.9
			});
		});

		// 축전지 그리드 페이지 번호 클릭시
		$('#'+fextnGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			fextn.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 축전지 그리드 페이지 selectbox를 변경했을 시
		$('#'+fextnGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			fextn.setGrid(1, eObj.perPage);
		});

		$('#btnRegFextn').on('click', function(e) {
//			var dataParam ={epwrClCd: 'F'}
//			popup('SbeqpReg','/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do', '부대장비등록', dataParam);
			var pageNo = $('#pageNo').val();
     	 	var rowPerPage = $('#rowPerPage').val();

			$a.popup({
              	popid: 'Batry',
              	title: '부대장비등록',
                  url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do?epwrClCd=F&pageNo='+pageNo+'&rowPerPage='+rowPerPage,
                  data: "",
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
		})
		$('#btnFextnExportExcel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			fextn.setGridExcel(1, 1000000);
//			var param =  $("#searchMain").getData();
//			var subParam = $("#searchFextn").getData();
//
//			$.extend(param,subParam);
//
//			param = gridExcelColumn(param, fextnGridId);
//			param.pageNo = 1;
//			param.rowPerPage = 10;
//			param.firstRowIndex = 1;
//			param.lastRowIndex = 1000000000;
//
//
//			param.fileName = '전력통계_소화설비'
//				param.fileExtension = "xlsx";
//			param.excelPageDown = "N";
//			param.excelUpload = "N";
//			param.method = "getEpwrStcMgmtFextnCurstList";
//
//			$('#'+fextnGridId).alopexGrid('showProgress');
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/fextnExcelcreate', param, 'GET', 'excelDownload');
		});

	};
	//엑셀다운


	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+fextnGridId).alopexGrid('hideProgress');
			$('#'+fextnGridId).alopexGrid('dataSet', response.epwrMgmtFextnCurstList, serverPageinfo);

		}

		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+fextnGridId).alopexGrid('hideProgress');
			$('#'+fextnGridId).alopexGrid('dataSet', response.epwrMgmtFextnCurstList, serverPageinfo);


			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_소화설비_'+recentYMD,
				sheetList : [{
					sheetName : '소화설비',
					$grid : $("#"+fextnGridId)
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
			$('#'+fextnGridId).alopexGrid('hideProgress');

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
		var subParam = $("#searchFextn").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+fextnGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtFextnCurstList', param, 'GET', 'search');
	}

	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchFextn").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+fextnGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtFextnCurstList', param, 'GET', 'searchExcel');
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

	function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
        }
});