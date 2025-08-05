var dataParam = null;
var gridDivision = "serviceLine";
var svlnLclCd = "";
var svlnSclCd = "";
var baseInfData = {};

$a.page(function() {

	var sFlag  = null;
	//var C00194Data = [];	// 용량데이터
	var CapaData = "";
	var vDataParam  = null;
	
	this.init  = function(id, param) {
		dataParam = param;
		sFlag = param.sFlag;
		svlnLclCd = param.svlnLclCd;
		svlnSclCd = param.svlnSclCd;

		vDataParam =  {"svlnNo":param.ntwkLineNo,"sFlag":param.sFlag};

//		console.log("팝업받는값 S");
//		console.log(param.utrdMgmtNo);	
		setPopSelectCode();	

		
		setPopEventListener();
    };

    function setPopSelectCode(){
    	
    	//  관할전송실정보  
    	//  리스트에서 넘길때 
    	//  {"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":"Y"}  수정모드
        //  {"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":"Y"}  관망모드
    	//  팝업JSP 추가할거 
    	//  <span style ="font-size: 12px;" id='sTmofInfoPop'></span>
        //  팝업JS  추가할거
        //  tmofInfoPop(dataParam, sFlag); 
    	
    	mtsoInfoByPathList(vDataParam, sFlag);  //일단 주석 
    	
    	
    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/04', null, 'GET', 'C00194Data');
     	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getServiceLineInfo', vDataParam, 'GET', 'getServiceLineInfo');		//여기서 리스트 필요한 부분 미리 세팅
    }
    
    function setPopEventListener() {
    	 
    	$('#close').on('click', function(e){
    		$a.close();
	    });
    	
    	$('#btn_close').on('click', function(e){
    		//$a.close();
    	});    	
    }

    
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
    	if(flag == 'getServiceLineInfo') {
    		$('#serviceLineInfoForm').setData(response);
    		if(nullToEmpty(response.lineCapaCdNm)==""){
    			response.lineCapaCdNm= " ";
    			CapaData = "-- " + cflineCommMsgArray['all'] + " --";
    		}else{
    			CapaData = response.lineCapaCdNm;
    		}
    		tmofInfo(sFlag,response);
    		
    		baseInfData = response;
    	}
    	
//    	//용량 데이터
//    	if(flag == 'C00194Data'){
//    		C00194Data = [{value: "",text: CapaData}];
//			for(var i=0; i<response.length; i++){
//    			var resObj = response[i];
//    			C00194Data.push(resObj);
//    		}
//    		$('#ntwkCapaNmS').clear();
//    		$('#ntwkCapaNmS').setData({data : C00194Data});
//    	}

    }
    
    
    function tmofInfo(sFlag,response){
    	var readonlyStr = "";
    	if(sFlag=="N"){
    		readonlyStr = "readonly";
    	}
		$('#popLineNmSpan').text(response.lineNm);
		$('#popSvlnNoSpan').text(response.svlnNo);
		$('#popSvlnLclCdNmSpan').text(response.svlnLclCdNm + " - " + response.svlnSclCdNm);
		$('#popLineCapaCdNmSpan').text(response.lineCapaCdNm);
		//document.getElementById("popLineNmSpan").innerHTML = response.lineNm;
//		console.log("response S");
//		console.log(response);
//		console.log("response E");
		
    }
    
    function failCallback(response, status, jqxhr, flag){
    	//alertBox('W', response.message);
    	//alert("실패");
    	//alertBox('I', "실패"); /* 실패 */
    }
   

});