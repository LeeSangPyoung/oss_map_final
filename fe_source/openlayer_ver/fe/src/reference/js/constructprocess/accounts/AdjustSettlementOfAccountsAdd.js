/**
 * AdjustSettlementOfAccountsAdd.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var parentList = [];

	var rowPerPageCnt = 15;

	//세팅
	var m = {
		grid : {
			gridObject : $('#dataGrid')
		},
		form : {
			formObject : $('form[name=searchForm]')
		},
		date : function (option,number){
			var currentDate = new Date();
			var optionDate = new Date(Date.parse(currentDate) - option * 1000 * 60 * 60 * 24);
			var optionYear = optionDate.getFullYear();
			var optionMonth = (optionDate.getMonth()+1)>9 ? ''+(optionDate.getMonth()+1) : '0'+(optionDate.getMonth()+1);
			var optionDay = optionDate.getDate() > 9 ? '' + optionDate.getDate() : '0' + optionDate.getDate();
			return 1 == number ? optionYear + '-' + optionMonth + '-' + optionDay : setDateFormat(getToday(true, 'D', -30));
		},
		api : {
			url : 'tango-transmission-biz/transmission/constructprocess/accounts/adjustSettlementOfAccountsAdd'
		},
		flag : {
			get : 'getList'
		},
		button : {
			search : function (number){
				switch(number){
				default : return $('#btnSearch'); break;
				case 1 : return $('#btnCtrtBpSearch'); break;
				case 2 : return $('#btnCnstnBpSearch'); break;
				case 3 : return $('#btnCstrSearch'); break;
				}
			},
			close : $('#btnClose'),
			confirm : $('#btnConfirm')
		},
		popup:{
			bpNameList : {
				id:'BpCommon',
				title:'시공업체',
				url:'/tango-transmission-web/constructprocess/common/BpCommon.do',
				width:'639',
				height:'802'
			}
		}
	}

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		init(param);
		initGrid();
        setEventListener();
    }

    //초기화면
    var init = function (param) {
    	$('input[name=ctrtBpNm]').setEnabled(false);
    	$('input[name=cnstnBpNm]').setEnabled(false);
    	$('input[name=cstrNm]').setEnabled(false);          //공사명

		$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});

		parentList = param.dataList;

		setSelectByOrg('mgmtOrgId','select',setSelectByCodeCallBack);    //네트워크 관리지사 코드
		//부모에서 받은 코드값이 B나 Z로 시작하면 select box를 disabled 해야하나 코드가 바뀌어서 ASIS랑 다름

		$('input[name=setlReqDtFrom]').val(m.date(0,0));
		$('input[name=setlReqDtTo]').val(m.date(0,1));
    }

    //Grid 초기화
    var initGrid = function () {
        //그리드 생성
        m.grid.gridObject.alopexGrid({
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
    		   align : 'center',
    		   key : 'check',
    		   width : '30px',
    		   selectorColumn : true
    	    } , {
				key : 'accountsDiv', align:'center',
				title : msgArray['accountsDiv'],
				width: '100'
			}, {
				key : 'ctrtBpNm', align:'center',
				title : msgArray['ctrtBpNm'],
				width: '100'
			}, {
				key : 'cnstnSuplBpNm', align:'center',
				title : msgArray['cnstnSuplBpNm'],
				width: '100'
			}, {
				key : 'mgmtOrgNm', align:'center',
				title : msgArray['mgmtOrgNm'],
				width: '100'
			}, {
				key : 'cstrNm', align:'center',
				title : msgArray['cstrNm'],
				width: '100'
			}, {
				key : 'uprcAplyDt', align:'center',
				title : msgArray['uprcAplyDt'],
				width: '100'
			}, {
				key : 'setlAmt', align:'center',
				title : msgArray['setlAmt'],
				width: '100'
			}, {
				key : 'adjtAmt', align:'center',
				title : msgArray['adjtAmt']+'(+,-)',
				width: '100'
			}, {
				key : 'adjtSetlRmk', align:'center',
				title : msgArray['adjtSetlRmk'],
				width: '100'
			}, {
				key : 'setlReqDt', align:'center',
				title : msgArray['setlReqDt'],
				width: '100'
			}, {
				key : 'erpCtrtNo', align:'center',
				title : msgArray['erpCtrtNo'],
				width: '100'
			}, {
				key : 'ctrtNm', align:'center',
				title : msgArray['ctrtNm'],
				width: '100'
			}, {
				key : 'strtgBuyTeamAprvDt', align:'center',
				title : msgArray['strtgBuyTeamAprvDt'],
				width: '100'
			}, {
				key : 'suplDrctDt', align:'center',
				title : msgArray['suplDrctDt'],
				width: '100'
			}, {
				key : 'suplDrctNo', align:'center',
				title : msgArray['suplDrctNo'],
				width: '100'
			}, {
				key : 'budgNm', align:'center',
				title : msgArray['budgNm'],
				width: '100'
			}, {
				key : 'cstrCd', align:'center',
				title : msgArray['cstrCd'],
				width: '100'
			}, {
				key : 'setlDivCd', align:'center',
				title : msgArray['setlDivCd'],
				width: '100'
			}, {
				key : 'invtCstDivCd', align:'center',
				title : msgArray['invtCstDivCd'],
				width: '100'
			}, {
				key : 'adjtSetlCstrCd', align:'center',
				title : msgArray['adjtSetlCstrCd'],
				width: '100'
			}],

			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
        });

       gridHide();
    }

    // 컬럼 숨기기
    var gridHide = function () {
    	var hideColList = ['adjtAmt','adjtSetlRmk','erpCtrtNo','ctrtNm','strtgBuyTeamAprvDt','suplDrctDt','suplDrctNo','budgNm','cstrCd','setlDivCd','invtCstDivCd'];
    	m.grid.gridObject.alopexGrid('hideCol', hideColList, 'conceal');
	}

    var setEventListener = function () {
    	m.button.search(0).on('click', function (){
    		setGrid(1, rowPerPageCnt, 'set');
    	});

    	$('form[name=searchForm]').keypress(function (event){
    		if (13 == event.keyCode){
    			setGrid(1, rowPerPageCnt, 'set');
    		}
    	});

    	m.grid.gridObject.on('scrollBottom', function(e){
        	var pageInfo = m.grid.gridObject.alopexGrid("pageInfo");

        	// 총건수와 현재 페이지건수가 동일하면 조회 종료
        	if(pageInfo.dataLength != pageInfo.pageDataLength){
        		//var pageNo = pageInfo.current+1;
        		//var rowPerPage = pageInfo.perPage;
        		//setGrid(pageNo, rowPerPageCnt, 'add');
        		setGrid(parseInt($('#pageNo').val()) + 1, $('#rowPerPage').val(), 'add');
        	}
    	});

    	m.button.search(1).on('click', function (){
    		openPopup(m.popup.bpNameList.id
					, m.popup.bpNameList.title
					, m.popup.bpNameList.url
					, null
					, m.popup.bpNameList.width
					, m.popup.bpNameList.height
					, setCtrtDataCallback);
    	});

    	m.button.search(2).on('click', function (){
    		openPopup(m.popup.bpNameList.id
					, m.popup.bpNameList.title
					, m.popup.bpNameList.url
					, null
					, m.popup.bpNameList.width
					, m.popup.bpNameList.height
					, setCnstnDataCallback);
    	});

    	m.button.search(3).on('click', function (){
    		var comParamArg = ['mgmtOrgNm','cnstnBpNm','cnstnBpId'];
        	setConstruction('cstrCd', 'cstrNm', comParamArg); // 공사코드, 공사명 외 EngSheet No등 Argument 전송 타입
    	});

    	m.button.close.on('click', function (){
    		$a.close();
    	});

    	m.button.confirm.on('click', function (){
    		var dataList = m.grid.gridObject.alopexGrid('dataGet', {_state: {selected:true}});

    		if (0 == dataList.length) {
    			callMsgBox('confirm','I', msgArray['noSelectedConstructionCode'], btnMsgCallback);
    			return;
    		}

    		var overlapCount = 0;
    		for (var i in parentList) {
    			for (var arr in dataList) {

    				var childValue =  dataList[arr].erpCtrtNo + dataList[arr].cstrCd + dataList[arr].setlDivCd + dataList[arr].invtCstDivCd;

    				if (parentList[i] == childValue) {
    					overlapCount++;
    				}
    			}
    		}

    		if (0 < overlapCount) {
    			callMsgBox('confirm','I', msgArray['DuplicationConstruction'], btnMsgCallback);
    			return;
    		}

    		$a.close(JSON.stringify(AlopexGrid.trimData(dataList)));
    	});

    	$('input[name=cstrCd]').on('input propertychange', function () {
    		$('input[name=cstrNm]').val('');
    	});

    	$('input[name=ctrtBpId]').on('input propertychange', function () {
    		$('input[name=ctrtBpNm]').val('');
    	});

    	$('input[name=ctrtBpNm]').on('input propertychange', function () {
    		$('input[name=ctrtBpId]').val('');
    	});

    	$('input[name=cnstnBpId]').on('input propertychange', function () {
    		$('input[name=cnstnBpNm]').val('');
    	});

    	$('input[name=cnstnBpNm]').on('input propertychange', function () {
    		$('input[name=cnstnBpId]').val('');
    	});
    }

	//request 성공시
    var successCallback = function (response,stats,xhr,flag){
    	var serverPageinfo;

    	if(response.pager != null){
    		serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    	}

    	var data = response.data;

    	if(flag == 'set'){
    		m.grid.gridObject.alopexGrid('hideProgress');
    		m.grid.gridObject.alopexGrid('dataSet', $.extend(true, [], data), serverPageinfo);
    	}

    	if(flag == 'add'){
    		m.grid.gridObject.alopexGrid('hideProgress');
    		m.grid.gridObject.alopexGrid('dataAdd', data, serverPageinfo);
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }

    //메세지 콜백
    var btnMsgCallback = function (msgId, msgRst) {

    }

    //코드 로딩 후
    var setSelectByCodeCallBack = function (response) {
    	if ('mgmtOrgId' == response) {
    		$.each($('select[name=mgmtOrgId]').children(), function (){
    			if (this.value == $('input[name=pMgmtOrgId]').val()) {
    				$(this).attr('selected','selected');
    				$('select[name=mgmtOrgId]').next().text($(this).text());
    			}
    		});
    	}
    }

    //계약업체
    var setCtrtDataCallback = function (response) {
    	var data = response;
    	$('input[name=ctrtBpId]').val(data.bpId);
    	$('input[name=ctrtBpNm]').val(data.bpNm);
    }

    //시공업체
    var setCnstnDataCallback = function (response) {
    	var data = response;
    	$('input[name=cnstnBpId]').val(data.bpId);
    	$('input[name=cnstnBpNm]').val(data.bpNm);
    }

    //데이터 조회
    var setGrid = function (pageNo, rowPerPageCnt, flag) {

    	$('#pageNo').val(pageNo);
    	$('#rowPerPage').val(rowPerPageCnt);

    	var param =  m.form.formObject.getData();

    	//param.pageNo = pageNo;
    	//param.rowPerPage = rowPerPageCnt;

    	if ('' == param.ctrtBpNm) {
    		param.ctrtBpId = '';
    	}

    	if ('' == param.cnstnBpNm) {
    		param.cnstnBpId = '';
    	}

    	m.grid.gridObject.alopexGrid('showProgress');
    	model.get({url : m.api.url,data : param,flag : flag}).done(successCallback).fail(failCallback);
    }

    var model = Tango.ajax.init({});

    //팝업 호출
    var openPopup = function(popupId,title,url,data,widthSize,heightSize,callBack){
		$a.popup({
        	popid: popupId,
        	title: title,
            url: url,
            data: data,
            width:widthSize,
            height:heightSize,
            callback: function(data) {
				callBack(data);
           	}
        });
	}

});