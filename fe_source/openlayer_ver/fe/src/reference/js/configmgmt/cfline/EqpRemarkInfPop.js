/**
 * @ 2024년 기준 미사용 기능
 * 
 */
$a.page(function() {
	var eqpKey = "";
	var dataParm = null;
	
    this.init = function(id, param) {
    	eqpKey = param.eqpKey;
    	dataParm = param;
    	
    	if(eqpKey == "LEFT") {
    		$("#remark").val(param.lftEqpRmk);
    	} else if(eqpKey == "RIGHT") {
    		$("#remark").val(param.rghtRqpRmk);
    	}
    	
    	$('#btnConfirmPop').on('click', function(e){
    		var lftEqpRmk = "";
    		var rghtEqpRmk = "";
    		
    		if(eqpKey == "LEFT") {
    			lftEqpRmk = $("#remark").val();
    			rghtEqpRmk = dataParm.rghtEqpRmk;
    		} else if(eqpKey == "RIGHT") {
    			lftEqpRmk = dataParm.lftEqpRmk;
    			rghtEqpRmk = $("#remark").val();
    		}
    		
    		var params = {"ntwkLineNo" : dataParm.ntwkLineNo, "eqpSctnId" : dataParm.eqpSctnId, "lftEqpRmk" : lftEqpRmk, "rghtEqpRmk" : rghtEqpRmk};
    		
    		if(dataParm.division == 'serviceLine') {
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLineEqpRemark', params, 'POST', 'saveLineEqpRemark');
    		} else {
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNtwkEqpRemark', params, 'POST', 'saveNtwkEqpRemark');
    		}
    		
		});
    };
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url,
    		data : Param,
    		method : Method,
    		flag : Flag
    	}).done(successCallback)
    	  .fail(failCallback);
    }
    
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'saveLineEqpRemark' || flag == 'saveNtwkEqpRemark') {
    		$a.close();
    	}
    	
    }
    
    function failCallback(response, status, jqxhr, flag){
//    	if(flag == 'networkPathSearch' || flag == 'linePathSearch'){
//    		cflineHideProgress(detailGridId);
//    		alertBox('W', cflineMsgArray['searchFail']);  /* 조회 실패 하였습니다. */
//    	}
    }
    
    
});



