/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
$a.page(function() {
	//전송실

	let gridId1 = "leftGrid";
	let gridId2 = "rightGrid";

    //초기 진입점
	let paramData = null;

	let uniqueArray = new Set();

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	initGrid();

    	setRegDataSet(param);//넘어온 데이터 세팅
    	setSelectCode();     //select 정보 세팅
        setEventListener();  //이벤트

        if(param.regYn == "N"
        	&& param.mtsoInvtSmltId != "") {
//        	$("#btnDel").show();
//        	$("#coverageId").setEnabled('false'); //커버리지 선택 비활성화

        	setLeftGrid(param);
        }
//        else {
//        	$("#btnDel").hide();
//        }
    };

    function initGrid(){

    	$('#'+gridId1).alopexGrid({
    		paging : {
                pagerTotal: true //총 건수   안보이게
         	},
         	height: '350px',
         	autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			preventScrollPropagation:true,
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: false,
			leaveDeleted: false,
			columnMapping : [
				{key : 'check', align: 'center',width: '40px', selectorColumn : true},
    			{key : 'demdMtsoNm', align:'left', title : '국사명', width: '240px'},
    			{key : 'mtsoTypNm', align:'left', title : '구분', width: '110px'},
    			{key : 'mtsoTypCd', align:'left', title : '구분코드', width: '110px', hidden: true},
    			{key : 'demdMtsoId', align:'left', title : '수요국사ID', width: '160px', hidden: true},
			],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    	//그리드 생성
        $('#'+gridId2).alopexGrid({
        	paging : {
                pagerTotal: true //총 건수   안보이게
         	},
         	height: '350px',
         	autoColumnIndex: true,
     		autoResize: true,
     		rowSelectOption: {
     			clickSelect: false,
     			singleSelect: false
     		},
     		cellSelectable : true,
			columnMapping : [
				{key : 'check', align: 'center',width: '40px', selectorColumn : true},
    			{key : 'mtsoNm', align:'left', title : '국사명', width: '240px'},
    			{key : 'mtsoTypNm', align:'left', title : '구분', width: '110px'},
    			{key : 'mtsoTypCd', align:'left', title : '구분코드', width: '110px', hidden: true},
    			{key : 'mtsoId', align:'left', title : '국사ID', width: '160px', hidden: true},
			],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    }

    /*-----------------------------*
     *  넘어온 데이터 세팅
     *-----------------------------*/
    function setRegDataSet(data) {
    	$('#mtsoInvtSlmtRegArea').setData(data);

    }

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	//커버리지 설계 내역
    	let param = {};
    	param.mgmtGrpNm = "SKT";
		param.intgMtsoId = $("#intgMtsoId").val();

		param = Util.convertQueryString(param);
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/topology/getCoverageDsnList', param, 'GET', 'selectCoverageDsn');
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {
    	//취소
    	$('#btnCncl').on('click', function(e) {
    		$a.close();
        });

    	//저장
    	$('#btnSave').on('click', function(e) {
    		intgMtsoSlmtReg();
        });

    	//삭제
    	$('#btnDel').on('click', function(e) {
    		intgMtsoSlmtDel();
    	});

    	//국사 조회
    	$('#btnMtsoSearch').on('click', function(e) {
    		let param	= {};
    		let demdMtsoId = [];
    		param.mgmtGrpNm = "SKT";//$('#mgmtGrpNm').val();
    		param.mtsoInvtSmltId = $("#mtsoInvtSmltId").val();
    		param.intgMtsoId = $("#intgMtsoId").val();
    		param.mtsoNm = $("#mtsoNm").val();

    		if (param.mtsoNm == ""
    			&& !$("#covChk").is(':checked')) {
    			callMsgBox('','W', '조회 조건을 확인해주세요.[국사명/커버리지] ', function(msgId, msgRst){});
    			return;
    		}

    		if($("#covChk").is(':checked')) {
    			if(paramData.regYn == "Y") {
    				callMsgBox('btnMsgWarning','I', "기준 커버리지 정보를 저장 후 선택 가능합니다.");
        			return;
    			} else {
    				param.covChk = $("#covChk").val();
    			}
    		}

    		if (uniqueArray.size > 0) {
    			demdMtsoId = [...uniqueArray].join(',');
    			param.mtsoIds = demdMtsoId;
    		}

    		param = Util.convertQueryString(param);
    		$('#'+gridId2).alopexGrid('showProgress');
    		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/getObjMtsoList', param, 'GET', 'objMtsoSearch');

        });

    	// 엔터키로 조회
 		$('#mtsoInvtSlmtRegForm').on('keydown', function(e){
 			if (e.which == 13  ){
 				let param	= {};
 				let demdMtsoId = [];
 	    		param.mgmtGrpNm = "SKT";//$('#mgmtGrpNm').val();
 	    		param.mtsoInvtSmltId = $("#mtsoInvtSmltId").val();
 	    		param.intgMtsoId = $("#intgMtsoId").val();
 	    		param.mtsoNm = $("#mtsoNm").val();

 	    		if (param.mtsoNm == ""
 	    			&& !$("#covChk").is(':checked')) {
 	    			callMsgBox('','W', '조회 조건을 확인해주세요.[국사명/커버리지] ', function(msgId, msgRst){});
 	    			return;
 	    		}

 	    		if($("#covChk").is(':checked')) {
 	    			if(paramData.regYn == "Y") {
 	    				callMsgBox('btnMsgWarning','I', "기준 커버리지 정보를 저장 후 선택 가능합니다.");
 	        			return;
 	    			} else {
 	    				param.covChk = $("#covChk").val();
 	    			}
 	    		}

 	    		if (uniqueArray.size > 0) {
 	    			demdMtsoId = [...uniqueArray].join(',');
 	    			param.mtsoIds = demdMtsoId;
 	    		}

 	    		param = Util.convertQueryString(param);
 	    		$('#'+gridId2).alopexGrid('showProgress');
 	    		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/getObjMtsoList', param, 'GET', 'objMtsoSearch');
 			}
 		});

    	$("#btnPlus").on("click", function(e) {
    		//작업 대상 통합국
    		let grid1Data = AlopexGrid.trimData($('#'+gridId1 ).alopexGrid('dataGet'));
    		//대상 통합국
    		let grid2Data = $('#'+gridId2 ).alopexGrid('dataGet', {_state: {selected:true}});

    		if (grid2Data.length == 0) {
    			callMsgBox('btnMsgWarning','I', "선택된 데이터가 없습니다.");
    			return;
    		}

    		$.each(grid2Data, function(idx, data) {
    			//비교 그리드 데이터에 존재하면 데이터 추가를 skip한다
    			if(!Util.isExists(grid1Data, "mtsoId", data.mtsoId)){
    				let addData = [
    					{	"demdMtsoNm" : data.mtsoNm,
							"mtsoTypNm"  : data.mtsoTypNm,
							"mtsoTypCd"  : data.mtsoTypCd,
							"demdMtsoId" : data.mtsoId,
    					}];

    				uniqueArray.add(data.mtsoId);

    				$('#'+gridId2).alopexGrid("dataDelete", {_index : { data : data._index.row } });

    				$('#'+gridId1).alopexGrid('dataAdd', addData, {_index:{data : 0}});
    				$('#'+gridId1).alopexGrid('rowSelect',  {_index:{data : 0}}, true);
    			}
    		});
    	});

    	$("#btnMinus").on("click", function(e) {
    		//작업 대상 통합국
    		let grid1Data = $('#'+gridId1 ).alopexGrid('dataGet', {_state: {selected:true}});
    		//대상 통합국
    		let grid2Data = AlopexGrid.trimData($('#'+gridId2 ).alopexGrid('dataGet'));

    		if (grid1Data.length == 0) {
    			callMsgBox('btnMsgWarning','I', "선택된 데이터가 없습니다.");
    			return;
    		}

    		$.each(grid1Data, function(idx, data) {
				let addData = [
					{	"mtsoNm"    : data.demdMtsoNm,
						"mtsoTypNm" : data.mtsoTypNm,
						"mtsoTypCd" : data.mtsoTypCd,
						"mtsoId"    : data.demdMtsoId,
 					}];

				uniqueArray.delete(data.mtsoId);

				$('#'+gridId1).alopexGrid("dataDelete", {_index : { data : data._index.row } });

				$('#'+gridId2).alopexGrid('dataAdd', addData, {_index:{data : 0}});
    		});
    	});
	};

	function setLeftGrid(param){
		$('#'+gridId1).alopexGrid('showProgress');
		let paramArg = {};
		if (param.mtsoInvtSmltId != undefined)
			paramArg.mtsoInvtSmltId = param.mtsoInvtSmltId;

		if (param.intgMtsoId != undefined)
			paramArg.intgMtsoId = param.intgMtsoId;

		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/getMtsoInvtSmltDtsList', paramArg, 'GET', 'mtsoInvtSmltDtsList');

	}

	//시뮬레이션 통합국 등록
	function intgMtsoSlmtReg(){
		let param =  $("#mtsoInvtSlmtRegForm").getData();
		param.mtsoInvtSlmtList = $('#'+gridId1 ).alopexGrid('dataGet', {_state: {deleted:false}});

		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/intgMtsoSlmtReg', param, 'POST', 'intgMtsoSlmtReg');
	}

	//시뮬레이션 통합국 삭제
	function intgMtsoSlmtDel(){
		let param =  $("#mtsoInvtSlmtRegForm").getData();

		callMsgBox('','C', "통합국, 영역 등 관련 정보 모두 삭제됩니다.<br>시뮬레이션 통합국을 삭제하시겠습니까? ", function(msgId, msgRst){
			 if(msgRst == "Y"){
				 httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/intgMtsoSlmtDel', param, 'POST', 'intgMtsoSlmtDel');
			 }
		});
	}

	function successCallback(response, status, jqxhr, flag){

		if(flag == 'selectCoverageDsn'){
			$('#coverageId').clear();
			let option_data =  [{cd: 'WC99999999999', cdNm: '없음(최대반경적용)'}];

			let covList = response.resultList;

			for(let i = 0 ; i < covList.length ; i++){
				let resObj =  {cd: covList[i].coverageId, cdNm: covList[i].coverageTerrNm};
				option_data.push(resObj);
			}

			$('#coverageId').setData({
				data:option_data,
				coverageId: paramData.coverageId
			});
		}

		if(flag == 'objMtsoSearch') {
			$('#'+gridId2).alopexGrid('hideProgress');
    		let serverPageinfo = {
    				dataLength  : response.totalCnt, 	//총 데이터 길이
          	};

			$('#'+gridId2).alopexGrid('dataSet', response.dataList, serverPageinfo);
           	$('#'+gridId2).alopexGrid("viewUpdate");

		}

		if(flag == 'intgMtsoSlmtReg'){
			if(response.Result == "Success"){
        		callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
        			   if (msgRst == 'Y') {
        				   $a.close();
        		       }
        		});
    		} else {
    			//저장을 실패 하였습니다.
        		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
		}

		if(flag == 'intgMtsoSlmtDel'){
			if(response.Result == "Success"){
				callMsgBox('','I', '통합국 삭제에 성공하였습니다.', function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			} else {
				//저장을 실패 하였습니다.
				callMsgBox('','W', '통합국 삭제에 실패하였습니다.' , function(msgId, msgRst){});
			}
		}

		if(flag == 'mtsoInvtSmltDtsList'){
			$('#'+gridId1).alopexGrid('hideProgress');
    		let serverPageinfo = {
    	      		dataLength  : response.totalCnt, 	//총 데이터 길이
          	};

    		if (response.totalCnt > 0) {
    			for(let i=0; i<response.totalCnt; i++) {
    				uniqueArray.add(response.dataList[i].demdMtsoId);
    			}
    		}

			$('#'+gridId1).alopexGrid('dataSet', response.dataList, serverPageinfo);
           	$('#'+gridId1).alopexGrid("viewUpdate");
		}
	}

	function failCallback(response, status, jqxhr, flag){

    	if(flag == 'selectCoverageDsn'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "커버리지 설계내역 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'objMtsoSearch'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "대상 국사 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'intgMtsoSlmtReg'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "국사 투자 시뮬레이션 통합국 저장에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'mtsoInvtSmltDtsList'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "통합 대상 국사 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}
	}

	/*==========================*
	 * httpRequest실행
	 *==========================*/
	let httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
});