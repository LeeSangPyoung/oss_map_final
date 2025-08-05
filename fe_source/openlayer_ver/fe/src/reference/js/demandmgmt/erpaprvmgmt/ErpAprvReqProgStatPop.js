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
    var bCancle = false;
    var intervalValue = 3000;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	initGrid();
    	setEventListener();
    	
    	timeInterval = setInterval(function(){
    		planTime = getTimeText("plan", 0);
    		$("#planTime").html(planTime);
    	},1000);
    	
    	progInterval = setInterval(function(){
    		setProgress();
    	},intervalValue);
    	
    	setList();
    	bCancle = false;
    };
    

  	//Grid 초기화
    function initGrid() {
        
        var mapping1 =  [
             	 		{ key : 'wbsId', align:'center', width:'100px', title : 'WBS 요소'/* WBS 요소 */}
             	 		, { key : 'divNm', align:'center', width:'100px', title : '구분'/* 구분 */}
             	 		, { key : 'issuProgStatNm', align:'center', width:'100px', title : '발급진행상태'/* 발급진행상태 */}
             	 		, { key : 'issuCnt', align:'center', width:'100px', title : '발급요청개수'/* 발급요청개수 */}
             	 		, { key : 'issuDate', align:'center', width:'100px', title : '발급요청날짜'/* 발급요청날짜 */}
             	 		, { key : 'errMsgCtt', align:'left', width:'120px', title : demandMsgArray['requestResult']/*'요청결과'*/}
             	 		
             	 		, { key : 'divCd', align:'left', width:'120px', title : '구분코드'/*'구분코드'*/, hidden : true}
             	 		, { key : 'issuProgStatCd', align:'left', width:'120px', title : '발급진행상태코드'/*'발급진행상태코드'*/, hidden : true}

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
	         ,columnMapping : mapping1
	         ,message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
					filterNodata : 'No data'
				}
	     });
    };
    
    
    function setEventListener() {     
    	   
        $(".close_btn").on('click', function(e) { 
        	bodyProgressRemove();
        	closePage();
        });
        
        $("#erpAprvProgressList").on('click', function(){
        	setList();
        });
        
        $("#btnClose").on('click', function(){
        	bodyProgressRemove();
        	closePage();
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
    	
    	if(flag == 'erpAprvProgStatlist'){

    		hideProgress(gridId1);
    		if(response.list.length == 0){
    			alertBox('I', demandMsgArray['noInquiryData']);/*'조회된 데이터가 없습니다.'*/
			}
    		$('#'+gridId1).alopexGrid("dataSet", response.list);
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
    	var popList = AlopexGrid.trimData ( $('#'+gridId1).alopexGrid("dataGet", {} ));
		var bRes = true;
		if(popList.length < 1){
			
		}
		else{
			for(var i = 0 ; i < popList.length; i++){
				var data = popList[i];
				
				if(data.issuProgStatCd == 'W'){
					bRes = false;
					break;
				}
			}
			if(bRes == false || bCancle == true)
				setList();
			else{
				if(bCancle == true)				return;
				clearInterval(progInterval);
				clearInterval(timeInterval);
				
				callMsgBox('','I', 'ERP 시스템에서 프로젝트코드 발급이 완료되었습니다.<br>TANGO 시스템에 저장되기까지 시간이 다소 소요됩니다.<br>해당 페이지를 닫은 후 새로운 WBS 요소에 대해 프로젝트코드 승인요청이 가능합니다.', function(msgId, msgRst){  

	        		if (msgRst == 'Y') {
	        			bCancle = true;
	        			timeInterval = setInterval(function(){
	        	    		planTime = getTimeText("plan", 0);
	        	    		$("#planTime").html(planTime);
	        	    	},1000);
	        	    	
	        	    	progInterval = setInterval(function(){
	        	    		setProgress();
	        	    	},intervalValue);
	        		}
	        	});
			}
		}
    }
    
    function setList(){

    	showProgress(gridId1);
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpAprvProgStatlist', null, 'GET', 'erpAprvProgStatlist');
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
    		var bRes = true;
    		for(var i = 0 ; i < popList.length; i++){
    			var data = popList[i];
    			
    			if(data.issuProgStatCd == 'W'){
    				bRes = false;
    				break;
    			}
    		}
    		
    		if(bRes == true){
    			
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/clearReq', null, 'GET', 'clearReq');
    		}else{
    			/*ERP승인요청이 완료되지 않았습니다.\n종료 하시겠습니까?*/
	    		callMsgBox('','C', demandMsgArray['noCompleteTryClose'], function(msgId, msgRst){  

	        		if (msgRst == 'Y') {
	        			clearInterval(progInterval);
    					clearInterval(timeInterval);
    					$a.close();
	        		}
	        	});
    		}
    	}    		
    }
});