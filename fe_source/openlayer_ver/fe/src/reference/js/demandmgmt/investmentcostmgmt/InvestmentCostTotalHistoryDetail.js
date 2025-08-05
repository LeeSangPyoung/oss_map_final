/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 26. 오후 4:04:03
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    var gridDetailId = 'resultPopGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	console.log(id,param);
    	
    	initGrid();
    	setEventListener(param);
    };
    
    //Grid 초기화
    function initGrid() {
    	
    	var mapping = [
			//공통
			{ 
				key : "invtBdgtDtsSeq",
				align : "right",
				width : "55px",
				title : investMentCostTotalHistoryMsgArray['sequence']
			}
			, {
				key : 'creDt',
				align:'center',
				width:'100px',
				title : investMentCostTotalHistoryMsgArray['createDate']
			}
			, {
				key : 'mgmtHdofcNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalHistoryMsgArray['managementHeadOffice']
			}
			, {
				key : 'bizYr',
				align:'center',
				width:'80px',
				title : investMentCostTotalHistoryMsgArray['businessYear']
			}
			, {
				key : 'bizPurpNm',
				align:'left',
				width:'200px',
				title : investMentCostTotalHistoryMsgArray['businessPurpose']
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'150px',
				title : investMentCostTotalHistoryMsgArray['businessDivision']
			}
			, {
				key : 'invtDivNm',
				align:'left',
				width:'100px',
				title : investMentCostTotalHistoryMsgArray['invtDivNm']
			}
			, {
				key : 'chgAmt',
				align:'right',
				width:'100px',
				title : investMentCostTotalHistoryMsgArray['budgetAssignAmountWon']
			}
			, {
				key : 'frstRegUserId',
				align:'right',
				width:'100px',
				title : investMentCostTotalHistoryMsgArray['registrant']
			}
    	];
  		
        //그리드 생성
        $('#'+gridDetailId).alopexGrid({
        	//extend : ['resultPopGrid'],
        	height : 445,
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping
              ,message: {
  				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
  				filterNodata : 'No data'
  			}
        });
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
	
    function setEventListener(param) {
        
    	investmentCostTotalHistoryDetailRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/investmentcosttotalhistorydetaillist', param, 'GET', 'selectInvestmentCostTotalHistoryDetailList');
    	
     	// 취소
        $('#btnCancel').on('click', function(e) {
        	$a.close();
        });
	};

	//request
	function investmentCostTotalHistoryDetailRequest(surl,sdata,smethod,sflag)
    {
		//bodyProgress();
		//showProgress(gridDetailId);
		showProgress(gridDetailId);

    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successInvestmentCostTotalHistoryDetailCallback(response, sflag);})
    	  .fail(function(response){failInvestmentCostTotalHistoryDetailCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successInvestmentCostTotalHistoryDetailCallback(response, flag){
    	hideProgress(gridDetailId);
    	//bodyProgressRemove();
    	if(flag == 'selectInvestmentCostTotalHistoryDetailList'){
    		$('#'+gridDetailId).alopexGrid("dataSet", response.list);
    	}
    }
    
    //request 실패시.
    function failInvestmentCostTotalHistoryDetailCallback(serviceId, response, flag){
    	hideProgress(gridDetailId);
    	//bodyProgressRemove();
    	console.log(response);
    	alertBox('W',investMentCostTotalHistoryMsgArray['abnormallyProcessed']);
    }
});