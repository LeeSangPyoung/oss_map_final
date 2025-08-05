/**
 * 
 */ 
var gridId = 'dataGrid';
var gridIdWork = 'dataGridWork';
var column = getColumnMapping(gridId);
var columnWork = getColumnMapping(gridIdWork);

$a.page(function() {
    this.init = function() {
    	var infoColumn = getColumnMapping(gridId);
    	initGridInfo(infoColumn);
    	var workColumn = getColumnMapping(gridIdWork);
    	initGridWork(workColumn);
    };
});
 
function initGridInfo(column, isPathAll, oldWdmType) {
	//var column = getColumnMapping(gridId);
    var group = "sListGroup";
	var headerGroup = null;
	var groupColumn = getGroupingColumn();
	if (isPathAll == true && oldWdmType == false) {
		headerGroup = getHeaderGroup();		
	}
    
    $('#'+gridId).alopexGrid({
    	pager : true,
    	autoColumnIndex: true,
		autoResize: true,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
		rowClickSelect : true,
		rowSingleSelect : false,
		numberingColumnFromZero: false,
		defaultColumnMapping:{sorting: true},
		columnMapping:column,
		headerGroup:headerGroup,
		grouping : groupColumn,
		message: {
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"
		},
		rowOption:{inlineStyle: function(data,rowOption){
	//			 TODO 작업정보 권한적용되면 수정
				if(data['workUseYn'] == 'Y' && data['workMgmtYn'] == 'Y') {
					return {color:'red'}
				} else if (data['tsdnModeYn'] == 'Y' || data['sprTsdnModeYn'] == 'Y') {
					return {color:'blue'}
				}
			
//			if(data['workUseYn'] == 'Y') return {color:'red'} 
			}
		},
		enableDefaultContextMenu:false,
		enableContextMenu:true,
		contextMenu : [
		               {
							title: cflineMsgArray['workConvert'] /* 작업전환*/,
						    processor: function(data, $cell, grid) { fnWorkCnvt(); },
						    use: function(data, $cell, grid) {
						    	//return data._state.selected;
						    	/* 선택한 데이터의 전송실 관리권한 확인 */
						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
						    	var returnValue = false;
						    	for(var i in selectedData){
						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y"  ){
						    			returnValue = true;
						    			break;
						    		}
						    	}
						    	
						    	return returnValue;
						    }
					   }
					   /*
					    * WDM트렁크 상세정보
					    
					   {
		            	    title: 'WDM트렁크 상세정보',
						    processor: function(data, $cell, grid) {
						    	var rowIndex = data._index.row;
						    	var dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
						    	
						    	showPopWdmTrunkInfo( gridId, dataObj );
						    }
					   }
					   */
		               ,{
							title: cflineMsgArray['acceptLine']+cflineMsgArray['list'] /* 수용회선목록*/,
						    processor: function(data, $cell, grid) { fnAcceptNtwkList(data); },
						    use: function(data, $cell, grid) {
						    	return true//data._state.selected;						    	
						    }
					   }
		]
    }); 
}

function initGridWork(column, isPathAll, oldWdmType){
	//var column = getColumnMapping(gridIdWork);
	var group = "sWorkGroup";
	var headerGroup = null;
	var groupColumn = getGroupingColumn();
	if (isPathAll == true && oldWdmType == false) {
		headerGroup = getHeaderGroup();
	}
	
    $('#'+gridIdWork).alopexGrid({
    	pager : true,
    	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
    	autoColumnIndex: true,
    	/*lazyScroll: {enabled:true},*/
    	autoResize: true,
    	cellSelectable : false,
    	rowClickSelect : true,
    	rowSingleSelect : false,
    	numberingColumnFromZero: false,
    	defaultColumnMapping:{sorting: true},
    	columnMapping:column,
		headerGroup:headerGroup,
		grouping : groupColumn,
    	message: {
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"
		},
		rowOption:{inlineStyle: function(data,rowOption){
					if (data['tsdnModeYn'] == 'Y' || data['sprTsdnModeYn'] == 'Y') {
							return {color:'blue'}
						}					
					}
		},
    	enableDefaultContextMenu:false,
		enableContextMenu:true,
    	contextMenu : [
    	               	{
    	               		title: cflineMsgArray['workInfSave'],  /*작업정보저장*/
						    processor: function(data, $cell, grid) { fnUpdate();},
						    use: function(data, $cell, grid) { 
//						    	return data._state.selected;
						    	if(data.mgmtGrpCd == '0001' && $('#mgmtGrpCd').val() == '0001'){ // ADAMS 연동 고도화
			            		       return data._state.selected;
			            		   }else{
			            			   return false;
			            		   }
						    }
					   },
		               { 
		            	   title: cflineMsgArray['workInfo'] + cflineMsgArray['finish'],   /*작업 정보 완료*/
		            	   processor: function(data, $cell, grid) {
		            		   fnWorkInfoFnsh(false);
		            	   },
		            	   use: function(data, $cell, grid) {
//		            		   return data._state.selected;
		            		   if(data.mgmtGrpCd == '0001' && $('#mgmtGrpCd').val() == '0001'){ // ADAMS 연동 고도화
			            		       return data._state.selected;
			            		   }else{
			            			   return false;
			            		   }
		            	   }
		               },
		               {
		            	   title: cflineMsgArray['AllWorkInfFnsh'],  /*모든 작업 정보 완료*/
		            	   processor: function(data, $cell, grid) {
		            		   fnWorkInfoFnsh(true);
		            	   },
		            	   use: function(data, $cell, grid) {
//		            		   return data._state.selected;
		            		   if(data.mgmtGrpCd == '0001' && $('#mgmtGrpCd').val() == '0001'){ // ADAMS 연동 고도화
			            		       return data._state.selected;
			            		   }else{
			            			   return false;
			            		   }
		            	   }
		               },
		               {
		            	   title: cflineMsgArray['trmn'], /*"해지"*/
		            	   processor: function(data, $cell, grid) {
		            		   fnLineTerminate();
		            	   },
		            	   use: function(data, $cell, grid) {
		            		   if(data.mgmtGrpCd == '0001' && $('#mgmtGrpCd').val() == '0001'){ // ADAMS 연동 고도화
		            		       return data._state.selected;
		            		   }else{
		            			   return false;
		            		   }
		            	   }
		               }
		               /*
					    * WDM트렁크 상세정보
					   {
		            	    title: 'WDM트렁크 상세정보',
						    processor: function(data, $cell, grid) {
						    	var rowIndex = data._index.row;
						    	var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
						    	
						    	showPopWdmTrunkInfo( gridIdWork, dataObj );
						    }
					   }*/
		              ]
    }); 
    
    $('#'+gridIdWork).alopexGrid("viewUpdate");
}

function getColumnMapping(param){
	var column =[
	              {selectorColumn : true, width : '50px' , rowspan:{by:'ntwkLineNo'} } 
				, {key : 'check'		, title : cflineMsgArray['number']/*번호*/	, align:'center', width:'60px'		,numberingColumn : true	 	, rowspan:{by:'ntwkLineNo'} }
				, {key : 'ntwkLineNo'	, title : cflineMsgArray['trunkIdentification']/*트렁크ID*/, align:'center'	, width: '120px' 				, rowspan:{by:'ntwkLineNo'} }
				, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px' 		, rowspan:{by:'ntwkLineNo'} }
				, {key : 'autoCreateYn'	      ,title : cflineMsgArray['autoCreateYesOrNo']/* '자동생성'*/         	  ,align:'center', width: '100px' 		, rowspan:{by:'ntwkLineNo'} }
			];
	
	if(param == gridIdWork){
	    var workColumn = [
	               {key : 'ntwkLineNm', title : '<em class="color_red">*</em>'+cflineMsgArray['trunkNm']/*트렁크명*/  , rowspan:{by:'ntwkLineNo'} 
					 		, align:'left'	, width:'280px'	
				 			, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화
				 			, editable:{type:"text"}	 }
		      	   , {key : 'mgmtOnrNm',	title : '관리주체'  /*관리주체*/,	hidden : true}
	               /* TODO */
	               /*, {title : "E2E보기",	align:'center',	width: '65px'   , rowspan:{by:'ntwkLineNo'} 
	      		   		, render : function(value, data, render, mapping) {
	      		   			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnE2ePop" type="button"></button></div>';
	      		   		}
	      			 }
	  		       , {title : "시각화 편집",	align:'center',	width: '80px' , rowspan:{by:'ntwkLineNo'} 
		  		   		, render : function(value, data, render, mapping) {
		  		   			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnServiceLIneInfoPop" type="button"></button></div>';
		  		     		}
	  		       }*/
	  		       
	             , {key : 'ntwkCapaCd', title : '<em class="color_red">*</em>'+cflineMsgArray['capacity'] /*용량*/, align:'left' , rowspan:{by:'ntwkLineNo'} 
						, width: '95px'
						//, render : function(value, data){ return data.ntwkCapaNm;}
						,render : {
		    				type : 'string',
		    				rule :function(value, data) {
							var render_data = [];
								if (C00194Data.length > 1) {
									return render_data = render_data.concat(C00194Data);
								} else {
									return render_data.concat({value : data.ntwkCapaCd, text : data.ntwkCapaNm });
								}
		    				}
						}
						, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화
				 		, editable : { type: 'select', rule: function(value, data) { return C00194Data; }
				 			, attr : {
				 				style : "width: 80px;min-width:80px;padding: 2px 2px;"
				 			}
				 		}
				 		, editedValue : function (cell) {
				 			return $(cell).find('select option').filter(':selected').val();
				 		}
	             }
	             , {key : 'wdmEqpMdlId', title : '<em class="color_red">*</em>'+cflineMsgArray['equipmentModel'] /*장비모델*/, align:'left'  , rowspan:{by:'ntwkLineNo'} 
	            		, width: '152px'
	            	//, render : function(value, data){ return data.wdmEqpMdlNm;}
            			,render : {
		    				type : 'string',
		    				rule :function(value, data) {
							var render_data = [];
								if (eqpMdlList.length > 1) {
									return render_data = render_data.concat(eqpMdlList);
								} else {
									return render_data.concat({value : data.wdmEqpMdlId, text : data.wdmEqpMdlNm });
								}
		    				}
						}
					/*, renderRuleOption : { "valueKey" : "eqpMdlId", "textKey" : "eqpMdlNm"}*/
	            		, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화
				 		, editable : { type: 'select', rule: function(value, data) { return eqpMdlList; } 
				 					, attr : { style : "width: 140px;min-width:140px;padding: 2px 2px;"}
				 		}
				 		, editedValue : function (cell) {
				 			return $(cell).find('select option').filter(':selected').val();
				 		}
	             }
	             , {key : 'wdmBdwthVal', title : cflineMsgArray['bdwth']/*밴드*/, align:'center'	, width: '70px' , rowspan:{by:'ntwkLineNo'} }
	             , {key : 'wavlVal', title : '<em class="color_red">*</em>'+ cflineMsgArray['wavelength']+'/'+cflineMsgArray['frequency']/*파장/주파수*/ , rowspan:{by:'ntwkLineNo'} 
					, align:'left', width: '160px'
					, render : function(value,data){ return data.wavlVal; }	
					, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화 - SKT관리그룹인 경우에만 파장/주파수돋보기 표시
					, editable: function(value, data, render, mapping, grid){
						var celStr = "";
					    if (nullToEmpty(data.wavlVal) != "") {    	            				    	 
					    	celStr = value;
					    }
					    celStr = searchBtnStyle(celStr, "btnWavlSch","110px");
					    return celStr;
					}
					, editedValue : function (cell) { return $(cell).find('input').val(); }
				}
	            , {key : 'wdmDrcVal'	, title : '<em class="color_red">*</em>'+ cflineMsgArray['direction']/*방향*/, align:'left', width: '200px'
	            	, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화 - SKT관리그룹인 경우에만 파장/주파수돋보기 표시
	            	, editable:{type:"text"} , rowspan:{by:'ntwkLineNo'} }
	               
	        ];
	    column = column.concat(workColumn);
	}
	else {
	    var infoColumn = [
	              {key : 'ntwkLineNm'	, title : cflineMsgArray['trunkNm']/*트렁크명*/, align:'left'	, width:'280px' , rowspan:{by:'ntwkLineNo'} }
	              /* TODO */
	              /*, {title : "E2E보기",	align:'center',	width: '65px'  , rowspan:{by:'ntwkLineNo'} 
      		   		, render : function(value, data, render, mapping) {
      		   			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnE2ePop" type="button"></button></div>';
      		   		}
      		       }
      			, {title : "시각화 편집",	align:'center',	width: '80px' , rowspan:{by:'ntwkLineNo'} 
  		   				, render : function(value, data, render, mapping) {
		  		   					return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnServiceLIneInfoPop" type="button"></button></div>';
		  		     	}
  		       }	*/
  		        
	    		, {key : 'ntwkCapaCd'	, title : cflineMsgArray['capacity'] /*용량*/, align:'center'	, width: '55px', rowspan:{by:'ntwkLineNo'} 
					, render : function(value, data){ return data.ntwkCapaNm;}
				  }
	    		, {key : 'wdmEqpMdlId', title : cflineMsgArray['equipmentModel'] /*장비모델*/, align:'left', width: '230px' , rowspan:{by:'ntwkLineNo'} 
						, render : function(value, data){ return data.wdmEqpMdlNm;}
				  }
	    		, {key : 'wdmBdwthVal', title : cflineMsgArray['bdwth']/*밴드*/, align:'center'	, width: '70px', rowspan:{by:'ntwkLineNo'} }
	    		, {key : 'wavlVal', title : cflineMsgArray['wavelength']+'/'+cflineMsgArray['frequency']/*파장/주파수*/, align:'left', width: '100px', rowspan:{by:'ntwkLineNo'} 
					, render : function(value,data){ return data.wavlVal; }
				  }
	    		, {key : 'wdmDrcVal'	, title : cflineMsgArray['direction']/*방향*/, align:'left'	, width: '200px' 	, rowspan:{by:'ntwkLineNo'} }
	        ];
	    column = column.concat(infoColumn);
	}
	
	
	var appendColumn = [
//	      			  {key : 'frstRegDate'	, title : cflineMsgArray['openingDate']/*개통일자*/, align:'center'	, width: '80px'}
	      			  {key : 'lineOpenDt'	, title : cflineMsgArray['openingDate']/*개통일자*/, align:'center'	, width: '80px' 					, rowspan:{by:'ntwkLineNo'} }
	      			, {key : 'lastChgDate'	, title : cflineMsgArray['modificationDate']/*수정일자*/, align:'center'	, width: '80px'				, rowspan:{by:'ntwkLineNo'} }
	      			, {key : 'uprMtsoIdNm'	, title : cflineMsgArray['upperMtso']/*상위국사*/, align:'left'	, width: '130px' 						, rowspan:{by:'ntwkLineNo'} }
	      			, {key : 'lowMtsoIdNm'	, title : cflineMsgArray['lowerMtso']/*하위국사*/, align:'left'	, width: '130px' 						, rowspan:{by:'ntwkLineNo'} }
	      			, {key : 'ntwkRmkOne'	, title : cflineMsgArray['remark1']/*비고1*/, align:'left'	, width: '120px'	
	      				, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화
	      				, editable:{type:"text"} , rowspan:{by:'ntwkLineNo'} }
	      			, {key : 'ntwkRmkTwo'	, title : cflineMsgArray['remark2']/*비고2*/, align:'left'	, width: '120px'	
	      				, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화
	      				, editable:{type:"text"} , rowspan:{by:'ntwkLineNo'} }
	      			, {key : 'ntwkRmkThree'	, title : cflineMsgArray['remark3']/*비고3*/, align:'left'	, width: '120px'	
	      				, allowEdit : function(value, data){return(data.mgmtGrpCd=='0001' ? true : false); }  // ADAMS 연동 고도화
	      				, editable:{type:"text"} , rowspan:{by:'ntwkLineNo'} }
	      			, {key : 'tsdnModeYn'	, title : cflineMsgArray['tsdnLinkageYesOrNo']/* TSDN 연동 여부 */, align:'left'	, width: '130px'	, rowspan:{by:'ntwkLineNo'}		
	      				   ,render : function(value, data) {
	      					   var rstMsg = '';
	      					   if (data.tsdnModeYn == 'Y') {
	      						   rstMsg = "주";
	      					   }
	      					   if (data.sprTsdnModeYn == 'Y') {
	      						   rstMsg = rstMsg + (rstMsg != '' ? "/" : "") + "예비";		
	      					   }
	      					   
	      					   if (rstMsg != '') {
	      						   rstMsg = rstMsg + " 변경됨";
	      					   }
	      					   return rstMsg;
	      				   } 
	      		      }				
	      			, {key : 'wdmFreqVal'	, title : cflineMsgArray['wavelengthDivisionMultiplexerFrequencyValue']	, hidden : true}		/* WDM주파수값 */
	      			, {key : 'wdmChnlVal'	, title : cflineMsgArray['wavelengthDivisionMultiplexerChannelValue']		, hidden : true}		/* WDM채널값 */
	      			, {key : 'mgmtGrpCd'		, title : cflineMsgArray['managementGroup']+"ID"		, hidden : true}									/* 관리그룹ID */
	      			, {key : 'mgmtGrpCdNm'	, title : cflineMsgArray['managementGroupName']		, hidden : true}								/* 관리그룹명 */
	      			, {key : 'workUseYn'		, title : cflineMsgArray['workingYesOrNo']		, hidden : true}											/* 작업중여부 */
	      			, {key : 'workMgmtYn'	, title : cflineMsgArray['managementYesOrNo'] 		, hidden : true}									/* 관리여부 */
	      		];
	
	column = column.concat(appendColumn);
	
	return column;
}

function renderGrid(gridDiv, data, addColumn, setCount, totalCount, returnData){
	var group = "";
	var isPathAll = returnData.sAllPass; // $("input:checkbox[id='sAllPass']").is(":checked");
	var oldWdmType = returnData.sOldWdmType;	
	
	// 그리드 컬럼 초기화
	if(gridDiv == gridId){
		if(addColumn != null){
			if(maxPathCount <addColumn.length){
				column = getColumnMapping(gridDiv);
				/*for(var i=0; i<addColumn.length; i++){
					column.push(addColumn[i]);
				}*/
				if(addColumn != null){
    				$.each(addColumn, function(key,val){
    					column.push(val);
    	         	})
    			}
				
    			maxPathCount = addColumn.length;
			}
		} 
		// 기간망 형태 조회
		else if (isPathAll == true && oldWdmType == false) {
			column = getColumnMapping(gridDiv);
			column = rontTypePathAll(column);
		}
		// 일반조회
		else if(!isPathAll){
			column = getColumnMapping(gridDiv);
		}
		group = "sListGroup";
		initGridInfo(column, isPathAll, oldWdmType);
	} 
	else {
		if(addColumn != null){
			if(maxPathCountWork <addColumn.length){
				columnWork = getColumnMapping(gridDiv);
				/*for(var i=0; i<addColumn.length; i++){
					columnWork.push(addColumn[i]);
				}*/
				if(addColumn != null){
    				$.each(addColumn, function(key,val){
    					columnWork.push(val);
    	         	})
    			}
    			maxPathCountWork = addColumn.length;
			}
		} 
		// 기간망 형태 조회
		else if (isPathAll == true && oldWdmType == false) {
			columnWork = getColumnMapping(gridDiv);
			columnWork = rontTypePathAll(columnWork);
		}
		// 일반조회
		else if(!isPathAll) {
			columnWork = getColumnMapping(gridDiv);
		}
		group = "sWorkGroup";
		initGridWork(columnWork, isPathAll, oldWdmType);
	}
	
	
	
	$('#'+gridDiv).alopexGrid("columnFix", 6);
	
	if(setCount){
		$('#'+gridDiv).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);} } } );
		$('#'+group).text("("+getNumberFormatDis(totalCount)+")");
		
		var sTabIndex = $('#basicTabs').getCurrentTabIndex();	
		if((gridDiv == gridId && sTabIndex === 0) || (gridDiv == gridId && initGridWork === 1)){
			if(totalCount > 0){
				$('#btnExportExcel').setEnabled(true);
			}
			else{
				$('#btnExportExcel').setEnabled(false);
			}
		}
	}
}


/* 기간망 형태로 전체구간보기 그리드*/
function rontTypePathAll(column){

	var rontSctnClCd = ["001", "014", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "015", "012"];
	
	for(var colNum = 0; colNum < rontSctnClCd.length; colNum++){
		var headerStyle = "";
		if(colNum%2 == 0) headerStyle = "blue";
		
		var tempRontSctnClcd = rontSctnClCd[colNum];

		column.push({key : tempRontSctnClcd+'lftEqpRoleDiv'		, title : cflineMsgArray['system']/* 시스템 */, align:'center'	, width: '100px', headerStyleclass : headerStyle });
		column.push({key : tempRontSctnClcd+'lftJrdtTeamOrgNm'	, title : cflineMsgArray['managementTeam']/* 관리팀 */, align:'center'	, width: '100px', headerStyleclass : headerStyle});			
		column.push({key : tempRontSctnClcd+'lftVendorNm'		, title : cflineMsgArray['vend']/* 제조사 */, align:'center', width: '100px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'lftEqpInstlMtsoNm'	, title : cflineMsgArray['mtso']/* 국사 */, align:'center'	, width: '100px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'lftEqpNm'			, title : cflineMsgArray['nodeName']/* 노드명 */, align:'center'	, width: '150px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'lftCardMdlNm'		, title : "Unit"/* Unit */, align:'center'	, width: '80px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'lftShlfNm'			, title : "Shelf", align:'center'	, width: '50px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'lftSlotNo'			, title : "Slot", align:'center'	, width: '50px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'lftPortDescr'		, title : "Port", align:'center'	, width: '80px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'rghtEqpNm'			, title : "FDF", align:'center'	, width: '150px', headerStyleclass : headerStyle});
	    column.push({key : tempRontSctnClcd+'rghtPortDescr'		, title : "FDF"+cflineMsgArray['port'] /*포트*/, align:'center'	, width: '80px', headerStyleclass : headerStyle});
	    
	    /*if (tempRontSctnClcd == "014" || tempRontSctnClcd == "015") {
		    column.push({key : tempRontSctnClcd+'rghtEqpNm2'			, title : "FDF 2", align:'center'	, width: '150px', headerStyleclass : headerStyle});
		    column.push({key : tempRontSctnClcd+'rghtPortDescr2'		, title : "FDF "+cflineMsgArray['port'] 포트  + "2", align:'center'	, width: '80px', headerStyleclass : headerStyle});
	    }*/
	}
	
	for(var i=1; i<41; i++ ){
		column.push({key : 'p'+i, title : "P"+i, align:'center'	, width: '100px', headerStyleclass : "blue"});
	}
	
	return column;
}


function getGroupingColumn() {
	var grouping = {
			by : ['ntwkLineNo'],
			useGrouping:true,
			useGroupRowspan:true,
			useDragDropBetweenGroup:false,
			useGroupRearrange : true
	};
	return grouping;    
}

function getHeaderGroup(){
	var headerGroup = [ { title:cflineMsgArray['line'], fromIndex:1, toIndex:24 } ];
	/**
	 * 001 종단Client_S, 014 Spliter_S, 002 전송Client_S, 003 시스템IO연동_S_1, 004 시스템IO연동_S_2, 005 Link 정보_S, 006 ROADM MUX 정보_S
	 * 007 ROADM MUX 정보_E, 008 Link 정보_E, 009 시스템IO연동_E_1, 010 시스템IO연동_E_2, 011 전송Client_E, 015 Spliter_E, 012 종단Client_E, 013 중계
	 */
 
    var pathHeaderStart = 25;
    
	var sIndex = pathHeaderStart;
	var eIndex = pathHeaderStart;
 	var title = ['종단Client_S','SPLITTER_S','전송Client_S','시스템IO연동_S_1','시스템IO연동_S_2','Link 정보_S','ROADM MUX 정보_S','ROADM MUX 정보_E','Link 정보_E'
 	                   ,'시스템IO연동_E_1','시스템IO연동_E_2','전송Client_E','SPLITTER_E','종단Client_E'];
 	
 	for(var i in title){
 		eIndex = sIndex + 10;
 		/*if (i == 1 || i == 12) {
 			eIndex = eIndex + 2;
 		}*/
 		headerGroup.push({ title:title[i], fromIndex:sIndex, toIndex:eIndex });
 		sIndex = eIndex + 1;
 	}
 	
 	eIndex = sIndex + 40;
 	headerGroup.push({ title:"중계", fromIndex:sIndex, toIndex:eIndex });
 	
 	return headerGroup;
}


function searchBtnStyle(celStr, btnId, textWidth) {
	var str = '<label class="textsearch_1">';
	str += '<input id="schVal" name="schVal" type="text" value="'+celStr+'"  class="alopexgrid-default-renderer" style="width:'+textWidth+';">';
	str += '<span style="float:right"><button class="grid_search_icon Valign-md" id="'+btnId+'" type="button"></button></span></label>';
	return str;
}