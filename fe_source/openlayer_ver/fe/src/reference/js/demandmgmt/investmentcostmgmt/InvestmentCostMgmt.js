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
			,
			{
				key : 'mgmtHdofcNm',
				align:'left',
				width:'100px',
				title : investmentCostMgmtMsgArray['hdofc']
			}
			,
			{
				key : 'bizYr',
				align:'center',
				width:'100px',
				title : investmentCostMgmtMsgArray['businessYear']
			}
			, {
				key : 'bizPurpNm',
				align:'left',
				width:'200px',
				title : investmentCostMgmtMsgArray['businessPurpose']
			}
			, {
				key : 'bizDivNm',
				align:'left',
				width:'100px',
				title : investmentCostMgmtMsgArray['businessDivision']
			}
			, {
				key : 'bdgtAsgnAmt',
				align:'right',
				width:'300px',
				title : investmentCostMgmtMsgArray['budgetAssignAmountWon'],
				render: {type:"string", rule : "comma"},
				allowEdit : function(value, data){
					if(data.useYn != 'Y' || data.bizPurpUseYn != 'Y') {
						return false;
					}
					return true;
				},
				editable : {  type: 'text', 
							  attr : { "data-keyfilter-rule" : "digits", "maxlength" : "16"}, styleclass : 'num_editing-in-grid'}
			}
			, {
				key : 'avlbBdgtAmt',
				align:'right',
				width:'100px',
				hidden: true,
				title : investmentCostMgmtMsgArray['availableBudgetAmountWon']
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
        
        // 장비셀값 편집시
        $('#'+gridId).on('cellValueChanged', function(e){
        	var ev = AlopexGrid.parseEvent(e);  
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var cstrCost = "";
        	
        	//console.log(ev);
        	
        	if(data._state.editing != false) {
        		if ( ev.mapping.key == "bdgtAsgnAmt" ) { 
            		//console.log(ev.data.hasOwnProperty('_original'));
            		
            		if(ev.data.hasOwnProperty('_original')) {
            			var orgBdgtAsgnAmt = Number(ev.data._original.bdgtAsgnAmt);
                		cstrCost = parseInt(AlopexGrid.currentValue(data,  "bdgtAsgnAmt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "bdgtAsgnAmt" ));
                		var avlbBdgtAmt = Number(parseInt(AlopexGrid.currentValue(data,  "avlbBdgtAmt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "avlbBdgtAmt" )));
                		
                		if(orgBdgtAsgnAmt != cstrCost) {
                			if(orgBdgtAsgnAmt < cstrCost) {
                    			var totalCost = cstrCost - orgBdgtAsgnAmt
                    			totalCost = totalCost + avlbBdgtAmt;
                    			//console.log("orgBdgtAsgnAmt < cstrCost");

                    			if(totalCost < 0) {
                    				alertBox('W',"가용예산금액 0 원 이하로 내려가게 되므로 수정 할 수 없습니다.<br>부족 금액 : " + totalCost);
                    				cstrCost = orgBdgtAsgnAmt;
                    			}
                    		}
                    		else {
                    			var totalCost = orgBdgtAsgnAmt - cstrCost;
                    			totalCost = avlbBdgtAmt - totalCost;
                    			//console.log("orgBdgtAsgnAmt > cstrCost");

                    			if(totalCost < 0) {
                    				alertBox('W',"가용예산금액 0 원 이하로 내려가게 되므로 수정 할 수 없습니다.<br>부족 금액 : " + totalCost);
                    				cstrCost = orgBdgtAsgnAmt;
                    			}
                    		}
                		}
            		}
            		else {
            			cstrCost = parseInt(AlopexGrid.currentValue(data,  "bdgtAsgnAmt" ) == '' ? 0 : AlopexGrid.currentValue(data,  "bdgtAsgnAmt" ));
            		}
            	}
            	
            	$('#'+gridId).alopexGrid('cellEdit', cstrCost, {_index: {id: ev.data._index.id}}, 'bdgtAsgnAmt');
            	$('#'+gridId).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'bdgtAsgnAmt'); 
        	}
        });
    };
    
    function setCombo() {
    	//selectComboCode('mgmtHdofcCd', 'Y', 'C00109', '');
    	selectOrgListCode('mgmtHdofcCd');
    	selectAfeYearCode('bizYr', 'NS', '');
    	selectAfeYearCode('bizYrCopy', 'N', '');

    }    

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    function setEventListener() {
        // 검색
        $('#search').on('click', function(e) {
        	
        	if($("#bizYr").val() == "") {
        		alertBox('W',investmentCostMgmtMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	
        	//console.log(dataParam);
        	showProgress(gridId);
        	
        	InvestmentCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/investmentcostmgmtlist', dataParam, 'GET', 'investmentCostMgmtList');
        });
        
        //저장
        $('#saveInvestCost').on('click', function(e) { 
        	
        	callMsgBox('','C', investmentCostMgmtMsgArray['save'], function(msgId, msgRst){  
            	if (msgRst == 'Y') {
            		$('#'+gridId).alopexGrid('endEdit', {_state:{editing:true}});
                	
                	var insertList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
                	var updateList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
                	var deleteList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} )); 
                	
                	if(insertList.length == 0 && updateList.length == 0 && deleteList.length == 0) {
                		alertBox('W',investmentCostMgmtMsgArray['noChangedData']);
                		return false;
                	}
                	
                	var dataParam =  $("#searchForm").getData();
                	
                	dataParam.gridData = { 
                			insertList : insertList
                			, updateList : updateList
                			, deleteList : deleteList
                	};
                	
                	bodyProgress();

                	InvestmentCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/investmentcostmgmtsave', dataParam, 'POST', 'investmentCostMgmtSave');
            	}
        	});
        });
        
        //엑셀다운로드
        $('#excelDown').on('click', function(e) {
        	if($("#bizYr").val() == "") {
        		alertBox('W',investmentCostMgmtMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	
        	bodyProgress();
        	
        	dataParam = gridExcelColumn(dataParam, gridId);
        	
        	dataParam.fileName = "투자예산관리";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "InvestmentCostMgmt";
        	
        	InvestmentCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
        
        //사업년도생성
        $('#addBizYr').on('click', function(e) {
        	
        	/*if($("#bizYrCopy").val() == "") {
        		alertBox('W',"생성할 사업년도를 선택해주시기 바랍니다.");
        		return false;
        	}*/
        	
        	callMsgBox('','C', investmentCostMgmtMsgArray['businessYearAddByHeadofficeAdd'], function(msgId, msgRst){  
            	if (msgRst == 'Y') {
            		var dataParam =  $("#searchForm").getData();
            		
            		bodyProgress();

                	InvestmentCostMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/investmentcostmgmtadd', dataParam, 'POST', 'investmentCostMgmtAdd');
            	}
        	});

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
	
	//request
	function InvestmentCostMgmtRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successInvestmentCostMgmtCallback(response, sflag);})
    	  .fail(function(response){failInvestmentCostMgmtCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successInvestmentCostMgmtCallback(response, flag){

    	hideProgress(gridId);
    	bodyProgressRemove();

    	if(flag == 'investmentCostMgmtList'){
    		//console.log(response);
    		$('#'+gridId).alopexGrid("dataSet", response.list);
    		//$("#total").html(response.totalCnt);	
    	}
    	else if(flag == 'investmentCostMgmtSave') {
    		//console.log(response);
    		
    		if(response.Result == "Fail") {
    			alertBox('W',investmentCostMgmtMsgArray['saveFail']);
    		}
    		else {
    			callMsgBox('', 'I', investmentCostMgmtMsgArray['saveSuccess'], function(){  
    				$('#search').click();
	        	});
    		}
    	}
    	else if(flag == 'investmentCostMgmtAdd') {
    		//console.log(response);
    		
    		if(response.Result == "Fail") {
    			alertBox('W',investmentCostMgmtMsgArray['saveFail']);
    		}
    		else if(response.Result == "Exist") {
    			alertBox('W',investmentCostMgmtMsgArray['existYearData']);
    		}
    		else if(response.Result == "Error") {
    			alertBox('W',investmentCostMgmtMsgArray['abnormallyProcessed']);
    		}
    		else if(response.Result == "No") {
    			alertBox('W',investmentCostMgmtMsgArray['copyYearFirst']);
    		}
    		else {
    			alertBox('I',investmentCostMgmtMsgArray['saveSuccess']);
    		}
    	}
    	else if(flag = 'excelDownload') {
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
    function failInvestmentCostMgmtCallback(serviceId, response, flag){
    	//console.log(response);
    	bodyProgressRemove();
    	hideProgress(gridId);
    	
    	alertBox('W',investmentCostMgmtMsgArray['abnormallyProcessed']);
    }
});