/**
 * DrawCblIstnAttr.js
 *
 * @author Administrator
 * @date 2017. 11. 27.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	setAttr();
    	setSelectCode();
    	setEventListener();
    };


    function setSelectCode() {
    	var supCd = {supCd : '009000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', supCd, 'GET', 'csType');
    }

    function setAttr() {
    	$('#labelNm').val(paramData.labelNm);
    	$('#width').val(paramData.width);
    	$('#length').val(paramData.length);
    	$('#height').val(paramData.height);
    	var lv3 = {lv3: paramData.lv3};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getLv', lv3, 'GET', 'getLv');
    	if(paramData.modelId == undefined || paramData.modelId == ""){

    	}else {
    		var modelId = {modelId: paramData.modelId};
    		$('#modelId').val(paramData.modelId);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBaseInfo', modelId, 'GET', 'getBaseInfo');
    	}
    }

    function setEventListener() {
    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });

    	//등록
    	 $('#btnSave').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 baseReg();
		        }
		     });
         });

	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'getBaseInfo'){
			if(response.baseInfo.length > 0){
				data = response.baseInfo[0];
				$('#lv1').val(data.lv1);
				$('#lv2').val(data.lv2);
				$('#lv1Nm').val(data.lv1Nm);
				$('#lv2Nm').val(data.lv2Nm);
				//$('#width').val(data.width);
				//$('#length').val(data.length);
				$('#height').val(data.height);
				$('#csType').setSelected(data.csType);
			}
		}

    	if(flag == 'getLv'){
    		data = response.lv[0];
    		$('#lv1').val(data.lv1);
    		$('#lv2').val(data.lv2);
    		$('#lv1Nm').val(data.lv1Nm);
    		$('#lv2Nm').val(data.lv2Nm);
    	}

    	if(flag == 'baseReg') {
    		if(response.Result == "Success"){
	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		    	   parent.top.$a.setItemId(response.resultList.modelId)
	    		       }
	    		});
    		}
    	}

    	if(flag == 'csType') {
    		var option_data = [{cd: '', cdNm: '선택'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
			$('#'+flag).setData({
				data : option_data,
				orgIdL1: ''
			});
    	}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'mtsoReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function baseReg() {
    	var param =  $("#drawBaseEqpAttrForm").getData();

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveBaseInfo', param, 'POST', 'baseReg');

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