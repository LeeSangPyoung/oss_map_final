$a.page(function() {
    var stcEqpTypCd;
    var fctorDivCd;
    var divFctor;
    
    var aa;
	
	this.init = function(id, param) {
		stcEqpTypCd = param.stcEqpTypCd;
		fctorDivCd = param.fctorDivCd;
		aa = param.fctor;
		
		$('#textFactorNm').val(param.fctorNm);
		$('#textFactorVal').val(param.fctorEndVal);
		$('#textFactorSta').val(param.fctorStaVal);
		$('#textFactorEnd').val(param.fctorEndVal);
		$('#textFactorDesc').val(param.fctorDesc);
		
		if(param.fctorNm != null || param.fctorNm != ""){

			divFctor = param.fctor;
			if(param.fctor == 'traffic'){
				$('#divFactorVal').hide();
				$('#divFactorSta').show();
				$('#divFactorEnd').show();
			}else{
				$('#divFactorVal').show();
				$('#divFactorSta').hide();
				$('#divFactorEnd').hide();
			}
			
			setEvent();
			
		}				
    };
    
    function setEvent(){
        //저장 
        $('#btnSave').on('click', function(e) {
	  	    $('#modalDialog').open({
	  	    	title:'저장',
	  	    	width: 270,
	  	    	height: 150
		    });
	  	    
	   		$('#modalDialog').cancel(function() {
		 	    $('#modalDialog').close(); // Dialog를 닫기.
		 	});
				 
	   		$('#modalDialog').ok(function() {				   
		        //저장 한다고 하였을 경우
			    factorSave();
				    
			    $('#modalDialog').close(); // Dialog를 닫기.
			    $a.close();
		    });
	    });
        
        //취소
        $('#btnCancel').on('click', function(e){
        	$a.close();
        })
    }
    
    if($("#userId").val() == ""){
		 userId = "SYSTEM";
	 }else{
		 userId = $("#userId").val();
	 }
       
    function factorSave(){
    	var lastChgUserId;
        if ($("#userId").val()=='') {
        	lastChgUserId = 'SYSTEM'
        } else {
        	lastChgUserId = $("#userId").val(); 
        }
        
        var textFactorVal = null;  
        	if(aa == 'traffic'){
        		textFactorVal = $('#textFactorEnd').val().length == 1 ? '0' + $('#textFactorEnd').val() : $('#textFactorEnd').val()
			}else{
				textFactorVal = $('#textFactorVal').val().length == 1 ? '0' + $('#textFactorVal').val() : $('#textFactorVal').val()
			}
    	var paramData = {
    			 fctorDivCd : fctorDivCd
    		    ,stcEqpTypCd : stcEqpTypCd
    			,fctorNm : $('#textFactorNm').val()
    	        ,fctorStaVal : $('#textFactorSta').val().length == 1 ? '0' + $('#textFactorSta').val() : $('#textFactorSta').val()
    	        ,fctorEndVal : textFactorVal
    	        ,fctorDesc : $('#textFactorDesc').val()
    	        ,lastChgUserId : lastChgUserId 
    	};
    				 
        httpRequest('tango-transmission-biz/trafficintg/trafficeng/updateFactor', paramData, 'POST', 'FactorUpdate');
    }
    
  //request 실패시.
    function failCallback(response, status, flag){
    	//저장을 실패 하였습니다.
    	callMsgBox('','W', configMsgArray['saveFail'], function(msgId, msgRst){});
    	
    	var pageNo = $("#pageNo", parent.document).val();
		var rowPerPage = $("#rowPerPage", parent.document).val();
		if(divFctor == 'traffic'){
			$(parent.location).attr("href","javascript:main.setGridTraffic("+pageNo+","+rowPerPage+");");
		} else {
			$(parent.location).attr("href","javascript:main.setGridPreTraffic("+pageNo+","+rowPerPage+");");
		}
    }
    
    //request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'FactorUpdate') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){  
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       } 
    		});   
    	}

    	//장비 연동 정보 셋팅
    	if(flag == 'FactorUpdate') {
    	}
	}

    //request 호출
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
