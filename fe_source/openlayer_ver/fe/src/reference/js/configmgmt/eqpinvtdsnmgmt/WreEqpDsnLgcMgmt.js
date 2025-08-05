/**
 * WreEqpDsnLgcMgmt.js
 *
 * @author P182022
 * @date 2022. 08. 01. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
	var mSubTabArr		= [1,1,1,1,1,1,1,1,1,1];
	var mTabMainData 	= new Array(10);
	var mTabSubData 	= new Array(10);

	var sTmpUseYn  		= [{value: "Y",text: "Y"},{value: "N",text: "N"}];

   	var perPage 		= 100;

	var mTagetGrid 		= "gridData";

	// 선택된 탭 Index
	var mTabMainIdx		= 1;
	var mTabSubIdx		= 1;


	this.init = function(id, param) {

		// 2차원 배열 선언
		for( var i = 0 ; i < mTabSubData.length; i++){
			mTabSubData[i] = new Array(10);
		}

    	//설계로직 코드 조회
    	selectDsnLgcCode("dsnLgcCode");

    };

    function setEventListener() {
    	// 페이지 번호 클릭시
   	 	$('#'+mTagetGrid).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+mTagetGrid).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });

    	//엔터키로 조회
        $('#logicNm').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1, perPage);
      		}
    	 });

    	//엔터키로 조회
        $('#logicDtlNm').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1, perPage);
      		}
    	 });

    	// Main 탭변경 이벤트
    	$('#basicTabs').on("tabchange", function(e, index) {
    		mTabMainIdx = index + 1;

         	$('#'+mTagetGrid).alopexGrid('dataEmpty');

         	setFormData(1, perPage);
    	});

    	// Sub 탭변경 이벤트
    	for( var i = 1; i < 5; i++ ){
        	$('#tab'+i).on("tabchange", function(e, index) {

        		mTabSubIdx 	= index + 1;

        		mSubTabArr[mTabMainIdx-1] = mTabSubIdx;

             	$('#'+mTagetGrid).alopexGrid('dataEmpty');

             	setFormData(1, perPage);
        	});
    	}

        // 설계로직 검색
    	$("#btnSearch").on("click", function(e) {
    		setFormData(1, perPage);
    	});

        // 설계로직 행추가
    	$("#btnAddRow").on("click", function(e) {
    		setGridAddRow();
    	});

        // 설계로직 삭제
    	$("#btnDeleteRow").on("click", function(e) {
    		setGridRowDel();
    	});

        // 설계로직 저장
    	$("#btnSave").on("click", function(e) {
    		setEqpDsnSaveData();
    	});

    	// cell editing
    	$("#"+mTagetGrid).on("cellValueEditing", function(e) {
    		setCellValueEditing(e);
    	});

		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e);
		});

    	initGrid();

    	setFormData(1, perPage);

	}

    // 설계구분코드 조회
    function selectDsnLgcCode(objId) {
		var param = {};
		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', param, 'GET', objId);
	}

    // 조회
    function setFormData(page, rowPerPage) {
    	var param 			= getParamData();
    	param.pageNo 		= page;
    	param.rowPerPage 	= rowPerPage;

    	$('#'+mTagetGrid).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/lgc/getDsnLgcMgmtForPage', param, 'GET', 'search');
    }

    // grid add Row
    function setGridAddRow() {
		var option = {_index:{data : 0}};
		var initRowData = [{"flag" : "ADD",
			"mndtInsYn" : "Y",
			"useYn"		: "Y"
		}];

		// 행추가 및 추가행 선택
		$("#"+mTagetGrid).alopexGrid('dataAdd', initRowData, option);
		$("#"+mTagetGrid).alopexGrid('rowSelect', option, true);
    }

    // 저장
    function setEqpDsnSaveData() {
    	$('#'+mTagetGrid).alopexGrid('endEdit'); // 편집종료

		var gridData = AlopexGrid.trimData($('#'+mTagetGrid).alopexGrid('dataGet', { _state : { selected : true }}));
		if (gridData.length == 0) {// 선택한 데이터가 존재하지 않을 시
			callMsgBox('btnMsgWarning','W', configMsgArray['selectNoData'], btnMsgCallback);
			return;

		} else if(gridData.length > 0) {
			var runDivCd = mTabSubData[mTabMainIdx-1][mSubTabArr[mTabMainIdx-1]-1];
			if($.TcpMsg.isEmpty(runDivCd)){
				callMsgBox('btnMsgWarning','I', "서브 설계로직이 존재하지 않습니다.");
				return;
			}

			for (var i=0;i < gridData.length; i++) {
				var flag 		= gridData[i].flag;
				var execTurn 	= gridData[i].execTurn;

				if($.TcpMsg.isEmpty(execTurn) || execTurn < 0){
					callMsgBox('btnMsgWarning','I', "실행 순서를 입력 하십시오.");
					return false;
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
					data.dsnDivCd 	= mTabMainData[mTabMainIdx-1];
					data.runDivCd	= mTabSubData[mTabMainIdx-1][mSubTabArr[mTabMainIdx-1]-1];
					return data;
				}
			}));

			if(gridData.length > 0) {
				$('#'+mTagetGrid).alopexGrid('showProgress');
				httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/lgc/saveDsnLgcMgmtList', gridData, 'POST', 'afterSave');
			}else{
				callMsgBox('btnMsgWarning','W', '반영할 데이터가 없습니다.', btnMsgCallback);
			}
		}
	}

    // 조회용 파라메터 셋팅
    function getParamData(){
    	var param = {
    			dsnDivCd 	: mTabMainData[mTabMainIdx-1],
    			runDivCd 	: mTabSubData[mTabMainIdx-1][mSubTabArr[mTabMainIdx-1]-1],
    			workGrpNm 	: $("#logicNm").val(),
    			dtlDesc 	: $("#logicDtlNm").val()
    	};

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
		}
    }

    // 유선망설계기준 ROW 삭제
	function setGridRowDel(){
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
	    // 그리드 컬럼옵션 정의
	    var columnOption = {
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
		    	columnMapping: [
		    	{ key: 'check',align: 'center',width: '40px',selectorColumn : true},
		    	//{ align:'center',title : '순번',width: '50px', resizing : false, numberingColumn: true},
		    	{
					key : 'execTurn', align:'center',
					title : '<em class="color_red">*</em>실행 순서',
					width: '50px',
					editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 5}, styleclass : 'num_editing-in-grid'}
				}, {
					key : 'workGrpNm', align:'center',
					title : '로직 그룹',
					width: '100px',
					editable: true
				}, {
					key : 'condInfCtt', align:'center',
					title : '로직 정보',
					width: '200px',
					editable: true
				}, {
					key : 'dtlDesc', align:'left',
					title : '로직 상세 설명',
					width: '380px',
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
					key : 'optConnDesc', align:'center',
					title : '설계 옵션 설명',
					width: '80px',
					editable: true
				}, {
					key : 'dsnOptVal', align:'center',
					title : '옵션 기본 값',
					width: '80px',
					editable: true
				}, {
					key : 'mndtInsYn', align:'center',
					title : '필수 여부',
					width: '50px',
    		    	render : {  type: 'string', rule: function (value,data){ return sTmpUseYn; } },
					editable : { type: 'select', rule: function(value, data) { return sTmpUseYn; },
						attr : { style : "width: 46px;min-width:40px;padding: 2px 2px;"}
					},
				}, {
					key : 'useYn', align:'center',
					title : '사용 여부',
					width: '50px',
    		    	render : {  type: 'string', rule: function (value,data){ return sTmpUseYn; } },
					editable : { type: 'select', rule: function(value, data) { return sTmpUseYn; },
						attr : { style : "width: 46px;min-width:40px;padding: 2px 2px;"}
					},
				}, {
					key : 'dsnDivCd', align:'center',
					title : '설계구분코드',
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
				}, {
					key : 'flag', align:'center',
					title : '상태',
					width: '50px',
					hidden : true
				}],
				message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
	    };

	    //설계로직 그리드 초기화
	    $("#"+mTagetGrid).alopexGrid(columnOption);

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

	//request 성공시.
	function successCallback(response, status, jqxhr, flag){

		switch(flag){
			case "dsnLgcCode":
				for( var i = 0; i < response.mainLgc.length; i++){
					var data = response.mainLgc[i];
					mTabMainData[data.mainIdx-1] = data.cd;
				}

				for( var i = 0; i < response.subLgc.length; i++){
					var data = response.subLgc[i];
					mTabSubData[data.mainIdx-1][data.subIdx-1] = data.cd.substr(4,5);
				}
				// 설정
				setInitTabs(response);

				// 이벤트 등록
		    	setEventListener();
				break;
			case "search":
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				setSpGrid(mTagetGrid, response, response.eqpLgcList);
				break;
			case 'afterSave':
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', configMsgArray[response.returnMessage],function(){
						setFormData(1, perPage);
					});
				} else {
					callMsgBox('','W', configMsgArray[response.returnMessage], btnMsgCallback);
				}
				break;
			case "excelDownloadOnDemand":
				$('#'+mTagetGrid).alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
				break;
		}
    }

    // 탭 설정
    function setInitTabs(data) {
		var mainTabs 	= data.mainLgc;	// 상단탭 정보
		var subTabs 	= data.tabsLgc;	// 서브탭 정보

		// 상단 메인탭 및 서브탭 생성
		for( var i = 0; i < mainTabs.length; i++ ){
			var style		= "";
			var tabId 		= "tab" + (i+1);

			///////////////////////////////////////////////////////////
			// 상단탭 생성
			$("#basicTabs").addTab(mainTabs[i].cdNm, "#"+tabId);

			///////////////////////////////////////////////////////////
			// 서브탭 생성
			var subTabArry = subTabs[mainTabs[i].cd];

			for( var j = 0; j < subTabArry.length; j++){
				var subTabId = tabId + "_"+ (j+1);

				// 하단탭 생성
				$("#"+tabId).addTab(subTabArry[j].cdNm,"#"+subTabId);
			}
			// 서브텝 최초 위치 설정
			$("#"+tabId).setTabIndex(0,true);
		}

		// 상단텝 최초 위치 설정
		$("#basicTabs").setTabIndex(0,true);
	}

    // Grid에 Row출력
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

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(event){
		var gridData = $('#'+mTagetGrid).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var param = getParamData();

		param = gridExcelColumn(param, $('#'+mTagetGrid));
		param.pageNo = 1;
		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();

		var now = new Date();
		var fileName = '유선망설계로직_' + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = 'getTesEqpDsnLgcMgmtList';
		param.excelFlag = 'EqpDsnLgcMgmtList';
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
				&& gridHeader[i].key != 'check')) {
				var title = gridHeader[i].title.replace('<em class="color_red">*</em>','');
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ';';
				excelHeaderNm += title;
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