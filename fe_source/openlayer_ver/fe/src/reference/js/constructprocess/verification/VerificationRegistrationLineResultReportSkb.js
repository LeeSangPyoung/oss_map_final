/**
 * VerificationRegistrationLineEteSkb.js
 *
 * @author P096430
 * @date 2016. 7. 20. 오전 11:27:00
 * @version 1.0
 */

var m = {
			globalVar 	: {
							userId          :     parent.m.userInfo.userId     ,
							cstrCd          :     ""             ,
							skAfcoDivCd     :     parent.m.userInfo.skAfcoDivCd,
							bpId            :     parent.m.userInfo.bpId,
							tmpCnt          :     0              ,
							accAprvYn 		: 		''			 ,
							btnFlag         :     ''
						   },						   
			params    	: {},
			ajaxProp  	: [
				             {  // Search Verification Result
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineResultReportInfoSkb',
				            	data:"",
				            	flag:'searchVerificationResult' // 0
				             },
				             {  // save BP Opinion
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/updateVerificationRegistrationLineResultReportBpOpSkb',
				            	data:"",
				            	flag:'saveBpOpinion' // 1
				             },
				             {  // save Verification Center Opinion
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/updateVerificationRegistrationLineResultReportVcOpSkb',
				            	data:"",
				            	flag:'saveVcOpinion' // 2
				             },
				             {  // 정산 완료 여부 조회
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineAccountAproveYnSkb',
				            	data:"",
				            	flag:'AccountAproveYn' // 3
				             },
				             {  // 정산 완료 여부 조회
				            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineAccountAproveYnSkb',
				            	data:"",
				            	flag:'AccountAproveYnChk' // 4
				             },
				             {  // BP사 의견 및 검증제외 조회 
					            	url:'tango-transmission-biz/transmission/constructprocess/verification/getVerificationRegistrationLineBpCommentSkb',
					            	data:"",
					            	flag:'BpCommentChk' // 5
				             }
			              ],
		responseData   : {},
	    message        : {},
	    userInfo       : {}
						
	};

var tangoAjaxModel = Tango.ajax.init({});


$('tbody>tr>td').css({'height':'125px'});

$a.page(function() {
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {   	
    	setSelectCode(); // set select box
    };
    
    function initGrid(){};
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	
  	   	setSelectByCode('eteBpTrtmDivCd', 'select', 'C00519', setSelectBox, '');
  	   	setSelectByCode('gisBpTrtmDivCd', 'select', 'C00519', setSelectBox, '');
  	   	setSelectByCode('cptBpTrtmDivCd', 'select', 'C00519', setSelectBox, '');
  	   	setSelectByCode('trtBpTrtmDivCd', 'select', 'C00519', setSelectBox, '');
    }    
    
    function setSelectBox(){
    	m.globalVar.tmpCnt ++;
    	
    	if(m.globalVar.tmpCnt == 4){
    		 
    		if($.TcpUtils.isNotEmpty(parent.$('#cstrCd').val())){
        		m.globalVar.cstrCd = parent.$('#cstrCd').val();
        		m.params.cstrCd = m.globalVar.cstrCd;

	     		m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
	     		m.params.bpId = m.globalVar.bpId;
	     		
    	    	setEventListener();
    	    	
    	    	callTangoAjax(0);
        	}
    	}
    }
    
    function setEventListener() {
    	
    	 // 저장버튼 클릭시
     	 $('#bp_save_btn').on('click',function(){
     		
     		 m.globalVar.btnFlag = 'BP';
     		 
     		if($.TcpUtils.isEmpty(m.globalVar.cstrCd)){
     			return false;
     		}
     		
     		callTangoAjax(5);
     	 }); 
     	 
    	 // 저장버튼 클릭시
     	 $('#vc_save_btn').on('click',function(){
     		
     		m.globalVar.btnFlag = 'VC';
     		 
     		if(parent.m.globalVar.step == 1){
     			parent.parent.callMsgBox('','I', "BP사만 소견 등록 가능합니다.");
     			return false;
     		}
     		 
     		if($.TcpUtils.isEmpty(m.globalVar.cstrCd)){
     			return false;
     		}
     		callTangoAjax(5);
     	 }); 
	};
	
	//request 성공시
	function successFn(response, status, jqxhr, flag){
		console.log("flag : "+ flag);
		switch (flag) {
		
		case 'searchVerificationResult':
			if($.TcpUtils.isNotEmpty(response.ResultReportInfo)){
				
				m.responseData = response.ResultReportInfo;
				
				if(parent.m.globalVar.step >= 1 ){ /* 완료처리 후 */
					
					$('tbody').setData(response.ResultReportInfo);
				
						$('#eteBpTrtmDivCd option[value='+response.ResultReportInfo.eteBpTrtmDivCd+']').prop("selected",true);
						$('#eteBpTrtmDivCd').trigger("change");
		
						$('#gisBpTrtmDivCd option[value='+response.ResultReportInfo.gisBpTrtmDivCd+']').prop("selected",true);
						$('#gisBpTrtmDivCd').trigger("change");
		
						$('#cptBpTrtmDivCd option[value='+response.ResultReportInfo.cptBpTrtmDivCd+']').prop("selected",true);
						$('#cptBpTrtmDivCd').trigger("change");
		
						$('#trtBpTrtmDivCd option[value='+response.ResultReportInfo.trtBpTrtmDivCd+']').prop("selected",true);
						$('#trtBpTrtmDivCd').trigger("change");

						var result  = ""
						// 결과 데이터 셋팅
						for(i=0;i<4;i++){	
							
								// 검증센터 ETE 제외 에 따른 컴포넌트 활성화 구분
								if(i == 0 && parent.m.globalVar.eteVrfWoYn == "Y"){ 
									result = "X";// parent.m.globalVar.eteVrfWoYn == "Y" // ETE 제외 
								}else{  
									result = $('tbody').find('tr:eq('+i+')>td:eq(1)').val();
								}
							if(result == 'Y'){
								$('tbody').find('tr:eq('+i+')').find('select').val("");
								
								$('tbody').find('tr:eq('+i+')').find('select').setEnabled(false);
								$('tbody').find('tr:eq('+i+')').find('textarea').setEnabled(false);
							}else if(result == "X"){
								$('tbody').find('tr:eq('+i+')').find('select').setEnabled(false);
								$('tbody').find('tr:eq('+i+')').find('textarea').setEnabled(false);
							}else{
								
								if($.TcpUtils.isEmpty($('tbody').find('tr:eq('+i+')').find('select > option').filter(':selected').val())){
								}
								
								// BP사 권한 없을시 BP소견등록 영역 비활성화
								if(parent.m.globalVar.bpYn == 'N'){
									$('tbody').find('tr:eq('+i+')').find('select').setEnabled(false);
									$('tbody').find('tr:eq('+i+')').find('textarea:eq(0)').setEnabled(false);
									$('#bp_save_btn').setEnabled(false);
								}
								
								// 검증센터 권한 없을시 검증소견 영역 비활성화
								if(parent.m.globalVar.vcYn == 'N'){
									$('tbody').find('tr:eq('+i+')').find('textarea:eq(1)').setEnabled(false);
									$('#vc_save_btn').setEnabled(false);
								}
								
							}
							$('tbody').find('tr:eq('+i+')>td:eq(1)').text(setResultYN(result));
						} // for(i=0;i<4;i++)
					
				} // if(parent.m.globalVar.step >= 1 )
			}else{
				$('tbody').find('tr').find('select').setEnabled(false);
				$('tbody').find('tr').find('textarea').setEnabled(false);
				$('.save_btn').setEnabled(false);
			}
			
			/* 정산 승인 완료시 화면 비활성화 */
			if(m.globalVar.accAprvYn == "Y"
					){
				$('tbody').find('tr').find('select').setEnabled(false);
				$('tbody').find('tr').find('textarea').setEnabled(false);
				$('.save_btn').setEnabled(false);
			}
			
			/* 
			  	단계에 따른 프로세스
			  	STEP 0 : 검증전														=> 입력불가 
			  	STEP 1 : 검증완료, BP사 조치입력전									=> 검증센터 소견 입력불가
			  	STEP 2 : 검증완료, BP사 조치입력완료, 검증센터 조치확인전			=> 입력가능
			  	STEP 3 : 검증완료, BP사 조치입력완료, 검증센터 조치확인, 정산승인전	=> 입력가능
			 
			 */
			if(parent.m.globalVar.step == 0 || $.TcpUtils.isEmpty(parent.m.globalVar.step)){
				$('tbody').find('tr').find('select').setEnabled(false);
				$('tbody').find('tr').find('textarea').setEnabled(false);
				$('.save_btn').setEnabled(false);
			}else if(parent.m.globalVar.step == 1){
				$('tbody').find('tr').find('textarea:eq(1)').setEnabled(false);
				$('#vc_save_btn').setEnabled(false);
			}else if(parent.m.globalVar.step == 2){
				
			}else if(	parent.m.globalVar.step == 3 && 
						(parent.m.globalVar.eteVrfWoYn == 'Y' || (parent.m.globalVar.eteVrfWoYn != 'Y' && m.responseData.eteCstrVrfRsltCd == "Y")) && 
						m.responseData.gisCstrVrfRsltCd == "Y" &&
						
						/* 준공사진, 시험성적서의 경우 불량인 건에 대한 조치저장 가능해야함 */
						m.responseData.cptCstrVrfRsltCd == "Y" && m.responseData.trtCstrVrfRsltCd == "Y" 
					){
				$('.save_btn').setEnabled(false);
			}
			break;
		case 'saveBpOpinion':
			parent.parent.callMsgBox('','I', parent.m.message.savesuccess,function(){
				parent.location.reload(true);
			});
			if(parent.m.globalVar.step == 1){
				parent.m.globalVar.step = 2;  // step 2
				
			}
			break;
		case 'saveVcOpinion':
			parent.parent.callMsgBox('','I', parent.m.message.savesuccess,function(){
				parent.location.reload(true);
			});
			if(parent.m.globalVar.step == 2){
					parent.m.globalVar.step = 3;  // step 2
			}
			break;    	
    	case 'AccountAproveYn':
    		/* accAprvYn */
    		if($.TcpUtils.isNotEmpty(response.AccountAproveYn)){
    			if($.TcpUtils.isNotEmpty(response.AccountAproveYn.accAprvYn)){
    				m.globalVar.accAprvYn = response.AccountAproveYn.accAprvYn;
    				console.log("정산승인여부 : "+m.globalVar.accAprvYn);
    				callTangoAjax(0);
    			}
    		}
    		break;
    	case 'AccountAproveYnChk':
    		if($.TcpUtils.isNotEmpty(response.AccountAproveYn)){
    			if($.TcpUtils.isNotEmpty(response.AccountAproveYn.accAprvYn)){
    				m.globalVar.accAprvYn = response.AccountAproveYn.accAprvYn;
    				if(response.AccountAproveYn.accAprvYn == 'N'){
    						validateOpinion();
    				}else{
    					parent.parent.callMsgBox('','I', "정산승인되여 저장할 수 없습니다.");
    				}
    			}
    		}
    		break;  
		case 'BpCommentChk': 
    		if($.TcpUtils.isNotEmpty(response.BpCommentInfo)){
				if(parent.m.globalVar.vrfObjYn != response.BpCommentInfo.vrfObjYn){
					parent.parent.callMsgBox('BpCommentChk','W', "검증대상정보가 변경 되었습니다.",messageCallback);
				}else if(parent.m.globalVar.vrfFnshDt != response.BpCommentInfo.vrfFnshDt){
					parent.parent.callMsgBox('BpCommentChk','W', "검증완료정보가 변경 되었습니다.",messageCallback);
				}else{
					validateOpinion();
				}
    		}else{
    			parent.parent.callMsgBox('BpCommentChk','W', "검증완료정보가 변경 되었습니다.",messageCallback);
    		}
    		break;    
		}
    }
    
    //request 실패시.
	function failFn(response, status, jqxhr, flag){
		console.log(response);
		parent.parent.callMsgBox('','W', response.message);
    }
    
    // AJAX GET, POST, PUT
    function callTangoAjax(i){
    	
    	var url = m.ajaxProp[i].url;
    	
    	m.ajaxProp[i].url = url+'/'+m.params.cstrCd
    	
    	m.ajaxProp[i].data = m.params;
    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Cbnt Grid
    	else if(i == 1){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Ofd Grid
    	else if(i == 2){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn); } // Search Opinion
    	else if(i == 3){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // 
    	else if(i == 4){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } //
    	else if(i == 5){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } //
    	     
    	m.ajaxProp[i].url = url;    	     
    	     
    } // callTangoAjax()

    function validateOpinion(){
		
		var var1 = $('tbody').find('tr:eq(0)').find('select > option').filter(':selected').val();
		var var2 = $('tbody').find('tr:eq(1)').find('select > option').filter(':selected').val();
		var var3 = $('tbody').find('tr:eq(2)').find('select > option').filter(':selected').val();
		var var4 = $('tbody').find('tr:eq(3)').find('select > option').filter(':selected').val();
		
		var trObj = null;
		
		if(parent.m.globalVar.step > 0  && parent.m.globalVar.bpYn == "Y" && m.globalVar.btnFlag == 'BP'){
		
    		if(m.responseData.eteCstrVrfRsltCd == "N"){
    			trObj = $('tbody').find('tr:eq(0)').find('textarea:eq(0)');
    			if(var1 == "" || trObj.val().trim()==""){
    				parent.parent.callMsgBox('','I', "ETE 불량 항목에 대한 조치여부와 소견은 필수 입니다.",function(){ trObj.focus();  });    		
    				return false;
    			}
    		}
    		if(m.responseData.gisCstrVrfRsltCd == "N"){
    			trObj = $('tbody').find('tr:eq(1)').find('textarea:eq(0)');
    			if(var2 == "" || trObj.val().trim()==""){
    				parent.parent.callMsgBox('','I', "GIs 불량 항목에 대한 조치여부와 소견은 필수 입니다.",function(){ trObj.focus();  });  
    				return false;
    			}
    		}
		}else if(parent.m.globalVar.step >= 2 && parent.m.globalVar.vcYn == "Y" && m.globalVar.btnFlag == 'VC'){
			if(m.responseData.eteCstrVrfRsltCd == "N"){
				trObj = $('tbody').find('tr:eq(0)').find('textarea:eq(1)');
    			if(trObj.val().trim()==""){
    				parent.parent.callMsgBox('','I', "ETE 불량 항목에 대한 소견검증은 필수 입니다.",function(){ trObj.focus();  });    
    				return false;
    			}
    		}
    		if(m.responseData.gisCstrVrfRsltCd == "N"){
    			trObj = $('tbody').find('tr:eq(1)').find('textarea:eq(1)');
    			if(trObj.val().trim()==""){
    				parent.parent.callMsgBox('','I', "GIS 불량 항목에 대한 소견검증은 필수 입니다.",function(){ trObj.focus();  });   
    				return false;
    			}
    		}
		}
		parent.parent.callMsgBox('save_btn','C', parent.m.message.save, messageCallback);
    }
    
    // 양호, 불량 변경
    function setResultYN(a){
    	if(a == "Y"){
    		return "양호";
    	}else if(a == "N"){
    	 return "불량";
    	}
    	return "";
    }// setResultYN
    
	function messageCallback(msgId, msgRst){
		
		switch (msgId) {

		case 'save_btn':
			if(msgRst == 'Y'){
	     		
	     		m.params = $('tbody').getData(); 
	     		
	     		m.params.step = parent.m.globalVar.step;
	     		
	     		m.params.cstrCd = m.globalVar.cstrCd;
	     		m.params.lastChgUserId = m.globalVar.userId;
	     		m.params.eteVrfWoYn = parent.m.globalVar.eteVrfWoYn;
	     		m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
	     		m.params.bpId = m.globalVar.bpId;
	     		
	     		if(parent.m.globalVar.bpYn == "Y" && m.globalVar.btnFlag =='BP'){
	     			callTangoAjax(1) // Save BP Opinion	
	     		}else if(parent.m.globalVar.vcYn == "Y" && m.globalVar.btnFlag =='VC'){
	     			callTangoAjax(2) // Save VC Opinion	
	     		}
			}
			break;
		case "BpCommentChk":
			if(msgRst == "Y"){
				parent.location.reload(true);
			}
			break;
		}
	};
    
});