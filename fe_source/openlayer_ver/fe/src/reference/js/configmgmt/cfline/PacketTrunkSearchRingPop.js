/**
 * PacketTrunkSearchRingPop.js
 *
 * @author P123512
 * @date 2018.06.21
 * @version 1.0
 */
var gridId = 'gridIdPop';
var paramData = null;

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#title').text("패킷트렁크 - 링명 검색");
    	paramData = param;
        setEventListener();
        initGrid();
        searchList();
    };
    
  	//Grid 초기화
    function initGrid() {
    	var columnMapping = [
    	                      {key : 'mtsoNm',			align:'center',			width:'130px',		title : cflineMsgArray['transmissionOffice']	/* 전송실 */}
    	         			, {key : 'mgmtGrpCdNm',			align:'center',			width:'120px',		title : cflineMsgArray['managementGroup']			/* 관리그룹 */}
    	         			, {key : 'ntwkLineNm',			align:'left',			width:'230px',		title : cflineMsgArray['ringName'] 						/* 링명 */	}
    	         			, {key : 'ntwkCapaCdNm',			align:'center',			width:'100px',		title : cflineMsgArray['capacity'] 						/* 용량 */ }
     	]
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	columnMapping : columnMapping,
        	pager : true,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : true,
			rowSingleSelect : true,
			numberingColumnFromZero : false,
			height : 300,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
				filterNodata : 'No data'
			}
        });
    };
    

    function searchList(){
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getNtwkRingList', paramData, 'GET', 'getNtwkRingList');
    }
    
    function setEventListener() {
       //닫기
       $('#btnCnclPop').on('click', function(e) {
    	   $a.close();
       });
       
       //선택
       $('#selectBtn').on('click', function(e) {
    	   var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
    	   var data =[{
	              "ntwkLineNo" : dataList[0].ntwkLineNo
	              ,"ntwkLineNm" : dataList[0].ntwkLineNm
	   			  }
	              ]
    	   $a.close(data);
       });
       
       // 셀 더블클릭시 선택
       $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	   var dataObj = AlopexGrid.parseEvent(e).data;
    	   var dataKey = dataObj._key;
    	   var data =[{
    	              "ntwkLineNo" : dataObj.ntwkLineNo
    	              ,"ntwkLineNm" : dataObj.ntwkLineNm
    	   			  }
    	              ]
    	   $a.close(data);
       });
	};

	//request 성공시
    function successCallback(response, flag){ 
    	if (flag == 'getNtwkRingList') {
			$('#'+gridId).alopexGrid('dataSet', response.list );
			cflineHideProgressBody();
    	}
    }
    //request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getNtwkRingList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }
});