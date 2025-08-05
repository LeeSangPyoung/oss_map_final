/**
 * TansportNetworkInvestCostCalculate
 *
 * @author P095781
 * @date 2016. 9. 22. 오후 5:40:00
 * @version 1.0
 */

var gridSearchModel = null;
var decideReqCntYn = true;

$a.page(function() {
    
	var tabs = "";
	
	//그리드 ID
    var lineCostAnalysisResultGrid = 'lineCostAnalysisGrid';
    var purpLineCostResultGridId = 'purpLineCostgrid';
    //replaceAll prototype 선언
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	//console.log(id,param);

        initLineCostAnalysisGrid();
        initPurpLineCostResultGridIdGrid();
        
    	setCombo();
    	setEventListener();
    	$('#planDelete').hide();
    	$('#purpLineCostExcelDown').hide();
    };

  	//Grid 초기화
    function initLineCostAnalysisGrid() {
    	var mapping =  [
			//공통
			{
				width : "40px",
				selectorColumn : true
			}
			, { 
				key : "id",
				title : demandMsgArray['sequence'],
				align : "right",
				width : "55px",
				numberingColumn : true
			}
			, {
				key : 'trmsDemdMgmtNo',
				align:'center',
				width:'180px',
				title : demandMsgArray['demandManagementNumber']
			}
			, {
				key : 'demdDivNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['demandDivision']
			}
			, {
				key : 'cblnwPrityRnk',
				align:'right',
				width:'80px',
				title : demandMsgArray['prty']
			}
			, {
				key : 'progStatNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['progressStatus']
			}
			, {
				key : 'frstRegUserNm',
				align:'left',
				width:'80px',
				title : demandMsgArray['registrant']
			}
			, {
				key : 'frstRegDate',
				align:'center',
				width:'140px',
				title : demandMsgArray['registrationDate']
			}
			, {
				key : 'afeYr',
				align:'center',
				width:'100px',
				title : demandMsgArray['afeYear']
			}
			, {
				key : 'afeDemdDgr',
				align:'center',
				width:'100px',
				title : demandMsgArray['afeDegree']
			}
			, {
				key : 'erpHdofcNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['hdofc']
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['businessDivisionBig'] /*사업구분(대)*/
			}
			, {
				key : 'bizDivDetlNm',
				align:'left',
				width:'250px',
				title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/
			}
			, {
				key : 'bizNm',
				align:'left',
				width:'300px',
				title : demandMsgArray['businessName']
			}
			, {
				key : 'bizUsgNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['businessUsage']
			}
			, {
				key : 'eqpInvest',
				align:'right',
				width:'100px',
				title : demandMsgArray['lineInvestCost'],
				render: {type:"string", rule : "comma"}
			}
			/*, {
				key : 'trmsEqp',
				align:'right',
				width:'100px',
				title : demandMsgArray['transmissionEquipment'],
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'incidFclts',
				align:'right',
				width:'100px',
				title : demandMsgArray['subsidiaryFacilities'],
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'etc',
				align:'right',
				width:'100px',
				title : demandMsgArray['etc'],
				render: {type:"string", rule : "comma"}
			}*/
    	];
    	
        gridSearchModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/lninvestcostcalculatelist"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 15,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
  		
        //그리드 생성
        $('#'+lineCostAnalysisResultGrid).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping,            
            paging: {                             // alopexGrid option의 paging을조정해야한다.
                //pagerTotal: true,                 // 데이터 total count표시 (true로한다)
                pagerSelect: false,               // 페이지당 보여지는 갯수를 조정하는 select 표시여부 (false로한다)
                hidePageList: true                // paging숫자/버튼 감출것인지여부( true로한다 )
            }
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},ajax: {
		         model: gridSearchModel                  // ajax option에 grid 연결할 model을지정
		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		    }
           /*,defaultColumnMapping : {
        	   sorting: true
           }
           ,filteringHeader : true*/
        });                
        
    };
    
  //Grid 초기화
    function initPurpLineCostResultGridIdGrid() {
    	var mapping =  [
			//공통
			{
				selectorColumn : true,
				width : "30px" 
			},
			/*{ 
				numberingColumn : true,
				key : "id",
				title : "순번",
				align : "right",
				width : "55px",
				numberingColumn : true
			}*/
			{
				key : 'afeYr',
				align:'center',
				width:'80px',
				title : demandMsgArray['byYear'],
				rowspan: true
			}
			, {
				key : 'afeDemdDgr',
				align:'left',
				width:'80px',
				title : demandMsgArray['degree'],
				rowspan: true
			}
			, {
				key : 'erpHdofcNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['hdofc'],
				rowspan: true
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['businessDivisionBig'] /*사업구분(대)*/
			}
			, {
				key : 'bizDivDetlNm',
				align:'left',
				width:'150px',
				title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/
			}
			, {
				key : 'procStatYn',
				align:'center',
				width:'100px',
				title : demandMsgArray['planDemandIncludeExistenceAndNonexistence']
			}
			, {
				key : 'reqCnt',
				align:'right',
				width:'100px',
				title : '요청가능개수'
			}
			, {
				key : 'decideReqCnt',
				align:'right',
				width:'100px',
				title : '요청개수'
	 			, allowEdit : function(value, data){
	 				if(data.reqCnt=='0'){
	 					return false;
	 				}else 
	 					return true;
	 				}
	        	,editable : {  type: 'text'
	    	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
		        , styleclass : 'num_editing-in-grid'}
				, render : {type:"string", rule : "comma"}
				, hidden : decideReqCntYn
			}
			, {
				key : 'erpHdofcCd',
				align:'center',
				width:'100px',
				title : '',
				hidden: true
			}
			, {
				key : 'bizDivCd',
				align:'center',
				width:'100px',
				title : '',
				hidden: true
			}
			, {
				key : 'bizDivDetlCd',
				align:'center',
				width:'100px',
				title : '',
				hidden: true
			}
			
			
			/*, {
				key : 'bdgtAmt',
				align:'right',
				width:'100px',
				title : demandMsgArray['assignBudget'],   
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'investCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['designAmount'],  
				render: {type:"string", rule : "comma"}
			}
			, {
				key : 'subtracionAmount',
				align:'right',
				width:'100px',
				title : demandMsgArray['remainderBudget'],
				render: {type:"string", rule : "comma"}
			} */
    	];
  		
        //그리드 생성
        $('#'+purpLineCostResultGridId).alopexGrid({
        	//extend : ['resultGrid'],
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : false,
            numberingColumnFromZero : false,
            columnMapping : mapping,
            headerGroup : [
                  			{ fromIndex :  1 , toIndex :  2 , title : "AFE구분" , id : ""}
                  			, { fromIndex : 4 , toIndex : 5 , title : "사업" , id : "" }

            ],
            paging:{
   				pagerSelect:false
   			}
	        ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
    };
    
    function setCombo() {
    	selectAfeYearCode('afeYr', 'N', '');
    	//소구분 콤보박스
    	//selectComboCode('erpHdofcCd', 'N', 'C00623', '');  // 본부 
		// 로그인 사용자 ERP본부 정보 취득
		//getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());

		// 수요투자 관리자(ENGDM0002)는 일반콤보
		// 수요투자 사용자(ENGDM0001)는 제약콤보
//    	var adtnAttrVal = $('#adtnAttrVal').val();
//		if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0001') > 0 && nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') < 0) {
//			getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
//		} else if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') > 0) {			
//			selectComboCode('erpHdofcCd', 'Y', 'C00623', '');  // 본부 
//		} else {
//			getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
//		}
		selectComboCode('erpHdofcCd', 'N', 'C00623', '');
    	selectComboCode('progStatCd', 'Y', 'C00640', '');  // 진행상탱 
    	selectComboCode('demdDivCd', 'Y', 'C00639', '');  // 수요구분 
    	selectYearBizCombo('bizDivCd', 'Y', $('#afeYr').val(), 'C00618', '', 'TA');	// 사업구분 대
    }
    
    function setEventListener() {
    	tabs = 'lineCostAnalysis';
    	
    	$('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				tabs = 'lineCostAnalysis';
    				$('#'+lineCostAnalysisResultGrid).alopexGrid("viewUpdate");
    				
    				$('#conditionDivIntgFcltsCd').css("display", "");
    				$('#conditionDivIntgFcltsNm').css("display", "");
    				
    				break;
    			case 1 :
    				tabs = 'purpLineCost';
    				$('#'+purpLineCostResultGridId).alopexGrid("viewUpdate");
    				
    				$('#conditionDivIntgFcltsCd').css("display", "none");
    				$('#conditionDivIntgFcltsNm').css("display", "none");
    				
    				break;
    			default :
    				break;
    		}
    	});
    	
    	$('#afeYr').on('change',function(e) {        	
    		var dataParam =  $("#searchForm").getData(); 
    		dataParam.afeYr = $('#afeYr').val();
    		selectAfeTsCode('afeDemdDgr', 'Y', '', dataParam);
    		//selectYearBizCombo('bizDivCd', 'Y', '', 'C00618', '', '');	// 사업구분 대
    		if($("#demdDivCd option:selected").val() == "104001") {
        		selectYearBizCombo('bizDivCd', 'Y', $('#afeYr').val(), 'C00618', '', 'T');
        	}
        	else if($("#demdDivCd option:selected").val() == "104002") {
        		selectYearBizCombo('bizDivCd', 'Y', $('#afeYr').val(), 'C00618', '', 'A');
        	}
        	else {
        		selectYearBizCombo('bizDivCd', 'Y', $('#afeYr').val(), 'C00618', '', 'TA');
        	}
        });
    	
    	$('#demdDivCd').on('change', function(e) {
        	if($("#demdDivCd option:selected").val() == "104001") {
        		decideReqCntYn = true;
        		selectYearBizCombo('bizDivCd', 'Y', $('#afeYr').val(), 'C00618', '', 'T');
        		initPurpLineCostResultGridIdGrid();
        		$('#'+purpLineCostResultGridId).alopexGrid("dataEmpty");
        	}
        	else if($("#demdDivCd option:selected").val() == "104002") {
        		decideReqCntYn = false;
        		selectYearBizCombo('bizDivCd', 'Y', $('#afeYr').val(), 'C00618', '', 'A');
        		initPurpLineCostResultGridIdGrid();
        		$('#'+purpLineCostResultGridId).alopexGrid("dataEmpty");
        	}
        	else {
        		decideReqCntYn = true;
        		selectYearBizCombo('bizDivCd', 'Y', $('#afeYr').val(), 'C00618', '', 'TA');
        		initPurpLineCostResultGridIdGrid();
        		$('#'+purpLineCostResultGridId).alopexGrid("dataEmpty");
        	}
        });
    	
    	$('#bizDivCd').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		if($('#bizDivCd').val() != ""){
    			if($("#demdDivCd option:selected").val() == "104001") {
    				selectYearBizCombo('bizDivDetlCd', 'Y', $('#afeYr').val(), $("#bizDivCd").val(), '', 'T', 'L');	// 사업구분 소
            	}
            	else if($("#demdDivCd option:selected").val() == "104002") {
            		selectYearBizCombo('bizDivDetlCd', 'Y', $('#afeYr').val(), $("#bizDivCd").val(), '', 'A', 'L');	// 사업구분 소
            	}
            	else {
            		selectYearBizCombo('bizDivDetlCd', 'Y', $('#afeYr').val(), $("#bizDivCd").val(), '', 'TA', 'L');	// 사업구분 소
            	}
    			//selectYearBizCombo('bizDivDetlCd', 'Y', $('#afeYr').val(), $("#bizDivCd").val(), '', 'T');	// 사업구분 소
    		}else{
    			$('#bizDivDetlCd').empty();
    			$('#bizDivDetlCd').append('<option value="">'+demandMsgArray['all']+'</option>');
    			$('#bizDivDetlCd').setSelected("");
    		}
        });
    	
    	// 진행상태 코드가 셋팅되는 경우
    	$('#progStatCd').on('change', function(e) {
    		/*if ($(this).val() == '105006') {
        		$(this).find('option:selected').remove();
    		}*/
    		
    		$(this).find("option[value='105006']").remove(); 
    	});    	

    	// 수요구분 코드가 셋팅되는 경우: B2B삭제
    	$('#demdDivCd').on('change', function(e) {
    		/*if ($(this).val() == '105006') {
        		$(this).find('option:selected').remove();
    		}*/
    		
    		$(this).find("option[value='104003']").remove(); 
    	});
    	
    	// 수요구분 코드가 셋팅되는 경우: B2B삭제
    	$('#erpHdofcCd').on('change', function(e) {
    		/*if ($(this).val() == '105006') {
        		$(this).find('option:selected').remove();
    		}*/
    		
    		$(this).find("option[value='1000']").remove(); 
    	});
    	
    	
        // 검색
        $('#search').on('click', function(e) {
        	
        	var dataParam =  $("#searchForm").getData();
        	dataParam.tabs = tabs;
        	var pageInfo = null;

        	//bodyProgress();
        	if(tabs == "lineCostAnalysis") {
        		if(dataParam.afeYr == "" || dataParam.afeDemdDgr == "" || dataParam.erpHdofcCd == "" ){
            		alertBox('W','년도/차수/본부 선택은 필수입니다.');
            		return false;
            	}
        		bodyProgress();
            	dataParam.pageNo = '1';
            	dataParam.rowPerPage = '15';
        		//pageInfo = $('#'+neCostAnalysisResultGrid).alopexGrid('pageInfo');
        		gridSearchModel.get({
            		data: dataParam,
        		}).done(function(response,status,xhr,flag){successTansportNetworkInvestCostMgmtCallback(response, 'lninvestcostcalculatelist');})
        	  	  .fail(function(response,status,flag){failTansportNetworkInvestCostMgmtCallback(response, 'lninvestcostcalculatelist');});
        	}
        	else if(tabs == "purpLineCost") {
        		pageInfo = $('#'+purpLineCostResultGridId).alopexGrid('pageInfo');
        		bodyProgress();
            	dataParam.pageNo = pageInfo.current;
            	dataParam.rowPerPage = 500;
            	TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/lninvestcostcalculatelist', dataParam, 'GET', 'lninvestcostcalculatelist');
        	}
        });
        
        $('#planDelete').on('click', function(e) {
        	/**
        	 * 유선망수요 이외에는 삭제 못하게 처리한다.
        	 * 유선망수요 중에서도 진행 상태가 계획수요 인 상태만 
        	 */
        	
        	var list = AlopexGrid.trimData($('#'+lineCostAnalysisResultGrid).alopexGrid('dataGet', {_state:{selected:true}}));

        	var flag = true;

        	if(list.length > 0) {
        		for(var i=0; i<list.length; i++) {
        			var data = list[i];
        			
        			if(data.demdDivCd == '104001' && data.progStatCd == '105001') {
        				
        			}
        			else {
        				flag = false;
        			}
        		}
        	}
        	else {
        		alertBox('W',demandMsgArray['selectData']);
        		return false;
        	}
        	//console.log(flag);
        	if(flag) {
        		
        		callMsgBox('','C', demandMsgArray['delete'], function(msgId, msgRst){  
                	if (msgRst == 'Y') {
                		bodyProgress();
                		var updateData = [];
            			
            			$.each(list, function(idx, obj){
            				updateData.push(obj);
            			});
            			               		        		
            			TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/afedgr?method=delete'
                				           , updateData
                				           , 'POST'
                				           , 'planDelete');
                	}
            	});
        	}
        	else {
        		alertBox('W',demandMsgArray['planDemandRequestFail']);
        		return false;
        	}
        });
        
        $('#planAllDelete').on('click', function(e) {
        	/**
        	 * 유선망수요 이외에는 삭제 못하게 처리한다.
        	 * 유선망수요 중에서도 진행 상태가 계획수요 인 상태만 삭제가 가능
        	 */
        	var dataParam =  $("#searchForm").getData();
        	
        	if(dataParam.afeYr == "" || dataParam.afeDemdDgr == "" || dataParam.erpHdofcCd == "" ){
        		alertBox('W','년도/차수/본부 선택은 필수입니다.');
        		return false;
        	}
//        	if(dataParam.demdDivCd == "" || dataParam.progStatCd != "105001"){
//        		alertBox('W',demandMsgArray['planDemandRequestFail']);
//        		return false;
//        	}
        	
    		callMsgBox('','C', '조회된 모든 계획수요 건들이 삭제됩니다.<br></br>' + demandMsgArray['delete'], function(msgId, msgRst){  
            	if (msgRst == 'Y') {
            		bodyProgress();
        			
            		dataParam.div = "line";
        			TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/deletePlanDemand'
            				           , dataParam
            				           , 'POST'
            				           , 'planAllDelete');
            	}
        	});
        });
        
        //엑셀다운로드
        $('#lineCostAnalysisExcelDown').on('click', function(e) {
        	bodyProgress();
        	var dataParam =  $("#searchForm").getData();

        	dataParam = gridExcelColumn(dataParam, lineCostAnalysisResultGrid);
    		dataParam.fileName = "선로투자대상분석";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = tabs;
        	dataParam.tabs = tabs;
        		
        	//console.log(dataParam);
        	
        	TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/lnexcelcreate', dataParam, 'GET', 'excelDownload');
        });
        
        $('#purpLineCostExcelDown').on('click', function(e) {
        	bodyProgress();
        	var dataParam =  $("#searchForm").getData();

        	dataParam = gridExcelColumn(dataParam, purpLineCostResultGridId);
    		dataParam.fileName = "목적별선로투자";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = tabs;
        	dataParam.tabs = tabs;
        	//console.log(dataParam);
        	
        	TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/lnexcelcreate', dataParam, 'GET', 'excelDownload');
        });
        
        // 수요 확정 요청
        $('#demdDecideRequest').on('click', function(e) {
        	
			$('#'+purpLineCostResultGridId).alopexGrid("endEdit");
        	var dataParam =  $("#searchForm").getData();
        	/*
        	if(dataParam.demdDivCd != "" || dataParam.bizDivCd != "" || dataParam.bizDivDetlCd != "" || dataParam.progStatCd != ""
        		|| dataParam.intgFcltsCd != "" || dataParam.intgFcltsNm != "") {
        		
        		alertBox('W',demandMsgArray['demandFixRequestPossibleCondition']);
        		return false;
        	}
        	*/
        	var list = AlopexGrid.trimData($('#'+purpLineCostResultGridId).alopexGrid('dataGet', {_state:{selected:true}}));
        
        	var flag = true;

        	if(list.length > 0) {
        		
        	} else {
            	flag = false;
            	alertBox('W',demandMsgArray['selectData']);
            	return false;
        	}
        	
        	if(flag) {
        		for(var i = 0; i < list.length; i++){
        			var data = list[i];
        			var reqCnt = parseInt(list[i].reqCnt);
        			var decideReqCnt = parseInt(list[i].decideReqCnt);
        			if(data.procStatYn == "N"){
        				alertBox('W','계획수요가 포함되지 않은 사업은 수요확정요청을 할 수 없습니다.');
        				$('#'+purpLineCostResultGridId).alopexGrid("startEdit");
                		return false;
        			}
        			if(decideReqCnt > reqCnt){
        				alertBox('W','요청개수는 요청가능 개수를 초과할 수 없습니다.');
        				$('#'+purpNeCostResultGridId).alopexGrid("startEdit");
        				return false;
        			}
        		}
        		
        		callMsgBox('','C', "해당 수요에 장비가 포함되어 있을 경우 모두 진행상태가 변경됩니다.<br>" + demandMsgArray['requestForTransportNetworkInvestCostCalculate'], function(msgId, msgRst){  
                	if (msgRst == 'Y') {
                		bodyProgress();
                		
                		var updateData = [];
            			$.each(list, function(idx, obj){
            				obj.div = "line";
            				obj.demdDivCd = $('#demdDivCd').val();
            				updateData.push(obj);
            			});
            			
            			TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/updateRequestList'
      				           , updateData
      				           , 'POST'
      				           , 'updateLnRequestList');
                		/*
                		
                		var updataData = null;
                		
                		if(list.length > 0) {
                			updataData = list[0];
                			updataData.div = "line";
                		}
                		else {
                			
                			updataData = new Object();
                			
                			updataData.afeYr = demdDecideRequestAfeYr;
                			updataData.afeDemdDgr = demdDecideRequestAfeDemdDgr;
                			updataData.erpHdofcCd = demdDecideRequestErpHdofcCd;
                			updataData.div = "line";
                		}
                		
                		updataData.tabs = tabs;
                		updataData.check = "demddeciderequestcheck";
                		
                		TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/demddeciderequestcheck'
     				           , updataData
     				           , 'GET'
     				           , 'demddeciderequestcheck');
                		*/
                		/*var updateData = [];
            			
            			$.each(list, function(idx, obj){
            				updateData.push(obj);
            			});*/
            			//console.log("demdDecideRequest Start");   
            			//console.log(updataData);               		        		
            			/*TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/lnrequestcheck'
                				           , updataData
                				           , 'GET'
                				           , 'lnrequestcheck');*/
                	}else{
                		$('#'+purpNeCostResultGridId).alopexGrid("startEdit");
                		return false;
                	}
            	});
        	}
        	else {
        		alertBox('W',demandMsgArray['demandFixRequestOnlyYes']);
        		return false;
        	}
        });
	};
	
	//request
	function TansportNetworkInvestCostMgmtRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successTansportNetworkInvestCostMgmtCallback(response, sflag);})
    	  .fail(function(response){failTansportNetworkInvestCostMgmtCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successTansportNetworkInvestCostMgmtCallback(response, flag){
    	if(flag == 'lninvestcostcalculatelist'){
    		bodyProgressRemove();
    		if(tabs == "lineCostAnalysis") {
    			//console.log(response);
    			//if(response.list.length == 0) {
    				//alertBox('I',demandMsgArray['noInquiryData']);
    			//}
        		//$('#'+neCostAnalysisResultGrid).alopexGrid("dataSet", response.list);
    		}
    		else if(tabs == "purpLineCost") {
        		$('#'+purpLineCostResultGridId).alopexGrid("dataSet", response.lists);
        		$('#'+purpLineCostResultGridId).alopexGrid("startEdit");
    		}
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
    		bodyProgressRemove();
    	}
    	else if(flag == 'planDelete') {
    		bodyProgressRemove();
    		if (response.result.code == "OK") {
    			/*정상적으로 처리되었습니다.*/
    			callMsgBox('', 'I', demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    			});
    		}  else {
    			alertBox('W', response.errorMsg);
    		}
    	}
    	else if(flag == 'demddeciderequestcheck') {
    		if(response.demdYn == 'Y') {
    			
    			//console.log(response.data);
    			
    			var dataParam = response.data;
    			dataParam.div = "line";
    			//console.log("dataParam : " + dataParam.erpHdofcCd);
    			
    			TansportNetworkInvestCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/transportnetworkinvestcostmgmt/lnrequest'
				           , dataParam
				           , 'POST'
				           , 'lnrequest');
    		}
    		else {
        		bodyProgressRemove();
        		
        		var checkMsg = demandMsgArray['demandFixRequestNoData'];  /* 수요확정요청할 계획수요가 없습니다. */
        		if (response.acsnwPoolYn == 'Y') {
        			checkMsg = checkMsg + '<br>(' + demandMsgArray['existForAcsnwPoolDemand'] + ")" ; /*"(A망계획수요의 전송망수요가 존재합니다.)";*/
        		}
    			alertBox('W',checkMsg);
    			return false;
    		}
    	}
    	else if(flag == 'lnrequest') {
    		bodyProgressRemove();
    		if(response.result == "Success") {
    			callMsgBox('', 'I',demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    				//return false;
    			});
    			
    		}
    		else if(response.result == "Not Update") {
    			alertBox('W',demandMsgArray['demandFixRequestNoData']);
    			return false;
    		}
    		else {
    			callMsgBox('', 'I',demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    				//return false;
    			});
    		}
    	}
    	else if(flag == 'updateLnRequestList'){
    		bodyProgressRemove();
    		
    		if(response.result == true){
    			callMsgBox('', 'I',demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    				//return false;
    			});
    		}
    	}
    	else if(flag == 'planAllDelete'){
    		bodyProgressRemove();
    		
    		if(response.result == true){
    			callMsgBox('', 'I',demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    				//return false;
    			});
    		}
    		else{
    			alertBox('W',response.resMsg);
    			return false;
    		}
    	}
    }
    
    //request 실패시.
    function failTansportNetworkInvestCostMgmtCallback(serviceId, response, flag){
    	//console.log(response);
    	bodyProgressRemove();
    	alertBox('W',demandMsgArray['abnormallyProcessed']);
    }
});