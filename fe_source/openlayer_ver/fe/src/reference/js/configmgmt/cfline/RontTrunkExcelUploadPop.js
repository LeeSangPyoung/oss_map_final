/**
 * ServiceLineExcelUploadPop
 *
 * @author P100700
 * @date 2016. 12. 07. 
 * @version 1.0
 */
var mgmtGrpCdVal = "";
$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
	var paramData = null;
    var resultCode = null;
	
    this.init = function(popId, popParam) {
    	setMgmtGrp (mgmtGrpCdVal);  // 관리 그룹 selectBox
    	if (! jQuery.isEmptyObject(popParam) ) {
    		paramData = popParam;
    	}
        setEventListener();
        
        //RM선번적용 체크박스 제어 
        $('#rnmLnoAplyYn').setEnabled(false);
        $('#rnmLnoAplyYnInPop').val("");
    };    
    //관리그룹코드
    function  setMgmtGrp (selVal){
    	if(selVal=="SKT"){
    		userMgmtCd = "0001";		
    		viewMgmtCd = userMgmtCd;
    	}else if(selVal=="SKB"){
    		userMgmtCd = "0002";
    		viewMgmtCd = userMgmtCd;
    	}
    	httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188');
    }
    
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

    		$("#infoValInPop").val(""); 
    		$("#sctnLnoValInPop").val(""); 
    		if ($('#infoVal').is(":checked") == false && $('#sctnLnoVal').is(":checked") == false) {
    			alertBox('W', cflineMsgArray['selectDemandPoolUpDataType']);/* 업로드할 정보타입을 선택해 주세요. */
    			$('#infoVal').focus();
    			return; 
    		}        
    			
			if ($("#mgmtGrpCdPop").val() == null || $("#mgmtGrpCdPop").val() == "") {
				alertBox('W', makeArgCommonMsg("required", cflineMsgArray['managementGroup']));/* [{0}] 필수 입력 항목입니다. */
				return;
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
			$("#mgmtGrpCdInPop").val($("#mgmtGrpCdPop").val());

	    	if ($("input:checkbox[id='infoVal']").is(":checked") ){
	    		$("#infoValInPop").val("Y"); 
	    	}
	    	if ($("input:checkbox[id='sctnLnoVal']").is(":checked") ){
	    		$("#sctnLnoValInPop").val("Y"); 
	    	}
	    	
		    console.log($("#mgmtGrpCdInPop").val());
			var msg = cflineMsgArray['excel'];						/* 엑셀  */
			if($('#infoVal').is(":checked") == true){
				msg += " " + cflineMsgArray['baseInformation']; 					/* 기본정보  */
			}
			if($('#sctnLnoVal').is(":checked") == true){
				msg += " " + cflineMsgArray['lnoInformation'];					/* 선번정보  */
			}
	
			callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg),function(msgId, msgRst){ //'기본정보을(를)업로드 하시겠습니까?'
        		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */	
    				var form = new FormData(document.getElementById('excelform'));			
//        		    console.log(form);
    				cflineShowProgressBody();
    				httpUploadRequest(
    						     'tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/excelupload'
        			           , form
        			           , 'post'
        			           , 'excelUpload');
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

	};
	function getExcelFileDown(gubunFile){
		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="fileName" value="'+$("#fileName").val()+'" /><input type="hidden" name="fileExtension" value="'+$("#extensionName").val()+'" />');
		$form.append('<input type="hidden" name="type" value="' + gubunFile + '" />');
		$form.appendTo('body');
		$form.submit().remove();	
	}

	//초기 조회 성공시
    function successUploadCallback(response, flag){  	
    	// 관리그룹
    	if(flag == 'C00188'){	
			var mgmtGrpCd_option_data =  [];
			for(k=0; k<response.length; k++){
				var dataMgmtGrp = response[k];
					mgmtGrpCd_option_data.push(dataMgmtGrp);	
			}		
			$('#mgmtGrpCdPop').clear();
			$('#mgmtGrpCdPop').setData({data : mgmtGrpCd_option_data});	
		}
    	

    	if (flag == 'excelUpload') {
    		cflineHideProgressBody();
    		var data = response;
    		var msg = "";

        	$("#excelFile").val("");
        	$("#textFileNm").text("");
        	
        	// 기본정보 변경에 대한 TSDN 실시간 연동 호출
			if(nullToEmpty(response.succLineNoStr) != ""){
				console.log("=============" + response.succLineNoStr);
				// 기본정보 변경건
				sendToTsdnNetworkInfo(response.succLineNoStr, "T", "B");
			}
        	// 선번정보 변경에 대한 TSDN 실시간 연동 호출
			if(nullToEmpty(response.succPathLineNoStr) != ""){
				// 기본정보 변경건
				sendToTsdnNetworkInfo(response.succPathLineNoStr, "T", "E");
			}
			
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
//    		$a.close("Fail");
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
   
  
});