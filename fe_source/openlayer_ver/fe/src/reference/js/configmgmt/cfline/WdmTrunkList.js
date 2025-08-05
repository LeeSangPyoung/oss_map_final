/**
 * 
 * <ul>
 * <li>업무 그룹명 : tango-transmission-web</li>
 * <li>설 명 : WdmTrunkList.js</li>
 * <li>작성일 : 2016. 9. 19.</li>
 * <li>작성자 : ohjungmin(posgen)</li>
 * </ul>
 *  
 ************* 수정이력 ************
 * 2018-05-30  1. [수정] WDM트렁크 기간망 형식으로 변경
 * 2020-04-16  2. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 */
 
var gridId = 'dataGrid';
var gridIdWork = 'dataGridWork';
var C00194Data = [];	// 용량데이터
var eqpMdlList = [];	// 장비모델데이터
var msgVal = "";		// 메시지 내용
var addData = false;
var maxPathCount = 0;
var maxPathCountWork = 0;
var jobInstanceId = "";

var pageForCount = 200;

// 해지시 자동 수정 대상 테이블에서 삭제 처리
var procAcceptTargetList = null;

$a.page(function() {
	this.init = function(id, param) {
		//버튼 비활성화 설정
    	$('#btnExportExcel').setEnabled(false);
    	$('#btnDupMtsoMgmt').setEnabled(false);
//    	$('#btnWorkCnvt').setEnabled(false);
    	
    	$('#btnLineTrmn').setEnabled(false);
    	$('#btnUpdate').setEnabled(false);
    	$('#sWorkGrpWhereUse').setChecked(true);
    	
    	// input text box
    	inputEnableProc("lftEqpNm","lftPortNm","")
    	inputEnableProc("rghtEqpNm","rghtPortNm","")
		   
		//기본 정보 셋팅
    	setSelectCode();
    	
    	//이벤트 셋팅
    	setEventListener();
    	
    	procAcceptTargetList = null;
    	
    };
});

   
function setSelectCode() {
	// 관리그룹 설정
    setUserMgmtCd($('#userMgmtCd').val());
	
	// 본부, 팀, 전송실
	//	setSearchCode2("0002","hdofcCd", "teamCd", "topMtsoIdList");
	setSearch2Code("hdofcCd", "teamCd", "topMtsoIdList","A");

	// 관리 그룹 selectBox
	createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());
	
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data');
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selecteqpmdlbas', null, 'GET', 'eqpMdlList');
	
	// 검색용 장비모델
	var eqpMdlParm =  {"neRoleCd" : null, "partnerNeId" : null, "wdmYn" : null};
	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/geteqpmdllist', eqpMdlParm, 'GET', 'eqpMdlIdList');
	
	// 사용자 소속 전송실
	searchUserJrdtTmofInfo("topMtsoIdList");
	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'getUserJrdtTmofInfo');
}

function setEventListener() {
 	// 엔터 이벤트 
 	$('#searchForm').on('keydown', function(e){
 		if (e.which == 13  ){
 			fnSearch("A", true);
		}
 	});
 	
 	// 좌장비
 	$('#lftEqpNm').on('propertychange input', function(e){
 		inputEnableProc("lftEqpNm","lftPortNm","");
 	});
 	
 	// 우장비
 	$('#rghtEqpNm').on('propertychange input', function(e){
 		inputEnableProc("rghtEqpNm","rghtPortNm","");
 	});
 	
 	// 국사 
 	$('#mtsoNm').on('propertychange input', function(e){
 		$("#mtsoId").val("");
 	});
 	
 	// 파장/주파수
   	$('#'+gridIdWork).on('propertychange input', '#schVal',function(e){
   		var dataObj = AlopexGrid.parseEvent(e).data;
		var rowIndex = dataObj._index.row;
		if(dataObj._key == "wavlVal"){
			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmBdwthVal");
 			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmChnlVal");
			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmFreqVal");
		}
   	});
 	
 	//탭 선택 이벤트
    $("#basicTabs").on("tabchange", function(e, index) {
 		if(index == 0) {
 			$('#'+gridId).alopexGrid("viewUpdate");	 
 			$('#btnDupMtsoMgmt').setEnabled(false); //전송실설정
 		} else if(index == 1) {
 			$('#'+gridIdWork).alopexGrid("viewUpdate");
 			btnEnableProc2(gridIdWork, "btnDupMtsoMgmt");
 		}
 		
 		// ADAMS 연동 고도화
		if($('#mgmtGrpCd').val() == "0001" && $('#mgmtGrpCd').val() !=''){
			$('#btnReg').setEnabled(true); 
		} else {
			$('#btnReg').setEnabled(false); 
	//		$('#btnDupMtsoMgmt').setEnabled(false); 
			$('#btnLineTrmn').setEnabled(false); 
			$('#btnUpdate').setEnabled(false); // 작업저장은 필요 
		}
		
 	});
    
 	$('#tab2').on("click", function(e){
 		
 	    // ADAMS 연동 고도화 추가
 		var object = AlopexGrid.parseEvent(e);
 		var dataObj = object.data;
 		
 		btnEnableProc2(gridIdWork, "btnDupMtsoMgmt");
 		btnEnableProc2(gridIdWork, "btnLineTrmn");
 		btnEnableProc2(gridIdWork, "btnUpdate");
 		
 		//ADAMS 연동 고도화
	 	if($('#mgmtGrpCd').val() == "0001" && dataObj.mgmtGrpCd == "0001" && $('#mgmtGrpCd').val() !=''){
			$('#btnReg').setEnabled(true); 
		} else {
			$('#btnReg').setEnabled(false); 
	//		$('#btnDupMtsoMgmt').setEnabled(false); 
			$('#btnLineTrmn').setEnabled(false); 
			$('#btnUpdate').setEnabled(false); // 작업저장은 필요 
		}
	});
	
 	// 관리그룹 선택시
 	$('#mgmtGrpCd').on('change',function(e){
		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "topMtsoIdList", "mtso");
		
		//ADAMS 연동 고도화
		if($('#mgmtGrpCd').val() == "0001" && $('#mgmtGrpCd').val() !=''){
			$('#btnReg').setEnabled(true); 
		} else {
			$('#btnReg').setEnabled(false); 
//			$('#btnDupMtsoMgmt').setEnabled(false); 
			$('#btnLineTrmn').setEnabled(false); 
		}
   	});
 	
 	 // ADAMS 연동 고도화
 	$('#tab2Header').on("click", function(e){
 	  if($('#mgmtGrpCd').val() == '0002' || $('#mgmtGrpCd').val() == ''){
 		 $('#'+gridIdWork).alopexGrid('endEdit');
		}
	});
 	
	// 본부 선택시
	$('#hdofcCd').on('change',function(e){
		changeHdofc("hdofcCd", "teamCd", "topMtsoIdList", "mtso");

 		/*var userInfo = {
 			  userHdofcCd : $('#userHdofcCd').val()
 			, userTeamCd : $('#userTeamCd').val()
 			, userJrdtTmof : userTmof
 		}; */			
  	});    	 
	// 팀 선택시
	$('#teamCd').on('change',function(e){
		changeTeam("teamCd", "topMtsoIdList", "mtso");
  	});      	 
	
	// 관할전송실 설정
 	$('#btnDupMtsoMgmt').on('click', function(e) {
 		changeSearch = false;
 		var element =  $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
		var selectCnt = element.length;
		
		if(selectCnt < 1){
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */
		}else{
			var paramMtso = null;
			var paramList = [element.length];
			var mgmtGrpChk = "N";
			var mgmtGrpStr = "";
			
			if(selectCnt==1){
				paramMtso = {"multiYn":"N", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "ntwkLineNoList":[element[0].ntwkLineNo]};
			}else{
				
				for(i=0;i<element.length;i++){
					paramList[i] = element[i].ntwkLineNo;
					
					if(i==0){
						mgmtGrpStr = element[0].mgmtGrpCd;
					}
					if(i>0 && mgmtGrpStr != element[i].mgmtGrpCd){
						mgmtGrpChk = "Y";
					}
				}

				if(mgmtGrpChk == "Y"){
					alertBox('W', cflineMsgArray['multiMtsoRegSameMngrGrpPoss']);/*여러 회선에 대한 전송실 등록시 동일 관리그룹만 가능합니다.*/
					return;
				}
				paramMtso = {"multiYn":"Y", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "ntwkLineNoList":paramList};
			}
	 
    		$a.popup({
    		  	popid: "TmofEstPop",
    		  	title: cflineMsgArray['jrdtTmofEst'], /* 관할전송실설정 */
    			url: $('#ctx').val()+'/configmgmt/cfline/TmofEstPop.do',
    			data: paramMtso,
    		    iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 1000,
    			height : 800,
    			callback:function(data){
    					if(data != null){
    						if (data=="Success"){
    							fnSearch("A", true);
     						}
    					}
    			}
    		});
		}	 
    });
	
 	// 조회버튼 클릭시
    $('#btnSearch').on('click', function(e) {
     	fnSearch("A", true);
    });

    //WDM트렁크정보 스크롤 이동시
   	$('#'+gridId).on('scrollBottom', function(e){
   		addData = true;
   		fnSearch("T", false);	     	
 	});
   	//WDM트렁크 작업정보 스크롤 이동시
   	$('#'+gridIdWork).on('scrollBottom', function(e){
   		addData = true;
   		fnSearch("W", false);
 	});
   	
   	// 해지회선 
   	$('#btnLineTrmn').on('click', function(e) {
   		fnLineTerminate();
	});
 
   	//작업정보저장
    $('#btnUpdate').on('click', function(e) {
    	fnUpdate();
    });

    //등록
    $('#btnReg').on('click', function(e){
    	$a.popup({
    		popid: 'PopWdmTrunkWrite',
          	title: cflineMsgArray['registration'],
            url: $('#ctx').val()+'/configmgmt/cfline/WdmTrunkWritePop.do',
			iframe: true,
			modal : false,
			movable : true,
			windowpopup : true,
			width : 1200,
			height :1050,   				   	          
			callback:function(data){
				if(data != null){
					if (data.Result=="Success"){
						/* 저장을 완료 하였습니다.*/
						callMsgBox('','I', cflineMsgArray['saveSuccess'], function(msgId, msgRst){
				       		if (msgRst == 'Y') {
				       			fnSearch("A", true);
				       			// 현재 탭에따라 그리드 값 전달
				       			//var currentGrid = ($("#basicTabs").getCurrentTabIndex() == 0 ? gridId: gridIdWork);
				       			//showEditPopWdmTrunkInfo( "dataGridWork", data.dataObj );

				    			// 다른 팝업에 영향을 주지않기 위해
				    			$.alopex.popup.result = null; 
				       		}
						});
					}else{
		    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
		    		} 
				}
			}
    	});
    	
    });
    
    // 파장/주파수 검색
   	$('#'+gridIdWork).on('keyup', '#schVal',function(e){
   		if(e.keyCode == 13) {
   			searchWavl(e);
   		}
   	});
 	$('#'+gridIdWork).on('click', '#btnWavlSch', function(e){
 		searchWavl(e);
	});
 	
	
 	// 장비 변경
 	$('#'+gridIdWork).on('cellValueEditing', function(e){
 		var evObj = AlopexGrid.parseEvent(e);
 		if(evObj.mapping.key == "wdmEqpMdlId" && evObj.value != evObj.prevValue){
 			var rowIndex = evObj.data._index.row;
 			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmBdwthVal");
 			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wavlVal");
 			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmChnlVal");
			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmFreqVal");
 		}
   	});
 	
 	//작업전환
//    $('#btnWorkCnvt').on('click', function(e) {
//    	fnWorkCnvt();
//     });
    
    //국사 조회
	$('#btnMtsoSch').on('click', function(e) {
		var paramValue = {    "mgmtGrpNm": $('#mgmtGrpCd option:selected').text()
							, "orgId": $('#hdofcCd').val()
							, "teamId": $('#teamCd').val()
							, "mtsoNm": $('#mtsoNm').val()
							, "regYn" : "Y"
						};
		
		openMtsoDataPop("mtsoId", "mtsoNm", paramValue);
		
	});     
	
	//장비 조회
	$('#btnEqpSch').on('click', function(e) {
		openEqpPop("eqpId", "eqpNm");
	}); 
	
	//포트 조회
	$('#btnPortSch').on('click', function(e) {
		openPortPop("portId", "portNm");
	}); 		
    
    //엑셀다운로드
    $('#btnExportExcel').on('click', function(e) {
    	funExcelBatchExecute();
    	
     	/*cflineShowProgressBody();
    	var dataParam = $.param(getExcelParam(), true);
    	var fileModel = Tango.ajax.init({
    		url: 'tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/getwdmtrunklistexceldown?' + dataParam,
    		dataType: 'binary',
    		responseType: 'blob',
    		processData: false
    	});
    	
    	fileModel.get().done(excelDownSucc)
    	   .fail(function(response){failCallback(response);});*/
    });    	
    
    // TODO
    //WDM트렁크 정보 상세 목록 조회팝업
    $('#'+gridId).on('dblclick', '.bodycell', function(e){
 	 	var dataObj = AlopexGrid.parseEvent(e).data; 
 	 	//showWdmTrunkEditPop( gridId, dataObj );
	 	showPopWdmTrunkInfo( gridIdWork, dataObj , "N");
 	}); 
    
    //WDM트렁크 작업정보 상세 목록 조회팝업
    $('#'+gridIdWork).on('dblclick', '.bodycell', function(e){
 	 	var dataObj = AlopexGrid.parseEvent(e).data; 
 	 	//showWdmTrunkEditPop( gridIdWork, dataObj);
 	 	showPopWdmTrunkInfo( gridIdWork, dataObj , "Y");
 	});
    
	// 20171116 E2E,시각화편집 버튼 클릭 이벤트
	$('#'+gridId).on('click', '#btnE2ePop', function(e){  
		intgE2ETopo(gridId);
	}).on('click', '#btnServiceLIneInfoPop', function(e){  
		var dataObj = AlopexGrid.parseEvent(e).data;
		showPopWdmTrunkInfo( gridId, dataObj, "N");
	});
	$('#'+gridIdWork).on('click', '#btnE2ePop', function(e){  
		intgE2ETopo(gridIdWork);
	}).on('click', '#btnServiceLIneInfoPop', function(e){  
		var dataObj = AlopexGrid.parseEvent(e).data;
		showPopWdmTrunkInfo( gridIdWork, dataObj, "Y");
	});
	
	// 자동수정대상보기
 	$('#btnShowAutoProcTarget').on("click", function(e){
 		var dataList =  $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
 		if( dataList.length == 0) {
 			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
 			return;
 		}
 		
 		if(dataList.length > 1){
 			alertBox('W', cflineMsgArray['selectOnlyOneItem']/* 여러개가 선택되었습니다. 하나만 선택하세요. */); 
			return;
 		} else {
 			var url =  $('#ctx').val()+'/configmgmt/cfline/NetworkPathAutoProcAcceptListPop.do';
 			
 			var dataObj = dataList[0];
 			var dataParam = {
 								"ntwkLineNo":dataObj.ntwkLineNo
 							  , "topoLclCd" : dataObj.topoLclCd
 							  , "ntwkLineNm" : dataObj.ntwkLineNm
 							  , "detailTitle" : cflineMsgArray['autoModificationObjectList'],		/* 자동수정대상목록 */
 							}
 			
 			$a.popup({
 	 	       	popid: "AutoProcTargetListPop",
 	 	       	title: cflineMsgArray['autoModificationObjectList'],		/* 자동수정대상목록 */
 	 	        iframe: true,
 				modal: false,
 				movable:true,
 				windowpopup : true,
 				
 	            url: url,
 	            data: dataParam,
 	            width : 1400,
 	            height : 850, 
 	            callback: function(data) { 	        	   
 	        	   //
 	          	}
 	 	    });
 		}	
    });
 	
 	$('#sAllPass').on("click", function(e){
 		if ($("input:checkbox[id='sAllPass']").is(":checked") == false ){ 	 		
 	 		$('#sOldWdmType').setChecked(false);
 		}
 	});

 	$('#sOldWdmType').on("click", function(e){
 		if ($("input:checkbox[id='sOldWdmType']").is(":checked") == true ){ 	 		
 	 		$('#sAllPass').setChecked(true);
 		}
 	});
}

function excelDownSucc(response){
	cflineHideProgressBody();
	var url = window.URL.createObjectURL(response),
	file = $('#fileName').val() + ".xlsx",
	$a = $('<a href="'+ url +'" download="'+ file +'"></a>');	
	$a.appendTo('body');
	$a[0].click();
	$a.remove();
}

function getExcelParam(){
	var dataParam =  $("#searchForm").getData();
 	$.extend(dataParam,{"topoLclCd":"003", "topoSclCd":"101", "fileExtension" : "xlsx", "excelPageDown":"N", "excelUpload":"N"});
 	
 	var sTabIndex = $('#basicTabs').getCurrentTabIndex();
 	if(sTabIndex == "0"){
 		dataParam.method = "wdmTrunkInfo";
 		dataParam.fileName = cflineMsgArray['wdmTrunk']+cflineMsgArray['information']; /*WDM트렁크정보*/
 		dataParam.workListYn = "N";
 	}else if(sTabIndex == "1"){
 		dataParam.method = "wdmTrunkWorkInfo";
 		dataParam.fileName = cflineMsgArray['wdmTrunk']+cflineMsgArray['work']+cflineMsgArray['information']; /*WDM트렁크작업정보*/
 		dataParam.workListYn = "Y";
 	}
 	
	$('#fileName').val(dataParam.fileName + "_" + getCurrDate());
	
 	return dataParam;
}

// 작업전환
function fnWorkCnvt(){
	if( $('#'+gridId).length == 0) return;
	var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
	var paramDataList = [];	

	if (dataList.length > 0 ){
		cflineShowProgressBody();
		for(k=0; k<dataList.length; k++){
			paramDataList.push({"ntwkLineNo":dataList[k].ntwkLineNo, "workMgmtYn":dataList[k].workMgmtYn});
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/workcnvtnetworkline', paramDataList, 'POST', 'workCnvt');
	} else {
		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
	}
}

// 해지
function fnLineTerminate(){
	if( $('#'+gridIdWork).length == 0) return;
	var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
	
	var paramList = new Array();
	
	// 자동수정대상에서 삭제할 네트워크 번호
	procAcceptTargetList = "";
	
	if (dataList.length > 0 ){	
		var msg = makeArgMsg("confirmSelectData",dataList.length,cflineMsgArray['trmn'],"",""); /* {dataList.length}건을 {해지}하시겠습니까? */
		callMsgBox('','C', msg, function(msgId, msgRst){
       		if (msgRst == 'Y') {
       			cflineShowProgressBody();
       			for(i=0;i<dataList.length;i++){
       				paramList.push(dataList[i].ntwkLineNo);
       				procAcceptTargetList = procAcceptTargetList + dataList[i].ntwkLineNo + ",";
       			}
       			var param = {"ntwkLineNoList":paramList, "topoLclCd":"003", "topoSclCd":"101" };
       			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/terminatenetworkline', param, 'POST', 'terminate');
       		}
		});  
	}
	else{
		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */
	}
}

function fnVaildation(dataList){
	var msgStr = "";
	var validate = true;
	var isWdmFreqVal = false;
	var requiredColumn = {
		  ntwkLineNm : cflineMsgArray['trunkNm']
	 	, ntwkCapaCd : cflineMsgArray['capacity']
	 	, wdmEqpMdlId: cflineMsgArray['equipmentModel']
	 	, wdmFreqVal : cflineMsgArray['wavelength']+'/'+cflineMsgArray['frequency']
	 	, wdmDrcVal  : cflineMsgArray['direction']
	};
	for(var i=0; i<dataList.length; i++){
		$.each(requiredColumn, function(key,val){
			var value = eval("dataList[i]" + "." + key);
			if(nullToEmpty(value) == ""){
				msgStr = "<br>"+dataList[i].ntwkLineNo + " : " + val;
				validate = false;
				if(key == "wdmFreqVal" && nullToEmpty(dataList[i].wavlVal) != ""){
					isWdmFreqVal = true;
				}
				return validate;
			}
     	});
		
		if(!validate){
			if(isWdmFreqVal){
				alertBox('W', makeArgMsg('validationId',"","","","") + "<br>" + msgStr); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			} else {
				alertBox('W', makeArgMsg('requiredMessage',msgStr,"","","")); /* 필수 입력 항목입니다.[{0}] */
			}
    		
    		$('#'+gridIdWork).alopexGrid("startEdit");
    		return validate;
		}
	}
	return validate;
}

// 작업저장
function fnUpdate(){
	if( $('#'+gridIdWork).length == 0) return;
	$('#'+gridIdWork).alopexGrid('endEdit', {_state:{editing:true}});
	var dataList =  $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
	
	if(dataList.length > 0){
		if(fnVaildation(dataList)){
			cflineShowProgressBody();
			var updateList = $.map(dataList, function(data){
				var saveParam = {
					  "ntwkLineNo":data.ntwkLineNo
					, "ntwkLineNm":data.ntwkLineNm
					, "ntwkCapaCd":data.ntwkCapaCd
					, "wdmEqpMdlId":data.wdmEqpMdlId
					, "wdmBdwthVal":data.wdmBdwthVal
					, "wdmChnlVal":data.wdmChnlVal
					, "wdmFreqVal":data.wdmFreqVal
					, "wdmDrcVal":data.wdmDrcVal
					, "ntwkRmkOne":data.ntwkRmkOne
					, "ntwkRmkTwo":data.ntwkRmkTwo
					, "ntwkRmkThree":data.ntwkRmkThree
				}; 
				return saveParam;
			});
		
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/updatewdmtrunk', updateList, 'POST', 'updateWdmTrunk');		
		}
	} else {
		$('#'+gridIdWork).alopexGrid("startEdit");
		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */
	}
}

//작업정보완료, 모든작업정보 완료
function fnWorkInfoFnsh(isAll){
	if( $('#'+gridIdWork).length == 0) return;
	
	var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
	dataList = AlopexGrid.currentData(dataList);
	
	if (dataList.length > 0 ){
		if(fnVaildation(dataList)){
			cflineShowProgressBody();
			
			var updateList = $.map(dataList, function(data){
				var saveParam = {
					  "ntwkLineNo":data.ntwkLineNo
					, "ntwkLineNm":data.ntwkLineNm
					, "ntwkCapaCd":data.ntwkCapaCd
					, "wdmEqpMdlId":data.wdmEqpMdlId
					, "wdmChnlVal":data.wdmChnlVal
					, "wdmFreqVal":data.wdmFreqVal
					, "wdmDrcVal":data.wdmDrcVal
					, "ntwkRmkOne":data.ntwkRmkOne
					, "ntwkRmkTwo":data.ntwkRmkTwo
					, "ntwkRmkThree":data.ntwkRmkThree
				}; 
				return saveParam;
			});
		
			var param = {"finishAll" : isAll, "wdmTrunkList" : updateList };
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/workinfofinish', param, 'POST', 'workInfoFnsh');		
		}
	}else{
		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
	}
}

//E2E 토폴로지 팝업창 오픈
function intgE2ETopo(gridId) {
	var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
	window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=NTWK&searchId=' + focusData[0].ntwkLineNo + '&searchNm=' + focusData[0].ntwkLineNm);
}
//wdm트렁크 선번 수정 팝업(사용안함)
function showWdmTrunkEditPop( gridId, dataObj ) {
	var sFlag = gridId == "dataGrid"? "N" : "Y";
	var url =  $('#ctx').val()+'/configmgmt/cfline/WdmTrunkInfoPop.do';
//	var url =  $('#ctx').val()+'/configmgmt/cfline/WdmTrunkInfoDiagramPop.do';
	
	$a.popup({
		popid: "WdmTrunkEditPop",
	  	title: cflineMsgArray['wdmTrunk']+cflineMsgArray['information'], /*WDM트렁크정보*/
	  	url: url,
	    data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd" : "003", "topoSclCd" : "101"},
	    iframe: true,
	    modal: false,
	    movable:true,
	    other:'scrollbars=yes,resizable=yes',
	    windowpopup : true,
	    width : 1400,
//	    height : 940,
	    height : 850,
	    callback:function(data){
	    	// fnSearch("A", true);
	    }
	});
}
// wdm트렁크 선번창
function showPopWdmTrunkInfo( gridId, dataObj ) {
	var sFlag = gridId == "dataGrid"? "N" : "Y";
//	var url =  $('#ctx').val()+'/configmgmt/cfline/WdmTrunkInfoPop.do';
    var url =  $('#ctx').val()+'/configmgmt/cfline/WdmTrunkDetailPop.do';
	
	$a.popup({
		popid: "WdmTrunkDetailPop",
	  	title: cflineMsgArray['wdmTrunk']+cflineMsgArray['information'], /*WDM트렁크정보*/
	  	url: url,
     // ADAMS 연동 고도화
	  	data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd" : "003", "topoSclCd" : "101"
	  		, "mgmtGrpCd" : $("#mgmtGrpCd").val(), "mgmtOnrNm" : dataObj.mgmtOnrNm },
	  	//data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd" : "003", "topoSclCd" : "101", "mgmtGrpCd" : $("#mgmtGrpCd").val(), "svlnLclCd" : ""},
	    //data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd" : "003", "topoSclCd" : "101"},
	    iframe: true,
	    modal: false,
	    movable:true,
	    other:'scrollbars=yes,resizable=yes',
	    windowpopup : true,
	    width : 1600,
	    height : 940,
	    callback:function(data){
	    	// fnSearch("A", true);
	    }
	});
}

//wdm트렁크 선번창
function showEditPopWdmTrunkInfo( gridId, dataObj ) {
	var sFlag = "Y";
    var url =  $('#ctx').val()+'/configmgmt/cfline/WdmTrunkDetailModPop.do';
	
	$a.popup({
		popid: "WdmTrunkInfoPopupNew",
	  	title: cflineMsgArray['wdmTrunk']+cflineMsgArray['information'], /*WDM트렁크정보*/
	  	url: url,
	    data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd" : "003", "topoSclCd" : "101"},
	    iframe: true,
	    modal: false,
	    movable:true,
	    other:'scrollbars=yes,resizable=yes',
	    windowpopup : true,
	    width : 1700,
	    height : 850,
	    callback:function(data){
	    	// fnSearch("A", true);
	    }
	});
}

// 파장/주파수 검색
// 값이 이미 셋팅되어있는 경우에는 해당 값을 기준으로 검색된 값을 표시하고
// 값이 설정되어있지 않은 경우에는 팝업이 표시된다.
function searchWavl(event){
	var dataObj = AlopexGrid.parseEvent(event).data;
	var rowIndex = dataObj._index.row;
 	var schVal = dataObj._state.editing[dataObj._column];
 	
 	var schEqpMdlCd = AlopexGrid.currentData(dataObj).wdmEqpMdlId;
 	
 	if(schEqpMdlCd == null || schEqpMdlCd == "" || schEqpMdlCd == undefined){
 		var msg = makeArgMsg("selectObject",cflineMsgArray['equipmentModel']);
 		alertBox('W', msg); /* 장비모델을 선택하세요 */
 	} else {
 	 	cflineShowProgress(gridIdWork);
 	 	
 	 	var searchParam = {"searchDiv" : "wavl", "searchVal" : schVal, "eqpMdlId" : schEqpMdlCd };
		Tango.ajax({
    		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selecteqpmdldtlval', 
    		data : searchParam, 
    		method : 'GET',
    		flag : 'selectEqpMdlDtlVal'
    	}).done(
    		function(response, status, jqxhr, flag){
	    		var data = response.wavlList;
	    		cflineHideProgress(gridIdWork);
	    		if(data == null || data.length == 0){
	    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다 */
	    			$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmBdwthVal");
					$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wavlVal");
					$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmChnlVal");
					$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmFreqVal");
	    		} else if(data.length == 1){
	    			var obj = data[0];
	    			
	    			$('#'+gridIdWork).alopexGrid( "cellEdit", obj.wavlVal, {_index : { row : rowIndex}}, "wavlVal");
	    			$('#'+gridIdWork).alopexGrid( "refreshCell", {_index : { row : rowIndex}}, "wavlVal");
	    			if(nullToEmpty(obj.wdmChnlVal) != ""){
	    				$('#'+gridIdWork).alopexGrid( "cellEdit", obj.wdmChnlVal, {_index : { row : rowIndex}}, "wdmChnlVal");
	    			} else {
	    				$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmChnlVal");
	    			}
					
	    			if(nullToEmpty(obj.wdmFreqVal) != ""){
	    				$('#'+gridIdWork).alopexGrid( "cellEdit", obj.wdmFreqVal, {_index : { row : rowIndex}}, "wdmFreqVal");
	    			} else {
	    				$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmFreqVal");
	    			}
	    			
	    			if(nullToEmpty(obj.wdmBdwthVal) != ""){
	    				$('#'+gridIdWork).alopexGrid( "cellEdit", obj.wdmBdwthVal, {_index : { row : rowIndex}}, "wdmBdwthVal");
	    			} else {
	    				$('#'+gridIdWork).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "wdmBdwthVal");
	    			}
	    			
	    		} else if(data.length > 0){
	    			//검색된 데이터가 없는 경우 팝업을 표시한다.
	    			showPopWavlSearch(searchParam);
	    		}	    		
    		}
    	).fail(failCallback);
 	}
} 

/**
 * 파장/주파수 팝업
 * @param param
 */
function showPopWavlSearch(param){	
 	$a.popup({
	  	popid: "popEqpMdlDtlSch",
	  	title: cflineMsgArray['wavelength']+'/'+cflineMsgArray['frequency'] /*파장/주파수*/ ,
	  	url: $('#ctx').val()+'/configmgmt/cfline/EqpMdlDtlPop.do',
		data: param,
	    iframe: true,
		modal: false,
		movable:true,
		windowpopup : true,
		width : 300,
		height : 400,
		callback:function(data){
			if(data != null){
				var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.data;
	    		
	    		$('#'+gridIdWork).alopexGrid( "cellEdit", data.wdmBdwthVal, {_index : { row : rowIndex}}, "wdmBdwthVal");
				$('#'+gridIdWork).alopexGrid( "cellEdit", data.wavlVal, {_index : { row : rowIndex}}, "wavlVal");
				$('#'+gridIdWork).alopexGrid( "refreshCell", {_index : { row : rowIndex}}, "wavlVal");
				$('#'+gridIdWork).alopexGrid( "cellEdit", data.wdmChnlVal, {_index : { row : rowIndex}}, "wdmChnlVal");
				$('#'+gridIdWork).alopexGrid( "cellEdit", data.wdmFreqVal, {_index : { row : rowIndex}}, "wdmFreqVal");
			}
			$.alopex.popup.result = null;
		}
	});
}

function setRowIndexInfo(changeSearch){
	if(changeSearch){
		$("#firstRow01").val(1);
   	    $("#lastRow01").val(pageForCount);
	} else {
     	if(addData){
     		var first = parseInt($("#firstRow01").val());
     		var last = parseInt($("#lastRow01").val());
     		$("#firstRow01").val(first + pageForCount);
     		$("#lastRow01").val(last + pageForCount);
     	}
	}
	$("#firstRowIndex").val($("#firstRow01").val());
    $("#lastRowIndex").val($("#lastRow01").val());
}

function setRowIndexWork(changeSearch){
	if(changeSearch){
		$("#firstRow02").val(1);
   	    $("#lastRow02").val(pageForCount);
	} else {
     	if(addData){
     		var first = parseInt($("#firstRow02").val());
     		var last = parseInt($("#lastRow02").val());
     		$("#firstRow02").val(first + pageForCount);
     		$("#lastRow02").val(last + pageForCount);
     	}
	}
	$("#firstRowIndex").val($("#firstRow02").val());
    $("#lastRowIndex").val($("#lastRow02").val());
}

function fnSearch(sType, changeSearch) {
	if(sType == "A"){
		setRowIndexInfo(true);
		setRowIndexWork(true);
		$("#workListYn").val("");
	} else if(sType == "T"){
		setRowIndexInfo(changeSearch);
		$("#workListYn").val("N");
	} else if (sType == "W"){
		setRowIndexWork(changeSearch);
		$("#workListYn").val("Y");
	}

	// 장비모델건수 체크(for each는 1,000건만되기때문에)
	if (nullToEmpty($('#wdmEqpMdlIdList').val()) != "" && $('#wdmEqpMdlIdList').val().length > 1000) {
		alertBox('W', "장비모델은 1,000건 까지만 선택가능합니다.");
		return;
	}
	
	var param = $("#searchForm").serialize();
	
	
	 if (sType == "A"){
		 cflineShowProgressBody();
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectwdmtrunklistall', param, 'GET', 'searchA');
	 }else if (sType == "T"){
		 cflineShowProgress(gridId);
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectwdmtrunklist', param, 'GET', 'searchT');
	 }else if (sType == "W"){
		 cflineShowProgress(gridIdWork);
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectwdmtrunklist', param, 'GET', 'searchW');
	 }
}

//배치실행
function funExcelBatchExecute(){

	// 장비모델건수 체크(for each는 1,000건만되기때문에)
	if (nullToEmpty($('#wdmEqpMdlIdList').val()) != "" && $('#wdmEqpMdlIdList').val().length > 1000) {
		alertBox('W', "장비모델은 1,000건 까지만 선택가능합니다.");
		return;
	}
	
	cflineShowProgressBody();
	
  	 var topMtsoIdList = [];
	 if (nullToEmpty( $("#topMtsoIdList").val() )  != ""  ){
	 	topMtsoIdList =   $("#topMtsoIdList").val() ;	
	 }else{
	 	//topMtsoIdList = [];
	 }

  	 var wdmEqpMdlIdList = [];
	 if (nullToEmpty( $("#wdmEqpMdlIdList").val() )  != ""  ){
		 wdmEqpMdlIdList =   $("#wdmEqpMdlIdList").val() ;	
	 }
	 
	 var dataParam =  $("#searchForm").getData();
	 
	 // 전송실
	 $.extend(dataParam,{topMtsoIdList: topMtsoIdList });
	 // 장비모델
	 $.extend(dataParam,{wdmEqpMdlIdList: wdmEqpMdlIdList });
	 
	 
	 var sAllPass = false ;
	 if ($("input:checkbox[id='sAllPass']").is(":checked") ){
	 	sAllPass = true; 
	 }
	 $.extend(dataParam,{sAllPass: sAllPass });
	
	 var sOldWdmType = false ;
	 if ($("input:checkbox[id='sOldWdmType']").is(":checked") ){
		 sOldWdmType = true; 
	 }
	 $.extend(dataParam,{sOldWdmType: sOldWdmType });
	
	 var sWorkGrpWhereUse = false ;
	 if ($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked") ){
	 	sWorkGrpWhereUse = true; 
	 }
	 $.extend(dataParam,{sWorkGrpWhereUse: sWorkGrpWhereUse });
	
	 $.extend(dataParam,{topoLclCd: "003" });
	 $.extend(dataParam,{topoSclCd: "101" });
	
	 var stabIndex = $('#basicTabs').getCurrentTabIndex();
  	 if (stabIndex =="0"){
  		dataParam = gridExcelColumn(dataParam, gridId);
 	 }else if (stabIndex =="1"){
 		dataParam = gridExcelColumn(dataParam, gridIdWork);
 	 }
    	
	 var replaceColumn = {"ntwkCapaCd" : "ntwkCapaCdNm"};

	 $.each(replaceColumn, function(key,val){
	 	dataParam.excelHeaderCd = dataParam.excelHeaderCd.replace(key, val);         		
	 })

	
	 dataParam.fileExtension = "xlsx";
	 dataParam.excelPageDown = "N";
	 dataParam.excelUpload = "N";
	 
	
	 if (stabIndex =="0"){
		dataParam.method = "wdmTrunkInfo";
	 }else if (stabIndex =="1"){
		dataParam.method = "wdmTrunkWorkInfo";
	 }
	 cflineShowProgressBody();
	 
	 // 기간망 형태로 엑셀다운로드시
	 if (sAllPass == true && sOldWdmType == false) {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
	 } 
	 // 기존형태로 엑셀 다운로드시
	 else {
		 dataParam.lEqpNM = $('#lftEqpNm').val();
		 dataParam.lPortNm = $('#lftPortNm').val();
		 dataParam.rEqpNM = $('#rghtEqpNm').val();
		 dataParam.rPortNm = $('#rghtPortNm').val();
		 dataParam.ownCd=dataParam.mgmtGrpCd;
		 dataParam.orgCd=dataParam.hdofcCd;
		 dataParam.wdmEqpMdlNm = $('#wdmEqpMdlNm').val();
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
	 }
}

//엑셀다운로드팝업
function excelCreatePop ( jobInstanceId ){
   	 $a.popup({
        	popid: 'ExcelDownlodPop' + jobInstanceId,
        	iframe: true,
        	modal : false,
        	windowpopup : true,
            url: 'ExcelDownloadPop.do',
            data: {
            	jobInstanceId : jobInstanceId
            }, 
            width : 500,
            height : 300
            ,callback: function(resultCode) {
              	if (resultCode == "OK") {
              		//$('#btnSearch').click();
              	}
           	}
        });
}


// 수용목록
function fnAcceptNtwkList(selectData){
	
	//console.log(selectData);
		
	var chkNtwkLine = [];
	chkNtwkLine.push(selectData.ntwkLineNo);
	var param = {
					"ntwkLineNoList":chkNtwkLine
				  , "topoLclCd":selectData.topoLclCd
				  , "topoSclCd":selectData.topoSclCd 
				  , "title" : cflineMsgArray['acceptLine']+cflineMsgArray['list']
				  , "callType":"S"   // S : 수용목록 조회
	            };
	$a.popup({
			popid: "UsingInfoPop",
			title: cflineMsgArray['acceptLine']+cflineMsgArray['list']  /*수용회선목록*/,
			url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
			data: param,
			iframe: true,
			modal: true,
			movable:true,
		    windowpopup : true,
			width : 1200,
			height : 650,
			callback:function(data){
		    	//fnSearch("A", true);
		    }
		});
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

function successCallback(response, status, jqxhr, flag){
	//용량 데이터
	if(flag == 'C00194Data'){
		C00194Data = response;
		var allOption = [{value: "",text: cflineCommMsgArray['all']}]; /*전체*/
		$('#ntwkCapaCd').clear();
		$('#ntwkCapaCd').setData({data : allOption.concat(C00194Data)});
	}
	//장비 데이터
	else if(flag == 'eqpMdlList'){
		// 장비모델은 필수값이지만 2014년 이전 데이터에 장비모델이 null인 데이터가 있어서 selectBox에 '선택' 필요 
		eqpMdlList = [{value: "",text: cflineCommMsgArray['select']}]; /*선택*/
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			eqpMdlList.push({ value : resObj.eqpMdlId, text : resObj.eqpMdlNm} );
		}
		//eqpMdlList = response;
	}
	//작업 정보 
	else if(flag == 'updateWdmTrunk'){
		cflineHideProgressBody();

		if(response.returnCode == '200'){ 
			callMsgBox('','I',makeArgMsg('processed',response.returnMessage,"","",""), function(msgId,msgRst){ /* ({0})건 처리 되었습니다. */
				if(msgRst == 'Y'){
					fnSearch("A", true);
				}
			});
		}
		else if(response.returnCode == '500'){
			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */ 
		}
	}
	// 작업정보 완료
	else if(flag == 'workInfoFnsh') {
		cflineHideProgressBody();
		
		if(response.returnCode == '200'){
			callMsgBox('','I',makeArgMsg('processed',response.returnMessage,"","",""), function(msgId,msgRst){ /* ({0})건 처리 되었습니다. */
				if(msgRst == 'Y'){
					fnSearch("A", true);
				}
			});
		}
		else if(response.returnCode == '500'){ 
			callMsgBox('','I',makeArgMsg('saveFail',response.returnMessage,"","",""), function(msgId,msgRst){ /* 저장을 실패 하였습니다.*/
				if(msgRst == 'Y'){
					fnSearch("A", true);
				}
			});
		}		
	}
	// 해지
	else if(flag == 'terminate') {
		cflineHideProgressBody();
		if(response.returnCode == "SUCCESS"){
			if(response.useNtwkLineNoList != null && response.useNtwkLineNoList.length > 0){
				var msg = "";
				
				if(parseInt(response.cnt) > 0){
					msg = makeArgMsg('processed', response.cnt ,"","",""); /* ({0})건 처리 되었습니다. */
				}
				else {
					msg = cflineMsgArray['noApplyData'];
				}
				
				
				msg+= "<br><br>" + cflineMsgArray['untreated'] + " : " + response.useNtwkLineNoList.length + "건";
				callMsgBox('','I', msg, function(msgId, msgRst){
		       		if (msgRst == 'Y') {
		       			var param = {"ntwkLineNoList":response.useNtwkLineNoList, "topoLclCd":"003", "topoSclCd":"101" };
						$a.popup({
			 	 			popid: "UsingInfoPop",
			 	 			title: cflineMsgArray['wdmTrunk']+"-"+cflineMsgArray['trmn']/*WDM트렁크 - 해지*/,
			 	 			url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
			 	 			data: param,
			 	 			iframe: true,
			 	 			modal: false,
			 	 		    movable:true,
			 	 		    windowpopup : true,
			 	 			width : 1200,
			 	 			height : 650,
			 	 			callback:function(data){
			 	 		    	fnSearch("A", true);
			 	 		    }
			 	 		});
		       		} else {
		       			fnSearch("A", true);
		       		}
				});	
			}
			else {
				var msg = makeArgMsg('processed', response.cnt ,"","",""); /* ({0})건 처리 되었습니다. */
				callMsgBox('','I', msg, function(msgId, msgRst){
		       		if (msgRst == 'Y') {
		       			fnSearch("A", true);
		       		}
				});
			}
			

			/* 2018-08-13 해지된 회선 중 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
			var acceptParam = {
					 lineNoStr : procAcceptTargetList
				   , topoLclCd : "003"
				   , linePathYn : "N"
				   , editType : "C"   // 해지
				   , excelDataYn : "N"
			}
			extractAcceptNtwkLine(acceptParam);
		}
		else if(response.returnCode == "NODATA"){
			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
		}
		else {
			alertBox('I', cflineMsgArray['noData']); /* 데이터가 없습니다. */
		}
		
	}
	//조회
	else if(flag == 'searchA'){
		maxPathCount = 0;
		maxPathCountWork = 0;
		
		if(response.maxPathCount == null) {
			maxPathCount = 0;
		}
		renderGrid(gridId, response.outWdmTrunkList, response.listHeader, true, response.totalCount, response);
		    	  	
	  	if(response.maxPathCountWork == null){ 
	  		maxPathCountWork = 0;
	  	}
	  	renderGrid(gridIdWork, response.outWdmTrunkWorkList, response.listWorkHeader, true, response.totalCountWork, response);		
		
		if(addData){
			$('#'+gridId).alopexGrid("dataAdd", response.outWdmTrunkList);
			$('#'+gridIdWork).alopexGrid("dataAdd", response.outWdmTrunkWorkList);
			addData = false;
		}else{
			$('#'+gridId).alopexGrid("dataSet", response.outWdmTrunkList);
			$('#'+gridIdWork).alopexGrid("dataSet", response.outWdmTrunkWorkList);	
		}

		$('#'+gridIdWork).alopexGrid("startEdit");
		cflineHideProgressBody();
		
	}	
	// 트렁크 조회시
	else if(flag == 'searchT'){
		data =  response.outWdmTrunkList;
		if(response.maxPathCount == null) {
			maxPathCount = 0;
		}
		
		if(data.length == 0){
			cflineHideProgress(gridId);
			addData = false;
			return false;
		}
		
		renderGrid(gridId, data, response.listHeader, false, 0, response);
	  	
	  	$('#'+gridId).alopexGrid("dataAdd", response.outWdmTrunkList);
	  	addData = false;
	  	cflineHideProgress(gridId);
	}
	
	// 작업정보 조회시
	else if(flag == 'searchW'){
		data =  response.outWdmTrunkList;
		if(response.maxPathCount == null){			
			maxPathCountWork = 0;
 		}

		if(data.length == 0){
			cflineHideProgress(gridIdWork);
			addData = false;
			return false;
		}
		
		renderGrid(gridIdWork, data, response.listHeader, false, 0, response);
		
	  	$('#'+gridIdWork).alopexGrid("dataAdd", response.outWdmTrunkList);
  		addData = false;
	  	
	  	$('#'+gridIdWork).alopexGrid("startEdit");
	  	cflineHideProgress(gridIdWork);
	}
	
	//작업전환
	else if(flag == 'workCnvt'){
		cflineHideProgressBody();
		
		var msg = "";
		if(response.Result == 'Success'){
			msg = makeArgCommonMsg2('lineCountProc', response.totalCount, response.updateCount);
			if(response.totalCount != response.updateCount){
				msg += "<br><br>- " + makeArgCommonMsg2('lineCountTotal', response.totalCount, null)
				if(response.authCount > 0) { msg+= "<br>- " + makeArgCommonMsg2('lineCountAuth', response.authCount, null); }
				if(response.workCount > 0) { msg+= "<br>- " + makeArgCommonMsg2('lineCountWork', response.workCount, null); }
				msg += "<br>- " + makeArgCommonMsg2('lineCountSuccess', response.updateCount, null);
			}
			
		}else if(response.Result == 'NODATA'){
			msg = cflineMsgArray['noApplyData']; /* 적용할 데이터가 없습니다.*/
		}else{  
			msg = cflineMsgArray['saveFail']; /* 저장을 실패 하였습니다. */
    	}
 
		callMsgBox('','I', msg, function(msgId, msgRst){
       		if (msgRst == 'Y') {
       			fnSearch("A", true);
       		}
		});   		
	}
	
	else if(flag == 'excelBatchExecute') {
		if(response.returnCode == '200'){ 
			jobInstanceId  = response.resultData.jobInstanceId;
			cflineHideProgressBody();
			excelCreatePop(jobInstanceId);
		}
		else if(response.returnCode == '500'){ 
			cflineHideProgressBody();
	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
		}
	}
	else if (flag == 'eqpMdlIdList') {
		if (nullToEmpty(response.eqpMdlList) != "") {
			$('#wdmEqpMdlIdList').setData({data :response.eqpMdlList});
		}
	}
}


function failCallback(response, status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == 'search'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	else {
		alertBox('I', cflineMsgArray['systemError']); /* 시스템 오류가 발생하였습니다. */
	}
}

function onloadMgmtGrpChange(){
	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "topMtsoIdList", "mtso");
}

