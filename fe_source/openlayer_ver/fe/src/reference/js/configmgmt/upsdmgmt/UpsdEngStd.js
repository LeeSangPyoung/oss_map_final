/**
 * UpsdEngStd.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	var p = $('#ff').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUpsdEngStdList', p, 'GET', 'search');
    	setEventListener();
    };

    function setEventListener() {
    	//저장
    	$('#btnReg').on('click', function(e) {
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			//저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	var p = $('#ff').getData();
 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertUpsdEngStd', p, 'POST', 'saveReg');
 		        }
    		});
    	});
    }

	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			if(response.upsdEngStdList.length > 0) {
				$('#ff').setData(response.upsdEngStdList[0]);
			}
		}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
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