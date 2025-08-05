/**
 * EmailSendAddBpUserPop
 *
 * @author park. i. h.
 * @date 2017.10.30
 * @version 1.0
 */

var bpUserPopGrid = "bpUserPopGrid";
var searchDiv = "BP";
$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(nullToEmpty(param.searchDiv) !=""){
    		searchDiv = nullToEmpty(param.searchDiv);
    	}
    	setSelectCode();
        setEventListener();      
    	initGrid();
    	
    };


    //Grid 초기화
    function initGrid() {
    	
        //그리드 생성
        $('#' + bpUserPopGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false, 
			height : 320,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [{ selectorColumn : true, width : '50px' } 
		    , {key : 'sndObjDivNm'	   	,title : cflineMsgArray['sendObject'] /*  발송대상 */       		,align:'center', width: '60px'}
		    , {key : 'mgmtGrpNm'	   	,title : cflineMsgArray['managementGroup'] /*  관리그룹 */       		,align:'center', width: '60px'}
		    , {key : 'orgNm'	   		,title : cflineCommMsgArray['team'] /* 팀  */	       		,align:'center', width: '120px'}
		    , {key : 'bpNm'	   			,title : 'BP' /*  BP */        		,align:'center', width: '120px'}
		    , {key : 'userId'	   		,title : 'ID' /*  ID */        		,align:'center', width: '100px'}
		    , {key : 'userNm'	   		,title : cflineMsgArray['fullName'] /*  이름 */       		,align:'center', width: '100px'}
			]}); 

      
    };    
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {    	
    };
    function setEventListener() {
    	// 조회 
		$('#btnPopUserSearch').on('click', function(e) {
			var bpNmVal = nullToEmpty($('#bpNmPop').val());
			var userNmVal = nullToEmpty($('#userNmPop').val());
			
			if(bpNmVal == "" && userNmVal == ""){
    			alertBox('I', makeArgMsg('required', cflineMsgArray['recipientName']));  /* [{0}] 필수 입력 항목입니다.*/
				return;
			}
			if(bpNmVal != "" && bpNmVal.length < 2){
    			alertBox('I', makeArgMsg('minLengthPossible', 'BP'+cflineMsgArray['shortName'], 2));  /* {0} 항목은 {1}이상 입력가능합니다. */
				return;
				
			}
			if(userNmVal != "" && userNmVal.length < 2){
    			alertBox('I', makeArgMsg('minLengthPossible', cflineMsgArray['recipientName'], 2));  /* {0} 항목은 {1}이상 입력가능합니다. */
				return;
				
			}
			var paramBpData = {"bpNm":bpNmVal, "userNm":userNmVal,"searchDiv":searchDiv};
			//console.log(paramBpData);
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/lnocrrtrate/bpuserlist', paramBpData, 'GET', 'bpUserSearch');
        });
    	$('#userNmPop').on('keydown',function(e){
    		if (e.which == 13  ){
    			$('#btnPopUserSearch').click();
    			return false;
    		}
    	});
    	$('#bpNmPop').on('keydown',function(e){
    		if (e.which == 13  ){
    			$('#btnPopUserSearch').click();
    			return false;
    		}
    	});
		// 취소
		$('#btnPopBpClose').on('click', function(e) {
			$a.close();
        });
		
		// 확인
		$('#btnPopBpConfirm').on('click', function(e) {
        	var dataList = $('#' + bpUserPopGrid).alopexGrid('dataGet', {_state:{selected:true}});
        	if (dataList == null || dataList.length == 0) {
    			alertBox('I', cflineMsgArray['selectNoData']);  /* 선택된 데이터가 없습니다. */
        		return;
        	}        	
        	
        	if(searchDiv=="U" && dataList.length > 1){
    			alertBox('I', cflineMsgArray['selectOnlyOneItem']);  /* 여러개가 선택되었습니다. 하나만 선택하세요. */
        		return;
        	}
        	var user_data =  [];
        	var arrVal = "";
        	for(var i =0; i < dataList.length; i++){
        		var tmpData = dataList[i]
        		arrVal = {"sndObjDiv":tmpData.sndObjDiv,"sndObjDivNm":tmpData.sndObjDivNm,"userId":tmpData.userId,"userNm":tmpData.userNm
        				,"orgId":tmpData.orgId,"orgNm":tmpData.orgNm,"mgmtGrpNm":tmpData.mgmtGrpNm,"bpId":tmpData.bpId,"bpNm":tmpData.bpNm};
        		user_data.push(arrVal);
        	}
        	$a.close(user_data);        	
        });
    	
	};	
	

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
    	// BP 사용자 조회 
    	if(flag == 'bpUserSearch'){
    		cflineHideProgressBody();
	    	$('#' + bpUserPopGrid).alopexGrid("dataSet", response);
    	} 
    	
	};
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'bpUserSearch'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
	};
	

});
