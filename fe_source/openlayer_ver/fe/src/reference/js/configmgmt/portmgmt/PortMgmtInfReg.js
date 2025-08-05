/**
 * PortMgmtInfReg.js
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
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portMgmtInf/'+data.portId, null, 'GET', 'portMgmtInf');
    }
    
    function setEventListener() {
    	
    	//저장
    	 $('#btnSave').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $('#dialogPortSave').open({
  			    title:'(C) 확인',
  			    width: 270,
  			    height: 150
  			  });
 	    		 	$('#dialogPortSave').cancel(function() {
 	 			    //alert("CANCEL pressed!");
 	 			   $('#dialogPortSave').close(); // Dialog를 닫기.
 	 			  });
  			  $('#dialogPortSave').ok(function() {
  			   
  			    // 저장 한다고 하였을 경우
  				 //mtsoReg();
  			    
  			  $('#dialogPortSave').close(); // Dialog를 닫기.
  			  });
         });
    	 
    	//취소
    	 $('#btnCncl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		//var param =  $("#searchForm").getData();
    		//$a.navigate($('#ctx').val()+'/configmgmt/portmgmt/EqpReg.do',param);
         });
    	 
    	 $('#btnClose').on('click', function(e) {
 	     	//tango transmission biz 모듈을 호출하여야한다.
 			 $a.close();
 	     });
    	   
	};
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'EqpReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    	}
    	
    	//장비 연동 정보 셋팅
    	if(flag == 'eqpLnkgInf') {
    		
    		$('#contentArea').setData(response);
    	}
    	
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'EqpReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpLnkgInfReg() {
    	 var param =  $("#portMgmtInfRegForm").getData();
    	 
		   //httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoreg', param, successCallback, failCallback, 'POST', 'EqpReg');
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