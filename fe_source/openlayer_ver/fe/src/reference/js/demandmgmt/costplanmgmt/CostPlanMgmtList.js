/**
 * CostPlanMgmtList
 * @author P092783
 * @date 2022. 9. 20.
 * @version 1.0
 */

$a.page(function() {
    
	//그리드 ID
    var gridId = 'resultGrid';
    var wbsVal = 'WBS';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        initGrid();
    	setCombo();
    	setEventListener();
    	$('#btn_dwn_excel').setEnabled(false);
    	$('#btn_decide_cost').setEnabled(false);
    };
    
  	//Grid 초기화
    function initGrid() {
	    var mapping =  [
	                    { key : 'costName', align:'center', width:'80px', title : '투자비' ,rowspan : true
	      					,colspanTo:function(value,data,mapping){
		    					if(data['shpTypNm'] == 'summarization'){
		    						return 'shpTypNm';
		    					}
		    				}
				   		   	, render : function(value, data) { 
		    					if(data['shpTypNm'] == 'summarization'){
		    						return '합계';
		    					}else{
		    						return value;
		    					}
				   		   	}
	                    }
	        	 		,{ key : 'gubun', align:'center', width:'80px', title : demandMsgArray['usage'] /*용도*/,rowspan : true}
	        	 		,{ key : 'hdqtrChrgUserNm', align:'center', width:'80px', title : '담당',rowspan : true}
	        	 		,{ key : 'demdBizDivDetlNm', align:'center', width:'250px', title : '사업명'
	      					,colspanTo:function(value,data,mapping){
		    					if(data['shpTypNm'] == 'subTotal'){
		    						return 'shpTypNm';
		    					}
		    				}
		        	 		, render : function(value, data) { 
		    					if(data['shpTypNm'] == 'subTotal'){
		    						return '소계';
		    					}else{
		    						return value;
		    					}
				   		   	}
	        	 		}
	        	 		
	        	 		
	        	 		
	        	 		,{ key : 'shpTypNm', align:'left', width:'140px', title : '형상TYPE'}
	        	 		,{ key : 'costSum', align:'right', width:'100px', title : '예산합계', render:{type:"string", rule : "comma"}
							/*, editable: function (value, data, render, mapping, grid) {
		        				var currentData = AlopexGrid.currentData(data);
		        				var numBudget5100 = Number(currentData.budget5100);
		        				var numBudget5300 = Number(currentData.budget5300);
		        				var numBudget5500 = Number(currentData.budget5500);
		        				var numBudget5600 = Number(currentData.budget5600);
		        				
		        				return setComma( (numBudget5100 + numBudget5300 + numBudget5500 + numBudget5600 ).toFixed(0));
		    				}
					 		, refreshBy: ['budget5100','budget5300', 'budget5500', 'budget5600']*/
				 		}
	        	 		
	        	 		/*5100*/
	        	 		,{ key : 'budget5100', align:'right', width:'100px', title : demandMsgArray['budget'] /*예산*/
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'caculateSub5100', align:'right', width:'100px', title : '식/SUB'
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'cost5100', align:'right', width:'100px', title : demandMsgArray['unitPrice'] /*단가*/ , render : {type:"string", rule : "comma"}
						, editable: function (value, data, render, mapping, grid) {
	        				var currentData = AlopexGrid.currentData(data);  
	        				if(currentData.budget5100 =='0'){
	        					return 0;
	        				}else{
	        					var totalCnt = currentData.caculateSub5100*1
			    				
			    				if(totalCnt == 0)		totalCnt = 1;
		        				return setComma((currentData.budget5100 / totalCnt).toFixed(0));
	        				}
	    				}
				 		, refreshBy: ['budget5100','caculateSub5100']}
	        	 		
	        	 		/*5300*/
	        	 		,{ key : 'budget5300', align:'right', width:'100px', title : demandMsgArray['budget'] /*예산*/
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'caculateSub5300', align:'right', width:'100px', title : '식/SUB'
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'cost5300', align:'right', width:'100px', title : demandMsgArray['unitPrice'] /*단가*/ , render : {type:"string", rule : "comma"}
						, editable: function (value, data, render, mapping, grid) {
	        				var currentData = AlopexGrid.currentData(data);  
	        				if(currentData.budget5300 =='0'){
	        					return 0;
	        				}else{
	        					var totalCnt = currentData.caculateSub5300*1
			    				
			    				if(totalCnt == 0)		totalCnt = 1;
		        				return setComma((currentData.budget5300 / totalCnt).toFixed(0));
	        				}
	    				}
				 		, refreshBy: ['budget5300','caculateSub5300']}
	        	 		
	        	 		/*5500*/
	        	 		,{ key : 'budget5500', align:'right', width:'100px', title : demandMsgArray['budget'] /*예산*/
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'caculateSub5500', align:'right', width:'100px', title : '식/SUB'
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'cost5500', align:'right', width:'100px', title : demandMsgArray['unitPrice'] /*단가*/ , render : {type:"string", rule : "comma"}
						, editable: function (value, data, render, mapping, grid) {
	        				var currentData = AlopexGrid.currentData(data);  
	        				if(currentData.budget5500 =='0'){
	        					return 0;
	        				}else{
	        					var totalCnt = currentData.caculateSub5500*1
			    				
			    				if(totalCnt == 0)		totalCnt = 1;
		        				return setComma((currentData.budget5500 / totalCnt).toFixed(0));
	        				}
	    				}
				 		, refreshBy: ['budget5500','caculateSub5500']}
	        	 		
	        	 		/*5600*/
	        	 		,{ key : 'budget5600', align:'right', width:'100px', title : demandMsgArray['budget'] /*예산*/
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'caculateSub5600', align:'right', width:'100px', title : '식/SUB'
	        	 			, allowEdit : function(value, data){
	        	 				if( data.shpTypNm =='subTotal' || data.shpTypNm =='summarization' ){
	        	 					return false;
	        	 				}else 
	        	 					return true;
	        	 				}
	                	,editable : {  type: 'text'
	            	        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}
	        	        , styleclass : 'num_editing-in-grid'}
	        			, render : {type:"string", rule : "comma"}}
	        	 		,{ key : 'cost5600', align:'right', width:'100px', title : demandMsgArray['unitPrice'] /*단가*/ , render : {type:"string", rule : "comma"}
						, editable: function (value, data, render, mapping, grid) {
	        				var currentData = AlopexGrid.currentData(data);  
	        				if(currentData.budget5600 =='0'){
	        					return 0;
	        				}else{
	        					var totalCnt = currentData.caculateSub5600*1
			    				
			    				if(totalCnt == 0)		totalCnt = 1;
		        				return setComma((currentData.budget5600 / totalCnt).toFixed(0));
	        				}
	    				}
				 		, refreshBy: ['budget5600','caculateSub5600']}
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
	         columnMapping : mapping,
	         height : (screen.height==900) ? 450 : eval(screen.height * 0.6),
	         headerGroup : [
	               			{ fromIndex :  0 , toIndex :  1, title : '예산및 ERP 단가표'}
	               			, { fromIndex : 2 , toIndex : 3 , title : wbsVal }
	               			, { fromIndex : 4 , toIndex : 4 , title : '(단위:원)'}
	               			, { fromIndex : 5 , toIndex : 5 , title : '계'}
	               			, { fromIndex : 6 , toIndex : 8 , title : demandMsgArray['capitalArea'] /* 수도권 */}
	               			, { fromIndex : 9 , toIndex : 11 , title : demandMsgArray['easternPart'] /* 동부 */}
	               			, { fromIndex : 12 , toIndex : 14 , title : demandMsgArray['westernPart'] /* 서부 */}
	               			, { fromIndex : 15 , toIndex : 17 , title : demandMsgArray['centerPart'] /* 중부 */}
	               		   ]
	         ,grouping : {
	         	by : ['costName','gubun','hdqtrChrgUserNm'],
	         	useGrouping : true,
	         	useGroupRowspan : true,
	         }
	     	,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
	     });
    };
    
    function setCombo() {
    	//AFE 구분 콤보박스
    	selectAfeYearCode('afeYr', 'N', '');
    	// 사업구분 대
    	selectYearBizCombo('demdBizDivCd', 'Y', '2016', 'C00618', '', 'TA');
    }
    
    function setEventListener() {
    	
        // 검색
        $('#search').on('click', function(e) {
        	var dataParam =  $("#searchForm").getData();
        	bodyProgress();
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/costplanmgmt/costPlanMgmtList', dataParam, 'GET', 'search');
        });
        
        //예산확정
        $('#btn_decide_cost').on('click', function(e) {
    		if (checkRowData() == false){
    			return;
    		}
    		$("#"+gridId).alopexGrid("endEdit");
    		
    		
    		var afeYr = $("#afeYr").val()
    		var afeDemdDgr = $("#afeDemdDgr").val()
    		
    		var gridData = $('#'+gridId).alopexGrid('dataGet');
    		var num = gridData.length;
    		var demdBizDivDeltCdList = []
    		var rowData = []
    		var distinctDemdBizDivDeltCdList = []
    		
    		var editRow = []
    		for(var i = 0; i < num; i++){
    			if(gridData[i].demdBizDivDeltCd){
    				demdBizDivDeltCdList.push(gridData[i].demdBizDivDeltCd);
    				rowData.push(gridData[i]);
    			}
    		}
    		
    		demdBizDivDeltCdList.forEach(function(item, index){
    			if(!distinctDemdBizDivDeltCdList.includes(item)){
    				distinctDemdBizDivDeltCdList.push(item);
    			};
    		});
    		
    		var rowDataNum = rowData.length;
    		var editRowNum = distinctDemdBizDivDeltCdList.length;

    		var demdBizDivDeltCd = "";
    		var editRowData = {};
    		
    		/* 물자비 */
	    	var hdqtrMtrlCost = 0;
    	    var cptMtrlCost = 0;
    	    var busanMtrlCost = 0;
    	    var westMtrlCost = 0;
    	    var middMtrlCost = 0;
    	    
    	    /* 공사비 */
        	var bonsa = 0;
    	    var sudo = 0;
    	    var busan = 0;
    	    var seobu = 0;
    	    var jungbu = 0;
    		
    		
    		for(var j = 0; j < editRowNum; j++){
    			editRowData = {};
    			demdBizDivDeltCd = "";
    	    	hdqtrMtrlCost = 0;
        	    cptMtrlCost = 0;
        	    busanMtrlCost = 0;
        	    westMtrlCost = 0;
        	    middMtrlCost = 0;
            	bonsa = 0;
        	    sudo = 0;
        	    busan = 0;
        	    seobu = 0;
        	    jungbu = 0;
    			
    			for(var k = 0; k < rowDataNum; k++){
    				if(distinctDemdBizDivDeltCdList[j] == rowData[k].demdBizDivDeltCd){
    					if(rowData[k].costName == '물자비' ){
    						console.log("확인1");
    						console.log(rowData[k]);
    						console.log("확인1");
        		    	    cptMtrlCost = cptMtrlCost +  Number(rowData[k].budget5100);
        		    	    busanMtrlCost = busanMtrlCost + Number(rowData[k].budget5300);
        		    	    westMtrlCost = westMtrlCost + Number(rowData[k].budget5500);
        		    	    middMtrlCost = middMtrlCost + Number(rowData[k].budget5600);
        				}
        				if( rowData[k].costName == '공사비' ){
    						console.log("확인2");
    						console.log(rowData[k]);
    						console.log("확인2");
        					sudo = sudo +  Number(rowData[k].budget5100);
        					busan = busan + Number(rowData[k].budget5300);
        					seobu = seobu + Number(rowData[k].budget5500);
        					jungbu = jungbu + Number(rowData[k].budget5600);
        				}
        				demdBizDivDeltCd = rowData[k].demdBizDivDeltCd
    				}
    			}
    			
    			editRowData = {
    					"afeYr" : afeYr,
    					"afeDemdDgr" : afeDemdDgr,
    					"demdBizDivCd" : demdBizDivDeltCd,
    					"hdqtrMtrlCost" : hdqtrMtrlCost / 1000000,
    					"cptMtrlCost" : cptMtrlCost / 1000000,
    					"busanMtrlCost" : busanMtrlCost / 1000000,
    					"westMtrlCost" : westMtrlCost / 1000000,
    					"middMtrlCost" : middMtrlCost / 1000000,
    					"bonsa" : bonsa / 1000000,
    					"sudo" : sudo / 1000000,
    					"busan" : busan / 1000000,
    					"seobu" : seobu / 1000000,
    					"jungbu" : jungbu / 1000000,
    					"invtDivCd" : "102001",
		            	"hdqtrLandCnstCost" : 0,
		    	    	"cptLandCnstCost" : 0,
		    	    	"busanLandCnstCost" : 0,
		    	    	"westLandCnstCost" : 0,
		        	    "middLandCnstCost" : 0
    			};
    			
    			editRow.push(editRowData);
    		}
    		var deleteRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
    		
    		var dataParam = new Object();
    		dataParam.gridData = {
    				editRow : editRow,
    				deleteRow : deleteRow
    		}
    		console.log(dataParam);
    		callMsgBox('','C', "예산을 확정 하시겠습니까?", function(msgId, msgRst){  

        		if (msgRst == 'Y') {
        			bodyProgress();
        			demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/saveafenew', dataParam, 'POST', 'saveAfeNew');
        		}
    		});
        });
        
        
        //엑셀다운로드
        $('#btn_dwn_excel').on('click', function(e) {
        	bodyProgress();
       	 	excelDownload();
        });
        
        //AFE 구분 콤보박스
        $('#afeYr').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		selectAfeTsCode('afeDemdDgr', 'N', '', dataParam);
    		selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'TA');	// 사업구분 대
			demandRequest('tango-transmission-biz/transmisson/demandmgmt/costplanmgmt/selectwbslist', dataParam, 'GET', 'selectWbsList');
        });
        
        //AFE 구분(세부차수) 콤보박스
        $('#afeDemdDgr').on('change',function(e) {
			var dataParam =  $("#searchForm").getData();
        	dataParam.demdBizDivDetlCd = dataParam.demdBizDivDetlCd;   // commonVO에 없어서
			demandRequest('tango-transmission-biz/transmisson/demandmgmt/costplanmgmt/selectwbslist', dataParam, 'GET', 'selectWbsList');
        });
    	
        //사업 구분(대) 콤보박스        
    	$('#demdBizDivCd').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		if($('#demdBizDivCd').val() != ""){
    			selectYearBizCombo('demdBizDivDetlCd', 'Y', $("#afeYr").val(), $("#demdBizDivCd").val(), '', 'TA');	// 사업구분 소
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/costplanmgmt/selectwbslist', dataParam, 'GET', 'selectWbsList');
    		}else{
    			$('#demdBizDivDetlCd').empty();
    			$('#demdBizDivDetlCd').append('<option value="">'+demandMsgArray['all']+'</option>');
    			$('#demdBizDivDetlCd').setSelected("");
    			wbsVal = 'WBS';
    		}
    		
        });
    	
    	//사업 구분(세부) 콤보박스        
    	$('#demdBizDivDetlCd').on('change',function(e) {
			var dataParam =  $("#searchForm").getData();
        });    	
	};
	
	//request
	function demandRequest(surl,sdata,smethod,sflag)
    {		
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    	  //.error();
    }
	
    //엑셀다운로드
    function excelDownload() {
   	 	$("#"+gridId).alopexGrid("endEdit");
		var worker = new ExcelWorker({
     		excelFileName : '비용계획 산출 및 시뮬레이션',
     		sheetList: [{
     			sheetName: '비용계획 산출 및 시뮬레이션',
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		$("#"+gridId).alopexGrid("startEdit");
		bodyProgressRemove();
    }
    
    //wbs변경
    function wbsNameChange() {
		$('#'+gridId).alopexGrid('updateOption', {
			headerGroup : [
	               			{ fromIndex :  0 , toIndex :  1, title : '예산및 ERP 단가표'}
	               			, { fromIndex : 2 , toIndex : 3 , title : wbsVal }
	               			, { fromIndex : 4 , toIndex : 4 , title : '(단위:원)'}
	               			, { fromIndex : 5 , toIndex : 5 , title : '계'}
	               			, { fromIndex : 6 , toIndex : 8 , title : demandMsgArray['capitalArea'] /* 수도권 */}
	               			, { fromIndex : 9 , toIndex : 11 , title : demandMsgArray['easternPart'] /* 동부 */}
	               			, { fromIndex : 12 , toIndex : 14 , title : demandMsgArray['westernPart'] /* 서부 */}
	               			, { fromIndex : 15 , toIndex : 17 , title : demandMsgArray['centerPart'] /* 중부 */}
	               		  ]
		});
    }
    
    function checkRowData() {
		//전체종료
		$('#'+gridId).alopexGrid('endEdit', {_state: {editing:true}});
		var editingRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", [{_state:{editing:true}}]));
		if (editingRow.length > 0 ){
			return false;
		} else {
			return true;
		}
	}
	
	//request 성공시
    function successDemandCallback(response, flag){
		
    	if(flag == 'search'){
			$('#'+gridId).alopexGrid('dataSet', response.resultList );
    		if(response.resultList.length > 0){
    			$('#btn_dwn_excel').setEnabled(true);
    			$('#btn_decide_cost').setEnabled(true);
    		}else{
    			$('#btn_dwn_excel').setEnabled(false);
    			$('#btn_decide_cost').setEnabled(false);
    		}    
			$('#'+gridId).alopexGrid("startEdit");
    		bodyProgressRemove();  
    	}
    	
    	if(flag == 'saveAfeNew') {
    		callMsgBox('', 'I', "예산을 확정 하였습니다." , function() {
    		});
    		$("#"+gridId).alopexGrid("startEdit");
    		wbsNameChange();
    		bodyProgressRemove();
    	}
    	
    	// WBS 타입
    	if(flag == 'selectWbsList'){
    		if(response != null && response.length > 0){
    			if($('#demdBizDivCd').val() !=''){
    				wbsVal = response[0].cdNm;
    			};
    		} 
    	}
    }
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	bodyProgressRemove();
    	if(flag == 'search'){
	    	alertBox('W', demandMsgArray['searchFail'] );/*'시스템 오류가 발생하였습니다'  demandMsgArray['systemError']  */
    	}
    }
    
});