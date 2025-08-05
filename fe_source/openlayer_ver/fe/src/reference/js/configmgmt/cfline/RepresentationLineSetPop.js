/**
 * RepresentationLinePop
 *
 * RU 광코어 고도화 - 대표회선 설정
 * @author P123511
 */

var representationGrid = "representationGrid";	// 대표회선 그리드
var ruGrid = "ruGrid";	// 광공유회선 그리드
var targetGrid = "targetGrid";		// 광공유회선 선번 그리드

var initParam = null;		// 마스터 그리드에서 넘겨준 정보
var orginalOptl = null;		// 오리지널 대표회선

var netCfgMeansSvlnNo = null;

$a.page( function() {
	this.init = function(id, param) {
		initParam = param;
		
		$('#btnPopSave').setEnabled(false);
		setSelectList(initParam.svlnNo, initParam.optlShreRepSvlnNo);
        setEventListener();
    	initGrid();
	};
	
	// Grid 초기화
	function initGrid() {
		
		// 대표회선 그리드 생성
		$('#' + representationGrid).alopexGrid({
			autoColumnIndex : true ,
    		autoResize : true ,
    		cellSelectable : false ,
    		rowSelectOption : {
    			singleSelect : true ,
    			clickSelect : true
    		} ,
    		numberingColumnFromZero : false ,  
    		enableDefaultContextMenu : false ,
    		enableContextMenu : true ,
    		pager : false ,
			height : 180 ,	     
			message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			} ,
			columnMapping : [{key : 'optlShreRepSvlnNo'		, title : cflineMsgArray['representaionLineNumber'] /* 대표회선번호 */			, align : 'center'			, width : '70px'}
									, {key : 'optlIntgFcltsCd'		, title : '대표회선 통시코드'																	, align : 'center'			, width : '80px'}         
									, {key : 'optlLineNm'				, title :cflineMsgArray['representaionLineNm'] /* 대표회선명 */ 		 			, align : 'center'			, width : '160px'}                                                                                  
			] ,
			enableDefaultContextMenu : false ,
    		enableContextMenu : true ,
    		contextMenu : [
		    		               {
		    		            	    title : "대표회선 해지",
		    						    processor : function(data, $cell, grid) {
		    						    	//getRpetrList(data);
		    						    	deleteOptl(data);
		    						    },
		    						    use : function(data, $cell, grid) {
		    						    	var selectedData = $('#'+representationGrid).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	
		    						    	if(selectedData.length > 0){
		    						    		returnValue = true;
		    						    	}
		    						    	return returnValue;
		    						    }
		    		               }
		    		            ]
		});
		
		// 광공유회선 그리드 생성
		$('#' + ruGrid).alopexGrid({
			autoColumnIndex : true ,
    		autoResize : true ,
    		cellSelectable : false ,
    		rowSelectOption : {
    			singleSelect : false ,
    			clickSelect : true
    		} ,
    		numberingColumnFromZero : false , 
    		pager : false ,   		
			height : 175 ,	
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping : [{ selectorColumn : true, width : '40px' } 
									, {key : 'svlnNo'	       		, title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/									, align :'center'	, width: '120px'}
									, {key : 'lineNm'	        	, title : cflineMsgArray['lnNm'] /* 회선명 */                 											, align :'left'  		, width: '300px'}
									, {key : 'lowIntgFcltsCd'	, title : cflineMsgArray['repeaterIntegrationFacilitiesCode'] /*중계기통합시설코드 */		, align : 'center'	, width: '140px'} 
									, {key : 'rmteSystmNm'	    , title : cflineMsgArray['repeaterName'] /*중계기명*/												, align : 'center'	, width: '160px'}
									
			],
			enableDefaultContextMenu : false ,
    		enableContextMenu : true ,
    		contextMenu : [
    		               			{
    		               				title : "대표회선 설정 해지" ,
    		               				processor : function(data, $cell, grid) {
		    						    	deleteServiceLine(data);
		    						    },
		    						    use : function(data, $cell, grid) {
		    						    	var selectedData = $('#'+ruGrid).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	
		    						    	if(selectedData.length > 0){
		    						    		returnValue = true;
		    						    	}
		    						    	return returnValue;
		    						    }
    		               			} ,
    		               			{
    		               				title : "대표회선 설정" ,
    		               				processor: function(data, $cell, grid) {
		    						    	setOptl(data);
		    						    } ,
		    						    use : function(data, $cell, grid) {
		    						    	var selectedData = $('#'+ruGrid).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	
		    						    	if(selectedData.length > 0){
		    						    		returnValue = true;
		    						    	}
		    						    	return returnValue;
		    						    }
    		               			}
    		               ]
		});
		
		// 선번 그리드 생성 : NetworkPathGrid.js (gridHidColSet()) 참고
		$('#' + targetGrid).alopexGrid({
			autoColumnIndex : true ,
			autoResize : true ,
    		cellSelectable : false ,
    		rowSelectOption : {
    			singleSelect : true ,
    			clickSelect : true
    		},
    		numberingColumnFromZero : false ,
    		grouping : groupingColumnRu(),
    		pager : false ,   		
			height : 280 ,	
			message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			} ,
			columnMapping : [
										{ key : 'SERVICE_MERGE', hidden : true, value : function(value, data) {
												if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
													return data._index.id;
												} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
													return data['WDM_TRUNK_ID'];
												} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] != null) {
													return data['RING_ID'];
												} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] != null) {
													return data['TRUNK_ID'];
												} else if(data['SERVICE_ID'] != null) {
													return data['SERVICE_ID'];
												} 
											}
										}
										, { key : 'RING_NM', title : cflineMsgArray['ringName'], align : 'left', width : '138px',  inlineStyle: ringStyleCss, rowspan : {by : 'RING_MERGE'} }	/* 링명 */
										, { key : 'RING_ID', width : '120px', title : "RING_ID", hidden: true }
										
										, { key : 'SERVICE_NM', 				title : "경유회선명(Cascading)", align : 'left', width : '140px'
											, inlineStyle: serviceStyleCss
											, rowspan : {by : 'SERVICE_MERGE'}  /* 회선명 */		
						            		, hidden : false
										}
										, { key : 'SERVICE_ID', 				title : cflineMsgArray['lnNm'], align : 'center', width : '10px', hidden : true}
										, { key : 'RING_MERGE', hidden : true, value : function(value, data) {
												if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
													return data._index.id;
												} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
													return data['WDM_TRUNK_ID'];
												} else if(data['RING_ID'] != null) {
													return data['RING_ID'];
												} 
							        	   }
										}
										
										, { key : 'LEFT_ORG_NM', title : cflineMsgArray['westMtso'], align : 'center', width : '80px'  } /* A 국사 */
										, { key : 'LEFT_NODE_ROLE_NM', 		title : cflineMsgArray['westSupSub'], align : 'center', width : '80px' } /* 상하위 */
										, { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '140px' } /* A장비 */
										, { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '80px' } /* A 포트 */
										/*, { key : 'LEFT_CHANNEL_DESCR', 	title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px', styleclass : nodeCopyPasteCss }  A 채널 
										, { key : 'LEFT_IS_CHANNEL_T1',		title : cflineMsgArray['t1'], align : 'center', width : '45px'
											, render: function(value, data){  
												var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
												html += (value === true) ? ' checked':'';
												html += '">';
												html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
												html += '/></label>';
												return html;
											}
										, styleclass : nodeCopyPasteCss
										}	     */
										//, { key : 'A', 			title : '',  align : 'left', width : '5px', styleclass: 'guard', headerStyleclass : 'guard'} /* 경계선 */
										, { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '140px' } /* B 장비 */
										, { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '80px' } /* B 포트 */
										   /* , { key : 'RIGHT_CHANNEL_DESCR', 	title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px' , styleclass : nodeCopyPasteCss }  B 채널 
										, { key : 'RIGHT_IS_CHANNEL_T1',	title : cflineMsgArray['t1'], align : 'center', width : '45px'
											, render: function(value, data){  
												var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
												html += (value === true) ? ' checked':'';
												html += '">';
												html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
												html += '/></label>';
												return html;
											}
										, styleclass : nodeCopyPasteCss
										}*/
										, { key : 'RIGHT_NODE_ROLE_NM', 	title : cflineMsgArray['eastSupSub'], align : 'center', width : '80px' } /* 상하위 */
										, { key : 'RIGHT_ORG_NM', 				title : cflineMsgArray['eastMtso'], align : 'center', width : '80px' } /* B 국사 */
			                 ]
		});
	}
	
	function serviceStyleCss(value, data, mapping) {
		var style = {
				'white-space' : 'pre-line'
		};
		
		if(value != null && value != undefined && value != "") {
			style['background-color'] = '#D3EEFF';
		} 
		
		return style;
	}
	

	function ringStyleCss(value, data, mapping) {
		var style = {
				'white-space' : 'pre-line'
		};
		
		if(value != null && value != undefined && value != "") {
			style['background-color'] = '#FFEAEA';
		} else {
			
		} 
		
		return style;
		
	}
	
	function groupingColumnRu() {
		var grouping = {
				by : ['SERVICE_MERGE', 'RING_MERGE'], 
				useGrouping:true,
				useGroupRowspan:true,
				useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
				useGroupRearrange : true
		};
		
		return grouping;
	}

	/* 버튼 제어 
	 * saveVal : 저장버튼 활성값 true - 활성 / false - 비활성 
	 *           위의 값에 따라 대표회선 선번 적용 버튼은 반대로 설정한다. 
	 * */
	function setBtnSaveAble(saveVal) {
		$('#btnPopSave').setEnabled(saveVal);
		$('#btnPopCopyPath').setEnabled(!saveVal);
	}
	
	// 처음 로딩 시 가져올 데이터를 조회한다.
	 function setSelectList(svlnNo, optlShreRepSvlnNo) {
		 
		 var searchParam = { "svlnNo" : svlnNo
					, "optlShreRepSvlnNo" : optlShreRepSvlnNo
					};

		cflineShowProgress(representationGrid);
		cflineShowProgress(ruGrid);
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getRuRptOptlList', searchParam, 'GET', 'servicelineRuRptOptlList');
	 }
	 
	 function setEventListener() {
		 
		 // 취소
		 $('#btnPopClose').on('click', function(e) {
			 $a.close();
	     });
		 
		 // 저장
		 $('#btnPopSave').on('click', function(e) {
			 setOptlSave();
		 });
		 
		 // 광공유회선 그리드 : 서비스회선 추가
		 $('#btnSrvcLineAddPop').on('click', function(e) {
			 addServiceLine();
		 });
		 
		 // 대표회선 그리드 선택 시 해당 선번 조회
		 $('#'+representationGrid).on('click', '.bodycell', function(e) {
			 var dataObj = AlopexGrid.parseEvent(e).data;
			 var param = {"ntwkLineNo" : dataObj.optlShreRepSvlnNo};
			 cflineShowProgress(targetGrid);
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', param, 'GET', 'searchLno');
		 });
		 
		 // 광공유회선 그리드 선택 시 해당 선번 조회
		 $('#'+ruGrid).on('click', '.bodycell', function(e) {
			 var dataObj = AlopexGrid.parseEvent(e).data;
			 var param = {"ntwkLineNo" : dataObj.svlnNo};
			 cflineShowProgress(targetGrid);
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', param, 'GET', 'searchLno');
		 });
		 
		 // 대표회선 해지 버튼
		 $('#deleteOptlBtn').on('click', function(e) {
			 deleteOptl();
		 });
		 
		 // 대표회선 추가 버튼
		 $('#addOptlBtn').on('click', function(e) {
			 setOptl();
		 });

		 // 대표회선 복제 버튼
		 $('#btnPopCopyPath').on('click', function(e) {
			 btnPopCopyPath();
		 });
		 
	 }
	 
	 /**
	  * 광공유회선 그리드 : 서비스회선 추가
	  * 대표회선의 첫 번째 FDF 장비 정보와 포트로 디폴트 세팅
	  */
	 function addServiceLine() {
		// 기존 서비스회선 팝업창을 사용하기 때문에 분기처리를 위해 플래그 추가
		 var param = { "srvcChk" : "ruRpetr"
			 				  , "svlnLclCd" : "003"
			 				  , "svlnSclCd" : "101"
		 					}
		 
		 var optlInfo = $('#' + representationGrid).alopexGrid('dataGet');
		 
		 if ( optlInfo.length > 0 ) {
			 $.extend(param, optlInfo[0]);
		 }
		 
		 $a.popup({
			popid : 'linenum' ,
			title : '서비스 회선 조회 팝업' ,
			url : '/tango-transmission-web/configmgmt/cfline/ServiceLineListPop.do' ,
			data : param ,
			modal : true ,
			movable:true ,
			windowpopup : true,
			width : 1400,
			height : 750,
			callback : function ( data ) {
				if ( data != null ) {
					var svlnChk = 0;		// 기존 광공유회선 목록에 동일한 회선이 존재하는지 체크
					var rpetrList = $('#'+ruGrid).alopexGrid('dataGet');
					
					if ( rpetrList.length > 0 ) {
						for( var i = 0; i < rpetrList.length; i++ ) {
							if( data[0].svlnNo == rpetrList[i].svlnNo ) {
								svlnChk++;
							}
						}
						
						if ( svlnChk > 0 ) {
							alertBox('I', "이미 추가된 회선입니다.");
	    					return;
						}
					}
					$('#'+ruGrid).alopexGrid("dataAdd", data);
					setBtnSaveAble(true);
					
					// 다른 팝업에 영향을 주지 않기 위해
					$.alopex.popup.result = null;
				}
			}
		 });
	 }
	 
	 
	 /**
	  * 대표회선 그리드 > 대표회선 해지
	  * 대표회선 해지를 위해 해당 서비스회선 재조회
	  */
	 function deleteOptl(data) {
		 if ( data == null ) {		// 버튼으로 대표회선을 해지했을 경우
			 var dataObj = $('#' + representationGrid).alopexGrid('dataGet');
			 
			 if (dataObj.length == 0) {
				 alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
				 return;
			 }
			 var param = { "svlnNo" : dataObj[0].optlShreRepSvlnNo };
		 }
		 else {						// 컨텍스트 메뉴로 대표회선을 해지했을 경우
			 var param = { "svlnNo" : data.optlShreRepSvlnNo };
		 }
		 cflineShowProgress(representationGrid);
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getSvlnInfoFstFdf', param, 'GET', 'deleteOptl');
	 }
	 
	 
	 /**
	  * 광공유회선 그리드 > 대표회선 설정
	  * 대표회선 설정을 위해 해당 서비스회선 재조회
	  */
	 function setOptl(data) {
		 var optlGridLength = $('#'+representationGrid).alopexGrid("dataGet").length;
		 
		 if ( optlGridLength < 1 ) {
			 var addOptlInfo = $('#' + ruGrid).alopexGrid("dataGet", {_state: {selected:true}});
			 
			 if (addOptlInfo.length == 0) {
				 alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
				 return;
			 } else if (addOptlInfo.length > 1)  {
				 alertBox('I', "한건만 선택해 주세요."); /* 한건만 선택해 주세요..*/
				 return;
			 }
			 var searchParam = { "svlnNo" : addOptlInfo[0].svlnNo };
			 
			 callMsgBox('','C', "< " + addOptlInfo[0].svlnNo + " > 을 대표회선으로 설정하시겠습니까?", function(msgId, msgRst) {
		       	if (msgRst == 'Y') {
		       		cflineShowProgress(ruGrid);
			    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getSvlnInfoFstFdf', searchParam, 'GET', 'optlSet');
		       	}
		    });
		 }
		 else {
			 alertBox('I', "대표회선은 1개만 설정할 수 있습니다. <br/> 기존 대표회선 해지 후 진행해주세요.");
			 return;
		 }
	 }
	 
	 /**
	  * 광공유회선 그리드 > 광공유회선이 가지고 있는 대표회선 설정 해지
	  */
	 function deleteServiceLine(data) {
		 if( data != null ) {
			var ruInfo = $('#'+ruGrid).alopexGrid('dataGet', {_state: {selected:true}});
			for (var i = 0 ; i < ruInfo.length ; i++) {
				ruInfo[i].editMd = "D";
			}
			 
			 $('#'+ruGrid).alopexGrid('updateOption', {rowOption : {inlineStyle: function(data){if(data['editMd'] == "D") return {color:'red', 'text-decoration' : 'line-through'};}}});
			 $('#'+ruGrid).alopexGrid('viewUpdate');
			 setBtnSaveAble(true);
		 }
		 else {
			 alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
			 return;
		 }
	 }
	 
	 /**
	  * 저장
	  * UI 상에서 DB값은 변하지 않고 저장버튼을 눌렀을 때 서비스회선 검증 후 DB값 업데이트
	  */
	 function setOptlSave() {
		 var updateData = [];
		 var optlList = $('#' + representationGrid).alopexGrid('dataGet');	// 대표회선
		 var rpetrList = $('#'+ruGrid).alopexGrid('dataGet');					// 광공유회선
		 var rpetrDelList = $('#'+ruGrid).alopexGrid('dataGet', { _state : {deleted : true }});
		 
		 // 망구성방식코드
		 netCfgMeansSvlnNo = "";
		 
		 if ( optlList.length > 0 ) {
			 for ( var i = 0; i < optlList.length; i++ ) {
				 // added가 false이면 기존 대표회선
				 if ( optlList[0]._state.added == false ) {
					 optlList[0].originalOptl = orginalOptl;		// 오리지날 대표회선 저장
					 optlList[0].editMd = "op";
				 }
				 updateData.push(optlList[0]);
				 
				 // 망구성방식코드
				 netCfgMeansSvlnNo += optlList[0].optlShreRepSvlnNo +",";
			 }
		 }
		 
		 /*if ( rpetrDelList.length > 0 ) {
			 for ( var i = 0; i < rpetrDelList.length; i++ ) {
				 rpetrDelList[i].editMd = "A";
				 rpetrDelList[i].orginalOptl = orginalOptl;		// 오리지날 대표회선 저장
				 updateData.push(rpetrDelList[i]);
			 }
		 }*/
		 
		 if ( rpetrList.length > 0 ) {
			 for ( var i = 0; i < rpetrList.length; i++ ) {
				 rpetrList[i].originalOptl = orginalOptl;		// 오리지날 대표회선 저장
				 updateData.push(rpetrList[i]);
				 

				 // 망구성방식코드
				 netCfgMeansSvlnNo += rpetrList[i].svlnNo +",";
			 }
		 }

		 callMsgBox('','C', "저장하시겠습니까?", function(msgId, msgRst){  
		       	if (msgRst == 'Y') {
		       		cflineShowProgressBody();
		       		// 저장 전 대표회선, 광공유회선 검증 후 해지, 추가함.
		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/checkRpetrForOptlSet?method=put', updateData, 'POST', 'checkRpetrForOptlSet');
		       	}
		  });
	 }
	 
	 function btnPopCopyPath() {
		 var toDataList = $('#' + ruGrid).alopexGrid('dataGet', {_state: {selected:true}});
		 
		 if (toDataList.length  == 0) {
			 alertBox('W', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
			 return;
		 }
		 
		 var optDataList = $('#' + representationGrid).alopexGrid('dataGet');
		 
		 if (optDataList.length > 1) {
			 alertBox('W', "대표회선은 한회선만 가능합니다."); 
			 return;
		 } else if (optDataList.length == 0) {
			 alertBox('W', "대표회선이 설정되어 있지 않습니다."); 
			 return;
		 }
		 
		 var lineNoStr = "";
		 for (var i = 0; i< toDataList.length; i++) {
			 lineNoStr = lineNoStr  + toDataList[i].svlnNo + ",";
		 }
		 
		 var copyParam = {
				  "optlShreRepSvlnNo" : optDataList[0].optlShreRepSvlnNo
				, "lineNoStr" : lineNoStr
		 }
		 
		 var msgChk = "선택하신 광공유 회선에 대표회선 ["+ optDataList[0].lineNm+"]의<br> 선번을 복사하시겠습니까?";
		 callMsgBox('','C', msgChk, function(msgId, msgRst){  
		       	if (msgRst == 'Y') {
		       		cflineShowProgressBody();
		       		// 저장 전 대표회선, 광공유회선 검증 후 해지, 추가함.
		        	Tango.ajax({
		        		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/copyoptlshrereppath', //URL 기존 처럼 사용하시면 됩니다.
		        		data : copyParam, //data가 존재할 경우 주입
		        		method : 'GET', //HTTP Method
		        		flag : 'sendfdfuseinfo'
		        	}).done(function(response){
		        		cflineHideProgressBody();
		        		//console.log(response);
		        			var acceptParam = {lineNoStr: ""};
		        			
		        			// 끝까지 처리되었다는 의미
			        		if (nullToEmpty(response.result) == "OK") {
			        			// 성공건이 있는경우 FDF 정보 전송
			        			
			        			if (nullToEmpty(response.okLineNo) != "") {
			        				sendFdfUseInfoCommon(response.okLineNo, "S", "E", null);  // FDF 정보 전송

			        				// 수용네트워크 작업 처리
			        				var acceptParam = {
			       						 lineNoStr : response.okLineNo
			       					   , topoLclCd : ""
			       					   , linePathYn : "Y"
			       					   , editType : "E"  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
			       					   , excelDataYn : "Y"
			       					   , mgmtGrpCd : "0001"
			          				   , callMsg : ""
			          				   , onlyMainOk : "Y"
				       				}
			        				
			        				// 망구성방식코드업데이트
			        				var ruParam = {
			        						"lineNoStr" : response.okLineNo
			        					  , "editType"  : "E"
			        				}
			        				setRuNetCfgMeans(ruParam);
			        			}
			        			
			        			// 실패건이 있는경우 메세지
			        			if (nullToEmpty(response.ngLineNo)) {
			        				var ngMsg = "<center>";
			        				
			        				if (nullToEmpty(response.okLineNo) != "") {
			        					ngMsg += "[ " + response.okLineNo + " ] 회선이 <br> " + cflineMsgArray['normallyProcessed'];
			        				}
			        				ngMsg += "<br><br>[ " + response.ngLineNo + " ] 회선은 <br> 대표회선 선번 복사에 실패했습니다.";
			        				if (nullToEmpty(response.ngMsg) != "") {
				        				ngMsg += "<br>실패한 이유를 확인해 주세요.<br><br>********************* 실패이유 ********************* <br>" + response.ngMsg + "</center>";
			        				}
			        				 callMsgBox('','I', ngMsg, function(msgId, msgRst){  
			        				       	if (msgRst == 'Y') {
			        				       		if (acceptParam.lineNoStr != "") {
			        				       			extractAcceptNtwkLine(acceptParam);
			        				       		}
			        				       	}
			        				 });
			        				 return;
			        			} else {
			        				// 정상건이 있는 경우 메세지
			        				if (nullToEmpty(response.okLineNo) != "") {
			        					var okMsg = "<center>[ " + response.okLineNo + " ] 회선이 <br> " + cflineMsgArray['normallyProcessed'] + "</center>";
			        					callMsgBox('','I', okMsg, function(msgId, msgRst){  
			        				       	if (msgRst == 'Y') {
			        				       		if (acceptParam.lineNoStr != "") {
			        				       			extractAcceptNtwkLine(acceptParam);
			        				       		}
			        				       	}
			        					});
			        				}
			        			}
			        		} else {
			        			// 끝까지 처리되지 않았음
			        			alertBox('W', response.ngMsg); 
				   			    return;
			        		}
			        		
			        		$('#'+targetGrid).alopexGrid("dataEmpty");
        					return;
		        		})
		        	.fail(function(response){
		        		cflineHideProgressBody();
		        	  	//console.log(response);
			        		alertBox('W', "대표회선 선번적용에 실패했습니다."); 
			   			    return;
		        	  	});
		       	}
		  });
	 }
	 
	 var httpRequest = function(Url, Param, Method, Flag ) {
	    	Tango.ajax({
	    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
	    		data : Param, //data가 존재할 경우 주입
	    		method : Method, //HTTP Method
	    		flag : Flag
	    	}).done(successCallback)
			  .fail(failCallback);
	 };
	 
	 
	 function successCallback(response, status, jqxhr, flag) {
		 
		 // setSelectCode() : 대표회선 그리드, 광공유회선 그리드 조회
		 if ( flag == 'servicelineRuRptOptlList' ) {
			 cflineHideProgress(representationGrid);
	         cflineHideProgress(ruGrid);
	         
	         // 대표회선 그리드
	         var optlInfo = response.optlList[0];
	         
	         // 기존 대표회선 저장
	         orginalOptl = optlInfo.optlShreRepSvlnNo;
	         
	         if ( response.optlList.length > 0 ) {
	        	 if ( ( optlInfo.optlShreRepSvlnNo != undefined ) && ( optlInfo.optlShreRepSvlnNoYn != "N" ) ) {
	        		 $('#popOptlShreRepSvlnNoSpan').text(optlInfo.optlShreRepSvlnNo);
        			 $('#popOptlShreRepLineNmSpan').text(optlInfo.optlLineNm);
        			 $('#popFdfNmSpan').text(optlInfo.fstFdfNm);
        			 $('#popFdfPortSpan').text(optlInfo.fstFdfPortNm);
        			 $('#'+representationGrid).alopexGrid("dataSet", optlInfo);
	        	 }
	         }
	         
	         $('#'+ruGrid).alopexGrid("dataEmpty");
	         // 광공유회선 그리드
	         if ( response.ruList.length > 0 ) {
	        	 for ( var i = 0; i < response.ruList.length; i++ ) {
	        		 var svlnNo = response.ruList[i].svlnNo;
	        		 
	        		// 대표회선이 있을 때 자기자신이 광공유회선에 포함되면 광공유회선에 자기자신은 보여주지 않는다.
	        		 if ( ( optlInfo.optlShreRepSvlnNo != null ) && ( optlInfo.optlShreRepSvlnNo != svlnNo ) ) {
	        			 $('#'+ruGrid).alopexGrid("dataAdd", response.ruList[i]);
	        		 }
	        		 else {
	        			 continue;
	        		 }
	        	 }
	         }
	         else {
	        	 $('#'+ruGrid).alopexGrid("dataAdd", response.optlList[0]);
	         }
	         setBtnSaveAble(false);
		 }
		 
		// 선번 그리드 조회
    	if( flag == 'searchLno' ) {
    		cflineHideProgress(targetGrid);
    		$('#'+targetGrid).alopexGrid("dataEmpty");
			if ( response.data != null ) {
				$('#'+targetGrid).alopexGrid("dataSet", response.data.LINKS);
			}
    	}
    	
    	// 광공유회선 그리드 > 대표회선 설정 : setOptl()
    	if ( flag == 'optlSet' ) {
    		cflineHideProgress(ruGrid);
    		
    		// 광공유회선 그리드에서 넘어온 광공유회선은 대표회선으로 넘어가면서 광공유회선 그리드에서 삭제한다.
    		var addOptlInfo = $('#' + ruGrid).alopexGrid("dataGet", {_state: {selected:true}});
			var rowIndex = addOptlInfo[0]._index.data; 
			$('#'+ruGrid).alopexGrid("dataDelete", {_index : { data:rowIndex }});
			
			$.extend(response[0], { "editMd" : "opA"
											, "optlShreRepSvlnNo" : response[0].svlnNo
											, "optlIntgFcltsCd" : response[0].lowIntgFcltsCd
											, "optlLineNm" : response[0].lineNm
											});
			
			$('#'+representationGrid).alopexGrid("dataEmpty");
			$('#'+representationGrid).alopexGrid("dataSet", response[0]);

			$('#popOptlShreRepSvlnNoSpan').text(response[0].optlShreRepSvlnNo);
			$('#popOptlShreRepLineNmSpan').text(response[0].optlLineNm);
			$('#popFdfNmSpan').text(response[0].fstFdfNm);
			$('#popFdfPortSpan').text(response[0].fstFdfPortNm);
			
			var addOptl = $('#'+representationGrid).alopexGrid("dataGet");
			addOptl[0]._state.added = true;
			setBtnSaveAble(true);
    	}
    	
    	// 대표회선 그리드 > 대표회선 해지 : deleteOptl()
    	if ( flag == 'deleteOptl' ) {
    		cflineHideProgress(representationGrid);
    		var delOptlInfo = $('#'+representationGrid).alopexGrid('dataGet');
			var rowIndex = delOptlInfo[0]._index.data;    		
			$('#' + representationGrid).alopexGrid("dataDelete", {_index : { data:rowIndex }});
			
			// 기존의 대표회선이 해지되면서 광공유회선 그리드로 넘어갈 때
			// 서비스회선번호가 기존의 대표회선이랑 같으면 대표회선이면서 자기 자신이므로 N
			// 수정 : orginalOptl == delOptlInfo[0].svlnNo >> 마스터그리드에서 자기자신을 회선으로 선택안하면 에러
			if ( orginalOptl == delOptlInfo[0].svlnNo ) {
				$.extend (response[0], {"editMd" : "N"} );
			}
			
			$('#' + ruGrid).alopexGrid( "dataAdd", response[0], {_index : { data: 0 }} );
			$('#popOptlShreRepSvlnNoSpan').text('');
			$('#popOptlShreRepLineNmSpan').text('');
			$('#popFdfNmSpan').text('');
			$('#popFdfPortSpan').text('');
			setBtnSaveAble(true);
    	}
    	
    	// 저장을 위한 서비스회선 검증
    	if ( flag == 'checkRpetrForOptlSet' ) {
    		if(response.result.resultCd == "SUCCESS") {
    			cflineHideProgressBody();
    			//$a.close("OK");
    			alertBox('I', cflineMsgArray['saveSuccess']);
    			var optlInfo = $('#'+representationGrid).alopexGrid('dataGet');
    			var svlnInfo = $('#'+ruGrid).alopexGrid('dataGet');
    			var optlShreRepSvlnNo = "";
    			var svlnNo = "";
    			if (optlInfo.length > 0) {
    				optlShreRepSvlnNo = optlInfo[0].optlShreRepSvlnNo;
    				svlnNo = optlInfo[0].svlnNo;
    			}
    			
    			if (svlnNo == "") {
	    			for (var i = 0 ; i < svlnInfo.length ; i++) {
	    				if (nullToEmpty(svlnInfo[i].editMd) != "D") {
	    					svlnNo = svlnInfo[i].svlnNo;
	    					break;
	    				}
	    			}
    			}
    			    			
    			setSelectList(svlnNo, optlShreRepSvlnNo);
    			
    			/*// 망구성방식코드 업데이트
    			var ruParam = {
						"lineNoStr" : netCfgMeansSvlnNo
					  , "editType"  : "O"
				}
				setRuNetCfgMeans(ruParam);*/
    			
    		}
    		else if(response.result.resultCd == "FAIL") {
    			cflineHideProgressBody();
    			alertBox('W', response.result.errMsg);
    		}
    	}
	 }
	 
	 function failCallback(response, status, flag) {

		cflineHideProgressBody();
		 if ( flag == 'servicelineRuRptOptlList' || flag == 'searchLno' || flag == 'optlSet' || flag == 'deleteOptl' ) {
			 cflineHideProgressBody();
	    	 alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		 }
		 
		 if ( flag == 'checkRpetrForOptlSet' ) {
			 cflineHideProgressBody();
	    	 alertBox('I', cflineMsgArray['saveFail']); /* 저장에 실패 하였습니다.*/
		 }
	 } 
})