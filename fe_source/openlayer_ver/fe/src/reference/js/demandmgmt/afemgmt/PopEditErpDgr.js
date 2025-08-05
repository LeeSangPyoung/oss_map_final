/**
 * PopAfeNew.js
 *
 * @author P095783
 * @date 2023. 9. 28.
 * @version 1.0
 */
var afeTs = null;

$a.page(function() {
	
	//그리드 ID
    var gridId = 'editGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		setCombo();
		afeTs = "";
    	initGrid();
    	setEventListener();
    };
    
  //Grid 초기화
    function initGrid() {
		var mapping = [
			{
				selectorColumn : true,
				key : 'check',
				width:'40px',
			}
			, {
				key : 'check',
				align:'center',
				width:'30x',
				title : demandMsgArray['sequence'] /*순번*/,
				numberingColumn : true
			}
    		, {
				key : 'afeYr',
				title : demandMsgArray['afeYear'] /*AFE 년도*/,
				sortable : true,
				frozen : true,
				align:'center',
				width:'60px',
			}
    		,{
				key : 'afeDemdDgr',
				title : demandMsgArray['afeDegree'] /*AFE 차수*/,
				align:'center',
				width:'60px',
			}
    		,{
				key : 'demdBizDivNm',
				title : demandMsgArray['businessDivisionBig'] /*사업구분(대)*/,
				align : 'center',
				width : '100px',
			} 
    		,{
				key : 'demdBizDivDetlNm',
				align:'left',
				width:'180px',
				title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/,
    		}
    		,{
				key : 'erpDetlBizDivNm',
				align:'left',
				width:'100px',
				title : 'ERP 사업구분'
    		}
    		,{
				key : 'erpBizTypNm',
				align:'center',
				width:'100px',
				title :'ERP 사업유형'
			} 
    		,{
				key : 'erpDetlBizDemdDgr',
				align:'left',
				width:'100px',
				title : 'ERP 세부 사업차수'
				, editable : {   type: 'text' , attr : {  "data-keyfilter-rule" : "uppercase", "data-keyfilter":"0-9", "maxlength" : "3"} }	
	    	}
		];
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	defaultState : {
        		dataAdd : {
        			editing : true,
        			selected : true,
        		},
        	},
        	autoColumnIndex : true,
			rowClickSelect : false,
			numberingColumnFromZero : false,
			disableTextSelection : true,
			rowInlinEdit : false,
			rowSingleSelect : false,
			height : 450,
        	columnMapping : mapping,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
        $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		var selected = event.data._state.selected;
    		
    		$('#'+gridId).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
    		
    		
    			var ev = AlopexGrid.parseEvent(e);
    			$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
    	});
        
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
	//AFE 연차
    function setCombo(afeYr) {
    	if( afeYr == null || afeYr == ''){
    		selectAfeYearCode('scAfeYr', 'N', '');
    	} else {
    		selectAfeYearCode('scAfeYr', 'N', afeYr);
    	}
    	
    }
    
    //조회
    function searchErpDgr(){
		showProgress(gridId);
		$('#'+gridId).alopexGrid('endEdit');
				
		var dataParam = {
				sAfeYear : $('#scAfeYr').val(),
				sAfeDemdDgr : $('#scAfeDemdDgr').val()
		}
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selecterpdgrlist', dataParam, 'GET', 'searchErpDgr');
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
    
	// 저장
	function saveErpDgr(){
		if (checkRowData() == false){
			return;
		}
		
		var editRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {added:false, edited : true , deleted : false}}] ));
		if ( editRow.length == 0) {
			alertBox('W', demandMsgArray['noChangedData'] ); /*변경된 내용이 없습니다*/
			return;
		}
		var dataParam = new Object();
		
		dataParam.gridData = {
				editRow : editRow
		}
		console.log(dataParam);
    	/*"저장하시겠습니까?"*/
		callMsgBox('','C', demandMsgArray['save'], function(msgId, msgRst){  
    		if (msgRst == 'Y') {
    			bodyProgress()
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/saveerpdgr', dataParam, 'POST', 'saveErpDgr');
    		}
		});
	}
	
    function setEventListener() {
    	
    	//조회
    	$('#btnSearchErpDgr').on('click', function(e) {
    		searchErpDgr();
    	});
    	
    	//AFE 년도 변경 이벤트
        $('#scAfeYr').on('change',function(e) {
        	var dataParam = { 
        			AfeYr : this.value
    		};
        	if (afeTs == null) {
        		selectAfeTsCode('scAfeDemdDgr', 'N', '', dataParam);
        	}else {
        		selectAfeTsCode('scAfeDemdDgr', 'N', afeTs, dataParam);
        	}
    		
    		//수정 내역이 있으면 저장여부 확인
    		var modifyList =  AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {edited : true}}, {_state : {added:true}}, {_state:{added:false, deleted:true}}] ));
    		if (modifyList.length > 0 ) {
    			
    		} else {
    			//searchAfeNew();
    		}
    		
        });
        
        //AFE 차수 변경 이벤트
        $('#scAfeDemdDgr').on('change',function(e) {
        	//수정 내역이 있으면 저장여부 확인
    		var modifyList =  AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {edited : true}}, {_state : {added:true}}, {_state:{added:false, deleted:true}}] ));
    		searchErpDgr();
        });
    	
    	//저장
    	$('#btnSaveErpDgr').on('click', function(e) {
    		saveErpDgr();
        });
    	
    	// 그리드 값 변경중 ERP세부차수변경시
		$('#'+gridId).on('cellValueEditing', function(e){
			var ev = AlopexGrid.parseEvent(e);        	
        	var result;
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	var erpDetlBizDemdDgr = null;
        	var checkType = /^[A-Z0-9]{1,3}$/;
        	
        	if ( ev.mapping.key == "erpDetlBizDemdDgr") {        		
        		erpDetlBizDemdDgr = nullToEmpty(AlopexGrid.currentValue(data,  "erpDetlBizDemdDgr" ));
        		//erpDetlBizDemdDgr = erpDetlBizDemdDgr.replace(/ /gi, "");
        		if (erpDetlBizDemdDgr != '') {
        			if (checkType.test(erpDetlBizDemdDgr) == false ) {
        				$('#'+gridId).alopexGrid('cellEdit', '', {_index: {id: ev.data._index.id}}, 'erpDetlBizDemdDgr');   // ERP세부차수
        				//$('#'+gridId).alopexGrid('focusCell', {_index: {id: ev.data._index.id}}, 'erpDetlBizDemdDgr'); 
        			}
        		}
        	}
		});
		
	};
	
	
	//request
	function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandDetailCallback(response, sflag);})
    	  .fail(function(response){failDemandDetailCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successDemandDetailCallback(response, flag){
    	
    	//조회
    	if(flag == 'searchErpDgr') {
    		hideProgress(gridId);
    		
    		$( '#'+gridId).alopexGrid("sortClear");
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		
    		if(response!= null) {
        		$( '#'+gridId).alopexGrid("dataSet", response.list);
    		}
    	}

    	//저장
    	if(flag == 'saveErpDgr') {
    		bodyProgressRemove();
    		callMsgBox('', 'I', demandMsgArray['saveSuccess'] , function() {
    			searchErpDgr();
    		}); /*저장을 완료 하였습니다.*/
    	}
    	hideProgress(gridId);
    }
    
    //request 실패시.
    function failDemandDetailCallback(response, flag){
    	if(flag == 'searchErpDgr') {
    		hideProgress(gridId);
    		
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		alertBox('W', demandMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
    	//저장
    	if(flag == 'saveErpDgr') {
    		bodyProgressRemove();
    		callMsgBox('', 'W', demandMsgArray['saveFail'] ); /*저장을 실패 하였습니다.*/
    	}
    	hideProgress(gridId);
    }
    
});