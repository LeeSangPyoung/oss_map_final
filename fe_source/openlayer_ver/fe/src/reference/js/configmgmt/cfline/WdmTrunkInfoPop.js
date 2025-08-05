var dataParam = null;
var gridDivision = "wdm";
var topoLclCd  = "003";
var topoSclCd  = "101";
var topoLclNm  = "기간망트렁크";
var topoSclNm  = "WDM트렁크";
var baseInfData = [];

$a.page(function() {
	
	this.init = function(id, param) {
		dataParam = param;
		gridId = param.gridId;
		
		tmofInfoPop(param, param.sFlag);
		//여기서 리스트 필요한 부분 미리 세팅
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/getwdmtrunkinfo', param, 'GET', 'getWdmTrunkInfo');
    };
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
    	.fail(failCallback);
    }

    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'getWdmTrunkInfo') {
    		if(response != null){
    			$("#popNtwkLineNm").val(response.ntwkLineNm);	// 트렁크명
    			$("#popNtwkLineNo").val(response.ntwkLineNo); // 네트워크 회선번호
    			$("#popTopoSclNm").val(response.topoSclNm); // 망종류
    			$("#popNtwkCapaNm").val(response.ntwkCapaNm); // 용량
    			baseInfData = response;
    		}
    	}
    }
    
    function failCallback(status, jqxhr, flag){
    }
    
});
