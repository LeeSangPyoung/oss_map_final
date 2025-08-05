/**
 * CardMdlReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {
	
	
    
    //초기 진입점
	var paramData = null;
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	if(param.regYn == "Y"){
    		paramData = param;
    	}
    	
        setEventListener();
        setSelectCode();
        setRegDataSet(param);
        
        $("#eqpCtlgId").val("MIG");
    };
    
  //장비모델ID 생성
    function setEqpMdlId(data) {
    	if(paramData == null){
	    	var id = "DM"+ data +"*******";
			
	    	$("#eqpMdlIdReg").val(id);
    	}
    }
    
    function setRegDataSet(data) {
    	
    	if(data.regYn == "Y"){
    		$('#regYn').val("Y");
    		$('#lclReg').setEnabled(false);
    		$('#eqpMdlRegArea').setData(data);
    	}else{
    	}
    }
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	
    	//대분류 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00221', null,'GET', 'lclReg');
    	//용량 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/capa', null, 'GET', 'eqpCapaCdReg');
    	//슬롯형태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00147', null, 'GET', 'slotFrmDivCdReg');    	
    }
    
    function setEventListener() {
    	
    	//목록
    	 $('#btnPrevReg').on('click', function(e) {
    		 $a.close();
          });
    	 
    	//카달로그
	   	 $('#btnCtlgReg').on('click', function(e) {
    		 popupList('CtlgPop', $('#ctx').val()+'/configmgmt/portmgmt/CtlPop.do', '카달로그');
         });
	   	 
	   //대분류 선택시 이벤트
    	 $('#lclReg').on('change', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var codeID =  $("#lclReg").getData();
    		 
    		 if(codeID.lcl == ''){
    			 $('#lclReg').setData({
    	             data:[{comGrpCd: "", comCd: "",comCdNm: "선택", useYn: ""}]
        		});
    		 }else {
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00289/'+codeID.lcl, null,'GET', 'mclReg');
    		 }
    		 $('#sclReg').setData({
    			 data:[{comGrpCd: "", comCd: "",comCdNm: "선택", useYn: ""}]
    		 });
    		 
    		 setEqpMdlId(codeID.lcl);
         });
    	 
    	//중분류 선택시 이벤트
    	 $('#mclReg').on('change', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var codeID =  $("#mclReg").getData();

    		 if(codeID.mcl == ''){
    			 $('#sclReg').setData({
    	             data:[{comGrpCd: "", comCd: "",comCdNm: "선택", useYn: ""}]
        		});
    		 }else {
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00184/'+codeID.mcl, null,'GET', 'sclReg');
    		 }
         });
    	 
    	 $('#bpSearchReg').on('click', function(e) {
	   		 $a.popup({
	   	          	popid: 'bpSearchReg',
	   	          	title: false,
	   	            url: '/tango-common-business-web/business/popup/PopupBpList.do',
	   	            width : 750,
	   	           	height : window.innerHeight * 0.75,
	   	            modal: true,
                    movable:true,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행 
	   	                $('#bpIdReg').val(data.bpId);
	   	                $('#bpNmReg').val(data.bpNm);
	   	           	}
	   	      });
	     });
    	 
    	 $('#eqpWidhLenReg').keyup(function(e) {
     		 if(!$("#eqpWidhLenReg").validate()){
     			//장비가로(in) 입력은 숫자만 입력 가능합니다.
     			callMsgBox('','W', makeArgConfigMsg('requiredDecimal'," 장비가로(in) "), function(msgId, msgRst){});
     			$('#eqpWidhLenReg').val("");
     			 return;
     		 };
         });
 	 
    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });
    	 
    	//저장 
    	 $('#btnSaveReg').on('click', function(e) {
    		 
    		 var param =  $("#eqpMdlRegForm").getData();
	    	 
	    	 if (param.eqpCtlgId == "") {
	     		//필수 입력 항목입니다. [ 카탈로그ID ] 
	    		callMsgBox('','W', makeArgConfigMsg('required'," 카달로그ID "), function(msgId, msgRst){});
	     		return; 	
	     	 }
	     	 
	     	 if (param.eqpMdlNm == "") {
	     		//필수입력 항목입니다. [ 장비모델명 ] 
		    	callMsgBox('','W', makeArgConfigMsg('required'," 장비모델명 "), function(msgId, msgRst){});
	     		return; 	
	     	 }
	     	 
	     	 if (param.lcl == "") {
	     		//필수 선택 항목입니다.[ 대분류 ] 
		    	callMsgBox('','W', makeArgConfigMsg('requiredOption'," 대분류 "), function(msgId, msgRst){});
	     		return; 	
	     	 }
	     	
	     	 if (param.mcl == "") {
	     		//필수 선택 항목입니다.[ 중분류 ] 
			    callMsgBox('','W', makeArgConfigMsg('requiredOption'," 중분류 "), function(msgId, msgRst){});
	     		return; 	
	     	 }
	     	
	     	 if (param.scl == "") {
	     		//필수 선택 항목입니다.[ 소분류 ] 
				callMsgBox('','W', makeArgConfigMsg('requiredOption'," 소분류 "), function(msgId, msgRst){});
	     		return; 	
	     	 }
	     	 
	     	 if (param.bpId == "") {
	     		//필수입력 항목입니다. [ 협력업체 ] 
			    callMsgBox('','W', makeArgConfigMsg('required'," 협력업체 "), function(msgId, msgRst){});
	     		return; 	
	     	 }
	    	 
 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){  
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	eqpMdlReg();
 		        } 
 		      }); 
         });
    	 
	};
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'eqpMdlReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       } 
    		});   
    		
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();
    		
            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}
    	
    	if(flag == 'lclReg'){
			$('#lclReg').clear();
			$('#mclReg').clear();
			$('#sclReg').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택", useYn: ""}];
			
			$('#mclReg').setData({
	             data:option_data
			});
			
			$('#sclReg').setData({
				data:option_data
			});
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#lclReg').setData({
	             data:option_data
			});
			
			var codeID =  $("#lclReg").getData();
   		 
	   		if(codeID.lcl != ''){
	   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00289/'+codeID.lcl, null,'GET', 'mclReg');
	   		}
		}
		
		if(flag == 'mclReg'){
			$('#mclReg').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택", useYn: ""}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#mclReg').setData({
	             data:option_data
			});
			
			var codeID =  $("#mclReg").getData();
	   		 
	   		if(codeID.mcl != ''){
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00184/'+codeID.mcl, null,'GET', 'sclReg');
	   		}
		}
		
		if(flag == 'sclReg'){
			$('#sclReg').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택", useYn: ""}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#sclReg').setData({
	             data:option_data
			});
		}
    	
    	if(flag == 'eqpCapaCdReg'){
    		
    		$('#eqpCapaCdReg').clear();
    		
    		var option_data =  [{capaVal: "", capaCd: "",capaCdNm: "선택"}];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#eqpCapaCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#eqpCapaCdReg').setData({
    	             data:option_data,
    	             eqpCapaCd:paramData.eqpCapaCd
    			});
    		}
    	}
    	
    	if(flag == 'slotFrmDivCdReg'){
    		
    		$('#slotFrmDivCdReg').clear();
    		
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];
    		
    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		
    		if(paramData == '' || paramData == null) {
    			$('#slotFrmDivCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#slotFrmDivCdReg').setData({
    	             data:option_data,
    	             slotFrmDivCd:paramData.slotFrmDivCd
    			});
    		}
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpMdlReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpMdlReg() {
		   
		 var param =  $("#eqpMdlRegForm").getData();
		 
		 if(param.pwrDplxgYn == "YES"){
			 param.pwrDplxgYn = "Y";
		 }else{
			 param.pwrDplxgYn = "N";
		 }
		 
		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;
		 
    	 if($('#regYn').val() == "Y"){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/updateEqpMdlInf', param, 'POST', 'eqpMdlReg');
    	 }else{
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/insertEqpMdlInf', param, 'POST', 'eqpMdlReg');
    	 }
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
              });
        }
    
    function popupList(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
              });
        }
    
    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})
    	
    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;
		
		}
    }*/
    
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