/**
 * VerificationRegistrationLine.js
 *
 * @author P096430
 * @date 2016. 08. 11. 오전 11:26:00
 * @version 1.0
 */



var m = {
			globalVar : {
							userId    :     "testUser"     ,
							cstrCd    :     ""             ,
							tmpCnt    :     0 			   ,
							vrfObjYn  :     ""             ,
							vrfFnshDt :     ""             , // 완료일자 
							skAfcoDivCd :   ""    		   ,
							bpId      :     ""             ,
							
							
							accAprvYn :     "N"             , // 정산승인여부
							vrfFnshDtYn :   "N"             , // 완료일자 유무
							bpTrmtYn  :     "N"             , // BP사 조치 유무
    						vcVrfYn   :     "N"             , // 검증센터 소견 등록 유무
							step      :     0              , // 호출 단계 ----> 0: 검증완료전, '1: 검증완료, '2: BP조치완료, '3: 소견검증 완료  
							
							eteVrfWoYn :    ""             	,
							flag : ""						,
						    vcYn : ""							// 검증등록 가능 여부 , 부모창이 검증센터(선로)인 경우만 수정 가능                      
						},
			params    : {},
			ajaxProp  : [
			             {  // BP사 의견 및 검증제외 조회 
			            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineBpComment',
			            	data:"",
			            	flag:'BpComment'
			             },
			             {  // 정산 완료 여부 조회
			            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineAccountAproveYn',
			            	data:"",
			            	flag:'AccountAproveYn'
			             },
			             {  // 검증대상 변경 
			             	url:'tango-transmission-biz/transmission/constructprocess/verification/UpdateVerificationTargetYn?method=put',
			             	data:"",
			             	flag:'UpdateVerificationTargetYn'
			             },
			             {  // 검증완료여부 항목별 조회
			             	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineVerificationCompleteYn',
			              	data:"",
			              	flag:'VerificationCompleteYn'
			             },
			             {  // 완료처리 변경 
			              	url:'tango-transmission-biz/transmission/constructprocess/verification/UpdateVerificationCompleteAction?method=put',
			              	data:"",
			              	flag:'UpdateCompleteActionYn'
			             },
			             {  // 완료취소 변경 
			               	url:'tango-transmission-biz/transmission/constructprocess/verification/UpdateVerificationCompleteCancelAction?method=put',
			               	data:"",
			               	flag:'UpdateCompleteCancelYn'
			             },
			             {  // 정산 완료 여부 조회
			            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineAccountAproveYn',
			            	data:"",
			            	flag:'AccountAproveYnChk' //6
			             },
			             {  // BP사 의견 및 검증제외 조회 
			            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineBpComment',
			            	data:"",
			            	flag:'BpCommentChk' // 7
			             }
			             ],
		responseData   : {},
		label          : {},
	    message        : {},
	    error          : {},
	    userInfo       : {}
						
	};

var tangoAjaxModel = Tango.ajax.init({});

var localPage = $a.page(function(){
	
	$('#CompletionActionBtn').css("display","none"); // 완료처리
	$('#CompletionCancelBtn').css("display","none"); // 완료취소
	$('#VerificationModificationBtn').css("display","none"); // 검증수정
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param){   	
    	
    	var x = Tango.getFormRemote();
		$('body').append(x);
    	    	
    	$('.af-tabs-content').css({
    				'height':'635px'
    	});
    	
    	if(param.cstrCd != null && param.cstrCd != "" && param.cstrCd != undefined){
    		m.globalVar.cstrCd = param.cstrCd;
    		
    		m.globalVar.bpId = m.userInfo.bpId;
    		m.globalVar.skAfcoDivCd = m.userInfo.skAfcoDivCd;
    		
	    	m.params.cstrCd = m.globalVar.cstrCd;
	    	m.params.bpId = m.globalVar.bpId;
	    	m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
	    	
	    	if(m.userInfo.userId!= null&& m.userInfo.userId!=""){
	    		m.params.lastChgUserId = m.userInfo.userId;
	    		m.globalVar.userId = m.userInfo.userId;
	    	}else{
	    		m.params.lastChgUserId = m.globalVar.userId;
	    	}
	    	$('#cstrCd').val(m.globalVar.cstrCd);
	    	
	    	m.globalVar.bpYn = m.userInfo.bpYn;
	    	
	    	m.globalVar.vcYn = m.userInfo.vcYn;
	    	
	    	
//			if(m.globalVar.vcYn == "" || m.globalVar.bpYn == ""|| m.globalVar.cstrCd == ""){
//	    		$('.button').setEnabled(false);
	    		initPage();
//	     	}else{
//	     		initPage();
//	     		callMsgBox('bpYn','C', "[테스트용추후 삭제예정]\n협력사 입니까?  (예:협력사, 아니오:검증센터)", messageCallback);
//	     	}
//			console.log("부모창 ID : "+ parent.$a.pageId); // /tango-transmission-web/constructprocess/verification/LineVerificationObjectConstructionSearch.do
			
//			if(parent != null || parent != "" || m.globalVar.bpYn == "N" || m.globalVar.bpYn == "Y"){
//				m.globalVar.vcYn = "Y"; // 부모창이 검증센터
//			}else{
//				m.globalVar.vcYn = "N"; // 기타 창!! 조회만 가능
//			}
			
    	}
    };   
        
    function initPage(){
		
		
		callTangoAjax(0);
    	
    	callTangoAjax(1);
    	
    	setEventListener();
    }
    
    
    
  //Grid init
    function initGrid(){ }// initGrid()
    
    function validateChk(){  
    	return true;
    }    
    
    
    
    // EVENT !!!!!!!!!!!!!
    function setEventListener() {

    	var currentTabIndex = 0;
    	
    	// 텝이동
    	$('#basicTabs').on('beforetabchange',function(e,index){
    		
    		if(currentTabIndex == index){
			}else{
	    		$('#iframe'+index).attr('src','/tango-transmission-web/constructprocess/verification/'+$('#basicTabs li:eq('+index+')').attr('data-content'));
			}
    	});
    	

    	$('#basicTabs').on("tabchange", function(e, index) {
    		currentTabIndex = $(this).getCurrentTabIndex();
    	});

    	
    	// 완료처리 클릭 : 항목별 검증결과를 완료처리
    	$('#CompletionActionBtn').on('click',function(e){
    		m.globalVar.flag = 'A';
    		callTangoAjax(7);
    	});

    	// 완료취소 클릭 : 항목별 검증결과 완료를 취소처리
    	$('#CompletionCancelBtn').on('click',function(e){
    		m.globalVar.flag = 'C';
    		callTangoAjax(7);
    	});
    	
    	// 검증수정 클릭 : 검증등록 수정 팝업 호출
		$('#VerificationModificationBtn').on('click',function(e){
			m.globalVar.flag = 'P';
			callTangoAjax(7);
		});
		
		// 정산서류 클릭
		$('#settleDoc').on('click',function(e){
			
			var cstrCd = $('#cstrCd').val();
			var cstrNm = "";
			var submDt = "";
			
			parent.$a.popup({
	         	popid: 'SettlementDocumentCreate',
	         	title: '<spring:message code="label.settlementOfAccountsDocument"/><spring:message code="label.create"/>',
	            url: '/tango-transmission-web/constructprocess/accounts/SettlementDocumentCreate.do',
	            width: 1200,
	            height: 760,
	            windowpopup: true,
	            modal:false,
	            movable:true,
	            data: { "cstrCd": cstrCd, "cstrNm": cstrNm, "loginUserId" : $('#userId').val() , "skAfcoDivCd":'T', "submDt": submDt, "jintInvtOnrCstrCd":""},
	            callback: function(data) {
	   				if(data != null) {
	   				}
	            }
	    	});			
			
		});
		
	} // setEventListener() - 이벤트
	
    // SUCCESS...
    function successFn(response, status, jqxhr, flag){
    	switch (flag) {
    	
    	case 'BpComment': 
    		if(response.BpCommentInfo != null && response.BpCommentInfo != "" ){
    			console.log(response);
    			m.globalVar.vrfObjYn = response.BpCommentInfo.vrfObjYn;
    			m.globalVar.vrfFnshDt = response.BpCommentInfo.vrfFnshDt;
    			m.globalVar.step = response.BpCommentInfo.step;
    			
    			$('#bpOponCtt').val(response.BpCommentInfo.bpOponCtt);
    			// 검증대상이고, 검증센터 권한 여부만 체크
    			if( response.BpCommentInfo.vrfObjYn == "Y" 
    				// && m.globalVar.bpYn == 'N' 
    					&& m.globalVar.vcYn == "Y"){
    				$('#VerificationModificationBtn').css("display","none"); // 검증수정
    				
        			if(response.BpCommentInfo.vrfFnshDt == null || response.BpCommentInfo.vrfFnshDt == undefined || response.BpCommentInfo.vrfFnshDt == "" ){
        			
        				$('#CompletionActionBtn').css("display",""); // 완료처리
        				$('#CompletionCancelBtn').css("display","none"); // 완료취소
        				$('#VerificationModificationBtn').css("display","none"); // 검증수정        
        			}else{
        				$('#CompletionActionBtn').css("display","none"); // 완료처리
        				
//        				if(m.globalVar.step == 1){// BP사 조치 전 일때만
        					$('#CompletionCancelBtn').css("display",""); // 완료취소
//        				}else{
//        					$('#CompletionCancelBtn').css("display","none"); // 완료취소
//        				}
        				
//        				if(m.globalVar.step == 3){// 검증결과 양호 or 검증센터 소견 검증 이후
        					$('#VerificationModificationBtn').css("display",""); // 검증수정
//        				}else{
//        					$('#VerificationModificationBtn').css("display","none"); // 검증수정
//        				}
        				
        			} // 검증완료 : vrfFnshDt여부
    			}else{
    				$('#CompletionActionBtn').css("display","none"); // 완료처리
    				$('#CompletionCancelBtn').css("display","none"); // 완료취소
    				$('#VerificationModificationBtn').css("display","none"); // 검증수정
    			} // 검증대상 : vrfObjYn 여부
    		}else{
				$('#CompletionActionBtn').css("display","none"); // 완료처리
				$('#CompletionCancelBtn').css("display","none"); // 완료취소
				$('#VerificationModificationBtn').css("display","none"); // 검증수정
    		}
    		
    		
    		break;  
		case 'BpCommentChk': 
    		if(response.BpCommentInfo != null && response.BpCommentInfo != ""){
    			if(m.globalVar.vrfObjYn != response.BpCommentInfo.vrfObjYn){
					parent.callMsgBox('BpCommentChk','W', m.message.changedVerificationTargetInfomation,messageCallback); // "검증대상정보가 변경 되었습니다."
				}else if(m.globalVar.vrfFnshDt != response.BpCommentInfo.vrfFnshDt){
					parent.callMsgBox('BpCommentChk','W', m.message.changedVerificationCompletionInfomation,messageCallback); // "검증완료정보가 변경 되었습니다."
				}else{
					  if(m.globalVar.flag=="A"){ // 완료처리
						  m.params.step = m.globalVar.step;
	    				  callTangoAjax(3);
						  
//						  parent.callMsgBox('CompletionActionBtn','C', m.message.confirmCompleteProcess, messageCallback); // "완료처리 하시겠습니까?"
					  }else if(m.globalVar.flag=="C"){ // 완료취소
						  parent.callMsgBox('CompletionCancelBtn','C', m.message.confirmCompleteCancel, messageCallback); // "완료취소 하시겠습니까?"
					  }else if(m.globalVar.flag=="P"){ // 검증수정 버튼 클릭
							var x = m.label.verificationModification;
					    	parent.$a.popup({
					    		popid: 'VerificationRegistrationLineModification' // 중복클릭방지 id 필요
					            ,title : x //'검증수정'
					            ,url : '/tango-transmission-web/constructprocess/verification/VerificationRegistrationLineModification.do'
//					            ,iframe: true
//					            ,modal : true
//					            ,movable:true
//					            ,iframe: false
					            ,windowpopup: true
					            ,width : 830
					            ,height : 884
					            ,data : {'cstrCd':m.globalVar.cstrCd
					            	    ,'eteVrfWoYn':m.globalVar.eteVrfWoYn
					            	    ,'accAprvYn':m.globalVar.accAprvYn
					            	    ,'vrfObjYn':m.globalVar.vrfObjYn
					            	    ,'vrfFnshDt':m.globalVar.vrfFnshDt
					            	    ,'userId':m.userInfo.userId
					            		}
					            ,callback : function(x){
					            				if(x=="ok"){
					            					location.reload(true);
					            				}
					            			}
					        });
					    	
					  }
				}
    		}else{
    			parent.callMsgBox('BpCommentChk','W', m.message.changedVerificationCompletionInfomation,messageCallback); // "검증완료정보가 변경 되었습니다."
    		}
    		break;     	
    	case 'AccountAproveYn':
    		/* accAprvYn */
    		if(response.AccountAproveYn != null && response.AccountAproveYn != ""){
    			if(response.AccountAproveYn.accAprvYn != null && response.AccountAproveYn.accAprvYn != ""){
    				m.globalVar.accAprvYn = response.AccountAproveYn.accAprvYn;
    			}
    		}
    		break;
    	case 'AccountAproveYnChk':
    		if(response.AccountAproveYn != null && response.AccountAproveYn != ""){
    			if(response.AccountAproveYn.accAprvYn != null && response.AccountAproveYn.accAprvYn != ""){
    				m.globalVar.accAprvYn = response.AccountAproveYn.accAprvYn;
    				if(response.AccountAproveYn.accAprvYn == 'N'){
    					m.params.step = m.globalVar.step;
    						callTangoAjax(5);
    				}else{
    					callMsgBox('','I', m.message.checkBeforeSubmitCancel); // 정산 승인이 진행되어 취소할 수 없습니다.
    				}
    			}
    		}
    		break;
    	case 'UpdateVerificationTargetYn':
    		parent.callMsgBox('UpdateVerificationTargetYn','I', m.message.changedVerificationTargetInfomation);
    		location.reload(true);
//    		callTangoAjax(0); // 대상검증여부 재조회;
    		break;
    	case 'VerificationCompleteYn':
    		if(response.VerificationCompleteYn != null && response.VerificationCompleteYn != ""){
    			
    			if(     response.VerificationCompleteYn.verifyA != '1' ||  
    					(response.VerificationCompleteYn.verifyB != '1' && m.globalVar.eteVrfWoYn != "Y" ) ||
    					response.VerificationCompleteYn.verifyC != '1' ||
    					response.VerificationCompleteYn.verifyD != '1'
    			  ){
    				
	    			var result = m.message.existNoVerificationItem; // "미검증 항목이 존재합니다. \n 모두 검증 후 저장하세요\n\n[미검증 내역]\n"
	    			
	    			if(m.globalVar.eteVrfWoYn != "Y"){
	    				if(response.VerificationCompleteYn.verifyB == '0'){result = result+" - "+m.message.eteNoVerification;} // ETE 미검증\n
	    			}
	    			if(response.VerificationCompleteYn.verifyC == '0'){result = result+" - "+m.message.gisNoVerification;} // GIS 미검증\n
	    			if(response.VerificationCompleteYn.verifyA == '0'){result = result+" - "+m.message.picAndDocsNoVerification;} // 사진&인허가 미검증\n
	    			if(response.VerificationCompleteYn.verifyD == '0'){result = result+" - "+m.message.testReportNoVerification;} // 시험성적서 미검증\n
	    			
	    			parent.callMsgBox('','I', result);
	    			
    			  }else{
    				  parent.callMsgBox('CompletionActionBtn','C', m.message.confirmCompleteProcess, messageCallback); // "완료처리 하시겠습니까?"
    			  }
    		}else{
    			
    		}
    		break;
    	case 'UpdateCompleteActionYn':
    		if (response.returnCode == 202) {
    			parent.callMsgBox('UpdateCompleteActionY','I', m.message.successCompleteNoSMSProcess,messageCallback); // "완료처리 하였습니다.(SMS 미발송)"
    		} else {
    			parent.callMsgBox('UpdateCompleteActionY','I', m.message.successCompleteProcess,messageCallback); // "완료처리 하였습니다."
    		}
    		break;
    	case 'UpdateCompleteCancelYn':
    		parent.callMsgBox('UpdateCompleteCancelY','I', m.message.successCompleteCancel ,messageCallback); //"완료취소 하였습니다."
    		break;
    	}
    } // successFn()
    
    // FAIL...
    function failFn(response, status, flag){
    	parent.callMsgBox('','W', response.message);
//    	switch (flag) {
//    	case 'BpComment':   
//    		parent.callMsgBox('','W', m.message.searchFail);
//			break;    	
//    	case 'AccountAproveYn':
//    		parent.callMsgBox('','W', m.message.searchFail);
//    		break;
//    	case 'AccountAproveYnChk':
//    		parent.callMsgBox('','W', m.message.searchFail);
//    		break;
//    	case 'UpdateVerificationTargetYn':
//    		parent.callMsgBox('','W', m.error.failChangeVerificationTarget); //'검증대상변경 실패하였습니다.'
//    		break;
//    	case 'VerificationCompleteYn':
//    		parent.callMsgBox('','W', m.message.searchFail);
//    		break;
//    	case 'UpdateCompleteActionYn':
////    		parent.callMsgBox('','W', m.error.failCompleteProcess);
//    		parent.callMsgBox('','W', response.message);
//    		break;
//    	case 'UpdateCompleteCancelYn':
////    		parent.callMsgBox('','W', m.error.failCompleteCancel);
//    		parent.callMsgBox('','W', response.message);
//    		break;
//    	case 'BpCommentChk':
//    		parent.callMsgBox('','W', m.message.searchFail);
//    		break;
//    	}    	
    } // failFn()   
    

    
    // AJAX GET, POST, PUT
    function callTangoAjax(i){
    	
    	var url = m.ajaxProp[i].url;
    	
    	if(i==0||i==1||i==6||i==7){
    		m.ajaxProp[i].url = url+'/'+m.params.cstrCd
    	}
    	m.ajaxProp[i].data = m.params;
    	
    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } // 
    	else if(i == 1){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } // 
    	else if(i == 2){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn);  } // 
    	else if(i == 3){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn);  } // 항목별 완료여부 체크
    	else if(i == 4){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn);  } //
    	else if(i == 5){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn);  } //
    	else if(i == 6){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } //
    	else if(i == 7){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } //
    	     
    	 m.ajaxProp[i].url = url;  
    } // callTangoAjax()
    
    
    function tabValidation(i){
    	
    	return true;
    }
    
    
	function messageCallback(msgId, msgRst){
		
		switch(msgId){
//		case "bpYn" :
//			if(msgRst == "Y" || msgRst == "N"){
//				m.globalVar.bpYn = msgRst;
//				initPage();
//			}
//			break;
		case "CompletionActionBtn" :
			if(msgRst == "Y"){
				callTangoAjax(4); // 완료처리 수행
			}
			break;
		
		case "CompletionCancelBtn" :
			if(msgRst == "Y"){
				m.params.vrfObjYn = '';
				callTangoAjax(6);
			}
			break;
		case "UpdateCompleteActionY" :
			if(msgRst == "Y"){
				location.reload(true);
			}
			break;
		case "UpdateCompleteCancelY" :
			if(msgRst == "Y"){
				location.reload(true);
			}
			break;
		case "BpCommentChk":
			if(msgRst == "Y"){
				location.reload(true);
			}
			break;
		}
		
    };    


});