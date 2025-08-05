var dataParam = null;
var gridDivision = "serviceLine";
var svlnLclCd = "";
var svlnSclCd = "";
var baseInfData = {};
var mgmtGrpCd = "";
var autoClctYn = "";
var mgmtOnrNm = "";

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
		mgmtGrpCd = param.mgmtGrpCd;
		autoClctYn = param.autoClctYn;
		
		//ADAMS 연동 관리주체 설정 - 2020-04-09
		mgmtOnrNm = param.mgmtOnrNm;
		
		// 기지국회선 - LTE회선, 기지국회선 - 5G, 기지국회선 - WCDMA(IPNB)수집일경우 ,RU회선 - RU회선  편집 불가
		// 20180202 skt-b2b회선, skt-기타-기타회선 편집 오픈처리 
		if( (svlnLclCd == "001" && (svlnSclCd == "016" || (svlnSclCd == "020" && autoClctYn == "Y" )|| svlnSclCd == "030") ) || (svlnLclCd == "003" && svlnSclCd == "103") 
				/*|| ( mgmtGrpCd =="0001" && ((svlnLclCd == "005") || (svlnLclCd == "006" && svlnSclCd =="005")) )*/
		) {
			$("#btnRegEqp").setEnabled(false);
			$("#btnPahViaualEdit").setEnabled(false);
			$("#btnPathDelete").hide();
			$("#btnSave").hide();			
		}
		
		//TODO 2019-10-23
		//RU회선이면서 CMS회선인 경우 autoClctYn = 'N' 인 경우에는 편집가능
		if(svlnSclCd == "103" && autoClctYn == "N") {
			$("#btnRegEqp").setEnabled(true);
			$("#btnPahViaualEdit").setEnabled(true);
			$("#btnPathDelete").show();
			$("#btnSave").show();	
		}
		
		
		// RU-광코어회선일경우 WEST채널표시, EAST채널표시를 보여주고 Default 체크 풀기
		if(svlnLclCd == "003" && svlnSclCd == "101") {
			$("#westChannelDisplayCheckbox").show();
			$("#eastChannelDisplayCheckbox").show();
		}
		
		vDataParam =  {"svlnNo":param.ntwkLineNo,"sFlag":param.sFlag};

//		console.log("팝업받는값 S");
//		console.log(param.utrdMgmtNo);	
		setPopSelectCode();	

		
		setPopEventListener();
		
		//20180222 긴급배포 - teams 연동관련하여 선번편집 상단 표출 메세지 추가 -SKT 선번창 에만 보이도록
		if(mgmtGrpCd == '0001'){
			$("#infoText").html("※ 선번 저장 이후 선번 정보가 연동되어 TEAMS 통계 및 감시에 영향을 주므로 정확하게 선번 정보를 입력하여 주시기 바랍니다.");
		}else if(mgmtGrpCd == '0002'){
			$("#infoText").html("");
		}
		
		
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
    	
    	
    	// 광코어  FDF 선번동기화 
//    	$('#btnOptServiceOptlPop').on('click', function(e) {	
////    		console.log(baseInfData);
////    		console.log("baseInfData.svlnNo=====================" + baseInfData.svlnNo);
////    		console.log("baseInfData.optlShreRepSvlnNo=====================" + baseInfData.optlShreRepSvlnNo);
//    		openOptlShreRepSvlnPop(baseInfData.optlShreRepSvlnNo, baseInfData.svlnNo);
//    	});
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
		
		//"svlnLclCd":"005","svlnSclCd":"009"
		if(response.svlnLclCd == "005" && response.svlnSclCd == "009"){
			if(response.srvcMgmtNo == undefined && response.scrbSrvcMgmtNo == undefined){
				$('#popSvlnNoSpan').text(response.svlnNo);
			}else{
				$('#labelServiceManagementNumber').html("서비스관리번호"+"<br>/ "+"가입서비스관리번호");
				var srvcMgmtNoView = response.srvcMgmtNo;
				var scrbSrvcMgmtNoView = response.scrbSrvcMgmtNo;
				if(response.srvcMgmtNo == undefined){
					srvcMgmtNoView = "";
				}
				if(response.scrbSrvcMgmtNo == undefined){
					scrbSrvcMgmtNoView = "";
				}
				$('#popSvlnNoSpan').text(srvcMgmtNoView+" / "+scrbSrvcMgmtNoView);
			}
		}else{
			$('#popSvlnNoSpan').text(response.svlnNo);
		}
		$('#popSvlnLclCdNmSpan').text(response.svlnLclCdNm + " - " + response.svlnSclCdNm);
		$('#popLineCapaCdNmSpan').text(response.lineCapaCdNm);
		$("#mgmtGrpCd").val(response.mgmtGrpCd);
		//document.getElementById("popLineNmSpan").innerHTML = response.lineNm;
//		console.log("response S");
//		console.log(response);
//		console.log("response E");
		
    }
    
    function failCallback(status, jqxhr, flag){
    	//alertBox('I', "실패"); /* 실패 */
    }

});