/**
 * OnDemandExcelDownloadPop.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
        
        var jobInstanceId = null;
        var jobStatus = null;
        var fileName = null;
        var fileExtension = null;
        //초기 진입점
        //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
        this.init = function(id, param) {
        	cntlProgress("S");
        	
            if (param.jobInstanceId !="" && param.jobInstanceId != null){
                jobInstanceId = param.jobInstanceId;
                fileName = param.fileName;
                fileExtension = param.fileExtension;
                excelFileStatus();
            }else {
                callMsgBox('error','W', "잘못된 경로로 접근하셨습니다.", btnMsgCallback);
                
                $a.close();
            }
            setEventListener();          
        };    
        function setEventListener() {
            $('#popBtnclose').on('click', function(e) {
                if (jobStatus == "running"){
                    callMsgBox('error','W', "엑셀 파일을 생성중입니다 완료후 창을 닫아주세요.", btnMsgCallback);
                } else {
                    $a.close();
                }
            });
        };
        
        // 생성상태 확인
        function excelFileStatus(){
            var param = {
            		jobInstanceId : jobInstanceId
            };
        	console.log("aaa");
        	serviceCbcntRequest('excelStatus','tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchStatus',param , 'GET');
        }

        // 파일다운로드
        function funExcelDownload(){
            //엑셀다운로드..
            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('id','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/onDemandExceldownload");
            $form.attr('method','get');
            $form.attr('target','downloadIframe');
         // 2016-11-인증관련 추가 file 다운로드시 추가필요 
            $form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="onBatchDownFlag" value="Y" /><input type="hidden" name="fileName" value="'+fileName+'" /><input type="hidden" name="fileExtension" value="'+fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();
        }
        
        //서비스 요청처리
        function serviceCbcntRequest(sType, sUrl, sData, sMethod){      
            if(typeof(sData) === 'object'){
                Tango.ajax({
                    url : sUrl, 
                    data : sData,
                    method : sMethod,
                    flag : sType
                }).done(successCallback)
                  .fail(failCallback);
            }
        } 
        //request 성공시
        function successCallback(response, status, jqxhr, flag){ 
        	if (flag == 'excelStatus'){
        		if(response.returnCode == '2000'){     
                    jobStatus  = response.resultData.jobStatus ;
                    if (jobStatus == "ok"){
                    	cntlProgress("H");
                        $('#statusMsg').text("엑셀파일을 다운로드 완료 했습니다."); /* 엑셀파일을 다운로드 완료 했습니다. */
                        $('#noticeMsg').text("다운로드한 파일은 C:/Users/(사용자계정)/Donwlaods 폴더에 저장 되었습니다."); /* 다운로드한 파일의 위치는 C:/Users/(사용자계정)/Donwlaods 폴더에 저장 되었습니다. */
                        $('#noticeFileNm').text("파일명:"+fileName);
                        funExcelDownload();
                    }else if (jobStatus =="running"){
                        //10초뒤 다시 조회
                        setTimeout(function(){ excelFileStatus(); } , 1000*5 );
                    }else if (jobStatus =="error"){
                    	cntlProgress("H");
                        callMsgBox('error','I', "조회 실패 하였습니다."+"[01]", btnMsgCallback);
                    }
                }else if(response.returnCode == '3000'){ 
                	cntlProgress("H");
                    /*alert('실패 되었습니다.  ');*/
                    callMsgBox('error','I', "조회 실패 하였습니다."+"[02]", btnMsgCallback);
                }
        	}
        }
        
        //request 실패시 처리
        function failCallback(response, status, jqxhr, flag){
        	cntlProgress("H");
            //alert("System Error");
            callMsgBox('error','W', "System Error", btnMsgCallback);
        }
        
        //조회버튼 클릭시 그리드의 프로그래스바 표시하기..
        // gubun : S = show , H = hide
        function cntlProgress(gubun){
            if(gubun == "S"){
                $('body').progress();
            }else{
                $('body').progress().remove();
            }
        }
        //메세지박스 callback
        function btnMsgCallback(msgId, msgRst){
            
        }
        
        
    });