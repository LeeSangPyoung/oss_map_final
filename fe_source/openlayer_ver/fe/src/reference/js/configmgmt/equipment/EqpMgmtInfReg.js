/**
 * EqpReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        setEventListener();
        setRegDataSet(param);
    };
    
    function setRegDataSet(data) {
    	
    	$('#contentArea').setData(data);
    }
    
    function setEventListener() {
    	
    	
    	//취소
    	 $('#btnCncl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });
    	 
    	//저장 
    	 $('#btnSave').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $('#modalDialog').open({
 			    title:'(C) 확인',
 			    width: 270,
 			    height: 150
 			  });
	    		 	$('#modalDialog').cancel(function() {
	 			    //alert("CANCEL pressed!");
	 			    $('#modalDialog').close(); // Dialog를 닫기.
	 			  });
 			  $('#modalDialog').ok(function() {
 			   
 			    // 저장 한다고 하였을 경우
 				 //mtsoReg();
 			    
 			  $('#modalDialog').close(); // Dialog를 닫기.
 			  });
         });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
    	   
	};
	
	//request 성공시
    function successCallback(serviceId, response, flag){
    	
    	if(flag == 'EqpReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    	}
    	
    	
    }
    
    //request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'EqpReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function mtsoReg() {
    	 var param =  $("#searchForm").getData();
			 
    	 
    	 for (var key in param) {
     		if(param[key] == "" || param[key] == null) {
     			param[key] = "1";
     		}
     	}
    	 
		   httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoReg', param, successCallback, failCallback, 'POST', 'EqpReg');
    }
});