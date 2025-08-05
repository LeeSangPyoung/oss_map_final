/**
 * InvestmentCostMgmt
 *
 * @author P095781
 * @date 2016. 9. 2. 오후 1:40:00
 * @version 1.0
 */

$a.page(function() {
    
	//그리드 ID
    var gridId = 'resultGrid';
    //replaceAll prototype 선언
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	//console.log(id,param);

        initGrid();
    	setCombo();
    	setEventListener();
    };

  	//Grid 초기화
    function initGrid() {
    	var mapping =  [
			//공통
			{
				selectorColumn : true,
				width : "30px" 
			}
			, {
				key : 'bizYr',
				align:'center',
				width:'100px',
				title : investmentCostTotalMsgArray['businessYear']
			}
			, {
				key : 'mgmtHdofcNm',
				align:'left',
				width:'100px',
				title : investmentCostTotalMsgArray['headOfficeName']
			}
			, {
				key : 'bizPurpNm',
				align:'left',
				width:'200px',
				title : investmentCostTotalMsgArray['businessPurpose']
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'100px',
				title : investmentCostTotalMsgArray['businessDivision']
			}
			, {
				key : 'bdgtAsgnAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalMsgArray['budgetAssignAmountWon'],
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'efdgAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalMsgArray['enforcementDesignAmountWon'],
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'setlAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalMsgArray['settlementOfAccountsAmountWon'],
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'avlbBdgtAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalMsgArray['availableBudgetAmountWon'],
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'execRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalMsgArray['execRate']
			}
    	];
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping
            ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
        $('#'+gridId).on("dblclick", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;
        	//console.log("데이터!!!");
        	//console.log(param);
        	
        	investMentCostTotalHistoryDetail(param);
        	
        });
    };
    
    function setCombo() {
    	/*selectComboCode('mgmtHdofcCd', 'Y', 'C00109', '');*/
    	selectOrgListCode('mgmtHdofcCd');
    	selectAfeYearCode('bizYr', 'NS', '');
    }
    
    function setEventListener() {
        // 검색
        $('#search').on('click', function(e) {
        	
        	if($("#bizYr").val() == "") {
        		alertBox('W',investmentCostTotalMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	showProgress(gridId);
        	//console.log(dataParam);
        	
        	InvestmentCostTotalRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/investmentcosttotallist', dataParam, 'GET', 'investmentCostTotalList');
        });
        
        //엑셀다운로드
        $('#excelDown').on('click', function(e) {
        	if($("#bizYr").val() == "") {
        		alertBox('W',investmentCostTotalMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	
        	dataParam = gridExcelColumn(dataParam, gridId);
        	
        	dataParam.fileName = "투자예산집계";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "InvestmentCostTotal";
        		
        	//console.log(dataParam);
        	bodyProgress();

        	InvestmentCostTotalRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
        
        $('#bizYr').on('change', function(e) {
        	if($('#bizYr').val() != "") {
        		selectBizPurpCd("bizPurpCd", $('#bizYr').val());
        		selectBizDivCd("bizDivCd", ' ', ' ');
        	}
        	else {
        		selectBizPurpCd("bizPurpCd", ' ');
        		selectBizDivCd("bizDivCd", ' ', ' ');
        	}
        });
        
        $('#bizPurpCd').on('change', function(e) {
        	if($('#bizPurpCd').val() != "") {
        		selectBizDivCd("bizDivCd", $('#bizYr').val(), $('#bizPurpCd').val());
        	}
        });
	};

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
	
	//request
	function InvestmentCostTotalRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successInvestmentCostTotalCallback(response, sflag);})
    	  .fail(function(response){failInvestmentCostTotalCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successInvestmentCostTotalCallback(response, flag){

    	hideProgress(gridId);
    	bodyProgressRemove();

    	if(flag == 'investmentCostTotalList'){
    		//console.log(response);
    		$('#'+gridId).alopexGrid("dataSet", response.list);
    		//$("#total").html(response.totalCnt);	
    	}
    	else if(flag == 'excelDownload') {
    		//console.log('excelCreate');
    		//console.log(response);
    		
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
    	}
    }
    
    //request 실패시.
    function failInvestmentCostTotalCallback(serviceId, response, flag){
    	//console.log(response);
    	hideProgress(gridId);
    	bodyProgressRemove();
    	alertBox('W',investmentCostTotalMsgArray['abnormallyProcessed']);
    }
    
function investMentCostTotalHistoryDetail(dataParam){
    	
    	$a.popup({
    		popid : 'InvestMentCostTotalHistoryDetail',
    		url : 'InvestMentCostTotalHistoryDetail.do',
    		data : dataParam,
    		iframe : true,
    		modal : true,
    		width : 1060,
    		height : 550,
    		title : investmentCostTotalMsgArray['investBudgetHistory'],
    		movable : true,
    		callback : function(data){

    		}
    	});
    }
});