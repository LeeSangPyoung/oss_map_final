/**
 * OneClickConfigExcelUploadPop
 *
 * @author P123512
 * @date 2018. 10. 05. 
 * @version 1.0
 */

var paramData = null;
var resultCode = null;
var configContent = [];
var tmofList = null;
$a.page(function() {
    this.init = function(popId, popParam) {
    	if (! jQuery.isEmptyObject(popParam) ) {
    		paramData = popParam;
    		tmofList = paramData.tmofList
    	}
        setEventListener();
        setSelectCode();
    };    
});
 

function setSelectCode() {
	configContent.push({"uprComCd":"","value":"01","text":"AON/CON/SNCP"});
	configContent.push({"uprComCd":"","value":"02","text":"SNCP_RT"});
	configContent.push({"uprComCd":"","value":"03","text":cflineMsgArray['englishConversion']/*"영문변환"*/});
	configContent.push({"uprComCd":"","value":"04","text":cflineMsgArray['dcsLinkage']/*"DCS간연동"*/});
	configContent.push({"uprComCd":"","value":"05","text":cflineMsgArray['tieMgmt']/*"TIE관리"*/});
	configContent.push({"uprComCd":"","value":"06","text":cflineMsgArray['omsMgmtEquipment']/*"OMS관리장비"*/});
	$('#configContent').setData({data : configContent});
	$('#tmpTmofCd').setData({data : tmofList});
	$('#configContent').setSelected(paramData.cnfgCtnt);
//	console.log(nullToEmpty(paramData.tmofCd));
	if(nullToEmpty(paramData.tmofCd) != ""){
		$('#tmpTmofCd').setSelected(nullToEmpty(paramData.tmofCd));
	}
}

function setEventListener() { 

	// 탭 선택 이벤트
	 	$("#configContent").on('change', function(e, index) {
	 		if(nullToEmpty($('#configContent').val()) == "03"){
	 			$('#tmpTmofCd').setEnabled(false);
	 		}else{
	 			$('#tmpTmofCd').setEnabled(true);
	 		}
	 	});    
	
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
		var tabIdx = $('#configContent').val();
		var tabName = null;
		if(tabIdx == 01 ) {
			tabName = "AON/CON/SNCP";
			$('#tabIndexValue').val("0");
			$('#tmofCd').val(nullToEmpty($('#tmpTmofCd').val()));
		} else if(tabIdx == 02 ) {
			tabName = "SNCP_RT";
			$('#tabIndexValue').val("1");
			$('#tmofCd').val(nullToEmpty($('#tmpTmofCd').val()));
		} else if(tabIdx == 03 ) {
			tabName = cflineMsgArray['englishConversion']/*"영문변환"*/;
			$('#tabIndexValue').val("2");
			$('#tmofCd').val("");
		} else if(tabIdx == 04 ) {
			tabName = cflineMsgArray['dcsLinkage']/*"DCS간연동"*/;
			$('#tabIndexValue').val("3");
			$('#tmofCd').val(nullToEmpty($('#tmpTmofCd').val()));
		} else if(tabIdx == 05 ) {
			tabName = cflineMsgArray['tieMgmt']/*"TIE관리"*/;
			$('#tabIndexValue').val("4");
			$('#tmofCd').val(nullToEmpty($('#tmpTmofCd').val()));
		} else if(tabIdx == 06 ) {
			tabName = cflineMsgArray['omsMgmtEquipment']/*"OMS관리장비"*/;
			$('#tabIndexValue').val("5");
			$('#tmofCd').val(nullToEmpty($('#tmpTmofCd').val()));
		}

		if ($("#excelFile").val() == null || $("#excelFile").val() == "") {
			alertBox('W', cflineCommMsgArray['selectUploadFile']);/* 업로드할 파일을 선택해 주세요. */
			return;
		}
		var fileExtensionChk = $("#excelFile").val().toLowerCase();
		if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
			alertBox('W', cflineCommMsgArray['checkExtensionTwoType']);/* 확장자가 xlsx 혹은 xls만 가능합니다. */
			return;
		}		
		callMsgBox('','C', makeArgCommonMsg("atUploadFile", tabName), function(msgId, msgRst){ //'? (를)업로드 하시겠습니까?'
    		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */	
				var form = new FormData(document.getElementById('excelform'));
    			//var tabIdxParam = $('#tabIndexValue').val();
				cflineShowProgressBody();
				httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/oneclickconfig/oneclickconfigexcel/excelupload', form, 'post', 'excelUpload');
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
		$a.close(resultCode);
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
		
    	
    	if(data.resultCd == "typeNG") {
    		msg = cflineMsgArray['oneClickNotSameType']/*"업로드창에서의  OneClick 유형과 엑셀 유형이 다릅니다."*/;
			alertBox('W', msg);

			$("#fileName").val(data.fileNames + "." + data.extensionNames);
			$("#extensionName").val(data.extensionNames);
			return false;
    	} else if(data.resultCd == "NG") {
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
