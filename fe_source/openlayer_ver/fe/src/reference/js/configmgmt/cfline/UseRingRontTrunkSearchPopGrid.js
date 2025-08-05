/**
 * UseRingRontTrunkSearchPopGrid.js
 *
 * @date 2018.09.11 
 * 
 */
var mainGridId = 'mainGrid';
var lnoGridId = 'lnoGrid';
/*var addData = false;*/
                  
$a.page(function() {
    this.init = function() {
    	//initMainGrid();
    	//initLnoGrid();
    	renderGrid(mainGridId, null, 0, false);
    	renderGrid(lnoGridId, null, 0, false);
    };
});

function initMainGrid() {
	var mainColumn = getColumnMapping(mainGridId);
	$('#'+mainGridId).alopexGrid({
    	pager : true,
    	autoColumnIndex: true,
		autoResize: true,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : false, //하단 스크롤바
		rowClickSelect : true,
		rowSingleSelect : true,
		numberingColumnFromZero: false,
		defaultColumnMapping:{sorting: true},
		columnMapping:mainColumn,
		height : "9row",
		fillUndefinedKey:null,
		fitTableWidth : true,
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" },
	}); 
}

function initLnoGrid() {
	var lnocolumn = getColumnMapping(lnoGridId);

	var groupColumn = groupingColumnNetworkPath();
	$('#'+lnoGridId).alopexGrid({
		pager : false,
		autoColumnIndex: true,
		autoResize: true,
		cellInlineEdit : false,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : false, //하단 스크롤바
		rowSingleSelect : false,
		rowInlineEdit: false,
		rowClickSelect : false,
		cellInlineEdit : false,
		cellSelectable : true,		
		multiRowDragDrop: true,
		rowspanGroupSelect: true,
		numberingColumnFromZero: false,
		defaultColumnMapping:{sorting: true},
		columnMapping:lnocolumn,
		grouping : groupColumn,
		height : "11row",
		fillUndefinedKey:null,
		fitTableWidth : true,
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" }

		, enableDefaultContextMenu:false
		, enableContextMenu:true
		, contextMenu : [
			               {
								title: '링 뒤집기',		/* 링 뒤집기 */
							    processor: function(data, $cell, grid) {
							    	reverseRingPath(data);
							    },
							    use: function(data, $cell, grid) {
							    	//if(data._key == 'RING_NM') {
							    	if(data._index.column == 11) {
								    	if (searchTopoLclType == "RONT_TRK"  && nullToEmpty(data.RING_ID) != "") {
								    		return true;
								    	} else {
								    		return false;
								    	}
							    	} else {
							    		return false;
							    	}
							    }
						   }
			             ] 
	}); 
}

function getColumnMapping(param){
	var column = [
	              	  {key : 'check'		, title : cflineMsgArray['number'] /*번호*/, align:'center', width:'60px',numberingColumn : true, rowspan:{by:'ntwkLineNo'} }
	              	, {key : 'ntwkLineNo'	, title : cflineMsgArray['networkLineNumber']/*네트워크회선번호*/, align:'center', width: '120px', rowspan:true}	  		
	              ];
	
	if(param == mainGridId){
	    var  mainColumn= [
	                      	  {key : 'ntwkLineNm'	, title : cflineMsgArray['lnNm']/*회선명*/, align:'left'	, width:'280px', editable:{type:"text"}, rowspan:{by:'ntwkLineNo'}	}
							, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px'}
				      	    , {key : 'mgmtGrpCdNm',	title : cflineMsgArray['managementGroup'] /*관리그룹*/, align:'center', width: '90px'  }
							
				      	    /* 링*/
					      	, {key : 'ntwkTypCdNm', title :  cflineMsgArray['networkDivision'] /*망구분*/, align: 'center', width: '135px'}
					      	, {key : 'topoSclCdNm', title :  cflineMsgArray['ntwkTopologyCd'] /*망종류*/, align:'center',	width: '150px'}
					      	, {key : 'eqpDivNm',	    title : cflineMsgArray['eqpDivNm'] /*장비구분*/,	align:'center',	width: '120px'}
					      	, {key : 'topoCfgMeansCdNm', title :  cflineMsgArray['topologyConfigurationMeans'] /*토폴로지구성방식*/, align:'center',	width: '150px'}
					      	, {key : 'ntwkCapaCdNm', title : cflineMsgArray['capacity'] /*용량*/, align:'center',	width: '90px' }
				      	    
				      	   /* 기간망*/
				      	    , {key : 'rontTrkTypCd'	, title : cflineMsgArray['serviceType'] /*서비스유형*/, align:'left', width:'100px', rowspan:{by:'ntwkLineNo'}
			    				, render : function(value, data){ return data.rontTrkTypNm;} , hidden :true  }
							, {key : 'wdmChnlVal'	, title : cflineMsgArray['channel']/*채널*/, align:'left'	, width: '50px', hidden :true  , rowspan:{by:'ntwkLineNo'}}
				    		/* wdmBdwthVal-- wdmWavlVal 변경 2017-02-11 */
				    		, {key : 'wdmWavlVal'	, title : cflineMsgArray['wavelength']/*파장*/, align:'left', width: '100px', hidden :true  , rowspan:{by:'ntwkLineNo'}}
				    		, {key : 'rontTrkCapaTypCd'	, title : cflineMsgArray['lineType'] /*회선타입*/, align:'left', hidden :true  , width: '100px', rowspan:{by:'ntwkLineNo'}
				    			, render : function(value, data){ return data.rontTrkCapaTypNm;}}
				    	    , {key : 'useRingNtwkLineNoList'	, title : "경유PTP링", align:'center', width: '200px', hidden :true  , rowspan:{by:'ntwkLineNo'}}
	          	        ];
	    column = column.concat(mainColumn);
	    
	}else{
		var lnoColumn = [
								
								{ key : 'RING_MERGE', hidden : true, value : function(value, data) {
										if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
											return data._index.id;
										} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
											return data['WDM_TRUNK_ID'];
										} else if(data['RING_ID'] != null) {
											return data['RING_ID'];
										} 
									}
							    }
								// 2019-09-30  3. 기간망 링 선번 고도화
					           , { key : 'RING_MERGE2', hidden : true, value : function(value, data) {
									if(data['RING_ID2'] == null && data['WDM_TRUNK_ID'] == null) {
										return data._index.id;
									} else if(data['RING_ID2'] == null && data['WDM_TRUNK_ID'] != null) {
										return data['WDM_TRUNK_ID'];
									} else if(data['RING_ID2'] != null) {
										return data['RING_ID2'] + "_" + data['RING_ID_L1'];
									} 
								  }
						        }	
						       , { key : 'RING_MERGE3', hidden : true, value : function(value, data) {
									if(data['RING_ID3'] == null && data['WDM_TRUNK_ID'] == null) {
										return data._index.id;
									} else if(data['RING_ID3'] == null && data['WDM_TRUNK_ID'] != null) {
										return data['WDM_TRUNK_ID'];
									} else if(data['RING_ID3'] != null) {
										return data['RING_ID3'] +"_" + data['RING_ID_L2'] + "_" + data['RING_ID_L1'];
									} 
								  }
						        }	
								, { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
									   return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; 
									}
								}								
								, { key : 'WDM_TRUNK_NM'
									, title : cflineMsgArray['wdmTrunkName']
					        		, inlineStyle: wdmStyleCss
					        		, hidden: true
								 }
						        , { key : 'WDM_TRUNK_ID', width : '120px', title : "WDM_TRUNK_ID", hidden: true }
						        
						        
						        //, { selectorColumn : true, width : '40px', rowspan : {by : 'RING_MERGE' } }
						        , { key : 'MOVE', dragdropColumn : true, width : '30px', rowspan : {by : 'RING_MERGE' } , hidden: true}
						        , { key : 'RONT_LINK_PATH_NODE', title : cflineMsgArray['repeat'] + 'NODE', align : 'left', width : '70px', hidden: true}
						        , { key : 'REFC_RONT_TRK_NTWK_LINE_NO', title : '참조기간망트렁크회선번호', align : 'left', width : '138px', hidden: true}
						        , { key : 'REFC_RONT_TRK_NTWK_LINE_NM', title : '참조기간망트렁크회선명', align : 'left', width : '138px', hidden: true}
						        , { key : 'RING_NM', title : cflineMsgArray['ringName'], align : 'left', width : '138px', hidden: true 
									, inlineStyle: ringStyleCss
									, rowspan : {by : 'RING_MERGE'} 
									//, tooltip : tooltipNetworkText
								}	/* 링명 */
						        , { key : 'CASCADING_RING_NM', 		title : '경유링명'   /* 경유링 명 */, hidden:false
									, width : '170px'
								    , inlineStyle: ringStyleCss
								    , rowspan : {by : 'RING_MERGE'}
								    , tooltip : tooltipNetworkText
									, value : function(value, data) {
										return data['RING_NM']
									}
								  }
								/*, { key : 'CASCADING_RING_NM_2', 		title : '경유링Lv2명'    경유링 명 , hidden:true
									    , align : 'left', width : '170px'
										, inlineStyle: ringStyleCss
										, tooltip : tooltipNetworkText
										, rowspan : {by : 'RING_MERGE2'}
										, value : function(value, data) {
											return data['RING_NM_L2']
										}
									}
								, { key : 'CASCADING_RING_NM_3', 		title : '경유링Lv3명'    경유링 명 , hidden:true
								    , align : 'left', width : '170px'
									, inlineStyle: ringStyleCss
									, tooltip : tooltipNetworkText
									, rowspan : {by : 'RING_MERGE3'}
									, value : function(value, data) {
										return data['RING_NM_L3']
									}
								}*/
						        , { key : 'RING_ID', width : '120px', title : "RING_ID", hidden: true }
							   , { key : 'RING_ID_L2', 					align : 'center', width : '10px', hidden : true}
							   , { key : 'RING_ID_L3', 					align : 'center', width : '10px', hidden : true}
						        /*, { key : 'TRUNK_NM', 				title : cflineMsgArray['trunkNm'], align : 'left', width : '110px'
									, hidden : true
									, inlineStyle: trunkStyleCss
									, rowspan : {by : 'TRUNK_MERGE'}
								}
						        , { key : 'TRUNK_ID', width : '120px', title : "TRUNK_ID", hidden: true }
								, { key : 'SERVICE_NM', title : "경유회선명(Cascading)", align : 'left', width : '138px', hidden: true
									, inlineStyle: serviceStyleCss
									, rowspan : {by : 'SERVICE_MERGE'}   서비스 	
								}	 회선명 
						        , { key : 'SERVICE_ID', 					title : 'SERVICE_ID', align : 'left', hidden: true }*/
						        
						        , { key : 'LEFT_ORG_NM', title : cflineMsgArray['westMtso'], align : 'center', width : '100px' /*, styleclass : nodeCopyPasteCss*/ } /* A 국사 */
						        , { key : 'LEFT_NODE_ROLE_NM', 		title : cflineMsgArray['westSupSub'], align : 'center', width : '90px' /* , styleclass : nodeCopyPasteCss */ } /* 상하위 */
						        , { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '130px' /* , inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss */ } /* A장 비 */
						        , { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '80px' /* , inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss */ } /* A 포트 */
						       
						        /*, { key : 'A', 			title : '',  align : 'left', width : '5px'
					        		, styleclass: 'guard'
					        		, headerStyleclass : 'guard'
					        	}  경계선 */
						        , { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '130px' /* , inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss */} /* B 장비 */
						        , { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '80px' /* , inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss */ } /* B 포트 */
						       
						        , { key : 'RIGHT_NODE_ROLE_NM', 	title : cflineMsgArray['eastSupSub'], align : 'center', width : '90px' /* , styleclass : nodeCopyPasteCss */ } /* 상하위 */
						        , { key : 'RIGHT_ORG_NM', 				title : cflineMsgArray['eastMtso'], align : 'center', width : '98px' /* , styleclass : nodeCopyPasteCss */ } /* B 국사 */
			   	];
		
		column = lnoColumn.concat(addcolumn());
	}
	
	return column;
}

function addcolumn() {
	var mappingAddColumn = [
	    { key : 'LEFT_NE_ID', width : '100px', title : "좌장비", hidden: true, editable:  { type: 'text'} }
	    , { key : 'LEFT_NE_REMARK', width : '100px', title : "좌장비", hidden: true }
	    , { key : 'LEFT_NE_ROLE_CD', width : '100px', title : "좌장비", hidden: true}
	    , { key : 'LEFT_NE_DUMMY', width : '100px', title : "좌장비", hidden: true
			, value : function(value, data){
				if(value == "Y") {
					return 'true';
				} else if(value == "N") {
					return 'false';
				} else {
					return value;
				}
			}
	    }
	    , { key : 'LEFT_MODEL_ID', width : '100px', title : "모델", hidden: true}
	    , { key : 'LEFT_MODEL_NM', width : '100px', title : "모델", hidden: true}
		, { key : 'LEFT_PORT_ID', width : '100px', title : "좌포트", hidden: true, editable:  { type: 'text'} } 
		, { key : 'LEFT_PORT_NM', width : '100px', title : "좌포트", hidden: true }
		, { key : 'LEFT_RACK_NO', width : '100px', hidden: true }
		, { key : 'LEFT_RACK_NM', width : '100px', hidden: true }
		, { key : 'LEFT_SHELF_NO', width : '100px', hidden: true }
		, { key : 'LEFT_SHELF_NM', width : '100px', hidden: true }
		, { key : 'LEFT_SLOT_NO', width : '100px', hidden: true }
		, { key : 'LEFT_CARD_ID', width : '100px', hidden: true }
		, { key : 'LEFT_CARD_NM', width : '100px', hidden: true }
		, { key : 'LEFT_CARD_STATUS_CD', width : '100px', hidden: true }
		, { key : 'LEFT_PORT_STATUS_CD', width : '100px', hidden: true }
		, { key : 'LEFT_PORT_STATUS_NM', width : '100px', hidden: true }
		, { key : 'LEFT_PORT_DUMMY', width : '100px', hidden: true }
		, { key : 'LEFT_CHANNEL_IDS', width : '100px', hidden: true }
		, { key : 'LEFT_ORG_ID', width : '100px', hidden: true }
		
		, { key : 'RIGHT_NE_ID', width : '100px', title : "우장비", hidden: true, editable: { type: 'text'} }
		, { key : 'RIGHT_NE_REMARK', width : '100px', title : "우장비", hidden: true }
		, { key : 'RIGHT_NE_ROLE_CD', width : '100px', title : "우장비", hidden: true }
		, { key : 'RIGHT_NE_DUMMY', width : '100px', title : "우장비", hidden: true
			, value : function(value, data){
				if(value == "Y") {
					return 'true';
				} else if(value == "N") {
					return 'false';
				} else {
					return value;
				}
			}
		}
		, { key : 'RIGHT_MODEL_ID', width : '100px', title : "모델", hidden: true}
		, { key : 'RIGHT_MODEL_NM', width : '100px', title : "모델", hidden: true}
		, { key : 'RIGHT_PORT_ID', width : '100px', title : "우포트", hidden: true, editable: { type: 'text'} }
		, { key : 'RIGHT_PORT_NM', width : '100px', title : "우포트", hidden: true}
		, { key : 'RIGHT_RACK_NO', width : '100px', hidden: true }
		, { key : 'RIGHT_RACK_NM', width : '100px', hidden: true }
		, { key : 'RIGHT_SHELF_NO', width : '100px', hidden: true }
		, { key : 'RIGHT_SHELF_NM', width : '100px', hidden: true }
		, { key : 'RIGHT_SLOT_NO', width : '100px', hidden: true }
		, { key : 'RIGHT_CARD_ID', width : '100px', hidden: true }
		, { key : 'RIGHT_CARD_NM', width : '100px', hidden: true }
		, { key : 'RIGHT_CARD_STATUS_CD', width : '100px', hidden: true }
		, { key : 'RIGHT_PORT_STATUS_CD', width : '100px', hidden: true }
		, { key : 'RIGHT_PORT_STATUS_NM', width : '100px', hidden: true }
		, { key : 'RIGHT_PORT_DUMMY', width : '100px', hidden: true }
		, { key : 'RIGHT_CHANNEL_IDS', width : '100px', hidden: true }
		, { key : 'RIGHT_ORG_ID', width : '100px', hidden: true }
		
		, { key : 'RX_LINK_ID', title : "RX_LINK_ID", hidden: true }
		, { key : 'RX_LINK_DIRECTION', title : "RX_LINK_DIRECTION", hidden: true 
//			, value : function(value, data){
//				if(nullToEmpty(value)==""){
//					return nullToEmpty(data["RX_LINK_DIRECTION"]) == ""? "RIGHT":data["RX_LINK_DIRECTION"];
//				} else {
//					return value;
//				}
//			}	
		}
		, { key : 'LEFT_RX_NE_ID', hidden: true }
		, { key : 'LEFT_RX_NE_NM', hidden: true }
		, { key : 'LEFT_RX_PORT_ID', hidden: true }
		, { key : 'RIGHT_RX_NE_ID', hidden: true}
		, { key : 'RIGHT_RX_NE_NM', hidden: true }
		, { key : 'RIGHT_RX_PORT_ID', hidden: true}
		
    	, { key : 'LINK_ID', width : '120px', title : "LINK_ID", hidden: true }
	    , { key : 'LINK_SEQ', width : '120px', title : "LINK_SEQ", hidden: true }
	    , { key : 'LINK_DIRECTION', width : '120px', title : "LINK_DIRECTION", hidden: true
//	    		, value : function(value, data) { 
//	    			if(nullToEmpty(value)==""){
//						return nullToEmpty(data["LINK_ID"]) == ""? "RIGHT":data["LINK_DIRECTION"];
//					} else {
//						return value;
//					}
//	    		}
	    	}
	    , { key : 'LINK_VISIBLE', width : '100px', title : "LINK_VISIBLE",  hidden: true
//		    	, value : function(value, data) { 
//	    			if(nullToEmpty(value) != "") return value;
//	    			else if(nullToEmpty(data["LINK_VISIBLE"]) != "") return data["LINK_VISIBLE"]; 
//	    			else return true;
//	    		}
		    }
	    
	    , { key : 'USE_NETWORK_ID', width : '100px', title : "USE_NTWK_ID", hidden: true}
	    , { key : 'USE_NETWORK_PATH_SAME_NO', width : '100px', title : "USE_NTWK_PATH_SAME_NO", hidden: true}
	    , { key : 'USE_NETWORK_PATH_DIRECTION', width : '140px', title : "USE_NTWK_PATH_DIRECTION", hidden: true}
	    , { key : 'USE_NETWORK_LINK_DIRECTION', width : '140px', title : "USE_NTWK_LINK_DIRECTION", hidden: true}		   
	    , { key : 'USE_NETWORK_LEFT_CHANNEL_DESCR', width : '100px', title : 'USE_NTWK_LEFT_CHANNEL', hidden: true 
	    	, value : function(value, data) { 
    			if(nullToEmpty(value) =="" ){
					return "";
				} else {
					return value;
				}
    		}
	    }
	    , { key : 'USE_NETWORK_RIGHT_CHANNEL_DESCR', width : '100px', title : 'RIGHT_NTWK_LEFT_CHANNEL', hidden: true }
	    
	    /* 서비스회선 */
        , { key : 'SERVICE_PATH_DIRECTION', 		title : 'SERVICE_PATH_DIRECTION', align : 'left', hidden: true }
        , { key : 'SERVICE_PATH_SAME_NO', 			title : 'SERVICE_PATH_SAME_NO', align : 'left', hidden: true }
        , { key : 'SERVICE_STATUS_CD', 				title : 'SERVICE_STATUS_CD', align : 'left', hidden: true }
        , { key : 'SERVICE_STATUS_NM', 				title : 'SERVICE_STATUS_NM', align : 'left', hidden: true }
        , { key : 'SERVICE_LINE_LARGE_CD', 			title : 'SERVICE_LINE_LARGE_CD', align : 'left', hidden: true }
        , { key : 'SERVICE_LINE_LARGE_NM', 			title : 'SERVICE_LINE_LARGE_NM', align : 'left', hidden: true }
        , { key : 'SERVICE_LINE_SMALL_CD', 			title : 'SERVICE_LINE_SMALL_CD', align : 'left', hidden: true }        
	    
	    , { key : 'TRUNK_PATH_DIRECTION', width : '140px', title : "TRUNK_PATH_DIRECTION", hidden: true}
	    , { key : 'TRUNK_PATH_SAME_NO', width : '100px', title : 'TRUNK_PATH_SAME_NO', hidden: true }
	    , { key : 'TRUNK_TOPOLOGY_LARGE_CD', width : '100px', title : 'TRUNK_TOPOLOGY_LARGE_CD', hidden: true }
	    , { key : 'TRUNK_TOPOLOGY_SMALL_CD', width : '100px', title : 'TRUNK_TOPOLOGY_SMALL_CD', hidden: true }
	    , { key : 'TRUNK_TOPOLOGY_MEANS_CD', width : '100px', title : 'TRUNK_TOPOLOGY_MEANS_CD', hidden: true }
	    
	    , { key : 'RING_PATH_DIRECTION', width : '140px', title : "RING_PATH_DIRECTION", hidden: true}
	    , { key : 'RING_PATH_SAME_NO', width : '100px', title : 'RING_PATH_SAME_NO', hidden: true }
	    , { key : 'RING_TOPOLOGY_LARGE_CD', width : '100px', title : 'RING_TOPOLOGY_LARGE_CD', hidden: true }
	    , { key : 'RING_TOPOLOGY_SMALL_CD', width : '100px', title : 'RING_TOPOLOGY_SMALL_CD', hidden: true }
	    , { key : 'RING_TRUNK_TOPOLOGY_MEANS_CD', width : '100px', title : 'TRUNK_TOPOLOGY_MEANS_CD', hidden: true }
	    
	    , { key : 'WDM_TRUNK_PATH_DIRECTION', width : '140px', title : "WDM_TRUNK_PATH_DIRECTION", hidden: true}
	    , { key : 'WDM_TRUNK_PATH_SAME_NO', width : '100px', title : 'WDM_TRUNK_PATH_SAME_NO', hidden: true }
	    , { key : 'WDM_TRUNK_TOPOLOGY_LARGE_CD', width : '100px', title : 'WDM_TRUNK_TOPOLOGY_LARGE_CD', hidden: true }
	    , { key : 'WDM_TRUNK_TOPOLOGY_SMALL_CD', width : '100px', title : 'WDM_TRUNK_TOPOLOGY_SMALL_CD', hidden: true }
	    , { key : 'WDM_TRUNK_TRUNK_TOPOLOGY_MEANS_CD', width : '100px', title : 'WDM_TRUNK_TOPOLOGY_MEANS_CD', hidden: true }
	    
	    , { key : 'LEFT_ADD_DROP_TYPE_CD', title : 'LEFT_ADD', width : '100px', hidden: true}		   
	    , { key : 'RIGHT_ADD_DROP_TYPE_CD', title : 'RIGHT_DROP', width : '100px', hidden: true}
	    
	    // 노드 복사, 잘라내기, 붙여넣기 활용 컬럼
	    , { key : 'LEFT_NE_COPY', title : 'LEFT_NE_COPY', width : '100px', hidden: true}
	    , { key : 'RIGHT_NE_COPY', title : 'RIGHT_NE_COPY', width : '100px', hidden: true}
	    
	    // 동일 국사 테두리 활용 컬럼
	    , { key : 'LEFT_ORG_BORDER', title : 'LEFT_ORG_BORDER', width : '100px', hidden: true}
	    , { key : 'RIGHT_ORG_BORDER', title : 'RIGHT_ORG_BORDER', width : '100px', hidden: true}
	    
	    // 가입자망링 오류 데이터 하이라이트 표시를 위한 컬럼
	    , { key : 'ROW_HIGHLIGHT', title : 'ROW_HIGHLIGHT', width : '100px', hidden: true }
	    
	    
	    
	];
	return mappingAddColumn;
}

function renderGrid(gridDiv, data, totalCount, addData){
	var returnMsg = "";	
	// 그리드 컬럼 초기화
	if(gridDiv == mainGridId){
		if (addData != true) {			
			initMainGrid();
		}
		
		returnMsg = cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);
		//$('#'+group).text("("+getNumberFormatDis(totalCount)+")");
	}else {
		initLnoGrid();
	}
	
	if(gridDiv == mainGridId && addData != true){
		$('#'+gridDiv).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return returnMsg} } } );
	}
	
	$('#'+gridDiv).on('gridRefresh');
	//$('#'+gridDiv).alopexGrid("columnFix", 4);
}

function tooltipNetworkText(value, data, mapping){

	var str = '';
	
	if ( mapping.key == 'RING_NM' ) {		
		str = data.RING_NM;
	}
	return str;
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

function trunkStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#F1EBBF';
	} 
	
	return style;
	
}

function ringStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#FFEAEA';
	} 
	
	return style;
	
}

function wdmStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#D6EED6';
	} 
	
	return style;
	
}

function groupingColumnNetworkPath() {
	var grouping = {
			by : [ 'RING_MERGE', 'WDM_TRUNK_MERGE'], 
			useGrouping:true,
			useGroupRowspan:true,
			useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
			useGroupRearrange : true
	};
	
	return grouping;
}

function chkAllowEdit(value, data, mapping, division) {
	if(division === 'ring') {
		allowYn = (data['WDM_TRUNK_MERGE'] == data['WDM_TRUNK_ID']) ? false : true;
	} else if(division == 'trunk') {
		allowYn = (data['RING_MERGE'] === data['RING_ID']) ? false : true;
	} else if(division === 'serviceLine') {
		if(data['TRUNK_MERGE'] === data['TRUNK_ID'] || data['TRUNK_MERGE'] === data['RING_ID'] || data['TRUNK_MERGE'] === data['WDM_TRUNK_ID']) {
			allowYn = false;
		} else {
			if(mapping.key == 'TRUNK_NM' || mapping.key == 'WDM_TRUNK_NM' || mapping.key == 'RING_NM') {
				if((data['LEFT_NE_ID'] != null && data['LEFT_NE_ID'] != 'DV00000000000' )|| (data['RIGHT_NE_ID'] != null && data['RIGHT_NE_ID'] != 'DV00000000000')) {
					allowYn = false;
				} else {
					allowYn = true;
				}
			} else {
				allowYn = true;
			}
		}
	} 
	return allowYn;
}