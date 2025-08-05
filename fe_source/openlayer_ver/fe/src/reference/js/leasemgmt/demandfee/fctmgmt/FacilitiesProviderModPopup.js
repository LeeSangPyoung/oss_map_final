/**
 * FacilitiesProviderModPopup.js
 * 제공사업자 Popup
 *
 * @author Jeong,JungSig
 * @date 2016. 8. 5. 오전 10:45:00
 * @version 1.0
 */
$a.page(function() {
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	setEventListener();			//이벤트 리스너 등록
    	initSelectCode();			//코드콤보  초기화
    	
    	$('#popupType').val(param.popupType);
    	if(param.popupType == 'I')
    	{	
       		$('#commBizrId').val(param.commBizrId);
    	}else
       	if(param.popupType == 'U')
       	{
       		$('#divCommBizrId').setEnabled (false);
       		bindFormValues(id, param);  //데이터 바인드
       	}
        //로그인 사용자의 계열사코드
    	var userSkAfcoDivCd = "";
    	
    	if("${userInfo.orgGrpCd}" == "PTN"){
	    	if("${userInfo.chrrOrgGrpCd}" == "SKT"){
	    		userSkAfcoDivCd = "T";
	    	}
	    	else{
	    		userSkAfcoDivCd = "B";
	    	}
    	}
    	else{
	    	if("${userInfo.orgGrpCd}" == "SKT"){
	    		userSkAfcoDivCd = "T";
	    	}
	    	else{
	    		userSkAfcoDivCd = "B";
	    	}
    	}
//    	alert(param.skAfcoDivCd);
//    	alert(userSkAfcoDivCd);
//    	if(param.skAfcoDivCd == userSkAfcoDivCd){
//    		$("#btnSave").show();
//    	}
//    	else{
//    		$("#btnSave").hide();
//    	}
    };
    
    //내용 조회 
    function bindFormValues(id, param) {
  		serviceRequest('getFacilitiesProviderInfo','tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderInfo',param,'GET');
    }
    
	/**
	 * serviceRequest
	 * 
	 * @param sType,sUrl,sData,sMethod
	 * @return void
	 */
    function serviceRequest(sType,sUrl,sData,sMethod)
    {
    	var grid1 = Tango.ajax.init({
			url : sUrl,
			data : sData,
			method : sMethod
		})
		if(sMethod == 'GET'){
			grid1.get().done(function(response){successCallback(response, sType, sData);})
						.fail(function(response){failCallback(response, sType);});
		}else
		if(sMethod == 'POST'){
			grid1.post().done(function(response){successCallback(response, sType, sData);})
						.fail(function(response){failCallback(response, sType);});
		}

    }
    
  //serviceRequest 성공시
    function successCallback(response, flag, param){
    	
       	if(flag == 'getFacilitiesProviderInfo'){	
       		$('#allcontents').setData(response);       		
       	}else
        if(flag == 'updateFacilitiesProvider'){
        	callMsgBox('failCallback','W', '수정 되었습니다.', btnMsgCallback);
       	}else
        if(flag == 'createFacilitiesProvider'){
           	callMsgBox('failCallback','W', '저장 되었습니다.', btnMsgCallback);
        } 
       	
    }
	
	//메세지박스 callback
    function btnMsgCallback(msgId, msgRst){
   		$a.close($('#allcontents').getData());       		
	}
    
	//serviceRequest 실패시.
    function failCallback(response, flag){
    	
    	callMsgBox('failCallback','W', response.message);
    	
        if(flag == 'createFacilitiesProvider'){	
        	callMsgBox('failCallback','W', '데이터가 중복되었습니다.');
        }
    }    
    
    function initSelectCode() {
    	
    	
    	
    	//사업자목록(as-is)
    	commBizrId_data = [ {depth:"0",upperCodeId:"*",codeId:"134",codeName:"KT"},
  	                        {depth:"0",upperCodeId:"*",codeId:"135",codeName:"SKN"},
  	                        {depth:"0",upperCodeId:"*",codeId:"136",codeName:"드림라인"},
  	                        {depth:"0",upperCodeId:"*",codeId:"137",codeName:"SJ"},
  	                        {depth:"0",upperCodeId:"*",codeId:"138",codeName:"데이콤"},
  	                        {depth:"0",upperCodeId:"*",codeId:"139",codeName:"파워콤"},
  	                        {depth:"0",upperCodeId:"*",codeId:"232",codeName:"SKB"},
  	                        {depth:"0",upperCodeId:"*",codeId:"444",codeName:"기타"},
  	                        {depth:"0",upperCodeId:"*",codeId:"233",codeName:"CJ헬로비전"},
  	                        {depth:"0",upperCodeId:"*",codeId:"234",codeName:"씨엔엠"}];
    	$('#commBizrId').clear();
    	$('#commBizrId').setData({
    		data:commBizrId_data
    	});
    	
    }
    
    
    //이벤트 리스너 등록
    function setEventListener() {
    	
    	//저장 버튼 Click Event Listener 등록
    	$('#btnSave').on('click', function(e) {
    		btnSaveClickEventHandler(e);
		});    	
	};
    
	//저장 버튼 Click Handler
	function btnSaveClickEventHandler(event){
		
		var param = $('#allcontents').getData();
		
		param.frstRegUserId = 'admin'; 
		param.lastChgUserId = 'admin';
		 
		if(param.popupType == "I"){
			param.commBizrNm = $('#commBizrId option:selected').text();
		    serviceRequest('createFacilitiesProvider','tango-transmission-biz/leasemgmt/demandfee/fctmgmt/createFacilitiesProvider',param,'POST');
		}else
		if(param.popupType == "U"){
			serviceRequest('updateFacilitiesProvider','tango-transmission-biz/leasemgmt/demandfee/fctmgmt/updateFacilitiesProvider?method=put',param,'POST');
		}	
	}
	
	//종료 버튼 Click Handler
	function bntCloseClickEventHandler(event){
		
		$a.close();
	}


});