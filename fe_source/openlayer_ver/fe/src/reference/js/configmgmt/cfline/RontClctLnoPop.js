/**
 * RontClctLnoPop.js
 *
 * @author p102700
 * @date 2016.01.24
 * @version 1.0
 * 
 * 
 ************* 수정이력 ************
 * 2018-05-30  1. [수정] WDM트렁크 기간망 형식으로 변경
 */
var mainGridId = 'mainGrid';
var lnoGridId = 'lnoGrid';
var addData = false;

var initParamPop = null;
var tsdnRontLineNo = null;   // WDM트렁크에서 TSDN기간망회선번호를 설정하기 위한 용도 
var sprTsdnRontLineNo = null;   // WDM트렁크에서 TSDN기간망회선번호를 설정하기 위한 용도 

$a.page(function() {
	this.init = function(id, param) {
		addData = false;
		initParamPop = param;
    	setSelectCode();
    	setEventListener();
    	// 선택버튼비활성화
    	$('#btnConfirmPop').setEnabled(false);
    	//중계구간 input box
    	inputEnableProc("linkPath1","linkPath2","");
    	inputEnableProc("linkPath2","linkPath3","");
    	inputEnableProc("linkPath3","linkPath4","");
    	inputEnableProc("linkPath4","linkPath5","");
    	
     	//	구간 DROP input box
 		inputEnableProc("transmissionStart","transmissionEnd","")
 		
 		// WDM수집선번인경우
 		if (nullToEmpty(initParamPop.topoLclCd) == "003" && nullToEmpty(initParamPop.topoSclCd) == "101") {
 			/*$('#lftEqpNm').val(initParamPop.wdmEqpNm);
 			$('#lftPortNm').val(initParamPop.wdmPortNm);*/
 			$('#popTitle').text(initParamPop.popTitle);
 			document.title= initParamPop.popTitle;
 		} else {
 			$('#popTitle').text(cflineMsgArray['rontClctLno']+cflineMsgArray['popup']);
 			document.title= cflineMsgArray['rontClctLno']+cflineMsgArray['popup'];
 		}
 		
 		/*if (nullToEmpty($('#lftEqpNm').val()) != '') {
 			$('#btnSearch').click();
 		}
 		
 		if (nullToEmpty($('#lftPortNm').val()) != '') {
 			$(".arrow_more").click();
 		}*/
    };
});

function setSelectCode() {
	// 기간망 회선타입
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01572', null, 'GET', 'capaType');
	// 보호모드
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01550', null, 'GET', 'protModeType');
	// 서비스유형
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01058', null, 'GET', 'rontTrkType');
	
	// 시스템/제조사 동적처리(2017-04-21)
	// 시스템(장비 역할)
	var chrrOrgGrpCd = "SKT";  // 기간망의 경우 고정
	var dataParam = {"mgmtGrpNm": chrrOrgGrpCd};
	//httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCd');
	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
	//제조사 조회
	//httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp/ALL', null,'GET', 'bp');
	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', dataParam,'GET', 'bp');
}

function setEventListener() {
 	// 엔터 이벤트 
 	$('#rontClctLnoForm').on('keydown', function(e){
 		if (e.which == 13  ){
 			addData = false;
 			fnSearch("main", true,"");
 	    	$('#btnConfirmPop').setEnabled(true);
 			//$('#'+lnoGridId).hide();
		}
 	});	      	
 	
 	// 국사 
 	$('#mtsoNm').on('propertychange input', function(e){
 		$("#mtsoId").val("");
 	});
 	
 	//조회버튼 클릭시
    $('#btnSearch').on('click', function(e) {
    	addData = false;
    	fnSearch("main", true,"");
    	$('#btnConfirmPop').setEnabled(true);
    	//$('#'+lnoGridId).hide();
    });

    //기간망트렁크정보 스크롤 이동시
   	$('#'+mainGridId).on('scrollBottom', function(e){
   		addData = true;
   		fnSearch("main", false,"");
 	});
	
//    //기간망트렁크 상세 목록 조회팝업(선번)
//    $('#'+mainGridId).on('dblclick', '.bodycell', function(e){
// 	 	var dataObj = AlopexGrid.parseEvent(e).data; 
//		var param = {"ntwkLineNo": dataObj.tsdnRontLineNo}
// 	 	fnSearch("lno", true, param);
// 	 	//showPopRontTrunkInfo( mainGridId, dataObj );
// 	});
    
    //기간망트렁크 상세 목록 조회팝업(선번)
    $('#'+mainGridId).on('click', '.bodycell', function(e){
    	var dataObj = AlopexGrid.parseEvent(e).data; 
    	var param = {"ntwkLineNo": dataObj.tsdnRontLineNo};
    	tsdnRontLineNo = dataObj.tsdnRontLineNo;
    	sprTsdnRontLineNo = dataObj.sprTsdnRontLineNo;
    	fnSearch("lno", true, param);
    	//showPopRontTrunkInfo( mainGridId, dataObj );
    });
    
	//중계구간 input box
 	$('#linkPath1').on('propertychange input', function(e){
 		inputEnableProc("linkPath1","linkPath2","")
 		inputEnableProc("linkPath2","linkPath3","")
 		inputEnableProc("linkPath3","linkPath4","")
 		inputEnableProc("linkPath4","linkPath5","")
 	});
 	$('#linkPath2').on('propertychange input', function(e){
 		inputEnableProc("linkPath2","linkPath3","")
 		inputEnableProc("linkPath3","linkPath4","")
 		inputEnableProc("linkPath4","linkPath5","")
 	});
 	$('#linkPath3').on('propertychange input', function(e){
 		inputEnableProc("linkPath3","linkPath4","")
 		inputEnableProc("linkPath4","linkPath5","")
 	});
 	$('#linkPath4').on('propertychange input', function(e){
 		inputEnableProc("linkPath4","linkPath5","")
 	});
    
 	//	구간 DROP input box
 	$('#transmissionStart').on('propertychange input', function(e){
 		inputEnableProc("transmissionStart","transmissionEnd","")
 	}); 	 	
 	
 	// 노드국사
 	$('#lftEqpInstlMtsoNm').on('propertychange input', function(e){
 		$("#lftEqpInstlMtsoId").val("");
 	});
 	
    // 노드 국사 조회
    $('#btnEqpInstlMtsoSch').on('click', function(e) {
		var paramValue = {
				"mgmtGrpNm": "SKB"
				//, "orgId": ""
				//, "teamId": ""
				, "mtsoNm": $('#lftEqpInstlMtsoNm').val()
				, "regYn" : "Y"
		};
		openMtsoDataPop("lftEqpInstlMtsoId", "lftEqpInstlMtsoNm", paramValue);
	});
 	
	// 닫기
	$('#btnClosePop').on('click', function(e) {
		$a.close();
    });
	
	// 선택 
	$('#btnConfirmPop').on('click', function(e) {
		var data =  $('#'+lnoGridId).alopexGrid("dataGet");
		//var data =  $('#'+mainGridId).alopexGrid("dataGet");
		//debugger;
		if(data.length >= 1){
			
			// WDM트렁크의 경우
			if (nullToEmpty(initParamPop.topoLclCd) == "003" && nullToEmpty(initParamPop.topoSclCd) == "101") {
				var updateData = [];
				$.each(data, function(idx, obj){
    				obj.TSDN_RONT_LINE_NO = tsdnRontLineNo;
    				obj.SPR_TSDN_RONT_LINE_NO = sprTsdnRontLineNo;
    				updateData.push(obj);
    			});
				data = updateData;
			}
			$a.close(data);
		}else{
			alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
			return;
		}
	});
	
	// 시스템/제조사 동적처리(2017-04-21)
	$('#lftEqpRoleDiv').on('change', function(e) {
		var dataParam = "mgmtGrpNm=SKT"
 		dataParam = dataParam+ "&comCdMlt1=" + $(this).val();
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', dataParam,'GET', 'bp');
	});
	
	// 닫기
	window.onunload = function(e){
		//$a.close();
	}
}

function successCallback(response, status, jqxhr, flag){
	//조회
	if(flag == 'searchMain') {
		//console.log(addData);
		var data = response.selectTsdnRontInfList;
		renderGrid(mainGridId, data, response.totalCount, addData);
		if(addData ){			
			//console.log("dataAdd");
			$('#'+mainGridId).alopexGrid("dataAdd", data);
			addData = false;
			cflineHideProgressBody();
		}else{
			$('#'+mainGridId).alopexGrid("dataSet", data);
			// 스크롤로 추가 검색이 아닌경우 기간망 기본정보가 검색된 경우 첫 데이터의 회선정보를 추가 검색
			if ($('#'+mainGridId).alopexGrid('dataGet').length>0) {
				var dataObj = $('#'+mainGridId).alopexGrid("dataGet", {_index : { data:0 }})[0];
				var param = {"ntwkLineNo": dataObj.tsdnRontLineNo};
				fnSearch("lno", true, param);
				tsdnRontLineNo = dataObj.tsdnRontLineNo;
				sprTsdnRontLineNo = dataObj.sprTsdnRontLineNo;
			} // 그이외의 경우 회선정보그리드를 클리어 한다.
			else {
				$('#'+lnoGridId).alopexGrid('dataEmpty');
				cflineHideProgressBody();
			}
		}
		cflineHideProgress(mainGridId);
		
		
		//cflineHideProgressBody();
	}
	else if(flag == 'searchLno') {
		//$('#'+lnoGridId).show();
		var data = "";
		if(response.data != undefined && response.data.LINKS != undefined) {
			data = response.data.LINKS;
			//console.log(response);
		} else {
			$('#'+lnoGridId).alopexGrid('dataEmpty');
		}
		//debugger;
		renderGrid(lnoGridId, data, "", addData);
		if(addData){
			$('#'+lnoGridId).alopexGrid("dataAdd", data);
			addData = false;
		}else{
			$('#'+lnoGridId).alopexGrid("dataSet", data);
		}
		cflineHideProgressBody();
		//cflineHideProgress(lnoGridId);
	}
	//회선유형
	else if(flag == 'capaType'){
		var allOption = [{value: "",text: cflineCommMsgArray['all']}]; /*전체*/
		$('#tsdnLineTypVal').setData({data : allOption.concat(response)});
	}
	//서비스유형
	else if(flag == 'rontTrkType'){
		var allOption = [{value: "",text: cflineCommMsgArray['all']}]; /*전체*/
		
		var rontTrkTypCd = [];
		var chkFltrgVal = "SKB";
		
		// 서비스 유형중 기간망에서 호출한 경우는 skb는 보여지면 안되고
		// wdm트렁크에서 호출한 경우는 skt가 보여지면 안됨
		if (nullToEmpty(initParamPop.topoLclCd) == "003" && nullToEmpty(initParamPop.topoSclCd) == "101") {
			chkFltrgVal = "SKT";
		}
			
		for (var i=0; i< response.length; i++) {
			if (response[i].useYn == "Y" && nullToEmpty(response[i].cdFltrgVal) != chkFltrgVal) {
				rontTrkTypCd.push(response[i]);
			}
		}
		
		$('#tsdnSrvcTypVal').setData({data : allOption.concat(rontTrkTypCd)});
	}
	// 보호모드
	else if(flag == 'protModeType'){
		protModeTypCd = response;
	}
	// 시스템 - 좌장비 역할 코드
	else if(flag == 'eqpRoleDivCd'){
		var allOption =  [{comCd: "", comCdNm: cflineCommMsgArray['all']/*전체*/}];
		$('#lftEqpRoleDiv').clear();
		$('#lftEqpRoleDiv').setData({data:allOption.concat(response) });
	}
	// 제조사
	else if(flag == 'bp'){
		var allOption =  [{comCd: "", comCdNm: cflineCommMsgArray['all']/*전체*/}];
		$('#lftVendorId').clear();
		$('#lftVendorId').setData({ data:allOption.concat(response)});
	}
}

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 
		data : Param, 
		method : Method,
		flag : Flag
	}).done(successCallback)
	  .fail(failCallback);
}

function failCallback(response, status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == 'searchMain'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	else if(flag == 'searchLno'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		$('#'+lnoGridId).alopexGrid('dataEmpty');
	}
	else {
		alertBox('I', cflineMsgArray['systemError']); /* 시스템 오류가 발생하였습니다. */
	}
}

function fnVaildation(dataList){
	var msgStr = "";
	var validate = true;
	var requiredColumn = { ntwkLineNm : cflineMsgArray['lnNm']};
	for(var i=0; i<dataList.length; i++){
		$.each(requiredColumn, function(key,val){
			var value = eval("dataList[i]" + "." + key);
			if(nullToEmpty(value) == ""){
				msgStr = "<br>"+dataList[i].ntwkLineNo + " : " + val;
				validate = false;
				return validate;
			}
     	});
		
		if(!validate){
    		alertBox('W', makeArgMsg('requiredMessage',msgStr,"","","")); /* 필수 입력 항목입니다.[{0}] */
    		//$('#'+gridWorkId).alopexGrid("startEdit");
    		return validate;
		}
	}
	return validate;
}

// info list row intex 
function setRowIndexInfo(changeSearch){
	if(changeSearch){
		$("#firstRow01").val(1);
   	    $("#lastRow01").val(20);
	} 
	else {
	 	if(addData){
	 		var first = parseInt($("#firstRow01").val());
	 		var last = parseInt($("#lastRow01").val());
	 		$("#firstRow01").val(first + 20);
	 		$("#lastRow01").val(last + 20);
	 	}
	}
	$("#firstRowIndex").val($("#firstRow01").val());
    $("#lastRowIndex").val($("#lastRow01").val());
}

// work list row intex
function setRowIndexWork(changeSearch){
	if(changeSearch){
		$("#firstRow02").val(1);
   	    $("#lastRow02").val(20);
	} else {
	     	if(addData){
	     		var first = parseInt($("#firstRow02").val());
	     		var last = parseInt($("#lastRow02").val());
	     		$("#firstRow02").val(first + 20);
	     		$("#lastRow02").val(last + 20);
	     	}
	}
	$("#firstRowIndex").val($("#firstRow02").val());
    $("#lastRowIndex").val($("#lastRow02").val());
}

// 검색
function fnSearch(sType, changeSearch,param) {
	if(sType == "main") {
		setRowIndexInfo(changeSearch);
	} else if(sType == "lno") {
		setRowIndexWork(changeSearch);
	}
	
	var paramData = $("#rontClctLnoForm").getData(); 
	
	paramData.topoLclCd = nullToEmpty(initParamPop.topoLclCd);
	paramData.topoSclCd = nullToEmpty(initParamPop.topoSclCd);
	paramData.wkSprDivCd = nullToEmpty(initParamPop.wkSprDivCd);
	
	if($('#lftEqpRoleDiv').val() != "" || $('#lftVendorId').val() != "" 
		|| $('#lftEqpInstlMtsoNm').val() != ""|| $('#lftEqpNm').val() != "" 
		|| $('#lftCardMdlNm').val() != "" || $('#lftShlfNm').val() != "" 
		|| $('#lftSlotNo').val() != "")
	{
		$.extend(paramData,{searchSystem : true });
	}
	cflineShowProgressBody();
	if (sType == "main") {
		
		if (addData != true) {
			$('#'+mainGridId).alopexGrid('dataEmpty');
			$('#'+lnoGridId).alopexGrid('dataEmpty');
		}
		//console.log(paramData);
		
		//cflineShowProgress(mainGridId);	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rontClctLno/selectTsdnRontInfList', paramData, 'GET', 'searchMain');
	}else if (sType == "lno") {
		//cflineShowProgress(lnoGridId);	
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rontClctLno/selectTsdnRontInfList', param, 'GET', 'searchLno');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/rontClctLno/selectTsdnRontLnoInfList', param, 'GET', 'searchLno');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectRontNetworkAutoCollectPath', param, 'GET', 'searchLno');
		
	}
}
