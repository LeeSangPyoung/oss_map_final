/**
 * AddApprovalAdmin
 *
 * @author 
 * @date 2017.12.03
 * @version 1.0
 */

var teamGrid = "teamGrid";
var userGrid = "userGrid";
var targetGrid = "targetGrid";
var teamCodeData = [];  // 팀 코드 데이터 
var orgIdVal = "";
var mgmtGrpSelVal = "0001";

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	setSelectList();
        setEventListener();      
    	initGrid();

    };


    //Grid 초기화
    function initGrid() {
    	
        // 팀 그리드 생성
        $('#' + teamGrid).alopexGrid({
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
			columnMapping: [ {key : 'orgNm'					,title : cflineCommMsgArray['team'] /*  팀  */ ,align:'center', width: '120px'} ]
			}); 

        
        // 구성원 그리드 생성
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
		        , {key : 'userNm'	        ,title : cflineMsgArray['fullName'] /*  이름 */			,align:'center', width: '100px'}    
			]}); 

        
        // 승인자목록 그리드 생성
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
		    , {key : 'mgmtGrpNm'	   	,title : cflineMsgArray['managementGroup'] /*  관리그룹 */       		,align:'center', width: '120px'}
		    , {key : 'orgNm'	   		,title : cflineCommMsgArray['team'] /* 팀  */	       		,align:'center', width: '120px'}
		    , {key : 'userId'	   		,title : 'ID' /*  ID */        		,align:'center', width: '100px'}
		    , {key : 'userNm'	   		,title : cflineMsgArray['fullName'] /*  이름 */       		,align:'center', width: '100px'}
			]}); 

      
    };    
    
    // 처음 로딩시 관리그룹과 팀, 승인자 목록을 가져온다.
    function setSelectList() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'mgmtGrpCdList');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/teamlist', null, 'GET', 'teamCdList');
    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lineaprvuser/teamlist', null, 'GET', 'teamCdList');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lineaprvuser/aprvuserlist', null, 'GET', 'targetDataList');
    	
    };
    
    function setEventListener() {

     	// 관리그룹 클릭시
     	/*$('#mgmtGrpCd').on('change',function(e){
     		$('#' + userGrid).alopexGrid("dataEmpty");
     		var mgmtGrpVal = $('#mgmtGrpCd').val();
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
       	}); */
     
     	
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
            	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lineaprvuser/getTeamUserList', paramData, 'GET', 'userDatalist');
        	}
        });     
		
		
		// 승인자 추가 버튼 클릭 
		$('#btnUserAddPop').on('click', function(e) {
        	var dataList = $('#' + userGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	if (nullToEmpty(dataList) == "") {
    			alertBox('I', cflineMsgArray['selectNoData']);  /* 선택된 데이터가 없습니다. */
        		return;
        	}
        	
        	var user_data =  [];
        	var arrVal = "";
        	
        	for(var i =0; i < dataList.length; i++){
        		var tmpData = dataList[i]
        		arrVal = { "userId":tmpData.userId, "userNm":tmpData.userNm, "orgId":tmpData.orgId, "orgNm":tmpData.orgNm, "mgmtGrpNm":tmpData.mgmtGrpNm };
        		user_data.push(arrVal);
        	}
        	addRow(user_data);
		});
		
		
		// 승인자 삭제 버튼 클릭 
		$('#btnTargetDelPop').on('click', function(e) {
        	var dataList = $('#' + targetGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	if (dataList == null || dataList.length == 0) {
    			alertBox('I', cflineMsgArray['selectNoData']);  /* 선택된 데이터가 없습니다. */
        		return;
        	}        	
        	removeRow();
		});
		

		// 취소
		$('#btnPopClose').on('click', function(e) {
			$('#'+targetGrid).alopexGrid("dataDelete", {_state: {added: true}});
        });
		
		
		// 저장
		$('#btnPopSave').on('click', function(e) {
			var updateList = [];
        	var addList = $('#' + targetGrid).alopexGrid('dataGet', {_state: {added: true}});
        	var delList = $('#' + targetGrid).alopexGrid('dataGet', {_state: {deleted: true}});
        	
        	if ( addList.length > 0 ) {
        		for( var i = 0; i < addList.length; i++ ) {
        			addList[i].useYn = 'Y';
        			addList[i].lineAprvWorkDivVal = 'T';
        			updateList.push(addList[i]);
        		}
        	}
        	
        	if ( delList.length > 0 ) {
        		for( var i = 0; i < delList.length; i++ ) {
        			delList[i].useYn = 'N';
        			delList.lineAprvWorkDivVal = 'T';
        			updateList.push(delList[i]);
        		}
        	}
        	
        	if ( updateList.length > 0 ) {
        		callMsgBox('btnPopSave', 'C', cflineMsgArray['save'], function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					cflineShowProgressBody();
    					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lineaprvuser/saveuser', updateList, 'POST', 'saveuser');
    				}
    			});	  
        	}
        	else {
        		alertBox('I', cflineMsgArray['noChangedData']);	/* 변경된 내용이 없습니다. */
        		return;
        	}      	
        });
    	
	};	
	

    // 행 추가
    function addRow(data) {
    	var dataList = $('#' + targetGrid).alopexGrid('dataGet');
    	
    	if (data != null || data.length > 0) {
			for(var k=0; k<data.length; k++){
				var tmpData = data[k];
				var chkCnt = 0;
				if (data != null || data.length > 0) {
					for(var i=0; i<dataList.length; i++){
						var targetData = dataList[i];
						
	    				if(tmpData.userId == targetData.userId) {
	    					chkCnt = 1;
	    					break;
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
    
    // 저장 후 재조회
    function targetGridReload() {
    	cflineShowProgress(targetGrid);
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lineaprvuser/aprvuserlist', null, 'GET', 'targetDataList');
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
    	// 관리 그룹  
    	if(flag == 'mgmtGrpCdList'){
			$('#mgmtGrpCd').clear();
			$('#mgmtGrpCd').setData({data : response});	
			$('#mgmtGrpCd').setSelected(mgmtGrpSelVal);	
			$('#mgmtGrpCd').attr('disabled', 'true');
    	}
    	
    	// 관리 팀
    	if(flag == 'teamCdList'){
    		//$('#' + userGrid).alopexGrid("dataSet", null);
    		$('#' + userGrid).alopexGrid("dataEmpty");
    		//$('#' + teamGrid).alopexGrid("dataSet", response);
    		var teamCd_option_data =  [];
    		if(response != null){
    			teamCodeData = response;
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
    			if(response.Result == "SUCCESS"){
    				callMsgBox('', 'I', cflineMsgArray['saveSuccess'], function() {
    					targetGridReload();
    				});
    			}
    		}else{
        		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		}
    	} 
    	
    	
    	if(flag == 'userDatalist'){
    		$('#' + userGrid).alopexGrid("dataSet", response);
    	}
    	
    	if(flag == 'targetDataList'){
    		cflineHideProgress(targetGrid);
    		$('#' + targetGrid).alopexGrid("dataSet", response);
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
