/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
$a.page(function() {
	//전송실
	let skt_tmof_option_data = [];
	let skb_tmof_option_data = [];

	let gridId1 = "targetIntgMtsoGrid";
	let gridId2 = "sourceIntgMtsoGrid";

	let workDiv = [
		  {"text":"통합","value":"INTG"}
		, {"text":"철거","value":"REMV"}
	];

	let uniqueArray = new Set();

    //초기 진입점
	let paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	initGrid();

    	setRegDataSet(param);//넘어온 데이터 세팅
    	setSelectCode();     //select 정보 세팅
        setEventListener();  //이벤트

        if(param.regYn == "N"
        	&& param.mtsoInvtSmltId != "") {
        	setLeftGrid(param);
        }

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
    			{key : 'intgMtsoNm', align:'left', title : '통합국사명', width: '240px'},
    			{key : 'intgDivVal', align:'left', title : '구분', width: '110px',
    				render : { type: 'string',
    					rule: function (value, data){
    						var render_data = [];
    						if (workDiv.length > 0) {
    							return render_data = render_data.concat( workDiv );
    						}else{
    							return render_data.concat({value : data.intgDivVal, text : data.intgDivValNm});
    						}
    					}
    				},
    				editable : { type: "select", rule: function(value, data) { return workDiv; },
    					attr : {
    						style : "width: 98%;min-width:98%;padding: 1px 1px;"
    					}
    				},
    				editedValue : function (cell) {
    					return  $(cell).find('select option').filter(':selected').val();
    				},
    			},
    			{key : 'mtsoStatNm', align:'center', title : '국사상태',   width: '70px',  hidden: true},
    			{key : 'bldAddr', 	 align:'left',   title : '국사주소',   width: '200px', hidden: true},
    			{key : 'intgMtsoId', align:'left',   title : '통합국사ID', width: '160px', hidden: true},
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
     		cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
     		cellSelectable : true,
			columnMapping : [
				{key : 'check', align: 'center',width: '40px', selectorColumn : true},
    			{key : 'intgMtsoNm', align:'left', title : '통합국사명', width: '150px'},
    			{key : 'mtsoStatNm', align:'center', title : '국사상태', width: '70px'},
    			{key : 'bldAddr', align:'left', title : '국사주소', width: '200px'},
    			{key : 'intgMtsoId', align:'left', title : '통합국사ID', width: '100px'},
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

    	if(data.regYn == "Y") {
    		$('#btnCopy').hide();
    		$('#btnDel').hide();
    	}
    }

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	//AFE년도
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', null, 'GET', 'afeYr');
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/tmofs/SKT', null, 'GET', 'tmof'); //전송실
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/tmofs/SKB', null, 'GET', 'tmof'); //전송실
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
    		let param =  $("#mtsoInvtSlmtRegForm").getData();
    		let mtsoInvtSlmtList = AlopexGrid.trimData($('#'+gridId1 ).alopexGrid('dataGet'));

    		if (param.mtsoInvtSmltNm == "") {
   	    		//필수입력 항목입니다.[ 시뮬레이션명 ]
   	    		callMsgBox('','W', makeArgConfigMsg('requiredOption','시뮬레이션명'), function(msgId, msgRst){});
   	     		return;
   	     	}

    		if (param.acptRdusDistm == "") {
    			//필수입력 항목입니다.[ 최대반경 ]
    			callMsgBox('','W', makeArgConfigMsg('requiredOption','최대반경'), function(msgId, msgRst){});
    			return;
    		}

    		if (mtsoInvtSlmtList.length == 0) {
    			//필수입력 항목입니다.[ 최대반경 ]
    			callMsgBox('','W', makeArgConfigMsg('requiredOption','작업 대상 통합국'), function(msgId, msgRst){});
    			return;
    		}

    		mtsoInvtSlmtReg();
        });

    	//복사
    	$('#btnCopy').on('click', function(e) {
    		mtsoInvtSlmtCopy();
    	});

    	//삭제
    	$('#btnDel').on('click', function(e) {
    		mtsoInvtSlmtDel();
    	});

    	//국사 조회
    	$('#btnMtsoSearch').on('click', function(e) {
    		let param	= {};
    		let intgMtsoId = [];
    		param.mgmtGrpNm = "SKT";//$('#mgmtGrpNm').val();
    		param.mtsoNm = $("#mtsoNm").val();
    		param.tmof = $("#tmof").val() //전송실

    		if(paramData.regYn == "N"
            	&& paramData.mtsoInvtSmltId != "") {
    			param.mtsoInvtSmltId = paramData.mtsoInvtSmltId
            }

    		if (uniqueArray.size > 0) {
    			intgMtsoId = [...uniqueArray].join(',');
    			param.mtsoIds = intgMtsoId;
    		}

    		param = Util.convertQueryString(param);

    		$('#'+gridId2).alopexGrid('showProgress');
    		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/getIntgMtsoList', param, 'GET', 'intgMtsoSearch');
        });

    	// 엔터키로 조회
    	$('#mtsoInvtSlmtRegForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			let param	= {};
    			let intgMtsoId = [];
 	    		param.mgmtGrpNm = "SKT";//$('#mgmtGrpNm').val();
 	    		param.mtsoNm = $("#mtsoNm").val();
 	    		param.tmof = $("#tmof").val() //전송실

 	    		if(paramData.regYn == "N"
	            	&& paramData.mtsoInvtSmltId != "") {
	    			param.mtsoInvtSmltId = paramData.mtsoInvtSmltId
	            }

 	    		if (uniqueArray.size > 0) {
	    			intgMtsoId = [...uniqueArray].join(',');
	    			param.mtsoIds = intgMtsoId;
	    		}

 	    		param = Util.convertQueryString(param);

 	    		$('#'+gridId2).alopexGrid('showProgress');
 	    		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/getIntgMtsoList', param, 'GET', 'intgMtsoSearch');
 			}
 		});

    	$("#afeYr").on("change", function(e) {
    		let mAreaYear1 = $("#afeYr").val();
    		if(mAreaYear1 == ''){
    			$("#afeDemdDgr").empty();
    			$("#afeDemdDgr").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr").setSelected("");
    		}else{
    			let dataParam = {
    					afeYr : this.value
    			};

    			selectAfeDemdDgrCode('afeDemdDgr', dataParam);
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
    			if(!Util.isExists(grid1Data, "intgMtsoId", data.intgMtsoId)){
    				let addData = [
    					{	"intgMtsoNm" : data.intgMtsoNm,
							"intgDivVal" : "INTG",
							"mtsoStatNm" : data.mtsoStatNm,
							"bldAddr"	 : data.bldAddr,
							"intgMtsoId" : data.intgMtsoId,
    					}];

    				uniqueArray.add(data.intgMtsoId);

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
    		if (grid1Data.length > 0) {
    			callMsgBox('','C', "제거된 통합국에 등록된 영역 및 관련 정보가 모두 삭제됩니다. 제거하시겠습니까?", function(msgId, msgRst){
    				if(msgRst == "Y"){
    					$.each(grid1Data, function(idx, data) {
    						let addData = [
    							{	"intgMtsoNm" : data.intgMtsoNm,
    								"intgDivVal" : data.intgDivVal,
    								"mtsoStatNm" : data.mtsoStatNm,
    								"bldAddr"	 : data.bldAddr,
    								"intgMtsoId" : data.intgMtsoId,
    							}];

    						uniqueArray.delete(data.intgMtsoId);

    						$('#'+gridId1).alopexGrid("dataDelete", {_index : { data : data._index.row } });

    						$('#'+gridId2).alopexGrid('dataAdd', addData, {_index:{data : 0}});
    					});
    				}
    			});
    		}

    	});
    };

	//AFE년도별 차수
	function selectAfeDemdDgrCode(objId, param) {

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeDemdDgrlist', param, 'GET', objId);
	}

	function setLeftGrid(param){
		$('#'+gridId1).alopexGrid('showProgress');
		 httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/getMtsoInvtSmltBasList', param, 'GET', 'mtsoInvtSmltBasList');
	}

	//시뮬레이션 등록
	function mtsoInvtSlmtReg(){
		let param =  $("#mtsoInvtSlmtRegForm").getData();
		param.mtsoInvtSlmtList = $('#'+gridId1 ).alopexGrid('dataGet', {_state: {deleted:false}});
		param.delMtsoInvtSlmtList = $('#'+gridId1 ).alopexGrid('dataGet', {_state: {deleted:true}});

		if(param.mtsoInvtSmltNm == ""){
			callMsgBox('','W', makeArgConfigMsg('requiredOption','시뮬레이션명'), function(msgId, msgRst){});
			return;
		}

		if(param.mtsoInvtSlmtList.length == 0){
			callMsgBox('','W', makeArgConfigMsg('requiredOption','작업 대상 통합국'), function(msgId, msgRst){});
			return;
		}

		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/mtsoInvtSlmtReg', param, 'POST', 'mtsoInvtSlmtReg');
	}

	//시뮬레이션 복사
	function mtsoInvtSlmtCopy(){
		let param =  $("#mtsoInvtSlmtRegForm").getData();
		param.copyMtsoInvtSmltId = param.mtsoInvtSmltId;

		callMsgBox('','C', "시뮬레이선 정보, 통합국, 영역 등 관련 정보 모두 복사됩니다.<br>복사하시겠습니까?", function(msgId, msgRst){
			 if(msgRst == "Y"){
				 httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/mtsoInvtSlmtCopy', param, 'POST', 'mtsoInvtSlmtCopy');
			 }
		});

	}

	//시뮬레이션 삭제
	function mtsoInvtSlmtDel(){
		let param =  $("#mtsoInvtSlmtRegForm").getData();

		callMsgBox('','C', "시뮬레이선 정보, 통합국, 영역 등 관련 정보 모두 삭제됩니다.<br>국사 투자 시뮬레이션을 삭제하시겠습니까?", function(msgId, msgRst){
			 if(msgRst == "Y"){
				 httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmt/mtsoInvtSlmtDel', param, 'POST', 'mtsoInvtSlmtDel');
			 }
		});
	}

	function successCallback(response, status, jqxhr, flag){

		if(flag == 'afeYr'){
			$('#afeYr').clear();
			let option_data =  [];
			let stdAfeYr = "";
			for(let i = 0; i < response.length; i++){

				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}

			if (paramData.regYn = 'N') {
				$('#afeYr').setData({data:option_data,afeYr:paramData.afeYr});
			} else {
				$('#afeYr').setData({data:option_data,afeYr:stdAfeYr});
			}
			selectAfeDemdDgrCode('afeDemdDgr', {afeYr:stdAfeYr});
		}

		if(flag == 'afeDemdDgr'){
			$('#afeDemdDgr').clear();
			let option_data =  [];
			let stdAfeYr = "";
			for(let i=0; i<response.length; i++){
				let resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
				option_data.push(resObj);
				if(response[i].stdAfeDivYn == 'Y'){
					stdAfeYr = response[i].cd;
				}
			}

			if (paramData.regYn = 'N') {
				$('#afeDemdDgr').setData({data:option_data,afeDemdDgr:paramData.stdAfeYr});
			} else {
				$('#afeDemdDgr').setData({data:option_data,afeDemdDgr:stdAfeYr});
			}
		}

		if(flag == 'tmof'){
    		//SKT
    		if(response[0].mgmtGrpCd == "0001"){
    			for(let i = 0; i<response.length; i++){
        			let resObj = response[i];
        			skt_tmof_option_data.push(resObj);
        		}

    			$('#tmof').clear();
    			$('#tmof').setData({
    		       data:skt_tmof_option_data,
    			});

    			$('#tmof').setSelected(paramData.topMtsoId);
    		}
		}

		if(flag == 'intgMtsoSearch'){
			$('#'+gridId2).alopexGrid('hideProgress');
    		let serverPageinfo = {
    	      		dataLength  : response.totalCnt, 	//총 데이터 길이
          	};

			$('#'+gridId2).alopexGrid('dataSet', response.dataList, serverPageinfo);
           	$('#'+gridId2).alopexGrid("viewUpdate");
		}

		if(flag == 'mtsoInvtSlmtReg'){
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

		if(flag == 'mtsoInvtSlmtCopy'){
			if(response.Result == "Success"){
				callMsgBox('','I', '국사 투자 시뮬레이션 복사하였습니다.', function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			} else {
				//저장을 실패 하였습니다.
				callMsgBox('','W', '국사 투자 시뮬레이션 복사에 실패하였습니다.' , function(msgId, msgRst){});
			}
		}

		if(flag == 'mtsoInvtSlmtDel'){
			if(response.Result == "Success"){
				callMsgBox('','I', '국사 투자 시뮬레이션 삭제하였습니다.', function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			} else {
				//저장을 실패 하였습니다.
				callMsgBox('','W', '국사 투자 시뮬레이션 삭제에 실패하였습니다.' , function(msgId, msgRst){});
			}
		}

		if(flag == 'mtsoInvtSmltBasList'){
			$('#'+gridId1).alopexGrid('hideProgress');
    		let serverPageinfo = {
    	      		dataLength  : response.totalCnt, 	//총 데이터 길이
          	};

    		if (response.totalCnt > 0) {
    			for(let i=0; i<response.totalCnt; i++) {
    				uniqueArray.add(response.dataList[i].intgMtsoId);
    			}
    		}

			$('#'+gridId1).alopexGrid('dataSet', response.dataList, serverPageinfo);
           	$('#'+gridId1).alopexGrid("viewUpdate");
		}

	}

	function failCallback(response, status, jqxhr, flag){

		if(flag == 'afeYr'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "AFE년도 조회에 실패하였습니다." , function(msgId, msgRst){});
		}

    	if(flag == 'afeDemdDgr'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "AFE년별 차수 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'tmof'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "전송실 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'intgMtsoSearch'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "통합국사 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'mtsoInvtSlmtReg'){
    		callMsgBox('','I', "국사 투자 시뮬레이션 저장에 실패하였습니다." , function(msgId, msgRst){});
		}

    	if(flag == 'mtsoInvtSlmtCopy'){
    		callMsgBox('','I', "국사 투자 시뮬레이션 복사에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'mtsoInvtSlmtDel'){
    		callMsgBox('','I', "국사 투자 시뮬레이션 저장에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'mtsoInvtSmltBasList'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "작업 대상 국사 조회에 실패하였습니다." , function(msgId, msgRst){});
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