/**
 * ServiceLineExcelUploadPop
 *
 * @author P100700
 * @date 2016. 12. 07.  
 * @version 1.0
 * 
 * 처리내용
 * 1. 파일 업로드 : 파일명, 총 건수, 엑셀업로드작업번호(excelUploadJobNo) 등 기본정보를 리턴
 * 2. 업로드된 파일 기준으로 2000건씩 임시 테이블에 삽입
 * 3. 업로드 완료된 내역 조회
 * 4. 에러건등에 대한 수정 및 다운로드
 * 5. 임시테이블의 데이터 일괄 기간망 트렁크에 반영(200건씩 반복)
 */
var mgmtGrpCdVal = "";
var procExcelUploadJobNo = "";
var xlsWorkObjVal = "";
var addData = false;

var uploadData = [];
var limitPage = 500;
var maxProcCnt = 200;

var okCount = 0;
var ngCount = 0;
var excelUploadProcCnt = 0;
var excelUploadTotalCnt  = 0 ;
var tsdnNtwkBasNo = "";
var tsdnNtwkLnoNo = "";

/* 파일 업로드 */
var excelFileNm = "";
var orgExcelFileNm = "";
var excelFileRowIdx = 0;

var saveDataList = null;  // 수정건 저장용 목록
var workCntToTemp = 0;  // 수정건 저장 작업건수 

var authYn = false;   // 수정/삭제/일괄등록 권한

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
        
        //기본정보/선번정보 체크
    	$('#infoVal').setChecked(true);
    	$('#sctnLnoVal').setChecked(true);
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
    	
    	/**  엑셀 업로드 **/
	    // 파일 선택
	    $('#fileSelect').on('click', function(e) {    		
    		var exform  = document.getElementById('excelform');
    		exform.reset();
    		$('#excelFile').click();
        });    
	    
	    // 파일변경
    	$('#excelFile').on('change', function(e) {  
    		$("#textFileNm").text(this.value);
    	});    
    	
    	// 기본정보 클릭시
		$('#infoVal').on('click', function(e){
			// 기본정보도 해지시 선번정보도 해지
			if($('#infoVal').is(':checked') == false) {
				$('#sctnLnoVal').setChecked(false);
			}
    	});  
		
    	// 선번정보 클릭시
		$('#sctnLnoVal').on('click', function(e){
			// 선번정보 클릭하면 기본정보도 클릭
			if($('#sctnLnoVal').is(':checked')) {
				$('#infoVal').setChecked(true);
			}
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
	    	
			var msg = cflineMsgArray['excel'];						/* 엑셀  */
			if($('#infoVal').is(":checked") == true){
				msg += " " + cflineMsgArray['baseInformation']; 					/* 기본정보  */
			}
			if($('#sctnLnoVal').is(":checked") == true){
				msg += " " + cflineMsgArray['lnoInformation'];					/* 선번정보  */
			}
			
			callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg),function(msgId, msgRst){ //'기본정보을(를)업로드 하시겠습니까?'
        		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */	
        			$("#fileName").val("");
					$("#extensionName").val("");
					$('#btn_fail_excel').hide();					

					excelFileNm = "";
					excelUploadTotalCnt = 0;
					excelUploadProcCnt = 0;
					excelFileRowIdx = 0;
					procExcelUploadJobNo = "";			
					orgExcelFileNm = "";
					
					excelUploadToTemp("Y");
				}
			});
    	
    	});

    	// 에러파일 다운로드
    	$("#btnExportExcelPop").on('click', function(){
    		    		
    		var excelDownData = $('#'+excelUploadGrid).alopexGrid('dataGet');
    		if (nullToEmpty(procExcelUploadJobNo) == "" || excelDownData.length == 0) {
    			alertBox('W', "다운로드할 파일을 조회 후 엑셀다운로드 해주세요.");/* 다운로드할 파일을 조회 후 엑셀다운로드 해주세요. */
				return;
    		}
    		// 엑셀업로드 파일 다운로드
    		getExcelUploadFileDown(excelUploadGrid); 
    		
		});    	
		
		// 에러파일 다운로드
    	$("#btn_sample_excel").on('click', function(){
    		
    		// 엑셀파일 다운로드
    		getExcelFileDown("SAMPLE"); 
    		
		}); 
    	
    	// 에러파일 다운로드
    	$("#btn_fail_excel").on('click', function(){
    		
    		if($("#fileName").val() == "" || $("#extensionName").val() == "") {
    			alertBox('W', cflineCommMsgArray['noExistFileForDownload']);  /* 다운로드 할 파일이 존재하지 않습니다. */
    			return false;
    		}
    		else {
    			// 엑셀파일 다운로드
    			getExcelFileDown("excelUploadFailFile"); 
    		}
		});  
    	
    	// 닫기버튼클릭
    	$('#btn_close').on('click', function(e) {
    		$a.close();
    	});
    	

    	/** 업로드 파일 조회 및 업로드 파일 편집 업로드 처리**/
    	// 파일 업로드 / 파일 조회 타입 선택
    	$('input:radio[name=excelWorkType]').on('click', function(e) {	
    		 var excelWorkType = $('input:radio[name=excelWorkType]:checked').val();
    		    
    		 // 엑셀업로드
    		 if (excelWorkType == 'FILE') {
    			$(".FILE").show();
    			$(".SRCH_FILE").hide();
    		 } 
    		 // 업로드파일찾기
    		 else if (excelWorkType == 'SRCH_FILE') {
    			 $(".FILE").hide();
     			 $(".SRCH_FILE").show();
				 
				 var selectTab = parseInt($('#basicExcelTabs').getCurrentTabIndex());
				 switch (selectTab) {
				 case 0 :    // 파일목록
	    				$('#'+excelFileGridId).alopexGrid("viewUpdate");
	    				$('#btn_file').show();
	    				$('#btn_excelData').hide();
	    				$('.SRCH_FILE_CONDITION').show();
	    				$('#btnSearchPop').show();
	    				break;
	    			case 1 :    // 엑셀데이터
	    				$('#'+excelUploadGrid).alopexGrid("viewUpdate");    	
	    				$('#btn_file').hide();	
	    				$('#btn_excelData').show();	
	    				if (authYn == true) {
	    					$('#btnProcInsertAll').show();	
	    				} else {
	        				$('#btnProcInsertAll').hide();	
	    				}				
	    				$('.SRCH_FILE_CONDITION').hide();
	    				$('#btnSearchPop').hide();
	    				break;
	    			default :
	    				break;
	        	}  
    		 }
    		 $('#btn_hd_logout').hide();
    	});
    	    	
    	$('#basicExcelTabs').on("tabchange", function(e, index) {
    		
    		var selectTab = parseInt($('#basicExcelTabs').getCurrentTabIndex());
        	switch (selectTab) {
    			case 0 :    // 파일목록
    				$('#'+excelFileGridId).alopexGrid("viewUpdate");
    				$('#btn_file').show();
    				$('#btn_excelData').hide();
    				$('.SRCH_FILE_CONDITION').show();
    				$('#btnSearchPop').show();
    				break;
    			case 1 :    // 엑셀데이터
    				$('#'+excelUploadGrid).alopexGrid("viewUpdate");    	
    				$('#btn_file').hide();	
    				$('#btn_excelData').show();	
    				if (authYn == true) {
    					$('#btnProcInsertAll').show();	
    				} else {
        				$('#btnProcInsertAll').hide();	
    				}		
    				$('.SRCH_FILE_CONDITION').hide();
    				$('#btnSearchPop').hide();
    				break;
    			default :
    				break;
        	}
    	});
    	
    	// 엔터 이벤트 
     	$('.SRCH_FILE').on('keydown', function(e){
     		if (e.which == 13){		     	
     			var selectTab = parseInt($('#basicExcelTabs').getCurrentTabIndex());
     			if (selectTab != 0) {
     				return;
     			}
     	    	$('#btnSearchPop').click();
    		}
     	});	
    	
    	//조회버튼 클릭시
        $('#btnSearchPop').on('click', function(e) {
        	fnSearchExcelInfo("file", true,"");
        });
        
        //파일목록 조회팝업 스크롤 이동시
       	$('#'+excelFileGridId).on('scrollBottom', function(e){
       		addData = true;
       		fnSearchExcelInfo("file", false,"");
     	});
       	
        //파일목록 조회팝업 스크롤 이동시
       	$('#'+excelUploadGrid).on('scrollBottom', function(e){
       		var param = {
					"gridId" : excelUploadGrid
					, "excelUploadJobNo": procExcelUploadJobNo
					};
       		addData = true;
       		fnSearchExcelInfo("excel", false, param);
     	});
        
        //삭제버튼 클릭시
        $('#btnDeleteExcelData').on('click', function(e) {
        	
        	var delData =  $('#'+excelFileGridId).alopexGrid('dataGet', {_state:{selected:true}});
        	
        	if (delData.length == 0) {
        		alertBox('I', cflineMsgArray['selectNoData']);  /* 선택된 데이터가 없습니다. */
        		return false;
        	}

        	// 자기가 등록한 파일만 삭제가능함
        	var chkRegUserId = $('#'+excelFileGridId).alopexGrid('dataGet', {'frstRegUserId' : $('#currUserId').val(), _state:{selected:true}}, 'frstRegUserId');
        	if (chkRegUserId == null || delData.length != chkRegUserId.length) {
        		alertBox('I', "자신이 등록한 파일만 삭제가능합니다.");  
        		return false;
        	}
        	
        	var paramData = {
        			"rontTrunkList" : delData
        	}
        	callMsgBox('','C',"선택한 엑셀파일 정보를 삭제하시겠습니까?",function(msgId, msgRst){ //'선택한 엑셀파일 정보를 삭제하시겠습니까?'
				if (msgRst == 'Y') {     // 업로드 하시겠습니까?
					cflineShowProgressBody();
					httpRequestForSelect(
							'tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/deleteexcelfile'
							, paramData
							, 'POST'
							, 'deleteExcelFile');
        		}
    		});
        });
        

        // 업로드 파일 상세 목록 조회팝업(선번)
        $('#'+excelFileGridId).on('dblclick', '.bodycell', function(e){
        	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	var dataKey = dataObj._key; 
    	 	var excelUploadJobNo = dataObj.excelUploadJobNo;
    	 	
    		if (excelUploadJobNo == undefined){
    			excelUploadJobNo = null;
    		}
    		
    		procExcelUploadJobNo = excelUploadJobNo;
    		xlsWorkObjVal= "";
        	var param = {
        						"gridId" : excelUploadGrid
        						, "excelUploadJobNo": excelUploadJobNo
        						, "frstRegUserId" : dataObj.frstRegUserId
        						};
        	fnSearchExcelInfo("excel", true, param);
        });
        

        
        // 저장 클릭    	
    	$('#btnSaveTmp').on('click', function(e) {
    		var focusData = $('#'+excelUploadGrid).alopexGrid("dataGet", {_state : {focused : true}});
    		if (focusData.length > 0) {

        		$('#'+excelUploadGrid).alopexGrid("endRowInlineEdit", {_index: { row : focusData[0]._index.row}});
    		}
    		saveDataList = $('#'+excelUploadGrid).alopexGrid("dataGet", {"workType" : "U"}, "workType" );    		
    		workCntToTemp = 0;
    		
    		if (saveDataList.length == 0) {
        		alertBox('I', "수정한 내용이 없습니다"); 
        		return 
        	}

    		var saveToTempMsg = "수정한 [" + saveDataList.length +  " 건]의 기간망 트렁크 엑셀 정보를 갱신 하시겠습니까?";
    		callMsgBox('','C', saveToTempMsg,function(msgId, msgRst){ //'수정한 기간망 트렁크 엑셀 정보를 갱신 하시겠습니까?'
    			if (msgRst == 'Y') {     // 업로드 하시겠습니까?
    				makeSaveDataToTemp();
        		}
    		});
    		
    	});
        
        // 일괄등록 클릭    	
    	$('#btnProcInsertAll').on('click', function(e) {
    		
    		tsdnNtwkBasNo = "";
    		tsdnNtwkLnoNo = "";
    		
    		okCount = 0;
		    ngCount = 0;
		    		    
		    uploadData = $('#'+excelUploadGrid).alopexGrid('dataGet');
		    if (uploadData.length > 0) {
			    var excelUploadJobNo = uploadData[0].excelUploadJobNo;
			    if (nullToEmpty(excelUploadJobNo) != "" && excelUploadJobNo.indexOf("|") > 0) {
			    	excelUploadJobNo = excelUploadJobNo.substr(0, excelUploadJobNo.indexOf("|"));
			    	if (excelUploadJobNo != procExcelUploadJobNo) {
			    		alertBox('I', "처리할 데이터를 재 조회 후 일괄등록 버튼을 클릭해 주세요.");
		    			return;
			    	}
					excelUploadProcCnt = 0;
					var excelCnt = $('#'+excelFileGridId).alopexGrid('dataGet', {"excelUploadJobNo" : excelUploadJobNo}, "excelCnt");
					if (excelCnt != null && excelCnt.length > 0) {
						excelUploadTotalCnt = nullToEmpty(excelCnt[0].excelCnt) == "" ? 0 : parseInt(excelCnt[0].excelCnt);
					}
								
					if (excelUploadTotalCnt > 0) {
						callMsgBox('','C',"일괄등록 하시겠습니까?",function(msgId, msgRst){ //'일괄업로드 하시겠습니까?'
							if (msgRst == 'Y') {     // 업로드 하시겠습니까?
								// 임시테이블에 있는 데이터 엑셀업로드
								tmpDataExcelUpload();
			        		}
			    		});
					}
			    } else {
			    	alertBox('I', "처리할 데이터가 없습니다.");
	    			return;
			    }
			} else {
				alertBox('I', "처리할 데이터가 없습니다.");
    			return;
			}
    	});
    	
    	// 데이터 변경
    	$('#'+excelUploadGrid ).on('propertychange input', function(e){
    		if (authYn == false) {
    			return false;
    		}
    		var dataObj = AlopexGrid.parseEvent(e);
    		var columnKey = dataObj.data._key;
    		var rowIndex = dataObj.data._index.row;
    		var rontSctnClCd = "";
    		var pathIndex = 0;
    		
			$('#'+excelUploadGrid).alopexGrid( "cellEdit", "U", {_index : { row : rowIndex }}, "workType");    // 데이터 변경됨
			$('#'+excelUploadGrid).alopexGrid( "cellEdit", "", {_index : { row : rowIndex }}, "procYn");    // 처리결과
			
			if ($('#btnSaveTmp').is(':hidden')) {
				$("#btnSaveTmp").show();
				$("#btnProcInsertAll").hide();
			}
			
    	});
	};
	
		
	function getExcelFileDown(gubunFile){
				
		if (gubunFile == "SAMPLE" && $('#infoVal').is(":checked") == false && $('#sctnLnoVal').is(":checked") == false) {
			alertBox('W', cflineMsgArray['selectDemandPoolUpDataType']);/* 업로드할 정보타입을 선택해 주세요. */
			$('#infoVal').focus();
			return; 
		}   		
		
		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
		$form.append(Tango.getFormRemote());
		if (gubunFile == "SAMPLE") {
			var fileType = "_기본";
			if ($("input:checkbox[id='sctnLnoVal']").is(":checked")) {
				fileType += "_선번";
			}
			$form.append('<input type="hidden" name="gubunFile" value="' + gubunFile + '" />');
			$form.append('<input type="hidden" name="fileName" value="기간망트렁크' + fileType + '_SAMPLE.xlsx" />');
			$form.append('<input type="hidden" name="type" value="' + gubunFile + '" />');
			$form.append('<input type="hidden" name="infoVal" value="' + ($("input:checkbox[id='infoVal']").is(":checked") ? 'Y' : 'N') + '" />');
			$form.append('<input type="hidden" name="sctnLnoVal" value="' + ($("input:checkbox[id='sctnLnoVal']").is(":checked") ? 'Y' : 'N') + '" />');
			$form.append('<input type="hidden" name="chkDate" value="30" />');
		} else {
			$form.append('<input type="hidden" name="fileName" value="'+$("#fileName").val()+'" /><input type="hidden" name="fileExtension" value="'+$("#extensionName").val()+'" />');
			$form.append('<input type="hidden" name="type" value="' + gubunFile + '" />');
		}
		$form.appendTo('body');
		$form.submit().remove();	
	}
	
	// 엑셀 다운로드
	function getExcelUploadFileDown(gridId){
		
		// 엑셀데이터 내용 다운로드
		if (gridId != excelUploadGrid) {
			return;
		}
		
		cflineShowProgressBody();
		
		var dataParam =  {
				  "excelUploadJobNo" : procExcelUploadJobNo
				, "xlsWorkObjVal" : xlsWorkObjVal
				, "procYn" : $('#procYn').val()
				, "dataChkYn" : $('#dataChkYn').val()
				, "excelUpload" : "Y"
		}
		
				
		$.extend(dataParam,{topoLclCd: "003" });
		$.extend(dataParam,{topoSclCd: "102" });
		
		dataParam = gridExcelColumn(dataParam, gridId);
	 			
		dataParam.fileExtension = "xlsx";
		dataParam.excelPageDown = "N";
		dataParam.excelUpload = "Y";
		dataParam.method = "rontTrunkExcelDownloadNew";
		
		httpRequestForSelect('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/exceldownloadnew', dataParam, 'POST', 'excelDownloadNew');
	}
	
	// 검색
	function fnSearchExcelInfo(sType, changeSearch, param) {
		// 파일정보 검색
		/*if(sType == "file" ) {
			setRowIndexInfo(changeSearch);
		} */
		setRowIndexInfo(sType);
			
		cflineShowProgressBody();
		
		if (sType == "file") {
			var paramData = {
				"srchFrstRegDateFrom" : nullToEmpty($('#srchFrstRegDateFrom').val()).replace(/-/gi,""),
				"srchFrstRegDateTo" : nullToEmpty($('#srchFrstRegDateTo').val()).replace(/-/gi,""),
				"frstRegUserId" : $('#frstRegUserId').val(),
				"procYn" : $('#procYn').val(),
				"dataChkYn" : $('#dataChkYn').val(),
				"fileName" : $('#fileNm').val(),
				"firstRowIndex" : $('#firstRowIndex').val(),
				"lastRowIndex" : $('#lastRowIndex').val()
			};
			
			// 일괄등록 후 해당건만 제조회 하기위해(파일조회후 조건을 수정하고 일괄등록 요청을 하는경우 파일검색결과내에 일괄등록 건의 데이터가 조회되지 않을 수 있기 때문에) 
			if (nullToEmpty(param) != "") {				
				paramData = param;
				paramData.firstRowIndex = $('#firstRowIndex').val();
				paramData.lastRowIndex = $('#lastRowIndex').val();				
			}
			
			if (addData != true) {
				$('#'+excelFileGridId).alopexGrid('dataEmpty');
				$('#'+excelUploadGrid).alopexGrid('dataEmpty');
				if (nullToEmpty(param) != "") {
					procExcelUploadJobNo = "";
					xlsWorkObjVal = "";
				}				
			}
				
			$('#basicExcelTabs').setTabIndex(0);
			httpRequestForSelect('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/selectexcelfile', paramData, 'GET', 'searchExcelFile');
		} else if (sType == "excel") {
						
			var paramData = {
					"excelUploadJobNo" : param.excelUploadJobNo
				  , "procYn" : $('#procYn').val()
				  , "dataChkYn" : $('#dataChkYn').val()
				  , "firstRowIndex" : $('#firstRow01').val()
				  , "lastRowIndex" : $('#lastRow01').val()
			};
			
			procExcelUploadJobNo = param.excelUploadJobNo;
			if (addData != true) {
				xlsWorkObjVal = "";
				$('#'+excelUploadGrid).alopexGrid('dataEmpty');
				
				if (nullToEmpty(param.frstRegUserId) == $('#currUserId').val()) {
					authYn = true;
					$('#btnProcInsertAll').show();	
				} else {
					authYn = false;
					$('#btnProcInsertAll').hide();	
				}
			}
			$('#basicExcelTabs').setTabIndex(1);
			httpRequestForSelect('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/selectexceldata', paramData, 'GET', 'searchExcelData');
		}
	}	

	// info list row intex 
	function setRowIndexInfo(sType){
		if(sType == "file"){
			if (addData == false) {
				$("#firstRowIndex").val("1");
			    $("#lastRowIndex").val(limitPage);
			} else {
				$("#firstRowIndex").val(parseInt($("#firstRowIndex").val()) + limitPage);
			    $("#lastRowIndex").val(parseInt($("#lastRowIndex").val()) + limitPage);
			}
			$("#firstRow01").val(1);
	   	    $("#lastRow01").val(limitPage);
		} 
		else if (sType == "excel") {
			if (addData == false) {
				$("#firstRow01").val("1");
			    $("#lastRow01").val(limitPage);
			} else {
				$("#firstRow01").val(parseInt($("#firstRow01").val()) + limitPage);
			    $("#lastRow01").val(parseInt($("#lastRow01").val()) + limitPage);
			}
		}
	}
	
	// 프로그레스
	var msgHtml = [];
	/* 엑셀 업로드 파일 처리
	 * initYn : 최초 파일 등록
	 *  */
    function excelUploadToTemp(initYn) {

    	if (initYn == "Y") {
    		
			var excelUploadApi = 'tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/exceluploadfile';			
			var excelUploadFlag = 'excelUploadFile';
    		var form = new FormData(document.getElementById('excelform'));
    		httpUploadRequest(
    				     excelUploadApi
    		           , form
    		           , 'post'
    		           , excelUploadFlag);
    	}
    	
    	//********************
		//**프로그레스 다이아 로그
		//*******************//
		if (excelUploadProcCnt >= excelUploadTotalCnt && initYn != "Y") {
			if($('#dialogMsg').length != 0){
        		$('#dialogMsg').close().remove();
     		}
			// 처리완료 메세지
			alertBox('I', "엑셀파일 업로드를 완료하였습니다.(총 : " + setComma(excelUploadProcCnt) + "건)");
			return ;
		}
		
		if (excelUploadProcCnt == 0 && initYn == "Y") {

    		msgHtml = [];
     		if($('#dialogMsg').length != 0){
     			$('#dialogMsg').remove();
     		}
     		
			msgHtml.push("		<div class='Dialog-contents color_black' style='word-wrap:break-word;'>");
			msgHtml.push(" <br><center>************  엑셀 파일 업로드 중 입니다  **************");
			msgHtml.push(" <br><br> 엑셀 파일 내용을 임시 저장 중입니다. ");
			msgHtml.push(" <br><br> 저장작업 완료 후 일괄 등록 작업을 통해 기간망 트렁크의 기본 혹은 선번 정보를 등록해 주시기 바랍니다. ");
			msgHtml.push(" <br><br>");
    		msgHtml.push("<span id='currentIdx'></span> / <span id='excelUploadTotalCnt'></span></center>");
    		msgHtml.push("<br><br>");
    		msgHtml.push("</div>");
    		
    		var msgDiv = document.createElement("div");
    		msgDiv.setAttribute("id","dialogMsg");
    		msgDiv.setAttribute("class","Dialog");
    		document.body.appendChild(msgDiv);
    		msgDiv.innerHTML = msgHtml.join("");

    		$a.convert($("#dialogMsg"));
    		
    		 $('#dialogMsg').open({
    			    title: "엑셀 파일 업로드",
    			    width: "450",
    			    height: "250",
    			    type : "blank",
    			    resizable: false,
    			    toggle: false,
    			    movable: true,
    			    modal: true,
    			    animation: "show", //fade, slide
    			    xButtonClickCallback : function(el){ // x버튼 처리
    			    }    			    
    			  });
    		 
    		 // TODO시간지연
		}
		
		$('#currentIdx').html(setComma(excelUploadProcCnt));
		if (initYn == "Y") {
			$('#excelUploadTotalCnt').html("확인중");
		} else {
			$('#excelUploadTotalCnt').html(setComma(excelUploadTotalCnt));
			$('#btn_hd_logout').trigger("click");
			
			var infoVal = "N" ;
			if ($("input:checkbox[id='infoVal']").is(":checked") ){
				infoVal = "Y"; 
			}
			var sctnLnoVal = "N" ;
			if ($("input:checkbox[id='sctnLnoVal']").is(":checked") ){
				sctnLnoVal = "Y"; 
			}
			
			var paramData = {
	    			  "excelFileNm" : excelFileNm   // 업로드 작업중인 파일명(유니크하게 처리하기 위해 시퀀스 값이 있는 파일명)
	    			, "fileName" : orgExcelFileNm
	    			, "excelUploadTotalCnt" : excelUploadTotalCnt   // 총건수
	    			, "excelUploadProcCnt" : excelUploadProcCnt  // 처리건수
	    			, "excelFileRowIdx" : excelFileRowIdx  // 처리할 Row
	    			, "maxProcCnt" : 2000  // 최대처리건수
	    			, "excelUploadJobNo" : procExcelUploadJobNo
	    			, "infoVal" : infoVal
	    			, "sctnLnoVal" : sctnLnoVal
	    			, "mgmtGrpCd" : $('#mgmtGrpCdPop').val()
	    	}
	    	
			httpRequestForSelect(
								'tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/exceluploadtotemp'
								, paramData
								, 'GET'
								, 'exceluploadToTemp');
		}
		
    }
	
	// 임시테이블에 데이터 저장
	function makeSaveDataToTemp(){
    	
    	//********************
		//**프로그레스 다이아 로그
		//*******************//
		if (workCntToTemp >= saveDataList.length) {
			if($('#dialogMsg').length != 0){
        		$('#dialogMsg').close().remove();
     		}
			$("#btnSaveTmp").hide();
			$("#btnProcInsertAll").show();
			return ;
		}
		
		if (workCntToTemp == 0) {

    		msgHtml = [];
     		if($('#dialogMsg').length != 0){
     			$('#dialogMsg').remove();
     		}
     		
			msgHtml.push("		<div class='Dialog-contents color_black' style='word-wrap:break-word;'>");
			msgHtml.push(" <br><center>************  수정한 엑셀 정보를 저장 중 입니다  **************");
			msgHtml.push(" <br><br> 저장작업은 수정한 엑셀 내용을 임시로 저장하는 작업으로 기간망 트렁크의 기본 혹은 선번 정보를 수정하는 것은 아닙니다. ");
			msgHtml.push(" <br><br> 저장작업 완료 후 일괄 등록 작업을 통해 기간망 트렁크 기본 혹은 선번 정보를 등록해 주시기 바랍니다. ");
			msgHtml.push(" <br><br>");
    		msgHtml.push("<span id='currentIdx'></span> / " + setComma(saveDataList.length) + "</center>");
    		msgHtml.push("<br><br>");
    		msgHtml.push("</div>");
    		
    		var msgDiv = document.createElement("div");
    		msgDiv.setAttribute("id","dialogMsg");
    		msgDiv.setAttribute("class","Dialog");
    		document.body.appendChild(msgDiv);
    		msgDiv.innerHTML = msgHtml.join("");

    		$a.convert($("#dialogMsg"));
    		
    		 $('#dialogMsg').open({
    			    title: "엑셀 데이터 수정",
    			    width: "450",
    			    height: "250",
    			    type : "blank",
    			    resizable: false,
    			    toggle: false,
    			    movable: true,
    			    modal: true,
    			    animation: "show", //fade, slide
    			    xButtonClickCallback : function(el){ // x버튼 처리
    			    }    			    
    			  });
    		 
    		 // TODO시간지연
		}
		
		$('#currentIdx').html(setComma(workCntToTemp));
    	
    	var rontTrunkBaseList = [];
    	var rontTrunkLnoList = [];
    	var xlsWorkObjValLno = "";
    	var rontSctnClCd = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012"];
    	
    	var maxCntToTemp = 100;
    	for (var i = workCntToTemp; i < saveDataList.length; i++) {
    		
    		// 전체처리 건수 중 한번에 처리할 건수를 넘지 않게
    		if (i > (workCntToTemp + maxCntToTemp - 1)) {
				break;
			}
    		
    		var tmpBase = saveDataList[i];
    		if (xlsWorkObjValLno == "") {
    			xlsWorkObjValLno = tmpBase.xlsWorkObjVal.indexOf("선번") > 0 ? "L" : "B";
    		}
    		var rontTrunkBase = {
    				               "excelUploadJobNo" : tmpBase.excelUploadJobNo    // 파일키
    				             , "workDivVal" : tmpBase.workDivVal                // 작업구분
    				             , "uprMtsoNm" : tmpBase.uprMtsoNm					// 구간S
    				             , "lowMtsoNm" : tmpBase.lowMtsoNm					// 구간E
    				             , "ntwkLineNo" : tmpBase.ntwkLineNo				// 네트워크회선번호
    				             , "rontTrkLineRmk" : tmpBase.rontTrkLineRmk		// 회선ID
    				             , "ntwkStatCdNm" : tmpBase.ntwkStatCdNm			// 회선상태
    				             , "ntwkLineNm" : tmpBase.ntwkLineNm				// 구간E
    				             , "rontTrkTypNm" : tmpBase.rontTrkTypNm			// 서비스유형
    				             , "wdmChnlVal" : tmpBase.wdmChnlVal				// 채널
    				             , "wdmWavlVal" : tmpBase.wdmWavlVal				// 파장 
    				             , "rontTrkCapaTypNm" : tmpBase.rontTrkCapaTypNm	// 회선유형
    				             , "protModeTypNm" : tmpBase.protModeTypNm			// 보호모드 
    				             , "rontTrkUseYn" : tmpBase.rontTrkUseYn			// 사용유무 
    				             , "lineAppltNo" : tmpBase.lineAppltNo				// 회선청약번호 
    				             , "useRingNtwkLineNos" : tmpBase.useRingNtwkLineNos// 경유PTP링
    					         , "wkSprDivCdNm" : nullToEmpty(tmpBase.wkSprDivCdNm)            		// 주예비구분
    				             , "workType" : "U"     // 작업유형
    				             , "xlsWorkObjVal" : tmpBase.xlsWorkObjVal   // 엑셀 작업대상
    		}
    		rontTrunkBaseList.push(rontTrunkBase);
    		
    		// 선번편집
    		if (xlsWorkObjValLno == "L") {
    			
    			var ntwkLnoSrno = 1;   // 네트워크선번일련번호
    			// 중계기노드 이외
    			for (var j = 0; j < rontSctnClCd.length; j++) {
    				var tmpLno = saveDataList[i];
    				
    				if (nullToEmpty(tmpLno[rontSctnClCd[j]+"lftEqpRoleDivNm"] ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftJrdtTeamOrgNm"] ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftVendorNm"]  ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftEqpInstlMtsoNm"]  ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftEqpNm"]  ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftCardMdlNm"]) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftShlfNm"] ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftSlotNo"] ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"lftPortNm"]   ) == ""
    					&& nullToEmpty(tmpLno[rontSctnClCd[j]+"rghtEqpPortRefcVal"]   ) == ""
    				) {
    					continue;
    				}
    				var rontTrunkLno = {
    						  "excelUploadJobNo" : tmpLno.excelUploadJobNo    						// 파일키
    						, "ntwkLnoSrno" : ntwkLnoSrno++											// 네트워크선번일련번호
				            , "lftEqpRoleDivNm" : tmpLno[rontSctnClCd[j]+"lftEqpRoleDivNm"]          // 시스템
				            , "lftJrdtTeamOrgNm" : tmpLno[rontSctnClCd[j]+"lftJrdtTeamOrgNm"]          // 관리팀
				            , "lftVendorNm" : tmpLno[rontSctnClCd[j]+"lftVendorNm"]          // 제조사
				            , "lftEqpInstlMtsoNm" : tmpLno[rontSctnClCd[j]+"lftEqpInstlMtsoNm"]          // 국사
				            , "lftEqpNm" : tmpLno[rontSctnClCd[j]+"lftEqpNm"]          // 노드명
				            , "lftCardMdlNm" : tmpLno[rontSctnClCd[j]+"lftCardMdlNm"]          // Unit
				            , "lftShlfNm" : tmpLno[rontSctnClCd[j]+"lftShlfNm"]          // Shelf
				            , "lftSlotNo" : tmpLno[rontSctnClCd[j]+"lftSlotNo"]          // Slot
				            , "lftPortNm" : tmpLno[rontSctnClCd[j]+"lftPortNm"]          // Port
				            , "rghtEqpPortRefcVal" : tmpLno[rontSctnClCd[j]+"rghtEqpPortRefcVal"]          // FDF
				            , "rontSctnClCd" : rontSctnClCd[j]          // 기간망구간코드
    				        , "frstRegDate" :  tmpLno[rontSctnClCd[j]+"frstRegDate"]   // 등록일자
		             		, "workType" : "U"    // 작업유형
		             			
    				}
    				rontTrunkLnoList.push(rontTrunkLno);
    			}
    			// 중계기 노드
    			for (var z = 1; z < 41; z++) {
    				
    				var tmpLno = saveDataList[i];
    				var pathId = "p" + z;
    				if (nullToEmpty(tmpLno[pathId + "lftEqpNm"] ) == "") {
    					continue;
    				}
    				if (pathId == "p40") {
    					if (nullToEmpty(rontTrunkBase.wkSprDivCdNm) == "" && nullToEmpty(tmpLno[pathId + "lftEqpNm"]) != "") {
    						rontTrunkBase.wkSprDivCdNm = tmpLno[pathId + "lftEqpNm"] ;
    					}
    					break;
    				}
    				var rontTrunkLno = {
  						      "excelUploadJobNo" : tmpLno.excelUploadJobNo    	 // 파일키
      						, "ntwkLnoSrno" : ntwkLnoSrno++						 // 네트워크선번일련번호
				            , "lftEqpNm" : tmpLno[pathId + "lftEqpNm"]          // 노드명
				            , "rontSctnClCd" : "013"                             // 기간망구간코드
	    				    , "frstRegDate" :  tmpLno[pathId + "frstRegDate"]   // 등록일자
			             	, "workType" : "U"    // 작업유형
	  				}
	  				rontTrunkLnoList.push(rontTrunkLno);
    			}
    		}
    	}    	
    	
    	var paramData = {
    			  "rontTrunkList" : rontTrunkBaseList
    			, "excelWorkkList" : rontTrunkLnoList
    	}
    	
		httpRequestForSelect(
							'tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/saveexceltotemp'
							, paramData
							, 'POST'
							, 'saveExcelToTemp');
    	
    	// 처리 건수
    	workCntToTemp += maxCntToTemp;
	}
	
	/* 임시테이블에 있는 정보 기간망 트렁크에 반영*/
	function tmpDataExcelUpload() {
		//********************
		//**프로그레스 다이아 로그
		//*******************//
		if (excelUploadProcCnt >= excelUploadTotalCnt) {
			if($('#dialogMsg').length != 0){
        		$('#dialogMsg').close().remove();
     		}
			return ;
		}
		
		if (excelUploadProcCnt == 0) {

    		msgHtml = [];
     		if($('#dialogMsg').length != 0){
     			$('#dialogMsg').remove();
     		}
     		
			msgHtml.push("		<div class='Dialog-contents color_black' style='word-wrap:break-word;'>");
			msgHtml.push(" <br><center>************ 일괄 등록 중 입니다 **************");
			msgHtml.push(" <br><br>");
			msgHtml.push(" 임시 저장한 정보를 실제 기간망 트렁크에 반영 중 입니다.<br>");
			msgHtml.push(" 현재 조회된 건만 처리되는 것이 아닌 업로드한 파일 단위로 처리되며,<br> 이미 처리완료한 건은 제외됩니다.");
			msgHtml.push(" <br>");
    		msgHtml.push("<span id='currentIdx'></span> / " + setComma(excelUploadTotalCnt) + "</center>");
    		msgHtml.push("<br>");
    		msgHtml.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push("성공 :  <b><span id='okCount'></span></b>");
    		msgHtml.push("<br>");
    		msgHtml.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    		msgHtml.push("실패 :  <color='red'><span id='ngCount'></span></color>");
    		msgHtml.push("      </div>");
    		//msgHtml.push("  </div>");
    		
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
    			    }    			    
    			  });
		}
		
		$('#currentIdx').html(setComma(excelUploadProcCnt));
		$('#okCount').html(setComma(okCount));
		$('#ngCount').html(setComma(ngCount));
				
		// 만약 다 처리 했다면 
		if (excelUploadProcCnt >= excelUploadTotalCnt ) {
			//처리결과
			viewProcInsertAllResult();
			return;
		} 	
		
		
		var param = {
				  "excelUploadJobNoStr" : procExcelUploadJobNo
				, "maxProcCnt" : maxProcCnt   // 최대처리건수
				, "excelUploadTotalCnt" : excelUploadTotalCnt // 처리한 건수
				, "excelUploadProcCnt" : excelUploadProcCnt   // 총처리건수
				
		}
		
		httpRequestForSelect(
				     'tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunkexcel/procinsertall'
		           , param
		           , 'get'
		           , 'procInsertAll');	
	}
	
	// 일괄등록 처리결화
	function viewProcInsertAllResult(errMsg) {
		
		// 마지막이면
		if($('#dialogMsg').length != 0){
			$('#dialogMsg').close().remove();
			cflineShowProgressBody();
 		}
		var resultMsg = cflineMsgArray['saveSuccess'] ;
		if (nullToEmpty(errMsg) != "" ) {
			if (errMsg == "NONE_BASE_DATA") {
				resultMsg = "처리할 파일키 정보가 부정확하여 처리에 실패했습니다.";
			} else {
				resultMsg = "일괄등록 처리에 실패했습니다.";
			}
			
		}

		cflineHideProgressBody();
		resultMsg += "<br><br> 전첸건수 : " + setComma(excelUploadTotalCnt) + "<br>성공건수 : " + setComma(okCount) + "<br>실패건수 : " + setComma(ngCount);
		// 처리결과 표시
		callMsgBox('','I', resultMsg,function(msgId, msgRst){ //'
			if (msgRst == 'Y') {
				var baseParam = {
						  "gridId" : excelFileGridId
						, "excelUploadJobNo": procExcelUploadJobNo
						};
				var lnoParam = {
						  "gridId" : excelUploadGrid
						, "excelUploadJobNo": procExcelUploadJobNo
						};
				fnSearchExcelInfo("file", true, baseParam);
				fnSearchExcelInfo("excel", true, lnoParam);
			}
		});
		// 재조회
		return;
	}
	
	//엑셀다운로드팝업
	function excelCreatePopForUpload ( jobInstanceId ){
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
	              		//$('#btnSearch').click();
	              	}
	           	}
	    });
	}

	//초기 조회 성공시
    function successUploadCallback(response, flag){  	
    	// 관리그룹
    	if(flag == 'C00188'){	
			var mgmtGrpCd_option_data =  [];
			for(k=0; k<response.length; k++){
				var dataMgmtGrp = response[k];
				if (dataMgmtGrp.value == "0001") {
					mgmtGrpCd_option_data.push(dataMgmtGrp);
				}	
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
    	else if(flag == 'excelUploadFile') {
			
			var data = response;
			if (nullToEmpty(data.resultCd) != ""  && data.resultCd == "OK") {

	        	$("#excelFile").val("");
	        	$("#textFileNm").text("");
	        	
				$('#excelWorkType2').setSelected();
				
				$(".FILE").hide();
     			$(".SRCH_FILE").show();  
				
				// 삭제/수정/일괄등록 권한
				authYn = true;
				
				$('#basicExcelTabs').setTabIndex(1);
				$('#'+excelFileGridId).alopexGrid('dataEmpty');
				$('#'+excelUploadGrid).alopexGrid('dataEmpty');
				// 리턴 받은 엑셀 팡리 정보 셋팅
				excelUploadTotalCnt = parseInt(data.excelUploadTotalCnt);
				excelUploadProcCnt = parseInt(data.excelUploadProcCnt);
				excelFileRowIdx = parseInt(data.excelFileRowIdx);
				procExcelUploadJobNo = data.excelUploadJobNo;				
				excelFileNm = data.excelFileNm;  // 유니크한 파일명
				orgExcelFileNm = data.orgExcelFileNm;
				var excelFileUpload = data.excelFileUpload;

				// 계속 처리
				excelUploadToTemp(excelFileUpload);
			} else if (nullToEmpty(data.resultCd) != ""  && data.resultCd == "NG" ) {
				if($('#dialogMsg').length != 0){
	        		$('#dialogMsg').close().remove();
	     		}
				
				var msg = cflineMsgArray['failFileUpload'];
				if (nullToEmpty(data.errorCd) != "" && data.errorCd== "HEAD_CHECK_ERROR") {
					
					$("#fileName").val(data.fileName + "." + data.extensionNames);
					$("#extensionName").val(data.extensionNames);
					$('#btn_fail_excel').show();
				}
				else if (nullToEmpty(data.errorCd) != "" && data.errorCd== "NONE_DATA") {
					msg += "<br>업로드 할 데이터가 없습니다.";
				}
				else if (nullToEmpty(data.errorCd) != "" && data.errorCd == "UPLOAD_LIMIT_CNT"){
					msg += "<br>엑셀 업로드는 최대 10000건 까지만 가능합니다";
				}
				else if (nullToEmpty(data.errorCd) != "" && data.errorCd == "COMMON_CODE_NOT_READ"){
					msg += "<br>" + cflineMsgArray['systemError'];   /* 시스템 오류가 발생하였습니다. */
				}
				callMsgBox('','I',msg,function(msgId, msgRst){ 
	        		if (msgRst == 'Y') {    
	        			if (nullToEmpty(data.errorCd) != "" && data.errorCd== "HEAD_CHECK_ERROR") {
	        				$('#btn_fail_excel').click();
	        			}
	        		}
				});
			} 
			
    	}
    	else if(flag == 'exceluploadToTemp') {
			
			var data = response;
			if (nullToEmpty(data.resultCd) != ""  && data.resultCd == "OK") {

				// 리턴 받은 엑셀 팡리 정보 셋팅
				//excelUploadTotalCnt = parseInt(data.excelUploadTotalCnt);
				excelUploadProcCnt = parseInt(data.excelUploadProcCnt);
				excelFileRowIdx = parseInt(data.excelFileRowIdx);
				procExcelUploadJobNo = data.excelUploadJobNo;
				//excelFileNm = data.excelFileNm;
				var excelFileUpload = data.excelFileUpload;
				
				if (excelFileUpload == "END") {
					// 조회한 목록 셋팅
					$('#'+excelFileGridId).alopexGrid("viewUpdate");
					$('#'+excelUploadGrid).alopexGrid("viewUpdate");    
					
					
					var excelFile = data.excelFile;
					var excelData = data.excelData;
					renderExcelGrid(excelFileGridId, excelFile.totalCnt, false, "B");
					
					// 현재조회된 엑셀데이터 파일키
					procExcelUploadJobNo = (excelFile != null && excelFile.list.length > 0 ? excelFile.list[0].excelUploadJobNo : null) ;
					xlsWorkObjVal = "";
									
					// 파일 목록
					$('#'+excelFileGridId).alopexGrid("dataSet", excelFile.list);
					$("#firstRowIndex").val("1");
				    $("#lastRowIndex").val(limitPage);
					
					if (nullToEmpty(excelData.list) != "") {
						xlsWorkObjVal = excelData.xlsWorkObjVal;
						// 엑셀 데이터
						renderExcelGrid(excelUploadGrid,  excelData.totalCnt, false, excelData.xlsWorkObjVal);
						$('#'+excelUploadGrid).alopexGrid("dataSet", excelData.list);						
					}
					$("#firstRow01").val("1");
					$("#lastRow01").val(limitPage);
				}
				excelUploadToTemp(excelFileUpload);
				
			} 
			else if (nullToEmpty(data.resultCd) != ""  && data.resultCd == "NG" ) {
				if($('#dialogMsg').length != 0){
	        		$('#dialogMsg').close().remove();
	     		}
				procExcelUploadJobNo = "";
				var msg = cflineMsgArray['failFileUpload'];
				if (nullToEmpty(data.errorCd) != "" && data.errorCd== "HEAD_CHECK_ERROR") {

					$("#fileName").val(data.fileName);
					$("#extensionName").val(data.extensionNames);
					$('#btn_fail_excel').show();
				}
				else if (nullToEmpty(data.errorCd) != "" && data.errorCd== "NONE_DATA") {
					msg += "<br>업로드 할 데이터가 없습니다.";
				}
				else if (nullToEmpty(data.errorCd) != "" && data.errorCd == "UPLOAD_LIMIT_CNT"){
					msg += "<br>엑셀 업로드는 최대 10000건 까지만 가능합니다";
				}
				else if (nullToEmpty(data.errorCd) != "" && data.errorCd == "COMMON_CODE_NOT_READ"){
					msg += "<br>" + cflineMsgArray['systemError'];   /* 시스템 오류가 발생하였습니다. */
				}
				callMsgBox('','I',msg,function(msgId, msgRst){ 
	        		if (msgRst == 'Y') {    
	        			if (nullToEmpty(data.errorCd) != "" && data.errorCd== "HEAD_CHECK_ERROR") {
	        				$('#btn_fail_excel').click();
	        			}
	        		}
				});
			} 			
    	}
    	else if(flag == 'searchExcelFile') {
    			
			var data = response.list;
			renderExcelGrid(excelFileGridId,  response.totalCnt, addData, "B");
			
			if(addData) {
				// 파일목록 추가
				$('#'+excelFileGridId).alopexGrid("dataAdd", data);
				addData = false;
				cflineHideProgressBody();
			} else {
				// 파일목록 셋팅
				$('#'+excelFileGridId).alopexGrid("dataSet", data);
				
				// 엑셀 데이터
				renderExcelGrid(excelUploadGrid, 0, false, "B");
				$('#'+excelUploadGrid).alopexGrid('dataEmpty');
				    				
				cflineHideProgressBody();
			}
    	}
    	else if(flag == 'searchExcelData') {
    		var data = response.list;
    		var totalCnt = 0;
    		    		
    		// 엑셀 데이터
    		if (data != undefined) {
    			renderExcelGrid(excelUploadGrid, response.totalCnt, false, (addData == true ? xlsWorkObjVal : response.xlsWorkObjVal));
    		}
			if (addData == true) {
				$('#'+excelUploadGrid).alopexGrid("dataAdd", data);
				addData = false;
				cflineHideProgressBody();
			} else {
				xlsWorkObjVal = response.xlsWorkObjVal;
				$('#'+excelUploadGrid).alopexGrid("dataSet", data);
				cflineHideProgressBody();
			}
		} 		
    	else if (flag == 'procInsertAll') {
    		cflineHideProgressBody();
        	//console.log(response);
    		var msg = "";
    		
    		// GIS FDF call 
    		if(excelUploadProcCnt >= 0 && nullToEmpty(response.resultCd) != "") {

        		var okCnt = response.okCnt;
        		okCount += okCnt;
				//console.log("total okCnt=======> " +okCnt);
        		var ngCnt = response.ngCnt;
        		ngCount += ngCnt;
				//console.log("total ngCnt=======> " +ngCnt);	
				excelUploadProcCnt = (nullToEmpty(response.excelUploadProcCnt) == "" ? excelUploadProcCnt : parseInt(response.excelUploadProcCnt) );
				//console.log("total excelUploadProcCnt=======> " + excelUploadProcCnt);					
				
    			// 수정한 기본정보 번호
    			tsdnNtwkBasNo = "";
    			// 동시에 기본과 선번정보 변경건이 둘다 전송될 필요가 없기 때문에 선번정보 변경건이 있으면 기본정보건은 전송하지 않음
    			if(nullToEmpty(response.okNtwkBasStr) != "" && nullToEmpty(response.okNtwkLnoStr) == ""){
    				tsdnNtwkBasNo = nullToEmpty(response.okNtwkBasStr);
    				//console.log("tsdnNtwkBasNo=======> " +tsdnNtwkBasNo);
    				sendToTsdnNetworkInfo(tsdnNtwkBasNo, "T", "B");
    			}
    			
    			// 수정한 선번정보 번호
				tsdnNtwkLnoNo = "";
    			if(nullToEmpty(response.okNtwkLnoStr) != ""){
    				tsdnNtwkLnoNo = nullToEmpty(response.okNtwkLnoStr);
    				//console.log("tsdnNtwkLnoNo=======> " +tsdnNtwkLnoNo);
    				sendToTsdnNetworkInfo(tsdnNtwkLnoNo, "T", "E");
    			} 
    			
    			if (response.resultCd == "OK") {
    				// 마지막이 아니면 
    	    		// 현재처리건수가 총 건수보다 적으면 계속 호출
    	    		if (excelUploadProcCnt < excelUploadTotalCnt) {
    	        		$('#btn_hd_logout').trigger("click");
    	    			tmpDataExcelUpload();

    	    			return;
    	    		}
    	    		else {
    	    			// 처리결과 표시
    	    			viewProcInsertAllResult() ;
    	    		}
    			} 
    			else {
    				viewProcInsertAllResult(response.errorCd) ;
    			}
    		}
    	}
    	// 수정
    	else if (flag == 'saveExcelToTemp') {
    		cflineHideProgressBody();
        	console.log(response);
    		
    		if (nullToEmpty(response.resultCd) == "OK") {
        		// 마지막이 아니면 
        		// 현재처리건수가 총 건수보다 적으면 계속 호출
        		if (workCntToTemp < saveDataList.length) {
            		$('#btn_logout').trigger("click");
            		makeSaveDataToTemp();
        			return;
        		}
        		else {
        			if($('#dialogMsg').length != 0){
        				$('#dialogMsg').close().remove();

            			cflineShowProgressBody();
             		}

            		cflineHideProgressBody();
        			var  resultMsg = makeArgMsg("processed", saveDataList.length)   /* ({0})건 처리 되었습니다. */
        			alertBox('I', resultMsg);
        			$("#btnSaveTmp").hide();
    				$("#btnProcInsertAll").show();
    				
    				var baseParam = {
  						  "gridId" : excelFileGridId
  						, "excelUploadJobNo": procExcelUploadJobNo
  						};
	  				var lnoParam = {
	  						  "gridId" : excelUploadGrid
	  						, "excelUploadJobNo": procExcelUploadJobNo
	  						, "frstRegUserId" : $('#currUserId').val()
	  						};
	  				fnSearchExcelInfo("file", true, baseParam);
	  				fnSearchExcelInfo("excel", true, lnoParam);
        		}
    		}
		} 	
    	// 삭제
    	else if (flag == 'deleteExcelFile') {
    		
    		cflineHideProgressBody();
    		
    		if (nullToEmpty(response.resultCd) == "OK") {

        		var  resultMsg = makeArgMsg("processed", response.fileCnt)   /* ({0})건 처리 되었습니다. */
        		alertBox('I', resultMsg);
        		$('#btnSearchPop').click();
        			
    		}
		} 	
    	// 엑셀 다운로드
    	else if (flag == 'excelDownloadNew') {
    		if(response.returnCode == '200'){ 
    			jobInstanceId  = response.resultData.jobInstanceId;
    			cflineHideProgressBody();
    			excelCreatePopForUpload(jobInstanceId);
    		}
    		else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
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
    	}
    	// 임시테이블에 삽입
    	else if (flag == 'exceluploadToTemp') {
    		if($('#dialogMsg').length != 0){
        		$('#dialogMsg').close().remove();
     		}
    		procExcelUploadJobNo = "";
        	$("#excelFile").val("");
        	$('#'+excelFileGridId).alopexGrid('dataEmpty');
        	$('#'+excelUploadGrid).alopexGrid('dataEmpty');
    		if(response.message != null && response.message != '') {
    			alertBox('I', response.message);
    		} else {
    			alertBox('I', cflineMsgArray['failFileUpload']);
    		}
    	}
    	// 엑셀  파일 업로드
    	else if (flag == 'excelUploadFile') {
    		if($('#dialogMsg').length != 0){
        		$('#dialogMsg').close().remove();
     		}
        	$("#excelFile").val("");
        	$('#'+excelFileGridId).alopexGrid('dataEmpty');
        	$('#'+excelUploadGrid).alopexGrid('dataEmpty');
    		if(response.message != null && response.message != '') {
    			alertBox('I', response.message);
    		} else {
    			alertBox('I', cflineMsgArray['failFileUpload']);
    		}
    	}
    	else if (flag == 'searchExcelFile') {
    		cflineHideProgressBody();
        	$("#excelFile").val("");
        	$('#'+excelFileGridId).alopexGrid('dataEmpty');
        	$('#'+excelUploadGrid).alopexGrid('dataEmpty');
        	alertBox('I', cflineCommMsgArray['searchFail']);
    	}
    	else if (flag == 'searchExcelData') {
    		cflineHideProgressBody();
        	$("#excelFile").val("");
        	$('#'+excelUploadGrid).alopexGrid('dataEmpty');
        	alertBox('I', cflineCommMsgArray['searchFail']);
    	}
    	// 일괄등록
    	else if (flag == 'procInsertAll') {
    		cflineHideProgressBody();
        	//console.log(response);
        	if($('#dialogMsg').length != 0){
        		$('#dialogMsg').close().remove();
     		}
        	viewProcInsertAllResult(cflineMsgArray['saveFail']) ;
			
    		return;
    	}
    	// 수정
    	else if (flag == 'saveExcelToTemp') {
    		cflineHideProgressBody();
        	//console.log(response);
        	
        	if($('#dialogMsg').length != 0){
        		$('#dialogMsg').close().remove();

        		cflineHideProgressBody();
     		}
			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			
    		return;
    	}
    	// 삭제
    	else if (flag == 'deleteExcelFile') {
    		cflineHideProgressBody();
        	//console.log(response);
    		
    		alertBox('I', cflineMsgArray['systemError']);   /* 시스템 오류가 발생하였습니다. */
    		 
    	}
    	// 엑셀 다운로드
    	else if (flag == 'excelDownloadNew') {
    		cflineHideProgressBody();
        	//console.log(response);
    		
    		alertBox('I', cflineMsgArray['systemError']);   /* 시스템 오류가 발생하였습니다. */
    		 
    	}
    	else {
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
   
    var httpRequestForSelect = function(Url, Param, Method, Flag ) {
	 	Tango.ajax({
	 		url : Url, //URL 기존 처럼 사용하시면 됩니다.
	 		data : Param, //data가 존재할 경우 주입
	 		method : Method, //HTTP Method
	 		flag : Flag
	 	}).done(function(response){successUploadCallback(response, Flag);})
		  .fail(function(response){failUploadCallback(response, Flag);});
	 }
  
});