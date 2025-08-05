/**
 * fhExcelApplyReflctPop
 *
 * @author P135551
 * @date 2019. 1. 29. 오전 13:30:03
 * @version 1.0
 */

var mainpop = $a.page(function() {
	var intgFcltCd = null;
	var paramData = null;
	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,6}([.]\d{0,3})?)|[0-9]([.]\d{0,3})?$/);

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	setDataSet(param);
    	setCombo();
    	setEventListener();

    };

	function setCombo() {
//		    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/splyMeans', null, 'GET', 'splyMeans');
		        httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03012', null, 'GET', 'splyMeans');
    }

    function setEventListener() {

        $("#btnCnclReg").on('click', function(e){
    		$a.close();
    	});
        $('#btnSaveReg').on('click', function(e) {
        	var dataParam = $("#fhExcelApplyReflctPop").getData();
        	dataParam.lastChgUserId = $("#userId").val();
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/updateApplyRefict', dataParam, 'POST', 'updateApplyRefict');
        });
    };

    function setDataSet(data){

    	if(data != '' || data != null){
    		$('#fhExcelApplyReflctPopArea').setData(data);
    		intgFcltCd = paramData.intgFcltsCd

    	}
    }

    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'updateApplyRefict'){
    		//저장을 완료 하였습니다.
        	callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
        		if (msgRst == 'Y') {
        			$a.close(msgRst);
        		}
        	});

//	        var pageNo = $("#pageNo", opener.document).val();
//			var rowPerPage = $("#rowPerPage", opener.document).val();
//
//	        $(opener.location).attr("href","javascript:FhExcelApplyReflctList.setGrid("+pageNo+","+rowPerPage+");");
    	}
    	if(flag == 'gridSearch'){	// 등록


    	}
    	if(flag == 'splyMeans') {
    		$('#splyMeansCd').clear();

    		var option_data =  [];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData.splyMeansCd == '' || splyMeansCd == null){
				$('#splyMeansCd').setData({
		             data:option_data,
		             splyMeansCd : "09"
				});
			}else{
				$('#splyMeansCd').setData({
		             data:option_data ,
		             splyMeansCd : paramData.splyMeansNm
				});
			}
    	}

    }
  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'deletelist') {
    		bodyProgressRemove();
    		alertBox('W', '정상적으로 처리되지 않았습니다.');
    		return;
    	}

    }

    function bodyProgress() {
    	$('body').progress();
    }

    function bodyProgressRemove() {
    	$('body').progress().remove();
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