/**
 * FieldInquiryUpload.js
 * 
 * @author 
 * @date 2016. 7. 25. 오전 09:10:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	//초기 진입점  
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
        //setSelectCode();
    	//setEventListener();
    };
    
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	extend : ['defineExcelDataGrid']
        });
    };
    
});

