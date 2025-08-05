/**
 * WreEqpRsltBizPurpStcPop.js
 * 
 * @author P182022
 * @date 2022. 10. 25. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
   	var perPage 	= 100;
   	var gridId		= "dataGrid";

   	var mHdofcCmb 	= [];
   	var mAfeYr		= "";
   	var mAfeDemdDgr	= "";
   	
    this.init = function(id, param) {
    	mAfeYr		= param.afeYr;
    	mAfeDemdDgr	= param.afeDemdDgr;
    	
    	//AFE 연차
    	selectAfeYrCode('afeYr');
    	//본부코드
    	selectHdofcCode('hdofcCd');

    	setEventListener();
    	
    	// 그리드 생성
    	initGrid();
    };
            
    // 이벤트 설정
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
        
        // 조회
        $("#btnSearch").on("click", function(e) {
    		setFormData(1, perPage);
    	});
    	
    	//닫기
		$('#btnDtlCncl').on('click', function(e) {
			$a.close();
		});
		
        //AFE 차수
    	$("#afeYr").on("change", function(e) {
    		mAreaYear1 = $("#afeYr").val();
        	if(mAreaYear1 == ''){
        		$("#afeDemdDgr").empty();
    			$("#afeDemdDgr").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};
	        	
	        	selectAfeDemdDgrCode('afeDemdDgr', dataParam);
        	}
    	});
    	
		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	//btnExportExcelOnDemandClickEventHandler(e);
    		var gridData = $('#'+gridId).alopexGrid('dataGet');
    		if (gridData.length == 0) {
    			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
    				return;
    		}

    		var param = $("#searchForm").getData();
        	
    		var now = new Date();
    		var excelFileName = "사업목적통계_" + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
    		var worker = new ExcelWorker({
        		excelFileName : excelFileName,
        		palette : [{
        			className : 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className : 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '사업목적통계',
        			$grid: $('#dataGrid')
        		}]
        	});
        	worker.export({
        		merge: false,
        		exportHidden: false,
        		useGridColumnWidth : true,
        		border  : true,
        		exportNumberingColumn : true
        	});
		});
        
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
		
		param = gridExcelColumn(param, $('#'+gridId));
		param.pageNo = 1;
		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();
		
		var now = new Date();
		var fileName = '사업목적통계_' + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = 'getEqpRsltBizPurpStc';
		param.excelFlag = 'EqpRsltBizPurpStc';
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

    //Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
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
			headerGroup: [
    	        			{fromIndex:2, toIndex:5, title:'합 계'},
    	        			{fromIndex:6, toIndex:9, title:'수도권'},
    	        			{fromIndex:10, toIndex:13, title:'동부'},
       	        			{fromIndex:14, toIndex:17, title:'서부'},
       	        			{fromIndex:18, toIndex:21, title:'중부'}
			],
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : '순번',
				width: '50px',
				numberingColumn: true
			}, {
				key : 'demdBizDivNm', align:'center',
				title : '사업목적',
				width: '100px',
			}, {
				key : 'totMtrlCost', align:'right',
				title : '물자비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'totCstrCost', align:'right',
				title : '공사비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'totLnInvtCost', align:'right',
				title : '선로투자비',
				width: '90px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'totSumrCost', align:'right',
				title : '합계',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'sudoMtrlCost', align:'right',
				title : '물자비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'sudoCstrCost', align:'right',
				title : '공사비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'sudoLnInvtCost', align:'right',
				title : '선로투자비',
				width: '90px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'sudoSumrCost', align:'right',
				title : '합계',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'dongbuMtrlCost', align:'right',
				title : '물자비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'dongbuCstrCost', align:'right',
				title : '공사비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'dongbuLnInvtCost', align:'right',
				title : '선로투자비',
				width: '90px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'dongbuSumrCost', align:'right',
				title : '합계',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'seobuMtrlCost', align:'right',
				title : '물자비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'seobuCstrCost', align:'right',
				title : '공사비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'seobuLnInvtCost', align:'right',
				title : '선로투자비',
				width: '90px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'seobuSumrCost', align:'right',
				title : '합계',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'jungbuMtrlCost', align:'right',
				title : '물자비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'jungbuCstrCost', align:'right',
				title : '공사비',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'jungbuLnInvtCost', align:'right',
				title : '선로투자비',
				width: '90px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'jungbuSumrCost', align:'right',
				title : '합계',
				width: '70px',
				render: {type:"string", rule : "comma"}
			}, {
				key : 'demdBizDivCd', align:'center',
				title : '사업목적코드',
				width: '70px',
				hidden : true
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

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getEqpRsltBizPurpStcForPage', param, 'GET', 'search');
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
			case "search":
				$('#'+gridId).alopexGrid('hideProgress');
				setSpGrid(gridId, response, response.dataList);
				break;
			case 'afeYr':
				$('#afeYr').clear();
				var option_data =  [];
				var stdAfeYr = "";
				var paramAfeYr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeYr) {
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

				$('#afeYr').setData({data:option_data,afeYr:selectId});
				selectAfeDemdDgrCode('afeDemdDgr', {afeYr:selectId});
				break;
			case 'afeDemdDgr':
				$('#afeDemdDgr').clear();
				var option_data =  [];
				var stdDemdDgr = "";
				var paramDemdDgr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeDemdDgr) {
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
				$('#afeDemdDgr').setData({data:option_data,afeDemdDgr:selectId});
				
				setTimeout(function() {
					// 통계조회
					setFormData(1, perPage);
				}, 500);				
				break;
			case 'hdofcCd':
				mHdofcCmb =  [{value: "", text: "전체"}];
				for(var i=0; i<response.length; i++){
					var resObj 		= {value: response[i].cd, text: response[i].cdNm};

					mHdofcCmb.push(resObj);
				}
				
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
				$('#'+gridId).alopexGrid('hideProgress');
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
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