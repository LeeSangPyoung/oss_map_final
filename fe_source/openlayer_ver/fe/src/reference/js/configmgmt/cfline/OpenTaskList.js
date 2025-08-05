/**
 * OpenTaskList.js
 *
 * @author park. i. h.
 * @date 2017.07.25
 * @version 1.0
 */

var returnLineMapping = [];
var svlnTypCdListCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnTypCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnCommCodeData = [];  // 서비스회선 공통코드
var cmCodeData = [];  // 서비스회선 공통코드
var svlnSclCdVal = "";		// 회선유형값(기지국간, 교환기간, 상호접속간)
var jobIdVal = "";  // 개통 Task ID 값 
var searchTmofCdVal = ""		// 검색한 전송실 코드
var infoMaxnumber = 0;
var selectedJobTitle = "";
//var searchJobId = "";
var reqGrid = "reqGrid";
var jobGrid = "jobGrid";
var jobInstanceId = "";
var tmpJobCmplDt = "";  // 작업완료일 임시 

var fdfUsingInoLineNo = null;  // GIS FDF 정보 전달을 위한 회선번호
var fdfUsingInoPathLineNo = null;  // GIS FDF 정보 전달을 위한 회선번호(선번변경) 

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	fdfUsingInoLineNo = null;
    	
    	$('.arrow_more').click();
    	var sDay = getTodayStr("-");
    	var eDay = getDateAdd(sDay, "-",7);
    	$('#jobReqDtStart').val(sDay);
    	$('#jobReqDtEnd').val(eDay);
    	$('#jobCmplDtStart').val(sDay);
    	$('#jobCmplDtEnd').val(eDay);
    	
    	$('#jobReqDtDis').setEnabled(false);
    	$('#jobCmplDtDis').setEnabled(false);
//    	$('#lineReqDtDis').setEnabled(false);
    	
//    	$('#jobReqDtYn').click();
    	
    	// 버튼 비활성화 처리
    	btnFalseProc();
    	      
    	
    	setSelectCode();
        setEventListener();      
    	initGrid();
    	
    };


    //Grid 초기화
    function initGrid() {
    	
        //그리드 생성
        $('#' + reqGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,  
//        	rowInlineEdit : true, //행전체 편집기능 활성화
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		pager:false,
			height : 340,	
    		contextMenu : [
	    		               {
	    		            	    title: cflineMsgArray['jobDeleteRestore'], /* 작업 삭제/복구 */
	    						    processor: function(data, $cell, grid) {
	    						    	jobDeleteOrRestore();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#' + reqGrid).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	if(selectedData.length == 1 && selectedData[0]._state.selected != false){
	    						    		returnValue = true;
	    						    	}
	    						    	return returnValue;
	    						    }
	    					   },
    		               ],
//    		rowOption:{inlineStyle: function(data,rowOption){
//    					  if(data['delYn'] == 'Y') return {background:'orange'} // background:'orange',  inlineStyle
//		    		  },    		               
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [ { selectorColumn : true, width : '50px' } 
				, {key : 'makeDate'					,title : cflineMsgArray['requestDay'] /*  요청일 */ ,align:'center', width: '80px'}
		        , {key : 'svlnSclCdNm'	            ,title : cflineMsgArray['lineType'] /* 회선유형 */ ,align:'center', width: '80px'}
		        , {key : 'jobTitle'	              	,title : cflineMsgArray['workName'] /*  작업명 */ ,align:'left'  , width: '250px', styleclass : nodeCopyPasteCss}
		        , {key : 'linePerCnt'	        	,title : cflineMsgArray['lineCount'] /* 회선수 */ ,align:'center', width: '80px'}
		        
//		        , {key : 'jobCmplModReqDt'	    	,title : cflineMsgArray['cmplChangeReqDay'] /*  완료변경요청일 */ ,align:'center', width: '120px', editable: true
//						, render : function(value, data) {
//   							if(nullToEmpty(value) == ""){
//   								return (nullToEmpty(data.jobCmplModReqDt) == "") ? "" : data.jobCmplModReqDt;
//   							}else{  
//   								return value;
//   							}
//   						}  			        	  
//   			          }
//		        , {key : 'orglJobCmplModReqDt'	    	,title : cflineMsgArray['cmplChangeReqDay'] /*  완료변경요청일 */ ,align:'center', width: '120px', hidden: true
//					, render : function(value, data) {
//							if(nullToEmpty(value) == ""){
//								return (nullToEmpty(data.orglJobCmplModReqDt) == "") ? "" : data.orglJobCmplModReqDt;
//							}else{  
//								return value;
//							}
//						}  			        	  
//			          }
		        
		        , {key : 'delYn'	    	,title : cflineCommMsgArray['delete'] /* 삭제  */ ,align:'center', width: '120px', hidden: true
					, render : function(value, data) {
							if(nullToEmpty(value) == ""){
								return (nullToEmpty(data.delYn) == "") ? "" : data.delYn;
							}else{  
								return value;
							}
						}  			        	  
			          }
		        , {key : 'jobCmplDt'	            ,title : cflineMsgArray['workFinishDay'] /* 작업완료일 */ ,align:'center', width: '120px', editable: true
					, render : function(value, data) {
					if(nullToEmpty(value) == ""){
						return (nullToEmpty(data.jobCmplDt) == "") ? "" : data.jobCmplDt;
					}else{  
						return value;
					}
				}  			        	  
	          }                                                                                     
			]}); 
    	$('#' + reqGrid).alopexGrid("columnFix", 0);

        //그리드 생성
        $('#' + jobGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false, 
    		pager:false,   		
			height : 340,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [{ selectorColumn : true, width : '50px' } 
			    , {key : 'jobType'	   	,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '80px', hidden: true
					, render : function(value, data) {
						if(nullToEmpty(value) == ""){
							return (nullToEmpty(data.jobType) == "") ? "" : data.jobType;
						}else{  
							return value;
						}
					}  			        	  
		          }
				, {key : 'jobTypeCdNm'	   	,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '80px'
					, render : function(value, data) {
						if(nullToEmpty(value) == ""){
							return (nullToEmpty(data.jobTypeCdNm) == "") ? "" : data.jobTypeCdNm;
						}else{  
							return value;
						}
					}  			        	  
		          }
		        , {key : 'svlnSclCdNm'	              	,title : cflineMsgArray['lineType'] /* 회선유형 */			,align:'center', width: '80px'}
		        , {key : 'jobTitle'	              	,title : cflineMsgArray['workName'] /*  작업명 */                 ,align:'left'  , width: '250px'}
		        , {key : 'jobCompleteCdNm'	        ,title : cflineMsgArray['openTaskJobCmplYn'] /* 작업상황 */			,align:'center', width: '80px'}
		        , {key : 'jobCmplDt'	    		    ,title : cflineMsgArray['openingDay'] /*  개통일 */               	,align:'center', width: '80px'}  
		        , {key : 'ogTransroomName'	    		    ,title : "OG "+cflineMsgArray['transmissionOffice'] /* OG 전송실 */               	,align:'center', width: '100px'}   
		        , {key : 'ogSysName'	    		    ,title : "OG "+cflineMsgArray['systemName'] /* OG 시스템명 */               	,align:'center', width: '100px'}   
		        , {key : 'ogTieOne'	    		    ,title : "OG TIE1" /* OG TIE1 */               	,align:'center', width: '100px'}   
		        , {key : 'ogTieTwoBtsName'	    		    ,title : "OG TIE2("+cflineMsgArray['mtsoNameMid']+")" /* OG TIE2(기지국명) */               	,align:'center', width: '100px'} 
		        , {key : 'icTransroomName'	    		    ,title : "IC "+cflineMsgArray['transmissionOffice'] /* IC 전송실 */               	,align:'center', width: '100px'}   
		        , {key : 'icSysName'	    		    ,title : "IC "+cflineMsgArray['systemName'] /* IC 시스템명 */               	,align:'center', width: '100px'}   
		        , {key : 'icTieOne'	    		    ,title : "IC TIE1" /* IC TIE1 */               	,align:'center', width: '100px'}   
		        , {key : 'icTieTwoBtsName'	    		    ,title : "IC TIE2("+cflineMsgArray['mtsoNameMid']+")" /* IC TIE2(기지국명) */               	,align:'center', width: '100px'}   
		        , {key : 'lineNm'	    		    ,title : cflineMsgArray['lnNm'] /*  회선명 */               	,align:'center', width: '250px'}         
			]}); 
    	$('#' + jobGrid).alopexGrid("columnFix", 0);
        //그리드 생성
        getGrid();
      
    };    
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getbmtsosclcdlist', null, 'GET', 'svlnSclBmtsoCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'tmofCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	var cdParam = {"selGbn":"S"};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', cdParam, 'GET', 'svlnCommCodeData');
    	
    	 // 사용자 소속 전송실
    	searchUserJrdtTmofInfo("tmofCd");
    	
    };
    function setEventListener() {
		// 작업요청일 체크 박스 클릭시 
	    $('#jobReqDtYn').on('click', function(e) {
	    	if($('#jobReqDtYn').getValues()=="Y"){
	    		$('#jobReqDtDis').setEnabled(true);
	    	}else{
	    		$('#jobReqDtDis').setEnabled(false);
	    	};
	   	});
		// 작업완료예정일일 체크 박스 클릭시 
	    $('#jobCmplDtYn').on('click', function(e) {
	    	if($('#jobCmplDtYn').getValues()=="Y"){
	    		$('#jobCmplDtDis').setEnabled(true);
	    	}else{
	    		$('#jobCmplDtDis').setEnabled(false);
	    	};
	   	});
//		// 회선요청일 체크 박스 클릭시 
//	    $('#lineReqDtYn').on('click', function(e) {
//	    	if($('#lineReqDtYn').getValues()=="Y"){
//	    		$('#lineReqDtDis').setEnabled(true);
//	    	}else{
//	    		$('#lineReqDtStart').val("");
//	    		$('#lineReqDtEnd').val("");
//	    		$('#lineReqDtDis').setEnabled(false);
//	    	};
//	   	});

    	//조회 버튼 클릭 
    	$('#btnSearch').on('click', function(e) {
	    	jobIdVal = "";  // 개통 Task ID 값 
	    	fnSearchProc('');
        });
    	// 등록  
    	$('#btnOpenTaskWrite').on('click', function(e) {
    		$a.popup({
    		  	popid: "popOpenTaskWrite",
    		  	title: cflineMsgArray['openTaskReg'] /* 개통 Task 등록 */,
    			url: $('#ctx').val() + "/configmgmt/cfline/OpenTaskWritePop.do",
    			data: null,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 1200,
    			height : 750,
    			callback:function(data){
					if(data != null){
						if(data.Result == "Success"){
				    		callMsgBox('', 'I', cflineMsgArray['saveSuccess'] /* 저장을 완료 하였습니다. */, function() {
				    			$('#btnSearch').click();
				    		}); 
						}else if (data.Result == "Fail") {
							alertBox('I', cflineMsgArray['saveFail'] /* 저장을 실패 하였습니다. */); 
						}else{
							
						}
					}
					// 다른 팝업에 영향을 주지않기 위해
					$.alopex.popup.result = null;
    			}
    		});     		
    		
        });
    	
    	//작업접수 버튼 클릭
     	$('#btnJobAcep').on('click', function(e) {
     		var dataParam = $('#'+jobGrid).alopexGrid("dataGet", { _state : { selected : true }});
     		var dataLen = dataParam.length;   
    		var existCnt = 0; // 회선번호 존재카운트
    		var noneExistCnt = 0;  // 회선번호 미존재카운트
    		var reqSubList = []; 			//회선번호 존재 리스트
    		var noneExistList = [];		//회선번호 미존재 리스트
    		
    		for(i=0; i<dataLen; i++){
    			var dataObj = dataParam[i];
    			if(dataObj.jobType =="3"){
        			if(dataObj.lineNo != "" && dataObj.lineNo != null && dataObj.lineNo != undefined){
        				existCnt++
        				reqSubList.push(dataObj);
        			}else{
        				noneExistCnt++
        				noneExistList.push(dataObj);
        			}    				
    			}else{
    				existCnt++
    				reqSubList.push(dataObj);
    			}
    		}
     		if(noneExistCnt < 1){ // 회선번호가 존재하면 작업접수
				cflineShowProgressBody();
        		var paramDataList = {"svlnSclCd":dataParam[0].svlnSclCd};
        		$.extend(paramDataList,{"jobCompleteCd":"12"});
        		$.extend(paramDataList,{"reqSubList":dataParam});
        		$.extend(paramDataList,{"crcnCmplYn":"N"});
         		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/updatejobrequest', paramDataList, 'POST', 'updatejobrequest');
     		}else{ // 회선번호가 미존재하면 팝업
     			var callData ={
     					"svlnSclCd" : dataParam[0].svlnSclCd
     					, "existCnt" : existCnt
     					, "reqSubList" : reqSubList
     					, "noneExistCnt" : noneExistCnt
     					, "noneExistList" : noneExistList
     			};
     			$a.popup({
        		  	popid: "noneRegisterLine",
        		  	title: cflineMsgArray['noneRegisterLine'],		/* 등록 회선 없음 */
        			url: $('#ctx').val() + "/configmgmt/cfline/OpenTaskJobConFirmPop.do",
        			data: callData,
        			iframe: true,
        			modal: true,
        			movable:false,
        			windowpopup : true,
        			width : 440,
        			height : 230,
        			callback:function(data){
        				if(data.gubun == "F"){
        					alertBox('I', cflineMsgArray['normallyProcessed']); /* 정상적으로 처리되었습니다. */
        					// requestGridClick('T');
        					fnSearchProc('T');  // 
        				}else if(data != null && data.gubun =="S"){
        		    		openLineSearchPop(data);
        				}else if (data == "C"){
        					requestGridClick('T');
        				}
						// 다른 팝업에 영향을 주지 않기 위해
						$.alopex.popup.result = null;
						
        			}
        		});     
     		}
    	});
     	
     	// 작업 목록 엑셀 다운로드   
    	$('#btnJobExportExcel').on('click', function(e) {
    		var date = getCurrDate();
    		var sheetNm = '개통 Task';
    		
    		var worker = new ExcelWorker({
         		excelFileName : sheetNm + '_' + selectedJobTitle + '_' + date,
         		sheetList: [{
         			sheetName: sheetNm,
         			placement: 'vertical',
         			$grid: $('#'+jobGrid)
         		}]
         	});
    		
    		worker.export({
         		merge: false,
         		exportHidden: false,
         		useGridColumnWidth : true,
         		border : true,
         		useCSSParser : true
         	});
    	});
    	
    	//회선찾기 버튼 클릭
    	$('#btnLineLkup').on('click', function(e) {
        	var dataList = $('#' + jobGrid).alopexGrid('dataGet', {_state:{selected:true}});
    		var data = {
    				"lineList":dataList
    				,"gubun":"O"
			};
    		openLineSearchPop(data);
    	});
    	
    	//완료변경요청 버튼 클릭
    	$('#btnCmplModReq').on('click', function(e) {
    		var focusData = $('#' + reqGrid).alopexGrid("dataGet", {_state : {focused : true}});
    		var rowIndex = focusData[0]._index.data;
	    	$('#' + reqGrid).alopexGrid("startEdit", {_index : { row : rowIndex}});
	    	tmpJobCmplDt = nullToEmpty(focusData[0].jobCmplDt);
	    	//console.log("tmpJobCmplDt=============" + tmpJobCmplDt);
	    	$('#btnCmplMod').setEnabled(true);
	    	$('#btnCmplCnsl').setEnabled(true);	    	
    	});
    	
    	//완료일 수정 버튼 클릭
    	$('#btnCmplMod').on('click', function(e) {

			$('#' + reqGrid).alopexGrid('endEdit', {_state:{editing:true}});
    		if( $('#' + reqGrid).length == 0) return;
    		var dataList = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
    		var rowIndex = dataList[0]._index.data;
    		var paramUsing = dataList[0];
//			console.log(paramUsing);
//    		if(nullToEmpty(paramUsing.jobCmplModReqDt) == ""){  // 입력 날짜가 없는 경우
//    	    	$('#' + reqGrid).alopexGrid("startEdit", {_index : { row : rowIndex}});
//    			alertBox('I', makeArgCommonMsg('required', cflineMsgArray['cmplChangeReqDay']/* 완료변경요청일 */)); /* [{0}] 필수 입력 항목입니다. */
//    			return;
//    		}
//    		if(nullToEmpty(paramUsing.jobCmplDt) != "" && nullToEmpty(paramUsing.jobCmplModReqDt) < nullToEmpty(paramUsing.jobCmplDt)){  // 입력 날짜가 없는 경우
//    	    	$('#' + reqGrid).alopexGrid("startEdit", {_index : { row : rowIndex}});
//    			alertBox('I', cflineMsgArray['openTaskCmplDtFail']); /* 완료변경요청일은 작업완료일보다 이후 일자만 가능합니다. */
//    			return;
//    		}

    		if(nullToEmpty(paramUsing.jobCmplDt) == ""){  // 입력 날짜가 없는 경우
    	    	$('#' + reqGrid).alopexGrid("startEdit", {_index : { row : rowIndex}});
    			alertBox('I', makeArgCommonMsg('required', cflineMsgArray['workFinishDay']/* 작업완료일 */)); /* [{0}] 필수 입력 항목입니다. */
    			return;
    		}
	    	//console.log("tmpJobCmplDt=============" + tmpJobCmplDt);
	    	//console.log("paramUsing.jobCmplDt=============" + paramUsing.jobCmplDt);
    		if(nullToEmpty(paramUsing.jobCmplDt) != "" && tmpJobCmplDt > nullToEmpty(paramUsing.jobCmplDt)){  // 변경일자를 앞으로 바꾸는것은 막는다.
    	    	$('#' + reqGrid).alopexGrid("startEdit", {_index : { row : rowIndex}});
    			alertBox('I', cflineMsgArray['openTaskCmplDtFail']); /* 완료변경요청일은 작업완료일보다 이후 일자만 가능합니다. */
    			return;
    		}    		
    		
    		$.extend(paramUsing,{modDiv: "C" });// 작업완료일 변경 구분 값 
    		//console.log(paramUsing);
			callMsgBox('btnCmplMod', 'C', cflineMsgArray['save'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					$('#btnCmplMod').setEnabled(false);
			    	$('#btnCmplCnsl').setEnabled(false);	 
			    	$('#btnCmplModReq').setEnabled(false);	
					cflineShowProgressBody();
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/updatecmpldatereq', paramUsing, 'POST', 'updatecmpldatereq');
				}else{
			    	$('#' + reqGrid).alopexGrid("startEdit", {_index : { row : rowIndex}});
				}
			});	
    		
	    	
    	});
    	
    	//완료일 취소 버튼 클릭
    	$('#btnCmplCnsl').on('click', function(e) {
        	$('#' + reqGrid).alopexGrid('endEdit', {_state:{editing:true}});
    		var focusData = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
    		var rowData = focusData[0];
    		var rowIndex = rowData._index.data;
    		
//			$('#' + reqGrid).alopexGrid( "cellEdit", rowData.orglJobCmplModReqDt, {_index : { row : rowIndex}}, "jobCmplModReqDt");
			$('#' + reqGrid).alopexGrid( "cellEdit", tmpJobCmplDt, {_index : { row : rowIndex}}, "jobCmplDt");
    		
	    	$('#btnCmplMod').setEnabled(false);
	    	$('#btnCmplCnsl').setEnabled(false);	    	
    	});
    	
    	//완료일 변경 요청 취소 버튼 클릭
    	$('#btnCmplModReqCnsl').on('click', function(e) {
    		
    		if( $('#' + reqGrid).length == 0) return;
    		var dataList = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
    		var rowIndex = dataList[0]._index.data;
    		var paramUsing = dataList[0];
//			console.log(paramUsing);
    		if(nullToEmpty(paramUsing.jobCmplModReqDt) == ""){  // 완료변경요청일 없는 경우
    			alertBox('I', cflineMsgArray['invalidParamValue']);  /* 잘못 전달된 값입니다. */
    			return;
    		}else{
//	    		console.log(paramUsing);
				callMsgBox('btnCmplModReqCnsl', 'C', cflineMsgArray['save'], function(msgId, msgRst){
					if (msgRst == 'Y') {
						$('#' + reqGrid).alopexGrid('endEdit', {_state:{editing:true}});
						cflineShowProgressBody();
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/updatecmpldatereqcnsl', paramUsing, 'POST', 'updatecmpldatereqcnsl');
					}
				});	
    		}	    	
	    	
    	});
		
		
	    
    	//요청목록 그리드 클릭시
    	$('#' + reqGrid).on('click', '.selector-checkbox', function(e){
    		requestGridClick('F');
    	});	     

    	//작업 목록 그리드(우측그리드) 클릭시
//    	$('#' + jobGrid).on('click', '.selector-checkbox', function(e){
    	$('#'+jobGrid).on('click', function(e) {

        	var dataList = $('#' + jobGrid).alopexGrid('dataGet', {_state:{selected:true}});

        	$('#btnJobAcep').setEnabled(false);  
        	$('#btnLineLkup').setEnabled(false);  
        	if (dataList == null) {
        		return false;
        	}
    		var dataLen = dataList.length;   
//    	 	console.log("dataLen = " + dataLen);
    		if( dataLen == 0) {
    			return;
    		}
    		var mCnt = 0;  // 감설 카운트
    		var rCnt = 0; // 작업접수 카운트
    		var jCnt = 0;  // 작업접수, 미진행 카운트
    		for(i=0; i<dataLen; i++){
    			var dataObj = dataList[i];
    			if(dataObj.jobType == "3"){
    				mCnt++;
    			}
    			if(dataObj.jobCompleteCd == "12"){
    				rCnt++;
    			}
    			if(dataObj.jobCompleteCd == "0" || dataObj.jobCompleteCd == "12"){  // 작업상황 미진행, 작업접수 인 경우
    				jCnt++;
    			}
    		}

//    	 	console.log("mCnt = " + mCnt);
//    	 	console.log("jCnt = " + jCnt);
    		
    		if(jCnt == dataLen && rCnt <= 0){ // 이미 작업접수 된건이 포함되면 작업접수 버튼이 활성화 되면안됨.
    	    	$('#btnJobAcep').setEnabled(true);
    		}else{
    	    	$('#btnJobAcep').setEnabled(false);  			
    		}
    		if(jCnt == dataLen && mCnt == dataLen){
    	    	$('#btnLineLkup').setEnabled(true);    			
    		}else{
    	    	$('#btnLineLkup').setEnabled(false);    			
    		}   		
    	});	

		// 요청목록 그리드 클릭시
		$('#' + reqGrid).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var selectedId = $('#' + reqGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	
        	if (data == null) {
        		return false;
        	}
//        	console.log(data);
//        	console.log("data._state.editing===========" + data._state.editing);
        	// 완료일 변경 요청일자 
        	if (object.mapping.key == "jobCmplModReqDt" && data._state.editing!=false) {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(reqGrid, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	// 작업 완료자 
        	if (object.mapping.key == "jobCmplDt" && data._state.editing!=false) {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(reqGrid, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        });            	
    	
    	// 회선 목록 그리드 클릭
    	$('#'+gridLineId).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var dataList = $('#' + gridLineId).alopexGrid('dataGet', {_state:{selected:true}});
        	if (data == null) {
        		return;
        	}        	
        	//console.log(data.jobType);
        	if(nullToEmpty(data.jobType) != "3"){
	        	var keyValue = object.mapping.key;
	        	// 회선요청일자
	        	if (keyValue == "jobRequestDt") {
	        		if ( data._state.focused) {
	        			datePicker(gridLineId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
	        			return;
	        		}
	        	}
	        	// 회선개통일자
	        	if (keyValue == "lineOpenDt") {
	        		if ( data._state.focused) {
	        			datePicker(gridLineId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
	        			return;
	        		}
	        	}
	        	// 회선해지일자
	        	if (keyValue == "lineTrmnSchdDt") {
	        		if ( data._state.focused) {
	        			datePicker(gridLineId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
	        			return;
	        		}
	        	}
	        	// 청약일자
	        	if (keyValue == "appltDt") {
	        		if ( data._state.focused) {
	        			datePicker(gridLineId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
	        			return;
	        		}
	        	}

	        }

	        	// 회선해지예정일자
	        	if (object.mapping.key == "lineTrmnSchdDt") {
	        		if ( data._state.focused) {
	        			var keyValue = object.mapping.key;
	        			datePicker(gridLineId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
	        		}
	        	}
        	

        	if (dataList == null) {
        		jobLineGridBtnProc("LC");
        		return;
        	}
    		var dataLen = dataList.length;   
    		if( dataLen == 0) {
        		jobLineGridBtnProc("LC");
    			return;
    		}
    		
    		var minusSel = 0;
    		for(k=0; k<dataLen; k++){
    			if(dataList[k].jobType=="3"){  // 감설인경우
    				minusSel++;
    			}
    		}
    		if(minusSel==0){
    			jobLineGridBtnProc("LV");// 모든 버튼 활성화
    		}else{  // 감설이 선택 된경우 일부버튼 비활성화
    			jobLineGridBtnProc("LM");// 모든 버튼 활성화
    		}
    	});	 	
	    
    	// 연관회선정보팝업  
    	$('#btnReltLineInf').on('click', function(e) {
        	var dataList = $('#' + gridLineId).alopexGrid('dataGet', {_state:{selected:true}});

        	if (dataList == null) {
        		jobLineGridBtnProc("LC");
        		return false;
        	}
    		var dataLen = dataList.length;   
    		if( dataLen == 0) {
        		jobLineGridBtnProc("LC");
    			return;
    		} 	
    		if( dataLen > 1 ) {
    			alertBox('I', cflineMsgArray['selectOnlyOneItem']);  /* 여러개가 선택되었습니다. 하나만 선택하세요. */
    			return;
    		} 	
//    		console.log(dataList[0]);
    		var reltParam = null;
    		if(dataList[0].svlnSclCd == "001" || dataList[0].svlnSclCd == "003"){ // 교환기간, 상호접속간 
    			reltParam = {"svlnSclCd":dataList[0].svlnSclCd, "lowSystmNm":dataList[0].lowSystmNm, "uprSystmNm":dataList[0].uprSystmNm};
    		}else{// 기지국간
    			reltParam = {"svlnSclCd":"002", "lowSystmNm":dataList[0].lowSystmNm};
    		}
//    		console.log(reltParam);
//    		return;
    		$a.popup({
    		  	popid: "popOpenTaskReltLine",
    		  	title: cflineMsgArray['relationLineInfo'] /* 연관회선정보 */,
    			url: $('#ctx').val() + "/configmgmt/cfline/OpenTaskReltLinePop.do",
    			data: reltParam,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 620,
    			height : 630,
    			callback:function(data){
					if(data != null){
					}

    			}
    		});     		
    		
        }); 
    	
    	// 다회선 적용 정보 입력
    	$('#btnMlInfIns').on('click', function(e) {
        	var dataList = $('#' + gridLineId).alopexGrid('dataGet', {_state:{selected:true}});

        	if (dataList == null) {
        		jobLineGridBtnProc("LC");
        		return false;
        	}
    		var dataLen = dataList.length;   
    		if( dataLen == 0) {
        		jobLineGridBtnProc("LC");
    			return;
    		} 	


    		var paramList = [];		//회선번호 미존재 리스트
    		
    		for(i=0; i<dataLen; i++){
    			var dataObj = dataList[i];
    			paramList.push({"svlnSclCd":dataObj.svlnSclCd});
    		}

    		var paramData = {"dataList":paramList};
//    		console.log(paramList);
//    		return;
    		$a.popup({
    		  	popid: "popOpenTaskMultiLineIn",
    		  	title: cflineMsgArray['multiLineInfoReg'] /* 다회선 정보 입력 */,
    			url: $('#ctx').val() + "/configmgmt/cfline/OpenTaskMultiLineInPop.do",
    			data: paramData,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 1200,
    			height : 500,
    			callback:function(data){
					if(data != null){
						if(typeof data.jobRequestDt != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{jobRequestDt:data.jobRequestDt},{_state:{selected:true}});
						}
						if(typeof data.lineUsePerdTypCd != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineUsePerdTypCd:data.lineUsePerdTypCd},{_state:{selected:true}});
						}
						if(typeof data.svlnTypCd != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{svlnTypCd:data.svlnTypCd},{_state:{selected:true}});
						}
						if(typeof data.lineCapaCd != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineCapaCd:data.lineCapaCd},{_state:{selected:true}});
						}
						if(typeof data.faltMgmtObjYn != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{faltMgmtObjYn:data.faltMgmtObjYn},{_state:{selected:true}});
						}
						if(typeof data.lineOpenDt != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineOpenDt:data.lineOpenDt},{_state:{selected:true}});
						}
						if(typeof data.lineTrmnSchdDt != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineTrmnSchdDt:data.lineTrmnSchdDt},{_state:{selected:true}});
						}
						if(typeof data.appltDt != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{appltDt:data.appltDt},{_state:{selected:true}});
						}
						if(typeof data.lineDistTypCd != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineDistTypCd:data.lineDistTypCd},{_state:{selected:true}});
						}
						if(typeof data.lineSctnTypCd != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineSctnTypCd:data.lineSctnTypCd},{_state:{selected:true}});
						}
						if(typeof data.chrStatCd != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{chrStatCd:data.chrStatCd},{_state:{selected:true}});
						}
						if(typeof data.lineMgmtGrCd != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineMgmtGrCd:data.lineMgmtGrCd},{_state:{selected:true}});
						}
						if(typeof data.lineRmkOne != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineRmkOne:data.lineRmkOne},{_state:{selected:true}});
						}
						if(typeof data.lineRmkTwo != 'undefined'){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineRmkTwo:data.lineRmkTwo},{_state:{selected:true}});
						}
						if(typeof data.lineRmkThree != 'undefined' ){
							$('#' + gridLineId).alopexGrid('dataEdit',{lineRmkThree:data.lineRmkThree},{_state:{selected:true}});							
						}
					}
    			}
    		});     
	   	}); 	
    	// 엑셀 다운로드 
	    $('#btnExportExcel').on('click', function(e) {
	 		funExcelBatchExecute();
	   	});  	
    	
    	// 회선 엑셀 업로드  
	    $('#btnExcelUlad').on('click', function(e) {
        	 $a.popup({
               	popid: 'OpenTaskLineExcelUplaodPop',
               	title: cflineMsgArray['svlnExcelUpload'], /*'서비스회선 엑셀업로드'*/
               	iframe: true,
               	modal : false,
               	windowpopup : true,
                   url: $('#ctx').val() +'/configmgmt/cfline/OpenTaskLineExcelUploadPop.do',
                   data: null, 
                   width : 800,
                   height : 400 //window.innerHeight * 0.5,
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
    	
		// 작업정보저장
	    $('#btnJobInfSave').on('click', function(e) {
	    	workUpdate('');
	   	}); 	
	    // TASK 완료
	    $('#btnTaskFnsh').on('click', function(e) {
			$('#'+gridLineId).alopexGrid('endEdit', {_state:{editing:true}});
			if( $('#'+gridLineId).length == 0) return;
			var dataList = $('#'+gridLineId).alopexGrid('dataGet', {_state: {selected:true}});
			if (dataList.length <= 0 ){
				 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
				 $("#"+gridLineId).alopexGrid("startEdit");
				 return;
			 }
			if(validationCheck(dataList)){  // 필수 항목 체크
//		    	workUpdate('F');
				var paramUsing = null;
				var paramList = [];
				for(i=0;i<dataList.length;i++){
					paramList[i] = dataList[i];
				}
				//console.log(paramList);
				cflineShowProgressBody();
				paramUsing = {"serviceLineList":paramList};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/saveopentaskcomplete', paramUsing, 'POST', 'saveTaskComplete');				
			}
	   	}); 	
		
		// 전송실 등록
		$('#btnDupMtsoMgmt').on('click', function(e) {
			var element =  $('#'+gridLineId).alopexGrid('dataGet', {_state: {selected:true}});
			var selectCnt = element.length;
			
			if(selectCnt <= 0){
    			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
			}else{
				if(validationCheck(element)){  // 필수 항목 체크
					var paramMtso = null;
					var paramList = [element.length];
					var mgmtGrpStr = "";
					var mgmtGrpChk = "N";
					workUpdate('M');// 작업정보저장
					if(selectCnt==1){
						paramMtso = {"multiYn":"N", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "svlnNo":element[0].svlnNo};
					}else{
						for(i=0;i<element.length;i++){
							paramList[i] = element[i].svlnNo;
							//paramList[i] = {"svlnNoArr":element[i].svlnNo};
							//paramList.push({"svlnNoArr":element[i].svlnNo};
							if(i==0){
								mgmtGrpStr = element[0].mgmtGrpCd;
							}
							if(i>0 && mgmtGrpStr != element[i].mgmtGrpCd){
								mgmtGrpChk = "Y";
							}
							
						}
						if(mgmtGrpChk == "Y"){
							//alert("여러 회선에 대한 전송실 등록시는 동일 관리그룹만 가능합니다.");						
							alertBox('W', cflineMsgArray['multiMtsoRegSameMngrGrpPoss']);/*여러 회선에 대한 전송실 등록시 동일 관리그룹만 가능합니다.*/
							return;
						}
						
						paramMtso = {"multiYn":"Y", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "svlnNoArr":paramList};
					}
	
	//				console.log("btnDupMtsoMgmt S" );
	//	    		console.log(paramMtso);
	//	    		console.log("btnDupMtsoMgmt E" );
					srvcPopup2( "svlnMtsoUpdatePop", "/configmgmt/cfline/ServiceLineMtsoUpdatePop.do", paramMtso, 1200, -1, cflineMsgArray['serviceLine']/*서비스회선*/ +" "+ cflineMsgArray['mtsoEstablish']/*서비스회선전송실설정*/);
				}	    		
			}
		});	    
		

	   	
    	// 작업정보 그리드 더블클릭
		$('#'+gridLineId).on('dblclick', '.bodycell', function(e){

			var dataObj = AlopexGrid.parseEvent(e).data;
    	 	var dataKey = dataObj._key;
//			console.log("dataObj.jobType============" + dataObj.jobType);
	 		// 상세정보팝업
			if ((dataKey == "rnmEqpIdNm" || dataKey == "rnmPortIdNm" || dataKey == "rnmPortChnlVal")
					&& nullToEmpty(dataObj.jobType) != "3" ) {  // RM장비찾기, RM포트찾기 팝업
				openRmEqpPortPop(gridLineId, e);
    	 	}else{
    	 		showServiceLIneInfoPop( gridLineId, dataObj ,"Y");
    	 	}
		});		
		
		// 그리드 엔터시 
		$('#'+gridLineId).on('keydown', function(e){
     		if (e.which == 13  ){
    			var dataObj = AlopexGrid.parseEvent(e).data;
        	 	var dataKey = dataObj._key;
    	 		// 상세정보팝업
    			if ((dataKey == "rnmEqpIdNm" || dataKey == "rnmPortIdNm" || dataKey == "rnmPortChnlVal")
    					&& nullToEmpty(dataObj.jobType) != "3" ) {  // RM장비찾기, RM포트찾기 팝업
    				openRmEqpPortPop(gridLineId, e);
        	 	}
    		}
     	});	 
	};	
	// 조회 함수 
	function fnSearchProc(gubun){
    	var param =  $("#searchForm").getData(); 
    	// 작업요청일 체크 박스에 체크가 아닌경우 빈값 세팅
    	if($('#jobReqDtYn').getValues() != "Y"){
	 		$.extend(param,{jobReqDtStart: "" });
	 		$.extend(param,{jobReqDtEnd: "" });
    	};
    	// 완료예정일 체크 박스에 체크가 아닌경우 빈값 세팅
    	if($('#jobCmplDtYn').getValues() != "Y"){
	 		$.extend(param,{jobCmplDtStart: "" });
	 		$.extend(param,{jobCmplDtEnd: "" });
    	};

    	if($('#delInclYn').getValues() == "Y"){
	 		$.extend(param,{delInclYn: "Y" });
    	}else{
	 		$.extend(param,{delInclYn: "" });
    	};	    	

    	// 버튼 비활성화 처리
    	btnFalseProc();
    	tmpJobCmplDt = "";
//    	console.log(param);
    	reSetGrid();
		cflineShowProgressBody();		
		searchTmofCdVal = $('#tmofCd').val();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentaskreqlist', param, 'GET', 'search');
		
	}

	// RM 장비 포트 찾기 팝업 호출, RM 선번에 전달 함수   
	function openRmEqpPortPop(gridVal, e){
		var dataObj = AlopexGrid.parseEvent(e).data;
	 	var dataKey = dataObj._key;
	 	if (dataKey == "rnmEqpIdNm") {  // RM장비찾기 팝업
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
//    	 	console.log(dataObj);
	 		var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
	 		var param = {"neNm" : tmpRmEqpIdNm};
	 		openRmEqpPop(gridVal, "rnmEqpId", "rnmEqpIdNm", "rnmPortId", "rnmPortIdNm", param);
	 	} else if (dataKey == "rnmPortIdNm") {  // RM포트찾기 팝업
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
	 		var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	 		var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
	 		var searchPortNm = nullToEmpty(dataObj.rnmPortIdNm);
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == "" || tmpRmEqpId == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
	   		if(searchPortNm == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmPortNm'],"","","")); /*" RM포트명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
	 		$("#"+gridVal).alopexGrid("startEdit");
	 		openRmPortPop(gridVal, "rnmPortId", "rnmPortIdNm", tmpRmEqpId, searchPortNm)
	 	} else if (dataKey == "rnmPortChnlVal") {  // RM 채널 
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
	 		var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	 		var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
	 		var tmpPortNm = nullToEmpty(dataObj.rnmPortIdNm);
	 		var tmpPortId = nullToEmpty(dataObj.rnmPortId);
	 		var tmpPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
//	 		console.log(dataObj);
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == "" || tmpRmEqpId == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
	   		if(tmpPortNm == "" || tmpPortId == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmPortNm'],"","","")); /*" RM포트명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
//	   		if(tmpPortChnlVal == ""){
//				alertBox('W', makeArgMsg('required',cflineMsgArray['rmChannelName'],"","","")); /*" RM채널명은필수 입력 항목입니다.;*/  
//	 			return false;
//	 		}    	
	   		showServiceLIneInfoPop( gridVal, dataObj, "Y");
	 	}
	}	
	
	// 전송실 등록 팝업 창
	function srvcPopup2( popId, url, paramData, widthVal, heightVal, titleStr){
		var heightValue = window.innerHeight * 0.9;
		if(heightVal != null && heightVal>0){
			heightValue = heightVal;
		}
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: $('#ctx').val() + url,
			data: paramData,
		    //iframe: false,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				if(popId == "svlnMtsoUpdatePop"){
					if(data != null){
			    		if(data == "Success"){
			    			callMsgBox('', 'I', cflineMsgArray['saveSuccess'], function() { /* 저장을 완료 하였습니다.*/
			    				requestGridClick('T');
			    			});
 			    			
			    		} else if (data == "Fail") {
			    			alertBox('W', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			    		}			    		
			    		else{
			    			
			    		}
					}
				}

				// 다른 팝업에 영향을 주지않기 위해
				//$.alopex.popup.result = null;
			}
		});
	}
	//작업정보저장
	function workUpdate(gubun){
		$('#'+gridLineId).alopexGrid('endEdit', {_state:{editing:true}});
		if( $('#'+gridLineId).length == 0) return;
		var dataList = $('#'+gridLineId).alopexGrid('dataGet', {_state: {selected:true}});
		if (dataList.length <= 0 ){
			 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
			 $("#"+gridLineId).alopexGrid("startEdit");
			 return;
		}
//		console.log("gubun = " + gubun);
		if(nullToEmpty(gubun) == '' && validationCheck(dataList)){  // 필수 항목 체크
			var paramUsing = null;
			var paramList = [];

	    	// FDF 사용정보 
	    	fdfUsingInoLineNo = "";
	    	
			for(i=0;i<dataList.length;i++){
				// FDF 사용정보 
		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].svlnNo + ",";
				paramList[i] = dataList[i];
			}
			if(nullToEmpty(gubun) == ''){  //  순수 작업정보 저장 인 경우에만 
				cflineShowProgressBody();
			}
			paramUsing = {"serviceLineList":paramList, "procDivCd" : gubun};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/updateserviceline', paramUsing, 'POST', 'workUpdateProc');
		}
	}   


    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };	
	function successCallback(response, status, jqxhr, flag){
    	// 조회시 
    	if(flag == 'search'){
    		cflineHideProgressBody();
//    		console.log(response);
    		$('#' + reqGrid).alopexGrid("dataSet", response.reqList);
    		if(response.reqList != null){
    			$('#totalCountSpan').text(response.reqList.length);
    		}else{
    			$('#totalCountSpan').text(0);
    		}
    		if(nullToEmpty(jobIdVal) != ""){

//    	    	$('#' + reqGrid).alopexGrid("endEdit");
    			var tmpData = $('#' + reqGrid).alopexGrid("dataGet");
    			if(tmpData != null && tmpData.length > 0){
					for(i=0;i<tmpData.length;i++){
						var dataMap = tmpData[i];
						if(dataMap.jobId == jobIdVal){
//							console.log(dataMap);
							$('#' + reqGrid).alopexGrid('rowSelect', {_index: {row:i}}, true);
							$('#' + reqGrid).alopexGrid('setScroll', {row:i});
//							$('#' + reqGrid).alopexGrid("focusCell", {_index : {data : i}}, 0 );  //selectorColumn
							requestGridClick('G');
							break;
						}
					}
    				
    			}
    		}
//    		console.log("page End : " + getLocalTimeString());		
    	}
    	// 작업, 회선 목록 조회  jobReqList lineList 
    	if(flag == 'jobLineSearch'){
    		cflineHideProgressBody();
//    		console.log(response);
    		getGrid(svlnSclCdVal,response);
    		$('#' + jobGrid).alopexGrid("dataSet", response.jobList);
    		$('#'+gridLineId).alopexGrid("dataSet", response.lineList);
    		$("#"+gridLineId).alopexGrid("startEdit");

    		if(response.jobList != null && response.jobList.length > 0){
    			$('#btnJobExportExcel').setEnabled(true);
    		}else{
    			$('#btnJobExportExcel').setEnabled(false);
    		}
    		if(response.lineList != null && response.lineList.length > 0){
    			$('#btnExportExcel').setEnabled(true);
    		}else{
    			$('#btnExportExcel').setEnabled(false);
    		}	
    	} 
    	// 전송실
    	if(flag == 'tmofCodeData'){
			$('#tmofCd').clear();
			$('#tmofCd').setData({data : response.tmofCdList});
//			console.log("1111111111");	
//    		console.log(response.tmofCdList);		
    	} 
    	// 코드데이터
    	if(flag == 'svlnSclBmtsoCodeData'){
    		var option_data =  [];
			var dataFst = {"value":"","text":cflineCommMsgArray['all']};
			option_data.push(dataFst);
    		if(response.sclCdList != null){
	    		for(k=0; k<response.sclCdList.length; k++){
	    			var dataScl = response.sclCdList[k]; 
	    			option_data.push(dataScl);
	    		}
    		}
			$('#svlnSclCd').clear();
			$('#svlnSclCd').setData({data : option_data});
//			console.log("1111111111");	
//    		console.log(response.tmofCdList);		
    	} 
		// 서비스 회선에서 사용하는 코드
		if(flag == 'svlnCommCodeData') {
			svlnCommCodeData = response;
			var tmpCmCodeData =  JSON.parse(JSON.stringify(response));

			var dataFst = {"value":"","text":cflineCommMsgArray['select']};
//			var dataMandatory = {"value":"","text":cflineCommMsgArray['mandatory']};
			var option_data =  [];
			option_data = tmpCmCodeData.svlnStatCdList;
			option_data.unshift(dataFst);

//			cmCodeData = {"svlnStatCdList":option_data};  // 서비스회선상태
			$.extend(cmCodeData,{"svlnStatCdList":option_data});		 // 서비스회선상태
			option_data =  [];
			option_data = tmpCmCodeData.lineUsePerdTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineUsePerdTypCdList":option_data});		 // 회선사용기간유형	
			option_data =  [];
			option_data = tmpCmCodeData.svlnCapaCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"svlnCapaCdList":option_data});		 // 회선용량	
			option_data =  [];
			option_data = tmpCmCodeData.ynList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"ynList":option_data});		 // 예,아니오
			option_data =  [];
			option_data = tmpCmCodeData.lineDistTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineDistTypCdList":option_data});		 // 회선거리유형
			option_data =  [];
			option_data = tmpCmCodeData.lineSctnTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineSctnTypCdList":option_data});		 // 회선구간유형
			option_data =  [];
			option_data = tmpCmCodeData.chrStatCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"chrStatCdList":option_data});		 // 과금상태
			option_data =  [];
			option_data = tmpCmCodeData.lineMgmtGrCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineMgmtGrCdList":option_data});		 // 회선관리등급
			option_data =  [];
			option_data = tmpCmCodeData.ogicCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"ogicCdList":option_data});		 // OG/IC

//			console.log(cmCodeData);
//			console.log(svlnCommCodeData);
		} 
    	
		// 서비스 회선에서 사용하는 대분류, 소분류, 회선유형 코드
		if(flag == 'svlnLclSclCodeData') {	
			// 서비스회선유형코드 셋팅
//			console.log(response.svlnTypCdListCombo);
			var dataFst = {"value":"","text":cflineCommMsgArray['select']};
			svlnTypCdListCombo = response.svlnTypCdListCombo;
//			console.log("fff====");
//			console.log(svlnTypCdListCombo);
			for(i=0; i<response.svlnSclCdList.length; i++){
				var tmpSvlnSclCd = response.svlnSclCdList[i].value;
				var option_data =  [];
				option_data = svlnTypCdListCombo[tmpSvlnSclCd];
				option_data.unshift(dataFst);	
//				var data = { tmpSvlnSclCd  : option_data};

				eval("$.extend(svlnTypCombo,{'" + tmpSvlnSclCd + "' : option_data})");		 // 회선용량	
//				$.extend(svlnTypCombo,{tmpSvlnSclCd : option_data});
//				svlnTypCombo.push(eval(tmpSvlnSclCd + ":" + option_data));
//				$.extend(svlnTypCombo,{option_data});		 // 회선용량	
			}
//			console.log(svlnTypCombo);
			
//			
		} 
    	// 완료일 수정
    	if(flag == 'updatecmpldatereq'){
    		cflineHideProgressBody();
			if (response.Result == "Success" && response.cnt > 0) {

	    		var focusData = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
	    		var rowIndex = focusData[0]._index.data;
	    		
				$('#' + reqGrid).alopexGrid( "cellEdit", response.openTaskVO.jobCmplModReqDt, {_index : { row : rowIndex}}, "orglJobCmplModReqDt");				
				alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다. */
				$('#btnCmplModReqCnsl').setEnabled(true);
			} else {
				$('#btnCmplModReq').setEnabled(true);
				$('#btnCmplModReq').click();
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			}
    		
    	}
    	// 완료일 변경 요청 취소
    	if(flag == 'updatecmpldatereqcnsl'){
    		cflineHideProgressBody();
			if (response.Result == "Success" && response.cnt > 0) {

	    		var focusData = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
	    		var rowIndex = focusData[0]._index.data;
	    		
				$('#' + reqGrid).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "jobCmplModReqDt");
				$('#' + reqGrid).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "orglJobCmplModReqDt");		

		    	$('#btnCmplModReq').setEnabled(true);
		    	$('#btnCmplModReqCnsl').setEnabled(false);
		    	$('#btnCmplMod').setEnabled(false);
		    	$('#btnCmplCnsl').setEnabled(false);				
				alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다. */
			} else {
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			}
    		
    	}
    	// 작업 삭제 
    	if(flag == 'updatejobdelete'){
    		cflineHideProgressBody();
			if (response.Result == "Success" && response.cnt > 0) {

	    		var focusData = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
	    		var rowIndex = focusData[0]._index.data;
	    		
				$('#' + reqGrid).alopexGrid( "cellEdit", "Y", {_index : { row : rowIndex}}, "delYn");
				$('#' + reqGrid).alopexGrid('startEdit', {_state:{selected:true}});   
				$('#' + reqGrid).alopexGrid('endEdit', {_state:{selected:true}});  	
			
				alertBox('I', cflineMsgArray['normallyProcessed']); /* 정상적으로 처리되었습니다. */
			} else {
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			}
    	}
    	// 작업 복구 
    	if(flag == 'updatejobrestore'){
    		cflineHideProgressBody();
			if (response.Result == "Success" && response.cnt > 0) {

	    		var focusData = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
	    		var rowIndex = focusData[0]._index.data;
				$('#' + reqGrid).alopexGrid( "cellEdit", "N", {_index : { row : rowIndex}}, "delYn");	
				$('#' + reqGrid).alopexGrid('startEdit', {_state:{selected:true}});   
				$('#' + reqGrid).alopexGrid('endEdit', {_state:{selected:true}});  	
				alertBox('I', cflineMsgArray['normallyProcessed']); /* 정상적으로 처리되었습니다. */
				requestGridClick('T');
			} else {
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
		    	$("#"+gridLineId).alopexGrid("startEdit");
			}
    	}

    	//작업정보저장 
    	if(flag == 'workUpdateProc' ){
    		if(nullToEmpty(response.procDivCd)==""){ // 순수 작업정보 저장 인 경우에만 메시지 처리
        		cflineHideProgressBody();
	    		if (response.Result == "Success") {

					// FDF사용정보 전송
					sendFdfUseInfo("B");
	    			callMsgBox('', 'I', makeArgMsg('processed', response.upCount ,"","",""), function() { /* ({0})건 처리 되었습니다. */
	//    		    	$("#"+gridLineId).alopexGrid("startEdit");
	    				requestGridClick('T');
	    			});
	    		} else {
	    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			    	$("#"+gridLineId).alopexGrid("startEdit");
	//    			requestGridClick('T');
	    		}
    		}
    	}    	
    	
    	//작업접수
    	if(flag == 'updatejobrequest'){
    		cflineHideProgressBody();
    		if (response.Result == "Success") {
    			var noLineCnt = 0;
//    			console.log(response.reqList.length);
    			for(var i=0; i<response.reqList.length; i++){
    				if(response.reqList[i].lineNo =="-1"){
    					noLineCnt++;
    				}
    			}
//    			console.log("noLineCnt >>>> " + noLineCnt);
    			if(response.sCnt ==  noLineCnt){	// 관리자 문의건(회선번호가 맞지 않는 경우)을 작업접수한 건수와 작업 접수한 전체건수가 같을경우
    				alertBox('I', cflineMsgArray['notExistLine']);  /* 등록된 회선이 없습니다. */
    				requestGridClick('T');
    			}else{

    				fdfUsingInoLineNo = "";
//					console.log("response.fdfSvlnNoStr ============ " + response.fdfSvlnNoStr);
    				if(nullToEmpty(response.fdfSvlnNoStr) != ""){
    					fdfUsingInoLineNo = nullToEmpty(response.fdfSvlnNoStr);
    					sendFdfUseInfo("B");
    				}

    				fdfUsingInoPathLineNo = "";
//					console.log("response.fdfPathSvlnNoStr ============ " + response.fdfPathSvlnNoStr);
    				if(nullToEmpty(response.fdfPathSvlnNoStr) != ""){
    					fdfUsingInoPathLineNo = nullToEmpty(response.fdfPathSvlnNoStr);
    					sendFdfUseInfo("E");
    				}
        			callMsgBox('', 'I', makeArgMsg('processed', response.sCnt ,"","",""), function() { /* ({0})건 처리 되었습니다. */
        				requestGridClick('T');
        			});
    			}
    		} else {
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		}
    	}
    	//TASK 완료 
    	if(flag == 'saveTaskComplete'){
    		cflineHideProgressBody();
    		if (response.Result == "Success") {
				fdfUsingInoLineNo = "";
//				console.log("saveTaskComplete ============ ");
//				console.log(response);
//				console.log("response.fdfSvlnNoStr ============ " + response.fdfSvlnNoStr);
				if(nullToEmpty(response.fdfSvlnNoStr) != ""){
					fdfUsingInoLineNo = nullToEmpty(response.fdfSvlnNoStr);
					sendFdfUseInfo("B");
				}
				// 해지 회선 선번
				if(nullToEmpty(response.fdfTrmntSvlnNoStr) != ""){
					var fdfTrmntSvlnNo = nullToEmpty(response.fdfTrmntSvlnNoStr);
					/* 2018-08-13 해지된 회선 중 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
					var acceptParam = {
							 lineNoStr : fdfTrmntSvlnNo
						   , topoLclCd : ""
						   , linePathYn : "Y"
						   , editType : "C"   // 해지
						   , excelDataYn : "N"
					}
					extractAcceptNtwkLine(acceptParam);
				}				
				
				alertBox('I', cflineMsgArray['normallyProcessed']); /* 정상적으로 처리되었습니다. */
//				requestGridClick('T');
				fnSearchProc('T');  // TASK 완료 후 조회 함수 호출
    		}else if (response.Result == "Error") {
//              map.put("errGb", reMap.get("errGb"));  
//              map.put("nameList", reMap.get("nameList"));  
//              map.put("pathList", reMap.get("pathList"));       
//              map.put("Result", result);
	  			if(response.errGb == "PATH") { // 선번 
	  				if(response.pathList != null && response.pathList.length > 0){
	  		    		var paramPathData = {"pathList":response.pathList,"selectedJobTitle":selectedJobTitle};
//	  		    		console.log(paramPathData);
	  		    		$a.popup({
	  		    		  	popid: "popOpenTaskCmplPathError",
	  		    		  	title: cflineMsgArray['lnoErrorLine'] /* 선번 오류 회선 */,
	  		    			url: $('#ctx').val() + "/configmgmt/cfline/OpenTaskCmplPathErrorPop.do",
	  		    			data: paramPathData,
	  		    			iframe: true,
	  		    			modal: false,
	  		    			movable:true,
	  		    			windowpopup : true,
	  		    			width : 1000,
	  		    			height : 500,
	  		    			callback:function(data){
	  							if(data != null){
	  							}
	  		    			}
	  		    		});  	  					
	  				}else{
		  				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
	  				}
	  				$("#"+gridLineId).alopexGrid("startEdit");
	  			}else if(response.errGb == "LINE") {
	  				var resultLineNm = "";
	  				if(response.nameList != null && response.nameList.length > 0){
	  					for(var i=0; i<response.nameList.length; i++){
	  							resultLineNm = resultLineNm + "<br>" + response.nameList[i].lineNm
	  					}
	  				}
	  				alertBox('I', cflineMsgArray['duplLineNmInLineNm'] + resultLineNm); /* 중복된 회선명이 존재합니다. 다른 회선명을 입력해 주세요. */
	  				$("#"+gridLineId).alopexGrid("startEdit");
	  			}else{
	  				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
	  				$("#"+gridLineId).alopexGrid("startEdit");
	  			}
    		}else{
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
  				$("#"+gridLineId).alopexGrid("startEdit");
    		}
    		
    	}
    	// 엑셀다운로드 배치 
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
    	
	};
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
    	if(flag == 'tmofCodeData'){
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다. */
//    		console.log("page End : " + getLocalTimeString());		
    	} 
    	if(flag == 'svlnSclBmtsoCodeData'){
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다. */
//    		console.log("page End : " + getLocalTimeString());		
    	} 
    	if(flag == 'jobLineSearch'){
    		cflineHideProgressBody();
    		reSetGrid();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
    	// 완료일 수정
    	if(flag == 'updatecmpldatereq'){
    		cflineHideProgressBody();
			$('#btnCmplModReq').setEnabled(true);
			$('#btnCmplModReq').click();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	// 완료일 변경 요청 취소
    	if(flag == 'updatecmpldatereqcnsl'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	// 작업 삭제 
    	if(flag == 'updatejobdelete'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	// 작업 복구 
    	if(flag == 'updatejobrestore'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	//작업정보저장 
    	if(flag == 'workUpdateProc' ){
    		if(nullToEmpty(response.procDivCd)==""){ // 순수 작업정보 저장 인 경우에만 메시지 처리
        		cflineHideProgressBody();
	    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
				$("#"+gridLineId).alopexGrid("startEdit");
    		}
    	}
    	//작업접수
    	if(flag == 'updatejobrequest' ){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	//TASK 완료 
    	if(flag == 'saveTaskComplete'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
			$("#"+gridLineId).alopexGrid("startEdit");
    	}
    	// 엑셀다운로드 배치 
		if(flag == 'excelBatchExecute') {	   		
			cflineHideProgressBody();
	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
	};
	
	// 회선찾기 팝업 열기
	function openLineSearchPop(dataList){
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		$a.popup({
		  	popid: "popLineSearch",
		  	title: cflineMsgArray['openTaskReg'] /* 개통 Task 등록 */,
			url: urlPath + "/configmgmt/cfline/OpenTaskLineSearchPop.do",
			data: dataList,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : 1650,
			height : 680,
			callback:function(data){
				if(data == "write"){
					// 다른 팝업에 영향을 주지 않기 위해
					$.alopex.popup.result = null;
					alertBox('I', cflineMsgArray['normallyProcessed']); /* 정상적으로 처리되었습니다. */
					//requestGridClick('T');
					fnSearchProc('T');  // 
				}
			}
		}); 
	}
	/**
	 * 요청 정보 그리드 클릭 
	 * divGb (F:사용자가 클릭해서 조회, T 데이터 처리 후 조회)
	 */    
	var requestGridClick = function(divGb){

    	$('#' + reqGrid).alopexGrid("endEdit");
//	 	var dataObj = AlopexGrid.parseEvent(e).data;
//    	var dataObj = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
//		
    	var focusData = null;
    	if(divGb=="G"){
    		focusData = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
    		divGb="T"
    	}else{
    		focusData = $('#' + reqGrid).alopexGrid("dataGet", {_state : {focused : true}});
    	}
//		var focusData = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
//	 	console.log(focusData2);
//		var focusData = $('#' + reqGrid).alopexGrid("dataGet", {_state : {focused : true}});
		var dataObj = focusData[0];
//	 	console.log("1111");
//	 	console.log(focusData);
//	 	console.log(dataObj);
//	 	console.log("divGb=" + divGb);
//	 	var rowIndex = dataObj._index.row;
//	 	console.log(rowIndex);
//	 	if(dataObj != null && searchJobId != dataObj.jobId){
    	reSetGrid();
 		svlnSclCdVal = "";
 		selectedJobTitle = "";
 		jobIdVal = "";
// 		console.log(dataObj._state.selected);
	 	if(dataObj != null && ((!dataObj._state.selected && divGb=='F') || (dataObj._state.selected && divGb=='T')) ){		
	 		jobIdVal = dataObj.jobId;
	 		svlnSclCdVal = dataObj.svlnSclCd;  // 서비스회선 그리드 제어용
			selectedJobTitle = dataObj.jobTitle;
			var orglJobCmplModReqDt = dataObj.orglJobCmplModReqDt;
			if( dataObj.delYn =="N"){
// 요청 변경 프로세서 막음으로 아래 주석 막고 그 밑의 것으로 처리				
//    	 		if(orglJobCmplModReqDt != null && orglJobCmplModReqDt != ""){  // 완료변경요청일이 있는경우 
//            	 	if(dataObj.lineIcmpCnt > 0){  // 미완료 > 0 이면
//            	 		$('#btnCmplModReqCnsl').setEnabled(true);
//            	 	}else{
//            	 		$('#btnCmplModReqCnsl').setEnabled(false);
//            	 	}
//        	    	$('#btnCmplMod').setEnabled(false);
//        	    	$('#btnCmplCnsl').setEnabled(false);	
//        	    	$('#btnCmplModReq').setEnabled(false);	   
//    	 		}else{
//        	    	$('#btnCmplModReqCnsl').setEnabled(false);
//        	    	$('#btnCmplMod').setEnabled(false);
//        	    	$('#btnCmplCnsl').setEnabled(false);	    	    	 
//            	 	if(dataObj.lineIcmpCnt > 0){  // 미완료 > 0 이면
//            	    	$('#btnCmplModReq').setEnabled(true);
//            	 	}else{
//            	    	$('#btnCmplModReq').setEnabled(false);
//            	 	}
//    	 		}

    	    	$('#btnCmplModReqCnsl').setEnabled(false);
    	    	$('#btnCmplMod').setEnabled(false);
    	    	$('#btnCmplCnsl').setEnabled(false);	    	    	 
        	 	if(dataObj.lineIcmpCnt > 0){  // 미완료 > 0 이면
        	    	$('#btnCmplModReq').setEnabled(true);
        	 	}else{
        	    	$('#btnCmplModReq').setEnabled(false);
        	 	}				
			}
    		infoMaxnumber = 0;
			cflineShowProgressBody();	
	 		$.extend(dataObj,{tmofCd: searchTmofCdVal });
//	 		console.log("요청목록 클릭시");
//	 		console.log(dataObj);
	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentaskjoblinelist', dataObj, 'GET', 'jobLineSearch');
	 	}
//	 	console.log("============0=========");
//	 	console.log(dataObj);
//	 	console.log("=============1========");

	}
	/**
	 * 작업정보 저장시 필수 입력 값 체크 
	 * selDataList : 그리드에서 선택한 데이터 (호출전에 선택한 데이터 체크 할것)
	 */
	var validationCheck = function(selDataList){
		var resultValue = true;
		for(var k=0; k < selDataList.length; k++){
			if(nullToEmpty(selDataList[k].jobType) != "3"){  // 감설이 아닌경우 체크 함.
				if(nullToEmpty(selDataList[k].lineNm) == ""){  // 회선 명이 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['lnNm'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].svlnStatCd) == ""){  // 서비스회선상태 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['serviceLineStatus'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].lineUsePerdTypCd) == ""){  // 회선사용기간유형 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['lineUsePeriodType'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].svlnTypCd) == ""){  // 서비스회선유형 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['serviceLineType'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].lineCapaCd) == ""){  // 회선용량 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['lineCapacity'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].faltMgmtObjYn) == ""){  // 고장관리대상여부 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['faultManagementObjectYesOrNo'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].lineDistTypCd) == ""){  // 회선거리유형 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['lineDistanceType'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].lineSctnTypCd) == ""){  // 회선구간유형 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['lineSectionType'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}				
				if(nullToEmpty(selDataList[k].chrStatCd) == ""){  // 과금상태 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['chargingStatus'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}
				if(nullToEmpty(selDataList[k].lineMgmtGrCd) == ""){  // 회선관리등급 없는 경우
					alertBox('I', makeArgMsg('requiredListObject', cflineMsgArray['selectedData'] /* 선택한 데이터 */, k, cflineMsgArray['lineManagementGrade'], null));/* {0}의 {1} 번째줄의 {2}은(는) 필수입니다. */ 
				 	resultValue = false;
				 	break;
				}
			}
		}
	 	if(!resultValue){
			$("#"+gridLineId).alopexGrid("startEdit");
	 	}
		return resultValue;
	}
	
	
    //그리드 재셋팅
    function reSetGrid(){
    	svlnSclCd = $('#svlnSclCd').val();
    	//그리드 재설정후 데이터 비우고 건수 0으로 변경
		$('#' + jobGrid).alopexGrid("dataEmpty");
		$('#'+gridLineId).alopexGrid("dataEmpty");
    	getGrid(svlnSclCd);
    	jobLineGridBtnProc("C");  // 버튼제어
    }	


    //Grid 초기화
    var getGrid = function(svlnSclCd, response) {    	

    	/*svlnSclCd
    		001 :	교환기간
    		002 :	기지국간
    		003 :	상호접속간
    	*/
    		if(svlnSclCd == "001"){						//교환기간 mappingLine001
    			returnLineMapping = mappingLine001();
    		}else if(svlnSclCd == "003"){				// 상호접속간 mappingLine003
    			returnLineMapping = mappingLine003();
    		}else{										// 기지국간       mappingLine002 		
    			returnLineMapping = mappingLine002();
    		}
    		if (response != undefined){
    		response.lineList = makeHeader(response.lineList);
    		}
			//그리드 생성
	        $('#'+gridLineId).alopexGrid({

	        	autoColumnIndex: true,
	        	autoResize: true,
	        	cellSelectable : false,
	        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	        	rowInlineEdit : true, //행전체 편집기능 활성화
	        	rowClickSelect : true,
	        	rowSingleSelect : false,
	        	numberingColumnFromZero: false,
	        	defaultColumnMapping:{sorting: true},
	        	enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		
	    		pager:false,  		
				height : 500,	
//	    		contextMenu : [
//	    		               {
//	    							title: "작업 정보 저장",
//	    						    processor: function(data, $cell, grid) {
//	    						    	workUpdate('');
//	    						    },
//	    						    use: function(data, $cell, grid) {
//	    						    	return data._state.selected;
//	    						    }
//	    					   }
//	    		               ],
	        	message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
	    		},
	        	columnMapping:returnLineMapping,
	        });
	    	$('#'+gridLineId).alopexGrid("columnFix", 3);
	    	//	작업 정보 편집모드 활성화
	    	$("#"+gridLineId).alopexGrid("startEdit");

    } 
    	
	

    
    //MAKEHEADER 
    function makeHeader (data){ 
      	var mapping = '';
      	var maxnumber = 0;
      	var number = 0;
      	
//      	console.log("=================================");
      	for(var i=0; i<data.length; i++){
  			var serviceLineList = data[i].serviceLineList  ;
  				if(serviceLineList != null && serviceLineList.length  > 0 ){
  					for(var j=0; j<serviceLineList.length; j++){
  						var k = j +1 ; 
  						data[i]["useTrkNtwkLineNm#"+j] = serviceLineList[j].useTrkNtwkLineNm;
  						data[i]["useRingNtwkLineNm#"+j] = serviceLineList[j].useRingNtwkLineNm;
  						data[i]["useWdmTrkNtwkLineNm#"+j] = serviceLineList[j].useWdmTrkNtwkLineNm;
  						
  						var tmpSctnDrdCD = "1";
  						var sctnDrcCd  = serviceLineList[j].sctnDrcCd;
  						var lftEqpRingDivCdNm = serviceLineList[j].lftEqpRingDivCdNm;
  						var lEqpNm = serviceLineList[j].lEqpNM;
  						var lEqpTid = serviceLineList[j].lEqpTid;
                          var lPortNm = serviceLineList[j].lPortNm;
  						var lWavVal = serviceLineList[j].lWavVal;
                          var lPortChNm  = serviceLineList[j].lftPortChnlVal;
                          var lftPortChnlT1Yn  = serviceLineList[j].lftPortChnlT1Yn;
                          var rghtEqpRingDivCdNm = serviceLineList[j].rghtEqpRingDivCdNm
  						var rEqpNm = serviceLineList[j].rEqpNM;
  						var rEqpTid = serviceLineList[j].rEqpTid;
                          var rPortNm    = serviceLineList[j].rPortNm;
  						var rWavVal = serviceLineList[j].rWavVal;
                          var rPortChNm  = serviceLineList[j].rghtPortChnlVal;
                          var rghtPortChnlT1Yn  = serviceLineList[j].rghtPortChnlT1Yn;
                          
                          var rxSctnDrcCd  = serviceLineList[j].rxSctnDrcCd;
                          var rxLftPortNm  = "";
                          var rxRghtPortNm  = "";

                          var lftPortDescr = "";
                          var rghtPortDescr = "";
                          var lftChnlDescr = "";
                          var rghtChnlDescr = "";
                          
                          //RT구간방향 getRxSctnDrcCd
                          if ("2" == nullToEmpty(rxSctnDrcCd) ){
                              rxLftPortNm = nullToEmpty(serviceLineList[j].rxRghtPortNm);
                              rxRghtPortNm = nullToEmpty(serviceLineList[j].rxLftPortNm);
                          }else{
                              rxLftPortNm = nullToEmpty(serviceLineList[j].rxLftPortNm);
                              rxRghtPortNm = nullToEmpty(serviceLineList[j].rxRghtPortNm);
                          }                        
                          
                          
                          var useNtwkSctnDrcCd = null;
                          
                          if(serviceLineList[j].useNtwkSctnDrcCd == "2"){
                          	useNtwkSctnDrcCd = "2";
                          }else{
                          	useNtwkSctnDrcCd = "1";
                          }
                          
                          if((nullToEmpty(sctnDrcCd) == "2" && nullToEmpty(useNtwkSctnDrcCd) == "1") ||  (nullToEmpty(sctnDrcCd) == "1" && nullToEmpty(useNtwkSctnDrcCd) == "2") ){
  							tmpSctnDrdCD = "2";
  						}
  						if (tmpSctnDrdCD == "1"){
  							data[i]["lftEqpRingDivCdNm#"+j] = lftEqpRingDivCdNm;
  							data[i]["lEqpNM#"+j] = lEqpNm;
  							data[i]["lEqpTid#"+j] = lEqpTid;
//  							data[i]["lPortNm#"+j] = lPortNm;
  							data[i]["lWavVal#"+j] = lWavVal;
  							data[i]["rghtEqpRingDivCdNm#"+j] = rghtEqpRingDivCdNm;
  							data[i]["rEqpNM#"+j] = rEqpNm;
  							data[i]["rEqpTid#"+j] = rEqpTid;
//  							data[i]["rPortNm#"+j] = rPortNm;	
  							data[i]["rWavVal#"+j] = rWavVal;

                              lftChnlDescr = nullToEmpty(lPortChNm);
                              rghtChnlDescr = nullToEmpty(rPortChNm); 
                              data[i]["lftPortChnlT1Yn#"+j] = lftPortChnlT1Yn;
  							data[i]["rghtPortChnlT1Yn#"+j] = rghtPortChnlT1Yn;
  							
  	                         // 좌포트(노드 포트)
                             if("" != rxLftPortNm){
                          	   lftPortDescr = makeTxRxPortDescr(lPortNm, rxLftPortNm);
                             }
                             else {
                          	   lftPortDescr = lPortNm;
                             }
                             // 우포트(FDF 포트)
                             if("" != rxRghtPortNm){
                          	   rghtPortDescr = makeTxRxPortDescr(rPortNm, rxRghtPortNm);
                             }
                             else {
                          	   rghtPortDescr = rPortNm;
                             } 	
  						}else if (tmpSctnDrdCD == "2"){
  							
  							data[i]["lftEqpRingDivCdNm#"+j] = rghtEqpRingDivCdNm;
  							data[i]["lEqpNM#"+j] = rEqpNm;
  							data[i]["lEqpTid#"+j] = rEqpTid;
  							data[i]["lWavVal#"+j] = rWavVal;
  							data[i]["rghtEqpRingDivCdNm#"+j] = lftEqpRingDivCdNm;
  							data[i]["rEqpNM#"+j] = lEqpNm;
  							data[i]["rEqpTid#"+j] = lEqpTid;
  							data[i]["rWavVal#"+j] = lWavVal;
  							
                              lftChnlDescr = nullToEmpty(rPortChNm);
                              rghtChnlDescr = nullToEmpty(lPortChNm); 
  							
  							data[i]["lftPortChnlT1Yn#"+j] = rghtPortChnlT1Yn;
  							data[i]["rghtPortChnlT1Yn#"+j] = lftPortChnlT1Yn;
  							
  	                         // 좌포트(노드 포트)
                              if("" != rxLftPortNm){
                              	lftPortDescr = makeTxRxPortDescr(rPortNm, rxLftPortNm);
                              }
                              else {
                              	lftPortDescr = rPortNm;
                              }
                              // 우포트(FDF 포트)
                              if("" != rxRghtPortNm){
                              	rghtPortDescr = makeTxRxPortDescr(lPortNm, rxRghtPortNm);
                              }
                              else {
                              	rghtPortDescr = lPortNm;
                              } 	
  						}

                          
                          if (nullToEmpty(lftChnlDescr) != ""){
      						data[i]["lPortNm#"+j] = lftPortDescr + lftChnlDescr;
                          }else{
      						data[i]["lPortNm#"+j] = lftPortDescr;
                          }
                          if (nullToEmpty(rghtChnlDescr) != ""){
      						data[i]["rPortNm#"+j] = rghtPortDescr + rghtChnlDescr;	
                          }else{
      						data[i]["rPortNm#"+j] = rghtPortDescr;	
                          }						
  						
  					}
  					number  = serviceLineList.length;
  				}
				if (infoMaxnumber < number){
					infoMaxnumber = number;
				}
  		}
      	
  		mapping = returnLineMapping;
  		maxnumber = infoMaxnumber;
      	
      	for(var j=0; j < maxnumber; j++){
      		var k = j +1 ; 
      		mapping.push({ key:'useTrkNtwkLineNm#'+j    ,title:cflineMsgArray['trunk']+'#'+k     ,align:'left', width: '200px' });
      		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
      		mapping.push({ key:'lEqpNM#'+j		 , title:cflineMsgArray['westEqp']+'#'+k	    	,align:'left', width: '200px' });
      		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['westPort']+'#'+k	    	,align:'left', width: '200px' });
      		mapping.push({ key:'rEqpNM#'+j		 , title:cflineMsgArray['eastEqp'] +'#'+k	    	,align:'left', width: '200px' });
      		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['eastPort'] +'#'+k	    	,align:'left', width: '200px' });

      	}
      	return data;
    }	
	
    // 버튼 비활성화 처리
  	function btnFalseProc(){
	    	$('#btnCmplModReq').setEnabled(false);
	    	$('#btnCmplModReqCnsl').setEnabled(false);
	    	$('#btnCmplMod').setEnabled(false);
	    	$('#btnCmplCnsl').setEnabled(false);
	    	
	    	
	    	jobLineGridBtnProc("C");
  	};    
  	// 작업, 회선 그리드 버튼 처리
  	function jobLineGridBtnProc(gubun){

    	if(gubun=="C"){ // 초기화
	    	$('#btnJobAcep').setEnabled(false);
	    	$('#btnLineLkup').setEnabled(false);
	    	$('#btnJobExportExcel').setEnabled(false);
	
	    	$('#btnReltLineInf').setEnabled(false);
	    	$('#btnMlInfIns').setEnabled(false);
	    	$('#btnExportExcel').setEnabled(false);
	    	$('#btnExcelUlad').setEnabled(true);
	    	$('#btnJobInfSave').setEnabled(false);
	    	$('#btnTaskFnsh').setEnabled(false);
	    	$('#btnDupMtsoMgmt').setEnabled(false);
    	}else if(gubun=="LV"){ // 회선그리드 활성화	
	    	$('#btnReltLineInf').setEnabled(true);
	    	$('#btnMlInfIns').setEnabled(true);
	    	$('#btnExportExcel').setEnabled(true);
	    	$('#btnJobInfSave').setEnabled(true);
	    	$('#btnTaskFnsh').setEnabled(true);
	    	$('#btnDupMtsoMgmt').setEnabled(true);
    	}else if(gubun=="LC"){ // 회선그리드 비활성화	
	    	$('#btnReltLineInf').setEnabled(false);
	    	$('#btnMlInfIns').setEnabled(false);
	    	$('#btnExportExcel').setEnabled(true);
	    	$('#btnJobInfSave').setEnabled(false);
	    	$('#btnTaskFnsh').setEnabled(false);
	    	$('#btnDupMtsoMgmt').setEnabled(false);
    	}else if(gubun=="LM"){ // 감설 선택된 경우 버튼 제어	
	    	$('#btnReltLineInf').setEnabled(true);
	    	$('#btnMlInfIns').setEnabled(false);
	    	$('#btnExportExcel').setEnabled(true);
	    	$('#btnJobInfSave').setEnabled(false);
	    	$('#btnTaskFnsh').setEnabled(true);
	    	$('#btnDupMtsoMgmt').setEnabled(false);
    	}
	};    
  	
	
	// 그리드 편집모드시 달력
    function datePicker(gridId, cellId, rowIndex, keyValue){
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		var insertDate = dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
    		$('#' + gridId + '').alopexGrid("cellEdit", insertDate, {_index : { row : rowIndex }}, keyValue);
		}
    	);	
    };
    
    // 작업 삭제/복구 
    function jobDeleteOrRestore(){    		
		if( $('#' + reqGrid).length == 0) return;
		var dataList = $('#' + reqGrid).alopexGrid('dataGet', {_state: {selected:true}});
		var rowIndex = dataList[0]._index.data;
		var paramUsing = dataList[0];
//		console.log(paramUsing);
		var msg ="";
		var url = "";
		if(paramUsing.delYn == "N"){ // 데이터가 삭제 상태가 아닌경우 삭제 처리
			msg = cflineMsgArray['delete'] /* 삭제하시겠습니까? */;
			url = "updatejobdelete";
		}else{
			msg = cflineMsgArray['reqRestoration'] /* 복구하시겠습니까? */;
			url = "updatejobrestore";
		}
		callMsgBox('btnCmplMod', 'C', msg, function(msgId, msgRst){
			if (msgRst == 'Y') {
				cflineShowProgressBody();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/' + url, paramUsing, 'POST', url);
			}
		});
    	
    };
    
    // 색상 처리
    function nodeCopyPasteCss(value, data, mapping) {
    	// 장비 복사, 잘라내기 배경색 
    	var returnValue = "";
    	if(data.delYn == "Y") {
    		if(mapping.key == "jobTitle") {
    			returnValue = 'openTaskDeleteFontColor';
    		} 
    	}
    	return returnValue;
    };

    
    //엑셀다운로드 배치실행 
    function funExcelBatchExecute() {
   		

    	var dataParamMethod = "I";
		var data = $('#'+gridLineId).alopexGrid('dataGet');
		var dataCnt = data.length;
//		fileName = '개통TASK' ;   /* 개통TASK */
		
    	
     	//var dataParam =  $("#searchForm").getData();
		
		var dataParam =  {"jobId":jobIdVal,"svlnLclCd":"001","svlnSclCd":svlnSclCdVal,"tmofId":searchTmofCdVal, "openTaskYn": "Y"};
     	
     	// jobId, tmofCd
     	
    	var pathAll = 'Y'; 
    	$.extend(dataParam,{pathAll: pathAll });
     	
     	dataParam = gridExcelColumn(dataParam, gridLineId);
     
    	dataParam.fileExtension = "xlsx";
     	dataParam.method = dataParamMethod;
//     	console.log("엑셀 다운로드");
//     	console.log(dataParam);
     	cflineShowProgressBody();
     	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
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
    

    // FDF사용정보 전송(서비스회선/링편집시만 호출됨)
   function sendFdfUseInfo(flag) {
//	   	console.log("fdfUsingInoLineNo 0 : " +  fdfUsingInoLineNo);
//	   	console.log("fdfUsingInoPathLineNo 0 : " +  fdfUsingInoPathLineNo);
	    var sendLineNo = fdfUsingInoLineNo;
	    var callBackFlag = "sendfdfuseinfo";
	    if(flag == "E"){
	    	sendLineNo = fdfUsingInoPathLineNo;
	    	callBackFlag = "sendfdfuseinfopath";
	    }
	   	var fdfParam = {
	   			 lineNoStr : sendLineNo
	   		   , fdfEditLneType : "S"
	   		   , fdfEditType : flag  // 복원, 해지, 기본정보변경, (구)NITS-> 광코어
	   	}
	   	
	   	//console.log(fdfParam);
	   	
	    	Tango.ajax({
	    		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendfdfuseinfo', //URL 기존 처럼 사용하시면 됩니다.
	    		data : fdfParam, //data가 존재할 경우 주입
	    		method : 'GET', //HTTP Method
	    		flag : callBackFlag
	    	}).done(function(response){successCallbackFdfToGis(response, callBackFlag);})
	   	  .fail(function(response){failCallbackFdfToGis(response, callBackFlag);});
	   	
   }
   // FDF사용정보 전송용 성공CallBack함수
   function successCallbackFdfToGis (response, flag) {
	   	if (flag == "sendfdfuseinfo") {
//	   		console.log("sendfdfuseinfo successCallbackFdfToGis : " + fdfUsingInoLineNo);
//	   		console.log("successCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   		fdfUsingInoLineNo = "";
	   	}
	   	if (flag == "sendfdfuseinfopath") {
//	   		console.log("fdfUsingInoPathLineNo successCallbackFdfToGis : " + fdfUsingInoPathLineNo);
//	   		console.log("successCallbackFdfToGis Path : " + JSON.stringify(response.fdfUseInfoList));
	   		fdfUsingInoPathLineNo = "";
	   	}
   }

   //FDF사용정보 전송용 실패CallBack함수
   function failCallbackFdfToGis (response, flag) {
	   	if (flag == "sendfdfuseinfo") {
//	   		console.log("sendfdfuseinfo successCallbackFdfToGis : " + fdfUsingInoLineNo);
//	   		console.log("failCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
	   		fdfUsingInoLineNo = "";
	   	}
	   	if (flag == "sendfdfuseinfopath") {
//	   		console.log("fdfUsingInoPathLineNo successCallbackFdfToGis : " + fdfUsingInoPathLineNo);
//	   		console.log("failCallbackFdfToGis Path : " + JSON.stringify(response.fdfUseInfoList));
	   		fdfUsingInoPathLineNo = "";
	   	}
   }
});
