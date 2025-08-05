/**
 * DwTargetMgmt.jsp
 * 
 * @author 김장훈
 * @date 2022. 07. 05. 오전 10:14:03
 * @version 1.0
 */
var main = $a.page(function() {
   	var perPage = 100;
	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setEventListener();
    };

	//Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowspanGroupSelect: true,
    		ellipsisText : true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : '순번',
				width: '50px',
				numberingColumn: true
			}, {
				key : 'lnkgIfId', align:'center',
				title : '연동ID',
				width: '100px'
			}, {
				key : 'lnkgIfNm', align:'center',
				title : '연동명',
				width: '180px'
			}, {
				key : 'lnkgTblNm', align:'center',
				title : '테이블명',
				width: '200px'
			}, {
				key : 'ifPrdDesc', align:'center',
				title : '연동시간',
				width: '80px'
			}, {
				key : 'lnkgDesc', align:'center',
				title : '연동테이블명',
				width: '180px'
			}, {
				key : 'fileNm', align:'center',
				title : '연동파일',
				width: '240px'
			}, {
				key : 'fileStorgDay', align:'center',
				title : '저장주기',
				width: '70px'
			}, {
				key : 'colNmInclYn', align:'center',
				title : '헤더 포함',
				width: '70px'
			}, {
				key : 'selQryCtt', align:'center',
				title : '컬럼명',
				width: '100px'
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	};

    function setEventListener() {
 
    	// 페이지 번호 클릭시
   	 	$('#'+gridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	main.setGrid(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	main.setGrid(1, eObj.perPage);
        });

        //조회
    	$('#btnSearch').on('click', function(e) {
    		main.setGrid(1,perPage);
    	});
    	
    	//엔터키로 조회
        $('#mainSearchForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			main.setGrid(1,perPage);
      		}
    	 });

    	//추가
        $('#btnReg').on('click', function(e) {
        	dataParam = {"newYn" : "Y"};
        	popup('dwTargetRegNew', $('#ctx').val()+'/configmgmt/dwtargetmgmt/DwTargetRegPop.do', 'DW 연동대상 추가', dataParam);
        });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
        $('#'+gridId).on('dblclick', '.bodycell', function(e){
        	var dataObj = null;
        	dataObj = AlopexGrid.parseEvent(e).data;
        	dataParam = {"newYn" : "N","lnkgIfId": dataObj.lnkgIfId};
        	
        	popup('dwTargetRegDtl', $('#ctx').val()+'/configmgmt/dwtargetmgmt/DwTargetRegPop.do', 'DW 연동대상 상세', dataParam);

        });
        		
		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e);
		});

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
		
		var param = $("#mainSearchForm").getData();
		
		param = gridExcelColumn(param, $('#'+gridId));
		param.pageNo = 1;
		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();
		
		var now = new Date();
		var fileName = 'DW연동대상관리-' + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = 'getDwTargetMgmtList';
		param.excelFlag = 'DwTargetMgmtList';
		fileNameOnDemand = fileName + '.xlsx';
		
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
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

	this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#mainSearchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/dwTargetMgmt', param, 'GET', 'search');
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
    
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		
		switch(flag){
			case "search":
				$('#'+gridId).alopexGrid('hideProgress');
				setSPGrid(gridId, response, response.dwTargetMgmt);
				break;
			case "excelDownloadOnDemand":
				$('#'+gridId).alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
				break;
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
	
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "search":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

    //조회데티어 출력
    function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
		
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //팝업 호출
    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
        	popid: pidData,
        	title: titleData,
        	url: urlData,
        	data: paramData,
        	windowpopup : true,
        	modal: true,
        	movable:true,
        	width : 1080,
        	height : 830,
        	callback: function(data) {
        		//if (data.dwTargetDelYn == "Y"){
        			main.setGrid(1,perPage);
        		//}
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