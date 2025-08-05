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
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/etceqpmgmt/etcEqpLnkgInf/'+data.eqpId, null, 'GET', 'etcEqpLnkgInf');
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
 			 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){  
 			       //저장한다고 하였을 경우
 			        if (msgRst == 'Y') {
 			        	etcEqpLnkgInfReg();
 			        } 
 			      }); 
         });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
    	   
	};
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'EtcEqpLnkgInfReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       } 
    		});   
    	}
    	
    	//장비 연동 정보 셋팅
    	if(flag == 'etcEqpLnkgInf') {
    		
    		$('#contentArea').setData(response);
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'EtcEqpLnkgInfReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function etcEqpLnkgInfReg() {
    	 var param =  $("#etcEqpLnkgInfRegForm").getData();
    	 
    	 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/etceqpmgmt/updateEtcEqpLnkgInf', param, 'POST', 'EtcEqpLnkgInfReg');
    }
    
    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})
    	
    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;
		
		}
    }*/
    
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