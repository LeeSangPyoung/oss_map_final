var gridDivision = "ring";
//var gridDivision = "";
var dataParam = null;
var topoLclCd  = "001";
var topoSclCd  = "";
var topoLclNm  = "링";
var topoSclNm  = "";
var baseInfData = [];
 
$a.page(function() {
	var getOutInfoData = [];
	
	//처음에 화면 가져올때 리스트와 필요한 정보들을 셋팅
	this.init = function(id, param) {
		gridId = param.gridId;
		topoLclCd = param.topoLclCd;
		topoSclCd = param.topoSclCd;
	
		// 휘더망링, 가입자망링일 경우 '링구성도보기' 비활성화
		if(topoSclCd == "030" || topoSclCd == "031") {
			$("#btnRingblockDiagram").setEnabled(false);
		}
		
		tmofInfoPop(param, param.sFlag);
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getOutData', param, 'GET', 'search');		//여기서 리스트 필요한 부분 미리 세팅
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
    
    //데이터 가져오는게 성공했을때 이부분으로 CALLBACK
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search') {
    		if(response.getOutInfoData.length > 0) {
	    		$("#ntwkLineNo").val(response.getOutInfoData[0].ntwkLineNo);
	    		$("#ntwkLineNm").val(response.getOutInfoData[0].ntwkLineNm);
	        	$("#topoSclNm").val(response.getOutInfoData[0].topoSclNm);
	        	$("#ntwkCapaNm").val(response.getOutInfoData[0].ntwkCapaNm);
	        	$("#mgmtGrpCd").val(response.getOutInfoData[0].mgmtGrpCd);
	        	$("#mgmtOnrNm").val(response.getOutInfoData[0].mgmtOnrNm); // SKB ADAMS 연동 고도화
	        	$("#ntwkTypCd").val(response.getOutInfoData[0].ntwkTypCd);	//SKB CATV링의 예비선번구현을 위해 추가 2023-05-16
	        	baseInfData = response.getOutInfoData;
	        	baseInfData.fiveGponEqpMdlIdList = response.fiveGponEqpMdlIdList
    		}
    	}
    }
    
    function failCallback(status, jqxhr, flag){
    	
    }
});