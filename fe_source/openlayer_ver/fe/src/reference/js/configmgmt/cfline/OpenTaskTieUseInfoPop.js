/**
 * OpenTaskTieUseInfoPop.js
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
    	                  {key : 'tieOne'	           	,title : "TIE1" ,align:'left'  , width: '150px'}
    	                  ,{key : 'tieTwo'	           	,title : "TIE2" ,align:'left'  , width: '150px'}
    	                  ,{key : 'svlnNo'	        	,title : cflineMsgArray['serviceLineNumber'] /* 서비스회선번호 */ ,align:'center', width: '120px'}
    	                  ,{key : 'lineNm'	        	,title : cflineMsgArray['lnNm'] /* 회선명 */ ,align:'center', width: '250px'}
    	                  ,{key : 'svlnStatCdNm'	   	,title : cflineMsgArray['serviceLineStatus'] /* 서비스회선상태 */ ,align:'center', width: '100px'}
    	];

    	
        //그리드 생성
        $('#popListGrid').alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
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
        if(paramData.useTieList != null && paramData.useTieList.length>0){
        	$('#popListGrid').alopexGrid("dataSet", paramData.useTieList);
        }
    };

    function setPopEventListener() {  

		// 취소
		$('#btnPopClose').on('click', function(e) {
			$a.close();
        });
	    
	};  
});
