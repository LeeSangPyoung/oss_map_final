/**
 * ServiceLineBtskWritePop.js
 *
 * @author Administrator
 * @date 2018. 10. 10
 * @version 1.0
 */
var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터
var TmofAllData = [];  // 전송실 데이터 - selectBox
var gridWriteId= 'alGrid';
var userJrdtTmofInfoPop = "";
var upTmofOrgId = "";
var upTmofTeamId = "";
var lowTmofOrgId = "";
var lowTmofTeamId = "";
var OgIcData = [];
var OgIcAllData = [];
var OgIcSomeData = [];
var jobTypeInData = [];
var jobTypeUpData = [];
var jobTypeDelData = [];
var jobTypeData = [];
var tmpTaskCmplYn = "";
var mappingOpenTask = [];
var taskCmplYn = "1";
var orgSvlnSclCdPopVal = "";
var orgRadioVal = "1";
var tieComp = "";             // 교환기, 상호접속
var btsTieComp = "";			// 기지국 감설 제외
var lineTieComp = "";			// 감설, 기지국,교환기 수변
var initSvlnSclCd = "";

$a.page(function() {

    this.init = function(id, param) {
    	initSvlnSclCd = nullToEmpty(param.svlnSclCd);
    	if(initSvlnSclCd != "001" && initSvlnSclCd != "003"){
    		initSvlnSclCd = "002";  // 교환기, 상호접속간 제외한 나머지는 기지국간.
    	}
//    	console.log("initSvlnSclCd=" + initSvlnSclCd);
    	userJrdtTmofInfoPop = "";

    	var tDay = getTodayStr("-");    	  
    	$('#makeDatePop').val(tDay);
    	$('#deadlinePop').val(tDay);
    	$('#reportDatePop').val(tDay);
    	setSelectCode();
        setEventListener();   
        initGrid();
    };
   
    //Grid 초기화
    function initGrid(svlnSclCd, taskCmplYn) {
    	mappingOpenTask = mappingGrid002001();
    	if(svlnSclCd =="001"){							 // 교환기간
    		if(taskCmplYn == "1"){
    			mappingOpenTask = mappingGrid001001();
    		}else if(taskCmplYn == "3"){
    			mappingOpenTask = mappingGrid000003();
    		}else{
    			mappingOpenTask = mappingGrid001005();
    		}
    	}else if(svlnSclCd =="002"){					 //	기지국간
    		if(taskCmplYn == "1"){
    			mappingOpenTask = mappingGrid002001();
    		}else if(taskCmplYn == "3"){
    			mappingOpenTask = mappingGrid000003();
    		}else{
    			mappingOpenTask = mappingGrid002005();
    		}
    	}else if(svlnSclCd == "003"){				 //	상호접속
    		if(taskCmplYn == "1"){
    			mappingOpenTask = mappingGrid003001();
    		}else if(taskCmplYn == "3"){
    			mappingOpenTask = mappingGrid000003();
    		}
    	}
    	
        //그리드 생성 
        $('#'+gridWriteId).alopexGrid({
			cellSelectable : false,
			pager : false,
			rowClickSelect : true,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 300,
        	columnMapping : mappingOpenTask
        });   
    	
    };
    
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getbmtsosclcdlist', null, 'GET', 'svlnSclBmtsoCodeDataPop');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/gettmoforglislist', null, 'GET', 'tmofCodeDataPop');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getopentaskcommcode', null, 'GET', 'taskCommCodeDataPop');
    }

    function setEventListener() {     	
    	// 회선유형 선택시
     	$('#svlnSclCdPop').on('change',function(e){
     		var gridData = $('#' + gridWriteId).alopexGrid("dataGet");
				if(gridData.length > 0){ // 그리드에 입력한 작업정보가 있을시
					if(orgSvlnSclCdPopVal != $('#svlnSclCdPop').val()){
						callMsgBox('','C', cflineMsgArray['openTaskWriteNotice'], function(msgId, msgRst){  
							if (msgRst == 'Y') {
								tieComp = "";
								btsTieComp = "";
								lineTieComp = "";
								$('#'+gridWriteId).alopexGrid("dataEmpty");
								$('#newAndIncrease').setSelected();
					     		var svlnSclCdVal = $('#svlnSclCdPop').val();
					     		if(svlnSclCdVal == '003'){
					     			$('#addOrDecreaseLine').setEnabled(false);
					     		}else{
					     			$('#addOrDecreaseLine').setEnabled(true);
					     		}
								orgSvlnSclCdPopVal = $('#svlnSclCdPop').val();
								setOgIcData();  // OGIC select box 회선 유형에 따른 데이터 처리
				       		}else{
				       			$('#svlnSclCdPop').setSelected(orgSvlnSclCdPopVal);
				       		}
				       	});
		     		}
				}else{
					$('#newAndIncrease').setSelected();
		     		var svlnSclCdVal = $('#svlnSclCdPop').val();
		     		if(svlnSclCdVal == '003'){
		     			$('#addOrDecreaseLine').setEnabled(false);
		     		}else{
		     			$('#addOrDecreaseLine').setEnabled(true);
		     		}
					orgSvlnSclCdPopVal = $('#svlnSclCdPop').val();
					setOgIcData();  // OGIC select box 회선 유형에 따른 데이터 처리
				}
       	});   
     	
    	
		// 그리드 행추가
		$('#btnAddRow').on('click', function(e) {
			var lineCnt = 1;
			if(nullToEmpty($('#lineCnt').val()) != ""){
				lineCnt = $('#lineCnt').val();
			}
			for(i=0; i<lineCnt; i++){
//				console.log(lineCnt);
				addRow();
			}
			
        });
        
        // 그리드 행삭제
        $('#btnRemoveRow').on('click', function(e) {
        	removeRow();
        });
//        $('#taskCmplYn1').on('click', function(e) {
//        	alert(111);
//        });

        // 라디오 버튼 클릭시
        $('input:radio[name=taskCmplYn]').on('change', function(e) {
        	taskCmplYn = $(this).val();
        	var gridData = $('#' + gridWriteId).alopexGrid("dataGet");
        	if(gridData.length > 0){
        		if(taskCmplYn != orgRadioVal){
	        		callMsgBox('','C', cflineMsgArray['openTaskWriteNotice'], function(msgId, msgRst){  
						if (msgRst == 'Y') {
							tieComp = "";
							btsTieComp = "";
							lineTieComp = "";
			        		var svlnSclCdVal = $('#svlnSclCdPop').val();
			    			if(taskCmplYn == "1" && tmpTaskCmplYn != taskCmplYn){
			    				jobTypeData = jobTypeInData;
			    			}else if(taskCmplYn == "5" && tmpTaskCmplYn != taskCmplYn){
			    				jobTypeData = jobTypeUpData;
			    			}else if(taskCmplYn == "3" && tmpTaskCmplYn != taskCmplYn){
			    				jobTypeData = jobTypeDelData;
			    			}
			    			tmpTaskCmplYn = taskCmplYn;
			    			reSetGrid(svlnSclCdVal, taskCmplYn);
			    			orgRadioVal =taskCmplYn;
			       		}else{
			       			if(orgRadioVal == "1"){
			       				$('#newAndIncrease').setSelected();
			       			}else if(orgRadioVal == "3"){
			       				$('#decreaseLine').setSelected();
			       			}else if(orgRadioVal == "5"){
			       				$('#addOrDecreaseLine').setSelected();
			       			}
			       		}
			       	});
        		}
        	}else{
        		taskCmplYn = $(this).val();
        		var svlnSclCdVal = $('#svlnSclCdPop').val();
    			if(taskCmplYn == "1" && tmpTaskCmplYn != taskCmplYn){
    				jobTypeData = jobTypeInData;
    			}else if(taskCmplYn == "5" && tmpTaskCmplYn != taskCmplYn){
    				jobTypeData = jobTypeUpData;
    			}else if(taskCmplYn == "3" && tmpTaskCmplYn != taskCmplYn){
    				jobTypeData = jobTypeDelData;
    			}
    			tmpTaskCmplYn = taskCmplYn;
    			reSetGrid(svlnSclCdVal, taskCmplYn);
    			orgRadioVal = taskCmplYn;
        	}
        });
        
		
//		$('#'+gridWriteId).on('dblclick', '.bodycell', function(e){
//				
//				var event = AlopexGrid.parseEvent(e);
//				var selected = event.data._state.selected;
//				
//				$('#'+gridWriteId).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
//				
//				var editing_list = $('#'+gridWriteId).alopexGrid('dataGet', {_state: {editing: true}});
//				
//				for(var i = 0; i < editing_list.length; i++){
//					$('#'+gridWriteId).alopexGrid('endEdit', {_index: {id: editing_list[i]._index.id}})
//				}
//				
//				if (checkRowData() == true) {
//					var ev = AlopexGrid.parseEvent(e);
//					$('#'+gridWriteId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
//				}
//		});

		$('#'+gridWriteId).on('dataAddEnd', function(e){
			var addRowIndex = $('#'+gridWriteId).alopexGrid('dataGet').length-1; //전체 행 가져오기
			$('#'+gridWriteId).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "tmofCd" );
			//$('#'+gridWriteId).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "tmofId" );
		});      
    	
    	// 타이검색
    	$('#'+gridWriteId).on('keyup', function(e){
			var event = AlopexGrid.parseEvent(e);
    		if (e.which == 13  ){
    			if(event.data._key.indexOf("Tie") >=0 || event.data._key.indexOf("tie") >=0 ){
    				$('#'+gridWriteId).alopexGrid("endEdit", { _state : { editing : true }} );
        			openTieSearch(e, event.data._key);
    			}
    			if(event.data._key == "mtsoNm"){
    				$('#'+gridWriteId).alopexGrid("endEdit", { _state : { editing : true }} );
        	 	 	var dataObj = AlopexGrid.parseEvent(e).data;
    				openMtsoPopGrid("mtsoId", "mtsoNm", dataObj.lowOrgId, dataObj.mtsoNm);
    			}
    		}
    	});
    	
    	// 타이검색 더블클릭 이벤트
		$('#'+gridWriteId).on('dblclick', function(e) {
			var event = AlopexGrid.parseEvent(e);
			if(event.data._key.indexOf("Tie") >=0 || event.data._key.indexOf("tie") >=0 ){
				$('#'+gridWriteId).alopexGrid("endEdit", { _state : { editing : true }} );
    			openTieSearch(e, event.data._key);
			}
			if(event.data._key == "mtsoNm"){
				$('#'+gridWriteId).alopexGrid("endEdit", { _state : { editing : true }} );
    	 	 	var dataObj = AlopexGrid.parseEvent(e).data;
				openMtsoPopGrid("mtsoId", "mtsoNm", dataObj.lowOrgId, dataObj.mtsoNm);
			}
     	});
    	
    	// 그리드 값 변경시 이벤트
        $('#'+gridWriteId).on('cellValueEditing', function(e){
        	var event = AlopexGrid.parseEvent(e);        	
        	var data = event.data;
        	var rowIndex = data._index.row;
        	var mapping = event.mapping;
        	var $cell = event.$cell;
        	var key = event.mapping.key;
        	
        	var uprOrgIdVal = AlopexGrid.currentValue(data,  "uprOrgId");
    		var lowOrgIdVal = AlopexGrid.currentValue(data,  "lowOrgId");
        	
    		
    		// ogic 편집시
        	if (event.mapping.key == "ogic") {
        		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);
        	}
    		
        	// tie값 편집시
        	if (event.mapping.key.indexOf("Tie") >=0  || event.mapping.key.indexOf("tie") >=0) {
        		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);
        	}
        	
        	// 상위전송실 편집시
        	if (event.mapping.key == "uprOrgId") {
        		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);
        	}
        	
        	// 하위전송실 편집시
        	if (event.mapping.key == "lowOrgId") {
        		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);
        	}
        	
        	// 기지국사 편집시
        	if (event.mapping.key == "mtsoNm") {
        		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);
        	}
        	
        });

		// 취소
		$('#btnPopClose').on('click', function(e) {
			$a.close();
        });
		
		// 등록
		$('#btnPopWrite').on('click', function(e) {
			$('#'+gridWriteId).alopexGrid("endEdit", { _state : { editing : true }} );
			if(validationCheck() == true){
		    	var param =  $("#insertPopForm").getData();
		    	var openTaskSubReqList = $('#'+gridWriteId).alopexGrid("dataGet");
		    	$.extend(param,{openTaskSubReqList : openTaskSubReqList });
//		    	console.log(param);
		    	cflineShowProgress('insertPopPopArea');
		    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/insertopentask', param, 'POST', 'insert');
			}else{
	    		$("#"+gridWriteId).alopexGrid("startEdit");
			}
        });
		


	    // 파일 선택
	    $('#fileSelect').on('click', function(e) {    		
    		var exform  = document.getElementById('excelform');
    		exform.reset();
    		$('#excelFile').click();
        });     
    	$('#excelFile').on('change', function(e) {  
    		$("#textFileNm").text(this.value);
    	});
    	// 업로드 클릭    	
    	$('#btn_up_excel').on('click', function(e) {
    		// svlnSclCdPop excelFile 
    		// cflineMsgArray['decreaseLine']
    		var svlnSclCd = $('#svlnSclCdPop').val();
    	    var svlnSclCdNm =  $('#svlnSclCdPop').getTexts()[0];
    	    var jobTypeCdNm = "";
    	    if(taskCmplYn == "1"){
    	    	jobTypeCdNm = cflineMsgArray['newAndIncrease'];/* 일반(신설/증설) */
    	    }else if(taskCmplYn == "3"){
    	    	jobTypeCdNm = cflineMsgArray['decreaseLine'];/* 감설 */
    	    }else if(taskCmplYn == "5"){
    	    	jobTypeCdNm = cflineMsgArray['addOrDecreaseLine'];/* 수변 */
    	    }

			if ($("#excelFile").val() == null || $("#excelFile").val() == "") {
				alertBox('W', cflineCommMsgArray['selectUploadFile']);/* 업로드할 파일을 선택해 주세요. */
				return;
			}
    		

			var msg =  svlnSclCdNm + " " + jobTypeCdNm;	

			callMsgBox('','C',makeArgCommonMsg("atUploadFile", msg),function(msgId, msgRst){ //'(0)을(를)업로드 하시겠습니까?'
        		if (msgRst == 'Y') {    /*  업로드 하시겠습니까? */
        			$("#uploadSvlnSclCd").val(svlnSclCd);
        			$("#uploadJobTypeCd").val(taskCmplYn);	
        			var param = new FormData(document.getElementById('excelform'));
    				cflineShowProgressBody();
    				httpUploadRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentaskexcel/excelupload'
        			           , param
        			           , 'post'
        			           , 'excelUpload');
				}
			});    		
    	});

    	// 샘플 다운로드
    	$("#btnSample").on('click', function(){
			getExcelFileDown(); 
		});    	
	    
	};
	// 샘플 다운로드 처리 
	function getExcelFileDown(){
		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/opentaskexcel/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="fileName" value="taskUploadExcelFile.xlsx" /><input type="hidden" name="fileExtension" value="xlsx" />');
		$form.append('<input type="hidden" name="type" value="excelSampleFile" />');
		$form.appendTo('body');
		$form.submit().remove();	
	}
	
	
	//그리드 재셋팅
    function reSetGrid(svlnSclCdVal, taskCmplYn){
    	//그리드 재설정후 데이터 지움
		$('#'+gridWriteId).alopexGrid("dataEmpty");
		initGrid(svlnSclCdVal, taskCmplYn);
    }
	
    //tie검색
	function openTieSearch(e, key) {
		$('#'+gridWriteId).alopexGrid("endEdit", { _state : { editing : true }} );
 	 	var dataObj = AlopexGrid.parseEvent(e).data;
 	 	var rowIndex = dataObj._index.row;
		var paramValue = "";
		var tieVal = "";
		var jobTypeCd =	dataObj.jobKind;
		
		var svlnSclCdVal = $('#svlnSclCdPop').val();
		var tieDiv = "TIE"; // TIE 구분 (감설, OG,IC 교환,상호 접속 등등)
		if(key == "tie"){
			tieVal = dataObj.tie
		}else if(key == "ogTie"){
			tieVal = dataObj.ogTie
		}else if(key == "icTie"){
			tieVal = dataObj.icTie
		}else if(key == "adTie"){
			tieVal = dataObj.adTie
		}
//		console.log("jobTypeCd:"+jobTypeCd);
//		console.log("svlnSclCdVal:"+svlnSclCdVal);
//		console.log("key:"+key);
		if(jobTypeCd == "5" && key == "adTie"){  // 기지국간, 교환기간  수변 감설 TIE 검색 adTie
			tieDiv = "ADTIE";
		}else if(svlnSclCdVal =="001" && key == "ogTie"){  // 교환기간 수변 OG TIE 검색 ogTie
			tieDiv = "OGTIE";
		}else if(svlnSclCdVal =="001" && key == "icTie"){  // 교환기간 수변 IC TIE 검색 icTie
			tieDiv = "ICTIE";
		}
		
		if( (dataObj.ogic == null || dataObj.ogic == "") && jobTypeCd != "3" ){ // 상호접속 일반 OG/IC를 선택 안했을때
			$("#"+gridWriteId).alopexGrid("startEdit");
			alertBox('I','OG/IC를 선택해주세요.'); /* og/ic를 선택해주세요. */
			return;
		}
		paramValue = {"svlnSclCd": svlnSclCdVal, "tie": tieVal, "jobTypeCd": jobTypeCd, "gridKey": key, "tieDiv": tieDiv};
		$a.popup({
		  	popid: "popTieGridSch",
		  	title: 'TIE ' + cflineMsgArray['information']/* TIE 정보 */,
		  	url: '/tango-transmission-web/configmgmt/cfline/OpenTaskTieListPop.do',
			data: paramValue,
			modal: true,
			movable:true,
			width : 1100,
			height : 550,
			callback:function(data){
				if(data != null){
					if(data == 'invalidParamValue'){
			 			alertBox('I', cflineMsgArray['invalidParamValue']); /* 잘못 전달된 값입니다. */
			    		$("#"+gridWriteId).alopexGrid("startEdit");
			 			return;
					} 
					if(data == 'minLengthPossible'){
						alertBox('I', makeArgCommonMsg2('minLengthPossible', 'TIE', 5)); /* {0} 항목은 {1}자이상 입력가능합니다. */
			    		$("#"+gridWriteId).alopexGrid("startEdit");
			 			return;
					} 
					if(nullToEmpty(data.tieComp) !=""){
						tieComp = data.tieComp;
					}
					if(nullToEmpty(data.btsTieComp) !=""){
						btsTieComp = data.btsTieComp;
					}
					if(nullToEmpty(data.lineTieComp) !=""){
						lineTieComp = data.lineTieComp;
					}
//					console.log("찍혀랏");
//					console.log(data);
/*					console.log("tieComp>>>>" + tieComp);
					console.log("btsTieComp>>>>" + btsTieComp);
					console.log("lienTieComp>>>>" + lineTieComp);*/
					if(svlnSclCdVal == "002"){ 		//기지국간일떄
			    		$("#"+gridWriteId).alopexGrid("startEdit");
			    		var focusData = $('#'+gridWriteId).alopexGrid("dataGet", {_state : {focused : true}});
			    		var rowIndex = focusData[0]._index.row;
			    		var tmofCd = "";
			    		var tmpData = "";
//		    			var settingData = AlopexGrid.trimData(data[0]);
		    			var settingData = data[0];
		    			
			    		for(i=0; i<TmofAllData.length; i++){
			    			var tmpData = TmofAllData[i];
			    			if(data[0].transroomId != null && data[0].transroomId == tmpData.orgIdLis){
			    				tmofCd = tmpData.value;
			    				break;
			    			}
			    		}
			    		if(data.gubun == "001"){  // 감설
/*							$('#'+gridWriteId).alopexGrid( "cellEdit", data[0].tieOne, {_index : { row : rowIndex}}, key);
							$('#'+gridWriteId).alopexGrid( "cellEdit", data[0].tieOne, {_index : { row : rowIndex}}, key +"Hid");
							$('#'+gridWriteId).alopexGrid( "cellEdit", data[0].svlnNo, {_index : { row : rowIndex}}, "svlnNo");
							$('#'+gridWriteId).alopexGrid( "cellEdit", data[0].lineNm, {_index : { row : rowIndex}}, "lineNm");
							var uprOrgIdVal = AlopexGrid.currentValue(focusData[0],  "uprOrgId" )
				    		var lowOrgIdVal = AlopexGrid.currentValue(focusData[0],  "lowOrgId" )
				    		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);*/
			    			$.each(settingData, function(gridKey, value){
			    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
//			    				
////			    				if(gridKey == "tieOne"){
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key);
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key+"Hid");
////			    				}else{
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
////			    				}
			    			});
							var uprOrgIdVal = AlopexGrid.currentValue(focusData[0],  "uprOrgId" )
				    		var lowOrgIdVal = AlopexGrid.currentValue(focusData[0],  "lowOrgId" )
				    		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);
			    		}else if(data.gubun == "002"){  // 기지국 감설이 아닐때 
			    			$.each(settingData, function(gridKey, value){
			    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
//			    				
////			    				if(gridKey == "tieOne"){
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key);
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key+"Hid");
////			    				}else{
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
////			    				}
			    			});
							$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "uprOrgId");
							$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "lowOrgId");
							getMtsoByTie(data[0].mscId, data[0].bscId, data[0].bts);
			    		}
					}else{ 		//기지국간이아닐때
						$("#"+gridWriteId).alopexGrid("startEdit");
			    		var focusData = $('#'+gridWriteId).alopexGrid("dataGet", {_state : {focused : true}});
			    		var rowIndex = focusData[0]._index.row;
			    		var tmofCd = "";
			    		var tmpData = "";
		    			var settingData = AlopexGrid.trimData(data[0]);
			    		for(i=0; i<TmofAllData.length; i++){
			    			var tmpData = TmofAllData[i];
			    			if(data[0].transroomId != null && data[0].transroomId == tmpData.orgIdLis){
			    				tmofCd = tmpData.value;
			    				break;
			    			}
			    		}
			    		if(data.gubun == "001"){  // 감설 
			    			$.each(settingData, function(gridKey, value){
			    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
//			    				
////			    				if(gridKey == "tieOne"){
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key);
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key+"Hid");
////			    				}else{
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
////			    				}
			    			});
			    		}else{  // 감설이 아닌경우
//		    				console.log("=====================");
//		    				console.log(settingData);
			    			$.each(settingData, function(gridKey, value){
//			    				console.log("gridKey : " + gridKey);
//			    				console.log("value : " + value);
			    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
//			    				
////			    				if(gridKey == "tieOne"){
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key);
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, key+"Hid");
////			    				}else{
////				    				$('#'+gridWriteId).alopexGrid( "cellEdit", value, {_index : { row : rowIndex}}, gridKey);
////			    				}
			    			});
							if(svlnSclCdVal=="001"){
								if(key == "ogTie"){
									$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "uprOrgId");
								}else if(key == "icTie"){
									$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "lowOrgId");
								}
							}else if (svlnSclCdVal == "003"){
								var currData = $('#'+gridWriteId).alopexGrid("dataGetByIndex", { row : rowIndex});
								if(currData.ogic=='002'){
									$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "lowOrgId");	
								}else{
									$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "uprOrgId");	
								}
							}else{
								$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "uprOrgId");
								$('#'+gridWriteId).alopexGrid( "cellEdit", tmofCd, {_index : { row : rowIndex}}, "lowOrgId");
			    			}
			    		}
			    		var uprOrgIdVal = AlopexGrid.currentValue(focusData[0],  "uprOrgId" )
			    		var lowOrgIdVal = AlopexGrid.currentValue(focusData[0],  "lowOrgId" )
			    		stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex);
					}
				}else{
					$("#"+gridWriteId).alopexGrid("startEdit");
				}
			}
		}); 
	}
	
	//타이정보로 기지국사 가져오기getmtsobmtsobytieinfo
    function getMtsoByTie(mscId, bscId, bts){
    	var tieParam = {
    			"mscId" : mscId,
    			"bscId" : bscId,
    			"btsId" : bts
    	}
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getmtsobmtsobytieinfo', tieParam, 'GET', 'getMtsoByTie');
    }
	
    // 로우단위로 그리드 편집시 상태값을 확인한다
    function stateCheck(uprOrgIdVal, lowOrgIdVal, rowIndex){
    	var editData = $('#'+gridWriteId).alopexGrid("dataGetByIndex", {row:rowIndex});
    	var tiePass = false; // 타이체크
    	var tmofCdPass = false; // 상하위 전송실 체크
    	var mtsoPass = true;// 기지국사 체크  - 기지국사는 기지국간에서만 체크한다.
    	var svlnSclCdVal = $('#svlnSclCdPop').val();
    	var jobType = editData.jobKind;
    	
    	//전송실
    	if(uprOrgIdVal !="" && lowOrgIdVal != ""){
    		tmofCdPass = true;
    	}
    	//ogIc
    	var ogic = AlopexGrid.currentValue(editData,  "ogic");
    	if((ogic == "") || (ogic == null) || (ogic == undefined)){
    		ogicPass = false;
    	}else{
    		ogicPass = true;
    	}
    	
    	if(svlnSclCdVal == "001"){  // 교환기간
    		if(jobType == "1" || jobType == "2"){   // 신설, 증설
    			var ogTie = AlopexGrid.currentValue(editData,  "ogTie");
    			var ogTieOne = AlopexGrid.currentValue(editData,  "ogTieOne");
    			var icTie = AlopexGrid.currentValue(editData,  "icTie");
    			var icTieOne = AlopexGrid.currentValue(editData,  "icTieOne");
				mtsoPass = true;
    			if( tieComp == "comp" && (ogTie == ogTieOne) && (icTie == icTieOne) ){
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    		}else if(jobType == "3"){  // 감설 
    			tmofCdPass = true;
    			ogicPass = true;
    			mtsoPass = true;
    			var tie = AlopexGrid.currentValue(editData,  "tie");
    			var tieOne = AlopexGrid.currentValue(editData,  "tieOne");
    			var mtso = AlopexGrid.currentValue(editData,  "mtsoNm");
    			if( lineTieComp == "comp" && (tie == tieOne) ){
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    		}else{  // 수변 
    			var adTie = AlopexGrid.currentValue(editData,  "adTie");
    			var adTieOne = AlopexGrid.currentValue(editData,  "adTieOne");
    			var ogTie = AlopexGrid.currentValue(editData,  "ogTie");
    			var ogTieOne = AlopexGrid.currentValue(editData,  "ogTieOne");
    			var icTie = AlopexGrid.currentValue(editData,  "icTie");
    			var icTieOne = AlopexGrid.currentValue(editData,  "icTieOne");
				mtsoPass = true;
    			if( tieComp == "comp" && lineTieComp == "comp" && (adTie == adTieOne)
    					 &&(ogTie == ogTieOne) && (icTie == icTieOne) )
    			{
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    		}
    	}else if(svlnSclCdVal == "002"){ //기지국간
    		if(jobType == "1" || jobType == "2"){   // 신설, 증설
    			var tie = AlopexGrid.currentValue(editData,  "tie");
    			var tieOne = AlopexGrid.currentValue(editData,  "tieOne");
    			var mtso = AlopexGrid.currentValue(editData,  "mtsoNm");
    			if( btsTieComp == "comp" && (tie == tieOne) ){
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    			if(mtso =="" || mtso == null){
    				var mtsoPass = false;
    			}else{
    				mtsoPass = true;
    			}
    		}else if(jobType == "3"){  // 감설
    			tmofCdPass = true;
    			ogicPass = true;
    			mtsoPass = true;
    			var tie = AlopexGrid.currentValue(editData,  "tie");
    			var tieOne = AlopexGrid.currentValue(editData,  "tieOne");
    			var mtso = AlopexGrid.currentValue(editData,  "mtsoNm");
    			if( lineTieComp == "comp" && (tie == tieOne) ){
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    		}else{  // 수변
    			var adTie = AlopexGrid.currentValue(editData,  "adTie");
    			var adTieOne = AlopexGrid.currentValue(editData,  "adTieOne");
    			var tie = AlopexGrid.currentValue(editData,  "tie");
    			var tieOne = AlopexGrid.currentValue(editData,  "tieOne");
    			var mtso = AlopexGrid.currentValue(editData,  "mtsoNm");
    			if(mtso =="" || mtso == null){
    				mtsoPass = false;
    			}else{
    				mtsoPass = true;
    			}
//		    	console.log("btsTieComp====" + btsTieComp);
//		    	console.log("lineTieComp====" + lineTieComp);
//		    	console.log("adTie====" + adTie);
//		    	console.log("adTieOne====" + adTieOne);
//		    	console.log("tie====" + tie);
//		    	console.log("tieOne====" + tieOne);
    			if( btsTieComp == "comp" && lineTieComp == "comp" && (adTie == adTieOne) && (tie == tieOne) ){
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    		}
    	}else{ // 상호접속
    		if(jobType == "1" || jobType == "2"){  // 신설, 증설
    			var tie = AlopexGrid.currentValue(editData,  "tie");
    			var tieOne = AlopexGrid.currentValue(editData,  "tieOne");
				mtsoPass = true;
    			if( tieComp == "comp" && (tie == tieOne) ){
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    		}else if(jobType == "3"){  // 감설
    			tmofCdPass = true;
    			ogicPass = true;
    			mtsoPass = true;
    			var tie = AlopexGrid.currentValue(editData,  "tie");
    			var tieOne = AlopexGrid.currentValue(editData,  "tieOne");
    			var mtso = AlopexGrid.currentValue(editData,  "mtsoNm");
    			if( lineTieComp == "comp" && (tie == tieOne) ){
    				tiePass = true;
    			}else{
    				tiePass = false;
    			}
    		}
    	}
//    	console.log("ogicPass=" + ogicPass);
//    	console.log("tiePass=" + tiePass);
//    	console.log("tmofCdPass=" + tmofCdPass);
//    	console.log("mtsoPass=" + mtsoPass);
    	if(ogicPass == true && tiePass == true && tmofCdPass == true && mtsoPass == true ){
    		$('#'+gridWriteId).alopexGrid( "cellEdit", "성공", {_index : { row : rowIndex}}, "state");
    	}else{
    		$('#'+gridWriteId).alopexGrid( "cellEdit", "실패", {_index : { row : rowIndex}}, "state");
    	}
    }
    
    // 등록 발리데이션 체크
    function validationCheck() {
    	var jobTitlePop = $('#jobTitlePop'); // 작업명
    	var openTaskSubReqList = $('#'+gridWriteId).alopexGrid("dataGet");
    	//회선선택 정보
		if(nullToEmpty(jobTitlePop.val()) == ""){
			jobTitlePop.focus();
			alertBox('W', makeArgMsg('required',cflineMsgArray['workName'],"","","")); /*"작업명 필수 입력 항목입니다.;*/
			return false;
		}
		if(openTaskSubReqList.length < 1){
			alertBox('W', "작업 정보를 입력해 주세요."); /* 작업 정보를 입력해 주세요. */
			return false;
		}
		for(i=0; i<openTaskSubReqList.length; i++){
			if(openTaskSubReqList[i].state == "실패"){
				alertBox('W', "입력한 작업 정보를 확인해 주세요."); /* 입력한 작업 정보를 확인해 주세요. */
				return false;
			}
		}
    	return true;
    }

    
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
		// 서비스 회선에서 사용하는 소분류 코드(회선유형)
		if(flag == 'svlnSclBmtsoCodeDataPop') {	
    		var option_data =  [];
//			var dataFst = {"value":"","text":cflineCommMsgArray['select']};
//			option_data.push(dataFst);
    		if(response.sclCdList != null){
	    		for(k=0; k<response.sclCdList.length; k++){
	    			var dataScl = response.sclCdList[k]; 
	    			option_data.push(dataScl);
	    		}
    		}
			$('#svlnSclCdPop').clear();
			$('#svlnSclCdPop').setData({data : option_data});
			$('#svlnSclCdPop').setSelected(initSvlnSclCd);
	    	orgSvlnSclCdPopVal = $('#svlnSclCdPop').val();
		} 
		
		if(flag == "tmofCodeDataPop"){
    		if(response.tmofCdList != null && response.tmofCdList.length>0){
    			// 전송실 select 처리
    			var tmof_option_data =  [];
    			for(m=0; m<response.tmofCdList.length; m++){
    				if(m==0){
    					var dataFst = {"value":"","text":cflineCommMsgArray['select'] /* 선택 */};
    					tmof_option_data.push(dataFst);
    				}	
    				tmof_option_data.push(response.tmofCdList[m]);
    			}    
    			TmofAllData = tmof_option_data;
    		}
    	}
		if(flag == "taskCommCodeDataPop"){
    		if(response.ogicCdList != null && response.ogicCdList.length>0){
    			// OGIC코드 select 처리
    			var ogic_option_data =  [];
    			var ogic_some_option_data =  [];
    			for(m=0; m<response.ogicCdList.length; m++){
    				if(m==0){
    					var dataFst = {"value":"","text":cflineCommMsgArray['select'] /* 선택 */};
    					ogic_option_data.push(dataFst);
    					ogic_some_option_data.push(dataFst);
    				}	
    				ogic_option_data.push(response.ogicCdList[m]);
    				if(response.ogicCdList[m].value!="000"){
    					ogic_some_option_data.push(response.ogicCdList[m]);
    				}
    			}    
    			OgIcData = ogic_option_data;
    			OgIcAllData = ogic_option_data;
    			OgIcSomeData = ogic_some_option_data;
    			
    		}
    		if(response.jobTypeCdList != null && response.jobTypeCdList.length>0){
    			// 작업유형코드 select 처리
//    			var option_data =  [];
    			var in_option_data =  [];
    			var up_option_data =  [];
    			var del_option_data =  [];
    			for(k=0; k<response.jobTypeCdList.length; k++){
//    				if(k==0){
//    					var dataFst = {"value":"","text":cflineCommMsgArray['select'] /* 선택 */};
////    					option_data.push(dataFst);
//    					in_option_data.push(dataFst);
//    					up_option_data.push(dataFst);
//    					del_option_data.push(dataFst);
//    				}	
//    				option_data.push(response.jobTypeCdList[k]);
    				if(response.jobTypeCdList[k].value == "1" || response.jobTypeCdList[k].value == "2"){
    					in_option_data.push(response.jobTypeCdList[k]);
    				}else if(response.jobTypeCdList[k].value == "5"){
    					up_option_data.push(response.jobTypeCdList[k]);
					}else if(response.jobTypeCdList[k].value == "3"){
						del_option_data.push(response.jobTypeCdList[k]);
					}
    			}    
    			jobTypeData = in_option_data;
    			jobTypeInData = in_option_data;
    			jobTypeUpData = up_option_data;
    			jobTypeDelData = del_option_data;
    			
    		}
 		
    	}
		
		if(flag == 'getMtsoByTie') {
			if(response.mtsoList.length > 0){
				var ordIdbyTie = response.mtsoList[0].orgId;
				var ordIdNmTie = response.mtsoList[0].orgName;
				var lowOrgIdVal = response.mtsoList[0].btsOrgId;
				$('#'+gridWriteId).alopexGrid( "cellEdit", ordIdbyTie, {_index : { row : rowIndex}}, "mtsoId");
				$('#'+gridWriteId).alopexGrid( "cellEdit", ordIdNmTie, {_index : { row : rowIndex}}, "mtsoNm");
				if(lowOrgIdVal != null && lowOrgIdVal != ""){
					$('#'+gridWriteId).alopexGrid( "cellEdit", lowOrgIdVal, {_index : { row : rowIndex}}, "lowOrgId");
				}
			}
    		stateCheck(null, null, rowIndex);
		}
		
		//등록
		if(flag =="insert"){
    		cflineHideProgress('insertPopPopArea');
//    		console.log();
			if(response.Result == "Success" && response.ResultReq == "Success"){
				var data = {
						Result : "Success", openTaskVO : response.openTaskVO, useTieList : response.useTieList
				};
			}else{
				var data = {
						Result : "Fail", response : response
				};
			}
			$a.close(data);
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	//등록
    	if(flag =="insert"){
    		cflineHideProgress('insertPopPopArea');
			var data = {
					Result : "Fail"
			};
			$a.close(data);
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
    


	//초기 조회 성공시
    function successUploadCallback(response, flag){ 
		
		// 엑셀 업로드 
		if(flag ==  "excelUpload"){
    		cflineHideProgressBody();
    		var data = response;
    		var msg = "";

    		if(data.list != null && data.list.length>0){
    			var openTaskSubReqList = $('#'+gridWriteId).alopexGrid("dataGet");
    			var rowIndex = openTaskSubReqList.length;
        		var svlnSclCdPop = $('#svlnSclCdPop').val();
    			//taskCmplYn
        		if((svlnSclCdPop == "001" || svlnSclCdPop =="003") && taskCmplYn != "3"){
        			tieComp = "comp";             // 교환기, 상호접속
        		}
        		if( taskCmplYn == "3" || taskCmplYn == "5"){
        			lineTieComp = "comp";             // 감설, 기지국,교환기 수변
        		}
        		if( svlnSclCdPop == "002" && (taskCmplYn == "1" || taskCmplYn == "5")){
        			btsTieComp = "comp";             // 기지국 일반(신설/증설)
        		}
    			
    			for(var k =0; k<data.list.length; k++){
    				var initRowData = data.list[k];
	    	    	$('#'+gridWriteId).alopexGrid("dataAdd", initRowData);
    				stateCheck(null, null, (rowIndex +k));
    			}
    	    	$('#'+gridWriteId).alopexGrid("startEdit");
    			
    		}
    		
    		if(data.resultCd == "OK") {
        		msg = cflineCommMsgArray['normallyProcessed']; /* 정상적으로 처리되었습니다. */
				msg += "<br>("+cflineCommMsgArray['success'] +" : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ")";
    		}else if(data.resultCd == "NODATA") {
    			msg = cflineCommMsgArray['noData']; /* 데이터가 없습니다. */
    		}else{
				msg = cflineCommMsgArray['existFailUploadData']; /* 업로드에 실패한 데이터가 있습니다. */
				if (data.errorCd == "DATA_CHECK_ERROR") {
					msg += "<br>(";
					if (nullToEmpty(data.excelOkCount) != ''  && data.excelOkCount !='0') {
						resultCode = "OK";
						msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
					}
					msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
				}
				if (data.errorCd == "UPLOAD_LIMIT_CNT"){
					msg = cflineMsgArray['excelRowOver']; /* 엑셀 업로드는 최대 1000건 까지만 가능합니다 */
				}
    		}
    		if(nullToEmpty(data.resultCd)=="NG" && nullToEmpty(data.errorCd)=="DATA_CHECK_ERROR"){
    			callMsgBox('', 'I', msg, function() { 
    				var $form=$('<form></form>');
    				$form.attr('name','downloadForm');
    				$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/exceldownload");
    				$form.attr('method','GET');
    				$form.attr('target','downloadIframe');
    				// 2016-11-인증관련 추가 file 다운로드시 추가필요 
    				$form.append(Tango.getFormRemote());
    				$form.append('<input type="hidden" name="fileName" value="' + (response.fileNames + "." + response.extensionNames) + '" />');
    				$form.append('<input type="hidden" name="fileExtension" value="' + response.extensionNames + '" />');
    				$form.append('<input type="hidden" name="type" value="excelUploadFailFile" />');
    				$form.appendTo('body');
    				$form.submit().remove();	
    			});	
    		}else{
    			alertBox('I', msg); 
    		}
		} 
    }
    
    //request 실패시.
    function failUploadCallback(response, flag){
    	if(flag ==  "excelUpload"){
    		cflineHideProgressBody();
    		if(response.message != null && response.message != '') {
    			alertBox('I', response.message);
    		}
    	}
    }

    
    var httpUploadRequest = function(surl, sdata, smethod, sflag ) {
    	Tango.ajax({
    		url : surl, //URL 기존 처럼 사용하시면 됩니다.
    		data : sdata, //data가 존재할 경우 주입
    		method : smethod, //HTTP Method
	    	dataType:'json',
            processData:false,
            contentType:false
    	}).done(function(response){successUploadCallback(response, sflag);})
  	    .fail(function(response){failUploadCallback(response, sflag);})
    }    

//    function setSelectBox(idName, list, setKeyValue){
//		$('#' + idName).clear();
//		if(list != null && list.length>0){
//			$('#' + idName).setData({data : list});
//		}
//		$('#' + idName).prepend('<option value="">' + cflineCommMsgArray['select']/* 선택 */ + '</option>');
//		$('#' + idName).setSelected(setKeyValue);	
//    }
    // 행 추가
    function addRow() {
    	var uprOrgId = TmofAllData[0].value;
    	var lowOrgId = TmofAllData[0].value;
    	
    	var initRowData = [
    	    {
	   	    	 "jobKind" : jobTypeData[0].value 
	 	    	, "ogic" : OgIcData[0].value
	 	    	, "uprOrgId" : uprOrgId 
	 	    	, "lowOrgId" : lowOrgId
	 	    	, "tie" : ''
	 	    	, "state" : cflineMsgArray['failure']		 /* 실패 */
    	    }
    	];
    	$('#'+gridWriteId).alopexGrid("dataAdd", initRowData);
    	$('#'+gridWriteId).alopexGrid("startEdit");
    }
    // 행 삭제 
    function removeRow() {
    	var dataList = $('#alGrid').alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.row;
    		$('#'+gridWriteId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    	
    }
    // OGIC select box 회선 유형에 따른 데이터 처리
    function setOgIcData(){
    	if(orgSvlnSclCdPopVal=="003"){
    		OgIcData = OgIcSomeData;
    	}else{
    		OgIcData = OgIcAllData;
    	}
    }
    

    /**
     * 기지국사 찾기 팝업
     * mostCdGridId : 그리드의 국사 ID key
     * mostNmGridId : 그리드의 국사명 key
     * paramTmofCd : 파라메터로 넘길 전송실 ID
     * paramMtsoCdNm : 파라메터로 넘길 국사명 
     */
    function openMtsoPopGrid(mostCdGridId, mostNmGridId, paramTmofCd, paramMtsoCdNm){
    	if(paramTmofCd == null && paramTmofCd ==""){
	    	alertBox('I', makeArgMsg('required', cflineMsgArray['transmissionOffice'])); /* [{0}] 필수 입력 항목입니다.*/
	    	return;
    	}
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) ==""){
    		urlPath = "/tango-transmission-web";
    	}
    	var paramValue =  {"tmofCd":paramTmofCd,"mtsoCdNm":paramMtsoCdNm} 
    	$a.popup({
    	  	popid: "popMtsoOpenTaskGridSch",
    	  	title: cflineCommMsgArray['findMtso']/* 국사 조회 */,
    	  	url: urlPath + '/configmgmt/cfline/OpenTaskMtsoListPop.do',
    		data: paramValue,
    		modal: true,
    		movable:true,
    		width : 650,
    		height : 550,
    		callback:function(data){
    			if(data != null){
    				if(data=='noTmofCd'){
    					alertBox('I', makeArgMsg('required', cflineMsgArray['transmissionOffice'])); /* [{0}] 필수 입력 항목입니다.*/
    					$("#"+gridWriteId).alopexGrid("startEdit");
	    				return;
    				}
    	    		var focusData = $('#'+gridWriteId).alopexGrid("dataGet", {_state : {focused : true}});
    	    		var rowIndex = focusData[0]._index.row;
    				$('#'+gridWriteId).alopexGrid( "cellEdit", data[0].orgId, {_index : { row : rowIndex}}, mostCdGridId);
    				$('#'+gridWriteId).alopexGrid( "cellEdit", data[0].orgName, {_index : { row : rowIndex}}, mostNmGridId);
    				$("#"+gridWriteId).alopexGrid("startEdit");
    			}else{
    				$("#"+gridWriteId).alopexGrid("startEdit");
    			}
    		}
    	}); 		
    }        
});