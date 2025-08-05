/**
 * OpenTaskLineExcelUploadPop.js
 *
 * @author P100700
 * @date 2017. 11. 07. 
 * @version 1.0
 */
var mgmtGrpCdVal = "";
$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
//	var paramData = null;
    var resultCode = null;
    var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터   
	
    this.init = function(popId, popParam) {
//    	setMgmtGrp (mgmtGrpCdVal);  // 관리 그룹 selectBox
//    	if (! jQuery.isEmptyObject(popParam) ) {
//    		paramData = popParam;
//    	}
    	setSelectCode();
        setEventListener();  
    	$("#lnoRadio").hide();
    	$("#btn_sample_down").hide();
    	$('#lnoChkYn').val("N");	
        
//        //RM선번적용 체크박스 제어        
//        $('#rnmLnoAplyYn').setEnabled(false);
//        $('#rnmLnoAplyYnInPop').val(""); 

    };    
    
    function setSelectCode() {
    	//서비스회선대분류, 소분류
    	httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getbmtsosclcdlist', null, 'GET', 'svlnSclBmtsoCodeData');
    }
    
    function setEventListener() { 
     	
    	// 서비스회선 대분류 선택 
    	$('#svlnSclCdPop').on('change', function(e){
    		$('#svlnInfoVal').setChecked(false);
    		$('#svlnSctnLnoVal').setChecked(false);
    		$("#lnoRadio").hide();
    		$('#lnoChkYn').val("N");
    		$('#lnoGubunVal').val("");
    		$("#btn_sample_down").hide();
      	});  


    	//선번정보 체크 박스 클릭
    	$('#svlnSctnLnoVal').on('click',function(e) { 
	    	if ($("input:checkbox[id='svlnSctnLnoVal']").is(":checked") ){
	    		$("#lnoRadio").show();
	    		$("#sectionLineNo").setSelected();
	    		$('#lnoChkYn').val("Y");
	    		$('#lnoGubunVal').val("S");
	    	}else{
	    		$("#lnoRadio").hide();
	    		$('#lnoChkYn').val("N");
	    		$('#lnoGubunVal').val("");
	    		$("#btn_sample_down").hide();
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
	    
	    //RM선번정보 라디오가 체크 됐을때
	    $('#rnmLnoAplyYn').on('click', function(e) { 
	    	if( ( $('#lnoChkYn').val() =="Y" ) && ($('#rnmLnoAplyYn').is(":checked") == true) ){
	    		$("#btn_sample_down").hide();
	    		$('#lnoGubunVal').val("R");
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
    		if ($('#svlnInfoVal').is(":checked") == false && $('#svlnSctnLnoVal').is(":checked") == false) {
    			alertBox('W', cflineMsgArray['selectDemandPoolUpDataType']);/* 업로드할 정보타입을 선택해 주세요. */
    			$('#svlnInfoVal').focus();
    			return; 
    		}        
    			
			if ($("#svlnSclCdPop").val() == null || $("#svlnSclCdPop").val() == "") {
				alertBox('W', makeArgCommonMsg("required", cflineMsgArray['serviceLineScl']));/* [{0}] 필수 입력 항목입니다. */
				return;
			}
//    		if ( $('#svlnSctnLnoVal').is(":checked") == true && ($("#tmofCdPop").val() == null || $("#tmofCdPop").val() == "")) {
//    			alertBox('W', makeArgCommonMsg("required", cflineMsgArray['transmissionOffice']));/* [{0}] 필수 입력 항목입니다. */
//    			$('#tmofCdPop').focus();
//    			return; 
//    		}        
    			
			if ($("#excelFile").val() == null || $("#excelFile").val() == "") {
				alertBox('W', cflineCommMsgArray['selectUploadFile']);/* 업로드할 파일을 선택해 주세요. */
				return;
			}
			var fileExtensionChk = $("#excelFile").val().toLowerCase();
			if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
				alertBox('W', cflineCommMsgArray['checkExtensionTwoType']);/* 확장자가 xlsx 혹은 xls만 가능합니다. */
				return;
			}		
//			$("#svlnLclCdInPop").val($("#svlnLclCdPop").val());
			$("#svlnSclCdInPop").val($("#svlnSclCdPop").val());
//			$("#tmofCdInPop").val($("#tmofCdPop").val());    	
			
			var msg = cflineMsgArray['excel'];						/* 엑셀  */
			if($('#svlnInfoVal').is(":checked") == true){
				$("#svlnInfoValInPop").val("Y"); 
				msg += " " + cflineMsgArray['baseInformation']; 					/* 기본정보  */
			}
			
			//선번정보별 구분 값에 따른 값과 메시지 셋팅
			if(  $('#lnoGubunVal').val() == "S" ){
				msg += " " + cflineMsgArray['sectionLineNoInfo'];					/* 구간선번정보  */
			}else if( $('#lnoGubunVal').val() == "N" ){
				msg += " " + cflineMsgArray['nodeLineNoInfo']; 					/* 노드선번정보  */
			}else if( $('#lnoGubunVal').val() == "R" ){
				msg += " " + cflineMsgArray['rnmLnoInformation']; 					/* RM선번정보  */
			}
	
			callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg),function(msgId, msgRst){ //'기본정보을(를)업로드 하시겠습니까?'
        		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */	
    				var form = new FormData(document.getElementById('excelform'));		
        		    //console.log(form);		
    				cflineShowProgressBody();
    				httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/excelupload'
        			           , form
        			           , 'post'
        			           , 'excelUpload');
				}
			});
    	
    	});
    	
    	// 노드선번 샘플 다운로드
    	$("#btn_sample_down").on('click', function(){
			getNodeLnoSampleFileDown(); 
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
	
	// 샘플 다운로드 처리 
	function getNodeLnoSampleFileDown(){
		var selectedCd = $("#svlnSclCdPop").val();
		var sampleFilename = "";
		if(selectedCd == null || selectedCd == ""){
			alertBox('W', makeArgCommonMsg("required", cflineMsgArray['serviceLineScl']));/* [{0}] 필수 입력 항목입니다. */
			return;
		} else if (selectedCd == "001"){ //교환기간
			sampleFilename = "taskExcelSample_exchangerPlace_new.xlsx";
		} else if (selectedCd == "002"){ //기지국간
			sampleFilename = "taskExcelSample_baseMtsoPlace_new.xlsx";
		} else if (selectedCd == "003"){ //상호접속간
			sampleFilename = "taskExcelSample_trdConnection_new.xlsx";
		}
		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="fileName" value="' + sampleFilename + '" /><input type="hidden" name="fileExtension" value="xlsx" />');
		$form.append('<input type="hidden" name="type" value="excelSampleFile" />');
		$form.appendTo('body');
		$form.submit().remove();	
	}
	
	//실패 파일 다운로드 처리
	function getExcelFileDown(gubunFile){
		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/exceldownload");
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
				if(response[k].value == '0002'){
					mgmtGrpCd_option_data.push(dataMgmtGrp);	
				}
			}		
			$('#mgmtGrpCdPop').clear();
			$('#mgmtGrpCdPop').setData({data : mgmtGrpCd_option_data});	
		}
    	
		// 서비스 회선에서 사용하는 대분류, 소분류, 회선유형 코드
		if(flag == 'svlnSclBmtsoCodeData') {	
			//console.log(response);
			
			var svlnSclCd_option_data =  [];
			for(k=0; k<response.sclCdList.length; k++){
				if(k==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['select']};
					svlnSclCd_option_data.push(dataFst);
				}
				var dataOption = response.sclCdList[k]; 
				svlnSclCd_option_data.push(dataOption);
			}		
			svlnSclCdPopData = svlnSclCd_option_data;	
			$('#svlnSclCdPop').clear();
			$('#svlnSclCdPop').setData({data : svlnSclCd_option_data});		
		} 

//		if(flag == 'tmofPopData') {			
//			$('#tmofCdPop').clear();
//			$('#tmofCdPop').setData({data : response.tmofCdList});
//		}		

    	if (flag == 'excelUpload') {
    		cflineHideProgressBody();
    		var data = response;
    		var msg = "";
        	$("#excelFile").val("");
        	$("#textFileNm").text("");
        	// 기본정보 변경에 대한 GIS FDF 호출
			if(nullToEmpty(response.fdfLineNoStr) != ""){
				var fdfUsingInoLineNo = nullToEmpty(response.fdfLineNoStr);
				sendFdfUseInfo("B", fdfUsingInoLineNo);
			}
        	// 선번정보 변경에 대한 GIS FDF 호출
			if(nullToEmpty(response.fdfPathLineNoStr) != ""){
				var fdfUsingInoPathLineNo = nullToEmpty(response.fdfPathLineNoStr);
				sendFdfUseInfo("E", fdfUsingInoPathLineNo);
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
   
  function changeSvlnSclCdPop(svlnLclId, svlnSclId, svlnSclCdData){
 	var svlnLclCd = $('#' + svlnLclId).val();
	// 전송실 select 처리
	var svlnSclCd_option_data =  [];
 	if(svlnLclCd != null && svlnLclCd != ""){
		for(m=0; m<svlnSclCdData.length; m++){
			var dataTmofCd = svlnSclCdData[m];  
			if(svlnLclCd == dataTmofCd.uprComCd){
				svlnSclCd_option_data.push(dataTmofCd);
			}
		}		
		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
 		
 	}else{
		$('#' + svlnSclId).setData({data : svlnSclCdData});
	}

  } 
  

	// FDF사용정보 전송(서비스회선/링편집시만 호출됨)
	function sendFdfUseInfo(flag, fdfUsingInoLineNo) {
	   	console.log("fdfUsingInoLineNo 0 : " +  fdfUsingInoLineNo);
	    var sendLineNo = fdfUsingInoLineNo;
	    var callBackFlag = "sendfdfuseinfo";
	    if(flag == "E"){
	    	callBackFlag = "sendfdfuseinfopath";
	    }
	   	var fdfParam = {
	   			 lineNoStr : sendLineNo
	   		   , fdfEditLneType : "S"
	   		   , fdfEditType : flag  // 복원, 해지, 기본정보변경, (구)NITS-> 광코어
	   	}
	   	//console.log(fdfParam);
	    	Tango.ajax({
	    		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendfdfuseinfo', //URL 기존 처럼 사용하시면 됩니다.
	    		data : fdfParam, //data가 존재할 경우 주입
	    		method : 'GET', //HTTP Method
	    		flag : callBackFlag
	    	}).done(function(response){successCallbackFdfToGis(response, callBackFlag, sendLineNo);})
	   	  .fail(function(response){failCallbackFdfToGis(response, callBackFlag, sendLineNo);});
	}
	 // FDF사용정보 전송용 성공CallBack함수
	 function successCallbackFdfToGis (response, flag, fdfUseLineNo) {
	   	if (flag == "sendfdfuseinfo") {
	   		console.log("sendfdfuseinfo successCallbackFdfToGis : " + fdfUseLineNo);
	   		console.log("successCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	   	if (flag == "sendfdfuseinfopath") {
	   		console.log("fdfUsingInoPathLineNo successCallbackFdfToGis : " + fdfUseLineNo);
	   		console.log("successCallbackFdfToGis Path : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	 }
	 //FDF사용정보 전송용 실패CallBack함수
	 function failCallbackFdfToGis (response, flag) {
	   	if (flag == "sendfdfuseinfo") {
	   		console.log("sendfdfuseinfo successCallbackFdfToGis : " + fdfUseLineNo);
	   		console.log("failCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	   	if (flag == "sendfdfuseinfopath") {
	   		console.log("fdfUsingInoPathLineNo successCallbackFdfToGis : " + fdfUseLineNo);
	   		console.log("failCallbackFdfToGis Path : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	 }   
});