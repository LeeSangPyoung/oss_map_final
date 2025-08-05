/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
$a.page(function() {
	//전송실

	let gridId1 = "grid1";
	let gridId1Footer = "grid1footer";
	let gridId2 = "grid2";
	let gridId3 = "grid3";
	let gridId1Len = null;

	//장비컬럼 리스트
	let eqpColList = [];
	let rackColList = [];
	let powerColList = [];
	//시설컬럼리스트
	let fctColList = [];

	let gSrcReqIdVal = "";
	let gRaReqId = "";

	//통합 국사 수요 선택정보
	let gridId1FocusInfo = [];

	let prtlDiv = [
		{"text":"없음","value":"NONE"},
		{"text":"통합","value":"INTG"},
		{"text":"분할","value":"PRTL"}
	];
    //초기 진입점
	let paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	setRegDataSet(param);//넘어온 데이터 세팅
    	setSelectCode();     //select 정보 세팅
    	setEventListener();  //이벤트

    	//로딩 후 자동계산
    	setTimeout(function(){
    		calcDemdEqp();
    	}, 1000);

    	var param = {};
    	gSrcReqIdVal = paramData.mtsoInvtSmltId + "_" + paramData.intgMtsoId;
		param.srcReqIdVal = gSrcReqIdVal;
		reqDtlSetGrid(param, 1, 100);

		// 요청 진행 상태 확인(요청, 진행중, 완료, 실패)
		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getRouteReqProgStatInfo', param, 'GET', 'reqProgStatVal');
    };

    /*-----------------------------*
     *  넘어온 데이터 세팅
     *-----------------------------*/
    function setRegDataSet(data) {
    	$('#mtsoSlmtDtlArea').setData(data);
    }

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	//커버리지 설계 내역
    	let param = {};
    	param.comGrpCd = "INVTSLMT";

    	httpRequest('tango-transmission-tes-biz/transmisson/tes/commoncode/getCfgCdList', param, 'GET', 'selectCfgCdList');
    }

    function setEventListener() {

    	$("#btnSearch").on("click", function(e) {
    		$('#'+gridId1).alopexGrid('showProgress');
    		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmtanal/getMtsoSlmtInitDataInfo', paramData, 'GET', 'selectMtsoSlmtInitDataInfo');
    	});

    	$("#btnDeleteRow").on("click", function(e) {
    		if(gridId1FocusInfo.length == 0){
    			callMsgBox('','W', "선택된 통합 국사가 없습니다." , function(msgId, msgRst){});
    			return;
    		}

    		$('#'+gridId1).alopexGrid('dataDelete', {_state: {selected:true}});
    	});

    	$("#btnAddRow").on("click", function(e) {
    		setGridAddRow();
    	});

    	$("#btnCalc").on("click", function(e) {
    		//수요장비계산
    		calcDemdEqp();
    	});

    	$("#btnSave").on("click", function(e) {
    		saveMtsoInvtSlmtDtl();
    	});

    	$('#btnCncl').on('click', function(e) {
    		$a.close();
        });

    	$('#btnRAPopup').on('click', function(e) {
    		var param = {};
//			paramData.lowMtsoId = dataObj.mtsoId;
    		param.srcReqIdVal = paramData.mtsoInvtSmltId + "_" + paramData.intgMtsoId;
//			paramData.srcReqSeqVal = dataObj.dsnRsltSeq;

    		$a.popup({
    			popid: "TesRouteanListPop",
    			title: "TES 경로 조회",
    			url: "/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/TesRouteanInqPop.do",
    			data: param,
    			windowpopup : true,
    			modal: false,
    			movable:true,
    			width : 1200,
    			height : 850,
    			callback: function(data) {
    				console.log("CardPortUseListPop callback data : ", data);
    			}
    		});
        });

    	$('#btnAply').on('click', function(e) {

    		if(gridId1Len.length == 0) {
				callMsgBox('','W', "적용할 데이터가 없습니다." , function(msgId, msgRst){});
				return
			}

    		// 버튼 비활성화
			$('#btnAply').setEnabled(false);

    		$('#'+gridId3).alopexGrid('dataEmpty');
    		var param = paramData;

    		var userId;
    		if($("#userId").val() == ""){
    			userId = "SYSTEM";
    		}else{
    			userId = $("#userId").val();
    		}

    		param.frstRegUserId = userId;

    		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmtanal/callRouteAnalysisApi', paramData, 'POST', 'callRouteAnalysisApi');
        });

    	$('#'+gridId3).on('click', '.bodycell', function(e){

    		let paramData = {};
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridId3).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			if(rowData._key == "lowMtsoIcon"){
				// 하위국팝업 호출
				//alertBox('I', '하위국 화면 호출 예정');
				// 하위국팝업 호출
				callEngMapPopup(gridId3, dataObj, rowData._key);

			}
		});

    	// 페이지 번호 클릭시
   	 	$('#'+gridId3).on('pageSet', function(e){
        	var obj = AlopexGrid.parseEvent(e);

        	var dtlData = {srcReqIdVal: gSrcReqIdVal};
        	reqDtlSetGrid(dtlData, obj.page, obj.pageinfo.perPage);
        });

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId3).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			var dtlData = {srcReqIdVal: gSrcReqIdVal};
			reqDtlSetGrid(dtlData, 1, eObj.perPage);
		});

		$('#btnExcelDown').on('click', function(e) {

			excelHeaderGroupUpdate('Y');


			var fileName;
			var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());

			fileName = '국사투자시뮬레이션_' + paramData.mtsoInvtSmltNm + '_' + paramData.intgMtsoNm +'_' + dayTime;

			var worker = new ExcelWorker({
				excelFileName : fileName,
				palette : [{
					className : 'B_YELLOW',
					backgroundColor: '255,255,0'
				},{
					className : 'F_RED',
					color: '#FF0000'
				}],
				sheetList: [{
					sheetName:  paramData.intgMtsoNm,
					placement: 'vertical',
					$grid: [$('#'+gridId1), $('#'+gridId1Footer), $('#'+gridId2)]
				}]
			});
			worker.export({
				merge : true,
				useGridColumnWidth : true,
				useCSSParser : true,

				border : true,
        		callback : {
 					preCallback : function(gridList){
 						for(var i=0; i < gridList.length; i++) {
 							if(i == 0  || i == gridList.length -1)
 								gridList[i].alopexGrid('showProgress');
 						}
 					},
 					postCallback : function(gridList) {
 						for(var i=0; i< gridList.length; i++) {
 							gridList[i].alopexGrid('hideProgress');
 						}
 					}
 				}
			});

			excelHeaderGroupUpdate('N');

        });

		 // 경로분석 엑셀 다운로드
        $('#btnReqDtlDown').on('click', function(e) {

        	var excelGridId = '';
    		var excelMethod = "";
    		var excelFlag = "";
    		var fileName = "";

    		var now = new Date();

			excelGridId = gridId3;
			excelMethod = 'getTesRouteReqDtlListExcel';
			excelFlag = 'RouteReqDtlListExcel';
			fileName = '경로분석결과' + '_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));


    		var gridData = $('#'+excelGridId).alopexGrid('dataGet');
    		if (gridData.length == 0) {
    			callMsgBox('경로분석상세','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
    				return;
    		}

    		var param =  $("#mtsoSlmtDtlForm").getData();

    		param = gridExcelColumn(param, $('#'+excelGridId));
       		param.pageNo = 1;
       		param.rowPerPage = 10;
       		param.firstRowIndex = 1;
       		param.lastRowIndex = 1000000000;


	   		 var userId;
	   		 if($("#userId").val() == ""){
	   			 userId = "SYSTEM";
	   		 }else{
	   			 userId = $("#userId").val();
	   		 }

       		param.inUserId = userId;

           	// 엑셀 정보
    		param.raReqId = gRaReqId;
//    		param.raReqSeq = dtlData.raReqSeq;
    		param.fileName = fileName;
    		param.fileExtension = 'xlsx';
    		param.excelPageDown = 'N';
    		param.excelUpload = 'N';
    		param.excelMethod =excelMethod;
    		param.excelFlag = excelFlag;
    		fileNameOnDemand = fileName + '.xlsx';

    		exeGridId = excelGridId;
    		$('#'+excelGridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');

        });

    	$('#btnEngMap').on('click', function(e) {
        	callEngMapPopup(gridId3, "", "");
        });

    }

    function callEngMapPopup(gridId, dataObj, flag){
    	let param = {};

    	if(window.opener){
	    	if(dataObj == ""){ //multiselect
	    		let raReqIdArr = [];
	    		let raReqSeqArr = [];
	    		let selData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});

	    		let chkSelData = false;
				_.each(selData, function(row, idx){
					raReqIdArr.push(row.raReqId);
					raReqSeqArr.push(row.raReqSeq);
					chkSelData = true;
	       		});

				if(!chkSelData){
					return;
				}

				let uniqueRaReqIdArr = [...new Set(raReqIdArr)];
				let uniqueRaReqSeqArr = [...new Set(raReqSeqArr)];
				param.raReqIds = Object.keys(uniqueRaReqIdArr).map(function(i){
					return raReqIdArr[i]
				}).join(",");
				param.raReqSeqs = Object.keys(uniqueRaReqSeqArr).map(function(i){
					return raReqSeqArr[i]
				}).join(",");

	    	} else {
	    		param.raReqId = dataObj.raReqId; // 요청ID값
	    		param.raReqSeq = dataObj.raReqSeq;  // 요청순번값
	    	}

    		opener.randerRouteAnlLnqView(param);
		}else{
			callMsgBox('','W', "부모창이 존재하지 않아 지도표시가 불가능합니다." , function(msgId, msgRst){});
		}


    }

    function setGridAddRow() {
    	console.log("setGridAddRow");
    	let option 		= {_index:{data : 0}};

		let initRowData = [];
		let colData = {};
		colData.demdMtsoNm = "";
		colData.prtlDivVal = "NONE";
		colData.mtsoLkupIcon = "";

    	_.each(powerColList, function(item, i){
    		let keyVal = item.key.toLowerCase();
    		colData[keyVal] = "0";//(i < 21) ? "0" : "";
    	});

    	colData.mtsoInvtSmltId = $("#mtsoInvtSmltId").val();
    	colData.intgMtsoId = $("#intgMtsoId").val();
    	colData.demdMtsoId = "";

    	initRowData.push(colData);
		$("#"+gridId1).alopexGrid('dataAdd', initRowData, option);

    }

    function saveMtsoInvtSlmtDtl() {
    	let delData = AlopexGrid.trimData($('#'+gridId1).alopexGrid('dataGet', {_state: {deleted:true}}));
    	let addData = AlopexGrid.trimData($('#'+gridId1).alopexGrid('dataGet', {_state: {deleted:false}}));
    	let param =  $("#mtsoSlmtDtlForm").getData();
    	param.mtsoInvtSlmtDtlList = addData;
    	param.delMtsoInvtSlmtDtlList = delData;

    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmtanal/mtsoSlmtDtlReg', param, 'POST', 'mtsoSlmtDtlReg');
    }

    function setGridId1(param) {
    	$('#'+gridId1).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/mtsoinvtslmtanal/getEqpDemdQuty', param, 'GET', 'selectEqpDemdQuty');
    }

    function setGridId1Footer() {
		let initRowData = [];
		let colData1 = {};
		colData1.demdMtsoNm = "지구단위계획";
		colData1.prtlDivVal = "";

    	_.each(eqpColList, function(item, i){
    		let keyVal = item.key.toLowerCase();
    		colData1[keyVal] = "0";//(i < 21) ? "0" : "";
    	});
    	colData1.mtsoInvtSmltId = $("#mtsoInvtSmltId").val();
    	colData1.intgMtsoId = $("#intgMtsoId").val();
    	colData1.demdMtsoId = "";
    	initRowData.push(colData1);

    	let colData2 = {};
    	colData2.demdMtsoNm = "계";
		colData2.prtlDivVal = "";

    	_.each(eqpColList, function(item, i){
    		let keyVal = item.key.toLowerCase();
    		colData2[keyVal] = "0";//(i < 21) ? "0" : "";
    	});
    	colData2.mtsoInvtSmltId = $("#mtsoInvtSmltId").val();
    	colData2.intgMtsoId = $("#intgMtsoId").val();
    	colData2.demdMtsoId = "";
    	initRowData.push(colData2);

		let colData3 = {};
		colData3.demdMtsoNm = "랙수요";
		colData3.prtlDivVal = "";

    	_.each(eqpColList, function(item, i){
    		let keyVal = item.key.toLowerCase();
    		colData3[keyVal] = "0";//(i < 21) ? "0" : "";
    	});
    	colData3.mtsoInvtSmltId = $("#mtsoInvtSmltId").val();
    	colData3.intgMtsoId = $("#intgMtsoId").val();
    	colData3.demdMtsoId = "";
    	initRowData.push(colData3);

//		$("#"+gridId1Footer).alopexGrid('dataAdd', initRowData);
    	$('#'+gridId1Footer).alopexGrid('dataSet', initRowData);

    }

    function setGridId2() {
    	let initRowData = [];
		let colData1 = {};
		colData1.dummy = "계";
		_.each(fctColList, function(item, i){
    		let keyVal = item.key.toLowerCase();
    		colData1[keyVal] = "0";//(i < 21) ? "0" : "";
    	});
    	initRowData.push(colData1);

//		$("#"+gridId2).alopexGrid('dataAdd', initRowData);
    	$('#'+gridId2).alopexGrid('dataSet', initRowData);
    }

  	//그리드 Row 선택
	$('#'+gridId1).on('click', '.bodycell', function(e){
		let ev = AlopexGrid.parseEvent(e);
		let dataObj = ev.data;
		let rowData = $('#'+gridId1).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

		gridId1FocusInfo = $('#'+gridId1).alopexGrid('focusInfo').cellFocus.data;
//    	$('#'+gridId1).alopexGrid("updateOption", { rowOption : {
//																styleclass : function(data, rowOption) {
//																				if(data['demdMtsoId'] == gridId1FocusInfo.demdMtsoId){
//																					return 'row-highlight-orange';
//																				}
//																			}
//																}
//    												});

		if(rowData._key == "mtsoLkupIcon"){
			// 국사팝업 호출
			callMtsoLkupPop(gridId1, dataObj ,rowData._key);
		}


    });

	function callMtsoLkupPop(gridId, dataObj, flag){
		let row = dataObj._index.row;
    	let param = {};
    	param.mtsoId = dataObj.demdMtsoId;
    	param.mtsoNm = dataObj.demdMtsoNm;

		let tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
		$a.popup({
			popid: tmpPopId,
			title: "국사ID 조회",
			url: "/tango-transmission-web/configmgmt/common/MtsoLkup.do",
			data: param,
			windowpopup : false,
            modal: true,
            movable:true,
            width : 950,
            height : 800,
			callback: function(data) {
				if(flag == "mtsoLkupIcon"){
					$('#'+gridId).alopexGrid("dataEdit", {
						demdMtsoId 	: data.mtsoId,
						demdMtsoNm 	: data.mtsoNm,
						prtlDivVal 	: "NONE",
						mtsoInvtSmltId : paramData.mtsoInvtSmltId,
			    		intgMtsoId : paramData.intgMtsoId
					}, {_index:{data : row}});
				}
			}
		});
    }

	//수요장비계산
	function calcDemdEqp(){
		let unitPlan = Number($("#znUnitPlanVal").val());
//		if(unitPlan == 'NaN'
//			|| unitPlan == 0) {
//			callMsgBox('','I', "지구단위계획 수치를 확인해주세요." , function(msgId, msgRst){});
//			return;
//		}

		//지구단위계획
		let e1 = 0, e2 = 0, e3 = 0, e4 = 0, e5 = 0, e6 = 0, e7 = 0, e8 = 0, e9 = 0, e10 = 0
		, e11 = 0, e12 = 0, e13 = 0, e14 = 0, e15 = 0, e16 = 0, e17 = 0, e18 = 0, e19 = 0, e20 = 0
		, e21 = 0, e22 = 0, e23 = 0, e24 = 0, e25 = 0, e26 = 0, e27 = 0, e28 = 0;

		e1 = Math.ceil(unitPlan / 400 / 6); //IPDU - ROUNDUP(AD41/400/6,0)
		e2 = 0; //E3
		e3 = e1; //4G - IPDU수치
		e4 = Math.ceil(e1 * 0.8); //5G - ROUNDUP(AF41*0.8,0)
		e5 =  Math.ceil(e4 * parseFloat(rackColList[4].title) / parseFloat(rackColList[3].title)); //6G - ROUNDUP(AI41*$AJ$3/$AI$3,0)
		e6 = 0; //AMHS
		e7 = 0; //IMHS
		e8 = 0; //QMHS
		e9 = Math.ceil(unitPlan / 400 / 3); //SMHS - ROUNDUP(AD13/400/3,0)
		e10 = 0; //LEGACY
		e11 = Math.ceil(e9 * 4 * 3 / 3); //L9TU - ROUNDUP(AN13*4*3/3,0)
		e12 = Math.ceil(e1 * 6 / 4); //mRRU - ROUNDUP(AF13*6/4,0)
		e13 = (e7 + e8 + e9) / 2; //LSH_5G - SUM(AL13:AN13)/2
		e14 = e13; //LSH_6G - LSH_5G참조
		e15 = 0; //IBR
		e16 = 0; //IVR
		e17 = 0; //PTS
		e18 = 0; //광단국
		e19 = 0; //ROTN
		e20 = 0; //COT
		e21 = 0; //PON
		e22 = 0; //MRH
		e23 = 0; //IPD
		e24 = 0; //CRS
		e25 = 0; //리튬
		e26 = 0; //납
		e27 = 0; //MUX
		e28 = 0; //냉방

		let footerRow1 = {};
		footerRow1.e1 = e1;
		footerRow1.e3 = e3;
		footerRow1.e4 = e4;
		footerRow1.e5 = e5;
		footerRow1.e9 = e9;
		footerRow1.e11 = e11;
		footerRow1.e12 = e12;
		footerRow1.e13 = e13;
		footerRow1.e14 = e14;
		$('#'+gridId1Footer).alopexGrid("dataEdit", footerRow1, {_index:{data : 0}});

		//합계 계산
		let sumE1 = 0, sumE2 = 0, sumE3 = 0, sumE4 = 0, sumE5 = 0, sumE6 = 0, sumE7 = 0, sumE8 = 0, sumE9 = 0, sumE10 = 0
		, sumE11 = 0, sumE12 = 0, sumE13 = 0, sumE14 = 0, sumE15 = 0, sumE16 = 0, sumE17 = 0, sumE18 = 0, sumE19 = 0, sumE20 = 0
		, sumE21 = 0, sumE22 = 0, sumE23 = 0, sumE24 = 0, sumE25 = 0, sumE26 = 0, sumE27 = 0, sumE28 = 0;

		let rowData = $('#'+gridId1).alopexGrid("dataGet");
		_.each(rowData, function(row, idx){
			sumE1 += parseFloat(row.e1);
			sumE2 += parseFloat(row.e2);
			sumE3 += parseFloat(row.e3);
			sumE4 += parseFloat(row.e4);
			sumE5 += parseFloat(row.e5);
			sumE6 += parseFloat(row.e6);
			sumE7 += parseFloat(row.e7);
			sumE8 += parseFloat(row.e8);
			sumE9 += parseFloat(row.e9);
			sumE10 += parseFloat(row.e10);
			sumE11 += parseFloat(row.e11);
			sumE12 += parseFloat(row.e12);
			sumE13 += parseFloat(row.e13);
			sumE14 += parseFloat(row.e14);
			sumE15 += parseFloat(row.e15);
			sumE16 += parseFloat(row.e16);
			sumE17 += parseFloat(row.e17);
			sumE18 += parseFloat(row.e18);
			sumE19 += parseFloat(row.e19);
			sumE20 += parseFloat(row.e20);
			sumE21 += parseFloat(row.e21);
		});

		let footerRow2 = {}; //계
		footerRow2.e1 = sumE1 + e1;
		footerRow2.e2 = sumE2 + e2;
		footerRow2.e3 = sumE3 + e3;
		footerRow2.e4 = sumE4 + e4;
		footerRow2.e5 = sumE5 + e5;
		footerRow2.e6 = sumE6 + e6;
		footerRow2.e7 = sumE7 + e7;
		footerRow2.e8 = sumE8 + e8;
		footerRow2.e9 = sumE9 + e9;
		footerRow2.e10 = sumE10 + e10;
		footerRow2.e11 = sumE11 + e11;
		footerRow2.e12 = sumE12 + e12;
		footerRow2.e13 = sumE13 + e13;
		footerRow2.e14 = sumE14 + e14;
		footerRow2.e15 = 0;//sumE15 + e15;
		footerRow2.e16 = 2;//sumE16 + e16;
		footerRow2.e17 = 1;//sumE17 + e17;
		footerRow2.e18 = 1;//sumE18 + e18;
		footerRow2.e19 = 2;//sumE19 + e19;
		footerRow2.e20 = sumE20 + e20;
		footerRow2.e21 = sumE21 + e21;
		footerRow2.e22 = 0;
		footerRow2.e23 = 0;
		footerRow2.e24 = 0;
		footerRow2.e25 = 0;
		footerRow2.e26 = 0;
		footerRow2.e27 = (parseFloat(footerRow2.e4) + parseFloat(footerRow2.e5)) * 6;
		footerRow2.e28 = Math.ceil(((footerRow2.e1 * parseFloat(powerColList[0].title))
						+ (footerRow2.e2 * parseFloat(powerColList[1].title))
						+ (footerRow2.e3 * parseFloat(powerColList[2].title))
						+ (footerRow2.e4 * parseFloat(powerColList[3].title))
						+ (footerRow2.e5 * parseFloat(powerColList[4].title))
						+ (footerRow2.e6 * parseFloat(powerColList[5].title))
						+ (footerRow2.e7 * parseFloat(powerColList[6].title))
						+ (footerRow2.e8 * parseFloat(powerColList[7].title))
						+ (footerRow2.e9 * parseFloat(powerColList[8].title))
						+ (footerRow2.e10 * parseFloat(powerColList[9].title))
						+ (footerRow2.e11 * parseFloat(powerColList[10].title))
						+ (footerRow2.e12 * parseFloat(powerColList[11].title))
						+ (footerRow2.e13 * parseFloat(powerColList[12].title))
						+ (footerRow2.e14 * parseFloat(powerColList[13].title))
						+ (footerRow2.e15 * parseFloat(powerColList[14].title))
						+ (footerRow2.e16 * parseFloat(powerColList[15].title))
						+ (footerRow2.e17 * parseFloat(powerColList[16].title))
						+ (footerRow2.e18 * parseFloat(powerColList[17].title))
						+ (footerRow2.e19 * parseFloat(powerColList[18].title))
						+ (footerRow2.e20 * parseFloat(powerColList[19].title))
						+ (footerRow2.e21 * parseFloat(powerColList[20].title))) * 860 / 2500);//SUMPRODUCT(AF4:AZ4,AF14:AZ14)*860/2500
		$('#'+gridId1Footer).alopexGrid("dataEdit", footerRow2, {_index:{data : 1}});

		//랙수요
		let rackE1 = 0, rackE2 = 0, rackE3 = 0, rackE4 = 0, rackE5 = 0, rackE6 = 0, rackE7 = 0, rackE8 = 0, rackE9 = 0, rackE10 = 0
		, rackE11 = 0, rackE12 = 0, rackE13 = 0, rackE14 = 0, rackE15 = 0, rackE16 = 0, rackE17 = 0, rackE18 = 0, rackE19 = 0, rackE20 = 0
		, rackE21 = 0, rackE22 = 0, rackE23 = 0, rackE24 = 0, rackE25 = 0, rackE26 = 0, rackE27 = 0, rackE28 = 0;
		let footerRow3 = {}; //랙수
		footerRow3.e1 = Math.ceil(footerRow2.e1 * parseFloat(rackColList[0].title));
		footerRow3.e2 = Math.ceil(footerRow2.e2 * parseFloat(rackColList[1].title));
		footerRow3.e3 = Math.ceil(footerRow2.e3 * parseFloat(rackColList[2].title));
		footerRow3.e4 = Math.ceil(footerRow2.e4 * parseFloat(rackColList[3].title));
		footerRow3.e5 = Math.ceil(footerRow2.e5 * parseFloat(rackColList[4].title));
		footerRow3.e6 = Math.ceil(footerRow2.e6 * parseFloat(rackColList[5].title));
		footerRow3.e7 = Math.ceil(footerRow2.e7 * parseFloat(rackColList[6].title));
		footerRow3.e8 = Math.ceil(footerRow2.e8 * parseFloat(rackColList[7].title));
		footerRow3.e9 = Math.ceil(footerRow2.e9 * parseFloat(rackColList[8].title));
		footerRow3.e10 = Math.ceil(footerRow2.e10 * parseFloat(rackColList[9].title));
		footerRow3.e11 = Math.ceil(footerRow2.e11 * parseFloat(rackColList[10].title));
		footerRow3.e12 = Math.ceil(footerRow2.e12 * parseFloat(rackColList[11].title));
		footerRow3.e13 = Math.ceil(footerRow2.e13 * parseFloat(rackColList[12].title));
		footerRow3.e14 = Math.ceil(footerRow2.e14 * parseFloat(rackColList[13].title));
		footerRow3.e15 = Math.ceil(footerRow2.e15 * parseFloat(rackColList[14].title));
		footerRow3.e16 = Math.ceil(footerRow2.e16 * parseFloat(rackColList[15].title));
		footerRow3.e17 = Math.ceil(footerRow2.e17 * parseFloat(rackColList[16].title));
		footerRow3.e18 = Math.ceil(footerRow2.e18 * parseFloat(rackColList[17].title));
		footerRow3.e19 = Math.ceil(footerRow2.e19 * parseFloat(rackColList[18].title));
		footerRow3.e20 = Math.ceil(footerRow2.e20 * parseFloat(rackColList[19].title));
		footerRow3.e21 = Math.ceil(footerRow2.e21 * parseFloat(rackColList[20].title));
		footerRow3.e22 = Math.ceil(footerRow2.e22 * parseFloat(rackColList[21].title));
		footerRow3.e23 = Math.ceil(footerRow2.e23 * parseFloat(rackColList[22].title));
		footerRow3.e24 = Math.ceil(footerRow2.e24 * parseFloat(rackColList[23].title));
		footerRow3.e25 = Math.ceil(footerRow2.e25 * parseFloat(rackColList[24].title));
		footerRow3.e26 = Math.ceil(footerRow2.e26 * parseFloat(rackColList[25].title));
		footerRow3.e27 = Math.ceil(footerRow2.e27 * parseFloat(rackColList[26].title));
		footerRow3.e28 = Math.ceil((footerRow2.e28 / 10) * parseFloat(rackColList[27].title));

		$('#'+gridId1Footer).alopexGrid("dataEdit", footerRow3, {_index:{data : 2}});

		//설비수요계산
		setTimeout(function(){
			calcInfra();
		}, 100);
	}

	//설비수요계산
	function calcInfra(){
		let f1 = 0, f2 = 0, f3 = 0, f4 = 0, f5 = 0, f6 = 0, f7 = 0, f8 = 0, f9 = 0;
		let infraRow = {}; //계

		let sumData = $('#'+gridId1Footer).alopexGrid("dataGet" , {_index:{data : 1}});
		//납항목에 대한 합계에 필요하기 때문에 먼저 계산한다.
		//부하48
		f8 = (((sumData[0].e4 * parseFloat(powerColList[3].title))
			+ (sumData[0].e5 * parseFloat(powerColList[4].title))
			+ (sumData[0].e13 * parseFloat(powerColList[12].title))
			+ (sumData[0].e14 * parseFloat(powerColList[13].title))
			+ (sumData[0].e15 * parseFloat(powerColList[14].title))
			+ (sumData[0].e16 * parseFloat(powerColList[15].title))
			+ (sumData[0].e17 * parseFloat(powerColList[16].title))
			+ (sumData[0].e18 * parseFloat(powerColList[17].title))
			+ (sumData[0].e19 * parseFloat(powerColList[18].title))
			+ (sumData[0].e20 * parseFloat(powerColList[19].title))
			+ (sumData[0].e21 * parseFloat(powerColList[20].title))) * 1000 / 53.3).toFixed(3);

		//부하24
		f9 = (((sumData[0].e1 * parseFloat(powerColList[0].title))
			+ (sumData[0].e2 * parseFloat(powerColList[1].title))
			+ (sumData[0].e3 * parseFloat(powerColList[2].title))
			+ (sumData[0].e6 * parseFloat(powerColList[5].title))
			+ (sumData[0].e7 * parseFloat(powerColList[6].title))
			+ (sumData[0].e8 * parseFloat(powerColList[7].title))
			+ (sumData[0].e9 * parseFloat(powerColList[8].title))
			+ (sumData[0].e10 * parseFloat(powerColList[9].title))
			+ (sumData[0].e11 * parseFloat(powerColList[10].title))
			+ (sumData[0].e12 * parseFloat(powerColList[11].title))) * 1000 / 27).toFixed(3);

		let footerRow2 = {}; //계
		footerRow2.e22 = Math.ceil(parseFloat(f8) / (2000 * 0.7));
		footerRow2.e23 = Math.ceil(parseFloat(f8) / 630);
		footerRow2.e24 = Math.ceil(parseFloat(f9) / (1800 * 0.7));
		footerRow2.e26 = Math.ceil(parseFloat(f8) * 4.87 / 1200) + Math.ceil(parseFloat(f9) * 4.87 / 1200); //ROUNDUP(BJ14*4.87/1200,0)+ROUNDUP(BK14*4.87/1200,0)
		$('#'+gridId1Footer).alopexGrid("dataEdit", footerRow2, {_index:{data : 1}});

		let footerRow3 = {}; //랙수요
		footerRow3.e22 = Math.ceil(footerRow2.e22 * parseFloat(rackColList[21].title));
		footerRow3.e23 = Math.ceil(footerRow2.e23 * parseFloat(rackColList[22].title));
		footerRow3.e24 = Math.ceil(footerRow2.e24 * parseFloat(rackColList[23].title));
		footerRow3.e25 = Math.ceil(0 * parseFloat(rackColList[24].title));
		footerRow3.e26 = Math.ceil(parseFloat(f8) * 4.87 / 1200) * 1.5 + Math.ceil(parseFloat(f9) * 4.87 / 1200) / 2 * 1.5; //ROUNDUP(BJ14*4.87/1200,0)*1.5+ROUNDUP(BK14*4.87/1200,0)/2*1.5
		$('#'+gridId1Footer).alopexGrid("dataEdit", footerRow3, {_index:{data : 2}});

		let rackData = $('#'+gridId1Footer).alopexGrid("dataGet" , {_index:{data : 2}});
		//랙수요
		f1 += rackData[0].e1 + rackData[0].e2 + rackData[0].e3 + rackData[0].e4 + rackData[0].e5 + rackData[0].e6 + rackData[0].e7 + rackData[0].e8 + rackData[0].e9 + rackData[0].e10
			+ rackData[0].e11 + rackData[0].e12 + rackData[0].e13 + rackData[0].e14 + rackData[0].e15 + rackData[0].e16 + rackData[0].e17 + rackData[0].e18 + rackData[0].e19 + rackData[0].e20
			+ rackData[0].e21 + rackData[0].e22 + rackData[0].e23 + rackData[0].e24 + rackData[0].e25 + rackData[0].e26 + rackData[0].e27 + rackData[0].e28;

		//장비(Kw)
		f3 = Math.ceil((sumData[0].e1 * parseFloat(powerColList[0].title))
			+ (sumData[0].e2 * parseFloat(powerColList[1].title))
			+ (sumData[0].e3 * parseFloat(powerColList[2].title))
			+ (sumData[0].e4 * parseFloat(powerColList[3].title))
			+ (sumData[0].e5 * parseFloat(powerColList[4].title))
			+ (sumData[0].e6 * parseFloat(powerColList[5].title))
			+ (sumData[0].e7 * parseFloat(powerColList[6].title))
			+ (sumData[0].e8 * parseFloat(powerColList[7].title))
			+ (sumData[0].e9 * parseFloat(powerColList[8].title))
			+ (sumData[0].e10 * parseFloat(powerColList[9].title))
			+ (sumData[0].e11 * parseFloat(powerColList[10].title))
			+ (sumData[0].e12 * parseFloat(powerColList[11].title))
			+ (sumData[0].e13 * parseFloat(powerColList[12].title))
			+ (sumData[0].e14 * parseFloat(powerColList[13].title))
			+ (sumData[0].e15 * parseFloat(powerColList[14].title))
			+ (sumData[0].e16 * parseFloat(powerColList[15].title))
			+ (sumData[0].e17 * parseFloat(powerColList[16].title))
			+ (sumData[0].e18 * parseFloat(powerColList[17].title))
			+ (sumData[0].e19 * parseFloat(powerColList[18].title))
			+ (sumData[0].e20 * parseFloat(powerColList[19].title))
			+ (sumData[0].e21 * parseFloat(powerColList[20].title)));

		//냉방(Kw)
		f4 = Math.ceil(parseFloat(f3) * 0.5);

		//전력수요(Kw)
		f2 = Math.ceil(parseFloat(f3) + parseFloat(f4));

		//5GDDF
		f5 = Math.ceil(parseFloat(sumData[0].e4) / 15); //ROUNDUP(AI14/15,0)

		//6GDDF
		f6 = Math.ceil(parseFloat(sumData[0].e5) / 15); //ROUNDUP(AJ14/15,0)

		//FDF
		f7 = 9;

		infraRow.f1 = f1;
		infraRow.f2 = f2;
		infraRow.f3 = f3;
		infraRow.f4 = f4;
		infraRow.f5 = f5;
		infraRow.f6 = f6;
		infraRow.f6 = f6;
		infraRow.f7 = f7;
		infraRow.f8 = f8;
		infraRow.f9 = f9;
		$('#'+gridId2).alopexGrid("dataEdit", infraRow, {_index:{data : 0}});
	}

    function initGrid(){
    	//grid1 컬럼 세팅
    	//grid1 헤더 정보 세팅
    	let grid1HeaderColumnList = [];

    	//장비헤더
    	grid1HeaderColumnList.push({fromIndex:'check', toIndex:'mtsoLkupIcon', title : '국사명', align:'center', width: '100px', hideSubTitle:true});
    	grid1HeaderColumnList.push({fromIndex:3, toIndex:3, title : '장비', align:'center', width: '100px'});
    	_.each(eqpColList, function(item, i){
    		i = i + 4;
    		let grid1Col = {fromIndex:i, toIndex:i, title : item.title, align:'right', width: '70px', id : item.key.toLowerCase()};
    		grid1HeaderColumnList.push(grid1Col);
    	});

    	//랙헤더
    	grid1HeaderColumnList.push({fromIndex:'check', toIndex:'mtsoLkupIcon', title : '국사명', align:'center', width: '100px', hideSubTitle:true});
    	grid1HeaderColumnList.push({fromIndex:3, toIndex:3, title : '랙', align:'center', width: '100px'});
    	_.each(rackColList, function(item, i){
    		i = i + 4;
    		let grid1Col = {fromIndex:i, toIndex:i, title : item.title, align:'right', width: '70px', id : 'r'+item.key.toLowerCase()};
    		grid1HeaderColumnList.push(grid1Col);
    	});

    	//전력헤더
    	let grid1ColumnList = [
    		{key : 'check', align: 'center',width: '40px', selectorColumn : true},
    		{key : 'demdMtsoNm', title : '국사명', align:'left', width: '150px', editable : false},
    		{key : 'mtsoLkupIcon', width : '30px', align : 'center', editable: false, render : {type:'mtsoLkupIcon'}, resizing: false},
    		{key : 'prtlDivVal', title : '전력', align:'center', width: '90px',
		    	render : { type: 'string',
		            rule: function (value, data){
        				return prtlDiv;
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			return prtlDiv;
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}
    	];

    	_.each(powerColList, function(item, i){
    		let grid1Col = {key : item.key.toLowerCase(), title : item.title, align:'right', width: '70px', editable: (i < 21) ? true : false};
    		grid1ColumnList.push(grid1Col);
    	});

    	grid1ColumnList.push({key : 'mtsoInvtSmltId', align:'left', title : '국사투자시뮬레이션ID', width: '160px', hidden: true});
    	grid1ColumnList.push({key : 'intgMtsoId', align:'left', title : '통합국사ID', width: '160px', hidden: true});
    	grid1ColumnList.push({key : 'demdMtsoId', align:'left', title : '수요국사ID', width: '160px', hidden: true});

    	$('#'+gridId1).alopexGrid({
    		pager: false,
    		height: '6row',
         	autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			preventScrollPropagation:true,
			cellSelectable: true,
			cellInlineEdit: true,
			instantInlineEditType: ["select"],
			cellInlineEditOption : {startEvent:'click'},
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: false,
			leaveDeleted: true,
			headerGroup: grid1HeaderColumnList,
			columnMapping : grid1ColumnList,
			renderMapping:{
				"mtsoLkupIcon" :{
					renderer : function(value, data, render, mapping) {
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				}
			},
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    	//gridId1Footer 헤더세팅
    	let gridId1FooterColumnList = [
    		{key : 'demdMtsoNm', title : '수요', align:'center', width: '220px', editable : false},
    		{key : 'prtlDivVal', title : '', align:'center', width: '90px'}
    	];

    	_.each(eqpColList, function(item, i){
    		let grid1FooterCol = {key : item.key.toLowerCase(), title : item.title, align:'right', width: '70px', editable: false};
    		gridId1FooterColumnList.push(grid1FooterCol);
    	});

    	gridId1FooterColumnList.push({key : 'mtsoInvtSmltId', align:'left', title : '국사투자시뮬레이션ID', width: '160px', hidden: true});
    	gridId1FooterColumnList.push({key : 'intgMtsoId', align:'left', title : '통합국사ID', width: '160px', hidden: true});
    	gridId1FooterColumnList.push({key : 'demdMtsoId', align:'left', title : '수요국사ID', width: '160px', hidden: true});

    	$('#'+gridId1Footer).alopexGrid({
    		pager: false,
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
    		leaveDeleted: true,
    		height: '3row',
    		header: true,
    		columnMapping : gridId1FooterColumnList,
    			message: {/* 데이터가 없습니다.      */
    				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    			}
    	});

    	//gridId2 헤더세팅
    	let gridId2ColumnList = [
    		{key : 'dummy', title : '장비', align:'center', width: '180px', editable : false},
    	];

    	_.each(fctColList, function(item, i){
    		let grid2Col = {key : item.key.toLowerCase(), title : item.title, align:'right', width: '70px', editable: false};
    		gridId2ColumnList.push(grid2Col);
    	});

        $('#'+gridId2).alopexGrid({
    		pager: false,
         	height: '1row',
         	autoColumnIndex: true,
     		autoResize: true,
     		rowSelectOption: {
     			clickSelect: false,
     			singleSelect: false
     		},
     		cellSelectable : true,
			columnMapping : gridId2ColumnList,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

        //gridId3 헤더세팅
        $('#'+gridId3).alopexGrid({
//        	paging : {
//        		pagerTotal: true //총 건수   안보이게
//        	},
        	paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
        	height: '350px',
        	autoResize: true,
			numberingColumnFromZero: false,
			rowSelectOption: {
	    		clickSelect: false,
	    		singleSelect: false
	    	},
        	headerGroup: [
	            {fromIndex:'lowMtsoIdNm', toIndex:'lowMtsoIcon', title:"<em class='color_red'></em>하위국", hideSubTitle:true},
			],
			renderMapping:{
				"lowMtsoIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='popup_button_gis' style='cursor: pointer'></span>";
					}
				}
			},
        	cellSelectable : true,
        	columnMapping : [
        		{ key: 'check', align: 'center', width: '40px', selectorColumn : true},
				{/* 요청순번			*/
					key : 'raReqSeq', align : 'center',
					title : '순번',
					width : '40'
				}, {/* 상위국 국사명			*/
					key : 'uprMtsoIdNm', align:'left',
					title : '상위국',
					width: '150'
				}, {/* 하위국 국사명			*/
					key : 'lowMtsoIdNm', align:'left',
					title : '하위국',
					width: '240'
				}, {
					key     : 'lowMtsoIcon',
					width   : '50px',
					align   : 'center',
					editable: false,
					render  : {type:'lowMtsoIcon'},
					resizing: false,
					rowspan:true
				}, {/* 소유분류코드			*/
					key : 'ownClCd', align:'center',
					title : '소유분류코드',
					width: '100'
				}, {
					key : 'cnptDistVal', align : 'center',
					title : '신설거리',
					width : '80'
				}, {
					key : 'sktCnt', align : 'right',
					title : 'SKT접속수',
					width : '80'
				}, {
					key : 'skbCnt', align : 'right',
					title : 'SKB접속수',
					width : '80'
				}, {
					key : 'sktCnntCnt', align : 'right',
					title : 'SKT중접수',
					width : '80'
				}, {
					key : 'skbCnntCnt', align : 'right',
					title : 'SKB중접수',
					width : '80'
				}, {
					key : 'sktDistm', align : 'center',
					title : 'SKT기설거리M',
					width : '110'
				}, {
					key : 'skbDistm', align : 'center',
					title : 'SKB기설거리M',
					width : '130'
				}, {
					key : 'cmplDistm', align : 'center',
					title : '기설거리합M',
					width : '140'
				}, {
					key : 'sktSprCnt', align : 'right',
					title : 'SKT접속수예비',
					width : '110'
				}, {
					key : 'skbSprCnt', align : 'right',
					title : 'SKB접속수예비',
					width : '110'
				}, {
					key : 'sktCnntSprCnt', align : 'right',
					title : 'SKT중접수예비',
					width : '110'
				}, {
					key : 'skbCnntSprCnt', align : 'right',
					title : 'SKB중접수예비',
					width : '110'
				}, {
					key : 'sktSprDistm', align : 'center',
					title : 'SKT기설거리M예비',
					width : '120'
				}, {
					key : 'skbSprDistm', align : 'center',
					title : 'SKB기설거리M예비',
					width : '130'
				}, {
					key : 'cmplSprDistm', align : 'center',
					title : '기설거리합M예비',
					width : '150'
				}, {/* 인입투자비		*/
					key : 'linInvtCost', align : 'right',
					title : '인입투자비(만원)',
					width : '120'
				}, {/* SKT투자비		*/
					key : 'sktInvtCost', align : 'right',
					title : 'SKT접속투자비(만원)',
					width : '130'
				}, {/* SKB투자비		*/
					key : 'skbInvtCost', align : 'right',
					title : 'SKB접속투자비(만원)',
					width : '130'
				}, {/* 경로분석요청ID			*/
					key : 'raReqId', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 상위국사ID			*/
					key : 'uprMtsoId', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 하위국사ID			*/
					key : 'lowMtsoId', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 원천요청ID값			*/
					key : 'srcReqIdVal', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 원천요청순번값			*/
					key : 'srcReqSeqVal', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}
        		],
        		message: {/* 데이터가 없습니다.      */
        			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
        		}
        });

        setGridId1(paramData);
        setGridId1Footer();
        setGridId2();

    }

    function reqDtlSetGrid(parameter, page, rowPerPage){
		var pageParam = {};

		pageParam.pageNo = page;
		pageParam.rowPerPage = rowPerPage;
		pageParam.srcReqIdVal = parameter.srcReqIdVal;

		var param = $.param(pageParam);
		// 유선설계경로분석요청상세 조회
		$('#'+gridId3).alopexGrid('showProgress');

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getRouteReqDtlList', param, 'GET', 'reqDtlSearch');
	}

	function successCallback(response, status, jqxhr, flag){

		if(flag == 'selectCfgCdList'){
			let cfgCdList = response.filter(item => (item["etcAttrVal6"] == "EQP"));

			//그리드 컬럼 세팅용값 설정
			_.each(cfgCdList, function(item, i){
				let column = {
						key : item.comCd,
						title : item.comCdNm,
				};
				eqpColList.push(column);
			});

			_.each(cfgCdList, function(item, i){

				let rackVal = parseFloat(item.etcAttrVal1).toFixed(3);
				let column = {
						key : item.comCd,
						title : (rackVal == "NaN") ? "" : rackVal,
				};
				rackColList.push(column);
			});

			_.each(cfgCdList, function(item, i){

				let powerVal = parseFloat(item.etcAttrVal2).toFixed(3);
				let column = {
						key : item.comCd,
						title : (powerVal == "NaN") ? "" : powerVal,
				};
				powerColList.push(column);
			});

			let cfgFctCdList = response.filter(item => (item["etcAttrVal6"] == "FCT"));
			_.each(cfgFctCdList, function(item, i){
				let column = {
						key : item.comCd,
						title : item.comCdNm,
				};
				fctColList.push(column);
			});

			initGrid();
		}

		if(flag == 'selectEqpDemdQuty'){
			$('#'+gridId1).alopexGrid('hideProgress');

			// 선로투자비분석 데이터 길이 확인
			gridId1Len = response.dataList;

			$('#'+gridId1).alopexGrid('dataSet', response.dataList);
           	$('#'+gridId1).alopexGrid("viewUpdate");
		}

		if(flag == 'mtsoSlmtDtlReg'){
			if(response.Result == "Success"){
        		callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
        			   if (msgRst == 'Y') {
        				   initGrid();
        				   calcDemdEqp();
        		       }
        		});
    		} else {
    			//저장을 실패 하였습니다.
        		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
		}

		if(flag == 'selectMtsoSlmtInitDataInfo'){
			$('#'+gridId1).alopexGrid('hideProgress');

			$('#'+gridId1).alopexGrid('dataSet', response.data);
           	$('#'+gridId1).alopexGrid("viewUpdate");

		}

		if(flag == 'callRouteAnalysisApi'){
//			$('#'+gridId1).alopexGrid('hideProgress');
			if (response.returnMessage == "saveSuccess") {
				callMsgBox('','I', '적용 되었습니다.',function(msgId, msgRst){});
			}else {
				callMsgBox('','W', '적용이 실패되었습니다.', function(msgId, msgRst){});
				$('#btnAply').setEnabled(true);
			}
		}

		if(flag == 'reqDtlSearch'){

			$('#'+gridId3).alopexGrid('hideProgress');

			var serverPageinfo = {
		      		dataLength  : response.pager.totalCnt, 	//총 데이터 길이
		      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
		      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
			};
			$('#'+gridId3).alopexGrid('dataSet', response.dataList, serverPageinfo);

			if (response.dataList !== undefined ) {
				if (response.dataList.length > 0) {
					gRaReqId = response.dataList[0].raReqId;
				}
			}

		}

		if(flag == 'reqProgStatVal'){
			if(response.result != null && (response.result.progStatVal == '요청' || response.result.progStatVal == '진행중')) {
				$('#btnAply').setEnabled(false);
			} else {
				$('#btnAply').setEnabled(true);
			}
		}

		if(flag == 'excelDownloadOnDemand'){
			$('#'+gridId3).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
		}
	}

	function failCallback(response, status, jqxhr, flag){

    	if(flag == 'selectCfgCdList'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "공통 코드 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'selectEqpDemdQuty'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', "통합국사별 장비 수량 조회에 실패하였습니다." , function(msgId, msgRst){});
    	}

    	if(flag == 'mtsoSlmtDtlReg'){
    		callMsgBox('','I', "통합국사별 장비 수량 저장에 실패하였습니다." , function(msgId, msgRst){});
		}

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
				&& gridHeader[i].key != 'check' && gridHeader[i].key != 'lowMtsoIcon')) {
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

	function onDemandExcelCreatePop ( jobInstanceId ){
	        // 엑셀다운로드팝업
	         $a.popup({
	                popid: 'CommonExcelDownlodPop' + jobInstanceId,
	                title: '엑셀다운로드',
	                iframe: true,
	                modal : false,
	                windowpopup : true,
	                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
	                data: {
	                    jobInstanceId : jobInstanceId,
	                    fileName : fileNameOnDemand,
	                    fileExtension : "xlsx"
	                },
	                width : 500,
	                height : 300
	                ,callback: function(resultCode) {
	                    if (resultCode == "OK") {
	                        //$('#btnSearch').click();
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


	function excelHeaderGroupUpdate(excelYn) {

		let grid1HeaderColumnList = [];
		let grid1ColumnList = [];

		if (excelYn == "Y") {
			//장비헤더
	    	grid1HeaderColumnList.push({fromIndex:2, toIndex:2, title : '장비', align:'center', width: '100px'});
	    	_.each(eqpColList, function(item, i){
	    		i = i + 3;
	    		let grid1Col = {fromIndex:i, toIndex:i, title : item.title, align:'right', width: '70px', id : item.key.toLowerCase()};
	    		grid1HeaderColumnList.push(grid1Col);
	    	});

	    	//랙헤더
	    	grid1HeaderColumnList.push({fromIndex:2, toIndex:2, title : '랙', align:'center', width: '100px'});
	    	_.each(rackColList, function(item, i){
	    		i = i + 3;
	    		let grid1Col = {fromIndex:i, toIndex:i, title : item.title, align:'right', width: '70px', id : 'r'+item.key.toLowerCase()};
	    		grid1HeaderColumnList.push(grid1Col);
	    	});

	    	//전력헤더
	    	grid1ColumnList = [
	    		{key : 'check', align: 'center',width: '40px', selectorColumn : true},
	    		{key : 'demdMtsoNm', title : '국사명', align:'left', width: '150px', editable : false},
	    		{key : 'prtlDivVal', title : '전력', align:'center', width: '90px',
			    	render : { type: 'string',
			            rule: function (value, data){
	        				return prtlDiv;
	    				}
					},
		         	editable : { type: 'select',
		         		rule: function(value, data) {
		         			return prtlDiv;
		         		},
		         		attr : {
			 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
			 			}
	 				},
					allowEdit : function(value,data,mapping) {
						return true;
					},
					editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
				}
	    	];

	    	_.each(powerColList, function(item, i){
	    		let grid1Col = {key : item.key.toLowerCase(), title : item.title, align:'right', width: '70px', editable: (i < 21) ? true : false};
	    		grid1ColumnList.push(grid1Col);
	    	});

	    	grid1ColumnList.push({key : 'mtsoInvtSmltId', align:'left', title : '국사투자시뮬레이션ID', width: '160px', hidden: true});
	    	grid1ColumnList.push({key : 'intgMtsoId', align:'left', title : '통합국사ID', width: '160px', hidden: true});
	    	grid1ColumnList.push({key : 'demdMtsoId', align:'left', title : '수요국사ID', width: '160px', hidden: true});
		} else {
			//장비헤더
	    	grid1HeaderColumnList.push({fromIndex:'check', toIndex:'mtsoLkupIcon', title : '국사명', align:'center', width: '100px', hideSubTitle:true});
	    	grid1HeaderColumnList.push({fromIndex:3, toIndex:3, title : '장비', align:'center', width: '100px'});
	    	_.each(eqpColList, function(item, i){
	    		i = i + 4;
	    		let grid1Col = {fromIndex:i, toIndex:i, title : item.title, align:'right', width: '70px', id : item.key.toLowerCase()};
	    		grid1HeaderColumnList.push(grid1Col);
	    	});

	    	//랙헤더
	    	grid1HeaderColumnList.push({fromIndex:'check', toIndex:'mtsoLkupIcon', title : '국사명', align:'center', width: '100px', hideSubTitle:true});
	    	grid1HeaderColumnList.push({fromIndex:3, toIndex:3, title : '랙', align:'center', width: '100px'});
	    	_.each(rackColList, function(item, i){
	    		i = i + 4;
	    		let grid1Col = {fromIndex:i, toIndex:i, title : item.title, align:'right', width: '70px', id : 'r'+item.key.toLowerCase()};
	    		grid1HeaderColumnList.push(grid1Col);
	    	});

	    	//전력헤더
	    	grid1ColumnList = [
	    		{key : 'check', align: 'center',width: '40px', selectorColumn : true},
	    		{key : 'demdMtsoNm', title : '국사명', align:'left', width: '150px', editable : false},
	    		{key : 'mtsoLkupIcon', width : '30px', align : 'center', editable: false, render : {type:'mtsoLkupIcon'}, resizing: false},
	    		{key : 'prtlDivVal', title : '전력', align:'center', width: '90px',
			    	render : { type: 'string',
			            rule: function (value, data){
	        				return prtlDiv;
	    				}
					},
		         	editable : { type: 'select',
		         		rule: function(value, data) {
		         			return prtlDiv;
		         		},
		         		attr : {
			 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
			 			}
	 				},
					allowEdit : function(value,data,mapping) {
						return true;
					},
					editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
				}
	    	];

	    	_.each(powerColList, function(item, i){
	    		let grid1Col = {key : item.key.toLowerCase(), title : item.title, align:'right', width: '70px', editable: (i < 21) ? true : false};
	    		grid1ColumnList.push(grid1Col);
	    	});

	    	grid1ColumnList.push({key : 'mtsoInvtSmltId', align:'left', title : '국사투자시뮬레이션ID', width: '160px', hidden: true});
	    	grid1ColumnList.push({key : 'intgMtsoId', align:'left', title : '통합국사ID', width: '160px', hidden: true});
	    	grid1ColumnList.push({key : 'demdMtsoId', align:'left', title : '수요국사ID', width: '160px', hidden: true});
		}

		$('#'+gridId1).alopexGrid('updateOption',
				{
    		    	headerGroup: grid1HeaderColumnList,
    		    	columnMapping : grid1ColumnList
				}
			);

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