/**
 * FacilitiesProviderDetailModPopup.js
 * 제공사업자상세 Popup
 *
 * @author Jeong,JungSig
 * @date 2016. 7. 27. 오전 10:45:00
 * @version 1.0
 */
$a.page(function() {
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
//    	alert(JSON.stringify(param));
    	
    	setEventListener();			//이벤트 리스너 등록
    	initSelectCode();			//코드콤보  초기화
    	
    	$('#popupType').val(param.popupType);   	
    	if(param.popupType == 'I')
    	{
    		if(param.lesCommBizrId != null){
    			$('#lesCommBizrId').val(param.lesCommBizrId);
    		}else{
    			$('#lesCommBizrId').val('134'); //없을 경우 기본 'KT'
    		}
       		$('#lesKndCd').val(param.lesKndCd);
    	}else
       	if(param.popupType == 'U')
       	{
       		$('#divlesCommBizrId').setEnabled (false);
       		bindFormValues(id, param);  //데이터 바인드
       	}
    };
    
    //내용 조회 
    function bindFormValues(id, param) {
  		serviceRequest('getFacilitiesProviderDetailInfo','tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFacilitiesProviderDetailInfo',param,'GET');
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
       	if(flag == 'getFacilitiesProviderDetailInfo'){       		
       		if(response.teamOrgId == "00003438"){
       		//전송실
        	   team_data =  [     
        	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000101",codeName:"수유(T전송실)"},      	              
        	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000102",codeName:"성수(T전송실)"}
        	                 ];
			}
       		else if(response.teamOrgId == "00003358"){
           		//전송실
         	   team_data =  [ 
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000103",codeName:"보라매(T전송실)"},
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000104",codeName:"분당(T전송실)"},  
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000105",codeName:"인천(T전송실)"}
         	                 ];
 			}
       		else if(response.teamOrgId == "00003359"){
           		//전송실
         	   team_data =  [ 
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000107",codeName:"부산(T전송실)"},  
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000106",codeName:"센텀(T전송실)"} 
         	                 ];
 			}
       		else if(response.teamOrgId == "00003362"){
           		//전송실
         	   team_data =  [   
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000109",codeName:"태평(T전송실)"},
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000116",codeName:"본리(T전송실)"}
         	                 ];
 			}
       		else if(response.teamOrgId == "00003365"){
           		//전송실
         	   team_data =  [  
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000113",codeName:"둔산(T전송실)"},  
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000114",codeName:"대전(T전송실)"},  
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000115",codeName:"원주(T전송실)"}
         	                 ];
 			}
       		else if(response.teamOrgId == "00003364"){
           		//전송실
         	   team_data =  [  
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000110",codeName:"광주(T전송실)"},   
           	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000111",codeName:"전주(T전송실)"}
         	                 ];
 			}
       		else if(response.teamOrgId == "00001222"){
           		//전송실
         	   team_data =  [  
         	                {depth:"0",upperCodeId:"*",codeId:"MO00000000112",codeName:"제주(T전송실)"}
         	                 ];
 			}
       		else{
           		//전송실
          	   team_data =  [  
          	                {depth:"0",upperCodeId:"*",codeId:"MO00000000199",codeName:"SKT미확인국사"}
          	                 ];
       		}
     	   
    	   $('#trmsMtsoId').clear();
    	   $('#trmsMtsoId').setData({
    		   data:team_data
    	   });    
    		
           $('#allcontents').setData(response);
       	}
       	else if(flag == 'updateFacilitiesProviderDetail'){	
        	alert('수정 되었습니다.');
       		$a.close();       		
       	}else
        if(flag == 'createFacilitiesProviderDetail'){	
           	alert('저장 되었습니다.');
        	$a.close();       		
        } 
       	
    }
    
	//serviceRequest 실패시.
    function failCallback(response, flag){
       	if(flag == 'getFacilitiesProviderDetailInfo'){
       		alert(response.__rsltMsg__);
       	}else
        if(flag == 'updateFacilitiesProviderDetail'){	
        	alert(response.__rsltMsg__);
        }else
        if(flag == 'createFacilitiesProviderDetail'){	
            	alert(response.__rsltMsg__);
        }
    }    
    
    function initSelectCode() {
    	

    	$('#divlesKndCd').setEnabled (false);
    	//설비종류 조회
    	searchCode({codeName:'lesKndCd', param1:$('#skAfcoDivCd').val(), param2:'6'});
 	   
 	   //전송실
  	   team_data =  [{depth:"0",upperCodeId:"*",codeId:"MO00000000110",codeName:"광주(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000108",codeName:"대구(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000114",codeName:"대전(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000113",codeName:"둔산(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000103",codeName:"보라매(T전송실)"},
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000107",codeName:"부산(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000104",codeName:"분당(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000102",codeName:"성수(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000106",codeName:"센텀(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000101",codeName:"수유(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000115",codeName:"원주(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000105",codeName:"인천(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000111",codeName:"전주(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000112",codeName:"제주(T전송실)"},  
  	                 {depth:"0",upperCodeId:"*",codeId:"MO00000000109",codeName:"태평(T전송실)"}];
 	   $('#trmsMtsoId').clear();
 	   $('#trmsMtsoId').setData({
 		   data:team_data
 	   }); 	
    }
    
    //이벤트 리스너 등록
    function setEventListener() {
    	//저장 버튼 Click Event Listener 등록
    	$('#bntSave').on('click', function(e) {
    		bntSaveClickEventHandler(e);
		});
	};
    
	//저장 버튼 Click Handler
	function bntSaveClickEventHandler(event){
		
		var param = $('#allcontents').getData();
		
		param.frstRegUserId = 'admin'; 
		param.lastChgUserId = 'admin';
		
		if(param.popupType == "I"){
		    serviceRequest('createFacilitiesProviderDetail','tango-transmission-biz/leasemgmt/demandfee/fctmgmt/createFacilitiesProviderDetail',param,'POST');
		}else
		if(param.popupType == "U"){
			serviceRequest('updateFacilitiesProviderDetail','tango-transmission-biz/leasemgmt/demandfee/fctmgmt/updateFacilitiesProviderDetail?method=put',param,'POST');
		}	
	}
	
	//본부 Change Event Listener 등록
	$('#hdofcOrgId').on('change', function(e) {
		//To-Do List
	});
});