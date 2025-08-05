/**
 * OpenTaskLineSearchPop.js
 *
 * @author Administrator
 * @date 2016. 11. 01
 * @version 1.0
 */

$a.page(function() {

var svlnSclCd = "";
var reqSubList = null;
var noneExistList = null;
var noneExistCnt = 0;
	
    this.init = function(id, param) {
    	svlnSclCd = param.svlnSclCd;
    	reqSubList = param.reqSubList;
    	noneExistList = param.noneExistList;
    	noneExistCnt = param.noneExistCnt;
    	$('#btnLineLkupPop').setEnabled(false);
    	$('#btnForceComplete').setEnabled(false);
    	updateReqSubList(reqSubList)
        setEventListener();   
    };
    
 	//회선존재건에대한 업데이트 
    function updateReqSubList(reqSubList)	{
    	if(reqSubList != null && reqSubList.length>0){
	    	var reqParam = {"svlnSclCd" : svlnSclCd};
			$.extend(reqParam,{"jobCompleteCd":"12"});
			$.extend(reqParam,{"reqSubList":reqSubList});
    		$.extend(reqParam,{"crcnCmplYn":"N"});
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/updatejobrequest', reqParam, 'POST', 'updateReqSubList');
    	}else{
        	$('#btnLineLkupPop').setEnabled(true);
        	$('#btnForceComplete').setEnabled(true);
        	$('#noticeMsg').text( makeArgMsg('openTaskJobConfirmMsg2',noneExistCnt,"","","") );	/*	{0}개의 작업이 회선이 존재하지 않습니다. \n 회선을 찾으시겠습니까?	*/
    	}
    }

    //강제완료
    function forceFinish(data){
		callMsgBox('','C', cflineMsgArray['forceFinishMsg'], function(msgId, msgRst){  
 		    if (msgRst == 'Y') {
 		    	var forceParam = {"svlnSclCd" : svlnSclCd};
 				$.extend(forceParam,{"jobCompleteCd":"1"});
 				$.extend(forceParam,{"reqSubList":data});
        		$.extend(forceParam,{"crcnCmplYn":"Y"});
 				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/updatejobrequest', forceParam, 'POST', 'forceFinish');
 	    	}else{
 	    		$a.close();
 	    	}
    	});	
    }
    
    function setEventListener() {
    	//	회선찾기
    	$('#btnLineLkupPop').on('click', function(e) {
    		var data = {
    				"lineList":noneExistList
    				,"gubun":"S"
			};
    		$a.close(data);
    	});
    	//	강제완료
    	$('#btnForceComplete').on('click', function(e) {
    		forceFinish(noneExistList);
    	});
    	//	취소
    	$('#btnCanclePop').on('click', function(e) {
    		$a.close("C");
	   	});
	};
	
	//request 성공시.
    function successCallback(response, status, jqxhr, flag){
		
		//회선존재건에대한 업데이트 
		if(flag == 'updateReqSubList'){
    		cflineHideProgressBody();
			if(response.result = "Success"){
	        	$('#btnLineLkupPop').setEnabled(true);
	        	$('#btnForceComplete').setEnabled(true);
	        	$('#noticeMsg').text( makeArgMsg('openTaskJobConfirmMsg1',response.sCnt,"","","") +"\n"  
	        			+ makeArgMsg('openTaskJobConfirmMsg2',noneExistCnt,"","","") ); 	/* 회선이 존재하는 {0}개의 작업은 접수되었습니다. */ /*	{0}개의 작업이 회선이 존재하지 않습니다. \n 회선을 찾으시겠습니까?	*/
			}else{
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			}
		}
		// 강제 완료
		if(flag == 'forceFinish'){
			if(response.result = "Success"){
	    		var data = {
	    				"gubun":"F"
				};
	    		$a.close(data);
			}else{
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			}
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'updateReqSubList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
		}
    	if(flag == "forceFinish"){
			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
		}
    }
    
    
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