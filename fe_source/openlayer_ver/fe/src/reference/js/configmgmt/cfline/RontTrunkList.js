/**
 * RontTrunkList.js
 *
 * @author Seo eunju
 * @date 2016.11.01 
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2022-03-23  1. [추가] HOLA 기간망연동 데이터 추가 (HOLA기간망트렁크탭으로 별도 관리)
 *                dataGridHola - HOLA용 기간망 그리드 추가
 */
var gridId = 'dataGrid';
var gridWorkId = 'dataGridWork';
var gridHolaId = 'dataGridHola';	//추가
var capaTypCd = [];	// 회선타입
var rontTrkTypCd = [];	// 서비스유형
var protModeTypCd = [];	// 보호모드
var msgVal = "";		// 메시지 내용
var addData = false;
var jobInstanceId = "";
var ntwkStatCd = [];

// PTP링 네트워크정보 TSDN 전송
var sendToTsdnLineNo = null;

var pageForCount = 200;
var ynList  = [{value: "Y",text: "사용"}, {value: "N",text: "미사용"}]; 

var flag = 'ront';

$a.page(function() {
	
	this.init = function(id, param) {
		
    	sendToTsdnLineNo= null;
    	
		//버튼 비활성화 설정
    	$('#btnExportExcel').setEnabled(false);
    	$('#btnDupMtsoMgmt').setEnabled(false);
//    	$('#btnWorkCnvt').setEnabled(false);
    	
    	$('#btnLineTrmn').setEnabled(false);
    	$('#btnTrunkWorkUpdate').setEnabled(false);
    	$('#sWorkGrpWhereUse').setChecked(true);
    	$('#allMtso').setChecked(true);
		
		//기본 정보 셋팅
    	setSelectCode();
    	
    	//이벤트 셋팅
    	setEventListener();
    	
    	// 엑셀업로드
        $('#btnAddExcel').on('click', function(e) {
	       	 $a.popup({
	            	popid: 'RontTrunkExcelUploadPop',
	            	title: cflineMsgArray['rontExcelUpload'], /*'엑셀업로드'*/
	            	iframe: true,
	            	modal : false,
	            	windowpopup : true,
	                //url: $('#ctx').val() +'/configmgmt/cfline/RontTrunkExcelUploadPop.do',
	            	 url: $('#ctx').val() +'/configmgmt/cfline/RontTrunkExcelUploadNewPop.do',
	                data: null, 
	                width : 1600,//800,
	                height : 850//400 //window.innerHeight * 0.5,
	                /*$('#ctx').val() + url
	            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	            	*/                
	                ,callback: function(resultCode) {
	                    	if (resultCode == "OK") {
	                    		//$('#btnSearch').click();
	                    	}
	               	}
	       	 	  ,xButtonClickCallback : function(el){
	       	 			alertBox('W', cflineMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
	       	 			return false;
	       	 		}
	            });
	       });    
    	
    	//중계구간 input box
    	inputEnableProc("linkPath1","linkPath2","")
    	inputEnableProc("linkPath2","linkPath3","")
    	inputEnableProc("linkPath3","linkPath4","")
    	inputEnableProc("linkPath4","linkPath5","")
    	
    	
     	//	구간 DROP input box
 		inputEnableProc("transmissionStart","transmissionEnd","")
    };
});

function setSelectCode() {
	
	// 관리 그룹 selectBox
//	createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());
	// TODO 임시 - 기본으로 SKT보여주기. 요구사항 확정되면 수정 필요
	var chrrOrgGrpCd = 'SKT';
	createMgmtGrpSelectBox ("mgmtGrpCd", "A", chrrOrgGrpCd);
	
	// 본부, 팀, 전송실
	//	setSearchCode2("0001", "hdofcCd", "teamCd", "topMtsoIdList");
	setSearch2Code("hdofcCd", "teamCd", "topMtsoIdList","A");
	
	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "topMtsoIdList", "mtso");
	
	// 기간망 회선타입
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01572', null, 'GET', 'capaType');
	// 보호모드
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01550', null, 'GET', 'protModeType');
	// 서비스유형
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01058', null, 'GET', 'rontTrkType');
	
	// 시스템/제조사 동적연동(2017-04-21)
	var dataParam = {"mgmtGrpNm": chrrOrgGrpCd};
	// 시스템(장비 역할)
	//httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCd');
	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
	
	//제조사 조회
	//httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp/ALL', null,'GET', 'bp');
	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', dataParam,'GET', 'bp');
	
	// 사용자 소속 전송실
	searchUserJrdtTmofInfo("topMtsoIdList");
	// 회선상태
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00262', null, 'GET', 'ntwkStatCd'); // 회선상태
}

function setEventListener() {
 	// 엔터 이벤트 
 	$('#searchForm').on('keydown', function(e){
 		if (e.which == 13  ){
 			fnSearch("A", true);
		}
 	});	      	
 	
	//탭 선택 이벤트
    $("#basicTabs").on("tabchange", function(e, index) {
 		if(index == 0) {
 			$('#'+gridId).alopexGrid("viewUpdate");	 
 			$('#btnDupMtsoMgmt').setEnabled(false); //전송실설정
 			flag = 'ront';
 		} else if(index == 1) {
 			$('#'+gridWorkId).alopexGrid("viewUpdate");
 			btnEnableProc2(gridWorkId, "btnDupMtsoMgmt");
 		} else if(index == 2) {	//추가
 			$('#'+gridHolaId).alopexGrid("viewUpdate");
 			btnEnableProc2(gridHolaId, "btnDupMtsoMgmt");
 			$('#btnDupMtsoMgmt').setEnabled(false); //전송실설정
 			flag = 'hola';
 		}
 	});
       	    
 	$('#tab2').on("click", function(e){
 		btnEnableProc2(gridWorkId, "btnDupMtsoMgmt");
 		btnEnableProc2(gridWorkId, "btnLineTrmn");
 		btnEnableProc2(gridWorkId, "btnTrunkWorkUpdate");
    });
 	
 	// 관리그룹 선택시
 	$('#mgmtGrpCd').on('change',function(e){
 		var dataParam = {"mgmtGrpNm": $(this).getTexts()[0]};
 		
 		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "topMtsoIdList", "mtso");
 		// 시스템
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ $(this).getTexts()[0], null, 'GET', 'eqpRoleDivCd');
        // 제조사
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', dataParam,'GET', 'bp'); 		
   	});  
 	
 	// 시스템 선택시
 	$('#lftEqpRoleDiv').on('change',function(e){
 		var dataParam = "mgmtGrpNm="+ $("#mgmtGrpCd").getTexts()[0];
 		dataParam = dataParam+ "&comCdMlt1=" + $(this).val();
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', dataParam,'GET', 'bp');
 		 
 	});
 	
	// 본부 선택시
	$('#hdofcCd').on('change',function(e){
		changeHdofc("hdofcCd", "teamCd", "topMtsoIdList", "mtso");
  	});    	 
	// 팀 선택시
	$('#teamCd').on('change',function(e){
		changeTeam("teamCd", "topMtsoIdList", "mtso");
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
 	
 	
	// 관할전송실 설정
 	$('#btnDupMtsoMgmt').on('click', function(e) {
	 	var element =  $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
	 	var selectCnt = element.length;
		
		if(selectCnt <= 0){
			alertBox('I', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */);
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
 	
 	// 국사 
 	$('#mtsoNm').on('propertychange input', function(e){
 		$("#mtsoId").val("");
 	});
 	
 	// 노드국사
 	$('#lftEqpInstlMtsoNm').on('propertychange input', function(e){
 		$("#lftEqpInstlMtsoId").val("");
 	});
 	
 	//조회버튼 클릭시
    $('#btnSearch').on('click', function(e) {
    	if(flag == 'ront') {
    		fnSearch("A", true);
    	} else {
    		fnSearch("H", true);
    	}
    });

    //기간망트렁크정보 스크롤 이동시
   	$('#'+gridId).on('scrollBottom', function(e){
   		addData = true;
   		fnSearch("T", false);     	
 	});
 
    //기간망HOLA정보 스크롤 이동시
   	$('#'+gridHolaId).on('scrollBottom', function(e){
   		addData = true;
   		fnSearch("H", false);     	
 	});
   	
   	//기간망트렁크 작업정보 스크롤 이동시
   	$('#'+gridWorkId).on('scrollBottom', function(e){
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
    
    //작업 전환 (trunk.getWorkCnvt 호출)
//    $('#btnWorkCnvt').on('click', function(e) {
//    	fnWorkCnvt();
//     })
     
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
    
    // 노드 국사 조회
    $('#btnEqpInstlMtsoSch').on('click', function(e) {
		var paramValue = {    "mgmtGrpNm": $('#mgmtGrpCd option:selected').text()
							, "orgId": $('#hdofcCd').val()
							, "teamId": $('#teamCd').val()
							, "mtsoNm": $('#mtsoNm').val()
							, "regYn" : "Y"
		};
		openMtsoDataPop("lftEqpInstlMtsoId", "lftEqpInstlMtsoNm", paramValue);
	});
	
	//장비 조회
	$('#btnEqpSch').on('click', function(e) {
		openEqpPop("eqpId", "eqpNm");
	}); 
	
	//포트 조회
	$('#btnPortSch').on('click', function(e) {
		openPortPop("portId", "portNm");
	}); 		
    
    //기간망트렁크 상세 목록 조회팝업(선번)
    $('#'+gridId).on('dblclick', '.bodycell', function(e){
 	 	var dataObj = AlopexGrid.parseEvent(e).data; 
 	 	showPopRontTrunkInfo( gridId, dataObj );
 	}); 
    
    //기간망트렁크 작업정보 상세 목록 조회팝업(선번)
    $('#'+gridWorkId).on('dblclick', '.bodycell', function(e){
 	 	var dataObj = AlopexGrid.parseEvent(e).data; 
 	 	showPopRontTrunkInfo( gridWorkId, dataObj );
 	}); 
    
    //기간망HOLA 상세 목록 조회팝업(선번)
    $('#'+gridHolaId).on('dblclick', '.bodycell', function(e){
 	 	var dataObj = AlopexGrid.parseEvent(e).data; 
 	 	showPopRontTrunkInfo( gridHolaId, dataObj );
 	});
    
    //엑셀다운로드
    $('#btnExportExcel').on('click', function(e) {
    	
    	funExcelBatchExecute();
/*    	cflineShowProgressBody();
    	var dataParam = $.param(getExcelParam(), true);
    	var fileModel = Tango.ajax.init({
    		url: 'tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/getronttrunklistexceldown?' + dataParam,
    		dataType: 'binary',
    		responseType: 'blob',
    		processData: false
    	});
    	
    	fileModel.get().done(excelDownSucc)
    	   .fail(function(response){failCallback(response);});*/
    });  

	 
    
     
}

function successCallback(response, status, jqxhr, flag){
	//조회
	if(flag == 'searchA'){
		data =  response.outRontTrunkList;
		renderGrid(gridId, data, true, response.totalCount);
		
	  	data =  response.outRontTrunkWorkList;
	  	renderGrid(gridWorkId, data, true, response.totalCountWork);
	  	
		if(addData){
			$('#'+gridId).alopexGrid("dataAdd", response.outRontTrunkList);
			$('#'+gridWorkId).alopexGrid("dataAdd", response.outRontTrunkWorkList);
			addData = false;
		}else{
			$('#'+gridId).alopexGrid("dataSet", response.outRontTrunkList);
			$('#'+gridWorkId).alopexGrid("dataSet", response.outRontTrunkWorkList);					
		}
		$('#'+gridWorkId).alopexGrid("startEdit");
		cflineHideProgressBody();
	}	
	// 트렁크 조회시
	else if(flag == 'searchT'){
		data =  response.outRontTrunkList;
		renderGrid(gridId, data, false, 0);
	  	
	  	$('#'+gridId).alopexGrid("dataAdd", response.outRontTrunkList);
  		addData = false;
	  	cflineHideProgress(gridId);
	}
	
	// 작업정보 조회시
	else if(flag == 'searchW'){
		data =  response.outRontTrunkWorkList;
		renderGrid(gridWorkId, data, false, 0);
		
	  	$('#'+gridWorkId).alopexGrid("dataAdd", response.outRontTrunkList);
  		addData = false;
  		
	  	$('#'+gridWorkId).alopexGrid("startEdit");
	  	cflineHideProgress(gridWorkId);
	}

	// 기간망HOLA정보 조회시 - 2022-03-24 추가
	else if(flag == 'searchH'){
		data =  response.outRontHolaList;
		renderGrid(gridHolaId, data, true, response.holaTotalCount);
	  	
//		if(addData){
//			$('#'+gridHolaId).alopexGrid("dataAdd", response.outRontHolaList);
//			addData = false;
//		}else{
			$('#'+gridHolaId).alopexGrid("dataSet", response.outRontHolaList);				
//		}
		cflineHideProgressBody(gridHolaId);
	}	
	
	//회선유형
	else if(flag == 'capaType'){
		var allOption = [{value: "",text: cflineCommMsgArray['all']}]; /*전체*/
		
		for(var i=0; i<response.length; i++){
			if(response[i].useYn == "Y") {
				capaTypCd.push(response[i]);
			}	
		}
		
		$('#rontTrkCapaTypCd').setData({data : allOption.concat(capaTypCd)});
	}
	//서비스유형
	else if(flag == 'rontTrkType'){
		var allOption = [{value: "",text: cflineCommMsgArray['all']}]; /*전체*/
		
		for (var i=0; i< response.length; i++) {
			if (response[i].useYn == "Y" && nullToEmpty(response[i].cdFltrgVal) !='SKB') {
				rontTrkTypCd.push(response[i]);
			}
		}

		$('#rontTrkTypCd').setData({data : allOption.concat(rontTrkTypCd)});
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
	//작업 전환
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
	//작업 정보 
	else if(flag == 'updateRontTrunk'){
		cflineHideProgressBody();
		
		if(response.returnCode == '200'){
			// 네트워크 정보 TSDN에 전송			
			sendToTsdnNetworkInfo(sendToTsdnLineNo, "T", "B");
			
			callMsgBox('','I',makeArgMsg('processed',response.returnMessage,"","",""), function(msgId,msgRst){ /* ({0})건 처리 되었습니다. */
				if(msgRst == 'Y'){
					fnSearch("A", true);
				}
			});
		}
		else if(response.returnCode == '500'){ 
			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
		}
	}
	
	// 작업정보 완료
	else if(flag == 'workInfoFnsh') {
		cflineHideProgressBody();

		if(response.returnCode == '200'){

			// 네트워크 정보 TSDN에 전송
			sendToTsdnNetworkInfo(sendToTsdnLineNo, "T", "B");
			
			callMsgBox('','I',makeArgMsg('processed',response.returnMessage,"","",""), function(msgId,msgRst){ /* ({0})건 처리 되었습니다. */
				if(msgRst == 'Y'){
					fnSearch("A", true);
				}
			});
		}
		else if(response.returnCode == '500'){ 
			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
		}
	}
	// 해지
	else if(flag == 'terminate') {
		cflineHideProgressBody();
		if(response.returnCode == "SUCCESS"){			

			// 네트워크 정보 TSDN에 전송_ 해지는 제외			
			sendToTsdnNetworkInfo(sendToTsdnLineNo, "T", "B");
			
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
		       			var param = {"ntwkLineNoList":response.useNtwkLineNoList, "topoLclCd":"003", "topoSclCd":"102" };
						$a.popup({
			 	 			popid: "UsingInfoPop",
			 	 			title: cflineMsgArray['backboneNetworkTrunk']+"-"+cflineMsgArray['trmn']/*기간망트렁크 - 해지*/,
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
		}
		else if(response.returnCode == "NODATA"){
			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
		}
		else {
			alertBox('I', cflineMsgArray['noData']); /* 데이터가 없습니다. */
		}
	}
	
	if(flag == 'excelBatchExecute') {
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
	// 회선상태셋팅
	else if(flag == 'ntwkStatCd'){
		ntwkStatCd = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
		for(var i=0; i<response.length; i++){
			ntwkStatCd.push({value : response[i].value, text :response[i].text});
		}
		
		$('#ntwkStatCd').clear();
		$('#ntwkStatCd').setData({data : ntwkStatCd});
	}
}

//배치실행
function funExcelBatchExecute(){
	
	cflineShowProgressBody();
	
	var topMtsoIdList = [];
	if (nullToEmpty( $("#topMtsoIdList").val() )  != ""  ){
		topMtsoIdList =   $("#topMtsoIdList").val() ;	
	}else{
		//topMtsoIdList = [];
	}
	
	var dataParam =  $("#searchForm").getData();
	
	$.extend(dataParam,{topMtsoIdList: topMtsoIdList });
	var sAllPass = false ;
	if ($("input:checkbox[id='sAllPass']").is(":checked") ){
		sAllPass = true; 
	}
	$.extend(dataParam,{sAllPass: sAllPass });
	
	var searchSystem = false;
	if($('#lftEqpRoleDiv').val() != "" || $('#lftVendorId').val() != "" 
		|| $('#lftEqpInstlMtsoNm').val() != ""|| $('#lftEqpNm').val() != "" 
		|| $('#lftCardMdlNm').val() != "" || $('#lftShlfNm').val() != "" 
		|| $('#lftSlotNo').val() != "")
	{
		searchSystem = true;
	}
	$.extend(dataParam,{searchSystem: searchSystem });
	
	var sWorkGrpWhereUse = false ;
	if ($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked") ){
		sWorkGrpWhereUse = true; 
	}
	$.extend(dataParam,{sWorkGrpWhereUse: sWorkGrpWhereUse });
	
	$.extend(dataParam,{topoLclCd: "003" });
	$.extend(dataParam,{topoSclCd: "102" });
	
	// 엑셀 업로드용 다운로드
	var excelUpload = "N" ;
	if ($("input:checkbox[id='excelUpload']").is(":checked") ){
		excelUpload = "Y"; 
	}	
	$.extend(dataParam,{excelUpload: excelUpload });
	
	
	var stabIndex = $('#basicTabs').getCurrentTabIndex();
	if (stabIndex =="0"){
	 	dataParam = gridExcelColumn(dataParam, gridId);
 	}else if (stabIndex =="1"){
 		dataParam = gridExcelColumn(dataParam, gridWorkId);
 	}else {
	 	dataParam = gridExcelColumn(dataParam, gridHolaId);
 	}
	
	var replaceColumn = {"ntwkCapaCd" : "ntwkCapaCdNm"};

	$.each(replaceColumn, function(key,val){
		dataParam.excelHeaderCd = dataParam.excelHeaderCd.replace(key, val);         		
	})

	
	dataParam.fileExtension = "xlsx";
	dataParam.excelPageDown = "N";	
	
	if (stabIndex =="0"){
		dataParam.method = "rontTrunkInfo";
	}else if (stabIndex =="1"){
		dataParam.method = "rontTrunkWorkInfo";
	}else{
		dataParam.method = "rontHolaInfo";
	}
	cflineShowProgressBody();
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
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
	if(flag == 'search'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	else {
		alertBox('I', cflineMsgArray['systemError']); /* 시스템 오류가 발생하였습니다. */
	}
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

//get Excel Parameter
function getExcelParam(){
	var dataParam =  $("#searchForm").getData();
	$.extend(dataParam,{"topoLclCd":"003", "topoSclCd":"102", "fileExtension" : "xlsx", "excelPageDown":"N", "excelUpload":"N"});
 	
 	var sTabIndex = $('#basicTabs').getCurrentTabIndex(); 	
 	if(sTabIndex == "0"){
 		dataParam.method = "rontTrunkInfo";
 		dataParam.fileName = cflineMsgArray['backboneNetworkTrunk']+cflineMsgArray['information']; /* 기간망트렁크정보 */
 		dataParam.workListYn = "N";
 	}else if(sTabIndex == "1"){
 		dataParam.method = "rontTrunkWorkInfo";
 		dataParam.fileName = cflineMsgArray['backboneNetworkTrunk']+cflineMsgArray['work']+cflineMsgArray['information']; /* 기간망트렁크작업정보 */
 		dataParam.workListYn = "Y";
 	}
 	
 	$('#fileName').val(dataParam.fileName + "_" + getCurrDate());
 	
 	return dataParam;
}

//작업전환
function fnWorkCnvt(){
	if( $('#'+gridId).length == 0) return;
	var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
	var paramDataList = [];	

	if (dataList.length > 0 ){
		cflineShowProgressBody();
		for(k=0; k<dataList.length; k++){
			paramDataList.push({"ntwkLineNo":dataList[k].ntwkLineNo, "workMgmtYn":dataList[k].ntwkLineNo});
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/workcnvtnetworkline', paramDataList, 'POST', 'workCnvt');
	} else {
		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
	}
}

// 해지
function fnLineTerminate(){
	if( $('#'+gridWorkId).length == 0) return;
	var dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
	
	// 기간망 정보 TSDN 전송
	sendToTsdnLineNo = "";
	
	var paramList = new Array();
	if (dataList.length > 0 ){	
		var msg = makeArgMsg("confirmSelectData",dataList.length,cflineMsgArray['trmn'],"",""); /* {dataList.length}건을 {해지}하시겠습니까? */
		callMsgBox('','C', msg, function(msgId, msgRst){
       		if (msgRst == 'Y') {
       			cflineShowProgressBody();
       			for(i=0;i<dataList.length;i++){
       				paramList.push(dataList[i].ntwkLineNo);
       				sendToTsdnLineNo = sendToTsdnLineNo + dataList[i].ntwkLineNo + ",";
       			}
       			var param = {"ntwkLineNoList":paramList, "topoLclCd":"003", "topoSclCd":"102" };
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
    		$('#'+gridWorkId).alopexGrid("startEdit");
    		return validate;
		}
	}
	return validate;
}

// 작업저장
function fnUpdate(){
	if( $('#'+gridWorkId).length == 0) return;
	$('#'+gridWorkId).alopexGrid('saveEdit', {_state:{editing:true}});
	$('#'+gridWorkId).alopexGrid('endEdit', {_state:{editing:true}});
	var dataList =  $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
	
	// 기간망 트렁크 정보 TSDN전송
	sendToTsdnLineNo = "";
	
	if(dataList.length > 0){
		if(fnVaildation(dataList)){
			cflineShowProgressBody();
			var updateList = $.map(dataList, function(data){
				var saveParam = {
					  "ntwkLineNo":data.ntwkLineNo
					, "ntwkLineNm":data.ntwkLineNm
					, "rontTrkTypCd":data.rontTrkTypCd
					, "wdmChnlVal":data.wdmChnlVal
					, "wdmWavlVal":data.wdmWavlVal
					, "rontTrkCapaTypCd":data.rontTrkCapaTypCd
					, "protModeTypCd":data.protModeTypCd
					, "rontTrkUseYn":data.rontTrkUseYn
					, "rontTrkLineRmk":data.rontTrkLineRmk
				}; 
				
				sendToTsdnLineNo = sendToTsdnLineNo + data.ntwkLineNo + ",";
				
				return saveParam;
			});
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/updateronttrunk', updateList, 'POST', 'updateRontTrunk');
		}
	} else {
		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */
		$('#'+gridWorkId).alopexGrid('startEdit');	
	}
}


//작업정보완료, 모든작업정보완료
function fnWorkInfoFnsh(isAll){
	if( $('#'+gridWorkId).length == 0) return;
	
	var dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
	dataList = AlopexGrid.currentData(dataList);

	// 기간망 트렁크 정보 TSDN전송
	sendToTsdnLineNo = "";
	
	if (dataList.length > 0 ){
		if(fnVaildation(dataList)){
			cflineShowProgressBody();
			
			var updateList = $.map(dataList, function(data){
				var saveParam = {
					  "ntwkLineNo":data.ntwkLineNo
					, "ntwkLineNm":data.ntwkLineNm
					, "rontTrkTypCd":data.rontTrkTypCd
					, "wdmChnlVal":data.wdmChnlVal
					, "wdmWavlVal":data.wdmWavlVal
					, "rontTrkCapaTypCd":data.rontTrkCapaTypCd
					, "protModeTypCd":data.protModeTypCd
				}; 
				
				sendToTsdnLineNo = sendToTsdnLineNo + data.ntwkLineNo + ",";
				
				return saveParam;
			});
			
			var param = {"finishAll" : isAll, "rontTrunkList" : updateList };
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/workinfofinish', param, 'POST', 'workInfoFnsh');
		}
	}else{
		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
	}
}

// 기간망 트렁크 선번창
function showPopRontTrunkInfo( gridId, dataObj ) {
	var sFlag = gridId == "dataGrid"? "N" : "Y";
	var holaYn = gridId == "dataGridHola"? "Y" : "N";
	
//	var url = $('#ctx').val()+'/configmgmt/cfline/RontTrunkInfoPop.do';
	var url = $('#ctx').val() +'/configmgmt/cfline/RontTrunkInfoDiagramPop.do';
	
	$a.popup({
		popid: "RontTrunkInfoDiagramPop",
	  	title: cflineMsgArray['backboneNetworkTrunk'] + "&nbsp;" +cflineMsgArray['information'], /*기간망트렁크 정보*/
	  	url: url,
	    data: {"gridId":gridId, "ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "holaYn":holaYn},
	    iframe: false,
	    modal: false,
	    movable:true,
	    windowpopup : true,
	    width : 1400,
	    height : 880,
	    callback:function(data){
	    	// fnSearch("A", true);
	    }
	});
}

// info list row intex 
function setRowIndexInfo(changeSearch){
	if(changeSearch){
		$("#firstRow01").val(1);
   	    $("#lastRow01").val(pageForCount);
	} 
	else {
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

// work list row intex
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

// 검색
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
	} else if (sType == "H"){
		setRowIndexInfo(true);
		$("#workListYn").val("N");
	}

	var param = $("#searchForm").serialize();

	if($('#lftEqpRoleDiv').val() != "" || $('#lftVendorId').val() != "" 
		|| $('#lftEqpInstlMtsoNm').val() != ""|| $('#lftEqpNm').val() != "" 
		|| $('#lftCardMdlNm').val() != "" || $('#lftShlfNm').val() != "" 
		|| $('#lftSlotNo').val() != "")
	{
		param+="&searchSystem=true";
	}
	
	if (sType == "A"){
		cflineShowProgressBody();	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunklistall', param, 'GET', 'searchA');
	}else if (sType == "T"){
		cflineShowProgress(gridId);
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunklist', param, 'GET', 'searchT');
	}else if (sType == "W"){
		cflineShowProgress(gridWorkId);
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunklist', param, 'GET', 'searchW');
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunkworklist', param, 'GET', 'searchW');
	}else if (sType == "H"){	//기간망HOLA정보 검색
		cflineShowProgressBody();	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontholalist', param, 'GET', 'searchH');
	}
}

function onloadMgmtGrpChange(){
	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "topMtsoIdList", "mtso");
}
