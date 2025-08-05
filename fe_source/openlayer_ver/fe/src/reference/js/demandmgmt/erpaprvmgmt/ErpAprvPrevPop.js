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
    	
    	//console.log(id,param);
        setCombo();
        initGrid();
    	setEventListener();
    	
    	//selectErpAprvPrevList();
    	
    };
    
  //Grid 초기화
    function initGrid() {
        
        var mapping1 =  [
	 		{ key : 'intgFcltsNm', align:'center', width:'150px', title : demandMsgArray['transmissionOffice']/*'전송실'*/}
//	 		,{ key : 'trnsCntTotal', align:'center', width:'80px', title : '유선망'}
//	 		,{ key : 'acssCntTotal', align:'center', width:'80px', title : demandMsgArray['accessNetwork'] + '(' + demandMsgArray['total'] + ')'/*'Access망(총)'*/}
//	 		,{ key : 'acssUseCnt', align:'center', width:'80px', title : demandMsgArray['accessNetwork'] + '(' + demandMsgArray['use'] + ')'/*'Access망(사용)'*/}
//	 		,{ key : 'trnsReqCnt', align:'center', width:'80px', title : '유선망'}
	 		,{ key : 'acssReqCnt', align:'center', width:'80px', title : '수량'
	 			,  editable : {  type: 'text'
		        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
		        , styleclass : 'num_editing-in-grid'}
	 		}
	 		
	 		/*,{ key : 'acssReqCnt', align:'center', width:'80px', title : demandMsgArray['accessNetwork'] + '(' + demandMsgArray['req'] + ')''Access망(요청)'
	 			,  editable : {  type: 'text'
		        , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
		        , styleclass : 'num_editing-in-grid'}
	 		}*/
	 		,{ key : 'plntCd', align:'center', width:'80px', title : 'plntCd', hidden : true}
	 		,{ key : 'intgFcltsCd', align:'center', width:'80px', title : 'intgFcltsCd', hidden : true}
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
	         , height : 400
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
	    	//showProgress(gridId1);
	    	 var pageInfo = $('#' + gridId1).alopexGrid("pageInfo");
	    		
        	// 총건수와 현재 페이지건수가 동일하면 조회 종료
        	if(pageInfo.dataLength != pageInfo.pageDataLength){
		    	 bodyProgress();
		    	
		    	$('#pageNo').val(parseInt($('#pageNo').val()) + 1);
	    		$('#rowPerPage').val($('#rowPerPage').val()); 
	    		
		 		var dataParam =  $("#searchForm").getData();  
	
		    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpaprvprevlist', dataParam, 'GET', 'searchForPageAdd');
        	}
	     });
	     
	     $('#'+gridId1).on('dataAddEnd', function(e) {
	    	 $('#'+gridId1).alopexGrid("startEdit");  
	     });
	     
	     
    };

    function setEventListener() {    	

    	$("#pageNo").val(1);
    	$('#rowPerPage').val(20);
    	
    	
    	
    	//AFE 구분 콤보박스
        $('#afeYrPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = this.value;
    		dataParam.flag = 'preApev';
    		
    		selectAfeTsCodeByERP('afeDemdDgrPop', 'N', '', dataParam);
        });
        
        //AFE 차수 콤보박스
        $('#afeDemdDgrPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = this.value;
    		dataParam.flag = 'preApev';
    		
    		selectComboCodeByErp('erpBizDivCdPop', 'N', '', dataParam);
        });
        
      //AFE 차수 콤보박스
        $('#erpBizDivCdPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.flag = 'preApev';
    		
    		selectYearBizComboByErp('demdBizDivCdPop', 'NS', '', dataParam);
        });
        
        
        $('#demdBizDivCdPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.demdBizDivCd = dataParam.demdBizDivCdPop;
    		
    		selectYearBizComboByErp('demdBizDivDetlCdPop', 'NS', '', dataParam);
        });
        
        $('#btn_search').on('click', function(e) {
        	selectErpAprvPrevList();
        });
        
        $('#btn_aprv').on('click', function(e) {
        	sendErpTempPrjId();
        });
        $('#btn_batcdhApplyCount').on('click', function(e) {
        	batcdhApplyCount();
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

    function selectErpAprvPrevList(){
    	
    	//showProgress(gridId1);
    	bodyProgress();
		var dataParam =  $("#searchForm").getData();
		
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/erpaprvprevlist', dataParam, 'GET', 'search');
    }
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};

    function setCombo(){
    	//AFE 구분 콤보박스
    	selectAfeYearCode('afeYrPop', 'N', '');
    	
    	//본부 콤보박스
    	selectComboCode('erpHdofcCdPop', 'N', 'C00623', '');
    	
    	//사업구분
    	//selectYearBizCombo('demdBizDivCdPop', 'Y', '', 'C00618', '', 'TA');
    	
    	//ERP 사업구분
    	//selectComboCode('erpBizDivCdPop', 'N', 'C00618', 'T');
    }
        
    function sendErpTempPrjId(){
    	$('#'+gridId1).alopexGrid("endEdit", { _state : { editing : true }} );
    	var list = AlopexGrid.trimData ( $('#'+gridId1).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
    	listCnt = list.length;
//    	var tempList = "";
    	var maxCnt = 0;
    	var afeYr = $("#afeYrPop").val();
    	var afeDemdDgr = $("#afeDemdDgrPop").val();
    	var erpBizDivCd = $("#erpBizDivCdPop").val();
    	var erpHdofcCd = $("#erpHdofcCdPop").val();
    	var demdBizDivCd = $("#demdBizDivCdPop").val();
    	var demdBizDivDeltCd = $("#demdBizDivDetlCdPop").val();
    	
    	if(listCnt < 1){
    		alertBox('I', demandMsgArray['noReqData']);/*'요청할 데이터가 없습니다.'*/
    		$('#'+gridId1).alopexGrid("startEdit");
    		return false;
    	}else{
    		var detailCnt = 0;
    		for(var i=0;i<listCnt;i++){
    			var data = list[i];
    			var trnsReaCnt = data.trnsReqCnt;
    			var acssReqCnt = data.acssReqCnt;
    			detailCnt += trnsReaCnt + acssReqCnt;
    		}
    		if(maxCnt < trnsReaCnt) maxCnt = trnsReaCnt;
    		if(maxCnt < acssReqCnt) maxCnt = acssReqCnt;
    		
//    		tempList += "plntCd" + data.plntCd + ",";
//    		tempList += "intgFcltsCd" + data.intgFcltsCd + ",";
//    		tempList += "acssReqCnt" + data.acssReqCnt + ",";
//    		if(i< (listCnt-1)) tempList +="|";
    		
    		if(detailCnt < 1){
    			alertBox('I', demandMsgArray['noReqData']);/*'요청할 데이터가 없습니다.'*/
    			$('#'+gridId1).alopexGrid("startEdit");
    			return false;
    		}
    		
    	}
    	
    	var dataParam = {
    			tempYn 		: "Y",
    			aprvAllYn 	: "N",
    			/*tempList	: JSON.stringify(list),*/
    			/*gridData	: list,*/
    			afeYr		: afeYr,
    			afeDemdDgr	: afeDemdDgr,
    			maxCount	: maxCnt,
    			erpBizDivCd : erpBizDivCd,
    			erpHdofcCd : erpHdofcCd,
    			demdBizDivCd : demdBizDivCd,
    			demdBizDivDeltCd : demdBizDivDeltCd
    			
    	};
    	dataParam.gridData = { 
    			tempList : list
		};
    	
    	/*if(confirm("전송망 수요를 승인하시겠습니까?")){
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/upsertErpAprv', dataParam, 'POST', 'upsertErpAprv');
    	}*/
    	
    	/*"임시 프로젝트 코드에 대한 시설계획 업로드를 진행 하시겠습니까?"*/
    	callMsgBox('','C', '선발급 프로젝트 코드에 대한 시설계획 업로드를 진행 하시겠습니까?', function(msgId, msgRst){  

    		if (msgRst == 'Y') {
    			bodyProgress();   
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/upsertErpAprv', dataParam, 'POST', 'upsertErpAprv');
    		} else {
    			$('#'+gridId1).alopexGrid("startEdit");
    		}
    	});
    }
    
    function batcdhApplyCount(){
		var batchApplyCount = $("#batchApplyCount").val();
		if (nullToEmpty(batchApplyCount) == '') {
			alertBox('W', makeArgMsg('requiredInputObject', demandMsgArray['issueReqBatchApply']));/*'{0}을(를) 입력하세요.'*/
    		return false;
		}
    	if (number_format(batchApplyCount) > 100) {
    		alertBox('W', makeArgMsg('canotSpecialCount', demandMsgArray['issueReqBatchApply'], '100'));/*'{0}은 {1}을(를) 초과할 수 없습니다.'*/
    		return false;
    	}
    	var list = AlopexGrid.trimData ( $('#'+gridId1).alopexGrid("dataGet"));
    	if(list.length > 0){
    		for(var i= 0;i<list.length;i++){
    			$('#'+gridId1).alopexGrid("cellEdit", batchApplyCount, { _index : { row : i }},  "trnsReqCnt");
    			$('#'+gridId1).alopexGrid("cellEdit", batchApplyCount, { _index : { row : i }},  "acssReqCnt");
    		}
    	}else{
    		alertBox('W', demandMsgArray['noApplyData']);/*'적용할 데이터가 없습니다.'*/
    		return false;
    	}
    	
    }
    
    function sendErpAprv(){
    	bodyProgressRemove();
    	$a.close("OK");    	
    }
  //request 성공시
    function successDemandCallback(response, flag){
    	//console.log(response);
    	if(flag == 'search'){
    		//console.log(response);
			var serverPageinfo;
    		
	    	if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	    	      	};
	    	}
	    	bodyProgressRemove();
			//hideProgress(gridId1);
			if(response.list.length == 0){
	    		//alertBox('I', demandMsgArray['noInquiryData']);/*'조회된 데이터가 없습니다.'*/
	    	}
	    	
	    	$('#'+gridId1).alopexGrid("dataSet", response.list, serverPageinfo);
	    	$('#'+gridId1).alopexGrid("startEdit");
    		
    	}
    	if(flag == 'searchForPageAdd'){
    		var serverPageinfo;
    		
	    	if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	    	      	};
	    	}

			//hideProgress(gridId1);
	    	bodyProgressRemove();
			
    		/*if(response.list.length == 0){
    			alertBox('I', demandMsgArray['noInquiryData']);'조회된 데이터가 없습니다.'
			}else{
	    		$('#'+gridId1).alopexGrid("dataSet", response.list);
			}*/
			if(response.list.length == 0){
				//alertBox('I', demandMsgArray['noMoreData'] );/*더 이상 조회될 데이터가 없습니다.*/
	    	}
	    	
	    	$('#'+gridId1).alopexGrid("dataAdd", response.list, serverPageinfo);	
    	}
    	
    	var nStart = new Date().getTime();
    	if(flag == 'upsertErpAprv'){
    		switch (response.result.resultMsg.pro){
    		case "OK" :
    			var nEnd = new Date().getTime();
    			var nDiff = nEnd - nStart;
    			nStart = new Date().getTime();
    			nEnd = new Date().getTime();
    			nDiff = nEnd - nStart;
    			
    			sendErpAprv();
    			
    			break;
    		case "FAIL" :
        		bodyProgressRemove();
        		alertBox('W', response.message);
    			break;
    		case "ERROR" :
        		bodyProgressRemove();
        		alertBox('W', response.message);
    			break;
    		default :
    			break;
    		}
    	}
    	
    }
    
    
    //request 실패시.
    function failDemandCallback(response, flag){
		bodyProgressRemove();
		if (flag == 'search') {
			alertBox('W', demandMsgArray['searchFail']);
		} else {
			if (nullToEmpty(response.message) != '' && response.message != 'undefined') {		
				alertBox('W', response.message);
			} else {
				alertBox('W', demandMsgArray['systemError']);
			}
		}

    }
    
});