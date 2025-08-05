/**
 * EmailSendSettingPop.js
 *
 * @author park. i. h.
 * @date 2017. 10. 27
 * @version 1.0
 */

var tmpSndTime = "";
var tmpUseYn = "";
$a.page(function() {

    this.init = function(id, param) {
    	$('#ogDowCdPop').val(nullToEmpty(param.ogDowCd));
    	$('#userIdPop').val(nullToEmpty(param.userId));
    	tmpSndTime =nullToEmpty(param.sndTime);
    	tmpUseYn = nullToEmpty(param.useYn);
//    	console.log("tmpUseYn============" + tmpUseYn);
    	if(tmpUseYn=="N"){
    		$('#useYnPop').setChecked(true);
    	}
    	setSelectCode();
        setEventListener();   
    };
   
    
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C10005', null, 'GET', 'emailSendDayOfWeek');
    }

    function setEventListener() { 
    	// 발송자 찾기 
		$('#btnUserAddPop').on('click', function(e) {
			cflineShowProgressBody();
			var param = {"searchDiv":"U"};
    		$a.popup({
    		  	popid: "popSenderSearch",
    		  	title: cflineMsgArray['addSender'] /* 발신자추가  */,
    			url:  "/tango-transmission-web/configmgmt/cfline/EmailSendAddBpSenderPop.do",
    			data: param,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 1000,
    			height : 600,
    			callback:function(data){
		    		cflineHideProgressBody();
					if(data != null){
			    		//console.log(data);	
			    		$('#userIdPop').val(nullToEmpty(data[0].userId)); // 발송자 세팅 
					}
					$.alopex.popup.result = null;
    			}
    		});  
		});
		// 취소
		$('#btnPopClose').on('click', function(e) {
			$a.close();
        });
		
		// 저장
		$('#btnPopSave').on('click', function(e) {
			var dowCd = nullToEmpty($('#dowCdPop').val());
			var ogDowCd = nullToEmpty($('#ogDowCdPop').val());
			var userId = nullToEmpty($('#userIdPop').val());

			if(userId == ""){
    			alertBox('I', makeArgMsg('required', cflineMsgArray['sender']));  /* [{0}] 필수 입력 항목입니다.*/
				return;
			}
			
			var useYn = "Y";
			
			if($('#useYnPop').getValues() == "N"){
				useYn = "N";
			}
	    	var param =  {"saveDiv":"P", "ogDowCd":ogDowCd, "dowCd":dowCd ,"dowNm":$('#dowCdPop').getTexts()[0], "sndTime":$('#sndTimePop').val(), "useYn":useYn, "userId":userId};
	    	//console.log(param);
	    	
			callMsgBox('btnPopSave', 'C', cflineMsgArray['save'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/savestcsendprd', param, 'POST', 'save');
				}
			});			    	
        });
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
		// 코드 조회
		if(flag == 'emailSendDayOfWeek') {	
			$('#dowCdPop').clear();
			$('#dowCdPop').setData({data : response});
			$('#dowCdPop').setSelected($('#ogDowCdPop').val());

			$('#sndTimePop').setSelected(tmpSndTime);
		}
		
		// 저장 
		if(flag =="save"){
			if(response.Result == "Success"){
				var data = response.sendPrd;
			}else{
				var data = {
						dowCD : ""
				};
			}
			$a.close(data);
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){		
		// 저장 
		if(flag =="save"){
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
		}
    	
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
  
});