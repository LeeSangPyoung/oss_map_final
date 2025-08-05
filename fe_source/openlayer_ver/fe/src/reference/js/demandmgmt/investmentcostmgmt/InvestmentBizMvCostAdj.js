/**
 * InvestmentCostMgmt
 *
 * @author P095781
 * @date 2016. 8. 18. 오전 11:07:00
 * @version 1.0
 */

$a.page(function() {
    
	//그리드 ID
    var gridId = 'resultGrid';
    
    this.init = function(id, param) {
        initGrid();
    	setEventListener();
    	
    	var res = $('#adtnAttrVal').val();
    	
    	if (nullToEmpty(res).indexOf('RL35525851') > 0){
    		$('#search').setEnabled(true);
    	}
    	else{
    		$('#search').setEnabled(false);
    		$('#btnAdjustCost').hide();
    	}
    };

  	//Grid 초기화
    function initGrid() {
    	var mapping =  [
			//공통
			{
				key : 'check',
				align:'center',
				width:'50px',
				title : '순번',
				numberingColumn : true
			}
			,
			{
				key : 'orgNm',
				align:'left',
				width:'120px',
				title : '조직이름'
			}
			,
			{
				key : 'bizYr',
				align:'center',
				width:'80px',
				title : investmentCostMgmtMsgArray['businessYear'] /*사업년도*/
			}
			, {
				key : 'bizPurpNm',
				align:'left',
				width:'100px',
				title : investmentCostMgmtMsgArray['businessPurpose'] /*사업목적*/
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'150px',
				title : investmentCostMgmtMsgArray['businessDivision'] /*사업 구분명*/
			}
			, {
				key : 'dmdbdgtAsgnAmt',
				align:'right',
				width:'150px',
				title : '수요' + investmentCostMgmtMsgArray['budgetAssignAmountWon'],
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'demandefdgAmt',
				align:'right',
				width:'150px',
				title : '수요실시설계금액',
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'demandsetlAmt',
				align:'right',
				width:'150px',
				title : '수요정산금액',
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'dmdavlbBdgtAmt',
				align:'right',
				width:'150px',
				title : '수요가용예산금액',
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'crstefdgAmt',
				align:'right',
				width:'150px',
				title : '구축실시설계금액',
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'crstsetlAmt',
				align:'right',
				width:'150px',
				title : '구축정산금액',
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'crstavlbBdgtAmt',
				align:'right',
				width:'150px',
				title : '구축가용예산금액',
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'efdgAmtDiff',
				align:'right',
				width:'150px',
				title : '실시설계차이',
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'avlbBdgtAmt',
				align:'right',
				width:'150px',
				title : '가용예산차이',
				render: {type:"string", rule : "comma"}
			}
    	];
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
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
    };
 
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    function setEventListener() {
        // 검색
        $('#search').on('click', function(e) {
        	
        	showProgress(gridId);
        	
        	InvestmentCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/selectAdjustList', null, 'GET', 'selectAdjustList');
        }); 
        
        // 보정
        $('#btnAdjustCost').on('click', function(e) {
        	var data = $('#'+gridId).alopexGrid('dataGet');
        	
        	callMsgBox('','C', '저장하시겠습니까?', function(msgId, msgRst){  
        		if (msgRst == 'Y') {
        			if(data.length == 0){
        	   			alertBox('W','조회된 데이터가 없습니다.');
        	   			return;
        	   		}
                	showProgress(gridId);
                	
                	InvestmentCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/AdjustCostAll', null, 'GET', 'AdjustCostAll');
        		}
        	});
        });  
	};
	
	//request
	function InvestmentCostMgmtRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successInvestmentCostMgmtCallback(response, sflag);})
    	  .fail(function(response){failInvestmentCostMgmtCallback(response, sflag);})
    }
	
	//request 성공시
    function successInvestmentCostMgmtCallback(response, flag){

    	hideProgress(gridId);
    	bodyProgressRemove();

    	if(flag == 'selectAdjustList'){
    		$('#'+gridId).alopexGrid("dataSet", response.list);
    	}
    	else if(flag == 'AdjustCostAll'){
    		console.log(response)
    		if(response.result == 1)
    			alertBox('W','정상 처리되었습니다.');
    		else if(response.result == 0){
    			alertBox('W','업데이트 건수가 없습니다.');
    		}
    		else{
    			alertBox('W',investmentCostMgmtMsgArray['abnormallyProcessed']);
    		}
    	}
    }
    
    //request 실패시.
    function failInvestmentCostMgmtCallback(serviceId, response, flag){
    	bodyProgressRemove();
    	hideProgress(gridId);
    	
    	alertBox('W',investmentCostMgmtMsgArray['abnormallyProcessed']);
    }
});