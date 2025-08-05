
/**
 * WreEqpRvRsltObjPop.js
 *
 * @author P182022
 * @date 2022. 08. 23. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
	var gridModel 		= null;
	var gridData1 		= 'gridData1';
	var gridData2 		= 'gridData2';

	var mRvClickIndex 	= '';
	var mRsltClickIndex	= '';

	var mFrstExt		= true;

	var mPopType		= '';
	var mRunDivCd		= '';

	//BPM 서비스명,장비방식 멀티
	var mDemdSvrNm		= [];
	var mCstrTyps       = [];
	var mEqpMeans		= [];
	var mBtmShParam		= [];
	var mDemdEqpCmb		= [];
	var mEqpDivCmb		= [];

	// 설계로직 정보
	var mGrdLgcData		= [];

	var mGrdDsnDivCmb	= [];
	var mSplyVndrCmb	= [];
	var mBizDivCmb1		= [];
	var mBizDivCmb2		= [];
	var mAfeYrSel		= '';
	var mAfeDemdDgrSel	= '';
	var mHdofcCdSel		= '';
	var mAreaIdSel		= '';

	var mHdofcCmb 		= [];

	var mAreaId_1 		= [{value : 'T11001', text : '수도권'}];
	var mAreaId_2 		= [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var mAreaId_3 		= [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var mAreaId_4 		= [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];

	var mDsnWoYnCmb1	= [{value : 'N', text : 'NO'},{value : 'Y', text : 'YES'}];
	var mDsnRsltYn 		=  [{value: "Y",text: "반영"}, {value: "N",text: "미반영"}];

    this.init = function(id, param) {
		mAfeYrSel		= param.afeYr;
		mAfeDemdDgrSel	= param.afeDemdDgr;
		mHdofcCdSel		= param.hdofcCd;
		mAreaIdSel		= param.areaId;
		mRunDivCd		= param.runDivCd;

    	setRespParamData(param);

    	setEventListener();
    	initGrid();

    	setSelectCode();

    	// 설계로직 조회
    	searchDsnLgcData();
    };

    // 부모로부터 넘어온 값 체크
    function setRespParamData(data) {
    	mPopType 	= data.popType;
		$("#span_header").text("BPM 정보 연동 조건");
		$("#span_subHeader").text("BPM 정보 조회");
    }

    function setSelectCode() {
    	//AFE 연차
    	selectAfeYrCode('afeYr1');
    	selectAfeYrCode('afeYr2');

    	//본부코드
    	selectHdofcCode('hdofcCd1');
    	selectHdofcCode('hdofcCd2');

    	selectSplyVndrCode('splyVndrCd');

    	//사업구분
    	initBizDivCode('bizDivCd1');
    	initBizDivCode('demdBizDivDeltCd');

    	//설계대상코드&수요장비&Vendor
    	selectEqpDivCode('eqpDivCd');
    	//selectEqpDivCode('eqpDivCd1');
    	selectDsnObjLgcCode('eqpDivCd1');

		var option_data = [{cd: '', cdNm: '전체'}];
		//지역코드
		$('#areaId1').setData({ data : option_data, option_selected: '' });
		$('#areaId2').setData({ data : option_data, option_selected: '' });

		// 확정여부
		var option_data3 = [{cd: '', cdNm: '선택'},{cd: 'Y', cdNm: '유지'},{cd: 'N', cdNm: '삭제'}];
		$('#dataMntnYn').setData({ data : option_data3, dataMntnYn: 'Y' });

    	var initParam = {
    			afeYr : mAfeYrSel,
    			afeDemdDgr : mAfeDemdDgrSel
    	};

    	//서비스명
    	selectSnCode('demdSvrNm2', initParam);
    	//공사유형
    	selectCtCode('cstrTyp2', initParam);
    	//장비방식
    	selectEmCode('eqpMeans2', initParam);
	}

    function setEventListener() {
    	// 취소
		$('#btnPopCncl').on('click', function(e) {
			$a.close();
		});

        // BPM 대상 검색
    	$("#btnSearch").on("click", function(e) {
    		searchBtmData();
    	});

    	// 적용
    	$("#btnAply").on("click", function(e) {
    		mGrdLgcData = getSelLgcData();

    		//BPM대상 적용
    		aplyBpmIcreObjData();
    	});

    	//통합시설코드 엔터키로 조회
        $('#intgFcltsCd2').on('keydown', function(e){
    		if (e.which == 13  ){
    			searchBtmData();
      		}
    	 });
    	//통합시설명 엔터키로 조회
        $('#intgFcltsNm2').on('keydown', function(e){
    		if (e.which == 13  ){
    			searchBtmData();
      		}
    	 });

        //BPM 정보 연동 조건 AFE 차수
    	$("#afeYr1").on("change", function(e) {
    		var areaYear = $("#afeYr1").val();
        	if(areaYear == ''){
        		$("#afeDemdDgr1").empty();
    			$("#afeDemdDgr1").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr1").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};

	        	selectAfeDemdDgrCode('afeDemdDgr1', dataParam);
        	}

        	initBizDivCode('bizDivCd1');
        	selectBizPurpCode('bizPurpCd1', areaYear);
    	});

        //BPM 정보 조회 AFE 차수
    	$("#afeYr2").on("change", function(e) {
    		var areaYear = $("#afeYr2").val();
        	if(areaYear == ''){
        		$("#afeDemdDgr2").empty();
    			$("#afeDemdDgr2").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr2").setSelected("");

    			$("#demdSvrNm2").empty();
    			$("#demdSvrNm2").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#demdSvrNm2").setSelected("");

    			$("#cstrTyp2").empty();
    			$("#cstrTyp2").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#cstrTyp2").setSelected("");

    			$("#eqpMeans2").empty();
    			$("#eqpMeans2").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#eqpMeans2").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};

	        	selectAfeDemdDgrCode('afeDemdDgr2', dataParam);
        	}

        	initBizDivCode('demdBizDivDeltCd');
        	selectBizPurpCode('demdBizDivCd', areaYear);
    	});

    	$("#afeDemdDgr2").on("change", function(e) {
        	var initParam = {
    			afeYr : $("#afeYr2").val(),
    			afeDemdDgr : $("#afeDemdDgr2").val()
        	};
        	//서비스명
        	selectSnCode('demdSvrNm2', initParam);
        	//공사유형
        	selectCtCode('cstrTyp2', initParam);
        	//장비방식
        	selectEmCode('eqpMeans2', initParam);
    	});

    	// 본부코드 선택
    	$("#hdofcCd2").on("change", function(e) {
			var supCd = $("#hdofcCd2").val();
			selectAreaCode("areaId2", supCd);

    	});

    	// 설계대상 조건
    	$("#eqpDivCd1").on("change", function(e) {
    		// 설계로직 데이터 조회
    		searchDsnLgcData();
    	});

    	// 조회 사업목적코드 선택
    	$("#demdBizDivCd").on("change", function(e) {
			selectBizDivCode("demdBizDivCd","demdBizDivDeltCd");

			// BPM 정보 조회에 사업목적 선택시 BPM 정보연동조건에 사업목적 자동 변경
			$('#bizPurpCd1').setSelected($("#demdBizDivCd").val());
    	});

    	// 조회 사업구분 선택
    	$("#demdBizDivDeltCd").on("change", function(e) {

    		// BPM 정보 조회에 사업구분 선택시 BPM 정보연동조건에 사업구분 자동 변경
			$('#bizDivCd1').setSelected($("#demdBizDivDeltCd").val());
    	});

    	// 연동 사업목적코드 선택
    	$("#bizPurpCd1").on("change", function(e) {
			selectBizDivCode("bizPurpCd1","bizDivCd1");
    	});

		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e);
		});

    	// 서비스명 멀티선택
	 	$('#demdSvrNm2').multiselect({
	 		 open: function(e){
	 			mDemdSvrNm = $("#demdSvrNm2").getData().demdSvrNm;
	 		 },
	 		 beforeclose: function(e){
	 			 var codeID =  $("#demdSvrNm2").getData();
	      		 var param = "";
	      		 if(mDemdSvrNm+"" != codeID.demdSvrNm+""){
		         		 if(codeID.demdSvrNm == ''){
		         		 }else {
		         			for(var i=0; codeID.demdSvrNm.length > i; i++){
		         				param += codeID.demdSvrNm[i] + ",";
		         			}
		         			param = param.substring(0,param.length-1);
		         			mDemdSvrNm = param;
		         		 }
	      		 }
	 		 }
	 	 });

    	// 공사유형 멀티선택
	 	$('#cstrTyp2').multiselect({
	 		 open: function(e){
	 			mCstrTyps = $("#cstrTyp2").getData().cstrTyps;
	 		 },
	 		 beforeclose: function(e){
	 			 var codeID =  $("#cstrTyp2").getData();
	      		 var param = "";
	      		 if(mCstrTyps+"" != codeID.cstrTyps+""){
		         		 if(codeID.cstrTyps == ''){
		         		 }else {
		         			for(var i=0; codeID.cstrTyps.length > i; i++){
		         				param += codeID.cstrTyps[i] + ",";
		         			}
		         			param = param.substring(0,param.length-1);
		         			mCstrTyps = param;
		         		 }
	      		 }
	 		 }
	 	 });

		// 장비방식 멀티선택
		$('#eqpMeans2').multiselect({
	 		 open: function(e){
	 			mEqpMeans = $("#eqpMeans2").getData().eqpMeans;
	 		 },
	 		 beforeclose: function(e){
	 			 var codeID =  $("#eqpMeans2").getData();
	      		 var param = "";
	      		 if(mEqpMeans+"" != codeID.eqpMeans+""){
		         		 if(codeID.eqpMeans == ''){
		         		 }else {
		         			for(var i=0; codeID.eqpMeans.length > i; i++){
		         				param += codeID.eqpMeans[i] + ",";
		         			}
		         			param = param.substring(0,param.length-1);
		         			mEqpMeans = param;
		         		 }
	      		 }
	 		 }
	 	 });

		$('#'+gridData2).on('click', function(e){
			mRvClickIndex = 	$('#'+gridData2).alopexGrid('dataGet', {_state:{selected:false}});
		});

		$('#'+gridData2).on('change','.headercell input', function(e) {
    		var checked = $(e.target).is(':checked') ? 'T' : 'F';
    		$("#rvCheckCd").val(checked);
    	});
    	$('#'+gridData2).on('gridScroll', function(e){
    		var checked = $("#rvCheckCd").val();
    		if(checked == "T"){
    			var rowData = $('#'+gridData2).alopexGrid('dataGet');
    			$('#'+gridData2).alopexGrid('rowSelect', rowData, true);

 				for(var i = 0 ; i < rowData.length; i++){
					for(var j=0; j < mRvClickIndex.length ; j++){
						if(rowData[i]._index.row == mRvClickIndex[j]._index.row){
							$('#'+gridData2).alopexGrid('rowSelect', rowData[i], false);
						}
    				}
 				}
			}
    	});
 	}

	//사업구분코드 초기화
    function initBizDivCode(objId) {
		var param = [{cd: '', cdNm: '전체'}];

		if(objId == 'demdBizDivDeltCd' || objId == 'bizDivCd1'){
			param = [{cd: "",cdNm: "선택"}];
		}

    	$("#"+objId).setData({ data : param, option_selected: '' });
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

    // 지역코드
    function selectAreaCode(objId, supCd) {
		var param = { supCd : supCd };
		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAreaCode', param, 'GET', objId);
	}

    //서비스명
    function selectSnCode(objId, param){
    	param.cdDiv = "SN";
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    //공사유형
    function selectCtCode(objId, param){
    	param.cdDiv = "CT";
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    //장비방식
    function selectEmCode(objId, param){
    	param.cdDiv = "EM";
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpBpmDemdCode', param, 'GET', objId);
    }

    // 사업목적코드
    function selectBizPurpCode(objId, afeYr) {
		var param = { afeYr : afeYr };
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getBizPurpCode', param, 'GET', objId);
    }

    // 설계대상콤보코드(전체)
    function selectEqpDivCode(objId) {
		var param = {};
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', param, 'GET', objId);
    }

    // 설계대상콤보코드(로직데이터 존재하는 설계대상만 조회)
    function selectDsnObjLgcCode(objId) {
		var param = {runDivCd : mRunDivCd};
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnObjLgcCode', param, 'GET', objId);
    }

    // 수요장비
    function selectDemdEqpCode(objId) {
		var param = {};
		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnEqpCode', param, 'GET', objId);
    }

    // Vendor
    function selectSplyVndrCode(objId) {
		var param = {};
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getSplyVndrCode', param, 'GET', objId);
    }

    // 사업구분코드
    function selectBizDivCode(objId1, objId2) {
		$('#'+objId2).clear();

		var objId1Sel = $("#"+objId1).val();
    	var divCdList = [];

    	if(objId2 == 'bizDivCd1'){
    		divCdList = mBizDivCmb1[objId1Sel];
    	}else if(objId2 == 'demdBizDivDeltCd'){
    		divCdList = mBizDivCmb2[objId1Sel];
    	}

		var option_data = [{cd: "",cdNm: "선택"}];

		if( divCdList != undefined && divCdList != null ){
			for(var i=0; i<divCdList.length; i++){
				var resObj 		= {cd: divCdList[i].cd, cdNm: divCdList[i].cdNm};
				option_data.push(resObj);
			}
		}

		$('#'+objId2).setData({data:option_data});
    }

    // 설계로직 조회
    function searchDsnLgcData() {
    	var param 			= getTopParamData();

    	$('#'+gridData1).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getDsnDivCdMgmtForPage', param, 'GET', 'topSearch');
    }

    // BPM대상 및 용량증설 대상 조회
    function searchBtmData() {
    	var param 		= getBtmParamData();
    	mBtmShParam		= param;

		if($.TcpMsg.isEmpty(param.afeYr)){
			callMsgBox('btnMsgWarning','I', "년도를 선택해 주십시오.");
			return false;
		}
		if($.TcpMsg.isEmpty(param.afeDemdDgr)){
			callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
			return false;
		}

  		gridModel.get({
    		data: param,
    	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'btmSearch');})
    	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'btmSearch');});
    }

    // 조회용 파라메터 셋팅
    function getTopParamData(){
    	var param = {};
    	param.runDivCd			= mRunDivCd;
		param.afeYr				= $("#afeYr1").val();
		param.afeDemdDgr		= $("#afeDemdDgr1").val();
		param.dsnDivCd			= $("#eqpDivCd1").val();
		param.dataMntnYn		= $("#dataMntnYn").val();
		param.hdofcCd			= $("#hdofcCd2").val();
		param.areaId			= $("#areaId2").val();
		param.demdBizDivCd		= $("#bizPurpCd1").val();
		param.lowDemdBizDivCd	= $("#bizDivCd1").val();

    	return param;
    }

    // 조회용 파라메터 셋팅
    function getBtmParamData(){
    	var param = {
    	    	pageNo 		: 1,
    	    	rowPerPage 	: 50
    	};

   		param.afeYr 		= $("#afeYr2").val();
		param.afeDemdDgr 	= $("#afeDemdDgr2").val();
		param.hdofcCd 		= $("#hdofcCd2").val();
		param.areaId 		= $("#areaId2").val();
		param.areaNm 		= $("#areaId2 option:checked").text();
		param.intgFcltsCd	= $("#intgFcltsCd2").val();
		param.intgFcltsNm	= $("#intgFcltsNm2").val();
		param.demdBizDivCd	= $("#demdBizDivCd").val();
		param.demdBizDivDeltCd	= $("#demdBizDivDeltCd").val();

   		if ($("#demdSvrNm2").val() != "" && $("#demdSvrNm2").val() != null ){
   			param.demdSvrNm = mDemdSvrNm
   		}else{
   			param.demdSvrNm = [];
   		}

   		if ($("#cstrTyp2").val() != "" && $("#cstrTyp2").val() != null ){
   			param.cstrTyps = mCstrTyps
   		}else{
   			param.cstrTyps = [];
   		}

   		if ($("#eqpMeans2").val() != "" && $("#eqpMeans2").val() != null ){
   			param.eqpMeans = mEqpMeans
   		}else{
   			param.eqpMeans = [];
   		}

    	return param;
    }

    // BPM연동대상 및 용량증설 대상 적용
    function aplyBpmIcreObjData() {

	    $('#'+gridData2).alopexGrid('endEdit'); // 편집종료

		var gridData = AlopexGrid.trimData($('#'+gridData2).alopexGrid('dataGet', { _state : { selected : true }}));

		if (gridData.length == 0) {// 선택한 데이터가 존재하지 않을 시
			callMsgBox('btnMsgWarning','W', '적용할 대상을 선택하세요.', btnMsgCallback);
			return;

		} else if(gridData.length > 0) {
			if(aplyLgcSrchWordChk()){
				callMsgBox('aplyConfirm','C', '적용 하시겠습니까?', btnMsgCallback);
			}
		}
    }

    function aplyLgcSrchWordChk(){
    	var param 			= getTopParamData();

		if($.TcpMsg.isEmpty(param.afeYr)){
			callMsgBox('btnMsgWarning','I', "년도를 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.afeDemdDgr)){
			callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.dsnDivCd)){
			callMsgBox('btnMsgWarning','I', "설계대상을 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.dataMntnYn)){
			callMsgBox('btnMsgWarning','I', "자료 유지를 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.demdBizDivCd)){
			callMsgBox('btnMsgWarning','I', "사업목적을 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.lowDemdBizDivCd)){
			callMsgBox('btnMsgWarning','I', "사업구분을 선택해 주십시오.");
			return false;
		}

		return true;
    }

	// 버튼 콜백 funtion
	var btnMsgCallback = function (msgId, msgRst) {
		if ('aplyConfirm' == msgId && 'Y' == msgRst) {
			var gridData = AlopexGrid.trimData($('#'+gridData2).alopexGrid('dataGet', function(data) {
				if (data._state.selected == true) {
					return data;
				}
			}));

			if(gridData.length > 0) {
				var regMeansNm 	= 'BPM연동';

				// 그리드 전체선택 여부
				var checked 		= $("#rvCheckCd").val();

				var aplyParam	= {};
				// 하단로직 조건 데이터
				aplyParam = getTopParamData();

				if('F' == checked){

					for (var i = 0; i < gridData.length; i++) {
						gridData[i].areaId = getAreaIdVal(gridData[i].areaNm);
					}

					aplyParam.aplyData		= gridData;
				}
				aplyParam.allInsType 	= checked;
				aplyParam.regMeansNm	= regMeansNm;
				aplyParam.lgcData		= mGrdLgcData;
				// 상단BPM&용량증설 조건 데이터
				var btmParam = getBtmParamData();
				aplyParam.srchAfeYr			= btmParam.afeYr;
				aplyParam.srchAfeDemdDgr	= btmParam.afeDemdDgr;
				aplyParam.srchHdofcCd		= btmParam.hdofcCd;
				aplyParam.srchAreaId		= btmParam.areaId;
				aplyParam.srchAreaNm		= btmParam.areaNm;
				aplyParam.srchOpTeam		= btmParam.opTeam;
				aplyParam.srchIntgFcltsCd	= btmParam.intgFcltsCd;
				aplyParam.srchIntgFcltsNm	= btmParam.intgFcltsNm;
				aplyParam.srchDemdBizDivCd	= btmParam.demdBizDivCd;
				aplyParam.srchDemdBizDivDeltCd	= btmParam.demdBizDivDeltCd;

		   		if ($("#demdSvrNm2").val() != "" && $("#demdSvrNm2").val() != null ){
		   			aplyParam.srchDemdSvrNm = btmParam.demdSvrNm.split(',');
		   		}else{
		   			aplyParam.srchDemdSvrNm = [];
		   		}

		   		if ($("#cstrTyp2").val() != "" && $("#cstrTyp2").val() != null ){
		   			aplyParam.srchCstrTyps = btmParam.cstrTyps.split(',');
		   		}else{
		   			aplyParam.srchCstrTyps = [];
		   		}

		   		if ($("#eqpMeans2").val() != "" && $("#eqpMeans2").val() != null ){
		   			aplyParam.srchEqpMeans = btmParam.eqpMeans.split(',');
		   		}else{
		   			aplyParam.srchEqpMeans = [];
		   		}

		   		showProgressBody();
		   		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/saveBPMDemdList', aplyParam, 'POST', 'afterAply');

			}else{
				callMsgBox('btnMsgWarning','W', '적용할 데이터가 없습니다.', btnMsgCallback);
			}
		}
	}

	// 선택된 로직그룹정보 가져오기
	function getSelLgcData(){
		var gridData = AlopexGrid.trimData($('#'+gridData1).alopexGrid('dataGet', function(data) {
			if (data._state.selected == true || data.mndtInsYn == "Y") {
				return data;
			}
		}));

		return gridData;
	}

	// 그리드 초기화
    function initGrid() {
		//
		$('#'+gridData1).alopexGrid({
			height : '5row',
	    	pager : false,
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			rowSingleSelect : false,
			rowClickSelect: false,
			rowOption : {
				allowSelect : function(data) {
					return (data.mndtInsYn != "Y")? true : false;
				},
				inlineStyle: function(data,rowOption){
    				if(data.mndtInsYn == 'Y') return {background:'#e2e2e2'}
    			}
			},
	    	columnMapping: [{
	    		key: 'check',
	    		align: 'center',
	    		width: '40px',
	    		selectorColumn : true,
	    	}, {
				key : 'execTurn', align:'center',
				title : '순서',
				width: '50px',
				editable: false
			}, {
				key : 'workGrpNm', align:'center',
				title : '로직 그룹',
				width: '120px',
				editable: false
			}, {
				key : 'condInfCtt', align:'center',
				title : '로직 정보',
				width: '120px',
				editable: false
			}, {
				key : 'optConnDesc', align:'center',
				title : '설계 옵션 설명',
				width: '200px',
				editable: false
			}, {
				key : 'dsnOptVal', align:'center',
				title : '설계 옵션 값',
				width: '120px',
				editable: true
			}, {
				key : 'dsnDivCd', align:'center',
				title : '설계로직구분코드',
				width: '100px',
				hidden : true
			}, {
				key : 'runDivCd', align:'center',
				title : '수행구분코드',
				width: '100px',
				hidden : true
			}, {
				key : 'basItmSeq', align:'center',
				title : '기본항목순번',
				width: '100px',
				hidden : true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    	var gridColumn = [{
    		key: 'check',
    		align: 'center',
    		width: '40px',
    		selectorColumn : true
    	}, {
			align:'center',
			title : '순번',
			width: '60px',
			resizing : false,
			numberingColumn: true
		}, {
			key : 'afeYr', align:'center',
			title : '년도',
			width: '70px',
			editable: false,
		}, {
			key : 'afeDemdDgr', align:'center',
			title : '차수',
			width: '70px',
			editable: false,
		}, {
			key : 'hdofcCd', align:'center',
			title : '본부',
			width: '80px',
			editable: false,
	    	render : { type: 'string',
	            rule: function (value, data){
	                var render_data = [{ value : '', text : '선택'}];
    				return render_data = render_data.concat( mHdofcCmb );
				}
			},
		}, {
			key : 'areaNm', align:'center',
			title : '지사',
			width: '100px',
			editable: false,
		}, {
			key : 'areaId', align:'center',
			title : '지사',
			hidden : true
		}, {
			key : 'fcltsCd', align:'center',
			title : '시설코드',
			width: '100px',
			editable: false
		}, {
			key : 'demdMtsoNm', align:'left',
			title : '국소명',
			width: '250px',
			editable: false
		}, {
			key : 'srvcNm', align:'center',
			title : '서비스명',
			width: '80px',
			editable: false
		}, {
			key : 'cstrTyp', align:'center',
			title : '공사유형',
			width: '100px',
			editable: false
		}, {
			key : 'fhOnafMeansNm', align:'center',
			title : '장비방식',
			width: '80px',
			editable: false
		}, {
			key : 'srvcLclNm', align:'center',
			title : '서비스대분류',
			width: '100px',
			editable: false
		}, {
			key : 'srvcMclNm', align:'center',
			title : '서비스중분류',
			width: '100px',
			editable: false
		}, {
			key : 'procProgStatVal', align:'center',
			title : '진행상태',
			width: '100px',
			editable: false
		}, {
			key : 'mcpNm', align:'center',
			title : '광역시도',
			width: '80px',
			editable : false,
			hidden : true
		}, {
			key : 'sggNm', align:'center',
			title : '시군구',
			width: '80px',
			editable : false
		}, {
			key : 'emdNm', align:'center',
			title : '읍면동',
			width: '80px',
			editable : false
		}, {
			key : 'xcrdVal', align:'center',
			title : '위도',
			width: '80px',
			editable : false
		}, {
			key : 'ycrdVal', align:'center',
			title : '경도',
			width: '80px',
			editable : true
		}, {
			key : 'siteCd', align:'center',
			title : '사이트키',
			width: '130px',
			editable: false,
		}
		, {key : 'acsnwPrjId', title : 'A망프로젝트ID',hidden : true}
		, {key : 'intgFcltsCd', title : '통합시설코드',hidden : true}
		, {key : 'acsnwDemdMgmtSrno', title : 'A망수요관리일련번호',hidden : true}
		, {key : 'acsnwMgmtNo', title : 'A망관리번호 ',hidden : true}
		, {key : 'focsFcltsCd', title : '집중국사시설코드(상위)',hidden : true}
		, {key : 'lteF2P1gFcltsCd', title : '프론트홀LTE2.1G시설코드',hidden : true}
		, {key : 'lteF1P8gFcltsCd', title : '프론트홀LTE1.8G시설코드',hidden : true}
		, {key : 'lteF800mFcltsCd', title : '프론트홀LTE800M시설코드',hidden : true}
		, {key : 'fhFocsMtsoSiteId', title : '프론트홀집중국사사이트ID',hidden : true}
		, {key : 'fhSiteKeyId', title : '프론트홀사이트키ID',hidden : true}
		, {key : 'splyMeansCd', title : '공급방식코드',hidden : true}
		, {key : 'fhOnafDetlMeansNm', title : '프론트홀이후세부방식명',hidden : true}
		, {key : 'fhRefcFcltsCd', title : '프론트홀참조시설코드',hidden : true}
		, {key : 'vendNm', title : '제조사명',hidden : true}
		, {key : 'lttagVal', title : '위도도값',hidden : true}
		, {key : 'lttmnVal', title : '위도분값',hidden : true}
		, {key : 'lttscVal', title : '위도초값',hidden : true}
		, {key : 'ltdagVal', title : '경도도값',hidden : true}
		, {key : 'ltdmnVal', title : '경도분값',hidden : true}
		, {key : 'ltdscVal', title : '경도초값',hidden : true}
		];

        var vUrl = "tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getBPMDemdForPage";
        var rowCnt = "5row";
        var grdColumnMap = gridColumn;
        var headerGroup = [];

      	gridModel = Tango.ajax.init({
          	url: vUrl
      		,data: {
      	        pageNo: 1,             // Page Number,
      	        rowPerPage: 500,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
      	    }
        });

      	// 그리드 설정
	    $('#'+gridData2).alopexGrid({
	    	height : rowCnt,
	    	paging: {
		     	   pagerTotal:true,
		     	   pagerSelect:false,
		     	   hidePageList:true
	    	},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			numberingColumnFromZero: false,
			leaveDeleted: true,
			headerGroup: headerGroup,
	    	columnMapping: grdColumnMap,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			},
			ajax: {
		         model: gridModel                  // ajax option에 grid 연결할 model을지정
			        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			}
	    });

    }

    // 콤보박스에 데이터 존재여부
    function fnCmdExisTence(value, data){
    	var result = false;

    	if( data == undefined || data == null || data == "") return result;

    	for( var i = 0; i < data.length; i++ ){
    		if(data[i].value == value){
    			result = true;
    		}
    	}

    	return result;
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

    // 그리드 지역콤보 데이터 JSON
    function grdAreaIdCmb(value){
    	var returnDate = [];

    	switch(value){
		case "5100":
			returnDate =  mAreaId_1;
			break;
		case "5300":
			returnDate =  mAreaId_2;
			break;
		case "5500":
			returnDate =  mAreaId_3;
			break;
		case "5600":
			returnDate =  mAreaId_4;
			break;
    	}

    	return returnDate;
    }

	//request 성공시.
	function successCallback(response, status, jqxhr, flag){

		switch(flag){
			case "topSearch":
				$('#'+gridData1).alopexGrid('hideProgress');
				setSpGrid(gridData1, response, response.dataList);
				break;
			case 'afterAply':
				hideProgressBody();
				$('#'+gridData1).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', '적용 되었습니다.('+response.returnTime+')',function(){
						$a.close("APLY");
					});
				} else {
					callMsgBox('','W', '적용이 실패되었습니다.', btnMsgCallback);
				}
				break;
			case 'afeYr1':
			case 'afeYr2':
				$('#'+flag).clear();
				var option_data =  [];
				var stdAfeYr = "";
				var paramAfeYr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeYrSel) {
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
				$('#'+flag).setData({data:option_data,afeYr:selectId});

		    	if(flag == 'afeYr1'){
					selectAfeDemdDgrCode('afeDemdDgr1', {afeYr:selectId});
			    	selectBizPurpCode('bizPurpCd1',selectId);
		    	}else if(flag == 'afeYr2'){
					selectAfeDemdDgrCode('afeDemdDgr2', {afeYr:selectId});
			    	selectBizPurpCode('demdBizDivCd',selectId);
		    	}
				break;
			case 'afeDemdDgr1':
			case 'afeDemdDgr2':
				$('#'+flag).clear();
				var stdAfeYr = "";
				var option_data =  [];
				var stdDemdDgr = "";
				var paramDemdDgr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeDemdDgrSel) {
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
				$('#'+flag).setData({data:option_data,afeDemdDgr:selectId});
				break;
			case 'demdSvrNm2':
			case 'cstrTyp2':
			case 'eqpMeans2':
				$('#'+flag).clear();
				var stdAfeYr = "";
				var option_data =  [];
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
				}
				$('#'+flag).setData({data:option_data});
				break;
			case 'bizPurpCd1':
			case 'demdBizDivCd':
				$('#'+flag).clear();
				var option_data =  [{cd: "", cdNm: "전체"}];
				if(flag == 'demdBizDivCd' || flag == 'bizPurpCd1'){
					option_data = [{cd: "",cdNm: "선택"}];
				}

				for(var i=0; i<response.purpList.length; i++){
					var resObj 		= {cd: response.purpList[i].cd, cdNm: response.purpList[i].cdNm,
										value: response.purpList[i].cd, text: response.purpList[i].cdNm
									};
					option_data.push(resObj);
				}
				$('#'+flag).setData({data:option_data});

		    	if(flag == 'bizPurpCd1'){
					mBizDivCmb1		= response.divList;
		    	}else if(flag == 'demdBizDivCd'){
					mBizDivCmb2		= response.divList;
		    	}
				break;
			case 'eqpDivCd':
				mEqpDivCmb = response.mainLgc;
				var grdSelectData 	=  [];
				var option_data 	=  [{cd: "", cdNm: "전체"}];
				for(var i=0; i<mEqpDivCmb.length; i++){
					option_data.push({cd: mEqpDivCmb[i].cd, cdNm: mEqpDivCmb[i].cdNm});

					var grdObj = {value: mEqpDivCmb[i].value, text: mEqpDivCmb[i].text};
					mGrdDsnDivCmb.push(grdObj);
				}
				break;
			case 'eqpDivCd1':
				var dataCmb = response.mainLgc;
				var option_data 	=  [{cd: "", cdNm: "선택"}];

				for(var i=0; i<dataCmb.length; i++){
					option_data.push({cd: dataCmb[i].cd, cdNm: dataCmb[i].cdNm});
				}
				$('#eqpDivCd1').setData({data:option_data});
				break;
			case 'splyVndrCd':
				var grdSelectData 	=  [];

				for(var i=0; i<response.length; i++){
					var grdObj 		= {value: response[i].cd, text: response[i].cdNm};

					grdSelectData.push(grdObj);
				}
				mSplyVndrCmb = grdSelectData;
				break;
			case 'hdofcCd1':
				for(var i=0; i<response.length; i++){
					var resObj 		= {value: response[i].cd, text: response[i].cdNm};

					mHdofcCmb.push(resObj);
				}
			case 'hdofcCd2':
			case 'areaId1':
			case 'areaId2':
				setSelectBoxData(flag, response);
				break;
			case "excelDownloadOnDemand":
				$('#'+gridData2).alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
				break;
		}
    }

	// 선택박스 데이터 셋
	function setSelectBoxData(objId, response){
		$('#'+objId).clear();
		var option_data =  [{cd: "", cdNm: "전체"}];

		if(objId == 'hdofcCd1' || objId == 'areaId1'){
			option_data = [{cd: "",cdNm: "선택"}];
		}

		for(var i=0; i<response.length; i++){
			var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
			option_data.push(resObj);
		}

		$('#'+objId).setData({data:option_data});

		switch(objId){
		case 'hdofcCd1':
		case 'hdofcCd2':
			$('#'+objId).setSelected(mHdofcCdSel);
			break;
		case 'areaId1':
		case 'areaId2':
			$('#'+objId).setSelected(mAreaIdSel);
			break;
		}
	}

    //Grid에 Row출력
    function setSpGrid(GridID,Option,Data) {
    	$('#'+GridID).alopexGrid('dataSet', Data, '');

    	if(GridID == 'gridData1'){
    		$('#'+GridID).alopexGrid('rowSelect', {_state:{selected : false}}, true);
    	}
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "eqpSearch":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

    // 수요장비 데이터 JSON
    function grdEqpRoleDivCd(value){
    	var returnDate 	= [{cd: "", cdNm: "전체",value: "", text: "선택"}];
    	var divCdList	= mDemdEqpCmb[value];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj 		= {cd: divCdList[i].cd, cdNm: divCdList[i].cdNm, value: divCdList[i].cd, text: divCdList[i].cdNm};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    // 그리드 사업구분 데이터 JSON
    function grdLowDemdBizDivCd(value, gubun){
    	var returnDate 	= [];
    	var divCdList	= [];

    	divCdList = mBizDivCmb1[value];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj 		= {value: divCdList[i].cd, text: divCdList[i].cdNm};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    // 지사코드 체크
    function getAreaIdVal(value){
    	if($.TcpMsg.isEmpty(value)) return '';
    	var result = '';

    	switch(value){
		case "T11001":
		case "T12001":
		case "T12002":
		case "T13001":
		case "T13003":
		case "T14001":
		case "T14002":
		case "T14003":
			result =  value;
			break;
    	}

    	if(result == ''){
       		var sValue = value.trim();

        	switch(sValue){
    		case "수도권":
    			result = "T11001";
    			break;
    		case "대구":
    			result = "T12001";
    			break;
    		case "부산":
    			result = "T12002";
    			break;
    		case "서부":
    			result = "T13001";
    			break;
    		case "제주":
    			result = "T13003";
    			break;
    		case "세종":
    			result = "T14001";
    			break;
    		case "강원":
    			result = "T14002";
    			break;
    		case "충청":
    			result = "T14003";
    			break;
        	}
    	}

    	return result;
    }

    function showProgressBody(){
    	$('body').progress();
    };

    function hideProgressBody(){
    	$('body').progress().remove();
    };

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(event){
		var gridData = $('#'+gridData2).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var param = getBtmParamData();

   		if ($("#demdSvrNm2").val() != "" && $("#demdSvrNm2").val() != null ){
   			param.demdSvrNm = $("#demdSvrNm2").val();
   		}else{
   			param.demdSvrNm = [];
   		}
   		if ($("#cstrTyp2").val() != "" && $("#cstrTyp2").val() != null ){
   			param.cstrTyps = $("#cstrTyp2").val();
   		}else{
   			param.cstrTyps = [];
   		}
   		if ($("#eqpMeans2").val() != "" && $("#eqpMeans2").val() != null ){
   			param.eqpMeans = $("#eqpMeans2").val();
   		}else{
   			param.eqpMeans = [];
   		}

		param = gridExcelColumn(param, $('#'+gridData2));
		param.pageNo = 1;
		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();

		var now = new Date();
		var fileName = '유선망통합설계[BPM연동]_' + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = 'getTesEqpRvObjBpmList';
		param.excelFlag = 'EqpRvObjBpmList';
		fileNameOnDemand = fileName + '.xlsx';

		$('#'+gridData2).alopexGrid('showProgress');
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