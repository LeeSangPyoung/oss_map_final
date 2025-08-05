/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 26. 오후 4:04:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	var uploadObj1 = $("#fileuploader").setOptions({
			url : '/tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelupload',
			onError : function(files, status, errMsg, pd) {
				alertBox('W',buildingInfoMsgArray['failFileUpload']);
				return false;
			},
			onSuccess : function(files, status, errMsg, pd) {
				if(status.result == "Fail") {
					bodyProgressRemove();
					
					//var msg = "업로드 실패되었습니다.";
					//msg += "(" + status.count + ")"; 
					alertBox('W',makeArgMsg('existFailUploadDataForBuildingInfo', status.count));
					
					$("#fileName").val(status.fileNames + "." + status.extensionNames);
					$("#extensionName").val(status.extensionNames);
					return false;
				}
				else if(status.result == "FileError") {
					bodyProgressRemove();
					alertBox('W',buildingInfoMsgArray['excelFileNotUpload']);
					return false;
				}
				else if(status.result == "ExcelRowOver") {
					bodyProgressRemove();
					alertBox('W',buildingInfoMsgArray['ExcelRowOver']);
					return false;
				}
				else {
					bodyProgressRemove();
					alertBox('I',buildingInfoMsgArray['normallyProcessed']);
					return false;
				}
			}
		});
		
    	$("#uploadBtn").on('click', function(){
    		//console.log($("#fileuploader").getFileCount());
    		//alert($("#fileuploader").getFileCount()+" files upload");
    		
    		bodyProgress();
    		if($("#fileuploader").getFileCount() == 0) {
    			bodyProgressRemove();
    			alertBox('W',buildingInfoMsgArray['selectUploadFile']);
    			return false;
    		}
    		
			$("#fileuploader").startUpload();
		});
    	
    	$("#uploadFailFileDown").on('click', function(){
    		
    		if($("#fileName").val() == "" || $("#extensionName").val() == "") {
    			alertBox('W',buildingInfoMsgArray['noExistFileForDownload']);
    			return false;
    		}
    		else {
    			var $form=$('<form></form>');
    			$form.attr('name','downloadForm');
    			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
    			$form.attr('method','GET');
    			$form.attr('target','downloadIframe');
    			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
				$form.append(Tango.getFormRemote());
    			$form.append('<input type="hidden" name="fileName" value="'+$("#fileName").val()+'" /><input type="hidden" name="fileExtension" value="'+$("#extensionName").val()+'" />');
    			$form.append('<input type="hidden" name="type" value="excelUploadFile" />');
    			$form.appendTo('body');
    			$form.submit().remove();
    		}
		});
    	
    	$('#closeBtn').on('click', function(e) {
    		
    		if($("#fileName").val() == "" || $("#extensionName").val() == "") {
    			
    		}
    		else {
    			var $form=$('<form></form>');
    			$form.attr('name','downloadForm');
    			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownloaddelete");
    			$form.attr('method','GET');
    			$form.attr('target','downloadIframe');
    			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
    			$form.append(Tango.getFormRemote());
    			$form.append('<input type="hidden" name="fileName" value="'+$("#fileName").val()+'" /><input type="hidden" name="fileExtension" value="'+$("#extensionName").val()+'" />');
    			$form.appendTo('body');
    			$form.submit().remove();
        		
            	$a.close();
    		}
        });
    };
});