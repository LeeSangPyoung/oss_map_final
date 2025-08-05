/**
 * ErpAprvReqPop
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var cnt = 0;
	var startTime = new Date().getTime();
	var planTime = '';
	var estSeconds = 0;
	var planSeconds = 0;
	var lastCnt = 0;
	//그리드 ID
    var gridId1 = 'resultGrid1';
    var rowPerPage = 10;
    var endTimeFlag = 'N';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	console.log(id,param);
        
    	$("#estimatedTimeText").hide();
    	$("#estimatedTime").hide();
    	$("#timeGubun").hide();
    	
    	initGrid();
    	setEventListener();
    	
    	tid2 = setInterval(function(){
    		planTime = getTimeText("plan", 0);
    		$("#planTime").html(planTime);
    	},1000);
    	
    	tid = setInterval(function(){
    		setProgress();
    	},1000);
    	
    };
    

  	//Grid 초기화
    function initGrid() {
        
        var mapping1 =  [
	 		{ key : 'aprvState', align:'center', width:'150px', title : demandMsgArray['progressStatus']/*'진행상태'*/}
	 		,{ key : 'tnPrjId', align:'center', width:'100px', title : demandMsgArray['projectCode']/*'프로젝트코드'*/}
	 		,{ key : 'trmsDemdMgmtNo', align:'center', width:'150px', title : demandMsgArray['transmissionDemandManagementNumber']/*'수요관리번호'*/}
	 		,{ key : 'afeYr', align:'center', width:'80px', title : demandMsgArray['afeYear']/*'AFE 년도'*/}
	 		,{ key : 'afeDemdDgr', align:'center', width:'80px', title : demandMsgArray['afeDegree']/*'AFE 차수'*/}
	 		,{ key : 'erpAfeDgr', align:'center', width:'100px', title :"ERP전송차수" /*'AFE차수'*/}
	 		,{ key : 'erpHdofcNm', align:'center', width:'80px', title : demandMsgArray['hdofc']/*'본부'*/}
	 		,{ key : 'demdBizDivNm', align:'left', width:'120px', title : demandMsgArray['businessDivisionBig']/*'사업구분'*/}
	 		,{ key : 'demdBizDivDetlNm', align:'left', width:'120px', title : demandMsgArray['businessDivisionDetl']/*'세부사업구분'*/}
	 		,{ key : 'bizNm', align:'left', width:'200px', title : demandMsgArray['businessName']/*'사업명'*/}
	 		,{ key : 'erpUsgNm', align:'left', width:'200px', title : demandMsgArray['businessUsage']/*'사업용도'*/}
	 		,{ key : 'eqpTypNm', align:'left', width:'120px', title : demandMsgArray['eqpLnType']/*'장비/선로 타입'*/}
	 		,{ key : 'errMsgCtt', align:'left', width:'120px', title : demandMsgArray['requestResult']/*'요청결과'*/}

			];
		
	     //그리드 생성
	     $('#'+gridId1).alopexGrid({
	         cellSelectable : true,
	         autoColumnIndex : true,
	         fitTableWidth : true,
	         rowClickSelect : true,
	         rowSingleSelect : false,
	         rowInlineEdit : true,
	         numberingColumnFromZero : false
	         , height : 450
	         ,paging: {
	        	   pagerTotal:true,
	        	   pagerSelect:false,
	        	   hidePageList:true
	             } 
	         ,columnMapping : mapping1
	         ,message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
					filterNodata : 'No data'
				}
	     });
	     
	     $('#'+gridId1).on('scrollBottom', function(e){

	    	 	var pageInfo = $('#' + gridId1).alopexGrid("pageInfo");
	    		
	        	// 총건수와 현재 페이지건수가 동일하면 조회 종료
	        	if(pageInfo.dataLength != pageInfo.pageDataLength){
		    		showProgress(gridId1);
			    	$('#pageNo').val(parseInt($('#pageNo').val()) + 1);
		    		$('#rowPerPage').val($('#rowPerPage').val()); 
		    		
			 		var dataParam =  $("#searchForm").getData(); 
	
		        	      		
		    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpaprvlist', dataParam, 'POST', 'searchForPageAdd');
        	}
	    		
	     });
	     
	     
    };
    
    
    function setEventListener() {     
    	
    	$("#pageNo").val(1);
    	$('#rowPerPage').val(rowPerPage);
    	
    	//엑셀다운로드
       $('#excelErpAprvProgressList').on('click', function(e) {        	
        	var popList = AlopexGrid.trimData ( $('#'+gridId1).alopexGrid("dataGet", {} ));
        	if(popList.length < 1){
        		alertBox('W', demandMsgArray['noApplyReqList']);/*'승인요청 목록이 없습니다.'*/
        		return false;
        	}
        	if(($("#sendErpAprovProgress").getValue() < 100) && (estSeconds>planSeconds)){
        		alertBox('W', demandMsgArray['excelDownCompleteApprReq']);/*'엑셀다운로드는 승인요청이 완료된 후 \n이용하실수 있습니다.'*/
        		return false;
        	}

        	bodyProgress();        	
        	var dataParam =  $("#searchForm").getData();
        	dataParam.firstRowIndex = 0;
        	dataParam.lastRowIndex = 30000;
        	
        	dataParam = gridExcelColumn(dataParam, gridId1);
        	
        	dataParam.fileName = demandMsgArray['enterpriseResourcePlanningApprovalRequestList']/*"시설계획 _업로드_리스트"*/;
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	dataParam.mthd = "excelErpAprvProgressList";
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/excelcreate', dataParam, 'GET', 'excelDownload');
       });
                
        $(".close_btn").on('click', function(e) { 
        	bodyProgressRemove();
        	closePage();
        });
        
        $("#erpAprvProgressList").on('click', function(){
        	setList();
        });
	};
	
	//request
	function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    	  //.error();
    }
	
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
	
	//request 성공시
    function successDemandCallback(response, flag){
    	
    	if(flag == 'erpaprvlist'){

    		hideProgress(gridId1);
    		
    		var serverPageinfo;
    		
	    	if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	    	      	};
	    	}
	    	
    		if(response.list.length == 0){
    			//alertBox('I', demandMsgArray['noInquiryData']);/*'조회된 데이터가 없습니다.'*/
			}
    		$('#'+gridId1).alopexGrid("dataSet", response.list, serverPageinfo);
    	}
    	if(flag == 'searchForPageAdd'){
    		hideProgress(gridId1);
			if(response.list.length == 0){
				//alertBox('I', demandMsgArray['noMoreData'] );/*더 이상 조회될 데이터가 없습니다.*/
				return false;
			}
			
			var serverPageinfo;
    		
	    	if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	    	      	};
	    	}
	    	$('#'+gridId1).alopexGrid("dataAdd", response.list, serverPageinfo);	    	
    	}
    	
    	if(flag == 'upsertErpAprvProgress'){
    		var listCnt = parseInt(response.list[0].totCnt); 
    		
    		if(listCnt ==0 && cnt == 0){
    			clearInterval(tid);
    			clearInterval(tid2);
    			$("#sendErpAprovProgress").setValue(0);
    			$("#planTime").html(0);
    			$("#compPct").html(0);
    			$("#totalCnt").html(0);
    			$("#totalCnt2").html(0);
    			$("#compCnt1").html(0);
    			$("#compCnt2").html(0);
    			$("#errCnt").html(0);
    			alertBox('W', demandMsgArray['noApplyReqList'] );/*'승인요청 목록이 없습니다.'*/
    			return false;
    		}
    		
    		var compPct = 0;
    		var totCnt = parseInt(response.list[0].totCnt);
    		var stateStay = parseInt(response.list[0].stateStay);
    		var stateComp = parseInt(response.list[0].stateComp);
    		var stateErr = parseInt(response.list[0].stateErr);
    		
    		compPct = Math.round(((stateComp + stateErr)/totCnt) * 100);
    		$("#sendErpAprovProgress").setValue(compPct);
    		
    		$("#compPct").html(compPct);
    		$("#compCnt1").html(stateComp + stateErr);
    		$("#totalCnt").html(totCnt);
			$("#totalCnt2").html(totCnt);
			$("#compCnt2").html(stateComp);
			$("#errCnt").html(stateErr);
    		
			if(cnt == 0){
				var minTime = parseInt(response.list[0].allPartMinTm);
				var totTime = parseInt(response.list[0].allTotTm);
				var totSeconds = 0;
				
				if(minTime> totTime) totSeconds = minTime + 60; /*양식별 최소 시간에 서버 준비시간 1분 추가.*/
				else totSeconds = totTime + 60; 
				
				estSeconds = 1800;
				
				$("#estimatedTime").html(getTimeText("estimated", estSeconds))
				
			}
			
			if(cnt == 0 || lastCnt == 100 || ((estSeconds < planSeconds) && endTimeFlag == 'N') ){
				setList();
			}
			cnt++;
    	}
    	
    	if(flag == 'excelDownload') {

        	bodyProgressRemove();
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
    	}
    	
    	if(flag == 'clearReq') {
    		switch (response.result.resultMsg.pro) {
			case "OK":
				$a.close();
				break;

			case "FAIL":
				alertBox('W',response.result.resultMsg.msg);
				break;
			default:
				
				break;
			}
    	}
    	
    }
    
    
    //request 실패시.
    function failDemandCallback(response, flag){

		hideProgress(gridId1);
		if(flag == 'search'){
    			    	
	    	alertBox('W', demandMsgArray['searchFail'] );/*'시스템 오류가 발생하였습니다'  demandMsgArray['systemError']  */

	    	$('#'+gridId1).alopexGrid("dataEmpty");
	    	return false;
    	}
    			
    	if(flag == 'searchForPageAdd'){
    		    		
	    	alertBox('W', demandMsgArray['searchFail'] );/*'시스템 오류가 발생하였습니다'  demandMsgArray['systemError']  */

	    	return false;
    	} 
    	
    	if(flag == 'clearReq'){
    		    		
	    	alertBox('W', demandMsgArray['searchFail'] );/*'시스템 오류가 발생하였습니다'  demandMsgArray['systemError']  */

	    	return false;
    	} else {
			if (nullToEmpty(response.message) != '' && response.message != 'undefined') {
				alertBox('W', response.message);
			} else {
				alertBox('W', demandMsgArray['systemError']);
			}
    	}
    }
    
    function setProgress(){
    	lastCnt = $("#sendErpAprovProgress").getValue();
//    	var param = {cntonly : 'N'};
    	var param = {};
    	if(cnt > 0 && lastCnt == 100){
    		clearInterval(tid);
    		clearInterval(tid2);
    		setList();
    		return;
    	}
    	
    	if(cnt == 0) estSeconds = 90;
    	
    	if(estSeconds < planSeconds && endTimeFlag == 'N'){
    		clearInterval(tid);
    		//clearInterval(tid2);
    		setList();
    		/*시설계획 업로드 응답예상시간을 초과하였습니다\n시설계획 업로드 결과  확인 진행을 계속 하시겠습니다.?*/
    		callMsgBox('','C', demandMsgArray['estimatedTimeExceedKeepTry'], function(msgId, msgRst){  
    			if (msgRst == 'Y') {
        			endTimeFlag = 'Y';
        			cnt = 0;
        			tid = setInterval(function(){
    	        		setProgressAfterReqTime();
    	        	},1000);
    	    		return;
        		}else{
        			clearInterval(tid2);
        		}
        	});
    	}
    	
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/upsertErpAprvProgress', param, 'POST', 'upsertErpAprvProgress');
    }
    
    function setProgressAfterReqTime(){
    	lastCnt = $("#sendErpAprovProgress").getValue();
//    	var param = {cntonly : 'N'};
    	var param = {};
    	
    	if(cnt > 0 && lastCnt ==100){
    		clearInterval(tid);
    		clearInterval(tid2);
    		setList();
    		return;
    	}
    	
    	if(cnt == 0) { estSeconds = 30 ; }
    	/*if(estSeconds < planSeconds){
    		clearInterval(tid);
    		clearInterval(tid2);
    		alert("ERP승인요청 응답예상시간을 초과하였습니다.")
    		setList();
    		tid = setInterval(function(){
        		setProgressAfterReqTime();
        	},1000);
    		return;
    	}*/
    	
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/upsertErpAprvProgress', param, 'POST', 'upsertErpAprvProgress');
    }
    
    function setList(){

    	$("#pageNo").val(1);
    	$('#rowPerPage').val(rowPerPage);
    	var dataParam =  $("#searchForm").getData();
        
    	showProgress(gridId1);
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpaprvlist', dataParam, 'POST', 'erpaprvlist');
    }
    
    function getTimeText(type, cntTime){
    	
    	var seconds = 0;
    	if(type == "plan"){
    		var currentTime = new Date().getTime();
    		seconds = Math.floor((currentTime - startTime)/1000);
    		planSeconds = seconds;
    	}else if(type = "estimated"){
    		seconds = cntTime;
    	}
    	
    	var sec = seconds%60;
    	var mins = ((seconds - sec)/60)%60;
    	var hours = ((seconds - (sec+(mins*60)))/60)%24;
    	
    	var planTime = LPAD(hours.toString(),'0',2) + ":" + LPAD(mins.toString(),'0',2)+ ":" + LPAD(sec.toString(),'0',2);
    	return planTime;
    	
    }
    
    function LPAD(s, c, n){
    	if(! s || ! c || s.length>=n){
    		return s;
    	}
    	var max = (n- s.length)/c.length;
    	for(var i = 0;i<max;i++){
    		s = c+s;
    	}
    	return s;
    }
    
    function closePage(){
    	var popList = AlopexGrid.trimData ( $('#'+gridId1).alopexGrid("dataGet", {} ));
    	if(popList.length < 1){
    		$a.close();
    	}else{
    		var requestUrl = "";
    		var nowPct = $("#sendErpAprovProgress").getValue();
    		
    		if(nowPct == 100){
    			
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/clearReq', null, 'GET', 'clearReq');
    		}else{
    			/*시설계획 업로드가  완료되지 않았습니다.\n종료 하시겠습니까?*/
	    		callMsgBox('','C', demandMsgArray['noCompleteTryClose'], function(msgId, msgRst){  

	        		if (msgRst == 'Y') {
	        			clearInterval(tid);
    					clearInterval(tid2);
    					$a.close();
	        		}
	        	});
    		}
    	}    		
    }
});