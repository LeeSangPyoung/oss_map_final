/**
 * ErpPriceList
 * 
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    var gridIdPop1 = 'resultGrid1';
    var gridIdPop2 = 'resultGrid2';
    var eqpTypList = [];
    var demdBizDivList = [];
    var demdBizDivDetlList = [];
    
    // Map형태 사업구분(대/세부)
    var demdBizDivCombo = [];
    var demdBizDivDetlCombo = [] ;
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	//console.log(id,param);
        setCombo();
        initGrid();
    	setEventListener();
    	$('#procTypOne').setSelected();
    	//selectErpAprvPrevList();
    	
    };
    
  //Grid 초기화
    function initGrid() {
        
        var mapping1 =  [
              { selectorColumn : true, width : '35px' }
	 		, { key : 'check', align:'left', width:'30px', title : '번호', numberingColumn : true }
		 	, { key : 'wbsTyp', align:'left', width:'80px', title : 'WBS' }
		 	, { key : 'eqpTypCd', align:'left', width:'100px', title : demandMsgArray['equipmentType'] /*'장비타입'*/
		 		, render : {
      	    		type : 'string',
      	    		rule : function(value, data) {
      	    			var render_data = [];
      	    			if(eqpTypList.length > 0) {
      	    				return render_data = render_data.concat(eqpTypList);
      	    			}else {
      	    				return render_data.concat({value : data.eqpTypCd, text : data.eqpTypNm });
      	    			} 
      	    		}
      	    	}      	    	
		 	   }
		 	, { key : 'bizCstrTypCd', align:'left', width:'100px', title : '공사유형코드' /*'공사유형코드'*/, hidden : true }
		 	, { key : 'bizCstrTypCdNm', align:'left', width:'100px', title : '공사유형' /*'공사유형'*/ }
	 		, { key : 'noneBizCnt', align:'left', width:'80px', title : '지정가능 건수', align:'right', hidden : false
	 			, render : function(value, data) {
	 				if (value == null ) {
	 					return 0;
	 				} else {
	 					return value;
	 				}
	 			}	
	 		    , inlineStyle : {color : 'blue', cursor:'pointer'}
	 		  } 
		 	, { key : 'demdBizDivCd', title : demandMsgArray['businessDivisionBig']/*'사업구분'*/, align: 'left', width: '150px'
		 		, render : {
      	    		type : 'string',
      	    		rule : function(value, data) {      	    			
      	    				var render_data = [];
	      	    			
      	    				render_data = render_data.concat({value : '', text : demandMsgArray['select'] /* 선택 */});
      	    				//render_data = render_data.concat(demdBizDivList);
      	    				if(demdBizDivCombo[data.wbsTyp+ "_" +data.eqpTypCd]){
      	    					render_data = render_data.concat(demdBizDivCombo[data.wbsTyp+ "_" +data.eqpTypCd]);
      	    				} else {
      	    					if (demdBizDivCombo[data.wbsTyp]) {
          	    					render_data = render_data.concat(demdBizDivCombo[data.wbsTyp]);
      	    					}
      	    				}
	      	    			return render_data;
      	    		}
      	    	}
      	    	, editable:{
      	    		type:"select", 
      	    		rule : function(value, data){
      	    			var render_data = [];
      	    			var currentData = AlopexGrid.currentData(data);
      	    			render_data = render_data.concat({value : '', text : demandMsgArray['select'] /* 선택 */});
      	    			if(demdBizDivCombo[currentData.wbsTyp+ "_" +currentData.eqpTypCd]){
      	    				render_data = render_data.concat( demdBizDivCombo[currentData.wbsTyp+ "_" +currentData.eqpTypCd] );
  	    				} else{
  	    					if (demdBizDivCombo[currentData.wbsTyp] ) {
  	  	    					render_data = render_data.concat( demdBizDivCombo[currentData.wbsTyp] );
  	    					}
  	    				}
      	    			/*render_data = render_data.concat(makeCombo("demdBizDivCd", currentData.eqpTypCd, null, data));  */
      	    			if (render_data.length == 2) {
      	    				if (nullToEmpty(data.demdBizDivCd) == "" ) {
				    			data.demdBizDivCd = render_data[1].value ;
				    		}
      	    			}
      	    			return render_data;
      	    		}
      	    	  , attr : {style : "width: 140px;min-width:115px;padding: 2px 2px;"}
      	    	}
      	    	, editedValue : function(cell) {
  					return $(cell).find('select option').filter(':selected').val(); 
  				}
      	    	, refreshBy : 'eqpTypCd'
      	    } 
		 	, { key : 'demdBizDivDetlCd', title : demandMsgArray['businessDivisionDetl']/*'세부사업구분'*/, align: 'left', width: '250px'
		 		, render : {
      	    		type : 'string',
      	    		rule : function(value, data) {      	    			
      	    				var render_data = [];	      	    			
      	    				render_data = render_data.concat({value : '', text : demandMsgArray['select'] /* 선택 */});
      	    				//render_data = render_data.concat(demdBizDivDetlList);
      	    				if (demdBizDivDetlCombo[data.wbsTyp+ "_" +data.eqpTypCd + "_" + data.demdBizDivCd]) {
      	    					render_data = render_data.concat(demdBizDivDetlCombo[data.wbsTyp+ "_" +data.eqpTypCd + "_" + data.demdBizDivCd]);
      	    				} else {
      	    					if (demdBizDivDetlCombo[data.wbsTyp + "_" + data.demdBizDivCd]) {
      	    						render_data = render_data.concat(demdBizDivDetlCombo[data.wbsTyp + "_" + data.demdBizDivCd]);
      	    					}
      	    				} 
      	    				
	      	    			return render_data;
      	    		}
      	    	}
      	    	, editable:{
      	    		type:"select", 
      	    		rule : function(value, data){
      	    			var render_data = [];
      	    			var currentData = AlopexGrid.currentData(data);
      	    			render_data = render_data.concat({value : '', text : demandMsgArray['select'] /* 선택 */});
      	    			//render_data = render_data.concat(makeCombo("demdBizDivDetlCd", currentData.eqpTypCd, currentData.demdBizDivCd, data));
      	    			var currentData = AlopexGrid.currentData(data);
 	    				if (demdBizDivDetlCombo[currentData.wbsTyp + "_" +currentData.eqpTypCd  + "_" + currentData.demdBizDivCd]){
     	    				render_data = render_data.concat( demdBizDivDetlCombo[currentData.wbsTyp + "_" +currentData.eqpTypCd  + "_" + currentData.demdBizDivCd] );
 	    				} else {
 	    					if (demdBizDivDetlCombo[currentData.wbsTyp + "_" + currentData.demdBizDivCd]) {
 	    						render_data = render_data.concat( demdBizDivDetlCombo[currentData.wbsTyp + "_" + currentData.demdBizDivCd] );
 	    					}
 	    				}
      	    			return render_data;
      	    		}
      	    	  , attr : {style : "width: 240px;min-width:115px;padding: 2px 2px;"}
      	    	}
      	    	, editedValue : function(cell) {
  					return $(cell).find('select option').filter(':selected').val(); 
  				}
      	    	, refreshBy : function(previousValue, changedValue, changedKey, changedData, changedColumnMapping){ 
      	    		if(changedKey == "demdBizDivCd" || changedKey == "eqpTypCd"){		  				
		  				return true;
		  			}else{ 
		  				return false;
		  			}
      	    	}
      	      }
		 	, {key : 'startWbsTyp',	title : '시작',	align:'left',	width: '120px'		 		
		 		, editable : function(value, data, render, mapping) {
		 			$autocomplete = $('<div class="Autocomplete" id="startWbsSeq" data-dynamic-dropdown="true" data-maxheight="4" data-fitwidth="false" data-type="autocomplete"' 
		 					         + ' data-classinit="true" data-converted="true" data-bind-option="value:text">');
		 			$autocomplete.append('<input class="Textinput" data-type="textinput" data-classinit="true" data-converted="true"  tabindex="0" style="width:120px;" value=' + nullToEmpty(value) + '> ');
           			return $autocomplete;
           		}		 	    
		 	  }
		 	, {key : 'endWbsTyp',	title : '끝',	align:'left',	width: '120px'
		 		 , editable : function(value, data, render, mapping) {
			 			$autocomplete = $('<div class="Autocomplete" id="endWbsSeq" data-dynamic-dropdown="true" data-maxheight="4" data-fitwidth="false" data-type="autocomplete"' 
	 					         + ' data-classinit="true" data-converted="true" data-bind-option="value:text">');
			 			$autocomplete.append('<input class="Textinput" data-type="textinput" data-classinit="true" data-converted="true"  tabindex="0" style="width:120px;" value=' + nullToEmpty(value) + '> ');
		      			return $autocomplete;
		 		 }
		      }	 		
			];
		
	     //그리드 생성
	     $('#'+gridIdPop1).alopexGrid({
	         cellSelectable : true,
	         autoColumnIndex : true,
	         fitTableWidth : true,
	         rowClickSelect : true,
	         rowSingleSelect : false,
	         rowInlineEdit : true,
	         numberingColumnFromZero : false
	         , height : 470
	         ,paging: {
        	   pagerTotal:true,
        	   pagerSelect:false,
        	   hidePageList:true
             } 
	         ,columnMapping : mapping1
	         ,message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
					filterNodata : 'No data'
			 }
	     });
	     
	     

	        var mapping2 =  [
		 		  { key : 'check', align:'left', width:'30px', title : '번호', numberingColumn : true }
			 	, { key : 'wbsTyp', align:'left', width:'80px', title : 'WBS' }
			 	, { key : 'eqpTypNm', align:'left', width:'100px', title : demandMsgArray['equipmentType'] /*'장비타입'*/ }
			 	, { key : 'bizCstrTypCd', align:'left', width:'100px', title : '공사유형코드' /*'공사유형코드'*/, hidden : true }
			 	, { key : 'bizCstrTypCdNm', align:'left', width:'100px', title : '공사유형' /*'공사유형'*/ }
			 	, { key : 'demdBizDivNm', title : demandMsgArray['businessDivisionBig']/*'사업구분'*/, align: 'left', width: '130px'} 
			 	, { key : 'demdBizDivDetlNm', title : demandMsgArray['businessDivisionDetl']/*'세부사업구분'*/, align: 'left', width: '200px'}
		 		, { key : 'bizTotCnt', align:'left', width:'60px', title : '총건수', align:'right'
		 			, render : function(value, data) {
		 				if (value == null ) {
		 					return 0;
		 				} else {
		 					return value;
		 				}
		 			}
		 		  } 
		 		, { key : 'bizUsedCnt', align:'left', width:'60px', title : '사용 건수', align:'right'
		 			, render : function(value, data) {
		 				if (value == null ) {
		 					return 0;
		 				} else {
		 					return value;
		 				}
		 			}	 			
		 		  } 
		 		, { key : 'bizPreForCleCnt', align:'left', width:'70px', title : '미사용 건수', align:'right'
		 			, render : function(value, data) {
		 				if (value == null ) {
		 					return 0;
		 				} else {
		 					return value;
		 				}
		 			}
 		    		, inlineStyle : {color : 'blue', cursor:'pointer'}	 			
		 		  } 
			 	, {key : 'startWbsTyp',	title : '시작',	align:'left',	width: '120px'
			 		, editable : function(value, data, render, mapping) {
			 			$autocomplete = $('<div class="Autocomplete" id="startWbsSeq" data-dynamic-dropdown="true" data-maxheight="4" data-fitwidth="false" data-type="autocomplete"' 
			 					         + ' data-classinit="true" data-converted="true" data-bind-option="value:text">');
			 			$autocomplete.append('<input class="Textinput" data-type="textinput" data-classinit="true" data-converted="true"  tabindex="0" style="width:120px;" value=' + nullToEmpty(value) + '> ');
	           			return $autocomplete;
	           		}
			 	}
			 	, {key : 'endWbsTyp',	title : '끝',	align:'left',	width: '120px'
			 		, editable : function(value, data, render, mapping) {
			 			$autocomplete = $('<div class="Autocomplete" id="endWbsSeq" data-dynamic-dropdown="true" data-maxheight="4" data-fitwidth="false" data-type="autocomplete"' 
	 					         + ' data-classinit="true" data-converted="true" data-bind-option="value:text">');
			 			$autocomplete.append('<input class="Textinput" data-type="textinput" data-classinit="true" data-converted="true"  tabindex="0" style="width:120px;" value=' + nullToEmpty(value) + '> ');
		      			return $autocomplete;
			 		}
			 	  }		 		
				];
			
		     //그리드 생성
		     $('#'+gridIdPop2).alopexGrid({
		         cellSelectable : true,
		         autoColumnIndex : true,
		         fitTableWidth : true,
		         rowClickSelect : true,
		         rowSingleSelect : false,
		         rowInlineEdit : true,
		         numberingColumnFromZero : false
		         , height : 470
		         ,paging: {
	        	   pagerTotal:true,
	        	   pagerSelect:false,
	        	   hidePageList:true
	             } 
		         ,columnMapping : mapping2
		         ,message: {
						nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
						filterNodata : 'No data'
				 }
		     });
	     	     
    };

    function setEventListener() {    	

    	$("#pageNo").val(1);
    	$('#rowPerPage').val(20);
    	
    	//AFE 구분 콤보박스
        $('#afeYrPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = this.value;
    		dataParam.flag = 'preApev';
    		
    		selectAfeTsCode('afeDemdDgrPop', 'N', '', dataParam);
    		dataParam.flag = 'preApev';
    		
    		selectComboCodeByErp('erpBizDivCdPop', 'N', '', dataParam);
        });
        
        //AFE 차수 콤보박스
        $('#afeDemdDgrPop').on('change',function(e) {
    		/*var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = this.value;
    		dataParam.flag = 'preApev';
    		
    		selectComboCodeByErp('erpBizDivCdPop', 'N', '', dataParam);*/

    		// WBS 추출
    		var dataParamWbs =  $("#searchForm").getData();
    		dataParamWbs.afeYr = dataParamWbs.afeYrPop;
    		dataParamWbs.afeDemdDgr = dataParamWbs.afeDemdDgrPop;
    		dataParamWbs.erpHdofcCd = dataParamWbs.erpHdofcCdPop;
    		dataParamWbs.erpBizDivCd = dataParamWbs.erpBizDivCdPop;
        	dataParamWbs.demdBizDivDetlCd = dataParamWbs.demdBizDivDetlCdPop;   // commonVO에 없어서
        	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParamWbs, 'GET', 'selectWbsList');
        });
        
        //AFE 차수 콤보박스
        $('#erpBizDivCdPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.flag = 'preApev';
    		
    		selectYearBizComboByErp('demdBizDivCdPop', 'S', '', dataParam);

    		// WBS 추출
    		var dataParamWbs =  $("#searchForm").getData();
    		dataParamWbs.afeYr = dataParamWbs.afeYrPop;
    		dataParamWbs.afeDemdDgr = dataParamWbs.afeDemdDgrPop;
    		dataParamWbs.erpHdofcCd = dataParamWbs.erpHdofcCdPop;
    		dataParamWbs.erpBizDivCd = dataParamWbs.erpBizDivCdPop;
        	dataParamWbs.demdBizDivDetlCd = dataParamWbs.demdBizDivDetlCdPop;   // commonVO에 없어서
        	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParamWbs, 'GET', 'selectWbsList');
        });
        
        //본부 콤보박스        
    	$('#erpHdofcCdPop').on('change',function(e) {  
    		// WBS 추출
    		var dataParamWbs =  $("#searchForm").getData();
    		dataParamWbs.afeYr = dataParamWbs.afeYrPop;
    		dataParamWbs.afeDemdDgr = dataParamWbs.afeDemdDgrPop;
    		dataParamWbs.erpHdofcCd = dataParamWbs.erpHdofcCdPop;
    		dataParamWbs.erpBizDivCd = dataParamWbs.erpBizDivCdPop;
        	dataParamWbs.demdBizDivDetlCd = dataParamWbs.demdBizDivDetlCdPop;   // commonVO에 없어서
        	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParamWbs, 'GET', 'selectWbsList');
        });
    	
    	var tmpErpBizTypCdPop = "";
    	// ERP 공사유형드 변경 시 erp 사업유형 리스트 갱신해준다.
        $('#erpBizTypCd').on('change',function(e) {
        	if (tmpErpBizTypCdPop == this.value) {
        		return;
        	}
        	tmpErpBizTypCdPop = this.value;
        	
    		var dataParamWbs =  $("#searchForm").getData();
    		dataParamWbs.afeYr = dataParamWbs.afeYrPop;
    		dataParamWbs.afeDemdDgr = dataParamWbs.afeDemdDgrPop;
    		dataParamWbs.erpHdofcCd = dataParamWbs.erpHdofcCdPop;
    		dataParamWbs.erpBizDivCd = dataParamWbs.erpBizDivCdPop;
        	dataParamWbs.demdBizDivDetlCd = dataParamWbs.demdBizDivDetlCdPop;   // commonVO에 없어서
        	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParamWbs, 'GET', 'selectWbsList');
        });        
        
        $('#demdBizDivCdPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.demdBizDivCd = dataParam.demdBizDivCdPop;
    		
    		selectYearBizComboByErp('demdBizDivDetlCdPop', 'S', '', dataParam);
        });
        
        $('#btn_search').on('click', function(e) {
        	selectDefBivDivInfList();
        });
        
        // 지정 취소
        $('#btn_def , #btn_cle').on('click', function(e) {
        	updateExecBizDiv();
        });
        // 닫기
        $('#btn_close').on('click', function(e) {
        	$a.close();
        });
        
        // 복제
        $('#btnCopyRow').on('click', function(e) {
        	var copyList = AlopexGrid.currentData ( $('#'+gridIdPop1).alopexGrid("dataGet", { _state : {selected:true }} ));
        	if (copyList == null || copyList.length <= 0) {
        		alertBox('W', "선택된 데이터가 없습니다."); 
        		return false;
        	}
        	else if (copyList.length >1) {
        		alertBox('W', "1건만 선택해 주세요."); 
                return false;
        	}
        	// 복제
        	var initRowData = [
        	           	    {
        	           	    	"wbsTyp" : copyList[0].wbsTyp,
        	           	    	"eqpTypCd" : copyList[0].eqpTypCd,
        	           	    	"noneBizCnt" : copyList[0].noneBizCnt,
        	           	    	"bizCstrTypCd" : copyList[0].bizCstrTypCd,
        	           	    	"bizCstrTypCdNm" : copyList[0].bizCstrTypCdNm,
        	           	    	"demdBizDivCd" : "",
        	           	    	"demdBizDivDetlCd" : "",
        	           	    	"startWbsTyp" : "",
        	           	    	"endWbsTyp" : ""
        	           	    }               
        	           	];
        	
        	$('#'+gridIdPop1).alopexGrid("endEdit");
           	$('#'+gridIdPop1).alopexGrid("dataAdd", initRowData, {_index:{row:copyList[0]._index.row+1}});
        	$('#'+gridIdPop1).alopexGrid("startEdit");
        });
        
        // 삭제
        $('#btnRemoveRow').on('click', function(e) {
        	var dataList = AlopexGrid.currentData ( $('#'+gridIdPop1).alopexGrid("dataGet", { _state : {selected:true }} ));
        	if (dataList == null || dataList.length <= 0) {
        		alertBox('W', "선택된 데이터가 없습니다."); 
        		return;
        	}
        	// 삭제
        	for (var i = dataList.length-1; i >= 0; i--) {
        		$( '#'+gridIdPop1).alopexGrid("dataDelete", {_index : { row:dataList[i]._index.row }});
        	}    	
        	
        });
        
        // 그리드 편집시
        $('#'+gridIdPop1 + ', #' + gridIdPop2).on('keyup', function(e) {
        	if(e.keyCode == 38 || e.keyCode == 40){
        		return;
        	}
        	var ev = AlopexGrid.parseEvent(e);        	
        	var result;
        	var data = ev.data;
        	
        	if (data == undefined) {
        		return;
        	}
        	
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	var editRow = data._index.row;
        	        	
        	var procTyp = $('input:radio[name="procTyp"]').getValue();
        	
        	var procList = [];
        	var editGridId = gridIdPop1;
        	if (procTyp == "C") {
        		editGridId = gridIdPop2;
        	} 
        	procList = $('#'+editGridId).alopexGrid("dataGet");
        	var procData = procList[editRow];
        	        	
        	if ( ev.mapping.key == "startWbsTyp" ||  ev.mapping.key == "endWbsTyp"  ) {
        		var chkData  = AlopexGrid.currentValue(data,  ev.mapping.key ) ;
        		        		
        		// 데이터가 없으면 지우고 검색하지 않는다
            	if (nullToEmpty(chkData) == '') {
            		setTimeout(function(){
        				$('.Dropdown').css("display","none");
            		}, 200);
            		return false;
            	}
            	
        		var dataParam = {
        				  'wbsTyp' : procData.wbsTyp
        				, 'startWbsTyp' : (ev.mapping.key == "startWbsTyp" ? chkData : "")
        				, 'endWbsTyp' : (ev.mapping.key == "endWbsTyp" ? chkData : "") 
        				, 'eqpTypCd' : procData.eqpTypCd  //( procTyp == "S" ? procData.eqpTypCd : "")
        				, 'demdBizDivCd' : ( procTyp == "C" ? procData.demdBizDivCd : "")
        				, 'demdBizDivDetlCd' : ( procTyp == "C" ? procData.demdBizDivDetlCd : "")
        				, 'jobTyp' : procTyp
        		}
        		demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/selectwbsseq', dataParam , 'GET', 'selectWbsSeq');
        	}       		
    	});
                       
        $('#'+gridIdPop1 + ', #' + gridIdPop2).on('focusin', function(e) {
        	var ev = AlopexGrid.parseEvent(e);   
        	if (ev == undefined || ev.mapping == undefined || ev.mapping.key == undefined) {
        		return;
        	}
        	if ( ev.mapping.key == "startWbsTyp" ||  ev.mapping.key == "endWbsTyp"  ) { 
    			      		
        		setTimeout(function(){    
        			$('.Dropdown').css("display","none");
        			var procTyp = $('input:radio[name="procTyp"]').getValue();
        			var setGridId = gridIdPop1;
        			var setWbsSeqId = "startWbsSeq";
        			// 취소			
        			if (procTyp == "C") {
        				setGridId = gridIdPop2;
        				setWbsSeqId = "endWbsSeq";
        			}    			

            		var wbsSeqDivId = $('#'+setGridId).alopexGrid('cellElementGet',  {_index: {row: ev.data._index.row}}, ev.mapping.key).attr('id');  
            		
        			var dropDown = $(".Dropdown");
        			if (nullToEmpty(dropDown) != "" && dropDown.length > 0 
        					&& nullToEmpty($('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input')) != ""
        					&& $('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input').length > 0	
        			    ) {
        				for (var i = 0 ; i < dropDown.length; i++) {
        					if (dropDown[i].base.id == $('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input')[0].id) {
        						/*if (dropDown[i].base.dropdown.style.display == "none") {
        							dropDown[i].base.dropdown.style.display = "block";
        						}*/
        					} 
        					// 현재 DOM 개체 이외의 개체의 DropDown이 열려있다면 닫아주자
        					else { 
        						$('#' + dropDown[i].base.id).click();
        					}
        				}
        			}
        			
        			$(".Dropdown").css("display", "block");
            		$(".Dropdown").css("max-height",'200px');
            		$(".Dropdown").css("z-index",99999);
            		
        		}, 800); 
        	}      	
        });
        

        $('#'+gridIdPop1 + ', #' + gridIdPop2).on('focusout', function(e) {
        	var ev = AlopexGrid.parseEvent(e);   
        	if (ev == undefined || ev.mapping == undefined || ev.mapping.key == undefined) {
        		return;
        	}
        	if ( ev.mapping.key == "startWbsTyp" ||  ev.mapping.key == "endWbsTyp"  ) {        		
        		setTimeout(function(){
        			var procTyp = $('input:radio[name="procTyp"]').getValue();
        			var setGridId = gridIdPop1;
        			var setWbsSeqId = "startWbsSeq";
        			// 취소			
        			if (procTyp == "C") {
        				setGridId = gridIdPop2;
        				setWbsSeqId = "endWbsSeq";
        			}    			

            		var wbsSeqDivId = $('#'+setGridId).alopexGrid('cellElementGet',  {_index: {row: ev.data._index.row}}, ev.mapping.key).attr('id');  
            		$('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input').click();
        			
            		var dropDown = $(".Dropdown");
            		if (nullToEmpty(dropDown) != "" && dropDown.length > 0 
        					&& nullToEmpty($('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input')) != ""
        					&& $('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input').length > 0	
        			    ) {
        				$('.Dropdown').css("display","none");
        				for (var i = 0 ; i < dropDown.length; i++) {
        					// 현재 포커스가 사라지는 컬럼의 .Dropdown 열려있는경우만 닫기
        					if (dropDown[i].base.id == $('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input')[0].id) {
        						$('#' + dropDown[i].base.id).click();
        					}
        				}
        			} 
        		}, 300); 
        	}       	
        });
    	                
        // 작업종류
        $('input:radio[name="procTyp"]').change(function() {
	 		// 지정
        	var procTyp = $(this).getValue();
    		if ( procTyp == 'S' ) {
    			$('#btn_def').show();
    			$('#btn_cle').hide();
    			$('#'+gridIdPop1).show();  // 지정 그리드
    			$('#'+gridIdPop2).hide();  // 초기화 그리드
    			$('.clear').hide();   // 사업구분 조건
    			
    			// 복사/삭제 버튼
    			$('.procTypOne').show();

 				$('#'+gridIdPop1).alopexGrid("viewUpdate");
    		}
    		else if (procTyp == 'C') {
    			$('#btn_def').hide();
    			$('#btn_cle').show();  
 			    $('#'+gridIdPop1).hide();  // 지정 그리드
   			    $('#'+gridIdPop2).show();  // 초기화 그리드
    			$('.clear').show();   // 사업구분 조건
    			// 복사/삭제 버튼
    			$('.procTypOne').hide();
   			   
				$('#'+gridIdPop2).alopexGrid("viewUpdate");
    		}
    		$('.Dropdown').css("display","none");
    	});
        
     // 그리드 편집시
        $('#'+gridIdPop1 + ', #' + gridIdPop2).on('dblclick', function(e) {
        	var ev = AlopexGrid.parseEvent(e);  
        	var data = ev.data;
        	if (data == undefined) {
        		return;
        	}
        	
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	        	
        	if ( ev.mapping.key == "noneBizCnt" ||  ev.mapping.key == "bizPreForCleCnt"  ) {
        		var rowIndex = ev.data._index.row;
        		showWbsInf(data, rowIndex);
        	}       		
    	});
	};
	
	//request
	function demandRequestPop(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandPopCallback(response, sflag);})
    	  .fail(function(response){failDemandPopCallback(response, sflag);})
    	  //.error();
    }

    function selectDefBivDivInfList(){
    	
    	//showProgress(gridIdPop1);

		var procTyp = $('input:radio[name="procTyp"]').getValue();
		
		// 필수체크
		if($('#afeYrPop').val() == "" || $('#afeDemdDgrPop').val() == ""){
			alertBox('W', 'AFE 구분 선택은 필수입니다.'); 
    		return;
		}
		/*if($('#wbsTypPop').val() == "" ) {
			alertBox('W', 'WBS 선택은 필수입니다.'); 
    		return;
		}*/
		if($('#erpBizDivCdPop').val() == "") {
			alertBox('W', 'ERP사업구분 선택은 필수입니다.'); 
    		return;
		}
		
		$('.Dropdown').css("display","none");
		bodyProgress();
		
		var dataParam =  $("#searchForm").getData();
		
		// 사업구분 지정작업인 경우 사업구분 대/세부 검색조건 지우기
		if (procTyp == "S") {
			dataParam.demdBizDivCdPop = "";
			dataParam.demdBizDivDetlCdPop = "";
		}
		dataParam.erpBizTypCd = dataParam.erpBizTypCdPop;
		dataParam.wbsTyp = dataParam.wbsTypPop;
		dataParam.jobTyp = procTyp;
    	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/defbizdivinflist', dataParam, 'GET', 'search');
    }
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};

    function setCombo(){
    	//AFE 구분 콤보박스
    	selectAfeYearCode('afeYrPop', 'N', '');
    	
    	//본부 콤보박스
    	//selectComboCode('erpHdofcCdPop', 'N', 'C00623', '');
    	setErpHdofcCdPop();
    	
    	//ERP 공사유형 콤보박스
    	selectComboCode('erpBizTypCdPop', 'Y', 'C02510', 'T');
    	// 공사유형 콤보박스
    	var comCdParam = {
				comGrpCd : 'C00619'
			};
		demandRequestPop(
				'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
				comCdParam, 'GET', "bizCstrTypCdPop");
    }   
    
    function setErpHdofcCdPop() {
  	
	  	var requestParam = { comGrpCd : 'C00623' };
	  	Tango.ajax({
	  		url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
	  		data : requestParam,
	  		method : 'GET'
	  	}).done(function(response){
	  		var erpHdofcCd = [];
	  		 $.each(response, function(idx, obj){
	  			 if (obj.value != "1000") {
	  				erpHdofcCd.push(obj); 
	  			 }
	  		 });
	  		 
  			$('#erpHdofcCdPop').setData({
  				data : erpHdofcCd
  			}); 

	  		$('#erpHdofcCdPop').prepend('<option value="" selected>' + demandMsgArray['all'] + '</option>');  // 전체
   		    $('#erpHdofcCdPop').setSelected(""); 
   		    
   		    // 만약 WBS 취득이 안되어 있다면 취득
   		    /*if (nullToEmpty($('#wbsTypPop').getTexts()) == '' || $('#wbsTypPop').getTexts().length == 0) {
   		    	var dataParamWbs =  $("#searchForm").getData();
   	    		dataParamWbs.afeYr = dataParamWbs.afeYrPop;
   	    		dataParamWbs.afeDemdDgr = dataParamWbs.afeDemdDgrPop;
   	    		dataParamWbs.erpHdofcCd = dataParamWbs.erpHdofcCdPop;
   	    		dataParamWbs.erpBizDivCd = dataParamWbs.erpBizDivCdPop;
   	        	dataParamWbs.demdBizDivDetlCd = dataParamWbs.demdBizDivDetlCdPop;   // commonVO에 없어서
   	        	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/common/selectwbslist', dataParamWbs, 'GET', 'selectWbsList');
   		    }*/
	  	}).fail(function(response){
	  		  
	  	  })
    }
    
    function showWbsInf(wbsData, rowIndex) {
    	var url = 'WbsSeqInfPop.do';
    	var procTyp = $('input:radio[name="procTyp"]').getValue();      	
    	
    	wbsData.procTyp = procTyp;
    	$a.popup({
    		popid: "WbsSeqInfPop",
    	  	title: 'Wbs 정보',
    	  	url: url,
    	    data: wbsData,
    	    iframe: true,
    	    modal: true,
    	    movable:false,
    	    windowpopup : false,
    	    width : 500,
    	    height : 600,
    	    callback:function(data){
    	    	if (data != null) {
    	    		var setGridId = gridIdPop1;
    				// 취소			
    				if (procTyp == "C") {
    					setGridId = gridIdPop2;    					
    				}
    	    		$('#'+setGridId).alopexGrid('cellEdit', data.startWbsTyp, {_index : { row : rowIndex}}, 'startWbsTyp');
    	    		//$('#'+setGridId).alopexGrid('refreshCell', {_index: {row: rowIndex}}, 'startWbsTyp');
	    			$('#'+setGridId).alopexGrid('cellEdit', data.endWbsTyp, {_index : { row : rowIndex}}, 'endWbsTyp');
	    			//$('#'+setGridId).alopexGrid('refreshCell', {_index: {row: rowIndex}}, 'endWbsTyp');
    	    	}
    	    	// 다른 팝업에 영향을 주지않기 위해
 				$.alopex.popup.result = null; 
    	    }
    	});
    }
        
    function updateExecBizDiv(){
        var procTyp = $('input:radio[name="procTyp"]').getValue();
    	
    	//$('#'+gridIdPop1).alopexGrid("endEdit");
    	//$('#'+gridIdPop2).alopexGrid("endEdit");
    	var procList =  [];
    	var msg = "";
    	
    	if (procTyp == "S") {
    		procList = AlopexGrid.currentData($('#'+gridIdPop1).alopexGrid("dataGet"));
    		msg = "지정";
    	} else {
    		procList = AlopexGrid.currentData($('#'+gridIdPop2).alopexGrid("dataGet"));
    		msg = "취소";
    	}
    	var chkCnt = 0;
    	var setDemdBizDivList = [];
    	for (var i = 0 ; i < procList.length; i++ ) {
			// 사업구분 미지정
			if ((nullToEmpty(procList[i].startWbsTyp) != "" && nullToEmpty(procList[i].endWbsTyp) != "")
				&& (nullToEmpty(procList[i].demdBizDivCd) == "" || nullToEmpty(procList[i].demdBizDivDetlCd) == "")) {
				alertBox('W',"사업구분을 지정할 시작/끝 값을 입력한 경우 사업구분 대/세부를 선택해 주세요.");
	    		//$('#'+gridIdPop1).alopexGrid("startEdit");
	    		//$('#'+gridIdPop2).alopexGrid("startEdit");
	    		return;
			}
			else if ((nullToEmpty(procList[i].startWbsTyp) != "" && nullToEmpty(procList[i].endWbsTyp) == "")
					|| (nullToEmpty(procList[i].startWbsTyp) == "" && nullToEmpty(procList[i].endWbsTyp) != "")) {
				alertBox('W', msg + "할 시작/끝 모두 입력해 주세요");
	    		//$('#'+gridIdPop1).alopexGrid("startEdit");
	    		//$('#'+gridIdPop2).alopexGrid("startEdit");
	    		return;
			}
			// 4자리
			else if ((nullToEmpty(procList[i].startWbsTyp) != "" && procList[i].startWbsTyp.length != 4)
					|| (nullToEmpty(procList[i].endWbsTyp) != "" && procList[i].endWbsTyp.length != 4)) {
				alertBox('W', msg + "할 시작/끝 모두 4자(숫자, 알파벳)로 입력해 주세요");
	    		//$('#'+gridIdPop1).alopexGrid("startEdit");
	    		//$('#'+gridIdPop2).alopexGrid("startEdit");
	    		return;
			}
			
    		if (nullToEmpty(procList[i].startWbsTyp) != "" &&  nullToEmpty(procList[i].endWbsTyp) != "" ) {
				chkCnt++;
				setDemdBizDivList.push(procList[i]);
			}
			if (nullToEmpty(procList[i].startWbsTyp) != "" ) {
				procList[i].demdBizDivNm = getDemdBizNm("1", procList[i].demdBizDivCd);
				procList[i].demdBizDivDetlNm = getDemdBizNm("2", procList[i].demdBizDivDetlCd);
			}
			
    	}
    	if (chkCnt == 0) {
    		alertBox('W', "수정할 데이터가 없습니다.");
    		//$('#'+gridIdPop1).alopexGrid("startEdit");
    		//$('#'+gridIdPop2).alopexGrid("startEdit");
    		return;
    	}
    	
    	var procMsg = "사업구분(대/세부)를" + (procTyp == "S" ? " 지정 " : " 초기화") + " 하시겠습니까?";

		/* 작업별 처리 가능 건수 체크
    	 * 지정 : 지정가능건수를 초과하지 않는지 체크
    	 * 초기화 : 초기화 가능건수를 초과하지 않는지 체크
    	 * 
    	 */
    	var dataParam = {
    			 "procList" : setDemdBizDivList
    		   , "jobTyp" : procTyp
    	}
    	
    	callMsgBox('','C', procMsg, function(msgId, msgRst){  

    		if (msgRst == 'Y') {
    			bodyProgress();
    	    	
    			demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/updateExecBizDiv', dataParam, 'POST', 'updateExecBizDiv');
    		}
    	});

		//$('#'+gridIdPop1).alopexGrid("startEdit");
		//$('#'+gridIdPop2).alopexGrid("startEdit");
    }
    
    /* 사업구분(대/세부) 콤보 만들기
     * comboTyp : 사업구분 대/세부
     * eqpTypCd : 장비역할
     * demdBizDivCd : 사업구분(대)
     * data : 설정할 데이터
     */    
    function makeCombo(comboCd, eqpTypCd, demdBizDivCd, data) {
    	var procTyp = $('input:radio[name="procTyp"]').getValue();
    	
    	var setGridId = gridIdPop1;
    	if (procTyp == "C") {
    		setGridId = gridIdPop2;
    	}
    	
    	var comboList = [];
    	var comboAllList = [];
    	// 사업구분 (대)
    	if (comboCd == "demdBizDivCd") {
    		// 장비역할 값이 있는 경우
    		if (nullToEmpty(eqpTypCd) != "") {
	    		for (var i = 0; i < demdBizDivList.length; i++) {
	    			// WBS Type 이 같고 같은 장비군
    				if (nullToEmpty(demdBizDivList[i].wbsTyp).indexOf(data.wbsTyp) > -1 && nullToEmpty(demdBizDivList[i].eqpTypCd).indexOf(eqpTypCd) > -1 ) {
    					comboList.push(demdBizDivList[i]);
    				}
    				// 장비역할에 해당하는 사업구분(대)가 없는경우
    				else if (nullToEmpty(demdBizDivList[i].wbsTyp).indexOf(data.wbsTyp) > -1) {
    					comboAllList.push(demdBizDivList[i]);
    				}
	    		}
    		} 
    		// 장비역할 값이 없는 경우
    		else {
    			for (var i = 0; i < demdBizDivList.length; i++) {
	    			// WBS Type 이 같고 같은 장비군
    				if (nullToEmpty(demdBizDivList[i].wbsTyp).indexOf(data.wbsTyp) > -1) {
    					comboList.push(demdBizDivList[i]);
    				}
    			}
    		}
    		
    		// TODO 사업구분(대)가 한건도 없으면 WBS 타입일치건 제공
    		if (comboList.length == 0) {
    			comboList = comboAllList;
    		}
    		// 사업구분 콤보가 1건이면 자동선택
    		if (comboList.length == 1 ){
    			if (data != null && data._index != undefined) {    		
    				$('#'+setGridId).alopexGrid('cellEdit', comboList[0].value, {_index: {row: data._index.row}}, "demdBizDivCd");
    			}
    		} 
    		// 사업구분 콤보 다건이면 지움
    		else if (comboList.length > 1) {
    			if (data != null && data._index != undefined) {
    				// 기 선택된 값이 있으면
    				if (nullToEmpty(data.demdBizDivCd) != "" && procTyp == "S") {
    					$('#'+setGridId).alopexGrid('cellEdit', data.demdBizDivCd, {_index: {row: data._index.row}}, "demdBizDivCd");
    				} else {
        				$('#'+setGridId).alopexGrid('cellEdit', "", {_index: {row: data._index.row}}, "demdBizDivCd");
    				}
    			}
    		}
    	}
    	// 사업구분(세부)
    	else if (comboCd == "demdBizDivDetlCd") {
    		// 장비역할이나 사업구분(대)가 있는 경우
    		if (nullToEmpty(eqpTypCd) != "" || nullToEmpty(demdBizDivCd) != "") {
	    		for (var i = 0; i < demdBizDivDetlList.length; i++) {
	    			// WBS Type 이 같고 장비유형이 같고 사업구분(대)가 같은
	    			if (nullToEmpty(eqpTypCd) != "" && nullToEmpty(demdBizDivCd) != "") {
	    				if (nullToEmpty(demdBizDivDetlList[i].wbsTyp).indexOf(data.wbsTyp) > -1 && nullToEmpty(demdBizDivDetlList[i].eqpTypCd).indexOf(eqpTypCd) > -1 && demdBizDivDetlList[i].demdBizDivCd == demdBizDivCd ) {
	    					comboList.push(demdBizDivDetlList[i]);
	    				}
	    			} else if (nullToEmpty(eqpTypCd) != "") {
	    				if (nullToEmpty(demdBizDivDetlList[i].wbsTyp).indexOf(data.wbsTyp) > -1 &&  demdBizDivDetlList[i].eqpTypCd.indexOf(eqpTypCd) > -1  ) {
	    					comboList.push(demdBizDivDetlList[i]);
	    				}
	    			} else if (nullToEmpty(demdBizDivCd) != "") {
	    				if (nullToEmpty(demdBizDivDetlList[i].wbsTyp).indexOf(data.wbsTyp) > -1 && demdBizDivDetlList[i].demdBizDivCd == demdBizDivCd) {
	    					comboList.push(demdBizDivDetlList[i]);
	    				}
	    			}
	    			
	    			// WBS타입이 일치하는 사업구분(세부)
	    			if (nullToEmpty(demdBizDivDetlList[i].wbsTyp).indexOf(data.wbsTyp) > -1) {
	    				// 사업구분(대)가  있는경우
	    				if (nullToEmpty(demdBizDivCd) != "" && demdBizDivDetlList[i].demdBizDivCd == demdBizDivCd) {
	    					comboAllList.push(demdBizDivDetlList[i]);
	    				} else if (nullToEmpty(demdBizDivCd) == "" ) {
	    					comboAllList.push(demdBizDivDetlList[i]);
	    				}
	    			}
	    		}
    		} 
    		// 장비역할, 사업구분(대)가 없는 경우
    		else {
    			for (var i = 0; i < demdBizDivDetlList.length; i++) {
    				if (nullToEmpty(demdBizDivDetlList[i].wbsTyp).indexOf(data.wbsTyp) > -1) {
    						comboList.push(demdBizDivDetlList[i]);
    				}
    			}
    		}
    		
    		// TODO 사업구분(세부)가 한건도 없으면 WBS 타입일치건 제공
    		if (comboList.length == 0) {
    			comboList = comboAllList;
    		}

    		// 사업구분 콤보가 1개이면 자동 선택
    		if (comboList.length == 1 ){
    			if (data != null && data._index != undefined) {    		
    				$('#'+setGridId).alopexGrid('cellEdit', comboList[0].value, {_index: {row: data._index.row}}, "demdBizDivDetlCd");
    			}
    		} 
    		// 다건이면 선택값 지움
    		else {
    			if (data != null && data._index != undefined) {    
    				// 기 선택된 값이 있으면
    				if (nullToEmpty(data.demdBizDivDetlCd) != "" && procTyp == "S") {
    					$('#'+setGridId).alopexGrid('cellEdit', data.demdBizDivDetlCd, {_index: {row: data._index.row}}, "demdBizDivDetlCd");
    				} else {
    					$('#'+setGridId).alopexGrid('cellEdit', "", {_index: {row: data._index.row}}, "demdBizDivDetlCd");
    				}
    			}
    		}
    	}
    	
    	return comboList;
    }
    
    /*
     * 사업구분명 취득
     */
    function getDemdBizNm(demdBizTyp, cdVal) {
    	// 사업구분 대
    	var cdNm = "";
    	if (nullToEmpty(cdVal) == "") {
    		return cdNm;
    	}
    	var chkDemdBizList = [];
    	if (demdBizTyp == "1") {
    		chkDemdBizList = demdBizDivCombo;
    	} else if (demdBizTyp == "2") {
    		chkDemdBizList = demdBizDivDetlCombo;
    	}
    	
    	
    	jQuery.each(chkDemdBizList, function(key, value) { 
			for (var i = 0; i < chkDemdBizList[key].length; i++) {
				if (chkDemdBizList[key][i].value == cdVal) {
	    			cdNm = chkDemdBizList[key][i].text;
	    			return cdNm;
	    		}
			}
		});	
    	
    	return cdNm;
    }
  //request 성공시
    function successDemandPopCallback(response, flag){
    	//console.log(response);
    	if(flag == 'search'){
    		
    		var procTyp = $('input:radio[name="procTyp"]').getValue();
    		if (procTyp == "S") {

        		eqpTypList = [];
        		demdBizDivList = [];
        		demdBizDivDetlList = [];
		    	// 콤보 셋팅	    	
		    	if (response.eqpTypList != undefined && response.eqpTypList != null && response.eqpTypList.length > 0) {
		    		for (var i = 0; i < response.eqpTypList.length ; i++) {
		    			eqpTypList.push({value : response.eqpTypList[i].eqpTypCd, text : response.eqpTypList[i].eqpTypNm});
		    		}	    		
		    	}
		    	/*if (response.demdBizDivList != undefined && response.demdBizDivList != null && response.demdBizDivList.length > 0) {
		    		for (var i = 0; i < response.demdBizDivList.length ; i++) {
		    			demdBizDivList.push({value : response.demdBizDivList[i].demdBizDivCd, text : response.demdBizDivList[i].demdBizDivNm, eqpTypCd : response.demdBizDivList[i].eqpTypCd, wbsTyp : response.demdBizDivList[i].wbsTyp});
		    		}
		    	}
		    	if (response.demdBizDivDetlList != undefined && response.demdBizDivDetlList != null && response.demdBizDivDetlList.length > 0) {
		    		for (var i = 0; i < response.demdBizDivDetlList.length ; i++) {
		    			demdBizDivDetlList.push({value : response.demdBizDivDetlList[i].demdBizDivDetlCd, text : response.demdBizDivDetlList[i].demdBizDivDetlNm
		    				                   , eqpTypCd : response.demdBizDivDetlList[i].eqpTypCd
		    				                   , demdBizDivCd : response.demdBizDivDetlList[i].demdBizDivCd
		    				                   , wbsTyp : response.demdBizDivDetlList[i].wbsTyp});
		    		}
		    	}*/
		    	
		    	
		    	// 사업구분(대)
		    	if (response.demdBizDivCombo != undefined && response.demdBizDivCombo != null ) {
		    		
		    		jQuery.each(response.demdBizDivCombo, function(key, value) { 
	    				for (var i = 0; i < response.demdBizDivCombo[key].length; i++) {
	    					response.demdBizDivCombo[key][i].value  = response.demdBizDivCombo[key][i].demdBizDivCd;
	    					response.demdBizDivCombo[key][i].text  = response.demdBizDivCombo[key][i].demdBizDivNm	    					
	    				}
		    		});			    		
		    		demdBizDivCombo = response.demdBizDivCombo;			    		
		    	}
		    	// 사업구분(세부)
		    	if (response.demdBizDivDetlCombo != undefined && response.demdBizDivDetlCombo != null ) {
		    		
		    		jQuery.each(response.demdBizDivDetlCombo, function(key, value) { 
	    				for (var i = 0; i < response.demdBizDivDetlCombo[key].length; i++) {
	    					response.demdBizDivDetlCombo[key][i].value  = response.demdBizDivDetlCombo[key][i].demdBizDivDetlCd;
	    					response.demdBizDivDetlCombo[key][i].text  = response.demdBizDivDetlCombo[key][i].demdBizDivDetlNm
	    				}
		    		});			    		
		    		demdBizDivDetlCombo = response.demdBizDivDetlCombo;			    		
		    	}
    		}
    		
    		// 해당 WBS에 대해 사업구분(대)가 1개인 경우 해당 값 설정
	    	var  wbsTypEqpTypeTemp = "";
	    	var  wbsDemdDivCd = "";
    		for (var i =0; i < response.list.length; i++) {
    			if (wbsTypEqpTypeTemp != (response.list[i].wbsTyp + "_" + response.list[i].eqpTypCd) ) {
    				wbsTypEqpTypeTemp = response.list[i].wbsTyp + "_" + response.list[i].eqpTypCd;
    				if(demdBizDivCombo[wbsTypEqpTypeTemp] && demdBizDivCombo[wbsTypEqpTypeTemp].length == 1) {
    					wbsDemdDivCd = demdBizDivCombo[wbsTypEqpTypeTemp][0].value;
    				} else {
    					// 만약에 WBS_TYP + EQP_TYPE의 사어구분(대)가 없고 해당 WBS_TYP 사업구분(대)가 1개 있으면
    					if (demdBizDivCombo[wbsTypEqpTypeTemp] == undefined && demdBizDivCombo[response.list[i].wbsTyp] && demdBizDivCombo[response.list[i].wbsTyp].length == 1) {
    						wbsDemdDivCd = demdBizDivCombo[response.list[i].wbsTyp][0].value;
    					} else {
    						wbsDemdDivCd = "";
    					}    					
    				}
    				
    				response.list[i].demdBizDivCd = wbsDemdDivCd;
    			} else {
    				response.list[i].demdBizDivCd = wbsDemdDivCd;
    			}
    		}
    		
    		//console.log(response);
			var serverPageinfo;
    		
	    	if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	    	      	};
	    	}
	    	if (procTyp == "S") {
		    	$('#'+gridIdPop1).alopexGrid("dataSet", response.list, serverPageinfo);
		    	$('#'+gridIdPop1).alopexGrid("startEdit");
	    	} else {
	    		$('#'+gridIdPop2).alopexGrid("dataSet", response.list, serverPageinfo);
		    	$('#'+gridIdPop2).alopexGrid("startEdit");
	    	}
	    	bodyProgressRemove();
    		
    	}
    	if(flag == 'searchForPageAdd'){
    		var serverPageinfo;
    		
	    	if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	    	      	};
	    	}

			//hideProgress(gridIdPop1);
	    	bodyProgressRemove();
				    	
	    	$('#'+gridIdPop1).alopexGrid("dataAdd", response.list, serverPageinfo);	
    	}
    	if (flag == 'updateExecBizDiv') {
    		//console.log(response);
    		bodyProgressRemove();
    		if (response.result != undefined) {
    			if ( response.result.resultMsg != undefined && response.result.resultMsg != "") {
    				var resultMsg = "사업별 처리건수를 확인해 주세요.<br><br>" 
    					           + response.result.resultMsg
    				callMsgBox('','I', resultMsg, function(msgId, msgRst){ 
    		    		$('#btn_search').click();
    				});
    				
    			} else {
    				callMsgBox('','I', "처리에 성공했습니다.", function(msgId, msgRst){ 
    		    		$('#btn_search').click();
    				});
    				
    			}
    		} else {
    			alertBox('W', "처리에 실패했습니다.");
    		}
    	}
    	
    	// ERP 공사유형
    	if(flag == 'selectErpBizTypList'){
    		if(response != null && response.length > 0){
    			$('#erpBizTypCd').setData({data : response});
    		} else {
    			$('#erpBizTypCd').clear();
    		}
    		$('#erpBizTypCd').prepend('<option value="">' + demandMsgArray['all'] + '</option>');  // 전체
    	}
    	
    	// 공사유형
    	if(flag == 'bizCstrTypCdPop'){
    		
			$('#bizCstrTypCdPop').setData({
				data : response
			});
			
			$('#bizCstrTypCdPop').prepend('<option value="">' + demandMsgArray['all'] + '</option>');  // 전체
			$('#bizCstrTypCdPop').setSelected('');
    	}
    	
    	// WBS 타입
    	if(flag == 'selectWbsList'){
    		
    		if(response != null && response.length > 0){
    			$('#wbsTypPop').setData({data : response});
    		} else {
    			$('#wbsTypPop').clear();
    		}

			$('#wbsTypPop').prepend('<option value="">' + demandMsgArray['all'] + '</option>');  // 전체
   		    $('#wbsTypPop').setSelected(""); 
    	}
    	// WBS 시퀀스 자동완성
    	// 자동완성
		else if(flag == 'selectWbsSeq'){ 
			//console.log(response);
			var wbsSeqList = [];
			if ( response != null &&  response != undefined) {
				wbsSeqList = response;
			}
			var procTyp = $('input:radio[name="procTyp"]').getValue();
			var setGridId = gridIdPop1;
			var columIndexByProcTyp = 0;   // 시작/끝의 columnIndex가 지정/취소 그리드에 따라 다르기 때문에 
			// 취소			
			if (procTyp == "C") {
				setGridId = gridIdPop2;
				columIndexByProcTyp +=1;  // 취소그리드의 시작/끝 컬럼의 위치는 +1 필요함.
			}
						
			var focusData = AlopexGrid.currentData($('#'+setGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
			var rowIndex = focusData._index.row;
			var columIndex = focusData._index.column;
			var autocompleteList = [];
			$.each(wbsSeqList, function(idx, obj){
				autocompleteList.push({value : obj.wbsIdxVal, text : obj.wbsIdxText}); 		  			
	  		});
			
			var wbsSeqDivId = $('#'+setGridId).alopexGrid('cellElementGet',  {_index: {row: rowIndex}}, columIndex).attr('id');
					
			// 자동완성 메뉴 셋팅할 컬럼
			var setWbsSeqId = "startWbsSeq";
			// 끝인경우
			if (columIndex == (10 + columIndexByProcTyp)) {
				setWbsSeqId = "endWbsSeq";
			}
			
			// 특정 DOM개체의 dropdown 개체가 초기화 되었는지 체크
			var initYn = false;
			var dropDown = $(".Dropdown");
			if (nullToEmpty(dropDown) != "" && nullToEmpty($('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input')) != ""
				&& $('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input').length > 0) {
				for (var i = 0 ; i < dropDown.length; i++) {
					if (dropDown[i].base.id == $('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input')[0].id) {
						initYn = true;
						break;
					}
				}
			}
			
			//$('#'+wbsSeqDivId + ' #' + setWbsSeqId ).setOptions({source : JSON.stringify(autocompleteList) ,noresultstr : '매칭 결과 없음'});
			$('#'+wbsSeqDivId + ' #' + setWbsSeqId ).setOptions({source : JSON.stringify([]) ,noresultstr : '매칭 결과 없음'});   // JSON 에러로 빈값으로 셋팅 해줌.. 그다음부터는 왜 안나는지 모르겠음
			$('#'+wbsSeqDivId + ' #' + setWbsSeqId ).setOptions({source : autocompleteList ,noresultstr : '매칭 결과 없음'});
			
			if (autocompleteList != null && autocompleteList.length > 0) {
				
				$('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input').click();
				if (initYn == true) {
					$('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input').click();
				}
				$(".Dropdown").css("max-height",'200px');
				$(".Dropdown").css("z-index",99999);
				
			} else {
				$('#'+wbsSeqDivId + ' #' + setWbsSeqId  +'>input').click();
				$(".Dropdown").css("max-height",'40px');
			} 
		}
    }
    
    
    //request 실패시.
    function failDemandPopCallback(response, flag){
		bodyProgressRemove();
		if (flag == 'search') {
			alertBox('W', demandMsgArray['searchFail']);
		
	    } else if (flag == 'updateExecBizDiv'){
	    	console.log(response);
	    	alertBox('W', response.message);
	    	$('#'+gridIdPop1).alopexGrid("startEdit");
	    }
	    else if (flag == 'updateExecBizDiv') {
	    	alertBox('W', demandMsgArray['systemError']);
	    }
	    else {
			if (response.message != 'undefined'  && nullToEmpty(response.message) != '') {		
				alertBox('W', response.message);
			} else {
				alertBox('W', demandMsgArray['systemError']);
			}
		}
		if(flag == 'selectWbsList'){    		
			$('#wbsTypPop').clear();
			$('#wbsTypPop').prepend('<option value="">' + demandMsgArray['all'] + '</option>');  // 전체
   		    $('#wbsTypPop').setSelected(""); 
    		
    	}
    }
    
});