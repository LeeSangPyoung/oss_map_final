/**
 * EmailSendLnoCrrtRate.js
 *
 * @author park. i. h.
 * @date 2017.10.26
 * @version 1.0
 */

var emailGrid = "emailGrid";
var sendUserId = "";
var sndTime = "";
var sndUseYn = "Y";

(
		function($, Tango, _, root){

			// DextEditor
			var DEXT5 = root.DEXT5;


			// DEXT5 editor onload function
			root.dext_editor_loaded_event = function(DEXT5Editor) {
				//DEXT5.setToSavePathUrl("/resources/upload");
				if($('#emailCtt').val() != ""){
					DEXT5.setHtmlValueEx($('#emailCtt').val(), 'anceEditor');
				}else{
					DEXT5.setHtmlValueEx($('#tmpEmailCtt').val(), 'anceEditor');
				}
				if(nullToEmpty($('#emailTitlNm').val())== ""){
					$('#emailTitlNm').val($('#tmpEmailTitlNm').val());
				}
			}

		}(jQuery, Tango, _, window));

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
		setEventListener();
		setSelectCode();
		baseMoreHide();
    	
    };

    // 덱스트 에디터 세팅 
	function setDextEditorFn(data){
		DEXT5.Destroy();
		// Editor 생성
		creDextEditor('anceEditor', 'edit');
	}

    
    //Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#' + emailGrid).alopexGrid({
        	autoColumnIndex: true,
        	autoResize: true,
        	cellSelectable : false,
        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        	rowClickSelect : true,
        	rowSingleSelect : false,
        	numberingColumnFromZero: false,    		
    		pager:false,  		
			height : 300,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [{ selectorColumn : true, width : '50px' } 
			    , {key : 'sndObjDivNm'	   	,title : cflineMsgArray['sendObject'] /*  발송대상 */       		,align:'center', width: '80px'}
			    , {key : 'mgmtGrpNm'	   	,title : cflineMsgArray['departmentDivision'] /*  부서구분 */       		,align:'center', width: '120px'}
			    , {key : 'orgNm'	   		,title : cflineMsgArray['chargeDepartment'] /*  담당부서 */       		,align:'center', width: '120px'}
			    , {key : 'bpNm'	   			,title : 'BP' /*  BP */        		,align:'center', width: '100px'}
			    , {key : 'userNm'	   		,title : cflineMsgArray['fullName'] /*  이름 */       		,align:'center', width: '100px'}
//			    , {key : 'userEmail'	   	,title : cflineMsgArray['email'] /*  이메일 */       		,align:'center', width: '300px'}       
			]}); 
      
    };    
    
    // 처음 로딩시 데이터를 가져온다.
    function setSelectCode() {
    	getEmailTargetList('');
    };
    function getEmailTargetList(searchDiv){
		cflineShowProgressBody();
    	var param = {"searchDiv":searchDiv};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/mailtargetlist', param, 'GET', 'mailtargetlist');
    };
    function setEventListener() {	
    	// 사용자 추가
		$('#btnAddUser').on('click', function(e) {
			cflineShowProgressBody();
    		$a.popup({
    		  	popid: "popEmailSendSetting",
    		  	title: cflineMsgArray['addRecipient'] /* 수신자추가  */,
    			url: $('#ctx').val() + "/configmgmt/cfline/EmailSendAddUserPop.do",
    			data: null,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 1200,
    			height : 810,
    			callback:function(data){
		    		cflineHideProgressBody();
					if(data != null){
			    		//console.log(data);	
						var msgStr = cflineMsgArray['normallyProcessed']; /* 정상적으로 처리되었습니다. */
						if(nullToEmpty(data.inCnt) != ""){
						msgStr = msgStr + "<br>" + makeArgMsg("registrationCount", data.inCnt, null, null); /* 등록 : {0}건 */
						}
						if(nullToEmpty(data.delCnt) != ""){
						msgStr = msgStr + "<br>" + makeArgMsg("deleteCount", data.delCnt, null, null); /* 삭제 : {0}건 */
						}
			    		alertBox('I', msgStr);
			    		getEmailTargetList('L'); // 대상 목록 조회
					}
					$.alopex.popup.result = null;
    			}
    		});  
		});
		// 사용자 삭제 
		$('#btnDeleteUser').on('click', function(e) {
     		var dataParam = $('#'+emailGrid).alopexGrid("dataGet", { _state : { selected : true }});
     		var dataLen = dataParam.length;   
     		//console.log("dataLen : " + dataLen); 
     		//console.log(dataParam);
     		if(dataLen == 0){     			
				alertBox('I', cflineMsgArray['deleteObjectCheck']);/* 삭제할 대상을 선택하세요. */
     			return;
     		}
     		var seqValArr = [dataLen];
    		for(i=0; i<dataLen; i++){
    			var dataObj = dataParam[i];
//    			$.extend(param,{topMtsoIdList: topMtsoIdList });
    			seqValArr[i] = dataObj.seq;
    		}     		
//     		console.log("dataLen222 : " + dataLen); 
//     		console.log(seqValArr);
     		var param = {seqArr:seqValArr};			
			callMsgBox('btnDeleteUser', 'C', cflineMsgArray['delete'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					cflineShowProgressBody();
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/deleteuser', param, 'POST', 'deleteuser');
				}
			});	
			
		});
    	
		// 저장 버튼 클릭 이벤트 등록
		$('#btnSaveContext').on('click', function(e) {
			if ($('#dowCd').val()=="") {				
				$('#btnEmailSendEtblm').click();
				return;
			}
			if ($('#emailTitlNm').val()=="") {				
				alertBox('I', makeArgMsg('required', cflineMsgArray['title'], null));/* [{0}] 필수 입력 항목입니다. */
				return;
			}
			var data = $('#contenteForm').getData();
			data.emailCtt = DEXT5.getBodyValueEx('anceEditor');

			if(DEXT5.isEmpty('anceEditor')) {
				alertBox('I', makeArgMsg('required', cflineMsgArray['ctxt'], null));/* [{0}] 필수 입력 항목입니다. */
				return;
			}
			//console.log(data);			
			
			callMsgBox('btnSaveContext', 'C', cflineMsgArray['save'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					cflineShowProgressBody();
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/savestcsendprd', data, 'POST', 'saveConText');
				}
			});	
				
		});

		// 메일발송설정
		$('#btnEmailSendEtblm').on('click', function(e) {
    		var paramPathData = {"ogDowCd":$('#dowCd').val(), "userId":sendUserId, "sndTime":sndTime, "useYn":sndUseYn};
//	    	console.log(paramPathData);
			cflineShowProgressBody();
    		$a.popup({
    		  	popid: "popEmailSendSetting",
    		  	title: cflineMsgArray['emailSendEtblm'] /* 메일발송설정  */,
    			url: $('#ctx').val() + "/configmgmt/cfline/EmailSendSettingPop.do",
    			data: paramPathData,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 500,
    			height : 330,
    			callback:function(data){
		    		cflineHideProgressBody();
					if(data != null){
//			    		console.log(data);
						if(nullToEmpty(data.dowCd) != ""){
							$('#dowCd').val(data.dowCd);
							sendUserId = data.userId;
							sndTime = data.sndTime;
							sndUseYn = nullToEmpty(data.useYn);
		    				var quitStr = "";
		    				if(sndUseYn=="N"){
		    					quitStr = cflineMsgArray['quit'];
		    				}
							var week = makeArgMsg('emailSendWeekTime', nullToEmpty(data.dowNm), nullToEmpty(data.sndTime), quitStr);/* 매주 {0} 요일 {1} 발송 {2}*/
							$('#emailSendWeekSpan').text(week);							
						}else{
				    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
						}
					}
					$.alopex.popup.result = null;
    			}
    		});  	  					
		});
		
		
	};	

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };	
	function successCallback(response, status, jqxhr, flag){
    	// 이메일 발송 대상 목록 및 발송 주기 정보 조회 
    	if(flag == 'mailtargetlist'){
    		cflineHideProgressBody();
    		$('#' + emailGrid).alopexGrid("dataSet", response.eamilList);
    		$('#sendObjCountSpan').text(response.totalCnt+ ' ' + cflineMsgArray['shortName']);
    		var week = "";
//    		console.log(response.sendPrd);
    		if(response.sendPrd != null){
        		//console.log("nullToEmpty(response.sendPrd.dowCd)=" + nullToEmpty(response.sendPrd.dowCd));
    			$('#dowCd').val(nullToEmpty(response.sendPrd.dowCd));
    			sendUserId = nullToEmpty(response.sendPrd.userId);
    			sndTime = nullToEmpty(response.sendPrd.sndTime);
    			if(typeof response.sendPrd.dowNm != "undefined"){
    				var quitStr = "";
					sndUseYn = nullToEmpty(response.sendPrd.useYn);
    				if(sndUseYn=="N"){
    					quitStr = cflineMsgArray['quit'];
    				}
    				week = makeArgMsg('emailSendWeekTime', nullToEmpty(response.sendPrd.dowNm), nullToEmpty(response.sendPrd.sndTime), quitStr);/* 매주 {0} 요일 {1} 발송 {2} */
    				$('#emailSendWeekSpan').text(week);
    			}
    			if(nullToEmpty(response.sendPrd.emailTitlNm) != ""){
    				$('#emailTitlNm').val(response.sendPrd.emailTitlNm);
    			}
    			if(nullToEmpty(response.sendPrd.emailCtt) != ""){
    				$('#emailCtt').val(response.sendPrd.emailCtt);
    			}
    		}
			setDextEditorFn();  // 덱스트 에디터 세팅 
    	}
    	// 본문 저장
    	if(flag == 'saveConText'){
    		cflineHideProgressBody();
			alertBox('I', cflineMsgArray['saveSuccess']); /* 정상적으로 처리되었습니다. */
    		
    	}
    	// 사용자 삭제
    	if(flag == 'deleteuser'){
    		cflineHideProgressBody();
    		if(response.Result == "Success"){
    			alertBox('I', makeArgMsg('processed', nullToEmpty(response.cnt))); /* {0}건 처리 되었습니다. */
    			getEmailTargetList('L'); // 대상 목록 조회
    		}else{
        		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		}
    	}
    	
    	
	};
	//request 실패시.
    function failCallback(response, status, flag){
    	// 이메일 발송 대상 목록 및 발송 주기 정보 조회 
    	if(flag == 'mailtargetlist'){
    		$('#sendObjCountSpan').text('0 ' + cflineMsgArray['shortName']);
			$('#emailSendWeekSpan').text('');
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		setDextEditorFn();  // 덱스트 에디터 세팅 
    	}
    	// 본문 저장
    	if(flag == 'saveConText'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		
    	}
    	// 사용자 삭제
    	if(flag == 'deleteuser'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		
    	}
	};


	// DextEditor
	function creDextEditor(id, mode){

		var editor = document.createElement("script");
		editor.type  = "text/javascript";
		editor.text += " DEXT5.config.InitServerXml = '/tango-common-business-biz/dext/editorhandler.up?f=dext_editor.xml';";
		editor.text += " DEXT5.config.Mode = '"+ mode +"';"; // edit, view
		editor.text += " DEXT5.config.EditorHolder = 'editor_PlaceHolder_"+ id +"'; ";
		editor.text += " DEXT5.config.Width = '100%'; ";
		if(mode == 'view') {
			editor.text += " DEXT5.config.ViewModeAutoHeight = '1'; ";
			editor.text += " DEXT5.config.Height = '150px'; ";
		}
		editor.text += " new Dext5editor('"+ id +"'); ";

		$("#editor_"+id).append(editor);
	}
	
	function baseMoreHide() {
		/*more_condition script*/
		$('#gridMoreSpan > .arrow_more').click(function(){
			//console.log("1111");
			var $this = $(this);

			var $main_box = $this.closest('.main');
			var $condition_box = $main_box.find('.nostep');
			var $more_condition = $condition_box.find('.Margin-top-10');
			if($more_condition.css('display') == 'none'){
				$this.addClass('on')
				$more_condition.show();
			}else{
				$this.removeClass('on')
				$more_condition.hide();
			}
			//console.log("2222");
		});
	}	
});
