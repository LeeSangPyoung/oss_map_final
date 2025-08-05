/**
 * OmsSvlnLnoListPop.js
 *
 * @author Administrator
 * @date 2018. 11. 12
 * @version 1.0
 */

var popGirdId = "popLineGrid";
var popLnoGirdId = "popLineLnoGrid";

var paramData = null;

$a.page(function() {

    this.init = function(id, popParam) {
//    	if (! jQuery.isEmptyObject(popParam) ) {
//			paramData = popParam;
//		}
    	paramData = popParam;
        setEventListener();   
        initGridPop();      
    	searchList(paramData) 
    };
   
    //TopGrid 초기화
    function initGridPop() {
    	var mappingColumn = [ { selectorColumn : true, width : '50px' } 
    	                       	, {key : 'jobTypeNm'	   	,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '80px'}
    	                       	//, {key : 'jobTitle'	              	,title : cflineMsgArray['workName'] /*  작업명 */                 ,align:'left'  , width: '120px'}
    	               			, {key : 'lineNm'	       			 ,title : cflineMsgArray['lnNm'] /*  회선명 */			,align:'center', width: '340px'}
    	               			, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '100px'}
    	               			, {key : 'svlnLclCdNm'	            ,title : cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '140px'}
    	               			, {key : 'svlnSclCdNm'	            ,title : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '140px'}
    	            		];
        //그리드 생성 
        $('#'+popGirdId).alopexGrid({
        	columnMapping : mappingColumn,
			cellSelectable : false,
			pager : false,
			rowClickSelect : true,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 180,
			message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		}
        });

        
    	var mappingLnoColumn = [ { selectorColumn : true, width : '50px' } 
						, {key : 'svlnNo',			title : cflineMsgArray['serviceLineNumber'] /*  서비스회선번호 */,	align:'center', width:'100px', hidden:true}
			       		, {key : 'jobDivNm',		title : cflineMsgArray['workDivision'] /*  작업구분 */,	align:'center', width:'80px'}
						, {key : 'useLineNm',			title : cflineMsgArray['serviceLineName'] /*  서비스회선명 */,		align:'center', width:'200px'}
						, {key : 'trkNtwkLineNm',	title : cflineMsgArray['trunk'] /*  트렁크 */,				align:'center', width:'200px'}
	                    , {key : 'ringNtwkLineNm', 	title : cflineMsgArray['ring'] /*  링 */, 				align:'center', width:'200px'}
	                    , {key : 'eqpNm',			title : cflineMsgArray['equipmentName'],				align:'center', width:'140px'}
	                    , {key : 'aportNm', 		title : "APORT", 										align:'center', width:'120px'}
	                    , {key : 'bportNm', 		title : "BPORT", 										align:'center', width:'120px'}
					];
		//그리드 생성 
		$('#'+popLnoGirdId).alopexGrid({
			columnMapping : mappingLnoColumn,
			cellSelectable : false,
			pager : false,
			rowClickSelect : true,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 350,
			message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
				}
		});
    };
    
    function setEventListener() {
    	//	취소
    	$('#btnPopClose').on('click', function(e) {
    		$a.close(null);
	   	});   	

    	// 적용 버튼 - 노드 선번 조회 호출
    	$('#btnAddLnoRow').on('click', function(e) {
    		if( $('#'+popGirdId).length == 0){
    			return;
    		}
    			
    		var dataList = $('#'+popGirdId).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}

    		var paramList = [];
			for(i=0;i<dataList.length;i++){
				var voData = {"svlnNo": dataList[i].svlnNo, "jobType": dataList[i].jobType, "lineNm": dataList[i].lineNm};
				paramList.push(voData);
			}
    		var paramUsing = {"tmofCd" : paramData.tmofCdVal, "lineList": paramList};    		
    		searchLno(paramUsing);
	   	});    	

    	// 행삭제 버튼 
    	$('#btnDelPopGrid').on('click', function(e) {
    		if( $('#'+popLnoGirdId).length == 0){
    			return;
    		}
    			
    		var dataList = $('#'+popLnoGirdId).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}
			$('#'+popLnoGirdId).alopexGrid("dataDelete", {_state:{selected:true}});
	   	});      	

    	// 선택 버튼 
    	$('#btnSelectedRow').on('click', function(e) {
    		if( $('#'+popLnoGirdId).length == 0){
    			return;
    		}
    			
    		var dataList = $('#'+popLnoGirdId).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}
    		var paramList = [];
    		for(var i=0; i<dataList.length; i++ ){    			
				var voData = {"selectData" : "Y" , "jobDivNm": dataList[i].jobDivNm, "useLineNm": dataList[i].useLineNm, "eqpNm": dataList[i].eqpNm
								, "aportNm": dataList[i].aportNm, "bportNm": dataList[i].bportNm
								, "orglSvlnNo": dataList[i].svlnNo, "trkNtwkLineNm": dataList[i].trkNtwkLineNm
								, "orglEqpId": dataList[i].eqpId, "orglEqpNm": dataList[i].eqpNm
								, "orglAportDesc": dataList[i].aportNm, "orglBportDesc": dataList[i].bportNm};
				
				paramList.push(voData);
    		}
//    		console.log(paramList);
    		$a.close(paramList);
	   	});	
    	//  
    	
	};
    
	// 회선 조회
    function searchList(dataParam){
		cflineShowProgressBody();	
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getsvlnlist', dataParam, 'GET', 'searchList');
    }
    
    // 선번 조회
    function searchLno(dataParam){
		cflineShowProgressBody();
		httpRequestPop('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getsvlnlnolist', dataParam, 'POST', 'searchLnoList');
    	
    }

	//request 성공시.
    function successCallback(response, status, jqxhr, flag){    	
    	// 조회
		if(flag == 'searchList') {
    		cflineHideProgressBody();
    		if(response.svlnList != null){
    	        $('#'+popGirdId).alopexGrid("dataSet", response.svlnList);
    	        if(response.svlnList.length == 1){ // 1건인 경우 바로 선번 조회.
    	    		var paramList = [];
    				var voData = {"svlnNo": response.svlnList[0].svlnNo, "jobType": response.svlnList[0].jobType, "lineNm": response.svlnList[0].lineNm};
    				paramList.push(voData);
    	    		var paramUsing = {"tmofCd" : paramData.tmofCdVal, "lineList": paramList};    		
    	    		searchLno(paramUsing);
    	        }
    		}
		} 
		if(flag == 'searchLnoList') {
    		cflineHideProgressBody();
    		if(response.pathList != null && response.pathList.length>0){
    	        $('#'+popLnoGirdId).alopexGrid("dataSet", response.pathList);
    		}else{
    			alertBox('I', cflineMsgArray['noSearchNodeLnoData']); /* 조회된 노드 선번 데이터가 없습니다.*/
    		}
		} 
		
		
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	cflineHideProgressBody();
    	if(flag == 'searchList') {
        	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		} 
    	cflineHideProgressBody();
    	if(flag == 'searchLnoList') {
        	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		} 
    }    
    
    var httpRequestPop = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
 
});