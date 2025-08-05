/**
 * ServiceLineMtsoUpdatePop.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var gridFile = 'resultFileListGrid';	
// 첨부파일 삭제용
var maxFileCnt = 0;
var tempFileSrno = 0; // 전송전 파일 신규 목록
var delFileList = [];
var fileUladSrno = "";
var uladFileNm = "";
var svlnNo = "";
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.	
	var paramData = null;
	
    this.init = function(popId, popParam) {
    	//alert(popId);
    	if (!jQuery.isEmptyObject(popParam)) {
    		paramData = popParam;

    		fileUladSrno = paramData.fileUladSrno;
    		uladFileNm = paramData.uladFileNm;
    		svlnNo = paramData.svlnNo;
    		$('#svlnNoPop').setData({svlnNo : paramData.svlnNo  });
    	}  

		if(nullToEmpty(svlnNo) == ""){
			//alert("잘못 전달된 값입니다.");
			alertBox('W', cflineMsgArray['invalidParamValue']);  /*"잘못 전달된 값입니다."*/
			$a.close();
		}    	
    	
    	delFileList= [];
    	maxFileCnt = 0;
    	tempFileSrno = 0;
    	
        setEventListener();   
        initPopGrid();
        setPopGridData();
        

    };
    
    //Grid 초기화
    function initPopGrid() {

		 
		 var mappingFile = [
             { selectorColumn : true, width : '50px' }
           , { key : 'check'        , title : cflineMsgArray['sequence'] /*순번*/, align:'center', width:'60px', numberingColumn : true  }
           , { key : 'fileUladSrno' , title : cflineMsgArray['tempFileId'] /*파일ID*/, align : 'left', width : '80px', hidden: true}
           , { key : 'svlnNo'       , title : cflineMsgArray['serviceLineNumber'] /*서비스회선번호*/, align : 'left', width : '80px' , hidden: true}
           , { key : 'uladFileNm'   , title : cflineMsgArray['fileName'] /*파일명*/, align : 'left', width : '350px'}
           , { key : 'tempFileNo'   , title : cflineMsgArray['tempFileId'] /*임시파일ID*/, align : 'left', width : '80px' , hidden: true}
           ];
		 
		 //그리드 생성
       $('#'+gridFile).alopexGrid({
		 	autoColumnIndex : true,
		 	columnMapping : mappingFile,
		 	disableTextSelection : true,
		     cellSelectable : false,
		     rowClickSelect : true,
		     rowSingleSelect : false,
		     rowInlineEdit : false,
		     numberingColumnFromZero : false,
	         pager : false,
		     height : 200
		 });
    };
    
    function setPopGridData(){
		if(nullToEmpty(fileUladSrno) != ""){
			var fileDataList = [];
			fileDataList.push({'fileUladSrno':fileUladSrno,'uladFileNm':uladFileNm,'svlnNo':$('#svlnNoPop').val(),'tempFileNo':''});
			
			$('#'+gridFile).alopexGrid("dataSet", fileDataList);
		} 
    };
    
    function setEventListener() { 	

        $('#btnPopSave').on('click', function(e) {

//        	if (confirm("저장하시겠습니까?")) {
//        		// 파일저장 api 호출
//        		// 데이터 추가가 있는경우
//        	    DEXT5UPLOAD.Transfer("dext5upload"); // 파일전송
//        	    // 추가가 없는경우
//        	};     
        	
        	/*"저장하시겠습니까?"*/
        	callMsgBox('','C', cflineMsgArray['save'], function(msgId, msgRst){  
        		if (msgRst == 'Y') {
    	    		// 파일저장 api 호출
        			var uploadFile = document.getElementById("fileAdd");
    	    		// 데이터 추가가 있는경우
        			DEXT5UPLOAD.AddLocalFileObject(uploadFile, "1", "dext5upload"); // 우선 저장
    	    		// 데이터 추가가 있는경우
        			DEXT5UPLOAD.Transfer("dext5upload"); // 파일전송
    	    	    // 추가가 없는경우
        		} 
        	});        	
        });    	
    	

        /*******************************
         *  파일 그리드 이벤트
         *******************************/ 
        // 파일 데이터셋후
        $('#'+gridFile).on('dataSetEnd', function(e) { 
        	var length =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") ).length; 
    		maxFileCnt = length;
        });  
        // 파일 업로드 다운로드
        // 파일추가
        $('#btn_add_file').on('click', function(e) {
        	var dataList = $('#'+gridFile).alopexGrid("dataGet");	
    		var tmpFileCnt = 0;
    		for(i=0;i<dataList.length;i++){
//    			console.log("dataList.fileUladSrno==" + dataList.fileUladSrno);
    			if(nullToEmpty(dataList.fileUladSrno)==""){
    				tmpFileCnt++;
    			}
    		}
//			console.log("tmpFileCnt==" + tmpFileCnt);
        	if(dataList.length == 0 || tmpFileCnt<1){
        		$("#fileAdd").click();
        	}else{
        		alertBox('W', cflineMsgArray['attachFileOnlyOne']);  /*"첨부파일은 서비스회선당 1개만 첨부 가능합니다."*/
        	}
        });

        // 파일삭제
        $('#btn_remove_file').on('click', function(e) {

//        	if (procStFlag != "E") {
//        		return;
//        	}
        	var dataList = $('#'+gridFile).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		//alert("선택된 데이터가 없습니다.\n삭제할 데이터를 선택해 주세요.");
        		alertBox('W', cflineMsgArray['deleteObjectCheck']);  /*"삭제할 대상을 선택하세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		var rowIndex = data._index.data;
        		$('#'+gridFile).alopexGrid("dataDelete", {_index : { data:rowIndex }});

        		//alert("maxFileCnt : " + maxFileCnt + " rowIndex : " + rowIndex);
        		if (maxFileCnt > 0) {
        			rowIndex = rowIndex - (maxFileCnt);
        		}
        		if (nullToEmpty(data.fileUladSrno) == "" ) {
                    DEXT5UPLOAD.SetSelectItem(rowIndex, '1', 'dext5upload');
        		} else {
        			maxFileCnt = maxFileCnt-1;
        			delFileList.push(data.fileUladSrno);
        		}
        	}  
        	
        	DEXT5UPLOAD.DeleteSelectedFile("dext5upload");
        });
        
       // (파일다운로드)
        $('#'+gridFile).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
//			console.log("############### gridFile() click ###################");
//			console.log(data);
        	if (data == null) {
        		return false;
        	}
        	// 
        	if (object.mapping.columnIndex == 1 || object.mapping.columnIndex == 4) {
            	if (nullToEmpty(data.fileUladSrno) == "") {
            		//alert("다운로드할 파일이 없습니다.");
            		return false;
            	}
        		if ( data._state.focused) {
        			var fileUladSrno = data.fileUladSrno; // responseCustomValue 값이 저장되어 있음
        			
        			var sflag = {
  	    				  jobTp : 'fileDownLoad'
	  	    		};
        			attachFileRequest('tango-common-business-biz/dext/files/'+ fileUladSrno
	  	    				           , null
	  	    				           , 'GET'
	  	    				           , sflag);	
        		}
        	}
      	});    	
	};
	
});



function saveAttachFileInfo() {
	// 데이터 편집
	var dataParam =  $("#saveAttachFilePopForm").getData();     	

	// 파일
	var fileInsertList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
	var fileDeleteList = AlopexGrid.trimData ( $('#'+gridFile).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
	
		
	dataParam.gridData = { 
		    fileInsertList : fileInsertList
		    , fileDeleteList : fileDeleteList
	};
	
	var sflag = {
			  jobTp : 'saveAttachFilelInfo'   // 작업종류
	};
//	console.log("############### saveAttachFileInfo() dataParam ###################");
//	console.log(dataParam);
	attachFileRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/saveAttachFileInfo', dataParam, 'POST', sflag);
}

/**
 * 
 * @param surl
 * @param sdata
 * @param smethod
 * @param sflag
 */
function attachFileRequest(surl,sdata,smethod,sflag)
{
	Tango.ajax({
		url : surl,
		data : sdata,
		method : smethod
	}).done(function(response){successAttachFileCallback(response, sflag);})
	  .fail(function(response){failAttachFileCallback(response, sflag);})
	  //.error();
}
/**
 * successAttachFileCallback
 * @param response
 * @param flag
 */
function successAttachFileCallback(response, flag){
	// 저장
	//console.log(response);
	if (flag.jobTp == "saveAttachFilelInfo") {
		if (response.result.code == "OK") {
			//alert(delFileList.length );
			if (delFileList.length > 0) {
				// 업로드 파일 다중 삭제
				var sflag = {
	    				  jobTp : 'fileDel'
	    		};
				attachFileRequest('tango-common-business-biz/dext/files/group?method=delete' , delFileList , 'POST'  , sflag);    	    		
			} else {
    			//alert("저장되었습니다.");
				alertBox('I', cflineMsgArray['saveSuccess']); /*"저장을 완료 하였습니다."*/
        		$a.close(true);
			}
		}  		
	} else if (flag.jobTp== "fileDownLoad") {  // 파일 download
		$('#editorResult').text('업로드 파일조회결과 : ' + JSON.stringify(response));
		
		/*
		DEXT5UPLOAD.SetSelectItem
		itemIndex  -1 : appendMode가 0이면 전체 해제, appendMode가 1이면 전체 선택
		           -1이 아닌 0이상의 숫자 : DEXT5 Upload 영역에 있는 파일의 0부터 시작되는 순서 값
		appendMode  0 : ItemIndex가 -1면 전체 해제, ItemIndex가 -1 이외의 숫자이면 전체 해제 후 ItemIndex 파일 선택
		            1 : ItemIndex가 -1면 전체 선택, ItemIndex가 -1 이외의 숫자이면 기존 체크상태 유지 하면서 ItemIndex 파일 선택
		uploadID  설정하는 업로드의 id값을 의미합니다.
		*/
		//DEXT5UPLOAD.SetSelectItem('1', '0', 'dext5download');
		DEXT5UPLOAD.ResetUpload("dext5download"); // dext5download 초기화 (삭제 후 추가로 하려했으나 삭제시 alert 호출로 인해 초기화로 변경)

		//5번째 파라미터(CustomValue)는 받드시 업로드시 리턴된 responseCustomValue값을 입력
		//파일 경로는 반드시 전체 경로를 입력하셔야 다운이 가능
		DEXT5UPLOAD.AddUploadedFile(response.fileUladSrno,response.uladFileNm,response.uladFilePathNm, response.uladFileSz,response.fileUladSrno,"dext5download");

		//DEXT5UPLOAD.DownloadFile("dext5download"); //개별파일
		DEXT5UPLOAD.DownloadAllFile("dext5download"); //모든파일
	} else if (flag.jobTp== "fileDel") {// 파일정보 셋팅 fileInfo
		//alert("저장되었습니다.");
		alertBox('I', cflineMsgArray['saveSuccess']); /*"저장을 완료 하였습니다."*/
		$a.close(true);
	}
}

/*
 * Function Name : failAttachFileCallback
 * Description   : 각 이벤트 실패시 처리 로직
 * ----------------------------------------------------------------------------------------------------
 * return        :  
 */
function failAttachFileCallback(response, flag){
	/*alert('실패');*/
	//console.log(response);
	if (flag.jobTp== "fileDownLoad") {    
		alertBox('I', response.message);
	} else if (flag.jobTp== "fileDel") {    
    	var length =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") ).length; 
		maxFileCnt = length;
	} else {
		//alertBox('I', response.message);
		return;
	}
}

//////////////////////////////////////////////////////////
//  첨부파일
//////////////////////////////////////////////////////////

/*
* Function Name : fillAddChange
* Description   : 파일목록에추가
* ----------------------------------------------------------------------------------------------------
* ----------------------------------------------------------------------------------------------------
* return        : 
*/
function fillAddChange(fileAddNm){
	// GRID에 파일추가
	
	var dataList =  AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") );
	var fileExsitYn = false;
	for (var i = 0; i < dataList.length; i++) {
		var fileNm = dataList[i].uladFileNm;
		if (fileNm == fileAddNm) {
			fileExsitYn = true;
		}
	}
	
	if (fileExsitYn == false) {
		//console.log(dataList);
		tempFileSrno = tempFileSrno+1;
		//console.log(tempFileSrno);
		var tmpSvlnNo = $('#svlnNoPop').val();
		var initRowData = [{"fileUladSrno" : "", "tempFileNo" : tempFileSrno+"", "uladFileNm" : fileAddNm, "svlnNo" : tmpSvlnNo}];
		$('#'+gridFile).alopexGrid("dataAdd", initRowData);
		/*
		 * >> GRID 추가완료와 동시에 업로드
		 * ---------------------------------------------------------------------------------
		 * AddLocalFileObject(fileObject, fileMarkValue, uploadId)
		 * File 태그와 업로드 연동이 필요한 경우 파일을 추가 하고 전송
		 * ---------------------------------------------------------------------------------
		 * fileObject    : 첨부할 파일태그
		 * fileMarkValue : 첨부하는 파일의 mark 값이 필요한 경우 값
		 *                 전송 완료 후 각 파일의 입력하신 mark 값이 리턴
		 * uploadID      : 첨부하려는 업로드의 id값
		 */
		var tdpFile = document.getElementById("fileAdd");
		DEXT5UPLOAD.AddLocalFileObject(tdpFile, tempFileSrno, "dext5upload");
	}
}


////////////////////////////////////////
////파일전송
////////////////////////////////////////
/*
* Function Name : DEXT5UPLOAD_OnTransfer_Start
* Description   : 파일전송 시작
* ----------------------------------------------------------------------------------------------------
* ----------------------------------------------------------------------------------------------------
* return        : 
*/
function DEXT5UPLOAD_OnTransfer_Start(uploadID) {
	 //root path : c:\\app\\upload (변경 될 수 있음)
	 //working group folder 아래 특정 경로를 원하시면 아래의 customPath에 값을 입력하시면 됩니다.
	 //ex: c:\\app\\upload\\tagnoc\\customPath\\2016\\08
	//DEXT5UPLOAD.AddFormData("tangot", "tangot", uploadID);
}

/*
* Function Name : DEXT5UPLOAD_OnCreationComplete
* Description   : 파일영역 생성
* ----------------------------------------------------------------------------------------------------
* ----------------------------------------------------------------------------------------------------
* return        : 
*/
function DEXT5UPLOAD_OnCreationComplete(uploadID) {
	 G_UploadID = uploadID;
	 $('#editorResult').text('업로드 생성 완료 : ' + uploadID);
}

/*
* Function Name : DEXT5UPLOAD_OnTransfer_Complete
* Description   : 파일추가완료
* ----------------------------------------------------------------------------------------------------
* ----------------------------------------------------------------------------------------------------
* return        : 
*/
function DEXT5UPLOAD_OnTransfer_Complete(uploadID) {
	/**완료시 responseCustomValue의 값이 리턴됩니다. **/
	/**반드시 저장해 두었다가 다운로드시(함수 : AddUploadedFile) 해당 값을 5번째 파리미터(CustomValue)에 입력하셔야 이력 관리가 가능합니다.**/

   // DEXT5 Upload는 json, xml, text delimit 방식으로 결과값을 제공
   // 신규 업로드된 파일
   //var jsonNew = DEXT5UPLOAD.GetNewUploadListForJson(uploadID);
   // var xmlNew = DEXT5UPLOAD.GetNewUploadListForXml(uploadID);
   //var textNew = DEXT5UPLOAD.GetNewUploadListForText(uploadID);
   // 삭제된 파일
   // var jsonDel = DEXT5UPLOAD.GetDeleteListForJson(uploadID);
   // var xmlDel = DEXT5UPLOAD.GetDeleteListForXml(uploadID);
   //var textDel = DEXT5UPLOAD.GetDeleteListForText(uploadID);
   // 전체결과
   // var textAll = DEXT5UPLOAD.GetAllFileListForText(uploadID);
   var jsonAll = DEXT5UPLOAD.GetAllFileListForJson(uploadID);
   // var xmlAll = DEXT5UPLOAD.GetAllFileListForXml(uploadID);

   var result = "전송결과 \n" + JSON.stringify(jsonAll)
   $('#editorResult').text( result);

	 // 파일목록에 취득한 일련번호를 셋팅
    var gridFileList = AlopexGrid.currentData( $('#'+gridFile).alopexGrid("dataGet") );;
	 var tempRowMap = [];
	 var tempFileList;
    for (var i = 0; i < gridFileList.length; i++) {
   	 tempFileList = gridFileList[i];
   	 //if (tempFileList._state.added == "true" && tempFileList._state.deleted == "false") {
   	 if (nullToEmpty(tempFileList.tempFileNo)+"" != "" && nullToEmpty(tempFileList.tempFileNo)+"" !=undefined) {
       	 tempRowMap[tempFileList.tempFileNo+""] = tempFileList._index.row;    		 
   	 }
    }
    
	 var newFileInfo = null;
	 if (jsonAll != null && jsonAll.newFile != null && jsonAll.newFile.responseCustomValue !=null && jsonAll.newFile.responseCustomValue.length > 0) {
		newFileInfo = jsonAll.newFile;
		
    	for (var j=0; j < newFileInfo.responseCustomValue.length; j++) { 
    		$('#'+gridFile).alopexGrid('cellEdit', newFileInfo.responseCustomValue[j], {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'fileUladSrno');   // 파일ID셋팅
    		$('#'+gridFile).alopexGrid('refreshCell', {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'fileUladSrno'); //파일ID셋팅
    		$('#'+gridFile).alopexGrid('cellEdit', newFileInfo.originalName[j], {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'uladFileNm');   // 파일명
    		$('#'+gridFile).alopexGrid('refreshCell', {_index: {row: tempRowMap[newFileInfo.mark[j]]}}, 'uladFileNm'); //파일명
    	}
	 } 
	 saveAttachFileInfo();	 	 
}

/*
* Function Name : DEXT5UPLOAD_OnError
* Description   : 파일 에러시
* ----------------------------------------------------------------------------------------------------
* ----------------------------------------------------------------------------------------------------
* return        : 
*/
function DEXT5UPLOAD_OnError(uploadID, code, message, uploadedFileListObj) {
	var str = 'Error : ' + code + ', ' + message + '\n';
    if (uploadedFileListObj != null && uploadedFileListObj != '') {
    	str += '업로드 된 파일 리스트 - \n';
        var uploadedFileLen = uploadedFileListObj.length;
        for (var i = 0; i < uploadedFileLen; i++) {
            str += uploadedFileListObj[i].uploadName + ', ' + uploadedFileListObj[i].uploadPath + '\n';
        }
    }
    $('#editorResult').text( str);
    //alert("파일 업로드에 실패했습니다.");
    alertBox('I', cflineMsgArray['failFileUpload']); /*"파일 업로드에 실패했습니다."*/
    return;
}

/*
* Function Name : fillAddChange
* Description   : 파일추가
* ----------------------------------------------------------------------------------------------------
* ----------------------------------------------------------------------------------------------------
* return        : 
*/
function DEXT5UPLOAD_UploadingCancel(uploadID, uploadedFileListObj) {
	G_UploadID = uploadID;

    var str = '전송 취소 이벤트 : ' + G_UploadID + '\n';

    if (uploadedFileListObj != null && uploadedFileListObj != '') {
    	str += '업로드 된 파일 리스트 - \n';
        var uploadedFileLen = uploadedFileListObj.length;
        for (var i = 0; i < uploadedFileLen; i++) {
            str += uploadedFileListObj[i].uploadName + ', ' + uploadedFileListObj[i].uploadPath + '</br>';

            // guid: uploadedFileListObj[i].guid
            // originName: uploadedFileListObj[i].originName
            // fileSize: uploadedFileListObj[i].fileSize
            // uploadName: uploadedFileListObj[i].uploadName
            // uploadPath: uploadedFileListObj[i].uploadPath
            // logicalPath: uploadedFileListObj[i].logicalPath
            // order: uploadedFileListObj[i].order
            // status: uploadedFileListObj[i].status
            // mark: uploadedFileListObj[i].mark
            // responseCustomValue: uploadedFileListObj[i].responseCustomValue
        }
    }
    $('#editorResult').text( str);
}
//////////////////////////////////////////////////////////
