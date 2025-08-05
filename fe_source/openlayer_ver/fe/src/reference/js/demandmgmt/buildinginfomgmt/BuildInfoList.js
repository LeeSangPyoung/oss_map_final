/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 21. 오후 1:44:03
 * @version 1.0
 */
$a.page(function() {
    var refreshFlag = false;
    var refreshInterval = null;
	//그리드 ID
    var gridId = 'resultGrid';
    var m_bIsBpCd = true;
    var m_bSKT = false;
    //replaceAll prototype 선언
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	$('#StatexcelDownloadByBatch').hide();
    	
    	var sendparam = {
    			fdaisBp : $('#userBpId').val()
    	};
    	
    	Tango.ajax({
    		url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/findUserBpInSKB',
    		data : sendparam,
    		method : 'GET'
    	}).done(function(response){successBuildingInfoCallback(response, 'getUserBpInSKB');})
    	  .fail(function(response){failBuildingInfoCallback(response, 'getUserBpInSKB');})
    	
    	// RPA관리자만 RPA엑셀업로드 
		if ($('#userInfo').val() == 'PTN2773271' || $('#userInfo').val() == 'PTN5205718' || 
				$('#userInfo').val() == 'SKBP901' || $('#userInfo').val() == 'SKBP902') {
			$('#rpaExcelUpload').show();
		};
    };

    function setCombo() {
    	if(m_bSKT == false)
    		$('#bUseBpFilter').setChecked(true);
    	
    	BonbuCodeInit();
    	selectComboCode('bldMgmtTypCd', 'Y', 'C00649', '');
    	selectComboCode('bldLdcgCd', 'Y', 'C00643', '');
    	selectComboCode('bldMainUsgCd', 'Y', 'C00648', '');
 /*   	selectComboCode('bonbuNm', 'Y', 'C00623', '');
    
    	selectSido("sidoNm");		*/
    }
    
    function openPopup(){
    	//이력보기
    	$('#btnBuildInfoHistory').on('click', function(e) {
        	var object = $('#'+gridId).alopexGrid('dataGet', {_state : {selected : true}});
        	
        	if(object.length == 0) {
        		alertBox('W',buildingInfoMsgArray['selectNoData']);
        		return false;
        	}
        	else if(object.length != 1) {
        		alertBox('W',buildingInfoMsgArray['oneSelcetUpdateForBulidingInfo']);
        		return false;
        	}
        	
        	if(object[0].fdaisNo == '' || object[0].fdaisNo == null){
        		alertBox('W', "현장실사 데이터만 이력보기가 가능합니다.");
            	return;
        	}

        	var param = object[0];
        	buildHistory(param);
        });
    
    	// 등록 및 수정
        $('#btnBuildInfoDetailInsert').on('click', function(e) {
        	buildInfoDetail("INSERT", null);
        });
        
        $('#btnBuildInfoDetailUpdate').on('click', function(e) {
        	var object = $('#'+gridId).alopexGrid('dataGet', {_state : {selected : true}});
        	
        	if(object.length == 0) {
        		alertBox('W',buildingInfoMsgArray['selectNoData']);
        		return false;
        	}
        	else if(object.length != 1) {
        		alertBox('W',buildingInfoMsgArray['oneSelcetUpdateForBulidingInfo']);
        		return false;
        	}
        	
        	var param = object[0];
        	buildInfoDetail("UPDATE", param);
        });
    }
    
    function validation() {
    	
    	var validationCheck = true;
    	
    	// 조회 필수 항목 체크
    	if(!$("input:checkbox[id='all']").is(":checked")
    			&& !$("input:checkbox[id='saeum']").is(":checked")
    			&& !$("input:checkbox[id='gcmmBtoB']").is(":checked")
    			&& !$("input:checkbox[id='gcmmOther']").is(":checked")
    			&& !$("input:checkbox[id='silsa']").is(":checked")) {
    		//bodyProgressRemove();
    		//alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
    		validationCheck = false;
    	}
    	
    	return validationCheck;
    }
    
	function BonbuCodeInit() {
	    	
		var dataParam = $("#searchForm").getData();
		
		dataParam.bpCd = $('#userBpId').val();
		dataParam.bSKT = m_bSKT;
		
		var fdaisBldCnstDivCdList = [];
		var fdaisGrudFlorCntCdList = [];
		var fdaisBldMainUsgCdList = [];
		
		$.extend(dataParam,{fdaisBldMainUsgCdList: fdaisBldMainUsgCdList });
		$.extend(dataParam,{fdaisBldCnstDivCdList: fdaisBldCnstDivCdList });
		$.extend(dataParam,{fdaisGrudFlorCntCdList: fdaisGrudFlorCntCdList });
		
		bodyProgress();
		buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/getBonbuByBpFilter', dataParam, 'GET', 'getBonbuByBpFilter');
		
	    } 
    
    function getParam() {
    	//tango transmission biz 모듈을 호출하여야한다.
    	var dataParam =  $("#searchForm").getData();
    	
    	// 구분값 추가
    	var gcmm = false;
    	if($("input:checkbox[id='gcmmBtoB']").is(":checked") || $("input:checkbox[id='gcmmOther']").is(":checked")) {
    		gcmm = true;
    	}
    	dataParam.gcmm = gcmm;
    	
    	//Date 타입 변경 ( YYYY-MM-DD -> YYYYMMDD )
    	$.map( dataParam, function(value, key){
    		if(key.indexOf("DtStart") > -1 || key.indexOf("DtEnd") > -1) {
    			dataParam[key] = value.replaceAll("-", "");
    		}
    		
    		if(key.indexOf("kpi_") > -1) {
    			dataParam[key] = value.toString();
    		}
    	});

    	return dataParam;
    }
    
    function setEventListener() {
    	
    	$('#'+gridId).on("dblclick", ".bodycell", function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var param = object.data;

        	buildInfoDetail("UPDATE", param);
        });
        
        $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	
         	if(!validation()) {
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
         	if($('#sidoNm option:selected').val() == "" && $('#bonbuNm option:selected').val() == "") {
        		alertBox('W',buildingInfoMsgArray['NeedSelect']);
        		return false;
        	}
         	
        	var param = getParam();
        	
        	param.pageNo = eObj.page;
        	param.rowPerPage = eObj.pageinfo.perPage;
        	param.hdofcCd = param.bonbuNm;
        	//param.fdaisBp = $("#fdaisBp").val().replace(/ /gi, "");
        	
        	startSearch(param);
        });
    	
        // 검색
        $('#search').on('click', function(e) {
        	if(!validation()) {
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
/*        	if($('#sidoNm option:selected').val() == "") {
        		alertBox('W',buildingInfoMsgArray['checkForBuildingInfo']);
        		return false;
        	}*/
        	
        	if($('#sidoNm option:selected').val() == "" && $('#bonbuNm option:selected').val() == "") {
        		alertBox('W',buildingInfoMsgArray['NeedSelect']);
        		return false;
        	}
        	
        	/**
        	 * 추가 로직
        	 * 1. 현장실사만 체크 되어있을시 시도 까지만 조회조건 제약
        	 * 2. 현장실사만 체크 되어있지 않는 경우 KPI대상에 하나라도 체크가 되어있다면, 시도까지...
        	 * 3. 현장실사만 체크 되어있지 않는 경우 KPI대상에 하나라도 체크가 되어있지 않다면 시군구까지...
        	 */
        	if( ( $("input:checkbox[id='saeum']").is(":checked") || $("input:checkbox[id='silsa']").is(":checked") )
        			&& !$("input:checkbox[id='gcmmBtoB']").is(":checked")
        			&& !$("input:checkbox[id='gcmmOther']").is(":checked")
        		) {
        		
        	}
        	else {
        		if($("input:checkbox[id='kpiMainUse']").is(":checked") || $("input:checkbox[id='kpiTwentyFourSi']").is(":checked") || $("input:checkbox[id='kpiEightyFiveSi']").is(":checked")) {
            		
            	}
            	else {
            		if($('#sggNm option:selected').val() == "") {
                		alertBox('W',buildingInfoMsgArray['checkForBuildingInfo']);
                		return false;
                	}
            	}
        	}

        	var param = getParam();
        	
        	var pageNo = 0;
        	var rowPerPage = 0;
        	
        	var pageInfo = $('#'+gridId).alopexGrid('pageInfo');
        	
        	param.pageNo = pageNo;
        	param.rowPerPage = rowPerPage;
        	param.hdofcCd = param.bonbuNm;
        	//param.fdaisBp = $("#fdaisBp").val().replace(/ /gi, "");

        	startSearch(param);
        });
        
        //삭제
        $('#btnBuildInfoDelete').on('click', function(e) {
        	var list = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', { _state: { selected : true } } ));
        	
        	if(list.length == 0) {
        		alertBox('W',buildingInfoMsgArray['selectNoData']);
        		return false;
        	}
        	else {
        		//현장실사 데이터가 존재하는지 체크
        		var fdaisCnt = 0;
        		
        		for(var i=0; i<list.length; i++) {
        			if(list[i].hasOwnProperty('fdaisNo')) {
        				fdaisCnt++;
        			}
        		}
        		
        		//체크하여 있다면 삭제처리 없다면, 없다고 메세지 처리
        		if(fdaisCnt == 0) {
        			alertBox('W',buildingInfoMsgArray['selectNoDataForBuildingInfo']);
        			return false;
        		}
        		else {
        			
        			callMsgBox('','C', buildingInfoMsgArray['delete'], function(msgId, msgRst){  
	                	if (msgRst == 'Y') {
	                		var param = {
	                    		flag : 'Delete'	
	                    	};
	                    			
	                    	param.gridData = {
	                    		buildInfoDeleteList : list
	                    	};
	                    	
	                    	buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/buildingexplosion?method=delete', param, 'POST', 'buildingInfoDelete');
	                	}
                	});
        		}
        	}
        });

        $('#excelDownload').on('click', function(e) {
        	if(!validation()) {
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
        	if($('#sidoNm option:selected').val() == "" && $('#bonbuNm option:selected').val() == "") {
        		alertBox('W',buildingInfoMsgArray['NeedSelect']);
        		return false;
        	}
        	
        	if($('#sggNm option:selected').val() == "") {
        		alertBox('W',buildingInfoMsgArray['ExcelDownCheckForBuildingInfo']);
        		return false;
        	}
        	
        	bodyProgress();
        	
        	var param = getParam();
        	
        	/**
        	 * 엑셀다운로드 파라메터 셋팅
        	 */
        	param = gridExcelColumn(param, gridId);
        	
        	param.fileName = "건물수요";
        	param.fileExtension = "xlsx";
        	param.excelPageDown = "N";
        	param.excelUpload = "Y";
        	param.bSKT = m_bSKT;
        	
        	buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreate', param, 'POST', 'excelDownload');
        	//buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreatebybatch', param, 'POST', 'excelDownloadbybatch');
        });
        
        $('#excelDownloadByBatch').on('click', function(e) {
        	if(!validation()) {
        		alertBox('W',buildingInfoMsgArray['onlyBuildingInfoSearchValidation']);
        		return false;
        	}
        	
        	if($('#sidoNm option:selected').val() == "" && $('#bonbuNm option:selected').val() == "") {
        		alertBox('W',buildingInfoMsgArray['NeedSelect']);
        		return false;
        	}
        	
        	
        	/**
        	 * 추가 로직
        	 * 1. 현장실사만 체크 되어있을시 시도 까지만 조회조건 제약
        	 * 2. 현장실사만 체크 되어있지 않는 경우 KPI대상에 하나라도 체크가 되어있다면, 시도까지...
        	 * 3. 현장실사만 체크 되어있지 않는 경우 KPI대상에 하나라도 체크가 되어있지 않다면 시군구까지...
        	 */
        	if( ( $("input:checkbox[id='saeum']").is(":checked") || $("input:checkbox[id='silsa']").is(":checked") )
        			&& !$("input:checkbox[id='gcmmBtoB']").is(":checked")
        			&& !$("input:checkbox[id='gcmmOther']").is(":checked")
        		) {
        		
        	}
        	else {
        		if($("input:checkbox[id='kpiMainUse']").is(":checked") || $("input:checkbox[id='kpiTwentyFourSi']").is(":checked") || $("input:checkbox[id='kpiEightyFiveSi']").is(":checked")) {
            		
            	}
            	else {
            		if($('#sggNm option:selected').val() == "") {
                		alertBox('W',buildingInfoMsgArray['ExcelDownCheckForBuildingInfo']);
                		return false;
                	}
            	}
        	}
        	
        	/*if($('#sggNm option:selected').val() == "") {
        		alertBox('W',buildingInfoMsgArray['ExcelDownCheckForBuildingInfo']);
        		return false;
        	}*/
        	
        	bodyProgress();
        	
        	var param = getParam();
        	
        	/**
        	 * 엑셀다운로드 파라메터 셋팅
        	 */
        	param = gridExcelColumn(param, gridId);
        	
        	param.fileName = "건물관리";
        	param.fileExtension = "xlsx";
        	param.excelPageDown = "N";
        	param.excelUpload = "Y";
        	param.bSKT = m_bSKT;
        	param.userBP = $('#fdaisBp').val();
        	param.hdofcCd = param.bonbuNm;
   
        	var fdaisBldCnstDivCdList = [];
    		var fdaisGrudFlorCntCdList = [];
    		var fdaisBldMainUsgCdList = [];
    		
    		if (nullToEmpty( $("#fdaisBldMainUsgCdList").val() )  != ""  ){
    			fdaisBldMainUsgCdList = $("#fdaisBldMainUsgCdList").val() ;	
    		}else{
    			
    		}
    		
    		if (nullToEmpty( $("#fdaisBldCnstDivCdList").val() )  != ""  ){
    			fdaisBldCnstDivCdList = $("#fdaisBldCnstDivCdList").val() ;	
    		}else{
    			
    		}
    		
    		if (nullToEmpty( $("#fdaisGrudFlorCntCdList").val() )  != ""  ){
    			fdaisGrudFlorCntCdList = $("#fdaisGrudFlorCntCdList").val() ;
    		}else{
    			
    		}
    		$.extend(param,{fdaisBldMainUsgCdList: fdaisBldMainUsgCdList });
    		$.extend(param,{fdaisBldCnstDivCdList: fdaisBldCnstDivCdList });
    		$.extend(param,{fdaisGrudFlorCntCdList: fdaisGrudFlorCntCdList });
    		
    		if(m_bSKT == false){
    			var fdaisDtStart = $("#fdaisDtStart").val().replaceAll(/-/gi, "");
    			var fdaisDtEnd = $("#fdaisDtEnd").val().replaceAll(/-/gi, "");
    			
    			if(fdaisDtStart != null && fdaisDtStart != '')
    				param.fdaisDtStart = $("#fdaisDtStart").val().replaceAll(/-/gi, "") + "01";
    			if(fdaisDtEnd != null && fdaisDtEnd != '')
    				param.fdaisDtEnd = $("#fdaisDtEnd").val().replaceAll(/-/gi, "") + "31";
    		}

        	//1. 팝업을 연다
        	//2. 팝업에 param (데이터) 를 함께 보내준다.
        	//3. 아래 $("#excelDownloading") , $("#excelDownloadComplate") 이벤트를 팝업에서 처리한다.
        	
        	buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreatebybatch', param, 'POST', 'excelDownloadbybatch');
        });
        
        
        $('#StatexcelDownloadByBatch').on('click', function(e) {
        	var data = $('#searchForm').getData();
        	data.bSKT = m_bSKT;
        	
        	data = gridExcelColumn(data, gridId);
        	
        	 $a.popup({
             	popid: 'BuildInfoExcelDownPopup',
             	title: '통계 excel 다운로드',/*'엑셀다운로드'*/
             	iframe: true,
             	modal : true,
                 url: 'BuildInfoExcelDown.do',
                 data: data,
                 width : 500,
                 height : 300,
                 /*
             		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
             	*/
                 callback: function(data) {
                	 if(data == null){
                		 	return;
                		 }
                 	}	
             });
         	
        });

        /*
        $("#excelDownloading").on('click', function(e) {
        	var jobInstanceId = $("#excelFileId").val();
        	//console.log("btnExcelBatchExecuteStatus S [" + jobInstanceId + "]"); 
        	buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreatebybatchstatus/'+jobInstanceId, null, 'GET', 'excelDownloadbybatchStatus');
        });
        
        $("#excelDownloadComplate").on('click', function(e) {
        	var jobInstanceId = $("#excelFileId").val();
        	//console.log("btnExcelBatchExecuteStatus S [" + jobInstanceId + "]"); 
        	//buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/exceldownloadbybatch/'+jobInstanceId, null , 'GET', 'excelDownloadbybatchStatus');
        
        	var excelFileUrl = '/tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/exceldownloadbybatch';
        	//var excelFileUrl = 'excelDownload';
        	 
        	var $form=$( "<form></form>" );
    		$form.attr( "name", "downloadForm" );
    		//$form.attr( "action", excelFileUrl + "?jobInstanceId=" + $excelFileId.val() );
    		$form.attr( "action", excelFileUrl + "?jobInstanceId=" + jobInstanceId );
    		$form.attr( "method", "GET" );
    		$form.attr( "target", "downloadIframe" );
    		$form.append(Tango.getFormRemote());
    		////
    		// jobInstanceId를 조회 조건으로 사용
    		$form.append( "<input type='hidden' name='jobInstanceId' value='" + jobInstanceId + "' />" );
    		////
    		$form.appendTo('body')
    		$form.submit().remove();
    		
    		$("#excelDownloading").css("display", "none");
    		$("#excelDownloadComplate").css("display", "none");
    		$("#excelDownloadByBatch").css("display", "");
        });
        */
        
        $('#excelUpload').on('click', function(e) {
        	$a.popup({
        		popid : 'BuildInfoExcelUpload',
        		url : 'BuildInfoExcelUpload.do',
        		iframe : true,
        		modal : true,
        		width : 500,
        		height : 280,
        		title : buildingInfoMsgArray['buildingInformationExcelUpload'],
        		movable : true,
        		callback : function(data){
        			if(data == true){
        				$('#search').click();
        			}
        		},
        		xButtonClickCallback : function(el){ // x버튼 처리
        			callMsgBox('','I', buildingInfoMsgArray['infoClose']);
        			
        			return false;
        	    }
        	});
        });
        
        $('#rpaExcelUpload').on('click', function(e) {
        	var sendparam = {
        			uploadMode : "RPA"
        	};
        	
        	$a.popup({
        		popid : 'rpaBuildInfoExcelUpload',
        		url : 'RpaBuildInfoExcelUpload.do',
        		iframe : true,
        		modal : true,
        		width : 500,
        		height : 280,
        		data : sendparam,
        		title : 'RPA 수집 현장실사 정보 업로드',
        		movable : true,
        		callback : function(data){
        			if(data == true){
        				$('#search').click();
        			}
        		},
        		xButtonClickCallback : function(el){ // x버튼 처리
        			callMsgBox('','I', buildingInfoMsgArray['infoClose']);
        			
        			return false;
        	    }
        	});
        });
        
        $('#fdaisExcelUpload').on('click', function(e) {
        	var sendparam = {
        			uploadMode : "arpvDtInfo"
        	};
        	
        	$a.popup({
        		popid : 'BuildInfoExcelUpload',
        		url : 'BuildInfoExcelUpload.do',
        		iframe : true,
        		modal : true,
        		width : 500,
        		height : 280,
        		data : sendparam,
        		title : '현장실사 사용승인일 엑셀업로드',
        		movable : true,
        		callback : function(data){
        			if(data == true){
        				$('#search').click();
        			}
        		},
        		xButtonClickCallback : function(el){ // x버튼 처리
        			callMsgBox('','I', buildingInfoMsgArray['infoClose']);
        			
        			return false;
        	    }
        	});
        });
        
        $('#all').on('change', function(e) {
        	if($("input:checkbox[id='all']").is(":checked")) {
        		$('#saeum').setChecked(true);
        		$('#gcmmBtoB').setChecked(true);
        		$('#gcmmOther').setChecked(true);
        		$('#silsa').setChecked(true);
        	}
        	else {
        		$('#saeum').setChecked(false);
        		$('#gcmmBtoB').setChecked(false);
        		$('#gcmmOther').setChecked(false);
        		$('#silsa').setChecked(false);
        	}
        });
        
        $('#saeum').on('change', function(e) {
        	if(!$("input:checkbox[id='saeum']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
        });
        
        $('#gcmmBtoB').on('change', function(e) {
        	if(!$("input:checkbox[id='gcmmBtoB']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
        });

		$('#gcmmOther').on('change', function(e) {
			if(!$("input:checkbox[id='gcmmOther']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
		});

		$('#silsa').on('change', function(e) {
			if(!$("input:checkbox[id='silsa']").is(":checked")) {
        		if($("input:checkbox[id='all']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
		});
        
        $('#kpiMainUse').on('change', function(e) {
        	if($("input:checkbox[id='kpiMainUse']").is(":checked")) {
        		if($("input:checkbox[id='kpiAll']").is(":checked")) {
        			$('#all').setChecked(false);
        		}
        	}
        });
        
        $('#kpiTwentyFourSi').on('change', function(e) {
        	if($("input:checkbox[id='kpiTwentyFourSi']").is(":checked")) {
    			$('#kpiEightyFiveSi').setChecked(false);
    			
    			if($("input:checkbox[id='kpiAll']").is(":checked")) {
        			$('#kpiAll').setChecked(false);
        		}
        	}
        });
        
        $('#kpiEightyFiveSi').on('change', function(e) {
        	if($("input:checkbox[id='kpiEightyFiveSi']").is(":checked")) {
    			$('#kpiTwentyFourSi').setChecked(false);
    			
    			if($("input:checkbox[id='kpiAll']").is(":checked")) {
    				$('#kpiAll').setChecked(false);
        		}
        	}
        });
        
        $('#kpiAll').on('change', function(e) {
        	if($("input:checkbox[id='kpiAll']").is(":checked")) {
    			$('#kpiTwentyFourSi').setChecked(false);
    			$('#kpiEightyFiveSi').setChecked(false);
    			$('#kpiMainUse').setChecked(false);
        	}
        });
        
        $('#sidoNm').on('change', function(e) {
        	if($("input:checkbox[id='bUseBpFilter']").is(":checked") == true && m_bIsBpCd == true && m_bSKT == false) {
        		var dataPrm = $('#searchForm').getData();
        		dataPrm.bUseBpFilter = true;
        		
        		dataPrm.bonbu = $('#bonbuNm').val();
        		dataPrm.sidoNm = $('#sidoNm').val();
        		dataPrm.bSKT = m_bSKT;
        		dataPrm.bpCd = $('#userBpId').val();
        		
        		var fdaisBldCnstDivCdList = [];
        		var fdaisGrudFlorCntCdList = [];
        		var fdaisBldMainUsgCdList = [];
        		
        		$.extend(dataPrm,{fdaisBldMainUsgCdList: fdaisBldMainUsgCdList });
        		$.extend(dataPrm,{fdaisBldCnstDivCdList: fdaisBldCnstDivCdList });
        		$.extend(dataPrm,{fdaisGrudFlorCntCdList: fdaisGrudFlorCntCdList });
        		
        		selectBpFilterSgg("sggNm", dataPrm);
        	}
        	else{
        		if($('#sidoNm').val() != "") {
            		selectSggbySKB("sggNm", $('#bonbuNm').val(), $('#sidoNm').val(), m_bSKT);
            		selectEmdbySKB("emdNm", $('#bonbuNm').val(), ' ', ' ', m_bSKT);
            	}
            	else {
            		selectSggbySKB("sggNm", $('#bonbuNm').val(), ' ', m_bSKT);
            		selectEmdbySKB("emdNm", $('#bonbuNm').val(), ' ', ' ', m_bSKT);
            	}
        	}
        	
        });
        
        $('#sggNm').on('change', function(e) {
        	if($("input:checkbox[id='bUseBpFilter']").is(":checked") == true && m_bIsBpCd == true && m_bSKT == false) {
        		var dataPrm = $('#searchForm').getData();
        		dataPrm.bUseBpFilter = true;
        		
        		dataPrm.bonbu = $('#bonbuNm').val();
        		dataPrm.sidoNm = $('#sidoNm').val();
        		dataPrm.sggNm = $('#sggNm').val();
        		dataPrm.bSKT = m_bSKT;
        		dataPrm.bpCd = $('#userBpId').val();
        		
        		var fdaisBldCnstDivCdList = [];
        		var fdaisGrudFlorCntCdList = [];
        		var fdaisBldMainUsgCdList = [];
        		
        		$.extend(dataPrm,{fdaisBldMainUsgCdList: fdaisBldMainUsgCdList });
        		$.extend(dataPrm,{fdaisBldCnstDivCdList: fdaisBldCnstDivCdList });
        		$.extend(dataPrm,{fdaisGrudFlorCntCdList: fdaisGrudFlorCntCdList });
        		
        		selectBpFilterEmd("emdNm", dataPrm);	
        	}
        	else{
        		if($('#sggNm').val() != "") {
            		selectEmdbySKB("emdNm", $('#bonbuNm').val(), $('#sidoNm').val(), $('#sggNm').val(), m_bSKT);
            	}
            	else {
            		selectEmdbySKB("emdNm", $('#bonbuNm').val(), ' ', ' ', m_bSKT);
            	}
        	}
        		
        });
        
        //관리대상건물 조회 여부 체크할시 (현장실사만 체크하고 모든 체크박스 해제)
        $('#mgmtObjBldYn').on('change', function(e) {
        	if($("input:checkbox[id='mgmtObjBldYn']").is(":checked")) {
        		//조회대상 현장실사만 체크하도록 설정
        		$('#saeum').setChecked(true);
        		$('#gcmmBtoB').setChecked(false);
        		$('#gcmmOther').setChecked(false);
        		$('#silsa').setChecked(true);
        		
        		//조회대상 유효건물, 기축건물 비활성화
        		$('#gcmmBtoB').setEnabled(false);
        		$('#gcmmOther').setEnabled(false);
        		
        		//KPI 해제
        		$('#kpiTwentyFourSi').setChecked(false);
    			$('#kpiEightyFiveSi').setChecked(false);
    			$('#kpiMainUse').setChecked(false);
    			
        		//활용여부 해제
    			$('#bukeyUseYn').setChecked(false);
    			$('#lteUseYn').setChecked(false);
    			$('#wifiUseYn').setChecked(false);
    			$('#bukeyVldYn').setChecked(false);
    			$('#bukeySspdAvlbYn').setChecked(false);
        	}
        	else {
        		if(!$("input:checkbox[id='yearObjBldYn']").is(":checked")) {
        			$('#gcmmBtoB').setEnabled(true);
            		$('#gcmmOther').setEnabled(true);
        		}
        	}
        });
        
        //올해대상건물 조회
        $('#yearObjBldYn').on('change', function(e) {
        	if($("input:checkbox[id='yearObjBldYn']").is(":checked")) {
        		//조회대상 현장실사만 체크하도록 설정
        		$('#saeum').setChecked(true);
        		$('#gcmmBtoB').setChecked(false);
        		$('#gcmmOther').setChecked(false);
        		$('#silsa').setChecked(true);
        		
        		//조회대상 유효건물, 기축건물 비활성화
        		$('#gcmmBtoB').setEnabled(false);
        		$('#gcmmOther').setEnabled(false);
        		
        		//KPI 해제
        		$('#kpiTwentyFourSi').setChecked(false);
    			$('#kpiEightyFiveSi').setChecked(false);
    			$('#kpiMainUse').setChecked(false);
    			
        		//활용여부 해제
    			$('#bukeyUseYn').setChecked(false);
    			$('#lteUseYn').setChecked(false);
    			$('#wifiUseYn').setChecked(false);
    			$('#bukeyVldYn').setChecked(false);
    			$('#bukeySspdAvlbYn').setChecked(false);
        	}
        	else {
        		if(!$("input:checkbox[id='mgmtObjBldYn']").is(":checked")) {
        			$('#gcmmBtoB').setEnabled(true);
            		$('#gcmmOther').setEnabled(true);
        		}
        	}
        });
        
        $('#bonbuNm').on('change', function(e){
        	$('#bonbuNm').find("option[value='1000']").remove();
        	
//        	selectFilterSidobySKB("sidoNm", $('#bonbuNm').val(), m_bSKT);	
        	
        	if($("input:checkbox[id='bUseBpFilter']").is(":checked") == true && m_bIsBpCd == true) {
        		var dataPrm = $("#searchForm").getData();
        		dataPrm.bUseBpFilter = true;
        		
        		dataPrm.bonbu = $('#bonbuNm').val();
        		dataPrm.bpCd = $('#userBpId').val();
        		
        		var fdaisBldCnstDivCdList = [];
        		var fdaisGrudFlorCntCdList = [];
        		var fdaisBldMainUsgCdList = [];
        		
        		$.extend(dataPrm,{fdaisBldMainUsgCdList: fdaisBldMainUsgCdList });
        		$.extend(dataPrm,{fdaisBldCnstDivCdList: fdaisBldCnstDivCdList });
        		$.extend(dataPrm,{fdaisGrudFlorCntCdList: fdaisGrudFlorCntCdList });
        		
        		selectBpFilterSido("sidoNm", dataPrm);
        	}
        	else{
        		selectFilterSidobySKB("sidoNm", $('#bonbuNm').val(), m_bSKT);
        	}
        	
        });
        
        $('#bUseBpFilter').on('click', function(e) {
        	
        	if($("input:checkbox[id='bUseBpFilter']").is(":checked") == true) {
        		m_bIsBpCd = true;
        		BonbuCodeInit();
        	}
        	else{
        		m_bIsBpCd = false;
        		if(m_bSKT == true)
        			selectComboCode('bonbuNm', 'Y', 'C00623', '');
        		else{
        			selectSKBbonbuCode('bonbuNm');
        		}
        			
        		$('#fdaisBp').val('');
        		$('#bonbuNm').setEnabled(true);
        		$('#sidoNm').setEnabled(true);
        		$('#sggNm').setEnabled(true);
        		$('#emdNm').setEnabled(true);
        	}	
        });
        
        $('#wreSrvcTypCdReg').on('click', function(e) {
        	if(m_bSKT == false){
        		 // 유선서비스유형 코드등록 팝업
	           	 $a.popup({
	         		popid : 'wreSrvcTypCdRegPop',
	         		url : 'wreSrvcTypCdRegPop.do',
	         		data : null,
	         		iframe : true,
	         		modal : true,
	         		width : 1060,
	         		height : 720,
	         		title : '유선서비스 유형코드 정보',
	         		movable : true,
	         		callback : function(data){
	         			//$('#search').click();
	         			/*if(data == 'search') {
	         				console.log("조회 시킬 예정");
	         				$('#search').click();
	         			}*/
	         			
	         			if(data == true){
	         				$('#search').click();
	         			}
	         		}
	              });
        	}
        	
        });
        
	};
	
	function selectSKBbonbuCode(objId) {
		var str = objId;
		
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/getSKBbonbuCode/',
			data : null,
			method : 'GET'
		}).done(function(response){successJusoCallback(response, str);})
		  .fail(function(response){failJusoCallback(response, str);})
	}
	
	function selectBpFilterSido(objId, dataPrm) {
		var str = objId;
		
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/BpFiltersidolist/',
			data : dataPrm,
			method : 'GET'
		}).done(function(response){successJusoCallback(response, str);})
		  .fail(function(response){failJusoCallback(response, str);})
	}
	
	function selectBpFilterSgg(objId, dataPrm) {
		var str = objId;
		
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/BpFiltersgglist/',
			data : dataPrm,
			method : 'GET'
		}).done(function(response){successJusoCallback(response, str);})
		  .fail(function(response){failJusoCallback(response, str);})
	}
	
	function selectBpFilterEmd(objId, dataPrm) {
		var str = objId;
		
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/BpFilterEmdlist/',
			data : dataPrm,
			method : 'GET'
		}).done(function(response){successJusoCallback(response, str);})
		  .fail(function(response){failJusoCallback(response, str);})
	}
	
	function successJusoCallback(response, objId){
		
		if(objId == "bonbuNm"){
			$('#' + objId).setData({
				data : response.list
			});
			$('#' + objId).prepend('<option value="">전체</option>');
			$('#' + objId).setSelected("");
			$('#' + objId).setEnabled(true);
		}
		else{
			$('#' + objId).setData({
				data : response
			});
			
			if(response.length > 1){
				$('#' + objId).prepend('<option value="">전체</option>');
				$('#' + objId).setSelected("");
				$('#' + objId).setEnabled(true);
			}
			else if(response.length == 1){
				$('#' + objId).setSelected(response[0].cd);
				$('#' + objId).setEnabled(false);
			}
		}
		
	}

	function failJusoCallback(serviceId, response, flag){
		alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
	}
	
	function startSearch(dataParam) {
		/**
		 * 페이지 셋팅
		 */
		if(dataParam.rowPerPage == 0) {
			dataParam.rowPerPage = 100;
		}
		
		var fdaisBldCnstDivCdList = [];
		var fdaisGrudFlorCntCdList = [];
		var fdaisBldMainUsgCdList = [];
		
		if (nullToEmpty( $("#fdaisBldMainUsgCdList").val() )  != ""  ){
			fdaisBldMainUsgCdList = $("#fdaisBldMainUsgCdList").val() ;	
			
			dataParam.buseList = true;
		}else{
			
		}
		
		if (nullToEmpty( $("#fdaisBldCnstDivCdList").val() )  != ""  ){
			fdaisBldCnstDivCdList = $("#fdaisBldCnstDivCdList").val() ;	
			
			dataParam.buseList = true;
		}else{
			
		}
		
		if (nullToEmpty( $("#fdaisGrudFlorCntCdList").val() )  != ""  ){
			fdaisGrudFlorCntCdList = $("#fdaisGrudFlorCntCdList").val() ;	
			
			dataParam.buseList = true;
		}else{
			
		}
		$.extend(dataParam,{fdaisBldMainUsgCdList: fdaisBldMainUsgCdList });
		$.extend(dataParam,{fdaisBldCnstDivCdList: fdaisBldCnstDivCdList });
		$.extend(dataParam,{fdaisGrudFlorCntCdList: fdaisGrudFlorCntCdList });
		
		if(m_bSKT == false){
			var fdaisDtStart = $("#fdaisDtStart").val().replaceAll(/-/gi, "");
			var fdaisDtEnd = $("#fdaisDtEnd").val().replaceAll(/-/gi, "");
			
			if(fdaisDtStart != null && fdaisDtStart != '')
				dataParam.fdaisDtStart = $("#fdaisDtStart").val().replaceAll(/-/gi, "") + "01";
			if(fdaisDtEnd != null && fdaisDtEnd != '')
				dataParam.fdaisDtEnd = $("#fdaisDtEnd").val().replaceAll(/-/gi, "") + "31";
		}
		dataParam.bSKT = m_bSKT;
		//showProgress(gridId);
		bodyProgress();
		if(dataParam.buseList != undefined && dataParam.buseList == true){
			buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/postList', dataParam, 'POST', 'buildingInfoList');
		}
		else
			buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/list', dataParam, 'GET', 'buildingInfoList');
	}
	
	//request
	function buildingRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successBuildingInfoCallback(response, sflag);})
    	  .fail(function(response){failBuildingInfoCallback(response, sflag);})
    	  //.error();
    }
	
	function buildingCommonRequest(comGrpCd ,sflag){
		var requestParam = { comGrpCd : comGrpCd };
		
		Tango.ajax({
			//url : 'tango-transmission-biz/transmisson/demandmgmt/common/bizcodelist/',
			url : 'tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/',
			data : requestParam,
			method : 'GET'
		}).done(function(response){successBuildingInfoCallback(response, sflag);})
		  .fail(function(response){failBuildingInfoCallback(response, sflag);})
	}
	
	
	//request 성공시
    function successBuildingInfoCallback(response, flag){
    	if(flag == 'buildingInfoList'){
    		//hideProgress(gridId);
    		bodyProgressRemove();
    		var serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    		
    		$('#'+gridId).alopexGrid("dataSet", response.list, serverPageinfo);
    		
    		if(response.list.length == 0) {
    			//alertBox('I',buildingInfoMsgArray['noInquiryData']);
    		}
    		
    		//$("#total").html(response.pager.totalCnt);	
    	}
    	else if(flag == 'buildingInfoDelete') {
    		//alertBox('I',buildingInfoMsgArray['normallyProcessed']);
    		callMsgBox('','I', buildingInfoMsgArray['normallyProcessed'], function(msgId, msgRst){  
        		if (msgRst == 'Y') {
        			$('#search').click();
        		}
        	});
    		
    	}
    	else if(flag == 'excelDownloadbybatch') {
    		bodyProgressRemove();
    		
    		if(response.jobInstanceId != "") {
    			$("#excelFileId").val(response.jobInstanceId);
        		/*
        		$("#excelDownloadByBatch").css("display", "none");
        		$("#excelDownloading").css("display", "");
        		*/
        		//alertBox('I',"엑셀 다운로드가 실행되었습니다.<br>해당 페이지를 새로고침 하거나<br>다른 페이지로 넘어갈경우<br>다운받을수 없습니다.<br>EXCEL 생성중 버튼이 사라질때까지 기다려주시기 바랍니다.");
        		refreshFlag = true;
        		excelDownloadbybatchPop();
        		//refreshInterval = setInterval(function() { excelDownloadbybatchStatusRefresh(); }, 10000);
    		}	
    		else {
    			alertBox('W',"엑셀 파일 생성 하는데 실패 하였습니다.");
    		}
    	}
    	else if(flag == 'getUserBpInSKB'){
    		if(response.list == null){
    			m_bSKT = true;
    			$('#bSKT').show();
    	    	$('#bSKB').hide();
    	    	$('#fdaisExcelUpload').hide();
    	    	$('#wreSrvcTypCdReg').hide();
    	    //	$('#fdaisBp').setEnabled(false);
    	    //	$('#bUseBpFilter').setEnabled(false);
    		}
    		else{
    			m_bSKT = false;
    			$('#bSKT').hide();
    	    	$('#bSKB').show();
    	    	$('#wreSrvcTypCdReg').show();
    		}
    		initDetailGrid(gridId, m_bSKT, true);
    		
        	setCombo();
    		setEventListener();
        	
        	openPopup();
    		
    		if(m_bSKT == false){
    			buildingCommonRequest('C00648', 'getfdaisBldMainUsgCdList'); //주용도 코드
            	buildingCommonRequest('C00647', 'getfdaisBldCnstDivCdList'); //건축구분 코드
            	buildingCommonRequest('C00653', 'getfdaisGrudFlorCntCdList'); //지상층 코드
    		}
    	}
    	else if(flag == 'getfdaisBldMainUsgCdList'){
    		$('#fdaisBldMainUsgCdList').setData({
    			data : response
    		});
    		$('#fdaisBldMainUsgCdList').prepend('<option value="">선택</option>');
    		BasicSet(m_bSKT);
    	}
    	else if(flag == 'getfdaisBldCnstDivCdList'){
    		$('#fdaisBldCnstDivCdList').setData({
    			data : response
    		});
    		$('#fdaisBldCnstDivCdList').prepend('<option value="">선택</option>');
    		BasicSet(m_bSKT);
    	}
    	else if(flag == 'getfdaisGrudFlorCntCdList'){
    		$('#fdaisGrudFlorCntCdList').setData({
    			data : response
    		});
    		$('#fdaisGrudFlorCntCdList').prepend('<option value="">선택</option>');
    		BasicSet(m_bSKT);
    	}
    	
    	/*else if(flag == 'excelDownloadbybatchStatus') {
    		bodyProgressRemove();
    		if(response.Result == "IdIsNull") {
    			alertBox('W',"엑셀 다운로드 상태를 확인할 Key 가 없습니다.");
    			$("#excelDownloading").css("display", "none");
	    		$("#excelDownloadComplate").css("display", "none");
	    		$("#excelDownloadByBatch").css("display", "");
    		}
    		else if(response.Result == "SearchFail") {
    			alertBox('W',"엑셀 다운로드 할 파일이 존재 하지 않습니다.");
    			$("#excelDownloading").css("display", "none");
	    		$("#excelDownloadComplate").css("display", "none");
	    		$("#excelDownloadByBatch").css("display", "");
    		}
    		else {
    			if(response.jobStatus == "ok") {
    				refreshFlag = false;
    	    		clearInterval(refreshInterval);
    				
    	    		callMsgBox('', 'I', '엑셀 파일이 생성 되었습니다.<br>확인버튼을 누르면 자동 다운로드 됩니다.', function(msgId, msgRst){
    	        		if (msgRst == 'Y') { 
    	        			$("#excelDownloading").css("display", "none");
    	    	    		$("#excelDownloadComplate").css("display", "");
    	    	    		$("#excelDownloadByBatch").css("display", "none");
    	        			
    	    	    		$("#excelDownloadComplate").click();
    	        		}
    	    		});
    			}
    			else if(response.jobStatus =="running") {
    				alertBox('I',"엑셀 파일을 생성중 입니다.<br>잠시만 기다려주시기 바랍니다.");
    				//setTimeout(function(){ $("excelDownloading").click(); } , 1000*5 );
    			}
    			else if(response.jobStatus =="error") {
    				alertBox('W',"엑셀 파일을 생성하는데 실패 하였습니다.");
    				
    				refreshFlag = false;
    				clearInterval(refreshInterval);
    				
    				$("#excelDownloading").css("display", "none");
    	    		$("#excelDownloadComplate").css("display", "none");
    	    		$("#excelDownloadByBatch").css("display", "");
    			}
    			else {
    				
    			}
    		}
    	}
    	else if(flag == 'excelDownloadbybatchStatusRefresh') {
    		bodyProgressRemove();
    		if(response.Result == "IdIsNull") {
    			alertBox('W',"엑셀 다운로드 상태를 확인할 Key 가 없습니다.");
    		}
    		else if(response.Result == "SearchFail") {
    			alertBox('W',"엑셀 다운로드 할 파일이 존재 하지 않습니다.");
    		}
    		else if(response.Result == "Success"){
    			if(response.jobStatus == "ok") {
    				refreshFlag = false;
    	    		clearInterval(refreshInterval);

    	    		$("#excelDownloading").css("display", "none");
    	    		$("#excelDownloadComplate").css("display", "");
    	    		$("#excelDownloadByBatch").css("display", "none");
        			
    	    		$("#excelDownloadComplate").click();
    			}
    			else if(response.jobStatus =="running") {
    				
    			}
    			else if(response.jobStatus =="error") {
    				refreshFlag = false;
    				clearInterval(refreshInterval);
    				
    				alertBox('W',"엑셀 파일을 생성하는데 실패 하였습니다.");
    				
    				$("#excelDownloading").css("display", "none");
    	    		$("#excelDownloadComplate").css("display", "none");
    	    		$("#excelDownloadByBatch").css("display", "");
    			}
    			else {
    				
    			}
    		}
    		else {
    			alertBox('W',"엑셀 파일을 생성하는데 실패 하였습니다.");
				
				refreshFlag = false;
				clearInterval(refreshInterval);
				
				$("#excelDownloading").css("display", "none");
	    		$("#excelDownloadComplate").css("display", "none");
	    		$("#excelDownloadByBatch").css("display", "");
    		}
    	}*/
    	else if(flag == 'excelDownload') {
    		bodyProgressRemove();
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
    	}
    	else if(flag == 'getBonbuByBpFilter'){
    		
    		bodyProgressRemove();
    		
    		if(response.length > 0){
    			$('#bonbuNm').setData({
        			data : response
        		});
    			$('#bonbuNm').setSelected(response[0].cd);
    			$('#fdaisBp').val($('#userBpNm').val());
    			
    			if(response.length == 1){
    				$('#bonbuNm').setEnabled(false);
    			}
    			else{
    				$('#bonbuNm').setEnabled(true);
    			}
    			
    		}
    		else{
    			m_bIsBpCd = false;
    			$('#bUseBpFilter').setChecked(false);
    			$('#bUseBpFilter').setEnabled(false);
    			if(m_bSKT == true)
    				selectComboCode('bonbuNm', 'Y', 'C00623', '');
    			else
    				selectSKBbonbuCode('bonbuNm');
    		}
    			
    	}
    }
    
    //request 실패시.
    function failBuildingInfoCallback(serviceId, response, flag){
    	//hideProgress(gridId);
    	bodyProgressRemove();
    	
    	if(refreshInterval != null) {
    		//clearInterval(refreshInterval);
    	}
    	
    	alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
    }
    
    function excelDownloadbybatchPop() {
    	if(refreshFlag) {
    		var jobInstanceId = $("#excelFileId").val();
    		
    		if(jobInstanceId != "") {
    			excelCreatePop(jobInstanceId);
    			//buildingRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/excelcreatebybatchstatus/'+jobInstanceId, null, 'GET', 'excelDownloadbybatchStatusRefresh');
    		}
    	}
    	else {
    		if(refreshInterval != null) {
    			//clearInterval(refreshInterval);
    		}
    	}
    }
    
    function buildInfoDetail(viewFlag, dataParam){
    	
    	if (viewFlag == "INSERT") {
    		dataParam = {"viewFlag" : viewFlag};
    	}
    	else {
    		dataParam.viewFlag = viewFlag;
    	}
    	
    	dataParam.bSKT = m_bSKT;
    	dataParam.bpCd = $('#userBpId').val();
    	
    	$a.popup({
    		popid : 'BuildInfoDetail',
    		url : 'BuildInfoDetail.do',
    		data : dataParam,
    		iframe : true,
    		modal : true,
    		width : 1060,
    		height : 720,
    		title : buildingInfoMsgArray['buildingInformationDetail'],
    		movable : true,
    		callback : function(data){
    			//$('#search').click();
    			/*if(data == 'search') {
    				console.log("조회 시킬 예정");
    				$('#search').click();
    			}*/
    			
    			if(data == true){
    				$('#search').click();
    			}
    		}
    	});
    }
    
        
    function buildHistory(param){
		$a.popup({
			popid : 'BuildInfoHistoryPop',
			url : 'BuildInfoHistoryPop.do',
			data : param,
			iframe : true,
			modal : true,
			width : 950,
			height : 720,
			title : "건물이력 조회",
			movable : true,
			callback : function(data){

			}
		});
    }
    
    function excelCreatePop(jobInstanceId) {
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
    
    function BasicSet(bSKT){
    	if(bSKT == true)	return true;
    	
    	var fdaisBldCnstDivCdList = ['305001', '305003', '305007'];			// 건축구분명 Default
    	var fdaisGrudFlorCntCdList = ['320003', '320004', '320005'];		// 지상층 Default
    	var fdaisBldMainUsgCdList = ['306003', '306004', '306011', '306013', '306020', '306021', '306022', '306023', '306025', '306027', '306028', '306031', '306032', '306033', '306036', '306007'];		// 주용도 Default
    	var i = 0;
    	var len = fdaisBldMainUsgCdList.length;
    	
    	for(i = 0; i < len; i++){
    		$('#fdaisBldMainUsgCdList').multiselect("widget").find(":checkbox[value='"+fdaisBldMainUsgCdList[i]+"']").attr("checked", "checked");
    		$("#fdaisBldMainUsgCdList option[value='" + fdaisBldMainUsgCdList[i] + "']").attr("selected", 1);
    		$('#fdaisBldMainUsgCdList').multiselect("refresh");
    	}
    	
    	len = fdaisGrudFlorCntCdList.length;
    	for(i = 0; i < len; i++){
    		$('#fdaisGrudFlorCntCdList').multiselect("widget").find(":checkbox[value='"+fdaisGrudFlorCntCdList[i]+"']").attr("checked", "checked");
    		$("#fdaisGrudFlorCntCdList option[value='" + fdaisGrudFlorCntCdList[i] + "']").attr("selected", 1);
    		$('#fdaisGrudFlorCntCdList').multiselect("refresh");
    	}
    	
    	len = fdaisBldCnstDivCdList.length;
    	for(i = 0; i < len; i++){
    		$('#fdaisBldCnstDivCdList').multiselect("widget").find(":checkbox[value='"+fdaisBldCnstDivCdList[i]+"']").attr("checked", "checked");
    		$("#fdaisBldCnstDivCdList option[value='" + fdaisBldCnstDivCdList[i] + "']").attr("selected", 1);
    		$('#fdaisBldCnstDivCdList').multiselect("refresh");
    	}
    	
    //	$("#fdaisDtStart").val(getViewDateStrFirstMonth("YYYYMM").replaceAll("-", ''));
    //	$("#fdaisDtEnd").val(getViewDateStr("YYYYMM").replaceAll("-", ''));
    }
});