/**
 * UpsdMtsoFloorReg.js
 *
 * @author Administrator
 * @date 2017. 10. 13.
 * @version 1.0
 */
$a.page(function() {

	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	setSelectCode();
        setEventListener();
        httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoFloor', paramData, 'GET', 'mtsoFloor');

    };

    function setEventListener() {
    	//저장
        $('#btnSave').on('click', function(e) {
        	var param = $('#floorForm').getData();
        	var affairCd = '';
        	$('#affairCheckBox').find('input:checked').each(function(i){
        		if(i == 0) {
        			affairCd = this.value;
        		} else {
        			affairCd += ',' + this.value;
        		}
    		});

        	param.affairCd = affairCd;
    		param.status = 'U';
    		param.useYn = 'Y';
        	callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
        		//저장한다고 하였을 경우
        		if (msgRst == 'Y') {
        			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveMtsoFloor', param, 'POST', 'floorReg');
        		}
        	});

        });

        //취소
        $('#btnCncl').on('click', function(e) {
        	$a.close();
        });
	};

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var assetCd = {supCd : '013000'};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', assetCd, 'GET', 'assetCd');
	}

	function successCallback(response, status, jqxhr, flag){
		if(flag == 'mtsoFloor') {
			$('#sisulNm').val(response.floor[0].sisulNm);
			$('#floorName').val(response.floor[0].floorName);
			if(response.floor[0].affairCd != undefined) {
				$('#affairCd').setValues(response.floor[0].affairCd.split(','));
			}
			$('#floorLabel').val(response.floor[0].floorLabel);
			$('#sisulCd').val(response.floor[0].sisulCd);
			$('#floorId').val(response.floor[0].floorId);
			$('#assetCd').setSelected(response.floor[0].assetCd);
		}

		if(flag == 'assetCd') {
			var option_data = [{cd: response[0].cd, cdNm: response[0].cdNm}];
			for(var i=1; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				option_selected: '자가'
			});
		}
		if(flag == 'floorReg') {
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
				$(parent.location).attr("href","javascript:floor.setGrid({sisulCd:'"+sisulCd.value+"'})");
			}

		}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
		if(flag == 'getDrawMstoFloor') {
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