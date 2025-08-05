/**
 * WreEqpDsnStdMgmt.js
 *
 * @author P182022
 * @date 2022. 07. 26. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
   	var perPage0 	= 100;
   	var perPage1 	= 100;
   	var perPage2 	= 100;

	var gridTab0 	= 'gridEqpDiv';
	var gridTab1 	= 'gridAreaModel';
	var gridTab2 	= 'gridMatlInfo';

	var mTagetIdx 	= 0;
	var mTagetGrid 	= gridTab0;

	var mEqpDivCmb	= [];
	var mDemdEqpCmb	= [];
	var mTmofCmb	= [];
	var mEqpUnitCmb	= [];

    this.init = function(id, param) {
		$('#spanTitle').text("장비구분");

		//설계로직 코드 조회
    	selectDsnLgcCode("dsnLgcCode");

    	setEventListener();
    	setSelectCode();
    };

    function initData() {
    	initGrid();
    }

    function setEventListener() {
    	//탭변경 이벤트
    	$('#basicTabs').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				mTagetIdx 	= 0;
				mTagetGrid 	= gridTab0;
				$('#spanTitle').text("장비구분");
				break;
			case 1 :
				mTagetIdx 	= 1;
				mTagetGrid 	= gridTab1;
				$('#spanTitle').text("지역별 모델");
				break;
			case 2 :
				mTagetIdx 	= 2;
				mTagetGrid 	= gridTab2;
				$('#spanTitle').text("단가 정보");
				break;
			default :
				mTagetIdx 	= 0;
				mTagetGrid 	= gridTab0;
				$('#spanTitle').text("장비구분");
				break;
			}

			$('#'+mTagetGrid).alopexGrid("viewUpdate");
    	});

    	// 페이지 번호 클릭시
   	 	$('#'+gridTab0).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab0).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage0 = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });
    	// 페이지 번호 클릭시
   	 	$('#'+gridTab1).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab1).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage1 = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });
    	// 페이지 번호 클릭시
   	 	$('#'+gridTab2).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab2).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage2 = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });

        // 장비구분 검색
        $('#btnEqpSearch').on('click', function(e) {
        	setFormData(1, perPage0);
        });

        // 지역별모델 검색
        $('#btnAreaSearch').on('click', function(e) {
        	setFormData(1, perPage1);
        });

        // 자재정보 검색
        $('#btnMatlSearch').on('click', function(e) {
        	setFormData(1, perPage2);
        });

    	//엔터키로 조회
        $('#searchTab1').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1, perPage0);
      		}
    	 });
    	//엔터키로 조회
        $('#searchTab2').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1, perPage1);
      		}
    	 });
    	//엔터키로 조회
        $('#searchTab3').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1, perPage2);
      		}
    	 });

    	// 장비구분 행추가
    	$('#btnEqpAddRow').on("click", function(e) {
    		var option = {_index:{data : 0}};
    		var initRowData = [{"flag" : "ADD",
    			"dsnDivCd" 			: ''
    		}];

    		// 행추가 및 추가행 선택
    		$('#'+gridTab0).alopexGrid('dataAdd', initRowData, option);
    		$('#'+gridTab0).alopexGrid('rowSelect', option, true);
    	});

    	// 지역별 모델 행추가
    	$('#btnAreaAddRow').on("click", function(e) {
    		var option = {_index:{data : 0}};
    		var initRowData = [{"flag" : "ADD",
    			"tmofId"			: '',
    			"dsnDivCd" 			: '',
    			"eqpDtlDivCd" 		: ''
    		}];

    		// 행추가 및 추가행 선택
    		$('#'+gridTab1).alopexGrid('dataAdd', initRowData, option);
    		$('#'+gridTab1).alopexGrid('rowSelect', option, true);
    	});

    	// 자재정보 행추가
    	$('#btnMatlAddRow').on("click", function(e) {
    		var option = {_index:{data : 0}};
    		var initRowData = [{"flag" : "ADD",
    			"matlInfCd" 	: $('#eqpDivCd2').val(),
    			"eqpDtlDivCd" 	: '',
    			"eqpDivCd" 		: ''
    		}];

    		// 행추가 및 추가행 선택
    		$('#'+gridTab2).alopexGrid('dataAdd', initRowData, option);
    		$('#'+gridTab2).alopexGrid('rowSelect', option, true);
    	});

        // 장비구분 저장
        $('#btnEqpSave').on('click', function(e) {
        	setEqpDsnSaveData();
        });

        // 지역별 모델 저장
        $('#btnAreaSave').on('click', function(e) {
        	setEqpDsnSaveData();
        });

        // 자재정보 저장
        $('#btnMatlSave').on('click', function(e) {
        	setEqpDsnSaveData();
        });

        // 장비구분 삭제
        $('#btnEqpDeleteRow').on('click', function(e) {
        	setRowDelete();
        });

        // 지역별 모델 삭제
        $('#btnAreaDeleteRow').on('click', function(e) {
        	setRowDelete();
        });

        // 자재정보 삭제
        $('#btnMatlDeleteRow').on('click', function(e) {
        	setRowDelete();
        });

    	// cell editing
        $('#'+gridTab0).on('cellValueEditing', function(e) {
        	setCellValueEditing(e);
    	});
    	// cell editing
        $('#'+gridTab1).on('cellValueEditing', function(e) {
        	setCellValueEditing(e);
    	});
    	// cell editing
        $('#'+gridTab2).on('cellValueEditing', function(e) {
        	setCellValueEditing(e);
    	});

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
        $('#'+gridTab0).on('click', '.bodycell', function(e){
        	splyVndrPopupCall(e,gridTab0);
        });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
        $('#'+gridTab1).on('click', '.bodycell', function(e){
        	splyVndrPopupCall(e,gridTab1);
        });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
        $('#'+gridTab2).on('click', '.bodycell', function(e){
        	splyVndrPopupCall(e,gridTab2);
        });

		// 엑셀 다운로드
        $('#btnEqpExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e,'EQP');
		});

		// 엑셀 다운로드
        $('#btnAreaExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e,'AREA');
		});

		// 엑셀 다운로드
        $('#btnMatlExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e,'MATL');
		});

	}

    function setSelectCode() {
    	// 전송실 국사코드 조회
    	selectMtsoTmoCode('tmofId1');

    	// 설대장비구분코드
    	selectDemdEqpCode('demdEqpCd');

    	// 설계장비단위코드
    	selectDsnEqpUnitCode('dsnUnitCd');
    }

    // 설계구분코드 조회
    function selectDsnLgcCode(objId) {
		var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', param, 'GET', objId);
	}

    // 수요장비
    function selectDemdEqpCode(objId) {

		var param = {};

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDemdEqpCode', param, 'GET', objId);
    }

    // 전송실 국사코드 조회
    function selectMtsoTmoCode(objId) {
		var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getMtsoTmofCode', param, 'GET', objId);
    }

    // 설계장비단위코드 초회
    function selectDsnEqpUnitCode(objId) {
		var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnEqpUnitCode', param, 'GET', objId);
    }

	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    function splyVndrPopupCall(e, objId){
  		var ev = AlopexGrid.parseEvent(e);
		var dataObj = ev.data;
		var rowData = $('#'+objId).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

		var row = dataObj._index.row;
		if(rowData._key == "splyVndrCdIcon"){

			$a.popup({
	        	popid: "VendPop",
	        	title: "제조사 조회",
	        	url: "/tango-common-business-web/business/popup/PopupBpList.do",
   	            windowpopup : true,
   	            modal: true,
                movable:true,
   	            width : 950,
   	           	height : window.innerHeight * 0.83,
	            callback: function(data) {
	            	$('#'+objId).alopexGrid("dataEdit", {
	            		splyVndrCd 	: data.bpId,
	            		splyVndrNm 	: data.bpNm
					}, {_index:{data : row}});

	            	if($.TcpMsg.isEmpty(dataObj.flag)) {
    	            	$('#'+objId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
    	            	$('#'+objId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);
	            	}

	           	}
	        });
		} else if(rowData._key == "matlSetCdIcon"){

			$a.popup({
	        	popid: "matlSetPop",
	        	title: "전송자재SET 선택",
	        	url: "/tango-transmission-web/configmgmt/matlmgmt/TrmsMatlSetPop.do",
   	            windowpopup : false,
   	            modal: true,
                movable:true,
   	            width : 1235,
   	           	height : 680,
//   	           	data: {eqpMdlId : param.mdlCd},
	            callback: function(data) {
	            	$('#'+objId).alopexGrid("dataEdit", {
	            		matlSetCd 	: data.matlSetCd,
	            		matlSetNm 	: data.matlSetNm
					}, {_index:{data : row}});

	            	if($.TcpMsg.isEmpty(dataObj.flag)) {
    	            	$('#'+objId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
    	            	$('#'+objId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);
	            	}

	           	}
	        });
		}
    }

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(event,target){
		var gridData = $('#'+mTagetGrid).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var excelMethod = '';
		var excelFlag = '';
		var excelFileNm = '';

		if( target == 'EQP' ){
			excelFileNm = '유선망설계대상[장비구분]';
			excelMethod	= 'getTesEqpDsnStdEqpList';
			excelFlag	= 'EqpDsnStdEqpList';
		}else if( target == 'AREA' ){
			excelFileNm = '유선망설계대상[지역별모델]';
			excelMethod	= 'getTesEqpDsnStdAreaList';
			excelFlag	= 'EqpDsnStdAreaList';
		}else if( target == 'MATL' ){
			excelFileNm = '유선망설계대상[단가정보]';
			excelMethod	= 'getTesEqpDsnStdMatlList';
			excelFlag	= 'EqpDsnStdMatlList';
		}

		var param	= getParamData(mTagetIdx);

		param = gridExcelColumn(param, $('#'+mTagetGrid));
		param.pageNo = 1;
		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();

		var now = new Date();
		var fileName = excelFileNm +'_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = excelMethod;
		param.excelFlag = excelFlag;
		fileNameOnDemand = fileName + '.xlsx';

		$('#'+mTagetGrid).alopexGrid('showProgress');
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
				&& gridHeader[i].key != 'check' && gridHeader[i].key != 'splyVndrCdIcon' && gridHeader[i].key != 'matlSetCdIcon') ) {
				var title = gridHeader[i].title.replace('<em class="color_red">*</em>','');
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ';';
				excelHeaderNm += title;
				excelHeaderNm += ';';
				excelHeaderAlign += gridHeader[i].align.replace('right','str_right');
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

    // 조회
    function setFormData(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	setFormExcData();
    }

    // 검색조회
    function setFormExcData(){
    	var param 			= getParamData(mTagetIdx);
    	param.tabIdx		= mTagetIdx;
    	param.pageNo 		= $('#pageNo').val();
    	param.rowPerPage 	= $('#rowPerPage').val();

    	$('#'+mTagetGrid).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/std/getEqpDivMgmtForPage', param, 'GET', 'search');
    }

    // 저장
    function setEqpDsnSaveData() {
    	$('#'+mTagetGrid).alopexGrid('endEdit'); // 편집종료

		var gridData = AlopexGrid.trimData($('#'+mTagetGrid).alopexGrid('dataGet', { _state : { selected : true }}));
		if (gridData.length == 0) {// 선택한 데이터가 존재하지 않을 시
			callMsgBox('btnMsgWarning','W', configMsgArray['selectNoData'], btnMsgCallback);
			return;

		} else if(gridData.length > 0) {
			if(mTagetGrid == gridTab0){
				for (var i=0;i < gridData.length; i++) {
					if(gridData[i].flag != 'DEL'){
						if($.TcpMsg.isEmpty(gridData[i].dsnDivCd)){
							callMsgBox('btnMsgWarning','I', "설계대상을 입력해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(gridData[i].eqpDtlDivNm)){
							callMsgBox('btnMsgWarning','I', "설계장비구분을 입력해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(gridData[i].dsnUnitNm)){
							callMsgBox('btnMsgWarning','I', "설계장비단위를 입력해 주십시오.");
							return false;
						}
					}
				}
			}else if(mTagetGrid == gridTab1){
				for (var i=0;i < gridData.length; i++) {
					if(gridData[i].flag != 'DEL'){
						if($.TcpMsg.isEmpty(gridData[i].tmofId)){
							callMsgBox('btnMsgWarning','I', "전송실을 선택해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(gridData[i].dsnDivCd)){
							callMsgBox('btnMsgWarning','I', "설계대상을 선택해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(gridData[i].eqpDtlDivCd)){
							callMsgBox('btnMsgWarning','I', "설계장비구분을 선택해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(gridData[i].eqpDivCd)){
							callMsgBox('btnMsgWarning','I', "설계장비단위을 선택해 주십시오.");
							return false;
						}
					}
				}
			}else if(mTagetGrid == gridTab2){
				for (var i=0;i < gridData.length; i++) {
					if(gridData[i].flag != 'DEL'){
						if($.TcpMsg.isEmpty(gridData[i].matlInfCd)){
							callMsgBox('btnMsgWarning','I', "설계대상을 입력해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(gridData[i].eqpDtlDivCd)){
							callMsgBox('btnMsgWarning','I', "설계장비구분을 선택해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(gridData[i].eqpDivCd)){
							callMsgBox('btnMsgWarning','I', "설계장비단위을 선택해 주십시오.");
							return false;
						}
					}
				}
			}
			callMsgBox('saveConfirm','C', configMsgArray['saveConfirm'], btnMsgCallback);
		}
    }

	// 버튼 콜백 funtion
	var btnMsgCallback = function (msgId, msgRst) {
		if ('saveConfirm' == msgId && 'Y' == msgRst) {
			var gridData = AlopexGrid.trimData($('#'+mTagetGrid).alopexGrid('dataGet', function(data) {
				if ((data.flag == 'ADD' || data.flag == 'DEL' ||data.flag == 'MOD') && (data._state.selected == true)) {
					data.tabIdx = mTagetIdx;
					return data;
				}
			}));

			if(gridData.length > 0) {
				$('#'+mTagetGrid).alopexGrid('showProgress');
				httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/std/saveEqpDivMgmtList', gridData, 'POST', 'afterSave');
			}else{
				callMsgBox('btnMsgWarning','W', '반영할 데이터가 없습니다.', btnMsgCallback);
			}
		}
	}

    // 조회용 파라메터 셋팅
    function getParamData(tab){
    	var param = {};

    	switch(tab){
    	case 0:	// 장비구분
    		param.eqpDivCd 		= $("#eqpDivCd0").val();
    		param.eqpDtlDivNm 	= $("#eqpDtlDivNm0").val();
    		param.dsnUnitNm 	= $("#dsnUnitNm0").val();
    		param.splyVndrNm 	= $("#splyVndrNm0").val();
    		param.matlCd 		= $("#matlCd0").val();
    		param.erpEqpDivCd 	= $("#erpEqpDivCd0").val();
    		param.rmkCtt 		= $("#rmkCtt0").val();
    		break;
    	case 1:	// 지역별 모델
    		param.tmofId		= $("#tmofId1").val();
    		param.eqpDivCd 		= $("#eqpDivCd1").val();
    		param.eqpDivNm 		= $("#eqpDivNm1").val();
    		param.splyVndrNm 	= $("#splyVndrNm1").val();
    		param.demdEqpMdlNm 	= $("#demdEqpMdlNm1").val();
    		param.rmkCtt 		= $("#rmkCtt1").val();
    		break;
    	case 2:	// 단가 정보
    		param.eqpDivCd 		= $("#eqpDivCd2").val();
    		param.eqpDtlDivNm 	= $("#eqpDtlDivNm2").val();
    		param.dsnUnitNm 	= $("#dsnUnitNm2").val();
    		param.matlCd 		= $("#matlCd2").val();
    		param.matlNm 		= $("#matlNm2").val();
    		param.rmkCtt 		= $("#rmkCtt2").val();
    		break;
		}

    	return param;
    }

    // 편집 이벤트 시 호출
	function setCellValueEditing(e){
		var ev = AlopexGrid.parseEvent(e);
		var dataObj = ev.data;
		var mapping = ev.mapping;

		if( mapping.key != "check" ){

			if($.TcpMsg.isEmpty(dataObj.flag)) {
				$('#'+mTagetGrid).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
			}

			$('#'+mTagetGrid).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);

			// 설계장비 구분 변경
//			if( mTagetGrid == gridTab1 && mapping.key == "eqpDtlDivNm" ){
//				var eqpDtlDivNm = dataObj._state.editing[dataObj._column];
//
//				Tango.ajax({
//		    		url : "tango-transmission-biz/transmission/configmgmt/eqpinvtdsnmgmt/rslt/getDsnUnitCode",
//		    		data : {eqpDivCd:eqpDtlDivNm}, //data가 존재할 경우 주입
//		    		method : 'GET', //HTTP Method
//		    		flag : ""
//		    	}).done(function(result) {
//		    		var data = result.returnData;
//
//	            	$('#'+mTagetGrid).alopexGrid("dataEdit", {
//	            		splyVndrCd 	: data.splyVndrCd,
//	            		splyVndrNm 	: data.splyVndrNm
//					}, {_index:{data : dataObj._index.row}});
//		    	}).fail(failCallback);
//			}
		}
    }

    // 유선망설계대상 ROW 삭제
	function setRowDelete(){
		var rowData = $('#'+mTagetGrid).alopexGrid('dataGet', {_state: {selected:true}});

		if (rowData.length == 0) {
			callMsgBox('','I', configMsgArray['selectNoData'], btnMsgCallback);
			return;
		}

		for(var i=0; i < rowData.length; i++){
			if (rowData[i].flag == 'ADD') {
				$('#'+mTagetGrid).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });

			} else if(rowData[i].flag == 'MOD' || $.TcpMsg.isEmpty(rowData[i].flag)) {
				$('#'+mTagetGrid).alopexGrid('cellEdit','DEL',{ _index : { data : rowData[i]._index.row } },'flag');
				$('#'+mTagetGrid).alopexGrid("dataDelete", { _index : { data : rowData[i]._index.row } });
			}
		}
    }

    function initGrid() {
	    // 장비구분 그리드 생성
	    $('#'+gridTab0).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			numberingColumnFromZero: false,
			leaveDeleted: true,
//			headerGroup: [
//							{fromIndex:'splyVndrNm', toIndex:'splyVndrCdIcon', title:"Vendor", hideSubTitle:true}
//			],
//			renderMapping:{
//				"splyVndrCdIcon" :{
//					renderer : function(value, data, render, mapping) {
//						var currentData = AlopexGrid.currentData(data);
//						return "<span class='Icon Search' style='cursor: pointer'></span>";
//					}
//				}
//			},
	    	columnMapping: [{
	    		key: 'check',
	    		align: 'center',
	    		width: '40px',
	    		selectorColumn : true
	    	}, {
    			align:'center',
				title : '순번',
				width: '50px',
				resizing : false,
				//excludeFitWidth : true,
				numberingColumn: true
			}, {
				key : 'dsnDivCd', align:'center',
				title : '<em class="color_red">*</em>설계대상',
				width: '100px',
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];
        				return render_data = render_data.concat( mEqpDivCmb );
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mEqpDivCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return editableChk(data);
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'eqpDtlDivNm', align:'center',
				title : '<em class="color_red">*</em>설계장비구분',
				width: '120px',
				editable : {type : "text", attr : {"maxlength" : 100}}
			}, {
				key : 'dsnUnitNm', align:'center',
				title : '<em class="color_red">*</em>설계장비단위(식/용량)',
				width: '120px',
				editable : {type : "text", attr : {"maxlength" : 33}}
			}
			/*, {
				key : 'splyVndrNm', align:'center',
				title : '제조사',
				width: '120px',
				editable: false
			}, {
				key : 'splyVndrCd', align:'center',
				title : '제조사',
				width: '120px',
				hidden : true
			}, {
				key     : 'splyVndrCdIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'splyVndrCdIcon'},
				resizing: false,
			}, {
				key : 'matlCd', align:'center',
				title : '자재코드',
				width: '120px',
				editable : {type : "text", attr : {"maxlength" : 10}}
			}*/
			, {
				key : 'erpEqpDivCd', align:'center',
				title : 'ERP장비구분코드',
				width: '150px',
				editable : {type : "text", attr : {"maxlength" : 10}}
			}, {
				key : 'rmkCtt', align:'center',
				title : '비고',
				width: '250px',
				editable: true
			}, {
				key : 'eqpDivCd', align:'center',
				title : '장비구분',
				width: '120px',
				hidden : true
			}, {
				key : 'basItmSeq', align:'center',
				title : '항복순번',
				width: '50px',
				hidden : true
			}, {
				key : 'flag', align:'center',
				title : '상태',
				width: '50px',
				hidden : true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    // 지역별 모델 그리드 생성
	    $('#'+gridTab1).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			numberingColumnFromZero: false,
			leaveDeleted: true,
			headerGroup: [
							{fromIndex:'splyVndrNm', toIndex:'splyVndrCdIcon', title:"제조사", hideSubTitle:true},
							{fromIndex:'matlSetNm', toIndex:'matlSetCdIcon', title:"자재SET", hideSubTitle:true}
			],
			renderMapping:{
				"splyVndrCdIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				},
				"matlSetCdIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				}
			},
	    	columnMapping: [{
	    		key: 'check',
	    		align: 'center',
	    		width: '40px',
	    		selectorColumn : true
	    	}, {
    			align:'center',
				title : '순번',
				width: '50px',
				resizing : false,
				//excludeFitWidth : true,
				numberingColumn: true
			}, {
				key : 'tmofId', align:'center', styleclass : 'font-blue', filter : {useRenderToFilter : true},
				title : '<em class="color_red">*</em>전송실',
				width: '100px',
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];
	                	if(fnCmdExisTence(value, mTmofCmb)){
	                		return render_data.concat( mTmofCmb );
	                	}else{
	                		data.tmofId = '';
	                		return render_data;
	                	}
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mTmofCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'dsnDivCd', align:'center',
				title : '<em class="color_red">*</em>설계대상',
				width: '100px',
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];
        				return render_data = render_data.concat( mEqpDivCmb );
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mEqpDivCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;//editableChk(data);
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'eqpDtlDivCd', align:'center',
				title : '<em class="color_red">*</em>설계장비구분',
				width: '120px',
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [];
	                	var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdEqpRoleDivCd(currentData.dsnDivCd);

	                	if(fnCmdExisTence(value, eqpCmb)){
	                		return render_data.concat( eqpCmb );
	                	}else{
	                		data.eqpDtlDivCd = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdEqpRoleDivCd(currentData.dsnDivCd);

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'dsnDivCd'
			}, {
				key : 'eqpDivCd', align:'center',
				title : '<em class="color_red">*</em>설계장비단위(식/용량)',
				width: '130px',
		    	render : { type: 'string',
		            rule: function (value, data){
	                	var render_data = [];
	                	var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdDsnEqpUnitCd(currentData.dsnDivCd, currentData.eqpDtlDivCd);

	                	if(fnCmdExisTence(value, eqpCmb)){
	                		//if(eqpCmb.length == 2){ data.eqpDivCd = eqpCmb[1].value; }
	                		return render_data.concat( eqpCmb );
	                	}else{
	                		data.eqpDivCd = '';
	                		return render_data;
	                	}
    				}
				},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [];
						var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdDsnEqpUnitCd(currentData.dsnDivCd, currentData.eqpDtlDivCd);

	                	return editing_data.concat( eqpCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : ['dsnDivCd','eqpDtlDivCd']
			}, {
				key : 'splyVndrNm', align:'center',
				title : '제조사',
				width: '120px',
				editable: false,
			}, {
				key : 'splyVndrCd', align:'center',
				title : '제조사',
				width: '120px',
				hidden : true,
			}, {
				key     : 'splyVndrCdIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'splyVndrCdIcon'},
				resizing: false,
			}, {
				key : 'demdEqpMdlNm', align:'center',
				title : '모델',
				width: '120px',
				editable : {type : "text", attr : {"maxlength" : 100}}
			}, {
				key : 'mdlCd', align:'center',
				title : '장비모델코드',
				width: '100px',
				hidden : true
			}, {
				key : 'matlSetNm', align:'center',
				title : '자재SET',
				width: '180px',
				editable: false,
			}, {
				key : 'matlSetCd', align:'center',
				title : '자재SET코드',
				width: '120px',
				hidden : true,
			}, {
				key     : 'matlSetCdIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'matlSetCdIcon'},
				resizing: false,
			}, {
				key : 'rmkCtt', align:'center',
				title : '비고',
				width: '250px',
				editable: true
			}, {
				key : 'mdlCd', align:'center',
				title : '장비모델코드',
				width: '100px',
				hidden : true
			}, {
				key : 'flag', align:'center',
				title : '상태',
				width: '50px',
				hidden : true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    // 자재정보 그리드 생성
	    $('#'+gridTab2).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
    		rowOption : {
     			defaultHeight : 'content'
     		},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			numberingColumnFromZero: false,
			leaveDeleted: true,
			headerGroup: [
							{fromIndex:'splyVndrNm', toIndex:'splyVndrCdIcon', title:"제조사", hideSubTitle:true}
			],
			renderMapping:{
				"splyVndrCdIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				}
			},
	    	columnMapping: [{
	    		key: 'check',
	    		align: 'center',
	    		width: '40px',
	    		selectorColumn : true
	    	}, {
    			align:'center',
				title : '순번',
				width: '50px',
				resizing : false,
				numberingColumn: true
			}, {
				key : 'matlInfCd', align:'center',
				title : '<em class="color_red">*</em>설계대상',
				width: '100px',
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];
        				return render_data = render_data.concat( mEqpDivCmb );
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mEqpDivCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;//editableChk(data);
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'eqpDtlDivCd', align:'center',
				title : '<em class="color_red">*</em>설계장비구분',
				width: '110px',
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [];
	                	var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdEqpRoleDivCd(currentData.matlInfCd);

	                	if(fnCmdExisTence(value, eqpCmb)){
	                		return render_data.concat( eqpCmb );
	                	}else{
	                		data.eqpDtlDivCd = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdEqpRoleDivCd(currentData.matlInfCd);

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'matlInfCd'
			}, {
				key : 'eqpDivCd', align:'center',
				title : '<em class="color_red">*</em>설계장비단위',
				width: '120px',
				editable : false,
		    	render : { type: 'string',
		            rule: function (value, data){
	                	var render_data = [];
	                	var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdDsnEqpUnitCd(currentData.matlInfCd, currentData.eqpDtlDivCd);

	                	if(fnCmdExisTence(value, eqpCmb)){
	                		//if(eqpCmb.length == 2){ data.eqpDivCd = eqpCmb[1].value; }
	                		return render_data.concat( eqpCmb );
	                	}else{
	                		data.eqpDivCd = '';
	                		return render_data;
	                	}
    				}
				},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [];
						var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdDsnEqpUnitCd(currentData.matlInfCd, currentData.eqpDtlDivCd);

	                	return editing_data.concat( eqpCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : ['matlInfCd','eqpDtlDivCd']
			}, {
				key : 'splyVndrNm', align:'center',
				title : '제조사',
				width: '100px',
				editable: false
			}, {
				key : 'splyVndrCd', align:'center',
				title : '제조사',
				width: '100px',
				hidden : true
			}, {
				key     : 'splyVndrCdIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'splyVndrCdIcon'},
				resizing: false,
			}, {
				key : 'matlCd', align:'center',
				title : '자재코드',
				width: '100px',
				editable: true
			}, {
				key : 'matlNm', align:'center',
				title : '자재명',
				width: '100px',
				editable : {type : "text", attr : {"maxlength" : 33}}
			}, {
				key : 'invtCostRmk', align:'left',
				title : '설계방식 비고',
				width: '280px',
			    editable : {
					type : 'textarea',
					styleclass : 'textarea-line-height'
				},
				render : function(value, data, render, mapping, grid){
					if(!$.TcpMsg.isEmpty(value)){
						return '<div class="gridtext-line-height">'+value.replace(/\n/g, '<br>')+'</div>'
					}
				},
			}, {
				key : 'mtrlCost', align:'right',
				title : '물자비',
				width: '90px',
				render: {type:"string", rule : "comma"},
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 22}, styleclass : 'num_editing-in-grid'}
			}, {
				key : 'cstrCost', align:'right',
				title : '공사비',
				width: '90px',
				render: {type:"string", rule : "comma"},
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 22}, styleclass : 'num_editing-in-grid'}
			}, {
				key : 'tangoMdlNm', align:'center',
				title : 'TANGO모델',
				width: '80px',
				editable : {type : "text", attr : {"maxlength" : 100}}
			}, {
				key : 'rmkCtt', align:'center',
				title : '비고',
				width: '200px',
				editable: true
			}, {
				key : 'basItmSeq', align:'center',
				title : '기본항목순번',
				width: '100px',
				hidden : true
			}, {
				key : 'flag', align:'center',
				title : '상태',
				width: '50px',
				hidden : true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    }

	// 편집가능여부 체크 추가된 행만 수정 가능
    function editableChk(data){
		var currentData = AlopexGrid.currentData(data);
		return (currentData.flag == "ADD"? true:false);
	}

    //request 호출
	function httpRequest(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

	//request 성공시.
	function successCallback(response, status, jqxhr, flag){

		switch(flag){
			case "dsnLgcCode":
				mEqpDivCmb = response.mainLgc

				var option_data =  [{cd: "", cdNm: "전체"}];
				for(var i=0; i<mEqpDivCmb.length; i++){
					option_data.push({cd: mEqpDivCmb[i].cd, cdNm: mEqpDivCmb[i].cdNm});
				}

				$('#eqpDivCd0').setData({data:option_data});
				$('#eqpDivCd1').setData({data:option_data});
				$('#eqpDivCd2').setData({data:option_data});

				//그리드 설정
				initData();
				break;
			case "search":
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				setSpGrid(mTagetGrid, response, response.eqpStdList);
				break;
			case 'afterSave':
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', configMsgArray[response.returnMessage],function(){
						if(mTagetIdx == 0){
					    	// 설대장비구분코드
					    	selectDemdEqpCode('demdEqpCd');

					    	// 설계장비단위코드
					    	selectDsnEqpUnitCode('dsnUnitCd');

							setFormData(1, perPage0);
						}else if(mTagetIdx == 1){
							setFormData(1, perPage1);
						}else if(mTagetIdx == 2){
							setFormData(1, perPage2);
						}
					});
				} else {
					callMsgBox('','W', configMsgArray[response.returnMessage], btnMsgCallback);
				}
				break;
			case 'tmofId1':
				mTmofCmb = response;
				var option_data =  [{cd: "", cdNm: "전체"}];
				for(var i=0; i<response.length; i++){
					option_data.push({cd: response[i].cd, cdNm: response[i].cdNm});
				}
				$('#tmofId1').setData({ data : option_data});
				break;
			case 'demdEqpCd':
				mDemdEqpCmb = response.demdEqpList;
				var option_data =  [{cd: "", cdNm: "전체"}];
				$('#eqpDtlDivNm2').setData({data:option_data});
				break;
			case 'dsnUnitCd':
				mEqpUnitCmb = response.unitList;
				break;
			case "excelDownloadOnDemand":
				$('#'+mTagetGrid).alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
				break;
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

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "eqpSearch":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
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

    // 그리드 수요장비 데이터 JSON
    function grdEqpRoleDivCd(value){
    	var returnDate 	= [{cd: "", cdNm: "전체",value: "", text: "선택"}];
    	var divCdList	= mDemdEqpCmb[value];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj	= {
					cd: divCdList[i].cd,
					cdNm: divCdList[i].cdNm,
					value: divCdList[i].cd,
					text: divCdList[i].cdNm
				};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    // 설계장비단위명 get
    function grdEqpDsnUnitNm(value1, value2){
    	var unitNm = '';
    	var divCdList	= mDemdEqpCmb[value1];

    	if(divCdList == undefined || divCdList == null || divCdList == "") return '';

    	for(var i = 0; i < divCdList.length; i++){
    		if(divCdList[i].cd == value2){
    			unitNm = divCdList[i].unit;
    		}
    	}

    	return unitNm;
    }

    // 자재코드 get
    function grdEqpDsnMatlCd(value1, value2){
    	var matlCd = '';
    	var divCdList	= mDemdEqpCmb[value1];

    	if(divCdList == undefined || divCdList == null || divCdList == "") return '';

    	for(var i = 0; i < divCdList.length; i++){
    		if(divCdList[i].cd == value2){
    			matlCd = divCdList[i].matlCd;
    		}
    	}

    	return matlCd;
    }

    // 설계장비단위 get
    function grdDsnEqpUnitCd(value1, value2){
    	var unitCmb = [{value: "", text: "선택"}];
    	var divCdList	= mDemdEqpCmb[value1];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

    	for(var i = 0; i < divCdList.length; i++){
    		if(divCdList[i].cd == value2){
        		var unitCd = divCdList[i].unitCd;

        		if(!$.TcpMsg.isEmpty(unitCd)){
        			var unitList = unitCd.split(",");

        			for(var j = 0; j < unitList.length; j++){
        				var eqpCd = value1 + unitList[j];

        				for(var k = 0; k < mEqpUnitCmb.length; k++){
        					if(mEqpUnitCmb[k].cd == eqpCd){
        						unitCmb.push({value: mEqpUnitCmb[k].cd, text: mEqpUnitCmb[k].cdNm});
        					}
        				}// k for문
        			} // j for문
        			break;
        		}
    		}
    	} // i for문

    	return unitCmb;
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