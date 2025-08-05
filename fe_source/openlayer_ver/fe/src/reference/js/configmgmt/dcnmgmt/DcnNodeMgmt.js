/**
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var addgridId = 'dataAddGrid';
	var paramData = null;

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		paramData = param;
		initGrid();
		setSelectCode(param);
		setRegDataSet(param);
		setEventListener();

	};

	function setRegDataSet(data) {
		
		$('#dcnId').val(data.dcnId);
		
		var param = {dcnId: data.dcnId, nodeYn: "Y", pageNo: 1, rowPerPage: 10000};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/dcnNode', param, 'GET', 'searchNode');
	}

	//Grid 초기화
	function initGrid() {

		//그리드 생성
		$('#'+gridId).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			height:"6row",
			rowClickSelect: true,
			rowSingleSelect: false,
			autoColumnIndex: true,
			defaultColumnMapping:{
				sorting : true
			},
			columnMapping: [{
				align:'center',
				width: '50px',
				selectorColumn : true,
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '150px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '250px'
			}, {
				key : 'eqpTid', align:'center',
				title : 'TID',
				width: '200px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '120px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

		//그리드 생성
		$('#'+addgridId).alopexGrid({
			pager : false,
			height:"6row",
			rowClickSelect: true,
			rowSingleSelect: false,
			autoColumnIndex: true,
			defaultColumnMapping:{
				sorting: true
			},
			columnMapping: [{
				align:'center',
				width: '50px',
				selectorColumn : true,
			}, {
				key : 'repEqpId', align:'center',
				title : '대표장비',
				width: '60px'
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '150px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '250px'
			}, {
				key : 'eqpTid', align:'center',
				title : 'TID',
				width: '200px'	
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '120px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});
		
//		$('#' + addgridId).alopexGrid("updateOption", { rowSelectOption: {radioColumn : true, singleSelect : true} });

	};

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode(data) {

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ data.mgmtGrpNm, null, 'GET', 'tmof');
		
	}


	function setEventListener() {

		var perPage = 100;

		// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			setGrid(1, eObj.perPage);
		});

		//조회 
		$('#btnSearch').on('click', function(e) {
			setGrid(1,perPage);
		});

		//엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				setGrid(1,perPage);
			}
		});

		//추가 
		$('#btnAdd').on('click', function(e) {
			var data          = AlopexGrid.trimData($('#'+gridId    ).alopexGrid('dataGet', {_state:{selected:true}}));
			var data_editlist = AlopexGrid.trimData($('#'+addgridId).alopexGrid('dataGet', {_state:{added:true}}));

			for(var i=0; i<data.length; i++){
				if (data_editlist.length > 0) {
					for(var j=0; j<data_editlist.length; j++){
						if (data[i].eqpId == data_editlist[j].eqpId){
							callMsgBox('','W', configMsgArray['alreadySelect'] + " (" + data[i].eqpNm+")" , function(msgId, msgRst){});
							return;
						}
						
						if (data[i].eqpTid == data_editlist[j].eqpTid && data[i].eqpTid != undefined){
							callMsgBox('','W', '동일한 TID 장비가 이미 추가되어 있습니다.' + " (" + data[i].eqpNm+")" , function(msgId, msgRst){});
							return;
						}
					}
				}
			}
			$('#'+addgridId).alopexGrid('dataAdd', data);
			$('#'+gridId).alopexGrid("rowSelect", {_state : {selected : true}}, false);
		});

		//삭제 
		$('#btnDel').on('click', function(e) {
			var data = AlopexGrid.trimData($('#'+addgridId).alopexGrid('dataGet', {_state:{selected:true}}));

			if(data.length !=0){
				$('#'+addgridId).alopexGrid('dataDelete',data);
			}else{
				//선택된 데이타가 없습니다.
				callMsgBox('','W', configMsgArray['selectNoData'] , function(msgId, msgRst){});
			}
		});
		
		//대표장비지정
		$('#btnSelectRepEqp').on('click', function(e) {
			var data = AlopexGrid.trimData($('#'+addgridId).alopexGrid('dataGet', {_state:{selected:true}}));

			if(data.length == 1){
				$('#'+addgridId).alopexGrid('dataEdit', {repEqpId : ''}, {_state: {selected: false}});
				$('#'+addgridId).alopexGrid('dataEdit', {repEqpId : '대표'}, {_state: {selected: true}});
			}else if(data.length > 1){
				callMsgBox('','W', '대표장비 하나만 선택하십시오.' , function(msgId, msgRst){});
			}else{
				callMsgBox('','W', '대표장비를 선택하십시오.' , function(msgId, msgRst){});
			}
			
		});

		//취소 
		$('#btnCncl').on('click', function(e) {
			$a.close();
		});

		//저장 
		$('#btnSave').on('click', function(e) {
			var data = $('#'+addgridId).alopexGrid('dataGet');

//			if(data.length == 0){
//				callMsgBox('','W', '저장 할 데이타가 없습니다.' , function(msgId, msgRst){});
//				return;
//			}

			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){  
				//저장한다고 하였을 경우
				if (msgRst == 'Y') {
					dcnNodeReg(); 
				} 
			}); 
		});

	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){

		if(flag == 'dcnNodeReg') {

			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
					if (msgRst == 'Y') {
						$a.close();
					} 
				}); 
				
				var pageNo = $("#pageNo", opener.document).val();
	    		var rowPerPage = $("#rowPerPage", opener.document).val();
	    		
	            $(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
			}else if(response.Result == "Fail"){
				callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
			}
		}


		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: "전체",mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
    			$('#tmof').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#tmof').setData({
    	             data:option_data,
    	             tmof:paramData.tmof
    			});
    		}
		}

		if(flag == 'search') {
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.dcnNodeList);
		}
		
		if(flag == 'searchNode') {
			$('#'+addgridId).alopexGrid('hideProgress');
			setSPGrid(addgridId, response, response.dcnNodeList);
		}
	}

	function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}

		if(flag == 'portCopyReg'){
			//저장을 실패 하였습니다.
			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
		}

	}

	function dcnNodeReg() {
		var dcnId = $('#dcnId').val();
		var repEqpId = $('#'+addgridId).alopexGrid('dataGet', function(data){return data.repEqpId === '대표';});

		var param = $('#'+addgridId).alopexGrid('dataGet');

		var userId;
		if($("#userId").val() == ""){
			userId = "SYSTEM";
		}else{
			userId = $("#userId").val();
		}

		if(param.length == 0){
			param = [{dcnId: dcnId, repEqpId: "", eqpId: "", frstRegUserId: userId, lastChgUserId: userId}];
		}else{
			for(var i=0; i<param.length; i++){
				param[i].dcnId = dcnId;
				if(repEqpId.length > 0){
					param[i].repEqpId = repEqpId[0].eqpId;
				}else{
					param[i].repEqpId = "";
				}
				param[i].frstRegUserId = userId;
				param[i].lastChgUserId = userId;
			}
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/insertDcnNode', param, 'POST', 'dcnNodeReg');
	}

	function setGrid(page, rowPerPage) {
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);
		
		var param =  $("#searchForm").getData();
		param.nodeYn = "N";

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/dcnmgmt/dcnNode', param, 'GET', 'search');
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