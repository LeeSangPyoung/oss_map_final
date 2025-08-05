/**
 * InvestmentCostMgmt
 *
 * @author P095781
 * @date 2016. 9. 2. 오후 1:40:00
 * @version 1.0
 */

$a.page(function() {
    
	//그리드 ID
    var gridBizDivId = 'resultBizDivGrid';
    var gridBpId = 'resultBpGrid';
    var basicTabs = null;
    var searchFlag = true;
    //replaceAll prototype 선언
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	basicTabs = null;
    	//console.log(id,param);

        initGrid();
    	setCombo();
    	setEventListener();
    };

  	//Grid 초기화
    function initGrid() {
    	var bizDivMapping =  [
			//공통
			{
				selectorColumn : true,
				width : "50px" 
			}
			, {
				key : 'mgmtHdofcNm',
				align:'left',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['hdofc']
			}
			, {
	  	    	key : 'bizYr',
	  	    	align:'center',
	  	    	width:'100px',
	  	    	hidden:true,
	  	    	title : investmentCostTotalBizDivBpMsgArray['businessYear']
	  	    }
			, {
				key : 'bizPurpNm',
				align:'left',
				width:'150px',
				title : investmentCostTotalBizDivBpMsgArray['businessPurpose']
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'150px',
				title : investmentCostTotalBizDivBpMsgArray['businessDivision']
			}
			, {
				key : 'bdgtAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['totalBudgetWon'],
				render: {type:"string", rule : "comma"}
			}
			/*
			, {
				key : 'cstrCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['constructionCount']
			}
			, {
				key : 'efdgSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['submitCount']
			}
			, {
				key : 'efdgNoSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['noSubmit']
			}
			, {
				key : 'efdgSubmRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['submitRate']
			}
			, {
				key : 'regCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['registrationCount']
			}
			, {
				key : 'noSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['noSubmit']
			}
			*/
			,{
				key : 'cstrRegCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['constructionRegistrationCountBp']
			}
			,{
				key : 'efdgAprvCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalCountSKBManager']
			}
			,{
				key : 'efdgAprvRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalRate']
			}
			,{
				key : 'cmplRvCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['reviewCountBp']
			}
			,{
				key : 'cmplCmplRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['completionRate']
			}
			,{
				key : 'tnovSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['submCountBp']
			}
			,{
				key : 'tnovAprvCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalCountSKBManager']
			}
			,{
				key : 'tnovAprvRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalRate']
			}
			,{
				key : 'setlAprvCnt',
				align:'right',
				width:'100px',
				title :investmentCostTotalBizDivBpMsgArray['approvalCountSKBManager']
			}
			,{
				key : 'setlSetlAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['settlementOfAccountsAmount']
			}
			,{
				key : 'nstlNstlAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['nsettlCount']
			}
			,{
				key : 'nstlDsnAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['designAmount']
			}
			,{
				key : 'execPsblBdgt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['execPossibilityBudget']
			}
			, {
	  	    	key : 'bizPurpCd',
	  	    	align:'center',
	  	    	width:'100px',
	  	    	hidden:true,
	  	    	title : investmentCostTotalBizDivBpMsgArray['businessPurposeCode']
	  	    }
			, {
	  	    	key : 'mgmtHdofcCd',
	  	    	align:'center',
	  	    	width:'100px',
	  	    	hidden:true,
	  	    	title : investmentCostTotalBizDivBpMsgArray['headOfficeCode']
	  	    }
			, {
	  	    	key : 'bizDivCd',
	  	    	align:'center',
	  	    	width:'100px',
	  	    	hidden:true,
	  	    	title : investmentCostTotalBizDivBpMsgArray['businessDivisionCode']
	  	    }
    	];
  		
        //그리드 생성
        $('#'+gridBizDivId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : bizDivMapping,
            headerGroup : [
                  			{ fromIndex :  7 , toIndex :  8 , title : investmentCostTotalBizDivBpMsgArray['enforcementDesign'] , id : ""}
                  			,{ fromIndex :  9 , toIndex :  10 , title : investmentCostTotalBizDivBpMsgArray['completion'] , id : ""}
                  			,{ fromIndex :  11 , toIndex :  13 , title : investmentCostTotalBizDivBpMsgArray['takingOver'] , id : ""}
                  			,{ fromIndex :  14 , toIndex :  15 , title : investmentCostTotalBizDivBpMsgArray['settlementOfAccounts'] , id : ""}
                  			,{ fromIndex :  16 , toIndex :  17 , title : investmentCostTotalBizDivBpMsgArray['nsettlEnforcementDesign'] , id : ""}
            ],
            paging:{
   				pagerSelect:false
   			}
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        /*
        $('#'+gridBizDivId).on("dblclick", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;
        	param['tabs'] = basicTabs;
        	console.log(param);
        	
        	investMentCostTotalBizDivBpDetail(param);
        });        
        */
        $('#'+gridBizDivId).on('dblclick', function(e) {

        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;
        	if(basicTabs == 'bizDiv'){
        		gridClick(object, param);
        	}
        });
        var bpMapping =  [
	  	    //공통
	  	    {
	  	    	selectorColumn : true,
	  	    	width : "50px" 
	  	    }
	  	    , {
	  	    	key : 'mgmtHdofcNm',
	  	    	align:'left',
	  	    	width:'100px',
	  	    	title : investmentCostTotalBizDivBpMsgArray['hdofc']
	  	    }
	  	    , {
	  	    	key : 'bizYr',
	  	    	align:'center',
	  	    	width:'100px',
	  	    	hidden:true,
	  	    	title : investmentCostTotalBizDivBpMsgArray['businessYear']
	  	    }
	  	    , {
	  	    	key : 'bizPurpNm',
	  	    	align:'left',
	  	    	width:'150px',
	  	    	title : investmentCostTotalBizDivBpMsgArray['businessPurpose']
	  	    }
	  	    , {
	  	    	key : 'bizDivNm',
	  	    	align:'left',
	  	    	width:'150px',
	  	    	title : investmentCostTotalBizDivBpMsgArray['businessDivision']
	  	    }
	  	    , {
	  	    	key : 'bpNm',
	  	    	align:'left',
	  	    	width:'200px',
	  	    	title : investmentCostTotalBizDivBpMsgArray['bpCategory']
	  	    }
	  	    /*
	  	    , {
				key : 'cstrCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['constructionCount']
			}
			, {
				key : 'efdgSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['submitCount']
			}
			, {
				key : 'efdgNoSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['noSubmit']
			}
			, {
				key : 'efdgSubmRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['submitRate']
			}
			, {
				key : 'regCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['registrationCount']
			}
			, {
				key : 'noSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['noSubmit']
			}
			*/
	  	  ,{
				key : 'cstrRegCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['constructionRegistrationCountBp']
			}
			,{
				key : 'efdgAprvCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalCountSKBManager']
			}
			,{
				key : 'efdgAprvRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalRate']
			}
			,{
				key : 'cmplRvCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['reviewCountBp']
			}
			,{
				key : 'cmplCmplRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['completionRate']
			}
			,{
				key : 'tnovSubmCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['submCountBp']
			}
			,{
				key : 'tnovAprvCnt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalCountSKBManager']
			}
			,{
				key : 'tnovAprvRate',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['approvalRate']
			}
			,{
				key : 'setlAprvCnt',
				align:'right',
				width:'100px',
				title :investmentCostTotalBizDivBpMsgArray['approvalCountSKBManager']
			}
			,{
				key : 'setlSetlAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['settlementOfAccountsAmount']
			}
			,{
				key : 'nstlNstlAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['nsettlCount']
			}
			,{
				key : 'nstlDsnAmt',
				align:'right',
				width:'100px',
				title : investmentCostTotalBizDivBpMsgArray['designAmount']
			}
	  	];
	  	
	  	//그리드 생성
	      $('#'+gridBpId).alopexGrid({
	      	//extend : ['resultGrid'],
	          cellSelectable : true,
	          autoColumnIndex : true,
	          fitTableWidth : true,
	          rowClickSelect : true,
	          rowSingleSelect : false,
	          rowInlineEdit : true,
	          numberingColumnFromZero : false,
	          columnMapping : bpMapping,
	          headerGroup : [
	                			{ fromIndex :  7 , toIndex :  8 , title : investmentCostTotalBizDivBpMsgArray['enforcementDesign'] , id : ""}
                  			,{ fromIndex :  9 , toIndex :  10 , title : investmentCostTotalBizDivBpMsgArray['completion'] , id : ""}
                  			,{ fromIndex :  11 , toIndex :  13 , title : investmentCostTotalBizDivBpMsgArray['takingOver'] , id : ""}
                  			,{ fromIndex :  14 , toIndex :  15 , title : investmentCostTotalBizDivBpMsgArray['settlementOfAccounts'] , id : ""}
                  			,{ fromIndex :  16 , toIndex :  17 , title : investmentCostTotalBizDivBpMsgArray['nsettlEnforcementDesign'] , id : ""}
	          ],
	          paging:{
	 				pagerSelect:false
	 			}
		      ,message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
					filterNodata : 'No data'
				}
	      });
	  	
	  	$('#'+gridBpId).on("dblclick", ".bodycell", function(e) {
	  		var object = AlopexGrid.parseEvent(e);
	  		var param = object.data;
	  		param['tabs'] = basicTabs;
	      	console.log(param);
	      	
	      	investMentCostTotalBizDivBpDetail(param);
	  	});	  	
    };

    function setCombo() {
    	/*selectComboCode('mgmtHdofcCd', 'Y', 'C00109', '');*/
    	selectAfeYearCode('bizYr', 'NS', '');
    	selectOrgListCode('mgmtHdofcCd');
    }
    

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    function setEventListener() {
    	basicTabs = 'bizDiv';
		$('#morebutton').css("display", "none");
    	
    	$('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				basicTabs = 'bizDiv';
    				$('#'+gridBizDivId).alopexGrid("viewUpdate");
    				
    				$('#bpName').css("display", "");
    				$('#morebutton').css("display", "none");
    				$('.more_condition').css("display", "none");
    				break;
    			case 1 :
    				basicTabs = 'bp';
    				$('#'+gridBpId).alopexGrid("viewUpdate");
    				
    				$('#bpName').css("display", "none");
    				$('#morebutton').css("display", "");
    				break;
    			default :
    				break;
    		}
    	});
    	
        // 검색
        $('#search').on('click', function(e) {
        	
        	if($("#bizYr").val() == "") {
        		alertBox('W',investmentCostTotalBizDivBpMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	
        	dataParam['tabs'] = basicTabs;
        	console.log(dataParam);
        	if (basicTabs == 'bizDiv') {
            	showProgress(gridBizDivId);
        	} else {
            	showProgress(gridBpId);
        	}
        	
        	InvestmentCostTotalBizDivBpRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/investmentcosttotalbizdivbplist', dataParam, 'GET', 'investmentCostTotalBizDivBpList');
        });
        
        //엑셀다운로드
        $('#excelDownBizDiv').on('click', function(e) {
        	if($("#bizYr").val() == "") {
        		alertBox('W',investmentCostTotalBizDivBpMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	dataParam['tabs'] = basicTabs;
        	dataParam = gridExcelColumn(dataParam, gridBizDivId);
    		
        	dataParam.fileName = "투자예산집계_사업구분별";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "InvestmentCostTotalBizDivBp";
        		
        	//console.log(dataParam);
        	bodyProgress();
        	
        	InvestmentCostTotalBizDivBpRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
        
      //엑셀다운로드
        $('#excelDownBp').on('click', function(e) {
        	if($("#bizYr").val() == "") {
        		alertBox('W',investmentCostTotalBizDivBpMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	dataParam['tabs'] = basicTabs;
        	dataParam = gridExcelColumn(dataParam, gridBpId);
        	
    		dataParam.fileName = "투자예산집계_BP사별";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "InvestmentCostTotalBizDivBp";
        		
        	//console.log(dataParam);
        	bodyProgress();
        	
        	InvestmentCostTotalBizDivBpRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
        
        
       	$('#bizYr').on('change', function(e) {
       		if(searchFlag){
       			if($('#bizYr').val() != "") {
       				selectBizPurpCd("bizPurpCd", $('#bizYr').val());
       				selectBizDivCd("bizDivCd", ' ', ' ');
       			}
       			else {
       				selectBizPurpCd("bizPurpCd", ' ');
       				selectBizDivCd("bizDivCd", ' ', ' ');
       			}
       		}
       	});
       
       	$('#bizPurpCd').on('change', function(e) {
       		if(searchFlag){
       			if($('#bizPurpCd').val() != "") {;
       				selectBizDivCd("bizDivCd", $('#bizYr').val(), $('#bizPurpCd').val());
       			}
       		}
       	});
	};
	
	//request
	function InvestmentCostTotalBizDivBpRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successInvestmentCostTotalBizDivBpCallback(response, sflag);})
    	  .fail(function(response){failInvestmentCostTotalBizDivBpCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successInvestmentCostTotalBizDivBpCallback(response, flag){
    	if (basicTabs == 'bizDiv') {
    		hideProgress(gridBizDivId);
    	} else {
    		hideProgress(gridBpId);
    	}
    	bodyProgressRemove();

    	if(flag == 'investmentCostTotalBizDivBpList'){
    		//console.log(response);
    		//console.log(basicTabs);
    		if(basicTabs == "bizDiv") {
    			$('#'+gridBizDivId).alopexGrid("dataSet", response.list);
    		}
    		else if(basicTabs == "bp") {
    			$('#'+gridBpId).alopexGrid("dataSet", response.list);
    			bodyProgressRemove();
    		}	
    	}
    	else if(flag = 'excelDownload') {
    		console.log('excelCreate');
    		console.log(response);
    		
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
    function failInvestmentCostTotalBizDivBpCallback(serviceId, response, flag){
    	//console.log(response);
    	if (basicTabs == 'bizDiv') {
    		hideProgress(gridBizDivId);
    	} else {
    		hideProgress(gridBpId);
    	}
    	bodyProgressRemove();

    	alertBox('W',investmentCostTotalBizDivBpMsgArray['abnormallyProcessed']);
    }
    
    function investMentCostTotalBizDivBpDetail(dataParam){
    	
    	$a.popup({
    		popid : 'InvestMentCostTotalBizDivBpDetail',
    		url : 'InvestMentCostTotalBizDivBpDetail.do',
    		data : dataParam,
    		iframe : true,
    		modal : true,
    		width : 1060,
    		height : 650,
    		title : investmentCostTotalBizDivBpMsgArray['investBudgetStatisticsDetail'],
    		movable : true,
    		callback : function(data){

    		}
    	});
    }
    
    function gridClick(object, param) {
    	
    	if (object.mapping.key == 'cstrRegCnt') {
    		param['tabs'] = basicTabs;
        	investMentCostTotalBizDivBpDetail(param);
      	}
    	
    	if (object.mapping.key == 'bizDivNm') {
    		bodyProgress();
    		searchFlag = false;  		
        	$("#click").trigger("click");
        	$(".more_condition").css("display", "");
        	basicTabs = 'bp';
        	selectAfeYearCode('bizYr', 'NS', param.bizYr);  	
        	$("#mgmtHdofcCd").setSelected(param.mgmtHdofcCd);
        	selectBizCd("bizPurpCd", "bizDivCd", param);
        	console.log("1 "+param.bizYr +" "+ param.mgmtHdofcCd +" "+ param.bizPurpCd +" "+ param.bizDivCd);
      	}
    }
});