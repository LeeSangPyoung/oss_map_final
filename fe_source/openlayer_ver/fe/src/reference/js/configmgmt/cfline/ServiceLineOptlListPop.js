/**
 * ServiceLineOptlListPop.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var gridResult = 'resultListGrid';
var paramData = null;
var saveParams = "";  // 저장 파라미터 
var selectedDataCount = 0;  // 선택된 데이터 수(저장하기위해 선택한 데이터 수)
var procDataCount = 0;  // 처리한 데이터 개수
var links = null;  // 선번정보 
var saveDate = [];
var faleSvlnNo = ""; // 실패 회선 번호
var successCount  = 0;
$a.page(function() {
	
    this.init = function(id, param) {
    	//if (! jQuery.isEmptyObject(param) ) {
    		paramData = param;

    	//} 
//    		console.log(paramData.optlShreRepSvlnNo );
    	initGrid();
    	setSelectCode();
        setEventListener();   

        

    };
    
  //Grid 초기화
    function initGrid() {
    	
        //그리드 생성
        $('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false,
    		rowOption : {
    			allowSelect : function(data){
    				return (data.eastEqpId != null && data.eastEqpId != '') ? true : false
    			}
    		},
    		
			height : 550,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [{ selectorColumn : true, width : '50px' } 
			, {key : 'optlShreRepSvlnNo'	      		,title : cflineMsgArray['representaionLineNumber'] /*  대표회선번호 */       		,align:'center', width: '110px', hidden: true}
	        , {key : 'svlnNo'	              	,title : cflineMsgArray['serviceLineNumber'] /* 서비스회선번호 */			,align:'center', width: '110px'}
	        , {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '250px'}
	        , {key : 'uprIntgFcltsCd'	        ,title : cflineMsgArray['uprIntgFcltsCd'] /* 상하위통합시설코드 */			,align:'center', width: '110px'}
	        , {key : 'westEqpId'	    		    ,title : cflineMsgArray['westEqpId'] /*  WEST장비ID */               	,align:'center', width: '100px', hidden: true}
	        , {key : 'westEqpNm'	          	    ,title : cflineMsgArray['westEqp'] /* WEST장비명 */             ,align:'center', width: '180px'
	        	, inlineStyle : function(value, data) {
					if(data['sameBldYn'] == 'N') {
						return 'background-color:#FF8A8A';  //color:red    #F1EBBF  #D6EED6  #FFEAEA
					}else{
						return 'background-color:#FFFFFF';
					}
				}
	        }     
	        , {key : 'lowIntgFcltsCd'	        ,title : cflineMsgArray['lowIntgFcltsCd'] /* 하위통합시설코드 */			,align:'center', width: '110px'}
	        , {key : 'eastEqpId'	    		    ,title : cflineMsgArray['eastEqpId'] /*  EAST장비ID */               	,align:'center', width: '100px', hidden: true}
	        , {key : 'eastEqpNm'	          	    ,title : cflineMsgArray['eastEqp'] /* EAST장비명 */             ,align:'center', width: '180px'}                                                                                     
			              ]                                                                       
			                      }); 
      
    };

    
//    // 컬럼 숨기기
//    function gridHide() {
//    	
//    	var hideColList = ['svlnLclCd','svlnSclCd'];
//    	
//    	$('#'+gridResult).alopexGrid("hideCol", hideColList, 'conceal');
//    	
//	}    
    
    function setSelectCode() {
    	
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getoptlshrelinelist', paramData, 'GET', 'optlshrelinelist');
    	
  	
    	var searchParams = {"ntwkLineNo" : paramData.svlnNo, "utrdMgmtNo" : "", "exceptFdfNe" : "N"};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', searchParams, 'GET', 'svlnPathSearch');
//    	response.data.LINKS
    }
    
    function setEventListener() { //

    	
    	//취소
   	 	$('#btnPopCancel').on('click', function(e) {
   	 		$a.close(null);
        });    	
    	 
    	//적용 
    	$('#btnPopSave').on('click', function(e) {
			var element =  $('#'+gridResult).alopexGrid('dataGet', {_state: {selected:true}});
			selectedDataCount = element.length;
			if(links.length < 1){  // 선번데이터가 존재하지 않는 경우
    			alertBox('W', cflineMsgArray['lno']/* 선번 */ + " " + cflineMsgArray['noData'] /* 데이터가 없습니다. */); 
			}else{
				if(selectedDataCount <= 0){
	    			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
				}else{
		        	/* confirm("저장하시겠습니까?") */
		        	callMsgBox('','C', cflineMsgArray['save'], function(msgId, msgRst){  
		        		if (msgRst == 'Y') {
		        			saveDataMake();
		        		}
		        	});       		
				}
			} 		
         });     	
    	
 		
	};
	
	// 저장 데이터 처리 
	function saveDataMake(){
		
		var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
		
//		$('#'+gridResult).alopexGrid("endEdit",{ _state : { editing : true }});
		

		var dataList = $('#'+gridResult).alopexGrid('dataGet', {_state: {selected:true}});


//		console.log(links);		
//		console.log("links.length================================" + links.length);
//		console.log("links["+(links.length-1)+"].RIGHT_NE_ID================================" + links[links.length-1].RIGHT_NE_ID);
		
		procDataCount = 0;  // 처리한 데이터 개수 초기화
		faleSvlnNo = ""; // 초기화
		successCount  = 0; // 초기화
		saveDate = [];  // 초기화
		if (dataList.length > 0 ){
			for(k=0; k<dataList.length; k++){
				if(dataList[k].sameBldYn != null && dataList[k].sameBldYn == 'Y'){
					// westEqpId, FDF 장비와 동일 빌딩에 있을때.
					links[0].LEFT_NE_ID = dataList[k].westEqpId;
					links[0].LEFT_NE_NM = dataList[k].westEqpNm;
				}else{
					links[0].LEFT_NE_ID = "";
					links[0].LEFT_NE_NM = "";					
				}
				links[0].LEFT_PORT_ID = "";
				links[0].LEFT_PORT_NM = "";
				
				links[links.length-1].RIGHT_NE_ID = dataList[k].eastEqpId;
				links[links.length-1].RIGHT_NE_NM = dataList[k].eastEqpNm;
				links[links.length-1].RIGHT_PORT_ID = "";
				links[links.length-1].RIGHT_PORT_NM = "";
				
//				console.log("links["+(links.length-1)+"].RIGHT_NE_ID================================" + links[links.length-1].RIGHT_NE_ID);
		    	saveParams = {
				"ntwkLineNo" : dataList[k].svlnNo,
				"wkSprDivCd" : "01",
				"autoClctYn" : "N",
				"linePathYn" : "Y",
				"userId" : userId,
				"utrdMgmtNo" : "",  // 미처리관리번호
				"links" : JSON.stringify(links),   // links
				"ntwkLnoGrpSrno": dataList[k].lineLnoGrpSrno
		    	};		


				saveDate.push(saveParams);
				
//				console.log("saveDate : " + k);
//				console.log(saveDate[k]);
//				console.log("saveDate[" + k + "].ntwkLineNo : " + saveDate[k].ntwkLineNo);
			}
			saveOptl(0);
		}		

  		
		
		
//	 	console.log("saveMtsoPopForm param S");
//		console.log(param);
//		console.log("saveMtsoPopForm param E");	
		//var dataNewParam =  $.param(param, true);	
		//dataNewParam =  $.param(dataNewParam);	
	 	//console.log("saveMtsoPopForm dataNewParam S");
		//console.log(dataNewParam);
		//console.log("saveMtsoPopForm dataNewParam E");	
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/savemtsolnoinfo', param, 'POST', 'saveMtsoLnoInfo');
		
	}	
	// 선번데이터 저장 호출
	function saveOptl(idx){
		if(idx < saveDate.length){
			//console.log(saveDate[idx]);
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', saveDate[idx], 'POST', 'saveLinePath');
		}else{
			procComplete ();
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
    }

	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'optlshrelinelist'){
    		cflineHideProgressBody();
			$('#'+gridResult).alopexGrid("dataSet", response.lists);
    	}  
    	if(flag =="svlnPathSearch"){
    		links = response.data.LINKS;
    	}   	
    	if(flag =="saveLinePath"){
    		cflineHideProgressBody();
    		if(response.PATH_RESULT) {  // 성공
    			successCount++;
    			// FDF 사용정보 
    			sendFdfUseInfo(saveDate[procDataCount].ntwkLineNo);
    		}else{
        		if(faleSvlnNo == ""){
        			faleSvlnNo = saveDate[procDataCount].ntwkLineNo;
        		}else{
        			faleSvlnNo = faleSvlnNo + ", " + saveDate[procDataCount].ntwkLineNo;
        		}    			
    		}
    		procDataCount++;
//    		console.log("============"+response.PATH_RESULT);	
//    		console.log(response);	
    		saveOptl(procDataCount);
    	}
		
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'optlshrelinelist'){
    		//$('#'+gridResult).alopexGrid('hideProgress');
    		cflineHideProgressBody();
    		//alert('조회 실패하였습니다.');
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	
    	if(flag =="svlnPathSearch"){
    		cflineHideProgressBody();
    	}    	
    	if(flag =="saveLinePath"){
    		cflineHideProgressBody();
    		if(faleSvlnNo == ""){
    			faleSvlnNo = saveDate[procDataCount].ntwkLineNo;
    		}else{
    			faleSvlnNo = faleSvlnNo + ", " + saveDate[procDataCount].ntwkLineNo;
    		}
    		procDataCount++;
    		saveOptl(procDataCount);
    	}
    }
    
    // 처리 후 메지지 출력
    function procComplete (gubun){

		cflineHideProgressBody();
		var msg = "";
		msg = makeArgMsg("processed", successCount, "", "", "");
		if(faleSvlnNo != null && faleSvlnNo != ""){  // 실패가 있는경우
			msg = msg + "<br/>" + cflineMsgArray['failure']/* 실패 */ + ": " + faleSvlnNo;
		}

//		alertBox('I', msg); /* 저장을 실패 하였습니다.*/
		var data = [];
		data = {
				"msg" : msg
		    	};			
		$a.close(data);
    }
    
   // FDF사용정보 전송(서비스회선/링편집시만 호출됨)
    function sendFdfUseInfo(lineNoStr ) {
    	//console.log("lineNoStr: " +  lineNoStr);
        
    	var fdfParam = {
    			 lineNoStr : lineNoStr
    		   , fdfEditLneType : "S"
    		   , fdfEditType : "E"
    	}
    	
    	//console.log(fdfParam);
    	
     	Tango.ajax({
     		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendfdfuseinfo', //URL 기존 처럼 사용하시면 됩니다.
     		data : fdfParam, //data가 존재할 경우 주입
     		method : 'GET', //HTTP Method
     		flag : 'sendfdfuseinfo'
     	}).done(function(response){successCallbackFdfToGis(response, 'sendfdfuseinfo');})
    	  .fail(function(response){failCallbackFdfToGis(response, 'sendfdfuseinfo');});
    	
    }

    // FDF사용정보 전송용 성공CallBack함수
    function successCallbackFdfToGis (response, flag) {
    	if (flag == "sendfdfuseinfo") {
    		//console.log("successCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
    	}
    }

    //FDF사용정보 전송용 실패CallBack함수
    function failCallbackFdfToGis (response, flag) {
    	if (flag == "sendfdfuseinfo") {
    		//console.log("failCallbackFdfToGis : " + JSON.stringify(response.fdfUseInfoList));
    	}
    }
    

    
});

//
//
//function tempDataTrim(gridId) {
//	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
//	// 임시 데이터 제거
//	var data = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet'));
//	for(var i = 0; i < data.length; i++) {
//		for(key in data[i]) {
//			var temp = String(eval("data[i]."+key)).indexOf('alopex'); 
//			if(temp == 0) {
//				eval("data[i]."+key + " = ''");
//			}
//		}
//		data[i].LINK_SEQ = (i+1);
//	}
//	
//	return data;
//}
