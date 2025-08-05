var dataParam = null;
var gridDivision = "trunk";
var topoLclCd  = "002";
var topoSclCd  = "100";
var topoLclNm  = "트렁크";
var topoSclNm  = "트렁크";
var baseInfData = [];
var mgmtGrpCd = "";

$a.page(function() {

	//var gridId = 'pathGrid';
	var sFlag  = null;
	var C00194Data = [];	// 용량데이터
	var CapaData = "";
	var vDataParam  = null;
	

  
	
	this.init  = function(id, param) {
		dataParam = param;
		sFlag = param.sFlag;
		mgmtGrpCd = param.mgmtGrpCd;
		// 20180202 트렁크 편집 오픈으로 인한 소스 주석
		/*if(dataParam.mgmtGrpCd == "0001") {
			$("#btnRegEqp").setEnabled(false);
			$("#btnPathDelete").hide();
			$("#btnSave").hide();			
		}*/

		vDataParam =  {"ntwkLineNo":param.ntwkLineNo,"sFlag":param.sFlag};
		
/*		if(sFlag == "Y"){
			$('#popInfoNtwkLineNm').setEnabled(true);
		}else if(sFlag =="N" ) {
			$('#popInfoNtwkLineNm').setEnabled(false);   
		}*/
		
		/*
		//console.log("팝업받는값 S");
		//console.log(param);
		//console.log("가공 S");
		//console.log(vDataParam);
		////console.log(sFlag);
		////console.log(dataParam.ntwkLineNo);
		//console.log("팝업받는값 E");
		*/
		setSelectCode();	
		//initGrid();
		
		setEventListener();
    };
    /*
    function initGrid(){
    	$('#'+gridId).alopexGrid({
    		pager : false,
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		alwaysShowHorizontalScrollBar : true,
    		rowClickSelect : true,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false,
			columnMapping:column() 
        }); 
    }
    
    function column() {
    	var column = [
					{ selectorColumn : true, width : '50px' } 
					, {key : 'check',align:'center',			width:'60px',			title : '번호',			numberingColumn : true		}
					,{key : 'ntwkLineNm'	        , title : '트렁크명'            		 , align:'left'		, width: '180px'}  
    	            ];
    	return column;
    }
    */
    function setSelectCode(){
    	
    	//  관할전송실정보  
    	//  리스트에서 넘길때 
    	//  {"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":"Y"}  수정모드
        //  {"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":"Y"}  관망모드
    	//  팝업JSP 추가할거 
    	//  <span style ="font-size: 12px;" id='sTmofInfoPop'></span>
        //  팝업JS  추가할거
        //  tmofInfoPop(dataParam, sFlag); 
    	
    	tmofInfoPop(vDataParam, sFlag);  //일단 주석 
    	
    	
    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data');
     	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getTrunkInfo', vDataParam, 'GET', 'getTrunkInfo');		//여기서 리스트 필요한 부분 미리 세팅
    }
    
    function setEventListener() {
    	 
    	$('#close').on('click', function(e){
    		$a.close();
	    });
    	
    	$('#btn_close').on('click', function(e){
    		//$a.close();
    		
    		//console.log("vTmofInfo S");
    		//console.log(vTmofInfo);
    		//console.log("vTmofInfo E");
    		
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
    	if(flag == 'getTrunkInfo') {
    		$('#trunkInfoForm').setData(response);
    		if(nullToEmpty(response.ntwkCapaNm)==""){
    			response.ntwkCapaNm= " ";
    			CapaData = "-- 전체 --";
    		}else{
    			CapaData = response.ntwkCapaNm;
    		}
    		//tmofInfo(sFlag,response.ntwkLineNm,response.ntwkCapaNm);
    		
    		baseInfData = response;
    	}
    	
    	/*//용량 데이터
    	if(flag == 'C00194Data'){
    		C00194Data = [{value: "",text: CapaData}];
			for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			C00194Data.push(resObj);
    		}
    		$('#ntwkCapaNmS').clear();
    		$('#ntwkCapaNmS').setData({data : C00194Data});
    	}*/
    	
    	/*if(flag == 'getTrunkInfo') {
    		$('#trunkInfoForm').setData(response);
    		if(nullToEmpty(response.ntwkCapaNm)==""){
    			response.ntwkCapaNm= " ";
    			CapaData = "-- 전체 --";
    		}else{
    			CapaData = response.ntwkCapaNm;
    		}
    		tmofInfo(sFlag,response.ntwkLineNm,response.ntwkCapaNm);
	    		$("#popInfoNtwkLineNm").val(response.ntwkLineNm);
	    		$("#popInfoNtwkLineNo").val(response.ntwkLineNo);
	    		$("#popInfoTopoSclNm").val(response.topoSclNm);
	        	$("#popInfoNtwkCapaNm").val(response.ntwkCapaNm);
    	}*/
    }
    
    
    function tmofInfo(sFlag,LineNm,CapaNm){
    	
    	//WDM트렁크 정보
    	if(sFlag=="N"){
    		LineNmSpan = "<input type='text' id='popInfoNtwkLineNm' name='ntwkLineNm' class='Textinput textinput wFull' style = 'border:0px;' value='"+LineNm+"' readonly>";	
    		document.getElementById("NtwkLineNmSpan").innerHTML = LineNmSpan;
    		
    		CapaNmSpan = "<input type='text' id='ntwkCapaNmS' name='ntwkCapaNm' class='Textinput textinput wFull' style = 'border:0px;' value='"+CapaNm+"' readonly>";	
    		document.getElementById("ntwkCapaNmSpan").innerHTML = CapaNmSpan;

    	//WDM트렁크 작업정보
    	}else{
    		sapnCh = "<input type='text' id='popInfoNtwkLineNm' name='ntwkLineNm' class='Textinput textinput wFull'value='"+LineNm+"'>";	
    		document.getElementById("NtwkLineNmSpan").innerHTML = sapnCh;
    		
    		CapaNmSpan = "<select name='ntwkCapaCd' id='ntwkCapaNmS' data-bind='options:data, selectedOptions: ntwkCapaCd' data-bind-option='value:text' data-type='select'></select>";	
    		document.getElementById("ntwkCapaNmSpan").innerHTML = CapaNmSpan;

    	}
    }
    
    function failCallback(status, jqxhr, flag){
    	/*alert("실패");*/
    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    }
   

});