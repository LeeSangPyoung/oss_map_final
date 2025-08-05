/**
 * PacketTrunkIndexExcelUploadPop
 *
 * @author P123512
 * @date 2018. 06. 08. 
 * @version 1.0
 */

var paramData = null;
var resultCode = null;

$a.page(function() {
    this.init = function(popId, popParam) {
    	if (! jQuery.isEmptyObject(popParam) ) {
    		paramData = popParam;
    	}
        setEventListener();
    };    
});
 
function setEventListener() { 
 	// 파일 선택
    $('#fileSelect').on('click', function(e) {    		
		var exform  = document.getElementById('excelform');
		exform.reset();
		$('#excelFile').click();
    });    

	$('#excelFile').on('change', function(e) {  
		$("#textFileNm").text(this.value);
	});
	
	// 업로드 클릭    	
	$('#btn_up_excel').on('click', function(e) {
		if ($("#excelFile").val() == null || $("#excelFile").val() == "") {
			alertBox('W', cflineCommMsgArray['selectUploadFile']);/* 업로드할 파일을 선택해 주세요. */
			return;
		}
		var fileExtensionChk = $("#excelFile").val().toLowerCase();
		if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
			alertBox('W', cflineCommMsgArray['checkExtensionTwoType']);/* 확장자가 xlsx 혹은 xls만 가능합니다. */
			return;
		}		
		callMsgBox('','C', makeArgCommonMsg("atUploadFile", "패킷트렁크정보"), function(msgId, msgRst){ //'패킷트렁크정보(를)업로드 하시겠습니까?'
    		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */	
				var form = new FormData(document.getElementById('excelform'));			
				cflineShowProgressBody();
				httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindexexcel/excelupload', form, 'post', 'excelUpload');
			}
		});
    	
	});
  
	// 에러파일 다운로드
	$("#btn_fail_excel").on('click', function(){
		if($("#fileName").val() == "" || $("#extensionName").val() == "") {
			alertBox('W', cflineCommMsgArray['noExistFileForDownload']);  /* 다운로드 할 파일이 존재하지 않습니다. */
			return false;
		}
		else {
			getExcelFileDown("excelUploadFailFile"); 
		}
	});    	
	
	// 닫기버튼클릭
	$('#btn_close').on('click', function(e) {
		if($("#fileName").val() == "" || $("#extensionName").val() == "") {
    		$a.close(resultCode);
		} else {
			getExcelFileDown("excelUploadFailFile");
    		$a.close(resultCode);
		}
	});
	
}

function getExcelFileDown(gubunFile){
	var $form=$('<form></form>');
	$form.attr('name','downloadForm');
	$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindexexcel/exceldownload");
	$form.attr('method','GET');
	$form.attr('target','downloadIframe');
	$form.append(Tango.getFormRemote());
	$form.append('<input type="hidden" name="fileName" value="'+$("#fileName").val()+'" /><input type="hidden" name="fileExtension" value="'+$("#extensionName").val()+'" />');
	$form.append('<input type="hidden" name="type" value="' + gubunFile + '" />');
	$form.appendTo('body');
	$form.submit().remove();	
}

//초기 조회 성공시
function successUploadCallback(response, flag){  	
   	if (flag == 'excelUpload') {
		cflineHideProgressBody();
		var data = response;
		var msg = "";

    	$("#excelFile").val("");
    	$("#textFileNm").text("");
		
    	if(data.resultCd == "NG") {
			resultCode = "NG";
			msg = cflineCommMsgArray['existFailUploadData']; /* 업로드에 실패한 데이터가 있습니다. */
			if (data.errorCd == "DATA_CHECK_ERROR") {
				msg += "<br>(";
				if (nullToEmpty(data.excelOkCount) != ''  && data.excelOkCount !='0') {
					resultCode = "OK";
					msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
				}
				msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
			}
			if (data.errorCd == "UPLOAD_LIMIT_CNT"){
				msg = cflineMsgArray['excelRowOver']; /* 엑셀 업로드는 최대 1000건 까지만 가능합니다 */
			}
			alertBox('W', msg);

			$("#fileName").val(data.fileNames + "." + data.extensionNames);
			$("#extensionName").val(data.extensionNames);
			return false;
    	} else {
    		msg = cflineCommMsgArray['normallyProcessed']; /* 정상적으로 처리되었습니다. */
			msg += "<br>("+cflineCommMsgArray['success'] +" : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ")";
			alertBox('I', msg);   /* 정상적으로 처리되었습니다. */
			resultCode = "OK";
		}
	}		
}

//request 실패시.
function failUploadCallback(response, flag){
	if (flag == 'excelUpload') {
		cflineHideProgressBody();
    	$("#excelFile").val("");
		if(response.message != null && response.message != '') {
			alertBox('I', response.message);
		}
	} else {
		
	}
}

var httpUploadRequest = function(surl, sdata, smethod, sflag ) {
	Tango.ajax({
		url : surl, //URL 기존 처럼 사용하시면 됩니다.
		data : sdata, //data가 존재할 경우 주입
		method : smethod, //HTTP Method
    	dataType:'json',
        processData:false,
        contentType:false
	}).done(function(response){successUploadCallback(response, sflag);})
    .fail(function(response){failUploadCallback(response, sflag);})
}
