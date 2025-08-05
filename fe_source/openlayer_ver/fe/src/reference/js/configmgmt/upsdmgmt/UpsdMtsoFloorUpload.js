/**
 * UpsdMtsoCadUpload.js
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
    };

    function setEventListener() {
	    $('#fileSelect').on('click', function(e) {
    		var uploadForm  = $('#uploadForm')[0];
    		uploadForm.reset();
    		$('#uploadFile').click();
        });

    	$('#uploadFile').on('change', function(e) {
    		$("#textFileNm").text(this.value);
    	});

    	$('#btnSave').on('click', function(e) {
    		var fileChk = $("#uploadFile").val();
    		if (fileChk == null || fileChk == "") {
				alertBox('W', "업로드할 파일을 선택해 주세요");
				return;
			}
    		/*
    		var fileExtensionChk = fileChk.toLowerCase();
			if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
				alertBox('W', "확장자가 xlsx혹은 xls만 가능합니다.");
				return;
			}
			*/
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			//저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	$('#sisulCd').val(paramData.sisulCd);
 		        	$('#floorId').val(paramData.floorId);

 		        	var form = $('#uploadForm')[0];
 		        	var data = new FormData(form);

 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/mtsoFloorFileUpload', data, 'post', 'uploadFile');
 		        }
		     });
    	});

    	$('#btnCncl').on('click', function(e) {
    		$a.close();
    	});
    }

	//request 성공시
    function successCallback(response, flag){
		if (flag == 'uploadFile') {
			$a.close();
		}
	}

	//request 실패시.
	function failCallback(response, flag){
		if (flag == 'uploadFile') {
    		alertBox('W', "파일 업로드에 실패했습니다.");  /* 파일 업로드에 실패했습니다. */
			return false;
    	}
	}

	var httpRequest = function(surl,sdata,smethod,sflag) {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod,
	    	dataType:'json',
	    	cache: false,
	    	contentType:false,
            processData:false
    	}).done(function(response){successCallback(response, sflag);})
    	  .fail(function(response){failCallback(response, sflag);})
	}

});