
	$a.page(function() {
	    var resultCode = null;
	    var onDemandFlag = null;
	    var refreshFlag = false;
	    var refreshInterval = null;

	    //초기 진입점
	    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	    this.init = function(id, param) {
	    	onDemandFlag = true;
	    	if (param == null) {
	    		onDemandFlag = false;
	    	}
	    	refreshFlag = false;
	    	refreshInterval = null;
	    	setEventListener(param);
	    }

	    function demandRequestPopup(surl,sdata,smethod,sflag)
	    {
	    	Tango.ajax({
	    		url : surl,
	    		data : sdata,
	    		method : smethod
	    	}).done(function(response){successDemandCallback(response, sflag);})
	    	  .fail(function(response){failDemandCallback(response, sflag);})
	    	  //.error();
	    }

	    function setEventListener(param) {
//			$('#btn_dwn_excel').on('click', function(e) {
//				if ($('#erpTranInclude1').is(":checked") == false && $('#erpTranInclude2').is(":checked") == false) {
//					alertBox('W', "ERP전송 완료된 데이터 포함 여부를 선택해 주세요."); /* ERP전송 완료된 데이터 포함 여부를 선택해 주세요. */
//					return;
//				} else {
//					var erpTranInclude = $('#erpTranInclude1').is(":checked") == true ? $('#erpTranInclude1').val() : $('#erpTranInclude2').val();
//					$a.close(erpTranInclude);
//				}
//			});

			$('#btn_close').on('click', function(e) {
				if (onDemandFlag == false) {
					return;
				}
				if (refreshFlag == true) {
					/* "엑셀 파일을 생성중 입니다.<br>잠시만 기다려주시기 바랍니다." */
    				alertBox('I', "엑셀 파일을 생성중 입니다.<br>잠시만 기다려주시기 바랍니다.");
				} else {
					$a.close("0");
				}
			});

			$('#excelDownloadByBatch').on('click', function(e) {
				if (onDemandFlag == false) {
					return;
				}
				if ($('#erpTranInclude1').is(":checked") == false && $('#erpTranInclude2').is(":checked") == false) {
					alertBox('W', "ERP전송 완료된 데이터 포함 여부를 선택해 주세요."); /* ERP전송 완료된 데이터 포함 여부를 선택해 주세요. */
					return;
				}

				var data = $('#erpTranInclude1').is(":checked") == true ? $('#erpTranInclude1').val() : $('#erpTranInclude2').val();
				if (data == "Y" || data == "N" ) {
                	bodyProgress();
            		var dataParam =  param;
                	dataParam.firstRowIndex = 1;
                	dataParam.lastRowIndex = 100000;

                	dataParam.fileName = "프론트홀설계대상관리";/* "Access망수요정보"; */
                	dataParam.fileDataType = "1";  // 1:장비선로;  2:건물
                	dataParam.erpTranInclude = data;
                	dataParam.fileExtension = "xlsx";

                	demandRequestPopup('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/exceldownloadbatch', dataParam, 'GET', 'excelDownloadbatch');
                	$("#excelDownloadByBatch").css("display", "none");
	        		$("#excelDownloading").css("display", "");
            	}
			});

			$("#excelDownloading").on('click', function(e) {
	    		bodyProgress();
	        	var jobInstanceId = $("#excelFileId").val();
	        	demandRequestPopup('tango-transmission-biz/transmisson/demandmgmt/accessdemandexcel/excelcreatebybatchstatus/'+jobInstanceId, null, 'GET', 'excelDownloadbybatchStatus');
	        });

	        $("#excelDownloadComplate").on('click', function(e) {
	        	var jobInstanceId = $("#excelFileId").val();
	        	var excelFileUrl = '/tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/exceldownloadbybatch';
	        	var $form=$( "<form></form>" );
	    		$form.attr( "name", "downloadForm" );
	    		$form.attr( "action", excelFileUrl + "?jobInstanceId=" + jobInstanceId );
	    		$form.attr( "method", "GET" );
	    		$form.attr( "target", "downloadIframe" );
	    		$form.append(Tango.getFormRemote());
	    		// jobInstanceId를 조회 조건으로 사용
	    		$form.append( "<input type='hidden' name='jobInstanceId' value='" + jobInstanceId + "' />" );
	    		$form.appendTo('body')
	    		$form.submit().remove();

	    		$("#excelDownloading").css("display", "none");
	    		$("#excelDownloadComplate").css("display", "none");
	    		$("#excelDownloadByBatch").css("display", "");

	    		bodyProgressRemove();
	        });
	    }

	  //request 성공시
	    function successDemandCallback( response, flag){

	    	if(flag == 'excelDownloadbatch') {
	    		bodyProgressRemove();

	    		if(response.jobInstanceId != "") {
	    			$("#excelFileId").val(response.jobInstanceId);

	        		$("#excelDownloadByBatch").css("display", "none");
	        		$("#excelDownloading").css("display", "");
	        		/* 엑셀 다운로드가 실행되었습니다.<br>해당 페이지를 새로고침 하거나<br>다른 페이지로 넘어갈경우<br>다운받을수 없습니다.<br>EXCEL 생성중 버튼이 사라질때까지 기다려주시기 바랍니다. */
	        		callMsgBox('', 'I', "엑셀 다운로드가 실행되었습니다.<br>해당 페이지를 새로고침 하거나<br>다른 페이지로 넘어갈경우<br>다운받을수 없습니다.<br>EXCEL 생성중 버튼이 사라질때까지 기다려주시기 바랍니다.", function() {
		        		refreshFlag = true;
		        		refreshInterval = setInterval(function() { excelDownloadbybatchStatusRefresh(); }, 10000);
		        		bodyProgress();
	        		});
	    		}
	    		else {
	    			/* 엑셀 파일 생성 하는데 실패 하였습니다. */
	    			alertBox('W', "엑셀 파일 생성 하는데 실패 하였습니다.");
	    		}
	    	} else if(flag == 'excelDownloadbybatchStatus') {
	    		bodyProgressRemove();
	    		if(response.Result == "IdIsNull") {
	    			/* 엑셀 다운로드 상태를 확인할 수 없습니다. */
	    			alertBox('W', "엑셀 다운로드 상태를 확인할 수 없습니다.");
	    			$("#excelDownloading").css("display", "none");
		    		$("#excelDownloadComplate").css("display", "none");
		    		$("#excelDownloadByBatch").css("display", "");
		    		refreshFlag = false;
		    		clearInterval(refreshInterval);
	    		}
	    		else if(response.Result == "SearchFail") {
	    			/* "다운로드 할 파일이 존재 하지 않습니다." */
	    			alertBox('W', "다운로드 할 파일이 존재 하지 않습니다.");
	    			$("#excelDownloading").css("display", "none");
		    		$("#excelDownloadComplate").css("display", "none");
		    		$("#excelDownloadByBatch").css("display", "");
		    		refreshFlag = false;
		    		clearInterval(refreshInterval);
	    		}
	    		else {
	    			if(response.jobStatus == "ok") {
	    				refreshFlag = false;
	    	    		clearInterval(refreshInterval);
	    	    		/* '엑셀 파일이 생성 되었습니다.<br>확인버튼을 누르면 자동 다운로드 됩니다.' */
	    	    		callMsgBox('', 'I', "엑셀 파일이 생성 되었습니다.<br>확인버튼을 누르면 자동 다운로드 됩니다.", function(msgId, msgRst){
	    	        		if (msgRst == 'Y') {
	    	        			$("#excelDownloading").css("display", "none");
	    	    	    		$("#excelDownloadComplate").css("display", "");
	    	    	    		$("#excelDownloadByBatch").css("display", "none");
	    	    	    		bodyProgress();
	    	    	    		$("#excelDownloadComplate").click();
	    	        		}
	    	    		});
	    			}
	    			else if(response.jobStatus =="running") {

	    	    		refreshFlag = false;
			    		clearInterval(refreshInterval);
	    				/* "엑셀 파일을 생성중 입니다.<br>잠시만 기다려주시기 바랍니다." */
	    				callMsgBox('', 'I',  "엑셀 파일을 생성중 입니다.<br>잠시만 기다려주시기 바랍니다.", function() {
		    				refreshFlag = true;
			        		refreshInterval = setInterval(function() { excelDownloadbybatchStatusRefresh(); }, 10000);
	    				});

	    				//setTimeout(function(){ $("excelDownloading").click(); } , 1000*5 );
	    			}
	    			else if(response.jobStatus =="error") {
	    				/* 엑셀 파일 생성 하는데 실패 하였습니다. */
		    			alertBox('W', "엑셀 파일 생성 하는데 실패 하였습니다.");

	    				refreshFlag = false;
	    				clearInterval(refreshInterval);

	    				$("#excelDownloading").css("display", "none");
	    	    		$("#excelDownloadComplate").css("display", "none");
	    	    		$("#excelDownloadByBatch").css("display", "");
	    			}
	    			else {

	    			}
	    		}
	    	}
	    	else if(flag == 'excelDownloadbybatchStatusRefresh') {
	    		bodyProgressRemove();
	    		if(response.Result == "IdIsNull") {
	    			refreshFlag = false;
		    		clearInterval(refreshInterval);
	    			/* 엑셀 다운로드 상태를 확인할 수 없습니다. */
	    			callMsgBox('', 'W', '엑셀 다운로드 상태를 확인할 수 없습니다.', function() {
	    				refreshFlag = true;
		        		refreshInterval = setInterval(function() { excelDownloadbybatchStatusRefresh(); }, 10000);
    				});
	    		}
	    		else if(response.Result == "SearchFail") {
	    			/* "다운로드 할 파일이 존재 하지 않습니다." */
	    			alertBox('W', '다운로드 할 파일이 존재 하지 않습니다.');
	    			$("#excelDownloading").css("display", "none");
		    		$("#excelDownloadComplate").css("display", "none");
		    		$("#excelDownloadByBatch").css("display", "");
		    		refreshFlag = false;
		    		clearInterval(refreshInterval);
	    		}
	    		else if(response.Result == "Success"){
	    			if(response.jobStatus == "ok") {
	    				refreshFlag = false;
	    	    		clearInterval(refreshInterval);

	    	    		/* '엑셀 파일이 생성 되었습니다.<br>확인버튼을 누르면 자동 다운로드 됩니다.' */
	    	    		callMsgBox('', 'I', '엑셀 파일이 생성 되었습니다.<br>확인버튼을 누르면 자동 다운로드 됩니다.', function(msgId, msgRst){
	    	        		if (msgRst == 'Y') {
	    	        			$("#excelDownloading").css("display", "none");
	    	    	    		$("#excelDownloadComplate").css("display", "");
	    	    	    		$("#excelDownloadByBatch").css("display", "none");
	    	    	    		bodyProgress();
	    	    	    		$("#excelDownloadComplate").click();
	    	        		}
	    	    		});
	    			}
	    			else if(response.jobStatus =="running") {
	    	    		bodyProgress();
	    			}
	    			else if(response.jobStatus =="error") {
	    				refreshFlag = false;
	    				clearInterval(refreshInterval);

	    				/* 엑셀 파일 생성 하는데 실패 하였습니다. */
		    			alertBox('W', "엑셀 파일 생성 하는데 실패 하였습니다.");

	    				$("#excelDownloading").css("display", "none");
	    	    		$("#excelDownloadComplate").css("display", "none");
	    	    		$("#excelDownloadByBatch").css("display", "");
	    			}
	    			else {

	    			}
	    		}
	    		else {
	    			/* 엑셀 파일 생성 하는데 실패 하였습니다. */
	    			alertBox('W', "엑셀 파일 생성 하는데 실패 하였습니다.");

					refreshFlag = false;
					clearInterval(refreshInterval);

					$("#excelDownloading").css("display", "none");
		    		$("#excelDownloadComplate").css("display", "none");
		    		$("#excelDownloadByBatch").css("display", "");
	    		}
	    	}
	    }

	    //request 실패시.
	    function failDemandCallback(response, flag){
	    	bodyProgressRemove();
	    	// 엑셀다운로드
	    	if(flag == 'excelDownload') {
	    		bodyProgressRemove();
	    		alertBox('W', response.message);
	    		return;
	    	}

	    	if(refreshInterval != null) {
	    		clearInterval(refreshInterval);
	    	}
	    	var resultmsg = "";
	    	if (response.message != undefined) {
	    		resultmsg = response.message;
	    	}
			alertBox('W',  resultmsg);
			return;
	    }

	    function bodyProgress() {
	    	$('body').progress();
	    }

	    function bodyProgressRemove() {
	    	$('body').progress().remove();
	    }

	    function excelDownloadbybatchStatusRefresh() {
	    	bodyProgressRemove();
    		bodyProgress();
	    	if(refreshFlag) {
	    		var jobInstanceId = $("#excelFileId").val();

	    		if(jobInstanceId != "") {
	    			demandRequestPopup('tango-transmission-biz/transmisson/demandmgmt/accessdemandexcel/excelcreatebybatchstatus/'+jobInstanceId, null, 'GET', 'excelDownloadbybatchStatusRefresh');
	    		}
	    	}
	    	else {
	    		if(refreshInterval != null) {
	    			clearInterval(refreshInterval);
	    		}
	    	}
	    }
	});