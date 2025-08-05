/**
 * UpsdUseAprvMgmt.js
 *
 * @author Administrator
 * @date 2017. 9. 25.
 * @version 1.0
 */
var main = $a.page(function() {

	var aprvGrid = 'dataGridAprv';
	var rcvGrid = 'dataGridRcv';
	var userId = $('#userId').val();
	var userList = [];
	var userNm = null;
	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	initGrid();
    	main.setGrid(1,5);
    	setSelectCode();
        setEventListener();
    	Tango.ajax({
    		url : 'tango-common-business-biz/common/business/system/users/TANGOT',
    		method : 'GET', //HTTP Method
    		flag : 'user'
    	}).done(successCallback)
		  .fail(failCallback);
        //httpRequest('tango-common-business-biz/common/business/system/users/TANGOT','', 'GET', 'userId');
    };

	//Grid 초기화
    function initGrid() {
    	//상면승인 그리드
    	$('#'+aprvGrid).alopexGrid({
    		height: "4row",
    		rowOption : {
    			defaultHeight : 25
    		},
    		paging : {
    			pagerSelect: [5,8,10,15,20]
    			,hidePageList: false  // pager 중앙 삭제
    		},
    		autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowSelectOption: false,
    		columnMapping: [{
    			align:'center',
    			width: '20',
    			numberingColumn: true
    		}, {
    			key : 'requestStep', align:'center',
    			title : '상태',
    			width: '40',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestId', align : 'center',
    			title : '요청ID',
    			width : '70',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		},{
    			key : 'orgNameL1', align : 'center',
    			title : '본부',
    			width : '80',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'sisulNm', align : 'center',
    			title : '국사명',
    			width : '100',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'floorName', align : 'center',
    			title : '층',
    			width : '40',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestUserNm', align : 'center',
    			title : '요청자',
    			width : '50',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestWork', align : 'center',
    			title : '사업명',
    			width : '80',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestDt', align : 'center',
    			title : '요청일시',
    			width : '50',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'approvalDt', align : 'center',
    			title : '완료일시',
    			width : '50',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		},],
    		message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    		}
    	});
    	//예약 그리드
    	$('#'+rcvGrid).alopexGrid({
    		height: "4row",
    		rowOption : {
    			defaultHeight : 25
    		},
    		paging : {
    			pagerSelect: [5,8,10,15,20],
    			hidePageList: false  // pager 중앙 삭제
    		},
    		autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowSelectOption: false,
    		columnMapping: [{
    			align:'center',
    			width: '20',
    			numberingColumn: true
    		}, {
    			key : 'requestStep', align:'center',
    			title : '상태',
    			width: '40',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestId', align : 'center',
    			title : '예약ID',
    			width : '70',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		},{
    			key : 'orgNameL1', align : 'center',
    			title : '본부',
    			width : '80',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'sisulNm', align : 'center',
    			title : '국사명',
    			width : '100',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'floorName', align : 'center',
    			title : '층',
    			width : '40',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestUserNm', align : 'center',
    			title : '예약자',
    			width : '50',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestWork', align : 'center',
    			title : '사업명',
    			width : '80',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'requestDt', align : 'center',
    			title : '예약일시',
    			width : '50',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		}, {
    			key : 'approvalDt', align : 'center',
    			title : '완료일시',
    			width : '50',
    			inlineStyle : {
    				lineHeight: '25px'
    			}
    		},],
    		message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    		}
    	});

    	$('#usersGrid').alopexGrid({
    		autoResize: true,
    		autoColumnIndex: true,
    		rowClickSelect: true,
    		rowSingleSelect: true,
    		fitTableWidth: true,
    		width: 300,
    		height: 200,
    		pager: false,
    		columnMapping: [{
    			key : 'userNm', align : 'center',
    			title : '이름',
    			width : '60',
    		}, {
    			key : 'userId',  align : 'center',
    			title : 'ID',
    			width : '60',
    		}, {
    			key : 'userRoleNm', align : 'center',
    			title : '팀명',
    			width : '120'
    		}
    		],
    		message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    		}
    	});

    };

  // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	var floorName = {supCd : paramData.sisulCd};
		var requestStep = {supCd: "001000"};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', requestStep, 'GET', 'requestStep');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/floorUseCd', floorName, 'GET', 'floorName');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUserList', '', 'GET', 'fstUserList');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/drawLayerCd', "", 'GET', 'layerId');

    }
    function setApprovalWrite() {
    	var idx  = $('#basicTabs').getCurrentTabIndex();
    	$("#status").val('I');
		var requestStep = {supCd: "001000"};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', requestStep, 'GET', 'requestStep');
    	disableInputSet();
		switch (idx) {
		case 0 :
			$('#requestType').val('A');
			$('#sisulCd').val(paramData.sisulCd);
			//$('#requestUserId').val(userId);
			var param = $("#aprvWriteForm").getData();
			var data = {requestType: param.requestType, sisulCd: param.sisulCd};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApprovalNewId', data, 'GET', 'newAprv');
			break;
		case 1 :
			$('#requestType').val('R');
			$('#sisulCd').val(paramData.sisulCd);
			//$('#requestUserId').val(userId);
			var param = $("#aprvWriteForm").getData();
			var data = {requestType: param.requestType, sisulCd: param.sisulCd};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApprovalNewId', data, 'GET', 'newAprv');
			break;
		default :
			break;
		}

    }


    function setEventListener() {
    	var perPage = 5;
    	$('#test').on('click', function(e){
    		$('#approvalUserNm1').setEnabled(true);
    	});


    	//	페이지 selectbox를 변경했을 시.
    	$('#'+aprvGrid).on('perPageChange', function(e){
    		var eObj = AlopexGrid.parseEvent(e);
    		perPage = eObj.perPage;
    		main.setGrid(1, perPage);
    	});

    	//탭 변경
    	$('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    		case 0 :
    			main.setGrid(1, perPage);
    			break;
    		case 1 :
    			main.setGrid(1, perPage);
    			break;
    		default :
    			break;
    		}
    	});


    	$('#'+aprvGrid).on("click", ".bodycell", function(e) {
    		var searchRequestId = {searchRequestId : AlopexGrid.parseEvent(e).data.requestId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApproval', searchRequestId, 'GET', 'aprv');
    	});

    	$('#'+rcvGrid).on("click", ".bodycell", function(e) {
    		var searchRequestId = {searchRequestId : AlopexGrid.parseEvent(e).data.requestId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApproval', searchRequestId, 'GET', 'aprv');
    	});

    	//요청
    	$('#btnAprvReq').on('click', function(e) {
    		setApprovalWrite();
    	});
    	$('#btnRcvReq').on('click', function(e) {
    		setApprovalWrite();
    	});

    	//닫기
    	$('#btnAprvCncl').on('click', function(e) {
    		$a.close();
    	});
    	$('#btnRcvCncl').on('click', function(e) {
    		$a.close();
    	});
    	$('#btnCls').on('click', function(e) {
    		$a.close();
    	});
    	//확인
    	$('#btnCnf').on('click', function(e) {
    		var status = $('#status').val();
    		var idx  = $('#basicTabs').getCurrentTabIndex();
    		var param;
    		if(status != 'V') {
    			switch (idx) {
    			case 0 :
    				param = $('#approvalForm').getData();
    				if(status == 'I') {
    					if(param.floorId == "" || param.floorId == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.layerId == "" || param.layerId == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.requestWork == "" || param.requestWork == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.requestMsg == "" || param.requestMsg == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.approvalUserNm == "" || param.approvalUserNm == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    						return;
    					}
    					var cnt = 0;
    					for(var i=0; i<userList.length;i++){

    						if(userList[i].userId == $('#approvalUserId').val() && userList[i].userNm == param.approvalUserNm){
    							cnt++;
    						}
    					}
    					if(cnt == 0){
							callMsgBox('','I', '처리자의 입력이 올바르지 않습니다.', function(msgId, msgRst){});
    						return;
						}
    				} else if(status == 'U') {
    					if(param.approvalMsg == "" || param.approvalMsg == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    				}
    				break;
    			case 1 :
    				param = $('#reservationForm').getData();
    				if(status == 'I') {
    					if(param.floorId == "" || param.floorId == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.requestCellNm == "" || param.requestCellNm == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.requestWork == "" || param.requestWork == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.requestMsg == "" || param.requestMsg == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    					if(param.approvalUserNm == "" || param.approvalUserNm == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    						return;
    					}
    					var cnt = 0;
    					for(var i=0; i<userList.length;i++){

    						if(userList[i].userId == $('#approvalUserId').val() && userList[i].userNm == param.approvalUserNm){
    							cnt++;
    						}
    					}
    					if(cnt == 0){
							callMsgBox('','I', '처리자의 입력이 올바르지 않습니다.', function(msgId, msgRst){});
    						return;
						}
    				} else if(status == 'U') {
    					if(param.approvalMsg == "" || param.approvalMsg == null){
    						callMsgBox('','I', '필수항목을 입력 바랍니다.', function(msgId, msgRst){});
    		 	     		return;
    					}
    				}
    				break;
    			default :
    				break;
    			}

    			callMsgBox('','C', "상면사용승인요청을 저장하시겠습니까?", function(msgId, msgRst){
  			       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	aprvSave();
 		        }
 		     });
    		}
    	});

	};

	// 밸리데이션 색과 Grid 출력 //////////////////////////////////////////////////////////////////////////////////////
	//승인 > 처리자
	$('#approvalUserNm1').focus(function(){
		$('.usersGrid').show();

		$(document).bind('focusin.usersGrid click.usersGrid', function(e) {
			if($(e.target).closest('.usersGrid, #approvalUserNm1').length) return;
			$(document).unbind('.usersGrid');
			$('.usersGrid').hide();
		});

		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUserList', '', 'GET', 'userList');
    });

	$('#approvalUserNm1').on('keyup', function(){
		var param = {searchNm : $('#approvalUserNm1').val()};

    	if(param.searchNm == '') {
    		$('#approvalUserNm1').addClass('valid');
    	} else {
    		$('#approvalUserNm1').removeClass('valid');
    	}

		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUserList', param, 'GET', 'userList');
	});

	//예약 > 처리자
	$('#approvalUserNm2').focus(function(){
		$('.usersGrid').show();

		$(document).bind('focusin.usersGrid click.usersGrid', function(e) {
			if($(e.target).closest('.usersGrid, #approvalUserNm2').length) return;
			$(document).unbind('.usersGrid');
			$('.usersGrid').hide();
		});

		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUserList', '', 'GET', 'userList');
    });

	$('#approvalUserNm2').on('keyup', function(){
		var param = {searchNm : $('#approvalUserNm2').val()};
    	if(param.searchNm == '') {
    		$('#approvalUserNm2').addClass('valid');
    	} else {
    		$('#approvalUserNm2').removeClass('valid');
    	}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUserList', param, 'GET', 'userList');
	});

	//승인 > 사업명
	$('#requestWork1').on('keyup', function(){
		var param = {requestWork1 : $('#requestWork1').val()};

		if(param.requestWork1 == '') {
			$('#requestWork1').addClass('valid');
		} else {
			$('#requestWork1').removeClass('valid');
		}
	});

	//예약 > 사업명
	$('#requestWork2').on('keyup', function(){
		var param = {requestWork2 : $('#requestWork2').val()};

		if(param.requestWork2 == '') {
			$('#requestWork2').addClass('valid');
		} else {
			$('#requestWork2').removeClass('valid');
		}
	});

	//예약 > 셀
	$('#requestCellNm').on('keyup', function(){
		var param = {requestCellNm : $('#requestCellNm').val()};

		if(param.requestCellNm == '') {
			$('#requestCellNm').addClass('valid');
		} else {
			$('#requestCellNm').removeClass('valid');
		}
	});

	//승인 > 층
	$('#floorName1').on('change', function(e) {
		var floorName1 = $('#floorName1').val();
		if(floorName1 == '') {
			$('#floorName1').addClass('valid');
		} else {
			$('#floorName1').removeClass('valid');
		}
	});

	//예약 > 층
	$('#floorName2').on('change', function(e) {
		var floorName2 = $('#floorName2').val();
		if(floorName2 == '') {
			$('#floorName2').addClass('valid');
		} else {
			$('#floorName2').removeClass('valid');
		}
	});

	//예약 > 요청내용
	$('#requestMsg1').on('keyup', function(){
		var param = {requestMsg1 : $('#requestMsg1').val()};

		if(param.requestMsg1 == '') {
			$('#requestMsg1').addClass('valid');
		} else {
			$('#requestMsg1').removeClass('valid');
		}
	});

	//예약 > 요청내용
	$('#requestMsg2').on('keyup', function(){
		var param = {requestMsg2 : $('#requestMsg1').val()};

		if(param.requestMsg2 == '') {
			$('#requestMsg2').addClass('valid');
		} else {
			$('#requestMsg2').removeClass('valid');
		}
	});
	// 밸리데이션 색과 Grid 출력 //////////////////////////////////////////////////////////////////////////////////////



	//그리드 셀 더블클릭 이벤트 바인딩
  	$('#usersGrid').on('dblclick','.bodycell', function(e){
  		var idx  = $('#basicTabs').getCurrentTabIndex();
  		var dataObj = null;
		dataObj = AlopexGrid.parseEvent(e).data;
		switch (idx) {
		case 0 :
			$('#approvalUserNm1').val(dataObj.userNm);
			$('#approvalUserNm1').removeClass('valid');
			break;
		case 1 :
			$('#approvalUserNm2').val(dataObj.userNm);
			$('#approvalUserNm2').removeClass('valid');
			break;
		default :
			break;
		}
		$('#approvalUserId').val(dataObj.userId);
		$('.usersGrid').hide();
	});

	function successCallback(response, status, jqxhr, flag){
		//층 콤보박스
		if(flag == 'floorName'){
			var option_data = [{cd: "", cdNm: "선택"}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$("#"+flag+'1').setData({
				data : option_data,
				option_selected: ''
			});
			$("#"+flag+'2').setData({
				data : option_data,
				option_selected: ''
			});
	   	}
		//작업 콤보박스
		if(flag == 'layerId'){
			var option_data = [{cd: "", cdNm: "선택"}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$("#"+flag).setData({
				data : option_data,
				option_selected: ''
			});
	   	}
		//처리 콤보박스
		if(flag == 'requestStep'){
			var option_data = [{cd: response[0].cd, cdNm: response[0].cdNm}];
    		for(var i=1; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$("#"+flag+'1').setData({
				data : option_data,
				option_selected: ''
			});
			$("#"+flag+'2').setData({
				data : option_data,
				option_selected: ''
			});
	   	}

		if(flag == 'fstUserList'){
			userList = response.userList;
		}
		if(flag == 'userList'){
    		$('#usersGrid').alopexGrid('hideProgress');
			$('#usersGrid').alopexGrid('dataSet', response.userList);
    	}


		if(flag == 'user'){
			userNm = response.userNm;
		}

		//요청내용
		if(flag == 'aprv'){
			if(response.approval[0].approvalUserId == userId && response.approval[0].requestStep == "요청") {
				$("#status").val('U');
				var requestStep = {supCd: "001000", exceptCd: "001001"};
		    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', requestStep, 'GET', 'requestStep');
			}else {
				$("#status").val('V');
			}
			disableInputSet();
			searchDetail(response.approval[0]);
		}

		//새 요청
		if(flag == 'newAprv'){
			var idx  = $('#basicTabs').getCurrentTabIndex();

			switch (idx) {
			case 0 :
				$("#requestId1").val(response.result[0].requestId);
				$("#requestDt1").val("");
				$("#affairNm1").val(response.result[0].affairNm);
				$("#requestUserNm1").val(userNm);
				$("#floorName1").setSelected("선택");
				$("#sisulCd1").val(response.result[0].sisulCd);
				$("#layerId").setSelected('L003');
				$("#requestWork1").val("");
				$("#requestMsg1").val("");
				$("#approvalUserNm1").val("")
				$("#requestStep1").setSelected("요청");
				$("#approvalDt1").val("");
				$("#approvalMsg1").val("");
				$('#approvalUserNm1').addClass('valid');
				$('#requestWork1').addClass('valid');
				$('#requestMsg1').addClass('valid');
				break;
			case 1 :
				$("#requestId2").val(response.result[0].requestId);
				$("#requestDt2").val("");
				$("#affairNm2").val(response.result[0].affairNm);
				$("#requestUserNm2").val(userNm);
				$("#floorName2").setSelected("선택");
				$("#sisulCd2").val(response.result[0].sisulCd);
				$("#requestWork2").val("");
				$("#requestMsg2").val("");
				$("#approvalUserNm2").val("")
				$("#requestStep2").setSelected("요청");
				$("#approvalDt2").val("");
				$("#approvalMsg2").val("");
				if(paramData.cellId != "" && paramData.cellNm != ""){
					$("#requestCell").val(paramData.cellId);
					$("#requestCellNm").val(paramData.cellNm);
				} else{
					$("#requestCell").val("");
					$("#requestCellNm").val("");
				}
				$('#approvalUserNm2').addClass('valid');
				$('#requestWork2').addClass('valid');
				$('#requestCellNm').addClass('valid');
				$('#requestMsg2').addClass('valid');
				break;
			default :
				break;
			}
		}

    	//조회시
		if(flag == 'search'){
			var serverPageinfo = {
					dataLength  : response.pager.totalCnt, 		//총 데이터 길이
					current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
					perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			var length = response.approvalList.length;
			var idx  = $('#basicTabs').getCurrentTabIndex();

			switch (idx) {
			case 0 :
				$('#'+aprvGrid).alopexGrid('hideProgress');
				$('#'+aprvGrid).alopexGrid('dataSet', response.approvalList, serverPageinfo);
				if(length > 0){
					var searchRequestId = {searchRequestId : response.approvalList[length-1].requestId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApproval', searchRequestId, 'GET', 'aprv');
				} else {
					setApprovalWrite();
				}
				break;
			case 1 :
				$('#'+rcvGrid).alopexGrid('hideProgress');
				$('#'+rcvGrid).alopexGrid('dataSet', response.approvalList, serverPageinfo);
				if(length > 0){
					var searchRequestId = {searchRequestId : response.approvalList[length-1].requestId};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApproval', searchRequestId, 'GET', 'aprv');
				} else {
					setApprovalWrite();
				}
				break;
			default :
				break;
			}
		}

    	if(flag == 'aprvSave'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    		}
    		var pageNo = $("#pageNo").val();
    		var rowPerPage = $("#rowPerPage").val();

    		main.setGrid(pageNo,rowPerPage);
    	}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'aprvSave'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    this.setGrid = function(page, rowPerPage){
    	$("#searchSisulCd").val(paramData.sisulCd);
    	$("#searchFloorId").val(paramData.floorId);
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

		var idx  = $('#basicTabs').getCurrentTabIndex();

		switch (idx) {
		case 0 :
			$('#searchRequestType').val('A');
			var param = $("#searchForm").serialize();
	    	$('#'+aprvGrid).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApprovalList', param, 'GET', 'search');
			break;
		case 1 :
			$('#searchRequestType').val('R');
			var param = $("#searchForm").serialize();
			$('#'+rcvGrid).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getApprovalList', param, 'GET', 'search');
			break;
		default :
			break;
		}
    }

    function searchDetail(param, length) {
    	var idx  = $('#basicTabs').getCurrentTabIndex();
		switch (idx) {
		case 0 :
			$("#requestId1").val(param.requestId);
			$("#requestDt1").val(param.requestDt);
			$("#affairNm1").val(param.affairNm);
			$("#requestUserNm1").val(param.requestUserNm);
			$("#floorName1").setSelected(param.floorId);
			$("#sisulCd1").val(param.sisulCd);
			$("#layerId").setSelected(param.layerId);
			$("#requestWork1").val(param.requestWork);
			$("#requestMsg1").val(param.requestMsg);
			$("#requestStep1").setSelected(param.requestStep);
			$("#approvalDt1").val(param.approvalDt);
			$("#approvalUserNm1").val(param.approvalUserNm);
			$("#approvalMsg1").val(param.approvalMsg);
			$('#approvalUserNm1').removeClass('valid');
			$('#requestWork1').removeClass('valid');
			$('#requestMsg1').removeClass('valid');
			break;
		case 1 :
			$("#requestId2").val(param.requestId);
			$("#requestDt2").val(param.requestDt);
			$("#affairNm2").val(param.affairNm);
			$("#requestUserNm2").val(param.requestUserNm);
			$("#floorName2").setSelected(param.floorId);
			$("#sisulCd2").val(param.sisulCd);
			$("#requestCellNm").val(param.requestCellNm);
			$("#requestWork2").val(param.requestWork);
			$("#requestMsg2").val(param.requestMsg);
			$("#requestStep2").setSelected(param.requestStep);
			$("#approvalUserNm2").val(param.approvalUserNm);
			$("#approvalDt1").val(param.approvalDt);
			$("#approvalMsg2").val(param.approvalMsg);
			$('#approvalUserNm2').removeClass('valid');
			$('#requestWork2').removeClass('valid');
			$('#requestCellNm').removeClass('valid');
			$('#requestMsg1').removeClass('valid');
			break;
		default :
			break;
		}
/*		$("#requestUserNm").val(param.requestUserNm);
		$('#approvalUserId').val(param.approvalUserId);*/
    }
    function disableInputSet() {
    	var status = $('#status').val();
    	if(status =='I') {
    		$('#floorName1').setEnabled(true);
    		$('#floorName2').setEnabled(true);
    		$('#requestWork1').setEnabled(true);
    		$('#requestWork2').setEnabled(true);
    		$('#layerId').setEnabled(true);
    		$('#requestCellNm').setEnabled(true);
    		$('#requestMsg1').setEnabled(true);
    		$('#requestMsg2').setEnabled(true);
    		$('#approvalUserNm1').setEnabled(true);
    		$('#approvalUserNm2').setEnabled(true);
    		$('#requestStep1').setEnabled(false);
    		$('#requestStep2').setEnabled(false);
    		$('#approvalMsg1').setEnabled(false);
    		$('#approvalMsg2').setEnabled(false);
    	} else if(status == "U") {
    		$('#floorName1').setEnabled(false);
    		$('#floorName2').setEnabled(false);
    		$('#requestWork1').setEnabled(false);
    		$('#requestWork2').setEnabled(false);
    		$('#layerId').setEnabled(false);
    		$('#requestCellNm').setEnabled(false);
    		$('#requestMsg1').setEnabled(false);
    		$('#requestMsg2').setEnabled(false);
    		$('#approvalUserNm1').setEnabled(false);
    		$('#approvalUserNm2').setEnabled(false);
    		$('#requestStep1').setEnabled(true);
    		$('#requestStep2').setEnabled(true);
    		$('#approvalMsg1').setEnabled(true);
    		$('#approvalMsg2').setEnabled(true);
    	} else if( status == "V") {
    		$('#floorName1').setEnabled(false);
    		$('#floorName2').setEnabled(false);
    		$('#requestWork1').setEnabled(false);
    		$('#requestWork2').setEnabled(false);
    		$('#layerId').setEnabled(false);
    		$('#requestCellNm').setEnabled(false);
    		$('#requestMsg1').setEnabled(false);
    		$('#requestMsg2').setEnabled(false);
    		$('#approvalUserNm1').setEnabled(false);
    		$('#approvalUserNm2').setEnabled(false);
    		$('#requestStep1').setEnabled(false);
    		$('#requestStep2').setEnabled(false);
    		$('#approvalMsg1').setEnabled(false);
    		$('#approvalMsg2').setEnabled(false);
    	}
    }
	function aprvSave(){
		$('#requestCell').val($('#requestCellNm').val())
		var param = $('#aprvWriteForm').getData();
		var idx  = $('#basicTabs').getCurrentTabIndex();
		switch (idx) {
		case 0 :
			$.extend(param,$('#approvalForm').getData());
			break;
		case 1 :
			$.extend(param,$('#reservationForm').getData());
			break;
		default :
			break;
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveApproval', param, 'POST', 'aprvSave');
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