/**
 * ExcelDownloadPop
 *
 * @author P095783
 * @date 2017. 01. 12. 
 * @version 1.0
 */
var gridId = 'pwEvclistGrid';

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        setEventListener();
        setSelectCode(param);
        initGrid();
    };    
    
    
  	//Grid 초기화
    function initGrid() {
		var mapping = [
			{
				key : 'mgmtGrpCdNm',
				align:'center',
				width:'80px',
				title : cflineMsgArray['managementGroup'] 	/* 관리그룹 */
			}
    		, {
				key : 'vlanVal',
				align:'center',
				width:'80px',
				title : 'VLAN'
			}
    		, {
				key : 'topoSclName',
				align:'center',
				width:'50px',
				title : cflineMsgArray['division'] /* 구분 */
			}
    		, {
				key : 'pktTrkNm',
				align:'center',
				width:'150px',
				title : cflineMsgArray['pwEvcName'] /*  PW/EVC명  */
			}
    		, {
				key : 'eqpNm',
				align:'center',
				width:'200px',
				title : cflineMsgArray['equipmentName'] /* 장비명 */
			}
    		, {
				key : 'eqpPortVal',
				align:'center',
				width:'80px',
				title : 'Drop Port'
			}
    		, {
				key : 'eqpMdlNm',
				align:'center',
				width:'80px',
				title : cflineMsgArray['modelName']  /* 모델명 */
			}
    		, {
				key : 'ringOneName',
				align:'center',
				width:'80px',
				title : 'Ring#1'
			}
    		, {
				key : 'ringTwoName',
				align:'center',
				width:'80px',
				title : 'Ring#2'
			}
		];
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	columnMapping : mapping,
        	pager : false,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : true,
			rowSingleSelect : true,
			numberingColumnFromZero : false,
			height : 350,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineMsgArray['noInquiryData'],
				filterNodata : 'No data'
			}
        });
        
      //그리드 행 클릭 이벤트
		$('#'+gridId).on("click",'.bodycell', function(e){
			
		});
    };
    
    function searchList(){
    	
    	var vlanId = $('#vlanIdPop').val();
		if(nullToEmpty(vlanId) == ""){
			$('#vlanIdPop').focus();
			alertBox('W', makeArgCommonMsg("required", "VLAN"));/* [{0}] 필수 입력 항목입니다. */
     		return;
		}
		cflineShowProgress(gridId);
		var dataParam = $('#searchForm').getData();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getpwevclist', dataParam, 'GET', 'searchList');
    }
    
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode(data) {
    	$('#vlanIdPop').val(data.vlanId);
    	$('#pktTrkNmPop').val(data.pktTrkNm);
    }
    
    function setEventListener() {
    	$('#btnSearchPwEvc').on('click', function(e) {
    		searchList();
		});
    	
      	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
      	 	var dataObj = AlopexGrid.parseEvent(e).data;
      	 	$a.close(dataObj);
    	 });
	};


	//request 성공시
    function successCallback(response, flag){ 
    	if (flag == 'searchList') {
    		cflineHideProgress(gridId);
    		$('#'+gridId).alopexGrid("dataSet", response.PwEvcList);
	    }
    }
    //request 실패시.
    function failCallback(response, flag){
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