/**
 * OmsOneClick.js
 *
 * @author P123512
 * @date 2018.11.05
 * @version 1.0
 */
$a.page(function() {
	var tangoList = 'tangoList';
	var convList    = 'convList';
	var alm = [];
	var frame = [];
	var sncpType = [];
	var mtsoId = null;
	var headerData = [];
	var rowCnt = 0;

	var chkAdd = null;
	
	this.init = function(id, param) {
		//loading = $('<div id="loading" style="width:500px; height:300px; background : #e2e2e2; z-index:9999999">로딩중</div>').appendTo(document.body).hide();
		setSelectCode();
        initGrid();
        setEventListener();
       
	};
	
	
	
	
	//Grid 초기화
	function initGrid() {
		var tangoColumn = [
		                     { selectorColumn : true, width : '50px' }
		                    , {key : 'selectData', 		align : 'left', 		width : '160px', 		hidden : true													/* 조회된 데이터 여부 */}
		                    , {key : 'ordRow',			align : 'center',		width :	'50px',			title : cflineMsgArray['sequence']							    /* 순번 */ }
		                    , {key : 'jobDivNm',			align : 'center',		width :	'80px',			title : cflineMsgArray['workDivision']	,editable:{type:"text"}/* 작업구분 */ }
		                    , {key : 'useLineNm', 			align : 'left', 		width : '250px', 		title : cflineMsgArray['lnNm']	,editable:{type:"text"}		/* 회선명 */ }
//		                    , {key : 'orglSvlnNo',			align : 'center',		width : '150px',		hidden : true, title : "ORG회선번호" }
//		                    , {key : 'trkNtwkLineNm',			align : 'center',		width : '150px',		hidden : true, title : "트렁크명"}
//		                    , {key : 'orglEqpId',			align : 'center',		width : '150px',		hidden : true, title : "ORG장비ID"}
//		                    , {key : 'orglEqpNm',			align : 'center',		width : '150px',		hidden : true, title : "ORG장비명"}
//		                    , {key : 'orglAportDesc',			align : 'center',		width : '150px',		hidden : true, title : "ORG포트채널A"}
//		                    , {key : 'orglBportDesc',			align : 'center',		width : '150px',		hidden : true, title : "ORG포트채널B"}
		                    , {key : 'eqpNm',			align : 'center',		width : '150px',		title : cflineMsgArray['equipmentName']+"#1",editable:{type:"text"}	/* 장비명#1 */}
		                    , {key : 'aportNm', 			align : 'left', 		width : '120px', 		title : "APORT#1"	,editable:{type:"text"}						/* APORT#1 */ }
		                    , {key : 'bportNm', 			align : 'left', 		width : '120px', 		title : "BPORT#1"	,editable:{type:"text"}	,					/* BPORT#1 */
			                    inlineStyle : function(value,data) {
		  							if(data.tmpBportNm != data.bportNm  && nullToEmpty(data.tmpBportNm)!="") {
		  								return {color: 'red'};
		  							} 
	      						}
		                    }
		                    , {key : 'tmpBportNm', 			align : 'left', 		width : '160px', 	hidden : true													/* DCS간연동시 기존값 */}
		                    , {key : 'rmkRt', 			align : 'left', 		width : '160px', 		title : cflineMsgArray['remark']+"(AON/RT DROP)"	,editable:{type:"text"}/* 비고(AON/RT DROP) */}
		                    , {key : 'rtPortPopVal', 	align : 'left', 		width : '160px', 		hidden : true													/* RTPORTVAL 팝업창 return 값 */}
		                    , {key : 'pType', 			align : 'left', 		width : '160px'		, 	hidden : true													/* Type */}
		                    , {key : 'aonName', 		align : 'left', 		width : '160px' 	, 	hidden : true														/* AON_NAME */}
		                    , {key : 'rtName', 			align : 'left', 		width : '160px'		, 	hidden : true													/* RT_NAME */}
		                    , {key : 'pCtp1', 			align : 'left', 		width : '140px', 		title : "CTP1"	,editable:{type:"text"}	,						/* CTP1 */ }
		                    , {key : 'pCtp2', 			align : 'left', 		width : '100px', 		title : "CTP2"										/* CTP2 */}
		                    , {key : 'pCtp3', 			align : 'left', 		width : '100px', 		title : "CTP3"										/* CTP3 */}
		                    , {key : 'pCtp4', 			align : 'left', 		width : '100px', 		title : "CTP4"										/* CTP4 */}
		                    , {key : 'pMs0', 			align : 'left', 		width : '100px', 		title : "M&S#0"										/* M&S#0 */}
		                    , {key : 'pMs1', 			align : 'left', 		width : '100px', 		title : "M&S#1"										/* M&S#1 */}
		                    , {key : 'pMs2', 			align : 'left', 		width : '100px', 		title : "M&S#2"										/* M&S#2 */}
		                    , {key : 'pMs3', 			align : 'left', 		width : '100px', 		title : "M&S#3"										/* M&S#3 */}
		                    , {key : 'pMs4', 			align : 'left', 		width : '100px', 		title : "M&S#4"										/* M&S#4 */}
		                    , {key : 'pMsvn1', 			align : 'left', 		width : '100px', 		title : "MS_Spring_Virt_Name1"						/* MS_Spring_Virt_Name1 */}
		                    , {key : 'pMsvn2', 			align : 'left', 		width : '100px', 		title : "MS_Spring_Virt_Name2"						/* MS_Spring_Virt_Name2 */}
		                    , {key : 'msvp', 			align : 'left', 		width : '100px', 		title : "MS_Spring_Virt_Port"						/* MS_Spring_Virt_Port */}
		                    , {key : 'msvsr', 			align : 'left', 		width : '100px', 		title : "MS_Spring_Virt_SNCP_RT Port"				/* MS_Spring_Virt_SNCP_RT Port */}
		]

		var convertColumn = [
		                     { selectorColumn : true, width : '50px' } 
		                    , {key : 'ordRow',		align : 'center',		width :	'50px',			title : cflineMsgArray['sequence']	,editable:{type:"text"}			/* 순번 */ }
		                    , {key : 'type', 		align : 'center', 		width : '60px', 		title : "type"						,editable:{type:"text"}			/* type */}
		                    , {key : 'cctype',		align : 'center',		width : '60px',		title : "cc_type"					,editable:{type:"text"}			/* cc_type */}
		                    , {key : 'ccname', 		align : 'left', 		width : '250px', 		title : "CC_Name"					,editable:{type:"text"}			/* CC_Name */}
		                    , {key : 'from', 		align : 'left', 		width : '140px', 		title : "From"						,editable:{type:"text"}			/* From */}
		                    , {key : 'to', 			align : 'left', 		width : '140px', 		title : "To"						,editable:{type:"text"}			/* TO */}
		                    , {key : 'ctp1', 		align : 'left', 		width : '140px', 		title : "CTP_1"						,editable:{type:"text"}			/* CTP_1 */}
		                    , {key : 'ctp2', 		align : 'left', 		width : '100px', 		title : "CTP_2"						,editable:{type:"text"}			/* CTP_2 */}
		                    , {key : 'ctp3', 		align : 'left', 		width : '100px', 		title : "CTP_3"						,editable:{type:"text"}			/* CTP_3 */}
		                    , {key : 'ctp4', 		align : 'left', 		width : '100px', 		title : "CTP_4"						,editable:{type:"text"}			/* CTP_4 */}
		                    , {key : 'frame', 		align : 'left', 		width : '100px', 		title : "Frame"						,editable:{type:"text"}			/* Frame */}
		                    , {key : 'alarm', 		align : 'left', 		width : '100px', 		title : "Alarm"						,editable:{type:"text"}			/* Alarm */}
		                    , {key : 'sncptype', 	align : 'left', 		width : '100px', 		title : "sncp-type"					,editable:{type:"text"}			/* sncp-type */}
		                    , {key : 'ms0', 		align : 'left', 		width : '100px', 		title : "main&spare_0"				,editable:{type:"text"}			/* main&spare_0 */}
		                    , {key : 'ms1', 		align : 'left', 		width : '100px', 		title : "main&spare_1"				,editable:{type:"text"}			/* main&spare_1 */}
		                    , {key : 'ms2', 		align : 'left', 		width : '100px', 		title : "main&spare_2"				,editable:{type:"text"}			/* main&spare_2 */}
		                    , {key : 'ms3', 		align : 'left', 		width : '100px', 		title : "main&spare_3"				,editable:{type:"text"}			/* main&spare_3 */}
		                    , {key : 'ms4', 		align : 'left', 		width : '100px', 		title : "main&spare_4"				,editable:{type:"text"}			/* main&spare_4 */}
		                    , {key : 'msvn1', 		align : 'left', 		width : '100px', 		title : "MSSpring_virt_Name1"		,editable:{type:"text"}			/* MSSpring_virt_Name1 */}
		                    , {key : 'msvn2', 		align : 'left', 		width : '100px', 		title : "MSSpring_Virt_Name2"		,editable:{type:"text"}			/* MSSpring_virt_Name2 */}
		]
		

		for(var i=0; i<convertColumn.length; i++){
			var tmpClmn = convertColumn[i];
			if(nullToEmpty(tmpClmn.key) != "" && nullToEmpty(tmpClmn.key) != "ordRow"){
				var tmpData = {"key": tmpClmn.key, "align": tmpClmn.align, "width": tmpClmn.width, "title": tmpClmn.title};
				headerData.push(tmpData);
			}
		}

		//Grid 생성
		$('#'+tangoList).alopexGrid({
        	autoColumnIndex: true,
        	//autoResize: true,
        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        	rowInlineEdit : false, //행전체 편집기능 활성화
        	cellInlineEdit : true,
        	cellSelectable : true,
    		rowClickSelect : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero: false,
        	defaultColumnMapping:{sorting: true},
        	enableDefaultContextMenu:false,
    		enableContextMenu:true,		
    		pager:false,	
			height : 250,
			columnMapping : tangoColumn
			
			
		});
		
		$('#'+convList).alopexGrid({

        	autoColumnIndex: true,
        	//autoResize: true,
        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        	rowInlineEdit : false, //행전체 편집기능 활성화
        	cellInlineEdit : true,
        	cellSelectable : true,
    		rowClickSelect : false,
        	rowSingleSelect : false,
        	numberingColumnFromZero: false,
        	defaultColumnMapping:{sorting: true},
        	enableDefaultContextMenu:false,
    		enableContextMenu:true,			
			height : 350,
			columnMapping : convertColumn

		});
	};
	
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode(){
        alm.push({"value":"on","text":"on"});
        alm.push({"value":"off","text":"off"});
        frame.push({"value":"f","text":"f"});
        frame.push({"value":"u","text":"u"});
        sncpType.push({"value":"N","text":"N"});
        sncpType.push({"value":"I","text":"I"});
    	
		$('#alm').clear();
		$('#alm').setData({data : alm});
		$('#frame').clear();
		$('#frame').setData({data : frame});
		$('#sncpType').clear();
		$('#sncpType').setData({data : sncpType});
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'tmofCmCdData');
    }

	function setEventListener() {
	/*	$(document).ready(function(){
			//.appendTo(document.body).hide();
			
			$(window).ajaxStart(function(){
				loading.show();
			}).ajaxStop(function(){
				//loading.hide();
				console.log("y");
				return;
			});
			
		});*/
		
	 	// 엔터 이벤트   #searchForm
     	$('.condition_box').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnSearch').click();
    			return false;
    		}
     	});	      	
		//조회 
		$('#btnSearch').on('click', function(e) {
			searchProc(); 
        });
		
		//실행
		$('#btnExeConv').on('click', function(e) {
			if($('#'+tangoList).length == 0) {return;}
    		var dataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}    	
    		$("#"+tangoList).alopexGrid("endEdit");
			cflineShowProgressBody();
			dataList = AlopexGrid.currentData(dataList);
			
			//데이터 "  " 공백, 엔터 변환  
			dataList = dataReset(dataList);
			var chkAdd = false ;
        	if ($("input:checkbox[id='chkAdd']").is(":checked") ){
        		chkAdd = true; 
        	}
			
			var param = {
				"dataList" : dataList
				,"chkAdd" :  chkAdd
				,"alm"  : $('#alm').val()
				,"frame" : $('#frame').val()
				,"sncpType" : $('#sncpType').val()
				,"mtsoId" : $('#tmof').val()
			}
			$('#'+convList).alopexGrid("dataEmpty");
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/convtoomsdata', param, 'POST', 'convToOmsData');
	
        });
		
		
		//행추가
		$('#btnAddRow').on('click', function(e) {
			$('#'+tangoList).alopexGrid({
	    		rowInlineEdit : true, //행전체 편집기능 활성화
	    	});
			var lc = $('#lineCnt').val();
			var addDatas = [];
			
			if(nullToEmpty(lc)=="" || isNaN(lc)==true) {
				var gridLength = $('#'+tangoList).alopexGrid('dataGet').length;
				var addData = { "ordRow" : gridLength+1  };
				$("#"+tangoList).alopexGrid('dataAdd', $.extend({_state:{editing:true}}, addData));
			} else if(isNaN(lc)==false){
				var gridLength = $('#'+tangoList).alopexGrid('dataGet').length;
				for(var idx = 0 ; idx < lc ; idx++) {
					addDatas.push({"ordRow":gridLength+1});
					gridLength = gridLength+1;
				}
				$("#"+tangoList).alopexGrid("dataAdd", addDatas);
			}
			$("#"+tangoList).alopexGrid("endEdit");
        });
		
		//행삭제
		$('#btnDelGrid').on('click', function(e) {
			if($('#'+tangoList).length == 0) {return;}
			$('#'+tangoList).alopexGrid("dataDelete", {_state:{selected:true}});
			
			var gridAll = $('#'+tangoList).alopexGrid('dataGet');
			for(var idx = 0 ; idx < gridAll.length ; idx++ ) {
				$('#'+tangoList).alopexGrid( "cellEdit", idx+1, {_index : { row : gridAll[idx]._index.row}}, "ordRow");
			}
        });
		
        //DCS간연동
		$('#btnTraDcs').on('click', function(e) {
			if($('#'+tangoList).length == 0) {
				alertBox('I', cflineMsgArray['noData']/*"데이터가 없습니다."*/); 
				return;
			}
    		var dataList = $('#'+tangoList).alopexGrid('dataGet');
    		$("#"+tangoList).alopexGrid("endEdit");
			cflineShowProgressBody();
			dataList = AlopexGrid.currentData(dataList);
			//데이터 "  " 공백, 엔터 변환  
			dataList = dataReset(dataList);
			var data = dataList;
			for(var idx = data.length-1 ; idx >= 0 ; idx-- ){
				if( nullToEmpty(data[idx].jobDivNm) =="" ){
					$('#'+tangoList).alopexGrid( "dataDelete",  {_index : { row : idx}});
				}
			}
			//순번 재세팅
			var gridAll = $('#'+tangoList).alopexGrid('dataGet');
			for(var idx = 0 ; idx < gridAll.length ; idx++ ) {
				$('#'+tangoList).alopexGrid( "cellEdit", idx+1, {_index : { row : gridAll[idx]._index.row}}, "ordRow");
			}
			
			var param = {
					"dataList" : dataList
					,"mtsoId" : $('#tmof').val()
				}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/getbportdcs', param, 'POST', 'getBportDcs');
	
        });
//		// 포트적용 버튼 클릭(작업중지)
//		$('#btnApplyDcsPort').on('click', function(e) {
//			if($('#'+tangoList).length == 0) {return;}
//        	$('#'+tangoList).alopexGrid('endEdit', {_state:{editing:true}});
//    		var tmpDataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//    		if (tmpDataList.length == 0 ){
//    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
//    			return;
//    		}    
//			var applyDatas = [];		
//			for(var i = 0 ; i < tmpDataList.length ; i++ ) {
//				var tmpData = tmpDataList[i];
//				if(nullToEmpty(tmpData.orglSvlnNo) == ""){
//	    			alertBox('I', "조회로 생성된 데이터가 아닙니다.");
//					return;
//				}
//				if(nullToEmpty(tmpData.eqpNm) == ""){
//					alertBox('W', makeArgMsg('required', "장비명#1","","","")); /*"(1) 필수 입력 항목입니다.;*/
//					return;
//				}
//				if(nullToEmpty(tmpData.aportNm) == ""){
//					alertBox('W', makeArgMsg('required', "APORT#1","","","")); /*"(1) 필수 입력 항목입니다.;*/
//					return;
//				}
//				if(nullToEmpty(tmpData.bportNm) == ""){
//					alertBox('W', makeArgMsg('required', "BPORT#1","","","")); /*"(1) 필수 입력 항목입니다.;*/
//					return;
//				}
//	    		// aportNm orglSvlnNo orglEqpId orglAportDesc orglBportDesc
//				if(nullToEmpty(tmpData.eqpNm) != nullToEmpty(tmpData.orglEqpNm) || nullToEmpty(tmpData.bportNm)!=nullToEmpty(tmpData.orglBportDesc) || nullToEmpty(tmpData.bportNm)!=nullToEmpty(tmpData.orglBportDesc)){
//					var pushData = {"orglSvlnNo": tmpData.orglSvlnNo, "useLineNm": tmpData.useLineNm, "trkNtwkLineNm": tmpData.trkNtwkLineNm
//								    , "orglEqpId": tmpData.orglEqpId, "orglEqpNm": tmpData.orglEqpNm
//									, "orglAportDesc": tmpData.orglAportDesc, "orglBportDesc": tmpData.orglBportDesc
//									, "aportNm": tmpData.aportNm, "bportNm": tmpData.bportNm};
//					applyDatas.push(pushData);
//				}
//			}
//    		if(applyDatas.length==0){
//    			alertBox('I', "변경된 데이터가 없습니다.");
//				return;
//    			
//    		}
//			alertBox('I', "작업중.");
//			console.log(applyDatas.length);
//			console.log(applyDatas);
//        });
		
		// FTP 버튼 클릭  
		$('#btnTraFtp').on('click', function(e) {
			if($('#'+convList).length == 0) {return;}
    		var dataList = $('#'+convList).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}    	
    		dataList = dataReset(dataList);
    		
    		var listData = getCnvtListData(headerData, dataList);

    		var jobTitle = nullToEmpty($('#jobTitle').val());
    		var dataParams = {"headerList" : headerData, "cnvtList": listData, "tmpTmofCd": nullToEmpty($('#tmof').val()), "jobTitle": jobTitle}
    		
			var popOmsFtpLnkg = $a.popup({
    		  	//popid: "popServcieLineBtsJobList",
    		  	title: cflineMsgArray['omsFtpSend']/*"OMS FTP 전송"*/,
    			url: $('#ctx').val() + "/configmgmt/cfline/OmsFtpLnkgPop.do",
    			data: dataParams,
    			iframe: true,
    			modal: false,
    			movable:true,
    			windowpopup : true,
    			width : 600,
    			height : 300,
    			callback:function(data){
					
    			},errorCallback:function(data){
    				
    			}
    		});      		
        });
	 	// 엑셀 다운로드
		$('#btnExportExcel').on('click', function(e) {		
			if($('#'+convList).length == 0) {return;}
    		var dataList = $('#'+convList).alopexGrid('dataGet', {_state: {selected:true}});
    		if (dataList.length == 0 ){
    			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    			return;
    		}
    		dataList = dataReset(dataList);
    		
    		var listData = getCnvtListData(headerData, dataList);
    		var jobTitle = nullToEmpty($('#jobTitle').val());
    		
    		var dataParams = {"headerList" : headerData, "cnvtList": listData, "jobTitle": jobTitle}
    		    		
    		//console.log(dataParams);
    		cflineShowProgressBody();	
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/convexceldownload', dataParams, 'POST', 'convexceldownload');
    		
        });
	};

	
	/*
	 * 조회 함수
	 */
	function searchProc(){
		var jobTitle = nullToEmpty($('#jobTitle').val());
		
  		if(nullToEmpty(jobTitle) == ""){
	  		alertBox('W', makeArgMsg('required', cflineMsgArray['workName'],"","","")); /*" 작업명은 필수 입력 항목입니다.;*/
	       	return false;
  		}			

		var params =  {"jobTitle": jobTitle, "cmplFieldSchYnVal": "Y"}; // 작업명, 미진행제외
	
		cflineShowProgressBody();		
	
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentaskreqlist', params, 'GET', 'searchJob');
	}	
	
	
	
	//request 성공시
	function successCallback(response, flag) {
		if(flag == 'tmofCmCdData') {
			$('#tmof').setData({data : response.tmofCdList});
			if(response.tmofCdList != null && response.tmofCdList.length > 0){
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'SettingUserTmofCd');
			}
		}
		if(flag == 'SettingUserTmofCd'){
			if(response.userJrdtTmofInfo != null){
				var userTmofCd = "";
				// 소속전송실 셋팅
				for (var i = 0 ; i < response.userJrdtTmofInfo.length; i++) {
					if (response.userJrdtTmofInfo[i].blgtTmofYn == 'Y') {
						userTmofCd = response.userJrdtTmofInfo[i].jrdtTmofId;
						break;
					} 					
				}
//				console.log("userTmofCd=" + userTmofCd);
				if(userTmofCd != "" && userTmofCd != "0"){
					$('#tmof').setSelected(userTmofCd);
				}
			}
		
		}
		
		//OMS데이터 변환
		if(flag == 'convToOmsData') {
			var omsData = response.convToOmsData.cnvtList;
			var tangoData = response.convToOmsData.dataList;
			//에러
			if(response.convToOmsData.resultValue == false) {
				cflineHideProgressBody();
				if(response.convToOmsData.resultCd == "ERR_EMPTY_APORT") {
	    			alertBox('I', response.convToOmsData.resultMsg /* APORT는 필수입력항목입니다. */); 
	    			return false;
				} else if(response.convToOmsData.resultCd == "ERR_RTK") {
	    			alertBox('I', response.convToOmsData.resultMsg /* 중복되는 RT_K명이 있습니다.*/); 
	    			return false;
				} else if(response.convToOmsData.resultCd == "NON_RTK") {
					//팝업창 로딩
					//openRtPortNamePop(response.convToOmsData.ordRow);
					return false;
				} else if(response.convToOmsData.resultCd == "ERR_ENG") {
					alertBox('I', response.convToOmsData.resultMsg /* 에 해당하는 영문이 등록되어있지 않습니다. 기준정보를 등록해주시기 바랍니다.*/); 
	    			return false;
				}
			}
			
			//삭제되어야 할 데이터 삭제
			if(nullToEmpty(omsData) != "" ) {
//				for(var j = omsData.length-1; j >= 0 ; j--) {
//					if(omsData[j].selectYn == false) {
//						omsData.pop();
//					}
//				}
				$('#'+convList).alopexGrid("dataSet", omsData);
				
				for(var idx = 0 ; idx < tangoData.length; idx++ ) {
					var row = parseInt(tangoData[idx].ordRow)-1;
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].pType), {_index : { row : row}}, "pType");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].rtName), {_index : { row : row}}, "rtName");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].pCtp4), {_index : { row : row}}, "pCtp4");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].aonName), {_index : { row : row}}, "aonName");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].pMs0), {_index : { row : row}}, "pMs0");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].pMsvn1), {_index : { row : row}}, "pMsvn1");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].pMsvn2), {_index : { row : row}}, "pMsvn2");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].msvp), {_index : { row : row}}, "msvp");
					$('#'+tangoList).alopexGrid( "cellEdit", nullToEmpty(tangoData[idx].msvsr), {_index : { row : row}}, "msvsr");
					$('#'+tangoList).alopexGrid( "cellEdit", "", {_index : { row : row}}, "rtPortPopVal");
				}
				$('#'+tangoList).alopexGrid('updateOption');
				
				
				var dataList = $('#'+convList).alopexGrid('dataGet');
				dataList = AlopexGrid.currentData(dataList);
				var resultCnt = 1;
				
				//삭제된 데이터 이외의 데이터들은 선택 체크 ( 기존 소스와 동일 구현 )
				for(var idx = 0 ; idx < dataList.length ; idx++ ) {
					$('#'+convList).alopexGrid( "cellEdit", resultCnt, {_index : { row : idx}}, "ordRow");
					dataList[idx]._state.selected = true;
					resultCnt++;
				}
				$('#'+convList).alopexGrid('updateOption');
				cflineHideProgressBody();
			} else if(nullToEmpty(omsData) == ""  ) {
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['noConvertData']/*"변환된 데이터가 없습니다."*/ ); 
			}
			
			
		}
		
		//Bport채우기 ( DCS간연동 (java)) 
		if(flag == 'getBportDcs') {
			var bdata = response.getDcsConnInfo.dataList;
			$('#'+tangoList).alopexGrid("dataSet", bdata);
			cflineHideProgressBody();
		}
		
    	if(flag == 'searchJob'){
    		
    		if(response.reqList != null && response.reqList.length == 1 ){
        		cflineHideProgressBody();
    			// 회선조회 
    			var param = {svlnSclCd: response.reqList[0].svlnSclCd, "jobId":response.reqList[0].jobId};    			
    			// 팝업창으로 조회 
    			popJobDataOpen(param);
    			
    		}else if(response.reqList != null && response.reqList.length > 1 ){
        		cflineHideProgressBody();
    			var popServcieLineBtsJobList = $a.popup({
        		  	//popid: "popServcieLineBtsJobList",
        		  	title: cflineMsgArray['btsLineJobList']/*"기지국회선 작업 목록"*/,
        			url: $('#ctx').val() + "/configmgmt/cfline/ServiceLineBtsJobListPop.do",
        			data: response,
        			iframe: true,
        			modal: true,
        			movable:false,
        			windowpopup : false,
        			width : 800,
        			height : 500,
        			callback:function(data){
    					if(data != null){
				    		$("#jobTitle").val(data.jobTitle);
				    		var param = {svlnSclCd: data.svlnSclCd, "jobId": data.jobId};
    		    			// 팝업창으로 조회 
    		    			popJobDataOpen(param);
    					}
        			},errorCallback:function(data){
//        				//console.log(data);
        			}
        			
        		});
    		}else{
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['noInquiryData'] /* 조회된 데이터가 없습니다. */); 
    		}	
    	}  
    	// 변환 데이터 엑셀 다운로드
    	if(flag == "convexceldownload"){
			cflineHideProgressBody();
    		if(nullToEmpty(response.fileName) != ""){
	    		var $form=$('<form></form>');
					$form.attr('name','downloadForm');
					$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/exceldownload");
					$form.attr('method','GET');
					$form.attr('target','downloadIframe');
					// 2016-11-인증관련 추가 file 다운로드시 추가필요 
					$form.append(Tango.getFormRemote());
					$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
					$form.appendTo('body');
					$form.submit().remove();
    		}else{
        		alertBox('I', cflineMsgArray['failFileDownLoad']); /* 파일 다운로드에 실패했습니다.*/
    		}
    		
    	}
	}
	 
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'searchList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'searchJob'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	// 변환 데이터 엑셀 다운로드
    	if(flag == "convexceldownload"){
			cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['failFileDownLoad']); /* 파일 다운로드에 실패했습니다.*/
			
    	}
    	//DCS간연동
    	if(flag == "getBportDcs"){
			cflineHideProgressBody();
			alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
			
    	}
    	// OMS 데이터 변환
    	if(flag == "convToOmsData"){
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['failDataConvert']/*"데이터 변환 실패하였습니다."*/); 
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }
    
    //  Task 작업의 노드 선번 목록 창 팝업 
    function popJobDataOpen(paramData){
		var tmofCd = nullToEmpty($('#tmof').val());  
		paramData.tmofCdVal = tmofCd;
		var popNodeSvlnLnoList = $a.popup({
		  	//popid: "popServcieLineBtsJobList",
		  	title: cflineMsgArray['btsLineNodeLnoList']/*"기지국회선 노드 선번 목록"*/,
			url: $('#ctx').val() + "/configmgmt/cfline/OmsSvlnLnoListPop.do",
			data: paramData,
			iframe: true,
			modal: true,
			movable:false,
			windowpopup : false,
			width : 1200,
			height : 700,
			callback:function(data){
				if(data != null && data.length > 0){
					//console.log(data);
					for(var i=0; i<data.length; i++){
						var gridLength = $('#'+tangoList).alopexGrid('dataGet').length;
						var addData = { "ordRow" : gridLength+1  };
						$("#"+tangoList).alopexGrid('dataAdd', $.extend({_state:{editing:true}},  data[i]));
						$('#'+tangoList).alopexGrid( "cellEdit", addData, {_index : { row : gridLength}}, "ordRow");
					}
					$("#"+tangoList).alopexGrid("endEdit");
				}else{
		    		//console.log("===============1");
				}
			},errorCallback:function(data){
//				console.log(data);
			}    	
		});
    }

    // 그리드 데이터에서 변환 데이터만 추출 
	function getCnvtListData(headers, datas){
		var returnDatas = [];
		for(var i=0; i<datas.length; i++){
			var tmpData = datas[i];
			var headerArr = {};
			for(var k=0; k<headers.length; k++){
				var tmpHeader = headers[k];
				headerArr[tmpHeader.key] = nullToEmpty(tmpData[tmpHeader.key]);	
			}
			returnDatas.push(headerArr);
		}
		return returnDatas;
	}    
	
	/*
	########################중요 사항################################
		그리드에 복사로 입력하면 "\n"과 " " 이 추가 되는 현상이 발생함.
		따라서 아래와 같이 해당값을 없애는 기능을 추가함. 
	########################중요 사항################################
	 */
	
	
	// 변환 그리드 데이터 
	function dataReset(dataList) {
		for(var idx = 0 ; idx < dataList.length; idx++ ) {
			if(nullToEmpty(dataList[idx].type)!="") {
    			dataList[idx].type = replaceToEmpty(dataList[idx].type);
			}
			if(nullToEmpty(dataList[idx].cctype)!="") {
    			dataList[idx].cctype = replaceToEmpty(dataList[idx].cctype);
			}
			if(nullToEmpty(dataList[idx].ccname)!="") {
    			dataList[idx].ccname = replaceToEmpty(dataList[idx].ccname);
			}
			if(nullToEmpty(dataList[idx].from)!="") {
    			dataList[idx].from = replaceToEmpty(dataList[idx].from);
			}
			if(nullToEmpty(dataList[idx].to)!="") {
    			dataList[idx].to = replaceToEmpty(dataList[idx].to);
			}
			if(nullToEmpty(dataList[idx].ctp1)!="") {
    			dataList[idx].ctp1 = replaceToEmpty(dataList[idx].ctp1);
			}
			if(nullToEmpty(dataList[idx].ctp2)!="") {
    			dataList[idx].ctp2 = replaceToEmpty(dataList[idx].ctp2);
			}
			if(nullToEmpty(dataList[idx].ctp3)!="") {
    			dataList[idx].ctp3 = replaceToEmpty(dataList[idx].ctp3);
			}
			if(nullToEmpty(dataList[idx].ctp4)!="") {
    			dataList[idx].ctp4 = replaceToEmpty(dataList[idx].ctp4);
			}
			if(nullToEmpty(dataList[idx].sncptype)!="") {
    			dataList[idx].sncptype = replaceToEmpty(dataList[idx].sncptype);
			}
			if(nullToEmpty(dataList[idx].msvn1)!="") {
    			dataList[idx].msvn1 = replaceToEmpty(dataList[idx].msvn1);
			}
			if(nullToEmpty(dataList[idx].msvn2)!="") {
    			dataList[idx].msvn2 = replaceToEmpty(dataList[idx].msvn2);
			}
		}
		return dataList;
	}
	
	
	
	//RT Port Name Input 
//	function openRtPortNamePop(ordRow){
//		cflineHideProgressBody();
//	   	var urlPath = $('#ctx').val();
//	   	if(nullToEmpty(urlPath) ==""){
//	   		urlPath = "/tango-transmission-web";
//	   	}
//	 /*  	var dataParam = {
//	   			"eqpNm" : gridDataVal["eqpNm#" + fieldNumVal]
//	   			,"portChnl" : gridDataVal["aportNm#" + fieldNumVal]
//	   			,"trunkNm" : gridDataVal["useTrkNtwkLineNm#" + fieldNumVal]
//	   	}*/
//	   	var RmIdlenessListPop = $a.popup({
//			popid: "OmsRtPortInputPop",
//		  	title: "순번 : "+ordRow+" RT Port Name 입력"/* RT Port Name 입력 */,
//			url: $('#ctx').val()+'/configmgmt/cfline/OmsRtPortInputPop.do',
//			//data : dataParam,
//		  	iframe:true,
//			modal: true,
//			movable:true,
//			//windowpopup : false,
//			movable:true,
//			width : 320,
//			height : 200,
//			callback:function(data){
//				if(data != null) {
//					$('#'+tangoList).alopexGrid( "cellEdit", data, {_index : { row : ordRow-1}}, "rtPortPopVal");
//					$("#"+convList).alopexGrid('dataEmpty');
//					$("#"+tangoList).alopexGrid("endEdit");
//					cflineShowProgressBody();
//					var dataList = $('#'+tangoList).alopexGrid('dataGet',{_state:{selected:true}});
//					dataList = AlopexGrid.currentData(dataList);
//					var chkAdd = false ;
//		        	if ($("input:checkbox[id='chkAdd']").is(":checked") ){
//		        		chkAdd = true; 
//		        	}
//					var param = {
//						"dataList" : dataList
//						,"chkAdd" :  chkAdd
//						,"alm"  : $('#alm').val()
//						,"frame" : $('#frame').val()
//						,"sncpType" : $('#sncpType').val()
//						,"mtsoId" : $('#tmof').val()
//					}
//					$('#'+convList).alopexGrid("dataEmpty");
//					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/omsoneclick/convtoomsdata', param, 'POST', 'convToOmsData');
//				} 
////				//다른 팝업에 영향을 주지않기 위해
////				$.alopex.popup.result = "";
//			}  
//	   		,xButtonClickCallback : function(el){
//				alertBox('I', "입력완료를 눌러주세요.");  
//				return false;
//			}
//		});
//	}
});