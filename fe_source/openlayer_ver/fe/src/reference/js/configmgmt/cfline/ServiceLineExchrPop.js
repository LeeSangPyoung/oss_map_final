/**
 * ServiceLineMtsoUpdatePop.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
	var paramData = null;
	var TmofData = [];  // 전송실 데이터 - selectBox
	var tmofPathData = [];  // Path전송실 DB 데이터
	var gridExchr = 'popSvlnExchrListGrid';
	var scrbSrvcMgmtNoStr = "";
	//var multiYn = null;
	//var svlnNo = null;

	
    this.init = function(popId, popParam) {

    	if (! jQuery.isEmptyObject(popParam) ) {
    		paramData = popParam;
    		
    		scrbSrvcMgmtNoStr = paramData.scrbSrvcMgmtNo;
    	}
    	setSelectCode();
        initGrid();
        

    };
    
    //Grid 초기화
    function initGrid() {
// 
    	var mappingMtso = [
	                      {key : 'scrbSrvcMgmtNo'	        ,title : cflineMsgArray['subscribeServiceManagementNumber'] /*가입서비스관리번호*/         ,align:'center', width: '150px'}
	                      , {key : 'svlnTypCdNm'	        ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '180px'}
	                      , {key : 'exchrNm'	            ,title : cflineMsgArray['exchangerName'] /*교환기명*/				,align:'center', width: '100px'}			
	                      , {key : 'exchrPortId'	        ,title : cflineMsgArray['exchangerPortId'] /*교환기포트ID*/				,align:'center', width: '100px'}          
	            		
	   			          ];
    	
        //그리드 생성
        $('#'+gridExchr).alopexGrid({
        	columnMapping : mappingMtso,
			cellSelectable : false,
			//autoColumnIndex: true,
			//fitTableWidth: true,
			rowClickSelect : false,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 200	
        });    
		
		$('#'+gridExchr).on('dblclick', '.bodycell', function(e){
			var event = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(event.data);
        	if(data != null){
	    	 	console.log("=====================gridExchr data");
	    	 	console.log(data);
	    	 	var exchrData = {"exchrNm":data.exchrNm,"exchrPortId":data.exchrPortId}
        		$a.close(exchrData);
        	}else{
        		$a.close();
        	}
			//Success
//				var event = AlopexGrid.parseEvent(e);
//				var selected = event.data._state.selected;
//				
//				$('#'+gridExchr).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
//				
//				var editing_list = $('#'+gridExchr).alopexGrid('dataGet', {_state: {editing: true}});
//				
//				for(var i = 0; i < editing_list.length; i++){
//					$('#'+gridExchr).alopexGrid('endEdit', {_index: {id: editing_list[i]._index.id}})
//				}
//				
//				if (checkRowData() == true) {
//					var ev = AlopexGrid.parseEvent(e);
//					$('#'+gridExchr).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
//				}
		});
    };
    
    function setSelectCode() {
    	var schParam = {"scrbSrvcMgmtNo":scrbSrvcMgmtNoStr};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/selectExchrNmByScrbSrvcMgmtNo', schParam, 'GET', 'exchrData');
    }

	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){  	
    	
    	if(flag == "exchrData"){
    		if(response.list != null && response.list.length>0){
    			$('#'+gridExchr).alopexGrid("dataSet", response.list);
    		}
    	}
		
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == "exchrData"){
    		$a.close();
    	}
    }

    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
   
    
});