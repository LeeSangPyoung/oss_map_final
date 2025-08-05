/**
 * ErpPriceList
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    var gridId1 = 'resultGrid1';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	    	
    	if (nullToEmpty(param.demdBizDivNm) != '') {
    		$('#demdBizDivNm').text(param.demdBizDivNm);
    	}
    	if (nullToEmpty(param.demdBizDivDetlNm) != '') {
    		$('#demdBizDivDetlNm').text(param.demdBizDivDetlNm);
    	}
    	if (nullToEmpty(param.bizNm) != '') {
    		$('#bizNm').text(param.bizNm);
    	}
    	if (nullToEmpty(param.trmsDemdMgmtNo) != '') {
    		$('#trmsDemdMgmtNo').text(param.trmsDemdMgmtNo);
    	}
        initGrid();
    	setEventListener();
    	
    	selectErpAprvResultList(param.trmsDemdMgmtNo);
    	
    };
    
  //Grid 초기화
    function initGrid() {
        
        var mapping1 =  [
             { key : 'check', align:'center', width:'50px', title :demandMsgArray['sequence'] /*'순번'*/, numberingColumn : true }
            ,{ key : 'eqpTypNm', align:'left', width:'100px', title : demandMsgArray['eqpLnNm'] }/*'장비/선로.관로'*/
            ,{ key : 'tnPrjId', align:'center', width:'100px', title : demandMsgArray['projectCode']/*'프로젝트코드'*/}
	 		,{ key : 'errMsgCtt', align:'center', width:'450px', title : demandMsgArray['errorContent']
		 	   , render : function(value, data) { 				     
				     if (nullToEmpty(data.sussYn) == "N") {    	            				    	 
				    	 return value;
				     } else {
				    	 return '';
				     }
		 	   }} /*오류내용*/
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
	         ,pager : false
	         ,columnMapping : mapping1
	         
	     });
	        
    };

    function setEventListener() {
    	
    
        
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
	
	//request 성공시
    function successDemandCallback(response, flag){
		bodyProgressRemove();
    	if(flag == 'search'){
    		if(response.list.length == 0){
    			//alertBox('I', demandMsgArray['noInquiryData']);/*'조회된 데이터가 없습니다.'*/
			}
	    	$('#'+gridId1).alopexGrid("dataSet", response.list);
    		
    	}
    }
    
    
    //request 실패시.
    function failDemandCallback(serviceId, response, flag){
		bodyProgressRemove();

    	$('#'+gridId1).alopexGrid("dataEmpty");
		alertBox('W', demandMsgArray['systemError']);

    }
    
    function selectErpAprvResultList(trmsDemdMgmtNo){
    	bodyProgress();
		var dataParam =  $("#searchForm").getData();
		dataParam.trmsDemdMgmtNo = trmsDemdMgmtNo;
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpaprvresultlist', dataParam, 'GET', 'search');
    }
});