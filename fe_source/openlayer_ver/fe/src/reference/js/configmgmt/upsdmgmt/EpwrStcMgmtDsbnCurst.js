/**
 * EpwrStcMgmtDsbnCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 06.
 * @version 1.0
 */
var dsbn = $a.page(function() {
	var dsbnGridId = 'dataGridDsbn';
	var paramData = null;
//	var $tooltip = $('#tooltip');
	var html = "";
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		//setDate();
		//setSelectCode();
		setEventListener();
	};
	function initGrid() {
		$('#'+dsbnGridId).alopexGrid({
	    	paging : {
	    		pagerSelect: [100,300,500,1000,5000,10000]
	           ,hidePageList: false  // pager 중앙 삭제
	    	},
	    	autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			defaultColumnMapping:{
				sorting : true
			},
			headerGroup : [
			               { fromIndex : 8, toIndex : 10, title:'계약전력'},
			               { fromIndex : 11, toIndex : 30, title:'Main 분전반'},
			               { fromIndex : 33, toIndex : 52, title:'분기 분전반'},
			],
			grouping:{
				by:['mgmtGrpNm','orgNm','teamNm','tmofNm','mtsoTypNm','mtsoNm','florDivVal','gageCustNo','ctrtEpwrVal','ctrtEpwrRoadRate'
				    ,'mainSbeqpNm','mainCapaVal','mainCbplLoadRate','mainCbplUbfVal','mainCblTkns','mainCblTknsLoadRate'
				    ,'mainVoltRsVal','mainVoltStVal','mainVoltTrVal','mainVcurRVal','mainVcurSVal','mainVcurTVal','mainCbplEpwrVal'
				    ,'mainCnptTmprRVal','mainCnptTmprSVal','mainCnptTmprTVal','mainCblTmprRVal','mainCblTmprSVal','mainCblTmprTVal'
				    ,'mainLakgVcurVal','mainTvssInstlStatCd','mainTmnbxInstlStatCd'],
				useGrouping:true,
				useGroupRearrange:true,
				useGroupRowspan:true
			},
			renderMapping : {
				'customTooltip': {
					renderer: function(value, data, render, mapping){
						var val = "";
						if(value == '0'){
							val = '장비선택';
						}else if(value=='1'){
							val = '불필요';
						}else if(value=='2'){
							val = '미설치';
						}
						return '<div id="'+data._index.id+mapping.key+'">'+val+'</div>';
					}
				}
			},
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {/* 관리그룹--숨김데이터            */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px',
				rowspan:true
			}, {/* 본부			 */
				key : 'orgNm', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px',
				rowspan:true
			}, {/* 팀	 */
				key : 'teamNm', align:'center',
				title : configMsgArray['team'],
				width: '100px',
				rowspan:true
			},{/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '150px',
				rowspan:true
			},{/* 국사유형		 */
				key : 'mtsoTypNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px',
				rowspan:true
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '150px',
				rowspan:true
			}, {
				key : 'florDivVal', align:'center',
				title : '총 층수',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						for(var i=-6; i<0; i++){
							if(value == i){
								return "B" + -i + "층";
							}
						}
						for(var i=1; i<21; i++){
							if(value == i){
								return i + "층";
							}
						}
					}
				},
				rowspan:true
			}, {
				key : 'gageCustNo', align:'center',
				title : '계량기번호',
				width: '120px',
				rowspan:true
			}, {
				key : 'ctrtEpwrVal', align:'center',
				title : '계약전력(KW)',
				width: '100px',
				rowspan:true
			}, {
				key : 'ctrtEpwrRoadRate',  align:'center',
				title : '부하율(%)',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				},
				rowspan:true
			}, {
				key : 'mainSbeqpNm',  align:'center',
				title : '분전반명',
				width: '150px',
				rowspan:true
			}, {
				key : 'mainCapaVal',  align:'center',
				title : '차단기용량',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCbplLoadRate',  align:'center',
				title : '부하율(%)',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				},
				rowspan:true
			}, {
				key : 'mainCbplUbfVal',  align:'center',
				title : '불평형율[%]',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				},
				rowspan:true
			}, {
				key : 'mainCblTkns',  align:'center',
				title : '케이블 굵기',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCblTknsLoadRate',  align:'center',
				title : '부하율(%)',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				},
				rowspan:true
			}, {
				key : 'mainVoltRsVal',  align:'center',
				title : '전압(RS)',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainVoltStVal',  align:'center',
				title : '전압(ST)',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainVoltTrVal',  align:'center',
				title : '전압(TR)',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainVcurRVal',  align:'center',
				title : '전류(R)',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainVcurSVal',  align:'center',
				title : '전류(S)',
				width: '100px',
				rowspan:true
			},{
				key : 'mainVcurTVal',  align:'center',
				title : '전류(T)',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCbplEpwrVal',  align:'center',
				title : '전력(KW)',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCnptTmprRVal',  align:'center',
				title : '접속점온도R',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCnptTmprSVal',  align:'center',
				title : '접속점온도S',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCnptTmprTVal',  align:'center',
				title : '접속점온도T',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCblTmprRVal',  align:'center',
				title : '케이블온도R',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCblTmprSVal',  align:'center',
				title : '케이블온도S',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainCblTmprTVal',  align:'center',
				title : '케이블온도T',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainLakgVcurVal',  align:'center',
				title : '누설전류',
				width: '100px',
				rowspan:true
			}, {
				key : 'mainTvssInstlStatCd',  align:'center',
				title : 'TVSS(SPD)',
				width: '100px',
				render: {type: "customTooltip"},
				tooltip: false,
				rowspan:true
			}, {
				key : 'mainTmnbxInstlStatCd',  align:'center',
				title : '발전단자함',
				width: '100px',
				render: {type: "customTooltip"},
				tooltip: false,
				rowspan:true
			}, {
				key : 'qrtSbeqpNm',  align:'center',
				title : '분전반명',
				width: '150px'
			}, {
				key : 'qrtCapaVal',  align:'center',
				title : '차단기용량',
				width: '100px'
			}, {
				key : 'qrtCbplLoadRate',  align:'center',
				title : '부하율(%)',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				}
			}, {
				key : 'qrtCbplUbfVal',  align:'center',
				title : '불평형율[%]',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				}
			}, {
				key : 'qrtCblTkns',  align:'center',
				title : '케이블 굵기',
				width: '100px'
			}, {
				key : 'qrtCblTknsLoadRate',  align:'center',
				title : '부하율(%)',
				width: '100px',
				render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				}
			}, {
				key : 'qrtVoltRsVal',  align:'center',
				title : '전압(RS)',
				width: '100px'
			}, {
				key : 'qrtVoltStVal',  align:'center',
				title : '전압(ST)',
				width: '100px'
			}, {
				key : 'qrtVoltTrVal',  align:'center',
				title : '전압(TR)',
				width: '100px'
			}, {
				key : 'qrtVcurRVal',  align:'center',
				title : '전류(R)',
				width: '100px'
			}, {
				key : 'qrtVcurSVal',  align:'center',
				title : '전류(S)',
				width: '100px'
			},{
				key : 'qrtVcurTVal',  align:'center',
				title : '전류(T)',
				width: '100px'
			}, {
				key : 'qrtCbplEpwrVal',  align:'center',
				title : '전력(KW)',
				width: '100px'
			}, {
				key : 'qrtCnptTmprRVal',  align:'center',
				title : '접속점온도R',
				width: '100px'
			}, {
				key : 'qrtCnptTmprSVal',  align:'center',
				title : '접속점온도S',
				width: '100px'
			}, {
				key : 'qrtCnptTmprTVal',  align:'center',
				title : '접속점온도T',
				width: '100px'
			}, {
				key : 'qrtCblTmprRVal',  align:'center',
				title : '케이블온도R',
				width: '100px'
			}, {
				key : 'qrtCblTmprSVal',  align:'center',
				title : '케이블온도S',
				width: '100px'
			}, {
				key : 'qrtCblTmprTVal',  align:'center',
				title : '케이블온도T',
				width: '100px'
			}, {
				key : 'qrtLakgVcurVal',  align:'center',
				title : '누설전류점검상태',
				width: '100px'
			}, {
				key : 'qrtTvssInstlStatCd',  align:'center',
				title : 'TVSS(SPD)',
				width: '100px',
				render: {type: "customTooltip"},
				tooltip: false
			}, {
				key : 'qrtTmnbxInstlStatCd',  align:'center',
				title : '발전단자함',
				width: '100px',
				render: {type: "customTooltip"},
				tooltip: false
			}, {
				key : 'dsbnId', align:'center',
				title : '수배전ID',
				width: '150px'
			}, {
				key : 'mainSbeqpId',  align:'center',
				title : '메인분전반ID',
				width: '100px'
			}, {
				key : 'qrtSbeqpId',  align:'center',
				title : '분전반ID',
				width: '100px'
			}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });
		gridHide();

	}

	function setEventListener() {
		var perPage = 100;


		//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
		$('#'+dsbnGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.stat = 'mod';
			parent.top.main.popup('EpwrStcMgmtDsbnReg','수배전 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtDsbnReg.do',dataObj,1150,800)

		});

		// 축전지 그리드 페이지 번호 클릭시
		$('#'+dsbnGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			dsbn.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 축전지 그리드 페이지 selectbox를 변경했을 시
		$('#'+dsbnGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			dsbn.setGrid(1, eObj.perPage);
		});

		//수배전 등록
		$('#btnRegRcvgDsbn').on('click', function(e) {
			var data ={stat: 'add'}
			parent.top.main.popup('EpwrStcMgmtDsbnReg','수배전 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtDsbnReg.do',data,1150,800)
		})


		$('#btnDsbnTrend').on('click', function(e) {
			var selData = $('#'+dsbnGridId).alopexGrid('dataGet',{_state:{selected:true}});
			if(selData.length>0){
				var data = {sbeqpId:selData[0].dsbnId, mtsoId:selData[0].mtsoId, mtsoNm: selData[0].mtsoNm,type:"dsbn", gageId:selData[0].gageId, mainSbeqpId:selData[0].mainSbeqpId, qrtSbeqpId:selData[0].qrtSbeqpId, florDivVal:selData[0].florDivVal};
				parent.top.main.popup('EpwrStcMgmtGraphCharts','Trend 분석','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtGraphCharts.do',data,850,650)
			}else{
				callMsgBox('','W', '선택 된 수배전이 없습니다.', function(msgId, msgRst){});
				return;
			}
		})

		$('#tooltip').convert();
		$('#'+dsbnGridId).on('mouseover', '.bodycell', function(e){
			var evObj = AlopexGrid.parseEvent(e);
			var data = evObj.data;
			var mapping  = evObj.mapping;
			$('#tooltip').close();
			html = "";

			if(mapping.key === 'mainTvssInstlStatCd' || mapping.key === 'qrtTvssInstlStatCd'){
				$('#tooltip').close();
				var connCbplId = "";
				if(mapping.key == 'mainTvssInstlStatCd'){
					connCbplId = data.mainCbplId
				}else if(mapping.key == 'qrtTvssInstlStatCd'){
					connCbplId = data.qrtCbplId
				}
				$('#tooltip').attr('data-base', '#'+data._index.id + mapping.key);
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/tvssInfList/'+connCbplId, null, 'GET', 'tvssInfList');

			}else if(mapping.key === 'mainTmnbxInstlStatCd' || mapping.key === 'qrtTmnbxInstlStatCd'){
				$('#tooltip').close();
				var connCbplId = "";
				if(mapping.key == 'mainTmnbxInstlStatCd'){
					connCbplId = data.mainCbplId
				}else if(mapping.key == 'qrtTmnbxInstlStatCd'){
					connCbplId = data.qrtCbplId
				}
				$('#tooltip').attr('data-base', '#'+data._index.id + mapping.key);
				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/cbplInfList/'+connCbplId, null, 'GET', 'cbplInfList');
			}else{
				$('#tooltip').close();
			}
		});
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'tvssInfList'){
			html = "";
			if(response.length > 0){
				for (var i = 0; i < response.length; i++) {
					if(response[i].exusCbrkInstlYn == "" || response[i].exusCbrkInstlYn == null || response[i].exusCbrkInstlYn == undefined){
						response[i].exusCbrkInstlYn = "불량";
					}
					if(response[i].opStatCd == "" || response[i].opStatCd == null || response[i].opStatCd == undefined){
						response[i].opStatCd = "불량";
					}
					html += response[i].sbeqpNm+" (차단기 설치여부 : "+response[i].exusCbrkInstlYn+", 운용상태 : "+response[i].opStatCd+")";
					if(i < response.length){
						html += "<br>";
					}
				}
				$('#tooltip').html(html);
				$('#tooltip').open();
			}
		}
		if(flag == 'cbplInfList'){
			html = "";
			if(response.length > 0){
				for (var i = 0; i < response.length; i++) {
					html += response[i].sbeqpNm;
					if(i < response.length){
						html += "<br>";
					}
				}
				$('#tooltip').html(html);
				$('#tooltip').open();
			}
		}
		if(flag == 'search'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+dsbnGridId).alopexGrid('hideProgress');
			$('#'+dsbnGridId).alopexGrid('dataSet', response.epwrStcMgmtDsbnCurstList, serverPageinfo);

		}

		if(flag == 'searchExcel'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+dsbnGridId).alopexGrid('hideProgress');
			$('#'+dsbnGridId).alopexGrid('dataSet', response.epwrStcMgmtDsbnCurstList, serverPageinfo);

			var dt = new Date();
			var recentY = dt.getFullYear();
			var recentM = dt.getMonth() + 1;
			var recentD = dt.getDate();

			if(recentM < 10) recentM = "0" + recentM;
			if(recentD < 10) recentD = "0" + recentD;

			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

			var worker = new ExcelWorker({
				excelFileName : '전력통계_수배전_'+recentYMD,
				sheetList : [{
					sheetName : '수배전',
					$grid : $("#dataGridDsbn")
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
			$('#'+dsbnGridId).alopexGrid('hideProgress');

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
		var subParam = $("#searchDsbn").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+dsbnGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtDsbnCurstList', param, 'GET', 'search');
	}

	this.setGridExcel = function(page, rowPerPage) {

		$('#pageNo').val(1);
		$('#rowPerPage').val(1000000);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchDsbn").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+dsbnGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtDsbnCurstList', param, 'GET', 'searchExcel');
	}



//	엑셀다운
	$('#btnDsbnExportExcel').on('click', function(e) {
		dsbn.setGridExcel(1, 1000000);
		//alert();
		//$("#dataGridDsbn").alopexGrid('updateOption', {perPage:300});





		//tango transmission biz 모듈을 호출하여야한다.
//		var param =  $("#searchMain").getData();
//		var subParam = $("#searchDsbn").getData();
//
//		$.extend(param,subParam);
//
//		param = gridExcelColumn(param, dsbnGridId);
//		param.pageNo = 1;
//		param.rowPerPage = 10;
//		param.firstRowIndex = 1;
//		param.lastRowIndex = 1000000000;
//		param.fileName = '전력통계_수배전';
//		param.fileExtension = "xlsx";
//		param.excelPageDown = "N";
//		param.excelUpload = "N";
//		param.method = "getEpwrStcMgmtDsbnCurstList";
//
//		$('#'+dsbnGridId).alopexGrid('showProgress');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/dsbnExcelcreate', param, 'GET', 'excelDownload');
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
	function gridHide(){
    	var hideColList = ["cnptRTmprVal","cnptSTmprVal","cnptTTmprVal","cblRTmprVal","cblSTmprVal","cblTTmprVal","dsbnId","mainSbeqpId","qrtSbeqpId"];
    	$('#'+dsbnGridId).alopexGrid("hideCol", hideColList);
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