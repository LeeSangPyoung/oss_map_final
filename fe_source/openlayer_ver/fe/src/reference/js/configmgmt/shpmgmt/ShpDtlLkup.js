/**
 * ShlfCardDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 8. 22. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        setEventListener();
        setRegDataSet(param);
        
        //alert(id+":"+JSON.stringify(param));
    };
    
    function setRegDataSet(data) {
    	
    	$('#shlfCardDtlLkupArea').setData(data);
    }
    
    function setEventListener() {
    
   		 var gubunValue = $('#gubunValue').val();
   		 if(gubunValue == "shlf"){
   			document.getElementById('shlfDtlTab').click();
   			document.getElementById('cardDtlTab').disabled = 'disabled';
   			document.getElementById('shlfDtlTabContent').style.display="block";
   			document.getElementById('cardDtlTabContent').style.display="none";
   		 }else if(gubunValue == "card"){
   			document.getElementById('cardDtlTab').click();
   			document.getElementById('shlfDtlTab').disabled = 'disabled';
   			document.getElementById('cardDtlTabContent').style.display="block";
   			document.getElementById('shlfDtlTabContent').style.display="none";
   		 }

    	//목록
	   	 $('#btnPrevDtl').on('click', function(e) {
    		 $a.navigate($('#ctx').val()+'/configmgmt/shlfcardmgmt/ShlfCardMgmt.do');
         });
	   	 
	   	//형상 정보 조회
	   	 $('#btnShpInfLkupDtl').on('click', function(e) {
	   		 popupList('btnShpInfLkupReg', $('#ctx').val()+'/configmgmt/shlfcardmgmt/ShpInfLkup.do', '형상 정보 조회');
         });
	   	 
    	//삭제
    	 $('#btnDelDtl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){  
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	shlfCardDel();
  		        } 
  		      }); 
         });
    	 
    	//수정
    	 $('#btnModDtl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#shlfCardDtlLkupForm").getData();
    		$a.popup({
 	          	popid: 'ShlfCardReg',
 	          	title: '쉘프/카드 수정',
 	            url: $('#ctx').val()+'/configmgmt/shlfcardmgmt/ShlfCardReg.do',
 	            modal: true,
                movable:true,
 	            data: param,
 	            iframe: false,
 	            width : 865,
 	           	height : window.innerHeight * 0.9,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행 
 	           	}
    		});
    		$a.close();
         });
    	 
    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
         });
    	   
	};
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'ShlfCardDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){  
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }    
    		 });   
    		$a.navigate($('#ctx').val()+'/configmgmt/shlfcardmgmt/ShlfCardMgmt.do');
    	}
    	
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'ShlfCardDel'){
    		//삭제을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }
    
    function shlfCardDel() {
    	var param =  $("#shlfCardDtlLkupForm").getData();
    	
   	 	var gubunValue =  $("#gubunValue").val();
   	 	var shlfNo =  $("#shlfNo").val();
   	 	var cardId =  $("#cardId").val();
   	 	
   	 	if(gubunValue == "shlf") {
   	 	    //shlfNo
    		callMsgBox('','I', shlfNo , function(msgId, msgRst){});
   	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/shlfcardmgmt/deleteShlfInf', param, 'POST', 'ShlfCardDel');
	    } else {
	    	//cardId
	    	callMsgBox('','I', cardId , function(msgId, msgRst){});
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shlfcardmgmt/deleteCardInf/'+cardId, null, 'POST', 'ShlfCardDel');
	    } 	
   }

    function mtsoReg() {
    	 var param =  $("#searchForm").getData();
			 
    	 
    	 for (var key in param) {
     		if(param[key] == "" || param[key] == null) {
     			param[key] = "1";
     		}
     	}
    	 
		   //httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoreg', param, successCallback, failCallback, 'POST', 'EqpReg');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  //iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
               
                  /*
                  	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
                  */
                  //width: 1000,
                  //height: 700
                  
              });
        }
    
    function popupList(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
               
                  /*
                  	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
                  */
                  //width: 1000,
                  //height: 700
                  
              });
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