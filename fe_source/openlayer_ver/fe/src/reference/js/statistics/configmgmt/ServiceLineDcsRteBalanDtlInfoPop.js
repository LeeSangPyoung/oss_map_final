/**
 * ServiceLineDcsDlstDtlInfoPop
 *
 * @author Administrator
 * @date 2023. 12. 20.
 * @version 1.0
 * 
 * ************* 수정이력 ************
 * 2024-05-07  1. 비고1,2 추가후 내용 편집/저장 기능 추가
 */
var gridId = "popDcsRteBalanDtlInfoGrid";
var paramData = null;
var selectDataObj = null;
var returnTieMapping = [];
var gridKey = null;
var gubun = "";
var columnNe = "";
var data = null;
var editMode = false;
$a.page(function() {

	var column = columnMapping("gridId");
	var columnWork = columnMapping("gridIdWork");
    //초기 진입점
	
    this.init = function(id, param) {
		paramData = param;
		$('#hdofcCdPop').val(nullToEmpty(paramData.hdofcCd));
		$('#teamCdPop').val(nullToEmpty(paramData.teamCd));
		$('#tmofCdValPop').val(nullToEmpty(paramData.tmofCdVal));
		$('#tmofCd').val(nullToEmpty(paramData.tmofCdVal));
		$('#eqpCdPop').val(nullToEmpty(paramData.eqpCd));
		$('#dcsDlstSchDivPop').val(nullToEmpty(paramData.dcsDlstSchDiv));
		$('#svlnSclCdPop').val(nullToEmpty(paramData.svlnSclCd));
		
		$('#belongToTitlePop').text(nullToEmpty(paramData.belongToTitle));
		$('#headerTitlePop').text(nullToEmpty(paramData.headerTitle));
		$('#eqpTitlePop').text(nullToEmpty(paramData.eqpNm));
		
		//버튼 초기화
    	$('#btnSave').hide();
    	$('#btnCancel').hide();
    	$('#btnRegEqp').show();
		
		gridKey = nullToEmpty(paramData.dcsDlstSchDiv);
		getGrid("");
        setEventListener();
        //조회
        searchDcsDlstPop();
        
    };
    
    //Grid 초기화
    function getGrid(sType, headerVal) {
  		
  		//조회결과가 있는 경우
  		if(sType == "eqpNm") {

			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal});
			
			$('#' + gridId).alopexGrid({

	            autoColumnIndex : true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
		   		rowClickSelect : true,
		   		rowSingleSelect : true,	            
		   		defaultColumnMapping:{sorting: true},
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:false,
			    height: 550,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnFixUpto: 2,
			    columnMapping: columnNe
			    
			});
  			
  		}
    }         

	//컬럼 구성
	function columnMapping(sType) {		
		var mapping = [];
		
		if(sType == "gridIdWork") {
			mapping.push({ selectorColumn : true, width : '50px' } );

	  	    for(var i = 0 ; i < columnNe.length; i++ ) {
					mapping.push(columnNe[i]);
			}
	  	    
		} else {
			
			var extendMapping = [
									{ key: 'ROWNUMBER', 			align: 'center', 		width: '50px', 		title: '순서' ,rowspan:true ,excludeFitWidth:true  }
									, { key: 'RTE_PATH_VAL', 		align: 'left', 		width: '230px', 				title: '구분'		   ,rowspan:true ,excludeFitWidth:true, sorting: true	}
									, { key: 'RTE_TOTAL_CNT', 		align: 'center', 		width: '80px', 		title: '총수량'   , excludeFitWidth:true 
										, render : {type: 'string', rule : 'comma'} 
									    , inlineStyle : {cursor:'pointer'}
									    }
					               ];

	  	    for(var i = 0 ; i < extendMapping.length; i++ ) {
					mapping.push(extendMapping[i]);
			}
		}

		return mapping;
	}
	
	
   //컬럼 구성
    function renderGrid(addHeader, addColumn) {
    	var headerDiv = addHeader;
    	
    	//칼럼 구성
		if(addColumn != null) {
			if(addColumn != null) {
				columnNe = columnMapping();
				
				$.each(addColumn, function(key, val) {
					$.extend(val, {"inlineStyle" : {cursor:'pointer'} })
					if(val.eqpNm == "BALAN") {
						$.extend(val, {"inlineStyle" : {color: 'red', cursor:'pointer'}})
					}
					if(val.eqpNm == "RMK1" || val.eqpNm == "RMK2") {
						$.extend(val, {"editable": {type:"text"}})
					}
					columnNe.push(val);
				})
			}
			columnWork = columnMapping("gridIdWork");
		} else {
			headerDiv = "";
			columnDiv = "";
		}
		
		getGrid("eqpNm", headerDiv);
    }
	
    /**
     * Function Name : editRow
     * Description   : 행 편집
     * ----------------------------------------------------------------------------------------------------
     * param    	 : btnShowArray. 편집기능이 활성화 될때 보여줄 버튼 ID 리스트
     *                 btnHideArray. 편집기능이 활성화 될때 숨여야될 버튼 ID 리스트
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function editRow(btnShowArray, btnHideArray) {
    	$('#'+gridId).alopexGrid({
    		rowSingleSelect : false,
    		rowInlineEdit : true, //행전체 편집기능 활성화
    	});
    	
    	if(nullToEmpty(btnShowArray) != "") {
    		for(var show = 0; show < btnShowArray.length; show++) {
    			$("#"+btnShowArray[show]).show();
    		}
    	}
    	
    	if(nullToEmpty(btnHideArray) != "") {
    		for(var hide = 0; hide < btnHideArray.length; hide++) {
    			$("#"+btnHideArray[hide]).hide();
    		}
    	}
    	//여기서 편집활성화
    	$('#'+gridId).alopexGrid({columnMapping: columnWork });
    	
    	$("#"+gridId).alopexGrid("startEdit");
    	$('#'+gridId).alopexGrid("viewUpdate");
    }
    
    function setEventListener() { 
    	//취소
   	 	$('#btnCnclPop').on('click', function(e) {
   	 		$a.close(null);
        });  
    	
        //엑셀다운로드
        $('#btnExportExcelGrid').on('click', function(e) {
     	   cflineShowProgressBody();
         	excelDownload();
        });
        
        //편집
        $('#btnRegEqp').on('click', function(e){
	    	$('#btnExportExcelGrid').setEnabled(false);
			isEditing = true;
			editMode = true;
			var btnShowArray = ['btnSave', ,'btnCancel']; // 저장 , 취소
			var btnHideArray = ['btnRegEqp'];
			editRow(btnShowArray, btnHideArray);
        });

        //취소
        $('#btnCancel').on('click', function(e){
        	$('#btnExportExcelGrid').setEnabled(true);
       	 	isEditing = false;
			editMode = false;
       	 	if($('#'+gridId).alopexGrid("dataGet").length <= 0){
       	 		$("#"+gridId).alopexGrid("endEdit");
       	 		return;
       	 	}
       	 	else { 
       	 		searchDcsDlstPop();
       	 	}

   	 		resetGridNoEdit();
        });
        
        //저장
        $('#btnSave').on('click', function(e){
       	 	funcSaveData();
        });
        
        // 그리드 클릭시
		$('#' + gridId).on('click', function(e) {

        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var selectedId = $('#' + gridId).alopexGrid('dataGet', {_state:{selected:true}});
        	
        	if (data == null || editMode == true) {	// 데이터가 선택되지 않거나 편집모드인 경우 미실행
        		return false;
        	}
        	
        	//이하의 숫자를 클릭할 경우에는 팝업이 생성되지 않도록 개선  - 2024-03-06
        	if(data.RTE_PATH_VAL == "발란싱율" || data.RTE_PATH_VAL == "발란싱 위배 E1수") {
        		return false;
        	}
        	
        	var rtePathVal = "";
        	var svlnSclCd = "";
        	//총합계를 클릭시에 상세가 조회되지 않는 현상 개선
        	if(data.RTE_PATH_VAL != "총합계") {
        		rtePathVal = data.RTE_PATH_VAL;
        	}
        	
        	//전체상세에서 RTE_NAME별 회선수가 표시되지 않는 현상 개선 - 2024-03-06
        	if(paramData.svlnSclCd != "000") {
        		svlnSclCd = paramData.svlnSclCd;
        	}
        	
        	var mappKey = nullToEmpty(object.mapping.key);
        	var columnIndex = object.mapping.columnIndex;
        	
        	//장비명의 숫자를 클릭한 경우 이외의 경우에는 상세가 조회되지 않도록 개선  - 2024-03-06  
        	//RTE총수량 숫자 클릭시에는 상세가 조회되도록 개선 - 2024-03-03
        	if(mappKey == "" || mappKey == "ROWNUMBER" || mappKey == "RTE_PATH_VAL"
        		|| mappKey == "E1_RESULT" || mappKey == "MAX_RTE_CNT" || mappKey == "MAX_RATE" || mappKey == "BALAN" || mappKey == "RMK1" || mappKey == "RMK2"  ) {
        		return false;
        	}
        	
        	var eqpNm = "";
        	if(mappKey != "RTE_TOTAL_CNT") {
        		eqpNm = mappKey;	
        	}
        	
			var popParam = {"headerTitle":paramData.headerTitle, "svlnSclCd" : svlnSclCd
				     , "hdofcCd":paramData.hdofcCd, "teamCd":paramData.teamCd , "tmofCd" : nullToEmpty(paramData.tmofCdVal) 
				     , "eqpNm":eqpNm, "rtePathVal":rtePathVal};
			
		    $a.popup({
			  	popid: "popOpenDcsRteDtlInfo",
			  	title: cflineMsgArray['dcsStateDetail'] /* 장비별 RTE현황 상세 */,
				url: getUrlPath() + "/statistics/configmgmt/ServiceLineDcsRteDtlInfoPop.do",
				data: popParam,
				iframe: true,
				modal: true,
				movable:true,
				windowpopup : true,
				width : 1000,
				height : 630,
				callback:function(data){
					if(data != null){
						if(data == 'invalidParamValue'){
				 			alertBox('I', cflineMsgArray['invalidParamValue']); /* 잘못 전달된 값입니다. */
				 			return;
						} 
					}
	
				}
			});  
		});
 		
	};
	
    function getUrlPath() {
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) == ""){
    		urlPath = "/tango-transmission-web";
    	}
    	return urlPath;
    }; 
    
    /**
	 * 작업수정내역저장
	 */
	function funcSaveData() {
		// TODO
		var dataList = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
    	dataList = AlopexGrid.currentData(dataList);
    	if (dataList.length > 0 ){
    		if(fnVaildation(dataList)){
           	 	isEditing = false;
				var updateList = $.map(dataList, function(data){
					
					var saveParam = {
							  "rtePathVal":data.RTE_PATH_VAL
							, "svlnSclCd": nullToEmpty(paramData.svlnSclCd)  
							, "rmk1" : data.RMK1
							, "rmk2" : data.RMK2
					};
					
					return saveParam;
				});

				callMsgBox('','C', cflineMsgArray['save'], function(msgId, msgRst){   /*전송하시겠습니까?*/
		        	if (msgRst == 'Y') {
						cflineShowProgressBody();
						
						// 등록, 수정
						httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/updateRteNameRmkEditInfo', updateList, 'POST', 'updateEditInfo');
		        	}
				});
				
    		} else {
    			alertBox('I', "잘못된 데이터가 선택되었습니다. "); /* 잘못된 데이터가 선택되었습니다. */
    			$('#'+gridId).alopexGrid("startEdit");
    		}
		}else {
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
			$('#'+gridId).alopexGrid("startEdit");
		}
	}
	
	/**
	 * 총합계, 발란싱율, 발란싱 위배 E1수 항목이 선택된 경우 false
	 */
	function fnVaildation(dataList) {
		
		for(var i=0; i<dataList.length; i++){
			
			if(dataList[i].RTE_PATH_VAL == "총합계" || dataList[i].RTE_PATH_VAL == "발란싱율" || dataList[i].RTE_PATH_VAL == "발란싱 위배 E1수") {
				return false;
        	}
    	}
		return true;
	}
	
    /**
	 * 그리드 편집종료와 버튼 재세팅
	 */
	function resetGridNoEdit() {
		$('#'+gridId).alopexGrid({
			columnMapping: columnNe ,
			rowSingleSelect : true,
    		rowInlineEdit : false, //행전체 편집기능 활성화
		});
		$('#'+gridId).alopexGrid("dataSet", data);
 		$("#"+gridId).alopexGrid("endEdit");
     	$('#'+gridId).alopexGrid("viewUpdate");
     	
    	$('#btnSave').hide();
    	$('#btnCancel').hide();
    	$('#btnRegEqp').show();
	}
	
	// 조회 처리
	function searchDcsDlstPop(){
		var param =  $("#searchDcsDlstRteInfoPopForm").serialize(); 
		cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcsdlst/svlndcsdlstrtedtlinfo', param, 'GET', 'searchDcsDlstPop'); 
	};
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : cflineMsgArray['rteBalanRateState'],	/* RTE 발란싱율 상세세 */
     		sheetList: [{
     			sheetName: cflineMsgArray['rteBalanRateState'],		/* RTE 발란싱율 상세 */
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: false,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
    }
    
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchDcsDlstPop'){

    		//cflineHideProgress(gridId);
    		cflineHideProgressBody();
        	
			renderGrid(response.list.headerList, response.list.keyList);
			
			$('#'+gridId).alopexGrid("dataSet", response.list.getBalanRateReportList);
    		data = response.list.getBalanRateReportList;
			$('#btnExportExcel').setEnabled(true);
    	}

    	//작업 정보 수정 및 데이터 생성
		if(flag == "updateEditInfo"){
			if(response.returnCode == '200'){
    			cflineHideProgressBody();
    			callMsgBox('','I', cflineMsgArray['saveSuccess'], function(msgId, msgRst){ /* 저장완료하였습니다.*/ 
            		if (msgRst == 'Y') {
            			searchDcsDlstPop();
            			//버튼 활성화 재설정
               	 		resetGridNoEdit();
            			editMode = false;
            	    	$('#btnExportExcelGrid').setEnabled(true);
            		}
            	});
    		}else if(response.returnCode == '500'){
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    			$('#'+gridId).alopexGrid("startEdit");
    		}
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchDcsDlstPop'){
    		cflineHideProgress(gridId);
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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