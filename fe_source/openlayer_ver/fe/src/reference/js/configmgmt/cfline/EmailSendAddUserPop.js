/**
 * EmailSendAddUserPop
 *
 * @author park. i. h.
 * @date 2017.10.30
 * @version 1.0
 */

var teamGrid = "teamGrid";
var userGrid = "userGrid";
var targetGrid = "targetGrid";
var teamCodeData = [];  // 팀 코드 데이터 
var orgIdVal = "";
var mgmtGrpSelVal = "0002";

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	setSelectCode();
        setEventListener();      
    	initGrid();
    	
    };


    //Grid 초기화
    function initGrid() {
    	
        //그리드 생성
        $('#' + teamGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false,  
//        	rowInlineEdit : true, //행전체 편집기능 활성화
    		enableDefaultContextMenu:false,
    		enableContextMenu:true,
    		pager:false,
			height : 160,	     
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [ { selectorColumn : true, width : '50px' } 
				, {key : 'orgNm'					,title : cflineCommMsgArray['team'] /*  팀  */ ,align:'center', width: '120px'}                                                                                  
			]}); 

        //그리드 생성
        $('#' + userGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false, 
    		pager:false,   		
			height : 160,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [{ selectorColumn : true, width : '50px' } 
		        , {key : 'orgNm'	              	,title : cflineCommMsgArray['team'] /* 팀  */			,align:'center', width: '120px'}
		        , {key : 'userId'	              	,title : 'ID' /*  ID */                 ,align:'left'  , width: '100px'}
		        , {key : 'userNm'	        ,title : cflineMsgArray['recipient'] /* 수신자 */			,align:'center', width: '100px'}    
			]}); 
        //그리드 생성

        //그리드 생성
        $('#' + targetGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false, 
    		pager:false,   		
			height : 320,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [{ selectorColumn : true, width : '50px' } 
		    , {key : 'seq'	   	,title : '순번'       		,align:'center', width: '80px', hidden: true}
		    , {key : 'sndObjDivNm'	   	,title : cflineMsgArray['sendObject'] /*  발송대상 */       		,align:'center', width: '80px'}
		    , {key : 'mgmtGrpNm'	   	,title : cflineMsgArray['managementGroup'] /*  관리그룹 */       		,align:'center', width: '120px'}
		    , {key : 'orgNm'	   		,title : cflineCommMsgArray['team'] /* 팀  */	       		,align:'center', width: '120px'}
		    , {key : 'userId'	   		,title : 'ID' /*  ID */        		,align:'center', width: '100px'}
		    , {key : 'userNm'	   		,title : cflineMsgArray['fullName'] /*  이름 */       		,align:'center', width: '100px'}
			]}); 

      
    };    
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'mgmtGrpCdList');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/teamlist', null, 'GET', 'teamCdList');
    	var param = {"searchDiv":"L"};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/mailtargetlist', param, 'GET', 'targetDataList');
    	
    };
    function setEventListener() {

     	// 관리그룹 클릭시
     	$('#mgmtGrpCdPop').on('change',function(e){
     		var mgmtGrpVal = $('#mgmtGrpCdPop').val();
     		orgIdVal = "";
     		if(nullToEmpty(mgmtGrpVal) != ""){
        		var teamCd_option_data =  [];
        		if(teamCodeData != null){
    	    		for(k=0; k<teamCodeData.length; k++){
    	    			var dataTeam = teamCodeData[k];  
    	    			if(mgmtGrpVal == dataTeam.mgmtGrpCd){
    	    				teamCd_option_data.push(dataTeam);
    	    			}
    	    		}
    	    		$('#' + teamGrid).alopexGrid("dataSet", teamCd_option_data);
        		}
     			
     		}
       	}); 
     
		// 팀 목록 그리드 클릭시
		$('#' + teamGrid).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var selectedId = $('#' + teamGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	
        	if (data == null) {
        		return false;
        	}
        	if(orgIdVal == "" || orgIdVal != data.orgId){
        		orgIdVal = data.orgId; 
            	var paramData = {"orgId" : orgIdVal};
            	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/userlist', paramData, 'GET', 'userDatalist');
        	}
        });     
	    

		// 팀 추가 버튼 클릭 
		$('#btnTeamAddPop').on('click', function(e) {
        	var dataList = $('#' + teamGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	if (dataList == null || dataList.length == 0) {
    			alertBox('I', cflineMsgArray['selectNoData']);  /* 선택된 데이터가 없습니다. */
        		return;
        	}        	
        	var teamCd_data =  [];
        	var arrVal = "";
        	for(var i =0; i < dataList.length; i++){
        		var tmpData = dataList[i]
        		arrVal = {"sndObjDiv":tmpData.sndObjDiv,"sndObjDivNm":tmpData.sndObjDivNm
        				,"orgId":tmpData.orgId,"orgNm":tmpData.orgNm,"mgmtGrpNm":tmpData.mgmtGrpNm};
        		teamCd_data.push(arrVal);
        	}
        	addRow(teamCd_data, '01');
		});
		// 사용자 추가 버튼 클릭 
		$('#btnUserAddPop').on('click', function(e) {
        	var dataList = $('#' + userGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	if (dataList == null || dataList.length == 0) {
    			alertBox('I', cflineMsgArray['selectNoData']);  /* 선택된 데이터가 없습니다. */
        		return;
        	}        	   	
        	var user_data =  [];
        	var arrVal = "";
        	for(var i =0; i < dataList.length; i++){
        		var tmpData = dataList[i]
        		arrVal = {"sndObjDiv":tmpData.sndObjDiv,"sndObjDivNm":tmpData.sndObjDivNm,"userId":tmpData.userId,"userNm":tmpData.userNm
        				,"orgId":tmpData.orgId,"orgNm":tmpData.orgNm,"mgmtGrpNm":tmpData.mgmtGrpNm};
        		user_data.push(arrVal);
        	}
//        	console.log(user_data);
        	addRow(user_data, '02');
		});
		// 발송대상 삭제 버튼 클릭 
		$('#btnTargetDelPop').on('click', function(e) {
        	var dataList = $('#' + targetGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	if (dataList == null || dataList.length == 0) {
    			alertBox('I', cflineMsgArray['selectNoData']);  /* 선택된 데이터가 없습니다. */
        		return;
        	}        	
        	removeRow();
		});
		
		// BP 사용자 추가 버튼 클릭 
		$('#btnBpUserAddPop').on('click', function(e) {
			cflineShowProgressBody();
    		$a.popup({
    		  	popid: "popBpUserAdd",
    		  	title: cflineMsgArray['addRecipient'] /* 수신자추가  */,
    			url:  "/tango-transmission-web/configmgmt/cfline/EmailSendAddBpUserPop.do",
    			data: null,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 1000,
    			height : 600,
    			callback:function(data){
		    		cflineHideProgressBody();
					if(data != null){
			    		//console.log(data);	
			    		 addRow(data, '02'); // 행 추가
					}
					$.alopex.popup.result = null;
    			}
    		});  
		});

		// 취소
		$('#btnPopClose').on('click', function(e) {
			$a.close();
        });
		
		// 저장
		$('#btnPopSave').on('click', function(e) {
        	var dataList = $('#' + targetGrid).alopexGrid('dataGet');
        	//console.log(dataList);
        	if (dataList == null || dataList.length == 0) {
    			alertBox('I', cflineMsgArray['noData']);  /* 데이터가 없습니다. */
        		return;
        	}        	
    		
			callMsgBox('btnPopSave', 'C', cflineMsgArray['save'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					cflineShowProgressBody();
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/saveuser', dataList, 'POST', 'saveuser');
				}
			});	        	
        	
        });
    	
	};	
	

    // 행 추가
    function addRow(data, gubun) {
    	//<input type="checkbox" name="alopexgrid681" class="selector-checkbox selector-column-input">

    	var dataList = $('#' + targetGrid).alopexGrid('dataGet');
//    	console.log(data);
//    	console.log(dataList);
    	
    	
    	if (data != null || data.length > 0) {
			for(var k=0; k<data.length; k++){
				var tmpData = data[k];
				var chkCnt = 0;
				if (data != null || data.length > 0) {
					for(var i=0; i<dataList.length; i++){
						var targetData = dataList[i];
						if(gubun == targetData.sndObjDiv && "01" == gubun){  // 팀추가 
		    				if(tmpData.orgId == targetData.orgId){
		    					chkCnt = 1;
		    					break;
		    				}
		    			}else if(gubun == targetData.sndObjDiv && "02" == gubun){  // 사용자 추가
					    	//console.log("gubun : " + gubun);
					    	//console.log("tmpData.userId : " + tmpData.userId);
					    	//console.log("targetData.userId : " + targetData.userId);
		    				if(tmpData.userId == targetData.userId){
		    					chkCnt = 1;
		    					break;
		    				}
		    			}
	    			}
				}
    			if(chkCnt == 0){
    				$('#'+targetGrid).alopexGrid("dataAdd", tmpData);
    			}
    		}
    	}
    	

    }
    // 행 삭제 
    function removeRow() {
    	var dataList = $('#' + targetGrid).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.row;
    		$('#'+targetGrid).alopexGrid("dataDelete", {_index : { data:rowIndex }});
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
    	// 관리 그룹  teamCdList
    	if(flag == 'mgmtGrpCdList'){
			$('#mgmtGrpCdPop').clear();
			$('#mgmtGrpCdPop').setData({data : response});	
			$('#mgmtGrpCdPop').setSelected(mgmtGrpSelVal);	
    	}
    	// 작업, 회선 목록 조회  jobReqList lineList 
    	if(flag == 'teamCdList'){
    		$('#' + userGrid).alopexGrid("dataSet", null);
    		var teamCd_option_data =  [];
    		if(response != null){
    			teamCodeData = response;
    			//console.log(teamCodeData);
    			//console.log(mgmtGrpSelVal);
	    		for(k=0; k<teamCodeData.length; k++){
	    			var dataTeam = teamCodeData[k];  

	    			if(mgmtGrpSelVal == dataTeam.mgmtGrpCd){
	    				teamCd_option_data.push(dataTeam);
	    			}
	    		}
	    		$('#' + teamGrid).alopexGrid("dataSet", teamCd_option_data);
    		}
    	} 
    	// 저장
    	if(flag == 'saveuser'){
    		cflineHideProgressBody();
    		if(response != null){
    			var returnData = null;
    			if(response.Result == "Success"){
    				returnData = response;
    			}
    			$a.close(returnData);
    		}else{
        		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		}
    	} 
    	
    	
    	if(flag == 'userDatalist'){
    		$('#' + userGrid).alopexGrid("dataSet", response);
    	}
    	if(flag == 'targetDataList'){
    		$('#' + targetGrid).alopexGrid("dataSet", response.eamilList);
    	}
    	
	};
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'mgmtGrpCdList'){
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
    	// 저장
    	if(flag == 'saveuser'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */    		
    	}
	};
	

});
