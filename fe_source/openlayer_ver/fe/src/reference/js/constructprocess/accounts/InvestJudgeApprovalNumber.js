/**
 * InvestJudgeApprovalNumber.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var m = {
		gridObj : $('#dataGrid'),

		form    : {formObject : $('form[name=searchForm]')},

		button  : {
			add : $('#btnCnstAdd'), //투자심사승인번호 추가
			del : $('#btnDel'),     //행삭제
			save : $('#btnSave')    //저장
		},

		api : {
			url : 'tango-transmission-biz/transmission/constructprocess/accounts/investJudgeApprovalNumber'
		},

		popup:{
			id:'InvestJudgeApprovalNumberSearch',
			title:msgArray['investJudgeApprovalNumberSearch'],
			url:'InvestJudgeApprovalNumberSearch.do',
			width:'1200',
			height:'550'
		},

		flag : {
			getList : 'getList',
			put     : 'create'
		}
	}

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		init(param);
    	initGrid();
    	setGrid();
        setEventListener();
    }

    //초기화면
    var init = function (param) {
    	$('input[name=cstrCd]').val(parent.baseInform.hiddenCstrCd.value);
    	var lowDemdBizDivCd = 'C05';
    	var frstRegDate = '';

    	if ('undefined' != typeof parent.baseInform.hiddenLowDemdBizDivCd.value) {
    		lowDemdBizDivCd = parent.baseInform.hiddenLowDemdBizDivCd.value;
    	}

    	if ('undefined' != typeof parent.baseInform.hiddenFrstRegDate.value) {
    		frstRegDate = parent.baseInform.hiddenFrstRegDate.value;
    	}

    	//2015년 10월 8일 이후 데이터 및 사업구분이 B2B인입(비즈광랜, LE 등) (C020인 경우 버튼 보이도록
    	//B2B인입(비즈광랜, LE등), B2B인입(LE), B2B인입(Biz광랜/프리밴), B2B인입(전용회선)
    	if ('C02' == lowDemdBizDivCd && parseInt(frstRegDate) >= 20151008 || 'C05' == lowDemdBizDivCd || 'C06' == lowDemdBizDivCd || 'C07' == lowDemdBizDivCd) {
    		m.button.add.show();
    		m.button.save.show();
    		m.button.del.show();
    	} else {
    		m.button.add.hide();
    		m.button.save.hide();
    		m.button.del.hide();
    	}
    	if($.TcpUtils.isNotEmpty(param.callFlag)){
    		$('#callFlag').val(param.callFlag);
    	}
    	
    }

    //Grid 초기화
    var initGrid = function () {
    	
        //그리드 생성
       m.gridObj.alopexGrid({
    	   autoColumnIndex: true,
    	   rowSingleSelect: false,
    	   rowClickSelect: false,
    	   autoResize: true,
    	  
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

       
       if($.TcpUtils.isNotEmpty($('#callFlag').val()) && $('#callFlag').val() == "SKBEQP"){
    	   m.gridObj.alopexGrid({
        	   height:'4rows'
        	   })
   		}
       
       
       gridHide();
    }

    // 컬럼 숨기기
    var gridHide = function () {
	}

    var setEventListener = function () {
    	m.button.add.on('click', function (){
    		var param =  m.form.formObject.getData();
    		param.dataList = [];

    		m.gridObj.alopexGrid('dataGet', function(data){
    			param.dataList[data._index.row] = data.ukeyAppltReqNo;
    		});
    		param.popHead = 'Y';
    		openPopup(m.popup.id
					, m.popup.title
					, m.popup.url
					, param
					, m.popup.width
					, m.popup.height
					, setDataCallback);
    	});

    	//행삭제
    	m.button.del.on('click', function (){

    		if (0 == m.gridObj.alopexGrid('pageInfo').pageDataLength) {
    			callMsgBox('btnMsgWarning','W', msgArray['data'], btnMsgCallback);
    			return;
    		}

    		//선택한 데이터를 Object로 변환
    		var data = m.gridObj.alopexGrid('dataGet', {_state: {selected:true}});

    		if (0 < data.length) {
    			callMsgBox('removeRow','C', msgArray['confirm'], btnMsgCallback);

    		} else {
    			callMsgBox('btnMsgWarning','W', msgArray['delete'], btnMsgCallback);
    			return;
    		}

    		//삭제 된 행을 제외한 전체 데이터
    	});

    	//저장
    	m.button.save.on('click', function (){
    		if (1 == $('input[name=oscapprovCnt]').val()) {
    			callMsgBox('btnMsgWarning','W', msgArray['submit'], btnMsgCallback);
    			return;
    		}

    		m.gridObj.alopexGrid('showProgress');

    		var param =  m.form.formObject.getData();
    		param.dataList = m.gridObj.alopexGrid('dataGet');

        	model.post({
        		url  : m.api.url,
        		data : param,
        		flag : m.flag.put
        	}).done(successCallback)
    		.fail(failCallback);
    	});

	}

	//request 성공시
    var successCallback = function (response, status, xhr,  flag){
    	var data;
    	m.gridObj.alopexGrid('hideProgress');

    	switch(flag){
    	case 'create' :
    		setGrid();
    		break;
    	default : data = response.dataList;
    		m.gridObj.alopexGrid('dataSet', data);
    		break;
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }

    var btnMsgCallback = function (msgId, msgRst){

    	if ('removeRow' == msgId && 'Y' == msgRst) {
    		m.gridObj.alopexGrid('dataDelete', {_state: {selected:true}});
    	}
    }

    //그리드에 추가
    var setDataCallback = function (response) {
    	m.gridObj.alopexGrid('dataAdd',response);
    }

    //데이터 조회
    var setGrid = function (page, rowPerPage) {
    	var param =  m.form.formObject.getData();
    	
    	// 공동투자-참여사시 cstrCd 대체 2017.08.25 추가
		console.log("subTabs7 : ");
		console.log(param.cstrCd);
		console.log(parent.$('#jintInvtOnrCstrCd').val());
		if($.TcpUtils.isNotEmpty(parent.$('#jintInvtOnrCstrCd').val())){
				param.cstrCd = parent.$('#jintInvtOnrCstrCd').val();
				param.skAfcoDivCd = parent.$('#jintInvtOnrCstrCd').val().substring(0,1);
		}
		console.log(param.cstrCd);
    	
    	
    	m.gridObj.alopexGrid('showProgress');

    	model.get({url : m.api.url,data : param,flag : m.flag.search}).done(successCallback).fail(failCallback);
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
            windowpopup : true,
            /*
        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
        	*/
            callback: function(data) {
				callBack(data);
           	}
        });
	}
});