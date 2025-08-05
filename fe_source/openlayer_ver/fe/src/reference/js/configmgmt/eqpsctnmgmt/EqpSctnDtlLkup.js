/**
 * EqpSctnDtlLkup.js
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
    	
    	$('#eqpSctnDtlLkupArea').setData(data);
    }
    
    function setEventListener() {
    	
	    	//목록
	   	 $('#btnPrevLkup').on('click', function(e) {
	   		$a.close();
         });

	   	 //구성도조회
	   	 $('#btnChgHstLkup').on('click', function(e) {
	     //변경이력
   		 popupList('EqpChgHstLkup', $('#ctx').val()+'/configmgmt/equipment/EqpChgHstLkup.do', configMsgArray['changeHistory']);
        });
	   	 
	   //네트워크정보
	   	 $('#btnEqpSctnNtwkInfLkup').on('click', function(e) {
	   		var param =  $("#eqpSctnDtlLkupForm").getData();
   		 popupList('EqpSctnNtwkInfLkup', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpSctnNtwkInfLkup.do', '네트워크정보', param);
        });
	   	 
	   //회선정보
	   	 $('#btnEqpSctnLineInfLkup').on('click', function(e) {
	   		var param =  $("#eqpSctnDtlLkupForm").getData();
   		 popupList('EqpSctnLineInfLkup', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpSctnLineInfLkup.do', '회선정보', param);
        });
    	 
    	//삭제
    	 $('#btnDelLkup').on('click', function(e) {
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){  
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	eqpSctnDel(); 
  		        } 
  		      }); 
         });
    	 
    	//수정
    	 $('#btnModLkup').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#eqpSctnDtlLkupForm").getData();
    		param.regYn = "Y";
    		//장비구간수정
    		$a.popup({
 	          	popid: 'EqpSctnReg',
 	          	title: configMsgArray['eqpSctnIdUpdate'],
 	            url: $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpSctnReg.do',
 	            data: param,
 	            iframe: false,
 	            modal: true,
                movable:true,
 	            width : 865,
 	           	height : window.innerHeight * 0.75,
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
    	
    	if(flag == 'eqpSctnDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){  
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }    
    		 });   
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();
    		
            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}
    	
    	
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpSctnDel'){
    		//삭제을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }
    
    function eqpSctnDel() {
   	 	var eqpSctnId =  $("#eqpSctnId").val();
   	 	
   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/deleteEqpSctnInf/'+eqpSctnId, null, 'POST', 'eqpSctnDel');
   	 	
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
                  height : window.innerHeight * 0.75
               
              });
        }
    
   /* var httpRequest = function(Url, Param, Method, Flag ) {
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