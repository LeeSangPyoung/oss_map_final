/**
 * TrunkExcelUploadPop
 *
 * @author P098910
 * @date 2016. 12. 07. 
 * @version 1.0
 */
$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
	var paramData = null;
    var resultCode = null;
    this.init = function(popId, popParam) {
    	if (! jQuery.isEmptyObject(popParam) ) {
    		paramData = popParam;
    	}
    	$("#lnoRadio").hide();
    	$("#btn_sample_down").hide();
    	$('#lnoChkYn').val("N"); 						//선번정보 체크박스값 = N
    	$('#lnoGubunVal').val("");						//선번정보 라디오버튼값 = S:구간선번, N:노드선번
        setEventListener();          
    };    
    
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
    	
    	
    	// 기본정보 체크박스 클릭
	    $('#trunkInfoChkYn').on('click', function(e) { 
	    	if ($("input:checkbox[id='trunkInfoChkYn']").is(":checked") ){
	    		$('#trunkInfoVal').val("Y");
	    	}else{
	    		$('#trunkInfoVal').val("N");
	    	}
	    }); 
    	
    	// 선번정보 체크 박스 클릭 
	    $('#trunkLnoVal').on('click', function(e) { 
	    	if ($("input:checkbox[id='trunkLnoVal']").is(":checked") ){
	    		$("#lnoRadio").show();
	    		$("#sectionLineNo").setSelected();
	    		$('#lnoChkYn').val("Y");
	    		$('#lnoGubunVal').val("S");
	    	}else{
	    		$("#lnoRadio").hide();
	    		$("#btn_sample_down").hide();
	    		$('#lnoChkYn').val("Y");
	    		$('#lnoGubunVal').val("");
	    	}
	    }); 
	    
	    //노드선번 라디오가 체크 됐을때
	    $('#nodeLineNo').on('click', function(e) { 
	    	if( ( $('#lnoChkYn').val() =="Y" ) &&  ($('#nodeLineNo').is(":checked") == true) ){
	    		$("#btn_sample_down").show();
	    		$('#lnoGubunVal').val("N");
	    	}
	    }); 
	    
	    //구간선번 라디오가 체크 됐을때
	    $('#sectionLineNo').on('click', function(e) { 
	    	if( ( $('#lnoChkYn').val() =="Y" ) && ($('#sectionLineNo').is(":checked") == true) ){
	    		$("#btn_sample_down").hide();
	    		$('#lnoGubunVal').val("S");
	    	}
	    }); 
		
	    
    	// 업로드 클릭    	
    	$('#btn_up_excel').on('click', function(e) {
    		
    		//정보타입체크
    		if ($('#trunkInfoChkYn').is(":checked") == false && $('#trunkLnoVal').is(":checked") == false) {
    			alertBox('W', cflineMsgArray['selectDemandPoolUpDataType']);/* 업로드할 정보타입을 선택해 주세요. */
    			$('#trunkInfoChkYn').focus();
    			return; 
    		}
    		
    		//파일체크
			if ($("#excelFile").val() == null || $("#excelFile").val() == "") {
				alertBox('W', cflineCommMsgArray['selectUploadFile']);/* 업로드할 파일을 선택해 주세요. */
				return;
			}
			
			//파일 확장자체크
			var fileExtensionChk = $("#excelFile").val().toLowerCase();
			if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
				alertBox('W', cflineCommMsgArray['checkExtensionTwoType']);/* 확장자가 xlsx 혹은 xls만 가능합니다. */
				return;
			}
			
			//컨펌 메시지
			var msg = cflineMsgArray['excel'];						/* 엑셀  */
			if($('#trunkInfoChkYn').is(":checked") == true){
				msg += " " + cflineMsgArray['baseInformation']; 					/* 기본정보  */
			}
			if( ( $('#lnoChkYn').val() =="Y" ) && ( $('#lnoGubunVal').val() == "S" ) ){
				msg += " " + cflineMsgArray['sectionLineNoInfo'];					/* 구간선번정보  */
			}
			if( ( $('#lnoChkYn').val() =="Y" ) &&  ( $('#lnoGubunVal').val() == "N" ) ){
				msg += " " + cflineMsgArray['nodeLineNoInfo']; 					/* 노드선번정보  */
			}
			callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg),function(msgId, msgRst){ //'기본정보을(를)업로드 하시겠습니까?'
        		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */	
    				var form = new FormData(document.getElementById('excelform'));
    				cflineShowProgressBody();
    				httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunkexcel/excelupload', form , 'post', 'excelUpload');
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

    	// 샘플파일 다운로드
    	$("#btn_sample_down").on('click', function(){
    		var $form=$('<form></form>');
    		$form.attr('name','downloadForm');
    		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/trunkexcel/exceldownload");
    		$form.attr('method','GET');
    		$form.attr('target','downloadIframe');
    		$form.append(Tango.getFormRemote());
    		$form.append('<input type="hidden" name="fileName" value="trunkExcelUploadSample.xlsx" /><input type="hidden" name="fileExtension" value="xlsx" />');
    		$form.append('<input type="hidden" name="type" value="excelSampleFile" />');
    		$form.appendTo('body');
    		$form.submit().remove();	
		});
    	
    	// 닫기버튼클릭
    	$('#btn_close').on('click', function(e) {
    		resultCode = "OK";
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
		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/trunkexcel/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="fileName" value="'+$("#fileName").val()+'" /><input type="hidden" name="fileExtension" value="'+$("#extensionName").val()+'" />');
		$form.append('<input type="hidden" name="type" value="' + gubunFile + '" />');
		$form.appendTo('body');
		$form.submit().remove();	
	}

	var acptNtwkLineNoCnt = 0;
	//초기 조회 성공시
    function successUploadCallback(response, flag){  	
    	if (flag == 'excelUpload') {
    		cflineHideProgressBody();
    		var data = response;
    		
    		// 선번정보 변경에 대한 GIS FDF 호출
    	  	if(nullToEmpty(response.fdfPathLineNoStr) != ""){
  				var fdfUsingInoPathLineNo = nullToEmpty(response.fdfPathLineNoStr);  				
  				
  				// 2018-08-13 엑셀업로드로 선번정보가 수정된건 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제
  				var acceptParam = {
  						 lineNoStr : fdfUsingInoPathLineNo
  					   , topoLclCd : "002"
  					   , linePathYn : "N"
  					   , editType : "E"   // 편집
  					   , excelDataYn : "Y"
  					   , excelFlag : "trunk"
  					   , data : response
  				}
  				extractAcceptNtwkLine(acceptParam); // 수집선번 처리 건수가 있는 경우 팝업 띄우기
  			} else {
  				//TODO 2019-07-11 업로드성공된 데이터가 0건인 경우 자동수집선번처리건수에 대한 파악이 필요없으므로 바로
  				//이 로직을 탐 
  				var msg = "";
  	 			if(data.resultCd == "NG") {
  					resultCode = "NG";
  					msg = cflineCommMsgArray['existFailUploadData'];  // 업로드에 실패한 데이터가 있습니다.  
  					if (data.errorCd == "DATA_CHECK_ERROR") {
  						msg += "<br>(";
  						if (nullToEmpty(data.excelOkCount) != ''  && data.excelOkCount !='0') {
  							resultCode = "OK";
  							msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
  						}
  						msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
  					}
  					if (data.errorCd == "UPLOAD_LIMIT_CNT"){
  						msg = cflineMsgArray['excelRowOver'];   //엑셀 업로드는 최대 1000건 까지만 가능합니다 
  					}
  					alertBox('W', msg);

  					$("#fileName").val(data.fileNames + "." + data.extensionNames);
  					$("#extensionName").val(data.extensionNames);
  	        	} else {        		
  	        		msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
  					msg += "<br>("+cflineCommMsgArray['success'] +" : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ")";
  					alertBox('I', msg);    //정상적으로 처리되었습니다. 
  					resultCode = "OK";
  				}
  			}
    	}		
    }
	 
    //request 실패시.
    function failUploadCallback(response, flag){
    	if (flag == 'excelUpload') {
    		cflineHideProgressBody();
    		$a.close("Fail");
    	}else{
    		$a.close("Fail");
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
    	}).done(function(response){
    		successUploadCallback(response, sflag);
    	  	
    	})
  	    .fail(function(response){failUploadCallback(response, sflag);})
    }
      
});