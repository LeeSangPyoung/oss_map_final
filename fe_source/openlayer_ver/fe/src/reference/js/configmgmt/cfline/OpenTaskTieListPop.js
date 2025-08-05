/**
 * OpenTaskTieListPop
 *
 * @author Administrator
 * @date 2017. 8. 02.
 * @version 1.0
 */
//var gridTiePop = 'tieListPopGrid';
var paramData = null;
var selectDataObj = null;
var returnTieMapping = [];
var gridKey = null;
var gubun = "";
var tieComp = "";
var btsTieComp = "";
var lineTieComp = "";
var tmofCdListTie = [];
var pageForCount = 100;
var gridIdScrollBottom = true;
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
		paramData = param;
		$('#jobTypeCdPopTie').val(nullToEmpty(paramData.jobTypeCd));
		$('#svlnSclCdPopTie').val(nullToEmpty(paramData.svlnSclCd));
		$('#tieOnePopTie').val(nullToEmpty(paramData.tie));
		$('#tieTwoPopTie').val(nullToEmpty(paramData.tie));
		$('#tieDivPopTie').val(nullToEmpty(paramData.tieDiv));
		
		gridKey = nullToEmpty(paramData.gridKey);
		getTieGrid();
    	setSelectCode();
        setEventListener();  
 		if($('#jobTypeCdPopTie').val() =="" || $('#svlnSclCdPopTie').val() == ""){
 			$a.close('invalidParamValue');
 			return;
 		}
		if($('#tiePopTie').val() !=null && $('#tiePopTie').val().length < 5){	
 			$a.close('minLengthPossible');
		}else{
   		 	gridIdScrollBottom = true;
			searchTiePop('B');
		} 
    };
    

    //Grid 초기화
    var getTieGrid = function(response) {    	
    	/*jobTypeCdPopTie
    		1 : 일반
    		3 : 감설
    		5 : 수변
    	*/
    	/*svlnSclCdPopTie
    		001 :	교환기간
    		002 :	기지국간
    		003 :	상호접속간
    	*/
		var jobTypeCdPopTie = $('#jobTypeCdPopTie').val();
		var svlnSclCdPopTie = $('#svlnSclCdPopTie').val();
		var tieDivPopTie = $('#tieDivPopTie').val();
		//console.log("tieDivPopTie:" + tieDivPopTie);
		if (svlnSclCdPopTie == "001"){  // 교환기간
			if(jobTypeCdPopTie == "3"){
				returnTieMapping = mappingAdTie();  // 감설 Tie 검색
			}else{
				if(tieDivPopTie == "OGTIE"){
					returnTieMapping = mappingExchrTieOg();  // OG Tie 검색 
				}else if(tieDivPopTie == "ICTIE"){
					returnTieMapping = mappingExchrTieIc();  // IC Tie 검색 
				}else if(tieDivPopTie == "ADTIE"){
					returnTieMapping = mappingAdTieAd();  // 수변 감설 Tie 검색  
				}
			}
		}else if(svlnSclCdPopTie == "002"){  // 기지국간
			if(jobTypeCdPopTie == "1" || jobTypeCdPopTie == "2"){
				returnTieMapping = mappingBmtsoTie();  // 신설, 증설 Tie 검색 
			}else if (jobTypeCdPopTie == "3"){
				returnTieMapping = mappingAdTie();  // 감설 Tie 검색 
			}else{
				if(tieDivPopTie == "ADTIE"){
					returnTieMapping = mappingAdTieAd();  // 수변 감설 Tie 검색 
				}else{
					returnTieMapping = mappingBmtsoTie(); // 수변 Tie 검색 
				}
			}
		}else{	// 상호접속 
			if(jobTypeCdPopTie == "1" || jobTypeCdPopTie == "2"){
				returnTieMapping = mappingTrdCnntTie(); // 신설, 증설 Tie 검색 
			}else{
				returnTieMapping = mappingAdTie();  // 감설 Tie 검색 
			}
		}
		
		//그리드 생성K
        $('#'+gridTiePop).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
//	    		pager:false,  		
			height : 350,	
        	message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		},
        	columnMapping:returnTieMapping,
        });
//	    	$('#'+gridTiePop).alopexGrid("columnFix", 3);
//	    	//	작업 정보 편집모드 활성화
//	    	$("#"+gridTiePop).alopexGrid("startEdit");

    }         

    
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/gettmoforglislist', null, 'GET', 'tmofCodeDataPop');
    }
    
    function setEventListener() { //	 	// 엔터 이벤트 
     	$('#searchTiePopForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			gridIdScrollBottom = true;
     			searchTiePop('S');
    			return false;
    		}
     	});	
	   	    	
	   	//조회 
	   	$('#btnPopTieSearch').on('click', function(e) {
	   		gridIdScrollBottom = true;
	   		searchTiePop('S');   		
        });
    	   	
     	// 그리드 더블클릭
 		$('#'+gridTiePop).on('dblclick', '.bodycell', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data; 			
 			var tmpList = [dataObj];
 			$.extend(tmpList,{"gubun":gubun});
 			$.extend(tmpList,{"tieComp":tieComp});
 			$.extend(tmpList,{"btsTieComp":btsTieComp});
 			$.extend(tmpList,{"lineTieComp":lineTieComp});
 			$a.close(tmpList);
	    });
 		
	};
	// 조회 처리
	function searchTiePop(gubun){
		var tieName = "TIE";
		if(gubun=='S'){
			tieName = "TIE1";
		}
		if(($('#tieOnePopTie').val() =="" && $('#tieTwoPopTie').val() =="") || $('#svlnSclCdPopTie').val() == ""){
			alertBox('I', makeArgCommonMsg('required', 'TIE')); /* [{0}] 필수 입력 항목입니다. */
			return;
		}
		if($('#tieOnePopTie').val() != "" && $('#tieOnePopTie').val().length < 2 ){
			alertBox('I', makeArgCommonMsg2('minLengthPossible', tieName, 2)); /* {0} 항목은 {1}이상 입력가능합니다. */
			return;
		}
		if($('#tieTwoPopTie').val() != "" && $('#tieTwoPopTie').val().length < 2 ){
			alertBox('I', makeArgCommonMsg2('minLengthPossible', 'TIE2', 2)); /* {0} 항목은 {1}이상 입력가능합니다. */
			return;
		}
		var tmofCdPopTie = $('#tmofCdPopTie').val();
//		selectDataObj = null;
		

		$("#firstRow01Pop").val(1);
     	$("#lastRow01Pop").val(pageForCount); // 페이징개수
		$("#firstRowIndexPop").val(1);
     	$("#lastRowIndexPop").val(pageForCount); // 페이징개수		
		
		var param =  $("#searchTiePopForm").getData(); 
		
		for(var i=0; i<tmofCdListTie.length; i++){
			var tmpCdData = tmofCdListTie[i];
			if(tmpCdData.value == tmofCdPopTie){
				$.extend(param,{tmofId: tmpCdData.tmofId });
				break;
			}
		}
//		console.log(param);		
		cflineShowProgress(gridTiePop);
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentasktielist', param, 'GET', 'searchTiePop'); 
	};

    
    $('#'+gridTiePop).on('scrollBottom', function(e){
		var nFirstRowIndex =parseInt($("#firstRow01Pop").val()) + pageForCount; // 페이징개수
		var nLastRowIndex =parseInt($("#lastRow01Pop").val()) + pageForCount; // 페이징개수
		$("#firstRow01Pop").val(nFirstRowIndex);
		$("#lastRow01Pop").val(nLastRowIndex);  
		$("#firstRowIndexPop").val(nFirstRowIndex);
		$("#lastRowIndexPop").val(nLastRowIndex);  

		var param =  $("#searchTiePopForm").getData(); 
		
		for(var i=0; i<tmofCdListTie.length; i++){
			var tmpCdData = tmofCdListTie[i];
			if(tmpCdData.value == tmofCdPopTie){
				$.extend(param,{tmofId: tmpCdData.tmofId });
				break;
			}
		}
//		console.log("gridIdScrollBottom========================" + gridIdScrollBottom);		
    	if(gridIdScrollBottom){
    		cflineShowProgress(gridTiePop);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentasktielist', param, 'GET', 'searchTieForPageAdd'); 
    	}
	});	
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchTiePop'){
    		cflineHideProgress(gridTiePop);
    		$('#'+gridTiePop).alopexGrid("dataSet", response.tieList);
    		

    		$('#'+gridTiePop).alopexGrid('updateOption',
    				{paging : {pagerTotal: function(paging) {
    					return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(response.totalCnt);
    				}}}
    		);     		
    	}

    	if(flag == 'searchTieForPageAdd'){
    		cflineHideProgress(gridTiePop);
			if(response.tieList.length == 0){
				gridIdScrollBottom = false;
				return false;
			}else{
	    		$('#'+gridTiePop).alopexGrid("dataAdd", response.tieList);
			}
    	}    	
		
		if(flag == "tmofCodeDataPop"){
			var tmof_option_data =  [];
			var dataFst = {"value":"","text":cflineCommMsgArray['select'] /* 선택 */,"tmofId":""};
			tmof_option_data.push(dataFst);
    		if(response.tmofCdList != null && response.tmofCdList.length>0){
    			// 전송실 select 처리
    			for(m=0; m<response.tmofCdList.length; m++){
    				tmof_option_data.push({"value":response.tmofCdList[m].orgIdLis,"text":response.tmofCdList[m].text,"tmofId":response.tmofCdList[m].value});
    			}    
    		}
    		tmofCdListTie = tmof_option_data;
			$('#tmofCdPopTie').clear();
			$('#tmofCdPopTie').setData({data : tmof_option_data});
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchTiePop'){
    		cflineHideProgress(gridTiePop);
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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
    }
  
});