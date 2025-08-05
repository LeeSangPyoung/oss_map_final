$a.page(function() {
	var paramData = '';
	var gridId = 'gridData';
	this.init = function(id, param) {
		//paramData = {sisulCd:'111111111',floorId:'1876'};
		paramData = param;
		initGrid();
		setGrid(paramData);
		setEventListener();
    };
 // Grid 초기화
    function initGrid() {

    	//그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 200,
        	autoColumnIndex: true,
    		autoResize: true,
    		paging : {
				pagerTotal: false,
			},
    		columnMapping: [{
				key : 'bgName', align:'center',
				title : '사진명',
				width: '200'
			}, {
				key : 'regDate', align : 'center',
				title : '등록일',
				width : '50'
			},{
				key : 'regId', align : 'center',
				title : '등록자',
				width : '50'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('.alopexgrid-pager').remove();
    };
    // request 성공시
    function successCallback(response, status, jqxhr, flag, responseJSON){
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.realPicList);
    	}

    	if(flag == 'uploadFile'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    				if(msgRst == 'Y'){
    					a.close(response);
    				}
    			});
    		} else if( response.Result == "Fail"){
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    		//setGrid(paramData);

    	}

    	if(flag == 'deleteFile'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    				if(msgRst == 'Y'){
    					$('#'+gridId).alopexGrid("rowSelect",{_index:{data:0}},true);
    					if(msgRst == 'Y'){
        					a.close(response);
        				}
    				}
    			});
    		} else if( response.Result == "Fail"){
    			callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
    		}
    		//setGrid(paramData);
    	}


    }

    // request 실패시.
    function failCallback(response, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }


    // event 등록
    function setEventListener() {

    	// 닫기
        $('#cnclBtn').on('click', function(e) {
        	$a.close();
        });

        $('#btnUpload').on('click', function(e) {
    		var realPicForm  = $('#realPicFormPopup')[0];
    		realPicForm.reset();
    		$('#uploadFile').click();
        });

        $('#uploadFile').on('change',function(e) {

        	var file = e.target;
        	var fileList = file.files;

    		var reader = new FileReader();
    		reader.readAsDataURL(fileList[0]);

    		reader.onload = function(){
    			$('#realPicImg').prop('src',reader.result);
    		}
    		$('#picName').val(fileList[0].name);
    		//img.css({top: '2px', width: '155px', height: '129px'});
        	//showRealPic(e);
        });

        $('#'+gridId).on('dataSelect', function(e) {
        	var data = AlopexGrid.parseEvent(e).datalist[0];
        	$('#realPicImg').prop('src','/tango-transmission-biz/transmisson/configmgmt/upsdmgmt/viewImage?img='+data.bgId);
        	$('#picName').val(data.bgName);
        	$('#uploadFile').val('');
        	//img.css({top: '2px', width: '155px', height: '129px'});
        });

        $('#regBtn').on('click', function(e) {
        	var fileChk = $("#uploadFile").val();
    		if (fileChk == null || fileChk == "") {
				alertBox('W', "업로드할 파일을 선택해 주세요");
				return;
			}
    		/*
    		var fileExtensionChk = fileChk.toLowerCase();
			if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
				alertBox('W', "확장자가 xlsx혹은 xls만 가능합니다.");
				return;
			}
			*/
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			//저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	$('#sisulCd').val(paramData.sisulCd);
 		        	$('#floorId').val(paramData.floorId);
 		        	//$('#sisulCd').val(paramData.sisulCd);
 		        	//$('#floorId').val(paramData.floorId);

 		        	var form = $('#realPicFormPopup')[0];
 		        	var data = new FormData(form);

 		        	httpRequestUpload('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/realPicFileUpload', data, 'post', 'uploadFile');
 		        }
		     });
        });

        //삭제
        $('#delBtn').on('click', function(e) {
        	var data = $('#'+gridId).alopexGrid("dataGet", {_state: { selected: true}})[0]
        	var param = JSON.stringify(AlopexGrid.trimData(data));
        	if(data == null || data == ""){
        		alertBox('W', "삭제할 파일을 선택해 주세요");
				return;
        	}
        	callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
        		//저장한다고 하였을 경우
        		if (msgRst == 'Y') {
        			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRealPicFile', param, 'post', 'deleteFile');
        		}
        	});
        });
	};



	function setGrid(param){
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRealPic', param, 'GET', 'search')
	}

	var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

	var httpRequestUpload = function(url,data,method,flag) {
    	Tango.ajax({
    		url : url,
    		data : data,
    		method : method,
	    	dataType:'json',
	    	cache: false,
	    	contentType:false,
            processData:false,
            flag : flag
    	}).done(successCallback)
  	  .fail(failCallback)
	}

});