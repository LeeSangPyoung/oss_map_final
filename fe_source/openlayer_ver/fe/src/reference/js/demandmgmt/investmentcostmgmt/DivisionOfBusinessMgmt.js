/**
 * DivisionOfBusinessMgmt
 *
 * @author P095781
 * @date 2016. 8. 17. 오후 4:30:00
 * @version 1.0
 */

var useYnCombo = [{cd:'Y', cdNm:"Y"},{cd:'N', cdNm:"N"}];	// 사용여부 Combo
var bizDivCombo = []; // 코드구분 Combo
var prntCdList = []; // 상세구분 Combo
var selectBizYr = "";
var selectBizDivCd = "";
var selectBizDivNm = "";

$a.page(function() {
    
	//그리드 ID
    var gridId = 'resultGrid';
    //replaceAll prototype 선언
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	console.log(id,param);

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
				key : 'bizYr',
				align:'center',
				width:'100px',
				title : divisionOfBusinessMgmtMsgArray['businessYear']
			}
			, {
				key : 'bizDivNm',
				align:'center',
				width:'200px',
				title : divisionOfBusinessMgmtMsgArray['codeDivision']
			}
			, {
				key : 'bizCd',
				align:'left',
				width:'100px',
				title : divisionOfBusinessMgmtMsgArray['code']
			}
			, {
				key : 'bizNm',
				align:'left',
				width:'300px',
				title : divisionOfBusinessMgmtMsgArray['codeName'],
				editable : {type : "text"}
			}
			, {
				key : 'bizDtlDivCd',
				align:'left',
				width:'200px',
				title : divisionOfBusinessMgmtMsgArray['detailDivisionCode'],
				render : function(value, data){
					console.log("bizDtlDivCd");
					console.log(data);
					if (data.bizDivCd == 'BB01'){
						return '';
					} 
					else {
						return {type: 'string', rule: function(value, data){ return [].concat(prntCdList);}};
					}
				},
				allowEdit : function(value, data){
					if( selectBizDivCd != 'BB01' ) {
						if(data.bizCd != '') {
							return false;
						}
						return true;
					}
					return false;
				},
				editable : { 
					type: 'select', 
					rule: function(value, data) { return prntCdList; } 
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); 
				}
			}
			, {
				key : 'safeMgmtCostFeeRate',
				align:'right',
				width:'100px',
				title : divisionOfBusinessMgmtMsgArray['safeMgmtCostFeeRate'],
				render : function(value, data){
					console.log("bizDtlDivCd");
					console.log(data);
					if (data.bizDivCd == 'BB01'){
						return '';
					} 
					else {
						return {type: 'string', rule: function(value, data){ return data;}};
					}
				},
				allowEdit : function(value, data){
					if (data.bizDivCd == 'BB01'){
						return false;
					}
					return true;
				},
				editable : { 
					type: 'text', 
					attr : { "data-keyfilter-rule" : "digits", "data-keyfilter" : ".", "maxlength" : "6"},
					rule: function(value, data) { 
						return { type: 'string', rule: function(value, data){ return data;}};
					}
				}
			}
			, {
				key : 'useYn',
				align:'center',
				width:'50px',
				title : divisionOfBusinessMgmtMsgArray['useYesOrNo'],
				render : { type: 'string'
					, rule: function(value, data){ 
					 	var render_data = [];
   						var currentData = AlopexGrid.currentData(data);
   						if (useYnCombo) {
   							return render_data = render_data.concat(useYnCombo);
   						} 
   						else {
   							return render_data.concat({value : data.useYn, text : data.useYn});
   						}
		         	}
				},
				editable: function (value, data, render, mapping, grid) {
					var currentData = AlopexGrid.currentData(data);    	            				
					if (currentData.useYn != null && currentData.useYn != '' ) {    	        						
						var $select = $('<select>');
						if (useYnCombo && useYnCombo.length>0) {
							var selectYn = "";
							for (var i=0,l=useYnCombo.length;i<l;i++) {
								if (useYnCombo[i].cd == currentData.useYn) {
									selectYn = "selected";
								} else {
									selectYn = "";
								};
								$select.append('<option value="'+useYnCombo[i].cd+'" ' + selectYn +'>'+useYnCombo[i].cdNm+'</option>');
							}
						}
						return $select;
				    }
				},
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
			}
    	];
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	//extend : ['resultGrid'],
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
        
        $('#'+gridId).on('dblclick', '.bodycell', function(e){
        	var event = AlopexGrid.parseEvent(e);
			var selected = event.data._state.selected;
			
			$('#'+gridId).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
			
			var editing_list = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
			
			for(var i = 0; i < editing_list.length; i++){
				$('#'+gridId).alopexGrid('endEdit', {_index: {id: editing_list[i]._index.id}})
			}
			
			if (checkRowData() == true) {
				var ev = AlopexGrid.parseEvent(e);
				$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
			}
		});
    };
    
    function setCombo() {
    	selectAfeYearCode('bizYr', 'N', '');
    	selectAfeYearCode('bizYrCopy', 'N', '');
    	selectComboCode('bizDivCd', 'N', 'C00851', '');
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
        	
        	var dataParam =  $("#searchForm").getData();
        	
        	selectBizYr = $('#bizYr option:selected').val();
        	selectBizDivCd = $('#bizDivCd option:selected').val();
        	selectBizDivNm = $('#bizDivCd option:selected').text();
        	showProgress(gridId);
        	divisionOfBusinessMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/divisionofbusinessmgmtlist', dataParam, 'GET', 'divisionOfBusinessMgmtList');
        });
        
        //추가
        $('#addRow').on('click', function(e) {
        	
        	if(selectBizYr == "" || selectBizDivCd == "") {
        		alertBox('W', divisionOfBusinessMgmtMsgArray['businessYearCodeDivision']);
        		return false;
        	};
        	
        	var rowData = {
        			bizYr : selectBizYr
    				, bizDivCd : selectBizDivCd
    				, bizDivNm : selectBizDivNm
    				, bizCd : ""
    				, bizNm : ""
    				, useYn : useYnCombo[0].cdNm
    				, safeMgmtCostFeeRate : ""
    		};
        	
        	if(selectBizDivCd == 'BB01') {
        		rowData.bizDtlDivCd = "C00851";
        	}
        	else {
        		
        		if(prntCdList.length > 0) {
        			rowData.bizDtlDivCd = prntCdList[0].cdNm;
        		}
        		else {
        			rowData.bizDtlDivCd = "";
        		}
        	}
        	
    		$('#'+gridId).alopexGrid("dataAdd", rowData);
			$('#'+gridId).alopexGrid('dataScroll', 'bottom');
        });
        
        //삭제
        $('#delRow').on('click', function(e) {
        	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W',divisionOfBusinessMgmtMsgArray['selectData']);
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    
        		console.log(data);
        		
        		if(data.bizCd == "") {
        			var rowIndex = data._index.data;
            		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
        		}
        		else {
        			
        			var dataParam = data;
        			dataParam.flag = "";
        			divisionOfBusinessMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/divisionofbusinessmgmtmodifysearch', dataParam, 'GET', 'divisionOfBusinessMgmtDeleteSearch');
        		}
        	}
        });
        
        //저장
        $('#saveDivOfBizMgmt').on('click', function(e) {   
        	
        	callMsgBox('','C', divisionOfBusinessMgmtMsgArray['save'], function(msgId, msgRst){  
            	if (msgRst == 'Y') {
            		$('#'+gridId).alopexGrid('endEdit', {_state:{editing:true}});
                	
                	var insertList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
                	var updateList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
                	var deleteList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} )); 
                	
                	var dataParam =  $("#searchForm").getData();
                	
                	dataParam.gridData = { 
                			insertList : insertList
                			, updateList : updateList
                			, deleteList : deleteList
                	};
                	console.log(updateList.length);
                	if(selectBizDivCd != 'BB01') {
                		for(i=0; i<insertList.length;i++){
                			var check = insertList[i].safeMgmtCostFeeRate;
                			check.replace(/./gi,"");
                			if(isNaN(check)){
                				alertBox('W',divisionOfBusinessMgmtMsgArray['safeMgmtCostFeeRatePossibleNumberAndDot']);
                				return false;
                			}
                		};
                		for(i=0; i<updateList.length;i++){
                			var check = updateList[i].safeMgmtCostFeeRate;
                			check.replace(/./gi,"");
                			if(isNaN(check)){
                				alertBox('W',divisionOfBusinessMgmtMsgArray['safeMgmtCostFeeRatePossibleNumberAndDot']);
                				return false;
                			}
                		};
                	}
                	bodyProgress();

                	divisionOfBusinessMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/divisionofbusinessmgmtsave', dataParam, 'POST', 'divisionOfBusinessMgmtSave');
            	}
        	});
        	
        });
        
        //연도복사
        $('#bizYrCopyBtn').on('click', function(e) {
        	callMsgBox('','C', divisionOfBusinessMgmtMsgArray['copyYear'], function(msgId, msgRst){  
            	if (msgRst == 'Y') {
            		var selectBizYrCopy = $('#bizYrCopy option:selected').val();
                	
                	if(selectBizYr == "" || selectBizDivCd == "") {
                		alertBox('W',divisionOfBusinessMgmtMsgArray['businessYearCodeDivision']);
                		return false;
                	};
                	
                	if(selectBizYr >= selectBizYrCopy) {
                		alertBox('W',divisionOfBusinessMgmtMsgArray['copyYearSearchShort']);
                		return false;
                	}
                	else {
                		var dataParam =  $("#searchForm").getData();
                		dataParam.flag = "copy";
                		//console.log(dataParam);
                		bodyProgress();

                		divisionOfBusinessMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/divisionofbusinessmgmtmodifysearch', dataParam, 'GET', 'divisionOfBusinessMgmtCopySearch');
                	}
            	}
        	});
        });
        
        //엑셀다운로드
        $('#excelDown').on('click', function(e) {
        	if($("#bizYr").val() == "") {
        		alertBox('W',divisionOfBusinessMgmtMsgArray['businessYearIsCompulsory']);
        		return false;
        	}
        	
        	var dataParam =  $("#searchForm").getData();
        	
        	dataParam = gridExcelColumn(dataParam, gridId);
        	
        	dataParam.fileName = "사업목적관리";
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "DivisionOfBusinessMgmt";
        	bodyProgress();

        	divisionOfBusinessMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
        });
	};
	
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
	
	//request
	function divisionOfBusinessMgmtRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDivisionOfBusinessMgmtCallback(response, sflag);})
    	  .fail(function(response){failDivisionOfBusinessMgmtCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successDivisionOfBusinessMgmtCallback(response, flag){
    	bodyProgressRemove();

    	if(flag == 'divisionOfBusinessMgmtList'){
    		//console.log(response);
    		hideProgress(gridId);
    		$('#'+gridId).alopexGrid("dataSet", response.list);
    		//$("#total").html(response.totalCnt);
    		
    		var dataParam =  $("#searchForm").getData();
    		
    		divisionOfBusinessMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/divisionofbusinessmgmtdivlist', dataParam, 'GET', 'divisionOfBusinessMgmtDivList');
    	}
    	else if(flag == 'divisionOfBusinessMgmtSave') {
    		console.log(response);
    		
    		if(response.Result == "Fail") {
    			alertBox('W',divisionOfBusinessMgmtMsgArray['saveFail']);
    		}
    		else if(response.Result == "NoChange") {
    			alertBox('W',divisionOfBusinessMgmtMsgArray['noChangedData']);
    		}
    		else {
    			alertBox('I',divisionOfBusinessMgmtMsgArray['saveSuccess']);
    			
    			if($('#bizYr option:selected').val() != '' &&  $('#bizDivCd option:selected').val() != '') {
    				$('#search').click();
    			}
    		}
    	}
    	else if(flag == 'divisionOfBusinessMgmtDivList') {
    		prntCdList = response.list;
    		console.log(prntCdList);
    	}
    	else if(flag == 'divisionOfBusinessMgmtDeleteSearch') {
    		
    		if(response.key == 'BB01') {
    			if(response.count == 0) {
    				var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );

    	        	for (var i = dataList.length-1; i >= 0; i--) {
    	        		var data = dataList[i];    
    	        		var rowIndex = data._index.data;
	            		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	        	}
    			}
    			else {
    				alertBox('W',divisionOfBusinessMgmtMsgArray['businessPurposeDeleteForBusinessDivision']);
    				return false;
    			}
    		}
    		else {
    			if(response.count == 0) {
    				var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );

    	        	for (var i = dataList.length-1; i >= 0; i--) {
    	        		var data = dataList[i];    
    	        		var rowIndex = data._index.data;
	            		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	        	}
    			}
    			else {
    				alertBox('W',divisionOfBusinessMgmtMsgArray['businessDivisionExistData']);
    				return false;
    			}
    		}
    	}
    	else if(flag == 'divisionOfBusinessMgmtCopySearch') {
    		if(response.count == 0) {
    			var dataParam =  $("#searchForm").getData();
    			console.log(dataParam);
    			divisionOfBusinessMgmtRequest('tango-transmission-biz/transmisson/demandmgmt/investmentcostmgmt/divisionofbusinessmgmtcopy', dataParam, 'POST', 'divisionOfBusinessMgmtCopy');
    		}
    		else {
    			alertBox('W',divisionOfBusinessMgmtMsgArray['existYearData']);
    			return false;
    		}
    	}
    	else if(flag == 'divisionOfBusinessMgmtCopy') {
    		if(response.Result == "Fail") {
    			alertBox('W',divisionOfBusinessMgmtMsgArray['saveFail']);
    		}
    		else {
    			alertBox('I',divisionOfBusinessMgmtMsgArray['saveSuccess']);
    			
    			if($('#bizYr option:selected').val() != '' &&  $('#bizDivCd option:selected').val() != '') {
    				$('#search').click();
    			}
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
    function failDivisionOfBusinessMgmtCallback(serviceId, response, flag){
    	//console.log(response);
    	hideProgress(gridId);
    	bodyProgressRemove();

    	alertBox('W',divisionOfBusinessMgmtMsgArray['abnormallyProcessed']);
    }
});