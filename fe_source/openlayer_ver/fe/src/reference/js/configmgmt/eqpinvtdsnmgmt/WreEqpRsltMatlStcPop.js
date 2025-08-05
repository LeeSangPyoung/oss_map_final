/**
 * WreEqpRsltBizPurpStcPop.js
 *
 * @author P182022
 * @date 2022. 10. 25. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
   	var perPage 	= 100;
   	var gridId		= "dataGrid";

   	var mHdofcCmb 	= [];
   	var mAfeYr		= "";
   	var mAfeDemdDgr	= "";

    this.init = function(id, param) {
    	mAfeYr		= param.afeYr;
    	mAfeDemdDgr	= param.afeDemdDgr;

    	//AFE 연차
    	selectAfeYrCode('afeYr');
    	//본부코드
    	selectHdofcCode('hdofcCd');

    	setEventListener();

    	// 그리드 생성
    	initGrid();
    };

    // 이벤트 설정
    function setEventListener() {

    	// 페이지 번호 클릭시
   	 	$('#'+gridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });

        // 조회
        $("#btnSearch").on("click", function(e) {
    		setFormData(1, perPage);
    	});

    	//닫기
		$('#btnDtlCncl').on('click', function(e) {
			$a.close();
		});

        //AFE 차수
    	$("#afeYr").on("change", function(e) {
    		mAreaYear1 = $("#afeYr").val();
        	if(mAreaYear1 == ''){
        		$("#afeDemdDgr").empty();
    			$("#afeDemdDgr").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};

	        	selectAfeDemdDgrCode('afeDemdDgr', dataParam);
        	}
    	});

		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	//btnExportExcelOnDemandClickEventHandler(e);
    		var gridData = $('#'+gridId).alopexGrid('dataGet');
    		if (gridData.length == 0) {
    			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
    				return;
    		}

    		var param = $("#searchForm").getData();

    		var now = new Date();
    		var excelFileName = "자재통계_" + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
    		var worker = new ExcelWorker({
        		excelFileName : excelFileName,
        		palette : [{
        			className : 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className : 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '자재통계',
        			$grid: $('#dataGrid')
        		}]
        	});
        	worker.export({
        		merge: false,
        		exportHidden: false,
        		useGridColumnWidth : true,
        		border  : true,
        		exportNumberingColumn : true
        	});
		});

    }

    // AFE 년차
    function selectAfeYrCode(objId) {
    	var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', param, 'GET', objId);
	}

    // AFE 수요회차
    function selectAfeDemdDgrCode(objId, param) {

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeDemdDgrlist', param, 'GET', objId);
	}

    // 본부코드
    function selectHdofcCode(objId) {
		var param = {};//C00623

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getHdofcCode', param, 'GET', objId);
	}

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(event){
		var gridData = $('#'+gridId).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var param = $("#searchForm").getData();

		param = gridExcelColumn(param, $('#'+gridId));
//		param.pageNo = 1;
//		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();

		var now = new Date();
		var fileName = '자재통계_' + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = 'getMatlStc';
		param.excelFlag = 'getMatlStc';
		fileNameOnDemand = fileName + '.xlsx';

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
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
			if ((gridHeader[i].key != undefined && gridHeader[i].key != 'id'
				&& gridHeader[i].key != 'check')) {
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

    //Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
    			pagerSelect: false
    			,hidePageList: true  // pager 중앙 삭제
    		},
    		defaultColumnMapping:{
    			sorting : true
    		},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowspanGroupSelect: true,

    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : '순번',
				width: '45px',
				numberingColumn: true
			}, {
				key : 'hdofcNm', align:'center',
				title : '본부',
				width: '55px',
			}, {
				key : 'demdBizDivNm', align:'center',
				title : '사업목적',
				width: '80px',
			}, {
				key : 'lowDemdBizDivNm', align:'left',
				title : '사업구분',
				width: '190px',
			}, {
				key : 'namsMatlCd', align:'center',
				title : '자재코드',
				width: '80px',
			}, {
				key : 'namsMatlNm', align:'center',
				title : '자재명',
				width: '140px',
			}, {
				key : 'totQuty', align:'center',
				title : '설계수량',
				width: '70px',
			}, {
				key : 'inveQuty', align:'center',
				title : '재고수량',
				width: '70px',
			}, {
				key : 'buyQuty', align:'center',
				title : '구매수량',
				width: '70px',
			}, {
				key : 'totMtrlCost', align:'right',
				title : '물자비',
				width: '80px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'totCstrCost', align:'right',
				title : '공사비',
				width: '80px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'totLnInvtCost', align:'right',
				title : '선로투자비',
				width: '90px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'totSumrCost', align:'right',
				title : '합계',
				width: '80px',
				render: {type:"string", rule : "comma"}
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	};

    // 조회
    function setFormData(page, rowPerPage) {
    	var param =  $("#searchForm").serialize();

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getMatlStc', param, 'GET', 'search');
    }

    //request 호출
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

	//request 성공시.
	function successCallback(response, status, jqxhr, flag){

		switch(flag){
			case "search":
				$('#'+gridId).alopexGrid('hideProgress');
				setSpGrid(gridId, response, response.dataList);
				break;
			case 'afeYr':
				$('#afeYr').clear();
				var option_data =  [];
				var stdAfeYr = "";
				var paramAfeYr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeYr) {
						paramAfeYr = response[i].cd;
					}
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}

				if (paramAfeYr.length > 0) {
					selectId = paramAfeYr;
				}else {
					selectId = stdAfeYr;
				}

				$('#afeYr').setData({data:option_data,afeYr:selectId});
				selectAfeDemdDgrCode('afeDemdDgr', {afeYr:selectId});
				break;
			case 'afeDemdDgr':
				$('#afeDemdDgr').clear();
				var option_data =  [];
				var stdDemdDgr = "";
				var paramDemdDgr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeDemdDgr) {
						paramDemdDgr = response[i].cd;
					}
					if(response[i].stdAfeDivYn == 'Y'){
						stdDemdDgr = response[i].cd;
					}

				}

				if (paramDemdDgr.length > 0) {
					selectId = paramDemdDgr;
				}else {
					selectId = stdDemdDgr;
				}
				$('#afeDemdDgr').setData({data:option_data,afeDemdDgr:selectId});

				setTimeout(function() {
					// 통계조회
					setFormData(1, perPage);
				}, 500);
				break;
			case 'hdofcCd':

				$('#hdofcCd').clear();

				var option_data =  [{comGrpCd: "", cd: "",cdNm: configMsgArray['all'], useYn: ""}];

				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					option_data.push(resObj);

				}

				$('#hdofcCd').setData({
					data:option_data
				});


				break;
			case "excelDownloadOnDemand":
				$('#'+gridId).alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
				break;
		}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "search":
				$('#'+gridId).alopexGrid('hideProgress');
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

    //Grid에 Row출력
    function setSpGrid(GridID,Option,Data) {

		$('#'+GridID).alopexGrid('dataSet', Data, '');

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