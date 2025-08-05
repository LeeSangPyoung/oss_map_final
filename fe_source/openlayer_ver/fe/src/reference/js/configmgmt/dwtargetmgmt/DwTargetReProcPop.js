/**
 * MtsoInvtMgmt.js
 *
 * @author Administrator
 * @date 2020. 02. 25.
 * @version 1.0
 */
var main = $a.page(function() {
	var paramData = null;

	this.init = function(id, param) {

		paramData = param;
		$("#offsetVal").val('0')

		setSelectCode();
		setEventListener();
	};



	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {



	}


	function setEventListener() {

		// 닫기
		$('#btnCancel').on('click', function(e) {
			$a.close();
		});

		$('#btnReProcSave').on('click', function(e) {
			callMsgBox('','C', "재처리를 진행하시겠습니까?", function(msgId, msgRst){
		    	//전달 하였을 경우
		    	if (msgRst == 'Y') {

		    		console.log(paramData);

		    		var reProcDivYn = $("#reProcDivYn").getValue();


		    		var parmVal ="";
		    		if (reProcDivYn === 'K') {
		    			parmVal = 'KAFKA OFFSET' + $("#offsetVal").val();
		    		} else {
		    			parmVal = 'OFFSET' + $("#offsetVal").val();
		    		}

		    		console.log(parmVal);

		    		var param = {};
		    		param.lnkgIfId = paramData.lnkgIfId;
		    		param.parmVal = parmVal;

//		    		$a.close({reProcYn : 'Y'});

		    		httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/updateDwReProcYn', param, 'POST', 'reProcUpdate');
		    	}
		    });
		});

	};


	function successCallback(response, status, jqxhr, flag) {

		if(flag == 'reProcUpdate'){
			callMsgBox('','I', "재처리 스케줄러에 등록되었습니다." , function(msgId, msgRst){
				$a.close({reProcYn : 'Y'});
			});
		}

	}

	function failCallback(response, status, jqxhr, flag){

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

	$a.maskedinput($("#offsetVal")[0], "0");
});

