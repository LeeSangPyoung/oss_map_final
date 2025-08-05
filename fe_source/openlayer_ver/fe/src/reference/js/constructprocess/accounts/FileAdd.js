/**
 * FileAdd.js
 *
 * @author P096293
 * @date 2016. 9. 19. 오전 17:30:03
 * @version 1.0
 */
var fileAdd = $a.page(function() {
	var fileKey = '';
	
	var m = {
		button : {
			proc : function (number){
				switch(number){
				default : return $('#btnFile'); break;
				case 1 : return $('#btnConfirm'); break;
				case 2 : return $('#btnClose'); break;
				}
			}
		}
	}
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		fileKey = param.fileKey;
        setEventListener();
    }
    
    var setEventListener = function () {
    	m.button.proc(0).on('click', function (){
    		$('#fileAdd').trigger('click');
    	});
    	
    	$('#fileAdd').on('change',function(e){
    		fileAddChange($(this).val());
		});
    	
    	m.button.proc(1).on('click', function (){
    		console.log(fileKey)
    		if ('' != fileKey) {
    			// 업로드 파일 단건 삭제
    			model['delete']({
    				url : 'tango-common-business-biz/dext/files/'+ fileKey, 
    				data : null ,
    				flag : 'fileDel'}).done(successCallback).fail(failCallback);
    		}
    		
    		if ('' == $('input[name=fileNm]').val()) {
    			callMsgBox('submitConfirm','C', msgArray['selectUploadFile'], btnMsgCallback); 
    			return;
    		}
    		fileUpload();
    	});
    	
    	m.button.proc(2).on('click', function (){
    		$a.close();
    	});
	}
	
	var fileAddChange = function (fileAddNm){
		var str = fileAddNm.toString();
		var fileNm = str.split("\\");
		$('#fileNm').val(fileNm[fileNm.length-1]);
	}
	
	var fileUpload = function (){
		DEXT5UPLOAD.ResetUpload("dext5upload");		
		var uploadFile = document.getElementById("fileAdd");
		var fileVal = $('input[name=fileAdd]').val();
		
		if ('' == fileVal) {
			//파일없음
		} else {
			//파일있음
			DEXT5UPLOAD.AddLocalFileObject(uploadFile, "1", "dext5upload"); // 우선 저장
			DEXT5UPLOAD.Transfer("dext5upload");
		}
	}
	
	//업로드 생성여부
	this.DEXT5UPLOAD_OnCreationComplete = function (){
		//console.log('업로드 생성');
	}
	
	//업로드 경로지정
	this.DEXT5UPLOAD_OnTransfer_Start = function (uploadID){
		//console.log('업로드 경로지정');
		DEXT5UPLOAD.AddFormData("customPath", "tango-t", uploadID)
	}
	
	//업로드 성공
	this.DEXT5UPLOAD_OnTransfer_Complete = function (uploadID){
		//신규 업로드된 파일
		var jsonNew = DEXT5UPLOAD.GetNewUploadListForJson(uploadID);
        var textNew = DEXT5UPLOAD.GetNewUploadListForText(uploadID);

        // 삭제된 파일
        var textDel = DEXT5UPLOAD.GetDeleteListForText(uploadID);

        // 전체결과
        var jsonAll = DEXT5UPLOAD.GetAllFileListForJson(uploadID);
        //console.log('업로드 완료 : ' + JSON.stringify(jsonAll));
        
        $a.close(jsonAll);
	}
	
	//업로드 실패
	this.DEXT5UPLOAD_OnError = function (uploadID, code, message, uploadedFileListObj){
		//console.log('업로드 코드 : ' + code + ' / 업로드 메세지: '+ message);
	}
	
	var btnMsgCallback = function (){
	}
	
	var successCallback = function (response, status, xhr, falg) {
		console.log('파일 정상 삭제');
	}
	
	var failCallback = function (response, flag){
		console.log(response);
	}
	 
	var model = Tango.ajax.init({});
});