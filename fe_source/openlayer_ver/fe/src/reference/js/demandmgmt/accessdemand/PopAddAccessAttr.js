
/**
 * PopAddAccessAttr.js
 *
 * @author P095783
 * @date 2022. 8. 09.
 * @version 1.0
 */
var flagYear = false;
var maxYear = null;
var nextYear = null;
var acsnwAttrList  = [{value: "",text: "선택"}
					   ,{value: "CSTR_TYP_NM",text: "공사유형"}
					   ,{value: "SRVC_NM",text: "서비스명"}
					   ,{value: "FREQ_NM",text: "주파수명"}
					   ,{value: "SRVC_LCL_NM",text: "서비스대분류명"}
					   ,{value: "SRVC_MCL_NM",text: "서비스중분류명"}];  
var now = new Date();
var nowYear = now.getFullYear();

$a.page(function() {
	
	//그리드 ID
    var gridId = 'alGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setCombo();
    	setEventListener();
    	$('#afeYr').attr("disabled",true);
		searchList(nowYear);
    };
    

  	//Grid 초기화
    function initGrid() {
		var mapping = [
			{width:'20px',
				key : 'check',
				selectorColumn : true
			}
			, {
				key : 'check',
				align:'center',
				width:'35x',
				title : demandMsgArray['sequence'] /*순번*/,
				numberingColumn : true
			}
    		, {
				key : 'afeYr',
				align:'center',
				width:'40px',
				title : demandMsgArray['afeYear'] /*AFE년도*/,
			}
    		, {
    			key : 'demdBizDivCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['businessDivisionBig'], /*사업구분(대)*/
    			hidden : true
    		}
    		, {
    			key : 'demdBizDivCdNm',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['businessDivisionBig'], /*사업구분(대)*/
    		}
    		, {
				key : 'demdBizDivDetlCd',
				align:'center',
				width:'50px',
				title : demandMsgArray['businessDivisionDetl'], /*사업구분(세부)*/
    			hidden : true
			}
    		, {
    			key : 'demdBizDivDetlCdNm',
    			align:'center',
    			width:'50px',
    			title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/
    		}
    		, {
    			key : 'acsnwAttrCd',
    			align:'center',
    			width:'50px',
    			title : demandMsgArray['accessNetworkAttribute'], /*A망속성*/
    			hidden : true
    		}
    		, {
				key : 'acsnwAttrNm',
				align:'center',
				width:'50px',
				title : '<em class="color_red">*</em> ' + demandMsgArray['accessNetworkAttribute'], /*A망속성*/
    			render : function(value, data) {
					for(i=0;i<acsnwAttrList.length;i++){
						if(acsnwAttrList[i].value == value){
							return acsnwAttrList[i].text
						}
					}
    			},
    			editable : {type : 'select',rule : function(value, data) {return acsnwAttrList; }
				 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
				},
				editedValue : function(cell) {
					return $(cell).find('select option').filter(':selected').val(); 
				}
			}
    		, {
				key : 'acsnwAttrVal',
				align:'center',
				width:'70px',
				title : '<em class="color_red">*</em> '+ demandMsgArray['accessNetworkAttributeVal'] /*A망속성값*/,
				editable : {type : "text"}
			}
    		, {
				key : 'rmk',
				align:'center',
				width:'80px',
				title : demandMsgArray['description'] /*설명*/,
				editable : {type : "text"}
			}
    		, {
    			key : 'lastChgDate',
    			align:'center',
    			width:'50px',
    			title : demandMsgArray['modificationDate'] /*수정일자*/,
    		}
		];
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	columnMapping : mapping,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : true,
			rowSingleSelect : true,
			numberingColumnFromZero : false,
			height : 250,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
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
    
    function setCombo() {
    	//AFE 구분 콤보박스
    	selectAfeYearCode('sAfeYear', 'N', '');
    	selectAfeYearCode('afeYr', 'N', '');
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/getmaxyear', '', 'GET', 'getMaxYear');
		$('#acsnwAttrNm').clear();
		$('#acsnwAttrNm').setData({data : acsnwAttrList});
    	selectYearBizCombo('popDemdBizDivCd', 'S', $("#afeYr").val(), 'C00618', '', 'A');
    }
    
    function searchList(sAfeYear){
    	var dataParam = {
    			sAfeYear : (nullToEmpty(sAfeYear) == '' ) ? $('#sAfeYear').val() : sAfeYear
    		};
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/accessattrlist', dataParam, 'GET', 'search');
    }
    
    function saveCheck(){
    	
    	var date = new Date;
    	var currentYear = date.getFullYear();
    	
    	if( $("#afeYr").val() < currentYear){
    		callMsgBox('', 'W', demandMsgArray['addAfeNotice2'] ); /*당해년 이전의 데이터 수정은 관리자에게 문의 하십시오. */
    		return;
    	}
    	saveAttr();
    }
    
    function saveAttr(){
    	
		var insertRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
		var deleteRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
		var updateRow =  AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
		
		if ( insertRow.length == 0 && deleteRow.length == 0 && updateRow.length == 0) {
			callMsgBox('', 'W', demandMsgArray['noChangedData'] ); /*변경된 내용이 없습니다*/
			return;
		}
		
		if(updateRow.length > 0){
			for(i=0;i<updateRow.length;i++){
				if(updateRow[i].acsnwAttrNm == ''){
					callMsgBox('', 'W', 'A망 속성을 선택 하십시오.' ); /*변경된 내용이 없습니다*/
					return;
				}
				if(updateRow[i].acsnwAttrVal == ''){
					callMsgBox('', 'W', 'A망 속성값이 입력되지 않았습니다.' ); /*변경된 내용이 없습니다*/
					return;
				}
			}
		}
		
		
		var dataParam = new Object();
	
		dataParam.gridData = {
			  insertRow : insertRow
			, deleteRow : deleteRow
			, updateRow : updateRow
		}
    	
    	/*"저장하시겠습니까?"*/
		callMsgBox('','C', demandMsgArray['save'], function(msgId, msgRst){
    		if (msgRst == 'Y') {
    			  //저장
    			 bodyProgress();
    		  	  demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/saveaccessattr', dataParam, 'POST', 'save');
    		} 
    		console.log(dataParam);
		});
    }
   

    function addRow() {
    	
    	var msgArg ="";
    	var afeYr = $('#afeYr').val();
    	var demdBizDivCd = $('#popDemdBizDivCd').val();
    	var demdBizDivCdNm = $('#popDemdBizDivCd option:selected').text();
    	var demdBizDivDetlCd = $('#popDemdBizDivDetlCd').val();
    	var demdBizDivDetlCdNm = $('#popDemdBizDivDetlCd option:selected').text();
    	var acsnwAttrCd = $('#acsnwAttrNm').val();
    	var acsnwAttrNm = $('#acsnwAttrNm option:selected').text();
    	var acsnwAttrVal = $('#acsnwAttrVal').val();
    	var rmk = $('#rmk').val();
    	
    	if(nullToEmpty(sAfeYear) == '' ){
    		msgArg = demandMsgArray['afeYear']; /*AFE년도*/
    		alertBox('W', makeArgMsg('selectObject',msgArg,"","","")); /* {0}를(을) 선택하세요. */
    		return;
    	}else if(nullToEmpty(demdBizDivCd) == ''){
    		msgArg = demandMsgArray['businessDivisionBig']; /*사업구분(대)*/
    		alertBox('W', makeArgMsg('selectObject',msgArg,"","","")); /* {0}를(을) 선택하세요. */
    		return;
    	}else if(nullToEmpty(demdBizDivDetlCd) == ''){
    		msgArg = demandMsgArray['businessDivisionDetl']; /*사업구분(세부)*/
    		alertBox('W', makeArgMsg('selectObject',msgArg,"","","")); /* {0}를(을) 선택하세요. */
    		return;
    	}else if(nullToEmpty(acsnwAttrCd) == ''){
    		msgArg = demandMsgArray['accessNetworkAttribute']; /*A망속성*/
    		alertBox('W', makeArgMsg('selectObject',msgArg,"","","")); /* {0}를(을) 선택하세요. */
    		return;
    	}else if(nullToEmpty(acsnwAttrVal) == ''){
    		msgArg = demandMsgArray['accessNetworkAttributeVal']; /*A망속성값*/
    		alertBox('W', makeArgMsg('required',msgArg,"","","")); /* 필수 입력 항목입니다.[{0}] */
    		return;
    	}
    	
    	var initRowData = [
    	    {
    	    	  "afeYr" : afeYr
  	    		, "demdBizDivCd" : demdBizDivCd
  	    		, "demdBizDivCdNm" : demdBizDivCdNm
  	    		, "demdBizDivDetlCd" : demdBizDivDetlCd
  	    		, "demdBizDivDetlCdNm" : demdBizDivDetlCdNm
  	    		, "acsnwAttrCd" : acsnwAttrCd
  	    		, "acsnwAttrNm" : acsnwAttrCd
  	    		, "acsnwAttrVal" : acsnwAttrVal
  	    		, "rmk" : rmk
    	    }
    	];
    	
    	$('#'+gridId).alopexGrid("dataAdd", initRowData);
    	$('#popDemdBizDivCd').setSelected("");
    	$('#popDemdBizDivDetlCd').setSelected("");
    	$('#acsnwAttrNm').setSelected("");
    	$('#acsnwAttrVal').val('');
    	$('#rmk').val('');
    }
    
    
    function removeRow(){
    	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    
	}
    
    //다음년도 구하기
    function getNextYear (){
    	var date = new Date;
    	nextYear = date.getFullYear() + 1;
    }
    	
    function setEventListener() {
    	// 조회
    	 $('#btnSearch').on('click', function(e) {
    		 showProgress(gridId)
    		 searchList();
         });
    	
        // 저장
        $('#btnSave').on('click', function(e) {
        	$('#'+gridId).alopexGrid('endEdit');
        	saveCheck();
        });
        // 추가
        $('#btnAddRow').on('click', function(e) {
        	addRow();
        });
        // 삭제
        $('#btnRemoveRow').on('click', function(e) {
        	removeRow();
        });
        // 취소
        $('#btnCncl').on('click', function(e) {
   	 		$a.close();
        });
        
        // 다음년도 셋팅
        $('#afeYr').on('change', function(e) {
        	getNextYear();
        	if(flagYear == false && nextYear != maxYear ){
        		$('#afeYr').append($('<option>',{
            		value : nextYear,
        			text : nextYear
            	}));
        		flagYear = true;
        	} 
        });
        
        //사업 구분(세부) 콤보박스        
    	$('#popDemdBizDivCd').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		if($('#popDemdBizDivCd').val() != ""){
    			selectYearBizCombo('popDemdBizDivDetlCd', 'S', $("#afeYr").val(), $("#popDemdBizDivCd").val(), '', 'A');	// 사업구분 소
    		}else{
    			$('#popDemdBizDivDetlCd').empty();
    			$('#popDemdBizDivDetlCd').append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$('#popDemdBizDivDetlCd').setSelected("");
    		}
        });
    	
        //AFE 구분 콤보박스
        $('#afeYr').on('change',function(e) {
    		selectYearBizCombo('popDemdBizDivCd', 'S', $("#afeYr").val(), 'C00618', '', 'A');	// 사업구분 대
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
	
		
	//request 성공시
    function successDemandCallback(response, flag){
    	if(flag == 'search'){
    		hideProgress(gridId);
    		$('#'+gridId).alopexGrid("sortClear");
    		$('#'+gridId).alopexGrid("dataEmpty");
    		if(response!= null) {
        		$('#'+gridId).alopexGrid("dataSet", response.list);
    		}
    	}
    	    	
    	if(flag == 'save'){
    		bodyProgressRemove();
			callMsgBox('', 'I', demandMsgArray['saveSuccess'] , function() {
				searchList($('#afeYr').val());
			}); /*저장을 완료 하였습니다.*/
    	}
    	
    	if(flag == 'getMaxYear'){
    		maxYear = response.maxYear;
    	}
    }
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	if(flag == 'search'){
    		callMsgBox('', 'W', demandMsgArray['searchFail'] ); /*조회 실패 하였습니다.*/
    	}
    	
    	if(flag == 'save'){
    		bodyProgressRemove();
    		callMsgBox('', 'W', demandMsgArray['saveFail'] ); /*저장을 실패 하였습니다.*/
    	}
    }
});