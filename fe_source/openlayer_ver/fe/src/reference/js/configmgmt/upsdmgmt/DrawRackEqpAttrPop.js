/**
 * DrawRackEqpAttrPop.js
 *
 * @author Administrator
 * @date 2018. 01. 22.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	setEventListener();
    };

    function setEventListener() {
    	//취소
    	 $('#btnExt').on('click', function(e) {
    		 $a.close();
         });

    	//등록
    	 $('#btnCnf').on('click', function(e) {
    		 var data = $('#drawRackEqpAttrPopForm').getData();
    		 paramData.width = data.width
    		 paramData.length = data.length
    		 paramData.height = data.height
    		 paramData.unitSize = data.unitSize
    		 if(paramData.width == '' || paramData.width == null){
    			 paramData.width = 0;
    		 }
    		 if(paramData.length == '' || paramData.length == null){
    			 paramData.length = 0;
    		 }
    		 if(paramData.height == '' || paramData.height == null){
    			 paramData.height = 0;
    		 }
    		 if(paramData.unitSize == '' || paramData.unitSize == null){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','UNIT SIZE'), function(msgId, msgRst){});
  	     		return;;
    		 }
    		 $a.close(paramData);
         });

	};

});