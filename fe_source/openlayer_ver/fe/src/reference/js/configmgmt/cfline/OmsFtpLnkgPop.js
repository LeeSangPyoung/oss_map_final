/**
 * OmsFtpLnkgPop.js
 *
 * @author Administrator
 * @date 2018. 11. 15
 * @version 1.0
 */


var paramData = null;
var popTmofCd = "";
$a.page(function() {

    this.init = function(id, popParam) {
//    	if (! jQuery.isEmptyObject(popParam) ) {
//			paramData = popParam;
//		}
    	paramData = popParam;
    	popTmofCd = nullToEmpty(paramData.tmpTmofCd);
    	searchPopCode();
        setEventListener();   
    };
   
    function setEventListener() {
    	//	취소
    	$('#btnPopClose').on('click', function(e) {
    		$a.close(null);
	   	});   	
    	
    	// 전송 버튼
    	$('#btnPopTrns').on('click', function(e) {
    		var ipAddr = $('#mailEqpIpAddr').val();
    		if(nullToEmpty(ipAddr) == ""){
    	    	alertBox('I', makeArgMsg("selectObject", cflineMsgArray['omsServer']/*"OMS 서버"*/, "", "", "")); /* {0}를(을) 선택하세요.*/
    			return false;
    		}
			paramData.mailEqpIpAddr = ipAddr;
	       	callMsgBox('','C', cflineMsgArray['transmission'] /* 전송하시겠습니까? */, function(msgId, msgRst){  
	       		if (msgRst == 'Y') {
	    			cflineShowProgressBody();
	       			httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/saveomsftpinfo', paramData, 'POST', 'saveomsftpinfo');
	       		}
	       	});
	   	});    	
    	
	};
    
	// 코드 조회 
    function searchPopCode(){
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getomsipadrrlist', null, 'GET', 'searchPopCode');
    }


	//request 성공시.
    function successCallback(response, status, jqxhr, flag){    	
    	// 코드 조회 
		if(flag == 'searchPopCode') {
    		var option_data =  [];
			var dataFst = {"value":"","text":cflineCommMsgArray['select']};
			option_data.push(dataFst);
    		if(response.ipList != null){
	    		for(k=0; k<response.ipList.length; k++){
	    			var dataParam = response.ipList[k]; 
	    			option_data.push(dataParam);
	    		}
    		}
			$('#mailEqpIpAddr').clear();
			$('#mailEqpIpAddr').setData({data : option_data});    
			
			if(popTmofCd != ""){
				if(popTmofCd=="MO00000000101" || popTmofCd=="MO00000000102" || popTmofCd=="MO00000000103" || popTmofCd=="MO00000000104" || popTmofCd=="MO00000000105"){
					$('#mailEqpIpAddr').setSelected("수도권 OMS");    
				}else if(popTmofCd=="MO00000000109"){
					$('#mailEqpIpAddr').setSelected("대구 OMS");    
				}else if(popTmofCd=="MO00000000106" || popTmofCd=="MO00000000107"){
					$('#mailEqpIpAddr').setSelected("부산 OMS");    
				}else if(popTmofCd=="MO00000000110" || popTmofCd=="MO00000000111" || popTmofCd=="MO00000000112"){
					$('#mailEqpIpAddr').setSelected("서부 OMS");    
				}else if(popTmofCd=="MO00000000113" || popTmofCd=="MO00000000114" || popTmofCd=="MO00000000115"){
					$('#mailEqpIpAddr').setSelected("중부 OMS");    
				}	
			}
		} 	
		// 전송 버튼
    	if(flag == 'saveomsftpinfo') {
			cflineHideProgressBody();
			if(nullToEmpty(response.Result) == "Success"){
	    		callMsgBox('', 'I', cflineCommMsgArray['normallyProcessed'] /* 정상적으로 처리되었습니다. */, function() {
	    			$a.close(null);
	    		}); 	       			    	
			}else{
		    	alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			}
		} 
		
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
//    	if(flag == 'searchList') {
//    		cflineHideProgressBody();
//        	alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
//		} 
    	if(flag == 'saveomsftpinfo') {
			cflineHideProgressBody();
	    	alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
		} 	
    	
    }    
    
    var httpRequestPop = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
 
});