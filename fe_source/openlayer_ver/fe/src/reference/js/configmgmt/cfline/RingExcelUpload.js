/**
 * RingExcelUpload
 * 
 * @author P095783
 * @date 2020. 10. 23.
 * @version 1.0
 */

var popNtwkTypData = [ {
	value : "004",
	text : "가입자망"
} ];
var popTopoData = [ {
	value : "035",
	text : "SMUX"
} ];

$a.page(function() {

	// 초기 진입점
	// param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(popId, popParam) {
		if (!jQuery.isEmptyObject(popParam)) {
			paramData = popParam;
		}
		// 망구분
		$('#ntwkTypCdPop').clear();
		$('#ntwkTypCdPop').setData({data : popNtwkTypData});

		// 망종류
		$('#topoSclCdPop').clear();
		$('#topoSclCdPop').setData({data : popTopoData});

		$("#selectType").hide();
		$("#lnoRadio").hide();
		$('#lnoChkYn').val("N"); // 선번정보 체크박스값 = N
		$('#lnoGubunVal').val("S"); // 선번정보 라디오버튼값 = S:구간선번

		setEventListener();
	};

	function setEventListener() {
		// 파일 선택
		$('#fileSelect').on('click', function(e) {
			var exform = document.getElementById('excelform');
			exform.reset();
			$('#excelFile').click();
		});
		
		$('#excelFile').on('change', function(e) {
			$("#textFileNm").text(this.value);
		});

		// 기본정보 체크박스 클릭
		$('#ringInfoChkYn').on('click',
			function(e) {
				if ($("input:checkbox[id='ringInfoChkYn']").is(":checked")) {
					$('#ringInfoVal').val("Y");
				} else {
					$('#ringInfoVal').val("N");
				}
			});

		// 선번정보 체크 박스 클릭
		$('#ringLnoVal').on('click', function(e) {
			if ($("input:checkbox[id='ringLnoVal']").is(":checked")) {
				$("#lnoRadio").show();
				$("#sectionLineNo").setSelected();
				$('#lnoChkYn').val("Y");
				$('#lnoGubunVal').val("S");
				$("#btn_sample_down").show();
			} else {
				$("#lnoRadio").hide();
				$("#btn_sample_down").hide();
				$('#lnoChkYn').val("Y");
				$('#lnoGubunVal').val("");
			}
		});

		// 구간선번 라디오가 체크 됐을때
		$('#sectionLineNo').on('click',function(e) {
			if (($('#lnoChkYn').val() == "Y")
					&& ($('#sectionLineNo').is(
							":checked") == true)) {
				$('#lnoGubunVal').val("S");
			}
		});

		// 업로드 클릭
		$('#btn_up_excel').on('click',function(e) {

			// 정보타입체크
			if ($('#ringInfoChkYn').is(":checked") == false
					&& $('#ringLnoVal').is(":checked") == false) {
				alertBox('W',cflineMsgArray['selectDemandPoolUpDataType']); /*업로드할 정보타입을 선택해 주세요.*/
				$('#ringInfoChkYn').focus();
				return;
			}

			// 파일체크
			if ($("#excelFile").val() == null || $("#excelFile").val() == "") {
				alertBox('W',cflineCommMsgArray['selectUploadFile']); /* 업로드할 파일을 선택해 주세요. */
				return;
			}
			
			// 파일 확장자체크
			var fileExtensionChk = $("#excelFile").val().toLowerCase();
			
			if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
				alertBox('W',cflineCommMsgArray['checkExtensionTwoType']); /* 확장자가 xlsx 혹은 xls만 가능합니다.*/
				return;
			}
			
			// 컨펌 메시지
			var msg = cflineMsgArray['excel']; /* 엑셀 */
			if ($('#ringInfoChkYn').is(":checked") == true) {
				msg += " " + cflineMsgArray['baseInformation']; /* 기본정보 */
			}
			if (($('#lnoChkYn').val() == "Y")
					&& ($('#lnoGubunVal').val() == "S")) {
				msg += " " + cflineMsgArray['sectionLineNoInfo']; /* 구간선번정보 */
			}

			callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg), function(msgId, msgRst) { 
				// '기본정보을(를)업로드  하시겠습니까?'
				if (msgRst == 'Y') { /* 업로드 하시겠습니까? */
					var form = new FormData(document.getElementById('excelform'));
	    			cflineShowProgressBody();
					httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ringexcel/excelupload',form, 'post','excelUpload');
				}
			});
		});

		// 에러파일 다운로드
		$("#btn_fail_excel").on('click',function() {
			if ($("#fileName").val() == "" || $("#extensionName").val() == "") {
				alertBox('W', cflineCommMsgArray['noExistFileForDownload']);  /* 다운로드 할 파일이 존재하지 않습니다.*/
				return false;
			} else {
				getExcelFileDown("excelUploadFailFile");
			}
		});

		// 닫기버튼클릭
		$('#btn_close').on('click',function(e) {
			resultCode = "OK";
			if ($("#fileName").val() == ""
					|| $("#extensionName").val() == "") {
				$a.close(resultCode);
			} else {
				getExcelFileDown("excelUploadFailFile");
				$a.close(resultCode);
			}
		});
	}

	function getExcelFileDown(gubunFile) {
		var $form = $('<form></form>');
			$form.attr('name', 'downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/ringexcel/exceldownload");
			$form.attr('method', 'GET');
			$form.attr('target', 'downloadIframe');
			// 인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="' + $("#fileName").val()
							+ '" /><input type="hidden" name="fileExtension" value="'
							+ $("#extensionName").val() + '" />');
			$form.append('<input type="hidden" name="type" value="' + gubunFile + '" />');
			$form.appendTo('body');
			$form.submit().remove();
	}

	/*
	 * Function Name : successExcelUploadCallback Description : 각 이벤트
	 * 성공시 처리 로직
	 * ----------------------------------------------------------------------------------------------------
	 * return :
	 */
	function successUploadCallback(response, flag) {
		var fdfLineNoStr = "";
		var fdfPathLineNoStr = "";
		var netWorkLineList = "";
		var netWorkPathList = "";	//링명 변경 api 호출용

		if (flag == "excelUpload") {
			var data = response;

			fdfLineNoStr = response.fdfLineNoStr;
			fdfPathLineNoStr = response.fdfPathLineNoStr;
			netWorkLineList = response.netWorkLineList;	//기본정보가 변경
			netWorkPathList = response.netWorkPathList;	//선번이 변경
			/*
			 * 링명 변경 api호출
			 * 림명 변경의 경우 기본정보만 수정한 데이터의 경우는 변경할 필요가 없어서
			 * 선번정보를 수정한 링에 대해서만 호출함
			 */
			if (nullToEmpty(netWorkPathList) != "" && netWorkPathList.length > 0) {
				for (var i = 0; i < netWorkPathList.length; i++) {
					var smuxRingParam = {
							 "ntwkLineNo" : netWorkPathList[i]
		        		   , "userId" : $("#userId").val()    
		        		   , "viewType" : "N" 
						   , excelDataYn : "Y"
					}
					updateSmuxRingNameByCotNm(smuxRingParam);  // common.js에 있음
				}
			}
			
			/*
			 * 최종 링명변경후 GIS에 링정보 전달한다. 
			 * 선번정보가 업로드실패되는 경우도 있기 때문에
			 * 기본정보 업로드 성공된 리스트를 기준으로 링정보 전달
			 */
			if (nullToEmpty(netWorkLineList) != "" && netWorkLineList.length > 0) {
				for (var i = 0; i < netWorkLineList.length; i++) {
					httpRequest('tango-transmission-gis-biz/transmission/cc/ringsync/syncData?ntwkLineNo=' + netWorkLineList[i] , null, 'GET', 'insertRingGisApi');
				}
			}
			
			/*
			 * 기본 및 선번정보 변경에 대한 GIS FDF 호출
			 * 선번정보가 업로드실패되는 경우도 있기 때문에
			 * 기본정보 업로드 성공된 리스트를 기준으로 링정보 전달
			 * 기본정보에서 에러가 발생하지 않아야 선번등록이 가능하기 때문에 FDF호출도 기본정보리스트로 전당 
			 */
			if (nullToEmpty(fdfLineNoStr) != "") {
				// FDF 수용내역 전송
				sendFdfUseInfo(fdfLineNoStr);
			}
			
			// 선번정보 변경에 따른 자동수정 대상 테이블 처리
			if (nullToEmpty(response.fdfPathLineNoStr) != "") {
				var fdfUsingInoPathLineNo = nullToEmpty(response.fdfPathLineNoStr);

				// 엑셀업로드로 선번정보가 수정된건 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제
				var acceptParam = {
					lineNoStr : fdfUsingInoPathLineNo,
					topoLclCd : "001",
					topoSclCd : "035",
					linePathYn : "N",
					editType : "E", // 편집
					excelDataYn : "Y",
					excelFlag : "ring",
					data : response
				}
				extractAcceptNtwkLine(acceptParam); // 수집선번 처리 건수가 있는 경우
			} else {
				//업로드성공된 데이터가 0건인 경우 자동수집선번처리건수에 대한 파악이 필요없으므로 바로 이 로직을 탐 
				cflineHideProgressBody();
				
				var msg = "";
				if (data.resultCd == "NG") {
					resultCode = "NG";
					msg = cflineCommMsgArray['existFailUploadData']; // 업로드에 실패한 데이터가 있습니다.
					if (data.errorCd == "DATA_CHECK_ERROR") {
						msg += "<br>(";
						if (nullToEmpty(data.excelOkCount) != ''
								&& data.excelOkCount != '0') {
							resultCode = "OK";
							msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount
								+ cflineCommMsgArray['singleCount'] + ", "
						}
						msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount
								+ cflineCommMsgArray['singleCount'] + ")";
					}
					if (data.errorCd == "UPLOAD_LIMIT_CNT") {
						msg = cflineMsgArray['excelRowOver']; // 엑셀 업로드는 최대 1000건 까지만 가능합니다
					}
					alertBox('W', msg);

					$("#fileName").val(data.fileNames + "." + data.extensionNames);
					$("#extensionName").val(data.extensionNames);
				} else {
					msg = cflineCommMsgArray['normallyProcessed']; // 정상적으로
																	// 처리되었습니다.
					msg += "<br>(" + cflineCommMsgArray['success']
							+ " : " + data.excelOkCount
							+ cflineCommMsgArray['singleCount'] + ")";
					alertBox('I', msg); // 정상적으로 처리되었습니다.
					resultCode = "OK";
				}
			}
		} 
	}

	// FDF사용정보 전송(링편집시 호출됨)
	function sendFdfUseInfo(fdfLineNoStr) {
		sendFdfUseInfoCommon(fdfLineNoStr, "R", "B", null);
	}

	// request 실패시.
	function failUploadCallback(response, flag) {
		if (flag == 'excelUpload') {
			cflineHideProgressBody();
			alertBox('W', '업로드중 오류가 발생하였습니다.');
		} else {
			//$a.close("Fail");
		}
	}

	var httpUploadRequest = function(surl, sdata, smethod, sflag) {
		Tango.ajax({
			url : surl, // URL 기존 처럼 사용하시면 됩니다.
			data : sdata, // data가 존재할 경우 주입
			method : smethod, // HTTP Method
			dataType : 'json',
			processData : false,
			contentType : false
		}).done(function(response) {
			successUploadCallback(response, sflag);

		}).fail(function(response) {
			failUploadCallback(response, sflag);
		})
	}

	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url : Url, // URL 기존 처럼 사용하시면 됩니다.
			data : Param, // data가 존재할 경우 주입
			method : Method, // HTTP Method
			flag : Flag
		}).done(successCallback).fail(failCallback);
	}
	
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'insertRingGisApi'){
    	}
	}
	
    function failCallback(response, status, jqxhr, flag ){
    	if(flag == 'insertRingGisApi'){
    	}
    }
});