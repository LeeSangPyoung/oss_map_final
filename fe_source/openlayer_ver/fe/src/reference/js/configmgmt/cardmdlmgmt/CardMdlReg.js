/**
 * CardMdlReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
	var paramData = null;
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	if(param.regYn == "Y"){
    		paramData = param;
    	}
    	
        setEventListener();
        setSelectCode();
        setRegDataSet(param);
        
    };
    
    function setRegDataSet(data) {   
    	if(data.regYn == "Y"){
    		$('#regYn').val("Y");
    		$('#lclReg').setEnabled(false);
    		$('#cardMdlRegArea').setData(data);
    	}else{
    		var id = "CM***********";
	    	$("#cardMdlIdReg").val(id);
    	}
    }
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	
    	//카드타입 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00029', null, 'GET', 'cardMdlTypCd');    	
    }
    
    function setEventListener() {
    	
    	//목록
    	 $('#btnPrevReg').on('click', function(e) {
    		 $a.close();
          });
    	 
    	//카달로그
	   	 $('#ctlg_popup').on('click', function(e) {
    		 popupList('CtlgPop', $('#ctx').val()+'/configmgmt/portmgmt/CtlPop.do', '카달로그');
         });

	   	$('#bpSearchReg').on('click', function(e) {
   		 $a.popup({
   	          	popid: 'bpSearchReg',
   	          	title: false,
   	            url: '/tango-common-business-web/business/popup/PopupBpList.do',
   	            width : 750,
   	           	height : window.innerHeight * 0.75,
   	            modal: true,
                movable:true,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행 
   	                $('#bpIdReg').val(data.bpId);
   	                $('#bpNmReg').val(data.bpNm);
   	           	}
   	      });
        });
 	 
    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });
    	 
    	//저장 
    	 $('#btnSaveReg').on('click', function(e) {
    		 
    		 var param =  $("#cardMdlRegForm").getData();
	    	 
    		 if (param.cardMdlNm == "") {
 	     		//"필수입력항목입니다.[ 카드모델명 ]" 
    			callMsgBox('','I', makeArgConfigMsg('required'," 카드모델명 "), function(msgId, msgRst){});
 	     		return; 	
 	     	}
    		 
	    	 if (param.cardCtlgId == "") {
	     		//"필수입력항목입니다.[ 카달로그ID ]" 
	    		callMsgBox('','I', makeArgConfigMsg('required'," 카달로그ID "), function(msgId, msgRst){});
	     		return; 	
	     	}
	     	
 			callMsgBox('','C',  configMsgArray['saveConfirm'], function(msgId, msgRst){  
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	cardMdlReg(); 
 		        } 
 		    }); 
         });
    }
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'cardMdlReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       } 
    		});   
    		
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();
    		
            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}
    	
		
		
    	if(flag == 'cardMdlTypCd'){
    		$('#cardMdlTypCdReg').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#cardMdlTypCdReg').setData({
                 data:option_data
    		});
    	}
    	
    	
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'cardMdlReg'){
    		//'저장을 실패하였습니다.'
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		
    	}
    }
    

    function cardMdlReg() {
		   
		 var param =  $("#cardMdlRegForm").getData();
	    	
		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;
		 
    	 if($('#regYn').val() == "Y"){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cardmdlmgmt/updateCardMdlInf', param, 'POST', 'cardMdlReg');
    	 }else{
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cardmdlmgmt/insertCardMdlInf', param, 'POST', 'cardMdlReg');
    	 }
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
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
                  height : window.innerHeight * 0.9
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