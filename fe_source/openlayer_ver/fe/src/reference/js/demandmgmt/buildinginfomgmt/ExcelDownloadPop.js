/**
 * ExcelDownloadPop
 *
 * @author P095783
 * @date 2017. 01. 12. 
 * @version 1.0
 */
$a.page(function() {
    
	var jobInstanceId = null;
	var jobStatus = null;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	bodyProgress();
    	if (param.jobInstanceId !="" && param.jobInstanceId != null){
    		jobInstanceId = param.jobInstanceId;
        	excelFileStatus();        	
    	}else {
    		alertBox('W', buildingInfoMsgArray['contactWarning']); /*잘못된 경로로 접근하셨습니다.*/
    		$a.close();
    	}
        setEventListener();          
    };    
    
    function setEventListener() {
    	$('#popBtnclose').on('click', function(e) {
			if (jobStatus == "running"){
				alertBox('W', buildingInfoMsgArray['excelDownNotice4']); /* 엑셀 파일을 생성중입니다 완료후 창을 닫아주세요. */
			} else {
				$a.close();
			}
		});
	};
	
	// 생성상태 확인
    function excelFileStatus(){
 		httpDownloadRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreatebybatchstatus/'+jobInstanceId, null, 'GET', 'excelDownloadbybatchStatusRefresh');
    }
	
    // 파일다운로드
	function funExcelDownload(){
 		// Excel File Download URL
		bodyProgressRemove();
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
	}

	//request 성공시
    function successDownloadCallback(response, flag){  	
    	if (flag == 'excelDownloadbybatchStatusRefresh') {
    		if(response.Result == "IdIsNull") {
    			alertBox('W',"엑셀 다운로드 상태를 확인할 Key 가 없습니다.");
    		}
    		else if(response.Result == "SearchFail") {
    			alertBox('W',"엑셀 다운로드 할 파일이 존재 하지 않습니다.");
    		}
    		else if(response.Result == "Success"){
    			if(response.jobStatus == "ok") {
    				bodyProgressRemove();
    				$('#statusMsg').text(buildingInfoMsgArray['excelDownNotice2']); /* 엑셀파일을 다운로드 완료 했습니다. */
					$('#noticeMsg').text("-"+buildingInfoMsgArray['excelDownNotice3']); /* 다운로드한 파일의 위치는 C:/Users/(사용자계정)/Donwlaods 폴더에 저장 되었습니다. */
					bodyProgress();
    				funExcelDownload();
    			}
    			else if(response.jobStatus =="running") {
    				setTimeout(function(){ excelFileStatus(); } , 1000*5 );
    			}
    			else if(response.jobStatus =="error") {
    				bodyProgressRemove();
    				alertBox('W',"엑셀 파일을 생성하는데 실패 하였습니다.");
    			}
    			else {
    				bodyProgressRemove();
    			}
			}
    	}
    }
    //request 실패시.
    function failDownloadCallback(response, flag){
    }

    var httpDownloadRequest = function(surl, sdata, smethod, sflag ) {
    	Tango.ajax({
    		url : surl, //URL 기존 처럼 사용하시면 됩니다.
    		data : sdata, //data가 존재할 경우 주입
    		method : smethod, //HTTP Method
	    	dataType:'json',
            processData:false,
            contentType:false
    	}).done(function(response){successDownloadCallback(response, sflag);})
  	    .fail(function(response){failDownloadCallback(response, sflag);})
    }
   
});