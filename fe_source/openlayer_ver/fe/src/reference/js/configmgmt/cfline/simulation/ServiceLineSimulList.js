/** 
 * ServiceLineSimList.js
 *
 * @author park. i. h.
 * @date 2016.09.08
 * @version 1.0
 */
var svlnSclCdData = [];  // 서비스회선소분류코드 데이터
var svlnTypCdListCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnCommCodeData = [];  // 서비스회선 공통코드
var svlnLclSclCodeData = [];  // 서비스회선 대분류 소분류코드
var bizrCdCodeData = [];
var msgVal = "";		// 메시지 내용

var returnMapping = [] // 회선정보 헤더
var returnWorkMapping = [] // 작업정보 헤더
var workMaxnumber = 0;

var emClass = '' ; // 그리드 편집모드시 필수표시

var svlnLclCd = null;
var svlnSclCd = null;
var tmpSchLcd = "";
var tmpSchScd = "";

var jobInstanceId = "";

var gridIdScrollBottom = true;
var pageForCount = 20;

var showAppltNoYn = false;

var skTb2bSvlnSclCdData = [];
var skBb2bSvlnSclCdData = [];

var gridSearchModel = Tango.ajax.init({
   	url: "tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchservicesimullist"
		,data: {
	        pageNo: 1,             // Page Number,
	        rowPerPage: 30        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
	    }
});

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		
    	createMgmtGrpSelectBox ("mgmtGrpCd", "N", $('#userMgmtCd').val());  // 관리 그룹 selectBox
    	//initGridServiceLine();     
    	setSelectCode();
    	 
    	//setGridEventListener();
        setEventListener();      
    	getGrid();
    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	cflineShowProgressBody();
    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', null, 'GET', 'svlnCommCodeData');
    	
    	 // 사용자 소속 전송실
    	searchUserJrdtTmofInfo("tmofCd");
    	
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
    function setEventListener() {
	 	// 엔터 이벤트 
    	
    	$('#btnExportExcel').setEnabled(false);
    	
     	$('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnSearch').click();
    			return false;
    		}
     	});	      	
     	
    	
	 	// 국사 keydown
     	$('#mtsoNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#mtsoId").val("");
     		}
     	});
     	    	 
    	//조회 
    	 $('#btnMoreDis').on('click', function(e) {
    		 if(nullToEmpty( $('#svlnLclCd').val()) == ""){
    			 alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineLcl'],"","","")); /*"서비스 회선 대분류를 선택해 주세요.;*/
         		return;
    		 } 		 
         });    
    	 
         //엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 funExcelBatchExecute();
         });  

     	// 관리그룹 클릭시
     	$('#mgmtGrpCd').on('change',function(e){
     		if( $('#mgmtGrpCd').val() == '0001' ){
     			//$('#btnServiceSimWritePop').setEnabled(false);
     			showAppltNoYn = false;
     		}else{
     			//$('#btnServiceSimWritePop').setEnabled(true);
     			showAppltNoYn = true;
     		}
     		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
     		changeSvlnLclCd('svlnLclCd', 'svlnSclCd', svlnLclSclCodeData, "mgmtGrpCd", "N"); // 서비스회선소분류 selectbox 제어
     		$('#mgmtGrpCd').setEnabled(false);
       	});   
     	
    	// 서비스회선 대분류 선택 
    	$('#svlnLclCd').on('change', function(e){
    		changeSvlnSclCdSimul('svlnLclCd', 'svlnSclCd', svlnSclCdData, "mgmtGrpCd"); // 서비스회선소분류 selectbox 제어
    		
      	});        	 
    	
    	// 서비스회선소분류코드 선택시
    	$('#svlnSclCd').on('change', function(e){
     		reSetGrid();     		
      	});   	 
    	// 본부 선택시
    	$('#hdofcCd').on('change',function(e){
    		changeHdofc("hdofcCd", "teamCd", "tmofCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "tmofCd", "mtso");
      	});      	 
  		// 전송실 선택시
    	$('#tmofCd').on('change',function(e){
    		changeTmof("tmofCd", "mtso");
      	}); 
		
		// 저장
	    $('#btnServiceSimSave').on('click', function(e) {
	    	workInfFnsh();
	   	});
	   		   	
		// 서비스회선등록
		$('#btnServiceSimWritePop').on('click', function(e) {
            // 이전 등록 정보가 다음에 영향을 주지 않기 위해
    		$.alopex.popup.result = null;
			srvcPopup( "popServcieLineSimWrite", "/configmgmt/cfline/ServiceLineSimulWritePop.do", null, 1000, 450, "서비스회선시뮬레이션등록");
		});
              
		//국사찾기
		$('#btnMtsoSch').on('click', function(e) {
			var paramValue = "";
			
			paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text(),"orgId": $('#hdofcCd').val()
					,"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val()
					, "regYn" : "Y", "mtsoStatCd" : "01"}
			openMtsoDataPop("mtsoCd", "mtsoNm", paramValue);
		});  
		
    	//조회 
    	$('#btnSearch').on('click', function(e) {

    		 gridIdScrollBottom = true;
    		 if(nullToEmpty($('#svlnLclCd').val()) == ""){
    			 alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineLcl'],"","","")); /*"서비스 회선 대분류를 선택해 주세요.;*/
         		return;
    		 }
    		 
    		 searchProc();    		 
         });
    	 
    	// 스크롤조회
		$('#'+gridIdWork).on('scrollBottom', function(e){
    		var nFirstRowIndex =parseInt($("#firstRow01").val()) + pageForCount; // 페이징개수
    		var nLastRowIndex =parseInt($("#lastRow01").val()) + pageForCount; // 페이징개수
    		$("#firstRow01").val(nFirstRowIndex);
    		$("#lastRow01").val(nLastRowIndex);  
    		$("#firstRowIndex").val(nFirstRowIndex);
    		$("#lastRowIndex").val(nLastRowIndex);  
    		
    		
    		var tmofCd = [];
    		var tmofCdListView = '';

        	var dataParam =  $("#searchForm").serialize(); 
        	dataParam.svlnSclCd ='';

        	dataParam = dataParam+"&mgmtGrpCd=" + $('#mgmtGrpCd').val();
        	
        	/*var pathAll = false;
        	if($("input:checkbox[id='pathAll']").is(":checked")){
        		dataParam.pathAll = 'Y';
    		}*/
        	
        	
    		/*if (nullToEmpty($("#tmofCd").val()) != "") {
    			tmofCd = $("#tmofCd").val() ;	
    			for (var i=0; i < tmofCd.length; i++) {
    				tmofCdListView = tmofCdListView + (i > 0 ? ',' : '') + tmofCd[i];
    			}
    		}*/

        	//dataParam.tmofCd = '';  // array는 빈값처리
        	//dataParam.tmofCdListView = tmofCdListView;  // 편집한 값을 셋팅
    		//console.log(dataParam);
        	if(gridIdScrollBottom){
            	cflineShowProgress();
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchservicesimullist', dataParam, 'GET', 'searchForPageAdd');
        	}
    	});   
        
    	
		// 작업정보 그리드 클릭시
		$('#'+gridIdWork).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var selectedId = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{ editing:true}});
        	
        	if (data == null || selectedId.length == 0) {
        		return false;
        	}
        	// 회선개통일자
        	if (object.mapping.key == "lineOpenDt") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	// 회선해지일자
        	if (object.mapping.key == "lineTrmnDt") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	// 청약일자
        	if (object.mapping.key == "appltDt") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}

        	// 회선해지예정일자
        	if (object.mapping.key == "lineTrmnSchdDt") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	         	
        });
		
		// 작업정보 그리드 더블클릭
		$('#'+gridIdWork).on('dblclick', '.bodycell', function(e){

			var dataObj = AlopexGrid.parseEvent(e).data;
			var dataKey = dataObj._key;
    	    // 교환기 포트ID 팝업
    	 	/*if(dataKey == "exchrNm" || dataKey == "exchrPortId"){
    	 		if ( dataObj._state.focused) {
	    	 		var exchrParam = {"scrbSrvcMgmtNo":dataObj.scrbSrvcMgmtNo};
	    			srvcPopup( "popServiceLineExchrList", '/configmgmt/cfline/ServiceLineExchrPop.do', exchrParam, 600, 400, "QDF "+cflineMsgArray['establishment']설정);
    	 		}
    	 	} else*/ 
			if ( dataKey == "pktTrkNm") {
    	 		var param = {"vlanId" : dataObj.vlanId};
    	 		//pwEvcListPop(param);
    	 	} else if (dataKey == "rontNtwkLineNo" || dataKey == "rontTrkNm" ) {
    	 		var param = {"popFlag" : "serviceLineRontSearch"};
    	 		//searchRontTrunkPop(param);
    	 	}else{
    	 		openServiceLineSimulInfo(dataObj);
    	 	}
			
		});
		
		//상세
		/*$('#btnServiceSimDetatil').on('click', function(e) {
			var testParam = {};
			testParam.svln_no = 'VS00000000003';
			openServiceLineSimulInfo(testParam);
		});*/
		
		//삭제
		$('#btnServiceSimDelete').on('click', function(e) {
			removeServiceLineSimulation();
		});
		
		//편집
		$('#btnServiceSimEdit').on('click', function(e) {
			var deleteList = AlopexGrid.trimData ( $('#'+gridIdWork).alopexGrid("dataGet", { _state : {selected:true }} ));
	    	
	    	if (deleteList.length <= 0) {
	    		alertBox('W', cflineMsgArray['selectNoData']);   	 /*선택된 데이터가 없습니다. */
	    		return;
	    	}
	    	
	    	$('#btnServiceSimEdit').hide();
	    	$('#btnServiceSimSave').show();
	    	$('#'+gridIdWork).alopexGrid("startEdit" , {_state : {selected:true}});
		});
    };
    
    // 그리드 편집모드시 달력
    function datePicker(gridId, cellId, rowIndex, keyValue){
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		var insertDate = dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
    		$('#' + gridId + '').alopexGrid("cellEdit", insertDate, {_index : { row : rowIndex }}, keyValue);
		});
    }
    
    // 상세화면
    function openServiceLineSimulInfo(detailInfo) {
    	//console.log(detailInfo);
    	srvcPopup( "popServcieLineSimInfo", "/configmgmt/cfline/SimulationPathVisualizationPop.do", detailInfo, 1630, 870, cflineMsgArray['serviceLineSimulationDetailInfo']); /*서비스회선 시뮬레이션 상세*/
    }
    
    // 삭제처리
    function removeServiceLineSimulation(){
		var deleteList = AlopexGrid.trimData ( $('#'+gridIdWork).alopexGrid("dataGet", { _state : {selected:true }} ));
		    	
    	if (deleteList.length <= 0) {
    		alertBox('W', cflineMsgArray['selectNoData']);   /*	 *선택된 데이터가 없습니다. */
    		return;
    	}
    	
    	var chkTrnsDmndMngNo = 0;   
    	
    	var dataParam = $("#searchForm").getData();
    	
    	/* 전송망 수요를 삭제하시겠습니까? */ 
    	callMsgBox('','C', cflineMsgArray['deleteMsg'], function(msgId, msgRst){ /* 삭제 하시겠습니까?*/

    		if (msgRst == 'Y') {
    			cflineShowProgressBody();	
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/removesimulation?method=delete'
    					     , deleteList
    					     , 'POST'
    					     , 'removeSimulation');
    		}
    	});    	
    }
    
    // 저장
	function workInfFnsh() {
		
		if ($('#' + gridIdWork).alopexGrid('dataGet', {_state : {selected : true	}}).length <= 0) {
			alertBox('W', cflineMsgArray['selectNoData']);   /*	 *선택된 데이터가 없습니다. */
			
			//$("#" + gridIdWork).alopexGrid("startEdit");
			return;
		}
		
		$('#' + gridIdWork).alopexGrid('endEdit', {
			_state : {
				editing : true
			}
		});
		
		var dataList =  $('#' + gridIdWork).alopexGrid('dataGet', {_state : {selected : true	}});
			
		var paramUsing = null;
		var paramList = [];
		var requiredColumn = rtnRequiredColumn(svlnLclCd, svlnSclCd);
		var validate = true;
		for(i=0;i<dataList.length;i++){
			$.each(requiredColumn, function(key, val){
				var value = eval("dataList[i]" + "." + key);
				if(nullToEmpty(value) == ""){
					msgStr = "<br>"+ val;
					validate = false;
					return validate;
				}
			});
			
			if(!validate){
				alertBox('W', makeArgMsg('required', msgStr, "","","")); /* 필수 입력 항목입니다.[{0}] */
				$('#'+gridIdWork).alopexGrid("startEdit" , {_state : {selected:true}});
				return;
			}
			paramList[i] = dataList[i];		
		}

		//console.log();
		callMsgBox('','C', cflineMsgArray['save'], function(msgId, msgRst){  
			if (msgRst == 'Y') {
				cflineShowProgressBody();
				paramUsing = {
					"serviceLineList" : paramList
				};
				httpRequest(
						'tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/updateservicelinesimulation',
						paramUsing, 'POST', 'workInfFnsh');
			} else {
				$('#'+gridIdWork).alopexGrid("startEdit", {_state : {selected:true}});
				return;
			};
		});
		
	}
	
	// 기지국망-LTE PW/EVC명 검색
	function pwEvcListPop (data){
		 $a.popup({
 			popid: "PwEvcListPop",
 			title: "PW/EVC명 검색",
 			url: 'PwEvcListPop.do',
			data: data,
 			iframe: true,
 			modal : true,
 			movable:true,
 			width : 1000,
 			height : 600
 			,callback:function(data){
 				if(data != null){
 		    		var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
 		    		var rowIndex = focusData[0]._index.data;
 					$('#'+gridIdWork).alopexGrid( "cellEdit", data.pktTrkNm, {_index : { row : rowIndex}}, "pktTrkNm");
 					$('#'+gridIdWork).alopexGrid( "cellEdit", data.pktTrkNo, {_index : { row : rowIndex}}, "pktTrkNo");
 					$('#'+gridIdWork).alopexGrid( "cellEdit", data.ringOneName, {_index : { row : rowIndex}}, "ringOneName");
 					$('#'+gridIdWork).alopexGrid( "cellEdit", data.eqpNmOne, {_index : { row : rowIndex}}, "eqpNmOne");
 					$('#'+gridIdWork).alopexGrid( "cellEdit", data.ringTwoName, {_index : { row : rowIndex}}, "ringTwoName");
 					$('#'+gridIdWork).alopexGrid( "cellEdit", data.eqpNmTwo, {_index : { row : rowIndex}}, "eqpNmTwo");
 					$('#'+gridIdWork).alopexGrid( "cellEdit", data.eqpPortVal, {_index : { row : rowIndex}}, "eqpPortVal");
 				}

				// 다른 팝업에 영향을 주지않기 위해
				//$.alopex.popup.result = null;
 			}  
		});
    }
    
    // 조회
    /*
	 * 조회 함수
	 */
	function searchProc(){
		
    		
    	//var dataParam =  $("#searchForm").serialize();

		var tmofCd = [];
		var tmofCdListView = '';
		$('#mtsoCd').val("");
		$("#firstRow01").val(1);
     	$("#lastRow01").val(pageForCount); // 페이징개수
		$("#firstRowIndex").val(1);
     	$("#lastRowIndex").val(pageForCount); // 페이징개수
     	
     	var dataParam =  $("#searchForm").serialize(); 
     	
    	dataParam.svlnSclCd ='';
    	
    	//dataParam.mgmtGrpCd = $('#mgmtGrpCd').val();
    	//console.log(dataParam.mgmtGrpCd);&mgmtGrpCd=0001
    	dataParam = dataParam+"&mgmtGrpCd=" + $('#mgmtGrpCd').val();
     	//console.log(dataParam);
    	
    	/*var pathAll = false;
    	if($("input:checkbox[id='pathAll']").is(":checked")){
    		dataParam.pathAll = 'Y';
		}*/
    	
    	
		/*if (nullToEmpty($("#tmofCd").val()) != "") {
			tmofCd = $("#tmofCd").val() ;	
			for (var i=0; i < tmofCd.length; i++) {
				tmofCdListView = tmofCdListView + (i > 0 ? ',' : '') + tmofCd[i];
			}
		}*/

    	//dataParam.tmofCd = '';  // array는 빈값처리
    	//dataParam.tmofCdListView = tmofCdListView;  // 편집한 값을 셋팅
    	
    	//console.log(dataParam);    	
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/searchservicesimullist', dataParam, 'GET', 'searchAllWork');
    	//console.log(dataParam);
    	/*gridSearchModel.get({
       		data: dataParam,
       		flag: gridIdWork
   		}).done(function(response,status,xhr,flag){successCallback(response, null, null, gridIdWork);})
   	  	  .fail(function(response,status,flag){failCallback(response, null, null, gridIdWork);});*/
    	cflineShowProgressBody();		
    	

	}
	
    // 팝업열기 공통
    function srvcPopup( popId, url, paramData, widthVal, heightVal, titleStr){
		var heightValue = window.innerHeight * 0.9;
		if(heightVal != null && heightVal>0){
			heightValue = heightVal;
		}
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: $('#ctx').val() + url,
			data: paramData,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				if(popId == "popServiceLineExchrList"){
					if(data != null){
			    		var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
			    		var rowIndex = focusData[0]._index.data;
						$('#'+gridIdWork).alopexGrid( "cellEdit", data.exchrPortId, {_index : { row : rowIndex}}, "exchrPortId");	
						$('#'+gridIdWork).alopexGrid( "cellEdit", data.exchrNm, {_index : { row : rowIndex}}, "exchrNm");	
					}
				}
				if(popId == "popServcieLineSimWrite"){
					//console.log(data);
					if(data != null){
						if(data.Result == "OK_REG"){
							if(data.serviceLineVO != null){
					    		
					    		callMsgBox('', 'I', cflineMsgArray['saveSuccess'] /* 저장을 완료 하였습니다. */, function() {
					    			//console.log(data.serviceLineVO);
					    			
						    		searchProc();
						    		//console.log(data);
						    		openServiceLineSimulInfo(data.serviceLineVO);
						    		// 다른 팝업에 영향을 주지않기 위해
									$.alopex.popup.result = null;
					    		}); 
								
							}
						} else if (data.Result == "Fail") {
							alertBox('I', cflineMsgArray['saveFail'] /* 저장을 실패 하였습니다. */); 
						}						
					}
				}
				// 상세화면 
				if (popId == "popServcieLineSimInfo") {
					//console.log(data);
					if(data != null){
						//console.log(data.changeYn);
						if(data.changeYn == "Y"){
							// 다른 팝업에 영향을 주지않기 위해
							$.alopex.popup.result = null;
							searchProc();
							
						}
					}
				}
			}
		}); 		
	} 
    
    // 트리그리드 ru, du일때 활성
    var useTreeYn = function(){
    	return false;
    	if(svlnLclCd != "003" && svlnSclCd != "016"){
        	return false;
    	}else{
    		return true;
    	}
    }
    
    //그리드 재셋팅
    function reSetGrid(){
    	svlnLclCd = $('#svlnLclCd').val();
    	svlnSclCd = $('#svlnSclCd').val();
    	//그리드 재설정후 데이터 비우고 건수 0으로 변경
    	$('#'+gridIdWork).alopexGrid("dataEmpty");
    	getGrid(svlnLclCd, svlnSclCd);
		$('#'+gridIdWork).alopexGrid('updateOption',
				{paging : {pagerTotal: function(paging) {
					return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + 0;
				}}}
		);
    	//$('#workTotalCntSpan').text("");
    }
    
  //Grid 초기화
    var getGrid = function(svlnLclCd, svlnSclCd, response, gridDiv) {
    	
    	//선번정보 표시유무
    	var pathAll = false;
    	if($("input:checkbox[id='pathAll']").is(":checked")){
    		pathAll = true;
		}
    	/*
    		svlnLclCd
    		000 :	미지정 
    		001 :	기지국회선
    		003 :	RU회선
    		004 :	가입자망회선
    		005 :	B2B
    		006 :	기타회선	
    	*/
    	
    	// 미지정
    	/*if(svlnLclCd =="000"){
			returnMapping = mapping001001('info', showAppltNoYn);
			returnWorkMapping = mapping001001('work', showAppltNoYn);
    	// 기지국 회선
    	}else if(svlnLclCd =="001"){
    		//교환기간
    		if(svlnSclCd == "001"){
    			returnMapping = mapping001001('info', showAppltNoYn);
    			returnWorkMapping = mapping001001('work', showAppltNoYn);
    		// 기지국간
    		}else if(svlnSclCd == "002"){
    			returnMapping = mapping001002('info', showAppltNoYn);
    			returnWorkMapping = mapping001002('work', showAppltNoYn);
    		// 상호접속간
    		}else if(svlnSclCd == "003"){
    			returnMapping = mapping001003('info', showAppltNoYn);
    			returnWorkMapping = mapping001003('work', showAppltNoYn);
    		//DU
    		}else if(svlnSclCd == "016") {
    			returnMapping = mapping001016('info', showAppltNoYn);
    			returnWorkMapping = mapping001016('work', showAppltNoYn);
    		}else if(svlnSclCd == "020") {
				returnMapping = mapping001020('info');
				returnWorkMapping = mapping001020('work');
    		}else {
				returnMapping = mapping001002('info', showAppltNoYn);
				returnWorkMapping = mapping001002('work', showAppltNoYn);
			}
    	// RU회선
    	}else if(svlnLclCd == "003"){
    		// 광코어
    		if(svlnSclCd == "101" || svlnSclCd == "104" || svlnSclCd == ""){
    			returnMapping = mappingCore003('info', showAppltNoYn);
    			returnWorkMapping = mappingCore003('work', showAppltNoYn);
    		//RU
    		}else {
    			returnMapping = mappingRu003('info', showAppltNoYn);
    			returnWorkMapping = mappingRu003('work', showAppltNoYn);
    		}
    	// 가입자망 회선
    	}else if(svlnLclCd == "004"){
    		returnMapping = mapping004('info', showAppltNoYn);
    		returnWorkMapping = mapping004('work', showAppltNoYn);
    	// B2B
    	}else if(svlnLclCd == "005"){
    		if ( $('#mgmtGrpCd').val() == '0002' ) {
    			returnMapping = mapping005('info', showAppltNoYn);
    			returnWorkMapping = mapping005('work', showAppltNoYn);
    		} else {
    			if ( $('#mgmtGrpCd').val() == '0001' ){
        			returnMapping = mapping001005('info', true, showAppltNoYn);
        			returnWorkMapping = mapping001005('work', true, showAppltNoYn);
    			} else {
        			returnMapping = mapping001005('info', false, showAppltNoYn);
        			returnWorkMapping = mapping001005('work', false, showAppltNoYn);
    			}
    		}
    	// 기타회선
    	}else{
    		if (svlnSclCd == "102") {
    			returnMapping = mappingWifi003('info', showAppltNoYn);
    			returnWorkMapping = mappingWifi003('work', showAppltNoYn);
			} else if  (svlnSclCd == "105") {
    			returnMapping = mappingNits('info', showAppltNoYn);
    			returnWorkMapping = mappingNits('work', showAppltNoYn);
			} else {
	    		returnMapping = mapping006('info', showAppltNoYn);
	    		returnWorkMapping = mapping006('work', showAppltNoYn);
			}
    	}*/
    	
    	returnWorkMapping = [
    	                      	  { selectorColumn : true, width : '50px' }
								, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px' , hidden:true}
								, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
								, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'].replace("대","") /*  서비스회선 대분류 */			,align:'center', width: '100px'}
								, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '200px', editable: true}
								, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '100px', hidden:true}
								, {key : 'lineCapaCd'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px',
									render : {
										type : 'string',
										rule : function(value, data) {
											var render_data = [];
												if (svlnCommCodeData.svlnCapaCdList.length > 1) {
													return render_data = render_data.concat(svlnCommCodeData.svlnCapaCdList);
												} else {
													return render_data.concat({value : data.lineCapaCd,text : data.lineCapaCdNm });
												}
										}
									},
									editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnCapaCdList; }
											 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
									},
									editedValue : function(cell) {
										return $(cell).find('select option').filter(':selected').val(); 
									}
								}
								, {key : 'b2bCustNm'	            ,title : cflineMsgArray['businessToBusinessCustomerName'] /*B2B고객명*/				,align:'center', width: '200px', editable: true}
								, {key : 'topUprMtsoIdNm'	            ,title : cflineMsgArray['upperTransOffice'] /*  상위 전송실 */			,align:'center', width: '100px'}
								, {key : 'uprMtsoIdNm'	            ,title : cflineMsgArray['upperMtso']  /*  상위국사 */			,align:'center', width: '100px'}
								, {key : 'topLowMtsoIdNm'	            ,title : cflineMsgArray['lowerTransOffice'] /* 하위 전송실 */			,align:'center', width: '100px'}
								, {key : 'lowMtsoIdNm'	            ,title : cflineMsgArray['lowerMtso'] /* 하위국사 */			,align:'center', width: '100px'}
								, {key : 'frstRegUserNm'	            ,title : cflineMsgArray['registrant'] /* 등록자 */			,align:'center', width: '100px'}
    	                	];
    	//선번정보 추가
    	if (pathAll == true && response != undefined){
    		response.ServiceLineWorkList = makeHeader(response.lists, 'work');    		
    	}
    	        
        //그리드 생성
        $('#'+gridIdWork).alopexGrid({
        	autoColumnIndex: true,
        	autoResize: true,
        	cellSelectable : false,
        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        	rowInlineEdit : false, //행전체 편집기능 활성화
        	rowClickSelect : true,
        	rowSingleSelect : false,
        	numberingColumnFromZero: false,
        	defaultColumnMapping:{sorting: true},
        	enableDefaultContextMenu:false,
    		enableContextMenu:true,
        	message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		},
        	columnMapping:returnWorkMapping
    		//,tree : { useTree:useTreeYn(), idKey:'treeNo', parentIdKey : 'treePrntNo', expandedKey : 'treeDivVal'}
    		/*,ajax: {
		         model: gridSearchModel            // ajax option에 grid 연결할 model을지정
		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		    }*/
    		,paging: {                             // alopexGrid option의 paging을조정해야한다.
                //pagerTotal: true,                 // 데이터 total count표시 (true로한다)
                pagerSelect: false,               // 페이지당 보여지는 갯수를 조정하는 select 표시여부 (false로한다)
                hidePageList: true                // paging숫자/버튼 감출것인지여부( true로한다 )
            }
        });     
    	$('#'+gridIdWork).alopexGrid("columnFix", 2);
    	//	작업 정보 편집모드 활성화
    	//$("#"+gridIdWork).alopexGrid("startEdit");
		
    }   
        
 // 필수컬럼을 회선구분에 따라 리턴해주는 함수
    function rtnRequiredColumn(svlnLclCd, svlnSclCd){
    	var requiredColumn = null
    	
    	// 몇개의 컬럼만 작업
    	requiredColumn = 
		{ 
    		  lineNm : cflineMsgArray['lnNm']   //회선명 
    		, lineCapaCd : cflineMsgArray['lineCapacity'] //회선용량
			, b2bCustNm : cflineMsgArray['businessToBusinessCustomerName'] //B2B고객명
		};
    	/*//여기서부터 대분류 코드, 소분류코드에 따른 필수컬럼을 체크해준다.
    	//미지정
    	if(svlnLclCd == '000') {
			requiredColumn = 
			{ 
	    		lineNm : cflineMsgArray['lnNm']   회선명 
				, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode']
				, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹 
				, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
				, svlnTypCdNm : cflineMsgArray['serviceLineType']   서비스회선유형 
				, lineCapaCdNm : cflineMsgArray['lineCapacity'] 회선용량
				, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
				, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
				, lineDistTypCd : cflineMsgArray['lineDistanceType'] 회선거리유형
				, lineSctnTypCd : cflineMsgArray['lineSectionType'] 회선구간유형
				, chrStatCd : cflineMsgArray['chargingStatus'] 과금상태
				,lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] 회선관리등급
			};
    	}
    	//기지국회선
    	if(svlnLclCd == '001') {
    		if(svlnSclCd == '001'){
				requiredColumn = 
    				{ 
    		    		lineNm : cflineMsgArray['lnNm']   회선명 
    					, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] 회선사용기간유형코드
    					, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹 
    					, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
    					, svlnTypCdNm : cflineMsgArray['serviceLineType']   서비스회선유형 
    					, lineCapaCdNm : cflineMsgArray['lineCapacity'] 회선용량
    					, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
    					, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
    					, lineDistTypCd : cflineMsgArray['lineDistanceType'] 회선거리유형
    					, lineSctnTypCd : cflineMsgArray['lineSectionType'] 회선구간유형
    					, chrStatCd : cflineMsgArray['chargingStatus'] 과금상태
    					, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] 회선관리등급
    				};
    		}else if (svlnSclCd == '002'){
    			requiredColumn = 
    			{ 
    					lineNm : cflineMsgArray['lnNm']   회선명 
	    			 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] 회선사용기간유형코드
	    			 	, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹  
	    			 	, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
    					, svlnTypCdNm : cflineMsgArray['serviceLineType']   서비스회선유형 
	    			 	, lineCapaCdNm : cflineMsgArray['lineCapacity'] 회선용량
	    			 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
	    			 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
	    			 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] 회선거리유형
	    			 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] 회선구간유형
	    			 	, chrStatCd : cflineMsgArray['chargingStatus'] 과금상태
	    			 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] 회선관리등급
    			};
    		}else if (svlnSclCd == '003'){
    			requiredColumn = 
    			{ 
    					lineNm : cflineMsgArray['lnNm']   회선명 
    					, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] 회선사용기간유형코드
    					, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹 
    					, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
    					, svlnTypCdNm : cflineMsgArray['serviceLineType']   서비스회선유형 
    					, lineCapaCdNm : cflineMsgArray['lineCapacity'] 회선용량
    					, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
    					, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
    					, lineDistTypCd : cflineMsgArray['lineDistanceType'] 회선거리유형
    					, lineSctnTypCd : cflineMsgArray['lineSectionType'] 회선구간유형
    					, chrStatCd : cflineMsgArray['chargingStatus'] 과금상태
    					, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] 회선관리등급
    			};
    		}else{
    			requiredColumn = 
    			{ 

    			};
    		}
    	}
    	//RU회선
    	if(svlnLclCd == '003') {
    		requiredColumn =
    		{ 
					
    		};
    	}
    	//가입자망회선
    	if(svlnLclCd == '004') {
			requiredColumn = 
			{ 
					lineNm : cflineMsgArray['lnNm']   회선명 
    			 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] 회선사용기간유형코드
    			 	, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹  
    			 	, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
					, svlnTypCdNm : cflineMsgArray['serviceLineType']   서비스회선유형 
    			 	, lineCapaCdNm : cflineMsgArray['lineCapacity'] 회선용량
    			 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
    			 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
    			 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] 회선거리유형
    			 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] 회선구간유형
    			 	, chrStatCd : cflineMsgArray['chargingStatus'] 과금상태
    			 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] 회선관리등급
			};
    	}
    	//B2B
    	if(svlnLclCd == '005') {
    		if ( $('#mgmtGrpCd').val() == '0002' ) {
        		requiredColumn = 
    			{ 
    				lineNm : cflineMsgArray['lnNm']   회선명 
				 	, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹 
				 	, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
				 	, svlnTypCdNm : cflineMsgArray['serviceLineType']   서비스회선유형 
				 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
				 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
    			};
    		}else {
        		requiredColumn = 
    			{ 
        			lineNm : cflineMsgArray['lnNm']   회선명 
				 	, svlnNo : cflineMsgArray['serviceLineNumber']  서비스회선번호
				 	, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹 	
				 	, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
				 	, svlnTypCdNm : cflineMsgArray['serviceLineType']   서비스회선유형 	
				 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
				 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
    			};
    		}
    	}
    	//기타회선
    	if(svlnLclCd == '006') {
    		if(svlnSclCd != '102' && svlnSclCd != '105' ){
	    		requiredColumn = 
				{ 
	    				lineNm : cflineMsgArray['lnNm']   회선명 
	    		 		, mgmtGrpCdNm : cflineMsgArray['managementGroup']   관리그룹 
	    				, svlnSclCdNm : cflineMsgArray['serviceLineScl']   서비스회선 소분류 
	    		 		, svlnTypCd : cflineMsgArray['serviceLineType']   서비스회선유형 	
	    		 		, lineCapaCd : cflineMsgArray['lineCapacity'] 회선용량
	    		 		, svlnStatCd : cflineMsgArray['serviceLineStatus']   서비스회선상태 
	    		 		, faltMgmtObjYn : cflineMsgArray['faultManagementObjectYesOrNo'] 고장관리대상여부
	    		 		, uprMtsoIdNm : cflineMsgArray['upperMtso'] 상위국사
	    		 		, lowMtsoIdNm : cflineMsgArray['lowerMtso'] 하위국사
				};
    		}else{
        		requiredColumn =
        		{ 
        		};    			
    		}
    	}*/
    	
    	if(requiredColumn == null) {
    		requiredColumn =
    		{ 
    		};
    	}    	
    	return requiredColumn;
    }
    
  //MAKEHEADER 
    function makeHeader (data, flag){ // flag 값에따라 작업정보인지 아닌지 구분
    	var mapping = '';
    	var maxnumber = 0;
    	var number = 0;
    	
    	
    	for(var i=0; i<data.length; i++){
			var serviceLineList = data[i].serviceLineList  ;
			if(serviceLineList != null && serviceLineList.length  > 0 ){
				for(var j=0; j<serviceLineList.length; j++){
					var k = j +1 ; 
					data[i]["nodeNm#"+j] = serviceLineList[j].nodeNm;
					data[i]["nodeId#"+j] = serviceLineList[j].nodeId;
				}
				number  = serviceLineList.length;
			}
			
    		if (workMaxnumber < number){
    			workMaxnumber = number;
			}
		}
    	//console.log(returnWorkMapping);
		mapping = returnWorkMapping;
		maxnumber = workMaxnumber;
    		
    	//MAKEHEADER 
    	for(var j=0; j < maxnumber; j++){
    		var k = j +1 ; 
    		mapping.push({ key:'nodeNm#'+j    , title:'NODE #'+k     ,align:'left', width: '200px' });
    		//mapping.push({ key:'nodeId#'+j	  , title:'NODE ID#'+k	    	,align:'left', width: '200px' });
    	}
    	
    	//console.log(mapping);
    	return data;
    }
    
	function successCallback(response, status, jqxhr, flag){
				
		 // 서비스 회선에서 사용하는 대분류, 소분류, 회선유형 코드
		if(flag == 'svlnLclSclCodeData') {	
			var tmpMgmtCd = $('#mgmtGrpCd').val();
			var tmpMgmtCdNm = $('#mgmtGrpCd option:selected').text();
			svlnLclSclCodeData = response;
			var svlnLclCd_option_data =  [];
			var tmpFirstSclCd = "";
			for(i=0; i<response.svlnLclCdList.length; i++){
				var dataL = response.svlnLclCdList[i]; 
				if(i==0){
					tmpFirstSclCd = dataL.value;
				}
				if(nullToEmpty(tmpMgmtCdNm) == cflineCommMsgArray['all']  /*"전체"*/ || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataL.cdFltrgVal) || "ALL" == nullToEmpty(dataL.cdFltrgVal) ){
					svlnLclCd_option_data.push(dataL);
				}
				
			}
			$('#svlnLclCd').clear();
			$('#svlnLclCd').setData({data : svlnLclCd_option_data});
			
			// 서비스회선유형코드 셋팅
			svlnTypCdListCombo = response.svlnTypCdListCombo;
	
			var svlnSclCd_option_data =  [];
			var svlnSclCd2_option_data =  [];
	
			var tmpSvlnLclCd = $('#svlnLclCd').val();
			for(k=0; k<response.svlnSclCdList.length; k++){
				
				if( (response.svlnSclCdList[k].uprComCd == "005" ) && (response.svlnSclCdList[k].cdFltrgVal == "SKT") ){
					skTb2bSvlnSclCdData.push(response.svlnSclCdList[k]);
				}else if( (response.svlnSclCdList[k].uprComCd == "005" ) && (response.svlnSclCdList[k].cdFltrgVal == "SKB") ){
					skBb2bSvlnSclCdData.push(response.svlnSclCdList[k]);
				}
				
				if(k==0 && tmpFirstSclCd =="005"){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
					svlnSclCd_option_data.push(dataFst);
					svlnSclCd2_option_data.push(dataFst);
				}
	
				var dataOption = response.svlnSclCdList[k]; 
				if(nullToEmpty(tmpSvlnLclCd) == nullToEmpty(dataOption.uprComCd) 
						&& ("ALL" == nullToEmpty(dataOption.cdFltrgVal) || nullToEmpty(tmpMgmtCdNm) == cflineCommMsgArray['all']  /*"전체"*/ || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataOption.cdFltrgVal) )){
					svlnSclCd_option_data.push(dataOption);
				}
				
				svlnSclCd2_option_data.push(dataOption);
				
			}		
			svlnSclCdData = svlnSclCd2_option_data;	
			$('#svlnSclCd').clear();
			$('#svlnSclCd').setData({data : svlnSclCd_option_data});	
			
			reSetGrid();
		 	//임차회선포함 체크박스 제어
		 	//leslDisplayProc("svlnLclCd", "svlnSclCd");
			$('#btnMoreDis').click();
		} 
		
		// 서비스 회선에서 사용하는 코드
		if(flag == 'svlnCommCodeData') {
			svlnCommCodeData = response;
			cflineHideProgressBody();
			//makeSearchFormByMgmt('svlnLclCd', 'svlnSclCd', svlnSclCdData);
		}
		
		var serverPageinfo;
		
		if (flag == 'searchAllWork') {
			//console.log(response);
			if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		// 총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	// 한 페이지에 보일 데이터 갯수
	    	      	};
	    	}
			//console.log(serverPageinfo);
			cflineHideProgressBody();
    		getGrid(svlnLclCd, svlnSclCd, response);
    		cflineHideProgressBody();
    		if(response.totalCount > 0 ){
    	    	//$('#totalCntSpan').text("(" + getNumberFormatDis(response.totalCnt) + ")");
    			$('#btnExportExcel').setEnabled(true);
    		}else{
    			//$('#totalCntSpan').text("");
    			$('#btnExportExcel').setEnabled(false);
    		}    
    		   	
    		
    		//setSPGrid(gridIdWork, response.lists, serverPageinfo);

    		$('#'+gridIdWork).alopexGrid("dataSet", response.lists);
    		$('#'+gridIdWork).alopexGrid('updateOption',
    				{paging : {pagerTotal: function(paging) {
    					return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(response.totalCount);	
    				}}}
    		); 
		}
		
		if(flag == 'searchForPageAdd'){
			
			if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		// 총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	// 한 페이지에 보일 데이터 갯수
	    	      	};
	    	}
			
			
    		cflineHideProgress(gridIdWork);
			if(response.lists.length == 0){
				gridIdScrollBottom = false;
				return false;
			}else{
        		getGrid(svlnLclCd, svlnSclCd, response, gridIdWork);
	    		$('#'+gridIdWork).alopexGrid("dataAdd", response.lists, serverPageinfo);
			}
    	}
		
		// 삭제
		if (flag == 'removeSimulation') {
			cflineHideProgressBody();
			callMsgBox('', 'I', cflineMsgArray['normallyProcessed'], function() { /*정상적으로 처리 되었습니다.*/
				$('#btnSearch').click();
			});
		}
		
		// 저장
		if(flag == 'workInfFnsh'){
			cflineHideProgressBody();
			if (response.Result == "Success") {
				callMsgBox('', 'I', makeArgMsg('processed', response.upCount ,"","",""), function() { /* ({0})건 처리 되었습니다. */
					searchProc();
					$('#btnServiceSimEdit').show();
					$('#btnServiceSimSave').hide();
				});
			} else {
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
				$("#" + gridIdWork).alopexGrid("startEdit", {_state : {selected:true}});
			}    		
		}
		// 엑셀다운로드
		if(flag == 'excelBatchExecute') {
	   		
    		if(response.returnCode == '200'){ 
    				
    			jobInstanceId  = response.resultData.jobInstanceId;
    			cflineHideProgressBody();
    			$('#excelFileId').val(response.resultData.jobInstanceId );
    			excelCreatePop(jobInstanceId);
    		}
    		else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
	}
	
	// 엑셀다운로드팝업
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
	

	//request 실패시.
    function failCallback(response, status, flag){
    	cflineHideProgressBody();
    	if (flag == 'searchAllWork') {
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		return;
    	} else if(flag == 'workInfFnsh'){
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			$("#" + gridIdWork).alopexGrid("startEdit", {_state : {selected:true}});
    	}
    }
    
    function onloadMgmtGrpChange(){
    	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
    }
    
    //배치실행 
    function funExcelBatchExecute() {
    	var tmofCdList = "";
    	var tmofCdList2 = [];
    	var lenList = 0;
    	/*var tmofFullSize = $('#tmofCd option').size(); // 2017-07-18 속도저하방지
*/   		if (nullToEmpty( $("#tmofCd").val() )  != ""  ){
   			lenList = $("#tmofCd").val().length;
   			tmofCdList2 = $("#tmofCd").val();
   			for(i=0; i<lenList; i++){
   				if(tmofCdList==""){
   					tmofCdList = nullToEmpty($("#tmofCd").val()[i]);
   				}else{
   					tmofCdList = tmofCdList + "," + nullToEmpty($("#tmofCd").val()[i]);   					
   				}

   			}
   		} /*else if ( nullToEmpty( $("#tmofCd").val() ).length == tmofFullSize ){
   			tmofCdList = null;
   		} */else {
   			tmofCdList = null;
   		}
   		
    	var dataParamMethod = "";
    	var dataCnt = 0;
		dataParamMethod = "W";
		var data = $('#'+gridIdWork).alopexGrid('dataGet');
		dataCnt = data.length;
		fileName = '서비스시뮬레이션';   //서비스회선정보
    	
		$('#mtsoCd').val("");
     	var dataParam =  $("#searchForm").getData();
     	
     	$.extend(dataParam,{tmofCdList: tmofCdList });
     	$.extend(dataParam,{tmofCd: tmofCdList2 });
    	var pathAll = 'N' ;
    	if ($("input:checkbox[id='pathAll']").is(":checked") ){
    		pathAll = 'Y'; 
    	}
    	$.extend(dataParam,{pathAll: pathAll });
     	
     	dataParam = gridExcelColumn(dataParam, gridIdWork);
     
    	dataParam.fileExtension = "xlsx";
     	dataParam.method = dataParamMethod;
     	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
});
