/**
 * AutoClctPathListPop.js
 * 자동수집선번 팝업
 * @author 
 * @date 2017. 03. 07.
 * @version 1.0
 */
var autoClcGridId = 'autoClcPathList';
var hideCol = [];

$a.page(function() {
    this.init = function(id, param) {
    	var ntwkLineNo = param.ntwkLineNo;
    	var userNtwkLnoGrpSrno = nullToEmpty(param.userNtwkLnoGrpSrno);
    	hideCol = param.hideCol;
    	setEventListener();
		
		initGridNetworkPath(param.mapping);
		
    	cflineShowProgressBody();

    	// 선번 조회 : param - 네트워크회선번호, 수동선번그룹일련번호
    	var pathParam = {
    			  "ntwkLineNo" 		: ntwkLineNo
    			, "userNtwkLnoGrpSrno" : userNtwkLnoGrpSrno
    		};
    	
    	if(param.isService){
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', pathParam, 'GET', 'pathSearch');
    	} else {
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', pathParam, 'GET', 'pathSearch');
    	}
    };
    
    
    function setEventListener() {
    	// 등록
	   	$('#btnPopConfirm').on('click', function(e) {
	   		var dataList = $('#'+autoClcGridId).alopexGrid('dataGet');
	   		dataList = AlopexGrid.trimData(dataList);
	   		
	   		$a.close(dataList);
	   	});
	   	
	   	// 닫기
	   	$('#btnPopClose').on('click', function(e) {
	   		$a.close();
	   	});
   	 
	}
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
    	if(flag == 'pathSearch'){
	    	if(response.data != undefined) {
	    		$('#'+autoClcGridId).alopexGrid('dataSet', response.data.LINKS);
	    	} else {
	    		callMsgBox('','I', cflineMsgArray['noInquiryData'], function(msgId, msgRst){ /* 조회된 데이터가 없습니다. */ 
            		if (msgRst == 'Y') {
            			$a.close();
            		}
            	});
	    	}
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	cflineHideProgressBody();
    	if(flag == 'pathSearch'){
    		alertBox('W', cflineMsgArray['searchFail']);  /* 조회 실패 하였습니다. */
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

	//Grid 초기화
    function initGridNetworkPath(mapping) {
    	var groupColumn = groupingColumnNetworkPath();
    	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
    	
    	$('#'+autoClcGridId).alopexGrid({
    		fitTableWidth: true,
    		fillUndefinedKey : null,
    		numberingColumnFromZero: false,
    		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
    		useClassHovering : true,
    		autoResize: true,
    		cellInlineEdit : false,
    		rowInlineEdit: false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		rowspanGroupSelect: true,
    		columnMapping : mapping,
    		grouping : groupColumn,
	    	message: {
	    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
			}
    	});
    	
    	$('#'+autoClcGridId).alopexGrid('hideCol', hideCol);
    }
});

function groupingColumnNetworkPath() {
	var grouping = {
			by : ['TRUNK_MERGE', 'RING_MERGE', 'WDM_TRUNK_MERGE'], 
			useGrouping:true,
			useGroupRowspan:true,
			useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
			useGroupRearrange : true
	};
	
	return grouping;
}
