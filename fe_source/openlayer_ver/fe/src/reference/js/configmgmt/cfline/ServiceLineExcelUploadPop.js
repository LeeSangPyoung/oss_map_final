/**
 * ServiceLineExcelUploadPop
 * 
 * @author P100700
 * @date 2016. 12. 07. 
 * @version 1.0
 */
var mgmtGrpCdVal = "";
var svlnLclSclCodeData = [];  // 서비스회선 대분류 소분류코드 
 
var returnMapping = [] // 회선정보 헤더
var infoMaxnumber = 0;
var svlnLclCd = "";
var svlnSclCd = "";
var cmCodeData =[];  // 서비스회선 공통코드
var pageForCount = 200;
var gridIdScrollBottom = true;

var gridId = 'dataGrid';
var tempKey = null;

var maxnumber = 0;

var jobInstanceId = "";

var cnt = 0;
var forCount = 0;
var endTimeFlag = 'N';
var pkTempKeyArr = [];
var play = null;
var times = 10000;

// 임시테이블에 있는 데이터 엑셀 업로드 처리
var excelUploadIdx = 0;
var excelUploadTotalCnt = 0;
var procCnt =10;
var procExcelUploadList = null;
var acptNtwkLineNoCnt = 0;   // 자동수집선번건
var msgHtml = [];

$a.page(function() {

	var d = new Date();
	var curr_hour = d.getHours();
	var curr_min = d.getMinutes();
	var curr_sec = d.getSeconds();
	var curr_msec = d.getMilliseconds();
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
	var paramData = null;
    var resultCode = null;
    var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터   
	
    this.init = function(popId, popParam) {
    	setMgmtGrp (mgmtGrpCdVal);  // 관리 그룹 selectBox
    	if (! jQuery.isEmptyObject(popParam) ) {
    		paramData = popParam;
    	}
    	setSelectCode();
        setEventListener();
//        getGrid();
        
        //노드선번, RM선번 적용 체크박스 제어 
        $('#nodeLineNo').setEnabled(false);
        $('#rnmLnoAplyYn').setEnabled(false);
        $('#rnmLnoAplyYnInPop').val("");
        $('#lnoRadio').hide();
		$('#btn_sample_down').hide();
		$('#lnoChkYn').val("N");
		$('#btn_up_DB').hide();
		$('#btn_fail_excel').hide();
		$('#btnExcelDown').hide();
		$('#btn_logout').hide();
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
    
    function setSelectCode() {
    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    	//서비스회선대분류, 소분류
    	httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', null, 'GET', 'svlnCommCodeData');
    	//전송실
    	searchUserJrdtTmofInfo("tmofCd");
//    	httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofPopData');
    }
    
   
    function setEventListener() { 
   	 	//x버튼으로 닫기
/*    	window.addEventListener("beforeunload", function(e) {
    		 var me = "close";
    		 (e || window.event).returnValue = me;
    		 tempDelete();
    		 return me;
    	});*/

    	// 서비스회선 대분류 선택 
    	$('#svlnLclCdPop').on('change', function(e){

     		//changeSvlnLclCd('svlnLclCd', 'svlnSclCd', svlnLclSclCodeData, "mgmtGrpCd", "N"); // 서비스회선소분류 selectbox 제어	
    		changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData); // 서비스회선소분류 selectbox 제어
    		var tmpSclCd = $('#svlnSclCdPop').val();

    		if(	$('#svlnLclCdPop').val() == '003' ){	//RU
    			$('#upLoadDiv').hide();
				$('#svlnInfoVal').setChecked(true);
				$('#svlnLnoValVal').setChecked(false);
				$('#lnoRadio').hide();
				$('#tmofCdDisplayCheckbox').hide();	//전송실
    		} else {
				$('#svlnInfoVal').setChecked(false);
				$('#svlnLnoValVal').setChecked(false);
				$('#lnoRadio').hide();
				$('#upLoadDiv').show();
    		}
    		var sktB2bCdStr = "006,007,008,019,022,023";   
    		if(	$('#svlnLclCdPop').val() == '001' ){  // 기지국 회선인 경우
    			$('#nodeLineNo').setEnabled(true);
    			$('#rnmLnoAplyYn').setEnabled(true);
    			
    			$('#'+gridId).show();
    			$('#btnExcelDown').show();
    			$('#btn_fail_excel').show();
				$('#tmofCdDisplayCheckbox').show();	//전송실
    		
			//기타회선의 경우에도 노드선번등록이 가능하도록 개선
			//2021-12-10 - 이상용M
    		} else if(	$('#svlnLclCdPop').val() == '006' ){  // 기타 회선인 경우
    			if($('#svlnSclCdPop').val() == '005' ) {	//기타인 경우
    				$('#nodeLineNo').setEnabled(true);
        			$('#rnmLnoAplyYn').setEnabled(true);
        			
        			$('#'+gridId).show();
        			$('#btnExcelDown').show();
        			$('#btn_fail_excel').show();
    				$('#tmofCdDisplayCheckbox').show();	//전송실
    			} else {
    				$('#nodeLineNo').setChecked(false);
        			$('#nodeLineNo').setEnabled(false);
        			$('#rnmLnoAplyYn').setChecked(false);
        			$('#rnmLnoAplyYn').setEnabled(false);
        	        $('#lnoRadio').hide();
        			$('#btn_sample_down').hide();
    				$('#tmofCdDisplayCheckbox').hide();	//전송실
        			
        			$('#'+gridId).hide();
        			$('#btnExcelDown').hide();
    			}
    		} else{
    			$('#nodeLineNo').setChecked(false);
    			$('#nodeLineNo').setEnabled(false);
    			$('#rnmLnoAplyYn').setChecked(false);
    			$('#rnmLnoAplyYn').setEnabled(false);
    	        $('#lnoRadio').hide();
    			$('#btn_sample_down').hide();
				$('#tmofCdDisplayCheckbox').hide();	//전송실
    			
    			$('#'+gridId).hide();
    			$('#btnExcelDown').hide();
    		}

    		//엑셀실패다운로드버튼, 엑셀다운로드 버튼제어
    		if(	$('#svlnLclCdPop').val() == '001'){
    			$('#btn_fail_excel').hide();
    			$('#btnExcelDown').show();
    		} else {
    			$('#btn_fail_excel').show();
    			$('#btnExcelDown').hide();
    		}
    		
    		svlnLclCd = $('#svlnLclCdPop').val();
    		
    		reSetGrid();
      	});
    	
    	// 서비스회선 소분류 선택 
    	$('#svlnSclCdPop').on('change', function(e){
    		if(	$('#svlnSclCdPop').val() == '016' || $('#svlnSclCdPop').val() == '101' || $('#svlnSclCdPop').val() == '030' 
    			|| $('#svlnSclCdPop').val() == '103' || $('#svlnSclCdPop').val() == '104' || $('#svlnSclCdPop').val() == '061' || $('#svlnSclCdPop').val() == '106'){
    			$('#upLoadDiv').hide();
				$('#svlnInfoVal').setChecked(true);
				$('#svlnLnoValVal').setChecked(false);
				$('#lnoRadio').hide();
    		} else {
    			$('#svlnInfoVal').setChecked(false);
    			$('#svlnLnoValVal').setChecked(false);
    			$('#lnoRadio').hide();
				$('#upLoadDiv').show();
    		}
    		
    		var sktB2bCdStr = "006,007,008,019,022,023";    
//    		console.log("svlnLclCdPop====" + $('#svlnLclCdPop').val());		    		
    		if(	$('#svlnLclCdPop').val() == '001' && $('#svlnSclCdPop').val() != "016" && $('#svlnSclCdPop').val() != "030" ){
    			// 기지국 회선중 LTE, IP전송로, 5G  제외(교환기간, 상호접속간, 기지국간(1X, 2G, WCDMA, Wibro, EV-DO)
    			if($('#svlnSclCdPop').val() == "020"){
    				$('#nodeLineNo').setEnabled(true);
        			$('#rnmLnoAplyYn').setChecked(false);
        			$('#rnmLnoAplyYn').setEnabled(false);

	    			$('#'+gridId).hide();
	    			$('#btnExcelDown').hide();
	    			$('#btn_fail_excel').show();
        			
    			}else{
        			$('#nodeLineNo').setEnabled(true);
        			$('#rnmLnoAplyYn').setEnabled(true);

	    			$('#'+gridId).show();
	    			$('#btnExcelDown').show();
	    			$('#btn_fail_excel').hide();	
    		    }
    		/*else if( sktB2bCdStr.indexOf($('#svlnSclCdPop').val()) >= 0 ){
    			// SKT B2B 회선의 경우 - 선번정보 체크박스 막음.
    			$('#rnmLnoAplyYn').setChecked(false);
    			$('#rnmLnoAplyYn').setEnabled(false);
    			$('#svlnSctnLnoVal').setChecked(false);
	    		$('#svlnSctnLnoVal').setEnabled(false);
	    		*/
    		}else if($('#svlnLclCdPop').val() == '006' && $('#svlnSclCdPop').val() == "005") {
    			$('#nodeLineNo').setEnabled(true);
    			$('#rnmLnoAplyYn').setEnabled(true);

    			$('#'+gridId).show();
    			$('#btnExcelDown').show();
    			$('#btn_fail_excel').hide();	
    			$('#tmofCdDisplayCheckbox').show();	//전송실  기타회선/기타 외 회선은 전송실 표시 안함 2023-10-30 개선
    		}else{
    			$('#nodeLineNo').setChecked(false);
    			$('#nodeLineNo').setEnabled(false);
    			$('#rnmLnoAplyYn').setChecked(false);
    			$('#rnmLnoAplyYn').setEnabled(false);
	    		$('#lnoRadio').hide();
				$('#tmofCdDisplayCheckbox').hide();	//전송실  기타회선/기타 외 회선은 전송실 표시 안함 2023-10-30 개선
    		}
			$('#btn_sample_down').hide();
			
			svlnSclCd = $('#svlnSclCdPop').val();

			reSetGrid();
      	});

	    // 파일 선택
	    $('#fileSelect').on('click', function(e) {    		
    		var exform  = document.getElementById('excelform');
    		//exform.reset();
    		
    		$('#excelFile').click();
			$('#btn_up_excel').show();
			$('#btn_up_DB').hide();
        });    

	    
	    //선번정보 체크 박스 클릭 
	    $('#svlnLnoValVal').on('click', function(e) { 
	    	if ($("input:checkbox[id='svlnLnoValVal']").is(":checked") ){
	    		$('#lnoRadio').show();
	    		$('#svlnSctnLnoVal').setSelected();
	    		$('#lnoChkYn').val("Y");
	    		$('#lnoGubunVal').val("S");
    			$('#'+gridId).hide();
    			$('#btn_fail_excel').show();
    			$('#btnExcelDown').hide();
	    	}else{
	    		$('#lnoRadio').hide();
	    		$('#btn_sample_down').hide();
	    		$('#lnoChkYn').val("N");
	    		$('#lnoGubunVal').val("");
				$('#tmofCdDisplayCheckbox').hide();	//전송실
	    	}
	    }); 
	    
	    //구간선번 라디오가 체크 됐을때
	    $('#svlnSctnLnoVal').on('click', function(e) { 
	    	if( ( $('#lnoChkYn').val() =="Y" ) &&  ($('#svlnSctnLnoVal').is(":checked") == true) ){
	    		$("#btn_sample_down").hide();
	    		$('#lnoGubunVal').val("S");
    			$('#'+gridId).hide();
    			$('#btn_fail_excel').show();
    			$('#btnExcelDown').hide();
				$('#tmofCdDisplayCheckbox').hide();	//전송실
    			reSetGrid();
	    	}

	    }); 
	    
	    //노드선번 라디오가 체크 됐을때
	    $('#nodeLineNo').on('click', function(e) { 
	    	if( ( $('#lnoChkYn').val() =="Y" ) &&  ($('#nodeLineNo').is(":checked") == true) ){
	    		$("#btn_sample_down").show();
	    		$('#lnoGubunVal').val("N");
    			$('#'+gridId).show();
    			$('#btn_fail_excel').hide();
    			$('#btnExcelDown').show();

				$('#tmofCdDisplayCheckbox').show();	//전송실
    			reSetGrid();
	    	}
	    }); 
	    
	    //RM선번 라디오가 체크 됐을때
	    $('#rnmLnoAplyYn').on('click', function(e) { 
	    	if( ( $('#lnoChkYn').val() =="Y" ) &&  ($('#rnmLnoAplyYn').is(":checked") == true) ){
	    		$("#btn_sample_down").hide();
	    		$('#lnoGubunVal').val("R");
    			$('#'+gridId).hide();
				$('#tmofCdDisplayCheckbox').hide();	//전송실
    			reSetGrid();
	    	}
	    }); 
	    
	    // RM선번정보 체크 박스 클릭 
	    /*$('#rnmLnoAplyYn').on('click', function(e) { 
	    	if ($("input:checkbox[id='rnmLnoAplyYn']").is(":checked") ){
	    		$('#svlnSctnLnoVal').setEnabled(false);
				$('#svlnSctnLnoVal').setChecked(false);
	    	}else{
	    		$('#svlnSctnLnoVal').setEnabled(true);
	    	}
        });   */
	    
	    
    	$('#excelFile').on('change', function(e) {  
    		$("#textFileNm").text(this.value);
    	});
    	
    	    	
    	// 업로드 클릭    	
    	$('#btn_up_excel').on('click', function(e) {

			$("#svlnLclCdInPop").val(svlnLclCd);
			
    		if ($('#svlnInfoVal').is(":checked") == false && $('#svlnLnoValVal').is(":checked") == false) {
    			alertBox('W', cflineMsgArray['selectDemandPoolUpDataType']);/* 업로드할 정보타입을 선택해 주세요. */
    			$('#svlnInfoVal').focus();
    			return; 
    		}        
    			
			if ($("#svlnLclCdPop").val() == null || $("#svlnLclCdPop").val() == "") {
				alertBox('W', makeArgCommonMsg("required", cflineMsgArray['serviceLineLcl'])); /* [{0}] 필수 입력 항목입니다. */
				return;
			}

    		if(	$('#svlnLclCdPop').val() != '001'){	//기지국회선은 전체로 업로드 가능함
				if ($("#svlnSclCdPop").val() == null || $("#svlnSclCdPop").val() == "") {
					alertBox('W', makeArgCommonMsg("required", cflineMsgArray['serviceLineScl'])); /* [{0}] 필수 입력 항목입니다. */
					return;
				}
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
			$("#svlnLclCdInPop").val($("#svlnLclCdPop").val());
			$("#svlnSclCdInPop").val($("#svlnSclCdPop").val());


			var msg = cflineMsgArray['excel'];						/* 엑셀  */
			if($('#svlnInfoVal').is(":checked") == true){
				msg += " " + cflineMsgArray['baseInformation']; 					/* 기본정보  */
				$("#svlnInfoValInPop").val("Y"); 
			}
			
			//선번정보별 구분 값에 따른 값과 메시지 셋팅
			if(  $('#lnoGubunVal').val() == "S" ){
				msg += " " + cflineMsgArray['sectionLineNoInfo'];					/* 구간선번정보  */
			}else if( $('#lnoGubunVal').val() == "N" ){
				msg += " " + cflineMsgArray['nodeLineNoInfo']; 					/* 노드선번정보  */
			}else if( $('#lnoGubunVal').val() == "R" ){
				msg += " " + cflineMsgArray['rnmLnoInformation']; 					/* RM선번정보  */
			}
			
			if(tempKey == null){
				tempKey = guid();	//엑셀업로드 임시키
			}
			$("#tmpKey").val(tempKey);
			
			callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg),function(msgId, msgRst){ //'기본정보을(를)업로드 하시겠습니까?'
        		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */	
    				var form = new FormData(document.getElementById('excelform'));	
    				form.tmpKey = tempKey;
    				cflineShowProgressBody();

    				//기지국 회선 이면서  IP전송로방식이 아닌 경우 엑셀데이터를 table에 적재후 사용하는 방안으로 고려 - 2019-08-14
    				//기타회선중 기타 인 경우도 table에 적재후 사용하는 방안으로 개선 - 2021-12-10
    				if(($("#svlnLclCdInPop").val() == '001' && $('#lnoGubunVal').val() == "N" && $("#svlnSclCdInPop").val() != '020')
    					|| ($("#svlnLclCdInPop").val() == '006' && $('#lnoGubunVal').val() == "N" && $("#svlnSclCdInPop").val() == '005')) { 
    					httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/exceltempupload'
        			           , form
        			           , 'post'
        			           , 'exceltempupload');
    				} else {
    					httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/excelupload'
	        			           , form
	        			           , 'post'
	        			           , 'excelupload');
    				}
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
    		if(tempKey != null) {
    			tempDelete();
    		} else {
    			resultCode = "OK";
        		if($("#fileName").val() == "" || $("#extensionName").val() == "") {
            		$a.close(resultCode);
        		} else {
        			getExcelFileDown("excelUploadFailFile");
    	    		$a.close(resultCode);
        		}
    		}
    	});
    	
    	// 에러파일 다운로드
    	$("#btnExcelDown").on('click', function(){
    		var svlnLclCdval = $('#svlnLclCdPop').val();
    		var list = AlopexGrid.trimData( $("#"+gridId).alopexGrid( "dataGet", {} ) );
    		
        	if ( list.length < 1 ) {
        		alertBox('W',cflineCommMsgArray['noInquiryData']);
        		return false;
        	}
        	
        	if(ngCount == 0) {
        		alertBox('W', "DB등록 후 실패한 데이터만 다운로드가 가능합니다.");
        		return false;
        	}
        	
    		if(svlnLclCdval != "001")					return true;
    		
    		var dataParam = $('#excelform').getData();
			
    		dataParam = gridExcelColumn(dataParam, gridId);
    		dataParam.fileExtension = "xlsx";
    		dataParam.tmpKey = $('#tmpKey').val();
    		dataParam.svlnSclCd = $('#svlnSclCdPop').val();
    		dataParam.svlnLclCd = $('#svlnLclCdPop').val();
    		
    		cflineShowProgressBody();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/excelTempBatchExecute', dataParam, 'POST', 'excelTempBatchExecute');
		});   

    	// DB업로드 클릭    	
    	$('#btn_up_DB').on('click', function(e) {
			
			$("#lineNmPop").val("");
			endTimeFlag = "N";

		    fdfUsingInoLineNo = "";
		    fdfUsingInoPathLineNo = "";
		    okCount = 0;
		    ngCount = 0;
			
			$("#svlnLclCdInPop").val($("#svlnLclCdPop").val());
			$("#svlnSclCdInPop").val($("#svlnSclCdPop").val());
			$("#lnoGubunVal").val($("#lnoGubunVal").val());

    		var msg = cflineMsgArray['excel'];						/* 엑셀  */
			if($('#svlnInfoVal').is(":checked") == true){
				msg += " " + cflineMsgArray['baseInformation']; 					/* 기본정보  */
				$("#svlnInfoValInPop").val("Y"); 
			}
			
			//선번정보별 구분 값에 따른 값과 메시지 셋팅
			if(  $('#lnoGubunVal').val() == "S" ){
				msg += " " + cflineMsgArray['sectionLineNoInfo'];					/* 구간선번정보  */
			}else if( $('#lnoGubunVal').val() == "N" ){
				msg += " " + cflineMsgArray['nodeLineNoInfo']; 					/* 노드선번정보  */
			}else if( $('#lnoGubunVal').val() == "R" ){
				msg += " " + cflineMsgArray['rnmLnoInformation']; 					/* RM선번정보  */
			}
			
		   	procExcelUploadList = $('#'+gridId).alopexGrid('dataGet');
		   	
			var maxLineNumber = 30;
			
			excelUploadIdx = 0;
			excelUploadTotalCnt = procExcelUploadList.length;
			acptNtwkLineNoCnt = 0;
			
			if (excelUploadTotalCnt > 0) {
				callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg),function(msgId, msgRst){ //'기본정보을(를)업로드 하시겠습니까?'
					if (msgRst == 'Y') {     // 업로드 하시겠습니까? 	
						//cflineShowProgressBody();
						// 임시테이블에 있는 데이터 엑셀업로드
						tmpDataExcelUpload();
	        		}
	    		});
			}
    	});
    }
    
    function tmpDataExcelUpload() {
    	
    	//********************
		//**프로그레스 다이아 로그
		//*******************//
		if (excelUploadIdx >= excelUploadTotalCnt) {
			$('#dialogMsg').close().remove();
			return ;
		}
		
		if (excelUploadIdx == 0) {

    		msgHtml = [];
     		if($('#dialogMsg').length != 0){
     			$('#dialogMsg').remove();
     		}
     		
			msgHtml.push("		<div class='Dialog-contents color_black' style='word-wrap:break-word;'>");
			msgHtml.push(" <br><center>************  엑셀 업로드 중입니다  **************");
			msgHtml.push(" <br><br>");
    		msgHtml.push("<span id='currentIdx'></span> / " + excelUploadTotalCnt + "</center>");
    		msgHtml.push("<br><br>");
    		msgHtml.push(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push("성공 :  <b><span id='okCount'></span></b>");
    		msgHtml.push("<br>");
    		msgHtml.push(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push("실패 :  <color='red'><span id='ngCount'></span></color>");
    		msgHtml.push("      </div>");
    		//msgHtml.push("  </div>");

    		//$("#"+btnId).after(msgHtml.join(""));
    		var msgDiv = document.createElement("div");
    		msgDiv.setAttribute("id","dialogMsg");
    		msgDiv.setAttribute("class","Dialog");
    		document.body.appendChild(msgDiv);
    		msgDiv.innerHTML = msgHtml.join("");

    		$a.convert($("#dialogMsg"));
    		
    		 $('#dialogMsg').open({
    			    title: "엑셀 업로드",
    			    width: "400",
    			    height: "220",
    			    type : "blank",
    			    resizable: false,
    			    toggle: false,
    			    movable: true,
    			    modal: true,
    			    animation: "show", //fade, slide
    			    xButtonClickCallback : function(el){ // x버튼 처리
    			    	//$(".btnMsg").last().trigger('click');
    			    }
    			    //animationtime: 200
    			  });
		}
		
		$('#currentIdx').html(excelUploadIdx);
		$('#okCount').html(okCount);
		$('#ngCount').html(ngCount);
		
		
		if (excelUploadIdx < excelUploadTotalCnt) {
			var tmpPkKeyList = [];
			
			for (var i = excelUploadIdx; i< excelUploadTotalCnt; i++ ) {
				if (i > (excelUploadIdx+procCnt-1)) {
					break;
				}
				tmpPkKeyList.push(procExcelUploadList[i].tmpKey);
			}
			$("#pkTempKey").val(tmpPkKeyList);
		}

		if(excelUploadTotalCnt < 10) {
			var tmpPkKeyList = [];
			
			for (var i = 0; i< excelUploadTotalCnt; i++ ) {
				tmpPkKeyList.push(procExcelUploadList[i].tmpKey);
			}
			$("#pkTempKey").val(tmpPkKeyList);
		}
		
    	var form = new FormData(document.getElementById('excelform'));	
		form.tmpKey = tempKey;
		form.pkTempKeyList = $("#pkTempKey").val();
		//console.log("pkTempKeyList: " + form.pkTempKeyList);
		form.countFlag = "NO";
		
		httpExcelUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/dbtempupload'
		           , form
		           , 'post'
		           , 'dbtempupload'
		           , forCount);
		

		excelUploadIdx += procCnt;
    }
	
    var httpExcelUploadRequest = function(surl, sdata, smethod, sflag, scount ) {
    	Tango.ajax({
    		url : surl, //URL 기존 처럼 사용하시면 됩니다.
    		data : sdata, //data가 존재할 경우 주입
    		method : smethod, //HTTP Method
	    	dataType:'json',
            processData:false,
            cache:false,
            contentType:false
    	}).done(function(response){
    		successExcelUploadCallback(response, sflag, scount);
    	}).fail(function(response){
    		failUploadCallback(response, sflag);
    	})
    } 	

    var fdfUsingInoLineNo = "";
    var fdfUsingInoPathLineNo = "";
    var okCount = 0;
    var ngCount = 0;
 
	//초기 조회 성공시
    function successExcelUploadCallback(response, flag, count){  	
    	if(flag == 'ngdataselect') {
			cflineHideProgressBody();
    		var dbUploadResult = false;
			var data = response;
    		var msg = "";
    		
			/*msg = cflineCommMsgArray['existFailUploadData'];  //업로드에 실패한 데이터가 있습니다. 
			msg += "<br>(";
			if (nullToEmpty(data.uploadSuccCnt) != ''  && data.uploadSuccCnt !='0') {
				//resultCode = "OK";
				msg += cflineCommMsgArray['success'] + " : " + data.uploadSuccCnt + cflineCommMsgArray['singleCount'] + ", "
			}
			msg += cflineCommMsgArray['failure'] + " : " + data.uploadFailCnt + cflineCommMsgArray['singleCount'] + ")"; 
			
			alertBox('W', msg);*/
			
    		getGrid($('#svlnLclCdPop').val(), $('#svlnSclCdPop').val(), response, gridId);
    		setSPGrid(gridId, response.uploadFailList, response.uploadFailList.length);
    	}
    	
    	if(flag == 'dbtempupload') {
    		//cflineHideProgressBody();
    		var dbUploadResult = false;
			var data = response;
    		var msg = "";
    		//console.log("data.Result : " + data.Result);
    		
    		// GIS FDF call 
    		if(excelUploadIdx >= 0 && data.Result == "Success") {
    			fdfUsingInoLineNo = "";
    			fdfUsingInoPathLineNo = "";
    			if(nullToEmpty(response.fdfLineNoStr) != ""){
    				var fdfUsingInoLineNoStr = nullToEmpty(response.fdfLineNoStr);
    				if(fdfUsingInoLineNo == "") {
    					fdfUsingInoLineNo = fdfUsingInoLineNoStr;
    				} else {
    					fdfUsingInoLineNo += ",";
    					fdfUsingInoLineNo += fdfUsingInoLineNoStr;
    				}
    				//console.log("fdfUsingInoLineNo=======> " +fdfUsingInoLineNo);
    			}
    			
    			if(nullToEmpty(response.fdfPathLineNoStr) != ""){
    				var fdfUsingInoPathLineNoStr = nullToEmpty(response.fdfPathLineNoStr);
    				if(fdfUsingInoPathLineNo == "") {
    					fdfUsingInoPathLineNo = fdfUsingInoPathLineNoStr;
    				} else {
    					fdfUsingInoPathLineNo += ",";
    					fdfUsingInoPathLineNo += fdfUsingInoPathLineNoStr;
    				}
    				
    				//console.log("fdfUsingInoPathLineNo=======> " +fdfUsingInoPathLineNo);
    			} 

        		var okCnt = data.excelOkCount;
        		okCount += okCnt;
				//console.log("total okCount=======> " +okCount);
        		var ngCnt = data.excelNgCount;
        		ngCount += ngCnt;
				//console.log("total ngCount=======> " +ngCount);
				
				// GIS에 FDF는 바로 전달
				if (fdfUsingInoLineNo != "") {

					sendFdfUseInfoCommon(fdfUsingInoLineNo, "S", "E", null);
				}
				if (fdfUsingInoPathLineNo != "") {

					sendFdfUseInfoCommon(fdfUsingInoPathLineNo, "S", "E", null);
				}
    		}
    		
    		// 마지막이 아니면 
    		// 현재처리건수가 총 건수보다 적으면 계속 호출
    		if (excelUploadIdx < excelUploadTotalCnt) {
        		$('#btn_logout').trigger("click");
    			tmpDataExcelUpload();

				// 엑셀 처리후 바로바로 처리 하도록 수정
				if (fdfUsingInoPathLineNo != "" || fdfUsingInoLineNo != "") {
					var acceptParam = {
							 lineNoStr : (fdfUsingInoPathLineNo != "" ? fdfUsingInoPathLineNo : fdfUsingInoLineNo)
						   , topoLclCd : ""
						   , linePathYn : "Y"
						   , editType : "E"   // 편집
						   , excelDataYn : "Y"
		  				   , excelFlag : "e1service"
		  				   , ngCount : ngCount
		  				   , okCount : okCount
		  				   , data : null
		  				   , onlyMainOk : "Y"
					}		
		    				
					Tango.ajax({
						url : 'tango-transmission-biz/transmisson/configmgmt/cfline/networkpathautoproc/extractacceptntwkline', 
						data : acceptParam, //data가 존재할 경우 주입
						method : 'GET', //HTTP Method
						flag : 'extractacceptntwkline'
					}).done(function(response){
								//console.log(response);
								if (nullToEmpty(response.result) == "SUCCESS") {								
										// 수집선번 처리 건수가 있는 경우 팝업 띄우기
									acptNtwkLineNoCnt += response.acptNtwkLineNoCnt;
														
								} else {
									//console.log(response);
								}
							})
					  .fail(function(response){
								cflineHideProgressBody();
					   });
				}
    			return;
    		}
    		
    		// 마지막이면
    		endTimeFlag = 'Y';
    		if($('#dialogMsg').length != 0){
    			$('#dialogMsg').close().remove();
    			cflineShowProgressBody();
     		}

    		//cflineHideProgressBody();
			
    		//if(ngCount > 0) {
    			var form = new FormData(document.getElementById('excelform'));	
    			form.tmpKey = tempKey;
    			
    			httpExcelUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/ngdataselect'
 			           , form
 			           , 'post'
 			           , 'ngdataselect'
 			           , 0);
    		//}
    		
    		// 마지막건에 대해 성공한 서비스회선이 있으면
    		if (fdfUsingInoPathLineNo != "" || fdfUsingInoLineNo != "") {
    		
	    		var acceptParam = {
						 lineNoStr :  (fdfUsingInoPathLineNo != "" ? fdfUsingInoPathLineNo : fdfUsingInoLineNo)
					   , topoLclCd : ""
					   , linePathYn : "Y"
					   , editType : "E"   // 편집
					   , excelDataYn : "Y"
	 				   , excelFlag : "e1service"
	 				   , ngCount : ngCount
	 				   , okCount : okCount
	 				   , data : null
	 				   , onlyMainOk : "Y"
				}		
	   				
				Tango.ajax({
					url : 'tango-transmission-biz/transmisson/configmgmt/cfline/networkpathautoproc/extractacceptntwkline', 
					data : acceptParam, //data가 존재할 경우 주입
					method : 'GET', //HTTP Method
					flag : 'extractacceptntwkline'
				}).done(function(response){
							//console.log(response);
							if (nullToEmpty(response.result) == "SUCCESS") {		
								acptNtwkLineNoCnt += response.acptNtwkLineNoCnt;
								cflineHideProgressBody();
								response.acptNtwkLineNoCnt = acptNtwkLineNoCnt;
								
								var data = {
										 'Result' : (ngCount > 0 ? "Error" : "Success")
									   , 'excelOkCount' : okCount
									   , 'excelNgCount' : ngCount
								}
								acceptParam.data = data;
								//console.log("acceptParam>>>>> " + acceptParam);						
								// 수집선번 처리 건수가 있는 경우 팝업 띄우기
								showAutoProcTarget(response, acceptParam);	
							} else {
								//`.log(response);
							}
						})
				  .fail(function(response){
							cflineHideProgressBody();
				   });
    		} else {
    			// 없으면 결과 팝업
    			cflineHideProgressBody();
    			var acceptParam = {
						 lineNoStr :  (fdfUsingInoPathLineNo != "" ? fdfUsingInoPathLineNo : fdfUsingInoLineNo)
					   , topoLclCd : ""
					   , linePathYn : "Y"
					   , editType : "E"   // 편집
					   , excelDataYn : "Y"
	 				   , excelFlag : "e1service"
	 				   , ngCount : ngCount
	 				   , okCount : okCount
	 				   , data : null
	 				   , onlyMainOk : "Y"
				}	
    			
				var finResult = "Error";
				if(ngCount == 0 && okCount == 0) {
					finResult = "Error";
				} else if(ngCount > 0) {
					finResult = "Error";
				} else {
					finResult = "Success";
				}
				
				var data = {
						 'Result' : finResult
					   , 'excelOkCount' : okCount
					   , 'excelNgCount' : ngCount
				}
				acceptParam.data = data;
    			var response = {
    					  'excelDataYn' : "Y"
    					, 'acptNtwkLineNoCnt ' : acptNtwkLineNoCnt
    					, 'result' : "SUCCESS"
    			}
				//console.log("acceptParam>>>>> " + data);
				showAutoProcTarget(response, acceptParam);	
    		}
		
    		$('#btn_up_excel').show();
    		$('#btn_up_DB').hide();
    		
			return;
		}
    }
    
	function tempDelete(){

		if(tempKey != null) {
			var form = new FormData(document.getElementById('excelform'));	
			form.tmpKey = tempKey;
			cflineShowProgressBody();
			
			httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/tempdelete'
			           , form
			           , 'post'
			           , 'tempdelete');

		}
	}
	
	//임시키 발번
	function guid(){
		function s4(){
			return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
	function leadingZeros(n, digits){
		var zero = "";
		n = n.toString();
		
		if(n.length < digits) {
			for(i=0; i < digits - n.length; i++) {
				zero +='0';
			}
			return zero + n;
		}
	}
	
	// 샘플 다운로드 처리 
	function getNodeLnoSampleFileDown(){
		var selectedCd = $("#svlnSclCdPop").val();
		var sampleFilename = "";
		if (selectedCd == "001"){ //교환기간
			sampleFilename = "serviceLineExcelSample_exchangerPlace_new.xlsx";
		} else if (selectedCd == "003"){ //상호접속간
			sampleFilename = "serviceLineExcelSample_trdConnection_new.xlsx"; 
		} else if(selectedCd == "020"){
			sampleFilename = "serviceLineExcelSample_wcdmaIpnb_new.xlsx"; 
		} else if(selectedCd == "005"){	//기타회선>기타
			sampleFilename = "serviceLineExcelSample_etcInfo_new.xlsx"; 
		}else { //기지국간, 모바일회선
			if(selectedCd == "") {
				sampleFilename = "serviceLineExcelSample_All_new.xlsx";
			} else {
				sampleFilename = "serviceLineExcelSample_baseMtsoPlace_new.xlsx";
			}
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
		if(flag == 'svlnLclSclCodeData') {	
//			console.log(response);
			svlnLclSclCodeData = response;
			
			var svlnSclCd_option_data =  [];
			for(k=0; k<response.svlnSclCdList.length; k++){
				if(k==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
					svlnSclCd_option_data.push(dataFst);
				}
				var dataOption = response.svlnSclCdList[k]; 

//				if( nullToEmpty(dataOption.cdFltrgVal) != "SKT" &&  ( nullToEmpty(dataOption.uprComCd) == "005" || 
//						( nullToEmpty(dataOption.uprComCd) == "006" && nullToEmpty(dataOption.value) == "005" )) ){
				// (LTE, IP전송로(WCDMA), WIFI, RU(CMS수집), WRU, (구)NITS회선  제외 )	
//                &&  !"016".equals(super.getDefaultString(serviceLineSrchVO.getSvlnSclCd(),"")) 
//                && !"020".equals(super.getDefaultString(serviceLineSrchVO.getSvlnLclCd(),"")) 
//                && !"102".equals(super.getDefaultString(serviceLineSrchVO.getSvlnLclCd(),"")) 
//                && !"103".equals(super.getDefaultString(serviceLineSrchVO.getSvlnLclCd(),"")) 
//                && !"104".equals(super.getDefaultString(serviceLineSrchVO.getSvlnLclCd(),"")) 
//                && !"105".equals(super.getDefaultString(serviceLineSrchVO.getSvlnLclCd(),""))){
				if( nullToEmpty(dataOption.value) != "016" && nullToEmpty(dataOption.value) != "030"
						 && nullToEmpty(dataOption.value) != "102" && nullToEmpty(dataOption.value) != "103"
							 && nullToEmpty(dataOption.value) != "104" && nullToEmpty(dataOption.value) != "105"){
					svlnSclCd_option_data.push(dataOption);
				}	
			}		
			svlnSclCdPopData = svlnSclCd_option_data;	
			$('#svlnSclCdPop').clear();
			$('#svlnSclCdPop').setData({data : svlnSclCd_option_data});		
			

			var svlnLclCd_option_data =  [];
			for(i=0; i<response.svlnLclCdList.length; i++){
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['select']};
					svlnLclCd_option_data.push(dataFst);
				}
				var dataL = response.svlnLclCdList[i]; 
				var chk = "N";
				for(var j=0; j<svlnSclCdPopData.length;j++){
					if( nullToEmpty(dataL.value) == nullToEmpty(svlnSclCdPopData[j].uprComCd)){
						chk = "Y";
						break;
					}
				}

				if( chk == "Y" ){
					svlnLclCd_option_data.push(dataL);
				}
			}
			$('#svlnLclCdPop').clear();
			$('#svlnLclCdPop').setData({data : svlnLclCd_option_data});			
			
			
			reSetGrid();
		} 

    	if(flag == 'tempdelete'){
    		var data = response;
    		var msg = "";
    		
    		if(data) {
		    	$a.close("OK");
    		} else {
    			alertBox('W', "임시테이블을 삭제하지못했습니다. 담당자에게 연락주세요.");
		    	$a.close("OK");
    		}
    	}	

		if (flag == 'exceltempupload') {
			cflineHideProgressBody();

			var data = response;
    		var msg = "";
			
    		if(data.resultCd == "NG") {
				resultCode = "NG";
				if (data.errorCd == "UPLOAD_LIMIT_CNT"){
					msg = cflineMsgArray['excelRowOver']; /* 엑셀 업로드는 최대 1000건 까지만 가능합니다 */
				}
				if (data.errorCd == "LINE_NM_CNT"){
					msg = '회선명이 입력되지 않은 데이터가 있습니다. 확인하고 다시 등록해주세요.'; /* 회선명이 입력되지 않은 데이터가 있습니다. 확인하고 다시 등록해주세요. */
				}
				
				alertBox('W', msg);

				$("#fileName").val(data.fileNames + "." + data.extensionNames);
				$("#extensionName").val(data.extensionNames);
				return false;
        	} else {
        		//엑셀파일 업로드가 완료되면 버튼이 활성화 된다.
        		msg = '엑셀파일을 임시테이블에 적재하였습니다.<br> 최종 업로드를 진행하시려면 DB등록 버튼을 다시 클릭해주세요.'; 
				alertBox('I', msg);   /* 정상적으로 처리되었습니다. */
				resultCode = "OK";
				
				//정상등록된 경우에만 그리드 표시
				getGrid($('#svlnLclCdPop').val(), $('#svlnSclCdPop').val(), response, gridId);
	    		setSPGrid(gridId, response.ServiceLineList, response.ServiceLineList.length);
        		$('#btn_up_excel').hide();
        		$('#btn_up_DB').show();
			}
		}
				
    	if (flag == 'excelupload') {
    		cflineHideProgressBody();
    		var data = response;
    		var msg = "";

        	$("#excelFile").val("");
        	$("#textFileNm").text("");
        	// 기본정보 변경에 대한 GIS FDF 호출
			if(nullToEmpty(response.fdfLineNoStr) != ""){
				var fdfUsingInoLineNo = nullToEmpty(response.fdfLineNoStr);
				sendFdfUseInfoCommon(fdfUsingInoLineNo, "S", "B", null);
			}
        	// 선번정보 변경에 대한 GIS FDF 호출
			if(nullToEmpty(response.fdfPathLineNoStr) != ""){
				var fdfUsingInoPathLineNo = nullToEmpty(response.fdfPathLineNoStr);
				//console.log("fdfUsingInoPathLineNo::"+fdfUsingInoPathLineNo);
				sendFdfUseInfoCommon(fdfUsingInoPathLineNo, "S", "E", null);
				
				if(nullToEmpty(fdfUsingInoPathLineNo) != "") {
					/* 2018-08-13 엑셀업로드로 선번정보가 수정된건 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
					var acceptParam = {
							 lineNoStr : fdfUsingInoPathLineNo
						   , topoLclCd : ""
						   , linePathYn : "Y"
						   , editType : "E"   // 편집
						   , excelDataYn : "Y"
		  				   , excelFlag : "service"
		  				   , data : response
					}
					//extractAcceptNtwkLine(acceptParam);
					Tango.ajax({
						url : 'tango-transmission-biz/transmisson/configmgmt/cfline/networkpathautoproc/extractacceptntwkline', 
						data : acceptParam, //data가 존재할 경우 주입
						method : 'GET', //HTTP Method
						flag : 'extractacceptntwkline'
					}).done(function(response){
								//console.log(response);
								if (nullToEmpty(response.result) == "SUCCESS") {		
									cflineHideProgressBody();		
									// 수집선번 처리 건수가 있는 경우 팝업 띄우기
									showAutoProcTarget(response, acceptParam);	
								} else {
									//console.log(response);
								}
					}).fail(function(response){
								cflineHideProgressBody();
					});
				}
			} else {
				
				//2019-07-11 업로드성공된 데이터가 0건인 경우 자동수집선번처리건수에 대한 파악이 필요없으므로 바로
				if(nullToEmpty(response.fdfLineNoStr) == "" ||  nullToEmpty(response.fdfPathLineNoStr) == ""){
		        	if(data.resultCd == "NG") {
						resultCode = "NG";
						msg = cflineCommMsgArray['existFailUploadData'];  //업로드에 실패한 데이터가 있습니다. 
						if (data.errorCd == "DATA_CHECK_ERROR") {
							msg += "<br>(";
							if (nullToEmpty(data.excelOkCount) != ''  && data.excelOkCount !='0') {
								resultCode = "OK";
								msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
							}
							msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
						}
						if (data.errorCd == "UPLOAD_LIMIT_CNT"){
							msg = cflineMsgArray['excelRowOver'];  //엑셀 업로드는 최대 1000건 까지만 가능합니다 
						}
						alertBox('W', msg);
		
						$("#fileName").val(data.fileNames + "." + data.extensionNames);
						$("#extensionName").val(data.extensionNames);
						return false;
		        	} else {
		        		msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
						msg += "<br>("+cflineCommMsgArray['success'] +" : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ")";
						alertBox('I', msg);    //정상적으로 처리되었습니다. 
						resultCode = "OK";
					}
				}
			}
    	}	
    }
    
    //request 실패시.
    function failUploadCallback(response, flag){
    	if (flag == 'excelupload') {
    		cflineHideProgressBody();
        	$("#excelFile").val("");
    		if(response.message != null && response.message != '') {
    			alertBox('I', response.message);
    		}
    	} else if (flag == 'exceltempupload') {
    		cflineHideProgressBody();
        	$("#excelFile").val("");
    		if(response.message != null && response.message != '') {
    			alertBox('I', response.message);
    		}
    	} else if (flag == 'dbtempupload') {
    		if($('#dialogMsg').length != 0){
    			$('#dialogMsg').close().remove();
     		}
    		cflineHideProgressBody();
        	$("#excelFile").val("");
    		if(response.message != null && response.message != '') {
    			alertBox('I', response.message);
    		}
    	} else if (flag == 'tempdelete') {
    		cflineHideProgressBody();
        	$("#excelFile").val("");
    		alertBox('W', "임시테이블을 삭제하지못했습니다. 담당자에게 연락주세요.");
    	} else {
//    		$a.close("Fail");
    		cflineHideProgressBody();
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

	// FDF사용정보 전송(서비스회선/링편집시만 호출됨)
	function sendFdfUseInfo(flag, fdfUsingInoLineNo) {
//	   	console.log("fdfUsingInoLineNo 0 : " +  fdfUsingInoLineNo);
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
//	   		console.log("sendfdfuseinfo successCallbackFdfToGis : " + fdfUseLineNo);
//	   		console.log("successCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	   	if (flag == "sendfdfuseinfopath") {
//	   		console.log("fdfUsingInoPathLineNo successCallbackFdfToGis : " + fdfUseLineNo);
//	   		console.log("successCallbackFdfToGis Path : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	 }
	 //FDF사용정보 전송용 실패CallBack함수
	 function failCallbackFdfToGis (response, flag) {
	   	if (flag == "sendfdfuseinfo") {
//	   		console.log("sendfdfuseinfo successCallbackFdfToGis : " + fdfUseLineNo);
//	   		console.log("failCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	   	if (flag == "sendfdfuseinfopath") {
//	   		console.log("fdfUsingInoPathLineNo successCallbackFdfToGis : " + fdfUseLineNo);
//	   		console.log("failCallbackFdfToGis Path : " + JSON.stringify(response.fdfUseInfoList));
	   	}
	 }
	 
	 function makeHeader (data, flag){ // flag 값에따라 작업정보인지 아닌지 구분
	    	var mapping = '';
	    	maxnumber = 0;
	    	var number = 0;
	    	
	    	for(var i=0; i<data.length; i++){
				var serviceLineList = data[i].serviceLineList;
				
					if(serviceLineList != null && serviceLineList.length  > 0 ){
						for(var j=0; j<serviceLineList.length; j++){
							var k = j +1 ; 
							// 
							data[i]["useRingNtwkLineNm#"+j] = serviceLineList[j].ringNm;
							data[i]["useTrkNtwkLineNm#"+j] = serviceLineList[j].trkNm;
							data[i]["eqpNm#"+j] = serviceLineList[j].eqpNm;
    						data[i]["lPortNm#"+j] = serviceLineList[j].lftAPort;
    						data[i]["rPortNm#"+j] = serviceLineList[j].rghtBport;	
						}

						number  = serviceLineList.length;
					}
					if (flag == 'info'){
						if (infoMaxnumber < number){
							infoMaxnumber = number;
						}
			    	}
	    	}
	    	if (flag == 'info'){
	    		mapping = returnMapping;
	    		maxnumber = infoMaxnumber;
	    	}
	    	
	    	// 2019-02-19 기지국회선(001) - WCDMA(IPNB) 추가
	    	if( svlnSclCd =='020' ){
	        	for(var j=0; j < maxnumber; j++){
	        		var k = j +1 ; 
	        		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
	        		mapping.push({ key:'eqpNm#'+j		 , title:cflineMsgArray['eqpNm']+'#'+k	    	,align:'left', width: '200px' });
	        		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['aport']+'#'+k	    	,align:'left', width: '200px' });
	        		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['bport'] +'#'+k	    	,align:'left', width: '200px' });

	        	}
	    	}
	    	else {
	        	for(var j=0; j < maxnumber; j++){
	        		var k = j +1 ; 
	        		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
	        		mapping.push({ key:'useTrkNtwkLineNm#'+j    ,title:cflineMsgArray['trunk']+'#'+k     ,align:'left', width: '200px' });
	        		mapping.push({ key:'eqpNm#'+j		 , title:cflineMsgArray['eqpNmXls']+'#'+k	    	,align:'left', width: '200px' });
	        		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['aport']+'#'+k	    	,align:'left', width: '200px' });
	        		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['bport'] +'#'+k	    	,align:'left', width: '200px' });
	        	}
	    	}
	    	return data;
	 }
	 
  
	 var getGrid = function(svlnLclCd, svlnSclCd, response, gridDiv) {
		 
		 	// 기타회선포함
		 	if(svlnLclCd !="001" && svlnLclCd !="006")	 return null;
		 	if(svlnLclCd == "001" && svlnSclCd == "020") return null;
	    	//선번정보 표시유무
	    	var pathAll = true;
	    	/*
	    		svlnLclCd
	    		000 :	미지정 
	    		001 :	기지국회선
	    		003 :	RU회선
	    		004 :	가입자망회선
	    		006 :	기타회선	
	    	*/
	    	var resultCd;
    		var errCd = true;
	    	if (pathAll == true && response != undefined){
	    		resultCd = response.Result;
		    	if(resultCd=='Error') {
		    		errCd = false;
		    	}
	    	}
	    	
	    	// 교환기간
    		if(svlnSclCd == "001"){
    			returnMapping = mapping001('info', false, errCd);
    		// 상호접속간
    		}else if(svlnSclCd == "003"){
    			returnMapping = mapping003('info', false, errCd);
    		}else if(svlnSclCd == "020") { //WCDMA(IPNB) - 표시없음
				returnMapping = mapping020('info', errCd);
    		}else if(svlnSclCd == "005") { //기타회선-기타
				returnMapping = mapping006('info', false, errCd);
    		}else{
    			if(svlnSclCd != ""){	//전체외 서비스소분류
    				returnMapping = mapping002('info', false, errCd);
    			} else {
    				returnMapping = mappingAll('info', false, errCd);
    			}
			}
	    	
	    	//선번정보 추가
	    	if (pathAll == true && response != undefined){
	    		
	    		if(gridDiv == gridId){
	    			if(resultCd=='Success') {
	    				response.ServiceLineList = makeHeader(response.ServiceLineList, 'info');
	    			} else {
	    				response.ServiceLineList = makeHeader(response.uploadFailList, 'info');
	    			}
	    			
	    		}
	    	}
	    	
	    	if(gridDiv == gridId){ //기본정보일때
	    		 $('#'+gridId).alopexGrid({
		            autoColumnIndex : true,
		    		autoResize: true,
		    		cellSelectable : false,
		    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
		            rowClickSelect : true,
		            rowSingleSelect : false,
		            numberingColumnFromZero : false,
		    		defaultColumnMapping:{sorting: false},
		    		enableDefaultContextMenu:false,
		    		enableContextMenu:true,
		    		contextMenu : [
		    		               {
		    		            	    title: cflineMsgArray['workConvert'], /*"작업전환"*/
		    						    processor: function(data, $cell, grid) {
		    						    	workCnvt();
		    						    },
		    						    use: function(data, $cell, grid) {
		    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnWorkMgmtYn) == "Y"  //작업권한이있는지 확인
		    						    			&& nullToEmpty(selectedData[i].svlnStatCd) != "008"		//해지된회선인지 확인
		    						    			&& nullToEmpty(selectedData[i].svlnStatCd) != "300"){ //해지요청중인 회선인지 확인
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	if(trueCount>0){
		    						    		returnValue = true;
		    						    	}
		    						    	return returnValue;
		    						    }
		    					   },
		    					   /*
		    					    * 서비스회선상세정보
		    					    
		    					   {
		    		            	    title: cflineMsgArray['serviceLineDetailInfo'],
		    						    processor: function(data, $cell, grid) {
		    						    	var rowIndex = data._index.row;
		    						    	var dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
		    						    	
		    						    	showServiceLIneInfoPop( gridId, dataObj, "N");
		    						    }
		    					   },
		    					   */
		    		               {
		    		            	    title: cflineCommMsgArray['restoration'], /*"복원"*/
		    						    processor: function(data, $cell, grid) {
		    						    	lineRestoration();
		    						    },
		    						    use: function(data, $cell, grid) {
		    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) == "008" 
		    						    				&& (nullToEmpty(selectedData[i].svlnSclCd) != "016" 
		    						    					&& nullToEmpty(selectedData[i].svlnSclCd) != "030"  //5G	    						    					
		    						    					&& nullToEmpty(selectedData[i].svlnSclCd) != "103") ){
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	if(trueCount>0){
		    						    		returnValue = true;
		    						    	}
		    						    	return returnValue;
		    						    }
		    					   },
		    		               {
		    		            	    title: cflineMsgArray['svlnLclSclChange'], /*"RU-광코어로 이동"*/
		    						    processor: function(data, $cell, grid) {
		    						    	updateLclScl();
		    						    },
		    						    use: function(data, $cell, grid) {
		    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnSclCd) == "105"
		    						    			&& nullToEmpty(selectedData[i].svlnStatCd) != "300" ){	//해지요청중회선이 아닐경우
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	if(trueCount>0){
		    						    		returnValue = true;
		    						    	}
		    						    	return returnValue;
		    						    }
		    					   }
		    					  ,
		    					   {
		    						   	// RU광코어 고도화 : 대표회선번호 설정
		    		            	    title: cflineMsgArray['representaionLineSet'],	/* 대표회선 설정 */
		    						    processor: function(data, $cell, grid) {
		    						    	setRepresentationLine(data);
		    						    },
		    						    use: function(data, $cell, grid) {
		    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( ( nullToEmpty(selectedData[i].svlnLclCd) == "003" && nullToEmpty(selectedData[i].svlnSclCd) == "101" )
		    						    				&& nullToEmpty(selectedData[i].svlnStatCd) != "008" 
		    						    				&& nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지와 해지요청중이 아니고 RU 광코어 일 때만
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = true;
		    						    	}
		    						    	
		    						    	return returnValue;
		    						    }
		    					   }
		    		               ],
		    		message: {
		    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
		    		},
		    		columnMapping : returnMapping,
		    		tree : { useTree:useTreeYn(svlnLclCd, svlnSclCd), idKey:'treeNo', parentIdKey : 'treePrntNo', expandedKey : 'treeDivVal'},
		    		rowSelectOption: {
		    			groupSelect: false
		    		},
		    		rowOption:{inlineStyle: function(data,rowOption){
		    				if(data['svlnWorkYn'] == 'Y') return {color:'red'} // background:'orange',
		    			}
			    		, allowSelect: function(data){
			    			if( data.treePrntNo){
			    				if (data.svlnNo == data.treePrntNo ) {
			    					return false;
			    				} else {
				    				return true;
			    				}
		    				} else {
		    					return true;
		    				}
		    			}
		    		}
		    	});
			}
	    } 
	 
	 	$('#'+gridId).on('scrollBottom', function(e){
	 		
	 		return true;
	 		
	 		var nFirstRowIndex =parseInt($("#firstRow01").val()) + pageForCount; // 페이징개수
	 		var nLastRowIndex =parseInt($("#lastRow01").val()) + pageForCount; // 페이징개수
	 		$("#firstRow01").val(nFirstRowIndex);
	 		$("#lastRow01").val(nLastRowIndex);  
	 		$("#firstRowIndex").val(nFirstRowIndex);
	 		$("#lastRowIndex").val(nLastRowIndex);  
	 		
	 		var prm = {
    				"svlnLclCd" : $('#svlnLclCdPop').val(),
    				"svlnSclCd" : $('#svlnSclCdPop').val(),
    				"workDivCd" : "N",
    				"firstRow01" : $("#firstRow01").val(),
    				"lastRow01" : $("#lastRow01").val(),
    				"firstRowIndex" : $("#firstRowIndex").val(),
    				"lastRowIndex" : $("#lastRowIndex").val(),
    				"pathAll" : "Y"
    		};
	
	     	if(gridIdScrollBottom){
	         	cflineShowProgress(gridId);
	     		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelist', prm, 'GET', 'searchForPageAdd');
	     	}
	 	});   
	 
	//그리드 재셋팅
	    function reSetGrid(){
	    	svlnLclCd = $('#svlnLclCdPop').val();
	    	svlnSclCd = $('#svlnSclCdPop').val();
	    	//그리드 재설정후 데이터 비우고 건수 0으로 변경
			$('#'+gridId).alopexGrid("dataEmpty");
	    	getGrid(svlnLclCd, svlnSclCd, undefined, gridId);
			$('#'+gridId).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + 0;
					}}}
			);
			
			$('#btn_up_excel').show();
			$('#btn_up_DB').hide();
        	$("#excelFile").val("");
        	$("#textFileNm").text("");
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
	    
	    function successCallback(response, status, jqxhr, flag){
	    	if(flag == 'searchAllInfo'){
	    		getGrid($('#svlnLclCdPop').val(), $('#svlnSclCdPop').val(), response, gridId);
	    		cflineHideProgressBody();
	    		/*if(response.totalCnt > 0 ){
	    	    	$('#totalCntSpan').text("(" + getNumberFormatDis(response.totalCnt) + ")");
	    			$('#btnExportExcel').setEnabled(true);
	    		}else{
	    			$('#totalCntSpan').text("");
	    			$('#btnExportExcel').setEnabled(false);
	    		} 	*/
	    		setSPGrid(gridId, response.ServiceLineList, response.totalCnt);
	    	}
	    	// 서비스 회선에서 사용하는 코드
			if(flag == 'svlnCommCodeData') {
				
				var tmpCmCodeData =  JSON.parse(JSON.stringify(response));

				var dataFst = {"value":"","text":cflineCommMsgArray['select']};
//				var dataMandatory = {"value":"","text":cflineCommMsgArray['mandatory']};
				var option_data =  [];
				option_data = tmpCmCodeData.svlnStatCdList;
				option_data.unshift(dataFst);

//				cmCodeData = {"svlnStatCdList":option_data};  // 서비스회선상태
				$.extend(cmCodeData,{"svlnStatCdList":option_data});		 // 서비스회선상태
				option_data =  [];
				option_data = tmpCmCodeData.lineUsePerdTypCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"lineUsePerdTypCdList":option_data});		 // 회선사용기간유형	
				option_data =  [];
				option_data = tmpCmCodeData.svlnCapaCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"svlnCapaCdList":option_data});		 // 회선용량	
				option_data =  [];
				option_data = tmpCmCodeData.ynList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"ynList":option_data});		 // 예,아니오
				option_data =  [];
				option_data = tmpCmCodeData.lineDistTypCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"lineDistTypCdList":option_data});		 // 회선거리유형
				option_data =  [];
				option_data = tmpCmCodeData.lineSctnTypCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"lineSctnTypCdList":option_data});		 // 회선구간유형
				option_data =  [];
				option_data = tmpCmCodeData.chrStatCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"chrStatCdList":option_data});		 // 과금상태
				
				/*회선관리그룹 SKT SKB 나눔*/
				option_data =  [];
				option_data = tmpCmCodeData.lineMgmtGrCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"lineMgmtGrCdList":option_data});		 // 회선관리등급
				var skt_LineMgmtGrCd = [] ;
				var skb_LineMgmtGrCd = [] ;
				var skt_LineMgmtGrCdSearch = [] ;
				var skb_LineMgmtGrCdSearch = [] ;
				for(var i=1; i<tmpCmCodeData.lineMgmtGrCdList.length; i++){
					if(tmpCmCodeData.lineMgmtGrCdList[i].cdFltrgVal == "ALL" ||tmpCmCodeData.lineMgmtGrCdList[i].cdFltrgVal == "SKT"){
						skt_LineMgmtGrCd.push(tmpCmCodeData.lineMgmtGrCdList[i]);
						skt_LineMgmtGrCdSearch.push(tmpCmCodeData.lineMgmtGrCdList[i]);
					}
					skb_LineMgmtGrCd.push(tmpCmCodeData.lineMgmtGrCdList[i]);
					skb_LineMgmtGrCdSearch.push(tmpCmCodeData.lineMgmtGrCdList[i]);
				}
				
				$.extend(response,{"lineMgmtGrCdListSKT":skt_LineMgmtGrCdSearch});
				$.extend(response,{"lineMgmtGrCdListSKB":skb_LineMgmtGrCdSearch});
				skt_LineMgmtGrCd.unshift(dataFst);
				skb_LineMgmtGrCd.unshift(dataFst);
				$.extend(cmCodeData,{"lineMgmtGrCdListSKT":skt_LineMgmtGrCd});
				$.extend(cmCodeData,{"lineMgmtGrCdListSKB":skb_LineMgmtGrCd});
				
				option_data =  [];
				option_data = tmpCmCodeData.ogicCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"ogicCdList":option_data});		 // OG/IC
				

				option_data =  [];
				option_data = tmpCmCodeData.lesTypeCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"lesTypeCdList":option_data});		 // 임차유형
				option_data =  [];
				option_data = tmpCmCodeData.svlnB2bCapaCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"svlnB2bCapaCdList":option_data});		 // B2B 서비스회선 용량
				option_data =  [];
				option_data = tmpCmCodeData.llcfCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"llcfCdList":option_data});		 // 국사LLCF
				option_data =  [];
				option_data = tmpCmCodeData.negoCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"negoCdList":option_data});		 // 국사NEGO
				option_data =  [];
				option_data = tmpCmCodeData.mgmtPostCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"mgmtPostCdList":option_data});		 // 관리포스트
				option_data =  [];
				option_data = tmpCmCodeData.cdngMeansTypCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"cdngMeansTypCdList":option_data});		 // 코딩방식유형
				option_data =  [];
				option_data = tmpCmCodeData.coLineCostVrfRsnCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"coLineCostVrfRsnCdList":option_data});		 // 비대상사유
				
				// 20181228 RU회선_광코어 망구성방식코드 추가
				option_data =  [];
				option_data = tmpCmCodeData.netCfgMeansCdList;
				option_data.unshift(dataFst);			
				$.extend(cmCodeData,{"netCfgMeansCdList":option_data});		 // 망구성방식코드
			} 
			
			if(flag == 'searchForPageAdd'){
	    		cflineHideProgress(gridId);
				if(response.ServiceLineList.length == 0){
					gridIdScrollBottom = false;
					return false;
				}else{
	        		getGrid(svlnLclCd, svlnSclCd, response, gridId);
		    		$('#'+gridId).alopexGrid("dataAdd", response.ServiceLineList);
		    		
		    		var scrollOffset = {column : 0};
	    			$('#'+gridId).alopexGrid('setScroll', scrollOffset);
				}
	    	}
			
			if (flag == 'excelTempBatchExecute') {
				cflineHideProgressBody();
				
				if(response.returnCode == '200'){ 
	    			jobInstanceId  = response.resultData.jobInstanceId;
	    			//$('#excelFileId').val(response.resultData.jobInstanceId );
	    			excelCreatePop(jobInstanceId);
	    		}
	    		else if(response.returnCode == '500'){ 
	    	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
	    		}
			}
	    }
	    
	    function failCallback(response, status, flag){
	    	if(flag == 'searchAllInfo'){
	    		cflineHideProgressBody();
	    		//alert('조회 실패하였습니다.');
	    		alertBox('W', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	    	}
	    	
	    	if (flag == 'excelTempBatchExecute') {
	    		cflineHideProgressBody();
	    		
	    		if(response.message != null && response.message != '') {
	    			alertBox('I', response.message);
	    		}
	    	}
	    }
	    
	    var useTreeYn = function(svlnLclCd, svlnSclCd){
	    	if(svlnLclCd != "003" && svlnSclCd != "016" && svlnSclCd != "030" && svlnSclCd != "020"){
	        	return false;
	    	}else{
	    		return true;
	    	}
	    }
	    
	    function setSPGrid(GridID , Data, totalCnt) {
			$('#'+GridID).alopexGrid("dataSet", Data);
			$('#'+GridID).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(totalCnt);
						}
					}}
			); 
		}
	    
	    //기지국 회선 전체
		var mappingAll = function(gridDiv, showAppltNoYn, showErrCttYn){
		  	var emClass = '';
		  	if (gridDiv =='info'){
		  		emClass = '';
		  	}else{
		  		emClass = '<em class="color_red">*</em> ' ;
		  	}
		  	var returnData =  [
		  	    {key : 'xlsSeq'	            ,title : '순번' /*  순번 */                 ,align:'center'  , width: '45px'}
		  		, {key : 'tmpKey'	            ,title : 'tmpKey' /* tmpKey*/                 ,align:'center'  , width: '205px', hidden: true}
		  		, {key : 'errCtt'	              	,title : emClass + '에러내용' /*  에러내용 */                 ,align:'left'  , width: '300px', hidden: showErrCttYn,
		  			inlineStyle: {color: 'red'}
		  		}
		  		, {key : 'workDivVal'	              	,title : '작업구분' /*  작업구분 */                 ,align:'center'  , width: '70px'}
		  		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}
		  		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '140px'}
		  		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '140px'}
		  		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'center'  , width: '140px'}
		  		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
		  		/* 통신사업자 항목 추가 2021-11-16 */
		  		, {key : 'lnkgBizrCdNm'	              	,title : cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */                 ,align:'left'  , width: '160px'}
		  		, {key : 'lineUsePerdTypCdNm'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px'}
		  		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		  		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		  		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		  		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		  		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '80px'}
		  		/* TIE1, TIE2 항목 추가 2021-11-16 */
		  		//TODO
		  		, {key : 'ogTieOne'	      		,title : "OG_TIE1"         		,align:'center', width: '80px', editable: true}
		  		, {key : 'ogTieTwo'	      		,title : "OG_TIE2"         		,align:'center', width: '80px', editable: true}
		  		, {key : 'icTieOne'	      		,title : "IC_TIE1"         		,align:'center', width: '80px', editable: true}
		  		, {key : 'icTieTwo'	      		,title : "IC_TIE2"         		,align:'center', width: '80px', editable: true}
		  		, {key : 'tieOne'	      		,title : "TIE1"         		,align:'center', width: '80px', editable: true}
		  		, {key : 'tieTwo'	      		,title : "TIE2"         		,align:'center', width: '80px', editable: true}
		  		////////////////////////////////
		  		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
		  		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px'}
		  		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
		  		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px'}
		  		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px'}
		  		, {key : 'faltMgmtObjYnNm'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px'}
		  		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
		  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
		  		}
		  		, {key : 'lastChgDt'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		  		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		  		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
		  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }}	
		  		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		  		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		  		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		  		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		  		, {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '110px'}
		  		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
		  		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
		  		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
		  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
		  		}
		  		, {key : 'lineDistTypCdNm'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px'}
		  		, {key : 'lineSctnTypCdNm'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px'}
		  		, {key : 'chrStatCdNm'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px'}
		  		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
		  		, {key : 'trmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
		  		, {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '130px'}
		  		, {key : 'lineMgmtGrCdNm'	        ,title : emClass + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px'}
				, {key : 'rtLnoCtt'	            ,title : cflineMsgArray['rtLnoContent'] /*RT선번내용1*/				,align:'center', width: '200px'}
		  		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px'}
		  		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px'}
		  		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px'}
		  	 	, {key : 'srsLineYnNm'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px'}
		  		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		  	]; 
		  	return returnData;
		  }  

	  //기지국 회선 교환기간
	  var mapping001 = function(gridDiv, showAppltNoYn, showErrCttYn){
	  	var emClass = '';
	  	if (gridDiv =='info'){
	  		emClass = '';
	  	}else{
	  		emClass = '<em class="color_red">*</em> ';
	  	}
	  	var returnData = [
	  	     {key : 'xlsSeq'	            ,title : '순번' /*  순번 */                 ,align:'center'  , width: '45px'}
	  		, {key : 'tmpKey'	            ,title : 'pkTempKey' /* tmpKey*/                 ,align:'center'  , width: '55px', hidden: true}
	  		, {key : 'errCtt'	              	,title : emClass + '에러내용' /*  에러내용 */                 ,align:'left'  , width: '300px', hidden: showErrCttYn,
	  			inlineStyle: {color: 'red'}
	  		}
	  		, {key : 'workDivVal'	              	,title : '작업구분' /*  작업구분 */                 ,align:'center'  , width: '70px'}
	  		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: true}
	  		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
	  		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px'}
	  		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
	  		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
	  		, {key : 'lineUsePerdTypCdNm'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px'}
	  		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
	  		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
	  		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px'}
	  		, {key : 'ogMscId'	      		,title : "OG_MSC_ID"        		,align:'center', width: '100px'}
	  		, {key : 'ogMp'	      		,title : "OG_MP"          		,align:'center', width: '80px'}
	  		, {key : 'ogPp'	      		,title : "OG_PP"          		,align:'center', width: '80px'}
	  		, {key : 'ogCard'	      		,title : "OG_CARD"         		,align:'center', width: '80px'}
	  		, {key : 'ogLink'	      		,title : "OG_LINK"         		,align:'center', width: '80px'}
	  		, {key : 'ogTieOne'	      		,title : "OG_TIE1"         		,align:'center', width: '80px', editable: true}
	  		, {key : 'ogTieTwo'	      		,title : "OG_TIE2"         		,align:'center', width: '80px', editable: true}
	  		, {key : 'icMscId'	      		,title : "IC_MSC_ID"         		,align:'center', width: '100px'}
	  		, {key : 'icMp'	      		,title : "IC_MP"         		,align:'center', width: '80px'}
	  		, {key : 'icPp'	      		,title : "IC_PP"         		,align:'center', width: '80px'}
	  		, {key : 'icCard'	      		,title : "IC_CARD"         		,align:'center', width: '80px'}
	  		, {key : 'icLink'	      		,title : "IC_LINK"         		,align:'center', width: '80px'}
	  		, {key : 'icTieOne'	      		,title : "IC_TIE1"         		,align:'center', width: '80px', editable: true}
	  		, {key : 'icTieTwo'	      		,title : "IC_TIE2"         		,align:'center', width: '80px', editable: true}
	  		, {key : 'tieMatchYn'	      	,title : cflineMsgArray['tieAccord'] /*  TIE일치 */          ,align:'center', width: '110px'}
	  		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
	  		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px', editable: true}
	  		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
	  		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px', editable: true}
	  		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px', editable: true}
	  		, {key : 'faltMgmtObjYnNm'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px'}
	  		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }}
	  		, {key : 'lastChgDt'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
	  		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
	  		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }}	
	  		, {key : 'ogicCd'	        ,title : 'OG/IC'			,align:'center', width: '110px'}
	  		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
	  		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
	  		, {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '110px'}
	  		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
	  		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
	  		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
	  		}	
	  		, {key : 'lineDistTypCdNm'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px'}
	  		, {key : 'lineSctnTypCdNm'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px'}
	  		, {key : 'chrStatCdNm'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px'}
	  		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
	  		, {key : 'trmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
	  		, {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '130px'}
	  		, {key : 'lineMgmtGrCdNm'	        ,title : emClass + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px'}
			, {key : 'rtLnoCtt'	            ,title : cflineMsgArray['rtLnoContent'] /*RT선번내용1*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px'}
	  		, {key : 'srsLineYnNm'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px'}
	  		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	  	];
	  	return returnData;
	  }


	  //기지국 회선 기지국간
	  var mapping002 = function(gridDiv, showAppltNoYn, showErrCttYn){
	  	var emClass = '';
	  	if (gridDiv =='info'){
	  		emClass = '';
	  	}else{
	  		emClass = '<em class="color_red">*</em> ' ;
	  	}
	  	var returnData =  [
	  	    {key : 'xlsSeq'	            ,title : '순번' /*  순번 */                 ,align:'center'  , width: '45px'}
	  		, {key : 'tmpKey'	            ,title : 'tmpKey' /* tmpKey*/                 ,align:'center'  , width: '205px', hidden: true}
	  		, {key : 'errCtt'	              	,title : emClass + '에러내용' /*  에러내용 */                 ,align:'left'  , width: '300px', hidden: showErrCttYn,
	  			inlineStyle: {color: 'red'}
	  		}
	  		, {key : 'workDivVal'	              	,title : '작업구분' /*  작업구분 */                 ,align:'center'  , width: '70px'}
	  		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}
	  		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '140px'}
	  		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '140px'}
	  		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'center'  , width: '140px'}
	  		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
	  		, {key : 'lineUsePerdTypCdNm'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px'}
	  		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
	  		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
	  		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '80px'}
	  		, {key : 'mscId'	      		,title : "MSC_ID"          		,align:'center', width: '80px'}
	  		, {key : 'bscId'	      		,title : "BSC_ID"          		,align:'center', width: '80px'}
	  		, {key : 'btsCd'	      		,title : "BTS"          		,align:'center', width: '80px'}
	  		, {key : 'cinu'	      		,title : "CINU(M)"          		,align:'center', width: '80px'}
	  		, {key : 'aep'	      		,title : "AEP(M)"          		,align:'center', width: '80px'}
	  		, {key : 'portNo'	      		,title : "PORT_NO"          		,align:'center', width: '80px'}
	  		, {key : 'bip'	      		,title : "BIP"          		,align:'center', width: '80px'}
	  		, {key : 'bipP'	      		,title : "BIP_P"          		,align:'center', width: '80px'}
	  		, {key : 'btsId'	      		,title : "BTS_ID"          		,align:'center', width: '80px'}
	  		, {key : 'cuid'	      		,title : "CUID"          		,align:'center', width: '80px'}
	  		, {key : 'btsNm'	      		,title : cflineMsgArray['mtsoNameMid']+"(M)" /*기지국명*/          		,align:'center', width: '80px'}
	  		, {key : 'ima'	      		,title : "IMA"          		,align:'center', width: '80px'}
	  		, {key : 'status'	      		,title : cflineMsgArray['status'] /*상태*/         		,align:'center', width: '80px'}
	  		, {key : 'slPath'	      		,title : "SL_PATH"          		,align:'center', width: '80px'}
	  		, {key : 'onmPath'	      		,title : "ONM_PATH"          		,align:'center', width: '80px'}
	  		, {key : 'eqpNm'	      		,title : cflineMsgArray['btsName']+"(CMS)" /*기지국사*/         		,align:'center', width: '80px'}
	  		, {key : 'cmsId'	            ,title : cflineMsgArray['cmsId']			,align:'center', width: '80px'}
	  		, {key : 'exchrId'	            ,title : "CMS_MSC_ID"			,align:'center', width: '100px'}
	  		, {key : 'cmsBscId'	            ,title : "CMS_BSC_ID"			,align:'center', width: '100px'}
	  		, {key : 'cmsBtsId'	            ,title : "CMS_BTS_ID"			,align:'center', width: '100px'}
	  		, {key : 'tieOne'	            ,title : "TIE1"			,align:'center', width: '80px'}
	  		, {key : 'tieTwo'	            ,title : "TIE2"			,align:'center', width: '80px'}
	  		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
	  		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
	  		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px'}
	  		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
	  		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px'}
	  		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px'}
	  		, {key : 'faltMgmtObjYnNm'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px'}
	  		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
	  		}
	  		, {key : 'lastChgDt'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
	  		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
	  		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }}	
	  		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
	  		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
	  		, {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '110px'}
	  		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
	  		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
	  		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
	  		}
	  		, {key : 'lineDistTypCdNm'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px'}
	  		, {key : 'lineSctnTypCdNm'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px'}
	  		, {key : 'chrStatCdNm'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px'}
	  		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
	  		, {key : 'trmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
	  		, {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '130px'}
	  		, {key : 'lineMgmtGrCdNm'	        ,title : emClass + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px'}
			, {key : 'rtLnoCtt'	            ,title : cflineMsgArray['rtLnoContent'] /*RT선번내용1*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px'}
	  	 	, {key : 'srsLineYnNm'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px'}
	  		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	  	]; 
	  	return returnData;
	  }

	  //기지국 회선 상호접속간
	  var mapping003 = function(gridDiv, showAppltNoYn, showErrCttYn){
	  	var emClass = '';
	  	if (gridDiv =='info'){
	  		emClass = '';
	  	}else{
	  		emClass = '<em class="color_red">*</em> ' ;
	  	}
	  	var returnData = [ 
	  	    {key : 'xlsSeq'	            ,title : '순번' /*  순번 */                 ,align:'center'  , width: '45px'}
	  		, {key : 'tmpKey'	            ,title : 'tmpKey' /* tmpKey*/                 ,align:'center'  , width: '55px', hidden: true}
	  		, {key : 'errCtt'	              	,title : emClass + '에러내용' /*  에러내용 */                 ,align:'left'  , width: '300px', hidden: showErrCttYn,
	  			inlineStyle: {color: 'red'}
	  		}
	  		, {key : 'workDivVal'	              	,title : '작업구분' /*  작업구분 */                 ,align:'center'  , width: '90px', }
	  		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}
	  		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
	  		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px'}
	  		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
	  		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
	  		, {key : 'lnkgBizrCdNm'	              	,title : cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */                 ,align:'left'  , width: '160px'}
	  		, {key : 'lineUsePerdTypCdNm'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px'}
	  		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
	  		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
	  		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px'}
	  		, {key : 'mscId'	      		,title : "MSC_ID"        		,align:'center', width: '100px'}
	  		, {key : 'ogMp'	      		,title : "MP"          		,align:'center', width: '80px'}
	  		, {key : 'ogPp'	      		,title : "PP"          		,align:'center', width: '80px'}
	  		, {key : 'ogCard'	      		,title : "CARD"         		,align:'center', width: '80px'}
	  		, {key : 'ogLink'	      		,title : "LINK"         		,align:'center', width: '80px'}
	  		, {key : 'tieOne'	      		,title : "TIE1"         		,align:'center', width: '80px', editable: true}
	  		, {key : 'tieTwo'	      		,title : "TIE2"         		,align:'center', width: '80px', editable: true}
	  		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
	  		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
	  		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px'}
	  		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
	  		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px'}
	  		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px'}
	  		, {key : 'faltMgmtObjYnNm'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px'}
	  		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'}
	  		, {key : 'lastChgDt'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
	  		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
	  		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'}	
	  		, {key : 'ogicCd'	        ,title : 'OG/IC'			,align:'center', width: '110px'}
	  		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
	  		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
	  		, {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '110px'}
	  		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
	  		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
	  		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'}
	  		, {key : 'lineDistTypCdNm'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px'}
	  		, {key : 'lineSctnTypCdNm'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px'}
	  		, {key : 'chrStatCdNm'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px'}
	  		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
	  		, {key : 'trmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
	  		, {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '130px'}
	  		, {key : 'lineMgmtGrCdNm'	        ,title : emClass + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px'}
			, {key : 'rtLnoCtt'	            ,title : cflineMsgArray['rtLnoContent'] /*RT선번내용1*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px'}
	  	 	, {key : 'srsLineYnNm'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px'}
	  		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	  	] ; 
	  	return returnData;
	  }

	  //IP전송로(WCDMA)
	  var mapping020 = function(gridDiv, showAppltNoYn){
	  	var emClass = '';
	  	if (gridDiv =='info'){
	  		emClass = '';
	  	}else{
	  		emClass = '<em class="color_red">*</em> ' ;
	  	}
	  	var returnData = [
	  	{key : 'seq'	            ,title : '순번' /*  순번 */                 ,align:'center'  , width: '55px', numberingColumn : true}
  		, {key : 'tmpKey'	            ,title : 'tmpKey' /* tmpKey*/                 ,align:'center'  , width: '55px', hidden: true}
  		, {key : 'xlsFileNm'	            ,title : 'xlsFileNm' /* xlsFileNm*/                 ,align:'center'  , width: '55px', hidden: true}
  		, {key : 'errCtt'	              	,title : '에러내용' /*  에러내용 */                 ,align:'left'  , width: '300px', hidden: showAppltNoYn,
  			inlineStyle: {color: 'red'}
  		}
	  	, {key : 'workDivVal'	              	,title : '작업구분' /*  작업구분 */                 ,align:'center'  , width: '90px'}
	  	, {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
	  	, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}
	  	, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
	  	, {key : 'lineRowNum'	            ,title : cflineMsgArray['lineSequence'] /*  회선순번 */			,align:'center', width: '70px'}
	  	, {key : 'autoClctYn',		title : cflineMsgArray['lnoCollectionYesOrNo'] /* 선번수집여부 */			,align:'center',			width:'110px'}
	  	, {key : 'svlnLclCdNm'	            ,title : cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
	  	, {key : 'svlnSclCdNm'	            ,title : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
	  	, {key : 'lineUsePerdTypCdNm'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px'}
	  	, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'}
	  	, {key : 'lastChgDt'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
	  	, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '120px'}
	  	, {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '120px'}
	  	, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '120px'}
	  	, {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '120px'}
	  	, {key : 'mac'	        ,title : "MAC"			,align:'center', width: '160px'}
	  	, {key : 'duip'	        ,title : "DU IP"			,align:'center', width: '160px'}
	  	, {key : 'vlanId'	        ,title : "VLAN"			,align:'center', width: '100px'}
	  	, {key : 'cuid'	      		,title : "CUID"          		,align:'center', width: '100px'}
	  	, {key : 'pktTrkNm'	        ,title : cflineMsgArray['pwEvcName'] /* PW/EVC명 */			,align:'center', width: '200px'}
	  	, {key : 'pktTrkMatchNm',				align:'right',			width:'90px',		title : "pktTrkMatchNm"	,   hidden : true	  }
	  	, {key : 'pktTrkNo', hidden: true}
	  	, {key : 'ringOneName',		title : 'Ring#1'			,align:'left',		width:'200px' }
	  	, {key : 'eqpNmOne',	        title : cflineMsgArray['equipmentName']+"#1" /* 장비명 */			 ,align:'left', width:'200px' }
	  	, {key : 'ringTwoName',		title : 'Ring#2'			,align:'left',		width:'200px' }
	  	, {key : 'eqpNmTwo',	        title : cflineMsgArray['equipmentName']+"#2" /* 장비명 */			 ,align:'left', width:'200px' }
	  	, {key : 'eqpPortVal',		title : 'Drop Port'			,align:'center',			width:'80px' }
	  	] ; 
	  	return returnData;
	  }

	  //기타회선(기타) 
	  var mapping006 = function(gridDiv, showAppltNoYn, showErrCttYn){
	  	var emClass = '';
	  	if (gridDiv =='info'){
	  		emClass = '';
	  	}else{
	  		emClass = '<em class="color_red">*</em> ' ;
	  	}
	  	var returnData =  [
	  	    {key : 'xlsSeq'	            ,title : '순번' /*  순번 */                 ,align:'center'  , width: '45px'}
	  		, {key : 'tmpKey'	            ,title : 'tmpKey' /* tmpKey*/                 ,align:'center'  , width: '205px', hidden: true}
	  		, {key : 'errCtt'	              	,title : emClass + '에러내용' /*  에러내용 */                 ,align:'left'  , width: '300px', hidden: showErrCttYn,
	  			inlineStyle: {color: 'red'}
	  		}
	  		, {key : 'workDivVal'	              	,title : '작업구분' /*  작업구분 */                 ,align:'center'  , width: '70px'}
	  		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}
	  		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '140px'}
	  		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '140px'}
	  		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'center'  , width: '140px'}
	  		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
	  		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
	  		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
	  		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
	  		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '80px'}
	  		, {key : 'faltMgmtObjYnNm'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px'}
	  		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
	  		}
	  		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
	  			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }}	
	  		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
	  		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
	  		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
	  		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
	  		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px'}
	  		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px'}
	  		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	  		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
	  		
	  	]; 
	  	return returnData;
	  }
	  
	  function excelCreatePop ( jobInstanceId ){
	    	// 엑셀다운로드팝업
	       	 $a.popup({
	            	popid: 'ExcelDownlodPop' + jobInstanceId,
	            	iframe: true,
	            	modal : false,
	            	windowpopup : true,
	                url: 'ExcelDownloadPop.do',
	                data: {
	                	jobInstanceId : jobInstanceId
	                }, 
	                width : 500,
	                height : 300
	                ,callback: function(resultCode) {
	                  	if (resultCode == "OK") {
	                  		
	                  	}
	               	}
	            });
	    }  
});