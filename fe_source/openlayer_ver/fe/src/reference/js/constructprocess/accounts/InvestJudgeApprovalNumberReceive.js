/**
 * InvestJudgeApprovalNumberReceive.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var parentList = [];
	var rowPerPageCount = 15;
	var m = {
		gridObj : $('#dataGrid'),

		form    : {
			formObject : $('form[name=searchForm]')
		},

		button  : {
			btnSearch   : $('#btnSearch'),  //조회
			btnExcel    : $('#btnExcel')    //엑셀 다운로드
		},

		api : {
			search : 'tango-transmission-biz/transmission/constructprocess/accounts/investJudgeApprovalNumberReceive'
		},

		flag : {
			search : 'search'
		}
	}

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		init();
    	initGrid();
        setEventListener();
    }

	var init = function () {
		$('input[name=ukeyAppltReqNo]').focus();
	}

    //Grid 초기화
    var initGrid = function () {

        //그리드 생성
    	m.gridObj.alopexGrid({
    		autoColumnIndex: true,
    		rowSingleSelect: false,
    		rowClickSelect: false,
    		autoResize: true,
    		paging : {
    			hidePageList: true,  // pager 중앙 삭제
    			pagerSelect: false  // 한 화면에 조회되는 Row SelectBox 삭제
    		},
    		defaultColumnMapping:{
    			sorting: true
			},
    		columnMapping: [{
    			key : 'appltReqStatCdNm', align:'center',
				title : msgArray['constructRequestStatusCode'],
				width: '80px'
    		}, {
				key : 'invtJdgeAprvNo', align:'center',
				title : msgArray['investJudgeApprovalNumber'],
				width: '70px'
			}, {
				key : 'invtJdgeAprvNm', align:'left',
				title : msgArray['investJudgeApprovalName'],
				width: '120px'
			}, {
				key : 'ukeyAppltReqNo', align:'center',
				title : msgArray['constructRequestNumber'],
				width: '70px'
			}, {
				key : 'appltReqTitlNm', align:'left',
				title : msgArray['constructRequestName'],
				width: '150px'
			}, {
				key : 'ukeyMtsoNm', align:'left',
				title : msgArray['mobileTelephoneSwitchingOfficeName'],
				width: '150px'
			}, {
				key : 'bldNm', align:'left',
				title : msgArray['buildingName'],
				width: '100px'
			}, {
				key : 'lnInvtCost', align:'right',
				title : msgArray['lnInvtCst'],
				width: '60px',
				render : {type:'string', rule:'comma'}
			}, {
				key : 'rjctRsn', align:'left',
				title : msgArray['cancelRejectReason'],
				width: '120px'
			}],
			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
    	});

    	//gridHide();
    }

    // 컬럼 숨기기
    var gridHide = function () {
	}

    var setEventListener = function () {
    	//조회
    	m.button.btnSearch.on('click', function (){
    		setGrid(1,rowPerPageCount,'set');
    	});

    	$('form[name=searchForm]').keypress(function (event) {
    		if (13 == event.keyCode){
    			setGrid(1,rowPerPageCount,'set');
    		}
    	});

    	m.gridObj.on('scrollBottom', function(e){
        	var pageInfo = m.gridObj.alopexGrid("pageInfo");

        	// 총건수와 현재 페이지건수가 동일하면 조회 종료
        	if(pageInfo.dataLength != pageInfo.pageDataLength){
        		var rowPerPage = pageInfo.perPage;
        		setGrid(parseInt($('#pageNo').val()) + 1, rowPerPage, 'add');
        	}
    	});

    	//엑셀 다운로드
    	m.button.btnExcel.on('click', function (){
    		if (0 == m.gridObj.alopexGrid('pageInfo').pageDataLength) {
    			callMsgBox('noData','I', msgArray['noData'], btnMsgCallback);
    			return;
    		}
    		exportExcel();
    	});
	}

	//request 성공시
    var successCallback = function (response,status,xhr,flag){
    	var serverPageinfo;

    	if(response.pager != null){
    		serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    	}

    	var data = response.dataList;

    	if(flag == 'set'){
    		m.gridObj.alopexGrid('hideProgress');
    		m.gridObj.alopexGrid('dataSet', $.extend(true, [], data), serverPageinfo);
    	}

    	if(flag == 'add'){
    		m.gridObj.alopexGrid('hideProgress');
    		m.gridObj.alopexGrid('dataAdd', data, serverPageinfo);
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }

    var btnMsgCallback = function (msgId, msgRst){

    }

    //데이터 조회
    var setGrid = function (pageNo, rowPerPage, flag) {
    	$('#pageNo').val(pageNo);
    	var param =  m.form.formObject.getData();
    	param.rowPerPageCnt = rowPerPage;

		if ('' == param.appltReqTitlNm && '' == param.ukeyAppltReqNo && '' == param.invtJdgeAprvNm) {
			callMsgBox('requiredSearchCondition','I', msgArray['requiredSearchCondition'], btnMsgCallback);
			return;
		}

		m.gridObj.alopexGrid('showProgress');
    	model.get({url  : m.api.search,data : param,flag : flag}).done(successCallback).fail(failCallback);
    }

    //ajax 호출
    var model = Tango.ajax.init({});

    //엑셀다운로드
    var exportExcel = function () {

    	var worker = new ExcelWorker({
    		excelFileName: msgArray['investJudgeApprovalNumberRcvCurrentState'],
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: 'ExcelExport',
    			$grid: m.gridObj
    		}]
    	});
    	worker.export({
    		merge: false,
    		exportHidden: false,
    		filtered  : false,
    		selected: false,
    		useGridColumnWidth : true,
    		border  : true
    	});
    }
});