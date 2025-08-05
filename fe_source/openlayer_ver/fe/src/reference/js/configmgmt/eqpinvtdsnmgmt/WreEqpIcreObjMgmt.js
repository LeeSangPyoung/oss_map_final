/**
 * WreEqpIcreObjMgmt.js
 *
 * @author P182022
 * @date 2022. 08. 03. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
   	var perPage 		= 100;
   	var gridId			= "dataGrid";
   	var dataEqpGrid		= "dataEqpGrid";

	var mOrgId		= $("#orgId").val();
	var mOrgNm		= $("#orgNm").val();
	var mOrgCd		= "";
	var mIcreObjId = "";
	var mEqpId= "";

	var mEqpDivCmb	= [];

	var mHdofcCmb 	= [];
	var mAreaId_1 	= [{value : 'T11001', text : '수도권'}];
	var mAreaId_2 	= [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var mAreaId_3 	= [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var mAreaId_4 	= [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];

	// 증설구분코드
	var mIcreDivCmb = [{value : '', text : '전체'},{value : '10', text : '트래픽초과'},{value : '20', text : '트래픽정상'}];

	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate());
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

	clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	 $("#clctDtStart").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
	 $("#clctDtEnd").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);


    this.init = function(id, param) {
		if(mOrgNm.indexOf('수도권') > -1){
			mOrgCd = '5100';
		}else if(mOrgNm.indexOf('동부') > -1){
			mOrgCd = '5300';
		}else if(mOrgNm.indexOf('서부') > -1){
			mOrgCd = '5500';
		}else if(mOrgNm.indexOf('중부') > -1){
			mOrgCd = '5600';
		}

		//설계로직 코드 조회
    	selectDsnLgcCode("dsnLgcCode");

    	setSelectCode();
    	setEventListener();
    };

    // 선택박스 코드 설정
    function setSelectCode() {
    	//본부코드
    	selectHdofcCode('hdofcCd');

		//증설구분
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/cfgStd/ICREDIV', null, 'GET', 'icreDiv');
//		$('#icreDivCd').setData({ data : mIcreDivCmb, option_selected: '' });
    }

    // 설계구분코드 조회
    function selectDsnLgcCode(objId) {
		var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', param, 'GET', objId);
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

    function setEventListener() {

    	// 페이지 번호 클릭시
   	 	$('#'+gridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });
    	// 페이지 번호 클릭시
   	 	$('#'+dataEqpGrid).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData2(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+dataEqpGrid).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	setFormData2(1, eObj.perPage);
        });

        // 유선장비증설대상 검색
    	$("#btnSearch").on("click", function(e) {
    		setFormData(1, perPage);
    	});

    	//엔터키로 조회
        $('#searchForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1, perPage);
      		}
    	 });

    	//row를 클릭했을때 팝업 이벤트 발생
        $('#'+gridId).on('click', '.bodycell', function(e){
        	var dataObj = null;
        	dataObj = AlopexGrid.parseEvent(e).data;
        	mIcreObjId = dataObj.icreObjId;
        	mEqpId = dataObj.eqpId;

        	param = {
        			"icreObjId": dataObj.icreObjId
        			,"eqpId": dataObj.eqpId
        	};

        	// 하단 그리드의 타이틀 장비명
			$("#span_btmEqpNm").text(dataObj.eqpNm);
        	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/obj/getIcreObjPortForPage', param, 'GET', 'searchPort');

        });

    	//row를 클릭했을때 팝업 이벤트 발생
        $('#dataEqpGrid').on('dblclick', '.bodycell', function(e){
        	var dataObj = null;
        	dataObj = AlopexGrid.parseEvent(e).data;
        	param = {
        			"icreObjId": dataObj.icreObjId
        			,"eqpId": dataObj.eqpId
        			,"portId": dataObj.portId
        	};

        	popup('icreRegDtl', $('#ctx').val()+'/configmgmt/eqpinvtdsnmgmt/WreEqpIcreObjPop.do', '용량증설대상 상세', param);

        });


    	// 본부코드 선택
    	$("#hdofcCd").on("change", function(e) {
			var supCd = $("#hdofcCd").val();
			selectAreaCode("areaId", supCd);

    	});

		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e);
		});

	}

	//Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height : '5row',
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
    		defaultColumnMapping:{
    			sorting : true
    		},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowspanGroupSelect: true,
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'clctDt', align:'center',
				title : '일자',
				width: '80px',
			}, {
				key : 'eqpDivNm', align:'center',
				title : '장비구분',
				width: '100px',
			    render : { type: 'string',
			           rule: function (value, data){
			               var render_data = [];
			               return render_data = render_data.concat( mEqpDivCmb );
			           }
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'hdofcNm', align:'center',
				title : '본부',
				width: '80px',
//			    render : { type: 'string',
//			           rule: function (value, data){
//			               var render_data = [];
//			               return render_data = render_data.concat( mHdofcCmb );
//			           }
//				},
//				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'areaNm', align:'center',
				title : '지역',
				width: '80px',
//			    render : { type: 'string',
//			           rule: function (value, data){
//			               var render_data	= [];
//			               var currentData	= AlopexGrid.currentData(data);
//			               var areaCmb 		= grdAreaIdCmb(currentData.hdofcCd);
//
//			               return render_data = render_data.concat( areaCmb );
//			           }
//				},
//				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'mtsoNm', align:'center',
				title : '국사',
				width: '140px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '160px'
			}, {
				key : 'splyVndrNm', align:'center',
				title : '제조사',
				width: '100px'
			}, {
				key : 'icreDivNm', align:'center',
				title : '증설구분',
				width: '100px',

			}, {
				key : 'portCnt', align:'center',
				title : '포트수(유휴포트)',
				width: '80px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'trfAvgVal', align:'center',
				title : '트래픽량',
				width: '80px'
			}, {
				key : 'mcpNm', align:'center',
				title : '광역시도',
				width: '80px'
			}, {
				key : 'sggNm', align:'center',
				title : '시군구',
				width: '80px'
			}, {
				key : 'emdNm', align:'center',
				title : '읍면동',
				width: '80px'
			}, {
				key : 'extrtRsn', align:'center',
				title : '용량증설 추출사유',
				width: '180px'
			}, {
				key : 'icreObjId', align:'center',
				title : '증설대상ID',
				width: '100px',
				hidden : true
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '120px',
				hidden : true
			}, {
				key : 'mtsoId', align:'center',
				title : '국사',
				width: '100px',
				hidden : true
			}, {
				key : 'mtsoTypCd', align:'center',
				title : '국사유형코드',
				width: '100px',
				hidden : true
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

        //그리드 생성
        $('#dataEqpGrid').alopexGrid({
        	height : '5row',
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
    		defaultColumnMapping:{
    			sorting : true
    		},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowspanGroupSelect: true,
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : '순번',
				width: '40px',
				numberingColumn: true
			}, {
				key : 'cardNm', align:'center',
				title : '카드명',
				width: '200px',
			    render : { type: 'string',
			           rule: function (value, data){
			               var render_data = [];
			               return render_data = render_data.concat( mEqpDivCmb );
			           }
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'cardMdlNm', align:'center',
				title : '카드모델명',
				width: '200px',
			    render : { type: 'string',
			           rule: function (value, data){
			               var render_data = [];
			               return render_data = render_data.concat( mHdofcCmb );
			           }
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '120px',
			    render : { type: 'string',
			           rule: function (value, data){
			               var render_data	= [];
			               var currentData	= AlopexGrid.currentData(data);
			               var areaCmb 		= grdAreaIdCmb(currentData.hdofcCd);

			               return render_data = render_data.concat( areaCmb );
			           }
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트 IP',
				width: '100px'
			}, {
				key : 'portSpedVal', align:'center',
				title : '포트용량',
				width: '80px'
			}, {
				key : 'mgmtStat', align:'center',
				title : '관리',
				width: '80px'
			}, {
				key : 'operStat', align:'center',
				title : '운영',
				width: '80px',
			    render : { type: 'string',
			           rule: function (value, data){
			               var render_data	= [];

			               return render_data = render_data.concat( mIcreDivCmb );
			           }
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'maxUseRate', align:'center',
				title : '사용률(%)',
				width: '80px',
				render: {type:"string", rule : "comma"}
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	};

    // 조회
    function setFormData(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	var param =  $("#searchForm").serialize();


    	var clctDtStart = $('#clctDtStart').val().replace(/-/gi,'');
    	var clctDtEnd = $('#clctDtEnd').val().replace(/-/gi,'');

    	param = param + "&clctDtStart=" + clctDtStart + "&clctDtEnd=" + clctDtEnd;
     	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/obj/getIcreObjMgmtForPage', param, 'GET', 'search');
    }
    // 조회
    function setFormData2(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	var param =  $("#searchForm").serialize();
    	param = param + "&icreObjId=" + mIcreObjId + "&eqpId=" + mEqpId;

     	$('#'+dataEqpGrid).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/obj/getIcreObjPortForPage', param, 'GET', 'searchPort');
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
			case "dsnLgcCode":
				mEqpDivCmb = response.mainLgc

				var option_data =  [{value: "", text: "전체"}];
				for(var i=0; i<mEqpDivCmb.length; i++){
					option_data.push({value: mEqpDivCmb[i].cd, text: mEqpDivCmb[i].cdNm});
				}

				$('#eqpDivCd').setData({data:option_data});

				//그리드 설정
				initGrid();
				break;
			case "search":
				$('#'+gridId).alopexGrid('hideProgress');
				setSpGrid(gridId, response, response.lists);
				break;
			case "searchPort":
				$('#dataEqpGrid').alopexGrid('hideProgress');
				setSpGrid('dataEqpGrid', response, response.dataList);
				break;
			case 'hdofcCd':
				for(var i=0; i<response.length; i++){
					var resObj 		= {value: response[i].cd, text: response[i].cdNm};

					mHdofcCmb.push(resObj);
				}
			case 'areaId':
				setSelectBoxData(flag, response);
				break;

			case 'icreDiv':
				var option_data =  [{comCd: "", comCdNm: "전체"}];

				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					option_data.push(resObj);
				}
				$('#icreDivCd').setData({ data : option_data, option_selected: '' });
				break;
			case "excelDownloadOnDemand":
				$('#'+gridId).alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
				break;
		}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "search":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

	// 선택박스 데이터 셋
	function setSelectBoxData(objId, response ){
		$('#'+objId).clear();
		var option_data =  [{value: "", text: "전체"}];

		for(var i=0; i<response.length; i++){
			var resObj 		= {value: response[i].cd, text: response[i].cdNm};

			option_data.push(resObj);
		}

		if(objId == "hdofcCd"){
			$('#'+objId).setData({ data : option_data});
			$('#'+objId).setSelected(mOrgCd);
		}else{
			$('#'+objId).setData({data:option_data});
		}

		if(objId == "areaId"){
			if(response.length == 1){
				$('#'+objId).setSelected(response[0].cd);
			}
		}
	}

    //Grid에 Row출력
    function setSpGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
/*
    function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		param.headerGrpCnt = 1;
		var excelHeaderGroupTitle = "";
		var excelHeaderGroupColor = "";
		var excelHeaderGroupFromIndex = "";
		var excelHeaderGroupToIndex = "";


		var excelHeaderGroupFromIndexTemp = "";
		var excelHeaderGroupToIndexTemp = "";
		var excelHeaderGroupTitleTemp ="";
		var excelHeaderGroupColorTemp = "";

		var toBuf = "";


		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			if (i== gridColmnInfo.length-1) {

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf =  toBuf + (gridColmnInfo[i].groupColumnIndexes.length)
			}

			excelHeaderGroupTitleTemp += gridColmnInfo[i].title + ";";
			excelHeaderGroupColorTemp +='undefined'+ ";";

		}

		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			excelHeaderGroupFromIndex += excelHeaderGroupFromIndexTemp.split(";")[i] + ";";
			excelHeaderGroupToIndex += excelHeaderGroupToIndexTemp.split(";")[i] + ";";
			excelHeaderGroupTitle += excelHeaderGroupTitleTemp.split(";")[i] + ";";
			excelHeaderGroupColor += excelHeaderGroupColorTemp.split(";")[i] + ";";

		}

		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}
*/
    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(event){
		var gridData = $('#'+gridId).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var param = $("#searchForm").getData();

		// 조회조건
		param.eqpDivCd		= $("#eqpDivCd").val();
		param.hdofcCd		= $("#hdofcCd").val();
		param.areaId		= $("#areaId").val();
		param.mtsoNm		= $("#mtsoNm").val();
		param.eqpNm			= $("#eqpNm").val();
		param.icreDivCd		= $("#icreDivCd").val();
		param.splyVndrNm	= $("#splyVndrNm").val();
		param.extrtRsn		= $("#extrtRsn").val();

		param.clctDtStart = $('#clctDtStart').val().replace(/-/gi,'');
		param.clctDtEnd = $('#clctDtEnd').val().replace(/-/gi,'');

		param = gridExcelColumn(param, $('#'+gridId));
		param.pageNo = 1;
		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();

		var now = new Date();
		var fileName = '유선장비증설대상_' + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = 'getTesWreEqpIcrdObjList';
		param.excelFlag = 'WreEqpIcrdObjList';
		fileNameOnDemand = fileName + '.xlsx';

		$('#'+gridId).alopexGrid('showProgress');
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

    function popup(pidData, urlData, titleData, paramData) {
    	$a.popup({
    		popid: pidData,
    		title: titleData,
    		url: urlData,
    		data: paramData,
    		iframe: false,
    		modal: true,
    		movable:true,
    		windowpopup: true,
    		width : 1200,
    		height : 680
    	});
	}

});