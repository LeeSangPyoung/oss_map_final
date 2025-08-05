/**
 * FdfAcceptListList.js 
 * 
 * FDF수용내역관리
 * @author P095783
 * @date 2021.09.07
 * @version 1.0
 * 
 */

$a.page(function() {
	var gridId = 'dataGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	createMgmtGrpSelectBox ("ownCd", "A");  // 관리 그룹 selectBox
    	$('#btnExportExcel').setEnabled(false);
    	
    	//전송실 전체 생성값
    	tomfHeaderYn = "Y";
    	
    	initGrid();
    	setSelectCode();
        setEventListener();
        
        $('#mtsoNm').setEnabled(false);
        $('#eqpNm').setEnabled(false);
    };
    
  //Grid 초기화
    function initGrid() {
    	var columnMapping = [
    	    {key : 'check',align:'center',			width:'40px',			title :cflineMsgArray['sequence'] /*'번호'*/,			numberingColumn : true }
			, {key : 'mtsoNm',			align:'center',			width:'150px',		title : cflineMsgArray['mtsoName'] /* 국사명 */,rowspan : true }
			, {key : 'eqpNm',			align:'left',			width:'150px',		title : cflineMsgArray['equipmentName']		/* 장비명 */,rowspan : true }
			, {key : 'portNm',			align:'center',			width:'80px',		title : cflineMsgArray['core'] + "(" + cflineMsgArray['portName'] + ")" /* 코어(포트명) */,rowspan : true }
			, {key : 'lineGubun',			align:'center',			width:'100px',		title : cflineMsgArray['ntwkTopologyCd'] /* 망종류 */}
			, {key : 'lineId',			align:'center',			width:'110px',		title : cflineMsgArray['lineIdentification'] + "/" + cflineMsgArray['ringIdentification'] /* 회선ID/링ID */}
			, {key : 'lineNm',			align:'left',			width:'150px',		title : cflineMsgArray['lnNm'] + "/" + cflineMsgArray['ringName'] /* 회선명/링명 */}
			, {key : 'lineStatNm',			align:'center',			width:'80px',		title : cflineMsgArray['lineStatus']	/* 회선상태 */ }
			, {key : 'wkSprDivNm',			align:'center',			width:'80px',		title : cflineMsgArray['mainSubDivision']	/* 주예비구분 */ }
		]
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
            autoColumnIndex : true,
            fitTableWidth : true,
            disableTextSelection : true,
            rowSingleSelect : false,
            rowClickSelect : false,
            numberingColumnFromZero : false,
            defaultColumnMapping:{sorting: true},
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,columnMapping : columnMapping
            /*,grouping : {
            	by : ['mtsoNm','eqpNm','portNm'],
            	useGrouping : true,
            	useGroupRowspan : true,
            }*/
        });
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearchCode("orgCd", "teamCd", "topMtsoCd");
    	
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188Data');
    	
    	// 사용자 소속 전송실
    	//searchUserJrdtTmofInfo("topMtsoCd");
    }
    
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		//$('#btnSearch').click();
                  	}
               	}
        });
    }
	
    function setEventListener() {
    	// 관리그룹 선택시
	 	$('#ownCd').on('change',function(e){
	   		changeMgmtGrp("ownCd", "orgCd", "teamCd", "topMtsoCd", "mtso");
	   	});  
   		// 본부 선택시
    	$('#orgCd').on('change',function(e){
    		changeHdofc("orgCd", "teamCd", "topMtsoCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "topMtsoCd", "mtso");
      	});
    	
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 if($('#eqpId').val() == '' && $('#mtsoId').val() == ''){
    			 alertBox('I', cflineMsgArray['fdfCheckMsg']);
    		 }else{
        		 cflineShowProgressBody();
        		 var dataParam =  $("#searchForm").getData();
        		 if($('#ownCd').val() == "0001" ){
        			 dataParam.ownCd = "SKT"
        		 }else if($('#ownCd').val() == "0002" ){
        		 	dataParam.ownCd = "SKB"
        		 }
        		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/fdfaccept/selectFdfAcceptList', dataParam, 'POST', 'selectFdfAcceptList');
    		 }
         });
    	 
	    //국사찾기
	    $('#btnMtsoSch').on('click', function(e) {
			var paramValue = "";
			paramValue = {"mgmtGrpNm": $('#ownCd option:selected').text(),"orgId": $('#orgCd').val(),"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val()}
			openMtsoDataPop("mtsoId", "mtsoNm", paramValue);
	    });
    	
		//장비찾기
		$('#btnEqpSch').on('click', function(e) {
			
			var mtsoList = [];
			if($('#mtsoId').val() != ''){
				mtsoList.push( $('#mtsoId').val() );
			}else if($('#mtsoId').val() == '' && $('#topMtsoCd').val() != ''){
				mtsoList.push( $('#topMtsoCd').val() );
			}
			openEqpPopThis("eqpId", "eqpNm", $("#eqpNm").val(), mtsoList);
		}); 
	    
    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 //funExcelBatchExecute();
        	 cflineShowProgressBody();
        	 excelDownload();
         });
         
         //초기화
         $('#btnInit').on('click', function(e) {
        	 callMsgBox('','C', '초기화 하시겠습니까?', function(msgId, msgRst){
        		 if (msgRst == 'Y') {
        			 funInit();
        		 }
        	 });
         });
	};
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['fdfAcceptList']+"_"+date,			/* 기지국사별 이원화총괄 */
     		sheetList: [{
     			sheetName: cflineMsgArray['fdfAcceptList'],			/* 기지국사별 이원화총괄 */
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
    }
    
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'C00188Data') {
			// 관리그룹
			C00188Data = response;
		}
		if(flag == 'selectFdfAcceptList'){
			$('#'+gridId).alopexGrid('dataSet', response.resultList );
			$('#btnExportExcel').setEnabled(true);
			cflineHideProgressBody();
		}
		
		if(flag == 'excelBatchExecute') {
			if(response.returnCode == '200'){ 
				jobInstanceId  = response.resultData.jobInstanceId;
				cflineHideProgressBody();
				excelCreatePop(jobInstanceId);
			}else if(response.returnCode == '500'){ 
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
			}
    	}
    	if(flag == 'excelBatchExecuteStatus') {
    		//console.log("response.resultData.jobStatus >>" + response.resultData.jobStatus);
   		 	if(response.returnCode == '200'){ 	
    			var jobStatus  = response.resultData.jobStatus ;
    			if (jobStatus =="ok"){
    				//엑셀파일다운로드 활성화
    				funExcelDownload();
    			}else if (jobStatus =="running"){
    				setTimeout(function(){ funExcelBatchExecuteStatus(); } , 1000*5 );
    			}else if (jobStatus =="error"){
    				cflineHideProgressBody();
    				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    			}
    		}else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
	}
	
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'selectTrunkIdleList'){
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
    	}).done(successCallback)
		  .fail(failCallback);
    }
 
    function onloadMgmtGrpChange(){
   		changeMgmtGrp("ownCd", "orgCd", "teamCd", "topMtsoCd", "mtso", "topMtsoAll");
    }
    
  //장비 찾기 팝업
    function openEqpPopThis(eqpId, eqpNm, searchEqpNm, vTmofInfo, division){
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) ==""){
    		urlPath = "/tango-transmission-web";
    	}
    	
    	var param = new Object();
    	$.extend(param,{"neNm":nullToEmpty(searchEqpNm)});
    	$.extend(param,{"vTmofInfoRm":vTmofInfo}); // 최상위 전송실 조회 리스트
    	$.extend(param,{"searchDivision":division});
    	
    	$a.popup({
    	  	popid: "popEqpSch",
    	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
    	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
    	  	data: param,
    		modal: false,
    		movable:true,
    		windowpopup : true,
    		width : 1100,
    		height : 600,
    		callback:function(data){
    			if(data != null){
    				$('#' + eqpId).val(data.neId);
    				$('#' + eqpNm).val(data.neNm);
    			}
    		}
    	}); 	
    }
    
    // 엑셀배치실행
    function funExcelBatchExecute(){

    	cflineShowProgressBody();
		var topMtsoIdList = [];
		
		var dataParam =  $("#searchForm").getData();
		
		if($( '#ownCd').val() == "0001" ){
			dataParam.ownCd = "SKT"
		}else if( $('#ownCd').val() == "0002" ){
			dataParam.ownCd = "SKB"
		}
		
		dataParam.fileExtension = "xlsx";
		dataParam.excelPageDown = "N";
		dataParam.excelUpload = "N";
		dataParam.method = "fdfAccpet";
		dataParam.fileName = cflineMsgArray['fdfAcceptList'] /*FDF 수용내역 관리*/;

		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/fdfaccept/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
    
    // 배치상태확인
    function funExcelBatchExecuteStatus(){
 		//console.log("btnExcelBatchExecuteStatus S [" + jobInstanceId + "]"); 
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchExecuteStatus/'+jobInstanceId, null , 'GET', 'excelBatchExecuteStatus');
    }
    
    // 엑셀다운로드
    function funExcelDownload(){
    	cflineHideProgressBody();
    	// Excel File Download URL
    	var excelFileUrl = '/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchDownload';
    	//var excelFileUrl = 'excelDownload';
    	var $form=$( "<form></form>" );
		$form.attr( "name", "downloadForm" );
		//$form.attr( "action", excelFileUrl + "?jobInstanceId=" + $excelFileId.val() );
		$form.attr( "action", excelFileUrl + "?jobInstanceId=" + jobInstanceId );
		$form.attr( "method", "GET" );
		$form.attr( "target", "downloadIframe" );
		$form.append(Tango.getFormRemote());
		// jobInstanceId를 조회 조건으로 사용
		$form.append( "<input type='hidden' name='jobInstanceId' value='" + jobInstanceId + "' />" );
		$form.appendTo('body')
		$form.submit().remove();
    }
    
    // 초기화
    function funInit(){
    	createMgmtGrpSelectBox ("ownCd", "A");  // 관리 그룹 selectBox
    	setSelectCode();
    	$('#mtsoNm').val('');
    	$('#mtsoId').val('');
    	$('#eqpNm').val('');
    	$('#eqpId').val('');
    	$('#btnExportExcel').setEnabled(false);
    	$('#'+gridId).alopexGrid("dataEmpty");
	}
    
});