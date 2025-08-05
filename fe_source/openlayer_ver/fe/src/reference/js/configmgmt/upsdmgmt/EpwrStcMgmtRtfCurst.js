/**
 * EpwrStcMgmtRtfCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 06.
 * @version 1.0
 */
var rtf = $a.page(function() {
	var rtfGridId = 'dataGridRtf';
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
		$('#'+rtfGridId).alopexGrid({
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
			               //2단
			               { fromIndex : 8, toIndex : 30, title:'정류기'},
			               { fromIndex : 31, toIndex : 40, title:'정류기-축전지'},
			               { fromIndex : 41, toIndex : 50, title:'정류기-축전지'},

			               //1단
			               { fromIndex : 15, toIndex : 16, title:'입력전압'},
			               { fromIndex : 17, toIndex : 19, title:'정류모듈'},
			               { fromIndex : 20, toIndex : 22, title:'입력전류[A]'},
			               { fromIndex : 23, toIndex : 24, title:'출력 전압/전류'},
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
				key : 'engStdDivVal', align:'center',
				title : 'Eng기준구분',
				width: '130px',
				render : function(value){
					if(value == '1'){
						return '중심국(3H)';
					}else if(value =='2'){
						return '중심국(4H)';
					}else if(value =='3'){
						return 'DU집중국(3H)';
					}else if(value =='4'){
						return 'DU집중국(4H)';
					}else if(value =='5'){
						return '3G집중국(1.5H)';
					}else if(value =='6'){
						return '기지국(1.5H)';
					}else if(value =='7'){
						return '교환사옥(2H)';
					}
				}
			}, {
				key : 'vendNm', align:'center',
				title : '제조사',
				width: '130px'
			}, {
				key : 'mdlNm', align:'center',
				title : '모델명',
				width: '130px'
			}, {
				key : 'repLoadNm', align:'center',
				title : '대표부하명',
				width: '130px'
			}, {
				key : 'mnftDt', align:'center',
				title : '제조년월',
				width: '130px',
				render: function(value){
					if(value){
						return value.substr(0,4) + "-" + value.substr(4,2) + "-" + value.substr(6,2);

					}
				}
			}, {
				key : 'fcltsCapa', align:'center',
				title : '시설용량[A]',
				width: '130px'
			}, {
				key : 'wrngMeansVal', align:'center',
				title : '결선방식',
				width: '130px',
				render: function(value){
					switch(value){
					case "1":
						return "단상";
					case "2":
						return "3상3선";
					case "3":
						return "3상4선";
					default:
						return "N/A";
					}
				}
			}, {
				key : 'voltVal', align:'center',
				title : '전압[V]',
				width: '130px'
			}, {
				key : 'rtfcMdulCapa', align:'center',
				title : '용량(A)',
				width: '130px'
			}, {
				key : 'rtfcMdulCnt', align:'center',
				title : '수량',
				width: '130px'
			}, {
				key : 'insVoltVal', align:'center',
				title : '입력전압[V]',
				width: '130px'
			}, {
				key : 'rInsVcurVal', align:'center',
				title : 'R',
				width: '130px'
			}, {
				key : 'sInsVcurVal', align:'center',
				title : 'S',
				width: '130px'
			}, {
				key : 'tInsVcurVal', align:'center',
				title : 'T',
				width: '130px'
			}, {
				key : 'prtVoltVal', align:'center',
				title : '출력전압[V]',
				width: '130px'
			}, {
				key : 'prtVcurVal', align:'center',
				title : '출력전류',
				width: '130px'
			}, {
				key : 'loadRate', align:'center',
				title : '부하율[%]',
				width: '130px'
			}, {
				key : 'rqrdCalCnt', align:'center',
				title : '소요산출[EA]',
				width: '130px'
			}, {
				key : 'rtfOvstCnt', align:'center',
				title : '과부족[EA]',
				width: '130px'
			}, {
				key : 'ipdCapaStatYn', align:'center',
				title : 'IPD용량양호',
				width: '130px',
				render : function(value){
					if(value == 'Y'){
						return 'O';
					}else if(value =='N'){
						return 'X';
					}
				}
			}, {
				key : 'brRlesYn', align:'center',
				title : 'BR해제여부',
				width: '130px',
				render : function(value){
					if(value == 'Y'){
						return 'O';
					}else if(value =='N'){
						return 'X';
					}
				}
			}, {
				key : 'rmsAcptYn', align:'center',
				title : 'RMS수용여부',
				width: '130px',
				render : function(value){
					if(value == 'Y'){
						return 'O';
					}else if(value =='N'){
						return 'X';
					}
				}
			}, {
				key : 'batryDistVal', align:'center',
				title : '축전지거리[m]',
				width: '130px'
			}, {
				key : 'cblTknsVal', align:'center',
				title : '케이블굵기[Sqr]',
				width: '130px'
			}, {
				key : 'voltDropVal', align:'center',
				title : '전압강하[V]',
				width: '130px'
			}, {
				key : 'jarCnt', align:'center',
				title : '조수[조]',
				width: '130px'
			}, {
				key : 'totCapa', align:'center',
				title : '총용량[AH]',
				width: '130px'
			}, {
				key : 'capaCoefVal', align:'center',
				title : '용량계수',
				width: '130px'
			}, {
				key : 'rqrdCapa', align:'center',
				title : '소요용량[AH]',
				width: '130px'
			}, {
				key : 'batryOvstCapa', align:'center',
				title : '과부족[AH]',
				width: '130px'
			}, {
				key : 'ovstJarCnt', align:'center',
				title : '과부족조수[조]',
				width: '130px'
			}, {
				key : 'bkExptTime', align:'center',
				title : '백업예상[H]',
				width: '130px'
			},{
				key : 'testDt', align:'center',
				title : '시험일자',
				width: '130px'
			},{
				key : 'depthVoltVal', align:'center',
				title : '심도전압[V]',
				width: '130px'
			},{
				key : 'depthVoltArvlTime', align:'center',
				title : '심도전압도달시간',
				width: '130px'
			},{
				key : 'min5AfPrtVoltVal', align:'center',
				title : '5분후출력전압',
				width: '130px'
			},{
				key : 'min10AfPrtVoltVal', align:'center',
				title : '10분후출력전압',
				width: '130px'
			},{
				key : 'min15AfPrtVoltVal', align:'center',
				title : '15분후출력전압',
				width: '130px'
			},{
				key : 'min20AfPrtVoltVal', align:'center',
				title : '20분후출력전압',
				width: '130px'
			},{
				key : 'min25AfPrtVoltVal', align:'center',
				title : '25분후출력전압',
				width: '130px'
			},{
				key : 'min30AfPrtVoltVal', align:'center',
				title : '30분후출력전압',
				width: '130px'
			},{
				key : 'rsltVal', align:'center',
				title : '결과',
				width: '130px',
				render : function(value){
					if(value == 'Y'){
						return '양호';
					}else if(value =='N'){
						return '불량';
					}
				}
			}],

			//data:dataTab2,

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });
	}

	function setEventListener() {
		var perPage = 100;


		//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
		$('#'+rtfGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.pageNo = $('#pageNo').val();
     	 	dataObj.rowPerPage = $('#rowPerPage').val();
     	 	//popup('SbeqpDtlLkup', "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfDtlLkup.do?sbeqpId="+dataObj.sbeqpId, '부대장비정류기상세정보',dataObj);
//			var dataObj = AlopexGrid.parseEvent(e).data;
//			dataObj.stat = 'mod';
//			if(dataObj._column <= 37){
//				parent.top.main.popup('EpwrStcMgmtRtfReg','정류기 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtRtfReg.do',dataObj,1050,600)
//			}else{
//				parent.top.main.popup('EpwrStcMgmtRtfRsltReg','방전시험 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtRtfRsltReg.do',dataObj,750,350)
//			}



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
		$('#'+rtfGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			rtf.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 축전지 그리드 페이지 selectbox를 변경했을 시
		$('#'+rtfGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			rtf.setGrid(1, eObj.perPage);
		});




		$('#btnRegRtf').on('click', function(e) {
//			var dataParam ={epwrClCd: 'R'}
//			popup('SbeqpReg','/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do', '부대장비등록', dataParam);
			var pageNo = $('#pageNo').val();
     	 	var rowPerPage = $('#rowPerPage').val();

			$a.popup({
              	popid: 'Batry',
              	title: '부대장비등록',
                  url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do?epwrClCd=R&pageNo='+pageNo+'&rowPerPage='+rowPerPage,
                  data: "",
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
		})

		$('#btnRegRtfRslt').on('click', function(e) {
			var selData = $('#'+rtfGridId).alopexGrid('dataGet',{_state:{selected:true}});
			if(selData.length>0){
//				var data = selData[0]
//				data.stat='add'
//					parent.top.main.popup('EpwrStcMgmtRtfRsltReg','방전시험 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtRtfRsltReg.do',data,850,350)
				$a.popup({
	              	popid: 'Rtf',
	              	title: '방전시험등록',
	                  url: "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfDchgTestReg.do?sbeqpId="+selData[0].sbeqpId + "&epwrFlag=Y",
	                  data: "",
	                  iframe: true,
	                  modal: true,
	                  movable:true,
	                  windowpopup : true,
	                  width : 900,
	                  height : 600
	              });
			}else{
				callMsgBox('','W', '선택 된 정류기가 없습니다.', function(msgId, msgRst){});
				return;
			}

		})

		$('#btnRtfTrend').on('click', function(e) {
			var selData = $('#'+rtfGridId).alopexGrid('dataGet',{_state:{selected:true}});
			if(selData.length>0){
				var data = {sbeqpId:selData[0].sbeqpId, mtsoId:selData[0].mtsoId, mtsoNm:selData[0].mtsoNm, systmNm:selData[0].systmNm};
				data.type = 'rtf';
				parent.top.main.popup('EpwrStcMgmtGraphCharts','Trend 분석','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtGraphCharts.do',data,850,650)
			}else{
				callMsgBox('','W', '선택 된 정류기가 없습니다.', function(msgId, msgRst){});
				return;
			}
		})
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+rtfGridId).alopexGrid('hideProgress');
			$('#'+rtfGridId).alopexGrid('dataSet', response.epwrStcMgmtRtfCurstList, serverPageinfo);

		}

		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+rtfGridId).alopexGrid('hideProgress');
			$('#'+rtfGridId).alopexGrid('dataSet', response.epwrStcMgmtRtfCurstList, serverPageinfo);


			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_정류기_'+recentYMD,
				sheetList : [{
					sheetName : '정류기',
					$grid : $("#"+rtfGridId)
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
			$('#'+rtfGridId).alopexGrid('hideProgress');

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
		var subParam = $("#searchRtf").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+rtfGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtRtfCurstList', param, 'GET', 'search');
	}


	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchRtf").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+rtfGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtRtfCurstList', param, 'GET', 'searchExcel');
	}


//	엑셀다운
	$('#btnRtfExportExcel').on('click', function(e) {
		//tango transmission biz 모듈을 호출하여야한다.
		rtf.setGridExcel(1, 1000000);

//		var param =  $("#searchMain").getData();
//		var subParam = $("#searchRtf").getData();
//
//		$.extend(param,subParam);
//
//		param = gridExcelColumn(param, rtfGridId);
//		param.pageNo = 1;
//		param.rowPerPage = 10;
//		param.firstRowIndex = 1;
//		param.lastRowIndex = 1000000000;
//
//
//		param.fileName = '전력통계_정류기'
//		param.fileExtension = "xlsx";
//		param.excelPageDown = "N";
//		param.excelUpload = "N";
//		param.method = "getEpwrStcMgmtRtfCurstList";
//
//		$('#'+rtfGridId).alopexGrid('showProgress');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/rtfExcelcreate', param, 'GET', 'excelDownload');
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