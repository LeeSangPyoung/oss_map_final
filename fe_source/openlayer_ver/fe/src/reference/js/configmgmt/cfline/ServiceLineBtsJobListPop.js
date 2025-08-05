/**
 * ServiceLineBtsJobListPop.js
 *
 * @author park. i. h.
 * @date 2018.10.17
 * @version 1.0
 * 
 ************* 수정이력 ************
 */

$a.page(function() {

    this.init = function(id, param) {
    	setPopEventListener();
    	initPopGrid(param); 
    	parent.$('body').progress().remove();
    };
   
    //Grid 초기화
    function initPopGrid(paramData) {
    	var mappingPop = [
    	                  {key : 'jobId'	              	,title : cflineMsgArray['jobId']/*"작업 ID"*/ ,align:'left'  , width: '120px'}
    	                  ,{key : 'makeDate'	        	,title : cflineMsgArray['requestDay'] /* 요청일 */ ,align:'center', width: '80px'}
    	                  ,{key : 'jobTitle'	              	,title : cflineMsgArray['workName'] /*  작업명 */ ,align:'left'  , width: '250px'}
    	                  ,{key : 'linePerCnt'	        	,title : cflineMsgArray['lineCount'] /* 회선수 */ ,align:'center', width: '80px'}
    	];

    	
        //그리드 생성
        $('#popListGrid').alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,  
//        	rowInlineEdit : true, //행전체 편집기능 활성화
    		enableDefaultContextMenu:false,
    		enableContextMenu:false,
    		pager:false,
			height : 340,	               
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: mappingPop
		}); 
        if(paramData.reqList != null && paramData.reqList.length>0){
        	$('#popListGrid').alopexGrid("dataSet", paramData.reqList);
        }
    };

    function setPopEventListener() {  
    	   	
     	// 그리드 더블클릭
 		$('#popListGrid').on('dblclick', '.bodycell', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data; 	
 			$a.close(dataObj);
	    });   	

		// 취소
		$('#btnPopClose').on('click', function(e) {
			$a.close();
        });
	    
	};  
});
