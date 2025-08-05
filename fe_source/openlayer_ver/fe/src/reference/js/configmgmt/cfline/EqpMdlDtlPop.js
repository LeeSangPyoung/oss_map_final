/**
 * EqpMdlDtlPop.js
 * 
 * 파장/주파수 조회팝업 - (SKT) WdmTrunkList에서만 파장/주파수컬럼에서 활성화됨
 * 주파수값이 없는 경우에는 팝업이 표시되고 등록된 경우에는 해당 값을 통해 검색한 값을 표시해준다.
 * 
 * WDM트렁크리스트 조회 화면에서 호출
 * @author 
 * @date 2016. 11. 02.
 * @version 1.0
 * 
 */

$a.page(function() {
	/*var eqpMdlId = "";
	var searchDiv = "wavl" // 파장/주파수
	var searchVal = "";
	*/
	this.init = function(id, param) {
		//eqpMdlId = param.eqpMdlId;
		//searchVal = param.searchVal;
		
		initGrid();
		setEventListener();
		// 장비모델상세정보(파장/주파수)
		cflineShowProgressBody();
		//var searchParam = {"searchDiv" : searchDiv, "searchVal" : searchVal, "eqpMdlId" : eqpMdlId };
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selecteqpmdldtlval', param, 'GET', 'eqpMdlDtlVal');
    };

	//Grid 초기화
    function initGrid() {
    	var column = [
                      { key : 'wdmBdwthVal', title : cflineMsgArray['bdwth'], align : 'left', width : '100px' }
    	             ,{ key : 'wavlVal', title : cflineMsgArray['wavelength']+'/'+cflineMsgArray['frequency'], align : 'left', width : '100px' }
    	             ,{ key : 'wdmChnlVal', hidden :true }
    	             ,{ key : 'wdmFreqVal', hidden :true }
    	];
    	
    	$('#eqpMdlList').alopexGrid({
    		pager : false,
    		columnMapping : column,
    		autoColumnIndex: true,
        	cellSelectable : true,
            rowClickSelect : true,
            rowInlineEdit : true,
            rowSingleSelect : false,
            numberingColumnFromZero : false,
            height : 300
    	});
    }
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, 
    		data : Param,
    		method : Method,
    		flag : Flag
    	}).done(successCallback)
    	.fail(failCallback);
    }

    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpMdlDtlVal') {
    		var data = response.wavlList;
    		cflineHideProgressBody();
    		if(data == null || data.length == 0){
    			$a.close("noData");
    		} else if(data.length === 1){
    			$a.close(data);
    		} else if(data.length > 0){
    			$('#eqpMdlList').alopexGrid('dataSet', data);
    		}
    	}

    }
    
    function failCallback(status, jqxhr, flag){
    	if(flag == 'eqpMdlDtlVal'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
    function setEventListener() {
    	$('#btnClose').on('click', function(e){
    		$a.close();
	    });
    	
    	
    	$('#eqpMdlList').on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	$a.close(dataObj);
    	 
    	 });
    }
});


