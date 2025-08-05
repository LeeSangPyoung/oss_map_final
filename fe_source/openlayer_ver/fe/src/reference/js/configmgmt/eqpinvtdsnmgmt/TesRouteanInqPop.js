/**
 * MtsoCardPortUsePop.js
 *
 * @author Administrator
 * @date 2023. 6. 8
 * @version 1.0
 */
var popUp = $a.page(function() {

	var gridId1 = 'dataGrid1';
	var gridId2 = 'dataGrid2';
	var gridId3 = 'dataGrid3';
	var exeGridId = null;
	var paramData = null;
	var dtlData = {};

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	$('#pageNo').val(1);
    	$('#rowPerPage').val(100);

    	var option_data = [{cd : '', cdNm : '전체'}, {cd : '진행중', cdNm : '진행중'},{cd : '완료', cdNm : '완료'},{cd : '실패', cdNm : '실패'}];
    	$('#progStatVal').setData({ data : option_data, option_selected: '' });

    	setDate();
    	initGrid();

    	setEventListener();
    };

	function setDate() {
    	var date = new Date();
    	var end = new Date(Date.parse(date)-0*1000*60*60*24);

    	var yyyyend = end.getFullYear();
    	var mmend   = end.getMonth()+1;
    	var ddend   = end.getDate();

    	if(mmend < 10){
    		mmend = "0"+mmend;
    	}
    	if(ddend < 10){
    		ddend = "0"+ddend;
    	}

    	var endFullDate = yyyyend+"-"+mmend+"-"+ddend;

    	var start = new Date(Date.parse(date)-30*1000*60*60*24);

    	var yyyystart = start.getFullYear();
    	var mmstart   = start.getMonth()+1;
    	var ddstart   = start.getDate();

    	if(mmstart < 10){
    		mmstart = "0"+mmstart;
    	}
    	if(ddstart < 10){
    		ddstart = "0"+ddstart;
    	}

    	var startFullDate = yyyystart+"-"+mmstart+"-"+ddstart

    	$('#searchStartDate').val(startFullDate);
    	$('#searchEndDate').val(endFullDate);
    	$('#srcReqIdVal').val(paramData.srcReqIdVal);

    }

    function initGrid(){
		//그리드 생성
		$('#'+gridId1).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height : '5row',
			autoResize: true,
			numberingColumnFromZero: false,
			columnMapping: [
				{/* 요청번호			*/
					key : 'raReqId', align : 'center',
					title : '경로분석ID',
					width : '80'
				}, {/*경로분석요청명			*/
					key : 'raReqNm', align:'center',
					title : '경로분석명',
					width: '150',
				}, {/* 경로건수			*/
					key : 'pathCnt', align : 'center',
					title : '분석건수',
					width : '50'
				}, {/* 진행상태			*/
					key : 'progStatVal', align : 'center',
					title : '진행상태',
					width : '50'
				}, {/* 로그메시지내용			*/
					key : 'logMsgCtt', align:'center',
					title : '실행로그',
					width: '70'
				}, {/* 요청자			*/
					key : 'reqUserNm', align:'center',
					title : '작업자',
					width: '40'
				}, {/* 요청구분			*/
					key : 'reqType', align:'center',
					title : '요청구분',
					width: '80'
				}, {/* 요청구분			*/
					key : 'srcReqIdVal', align:'center',
					title : '원천요청ID',
					width: '80'
				}, {/* 요청일자			*/
					key : 'reqDtm', align:'center',
					title : '요청일자',
					width: '80'
				}, {/* 완료일자		 	*/
					key : 'compDtm', align:'center',
					title : '완료일자',
					width: '80'
				}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
		});

    	$('#'+gridId2).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height : '5row',
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
			columnMapping: [
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
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    	$('#'+gridId3).alopexGrid({
			paging : {
				pagerSelect: [100,300,500,1000,5000],
				hidePageList: false  // pager 중앙 삭제
			},
			height : '5row',
			autoResize: true,
			numberingColumnFromZero: false,
			columnMapping: [
				{/* 경로분석요청순번			*/
					key : 'raLinkSeq', align : 'center',
					title : '순번',
					width : '40'
				}, {/* 관리번호			*/
					key : 'cblMgmtNo', align:'center',
					title : '관리번호',
					width: '130',
				}, {/*  T/B 구분	*/
					key : 'systmClCdNm', align:'center',
					title : 'T/B 구분',
					width: '90'
				}, {/*  코어용량	*/
					key : 'cblCoreCnt', align:'right',
					title : '코어용량',
					width: '90'
				}, {/*  사용코어수	*/
					key : 'useCoreCnt', align:'right',
					title : '사용코어수',
					width: '90'
				}, {/*  접속코어수	*/
					key : 'cnntCoreCnt', align:'right',
					title : '접속코어수',
					width: '100'
				}, {/*  잔여코어수	*/
					key : 'remCoreCnt', align:'right',
					title : '잔여코어수',
					width: '100'
				}, {/*  코어사용률 	*/
					key : 'coreUseRate', align : 'right',
					title : '코어사용률',
					width : '100'
				}, {/*  매설위치	*/
					key : 'cblUngrLocCdNm', align : 'center',
					title : '매설위치',
					width : '100'
				}, {/*  시설물SK관리번호(fcltSkMgmtNo) 	  */
					key : 'cblSkMgmtNo', align : 'center',
					title : '시설물SK관리번호',
					width : '120'
				}, {/*  시설물고유관리번호(fcltUnqMgmtNo)  	*/
					key : 'cblUnqMgmtNo', align : 'center',
					title : '시설물고유관리번호',
					width : '180'
				}, {/*  망종류	*/
					key : 'netClCdNm', align : 'center',
					title : '망종류',
					width : '100'
				}, {/*  길이(m)	*/
					key : 'cmplDistm', align : 'right',
					title : '길이(m)',
					width : '100'
				}, {/*  공사번호	*/
					key : 'cstrCd', align : 'left',
					title : '공사번호',
					width : '130'
				}, {/* 경로분석요청ID			*/
					key : 'raReqId', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}, {/* 경로분석요청순번			*/
					key : 'raReqSeq', align : 'center',
					title : '',
					width : '60',
					hidden: true
				}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    	setFormExcData(1, $('#rowPerPage').val());
    }

    function setEventListener(){
    	var perPage = 100;

    	// 페이지 번호 클릭시
   	 	$('#'+gridId1).on('pageSet', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	setFormExcData(obj.page, obj.pageinfo.perPage);
        });

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId1).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			setFormExcData(1, eObj.perPage);
		});

    	// 페이지 번호 클릭시
   	 	$('#'+gridId2).on('pageSet', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	reqDtlSetGrid(dtlData, obj.page, obj.pageinfo.perPage);
        });

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId2).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			reqDtlSetGrid(dtlData, 1, eObj.perPage);
		});

    	// 페이지 번호 클릭시
   	 	$('#'+gridId3).on('pageSet', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	pthDtlSetGrid(dtlData, obj.page, obj.pageinfo.perPage);
        });

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId3).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			pthDtlSetGrid(dtlData, 1, eObj.perPage);
		});

    	//경로분석요청명 엔터키로 조회
        $('#raReqNm').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormExcData(1,perPage);
      		}
        });

    	//요청자 엔터키로 조회
        $('#reqUserNm').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormExcData(1,perPage);
      		}
        });

    	//요청구분 엔터키로 조회
        $('#raReqDivVal').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormExcData(1,perPage);
      		}
        });

    	//요청번호 엔터키로 조회
        $('#srcReqIdVal').on('keydown', function(e){
    		if (e.which == 13  ){
    			dtlData = {};
    			setFormExcData(1,perPage);
      		}
        });

        $('#btnSearch').on('click', function(e) {
			if($('#searchStartDate').val() > $('#searchEndDate').val()) {
    			callMsgBox('','I', '종료일이 시작일보다 작습니다. 일자를 다시 입력해 주세요.', function(msgId, msgRst){});
  	     		return;
    		}

			dtlData = {};
			setFormExcData(1,perPage);
        });

        $('#btnSearch2').on('click', function(e) {
			var perPage = 100;
			var param =  $("#searchForm").getData();

			if(Object.keys(dtlData).length <= 0) {
				callMsgBox('','I', '검색할 데이터가 없습니다.', function(msgId, msgRst){});
  	     		return;
			}

			dtlData.uprMtsoIdNm = param.uprMtsoIdNm;
			dtlData.lowMtsoIdNm = param.lowMtsoIdNm;

			$('#'+gridId3).alopexGrid('dataEmpty');

			reqDtlSetGrid(dtlData, 1, perPage);
        });

        // 상위국 엔터키로 조회
        $('#uprMtsoIdNm').on('keydown', function(e){
    		if (e.which == 13  ){
    			var perPage = 100;
    			var param =  $("#searchForm").getData();

    			if(Object.keys(dtlData).length <= 0) {
    				callMsgBox('','I', '검색할 데이터가 없습니다.', function(msgId, msgRst){});
      	     		return;
    			}

    			dtlData.uprMtsoIdNm = param.uprMtsoIdNm;
    			dtlData.lowMtsoIdNm = param.lowMtsoIdNm;

    			$('#'+gridId3).alopexGrid('dataEmpty');

    			reqDtlSetGrid(dtlData, 1, perPage);
      		}
        });

        // 하위국 엔터키로 조회
        $('#lowMtsoIdNm').on('keydown', function(e){
    		if (e.which == 13  ){
    			var perPage = 100;
    			var param =  $("#searchForm").getData();

    			if(Object.keys(dtlData).length <= 0) {
    				callMsgBox('','I', '검색할 데이터가 없습니다.', function(msgId, msgRst){});
      	     		return;
    			}

    			dtlData.uprMtsoIdNm = param.uprMtsoIdNm;
    			dtlData.lowMtsoIdNm = param.lowMtsoIdNm;

    			$('#'+gridId3).alopexGrid('dataEmpty');

    			reqDtlSetGrid(dtlData, 1, perPage);
      		}
        });

		// 경로분석요청기본 내역 클릭
		$('#'+gridId1).on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var perPage = 100;
			dtlData = {raReqId: dataObj.raReqId};

			$('#'+gridId2).alopexGrid('dataEmpty');
			$('#'+gridId3).alopexGrid('dataEmpty');

			reqDtlSetGrid(dtlData, 1, perPage);
		});

		// 경로분석요청기본 내역 클릭
		$('#'+gridId2).on('click', '.bodycell', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var perPage = 100;
			dtlData = {raReqId: dataObj.raReqId,raReqSeq: dataObj.raReqSeq};
			$('#'+gridId3).alopexGrid('dataEmpty');

			pthDtlSetGrid(dtlData, 1, perPage);
		});

		// 하위국 Icon 클릭
		$('#'+gridId2).on('click', '.bodycell', function(e){
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridId2).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			if(rowData._key == "lowMtsoIcon"){
				// 하위국팝업 호출
				//alertBox('I', '하위국 화면 호출 예정');
				// 하위국팝업 호출
				callEngMapPopup(gridId2, dataObj, rowData._key);
			}
		});

        // 경로요청 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler('reqBas', e);
        });

        // 경로분석 엑셀 다운로드
        $('#btnReqDtlDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler('reqDtl', e);
        });

        // 경로상세엑셀 다운로드
        $('#btnPthDtlDown').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler('pathDtl', e);
        });

        //ENG맵 조회
        $('#btnEngMap').on('click', function(e) {
        	callEngMapPopup(gridId2, "", "");
        });
    }

	//2024 유선엔지니어링(TES) 고도화 추가 - 유선엔지니어링 맵 호출
    function callEngMapPopup(gridId, dataObj, flag){
    	let paramData = {};
    	paramData.gridId = "TesRouteanInqPop"; //호출 경로 - TES 경로 조회

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
			paramData.raReqIds = Object.keys(uniqueRaReqIdArr).map(function(i){
				return raReqIdArr[i]
			}).join(",");
			paramData.raReqSeqs = Object.keys(uniqueRaReqSeqArr).map(function(i){
				return raReqSeqArr[i]
			}).join(",");

    	} else {
    		paramData.raReqId = dataObj.raReqId; // 요청ID값
    		paramData.raReqSeq = dataObj.raReqSeq;  // 요청순번값
    	}

    	var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;

    	$a.popup({
    		popid: tmpPopId,
    		title: '유선 엔지니어링 맵',
    		url: '/tango-transmission-web/trafficintg/engineeringmap/EngMap.do',
    		data: paramData,
    		windowpopup : true,
    		modal: false,
    		movable:false,
    		width : window.opener.innerWidth,
        	height : window.opener.innerHeight,
    		callback: function(data) {
    		}
    	});
    }

    function setFormExcData(page, rowPerPage){
    	$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);
		$('#'+gridId2).alopexGrid('dataEmpty');
		$('#'+gridId3).alopexGrid('dataEmpty');

		var param =  $("#searchForm").serialize();
		// 유선설계경로분석요청기본 조회
		$('#'+gridId1).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getRequestList', param, 'GET', 'search');
	}

	function reqDtlSetGrid(parameter, page, rowPerPage){
		var pageParam = {};

		pageParam.pageNo = page;
		pageParam.rowPerPage = rowPerPage;
		pageParam.raReqId = parameter.raReqId;
		pageParam.uprMtsoIdNm = parameter.uprMtsoIdNm;
		pageParam.lowMtsoIdNm = parameter.lowMtsoIdNm;

		var param = $.param(pageParam);
		// 유선설계경로분석요청상세 조회
		$('#'+gridId2).alopexGrid('showProgress');

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getRouteReqDtlList', param, 'GET', 'reqDtlSearch');
	}


	function pthDtlSetGrid(parameter, page, rowPerPage){
		var pageParam = {};

		pageParam.pageNo = page;
		pageParam.rowPerPage = rowPerPage;
		pageParam.raReqId = parameter.raReqId;
		pageParam.raReqSeq = parameter.raReqSeq;

		var param = $.param(pageParam);

		$('#'+gridId3).alopexGrid('showProgress');
		// 유선설계경로분석경로상세 조회
		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/dsn/getRoutePathDtlList', param, 'GET', 'pthDtlSearch');
	}

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(type, event){

		var excelGridId = '';
		var excelMethod = "";
		var excelFlag = "";
		var fileName = "";

		var now = new Date();

		if (type == 'reqBas') {
			excelGridId = gridId1;
			excelMethod = 'getTesRequestListExcel';
			excelFlag = 'RequestListExcel';
			fileName = '경로분석요청' + '_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		} else if (type == 'reqDtl') {
			excelGridId = gridId2;
			excelMethod = 'getTesRouteReqDtlListExcel';
			excelFlag = 'RouteReqDtlListExcel';
			fileName = '경로분석결과' + '_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		} else if (type == 'pathDtl') {
			excelGridId = gridId3;
			excelMethod = 'getTesRoutePathDtlListExcel';
			excelFlag = 'RoutePathDtlListExcel';
			fileName = '경로상세' + '_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		}

		var gridData = $('#'+excelGridId).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('경로분석상세','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var param =  $("#searchForm").getData();

		param = gridExcelColumn(param, $('#'+excelGridId));
   		param.pageNo = 1;
   		param.rowPerPage = 10;
   		param.firstRowIndex = 1;
   		param.lastRowIndex = 1000000000;
   		param.inUserId = $('#sessionUserId').val();

       	// 엑셀 정보
		param.raReqId = dtlData.raReqId;
		param.raReqSeq = dtlData.raReqSeq;
		param.uprMtsoIdNm = dtlData.uprMtsoIdNm;
		param.lowMtsoIdNm = dtlData.lowMtsoIdNm;
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod =excelMethod;
		param.excelFlag = excelFlag;
		fileNameOnDemand = fileName + '.xlsx';

		console.log('name : ', fileName);

		exeGridId = excelGridId;
		$('#'+excelGridId).alopexGrid('showProgress');
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

    function setGrid(gridId, Option, Data) {

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);
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

	//request 호출
    var httpRequest = function(Url, Param, Method, Flag) {

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
		// 유선설계경로분석요청기본 조회 시
		case "search":
			$('#'+gridId1).alopexGrid('hideProgress');
			setGrid(gridId1, response, response.dataList);
			break;
		// 설계 내역 조회시
		case "reqDtlSearch":
			$('#'+gridId2).alopexGrid('hideProgress');
			setGrid(gridId2, response, response.dataList);
			break;
		case "pthDtlSearch":
			$('#'+gridId3).alopexGrid('hideProgress');
			setGrid(gridId3, response, response.dataList);
			break;
		case "excelDownloadOnDemand":
			$('#'+exeGridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
			break;
		}
    }

    //request 실패시.
    function failCallback(response, status, flag, jqxhr ){
		if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
    }
});