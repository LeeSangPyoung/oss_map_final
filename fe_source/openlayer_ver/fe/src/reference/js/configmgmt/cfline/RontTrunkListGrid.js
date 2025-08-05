/**
 * RontTrunkListGrid.js
 *
 * @author Administrator
 * @date 2017.02.17.
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2019-12-26  1. [수정] 기간망 고도화 EAST FDF장비/포트 텍스트 입력
 * 2022-03-23  2. [추가] HOLA 기간망연동 데이터 추가 (HOLA기간망트렁크탭으로 별도 관리)
 *                dataGridHola - HOLA용 기간망 그리드 추가
 */
var gridId = 'dataGrid';
var gridIdWork = 'dataGridWork';
var gridHolaId = 'dataGridHola';
                  
$a.page(function() {
    this.init = function() {
    	initGridInfo();
    	initHolaGridInfo();
    	initGridWork();
    };
});

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

function initGridInfo() {
	var column = getColumnMapping(gridId);
	var headerGroup = getHeaderGroup(gridId);
	var groupColumn = getGroupingColumn();
    var group = "sListGroup";
    
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
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" },
		rowOption:{
//			 TODO 작업정보 권한적용되면 수정
//			if(data['workUseYn'] == 'Y' && data['workMgmtYn'] == 'Y') return {color:'red'}
			inlineStyle: function(data,rowOption){ 
				if(data['workUseYn'] == 'Y' && data['workMgmtYn'] == 'Y') {
					return {color:'red'} 
				}
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
						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y" ){
						    			returnValue = true;
						    			break;
						    		}
						    	}
						    	return returnValue; 
						    }
					   }
		]
	}); 
}

function initHolaGridInfo() {
	var column = getColumnMapping(gridHolaId);
	var headerGroup = getHeaderGroup(gridHolaId);
	var groupColumn = getGroupingColumn();
    var group = "sHolaListGroup";
    
	$('#'+gridHolaId).alopexGrid({
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
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" },
		rowOption:false,
		enableDefaultContextMenu:false,
		enableContextMenu:true,
		contextMenu : false
	}); 
}

function initGridWork(){
	var column = getColumnMapping(gridIdWork);
	var headerGroup = getHeaderGroup(gridIdWork);
	var groupColumn = getGroupingColumn();
	var group = "sWorkGroup";
	
    $('#'+gridWorkId).alopexGrid({
    	pager : true,
    	alwaysShowHorizontalScrollBar : false, //하단 스크롤바
    	autoColumnIndex: true,
    	autoResize: true,
    	cellSelectable : false,
    	rowClickSelect : true,
    	rowSingleSelect : false,
    	numberingColumnFromZero: false,
    	defaultColumnMapping:{sorting: true},
    	columnMapping:column,
    	headerGroup:headerGroup,
    	grouping : groupColumn,
    	message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"},
    	enableDefaultContextMenu:false,
		enableContextMenu:true,
    	contextMenu : [
    	               	{
    	               		title: cflineMsgArray['workInfSave'],  /*작업정보저장*/
						    processor: function(data, $cell, grid) { fnUpdate();},
						    use: function(data, $cell, grid) { return data._state.selected; }
					   },
		               { 
		            	   title: cflineMsgArray['workInfo'] + cflineMsgArray['finish'],   /*작업 정보 완료*/
		            	   processor: function(data, $cell, grid) {
		            		   fnWorkInfoFnsh(false);
		            	   },
		            	   use: function(data, $cell, grid) {
		            		   return data._state.selected;
		            	   }
		               },
		               {
		            	   title: cflineMsgArray['AllWorkInfFnsh'],  /*모든 작업 정보 완료*/
		            	   processor: function(data, $cell, grid) {
		            		   fnWorkInfoFnsh(true);
		            	   },
		            	   use: function(data, $cell, grid) {
		            		   return data._state.selected;
		            	   }
		               },
		               {
		            	   title: cflineMsgArray['trmn'], /*"해지"*/
		            	   processor: function(data, $cell, grid) {
		            		   fnLineTerminate();
		            	   },
		            	   use: function(data, $cell, grid) {
		            		   return data._state.selected;
		            	   }
		               }
		           ]
    });
    
    $('#'+gridWorkId).alopexGrid("viewUpdate");
}

function getColumnMapping(param){
	var isPathAll = $("input:checkbox[id='sAllPass']").is(":checked");
	
	var column = [
	              {selectorColumn : true, width : '50px', rowspan:{by:'ntwkLineNo'} } 
	    		, {key : 'check'		, title : cflineMsgArray['number'] /*번호*/, align:'center', width:'60px',numberingColumn : true, rowspan:{by:'ntwkLineNo'} }
	    		, {key : 'uprMtsoNm'	, title : cflineMsgArray['section']+'S' /* 구간S */, align:'left', width: '110px', rowspan:{by:'ntwkLineNo'}}
	    		, {key : 'lowMtsoNm'	, title : cflineMsgArray['section']+'E' /* 구간E */, align:'left'	, width: '110px', rowspan:{by:'ntwkLineNo'}}
	    		, {key : 'ntwkLineNo'	, title : cflineMsgArray['networkLineNumber']/*네트워크회선번호*/, align:'center', width: '120px', rowspan:true}	    		
	    	];
	
	if(param == gridWorkId){
	    var workColumn = [
  	    		{key : 'rontTrkLineRmk'	, title : cflineMsgArray['lineIdentification'] /* 회선ID*/, align:'center', width: '150px', editable:{type:"text"}, rowspan:{by:'ntwkLineNo'}}
  				, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px'}
	    		, {key : 'ntwkLineNm'	, title : '<em class="color_red">*</em>'+cflineMsgArray['lnNm']/*회선명*/, align:'left'	, width:'280px', editable:{type:"text"}, rowspan:{by:'ntwkLineNo'}	}
	    		, {key : 'rontTrkTypCd'	, title : '<em class="color_red">*</em>'+cflineMsgArray['serviceType'] /*서비스유형*/, align:'left', width:'120px', rowspan:{by:'ntwkLineNo'}
	    			, render : {
	    				type : 'string',
	    				rule : function(value, data) {
	    					var render_data = [];
							if (rontTrkTypCd.length > 1) {
								return render_data = render_data.concat(rontTrkTypCd);
							} else {
								return render_data.concat({value : data.rontTrkTypCd, text : data.rontTrkTypNm });
							}
	    				}
	    			} , editable : { type: 'select', rule: function(value, data) { return rontTrkTypCd; } 
						, attr : { style : "width: 110px;min-width:110px;padding: 2px 2px;" }
		    		}
		    		, editedValue : function (cell) { return $(cell).find('select option').filter(':selected').val(); }
	    		  }
	    		, {key : 'wdmChnlVal'	, title : cflineMsgArray['channel']/*채널*/, align:'left', width: '60px', editable:{type:"text"}, rowspan:{by:'ntwkLineNo'}}
	    		/* wdmBdwthVal-- wdmWavlVal 변경 2017-02-11 */
	    		, {key : 'wdmWavlVal'	, title : cflineMsgArray['wavelength']/*파장*/, align:'left', width: '100px', editable:{type:"text"}, rowspan:{by:'ntwkLineNo'}}
	    		, {key : 'rontTrkCapaTypCd'	, title : '<em class="color_red">*</em>'+cflineMsgArray['lineType'] /*회선타입*/, align:'left', width: '100px', rowspan:{by:'ntwkLineNo'}
	    			, render :  {
	    				type : 'string',
	    				rule :function(value, data) {
	    					var render_data = [];
							if (capaTypCd.length > 1) {
								return render_data = render_data.concat(capaTypCd);
							} else {
								return render_data.concat({value : data.rontTrkCapaTypCd, text : data.rontTrkCapaTypNm });
							}
	    				}
	    			}
	    				//function(value, data){ return data.rontTrkCapaTypNm;}
	    			, editable : { type: 'select', rule: function(value, data) { return capaTypCd; } 
	    			, attr : { style : "width: 80px;min-width:80px;padding: 2px 2px;" }
	    			}
	    			, editedValue : function (cell) { return $(cell).find('select option').filter(':selected').val(); }
	    		  }
	    		, {key : 'protModeTypCd', title : '<em class="color_red">*</em>'+cflineMsgArray['protectionMode'] /*보호모드*/, align:'left', width:'100px', rowspan:{by:'ntwkLineNo'}
	    			//, render : function(value, data){ return data.protModeTypNm;}
		    		,render : {
	    				type : 'string',
	    				rule :function(value, data) {
						var render_data = [];
							if (protModeTypCd.length > 1) {
								return render_data = render_data.concat(protModeTypCd);
							} else {
								return render_data.concat({value : data.protModeTypCd, text : data.protModeTypNm });
							}
	    				}
					}
		    		, editable : { type: 'select', rule: function(value, data) { return protModeTypCd; } 
		    			, attr : { style : "width: 80px;min-width:80px;padding: 2px 2px;" }
		    		}
		    		, editedValue : function (cell) { return $(cell).find('select option').filter(':selected').val(); }
	    		  }
	    		, {key : 'rontTrkUseYn'	, title : cflineMsgArray['useExistenceAndNonexistence'] /* 사용유무 */, align:'center', width: '120px', rowspan:{by:'ntwkLineNo'},
    				render : {
    					type : 'string',
    					rule : function(value, data) {
    						return ynList;
    					}
    				},
    				editable : {type : 'select',rule : function(value, data) {return ynList; }
    						 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
    				},
    				editedValue : function(cell) {
    					return $(cell).find('select option').filter(':selected').val(); 
    				}
	    		  }    
	    		, {key : 'lineAppltNo'	, title : cflineMsgArray['lineApplicationNumber']/*회선청약번호*/, align:'center', width: '120px', rowspan:true}
	    		, {key : 'mgmtGrpCd'	, title : '관리그룹ID'		, hidden : true}
      			, {key : 'mgmtGrpCdNm'	, title : '관리그룹명'		, hidden : true}
      			, {key : 'workUseYn'	, title : '작업중여부'		, hidden : true} 
	    		, {key : 'workMgmtYn'	, title : '관리여부'		, hidden : true}     			
	                      
	        ];
	    column = column.concat(workColumn);
	    
	} else if(param == gridHolaId) {
		var infoColumn = [

		    	    		{key : 'tsdnRontLineNo'	, title : cflineMsgArray['lineIdentification'] /* HolaID */, align:'center', width: '150px', rowspan:{by:'ntwkLineNo'}}
		  				, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px'}
		  	    		, {key : 'ntwkLineNm'	, title : cflineMsgArray['lnNm']/*회선명*/, align:'left', width:'280px', rowspan:{by:'ntwkLineNo'}	}
		  	    		, {key : 'rontTrkTypCd'	, title : cflineMsgArray['serviceType'] /*서비스유형*/, align:'left', width:'100px', rowspan:{by:'ntwkLineNo'}
		  	    			, render : function(value, data){ return data.rontTrkTypNm;}
		  	    		  }
		  	    		, {key : 'wdmChnlVal'	, title : cflineMsgArray['channel']/*채널*/, align:'left'	, width: '50px', rowspan:{by:'ntwkLineNo'}}
		  	    		, {key : 'wdmWavlVal'	, title : cflineMsgArray['wavelength']/*파장*/, align:'left', width: '100px', rowspan:{by:'ntwkLineNo'}}
		  	    		, {key : 'rontTrkCapaTypCd'	, title : cflineMsgArray['lineType'] /*회선타입*/, align:'left', width: '100px', rowspan:{by:'ntwkLineNo'}
		  	    			, render : function(value, data){ return data.rontTrkCapaTypNm;}
		  	    		  }
		  	    		, {key : 'protModeTypCd', title : cflineMsgArray['protectionMode'] /*보호모드*/, align:'left', width:'100px', rowspan:{by:'ntwkLineNo'}
		  	    			, render : function(value, data){ return data.protModeTypNm;}
		  	    		  }  
		  	    		, {key : 'mgmtGrpCd'	, title : '관리그룹ID'		, hidden : true}
		        		, {key : 'mgmtGrpCdNm'	, title : '관리그룹명'		, hidden : true}
		        		];
		  	    column = column.concat(infoColumn);
		  	    
	} else {
	    var infoColumn = [

  	    		{key : 'rontTrkLineRmk'	, title : cflineMsgArray['lineIdentification'] /* 회선ID */, align:'center', width: '150px', rowspan:{by:'ntwkLineNo'}}
				, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px'}
	    		, {key : 'ntwkLineNm'	, title : cflineMsgArray['lnNm']/*회선명*/, align:'left', width:'280px', rowspan:{by:'ntwkLineNo'}	}
	    		, {key : 'rontTrkTypCd'	, title : cflineMsgArray['serviceType'] /*서비스유형*/, align:'left', width:'100px', rowspan:{by:'ntwkLineNo'}
	    			, render : function(value, data){ return data.rontTrkTypNm;}
	    		  }
	    		, {key : 'wdmChnlVal'	, title : cflineMsgArray['channel']/*채널*/, align:'left'	, width: '50px', rowspan:{by:'ntwkLineNo'}}
	    		/* wdmBdwthVal-- wdmWavlVal 변경 2017-02-11 */
	    		, {key : 'wdmWavlVal'	, title : cflineMsgArray['wavelength']/*파장*/, align:'left', width: '100px', rowspan:{by:'ntwkLineNo'}}
	    		, {key : 'rontTrkCapaTypCd'	, title : cflineMsgArray['lineType'] /*회선타입*/, align:'left', width: '100px', rowspan:{by:'ntwkLineNo'}
	    			, render : function(value, data){ return data.rontTrkCapaTypNm;}
	    		  }
	    		, {key : 'protModeTypCd', title : cflineMsgArray['protectionMode'] /*보호모드*/, align:'left', width:'100px', rowspan:{by:'ntwkLineNo'}
	    			, render : function(value, data){ return data.protModeTypNm;}
	    		  }
	    		, {key : 'rontTrkUseYn'	, title : cflineMsgArray['useExistenceAndNonexistence'] /* 사용유무 */, align:'center', width: '120px', rowspan:{by:'ntwkLineNo'},
	    				render : {
	    					type : 'string',
	    					rule : function(value, data) {
	    						return ynList;
	    					}
	    				},
    	          } 
	    		, {key : 'lineAppltNo'	, title : cflineMsgArray['lineApplicationNumber']/*회선청약번호*/, align:'center', width: '120px', rowspan:{by:'ntwkLineNo'}}    
	    		, {key : 'mgmtGrpCd'	, title : '관리그룹ID'		, hidden : true}
      			, {key : 'mgmtGrpCdNm'	, title : '관리그룹명'		, hidden : true}
      			, {key : 'workUseYn'	, title : '작업중여부'		, hidden : true}
	    		, {key : 'workMgmtYn'	, title : '관리여부'		, hidden : true}
	        ];
	    column = column.concat(infoColumn);
	}
	
	// 경유PTP링
	 var ptpRingColumn = [{key : 'useRingNtwkLineNos'	, title : "경유PTP링", align:'center', width: '200px', rowspan:{by:'ntwkLineNo'}}];
	 column = column.concat(ptpRingColumn);
		
	if(isPathAll){
		
		var rontSctnClCd = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012"];
		
		for(var colNum = 0; colNum < rontSctnClCd.length; colNum++){
			var headerStyle = "";
			if(colNum%2 == 0) headerStyle = "blue";
			if (rontSctnClCd[colNum] != "003" && rontSctnClCd[colNum] != "004" && rontSctnClCd[colNum] != "009" && rontSctnClCd[colNum] != "010") {
				column.push({key : rontSctnClCd[colNum]+'lftEqpRoleDiv'		, title : cflineMsgArray['system']/* 시스템 */, align:'center'	, width: '100px', headerStyleclass : headerStyle });
				column.push({key : rontSctnClCd[colNum]+'lftJrdtTeamOrgNm'	, title : cflineMsgArray['managementTeam']/* 관리팀 */, align:'center'	, width: '100px', headerStyleclass : headerStyle});			
				column.push({key : rontSctnClCd[colNum]+'lftVendorNm'		, title : cflineMsgArray['vend']/* 제조사 */, align:'center', width: '100px', headerStyleclass : headerStyle});
			    column.push({key : rontSctnClCd[colNum]+'lftEqpInstlMtsoNm'	, title : cflineMsgArray['mtso']/* 국사 */, align:'center'	, width: '100px', headerStyleclass : headerStyle});
			}
		    column.push({key : rontSctnClCd[colNum]+'lftEqpNm'			, title : cflineMsgArray['nodeName']/* 노드명 */, align:'center'	, width: '150px', headerStyleclass : headerStyle});
		    column.push({key : rontSctnClCd[colNum]+'lftCardMdlNm'		, title : "Unit"/* Unit */, align:'center'	, width: '80px', headerStyleclass : headerStyle});
		    column.push({key : rontSctnClCd[colNum]+'lftShlfNm'			, title : "Shelf", align:'center'	, width: '50px', headerStyleclass : headerStyle});
		    column.push({key : rontSctnClCd[colNum]+'lftSlotNo'			, title : "Slot", align:'center'	, width: '50px', headerStyleclass : headerStyle});
		    column.push({key : rontSctnClCd[colNum]+'lftPortDescr'		, title : "Port", align:'center'	, width: '80px', headerStyleclass : headerStyle});
		    /* 2019-12-26  1. [수정] 기간망 고도화
		    column.push({key : rontSctnClCd[colNum]+'rghtEqpNm'			, title : "FDF", align:'center'	, width: '150px', headerStyleclass : headerStyle});
		    column.push({key : rontSctnClCd[colNum]+'rghtPortDescr'		, title : "FDF"+cflineMsgArray['port'] 포트, align:'center'	, width: '80px', headerStyleclass : headerStyle});*/
		    column.push({key : rontSctnClCd[colNum]+'rghtFdfEqpPortVal'	, title : "FDF", align:'center'	, width: '200px', headerStyleclass : headerStyle});
		}
		
		for(var i=1; i<41; i++ ){
			column.push({key : 'p'+i, title : "P"+i, align:'center'	, width: '100px', headerStyleclass : "blue"});
		}
	}
	
	return column;
}

function getHeaderGroup(param){
	var headerGroup = [ { title:cflineMsgArray['line'], fromIndex:1, toIndex:19 } ];
	/**
	 * 001 종단Client_S, 002 전송Client_S, 003 시스템IO연동_S_1, 004 시스템IO연동_S_2, 005 Link 정보_S, 006 ROADM MUX 정보_S
	 * 007 ROADM MUX 정보_E, 008 Link 정보_E, 009 시스템IO연동_E_1, 010 시스템IO연동_E_2, 011 전송Client_E, 012 종단Client_E, 013 중계
	 */
    var isPathAll = param == "excel"? false : $("input:checkbox[id='sAllPass']").is(":checked");
 
    // 기간망 고도화 20171205
    var pathHeaderStart = 20;//19(경우PTP링);
    
    if(isPathAll){
    	var sIndex = pathHeaderStart;
    	var eIndex = pathHeaderStart;
     	var title = ['종단Client_S','전송Client_S','시스템IO연동_S'/*,'시스템IO연동_S_2'*/,'Link 정보_S','ROADM MUX 정보_S','ROADM MUX 정보_E','Link 정보_E'
     	                   ,'시스템IO연동_E'/*,'시스템IO연동_E_2'*/,'전송Client_E','종단Client_E'];
     	
     	for(var i in title){
     		/*eIndex = sIndex + 9;
     		headerGroup.push({ title:title[i], fromIndex:sIndex, toIndex:eIndex });
     		sIndex = eIndex + 1;*/
     		
     		eIndex = sIndex + ((title[i] != '시스템IO연동_S' && title[i] != '시스템IO연동_E') ? 9 : 11);
     		headerGroup.push({ title:title[i], fromIndex:sIndex, toIndex:eIndex });
     		sIndex = eIndex + 1;
     	}
     	
     	eIndex = sIndex + 40;
     	headerGroup.push({ title:"중계", fromIndex:sIndex, toIndex:eIndex });
 	}
 	
 	return headerGroup;
}

function renderGrid(gridDiv, data, setCount, totalCount){
	var group = "";
	// 그리드 컬럼 초기화
	if(gridDiv == gridId){
		initGridInfo();
		group = "sListGroup";
		
	} else if(gridDiv == gridHolaId){
		initHolaGridInfo();
		group = "sHolaListGroup";
	}
	else {
		initGridWork();
		group = "sWorkGroup";
	}
	
	$('#'+gridDiv).alopexGrid("columnFix", 6);
	
	if(setCount){
		$('#'+gridDiv).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);} } } );
		$('#'+group).text("("+getNumberFormatDis(totalCount)+")");
		
		var sTabIndex = $('#basicTabs').getCurrentTabIndex();	
		if((gridDiv == gridId && sTabIndex === 0) || (gridDiv == gridId && initGridWork === 1) || (sTabIndex === 2)){
			if(totalCount > 0){
				$('#btnExportExcel').setEnabled(true);
			}
			else{
				$('#btnExportExcel').setEnabled(false);
			}
		}
	}
}