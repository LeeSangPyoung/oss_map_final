/**
 * UpsdEqpMgmtRegPop.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
$a.page(function() {

	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	setEventListener();
    	setSelectCode();
        setRegDataSet(param);
    };

    function setRegDataSet(param) {
    	$('#upsdEqpMgmtArea').setData(param);
    };

    function setSelectCode() {
    	// 사급/지입여부 콤보리스트
    	var costTypedata = {supCd : '009000'}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', costTypedata, 'GET', 'csType');
    }

    function setEventListener() {

    	// 숫자만 입력가능
    	$('#unitSize').keyup(function(e) {
    		 if(!$("#unitSize").validate()){
    			//UNIT SIZE 입력은 숫자만 입력 가능합니다.
    			callMsgBox('', 'W', makeArgConfigMsg('requiredDecimal', 'UNIT SIZE'), function(msgId, msgRst){});
    			$('#unitSize').val("");
    			 return;
    		 };
        });

    	//저장
    	$('#btnSave').on('click', function(e) {
    		var param =  $("#upsdEqpMgmtRegForm").getData();

    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			//저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateUpsdEqpMgmt', param, 'POST', 'upsdEqpMgmtReg');
 		        }
		     });
   	 	});
    	//취소
		$('#btnCncl').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			$a.close();
		});
	};

	function successCallback(response, status, jqxhr, flag){
		// 사급/지입여부
		if(flag == 'csType'){
			$('#'+flag).clear();

			var option_data = [{cd: '', cdNm: '선택'}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				csType: paramData.csType
			});
		}

		//저장후
		if(flag == 'upsdEqpMgmtReg') {
			if(response.Result == "Success"){
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					$a.close();
				});

				var pageNo = $("#pageNo", parent.document).val();
	    		var rowPerPage = $("#rowPerPage", parent.document).val();

	            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
			}
		}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'upsdEqpMgmtReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
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