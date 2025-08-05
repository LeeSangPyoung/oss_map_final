/**
 * EpwrStcMgmtFaltCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var falt = $a.page(function() {
	var faltGridId = 'dataGridFalt';
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
		$('#'+faltGridId).alopexGrid({
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
							/*{ fromIndex : 3, toIndex : 5, title:'고장일자'},*/
							{ fromIndex : 6, toIndex : 17, title:'고장내역'},
							{ fromIndex : 18, toIndex : 23, title:'시설현황'}
			],
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'mtsoNm', align:'center',
				title : '국사명',
				width: '130px'
			}, {
				key : 'mtsoTypNm', align:'center',
				title : '국사구분',
				width: '130px'
			}, {
				key : 'faltDt', align:'center',
				title : '고장일자',
				width: '130px'
			},

			/*{
				key : 'faltYear', align:'center',
				title : '고장일자',
				width: '130px'
			}, {
				key : 'faltMonth', align:'center',
				title : '월',
				width: '130px'
			}, {
				key : 'faltDay', align:'center',
				title : '일',
				width: '130px'
			},*/ {
				key : 'occrTime', align:'center',
				title : '발생시간',
				width: '130px',
				render : function (value, data, render, mapping, grid) {
					if(value != null && value != '' && value != ' ') {
						var item = value;
						item = item.substr(0,2) + ":" + item.substr(2,2);
						return item;
					}
				}
			}, {
				key : 'rcovTime', align:'center',
				title : '복구시간',
				width: '130px',
				render : function (value, data, render, mapping, grid) {
					if(value != null && value != '' && value != ' ') {
						var item = value;
						item = item.substr(0,2) + ":" + item.substr(2,2);
						return item;
					}
				}
			}, {
				key : 'overTime', align:'center',
				title : '이상시간',
				width: '130px'
			}, {
				key : 'srvcStopEyn', align:'center',
				title : '서비스중단(유,무)',
				width: '130px',
				render : function (value, data, render, mapping, grid) {
					if (value == 'Y') {
						return '유';
					}
					if (value == 'N'){
						return '무';
					}
				}
			}, {
				key : 'srvcStopTime', align:'center',
				title : '서비스중단시간(분)',
				width: '130px'
			}, {
				key : 'gntTruckDeptrTime', align:'center',
				title : '발전차출발시간',
				width: '130px',
				render : function (value, data, render, mapping, grid) {
					if(value != null && value != '' && value != ' ') {
						var item = value;
						item = item.substr(0,2) + ":" + item.substr(2,2);
						return item;
					}
				}
			}, {
				key : 'gntTruckArvlTime', align:'center',
				title : '발전차도착시간',
				width: '130px',
				render : function (value, data, render, mapping, grid) {
					if(value != null && value != '' && value != ' ') {
						var item = value;
						item = item.substr(0,2) + ":" + item.substr(2,2);
						return item;
					}
				}
			}, {
				key : 'dablFcltsDtsVal', align:'center',
				title : '장애시설내역',
				width: '130px'
			}, {
				key : 'lclFaltTypNm', align:'center',
				title : '고장유형1',
				width: '130px'
			}, {
				key : 'mclFaltTypNm', align:'center',
				title : '고장유형2',
				width: '130px'
			}, {
				key : 'occrCasVal', align:'center',
				title : '발생원인(자세히작성)',
				width: '130px'
			}, {
				key : 'trtmDtsVal', align:'center',
				title : '조치내역(자세히작성)',
				width: '130px'
			}, {
				key : 'sbeqpNm', align:'center',
				title : '부대장비명',
				width: '130px'
			}, {
				key : 'rtfVendNm', align:'center',
				title : '정류기제조사',
				width: '130px'
			}, {
				key : 'rtfMdlNm', align:'center',
				title : '정류기모델',
				width: '130px'
			}, {
				key : 'batryCapa', align:'center',
				title : '축전지용량',
				width: '130px'
			}, {
				key : 'exptPkTime', align:'center',
				title : '예상백업시간',
				width: '130px'
			}, {
				key : 'realPkTime', align:'center',
				title : '실제백업시간',
				width: '130px'
			}],

			//data:dataTab8,

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });
	}

	function setEventListener() {
		var perPage = 100;


		//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
		$('#'+faltGridId).on('dblclick', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			dataObj.stat = 'mod';
			parent.top.main.popup('EpwrStcMgmtFaltReg','고장이력 수정','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtFaltReg.do',dataObj,750,550)
		});

		// 고장이력 그리드 페이지 번호 클릭시
		$('#'+faltGridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			falt.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 고장이력 그리드 페이지 selectbox를 변경했을 시
		$('#'+faltGridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			falt.setGrid(1, eObj.perPage);
		});

		$('#btnRegFalt').on('click', function(e) {
			var data ={stat: 'add'}
			parent.top.main.popup('EpwrStcMgmtFaltReg','고장이력 등록','/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtFaltReg.do',data,750,550)
		})

		//		엑셀다운
		$('#btnFaltExportExcel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			var param =  $("#searchMain").getData();
			var subParam = $("#searchFalt").getData();

			$.extend(param,subParam);

			param = gridExcelColumn(param, faltGridId);
			param.pageNo = 1;
			param.rowPerPage = 10;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;


			param.fileName = '전력통계_고장이력'
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.method = "getEpwrStcMgmtFaltHstCurstList";

			$('#'+faltGridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/faltHstExcelcreate', param, 'GET', 'excelDownload');
		});

		/*$('#searchMtsoTypNm').on('change', function(e){
        	param.searchMtsoTypCd = $('#searchMtsoTypNm').getTexts()[0];
        });*/


	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};


			$('#'+faltGridId).alopexGrid('hideProgress');
			$('#'+faltGridId).alopexGrid('dataSet', response.epwrMgmtFaltHstCurstList, serverPageinfo);

		}

		if(flag == 'excelDownload'){
			$('#'+faltGridId).alopexGrid('hideProgress');

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
		if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
	}



	this.setGrid = function(page, rowPerPage) {

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		var param =  $("#searchMain").getData();
		var subParam = $("#searchFalt").getData();

		$.extend(param,subParam);
		paramData = param

		$('#'+faltGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEpwrStcMgmtFaltHstCurstList', param, 'GET', 'search');
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
});