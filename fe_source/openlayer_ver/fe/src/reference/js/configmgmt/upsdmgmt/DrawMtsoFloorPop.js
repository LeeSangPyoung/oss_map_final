/**
 * DrawMtsoFloor.js
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
    	//param = {sisulCd : '201617780', floorId : '1798'};
    	//param = {sisulCd : '20161C309', floorId : '1861'};
    	paramData = param;

        setEventListener();
        $('#drawform').setData(param);
        if(paramData.insert == 'U') {
        	setSelectCode();
	        if(paramData.sisulCd != undefined) {
	        	setTimeout(httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawMtsoFloor', paramData, 'GET', 'getDrawMtsoFloor'),3000);
	        }
        }else{
        	setSelectCode();
        }

    };
    function setSelectCode(){
    	topMtsoId = $("#topMtsoId").val();
    	floorId = paramData.floorId;

    	if(floorId == null || floorId == undefined){
    		var param = {mtsoId : topMtsoId};
    	} else {
    		var param = {mtsoId : topMtsoId, floorId : floorId};
    	}

//    	var mtsoId = {mtsoId : topMtsoId};

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorMtsoId', param, 'GET', 'MtsoIdList');
    }
    function setEventListener() {
    	//옥상 추가로 인한 로직 추가
    	$("#topFloor").on("click", function(e){
    		if($('#topFloor').is(':checked')){
    			$("#floorName").val("");
    			$("#floorName").setEnabled("false");
    		}else{
    			$("#floorName").val("");
    			$("#floorName").setEnabled("true");
    		}
    	});

    	//저장
        $('#btnSave').on('click', function(e) {
        	var insertParam = $('#drawform').getData();
        	var affairCd = '';
//        	$('#affairCheckBox').find('input:checked').each(function(i){
//        		if(i == 0) {
//        			affairCd = this.value;
//        		} else {
//        			affairCd += ',' + this.value;
//        		}
//    		});
        	affairCd = "008001";		// 임의 설정
        	insertParam.affairCd = affairCd;
        	insertParam.assetCd = $('#assetCd').val();
			//옥상 추가로 인한 로직 추가
        	if($('#topFloor').is(':checked')){
        		insertParam.floorName = $('#topFloor').val();
    		}

        	console.log(insertParam);
        	if (insertParam.floorName == "") {
		     	//필수 선택 항목입니다.[ 본부 ]
			    callMsgBox('','I', makeArgConfigMsg('requiredOption','층구분'), function(msgId, msgRst){});
		     	return;
		     }
        	if (insertParam.floorLabel == "") {
        		//필수 선택 항목입니다.[ 국소명 ]
        		callMsgBox('','I', makeArgConfigMsg('requiredOption','국소명(층)'), function(msgId, msgRst){});
        		return;
        	}
//        	if (insertParam.mtsoId == "") {
//        		//필수 선택 항목입니다.[ 국소명 ]
//        		callMsgBox('','I', makeArgConfigMsg('requiredOption','층국사'), function(msgId, msgRst){});
//        		return;
//        	}

//        	if (affairCd == "") {
//        		//필수 선택 항목입니다.[ 용도구분 ]
//        		callMsgBox('','I', makeArgConfigMsg('requiredOption','용도구분'), function(msgId, msgRst){});
//        		return;
//        	}
        	if (insertParam.neFloorWidth == "") {
        		//필수 선택 항목입니다.[ 가로 ]
        		callMsgBox('','I', makeArgConfigMsg('requiredOption','가로'), function(msgId, msgRst){});
        		return;
        	}
        	if (insertParam.neFloorLength == "") {
        		//필수 선택 항목입니다.[ 세로 ]
        		callMsgBox('','I', makeArgConfigMsg('requiredOption','세로'), function(msgId, msgRst){});
        		return;
        	}
        	if (insertParam.neFloorHeight == "") {
        		//필수 선택 항목입니다.[ 층고 ]
        		callMsgBox('','I', makeArgConfigMsg('requiredOption','층고'), function(msgId, msgRst){});
        		return;
        	}
//        	if(insertParam.neFloorWidth >= insertParam.neFloorLength){
//        		insertParam.standardSize = Math.floor(parseFloat(insertParam.neFloorWidth)/1000);
//        	}else{
//        		insertParam.standardSize = Math.floor(parseFloat(insertParam.neFloorLength)/1000);
//        	}
        	if(paramData.insert == 'I') {
        		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
        			//저장한다고 하였을 경우
        			if (msgRst == 'Y') {
        				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertDrawMtsoFloor', insertParam, 'POST', 'insertDrawMtsoFloor');
        			}
        		});
        	} else if(paramData.insert == 'U') {
        		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
        			//저장한다고 하였을 경우
     		        if (msgRst == 'Y') {
     		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/updateDrawMtsoFloor', insertParam, 'POST', 'updateDrawMtsoFloor');
     		        }
    		     });
        	}  else if(paramData.sisulCd == '' || paramData.floorId == '') {
        		callMsgBox('','C', '잘못된 접근입니다.', function(msgId, msgRst){
        			$a.close();
        		});
        	}
        });

        //취소
        $('#btnCncl').on('click', function(e) {
        	$a.close();
        });

	};


	function successCallback(response, status, jqxhr, flag){

		if(flag == 'MtsoIdList') {
			$('#mtsoId').clear();
			var option_data = [{mtsoId: '', mtsoNm: '선택하세요'}];
			for(var i=0; i<response.mtsoIdList.length; i++){
				var resObj = response.mtsoIdList[i];
				option_data.push(resObj);
			}
			$('#mtsoId').setData({
				data : option_data
			});
		}
		if(flag == 'getDrawMtsoFloor') {
//			$('#floorName').val(response.drawMstoFloor[0].floorName);
//			if(response.drawMstoFloor[0].affairCd != undefined) {
//				$('#affairCd').setValues(response.drawMstoFloor[0].affairCd.split(','));
//			}
//			$('#floorLabel').val(response.drawMstoFloor[0].floorLabel);
//			$('#neFloorWidth').val(response.drawMstoFloor[0].neFloorWidth);
//			$('#neFloorLength').val(response.drawMstoFloor[0].neFloorLength);
//			$('#neFloorWidth').setEnabled(false);
//			$('#neFloorLength').setEnabled(false);
//
//			$('#neFloorHeight').val(response.drawMstoFloor[0].neFloorHeight);
//			$('#sisulCd').val(response.drawMstoFloor[0].sisulCd);
//			$('#floorId').val(response.drawMstoFloor[0].floorId);
//			$('#assetCd').val(response.drawMstoFloor[0].assetCd);
//			$('#mtsoId').val(response.drawMstoFloor[0].mtsoId);
//			//$("#mtsoId option:selected").val(response.drawMstoFloor[0].mtsoId);
//			alert(response.drawMstoFloor[0].mtsoId);
			//옥상 추가로 인한 로직 추가
			if(response.drawMstoFloor[0].floorName == "옥상"){
				$('#topFloor').trigger('click');
				$("#floorName").val("");
    			$("#floorName").setEnabled("false");
			}
			$('#drawform').setData(response.drawMstoFloor[0]);
		}

		if(flag == 'updateDrawMtsoFloor') {
			if(response.Result == "Success"){
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close(response);
        			}

				});
			}
		}

		if(flag == 'insertDrawMtsoFloor') {
			if(response.Result == "Success"){
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close(response);
        			}
				});
			}
		}
//		if(flag == 'assetCd') {
//			var option_data = [{cd: response[0].cd, cdNm: response[0].cdNm}];
//			for(var i=1; i<response.length; i++){
//				var resObj = response[i];
//				option_data.push(resObj);
//			}
//			$('#'+flag).setData({
//				data : option_data,
//				option_selected: '자가'
//			});
//		}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
		if(flag == 'getDrawMtsoFloor') {
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