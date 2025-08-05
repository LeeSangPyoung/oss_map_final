/**
 * InvestJudgeApprovalNumberSearch.js
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
			search  : $('#btnSearch'),  //조회
			confirm : $('#btnConfirm'), //확인
			close   : $('#btnClose')    //닫기
		},
		
		api : {
			search : 'tango-transmission-biz/transmission/constructprocess/accounts/investJudgeApprovalNumberSearch'
		},
		
		flag : {
			search : 'search'
		}
	}
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		$('input[name=cstrCd]').val(param.cstrCd);
		$('input[name=appltReqStatCd]').val(param.appltReqStatCd);
		parentList = param.dataList;
		
		if($.TcpUtils.isNotEmpty(param.popHead)){
			$('#popHeadDiv').show();
		}else{
			$('#popHeadDiv').hide();
		}
		
    	initGrid();
    	//setGrid();
        setEventListener();
    }
    
    //Grid 초기화
    var initGrid = function () {
  		
        //그리드 생성
    	m.gridObj.alopexGrid({
    		autoColumnIndex: true,
    		rowSingleSelect: false,
    		rowClickSelect: false,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},
			paging : {
    			hidePageList: true,  // pager 중앙 삭제
    			pagerSelect: false  // 한 화면에 조회되는 Row SelectBox 삭제
    		},
    		columnMapping: [{
    			align : 'center',
    			key : 'check',
    			width : '30px',
    			selectorColumn : true
    		}, {
    			key : 'appltReqStatCdNm', align:'center',
				title : msgArray['constructRequestStatusCode'],
				width: '70px'
    		}, {
				key : 'invtJdgeAprvNo', align:'center',
				title : msgArray['investJudgeApprovalNumber'],
				width: '70px'
			}, {
				key : 'invtInsptAprvNm', align:'center',
				title : msgArray['investJudgeApprovalName'],
				width: '70px'
			}, {
				key : 'ukeyAppltReqNo', align:'center',
				title : msgArray['constructRequestNumber'],
				width: '70px'
			}, {
				key : 'appltReqTitlNm', align:'center',
				title : msgArray['constructRequestName'],
				width: '70px'
			}, {
				key : 'ukeyMtsoNm', align:'center',
				title : msgArray['mobileTelephoneSwitchingOfficeName'],
				width: '70px'
			}, {
				key : 'bldNm', align:'center',
				title : msgArray['buildingName'],
				width: '70px'
			}, {
				key : 'lnInvtCost', align:'center',
				title : msgArray['lnInvtCst'],
				width: '70px',
				render : {type : 'string', rule : 'comma'}
			}, {
				key : 'rjctRsn', align:'center',
				title : msgArray['cancelRejectReason'],
				width: '70px'
			}],
			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
    	});
    	
    	m.gridObj.alopexGrid('updateOption',{height: '3row'});
    }
    
    // 컬럼 숨기기
    var gridHide = function () {    	
	}
    
    var setEventListener = function () {
    	//조회
    	m.button.search.on('click', function (){
    		setGrid(1,rowPerPageCount,'set');
    	});
    	
    	m.gridObj.on('scrollBottom', function(e){
        	var pageInfo = m.gridObj.alopexGrid("pageInfo");

        	// 총건수와 현재 페이지건수가 동일하면 조회 종료
        	if(pageInfo.dataLength != pageInfo.pageDataLength){
        		var rowPerPage = pageInfo.perPage;
        		setGrid(parseInt($('#pageNo').val()) + 1, rowPerPage, 'add');
        	}
    	});
    	
    	//확인
    	m.button.confirm.on('click', function (){
    		if (0 == m.gridObj.alopexGrid('pageInfo').pageDataLength) {
    			callMsgBox('submitConfirm','I', msgArray['noData'], btnMsgCallback);
    			return;
    		}
    		
    		var dataList = m.gridObj.alopexGrid('dataGet', {_state: {selected:true}});
    		
    		if (0 == dataList.length) {
    			callMsgBox('submitConfirm','I', msgArray['selectAddRow'], btnMsgCallback);
    			return;
    		}
    		
    		var overlapCount = 0;
    		for (var i in parentList) {
    			for (var arr in dataList) {
    				if (parentList[i] == dataList[arr].ukeyAppltReqNo) {
    					overlapCount++;
    				}
    			}
    		}
    		
    		if (0 < overlapCount) {
    			callMsgBox('submitConfirm','I', msgArray['constructReqeustNumberDuplication'], btnMsgCallback);
    			return;
    		}
    		
    		$a.close(dataList);
    	});
    	
    	m.button.close.on('click', function (){
    		$a.close();
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
    
    //데이터 조회
    var setGrid = function (pageNo, rowPerPage, flag) {
    	$('#pageNo').val(pageNo);
    	var param =  m.form.formObject.getData();
    	param.rowPerPageCnt = rowPerPage;
    	
		if ('' == param.appltReqTitlNm && '' == param.ukeyAppltReqNo && '' == param.invtJdgeAprvNm) {
			return callMsgBox('submitConfirm','I', msgArray['requiredSearchCondition'], btnMsgCallback);
		}
    	
		m.gridObj.alopexGrid('showProgress');
    	
    	model.get({url : m.api.search,data : param,flag : flag}).done(successCallback).fail(failCallback);
    }
    
    //ajax 호출
    var model = Tango.ajax.init({});
    
    var btnMsgCallback = function (msgId, msgRst) {
    	
    }
});